import request from './request'
import utils from '@/utils/newretail/utils'

export const WxaUserService = {
  /**
   * 用户登录
   */
  login: (userLogin = false, sessionExpired = false, decryptUserInfo = true, userInfo = null): Promise<any> => {
    return request.login(userLogin, sessionExpired, decryptUserInfo, userInfo)
  },

  /**
   * 绑定手机
   */
  bindMobile: (data: any): Promise<any> => {
    const params: any = {
      mobile: data.mobile,
      captcha: data.captcha,
      registerSourceType: data.registerSourceType,
      registerStoreId: data.registerStoreId
    }

    if (data.invitation) {
      params.invitation = data.invitation
    }

    if (data.channel) {
      params.channel = data.channel
    }

    return request.post('/newretail/api/wxa/bindMobile', params)
      .then((data: any) => {
        utils.setHideLoading(true)
        return WxaUserService.login()
      })
  },

  /**
   * 通过加密数据绑定会员手机号
   */
  bindMobileByEncrypt: (params: any): Promise<any> => {
    return request.post('/newretail/api/wxa/bindMobileByEncrypt', params)
  },

  /**
   * 解析小程序用户的手机号
   */
  parseWxaMobile: (encryptedData: string, iv: string): Promise<any> => {
    return request.post('/newretail/api/wxa/parseWxaMobile', {
      encryptedData,
      iv
    })
  },

  /**
   * 获得场景值
   */
  getSceneById: (id: string): Promise<any> => {
    return request.get('/newretail/api/wxa/scene/get', { id })
  },

  /**
   * 生成场景值
   */
  createScene: (appid: string, scene: string): Promise<any> => {
    return request.post('/newretail/api/wxa/scene/create', {
      appid,
      scene
    })
  },

  createQrcode: (appid: string, scene: string, page?: string): Promise<any> => {
    return request.post('/newretail/api/wxa/qrcode/create', {
      appid,
      scene,
      page
    })
  },

  /**
   * 发送代金券接口
   */
  sendCoupon: (activityId: string, isForceIssue: boolean, storeId: string): Promise<any> => {
    return request.post('/newretail/api/wxa/coupon/sendCoupon', {
      activityId,
      isForceIssue,
      storeId
    })
  },

  /**
   * 是否已有此活动的微信代金券
   */
  isSend: (stockId: string): Promise<any> => {
    return request.get('/newretail/api/wxa/coupon/isSend', { stockId })
  },

  /**
   * 通用发送代金券接口
   */
  commonSendCoupon: (isForceIssue: boolean, stockId: string): Promise<any> => {
    return request.post('/newretail/api/wxa/coupon/commonSendCoupon', {
      isForceIssue,
      stockId
    })
  },

  /**
   * 微信会员解绑手机号
   */
  unbindMobile: (): Promise<any> => {
    return request.post('/newretail/api/wxa/unbindMobile')
  },

  /**
   * 是否绑定过元芒小程序
   */
  isBindWinmore: (postData: any): Promise<any> => {
    return request.post('/newretail/api/wxa/isBindWinmore', postData)
  },

  /**
   * 刷新会员头像
   */
  refreshAvatar: (postData: any): Promise<any> => {
    return request.post('/newretail/api/wxa/refreshAvatar', postData)
  },

  /**
   * 查询个人资料自定配置
   */
  getPersonConfig: (): Promise<any> => {
    return request.get('/newretail/api/mbr/wmConfigMbrProfileController/getDetails')
  }
}

export default WxaUserService