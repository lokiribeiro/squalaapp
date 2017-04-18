import {app} from '/client/app.js';

import Lessonguides from '/imports/models/lessonguides.js';
import ngFileUpload from 'ng-file-upload';


class LessonfilesCtrl{

  constructor($rootScope, $scope, $mdToast, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state, Upload){
      'ngInject';

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

      $scope.updatedNow = false;
      $scope.updatedNows = false;
      $scope.done = false;



      $scope.openMaterials = function (selected) {
        console.info('selected:', selected._id);
        var materialsID = selected._id;
        $state.go('ClassroomMaterials', {stateHolder : 'Classroom', userID : Meteor.userId(), materialsID : materialsID});
      }

      $scope.openDelete = function ($event, lessonguide, resource) {
          $scope.userDel = lessonguide;
          $scope.resource = resource;
          console.info('userid', $scope.userDel );
          console.info('resource', $scope.resource );
          var userDel = $scope.userDel;
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            userDel : $scope.userDel,
            resource : resource
          },
          controller: function($scope, $mdDialog, userDel, resource){
            $scope.userDel = userDel;
            $scope.resource = resource;
            $scope.deletedNow = false;
            $scope.existing = false;
            $scope.done = false;

            $scope.removeuserNow = function(resource) {

            $scope.done = true;
            $scope.deletedNow = !$scope.deletedNow;
            var fileName = resource.filename

            var selector = {_id: userDel._id};
            var modifier = {$pull: {resources: {filename: fileName }}}
            Lessonguides.update(selector,modifier);
            var toasted = 'Material removed';

                 $scope.deletedNows = !$scope.deletedNows;
                         $scope.done = false;
                         window.setTimeout(function(){
                         $scope.$apply();
                       },2000);
              }

              $scope.cancelNow = function() {
                $mdDialog.cancel();
              };


          },
          templateUrl: 'client/components/classroom/lessonfiles/deletelessonfiles.html',
          targetEvent: $event
        });
        };



    }
}

app.component('lessonfiles', {
    templateUrl: 'client/components/classroom/lessonfiles/lessonfiles.html',
    controllerAs: 'lessonfiles',
    controller: LessonfilesCtrl
})
