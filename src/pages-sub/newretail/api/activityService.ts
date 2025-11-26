import request from './request'
import utils  from '@/utils/newretail/utils'

export const ActivityService = {
  /**
   * 获取当前门店的首页活动（根据orderNumber字段排序）
   */
  query: (storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/activity/query', { storeId }).then((res: any) => {
      const list: any[] = []
      if (res) {
        res.forEach((el: any) => {
          if (!utils.isExpired(el.beginTime, el.endTime)) {
            list.push(el)
          }
        })
      }
      return list
    })
  },

  /**
   * 获取当前门店的首页活动
   */
  getActivityByStoreId: (storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/activity/getActivityByStoreId', { storeId }).then((res: any) => {
      const list: any[] = []
      let length = 0
      if (res && res.length > 0) {
        length = res.length
        res.forEach((el: any) => {
          if (!utils.isExpired(el.beginTime, el.endTime)) {
            list.push(el)
          }
        })
      }
      return {
        records: list,
        totalCount: length
      }
    })
  },

  /**
   * 查看广告页详情
   */
  getDetailsForAdsenseId: (id: string): Promise<any> => {
    return request.get('/newretail/api/mall/detailsForAdsense/getById', { id })
  },

  /**
   * 分页查询首页活动
   */
  queryPage: (page: number, pageSize: number, opts?: any): Promise<any> => {
    const params = {
      page,
      pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/newretail/api/mall/activity/queryPage', params)
  },

  /**
   * 查询用户推送信息
   */
  queryWelfarePromotion: (usePage?: any): Promise<any> => {
    return request.get('/newretail/api/sys/welfare/promotion/queryWelfarePromotion', { usePage })
  },

  /**
   * 根据会员查询福利计划必选商品
   */
  getRequiredProduct: (memberId: string): Promise<any> => {
    return request.get('/newretail/api/mall/welfare/benefitPlan/grant/getRequiredProduct', { memberId })
  }
}

export default ActivityService