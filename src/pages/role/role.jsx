import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles } from '../../api'

export default class Role extends Component {

  state = {
    roles: [], // 所有角色的列表
    role: {} // 选中的role
  }
  
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time'
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time'
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
  }

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

  componentWillMount () {
    this.initColumn()
  }

  componentDidMount () {
    this.getRoles()
  }

  render () {
    const { roles, role } = this.state

    const title = (
      <span>
        <Button type="primary">创建角色</Button> &nbsp;&nbsp;
        <Button type="primary" disabled={!role._id}>设置角色权限</Button>
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
          rowSelection={{type: 'radio', selectedRowKeys: [role._id] }}
          onRow={this.onRow}
        ></Table>
      </Card>
    )
  }
}
