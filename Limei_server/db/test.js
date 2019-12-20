const mongoose = require('mongoose')    //引入mongoose,需要使用CommonJS语法
const md5 = require('blueimp-md5')

mongoose.connect('mongodb://localhost/test')    //连接数据库
const db = mongoose.connection                  ///获取连接对象
db.on('connected',function () {                 //
    console.log('数据库连接成功')
})

const userSchema = mongoose.Schema({
    username:{type:String,reqiured:true},
    password:{type:String,reqiured:true},
    header:{type:String}
})

const UserModel = mongoose.model('user',userSchema)

function Savetest() {
    const userModel = new UserModel({username:'jack',password:md5('123')})
    userModel.save(function (error,doc) {
        console.log('save()',error,doc)
    })
}
//Savetest();

function Selecttest() {
    UserModel.find({username:'jack'},function (error,doc) {
        console.log('Selecttest()',error,doc)
    })
}
Selecttest();

function Removetest(){
    UserModel.remove({username:'jack'},function (error,doc) {
        console.log('Removetest',error,doc)
    })
}

//Removetest()
