/*!
 * Created by wangbin on 2015/11/4.
 */
'use strict';

var express = require('express');
var View = require('../renderer/view');

var router = express.Router();

var showProduct = function (req, res, next){
    var pid = req.params.pid || 2001;
    var view = new View('web/product/index', {pid: pid});
    req.$view = {
        piwik: 'product',
        main: view.render()
    };
    next();
};

/**
 * 注：router.use('/', f)与router.use(f); 效果一样，都会拦截所有的子路由内的请求，router.get('/', f)则不会拦截。
 */
router.get('/', showProduct);
router.use('/show/:pid', showProduct);

module.exports = router;
