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
import useInter from './utils/useInter'
const mingxibtn = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/8e3cbfab-eedb-4fe1-8230-12ede5d78929quduihuan.png',
)
const mingxilogo = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/c567db52-1dde-490b-922e-3c18c4d39fe3jifen.png',
)
const mingxititle = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/a548047b-38b2-4c97-8371-fc1257a9e0bdjfenmxi.png',
)
const { sendMessageList } = useInter()

defineOptions({
  name: 'interList',
})
const tab = ref(0)
const tablist = ref([
  {
    index: 0,
    title: '全部',
  },
  {
    index: 1,
    title: '收入',
  },
  {
    index: 2,
    title: '支出',
  },
])

const paging = ref(null)
const dataList = ref([])
async function queryList(pageNo, pageSize) {
  const params = {
    page: pageNo,
    size: pageSize,
    operationType: tab.value,
  }
  // 调用接口获取数据
  try {
    const data: any = await sendMessageList(params)
    // dataList.value = data.content as signInDetailRopos[]
    paging.value.complete(data.content)
  } catch (error) {
    paging.value.complete(false)
  }
}

const changeTab = (e) => {
  tab.value = e.index
  paging.value.reload()
}
</script>
<template>
  <z-paging ref="paging" v-model="dataList" @query="queryList" :auto-show-system-loading="true">
    <template #top>
      <!-- 顶部 -->
      <view class="top pos-relative">
        <dy-navbar leftTitle="我的积分明细" left></dy-navbar>
        <view class="w-full flex justify-between items-center px-30px box-border mt-10px">
          <view class="flex flex-col justify-center items-center">
            <wd-img :width="164" :height="62" :src="mingxititle"></wd-img>
            <wd-img
              :width="125"
              :height="31"
              :src="mingxibtn"
              custom-class="mt-10px"
              @click="
                routeTo({ url: '/pages-sub/marketManager/IntegralMarket/IntegralMarket/list' })
              "
            ></wd-img>
          </view>
          <wd-img :width="147" :height="108" :src="mingxilogo"></wd-img>
        </view>

        <view
          class="pos-absolute pos-bottom-none w-full overflow-hidden"
          style="border-radius: 20px 20px 0 0"
        >
          <wd-tabs v-model="tab" @change="changeTab">
            <block v-for="item in tablist" :key="item.index">
              <wd-tab :title="item.title"></wd-tab>
            </block>
          </wd-tabs>
        </view>
      </view>
    </template>
    <view class="px-10px pt-10px">
      <wd-cell-group>
        <wd-cell
          v-for="(item, index) in dataList"
          :key="index"
          title-width="80%"
          clickable
          custom-class="custom-class-cell"
        >
          <template #title>
            <view class="truncate-1 text-16px">
              {{ item.resource }}
            </view>
          </template>
          <template #label>
            <view class="flex gap-20px color-#888 text-14px">
              <view>{{ removeT(item.opertionTime) }}</view>
            </view>
          </template>
          <view class="flex justify-center">
            <view
              :class="item.kind === '1' ? 'color-#34d19d' : 'color-#fa4350'"
              class="text-16px font-bold"
            >
              {{ item.kind === '1' ? '+' : '-' }} {{ item.num }}
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>
    </view>
  </z-paging>
</template>

<style>
page {
  background-color: #f5f5f5;
}
</style>
<style lang="scss" scoped>
.top {
  width: 100%;
  height: 279px;
  background-image: url(../static/images/integral/mingxibg.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 120% 100%;
}
:deep(.wd-navbar) {
  width: 100%;
  background-color: transparent !important;
}
:deep(.wd-tabs__line) {
  background-color: #f44d24 !important;
}
:deep(.wd-cell-group),
:deep(.wd-cell-group__body) {
  @apply bg-transparent!;
}
:deep(.custom-class-cell) {
  @apply rounded-6px mb-10px overflow-hidden;
}
:deep(.wd-cell__wrapper) {
  @apply items-center!;
}
</style>
