import request from './request'

export const AdvanceSellService = {
  /**
   * 查询预售活动和商品详情
   */
  getByIds: (advanceId: string, productId: string, storeId?: string): Promise<any> => {
    return request.get('/newretail/api/mall/advanceSell/getByIds', {
      advanceId,
      productId,
      storeId
    })
  },

  /**
   * 分页查询预售活动
   */
  query: (postData: any): Promise<any> => {
    return request.get('/newretail/api/mall/advanceSell/query', postData)
  },

  /**
   * 获得尾款支付的签名
   */
  getBalancePaySign: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/advanceSell/getBalancePaySign', postData)
  },

  /**
   * 创建预售订单
   */
  createOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/advanceSell/createOrder', postData)
  },

  /**
   * 获得尾款订单
   */
  getBalanceOrderByOrderId: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mall/advanceSell/getBalanceOrderByOrderId', { orderId })
  }
}

export default AdvanceSellService