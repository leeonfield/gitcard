const router = require('koa-router')();
const Comment = require('./comment.js');
const User = require('./user.js');
const Home = require('./home.js');
const Scroll = require('./scroll.js');
const Auth = require('./auth.js')





router.get('/', Home.renderIndex)
      .get('/scroll', Scroll.renderScroll)
      .get('/page', User.signinRequired, Comment.renderIndex)
      .get('/login', User.renderLogin)
      .get('/signup', User.renderSignup)
      .post('/signup', User.signup)
      .post('/login', User.login)
      .get('/auth', Auth.getCode)
      .get('/getauthuser', Auth.getAuthUser)
      .post('/newcomment', User.checkAuth, Comment.newComment)
      .post('/delcomment', User.checkAuth, Comment.delComment)
      .get('/getcomment', Comment.getComment)



module.exports = router;
