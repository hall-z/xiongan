import request from './request'

export const BargainService = {
  /**
   * 分页查询砍价活动
   */
  query: (postData: any): Promise<any> => {
    return request.get('/newretail/api/bargin/activity/query', postData)
  },

  /**
   * 查询砍价活动详情
   */
  getDetails: (id: string, storeId?: string): Promise<any> => {
    const params: any = { id }
    if (storeId) {
      params.storeId = storeId
    }
    return request.get('/newretail/api/bargin/activity/get', params)
  },

  /**
   * 新增砍价实例
   */
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/bargin/instance/create', postData)
  },

  /**
   * 查询砍价实例详情
   */
  getInstanceDetails: (id: string): Promise<any> => {
    return request.get('/newretail/api/bargin/instance/get', { id })
  },

  /**
   * 查询最新的砍价实例
   */
  getNew: (): Promise<any> => {
    return request.get('/newretail/api/bargin/instance/getNew')
  },

  /**
   * 分页查询砍价实例
   */
  queryInstance: (postData: any): Promise<any> => {
    if (postData?.statusIn && postData.statusIn.length > 0) {
      let opts = ""
      const tempArr = [].concat(postData.statusIn)
      tempArr.forEach((item, index) => {
        if (index === 0) {
          opts = opts + '?statusIn=' + item
        } else {
          opts = opts + '&statusIn=' + item
        }
      })
      delete postData.statusIn
      for (const key in postData) {
        if (postData.hasOwnProperty(key)) {
          const ele = postData[key]
          opts = opts + '&' + key + '=' + ele
        }
      }
      return request.get('/newretail/api/bargin/instance/query' + opts)
    } else {
      return request.get('/newretail/api/bargin/instance/query', postData)
    }
  },

  /**
   * 砍价活动下单
   */
  createOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/bargin/order/create', postData)
  },

  /**
   * 新增帮砍记录
   */
  help: (postData: any): Promise<any> => {
    return request.post('/newretail/api/bargin/record/help', postData)
  },

  /**
   * 分页查询帮砍记录
   */
  queryHelpRecord: (postData: any): Promise<any> => {
    return request.get('/newretail/api/bargin/record/query', postData)
  }
}

export default BargainService