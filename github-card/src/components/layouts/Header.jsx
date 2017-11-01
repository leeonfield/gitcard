import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router-dom'

import Avatar from 'material-ui/Avatar';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const style = {
  AppBar: {
    background: '#ffffff',
    color: '#ccc'
  }
};

class Login extends Component {
    login() {
      window.location.href = "https://github.com/login/oauth/authorize?client_id=9ac7f7243db6efac3114&scope=user:email&scope=user:follow";
    }
    render() {
      return ( <FlatButton label="Login" onClick={this.login} primary={true} />);
    }
}

class Logged extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<Link to={"/user" + (this.props.loginInfo ? ('/' + this.props.loginInfo.login) : '/' )}>
                    <Avatar src={this.props.loginInfo.avatar_url} size={50}/>
                </Link>)
    }
};

class SlideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }
    handleTouchTap = (event) => {
        event.preventDefault();
        this.setState({
                open: true,
                anchorEl: event.currentTarget,
            });
    };
    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    login() {
      window.location.href = "https://github.com/login/oauth/authorize?client_id=9ac7f7243db6efac3114&scope=user:email&scope=user:follow";
    }

    render() {
            return(<div>
                      <FlatButton label="Menu" onClick={this.handleTouchTap} secondary={true} />
                      <Popover
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={this.handleRequestClose}
                        animation={PopoverAnimationVertical}
                      >
                        <Menu>
                          <Link to="/">
                            <MenuItem primaryText="Home" />
                          </Link>
                          <Link to="/comments">
                            <MenuItem primaryText="Comments"/>
                          </Link>
                          {
                            this.props.loginInfo.login ?
                              (<Link to={  '/user/' + this.props.loginInfo.login }>
                                <MenuItem primaryText="Detail" />
                              </Link>)
                              : (<MenuItem primaryText="Login" onClick={this.login} />)
                          }

                        </Menu>
                      </Popover>
                  </div>)
        }
}

class Header extends Component {
constructor(props) {
    super(props);
}
    render() {
        return ( 
              <MuiThemeProvider>
                    <AppBar 
                    style={style.AppBar}
                    title="GitCard" 
                    iconElementLeft={ <SlideMenu loginInfo={this.props.loginInfo} />}
                    iconElementRight={this.props.loginInfo.login ? <Logged loginInfo={this.props.loginInfo} /> : <Login />} />
              </MuiThemeProvider>);
    }
}

export default Header;