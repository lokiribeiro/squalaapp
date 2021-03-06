import {app} from '/client/app.js';


class ApplicationformCtrl{

  constructor($rootScope, $scope, $mdToast, $timeout, $mdSidenav, $log, $mdDialog, $state, Upload){
      'ngInject';

      $scope.applicantID = $rootScope.applicantID;
      $scope.profileID = $rootScope.userID;

      $scope.subscribe('applicants', function () {
          return [$scope.getReactively('applicantID')];
      });

      $scope.subscribe('profilesUser', function () {
          return [$scope.getReactively('thisUser')];
      });

      $scope.sort = -1;

      $scope.helpers({
        applicants(){
          var applicantID = $scope.getReactively('applicantID');
          var selector = {_id: applicantID};
          var applicants = Applicants.find(selector);
          var count = applicants.count();
          return applicants;
        }
      });//helpers

      $scope.rolesID = null;
      $scope.doneSearching = false;
      $scope.showAll = false;

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

      $scope.showMoreAll = function () {
          $scope.showAll = !$scope.showAll;
      };

      $scope.selected2 = [];

      $scope.thisUser = Meteor.userId();

      $scope.openProfile2 = function (selected2) {
        console.info('selected:', selected2[0].profiles_userID);
        var profileID = selected2[0].profiles_userID;
        $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      }

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

      $scope.openDialog = function($event) {
        console.info('selected', $scope.selected2);
        var selected = $scope.selected2;
        $mdDialog.show({
        clickOutsideToClose: false,
        escapeToClose: true,
        transclude: true,
        locals:{
          selected : $scope.selected2
        },
        controller: function($scope, $mdDialog, selected){
          $scope.selected = selected;
          console.info('selected', $scope.selected )
          $scope.updatedNow = false;
          $scope.updatedNows = false;
          $scope.done = false;

          $scope.moreinfo = {
            religion: '',
            birthdate: '',
            gradecompleted: '',
            address: '',
            city: '',
            schooltype: '',
            elemcontactnum: '',
            elemgrad: '',
            elemaddress: '',
            elemschool: '',
            highschool: '',
            highaddress: '',
            highcontactnum: '',
            highschooltype: '',
            highreason: '',
            parentname: '',
            relation: '',
            parentnum: '',
            parentemail: ''



          }

          $scope.items = [
            {value: 'grade1', name: 'Grade 1'},
            {value: 'grade2', name: 'Grade 2'},
            {value: 'grade3', name: 'Grade 3'},
            {value: 'grade4', name: 'Grade 4'},
            {value: 'grade5', name: 'Grade 5'},
            {value: 'grade6', name: 'Grade 6'},
            {value: 'grade7', name: 'Grade 7'},
            {value: 'grade8', name: 'Grade 8'},
            {value: 'grade9', name: 'Grade 9'},
            {value: 'grade10', name: 'Grade 10'},
            {value: 'grade11', name: 'Grade 11'},
            {value: 'grade12', name: 'Grade 12'}
          ];

          $scope.closeDialog = function() {
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
                profiles_firstname: results.profiles_firstname,
                profiles_lastname: results.profiles_lastname,
                profiles_email: results.profiles_email,
                profiles_phone: results.profiles_phone,
                profiles_birthday: results.profiles_birthday,
                profiles_gender: results.profiles_gender
            }};

            Profiles.update( selector, modifier, function (error, rows) {
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
        templateUrl: 'client/components/admissions/newAppDetails/newappdetails.html',
        targetEvent: $event
      });
      };

       $scope.removeUser = function($event, item) {
         // Show the dialog
         $scope.passedId = item._id;
         console.info('unassign', $scope.passedId);

         $mdDialog.show({
           clickOutsideToClose: false,
           escapeToClose: true,
           transclude: true,
           locals: {
             passedId: $scope.passedId
           },
           controller: function($mdDialog, passedId, $scope) {
               $scope.passedId = passedId;

               $scope.removeNow = function() {
                   var userID = $scope.passedId;

                   $scope.done = true;
                   $scope.existing = false;
                   $scope.createdNow = !$scope.createdNow;
                   //var status = createUserFromAdmin(details);
                   var selector = {_id:userID};
                   var err = Applicants.remove(selector);

                   if (err) {
                     $scope.createdNows = !$scope.createdNows;
                     $scope.done = false;
                     $scope.selected3 = '';
                     //delete old apps
                     window.setTimeout(function(){
                       $scope.$apply();
                     },2000);
                       //do something with the id : for ex create profile
                     } else {
                       $scope.done = false;
                       $scope.createdNow = !$scope.createdNow;
                       $scope.existing = true;
                       window.setTimeout(function(){
                         $scope.$apply();
                       },2000);

                     }

                 }

                 $scope.closeDialog = function() {
                   $mdDialog.cancel();
                 };
               },
               templateUrl: 'client/components/admissions/removeDialogs/deleteapplicant.html',
               targetEvent: $event
             });
           }

           $scope.associateFees = function(applicantID, feesID) {

             Meteor.call('upsertFeesFromAdmissions', applicantID, feesID, function(err, stats) {
               if (err) {
                 var toasted = 'Error assigning fee.';
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
            }else {
              var toasted = 'Fee category changed';
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
        };

        $scope.goBack = function () {
          $state.go('AdmissionsEnroll', {stateHolder : 'Admissions', userID : Meteor.userId()});
          $mdDialog.hide();
        }

    }
}

app.component('applicationform', {
    templateUrl: 'client/components/admissions/enroll/applicationform/applicationform.html',
    controllerAs: 'applicationform',
    controller: ApplicationformCtrl
})
