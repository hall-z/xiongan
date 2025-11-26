import request from './request'

export const SeckillService = {
  /**
   * 检查是否具有购买商品的资格
   */
  checkQualification: (postData: any): Promise<any> => {
    return request.get('/newretail/api/mall/grabActivity/checkQualification', postData)
  },

  /**
   * 查询指定组织下的所有秒杀活动
   */
  getsByOrgId: (orgId: string): Promise<any> => {
    return request.get('/newretail/api/mall/grabActivity/getsByOrgId', { orgId })
  },

  /**
   * 查询秒杀活动
   */
  query: (postData: any): Promise<any> => {
    return request.get('/newretail/api/mall/grabActivity/query', postData)
  },

  /**
   * 查询秒杀活动商品
   */
  queryProduct: (postData: any): Promise<any> => {
    return request.get('/newretail/api/mall/grabActivity/product/query', postData)
  },

  /**
   * 查看秒杀子商品
   */
  getChildrenProduct: (parentGrabProductId: string): Promise<any> => {
    return request.get('/newretail/api/mall/grabActivity/child/get', { 
      parentGrabProductId 
    })
  },

  /**
   * 获得秒杀商品子商品和规格值
   */
  getSpecDetails: (activityId: string, productId: string, storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/grabActivity/child/getSpecDetails', {
      activityId,
      productId, 
      storeId
    })
  }
}

export default SeckillService
