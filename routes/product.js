/*!
 * Created by wangbin on 2015/11/4.
 */
'use strict';

var express = require('express');
var View = require('../renderer/view');

var router = express.Router();

router.use('/', function(req, res, next){
    var view = new View('web/product/index');
    req.$view = {
        piwik: 'product',
        main: view.render()
    };
    next();
});

module.exports = router;
