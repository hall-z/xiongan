import {
  cardStepApplication,
  changeCardData,
  checkCardChange,
  getApplyFortInfo,
  getBranchesInfoSlectNew,
  getCardcheckInfo,
  getCardToken,
  getCheckToZjz,
} from '@/service/api/cardServe'
import store, { promotionDateStore, useUserStore } from '@/store'
import { isValidAddress, isValidChinaID, isValidName, isValidPhone } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
// import cloneDeep from 'lodash-es/cloneDeep'
import cloneDeep from 'lodash/cloneDeep'
import isObject from 'lodash/isObject'
import { storeToRefs } from 'pinia'
import useCardApply from '../hooks/useCardApply'
import { statusTisProps } from '../types/types'
const { promoteUpdateId, sedUpdateStatus } = useCardApply()
const { promotionDate } = storeToRefs(promotionDateStore())
const read = ref(0)
const { userInfo } = useUserStore(store)
const message2: any = ref('')
const serchData = ref({
  xm: userInfo.cardName,
  zjhm: userInfo.idCardNumber,
  zjlx: '1',
  zkType: '2',
  wdcode: '999-130632004',
  areaCode: 'CHN',
})
// 获取token

const { send: sendCardToken, onSuccess: getCardTokenSucess } = useRequest(() => getCardToken(), {
  immediate: false,
  loading: false,
  initialData: {},
})
const { send: sendCheckToZjz } = useRequest((data) => getCheckToZjz(data), {
  immediate: false,
  loading: false,
})
// 卡前置查询

const {
  loading,
  send: sendCardQury,
  onSuccess: cardQuerySucess,
} = useRequest((data) => getCardcheckInfo(data), {
  immediate: false,
  loading: false,
  initialData: {},
})
// 网点信息
const {
  loading: loadingBranches,
  send: sendBranches,
  onSuccess: branchesSucess,
} = useRequest((data) => getBranchesInfoSlectNew(data), {
  immediate: false,
  loading: false,
  initialData: [],
})
// 上传身份证
const modelPhoto = ref({
  url1: '',
  url2: '',
})

const bankBranchList = []
function getSex() {
  let sex = ''
  if (userInfo) {
    if (userInfo.idCardNumber) {
      sex = Number(userInfo.idCardNumber.substring(16, 17)) % 2 === 1 ? '1' : '2'
    } else {
      sex = ''
    }
  } else {
    sex = ''
  }
  return sex
}
function getSexrBirthDate() {
  let birthDate: any = ''
  if (userInfo) {
    if (userInfo.idCardNumber) {
      birthDate = new Date(
        userInfo.idCardNumber.substring(6, 10) +
          '-' +
          userInfo.idCardNumber.substring(10, 12) +
          '-' +
          userInfo.idCardNumber.substring(12, 14),
      ).getTime()
    } else {
      birthDate = ''
    }
  } else {
    birthDate = ''
  }
  return birthDate
}
// 从证件号码提取出生日期和性别
const userSex = getSex()

const userBirthDate = getSexrBirthDate()
// 补卡信息提交
const model: any = ref({
  name: userInfo.cardName,
  idCardNumber: userInfo.idCardNumber,
  idCardType: '1',
  birthdate: userBirthDate,
  nationality: 'CHN',
  sex: userSex || 0,
  nation: '',
  phoneNumber: userInfo.userPhone,
  address: '',
  mailAddress: '',
  startDate: null,
  endDate: null,
  work: '',
  bankCode: '',
  bankBranchCode: '',
  businessType: '3',
  reason: '',
  photoId: '',
  idCardFrontPhotoId: '',
  idCardBackPhotoId: '',
  dbbs: '0',

  // --
  dbrName: '',
  dbrType: '',
  dbrZjhm: '',
  dbrSex: '',
  dbrIdCardFrontPhotoId: '',
  dbrIdCardBackPhotoId: '',
  dbrAddress: '',
  familyRelation: '',
  dbrPhone: '',
  // -----
  isPostcard: '0',
  postcardName: '',
  postcardPhone: '',
  postcardaddress: '',

  areaCode: '',
})

const rules = {
  name: [
    { required: true, message: '请输入姓名' },
    {
      required: true,
      message: '请输入正确的姓名',
      validator: (val) => {
        return isValidName(val)
      },
    },
  ],
  idCardNumber: [
    { required: true, message: '证件号码不能为空' },
    {
      required: true,
      message: '证件号码格式不正确',
      validator: (val) => {
        return isValidChinaID(val)
      },
    },
  ],
  sex: [{ required: true, message: '请选择性别' }],
  nation: [{ required: true, message: '请选择民族' }],
  phoneNumber: [
    { required: true, message: '请输入手机号' },
    {
      required: true,
      message: '请输入正确的手机号码',
      validator: (val) => {
        return isValidPhone(val)
      },
    },
  ],
  address: [
    { required: true, message: '请输入地址' },
    {
      required: true,
      message: '请输入正确的地址，不支持特殊字符且字数限制为5到70个字',
      validator: (val) => {
        return isValidAddress(val)
      },
    },
  ],
  mailAddress: [
    { required: true, message: '请输入家庭住址' },
    {
      required: true,
      message: '请输入正确的家庭住址，不支持特殊字符且字数限制为5到70个字',
      validator: (val) => {
        return isValidAddress(val)
      },
    },
  ],
  idCardType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  birthdate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  nationality: [{ required: true, message: '请输入国籍/地区', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择有效起始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择有效结束日期', trigger: 'change' }],
  work: [{ required: true, message: '请选择职业', trigger: 'blur' }],
  bankCode: [{ required: true, message: '请选择开户银行', trigger: 'change' }],
  bankBranchCode: [{ required: true, message: '请选择申领网点', trigger: 'change' }],
  businessType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
  reason: [{ required: true, message: '请选择补卡原因', trigger: 'change' }],
  photoId: [{ required: true, message: '请上传照片', trigger: 'change' }],
  idCardFrontPhotoId: [{ required: true, message: '请上传身份证正面', trigger: 'change' }],
  idCardBackPhotoId: [{ required: true, message: '请上传身份证反面', trigger: 'change' }],
  dbbs: [{ required: true, message: '请选择是否代办', trigger: 'change' }],
  // --
  dbrName: [
    { required: true, message: '请输入代办人姓名' },
    {
      required: true,
      message: '请输入正确的代办人姓名',
      validator: (val) => {
        return isValidName(val)
      },
    },
  ],
  dbrType: [{ required: true, message: '请选择代办人证件类型' }],
  dbrZjhm: [
    { required: true, message: '代办人证件号码不能为空' },
    {
      required: true,
      message: '代办人证件号码格式不正确',
      validator: (val) => {
        if (model.value.dbrType === '1') {
          return isValidChinaID(val)
        } else {
          return true
        }
      },
    },
  ],
  dbrSex: [{ required: true, message: '请选择代办人性别', trigger: 'change' }],
  dbrIdCardFrontPhotoId: [{ required: true, message: '请上传代办人身份证正面', trigger: 'change' }],
  dbrIdCardBackPhotoId: [{ required: true, message: '请上传代办人身份证反面', trigger: 'change' }],
  familyRelation: [{ required: true, message: '请选择代办人与申请人关系', trigger: 'change' }],
  dbrPhone: [
    { required: true, message: '请输入代办人手机号' },
    {
      required: true,
      message: '请输入正确的手机号码',
      validator: (val) => {
        return isValidPhone(val)
      },
    },
  ],
  dbrAddress: [
    { required: true, message: '请输入代办人地址' },
    {
      required: true,
      message: '请输入正确的代办人地址，不支持特殊字符且字数限制为5到70个字',
      validator: (val) => {
        return isValidAddress(val)
      },
    },
  ],
  areaCode: [{ required: true, message: '请选择申领地区', trigger: 'change' }],
  isPostcard: [{ required: true, message: '请选择是否邮寄', trigger: 'change' }],
  postcardName: [
    { required: true, message: '请输入收件人姓名' },
    {
      required: true,
      message: '请输入正确的收件人姓名',
      validator: (val) => {
        return isValidName(val)
      },
    },
  ],
  postcardPhone: [
    { required: true, message: '请输入收件人手机号' },
    {
      required: true,
      message: '请输入正确的收件人手机号码',
      validator: (val) => {
        return isValidPhone(val)
      },
    },
  ],
  postcardaddress: [
    { required: true, message: '请输入收件地址' },
    {
      required: true,
      message: '请输入正确的收件地址，不支持特殊字符且字数限制为5到70个字',
      validator: (val) => {
        return isValidAddress(val)
      },
    },
  ],
}

const modelId = ref('')
const applyType = ref('3')
const steep = ref(1)
const batchNumber = ref('')
const { loading: loading2, send: sendCardData } = useRequest((data) => changeCardData(data), {
  immediate: false,
  loading: false,
})
const { loading: loading3, send: sendBranchesInfos } = useRequest((data) => changeCardData(data), {
  immediate: false,
  loading: false,
})
const { send: sendCheckCardChange } = useRequest((data) => checkCardChange(data), {
  immediate: false,
  loading: false,
})

const statusDel = ref<statusTisProps>()
const submitStatus = ref(false)

// 社保卡申领详情
const { send: sendApplyInfo } = useRequest((data) => getApplyFortInfo(data), {
  immediate: false,
  loading: false,
})
const promoteInfo: any = ref(null)
const bankLabelList = ref([])
// 回显字典值
const getLabelByValue = (list, value) => {
  const item = list.find((item) => item.value === value)
  return item ? item.label : '' // 如果找到对应的项，返回label，否则返回空字符串
}

const submitCard = (form, step) => {
  form.validate().then(async ({ valid, errors }) => {
    if (valid) {
      const params = cloneDeep(model.value)
      params.birthdate = dayjs(params.birthdate).format('YYYYMMDD')
      params.startDate = dayjs(params.startDate).format('YYYYMMDD')
      params.endDate = dayjs(params.endDate).format('YYYYMMDD')
      const cardSex = Number(params.idCardNumber.substring(16, 17)) % 2 === 1 ? '1' : '2'
      const cardBirth =
        params?.idCardNumber.substring(6, 10) +
        '' +
        params?.idCardNumber.substring(10, 12) +
        '' +
        params?.idCardNumber.substring(12, 14)

      if (params.sex === cardSex && params.birthdate === cardBirth) {
        try {
          const data: any = await sendCardData(params)

          // submitStatus.value = true
          console.log('数据校验成功', data)
          steep.value = step
          statusDel.value = data
          batchNumber.value = data?.data?.batchNumber
          if (
            isObject(promotionDate.value) &&
            Object.values(promotionDate.value).length !== 0 &&
            promotionDate.value.isPromotion
          ) {
            const name = getLabelByValue(bankLabelList.value, model.value.bankCode)
            const params = {
              promoterBindId: promoteUpdateId.value,
              actionType: '3',
              cardId: model.value.idCardNumber,
              cardName: model.value.name,
              phone: model.value.phoneNumber,
              cardBankName: name,
              cardBankId: model.value.bankCode,
              status: 1,
            }
            console.log('提交完更新接口参数', params)
            sedUpdateStatus(params)
          }
        } catch (error) {
          if (
            isObject(promotionDate.value) &&
            Object.values(promotionDate.value).length !== 0 &&
            promotionDate.value.isPromotion
          ) {
            const name = getLabelByValue(bankLabelList.value, model.value.bankCode)
            const params = {
              promoterBindId: promoteUpdateId.value,
              actionType: '3',
              cardId: model.value.idCardNumber,
              cardName: model.value.name,
              phone: model.value.phoneNumber,
              cardBankName: name,
              cardBankId: model.value.bankCode,
              status: 99,
            }
            console.log('提交完更新接口参数', params)
            sedUpdateStatus(params)
          }
          console.log('数据校验失败')
        }
      } else {
        if (params.sex !== cardSex) {
          // uni.showToast({
          //   title: '性别与身份证信息不匹配！',
          // })
          Toast('性别与身份证信息不匹配！')
        } else if (params.birthdate !== cardBirth) {
          // uni.showToast({
          //   title: '出生日期与身份证信息不匹配！',
          // })
          Toast('出生日期与身份证信息不匹配！')
        }
      }
    }
  })
}

// 社保卡申领部分数据保存
const { loading: loading4, send: sendStepCardData } = useRequest(
  (data) => cardStepApplication(data),
  {
    immediate: false,
    loading: false,
  },
)

const submitStepCard = (form, step) => {
  modelId.value = modelId.value ? modelId.value : guid()
  form.validate().then(async ({ valid, errors }) => {
    if (valid) {
      if (step === 4) {
        try {
          const paramsC = {
            idCardNumber: model.value.idCardNumber,
            bankCode: model.value.bankCode,
            bankBranchCode: model.value.bankBranchCode,
          }
          const data: any = await sendCheckCardChange(paramsC)
          console.log('checkCardChange', data)
        } catch (error) {
          return message2.value.alert({
            msg: error.data.msg,
            title: '提示',
            closeOnClickModal: false,
          })
        }
      }
      const params = cloneDeep(model.value)
      params.birthdate = dayjs(params.birthdate).format('YYYYMMDD')
      params.startDate = dayjs(params.startDate).format('YYYYMMDD')
      params.endDate = dayjs(params.endDate).format('YYYYMMDD')
      const cardSex = Number(params.idCardNumber.substring(16, 17)) % 2 === 1 ? '1' : '2'
      const cardBirth =
        params?.idCardNumber.substring(6, 10) +
        '' +
        params?.idCardNumber.substring(10, 12) +
        '' +
        params?.idCardNumber.substring(12, 14)
      params.id = modelId.value
      params.applyType = applyType.value // 首次申领
      console.log(params)
      if (params.sex === cardSex && params.birthdate === cardBirth) {
        try {
          const data: any = await sendStepCardData(params)
          Toast('信息保存成功！')
          steep.value = step
          statusDel.value = data
        } catch (error) {
          console.log('数据校验失败')
        }
      } else {
        if (params.sex !== cardSex) {
          // uni.showToast({
          //   title: '性别与身份证信息不匹配！',
          // })
          Toast('性别与身份证信息不匹配！')
        } else if (params.birthdate !== cardBirth) {
          // uni.showToast({
          //   title: '出生日期与身份证信息不匹配！',
          // })
          Toast('出生日期与身份证信息不匹配！')
        }
      }
    }
  })
}

const guid = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default () => {
  return {
    sendCheckToZjz,
    sendCardToken,
    sendCardQury,
    sendApplyInfo,
    sendCardData,
    sendStepCardData,
    sendBranchesInfos,
    serchData,
    submitCard,
    submitStepCard,
    submitStatus,
    statusDel,
    modelPhoto,
    model,
    steep,
    rules,
    modelId,
    applyType,
    loading,
    loading2,
    read,
    loading4,
    sendCheckCardChange,
    message2,
    loadingBranches,
    sendBranches,
    batchNumber,
    promoteInfo,
    bankLabelList,
  }
}
