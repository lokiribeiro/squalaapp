import {app} from '/client/app.js';
import Branches from '/imports/models/branches.js';
import Profiles from '/imports/models/profiles.js';

import Courses from '/imports/models/courses.js';
import Classlists from '/imports/models/classlists.js';

class ClassroomcreateclassCtrl{

  constructor($scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.subscribe('users');
      $scope.subscribe('classlists');
      $scope.subscribe('courses');

      $scope.helpers({
          users() {
                var sort  = 1;
                var selector = {};
                var users = Meteor.users.find(
                      selector, { sort: {name: sort} }
                  );
                return users;
        },
        courses() {
          var sort = 1;
          var selector = {};
          var courses = Courses.find(
            selector, { sort: {coursename: sort} }
          );
          console.info('courses', courses);
          return courses;
        }
      })//helpers

      angular.element(document).ready(function () {

          var userDetails = Meteor.userId();
          $scope.userID = userDetails;
          var selector = {profiles_userID: userDetails};
          var profileDetails = Profiles.find(selector);
          var count = profileDetails.count();

          profileDetails.forEach(function(profileDetail){
            $scope.firstname = profileDetail.profiles_firstname;
            $scope.lastname = profileDetail.profiles_lastname;
            $scope.branchName = profileDetail.profiles_branch;
            $scope.branchID = profileDetail.profiles_branchID;
          });

      });


      //helpers
      this.$state = $state;

      $reactive(this).attach($scope);

      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.canCreateProfile = false;

      this.credentials = {
        classname: '',
        section: '',
        courselink: ''
      };

      this.register = {
        classname: '',
        section: '',
        courselink: ''
      }

      this.error = '';

      //var details = this.credentials;
      var details = this.register;

      console.info('details: ', details);

      $scope.createSchool = function(details) {
        var detail = details;

        console.info('detail', details);

        $scope.done = true;
        $scope.existing = false;
        $scope.createdNow = !$scope.createdNow;
        //var status = createUserFromAdmin(details);

        var classlist = [];

        console.info('id', details.courselink._id);

        classlist.classname = details.classname;
        classlist.coursename = details.courselink.coursename;
        classlist.section = details.section;
        classlist.courselinkID = details.courselink._id;
        var name = $scope.firstname + ' ' + $scope.lastname;
        classlist.teacherID = $scope.userID;
        classlist.teachername = name;
        classlist.branchName = $scope.branchName;
        classlist.branchID = $scope.branchID;

        console.info('$scope.userID', $scope.userID);

        var status = Classlists.insert(classlist);
        if(status)        {
          $scope.registered = details;
          $scope.createdNows = !$scope.createdNows;
          $scope.done = false;

        } else {
          $scope.done = false;
          $scope.createdNow = !$scope.createdNow;
          $scope.existing = true;
        }

    }

      $scope.createAnother = function() {
         $scope.createdNows = !$scope.createdNows;
         $scope.createdNow = !$scope.createdNow;
         //$scope.createdNow = '1';
      }

      $scope.closeDialog = function() {
         $mdDialog.hide();
         //$scope.createdNow = '1';
       }

}
}

app.component('classroomcreateclass', {
    templateUrl: 'client/components/classroom/classroomcreateclass/classroomcreateclass.html',
    controllerAs: 'classroomcreateclass',
    controller: ClassroomcreateclassCtrl
})
