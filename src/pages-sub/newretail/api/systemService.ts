import request from './request'

export const SystemService = {
  /**
   * 查询系统配置
   */
  query: (keys?: string): Promise<any> => {
    const params: any = {}
    if (keys) {
      params.keys = keys
    }
    return request.get('/newretail/api/sys/options/queryV2', params)
  },

  /**
   * 查询全部系统配置
   */
  queryAll: (): Promise<any> => {
    return request.get('/newretail/api/sys/options/queryV2')
  },

  /**
   * 查询全部UI配置
   */
  getUiConfig: (): Promise<any> => {
    return request.get('/newretail/api/mall/uiConfig/get')
  },

  /**
   * 查询UI配置
   */
  getUiConfigByKey: (key: string): Promise<any> => {
    return request.get('/newretail/api/mall/uiConfig/getByKey', { key })
  },

  /**
   * 获得模板Id集合
   */
  getTemplateIds: (): Promise<any> => {
    return request.get('/newretail/api/wxa/tplmsg/getTemplateIds')
  },

  /**
   * 查询系统配置(组)
   */
  queryGroup: (groupNameEquals: string): Promise<any> => {
    return request.get('/newretail/api/sys/options/queryV2', { groupNameEquals })
  },

  /**
   * 获取首页可视化小程序信息
   */
  queryHomeMemberInfo: (params?: any): Promise<any> => {
    return request.get('/newretail/api/mall/homeVisualization/getCurrentPublished', params)
  },

  /**
   * 获取首页可视化小程序信息-新版
   */
  queryHomeMemberInfoUiInfo: (params?: any): Promise<any> => {
    return request.get('/newretail/api/mall/uiInfo/getCurrentPublished', params)
  },

  /**
   * 通过id获取首页可视化详情
   */
  queryHomeMemberDetail: (params?: any): Promise<any> => {
    return request.get('/newretail/api/mall/homeVisualization/appQuerydetail', params)
  },

  /**
   * 通过id获取首页可视化详情-新版
   */
  queryHomeMemberDetailUiInfo: (params?: any): Promise<any> => {
    return request.get('/newretail/api/mall/uiInfo/appQuerydetail', params)
  },

  /**
   * 获取首页可视化商品分类商品
   */
  queryHomeMemberDetailGood: (params?: any): Promise<any> => {
    return request.get('/newretail/api/mall/activity/queryPageProducts', params)
  },

  /**
   * 查询商户资料
   */
  queryMerchantCenter: (): Promise<any> => {
    return request.get('/newretail/api/mall/merchantCenter/query')
  },

  /**
   * 查询用户标签
   */
  getMemberLabel: (id: string): Promise<any> => {
    return request.get(`/newretail/api/mbr/member/getMemberLabel?id=${id}`)
  },

  /**
   * 错误日志
   */
  syncErrorLogCreate: (params: any): Promise<any> => {
    return request.post('/newretail/api/mall/syncErrorLog/create', params)
  }
}

export default SystemService
