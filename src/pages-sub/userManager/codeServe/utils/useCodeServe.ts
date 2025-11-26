import { getAllCodeInfo, getGenerate, getQrcodelnit } from '@/service/api/cardServe'
import { getStdTDCode } from '@/service/api/shop'
import { receiveCoupon } from '@/service/api/userMessage'
import { useCaptcha, useRequest } from 'alova/client'

// 用户领取
const { send: sendReceiveCoupon, loading: listLoading3 } = useRequest(
  (data) => receiveCoupon(data),
  {
    immediate: false,
    loading: false,
  },
)
const { send: sendGetStdTDCode } = useRequest((params) => getStdTDCode(params), {
  immediate: false,
  loading: false,
})

//  验证是否有社保码
const { send: sendSignValid, loading: LoadingValid } = useRequest((data) => getQrcodelnit(data), {
  immediate: false,
  loading: false,
})
const { send: sendGenerate } = useRequest((data) => getGenerate(data), {
  immediate: false,
  loading: false,
})

const { send: sendAllCodeInfo, data: allCodeInfo } = useCaptcha(
  (params) => getAllCodeInfo(params),
  {
    immediate: false,
    loading: false,
  },
)

export default () => ({
  sendReceiveCoupon,
  sendGetStdTDCode,
  sendSignValid,
  sendGenerate,
  sendAllCodeInfo,
  allCodeInfo,
})
