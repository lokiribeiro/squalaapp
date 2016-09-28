import {app} from '/client/app.js';

import { name as Login } from '../login/login';
import { name as Register } from '../register/register';
import { name as Password } from '../password/password';

class AuthCtrl {

  constructor($scope, $state) {
    'ngInject';

    $scope.subscribe('users');

    $scope.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
        console.info('user', Meteor.user());
      },
      currentUser() {
        return Meteor.user();
      }
    });

  }

  logout() {
    Accounts.logout();
  }
}

app.component('auth', {
  templateUrl: 'client/components/auth/auth.html',
  controllerAs: 'auth',
  controller: AuthCtrl
})
