import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegistrationComponent.css';
import UserService from '../../services/UserService';

const RegistrationComponent = () => {

const [nameSurname, setNameSurname] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [email, setEmail] = useState("");

const navigate = useNavigate();
const [emailValid, setEmailValid] = useState(false);
const [passwordValid, setPasswordValid] = useState(false);

useEffect(() => {
    setEmailValid(email.includes("@"));
},[email]);

useEffect(() => {
    setPasswordValid(password.length >= 8 && password.length <= 15 && password[0] === password[0].toUpperCase())
},[password])




    const submitRegistration = (e) =>{

    e.preventDefault();

    const user = {nameSurname, username, password, email};
        if (emailValid && passwordValid) {
    UserService.register(user).then((response) =>{
      let responseFromServer = response.data.toString();
      if(responseFromServer == "success"){
        alert("User successfully registrated!");
        navigate("/login");
      }
    })
        } else {
            alert("Please make sure email is valid. Please make sure your password has between 8-15 chars. Please make sure your first password letter is capitalized.")
        }

}

  return (
    <div className='registration-box'>
        <div className='registration-label-container'>
          <i id="faRegistration" class="fa fa-user-plus" aria-hidden="true"></i>
          <label className='registrationLabel'>Registration</label>
        </div>
        <form className='registration-form'>
            <input
              className='input'
              type='text'
              placeholder='Name Surname'
              value={nameSurname}
              onChange = {(e) => setNameSurname(e.target.value)}
            >
            </input>
            <input
              className='input'
              type='text'
              placeholder='Username'
              value={username}
              onChange = {(e) => setUsername(e.target.value)}
            >
            </input>
            <input
              className='input'
              type='password'
              placeholder='Password'
              value={password}
              onChange = {(e) => setPassword(e.target.value)}
            >
            </input>
            <input
              className='input'
              type='text'
              placeholder='Email'
              value={email}
              onChange = {(e) => setEmail(e.target.value)}
            >
            </input>
            <button onClick={submitRegistration} className='registrationBtn' type='submit'>Register</button>
        </form>
    </div>
  )
}

export default RegistrationComponent