import request from './request'

export const StoreService = {
  /**
   * 查询所有门店
   */
  queryList: function (lastTime?: string): Promise<any> {
    const params: any = {}
    if (lastTime != null) {
      params.lastTime = lastTime
    }
    
    return new Promise(function (resolve, reject) {
      request.get('/newretail/api/mall/store/queryList', params).then((res: any) => {
        if (res && res.length > 0) {
          res.forEach((item: any) => {
            item.virtualStoreId = item.virtualStoreId || item.id || item.parentId
            if (item.virtualStore) {
              item.id = item.parentId
            }
          })
        }
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  },

  /**
   * 查询统配门店
   */
  getDistributionStore: function (): Promise<any> {
    return request.get('/newretail/api/mall/store/getDistributionStore')
  },

  /**
   * 查询门店列表,携带默认10个热销商品信息
   */
  queryHomeProduct: function (params?: any): Promise<any> {
    return request.get('/newretail/api/mall/store/queryHomeProduct', params)
  },

  /**
   * 查询次日达统配门店
   */
  getNextDayStore: function (): Promise<any> {
    return request.get('/newretail/api/mall/store/getNextDayStore')
  },

  /**
   * 根据门店id查询门店详情
   * @param id 门店Id
   */
  getById: function (id: string): Promise<any> {
    const params = {
      id: id
    }
    return request.get('/newretail/api/mall/store/getById', params)
  },

  /**
   * 获取门店下商品的促销标签(目前最多显示三条)
   * @param storeId 门店id
   */
  getPromotionLabels: function (storeId: string): Promise<any> {
    const params = {
      storeId: storeId
    }
    return request.get('/newretail/api/mall/product/shareBalance/getPromotionLabels', params)
  },

  /**
   * 查询最优门店
   */
  bestStoreCalc: function (params?: any): Promise<any> {
    return request.post('/newretail/api/catering/order/bestStoreCalc', params)
  }
}

export default StoreService