import { baseUrlApi } from '@/interceptors/utils'
import { request } from '@/utils/http'
import { METHOD_INSTANCE } from '../model/baseModel'

/**
 *  申请售后
 * @param params 初始参数()
 * */
export function applyForAfterSalesService(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    baseUrlApi('/order/app/manage/applyAfterSales'), // 地址
    data,
    {
      meta,
    },
  )
}
/**
 *  重新提交售后
 * @param params 初始参数()
 * */
export function afterSalesAudit(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    baseUrlApi('/order/app/manage/afterSalesAudit'), // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  售后详情
 * @param params 初始参数()
 * */
export function getAfterSalesDetail<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(baseUrlApi('/order/app/manage/getAfterSalesDetail'), data, {
    meta,
  })
}

/**
 *  退货寄回
 * @param params 初始参数()
 * */
export function returnGoods<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    loadingText: '提交中',
  }
  return request.Post<T>(baseUrlApi('/order/app/manage/returnGoods'), data, {
    meta,
  })
}

/**
 *  取消售后
 * @param params 初始参数()
 * */
export function cancelSalesService(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(baseUrlApi('/order/app/manage/cancelAfterSales'), data, {
    meta,
  })
}

/**
 *  获取物流信息
 * @param params 初始参数()
 * */
export function getLogistics<T>(data) {
  return request.Post<T>(baseUrlApi('/order/app/manage/getLogistics'), data)
}
