import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// This is the component that will be used to ask a question, to post a question in the forum, user has to be logged in, so we will get the user and jwt from the local storage
const Ask = ({user, jwt}) => {
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [open, setOpen] = useState(false)
    const closeModal = () => setOpen(false)
    const handleChange = (e) => {
        console.log(e.target.name)
        if (e.target.name === 'title') {
            setTitle(e.target.value)
        } else if (e.target.name === 'body') {
            setBody(e.target.value)
        }
    }
    // If the user is not logged in, then we will redirect him to the login page, jwt and user are passed as props from the App.js, there they are retrieved from the local storage 
    useEffect(() => {
        console.log('jwt: ' + jwt)
        console.log('user: ' + user)
        if (user === null || jwt === '') {
            navigate('/login')
        }
    }, [jwt, navigate])

    const submit = (e) => {
        e.preventDefault()
        if (title === '' || body === '') {
            console.log('Title or body is empty')
            setOpen(true)
            return;
        }


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
            mode: 'cors' // because we are using cors in the backend
        })
        .then(res => {
            if (res.status === 401) {
                console.log('Unauthorized')
                let theresToken = localStorage.getItem('jwt') === null ? false : true;
                if (theresToken) { // Then the token is either expired or invalid 
                    localStorage.removeItem('jwt');
                    localStorage.removeItem('user'); // If there is a token, then there is a user with it
                }

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
        <h4>Ask</h4>
        {open && <div className='popUp'>
            <div className='popUp-content'>
                <h5 className='error-msg'>Title or body is empty</h5>
                <button className='btn error' onClick={closeModal}>Close</button>
            </div>
        </div>
        }
        <form action='' method='POST' onChange={handleChange} onSubmit={submit}>
            <input type="text" name="title" placeholder="Title" />
            <textarea name="body" placeholder="Body" cols="50" />
            <button type="submit" className='btn'>Submit</button>
        </form>

        </>
    )
}

export default Ask