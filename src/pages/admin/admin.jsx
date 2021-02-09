import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Layout } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import MHeader from '../../components/header'
import LeftNav from '../../components/leftNav'

const { Header, Footer, Sider, Content } = Layout

// 后台管理的路由组件
export default class Admin extends Component {
  render () {

    const user = memoryUtils.user
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
          <Content style={{margin: 20, backgroundColor: '#fff'}}>Content</Content>
          <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
