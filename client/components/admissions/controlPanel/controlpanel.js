import {app} from '/client/app.js';

import Requirementdocs from '/imports/models/requirementdocs.js';


class ControlpanelCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, $rootScope, $document){
      'ngInject';

      $scope.thisUser = Meteor.userId();



      $scope.sort = 1;

      $scope.subscribe('requirementdocs');

      $scope.helpers({
          requirementdocs(){
            //var sort = 1;
            //var selector = {};
            //var modifier= {sort: {profiles_firstname: sort}};
            var selector = {};
            var requirementdocs = Requirementdocs.find(selector);
            var count = requirementdocs.count();
            console.info('profiles', requirementdocs);
            console.info('count', count);
            return requirementdocs;
          },
          totalrequirementdocs(){
            var selector = {};
            var requirementdocs = Requirementdocs.find(selector);
            var count = requirementdocs.count();
            $scope.count = count;
            return count;
          }
      })//helpers

      $scope.requirementName = '';
      for(i=0;i<$scope.count;i++){
        $scope.editMode[i] = false;
      }

      $scope.done = false;

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


      $scope.createRequirement = function(){
        $scope.done = true
        var newReq = $scope.requirementName;
        var selector = {requirementName: newReq}
        var status = Requirementdocs.insert(selector);
        if (status) {
          var toasted = 'new requirement added';
          var pinTo = $scope.getToastPosition();
          $scope.done = false;
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
       } else {
         var toasted = 'An error occured';
         var pinTo = $scope.getToastPosition();
         $scope.done = false;
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
       }
      }

      $scope.editRequirement = function(requirementdoc, index, mode){
        $scope.done = true
        console.log(index);
        var i = parseInt(index);
        console.log($scope.editMode);
        $scope.editMode[i] = !mode;

        var newReq = requirementdoc.requirementName;
        var selector={_id: requirementdoc._id};
        var modifier = {$set: {
          requirementName: requirementdoc.requirementName
        }};
        var status = Requirementdocs.update(selector, modifier);
        if (status) {
          var toasted = 'requirement updated';
          var pinTo = $scope.getToastPosition();
          $scope.done = false;
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
       } else {
         var toasted = 'An error occured';
         var pinTo = $scope.getToastPosition();
         $scope.done = false;
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

       }
     }
              /*Meteor.call('upsertRequirementdocs', detail, function(err, detail) {
          var detail = detail;
          console.log(detail);
            if (err) {
                //do something with the id : for ex create profile
                $scope.done = false;
                $scope.hide = false;
                $scope.$apply();
           } else {
             $scope.done = false;
             $scope.hide = false;
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

           }
        });*/




    }
}

app.component('controlpanel', {
    templateUrl: 'client/components/admissions/controlPanel/controlpanel.html',
    controllerAs: 'controlpanel',
    controller: ControlpanelCtrl
})
