import Classes from '/imports/models/classes.js';


Meteor.publish('classes', function () {
  var selector = null;
  selector = { classes_userID: this.userId
  };
  return Classes.find(selector);
});
