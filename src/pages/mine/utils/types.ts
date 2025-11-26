interface serveProps {
  icon?: string
  path: string
  title: string
  islink: boolean
  isSign?: boolean // 是否需要登录
  isRealSataus?: boolean // 是否显示该项目
  value?: string | number
  id?: string
  data?: any
  props?: any // 对应字段
  isShow?: boolean // 是否显示该项目
}
interface serveListProps {
  label: string
  value: number
  icon: string
  path: string
  props?: any // 对应字段
  hidden?: boolean // 是否隐藏badge
}
interface msCountProps {
  totalOrderNumDay?: string // 今日订单数
  totalMoneyDay?: string // 今日收款金额
  couponReceiveDay?: string // 今日优惠券领取数
  couponOffDay?: string // 今日优惠券核销数
  notMoneyDay?: string // 今日待收款金额
}

interface myInfoProps {
  couponNum: number
  userGradeName: string
  userGrade: number
  pocketNum: number
  pointsNum: number
}
interface MyOrderProps {
  ywc: number
  sh: number
  dfh: number
  dfk: number
  dsh: number
}
interface shopOrederProps {
  couponsReceive: number
  dskAmount: number
  todayOrderNum: number
  couponsVerification: number
  todayAmount: number
}
interface integralProps {
  todayIntegral: number
  stageList: any[]
  today: boolean
  surplusIntegral: number
  lxSignInDay: number
  totalSignInDay: number
  totalIntegral: number
}
interface ICheckBankPromoterByUserIdData {
  promoter: boolean // 是否激活  --统计/  表单
  bank: boolean // 是否银行推广人
  apply: boolean // 是否银行推广人
}
interface IPromoterSwitchUserIdData {
  status: number // 是否有权限
  id: number // id
}

export type {
  ICheckBankPromoterByUserIdData,
  integralProps,
  IPromoterSwitchUserIdData,
  msCountProps,
  myInfoProps,
  MyOrderProps,
  serveListProps,
  serveProps,
  shopOrederProps,
}
