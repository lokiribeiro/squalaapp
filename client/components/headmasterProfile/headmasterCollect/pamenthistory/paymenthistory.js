import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Roles from '/imports/models/roles.js';
import Branches from '/imports/models/branches.js';
import Userapps from '/imports/models/userapps.js';
import Apps from '/imports/models/apps.js';
import ngFileUpload from 'ng-file-upload';



class PaymenthistoryCtrl{

  constructor($rootScope, $scope, $mdToast, $timeout, $element, $q, $mdSidenav, $log, $mdDialog, $state, Upload){
      'ngInject';

      $scope.profileID = $rootScope.profileID;
      $scope.rolesID = null;
      $scope.branchID = '';
      $scope.myBranch = $rootScope.branchID;
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
      $scope.selected = [];

      $scope.sort2 = 1;

      $scope.subscribe('profiles2', function () {
          return [$scope.getReactively('profileID')];
      });
      $scope.subscribe('roles2', function () {
          return [$scope.getReactively('rolesID')];
      });

      $scope.subscribe('branches', function () {
          return [$scope.getReactively('branchID')];
      });

      $scope.subscribe('userapps2');
      $scope.subscribe('apps');
      $scope.subscribe('users');
      $scope.subscribe('feescategories2');





      $scope.helpers({
          profiles() {
                var profileID = $scope.getReactively('profileID');
                var selector = {profiles_userID : profileID};
                var profiles = Profiles.find(selector);
                var roleName = '';
                console.info('profiles', profiles);
                profiles.forEach(function(profile) {
                  $scope.rolesID = profile.profiles_userroleID;
                });
                return profiles;
        },
        roles() {
          return Roles.find();
        },
        branches(){
          var profileID = $scope.getReactively('profileID');
          var selector = {profiles_userID : profileID};
          var profiles = Profiles.find(selector);
          var proNum = profiles.count();
          console.info('pronum', proNum);
          var branch = '';
          profiles.forEach(function(profile) {
            branch = profile.profiles_branchID;
          });
          console.info('branch', branch);
          selector = {_id: branch}
          var branches =  Branches.find(branch);
          console.info('branches', branches);
          var counter = branches.count();
          console.log(counter);
          return branches;
        },
        branchesList(){
          var sort = 1;
          var selector = {};
          var modifier = {sort: {branch_name: sort}};
          var branchesList = Branches.find(selector,modifier);
          var count = branchesList.count();
          console.info('count', count);
          console.info('branchesList', branchesList);
          return branchesList;
        },
        feescategories() {
          var profileID = $scope.getReactively('profileID');
          var selector = {profiles_userID : profileID};
          var profiles = Profiles.find(selector);
          var userID = '';
          var feeID = '';
          console.info('profiles', profiles);
          profiles.forEach(function(profile) {
            userID = profile.profiles_userID;
          });
          console.info('userID', userID);
          selector = {_id: userID};
          var userFees = Meteor.users.find(selector);
          console.info('userfees', userFees);
          userFees.forEach(function(userFee) {
            feeID = userFee.feesID;
          });
          selector = {_id: feeID}
          var fees = Feescategories.find(selector);
          console.info('fees', fees);
          var count = fees.count();
          console.info('console', count);
          return fees;
      },
      users(){
        var profileID = $scope.getReactively('profileID');
        var selector = {profiles_userID : profileID};
        var profiles = Profiles.find(selector);
        var userID = '';
        var balance = '';
        console.info('profiles', profiles);
        profiles.forEach(function(profile) {
          userID = profile.profiles_userID;
        });
        console.info('userID', userID);
        selector = {_id: userID};
        var userBalances = Meteor.users.find(selector);
        console.info('userBalance', userBalances);
        userBalances.forEach(function(userBalance) {
          if(userBalance.statements){
          var counter = userBalance.statements.length;
          console.info('counter', counter);
          for(i=0;i<counter;i++){
            $scope.balanceLeft = userBalance.statements[i].balance;
          }
        } else {
          $scope.balanceLeft = 0;
        }
        });
        return userBalances;
        }
      });//helpers

      Slingshot.fileRestrictions("myFileUploads", {
      allowedFileTypes: null,
      maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
      });

      $scope.uploader = new Slingshot.Upload('myFileUploads');
      $scope.uploadingNow = false;
      $scope.uploaded = false;
      $scope.doneSearching = false;
      $scope.showAll = false;

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

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

      $scope.showMoreAll = function () {
          $scope.showAll = !$scope.showAll;
      };

      this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

        $scope.openRole = function () {
          $state.go('Headmasterrole', {stateHolder : 'Headmaster', userID : Meteor.userId()});
        }

        $scope.openResp = function () {
          $state.go('Headmasterresp', {stateHolder : 'Headmaster', userID : Meteor.userId()});
        }

        $scope.openSchool = function () {
          var branchID = $scope.myBranch;
          $state.go('Headmasterschool', {stateHolder : 'Headmaster', userID : Meteor.userId(), branchID : branchID});
        }

    }
}

app.component('paymenthistory', {
    templateUrl: 'client/components/headmasterProfile/headmasterCollect/pamenthistory/paymenthistory.html',
    controllerAs: 'paymenthistory',
    controller: PaymenthistoryCtrl
})
