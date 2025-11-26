import {
  getCertPlanInfo,
  getCertRecordInfo,
  getCertResultInfo,
  getPreserRecords,
  getRecordDetailInfo,
  getWxCertInfo,
} from '@/service/api/certServe'
import { useUserStore } from '@/store'
import { dataDesensitization, isValidChinaID, isValidName, isValidPhone } from '@/utils'
import { useRequest } from 'alova/client'

const MSG_SCRIPT = {
  fail: '调用认证服务平台异常，请稍后再试！',
}
const CERT_STATE = {
  state_0: '未认证',
  state_1: '已认证',
  state_2: '已过期',
  state_3: '丧葬',
  state_4: '服刑',
}
const CERT_METHOD = {
  method_000: '民政丧葬',
  method_001: '人脸识别',
  method_002: '指纹识别',
  method_003: '掌静脉识别',
  method_004: '人工认证',
  method_005: '乘车记录',
  method_006: '服刑',
}

const { userInfo } = useUserStore()

// 本人认证信息提交
// const modelMe = reactive({
//   name: userInfo.cardName,
//   nameTm: userInfo.cardNameTm,
//   idCardNumber: userInfo.idCardNumber,
//   idCardNumberTm: userInfo.idCardNumberTm,
//   phoneNumber: userInfo.userPhone,
//   phoneNumberTm: dataDesensitization(userInfo.userPhone, false, 'last'),
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
  name: '',
  idCardNumber: '',
  phoneNumber: '',
  familyRelation: '',
})

const rulesOther = {
  name: [
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
  idCardNumber: [
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
  phoneNumber: [
    { required: true, message: '请输入手机号码' },
    {
      required: true,
      message: '手机号码格式不正确',
      validator: (val) => {
        return isValidPhone(val)
      },
    },
  ],
  familyRelation: [{ required: true, message: '请选择与本人关系' }],
}

const { send: sendCertPlanData } = useRequest((data) => getCertPlanInfo(data), {
  immediate: false,
  loading: false,
})

const { send: sendCertResultData } = useRequest((data) => getCertResultInfo(data), {
  immediate: false,
  loading: false,
})

const { send: sendCertRecordData } = useRequest((data) => getCertRecordInfo(data), {
  immediate: false,
  loading: false,
})

const { send: sendRecordDetailData } = useRequest((data) => getRecordDetailInfo(data), {
  immediate: false,
  loading: false,
})
const { send: sendPreserRecords } = useRequest((data) => getPreserRecords(data), {
  immediate: false,
  loading: false,
})

const { loading, send: sendWxCertData } = useRequest((data) => getWxCertInfo(data), {
  immediate: false,
  loading: false,
})

export {
  CERT_METHOD,
  CERT_STATE,
  loading,
  // modelMe,
  modelOther,
  MSG_SCRIPT,
  rulesMe,
  rulesOther,
  sendCertPlanData,
  sendCertRecordData,
  sendCertResultData,
  sendPreserRecords,
  sendRecordDetailData,
  sendWxCertData,
}
