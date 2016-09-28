import {app} from '/client/app.js'
import uninvitedFilter from '/imports/filters/univitedFilter.js'

app.component('partyUninvited', {

    templateUrl: 'client/components/partyUninvited/partyUninvited.html',

    bindings: {party: '<'},

    controller: class PartyUninvitedCtrl{
        constructor($scope){
            'ngInject';

            $scope.subscribe('users');

            $scope.helpers({
                users(){
                    return Meteor.users.find();
                }
            });

            $scope.invite = function (user, party) {
                if (!party || !user._id){
                    throw new Meteor.Error('No party or user');
                }
                if(!party.invitedUsers){
                    party.invitedUsers = [];
                }
                if(party.public){
                    alert('Public party. Only can invite users to private parties');
                    return;
                }
                Meteor.call('invite', user, party, function (error) {
                    if(error){
                        alert(error);
                        throw new Meteor.Error(error);
                    };
                    alert('User '+user.emails[0].address+' invited to party '+party.name);
                });
            }
        }
    }
})
