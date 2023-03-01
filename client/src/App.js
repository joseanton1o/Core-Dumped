import './App.css';
import { useEffect, useState } from 'react';
import Login from './components/Login'
import Register from './components/Register'
import Nav from './components/Nav';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home';
import Post from './components/Post';
import Ask from './components/Ask';
import 'materialize-css/dist/css/materialize.min.css';
import M from  'materialize-css/dist/js/materialize.min.js';
import LogOut from './components/LogOut';
import Profile from './components/Profile';

function App() {
  const [jwt, setJwt] = useState("");
  const [user, setUser] = useState(null);
  
  const refreshJwtandUser = () => {
    console.log("------------------");

    console.log(localStorage.getItem("jwt"));
    if (localStorage.getItem("jwt"))
      setJwt(localStorage.getItem("jwt"));
    if (localStorage.getItem("user"))
      setUser(JSON.parse(localStorage.getItem("user")));
  }

  
  // https://medium.com/@elhamza90/react-materialize-sidenav-in-4-steps-7365f6176b09
  // and 
  // https://stackoverflow.com/questions/67295681/react-componentdidmount-parsing-error-missing-semicolon
  useEffect(() => {
    refreshJwtandUser();
    // Add code here to select the jwt from local storage so that the user doesn't have to login every time they refresh the page

    let sidenav = document.querySelector('.sidenav');
    M.Sidenav.init(sidenav, {});
  }, [])
  // I used react router to make the app a single page application
  return (
    <Router>
      <div className="App">
        <Nav jwt={jwt} user={user} />
        <Routes>
          <Route path="/login" element={<Login setJwt={setJwt} setUser={setUser} jwt={jwt}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home user={user} jwt={jwt}/>} />
          <Route path="/post/ask" element={<Ask user={user} jwt={jwt}/>} />
          <Route path="/logout" element={<LogOut/>} />
          <Route path="/post/:id" element={<Post user={user} jwt={jwt}/>}/>
          <Route path="/profile/:username" element={<Profile />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
