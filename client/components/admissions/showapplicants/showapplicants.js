import {app} from '/client/app.js';
import Profiles from '/imports/models/profiles.js';

//import Users from '/imports/models/users.js';

class ShowapplicantsCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q){
      'ngInject';

      $scope.selected = [];
      $scope.itemNow = [];

      console.log('pass');

      $scope.email = {
        address: ''
      };

      $scope.query = {
          order: 'createdAt'
        };

      $scope.perPage = 5;
      $scope.page = 1;
      $scope.sort = -1;
      $scope.searchText = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.items = [];
  $scope.fetching = false;

      $scope.subscribe('users', function () {
          return [$scope.getReactively('searchText')];
      });
      $scope.subscribe('profiles', function () {
        $scope.page = 1;
          return [$scope.getReactively('searchText')];
      });

      $scope.helpers({
        profiles() {
            $scope.doneSearching = true;
            $scope.notdoneSearching = !$scope.doneSearching;

          $scope.promise = $timeout(function(){
            $scope.doneSearching = false;
             $scope.fetching = false;
             $scope.notdoneSearching = !$scope.doneSearching;

          }, 2000);

          var limit = parseInt($scope.getReactively('perPage'));
          var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
          var sort  = $scope.getReactively('sort');
          var selector = {};
          var profiles = Profiles.find(
            selector, { limit: limit, skip: skip, sort: {profiles_lastname: sort} }
          );
          var profileCount = Profiles.find().count();
          $scope.totalProfiles = profileCount;
          var totalProfiles = $scope.totalProfiles;
          var perPage = $scope.perPage;
          var maxPage = parseInt(totalProfiles / perPage);
          var remainder = parseInt(totalProfiles % perPage);
          $scope.remainder = remainder;
          console.info('perPage', perPage);
          console.info('maxPage', maxPage);
          console.info('remainder', remainder);
          if(remainder > 0){
            maxPage = maxPage + 1;
            console.info('remainder > 0', maxPage);
          }
          $scope.maxPage = maxPage;
          /*profiles.forEach(function(profile){
            $scope.items.push(profile);
            console.info('profile', profile);
          })*/
          return profiles;
        },
        totalProfiles(){
          var profileCount = Profiles.find().count();
          $scope.totalProfiles = profileCount;
          return profileCount;
        }
      })//helpers

      $scope.filterShow = function(){
        $scope.filter.show = !$scope.filter.show;
      }

      $scope.loadMore = function (){

        if($scope.page < $scope.maxPage){
          $scope.page++;
        }
      }
      $scope.loadLess = function (){

        if($scope.page > 0){
          $scope.page--;
        }
      }

      $scope.changeSort = function () {
          $scope.sort = parseInt($scope.sort*-1);
      }

      $scope.closeFilter = function(){
        $scope.filter.show = !$scope.filter.show;
        $scope.searchText = null;
      }

      $scope.removeUser = function(userDel) {
        console.info('userid', $scope.selected);
        if(userDel){
          var idNow = $scope.selected[0].id;
          Meteor.users.remove({_id: idNow});
          $scope.deletedNow = false;
          $scope.deletedNows = false;
          $scope.done = false;
          $scope.existing = false;
        }
        else{

          console.info('2', userDel);
        }

        }


      $scope.openDialog = function ($event, selected) {
          $scope.userDel = selected.profiles_userID;
          console.info('userid', $scope.userDel );
          var userDel = $scope.userDel;
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            userDel : $scope.userDel
          },
          controller: function($scope, $mdDialog, userDel){
            $scope.userDel = userDel;
            $scope.deletedNow = false;
            $scope.existing = false;
            $scope.done = false;

            $scope.removeuserNow = function(userDel) {

            $scope.done = true;
            $scope.deletedNow = !$scope.deletedNow;

            Meteor.call('deleteProfileFromAdmin', userDel, function(err, status) {
              if(err) {
                console.log('show error');
              } else {
                console.info('succesful with profile', status);
              }
            });

            Meteor.call('deleteUserFromAdmin', userDel, function(err, userDel) {
                      if (err) {
                          //do something with the id : for ex create profile
                          $scope.done = false;
                          $scope.deletedNow = !$scope.deletedNow;
                          $scope.existing = true;
                          window.setTimeout(function(){
                            $scope.$apply();
                        },2000);
                        //UserProfile.insert({
                            //user: userId
                       //})
                     } else {
                       //simulation purposes
                         $scope.deletedNows = !$scope.deletedNows;
                         $scope.done = false;
                         window.setTimeout(function(){
                         $scope.$apply();
                       },2000);
                     }
                  });
              }

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

        $scope.openProfile = function (selected3) {
          console.info('selected:', selected3.profiles_userID);
          var profileID = selected3.profiles_userID;
          $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
        }



      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('showapplicants', {
    templateUrl: 'client/components/admissions/showapplicants/showapplicants.html',
    controllerAs: 'showapplicants',
    controller: ShowapplicantsCtrl,
    transclude: true
})
