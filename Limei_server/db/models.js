const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/LimeDB')
const conn = mongoose.connection
conn.on('connected',() => {
    console.log('db connect success!')
})

const userSchemam = mongoose.Schema({
    username:{type:String,require:true},    //用户名
    password:{type:String,require:true},    //密码
    type:{type:String,require:true},        //用户类型
    header:{type:String},       //头像
    post:{type:String},      //职位
    info:{type:String},     //个人简介
    company:{type:String}, //公司名称
    salary:{type:String}  //工资
})

const UserModel = mongoose.model('user',userSchemam)
exports.UserModel = UserModel

// 定义 chats 集合的文档结构
const chatSchema = mongoose.Schema({
    from: {type: String, required: true}, // 发送用户的 id
    to: {type: String, required: true}, // 接收用户的 id
    chat_id: {type: String, required: true}, // from 和 to 组成的字符串
    content: {type: String, required: true}, // 内容
    read: {type:Boolean, default: false}, // 标识是否已读
    create_time: {type: Number} // 创建时间
    })
    // 定义能操作 chats 集合数据的 Model
    const ChatModel = mongoose.model('chat', chatSchema)
    // 向外暴露 Model
    exports.ChatModel = ChatModel