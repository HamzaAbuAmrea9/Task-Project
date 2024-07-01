import React from 'react'

import { Navigate, Outlet } from 'react-router-dom';
import Cookie from 'universal-cookie';
export default function RequireBack() { // this page for if user is loged in can't go to login or register  pages 
 
    const cookie= new Cookie();
    const token = cookie.get('TaskProject');
    return token ? window.history.back():<Outlet/> // if you have token and you are loged in it back you to  the page that you came from else go to login
   
  
}
