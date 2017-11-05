import React, { Component } from 'react';
import Cookie from 'js-cookie'
import { Link } from 'react-router-dom'

import Axios from 'axios'
import API from '../../utils/api.jsx'
import { getNextKey } from '../../utils/keygen'

const access_token = Cookie.get('access_token');

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventsList: []
        }
    }
    
    getEventsList() {
        let that = this;
         Axios.get(API.GITHUB.GET_EVENTS, {
            params: {
                access_token: access_token
            }
        }).then(function(res) {
           that.setState({
            'eventsList': res.data
           })
        }).catch(function (error) {
            console.error(error);
          })
    }

    componentDidMount() {
        document.title = 'Events · GitCard';
        this.getEventsList();
    }



    render() {
        let data = this.state.userInfo;
        let eventsNode = [];
        this.state.eventsList.forEach(function(item) {
            eventsNode.push(<div key={ getNextKey() }>
                                <div>Author:  <Link to={'/user/' + item.actor.login}>{item.actor.login}</Link> </div>
                                <div>avatar: <img style={{ height: "4rem",width: "4rem" }} src={item.actor.avatar_url} alt=""/></div>
                                <div>Type: {item.type}</div>
                            </div>)
        })

        return(<div>
                    <h2>Events</h2>
                    <div>
                         { eventsNode }
                    </div>
                </div>)
    }
}


export default Events;