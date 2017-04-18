import {app} from '/client/app.js';
import Applicants from '/imports/models/applicants.js';
import Branches from '/imports/models/branches.js';
import Gradelevels from '/imports/models/gradelevels.js';

class AdmissionsnewapplicationsCtrl{

  constructor($scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.subscribe('branches');
      $scope.subscribe('gradelevels');

      $scope.helpers({
          branches() {
                var selector = {};
                var sort = 1;
                var branches = Branches.find(
                      selector, { sort: {branch_name: sort} }
                  );
                return branches;
        },
        gradelevels() {
              var selector = {};
              var sort = 1;
              var gradelevels = Gradelevels.find(
                    selector, { sort: {level: sort} }
                );
              return gradelevels;
      }
      })//helpers
      //helpers
      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;
      $scope.sort = 1;
      $scope.userID = Meteor.userId();
      var myDetails = Meteor.user();
      $scope.branchID = myDetails.branchId;
      $scope.encoderName = myDetails.name;

      $scope.canCreateProfile = false;

      $scope.register = {
        lastname: ' ',
        middlename: ' ',
        firstname: ' ',
        email: ' ',
        application: ' ',
        branchID: ' ',
        branchname: ' ',
        gradelevelid: ' ',
        gradelevel: ' ',
        guardian: ' ',
        status: ' ',
        encodedBy: ' ',
        photo: ' ',
        encoderName: ' ',
        createdAt: ' '
      }

      $scope.error = ' ';




      var details = $scope.register;
      $form = $scope.register;

      console.log('details: ' + details);
      console.log('form: ' + $form);

      $scope.createUser = function(details) {
        var detail = details;
        var appNumber = Random.hexString(8);
        detail.application = 'SY17' + appNumber;
        detail.branchID = details.branch._id;
        detail.branchname = details.branch.branch_name;
        detail.gradelevelid = details.gradelevel._id;
        detail.gradelevel = details.gradelevel.gradelevel;
        detail.guardian = details.guardian;
        detail.phone = details.phone;
        console.info('branchID', detail.branchID);
        detail.status = 'New application';
        detail.encodedBy = $scope.userID;
        detail.photo = '../../assets/img/applicants/user.jpg';
        detail.encoderName = $scope.encoderName;
        var date = new Date();
        detail.createdAt = date.toJSON();
        $scope.done = true;
        $scope.existing = false;
        $scope.createdNow = !$scope.createdNow;
        var progress = 10;
        //var status = createUserFromAdmin(details);

        Meteor.call('createApplicantFromAdmin', detail.firstname, detail.middlename, detail.lastname, detail.email, detail.status, detail.application, detail.branchID, detail.encodedBy, detail.photo, detail.encoderName, detail.createdAt, detail.gradelevel, detail.branchname, detail.gradelevelid, detail.guardian, detail.phone, progress, function(err, detail) {
              var detail = detail;
              console.log(detail);
                if (err) {
                    //do something with the id : for ex create profile
                    $scope.done = false;
                    $scope.createdNow = !$scope.createdNow;
                    $scope.existing = true;
                    window.setTimeout(function(){
                    $scope.$apply();
                  },2000);
               } else {
                 var newuserID = detail;
                 console.info('newuserID', newuserID);
                 $scope.registered = details;
                 $scope.newUserID = newuserID;
                 $scope.applicantID = newuserID;
                 //simulation purposes
                 $scope.createdNows = !$scope.createdNows;
                 $scope.done = false;
                 //simulation purposes
                 window.setTimeout(function(){
                 $scope.$apply();
               },2000);
               }
            });

      }

      $scope.viewAppForm = function () {
        var applicantID = $scope.applicantID;
        $state.go('AdmissionsApplicantform', {stateHolder : 'Admissions', userID : Meteor.userId(), applicantID : applicantID});
        $mdDialog.hide();
      }

      $scope.closeDialog = function() {
         $mdDialog.hide();
         //$scope.createdNow = '1';
       }


     }
}

app.component('admissionsnewapplications', {
    templateUrl: 'client/components/admissions/enroll/newApplication/newapplication.html',
    controllerAs: 'admissionsnewapplications',
    controller: AdmissionsnewapplicationsCtrl
})
