//import Users from '/imports/models/users.js';
Meteor.users.allow({
    insert(userId, user){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, user, fieldNames, modifier){
        //// permission to update only to party owner
        return true;
    },
    remove(userId, user){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('users', function (searchText) {
  var selector = null;
  if(typeof searchText === 'string' && searchText.length){
      var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
      selector = { name: searchString };
      //return Meteor.users.find(selector);
  }else{
    selector = {};

  }
  return Meteor.users.find(selector);
});


Meteor.methods({

          createUserFromAdmin(username, email, password){
                var user = Accounts.createUser({email:email, username:username, password:password});
                return user;
            },
            deleteUserFromAdmin(userDel){
              Meteor.users.remove({_id: userDel});
            },
            upsertUserFromAdmin(userID, userFirstname){
              var selector = {_id: userID};
              var modifier = {$set: {
                name: userFirstname
              }};
              var userUpsert = Meteor.users.upsert(selector, modifier);
              return userUpsert;
            },
            upsertNewRoleFromAdmin(userID, userRole){
              var selector = {_id: userID};
              var modifier = {$set: {
                role: userRole
              }};
              var roleUpsert = Meteor.users.upsert(selector, modifier);
              return roleUpsert;
            },
            upsertNewBranchFromAdmin(userID, userBranch){
              var selector = {_id: userID};
              var modifier = {$set: {
                branchId: userBranch
              }};
              var branchUpsert = Meteor.users.upsert(selector, modifier);
              return branchUpsert;
            }
})
