import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Roles from '/imports/models/roles.js';
import Branches from '/imports/models/branches.js';

class ProfileCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $window){
      'ngInject';
  // async
  $scope.profileID = Meteor.userId();
  var profileid = $scope.profileID;

  console.info('profileID', $scope.profileID );

  $scope.subscribe('profilesUser', function() {
      return [$scope.getReactively('profileID')];
  });

  $scope.subscribe('roles2', function () {
      return [$scope.getReactively('rolesID')];
  });

  $scope.subscribe('branches', function () {
      return [$scope.getReactively('branchID')];
  });

  $scope.helpers({
      profiles() {
            var profileID = $scope.getReactively('profileID');
            var selector = {profiles_userID : profileID};
            var profiles = Profiles.find(selector);
            var roleName = '';
            console.info('profiles', profiles);
            profiles.forEach(function(profile) {
              $scope.branchID = profile.profiles_branchID;
              //$scope.rolesID = profile.profiles_userroleID;
            });
            console.info('branches', $scope.profileID);
            console.info('branchID', $scope.branchID);
            return profiles;
    },
    roles() {
      return Roles.find();
    },
    branches(){
      var branch =  $scope.getReactively('branchID');
      console.info('branches', branch);
      var selector = {_id: branch}
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
    }
  });//helpers

  angular.element(document).ready(function () {
    $window.loading_screen.finish();
  });

  this.openMenu = function($mdOpenMenu, ev) {
  originatorEv = ev;
  $mdOpenMenu(ev);
};

$scope.announceClick = function($event, branch, firstname, lastname, ID, userType) {
  var branchID = branch._id;
  var branchname = branch.branch_name;
  var userType = userType;
  var profileID = ID;

  Meteor.call('upsertProfileFromAdmin', profileID, branchID, branchID, userType, function(err, detail) {
      if (err) {
        console.log('error here');
      } else{
        $mdDialog.show(
          $mdDialog.alert()
            .title('Transfer complete')
            .textContent(firstname + ' ' + lastname + ' had been transferred to ' + branchname)
            .ok('Done')
            .targetEvent($event)
        );
      }
    });
  };


}
}

app.component('profile', {
    templateUrl: 'client/components/profile/profile.html',
    controllerAs: 'profile',
    controller: ProfileCtrl
})
