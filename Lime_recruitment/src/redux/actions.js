/*
包含N个action creator
同步action
异步action
*/
import {
    reqLogin,
    reqRegister,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqChatMsgList,
    reqReadMsg
} from '../api/index'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    MSG_READ
} from './action-types'
import io from 'socket.io-client'



/*--------------------------------------------------------------------------------------------------------------------------------------------------*/


//授权成功的同步action
const anthSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
//错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
//接收用户的同步action
const receiveUser = (user) =>({type:RECEIVE_USER,data:user})
//重置用户的action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
//接收用户列表的action
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data:userList})
//接收消息列表的同步action
const receiveMsgList = ({users,chatMsgs,userid}) => ({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
//接收一个消息的同步action
const receiveMsg = ({chatMsg,userid}) => ({type:RECEIVE_MSG ,data:{chatMsg,userid}})
//读取了某个消息的同步action
const msgRead = ({count, from ,to})=>({type:MSG_READ,data:{count, from ,to}})
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

//异步注册action
export const  register = (user) => {
   const {username,password,password2,type} = user

    //表单前台验证
   if(!username){ 
         return errorMsg('必须填写用户名')
    } else if(password !== password2){
        return errorMsg('两次密码不一致')
    }
    //组件发送请求到action,这时候由于需要向服务器发送授权请求，所以需要做ajax请求，等请求结果过来之后再进行同步操作，将数据传送到前端
    return async dispatch => {
        const response =await reqRegister({username,password,type})
        const result = response.data
        if (result.code === 0) {
            getMsgList(dispatch,result.data._id)
            dispatch(anthSuccess(result.data))
        } else{
            dispatch(errorMsg(result.msg))
        }
    }
}

//异步登录action
export const login = (user) => {

    const {username,password} = user
     //表单前台验证
    if(!username){ 
          return errorMsg('必须填写用户名')
     } else if(!password){
         return errorMsg('密码错误')
     }
 
     return async dispatch => {
         const response =await reqLogin({username,password})
         const result = response.data
         if (result.code === 0) {
            getMsgList(dispatch,result.data._id)
            dispatch(anthSuccess(result.data))
         } else{
            dispatch(errorMsg(result.msg))
         }
     }
 }

 //异步更新用户数据action
 export const update = (user) => {
     return async dispatch => {
         const response  =await reqUpdateUser(user) 
         const result = response.data
         if(result.code === 0){
            dispatch(receiveUser(result.data))
         } else {
            dispatch(resetUser(result.msg))
         }
     }
 }

//获取用户异步action
export const getUser = () => {
    //debugger
    return async dispatch => {
        const response = await reqUser()
        const result = response.data
        if(result.code === 0){   //成功
            getMsgList(dispatch,result.data._id)
            //console.log(dispatch);
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}

//异步获取用户列表action

// 异步获取用户列表
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type)
        const result = response.data
        //console.log(result.data)
        if(result.code === 0){
            dispatch(receiveUserList(result.data))
        }
    }
    
}


function initIo(dispatch,userid) {
    //debugger
    //创建对象之前：判断对象是否存在，只有不存在的时候才去创建
    if(!io.socket){
        //连接服务器，得到与服务器的连接对象
        io.socket = io('ws://localhost:4000')
        //绑定监听，接收服务器发送的消息
        io.socket.on('receiveMsg',function(chatMsg){
            //console.log('接收服务器发送的消息',chatMsg);
            if(userid === chatMsg.from || userid === chatMsg.to){
                dispatch(receiveMsg({chatMsg,userid}))
            }
        })
    }
}
async function getMsgList(dispatch,userid) {
    initIo(dispatch,userid)
    const response = await reqChatMsgList()
    const result = response.data
    //console.log(response.data);
    if(result.code === 0){
        const {users,chatMsgs} = result.data
        dispatch(receiveMsgList({users,chatMsgs,userid}))
    }
    //console.log('123',result.data);
}
//发送消息的异步action
export const sendMsg = ({from,to,content}) => {
    return dispatch => {
        //console.log("TCL: sendMsg -> {from,to,content}", {from,to,content})
        io.socket.emit('sendMsg', {from,to,content})
    }
}

export const readMsg = (from,to) => {
    return async dispatch => {
        const response = await reqReadMsg(from)
        const result = response.data
        if(result.code === 0){
            const count = result.data
            dispatch(msgRead({count, from ,to}))
        }
    }
}
                                                                                             