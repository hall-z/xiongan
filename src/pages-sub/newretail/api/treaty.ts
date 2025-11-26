/**
 * 条约相关接口
 */
import request from './request'

export default {
  /**
   * 查询销售条款
   * 查询隐私政策
   */
  queryOptions: function () {
    var params = {
      groupNameEquals: '隐私条款配置信息',
    }
    return request.get('/newretail/api/sys/options/queryV2', params)
  }
}