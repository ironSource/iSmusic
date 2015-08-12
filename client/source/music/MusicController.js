(function () {
    function MusicController($scope, musicService, $q, $log) {

        $scope.search = function () {
            musicService.get($scope.searchQuery, 5)
                .then(function (data) {
                    $scope.video = data[0];
                });
        };

        $scope.$watch('searchQuery', function (newVal, oldVal) {
            if (oldVal === newVal) return;
            $log.info(newVal);
            $scope.search(newVal);
        });
    }

    angular
        .module('music')
        .controller('musicController', ['$scope', 'musicService', '$q', '$log',MusicController]);

})();
