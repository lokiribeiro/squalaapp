import {app} from '/client/app.js';

import Requirementdocs from '/imports/models/requirementdocs.js';
import ngFileUpload from 'ng-file-upload';

class DriveCtrl{

  constructor($scope, $timeout, $mdSidenav, $element, $log, $mdDialog, $state, $q, $mdToast, $rootScope, Upload){
      'ngInject';

      $scope.selected4 = [];
      $scope.applicantID = $rootScope.applicantID;
      console.info('branch', $scope.applicantID );
      var applicantID =   $scope.applicantID ;

      $scope.show = false;
      $scope.applicant = {
        requirementType : ''
      }

      $scope.perPage = 10;
      $scope.page = 1;
      $scope.page2 = 1;
      $scope.sort = -1;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;
      $scope.last = false;

      $scope.sort2 = 1;
      $scope.enabled = [];
      $scope.installed = [];

      $scope.subscribe('applicants', function () {
          return [$scope.getReactively('applicantID')];
      });

      $scope.subscribe('requirementdocs');

      $scope.helpers({
        applicants(){
          var applicantID = $scope.getReactively('applicantID');
          var selector = {_id: applicantID};
          var applicants = Applicants.find(selector);
          var count = applicants.count();
          return applicants;
        },
        requirementdocs(){
          //var sort = 1;
          //var selector = {};
          //var modifier= {sort: {profiles_firstname: sort}};
          var selector = {};
          var requirementdocs = Requirementdocs.find(selector);
          var count = requirementdocs.count();
          console.info('profiles', requirementdocs);
          console.info('count', count);
          return requirementdocs;
        },

      })//helpers

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.toastPosition = angular.extend({},last);

      $scope.openProfile2 = function (selected4) {
        console.info('selected:', selected4[0].profiles_userID);
        var profileID = selected4[0].profiles_userID;
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

      $scope.addStaff = function($event, applicantID) {
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            applicantID: $scope.applicantID
          },
          transclude: true,
          controller: function($mdDialog, applicantID, $scope) {
              $scope.searchTerm = '';
              $scope.userType = 'Student';
              console.info('applicantID', applicantID);
              $scope.userBrID = '';

              $scope.done = false;
              $scope.existing = false;
              $scope.createdNow = false;
              $scope.createdNows = false;

              $scope.subscribe('requirementdocs');

              $scope.helpers({
                requirementdocs(){
                  //var sort = 1;
                  //var selector = {};
                  //var modifier= {sort: {profiles_firstname: sort}};
                  var selector = {};
                  var requirementdocs = Requirementdocs.find(selector);
                  var count = requirementdocs.count();
                  console.info('profiles', requirementdocs);
                  console.info('count', count);
                  return requirementdocs;
                },
                totalrequirementdocs(){
                  var selector = {};
                  var requirementdocs = Requirementdocs.find(selector);
                  var count = requirementdocs.count();
                  $scope.count = count;
                  return count;
                }
              });

              $scope.applicantID = applicantID;

              Slingshot.fileRestrictions("myFileUploads", {
                allowedFileTypes: null,
                maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
              });

              $scope.uploader = new Slingshot.Upload('myFileUploads');
              $scope.uploadingNow = false;
              $scope.uploaded = false;

              var last = {
                bottom: true,
                top: false,
                left: true,
                right: false
              };

              $scope.toastPosition = angular.extend({},last);

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

              //$scope.currentUpload = false;
              $scope.uploadFiles = function(file, errFiles, reqID) {
                console.info('pasok', reqID );
                $scope.progress = 0;
                $scope.uploadingNow = true;
                $scope.f = file;
                $scope.errFile = errFiles && errFiles[0];
                $scope.fileHere = file.name;
                var requirementID = reqID;
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
                      var applicantID = $scope.applicantID;
                      var selector = {_id: applicantID};
                      var modifier = {$push: {documents:
                        {
                          downloadUrl: downloadUrl,
                          filename: filename,
                          requirementID: requirementID
                        }
                      }};
                      Applicants.update(selector,modifier);
                      console.log('success: ' + downloadUrl);
                      var progress = 60;
                      Meteor.call('upsertApplicantFromDocs', applicantID, progress, function(err, detail) {
                        var detail = detail;
                        console.log(detail);
                        if (err) {
                          var toasted = 'Error uploading file.';
                          var pinTo = $scope.getToastPosition();
                          $mdToast.show(
                            $mdToast.simple()
                            .textContent(toasted)
                            .position(pinTo )
                            .hideDelay(3000)
                            .theme('Admissions')
                            .action('HIDE')
                            .highlightAction(true)
                            .highlightClass('md-accent')
                          );
                          $scope.doneSearching = false;
                          $mdDialog.hide();
                        } else {
                          var toasted = 'New document uploaded.';
                          var pinTo = $scope.getToastPosition();
                          $mdToast.show(
                            $mdToast.simple()
                            .textContent(toasted)
                            .position(pinTo )
                            .hideDelay(3000)
                            .theme('Admissions')
                            .action('HIDE')
                            .highlightAction(true)
                            .highlightClass('md-accent')
                          );
                          $scope.doneSearching = false;
                          $mdDialog.hide();
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
          templateUrl: 'client/components/admissions/enroll/drive/addrequirements/addrequirements.html',
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
        $scope.selected4 = [];
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

app.component('drive', {
    templateUrl: 'client/components/admissions/enroll/drive/drive.html',
    controllerAs: 'drive',
    controller: DriveCtrl,
    transclude: true
})
