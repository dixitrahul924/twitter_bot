const { MongoClient, ObjectId } = require('mongodb')

const connectionUrl = 'mongodb://localhost:27017'
const dbName = 'twitterbot_db'

let db

const init = () =>
  MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then((client) => {
    db = client.db(dbName)
    console.log("Connection successful");
  })



// Employees
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

module.exports = {  init, 
                    addMyTweet,
                    getMyTweets,
                    addFollowerTweet,
                    getFollowerTweets
                  }