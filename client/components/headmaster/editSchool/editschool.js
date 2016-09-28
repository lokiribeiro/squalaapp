import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Branches from '/imports/models/branches.js';
import Roles from '/imports/models/roles.js';

class HeadmasterschoolCtrl{

  constructor($rootScope, $scope, $element, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      console.info('branchID', $rootScope.branchID);
      $scope.branchID = $rootScope.branchID;
      var branchId =   $scope.branchID ;

      $scope.show = false;

      $scope.perPage = 10;
      $scope.page = 1;
      $scope.page2 = 1;
      $scope.sort = 1;
      $scope.searchText = null;
      $scope.searchText2 = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;
      $scope.last = false

      $scope.subscribe('branches', function () {
          return [$scope.getReactively('branchID')];
      });

      $scope.helpers({
          branches() {
                var branchID = $scope.getReactively('branchID');
                var selector = {_id : branchID};
                var branches = Branches.find(selector);
                console.info('branches', branches);
                return branches;
        }
      });//helpers

      $scope.openDialog = function ($event) {
          $scope.userDel = $scope.branchID;
          console.info('userid', $scope.userDel );
          var userDel = $scope.userDel;
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            userDel : $scope.userDel
          },
          controller: function($scope, $mdDialog, userDel){
            $scope.userDel = userDel;
            $scope.deletedNow = false;
            $scope.existing = false;
            $scope.done = false;

            $scope.removeuserNow = function(userDel) {

            $scope.done = true;
            $scope.deletedNow = !$scope.deletedNow;

            Meteor.call('deleteSchoolFromAdmin', userDel, function(err, userDel) {
                      if (err) {
                          //do something with the id : for ex create profile
                          $scope.done = false;
                          $scope.deletedNow = !$scope.deletedNow;
                          $scope.existing = true;
                          window.setTimeout(function(){
                            $scope.$apply();
                        },2000);
                        //UserProfile.insert({
                            //user: userId
                       //})
                     } else {
                       //simulation purposes
                         $scope.deletedNows = !$scope.deletedNows;
                         $scope.done = false;
                         window.setTimeout(function(){
                         $state.go('Headmaster');
                         $scope.$apply();
                       },2000);
                       console.log('mayaooo');
                     }
                  });
              }

              $scope.cancelNow = function() {
                $mdDialog.cancel();
              };


          },
          templateUrl: 'client/components/headmaster/branchschools/delete.html',
          targetEvent: $event
        });
        };

      $scope.addStaff = function($event, branchID) {
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            branchID: $scope.branchID
          },
          transclude: true,
          controller: function($mdDialog, branchID, $scope) {
              $scope.searchTerm = '';
              $scope.userType = 'Non-teaching staff';
              console.info('branchID', branchID);
              $scope.userBrID = '';

              $scope.done = false;
              $scope.existing = false;
              $scope.createdNow = false;
              $scope.createdNows = false;

              $scope.subscribe('users');

              $scope.subscribe('branchesAdmin', function () {
                  return [$scope.getReactively('userBrID')];
              });

              $scope.helpers({
                users(){
                      var sort  = 1;
                      var selector = {};
                      var users = Meteor.users.find(
                            selector, { sort: {name: sort} }
                        );
                      return users;
                  }
              });

              $scope.branchID = branchID;

              $scope.addUsers = function(details) {
                $scope.done = true;
                $scope.createdNow = true;
                var branchId = $scope.branchID ;
                var userType = $scope.userType;
                var max = details.user.length;
                console.info('max', max);

                if(max > 1){
                  for(i=0;i<max;i++){
                    var userID = details.user[i]._id;
                    console.info('userID', userID);
                    var selector = {branches_schooladmin: userID};
                    var branchExist = Branches.find(selector);
                    console.info('branchExist', branchExist);
                    branchExist.forEach(function(branch){
                      var branchList = branch._id;
                      var selector = {_id: branchList};
                      var modifier = {$set: {
                        branches_schooladmin: '',
                        branches_schooladminname: ''
                      }};
                      var removeAdmin = Branches.update(selector,modifier);
                    });
                    //var status = createUserFromAdmin(details);
                    $scope.register = Meteor.call('upsertProfileFromStaff', userID, userType, branchId, function(err, userID) {
                      if (err) {
                         console.log('error here');
                        //do something with the id : for ex create profile
                      } else {
                       console.log('continue next user');
                      }
                    });
                    }
                    window.setTimeout(function(){
                      $scope.$apply();
                    },2000);
                    $scope.createdNows = true;
                    $scope.createdNow = true;
                    $scope.done = false;
                  } else if(max == 1) {
                    $scope.createdNow = !$scope.createdNow;
                    var userID = details.user[0]._id;
                    console.info('userID', userID);
                    var selector = {branches_schooladmin: userID};
                    var branchExist = Branches.find(selector);
                    console.info('branchExist', branchExist);
                    var counterbranch = branchExist.count();
                    console.info('counter', counterbranch );
                    branchExist.forEach(function(branch){
                      var branchList = branch._id;
                      console.info('branchList', branchList);
                      var selector = {_id: branchList};
                      var modifier = {$set: {
                        branches_schooladmin: '',
                        branches_schooladminname: ''
                      }};
                      var removeAdmin = Branches.update(selector,modifier);
                    });
                    //var status = createUserFromAdmin(details);
                    $scope.register = Meteor.call('upsertProfileFromStaff', userID, userType, branchId, function(err, userID) {
                      if (err) {
                        $scope.done = false;
                        $scope.createdNow = !$scope.createdNow;
                        $scope.existing = true;
                        window.setTimeout(function(){
                          $scope.$apply();
                        },2000);
                        //do something with the id : for ex create profile
                      } else {
                        window.setTimeout(function(){
                          $scope.$apply();
                        },2000);
                        $scope.createdNows = true;
                        $scope.createdNow = true;
                        $scope.done = false;
                      }
                    });
                  } else {
                    console.log('nothing to do');
                    $scope.done = false;
                    $scope.createdNow = false;
                  }
                };

              $scope.createAnother = function() {
                $scope.createdNows = !$scope.createdNows;
                $scope.createdNow = !$scope.createdNow;
                //$scope.createdNow = '1';
              }

              $scope.clearSearchTerm = function() {
                $scope.searchTerm = '';
              };

              $scope.closeDialog = function() {
                $mdDialog.hide();
                //$scope.createdNow = '1';
              }

              $element.find('input').on('keydown', function(ev) {
                ev.stopPropagation();
              });
          },
          templateUrl: 'client/components/headmaster/schoolUsers/addUser/adduser.html',
          targetEvent: $event
        });
      }

    

    }
}

app.component('headmasterschool', {
    templateUrl: 'client/components/headmaster/editSchool/editschool.html',
    controllerAs: 'headmasterschool',
    controller: HeadmasterschoolCtrl
})
