interface MTAConfig {
  app_id: string
  event_id: string
  api_base: string
  prefix: string
  version: string
  stat_share_app: boolean
  stat_pull_down_fresh: boolean
  stat_reach_bottom: boolean
  stat_param: boolean
  ignore_params?: string[]
}

interface SystemInfo {
  adt: string
  scl: number
  scr: string
  lg: string
  fl: string
  jv: string
  tz: string
  ct?: string
}

interface MainInfo {
  dm: string
  url: string
  pvi: string
  si: string
  ty: number
}

interface ExtentInfo {
  r2: string
  r4: string
  ext: string
  r5?: string
}

interface BasicInfo extends SystemInfo {
  ct: string
}

interface MTAEventData {
  [key: string]: any
}

interface MTAData {
  userInfo: any
  lanchInfo: any
  pageQuery: any
  lastPageQuery: any
  pageUrl: string
  lastPageUrl: string
  show: boolean
}

// MTA配置
const MTA_CONFIG: MTAConfig = {
  app_id: "",
  event_id: "",
  api_base: "https://pingtas.qq.com/pingd",
  prefix: "_mta_",
  version: "1.3.10",
  stat_share_app: false,
  stat_pull_down_fresh: false,
  stat_reach_bottom: false,
  stat_param: false,
  ignore_params: []
}

// 获取网络类型
function getNetworkType(callback: (networkType: string) => void): void {
  uni.getNetworkType({
    success: (res) => {
      callback(res.networkType)
    }
  })
}

// 获取系统信息
function getSystemInfo(): SystemInfo {
  const systemInfo = uni.getSystemInfoSync()
  return {
    adt: encodeURIComponent(systemInfo.model || ''),
    scl: systemInfo.pixelRatio || 1,
    scr: `${systemInfo.windowWidth}x${systemInfo.windowHeight}`,
    lg: systemInfo.language || '',
    fl: systemInfo.version || '',
    jv: encodeURIComponent(systemInfo.system || ''),
    tz: encodeURIComponent(systemInfo.platform || '')
  }
}

// 获取用户ID
function getUID(): string | null {
  try {
    return uni.getStorageSync(MTA_CONFIG.prefix + "auid")
  } catch (error) {
    return null
  }
}

// 设置用户ID
function setUID(): string | null {
  try {
    const uid = getRandom()
    uni.setStorageSync(MTA_CONFIG.prefix + "auid", uid)
    return uid
  } catch (error) {
    return null
  }
}

// 获取会话ID
function getSID(): string | null {
  try {
    return uni.getStorageSync(MTA_CONFIG.prefix + "ssid")
  } catch (error) {
    return null
  }
}

// 设置会话ID
function setSID(): string | null {
  try {
    const sid = "s" + getRandom()
    uni.setStorageSync(MTA_CONFIG.prefix + "ssid", sid)
    return sid
  } catch (error) {
    return null
  }
}

// 生成随机数
function getRandom(prefix: string = ""): string {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  let result = ""
  
  // 随机打乱数组
  for (let i = 10; i > 1; i--) {
    const randomIndex = Math.floor(Math.random() * 10)
    const temp = numbers[randomIndex]
    numbers[randomIndex] = numbers[i - 1]
    numbers[i - 1] = temp
  }
  
  // 取前5位数字
  for (let i = 0; i < 5; i++) {
    result += numbers[i]
  }
  
  return prefix + result + Date.now()
}

// 获取页面路径
function getPagePath(): string {
  try {
    const pages = getCurrentPages()
    let path = "/"
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      path = currentPage.route || "/"
    }
    return path
  } catch (error) {
    console.log("get current page path error:", error)
    return "/"
  }
}

// 获取主要信息
function getMainInfo(): MainInfo {
  const info: MainInfo = {
    dm: "wechat.apps.xx",
    url: encodeURIComponent(getPagePath() + getQuery(MTA.Data.pageQuery)),
    pvi: "",
    si: "",
    ty: 0
  }

  // 设置用户ID
  info.pvi = (() => {
    const uid = getUID()
    if (!uid) {
      const newUid = setUID()
      info.ty = 1
      return newUid || ""
    }
    return uid
  })()

  // 设置会话ID
  info.si = (() => {
    const sid = getSID()
    if (!sid) {
      return setSID() || ""
    }
    return sid
  })()

  return info
}

// 获取基础信息
function getBasicInfo(): BasicInfo {
  const systemInfo = getSystemInfo()
  
  getNetworkType((networkType) => {
    try {
      uni.setStorageSync(MTA_CONFIG.prefix + "ntdata", networkType)
    } catch (error) {}
  })

  const basicInfo: BasicInfo = {
    ...systemInfo,
    ct: uni.getStorageSync(MTA_CONFIG.prefix + "ntdata") || "4g"
  }

  return basicInfo
}

// 获取扩展信息
function getExtentInfo(): ExtentInfo {
  const userInfo = MTA.Data.userInfo
  const userInfoStr = userInfo ? Object.entries(userInfo)
    .map(([key, value]) => `${key}=${value}`)
    .join(";") : ""

  return {
    r2: MTA_CONFIG.app_id,
    r4: "wx",
    ext: `v=${MTA_CONFIG.version}${userInfoStr ? `;ui=${encodeURIComponent(userInfoStr)}` : ''}`
  }
}

// 获取查询参数
function getQuery(params: any): string {
  if (!MTA_CONFIG.stat_param || !params) return ""
  
  const filteredParams = ignoreParams(params)
  const queryParams = Object.entries(filteredParams)
    .map(([key, value]) => `${key}=${value}`)
  
  return queryParams.length > 0 ? `?${queryParams.join("&")}` : ""
}

// 忽略参数
function ignoreParams(params: any): any {
  if (!MTA_CONFIG.ignore_params || MTA_CONFIG.ignore_params.length === 0) {
    return params
  }

  const result: any = {}
  for (const key in params) {
    if (!MTA_CONFIG.ignore_params.includes(key)) {
      result[key] = params[key]
    }
  }
  return result
}

// 初始化页面加载监听
function initOnload(): void {
  const originalPage = Page

  Page = function (pageOptions: any) {
    const originalOnLoad = pageOptions.onLoad

    pageOptions.onLoad = function (options: any) {
      // 调用原始onLoad
      if (originalOnLoad) {
        originalOnLoad.call(this, options)
      }

      // 更新MTA数据
      MTA.Data.lastPageQuery = MTA.Data.pageQuery
      MTA.Data.pageQuery = options
      MTA.Data.lastPageUrl = MTA.Data.pageUrl
      MTA.Data.pageUrl = getPagePath()
      MTA.Data.show = false

      // 初始化页面统计
      MTA.Page.init()
    }

    return originalPage(pageOptions)
  }
}

// MTA主对象
const MTA = {
  App: {
    init(options: any): void {
      if ('appID' in options) MTA_CONFIG.app_id = options.appID
      if ('eventID' in options) MTA_CONFIG.event_id = options.eventID
      if ('statShareApp' in options) MTA_CONFIG.stat_share_app = options.statShareApp
      if ('statPullDownFresh' in options) MTA_CONFIG.stat_pull_down_fresh = options.statPullDownFresh
      if ('statReachBottom' in options) MTA_CONFIG.stat_reach_bottom = options.statReachBottom
      if ('ignoreParams' in options) MTA_CONFIG.ignore_params = options.ignoreParams
      if ('statParam' in options) MTA_CONFIG.stat_param = options.statParam

      setSID()

      try {
        if ('lauchOpts' in options) {
          MTA.Data.lanchInfo = options.lauchOpts
          MTA.Data.lanchInfo.landing = 1
        }
      } catch (error) {}

      if ('autoReport' in options && options.autoReport) {
        initOnload()
      }
    }
  },

  Page: {
    init(): void {
      const pages = getCurrentPages()
      if (pages.length === 0) return

      const currentPage = pages[pages.length - 1]

      // 页面显示统计
      if (currentPage.onShow) {
        const originalOnShow = currentPage.onShow
        currentPage.onShow = function () {
          if (MTA.Data.show === true) {
            const tempQuery = MTA.Data.lastPageQuery
            MTA.Data.lastPageQuery = MTA.Data.pageQuery
            MTA.Data.pageQuery = tempQuery
            
            const tempUrl = MTA.Data.lastPageUrl
            MTA.Data.lastPageUrl = MTA.Data.pageUrl
            MTA.Data.pageUrl = tempUrl
          }
          MTA.Data.show = true
          MTA.Page.stat()
          
          if (originalOnShow) {
            originalOnShow.apply(this, arguments as any)
          }
        }
      }

      // 下拉刷新统计
      if (MTA_CONFIG.stat_pull_down_fresh && currentPage.onPullDownRefresh) {
        const originalOnPullDownRefresh = currentPage.onPullDownRefresh
        currentPage.onPullDownRefresh = function () {
          MTA.Event.stat(MTA_CONFIG.prefix + "pulldownfresh", { url: currentPage.route })
          if (originalOnPullDownRefresh) {
            originalOnPullDownRefresh.apply(this, arguments as any)
          }
        }
      }

      // 上拉触底统计
      if (MTA_CONFIG.stat_reach_bottom && currentPage.onReachBottom) {
        const originalOnReachBottom = currentPage.onReachBottom
        currentPage.onReachBottom = function () {
          MTA.Event.stat(MTA_CONFIG.prefix + "reachbottom", { url: currentPage.route })
          if (originalOnReachBottom) {
            originalOnReachBottom.apply(this, arguments as any)
          }
        }
      }

      // 分享统计
      if (MTA_CONFIG.stat_share_app && currentPage.onShareAppMessage) {
        const originalOnShareAppMessage = currentPage.onShareAppMessage
        currentPage.onShareAppMessage = function () {
          MTA.Event.stat(MTA_CONFIG.prefix + "shareapp", { url: currentPage.route })
          if (originalOnShareAppMessage) {
            return originalOnShareAppMessage.apply(this, arguments as any)
          }
          return {}
        }
      }
    },

    multiStat(appId: string, flag: number): void {
      if (flag === 1) {
        this.stat(appId)
      } else {
        const pages = getCurrentPages()
        if (pages.length === 0) return

        const currentPage = pages[pages.length - 1]
        if (currentPage.onShow) {
          const originalOnShow = currentPage.onShow
          currentPage.onShow = function () {
            MTA.Page.stat(appId)
            if (originalOnShow) {
              originalOnShow.call(this, arguments as any)
            }
          }
        }
      }
    },

    stat(appId?: string): void {
      if (!MTA_CONFIG.app_id) return

      const params: string[] = []
      const extentInfo = getExtentInfo()
      
      if (appId) {
        extentInfo.r2 = appId
      }

      const data = [
        getMainInfo(),
        extentInfo,
        getBasicInfo()
      ]

      // 添加启动信息
      if (MTA.Data.lanchInfo) {
        data.push({ ht: MTA.Data.lanchInfo.scene })
        
        if (MTA.Data.pageQuery && MTA.Data.pageQuery._mta_ref_id) {
          data.push({ rarg: MTA.Data.pageQuery._mta_ref_id })
        }

        try {
          if (MTA.Data.lanchInfo.landing === 1) {
            extentInfo.ext += ";lp=1"
            MTA.Data.lanchInfo.landing = 0
          }
        } catch (error) {}
      }

      // 添加页面信息
      data.push({
        rdm: "/",
        rurl: MTA.Data.lastPageUrl.length === 0 
          ? MTA.Data.pageUrl + getQuery(MTA.Data.lastPageQuery)
          : encodeURIComponent(MTA.Data.lastPageUrl + getQuery(MTA.Data.lastPageQuery))
      })

      // 添加随机数
      data.push({ rand: Date.now() })

      // 构建参数字符串
      for (const item of data) {
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const value = item[key as keyof typeof item]
            params.push(`${key}=${value === undefined ? '' : value}`)
          }
        }
      }

      // 发送请求
      uni.request({
        url: MTA_CONFIG.api_base + "?" + params.join("&").toLowerCase(),
        method: 'GET'
      })
    }
  },

  Event: {
    stat(eventName: string, data?: MTAEventData): void {
      if (!MTA_CONFIG.event_id) return

      const params: string[] = []
      const mainInfo = getMainInfo()
      const extentInfo = getExtentInfo()

      mainInfo.dm = "wxapps.click"
      mainInfo.url = eventName
      extentInfo.r2 = MTA_CONFIG.event_id

      // 处理事件数据
      if (data) {
        const eventData = Object.entries(data)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join(";")
        extentInfo.r5 = eventData
      }

      const requestData = [
        mainInfo,
        extentInfo,
        getBasicInfo(),
        { rand: Date.now() }
      ]

      // 构建参数字符串
      for (const item of requestData) {
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const value = item[key as keyof typeof item]
            params.push(`${key}=${value === undefined ? '' : value}`)
          }
        }
      }

      // 发送请求
      uni.request({
        url: MTA_CONFIG.api_base + "?" + params.join("&").toLowerCase(),
        method: 'GET'
      })
    }
  },

  Data: {
    userInfo: null,
    lanchInfo: null,
    pageQuery: null,
    lastPageQuery: null,
    pageUrl: "",
    lastPageUrl: "",
    show: false
  } as MTAData
}

export default MTA