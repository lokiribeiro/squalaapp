import Userprofiles from '/imports/models/userprofiles.js';

Userprofiles.allow({
    insert(userId, userprofile){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, userprofile, appId){
        // permission to update only to party owner
        return userId && userprofile.appId === userId;
    },
    remove(userId, userprofile){
        // permission to remove only to party owner
        return userId && userprofile.appId === userId;
    },

});

Meteor.publish('userprofiles', function () {
  var selector = null;
  selector = { userID: this.userId
  };
  return Userprofiles.find(selector);
});
