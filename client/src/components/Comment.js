import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Component for the comment section, it will be used in the Post.js component, it will be used to comment on a post, user has to be logged in to comment, so we will get the user and jwt as props from the Post.js component which will get them from the app.js component, which will get them from the local storage
const Comment = ({setUser, setJwt, jwt, user, postId}) => {
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

        // Here we could also send a request to the server to check if the token is valid, however we can do that in the /posts/comment route as it is a protected route, if the token is invalid, we will catch the response as 401 and then handle it there in stead of sending two requests to the server

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
                console.log('Unauthorized')
                // If we are here, then the token is either expired or invalid, so we will remove it from the local storage
                localStorage.removeItem('jwt');
                localStorage.removeItem('user'); // If there is a token, then there is a user with it
                setUser(null)
                setJwt('')
                navigate('/login') // No need to navigate, when the page reloads the user will be logged out as the user and jwt are set to null, so next time the user will be redirected to the login page
            } else if (res.status === 403) {
                setError('Your comment is too long, please keep it under 100 000 characters');
            }
            else {
                window.location.reload(false); // Reload the page to show the new comment
            }
        })

        
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