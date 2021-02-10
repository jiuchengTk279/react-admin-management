import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/linkButton'

export default class Category extends Component {
  
  render () {

    // card 的左侧
    const title = '一级分类列表'
    // card 的右侧
    const extra =(
      <Button type="primary">
        <Icon type="plus"></Icon>
        添加
      </Button>
    )

    const dataSource = [
      {
        "parentId": "0",
        "_id": "5c2ed631f352726338607046",
        "name": "分类001",
        "__v": 0
      },
      {
        "parentId": "0",
        "_id": "5c2ed647f352726338607047",
        "name": "分类2",
        "__v": 0
      },
      {
        "parentId": "0",
        "_id": "5c2ed64cf352726338607048",
        "name": "1分类3",
        "__v": 0
      }
    ]

    const columns = [
      {
        title: '分类的名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: () => (
          <span>
            <LinkButton>修改分类</LinkButton>
            <LinkButton>查看子分类</LinkButton>
          </span>
        )
      }
    ]

    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={dataSource} 
          columns={columns} 
          bordered
          rowKey="_id"></Table>
      </Card>
    )
  }
}
