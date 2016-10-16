import {app} from '/client/app.js';

import Userapps from '/imports/models/userapps.js';

class DashboardCtrl{

  constructor($scope, $timeout, $window, $mdSidenav, $log, $mdDialog, $state, $stateParams){
      'ngInject';

      /*angular.element(document).ready(function () {
          $scope.userDetails = Meteor.userId();
          var verified = Meteor.user();
          var emailVerified = verified.emails.verified;
          console.info('emailVerified', verified);
          if (!emailVerified) {
            $mdDialog.show({
              clickOutsideToClose: false,
              escapeToClose: false,
              transclude: true,
              locals: {
                userDetails: $scope.userDetails
              },
              controller: function($mdDialog, userDetails, $scope) {
                  $scope.userDetails = userDetails;

                  $scope.removeNow = function() {
                      var userID = $scope.passedId;

                      $scope.done = true;
                      $scope.existing = false;
                      $scope.createdNow = !$scope.createdNow;
                      //var status = createUserFromAdmin(details);

                      Meteor.call('sendVerificationLink', userID, function(err, detail) {
                        if (err) {
                          $scope.createdNows = !$scope.createdNows;
                          $scope.done = false;
                          //delete old apps
                          window.setTimeout(function(){
                            $scope.$apply();
                          },2000);
                            //do something with the id : for ex create profile
                          } else {
                            $scope.done = false;
                            $scope.createdNow = !$scope.createdNow;
                            $scope.existing = true;
                            window.setTimeout(function(){
                              $scope.$apply();
                            },2000);

                          }
                      });
                    }

                    $scope.closeDialog = function() {
                      $mdDialog.cancel();
                    };
                  },
                  templateUrl: 'client/components/admissions/removeDialogs/deleteapplicant.html',
                  targetEvent: $event
                });
              }
      });*/

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
