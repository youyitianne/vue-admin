import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 15000 // 请求超时时间
})


// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      let token = 'Bearer '+getToken()
      config.headers['Authorization'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data

    if (res.msg=='Unauthorized'||res.status==status){
      console.error(res)
      console.error('--------》权限不足')
      // Message({
      //   message:'权限不足',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
    }
    if (res.code === 50020) {           //登录失败 自定义
      return Promise.reject('登录失败，请检查帐号密码是否正确')
    }
    if (res.code===50009) {
      Message({
        message: res.data,
        type: 'error',
        duration: 5 * 1000
      })
      return
    }

    if (res.code !== 20000) {     //下载文件跳过 自定义
      if (response.statusText=="wenjian"){
        return response.data
      }

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      // console.log('++++++++++')
      // console.log(response.headers)
      // console.log(response)
      // console.log('+++++++')
      // //下载文件根据datatype辨认 跳过拦截
      // return response.data  //test

      if (response.data.type==='application/octet-stream'){
        return response.data
      }
      return Promise.reject('bad code')
    } else {
      return response.data
    }
  },
  error => {
    console.log( "请检查网络连接"+error) // for debug
    Message({
      message:'请检查网络连接 ！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
