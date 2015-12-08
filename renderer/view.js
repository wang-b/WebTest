/*!
 * Created by wangbin on 2015/11/3.
 */
'use strict';

var ejs = require('ejs');
var path = require('path');
var fs = require('fs');

var _BOM = /^\uFEFF/;

/**
 * 视图类，提供基于ejs的渲染功能，渲染数据绑定View对象上
 * @param view {String} 模板视图名称、标识或路径
 * @param data {Object} 视图数据
 * @param cache {Boolean} 是否从缓存加载模板（如果缓存不存在，则加载模板并缓存）,默认true
 * @constructor 构造器
 */
function View(view, data, cache){
    this._view = view;
    if (data != null && typeof(data) == 'object') {
        for (var key in data) {
            this[key] = data[key];
        }
    }
    this._cache = cache == null ? View._cache : cache;
}

/**
 * 模板视图根目录
 * @type {String}
 * @private
 */
View._root = __dirname;

/**
 * 默认设置是否缓存模板，默认true
 * @type {boolean}
 * @private
 */
View._cache = true;

/**
 * 模板文件默认后缀名
 * @type {string}
 * @private
 */
View._ext = '.ejs';

/**
 * 是否完成初始化
 * @type {boolean}
 * @private
 */
View._initialized = false;

/**
 * 如果给定模板不存在，是否自动匹配[tmpl]/index[_ext];自动匹配有一定的性能损耗
 * @type {boolean}
 * @private
 */
View._autoMatch = false;

/**
 * 缓存视图字符串（未编译）数据
 * @type {object}
 * @private
 */
View._templates = {};

/**
 * 根据当前对象绑定的数据，进行视图渲染
 * @return {String}
 */
View.prototype.render = function() {
    var filename = path.resolve(View._root, this._view + View._ext);
    if (View._autoMatch) {
        var exists = fs.existsSync(filename);
        if (!exists) {
            filename = path.resolve(View._root, this._view + '/index' + View._ext)
        }
    }

    //加载视图相关的数据
    var template = (View._templates)[this._view];
    if (!template) {
        template = fs.readFileSync(filename).toString().replace(_BOM, '');
        (View._templates)[this._view] = template;
    }

    return ejs.render(template, this, {
        filename: filename,
        cache: this._cache
    });
};

/**
 * 获取或设置视图
 * @returns {String|*}
 */
View.prototype.view = function(){
    if (arguments.length < 1) {
        return this._view;
    }
    this._view = arguments[0];
};

/**
 * 获取或设置是否缓存
 * @returns {*}
 */
View.prototype.cache = function(){
    if (arguments.length < 1) {
        return this._cache;
    }
    this._cache = arguments[0];
};

/**
 * 初始化View对象
 * @param root {String} 视图根目录
 */
View.init = function(root){
    if (!View._initialized) {
        if (typeof(root) == 'string') {
            View._root = root;
        } else if (typeof(root) == 'object') {
            if (root.root) {
                View._root = root.root;
            }
            if (root.cache != null) {
                View._cache = root.cache;
            }
            if (root.ext) {
                View._ext = root.ext;
            }
            if (root.autoMatch != null) {
                View._autoMatch = root.autoMatch;
            }
        }
        View._initialized = true;
        console.log('renderer.View初始化完成...');
    }
};

module.exports = View;
