import request from './request'
import utils from '@/utils/newretail/utils'
import type { ApiResponse } from '../types'

interface Banner {
  id: string
  imageUrl: string
  linkType: string
  linkUrl?: string
  beginTime?: string
  endTime?: string
  [key: string]: any
}

interface BannerListParams {
  bannerType: string
  storeId?: string
  [key: string]: any
}

export const BannerService = {
  /**
   * 获取banner区图片
   * @param bannerType 展示区类型:HOME(首页区)/MEAL(点餐区)/NEWMEMBERADSENSE(新会员注册广告)/PROMOTIONADSENSE(促销广告)/抢购广告GRABADSENSE
   */
  /**
   * 获取banner区图片
   * @param bannerType 展示区类型:HOME(首页区)/MEAL(点餐区)/NEWMEMBERADSENSE(新会员注册广告)/PROMOTIONADSENSE(促销广告)/抢购广告GRABADSENSE
   */
  getBannerList: (bannerType: string): Promise<ApiResponse<Banner[]>> => {
    return request.get('/newretail/api/mall/banner/getBannerList', { bannerType })
  },

  /**
   * 获取门店banner区图片（带过期检查）
   */
  getStoreBannerList: (bannerType: string, storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/banner/getBannerList', {
      bannerType,
      storeId
    }).then((res: any) => {
      const list: any[] = []
      if (res) {
        res.forEach((el: any) => {
          if (!utils.isExpired(el.beginTime, el.endTime)) {
            list.push(el)
          }
        })
      }
      return list
    }).catch((err: any) => {
      wx.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      })
      return []
    })
  },

  /**
   * 统一获取banner区图片
   */
  unifiedGetBannerList: (params: any): Promise<any> => {
    return request.get('/newretail/api/mall/banner/getBannerList', params)
  },

  /**
   * 获取广告图片
   */
  getAdsenseList: (storeId: string): Promise<any> => {
    return request.get('/newretail/api/mall/adsense/getAdsenseList', { storeId })
  },

  /**
   * 获取公告信息
   */
  getNoticeList: (params: any): Promise<any> => {
    return request.get('/newretail/api/mall/notice/query', params)
  }
}

export default BannerService