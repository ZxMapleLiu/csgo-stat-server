'use strict';
var express = require('express');
passport = require('passport');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var SteamStrategy = require('./lib/passport-steam/strategy');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var router = require('./router.js')

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:8080/api/loginwithsteam/return',
  realm: 'http://localhost:8080/',
  apiKey: '46257AD6F8FBB94C70E3B66BF1BC8164'
},
function(identifier, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {

    // To keep the example simple, the user's Steam profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the Steam account with a user record in your database,
    // and return that user instead.
    profile.identifier = identifier;
    return done(null, profile);
  });
}
));
var app = express();

app.use('/public/', express.static(path.join(__dirname, './public/')));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));

// 配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit:'10mb',extended:true }))
// parse application/json
app.use(bodyParser.json({limit:'10mb'}))
//战绩信息过多
app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'zxmapleliutest',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
  }))

app.use(cookieParser())

app.use(router)

app.listen(3000, function () {
    console.log('running...')
  })
  
//GET /login ��½
//POST /register ע��
