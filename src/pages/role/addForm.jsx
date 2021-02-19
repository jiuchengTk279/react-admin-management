import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const Item = Form.Item

class AddForm extends Component {

  static propTypes = {
    // 用来传递form对象的函数
    setForm: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render () {

    const { getFieldDecorator } = this.props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 15} // 右侧包裹的宽度
    }

    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
          {
            getFieldDecorator('roleName', {
              initialValue: '',
              rules: [{ required: true, message: '角色名称必须输入'}]
            })(
            <Input placeholder="请输入角色名称"></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)