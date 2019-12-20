import React ,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {NavBar, InputItem, TextareaItem, Button, WingBlank, WhiteSpace} from 'antd-mobile'

import Headerselector from '../../components/header-selector/header-selector'
import {update} from '../../redux/actions'

class Bossinfo extends Component{
    state = {
        header:'',       //头像
        post:'',         //职位
        info:'',         //个人简介
        company:'',      //公司名称
        salary:'',       //工资
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
                <WingBlank> 
                <Headerselector setHeader = {this.setHeader} />
                <WhiteSpace />
                <WhiteSpace />    
                        <WhiteSpace />
                        <InputItem onChange={val => {this.handlChange('post',val)}}>招聘职位:</InputItem>
                        <WhiteSpace />
                        <InputItem onChange={val => {this.handlChange('company',val)}}>公司名称:</InputItem>
                        <WhiteSpace />
                        <InputItem onChange={val => {this.handlChange('salary',val)}}>职位薪资:</InputItem>
                        <WhiteSpace />
                        <TextareaItem title='职位要求:' rows={4} onChange={val => {this.handlChange('info',val)}}></TextareaItem>
                    <Button type='primary' onClick = {this.save}>保　　存</Button>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {update}
)(Bossinfo)