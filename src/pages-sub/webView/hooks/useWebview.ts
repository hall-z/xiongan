import { gethdShophddetail } from '@/service/api/shop'
import { getArtacleDetail, getDetailUpdateRead, setMessageRead } from '@/service/api/source'
import { useRequest } from 'alova/client'
const content = ref('')
const articleTitle = ref('')
const createTime = ref('')

const {
  send: sedAarData,
  loading: Loading,
  data: ArticleData,
} = useRequest((data) => getArtacleDetail(data), {
  immediate: false,
  loading: false,
})

// 获取活动详情
const { send: getbanner, data: bannerDaata } = useRequest(
  (data: ActivityParams) => gethdShophddetail(data),
  {
    immediate: false,
    loading: false,
  },
)
// 获取消息详情

const {
  send: sendDetailUpdateRead,
  data: ReadData,
  loading: DetailUpdateReadDataLoadng,
} = useRequest((data) => getDetailUpdateRead(data), {
  immediate: false,
  loading: false,
  initialData: {},
})

const { send: sendMessageRead } = useRequest((data) => setMessageRead(data), {
  immediate: false,
  loading: false,
  initialData: {},
})

export default () => {
  return {
    content,
    sedAarData,
    Loading,
    articleTitle,
    createTime,
    getbanner,
    sendDetailUpdateRead,
    ReadData,
    ArticleData,
    bannerDaata,
    sendMessageRead,
  }
}
