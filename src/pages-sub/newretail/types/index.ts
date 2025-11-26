/**
 * 新零售模块类型定义
 */

// import { getApp } from '@dcloudio/uni-app'

// 应用实例类型
export interface AppInstance {
  globalData: {
    userInfo?: any
    storeInfo?: any
    systemConfigure?: any
    customerService?: string
    uiconfig?: any
    tabBarPages?: string[]
    [key: string]: any
  }
  setTabBarBadge?: (index: string, text: string) => void
  [key: string]: any
}

// 地理编码相关类型
export interface LocationInfo {
  latitude: number
  longitude: number
}

export interface DistanceResult {
  distance: number
  duration: number
  [key: string]: any
}

export interface GeocodeResult {
  lat: number
  lon: number
  address: string
  [key: string]: any
}

export interface ReverseGeocodeResult {
  address: string
  addressComponent: any
  [key: string]: any
}

// 分页参数
export interface PaginationParams {
  pageNo?: number
  pageSize?: number
  lastTime?: string
}

// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 门店信息
export interface StoreInfo {
  id: string
  name: string
  tel?: string
  address?: string
  latitude?: number
  longitude?: number
  virtualStoreId?: string
  parentId?: string
  virtualStore?: boolean
  [key: string]: any
}

// 用户信息
export interface UserInfo {
  member?: MemberInfo
  wxaUser?: any
  [key: string]: any
}

export interface MemberInfo {
  id: string
  name: string
  score?: number
  couponCount?: number
  balance?: number
  giftCardBalance?: number
  vipEndTime?: string
  vip?: boolean
  [key: string]: any
}

// Banner信息
export interface Banner {
  id: string
  imageUrl: string
  linkType: string
  linkUrl?: string
  [key: string]: any
}

// 商品信息
export interface Product {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  [key: string]: any
}

// 功能入口
export interface FunctionItem {
  id: string
  name: string
  icon: string
  link: string
}

// 获取应用实例
export const getAppInstance = (): AppInstance => {
  return getApp() as AppInstance
}

// 通用工具类型
export type Nullable<T> = T | null
export type Optional<T> = T | undefined