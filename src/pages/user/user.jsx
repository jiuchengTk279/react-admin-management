import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import LinkButton from '../../components/linkButton/index'
import { formateDate } from '../../utils/dateUtils'
import { reqUsers, reqDeleteUser, reqAddUser } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import UserForm from './userForm'

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
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
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
  addUpdateUser = async () => {
    this.setState({ isShow: false })

    // 1. 收集输入数据
    const user = this.form.getFieldsValue()
    this.form.resetFields()

    // 2. 提交添加的请求
    const result = await reqAddUser(user)
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success('添加用户成功！')
      this.getUsers()
    } else {
      message.error('添加用户失败！')
    }
  }

  // 删除指定用户
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗？`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功！')
          this.getUsers()
        }
      },
      onCancel: () => {
        message.info('已取消删除用户')
      }
    })
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

    const { users, isShow, roles  } = this.state
    const title = <Button type="primary" onClick={() => this.setState({ isShow: true})}>创建用户</Button>

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
          <UserForm setForm={form => this.form = form} roles={roles}></UserForm>
        </Modal>
      </Card>
    )
  }
}
