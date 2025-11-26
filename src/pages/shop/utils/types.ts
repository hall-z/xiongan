interface conponListProps {
  couponId: string
  receiveId: string | number
  type: number // 1支付卷2商品卷
  couponType: number // 优惠券类型
  couponSource: number // 1平台卷2商家卷
  couponName: string // 优惠券类型名称
  couponAmount: string // 优惠券金额
  couponAmountType: number // 优惠券金额类型
  couponAmountTypeName: string // 优惠券金额类型名称
  couponLimit: string // 优惠券限制
  couponTime: string // 领取时间
  couponEndDate: string // 优惠券有效日期
  couponBeginDate: string // 优惠券有效日期
  couponConternt: string // 优惠券内容
  couponStatus: number // 优惠券状态
  couponRemark: string // 使用规则说明
  couponPrice: number // 优惠金额（折扣卷为折扣值，0.8为8折）
  couponFillPrice: number // 满金额
  couponReceiveBeginDate: string // 领取开始时间
  couponReceiveEndDate: string // 领取结束时间
  shopId?: number
  shopName?: string
  couponCode: string // 优惠券码
  activityName: string
  activityStartTime: string
  activityEndTime: string
  applyMerchant: string | number
  userDate: string
}

interface qrCodeProps {
  type: 'xaCard'
  couponId: number | string
  couponName: string
  couponPrice: number
  shopId: number | string
  shopName: string
  couponEndDate: string
  couponRemark: string
  couponStatus: number | string
  showDetil: number
}

interface couponDetailProps {
  aUserName: string
  bUserName: string
  price: number
  createTime: string
}

export type { conponListProps, couponDetailProps, qrCodeProps }
