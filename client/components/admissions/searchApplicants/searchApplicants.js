import {app} from '/client/app.js';

import Applicants from '/imports/models/applicants.js';
import Profiles from '/imports/models/profiles.js';


class SearchapplicantsCtrl{

  constructor($scope, $timeout, $window, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, $rootScope, $document){
      'ngInject';

      angular.element(document).ready(function () {

              $scope.promise = $timeout(function(){
                var userDetails = Meteor.userId();
                var selector = {profiles_userID: userDetails};
                var profileDetails = Profiles.find(selector);
                var count = profileDetails.count();



                profileDetails.forEach(function(profileDetail){
                  $scope.firstname = profileDetail.profiles_firstname;
                  $scope.lastname = profileDetail.profiles_lastname;
                  $scope.branchName = profileDetail.profiles_branch;
                  $scope.branchID = profileDetail.profiles_branchID;
                  console.log($scope.branchID);
                });
              }, 2000);
            });




            $scope.subscribe('applicantsNew', function () {
                return [$scope.getReactively('searchText')];
            });

            $scope.subscribe('profilesUser', function () {
                return [$scope.getReactively('thisUser')];
            });

            $scope.helpers({
                applicants(){
                  //var sort = 1;
                  //var selector = {};
                  //var modifier= {sort: {profiles_firstname: sort}};
                  $scope.promise = $timeout(function(){
                    $scope.brancID = $scope.branchID;

                  }, 2000);
                  var thisuserID = $scope.getReactively('thisUser');
                  var branchID = $scope.getReactively('brancID');
                  var type = 'New application';
                  var selector = {branchId: branchID, $and: [{status: type}]};
                  var applicants = Applicants.find(selector);
                  var count = applicants.count();
                  console.log(count);
                  $scope.state = [];
                  applicants.forEach(function(applicant){
                     var text = applicant.applicationNum + ': ' + applicant.firstname + ' ' + applicant.middlename + ' ' + applicant.lastname;
                     var id = applicant._id;
                     var selector = {value: id, display: text};
                     $scope.state.push(selector);
                  })
                  console.info('states', $scope.state);

                  var allStates = $scope.state;
                  $scope.states = allStates;


                  /*return allStates.split(/, +/g).map( function (state) {
                    return {
                      value: state.toLowerCase(),
                      display: state
                    };
                  });*/


                  return allStates;
                },
                totalApplicants(){
                  $scope.promise = $timeout(function(){
                    $scope.brancID = $scope.branchID;

                  }, 2000);
                  var thisuserID = $scope.getReactively('thisUser');
                  var branchID = $scope.getReactively('brancID');
                  var type = 'New application';
                  var selector = {branchId: branchID, $and: [{status: type}]};
                  var applicants = Applicants.find(selector);
                  var count = applicants.count();
                  console.info('profiles', applicants);
                  console.info('count', count);
                  return count;
                }
            })//helpers

            $scope.rolesID = null;
            $scope.thisUser = Meteor.userId();

            $scope.openProfile2 = function (selected2) {
              console.info('selected:', selected2[0].profiles_userID);
              var profileID = selected2[0].profiles_userID;
              $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
            }


            $scope.sort = 1;


            $scope.simulateQuery = true;
            $scope.isDisabled    = false;
            $scope.noCache = false;

          // list of `state` value/display objects
            //$scope.states        = loadAll();
            $scope.querySearch   = querySearch;
            $scope.selectedItemChange = selectedItemChange;
            $scope.searchTextChange   = searchTextChange;

            $scope.newState = newState;

          function newState(state) {
            alert("Sorry! You'll need to create a Constitution for " + state + " first!");
          }

          // ******************************
          // Internal methods
          // ******************************

          /**
           * Search for states... use $timeout to simulate
           * remote dataservice call.
           */

          function querySearch (query) {
            console.info('query', query);
            var query2 = $scope.states.filter( createFilterFor(query) );
            console.info('query2', query2);
            var results = query ? $scope.states.filter( createFilterFor(query) ) : $scope.states,
                deferred;
            console.info('results', results);
            if ($scope.simulateQuery) {
              deferred = $q.defer();
              $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
              return deferred.promise;
            } else {
              return results;
            }
          }

          function searchTextChange(text) {
            $log.info('Text changed to ' + text);
          }

          function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
          }

          /**
           * Build `states` list of key/value pairs
           */
          /*function loadAll() {
            $scope.promise = $timeout(function(){
              $scope.brancID = $scope.branchID;

            }, 2000);
            var thisuserID = $scope.getReactively('thisUser');
            var branchID = $scope.getReactively('brancID');
            var type = 'New application';
            var selector = {branchId: branchID, $and: [{status: type}]};
            var applicants = Applicants.find(selector);
            console.info('applicants', applicants);

          }*/

          /**
           * Create filter function for a query string
           */

          function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
              return (state.value.indexOf(lowercaseQuery) === 0);
            };

          }



/*      angular.element(document).ready(function () {

        $scope.promise = $timeout(function(){
          var userDetails = Meteor.userId();
          var selector = {profiles_userID: userDetails};
          var profileDetails = Profiles.find(selector);
          var count = profileDetails.count();



          profileDetails.forEach(function(profileDetail){
            $scope.firstname = profileDetail.profiles_firstname;
            $scope.lastname = profileDetail.profiles_lastname;
            $scope.branchName = profileDetail.profiles_branch;
            $scope.branchID = profileDetail.profiles_branchID;
            console.log($scope.branchID);
          });
        }, 2000);
      });




      $scope.subscribe('applicantsNew', function () {
          return [$scope.getReactively('searchText')];
      });

      $scope.subscribe('profilesUser', function () {
          return [$scope.getReactively('thisUser')];
      });

      $scope.helpers({
          applicants(){
            //var sort = 1;
            //var selector = {};
            //var modifier= {sort: {profiles_firstname: sort}};
            $scope.promise = $timeout(function(){
              $scope.brancID = $scope.branchID;

            }, 2000);
            var thisuserID = $scope.getReactively('thisUser');
            var branchID = $scope.getReactively('brancID');
            var type = 'New application';
            var selector = {branchId: branchID, $and: [{status: type}]};
            var applicants = Applicants.find(selector);
            var count = applicants.count();
            console.log(count);
            $scope.state = [];
            applicants.forEach(function(applicant){
               var text = applicant.applicationNum + ': ' + applicant.firstname + ' ' + applicant.middlename + ' ' + applicant.lastname;
               var id = applicant._id;
               var selector = {value: id, display: text};
               $scope.state.push(selector);
            })
            console.info('states', $scope.state);

            var allStates = $scope.state;
            $scope.states = allStates;


            /*return allStates.split(/, +/g).map( function (state) {
              return {
                value: state.toLowerCase(),
                display: state
              };
            });*/


/*            return allStates;
          },
          totalApplicants(){
            $scope.promise = $timeout(function(){
              $scope.brancID = $scope.branchID;

            }, 2000);
            var thisuserID = $scope.getReactively('thisUser');
            var branchID = $scope.getReactively('brancID');
            var type = 'New application';
            var selector = {branchId: branchID, $and: [{status: type}]};
            var applicants = Applicants.find(selector);
            var count = applicants.count();
            console.info('profiles', applicants);
            console.info('count', count);
            return count;
          }
      })//helpers

      $scope.rolesID = null;
      $scope.thisUser = Meteor.userId();

      $scope.openProfile2 = function (selected2) {
        console.info('selected:', selected2[0].profiles_userID);
        var profileID = selected2[0].profiles_userID;
        $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      }


      $scope.sort = 1;


      $scope.simulateQuery = true;
      $scope.isDisabled    = false;
      $scope.noCache = false;

    // list of `state` value/display objects
      //$scope.states        = loadAll();
      $scope.querySearch   = querySearch;
      $scope.selectedItemChange = selectedItemChange;
      $scope.searchTextChange   = searchTextChange;

      $scope.newState = newState;

    function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */

/*    function querySearch (query) {
      console.info('query', query);
      var query2 = $scope.states.filter( createFilterFor(query) );
      console.info('query2', query2);
      var results = query ? $scope.states.filter( createFilterFor(query) ) : $scope.states,
          deferred;
      console.info('results', results);
      if ($scope.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `states` list of key/value pairs
     */
    /*function loadAll() {
      $scope.promise = $timeout(function(){
        $scope.brancID = $scope.branchID;

      }, 2000);
      var thisuserID = $scope.getReactively('thisUser');
      var branchID = $scope.getReactively('brancID');
      var type = 'New application';
      var selector = {branchId: branchID, $and: [{status: type}]};
      var applicants = Applicants.find(selector);
      console.info('applicants', applicants);

    }*/

    /**
     * Create filter function for a query string
     */

/*    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }

  */


    }
}

app.component('searchapplicants', {
    templateUrl: 'client/components/admissions/searchApplicants/searchApplicants.html',
    controllerAs: 'searchapplicants',
    controller: SearchapplicantsCtrl
})
