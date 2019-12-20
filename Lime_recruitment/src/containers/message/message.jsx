/* 
消息主界面路由容器组件
*/
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'
import './index.less'
const Item = List.Item
const Brief = Item.Brief

/*得到所有聊天的最后 msg 组成的数组[msg1, msg2, msg3..]
        // 1. 使用{}进行分组(chat_id), 只保存每个组最后一条 msg: {chat_id1: lastMsg1, chat_id2:lastMsg2}
        // 2. 得到所有分组的 lastMsg 组成数组: Object.values(lastMsgsObj) [lastMsg1, lastMsg2]
        // 3. 对数组排序(create_time, 降序)
*/
function getLastMsgs(chatMsgs,userid) {
    //debugger
    const lastMsgsObjects = {}      
    chatMsgs.forEach(msg => {
        if(msg.to === userid && !msg.read){
            msg.unReadCount = 1
        } else {
            msg.unReadCount = 0
        }
        
        const chatId = msg.chat_id      //取出每条消息的chat_id
        const lastMsg = lastMsgsObjects[chatId]     //一开始lastMsg是等于undefind，然后进入下面为true的判断，然后就有值了
        if(!lastMsg){       //所以这里一开始是没有值的，第一遍遍历就会进入true的分支
            lastMsgsObjects[chatId] = msg   //这个时候就把msg赋值给了这个形参chatId,遍历了这一次后，前面的lastMsg就有值了
        }else {

            const unReadCount = lastMsg.unReadCount + msg.unReadCount       //保存已经统计的未读数量
            if(msg.create_time > lastMsg.create_time){      //根据时间的前后来重新赋值给lastMsgsObjects[chatId]
                lastMsgsObjects[chatId] = msg       
            }
            //累加unReadCount并保存在最新的lastMst上
            lastMsgsObjects[chatId].unReadCount = unReadCount
        }
    })
    //遍历完成后，得到的就是根据chat_id来分组的最后一条消息
    //console.log(lastMsgsObjects);   //{chat_id1: lastMsg1, chat_id2:lastMsg2}
    //这里是取出lastMsgsObjects对象里所有的值来形成一个数组[msg1, msg2, msg3..]
    const lastMsgs = Object.values(lastMsgsObjects)
    //然后根据时间的前后来进行排序
    lastMsgs.sort(function (m1,m2) {
        return m2.create_time-m1.create_time
    })
    //console.log(lastMsgs);      //[msg1, msg2, msg3..]
    
    return lastMsgs
}
class Message extends Component{
    render(){
        const {user} = this.props   //取出当前用户信息
        const {users,chatMsgs} = this.props.chat    //取出所有用户和聊天信息
        const lastMsgs = getLastMsgs(chatMsgs, user._id)   //将chatMsgs传入getLastMsgs函数中，就可以得到消息列表
        return(
            <div className="messageList">
                <List style={{marginTop:50,marginBottom:50}}>
                <QueueAnim type='scale' duration={850}>
                    {
                        lastMsgs.map(msg => {
                            //得到目标用户ID，如果msg.to等于自己的_id那目标_id就是from,反之就是to
                            const targetId =  msg.to === user._id ? msg.from : msg.to
                            //从users这个数据中取到目标用户的信息，主要内容是username和header 例如5dbab5610e1f8b07b8351a4e:{username:'陈腾辉'}
                            const targetUser = users[targetId]
                            return (
                                <Item
                                    key={msg._id}
                                    extra={<Badge text={msg.unReadCount}/>}   //消息圆点
                                    thumb={targetUser.header}//目标头像
                                    arrow='horizontal'      //箭头方向
                                    onClick={()=> this.props.history.push(`/chat/${targetId}`)}
                                >
                                {targetUser.username}
                                    <Brief>{msg.content}</Brief>
                                </Item>
                            )
                        })
                    }
                    </QueueAnim>
                </List>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user,chat:state.chat}),
    
)(Message)
