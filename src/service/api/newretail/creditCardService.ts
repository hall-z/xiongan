import request from './request'

export const CreditCardService = {
  /**
   * 申卡状态
   * @param mobile 会员手机号
   */
  applyState: (mobile: string): Promise<any> => {
    const postData = {
      mobile: mobile
    }
    return request.post('/newretail/api/mbr/creditcard/applyState', postData)
  }
}

export default CreditCardService