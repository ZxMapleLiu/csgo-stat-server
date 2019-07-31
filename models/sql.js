var md5 = require('md5')

var express = require('express');   //引入express模块
var mysql = require('mysql');     //引入mysql模块
var app = express();        //创建express的实例

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'zxmapleliu991128',
    database:'appdb'
})
mysqlConnection.connect(function(err){
    if (err) {
        console.error('error connecting: ' + err.stack)
        return
      }
      console.log('connected as id ' + mysqlConnection.threadId)
})

module.exports=mysqlConnection


//  function findUser(username,password){
//     var sql='SELECT * FROM user_auth WHERE userid=\'' +username+ '\' AND password=\''+password+'\''
//     mysqlConnection.query(sql,function (error,results){

//     })
//  }   
//  module.exports.findUser = findUser;




