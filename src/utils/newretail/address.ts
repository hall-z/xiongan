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
   * 刷新所有门店
   */
  async getAllStore1() {
      this.app.globalData.storeInfo = uni.getStorageSync('storeIdactive') || null
      await storeService.queryList().then(res => {
        var allStores = [];
        res.forEach(item => {
            if (item.status === 'OPEN') {
              if(this.app && this.app.globalData) {
                this.app.globalData.storeInfo = !this.app.globalData.storeInfo || !this.app.globalData.storeInfo.id ? {
                  ...item
                } : this.app.globalData.storeInfo;
              }
              allStores.push(item)
            }
        });
        this.app.globalData.storeInfo = !this.app.globalData.storeInfo || !this.app.globalData.storeInfo.id ? {
          ...allStores[0]
        } : this.app.globalData.storeInfo;
        uni.setStorageSync('storeIdactive', this.app.globalData.storeInfo)
        uni.setStorageSync('wj_allStores', allStores)
      })
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

  /**
   * 获取地理位置，查询所有的门店，获取附近的门店
   */
  async getLocation(): Promise<StoreInfo> {
    const self = this
    console.log("getLocation start", utils.formatTime(new Date()).replace(/\//g, '-'))
    this.app = this.app && this.app.globalData ? this.app : getApp()
    
    return new Promise((resolve, reject) => {
      // 使用固定的测试坐标（原代码中注释掉了真实的地理位置获取）
      const latitude = '36.599308013916016'
      const longitude = '114.52954101562'

      this.app.globalData.location = {
        latitude: '114.529541015625',
        longitude: '36.599308013916016'
      }

      try {
        const now = new Date()
        const nowDate = utils.formatTime(now).replace(/\//g, '-')
        const tempTimeArr = nowDate.split(" ")
        const startTime = tempTimeArr[0] + ' 00:00:00'
        const tempTermValidity = tempTimeArr[0] + ' 23:59:59'
        const tempAllStores = uni.getStorageSync('wj_allStores') || []

        if (tempAllStores && tempAllStores.length > 0) {
          const timeCount = uni.getStorageSync('wj_queryStoreTimeCount')
          let tempTime = startTime.replace(/-/g, '/')
          if (timeCount) {
            tempTime = timeCount.replace(/-/g, '/')
          }
          const nowTime = new Date().getTime()
          const time = new Date(tempTime).getTime()

          if (nowTime > time) {
            // 增量查询门店
            let lastTime = uni.getStorageSync('wj_queryStoreTime')
            let queryStartTime = startTime
            if (lastTime && utils.validateDateTime(lastTime)) {
              queryStartTime = lastTime
            }

            storeService.queryList(queryStartTime).then((res: StoreInfo[]) => {
              let allStores = [].concat(tempAllStores)
              res.forEach((item: StoreInfo) => {
                let hasThisStore = false
                allStores.forEach((ele: StoreInfo, index: number) => {
                  if (item.id === ele.id) {
                    hasThisStore = true
                    allStores[index] = item
                  }
                })
                if (!hasThisStore && item.status === 'OPEN') {
                  allStores.push(item)
                }
              })

              const newAllStores = allStores.filter((item: StoreInfo) => item.status === 'OPEN')
              try {
                uni.setStorageSync('wj_allStores', newAllStores)
                uni.setStorageSync('wj_queryStoreTimeCount', tempTermValidity)
              } catch (e) {
                console.log(e)
              }

              const tempIndex = this.getNearestStore(newAllStores, parseFloat(latitude), parseFloat(longitude))
              let storeInfo = newAllStores[tempIndex]

              // 如果存在分享的门店id
              if (this.app.globalData.shareStoreId !== '') {
                for (let i = 0; i < newAllStores.length; i++) {
                  const ele = newAllStores[i]
                  if (ele.id == this.app.globalData.shareStoreId) {
                    storeInfo = ele
                    break
                  }
                }
                this.app.globalData.storeId = ''
              }

              storeInfo = {
                ...storeInfo,
                userLatitude: parseFloat(latitude),
                userLongitude: parseFloat(longitude)
              }

              this.handleHasStoreData(storeInfo)
              resolve(storeInfo)
            }).catch((err: any) => {
              reject(err)
            })
          } else {
            const tempIndex = this.getNearestStore(tempAllStores, parseFloat(latitude), parseFloat(longitude))
            let storeInfo = tempAllStores[tempIndex]

            // 如果存在分享的门店id
            if (this.app.globalData.shareStoreId !== '') {
              for (let i = 0; i < tempAllStores.length; i++) {
                const ele = tempAllStores[i]
                if (ele.id == this.app.globalData.shareStoreId) {
                  storeInfo = ele
                  break
                }
              }
              this.app.globalData.storeId = ''
            }

            storeInfo = {
              ...storeInfo,
              userLatitude: parseFloat(latitude),
              userLongitude: parseFloat(longitude)
            }

            this.handleHasStoreData(storeInfo)
            resolve(storeInfo)
          }
        } else {
          // 查询所有门店
          storeService.queryList().then((res: StoreInfo[]) => {
            const storeInfo = this.handleStoreData(tempTermValidity, res, parseFloat(latitude), parseFloat(longitude))
            resolve(storeInfo)
          }).catch((err: any) => {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000
            })
            reject(err)
          })
        }
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  /**
   * 处理查询到的门店数据
   */
  private handleStoreData(tempTermValidity: string, res: StoreInfo[], latitude: number, longitude: number): StoreInfo {
    const allStores: StoreInfo[] = []
    res.forEach((item: StoreInfo) => {
      if (item.status === 'OPEN') {
        allStores.push(item)
      }
    })

    try {
      uni.setStorageSync('wj_allStores', allStores)
      uni.setStorageSync('wj_queryStoreTimeCount', tempTermValidity)
    } catch (e) {
      console.log(e)
    }

    const tempIndex = this.getNearestStore(allStores, latitude, longitude)
    let storeInfo = allStores[tempIndex]

    // 如果存在分享的门店id
    if (this.app.globalData.shareStoreId !== '') {
      for (let i = 0; i < allStores.length; i++) {
        const ele = allStores[i]
        if (ele.id == this.app.globalData.shareStoreId) {
          storeInfo = ele
          break
        }
      }
      this.app.globalData.storeId = ''
    }

    storeInfo = {
      ...storeInfo,
      userLatitude: latitude,
      userLongitude: longitude
    }

    this.handleHasStoreData(storeInfo)
    return storeInfo
  }
}

// 创建单例实例
const addressManager = new AddressManager()

export default addressManager

// 导出常用方法
export const {
  getAllStore,
  getAllStore1,
  getRecentlyStore,
  getStoreDistance,
  getNearestStore,
  recordVisitStore,
  getDistributionStore,
  getNextDayStore,
  getTenXunKey,
  getLocation
} = addressManager