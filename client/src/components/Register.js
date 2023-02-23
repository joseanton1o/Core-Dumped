import React from 'react'
import { useState } from 'react'

const Register = () => {
    // Here we store userData to send in the login
    const [userData, setUserData] = useState({});

    const submit = (e) => {
        e.preventDefault();
        
        /* POST request using fetch with error handling */
        fetch("/users/register", {
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify(userData),
            mode:"cors" //??
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.log(data.message)
                }
            })
    }

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }


    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={submit} onChange={handleChange}>
                <input type="email" name="email" placeholder='Email' />
                <input type="text" name="username" placeholder='Username' />
                <input type="password" name="password" />
                <input type="submit" />
            </form>
        </div>
    )

}

export default Register