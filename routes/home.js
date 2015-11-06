/**
 * Created by wangbin on 2015/11/4.
 */
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
    console.log("***home函数列表方式****");
    next();
}

function isAdmin(req, res, next) {
    console.log("***home函数列表方式1****");
    next();
}

/* GET home page. */
router.get('/', isLogined, isAdmin, function (req, res, next) {
    var view = new View('web/home/index', {title: 'Express home'});
    req.$view = {
        title: 'WebTest 1',
        main: view.render()
    };
    next();
});

/* GET home page. */
router.get('/sub', function (req, res, next) {
    var view = new View('web/home/sub', {title: 'Express homesub'});
    req.$view = view.render();
    next();
});

/* GET home page. */
router.get('/list', function (req, res, next) {
    var view = new View('web/home/list', {title: 'Express list'});
    req.$view = view.render();
    next();
});

module.exports = router;
