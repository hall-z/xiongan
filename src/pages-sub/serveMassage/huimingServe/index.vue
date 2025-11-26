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
import { routeTo } from '@/utils'

import { getActivityList } from '@/service/api/shop'
import { List } from '@/service/model/baseModel'
import { useRequest } from 'alova/client'
import { useToast } from 'wot-design-uni'
import bgimg from '../static/images/huiming/bgimg.png'
import title from '../static/images/huiming/title.png'
const toast = useToast()

function toSuggest() {
  routeTo({ url: '/pages-sub/userManager/suggest/suggest' })
}

function toDetil(item) {
  routeTo({
    url: '/pages-sub/userManager/suggest/suggestDetil',
    data: { id: item.adviceId },
  })
}
const paging = ref(null)
const dataList = ref([])
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
function swiperClick(item) {
  // const { item } = data
  if (item.shopHdType === 1) {
    routeTo({ url: item.appUrl, data: { ...item.data } })
  } else if (item.shopHdType === 0) {
    routeTo({
      url: '/pages-sub/webView/index',
      data: {
        type: item.shopHdId,
        showType: item.lineType === '1' ? 'webView' : 'banner',
        url: item.linkUrl,
      },
    })
  }
}
const queryList = async (pageNo, pageSize) => {
  const params = {
    page: pageNo,
    size: pageSize,
  }
  // 调用接口获取数据
  try {
    await sendSwiperList()
    const cList = swiperListData.value.content.filter((item) => {
      return (
        item.shopHdTitle.indexOf('惠民') > -1 ||
        item.shopHdTitle.indexOf('雄安一卡通优惠活动火热进行中') > -1
      )
    })
    console.log('🍝[cList]:', cList)
    dataList.value = cList
    paging.value.complete(cList)
  } catch (error) {
    paging.value.complete(false)
  }
}
</script>
<template>
  <view class="size-100% fixed top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1] dy-blue-bg"></view>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    :auto-show-system-loading="true"
    :safe-area-inset-bottom="true"
  >
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="" left isNavShow color="#000"></dy-navbar>
      <view class="flex justify-around items-center px-10px">
        <wd-img :src="title" width="187" height="81"></wd-img>
        <wd-img :src="bgimg" width="174" height="174"></wd-img>
      </view>
    </template>
    <!-- <view class="px-10px">
      <wd-skeleton
        animation="flashed"
        :row-col="[{ width: '100%', height: '135px' }]"
        :loading="swiperListLoading"
      >
        <wd-swiper
          :list="swiperListData!.content"
          :autoplay="true"
          :current="0"
          :height="135"
          @click="swiperClick"
          :indicator="{ type: 'dots-bar' }"
          custom-indicator-class="custom-indicator-class"
          customClass="custom-class-swiper"
          value-key="shopHdBanner"
          imageMode="scaleToFill"
        ></wd-swiper>
      </wd-skeleton>
    </view> -->
    <view class="px-10px">
      <view
        v-for="(item, index) in dataList"
        :key="index"
        class="mb-10px rounded-6px overflow-hidden"
      >
        <image
          :src="item.shopHdBanner"
          mode="widthFix"
          style="width: 100%"
          @click="swiperClick(item)"
        />
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
:deep(.z-paging-content) {
  background: linear-gradient(180deg, #d6eafe 0%, #f3f4f6 40%, #fff 100%) !important;
}
</style>
