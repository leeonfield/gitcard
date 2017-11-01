import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import FontIcon from 'material-ui/FontIcon';

const style = {
  paper: {
    display: 'inline-block',
    margin: '16px 32px 16px 0'
  }
};

class SideMenu extends Component {

    constructor(props) {
      super(props);
    }

    componentDidMount() {
      
    }

    render() {
      return (
              <MuiThemeProvider>
                <Paper style={style.paper}>
                  <Menu>
                  <Link to="/events">
                    <MenuItem primaryText="Events" />
                  </Link>
                  <Link to="/connections">
                    <MenuItem primaryText="Connections"/>
                  </Link>
                  <Link to={"/user" + (this.props.userInfo ? ('/' + this.props.userInfo.login) : '/' )}>
                    <MenuItem primaryText="Detail" />
                  </Link>
                  </Menu>
                </Paper>

              </MuiThemeProvider>);
    }

}

export default SideMenu;