import { getMessageList, getSpecialTypeList } from '@/service/api/source'
import { routeTo } from '@/utils'
import { useRequest } from 'alova/client'
import { bannerProps, messProps } from './types'

import { getThirdPartyId } from '@/service/api/auth'
import { getActivityList } from '@/service/api/shop'
import { getUserLoginInfo } from '@/service/api/userMessage'
import { List } from '@/service/model/baseModel'
import jtcx from '@/static/images/index/jtcx.png'
import kfw from '@/static/images/index/kfw.png'
import mfw from '@/static/images/index/mfw.png'
import saoyisao from '@/static/images/index/saoyisao.png'

import chunk from 'lodash/chunk'
import groupBy from 'lodash/groupBy'

const topAction = ref([
  {
    icon: 'https://oss.xay.xacloudy.cn/images/2025-09/fdc16837-62b5-4ff2-b2d4-f99e92d71c391.png',
    text: '社保卡有效期查询',
    type: 'router',
    path: '/pages-sub/serveMain/lifespanInfo?title=社保卡有效期', // 打开的页面路径，如果为空则打开首页
  },
  {
    icon: 'https://oss.xay.xacloudy.cn/images/2025-09/f13a119e-b18a-460d-aa2b-df4ca935cd642.png',
    text: '社保待遇资格认证',
    type: 'router',
    path: '/pages-sub/serveMain/socCertInfo?title=资格认证', // 打开的页面路径，如果为空则打开首页
  },

  {
    icon: 'https://oss.xay.xacloudy.cn/images/2025-09/15aadfe7-e7e8-463d-8f81-4e60cde551233.png',
    text: '一码办事',
    type: 'router',
    path: '/pages-sub/userManager/codeServe/index',
  },
  {
    icon: 'https://oss.xay.xacloudy.cn/images/2025-09/d84ba09e-9b76-4751-a02a-cf62e2dbcb32sbkbuk.png',
    text: '社保卡补换',
    // type: 'sacn',
    type: 'router',
    path: '/pages-sub/serveMain/cardApplyType?base=shebaokbh&title=社保卡补换',
  },

  // {
  //   icon: jtcx,
  //   text: '公交出行',
  //   type: 'router',
  //   path: '/pages-sub/userManager/transit/index', // 打开的页面路径，如果为空则打开首页
  // },
  // {
  //   icon: xajft,
  //   text: '生活缴费',
  //   type: 'wxChart',
  //   appId: 'wx0f343dd3b89d6f07', // 填入目标小程序的 appId
  //   path: 'pages/index/index',
  // },
  // {
  //   icon: xabc,
  //   text: '停车缴费',
  //   type: 'wxChart',
  //   appId: 'wx6d1780b8d016147c', // 填入目标小程序的 appId
  //   path: 'pages/index/index', // 打开的页面路径，如果为空则打开首页
  // },
  // {
  //   icon: kfw,
  //   text: '社保卡服务',
  //   type: 'switchTab',
  //   path: '/pages/serve/index',
  //   active: 0,
  // },
  // {
  //   icon: dzsbk,
  //   text: '电子社保卡',
  //   type: 'router',
  //   path: '/pages-sub/userManager/SocialSecurityCard/indexback',
  // },

  // {
  //   icon: saoyisao,
  //   text: '扫一扫',
  //   type: 'sacn',
  // },
  // {
  //   icon: mfw,
  //   text: '一码办事',
  //   type: 'router',
  //   path: '/pages-sub/userManager/codeServe/index',
  // },
  // {
  //   icon: jtcx,
  //   text: '公交出行',
  //   type: 'router',
  //   path: '/pages-sub/serveMassage/jiaotong/index',
  // },
])

const bannerUrl = 'https://oss.xay.xacloudy.cn'
const swiperList = ref<bannerProps[]>([
  {
    id: '1',
    path: '/pages-sub/serveMain/cardApplyType',
    title: '社保卡申领',
    description: '',
    islink: true,
    image:
      bannerUrl +
      '/images/2024-09/cd5ea186-5790-4381-af88-e885ba51368c1725327394702-c3cb364e-544b-41d4-97d2-1c4daf1f4b7e.png',
    type: 'router',
    data: { base: 'shebaoksl', title: '社保卡申领' },
  },
  {
    id: '1710488285782016007',
    path: '/pages-sub/webView/index',
    title: 'title1',
    description: '',
    islink: true,
    image:
      bannerUrl +
      '/images/2024-09/6e17d89a-f218-4cba-a2b2-22849173a2381725172128186-2ab9df4e-54db-4228-ab3a-f93f5a9c7f59.png',
    type: 'article',
  },
  {
    id: '1710488285782016008',
    path: '/pages-sub/webView/index',
    title: 'title1',
    description: '',
    islink: true,
    image:
      bannerUrl +
      '/images/2024-09/741122e4-fb69-4ec6-8d11-b86894bfc4a81725172156390-21e78f8b-2791-4cc1-b8ff-1b01c015058e.png',
    type: 'article',
  },
])
const serviceArea = ref([
  {
    title: '政务服务',
    icon: '',
    bgcolor: 'linear-gradient( 180deg, #FFE8E8 0%, #FFCCCC 100%);',
    iconbg: '#D84D4C',
    path: '/pages-sub/serveMassage/zhwuServe/index',
    id: '1710488285782016016',
    iconImg:
      'https://oss.xay.xacloudy.cn/images/2025-03/c97ad5fc-d467-4d11-950b-7c49d3448745iconImg1.png',
  },
  // {
  //   title: '交通出行',
  //   icon: jiaotongchuxing,
  //   bgcolor: 'linear-gradient( 180deg, #F2FBF8 0%, #E6F8F0 100%);',
  //   iconbg: '#78CEA8',
  //   path: '/pages-sub/serveMassage/jiaotong/index',
  //   id: '1710488285782016010',
  //   height: 10,
  //   width: 33,
  //   bgimg:
  //     'https://oss.xay.xacloudy.cn/images/2024-10/368b8902-aba2-4378-8f0c-fb8a1007c00c交通出行.png',
  //   texticon:
  //     'https://oss.xay.xacloudy.cn/images/2024-10/0b6d3a43-0825-4787-ab18-a901169cb3f42.png',
  //   stext: 'TRAFFIC',
  // },
  {
    title: '就医购药',
    icon: '',
    bgcolor: 'linear-gradient( 180deg, #D1F2FF 0%, #E2F1FF 100%);',
    iconbg: '#46ABFF',
    path: '/pages-sub/serveMassage/yiyao/index',
    id: '1710488285782016013',
    iconImg:
      'https://oss.xay.xacloudy.cn/images/2025-03/807afd49-53b9-4528-ba96-68337b092963iconImg6.png',
  },
  {
    title: '旅游观光',
    icon: '',
    bgcolor: 'linear-gradient( 180deg, #FEEEEF 0%, #FDC9C9 100%);',
    iconbg: '#F24848',
    path: '/pages-sub/serveMassage/travel/index',
    id: '1710488285782016014',
    height: 10,
    width: 33,
    iconImg:
      'https://oss.xay.xacloudy.cn/images/2025-03/46ef779d-ad78-420a-a7d9-ac0e4af1cb23lygg.jpg',
  },

  {
    title: '文化体验',
    icon: '',
    bgcolor: 'linear-gradient( 180deg, #EFF4FE 0%, #CAE4FD 100%);',
    iconbg: '#2994FF',
    path: '/pages-sub/serveMassage/wenhuaServe/index',
    id: '1710488285782016015',
    iconImg:
      'https://oss.xay.xacloudy.cn/images/2025-03/cbb7613a-6e63-4c58-9a35-3fd60676f307iconImg4.png',
  },

  // {
  //   title: '惠民服务',
  //   icon: jinrongruwu,
  //   bgcolor: 'linear-gradient( 180deg, #FEFCF1 0%, #FFEA98 100%);',
  //   iconbg: '#F1C63A',
  //   path: '/pages-sub/serveMassage/huimingServe/index',
  //   id: '1710488285782016011',
  //   height: 10,
  //   width: 33,
  //   texticon:
  //     'https://oss.xay.xacloudy.cn/images/2024-10/a91456af-74e2-4261-818a-e1561e1959315.png',
  //   bgimg:
  //     'https://oss.xay.xacloudy.cn/images/2024-10/0b560526-9f44-4431-9d66-d6a31d5473d2惠民服务.png',
  //   stext: 'HUIMIN SERVICE',
  // },

  {
    title: '待遇发放',
    icon: '',
    bgcolor: 'linear-gradient( 180deg, #FEFCF4 0%, #FFE3CE 100%);',
    iconbg: '#FC9559',
    path: '/pages-sub/webView/index',
    id: '1710488285782016009',
    iconImg:
      'https://oss.xay.xacloudy.cn/images/2025-03/a9243781-0914-4036-8b60-523eac3098c7iconImg3.png',
  },
  {
    title: '京雄互通',
    icon: '',
    bgcolor: 'linear-gradient( 180deg, #D8DAFF 0%, #DDE0FA 100%);',
    iconbg: '#5339FF',
    path: '/pages-sub/webView/index',
    id: '1710488285782016012',
    iconImg:
      'https://oss.xay.xacloudy.cn/images/2025-03/0b08891f-3faf-49bb-b79c-3124a686da1ficonImg2.png',
  },
  {
    title: '儿童友好公益践学专区',
    icon: '',
    bgcolor: 'linear-gradient( 180deg, #FEEEEF 0%, #FDC9C9 100%);',
    iconbg: '#F24848',
    path: '/pages-sub/serveMassage/StudentTravel/index',
    id: '1710488285782016014',
    height: 10,
    width: 100,
    iconImg:
      'https://oss.xay.xacloudy.cn/images/2025-08/f873ff5d-9556-493d-8452-a49e11e2b4e5%E7%BB%84%2046070@2x.png',
  },
])

// 轮播图
const {
  send: sendSwiperList,
  data: swiperListData,
  loading: swiperListLoading,
} = useRequest((data) => getActivityList<List>(data), {
  immediate: false,
  loading: true,
  initialData: [] as List[],
})

// 文章列表
const {
  send: sendMessageList,
  data: messageData,
  onSuccess: messageSucess,
  loading: messageLoading,
} = useRequest((data) => getMessageList<List>(data), {
  immediate: false,
  loading: false,
  initialData: [],
})

function messageClick(item: messProps) {
  routeTo({
    url: '/pages-sub/webView/index',
    data: {
      type: item.articleId,
      showType: item.linkType === '1' ? 'webView' : '',
      url: item.linkUrl,
    },
  })
}

interface centerList {
  position: number
  list: List[]
  top: List[]
  center: List[]
}
const bglist = [
  'https://oss.xay.xacloudy.cn/images/2025-09/19c16342-af56-49da-9dfd-7da92455ff33bg2.png',

  'https://oss.xay.xacloudy.cn/images/2025-09/999c3d9d-413d-4066-9417-d67475c224bcbg3.png',

  'https://oss.xay.xacloudy.cn/images/2025-09/f11da3c2-451f-41a1-9b44-8742c74086bcbg4.png',

  'https://oss.xay.xacloudy.cn/images/2025-09/a03c52b6-4cf3-48e7-9669-1f4486e4be0cbg5.png',
  'https://oss.xay.xacloudy.cn/images/2025-09/2d05ed4d-e9f9-4c27-b99e-7c2931f71478bg1.png',

  'https://oss.xay.xacloudy.cn/images/2025-09/39e9d056-0738-4cde-aa5b-7b7694503135bg6.png',
]
const {
  send: sendGetSpecialTypeList,
  data: specialTypeList,
  loading: specialTypeLoading,
} = useRequest((params?: any) => getSpecialTypeList<centerList>(params), {
  immediate: false,
  loading: false,
  initialData: [],
  async middleware(ctx, next) {
    const result = await next()
    const nList = groupBy(result, 'position')
    const json = {
      top: nList[1],
      center: chunk(nList[2], 8),
      bottom: chunk(nList[3], 8),
    }
    return json as any
  },
})
const specialTypeskeleton = ref([
  [
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
    { width: '48px', height: '48px' },
  ],
  [
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
    { width: '48px', height: '16px' },
  ],
])

const rmfwList = ref([
  {
    title: '社保卡补挂',
    icon: 'https://oss.xay.xacloudy.cn/images/2025-02/d30945e4-4377-40a2-b3bd-a0cf72c3a018WechatIMG23486.jpg',
    path: '/pages-sub/serveMain/cardFromType',
    data: { base: 'cardLoss', title: '社保卡挂失' },
  },
  {
    title: '制卡进度查询',
    icon: 'https://oss.xay.xacloudy.cn/images/2025-02/750ff8e9-8407-449c-b07a-01be4ee7a140WechatIMG23484.jpg',
    path: '/pages-sub/serveMain/cardFromType',
    data: { base: 'kajindu', title: '制卡进度查询' },
  },
  {
    title: '智慧食堂',
    icon: 'https://oss.xay.xacloudy.cn/images/2025-02/f2fce668-3e03-4ea0-a6ef-7a6ae7222480WechatIMG23485.jpg',
    path: '/pages-sub/userManager/smartCanteen/index',
  },
  {
    title: '基础信息查询',
    icon: 'https://oss.xay.xacloudy.cn/images/2025-02/09148c55-51df-4932-b08f-427d0abc0049WechatIMG23483.jpg',
    path: '/pages-sub/serveMain/cardMessType',
    data: { base: 'cardBaseInfo', title: '基础信息查询' },
  },
])

// 获取第三方ID
const {
  send: sendGetThirdPartyId,
  data: thirdPartyId,
  loading: thirdPartyIdLoading,
} = useRequest((params?: any) => getThirdPartyId(params), {
  immediate: false,
})
const { send: sedUserInfo, data: userInfoData } = useRequest(() => getUserLoginInfo(), {
  immediate: false,
  loading: false,
})
export default () => {
  return {
    messageData,
    messageClick,
    sendMessageList,
    messageLoading,
    swiperList,
    serviceArea,
    topAction,

    sendGetSpecialTypeList,
    specialTypeList,
    specialTypeLoading,
    specialTypeskeleton,
    sendSwiperList,
    swiperListData,
    swiperListLoading,
    rmfwList,
    sendGetThirdPartyId,
    thirdPartyId,
    thirdPartyIdLoading,
    bglist,
    sedUserInfo,
    userInfoData,
  }
}
