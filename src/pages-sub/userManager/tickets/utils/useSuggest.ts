import { getsubmitTickets } from '@/service/api/shop'
import {
  getOrderInterferePage,
  getOrderInterfereStatus,
  replyOrderInterfere,
} from '@/service/api/userMessage'
import { List } from '@/service/model/baseModel'
import { useUserStore } from '@/store'
import { useForm, useRequest } from 'alova/client'
import { detilProp } from './types'

const userStore = useUserStore()
const statusList = ref([
  {
    label: '待处理',
    value: 0,
    isSwitch: 0,
    bg: 'background:#FCF4E7; color:#EB7113',
  },
  {
    label: '客服处理中',
    value: 1,
    isSwitch: 0,
    bg: 'background: #F0F5FE; color:#2D69EF;width:97px',
  },
  {
    label: '专席处理中',
    value: 2,
    isSwitch: 1,
    bg: 'background: #F5EDF9; color:#9521D8;width:97px',
  },
  {
    label: '已办结',
    value: 3,
    isSwitch: 1,
    bg: 'background: #F0F9ED; color:#4EA833',
  },
])

const submitStatus = ref(false)
const adviceType = ref([
  { value: 1, label: '虚假发货' },
  { value: 2, label: '拒开发票' },
  { value: 3, label: '不发货' },
  {
    value: 4,
    label: '其他',
  },
])

const changeStatus = (val) => {
  const status = statusList.value.find((it) => it.value === val)
  return status
}

// 反馈列表
const { send: sendAdvicelist, data: advicelist } = useRequest(
  (data) => getOrderInterferePage<List>(data),
  {
    immediate: false,
    loading: false,
    initialData: {},
  },
)

// 反馈详情
const { send: sendDetail, data: detilData } = useRequest(
  (data: any) => replyOrderInterfere<detilProp>(data),
  {
    immediate: false,
    loading: false,
    initialData: {},
  },
)

// 投诉建议

const rules = {
  imageListstr: [{ required: true, message: '请上传图片', trigger: 'blur' }],
  createPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^(\+86\s?)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  interfereContent: [
    { required: true, message: '请输入投诉建议内容', trigger: 'blur' },
    {
      pattern: /^[^@#$%^&*+\-=[\]{}()|<>/?]+$/,
      message: '投诉建议内容不能包含特殊字符',
      trigger: 'blur',
    },
  ],
}
const checkType = (val) => {
  const obj = adviceType.value.find((it) => it.value === val)
  return obj?.label
}

const {
  send: sendBusinessAdvice,
  form: model,
  reset,
} = useForm(
  (data) => {
    const params = { ...data, voucherUrl: data!.voucherUrl.split(',') }
    return getsubmitTickets(params)
  },
  {
    immediate: false,
    loading: false,
    resetAfterSubmiting: true,
    initialForm: {
      orderId: '',
      reasonType: 4,
      interfereContent: '',
      voucherUrl: '',
      createPhone: '',
      userId: userStore.userInfo.userDId,
      cardId: userStore.userInfo.cardId,
    },
  },
)

const checkStatus = (item, type) => {
  const status = statusList.value.find(
    (it) => it.value === item.feedbackStatus && it.isSwitch === item.isSwitch,
  )
  const data = type === 'style' ? status?.bg : status?.label
  return data
}

const submit = async (form, flog?: boolean) => {
  if (flog) {
    console.log('🍤')
  } else {
    const { valid, value } = await form.validate()
    console.log('表单验证valid', valid, value)
    if (!valid) {
      return false
    }
  }
  try {
    const data: any = await sendBusinessAdvice()
    submitStatus.value = true
  } catch (error) {
    console.log('🍲[error]:', error)
  }
}
const { send: sendOrderInterfereStatus, data: interfereStatuData } = useRequest(
  (data) => getOrderInterfereStatus(data),
  {
    immediate: false,
    loading: false,
  },
)

export default () => {
  return {
    sendBusinessAdvice,
    submit,
    adviceType,
    sendAdvicelist,
    advicelist,
    sendDetail,
    detilData,
    model,
    reset,
    rules,
    checkStatus,
    submitStatus,
    checkType,
    sendOrderInterfereStatus,
    interfereStatuData,
    statusList,
    changeStatus,
  }
}
