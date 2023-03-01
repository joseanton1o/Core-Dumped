import React from 'react'
import {useState, useEffect} from 'react';
import moment from 'moment/moment';
import Comment from './Comment';
import Comments from './Comments';
import { Link, useLocation } from 'react-router-dom';

const Post = ({jwt, user}) => {
    // found this here: https://stackoverflow.com/questions/58409783/how-to-get-the-current-url-in-react-router
    const loc = useLocation();
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    useEffect(() => {
        console.log(loc.pathname.split('/')[2])
        fetch('http://localhost:5000/posts/'+loc.pathname.split('/')[2], // Returns the post itself (with the username) and the comments (also with the username) so I can display the username of the creator and the username of the comment creator (this is not done in the profile page as it is not needed)
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            cache: 'default'
        })
        .then(res => res.json())
        .then(data =>{
            setPost(data)
            setComments(data.Comments)
            /*
            I had to use this approach as when I used setPost the Comments where undefined but With some console logs i found out that data had the array of comments.
            */
        })
        
    }, [loc]) // Loc is never going to change so this will only run once but i added it to stop the warning. The array is the dependencies, if any of them change the function will run again.

    return (
        <>
            <div className="post">
                <h2>{post.Title}</h2>
                <p>{post.Content}</p>
                <Link to={'/profile/'+post.CreatorUsername}>{post.CreatorUsername}</Link>
                <p>{
                    // Replace T with a space, and cut characters after the dot (the dot is included)
                    moment(post.DateCreated).format('MMMM Do YYYY, h:mm:ss a').replace('T', ' ').split('.')[0]
                }</p>
            </div>
            <div className="comments">
                <Comments comments={comments} cilcked={() => {}} classes={"post-comment"}/>
            </div>
            <Comment jwt={jwt} user={user} postId={loc.pathname.split('/')[2]} />
        </>
    )
}

export default Post