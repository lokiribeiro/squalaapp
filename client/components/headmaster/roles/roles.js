import {app} from '/client/app.js';

import Responsibilities from '/imports/models/responsibilities.js';
import Roles from '/imports/models/roles.js';


class HeadmastercreateroleCtrl{

  constructor($scope, $timeout, $element, $reactive, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.subscribe('responsibilities');

      $scope.helpers({
          responsibilities() {
            $scope.promise = $timeout(function(){
              $scope.done = false;

            }, 2000);
            $scope.done = true;
                var sort  = 1;
                var selector = {};
                var responsibilities = Responsibilities.find(
                      selector, { sort: {responsibility: sort} }
                  );
                return responsibilities;
        }
      })//helpersyy

      //helpers
      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.canCreateProfile = false;

      $scope.register = {
        rolename: '',
        responsibilities: {
          responsibility: '',
          responsibilitiesId : '',
        }
      }

      $scope.error = '';

      //var details = this.credentials;
      var details = $scope.register;

      $scope.createRole = function(details) {
        var resp = Responsibilities.find();
        console.info('user', resp);
        $scope.done = true;
        $scope.existing = false;
        $scope.createdNow = !$scope.createdNow;
        //var status = createUserFromAdmin(details);

        var role = {
          role: '',
          responsibilities: [],
          apps: []
            //responsibilitiesId : '',
            //responsibility: ''
        }

        if (details.responsibilities){
          var length =  details.responsibilities.length;
          console.info('len', length);
        }else{
          var length = 0;
        }

        role.role = details.rolename;

        if(length > 1) {

          var status = Roles.insert(role);

          for (var i=0; i<length; i++) {
            var respId = details.responsibilities[i]._id;
            var respName = details.responsibilities[i].responsibility;
            console.info('respname', respName);
            var selector = {_id: status};
            var modifier = {$push: {responsibilities: {responsibilitiesID: respId, responsibility: respName }}}
            Roles.update(selector,modifier);
          //input.push(i);
          }
        } else if(length !=0) {
            //role.responsibilities = details.responsibilities;
            var roleresp = [];
            roleresp.Id = details.responsibilities[0]._id;
            roleresp.responsibility = details.responsibilities[0].responsibilityname;
            console.info('rolresp', roleresp.responsibility )
            role.responsibilities = roleresp;

            console.info('role', role);

            var status = Roles.insert(role);
            var respId = roleresp.Id;
            var respName = roleresp.responsibility;
            var selector = {_id: status};
            var modifier = {$push: {responsibilities: {responsibilitiesID: respId, responsibility: respName }}}
            var status = Roles.update(selector,modifier);
        } else {
            var status = Roles.insert(role);
        }



        if (status) {
          $scope.registered = details;
          $scope.createdNows = !$scope.createdNows;
          $scope.done = false;
          console.info('success', $scope.registered);
          //simulation purposes
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
     };

      $scope.createAnother = function() {
         $scope.createdNows = !$scope.createdNows;
         $scope.createdNow = !$scope.createdNow;
         //$scope.createdNow = '1';
      }

      $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
      };

      $scope.closeDialog = function() {
         $mdDialog.hide();
         //$scope.createdNow = '1';
       }

       $element.find('input').on('keydown', function(ev) {
          ev.stopPropagation();
      });

     }
}

app.component('headmastercreaterole', {
    templateUrl: 'client/components/headmaster/roles/roles.html',
    controllerAs: 'headmastercreaterole',
    controller: HeadmastercreateroleCtrl
})
