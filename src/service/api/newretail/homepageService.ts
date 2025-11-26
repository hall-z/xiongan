import request from './request'

export const HomepageService = {
  /**
   * 获取首页功能入口图片列表
   * @param type JIN_GANG, UNDER_MENU
   */
  query: (type: string): Promise<any> => {
    return request.get('/newretail/api/mall/homeFunctionImage/query', { type })
  },

  /**
   * 获取首页会员展示信息
   */
  queryMemberInfo: (): Promise<any> => {
    return request.get('/newretail/api/mall/homeMemberInfo/querymember')
  },

  /**
   * 获取会员中心菜单
   */
  queryMbrMenu: (): Promise<any> => {
    return request.get('/newretail/api/mall/memberCenterMenu/query')
  }
}

export default HomepageService