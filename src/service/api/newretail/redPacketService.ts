import request from './request'

export const RedPacketService = {
  /**
   * 获取红包余额
   */
  getBalance: (): Promise<any> => {
    return request.get('/newretail/api/mbr/redPacket/getBalance')
  },

  /**
   * 校验当前会员是否有可以参加的红包活动
   */
  checkCanJoin: (): Promise<any> => {
    return request.get('/newretail/api/mbr/redPacketActivity/checkCanJoin')
  },

  /**
   * 分页查询红包活动
   */
  query: (page: number, pageSize: number, searchCount?: boolean, stateEquals?: string): Promise<any> => {
    return request.get('/newretail/api/mbr/redPacketActivity/query', {
      page,
      pageSize,
      searchCount,
      stateEquals
    })
  },

  /**
   * 分页查询红包历史
   */
  queryRedPacketHst: (page: number, pageSize: number, searchCount?: boolean, memberMobile?: string): Promise<any> => {
    return request.get('/newretail/api/mbr/redPacket/queryRedPacketHst', {
      page,
      pageSize,
      searchCount,
      memberMobileEquals: memberMobile,
      orderField: 'tranTime',
      orderDirection: 'desc'
    })
  },

  /**
   * 拆红包
   */
  openRedPacket: (id: string): Promise<any> => {
    return request.get('/newretail/api/mbr/redPacket/openRedPacket', { id })
  }
}

export default RedPacketService