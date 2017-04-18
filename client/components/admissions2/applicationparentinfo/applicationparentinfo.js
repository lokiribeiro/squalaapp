import {app} from '/client/app.js';

import Applicants from '/imports/models/applicants.js';


class ApplicationparentinfoCtrl{

  constructor($rootScope, $scope, $mdToast, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.applicantID = $rootScope.applicantID;

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
      });//helpers

      $scope.done = false;
      $scope.hide = false;

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

      $scope.updateParent = function(detail) {
        console.log(detail);
        if(detail.progress < 35){
          detail.progress = 35;
        };
        $scope.done = true;
        $scope.hide = true;
        var toasted = 'Parent information updated';
        var pinTo = $scope.getToastPosition();


        Meteor.call('upsertApplicantFromParent', detail, function(err, detail) {
            var detail = detail;
            console.log(detail);
              if (err) {
                  //do something with the id : for ex create profile
                  $scope.done = false;
                  $scope.hide = false;
                  $scope.$apply();
             } else {
               $scope.done = false;
               $scope.hide = false;
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

app.component('applicationparentinfo', {
    templateUrl: 'client/components/admissions/applicationparentinfo/applicationparentinfo.html',
    controllerAs: 'applicationparentinfo',
    controller: ApplicationparentinfoCtrl
})
