import express from 'express'
import { WebSocketServer,WebSocket } from 'ws';
const app=express();

const httpserver=app.listen(3000,()=>{console.log("backend server 3000 is up")});

const wss=new WebSocketServer( { server:httpserver } );
let id=0;
const clients = new Map();
wss.on('connection',function connection(socket){
    id++;
     clients.set(id, socket);
    socket.on('error',(error)=>{console.log(error)});
    socket.on('message', function message(data,isBinary){
        wss.clients.forEach(function each(client){
            if(client.readyState==WebSocket.OPEN&&client!=socket){
                client.send(data,{binary:isBinary});
            }
        })
    })
    socket.on('close', () => {
     console.log(`Client ${id} disconnected`);
     clients.delete(id); 
    });
    console.log("use "+id+"is connect");
    socket.send("you are connected with the sever and your id is"+id);
})