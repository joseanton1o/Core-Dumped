import React from 'react'
import moment from 'moment/moment';
const PostPreview = ({posts,clicked}) => {
    return (
        // Post Component will have comments, this will return a list of posts to be displayed in the home page or in the profile page, that is why i created a component for it.
        posts.map(post => (
            <div className="small-post" id={post._id} key={post._id} onClick={clicked}>
                {/* if it is too long it should not be displayed */}
                <h4>{post.Title.length > 60 ? post.Title.substring(0, 60) + '...' : post.Title }</h4>
                <p>{
                    post.Content.length > 200 ? post.Content.substring(0, 200) + '...' : post.Content
                }</p>
                <p>{"Created on " + moment(post.DateCreated).format('MMMM Do YYYY, h:mm:ss a').replace('T', ' ').split('.')[0]}</p>
                <p >{post.CreatorUsername}</p>
            </div>
        ))
    )
}

export default PostPreview