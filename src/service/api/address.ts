import { baseUrlApi } from '@/interceptors/utils'
import { request } from '@/utils/http'
import { METHOD_INSTANCE } from '../model/baseModel'

const ADDRESS_LIST = baseUrlApi('/member/app/goodsAddress/getUserGoodsAddressList')
const ADDRESS_ADDORUPDATE = baseUrlApi('/member/app/goodsAddress/addOrUpdateGoodsAddress')
const ADDRESS_DELETE = baseUrlApi('/member/app/goodsAddress/deleteGoodsAddressById')
const GET_COUPON_LIST = baseUrlApi('/promotion/app/coupon/haveGoods')
const GET_COUPON_LIST_NEW = baseUrlApi('/promotion/app/coupon/haveGoodsNew')
const GETGOODS_COUPON = baseUrlApi('/promotion/app/coupon/goodsCoupon')

/**
 *   收货地址列表
 * @param params 初始参数()
 * */
export function addressList(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    ADDRESS_LIST, // 请求地址
    data,
    {
      meta,
    },
  )
}

export function getCouponList(data) {
  const meta: METHOD_INSTANCE = {
    // loading: true,
  }
  return request.Post(
    GET_COUPON_LIST, // 请求地址
    data,
    {
      meta,
    },
  )
}
export function getgoodsCoupon(data) {
  const meta: METHOD_INSTANCE = {
    // loading: true,
  }
  return request.Post(
    GETGOODS_COUPON, // 请求地址
    data,
    {
      meta,
    },
  )
}

export function getCouponListNew(data) {
  const meta: METHOD_INSTANCE = {
    // loading: true,
  }
  return request.Post(
    GET_COUPON_LIST_NEW, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *   收货地址新增或修改
 * @param params 初始参数()
 * */
export function addressListAddOrEdit(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    ADDRESS_ADDORUPDATE, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *   收货地址删除
 * @param params 初始参数()
 * */
export function addressListDel(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    ADDRESS_DELETE, // 请求地址
    data,
    {
      meta,
    },
  )
}
