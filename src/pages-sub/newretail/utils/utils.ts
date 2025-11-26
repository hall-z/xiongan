/**
 * 通用工具函数
 * 包含日期格式化、距离计算、地图API调用等常用功能
 */

// import { getApp } from '@dcloudio/uni-app'
// declare const uni: any
// @ts-ignore
// import { getApp } from '@/utils/newretail/globalApp'
import QQMapWX from '@/libs/qqmap-wx-jssdk'
import * as storeService from '@/service/api/newretail/storeService'
import * as sysService from '@/service/api/newretail/systemService'
import * as distributionService from '@/service/api/newretail/distributionService'

interface LocationInfo {
  latitude: number
  longitude: number
}

interface DistanceResult {
  distance: number
  duration: number
  [key: string]: any
}

interface GeocodeResult {
  lat: number
  lon: number
  address: string
  [key: string]: any
}

interface ReverseGeocodeResult {
  address: string
  addressComponent: any
  [key: string]: any
}

/**
 * 格式化时间
 * @param date Date对象
 * @returns 格式化后的时间字符串
 */
export const formatTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${year}/${formatNumber(month)}/${formatNumber(day)} ${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(second)}`
}

/**
 * 数字格式化，补零
 * @param n 数字
 * @returns 格式化后的字符串
 */
export const formatNumber = (n: number): string => {
  const str = n.toString()
  return str[1] ? str : '0' + str
}

/**
 * 时间戳转时间字符串
 * @param timestamp 时间戳
 * @returns 时间字符串
 */
export const timestampToTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = formatNumber(date.getDate()) + ' '
  const h = formatNumber(date.getHours()) + ':'
  const m = formatNumber(date.getMinutes()) + ':'
  const s = formatNumber(date.getSeconds())
  return Y + M + D + h + m + s
}

/**
 * 计算两个经纬度之间的距离（公里）
 * @param la1 纬度1
 * @param lo1 经度1
 * @param la2 纬度2
 * @param lo2 经度2
 * @returns 距离（公里）
 */
export const distance = (la1: number, lo1: number, la2: number, lo2: number): number => {
  const La1 = la1 * Math.PI / 180.0
  const La2 = la2 * Math.PI / 180.0
  const La3 = La1 - La2
  const Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0
  const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)))
  const result = s * 6378.137 // 地球半径
  return Math.round(result * 10000) / 10000
}

/**
 * 地址解析为经纬度
 * @param address 地址字符串
 * @returns 经纬度信息
 */
export const addressResolution = async (address: string): Promise<GeocodeResult> => {
  const app = getApp()
  const mapType = app.globalData.systemConfigure?.deliveryDistanceThirdMap
  
  try {
    switch (mapType) {
      case 'TIANDITU':
        return await tiandituGeocode(address)
      case 'GAODE':
        return await autonaviGeocode(address)
      case 'TENXUN':
        return await tencentGeocode(address)
      default:
        return await tiandituGeocode(address)
    }
  } catch (error) {
    console.error('地址解析失败', error)
    // 保底机制：切换到天地图重试
    app.globalData.systemConfigure.deliveryDistanceThirdMap = 'TIANDITU'
    return await tiandituGeocode(address)
  }
}

/**
 * 经纬度逆解析为地址
 * @param latitude 纬度
 * @param longitude 经度
 * @returns 地址信息
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<ReverseGeocodeResult> => {
  const app = getApp()
  const mapType = app.globalData.systemConfigure?.deliveryDistanceThirdMap
  
  try {
    switch (mapType) {
      case 'TIANDITU':
        return await tiandituReverseGeocode(latitude, longitude)
      case 'GAODE':
        return await autonaviReverseGeocode(latitude, longitude)
      case 'TENXUN':
        return await tencentReverseGeocode(longitude, latitude)
      default:
        return await tiandituReverseGeocode(latitude, longitude)
    }
  } catch (error) {
    console.error('逆地理编码失败', error)
    // 保底机制：切换到天地图重试
    app.globalData.systemConfigure.deliveryDistanceThirdMap = 'TIANDITU'
    return await tiandituReverseGeocode(latitude, longitude)
  }
}

/**
 * 计算配送距离
 * @param originLat 起点纬度
 * @param originLon 起点经度
 * @param destLat 终点纬度
 * @param destLon 终点经度
 * @returns 距离信息
 */
export const calculateDeliveryDistance = async (
  originLat: number, 
  originLon: number, 
  destLat: number, 
  destLon: number
): Promise<DistanceResult> => {
  const app = getApp()
  const mapType = app.globalData.systemConfigure?.deliveryDistanceThirdMap
  
  try {
    switch (mapType) {
      case 'TIANDITU':
        return await tiandituCalculateDistance(originLat, originLon, destLat, destLon)
      case 'GAODE':
        return await autonaviCalculateDistance(originLat, originLon, destLat, destLon)
      case 'TENXUN':
        return await tencentCalculateDistance(originLat, originLon, destLat, destLon)
      default:
        return await tiandituCalculateDistance(originLat, originLon, destLat, destLon)
    }
  } catch (error) {
    console.error('计算配送距离失败', error)
    // 保底机制：切换到天地图重试
    app.globalData.systemConfigure.deliveryDistanceThirdMap = 'TIANDITU'
    return await tiandituCalculateDistance(originLat, originLon, destLat, destLon)
  }
}

/**
 * 天地图地理编码
 */
const tiandituGeocode = async (address: string): Promise<GeocodeResult> => {
  const app = getApp()
  const params = `postStr={"keyWord":${address}}&tk=${app.globalData.systemConfigure.lbsTiandituAppkey}`
  
  const response = await uni.request({
    url: `https://api.tianditu.gov.cn/geocoder?${params}`,
    method: 'GET'
  })
  
  // 解析天地图返回结果
  // 这里需要根据实际API返回格式进行解析
  return {
    lat: 0,
    lon: 0,
    address
  }
}

/**
 * 高德地图地理编码
 */
const autonaviGeocode = async (address: string): Promise<GeocodeResult> => {
  const app = getApp()
  const params = `address=${encodeURIComponent(address)}&key=${app.globalData.systemConfigure.lbsAutonaviAppkey}`
  
  const response = await uni.request({
    url: `https://restapi.amap.com/v3/geocode/geo?${params}`,
    method: 'GET'
  })
  
  const data = response[1].data
  if (data.geocodes && data.geocodes.length > 0) {
    const location = data.geocodes[0].location.split(',')
    return {
      lat: parseFloat(location[1]),
      lon: parseFloat(location[0]),
      address: data.geocodes[0].formatted_address
    }
  }
  throw new Error('地址解析失败')
}

/**
 * 腾讯地图地理编码
 */
const tencentGeocode = async (address: string): Promise<GeocodeResult> => {
  const app = getApp()
  const qqmapsdk = new QQMapWX({
    key: app.globalData.systemConfigure.lbsTencentMiniappKey
  })
  
  return new Promise((resolve, reject) => {
    qqmapsdk.geocoder({
      address,
      success: (res: any) => {
        if (res.result) {
          resolve({
            lat: res.result.location.lat,
            lon: res.result.location.lng,
            address: res.result.address
          })
        } else {
          reject(new Error('地址解析失败'))
        }
      },
      fail: (err: any) => {
        reject(err)
      }
    })
  })
}

/**
 * 天地图计算距离
 */
const tiandituCalculateDistance = async (originLat: number, originLon: number, destLat: number, destLon: number): Promise<DistanceResult> => {
  const app = getApp()
  // 实现天地图距离计算逻辑
  return {
    distance: 0,
    duration: 0
  }
}

/**
 * 高德地图计算距离
 */
const autonaviCalculateDistance = async (originLat: number, originLon: number, destLat: number, destLon: number): Promise<DistanceResult> => {
  const app = getApp()
  // 实现高德地图距离计算逻辑
  return {
    distance: 0,
    duration: 0
  }
}

/**
 * 腾讯地图计算距离
 */
const tencentCalculateDistance = async (originLat: number, originLon: number, destLat: number, destLon: number): Promise<DistanceResult> => {
  const app = getApp()
  const qqmapsdk = new QQMapWX({
    key: app.globalData.systemConfigure.lbsTencentMiniappKey
  })
  
  return new Promise((resolve, reject) => {
    qqmapsdk.direction({
      mode: 'driving',
      from: `${originLat},${originLon}`,
      to: `${destLat},${destLon}`,
      success: (res: any) => {
        if (res.result && res.result.routes && res.result.routes.length > 0) {
          const route = res.result.routes[0]
          resolve({
            distance: route.distance,
            duration: route.duration,
            ...res.result
          })
        } else {
          reject(new Error('计算距离失败'))
        }
      },
      fail: (err: any) => {
        reject(err)
      }
    })
  })
}

/**
 * 天地图逆地理编码
 */
const tiandituReverseGeocode = async (lat: number, lon: number): Promise<ReverseGeocodeResult> => {
  // 实现逻辑...
  return {
    address: '',
    addressComponent: {}
  }
}

/**
 * 高德地图逆地理编码
 */
const autonaviReverseGeocode = async (lat: number, lon: number): Promise<ReverseGeocodeResult> => {
  const app = getApp()
  const params = `location=${lon},${lat}&key=${app.globalData.systemConfigure.lbsAutonaviAppkey}&radius=1000&extensions=all`
  
  const response = await uni.request({
    url: `https://restapi.amap.com/v3/geocode/regeo?${params}`,
    method: 'GET'
  })
  
  const data = response[1].data
  if (data.regeocode) {
    return {
      address: data.regeocode.formatted_address,
      addressComponent: data.regeocode.addressComponent
    }
  }
  throw new Error('逆地理编码失败')
}

/**
 * 腾讯地图逆地理编码
 */
const tencentReverseGeocode = async (lon: number, lat: number): Promise<ReverseGeocodeResult> => {
  const app = getApp()
  const qqmapsdk = new QQMapWX({
    key: app.globalData.systemConfigure.lbsTencentMiniappKey
  })
  
  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location: { latitude: lat, longitude: lon },
      get_poi: 1,
      success: (res: any) => {
        if (res.result) {
          resolve({
            address: res.result.address,
            addressComponent: res.result.address_component
          })
        } else {
          reject(new Error('逆地理编码失败'))
        }
      },
      fail: (err: any) => {
        reject(err)
      }
    })
  })
}

/**
 * 检查是否为配送商品
 */
export const isDeliveryProduct = (): boolean => {
  // 实现逻辑...
  return false
}

/**
 * 检查是否为次日达商品
 */
export const isNextDayProduct = (): boolean => {
  // 实现逻辑...
  return false
}

/**
 * 验证日期时间格式
 */
export const validateDateTime = (dateTime: string): boolean => {
  // 简单的日期格式验证
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
  return regex.test(dateTime)
}

/**
 * 检查页面是否是tabBar页面
 * @param page 页面路径
 */
export const checkIsTabBar = (page: string): boolean => {
  const app = getApp()
  if (app.globalData.tabBarPages) {
    return app.globalData.tabBarPages.includes(page)
  }
  return false
}

export default {
  formatTime,
  formatNumber,
  timestampToTime,
  distance,
  addressResolution,
  reverseGeocode,
  calculateDeliveryDistance,
  isDeliveryProduct,
  isNextDayProduct,
  validateDateTime
}