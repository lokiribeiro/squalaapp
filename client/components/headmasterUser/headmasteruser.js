import {app} from '/client/app.js';

//import Users from '/imports/models/users.js';

class HeadmasteruserCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';

      $scope.hidden = false;
      $scope.isOpen = false;
      $scope.hover = false;
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
      $scope.$watch('demo.isOpen', function(isOpen) {
        if (isOpen) {
          $timeout(function() {
            $scope.tooltipVisible = $scope.isOpen;
          }, 600);
        } else {
          $scope.tooltipVisible = $scope.isOpen;
        }
      });

      $scope.items = [
        { name: "Add user", icon: "../../assets/img/white_addperson24.svg", direction: "left" },
        { name: "Add multiple user", icon: "../../assets/img/white_people24.svg", direction: "left" },
      ];


      $scope.openDialog = function($event, item) {
        // Show the dialog
        if(item.name == "Add user") {
          $mdDialog.show({
            clickOutsideToClose: false,
            escapeToClose: true,
            controller: function($mdDialog) {
              // Save the clicked item
              $scope.FABitem = item;
              // Setup some handlers
              $scope.close = function() {
                $mdDialog.cancel();
              };
            },
            controllerAs: 'headmastercreateuser',
            controller: HeadmasteruserCtrl,
            template: '<headmastercreateuser></headmastercreateuser>',
            targetEvent: $event
          });
        }
      }

      $scope.openSchool = function (selected) {
        console.info('selected:', selected[0]._id);
        var branchID = selected[0]._id;
        $state.go('Headmasterschool', {stateHolder : 'Headmaster', userID : Meteor.userId(), branchID : branchID});
      }

      $scope.openRole = function () {
        $state.go('Headmasterrole', {stateHolder : 'Headmaster', userID : Meteor.userId()});
      }

      $scope.openResp = function () {
        $state.go('Headmasterresp', {stateHolder : 'Headmaster', userID : Meteor.userId()});
      }



    }
}

app.component('headmasteruser', {
    templateUrl: 'client/components/headmasterUser/headmasteruser.html',
    controllerAs: 'headmasteruser',
    controller: HeadmasteruserCtrl
})
