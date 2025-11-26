import request from './request'

interface QueryParams {
  page?: number
  pageSize?: number
  memberIdEquals?: string
  [key: string]: any
}

interface OrderDetailsParams {
  orderId: string
  detailOrFe?: string
}

interface ShipmentParams {
  trackingCompany?: string
  trackingNumber?: string
  mobile?: string
  orderId?: string
}

interface RefundParams {
  page?: number
  pageSize?: number
  searchCount?: boolean
  [key: string]: any
}

export const OrderService = {
  /**
   * 获取订单状态
   */
  getStatusCount: (): Promise<any> => {
    return request.get('/newretail/api/mall/order/getStatusCount')
  },

  /**
   * 根据状态分页查询订单
   */
  query: (postData?: QueryParams): Promise<any> => {
    return request.get('/newretail/api/mall/order/queryV2', postData)
  },

  /**
   * 创建订单
   */
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/order/create', postData)
  },

  /**
   * 判断订单中的商品是否有福利计划必选商品
   */
  validateBenefitPlan: (postData: any): Promise<any> => {
    return request.post('/newretail/api/catering/order/validateBenefitPlan', postData)
  },

  /**
   * 创建餐饮订单
   */
  createCatering: (postData: any): Promise<any> => {
    return request.post('/newretail/api/catering/order/create', postData)
  },

  /**
   * 创建混单订单
   */
  createMixedcatering: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mixedcatering/order/createMixed', postData)
  },

  /**
   * 创建抢购活动订单
   */
  createSecKill: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/order/grab/create', postData)
  },

  /**
   * 获得对应的的支付订单签名
   */
  getPaySign: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/order/getPaySign', postData)
  },

  /**
   * 查询订单详情V2
   */
  getDetailsByIdV2: (params: OrderDetailsParams): Promise<any> => {
    return request.get('/newretail/api/catering/order/getDetailsByIdV2', params)
  },

  /**
   * 查询订单详情
   */
  getDetailsById: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/catering/order/getDetailsById', { orderId })
  },

  /**
   * 查询混单订单详情
   */
  getMixedcateringDetailsById: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mixedcatering/order/getDetails', { orderId })
  },

  /**
   * 查询订单状态
   */
  getOrderStatusById: (orderId: string, isSearch?: boolean): Promise<any> => {
    return request.get('/newretail/api/mall/order/getOrderStatusById', {
      orderId,
      queryPromotion: isSearch || false
    })
  },

  /**
   * 取消订单
   */
  cancel: (orderId: string): Promise<any> => {
    return request.put(`/newretail/api/mall/order/cancel?orderId=${orderId}`)
  },

  /**
   * 确认订单
   */
  confirm: (orderId: string): Promise<any> => {
    return request.put(`/newretail/api/mall/order/confirm?orderId=${orderId}`)
  },

  /**
   * 创建退款订单
   */
  createRefund: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/refund/create', postData)
  },

  createOrderByParent: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/refund/createOrderByParent', postData)
  },

  /**
   * 周期购创建退款订单
   */
  createRefundCycle: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/refund/cycleCreate', postData)
  },

  /**
   * 取消退款
   */
  cancelRefund: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/refund/cancel', postData)
  },

  /**
   * 获取数据判断是否可以取消退款
   */
  getDlyById: (postData: any): Promise<any> => {
    return request.get('/newretail/api/mall/refund/getDlyById', postData)
  },

  /**
   * 获取与订单关联的退款单
   */
  getByOrder: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mall/refund/getByParentOrder', { orderId })
  },

  getByOrder1: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mall/refund/getByOrder', { orderId })
  },

  /**
   * 查询退款订单
   */
  queryRefund: (page: number, pageSize: number, opts?: any): Promise<any> => {
    const params: RefundParams = {
      page,
      pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/newretail/api/mall/refund/query', params)
  },

  queryRefundAddress: (refundId: string): Promise<any> => {
    return request.get('/newretail/api/mall/refund/queryRefundAddress', { refundId })
  },

  /**
   * 查询订单物流单号和公司
   */
  getOrderTrackingNumAndCom: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mall/order/getOrderTrackingNumAndCom', { orderId })
  },

  /**
   * 查询快递信息
   */
  getOrderShipDetails: (params: ShipmentParams): Promise<any> => {
    return request.get('/newretail/api/mall/order/getOrderShipDetails', params)
  },

  /**
   * 查询快递轨迹
   */
  getOrderShipDetailsV2: (params: ShipmentParams): Promise<any> => {
    return request.get('/newretail/api/mall/order/getOrderShipDetailsV2', params)
  },

  /**
   * 创建积分商城订单
   */
  createScoreOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/order/createScoreOrder', postData)
  },

  /**
   * 储值卡支付
   */
  cardPay: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/order/cardPay', postData)
  },

  /**
   * 储值卡预支付
   */
  prepareCardPay: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/order/prepareCardPay', postData)
  },

  /**
   * 订单上锁
   */
  orderLock: (orderId: string): Promise<any> => {
    return request.post('/newretail/api/mall/order/orderLock', { orderId })
  },

  /**
   * 获取收货地址信息
   */
  getRideLocation: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mall/delivery/getRideLocation', { orderId })
  },

  /**
   * 获取订单自动取消时间
   */
  getAutoCancelPeriod: (): Promise<any> => {
    return request.get('/newretail/api/mall/order/getAutoCancelPeriod')
  },

  /**
   * 查询订单商品
   */
  getProductsByOrderId: (orderId: string): Promise<any> => {
    return request.get(`/newretail/api/mall/order/getTrackingDetails?id=${orderId}`)
  },

  /**
   * 计算可用礼品卡
   */
  calculateCard: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/order/calculateCard', postData)
  },

  /**
   * 取件
   */
  pickUp: (trackingNumber: string, takeCode: string): Promise<any> => {
    return request.post('/newretail/api/mbr/member/parcel/take', {
      trackingNumber,
      takeCode
    })
  },

  /**
   * 取缓存的订单
   */
  getCacheOrder: (memberCode: string): Promise<any> => {
    return request.get('/newretail/api/catering/order/getCacheOrder', { memberCode })
  },

  /**
   * 获取现金支付签名
   */
  getCashPaySign: (postData: any): Promise<any> => {
    return request.post('/newretail/api/payment/unifiedpay/getCashPaySign', postData)
  },

  /**
   * 查询退款单详情
   */
  getRefundPayment: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mall/refund/getRefundPayment', { orderId })
  },

  getRefundPaymentV2: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mall/refund/getRefundPaymentV2', { orderId })
  },

  getByOrderRefund: (params: any): Promise<any> => {
    return request.get('/newretail/api/mall/refund/getByIdV2', params)
  },

  /**
   * 查询分享订单报表
   */
  getOrderReport: (page: number, pageSize: number, storeId: string): Promise<any> => {
    return request.get('/newretail/api/rpt/order/queryShareOrderReport', {
      page,
      pageSize,
      storeId,
      searchCount: true
    })
  },

  /**
   * 查询退款单详情
   */
  getRefundDetailsById: (id: string): Promise<any> => {
    return request.get('/newretail/api/mall/refund/getById', { id })
  },

  /**
   * 再来一单
   */
  oneMore: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/order/oneMore', postData)
  },

  checkPassword: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/msp/checkPassword', postData)
  },

  historyOrder: (param: any): Promise<any> => {
    return request.get('/newretail/api/history/order/query', param)
  },

  mtOrderQuery: (param: any): Promise<any> => {
    return request.get('/newretail/api/mall/mtxx/query', param)
  },

  /**
   * 计算配送时间
   */
  calculateTime: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/express/template/calculate', postData)
  },

  /**
   * 删除订单
   */
  deleteOrder: (id: string): Promise<any> => {
    return request.delete(`/newretail/api/mall/order/soft/delete?id=${id}`)
  },

  /**
   * 修改订单时间及备注
   */
  deliveryTimeModify: (params: any): Promise<any> => {
    return request.put('/newretail/api/mall/order/deliveryTimeModify', params)
  }
}

export default OrderService