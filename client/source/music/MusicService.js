(function () {
    'use strict';
    angular.module('music')
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
                                videoEmbeddable: true,
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
                        .then(function (results){
                            d.resolve(results);
                        });
                    return d.promise;
                }
            };
        }]);
})();
