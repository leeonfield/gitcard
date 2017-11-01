import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Link,
  Route
} from "react-router-dom"
import Axios from 'axios'
import Cookie from 'js-cookie'

import API from './utils/api.jsx'

import SideMenu from './components/layouts/SideMenu.jsx'
import Header from './components/layouts/Header.jsx'
import UserDetail from './components/UserDetail'
import Comments from './components/Comments'
import Events from './components/Events'
import HomePage from './components/HomePage'
const access_token = Cookie.get('access_token');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginInfo: {}
    }
  }

    getLoginInfo() {
        let that = this;
        let url = API.GITHUB.GET_LOGIN_INFO;
        Axios.get(url, {
            params: {
                access_token: access_token
            }
        }).then(function(res) {
            that.setState({
                loginInfo: res.data,
            });
        }).catch(function (error) {
            console.error(error);
          })
    }

    componentDidMount() {
        if(access_token) {
            this.getLoginInfo();
        }
    }

  render() {
    return (
      <Router>
        <div className="App">
            <Header loginInfo={this.state.loginInfo}></Header>
            <div className="layout-container">
                <div className="layout-content">
                  <Route exact path="/" component={ HomePage } ></Route>
                  <Route path="/user/:userid" component={ UserDetail } ></Route>
                  <Route path="/events" component={Events}></Route>
                  <Route path="/comments" render={ ()=><Comments loginInfo={this.state.loginInfo} /> }></Route>
                </div>
            </div>
        </div>
      </Router>
    );
  }
}

export default App;
