import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Comment = ({jwt, user, postId}) => {
    const [comment, setComment] = useState('');
    const  [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const submit = (e) => {
        e.preventDefault()
        console.log(postId)
        if (!jwt || !user) {
            setError('Please login to comment, redirecting to login page in 3 seconds...');
            setTimeout(() => {
                
                navigate('/login')
            }, 3000);
            return;
        }else if (comment === '') {
            // if there is a previous error, combine the two errors

            setError('Please fill in the comment field before submitting');
            return;
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
        <h5>Comment</h5>
        {error && <h5 className='error-msg'>{error}</h5>}
        <form action='' method='POST' onChange={(e) => setComment(e.target.value)} onSubmit={submit}>
            <textarea className='materialize-textarea' name="body" placeholder="Body" />
            <button type="submit" className='btn'>Submit</button>
        </form>
        </>
    )
}

export default Comment