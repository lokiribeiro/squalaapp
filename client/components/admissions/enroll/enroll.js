import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';

class EnrollCtrl{

  constructor($scope, $timeout, $window, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, $rootScope, $document){
      'ngInject';


      $scope.thisUser = Meteor.userId();


      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.sort = 1;

      $scope.subscribe('profilesUser', function () {
          return [$scope.getReactively('thisUser')];
      });

      $scope.subscribe('users');


      $scope.hidden = false;
      $scope.isOpen = false;
      $scope.hover = false;
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
      $scope.$watch('demo.isOpen', function(isOpen) {
        if (isOpen) {
          $timeout(function() {
            $scope.tooltipVisible = $scope.isOpen;
          }, 600);
        } else {
          $scope.tooltipVisible = $scope.isOpen;
        }
      });      


    }
}

app.component('enroll', {
    templateUrl: 'client/components/admissions/enroll/enroll.html',
    controllerAs: 'enroll',
    controller: EnrollCtrl
})
