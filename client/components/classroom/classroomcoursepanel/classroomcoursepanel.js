import {app} from '/client/app.js';

import Courses from '/imports/models/courses.js';
import ngFileUpload from 'ng-file-upload';



class ClassroomcoursepanelCtrl{

  constructor($rootScope, $scope, $mdToast, $timeout, $mdSidenav, $log, $mdDialog, $state, Upload){
      'ngInject';

      $scope.courseID = $rootScope.courseID;

      $scope.subscribe('courses2', function () {
          return [$scope.getReactively('courseID')];
      });

      $scope.helpers({
          courses() {
                var courseID = $scope.getReactively('courseID');
                var selector = {_id : courseID};
                var courses = Courses.find(selector);
                return courses;
              }
      });//helpers

      $scope.show = false;

      Slingshot.fileRestrictions("myFileUploads", {
      allowedFileTypes: null,
      maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
      });

      $scope.uploader = new Slingshot.Upload('myFileUploads');
      $scope.uploadingNow = false;
      $scope.uploaded = false;
      $scope.doneSearching = false;

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

    $scope.showMore = function () {
        $scope.show = !$scope.show;
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

        $scope.openSchool = function () {
          var branchID = $scope.myBranch;
          $state.go('ClassroomCourses', {stateHolder : 'Classroom', userID : Meteor.userId()});
        }

        $scope.items = [
          { name: "Add lesson guide", icon: "../../assets/img/white_addlesson24.svg", direction: "left" }
        ];

        $scope.openDialog = function($event, item) {
          // Show the dialog
          if(item.name == 'Add lesson guide'){
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
            controllerAs: 'createcourselessonguide',
            controller: ClassroomcoursepanelCtrl,
            template: '<createcourselessonguide></createcourselessonguide>',
            targetEvent: $event
          });
        }
      }



    $scope.editDescription = function ($event, selected) {
        console.info('selected', selected);
        $scope.results = selected;
        var courseID = $scope.courseID;
        $mdDialog.show({
        clickOutsideToClose: false,
        escapeToClose: true,
        transclude: true,
        locals:{
          results : $scope.results,
          courseID : courseID
        },
        controller: function($scope, $mdDialog, results, courseID){

          $scope.courseID = courseID;
          $scope.results = results;
          $scope.updatedNow = false;
          $scope.updatedNows = false;
          $scope.done = false;

          $scope.cancelNow = function() {
            $mdDialog.cancel();
          }

          $scope.updateInfo = function(results) {
            $scope.done = true;
            $scope.updatedNow = true;

            console.log('daan dito')
            $scope.resultsphone = results;
            console.info('ressulta', $scope.resultsphone);
            var selector = {_id: results._id};
            var modifier = {$set: {
                coursename: results.coursename,
                coursedescription: results.coursedescription
            }};

            Courses.update( selector, modifier, function (error, rows) {
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
        templateUrl: 'client/components/classroom/classroomcoursepanel/editcoursepanel.html',
        targetEvent: $event
      });
      };




    }
}

app.component('classroomcoursepanel', {
    templateUrl: 'client/components/classroom/classroomcoursepanel/classroomcoursepanel.html',
    controllerAs: 'classroomcoursepanel',
    controller: ClassroomcoursepanelCtrl
})
