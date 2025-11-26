import request from './request'

interface LikeParams {
  id: string
  isLike: boolean
  memberId: string
}

interface CommentParams {
  currentMemberId?: string
  recommendId?: string
  page?: number
  pageSize?: number
  [key: string]: any
}

export const RecommendService = {
  // 创建种草文章
  create: (postData: any): Promise<any> => {
    return request.post('/newretail/api/recommend/recommend/create', postData)
  },

  // 更新种草文章
  updata: (postData: any): Promise<any> => {
    return request.put('/newretail/api/recommend/recommend/modify', postData)
  },

  // 查询种草文章
  query: (postData: any): Promise<any> => {
    return request.post('/newretail/api/recommend/recommend/query', postData)
  },

  // 查询种草话题
  topicQuery: (postData: any): Promise<any> => {
    return request.post('/newretail/api/recommend/topic/query', postData)
  },

  // 获取会员发布文章的总获赞数
  totalLikes: (memberId: string): Promise<any> => {
    return request.get(`/newretail/api/recommend/recommend/member/totalLikes?memberId=${memberId}`)
  },

  // 获取会员发布的种草文章数量
  articleCount: (memberId: string): Promise<any> => {
    return request.get(`/newretail/api/recommend/recommend/member/articleCount?memberId=${memberId}`)
  },

  // 文章点赞/取消点赞
  like: (params: LikeParams): Promise<any> => {
    return request.put(`/newretail/api/recommend/recommend/like?id=${params.id}&isLike=${params.isLike}&memberId=${params.memberId}`)
  },

  // 查询种草详情
  recommendDetails: (params: any): Promise<any> => {
    return request.get(`/newretail/api/recommend/recommend/getById`, params)
  },

  // 查询文章评论数量
  totalComment: (currentMemberId: string, recommendId: string): Promise<any> => {
    return request.get(`/newretail/api/recommend/comment/totalComment?currentMemberId=${currentMemberId}&recommendId=${recommendId}`)
  },

  // 查询文章点赞数
  totalLike: (recommendId: string): Promise<any> => {
    return request.get(`/newretail/api/recommend/like/count?recommendId=${recommendId}`)
  },

  // 关注/取消关注作者
  action: (isSubscribe: boolean, memberId: string, subscriptionId: string): Promise<any> => {
    return request.post(`/newretail/api/recommend/subscribe/action?isSubscribe=${isSubscribe}&memberId=${memberId}&subscriptionId=${subscriptionId}`)
  },

  // 检查是否关注作者
  check: (memberId: string, subscriptionId: string): Promise<any> => {
    return request.get(`/newretail/api/recommend/subscribe/check?memberId=${memberId}&subscriptionId=${subscriptionId}`)
  },

  // 获取用户最近购买的商品
  getPurchasedProducts: (memberId: string, productName: string): Promise<any> => {
    return request.get(`/newretail/api/mall/order/getPurchasedProducts?memberId=${memberId}&productName=${productName}`)
  },

  // 分页查询一级评论
  firstLevel: (currentMemberId: string, recommendId: string, page: number, pageSize: number): Promise<any> => {
    return request.get(`/newretail/api/recommend/comment/first-level?currentMemberId=${currentMemberId}&recommendId=${recommendId}&page=${page}&pageSize=${pageSize}`)
  },

  // 分页查询二级评论
  secondLevel: (params: any): Promise<any> => {
    return request.post(`/newretail/api/recommend/comment/second-level`, params)
  },

  // 创建评论
  createComment: (params: any): Promise<any> => {
    return request.post(`/newretail/api/recommend/comment/create`, params)
  },

  // 评论点赞/取消点赞
  likeComment: (recommendCommentId: string, recommendId: string, isLike: boolean, memberId: string): Promise<any> => {
    return request.put(`/newretail/api/recommend/comment/like?recommendCommentId=${recommendCommentId}&recommendId=${recommendId}&isLike=${isLike}&memberId=${memberId}`)
  },

  // 分页查询商品列表
  queryProduct: (keywordLikes: string, page: number = 1, pageSize: number = 15): Promise<any> => {
    const params = {
      keywordLikes,
      includeChild: true,
      page,
      pageSize,
      searchCount: true
    }
    return request.get('/newretail/api/mall/product/query', params)
  },

  // 删除文章
  remove: (id: string): Promise<any> => {
    return request.delete(`/newretail/api/recommend/recommend/remove?id=${id}`)
  },

  // 删除评论
  removeComment: (id: string): Promise<any> => {
    return request.delete(`/newretail/api/recommend/comment/remove?id=${id}`)
  }
}

export default RecommendService