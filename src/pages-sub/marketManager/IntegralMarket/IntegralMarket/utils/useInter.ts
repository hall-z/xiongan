import {
  exchangeGoods,
  getExchangeGoodsInfo,
  getExchangeGoodsList,
  getIntegralInfo,
  getPointsInfoRecordPage,
} from '@/service/api/integral'
import { useRequest } from 'alova/client'
import { goodsInfoProps } from './types'

// 查询我的积分
const { send: sendInterInfo } = useRequest(() => getIntegralInfo(), {
  immediate: false,
  loading: false,
})

// 查询积分商品列表
const { send: sendInterProductList, loading } = useRequest((data) => getExchangeGoodsList(data), {
  immediate: false,
  loading: false,
})

// 查询积分兑换列表
const { send: sendPointsInfoRecordPage } = useRequest((data) => getPointsInfoRecordPage(data), {
  immediate: false,
  loading: false,
})

// 查询积分商品详情
const { send: sendInterProductInfo, data: goodsInfoData } = useRequest(
  (data) => getExchangeGoodsInfo<goodsInfoProps>(data),
  {
    immediate: false,
    loading: false,
  },
)

// 提交积分兑换
const { send: sendExchangeGoods } = useRequest((data) => exchangeGoods(data), {
  immediate: false,
  loading: false,
})

export default () => {
  return {
    sendInterProductList,
    sendInterInfo,
    sendInterProductInfo,
    sendExchangeGoods,
    sendPointsInfoRecordPage,
  }
}
