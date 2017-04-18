import {app} from '/client/app.js';
import Courses from '/imports/models/courses.js';

//import Users from '/imports/models/users.js';

class ClassroomcoursesCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';



      $scope.hidden = false;
      $scope.isOpen = false;
      $scope.hover = false;

      $scope.perPage = 10;
      $scope.page = 1;
      $scope.sort = -1;
      $scope.searchText = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.subscribe('courseslist', function () {
        $scope.promise = $timeout(function(){

        }, 2000);
          return [$scope.getReactively('searchText')];
      });

      $scope.helpers({
          courses() {
                $scope.promise = $timeout(function(){

                }, 2000);
                var limit = parseInt($scope.getReactively('perPage'));
                var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
                var sort  = $scope.getReactively('sort');
                var selector = {};
                var users = Courses.find(
                      selector, { limit: limit, skip: skip, sort: {createdAt: sort} }
                  );
                return users;
        },
        totalCourses(){
            return Courses.find().count();
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

      $scope.removeUser = function(courseDel) {
        console.info('userid', $scope.selected);
        if(courseDel){
          var idNow = $scope.selected[0]._id;
          Meteor.users.remove({_id: idNow});
          $scope.deletedNow = false;
          $scope.deletedNows = false;
          $scope.done = false;
          $scope.existing = false;
        }
        else{

          console.info('2', courseDel);
        }

        }

        $scope.openDelete = function ($event, selected) {
            $scope.courseDel = selected._id;
            console.info('userid', $scope.courseDel );
            var courseDel = $scope.courseDel;
            $mdDialog.show({
            clickOutsideToClose: false,
            escapeToClose: true,
            transclude: true,
            locals:{
              courseDel : $scope.courseDel
            },
            controller: function($scope, $mdDialog, courseDel){
              $scope.courseDel = courseDel;
              $scope.deletedNow = false;
              $scope.existing = false;
              $scope.done = false;

              $scope.removeuserNow = function(courseDel) {

              $scope.done = true;
              $scope.deletedNow = !$scope.deletedNow;

              Meteor.call('deleteCourse', courseDel, function(err, courseDel) {
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
            templateUrl: 'client/components/classroom/showcourses/deletecourse.html',
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
            console.info('selected:', selected._id);
            var courseID = selected._id;
            $state.go('ClassroomCoursePanel', {stateHolder : 'Classroom', userID : Meteor.userId(), courseID : courseID});
          }

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
        { name: "Add course", icon: "../../assets/img/white_subject24.svg", direction: "left" },
        { name: "Add multiple courses", icon: "../../assets/img/white_subjects24.svg", direction: "left" },
      ];


      $scope.openDialog = function($event, item) {
        // Show the dialog
        if(item.name == "Add course") {
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
            controllerAs: 'classroomcreatecourse',
            controller: ClassroomcoursesCtrl,
            template: '<classroomcreatecourse></classroomcreatecourse>',
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

app.component('classroomcourses', {
    templateUrl: 'client/components/classroom/classroomcourses/classroomcourses.html',
    controllerAs: 'classroomcourses',
    controller: ClassroomcoursesCtrl
})
