import request from './request'

export const PennyService = {
  /**
   * 分页查询购物抽奖活动
   */
  query: (postData: any): Promise<any> => {
    return request.get('/newretail/api/penny/activity/query', postData)
  },

  /**
   * 查询正在进行中的购物抽奖活动
   */
  getOnline: (): Promise<any> => {
    return request.get('/newretail/api/penny/activity/getOnline')
  },

  /**
   * 分页查询购物抽奖实例
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
      return request.get('/newretail/api/penny/instance/query' + opts)
    } else {
      return request.get('/newretail/api/penny/instance/query', postData)
    }
  },

  /**
   * 新增购物抽奖活动助力记录
   */
  help: (postData: any): Promise<any> => {
    return request.post('/newretail/api/penny/record/help', postData)
  },

  /**
   * 是否助力过此次实例
   */
  isHelp: (postData: any): Promise<any> => {
    return request.post('/newretail/api/penny/record/isHelp', postData)
  },

  /**
   * 根据实例Id查询购物抽奖实例
   */
  getInstanceById: (instanceId: string): Promise<any> => {
    return request.get('/newretail/api/penny/instance/getInstanceById', { instanceId })
  },

  /**
   * 新增购物抽奖实例
   */
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/penny/instance/create', postData)
  },

  /**
   * 根据订单修改地址
   */
  updateAddressByOrederId: (postData: any): Promise<any> => {
    return request.post('/newretail/api/penny/instance/updateAddressByOrederId', postData)
  }
}

export default PennyService