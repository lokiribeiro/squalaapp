import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Branches from '/imports/models/branches.js';
import Roles from '/imports/models/roles.js';

class SchoolteachersCtrl{

  constructor($scope, $timeout, $mdSidenav, $element, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';

      $scope.rolesID = null;

      $scope.selected3 = [];
      $scope.branchID = $rootScope.branchID;
      $scope.subBranchID = $rootScope.branchID;
      console.info('branch', $scope.branchID );
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
      $scope.last = false;

      $scope.sort2 = 1;
      $scope.enabled = [];
      $scope.installed = [];

      $scope.subscribe('profilesTeacher', function () {
          return [$scope.getReactively('searchText')];
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
            var branchID = $scope.branchID;
            var type = 'Teacher';
            var selector = {profiles_branchID: branchID, $and: [{profiles_type: type}]};
            var profiles = Profiles.find(selector);
            var count = profiles.count();
            console.info('profiles', profiles);
            console.info('count', count);
            return profiles;
          },
          totalProfiles(){
            var branchID = $scope.branchID;
            var type = 'Teacher';
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

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.toastPosition = angular.extend({},last);

      $scope.openProfile2 = function (selected3) {
        console.info('selected:', selected3[0].profiles_userID);
        var profileID = selected3[0].profiles_userID;
        $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      }

      $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
      };

      function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }

      $scope.pageChange = function (newPageNumber) {
          $scope.page = newPageNumber;
      };

      $scope.showMore = function () {
          $scope.show = !$scope.show;
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
              $scope.userType = 'Teacher';
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
                      var userRole = $rootScope.userLoggedInRole;
                      console.log(userRole);

                      if(userRole == 'admin'){
                          selector = {branchId: branchID};
                      }

                      var users = Meteor.users.find(
                            selector, { sort: {name: sort} }
                      );
                      console.log('dumaan sa superadmin');
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

      $scope.removeUser = function($event, item) {
        // Show the dialog
        console.info('unassign', item[0].profiles_userID);
        $scope.passedId = item[0].profiles_userID;
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            passedId: $scope.passedId
          },
          transclude: true,
          controller: function($mdDialog, passedId, $scope) {
              $scope.passedId = passedId;

              $scope.removeNow = function() {
                  var userID = $scope.passedId;
                  var userType = '';
                  var branchId = '';

                  $scope.done = true;
                  $scope.existing = false;
                  $scope.createdNow = !$scope.createdNow;
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
                      $scope.createdNows = !$scope.createdNows;
                      $scope.done = false;
                      $scope.selected3 = '';
                      //delete old apps
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
              templateUrl: 'client/components/headmaster/schoolUsers/removeUser/removeuser.html',
              targetEvent: $event
            });
          }




      $scope.filterShow = function(){
        $scope.filter.show = !$scope.filter.show;
      }

      $scope.changeSort = function () {
          $scope.sort = parseInt($scope.sort*-1);
      }

      $scope.closeFilter = function(){
        $scope.filter.show = !$scope.filter.show;
        $scope.selected3 = [];
        $scope.searchText = null;
      }


      $scope.$watch('searchText', function (newValue, oldValue) {
        if(!oldValue) {
          bookmark = $scope.page;
        }

        if(newValue !== oldValue) {
          $scope.page = 1;
        }

        if(!newValue) {
          $scope.page = bookmark;
        }
      });


        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };
          //$state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('schoolteachers', {
    templateUrl: 'client/components/headmaster/schoolUsers/teachers/teachers.html',
    controllerAs: 'schoolteachers',
    controller: SchoolteachersCtrl,
    transclude: true
})
