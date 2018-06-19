var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var mydo = require('./route/do')
var formidable = require('formidable')



var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 访问静态资源
app.use(express.static(path.resolve(__dirname, './dist')));

// 访问单页
app.get('*', function (req, res,next) {
  var html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8');
  res.send(html);
});
app.post('/register',mydo.doRegister)
app.post('/login',mydo.doLogin)
/***********
 * 常规活动api
 * *********/
app.post('/newact',mydo.newAct)
app.post('/getactdata',mydo.getActData)
app.post('/userjoin',mydo.userJoin)
app.post('/newbooklist',mydo.newBookList)
app.post('/subarticle',mydo.subArticle)
app.post('/getold',mydo.getOld)
/***********
 * 主题阅读api
 * *********/
app.post('/topic/new',mydo.newTopic)
app.post('/topic/getdata',mydo.getTopiocData)
app.post('/topic/userjoin',mydo.newTopicUser)
app.post('/topic/newlist',mydo.newTopicList)
app.post('/topic/newarticle',mydo.subTopicArticle)
app.post('/topic/getold',mydo.getTopicOld)

// 监听
app.listen(3000, function () {
  console.log('success listen...3000');
});
