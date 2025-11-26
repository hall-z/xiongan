<route lang="json5">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
      showBackButton: 'false',
    },
  },
}
</route>

<script lang="ts" setup>
import { removeT } from '@/utils'

import useMymessage from './utils/useMymessage'

const { sendHistoryPageByUserId, histotyMessDataLoadng, histotyMessData, messageClick } =
  useMymessage()

defineOptions({
  name: 'messageList',
})

const tab = ref(2)
const tablist = ref([
  {
    index: 0,
    title: '全部',
  },
  {
    index: 0,
    title: '系统消息',
  },
  {
    index: 1000,
    title: '服务通知',
  },
])
const paging = ref(null)

const dataList = ref()
const queryList = async (pageNo, pageSize) => {
  const data = {
    page: pageNo,
    size: pageSize,
    classify: '1',
  }
  // 调用接口获取数据
  try {
    await sendHistoryPageByUserId(data)
    paging.value.complete(histotyMessData.value.content)
  } catch (error) {
    paging.value.complete(false)
  }
}
const changeTab = (e) => {
  tab.value = e.index
  paging.value.reload()
}
const removeHtmlStyle = (html) => {
  const relStyle = /style\s*?=\s*?(['"])[\s\S]*?\1/g
  const relTag = /<.+?>/g
  const relClass = /class\s*?=\s*?(['"])[\s\S]*?\1/g
  let newHtml = ''
  if (html) {
    newHtml = html.replace(relStyle, '')
    newHtml = newHtml.replace(relTag, '')
    newHtml = newHtml.replace(relClass, '')
  }
  return newHtml
}
onShow(() => {
  paging.value && paging.value.reload()
})
</script>
<template>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    :auto-show-system-loading="true"
    class="bg-#f3f4f6"
  >
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="消息列表" left></dy-navbar>
      <!-- <wd-tabs v-model="tab" @change="changeTab">
             <block v-for="item in tablist" :key="item.index">
               <wd-tab :title="item.title"></wd-tab>
             </block>
           </wd-tabs>
           <wd-gap height="5" bg-color="#f5f5f5"></wd-gap> -->
    </template>

    <!-- leibiao  -->
    <view v-for="(item, index) in dataList" :key="index" class="px-15px">
      <view class="text-14px color-#999999 py-10px text-center mt-10px">
        {{ removeT(item.sendTime) }}
      </view>
      <view class="rounded-10px overflow-hidden">
        <wd-cell-group use-slot clickable border>
          <template #title>
            <view class="relative" @click="messageClick(item)">
              <view>
                <text class="ml-5px truncate-1">{{ item.title }}</text>
              </view>
              <view
                class="w-10px h-10px rounded-100 absolute top-[-2px] left-[-5px] bg-#E81010"
                v-if="item.isRead !== '1'"
              ></view>
            </view>
          </template>
          <template #value>
            <wd-icon
              name="arrow-right"
              size="12px"
              color="#BEBEBE"
              @click="messageClick(item)"
            ></wd-icon>
          </template>
          <wd-cell clickable title-width="100%" @click="messageClick(item)">
            <template #label>
              <view class="truncate-5 color-#333">{{ removeHtmlStyle(item.content) }}</view>
              <!-- 模版判断 -->
              <!-- <view class="truncate-5 color-#333" v-if="item.type == 0">{{ item.center }}</view> -->
              <!-- TODO:暂时注释第二个模板 -->
              <!-- <view class="truncate-5 px-10px" v-if="item.type == 1">
                <view class="flex items-center gap-10px" v-for="(i, idx) in item.data" :key="idx">
                  <view class="color-#999 py-5px max-w-80px truncate-1">{{ i.label }}</view>
                  <view class="color-#000 py-5px truncate-1 flex-1">{{ i.value }}</view>
                </view>
              </view> -->
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped></style>
