interface ICheckBankPromoterByUserIdData {
  promoter: boolean // 是否激活  --统计/  表单
  bank: boolean // 是否银行推广人
  apply: boolean // 是否银行推广人
}

interface activationResult {
  createTime: number
  phone: string
  name: string
  id: number
}

interface IGetUnlimitedQRCodeData {
  body: string
}

interface IGetUserListByTimeParams {
  page: number
  size: number
  timeType: string
  status: string
}
interface IGetUserListByTimeContent {
  createTime: number
  userPhone: string
  promoterName: string
  id: number
  promoterPhone: string
  delFlag: number
  userName: string
  promoterId: number
  userId: number
  status: number
  statusName?: string
  bankName?: string
  statusColor?: string
  userBankName: string
}

interface IGetUserListByTimeData {
  number: number
  numberOfElements: number
  size: number
  totalPages: number
  content: IGetUserListByTimeContent[]
  totalElements: number
}

interface IGetCountStatusData {
  total: number
  workTotal: number
  todayCount: number
}
interface IGetUserCountByTimeWindowData {
  ymd: string
  total: number
}
export type {
  activationResult,
  ICheckBankPromoterByUserIdData,
  IGetCountStatusData,
  IGetUnlimitedQRCodeData,
  IGetUserCountByTimeWindowData,
  IGetUserListByTimeData,
  IGetUserListByTimeParams,
}
