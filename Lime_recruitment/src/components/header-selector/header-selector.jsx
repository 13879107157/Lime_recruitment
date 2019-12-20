import React ,{Component} from 'react'
import {List,Grid} from 'antd-mobile'
import PropTypes from 'prop-types'

import './header-selector'

export default class Headerselector extends Component{
    static propTypes = {
        setHeader : PropTypes.func.isRequired
    }
    state = {
        icon: null  //图片对象，默认没有值
    }
    constructor(props){
        super(props)
        //准备需要现实的列表数据
        this.headerList = []
        for (let i = 0; i < 20; i++) {
            this.headerList.push({
                // text:'头像'+(i+1),
                icon: require(`../../assets/images/头像${i+1}.png`)
            })          
        }
    }
    
    componentDidMount(){
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'))
        }, 0);
    }
    handleClick = ({text,icon}) => {
        this.setState({
            icon
        })
        this.props.setHeader(icon)

    }
    render(){
        const {icon} = this.state
        const listHeader = !icon ? '请选择头像' : (
            <div>
                已选择头像：<img src={icon} alt="" />
            </div>
        )
        return(
            <List renderHeader={() => listHeader}>
                <Grid 
                    data={this.headerList}  
                    columnNum={4} 
                    carouselMaxRow={3} 
                    isCarousel={true} 
                    hasLine={false} 
                    square={false}
                    onClick = {this.handleClick}
                 />
            </List>
        )
    }
}