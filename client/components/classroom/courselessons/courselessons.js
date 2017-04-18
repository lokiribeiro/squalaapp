import {app} from '/client/app.js';

import Lessonguides from '/imports/models/lessonguides.js';
import ngFileUpload from 'ng-file-upload';


class CourselessonsCtrl{

  constructor($rootScope, $scope, $mdToast, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state, Upload){
      'ngInject';

      $scope.courseID = $rootScope.courseID;

      $scope.subscribe('lessonguides', function () {
          return [$scope.getReactively('courseID')];
      });

      $scope.helpers({
          lessonguides() {
                var courseID = $scope.getReactively('courseID');
                var selector = {courseID : courseID};
                var lessonguides = Lessonguides.find(selector);
                var count = lessonguides.count();
                console.info('courseID', courseID);
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

      $scope.openDetails = function ($event, selected) {
          $scope.teachingGuide = selected;
          console.info('teachingGuide', $scope.teachingGuide );
          var teachingGuide = $scope.teachingGuide;
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            teachingGuide : $scope.teachingGuide
          },
          controller: function($scope, $mdDialog, teachingGuide){
            $scope.results = teachingGuide;
            $scope.courseID = teachingGuide.courseID;
            $scope.subscribe('lessonguides', function () {
                return [$scope.getReactively('courseID')];
            });

            $scope.helpers({
                lessonguides() {
                      var courseID = $scope.getReactively('courseID');
                      var selector = {courseID : courseID};
                      var lessonguides = Lessonguides.find(selector);
                      var count = lessonguides.count();
                      console.info('courseID', courseID);
                      console.info('lessonguides', lessonguides);
                      console.info('count', count);
                      return lessonguides;
                    }
            });//helpers

            $scope.deletedNow = false;
            $scope.existing = false;
            $scope.done = false;

            $scope.updateInfo = function(results) {
              $scope.done = true;
              $scope.updatedNow = true;

              console.log('daan dito')
              $scope.resultsphone = results;
              console.info('ressulta', $scope.resultsphone);
              var selector = {_id: results._id};
              var modifier = {$set: {
                  lessonTitle: results.lessonTitle,
                  description: results.description
              }};

              Lessonguides.update( selector, modifier, function (error, rows) {
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

              $scope.cancelNow = function() {
                $mdDialog.cancel();
              };


          },
          templateUrl: 'client/components/classroom/courselessons/editcourselesson.html',
          targetEvent: $event
        });
        };


      $scope.openDialog = function ($event, selected2) {
        console.info('selected2._id', selected2._id);
        var selectedID = selected2._id;
        var selector = {_id: selectedID};
        $scope.results = Lessonguides.findOne(selector);
        console.info('courses', $scope.results);
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            results : $scope.results
          },
          controller: function($scope, $mdDialog, results){
            $scope.results = results;
            console.info('selected2', $scope.results )
            $scope.updatedNow = false;
            $scope.updatedNows = false;
            $scope.done = false;

            $scope.cancelNow = function() {
              $mdDialog.cancel();
            }

            $scope.updateUser = function(results) {
              $scope.done = true;
              $scope.updatedNow = true;
              console.log('daan dito')
              $scope.resultsphone = results;
              console.info('ressulta', $scope.resultsphone);
              var selector = {_id: results._id};
              var modifier = {$set: {
                  lessonTitle: results.lessonTitle,
                  lessonDescription: results.description
              }};

              Lessonguides.update( selector, modifier, function (error, rows) {
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
          templateUrl: 'client/components/classroom/courselessons/editcourselesson.html',
          targetEvent: $event
        });
        };


        //$scope.currentUpload = false;


      $scope.openMaterials = function (selected) {
        console.info('selected:', selected._id);
        var materialsID = selected._id;
        var courseID = selected.courseID;
        $state.go('ClassroomMaterials', {stateHolder : 'Classroom', userID : Meteor.userId(), courseID: courseID, materialsID : materialsID});
      }

      $scope.openDelete = function ($event, lessonguide) {
          $scope.userDel = lessonguide;
          console.info('userid', $scope.userDel );
          var userDel = $scope.userDel;
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            userDel : $scope.userDel
          },
          controller: function($scope, $mdDialog, userDel){
            $scope.userDel = userDel;
            $scope.deletedNow = false;
            $scope.existing = false;
            $scope.done = false;

            $scope.removeuserNow = function(userDel) {

            $scope.done = true;
            $scope.deletedNow = !$scope.deletedNow;

            var selector = {_id: userDel._id};
            Lessonguides.remove(selector);
            var toasted = 'Lesson removed';

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
          templateUrl: 'client/components/classroom/coursepaneldetails/coursepaneldetails.html',
          targetEvent: $event
        });
        };



    }
}

app.component('courselessons', {
    templateUrl: 'client/components/classroom/courselessons/courselessons.html',
    controllerAs: 'courselessons',
    controller: CourselessonsCtrl
})
