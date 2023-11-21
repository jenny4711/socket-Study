const {createServer}=require("http")
const app = require("./app")
const {Server}=require("socket.io")
const httpServer = createServer(app)
require("dotenv").config();
const io = new Server(httpServer,{
  cors:{
    origin:"http://localhost:3000"
  }
})
require("./utlis/io")(io)

httpServer.listen(process.env.PORT,()=>{
  console.log('server listening on port',process.env.PORT)
})