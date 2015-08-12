(function () {
    'use strict';
    angular.module('music')
        .service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

            var service = this;

            var youtube = {
                ready: false,
                player: null,
                playerId: null,
                videoId: null,
                videoTitle: null,
                mute: false,
                shuffle: true,
                playerHeight: '200',
                playerWidth: '300',
                state: 'stopped',
                togglePlayPause: function () {
                    if (this.state == 'playing') {
                        this.player.pauseVideo()
                    } else {
                        this.player.playVideo()
                    }
                },
                nextVideo: function () {
                    playNextVideo();
                },
                previousVideo: function () {
                    service.launchPlayer(history[0].id, history[0].title);
                },
                jumpTo: function (id, title) {
                    service.launchPlayer(id, title);
                    service.archiveVideo(id, title);
                    service.deleteVideo(upcoming, id);
                },
                toggleShuffle: function () {
                    this.shuffle = !this.shuffle;
                },
                playNext: function (id, title) {
                    service.deleteVideo(upcoming, id)
                    upcoming.unshift({
                        id: id,
                        title: title
                    });
                }
            };
            var results = [];
            var upcoming = [];
            var history = [];

            $window.onYouTubeIframeAPIReady = function () {
                $log.info('Youtube API is ready');
                youtube.ready = true;
                service.bindPlayer('placeholder');
                service.loadPlayer();
                $rootScope.$apply();
            };

            function onYoutubeReady(event) {
                $log.info('YouTube Player is ready');
                // youtube.player.cueVideoById(history[0].id);
                // youtube.videoId = history[0].id;
                // youtube.videoTitle = history[0].title;
            }

            function onYoutubeStateChange(event) {
                if (event.data == YT.PlayerState.PLAYING) {
                    youtube.state = 'playing';
                } else if (event.data == YT.PlayerState.PAUSED) {
                    youtube.state = 'paused';
                } else if (event.data == YT.PlayerState.ENDED) {
                    youtube.state = 'ended';
                    playNextVideo()
                }
                $rootScope.$apply();
            }

            function playNextVideo() {
                var nextVideoIndex = !youtube.shuffle ? 0 : Math.floor(Math.random() * upcoming.length);
                service.archiveVideo(youtube.videoId, youtube.title);
                service.launchPlayer(upcoming[nextVideoIndex].id, upcoming[nextVideoIndex].title);
                service.deleteVideo(upcoming, upcoming[nextVideoIndex].id);
            }

            this.bindPlayer = function (elementId) {
                $log.info('Binding to ' + elementId);
                youtube.playerId = elementId;
            };

            this.createPlayer = function () {
                $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
                return new YT.Player(youtube.playerId, {
                    height: youtube.playerHeight,
                    width: youtube.playerWidth,
                    playerVars: {
                        rel: 0,
                        showinfo: 0
                    },
                    events: {
                        'onReady': onYoutubeReady,
                        'onStateChange': onYoutubeStateChange
                    }
                });
            };

            this.loadPlayer = function () {
                if (youtube.ready && youtube.playerId) {
                    if (youtube.player) {
                        youtube.player.destroy();
                    }
                    youtube.player = service.createPlayer();
                }
            };

            this.launchPlayer = function (id, title) {
                youtube.player.loadVideoById(id);
                youtube.videoId = id;
                youtube.videoTitle = title;
                return youtube;
            }

            this.listResults = function (data) {
                results.length = 0;
                for (var i = data.items.length - 1; i >= 0; i--) {
                    results.push({
                        id: data.items[i].id.videoId,
                        title: data.items[i].snippet.title,
                        description: data.items[i].snippet.description,
                        thumbnail: data.items[i].snippet.thumbnails.default.url,
                        author: data.items[i].snippet.channelTitle
                    });
                }
                return results;
            }

            this.queueVideo = function (id, title) {
                upcoming.push({
                    id: id,
                    title: title
                });
                return upcoming;
            };

            this.archiveVideo = function (id, title) {
                history.unshift({
                    id: id,
                    title: title
                });
                return history;
            };

            this.deleteVideo = function (list, id) {
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i].id === id) {
                        list.splice(i, 1);
                        break;
                    }
                }
            };

            this.getYoutube = function () {
                return youtube;
            };

            this.getResults = function () {
                return results;
            };

            this.getUpcoming = function () {
                return upcoming;
            };
            this.getHistory = function () {
                return history;
            };

        }])
        .service('musicService', ['$q', function ($q) {
            var _ = require('lodash'),
                request = require('request'),
                bluebird = require('bluebird'),
                youtube = require('youtube-api');

            bluebird.promisifyAll(request);
            bluebird.promisifyAll(youtube.search);

            youtube.authenticate({
                type: "key",
                key: "AIzaSyBNK-BETDq43BSwChm1ndYYovAenLAFgug"
            });

            return {
                get: function (query, maxResults) {
                    var d = $q.defer();
                    request.getAsync("http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&q=" + encodeURIComponent(query) + "&cp=1")
                        .spread(function (res, data) {
                            var result = JSON.parse(data)[1][0][0];
                            return result;
                        })
                        .then(function (suggestion) {
                            return youtube.search.listAsync({
                                part: 'snippet',
                                q: suggestion,
                                type: 'video',
                                //videoEmbeddable: 'true',
                                //videoSyndicated: 'true',
                                maxResults: maxResults || 5
                            });
                        })
                        .spread(function (list) {
                            return list.items;
                        })
                        .map(function (item) {
                            var itemResult = _.merge(_.omit(item, ['snippet', 'kind', 'etag']), _.omit(item.snippet, ['channelId', 'channelTitle', 'liveBroadcastContent']));
                            itemResult.id = itemResult.id.videoId;
                            return itemResult;
                        })
                        .then(function (results) {
                            d.resolve(results);
                        });
                    return d.promise;
                }
            };
        }]);
})();
