import Roles from '/imports/models/roles.js';

Roles.allow({
    insert(userId, role){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, role, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, role){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('roles', function (searchText) {
  var selector = null;
  if(typeof searchText === 'string' && searchText.length){
      var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
      selector = { role: searchString };
  }else{
    selector = {};

  }
  return Roles.find(selector);
});

Meteor.publish('roles2', function () {
  //var profileID = search;
  var selector = {};

  return Roles.find(selector);
});

Meteor.methods({

upsertRoleFromAdmin(roleName, roleDel){
  var selector = {_id: roleDel};
  var modifier = {$set: {role: roleName}};
  var userUpsert = Roles.update(selector, modifier);
  return userUpsert;
}
})
