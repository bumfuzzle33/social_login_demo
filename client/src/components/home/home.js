import './home.css'
import {BsGoogle} from 'react-icons/bs'
import axios from 'axios'

const Home = ()=>{
    function login(social_media){
      if(social_media==='google'){
        axios.get(window.server_url+'/consentWindow/google')
        .then(response=>{
            window.open(response.data.url,'_blank','location=yes,height=570,width=520,scrollbars=yes,status=yes')
        })
        .catch(err=>console.error(err))
      }
  
    }
    return (
        <div className="home">
          <header className='main_title'>
            <h1 className='is-size-2 has-text-centered'>Welcome to cucumber App :)</h1>
            
          </header>
          <section className='mt-6'>
            <div id='login_methods_container'>
              <h2>Use one of the login methods to login/signup</h2>
              <button onClick={()=>login('google')} className="login_method_btn">
                <span className="icon">
                  <BsGoogle/>
                </span>
                <span className=''>Login with Google</span>
              </button>
            </div>
          </section>
          
        </div>
    );
}

export default Home;