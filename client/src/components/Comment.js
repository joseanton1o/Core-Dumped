import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Comment = ({jwt, user, postId}) => {
    const [comment, setComment] = useState('');
    const navigate = useNavigate();
    
    const submit = (e) => {
        e.preventDefault()
        console.log(postId)
        if (!jwt || !user) {
            navigate('/login')
        }

        fetch(' http://localhost:5000/posts/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({
                postId: postId,
                content: comment,
                username: user.username
            }),
            mode: 'cors'
        })
        .then(res => {
            if (res.status === 401) {
                navigate('/login')
            }
            return res.json();
        })
        
        window.location.reload(false);
        
        //setComment('');
    }

    return (
        <>
        <div>Comment</div>
        <form action='' method='POST' onChange={(e) => setComment(e.target.value)} onSubmit={submit}>
            <textarea name="body" placeholder="Body" />
            <button type="submit">Submit</button>
        </form>
        </>
    )
}

export default Comment