import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import memoryUtils from '../../utils/memoryUtils'
import MHeader from '../../components/header'
import LeftNav from '../../components/leftNav'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../notFound/notFound'

const { Footer, Sider, Content } = Layout

// 后台管理的路由组件
class Admin extends Component {
  render () {

    // const user = memoryUtils.user
    const user = this.props.user
     // 如果内存没有存储 user ==> 当前没有登陆
    if (!user || !user._id) {
      // 自动跳转到登陆 (在render()中)
      return <Redirect to="/login"></Redirect>
    }

    return (
      <Layout style={{height: '100%'}}>
        <Sider>
          <LeftNav></LeftNav>
        </Sider>
        <Layout>
          <MHeader>Header</MHeader>
          <Content style={{margin: 20, backgroundColor: '#fff'}}>
            <Switch>
              <Redirect from="/" exact to="/home"></Redirect>
              <Route path="/home" component={Home}></Route>
              <Route path="/category" component={Category}></Route>
              <Route path="/product" component={Product}></Route>
              <Route path="/role" component={Role}></Route>
              <Route path="/user" component={User}></Route>
              <Route path="/charts/bar" component={Bar}></Route>
              <Route path="/charts/line" component={Line}></Route>
              <Route path="/charts/pie" component={Pie}></Route>
              <Route component={NotFound}></Route>
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {}
)(Admin)
