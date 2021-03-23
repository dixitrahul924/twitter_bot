var express = require("express");
var bot_router = express.Router();
var Twit = require('twit')
var config =require("./config")
// const db = require("./db");

bot_router.get("/",(req,res)=>{res.status(200).send('hello there')})
module.exports={ bot_router};