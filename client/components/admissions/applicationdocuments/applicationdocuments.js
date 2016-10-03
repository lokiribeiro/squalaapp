import {app} from '/client/app.js';

import Applicants from '/imports/models/applicants.js';
import Images from '/imports/models/images.js';
//import ngFileUpload from 'ng-file-upload';



class ApplicationdocumentsCtrl{

  constructor($rootScope, $scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state, Upload){
      'ngInject';

      $scope.applicantID = $rootScope.applicantID;

      $scope.subscribe('applicants', function () {
          return [$scope.getReactively('applicantID')];
      });

      $scope.subscribe('filesimagesall');

      $scope.helpers({
        applicants(){
          var applicantID = $scope.getReactively('applicantID');
          var selector = {_id: applicantID};
          var applicants = Applicants.find(selector);
          var count = applicants.count();
          return applicants;
        },
        uploadedFiles() {
          return Images.find();
        }
      });//helpers

      //$scope.currentUpload = false;
      $scope.uploadFiles = function(file, errFiles) {
        console.log('pasok');
        $scope.progress = 0;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
          console.log(file);
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
            var Fresult = file.result;

            Meteor.call('uploadFileFromClient', filename, path, Fresult, encoding, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log('success maybe?');
              }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                  console.log(response);
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (event) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         event.loaded / event.total));
                $scope.progress = file.progress;
                console.log($scope.progress);
            });


        }
    };


      $scope.here = function() {
        console.log('here');
      };

      $scope.uploadFile = function () {
        console.log('hello');
          /*if (event.target.files && event.target.files[0]) {
            // We upload only one file, in case
            // there was multiple files selected
            console.log('pasok 2');
            var files = event.target.files[0];
            if (files) {
              console.log(files);
              var upload = Images.insert({
                file: event.target.files[0],
                streams: 'dynamic',
                chunkSize: 'dynamic'
              }, false);

              upload.on('start', function() {
                //$scope.currentUpload = true;
                console.log('pasok 3');
              });

              upload.on('end', function(error, fileObj) {
                console.log('pasok 4');
                if (error) {
                  alert('Error during upload: ' + error.reason);
                  console.log('pasok 5');
                } else {
                  alert('File "' + fileObj.name + '" successfully uploaded');
                  console.log('pasok 6');
                }
                //$scope.currentUpload = false;
              });

              upload.start();
            }
          }*/

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

      /*$scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
            });
        }
    }*/



    }
}

app.component('applicationdocuments', {
    templateUrl: 'client/components/admissions/applicationdocuments/applicationdocuments.html',
    controllerAs: 'applicationdocuments',
    controller: ApplicationdocumentsCtrl
})
