/**
 * 数据统计相关工具函数
 * 用于页面访问、用户行为等数据统计
 */

// import { getCurrentPages, getApp } from '@dcloudio/uni-app'
import mta from '@/libs/mta_analysis'
interface AnalysisOptions {
  storeId?: string
  page?: string
  [key: string]: any
}

/**
 * PV 统计 - 页面访问统计
 * @param storeId 门店id
 */
export const PVStatistics = (storeId: string): void => {
  try {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = currentPage?.route || ''
    const options = currentPage?.options || {}

    mta.Event.stat('pageVisit', {
      storeid: storeId,
      pagestoreid: `${url}_${storeId}`,
      page: url,
    })

    // 分享打开的统计
    if (options.shareId) {
      mta.Event.stat('shareanopenalysis', {
        storeid: storeId,
        pagestoreid: `${url}_${storeId}`,
        page: url,
      })
    }
  } catch (error) {
    console.error('PV统计失败', error)
  }
}

/**
 * UV VV 统计 - 唯一访客统计
 * @param storeId 门店id
 */
export const UniqueVisitorAnalysis = (storeId: string): void => {
  try {
    mta.Event.stat('uniquevisitoranalysis', {
      storeid: storeId
    })
  } catch (error) {
    console.error('UV统计失败', error)
  }
}

/**
 * 分享统计
 * @param storeId 门店id
 */
export const ShareAnalysis = (storeId?: string): void => {
  try {
    const actualStoreId = getStoreId(storeId)
    if (!actualStoreId) return

    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = currentPage?.route || ''

    mta.Event.stat('shareanalysis', {
      storeid: actualStoreId,
      pagestoreid: `${url}_${actualStoreId}`,
      page: url,
    })
  } catch (error) {
    console.error('分享统计失败', error)
  }
}

/**
 * 分享打开统计
 * @param storeId 门店id
 */
export const ShareOpenAnalysis = (storeId?: string): void => {
  try {
    const actualStoreId = getStoreId(storeId)
    if (!actualStoreId) return

    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = currentPage?.route || ''

    mta.Event.stat('shareopenanalysis', {
      storeid: actualStoreId,
      pagestoreid: `${url}_${actualStoreId}`,
      page: url,
    })
  } catch (error) {
    console.error('分享打开统计失败', error)
  }
}

/**
 * 获取门店ID，如果未提供则从全局数据获取
 * @param storeId 门店id
 */
const getStoreId = (storeId?: string): string | null => {
  if (storeId) return storeId

  const app = getApp()
  if (app.globalData.storeInfo?.id) {
    return app.globalData.storeInfo.id
  }

  return null
}

/**
 * 自定义事件统计
 * @param eventName 事件名称
 * @param params 事件参数
 */
export const customEventAnalysis = (eventName: string, params: AnalysisOptions = {}): void => {
  try {
    // 确保包含门店信息
    if (!params.storeId) {
      const storeId = getStoreId()
      if (storeId) {
        params.storeId = storeId
      }
    }

    mta.Event.stat(eventName, params)
  } catch (error) {
    console.error('自定义事件统计失败', error)
  }
}

export default {
  PVStatistics,
  UniqueVisitorAnalysis,
  ShareAnalysis,
  ShareOpenAnalysis,
  customEventAnalysis
}