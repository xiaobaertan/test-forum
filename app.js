const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
// 导入 session 中间件
const session = require('express-session')

// 注册 session 中间件
// 只要注册了 session 那么 今后只要能访问到 req 这个对象 就能访问到 req.session
app.use(session({
    secret: '加密字符串',
    resave: false,
    saveUninitialized: false
}))
app.use(bodyParser.urlencoded({ extended: false }))

// 设置默认采用的模板引擎名称
app.set('view engine', 'ejs');
// 设置模板页面的存放路径
app.set('views', './views');
// 把 node_modules 文件夹, 托管为静态资源目录
app.use('/node_modules', express.static('./node_modules'))

// 使用循环的方式 进行路由的自动注册
fs.readdir(path.join(__dirname, './router'), (err, filenames) => {
    if (err) return console.log('读取 router 目录中的路由失败!');
    // 循环 router 目录下的每一个文件名
    filenames.forEach(item => {
        // 没循环一次, 拼接出一个完整的路由模块
        const router = require(path.join(__dirname, './router', item))
        app.use(router);
    })

})

/* // 导入 router/index.js 路由模块
const router1 = require('./router/index.js');
app.use(router1);
// 导入 用户相关的路由模块
const router2 = require('./router/user.js');
app.use(router2);
 */
app.listen(80, () => {
    console.log('server runnint at http://127.0.0.1');

})