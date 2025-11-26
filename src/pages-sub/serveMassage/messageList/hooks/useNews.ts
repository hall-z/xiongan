import { getMessageList } from '@/service/api/source'
import { List } from '@/service/model/baseModel'
import { routeTo } from '@/utils'
import { useRequest } from 'alova/client'
// 消息列表

// 消息列表
const {
  send: sendMessageList,
  data: messageData,
  onSuccess: messageSucess,
} = useRequest((data) => getMessageList<List>(data), {
  immediate: false,
  loading: false,
  initialData: [],
})

function messageClick(item) {
  routeTo({
    url: '/pages-sub/webView/index',
    data: { type: item.articleId, status: item.readStatus },
  })
}
export default () => {
  return { sendMessageList, messageData, messageClick }
}
