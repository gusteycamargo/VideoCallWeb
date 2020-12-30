import React, { Component } from 'react';
import logo from './images/logo.png';
import './styles/index.css';
// import CallService from "./call-service";
// import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css'
import { users } from "./config";
import { AuthService, CallService } from './services';
import { Provider, connect } from 'react-redux';
import store from './store/index';
import Login from './pages/Login';

class App extends Component {

  componentDidMount() {
    AuthService.init()
  }

  render() {

    return (
      <Provider store={store}>
        <Login/>
      </Provider>
    );
  }
}

export default App