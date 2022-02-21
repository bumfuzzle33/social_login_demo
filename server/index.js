const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const request = require('request')

dotenv.config()
const google_oauth_endpoint = "https://accounts.google.com/o/oauth2/v2/auth"
const server = express()
server.use(cors({
    cors:'http://localhost:3000'
}))
//bodyParser.urlencoded parses urlencoded requests to res.body
//The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
server.use(bodyParser.urlencoded({extended:false}))
server.use(bodyParser.json())

const swaggerOptions = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Social Login API",
            version:"1.0.0",
            description:"A Simple Social Login API Which Supports Facebook and Google."
        },
        servers:[
            {
                url:"http://localhost:4000"
            }
        ]
    },
    apis:["index.js"]
}

const Docs = swaggerJsDoc(swaggerOptions)

server.use('/api-docs',swaggerUi.serve,swaggerUi.setup(Docs))


/**
   * @swagger
   * /consentWindow/google:
   *   get:
   *     summary: Provides a Google auth window url
   *     description: Responds with a json object which has a google consent window url in its url parameter.
   *     responses:
   *       200:
   *         description: Returns an object
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  url:
   *                    type: string
   *                    description: This is the google's consent window url param
   *                    example: https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile&client_id=11111111131-fjabdmsiemdkdjadpntm7iicnmdbdghn.apps.googleusercontent.com&access_type=offline&response_type=code&redirect_uri=http://localhost:3000/dashboard&state=google
   */

/**
   * @swagger
   * /consentWindow/facebook:
   *   get:
   *     summary: Provides a Facebook auth window url
   *     description: Responds with a json object which has a facebook consent window url in its url parameter.
   *     responses:
   *       200:
   *         description: Returns an object
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  url:
   *                    type: string
   *                    description: This is the facebook's consent window url param
   *                    example: https://www.facebook.com/v13.0/dialog/oauth?state=facebook&client_id=53111111111111&redirect_uri=http://localhost:3000/dashboard
   */

server.get('/consentWindow/:social_media',(req,res)=>{
    let social_media = req.params.social_media
    if(social_media==='google'){
        const client_id = process.env.google_client_id
        const redirect_uri = process.env.oauth_redirect_url
        const response_type = "code"
        const scope =  "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
        const access_type = "offline"
        const state = "google"

        const consentWindowObj = {
            url:`https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&client_id=${client_id}&access_type=${access_type}&response_type=${response_type}&redirect_uri=${redirect_uri}&state=${state}`
        }
        res.send(consentWindowObj)

    }else if(social_media==='facebook'){
        const client_id = process.env.facebook_app_id
        const redirect_uri = process.env.oauth_redirect_url
        const state = "facebook"
        const scope = 'email'

        const consentWindowObj = {
            url:`https://www.facebook.com/v13.0/dialog/oauth?scope=${scope}&state=${state}&client_id=${client_id}&redirect_uri=${redirect_uri}`
        }
        console.log(consentWindowObj)

        res.send(consentWindowObj)


    }
})

/**
   * @swagger
   * /authcode/google:
   *    post:
   *      summary: Provides user details
   *      description: Passing the authorization code (which you got from google consent window) to this endpoint would result in the api fetching access token by itself and using that access token to get user credentails using the userinfo google api (https://www.googleapis.com/oauth2/v1/userinfo).
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                authorizationCode:
   *                  type: string
   *                  example: "38493284932jfdksjfisd8395"
   *      responses:
   *        200:
   *          description: returns an user object
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  id:
   *                      type: integer
   *                      description: The user's id
   *                      example: 101094833327049475000
   *                  email:
   *                      type: string
   *                      description: The user's email
   *                      example: example@gmail.com
   *                  verified_email:
   *                      type: bool
   *                      description: wether the user has a verified email or not
   *                      example: true
   *                  name:
   *                      type: string
   *                      description: The user's name 
   *                      example: Adolf hitler
   *                  given_name:
   *                      type: string
   *                      description: The user's given name
   *                      example: Adolf
   *                  family_name:
   *                      type: string
   *                      description: The user's family name
   *                      example: Hitler
   *                  picture:
   *                      type: string
   *                      description: The user's profile picture URL
   *                      example: https://lh3.googleusercontent.com/a-/AOh14GjCQsIh7iCNYzmuQr7tJr2JTEP2DGsPuIRRnwWx=s96-c"
   *                  locale:
   *                      type: string
   *                      description: The user's native-language environment
   *                      example: en-GB
   *        401:
   *          description: Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential.
   *        default:
   *          description: unexpected error 
   *            
   */

/**
   * @swagger
   * /authcode/facebook:
   *    post:
   *      summary: Provides user details
   *      description: Passing the authorization code (which you got from the facebook consent window) to this endpoint would result in the api fetching access token by itself and using that access token to get user credentials at the facebook api endpoint "https://www.googleapis.com/oauth2/v1/userinfo" .
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                authorizationCode:
   *                  type: string
   *                  example: "38493284932878979"
   *      responses:
   *        200:
   *          description: returns an user object
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  id:
   *                      type: integer
   *                      description: The user's id
   *                      example: 101094833327049475000
   *                  name:
   *                      type: string
   *                      description: The user's name 
   *                      example: Adolf hitler
   *                  email:
   *                      type: string
   *                      description: The user's email
   *                      example: example@gmail.com
   *                  picture:
   *                      type: object
   *                      properties: 
   *                        data:
   *                          type: object
   *                          properties:
   *                            height:
   *                              type: int
   *                              description: Height of the profile picture image
   *                              example: 50
   *                            width:
   *                              type: int
   *                              description: Width of the profile picture image
   *                              example: 50
   *                            is_silhouette:
   *                              type: bool
   *                              description: Stating wether its a silhouette or not
   *                              example: false
   *                            url:
   *                              type: string
   *                              description: URL of the profile picture
   *                              example: https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=104336628848676&height=50&width=50&ext=1648031592&hash=AeS1UXxSITaK8cScrLw
   *        190:
   *          description: Invalid OAuth access token.
   *        default:
   *          description: unexpected error 
   *            
   */
server.post('/authcode/:socialMediaName',(req,res)=>{
    const socialMediaName = req.params.socialMediaName
    if(socialMediaName==='google'){
        const authorizationCode = req.body.authorizationCode
        //now that we have the authCode we need to send it over to google api to get our refresh token and access token
        const client_id = process.env.google_client_id
        const client_secret = process.env.google_client_secret
        const grant_type = "authorization_code"
        const redirect_uri = process.env.oauth_redirect_url
        const googleAccessTokenRequestHeaders = {
            json:true,
            uri:"https://oauth2.googleapis.com/token",
            method:'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body:`code=${authorizationCode}&client_id=${client_id}&client_secret=${client_secret}&grant_type=${grant_type}&redirect_uri=${redirect_uri}`
        }
        request(googleAccessTokenRequestHeaders,(err,response)=>{
            if(err)
                res.status(401).send(err)
            else{
                const googleApiProfileHeaders = {
                    method:'GET',
                    uri:'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+response.body.access_token
                }
                request(googleApiProfileHeaders,(err,response)=>{
                    if(err)
                        res.status(400).send(err)
                    else{
                        console.log(response.body)
                        res.send(response.body)
                    }
                })
            }
        })
    }
    else if(socialMediaName==='facebook'){
        const authorizationCode = req.body.authorizationCode
        const client_id = process.env.facebook_app_id
        const client_secret = process.env.facebook_app_secret
        const redirect_uri = process.env.oauth_redirect_url

        const facebookAccessTokenRequestHeaders = {
            json:true,
            method:'GET',
            uri:`https://graph.facebook.com/v13.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${authorizationCode}`

        }
        request(facebookAccessTokenRequestHeaders,(err,response)=>{
            if(err)
                res.status(190).send(err)
            else{
                const fb_access_token = response.body.access_token
                request({
                    json:true,
                    method:'GET',
                    uri:`https://graph.facebook.com/me?access_token=${fb_access_token}`
                },(err,response)=>{
                    if(err){
                        res.status(400).send(err)

                        return 0;
                    }
                    const fb_user_id = response.body.id
                    request({
                        json:true,
                        method:'GET',
                        uri:`https://graph.facebook.com/${fb_user_id}?fields=id,name,email,picture&access_token=${fb_access_token}`
                    },(err,response)=>{
                        if(err)
                            res.status(400).send(err)
                        else{
                            console.log(response.body)
                            res.send(response.body)
                        }
                    })
                })
            }
        })
    }
    
})



server.listen(4000,()=>{
    console.log("Listening on port 4000")
})

let q = "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http://localhost:4000/oauth/google&client_id=673365289831-h6231hh8pi6d5dq7pntm7iicnmdbdghn.apps.googleusercontent.com&prompt=consent"