import request from './request'

export const WisdomService = {
  /**
   * 埋点
   */
  buryingPoint: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/wisdom/buryingPoint', postData)
  },

  /**
   * 获得推荐商品
   */
  getRecommend: (openid: string, storeId: string, opts?: any): Promise<any> => {
    const params = {
      openid,
      storeId,
      ...opts
    }
    return request.get('/newretail/api/mall/wisdom/getRecommend', params)
  }
}

export default WisdomService