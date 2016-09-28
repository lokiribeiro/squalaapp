import {app} from '/client/app.js';

import Userapps from '/imports/models/userapps.js';

class NavbarCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $mdComponentRegistry, $stateParams){
      'ngInject';

      $scope.userId = Meteor.userId();
      console.info('thisid', $scope.userId);

      $scope.sort = 1;
      //$scope.stateHolder = null;
      $scope.stateHolder = $stateParams.stateHolder;

      $scope.subscribe('userapps4');

      $scope.helpers({
          userappsMenu() {
            var userID = $scope.userId;
            var sort  = $scope.sort;
            var selector = {userID: userID};
            var modifier = {sort: {appName: sort}};
            var userapps = Userapps.find(selector,modifier);
            console.info('userapps', userapps);
          return userapps;
        },
        totalApps(){
            var userID = Meteor.userId();
            var query = {userID: userID};
            return Userapps.find(query).count();
        },
        currentusers(){
            var userID = Meteor.userId();
            var query = {userID: userID};
            var listahan = Userapps.findOne(query);
            return Userapps.findOne(query);
        }
      });//helpers

      $scope.redirect = function (appName) {
        $state.go(appName, { stateHolder : appName, userID : Meteor.userId() });
      }

      $scope.redirectProfile = function () {
        $state.go('Profile', {stateHolder : 'Dashboard', userID : Meteor.userId()});
      }

    $scope.logout = function() {
        Accounts.logout();
        $state.go('logout');
      }

      $scope.filterShow = function(){
        $scope.filter.show = !$scope.filter.show;
      }




    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.isOpenLeft = function(){
      return $mdSidenav('left').isOpen();
    }

    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          //$log.debug("close LEFT is done");
        });
    }

    function totalAppCount() {
      var userID = Meteor.userId();
      var query = {userID: userID};
      console.log(query);
      var listahan = Userapps.find().count();
      console.log(listahan);

      return Userapps.find(query).count();
    }

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            //$log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            //$log.debug("toggle " + navID + " is done");
          });
      }
    }

    var originatorEv;

    this.menuHref = "http://www.google.com/design/spec/components/menus.html#menus-specs";

    this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    this.announceClick = function(index) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('You clicked!')
          .textContent('You clicked the menu item at index ' + index)
          .ok('Nice')
          .targetEvent(originatorEv)
      );
      originatorEv = null;
    };

    //This sets up a trigger event when the sidenav closes
   $scope.sideNavIsOpen = function() {
       return false;
   };

   $mdComponentRegistry.when('left').then(function(sideNav) {
       $scope.sideNavIsOpen = angular.bind(sideNav, sideNav.isOpen);
   });

   $scope.$watch('sideNavIsOpen()', function() {
       if(!$scope.sideNavIsOpen()) {
           $('body').removeClass('not-scrollable');
       }
       else {
           $('body').addClass('not-scrollable');
       }
   });

  }
}

app.component('navbar', {
    templateUrl: 'client/components/navbar/navbar.html',
    controllerAs: 'navbar',
    controller: NavbarCtrl
});