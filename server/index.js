const express = require('express')

const server = express()

server.get('/',(req,res)=>{
    res.send('REST API')
})

server.listen(5000,()=>{
    console.log("Listening on port 5000")
})