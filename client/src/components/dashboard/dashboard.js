import axios from 'axios'
import { useEffect,useState } from 'react';
import './dashboard.css'
import Cookies from 'js-cookie'
const Dashboard = ()=>{
    const [username,setUsername] = useState("")
    const [pictureSrc,setPictureSrc] = useState("")
    const [email,setEmail] = useState("")
    useEffect(()=>{
        //if cookie is already set load that 
        if(Cookies.get('username')!==undefined){
            setUsername(Cookies.get('username'))
            setPictureSrc(Cookies.get('pictureSrc'))
            setEmail(Cookies.get('email'))
        }
        else{
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
                    //saving user data to cookies
                    document.cookie=`username=${response.data.name}`
                    document.cookie=`email=${response.data.email}`
                    document.cookie=`pictureSrc=${response.data.picture}`
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
                    //saving user data to cookies
                    document.cookie=`username=${response.data.name}`
                    document.cookie=`email=${response.data.email}`
                    document.cookie=`pictureSrc=${response.data.picture.data.url}`
    
                })
                .catch(err=>console.error(err))
            }
        }
        
        
        
        
    },[])
    function logOut(){
        Cookies.remove('username',{path:''})
        Cookies.remove('email',{path:''})
        Cookies.remove('pictureSrc',{path:''})

        window.open('http://localhost:3000/','_self')
    }
    return(
        <section id='logged_in_container'>
            <button onClick={()=>logOut()} className='button is-medium is-warning m-3' id="logout">Log Out</button>
            <div id='info_container'>
                <div>
                <h1 className='is-size-3'>Welcome {username}</h1>
                <img src={pictureSrc}></img>
                <h4 className='is-size-4'>Your mail is : {email}</h4>
                </div>
                
            </div>
        </section>
    )
}

export default Dashboard;