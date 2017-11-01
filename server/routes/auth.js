const Tool = require('../utils/tool.js')
const rp = require('request-promise')
const mAuthUser = require('../model/authuser.js')

/**
 * Github App 约定的 clientSecret 和 clientId
 */
const clientSecret = '';
const clientId = '';

/**
 * 获取授权：
 * 与 Github 约定回调 url
 * 在 server 中接收回调，得到 code
 * 通过 code 再向 GitHub 获取 access_token
 * 将 access_token 放在 cookie 中
 * 重定向页面
 *
 * 保存授权用户基本信息，头像、name
 * 如果首次授权，保存，非首次，更新信息（头像、name等）
 */

exports.getCode = async (ctx, next) => {
    let code = ctx.request.query["code"];
    let option = {
        uri: 'https://github.com/login/oauth/access_token?client_id=' + clientId + '&client_secret=' + clientSecret + '&code=' + code,
        json: true
    } 
    let tokenResp = await rp(option);
    option = {
        uri: "https://api.github.com/user?access_token=" + tokenResp.access_token,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    }
    let userInfo = await rp(option);
    ctx.cookies.set('access_token', tokenResp.access_token, {
        'httpOnly': false
    })

    ctx.redirect('/comments')
    let isExist = await mAuthUser.findByLogin({login: userInfo.login});
    console.log(isExist)
    if(isExist) {
        console.log("update")
        let newAuther = {
            login: userInfo.login,
            name: (userInfo.name ? userInfo.name : userInfo.login),
            avatar_url: userInfo.avatar_url
        };
        let updateAuthUser = await mAuthUser.update(newAuther);
        console.log(updateAuthUser)
    } else {
        console.log("save")
        let newAuther = {
                login: userInfo.login,
                name: (userInfo.name ? userInfo.name : userInfo.login),
                avatar_url: userInfo.avatar_url
            };
        let saveAuthUser = await mAuthUser.save(newAuther);
        console.log(saveAuthUser)
    }
}

/**
 * 获取授权用户列表
 */
exports.getAuthUser =  async (ctx, next) => {
    let authUser = await mAuthUser.find({});
    if(authUser) {
        ctx.body = {
            errno: 0,
            error: "获取评论成功",
            data: authUser
        }
    } else {
        ctx.body = {
            errno: 4,
            error: "获取评论出错",
            data: []
        }
    }
}
