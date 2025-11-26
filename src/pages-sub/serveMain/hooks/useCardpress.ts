import { getCardPaymentInfo, getCardScheduleInfo } from '@/service/api/cardServe'
import { useUserStore } from '@/store/user'
import { routeTo } from '@/utils'
import { useForm } from 'alova/client'
import { statusTisProps } from '../types/types'

const userStore = useUserStore()
const { userInfo } = userStore

const rules = {
  xm: [{ required: true, message: '请输入姓名' }],
  zjhm: [{ required: true, message: '请输入证件号码' }],
}

// 卡进度查询
const {
  loading,
  send: sendCard,
  form: model,
  reset,
} = useForm(
  (formData) => {
    const params = {
      xm: formData.xm === userInfo.cardNameTm ? userInfo.cardName : formData.xm,
      zjhm: formData.zjhm === userInfo.idCardNumberTm ? userInfo.idCardNumber : formData.zjhm,
    }
    // console.log(params, 'params')
    // console.log(userInfo, 'userInfo')

    // setTimeout(() => {
    //   model.value.xm = maskString(params.xm, 1)
    //   model.value.zjhm = maskString(params.xm, 4)
    // }, 200)

    // 可以在此转换表单数据并提交
    return getCardScheduleInfo(params)
  },
  {
    immediate: false,
    loading: false,
    // 设置这个参数为true即可在提交完成后自动重置表单数据
    resetAfterSubmiting: true,
    // 初始化表单数据
    initialForm: {
      xm: userInfo.cardNameTm,
      zjhm: userInfo.idCardNumberTm,
      // xm: '王冬',
      // zjhm: '321087197912280054',
    },
  },
)
const serchBtnStatus = ref(false)
const statusDel = ref<statusTisProps>({
  msg: '',
})
const submitStatus = ref(false)
const cardInfoData = ref<any>(null)
const cardQury = async (type: any, date: any) => {
  routeTo({
    url: '/pages-sub/serveMain/handleCardProgress',
    data: { xm: date.name, zjhm: date.idCardNumber },
  })
  // try {
  //   const data: any = await sendCard()
  //   cardInfoData.value = data.data
  //   routeTo({
  //     url: '/pages-sub/serveMain/handleCardProgress',
  //     data: { xm: date.name, zjhm: date.idCardNumber },
  //   })
  // } catch (error) {
  //   console.log(error, 'error')
  //
  //   submitStatus.value = true

  //   // 说明网络失败
  //   if (error.err && error.err.toString().indexOf('request:fail') >= 0) {
  //     statusDel.value.msg = '网络卡顿，请稍候重试!'
  //   } else {
  //     statusDel.value = error.data ?? '查询出数据出错了!'
  //   }
  // }
  // }
  // })
}

const {
  send: sendCardMail,
  form: model2,
  // data: cardMailData,
} = useForm(
  (formData) => {
    // data.xm = userInfo.cardName
    // data.zjhm = userInfo.idCardNumber

    const params = {
      xm: formData.xm ? formData.xm : userInfo.cardName,
      zjhm: formData.zjhm ? formData.zjhm : userInfo.idCardNumber,
    }
    console.log(params, 'params--------')
    return getCardPaymentInfo(params)
  },
  {
    immediate: false,
    loading: false,
    // 初始化表单数据
    initialForm: {
      xm: '',
      zjhm: '',
    },
    initialData: [],
  },
)

const maskString = (str, len = 4) => {
  if (str.length <= len) return str
  return '*'.repeat(str.length - len) + str.slice(-len)
}

export default () => {
  return {
    cardQury,
    cardInfoData,
    model,
    rules,
    loading,
    submitStatus,
    statusDel,
    serchBtnStatus,
    sendCardMail,
    model2,
    // cardMailData,
    reset,
  }
}
