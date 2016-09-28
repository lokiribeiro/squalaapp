import Headmasters from '/imports/models/headmasters.js';

Headmasters.allow({
    insert(userId, headmaster){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, headmaster, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, headmaster){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('headmasters', function () {

  return Headmasters.find();
});


Meteor.methods({

upsertHeadmasterFromAdmin(schoolId, schoolDetails){
  var selector = {profiles_userID: profileID};
  var modifier = {$set: {
    profiles_branchID: branchID,
    profiles_branch: branchName
  }};
  var userUpsert = Profiles.upsert(selector, modifier);
  return userUpsert;
}

})
