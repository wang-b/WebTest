/*!
 * Created by wangbin on 2015/10/16.
 */
'use strict';

var express = require('express');
var qiniu = require('qiniu');
var View = require('../renderer/view');

var router = express.Router();

var qiniu_domain = '7xn4q0.com1.z0.glb.clouddn.com';

/**
 * 可以处理 get 和 post 请求，但查找优先级由高到低为req.params→req.body→req.query
 * @param req 请求对象
 * @param key 参数地址
 */
function getParam(req, key) {
    return (req.params)[key] || (req.body)[key] || (req.query)[key];
}

//拦截器功能
router.use(function(req, res, next){
    console.log("拦截器...: " + req.originalUrl);
    res.header("Access-Control-Allow-Origin", "*"); //需要跨越
    res.header("Access-Control-Allow-Headers", "X-Requested-With,If-Modified-Since");   //Ajax头信息X-Requested-With
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", '3.2.1');
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    next();
});

router.get('/', function(req, res, next) {
    console.log("参数params: name = " + req.params.name);  //获取"/user/:id/:name"请求路径中的参数，可正则匹配
    console.log("参数query: name = " + req.query.name);  //获取get请求参数
    console.log("参数body: name = " + req.body.name);    //获取post请求参数，含ajax等

    var view = new View('index');
    view.title = 'QiniuTest';

    req.$view = view.render();
    next();
});

//生成上传凭证
router.use('/uptoken/:bucket', function(req, res, next){
    /*
     在express框架下，获取请求参数的方式：
     req.query.XXX
     ： 处理 get 请求

     req.params.XXX
     ： 处理 /:XXX 形式的 get 请求

     req.body.XXX
     ： 处理 post 请求

     req.param(XXX(key), defaultVal)
     : express deprecated
     ：可以处理 get 和 post 请求，但查找优先级由高到低为req.params→req.body→req.query
     */
    //var bucket = req.params.bucket;  //指定scope名称
    var bucket = getParam(req, "bucket");
    var putPolicy = new qiniu.rs.PutPolicy(bucket);
    //putPolicy.callbackUrl = callbackUrl;
    //putPolicy.callbackBody = callbackBody;
    //putPolicy.returnUrl = returnUrl;
    //putPolicy.returnBody = returnBody;
    //putPolicy.asyncOps = asyncOps;
    //putPolicy.expires = expires;

    var token = putPolicy.token();
    res.json({
        code: 0,
        uptoken: token,
        message: "获取上传token"
    });
});

/**
 * 生成带下载凭证的文件url,下载私有文件需要
 * @param domain qiniu域名
 * @param key 文件key值
 * @param expires 失效时间
 */
function downloadUrl(domain, key, expires) {
    expires = expires || 3600;
    var baseUrl = qiniu.rs.makeBaseUrl(domain, key);
    var policy = new qiniu.rs.GetPolicy(expires);
    return policy.makeRequest(baseUrl);
}

//生成带下载凭证的文件url
router.use("/dnurl/:key", function(req, res, next){
    var key = getParam(req, "key");
    var expires = getParam(req, "expires") || 3600;

    res.json({
        code: 1,
        message: "生成成功",
        dnurl: downloadUrl(qiniu_domain, key, expires)
    });
});

/**
 * 获取缩略图相关信息
 * @param domain qiniu域名
 * @param key 文件key
 * @param params 缩略图参数
 * @param expires 失效时间
 */
function thumbnailUrl(domain, key, params, expires) {
    params = params || {};
    // 生成访问图片的url
    var url = qiniu.rs.makeBaseUrl(domain, key);

    //生成fop_url
    var iv = new qiniu.fop.ImageView();
    if (params.width) {
        iv.width = params.width
    }
    if (params.height) {
        iv.height = params.height;
    }
    if (params.quality) {
        iv.quality = params.quality;
    }
    if (params.format) {
        iv.format = params.format;
    }
    url = iv.makeRequest(url);

    //签名，生成private_url。如果是公有bucket则此步可以省略,服务端操作使用，或者发送给客户端
    var policy = new qiniu.rs.GetPolicy(expires);
    url = policy.makeRequest(url);

    return url;
}

//生成带下载凭证的文件url(缩略图)
router.use("/thumbnail/:key", function(req, res, next){
    var key = getParam(req, "key");
    var expires = getParam(req, "expires") || 3600;

    var params = {};
    if (getParam(req, "width")) {
        params.width = getParam(req, "width");
    }
    if (getParam(req, "height")) {
        params.height = getParam(req, "height");
    }
    if (getParam(req, "quality")) {
        params.quality = getParam(req, "quality");
    }
    if (getParam(req, "format")) {
        params.format = getParam(req, "format");
    }

    res.json({
        code: 1,
        message: "生成成功",
        thumbnail: thumbnailUrl(qiniu_domain, key, params, expires)
    });
});

module.exports = router;
