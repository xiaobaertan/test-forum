// 封装路由模块的目的 是为了保证每个模块的只能单一性
// 对于 路由模块来说 只需要分配 URL 地址到处理函数之间的对应关系即可
// 路由木块 并不关心 如何处理这一次请求
const express = require('express')
const router = express.Router()
    // 用户请求的是首页

// 导入自己的业务处理木块
const ctrl = require('../controller/index.js');
router.get('/', ctrl.showIndexPage);
module.exports = router;