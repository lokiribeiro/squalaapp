import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Branches from '/imports/models/branches.js';
import Roles from '/imports/models/roles.js';

class SchedulerCtrl{

  constructor($scope, $timeout, $window, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, $rootScope, $document){
      'ngInject';

      $scope.thisUser = Meteor.userId();

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.sort = 1;

      $scope.subscribe('profilesUser', function () {
          return [$scope.getReactively('thisUser')];
      });

      $scope.subscribe('branchesProfile', function () {
          return [$scope.getReactively('subBranchID')];
      });

      $scope.subscribe('roles2', function () {
          return [$scope.getReactively('rolesID')];
      });

      $scope.helpers({
          profiles(){
            //var sort = 1;
            //var selector = {};
            //var modifier= {sort: {profiles_firstname: sort}};
            var thisUser = $scope.getReactively('thisUser');
            var selector = {profiles_userID: thisUser};
            var profiles = Profiles.find(selector);
            var count = profiles.count();
            console.info('profiles', profiles);
            console.info('count', count);
            return profiles;
          },
          totalProfiles(){
            var branchID = $scope.branchID;
            var type = 'Parent';
            var selector = {profiles_branchID: branchID, $and: [{profiles_type: type}]};
            var profiles = Profiles.find(selector);
            var count = profiles.count();
            return count;
          },
          branches(){
            var branchID = $scope.branchID;
            var branches = Branches.find(branchID);
            return branches;
          },
          roles() {
            return Roles.find();
          }

      })//helpers

      angular.element(document).ready(function () {
        //$window.loading_screen.finish();

        $scope.promise = $timeout(function(){
          var userDetails = Meteor.userId();
          var selector = {profiles_userID: userDetails};
          var profileDetails = Profiles.find(selector);
          var count = profileDetails.count();

          profileDetails.forEach(function(profileDetail){
            $scope.firstname = profileDetail.profiles_firstname;
            $scope.lastname = profileDetail.profiles_lastname;
            $scope.branchName = profileDetail.profiles_branch;
          });

          var toasted = $scope.branchName + ': Hi ' + $scope.firstname + ' ' + $scope.lastname + '!';
          var pinTo = $scope.getToastPosition();

          $mdToast.show(
            $mdToast.simple()
            .textContent(toasted)
            .position(pinTo )
            .hideDelay(3000)
            .theme('Scheduler')
          );
        }, 2000);
      });

      $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
      };

      $scope.toastPosition = angular.extend({},last);

      function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }


    }
}

app.component('scheduler', {
    templateUrl: 'client/components/scheduler/scheduler.html',
    controllerAs: 'scheduler',
    controller: SchedulerCtrl
})
