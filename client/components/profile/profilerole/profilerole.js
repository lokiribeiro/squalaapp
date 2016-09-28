import {app} from '/client/app.js';
import Roles from '/imports/models/roles.js'
import Profiles from '/imports/models/profiles.js'
import Responsibilities from '/imports/models/responsibilities.js'



class ProfileroleCtrl{

  constructor($rootScope, $scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.profileID = Meteor.userId();
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
          var profileID = $scope.profileID;
          var selector = {profiles_userID : profileID};
          var profiles = Profiles.findOne(selector);
          var roleID = profiles.profiles_userroleID;
          console.info('roleID', roleID);
          var roles = Roles.find(roleID);
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
          var profiles = Profiles.findOne(selector);
          var roleID = profiles.profiles_userroleID;
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

app.component('profilerole', {
    templateUrl: 'client/components/profile/profilerole/profilerole.html',
    controllerAs: 'profilerole',
    controller: ProfileroleCtrl
})
