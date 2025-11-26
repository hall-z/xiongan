import {
  changeOrderStatus,
  getOrderInfo,
  getOrderInfo1,
  getOrderInfoJF,
  getOrderList,
  getPostInfo,
  getPostList,
  getRefund,
  getRefundRequest,
  getRefundReview,
  gethuifu,
  getsubmitTickets,
  logistics,
  orderUpdate,
  updateOrderStatusById,
} from '@/service/api/shop'
import { getOrderInterfereStatus } from '@/service/api/userMessage'

import { useRequest } from 'alova/client'

// 查询订单详情
const { send: sendOrderInfo1 } = useRequest((data) => getOrderInfo1(data), {
  immediate: false,
  loading: false,
})
const { send: sendOrderInfo } = useRequest((data) => getOrderInfo(data), {
  immediate: false,
  loading: false,
})
const { send: sendOrderInfoJF } = useRequest((data) => getOrderInfoJF(data), {
  immediate: false,
  loading: false,
})

// 查询订单列表
const { send: sendOrderList } = useRequest((data) => getOrderList(data), {
  immediate: false,
  loading: false,
})
const { send: updateOrderBeanStatusById } = useRequest((data) => updateOrderStatusById(data), {
  immediate: false,
  loading: false,
})

const { send: sendchangeOrderStatus } = useRequest((data) => changeOrderStatus(data), {
  immediate: false,
  loading: false,
})
const { send: sendRefund } = useRequest((data) => getRefund(data), {
  immediate: false,
  loading: false,
})
const { send: sendRefundRequest } = useRequest((data) => getRefundRequest(data), {
  immediate: false,
  loading: false,
})
const { send: sendRefundReview } = useRequest((data) => getRefundReview(data), {
  immediate: false,
  loading: false,
})

const { send: getLogistics } = useRequest((data) => logistics(data), {
  immediate: false,
  loading: false,
})

const { send: sendOrderUpdate } = useRequest((data) => orderUpdate(data), {
  immediate: false,
  loading: false,
})
const { send: sendPostList } = useRequest((data) => getPostList(data), {
  immediate: false,
  loading: false,
})
const { send: sendPostInfo } = useRequest((data) => getPostInfo(data), {
  immediate: false,
  loading: false,
})
const { send: sendhuifu } = useRequest((data) => gethuifu(data), {
  immediate: false,
  loading: false,
})
const { send: submitTickets } = useRequest((data) => getsubmitTickets(data), {
  immediate: false,
  loading: false,
})

const { send: sendOrderInterfereStatus } = useRequest((data) => getOrderInterfereStatus(data), {
  immediate: false,
  loading: false,
})

export default () => {
  return {
    sendOrderInfo1,
    sendOrderInfo,
    sendOrderList,
    sendchangeOrderStatus,
    sendRefund,
    sendRefundRequest,
    sendRefundReview,
    sendOrderUpdate,
    updateOrderBeanStatusById,
    getLogistics,
    sendPostList,
    sendPostInfo,
    sendhuifu,
    submitTickets,
    sendOrderInterfereStatus,
  }
}
