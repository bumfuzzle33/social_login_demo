import axios from 'axios'
import { useEffect,useState } from 'react';

const Dashboard = ()=>{
    const [username,setUsername] = useState("")
    const [pictureSrc,setPictureSrc] = useState("")
    const [email,setEmail] = useState("")
    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search)
        const socialMediaName = urlParams.get('state')
        if(socialMediaName==='google'){
            const authorizationCode = urlParams.get('code')
            const object = {
                authorizationCode
            }
            axios.post(window.server_url+'/authcode/google',object)
            .then(response=>{
                setUsername(response.data.name)
                setPictureSrc(response.data.picture)
                setEmail(response.data.email)
            })
            .catch(err=>console.error(err))
        }
        else if(socialMediaName==='facebook'){
            const authorizationCode = urlParams.get('code')
            const object = {
                authorizationCode
            }
            axios.post(window.server_url+'/authcode/facebook',object)
            .then(response=>{
                setUsername(response.data.name)
                setPictureSrc(response.data.picture.data.url)
                setEmail(response.data.email)

            })
            .catch(err=>console.error(err))
        }
        
    },[])
    return(
        <section id='logged_in_container'>
            <h1>welcome {username}</h1>
            <img src={pictureSrc}></img>
            <h2>your mail {email}</h2>
        </section>
    )
}

export default Dashboard;