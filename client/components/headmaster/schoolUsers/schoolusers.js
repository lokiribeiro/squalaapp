import {app} from '/client/app.js';

class SchoolusersCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast){
      'ngInject';

      $scope.subscribe('users');
      

          //$state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('schoolusers', {
    templateUrl: 'client/components/headmaster/schoolUsers/schoolusers.html',
    controllerAs: 'schoolusers',
    controller: SchoolusersCtrl,
    transclude: true
})
