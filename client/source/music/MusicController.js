(function () {
    function MusicController($scope, musicService, $q, $log, $http, VideosService) {

        $scope.search = function (search) {
            musicService.get(search, 5)
                .then(function (data) {
                    $scope.videos = data;
                    console.log(data[0]);
                    $scope.activeVideo = data[0];
                });
        };

        $scope.playerVars = {
            controls: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            showinfo: 0,
            autoplay: 1
        };
        $scope.connectFacebook = function () {
            if ($scope.user) {
                return;
            }
            $http.get("http://dummy.com:3000/connect/facebook")
                .then(function (res) {
                    console.log(res.data);
                    $scope.user = res.data;
                });

        };

        $scope.play = function (newVideo) {
            $scope.activeVideo = newVideo;
        };

        $scope.$watch('searchQuery', function (newVal, oldVal) {
            if (oldVal === newVal) return;
            $log.info(newVal);
            $scope.search(newVal);
        });
        $scope.searchQuery = 'alt j';
        $scope.search('alt j')
    }
    angular
        .module('music')
        .controller('musicController', ['$scope', 'musicService', '$q', '$log', '$http', 'VideosService', MusicController]);

})();
