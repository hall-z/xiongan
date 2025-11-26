<route lang="json5" type="page">
{
  layout: 'default',
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
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { routeTo } from '@/utils'
import hubgtitle from '../static/images/coupon/tomyh.png'
import CouponList from './components/couponList.vue'
import CouponListWX2 from './components/couponListWX2.vue'
import FootBtn from './components/footBtn.vue'
import { conponListProps } from './utils/types'
import userCoupon from './utils/userCoupon'

const myyhbtn =
  'https://oss.xay.xacloudy.cn/images/2025-03/fcfbd3b4-050e-4411-8689-a62d0e114738mycopop.png'

const { sendUserCouponList } = userCoupon()
const topbgBase64 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-01/cdbbafda-8106-4075-8a06-13bc59613e5bmyuhbg.png',
)
const qicon =
  'https://oss.xay.xacloudy.cn/images/2025-03/1e50b516-f92b-4895-b551-8608c23486c9qicon.png'
const title = ref('优惠券')
const paging = ref(null)
const tab = ref(0)
const tablist = ref([
  {
    index: 0,
    title: '未使用',
    count: 0,
  },
  {
    index: 1,
    title: '已使用',
    count: 0,
  },
  {
    index: 2,
    title: '已过期',
    count: 0,
  },
])
const matchTab = ref(['unUsedCouponNum', 'usedCouponNum', 'overdueCouponNum'])
const changeTab = (e) => {
  tab.value = e.index
  paging.value.reload()
}

const conponList = ref<conponListProps[]>([])

async function queryList(pageNo: number, pageSize: number) {
  const params = {
    page: pageNo,
    size: 10,
    status: tab.value,
  }

  // 调用接口获取数据
  try {
    const data: any = await sendUserCouponList(params)
    tablist.value.forEach((e, i) => {
      e.count = data[matchTab.value[i]]
    })
    // data.coupons?.content?.forEach((e) => {
    //   e.couponStatus = tab.value
    // })
    paging.value.complete(data.coupons.content)
  } catch (error) {
    paging.value.complete(false)
  }
}

function toYouhuiquan() {
  routeTo({ url: '/pages-sub/marketManager/coupon/index', navType: NAVIGATE_TYPE.REDIRECT_TO })
}

// const showBtn = ref(true)
// setTimeout(() => {
//   showBtn.value = true
// }, 2000)
</script>

<template>
  <view class="size-100% fixed top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1]"></view>
  <z-paging
    ref="paging"
    v-model="conponList"
    @query="queryList"
    :auto-show-system-loading="true"
    class="flex flex-col bg-no-repeat h-100vh"
  >
    <template #top>
      <view :style="`background-image: url(${topbgBase64}); background-size: 100% 230px`">
        <dy-navbar :leftTitle="title" left isNavShow></dy-navbar>
        <view class="mt-20px relative">
          <view class="pl-20px">
            <wd-img :src="hubgtitle" width="190" height="73"></wd-img>
          </view>

          <view class="absolute right-15px bottom-[-30px]">
            <wd-img :src="myyhbtn" width="114" height="128"></wd-img>
          </view>
        </view>
        <view class="bg-#C02E16/70 mt-42px">
          <wd-tabs v-model="tab" @change="changeTab" custom-class="custom-class-tab">
            <block v-for="item in tablist" :key="item.index">
              <wd-tab :title="`${item.title}   (${item.count})`"></wd-tab>
            </block>
          </wd-tabs>
        </view>
      </view>
    </template>
    <view>
      <view class="py-10px">
        <view class="rounded-4px overflow-hidden" v-for="(item, index) in conponList" :key="index">
          <Coupon-List
            :data="item"
            v-if="item.type !== 4"
            :detil="item.couponStatus !== 2 && item.couponStatus !== 1"
            :cIndex="tab"
          ></Coupon-List>
          <!-- #ifdef MP-WEIXIN -->
          <Coupon-ListWX2 v-else :data="item" :cIndex="tab"></Coupon-ListWX2>
          <!-- #endif -->
        </view>
      </view>
    </view>
    <template #bottom>
      <view class="px-30px bg-#fff py-10px">
        <Foot-Btn title="去领券" @click="toYouhuiquan"></Foot-Btn>
      </view>
    </template>
  </z-paging>
</template>

<style lang="scss" scoped>
:deep(.custom-class-tab),
:deep(.custom-class-tab .wd-tabs__nav) {
  @apply bg-transparent!;
}

:deep(.custom-class-tab) {
  .wd-tabs__nav-item {
    @apply text-#D8B9B9 px-10px;
  }

  .wd-tabs__nav-item.is-active {
    @apply color-#000  bg-#fff;
    background: url('https://oss.xay.xacloudy.cn/images/2025-03/11ef7cce-6f71-40ca-82de-b9056e541033tabbg.png')
      no-repeat;
    background-size: cover;
  }

  .wd-tabs__line {
    @apply w-5% bg-#F44D24 h-3px;
  }
}
</style>
