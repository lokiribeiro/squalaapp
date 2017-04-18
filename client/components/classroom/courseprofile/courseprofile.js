import {app} from '/client/app.js';

import Courses from '/imports/models/courses.js';


class CourseprofileCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
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
                console.info('courses', courses);
                return courses;
              }
      });//helpers

      $scope.openDialog = function ($event) {
          console.info('courseID', $scope.courseID);
          var profileID = $scope.courseID;
          var selector = {_id: courseID};
          $scope.results = Courses.findOne(selector);
          console.info('courses', $scope.results);
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            courseID : $scope.courseID,
            results : $scope.results
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

            $scope.updateUser = function(results) {
              $scope.done = true;
              $scope.updatedNow = true;
              console.log('daan dito')
              $scope.resultsphone = results;
              console.info('ressulta', $scope.resultsphone);
              var selector = {_id: results._id};
              var modifier = {$set: {
                  coursename: results.coursename,
                  coursedescription: results.coursedescription,
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
          templateUrl: 'client/components/classroom/courseprofile/editcourse.html',
          targetEvent: $event
        });
        };
    }
}

app.component('courseprofile', {
    templateUrl: 'client/components/classroom/courseprofile/courseprofile.html',
    controllerAs: 'courseprofile',
    controller: CourseprofileCtrl
})
