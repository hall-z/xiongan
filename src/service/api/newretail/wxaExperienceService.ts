import request from './request'

export const WxaExperienceService = {
  /**
   * 查询用户是否有体验者信息
   */
  checkHasExperiencer: (openId: string): Promise<any> => {
    return request.get('/newretail/api/wxa/experience/checkHasExperiencer', { openId })
  },

  /**
   * 插入体验者信息
   */
  create: (companyName: string, mobile: string, name: string, openId: string): Promise<any> => {
    return request.post('/newretail/api/wxa/experience/create', {
      companyName,
      mobile,
      name,
      openId
    })
  }
}

export default WxaExperienceService