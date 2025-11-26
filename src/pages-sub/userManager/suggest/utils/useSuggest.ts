import { addBusinessAdvice, getAdvicelist, getDetailByAdviceId } from '@/service/api/userMessage'
import { List } from '@/service/model/baseModel'
import { useForm, useRequest } from 'alova/client'
import { detilProp } from './types'
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
    value: 1,
    isSwitch: 1,
    bg: 'background: #F5EDF9; color:#9521D8;width:97px',
  },
  {
    label: '已办结',
    value: 2,
    isSwitch: 0,
    bg: 'background: #F0F9ED; color:#4EA833',
  },
  {
    label: '已办结',
    value: 2,
    isSwitch: 1,
    bg: 'background: #F0F9ED; color:#4EA833',
  },
])

const submitStatus = ref(false)
const adviceType = ref([
  {
    label: '业务咨询',
    value: 1,
  },
  {
    label: '投诉举报',
    value: 2,
  },

  {
    label: '友好建议',
    value: 3,
  },
  {
    label: '其他',
    value: 4,
  },
])

// 反馈列表
const { send: sendAdvicelist, data: advicelist } = useRequest((data) => getAdvicelist<List>(data), {
  immediate: false,
  loading: false,
  initialData: {},
})

// 反馈详情
const { send: sendDetail, data: detilData } = useRequest(
  (data: any) => getDetailByAdviceId<detilProp>(data),
  {
    immediate: false,
    loading: false,
    initialData: {},
  },
)

// 投诉建议

const rules = {
  feedbackImg: [{ required: true, message: '请上传图片', trigger: 'blur' }],
  feedbackPhone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  feedbackContent: [{ required: true, message: '请输入投诉建议内容', trigger: 'blur' }],
}
const checkType = (val) => {
  const obj = adviceType.value.find((it) => it.value === val)
  return obj?.label
}

const {
  send: sendBusinessAdvice,
  form: model,
  reset,
} = useForm((data) => addBusinessAdvice(data), {
  immediate: false,
  loading: false,
  resetAfterSubmiting: true,
  initialForm: {
    sourceFlag: 2,
    feedbackPhone: '',
    feedbackType: 1,
    feedbackContent: '',
    feedbackImg: '',
  },
})

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
  }
}
