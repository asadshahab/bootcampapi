const express=require("express");
const bootcampRouter=express.Router()



bootcampRouter.get("/api/v1/bootcamp", (req,res) =>{
    res.status(200).json({sucess: true, msg:"get bootcamp"})
  })
  
  bootcampRouter.get("/api/v1/bootcamp/:id", (req,res) =>{
    res.status(200).json({sucess: true, msg:"get bootcamp 1"})
  })
  
  bootcampRouter.post("/api/v1/bootcamp", (req,res) =>{
    res.status(200).json({sucess: true, msg:"post bootcamp"})
  })
  
  bootcampRouter.put("/api/v1/bootcamp/:id", (req,res) =>{
    res.status(200).json({sucess: true, msg:"put bootcamp"})
  })
  
  bootcampRouter.delete("/api/v1/bootcamp/:id", (req,res) =>{
    res.status(200).json({sucess: true, msg:"delete bootcamp"})
  })


  module.exports=bootcampRouter;