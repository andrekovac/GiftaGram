Images = new Mongo.Collection("images");
Alchemy = new Mongo.Collection("alchemy");

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
    }
  });

  Template.body.events({
    "submit .findGift": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var instagramUser = event.target.instagram_user.value;

      Meteor.call("callInstagram", function(error, results) {

        console.log(results.content); //results.data should be a JSON object
        var images = results.data.data;

        // Insert image urls to the collection using underscore.js
        _.each(images, function(image) {
          Images.insert({
            url: image.images.standard_resolution.url,
            lastViewedAt: new Date() // current time
          });
        });

      });



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
    callInstagram: function () {
      this.unblock();
      return Meteor.http.call("GET", "https://api.instagram.com/v1/users/self/media/recent/?access_token=***REMOVED***");
    }
  });

}
