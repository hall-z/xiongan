import request from './request'

export const RaffleService = {
  /**
   * 条件分页查询所有抽奖活动
   */
  query: (
    page: number, 
    pageSize: number, 
    startTime?: string, 
    endTime?: string, 
    statusEquals?: string, 
    raffleActivityTypeEquals?: string
  ): Promise<any> => {
    const params: any = {
      page,
      pageSize
    }
    if (startTime) params.startTime = startTime
    if (endTime) params.endTime = endTime
    if (statusEquals) params.statusEquals = statusEquals
    if (raffleActivityTypeEquals) params.raffleActivityTypeEquals = raffleActivityTypeEquals
    
    return request.get('/newretail/api/mall/raffleActivity/query', params)
  },

  /**
   * 兑奖动作
   */
  cash: (raffleRecordId: string): Promise<any> => {
    return request.post('/newretail/api/mall/raffle/cash', { raffleRecordId })
  },

  /**
   * 创建抽奖
   */
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/raffle/create', postData)
  },

  /**
   * 抽奖动作
   */
  draw: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/raffle/draw', postData)
  },

  /**
   * 根据Id查询具体的抽奖信息
   */
  getById: (raffleId: string): Promise<any> => {
    return request.get('/newretail/api/mall/raffle/getById', { raffleId })
  },

  /**
   * 查询中奖人员信息
   */
  getRecordsById: (raffleId: string): Promise<any> => {
    return request.get('/newretail/api/mall/raffle/getRecordsById', { raffleId })
  },

  /**
   * 为会员将所有未兑奖的记录进行兑奖(已废弃)
   */
  cashByMemberId: (): Promise<any> => {
    return request.put('/newretail/api/mall/raffle/cashByMemberId')
  },

  /**
   * 根据类别查询已提交的抽奖活动
   */
  getByType: (type: string): Promise<any> => {
    return request.get('/newretail/api/mall/raffleActivity/getByType', { type })
  },

  /**
   * 根据id查询抽奖活动
   */
  getRaffleActivityById: (raffleActivityId: string): Promise<any> => {
    return request.get('/newretail/api/mall/raffleActivity/getById', { raffleActivityId })
  },

  /**
   * 根据抽奖活动id和会员id查询记录
   */
  getRecords: (params: any): Promise<any> => {
    return request.get('/newretail/api/mall/raffleRecord/query', params)
  },

  /**
   * 判断抽奖资格及次数
   */
  raffleCheckMember: (params: any): Promise<any> => {
    return request.post('/newretail/api/mall/raffle/checkMember', params)
  }
}

export default RaffleService