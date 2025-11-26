import { getCardBasicInfo2, personInfoChange } from '@/service/api/cardServe'
import { useUserStore } from '@/store/user'
import { Toast } from '@/utils/uniapi/prompt'
import { useForm } from 'alova/client'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { cardInfoProps, statusTisProps } from '../types/types'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 卡信息查询
const {
  loading,
  send: sendCard,
  form: model,
  data: cardData,
} = useForm(
  (data) => {
    data.xm = userInfo.value.cardName
    data.zjhm = userInfo.value.idCardNumber
    return getCardBasicInfo2<cardInfoProps>(data)
  },
  {
    immediate: false,
    loading: false,
    // 初始化表单数据
    resetAfterSubmiting: true,
    initialForm: {
      xm: userInfo.value.cardName,
      zjhm: userInfo.value.idCardNumber,
      shbzhm: '',
    },
  },
)

const rules = {
  xm: [{ required: true, message: '请输入姓名' }],
  zjhm: [{ required: true, message: '请输入证件号码' }],
  shbzhm: [{ required: true, message: '请输入社会保障卡号' }],
  // address: [{ required: true, message: '请输入居住地址' }],
  // phone: [{ required: true, message: '请输入联系方式' }],
  // cardStartTime: [{ required: true, message: '请选择起始日期' }],
  // cardEndTime: [{ required: true, message: '请选择终止日期' }],
  zy: [{ required: true, message: '请选择职业' }],
}
const serchBtnStatus = ref(false)
const statusDel = ref<statusTisProps>()
const submitStatus = ref(false)
const cardQury = async () => {
  try {
    const res: any = await sendCard()
    if (res.data) {
      console.log('res:', res.data)
      cardChangeInfo.value = res.data
      let cardStartTime = res.data.zjyxq.substring(0, 8)
      let cardEndTime = res.data.zjyxq.substring(9, 17)
      cardStartTime = insertCharacter(cardStartTime, '-', 4)
      cardStartTime = insertCharacter(cardStartTime, '-', 7)
      cardEndTime = insertCharacter(cardEndTime, '-', 4)
      cardEndTime = insertCharacter(cardEndTime, '-', 7)
      cardChangeInfo.value.cardStartTime = new Date(cardStartTime).getTime() as unknown as string
      cardChangeInfo.value.cardEndTime = new Date(cardEndTime).getTime() as unknown as string
      serchBtnStatus.value = true
    }
  } catch (error) {
    submitStatus.value = true
    statusDel.value = error.data
  }
  //   }
  // })
}

function insertCharacter(str, char, index) {
  return str.slice(0, index) + char + str.slice(index)
}

// 提交变更信息

const {
  loading: bgloading,
  send: sendBgInfo,
  form: cardChangeInfo,
} = useForm(
  (formData) => {
    const params = {
      name: userInfo.value.cardName,
      idCardNumber: userInfo.value.idCardNumber,
      address: formData.address,
      phoneNumber: formData.phone,
      startDate: dayjs(formData.cardStartTime).format('YYYYMMDD'),
      endDate: dayjs(formData.cardEndTime).format('YYYYMMDD'),
      work: formData.zy,
    }
    // 可以在此转换表单数据并提交
    return personInfoChange(params)
  },
  {
    immediate: false,
    loading: false,
    initialData: {},
    // 初始化表单数据
    initialForm: {
      xm: '',
      zjhm: '',
      xb: '',
      gj: '',
      mz: '',
      address: '',
      phone: '',
      cardStartTime: '',
      cardEndTime: '',
      zy: '',
    },
  },
)
const changeSubmit = (form) => {
  form.validate().then(async ({ valid, errors }) => {
    if (valid) {
      try {
        if (cardChangeInfo.value.cardStartTime > cardChangeInfo.value.cardEndTime) {
          Toast('证件有效终止日期不能早于证件有效起始日期，请重新选择！')
        } else {
          const data = (await sendBgInfo()) as any

          Toast(data?.msg ?? '社保信息变更成功！')
          uni.navigateTo({
            url: 'pages/serve/index',
          })
        }
      } catch (error) {
        console.log('error:', error)
        Toast(error?.data?.msg ?? '变更失败，请稍后重试！')
      }
    } else {
      console.log('数据校验失败')
    }
  })
}

const read = ref(false)
export default () => {
  return {
    cardQury,
    cardData,
    sendCard,
    cardChangeInfo,
    model,
    rules,
    loading,
    read,
    changeSubmit,
    submitStatus,
    statusDel,
    serchBtnStatus,
  }
}
