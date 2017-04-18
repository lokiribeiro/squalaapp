import {app} from '/client/app.js';
import Profiles from '/imports/models/profiles.js';
import ngFileUpload from 'ng-file-upload';
import Papa from '/imports/ui/papaparse.js';
import Userapps from '/imports/models/userapps.js';
import Apps from '/imports/models/apps.js';
import Roles from '/imports/models/roles.js';


class HeadmastercreateusersCtrl{

  constructor($scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state, Upload){
      'ngInject';

      //helpers
      $scope.rolesID = null;

      $scope.subscribe('userapps2');
      $scope.subscribe('apps');
      $scope.subscribe('roles2', function () {
          return [$scope.getReactively('rolesID')];
      });


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

      Slingshot.fileRestrictions("myFileUploads", {
      allowedFileTypes: null,
      maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
      });

      $scope.uploader = new Slingshot.Upload('myFileUploads');
      $scope.uploadingNow = false;
      $scope.uploaded = false;
      $scope.doneSearching = false;

      var details = this.credentials;
      $form = this.register;

      console.log('details: ' + details);
      console.log('form: ' + $form);

      $scope.createUser = function(details, index) {
        var detail = details;
        $scope.indexPoint = index;
        console.info('detail from for loop', detail.email);
        var pass = Random.hexString(8);
        $scope.emailPass = pass;
        $scope.textPass = pass;
        $scope.emailUsername = detail.username;
        $scope.email = detail.email;
        detail.password = pass;
        //var status = createUserFromAdmin(details);
        if(detail.email != null){

        Meteor.call('createUserFromAdmin', detail.username, detail.email, detail.password, function(err, newuserID) {
              console.log(detail);
              var newuserID = newuserID;
              console.info('newuserID', newuserID);
                if (err) {
                    //do something with the id : for ex create profile
                    console.info('error', err);
               } else {
                 $scope.newUserID = newuserID;
                 var metPass = detail.password;
                 var metUname = detail.username;
                 var metEmail = detail.email;
                 var newuserID = newuserID;
                 var email = detail.email;
                 console.log(email);
                 var from = 'admin@tlplbinternational.com';
                 var subject = '[Squala for The Learning Place] Your web presence credentials';
                 var text = 'Welcome to Squala for The Learning Place! Your username: ' + metUname + '        Password: ' + metPass + '. Access the app at https://www.squalafortlplbinternational.com.';
                 Meteor.call('sendEmail', email, from, subject, text, function(err, detail) {
                   if (err) {
                       //do something with the id : for ex create profile
                       console.log('err');
                  } else {
                    console.log('suc');
                  }
                 });
                 //simulation purposes
                 $scope.canCreateProfile = true;
                 if($scope.canCreateProfile){
                 //create user profile
                 console.info('details before profile call', details);
                     $scope.createProfile($scope.newUserID, details, metPass);
                      $scope.canCreateProfile = false;
                      console.info('indexPoint', $scope.indexPoint);
                      console.info('arrayLength', parseInt($scope.arrayLength) - 1);
                      if($scope.indexPoint == (parseInt($scope.arrayLength) - 1))
                      {
                        window.setTimeout(function(){
                          $scope.createdNow = true;
                          $scope.done = false;
                          $scope.createdNows = true;
                        },2000);

                      }
                   }
               }
            });
          }

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

    $scope.createProfile = function (newUserID, profileDetails, password) {
          console.info('password', password);
          //console.log(profileDetails.emails[0].address);
          var userFirstname = profileDetails.firstname + ' ' + profileDetails.lastname;
          console.info('userFirstname', userFirstname);

          var userRole = profileDetails.userroleid;
          var branchID = profileDetails.branchid;

          Meteor.call('upsertUserFromAdmissions', newUserID, userFirstname, branchID, userRole, function(err, detail) {
            if (err) {
                //do something with the id : for ex create profile
                console.log('error in profile creation');
           } else {
             var idOfUser = newUserID;
             var idOfRole = userRole;

             var userAppsHolder = {
               userID: '',
               appId: '',
               appName: '',
               appLoc: '',
               desc: ''
             };
             var selector = {userID: idOfUser};
             var oldApps = Userapps.find(selector);
             var oldAppsCount = oldApps.count();
             console.info('oldappscount', oldAppsCount);

             oldApps.forEach(function(oldApp){
               var oldAppId = oldApp._id;
               selector = {_id: oldAppId}
               var status = Userapps.remove(selector);
               if(status){
                 console.info('success deleting app', oldAppId);
               }
               else{
                 console.info('error deleting app', oldAppId);
               }
             })

             //get role apps
             selector = {_id: idOfRole};
             var newRoleApps = Roles.find(selector);
             var newRoleAppsCount = newRoleApps.count();
             console.info('newRoleAppsCount', newRoleAppsCount);

             newRoleApps.forEach(function(newRoleApp){
               var newRoleAppsLength = newRoleApp.apps.length;
               console.info('newRoleAppsLength', newRoleAppsLength);

               for(i=0;i<newRoleAppsLength;i++){
                 var appID = newRoleApp.apps[i].appId;
                 selector = {_id: appID};
                 var fromApps = Apps.findOne(selector);

                 userAppsHolder.userID = idOfUser;
                 userAppsHolder.appId = appID;
                 userAppsHolder.appName = fromApps.name;
                 userAppsHolder.appLoc = fromApps.loc;
                 userAppsHolder.desc = fromApps.desc;

                 var status = Userapps.insert(userAppsHolder);
                 if (status) {
                   console.log('inserted user to userapps');

                 } else {
                   console.log('error inserting');
                 }
                 }
               });
           }
        });

        if(profileDetails.profiletype == 'Student')
        {
          var feesID = profileDetails.feesID;
          var userPhoto = '../../assets/img/profiles/user.png';
          var userBranch = profileDetails.branch;
          var userBranchID = profileDetails.branchid;
          var userName = profileDetails.firstname + ' ' + profileDetails.lastname;

          Meteor.call('upsertNewFeesFromCollect', newUserID, feesID, function(err, detail) {
            if (err) {
                //do something with the id : for ex create profile
                console.log('error in fees creation');
           } else {
             Meteor.call('upsertStudentToFees', newUserID, userPhoto, userBranch, userBranchID, userName, feesID, function(err, stats) {
               if (err) {
                 console.log('error upsert role to meteor.user');
            }else {
              console.log('success in fees creation');
            }
          });
         }
       });

        }





          var profile = [];

          profile.profiles_userID = newUserID;
          profile.profiles_firstname = profileDetails.firstname;
          profile.profiles_lastname = profileDetails.lastname;
          profile.profiles_email = profileDetails.email;
          profile.profiles_username = profileDetails.username;
          profile.profiles_profilephoto = '../../assets/img/profiles/user.png';
          profile.profiles_createdAt = new Date();
          profile.profiles_phone = profileDetails.phone;
          profile.profiles_birthday = profileDetails.birthday;
          profile.profiles_gender = profileDetails.gender;
          profile.profiles_type = profileDetails.profiletype;
          profile.profiles_userroleID = profileDetails.userroleid;
          profile.profiles_jobTitle = null;
          profile.profiles_branch = profileDetails.branch;
          profile.profiles_branchID = profileDetails.branchid;
          profile.profiles_textPassword = password;

          if(profileDetails.userroleid == 'student'){
            profile.profiles_gradelevel = profileDetails.level;
            profile.profiles_section = profileDetails.section;
            profile.profiles_address = profileDetails.street;
            profile.profiles_city = profileDetails.city;
            profile.profiles_province = profileDetails.province;
            profile.profiles_guardian = profileDetails.guardian;

            var profileID = Profiles.insert(profile);

            console.info('profileID', profileID);

            /*var pass = Random.hexString(8);
            var guardianPass = pass;
            var guardianUsername = 'G' + profileDetails.username;
            var guardianEmail = profileDetails.email;

            Meteor.call('createGuardianFromAdmin', guardianUsername, guardianPass, function(err, guardianID) {
                  var guardianID = guardianID;
                  console.info('newuserID', guardianID);
                    if (err) {
                        //do something with the id : for ex create profile
                        console.info('error', err);
                   } else {
                     var metPass = guardianPass;
                     var metUname = guardianUsername;
                     var metEmail = guardianEmail;
                     var guardianID = guardianID;
                     var email = guardianEmail;
                     console.log(email);
                     var from = 'admin@tlplbinternational.com';
                     var subject = '[Squala for The Learning Place] Your Rapido Parent app credentials';
                     var text = 'Be notified with the academic progress of your kids! Your username: ' + metUname + '        Password: ' + metPass + '. Access the app at https://www.squalafortlplbinternational.com.';
                     Meteor.call('sendEmail', email, from, subject, text, function(err, detail) {
                       if (err) {
                           //do something with the id : for ex create profile
                           console.log('err');
                      } else {
                        console.log('suc');
                      }
                     });
                     //simulation purposes
                     //$scope.guardianProfile = true;
                     var userFirstname = profileDetails.guardian;
                     console.info('userFirstname', userFirstname);

                     var userRole = 'parent';
                     var branchID = profileDetails.branchid;

                     Meteor.call('upsertUserFromAdmissions', guardianID, userFirstname, branchID, userRole, function(err, guardianDetail) {
                       if (err) {
                           //do something with the id : for ex create profile
                           console.log('error in profile creation');
                      } else {
                        var idOfUser = newUserID;
                        var idOfRole = userRole;

                        console.info('idOfRole', idOfRole);

                        var userAppsHolder = {
                          userID: '',
                          appId: '',
                          appName: '',
                          appLoc: '',
                          desc: ''
                        };
                        var selector = {userID: idOfUser};
                        var oldApps = Userapps.find(selector);
                        var oldAppsCount = oldApps.count();
                        console.info('oldappscount', oldAppsCount);

                        oldApps.forEach(function(oldApp){
                          var oldAppId = oldApp._id;
                          selector = {_id: oldAppId}
                          var status = Userapps.remove(selector);
                          if(status){
                            console.info('success deleting app', oldAppId);
                          }
                          else{
                            console.info('error deleting app', oldAppId);
                          }
                        })

                        //get role apps
                        selector = {_id: idOfRole};
                        var newRoleApps = Roles.find(selector);
                        var newRoleAppsCount = newRoleApps.count();
                        console.info('newRoleAppsCount', newRoleAppsCount);

                        newRoleApps.forEach(function(newRoleApp){
                          var newRoleAppsLength = newRoleApp.apps.length;
                          console.info('newRoleAppsLength', newRoleAppsLength);

                          for(i=0;i<newRoleAppsLength;i++){
                            var appID = newRoleApp.apps[i].appId;
                            selector = {_id: appID};
                            var fromApps = Apps.findOne(selector);

                            userAppsHolder.userID = idOfUser;
                            userAppsHolder.appId = appID;
                            userAppsHolder.appName = fromApps.name;
                            userAppsHolder.appLoc = fromApps.loc;
                            userAppsHolder.desc = fromApps.desc;

                            var status = Userapps.insert(userAppsHolder);
                            if (status) {
                              console.log('inserted user to userapps');

                            } else {
                              console.log('error inserting');
                            }
                            }
                          });

                          var profile = [];
                          var fullname = profileDetails.firstname + ' ' + profileDetails.lastname;

                          profile.profiles_userID = newUserID;
                          profile.profiles_firstname = profileDetails.guardian;
                          profile.profiles_email = profileDetails.email;
                          profile.profiles_username = $scope.guardianUsername;
                          profile.profiles_profilephoto = '../../assets/img/profiles/user.png';
                          profile.profiles_createdAt = new Date();
                          profile.profiles_phone = profileDetails.phone;
                          profile.child = fullname;
                          profile.profiles_type = 'Parent';
                          profile.profiles_userroleID = 'parent';
                          profile.profiles_jobTitle = null;
                          profile.profiles_branch = profileDetails.branch;
                          profile.profiles_branchID = profileDetails.branchid;

                          var profileID = Profiles.insert(profile);

                          console.info('profileID', profileID);
                          $scope.guardianProfile = false;
                      }
                   });
                   }
                });*/


          } else {
            var profileID = Profiles.insert(profile);

            console.info('profileID', profileID);

          }


        /*party.ownerId = Meteor.userId();
        party.ownerEmail = Meteor.user().emails[0].address;
        party.createdAt = new Date();
        party.invitedUsers = [];
        party.location = null;
        Parties.insert(party);
        party.name = null;
        party.description = null;*/
    };

    $scope.uploadFiles = function(file, errFiles, reqID, reqName) {
      console.log('pasok');
      $scope.progress = 0;
      $scope.createdNow = true;
      $scope.f = file;
      $scope.errFile = errFiles && errFiles[0];
      $scope.fileHere = file.name;
      var requirementname = reqName;
      var requirementID = reqID;
      $scope.done = true;
      if (file) {
        console.log(file);
        $scope.fileCSV = file;

        var config = {
	         delimiter: "",	// auto-detect
	         newline: "",	// auto-detect
	         header: true,
	         dynamicTyping: false,
	         preview: 0,
	         encoding: "",
	         worker: false,
	         comments: false,
	         step: undefined,
	         complete: function(results, file) {
	            console.info("Parsing complete:", results);
              var length = results.data.length;
              $scope.arrayLength = length;
              console.info("Array length:", length);
              for(i=0;i<length;i++){
                var details = results.data[i];
                console.info('details from parsed CSV', details);
                $scope.createUser(details, i);
              }
              var file = $scope.fileCSV;
                file.upload = Upload.upload({
                    url: '/uploads',
                    data: {file: file}
                });
                var filename = file.name;
                var path = '/uploads';
                var type = file.type;
                switch (type) {
                  case 'text':
                  //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
                  var method = 'readAsText';
                  var encoding = 'utf8';
                  break;
                  case 'binary':
                  var method = 'readAsBinaryString';
                  var encoding = 'binary';
                  break;
                  default:
                  var method = 'readAsBinaryString';
                  var encoding = 'binary';
                  break;
                }
                /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('success maybe?');
                  }
                });*/


                file.upload.then(function (response) {
                    $timeout(function () {
                      console.log(response);
                        file.result = response.data;
                        $scope.Fresult = response.config.data.file;

                        var errs = 0;
                        var Fresult = $scope.Fresult;
                        console.info('$scope', Fresult);
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                    else {
                      console.log('else pa');
                    }
                }, function (event) {
                    file.progress = Math.min(100, parseInt(100.0 *
                                             event.loaded / event.total));
                    $scope.progress = file.progress;
                    if ($scope.progress == 100) {
                      console.log('transferred up');
                    }
                    console.log($scope.progress);
                });


            },
	         error: function(results, file) {
	            console.info("Parsing complete:", results);
            },
	         download: false,
	         skipEmptyLines: false,
	         chunk: undefined,
	         fastMode: undefined,
	         beforeFirstChunk: undefined,
	         withCredentials: undefined
         };

        Papa.parse(file, config);


        /*Papa.parse(file, config)
            .then(handleParseResult)
            .catch(handleParseError)
            .finally(parsingFinished);


          function handleParseResult(result) {
            console.info("Parsing complete1:", result);*/


            /*}

        function handleParseError(result) {
        // display error message to the user
        console.info("Parsing complete2:", result);
          }

          function parsingFinished() {
        // whatever needs to be done after the parsing has finished
        console.info("Parsing complete3:", result);
      }*/



      }
  };


}
}

app.component('headmastercreateusers', {
    templateUrl: 'client/components/headmasterUser/createUsers/createusers.html',
    controllerAs: 'headmastercreateusers',
    controller: HeadmastercreateusersCtrl
})
