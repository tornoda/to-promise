import toPromise from '../module/to-promise/index'

//把小程序的全局对象wx引入函数作用域
const toPromiseWx = toPromise(wx)

//把转化后的方法暴露
//调用这些方法，会返回一个未知状态的Promise对象
export const request = toPromiseWx('request')
export const setStorage = toPromiseWx('setStorage')