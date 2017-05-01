import {app} from '/client/app.js';

import Applicants from '/imports/models/applicants.js';

class GuardianinfoCtrl{

  constructor($scope, $timeout, $mdSidenav, $element, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';

      $scope.applicantID = $rootScope.applicantID;
      $scope.profileID = $rootScope.userID;

      $scope.subscribe('applicants', function () {
          return [$scope.getReactively('applicantID')];
      });

      $scope.helpers({
        applicants(){
          var applicantID = $scope.getReactively('applicantID');
          var selector = {_id: applicantID};
          var applicants = Applicants.find(selector);
          var count = applicants.count();
          return applicants;
        }
      })//helpers

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.toastPosition = angular.extend({},last);

      $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
      };

      function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }


      $scope.editNow = function(){
        $scope.show = !$scope.show;
        console.info('userID', $scope.profileID);
        var profileID = $scope.profileID;
        var selector = {profiles_userID: profileID};
        $scope.results = Profiles.findOne(selector);
      }


        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.updateUser = function(results) {
          $scope.done = true;
          $scope.show = !$scope.show;
          console.log('daan dito');


        }
          //$state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips

      $scope.updateParent = function(detail) {
        console.log(detail);
        if(detail.progress < 35){
          detail.progress = 35;
        };
        $scope.done = true;
        $scope.hide = true;
        var toasted = 'Guardian information updated';
        var pinTo = $scope.getToastPosition();


        Meteor.call('upsertApplicantFromParent', detail, function(err, detail) {
            var detail = detail;
            console.log(detail);
              if (err) {
                  //do something with the id : for ex create profile
                  $scope.done = false;
                  $scope.hide = false;
                  $scope.show = !$scope.show;
                  $scope.$apply();
             } else {
               $scope.done = false;
               $scope.hide = false;
               $scope.show = !$scope.show;
               //simulation purposes
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
             }
          });
      }
    }
}

app.component('guardianinfo', {
    templateUrl: 'client/components/admissions/enroll/guardianinfo/guardianinfo.html',
    controllerAs: 'guardianinfo',
    controller: GuardianinfoCtrl,
    transclude: true
})
