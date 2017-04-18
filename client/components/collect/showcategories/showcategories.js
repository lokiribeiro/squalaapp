import {app} from '/client/app.js';

import Feescategories from '/imports/models/feescategories.js';
import Profiles from '/imports/models/profiles.js';
import Applicants from '/imports/models/applicants.js';
//import Images from '/imports/models/images.js';
import ngFileUpload from 'ng-file-upload';


//import Users from '/imports/models/users.js';

class ShowcategoriesCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, Upload){
      'ngInject';

      $scope.selected = {
        feesName: '',
        desc: {
          info: '',
          discount: ''
        }
      };

      $scope.selected2 = [];

      $scope.show = true;

      $scope.perPage = 5;
      $scope.perPage2 = 5;
      $scope.page = 1;
      $scope.page2 = 1;
      $scope.sort = 1;
      $scope.sort3 = 1;
      $scope.searchText = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;
      $scope.last = false;

      $scope.sort2 = 1;
      $scope.enabled = [];
      $scope.installed = [];

      $scope.subscribe('feescategories');
      $scope.subscribe('profiles', function () {
          $scope.promise = $timeout(function(){

          }, 2000);
          return [$scope.getReactively('searchText')];
      });
      $scope.subscribe('usersStudent');


      $scope.helpers({
          feescategories() {
                var limit = parseInt($scope.getReactively('perPage2'));
                var skip  = parseInt(( $scope.getReactively('page2')-1 )* $scope.perPage2);
                var sort  = $scope.getReactively('sort3');
                var selector = {};
                var fees = Feescategories.find(
                      selector, { limit: limit, skip: skip, sort: {code: sort} }
                  );
                return fees;
        },
        totalfees(){
            return Feescategories.find().count();
        },      
          users(){
                var sort  = 1;
                var selector = {role: 'student'};
                var users = Meteor.users.find(
                      selector, { sort: {name: sort} }
                  );
                  console.info('users', users);
                var count = users.count();
                console.info('count', count);
                return users;
            },
            feescats(){
              var sort = 1;
              var fees = $scope.getReactively('selected._id');
              var selector = {_id: fees};
              console.info('fees', fees);
              var modifier = {sort: {feesName: sort}};
              var feescats = Feescategories.findOne(selector, modifier);
              console.info('feescats', feescats);
              return feescats;
            }
      })//helpers

      $scope.doneSearching = false;
      $scope.showAll = false;

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.toastPosition = angular.extend({},last);

      $scope.openProfile2 = function (selected2) {
        console.info('selected:', selected2[0].profiles_userID);
        var profileID = selected2[0].profiles_userID;
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


      $scope.navRight = function () {
          $scope.page2 = $scope.page2 + 1;
          var totalroles = Feescategories.find().count();
          console.info('total', totalroles);
          var lastPage = totalroles / 5;
          console.info('lastpage', lastPage);
          console.info('page', $scope.page2);
          if($scope.page2 < lastPage)
          {
            $scope.last = false;
          }
          else{
            $scope.last = true;
          }
      };

      $scope.navLeft = function () {
          $scope.page2 = $scope.page2 - 1;
          var totalroles = Feescategories.find().count();
          console.info('total', totalroles);
          var lastPage = totalroles / 5;
          console.info('lastpage', lastPage);
          console.info('page', $scope.page2);
          if($scope.page2 < lastPage)
          {
            $scope.last = false;
          }
          else{
            $scope.last = true;
          }
      };

      $scope.showMoreAll = function () {
          $scope.showAll = !$scope.showAll;
      };

      $scope.showRole = function (selectedRole) {
        $scope.enabled = [];
        $scope.installed = [];

          $scope.selected = selectedRole;
          console.info('selectedrole', $scope.selected);


      };

      $scope.openDialogs = function($event, item) {
        // Show the dialog
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          controller: function($mdDialog) {
            // Save the clicked item
            $scope.FABitem = item;
            // Setup some handlers
            $scope.close = function() {
              $mdDialog.cancel();
            };
          },
          controllerAs: 'collectcreatefees',
          controller: CollectCtrl,
          template: '<collectcreatefees></collectcreatefees>',
          targetEvent: $event
        });
      }

      $scope.assignUser = function($event, item) {
        // Show the dialog
        $scope.passedId = item._id;
        $scope.passedRole = item.role;

        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            passedId: $scope.passedId,
            passedRole: $scope.passedRole
          },
          transclude: true,
          controller: function($mdDialog, passedId, passedRole,$scope) {
              $scope.subscribe('usersStudent');
              $scope.subscribe('profilesStudent', function () {
                  return [$scope.getReactively('searchText')];
              });

              $scope.helpers({
                users(){
                      var sort  = 1;
                      var selector = {role: 'student'};
                      var users = Meteor.users.find(
                            selector, { sort: {name: sort} }
                        );
                        console.info('users', users);
                      var count = users.count();
                      console.info('count', count);
                      return users;
                  },
               profiles(){
                    //var sort = 1;
                    //var selector = {};
                    //var modifier= {sort: {profiles_firstname: sort}};
                    var type = 'Student';
                    var selector = {profiles_type: type};
                    var profiles = Profiles.find(selector);
                    var count = profiles.count();
                    console.info('profiles', profiles);
                    console.info('count', count);
                    return profiles;
                  }

              });



            $scope.passed = passedRole;
            $scope.passedId = passedId;

            $scope.createFees = function(details) {
              var userID = details.user._id;
              var userName = details.user.name;
              var passedID = $scope.passedId;
              console.info('feesid', userID);
              var selector = {profiles_userID: userID};
              var profiles = Profiles.findOne(selector);
              var userPhoto = profiles.profiles_profilephoto;
              var userBranch = profiles.profiles_branch;
              var userBranchID = profiles.profiles_branchID;
              console.info('photo', userBranch);

              $scope.done = true;
              $scope.existing = false;
              $scope.createdNow = !$scope.createdNow;
              $scope.upserted = false;


              Meteor.call('upsertStudentToFees', userID, userPhoto, userBranch, userBranchID, userName, passedID, function(err, stats) {
                if (err) {
                  console.log('error upsert role to meteor.user');
                  $scope.done = false;
                  $scope.createdNow = !$scope.createdNow;
                  $scope.existing = true;
                  $scope.upserted = false;
                  window.setTimeout(function(){
                    $scope.$apply();
                  },2000);
             }else {
               Meteor.call('upsertNewFeesFromCollect', userID, passedID, function(err, stats) {
                 if (err) {
                   console.log('error upsert role to meteor.user');
                   $scope.done = false;
                   $scope.createdNow = !$scope.createdNow;
                   $scope.existing = true;
                   window.setTimeout(function(){
                     $scope.$apply();
                   },2000);
              }else {
                $scope.registered = details;
                $scope.createdNows = !$scope.createdNows;
                $scope.done = false;
                window.setTimeout(function(){
                  $scope.$apply();
                },2000);
              }
             });
             }
           });


          }





            $scope.closeDialog = function() {
              $mdDialog.cancel();
            };
          },
          templateUrl: 'client/components/collect/showcategories/assignstudent.html',
          targetEvent: $event
        });
      }

      $scope.unassignUser = function($event, item) {
        // Show the dialog
        console.info('unassign', item[0]._id);
        $scope.passedId = item[0]._id;
        $scope.passedRole = '';
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            passedId: $scope.passedId,
            passedRole: $scope.passedRole
          },
          transclude: true,
          controller: function($mdDialog, passedId, passedRole,$scope) {
              $scope.subscribe('users');
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



            $scope.passed = passedRole;
            $scope.passedId = passedId;

            $scope.unassignRole = function() {
              var userID = $scope.passedId;
              var userID2 = $scope.passedId;
              var passedID = passedRole;


              $scope.done = true;
              $scope.existing = false;
              $scope.createdNow = !$scope.createdNow;
              //var status = createUserFromAdmin(details);
              Meteor.call('upsertNewRoleFromAdmin', userID, passedID, function(err, stats) {
                if (err) {
                  console.log('error upsert role to meteor.user');
               }
              });

              $scope.register = Meteor.call('unassignProfileFromRole', userID, passedID, function(err, userID) {
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
                //delete old apps
                console.info('userID2', userID2);
                var selector = {_id: userID2};
                userID3 = Profiles.findOne(selector);
                userID2 = userID3.profiles_userID;
                selector = {userID: userID2};
                console.info('userID2', userID2);
                var oldApps = Userapps.find(selector);
                console.info('oldApps', oldApps);
                var oldAppsCount = oldApps.count();
                console.info('oldappscount', oldAppsCount);
                oldApps.forEach(function(oldApp){
                  var oldAppId = oldApp._id;
                  selector = {_id: oldAppId}
                  var status = Userapps.remove(selector);
                  if(status){
                    console.info('success deleting app', oldAppId);
                  }
                  else{
                    console.info('error deleting app', oldAppId);
                  }
                });
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
          templateUrl: 'client/components/assignRole/unassignrole.html',
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
        $scope.searchText = null;
      }

      $scope.removeRole = function(roleDel) {
        console.info('userid', $scope.selected);
        if(roleDel){
          var idNow = $scope.selected[0]._id;
          Roles.remove({_id: idNow});
          $scope.deletedNow = false;
          $scope.deletedNows = false;
          $scope.done = false;
          $scope.existing = false;
        }
        else{

          console.info('2', roleDel);
        }

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

      $scope.openDelete = function ($event, selected) {
        console.info('selected:', selected._id);
        $scope.roleId = selected._id;
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            roleId : $scope.roleId
          },
          controller: function($scope, $mdDialog, roleId){
            $scope.rolesID = roleId;
            console.info($scope.rolesID );
            $scope.deletedNow = false;
            $scope.deletedNows = false;
            $scope.existing = false;
            $scope.done = false;

            $scope.register = {
              rolename: ''
            };

            $scope.subscribe('roles2', function () {
                return [$scope.getReactively('rolesID')];
            });

            $scope.helpers({
              roles() {
                var ID = $scope.rolesID;
                var selector = {_id: ID};
                return Roles.find(selector);
              }
            });//helpers

            $scope.deleteroleNow = function() {
            $scope.done = true;
            $scope.deletedNow = !$scope.deletedNow;
            var roleDel = $scope.rolesID;
            console.info('roleDel', roleDel);
            var selector = {_id: roleDel};
            var err = Roles.remove(selector);
            if (!err) {
                //do something with the id : for ex create profile
                $scope.done = false;
                $scope.deletedNows = false;
                $scope.deletedNow = false;
                console.log('daan');
                window.setTimeout(function(){
                  $scope.$apply();
              },2000);
            } else {
             //simulation purposes
               $scope.deletedNows = true;
               $scope.deletedNow = true;
               console.info('deletednows', $scope.deletedNows );
               $scope.done = false;
               window.setTimeout(function(){
               $scope.$apply();
               },2000);
             }
           }



        $scope.cancelNow = function() {
          $mdDialog.cancel();
        };


        },
          templateUrl: 'client/components/headmasterRole/showRoles/deleterole.html',
          targetEvent: $event
        });
        };

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.openProfile = function ($event, selected) {
            console.info('selected:', selected._id);
            $scope.roleId = selected._id;
              $mdDialog.show({
              clickOutsideToClose: false,
              escapeToClose: true,
              transclude: true,
              locals:{
                roleId : $scope.roleId
              },
              controller: function($scope, $mdDialog, roleId){
                $scope.rolesID = roleId;
                console.info($scope.rolesID );
                $scope.deletedNow = false;
                $scope.existing = false;
                $scope.done = false;

                $scope.register = {
                  rolename: ''
                };

                $scope.subscribe('roles2', function () {
                    return [$scope.getReactively('rolesID')];
                });

                $scope.helpers({
                  roles() {
                    var ID = $scope.rolesID;
                    var selector = {_id: ID};
                    return Roles.find(selector);
                  }
                });//helpers

                $scope.editroleNow = function() {
                console.info('from form', $scope.register.rolename);
                var roleName = $scope.register.rolename;
                $scope.done = true;
                $scope.deletedNow = !$scope.deletedNow;
                var roleDel = $scope.rolesID;
                console.info('roleDel', roleDel);
                var selector = {_id: roleDel};
                var modifier = {$set: {role: roleName}};

                Meteor.call('upsertRoleFromAdmin', roleName, roleDel, function(err, roleName) {
                if (err) {
                    //do something with the id : for ex create profile
                    $scope.done = false;
                    $scope.deletedNow = !$scope.deletedNow;
                    $scope.existing = true;
                    window.setTimeout(function(){
                      $scope.$apply();
                  },2000);
                } else {
                 //simulation purposes
                   $scope.deletedNows = !$scope.deletedNows;
                   $scope.done = false;
                   window.setTimeout(function(){
                   $scope.$apply();
                   },2000);
                 }
               });
             }


            $scope.cancelNow = function() {
              $mdDialog.cancel();
            };


            },
            templateUrl: 'client/components/headmasterRole/showRoles/editrole.html',
            targetEvent: $event
            });
            };
          //$state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('showcategories', {
    templateUrl: 'client/components/collect/showcategories/showcategories.html',
    controllerAs: 'showcategories',
    controller: ShowcategoriesCtrl,
    transclude: true
})
