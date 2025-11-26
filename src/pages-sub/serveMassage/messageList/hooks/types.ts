export interface messProps {
  [x: string]: string
  articleId: string
  articleTitle: string
  articleType: string
  articleImg: string
  articleContent: string
  status: string
  delFlag: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  remark: string
  islink?: boolean // 是否跳转
  path?: string // 跳转路径
  type?: 'webView' | 'article' | 'router' // 跳转类型
  data?: any // 额外数据
}
