import { baseUrlApi } from '@/interceptors/utils'
import { request } from '@/utils/http'
import { METHOD_INSTANCE } from '../model/baseModel'

const GET_BANNER_H5 = baseUrlApi('/promotion/app/bcm/coupon/geturlResponseV1')

/**
 *   getBannerH5
 * @param params 初始参数()
 * */
export function getBannerH5(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    ignorEencrypt: true,
    resAll: true,
  }
  return request.Post(
    GET_BANNER_H5, // 请求地址
    data,
    {
      meta,
    },
  )
}
