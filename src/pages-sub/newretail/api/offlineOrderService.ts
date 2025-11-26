/**
 * 线下订单相关接口
 */
import request from './request'

export default {
  /**
   * 分页查询线下订单
   * @param page 当前页码，起始于1
   * @param pageSize 每页记录数，必须大于等于0且小于等于100，等于0时表示不分页查询全部数据， 大于0时表示分页查询
   */
  query: function (postData: any) {
    return request.get('/newretail/api/pay/offLineOrder/query', postData)
  },
  /**
   * 都市花乡分页查询线下订单
   * @param page 当前页码，起始于1
   * @param pageSize 每页记录数，必须大于等于0且小于等于100，等于0时表示不分页查询全部数据， 大于0时表示分页查询
   */
  tradeQuery: function (postData: any) {
    return request.post('/newretail/api/mall/order/tradeQuery', postData)
  },
  /**
   * 都市花乡分页查询线下订单详情
   */
  tradeById: function (postData: any) {
    return request.get('/newretail/api/mall/order/tradeById', postData)
  },
  /**
   * 查询订单详情
   * 根据订单标识查询具体订单详情
   *  @param orderId 订单Id
   */
  getDetailsById: function (orderId: string) {
    var params = {
      orderId: orderId
    }
    return request.get('/newretail/api/pay/offLineOrder/getDetailsById', params)
  }
}