/**
 * 腾讯地图微信小程序JavaScript SDK TypeScript版本
 */

// 错误配置
interface ErrorConfig {
  status: number
  message: string
}

const ERROR_CONF = {
  KEY_ERR: 311,
  KEY_ERR_MSG: "key格式错误",
  PARAM_ERR: 310,
  PARAM_ERR_MSG: "请求参数信息有误",
  SYSTEM_ERR: 600,
  SYSTEM_ERR_MSG: "系统错误",
  WX_ERR_CODE: 1000,
  WX_OK_CODE: 200
}

// API基础URL
const BASE_URL = "https://apis.map.qq.com/ws/"
const URL_SEARCH = BASE_URL + "place/v1/search"
const URL_SUGGESTION = BASE_URL + "place/v1/suggestion"
const URL_GET_GEOCODER = BASE_URL + "geocoder/v1/"
const URL_CITY_LIST = BASE_URL + "district/v1/list"
const URL_AREA_LIST = BASE_URL + "district/v1/getchildren"
const URL_DISTANCE = BASE_URL + "distance/v1/"

// 工具函数
interface Utils {
  location2query: (locations: any) => string
  getWXLocation: (success: Function, fail: Function, complete: Function) => void
  getLocationParam: (location: any) => { latitude: number; longitude: number }
  polyfillParam: (param: any) => void
  checkParamKeyEmpty: (param: any, key: string) => boolean
  checkKeyword: (param: any) => boolean
  checkLocation: (param: any) => boolean
  buildErrorConfig: (status: number, message: string) => ErrorConfig
  buildWxRequestConfig: (param: any, config: any) => any
  locationProcess: (param: any, success: Function, fail?: Function, complete?: Function) => void
}

const Utils: Utils = {
  // 位置数组转查询字符串
  location2query(locations: any): string {
    if (typeof locations === 'string') {
      return locations
    }
    
    let result = ''
    for (let i = 0; i < locations.length; i++) {
      const location = locations[i]
      if (result) {
        result += ';'
      }
      
      if (location.location) {
        result += `${location.location.lat},${location.location.lng}`
      } else if (location.latitude && location.longitude) {
        result += `${location.latitude},${location.longitude}`
      }
    }
    return result
  },

  // 获取微信位置
  getWXLocation(success: Function, fail: Function, complete: Function): void {
    uni.getFuzzyLocation({
      type: 'gcj02',
      success: (res: any) => success(res),
      fail: (err: any) => fail(err),
      complete: (res: any) => complete(res)
    })
  },

  // 获取位置参数
  getLocationParam(location: any): { latitude: number; longitude: number } {
    if (typeof location === 'string') {
      const parts = location.split(',')
      if (parts.length === 2) {
        return {
          latitude: parseFloat(parts[0]),
          longitude: parseFloat(parts[1])
        }
      }
      return { latitude: 0, longitude: 0 }
    }
    return location
  },

  // 填充参数回调
  polyfillParam(param: any): void {
    param.success = param.success || function () {}
    param.fail = param.fail || function () {}
    param.complete = param.complete || function () {}
  },

  // 检查参数是否为空
  checkParamKeyEmpty(param: any, key: string): boolean {
    if (!param[key]) {
      const error = Utils.buildErrorConfig(
        ERROR_CONF.PARAM_ERR,
        ERROR_CONF.PARAM_ERR_MSG + key + "参数格式有误"
      )
      param.fail(error)
      param.complete(error)
      return true
    }
    return false
  },

  // 检查关键词
  checkKeyword(param: any): boolean {
    return !Utils.checkParamKeyEmpty(param, 'keyword')
  },

  // 检查位置
  checkLocation(param: any): boolean {
    const location = Utils.getLocationParam(param.location)
    if (!location || !location.latitude || !location.longitude) {
      const error = Utils.buildErrorConfig(
        ERROR_CONF.PARAM_ERR,
        ERROR_CONF.PARAM_ERR_MSG + " location参数格式有误"
      )
      param.fail(error)
      param.complete(error)
      return false
    }
    return true
  },

  // 构建错误配置
  buildErrorConfig(status: number, message: string): ErrorConfig {
    return { status, message }
  },

  // 构建微信请求配置
  buildWxRequestConfig(param: any, config: any): any {
    const that = this
    config.header = { 'content-type': 'application/json' }
    config.method = 'GET'
    
    config.success = function (res: any) {
      const data = res.data
      if (data.status === 0) {
        param.success(data)
      } else {
        param.fail(data)
      }
    }
    
    config.fail = function (err: any) {
      err.statusCode = ERROR_CONF.WX_ERR_CODE
      param.fail(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, err.errMsg))
    }
    
    config.complete = function (res: any) {
      const statusCode = +res.statusCode
      switch (statusCode) {
        case ERROR_CONF.WX_ERR_CODE:
          param.complete(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg))
          break
        case ERROR_CONF.WX_OK_CODE:
          const data = res.data
          if (data.status === 0) {
            param.complete(data)
          } else {
            param.complete(that.buildErrorConfig(data.status, data.message))
          }
          break
        default:
          param.complete(that.buildErrorConfig(
            ERROR_CONF.SYSTEM_ERR,
            ERROR_CONF.SYSTEM_ERR_MSG
          ))
      }
    }
    
    return config
  },

  // 位置处理
  locationProcess(
    param: any,
    success: Function,
    fail?: Function,
    complete?: Function
  ): void {
    const that = this
    
    fail = fail || function (err: any) {
      err.statusCode = ERROR_CONF.WX_ERR_CODE
      param.fail(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, err.errMsg))
    }
    
    complete = complete || function (res: any) {
      if (res.statusCode === ERROR_CONF.WX_ERR_CODE) {
        param.complete(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg))
      }
    }
    
    if (!param.location) {
      Utils.getWXLocation(
        (res: any) => success(res),
        (err: any) => fail!(err),
        (res: any) => complete!(res)
      )
    } else {
      if (Utils.checkLocation(param)) {
        const location = Utils.getLocationParam(param.location)
        success(location)
      }
    }
  }
}

// 搜索参数接口
interface SearchParams {
  keyword: string
  orderby?: string
  page_size?: number
  page_index?: number
  address_format?: string
  filter?: string
  distance?: number
  auto_extend?: number
  location?: any
  success?: Function
  fail?: Function
  complete?: Function
}

// 建议参数接口
interface SuggestionParams {
  keyword: string
  region?: string
  region_fix?: number
  policy?: number
  success?: Function
  fail?: Function
  complete?: Function
}

// 逆地理编码参数
interface ReverseGeocoderParams {
  coord_type?: number
  get_poi?: number
  poi_options?: any
  location?: any
  success?: Function
  fail?: Function
  complete?: Function
}

// 地理编码参数
interface GeocoderParams {
  address: string
  success?: Function
  fail?: Function
  complete?: Function
}

// 城市列表参数
interface CityListParams {
  success?: Function
  fail?: Function
  complete?: Function
}

// 区域列表参数
interface DistrictParams {
  id?: string
  success?: Function
  fail?: Function
  complete?: Function
}

// 距离计算参数
interface DistanceParams {
  from?: any
  to: any
  mode?: string
  success?: Function
  fail?: Function
  complete?: Function
}

// QQ地图微信小程序类
class QQMapWX {
  private key: string

  constructor(config: { key: string }) {
    if (!config.key) {
      throw new Error("key值不能为空")
    }
    this.key = config.key
  }

  /**
   * 地点搜索
   */
  search(params: SearchParams): void {
    params = params || {}
    Utils.polyfillParam(params)
    
    if (!Utils.checkKeyword(params)) {
      return
    }

    const requestData: any = {
      keyword: params.keyword,
      orderby: params.orderby || '_distance',
      page_size: params.page_size || 10,
      page_index: params.page_index || 1,
      output: 'json',
      key: this.key
    }

    if (params.address_format) {
      requestData.address_format = params.address_format
    }
    if (params.filter) {
      requestData.filter = params.filter
    }

    const distance = params.distance || 1000
    const autoExtend = params.auto_extend || 1

    const successCallback = (location: any) => {
      requestData.boundary = `nearby(${location.latitude},${location.longitude},${distance},${autoExtend})`
      
      uni.request(Utils.buildWxRequestConfig(params, {
        url: URL_SEARCH,
        data: requestData
      }))
    }

    Utils.locationProcess(params, successCallback)
  }

  /**
   * 关键词提示
   */
  getSuggestion(params: SuggestionParams): void {
    params = params || {}
    Utils.polyfillParam(params)
    
    if (!Utils.checkKeyword(params)) {
      return
    }

    const requestData = {
      keyword: params.keyword,
      region: params.region || '全国',
      region_fix: params.region_fix || 0,
      policy: params.policy || 0,
      output: 'json',
      key: this.key
    }

    uni.request(Utils.buildWxRequestConfig(params, {
      url: URL_SUGGESTION,
      data: requestData
    }))
  }

  /**
   * 逆地址解析
   */
  reverseGeocoder(params: ReverseGeocoderParams): void {
    params = params || {}
    Utils.polyfillParam(params)

    const requestData: any = {
      coord_type: params.coord_type || 5,
      get_poi: params.get_poi || 0,
      output: 'json',
      key: this.key
    }

    if (params.poi_options) {
      requestData.poi_options = params.poi_options
    }

    const successCallback = (location: any) => {
      requestData.location = `${location.latitude},${location.longitude}`
      
      uni.request(Utils.buildWxRequestConfig(params, {
        url: URL_GET_GEOCODER,
        data: requestData
      }))
    }

    Utils.locationProcess(params, successCallback)
  }

  /**
   * 地址解析
   */
  geocoder(params: GeocoderParams): void {
    params = params || {}
    Utils.polyfillParam(params)
    
    if (Utils.checkParamKeyEmpty(params, 'address')) {
      return
    }

    const requestData = {
      address: params.address,
      output: 'json',
      key: this.key
    }

    uni.request(Utils.buildWxRequestConfig(params, {
      url: URL_GET_GEOCODER,
      data: requestData
    }))
  }

  /**
   * 获取城市列表
   */
  getCityList(params: CityListParams): void {
    params = params || {}
    Utils.polyfillParam(params)

    const requestData = {
      output: 'json',
      key: this.key
    }

    uni.request(Utils.buildWxRequestConfig(params, {
      url: URL_CITY_LIST,
      data: requestData
    }))
  }

  /**
   * 获取区县列表
   */
  getDistrictByCityId(params: DistrictParams): void {
    params = params || {}
    Utils.polyfillParam(params)
    
    if (Utils.checkParamKeyEmpty(params, 'id')) {
      return
    }

    const requestData = {
      id: params.id || '',
      output: 'json',
      key: this.key
    }

    uni.request(Utils.buildWxRequestConfig(params, {
      url: URL_AREA_LIST,
      data: requestData
    }))
  }

  /**
   * 距离计算
   */
  calculateDistance(params: DistanceParams): void {
    params = params || {}
    Utils.polyfillParam(params)
    
    if (Utils.checkParamKeyEmpty(params, 'to')) {
      return
    }

    const requestData: any = {
      mode: params.mode || 'walking',
      to: Utils.location2query(params.to),
      output: 'json',
      key: this.key
    }

    const successCallback = (location: any) => {
      requestData.from = `${location.latitude},${location.longitude}`
      
      uni.request(Utils.buildWxRequestConfig(params, {
        url: URL_DISTANCE,
        data: requestData
      }))
    }

    if (params.from) {
      params.location = params.from
    }

    Utils.locationProcess(params, successCallback)
  }
}

export default QQMapWX