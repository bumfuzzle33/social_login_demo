const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const dotenv = require('dotenv')

dotenv.config()
console.log(process.env.client_id)

const server = express()
const swaggerOptions = {
    swaggerDefinition:{
        info:{
            title:"Social Login Implementation",
            description:"some desc",
            contact:{
                name:"happycoder"
            },
            server:["https://localhost:4000"]
        }
    },
    apis:["index.js"]
}
const swaggerDocs = swaggerJsDoc(swaggerOptions)

server.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs))
/**
   * @swagger
   * /consentWindow/google:
   *   get:
   *     summary: Provides a Google auth window url
   *     description: Responds with a json object which has a google consent window url in its url parameter.
   *     security: []
   *     responses:
   *       200:
   *         description: OK
   *         schema:
   *           type: object
   *           properties:
   *             url:*url
   *

   */

server.get('/consentWindow/:social_media',(req,res)=>{
    let social_media = req.params.social_media
    if(social_media==='google'){
        res.send('REST API for gooogle')

    }
})

server.get('/oauth/google',(req,res)=>{
    res.send('hello there')
})

server.listen(4000,()=>{
    console.log("Listening on port 4000")
})

let q = "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http://localhost:4000/oauth/google&client_id=673365289831-h6231hh8pi6d5dq7pntm7iicnmdbdghn.apps.googleusercontent.com&prompt=consent"