import {app} from '/client/app.js';
import Profiles from '/imports/models/profiles.js';
import ngFileUpload from 'ng-file-upload';
import Papa from '/imports/ui/papaparse.js';
import Userapps from '/imports/models/userapps.js';
import Apps from '/imports/models/apps.js';
import Roles from '/imports/models/roles.js';


class CollectfeesuploadCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $reactive, $state, $q, $mdToast, Upload){
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

      var details = this.credentials;
      $form = this.register;

      console.log('details: ' + details);
      console.log('form: ' + $form);


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



    $scope.uploadFiles = function(file, errFiles) {
      console.log('pasok', file);
      $scope.progress = 0;
      $scope.createdNow = true;
      $scope.f = file;
      $scope.errFile = errFiles && errFiles[0];
      $scope.fileHere = file.name;
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
              length = length - 1;
              for(i=0;i<length;i++){
                var details = results.data[i];
                console.info('details from parsed CSV', details);
                $scope.createFees(details, i);
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
                         var toasted = 'File parsed.';
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
                         $scope.done = false;
                         $scope.createdNow = false;

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

  $scope.createFees = function(details, index) {

    var detail = details;
    $scope.indexPoint = index;
    console.info('detail from for loop', detail);
    var fees = [];
    var monthConstant = [
      {month: 'june'},
      {month: 'july'},
      {month: 'august'},
      {month: 'september'},
      {month: 'october'},
      {month: 'november'},
      {month: 'december'},
      {month: 'january'},
      {month: 'february'},
      {month: 'march'},
      {month: 'april'},
      {month: 'may'}
    ];
    fees.feesName = details.fee_name;
    fees.description = details.fee_description;
    fees.code = details.fee_code;
    fees.gradelevel = details.fee_gradelevel;
    fees.type = details.fee_type
    fees.tuitionfee = details.fee_tuitionfee;
    fees.region = details.fee_region;
    fees.shift = details.fee_shift;
    fees.misc = details.fee_misc;
    fees.months = [];

    fees.months = [
      {month: 'june', amountDue: details.june},
      {month: 'july', amountDue: details.july},
      {month: 'august', amountDue: details.august},
      {month: 'september', amountDue: details.september},
      {month: 'october', amountDue: details.october},
      {month: 'november', amountDue: details.november},
      {month: 'december', amountDue: details.december},
      {month: 'january', amountDue: details.january},
      {month: 'february', amountDue: details.february},
      {month: 'march', amountDue: details.march},
      {month: 'april', amountDue: details.april},
      {month: 'may', amountDue: details.may}
    ]




    fees.june = details.june;
    fees.july = details.july;
    fees.august = details.august;
    fees.september = details.september;
    fees.october = details.october;
    fees.november = details.november;
    fees.december = details.december;
    fees.january = details.january;
    fees.february = details.february;
    fees.march = details.march;
    fees.april = details.april;
    fees.may = details.may;

    var status = Feescategories.insert(fees);
  if (status) {

    console.info('success', status);


 } else {
  console.info('failed', status);
  }



  }


}
}

app.component('collectfeesupload', {
    templateUrl: 'client/components/collect/collectcreatefeesupload/collectcreatefeesupload.html',
    controllerAs: 'collectfeesupload',
    controller: CollectfeesuploadCtrl
})
