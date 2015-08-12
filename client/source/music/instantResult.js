/**
 * Created by idoschachter on 8/12/15.
 */
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

module.exports = function () {
    return {
        get: function (query, maxResults) {
            return request.getAsync("http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&q=" + encodeURIComponent(query) + "&cp=1")
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
                        videoSyndicated: true,
                        videoLicense : 'youtube',
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
                });
        }
    };
};

//module.exports('foo', 5).then(console.log)