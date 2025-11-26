/**
 * 过滤器工具函数
 * 从 wxs 转换而来
 */

/**
 * 格式化二维码数字
 */
export const filtQRNumber = (val: string | number): string => {
  if (val) {
    val = val.toString()
    let op = ''
    for (let i = 0; i < val.length; i++) {
      if (i % 4 === 0 && i > 0) {
        op += ' ' + val.charAt(i)
      } else {
        op += val.charAt(i)
      }
    }
    return op
  } else {
    return ''
  }
}

/**
 * 格式化昵称
 */
export const filtNickname = (val: string): string => {
  if (!val) {
    return '点击头像授权登录'
  } else {
    return val
  }
}

/**
 * 格式化手机号（脱敏）
 */
export const filtMobile = (val: string): string => {
  if (val) {
    return val.substring(0, 3) + '****' + val.substring(7)
  } else {
    return ''
  }
}

/**
 * 获取日期部分
 */
export const filtDateHead = (val: string): string => {
  if (val) {
    return val.split(' ')[0]
  } else {
    return ''
  }
}

/**
 * 格式化退款状态
 */
export const filtRefundStatus = (val: string): string => {
  if (val === 'CREATED') {
    return '退款中'
  } else if (val === 'REJECTED') {
    return '退款失败'
  } else if (val === 'FINISHED') {
    return '退款成功'
  } else if (val === 'CANCELED') {
    return '已取消'
  } else {
    return ''
  }
}

/**
 * 格式化价格（保留两位小数，去掉末尾0）
 */
export const filtToFix = (value: number | string): string => {
  value = Number(value)
  if (value >= 0) {
    const formattedNum = value.toFixed(2) // 此处2为保留两位小数
    // 如果小数部分为00，去掉小数部分
    if (formattedNum.indexOf('.00') !== -1) {
      return formattedNum.substring(0, formattedNum.indexOf('.'))
    }

    // 如果小数部分只有一位，展示一位
    if (formattedNum.indexOf('.') !== -1 && formattedNum[formattedNum.length - 1] === '0') {
      return formattedNum.substring(0, formattedNum.length - 1)
    }
    return formattedNum
  } else {
    return '0'
  }
}

/**
 * 格式化配送公司
 */
export const filtdistributionCompany = (value: string): string => {
  if (value === 'MT') {
    return '美团'
  } else if (value === 'FN') {
    return '蜂鸟'
  } else {
    return ''
  }
}

/**
 * 格式化物流公司
 */
export const filtTrackingCompany = (val: string): string => {
  if (val === 'KUAIFUWU') {
    return '快服务'
  } else if (val === 'SHUNFENG') {
    return '顺丰'
  } else if (val === 'SHENTONG') {
    return '申通'
  } else if (val === 'YUANTONG') {
    return '圆通'
  } else if (val === 'ZHONGTONG') {
    return '中通'
  } else if (val === 'HUITONGKUAIDI') {
    return '汇通快递'
  } else if (val === 'YUNDA') {
    return '韵达'
  } else if (val === 'ZHAIJISONG') {
    return '宅急送'
  } else if (val === 'DEBANGWULIU') {
    return '德邦物流'
  } else if (val === 'OTHER') {
    return '其他'
  } else {
    return '其他'
  }
}

/**
 * 转换为整数
 */
export const filtInt = (value: number | string): number => {
  if (Number(value) >= 0) {
    return parseInt(String(value)) // 处理为整数
  } else {
    return 0
  }
}

/**
 * 格式化手机号（带空格）
 */
export const formatMobile = (phoneNumber: string): string => {
  let tel = phoneNumber
  if (isPhone(tel)) {
    tel = tel.substring(0, 3) + ' ' + tel.substring(3, 7) + ' ' + tel.substring(7, 11)
  }
  return tel

  // 判断是否是手机号码格式
  function isPhone(str: string): boolean {
    const reg = /^1(3|4|5|6|7|8|9)\d{9}$/g
    return reg.test(str)
  }
}

/**
 * 保留两位小数
 */
export const toFix = (value: number | string | null): string => {
  if (value != null && value !== '' && Number(value) >= 0) {
    return parseFloat(String(value)).toFixed(2) // 此处2为保留两位小数
  } else {
    return '0'
  }
}

/**
 * 计算商品行数
 */
export const calcGoodsStyle = (value: number, num: number): number => {
  return Math.ceil(value / num)
}

/**
 * px转rpx
 */
export const pxToRpx = (px: number | string): number => {
  return (750 * parseFloat(String(px))) / 375
}

/**
 * rpx转px
 */
export const rpxToPx = (rpx: number | string): number => {
  const systemInfo = uni.getSystemInfoSync()
  const screenWidth = systemInfo.screenWidth || 375
  return (screenWidth * parseFloat(String(rpx))) / 750
}

/**
 * 获取样式
 */
export const getStyle = (selectedTopicIds: string[], itemId: string, themeColor: string): string => {
  return selectedTopicIds.indexOf(itemId) > -1
    ? 'color:' + themeColor + ';border-color:' + themeColor
    : ''
}

/**
 * 判断是否选中
 */
export const isChecked = (selectedTopicIds: string[], itemId: string): boolean => {
  return selectedTopicIds.indexOf(itemId) > -1
}

/**
 * 过滤时间格式
 */
export const filterTime = (dateTime: string): string => {
  return dateTime.split(' ')[0]
}

/**
 * 格式化分类名称
 */
export const filterCategoryName = (val: string): string => {
  if (val.length > 4) {
    return val.substring(0, 4)
  }
  return val
}

/**
 * 判断是否是视频
 */
export const isMp4 = (val: string): boolean => {
  if (val.indexOf('.mp4') > -1) {
    return true
  } else {
    return false
  }
}

