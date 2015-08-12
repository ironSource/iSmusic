"use strict";
/**
 * Created by romanl on 8/12/15.
 */


var route = require("koa-route"),
    koa = require("koa"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/");

var app = koa();
var db = mongoose.connection;

var musicSchema = mongoose.Schema({
    userName: String,
    playList: []
});


var UserPlayList = mongoose.model('UserPlayList', musicSchema);

function* homePage () {
    this.body = 'Hello World';

}

app.use(route.get('/', homePage));

//app.use(function *(){
//
//    var user = new UserPlayList({userName: 'romanl', playList:[{song: "bla", artist:"hey"}]});
//    try {
//        yield user.save();
//    } catch(e) {
//        console.log(e);
//    }
//
//    this.body = 'Hello World';
//
//
//});

app.listen(3000);
