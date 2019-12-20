/* 
个人中心主界面路由容器组件
*/
import React ,{Component} from 'react'
import {Result,List,WhiteSpace,Button,Modal} from 'antd-mobile'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'

import {resetUser} from '../../redux/actions'
const Item = List.Item
const Brief = Item.Brief
class Personal extends Component{
    LoginOut = () => {
        Modal.alert('退出','确认退出登录吗？',[
            {
                text:'取消'
            },
            {
                text:'确定',
                onPress: () => {
                    Cookies.remove('userid')
                    this.props.resetUser()
                }
            }
        ])
    }
    render(){
        const {user} = this.props
        return(
            <div>
                <WhiteSpace/> <WhiteSpace/> <WhiteSpace/> <WhiteSpace/> <WhiteSpace/> <WhiteSpace/> <WhiteSpace/> <WhiteSpace/>
                <Result
                    img={<img src={user.header} style={{width: 50}}
                    alt="header"/>}
                    title={user.username}
                    message={user.company}
                />
                <List renderHeader={() => '相关信息'}>
                <Item multipleLine>
                    <Brief>职位:{user.post}</Brief>
                    <Brief>简介:{user.info}</Brief>
                    {user.salary ? <Brief>薪资:{user.salary}</Brief> : null}
                    
                </Item>
                </List>
                <WhiteSpace/> <WhiteSpace/> <WhiteSpace/> <WhiteSpace/> <WhiteSpace/> <WhiteSpace/> <WhiteSpace/> <WhiteSpace/>
                <List>
                    <Button type='warning' onClick={this.LoginOut}>退出登录</Button>
                </List>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {resetUser}
)(Personal)