import {app} from '/client/app.js';
import Courses from '/imports/models/courses.js';

class ClassroomcreatecourseCtrl{

  constructor($scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      //helpers
      this.$state = $state;
      $scope.userID = Meteor.userId();
      var myDetails = Meteor.user();
      $scope.encoderName = myDetails.name;

      $reactive(this).attach($scope);

      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.canCreateProfile = false;

      this.credentials = {
        coursename: '',
        coursedescription: '',
        encoder: '',
        encoderName: ''
      };

      this.register = {
        coursename: '',
        coursedescription: '',
        encoder: '',
        encoderName: ''
      }

      this.error = '';

      var details = this.credentials;
      this.register = details;

      console.log('details: ' + details);

      $scope.createUser = function(details) {
        var detail = details;
        detail.encoder = $scope.userID;

        var course = [];

        course.coursename = details.coursename;
        course.coursedescription = details.coursedescription;
        console.log('coursename: ' + course.coursename);
        course.encoder = $scope.userID;
        course.encoderName = $scope.encoderName;

        var status = Courses.insert(course);
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

app.component('classroomcreatecourse', {
    templateUrl: 'client/components/classroom/createcourses/createcourses.html',
    controllerAs: 'classroomcreatecourse',
    controller: ClassroomcreatecourseCtrl
})
