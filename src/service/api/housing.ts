import { baseUrlApi } from '@/interceptors/utils'
import { request } from '@/utils/http'
import { METHOD_INSTANCE } from '../model/baseModel'

const ACCOUNT_INFO = baseUrlApi('/user/app/getGgXxGrjbxxInfo')
const BUSINESS_INFO = baseUrlApi('/user/app/getZhMxGrywmxxxInfo')
const ACCOUNT_NEW_INFO = baseUrlApi('/user/app/getZhXxGrzhxxInfo')
const REPAY_THE_LOAN = baseUrlApi('/user/app/getSzzfgjjDkMxDkhkmxInfo')
const LOAN_NUMBER = baseUrlApi('/user/app/getDkXxDksqxxInfo')

/**
 * @description: 个人基本信息
 * @param {} data
 * @return {}
 */
export function getGgXxGrjbxxInfo<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post<T>(
    ACCOUNT_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 * @description: 个人基本信息2
 * @param {} data
 * @return {}
 */
export function getZhXxGrzhxxInfo<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(
    ACCOUNT_NEW_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 * @description: 个人业务明细
 * @param {} data
 * @return {}
 */
export function getZhMxGrywmxxxInfo<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: false,
  }
  return request.Post<T>(
    BUSINESS_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 * @description: 个人贷款还款明细
 * @param {} data
 * @return {}
 */
export function getSzzfgjjDkMxDkhkmxInfo<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: false,
  }
  return request.Post<T>(
    REPAY_THE_LOAN, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 * @description: 个人贷款还款明细查借款编号
 * @param {} data
 * @return {}
 */
export function getDkXxDksqxxInfo<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: false,
  }
  return request.Post<T>(
    LOAN_NUMBER, // 请求地址
    data,
    {
      meta,
    },
  )
}
