import { serveListProps, shopDetilProps, shopPayListProps } from './types'

import {
  getAppTargetOrderIdByShop,
  getBusinessInfo,
  getOrderStatistics,
  getShopDetail,
} from '@/service/api/shop'
import { useRequest } from 'alova/client'
import daifahuo from '../static/daifahuo.png'
import dafukuan from '../static/daifukuan.png'
import daishouhuo from '../static/daishouhuo.png'
import shouhou from '../static/shouhoudd.png'
import shoukuanjilu from '../static/shoukuanjilu.png'
import shoukuanma from '../static/shoukuanma.png'
import smsk from '../static/smsk.png'
import yhq from '../static/yhq.png'
import yhqlog from '../static/yhqlog.png'

const serveOrderList = ref<serveListProps[]>([
  {
    label: '待付款',
    icon: dafukuan,
    value: 0,
    path: '/pages-sub/order/orderListBusiness?tabsVal=1',
  },
  {
    label: '待发货',
    icon: daifahuo,
    value: 0,
    path: '/pages-sub/order/orderListBusiness?tabsVal=10',
  },
  {
    label: '待收货',
    icon: daishouhuo,
    value: 0,
    path: '/pages-sub/order/orderListBusiness?tabsVal=11',
  },
  {
    label: '售后订单',
    icon: shouhou,
    value: 0,
    path: '/pages-sub/order/orderListBusiness?tabsVal=20,21,22,23,25,26',
  },
])

const dataList = ref<serveListProps[]>([
  {
    label: '今日收款 (元)',
    icon: dafukuan,
    value: 0,
    path: '/pages-sub/shopManager/orderList/index?status=0',
  },
  {
    label: '今日订单 (笔)',
    icon: daifahuo,
    value: 0,
    path: '/pages-sub/shopManager/orderList/index?status=0',
  },
  {
    label: '待收货订单金额',
    icon: daishouhuo,
    value: 0,
    path: '/pages-sub/shopManager/orderList/index?status=0',
  },
  {
    label: '优惠券领取数',
    icon: shouhou,
    value: 0,
    path: '/pages-sub/shopManager/orderList/index?status=0',
  },
  {
    label: '优惠券核销',
    icon: shouhou,
    value: 0,
    path: '/pages-sub/shopManager/orderList/index?status=0',
  },
  {
    label: '新增粉丝',
    icon: shouhou,
    value: 0,
    path: '/pages-sub/shopManager/orderList/index?status=0',
  },
])

const serveList = ref<serveListProps[]>([
  {
    label: '收款码',
    icon: shoukuanma,
    value: 0,
    path: '/pages-sub/shopManager/shopCode',
  },
  {
    label: '收款记录',
    icon: shoukuanjilu,
    value: 0,
    path: '/pages-sub/shopManager/shopPayList',
  },
  {
    label: '核销订单',
    icon: smsk,
    value: 0,
    path: '/pages-sub/marketManager/coupon/writeOffOrder',
  },
  {
    label: '核销优惠券',
    icon: yhq,
    value: 0,
    path: '/pages-sub/marketManager/coupon/writeOffCoup',
  },

  {
    label: '优惠券核销记录',
    icon: yhqlog,
    value: 0,
    path: '/pages-sub/marketManager/coupon/writeOffCoupList',
  },

  // {
  //   label: '扫码收款',
  //   icon: smsk,
  //   value: 0,
  //   path: '/pages-sub/userManager/bankCard/PayInfo',
  // },
])

//  查询商户信息
const { send: sendShopDetail, data: shopMessage } = useRequest(
  (data) => getShopDetail<shopDetilProps>(data),
  {
    immediate: false,
    loading: false,
    initialData: {},
  },
)

//  查询商户收款记录
const { send: sendOrderIdByShop, data: shopPayList } = useRequest(
  (data) => getAppTargetOrderIdByShop<shopPayListProps>(data),
  {
    immediate: false,
    loading: false,
    initialData: [],
  },
)
const { send: sendBusinessInfo } = useRequest((data) => getBusinessInfo(data), {
  immediate: false,
  loading: false,
})

const { send: sendOrderStatistics } = useRequest((data) => getOrderStatistics(data), {
  immediate: false,
  loading: false,
})

export default () => {
  return {
    serveOrderList,
    dataList,
    serveList,
    shopMessage,
    sendShopDetail,
    sendOrderIdByShop,
    shopPayList,
    sendOrderStatistics,
    sendBusinessInfo,
  }
}
