import request from './request'

export const CommentService = {
  /**
   * 分页查询商品评论
   */
  query: (postData: any): Promise<any> => {
    return request.get('/newretail/api/mall/product/comment/query', postData)
  },

  /**
   * 添加商品评论
   */
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/mall/product/comment/create', postData)
  }
}

export default CommentService