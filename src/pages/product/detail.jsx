import React, { Component } from 'react'
import { Card, Icon, List } from 'antd'
const Item = List.Item

export default class ProductDetail extends Component {
  render () {
    const title = (
      <span>
        <Icon type="arrow-left"></Icon>
        <span>商品详情</span>
      </span>
    )

    return (
      <Card title={title} className="product-detail">
        <List>
          <Item>
            <span className="left">商品名称：</span>
            <span>联想电脑 480</span>
          </Item>
          <Item>
            <span className="left">商品描述：</span>
            <span>联想电脑 480</span>
          </Item>
          <Item>
            <span className="left">商品价格：</span>
            <span>6600 元</span>
          </Item>
          <Item>
            <span className="left">所属分类：</span>
            <span>电脑 -- 笔记本</span>
          </Item>
          <Item>
            <span className="left">商品图片：</span>
            <span>
              <img className="product-img" src="" alt="img"></img>
              <img className="product-img" src="" alt="img"></img>
            </span>
          </Item>
          <Item>
            <span className="left">商品详情：</span>
            <span dangerouslySetInnerHTML={{_html: '<h1 style="color: red">商品详情的内容标题</h1>'}}></span>
          </Item>
        </List>
      </Card>
    )
  }
} 
