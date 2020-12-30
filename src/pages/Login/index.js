import React, { useEffect, useRef, useState } from 'react';
import logo from '../../images/logo.png';
import '../../styles/index.css';
import { users } from "../../config";
import { AuthService, CallService } from '../../services';
import { connect } from 'react-redux';
import ConnectyCube from 'connectycube';
import dialing from "../../audio/dialing.mp3"
import calling from "../../audio/calling.mp3"
import end_call from "../../audio/end_call.mp3"
import ClockLoader from "react-spinners/ClockLoader";

function Login() {
  const [session, setSession] = useState(null)
  const [isConnectedToChat, setIsConnectedToChat] = useState(false)
  const [isLogging, setIsLogging] = useState(false)
  const [userLogged, setUserLogged] = useState(null)
  const [userToCall, setUserToCall] = useState([])
  const [showVideoChat, setShowVideoChat] = useState(false)
  const [micDisabled, setMicDisabled] = useState(true)
  const [swithCamDisabled, setSwithCamDisabled] = useState(true)
  const [shareDisable, setShareDisable] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [classMic, setClassMic] = useState('')
  const [connecting, setConnecting] = useState(true)

  const _dialing = useRef(null)
  const _calling = useRef(null)
  const _endAudio = useRef(null)

  // useEffect(() => {
  //   _setUpListeners()
  // }, [])

  // useEffect(() => {
  //   //VER AS PROPS VINDAS DO REDUX
  //   if(showModal) {
  //     setShowModal(showModal) // essa show modal veio do redux, pegar de la
  //   }
  //   if(userToCall) {
  //     setUserLogged(userToCall) //prop vinda do redux tbm
  //     setShowVideoChat(true)
  //   }
  // }, [showModal, userToCall])

  useEffect(() => {
    if(userLogged) {
      getUsersToCall()
    }
  }, [userLogged])

  async function login(currentUser) {
    const _onSuccessLogin = async (value) => {
      setIsConnectedToChat(true);
      setUserLogged(currentUser);
      setIsLogging(false)

      _setUpListeners()
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

  async function getUsersToCall() {
    const usersForSelect = users.filter(({ id }) => userLogged.id !== id);
    setUserToCall(usersForSelect[0])
  }

  function _setUpListeners() {
    ConnectyCube.videochat.onCallListener = onCallListener
    ConnectyCube.videochat.onAcceptCallListener = onAcceptCallListener
    ConnectyCube.videochat.onStopCallListener = onStopCallListener
    ConnectyCube.videochat.onRemoteStreamListener = onRemoteStreamListener
    ConnectyCube.videochat.onRejectCallListener = onRejectCallListener
    ConnectyCube.videochat.onUserNotAnswerListener = onUserNotAnswerListener
    ConnectyCube.videochat.onDevicesChangeListener = onDevicesChangeListener
  }

  function onDevicesChangeListener() {
    const enable = CallService.onDevicesChangeListener()
    if(!enable) {
      setSwithCamDisabled(false)
    }
    else {
      setSwithCamDisabled(true)
    }
  }

  function startCall() {
    _dialing.current.play()
    let opponent = [{ id: userToCall.id, name: userToCall.name }]
    let opponentsIds = [userToCall.id]
    CallService.startCall(opponent, opponentsIds, setShowVideoChat(true))
    onDevicesChangeListener()
  }

  function rejectCall() {
      CallService.rejectCall()
      setShowModal(false)
      _calling.current.pause()
  }

  function acceptCall() {
      CallService.acceptCall()
      setShowModal(false)
      setShowVideoChat(true)
      _calling.current.pause()
  }

  function onUserNotAnswerListener(session, userId) {
    CallService.onUserNotAnswerListener(session, userId)
    .then(() => { 
      setShowModal(false)
      setShowVideoChat(false)
      _calling.current.pause()
    })
    .catch(error => console.log(error))
  }

  function onAcceptCallListener(session, userId, extension) {
      CallService.onAcceptCallListener(session, userId, extension)
      .then(() => { 
        setShowModal(false)
        setShowVideoChat(true)
        _calling.current.pause()
        _dialing.current.pause()
        })
      .catch(error => console.log(error))
  }

  function onRejectCallListener(session, userId, extension) {
    CallService.onRejectCallListener(session, userId, extension)
    .then(() => { 
      setShowModal(false)
      setShowVideoChat(false)
      _calling.current.pause()
      _dialing.current.pause()
    })
    .catch((error) => {  console.log(error) })
  }

  function onCallListener(session, extension) {
      CallService.onCallListener(session, extension)
      .then(() => { 
          ConnectyCube.users.get({ 
            filter: {
              field: "id",
              param: "in",
              value: [session.initiatorID],
            }
           }, (error, result) => {
            if(!error && result) {
              if(result.items.lenght > 0) {
                result.items[0].user.name = result.items[0].user.full_name
                setUserToCall(result.items[0].user.full_name)
              }
            }
          });
          setShowModal(true)
          _calling.current.play()
      })
      .catch((error) => {  console.log(error) })
  }

  function onStopCallListener(session, userId, extension) {
      CallService.onStopCallListener(session, userId, extension)
      .then(() => { 
        setShowModal(false)
        setShowVideoChat(false)
        _calling.current.pause()
      })
      .catch((error) => {  console.log(error) })
  }

  function onRemoteStreamListener(session, userId, stream) {
    setConnecting(true)
    CallService.onRemoteStreamListener(session, userId, stream)
    .then(() => {
      setMicDisabled(false)
      setConnecting(false)
    })
    .catch(error => {
      console.log(error)
    }) 
  }

  function stopCall() {
    CallService.stopCall()
    _calling.current.pause()
    _dialing.current.pause()
    _endAudio.current.play()
    setShowVideoChat(false)
    setMicDisabled(true)
    setSwithCamDisabled(true)
    setShareDisable(false)
  }

  function muteUnmute() {
    const result = CallService.setAudioMute()
    setClassMic(result == 'add' ? 'muted' : '')
  }

  return (
      <div id="main">
        {!isConnectedToChat && !showVideoChat ? (
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
        ) : (
          <>
            {showVideoChat ?(
              <section id="videochat">
                <div id="videochat-streams" className="grid-2-1">
                  <div id={`videochat-stream-container-${userToCall.id}`} className="videochat-stream-container">
                    {connecting && (
                      <div id={`videochat-stream-loader-${userToCall.id}`} className="videochat-stream-loader">
                        <div className="videochat-stream-loader-text">{userToCall.name} </div>
                        <ClockLoader
                          size={15}
                          color={"#1198d4"}
                          loading={true}
                          css="margin-left: 10px"
                        />
                      </div>
                    )}
                    <video playsInline id={`remoteStream-${userToCall.id}`} className="videochat-stream" data-id={userToCall.id}></video>
                  </div>
                  <div id="videochat-local-stream-container" className="videochat-stream-container">
                    <video playsInline id="localStream" className="videochat-stream"></video>
                  </div>
                </div>
                <div id="videochat-buttons-container">
                  <button onClick={() => muteUnmute()} id="videochat-mute-unmute" className={`videochat-button ${classMic}`} disabled={micDisabled}></button>
                  <button onClick={() => stopCall()} id="videochat-stop-call" className="videochat-button"></button>
                  <button onClick={() => CallService.switchCamera()} id="videochat-switch-camera" className="videochat-button" disabled={swithCamDisabled}></button>
                </div>
              </section>
            ) : (
              <section id="call">
                <div id="call-select-users">
                <h2 id="select-header">{`Deseja ligar para ${userToCall.name}?`}</h2>
                </div>
                {!showVideoChat && (
                  <div id="call-buttons-container">
                    <button onClick={() => startCall()} id="call-start" className="call-button"></button>
                  </div>
                )}
                {showModal && (
                  <>
                    <div id="call-icoming"></div>
                    <div id="call-modal-icoming" className="show" tabIndex="-1">
                      <div className="call-modal-header">Recebendo chamada de <strong id="call-modal-initiator">{userToCall.name}</strong></div>
                      <div className="call-modal-footer">
                        <button id="call-modal-reject" onClick={() => rejectCall()} className="call-modal-button" type="button">Reject</button>
                        <button id="call-modal-accept" onClick={() => acceptCall()} className="call-modal-button" type="button">Accept</button>
                      </div>
                    </div>
                  </>
                )}
              </section>
            )}
          </>
        )}
        
        <div id="snackbar"></div>

        <audio ref={_endAudio} id="signal-end" preload="auto">
          <source src={end_call} type="audio/mp3" />
        </audio>

        <audio ref={_dialing} id="signal-out" loop preload="auto">
          <source src={dialing} type="audio/mp3" />
        </audio>

        <audio ref={_calling} id="signal-in" loop preload="auto">
          <source src={calling} type="audio/mp3" />
        </audio>
      </div>
  );
}

export default connect(state => ({
  showModal: state.videoCall.showModal,
  userToCall: state.videoCall.userToCall
}))(Login)