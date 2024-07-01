import React, { useState } from "react";
import axios from "axios";
import Cookie from "universal-cookie";
import LoadingSubmit from "../../Components/Loading";
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const nav = useNavigate();
  const [err, setErr] = useState("");
  const [Loading, SetLoading] = useState(false);

  const cookie = new Cookie();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    SetLoading(true);
    try {
      const res = await axios.post(`http://localhost:8080/api/users/signin`, {
        username: formData.name,
        password: formData.password,
      });
      SetLoading(false);
      const token = res.data.accessToken;

      cookie.set("TaskProject", token);
      window.location.pathname = "/";
    } catch (error) {
      SetLoading(false);

      if (error.response.status === 401) {
        setErr("UserName Or Password is wrong");
      } else {
        setErr("Internal server error");
      }
    }
  }

  return (
    <>
      {Loading && <LoadingSubmit />}

      <div className="container">
        <h1>Login</h1>
        <div className="input-container">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label className="login-label">Username</label>
              <input
                className="login-input"
                type="text"
                placeholder="Username..."
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label className="login-label">Password</label>
              <input
                className="login-input"
                type="password"
                placeholder="Password..."
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="login-link-container">
            <Link to={'/signup'}className="login-link">if you haven't Account</Link> 
                        </div>
  
            <button className="login-button" type="submit">
              Log in
            </button>
            {err !== "" && <span className="error">{err}</span>}
          </form>
        </div>
      </div>
    </>
  );
}
