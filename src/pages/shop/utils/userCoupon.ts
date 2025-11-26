import {
  getCouponInfo,
  getOrderInfo,
  getUseOffline,
  getUseRecord,
  shopCarList,
  updateOrderStatusById,
} from '@/service/api/shop'
import { getCouponList, getUserCouponList, receiveCoupon } from '@/service/api/userMessage'
import { useRequest } from 'alova/client'
import { conponListProps } from './types'
// 查询列表
const { send: sendCouponList, loading: listLoading } = useRequest((data) => getCouponList(data), {
  immediate: false,
  loading: false,
})

// 查询user领取列表
const { send: sendUserCouponList, loading: listLoading2 } = useRequest(
  (data) => getUserCouponList(data),
  {
    immediate: false,
    loading: false,
  },
)
const { send: sendOrderInfo } = useRequest((data) => getOrderInfo(data), {
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
// 券码详情

const { send: sendCouponInfo, data: couponInfoData } = useRequest(
  (data) => getCouponInfo<conponListProps>(data),
  {
    immediate: false,
    loading: false,
    initialData: {} as conponListProps,
  },
)
// 线下核销
const { send: sendUseOffline } = useRequest((data) => getUseOffline(data), {
  immediate: false,
  loading: false,
})

const { send: updateOrderBeanStatusById } = useRequest((data) => updateOrderStatusById(data), {
  immediate: false,
  loading: false,
})

// 核销记录
const { send: sendUseRecord } = useRequest((data) => getUseRecord(data), {
  immediate: false,
  loading: false,
})

// 购物车角标
const { send: sendShopCarList } = useRequest((data) => shopCarList(data), {
  immediate: false,
  loading: false,
})

export default () => {
  return {
    sendCouponList,
    sendUserCouponList,
    sendReceiveCoupon,
    sendCouponInfo,
    couponInfoData,
    sendUseRecord,
    sendUseOffline,
    sendOrderInfo,
    updateOrderBeanStatusById,
    sendShopCarList,
  }
}
