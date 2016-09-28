import Userapps from '/imports/models/userapps.js';

Userapps.allow({
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
        return true;
    },

});

Meteor.publish('userapps4', function () {
  var selector = null;
  selector = { userID: this.userId
  };
  return Userapps.find(selector);
});

Meteor.publish('userapps2', function () {
return Userapps.find();
});


Meteor.publish('userapps', function () {

  return Userapps.find();
});

Meteor.publish('userapps3',  function (selector) {
    if(selector === null){
      selector = {};
    } else {
      selector = {userID: selector};
    }

    return Userapps.find(selector);
});
