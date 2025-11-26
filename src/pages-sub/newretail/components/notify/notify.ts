// notify.ts - Vue 3 notification utilities
import { getCurrentInstance } from 'vue'

interface NotifyOptions {
  selector?: string
  duration?: number
  text?: string
  [key: string]: any
}

const defaultOptions: NotifyOptions = {
  selector: '#notify',
  duration: 3000
}

function parseParam(params: string | NotifyOptions = ''): NotifyOptions {
  return typeof params === 'object'
    ? params
    : {
      text: params
    }
}

export default {
  show: function (options: NotifyOptions | string = {}): void {
    try {
      // 在Vue 3中，我们需要通过不同的方式获取组件实例
      const instance = getCurrentInstance()
      if (!instance) {
        console.warn('Notify: No current Vue instance found')
        return
      }

      // 合并选项
      options = Object.assign({}, defaultOptions, parseParam(options))

      // 查找通知组件并显示
      // 这里需要根据实际的组件结构来调整
      const notifyComponent = instance.refs?.[options.selector?.replace('#', '') || 'notify']
      if (notifyComponent) {
        // 显示通知
        console.log('显示通知:', options)
      } else {
        console.warn('Notify component not found')
      }
    } catch (error) {
      console.error('Notify show error:', error)
    }
  }
}
