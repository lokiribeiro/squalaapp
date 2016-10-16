import {app} from '/client/app.js';
import Profiles from '/imports/models/profiles.js';

class HeadmastercreateuserCtrl{

  constructor($scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      //helpers
      this.$state = $state;

      $reactive(this).attach($scope);

      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.canCreateProfile = false;

      this.credentials = {
        username: '',
        password: ''
      };

      this.register = {
        firstname: '',
        lastname: '',
        username: ''
      }

      this.error = '';

      var details = this.credentials;
      $form = this.register;

      console.log('details: ' + details);
      console.log('form: ' + $form);

      $scope.createUser = function(details) {
        var detail = details;
        var pass = Random.hexString(8);
        $scope.emailPass = pass;
        $scope.emailUsername = detail.username;
        $scope.email = detail.email;
        detail.password = pass;
        $scope.done = true;
        $scope.existing = false;
        $scope.createdNow = !$scope.createdNow;
        //var status = createUserFromAdmin(details);

        Meteor.call('createUserFromAdmin', detail.username, detail.email, detail.password, function(err, detail) {
              var detail = detail;
              var newuserID = detail;
              console.log(detail);
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
                 $scope.newUserID = newuserID;
                 //simulation purposes
                 window.setTimeout(function(){
                 $scope.canCreateProfile = true
                 $scope.$apply();
                 if($scope.canCreateProfile){
                 //create user profile
                     $scope.createProfile($scope.newUserID, details);
                   }
               },2000);
               }
            });

      }

        $scope.createAnother = function() {
           $scope.createdNows = !$scope.createdNows;
           $scope.createdNow = !$scope.createdNow;
           //$scope.createdNow = '1';
      }


        $scope.items = [
        { name: "Add user", icon: "../../assets/img/white_addperson24.svg", direction: "left" },
        { name: "Add multiple user", icon: "../../assets/img/white_people24.svg", direction: "left" },
        ];

      $scope.closeDialog = function() {
         $mdDialog.hide();
         //$scope.createdNow = '1';
    }

    $scope.createProfile = function (newUserID, profileDetails) {
          console.log(newUserID);
          //console.log(profileDetails.emails[0].address);
          var metPass = $scope.emailPass;
          var metUname = $scope.emailUsername;
          var metEmail = $scope.email;
          var newuserID = newUserID;
          var email = metEmail;
          console.log(email);
          var from = 'admin@apecschools.edu.ph';
          var subject = '[Squala for APEC Schools] Your web presence credentials';
          var text = 'Welcome to Squala for APEC Schools! Your username: ' + metUname + '        Password: ' + metPass + '. Access the app at https://www.squalaforapecschools.edu.ph.';
          Meteor.call('sendEmail', email, from, subject, text, function(err, detail) {
            if (err) {
                //do something with the id : for ex create profile
                console.log('err');
           } else {
             console.log('suc');
           }
          });
          var userFirstname = profileDetails.firstname + ' ' + profileDetails.lastname;
          console.info('userFirstname', userFirstname);

          Meteor.call('upsertUserFromAdmin', newUserID, userFirstname, function(err, detail) {
            if (err) {
                //do something with the id : for ex create profile
                $scope.done = false;
                $scope.createdNow = !$scope.createdNow;
                $scope.existing = true;
                window.setTimeout(function(){
                $scope.$apply();
              },2000);
           } else {
             $scope.createdNows = !$scope.createdNows;
             $scope.done = false;
             //simulation purposes
             window.setTimeout(function(){
             $scope.$apply();
           },2000);
           }
        });

          var profile = [];

          profile.profiles_userID = newUserID;
          profile.profiles_firstname = profileDetails.firstname;
          profile.profiles_lastname = profileDetails.lastname;
          profile.profiles_email = profileDetails.email;
          profile.profiles_username = profileDetails.username;
          profile.profiles_profilephoto = '../../assets/img/profiles/user.png';
          profile.profiles_createdAt = new Date();
          profile.profiles_phone = null;
          profile.profiles_birthday = null;
          profile.profiles_gender = null;
          profile.profiles_type = null;
          profile.profiles_userroleID = null;
          profile.profiles_jobTitle = null;
          profile.profiles_branch = null;
          profile.profiles_apps = [];

          var profileID = Profiles.insert(profile);

          console.info('profileID', profileID);
        /*party.ownerId = Meteor.userId();
        party.ownerEmail = Meteor.user().emails[0].address;
        party.createdAt = new Date();
        party.invitedUsers = [];
        party.location = null;
        Parties.insert(party);
        party.name = null;
        party.description = null;*/
    };
}
}

app.component('headmastercreateuser', {
    templateUrl: 'client/components/headmasterUser/createUser/createuser.html',
    controllerAs: 'headmastercreateuser',
    controller: HeadmastercreateuserCtrl
})
