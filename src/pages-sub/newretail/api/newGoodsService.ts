import request from './request'

export const NewGoodsService = {
  /**
   * 查询新品活动商品
   */
  query: (opts?: any): Promise<any> => {
    const params = { ...opts }
    return request.get('/newretail/api/mall/product/new/queryStoreProduct', params)
  }
}

export default NewGoodsService