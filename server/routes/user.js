const mUser = require('../model/user.js');
const bcrypt = require('bcryptjs');
const rp = require('request-promise')

const saltRounds = 10;

exports.signup = async function(ctx, next) {
    const userData = ctx.request.body;
    const user = await mUser.findOne({
        email: userData.email
    });
    if (user) {
        ctx.body = {
            status: 10000,
            error: "Email already existed"
        };
    } else {
        userData.password = bcrypt.hashSync(userData.password, saltRounds);
        const newUser = await mUser.save(userData);
        if (newUser) {

            ctx.body = {
                status: 0,
                error: "Signup success"
            };
        } else {
            ctx.body = {
                status: 10001,
                error: "Network error, try again"
            };
        }
    }
};

exports.login = async function(ctx, next) {
    const _user = ctx.request.body;
    console.log(_user);
    const user = await mUser.findOne({
        email: _user.email
    });
    if (user) {
        if (bcrypt.compareSync(_user.password, user.password)) {
            ctx.session.user = user;
            ctx.body = {
                status: 0,
                error: "Login success"
            };
        } else {
            console.log('password is not correct so failed');
            ctx.body = {
                status: 10002,
                error: "Password not correct"
            };
        }
    } else {
        ctx.body = {
            status: 10003,
            error: "Account not exist"
        };
    }
};


/**
 * update user info
 */

exports.update = async function(ctx, next) {
    const userData = ctx.request.body;
    const newUser = await mUser.update(userData);
    if (newUser) {
        ctx.redirect('/');
        this.body = {
            status: 0,
            error: "Update info success"
        };
    } else {
        ctx.redirect('/mine');
        this.body = {
            status: 10001,
            error: "Network error, try again"
        };
    }
};

/**
 * errno:
 * 1: 缺少参数
 * 2: access_token 和 login 不匹配
 * 
 */
exports.checkAuth = async function(ctx, next) {
    const data = ctx.request.body.params;
    if (data["access_token"] && data["login"]) {
        let access_token = data["access_token"];
        let login = data["login"];
        let option = {
                uri: "https://api.github.com/user?access_token=" + access_token,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true
            };
        let loginInfo = await rp(option);
        if(loginInfo.login && loginInfo.login == login) {
            ctx.loginInfo = loginInfo;
            await next();
        } else {
            ctx.body = {
                errno: 2,
                error: "就算请求破喉咙～也无权操作",
                data: {}
            }
        }
    } else {
        ctx.body = {
            errno: 1,
            error: "参数不全",
            data: {}
        }
    }
};




exports.signinRequired = async function(ctx, next) {
    if (!ctx.session.user) {
        ctx.redirect('/login');
    } else {
        await next();
    }
};




exports.renderSignup = async(ctx, next) => {
    if (ctx.session.user) {
        ctx.redirect('/');
    } else {
        await ctx.render('signup');
    }
};

exports.renderLogin = async(ctx, next) => {
    if (ctx.session.user) {
        ctx.redirect('/');
    } else {
        await ctx.render('login');
    }
};

exports.renderMine = async(ctx, next) => {
    let userSession = ctx.session.user;
    const lesson = await mLesson.find({
        tid: userSession._id
    });
    await ctx.render('mine', {
        data: lesson,
        user: userSession
    });
};

exports.renderUpdate = async(ctx, next) => {
    let user = ctx.session.user;
    await ctx.render('updateprofile', {
        user: user
    });
}
