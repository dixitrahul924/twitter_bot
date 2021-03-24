const { MongoClient, ObjectId } = require('mongodb')

const connectionUrl = 'mongodb://localhost:27017'
const dbName = 'twitterbot_db'

let db

const init = () =>
  MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then((client) => {
    db = client.db(dbName)
    console.log("Connection successful");
  })



// 
const addMyTweet = (tweet_data) => {
  const collection = db.collection('myrecenttweets')
  return collection.insertOne(tweet_data)
}

const getMyTweets = () => {
  const collection = db.collection('myrecenttweets')
  return collection.find({}).limit(1).sort({$natural:-1}).toArray()
}
const addFollowerTweet = (tweet_data) => {
    const collection = db.collection('recent_tweets')
    return collection.insertOne(tweet_data)
  }
const getFollowerTweets = () => {
    const collection = db.collection('recent_tweets')
    return collection.find({}).limit(10).toArray()
  }
const addBotTweet = (tweet_data) => {
    const collection = db.collection('bot_publishing_tweet')
    return collection.insertOne(tweet_data)
  }
const getBotTweets = () => {
    const collection = db.collection('bot_publishing_tweet')
    return collection.find({}).toArray()
  }
const addFollowers = (tweet_data) => {
    const collection = db.collection('followers')
    return collection.insertMany(tweet_data)
  }
const addFollowing = (tweet_data) => {
    const collection = db.collection('following')
    return collection.insertMany(tweet_data)
  }
const getFollowers = () => {
    const collection = db.collection('followers')
    return collection.find({}).toArray()
  }
const getFollowing = () => {
    const collection = db.collection('following')
    return collection.find({}).toArray()
  }
module.exports = {  init, 
                    addMyTweet,
                    getMyTweets,
                    addFollowerTweet,
                    getFollowerTweets,
                    addBotTweet,
                    getBotTweets,
                    addFollowers,
                    addFollowing,
                    getFollowers,
                    getFollowing
                  }