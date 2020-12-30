import React, { useState } from 'react';
import logo from '../../images/logo.png';
import '../../styles/index.css';
import { users } from "../../config";
import { AuthService } from '../../services';
import { useDispatch } from 'react-redux';
import ClockLoader from "react-spinners/ClockLoader";
import * as VideoCallActions from '../../store/actions/videoCall';

function Login({ history }) {
  const [isLogging, setIsLogging] = useState(false)
  const dispatch = useDispatch();

  function setUserLogged(userLogged) {
    dispatch(VideoCallActions.setUserLogged(userLogged))
  }

  async function login(currentUser) {
    const _onSuccessLogin = async (value) => {
      setUserLogged(currentUser);
      history.push('/call')
      setIsLogging(false)
    };

    const _onFailLogin = async (error = {}) => {
      console.log(error);
      setIsLogging(false)
      alert('Houve um erro ao realizar o seu login')
    };
    setIsLogging(true)
    AuthService.login({ login: currentUser.login, password: currentUser.password })
      .then(_onSuccessLogin)
      .catch(_onFailLogin)
  }

  return (
      <div id="main">
        <section id="login">
          <div id="login-logo">
            <img id="login-image" src={logo} alt="ConnectyCube" />
            {isLogging ? (
              <div id="login-loader">
                <div id="login-loader-text">Conectando...</div>
                <div id="login-loader-spinner">
                  <ClockLoader
                    size={20}
                    color={"#1198d4"}
                    loading={true}
                    css="margin-left: 10px"
                  />
                </div>
              </div>
            ) : (
              <div id="login-caption">Video Chat</div>
            )}
          </div>
          <div id="login-buttons-container">
            {users.map(user => (
              <button onClick={() => login(user)} className={`login-button ${user.name}-bg-color`} data-id={user.id}>Login as {user.name}</button>
            ))}
          </div>
        </section>
      </div>
  );
}

export default Login