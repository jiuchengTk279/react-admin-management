import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'
import LinkButton from '../../components/linkButton'
import { reqProducts, reqSearchProducts } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option
export default class ProductHome extends Component {

  state = {
    total: 0, // 商品的总数量
    products: [], // 商品的数组
    loading: false, // 是否正在加载中
    searchName: '', // 搜索的关键字
    searchType: 'productName', // 根据哪个字段搜索
  }

  // 初始化table的列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        // 当前指定了对应的属性, 传入的是对应的属性值
        render: (price) => '￥' + price
      },
      {
        width: 100,
        title: '状态',
        dataIndex: 'status',
        render: (status) => {
          return (
            <span>
              <Button type="primary">下架</Button>
              <span>在售</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              <LinkButton>详情</LinkButton>
              <LinkButton>修改</LinkButton>
            </span>
          )
        }
      }
    ]
  } 
  
  // 获取指定页码的列表数据显示
  getProducts = async (pageNum) => {
    this.setState({ loading: true})

    const { searchName, searchType } = this.state
    let result
    // 如果搜索关键字有值, 说明我们要做搜索分页
    if (searchName) {
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType })
    } else {
      // 一般分页请求
      result = await reqProducts(pageNum, PAGE_SIZE)
    }

    this.setState({ loading: false})
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      const { total, list } = result.data
      this.setState({
        total,
        products: list
      })
    }
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getProducts(1)
  }

  render () {

    // 取出状态数据
    const { products, total, loading, searchName, searchType } = this.state
    const title = (
      <span>
        <Select value={searchType} style={{width: 150}} onChange={value => this.setState({searchType: value})}>
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input value={searchName} placeholder="关键字" style={{width: 150, margin: '0 15px'}} onChange={event => this.setState({ searchName: event.target.value})}></Input>
        <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )

    const extra = (
      <Button type="primary">
        <Icon type="plus"></Icon>
        添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table 
          bordered
          loading={loading}
          rowKey='_id'
          dataSource={products}
          columns={this.columns}
          pagination={{
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
          >
        </Table>
      </Card>
    )
  }
} 
