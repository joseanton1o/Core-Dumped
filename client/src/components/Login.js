import React from 'react'
import {useState} from 'react'
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';

const Login = ({setJwt, setUser}) => {
    // Here we store userData to send in the login
    const [userData, setUserData] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const submit = (e) => {
        e.preventDefault();
        
        if (userData === {})
        console.log('empty')
    //
    if (userData.email === undefined || userData.password === undefined) {
        setError('Please fill in all fields');
        return;
    }

        fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify(userData),
            mode:"cors" //??
        })
            .then(response =>{
                console.log(response.body)
                if (response.status === 401) {
                    setError('Login failed');
                }
                
                return response.json()
            })
            .then(data => {
                if(data.token) {
                    // Save the token to local storage
                    localStorage.setItem("jwt", data.token)
                    // Save user to local storage
                    localStorage.setItem("user", Buffer.from(data.token.split(".")[1], "base64").toString())

                    setJwt(data.token) // So when navigating to a new page, the jwt is still there and the user is logged in
                    setUser(JSON.parse(Buffer.from(data.token.split(".")[1], "base64").toString()))
                    // Refresh the page

                    navigate('/')

                }

            })
    
    }


    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <h2>Login</h2>
            {error && <h5 className='error-msg'>{error}</h5>}
            <form onSubmit={submit} onChange={handleChange}>
                <input type="email" name="email" placeholder='email' />
                <input type="password" name="password" />
                <input type="submit" value="Submit" className='btn'/>
            </form>
        </div>
    )
}

export default Login