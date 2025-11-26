import { SeverPassRest } from '@/service/api/cardServe'
import { useUserStore } from '@/store/user'
import { useForm } from 'alova/client'
const { userInfo } = useUserStore()

// 服务密码重置
const {
  loading,
  send: sendCardPassword,
  form: model,
} = useForm(
  (formData) => {
    const params = {
      ...formData,
      userName: userInfo.cardName,
      cardNumber: userInfo.idCardNumber,
      socialScCardNumber:
        formData.socialScCardNumber === userInfo.socialCardTm
          ? userInfo.socialCard
          : formData.socialScCardNumber,
    }
    // 可以在此转换表单数据并提交
    return SeverPassRest(params)
  },

  {
    immediate: false,
    loading: false,
    // 初始化表单数据
    resetAfterSubmiting: true,
    initialForm: {
      userName: userInfo.cardNameTm,
      cardNumber: userInfo.idCardNumberTm,
      socialScCardNumber: userInfo.socialCardTm,
      resetPassword: '',
      operator: userInfo.cardName,
      resetPasswordTwo: '',
    },
  },
)
const rules = {
  userName: [{ required: true, message: '请输入姓名' }],
  cardNumber: [{ required: true, message: '请输入证件号码' }],
  resetPassword: [
    { required: true, message: '请输入新密码' },
    { pattern: /^\d{6}$/, message: '密码必须为6位数字' },
  ],
  operator: [{ required: true, message: '请输入操作员' }],
  socialScCardNumber: [{ required: true, message: '请输入社会保障卡号' }],
  resetPasswordTwo: [
    { pattern: /^\d{6}$/, message: '密码必须为6位数字' },
    {
      required: true,
      message: '请输入确认密码',
      validator: (val: any) => {
        if (val === model.value.resetPassword) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('两次新密输入不一致'))
        }
      },
    },
  ],
}
export default () => {
  return {
    rules,
    model,
    sendCardPassword,
    loading,
  }
}
