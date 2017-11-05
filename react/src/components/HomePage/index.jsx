import React, { Component } from 'react';
import Cookie from 'js-cookie'
import { Link } from 'react-router-dom'
import Moment from 'moment'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';

import Axios from 'axios'
import API from '../../utils/api.jsx'
import { getNextKey } from '../../utils/keygen'

const access_token = Cookie.get('access_token');
const style = {
    Header: {
        color: '#FF4081'
    },
    Avatar: {
        marginLeft: '20px',
        marginTop: '10px'
    }
}

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUserList: []
        }
    }
/**
 * 获取全部授权用户
 */
    getAuthUser() {
        let that = this;
         Axios.get(API.GITCARD.GET_AUTH_UER).then(function(res) {
           that.setState({
            'authUserList': res.data.data
           })
        }).catch(function (error) {
            console.error(error);
          })
    }

    componentDidMount() {
        document.title = 'Home · GitCard';
        this.getAuthUser();
    }
/**
 * client_id 是 github 应用提供的 code
 */
    login() {
      window.location.href = "https://github.com/login/oauth/authorize?client_id=&scope=user:email&scope=user:follow";
    }

    render() {
        let authUserNode = [];
        let that = this;
        this.state.authUserList.forEach(function(item) {
                authUserNode.push(<Link style={style.Avatar} to={'/user/' + item.login} key={ getNextKey() }>
                     <Avatar src={item.avatar_url} size={50}/>
                  </Link>)
        })
        return(
              <MuiThemeProvider>
                <div>
                    <h2 style={style.Header}>Reacent</h2>
                    <div>
                        { authUserNode }
                    </div>
                </div>
              </MuiThemeProvider>)
    }
}
export default HomePage;
