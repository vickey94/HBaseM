const Koa = require('koa')
const app = new Koa()

const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
//const staticServer = require('koa-static')
const bodyParser = require('koa-bodyparser')
const templating = require('./templating')

const config = require('./config')

// 使用响应处理中间件
app.use(response)
// 解析请求体
app.use(bodyParser())

//静态文件地址
//app.use(staticServer(__dirname + '/public')); 
/*
app.keys  = ['hm', 'hmm'];
app.use(async (ctx, next) => {
  // parse user from cookie:
    await next();
});
*/

// add nunjucks as view:
app.use(templating(__dirname+'/views', {
    noCache: true,
    watch: true
  }));

// 引入路由分发
app.use(require('./routers/routes').routes())

//加载定时任务
require('./service/scheduleService')

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))

