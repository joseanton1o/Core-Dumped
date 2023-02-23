import React from 'react'
import {useState, useEffect} from 'react';

import Comment from './Comment';

import { useLocation } from 'react-router-dom';

const Post = ({jwt, user}) => {
    // found this here: https://stackoverflow.com/questions/58409783/how-to-get-the-current-url-in-react-router
    const loc = useLocation();
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    useEffect(() => {
        console.log(loc.pathname.split('/')[2])
        fetch('http://localhost:5000/posts/'+loc.pathname.split('/')[2],
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

//     return (
//     <div className="post">
//         <h3>{post.Title}</h3>
//         <p>{post.Content}</p>
//         <p>{post.CreatorUsername}</p>
//         <p>{post.Votes}</p>
//     </div>
//   )
//  

    return (
        <div className="post">
        <h2>{post.Title}</h2>
        <p>{post.Content}</p>
        <p>{post.CreatorUsername}</p>
        <p>{post.DateCreated}</p>
        {
            comments.length > 0 && comments.map(comment => (
                <div className="Comment" key={comment._id}>
                    <p>{comment.Comment}</p>
                    <p>{comment.CreatorUsername}</p>
                    <p>{comment.DateCreated}</p>
                </div>
            ))
        }
        <Comment jwt={jwt} user={user} postId={loc.pathname.split('/')[2]} />
        </div>
    )
}

export default Post