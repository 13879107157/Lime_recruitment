import React ,{Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem,Grid,Icon} from 'antd-mobile'

import {sendMsg,readMsg} from '../../redux/actions'
import './index.less'
const Item = List.Item
 class Chat extends Component{
    state={
       content:'',
       isShow: false
    }
    componentWillMount(){
        const emojis= ['😀','😄','😁','😆','😅','🤣','😂','🙂','😙','😉','😊','😇','🥰','😍','🤩','😘','😗','😚'
        ,'😊','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🙈','🙉','🙊','🐒','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','😤',
        '🤥','😌','😔','😪','🤤','😴','🤮','🥴','👋','👌','👍','🙌','🤝','🙏','👶','🧒','👦','👧','🧑','👨','🧔']
        this.emojis = emojis.map(emoji => ({text:emoji}))

    }
    componentDidMount(){
        window.scrollTo(0,document.body.scrollHeight)
        
       
    }
    componentWillUnmount(){
 //发请求更新消息的未读状态
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from,to)
    }
    componentDidUpdate(){
        window.scrollTo(0,document.body.scrollHeight)
    }

   //() => this.setState({isShow:true})
    toggleShow = () => {
        const isShow = !this.state.isShow      //把state中的isShow改成true
        this.setState({isShow})     //改变状态
        if(isShow) {         
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0);
        }
    }
    handleSend = () => {
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content.trim()
        if(content){
            this.props.sendMsg({from,to,content})
        }
        this.setState({content:'',isShow:false})
        //window.scrollTo(0,document.body.scrollHeight)
    }
    render(){

        //debugger
        const {user} = this.props
        const {users,chatMsgs} = this.props.chat    //从chat里取出users和chatMsgs
        
        //自己的_id
        const myId = user._id    
        //console.log(myId);

        //如果还没有获取到数据，直接不做任何显示，等到发完请求接收到了数据，组件就会重新渲染
        if(!users[myId]){ 
            return null
        } 
        //目标_id
        const targetId = this.props.match.params.userid //目标id       
        const chatId = [myId,targetId].sort().join('_') //将自己的_id和目标的_id合并成一个chatId

        //把之前计算出的chatId和chatMsgs进行比较，如果相同则返回一个chatId，过滤条件就是这个chatId，在将这些数据存入msgs
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)  
        //得到自己的header图片
        const myHeader = users[myId].header     //这里一开始是空对象，但是后面发了异步请求就会有，在这之前就需要做处理
        let myIcon = ''
        if(myHeader){
            myIcon = myHeader
        }
         //得到目标用户的header图片
        const targetHeader = users[targetId].header
        let targetIcon = ''
        if(targetHeader){
            targetIcon = targetHeader
        }

        //const element = ;
        return(
                <div id='chat-page'>
                    <NavBar 
                        icon={<Icon type='left'/>} 
                        className="chatNva"
                        onLeftClick={() => this.props.history.goBack() }
                    >
                        {users[targetId].username}
                    </NavBar>
                        <List style={{marginTop:50, marginBottom:50}}>
                        
                            {
                                msgs.map(msg => {
                                    if(myId === msg.to){
                                        return <Item key={msg._id} thumb={targetIcon}>{msg.content}</Item>
                                        
                                    } else {
                                        return <Item key={msg._id}   className='chat-me' extra={React.createElement("div",{className:'greeting'},<img alt='' src={myIcon} />)}>{msg.content}</Item>
                                    }
                                })
                            }
                        
                        </List>
                    <div className='am-tab-bar sendchat'>
                        <InputItem 
                            placeholder="发送消息" 
                            value={this.state.content}
                            onChange={val=>this.setState({content:val})}
                            onFocus={() => this.setState({isShow:false})}
                            extra={
                                <span>
                                    <span onClick={this.toggleShow} role="img" >{'😀'}</span>&nbsp;
                                    <span onClick={this.handleSend}>发送</span>
                                </span>
                            }/>
                        {this.state.isShow ? (
                            <Grid className="emojis"
                                data={this.emojis}
                                columnNum={8}
                                carouselMaxRow={4}
                                isCarousel={true}
                                hasLine={false} 
                                square={false}
                                onClick ={(item) => {
                                    this.setState({content:this.state.content + item.text})
                                }}
                             />
                        ) : null}
                        
                    </div>
                </div>

            
        )
    }
}

export default connect(
    state => ({user:state.user,chat:state.chat}),
    {sendMsg,readMsg}
    )(Chat)