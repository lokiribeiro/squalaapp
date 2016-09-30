import {app} from '/client/app.js';

class ApplicantsCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast){
      'ngInject';

      $scope.subscribe('applicants');


          //$state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('applicants', {
    templateUrl: 'client/components/admissions/applicants/applicants.html',
    controllerAs: 'applicants',
    controller: ApplicantsCtrl,
    transclude: true
})
