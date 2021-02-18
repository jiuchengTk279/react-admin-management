import React, { Component } from 'react'
import { Card, Icon, Form, Input, Cascader, Button, message } from 'antd'
import LinkButton from '../../components/linkButton'

const {Item} = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {

  // 提交表单
  submit = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log('发送ajax请求')
      }
    })
  }

  // 验证价格的自定义验证函数
  validatePrice = (rule, value, callback) => {
    if (value*1 > 0) {
      callback() // 验证通过
    } else {
      callback('价格必须大于0') // 验证没通过
    }
  }

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

    const { getFieldDecorator } = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {
              getFieldDecorator('name', {
                initialValue: '',
                rules: [{ required: true, message: '必须输入商品名称'}]
              })(<Input placeholder="请输入商品名称"></Input>)
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: '',
                rules: [{ required: true, message: '必须输入商品描述'}]
              })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6}}></TextArea>)
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: '',
                rules: [
                  { required: true, message: '必须输入商品价格'},
                  { validator: this.validatePrice }
                ]
              })(<Input type="number" placeholder="请输入商品价格" addonAfter="元"></Input>)
            }
          </Item>
          <Item label="商品分类">
            <div>商品分类</div>
          </Item>
          <Item label="商品图片">
            <div>商品图片</div>
          </Item>
          <Item label="商品详情">
            <div>商品详情</div>
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
} 

export default Form.create()(ProductAddUpdate)
