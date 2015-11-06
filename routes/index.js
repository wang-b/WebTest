'use strict';

var express = require('express');
var View = require('../renderer/view');

var router = express.Router();

/**
 * 判断是否登录
 * @param req
 * @param res
 * @param next
 */
function isLogined(req, res, next) {
    console.log("***函数列表方式****");
    next();
}

function isAdmin(req, res, next) {
    console.log("***函数列表方式1****");
    next();
}

/**
 * 此方法需要注意，因为极好路由为"/",所以此处使用"/"路由拦截会影响全局。
 * 拦截器匹配原则: uri匹配的方式，uri = 总路由 + 子路由.
 * 注: 路由歧义问题，一定要注意。
 */
router.use('/1', function(req, res, next){
    console.log("***前置拦截器的方式****");
    next();
});

/* GET home page. */
router.get('/', isLogined, function (req, res, next) {
    //测试nodejs中加载C++模块的方法
    //require('../application/hello/test');

    //测试EventEmitter
    require('../application/test/emitter-test');

    var view = new View('index');
    view.title = 'Express';
    req.$view = view.render();
    next();
});

module.exports = router;
