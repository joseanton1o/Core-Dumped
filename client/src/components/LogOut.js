import React, { useEffect } from 'react'
// LogOut component
const LogOut = () => {
    localStorage.removeItem('jwt');// Remove the jwt from local storage
    localStorage.removeItem('user');// Remove the user from local storage

    useEffect(() => {// Redirect the user to the home page
        window.location.href = '/';
    }, [])
    // Display a message to the user just in case the redirect doesn't work
    return (
        <div>
            <h1> Logged out successfully </h1>
            <h4><a href="/">
                Click here to go back to the home page
            </a></h4>
        </div>
    )
}

export default LogOut