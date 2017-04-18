import {app} from '/client/app.js';

import Feesuploads from '/imports/models/feesuploads.js';
import Feescategories from '/imports/models/feescategories.js';
import ngFileUpload from 'ng-file-upload';
import Papa from '/imports/ui/papaparse.js';


//import Users from '/imports/models/users.js';

class UploadfeedsCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, Upload){
      'ngInject';

      $scope.subscribe('feesuploads');
      $scope.subscribe('feescategories2');
      $scope.subscribe('users');

      $scope.helpers({
        feesuploads(){
          var selector = {};
          var feesuploads = Feesuploads.find(selector);
          var count = feesuploads.count();
          console.info('count', count);
          return feesuploads;
        }
      });//helpers

      Slingshot.fileRestrictions("myFileUploads", {
      allowedFileTypes: null,
      maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
      });

      $scope.uploader = new Slingshot.Upload('myFileUploads');
      $scope.uploadingNow = false;
      $scope.uploaded = false;
      $scope.doneSearching = false;

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

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

      //$scope.currentUpload = false;
      $scope.uploadFiles = function(file, errFiles) {
        console.log('pasok', file);
        $scope.progress = 0;
        $scope.uploadingNow = true;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        $scope.fileHere = file.name;
        $scope.doneSearching = true;
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

                $scope.uploader.send(file, function (error, downloadUrl) {
                  if (error) {
                    // Log service detailed response.
                    console.error('Error uploading', $scope.uploader);
                    alert (error);
                  }
                  else {
                    var filename = $scope.fileHere;
                    var date = new Date();
                    Meteor.call('upsertFilesFromCollect', filename, downloadUrl, date, function(err, detail) {
                      console.log(downloadUrl);
                console.log('success: ' + downloadUrl)
                          if (err) {
                            var toasted = 'Error uploading file.';
                            var pinTo = $scope.getToastPosition();
                            $mdToast.show(
                              $mdToast.simple()
                              .textContent(toasted)
                              .position(pinTo )
                              .hideDelay(3000)
                              .theme('Collect')
                              .action('HIDE')
                              .highlightAction(true)
                              .highlightClass('md-accent')
                            );
                            $scope.doneSearching = false;
                         } else {
                           var toasted = 'Transaction file uploaded.';
                           var pinTo = $scope.getToastPosition();
                           $mdToast.show(
                             $mdToast.simple()
                             .textContent(toasted)
                             .position(pinTo )
                             .hideDelay(3000)
                             .theme('Collect')
                             .action('HIDE')
                             .highlightAction(true)
                             .highlightClass('md-accent')
                           );
                           $scope.doneSearching = false;

                         }
                      });
                  }
                  });
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
                        $scope.uploadingNow = false;
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




        }
    };

    $scope.createUser = function(details, index) {
      var detail = details;
      var statementMonth = 'february';
      $scope.indexPoint = index;
      console.info('detail from for loop', detail);
      $scope.studentnumber = detail.studentnumber;
      $scope.type = detail.type;
      $scope.branch = detail.branch;
      $scope.date = detail.date;
      $scope.lastname = detail.lastname;
      $scope.firstname = detail.firstname;
      var balanceFromCSV = parseInt(detail.bucket);
      var amount = parseInt(detail.amount);
      var balance = 0;
      var feesID = '';
      var appliedToMonth = '';
      var appliedToAmount = 0;
      var balanceFromCollection = 0;
      var amountFromCollection = [];
      var studentNumber = detail.studentnumber;
      var amount = parseInt(detail.amount);
      if(balanceFromCSV > 0) {
          balance = balanceFromCSV - amount;
          if(detail.studentnumber != null){

          Meteor.call('upsertTransactionFromCollect', detail.studentnumber, amount, balance, detail.type, detail.branch, detail.date, detail.lastname, detail.firstname,function(err, newID) {
                console.log(detail);
                var newID = newID;
                console.info('newID', newID);
                  if (err) {
                      //do something with the id : for ex create profile
                      console.info('error', err);
                 } else {
                   $scope.newID = newID;
                   var lastname = detail.lastname;
                   var firstname = detail.firstname;
                   var metEmail = 'student@gmail.com';
                   var newuserID = newuserID;
                   var amount = detail.amount;
                   var email = 'student@gmail.com';
                   console.log(email);
                   var from = 'admin@apecschools.edu.ph';
                   var subject = '[Squala for APEC Schools] Your transaction has been processed';
                   var text = 'Thank you' + lastname + ', ' + firstname + 'for paying the amount of ' + amount + '. Remaining balance: PHP ' + balance +'.';
                   Meteor.call('sendEmail', email, from, subject, text, function(err, detail) {
                     if (err) {
                         //do something with the id : for ex create profile
                         console.log('err');
                    } else {
                      console.log('suc');
                    }
                   });
                   //simulation purposes
                   /*$scope.canCreateProfile = true;
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
                     }*/
                 }
              });
            }
      } else if (balanceFromCSV == 0) {
        var selector = {username : studentNumber};
        var userDetails = Meteor.users.find(selector);
        var count = userDetails.count();
        console.info('userDetails', count);
        userDetails.forEach(function(userDetail) {
          if(userDetail.transactions){
          count = userDetail.transactions.length;
          feesID = userDetail.feesID;
          for(i=0;i<count;i++){
            balanceFromCollection = userDetail.transactions[i].balance;
            if(userDetail.statements){
              amountFromCollection = userDetail.statements;
            }
          }
        }
        });
        balance = parseInt(balanceFromCollection);
        balance = balance - amount;
        var months = 12;
        var selector = {_id: feesID};
        var feesMonths = [];

        var feesCats = Feescategories.find(selector);
        feesCats.forEach(function(feesCat){
          feesMonths = feesCat.months;
        })
        for(i=0;i<months;i++){
          if(feesMonths[i].month == statementMonth)
          {
            if(balanceFromCollection > 0){
              var x = 1;
              var feesMonthsAmount = parseInt(feesMonths[i-x].amountDue);

              if(balance > feesMonthsAmount){
                for(y=0;y<12;y++){
                  if(amountFromCollection[y] == feesMonths[i-x].month){
                    appliedToMonth = feesMonths[i].month;
                    appliedToAmount = feesMonths[i].amountDue;
                  } else {
                    appliedToMonth = feesMonths[i-x].month;
                    appliedToAmount = feesMonthsAmount;
                  }
                }
              }
              else {
                appliedToMonth = feesMonths[i].month;
                appliedToAmount = feesMonths[i].amountDue;
              }
            } else {
              appliedToMonth = feesMonths[i].month;
              appliedToAmount = feesMonths[i].amountDue;
            }
            Meteor.call('upsertHistoryFromCollect', detail.studentnumber, amount, balance, detail.type, detail.branch, detail.date, detail.lastname, detail.firstname, appliedToMonth, appliedToAmount, function(err, newID) {
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
        }

        if(detail.studentnumber != null){

        Meteor.call('upsertTransactionFromCollect', detail.studentnumber, amount, balance, detail.type, detail.branch, detail.date, detail.lastname, detail.firstname,function(err, newID) {
              console.log(detail);
              var newID = newID;
              console.info('newID', newID);
                if (err) {
                    //do something with the id : for ex create profile
                    console.info('error', err);
               } else {
                 $scope.newID = newID;
                 var lastname = detail.lastname;
                 var firstname = detail.firstname;
                 var metEmail = 'student@gmail.com';
                 var newuserID = newuserID;
                 var amount = detail.amount;
                 var email = 'student@gmail.com';
                 console.log(email);
                 var from = 'admin@apecschools.edu.ph';
                 var subject = '[Squala for APEC Schools] Your transaction has been processed';
                 var text = 'Thank you' + lastname + ', ' + firstname + 'for paying the amount of ' + amount + '. Remaining balance: PHP ' + balance +'.';
                 Meteor.call('sendEmail', email, from, subject, text, function(err, detail) {
                   if (err) {
                       //do something with the id : for ex create profile
                       console.log('err');
                  } else {
                    console.log('suc');
                  }
                 });
                 //simulation purposes
                 /*$scope.canCreateProfile = true;
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
                   }*/
               }
            });
          }
      }
      //var status = createUserFromAdmin(details);

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


    }
}

app.component('uploadfeeds', {
    templateUrl: 'client/components/collect/uploadfeeds/uploadfeeds.html',
    controllerAs: 'uploadfeeds',
    controller: UploadfeedsCtrl,
    transclude: true
})
