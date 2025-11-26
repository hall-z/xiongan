import { getCardBasicInfo } from '@/service/api/cardServe'
import { useUserStore } from '@/store'
import { useForm } from 'alova/client'
import { storeToRefs } from 'pinia'
const { userInfo } = storeToRefs(useUserStore())

// 卡信息查询
const {
  loading,
  send: getCadInfo,
  data: cardInfoData,
  form: model,
} = useForm(
  (data) => {
    data.xm = userInfo.value.cardName
    data.zjhm = userInfo.value.idCardNumber
    return getCardBasicInfo(data)
  },
  {
    immediate: false,
    loading: false,
    initialData: {},
    // 初始化表单数据
    resetAfterSubmiting: true,
    initialForm: {
      xm: userInfo.value.cardName,
      zjhm: userInfo.value.idCardNumber,
      shbzhm: '',
    },
  },
)

export default () => {
  return { cardInfoData, getCadInfo, loading, model }
}
