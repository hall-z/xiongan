import request from './request'

export const BankCardService = {
  /**
   * 绑定银行卡
   */
  bindbankcard: (params: any): Promise<any> => {
    return request.post('/newretail/api/mbr/qrpay/bankcard/bindbankcard', params)
  },

  /**
   * 校验银行卡
   */
  checkBankCard: (cardNo: string): Promise<any> => {
    return request.post('/newretail/api/mbr/qrpay/bankcard/checkBankCard', { bankCardNo: cardNo })
  },

  /**
   * 获取支持的银行列表
   */
  supportList: (): Promise<any> => {
    return request.post('/newretail/api/mbr/qrpay/bankcard/list')
  },

  /**
   * 校验验证码
   */
  validmessage: (params: any): Promise<any> => {
    return request.post('/newretail/api/mbr/qrpay/bankcard/validmessage', params)
  },

  /**
   * 获取用户已绑定的银行卡
   */
  userBankCard: (): Promise<any> => {
    return request.post('/newretail/api/mbr/qrpay/bankcard/getBankCardInfo')
  },

  /**
   * 解绑银行卡
   */
  unBindCard: (cardNo: string): Promise<any> => {
    return request.post('/newretail/api/mbr/qrpay/bankcard/unbindbankcard', { bankCardNo: cardNo })
  },

  /**
   * 获取用户付款码
   */
  getQrPayCode: (payMethodId?: string): Promise<any> => {
    return request.get('/newretail/api/mall/qrorder/getQrPayCode', { 
      payMethodId: payMethodId || '' 
    })
  },

  /**
   * 轮询订单状态
   */
  getStatusByAuthCode: (authCode: string): Promise<any> => {
    return request.get('/newretail/api/mall/qrorder/getStatusByAuthCode', { authCode })
  },

  /**
   * 一码付支付接口
   */
  pay: (param: any): Promise<any> => {
    return request.post('/newretail/api/mall/qrorder/pay', param)
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: (tradeNo: string): Promise<any> => {
    return request.get('/newretail/api/mall/qrorder/tradeQuery', { tradeNo })
  },

  /**
   * 获取支付方式列表
   */
  getPayMethodList: (): Promise<any> => {
    return request.get('/newretail/api/mall/qrorder/getPayMethodList')
  }
}

export default BankCardService