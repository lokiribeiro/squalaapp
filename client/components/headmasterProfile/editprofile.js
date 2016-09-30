import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Roles from '/imports/models/roles.js';
import Branches from '/imports/models/branches.js';
import Userapps from '/imports/models/userapps.js';
import Apps from '/imports/models/apps.js';



class HeadmasterprofileCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.profileID = $rootScope.profileID;
      $scope.rolesID = null;
      $scope.branchID = '';
      $scope.myBranch = $rootScope.branchID;

      $scope.subscribe('profiles2', function () {
          return [$scope.getReactively('profileID')];
      });
      $scope.subscribe('roles2', function () {
          return [$scope.getReactively('rolesID')];
      });

      $scope.subscribe('branches', function () {
          return [$scope.getReactively('branchID')];
      });

      $scope.subscribe('userapps2');
      $scope.subscribe('apps');
      $scope.subscribe('users');





      $scope.helpers({
          profiles() {
                var profileID = $scope.getReactively('profileID');
                var selector = {profiles_userID : profileID};
                var profiles = Profiles.find(selector);
                var roleName = '';
                console.info('profiles', profiles);
                profiles.forEach(function(profile) {
                  $scope.rolesID = profile.profiles_userroleID;
                });
                return profiles;
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
        },
        branchesList(){
          var sort = 1;
          var selector = {};
          var modifier = {sort: {branch_name: sort}};
          var branchesList = Branches.find(selector,modifier);
          var count = branchesList.count();
          console.info('count', count);
          console.info('branchesList', branchesList);
          return branchesList;
        }
      });//helpers

      this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $scope.announceClick = function($event, branch, firstname, lastname, ID, userType, oldBranchId) {
      var branchID = branch._id;
      var branchname = branch.branch_name;
      var userType = userType;
      var profileID = ID;
      var oldId = oldBranchId;

      console.info('oldId', oldId);

      var selector = {_id: oldId};
      var branchDetails = Branches.find(selector);
      var counter = branchDetails.count();
      console.info('branchDetails', branchDetails);
      console.info('counter', counter);

      if(counter > 0){
          branchDetails.forEach(function(branchDetail){
            if(branchDetail.branches_schooladmin == profileID){
              var selector = {_id: oldId};
              var modifier = {$set: {
                branches_schooladmin: '',
                branches_schooladminname: ''
              }};
              var removeAdmin = Branches.update(selector,modifier);
            }
          })
      }

      Meteor.call('upsertNewBranchFromAdmin', profileID, branchID, function(err, detailss) {
        if (err) {
            //do something with the id : for ex create profile
          console.log('error upserting branch to meteor.user()');
       }
      });

      Meteor.call('upsertProfileFromAdmin', profileID, branchID, branchname, userType, function(err, detail) {
          if (err) {
            console.log('error here');
          } else{
            $mdDialog.show(
              $mdDialog.alert()
                .title('Transfer complete')
                .textContent(firstname + ' ' + lastname + ' had been transferred to ' + branchname)
                .ok('Done')
                .targetEvent($event)
            );
          }
        });
      };

      $scope.associateRole = function($event, firstname, lastname, userId, roleId, rolename) {
        var idOfUser = userId;
        var idOfRole = roleId;

        $mdDialog.show(
          $mdDialog.alert()
            .title('Processing')
            .targetEvent($event)
        );

        Meteor.call('upsertNewRoleFromAdmin', userId, roleId, function(err, stats) {
          if (err) {
            console.log('error upsert role to meteor.user');
         }
        });

        Meteor.call('upsertProfileFromRole', userId, roleId, function(err, detail) {
            if (err) {
              console.log('error here');
            } else{

              var userAppsHolder = {
                userID: '',
                appId: '',
                appName: '',
                appLoc: '',
                desc: ''
              };

              var selector = {userID: idOfUser};
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
              selector = {_id: idOfRole};
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

                  userAppsHolder.userID = idOfUser;
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
                $mdDialog.hide();
                $mdDialog.show(
                  $mdDialog.alert()
                    .title('Success')
                    .textContent(firstname + ' ' + lastname + ' had been given ' + rolename + ' role')
                    .ok('Done')
                    .targetEvent($event)
                );
              },2000);
            }
          });
        };

        $scope.openRole = function () {
          $state.go('Headmasterrole', {stateHolder : 'Headmaster', userID : Meteor.userId()});
        }

        $scope.openResp = function () {
          $state.go('Headmasterresp', {stateHolder : 'Headmaster', userID : Meteor.userId()});
        }

        $scope.openSchool = function () {
          var branchID = $scope.myBranch;
          $state.go('Headmasterschool', {stateHolder : 'Headmaster', userID : Meteor.userId(), branchID : branchID});
        }

    }
}

app.component('headmasterprofile', {
    templateUrl: 'client/components/headmasterProfile/editprofile.html',
    controllerAs: 'headmasterprofile',
    controller: HeadmasterprofileCtrl
})
