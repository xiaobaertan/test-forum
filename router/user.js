const express = require('express')
const router = express.Router()

const ctrl = require('../controller/user.js');
// 用户请求的是注册页面
router.get('/register', ctrl.regPage)

// 用户请求的是登录页面
router.get('/login', ctrl.loginPage)

// 要注册新用户了
router.post('/register', ctrl.reg)
    // 监听 登陆的请求
router.post('/login', ctrl.login)

// 监听 注销请求
router.get('/logout', ctrl.logout)
module.exports = router