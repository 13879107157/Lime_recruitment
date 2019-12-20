import React ,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import { NavBar,InputItem,Button,WingBlank,WhiteSpace} from 'antd-mobile'
import {update} from '../../redux/actions'

import Headerselector from '../../components/header-selector/header-selector'
class Staffinfo extends Component{
    state = {
        header:'',       //头像
        post:'',         //职位
        info:'',         //个人简介
    }
    handlChange = (name,val) => {
        this.setState({
            [name]: val
        })
    }
    save = () => {
        this.props.update(this.state)
    }
    //更新header状态
    setHeader = (header) => {
        this.setState({
            header
        })
    }
    render(){
        //如果信息完善自动重定向到主界面 
        const {header,type} = this.props.user
        if(header){
            const path = type === 'staff' ? '/staff' : 'boss'
            return <Redirect to={path} />
        }
        return(
            <div>
                <NavBar>完善信息</NavBar>
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace />
                <WingBlank>
                <Headerselector setHeader = {this.setHeader} />
                <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    
                        <WhiteSpace />
                        <InputItem onChange={val => {this.handlChange('post',val)}}>求职岗位:</InputItem>
                        <WhiteSpace />
                        <WhiteSpace />
                        <WhiteSpace />
                        <InputItem onChange={val => {this.handlChange('info',val)}}>个人介绍:</InputItem>
                    
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <Button type='primary' onClick={this.save}>保　　存</Button>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {update}
)(Staffinfo)