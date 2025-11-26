import request from './request'

interface QueryRankParams {
  memberId: string
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
  searchCount?: boolean
}

export const DistributionService = {
  /**
   * 计算配送费
   */
  calcFee: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/distributionFeeV2/calcFee', postData)
  },

  calcFeeV1: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/distributionFeeV2/calcFee', postData)
  },

  /**
   * 检查收货地址门店是否能够配送
   */
  check: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/distributionFeeV2/check', postData)
  },

  /**
   * 查询快递配送费
   */
  getLogisticalFee: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/distributionFee/getLogisticalFee', postData)
  },

  /**
   * 查询优惠配送费规则
   */
  get: (storeId: string, shipmentType?: string): Promise<any> => {
    return request.get('/newretail/api/mall/distributionFee/get', {
      storeId,
      shipmentType
    })
  },

  /**
   * 查询会员的所有团队
   */
  queryGroup: (memberId: string): Promise<any> => {
    return request.get('/newretail/api/mbr/distribution/queryGroup', { memberId })
  },

  /**
   * 查询会员的团队排行榜
   */
  queryRank: (params: QueryRankParams): Promise<any> => {
    return request.get('/newretail/api/mbr/distribution/queryRank', {
      memberId: params.memberId,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      startDate: params.startDate,
      endDate: params.endDate,
      searchCount: params.searchCount
    })
  },

  /**
   * 获得提现比例
   */
  getStrategy: (): Promise<any> => {
    return request.get('/newretail/api/mbr/distribution/getStrategy')
  },

  /**
   * 获得分销员信息
   */
  getDistributionUser: (): Promise<any> => {
    return request.get('/newretail/api/distribution/account/get')
  },

  /**
   * 申请分销员
   */
  apply: (postData: any): Promise<any> => {
    return request.post('/newretail/api/distribution/account/apply', postData)
  },

  /**
   * 通过分销员分享商品绑定上下级关系
   */
  bind: (postData: any): Promise<any> => {
    return request.post('/newretail/api/distribution/account/bind', postData)
  },

  /**
   * 地图坐标转换
   */
  gcj02TOwgs84: (longitude: number, latitude: number): Promise<any> => {
    return request.get('/newretail/api/mall/deliveryAddress/gcj02TOwgs84', {
      longitude,
      latitude
    })
  }
}

export default DistributionService