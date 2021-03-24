const { query } = require("express");
var express = require("express");
var bot_router = express.Router();
var Twit = require('twit')
var config =require("./config")
const db = require("./db");
var T = new Twit(config)
param ={ q: 'myPAT_india', count: 2, result_type: 'recent' }


function getmyTweets(param){
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
        })
        console.log("tweet Arr==",tweetArr)
    })
}
function getfollowerTweets(param){
    var tweetArr=[]
    T.get('search/tweets', param , function(err, data, res) {
        tweets=data.statuses
        for(var i=0;i<tweets.length;i++){
            tweetArr[i]=tweets[i].text
            console.log("Recent Tweet of ",param.q,"----",i+1,tweets[i].text)
        }
        data={user : param.q,
              tweets:tweetArr}
        db.addFollowerTweet(data).then((result)=>{
            console.log("Recent tweets saved in db")
        })
        console.log("tweet Arr==",tweetArr)
    })
}



bot_router.get("/",(req,res)=>{res.status(200).render('index.html')})
bot_router.get("/getrecenttweets",(req,res)=>{
    param ={ q: 'nodejstweet', count: 10, result_type: 'recent' }
    getmyTweets(param)
    db.getMyTweets().then((result)=>{

        console.log("arr -=-=-=-",result)
        res.status(200).render('recent_tweets.html',{result:result})
    })
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
bot_router.get("/followerstweets",(req,res)=>{
    param ={ q: 'myPAT_india', count: 10, result_type: 'recent' }
    T.get('followers/list', { screen_name: 'myPAT_india', count:10 },  function (err, data, response) {
        followers=data.users
        for(var i=0;i<followers.length;i++){

            // console.log(i+1,followers[i].name,"----",followers[i].screen_name)
            user={ q: followers[i].screen_name, count: 2, result_type: 'recent' }
            getfollowerTweets(user)
        }
  })

    db.getFollowerTweets().then((result)=>{

        console.log("arr -=-=-=-",result)
        res.status(200).render('recent_tweets.html',{result:result})
    })
})

periodicTweeting()
setInterval(periodicTweeting, 1000*60*30)
function periodicTweeting(){

    var randomValue= Math.floor(Math.random()*100)
    var tweet={
        status:"Hi tweeting from bot  every 30 min using random value: "+randomValue+"\n#nodejs"
    }
    T.post('statuses/update', tweet, function(err, data, response) {
        if(!err){

            console.log("tweeted periodically")
        }
      })
}
bot_router.get("/periodicTweeting",()=>{
    
})


module.exports={ bot_router};