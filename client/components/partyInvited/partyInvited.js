import {app} from '/client/app.js';

app.component('partyInvited', {

    templateUrl: 'client/components/partyInvited/partyInvited.html',

    bindings: {party: '<'},

    controller: class {
        constructor($scope){
            'ngInject';

            $scope.uninvite = function (userId, party) {
                if(!userId || !party){
                    throw new Meteor.Error("Party or user do not exist");
                }
                Meteor.call('uninvite', userId, party, function (error) {
                    if(error){
                        throw new Meteor.Error(error);
                    }
                });
            }
        }
    }
});