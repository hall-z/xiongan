export interface couponProps {
  type: number
  couponSource: number
  couponId: number
  couponCode: string
  couponType: number
  couponName: string
  couponScop: number
  couponPrice: number
  couponFillPrice: number
  couponUsedObj: number
  couponUsedWay?: any
  couponBeginDate: string
  couponEndDate: string
  couponNum: number
  couponReceiveLimit: number
  couponReceiveWay: number
  couponRemark: string
  couponReceiveBeginDate: string
  couponReceiveEndDate: string
  userId?: any
  createTime: string
  updateTime: string
  receiveNum: number
  flag: number
  createUser?: any
  createUserName?: any
  updateUser?: any
  useQuantity: number
  topFlag: number
  orgList?: any
  shopList?: any
  itemList?: any
  receiveId: number
  maxDiscountAmount: number
}

export interface shopDetilProps {
  shopPicture: string
  inShopPicture: string
  updateUser: string
  accountPicture: string
  updateTime: string
  terminalId: string
  businessDesc: string
  merchantName: string
  merchantNumber: string
  rejectReason: string
  isDeleted: number
  createTime: string
  merchantId: string
  accountProve: string
  auditStatus: number
  createUser: string
  id: string
  merchantType: number
}
