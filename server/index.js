const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const dotenv = require('dotenv')
const cors = require('cors')
const { response } = require('express')

dotenv.config()
const google_oauth_endpoint = "https://accounts.google.com/o/oauth2/v2/auth"
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

server.use(cors({
    cors:'*'
}))

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
   *             url:https://www.google.com/o/v2/auth?google=data
   *

   */

server.get('/consentWindow/:social_media',(req,res)=>{
    let social_media = req.params.social_media
    if(social_media==='google'){
        const client_id = process.env.google_client_id
        const redirect_uri = process.env.google_oauth_redirect_url
        const response_type = "code"
        const scope =  "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
        const access_type = "offline"

        let consentWindowObj = {
            url:`https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&client_id=${client_id}&access_type=${access_type}&response_type=${response_type}&redirect_uri=${redirect_uri}`
        }
        res.send(consentWindowObj)

    }
})

server.get('/oauth/google',(req,res)=>{
    res.send('hello there')
})

server.listen(4000,()=>{
    console.log("Listening on port 4000")
})

let q = "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http://localhost:4000/oauth/google&client_id=673365289831-h6231hh8pi6d5dq7pntm7iicnmdbdghn.apps.googleusercontent.com&prompt=consent"