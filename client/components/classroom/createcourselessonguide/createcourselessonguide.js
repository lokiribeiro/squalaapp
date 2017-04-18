import {app} from '/client/app.js';
import Courses from '/imports/models/courses.js';
import Lessonguides from '/imports/models/lessonguides.js';
import ngFileUpload from 'ng-file-upload';

class CreatecourselessonguideCtrl{

  constructor($rootScope, $scope, $mdToast, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state, Upload){
      'ngInject';

      $scope.helpers({
        lessonguides(){
          //var sort = 1;
          //var selector = {};
          //var modifier= {sort: {profiles_firstname: sort}};
          var selector = {};
          var lessonguides = Lessonguides.find(selector);
          var count = lessonguides.count();
          console.info('profiles', lessonguides);
          console.info('count', count);
          return lessonguides;
        }
      })

      //helpers

      Slingshot.fileRestrictions("myFileUploads", {
      allowedFileTypes: null,
      maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
      });

      $scope.uploader = new Slingshot.Upload('myFileUploads');
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

      this.$state = $state;
      $scope.userID = Meteor.userId();
      var myDetails = Meteor.user();
      $scope.encoderName = myDetails.name;
      $scope.courseID = $rootScope.courseID;

      $reactive(this).attach($scope);

      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.canCreateProfile = false;

      this.credentials = {
        lessonTitle: '',
        courseId: ''
      };

      this.register = {
        lessonTitle: '',
        courseId: ''
      }

      this.error = '';

      var details = this.credentials;
      this.register = details;

      console.log('details: ' + details);

      $scope.createUser = function(details) {
        var detail = details;

        var lessonguide = [];

        lessonguide.lessonTitle = details.lessonTitle;
        lessonguide.courseID = $scope.courseID;
        lessonguide.createdAt = new Date();        
        console.log('lessonTitle: ' + lessonguide.lessonTitle);

        var status = Lessonguides.insert(lessonguide);
        if(status) {
          $scope.createdNows = true;
          $scope.createdNow = true;
          $scope.done = false;
        } else {
          $scope.done = false;
          $scope.createdNow = true;
          $scope.existing = true;
        }

      }

        $scope.createAnother = function() {
           $scope.createdNows = !$scope.createdNows;
           $scope.createdNow = !$scope.createdNow;
           //$scope.createdNow = '1';
      }

      //$scope.currentUpload = false;
      $scope.uploadFiles = function(file, errFiles, courseID, lessonID) {
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
              Meteor.call('upsertLessonguide', applicantID, progress, function(err, detail) {
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
        { name: "Add course", icon: "../../assets/img/white_addperson24.svg", direction: "left" },
        { name: "Add multiple courses", icon: "../../assets/img/white_people24.svg", direction: "left" },
        ];

      $scope.closeDialog = function() {
         $mdDialog.hide();
         //$scope.createdNow = '1';
    }

}
}

app.component('createcourselessonguide', {
    templateUrl: 'client/components/classroom/createcourselessonguide/createcourselessonguide.html',
    controllerAs: 'createcourselessonguide',
    controller: CreatecourselessonguideCtrl
})
