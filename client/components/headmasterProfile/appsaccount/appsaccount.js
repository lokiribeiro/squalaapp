import {app} from '/client/app.js';

import Userapps from '/imports/models/userapps.js';


class AppsaccountCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      console.info('profileID', $rootScope.profileID);
      $scope.profileID = $rootScope.profileID;

      $scope.subscribe('userapps3', function () {
          return [$scope.getReactively('profileID')];
      });

      $scope.helpers({
          userapps() {
                var profileID = $scope.getReactively('profileID');
                var selector = {userID : profileID};
                var userapps = Userapps.find(selector);
                console.info('userapps', userapps);
                return userapps;
              },
          totalUserapps(){
                var profileID = $scope.getReactively('profileID');
                var selector = {userID : profileID};
                var totalUserapps = Userapps.find(selector).count();
                return totalUserapps;
          }
      });//helpers
    }
}

app.component('appsaccount', {
    templateUrl: 'client/components/headmasterProfile/appsaccount/appsaccount.html',
    controllerAs: 'appsaccount',
    controller: AppsaccountCtrl
})
