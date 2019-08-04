const express = require('express')
const router = express.Router()
const ctrl = require('../controller/article.js')
    // 监听客户端的 get 请求地址 显示文章添加页面
router.get('/article/add', ctrl.showAdd)

// 监听客户端发表文章的请求
router.post('/article/add', ctrl.addAtricle)

// 监听客户端查看文章详情的 请求
router.get('/article/info/:id', ctrl.showArticleDetail)

// 监听客户端请求 文章编辑页面
router.get('/article/edit/:id', ctrl.showEdit)

router.post('/article/edit', ctrl.edit)
module.exports = router