const http = require("http");
const { writeFile} = require("fs");
const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const User = require('./models/user')
 //imports routes from route folder
const cookiePaser = require("cookie-parser");
const userRouter = require('./routes/user');
const {
    checkForAuthenticationCookie,
  } = require("./middlewares/authentication");
  
// setting up port
const app = express();
const server = http.createServer(app);
server.listen(7000, () => console.log(`Server started at port :7000`))
const io = new Server(server);

//socket request handling
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => { 
    io.emit('chat message', `${msg}`);
  });

 

});
// for form
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
// setting mongoose
mongoose.connect('mongodb://127.0.0.1:27017/chatApp').then((e)=>console.log("mongodb connected"))
//setting views 
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use('/user',userRouter);
app.get('/', async (req,res)=>{
  const allBlogs = await User.find({});
  res.render("home", {
    user: req.user,
   un: allBlogs,
});
});