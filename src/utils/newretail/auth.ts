/**
 * 用户认证和token管理工具
 * 用于持久化和获取access token
 */

import utils from './utils'

const KEY_ACCESS_TOKENS = "__access_tokens__"
const KEY_USER = "__user__"
const KEY_DISTRIBUTOR = "__distributor__"

interface Tokens {
  accessToken: string
  expiresTo: number
  refreshToken: string
  refreshExpiresTo: number
}

interface UserInfo {
  wxaUser: any
  member?: any
  accessToken?: string
  expiresIn?: number
  refreshToken?: string
  refreshExpiresIn?: number
}

interface DistributorInfo {
  status: string
  [key: string]: any
}

/**
 * 设置当前用户
 * @param loginUser 当前登录用户
 */
export const setUser = (loginUser: UserInfo): void => {
  // 保存当前用户
  uni.setStorageSync(KEY_USER, loginUser)
  // 同时保存access token
  setTokens(loginUser)
}

/**
 * 清除当前用户信息
 */
export const clearUserInfo = (): void => {
  try {
    uni.removeStorageSync(KEY_ACCESS_TOKENS)
    uni.removeStorageSync(KEY_USER)
  } catch (e) {
    console.error('清除用户信息失败', e)
  }
  
  const app = getApp()
  app.globalData.userInfo = null
}

/**
 * 取得当前用户
 */
export const getUser = (): UserInfo | null => {
  return uni.getStorageSync(KEY_USER) || null
}

/**
 * 保存access tokens
 * @param tokens token信息，传null表示清空access token
 */
export const setTokens = (tokens: UserInfo | null): void => {
  if (!tokens) {
    clearTokens()
    return
  }

  try {
    const tokenData: Tokens = {
      accessToken: tokens.accessToken || '',
      expiresTo: new Date().getTime() + (parseInt(tokens.expiresIn?.toString() || '0') * 1000),
      refreshToken: tokens.refreshToken || '',
      refreshExpiresTo: new Date().getTime() + (parseInt(tokens.refreshExpiresIn?.toString() || '0') * 1000)
    }
    uni.setStorageSync(KEY_ACCESS_TOKENS, tokenData)
  } catch (e) {
    console.error('保存token失败', e)
  }
}

/**
 * 清除access tokens
 */
export const clearTokens = (): void => {
  try {
    uni.removeStorageSync(KEY_ACCESS_TOKENS)
  } catch (e) {
    console.error('清除token失败', e)
  }
}

/**
 * 取得access tokens
 */
export const getTokens = (): Tokens | null => {
  return uni.getStorageSync(KEY_ACCESS_TOKENS) || null
}

/**
 * 设置当前分销员信息
 * @param distributor 当前登录用户分销员信息
 */
export const setDistributor = (distributor: DistributorInfo): void => {
  uni.setStorageSync(KEY_DISTRIBUTOR, distributor)
}

/**
 * 取得当前分销员信息
 */
export const getDistributor = async (): Promise<void> => {
  const app = getApp()
  if ((app as any).globalData.systemConfigure?.openDistribution) {
    try {
      const distributor = uni.getStorageSync(KEY_DISTRIBUTOR)
      if (distributor && distributor.status === "AUDITED") {
        ;(app as any).globalData.distributorInfo = distributor
      } else {
        if ((app as any).globalData.userInfo?.member) {
          // 动态导入distributionService
          const { distributionService } = await import('@/service/api/newretail/distributionService')
          distributionService.getDistributionUser().then((res: DistributorInfo) => {
            if (res) {
              if (res.status === "AUDITED") {
                ;(app as any).globalData.distributorInfo = res
              }
              setDistributor(res)
            }
          }).catch((err: Error) => {
            console.error('获取分销员信息失败', err.message)
          })
        }
      }
    } catch (error) {
      console.error('获取分销员信息异常', error)
    }
  }
}

/**
 * 绑定分销上下级关系
 */
export const bindDistribution = async (): Promise<void> => {
  const app = getApp()
  if ((app as any).globalData.systemConfigure?.openDistribution) {
    if ((app as any).globalData.userInfo?.member) {
      const { distributionService } = await import('@/service/api/newretail/distributionService')
      
      const shareId = (app as any).globalData.distributionAccountShareId
      if (!shareId) {
        console.log("分销员信息异常")
        return
      }
      
      const postData = {
        memberId: shareId
      }
      
      distributionService.bind(postData).then((res: any) => {
        console.log("绑定分销员上下级关系成功", res)
      }).catch((err: Error) => {
        console.error("绑定分销员上下级关系失败", err.message)
      })
    }
  }
}

export default {
  setUser,
  clearUserInfo,
  getUser,
  setTokens,
  clearTokens,
  getTokens,
  setDistributor,
  getDistributor,
  bindDistribution
}