import request from './request'

interface QueryParams {
  page?: number
  pageSize?: number
  searchCount?: boolean
  statusEquals?: string
  couponActivityNameLike?: string
  memberIdEquals?: string
  orderDirection?: string
  orderField?: string
  [key: string]: any
}

interface CouponOrderParams {
  couponActivityId?: string
  externalCouponActivityId?: string
  storeId?: string
  score?: number
}

interface QueryByActivityParams {
  page?: number
  pageSize?: number
  couponActivityId?: string
  templateNumber?: string
  storeId?: string
  searchCount?: boolean
  [key: string]: any
}

export const CouponService = {
  /**
   * 查询优惠券
   */
  queryCoupon: (postData?: QueryParams): Promise<any> => {
    return request.get('/newretail/api/mbr/coupon/query', postData)
  },

  /**
   * 查询余额列表
   */
  queryMspAccountList: (postData?: any): Promise<any> => {
    return request.get('/newretail/api/mbr/msp/queryMspAccountList', postData)
  },

  /**
   * 查询余额详情
   */
  getMspAccountDetail: (postData?: any): Promise<any> => {
    return request.get('/newretail/api/mbr/msp/getMspAccountDetail', postData)
  },

  /**
   * 获取余额动态码
   */
  getMspCardCode: (postData?: any): Promise<any> => {
    return request.get('/newretail/api/mbr/msp/getMspCardCode', postData)
  },

  /**
   * 确认充值金额
   */
  recharge: (postData?: any): Promise<any> => {
    return request.post('/newretail/api/mbr/msp/recharge', postData)
  },

  createOrder: (postData?: any): Promise<any> => {
    return request.post('/newretail/api/mbr/msp/createOrder', postData)
  },

  getPaySign: (postData?: any): Promise<any> => {
    return request.post('/newretail/api/mbr/msp/getPaySign', postData)
  },

  /**
   * 查询优惠券
   */
  query: (postData?: QueryParams): Promise<any> => {
    if (postData?.functionEquals && postData.functionEquals.length > 1) {
      let functionEquals = ''
      const tempArr = [].concat(postData.functionEquals)
      tempArr.forEach((item, index) => {
        if (index === 0) {
          functionEquals = functionEquals + '?functionEquals=' + item
        } else {
          functionEquals = functionEquals + '&functionEquals=' + item
        }
      })
      delete postData.functionEquals
      return request.get(`/newretail/api/mbr/coupon/query${functionEquals}&page=${postData.page}&pageSize=${postData.pageSize}&memberMobileEquals=${postData.memberMobileEquals}&statusEquals=${postData.statusEquals}&searchCount=${postData.searchCount}&orderDirection=${postData.orderDirection}&orderField=${postData.orderField}`)
    } else {
      return request.get('/newretail/api/mbr/coupon/query', postData)
    }
  },

  /**
   * 查询外部会员券(未使用)列表
   */
  queryExternalCoupons: (postData?: any): Promise<any> => {
    return request.get('/newretail/api/mbr/coupon/queryExternalCoupons', postData)
  },

  /**
   * 查询可用优惠券
   * @param page 当前页码或"qrpay"标识
   */
  getAvailableCoupon: (page: string | number, postData?: any): Promise<any> => {
    if (page === 'qrpay') {
      return request.post('/newretail/api/mall/qrorder/calcUsableCoupons', postData)
    } else {
      return request.post('/newretail/api/promotion/calcUsableCoupons', postData)
    }
  },

  /**
   * 促销计算
   */
  calcDiscount: (postData?: any): Promise<any> => {
    return request.post('/newretail/api/promotion/calcDiscount', postData)
  },

  /**
   * 查询内部券
   */
  getCouponActivitiesByFilter: (postData?: any): Promise<any> => {
    return request.get('/newretail/api/mbr/couponActivity/getCouponActivitiesByFilter', postData)
  },

  /**
   * 查询外部券
   */
  getExternalCouponActivities: (postData?: any): Promise<any> => {
    const params = {
      ...postData,
      searchCount: true
    }
    return request.get('/newretail/api/mbr/couponActivity/getExternalCouponActivities', params)
  },

  /**
   * 创建购券订单
   */
  createCouponOrder: (params: CouponOrderParams): Promise<any> => {
    let queryParams = ''
    if (params.couponActivityId) {
      queryParams = `?couponActivityId=${params.couponActivityId}&storeId=${params.storeId}`
    } else if (params.externalCouponActivityId) {
      queryParams = `?externalCouponActivityId=${params.externalCouponActivityId}&storeId=${params.storeId}`
    }
    if (params.score != null) {
      queryParams += `&score=${params.score}`
    }
    return request.put(`/newretail/api/mbr/couponActivity/createCouponOrder${queryParams}`)
  },

  /**
   * 获得券对应的支付订单签名
   */
  getCouponPaySign: (postData?: any): Promise<any> => {
    return request.post('/newretail/api/mbr/couponActivity/getCouponPaySign', postData)
  },

  /**
   * 券申领
   */
  assign: (postData?: any): Promise<any> => {
    return request.post('/newretail/api/mbr/coupon/assign', postData)
  },

  /**
   * 标记指定的券为已查看
   */
  visited: (couponIds: string[]): Promise<any> => {
    return request.put('/newretail/api/mbr/coupon/visited', couponIds)
  },

  /**
   * 根据券活动id查询券活动详情
   */
  getById: (id: string): Promise<any> => {
    const params = { id }
    return request.get('/newretail/api/mbr/couponActivity/getById', params)
  },

  /**
   * 查询会员未使用状态的券数量（本地券+外部券）
   */
  getMbrUnUseCouponCount: (): Promise<any> => {
    return request.get('/newretail/api/mbr/coupon/getMbrUnUseCouponCount')
  },

  /**
   * 根据券包活动Id查询券包活动详情
   */
  getPackageById: (id: string): Promise<any> => {
    const params = { id }
    return request.get('/newretail/api/mbr/couponActivity/getPackageById', params)
  },

  /**
   * 查询购券订单详情
   */
  getCouponOrderById: (orderId: string): Promise<any> => {
    const params = { orderId }
    return request.get('/newretail/api/mbr/couponActivity/getCouponOrderById', params)
  },

  /**
   * 根据券活动Id查询对应的券活动的使用商品范围
   */
  queryByCouponActivityId: (params: QueryByActivityParams): Promise<any> => {
    const requestParams = {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      couponActivityId: params.couponActivityId,
      storeId: params.storeId,
      searchCount: true,
      ...params
    }
    return request.get('/newretail/api/mall/product/shareBalance/queryByCouponActivityId', requestParams)
  },

  /**
   * 根据HDCM查询对应的券活动的使用商品范围
   */
  queryByHdCrmCode: (params: QueryByActivityParams): Promise<any> => {
    const requestParams = {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      templateNumber: params.templateNumber,
      storeId: params.storeId,
      searchCount: true,
      ...params
    }
    return request.get('/newretail/api/mall/product/shareBalance/queryByHdCrmCode', requestParams)
  },

  /**
   * 外部券根据兑换码兑换
   */
  externalSendByCode: (opts: { exchangeCode: string; memberId: string }): Promise<any> => {
    const params = {
      exchangeCode: opts.exchangeCode,
      memberId: opts.memberId
    }
    return request.post('/newretail/api/mbr/coupon/externalSendByCode', params)
  },

  /**
   * 查看券详情
   */
  getCouponDetail: (couponId: string): Promise<any> => {
    const params = { couponId }
    return request.get('/newretail/api/mbr/coupon/get', params)
  },

  /**
   * 查询券流水
   */
  queryCouponHistory: (page: number, pageSize: number, opts?: any): Promise<any> => {
    const params = {
      page,
      pageSize,
      ...opts
    }
    return request.get('/newretail/api/mbr/coupon/history/query', params)
  },

  /**
   * 根据已经制造的券申领
   */
  assignByCoupon: (postData?: any): Promise<any> => {
    return request.post('/newretail/api/mbr/coupon/assignByCoupon', postData)
  },

  /**
   * 使用推荐优惠
   */
  bestDiscounts: (postData?: any): Promise<any> => {
    return request.post('/newretail/api/promotion/bestDiscounts', postData)
  }
}

export default CouponService