interface SkuUrlItem {
  msg: string
  data: string
  code: number
}
interface SysOrderItemBean {
  productSkuId: number
  skuCostPrice: number
  orderId: string
  skuUrl: string
  productSpuId: number
  skuSellingPrice: number
  updateTime: string
  productSkuCount: number
  delFlag: number
  firstCategoryId: number
  productName: string
  skuName: string
  createTime: string
  orderTotalFee: number
  spuType: string
  createUser: number
  id: number
  shopId: number
  secondCategoryId: number
}

interface Order {
  orderType: number
  orderSubType: number
  receiverTel: string
  note: string
  orderId: string
  settleStatus: number
  orderResource: string
  orderNote: string
  isEvaluatio: string
  deliveryAmount: number
  shopName: string
  couponId: string
  sysOrderItemBeans: SysOrderItemBean[]
  paymentType: number
  shopAvatar: string
  couponAmount: number
  orderTime: string
  deliveryMode: number
  merchantId: string
  payMethod: number
  appKey: string
  shopPhone: string
  shopId: number
  zhuStatus: number
  parentMerOrderId: string
  orderAccount: string
  orderActualAmount: number
  receiverName: string
  afterSalesStatus: string
  isShow: string
  receiverAddress?: string
  pickUpCode?: string
  orderTotalFee: number
  createTime: string
  spuType: string
  cardId: string
  paymentMethod: number
  takeAddressId: number
  pickUpPoint: string
  status: number
  checkoutType?: string
  subOrderId?: string
  payMentTime?: string
  shopCartId?: number
}

type OrderList = Order[]

export type { Order, OrderList, SkuUrlItem, SysOrderItemBean }
