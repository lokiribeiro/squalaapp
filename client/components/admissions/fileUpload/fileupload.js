/*import {app} from '/client/app.js';

import { upload } from '/imports/api/images';
import { Thumbs } from '/imports/api/images';


class FileuploadCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.profileID = $rootScope.profileID;
      $scope.applicantID = $rootScope.applicantID;

      $scope.uploaded = [];

      $scope.subscribe('thumbs', () => [
      $scope.getReactively('files', true) || []
    ]);

    $scope.helpers({
      thumbs() {
        return Thumbs.find({
          originalStore: 'images',
          originalId: {
            $in: $scope.getReactively('files', true) || []
          }
        });
      },
      save() {
        upload($scope.myCroppedImage, $scope.applicantID, $scope.$bindToContext((file) => {
          $scope.uploaded.push(file);
          if (!$scope.files || !$scope.files.length) {
                  this.files = [];
                }
                $scope.files.push(file._id);

          $scope.reset();
        }), (e) => {
          console.log('Oops, something went wrong', e);
        });
      },

      reset() {
        $scope.cropImgSrc = undefined;
        $scope.myCroppedImage = '';
      }
    });



      $scope.addImages = function(files) {
          if (files.length) {
            $scope.currentFile = files[0];

            const reader = new FileReader;

            reader.onload = $scope.$bindToContext((e) => {
              $scope.cropImgSrc = e.target.result;
              $scope.myCroppedImage = '';
            });

            reader.readAsDataURL(files[0]);
          } else {
            $scope.cropImgSrc = undefined;
          }
        }


     }
}

app.component('fileupload', {
    templateUrl: 'client/components/admissions/fileUpload/fileupload.html',
    controllerAs: 'fileupload',
    bindings: {
    files: '=?'
  },
    controller: FileuploadCtrl
})*/
