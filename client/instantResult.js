/**
 * Created by idoschachter on 8/12/15.
 */
var _ = require('lodash'),
    request = require('request'),
    bluebird = require('bluebird');

bluebird.promisifyAll(request);

module.exports = function (query) {
    return request.getAsync("http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&q=" + encodeURIComponent(query) + "&cp=1")
        .spread(function (res, data) {
            var result  = JSON.parse(data)[1][0][0];
            console.log(result)
        })
};

module.exports('stevie');