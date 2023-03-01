import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PostPreview from './PostPreview';
import Comments from './Comments';
import moment from 'moment/moment';

const Profile = () => {
  const navigate = useNavigate();
  // found this here: https://stackoverflow.com/questions/58409783/how-to-get-the-current-url-in-react-router
  const loc = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedUser, setIsLoggedUser] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [addingBio, setAddingBio] = useState(false);
  const [bio, setBio] = useState('');

  const post_clicked = (e) => {
    // Redirect to the post page with the post id that is in e.target.getAttribute('id')
    // I use e.currentTarget as it refers to the element that the event listener is attached to not the element that triggered the event, I found some info here:
    // https://stackoverflow.com/questions/59981526/event-target-of-a-jquery-click-event-returning-the-child-of-the-clicked-element
    // and
    // https://stackoverflow.com/questions/5921413/difference-between-e-target-and-e-currenttarget
    // Basically e.currentTarget is the element that the event listener is attached to, e.target is the element that triggered the event, as child elements can trigger events on their parent elements I have to put currentTarget.
    const route = '/post/'+e.currentTarget.getAttribute('id');
    // Redirect to the post page, this was found here: https://codefrontend.com/reactjs-redirect-to-url/#:~:text=Redirect%20using%20react%2Drouter&text=However%2C%20if%20you%20need%20to,'%2C%20%7B%20replace%3A%20true%20%7D)%3B
    navigate(route);
  }

  const comment_clicked = (e) => {

    // Post id where the comment is located is after the # in id
    const route = '/post/'+e.currentTarget.getAttribute('id').split('#')[1];
    console.log(route)

    navigate(route);
  }

  useEffect(() => {

    const username = loc.pathname.split('/')[2];
    console.log(loc.pathname.split('/')[2])

    fetch ('http://localhost:5000/users/profile/'+username, { // Returns posts and comments without the username (obviously as it is the creator profile)
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors', // cors is used in order to allow cross origin requests
      cache: 'default'
    })
    .then(res => {
      if (res.status === 404){
        return {error: 'User not found'}
      }
      return res.json()
    })
    .then(data => {
      if (data.error){
        setError(data.error);
        return;
      }

      setUser(data);
      console.log(user)

      setLoading(false);
      checkIfLoggedUser();
    })

  }, [])

  const checkIfLoggedUser = () => {
    const username = loc.pathname.split('/')[2];
    
        console.log(loc.pathname.split('/')[2])
        // Get user from local storage
        const loggedUserJSON = localStorage.getItem('user');
        console.log(loggedUserJSON, 'logged user json')
        if (loggedUserJSON) {
          const LoggedUser = JSON.parse(loggedUserJSON);
          setLoggedUser(LoggedUser);
          if (LoggedUser.username === username){
            setIsLoggedUser(true);
          }
        }
  }

  const bioPressed = () => {
    setAddingBio(true);
    console.log(addingBio)
    if (user.bio) {
      setBio(user.bio);
    }

    console.log('bio pressed')
  }
  const handleChange = (e) => {
    console.log(e.target.name)
    if (e.target.name === 'bio') {
        setBio(e.target.value)
    } 
  }

  const submitBio = (e) => {
    e.preventDefault();
    console.log(user)
    if (bio === '') {
      setAddingBio(false);
      return;
    }

    const jwt = localStorage.getItem('jwt');
    if (jwt === null) {
      navigate('/login');
      return;
    }
    fetch(' http://localhost:5000/users/update/bio', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': jwt
      },
      body: JSON.stringify({
        bio: bio,
        username: loggedUser.username // This is the username of the user that is logged in
      }),
      mode: 'cors'
    })
    .then(res => {
        if (res.status === 401) {
            console.log('Unauthorized')
            let theresToken = localStorage.getItem('jwt') === null ? false : true;
            if (theresToken) { // Then the token is either expired or invalid 
                localStorage.removeItem('jwt');
                localStorage.removeItem('user'); // If there is a token, then there is a user with it
            }
            navigate('/login')
          }
          return res.json();
    })
    .then(data => {
      if (data.success) {
        console.log('bio updated')
        setAddingBio(false);
        setUser(data.user);
        window.location.reload();
      }
    })


    console.log(bio)
  }
  return (
    <>
      {loading && !error && (
        <div className="profile">
          <h2>Loading...</h2>
        </div>
      )}
      {user && (
        <div className="profile">
          <h2>{user.Username}</h2>
          {//https://momentjs.com/docs/
          }
          <p>{"User registered on: " + moment(user.DateCreated).format('MMMM Do YYYY, h:mm:ss a').replace('T', ' ').split('.')[0]}</p>
          <p>{user.Bio}</p>
          {addingBio && (
            <div className="bio-form">
              <form onChange={handleChange} onSubmit={submitBio}>
                <div className="input-field">
                  <input name="bio" type="text" id="bio"  />
                </div>
                <button className="btn">Submit Bio</button>
              </form>
            </div>
            )
          }
          {isLoggedUser && user.Bio && !addingBio && (
            <button className="btn" onClick={bioPressed}> Edit Bio </button>
          )}
          {isLoggedUser && !user.Bio && !addingBio && (
            <button className="btn" onClick={bioPressed}> Add Bio </button>
          )}

          <div className="profile-content row">
            <div className="col s12 l6">
              <h2> User posts </h2>
              {user.Posts.length > 0 && <PostPreview posts={user.Posts} clicked={post_clicked} />}
              
            </div>
            <div className="col s12 l6">
              <h2>User comments</h2>
              <Comments comments={user.Comments} clicked={comment_clicked} classes={"profile-comment"}/>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="profile">
          <h2>{error}</h2>
        </div>
      )}
    </>
  )
}

export default Profile