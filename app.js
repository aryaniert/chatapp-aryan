require('dotenv').config();
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const mongoose = require("mongoose");
const PORT = process.env.PORT||3000;
const app = express();
const http = require('http').createServer(app)
// const dbs = 'mongodb://localhost:27017/chatapp';
const DB =process.env.DATABASE;
const sendm = require("./model/sendm");
const { Socket } = require("socket.io");

//socket
const io = require('socket.io')(http);

mongoose.connect(DB,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("connection success"))
.catch((err) => console.log(err));

const newpath = path.join(__dirname,"");
const viewpath = path.join(__dirname,"/views");


app.get("/",async(req,res)=>{
    res.render('index');
});

app.use(express.static(newpath));
app.set('view engine', 'hbs');
app.set('views',viewpath);

io.on('connection',async(socket)=>{
    console.log('A user connected');
    const ret = await sendm.find();
    const no = await sendm.count();
    console.log(`The no. of message ${no}`);

    for (let i = 0; i < no; i++){
    // console.log(ret[i]);
    socket.emit('message',ret[i]);
    }

    socket.on('message',async(msg)=>{
        // console.log(msg);
        let name = msg.user
        let message = msg.message
        socket.broadcast.emit('message',msg)
        const sendme = new sendm ({
            user:name,
            message:message
        })
        const registered = await sendme.save();
        // console.log(registered);
       
    })
    
    // Send a message when
    setTimeout(function(){
       // Sending an object when emmiting an event
       socket.emit('testerEvent', { description: 'A custom event named testerEvent!'});
    }, 4000);
    socket.on('disconnect', function () {
       console.log(`A user disconnected`);
    });
 });
    


http.listen(PORT,()=>{
    console.log('server connected');
});