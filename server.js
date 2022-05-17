const express=require("express");
const dotenv=require("dotenv");
const app=express()
const bootcampRouter=require("./routes/bootcamps")

app.use(express.json())
app.use(bootcampRouter)

dotenv.config({path: "./config/config.env"})

const server= require("http").createServer(app)
const PORT= process.env.PORT || 3000


server.listen(PORT, (req,res) =>{
  console.log(`Server is Runing on PORT:${PORT}`)
})