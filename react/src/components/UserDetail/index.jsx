import React, { Component } from 'react';
import Cookie from 'js-cookie'
import { Link } from 'react-router-dom'
import Moment from 'moment'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import Axios from 'axios'
import API from '../../utils/api.jsx'
import { getNextKey } from '../../utils/keygen'

const access_token = Cookie.get('access_token');

const style = {
    CardContainer: {
        display: 'flex',
        width: '100%',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
    Card: {
        width: '45%',
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'flex-start',
    },
    followCard: {
        width: '30%',
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'flex-start',
    },
    CardHeader: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '10px 10px',
        textAlign: 'left'
    },
    CardChildren: {
        width: '100%'
    },
    CardText: {
        margin: '10px 0px',
        padding: '0px 20px',
    },
    Header: {
        display: 'flex',
        width: '100%',
        flexWrap: 'normal',
        flexShrink: '0',
        justifyContent: 'space-between'
    }
}

class UserDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginInfo: {},
            userInfo: {},
            repository: [],
            star: [],
            follower: [],
            following: [],
            snackOpen: false,
            snackText: ''
        }
    }
    
    getInfoList(content, url) {
        let that = this;
         Axios.get(url, {
            params: {
                access_token: access_token
            }
        }).then(function(res) {
            switch(content) {
                case 'following':
                    that.checkIsFollowing(res.data);
                    that.setState({
                        'following': res.data,
                    })
                    break;
                case 'follower':
                    that.checkIsFollowing(res.data);
                    that.setState({
                        'follower': res.data,
                    })
                    break;
                case 'star':
                    that.setState({
                        'star': res.data,
                    })
                    break;
                case 'repository':
                    that.setState({
                        'repository': res.data,
                    })
                    break;
            }
        }).catch(function (error) {
            console.error(error);
          })
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
    componentWillReceiveProps(nextProps){
        const userId = nextProps.match.params.userid;
        let that = this;
        let url = userId ? (API.GITHUB.GET_USER_INFO +'/' + userId) : API.GITHUB.GET_USER_INFO;
        Axios.get(url, {
            params: {
                access_token: access_token
            }
        }).then(function(res) {
            that.setState({
                userInfo: res.data,
            });
            that.getInfoList('following', res.data.following_url.split('{')[0]);
            that.getInfoList('follower', res.data.followers_url);
            that.getInfoList('star', res.data.starred_url.split('{')[0]);
            that.getInfoList('repository', res.data.repos_url);
        }).catch(function (error) {
            console.error(error);
          })
    }

    componentDidMount() {
        document.title = this.props.match.params.userid + ' · GitCard';
        const userId = this.props.match.params.userid;
        if(access_token) {
            this.getLoginInfo();
        }
        let that = this;
        let url = userId ? (API.GITHUB.GET_USER_INFO +'/' + userId) : API.GITHUB.GET_USER_INFO;
        Axios.get(url, {
            params: {
                access_token: access_token
            }
        }).then(function(res) {
            that.setState({
                userInfo: res.data,
            });
            that.getInfoList('following', res.data.following_url.split('{')[0]);
            that.getInfoList('follower', res.data.followers_url);
            that.getInfoList('star', res.data.starred_url.split('{')[0]);
            that.getInfoList('repository', res.data.repos_url);
        }).catch(function (error) {
            console.error(error);
          })
    }

    unFollow(userId) {
        let that = this;
        let url = API.GITHUB.FOLLOW + userId + '?access_token=' + access_token;
        Axios.delete(url).then(function(res) {
            if(res.status == 204) {
                that.getInfoList('following', that.state.userInfo.following_url.split('{')[0]);
                that.setState({
                    snackOpen: true,
                    snackText: '取消关注成功'
                })
            } else {
                that.setState({
                    snackOpen: true,
                    snackText: '网络有点慢'
                })
            }
        }).catch(function (error) {
            console.error(error);
          })
    }

    follow(userId) {
        let that = this;
        let url = API.GITHUB.FOLLOW + userId + '?access_token=' + access_token;
        Axios.put(url).then(function(res) {
            if(res.status == 204) {
                that.getInfoList('following', that.state.userInfo.following_url.split('{')[0]);
                that.setState({
                    snackOpen: true,
                    snackText: '关注成功'
                })
            } else {
                that.setState({
                    snackOpen: true,
                    snackText: '网络有点慢'
                })
            }
        }).catch(function (error) {
            console.error(error);
          })
    }

    checkIsFollowing(Array) {
        let that = this;
        for(let i = 0; i < Array.length; i++) {
            let url = API.GITHUB.FOLLOW + Array[i]['login'] + '?access_token=' + access_token;
            Axios.get(url).then(function(res) {
                if(res.status == 204) {
                    Array[i]['isFollowing'] = true;
                } else {
                    Array[i]['isFollowing'] = false;
                }
            }).catch(function (error) {
                console.error(error);
              })
        }
    }

    handleSnackClose() {
        this.setState({
            snackOpen: false
        })
    }

    render() {
        let data = this.state.userInfo;
        let followingNode = [], followerNode = [], repositoryNode = [];
        let that = this;
        this.state.following.forEach(function(item) {
            followingNode.push(<Card  style={style.followCard} key={ getNextKey() }  containerStyle={style.CardChildren} >
                                        <div style={style.Header}>
                                            <Link to={'/user/' + item.login}>
                                                <CardHeader title={item.login} textStyle={{padding: '0px'}} titleStyle={{padding: '0px'}} avatar={item.avatar_url}/>
                                            </Link>
                                            {item.isFollowing ? <FlatButton label="Unfollow" onClick={that.unFollow.bind(that, item.login)} /> : <FlatButton label="follow" secondary={true} onClick={that.follow.bind(that, item.login)} />}
                                        </div>
                                        <CardText style={style.CardText}>
                                            <div><a href={item.html_url}>Github</a></div>
                                        </CardText>
                                      </Card>)
        })
        this.state.follower.forEach(function(item) {
            followerNode.push(<div key={ getNextKey()} style={{width:'10%'}}>
                                    <div><Link to={'/user/' + item.login}>{item.login}</Link> </div>
                                    <div><Avatar src={item.avatar_url} size={50}/> </div>
                                </div>)
        })
        this.state.repository.forEach(function(item) {
            repositoryNode.push(<Card style={style.Card} key={ getNextKey() }  containerStyle={style.CardChildren} >
                                      <CardTitle title={item.name} subtitle={item.description} />
                                    <CardText style={style.CardText}>
                                        <div>Language：{ item.language }</div>
                                        <div>Star: {item.stargazers_count}</div>
                                        <div>Fork: {item.forks_count}</div>
                                        <a href={item.homepage}>Github</a>
                                        <div>Create: {Moment(item.created_at).format('YYYY-MM-DD HH:mm')}</div>
                                        <div>Update: {Moment(item.updated_at).format('YYYY-MM-DD HH:mm')}</div>
                                    </CardText>
                                  </Card>)
        })

        return(<MuiThemeProvider>
                    <div>
                        <div>
                              <Avatar
                                  src={data.avatar_url}
                                  size={100}
                                />
                                <div>{data.name}</div>
                                <div>{data.login}</div>
                        </div>
                        <div>
                            <h3>Reposities</h3>
                            <div style={ style.CardContainer }>
                                { repositoryNode }
                            </div>
                        </div>
                        <div>
                            <h3>Following</h3>
                            <div style={ style.CardContainer }>
                                { followingNode }
                            </div>
                        </div>
                        <div>
                        <h3>Follower</h3>
                            <div style={ style.CardContainer }>
                            { followerNode }
                            </div>
                        </div>
                    <Snackbar
                      open={this.state.snackOpen}
                      message={this.state.snackText}
                      autoHideDuration={3000}
                      onRequestClose={this.handleSnackClose.bind(this)}
                    />
                    </div>
                </MuiThemeProvider>)
    }
}


export default UserDetail;