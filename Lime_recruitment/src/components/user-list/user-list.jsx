import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import QueueAnim from 'rc-queue-anim'
import { Card, WhiteSpace,WingBlank} from "antd-mobile";

import "./index.less";
const Header = Card.Header;
const Body = Card.Body;
class UserList extends React.Component {
  static propsTypes = {
    userList: PropTypes.array.isRequired
  };
  render() {
    return (
      <div className="list">
      <QueueAnim type="scale" >
        {this.props.userList.map(user => (
          <div key={user._id}>
            <WhiteSpace />
            <WingBlank>
            <Card
              className="cardbor"
              onClick={() => this.props.history.push(`/chat/${user._id}`)}
            >
              <Header thumb={user.header} extra={user.username} />
              <Body>
                <div>职位: {user.post}</div>
                {user.company ? <div>公司: {user.company}</div> : null}
                {user.salary ? <div>月薪: {user.salary}</div> : null}
                <div>描述: {user.info}</div>
              </Body>
            </Card>
            </WingBlank>
          </div>
        ))}
        </QueueAnim>
      </div>
    );
  }
}
export default withRouter(UserList);
