/**
 * 地理位置和门店管理工具
 * 用于处理地理位置、门店查询和距离计算
 */

// import { getApp } from '@dcloudio/uni-app'
import storeService from '@/service/api/newretail/storeService'
import memberService from '@/service/api/newretail/memberService'
import sysService from '@/service/api/newretail/systemService'
import utils from './utils'

interface StoreInfo {
  id: string
  name: string
  latitude: number
  longitude: number
  status: string
  distance?: number
  userLatitude?: number
  userLongitude?: number
  [key: string]: any
}

interface LocationInfo {
  latitude: number
  longitude: number
}

class AddressManager {
  private app: any
  private storeInfo: StoreInfo | null = null

  constructor() {
    this.app = getApp()
  }

  /**
   * 刷新所有门店
   */
  async getAllStore(): Promise<void> {
    try {
      const res = await storeService.queryList()
      const allStores: StoreInfo[] = res.filter((item: StoreInfo) => item.status === 'OPEN')
      
      uni.setStorageSync('wj_allStores', allStores)
      uni.setStorageSync('location', true)

      const location = await this.getUserLocation()
      if (location) {
        const { latitude, longitude } = location
        
        if (this.app.globalData.storeInfo) {
          // 更新当前门店信息
          const currentStore = allStores.find(item => item.id === this.app.globalData.storeInfo.id)
          if (currentStore) {
            this.app.globalData.storeInfo = currentStore
          }
        } else {
          // 获取最近门店
          const nearestIndex = this.getNearestStore(allStores, latitude, longitude)
          this.app.globalData.storeInfo = allStores[nearestIndex]
        }
      }
    } catch (error) {
      console.error('刷新门店失败', error)
    }
  }

  /**
   * 获取最近门店
   */
  async getRecentlyStore(): Promise<void> {
    try {
      const location = await this.getUserLocation()
      if (!location) return

      const { latitude, longitude } = location
      const allStores = uni.getStorageSync('wj_allStores') || []

      if (this.app.globalData.storeInfo) {
        // 更新当前门店距离
        const currentStore = allStores.find((item: StoreInfo) => item.id === this.app.globalData.storeInfo.id)
        if (currentStore) {
          this.app.globalData.storeInfo = currentStore
        }
      } else {
        const nearestIndex = this.getNearestStore(allStores, latitude, longitude)
        this.app.globalData.storeInfo = allStores[nearestIndex]
      }
    } catch (error) {
      console.error('获取最近门店失败', error)
    }
  }

  /**
   * 获取用户地理位置
   */
  private getUserLocation(): Promise<LocationInfo | null> {
    return new Promise((resolve) => {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.app.globalData.location = {
            latitude: res.latitude,
            longitude: res.longitude
          }
          resolve(res)
        },
        fail: (err) => {
          console.error('获取地理位置失败', err)
          resolve(null)
        }
      })
    })
  }

  /**
   * 获取门店距离信息
   */
  async getStoreDistance(store: StoreInfo): Promise<StoreInfo> {
    try {
      const location = await this.getUserLocation()
      if (!location) return store

      const { latitude, longitude } = location
      const distance = utils.distance(latitude, longitude, store.latitude, store.longitude)
      
      const storeInfo: StoreInfo = {
        ...store,
        distance,
        userLatitude: latitude,
        userLongitude: longitude
      }

      this.handleHasStoreData(storeInfo)
      return storeInfo
    } catch (error) {
      console.error('获取门店距离失败', error)
      return store
    }
  }

  /**
   * 计算最近的门店索引
   */
  getNearestStore(allStores: StoreInfo[], latitude: number, longitude: number): number {
    const distanceArr = allStores.map((item) => {
      if (item.latitude && item.longitude) {
        return utils.distance(latitude, longitude, item.latitude, item.longitude)
      }
      return Number.POSITIVE_INFINITY
    })

    const minDistance = Math.min(...distanceArr)
    return distanceArr.indexOf(minDistance)
  }

  /**
   * 记录会员访问门店
   */
  async recordVisitStore(storeId: string): Promise<void> {
    if (this.app.globalData.systemConfigure?.enableRecordVisitStore && 
        this.app.globalData.userInfo?.member) {
      try {
        await memberService.visitStore(storeId)
      } catch (error) {
        console.error('记录访问门店失败', error)
      }
    }
  }

  /**
   * 处理门店数据
   */
  private handleHasStoreData(storeInfo: StoreInfo): void {
    if (this.app.globalData.userInfo?.member) {
      this.recordVisitStore(storeInfo.id)
    }
  }

  /**
   * 获取统配门店
   */
  async getDistributionStore(): Promise<StoreInfo | null> {
    if (!utils.isDeliveryProduct()) return null

    if (this.app.globalData.distributionStore) {
      return this.app.globalData.distributionStore
    }

    const distributionStore = uni.getStorageSync('wj_distributionStore')
    if (distributionStore) {
      this.app.globalData.distributionStore = distributionStore
      return distributionStore
    }

    try {
      const res = await storeService.getDistributionStore()
      if (res) {
        this.app.globalData.distributionStore = res
        uni.setStorageSync('wj_distributionStore', res)
        return res
      }
      return null
    } catch (error) {
      console.error('获取统配门店失败', error)
      return null
    }
  }

  /**
   * 获取次日达统配门店
   */
  async getNextDayStore(): Promise<StoreInfo | null> {
    if (!utils.isNextDayProduct()) return null

    if (this.app.globalData.nextDayStore) {
      return this.app.globalData.nextDayStore
    }

    const nextDayStore = uni.getStorageSync('wj_nextDayStore')
    if (nextDayStore) {
      this.app.globalData.nextDayStore = nextDayStore
      return nextDayStore
    }

    try {
      const res = await storeService.getNextDayStore()
      if (res) {
        this.app.globalData.nextDayStore = res
        uni.setStorageSync('wj_nextDayStore', res)
        return res
      }
      return null
    } catch (error) {
      console.error('获取次日达门店失败', error)
      return null
    }
  }

  /**
   * 获取腾讯LBS key
   */
  async getTenXunKey(): Promise<void> {
    try {
      const res = await sysService.query('lbs_tencent_miniapp_key')
      if (res?.[0]?.value) {
        this.app.globalData.systemConfigure.lbsTencentMiniappKey = res[0].value
      }
    } catch (error) {
      console.error('获取腾讯LBS key失败', error)
    }
  }
}

// 创建单例实例
const addressManager = new AddressManager()

export default addressManager

// 导出常用方法
export const {
  getAllStore,
  getRecentlyStore,
  getStoreDistance,
  getNearestStore,
  recordVisitStore,
  getDistributionStore,
  getNextDayStore,
  getTenXunKey
} = addressManager