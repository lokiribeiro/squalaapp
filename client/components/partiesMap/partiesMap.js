import {app} from '/client/app.js';
import Parties from '/imports/models/parties.js';

app.component('partiesMap', {

    templateUrl: 'client/components/partiesMap/partiesMap.html',

    controller: class{

        constructor($scope){
            'ngInject';
            $scope.helpers({
                // show all parties of the subscription, not only parties in actual page
                partiesInMap: function(){
                    return Parties.find();
                }
            })

        }

    }
});