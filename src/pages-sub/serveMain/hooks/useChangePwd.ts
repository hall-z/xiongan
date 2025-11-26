import { changeCardPwd } from '@/service/api/cardServe'
import { useUserStore } from '@/store/user'

import { Toast } from '@/utils/uniapi/prompt'
import { useForm } from 'alova/client'
import { statusTisProps } from '../types/types'
const { userInfo } = useUserStore()

const statusDel = ref<statusTisProps>()
const submitStatus = ref(false)

// 服务密码修改
const {
  loading,
  send: sendChangeCardPwd,
  form: model,
} = useForm(
  (formData) => {
    const params = {
      ...formData,
      xm: userInfo.cardName,
      zjhm: userInfo.idCardNumber,
      shbzkh: formData.shbzkh === userInfo.socialCardTm ? userInfo.socialCard : formData.shbzkh,
    }
    // 可以在此转换表单数据并提交
    return changeCardPwd(params)
  },

  {
    immediate: false,
    loading: false,
    // 初始化表单数据
    resetAfterSubmiting: true,
    initialForm: {
      xm: userInfo.cardNameTm,
      zjhm: userInfo.idCardNumberTm,
      shbzkh: userInfo.socialCardTm,
      oldPwd: '',
      newPwd: '',
      newPwdTwo: '',
      jbr: userInfo.cardName,
    },
  },
)

const rules = {
  xm: [{ required: true, message: '请输入姓名' }],
  zjhm: [{ required: true, message: '请输入证件号码' }],
  shbzkh: [{ required: true, message: '请输入社会保障卡号' }],
  oldPwd: [
    { required: true, message: '请输入旧密码' },
    { pattern: /^\d{6}$/, message: '密码必须为6位数字' },
  ],
  newPwd: [
    { required: true, message: '请输入新密码' },
    { pattern: /^\d{6}$/, message: '密码必须为6位数字' },
  ],
  newPwdTwo: [
    { pattern: /^\d{6}$/, message: '密码必须为6位数字' },
    {
      required: true,
      message: '请输入确认密码',
      validator: (val: any) => {
        if (val === model.value.newPwd) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('两次新密输入不一致'))
        }
      },
    },
  ],
  // jbr: [{ required: true, message: '请输入经办人' }],
}
const submitPasswoed = (form) => {
  console.log('submitPasswoed...........')
  form.validate().then(async ({ valid, errors }) => {
    if (valid) {
      try {
        const params = {
          xm: userInfo.cardNameTm,
          zjhm: userInfo.idCardNumberTm,
          shbzkh: userInfo.socialCardTm,
          oldPwd: model.value.oldPwd,
          newPwd: model.value.newPwd,
          newPwdTwo: model.value.newPwdTwo,
          jbr: userInfo.cardName,
        }
        const data: any = await sendChangeCardPwd(params)
        submitStatus.value = true
        statusDel.value = data.data
      } catch (error) {
        Toast(error.data.msg)
      }
    }
  })
}
const read = ref(false)
export default () => {
  console.log('🥗', model.value)
  return {
    loading,
    sendChangeCardPwd,
    submitPasswoed,
    statusDel,
    rules,
    model,
    submitStatus,
  }
}
