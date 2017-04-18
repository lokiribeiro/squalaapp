import {app} from '/client/app.js';
import Applicants from '/imports/models/applicants.js';
import Profiles from '/imports/models/profiles.js';

//import Users from '/imports/models/users.js';

class BranchapplicantsCtrl{

  constructor($scope, $timeout, $filter, $window, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';

      $scope.branchID = $rootScope.branchID;

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
      $scope.sort = -1;

      $scope.helpers({
          applicants(){
            //var sort = 1;
            //var selector = {};
            //var modifier= {sort: {profiles_firstname: sort}};
            $scope.doneSearching = true;

            $scope.promise = $timeout(function(){

              $scope.brancID = $scope.branchID;
              $scope.doneSearching = false;


            }, 2000);
            var thisuserID = $scope.getReactively('thisUser');
            var branchID = $scope.getReactively('branchID');
            var type = 'New application';
            var selector = {branchId: branchID, $and: [{status: type}]};
            var sort = $scope.getReactively('sort');
            var modifier = {sort : {createdAt: sort}};
            var applicants = Applicants.find(selector, modifier);
            var count = applicants.count();
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





    }
}

app.component('branchapplicants', {
    templateUrl: 'client/components/admissions/branchapplicants/branchapplicants.html',
    controllerAs: 'branchapplicants',
    controller: BranchapplicantsCtrl
})
