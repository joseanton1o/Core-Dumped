import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';

import M from  'materialize-css/dist/js/materialize.min.js';

const Nav = ({ setJwt, setUser ,jwt,user}) => {

  useEffect(() => {
    // This is used to check if the token is valid, if it is not, then the user is logged out
    let sidenav = document.querySelector('.sidenav');
    M.Sidenav.init(sidenav, {});
    if (jwt !== '' && user !== null)
    {
      console.log('Checking if the token is valid IN THE NAV BAR')
      fetch('http://localhost:5000/users/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwt
        },
        body: JSON.stringify({
          username: user.username
        }),
        mode: 'cors' // because we are using cors in the backend
      })
      .then(res => {
        if (res.status === 401) {
          console.log('Unauthorized')
          let theresToken = localStorage.getItem('jwt') === null ? false : true;
          console.log(theresToken)
          if (theresToken) { // Then the token is either expired or invalid
            localStorage.removeItem('jwt');
            localStorage.removeItem('user'); // If there is a token, then there is a user with it
            setUser(null)
            setJwt('')
          }
        }
        return res.json();
      }
      )
    }
  }, [jwt])

  // This nav bar is used in all the pages. I took it from materializecss.com, i also got help from a video on youtube with link: https://www.youtube.com/watch?v=AhioxFWkYRg&ab_channel=WebZone and to implement it in react from https://medium.com/@elhamza90/react-materialize-sidenav-in-4-steps-7365f6176b09
  return (
    <>
    <nav>
      <div className='red nav-wrapper'>
        <Link to="/" className='brand-logo center'>Core Dumped</Link>
        {
          // a tag is a little trick to make the menu button work, it is not a link, it is a button that opens the menu which i know is not the best way to do it but it works and it is how the materializecss.com nav bar works
        }
        <a to='#' data-target="mobile-demo" className='sidenav-trigger'><i className="material-icons">menu</i></a>
        <ul className='right hide-on-med-and-down'>
          { !jwt && 
            <li><Link to="/login">Login</Link></li>
          }
          {!jwt && 
          <li><Link to="/register">Register</Link></li>
          }
          {jwt &&
          <li><Link to={"/profile/"+user.username}>Profile</Link></li>}
          {jwt &&
          <li><Link to="/post/ask">Ask</Link></li>}
          {jwt &&
          <li><Link to="/logout">Log Out</Link></li>}
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </div>
    </nav>
    <ul className='sidenav' id="mobile-demo">
        {
        !jwt && <li><Link to="/login">Login</Link></li>
        }
                  {jwt &&
          <li><Link to={"/profile/"+user.username}>Profile</Link></li>}
          {jwt &&
          <li><Link to="/post/ask">Ask</Link></li>}
          {jwt &&
          <li><Link to="/logout">Log Out</Link></li>}
        {!jwt && <li>
          <Link to="/register">Register</Link>
        </li>}
        <li>
          <Link to="/">Home</Link>
        </li>
    </ul>
    </>
  )
}

export default Nav