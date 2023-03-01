import React, { useEffect } from 'react'
const LogOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');

    useEffect(() => {
        window.location.href = '/';
    }, [])

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