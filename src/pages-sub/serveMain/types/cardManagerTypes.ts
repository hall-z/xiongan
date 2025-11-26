import dayjs from 'dayjs'

interface CardInfo {
  deptName: string
  userNature: string
  linkPhone: string
  bankCard: string
  cardName: string
  nation: string
  userNatureName: string
  sid: string
  socialCard: string
  bankCode: string
  address: string
  serialNumber: string
  cardCode: string
  sex: string
  cardType: string
  deptId: string
  photo: string
  updateTime: number
  trafficNumber: string
  jingxiongNumber: string
  nationality: string
  birthdayDate: string
  phone: string
  socialCardNum: string
  xcCardType: string
  socialCardType: string
  cardId: number
  cardLimitTerm: string
  job: string
  region: string
  status: string
  cardStatus: string
  cardbal?: number
  cardtype?: string
  xaCardType?: string
  expireDate?: string
  issueDate?: string
}

interface CardApplyInfo {
  idCardNumber: string
  name: string
  socialCard?: string
  cardStatus?: string
  xaCardType?: string
  isShow?: boolean
  issueDate?: string
  expireDate?: string
}
interface PersonDetail {
  csrq: string // 出生日期
  provinceSid: string // 省份ID
  gj: string // 国家代码
  address: string // 地址
  zjlx: string // 证件类型
  dataStatus: string // 数据状态
  xb: string // 性别代码
  zjyxq: string // 证件有效期
  zjhm: string // 证件号码
  type: string // 类型
  mz: string // 民族代码
  areaCode: string // 区域代码
  size: number // 每页大小
  zhbzkh: string // 社会保障卡号
  yhkh: string // 银行卡号
  xm: string // 姓名
  phone: string // 手机号码
  yhhh: string // 银行行号
  page: number // 当前页码
  cardStatus: string // 卡状态
  zy: string // 职业
  expireDate: string
  issueDate: string
  xaCardType: string
}

interface SocialCardInfo {
  data: PersonDetail
  msg: string
  code: number
}
const bkdict = {
  '102': '工商银行',
  '103': '农业银行',
  '104': '中国银行',
  '105': '建设银行',
  '301': '交通银行',
  '302': '中信银行',
  '303': '光大银行',
  '402': '河北农信社',
}
export const getBankName = (code: string): string => {
  return bkdict[code] || ''
}
export const cardStatusMap: Record<string, string> = {
  '0': '封存',
  '1': '已启用',
  '2': '正式挂失',
  '3': '应用锁定',
  '4': '临时挂失',
}
export const getCardStatusText = (status: string): string => {
  return cardStatusMap[status] || '未启用'
}
export const xaCardTypeMap: Record<string, string> = {
  '0': '未知',
  '1': '二代社保卡',
  '2': '三代社保卡',
  '3': '雄安一卡通',
}

export const getXaCardTypeText = (status: string): string => {
  // return xaCardTypeMap[status] || xaCardTypeMap['3']
  return xaCardTypeMap[status] || ''
}

export const cardDate = (status: string, date: string): string => {
  if (status === '0' || !status) {
    return ''
  } else {
    return date ? dayjs(date).format('YYYY-MM-DD') : ''
  }
}

export type { CardApplyInfo, CardInfo, SocialCardInfo }
