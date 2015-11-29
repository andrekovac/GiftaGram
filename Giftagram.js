Images = new Mongo.Collection("images");

Router.route('/', function () {
  this.render('main');
});

Router.route('/test', function () {
  this.render('test');
});

if (Meteor.isClient) {
  // This code only runs on the client
  Template.main.helpers({
    images: function () {
      return Images.find({});
    }
  });

  Template.main.events({
    "submit .findGift": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var instagramUser = event.target.instagram_user.value;
      var access_token = "***REMOVED***"; // Account of Felix - change!
      Meteor.call("callInstagram", access_token, function(error, results) {

        console.log(results.content); //results.data should be a JSON object
        var images = results.data.data;

        // Save images as Session variable
        Session.set('images', {images: images});

        _.each(images, function(image, index) {
          // Insert image urls to the collection using underscore.js
          var image_url = image.images.standard_resolution.url;

          Images.insert({
            url: image_url,
            lastViewedAt: new Date(), // current time
            owner: Meteor.userId(),           // _id of logged in user
            username: Meteor.user().username  // username of logged in user
          }, function(err,docsInserted){
            console.log(docsInserted);

            //var apikey = "55a3d2c3ad217beb7bb1f40528b28abbc195e694";
            var apikey = "2fa8b7cf52d8cdc27bcdd82a4dc22948e13cc69a";
            Meteor.call("callAlchemy", apikey, image_url, function(error, results) {
              console.log(results.data);

              Images.update({"_id": docsInserted}, { $set: {
                keywords: results.data.imageKeywords,
                image_id: index
              }});
            });
          }

          );

        });

      });  // end of Meteor.call

      // Clear form
      //event.target.instagram_user.value = "";
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    callInstagram: function (access_token) {
      this.unblock();
      return Meteor.http.call(
          "GET",
          //"https://api.instagram.com/v1/users/self/media/recent/?access_token=***REMOVED***",
          "https://api.instagram.com/v1/users/self/media/recent/",
          { params: { "access_token": access_token } });
    },
    callAlchemy: function(apikey, image_url) {
      this.unblock();
      return Meteor.http.call(
          "GET",
          "http://gateway-a.watsonplatform.net/calls/url/URLGetRankedImageKeywords",
          { params: {
            "apikey": apikey,
            "url": image_url,
            "outputMode": "json"
          }}
      );
    }
  });

}
