/*!
 * 功能: 总路由分发器主控制器
 * @author wangbin
 * @date 2015-09-29 16:08:58
 * @version 1.0.0
 */
'use strict';

var path = require('path');
var View = require('../renderer/view');

var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var qiniusRouter = require('../routes/qiniu');
var filesRouter = require('../routes/file');
var homeRouter = require('../routes/home');
var productRouter = require('../routes/product');
var analyticsRouter = require('../routes/analytics');

//初始化View
View.init(path.join(__dirname, '../views'));

//全局总前置拦截器
var beforeInterceptor = function(req, res, next){
    console.log('执行全局前置拦截器...');
    next();
};

/**
 * 全局后置拦截器，可执行页面渲染
 */
var afterInterceptor = function(req, res, next){
    var viewData = req.$view;   //判断req对像中是否存在req.$view

    if (viewData) {
        console.log('执行全局渲染器拦截器...');

        var view = new View('template/main');

        //绑定数据
        if (typeof(viewData) == 'string') {
            view.main = viewData;
        } else if (typeof(viewData) == 'object') {
            for (var key in viewData) {
                view[key] = viewData[key];
            }
        }

        //修正title
        if (!view.title) {
            view.title = 'WebTest';
        }

        //修正header，footer
        if (!view.header) {
            view.header = new View('template/header').render();
        }
        if (!view.footer) {
            view.footer = new View('template/footer').render();
        }

        res.send(view.render());
    }
};

//注: app为依赖注入的express对象
var dispatch = function(app){
    if (typeof(app) === 'undefined' || app == null || !app) {
        throw new Error('参数错误！');
    }

    //全局总前置拦截器
    app.use(beforeInterceptor);

    //注册路由控制器，并注入相应的依赖对象，实现控制反转
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/qiniu', qiniusRouter);
    app.use('/file', filesRouter);
    app.use('/home', homeRouter);
    app.use('/product', productRouter);
    app.use('/analytics', analyticsRouter);

    //全局后置拦截器，可执行页面渲染
    app.use(afterInterceptor);
};

module.exports = {
    use: dispatch
};
module.exports.dispatch = dispatch;  //提供别名
