import request from './request'

export const FeedbackService = {
  /**
   * 创建意见反馈
   * @param postData 反馈数据
   */
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mbr/feedback/create', postData)
  }
}

export default FeedbackService