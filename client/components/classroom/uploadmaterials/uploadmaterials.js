import {app} from '/client/app.js';

import Courses from '/imports/models/courses.js';
import Lessonguides from '/imports/models/lessonguides.js';
import ngFileUpload from 'ng-file-upload';



class UploadmaterialsCtrl{

  constructor($rootScope, $scope, $mdToast, $timeout, $mdSidenav, $log, $mdDialog, $state, Upload){
      'ngInject';
      $scope.courseID = $rootScope.courseID;
      $scope.materialsID = $rootScope.materialsID;

      $scope.subscribe('lessonguides', function () {
          return [$scope.getReactively('materialsID')];
      });

      $scope.helpers({
        lessonguides() {
              var materialsID = $scope.getReactively('materialsID');
              var selector = {_id : materialsID};
              var lessonguides = Lessonguides.find(selector);
              var count = lessonguides.count();
              console.info('courseID', materialsID);
              console.info('lessonguides', lessonguides);
              console.info('count', count);
              return lessonguides;
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

      $scope.cancelNow = function() {
        $mdDialog.cancel();
      }

      $scope.uploadFiles = function(file, errFiles) {
        var selectedID = $scope.materialsID;
        console.log('pasok');
        $scope.progress = 0;
        $scope.uploadingNow = true;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        $scope.fileHere = file.name;
        $scope.doneSearching = true;
        $scope.selectedIDD = selectedID;
        if (file) {
          console.log(file);


          $scope.uploader.send(file, function (error, downloadUrl) {
            if (error) {
              // Log service detailed response.
              console.error('Error uploading', $scope.uploader);
              alert (error);
              var toasted = 'Error uploading file.';
              var pinTo = $scope.getToastPosition();
              $mdToast.show(
                $mdToast.simple()
                .textContent(toasted)
                .position(pinTo )
                .hideDelay(3000)
                .theme('Classroom')
                .action('HIDE')
                .highlightAction(true)
                .highlightClass('md-accent')
              );
              $scope.doneSearching = false;
            }
            else {
              var filename = $scope.fileHere;
              var selectedID = $scope.selectedIDD;
              var selector = {_id: selectedID};
              var modifier = {$push: {resources:
                {
                  downloadUrl: downloadUrl,
                  filename: filename,
                  lessonID: selectedID
                }
              }};
              Lessonguides.update(selector,modifier);
              console.log('success: ' + downloadUrl);
              var toasted = 'New material uploaded.';
              var pinTo = $scope.getToastPosition();
              $mdToast.show(
                $mdToast.simple()
                .textContent(toasted)
                .position(pinTo )
                .hideDelay(3000)
                .theme('Classroom')
                .action('HIDE')
                .highlightAction(true)
                .highlightClass('md-accent')
              );
              $scope.doneSearching = false;
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


    }
}

app.component('uploadmaterials', {
    templateUrl: 'client/components/classroom/uploadmaterials/uploadmaterials.html',
    controllerAs: 'uploadmaterials',
    controller: UploadmaterialsCtrl
})
