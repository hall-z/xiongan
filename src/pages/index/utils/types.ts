interface bannerProps {
  id: string
  path: string
  title: string
  description?: string
  islink: boolean
  image: string
  type: 'webView' | 'article' | 'router'
  data?: any
}

interface messProps {
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
  linkType?: '0' | '1' // 0:内部链接 1:外部链接
  linkUrl?: string // 外部链接
}

export type { bannerProps, messProps }
