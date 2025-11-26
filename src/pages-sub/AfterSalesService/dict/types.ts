/**
 * 审核记录类型
 */
interface AuditItem {
  /** 审核内容 */
  auditContent: string
  /** 售后单号 */
  afterSalesId: string
  /** 创建时间（ISO 8601 格式） */
  createTime: string
  /** 创建人ID */
  createId: string
  /** 审核状态（0/1 建议使用枚举） */
  auditStatus: '0' | '1'
  /** 唯一标识 */
  id: string
  /** 步骤标识 */
  setp: string

  /** 审核凭证 */
  auditVoucher: string
  /** 审核内容 */
  contentDescription?: string
  /** 关联订单号 */
  orderId?: string
  label?: string
  time?: string
  reason?: string
}

/**
 * 售后主信息类型
 */
interface AfterSales {
  /** 售后单号 */
  afterSalesId: string
  /** 创建时间 */
  createTime: string
  /** 关联订单号 */
  orderId: string
  /** 退款原因 */
  refundReason: string
  /** 支付卡ID（大数字建议使用 string） */
  cardId: number
  /** 用户手机号 */
  userPhone: string
  /** 退款凭证（空字符串表示无凭证） */
  refundVoucher: string
  /** 用户ID */
  userId: number
  /** 售后状态（建议使用枚举） */
  afterSalesStatus: '0' | '1' | '2'
  /** 售后类型（建议使用枚举） */
  afterSalesType: '1' | '2'
  /** 退款说明 */
  refundDescription?: string
  /** 退款快递公司 */
  refundExpressDeliveryCompany?: string
  /** 退款快递单号 */
  refundExpressDeliveryNumber?: string
}

/**
 * 带嵌套结构的售后详情类型
 */
interface AfertSalesDetail {
  // 注意检查字段名称拼写 afertSales => afterSales
  /** SKU 属性（需要解析的 JSON 字符串） */
  skuName: string
  /** 轮播图（解析后结构） */
  rotationUrl: string
  /** SPU 名称 */
  spuName: string
  /** 实际订单金额（建议用 number 类型） */
  orderActualAmount: string
  /** 支付卡名称 */
  cardName: string
  /** 订单号 */
  orderId: string
  /** SKU 主图（解析后结构） */
  skuUrl: string
  /** 店铺名称 */
  shopName: string
  /** 备注图片（解析后结构） */
  remarkUrl: Array<{
    msg: string
    data: string
    code: number
  }>
  /** 销售价格 */
  sellPrice: string
  /** 店铺logo */
  shopAvatar: string
  /** 退款金额 */
  refundAmount: number
  /** 用户寄回地址 */
  sendAddressName: string
  /** 商家电话 */
  shopPhone: string
}
/**
 * 地址信息完整类型定义
 */
interface AddressInfo {
  /** 所在区（例如："城关区"） */
  area: string
  /** 详细街道地址（例如："雁南路"） */
  address: string
  /** 所在市（例如："兰州市"） */
  city: string
  /** 市级行政区划代码（例如："620100"） */
  cityCode: string
  /** 省级行政区划代码（例如："620000"） */
  provinceCode: string
  /** 联系人姓名 */
  contactPerson: string
  /** 地址别名（可用于快速识别） */
  addressAlias: string
  /** 最后更新时间（ISO 8601 格式） */
  updateTime: string
  /** 区级行政区划代码（例如："620100"） */
  areaCode: string
  /** 创建人ID */
  createBy: string
  /** 所在省份（例如："甘肃省"） */
  province: string
  /** 创建时间（ISO 8601 格式） */
  createTime: string
  /** 商户ID */
  merchantId: string
  /** 最后更新人ID */
  updateBy: string
  /** 唯一标识（UUID格式） */
  id: string
  /** 联系电话 */
  contactPhone: string
}

/**
 * 完整数据结构
 */
interface AfterSalesData {
  auditList: AuditItem[]
  afterSales: AfterSales
  afertSalesDetail: AfertSalesDetail // 注意字段名称是否正确（疑似拼写错误）
  returnAddress: AddressInfo
}

/** ******************** 进阶优化建议方案 **********************/

// 图片对象结构
interface ImageItem {
  msg: string
  data: string
  code: number
}

// SKU属性结构定义
type SKUAttributes = Record<string, string> // 解析 skuName 的属性对象

interface LogisticsData {
  time: string
  /** 物流状态 */
  status: string
  /** 物流区域 */
  areaName: string
  /** 物流区域代码 */
  areaCode: string
  /** 物流内容 */
  context: string
  /** 物流时间 */
  ftime: string
}

interface dictType {
  label: string
  value: string
  reason?: string
  time?: string
  status?: string
}

/**
 * JSON 字符串解析辅助函数
 */
const parseStringField = <T>(jsonString: string): T => {
  try {
    return JSON.parse(jsonString)
  } catch {
    return {} as T
  }
}

const changeSkuImg = (skuUrl: string) => {
  return parseStringField<ImageItem[]>(skuUrl)[0]?.data ?? ''
}
const chageSkuName = (skuName: string) => {
  const skuNameObj = parseStringField<SKUAttributes>(skuName)
  return Object.values(skuNameObj).join(' ')
}
const changeVoucherImg = (refundVoucher: string) => {
  return refundVoucher?.split(',')[0] ?? ''
}
export { chageSkuName, changeSkuImg, changeVoucherImg }
export type {
  AddressInfo,
  AfertSalesDetail,
  AfterSales,
  AfterSalesData,
  AuditItem,
  dictType,
  LogisticsData,
}
