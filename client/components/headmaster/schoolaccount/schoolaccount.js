import {app} from '/client/app.js';

import Branches from '/imports/models/branches.js';



class SchoolaccountCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.branchID = $rootScope.branchID;

      $scope.subscribe('branchesSchool', function () {
          return [$scope.getReactively('branchID')];
      });

      $scope.subscribe('users');

      $scope.helpers({
          branches() {
                var branchID = $scope.getReactively('branchID');
                var selector = {_id : branchID};
                var branches = Branches.find(selector);
                console.info('branchs', branches);
                return branches;
        },
        branch : function(){
          return Branches.findOne($rootScope.branchID);
        }
      });//helpers

      $scope.openDialog = function ($event) {
          console.info('userID', $scope.branchID);
          var branchID = $scope.branchID;
          var selector = {_id: branchID};
          $scope.results = Branches.findOne(selector);
          console.info('branchs', $scope.results);
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            branchID : $scope.branchID,
            results : $scope.results
          },
          controller: function($scope, $mdDialog, results, branchID){

            $scope.subscribe('users');

            $scope.helpers({
                users() {
                      users =  Meteor.users.find();
                      return users;
              }
            });//helpers
            $scope.branchID = branchID;
            $scope.results = results;
            $scope.updatedNow = false;
            $scope.updatedNows = false;
            $scope.done = false;

            $scope.cancelNow = function() {
              $mdDialog.cancel();
            }

            $scope.updateSchool = function(results) {
              $scope.done = true;
              $scope.updatedNow = true;

              var profilesID = results.branches_schooladmin;

              var profileID = profilesID._id;

              console.info('profileID', profileID);
              var selector2 = {branches_schooladmin: profileID};
              var oldBranches = Branches.find();
              var counter = oldBranches.count();

              console.info('oldBranches', oldBranches);
              console.info('counter', counter);

              if(counter > 0){
                oldBranches.forEach(function(oldBranch){
                  console.log(oldBranch.branches_schooladmin);
                  console.log(profileID);
                  if(oldBranch.branches_schooladmin == profileID ){
                    var oldId = oldBranch._id;
                    var selector3 = {_id: oldId};
                    var modifier2 = {$set: {
                      branches_schooladmin: '',
                      branches_schooladminname: ''
                    }};
                    var removeAdmin = Branches.update(selector3,modifier2);
                  }
                })
              }

              console.log('daan dito')
              $scope.resultsphone = results;
              console.info('ressulta', $scope.resultsphone);
              var selector = {_id: results._id};
              var modifier = {$set: {
                  branch_name: results.branch_name,
                  branches_address: results.branches_address,
                  branches_city: results.branches_city,
                  branches_schooladmin: results.branches_schooladmin._id,
                  branches_schooladminname: results.branches_schooladmin.name,
                  branches_type: results.branches_type
              }};

              var profilesID = results.branches_schooladmin;

              console.info('profilesID', profilesID);

              var branchID = results._id;
              var branchName = results.branch_name;
              var userType = 'Non-teaching staff';

              console.info('profileID', profileID);
              console.info('status', branchID);
              console.info('branchname', branchName);



              Branches.update( selector, modifier, function (error, rows) {
                  if(error){
                    $scope.updatedNow = false;
                    $scope.done = false;
                    window.setTimeout(function(){
                      $scope.$apply();
                  },2000);
                    console.log('daan error')
                      throw new Meteor.Error(error);
                  }else {
                    Meteor.call('upsertNewBranchFromAdmin', profileID, branchID, function(err, detailss) {
                      if (err) {
                          //do something with the id : for ex create profile
                        console.log('error upserting branch to meteor.user()');
                     }
                    });

                    Meteor.call('upsertProfileFromAdmin', profileID, branchID, branchName, userType, function(err, detail) {
                      if (err) {
                          //do something with the id : for ex create profile
                          $scope.updatedNow = false;
                          $scope.done = false;
                          window.setTimeout(function(){
                            $scope.$apply();
                        },2000);
                          console.log('daan error')
                            throw new Meteor.Error(error);
                     } else {
                       console.log('daan update')
                       $scope.updatedNow = true;
                       $scope.updatedNows = true;
                       $scope.done = false;
                       window.setTimeout(function(){
                         $scope.$apply();
                     },2000);
                     }
                   });
                  }
              });
            }
          },
          templateUrl: 'client/components/headmaster/schoolaccount/editschoolaccount.html',
          targetEvent: $event
        });
        };
    }
}

app.component('schoolaccount', {
    templateUrl: 'client/components/headmaster/schoolaccount/schoolaccount.html',
    controllerAs: 'schoolaccount',
    controller: SchoolaccountCtrl
})
