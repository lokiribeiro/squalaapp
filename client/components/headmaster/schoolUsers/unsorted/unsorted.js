import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Branches from '/imports/models/branches.js';
import Roles from '/imports/models/roles.js';

class UnsortedCtrl{

  constructor($scope, $timeout, $mdSidenav, $element, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';

      $scope.rolesID = null;

      $scope.selected6 = [];
      $scope.items = [
        { name: "Non-teaching staff", type: "Non-teaching staff"},
        { name: "Teacher", type: "Teacher"},
        { name: "Student", type: "Student"},
        { name: "Parent", type: "Parent"}
      ];

      $scope.branchID = $rootScope.branchID;
      $scope.subBranchID = $rootScope.branchID;
      console.info('branch', $scope.branchID );
      var branchId =   $scope.branchID ;

      $scope.show = false;

      $scope.perPage = 10;
      $scope.page = 1;
      $scope.page2 = 1;
      $scope.sort = 1;
      $scope.searchText = null;
      $scope.searchText2 = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;
      $scope.last = false;

      $scope.sort2 = 1;
      $scope.enabled = [];
      $scope.installed = [];

      $scope.subscribe('profilesUnsorted', function () {
          return [$scope.getReactively('searchText')];
      });

      $scope.subscribe('branchesProfile', function () {
          return [$scope.getReactively('subBranchID')];
      });

      $scope.subscribe('roles2', function () {
          return [$scope.getReactively('rolesID')];
      });

      $scope.helpers({
          profiles(){
            //var sort = 1;
            //var selector = {};
            //var modifier= {sort: {profiles_firstname: sort}};
            var branchID = $scope.branchID;
            var type = null;
            var selector = {profiles_branchID: branchID, $and: [{profiles_type: type}]};
            var profiles = Profiles.find(selector);
            var count = profiles.count();
            console.info('profiles', profiles);
            console.info('count', count);
            return profiles;
          },
          totalProfiles(){
            var branchID = $scope.branchID;
            var type = null;
            var selector = {profiles_branchID: branchID, $and: [{profiles_type: type}]};
            var profiles = Profiles.find(selector);
            var count = profiles.count();
            return count;
          },
          branches(){
            var branchID = $scope.branchID;
            var branches = Branches.find(branchID);
            return branches;
          },
          roles() {
            return Roles.find();
          }

      })//helpers

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.toastPosition = angular.extend({},last);

      $scope.openProfile2 = function (selected6) {
        console.info('selected:', selected6[0].profiles_userID);
        var profileID = selected6[0].profiles_userID;
        $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      }

      $scope.announceClick = function($event, itemTypes, profileId, firstname, lastname) {
        var item = itemTypes.type;
        console.info('profileID', profileId);
        console.log(profileId);

        Meteor.call('upsertProfileFromSort', profileId, item, function(err, detail) {
            if (err) {
              console.log('error here');
            } else{
              $mdDialog.show(
                $mdDialog.alert()
                  .title('User sorted')
                  .textContent(firstname + ' ' + lastname + ' had been sorted to ' + item)
                  .ok('Done')
                  .targetEvent($event)
              );
            }
          });

        };


      $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
      };

      function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }

      $scope.pageChange = function (newPageNumber) {
          $scope.page = newPageNumber;
      };

      $scope.showMore = function () {
          $scope.show = !$scope.show;
      };

      $scope.removeUser = function($event, item) {
        // Show the dialog
        console.info('unassign', item[0].profiles_userID);
        $scope.passedId = item[0].profiles_userID;
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            passedId: $scope.passedId
          },
          transclude: true,
          controller: function($mdDialog, passedId, $scope) {
              $scope.passedId = passedId;

              $scope.removeNow = function() {
                  var userID = $scope.passedId;
                  var userType = '';
                  var branchId = '';

                  $scope.done = true;
                  $scope.existing = false;
                  $scope.createdNow = !$scope.createdNow;
                  //var status = createUserFromAdmin(details);
                  $scope.register = Meteor.call('upsertProfileFromStaff', userID, userType, branchId, function(err, userID) {
                    if (err) {
                      $scope.done = false;
                      $scope.createdNow = !$scope.createdNow;
                      $scope.existing = true;
                      window.setTimeout(function(){
                        $scope.$apply();
                      },2000);
                      //do something with the id : for ex create profile
                    } else {
                      $scope.createdNows = !$scope.createdNows;
                      $scope.done = false;
                      $scope.selected6 = '';
                      //delete old apps
                      window.setTimeout(function(){
                        $scope.$apply();
                      },2000);
                    }
                  });
                }

                $scope.closeDialog = function() {
                  $mdDialog.cancel();
                };
              },
              templateUrl: 'client/components/headmaster/schoolUsers/removeUser/removeuser.html',
              targetEvent: $event
            });
          }




      $scope.filterShow = function(){
        $scope.filter.show = !$scope.filter.show;
      }

      $scope.changeSort = function () {
          $scope.sort = parseInt($scope.sort*-1);
      }

      $scope.closeFilter = function(){
        $scope.filter.show = !$scope.filter.show;
        $scope.selected6 = [];
        $scope.searchText = null;
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


        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };
          //$state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('unsorted', {
    templateUrl: 'client/components/headmaster/schoolUsers/unsorted/unsorted.html',
    controllerAs: 'unsorted',
    controller: UnsortedCtrl,
    transclude: true
})
