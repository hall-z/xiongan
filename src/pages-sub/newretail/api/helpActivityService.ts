import request from './request'

export const HelpActivityService = {
  /**
   * 根据Id查询助力送券活动
   */
  getActivityById: (helpActivityId: number): Promise<any> => {
    return request.get('/newretail/api/mall/helpActivity/getById', { helpActivityId })
  },

  /**
   * 根据活动ID获得当前用户正在进行中的助力活动实例
   */
  getOnline: (helpActivityId: number): Promise<any> => {
    return request.get('/newretail/api/mall/helpActivity/getOnline', { helpActivityId })
  },

  /**
   * 条件分页查询所有助力送券活动
   */
  query: (page: number, pageSize: number, statusEquals?: string): Promise<any> => {
    return request.get('/newretail/api/mall/helpActivity/query', {
      page,
      pageSize,
      statusEquals
    })
  },

  /**
   * 生成助力活动实例
   */
  create: (helpActivityId: number): Promise<any> => {
    return request.post('/newretail/api/mall/helpActivity/instance/create', { helpActivityId })
  },

  /**
   * 根据活动ID获得当前用户正在进行中的助力活动实例
   */
  getInstanceOnline: (helpActivityId: number): Promise<any> => {
    return request.get('/newretail/api/mall/helpActivity/instance/getOnline', { helpActivityId })
  },

  /**
   * 变更当前获奖信息已读状态
   */
  instanceRead: (helpInstanceId: number): Promise<any> => {
    return request.post(`/newretail/api/mall/helpActivity/instance/read?helpInstanceId=${helpInstanceId}`)
  },

  /**
   * 根据Id查询具体的助力活动实例
   */
  getById: (helpInstanceId: number): Promise<any> => {
    return request.get('/newretail/api/mall/helpActivity/instance/getById', { helpInstanceId })
  },

  /**
   * 根据Id查询助力活动实例成员记录信息
   */
  getRecord: (helpInstanceId: number): Promise<any> => {
    return request.get('/newretail/api/mall/helpActivity/instance/getRecord', { helpInstanceId })
  },

  /**
   * 添加助力记录信息
   */
  help: (helpInstanceId: number): Promise<any> => {
    return request.post('/newretail/api/mall/helpActivity/instance/help', { helpInstanceId })
  },

  /**
   * 根据Id查询具体的助力活动
   */
  getHelpActivityById: (helpActivityId: number): Promise<any> => {
    return request.get('/newretail/api/mall/helpActivity/getById', { helpActivityId })
  }
}

export default HelpActivityService