var md5 = require('md5')
var jwt = require('jsonwebtoken')

var mongoose = require('mongoose')
var mongoosedb = require('../db/connect')
var userModel = require('../db/userschema')
var activityModel = require('../db/activityschema')
var topicModel = require('../db/topicschema')

// 注册
exports.doRegister = function (req, res, next) {
  var username = req.body.user
  var password = req.body.pass
  var email = req.body.email
  var avatar = 'avatar.jpg'

  userModel.findOne({username: username}, function (err, result) {
    // 检查用户名是否存在
    if (result) {
      res.status(200).send('-1') // 用户名已存在
    } else {
      // 注册新用户，写入数据库
      password = md5(password) // 密码用md5加密
      // 将新用户写入数据库
      new userModel({username: username, password: password, email: email, avatar: avatar})
        .save(function (err, result) {})
      res.status(200).send('1') // 用户名已存在
    }
  })
}
// 登陆
exports.doLogin = function (req, res, next) {
  var username = req.body.user
  var password = md5(req.body.pass)
  userModel.findOne({username: username, password: password}, function (err, result) {
    if (result) {
      // 签署token
      var secretOrPrivateKey = '6-ara forever'
      var token = jwt.sign({username: username}, secretOrPrivateKey)
      res.json({ user: username, token: token }) // 登陆成功，返回token及用户名
    } else {
      res.send('-1') // 用户名或密码错误
    }
  })
}

/*****************
 常规活动api
 *****************/
// 新活动
exports.newAct = function (req, res, next) {
  const book = req.body.book
  const rebook = req.body.rebook
  const user = req.body.user
  const begdate = req.body.begdate
  const enddate = req.body.enddate

  activityModel({book: book, rebook: rebook, user: user, begdate: begdate, enddate: enddate, users: user})
    .save(function (err, result) {
      err ? res.status(201).send('-1') : res.status(200).send(result)
    })
}
// 获取活动数据
exports.getActData = (req, res, next) => {
  activityModel.find({}).sort({'_id': -1}).limit(1).exec(function (err, result) {
    err ? res.status(201).send('-1') : res.status(200).send(result)
  })
}
// 新用户加入活动
exports.userJoin = (req, res, next) => {
  const newuser = req.body.user
  const newbook = req.body.book
  const newrebook = req.body.rebook

  activityModel.find({}).sort({'_id': -1}).limit(1).exec(function (err, result) {
    if (err) {
      res.status(201).send('-1')
    } else {
      result[0].users.push(newuser)
      result[0].book.push(newbook)
      result[0].rebook.push(newrebook)
      result[0].save(function (err, result) {
        err ? res.status(201).send('-1') : res.status(200).send(result)
      })
    }
  })
}
// 新用户生成书单
exports.newBookList = (req, res, next) => {
  const bookList = req.body.booklist
  const user = req.body.user
  activityModel.find({}).sort({'_id': -1}).limit(1).exec(function (err, result) {
    if (err) {
      res.status(201).send('-1')
    } else {
      result[0].userinfo.push({user: user, booklist: bookList})
      result[0].save(function (err, result) {
        err ? res.status(201).send('-1') : res.status(200).send(result)
      })
    }
  })
}
// 用户提交读后感
exports.subArticle = (req, res, next) => {
  const body = req.body.body
  const title = req.body.title
  const user = req.body.user
  activityModel.find({}).sort({'_id': -1}).limit(1).exec(function (err, result) {
    if (err) {
      res.status(201).send('-1')
    } else {
      const len = result[0].userinfo.length
      for (let i = 0; i < len; i++) {
        if (user === result[0].userinfo[i].user) {
          result[0].userinfo[i].articlelist.push({title: title, body: body})
          result[0].save(function (err, result) {
            err ? res.status(201).send('-1') : res.status(200).send(result)
          })
        }
      }
    }
  })
}
// 往期活动数据
exports.getOld = (req, res, next) => {
  activityModel.find({}).sort({'_id': -1}).skip(1).exec(function (err, result) {
    err ? res.status(201).send('-1') : res.status(200).send(result)
  })
}
/*************************
 主题阅读api
 **********************/
// 新主题阅读
exports.newTopic = function (req, res, next) {
  const topic = req.body.topic
  const user = req.body.user
  const begdate = req.body.begdate
  const enddate = req.body.enddate

  topicModel({topic: topic, user: user, begdate: begdate, enddate: enddate})
    .save(function (err, result) {
      err ? res.status(201).send('-1') : res.status(200).send(result)
    })
}
// 获取活动数据
exports.getTopiocData = (req, res, next) => {
  topicModel.find({}).sort({'_id': -1}).limit(1).exec(function (err, result) {
    err ? res.status(201).send('-1') : res.status(200).send(result)
  })
}
// 新用户加入活动
exports.newTopicUser = (req, res, next) => {
  const newuser = req.body.user
  const newbook = req.body.book
  const film = req.body.film
  const music = req.body.music
  const newrebook = req.body.rebook
  const newrebook2 = req.body.rebook2

  topicModel.find({}).sort({'_id': -1}).limit(1).exec(function (err, result) {
    if (err) {
      res.status(201).send('-1')
    } else {
      result[0].users.push(newuser)
      result[0].book.push(newbook)
      result[0].book.push(newrebook)
      result[0].book.push(newrebook2)
      result[0].film.push(film)
      result[0].music.push(music)
      result[0].save(function (err, result) {
        err ? res.status(201).send('-1') : res.status(200).send(result)
      })
    }
  })
}
// 新用户生成书单
exports.newTopicList = (req, res, next) => {
  const bookList = req.body.booklist
  const user = req.body.user
  topicModel.find({}).sort({'_id': -1}).limit(1).exec(function (err, result) {
    if (err) {
      res.status(201).send('-1')
    } else {
      result[0].userinfo.push({user: user, booklist: bookList})
      result[0].save(function (err, result) {
        err ? res.status(201).send('-1') : res.status(200).send(result)
      })
    }
  })
}
// 用户提交读后感
exports.subTopicArticle = (req, res, next) => {
  const body = req.body.body
  const title = req.body.article
  const user = req.body.user
  topicModel.find({}).sort({'_id': -1}).limit(1).exec(function (err, result) {
    if (err) {
      res.status(201).send('-1')
    } else {
      const len = result[0].userinfo.length
      for (let i = 0; i < len; i++) {
        if (user === result[0].userinfo[i].user) {
          result[0].userinfo[i].articlelist.push({title: title, body: body})
          result[0].save(function (err, result) {
            err ? res.status(201).send('-1') : res.status(200).send(result)
          })
        }
      }
    }
  })
}
// 往期活动数据
exports.getTopicOld = (req, res, next) => {
  topicModel.find({}).sort({'_id': -1}).skip(1).exec(function (err, result) {
    err ? res.status(201).send('-1') : res.status(200).send(result)
  })
}
