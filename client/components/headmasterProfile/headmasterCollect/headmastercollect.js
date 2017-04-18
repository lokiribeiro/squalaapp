import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Roles from '/imports/models/roles.js';
import Branches from '/imports/models/branches.js';
import Userapps from '/imports/models/userapps.js';
import Apps from '/imports/models/apps.js';
import ngFileUpload from 'ng-file-upload';



class HeadmastercollectCtrl{

  constructor($rootScope, $scope, $mdToast, $timeout, $mdSidenav, $log, $mdDialog, $state, Upload){
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
      $scope.subscribe('feescategories2');





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
        },
        feescategories() {
          var profileID = $scope.getReactively('profileID');
          var selector = {profiles_userID : profileID};
          var profiles = Profiles.find(selector);
          var userID = '';
          var feeID = '';
          console.info('profiles', profiles);
          profiles.forEach(function(profile) {
            userID = profile.profiles_userID;
          });
          console.info('userID', userID);
          selector = {_id: userID};
          var userFees = Meteor.users.find(selector);
          console.info('userfees', userFees);
          userFees.forEach(function(userFee) {
            feeID = userFee.feesID;
          });
          selector = {_id: feeID}
          var fees = Feescategories.find(selector);
          console.info('fees', fees);
          var count = fees.count();
          console.info('console', count);
          return fees;
      }
      });//helpers

      Slingshot.fileRestrictions("myFileUploads", {
      allowedFileTypes: null,
      maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
      });

      $scope.uploader = new Slingshot.Upload('myFileUploads');
      $scope.uploadingNow = false;
      $scope.uploaded = false;
      $scope.doneSearching = false;
      $scope.showAll = false;

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

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

      $scope.showMoreAll = function () {
          $scope.showAll = !$scope.showAll;
      };

      $scope.uploadFiles = function(file, errFiles) {
        console.info('pasok', file);
        $scope.progress = 0;
        $scope.uploadingNow = true;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        $scope.fileHere = file.name;
        var profileID = $scope.profileID;
        $scope.doneSearching = true;
        if (file) {
          console.log(file);


          $scope.uploader.send(file, function (error, downloadUrl) {
            if (error) {
              // Log service detailed response.
              console.error('Error uploading', $scope.uploader);
              alert (error);
            }
            else {
              var filename = $scope.fileHere;
              var profileID = $scope.profileID;

              Meteor.call('upsertProfilePhoto', profileID, downloadUrl, function(err, result) {
                    console.log(downloadUrl);
              console.log('success: ' + downloadUrl)
                    if (err) {

                                           var toasted = 'Error uploading file.';
                                           var pinTo = $scope.getToastPosition();
                                           $mdToast.show(
                                             $mdToast.simple()
                                             .textContent(toasted)
                                             .position(pinTo )
                                             .hideDelay(3000)
                                             .theme('Headmaster')
                                             .action('HIDE')
                                             .highlightAction(true)
                                             .highlightClass('md-accent')
                                           );
                                           $scope.doneSearching = false;


                   } else {
                     var toasted = 'New profile photo uploaded.';
                     var pinTo = $scope.getToastPosition();
                     $mdToast.show(
                       $mdToast.simple()
                       .textContent(toasted)
                       .position(pinTo )
                       .hideDelay(3000)
                       .theme('Headmaster')
                       .action('HIDE')
                       .highlightAction(true)
                       .highlightClass('md-accent')
                     );
                     $scope.doneSearching = false;

                   }
                 });
            }
            });
            file.upload = Upload.upload({
                url: '/uploads',
                data: {file: file}
            });
            var filename = file.name;
            var path = '/uploads';
            var type = file.type;
            switch (type) {
              case 'text':
              //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
              var method = 'readAsText';
              var encoding = 'utf8';
              break;
              case 'binary':
              var method = 'readAsBinaryString';
              var encoding = 'binary';
              break;
              default:
              var method = 'readAsBinaryString';
              var encoding = 'binary';
              break;
            }
            /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log('success maybe?');
              }
            });*/


            file.upload.then(function (response) {
                $timeout(function () {
                  console.log(response);
                    file.result = response.data;
                    $scope.Fresult = response.config.data.file;

                    var errs = 0;
                    var Fresult = $scope.Fresult;
                    console.info('$scope', Fresult);
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
                else {
                  console.log('else pa');
                }
            }, function (event) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         event.loaded / event.total));
                $scope.progress = file.progress;
                if ($scope.progress == 100) {
                  $scope.uploadingNow = false;
                }
                console.log($scope.progress);
            });

        }
    };

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
          var profileID = $scope.profileID ;
          $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
        }

    }
}

app.component('headmastercollect', {
    templateUrl: 'client/components/headmasterProfile/headmasterCollect/headmastercollect.html',
    controllerAs: 'headmastercollect',
    controller: HeadmastercollectCtrl
})
