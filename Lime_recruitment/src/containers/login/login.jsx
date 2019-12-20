/*
登录路由组件
*/
import React ,{Component} from 'react'
import {
  WingBlank,
  WhiteSpace,
  List,
  InputItem,
  Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {register,login} from '../../redux/actions'

class Login extends Component{
  state={
    username:'',
    password:''
  }
  login = () => {
    this.props.login(this.state)
  }
  handleChange = (name,val) => {
    this.setState({
      [name]:val
    })
  }
  goRegister = () => {
    this.props.history.replace('./register')
  }
  render(){
    const {msg,redirecto} = this.props.user
    if(redirecto){
      return <Redirect to={redirecto}/>
    }
    return(
      <div>
      <WhiteSpace/>
      <WhiteSpace/>
      <WhiteSpace/>
      <WhiteSpace/>
      <WhiteSpace/>
      <Logo/>
      <WingBlank size="lg">
        <List>
        <WhiteSpace/>
        <WhiteSpace/>
        <WhiteSpace/>
          <InputItem type="text" placeholder="请您输入账号" onChange={val => this.handleChange('username',val)}>账　　号：</InputItem>
          <WhiteSpace/>
          <WhiteSpace/>
          <WhiteSpace/>
          <InputItem type="password" placeholder="请您输入密码" onChange={val => this.handleChange('password',val)}>密　　码：</InputItem>
         
          <WhiteSpace/>
          <WhiteSpace/>
          <WhiteSpace/>
         
          <Button type="primary" onClick={this.login}>登录</Button>
          <WhiteSpace/>
          <WhiteSpace/>
          <Button type="ghost" onClick={this.goRegister}>注册</Button>
        </List>
        </WingBlank>
        {msg ? <div>{msg}</div>: null}
      </div>
    )
  }
}
export default connect(
  state => ({user: state.user}),
  {register,login}
)(Login)