import {app} from '/client/app.js'

app.component('partyRsvp', {

    templateUrl: 'client/components/partyRsvp/partyRsvp.html',

    bindings: {party: '<'},

    controller: class {
       constructor($scope){
           'ngInject';

           $scope.going = function (party) {
               if(!party || !party.invitedUsers){
                   var msg = 'Party or user do  not exists';
                   throw new Meteor.Error(msg);
                   alert(msg);
                   return;
               }
               Meteor.call('acceptInvitation', Meteor.userId(), party, function (error) {
                   if (error){
                       throw new Meteor.Error('Error acepting invitation');
                       alert('Error acepting invitation');
                   };
               });
               alert('Invitation to private party '+ party.name+' accepted by user '+ Meteor.user().emails[0].address);
           };

           $scope.notGoing = function (party) {
               if(!party || !party.invitedUsers){
                   var msg = 'Party or user do  not exists';
                   throw new Meteor.Error(msg);
                   alert(msg);
                   return;
               }
               Meteor.call('denyInvitation', Meteor.userId(), party, function (error) {
                   if (error){
                       throw new Meteor.Error('Error denying invitation');
                       alert('Error denying invitation');
                   };
               });
               alert('Invitation to private party '+ party.name+' denied by user '+ Meteor.user().emails[0].address);
           }

           $scope.isRsvpResponded = function (party) {
               var invitedUser = _.findWhere(party.invitedUsers, {userId: Meteor.userId()});
               return invitedUser.responded;

           }

           $scope.userAssistance = function (party) {
               var invitedUser = _.findWhere(party.invitedUsers, {userId: Meteor.userId()});
               return invitedUser.assistance;
           }

       }
   }
});