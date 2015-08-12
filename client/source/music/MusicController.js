(function () {
    function MusicController($scope, musicService, $q, $log) {

        $scope.search = function () {
            musicService.get($scope.searchQuery, 5)
                .then(function (data) {
                    $scope.videos = data;
                    console.log(data[0])
                    $scope.video = data[0];
                });
        };

        $scope.playerVars = {
		    controls: 0,
		    iv_load_policy: 3,
		    modestbranding: 1,
		    showinfo: 0,
		    autoplay: 1
		};

        $scope.$watch('searchQuery', function (newVal, oldVal) {
            if (oldVal === newVal) return;
            $log.info(newVal);
            $scope.search(newVal);
        });
    }

    angular
        .module('music')
        .controller('musicController', ['$scope', 'musicService', '$q', '$log', MusicController]);

})();
