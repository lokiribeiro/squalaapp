import {app} from '/client/app.js';

import Applicants from '/imports/models/applicants.js';
import Profiles from '/imports/models/profiles.js';
import Branches from '/imports/models/branches.js';

class NewapplicationsCtrl{

  constructor($scope, $timeout, $window, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
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
          });

          var toasted = $scope.branchName + ': Hi ' + $scope.firstname + ' ' + $scope.lastname + '!';
          var pinTo = $scope.getToastPosition();


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
            console.info('profiles', applicants);
            console.info('count', count);
            return applicants;
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

      $scope.selected2 = [];

      $scope.thisUser = Meteor.userId();
      //console.info('thisuser', $scope.thisUser);
      //$scope.branchID = null;
      //var myId = $scope.thisUser;
      //var selector = {_id: myId};
      //var myDetails = Meteor.users.find(selector);
      //myDetails.forEach(function(mydetail){
//        $scope.branchID = mydetail.branchId;
      //})

      //console.info('branch', $scope.branchID );


      $scope.show = false;

      $scope.perPage = 15;
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

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.toastPosition = angular.extend({},last);

      $scope.openProfile2 = function (selected2) {
        console.info('selected:', selected2[0].profiles_userID);
        var profileID = selected2[0].profiles_userID;
        $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      }

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





      $scope.filterShow = function(){
        $scope.filter.show = !$scope.filter.show;
      }

      $scope.changeSort = function () {
          $scope.sort = parseInt($scope.sort*-1);
      }

      $scope.closeFilter = function(){
        $scope.filter.show = !$scope.filter.show;
        $scope.selected2 = [];
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

      $scope.openDialog = function($event) {
        console.info('selected', $scope.selected2);
        var selected = $scope.selected2;
        $mdDialog.show({
        clickOutsideToClose: false,
        escapeToClose: true,
        transclude: true,
        locals:{
          selected : $scope.selected2
        },
        controller: function($scope, $mdDialog, selected){
          $scope.selected = selected;
          console.info('selected', $scope.selected )
          $scope.updatedNow = false;
          $scope.updatedNows = false;
          $scope.done = false;

          $scope.moreinfo = {
            religion: '',
            birthdate: '',
            gradecompleted: '',
            address: '',
            city: '',
            schooltype: '',
            elemcontactnum: '',
            elemgrad: '',
            elemaddress: '',
            elemschool: '',
            highschool: '',
            highaddress: '',
            highcontactnum: '',
            highschooltype: '',
            highreason: '',
            parentname: '',
            relation: '',
            parentnum: '',
            parentemail: ''



          }

          $scope.items = [
            {value: 'grade1', name: 'Grade 1'},
            {value: 'grade2', name: 'Grade 2'},
            {value: 'grade3', name: 'Grade 3'},
            {value: 'grade4', name: 'Grade 4'},
            {value: 'grade5', name: 'Grade 5'},
            {value: 'grade6', name: 'Grade 6'},
            {value: 'grade7', name: 'Grade 7'},
            {value: 'grade8', name: 'Grade 8'},
            {value: 'grade9', name: 'Grade 9'},
            {value: 'grade10', name: 'Grade 10'},
            {value: 'grade11', name: 'Grade 11'},
            {value: 'grade12', name: 'Grade 12'}
          ];

          $scope.closeDialog = function() {
            $mdDialog.cancel();
          }

          $scope.updateUser = function(results) {
            $scope.done = true;
            $scope.updatedNow = true;
            console.log('daan dito')
            $scope.resultsphone = results;
            console.info('ressulta', $scope.resultsphone);
            var selector = {_id: results._id};
            var modifier = {$set: {
                profiles_firstname: results.profiles_firstname,
                profiles_lastname: results.profiles_lastname,
                profiles_email: results.profiles_email,
                profiles_phone: results.profiles_phone,
                profiles_birthday: results.profiles_birthday,
                profiles_gender: results.profiles_gender
            }};

            Profiles.update( selector, modifier, function (error, rows) {
                if(error){
                  $scope.updatedNow = false;
                  $scope.done = false;
                  window.setTimeout(function(){
                    $scope.$apply();
                },2000);
                  console.log('daan error')
                    throw new Meteor.Error(error);
                }else {
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

        },
        templateUrl: 'client/components/admissions/newAppDetails/newappdetails.html',
        targetEvent: $event
      });
      };

      $scope.items = [
        //{ name: "New applications", type: "New applications"},
        { name: "Pending requirements", type: "Pending requirements"},
        { name: "Pending payment", type: "Pending payment"},
        { name: "For class assignment", type: "For class assignment"}
      ];

      $scope.updateApplicant = function() {
        $scope.done = true;
        $scope.updatedNow = true;
        console.log($scope.selected[0]._id);



      }

    }
}

app.component('newapplications', {
    templateUrl: 'client/components/admissions/newapplications/newapplications.html',
    controllerAs: 'newapplications',
    controller: NewapplicationsCtrl,
    transclude: true
})
