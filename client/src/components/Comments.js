import React from 'react'
import { Link } from 'react-router-dom';
import moment from 'moment/moment';

// Comments component is a collection of comments, it is used in the Post component, it is passed the comments array, the clicked function and the classes that will be applied to the divs. It is also used in the Profile component.
const Comments = ({comments, clicked, classes}) => {
  return (
    <>
         {// Id of the div is the id of the comment and the id of the post it belongs to, this will be used in the profile page to go to the post that the comment belongs to, however it is not used in the post page as it is not needed, there there will not be an id as stated in line 14 with the id={comment.PostId && (comment._id + "#" + comment.PostId)}.
         }
        {
            comments.length > 0 && comments.map(comment => (

                <div className={classes} id={comment.PostId && (comment._id + "#" + comment.PostId)} key={comment._id} onClick={clicked}>
                    <p>{comment.Comment}</p>
                    <Link to={"/profile/"+comment.CreatorUsername}>{comment.CreatorUsername}</Link>
                    <p>{"Created on " + moment(comment.DateCreated).format('MMMM Do YYYY, h:mm:ss a').replace('T', ' ').split('.')[0]}</p>
                </div>
            ))
        }
    </>
  )
}

export default Comments