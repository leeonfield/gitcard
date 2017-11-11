import React, { Component } from 'react';
import Cookie from 'js-cookie'
import { Link } from 'react-router-dom'
import Moment from 'moment'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


import Axios from 'axios'
import API from '../../utils/api.jsx'
import { getNextKey } from '../../utils/keygen'

import './comment.css'

const access_token = Cookie.get('access_token');
/**
 * style for textField
 * @type {Object}
 */
const style = {
    TextField: {
        width: '60%'
    },
    CardContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    Card: {
        width: '50%',
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
        textAlign: 'left',
        padding: '0px 20px',
    },
    Header: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            commentsList: [],
            errorText: '',
            snackOpen: false,
            snackText: ''
        }
    }
/**
 * 获取全部评论
 * @return {[type]} [description]
 */
    getCommentsList() {
        let that = this;
         Axios.get(API.GITCARD.GET_COMMENT, {
            params: {
                access_token: access_token
            }
        }).then(function(res) {
           that.setState({
            'commentsList': res.data.data
           })
        }).catch(function (error) {
            console.error(error);
          })
    }
/**
 * 创建评论
 * @return {[type]} [description]
 */
    newComment() {
        let that = this;
        if(this.state.comment) {
             Axios.post(API.GITCARD.NEW_COMMENT, {
                params: {
                    access_token: access_token,
                    login: this.props.loginInfo.login,
                    content: this.state.comment
                }
            }).then(function(res) {
                if(!res.errno) {
                    that.setState({
                        comment: ''
                    })
                    that.setState({
                        snackOpen: true,
                        snackText: '👏 发表成功 👏'
                    })
                    that.getCommentsList();
                } else {
                    that.setState({
                        snackOpen: true,
                        snackText: '网络有点慢，重新试试'
                    })
                }
            }).catch(function (error) {
                console.error(error);
            })
        } else {
            this.setState({
                 errorText: "👆 填这里"
            })
        }
    }

    delComment(commentId) {
        let that = this;
        Axios.post(API.GITCARD.DELETE_COMMENT, {
                params: {
                    access_token: access_token,
                    login: this.props.loginInfo.login,
                    _id: commentId
                }
            }).then(function(res) {
                if(!res.errno) {
                    that.setState({
                        snackOpen: true,
                        snackText: '删除成功'
                    })
                    that.getCommentsList();
                } else {
                    that.setState({
                        snackOpen: true,
                        snackText: '网络有点慢，重新试试'
                    })
                }
            }).catch(function (error) {
                console.error(error);
            })
    }

    handleCommentChange(e, newContent) {
        this.setState({
            errorText: "",
            comment: newContent
        })
    }

    handleSnackClose() {
        this.setState({
            snackOpen: false
        })
    }

    componentDidMount() {
        document.title = 'Comments · GitCard';
        this.getCommentsList();
    }

    login() {
      window.location.href = "https://github.com/login/oauth/authorize?client_id=Client_Id&scope=user:email&scope=user:follow";
    }


    render() {
        let commentsNode = [];
        let that = this;
        this.state.commentsList.forEach(function(item) {
            commentsNode.push(<div style={style.CardContainer} key={ getNextKey() }>
                                 <Card className='comment-item' style={style.Card} containerStyle={style.CardChildren} >
                                        <div style={style.Header}>
                                            <Link to={'/user/' + item.login}>
                                             <CardHeader
                                                  title={item.autherName}
                                                  subtitle={ Moment(item.time).format('MM/DD HH:mm') }
                                                  avatar={item.autherImg}
                                                  style={style.CardHeader}
                                                />
                                            </Link>
                                            {(that.props.loginInfo && item.autherId == that.props.loginInfo.login) ? <FlatButton  label="Delete" onClick={that.delComment.bind(that, item._id)} /> : ''}
                                        </div>
                                    <CardText style={style.CardText}>
                                        {item.content}
                                    </CardText>
                                  </Card>
                              </div>)
        })
        return(
              <MuiThemeProvider>
                <div>
                    <h2>Comments</h2>
                    <TextField
                      value={this.state.comment}
                      hintText="积极发言的人运气都不会太差"
                      errorText={this.state.errorText}
                      multiLine={true}
                      rows={1}
                      style={style.TextField}
                      onChange={this.handleCommentChange.bind(this)}
                    />
                    <div>
                    {
                        access_token ? <RaisedButton label="走你" onClick={this.newComment.bind(this)}  primary={true} /> :
                        <RaisedButton label="Login" onClick={this.login} primary={true} />
                    }
                        
                    </div>
                    <div>
                        { commentsNode }
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
export default Comments;