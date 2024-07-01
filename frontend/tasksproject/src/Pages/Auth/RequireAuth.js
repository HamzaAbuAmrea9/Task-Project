import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import axios from "axios";
import LoadingSubmit from "../../Components/Loading";
import Cookie from "universal-cookie";



export default function RequireAuth() {
  const cookie = new Cookie();
  const token = cookie.get("TaskProject");
  const navigate = useNavigate();

  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/current-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setUser(response.data); 
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchCurrentUser();
  }, [token]); 


  return token ? ( // if have token is allow me to join spsefic page 
    user === "" ? (
      <LoadingSubmit />
    )  :( 
      <Outlet />)
  ) : (
    <Navigate
      to={"/login"}
      replace={true} // to not return to dashboard
    />
  );
}
