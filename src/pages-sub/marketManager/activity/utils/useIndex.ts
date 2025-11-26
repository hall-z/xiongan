import {
  getActivityByInfo,
  getIsYktUser,
  getUserPageByTagId,
  getStdTDCode,
} from '@/service/api/shop'
import { receiveCoupon } from '@/service/api/userMessage'
import { useCaptcha, useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { getBankCodeById, getPromoterOrgUserById, getPromoterById } from '@/service/api/system'
const activity = ref({})
const { send: getActivityInfo } = useRequest(
  (data: ActivityParams) => getActivityByInfo<IActivity>(data),
  {
    immediate: false,
    loading: false,
  },
)

const { send: getIsYktUserInfo } = useRequest((data: any) => getIsYktUser<any>(data), {
  immediate: false,
  loading: false,
})
const { send: getUserPageByTagIdInfo } = useRequest((data: any) => getUserPageByTagId<any>(data), {
  immediate: false,
  loading: false,
})
// 用户领取

const { send: sendReceiveCoupon, loading: listLoading3 } = useRequest(
  (data) => receiveCoupon(data),
  {
    immediate: false,
    loading: false,
  },
)

const { send: sendGetStdTDCode, countdown } = useCaptcha((params) => getStdTDCode(params), {
  initialCountdown: 60,
  loading: false,
})
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
const format = (val: string) => dayjs(val).format('YYYY-MM-DD HH:mm:ss')

const encrypt = (val: string, type: 'name' | 'cardNo', flag: boolean) => {
  if (flag) return val
  switch (type) {
    case 'name':
      return val.replace(/.{2}$/, '**')
    case 'cardNo':
      return val.replace(/(.{1}).{16}(.{1})/, '$1*********$2')
  }
}

export default () => ({
  getActivityInfo,
  getIsYktUserInfo,
  getUserPageByTagIdInfo,
  sendReceiveCoupon,
  sendGetStdTDCode,
  format,
  encrypt,
  sedGetPromoterById,
  sedBankCodeById,
  sedPromoterOrgUserById,
  countdown,
})
