import React from 'react'
import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PostPreview from './PostPreview'
import Pagination from './Pagination'
const Home = ({user, jwt}) => {
    const navigate = useNavigate()


    // Pagination code is brought from here: https://github.com/bradtraversy/simple_react_pagination
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage] = useState(10);



    useEffect(() => {
        fetch('http://localhost:5000/posts', // This gets all the posts with the creator username in the response
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

    // Get current posts, got this from here: https://www.youtube.com/watch?v=IYCa1F-OWmk
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
    <>
        {user &&  <h3>Welcome Back {user.username} !!</h3>}
        <h1>RECENT QUESTIONS</h1>


        <div className="">
            <Pagination postsPerPage={postPerPage} totalPosts={posts.length} paginate={paginate}/>
            <PostPreview posts={currentPosts} clicked={clicked}/>

        </div>
    </>
    )
}

export default Home