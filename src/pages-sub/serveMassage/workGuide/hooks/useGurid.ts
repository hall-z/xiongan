import { getMessageList } from '@/service/api/source'
import { List } from '@/service/model/baseModel'
import { routeTo } from '@/utils'
import { useRequest } from 'alova/client'
// 消息列表
const { send: sendMessageList, data: messageData } = useRequest(
  (data) => getMessageList<List>(data),
  {
    immediate: false,
    loading: false,
  },
)

function messageClick(item) {
  routeTo({
    url: '/pages-sub/webView/index',
    data: {
      type: item.articleId,
      showType: item.linkType === '1' ? 'webView' : '',
      url: item.linkUrl,
    },
  })
}
export default () => {
  return { sendMessageList, messageData, messageClick }
}
