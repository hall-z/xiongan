interface detilProp {
  adviceId: number | string
  updateTime: string
  delFlag: string
  isDone: string
  userId: number
  advicePhone: string
  adviceContent: string
  adviceState: string
  createBy: string
  createTime: string
  updateBy: string
  adviceImg: string
  adviceType: string
  status: string
}
interface dataListProp {
  title: string
  props: string
  isAes?: boolean
  showeys?: boolean
  dict?: boolean
  isbangk?: boolean
  isStatus?: boolean
  aesType?: 'centerString' | 'phoneString' | 'areaString' | 'last' | 'socialCard'
}
export type { dataListProp, detilProp }
