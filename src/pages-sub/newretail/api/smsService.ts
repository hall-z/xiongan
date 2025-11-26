import request from './request'

export const SmsService = {
  /**
   * 发送短信验证码
   */
  sendSms: (mobile: string, captchaVerification?: string | null): Promise<any> => {
    const postData: any = {
      mobile: mobile
    }
    if (captchaVerification) {
      postData.code = captchaVerification
    }
    return request.post('/newretail/api/sms/sendSms', postData)
  },

  /**
   * 获取验证码
   */
  getCaptcha: (captchaType: string): Promise<any> => {
    const postData = {
      captchaType: captchaType
    }
    return request.post('/newretail/captcha/get', postData)
  },

  /**
   * 校验验证码
   */
  checkCaptcha: (postData: any): Promise<any> => {
    return request.post('/newretail/captcha/check', postData)
  },

  /**
   * 设置MSP密码
   */
  setMspPassword: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/msp/setMspPassword', postData)
  },

  /**
   * 验证短信
   */
  validate2: (postData: any): Promise<any> => {
    return request.post('/newretail/api/sms/validate', postData)
  }
}

export default SmsService