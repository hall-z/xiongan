import request from './request'

export const FloristService = {
  /**
   * 查询花艺师
   */
  serviceStaffQuery: (params: any): Promise<any> => {
    return request.post('/newretail/api/service/staff/serviceStaffQuery', params)
  },

  /**
   * 查询服务项目
   */
  productQuery: (params: any): Promise<any> => {
    return request.post('/newretail/api/service/staff/productQuery', params)
  },

  /**
   * 根据花艺师id查询详情
   */
  getServiceStaffDetails: (params: any): Promise<any> => {
    return request.get('/newretail/api/service/staff/getServiceStaffDetails', params)
  },

  /**
   * 根据服务项目id查询详情
   */
  getProductDetails: (params: any): Promise<any> => {
    return request.get('/newretail/api/service/staff/getProductDetails', params)
  },

  /**
   * 服务项目查询时间
   */
  getProductTime: (params: any): Promise<any> => {
    return request.get('/newretail/api/service/staff/getProductTime', params)
  },

  /**
   * 花艺师查询时间
   */
  getServiceStaffTime: (params: any): Promise<any> => {
    return request.get('/newretail/api/service/staff/getServiceStaffTime', params)
  },

  /**
   * 创建订单
   */
  createServiceOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/service/order/create', postData)
  }
}

export default FloristService