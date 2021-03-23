const express = require("express");
const app = express();
const morgan = require("morgan");
const routes = require("./routes");

// parse application/json
app.use(morgan("dev"));

app.use("/", routes.bot_router);

// init().then(() =>{
//     // app.listen(3000, () => { console.log("Server Started at http://localhost:3000/");});
//     console.log("-------DONE-")
// });

module.exports=app.listen(3000, () => { console.log("Server Started at http://localhost:3000/");});