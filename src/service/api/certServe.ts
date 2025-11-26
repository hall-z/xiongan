import { baseUrlApi } from '@/interceptors/utils'
import { request } from '@/utils/http'
import { METHOD_INSTANCE } from '../model/baseModel'

// const CERT_PLAN_INFO = baseUrlApi('/member/app/sbzg/api/pub/v6/plan')
const CERT_PLAN_INFO = baseUrlApi('/member/app/sbzg/sbrz_004')
// const CERT_RECORD_INFO = baseUrlApi('/member/app/sbzg/api/pub/v6/record')
const CERT_RECORD_INFO = baseUrlApi('/member/app/sbzg/sbrz_006')
const CER_RESULT_INFO = baseUrlApi('/member/app/sbzg/sbrz_002')
const PRESER_RECORDS = baseUrlApi('/member/app/sbzg/sbrz_003')
const RECORD_DETAIL_INFO = baseUrlApi('/api/pub/v6/record/{data.recordId}')
const WX_CERT_INFO = baseUrlApi('/member/app/sbzg/face/identify/getinfo')

/**
 *  查询认证计划
 * @param params 初始参数()
 * */
export function getCertPlanInfo(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
    ignorEencrypt: true,
    // Analysis: true
  }

  return request.Post(
    CERT_PLAN_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询认证结果
 * @param params 初始参数()
 * */
export function getCertResultInfo(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
    ignorEencrypt: true,
  }

  // return request.Post(`/member/app/sbzg/api/prov/plan/{data.planId}/v6/check`, data, {
  //   meta,
  // })
  return request.Post(
    CER_RESULT_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  获取微信人脸认证返回结果
 * @param params 初始参数()
 * */
export function getWxCertInfo(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
    ignorEencrypt: true,
    loading: true,
  }

  return request.Post(WX_CERT_INFO, data, {
    meta,
  })
}

/**
 *  查询认证记录
 * @param params 初始参数()
 * */
export function getCertRecordInfo(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
    ignorEencrypt: true,
  }

  return request.Post(
    CERT_RECORD_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  获取认证记录保存
 * @param params 初始参数()
 * */
export function getPreserRecords(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    loadingText: '认证保存中...',
    Tips: true,
    ignorEencrypt: true,
  }

  return request.Post(PRESER_RECORDS, data, {
    meta,
  })
}

/**
 *  查询认证记录详情
 * @param params 初始参数()
 * */
export function getRecordDetailInfo(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
    ignorEencrypt: true,
  }

  // return request.Post(`/api/pub/v6/record/{data.recordId}`, data, {
  //   meta,
  // })
  return request.Post(RECORD_DETAIL_INFO, data, {
    meta,
  })
}
