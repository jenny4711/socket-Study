const chatController ={}
const Chat = require('../Models/chat')

chatController.saveChat = async(message,user)=>{
  const newChat = new Chat({
    chat:message,
    user:{
      id:user._id,
      name:user.name
    },
    room:user.room,
  })
  await newChat.save();
  return newChat
}

chatController.getAllMsg=async(rid)=>{
  const getMsgs = Chat.find({room:rid})
  return getMsgs
}


module.exports=chatController