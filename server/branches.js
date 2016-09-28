import Branches from '/imports/models/branches.js';

Branches.allow({
    insert(userId, branch){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, branch, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, branch){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('branches', function (searchText) {
  var selector = null;
  if(typeof searchText === 'string' && searchText.length){
      var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
      selector = { $or: [
        {branch_name: searchString},
        {_id: searchString}
      ] };
      //return Meteor.users.find(selector);
  }else{
    selector = {};
  }
  return Branches.find(selector);
});

Meteor.publish('branchesProfile', function (searchText) {
  var selector = null;
  if(typeof searchText === 'string' && searchText.length){
      var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
      selector = { _id: searchString};
      //return Meteor.users.find(selector);
  }else{
    selector = searchText;
  }
  return Branches.find(selector);
});

Meteor.publish('branchesAdmin', function () {
  var branchUser =  Branches.find();
  return branchUser;
});

Meteor.publish('branchesSchool', function (query) {
  var selector = query;
  return Branches.find(selector);  
});

Meteor.methods({
            deleteSchoolFromAdmin(userDel){
              Branches.remove({_id: userDel});
            }
})
