import Gradelevels from '/imports/models/gradelevels.js';

Gradelevels.allow({
    insert(userId, gradelevel){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, gradelevel, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, gradelevel){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('gradelevels', function () {
  //var profileID = search;
  var selector = {};

  return Gradelevels.find(selector);
});
