import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const Ask = ({user, jwt}) => {
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')


    useEffect(() => {
        // Create a fetch request to check if the jwt token is valid
        // If it is, then the user is logged in
        // If it is not, then the user is not logged in and should be redirected to the login page

        fetch('/users/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        })
        .then(res => {
            if (res.status === 401) { // If the user is not logged in
                navigate('/login')
            }
        })
    }, [])

    const handleChange = (e) => {
        console.log(e.target.name)
        if (e.target.name === 'title') {
            setTitle(e.target.value)
        } else if (e.target.name === 'body') {
            setBody(e.target.value)
        }
    }

    const submit = (e) => {
        e.preventDefault()

        fetch(' http://localhost:5000/posts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({
                title: title,
                content: body,
                username: user.username
            }),
            mode: 'cors'
        })
        .then(res => {
            if (res.status === 401) {
                console.log('Unauthorized')
                navigate('/login')
            }
            return res.json();
        })
        .then(data => {
            console.log(data)
            console.log(data.id)
            console.log(data._id)
            navigate('/post/' + data.id);
                
            
        })
    }


    return (
        <>
        <div>Ask</div>
        <form action='' method='POST' onChange={handleChange} onSubmit={submit}>
            <input type="text" name="title" placeholder="Title" />
            <textarea name="body" placeholder="Body" />

            <button type="submit">Submit</button>
        </form>
        </>
    )
}

export default Ask