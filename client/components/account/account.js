import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Roles from '/imports/models/roles.js'



class AccountCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.profileID = $rootScope.profileID;
      $scope.rolesID = null;
      $scope.branchID = '';

      $scope.subscribe('profiles', function () {
          return [$scope.getReactively('profileID')];
      });

      $scope.subscribe('roles2', function () {
          return [$scope.getReactively('rolesID')];
      });

      $scope.subscribe('branches', function () {
          return [$scope.getReactively('branchID')];
      });

      $scope.subscribe('users');

      $scope.helpers({
          profiles() {
                var profileID = $scope.getReactively('profileID');
                var selector = {profiles_userID : profileID};
                var profiles = Profiles.find(selector);
                console.info('profiles', profiles);
                return profiles;
        },
        profile : function(){
          return Profiles.findOne($rootScope.profileID);
        },
        roles() {
          return Roles.find();
        },
        branches(){
          var profileID = $scope.getReactively('profileID');
          var selector = {profiles_userID : profileID};
          var profiles = Profiles.find(selector);
          var proNum = profiles.count();
          console.info('pronum', proNum);
          var branch = '';
          profiles.forEach(function(profile) {
            branch = profile.profiles_branchID;
          });
          console.info('branch', branch);
          selector = {_id: branch}
          var branches =  Branches.find(branch);
          console.info('branches', branches);
          var counter = branches.count();
          console.log(counter);
          return branches;
        }
      });//helpers

      $scope.openDialog = function ($event) {
          console.info('userID', $scope.profileID);
          var profileID = $scope.profileID;
          var selector = {profiles_userID: profileID};
          $scope.results = Profiles.findOne(selector);
          console.info('profiles', $scope.results);
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            profileID : $scope.profileID,
            results : $scope.results
          },
          controller: function($scope, $mdDialog, results, profileID){
            $scope.profileID = profileID;
            $scope.results = results;
            $scope.updatedNow = false;
            $scope.updatedNows = false;
            $scope.done = false;

            $scope.cancelNow = function() {
              $mdDialog.cancel();
            }

            $scope.updateUser = function(results) {
              $scope.done = true;
              $scope.updatedNow = true;
              console.log('daan dito')
              $scope.resultsphone = results;
              console.info('ressulta', $scope.resultsphone);
              var selector = {_id: results._id};
              var modifier = {$set: {
                  profiles_firstname: results.profiles_firstname,
                  profiles_lastname: results.profiles_lastname,
                  profiles_email: results.profiles_email,
                  profiles_phone: results.profiles_phone,
                  profiles_birthday: results.profiles_birthday,
                  profiles_gender: results.profiles_gender
              }};

              Profiles.update( selector, modifier, function (error, rows) {
                  if(error){
                    $scope.updatedNow = false;
                    $scope.done = false;
                    window.setTimeout(function(){
                      $scope.$apply();
                  },2000);
                    console.log('daan error')
                      throw new Meteor.Error(error);
                  }else {
                    console.log('daan update')
                    $scope.updatedNow = true;
                    $scope.updatedNows = true;
                    $scope.done = false;
                    window.setTimeout(function(){
                      $scope.$apply();
                  },2000);
                  }
              });
            }


          },
          templateUrl: 'client/components/account/editaccount.html',
          targetEvent: $event
        });
        };
    }
}

app.component('account', {
    templateUrl: 'client/components/account/account.html',
    controllerAs: 'account',
    controller: AccountCtrl
})
