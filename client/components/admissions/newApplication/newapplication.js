import {app} from '/client/app.js';
import Applicants from '/imports/models/applicants.js';

class AdmissionsnewapplicationCtrl{

  constructor($scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      //helpers
      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;
      $scope.userID = Meteor.userId();
      var myDetails = Meteor.user();
      $scope.branchID = myDetails.branchId;
      $scope.encoderName = myDetails.name;

      $scope.canCreateProfile = false;

      $scope.register = {
        lastname: '',
        middlename: '',
        firstname: '',
        email: '',
        application: '',
        branch: '',
        status: '',
        encodedBy: '',
        photo: '',
        encoderName: '',
        createdAt: ''
      }

      $scope.error = '';

      var details = $scope.register;
      $form = $scope.register;

      console.log('details: ' + details);
      console.log('form: ' + $form);

      $scope.createUser = function(details) {
        var detail = details;
        var appNumber = Random.hexString(8);
        detail.application = appNumber;
        detail.branch = $scope.branchID;
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

        Meteor.call('createApplicantFromAdmin', detail.firstname, detail.middlename, detail.lastname, detail.email, detail.status, detail.application, detail.branch, detail.encodedBy, detail.photo, detail.encoderName, detail.createdAt, progress, function(err, detail) {
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
                 $scope.registered = details;
                 $scope.newUserID = newuserID;
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

app.component('admissionsnewapplication', {
    templateUrl: 'client/components/admissions/newApplication/newapplication.html',
    controllerAs: 'admissionsnewapplication',
    controller: AdmissionsnewapplicationCtrl
})
