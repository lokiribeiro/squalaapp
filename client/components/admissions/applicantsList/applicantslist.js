import {app} from '/client/app.js';

import Applicants from '/imports/models/applicants.js';
import Profiles from '/imports/models/profiles.js';
import Branches from '/imports/models/branches.js';
import Apps from '/imports/models/apps.js'
import Userapps from '/imports/models/userapps.js'
import Roles from '/imports/models/roles.js';


class ApplicantslistCtrl{

  constructor($scope, $timeout, $filter, $window, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';



      $scope.subscribe('applicantsNew', function () {
          return [$scope.getReactively('searchText')];
      });

      $scope.subscribe('profilesUser', function () {
          return [$scope.getReactively('thisUser')];
      });

      $scope.subscribe('roles', function () {
          return [$scope.getReactively('roleID')];
      });

      $scope.subscribe('apps');

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
            var branchID = $scope.getReactively('brancID');
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
            var branchID = $scope.getReactively('brancID');
            var type = 'New application';
            var selector = {branchId: branchID, $and: [{status: type}]};
            var applicants = Applicants.find(selector);
            var count = applicants.count();
            return count;
          }
      })//helpers

      $scope.rolesID = null;
      $scope.doneSearching = false;
      $scope.dateToday = new Date();
      $scope.formattedDay = $filter('date')($scope.dateToday);
      console.info('formattedDay', $scope.formattedDay);

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
        $scope.searchText = '';
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


      $scope.openPanel = function(applicantId) {
        $scope.applicantIdInstance = applicantId;
        console.info('applicantId', $scope.applicantIdInstance );
      }
      }

      /**/

      /*
      $mdExpansionPanel().waitFor(applicantID).then(function (instance) {
        instance.expand();
        instance.collapse();
        instance.remove({animation: false});
        instance.onRemove(function () {});
        instance.isOpen();
        });
      */


      //$mdExpansionPanel(appID).addClickCatcher(function () {
      //  console.log('clicked');
      //});

      // In this example, we set up our model using a plain object.
       // Using a class works too. All that matters is that we implement
       // getItemAtIndex and getLength.

       $scope.removeUser = function($event, item) {
         // Show the dialog
         $scope.passedId = item._id;
         console.info('unassign', $scope.passedId);

         $mdDialog.show({
           clickOutsideToClose: false,
           escapeToClose: true,
           transclude: true,
           locals: {
             passedId: $scope.passedId
           },
           controller: function($mdDialog, passedId, $scope) {
               $scope.passedId = passedId;

               $scope.removeNow = function() {
                   var userID = $scope.passedId;

                   $scope.done = true;
                   $scope.existing = false;
                   $scope.createdNow = !$scope.createdNow;
                   //var status = createUserFromAdmin(details);
                   var selector = {_id:userID};
                   var err = Applicants.remove(selector);

                   if (err) {
                     $scope.createdNows = !$scope.createdNows;
                     $scope.done = false;
                     $scope.selected3 = '';
                     //delete old apps
                     window.setTimeout(function(){
                       $scope.$apply();
                     },2000);
                       //do something with the id : for ex create profile
                     } else {
                       $scope.done = false;
                       $scope.createdNow = !$scope.createdNow;
                       $scope.existing = true;
                       window.setTimeout(function(){
                         $scope.$apply();
                       },2000);

                     }

                 }

                 $scope.closeDialog = function() {
                   $mdDialog.cancel();
                 };
               },
               templateUrl: 'client/components/admissions/removeDialogs/deleteapplicant.html',
               targetEvent: $event
             });
           }

           $scope.openApplication = function (selected) {
             console.info('selected:', selected._id);
             var applicantID = selected._id;
             $state.go('AdmissionsApplicantProfile', {stateHolder : 'Admissions', userID : Meteor.userId(), applicantID : applicantID});
           }

           $scope.canCreateProfile = false;

           $scope.markPaid = function(applicantID, detail, applicantInfo){
             console.log(detail);
             if(detail == 'Settled reservation fee'){
               var progress = 85;
               Meteor.call('upsertApplicantFromDocs', applicantID, progress, function(err, detail) {
                   var detail = detail;
                   console.log(detail);
                     if (err) {
                       var toasted = 'Error updating application.';
                       var pinTo = $scope.getToastPosition();
                       $mdToast.show(
                         $mdToast.simple()
                         .textContent(toasted)
                         .position(pinTo )
                         .hideDelay(3000)
                         .theme('Admissions')
                         .action('HIDE')
                         .highlightAction(true)
                         .highlightClass('md-accent')
                       );
                       $scope.doneSearching = false;
                    } else {
                      var toasted = 'application status updated.';
                      var pinTo = $scope.getToastPosition();
                      $mdToast.show(
                        $mdToast.simple()
                        .textContent(toasted)
                        .position(pinTo )
                        .hideDelay(3000)
                        .theme('Admissions')
                        .action('HIDE')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                      );
                      $scope.doneSearching = false;

                    }
                 });

             } else if (detail == 'For class assignment'){
               var progress = 100;
               var status = "Enrolled";
               var selector = {_id: applicantID};
               var modifier = {$set: {status: status}};
               Applicants.update(selector,modifier);
               Meteor.call('upsertApplicantFromDocs', applicantID, progress, function(err, detail) {
                   var detail = detail;
                   console.log(detail);
                     if (err) {
                       var toasted = 'Error enrolling student.';
                       var pinTo = $scope.getToastPosition();
                       $mdToast.show(
                         $mdToast.simple()
                         .textContent(toasted)
                         .position(pinTo )
                         .hideDelay(3000)
                         .theme('Admissions')
                         .action('HIDE')
                         .highlightAction(true)
                         .highlightClass('md-accent')
                       );
                       $scope.doneSearching = false;
                    } else {
                      var toasted = 'Student successfully enrolled.';
                      var pinTo = $scope.getToastPosition();
                      $mdToast.show(
                        $mdToast.simple()
                        .textContent(toasted)
                        .position(pinTo )
                        .hideDelay(3000)
                        .theme('Admissions')
                        .action('HIDE')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                      );
                      $scope.doneSearching = false;


                      var pass = Random.hexString(8);
                      var emailPass = pass;
                      var emailUsername = applicantInfo.applicationNum;
                      var email = applicantInfo.email;

                      $scope.emailPassa = emailPass;
                      $scope.emailUsernamea = emailUsername;
                      $scope.emaila = email;
                      $scope.brancha = applicantInfo.branchId;
                      $scope.firstnamea = applicantInfo.firstname;
                      $scope.middlename = applicantInfo.middlename;
                      $scope.lastnamea = applicantInfo.lastname;
                      $scope.mobileNoa = applicantInfo.mobileNo;
                      $scope.birthdaya = applicantInfo.birthdate;
                      $scope.gendera = applicantInfo.gender;
                      $scope.feesida = applicantInfo.feesid;


                      $scope.done = true;
                      $scope.existing = false;
                      $scope.createdNow = !$scope.createdNow;
                      //var status = createUserFromAdmin(details);

                      Meteor.call('createUserFromAdmin', emailUsername, email, pass, function(err, newuserID) {
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
                               $scope.newUserID = newuserID;
                               //simulation purposes
                               window.setTimeout(function(){
                               $scope.canCreateProfile = true
                               $scope.$apply();
                               if($scope.canCreateProfile){
                               //create user profile
                                   $scope.createProfile($scope.newUserID);
                                 }
                             },2000);
                             }
                          });



                    }
                 });

             }
           }


           $scope.createProfile = function (newUserID) {
                 console.log(newUserID);
                 //console.log(profileDetails.emails[0].address);
                 var userAppsHolder = {
                   userID: '',
                   appId: '',
                   appName: '',
                   appLoc: '',
                   desc: ''
                 };
                 var metPass = $scope.emailPassa;
                 var metPassa = $scope.emailPassa;
                 var metUname = $scope.emailUsernamea;
                 var metEmail = $scope.emaila;
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
                 var userFirstname =   $scope.firstnamea  + ' ' +   $scope.lastnamea;
                 console.info('userFirstname', userFirstname);
                 var branchIDD = $scope.brancha;
                 console.info('brancha', branchIDD);
                 var userRole = 'student';

                 Meteor.call('upsertUserFromAdmissions', newUserID, userFirstname, branchIDD, userRole, function(err, detail) {
                   if (err) {

                       $scope.createdNow = !$scope.createdNow;

                  } else {
                    $scope.createdNows = !$scope.createdNows;

                  }
               });

               var enrolledRole = 'student';

               var selector = {_id: enrolledRole};
               var getApps = Roles.find(selector);
               var counter = getApps.count();
               console.info('student from role', counter);
               getApps.forEach(function(getApp){
                 var instances = getApp.apps.length;
                 for(i=0;i<instances;i++){
                   var enrolledAppId = getApp.apps[i].appId;
                   var selector = {_id: enrolledAppId};
                   var fromApps = Apps.findOne(selector);

                   userAppsHolder.userID = newUserID;
                   userAppsHolder.appId = enrolledAppId;
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

                 profile.profiles_userID = newUserID;
                 profile.profiles_firstname = $scope.firstnamea;
                 profile.profiles_lastname = $scope.lastnamea;
                 profile.profiles_email = $scope.emaila;
                 profile.profiles_username = $scope.emailUsernamea;
                 profile.profiles_profilephoto = '../../assets/img/profiles/user.png';
                 profile.profiles_createdAt = new Date();
                 profile.profiles_phone = $scope.mobileNoa;
                 profile.profiles_birthday = $scope.birthdaya;
                 profile.profiles_gender = $scope.gendera;
                 profile.profiles_type = 'Student';
                 profile.profiles_userroleID = 'student';
                 profile.profiles_jobTitle = null;
                 profile.profiles_branchID = $scope.brancha;
                 profile.profiles_branch =   $scope.branchName;


                 profile.profiles_apps = [];

                 var profileID = Profiles.insert(profile);

                 var userPhoto = '../../assets/img/profiles/user.png';
                 var userBranch = $scope.branchName;
                 var userBranchID = $scope.brancha;
                 var userName = $scope.firstnamea + ' ' + $scope.lastnamea;
                 var feesID = $scope.feesida;
                 var lastnameNew = $scope.lastnamea;
                 var firstnameNew = $scope.firstnamea;
                 var usernameNow = $scope.emailUsernamea;;
                 var amount = 500;
                 var balance = 0;
                 var paytype = 'cash';
                 var dateNow = new Date();
                 var appliedToMonth = 'December';
                 var appliedToAmount = amount;
                 console.info('usernameNow', usernameNow);

                 Meteor.call('upsertNewFeesFromCollect', newUserID, feesID, function(err, detail) {
                   if (err) {
                       //do something with the id : for ex create profile
                       console.log('error in fees creation');
                  } else {
                    Meteor.call('upsertStudentToFees', newUserID, userPhoto, userBranch, userBranchID, userName, feesID, function(err, stats) {
                      if (err) {
                        console.log('error upsert role to meteor.user');
                   }else {
                     Meteor.call('upsertHistoryFromAdmissions', usernameNow, amount, balance, paytype, userBranchID, dateNow, lastnameNew, firstnameNew, appliedToMonth, appliedToAmount, function(err, newID) {
                           console.log(detail);
                           var newID = newID;
                           console.info('newID', newID);
                             if (err) {
                                 //do something with the id : for ex create profile
                                 console.info('error', err);
                            } else {
                              console.info('success', err);
                            }
                         });
                    }
                  });
                   }
                 });


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

app.component('applicantslists', {
    templateUrl: 'client/components/admissions3/applicantsList/applicantslist.html',
    controllerAs: 'applicantslists',
    controller: ApplicantslistCtrl
})
