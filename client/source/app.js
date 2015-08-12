angular
    .module('iSmusic', ['ui.router', 'music', 'youtube-embed'])
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
    }).directive('ngEnter', function() {
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