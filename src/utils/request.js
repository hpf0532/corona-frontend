import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Router from '@/router/index'
import { resetRouter } from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log(res)

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    //
    //   if (response.status !== 200) {
    //     console.log(res)
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    // } else {
    //   return res
    // }
    return res
  },
  error => {
    const errData = error.response.data

    if (error.response) {
      switch (error.response.status) {
        case 400:
          Notification({
            message: errData.message,
            type: 'error',
            title: '错误'
          })
          break

          case 403:
            Notification({
              message: errData.message,
              type: 'error',
              title: '错误'
            })
            break
        case 404:
          Router.push({ path: '/error/404' })
          break

        case 401:
          // 返回401清楚token信息并跳转到登陆页面
          removeToken()
          resetRouter()
          store.commit('user/RESET_STATE')
          console.log(Router.currentRoute.fullPath)
          Router.replace({
            path: '/login',
            query: { redirect: Router.currentRoute.fullPath }
          })
          Message({
            message: errData.message,
            type: 'error',
            duration: 5 * 1000
          })
          break
        case 422:
          let errArr = new Array()
          const { errors: { json }} = error.response.data
          console.log(json)
          Object.keys(json).forEach(key => {
            console.log(json[key])
            errArr = errArr.concat(json[key])
          })
          console.log(errArr)
          errArr.forEach((element) => {
            setTimeout(() => {
              Notification({
                message: element,
                type: 'error',
                title: '错误'
              }), 0
            })
          })
          break
        default:
          Notification({
            message: '内部错误',
            type: 'error',
            title: '错误'
          })
      }
    }

    // console.log('err' + errData) // for debug

    return Promise.reject(error)
  }
)

export default service
