import React from 'react'
import moment from 'moment/moment';
const PostPreview = ({posts,clicked}) => {
    return (
        // Post Component will have comments
        posts.map(post => (
            <div className="small-post" id={post._id} key={post._id} onClick={clicked}>
                <h4>{post.Title.length > 60 ? post.Title.substring(0, 60) + '...' : post.Title }</h4>
                <p>{
                    post.Content.length > 200 ? post.Content.substring(0, 200) + '...' : post.Content
                }</p>
                <p>{moment(post.DateCreated).format('MMMM Do YYYY, h:mm:ss a').replace('T', ' ').split('.')[0]}</p>
                <p >{post.CreatorUsername}</p>
            </div>
        ))
    )
}

export default PostPreview