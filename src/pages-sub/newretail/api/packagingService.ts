import request from './request'

export const PackagingService = {
  /**
   * 分页查询打包一口价活动
   */
  query: (page: number, pageSize: number, opts?: any): Promise<any> => {
    const params = {
      page,
      pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/newretail/api/mall/packaging/activity/query', params)
  },

  /**
   * 查询打包一口价活动详情
   */
  get: (id: string, storeId?: string | null): Promise<any> => {
    const params: any = { id }
    if (storeId) {
      params.storeId = storeId
    }
    return request.get('/newretail/api/mall/packaging/activity/get', params)
  },

  /**
   * 计算打包活动购物车
   */
  calcShopping: (price: number, products: any, split: boolean): Promise<any> => {
    return request.post(`/newretail/api/mall/packaging/order/calcShopping?price=${price}&split=${split}`, products)
  },

  /**
   * 打包活动活动下单
   */
  createOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/packaging/order/createOrder', postData)
  }
}

export default PackagingService