**`to-promise`是一个转换微信小程序异步API为Promise的一个工具库**

# 优点

1. 避免小程序异步编程多次回调带来的过多回调导致逻辑不清晰，篇幅过长等问题。
2. 借助于Promise异步编程特点，支持链式操作，像同步一样写异步。
3. 转化后得API几乎和微信官方API一样。

# 使用方法

1. 安装

- 使用`git`安装到`项目根目录/module`,
```
git clone https://github.com/tornoda/to-promise
```
- 或直接下载放入项目目录下如：`/module`

2. 在需要用到的地方引入

```
import toPromise from '/module/to-promise/src/index'
```

3. 绑定微信全局对象(`wx`)到函数，以便可以取到微信得API
```
const toPromiseWx = toPromise(wx)
```

4. 开始转化你需要得异步API
```
//apiName为微信异步方法名，如对wx.request()进行转化
const request = toPromiseWx('request')
//直接使用request方法
```

# 举例

```
import toPromise from '/module/to-promise/src/index'

//转换wx.getStorage()
const getStorage = toPromsie(wx)('getStorage') 

//使用
getStorage({ key: 'test' })
  .then(
    (res) => {
      //res的值与wx.getStorage({ success: (res) => {} })中的res值一样
      //res = {data: 'keyValue'}
      console.log(res.data)//控制台打印storage中key对于的value
      return res.data//如果需要继续链式调用转化后的api，需要把值显示返回
    },
    (err) => {
      //err的值与wx.getStorage({ success: (err) => {} })中的err值一样
      throw err
    }
  )
```

> 关于Promise对象的使用，请参见[Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

# API

- toPromise(global)

参数

(wx): `wx`全局对象。即`toPromise(wx)`这样调用

返回

(function): 参数(string)为小程序异步方法名。返回一个函数，该函数的参数与返回值如下。

**参数**：(object) 对应wx小程序异步方法中的参数(OBJECT)除去`success`与`fail`后的对象。例如：

官方API`wx.getLocation(OBJECT)`的`OBJECT`接受如下属性： `type` `altitude` `success` `fail` `complete`，那么去除（`success` `fail`）后为：`type` `altitude` `complete`。

**返回**: (pending Promsise) 返回一个未知状态的Promise对象，在该对象上调用.then(onFulfilled, onRejected)方法来处理对用成功或失败的情况。onFulfilled为请求成功后调用的回调函数，参数为返回值，onRejected为请求失败后的回调函数，参数为返回的错误信息。

简单点来说，
```
const getLocation = toPromiseWx('getLocation')
getLocation({
  type: 'wgs84',
  altitude: true,
  complete: () => { console.log('to-promsise is awesome') }
}).then(
  (res) => {//dosomething if succeed},
  (err) => {//dosomething if failed}
)
```

与下面官方调用等价

```
wx.getLocation({
  type: 'wgs84',
  altitude: true,
  complete: () => { console.log('to-promsise is awesome') },
  success: (res) => {//dosomething if succeed},
  fail: (err) => {//dosomething if failed}
})
```

# 应用场景举例

1. 单次异步调用，参见API最后
2. 多次异步操作调用，且每下一次调用都会用到前一次返回的结果。
如：获得GPS信息后，根据GPS信息获取天气信息，取得天气信息后立马存入localStorage。
```
import toPromise from '/module/to-promise/src/index'

const toPromiseWx = toPrmise(wx)

//方法转换
const getLocation = toPromiseWx('getLocation')
const request = toPromiseWx('request')
const setStorage = toPromiseWx('setStorage')

//链式写逻辑
getLocation() //获取位置信息
  .then(
    (res) => { //位置获取成功后的处理，res为返回信息
      //处理res后返回有用的信息，这里直接返回res，用于演示
      return Promise.resolve(res) //必须
    },
    (err) => { //位置获取失败后的错误处理，err为错误信息
      //错误处理
      return Promise.resolve(err) //必须
    }
  )
  .then(
    (res) => { //根据位置获取成功后的信息，请求天气信息
      return request({ url: 'http://api.weather.com'}) //返回一个pending 状态下的Promise
    }
  )
  .then(
    (res) => {  //天气获取成功后存入storage的回调
      setStorage({
        key: 'test',
        data: 'res'
      })
    },
    (err) => {
      //天气获取失败后执行这里，err为获取天气失败的错误信息
    }
  )
```

如果使用官方的API写上述逻辑，代码是这样的：

```
wx.getLocation({
  success: (res) => {
    //some transformation with res
    wx.request({
      url: 'http://api.weather.com',
      success: (res) => {
        wx.setStorage({
          success: () => {
            //do something
          },
          fail: (err) => {
            //do something if err happend
          }
        })
      },
      fail: (err) => {
        //do something if err happend
      }
    })
  },
  fail: (err) => {
    //do something if err happend
})
//层层回调，如果逻辑再复杂点，可能就疯了
```

# DEMO

用微信web开发者工具打开demo文件夹，查看`/page/index.js` `/utils/promiseApi.js` 和控制台消息
