const uaParser = require("user-agent-parse")
const mComment = require("../model/comment.js")
const moment = require("moment");


exports.renderIndex = async(ctx, next) => {
    commentField = ctx.request.url;
    let comments = await mComment.findByField(commentField)
    await ctx.render('comment', {
        data: comments
    })
}

/**
 * 
 * 应该使用一种较好的方式作为评论的 field 
 * 版本一，注册登录版本
 */
exports.createComment = async(ctx, next) => {

    console.log(ctx.request.url);

    let commentData = ctx.request.body;
    commentData.time = new Date();
    commentData.autherName = ctx.session.user.name;
    commentData.autherId = ctx.session.user._id;
    let saveComment = await mComment.save(commentData);
    if(saveComment) {
        let tempComment = JSON.parse(JSON.stringify(saveComment))
        tempComment.time = moment(tempComment.time).format('YYYY.MM.DD.HH.mm.ss');
        ctx.body = {
            status: 0,
            error: "get data successfully",
            data: tempComment
        }
    } else {
        ctx.body = {
            status: 1,
            error: "fail to get data "
        }
    }
}

/**
 * 版本二：Github 登录版本
 * errno:
 * 0: 评论成功
 * 1: 缺少参数
 * 2: access_token 和 login 不匹配
 * 3: 存储出错
 * 4: 读取评论出错
 */
exports.newComment = async(ctx, next) => {
    let commentData = {};
    commentData.time = new Date();
    commentData.autherName = ctx.loginInfo.name ? ctx.loginInfo.name : ctx.loginInfo.login;
    commentData.autherId = ctx.loginInfo.login;
    commentData.autherImg = ctx.loginInfo.avatar_url;
    commentData.content = ctx.request.body.params.content;
    let saveComment = await mComment.save(commentData);
    console.log(commentData)
    if(saveComment) {
        let tempComment = JSON.parse(JSON.stringify(saveComment))
        tempComment.time = moment(tempComment.time).format('YYYY.MM.DD.HH.mm.ss');
        ctx.body = {
            errno: 0,
            error: "评论成功 😏",
            data: tempComment
        }
    } else {
        ctx.body = {
            errno: 3,
            error: "存储错误",
            data: {}
        }
    }
}


exports.getComment = async(ctx, next) => {
    let comments = await mComment.findAll();
    if(comments) {
        ctx.body = {
            errno: 0,
            error: "获取评论成功",
            data: comments
        }
    } else {
        ctx.body = {
            errno: 4,
            error: "获取评论出错",
            data: {}
        }
    }
}


exports.delComment = async(ctx, next) => {
    const _id = ctx.request.body.params._id;
    const autherId = ctx.loginInfo.login;
    let delComment = await mComment.delById({'_id': _id, 'autherId': autherId});
    if(delComment) {
        ctx.body = {
            errno: 0,
            error: "删除成功",
            data: {}
        }
    } else {
        ctx.body = {
            errno: 5,
            error: "删除出错",
            data: {}
        }
    }
}























