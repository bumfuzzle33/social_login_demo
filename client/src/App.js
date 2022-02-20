import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './components/home/home'
import RedirectGoogle from './components/redirects/google_redirect'

window.server_url = 'http://localhost:4000'

const App = ()=>{
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/authorisedRedirect/google' element={<RedirectGoogle/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
