interface stageList {
  signInDay: string | number
  signIntegral: string | number
  highlight: string | number
  isToday?: string | number
}

interface signInFoProps {
  totalSignInDay: string | number
  todayIntegral: string | number
  totalIntegral: string | number
  surplusIntegral: string | number
  lxSignInDay: string | number
  today: boolean
  stageList: stageList[]
}

interface signInDetailRopos {
  userId: string | number
  kind: string
  num: number
  resource: string
  opertionTime: string
}

interface signMess {
  signIn: string
  msg: string
}

export type { signInDetailRopos, signInFoProps, signMess }
