import {app} from '/client/app.js';

import Roles from '/imports/models/roles.js';

import Profiles from '/imports/models/profiles.js';

//import Users from '/imports/models/users.js';

class RolestableCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q){
      'ngInject';

      $scope.selected = {
        role: '',
        responsibilities: {
          responsibility: '',
          responsibilityId: ''
        }
      };

      $scope.show = false;

      $scope.perPage = 5;
      $scope.page = 1;
      $scope.sort = 1;
      $scope.searchText = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;
      $scope.last = false;

      $scope.sort2 = 1;
      $scope.enabled = [];

      $scope.subscribe('profiles', function () {
          return [$scope.getReactively('searchTexts')];
      });

      $scope.helpers({
          profiles(){
            var sort = 1;
            //var role = $scope.getReactively('selected._id');
            //console.info('role', role);
            //var selector = {profiles_userroleID: role};
            //var modifier = {sort: {profiles_firstname: sort}};
            var profiles = []
            profiles = Profiles.find();
            console.info('profiles', profiles);
            return profiles;
          }
      })//helpers

      $scope.filterShow = function(){
        $scope.filter.show = !$scope.filter.show;
      }

      $scope.changeSort = function () {
          $scope.sort = parseInt($scope.sort*-1);
      }

      $scope.closeFilter = function(){
        $scope.filter.show = !$scope.filter.show;
        $scope.searchText = '';
      }

      $scope.removeRole = function(roleDel) {
        console.info('userid', $scope.selected);
        if(roleDel){
          var idNow = $scope.selected[0]._id;
          Roles.remove({_id: idNow});
          $scope.deletedNow = false;
          $scope.deletedNows = false;
          $scope.done = false;
          $scope.existing = false;
        }
        else{

          console.info('2', roleDel);
        }

        }

      $scope.$watch('searchText', function (newValue, oldValue) {
        if(!oldValue) {
          bookmark = $scope.page;
        }

        if(newValue !== oldValue) {
          $scope.page = 1;
        }

        if(!newValue) {
          $scope.page = bookmark;
        }
      });

      $scope.openDialog = function ($event, selected) {
          $scope.roleDel = selected[0]._id;
          console.info('userid', $scope.roleDel );
          var roleDel = $scope.roleDel;
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            roleDel : $scope.roleDel
          },
          controller: function($scope, $mdDialog, roleDel){
            $scope.roleDel = roleDel;
            $scope.deletedNow = false;
            $scope.existing = false;
            $scope.done = false;

            $scope.removeroleNow = function(roleDel) {

            $scope.done = true;
            $scope.deletedNow = !$scope.deletedNow;

            var err = Roles.remove(roleDel);

            if (!err) {
                //do something with the id : for ex create profile
                $scope.done = false;
                $scope.deletedNow = !$scope.deletedNow;
                $scope.existing = true;
                window.setTimeout(function(){
                  $scope.$apply();
              },2000);
            } else {
             //simulation purposes
               $scope.deletedNows = !$scope.deletedNows;
               $scope.done = false;
               window.setTimeout(function(){
               $scope.$apply();
               },2000);
             }
            };


        $scope.cancelNow = function() {
          $mdDialog.cancel();
        };


        },
          templateUrl: 'client/components/headmasterUser/showUsers/deleteuser.html',
          targetEvent: $event
        });
        };

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.openProfile = function (selected) {
          console.info('selected:', selected[0]._id);
          var profileID = selected[0]._id;
          $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
        }



      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('rolestable', {
    templateUrl: 'client/components/headmasterRole/rolesTable/rolestable.html',
    controllerAs: 'rolestable',
    controller: RolestableCtrl,
    transclude: true
})
