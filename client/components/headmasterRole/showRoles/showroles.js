import {app} from '/client/app.js';

import Roles from '/imports/models/roles.js';
import Responsibilities from '/imports/models/responsibilities.js';
import Profiles from '/imports/models/profiles.js';
import Apps from '/imports/models/apps.js'
import Userapps from '/imports/models/userapps.js'

//import Users from '/imports/models/users.js';

class ShowrolesCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast){
      'ngInject';

      $scope.selected = {
        role: '',
        responsibilities: {
          responsibility: '',
          responsibilityId: ''
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

      $scope.subscribe('roles');
      $scope.subscribe('profiles', function () {
          $scope.promise = $timeout(function(){

          }, 2000);
          return [$scope.getReactively('searchText')];
      });
      $scope.subscribe('responsibilities');
      $scope.subscribe('apps');
      $scope.subscribe('userapps2');

      $scope.helpers({
          roles() {
                var limit = parseInt($scope.getReactively('perPage2'));
                var skip  = parseInt(( $scope.getReactively('page2')-1 )* $scope.perPage2);
                var sort  = $scope.getReactively('sort3');
                var selector = {};
                var roles = Roles.find(
                      selector, { limit: limit, skip: skip, sort: {role: sort} }
                  );
                return roles;
        },
        totalRoles(){
            return Roles.find().count();
        },
          responsibilities(){
            var sort = $scope.getReactively('sort2');
            var selector = {};
            var responsibilities = Responsibilities.find(
              selector, {sort: {responsibilityname: sort}}
            );
            return responsibilities;
          },
          roleresps(){
            var sort = 1;
            var role = $scope.getReactively('selected._id');
            var selector = {_id: role};
            console.info('role', role);
            var modifier = {sort: {role: sort}};
            var roleresps = Roles.findOne(selector, modifier);
            console.info('roleresps', roleresps);
            return roleresps;
          },
          profiles(){
            var limit = parseInt($scope.getReactively('perPage'));
            var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
            var sort  = $scope.getReactively('sort');
            var selector = {};
            var sort = 1;
            var role = $scope.getReactively('selected._id');
            console.info('role', role);
            var selector = {profiles_userroleID: role};

            var modifier= { limit: limit, skip: skip, sort: {profiles_firstname: sort}};
            var profiles = null;
            if(role != undefined)
             {
               var profiles = Profiles.find(selector, modifier);
             }
            console.info('profiles', profiles);
            return profiles;
          },
          totalProfiles(){
            var role = $scope.getReactively('selected._id');
            console.info('role', role);
            var selector = {profiles_userroleID: role};
             var totalProfiles = null;
            if(role != undefined)
             {
               var totalProfiles = Profiles.find(selector).count();
             }
            console.info('profiles', totalProfiles);
            return totalProfiles;

          },
          apps(){
            var sort = 1;
            var selector = {};
            var apps = Apps.find(selector, {sort: {name: sort}});
            return apps;
          }
      })//helpers

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

      $scope.switchResponsibility = function(responsibility, enabled, role) {
        console.info('toggle', responsibility._id);
        console.info('switch', enabled);
        console.info('role', role);
        var respID = responsibility._id;

        if(enabled){
          var selector = {_id: role};
          var modifier = {$push: {responsibilities: {responsibilitiesID: respID }}}
          Roles.update(selector,modifier);
          var toasted = 'Responsibility added';
        }
        else{
          var selector = {_id: role};
          var modifier = {$pull: {responsibilities: {responsibilitiesID: respID }}}
          Roles.update(selector,modifier);
          var toasted = 'Responsibility removed';
        }

        var pinTo = $scope.getToastPosition();

        $mdToast.show(
          $mdToast.simple()
          .textContent(toasted)
          .position(pinTo )
          .hideDelay(3000)
          .theme('Headmaster')
        );
      }

      $scope.switchApp = function(app, installed, role) {
        console.info('appID', app._id);
        console.info('switch', installed);
        console.info('role', role);
        var appID = app._id;
        var sort = 1;
        var appInstalled = null;
        var found = null;
        var userAppsHolder = {
          userID: '',
          appId: '',
          appName: '',
          appLoc: '',
          desc: ''
        };

        var selector = {_id: appID};
        var fromApps = Apps.findOne(selector);

        if(installed){
          var selector = {_id: role};
          var modifier = {$push: {apps: {appId: appID }}}
          Roles.update(selector,modifier);
          var toasted = 'App added';
          selector = {profiles_userroleID: role};
          modifier = {sort: {profiles_firstname: sort}};
          var userInRoles = Profiles.find(selector,modifier);
          var userInRoleNum = userInRoles.count();
          userInRoles.forEach(function(userInRole) {
            found = false;
            selector = {userID: userInRole.profiles_userID};
            modifier = {sort: {appName: sort}};
            var userApps = Userapps.find(selector, modifier);
            var userAppsNum = userApps.count();
            console.info('userAppsNum', userAppsNum);
            if(userAppsNum > 0){
              userApps.forEach(function(userapp){
                if((userapp.appName == appID) || (found == true)){
                  console.info('appname', userapp.appName );
                  appInstalled = true;
                  found = true;
                }
                else if((userapp.appName == appID) && (found == false)){
                  appInstalled = true;
                  found = true;
                }
                else {
                  appInstalled = false;
                }
              });
            } else {
              appInstalled = false;
            }
            if(appInstalled == false){
              console.info('fromApps', fromApps);
              userAppsHolder.userID = userInRole.profiles_userID;
              userAppsHolder.appId = appID;
              userAppsHolder.appName = fromApps.name;
              userAppsHolder.appLoc = fromApps.loc;
              userAppsHolder.desc = fromApps.desc;
              var status = Userapps.insert(userAppsHolder);
              if (status) {
                console.log('inserted user to userapps');

              } else {
                console.log('error inserting');
              }
              }
            });
          }
        else{
          var selector = {_id: role};
          var modifier = {$pull: {apps: {appId: appID }}}
          Roles.update(selector,modifier);
          var toasted = 'App removed';
          console.info('enter else', appID);
          selector = {profiles_userroleID: role};
          modifier = {sort: {profiles_firstname: sort}};
          var userInRoles = Profiles.find(selector,modifier);
          var userInRoleNum = userInRoles.count();
          userInRoles.forEach(function(userInRole) {
            console.info('enter userrole loop', userInRole.profiles_userID);
              var fromAppsID = appID
              var profileUser = userInRole.profiles_userID;
              console.info('profileUser', profileUser);
              selector = {
                $and: [
                  {userID: profileUser},
                  {appId: appID}
                ]
              };
              var toRemove = Userapps.find(selector);
              //var toRemoveID = toRemove._id;
              console.info('toRemove', toRemove);
              toRemove.forEach(function(toRem){
                var removeID = toRem._id;
                selector = {_id: removeID};
                console.info('toremid', removeID);
                var status = Userapps.remove(selector);
                if (status) {
                  console.log('inserted user to userapps');

                } else {
                  console.log('error inserting', status);
                }
              });
            });
        }

        var pinTo = $scope.getToastPosition();

        $mdToast.show(
          $mdToast.simple()
          .textContent(toasted)
          .position(pinTo )
          .hideDelay(3000)
          .theme('Headmaster')
        );
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
          var totalroles = Roles.find().count();
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
          var totalroles = Roles.find().count();
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

      $scope.showRole = function (selectedRole) {
        $scope.enabled = [];
        $scope.installed = [];

          $scope.selected = selectedRole;
          var respNum = selectedRole.responsibilities.length;
          var appNum = selectedRole.apps.length;

          var responsibilityList = {
            ID: '',
            responsibilityname: ''
          };
          var appsList = {
            appId: ''
          };

          var sort = 1;
          var selector = {};
          var modifier = {sort: {responsibilityname: sort}};
          responsibilityList = Responsibilities.find(selector,modifier);
          var max = responsibilityList.count();
          for(i=0; i<respNum; i++){
              var j=0;
              responsibilityList.forEach(function(responsibility) {
                if($scope.enabled[j] != true){
                  if(selectedRole.responsibilities[i].responsibilitiesID == responsibility._id ){
                    $scope.enabled[j] = true;
                  } else {
                    $scope.enabled[j] = false;
                  }
                }
                j++;
              });
            }

          sort = 1;
          selector = {};
          var modifier = {sort: {name: sort}};
          appList = Apps.find(selector,modifier);
          var max = appList.count();
          for(i=0;i<appNum; i++){
            var k=0;
            appList.forEach(function(app){
              if($scope.installed[k] != true){
                if(selectedRole.apps[i].appId == app._id){
                  $scope.installed[k] = true;
                } else {
                  $scope.installed[k] = false;
                }
              }
              k++;
            });
          }


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
          controllerAs: 'headmastercreaterole',
          controller: ShowrolesCtrl,
          template: '<headmastercreaterole></headmastercreaterole>',
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

            $scope.createRole = function(details) {
              var userID = details.user._id;
              var userID2 = details.user._id;
              var passedID = $scope.passedId ;

              var userAppsHolder = {
                userID: '',
                appId: '',
                appName: '',
                appLoc: '',
                desc: ''
              };

              $scope.done = true;
              $scope.existing = false;
              $scope.createdNow = !$scope.createdNow;


              Meteor.call('upsertNewRoleFromAdmin', userID, passedID, function(err, stats) {
                if (err) {
                  console.log('error upsert role to meteor.user');
               }
              });

              //var status = createUserFromAdmin(details);
              $scope.register = Meteor.call('upsertProfileFromRole', userID, passedID, function(err, userID) {
              if (err) {
                $scope.done = false;
                $scope.createdNow = !$scope.createdNow;
                $scope.existing = true;
                window.setTimeout(function(){
                  $scope.$apply();
                },2000);
                  //do something with the id : for ex create profile
             } else {
                $scope.registered = details;
                $scope.createdNows = !$scope.createdNows;
                $scope.done = false;
                //simulation purposes

                //delete old apps
                var selector = {userID: userID2};
                var oldApps = Userapps.find(selector);
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
                })

                //get role apps
                selector = {_id: passedID};
                var newRoleApps = Roles.find(selector);
                var newRoleAppsCount = newRoleApps.count();
                console.info('newRoleAppsCount', newRoleAppsCount);
                newRoleApps.forEach(function(newRoleApp){
                  var newRoleAppsLength = newRoleApp.apps.length;
                  console.info('newRoleAppsLength', newRoleAppsLength);

                  for(i=0;i<newRoleAppsLength;i++){
                    var appID = newRoleApp.apps[i].appId;
                    selector = {_id: appID};
                    var fromApps = Apps.findOne(selector);

                    userAppsHolder.userID = userID2;
                    userAppsHolder.appId = appID;
                    userAppsHolder.appName = fromApps.name;
                    userAppsHolder.appLoc = fromApps.loc;
                    userAppsHolder.desc = fromApps.desc;

                    var status = Userapps.insert(userAppsHolder);
                    if (status) {
                      console.log('inserted user to userapps');

                    } else {
                      console.log('error inserting');
                    }
                    }

                  })

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
          templateUrl: 'client/components/assignRole/assignrole.html',
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
                $scope.deletedNow = !$scope.deletedNow;
                $scope.existing = true;
                console.log('daan');
                window.setTimeout(function(){
                  $scope.$apply();
              },2000);
            } else {
             //simulation purposes
               $scope.deletedNows = !$scope.deletedNows;
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

app.component('showroles', {
    templateUrl: 'client/components/headmasterRole/showRoles/showroles.html',
    controllerAs: 'showroles',
    controller: ShowrolesCtrl,
    transclude: true
})
