import request from './request'

export const SolitaireService = {
  /**
   * 团购活动下单
   */
  createOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/solitaire/createOrder', postData)
  },

  /**
   * 分页查询接龙信息
   */
  query: (postData: any): Promise<any> => {
    return request.get('/newretail/api/mall/solitaire/query', postData)
  },

  /**
   * 根据接龙活动id查询该接龙应用的门店列表
   */
  getStoresById: (id: string): Promise<any> => {
    return request.get('/newretail/api/mall/solitaire/getStoresById', { id })
  },

  /**
   * 根据接龙活动Id查询接龙活动详情
   */
  getById: (id: string, storeId?: string): Promise<any> => {
    const params: any = { id }
    if (storeId) params.storeId = storeId
    return request.get('/newretail/api/mall/solitaire/getById', params)
  },

  /**
   * 根据接龙活动Id查询记录详情
   */
  getRecordsById: (page: number, pageSize: number, opts?: any): Promise<any> => {
    const params = {
      page,
      pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/newretail/api/mall/solitaire/getRecordsById', params)
  },

  /**
   * 查看接龙商品子商品
   */
  getChildrenProduct: (solitaireId: string, productIds?: string): Promise<any> => {
    const params: any = { solitaireId }
    if (productIds) params.productIds = productIds
    return request.get('/newretail/api/mall/solitaire/child/get', params)
  },

  /**
   * 获得接龙商品子商品和规格值
   */
  getSpecDetails: (solitaireId: string, productId: string, storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/solitaire/child/getSpecDetails', {
      solitaireId,
      productId,
      storeId
    })
  },

  /**
   * 校验活动商品能否购买
   */
  checkProduct: (postData: any): Promise<any> => {
    return request.put('/newretail/api/mall/solitaire/checkProduct', postData)
  }
}

export default SolitaireService