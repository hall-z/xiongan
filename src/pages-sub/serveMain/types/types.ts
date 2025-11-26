export interface LoginForm {
  username: string
  password: string
  verifyCode?: string
}

export interface RegisterForm {
  // 当前项名称
  name: string
  // 当前项内容
  content: string
}

export interface Camera {
  title: string
  imgType: number
  devicePosition: 'front' | 'back'
  width?: number
  height?: number
  cameraWidth?: number
}

export interface statusTisProps {
  msg?: string
}

export interface BankBranchProps {
  id?: any
  wdCode: string
  name: string
  address: string
  longitude?: any
  dimension?: any
  areaCode?: any
  phone: string
  state?: any
  createBy?: any
  createTime?: any
  updateBy?: any
  updateTime?: any
  distance?: any
}

export interface cardInfoProps {
  cardInfo: {
    csrq: string
    provinceSid: string
    gj: string
    address: string
    zjlx: string
    dataStatus: string
    xb: string
    zjyxq: string
    zjhm: string
    type: string
    mz: string
    areaCode: string
    size: number
    zhbzkh: string
    yhkh: string
    xm: string
    phone: string
    yhhh: string
    page: number
    cardStatus: string
    zy: string
  }
}
