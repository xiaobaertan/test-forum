const moment = require('moment')
const conn = require('../db/db.js')
const marked = require('marked');
const showAdd = (req, res) => {
    if (!req.session.islogin) return res.redirect('/')
    res.render('article/add.ejs', {
        user: req.session.user,
        islogin: req.session.islogin
    })
}
const addAtricle = (req, res) => {
    const body = req.body
        // 如果在服务器端获取的session 文章写太久 那session可能会过期
        // body.authorId = req.session.user.id
    body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')

    const sql = 'insert into blog_articles set ?'
    conn.query(sql, body, (err, result) => {
        if (err) return res.send({ msg: '发表文章失败!', status: 500 })
            // console.log(result);
        if (result.affectedRows !== 1) return res.send({ msg: '发表文章失败!', status: 501 })
        res.send({ msg: '发表文章成功', status: 200, insertId: result.insertId })

    })
}
const showArticleDetail = (req, res) => {
    // 获取文章id
    const id = req.params.id
        // 根据id 查询文章信息
    const sql = 'select * from blog_articles where id=?'
    conn.query(sql, id, (err, result) => {
        if (err) return res.send({ msg: '获取文章详情失败!', status: 500 })
        if (result.length !== 1) return res.redirect('/')
            // 在调用 res.render 方法之前, 要先把markdown 文本 转为 html 文本
        const html = marked(result[0].content);
        // console.log(html);
        // 把转换好的html 文本 赋值给 content属性
        result[0].content = html;

        res.render('./article/info.ejs', { user: req.session.user, islogin: req.session.islogin, article: result[0] })
    })

}

const showEdit = (req, res) => {
    // 如果用户没有登录 则不允许查看文章编辑页面
    if (!req.session.islogin) return res.redirect('/')
    const sql = 'select * from blog_articles where id=?'
    conn.query(sql, req.params.id, (err, result) => {
        if (err) return res.redirect('/')
        if (result.length !== 1) return res.redirect('/')
        res.render('./article/edit.ejs', { user: req.session.user, islogin: req.session.islogin, article: result[0] })
    })

}
const edit = (req, res) => {
    console.log(req.body);
    const sql = 'update blog_articles set ? where id=?'
    conn.query(sql, [req.body, req.body.id], (err, result) => {
        if (err) return res.send({ msg: '修改文章失败', status: 500 })
        if (result.affectedRows !== 1) return res.send({ msg: '修改文章失败', status: 501 })
        res.send({ msg: 'ok', status: 200 })
    })

}
module.exports = {
    showAdd,
    addAtricle,
    showArticleDetail,
    showEdit,
    edit
};