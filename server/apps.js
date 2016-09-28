import Apps from '/imports/models/apps.js';

Apps.allow({
    insert(userId, userapp){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, userapp, appId){
        // permission to update only to party owner
        return userId && userapp.appId === userId;
    },
    remove(userId, userapp){
        // permission to remove only to party owner
        return userId && userapp.appId === userId;
    },

});

Meteor.publish('apps', function () {
  return Apps.find();
});
