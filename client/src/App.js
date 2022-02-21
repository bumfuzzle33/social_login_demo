import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './components/home/home'
import Dashboard from './components/dashboard/dashboard'

window.server_url = 'http://localhost:4000'

const App = ()=>{
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
