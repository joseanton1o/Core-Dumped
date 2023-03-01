import React from 'react'
import {useState} from 'react'
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
// Login component
const Login = ({setJwt, setUser}) => {
    // Here we store userData to send in the login
    const [userData, setUserData] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const submit = (e) => {
        e.preventDefault();
        
        // Check if the user filled in all the fields
        if (userData.email === undefined || userData.password === undefined) {
            setError('Please fill in all fields');
            return;
        }
        // Send the data to the server
        fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify(userData),
            mode:"cors" // allow cors as we are using it in the backend
        })
            .then(response =>{
                console.log(response.body)
                if (response.status === 401) {
                    setError('Login failed'); // If the login failed, we will display an error message, not telling the user that the email or password is wrong, because that would be a security issue
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
                    // Redirect the user to the home page
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