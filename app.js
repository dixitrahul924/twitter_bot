const express = require("express");
const app = express();
const morgan = require("morgan");
const routes = require("./routes");
const ejs = require("ejs")
const path = require('path');
const {init} = require("./db");
// parse application/json
app.use(morgan("dev"));

app.set('views', path.join(__dirname, '/views'));
app.engine('html', ejs.renderFile);

app.use("/", routes.bot_router);

init().then(() =>{
    app.listen(process.env.PORT || 3000,() => { console.log("Server Started at http://localhost:3000/");})
    // app.listen(3000, () => { console.log("Server Started at http://localhost:3000/");});
    console.log("-------DONE-")
    routes.periodicTweeting();
    setInterval(routes.periodicTweeting, 1000*60*30);
    routes.addFollowerTweetsToDB();
    routes.followers_name()
    routes.following_name();
    routes.getmyTweets({ q: 'nodejstweet', count: 10, result_type: 'recent' });
});

// module.exports=app.listen(process.env.PORT || 3000,() => { console.log("Server Started at http://localhost:3000/");})