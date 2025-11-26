import request from './request'

export const CycleTypeEnum = {
  WEEKLY: 'WEEKLY', // 按周
  MONTHLY: 'MONTHLY', // 按月
  CUSTOM: 'CUSTOM' // 自定义
}

export const ShipmentTypeEnum = {
  EXPRESS: 1, // 快递配送
  SELF: 2, // 自提
  BOTH: 3 // 快递配送和自提
}

export const CycleService = {
  /**
   * 根据门店查询周期购活动
   */
  getCycleByStoreId: (storeId: number): Promise<any> => {
    return request.get('/newretail/api/mall/c/cycle/getCycleByStoreId', { storeId })
  },

  /**
   * 根据周期购活动id，查询商品可订购周期范围
   */
  getCycleByFixedId: (id: number, storeId: number, date: string = ''): Promise<any> => {
    return request.get('/newretail/api/mall/c/cycle/getCycleByFixedId', {
      id,
      storeId,
      date
    })
  },

  /**
   * 根据周期购活动id查询商品信息
   */
  getCycleProduct: (id: number, storeId: number): Promise<any> => {
    return request.get('/newretail/api/mall/c/cycle/getCycleProduct', {
      id,
      storeId
    })
  },

  /**
   * 创建周期购订单
   */
  createCycleOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/cycle/order/create', postData)
  },

  /**
   * 获取周期购配送进度
   */
  getCycleTimeDTO: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mall/c/cycle/getDeliveryDate', { orderId })
  },

  /**
   * 更新订单时间
   */
  updateOrderTime: (postData: any): Promise<any> => {
    return request.post('/newretail/api/cycle/order/update', postData)
  }
}

export default CycleService