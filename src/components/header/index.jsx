import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import LinkButton from '../linkButton'
import { reqWeather } from '../../api'
import { logout } from '../../redux/actions'
import './index.less'

const { confirm } = Modal
class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()), // 当前时间字符串
    dayPictureUrl: '', // 天气图片url
    weather: '' // 天气的文本
  }

  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({ currentTime })
    }, 1000)
  }

  getWeather = async () => {
    const { dayPictureUrl, weather } = await reqWeather('北京')
    this.setState({ dayPictureUrl, weather })
  }

  getTitle = () => {
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  logout = () => {
    confirm({
      // title: '警告提示',
      content: '确定退出吗？',
      onOk: () => {
        // // 删除保存的 user 数据
        // storageUtils.removeUser()
        // memoryUtils.user = {}
        // // 跳转到 login
        // this.props.history.replace('/login')
        // message.success('退出成功')

        this.props.logout()
        message.success('退出成功')
      },
      onCancel() {
        message.info('已取消退出')
      },
    });
  }

  // 第一次render()之后执行一次
  // 般在此执行异步操作: 发ajax请求/启动定时器
  componentDidMount () {
    // 获取当前的时间
    this.getTime()
    // 获取当前天气
    this.getWeather()
  }

  // 当前组件卸载之前调用
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }

  render () {
    const { currentTime, dayPictureUrl, weather } = this.state
    // const username = memoryUtils.user.username
    const username = this.props.user.username
    // const title = this.getTitle()
    const title = this.props.headTitle

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{ username }</span>
          <LinkButton href="javascript:" onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{ title }</div>
          <div className="header-bottom-right">
            <span>{ currentTime }</span>
            <img src={ dayPictureUrl } alt="weather"></img>
            <span>{ weather }</span>
          </div>
        </div>
      </div>
    )
  }
}

// export default withRouter(Header)
export default connect(
  state => ({ headTitle: state.headTitle, user: state.user }),
  {logout}
)(withRouter(Header))
