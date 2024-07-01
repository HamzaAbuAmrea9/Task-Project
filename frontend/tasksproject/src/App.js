
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Signup from './Pages/Auth/Signup';
import Login from './Pages/Auth/Login';
import RequireBack from './Pages/Auth/RequireBack';
import RequireAuth from './Pages/Auth/RequireAuth';
import HomePage from './Website/HomePage';


function App() {
  return (
    <div className="App">
     

     <Routes>  
      
    <Route element={<RequireBack
    />}> 
    {/* if have token not can return to login and signup page  */}
    <Route path='/signup' element= {<Signup/>}/>
    <Route path='/login' element={<Login />}/>
      
      </Route>
    <Route element={<RequireAuth/>}> 
      {/* to Enter to this pages you should do login  */}
     <Route path='/' element= {<HomePage/>}/>
    
     </Route>
   {/* <Route path='SettingsPage/:id' element={<SettingsPage/>}/>
    <Route path='Events' element={<Event/>}/> */}
    
      {/* <Route path='/AddPosts' element= {<AddPostForm/>}/>
      <Route path='/feedshow' element= {<PostFeed/>}/> */}
      {/* 
      </Route>
      <Route path='/Profile/:id' element={<UserProfile/>}/>
      <Route path='/*' element={<Err404/>}/>
      <Route path='/policy' element= {<Privacy/>}/>
      <Route path='/Terms_service' element= {<TermsService/>}/> */}
    </Routes>

    </div>
  );
}

export default App;
