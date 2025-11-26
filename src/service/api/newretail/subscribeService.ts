import request from './request'

export const SubscribeService = {
  /**
   * 添加订阅数
   */
  add: (postData: any): Promise<any> => {
    return request.post('/newretail/api/wxa/template/subscribe/add', postData)
  },

  /**
   * 获得会员关注数
   */
  getByMember: (memberId: string): Promise<any> => {
    return request.get('/newretail/api/wxa/template/subscribe/getByMember', { memberId })
  },

  /**
   * 获取临时URL
   */
  getTemporaryUrl: (url: string): Promise<any> => {
    const postData = { url }
    return request.post('/newretail/api/dfs/getTemporaryUrl', postData)
  }
}

export default SubscribeService