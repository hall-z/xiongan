import request from './request'

export const ScoreProductService = {
  /**
   * 查询积分商品
   */
  productQuery: (opts?: any): Promise<any> => {
    const params = { ...opts }
    return request.get('/newretail/api/mall/score/product/query', params)
  },

  /**
   * 创建积分订单
   */
  creatScoreOrder: (params: any): Promise<any> => {
    return request.put('/newretail/api/mall/score/product/prize', params)
  },

  /**
   * 查询积分订单
   */
  queryScoreOrder: (params: any): Promise<any> => {
    return request.get('/newretail/api/mall/score/product/record/query', params)
  },

  /**
   * 获取积分商品详情
   */
  getScoreProductById: (id: string): Promise<any> => {
    return request.get('/newretail/api/mall/score/product/getById', { id })
  },

  /**
   * 查询门店库存
   */
  getStoreBalance: (id: string, storeIds: string): Promise<any> => {
    return request.get('/newretail/api/mall/score/product/getStoreBalance', {
      id,
      storeIds
    })
  },

  /**
   * 查询积分活动
   */
  queryActivity: (params: any): Promise<any> => {
    return request.get('/newretail/api/mall/score/activity/query', params)
  },

  /**
   * 查询会员对应活动剩余兑换次数
   */
  getMemberCount: (activityId: string, memberId: string): Promise<any> => {
    return request.get('/newretail/api/mall/score/activity/getMemberCount', {
      activityId,
      memberId
    })
  },

  /**
   * 根据活动Id查询门店列表
   */
  getStoresById: (id: string): Promise<any> => {
    return request.get('/newretail/api/mall/score/activity/getStoresById', { id })
  }
}

export default ScoreProductService