import {app} from '/client/app.js';

import '/imports/ui/loading.js';

import Responsibilities from '/imports/models/responsibilities.js';

class ShowrespCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q){
      'ngInject';

      $scope.selected = [];
      $scope.itemNow = [];

      console.log('pass');

      $scope.email = {
        address: ''
      };

      $scope.query = {
          order: 'createdAt'
        };

      $scope.perPage = 10;
      $scope.page = 1;
      $scope.sort = -1;
      $scope.searchText = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.subscribe('responsibilities', function () {
          $scope.promise = $timeout(function(){

          }, 2000);
          return [$scope.getReactively('searchText')];
      });

      $scope.helpers({
          responsibilities() {
                $scope.promise = $timeout(function(){

                }, 2000);
                var limit = parseInt($scope.getReactively('perPage'));
                var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
                var sort  = $scope.getReactively('sort');
                var selector = {};
                var responsibilities = Responsibilities.find(
                      selector, { limit: limit, skip: skip, sort: {createdAt: sort} }
                  );
                return responsibilities;
        },
        totalResponsibilities(){
            return Responsibilities.find().count();
        }
      })//helpers

      $scope.pageChange = function (newPageNumber) {
          $scope.page = newPageNumber;
      };

      $scope.filterShow = function(){
        $scope.filter.show = !$scope.filter.show;
      }

      $scope.changeSort = function () {
          $scope.sort = parseInt($scope.sort*-1);
      }

      $scope.closeFilter = function(){
        $scope.filter.show = !$scope.filter.show;
        $scope.searchText = '';
      }

      $scope.removeUser = function(userDel) {
        console.info('userid', $scope.selected);
        if(userDel){
          var idNow = $scope.selected[0]._id;
          Meteor.users.remove({_id: idNow});
          $scope.deletedNow = false;
          $scope.deletedNows = false;
          $scope.done = false;
          $scope.existing = false;
        }
        else{

          console.info('2', userDel);
        }

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

      $scope.openDialog = function ($event, selected) {
          $scope.userDel = selected[0]._id;
          console.info('userid', $scope.userDel );
          var userDel = $scope.userDel;
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            userDel : $scope.userDel
          },
          controller: function($scope, $mdDialog, userDel){
            $scope.userDel = userDel;
            $scope.deletedNow = false;
            $scope.existing = false;
            $scope.done = false;

            var selector = {_id: userDel};
            $scope.responsibilities = Responsibilities.findOne(selector);
            console.info('responde',  $scope.responsibilities);

            $scope.deleteResp = function(userDel) {

            $scope.done = true;
            $scope.deletedNow = !$scope.deletedNow;

            var selector = {_id: userDel};
            var err = Responsibilities.remove(selector);

            if (!err) {
                  //do something with the id : for ex create profile
                  $scope.done = false;
                  $scope.deletedNow = !$scope.deletedNow;
                  $scope.existing = true;
                  window.setTimeout(function(){
                    $scope.$apply();
                  },2000);
                  //UserProfile.insert({
                            //user: userId
                       //})
              } else {
                  $scope.deletedNows = !$scope.deletedNows;
                  $scope.done = false;
                  window.setTimeout(function(){
                    $scope.$apply();
                  },2000);
              }
            }

            $scope.cancelNow = function() {
              $mdDialog.cancel();
            };


          },
          templateUrl: 'client/components/headmasterRole/showResponsibilities/editresp/deleteresp.html',
          targetEvent: $event
        });
        };

        $scope.openEdit = function ($event, selected) {
            $scope.userDel = selected[0]._id;
            console.info('userid', $scope.userDel );
            var userDel = $scope.userDel;
            $mdDialog.show({
            clickOutsideToClose: false,
            escapeToClose: true,
            transclude: true,
            locals:{
              userDel : $scope.userDel
            },
            controller: function($scope, $mdDialog, userDel){
              $scope.userDel = userDel;
              $scope.deletedNow = false;
              $scope.existing = false;
              $scope.done = false;

              $scope.register = {
                responsibilityname: ''
              };

              var selector = {_id: userDel};
              var respoName = Responsibilities.findOne(selector);

              console.info('respoName', respoName);
              console.info('respoName', $scope.register);

              $scope.register.responsibilityname = respoName.responsibilityname;

              console.info('respoName', $scope.register);

              $scope.updateResp = function(userDel) {
              console.info('updateResp', userDel);

              $scope.done = true;
              $scope.deletedNow = !$scope.deletedNow;
              var name = $scope.register.responsibilityname;

              Meteor.call('upsertResponsibilityFromAdmin', userDel, name, function(err, userDel) {
                        if (err) {
                            //do something with the id : for ex create profile
                            $scope.done = false;
                            $scope.deletedNow = !$scope.deletedNow;
                            $scope.existing = true;
                            window.setTimeout(function(){
                              $scope.$apply();
                          },2000);
                          //UserProfile.insert({
                              //user: userId
                         //})
                       } else {
                         //simulation purposes
                           $scope.deletedNows = !$scope.deletedNows;
                           $scope.done = false;
                           window.setTimeout(function(){
                           $scope.$apply();
                         },2000);
                       }
                    });
                }

                $scope.cancelNow = function() {
                  $mdDialog.cancel();
                };


            },
            templateUrl: 'client/components/headmasterRole/showResponsibilities/editresp/editresp.html',
            targetEvent: $event
          });
          };

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.openProfile = function (selected) {
          console.info('selected:', selected[0]._id);
          var profileID = selected[0]._id;
          $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
        }



      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('showresp', {
    templateUrl: 'client/components/headmasterRole/showResponsibilities/showResp/showresp.html',
    controllerAs: 'showresp',
    controller: ShowrespCtrl,
    transclude: true
})
