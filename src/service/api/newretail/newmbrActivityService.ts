import request from './request'

export const NewmbrActivityService = {
  /**
   * 查询指定门店的新用户专享活动列表
   */
  getAll: (storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/newmbrActivity/getAll', { storeId })
  },

  /**
   * 根据活动Id和商品Id查询具体的门店范围
   */
  getNewmbrProductScope: (activityId: string, productId: string): Promise<any> => {
    return request.get('/newretail/api/mall/newmbrActivity/getNewmbrProductScope', {
      activityId,
      productId
    })
  },

  /**
   * 检查是否具有购买商品的资格
   */
  checkQualification: (activityId: string, count: number, productId: string, storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/newmbrActivity/checkQualification', {
      activityId,
      count,
      productId,
      storeId
    })
  }
}

export default NewmbrActivityService