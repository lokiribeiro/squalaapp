import {app} from '/client/app.js';

import Headmasters from '/imports/models/headmasters.js'
import Profiles from '/imports/models/profiles.js';
import Branches from '/imports/models/branches.js';

class HeadmasterCtrl{

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
      $scope.searchText = null;

      $scope.subscribe('profilesUser', function () {
          return [$scope.getReactively('thisUser')];
      });

      $scope.subscribe('branches', function () {
          return [$scope.getReactively('searchText')];
      });

      $scope.subscribe('headmasters', function () {
          return [$scope.getReactively('searchTexts')];
      });

      $scope.subscribe('users');

      $scope.helpers({
        headmasters() {
              var headmasters = Headmasters.find();
              return headmasters;
            },
        branches() {
                  $scope.promise = $timeout(function(){

                  }, 2000);
                  //var limit = parseInt($scope.getReactively('perPage'));
                  //var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
                  var sort  = $scope.getReactively('sort');
                  var selector = {};
                  var branches = Branches.find(
                        selector, { sort: {branches_city: sort} }
                    );
                  return branches;
                },
        totalBranches(){
                var branch = 'branch';
                var selector = {branches_type: branch};
                return Branches.find(selector).count();
                }
        /*loggedInRole() {
              var userID = $scope.getReactively('thisUser');
              var selector = {_id: userID}
              var loggedInRoles = Meteor.users.find(selector);
              console.info(loggedInRoles);
              var loggedInRole = loggedInRoles.role;
              return loggedInRole;
        }*/
      });

      $scope.closeFilter = function(){
        $scope.searchText = null;
      }


      angular.element(document).ready(function () {


        $scope.promise = $timeout(function(){
          var userDetails = Meteor.userId();
          var selector = {profiles_userID: userDetails};
          var profileDetails = Profiles.find(selector);
          var count = profileDetails.count();

          profileDetails.forEach(function(profileDetail){
            $scope.firstname = profileDetail.profiles_firstname;
            $scope.lastname = profileDetail.profiles_lastname;
            $scope.branchMainId = profileDetail.profiles_branchID;
            $scope.branchName = profileDetail.profiles_branch;
          });

          $window.loading_screen.finish();

          var toasted = $scope.branchName + ': Hi ' + $scope.firstname + ' ' + $scope.lastname + '!';
          var pinTo = $scope.getToastPosition();

          $mdToast.show(
            $mdToast.simple()
            .textContent(toasted)
            .position(pinTo )
            .hideDelay(3000)
            .theme('Headmaster')
            .action('HIDE')
            .highlightAction(true)
            .highlightClass('md-accent')
          );

        }, 2000);
      });

      $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
      };

      $scope.toastPosition = angular.extend({},last);

      function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }

      $scope.headmaster = [];

      

      $scope.createSchool = function(schools) {

        var result = Headmasters.insert(schools);

        console.info('result', result);
        if (!result) {
            //do something with the id : for ex create profile
            $scope.done = false;
            $scope.createdNow = !$scope.createdNow;
            $scope.existing = true;
            window.setTimeout(function(){
            $scope.$apply();
          },2000);
       } else {
         $scope.registered = schools;
         $scope.createdNows = !$scope.createdNows;
         $scope.done = false;
         //simulation purposes
         window.setTimeout(function(){
         $scope.$apply();
       },2000);
       }


      }



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

      $scope.items = [
        { name: "Add school", icon: "../../assets/img/white_schooladd24.svg", direction: "left" },
        { name: "Add user roles", icon: "../../assets/img/white_roleadd24.svg", direction: "left" },
        { name: "Add responsibilities", icon: "../../assets/img/white_respadd24.svg", direction: "left" }
      ];


      $scope.openDialog = function($event, item) {
        // Show the dialog
        if(item.name == 'Add school'){
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          controller: function($mdDialog) {
            // Save the clicked item
            $scope.FABitem = item;
            // Setup some handlers
            $scope.close = function() {
              $mdDialog.cancel();
            };
          },
          controllerAs: 'headmastercreateschool',
          controller: HeadmasterCtrl,
          template: '<headmastercreateschool></headmastercreateschool>',
          targetEvent: $event
        });
      } else if(item.name == 'Add responsibilities'){
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          controller: function($mdDialog) {
            // Save the clicked item
            $scope.FABitem = item;
            // Setup some handlers
            $scope.close = function() {
              $mdDialog.cancel();
            };
          },
          controllerAs: 'headmastercreateresp',
          controller: HeadmasterCtrl,
          template: '<headmastercreateresp></headmastercreateresp>',
          targetEvent: $event
        });
      } else if(item.name == 'Add user roles'){
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          controller: function($mdDialog) {
            // Save the clicked item
            $scope.FABitem = item;
            // Setup some handlers
            $scope.close = function() {
              $mdDialog.cancel();
            };
          },
          controllerAs: 'headmastercreaterole',
          controller: HeadmasterCtrl,
          template: '<headmastercreaterole></headmastercreaterole>',
          targetEvent: $event
        });
      }
    }

    $scope.openRole = function () {
      $state.go('Headmasterrole', {stateHolder : 'Headmaster', userID : Meteor.userId()});
    }

    $scope.openResp = function () {
      $state.go('Headmasterresp', {stateHolder : 'Headmaster', userID : Meteor.userId()});
    }


    }
}

app.component('headmaster', {
    templateUrl: 'client/components/headmaster/headmaster.html',
    controllerAs: 'headmaster',
    controller: HeadmasterCtrl
})
