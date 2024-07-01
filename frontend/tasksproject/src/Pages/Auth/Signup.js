import React, { useState } from 'react';
import Cookie from "universal-cookie";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoadingSubmit from '../../Components/Loading';

export default function Signup() {
    const [UserName, SetUserName] = useState("");
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const [Role, SetRole] = useState(["user"]);
    const [Error, SetError] = useState("");
    const [Loading, SetLoading] = useState(false);

    const cookie = new Cookie();
    const nav = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        SetLoading(true);

        try {
            const res = await axios.post(
                `http://localhost:8080/api/users/signup`, {
                    username: UserName,
                    email: Email,
                    password: Password,
                    role: Role,
                });
            SetLoading(false);
            const token = res.data.accessToken;
            cookie.set("TaskProject", token);

            nav("/login");
        } catch (error) {
            SetLoading(false);
            if (error.response.status === 400) {
                SetError("Email Or UserName is already been taken");
            } else {
                SetError("Internal server error");
            }
        }
    }

    return (
        <>
            {Loading && <LoadingSubmit />}

            <div className="container">
                <h1>Signup</h1>
                <div className="input-container">
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="input-group">
                            <label className="signup-label">Name</label>
                            <input
                                className="signup-input"
                                type="text"
                                placeholder="Name..."
                                required
                                value={UserName}
                                onChange={(e) => SetUserName(e.target.value)}
                                minLength={2}
                            />
                        </div>

                        <div className="input-group">
                            <label className="signup-label">Email</label>
                            <input
                                className="signup-input"
                                type="email"
                                placeholder="Email..."
                                required
                                value={Email}
                                onChange={(e) => SetEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="signup-label">Password</label>
                            <input
                                className="signup-input"
                                type="password"
                                placeholder="Password..."
                                required
                                value={Password}
                                onChange={(e) => SetPassword(e.target.value)}
                                
                  minLength={8}
                            />
                        </div>
                        <div className="login-link-container">
                            <Link to={'/login'} className="login-link">Already have an account?</Link>
                        </div>
                        <button className="signup-button" type="submit">
                            Sign Up
                        </button>
                        {Error !== "" && <span className="error">{Error}</span>}
                    </form>
                </div>
            </div>
        </>
    );
}
