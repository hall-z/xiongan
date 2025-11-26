import request from './request'

export const TeamBuyService = {
  /**
   * 创建团购活动
   */
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/teamBuyingActivity/create', postData)
  },

  /**
   * 团购活动下单
   */
  createOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/teamBuyingActivity/createOrder', postData)
  },

  /**
   * 查看团购商品详情
   */
  getGoodsDetails: (id: string): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingActivity/getDetails', { id })
  },

  /**
   * 查看团购详情
   */
  getDetails: (id: string, teamLeaderRecordId?: string): Promise<any> => {
    const params: any = { id }
    if (teamLeaderRecordId) params.teamLeaderRecordId = teamLeaderRecordId
    return request.get('/newretail/api/mall/teamBuyingActivity/getDetails', params)
  },

  /**
   * 根据门店查看团购详情
   */
  getDetailsByStoreId: (id: string, storeId: string, teamLeaderRecordId?: string): Promise<any> => {
    const params: any = { id, storeId }
    if (teamLeaderRecordId) params.teamLeaderRecordId = teamLeaderRecordId
    return request.get('/newretail/api/mall/teamBuyingActivity/getDetails', params)
  },

  /**
   * 获取正在进行中的团购信息
   */
  getOpenTeamBuyings: (storeId: string, productId: string, teamBuyingId: string): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingActivity/getOpenTeamBuyings', {
      storeId,
      productId,
      teamBuyingId
    })
  },

  /**
   * 分页查询团购信息
   */
  query: (postData: any): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingActivity/query', postData)
  },

  /**
   * 查询已开始的团购活动列表
   */
  getStartedTeamBuyingByStoreId: (storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingActivity/getStartedTeamBuyingByStoreId', { storeId })
  },

  /**
   * 删除团购活动
   */
  removeById: (postData: any): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingActivity/removeById', postData)
  },

  /**
   * 查询团购应用的门店列表
   */
  getStoresById: (id: string): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingActivity/getStoresById', { id })
  },

  /**
   * 根据团购Id查询团购活动详情
   */
  getById: (teamId: string): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingActivity/getById', { teamId })
  },

  /**
   * 查询团长未退款的团员
   */
  getRecordsByLeaderId: (leaderId: string): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingLeader/getRecordsByLeaderId', { leaderId })
  },

  /**
   * 查询团长列表
   */
  getTenByTeamId: (teamId: string): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingLeader/getTenByTeamId', { teamId })
  },

  /**
   * 查看团购子商品
   */
  getChildrenProduct: (teamId: string): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingActivity/child/get', { teamId })
  },

  /**
   * 获得团购商品子商品和规格值
   */
  getSpecDetails: (activityId: string, productId: string, storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/teamBuyingActivity/child/getSpecDetails', {
      activityId,
      productId,
      storeId
    })
  }
}

export default TeamBuyService