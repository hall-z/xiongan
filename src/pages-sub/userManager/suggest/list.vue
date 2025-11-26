<route lang="json5">
{
  layout: 'default',
  realNameAuthentication: true,
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
import { removeT, routeTo } from '@/utils'

import useSuggest from './utils/useSuggest'

const { sendAdvicelist, advicelist, checkStatus, checkType } = useSuggest()
function toSuggest() {
  routeTo({ url: '/pages-sub/userManager/suggest/suggest' })
}

function toDetil(item) {
  routeTo({
    url: '/pages-sub/userManager/suggest/suggestDetil',
    data: { id: item.feedbackId },
  })
}
const paging = ref(null)
const dataList = ref([])
const queryList = async (pageNo, pageSize) => {
  const params = {
    page: pageNo,
    size: pageSize,
  }
  // 调用接口获取数据
  try {
    await sendAdvicelist(params)
    paging.value.complete(advicelist.value.content)
  } catch (error) {
    paging.value.complete(false)
  }
}
onShow(() => {
  paging.value && paging.value.reload()
})
</script>
<template>
  <view class="size-100% fixed top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1] dy-blue-bg"></view>
  <z-paging ref="paging" v-model="dataList" @query="queryList" :auto-show-system-loading="true">
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="投诉与建议" left isNavShow color="#000"></dy-navbar>
    </template>
    <view class="px-15px pt-10px box-border dy-blue-bg2">
      <view
        class="w-full px-19px py-16px box-border pos-relative bg-white rounded-5px mb-13px"
        v-for="item in dataList"
        :key="item.id"
        @click="toDetil(item)"
      >
        <view class="mb-5px">
          <wd-text text="反馈类型：" size="16px" color="#000000" bold></wd-text>
          <wd-text :text="checkType(item.feedbackType)" size="16px" color="#000000" bold></wd-text>
        </view>
        <wd-text :text="removeT(item.createTime)" color="#999999" size="14px"></wd-text>
        <view
          :style="checkStatus(item, 'style')"
          class="pos-absolute pos-right-none pos-top-none w-76px line-height-32px pl-20px box-border color-#4EA833 font-size-14px bg-#F0F9ED brge"
        >
          {{ checkStatus(item, 'text') }}
        </view>
      </view>
      <!-- <Sug-Item :dataList="dataList" @deitl="toDetil" /> -->
    </view>
    <template #bottom>
      <!-- 底部 -->
      <view class="px-35px py-21px box-border bg-#fff">
        <wd-button block :round="false" @click="toSuggest" custom-class="bg-#2D69EF">我要反馈</wd-button>
      </view>
    </template>
  </z-paging>
</template>

<style lang="scss" scoped>
:deep(.z-paging-content) {
  background: linear-gradient(180deg, #d6eafe 0%, #f3f4f6 40%, #f2f3f7 100%) !important;
}
.brge {
  border-radius: 0px 5px 0px 25px;
}
</style>
