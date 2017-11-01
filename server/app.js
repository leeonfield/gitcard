const Koa = require('koa'),
    router = require('koa-router')(),
    logger = require('koa-logger'),
    static = require('koa-static'),
    convert = require('koa-convert'),
    json = require('koa-json'),
    bodyparser = require('koa-bodyparser'),
    session = require('koa-session'),
    views = require('koa-views');

const CONFIG = {
    key: 'Comment:@leeon',
    maxAge: 10 * 3600 * 1000,
    overwrite: true,
    signed: true
};


const port = 3300;

const app = new Koa();
const allRouter = require('./routes/index.js');

app.keys = ["leeon"];

app
    .use(bodyparser())
    .use(json())
    .use(logger())
    .use(static(__dirname + '/public'))
    .use(views(__dirname + '/views', {
        extension: 'ejs'
    }))
    .use(convert(session(CONFIG, app)))
    // .use(async (ctx, next) => {
    //     // if(this.session.isNew) {
    //     //     console.log("not ")
    //     // } else {
    //     //     await allRouter.get('/login', async(ctx, next) => {
    //     //         await ctx.render('login');
    //     //     });
    //     // }
    //     console.log(ctx.session);
    // })
    .use(allRouter.routes())
    .use(allRouter.allowedMethods());


app.on('error', function(err, ctx) {
    console.log(err);
    logger.error('server error', err, ctx);
});

app.listen(port, () => {
    console.log('server open on 127.0.0.1:' + port);
});