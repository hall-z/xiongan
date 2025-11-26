import {
  cardFirstDbrApplication,
  cardStepApplication,
  getApplyFortInfo,
  getCardcheckInfo,
} from '@/service/api/cardServe'
import { useUserStore, promotionDateStore } from '@/store'
import { isValidAddress, isValidChinaID, isValidName, isValidPhone } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import cloneDeep from 'lodash-es/cloneDeep'
import useCardApply from '../hooks/useCardApply'
import { storeToRefs } from 'pinia'
import isObject from 'lodash/isObject'
const { promotionDate } = storeToRefs(promotionDateStore())
const { promoteUpdateId, sedUpdateStatus } = useCardApply()
const read = ref(0)
const { userInfo } = useUserStore()
const serchData = ref({
  xm: userInfo.cardName,
  zjhm: userInfo.idCardNumber,
  zjlx: '1',
  zkType: '1',
  wdcode: '999-130632004',
  areaCode: 'CHN',
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

// 从证件号码提取出生日期和性别
// const userSex = Number(userInfo.idCardNumber.substring(16, 17)) % 2 === 1 ? '1' : '2'
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

// 卡信息提交
const model = ref({
  // 代办人信息
  dbrName: '',
  dbrType: '1',
  dbrZjhm: '',
  dbrSex: '',
  dbrIdCardFrontPhotoId: '',
  dbrIdCardBackPhotoId: '',
  familyRelation: '',
  dbrPhone: '',
  dbrAddress: '',
  // 申领人信息
  name: '',
  idCardNumber: '',
  idCardType: '1',
  sex: '',
  birthdate: '',
  nationality: 'CHN',
  nation: '',
  areaCode: '',
  phoneNumber: '',
  address: '',
  startDate: null,
  endDate: null,
  work: '80000',
  bankCode: '',
  bankBranchCode: '',
  photoId: '',
  idCardFrontPhotoId: '',
  idCardBackPhotoId: '',
  isPostcard: '0',
  isHkb: '0',
  postcardaddress: '',
  postcardPhone: '',
  postcardName: '',
  idName: '',
})

const modelId = ref('')
const applyType = ref('2')

const steep = ref(1)

const rules = {
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
  dbrSex: [{ required: true, message: '请选择代办人性别' }],
  dbrIdCardFrontPhotoId: [{ required: true, message: '请上传代办人证件正面照' }],
  dbrIdCardBackPhotoId: [{ required: true, message: '请上传代办人证件反面照' }],
  familyRelation: [{ required: true, message: '请选择亲属关系' }],
  dbrPhone: [
    { required: true, message: '请输入代办人手机号码' },
    {
      required: true,
      message: '请输入正确的代办人手机号码',
      validator: (val) => {
        return isValidPhone(val)
      },
    },
  ],
  dbrAddress: [
    { required: true, message: '请输入代办人家庭住址' },
    {
      required: true,
      message: '请输入正确的代办人家庭住址，不支持特殊字符且字数限制为5到70个字',
      validator: (val) => {
        return isValidAddress(val)
      },
    },
  ],
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
  idCardType: [{ required: true, message: '请选择证件类型' }],
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
    { required: true, message: '请输入地址' },
    {
      required: true,
      message: '请输入正确的地址，不支持特殊字符且字数限制为5到70个字',
      validator: (val) => {
        return isValidAddress(val)
      },
    },
  ],
  startDate: [{ required: true, message: '请选择有效起始日期' }],
  endDate: [{ required: true, message: '请选择有效结束日期' }],
  work: [{ required: true, message: '请选择职业' }],
  bankCode: [{ required: true, message: '请选择申领银行' }],
  bankBranchCode: [{ required: true, message: '请选择申领银行网点' }],
  photoId: [{ required: true, message: '请输入照片ID' }],
  idCardFrontPhotoId: [{ required: true, message: '请上传身份证正面照片' }],
  idCardBackPhotoId: [{ required: true, message: '请上传身份证反面照片' }],
  isPostcard: [{ required: true, message: '请选择是否邮寄' }],
  postcardName: [
    { required: true, message: '请输入收件人姓名', trigger: 'blur' },
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
  idName: [
    { required: true, message: '请输入永居证姓名' },
    {
      required: true,
      pattern: /^(?=[\u4e00-\u9fa5·]{2,20}$)[\u4e00-\u9fa5]+·?[\u4e00-\u9fa5]+$/,
      message: '请输入正确的永居证姓名',
    },
  ],
}
const { loading: loading2, send: sendCardData } = useRequest(
  (data) => cardFirstDbrApplication(data),
  {
    immediate: false,
    loading: false,
  },
)

const submitLoading = ref(false)
const submitStatus = ref(0)
const statusDel = ref('')
const promoteInfo: any = ref(null)
const bankLabelList = ref([])
// 回显字典值
const getLabelByValue = (list, value) => {
  const item = list.find((item) => item.value === value)
  return item ? item.label : '' // 如果找到对应的项，返回label，否则返回空字符串
}
const submitCard = async (form, step) => {
  submitLoading.value = true
  const { valid } = await form.validate()
  if (valid) {
    try {
      const params = cloneDeep(model.value)
      params.birthdate = dayjs(params.birthdate).format('YYYYMMDD')
      params.startDate = dayjs(params.startDate).format('YYYYMMDD')
      params.endDate = dayjs(params.endDate).format('YYYYMMDD')
      console.log('params: ', params)
      const data: any = await sendCardData(params)
      console.log('data: sendCardData', data)

      steep.value = step
      statusDel.value = data
      batchNumber.value = data?.data.batchNumber
      submitLoading.value = false
      if (
        isObject(promotionDate.value) &&
        Object.values(promotionDate.value).length !== 0 &&
        promotionDate.value.isPromotion
      ) {
        const name = getLabelByValue(bankLabelList.value, model.value.bankCode)
        const params = {
          promoterBindId: promoteUpdateId.value,
          actionType: '2',
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
      submitLoading.value = false
      if (
        isObject(promotionDate.value) &&
        Object.values(promotionDate.value).length !== 0 &&
        promotionDate.value.isPromotion
      ) {
        const name = getLabelByValue(bankLabelList.value, model.value.bankCode)
        const params = {
          promoterBindId: promoteUpdateId.value,
          actionType: '2',
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
    submitLoading.value = false
  }
}

// 社保卡申领部分数据保存
const { loading: loading3, send: sendStepCardData } = useRequest(
  (data) => cardStepApplication(data),
  {
    immediate: false,
    loading: false,
  },
)

const batchNumber = ref('')
const submitStepCard = (form, step) => {
  console.log('提交 --- step', step)
  modelId.value = modelId.value ? modelId.value : guid()
  form.validate().then(async ({ valid, errors }) => {
    if (valid) {
      const params = cloneDeep(model.value)
      console.log('params: ', params)
      if (step === 2) {
        submitForm(params, step)
      }
      if (step === 3) {
        const dbrSex = getGenderFromIdCard(params.dbrZjhm)
        if (params.dbrSex !== dbrSex) {
          return Toast('性别与身份证信息不匹配！')
        }
        submitForm(params, step)
      }
      if (step === 4) {
        submitForm(params, step)
      }
      if (step === 5) {
        params.birthdate = dayjs(params.birthdate).format('YYYYMMDD')
        params.startDate = dayjs(params.startDate).format('YYYYMMDD')
        params.endDate = dayjs(params.endDate).format('YYYYMMDD')
        const sex = getGenderFromIdCard(params.idCardNumber)
        const birth = getBirthDateFromIdCard(params.idCardNumber)
        if (params.sex !== sex) {
          return Toast('性别与身份证信息不匹配！')
        }
        if (params.birthdate !== birth) {
          return Toast('出生日期与身份证信息不匹配！')
        }
        submitForm(params, step)
      }

      if (step === 6) {
        submitForm(params, step)
      }
      if (step === 7) {
        submitForm(params, step)
      }
      if (step === 8) {
        submitForm(params, step)
      }
    }
  })
}

const submitForm = async (params: any, step: number) => {
  params.id = modelId.value
  params.applyType = applyType.value // 首次申领
  try {
    const data: any = await sendStepCardData(params)
    Toast('信息保存成功！')
    steep.value = step
    statusDel.value = data
    batchNumber.value = data.batchNumber
  } catch (error) {
    console.log('数据校验失败')
  }
}
const guid = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 根据身份证号获取性别
const getGenderFromIdCard = (idCard: string): string => {
  if (!/^\d{17}(\d|X|x)$/.test(idCard)) {
    throw new Error('身份证号必须是18位数字（最后一位可以是X或x）')
  }
  const genderDigit = parseInt(idCard.charAt(16), 10)
  return genderDigit % 2 === 1 ? '1' : '2'
}

// 根据身份证号获取出生日期
const getBirthDateFromIdCard = (idCard: string): string => {
  if (!/^\d{17}[\dXx]$/.test(idCard)) {
    throw new Error('身份证号必须是18位数字（最后一位可以是X或x）')
  }

  const birthDateStr = idCard.slice(6, 14)
  return birthDateStr
}

export default () => {
  return {
    sendCardQury,
    sendApplyInfo,
    sendCardData,
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
    read,
    steep,
    batchNumber,
    getGenderFromIdCard,
    getBirthDateFromIdCard,
    submitLoading,
    bankLabelList,
    promoteInfo,
  }
}
