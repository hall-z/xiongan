/**
 * 店员查看会员信息相关接口
 */
import request from './request'

export default {
  // 企业微信登录
  loginByjscode: function (corpId: string, agentId: string, code: string) {
    return request.get(`/newretail/api/sys/wxcpuser/${corpId}/${agentId}/loginByjscode?code=${code}`)
  },
  // 企业微信登录后获取当前对话框客户详情
  getExternalcontact: function (corpId: string, agentId: string, external_userid: string) {
    return request.get(`/newretail/api/sys/wxcpuser/${corpId}/${agentId}/getExternalcontact?external_userid=${external_userid}`)
  },
  /**
   * 都市花乡分页查询线下订单
   * @param page 当前页码，起始于1
   * @param pageSize 每页记录数，必须大于等于0且小于等于100，等于0时表示不分页查询全部数据， 大于0时表示分页查询
   */
  tradeQuery: function (postData: any) {
    return request.post('/newretail/api/mbr/dianyuan/tradeQuery', postData)
  },
  // 门店订单
  query: function (postData: any) {
    return request.get('/newretail/api/mbr/dianyuan/queryV2', postData)
  },
  /**
   * 获取订单状态
   */
  getStatusCount: function (params: any) {
    return request.get('/newretail/api/mbr/dianyuan/getStatusCount', params)
  },
  /**
   * 获取会员信息
   */
  getByMobileDetails: function (params: any) {
    return request.get('/newretail/api/mbr/dianyuan/getByMobileDetails', params)
  },
}
