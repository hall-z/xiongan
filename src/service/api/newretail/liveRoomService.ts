import request from './request'

interface GetByIdParams {
  roomId: string
  memberId?: string
}

export const LiveRoomService = {
  /**
   * 分页查询直播间
   */
  query: (opts?: any): Promise<any> => {
    const params = { ...opts }
    return request.get('/newretail/api/mall/liveRoom/query', params)
  },

  /**
   * 根据Id查询直播间
   */
  getById: (params: GetByIdParams): Promise<any> => {
    return request.get('/newretail/api/mall/liveRoom/get', params)
  },

  /**
   * 订阅直播间
   */
  subscribe: (memberId: string, roomId: string): Promise<any> => {
    return request.put('/newretail/api/mall/liveRoom/subscribe', {
      memberId,
      roomId
    })
  },

  /**
   * 取消订阅直播间
   */
  cancelSubscribe: (memberId: string, roomId: string): Promise<any> => {
    return request.put('/newretail/api/mall/liveRoom/cancelSubscribe', {
      memberId,
      roomId
    })
  }
}

export default LiveRoomService