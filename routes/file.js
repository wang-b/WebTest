/*!
 * Created by wangbin on 2015/10/19.
 */
'use strict';

var express = require('express');
var formidable = require('formidable');
var path = require('path');
var util = require('util');
/*
 * 默认的情况下 gm使用的是另外一个图片处理程序;gm 是 Node.js 的 GraphicsMagick 和 ImageMagick。
 * 使用gm相关功能，需要安装GraphicsMagick 和 ImageMagick（注意版本兼容）。
 */
//var gm = require('gm').subClass({imageMagick: true});
var gm = require('gm');
var View = require('../renderer/view');

var router = express.Router();

router.use('/', function(req, res, next){
    console.log("***file前置拦截器的方式****");
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    var view = new View('index');
    view.title = 'Express';
    req.$view = view.render();
    next();
});

//上传文件
router.post('/upload', function(req, res, next){
    //创建表单上传
    var form = new formidable.IncomingForm();
    //设置编码
    form.encoding = 'utf-8';
    //文件存储路径
    form.uploadDir = path.join(__dirname, '../uploads');
    //保留后缀
    form.keepExtensions = true;
    //设置文件大小限制
    form.maxFieldsSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  //设置所有文件大小总和
    form.parse(req, function(err, fields, files){
        //进行压缩处理，并返回相应的图片信息
        var file = files.file;
        console.log("上传文件: " + file.path);
        var fname = path.basename(file.path);
        console.log("图片文件名: " + fname);

        var newFName = 'thumbnail_' + fname;
        var newPath = path.join(__dirname, '../uploads/thumbnail/' + newFName);
        gm(file.path).resize(240, 240).noProfile().write(newPath, function(err){
            if (!err) {
                console.log('Image resize done!!!');

                res.writeHead(200, {'content-type': 'text/plain'});
                res.write('received upload:' + newPath + '\n\n');
                res.write(util.inspect(fields) + '\n');
                res.write(util.inspect(files) + '\n');
                res.end('--end--');
                return;
            }
            console.log('Image resize error：' + err.message);
            res.writeHead(200, {'content-type': 'text/plain;charset=utf8'});
            res.write('<p>图片处理出错: ' + (err.message) + '</p>\n');
            res.write('received upload:\n\n');
            res.write(util.inspect(fields) + '\n');
            res.write(util.inspect(files) + '\n');
            res.end('--end--');
        });
    });
});

module.exports = router;
