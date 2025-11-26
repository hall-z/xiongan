import request from './request'

export const RechargeService = {
  /**
   * 查询所有充值金额
   */
  query: (postData?: any): Promise<any> => {
    return request.get('/newretail/api/mbr/recharge/query', postData)
  },

  /**
   * 创建充值订单
   */
  createOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/recharge/createOrder', postData)
  },

  /**
   * 获得对应的的支付订单签名
   */
  getPaySign: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/recharge/getPaySign', postData)
  },

  /**
   * 储值卡充值接口
   */
  imprestCard: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/recharge/imprestcard', postData)
  },

  /**
   * 查询订单详情
   */
  getOrderById: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mbr/recharge/getOrderById', { orderId })
  }
}

export default RechargeService