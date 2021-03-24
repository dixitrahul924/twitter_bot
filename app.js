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
    app.listen(3000, () => { console.log("Server Started at http://localhost:3000/");});
    console.log("-------DONE-")
});

// module.exports=app.listen(3000, () => { console.log("Server Started at http://localhost:3000/");});