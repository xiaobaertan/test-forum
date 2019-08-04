const conn = require('../db/db.js')

// 展示首页页面
const showIndexPage = (req, res) => {
    // 每页显示3条数据
    const pageSize = 6
    const nowPage = Number(req.query.page) || 1
    const sql = `SELECT blog_articles.id,blog_articles.title,blog_articles.ctime,blog_users.nickname from blog_articles LEFT JOIN blog_users ON blog_articles.authorId = blog_users.id  ORDER BY blog_articles.id desc limit ${(nowPage-1)*pageSize},${pageSize};select count(*) as count from blog_articles`
    conn.query(sql, (err, result) => {
        if (err) return res.render('./index.ejs', {
            user: req.session.user,
            islogin: req.session.islogin,
            articles: []
        })

        const totalPage = Math.ceil(result[1][0].count / pageSize)
            // 使用 render 函数之前, 一定要保证安装并配置了 ejs 模板引擎
        res.render('./index.ejs', {
            user: req.session.user,
            islogin: req.session.islogin,
            articles: result[0],
            totalPage: totalPage,
            nowPage: nowPage
        })

    })


}
module.exports = { showIndexPage };