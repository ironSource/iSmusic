angular
  .module('iSmusic', ['ngMaterial', 'ui.router', 'users'])
  .config(function($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  })
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/users');

    $stateProvider
      .state('users', {
          url: '/users',
          templateUrl: 'users/view/users.html',
          controller: 'UserController'
      })
  })
  .config(function($mdThemingProvider, $mdIconProvider){

      $mdIconProvider
        .defaultIconSet('./assets/svg/avatars.svg', 128)
        .icon('menu'       , 'assets/svg/menu.svg'        , 24)
        .icon('share'      , 'assets/svg/share.svg'       , 24)
        .icon('google_plus', 'assets/svg/google_plus.svg' , 512)
        .icon('hangouts'   , 'assets/svg/hangouts.svg'    , 512)
        .icon('twitter'    , 'assets/svg/twitter.svg'     , 512)
        .icon('phone'      , 'assets/svg/phone.svg'       , 512);

      $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');

  });