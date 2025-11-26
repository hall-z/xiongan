import request from './request'

export const AddressService = {
  /**
   * 获取当前会员的收货地址信息
   */
  query: (): Promise<any> => {
    return request.get('/newretail/api/mall/deliveryAddress/query')
  },

  /**
   * 新增收货地址
   */
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/deliveryAddress/create', postData)
  },

  completeRefundOrderTracking: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/refund/completeRefundOrderTracking', postData)
  },

  /**
   * 获取当前会员的默认收货地址
   */
  getDefaultAddress: (): Promise<any> => {
    return request.get('/newretail/api/mall/deliveryAddress/getDefaultAddress')
  },

  /**
   * 更新收货地址
   */
  update: (postData: any): Promise<any> => {
    return request.put('/newretail/api/mall/deliveryAddress/update', postData)
  },

  /**
   * 根据id删除该条收货地址
   */
  removeById: (id: string): Promise<any> => {
    return request.delete(`/newretail/api/mall/deliveryAddress/removeById?id=${id}`)
  },

  /**
   * 检查收货地址门店是否能够配送
   */
  checkDelivery: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/deliveryAddress/checkDelivery', postData)
  },

  /**
   * 自动识别地址
   */
  extractionAddress: (str: string): Promise<any> => {
    return request.get(`/newretail/api/mall/deliveryAddress/extractionAddress?str=${str}`)
  }
}

export default AddressService