import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import LinkButton from '../../components/linkButton/index'
import { formateDate } from '../../utils/dateUtils'
import { reqUsers } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

export default class User extends Component {
  
  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框
  }

  // 初始化表格列
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton>修改</LinkButton>
            <LinkButton>删除</LinkButton>
          </span>
        )
      }
    ]
  }

  // 根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存 roleNames
    this.roleNames = roleNames
  }

  // 添加/更新用户
  addUpdateUser = () => {
    
  }

  // 获取所有的用户列表
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const { users, roles } = result.data
      this.setState({
        users,
        roles
      })
    }
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getUsers()
  }

  render () {

    const { users, isShow  } = this.state
    const title = <Button type="primary">创建用户</Button>

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
        ></Table>

        <Modal
          title="添加用户"
          visible={isShow}
          onOk={this.addUpdateUser}
          onCancel={() => this.setState({ isShow: false})}
        >
          <div>添加/更新界面</div>
        </Modal>
      </Card>
    )
  }
}
