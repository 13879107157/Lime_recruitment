/*
注册路由组件
*/
import React ,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'       //操作前端cookie对象
import {NavBar} from 'antd-mobile'

import Staffinfo from '../staff-info/staff-info'
import Bossinfo from '../boss-info/boss-info'
//组件
import Boss from '../boss/boss'
import Staff from '../staff/staff'
import Message from '../message/message'
import Personal from '../personal/personal'
import Notfound from '../../components/not-found/notfound'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'

import {getRedirecTo} from '../../utils/index'
import {getUser} from '../../redux/actions'
import './index.less'
class Main extends Component{

 //debugger
  componentDidMount(){
    //登陆过(cookie中有userid)，但没有登录(redux管理的user中没有_id)，发送请求获取对应的user
    //debugger
    const userid = Cookies.get('userid')
    const {_id} = this.props.user   
    if(userid && !_id){
      //发送ajax请求，获取user信息
      this.props.getUser()  
    }
  }
    /* 
  一、自动登录
    1.componentDidMount()
      登陆过(cookie中有userid)，但没有登录(redux管理的user中没有_id)，发送请求获取对应的user
    2.render()
      1）、读取cookie中的userid，如果没有，自动重定向到登录页面
      2）、判断redux管理的user中是否有_id，如果没有，暂时不做任何显示
      3）、如果有，说明当前已经登录，显示对应界面
      4）、如果请求根路径，根据user的type和header来计算出一个重定向的路由路径，并自动重定向

  */
  navList = [   //包含所有导航组件的相关信息
    
    {
      path:'/staff',   //路由路径
      component:Boss,
      title:'老板列表',
      icon:'boss',
      text:'老板'
    },
    {
      path:'/boss',   //路由路径
      component:Staff,
      title:'员工列表',
      icon:'staff',
      text:'员工'
    },
    {
      path:'/message',   //路由路径
      component:Message,
      title:'消息列表',
      icon:'message',
      text:'消息'
    },
    {
      path:'/personal',   //路由路径
      component:Personal,
      title:'用户中心',
      icon:'personal',
      text:'个人'
    } 
  ]
  render(){
    
    //读取cookie中的userid
    const userid = Cookies.get('userid')
    //如果没有，自动重定向到登录页面
    if(!userid){
       return <Redirect to='login' />
    }
    //如果有，读取redux中的user状态
    //debugger
    const {user,unReadCount} = this.props
    if(!user._id){
      return null
    } else{
      let path = this.props.location.pathname
      if(path==='/'){
        path = getRedirecTo(user.type,user.header)
        return <Redirect to={path} /> 
      }
    }
    const {navList} = this
    const path = this.props.location.pathname   //请求的路径
    
    const currentNav = navList.find(nav => nav.path === path)  //得到当前的nav,可能没有

    //决定哪个路由需要隐藏
    if(currentNav){
      if (user.type === 'staff') {
        navList[1].hide = true
      } else {
        navList[0].hide = true
      }
    }
    return(

      <div>
        {currentNav ? <NavBar className="nav">{currentNav.title}</NavBar> : null}
        <Switch>
          {
            navList.map((nav,index) => <Route key={index} path={nav.path} component={nav.component} />)
          }
          <Route path='/bossinfo' component={Bossinfo}></Route>
          <Route path='/staffinfo' component={Staffinfo}></Route>
          <Route path='/chat/:userid' component={Chat}></Route>
          
          <Route component={Notfound} />
        </Switch>
        {currentNav ? <NavFooter unReadCount={unReadCount} navList = {navList}/> : null}
      </div>
    )
  }
}
export default connect(
  state => ({user:state.user, unReadCount: state.chat.unReadCount}),
  {getUser}
)(Main)

