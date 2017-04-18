import {app} from '/client/app.js';
import Branches from '/imports/models/branches.js';
import Profiles from '/imports/models/profiles.js';

class headmastercreateschoolCtrl{

  constructor($scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.subscribe('users');

      $scope.helpers({
          users() {
                var sort  = 1;
                var selector = {};
                var users = Meteor.users.find(
                      selector, { sort: {name: sort} }
                  );
                return users;
        }
      })//helpers

      //helpers
      this.$state = $state;

      $reactive(this).attach($scope);

      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.canCreateProfile = false;

      this.credentials = {
        schoolname: '',
        schooltype: '',
        address: '',
        city: '',
        schooladmin: '',
        schooladminname: ''
      };

      this.register = {
        schoolname: '',
        schooltype: '',
        address: '',
        city: '',
        schooladmin: '',
        schooladminname: ''
      }

      this.error = '';

      //var details = this.credentials;
      var details = this.register;

      console.info('details: ', details);

      $scope.createSchool = function(details) {
        var detail = details;

        console.info('detail', details);

        $scope.done = true;
        $scope.existing = false;
        $scope.createdNow = !$scope.createdNow;
        //var status = createUserFromAdmin(details);

        var branch = [];

        branch.branch_name = details.schoolname;
        branch.branches_address = details.address;
        branch.branches_city = details.city;
        branch.branches_schooladmin = details.schooladmin._id;
        branch.branches_schooladminname = details.schooladmin.name;
        branch.branches_type = details.schooltype;

        //branch.userpic = details.schooladmin.userpic;
        branch.userpic = '../../assets/img/profiles/user.png';

        var profilesID = details.schooladmin._id;

        console.info('profilesID', profilesID);

        var status = Branches.insert(branch);

        var profileID = profilesID;
        var branchID = status;
        var branchName = details.schoolname;
        var userType = 'Non-teaching staff';

        console.info('profileID', profileID);
        console.info('status', branchID);
        console.info('branchname', branchName);

        if(branch.branches_schooladminname && branch.branches_type){
          Meteor.call('upsertNewBranchFromAdmin', profileID, branchID, function(err, detailss) {
            if (err) {
                //do something with the id : for ex create profile
              console.log('error upserting branch to meteor.user()');
           }
          });

          Meteor.call('upsertProfileFromAdmin', profileID, branchID, branchName, userType, function(err, detail) {
          if (err) {
              //do something with the id : for ex create profile
              $scope.done = false;
              $scope.createdNow = !$scope.createdNow;
              $scope.existing = true;
              window.setTimeout(function(){
              $scope.$apply();
            },2000);
         } else {
           $scope.registered = details;
           $scope.createdNows = !$scope.createdNows;
           $scope.done = false;
           //simulation purposes
           window.setTimeout(function(){
           $scope.$apply();
         },2000);
         }
       });
        } else {
          $scope.loginerror = 'Fields cannot be empty';
              console.info('err: ' ,   $scope.loginerror );
        }



    }

      $scope.createAnother = function() {
         $scope.createdNows = !$scope.createdNows;
         $scope.createdNow = !$scope.createdNow;
         //$scope.createdNow = '1';
      }

      $scope.closeDialog = function() {
         $mdDialog.hide();
         //$scope.createdNow = '1';
       }

}
}

app.component('headmastercreateschool', {
    templateUrl: 'client/components/headmaster/createSchool/createschool.html',
    controllerAs: 'headmastercreateschool',
    controller: headmastercreateschoolCtrl
})
