/**
 * 类型
 */
interface SpecialItem {
  appId?: string
  conditionCode?: '1' | '2' // 内部/外部
  createTime?: string
  createUser?: string
  id?: string
  position?: string
  specialIcon: string
  specialJump: string
  specialJumpType: 'H5' | 'WX' | 'APP' | 'ALI' | 'page'
  specialName: string
  specialSort?: number
  specialStatus: 0 | 1 // 显示/隐藏
  specialType?: 0 | 1 | 2 | 3 // 微信小程序/支付宝小程序/android/IOS
  updateTime?: string
  updateUser?: string
  wxId?: string
  base?: string // 基础参数
  specialNameBlck?: string // 备用名称
}
interface mainData {
  list: Partial<SpecialItem[]>
  sTitle: string
}

export type { mainData, SpecialItem }
