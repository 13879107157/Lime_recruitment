import React ,{Component} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {TabBar} from 'antd-mobile'

import './index.less'
//debugger
var Item = TabBar.Item
class NavFooter extends Component{
    static propTypes = {
        navList : PropTypes.array.isRequired,
        unReadCount:PropTypes.number.isRequired
    }
    render(){
        let {navList,unReadCount} = this.props
        navList = navList.filter(nav => !nav.hide)
        const path = this.props.location.pathname
        return(
            <TabBar unselectedTintColor="#949494" tintColor="#f8806a" barTintColor="white">
                {
                    navList.map((nav) => (
                        <Item 
                            key={nav.path}
                            badge = {nav.path === '/message' ? unReadCount : 0}
                            title = {nav.text}
                            icon = {{uri: require(`./images/${nav.icon}.png`)}}
                            selectedIcon = {{uri: require(`./images/${nav.icon}-selected.png`)}}
                            selected = {path === nav.path}
                            onPress={() => this.props.history.replace(nav.path)}
                        />
                    ))
                }
            </TabBar>
        )
    }
}
export default withRouter(NavFooter)