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
function App() {
  const [jwt, setJwt] = useState("");
  const [user, setUser] = useState(null);
  // https://medium.com/@elhamza90/react-materialize-sidenav-in-4-steps-7365f6176b09
  // and 
  // https://stackoverflow.com/questions/67295681/react-componentdidmount-parsing-error-missing-semicolon
  useEffect(() => {
    let sidenav = document.querySelector('.sidenav');
    M.Sidenav.init(sidenav, {});
  }, [])
  return (
    <Router>
      <div className="App">
        <Nav jwt={jwt} />
        <Routes>
          <Route path="/login" element={<Login setJwt={setJwt} setUser={setUser} jwt={jwt}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home user={user} jwt={jwt}/>} />
          <Route path="/post/ask" element={<Ask user={user} jwt={jwt}/>} />
          <Route path="/post/:id" element={<Post user={user} jwt={jwt}/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
