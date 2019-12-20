var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')

const {UserModel,ChatModel} = require('../db/models')

const filter = {password:0,__v:0}
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* 
  1.获取请求参数
  2.处理
  3.返回响应数据
 */
router.post('/register',function (req,res) {
  const {username,password,type} = req.body
  UserModel.findOne({username},(error,doc) => {
    if (doc) {
      res.send({code:1,msg:'用户已存在'})
    } else{
      new UserModel({username,type,password:md5(password)}).save((error,doc) => {
        res.cookie('userid',doc._id,{maxAge:1000*60*60*24})
        const data = {username,type,_id:doc._id}
        res.send({code:0,data})
      })
    }
  })
})

router.post('/login',function (req,res) {
  const {username,password} = req.body
  UserModel.findOne({username,password:md5(password)},filter,(error,doc) => {
    if (doc) {
      res.cookie('userid',doc._id,{maxAge:1000*60*60*24})
      res.send({code:0,data:doc})
    } else {
      res.send({code:1,msg:'用户名或密码错误'})
    }
  })
})

//更新用户信息的路由
router.post('/update',function (req,res) {
  const userid = req.cookies.userid
  if(!userid){  //如果不存在直接返回一个提示信息
    return res.send({code:1,msg:'请先登陆'})
  }
  const user = req.body
  UserModel.findByIdAndUpdate({_id: userid},user, function (error,oldUser) {
    if (!oldUser) {
      //通知浏览器删除userid cookie 
      res.clearCookie('userid')
      //返回一个提示信息
      return res.send({code:1,msg:'请先登陆'})
    } else {
      const {_id,username,type} = oldUser
      const data = Object.assign(user,{_id,username,type})
      res.send({code: 0,data})
    }
  })
})

//获取用户信息的路由(根据cookie的userid)
router.get('/user', function (req, res) {

  // 取出 cookie 中的 userid
  //debugger
  const userid = req.cookies.userid
/*   if(!userid) {
  return res.send({code: 1, msg: '请先登陆'})
  } */

  // 查询对应的 user
  UserModel.findOne({_id:userid}, filter, function (err, user) {
    res.send({code: 0, data: user})
  })
})

router.get('/userlist',function (req,res) {
  const {type} = req.query
  UserModel.find({type},filter,function (error,users) {
    res.send({code:0,data:users})
  })
})

router.get('/msglist', function (req, res) {
  // 获取 cookie 中的 userid
  const userid = req.cookies.userid
  // 查询得到所有 user 文档数组
  UserModel.find(function (err, userDocs) {
    // 用对象存储所有 user 信息: key 为 user 的_id, val 为 name 和 header 组成的 user 对象
    const users = {} // 对象容器
    userDocs.forEach(doc => {
    users[doc._id] = {username: doc.username, header: doc.header}
    })
    /*查询 userid 相关的所有聊天信息
    参数 1: 查询条件
    参数 2: 过滤条件
    参数 3: 回调函数
    */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (error,chatMsgs) {
    // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})


router.post('/readmsg', function (req, res) {
  // 得到请求中的 from 和 to
  const from = req.body.from
  const to = req.cookies.userid
  /*更新数据库中的 chat 数据
  参数 1: 查询条件
  参数 2: 更新为指定的数据对象
  参数 3: 是否 1 次更新多条, 默认只更新一条
  参数 4: 更新完成的回调函数
  */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err,doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})



module.exports = router;
