// var http = require('http');
// var fs = require('fs');
//
// var server = http.createServer(function (req, res) {
//   console.log('服务器接受：' + req.url);
//
//   res.writeHead(200, {'Content-Type': 'text/plain;charset=UTF8'});
//   res.write("<h1>我是标题</h1>");
//   fs.readFile('./mock.js', function (err, data) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     res.end(data);
//   });
//   // res.end((1 + 2 + 3).toString());
// });
//
// server.listen(3000, "localhost");
// console.log(__dirname);
// console.log(__filename);
// console.log(module.filename === __filename);
// console.log(process.cwd());

var express = require("express");

var app = express();

app.get("/",function(req,res){
  res.send("你好");
});

app.get("/haha",function(req,res){
  res.send("这是haha页面，哈哈哈哈哈哈");
});

app.get(/^\/student\/([\d]{10})$/,function(req,res){
  res.send("学生信息，学号" + req.params[0]);
});

app.get("/teacher/:gonghao",function(req,res){
  res.send("老师信息，工号" + req.params.gonghao);
});

app.listen(3000);


// var express = require('express');
// var app = express();
//
// //设置跨域访问
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By", ' 3.2.1');
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });
//
// var questions = [
//   {
//     data: 213,
//     num: 444,
//     age: 12
//   },
//   {
//     data: 456,
//     num: 678,
//     age: 13
//   }];
//
// //写个接口123
// app.get('/123', function (req, res) {
//   res.status(200),
//     res.json(questions)
// });
//
// //配置服务端口
//
// var server = app.listen(3000, function () {
//
//   var host = server.address().address;
//
//   var port = server.address().port;
//
//   console.log('Example app listening at http://%s:%s', 'localhost', 3000);
// });

// 请求的原生ajax
// test() {
//   //步骤一:创建异步对象
//   var ajax = new XMLHttpRequest();
//   ajax.open('get', 'http://localhost:3000/123');
//   ajax.send();
//   ajax.onreadystatechange = function () {
//     if (ajax.readyState == 4 && ajax.status == 200) {
//       console.log(ajax.responseText);//输入相应的内容
//     }
//   }
// }