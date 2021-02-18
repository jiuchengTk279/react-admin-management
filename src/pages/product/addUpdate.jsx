import React, { Component } from 'react'
import { Card, Icon, Form, Input, Cascader, Button, message } from 'antd'
import LinkButton from '../../components/linkButton'

const {Item} = Form
const { TextArea } = Input

export default class ProductAddUpdate extends Component {
  render () {
    
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2}, // 左侧label的宽度
      wrapperCol: { span: 8} // 右侧包裹的宽度
    }

    const title = (
      <span>
        <LinkButton>
          <Icon type="arrow-left" style={{fontSize: 20}}></Icon>
        </LinkButton>
        <span>添加商品</span>
      </span>
    )

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            <Input placeholder="请输入商品名称"></Input>
          </Item>
          <Item label="商品描述">
            <TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6}}></TextArea>
          </Item>
          <Item label="商品价格">
            <Input type="number" placeholder="请输入商品价格" addonAfter="元"></Input>
          </Item>
        </Form>
      </Card>
    )
  }
} 
