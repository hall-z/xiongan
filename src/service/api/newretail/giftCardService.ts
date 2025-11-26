import request from './request'

export const GiftCardService = {
  /**
   * 查询本地礼品卡
   */
  queryActivityGroup: (): Promise<any> => {
    return request.get('/newretail/api/mbr/giftCard/queryActivityGroup')
  },

  /**
   * 查询礼品卡活动信息详情
   */
  queryActivityDetails: (giftCardActivityId: string): Promise<any> => {
    return request.get('/newretail/api/mbr/giftCard/queryActivityDetails', { giftCardActivityId })
  },

  /**
   * 查询我的礼品卡
   */
  queryMyGiftCard: (memberId: string, state?: string): Promise<any> => {
    return request.get('/newretail/api/mbr/giftCard/queryMyGiftCard', {
      memberIdEquals: memberId,
      stateEquals: state || ''
    })
  },

  /**
   * 创建礼品卡订单
   */
  createOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/giftCard/order/create', postData)
  },

  /**
   * 获取支付签名
   */
  getPaySign: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/giftCard/order/getPaySign', postData)
  },

  /**
   * 查询订单状态
   */
  getStatusById: (orderId: string): Promise<any> => {
    return request.get('/newretail/api/mbr/giftCard/order/getStatusById', { orderId })
  },

  /**
   * 查询我的礼品卡详情
   */
  queryMyGiftCardDetails: (cardNo: string): Promise<any> => {
    return request.get('/newretail/api/mbr/giftCard/queryMyGiftCardDetails', { cardNo })
  },

  /**
   * 激活礼品卡
   */
  active: (cardNo: string): Promise<any> => {
    return request.put(`/newretail/api/mbr/giftCard/active?cardNo=${cardNo}`)
  },

  /**
   * 解绑礼品卡
   */
  unActive: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/giftCard/batchUnbind', postData)
  },

  /**
   * 绑定礼品卡
   */
  bindCard: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/giftCard/bindMember', postData)
  },

  /**
   * 赠送礼品卡
   */
  donate: (cardNo: string): Promise<any> => {
    return request.put(`/newretail/api/mbr/giftCard/donate?cardNo=${cardNo}`)
  },

  /**
   * 领取赠送的卡
   */
  acquireDonate: (cardNo: string): Promise<any> => {
    return request.get('/newretail/api/mbr/giftCard/acquireDonate', { cardNo })
  },

  /**
   * 查询礼品卡信息(不含有使用规则)
   */
  queryGiftCardInfo: (cardNo: string): Promise<any> => {
    return request.get('/newretail/api/mbr/giftCard/queryGiftCardInfo', { cardNo })
  },

  /**
   * 获取付款码
   */
  getPayCode: (giftCardNo: string): Promise<any> => {
    return request.get('/newretail/api/mbr/giftCard/getPayCode', { giftCardNo })
  },

  /**
   * 查询礼品卡活动信息详情
   */
  getById: (id: string): Promise<any> => {
    return request.get('/newretail/api/mbr/giftCard/activity/getById', { id })
  }
}

export default GiftCardService