import {app} from '/client/app.js';

import Applicants from '/imports/models/applicants.js';


class ApplicationbasicinfoCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
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



    }
}

app.component('applicationbasicinfo', {
    templateUrl: 'client/components/admissions/applicationbasicinfo/applicationbasicinfo.html',
    controllerAs: 'applicationbasicinfo',
    controller: ApplicationbasicinfoCtrl
})
