import request from './request'

export const WelfarePlanService = {
  /**
   * 根据会员查询福利计划可购买的商品
   */
  getProductByMemberId: (memberId: string): Promise<any> => {
    return request.get('/newretail/api/mall/welfare/benefitPlan/grant/getProductByMemberId', { memberId })
  },

  /**
   * 根据会员查询福利计划分类
   */
  grantGetCategory: (memberId: string): Promise<any> => {
    return request.get('/newretail/api/mall/welfare/benefitPlan/grant/getCategory', { memberId })
  },

  /**
   * 根据会员及分类查询福利商品
   */
  grantGetProduct: (params: any): Promise<any> => {
    return request.post('/newretail/api/mall/welfare/benefitPlan/grant/getProduct', params)
  },

  /**
   * 根据会员查询福利计划可购买的商品V2
   */
  getProductByMemberIdV2: (memberId: string, productName?: string): Promise<any> => {
    return request.get('/newretail/api/mall/welfare/benefitPlan/grant/getProductByMemberIdV2', { 
      memberId,
      productName 
    })
  },

  /**
   * 签收积分
   */
  grantSgin: (params: any): Promise<any> => {
    return request.post('/newretail/api/mall/welfare/benefitPlan/grant/sign', params)
  },

  /**
   * 查询生效状态范围内的旅游产品
   */
  tourismPlanQuery: (): Promise<any> => {
    return request.get('/newretail/api/mall/c/welfare/tourismPlan/query')
  },

  /**
   * 查询路线详情
   */
  tourismPlanDetails: (id: string): Promise<any> => {
    return request.get(`/newretail/api/mall/c/welfare/tourismPlan/details?id=${id}`)
  },

  /**
   * 用户选择旅游线路
   */
  tourismPlanConfirm: (params: any): Promise<any> => {
    return request.post('/newretail/api/mall/c/welfare/tourismPlan/confirm', params)
  },

  /**
   * 查询用户是否有权限参与计划
   */
  getTravelByPlanId: (params: any): Promise<any> => {
    return request.get('/newretail/api/mall/c/welfare/tourismPlan/getTravelByPlanId', params)
  },

  /**
   * 更新用户范围情况
   */
  updateUserByPlanId: (params: any): Promise<any> => {
    return request.get('/newretail/api/mall/c/welfare/tourismPlan/updateUserByPlanId', params)
  },

  /**
   * 获取用户报名的线路
   */
  getRouteByUserId: (params: any): Promise<any> => {
    return request.get('/newretail/api/mall/welfare/tourismPlanRoute/getRouteByUserId', params)
  },

  /**
   * 创建旅游计划评价
   */
  tourismPlanEvaluateCreate: (params: any): Promise<any> => {
    return request.post('/newretail/api/mall/welfare/tourismPlanEvaluate/create', params)
  },

  /**
   * 修改用户线路填写信息
   */
  updateUserHonor: (params: any): Promise<any> => {
    return request.post('/newretail/api/mall/c/welfare/tourismPlan/updateUserHonor', params)
  }
}

export default WelfarePlanService