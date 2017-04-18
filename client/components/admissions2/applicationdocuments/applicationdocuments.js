import {app} from '/client/app.js';

import Applicants from '/imports/models/applicants.js';
//import Images from '/imports/models/images.js';
import ngFileUpload from 'ng-file-upload';




class ApplicationdocumentsCtrl{

  constructor($rootScope, $scope, $mdToast, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state, Upload){
      'ngInject';

      $scope.applicantID = $rootScope.applicantID;

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

      //$scope.currentUpload = false;
      $scope.uploadFiles = function(file, errFiles, reqID, reqName) {
        console.log('pasok');
        $scope.progress = 0;
        $scope.uploadingNow = true;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        $scope.fileHere = file.name;
        var requirementname = reqName;
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
                  requirement: requirementname,
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


      $scope.items = [
        {value: 'grade1', name: 'Grade 1'},
        {value: 'grade2', name: 'Grade 2'},
        {value: 'grade3', name: 'Grade 3'},
        {value: 'grade4', name: 'Grade 4'},
        {value: 'grade5', name: 'Grade 5'},
        {value: 'grade6', name: 'Grade 6'},
        {value: 'grade7', name: 'Grade 7'},
        {value: 'grade8', name: 'Grade 8'},
        {value: 'grade9', name: 'Grade 9'},
        {value: 'grade10', name: 'Grade 10'},
        {value: 'grade11', name: 'Grade 11'},
        {value: 'grade12', name: 'Grade 12'}
      ];


    }
}

app.component('applicationdocuments', {
    templateUrl: 'client/components/admissions/applicationdocuments/applicationdocuments.html',
    controllerAs: 'applicationdocuments',
    controller: ApplicationdocumentsCtrl
})
