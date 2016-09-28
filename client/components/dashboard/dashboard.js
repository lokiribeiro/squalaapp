import {app} from '/client/app.js';

import Userapps from '/imports/models/userapps.js';

class DashboardCtrl{

  constructor($scope, $timeout, $window, $mdSidenav, $log, $mdDialog, $state, $stateParams){
      'ngInject';

      $scope.userId = Meteor.userId();
      $scope.sort = 1;

      $scope.subscribe('userapps4');

      $scope.helpers({
          userapps() {
            var userID = $scope.userId;
            var sort  = $scope.sort;
            var selector = {userID: userID};
            var modifier = {sort: {appName: sort}};
            var userapps = Userapps.find(selector,modifier);
            console.info('userapps', userapps);
          return userapps;
        },
        totalApps(){
            var userID = Meteor.userId();
            var query = {userID: userID};
            return Userapps.find(query).count();
        },
        currentusers(){
            var userID = Meteor.userId();
            var query = {userID: userID};
            var listahan = Userapps.findOne(query);
            return Userapps.findOne(query);
        }
      });//helpers


      $scope.redirect = function (appName) {
        $state.go(appName, { userID : Meteor.userId(), stateHolder : appName });
      }


    }
}

app.component('dashboard', {
    templateUrl: 'client/components/dashboard/dashboard.html',
    controllerAs: 'dashboard',
    controller: DashboardCtrl
})
