import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Component for the comment section, it will be used in the Post.js component, it will be used to comment on a post, user has to be logged in to comment, so we will get the user and jwt as props from the Post.js component which will get them from the app.js component, which will get them from the local storage
const Comment = ({jwt, user, postId}) => {
    const [comment, setComment] = useState('');
    const  [error, setError] = useState(null);
    const navigate = useNavigate(); // To redirect the user to the login page if he is not logged in
    
    const submit = (e) => {
        e.preventDefault()
        console.log(postId)
        if (!jwt || !user) { // If there is no jwt or user, then the user is not logged in
            setError('Please login to comment, redirecting to login page in 3 seconds...');
            setTimeout(() => {
                
                navigate('/login')
            }, 3000);
            return;
        }else if (comment === '') {// If the comment field is empty

            setError('Please fill in the comment field before submitting');
            return;
        }
        // Everything is fine, we will send the comment to the server
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
            if (res.status === 401) { // Double check if the user is logged in, if not, then we will redirect him to the login page
                navigate('/login')
            }
            return res.json();
        })
        
        window.location.reload(false); // Reload the page to show the new comment
        
        //setComment(''); // Not needed, the page will reload
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