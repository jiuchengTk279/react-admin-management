import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './addForm'
import AuthForm from './authForm'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

export default class Role extends Component {

  state = {
    roles: [], // 所有角色的列表
    role: {}, // 选中的role
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  }
  
  constructor (props) {
    super(props)

    this.auth = React.createRef()
  }


  // 初始化表格列
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
  }

  // 获取角色列表
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({ roles })
    }
  }

  onRow = (role) => {
    return {
      onClick: event => {
        this.setState({ role })
      }
    }
  }

  // 添加角色
  addRole = () => {
    // 进行表单验证, 只能通过了才向下处理
    this.form.validateFields(async (error, values) => {
      if (!error) {
        // 隐藏确认框
        this.setState({ isShowAdd: false })

        // 收集输入数据
        const { roleName } = values
        this.form.resetFields()

        // 添加角色
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
          message.success('添加角色成功')

          const role = result.data
          // 更新roles状态: 基于原本状态数据更新
          this.setState(state => ({
            roles: [...state.roles, role]
          }))
        } else {
          message.error('添加角色失败')
        }
      }
    })
  }

  // 更新角色
  updateRole = async () => {
    this.setState({ isShowAuth: false })

    const role = this.state.role
    // 得到最新的menus
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username
    // 请求更新
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      message.success('设置角色权限成功')
      // 如果当前更新的是自己角色的权限, 强制退出
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {}
        storageUtils.removeUser()
        this.props.history.replace('/login')
        message.success('当前用户角色权限修改了，请重新登录')
      } else {
        message.success('设置角色权限成功！')
        this.setState({
          roles: [...this.state.roles]
        })
      }

    }
  }

  componentWillMount () {
    this.initColumn()
  }

  componentDidMount () {
    this.getRoles()
  }

  render () {
    const { roles, role, isShowAdd, isShowAuth } = this.state

    const title = (
      <span>
        <Button type="primary" onClick={() => this.setState({ isShowAdd: true})}>创建角色</Button> &nbsp;&nbsp;
        <Button type="primary" disabled={!role._id} onClick={() => this.setState({ isShowAuth: true})}>设置角色权限</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            // 选择某个radio时回调
            onSelect: (role) => {
              this.setState({
                role
              })
            }
          }}
          onRow={this.onRow}
        ></Table>

        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false})
            this.form.resetFields()
          }}
          >
            <AddForm
              setForm={(form) => this.form = form}
            ></AddForm>
          </Modal>
          
          <Modal
            title="设置角色权限"
            visible={isShowAuth}
            onOk={this.updateRole}
            onCancel={() => {
              this.setState({ isShowAuth: false})
            }}
            >
              <AuthForm role={role} ref={this.auth}></AuthForm>
            </Modal>
      </Card>
    )
  }
}
