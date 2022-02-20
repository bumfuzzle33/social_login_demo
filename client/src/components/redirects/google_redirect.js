import axios from 'axios'
import { useEffect,useState } from 'react';

const RedirectGoogle = ()=>{
    const [googleOauthObject,setGoogleOauthObject] = useState([])
    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search)
        const authorizationCode = urlParams.get('code')
        const object = {
            authorizationCode
        }
        axios.post(window.server_url+'/google/authCode',object)
        .then(response=>{
            console.log(response.data)
            axios.get("https://www.googleapis.com/auth/userinfo.profile",{
                headers:{
                    "Authorization": `Bearer ${response.data.access_token}`,
                    "Access-Control-Allow-Origin":'http://localhost:3000'
                }
            })
            .then(response=>{
                console.log(response)
            })
            .catch(err=>console.error(err))
        })
        .catch(err=>console.error(err))
    },[])
    return(
        <h1>hii there google redirect</h1>
    )
}

export default RedirectGoogle;