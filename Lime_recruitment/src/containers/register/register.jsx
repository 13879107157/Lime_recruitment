/*
注册路由组件
*/
import React ,{Component} from 'react'
import {
  WingBlank,
  WhiteSpace,
  List,
  InputItem,
  Radio,
  Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {register,login} from '../../redux/actions'

class Register extends Component{
  state={
    username:'',
    password:'',
    password2:'',
    type:'dashen'
  }
  register = () => {
    this.props.register(this.state)
  }
  handleChange = (name,val) => {
    this.setState({
      [name]:val
    })
  }
  goLogin = () => {
    this.props.history.replace('./login')
  }

  render(){
    const {type} = this.state
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
          <InputItem type="password" placeholder="请您确认密码" onChange={val => this.handleChange('password2',val)}>确认密码：</InputItem>
          <WhiteSpace/>
          <WhiteSpace/>
          <WhiteSpace/>
          <List.Item>
            <span>用户类型:</span>

            &nbsp;&nbsp;&nbsp;&nbsp;

            <Radio checked={type==='boss'} onChange={()=> this.handleChange('type','boss')} >招聘者</Radio>

            &nbsp;&nbsp;&nbsp;&nbsp;
            
            <Radio checked={type==='staff'} onChange={()=> this.handleChange('type','staff')}>求职者</Radio>

            <WhiteSpace/>
            <WhiteSpace/>
          </List.Item>
          <Button type="primary" onClick={this.register}>注册</Button>
          <WhiteSpace/>
          <WhiteSpace/>
          <Button type="ghost" onClick={this.goLogin}>已有账号</Button>
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
)(Register)