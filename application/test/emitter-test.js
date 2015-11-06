/**
 * Created by wangbin on 2015/10/28.
 */
var util = require('util');
var events = require('events');  //EventEmitter通过events模块来访问

function MyEventEmitter(id, name){  //新建一个类
    events.EventEmitter.call(this);  //***调用events.EventEmitter的构造方法***
    this.id = id;
    this.name = name || 'Unknown';
}

//***继承events.EventEmitter的原型方法***
util.inherits(MyEventEmitter, events.EventEmitter);

//定义一个方法可以触发"data"事件
MyEventEmitter.prototype.sendData = function(content){
    this.emit("data", this.name + "|" + content);
};

//以下是测试程序
var myEventEmitter = new MyEventEmitter(1, "my-event-emitte");

myEventEmitter.on('data', function(content){  //注册监听器，监听名为‘data’事件
    console.log('接收到信息: ' + content);
});

myEventEmitter.on('error', function(err){  //监听名为'error'的事件，此事件为预定义事件，提供错误处理
    console.log('接收错误: ' + (err.message || err));
});

myEventEmitter.sendData('hello, world');

module.exports = MyEventEmitter;