Images = new Mongo.Collection("images");
Keywords = new Mongo.Collection("keywords");

if (Meteor.isClient) {

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  // This code only runs on the client
  Template.body.helpers({
    images: function () {
      return Images.find({});
    },
    keywords: function() {
      return Keywords.find({});
    }
  });

  Template.body.events({
    "submit .findGift": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var instagramUser = event.target.instagram_user.value;
      var access_token = "***REMOVED***";
      Meteor.call("callInstagram", access_token, function(error, results) {

        console.log(results.content); //results.data should be a JSON object
        var images = results.data.data;

        // Save images as Session variable
        Session.set('images', images);

        _.each(images, function(image, index) {
          // Insert image urls to the collection using underscore.js
          var image_url = image.images.standard_resolution.url;
          Images.insert({
            url: image_url,
            lastViewedAt: new Date() // current time
          });

          var apikey = "55a3d2c3ad217beb7bb1f40528b28abbc195e694";
          Meteor.call("callAlchemy", apikey, image_url, function(error, results) {
            console.log(results.data);

            Keywords.insert({
              keywords: results.data.imageKeywords,
              image_id: index
            });

          });

        });

      });  // end of Meteor.call

      // Clear form
      event.target.instagram_user.value = "";
    }
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
