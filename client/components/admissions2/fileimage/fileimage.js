/*import {app} from '/client/app.js';
import { Images } from '/imports/api/images';


class FileimageCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.profileID = $rootScope.profileID;
      $scope.applicantID = $rootScope.applicantID;

      $scope.helpers({
      mainImage() {
        const images = $scope.getReactively('images', true);
        if (images) {
          return Images.findOne({
            _id: images[0]
          });
        }
      }
    });


     }
}

app.component('fileimage', {
    templateUrl: 'client/components/admissions/fileimage/fileimage.html',
    bindings: {
      images: '<'
    },
    controllerAs: 'fileimage',
    controller: FileimageCtrl
})*/
