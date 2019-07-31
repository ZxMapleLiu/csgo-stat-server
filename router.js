var express = require('express');
var dbcfg = require('./models/sql.js');
var md5 = require('md5');
var router = express.Router()
var passport = require('passport');
router.get('/',function(req,res){
    res.end('server is running.')
})

router.post('/login',function(req,res,next){
    var body = req.body
    body.password = md5(md5(body.password))
    var sql='SELECT * FROM user_auth WHERE username=\'' +body.username+ '\' AND password=\''+body.password+'\''
    dbcfg.query(sql,function(err,result){
        if(err){
            console.log('query error!'+err.message)
            return next(err)
        }
        if(result.length == 0)
        {
            console.log(result)
            return res.status(200).json({
                err_code:1,
                message:'Username or password is invalid.'
            })
        }
        else if(result.length !== 0)
        {
           // console.log(result)
            req.session.username = body.username
            console.log('user login')
            
            return res.status(200).json({
                err_code:0,
                message:'Login success!',
                username:body.username
            })
        }
    })
})
router.post('/register',function(req,res,next){
    var body=req.body
    var querysql='SELECT * FROM user_auth WHERE username=\'' +body.username+ '\' AND email=\''+body.email+'\''
    dbcfg.query(querysql,function(err,result){
        if(err){
            return next(err)
        }
        if(result.length!==0){
            return res.status(200).json({
                err_code:1,
                message:'username or email already exists.'
            })
        }

        body.password = md5(md5(body.password))
        
        var registersql = 'INSERT INTO user_auth (email,username,password) values (\''+body.email+'\',\''+body.username+'\',\''+body.password+'\')'

        dbcfg.query(registersql,function(err,result){
            console.log(result)
            if(result.affectedRows==1){
                return res.status(200).json({
                    err_code:0,
                    message:'OK'
                })
            }
            return res.status(200).json({
                err_code:1,
                message:'Register failed!'
            })
            
        })

    })
})

router.get('/logout',function(req,res){
    req.session.destroy()
    console.log("user logout")
    return res.status(200).json({
        message:'Logout success!',
        err_code:0
    })
})

router.get('/loginwithsteam',passport.authenticate('steam',{ failureRedirect: '/' }),function(req,res){
    var username =  req.session.username
    console.log(req.session)
    res.redirect('/')
})
router.get('/loginwithsteam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/search',function(req,res){
var body = req.body

})
module.exports = router