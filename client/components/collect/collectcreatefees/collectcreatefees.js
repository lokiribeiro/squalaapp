import {app} from '/client/app.js';

import Feescategories from '/imports/models/feescategories.js';


class CollectcreatefeesCtrl{

  constructor($scope, $timeout, $element, $reactive, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.subscribe('feescategories');

      //helpers
      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.canCreateProfile = false;

      $scope.register = {
        feesName: '',
        description: '',
        discount: ''
      };

      $scope.error = '';

      //var details = this.credentials;
      var details = $scope.register;

      $scope.createRole = function(details) {
        $scope.done = true;
        $scope.existing = false;
        $scope.createdNow = !$scope.createdNow;
        //var status = createUserFromAdmin(details);

        var fees = {
          feesName: '',
          description: '',
          discount: ''
        }


        fees.feesName = details.feesName;
        fees.description = details.description;
        fees.discount = details.discount;

          var status = Feescategories.insert(fees);
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

app.component('collectcreatefees', {
    templateUrl: 'client/components/collect/collectcreatefees/collectcreatefees.html',
    controllerAs: 'collectcreatefees',
    controller: CollectcreatefeesCtrl
})
