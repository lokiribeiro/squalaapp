import {app} from '/client/app.js';
import Parties from '/imports/models/parties.js';

class PartiesListCtrl{

  constructor($scope, $mdDialog){
      'ngInject';

      $scope.perPage = 1;
      $scope.page = 1;
      $scope.sort = -1;
      $scope.searchText = null;
      $scope.state = 'parties';
      $scope.partyID = null;

      $scope.subscribe('parties', function () {
          return [$scope.getReactively('searchText')];
      });

      $scope.helpers({
          parties() {
              var limit = parseInt( $scope.perPage );
              var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
              var sort  = $scope.getReactively('sort');
              var selector = {};
              var parties = Parties.find(
                  selector, { limit: limit, skip: skip, sort: {createdAt: sort} }
              );
              return parties;
          },
          totalParties(){
              return Parties.find().count();
          }
      });//helpers

      $scope.removeParty = function (PartyId) {
          Parties.remove({_id: PartyId});
      }

      $scope.pageChange = function (newPageNumber) {
          $scope.page = newPageNumber;
      };

      $scope.navigateTo = function(partyname, partydesc, event) {
    $mdDialog.show(
      $mdDialog.confirm()
        .title(partyname)
        .textContent('Description: ' + partydesc)
        .ariaLabel('Navigation demo')
        .ok('Done')
        .cancel('Cancel')
        .targetEvent(event)
    );
  };

  }
};

app.component('partiesList', {
    templateUrl: 'client/components/partiesList/partiesList.html',
    controller: PartiesListCtrl
})
