import React from 'react'
import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Home = ({user, jwt}) => {
    const navigate = useNavigate()

    const [posts, setPosts] = useState([])
    useEffect(() => {
        fetch('http://localhost:5000/posts',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            cache: 'default'
        })
        .then(res => res.json())
        .then(data => {
            // reverse the array so the newest posts are at the top
            data.reverse()
            setPosts(data)
        })
    }, [])

    const clicked = (e) => {
        // Redirect to the post page with the post id that is in e.target.getAttribute('id')
        // I use e.currentTarget as it refers to the element that the event listener is attached to not the element that triggered the event, I found some info here:
        // https://stackoverflow.com/questions/59981526/event-target-of-a-jquery-click-event-returning-the-child-of-the-clicked-element
        // and
        // https://stackoverflow.com/questions/5921413/difference-between-e-target-and-e-currenttarget
        // Basically e.currentTarget is the element that the event listener is attached to, e.target is the element that triggered the event, as child elements can trigger events on their parent elements I have to put currentTarget.
        const route = '/post/'+e.currentTarget.getAttribute('id')
        // Redirect to the post page, this was found here: https://codefrontend.com/reactjs-redirect-to-url/#:~:text=Redirect%20using%20react%2Drouter&text=However%2C%20if%20you%20need%20to,'%2C%20%7B%20replace%3A%20true%20%7D)%3B
        navigate(route);
    }
    return (
    <>
        <h1>TOP QUESTIONS</h1>
        {jwt && <div>
            <Link to="/post/ask">ask</Link>
        </div>}
        {user && <h2>Welcome {user.username}</h2>}
        <div className="row">
            <div className="">
            {
                // Post Component will have comments
                posts.map(post => (
                    <div className="small-post" id={post._id} key={post._id} onClick={clicked}>
                        <h3>{post.Title}</h3>
                        <p>{
                            post.Content.length > 100 ? post.Content.substring(0, 100) + '...' : post.Content
                        }</p>
                        <p>{post.CreatorUsername}</p>
                    </div>
                ))
            }
        </div>


        </div>
    </>
    )
}

export default Home