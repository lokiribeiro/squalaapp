import {app} from '/client/app.js';
import Roles from '/imports/models/roles.js'
import Profiles from '/imports/models/profiles.js'
import Responsibilities from '/imports/models/responsibilities.js'



class AdminroleCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.profileID = $rootScope.profileID;
      $scope.rolesID = null;
      $scope.enabled = [];

      $scope.subscribe('roles2', function () {
          return [$scope.getReactively('rolesID')];
      });

      $scope.subscribe('profiles2', function () {
          return [$scope.getReactively('profileID')];
      });

      $scope.subscribe('responsibilities');

      $scope.helpers({
        roles() {
          $scope.promise = $timeout(function(){
            $scope.profileIDD = $scope.getReactively('profileID');
          }, 2000);

          var profileID = $scope.getReactively('profileIDD');
          var selector = {profiles_userID : profileID};
          var profiles = Profiles.find(selector);
          console.info('profiles', profiles);
          $scope.roleID = '';
          var counter = profiles.count();
          if(counter) {
          profiles.forEach(function(profile){
              roleID = profile.profiles_userroleID;
            });
          }
          var rolesIDD = $scope.getReactively('roleID');
          var roles = Roles.find(rolesIDD);
          var counter = roles.count();
          console.info('roles', roles);
          console.info('counter', counter);
          return roles;
        },
        profiles(){
          var profileID = $scope.profileID;
          var selector = {profiles_userID : profileID};
          var profiles = Profiles.find(selector);
          console.info('profiles', profiles);
          return profiles;
        },
        totalRoles(){
          var totalRoles = 1;
          return totalRoles;
        },
        responsibilities(){
          var sort = 1;
          var selector = {};
          var responsibilities = Responsibilities.find(
            selector, {sort: {responsibilityname: sort}}
          );
          //get role from profileID
          var profileID = $scope.profileID;
          var selector = {profiles_userID : profileID};
          var profiles = Profiles.find(selector);
          var counter = profiles.count();
          var roleID = '';
          if(counter) {
          profiles.forEach(function(profile){
            roleID = profiles.profiles_userroleID;
          });
        }
          console.info('roleID', roleID);
          var roles = Roles.find(roleID);
          console.info('rolesfindone', roles);
          roles.forEach(function(role){
            //var respNum = role.responsibilities[0].responsibilitiesID;
            //console.info('rolesfindone', respNum);
            var respNum = role.responsibilities.length;
            for(i=0; i<respNum; i++){
              var j=0;
              responsibilities.forEach(function(responsibility) {
                  if($scope.enabled[j] != true){
                    if(role.responsibilities[i].responsibilitiesID == responsibility._id ){
                      $scope.enabled[j] = true;
                    } else {
                      $scope.enabled[j] = false;
                    }
                  }
                  j++;
                });
              }
          });

          return responsibilities;
        }
      });//helpers


    }
}

app.component('adminrole', {
    templateUrl: 'client/components/adminrole/adminrole.html',
    controllerAs: 'adminrole',
    controller: AdminroleCtrl
})
