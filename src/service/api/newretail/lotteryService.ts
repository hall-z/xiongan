import request from './request'

export const LotteryService = {
  /**
   * 分页查询通用抽奖活动
   */
  query: (postData: any): Promise<any> => {
    return request.get('/newretail/api/recharge/draw/activity/query', postData)
  },

  /**
   * 分页查询充值抽奖实例
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
      return request.get('/newretail/api/lottery/instance/query' + opts)
    } else {
      return request.get('/newretail/api/lottery/instance/query', postData)
    }
  },

  /**
   * 助力
   */
  help: (postData: any): Promise<any> => {
    return request.post('/newretail/api/lottery/instance/help', postData)
  },

  /**
   * 是否助力过此次实例
   */
  hasHelp: (instanceId: string, memberId: string): Promise<any> => {
    return request.get('/newretail/api/lottery/instance/hasHelp', {
      instanceId,
      memberId
    })
  },

  /**
   * 根据实例Id查询通用抽奖实例
   */
  getInstanceById: (instanceId: string): Promise<any> => {
    return request.get('/newretail/api/lottery/instance/getById', { instanceId })
  },

  /**
   * 新增充值抽奖实例
   */
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/lottery/instance/create', postData)
  },

  /**
   * 根据实例Id查询助力记录
   */
  getHelpRecords: (instanceId: string): Promise<any> => {
    return request.get('/newretail/api/lottery/instance/updateAddress', { instanceId })
  },

  /**
   * 根据订单修改地址
   */
  updateAddress: (postData: any): Promise<any> => {
    return request.post('/newretail/api/lottery/instance/updateAddress', postData)
  },

  /*********** 充值抽奖相关***********/
  /**
   * 创建充值抽奖订单
   */
  createRechargeDrawOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/recharge/draw/activity/createRechargeDrawOrder', postData)
  },

  /**
   * 查询正在进行中的充值抽奖活动(不分页)
   */
  getOnline: (): Promise<any> => {
    return request.get('/newretail/api/recharge/draw/activity/getOnline')
  },

  /**
   * 查询通用抽奖活动实例id
   */
  getInstanceId: (rechargeOrderId: string): Promise<any> => {
    return request.get('/newretail/api/recharge/draw/activity/getInstanceId', { rechargeOrderId })
  }
}

export default LotteryService