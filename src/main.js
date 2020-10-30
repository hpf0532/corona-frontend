import Vue from 'vue'
import  qs from 'qs'

// import "bootstrap/dist/css/bootstrap.min.css"

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import * as filters from './filters' // global filters

// highlight.js
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/routeros.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import { message } from './utils/reset-message'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

Vue.prototype.$qs = qs

// 该设置影响上传组件展示进度条
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(VueHighlightJS)

Vue.prototype.$message = message;

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
