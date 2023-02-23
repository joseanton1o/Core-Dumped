import React from 'react'
import {useState} from 'react'
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';

const Login = ({setJwt, jwt, setUser}) => {
    // Here we store userData to send in the login
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();
    const submit = (e) => {
        e.preventDefault();
        
        fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify(userData),
            mode:"cors" //??
        })
            .then(response => response.json())
            .then(data => {
                if(data.token) {
                    setJwt(data.token)
                    setUser(JSON.parse(Buffer.from(data.token.split(".")[1], "base64").toString()))
                    navigate("/")
                }

            })
    
    }


    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={submit} onChange={handleChange}>
                <input type="email" name="email" placeholder='email' />
                <input type="password" name="password" />
                <input type="submit" />
            </form>
        </div>
    )
}

export default Login