// 转换状态文本显示
import { Order } from './types'
const statusMap = [
  {
    status: 1,
    text: '待付款',
    url: '',
    color: '#e3832a',
  },
  {
    status: 2,
    text: '已完成',
    url: '',
    color: '#e3832a',
  },
  {
    status: 3,
    text: '已取消',
    url: '',
    color: '#e3832a',
  },
  {
    status: 10,
    text: '待发货',
    url: '',
    color: '#e3832a',
  },

  {
    status: 11,
    text: '待使用',
    url: '',
    color: '#e3832a',
  },
  {
    status: 20,
    text: '退款中',
    url: '',
    color: '#e3832a',
  },
  {
    status: 23,
    text: '退款失败',
    url: '',
    color: '#e3832a',
  },
  {
    status: 22,
    text: '退款成功',
    url: '',
    color: '#e3832a',
  },
  {
    status: 24,
    text: '退款中',
    url: '',
    color: '#e3832a',
  },
  {
    status: 25,
    text: '退款中',
    url: '',
    color: '#e3832a',
  },
  {
    status: 26,
    text: '退款中',
    url: '',
    color: '#e3832a',
  },
]

const AfterSalesServiceStatusMap = [
  {
    status: '0',
    text: '非售后',
    url: '/pages-sub/order/orderInfo',
  },
  {
    status: '1',
    text: '售后详情',
    url: '/pages-sub/AfterSalesService/SalesDetil/index',
  },
  {
    status: '2',
    text: '退货寄回',
    url: '/pages-sub/AfterSalesService/ReturnShipment/index',
  },
  {
    status: '3',
    text: '等待商户收货',
    url: '/pages-sub/AfterSalesService/SalesMerchant/index',
  },
  {
    status: '4',
    text: '商户拒收',
    url: '/pages-sub/AfterSalesService/SalesMerchantReject/index',
  },
  {
    status: '5',
    text: '售后完成',
    url: '/pages-sub/AfterSalesService/SalesMerchantOver/index',
  },
  {
    status: '6',
    text: '商家驳回',
    url: '/pages-sub/AfterSalesService/SalesMerchantfaill/index',
  },
]

export const changeStatusText = (item: Order) => {
  // 是否售后状态
  if (Number(item.afterSalesStatus) > 0) {
    return AfterSalesServiceStatusMap.find((i) => i.status === item.afterSalesStatus)
  } else {
    const data = statusMap.find((i) => i.status === item.status)

    if (data.status === 11) {
      return {
        ...data,
        text: item.deliveryMode === 1 ? '待使用' : '待收货',
      }
    }
    return data
  }
}
