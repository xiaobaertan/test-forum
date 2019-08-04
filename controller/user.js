const moment = require('moment');
const conn = require('../db/db.js');
const bcrypt = require('bcrypt')
const saltRounds = 10
const regPage = (req, res) => {
    // 注意: 当在调用模板引擎的 res.render 函数的时候, ./ 相对路径 是相对于 app.set('views')指定的目录来进行查找的
    res.render('./user/register.ejs', {});
}
const loginPage = (req, res) => {
    // 注意: 当在调用模板引擎的 res.render 函数的时候, ./ 相对路径 是相对于 app.set('views')指定的目录来进行查找的
    res.render('./user/login.ejs', {});
}
const reg = (req, res) => {
    // TODO: 完成用户注册的业务逻辑
    const body = req.body;
    // 第一次验证表单是否为空
    if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
        return res.send({ msg: '请填写完整的表单数据后再注册用户!', status: 501 })
    }
    // 查询用户名是否重复
    const sql1 = 'select count(*) as count from blog_users where username=?';
    conn.query(sql1, body.username, (err, result) => {
        // 如果查询失败, 则告知客户端查询失败
        if (err) return res.send({ msg: '用户名查重失败!', status: 502 })
        if (result[0].count !== 0) return res.send({ msg: '请更换其他用户名后再次注册', status: 503 })
            // 执行注册逻辑
        body.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
        // 在执行 sql 语句 之前 先对用户提供的密码做一次加密 防止密码被邪路之后 明文被盗的情况
        // bcrypt.hash('要被加密的密码',循环的幂次,回调函数)
        bcrypt.hash(body.password, saltRounds, (err, pwd) => {
            if (err) return res.send({ msg: '注册用户失败!', status: 506 })
                // 把加密之后的新密码 赋值给 body.password
            body.password = pwd
            const sql2 = 'insert into blog_users set?'
            conn.query(sql2, body, (err, result) => {
                if (err) return res.send({ msg: '注册新用户失败!', status: 504 })
                if (result.affectedRows !== 1) return res.send({ msg: '注册新用户失败!', status: 505 })
                res.send({ msg: '注册新用户成功!', status: 200 })
            })
        })
    })
}

// 登录
const login = (req, res) => {
        /*         // 1. 获取表单中的数据
                const body = req.body;
                // 2. 执行 sql 语句 查询用户是否 存在
                const sql1 = 'select * from blog_users where username=? and password=?';
                conn.query(sql1, [body.username, body.password], (err, result) => {
                    if (err) return res.send({ msg: '用户登录失败', status: 501 })
                        // 如果查询的结果 记录条数不为1  则证明查询失败
                    if (result.length !== 1) return res.send({ msg: '用户登录失败', status: 502 })
                        // 把登录成功之后的用户信息 挂载到 session上
                    req.session.user = result[0];
                    // 把用户登录成功之后的结果 挂载到 session 上
                    req.session.islogin = true;
                    // 查询成功
                    res.send({ msg: 'ok', status: 200 })

                }) */

        const body = req.body;
        // 2. 执行 sql 语句 查询用户是否 存在
        const sql1 = 'select * from blog_users where username=?';
        conn.query(sql1, body.username, (err, result) => {
            if (err) return res.send({ msg: '用户登录失败', status: 501 })
                // 如果查询的结果 记录条数不为1  则证明查询失败
            if (result.length !== 1) return res.send({ msg: '用户登录失败', status: 502 })
                // bcrypt.compare('用户输入的密码','数据库中记录的密码',回调函数)
            bcrypt.compare(body.password, result[0].password, function(err, resB) {
                if (err) return res.send({ msg: '用户登录失败!', status: 503 })
                if (!resB) return res.send({ msg: '密码校验失败!', status: 504 })
                console.log(resB)


                // 把登录成功之后的用户信息 挂载到 session上
                req.session.user = result[0];
                // 把用户登录成功之后的结果 挂载到 session 上
                req.session.islogin = true;
                // 查询成功
                res.send({ msg: 'ok', status: 200 })
            })



        })
    }
    // 注销
const logout = (req, res) => {
    req.session.destroy(() => {
        //  使用 res.redirect 方法 可以让客户端重新访问 指定的页面
        res.redirect('/')
    })
}
module.exports = {
    regPage,
    loginPage,
    reg,
    login,
    logout
}