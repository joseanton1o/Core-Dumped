import React from 'react'
import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PostPreview from './PostPreview'
import Pagination from './Pagination'

// Home component, this is the home page, it will show all the posts, it will be used in the App.js component, it will be passed the user and jwt as props from the App.js component, which will get them from the local storage, here we will use the user and jwt to check if the user is logged in, if he is logged in, then we will show different options in the navbar. In this component we will show all the posts, we will use the PostPreview component to show the posts, we will also use the Pagination component to paginate the posts.
const Home = ({user, jwt}) => {
    const navigate = useNavigate()


    // Pagination code is brought from here: https://github.com/bradtraversy/simple_react_pagination
    const [posts, setPosts] = useState([]); // Posts array, this will be used to store all the posts
    const [currentPage, setCurrentPage] = useState(1); // Current page, when the page loads, we will show the first page
    const [postPerPage] = useState(10); // Number of posts per page



    useEffect(() => {
        // Get all the posts
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
    const indexOfLastPost = currentPage * postPerPage; // Index of the last post, 10 for the first page, 20 for the second page, etc.
    const indexOfFirstPost = indexOfLastPost - postPerPage; // Index of the first post, 0 for the first page, 10 for the second page, etc.
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // Slice the posts array to get the posts for the current page, slice will return an array that starts with the first param and ends with the second param - 1, so for the first page will return 0,1,2,...,9 

    // Change page function, allows us to change the page
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