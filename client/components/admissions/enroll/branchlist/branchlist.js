import {app} from '/client/app.js';

import Branches from '/imports/models/branches.js';

//import Users from '/imports/models/users.js';

class BranchlistCtrl{

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

      $scope.perPage = 10;
      $scope.page = 1;
      $scope.sort = -1;
      $scope.searchTexts = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.subscribe('branches', function () {
          return [$scope.getReactively('searchTexts')];
      });

      $scope.helpers({
        branches() {
              $scope.promise = $timeout(function(){

              }, 2000);
              var limit = parseInt($scope.getReactively('perPage'));
              var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
              var sort  = $scope.getReactively('sort');
              var selector = {};
              var branches = Branches.find(
                    selector, { limit: limit, skip: skip, sort: {branches_city: sort} }
                );
              return branches;
      },
        totalBranches(){
            var branch = 'branch';
            var selector = {branches_type: branch};
            return Branches.find(selector).count();
        }
      })//helpers

      $scope.pageChange = function (newPageNumber) {
          $scope.page = newPageNumber;
      };

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

      $scope.openDelete = function ($event, selected) {
          $scope.userDel = selected._id;
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

            console.info('branchID', userDel);

            Meteor.call('deleteSchoolFromAdmin', userDel, function(err, userDel) {
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
          templateUrl: 'client/components/headmaster/branchschools/delete.html',
          targetEvent: $event
        });
        };

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.openSchool = function (selected) {
          console.info('selected:', selected._id);
          var branchID = selected._id;
          $state.go('BranchApplicants', {stateHolder : 'Admissions', userID : Meteor.userId(), branchID : branchID});
        }



      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('branchlist', {
    templateUrl: 'client/components/admissions/enroll/branchlist/branchlist.html',
    controllerAs: 'branchlist',
    controller: BranchlistCtrl,
    transclude: true
})
