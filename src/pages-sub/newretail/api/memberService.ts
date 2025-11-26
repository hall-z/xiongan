import request from './request'

interface RefreshTokenParams {
  refreshToken: string
}

interface MemberBalanceSplitParams {
  // 根据业务需要定义具体参数
}

interface ResetCardPasswordParams {
  newPassword: string
  oldPassword: string
}

interface QueryParams {
  page?: number
  size?: number
  [key: string]: any
}

interface GetScoreDeductibleParams {
  memberScore: number
  orderPrice: number
}

interface InviteParams {
  captcha: string
  introduceStoreId?: string
  introducerId?: string
  inviteeMobile: string
  sourceType: string
}

interface CreateVipOrderParams {
  sourceStoreId: string
  vipMealId: string
}

interface CreateScoreOrderParams {
  memberId: string
  storeId: string
}

interface SigninLogParams {
  month?: string
  [key: string]: any
}

export const MemberService = {
  /**
   * 刷新access token
   * @param refreshToken 刷新令牌
   */
  refreshToken: (refreshToken: string): Promise<any> => {
    return request.post('/newretail/api/mbr/member/refreshToken', {
      refreshToken: refreshToken
    })
  },

  /**
   * 获得会员储值余额
   */
  getMbrBalance: (): Promise<any> => {
    return request.get('/newretail/api/mbr/member/getMbrBalance')
  },

  /**
   * 获得会员储值余额（充值金额和赠送金额区分）
   */
  getMbrBalanceSplit: (postData?: MemberBalanceSplitParams): Promise<any> => {
    return request.get('/newretail/api/mbr/member/getBalance', postData)
  },

  /**
   * 重置会员储值卡密码
   * @param newPassword 新密码
   * @param oldPassword 旧密码
   */
  resetCardPassword: (postData: ResetCardPasswordParams): Promise<any> => {
    return request.post('/newretail/api/mbr/member/resetCardPassword', postData)
  },

  /**
   * 记录会员访问门店：同一天同一个门店，同一个会员访问只会被记录一次
   */
  visitStore: (storeId: string): Promise<any> => {
    return request.put(`/newretail/api/mbr/member/visitStore?storeId=${storeId}`)
  },

  /**
   * 分页查询储值流水信息
   */
  query: (postData?: QueryParams): Promise<any> => {
    return request.get('/newretail/api/mbr/cardPay/query', postData)
  },

  /**
   * 会员积分查询 -- 增加过期积分展示
   */
  getBalance: (mobile: string): Promise<any> => {
    const params = {
      memberMobile: mobile
    }
    return request.get('/newretail/api/mbr/score/getBalance', params)
  },

  /**
   * 会员积分查询 -- 增加过期积分展示对象形式
   */
  getBalanceV2: (mobile: string): Promise<any> => {
    const params = {
      memberMobile: mobile
    }
    return request.get('/newretail/api/mbr/score/getBalanceV2', params)
  },

  /**
   * 查询积分流水
   */
  queryHst: (postData?: QueryParams): Promise<any> => {
    return request.get('/newretail/api/mbr/score/queryHst', postData)
  },

  /**
   * 查询积分抵扣金额
   * @param memberScore 会员积分
   * @param orderPrice 订单价格
   */
  getScoreDeductible: (memberScore: number, orderPrice: number): Promise<any> => {
    const params = {
      memberScore: memberScore,
      orderPrice: orderPrice
    }
    return request.get('/newretail/api/mbr/score/getScoreDeductible', params)
  },

  /**
   * 邀请好友，好友领取
   */
  invite: (postData: InviteParams): Promise<any> => {
    return request.post('/newretail/api/mbr/member/invite', postData)
  },

  /**
   * 获得会员付款码
   */
  getPayCode: (postData?: QueryParams): Promise<any> => {
    return request.get('/newretail/api/mbr/member/getPayCode', postData)
  },

  /**
   * 获得会员码
   */
  getMbrCode: (postData?: QueryParams): Promise<any> => {
    return request.get('/newretail/api/mbr/member/getMbrCode', postData)
  },

  /**
   * 会员签到对外接口
   */
  signin: (): Promise<any> => {
    return request.post('/newretail/api/mbr/signin')
  },

  /**
   * 会员签到查询对外接口
   */
  querySignin: (postData?: QueryParams): Promise<any> => {
    return request.get('/newretail/api/mbr/signin/query', postData)
  },

  /**
   * 更新会员资料
   */
  update: (postData: any): Promise<any> => {
    return request.put('/newretail/api/mbr/member/update', postData)
  },

  /**
   * 查询所有会员等级
   */
  queryGrade: (): Promise<any> => {
    return request.get('/newretail/api/mbr/member/grade/query')
  },

  /**
   * 查询会员列表
   */
  queryMember: (postData?: QueryParams): Promise<any> => {
    return request.get('/newretail/api/mbr/member/queryMember', postData)
  },

  /**
   * 获取微信支付签名（微信拉取付款码）
   */
  getOfflinePaySign: (): Promise<any> => {
    return request.get('/newretail/api/payment/wx/getOfflinePaySign')
  },

  /**
   * 获得查询会员积分付款码
   */
  getScorePayCode: (postData?: QueryParams): Promise<any> => {
    return request.get('/newretail/api/mbr/member/getScorePayCode', postData)
  },

  /**
   * 查询会员积分支付结果
   */
  getScorePayResult: (postData?: QueryParams): Promise<any> => {
    return request.get('/newretail/api/mbr/member/getScorePayResult', postData)
  },

  /**
   * 获得付费会员等级配置
   */
  getVipMemberGradeConfig: (): Promise<any> => {
    return request.get('/newretail/api/mbr/member/grade/vip/get')
  },

  /**
   * 获得付费会员可领的券
   */
  getVipMemberCouponActivity: (): Promise<any> => {
    return request.get('/newretail/api/mbr/member/grade/vip/getCouponActivity')
  },

  /**
   * 创建付费会员订单
   */
  createOrder: (postData: CreateVipOrderParams): Promise<any> => {
    return request.post('/newretail/api/mbr/member/grade/vip/order/create', postData)
  },

  /**
   * 查询付费会员订单状态
   */
  getStatus: (id: string): Promise<any> => {
    const params = { id: id }
    return request.get('/newretail/api/mbr/member/grade/vip/order/getStatus', params)
  },

  /**
   * 查询当前登录会员信息
   */
  getLoginMember: (forceRefresh: boolean = true): Promise<any> => {
    return request.get(`/newretail/api/mbr/member/getLoginMember?forceRefresh=${forceRefresh}`)
  },

  /**
   * 根据ID查询外部会员信息
   */
  getExternalMember: (id: string): Promise<any> => {
    const param = { id: id }
    return request.get('/newretail/api/mbr/member/getExternalMember', param)
  },

  /**
   * 查看等级详情
   */
  getGradeById: (gradeId: string): Promise<any> => {
    const params = { gradeId: gradeId }
    return request.get('/newretail/api/mbr/member/grade/getById', params)
  },

  /**
   * 创建积分会员订单
   */
  createScoreOrder: (postData: CreateScoreOrderParams): Promise<any> => {
    const params = { ...postData }
    return request.post(`/newretail/api/mbr/member/grade/order/create?memberId=${params.memberId}&storeId=${params.storeId}`)
  },

  /**
   * 根据会员id查询待签收的积分
   */
  benefitPlanGetByMemberId: (memberId: string): Promise<any> => {
    return request.get(`/newretail/api/mall/welfare/benefitPlan/grant/getByMemberId?memberId=${memberId}`)
  },

  /**
   * 美团免登录
   */
  mtxxh5login: (): Promise<any> => {
    return request.get('/newretail/api/mall/mtxx/h5login')
  },

  /**
   * 获取会员信息
   */
  getMemberInfo: (): Promise<any> => {
    return request.get('/newretail/api/mbr/member/getMemberCenter')
  },

  /**
   * 获得签到记录
   */
  getSigninLog: (getData?: SigninLogParams): Promise<any> => {
    return request.get('/newretail/api/mbr/member/getSigninLog', getData)
  },

  /**
   * 签到
   */
  signIn: (): Promise<any> => {
    return request.get('/newretail/api/mbr/member/signin')
  },

  /**
   * 获得签到信息
   */
  getSignInfo: (): Promise<any> => {
    return request.get('/newretail/api/mbr/member/getSigninList')
  },

  /**
   * 获取签到提示语
   */
  configGetSignTextCustomize: (): Promise<any> => {
    return request.get('/newretail/api/mall/uiConfig/getSignTextCustomize')
  }
}

export default MemberService