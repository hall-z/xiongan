import { routeTo } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { isArray } from 'wot-design-uni/components/common/util'

const rules = reactive({
  userName: [
    { required: true, message: '请输入收货人姓名' },
    // { required: false, pattern: /^\S+$/, message: '输入不合法' },
    {
      // pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
      pattern: /^[a-z0-9A-Z\u4e00-\u9fa5·]+(·[\u4e00-\u9fa5]+)*$|^[\u4e00-\u9fa5]{2,20}$/,
      message: '请输入正确的收货人姓名！',
    },
  ],
  userPhone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
  ],

  areaName: [
    {
      required: true,
      message: '请选择所在地区',
      validator: (value) => {
        if (isArray(value) && value.length) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('请选择所在地区'))
        }
      },
    },
  ],
  userAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { required: false, pattern: /^\S+$/, message: '输入不合法' },
    { required: false, pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/, message: '不支持表情和特殊字符' },
  ],
})

export default () => {
  return {
    rules,
    routeTo,
    Toast,
  }
}
