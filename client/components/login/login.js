import {app} from '/client/app.js';

import { name as Register } from '../register/register';


class LoginCtrl {

  constructor($scope, $reactive, $state){
    'ngInject';

     $('body').addClass('loginP');

    this.$state = $state;

    $reactive(this).attach($scope);

    this.credentials = {
      username: '',
      password: ''
    };

    this.error = '';

    $log = this.credentials;

    $scope.login = function($log) {
    Meteor.loginWithPassword($log.username, $log.password,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
              console.log('err: ' + err);
          } else {
            $state.go('Dashboard', { userID : Meteor.userId(), stateHolder : 'Dashboard' });
          }
        })
      );
    }

  }
}

app.component('login', {
  templateUrl: 'client/components/login/login.html',
  controllerAs: 'login',
  controller: LoginCtrl
});
