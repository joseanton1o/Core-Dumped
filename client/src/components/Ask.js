import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
            mode: 'cors'
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