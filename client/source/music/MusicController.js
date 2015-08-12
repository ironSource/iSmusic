(function () {
    function MusicController($scope, musicService, $q, $log, $http) {

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
        $scope.connectFacebook = function () {
            //var authWindow = window.open('about:blank', '', 'left=20,top=20,width=400,height=300,toolbar=0,resizable=1');
            $http.get("http://dummy.com:3000/connect/facebook")
                .then(function (res) {
                    //authWindow.location.replace(res.url);
                    $log.info(res.data.name);
                    $scope.user = res.data;
                });

        }
        $scope.$watch('searchQuery', function (newVal, oldVal) {
            if (oldVal === newVal) return;
            $log.info(newVal);
            $scope.search(newVal);
        });

        $scope.searchQuery = 'asdf';
    }

    angular
        .module('music')
        .controller('musicController', ['$scope', 'musicService', '$q', '$log', '$http', MusicController]);

})();
