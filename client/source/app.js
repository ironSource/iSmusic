angular
    .module('iSmusic', ['ui.router', 'ngMaterial', 'music', 'youtube-embed'])
    .config(function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    })
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/music');

        $stateProvider
            .state('music', {
                url: '/music',
                templateUrl: 'music/view/music.html',
                controller: 'musicController'
            });
    })
    .config(function($mdThemingProvider, $mdIconProvider){

        $mdIconProvider
          .defaultIconSet("./assets/svg/avatars.svg", 128)
          .icon("menu"       , "./assets/svg/menu.svg"        , 24)
          .icon("share"      , "./assets/svg/share.svg"       , 24)
          .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
          .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
          .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
          .icon("phone"      , "./assets/svg/phone.svg"       , 512);

        // $mdThemingProvider.theme('default')
        //   .primaryPalette('brown')
        //   .accentPalette('red');

    })
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });