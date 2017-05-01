import {app} from '/client/app.js';
import Applicants from '/imports/models/applicants.js';
import Profiles from '/imports/models/profiles.js';

//import Users from '/imports/models/users.js';

class BranchapplicantsCtrl{

  constructor($scope, $timeout, $filter, $window, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';

      $scope.branchID = $rootScope.branchID;

      $scope.perPage = 5;
      $scope.page = 1;
      $scope.sort = -1;
      $scope.searchText = null;

      console.info('branchID', $scope.branchID );

      $scope.subscribe('applicantsNew', function () {
          return [$scope.getReactively('searchText')];
      });

      $scope.subscribe('profilesUser', function () {
          return [$scope.getReactively('thisUser')];
      });

      $scope.applicantID = [];

      $scope.progressList = [
        //{ name: "New applications", type: "New applications"},
        { name: "Application form created", value: '10', status: true, statusNo: false, icon: "../../assets/img/amber_checkcircle24.svg", iconNo: "../../assets/img/black_checkcircle24.svg"},
        { name: "Filled out application form", value: '35', status: true, statusNo: false, icon: "../../assets/img/amber_checkcircle24.svg", iconNo: "../../assets/img/black_checkcircle24.svg"},
        { name: "Supporting documents submitted", value: '60', status: true, statusNo: false, icon: "../../assets/img/amber_checkcircle24.svg", iconNo: "../../assets/img/black_checkcircle24.svg"},
        { name: "Settled reservation fee", value: '85', status: true, statusNo: false, icon: "../../assets/img/amber_checkcircle24.svg", iconNo: "../../assets/img/black_checkcircle24.svg"},
        { name: "For class assignment", value: '100', status: true, statusNo: false,  icon: "../../assets/img/amber_checkcircle24.svg", iconNo: "../../assets/img/black_checkcircle24.svg"},
      ];

      $scope.helpers({
          applicants(){
            //var sort = 1;
            //var selector = {};
            //var modifier= {sort: {profiles_firstname: sort}};
            $scope.doneSearching = true;
            $scope.notdoneSearching = !$scope.doneSearching;

            $scope.promise = $timeout(function(){

              $scope.brancID = $scope.branchID;
              $scope.doneSearching = false;
              $scope.notdoneSearching = !$scope.doneSearching;


            }, 2000);
            var limit = parseInt($scope.getReactively('perPage'));
            var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
            var sort  = $scope.getReactively('sort');
            var thisuserID = $scope.getReactively('thisUser');
            var branchID = $scope.getReactively('branchID');
            console.info('branchID', branchID);
            var type = 'New application';
            var selector = {branchId: branchID, $and: [{status: type}]};
            var sort = $scope.getReactively('sort');
            var modifier = {sort : {createdAt: sort}};
            var applicants = Applicants.find(selector, modifier);
            console.info('applicants', applicants);
            var count = applicants.count();
            $scope.totalApplicants = count;
            var totalApplicants = $scope.totalApplicants;
            var perPage = $scope.perPage;
            var maxPage = parseInt(totalApplicants / perPage);
            var remainder = parseInt(totalApplicants % perPage);
            $scope.remainder = remainder;
            if(remainder > 0){
              maxPage = maxPage + 1;
              console.info('remainder > 0', maxPage);
            }
            $scope.maxPage = maxPage;

            return applicants;
          },
          totalApplicants(){
            $scope.promise = $timeout(function(){
              $scope.brancID = $scope.branchID;

            }, 2000);
            var thisuserID = $scope.getReactively('thisUser');
            var branchID = $scope.getReactively('branchID');
            var type = 'New application';
            var selector = {branchId: branchID, $and: [{status: type}]};
            var applicants = Applicants.find(selector);
            var count = applicants.count();
            console.info('count', count);
            return count;
          }
      })//helpers


      $scope.openSchool = function (selected) {
        console.info('selected:', selected[0]._id);
        var branchID = selected[0]._id;
        $state.go('Headmasterschool', {stateHolder : 'Headmaster', userID : Meteor.userId(), branchID : branchID});
      }

      $scope.items = [
        { name: "New application", icon: "../../assets/img/white_addperson24.svg", direction: "left" }
      ];


      $scope.openDialog = function($event, item) {
        // Show the dialog
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
          controllerAs: 'admissionsnewapplications',
          controller: BranchapplicantsCtrl,
          template: '<admissionsnewapplications></admissionsnewapplications>',
          targetEvent: $event
        });
      }

      $scope.viewAppForm = function (applicant) {
        var applicantID = applicant._id;
        $state.go('AdmissionsApplicantform', {stateHolder : 'Admissions', userID : Meteor.userId(), applicantID : applicantID});
        $mdDialog.hide();
      }



    }
}

app.component('branchapplicants', {
    templateUrl: 'client/components/admissions/enroll/branchapplicants/branchapplicants.html',
    controllerAs: 'branchapplicants',
    controller: BranchapplicantsCtrl
})
