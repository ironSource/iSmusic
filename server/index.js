var express = require('express')
    , FB = require('fb')
    , logger = require('morgan')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , session = require('express-session')

var Grant = require('grant-express')
    , grant = new Grant(require('./config.js'))

var app = express()
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({
    name: 'grant', secret: 'very secret',
    saveUninitialized: true, resave: true
}))
app.use(grant)


app.get('/music', function (req, res) {
    FB.setAccessToken(req.session.access_token);
    FB.api('/me/music', function (data) {
        if(!data || data.error) {
            console.log(!data ? 'error occurred' : data.error);
            return res.end("Data Error!");
        }
        res.end(JSON.stringify(data));
    });

});

app.get('/handle_facebook_callback', function (req, res) {
    console.log(req.query)
    req.session.access_token = req.query.access_token;
    FB.setAccessToken(req.query.access_token);
    FB.api('/me', {fields: ['id', 'name', 'email', 'cover', 'picture', 'music', 'friends']}, function (data) {
        if(!data || data.error) {
            console.log(!data ? 'error occurred' : data.error);
            return res.end("Data Error!");
        }
        res.end(JSON.stringify(data));
    });

});

app.listen(3000, function() {
    console.log('Express server listening on port ' + 3000)
})