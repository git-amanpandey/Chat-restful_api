const express = require('express');
const mongoose = require("mongoose");
const path=require("path");
const app =express();
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require('./ExpressError.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().then(result=>console.log("Connected with database")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');
};

//Async wrap fn for async error handling
function asyncWrap(fn) {
  return function(req,res,next) {
    fn(req,res,next).catch(err=>{next(err)});
  }
};

app.get("/", (req,res)=>{

  Chat.find().then((result) => {
    res.render("allChats.ejs",{result});
  }).catch((err) => {
    console.log(err);
  });

});

//New route
app.get("/chat/new", (req,res)=>{
    res.render("new.ejs");
});

//Create route(post route)
app.post("/chats", asyncWrap(async(req,res)=>{
    let {from,to,msg} = req.body;
    let newChat = new Chat({
      from:from,
      to:to,
      msg:msg,
      createdAt: new Date()
    });
    await newChat.save();
    res.redirect("/");
}));

app.get("/chats/:id/edit", asyncWrap(async (req,res,next)=>{
  let {id} = req.params;
  let chat =await Chat.findById(id);
  if(!chat){
    next(new ExpressError(401,"not found chat"));
  }
  res.render("edit.ejs",{chat});
}));

//Update route
app.put("/chats/:id", asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let {msg:newMsg} = req.body;
  await Chat.findByIdAndUpdate(id,{msg:newMsg}, {runValidators:true , new:true});
  res.redirect("/");
}));

//Delete Route
app.delete("/chats/:id", asyncWrap(async(req,res)=>{
  let {id} = req.params;
  // console.log(id);
  let value =await Chat.findByIdAndDelete(id);
  console.log(value);
  res.redirect("/");
}));

//Error Handling Middleware
app.use((err,req,res,next)=>{
  let{status=500,message='Something Broke'} = err;
  res.send(message);
});

app.use((req,res,next)=>{
  res.status(404).send("Page Not Found!");
});
// Server is started
app.listen(8080,()=>{
    console.log("Server started at port 8080");
});