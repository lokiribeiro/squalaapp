import {app} from '/client/app.js'

app.component('partyMap', {

    templateUrl: 'client/components/partyMap/partyMap.html',

    bindings: {location: '='},

    controller: class {

        constructor($scope){
            'ngInject';

            this.map = {};
            this.marker = {};

            if (!$scope.$ctrl.location){
                console.log('No party location. Default map center');
                this.map.center = {latitude:45, longitude:-73};
            }else{
                this.map.center = $scope.$ctrl.location;
            }

            this.map.zoom = 8;
            this.map.events = {
                click: function (mapModel, eventName, eventData) {
                    var lat = eventData[0].latLng.lat();
                    var lng = eventData[0].latLng.lng();
                    $scope.$ctrl.location = {latitude:lat, longitude:lng};
                    $scope.$apply();
                }
            }

            this.marker.options = {draggable: true};
            this.marker.events ={
                dragend: function (marker, eventName, eventData) {

                    // todo: habria que guardar en bbdd la posicion al soltar el marker
                    // todo: se puede hacer llamando al server method: update
                    // todo: igual que cuando se guarda el valor del checkbox 'public'

                    var lat = marker.getPosition().lat();
                    var lng = marker.getPosition().lng();
                    $scope.$ctrl.location = {latitude: lat, longitude:lng};
                    $scope.$apply();

                }
            };
        };


    }
});
