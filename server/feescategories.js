import Feescategories from '/imports/models/feescategories.js';

Feescategories.allow({
    insert(userId, feescategory){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, feescategory, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, feescategory){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('feescategories', function (searchText) {
  var selector = null;
  if(typeof searchText === 'string' && searchText.length){
      var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
      selector = { category: searchString };
  }else{
    selector = {};

  }
  return Feescategories.find(selector);
});

Meteor.publish('feescategories2', function () {
  //var profileID = search;
  var selector = {};

  return Feescategories.find(selector);
});

Meteor.publish('feescategoriesauto', function (searchText) {
  var selector = null;
    if(typeof searchText === 'string' && searchText.length){
        var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
        selector = {code: searchString}
        //return Meteor.users.find(selector);
    } else {
      selector =  {};
    }
    return Feescategories.find(selector);
});

Meteor.publish('feescategoriesautoFILL', function (searchText) {
  var selector = null;
    if(typeof searchText === 'string' && searchText.length){
        var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
        selector = {code: searchString, $or: [
          { feesName: searchString}
        ]};
        //return Meteor.users.find(selector);
    } else {
      selector =  {};
    }
    return Feescategories.find(selector);
});

Meteor.methods({

upsertFeesFromCollect(feesName, feesID){
  var selector = {_id: feesID};
  var modifier = {$set: {feesName: feesName}};
  var userUpsert = Feescategories.update(selector, modifier);
  return userUpsert;
},
upsertStudentToFees(studentID, userPhoto, userBranch, userBranchID, userName, feesID){
  var selector = {_id: feesID};
  var modifier = {$push: {students: {studentID: studentID, studentName: userName, userPhoto : userPhoto, userBranch : userBranch, userBranchID : userBranchID }}}
  var userUpsert = Feescategories.update(selector, modifier);
  return userUpsert;
}
})
