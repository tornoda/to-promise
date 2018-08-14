//index.js
//引入之前准备好的转换过后的API
import { request, setStorage } from '../../utils/promiseApi'

const DOUYU_API = 'http://open.douyucdn.cn/api/RoomApi/game'

Page({
  onReady: () => {
    request({ url: DOUYU_API })//请求网络数据
      .then(
        (res) => {//请求网络数据成功
          console.log('获取斗鱼api信息成功：')
          console.log(res)
          return Promise.resolve(res)
        },
        (err) => {//请求网络数据失败
          console.log('请求失败：')
          console.log(err)
          return Promise.reject(err)
        }
      )
      .then(
        (data) => {
          console.log('把信息写入storage中。。。')
          //保存到storage, 返回一个未知状态的Promise
          return setStorage({
            key: "douyu",
            data: data
          })
        }
      )
      .then( 
        (successMsg) => { //保存到storage成功
          console.log('写入storage成功，返回的消息为：')
          console.log(successMsg)
          //这里还可以继续调用转换后的方法。
        },
        (err) => { //保存到storage失败
          console.log('写入storage失败，返回的消息为：')
          console.log(err)
        }
      )
  }
})
