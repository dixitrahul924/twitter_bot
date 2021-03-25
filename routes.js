const { query } = require("express");
var express = require("express");
var bot_router = express.Router();
var Twit = require('twit')
var config =require("./config")
const db = require("./db");
var T = new Twit(config)
// param ={ q: 'myPAT_india', count: 2, result_type: 'recent' }


function getmyTweets(param){
    console.log("-----------IN getmytweets")
    var tweetArr=[]
    T.get('search/tweets', param , function(err, data, res) {
        tweets=data.statuses
        for(var i=0;i<tweets.length;i++){
            tweetArr[i]=tweets[i].text
            console.log("Recent Tweet of ",param.q,"----",i+1,tweets[i].text)
        }
        data={user : param.q,
            tweets:tweetArr}
            db.addMyTweet(data).then((result)=>{
                console.log("Recent tweets saved in my db")
            }).catch(err => console.log( err ));
            // console.log("tweet Arr==",tweetArr)
        })
    }
    // getmyTweets({ q: 'nodejstweet', count: 10, result_type: 'recent' });
    
function addFollowerTweetsToDB(){
    console.log("-----------IN addFollowerTweetsToDB")
    // const param ={ q: 'myPAT_india', count: 10, result_type: 'recent' }
    T.get('followers/list', { screen_name: 'myPAT_india', count:10 },  function (err, data, response) {
        followers=data.users
        for(var i=0;i<followers.length;i++){
            
            // console.log(i+1,followers[i].name,"----",followers[i].screen_name)
            user={ q: followers[i].screen_name, count: 2, result_type: 'recent' }
            getRecentTweets(user)
        }
    })
    
}
// addFollowerTweetsToDB();
function getRecentTweets(param){
    console.log("-----------IN getRecentTweets")
    var tweetArr=[]
    T.get('search/tweets', param , function(err, data, res) {
        tweets=data.statuses
        for(var i=0;i<tweets.length;i++){
            tweetArr[i]=tweets[i].text
            // console.log("Recent Tweet of ",param.q,"----",i+1,tweets[i].text)
        }
        data={user : param.q,
              tweets:tweetArr}
        db.addFollowerTweet(data).then((result)=>{
            console.log("Recent tweets saved in db")
        }).catch(err => console.log( err ));
        console.log("tweet Arr==",tweetArr)
    })
}

function followers_name(){
    console.log("-----------IN followers_name")
    T.get('followers/list', { screen_name: 'myPAT_india', count:100 },  function (err, data, response) {
        const followers=data.users;
        // console.log(followers)
        var array=[]
        for(var i=0;i<followers.length;i++){
            
            // console.log(i+1,followers[i].name,"----",followers[i].screen_name)
            data={ screen_name: followers[i].screen_name }
            array.push(data)
        }
        db.addFollowers(array).then((result)=>{
            console.log("added")
        }).catch(err => console.log( err ));
    })
}
// followers_name();
function following_name(){
    console.log("-----------IN following_name")
    T.get('friends/list', { screen_name: 'myPAT_india', count:100 },  function (err, data, response) {
        const following=data.users;
        // console.log(following)
        var array=[]
        for(var i=0;i<following.length;i++){
            
            // console.log(i+1,followers[i].name,"----",followers[i].screen_name)
            data={ screen_name: following[i].screen_name }
            array.push(data)
        }
        // console.log(array)
        db.addFollowing(array).then((result)=>{
            console.log("added")
        }).catch(err => console.log( err ));
    })
}

// following_name();

function periodicTweeting(){

    var randomValue= Math.floor(Math.random()*100)
    const msg={
        status:"Hi tweeting from bot every 30 min using random value: "+randomValue+"\n#nodejs"
    }
    T.post('statuses/update', msg, function(err, data, response) {
        if(!err){
            db.addBotTweet(msg).then((result)=>{
                console.log("tweeted periodically added to db")
        
            })

            console.log("tweeted periodically")
        }
      })
}

// periodicTweeting();
// setInterval(periodicTweeting, 1000*60*30);

bot_router.get("/",(req,res)=>{res.status(200).render('index.html')})
bot_router.get("/getrecenttweets",(req,res)=>{
    // param ={ q: 'nodejstweet', count: 10, result_type: 'recent' }
    // getmyTweets(param)
    db.getMyTweets().then((result)=>{
        
        console.log("arr -=-=-=-",result)
        res.status(200).render('recent_tweets.html',{result:result})
    }).catch(err => console.log( err ));
})
bot_router.get("/follow",(req,res)=>{
    param ={ name: 'myPAT.in', screen_name: 'myPAT_india' }
    T.post('friendships/create', param, function(err, data, response) {
        console.log("SUCCESFULLY FOLLOWED  ",data.name)
    })
    res.status(200).redirect('/')
})
bot_router.get("/Unfollow",(req,res)=>{
    param ={ name: 'myPAT.in', screen_name: 'myPAT_india' }
    T.post('friendships/destroy', param, function(err, data, response) {
        console.log("SUCCESFULLY UNFOLLOWED  ",data.name)
    })
    res.status(200).redirect('/')
})


bot_router.get("/followers",(req,res)=>{
    db.getFollowers().then((result)=>{
        
        res.send(result)
    }).catch(err => console.log( err ));
})
bot_router.get("/following",(req,res)=>{
    db.getFollowing().then((result)=>{
        res.send(result)
    }).catch(err => console.log( err ));
})
bot_router.get("/followerstweets",(req,res)=>{

    db.getFollowerTweets().then((result)=>{

        // console.log("arr -=-=-=-",result)
        res.status(200).render('recent_tweets.html',{result:result})
    }).catch(err => console.log( err ));
})
bot_router.get("/bot_tweets",(req,res)=>{
    db.getBotTweets().then((result)=>{
        res.send(result)
    }).catch(err => console.log( err ));
})


module.exports={ bot_router,
                periodicTweeting,
                following_name,
                followers_name,
            addFollowerTweetsToDB,
            getmyTweets};