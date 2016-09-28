import {app} from '/client/app.js';
import Parties from '/imports/models/parties.js'

class PartyAddCtrl {

    constructor($scope){
        'ngInject';

        $scope.insertParty = function ( party ) {
            if(!party)
                throw new Meteor.Error('No party data');
            if(party.public == null)
                party.public = true;

            party.ownerId = Meteor.userId();
            party.ownerEmail = Meteor.user().emails[0].address;
            party.createdAt = new Date();
            party.invitedUsers = [];
            party.location = null;
            Parties.insert(party);
            party.name = null;
            party.description = null;
        };
    }
}

app.component('partyAdd', {
   templateUrl: 'client/components/partyAdd/partyAdd.html',
    controller: PartyAddCtrl
});