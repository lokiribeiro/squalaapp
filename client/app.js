//todo: poner todos los componentes en el directorio /client/imports => lazy load
//todo: implementar las funciones de rootScope como una factoria

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import 'angular-simple-logger';
import ngMaterial from 'angular-material';
import ngAnimate from 'angular-animate';
import mdExpansionPanel from 'angular-material-expansion-panel';
import mdDataTable from 'angular-material-data-table';
import '../imports/ui/loading.js';
import Navigations from '/imports/models/navigations.js';
import '../imports/ui/anim-in-out.js';

export var app = angular.module('squala',
    [angularMeteor, ngMaterial, uiRouter, 'accounts.ui', utilsPagination, ngAnimate, 'material.components.expansionPanels', mdDataTable, 'anim-in-out']);

app.config(function ($locationProvider, $urlRouterProvider, $stateProvider, $mdThemingProvider, $mdIconProvider, $provide) {
    'ngInject';

    $locationProvider.html5Mode(true);

    $stateProvider
    .state(
        'login', {
            url:'/',
            template: '<login></login>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                      return $q.resolve();
                    } else {
                      return $q.reject('LOGGED_IN');
                    };
                }
              }
    })
    .state(
        'signin', {
            url:'/signin',
            template: '<login></login>',
            resolve: {
                currentUser($q, $state) {
                    if (Meteor.userId()) {
                        return $q.reject('LOGGED_IN');
                    } else {
                        return $q.resolve();
                    }
                }
              }
    })
    .state(
        'register', {
            url:'/register',
            template: '<register></register>'
    })
    .state(
        'not-found', {
            url: '/not-found',
            template: '<notfound></notfound>'
    })
    .state('logout', {
		        url: '/logout',
            template: '<login></login>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                      return $q.reject('LOGGED_IN');
                    } else {
                      return $q.resolve();
                    };
                }
              }
	 })
    .state('Dashboard', {
          url:'/:stateHolder/DSHb/:userID',
          template: '<dashboard></dashboard>',
          resolve: {
              currentUser($q, $state) {
                  if (!Meteor.userId()) {
                      return $q.reject('AUTH_REQUIRED');
                  } else {
                    return $q.resolve();
                  };
              }
          },
          onEnter: function($rootScope, $stateParams, $state) {
              $rootScope.stateHolder = $stateParams.stateHolder;
          }
      })
      .state('Profile', {
            url:'/:stateHolder/PRFl/:userID',
            template: '<profile></profile>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                        return $q.reject('AUTH_REQUIRED');
                    } else {
                        return $q.resolve();
                    };
                }
            },
            onEnter: function($rootScope, $stateParams, $state) {
                $rootScope.stateHolder = $stateParams.stateHolder;
            }
        })
        .state('Headmasteruser', {
              url:'/:stateHolder/HUSr/:userID',
              template: '<headmasteruser></headmasteruser>',
              onEnter: function($rootScope, $stateParams, $state) {
                  $rootScope.stateHolder = $stateParams.stateHolder;
              },
              resolve: {
                  currentUser($q, $state) {
                      if (!Meteor.userId()) {
                          return $q.reject('AUTH_REQUIRED');
                      } else {
                        return $q.resolve();
                      };
                  }
              }
          })
        .state('Headmasterprofile', {
                url:'/:stateHolder/HPFl/:userID/:profileID',
                template: '<headmasterprofile></headmasterprofile>',
                onEnter: function($rootScope, $stateParams, $state) {
                    $rootScope.stateHolder = $stateParams.stateHolder;
                    $rootScope.profileID = $stateParams.profileID;
                },
                resolve: {
                    currentUser($q, $state) {
                        if (!Meteor.userId()) {
                            return $q.reject('AUTH_REQUIRED');
                        } else {
                          return $q.resolve();
                        };
                    }
                }
          })
          .state('Headmasterschool', {
                  url:'/:stateHolder/HSCb/:userID/:branchID',
                  template: '<headmasterschool></headmasterschool>',
                  onEnter: function($rootScope, $stateParams, $state) {
                      $rootScope.stateHolder = $stateParams.stateHolder;
                      $rootScope.branchID = $stateParams.branchID;
                  },
                  resolve: {
                      currentUser($q, $state) {
                          if (!Meteor.userId()) {
                              return $q.reject('AUTH_REQUIRED');
                          } else {
                            return $q.resolve();
                          };
                      }
                  }
          })
          .state('Headmasterrole', {
                  url:'/:stateHolder/HRle/:userID/',
                  template: '<headmasterrole></headmasterrole>',
                  onEnter: function($rootScope, $stateParams, $state) {
                      $rootScope.stateHolder = $stateParams.stateHolder;
                  },
                  resolve: {
                      currentUser($q, $state) {
                          if (!Meteor.userId()) {
                              return $q.reject('AUTH_REQUIRED');
                          } else {
                            return $q.resolve();
                          };
                      }
                  }
          })
          .state('Headmasterresp', {
                  url:'/:stateHolder/HRSp/:userID/',
                  template: '<headmasterresponsibilities></headmasterresponsibilities>',
                  onEnter: function($rootScope, $stateParams, $state) {
                      $rootScope.stateHolder = $stateParams.stateHolder;
                  },
                  resolve: {
                      currentUser($q, $state) {
                          if (!Meteor.userId()) {
                              return $q.reject('AUTH_REQUIRED');
                          } else {
                            return $q.resolve();
                          };
                      }
                  }
          })
          .state('Headmaster', {
                url:'/:stateHolder/HDMr/:userID',
                template: '<headmaster></headmaster>',
                resolve: {
                    currentUser($q, $state) {
                        if (!Meteor.userId()) {
                            return $q.reject('AUTH_REQUIRED');
                        } else {
                            return $q.resolve();
                        }
                    }
                },
                onEnter: function($rootScope, $stateParams, $state) {
                    $rootScope.stateHolder = $stateParams.stateHolder;
                }
            })
            .state('ControlPanel', {
                  url:'/:stateHolder/CPNl/:userID',
                  template: '<controlpanel></controlpanel>',
                  resolve: {
                      currentUser($q, $state) {
                          if (!Meteor.userId()) {
                              return $q.reject('AUTH_REQUIRED');
                          } else {
                              return $q.resolve();
                          }
                      }
                  },
                  onEnter: function($rootScope, $stateParams, $state) {
                      $rootScope.stateHolder = $stateParams.stateHolder;
                  }
              })
            .state('Admissions', {
                  url:'/:stateHolder/ADMs/:userID',
                  template: '<admissions></admissions>',
                  resolve: {
                      currentUser($q, $state) {
                          if (!Meteor.userId()) {
                              return $q.reject('AUTH_REQUIRED');
                          } else {
                              return $q.resolve();
                          }
                      }
                  },
                  onEnter: function($rootScope, $stateParams, $state) {
                      $rootScope.stateHolder = $stateParams.stateHolder;
                  }
              })
            .state('Assessment', {
                  url:'/:stateHolder/ASMt/:userID',
                  template: '<assessment></assessment>',
                  resolve: {
                      currentUser($q, $state) {
                          if (!Meteor.userId()) {
                              return $q.reject('AUTH_REQUIRED');
                          } else {
                              return $q.resolve();
                          }
                      }
                  },
                  onEnter: function($rootScope, $stateParams, $state) {
                      $rootScope.stateHolder = $stateParams.stateHolder;
                  }
              })
              .state('Classroom', {
                    url:'/:stateHolder/CLAs/:userID',
                    template: '<classroom></classroom>',
                    resolve: {
                        currentUser($q, $state) {
                            if (!Meteor.userId()) {
                                return $q.reject('AUTH_REQUIRED');
                            } else {
                                return $q.resolve();
                            }
                        }
                    },
                    onEnter: function($rootScope, $stateParams, $state) {
                        $rootScope.stateHolder = $stateParams.stateHolder;
                    }
                })
                .state('Collect', {
                      url:'/:stateHolder/FEEs/:userID',
                      template: '<collect></collect>',
                      resolve: {
                          currentUser($q, $state) {
                              if (!Meteor.userId()) {
                                  return $q.reject('AUTH_REQUIRED');
                              } else {
                                  return $q.resolve();
                              }
                          }
                      },
                      onEnter: function($rootScope, $stateParams, $state) {
                          $rootScope.stateHolder = $stateParams.stateHolder;
                      }
                  })
                  .state('Rapido', {
                        url:'/:stateHolder/ATTc/:userID',
                        template: '<rapido></rapido>',
                        resolve: {
                            currentUser($q, $state) {
                                if (!Meteor.userId()) {
                                    return $q.reject('AUTH_REQUIRED');
                                } else {
                                    return $q.resolve();
                                }
                            }
                        },
                        onEnter: function($rootScope, $stateParams, $state) {
                            $rootScope.stateHolder = $stateParams.stateHolder;
                        }
                    })
                    .state('Scheduler', {
                          url:'/:stateHolder/SCHd/:userID',
                          template: '<scheduler></scheduler>',
                          resolve: {
                              currentUser($q, $state) {
                                  if (!Meteor.userId()) {
                                      return $q.reject('AUTH_REQUIRED');
                                  } else {
                                      return $q.resolve();
                                  }
                              }
                          },
                          onEnter: function($rootScope, $stateParams, $state) {
                              $rootScope.stateHolder = $stateParams.stateHolder;
                          }
                      });

    $urlRouterProvider.otherwise('/not-found');



    //$mdThemingProvider.theme('default')
    //.primaryPalette('deep-purple')
    //.accentPalette('indigo');

    $mdThemingProvider.definePalette('squalaPalette', {
      '50': 'C788CE',
    '100': 'BF75C7',
    '200': 'B663BF',
    '300': 'AE51B8',
    '400': 'A046AA',
    '500': '8F3E98',
    '600': '7E3786',
    '700': '6D2F74',
    '800': '5C2862',
    '900': '4B2150',
    'A100': 'ff8a80',
    'A200': 'ff5252',
    'A400': 'ff1744',
    'A700': 'd50000',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    //disable theme generation
    //$mdThemingProvider.generateThemesOnDemand(true);

    $mdThemingProvider.theme('default')
    .primaryPalette('squalaPalette')
    .accentPalette('deep-purple');

    $mdThemingProvider.theme('Headmaster')
    .primaryPalette('indigo')
    .accentPalette('blue');

    $mdThemingProvider.theme('Admissions')
    .primaryPalette('amber')
    .accentPalette('orange');

    $mdThemingProvider.theme('Assessment')
    .primaryPalette('light-green')
    .accentPalette('lime');

    $mdThemingProvider.theme('Classroom')
    .primaryPalette('light-blue')
    .accentPalette('indigo');

    $mdThemingProvider.theme('Collect')
    .primaryPalette('red')
    .accentPalette('pink');

    $mdThemingProvider.theme('Rapido')
    .primaryPalette('orange')
    .accentPalette('amber');

    $mdThemingProvider.theme('Scheduler')
    .primaryPalette('yellow')
    .accentPalette('orange');

    $mdThemingProvider.theme('Dashboard')
    .primaryPalette('squalaPalette')
    .accentPalette('deep-purple');

    $mdThemingProvider.alwaysWatchTheme(true);

    $provide.value('themeProvider', $mdThemingProvider);

    const iconPath =  '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';

  $mdIconProvider
    .iconSet('social',
      iconPath + 'svg-sprite-social.svg')
    .iconSet('action',
      iconPath + 'svg-sprite-action.svg')
    .iconSet('communication',
      iconPath + 'svg-sprite-communication.svg')
    .iconSet('content',
      iconPath + 'svg-sprite-content.svg')
    .iconSet('toggle',
      iconPath + 'svg-sprite-toggle.svg')
    .iconSet('navigation',
      iconPath + 'svg-sprite-navigation.svg')
    .iconSet('image',
      iconPath + 'svg-sprite-image.svg');

});

app.run(function ($state, $rootScope, $stateParams, $mdTheming) {
    'ngInject';
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
        switch(error) {
          case "AUTH_REQUIRED":
            $state.go('login');
          break;
          case "FORBIDDEN":
            $state.go('forbidden');
          break;
          case "UNAUTHORIZED":
            $state.go('unauthorized');
          break;
          case "LOGGED_IN":
            $state.go('Dashboard');
          break;
          default:
            $state.go('not-found');
        }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    // do something
      switch(toState.name) {
        case "Assessment":
          var spinner = '<h1 style="font-weight: normal !important; color: #555 !important;">assessment</h1><br /><div class="sk-double-bounceassessment"><div class="sk-child sk-double-bouncead1"></div><div class="sk-child sk-double-bounce2"></div></div>';

          window.loading_screen = window.pleaseWait({
            logo: "/assets/img/assessment.png",
            backgroundColor: '#f1f1f1',
            loadingHtml: spinner
          });
        break;
        case "Admissions":
          var spinner = '<h1 style="font-weight: normal !important; color: #555 !important;">admissions</h1><br /><div class="sk-double-bounceadmissions"><div class="sk-child sk-double-bouncead1"></div><div class="sk-child sk-double-bounce2"></div></div>';

          window.loading_screen = window.pleaseWait({
            logo: "/assets/img/admissions.png",
            backgroundColor: '#f1f1f1',
            loadingHtml: spinner
          });
        break;
        case "Headmaster":
          var spinner = '<h1 style="font-weight: normal !important; color: #555 !important;">headmaster</h1><br /><div class="sk-double-bounceheadmaster"><div class="sk-child sk-double-bouncead1"></div><div class="sk-child sk-double-bounce2"></div></div>';

          window.loading_screen = window.pleaseWait({
            logo: "/assets/img/headmaster.png",
            backgroundColor: '#f1f1f1',
            loadingHtml: spinner
          });
        break;
        case "Classroom":
          var spinner = '<h1 style="font-weight: normal !important; color: #555 !important;">classroom</h1><br /><div class="sk-double-bounceclassroom"><div class="sk-child sk-double-bouncead1"></div><div class="sk-child sk-double-bounce2"></div></div>';

          window.loading_screen = window.pleaseWait({
            logo: "/assets/img/classroom.png",
            backgroundColor: '#f1f1f1',
            loadingHtml: spinner
          });
        break;
        case "Collect":
          var spinner = '<h1 style="font-weight: normal !important; color: #555 !important;">collect</h1><br /><div class="sk-double-bouncecollect"><div class="sk-child sk-double-bouncead1"></div><div class="sk-child sk-double-bounce2"></div></div>';

          window.loading_screen = window.pleaseWait({
            logo: "/assets/img/collect.png",
            backgroundColor: '#f1f1f1',
            loadingHtml: spinner
          });
        break;
        case "Rapido":
          var spinner = '<h1 style="font-weight: normal !important; color: #555 !important;">rapido</h1><br /><div class="sk-double-bouncerapido"><div class="sk-child sk-double-bouncead1"></div><div class="sk-child sk-double-bounce2"></div></div>';

          window.loading_screen = window.pleaseWait({
            logo: "/assets/img/rapido.png",
            backgroundColor: '#f1f1f1',
            loadingHtml: spinner
          });
        break;
        case "Scheduler":
          var spinner = '<h1 style="font-weight: normal !important; color: #555 !important;">scheduler</h1><br /><div class="sk-double-bouncescheduler"><div class="sk-child sk-double-bouncead1"></div><div class="sk-child sk-double-bounce2"></div></div>';

          window.loading_screen = window.pleaseWait({
            logo: "/assets/img/scheduler.png",
            backgroundColor: '#f1f1f1',
            loadingHtml: spinner
          });
        break;
        case "Profile":
          var spinner = '<div class="sk-double-bounce"><div class="sk-child sk-double-bouncead1"></div><div class="sk-child sk-double-bounce2"></div></div>';

          window.loading_screen = window.pleaseWait({
            logo: "/assets/img/logo2.png",
            backgroundColor: '#f1f1f1',
            loadingHtml: spinner
          });
        break;
        default:
          var spinner = '<div class="sk-double-bounce"><div class="sk-child sk-double-bouncead1"></div><div class="sk-child sk-double-bounce2"></div></div>';
      }
    });

    // handle logout event and redirect user to home page
    var _logout = Meteor.logout;
    Meteor.logout = function customLogout() {
        console.log('user loggin out');
        $state.go('login');
        _logout.apply(Meteor, arguments);
    };

    $rootScope.helpers({
        // todo: revisar este helper ya que el usuario se puede obtener
        // todo: en teoria de forma global usando Meteor.user()
        userLoggedIn(){
            console.info('user', Meteor.user());
            return Meteor.user()
        },
        userID(){
            return Meteor.userId()
        }
    });

    userID = function () {
            return Meteor.userId();
    };

    $rootScope.state = $state;

    $rootScope.isEditable = function (party) {
        if(Meteor.user() && party) {
            return Meteor.userId() === party.ownerId;
        }else{
            return false;
        }
    };

    $rootScope.userInvited = function (party) {
        var isInvited = _.findWhere( party.invitedUsers, {userId: Meteor.userId()} ) != null ;
        return isInvited;
    };

    $rootScope.setPrivacity = function (partyId, isPublic) {
        if(isPublic){
            // Making public a party implies it has no ivited users. Everybody can assist
            Parties.update({_id: partyId}, {$set: {public: isPublic, invitedUsers: []}})
        }
        if(!isPublic){
            Parties.update({_id: partyId}, {$set: {public: isPublic}})

        }
    };

});
