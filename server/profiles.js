import Profiles from '/imports/models/profiles.js';

Profiles.allow({
    insert(userId, profile){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, profile, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, profile){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('profiles', function (selector) {
    if(selector === null){
      selector = {};
    } else if(typeof selector === 'string' && selector.length){
        var searchString = {$regex: `.*${selector}.*`, $options: 'i'}
        selector = { profiles_firstname: searchString };
        //return Meteor.users.find(selector);
    } else {
      selector = {profiles_userID: selector};
    }

    return Profiles.find(selector);
});

Meteor.publish('profiles2', function (selector) {
    if(selector === null){
      selector = {};
    } else {
      selector = {profiles_userID: selector};
    }

    return Profiles.find(selector);
});

Meteor.publish('profilesUser', function () {
  var selector = null;
  selector = { profiles_userID: this.userId
  };
  return Profiles.find(selector);
});

Meteor.publish('profilesMain', function (branchID) {
    var selector = {profiles_branchID: branchID};
    return Profiles.find(selector);
});


Meteor.publish('profilesStaff', function (searchText) {
  var selector = null;
  var type = 'Non-teaching staff';
    if(typeof searchText === 'string' && searchText.length){
        var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
        selector = {profiles_firstname: searchString, $and: [
          { profiles_type: type}
        ]};
        //return Meteor.users.find(selector);
    } else {
      selector =  {profiles_type: type};
    }
    return Profiles.find(selector);
});

Meteor.publish('profilesTeacher', function (searchText) {
  var selector = null;
  var type = 'Teacher';
    if(typeof searchText === 'string' && searchText.length){
        var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
        selector = {profiles_firstname: searchString, $and: [
          { profiles_type: type}
        ]};
        //return Meteor.users.find(selector);
    } else {
      selector =  {profiles_type: type};
    }
    return Profiles.find(selector);
});

Meteor.publish('profilesStudent', function (searchText) {
  var selector = null;
  var type = 'Student';
    if(typeof searchText === 'string' && searchText.length){
        var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
        selector = {profiles_firstname: searchString, $and: [
          { profiles_type: type}
        ]};
        //return Meteor.users.find(selector);
    } else {
      selector =  {profiles_type: type};
    }
    return Profiles.find(selector);
});

Meteor.publish('profilesParent', function (searchText) {
  var selector = null;
  var type = 'Parent';
    if(typeof searchText === 'string' && searchText.length){
        var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
        selector = {profiles_firstname: searchString, $and: [
          { profiles_type: type}
        ]};
        //return Meteor.users.find(selector);
    } else {
      selector =  {profiles_type: type};
    }
    return Profiles.find(selector);
});

Meteor.publish('profilesUnsorted', function (searchText) {
  var selector = null;
  var type = null;
    if(typeof searchText === 'string' && searchText.length){
        var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
        selector = {profiles_firstname: searchString, $and: [
          { profiles_type: type}
        ]};
        //return Meteor.users.find(selector);
    } else {
      selector =  {profiles_type: type};
    }
    return Profiles.find(selector);
});

Meteor.methods({

    upsertProfileFromAdmin(profileID, branchID, branchName, userType){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
        profiles_branchID: branchID,
        profiles_branch: branchName,
        profiles_type: userType
      }};
      var userUpsert = Profiles.upsert(selector, modifier);
      return userUpsert;
    },
    upsertProfileFromRole(profileID, roleId){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
        profiles_userroleID: roleId
      }};
      var roleUpsert = Profiles.upsert(selector, modifier);
      return roleUpsert;

    },
    upsertProfileFromRole(profileID, feesId, feesName){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
        profiles_feesID: feesId,
        profile_feesName: feesName
      }};
      var roleUpsert = Profiles.upsert(selector, modifier);
      return roleUpsert;

    },
    unassignProfileFromRole(profileID, roleId){
      var selector = {_id: profileID};
      var modifier = {$set: {
        profiles_userroleID: roleId
      }};
      var roleUpsert = Profiles.upsert(selector, modifier);
      return roleUpsert;
    },
    upsertProfileFromStaff(profileID, userType, branchId){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
        profiles_branchID: branchId,
        profiles_type: userType
      }};
      var typeUpsert = Profiles.upsert(selector, modifier);
      return typeUpsert;
    },
    upsertProfileFromSort(profileID, userType){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
        profiles_type: userType
      }};
      var typeUpsert = Profiles.upsert(selector, modifier);
      return typeUpsert;
    }


})
