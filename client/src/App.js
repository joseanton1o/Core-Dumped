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
  const [controlVar, setControlVar] = useState(false);

  
  // https://medium.com/@elhamza90/react-materialize-sidenav-in-4-steps-7365f6176b09
  // and 
  // https://stackoverflow.com/questions/67295681/react-componentdidmount-parsing-error-missing-semicolon
  useEffect(() => {
    // It is mandatory to initialize the sidenav before the setControlVar to false, otherwise the sidenav will not work
    let sidenav = document.querySelector('.sidenav');
    M.Sidenav.init(sidenav, {});

    setControlVar(false);

    console.log(localStorage.getItem("jwt"));
    if (localStorage.getItem("jwt"))
      setJwt(localStorage.getItem("jwt"));
    if (localStorage.getItem("user"))
      setUser(JSON.parse(localStorage.getItem("user")));

    setControlVar(true);
    // Check if the token is valid will be done in the nav bar component as well as in every component that is protected because if the page is not refreshed, the token will not be checked if we do it only in the nav bar

  }, [])
  // I used react router to make the app a single page application
  // https://stackoverflow.com/questions/65687852/fetch-data-inside-useeffect-hook-before-rendering-react, I used this to fetch the local storage data before rendering the app, here it might be a good idea but with a fetch request, it is not a good idea to fetch the data before rendering the app, because it might get stuck in the server side.
  return !controlVar ? null : (
    <Router>
      <div className="App">
        <Nav setJwt={setJwt} setUser={setUser} jwt={jwt} user={user}/>
        <Routes>
          <Route path="/login" element={<Login setJwt={setJwt} setUser={setUser} jwt={jwt}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home user={user} jwt={jwt}/>} />
          <Route path="/post/ask" element={<Ask setUser={setUser} setJwt={setJwt} user={user} jwt={jwt}/>} />
          <Route path="/logout" element={<LogOut/>} />
          <Route path="/post/:id" element={<Post setUser={setUser} setJwt={setJwt} user={user} jwt={jwt}/>}/>
          <Route path="/profile/:username" element={<Profile setUser={setUser} setJwt={setJwt} />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
