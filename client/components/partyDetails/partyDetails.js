import {app} from '/client/app.js';

app.component('partyDetails', {

    templateUrl: 'client/components/partyDetails/partyDetails.html',

    controller: class {
        constructor($scope, $stateParams, $state){
            'ngInject';

            $scope.subscribe('parties');

            $scope.helpers({
                party: function () {
                    return Parties.findOne($stateParams.partyId);
                }
            });

            $scope.updateParty = function (party) {
                if(!party.location || angular.equals(party.location, {})){
                    alert('Location required. Click on the map to set location point');
                    return;
                };
                var selector = {_id: party._id};
                var modifier = {$set: {
                    name: party.name,
                    description: party.description,
                    public: party.public,
                    location: party.location
                }};
                Parties.update( selector, modifier, function (error, rows) {
                    if(error){
                        throw new Meteor.Error(error);
                    }else if(!confirm('Party saved\nContinue in this page [OK]\nReturn to parties list [CANCEL]')){
                        $state.go('parties');
                    }
                });

            }
        }
    }
});
