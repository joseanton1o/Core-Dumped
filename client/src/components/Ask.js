import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// This is the component that will be used to ask a question, to post a question in the forum, user has to be logged in, so we will get the user and jwt from the local storage
const Ask = ({ setJwt , setUser ,user, jwt}) => {
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [open, setOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState('')

    const closeModal = () => {
        setOpen(false)
        setModalMessage('')
    }
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
        if (!jwt || !user) { // If there is no jwt or user, then the user is not logged in
            navigate('/login')
        }
        // Check validity of the token
        fetch('http://localhost:5000/users/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({
                username: user.username
            }),
            mode: 'cors' // because we are using cors in the backend
        })
        .then(res => {
            if (res.status === 401) {
                console.log('Unauthorized')
                let theresToken = localStorage.getItem('jwt') === null ? false : true;
                console.log(theresToken)
                if (theresToken) { // Then the token is either expired or invalid 

                    localStorage.removeItem('jwt');
                    localStorage.removeItem('user'); // If there is a token, then there is a user with it
                    setUser(null)
                    setJwt('')
                }

                navigate('/login')
            }
            return res.json();
        }
        )


    }, [])

    const submit = (e) => {
        e.preventDefault()
        if (title === '' || body === '') {
            console.log('Title or body is empty')
            setModalMessage('Title or body is empty')
            setOpen(true)
            return;
        }

        let badRequest = false;
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
            else if (res.status === 400) {
                console.log('Title or body is too long')
                setModalMessage('Either title is too long (100 characterers max) or body is too long (100 000 characters max)')
                setOpen(true)
                badRequest = true;
            }
            return res.json();
        })
        .then(data => {
            console.log(data)
            console.log(data.id)
            console.log(data._id)
            console.log(open)
            if (!badRequest)
                navigate('/post/' + data.id);
        })
    }


    return (
        <>
        <h4>Ask</h4>
        {open && <div className='popUp'>
            <div className='popUp-content'>
                <h5 className='error-msg'>{ modalMessage }</h5>
                <button className='btn error' onClick={closeModal}>Close</button>
            </div>
        </div>
        }
        <form action='' method='POST' onChange={handleChange} onSubmit={submit}>
            <input type="text" name="title" placeholder="Title" />
            <div className="input-field">
            <textarea class="materialize-textarea" name="body" placeholder="Body" cols="50" />
            </div>
            <button type="submit" className='btn'>Submit</button>
        </form>

        </>
    )
}

export default Ask