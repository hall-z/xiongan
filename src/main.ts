import '@/style/index.scss'
import 'virtual:uno.css'
import { createSSRApp } from 'vue'
// 全局mixins，用于实现setData等功能，请勿删除！';
// import zpMixins from '@/uni_modules/zp-mixins/index.js';
import App from './App.vue'
import { prototypeInterceptor, routeInterceptor } from './interceptors'
import store from './store'
import navigationBar from './components/navigation-bar/navigation-bar.vue'

import shareModule from '@/utils/share'
import homePageCommonBehavior from '@/utils/newretail/homePageCommonBehavior1'
uni.$zp = {
  config: {
    // 配置分页默认pageSize为15

    // 配置空数据图默认描述文字为：空空如也~~
    'empty-view-text': '空空如也~~',
    // ...
  },
}
export function createApp() {
  const app = createSSRApp(App)
  app.mixin(homePageCommonBehavior)
  // app.mixin(zpMixins)
  app.mixin(shareModule)
  app.component('navigationBar', navigationBar)
  app.use(store)
  app.use(routeInterceptor)
  app.use(prototypeInterceptor)
  return {
    app,
    store,
  }
}
