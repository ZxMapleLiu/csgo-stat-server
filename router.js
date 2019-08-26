var express = require('express');
var dbcfg = require('./models/sql.js');
var md5 = require('md5');
var router = express.Router()
var passport = require('passport');

router.get('/', function (req, res) {
    res.end('server is running.')
})

router.post('/login', function (req, res, next) {
    var body = req.body
    body.password = md5(md5(body.password))
    var sql = 'SELECT * FROM user_auth WHERE username=\'' + body.username + '\' AND password=\'' + body.password + '\''
    dbcfg.query(sql, function (err, result) {
        if (err) {
            console.log('query error!' + err.message)
            return next(err)
        }
        if (result.length == 0) {
            console.log(result)
            return res.status(200).json({
                err_code: 1,
                message: 'Username or password is invalid.'
            })
        }
        else if (result.length !== 0) {
            // console.log(result[0].steam_id)
            req.session.username = body.username
            req.session.steamid = result[0].steam_id
            console.log('user login')

            return res.status(200).json({
                err_code: 0,
                message: 'Login success!',
                username: body.username,
                steamid: result[0].steam_id
            })
        }
    })
})
router.post('/register', function (req, res, next) {
    var body = req.body
    var querysql = 'SELECT * FROM user_auth WHERE username=\'' + body.username + '\' AND email=\'' + body.email + '\''
    dbcfg.query(querysql, function (err, result) {
        if (err) {
            return next(err)
        }
        if (result.length !== 0) {
            return res.status(200).json({
                err_code: 1,
                message: 'username or email already exists.'
            })
        }

        body.password = md5(md5(body.password))

        var registersql = 'INSERT INTO user_auth (email,username,password) values (\'' + body.email + '\',\'' + body.username + '\',\'' + body.password + '\')'

        dbcfg.query(registersql, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log(result)
            if (result.affectedRows == 1) {
                return res.status(200).json({
                    err_code: 0,
                    message: 'OK'
                })
            }
            return res.status(200).json({
                err_code: 1,
                message: 'Register failed!'
            })

        })

    })
})

router.get('/logout', function (req, res) {
    req.session.destroy()
    console.log("user logout")
    return res.status(200).json({
        message: 'Logout success!',
        err_code: 0
    })
})

//绑定STEAM账号
router.get('/loginwithsteam', passport.authenticate('steam', { failureRedirect: '/' }), function (req, res) {
    var username = req.session.username
    console.log(req.session)
    res.redirect('/')
})
router.get('/loginwithsteam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/');
    });


router.get('/search', function (req, res) {
    var body = req.body
})


router.post('/updatematches', function (req, res, next) {
    var body = req.body;
    //console.log(body);
    var dataArray = body;
    dataArray.forEach(match => {
        //在数据库内查询比赛是否存在
        match.startTime = match.startTime.substr(0, 19)
        var querysql = 'SELECT * FROM match_id WHERE time = \''
            + match.startTime + '\' AND player1_id = \'' + match.tap1index.playerid + '\''
        let existsFlag = false;
        dbcfg.query(querysql, function (err, result) {
            //console.log(match);
            //console.log(result);
            if (result.length !== 0) existsFlag = true;
            else {
                let insertIDArray = []
                var addsql = 'INSERT INTO player_record_id values (?,?,?,?,?,?,?,?,0)'
                var addsqlParams = [match.tap1index.playerid, match.tap1index.kill, match.tap1index.death, match.tap1index.assist, match.tap1index.mvp_round, match.tap1index.hs_rate, match.tap1index.score, match.tap1index.latency];
                dbcfg.query(addsql, addsqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    //console.log("player 1 added!")
                    //addToTotal(match.tap1index.playerid, match.tap1index.kill, match.tap1index.death, match.tap1index.assist, match.tap1index.mvp_round, match.tap1index.score);
                    //console.log(result.insertId)
                    insertIDArray[0] = result.insertId;
                })
                addsqlParams = [match.tap2index.playerid, match.tap2index.kill, match.tap2index.death, match.tap2index.assist, match.tap2index.mvp_round, match.tap2index.hs_rate, match.tap2index.score, match.tap2index.latency];
                dbcfg.query(addsql, addsqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    //console.log("player 2 added!")
                    //addToTotal(match.tap2index.playerid, match.tap2index.kill, match.tap2index.death, match.tap2index.assist, match.tap2index.mvp_round, match.tap2index.score)
                    insertIDArray[1] = result.insertId;
                })
                addsqlParams = [match.tap3index.playerid, match.tap3index.kill, match.tap3index.death, match.tap3index.assist, match.tap3index.mvp_round, match.tap3index.hs_rate, match.tap3index.score, match.tap3index.latency];
                dbcfg.query(addsql, addsqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    //console.log("player 3 added!")
                    //addToTotal(match.tap3index.playerid, match.tap3index.kill, match.tap3index.death, match.tap3index.assist, match.tap3index.mvp_round, match.tap3index.score)
                    insertIDArray[2] = result.insertId;
                })
                addsqlParams = [match.tap4index.playerid, match.tap4index.kill, match.tap4index.death, match.tap4index.assist, match.tap4index.mvp_round, match.tap4index.hs_rate, match.tap4index.score, match.tap4index.latency];
                dbcfg.query(addsql, addsqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    //console.log("player 4 added!")
                    //addToTotal(match.tap4index.playerid, match.tap4index.kill, match.tap4index.death, match.tap4index.assist, match.tap4index.mvp_round, match.tap4index.score)
                    insertIDArray[3] = result.insertId;
                })
                addsqlParams = [match.tap5index.playerid, match.tap5index.kill, match.tap5index.death, match.tap5index.assist, match.tap5index.mvp_round, match.tap5index.hs_rate, match.tap5index.score, match.tap5index.latency];
                dbcfg.query(addsql, addsqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    //console.log("player 5 added!")
                    //addToTotal(match.tap5index.playerid, match.tap5index.kill, match.tap5index.death, match.tap5index.assist, match.tap5index.mvp_round, match.tap5index.score)
                    insertIDArray[4] = result.insertId;
                })
                addsqlParams = [match.tbp1index.playerid, match.tbp1index.kill, match.tbp1index.death, match.tbp1index.assist, match.tbp1index.mvp_round, match.tbp1index.hs_rate, match.tbp1index.score, match.tbp1index.latency];
                dbcfg.query(addsql, addsqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    //console.log("player 6 added!")
                    //addToTotal(match.tbp1index.playerid, match.tbp1index.kill, match.tbp1index.death, match.tbp1index.assist, match.tbp1index.mvp_round, match.tbp1index.score)
                    insertIDArray[5] = result.insertId;
                })
                addsqlParams = [match.tbp2index.playerid, match.tbp2index.kill, match.tbp2index.death, match.tbp2index.assist, match.tbp2index.mvp_round, match.tbp2index.hs_rate, match.tbp2index.score, match.tbp2index.latency];
                dbcfg.query(addsql, addsqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    //console.log("player 7 added!")
                    //addToTotal(match.tbp2index.playerid, match.tbp2index.kill, match.tbp2index.death, match.tbp2index.assist, match.tbp2index.mvp_round, match.tbp2index.score)
                    insertIDArray[6] = result.insertId;
                })
                addsqlParams = [match.tbp3index.playerid, match.tbp3index.kill, match.tbp3index.death, match.tbp3index.assist, match.tbp3index.mvp_round, match.tbp3index.hs_rate, match.tbp3index.score, match.tbp3index.latency];
                dbcfg.query(addsql, addsqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    //console.log("player 8 added!")
                    //addToTotal(match.tbp3index.playerid, match.tbp3index.kill, match.tbp3index.death, match.tbp3index.assist, match.tbp3index.mvp_round, match.tbp3index.score)
                    insertIDArray[7] = result.insertId;
                })
                addsqlParams = [match.tbp4index.playerid, match.tbp4index.kill, match.tbp4index.death, match.tbp4index.assist, match.tbp4index.mvp_round, match.tbp4index.hs_rate, match.tbp4index.score, match.tbp4index.latency];
                dbcfg.query(addsql, addsqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    //console.log("player 9 added!")
                    //addToTotal(match.tbp4index.playerid, match.tbp4index.kill, match.tbp4index.death, match.tbp4index.assist, match.tbp4index.mvp_round, match.tbp4index.score)
                    insertIDArray[8] = result.insertId;
                })
                addsqlParams = [match.tbp5index.playerid, match.tbp5index.kill, match.tbp5index.death, match.tbp5index.assist, match.tbp5index.mvp_round, match.tbp5index.hs_rate, match.tbp5index.score, match.tbp5index.latency];
                dbcfg.query(addsql, addsqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    // console.log("player 10 added!")
                    //addToTotal(match.tbp5index.playerid, match.tbp5index.kill, match.tbp5index.death, match.tbp5index.assist, match.tbp5index.mvp_round, match.tbp5index.score)
                    insertIDArray[9] = result.insertId;
                    let matchinfo_id;
                    addsql = "INSERT INTO matchinfo_id (team_a_score,team_b_score,team_a_player1_info_id,team_a_player2_info_id,team_a_player3_info_id,team_a_player4_info_id,team_a_player5_info_id,team_b_player1_info_id,team_b_player2_info_id,team_b_player3_info_id,team_b_player4_info_id,team_b_player5_info_id) values (?,?,?,?,?,?,?,?,?,?,?,?)"
                    // console.log(insertIDArray);
                    addsqlParams = [match.teamAScore, match.teamBScore, insertIDArray[0], insertIDArray[1], insertIDArray[2], insertIDArray[3], insertIDArray[4], insertIDArray[5], insertIDArray[6], insertIDArray[7], insertIDArray[8], insertIDArray[9]]
                    dbcfg.query(addsql, addsqlParams, function (err, result) {
                        if (err) {
                            console.log('[INSERT ERROR] - ', err.message);
                            return;
                        }
                        //console.log("matchinfo added!")
                        matchinfo_id = result.insertId
                        addsql = "INSERT INTO match_id values (0,?,?,?,?,?,?)"
                        let matchtime = (Math.floor(match.matchTime / 60)).toString() + ':' + (match.matchTime % 60).toString();
                        let waitTime = (Math.floor(match.waitTime / 60)).toString() + ':' + (match.waitTime % 60).toString();
                        addsqlParams = [match.startTime, matchinfo_id, match.map, matchtime, match.tap1index.playerid, waitTime,];
                        dbcfg.query(addsql, addsqlParams, function (err, result) {
                            //console.log("match_id added!")
                            if (err) {
                                console.log('[INSERT ERROR] - ', err.message);
                                return;
                            }
                            //console.log(result);

                        })
                        //waitTime和matchTime是以秒作单位的，需要转换为TIME格式
                    })
                })
                //2.创建matchinfo

                //3.创建match_id

            }
        })
        //存在->continue
        //不存在->添加
        //1.添加玩家信息

    });



    res.status(200).json({
        data: "received!"
    });
    //
})
module.exports = router

router.get('/profile', function (req, res) {
    var steam64id;
    var siteId = req.query.ID;
    global.matchHistoryArray = [];
    var totalStats;
    var matchtr = {};
    if (siteId.length == 17 && !Number.isNaN(parseInt(siteId))) {
        new Promise(resolve => {
            let queryAllPlayerRecordSql = 'SELECT sum(kills),sum(death),sum(assist),sum(mvp_round),sum(score),count(kills) FROM player_record_id WHERE player_id = ?'
            let queryAllPlayerRecordSqlParams = siteId;
            dbcfg.query(queryAllPlayerRecordSql, queryAllPlayerRecordSqlParams, function (err, result) {
                resolve(result[0]);
            })
        }).then(statsArray => {
            totalStats = {
                steamid: siteId,
                totalKill: statsArray['sum(kills)'],
                totalDeath: statsArray['sum(death)'],
                totalAssists: statsArray['sum(assist)'],
                totalMvpRound: statsArray['sum(mvp_round)'],
                totalScores: statsArray['sum(score)'],
                totalMaps: statsArray['count(kills)']
            };
            return new Promise(resolve => {
                let queryPlayerRecordIdSql = 'SELECT player_record_id FROM player_record_id WHERE player_id = ?'
                dbcfg.query(queryPlayerRecordIdSql, siteId, function (err, result) {
                    resolve(result)
                })
            }).then(result => {
                let promise = [];
                result.forEach((element) => {
                    var p = new Promise(resolve => {
                            var player_record_id = element.player_record_id;
                            let queryMatchInfoIdSql = 'SELECT matchinfo_id,team_a_score,team_b_score FROM matchinfo_id WHERE (team_a_player1_info_id = ? or team_a_player2_info_id = ? or team_a_player3_info_id = ? or team_a_player4_info_id = ? or team_a_player5_info_id = ? or team_b_player1_info_id = ? or team_b_player2_info_id = ? or team_b_player3_info_id = ? or team_b_player4_info_id = ? or team_b_player5_info_id = ?)'
                            let queryMatchInfoIdSqlParams = [player_record_id, player_record_id,
                                player_record_id, player_record_id,
                                player_record_id, player_record_id,
                                player_record_id, player_record_id,
                                player_record_id, player_record_id];
                            dbcfg.query(queryMatchInfoIdSql, queryMatchInfoIdSqlParams, function (err, result) {
                                resolve(result);
                            })
                        }).then(result => {
                            return new Promise(resolve => {
                                let match_info = result[0];
                                let matchinfo_id = match_info['matchinfo_id'];
                                let queryMatchIdSql = 'SELECT * FROM match_id WHERE matchinfo_id = ?'
                                dbcfg.query(queryMatchIdSql, matchinfo_id, function (err, result) {
                                    resolve(result)
                                })
                            }).then(result => {
                                let matchId = result[0];
                                matchtr.time = matchId.time;
                                matchtr.map = matchId.map;
                                matchtr.matchid = matchId.matchid;
                                matchHistoryArray.push({time:matchtr.time,map:matchtr.map,matchid:matchtr.matchid})
                            })
                    }
                )
                promise.push(p)
                })
                Promise.all(promise).then(()=>{
                    console.log(matchHistoryArray)
                    console.log(totalStats)
                    res.status(200).json({
                        err_code: 0,
                        matchHistoryArray: global.matchHistoryArray,
                        totalStats: totalStats,
                        steam64id: steam64id
                    })
                })
            })
        })
    }
    else {
        let querySql = 'SELECT steam_id FROM user_auth WHERE username = ?'
        let queryParams = siteId
        dbcfg.query(querySql, queryParams, function (err, result) {
            if (result.length == 0) {
                res.status(200).json({
                    err_code: 1,
                    msg: '您的账号没有绑定steamID!'
                })
            }
        })
    }
    if (matchHistoryArray == null) {
        res.status(200).json({
            err_code: 2,
            msg: '该账号未记载任何数据。'
        })
    }
})

router.get('/match',function(req,res){
   var matchid =  req.query.matchid;
   var match_id = {}
   var matchInfoId = {}
   var playerRecord = {}
   var queryMatchIdSql = 'SELECT matchinfo_id, map, time_last,waitTime,time FROM match_id WHERE matchid = ?'
   dbcfg.query(queryMatchIdSql,matchid,function(err,result){
       if(err){
           console.log(err)
       }
       else{
            if(result.length == 0)
            {
                res.status(200).json({
                    err_code:1,
                    msg:"match_id not exists!"
                })
            }
            else{
            match_id.time = result[0].time;
            match_id.map = result[0].map;
            match_id.time_last = result[0].time_last;
            match_id.waitTime = result[0].waitTime;
            console.log(match_id)
            var matchinfo_id = result[0].matchinfo_id
            var queryMatchinfoIdSql = "SELECT * FROM matchinfo_id WHERE matchinfo_id = \'"+matchinfo_id+"\'"
            dbcfg.query(queryMatchinfoIdSql,function(err,result){
                if(err){
                    console.log(err)
                }
                else{
                    var resultBody = result[0];
                    matchInfoId.team_a_score = resultBody['team_a_score'];
                    matchInfoId.team_b_score = resultBody['team_b_score'];
                    matchInfoId.team_a_player1_info_id= resultBody['team_a_player1_info_id'];
                    matchInfoId.team_a_player2_info_id= resultBody['team_a_player2_info_id'];
                    matchInfoId.team_a_player3_info_id= resultBody['team_a_player3_info_id']
                    matchInfoId.team_a_player4_info_id= resultBody['team_a_player4_info_id']
                    matchInfoId.team_a_player5_info_id= resultBody['team_a_player5_info_id']
                    matchInfoId.team_b_player5_info_id= resultBody['team_b_player5_info_id']
                    matchInfoId.team_b_player4_info_id= resultBody['team_b_player4_info_id']
                    matchInfoId.team_b_player3_info_id= resultBody['team_b_player3_info_id']
                    matchInfoId.team_b_player2_info_id= resultBody['team_b_player2_info_id']
                    matchInfoId.team_b_player1_info_id= resultBody['team_b_player1_info_id']
                    var queryPlayerInfoIdSql = "SELECT * FROM player_record_id WHERE player_record_id = \'"+matchInfoId.team_a_player1_info_id+"\'"
                    dbcfg.query(queryPlayerInfoIdSql,function(err,result){
                        if(err){
                            console.log(err)
                        }
                        playerRecord.player1 = result[0]
                    })
                    queryPlayerInfoIdSql = "SELECT * FROM player_record_id WHERE player_record_id = \'"+matchInfoId.team_a_player2_info_id+"\'"
                    dbcfg.query(queryPlayerInfoIdSql, function(err,result){
                        if(err){
                            console.log(err)
                        }
                        playerRecord.player2 = result[0]
                    })
                    queryPlayerInfoIdSql = "SELECT * FROM player_record_id WHERE player_record_id = \'"+matchInfoId.team_a_player3_info_id+"\'"
                    dbcfg.query(queryPlayerInfoIdSql,function(err,result){
                        if(err){
                            console.log(err)
                        }
                        playerRecord.player3 = result[0]
                    })
                    queryPlayerInfoIdSql = "SELECT * FROM player_record_id WHERE player_record_id = \'"+matchInfoId.team_a_player4_info_id+"\'"
                    dbcfg.query(queryPlayerInfoIdSql,function(err,result){
                        if(err){
                            console.log(err)
                        }
                        playerRecord.player4 = result[0]
                    })
                    queryPlayerInfoIdSql = "SELECT * FROM player_record_id WHERE player_record_id = \'"+matchInfoId.team_a_player5_info_id+"\'"
                    dbcfg.query(queryPlayerInfoIdSql,function(err,result){
                        if(err){
                            console.log(err)
                        }
                        playerRecord.player5 = result[0]
                    })
                    dbcfg.query(queryPlayerInfoIdSql, matchInfoId.team_b_player1_info_id,function(err,result){
                        if(err){
                            console.log(err)
                        }
                        playerRecord.player6 = result[0]
                    })
                    dbcfg.query(queryPlayerInfoIdSql, matchInfoId.team_b_player2_info_id,function(err,result){
                        if(err){
                            console.log(err)
                        }
                        playerRecord.player7 = result[0]
                    })
                    dbcfg.query(queryPlayerInfoIdSql, matchInfoId.team_b_player3_info_id,function(err,result){
                        if(err){
                            console.log(err)
                        }
                        playerRecord.player8 = result[0]
                    })
                    dbcfg.query(queryPlayerInfoIdSql, matchInfoId.team_b_player4_info_id,function(err,result){
                        if(err){
                            console.log(err)
                        }
                        playerRecord.player9 = result[0]
                    })
                    dbcfg.query(queryPlayerInfoIdSql, matchInfoId.team_b_player5_info_id,function(err,result){
                        if(err){
                            console.log(err)
                        }
                        playerRecord.player10 = result[0]
                        console.log(match_id)
                        res.status(200).json({
                            err_code:0,
                            playerRecord:playerRecord,
                            matchInfoId:matchInfoId,
                            match_id:match_id
                        })
                    })
                    
                }
            })
            }
       }
   })
})