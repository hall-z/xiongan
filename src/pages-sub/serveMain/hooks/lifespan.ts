import { getCardExpirationDate } from '@/service/api/cardServe'
import { useUserStore } from '@/store'
import { dataDesensitization, isValidChinaID, isValidName, isValidPhone, isUnder16 } from '@/utils'
import { useRequest } from 'alova/client'

const { userInfo } = useUserStore()
// 获取验证码
const { getCodeUrl, codeflog } = useImageVerify()
// 本人认证信息提交
// const modelMe = reactive({
//   cardName: userInfo.cardName,
//   nameTm: userInfo.cardNameTm,
//   cardCode: userInfo.idCardNumber,
//   idCardNumberTm: userInfo.idCardNumberTm,
//   applyType: '1',
// })

const rulesMe = {
  phoneNumber: [
    { required: true, message: '请输入手机号码' },
    {
      required: true,
      message: '请输入正确的手机号码',
      validator: (val) => {
        return isValidPhone(val)
      },
    },
  ],
}

// 他人认证信息提交
const modelOther = reactive({
  cardName: '',
  cardCode: '',
  familyRelation: '',
  verifyCode: '',
  UUID: codeflog,
  applyType: '2',
})

const rulesOther = {
  cardName: [
    { required: true, message: '请输入姓名' },
    {
      required: true,
      message: '请输入正确的姓名',
      validator: (val) => {
        if (!isValidName(val)) {
          return Promise.reject(new Error('请输入正确的姓名'))
        } else if (val === userInfo.cardName) {
          return Promise.reject(new Error('姓名不能和本人相同'))
        } else {
          return Promise.resolve()
        }
      },
    },
  ],
  cardCode: [
    { required: true, message: '证件号码不能为空' },
    {
      required: true,
      message: '证件号码格式不正确',
      validator: (val) => {
        if (!isValidChinaID(val)) {
          return Promise.reject(new Error('证件号码格式不正确'))
        } else if (val === userInfo.idCardNumber) {
          return Promise.reject(new Error('证件号码不能和本人相同'))
        } else {
          return Promise.resolve()
        }
      },
    },
  ],
  familyRelation: [{ required: true, message: '请选择亲属关系' }],
  verifyCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
}

const { loading, send: sendtCardExpirationDate } = useRequest(
  (data) => getCardExpirationDate(data),
  {
    immediate: false,
    loading: false,
  },
)

export { loading, modelOther, rulesMe, rulesOther, sendtCardExpirationDate }
