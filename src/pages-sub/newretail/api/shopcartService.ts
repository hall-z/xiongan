import request from './request'

export const ShopcartService = {
  /**
   * 查询餐饮购物车
   * @param storeId 门店id
   * @param business 查询商品归属 DISTRIBUTION：统配 CATERING：门店
   */
  getCatering: (storeId?: string, business?: string): Promise<any> => {
    const params: any = {}
    if (storeId) {
      params.storeId = storeId
    }
    if (business) {
      params.business = business
    }
    return request.get('/newretail/api/catering/shoppingCart/getGroupStore', params)
  },

  cateringAdd: (postData: any): Promise<any> => {
    return request.post('/newretail/api/catering/shoppingCart/create', postData)
  },

  /**
   * 更新餐饮购物车
   */
  update: (postData: any): Promise<any> => {
    return request.put('/newretail/api/catering/shoppingCart/update', postData)
  },

  /**
   * 批量删除购物车中的商品
   * @param shoppingItems 购物项id，多个购物项id以逗号分隔
   */
  remove: (shoppingItems: string): Promise<any> => {
    return request.delete(`/newretail/api/catering/shoppingCart/remove?shoppingItems=${shoppingItems}`)
  },

  /**
   * 查询购物车
   * @param storeId 门店id
   */
  get: (storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/product/shoppingcart/get', { storeId })
  },

  /**
   * 添加商品进入购物车
   */
  add: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/product/shoppingcart/add', postData)
  },

  /**
   * 更新购物车
   */
  sync: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/product/shoppingcart/sync', postData)
  },

  /**
   * 批量删除购物车中的商品
   * @param productIds 商品id，多个商品id以逗号分隔
   */
  removeByProductIds: (productIds: string): Promise<any> => {
    return request.delete(`/newretail/api/mall/product/shoppingcart/removeByProductIds?productIds=${productIds}`)
  },

  /**
   * 查询用户购物车中的商品数量
   */
  getProductsCount: (params?: any): Promise<any> => {
    return request.get('/newretail/api/mall/product/shoppingcart/getProductsCount', params)
  },

  /**
   * 根据商品计算促销金额
   */
  calcDiscount: (postData: any): Promise<any> => {
    return request.post('/newretail/api/promotion/calcDiscount', postData)
  },

  /**
   * 查询用户购物车中门店商品数量，按门店统计商品数量
   */
  getStoreProductsCount: (storeIds: string): Promise<any> => {
    return request.get('/newretail/api/mall/product/shoppingcart/getStoreProductsCount', { storeIds })
  },

  /**
   * 校验购物车项能否下单
   */
  checkShoppingToOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/product/shoppingcart/checkShoppingToOrder', postData)
  },

  /**
   * 发起分享
   */
  createShoppingCartShare: (postData: any): Promise<any> => {
    return request.post('/newretail/api/catering/shoppingCartShare/create', postData)
  },

  /**
   * 查看分享信息
   */
  getShoppingCartShare: (postData: any): Promise<any> => {
    return request.get('/newretail/api/catering/shoppingCartShare/get', postData)
  }
}

export default ShopcartService