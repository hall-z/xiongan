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

import { openWxChart } from '@/utils/uniapi'
import { useToast } from 'wot-design-uni'
import bgimg from '../static/images/jiaotong/bgimg.png'
import chengche from '../static/images/jiaotong/chengche.png'
import title from '../static/images/jiaotong/gjcx.jpg'
import jiaofei from '../static/images/jiaotong/jiaofei.png'
import zhengce from '../static/images/jiaotong/zhengce.png'

const toast = useToast()

const toDetil = (item) => {
  routeTo({
    url: '/pages-sub/serveMassage/jiaotong/detil',
    data: { id: item.adviceId },
  })
}
const paging = ref(null)
const dataList = ref([
  {
    title: '公交充值',
    btn: '查看详情',
    icon: chengche,
    type: 'router1',
    path: '/pages-sub/webView/index',
    id: '1710488285782016010',
  },

  {
    id: 1,
    title: '余额查询',
    btn: '查看详情',
    type: 'router',
    icon: jiaofei,
    path: '/pages-sub/userManager/transit/list', // 打开的页面路径，如果为空则打开首页
  },
  {
    title: '乘车政策',
    btn: '查看详情',
    icon: zhengce,
    type: 'router',
    path: '/pages-sub/webView/index',
    id: '1710488285782016010',
  },
  // {
  //   id: 1,
  //   title: '停车缴费',
  //   btn: '去缴费',
  //   type: 'WX',
  //   icon: jiaofei,
  //   appId: 'wx6d1780b8d016147c', // 填入目标小程序的 appId
  //   path: 'pages/index/index', // 打开的页面路径，如果为空则打开首页
  // },
])
// const queryList = (pageNo, pageSize) => {
//   const params = {
//     page: pageNo,
//     size: pageSize,
//   }
//   // 调用接口获取数据
//   paging.value.complete(dataList.value)
//   // try {
//   //   // await sendAdvicelist(params)
//   //   paging.value.complete(dataList.value)
//   // } catch (error) {
//   //   paging.value.complete(false)
//   // }
// }
const btnClick = (item) => {
  if (item.type === 'WX') {
    openWxChart(item.appId, item.path)
  } else if (item.type === 'router') {
    routeTo({
      url: item.path,
      data: { type: item.id, title: item.title },
    })
  } else {
    toDetil(item)
    // toast.show('功能开发中，敬请期待!...')
  }
}
</script>
<template>
  <z-paging
    ref="paging"
    v-model="dataList"
    :auto-show-system-loading="true"
    :safe-area-inset-bottom="true"
    :refresher-enabled="false"
    :loading-more-enabled="false"
    :show-loading-more-no-more-view="false"
    :auto="false"
  >
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="" left isNavShow color="#000"></dy-navbar>
      <view class="flex justify-around items-center px-10px">
        <wd-img :src="title" width="187" height="81"></wd-img>
        <wd-img :src="bgimg" width="174" height="174"></wd-img>
      </view>
    </template>
    <view class="px-10px pt-10px">
      <view
        class="px-10px py-3px bg-#fff rounded-5px mb-10px"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <view class="flex justify-between items-center py-10px">
          <wd-img :src="item.icon" width="50" height="50"></wd-img>
          <view class="text-16px font-600 mr-auto ml-15px">
            {{ item.title }}
          </view>
          <view
            class="rounded-4px px-10px py-3px text-center text-14px color-#2D69EF bg-#EFF4FF min-w-80px"
            @click="btnClick(item)"
          >
            {{ item.btn }}
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
:deep(.z-paging-content) {
  background: linear-gradient(180deg, #d6eafe 0%, #f3f4f6 40%, #f2f3f7 100%) !important;
}
:deep(.custom-class-pop) {
  @apply w-80%  rounded-10px;
}
</style>
