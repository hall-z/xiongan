/**
 * 主题管理器
 * 用于管理主题颜色和图片资源路径
 */

// import { getApp } from '@dcloudio/uni-app'

// 获取应用实例
const app = getApp()

interface DfsType {
  dfs_type: string | null
  dfs_type_name: string | null
}

interface ThemeManager {
  BASE_URL: string
  getImgType(): string
  ossUrl(): string
  color: string
  mainColor: string
  mainBgColor: string
  borderColor: string
  mainBgGradient: string
  mainColorRgb: string
  borderColorRgb: string
  mainColorRgb02: string
  BgColorRgb01: string
}

/**
 * JS颜色十六进制转换为rgb或rgba,返回的格式为 rgba（255，255，255，0.5）字符串
 * sHex为传入的十六进制的色值
 * alpha为rgba的透明度
 */
const colorRgba = (sHex: string, alpha: number = 1): string => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}

const handleProject = (color: string): string => {
  switch (color) {
    case "#019F55":
      return "xianfeng"
    case "#80BD01":
      return "mingkanghui"
    case "#FF9F43":
      return "standard"
    case "#3FA9F5":
      return "bianzhaijia"
    case "#418E5A":
      return "jiaju"
    case "#E73278":
      return "xiaoNanHai"
    case "#00E5C3":
      return "xiansheng"
    case "#C30D23":
      return "hlxy"
    default:
      return "standard"
  }
}

let dfsType: DfsType = {
  dfs_type: null,
  dfs_type_name: null
}

let projectConfig = true

const themeManager: ThemeManager = {
  BASE_URL: 'https://newretailprod.oss-cn-shanghai.aliyuncs.com/images',
  
  getImgType(): string {
    // 判断是否存在文件存储配置
    if (projectConfig && app.globalData.dfsObj?.dfs_type) {
      dfsType.dfs_type = app.globalData.dfsObj.dfs_type
      
      // 判断当前文件存储服务类型
      if (app.globalData.dfsObj.dfs_type == 'HUAWEIYUN') {
        dfsType.dfs_type_name = 'huawei'
      } else if (app.globalData.dfsObj.dfs_type == 'QCLOUD') {
        dfsType.dfs_type_name = 'qcloud'
      } else if (app.globalData.dfsObj.dfs_type == 'ALIYUN') {
        dfsType.dfs_type_name = 'aliyun'
      }
      
      // 基础地址
      const base = app.globalData.dfsObj['dfs_' + dfsType.dfs_type_name + 'Domain']
      const Prefix = app.globalData.dfsObj['dfs_' + dfsType.dfs_type_name + 'Prefix']
      
      // 不同类型取不同地址
      this.BASE_URL = base + (Prefix ? ('/' + Prefix) : '/images')
      return this.BASE_URL
    }
    return this.BASE_URL
  },
  
  // 获取图片oss路径
  ossUrl(): string {
    // 判断是否存在文件存储配置
    if (projectConfig && app.globalData.dfsObj?.dfs_type) {
      return this.BASE_URL
    } else {
      // 基础地址
      const base = "https://newretailprod.oss-cn-shanghai.aliyuncs.com/images"
      return base
    }
  },
  
  /**
   * 主题色
   */
  color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null 
    ? app.globalData.uiconfig.themeColor 
    : (uni.getStorageSync('themeColor') || '#FF9F43'),
    
  mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null 
    ? 'color: ' + app.globalData.uiconfig.themeColor + ';' 
    : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    
  mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null 
    ? 'background: ' + app.globalData.uiconfig.themeColor + ';' 
    : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    
  borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null 
    ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';' 
    : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    
  mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" 
    ? 'background: linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' 
    : "background: linear-gradient(-270deg, #FF9F43, #F13327);",
    
  mainColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null 
    ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' 
    : 'color:rgba(255,159,67, 0.4);',
    
  borderColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null 
    ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' 
    : "border-color:rgba(255,159,67, 0.4);",
    
  mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null 
    ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) 
    : 'rgba(255,159,67, 0.2)',
    
  BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null 
    ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' 
    : "background-color:rgba(255,159,67, 0.1);"
}

export const useThemeManager = (): ThemeManager => {
  return themeManager
}

export default themeManager