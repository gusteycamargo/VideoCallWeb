import React, { Component } from 'react';
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

class Call extends Component {
    state = {
        session: null,
        isConnectedToChat: false,
        isLogging: false,
        userLogged: null,
        userToCall: [],
        showVideoChat: false,
        micDisabled: true,
        swithCamDisabled: true,
        shareDisable: false,
        showModal: false,
        classMic: '',
        connecting: true
    }
  
  callingAudio = new Audio("https://soundcloud.com/gustavo-camargo-560621425/calling")
  dialingAudio = new Audio("https://soundcloud.com/gustavo-camargo-560621425/dialing")
  endCallAudio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")

  componentDidMount() {
    console.log(this.props.showModal);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.showModal !== this.props.showModal) {
        this.setState({
            showModal: this.props.showModal,
        })
    }
    if(prevProps.userToCall !== this.props.userToCall) {
        this.setState({
            userToCall: this.props.userToCall,
            showVideoChat: true
        })
    }
  }

  login = async currentUser => {
    const _onSuccessLogin = async (value) => {
      this.setState({ isConnectedToChat: true, userLogged: currentUser, isLogging: false })
      this.getUsersToCall()
      this._setUpListeners()
    };

    const _onFailLogin = async (error = {}) => {
      console.log(error);
      this.setState({ isLogging: false })
      alert('Houve um erro ao realizar o seu login')
    };
    this.setState({ isLogging: true })
    AuthService.login({ login: currentUser.login, password: currentUser.password })
      .then(_onSuccessLogin)
      .catch(_onFailLogin)
  };

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async getUsersToCall() {
    const usersForSelect = users.filter(({ id }) => this.state.userLogged.id !== id);
    await this.setStateAsync({ userToCall: usersForSelect[0] })
  }

  _setUpListeners() {
    ConnectyCube.videochat.onCallListener = this._onCallListener.bind(this);
    ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener.bind(this)
    ConnectyCube.videochat.onStopCallListener = this._onStopCallListener.bind(this);
    ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener.bind(this);
    ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener.bind(this);
    ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener.bind(this);
    ConnectyCube.videochat.onDevicesChangeListener = this._onDevicesChangeListener.bind(this);
  }

  _onDevicesChangeListener() {
    const enable = CallService.onDevicesChangeListener()
    if(!enable) {
      this.setState({ swithCamDisabled: false })
    }
    else {
      this.setState({ swithCamDisabled: true })
    }
  }

  startCall() {
    this._dialing.play()
    let opponent = [{ id: this.state.userToCall.id, name: this.state.userToCall.name }]
    let opponentsIds = [this.state.userToCall.id]
    CallService.startCall(opponent, opponentsIds, this.setState({ showVideoChat: true }))
    this._onDevicesChangeListener()
  }

  rejectCall() {
      CallService.rejectCall()
      this.setState({ showModal: false })
      this._calling.pause()
  }

  acceptCall() {
      CallService.acceptCall()
      this.setState({ showModal: false, showVideoChat: true })
      this._calling.pause()
  }

  _onUserNotAnswerListener(session, userId) {
    CallService.onUserNotAnswerListener(session, userId)
    .then(() => { 
        this.setState({ showModal: false, showVideoChat: false }) 
        this._calling.pause()
    })
    .catch(error => console.log(error))
  }

  _onAcceptCallListener(session, userId, extension) {
      CallService.onAcceptCallListener(session, userId, extension)
      .then(() => { 
          this.setState({ showModal: false, showVideoChat: true }); 
          this._calling.pause()
          this._dialing.pause()
        })
      .catch(error => console.log(error))
  }

  _onRejectCallListener(session, userId, extension) {
    CallService.onRejectCallListener(session, userId, extension)
    .then(() => { 
        this.setState({ showModal: false }) 
        this._calling.pause()
        this._dialing.pause()
    })
    .catch((error) => {  console.log(error) })
  }

  _onCallListener(session, extension) {
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
                this.setState({ userToCall: result.items[0].user.full_name })
              }
            }
          });
          this.setState({ showModal: true }) 
          //this._calling.play()
      })
      .catch((error) => {  console.log(error) })
  }

  _onStopCallListener(session, userId, extension) {
      CallService.onStopCallListener(session, userId, extension)
      .then(() => { 
          this.setState({ showModal: false, showVideoChat: false }) 
          this._calling.pause()
        })
      .catch((error) => {  console.log(error) })
  }

  _onRemoteStreamListener(session, userId, stream) {
      this.setState({ connecting: true })
      CallService.onRemoteStreamListener(session, userId, stream)
      .then(() => {
          this.setState({ micDisabled: false, connecting: false })
      })
      .catch(error => {
          console.log(error)
    }) 
  }

  stopCall() {
    CallService.stopCall()
    this._calling.pause()
    this._dialing.pause()
    this._endAudio.play()
    this.setState({ showVideoChat: false, micDisabled: true, swithCamDisabled: true, shareDisable: false })
  }

  muteUnmute() {
    const result = CallService.setAudioMute()
    this.setState({ classMic: result == 'add' ? 'muted' : '' })
  }

  render() {
    const {
      session,
      isConnectedToChat,
      showVideoChat,
      userToCall
    } = this.state;

    return (
        <div id="main">
          {!isConnectedToChat && !showVideoChat ? (
            <section id="login">
              <div id="login-logo">
                <img id="login-image" src={logo} alt="ConnectyCube" />
                {this.state.isLogging ? (
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
                  <button onClick={() => this.login(user)} className={`login-button ${user.name}-bg-color`} data-id={user.id}>Login as {user.name}</button>
                ))}
              </div>
            </section>
          ) : (
            <>
              {showVideoChat ?(
                <section id="videochat">
                  <div id="videochat-streams" className="grid-2-1">
                    <div id={`videochat-stream-container-${this.state.userToCall.id}`} className="videochat-stream-container">
                      {this.state.connecting && (
                        <div id={`videochat-stream-loader-${this.state.userToCall.id}`} className="videochat-stream-loader">
                          <div className="videochat-stream-loader-text">{this.state.userToCall.name} </div>
                          <ClockLoader
                            size={15}
                            color={"#1198d4"}
                            loading={true}
                            css="margin-left: 10px"
                          />
                        </div>
                      )}
                      <video playsInline id={`remoteStream-${this.state.userToCall.id}`} className="videochat-stream" data-id={this.state.userToCall.id}></video>
                    </div>
                    <div id="videochat-local-stream-container" className="videochat-stream-container">
                      <video playsInline id="localStream" className="videochat-stream"></video>
                    </div>
                  </div>
                  <div id="videochat-buttons-container">
                    <button onClick={() => this.muteUnmute()} id="videochat-mute-unmute" className={`videochat-button ${this.state.classMic}`} disabled={this.state.micDisabled}></button>
                    <button onClick={() => this.stopCall()} id="videochat-stop-call" className="videochat-button"></button>
                    <button onClick={() => CallService.switchCamera()} id="videochat-switch-camera" className="videochat-button" disabled={this.state.swithCamDisabled}></button>
                  </div>
                </section>
              ) : (
                <section id="call">
                  <div id="call-select-users">
                  <h2 id="select-header">{`Deseja ligar para ${userToCall.name}?`}</h2>
                  </div>
                  {!showVideoChat && (
                    <div id="call-buttons-container">
                      <button onClick={() => this.startCall()} id="call-start" className="call-button"></button>
                    </div>
                  )}
                  {this.state.showModal && (
                    <>
                      <div id="call-icoming"></div>
                      <div id="call-modal-icoming" className="show" tabIndex="-1">
                        <div className="call-modal-header">Recebendo chamada de <strong id="call-modal-initiator">{this.state.userToCall.name}</strong></div>
                        <div className="call-modal-footer">
                          <button id="call-modal-reject" onClick={() => this.rejectCall()} className="call-modal-button" type="button">Reject</button>
                          <button id="call-modal-accept" onClick={() => this.acceptCall()} className="call-modal-button" type="button">Accept</button>
                        </div>
                      </div>
                    </>
                  )}
                </section>
              )}
            </>
          )}
          
          <div id="snackbar"></div>

          <audio ref={(e) => this._endAudio = e} id="signal-end" preload="auto">
            <source src={end_call} type="audio/mp3" />
          </audio>

          <audio ref={(a) => this._dialing = a} id="signal-out" loop preload="auto">
            <source src={dialing} type="audio/mp3" />
          </audio>

          <audio ref={(c) => this._calling = c} id="signal-in" loop preload="auto">
            <source src={calling} type="audio/mp3" />
          </audio>
        </div>
    );
  }
}

export default connect(state => ({
  showModal: state.videoCall.showModal,
  userToCall: state.videoCall.userToCall
}))(Call)