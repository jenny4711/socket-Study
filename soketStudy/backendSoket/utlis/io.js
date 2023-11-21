const userController = require("../controller/user.controller")
const chatController =require("../controller/chat.controller")
const roomController=require('../controller/room.controller')
module.exports=function(io){
io.on("connection",async(socket)=>{
  console.log('client is connected',socket.id)

  socket.emit('rooms',await roomController.getAllRooms())

  socket.on("joinRoom",async(rid,cb)=>{
    try{
      const user = await userController.checkUser(socket.id);
      const allMsgs= await chatController.getAllMsg(rid)
      console.log(allMsgs,'allmesgs')
      await roomController.joinRoom(rid,user);
      socket.join(user.room.toString());
      const welcomeMessage={
        chat:`${user.name} is joined to this room`,
        user:{id:null,name:"system"},
       
      };
      io.to(user.room.toString()).emit('message',welcomeMessage);
      io.emit('rooms',await roomController.getAllRooms());
      cb({ok:true,msgs:allMsgs});
    }catch(error){
      cb({ok:false,error:error.message});
    }
  })

socket.on('login',async(userName,cb)=>{
  console.log('backendUsername',userName)
  try{
    const user = await userController.saveUser(userName,socket.id);
   
    cb({ok:true,data:user})

  }catch(error){
    cb({ok:false , error:error.message})
  }
  

})

socket.on('sendMessage',async(receivedMessage,cb)=>{
  try{
//유저 찾기 socket id 로
const user =await userController.checkUser(socket.id)
if(user){
  const message = await chatController.saveChat(receivedMessage,user);
  io.to(user.room.toString()).emit("message",message)
  return cb({ok:true})

}
//메세지 저장


  }catch(error){
    cb({ok:false , error:error.message})
  }
  

})

socket.on("leaveRoom", async (_, cb) => {
  try {
    const user = await userController. checkUser(socket.id);
    await roomController.leaveRoom(user);
    const leaveMessage = {
      chat: `${user.name} left this room`,
      user: { id: null, name: "system" },
    };
    socket.broadcast.to(user.room.toString()).emit("message", leaveMessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다 
    io.emit("rooms", await roomController.getAllRooms());
    socket.leave(user.room.toString()); // join했던 방을 떠남 
    cb({ ok: true });
  } catch (error) {
    cb({ ok: false, message: error.message });
  }
});




  socket.on("disconnected",()=>{
    console.log("user is disconnected")
  })
  
})

}
