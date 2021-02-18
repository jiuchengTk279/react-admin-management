import React, { Component } from 'react'
import { Card, Icon, Form, Input, Cascader, Button, message } from 'antd'
import LinkButton from '../../components/linkButton'
import { reqCategories } from '../../api'

const {Item} = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {

  state = {
    options: []
  }

  // 初始化配置
  initOptions = async (categories) => {
    // 根据 categories 生成 options 数组
    const options = categories.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }))

    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this
    const { pCategoryId, categoryId } = product
    if (isUpdate && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategories = await this.getCategories(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategories.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联对应的一级option上
      targetOption.children = childOptions
    }

    // 更新options状态
    this.setState({ options })
  }

  // 异步获取一级/二级分类列表, 并显示
  // async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
  getCategories = async (parentId) => {
    const result = await reqCategories(parentId) // {status: 0, data: categories}
    if (result.status === 0) {
      const categories = result.data
      if (parentId === '0') { // 一级分类列表
        this.initOptions(categories)
      } else { // 二级列表
        // 返回二级列表 ==> 当前async函数返回的 promise 就会成功且value为 categories
        return categories
      }
    }
  }

  // 提交表单
  submit = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log('发送ajax请求')
      }
    })
  }

  // 用加载下一级列表的回调函数
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0]
    // 显示loading
    targetOption.loading = true

    // 根据选中的分类, 请求获取二级分类列表
    const subCategories = await this.getCategories(targetOption.value)
    // 隐藏 loading
    targetOption.loading = false
    // 二级分类数组有数据
    if (subCategories && subCategories.length > 0) {
      // 生成一个二级列表的options
      const childOptions = subCategories.map(c => ({
        value: c._id,
        label: c._name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options]
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

  componentDidMount () {
    this.getCategories('0')
  }

  componentWillMount () {
    // 取出携带的state
    // 如果是添加没值, 否则有值
    const product = this.props.location.state
    // 保存是否是更新的标识
    this.isUpdate = !!product
    // 保存商品(如果没有, 保存是{})
    this.product = product || {}
  }

  render () {

    const { isUpdate, product } = this
    const { pCategoryId, categoryId } = product
    // 用来接收级联分类ID的数组
    const categoryIds = []
    if (isUpdate) {
      // 商品是一个一级分类的商品
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2}, // 左侧label的宽度
      wrapperCol: { span: 8} // 右侧包裹的宽度
    }

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{fontSize: 20}}></Icon>
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    const { getFieldDecorator } = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [{ required: true, message: '必须输入商品名称'}]
              })(<Input placeholder="请输入商品名称"></Input>)
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [{ required: true, message: '必须输入商品描述'}]
              })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6}}></TextArea>)
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, message: '必须输入商品价格'},
                  { validator: this.validatePrice }
                ]
              })(<Input type="number" placeholder="请输入商品价格" addonAfter="元"></Input>)
            }
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [{ required: true, message: '必须指定商品分类'}]
              })(
                <Cascader
                  placeholder="请指定商品分类"
                  options={this.state.options} /*需要显示的列表数据数组*/
                  loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
              ></Cascader>)
            }
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
