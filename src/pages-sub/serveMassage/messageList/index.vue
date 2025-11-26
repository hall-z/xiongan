<route lang="json5">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
    },
  },
}
</route>

<script lang="ts" setup>
import { removeT } from '@/utils'
import { messProps } from './hooks/types'
import useNews from './hooks/useNews'

const { sendMessageList, messageClick, messageData } = useNews()

defineOptions({
  name: 'messageList',
})

const articleTitle = ref('')

const tab = ref(0)
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

const dataList = ref<messProps[]>()

const handleChange = () => {
  paging.value.reload()
}
const queryList = async (pageNo, pageSize) => {
  const data = {
    page: pageNo,
    size: pageSize,
    articleTitle: articleTitle.value,
    articleType: 0, // tablist.value[tab.value].index,
  }
  // 调用接口获取数据
  try {
    await sendMessageList(data)
    const regex = /<[^>]+>/g
    messageData.value.content.forEach((it) => {
      it.articleContent = it.articleContent.replace(regex, '')
      it.createTime = formatTime(removeT(it.updateTime || it.createTime))
    })
    paging.value.complete(messageData.value.content)
  } catch (error) {
    paging.value.complete(false)
  }
}
const formatTime = (time) => {
  const arr = time.split(' ')
  const arr1 = arr[0].split('-')
  arr1.splice(1, 0, '年')
  arr1.splice(3, 0, '月')
  arr1.splice(5, 0, '月')
  return arr1.join('') + ' ' + arr[1]
}
const searchchange = ({ value }) => {
  if (value === '') {
    handleChange()
  }
}
</script>
<template>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    :auto-show-system-loading="true"
    :paging-style="{
      padding: '0px',
      boxSizing: 'border-box',
      background: '#fff',
    }"
  >
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="公告列表" left></dy-navbar>
      <!--      <wd-tabs v-model="tab" @change="changeTab">-->
      <!--        <block v-for="item in tablist" :key="item.index">-->
      <!--          <wd-tab :title="item.title"></wd-tab>-->
      <!--        </block>-->
      <!--      </wd-tabs>-->
      <!--      <wd-gap height="5" bg-color="#f5f5f5"></wd-gap>-->
    </template>
    <view style="padding: 15px">
      <wd-input
        no-border
        v-model.trim="articleTitle"
        prefix-icon="search"
        custom-class="searchBox"
        placeholder="请输入搜索关键词"
        @input="searchchange"
      >
        <template #suffix>
          <view class="searchBtn" @click="handleChange">搜索</view>
        </template>
      </wd-input>
    </view>
    <!-- leibiao  -->
    <view
      v-for="(item, index) in dataList"
      :key="index"
      class="mb-15px box-border rounded-10px bg-white px-15px"
    >
      <view v-if="index == 0">
        <view
          style="
            height: auto;
            margin-bottom: 20px;
            overflow: hidden;
            font-size: 0;
            border-radius: 6px;
          "
          @click="messageClick(item)"
        >
          <wd-img custom-class="imgbg" width="100%" height="150px" :src="item.articleImg" />

          <view
            class="infoBox"
            style="height: 40px; padding: 0 10px; line-height: 40px; background: #f5f5f5"
          >
            <wd-text :text="item.articleTitle" :lines="1" size="16px" bold color="#000"></wd-text>
          </view>
        </view>
      </view>

      <view v-if="index > 0">
        <view class="FHcs" @click="messageClick(item)">
          <view
            class="FSsl F1"
            style="box-sizing: border-box; height: 80px; padding: 5px 10px 5px 0"
          >
            <wd-text
              class="break-all"
              :text="item.articleTitle"
              :lines="2"
              size="14px"
              color="#000"
            ></wd-text>
            <wd-text
              :text="'发布时间：' + item.createTime"
              :lines="1"
              size="12px"
              color="#B5B5B5"
            ></wd-text>
          </view>
          <wd-img
            custom-class="imgbg"
            width="120px"
            height="80px"
            :radius="4"
            :src="item.articleImg"
          />
        </view>
      </view>

      <!--      <view-->
      <!--        class="flex w-full p-13px box-border border-b-solid border-b-1px"-->
      <!--        style="border-color: rgba(112, 112, 112, 0.12)"-->
      <!--      >-->
      <!--        <wd-text :text="item.articleTitle" color="#333" bold :lines="1"></wd-text>-->
      <!--      </view>-->
      <!--      <view class="px-18px py-10px" @click="messageClick(item)">-->
      <!--        <wd-text :text="item.articleContent" :lines="3" color="#999999" size="14px"></wd-text>-->
      <!--      </view>-->
      <!--      <view class="pb-15px px-17px box-border">-->
      <!--        <wd-text color="#999999" text="发布日期：" size="12px"></wd-text>-->
      <!--        <wd-text :text="item.createTime" color="#999999" size="12px"></wd-text>-->
      <!--      </view>-->
    </view>
  </z-paging>
</template>
<style>
page {
  background-color: #f5f6f8;
}
</style>

<style lang="scss" scoped>
//.t_bg {
//  background: rgba($color: #ccc, $alpha: 0.2);
//}

:deep(.nav_bg) {
  background-color: var(--color-nav-bg);

  .wd-navbar__title {
    color: var(--color-nav-text);
  }

  .wd-navbar__left {
    color: var(--color-nav-text);
  }
}

:deep(.searchBox) {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 10px 0px 10px 10px;
  //margin-bottom: 20px;
  background: rgba(199, 199, 199, 0.18) !important;
  border: none;
  border-radius: 6px 6px 6px 6px;

  .wd-icon-search {
    background: transparent !important;
  }

  .searchBtn {
    height: 16px;
    padding: 0 15px;
    margin: 0;
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    border-left: 1px solid #000000;
  }
}

:deep(.imgbg) {
  background: #f5f5f5;
}
</style>
