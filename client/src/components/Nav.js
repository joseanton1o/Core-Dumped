import React from 'react'
import { Link } from 'react-router-dom';
const Nav = ({jwt}) => {

  
  return (
    <>
    <nav>
      <div className='red nav-wrapper'>
        <Link to="/" className='brand-logo center'>Core Dumped Exception</Link>
        <a to='#' data-target="mobile-demo" className='sidenav-trigger'><i className="material-icons">menu</i></a>
        <ul className='right hide-on-med-and-down'>
          { !jwt && 
            <li><Link to="/login">Login</Link></li>
          }
          {!jwt && 
          <li><Link to="/register">Register</Link></li>
          }
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