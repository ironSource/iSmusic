(function () {
    function MusicController($scope, musicService, $q) {
        $scope.cock = "cock";

        musicService.get('stevie', 5)
            .then(function (data) {
                $scope.video = data[0];
            });
    }

    angular
        .module('music')
        .controller('musicController', ['$scope','musicService', '$q', MusicController]);

})();
