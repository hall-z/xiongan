import request from './request'

export const PromotionService = {
  /**
   * 根据指定的订单计算可以使用的券
   */
  calcUsableCoupons: (postData?: any): Promise<any> => {
    return request.get('/newretail/api/promotion/calcUsableCoupons', postData)
  },

  /**
   * 根据订单计算优惠和促销
   */
  calcPromotions: (postData: any): Promise<any> => {
    return request.post('/newretail/api/promotion/calcPromotions', postData)
  },

  /**
   * 根据订单批量计算优惠和促销
   */
  bathCalcPromotions: (postData: any): Promise<any> => {
    return request.post('/newretail/api/promotion/bathCalcPromotions', postData)
  }
}

export default PromotionService