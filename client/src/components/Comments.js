import React from 'react'
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
const Comments = ({comments, clicked, classes}) => {
  return (
    <>
        {
            comments.length > 0 && comments.map(comment => (
                <div className={classes} id={comment._id + "#" + comment.PostId} key={comment._id} onClick={clicked}>
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