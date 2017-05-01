import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Feescategories from '/imports/models/feescategories.js';


class CollectCtrl{

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
      $scope.searchNow =null;

      $scope.subscribe('profilesUser', function () {
          return [$scope.getReactively('thisUser')];
      });

      $scope.subscribe('feescategoriesautoFILL', function () {
        return [$scope.getReactively('searchNow')];
      });

      //$scope.subscribe('feescategories2');

      $scope.helpers({
          profiles(){
            //var sort = 1;
            //var selector = {};
            //var modifier= {sort: {profiles_firstname: sort}};
            var thisUser = $scope.getReactively('thisUser');
            var selector = {profiles_userID: thisUser};
            var profiles = Profiles.find(selector);
            var count = profiles.count();
            console.info('profiles', profiles);
            console.info('count', count);
            return profiles;
          },
          totalProfiles(){
            var branchID = $scope.branchID;
            var type = 'Parent';
            var selector = {profiles_branchID: branchID, $and: [{profiles_type: type}]};
            var profiles = Profiles.find(selector);
            var count = profiles.count();
            return count;
          },
          feescategories() {
                var limit = parseInt($scope.getReactively('perPage2'));
                var skip  = parseInt(( $scope.getReactively('page2')-1 )* $scope.perPage2);
                var sort  = $scope.getReactively('sort3');
                var selector = {};
                var fees = Feescategories.find(
                      selector, { limit: limit, skip: skip, sort: {code: sort} }
                  );
                  console.info('fees', fees);
                  var count = fees.count();
                  console.info('console', count);
                return fees;
        },
        totalfees(){
            return Feescategories.find().count();
        }

      })//helpers

      angular.element(document).ready(function () {
        $window.loading_screen.finish();

        $scope.promise = $timeout(function(){
          var userDetails = Meteor.userId();
          var selector = {profiles_userID: userDetails};
          var profileDetails = Profiles.find(selector);
          var count = profileDetails.count();

          profileDetails.forEach(function(profileDetail){
            $scope.firstname = profileDetail.profiles_firstname;
            $scope.lastname = profileDetail.profiles_lastname;
            $scope.branchName = profileDetail.profiles_branch;
          });

          var toasted = $scope.branchName + ': Hi ' + $scope.firstname + ' ' + $scope.lastname + '!';
          var pinTo = $scope.getToastPosition();

          $mdToast.show(
            $mdToast.simple()
            .textContent(toasted)
            .position(pinTo )
            .hideDelay(3000)
            .theme('Collect')
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

      $scope.items = [
        { name: "Add fees category", icon: "../../assets/img/white_roleadd24.svg", direction: "left" },
        { name: "Add multiple fees", icon: "../../assets/img/white_roleadd24.svg", direction: "left" }
      ];

      $scope.openDialogs = function($event, item) {
        // Show the dialog
        if(item.name == "Add fees category") {
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
          controllerAs: 'collectcreatefees',
          controller: CollectCtrl,
          template: '<collectcreatefees></collectcreatefees>',
          targetEvent: $event
        });
      } else if(item.name == "Add multiple fees") {
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
        controllerAs: 'collectfeesupload',
        controller: CollectCtrl,
        template: '<collectfeesupload></collectfeesupload>',
        targetEvent: $event
      });
      }

      }

      $scope.querySearch = function  (query) {
      var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    $scope.searchTextChange = function (text) {
      $log.info('Text changed to ' + text);
      $scope.searchNow = text;

    }

    $scope.feescategorys = function(searchText){
      var limit = parseInt($scope.getReactively('perPage2'));
      var skip  = parseInt(( $scope.getReactively('page2')-1 )* $scope.perPage2);
      var sort  = $scope.getReactively('sort3');
      var selector = {feesName: searchText, $or: [
        { code: searchText}
      ]};
      var fees = Feescategories.find(
            selector, { limit: limit, skip: skip, sort: {code: sort} }
        );
        console.info('fees', fees);
      return fees;
    }

    $scope.selectedItemChange = function (item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
      var repos = [
        {
          'name'      : 'Angular 1',
          'url'       : 'https://github.com/angular/angular.js',
          'watchers'  : '3,623',
          'forks'     : '16,175',
        },
        {
          'name'      : 'Angular 2',
          'url'       : 'https://github.com/angular/angular',
          'watchers'  : '469',
          'forks'     : '760',
        },
        {
          'name'      : 'Angular Material',
          'url'       : 'https://github.com/angular/material',
          'watchers'  : '727',
          'forks'     : '1,241',
        },
        {
          'name'      : 'Bower Material',
          'url'       : 'https://github.com/angular/bower-material',
          'watchers'  : '42',
          'forks'     : '84',
        },
        {
          'name'      : 'Material Start',
          'url'       : 'https://github.com/angular/material-start',
          'watchers'  : '81',
          'forks'     : '303',
        }
      ];
      return repos.map( function (repo) {
        repo.value = repo.name.toLowerCase();
        return repo;
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };

    }

    }
}

app.component('collect', {
    templateUrl: 'client/components/collect/collect.html',
    controllerAs: 'collect',
    controller: CollectCtrl
})
