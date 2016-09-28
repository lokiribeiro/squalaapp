import {app} from '/client/app.js';

import Responsibilities from '/imports/models/responsibilities.js';
import Roles from '/imports/models/roles.js';


class HeadmastercreaterespCtrl{

  constructor($scope, $timeout, $element, $reactive, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.subscribe('roles');

      $scope.helpers({
          roles() {
              $scope.done = $timeout(function(){
                $scope.done = false;

              }, 2000);
                var sort  = 1;
                var selector = {};
                var roles = Roles.find(
                      selector, { sort: {role: sort} }
                  );
                return roles;
        }
      })//helpers

      this.$state = $state;

      $reactive(this).attach($scope);

      //helpers
      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.canCreateProfile = false;

      this.register = {
        responsibilityname: '',
        rolename: {
          role: '',
          roleId: ''
        }
      }

      this.toMake = {
        responsibilityname: ''
      }

      $scope.error = '';
      //var details = this.credentials;
      var details = this.register;
      $scope.name = this.register.responsibilityname;
      var name = $scope.name;

      console.info('leion',   $scope.name);
      console.info('leiosn',    details);


      $scope.createResponsibility = function(details, name) {
        $scope.done = true;
        $scope.existing = false;
        $scope.createdNow = !$scope.createdNow;
        //var status = createUserFromAdmin(details);

        console.info('leion',   $scope.name);
        console.info('leiosn',    details);

        if(details.rolename){
            var length =  details.rolename.length;
        }else{
          var length = 0;
        }
        var responsibilityName = details.responsibilityname;
        //var responsibilityName2 = $scope.register.responsibilityname;
        console.info('34', responsibilityName);

        var makeNow = [];
        makeNow.responsibilityname = responsibilityName;

        var status = Responsibilities.insert(makeNow);
        console.info('status', status);

        if(length > 1) {

          for (var i=0; i<length; i++) {
            var respId = details.rolename[i]._id;
            var respName = responsibilityName
            console.info('respname', respId);
            var selector = {_id: respId};
            var modifier = {$push: {responsibilities: {responsibilitiesID: status, responsibility: respName }}}
            Roles.update(selector,modifier);
          //input.push(i);
          }
        } else if(length != 0){
          var respId = details.rolename[0]._id;
          var respName = responsibilityName
          console.info('respname', respId);
          var selector = {_id: respId};
          var modifier = {$push: {responsibilities: {responsibilitiesID: status, responsibility: respName }}}
          Roles.update(selector,modifier);

        }

        if (status) {
          $scope.registered = details;
          $scope.createdNows = !$scope.createdNows;
          $scope.done = false;
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
       };

       $element.find('input').on('keydown', function(ev) {
          ev.stopPropagation();
      });

     }
}

app.component('headmastercreateresp', {
    templateUrl: 'client/components/headmaster/responsibilities/responsibilities.html',
    controllerAs: 'headmastercreateresp',
    controller: HeadmastercreaterespCtrl
})
