import {
  cardFirstApplication,
  cardStepApplication,
  getApplyFortInfo,
  getCardcheckInfo,
} from '@/service/api/cardServe'
import {
  getBankCodeById,
  getPromoterOrgUserById,
  getPromoterById,
  updateStatus,
} from '@/service/api/system'
import store, { promotionDateStore, useUserStore } from '@/store'
import { isValidAddress, isValidChinaID, isValidName, isValidPhone } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
// import cloneDeep from 'lodash-es/cloneDeep'
import isObject from 'lodash/isObject'
import { storeToRefs } from 'pinia'
import { statusTisProps } from '../types/types'
const { promotionDate } = storeToRefs(promotionDateStore())
const read = ref(false)

const { userInfo } = storeToRefs(useUserStore(store))

const serchData = ref({
  xm: userInfo.value.cardName,
  zjhm: userInfo.value.idCardNumber,
  zjlx: '1',
  zkType: '1',
  wdcode: '999-130632004',
  areaCode: 'CHN',
})

console.log('serchData', serchData)
// 卡前置查询

const { loading, send: sendCardQury } = useRequest((data) => getCardcheckInfo(data), {
  immediate: false,
  loading: false,
  initialData: {},
})

// 社保卡申领详情
const { send: sendApplyInfo } = useRequest((data) => getApplyFortInfo(data), {
  immediate: false,
  loading: false,
})

// 上传身份证
const modelPhoto = ref({
  url1: '',
  url2: '',
})
function getSex() {
  let sex = ''
  if (userInfo.value) {
    if (userInfo.value.idCardNumber) {
      sex = Number(userInfo.value.idCardNumber.substring(16, 17)) % 2 === 1 ? '1' : '2'
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
  if (userInfo.value) {
    if (userInfo.value.idCardNumber) {
      birthDate = new Date(
        userInfo.value.idCardNumber.substring(6, 10) +
          '-' +
          userInfo.value.idCardNumber.substring(10, 12) +
          '-' +
          userInfo.value.idCardNumber.substring(12, 14),
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

// 卡信息提交
const model = ref({
  name: userInfo.value.cardName,
  idCardNumber: userInfo.value.idCardNumber,
  idCardType: '1',
  sex: userSex,
  birthdate: userBirthDate,
  nationality: 'CHN',
  nation: '',
  areaCode: '',
  phoneNumber: userInfo.value.userPhone,
  address: '',
  startDate: null,
  endDate: null,
  work: '',
  bankCode: '',
  bankBranchCode: '',
  photoId: '',
  idCardFrontPhotoId: '',
  idCardBackPhotoId: '',

  idName: '',
  isPostcard: '0',
  postcardName: '',
  postcardPhone: '',
  postcardAddress: '',
})

const modelId = ref('')
const applyType = ref('1')

const steep = ref(1)

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
        if (model.value.idCardType === '1') {
          return isValidChinaID(val)
        } else {
          return true
        }
      },
    },
  ],
  idCardType: [{ required: true, message: '请选择证件类型' }],
  sex: [{ required: true, message: '请选择性别' }],
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
  birthdate: [{ required: true, message: '请选择出生日期' }],
  nationality: [{ required: true, message: '请选择国籍/地区' }],
  nation: [{ required: true, message: '请选择民族' }],
  areaCode: [{ required: true, message: '请选择申领地区' }],
  address: [
    { required: true, message: '请输入家庭住址' },
    {
      required: true,
      message: '请输入正确的家庭住址，不支持特殊字符且字数限制为5到70个字',
      validator: (val) => {
        return isValidAddress(val)
      },
    },
  ],
  startDate: [{ required: true, message: '请选择开始日期' }],
  endDate: [{ required: true, message: '请选择结束日期' }],
  work: [{ required: true, message: '请选择职业' }],
  bankCode: [{ required: true, message: '请选择申领银行' }],
  bankBranchCode: [{ required: true, message: '请选择申领网点' }],
  photoId: [{ required: true, message: '请输入照片ID' }],
  idCardFrontPhotoId: [{ required: true, message: '请上传身份证正面照片' }],
  idCardBackPhotoId: [{ required: true, message: '请上传身份证反面照片' }],
  isPostcard: [{ required: true, message: '请选择是否邮寄' }],
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
      message: '请输入正确的手机号码',
      validator: (val) => {
        return isValidPhone(val)
      },
    },
  ],
  postcardAddress: [
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
// 根据推广人id 查询推广人信息
const { send: sedGetPromoterById } = useRequest((data: any) => getPromoterById(data), {
  immediate: false,
  loading: false,
})

// 根据id获取推广码详情
const { send: sedBankCodeById } = useRequest((data: any) => getBankCodeById(data), {
  immediate: false,
  loading: false,
})

// 根据id获取机构推广码信息
const { send: sedPromoterOrgUserById } = useRequest((data: any) => getPromoterOrgUserById(data), {
  immediate: false,
  loading: false,
})
// 更新推广人状态
const { send: sedUpdateStatus } = useRequest((data: any) => updateStatus(data), {
  immediate: false,
  loading: false,
})
const { loading: loading2, send: sendCardData } = useRequest((data) => cardFirstApplication(data), {
  immediate: false,
  loading: false,
})

const statusDel = ref<statusTisProps>()
const submitStatus = ref(false)

const batchNumber = ref('')
// 保存推广后的id
const promoteUpdateId: any = ref(null)
const promoteInfo: any = ref(null)
const bankLabelList: any = ref(null)
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
          console.log('22222', data)

          // submitStatus.value = true
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
              actionType: '1',
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
              actionType: '1',
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
          uni.showToast({
            title: '性别与身份证信息不匹配！',
          })
        } else if (params.birthdate !== cardBirth) {
          uni.showToast({
            title: '出生日期与身份证信息不匹配！',
          })
        }
      }
    }
  })
}

// 社保卡申领部分数据保存
const { loading: loading3, send: sendStepCardData } = useRequest(
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
          uni.showToast({
            title: '性别与身份证信息不匹配！',
          })
        } else if (params.birthdate !== cardBirth) {
          uni.showToast({
            title: '出生日期与身份证信息不匹配！',
          })
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
    sendCardQury,
    sendApplyInfo,
    sendCardData,
    sendStepCardData,
    serchData,
    submitCard,
    submitStepCard,
    submitStatus,
    statusDel,
    modelPhoto,
    model,
    rules,
    modelId,
    applyType,
    loading,
    loading2,
    loading3,
    read,
    steep,
    batchNumber,
    sedGetPromoterById,
    sedUpdateStatus,
    sedBankCodeById,
    sedPromoterOrgUserById,
    promoteUpdateId,
    promoteInfo,
    bankLabelList,
  }
}
