import { baseUrlApi } from '@/interceptors/utils'
import { request } from '@/utils/http'

import { METHOD_INSTANCE } from '../model/baseModel'

const MESSAGE_LIST = baseUrlApi('/member/app/manageArticle/listSysArtaclePage')

const ARTACLE_DETAIL = baseUrlApi('/member/app/manageArticle/findArtacleDetail')

const GET_BRANCHES_INFO = baseUrlApi('/card/app/getBranchesInfo')

const GET_SPECIAL_TYPE_LIST = baseUrlApi('/promotion/app/xcxUserAdvice/getSpecialTypeList')
const GET_HISTORY_PAGE_BY_USER_ID = baseUrlApi('/user/app/history/getHistoryPageByUserId')
const GET_HISTORY_COUNT = baseUrlApi('/user/app/history/getHistoryCountByUserId')
const GET_DETAIL_UPDATE_READ = baseUrlApi('/user/app/history/getDetailUpdateRead')
const GET_SHOW_TOP_GZH = baseUrlApi('/member/app/userInfo/getUserGzh')

const SET_STATUS_UPDATE = baseUrlApi('/user/app/history/statusUpdate')
const GET_8SERVICE = baseUrlApi('/member/app/fwPolitics/getFwServiceSectorPage')
const GET_8SERVICE_ID = baseUrlApi('/member/app/fwPolitics/getFwServiceSector')

/**
 * @description: 获取消息列表
 * @param {} data
 * @return {}
 */
export function getHistoryPageByUserId<T>(data) {
  return request.Post<T>(
    GET_HISTORY_PAGE_BY_USER_ID, // 请求地址
    data,
  )
}

/**
 *  获取消息总数
 * @param params 初始参数()
 * */
export function getHistoryCount(data?: any) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
    // Analysis: true
  }

  return request.Post(
    GET_HISTORY_COUNT, // 请求地址
    data,
    {
      meta,
    },
  )
}

export function getShowTopGZH<T>(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
  }
  return request.Post<T>(
    GET_SHOW_TOP_GZH, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 * @description: 获取消息列表详情
 * @param {} data
 * @return {}
 */
export function getDetailUpdateRead(data) {
  return request.Post(
    GET_DETAIL_UPDATE_READ, // 请求地址
    data,
  )
}

/**
 * @description: 我的-消息-已读
 * @param {} data
 * @return {}
 */
export function setMessageRead(data) {
  return request.Post(
    SET_STATUS_UPDATE, // 请求地址
    data,
  )
}

/**
 * @description: 获取文章列表
 * @param {} data
 * @return {}
 */
export function getMessageList<T>(data) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
  }
  return request.Post<T>(
    MESSAGE_LIST, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 * @description: 获取文章详情
 * @param {} data
 * @return {}
 */
export function getArtacleDetail(data) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
  }

  return request.Post(ARTACLE_DETAIL, data, {
    meta,
  })
}

/**
 * @description: 获取网点信息
 * @return {}
 */

export function getBranchesInfo<T>(data: any) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
    loading: true,
  }

  return request.Post<T>(GET_BRANCHES_INFO, data, {
    meta,
  })
}

/**
 * @description: 资源检索列表
 * @return {}
 */

export function getSerchList<T>(data: any) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
    loading: true,
  }

  return request.Post<T>(MESSAGE_LIST, data, {
    meta,
  })
}

export function getSpecialTypeList<T>(data) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
  }
  return request.Post<T>(GET_SPECIAL_TYPE_LIST, data, {
    meta,
  })
}

export function get8service<T>(data) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
  }
  return request.Post<T>(GET_8SERVICE, data, {
    meta,
  })
}

export function get8serviceByid<T>(data) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
  }
  return request.Post<T>(GET_8SERVICE_ID, data, {
    meta,
  })
}
