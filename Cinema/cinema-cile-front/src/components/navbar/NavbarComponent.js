import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './NavbarComponent.css'
import LoginService from '../../services/LoginService';
import AlertService from '../../alert/AlertService';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

const NavbarComponent = () => {
    const navigate = useNavigate();

    // useEffect(() => {
    //     setUserRole(localStorage.role);
    //     console.log("localstorage role " + localStorage.role)
    //     console.log("userRole" + userRole)
    //   }, [localStorage.role]);

    const hideMenu = () =>{
        const navLinks = document.getElementById("navLinks");
        navLinks.style.right = "-200px";
        navLinks.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)"; /* da vrati normalno */
    }

    const showMenu = () =>{
        const navLinks = document.getElementById("navLinks");
        navLinks.style.right = "0";
        navLinks.style.boxShadow = "0 0 0 10000px rgba(0,0,0,.50)";
    }

    const sendNotification = () => {
        socket.emit('global_notification', "The movie X is going to start in one hour.")
    }
    const logout = () =>{
        LoginService.logout().then((response) =>{
            let responseFromServer = response.data;
            if(responseFromServer === "valid"){
                socket.emit('userLogout');
                clearLocalStorage();
                AlertService.alertSuccessSignOut();
                setTimeout(()=>{
                    navigate("/login");
                }, 1500)
            }
            else if(responseFromServer === "invalid"){
                alert("Something went wrong!");
            }      
        })
    }

    const clearLocalStorage = () =>{
        localStorage.clear();
    }

  return (
    <>
    <div className='navbar'>
    <Link to='/home' className='nav-logo' >
        <img className='img-logo' src={require('../../images/cinema-logo.png')} alt=''></img>
    </Link>
    <div className='nav-links' id='navLinks'>
        <i id="x-menu"className="fa fa-times" onClick={hideMenu}></i>
        <ul className='nav-ul'>
            {localStorage.role === "ADMIN" && <li className='nav-list-item'>
                <Link to='/movies' className='nav-link'>Movies</Link>
            </li>}
            <li className='nav-list-item'>
                <Link to='/projections' className='nav-link'>Projections</Link>
            </li>
            {localStorage.role === "ADMIN" && <li className='nav-list-item'>
                <Link className='nav-link'>Halls</Link>
            </li>}
            {localStorage.role === "USER" && <li className='nav-list-item'>
                <Link className='nav-link'>My profile</Link>
            </li>}
            {localStorage.role === "ADMIN" && <li className='nav-list-item'>
                <Link to='/users' className='nav-link'>Users</Link>
            </li>}
            {localStorage.role === "ADMIN" && <li className='nav-list-item'>
                <Link to='/reservedtickets' className='nav-link'>Reserved tickets</Link>
            </li>}
            {localStorage.role === "USER" && <li className='nav-list-item'>
                <Link to='/myreservedtickets' className='nav-link'>My reserved tickets</Link>
            </li>}
            <li className='nav-list-item' id='li-loginBtn'>
                {}
                {localStorage.token == null && <div className='signInContainer'>
                    <i id="faLoginBtn" className="fa fa-sign-in" aria-hidden="true"></i>
                    <Link to='/login' className='login-btn'>Sign in</Link>
                </div> }
                {localStorage.token != null  && <div className='signInContainer'>
                    <i id="faLoginBtn" className="fa fa-sign-out" aria-hidden="true"></i>
                    <button className='logout-btn' onClick={() => logout()}>Sign out</button>
                </div> }
            </li>
            <li>
                {localStorage.token && <button className='logout-btn' onClick={() => sendNotification()}>Send notification</button>}
            </li>
        </ul>
    </div>
    <i id="menu" className="fa fa-bars" onClick={showMenu}></i>
</div>
<div className='nav-bottom-line'></div>
</>
  )
}

export default NavbarComponent