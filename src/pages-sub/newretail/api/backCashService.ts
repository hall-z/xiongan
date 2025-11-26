import request from './request'
import utils from '@/utils/newretail/utils'

export const BackCashService = {
  /**
   * 查询提现账户详情信息
   */
  queryBackCashAccountDetails: (): Promise<any> => {
    return request.get('/newretail/api/mbr/backCashDetails/queryBackCashAccountDetails')
  },

  /**
   * 分页查询提现明细信息
   */
  query: (page: number, pageSize: number, memberIdEquals?: string, memberMobileEquals?: string, searchCount?: boolean): Promise<any> => {
    return request.get('/newretail/api/distribution/withdraw/apply/query', {
      page,
      pageSize,
      memberIdEquals,
      memberMobileEquals,
      searchCount,
    })
  },

  /**
   * 新建提现单
   */
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/distribution/withdraw/apply/create', postData)
  },

  /**
   * 查询会员导购任务
   */
  getTask: (memberId: string): Promise<any> => {
    return request.get('/newretail/api/mbr/backCashAccount/getTask', { memberId })
  },

  /**
   * 创建导购员申请单
   */
  createApply: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/backCashAccount/apply/create', postData)
  },

  /**
   * 提交信息并成为导购员
   */
  submit: (memberId: string): Promise<any> => {
    return request.put(`/newretail/api/mbr/backCashAccount/submit?memberId=${memberId}`)
  },

  /**
   * 检查会员是否为导购员
   */
  memberIsGuide: (memberId: string): Promise<any> => {
    return request.get('/newretail/api/mbr/backCashAccount/isAccount', { memberId })
  },

  /**
   * 新建提现单V2
   */
  createCashoutOrder: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/backCashRequisition/create', postData)
  }
}

export default BackCashService