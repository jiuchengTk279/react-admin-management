import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'

export default class Role extends Component {

  state = {
    roles: [
      {
        "menus": [
            "/role",
            "/charts/bar",
            "/home",
            "/category"
        ],
        "_id": "5ca9eaa1b49ef916541160d3",
        "name": "测试",
        "create_time": 1554639521749,
        "__v": 0,
        "auth_time": 1558679920395,
        "auth_name": "test007"
    },
    {
        "menus": [
            "/role",
            "/charts/bar",
            "/home",
            "/charts/line",
            "/category",
            "/product",
            "/products"
        ],
        "_id": "5ca9eab0b49ef916541160d4",
        "name": "经理",
        "create_time": 1554639536419,
        "__v": 0,
        "auth_time": 1558506990798,
        "auth_name": "test008"
    },
    {
        "menus": [
            "/home",
            "/products",
            "/category",
            "/product",
            "/role"
        ],
        "_id": "5ca9eac0b49ef916541160d5",
        "name": "角色1",
        "create_time": 1554639552758,
        "__v": 0,
        "auth_time": 1557630307021,
        "auth_name": "admin"
    }
    ],
    role: []
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


  render () {
    const { roles } = this.state

    const title = (
      <span>
        <Button type="primary">创建角色</Button> &nbsp;&nbsp;
        <Button type="primary" disabled>设置角色权限</Button>
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
          rowSelection={{type: 'radio'}}
          onRow={this.onRow}
        ></Table>
      </Card>
    )
  }
}
