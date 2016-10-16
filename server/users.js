import { Email } from 'meteor/email';
import { check } from 'meteor/check';

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

Accounts.emailTemplates.siteName = "TLP Los Banos";
Accounts.emailTemplates.from     = "Admin <admin@tlplbinternational.com>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "[The Learning Place] Verify Your Email Address";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "support@tlplbinternational.com",
        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
  }
};

Meteor.publish('users', function (searchText) {
  var selector = null;
  if(typeof searchText === 'string' && searchText.length){
      var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
      selector = { username: searchString };
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
            upsertUserFromAdmissions(userID, userFirstname, branchID, userRole){
              var selector = {_id: userID};
              var modifier = {$set: {
                name: userFirstname,
                branchId: branchID,
                role: userRole
              }};
              var user2Upsert = Meteor.users.upsert(selector, modifier);
              return user2Upsert;
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
            },
            /*sendVerificationLink(userID) {
              var userId = userID;
              if ( userId ) {
                return Accounts.sendVerificationEmail( userId );
              }
            },*/
            sendEmail(to, from, subject, text) {
              check([to, from, subject, text], [String]);
              // Let other method calls from the same client start running,
              // without waiting for the email sending to complete.
              this.unblock();
              Email.send({
                to: to,
                from: from,
                subject: subject,
                text: text
              });
            }
})
