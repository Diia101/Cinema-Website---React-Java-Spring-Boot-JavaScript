import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import LoginComponent from "./components/login/LoginComponent";
import RegistrationComponent from "./components/registration/RegistrationComponent";
import ListUserComponent from "./components/user/ListUserComponent";
import ListMovieComponent from "./components/movie/ListMovieComponent";
import NavbarComponent from './components/navbar/NavbarComponent';

import Swal from "sweetalert2";
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

function App() {
  useEffect(() => {
    socket.on('user_notification', (message) => {
      const notificationMessage = `Notification: ${message}`;
      Swal.fire({
        position: 'top',
        icon: 'warning',
        title: notificationMessage,
        showConfirmButton: false,
        timer: 1500
      });
    })

    socket.on('loggedUsers', (onlineUsers) => {
      const notificationMessage = `No of users logged in now: ${onlineUsers}`;

      alert(notificationMessage);
    })

    socket.on('userHasLoggedIn', (username) => {
      if (localStorage.role === "ADMIN") {
        alert(`The user ${username} has logged in!`);
      }
    })

    socket.on('userHasLoggedOut',() => {
      if (localStorage.role === "ADMIN") {
        alert(`A user has logged out!`);
      }
    })

    socket.on('movie_notification', (message) => {
      if (localStorage.token) {
        console.log('localstorage', localStorage.token)
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: message,
        showConfirmButton: false,
        timer: 4000
      });
      }

    })
  }, []);

  return (
    <Router>
      {/* <NavbarComponent/> */}
      <div className='main-container'>
        <NavbarComponent/>
        <div className="router-components">
        <Routes>
          <Route path="/" element={<LoginComponent/>}></Route>
          <Route path="/login" element={<LoginComponent/>}></Route>
          <Route path="/registration" element={<RegistrationComponent/>}></Route>
          <Route path="/users" element={<ListUserComponent/>}></Route>
          <Route path="/movies" element={<ListMovieComponent/>}></Route>
          <Route path="/projections" element={<ListMovieComponent/>}></Route>
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
