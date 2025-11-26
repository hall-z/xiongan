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
import hubgtitle from '../static/images/coupon/hubgtitle.png'
import CouponList from './components/couponList.vue'
import CouponListWX from './components/couponListWX.vue'
import FootBtn from './components/footBtn.vue'
import { conponListProps } from './utils/types'
import userCoupon from './utils/userCoupon'
const { sendCouponList } = userCoupon()
const myyhbtn =
  'https://oss.xay.xacloudy.cn/images/2025-03/fcfbd3b4-050e-4411-8689-a62d0e114738mycopop.png'

const topbgBase64 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-01/cdbbafda-8106-4075-8a06-13bc59613e5bmyuhbg.png',
)

const title = ref('领券中心')
const tab = ref(0)

const tablist = ref([
  {
    index: 0,
    title: '全部',
    count: 0,
  },
  {
    index: 1,
    title: '平台券',
    count: 0,
  },
  // #ifdef MP-WEIXIN
  {
    index: 2,
    title: '微信券',
    count: 0,
  },
  // #endif
])
const changeTab = (e) => {
  tab.value = e.index
  paging.value.reload()
}
const conponList = ref<conponListProps[]>([])
function toYouhuiquan() {
  routeTo({
    url: '/pages-sub/marketManager/coupon/mycoupon',
    navType: NAVIGATE_TYPE.REDIRECT_TO,
  })
}
const paging = ref(null)
async function queryList(pageNo: number, pageSize: number) {
  const params = {
    page: pageNo,
    size: pageSize,
    type: tab.value,
  }
  // 调用接口获取数据
  try {
    const data: any = await sendCouponList(params)

    data.content.forEach((item) => {
      item.couponStatus = 3
    })
    paging.value.complete(data.content)
  } catch (error) {
    paging.value.complete(false)
  }
}
const showBtn = ref(true)
setTimeout(() => {
  showBtn.value = true
}, 3000)

onShow(async () => {
  paging.value && paging.value.reload()
})
</script>

<template>
  <z-paging
    ref="paging"
    v-model="conponList"
    @query="queryList"
    class="flex flex-col bg-no-repeat h-100vh"
    :auto-show-system-loading="true"
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
              <wd-tab :title="`${item.title}`"></wd-tab>
            </block>
          </wd-tabs>
        </view>
      </view>
    </template>

    <view class="bg-#ffff rounded-t-20px overflow-hidden" style="min-height: 200px">
      <view class="pt-10px">
        <view class="" v-for="(item, index) in conponList" :key="index">
          <Coupon-List
            :data="item"
            @refresh="paging.reload()"
            isMain
            v-if="item.type !== 4"
          ></Coupon-List>

          <!-- #ifdef MP-WEIXIN -->
          <Coupon-ListWX
            v-if="item.type === 4"
            :data="item"
            @refresh="paging.reload()"
            isMain
          ></Coupon-ListWX>
          <!-- #endif -->
          <!-- #ifdef MP-ALIPAY -->
          <Coupon-ListWX
            v-if="item.type === 5"
            :data="item"
            @refresh="paging.reload()"
            isMain
          ></Coupon-ListWX>
          <!-- #endif -->
        </view>
      </view>
    </view>
    <template #bottom>
      <view class="px-30px bg-#fff py-10px">
        <Foot-Btn title="查看我的优惠券" @click="toYouhuiquan"></Foot-Btn>
      </view>
    </template>
  </z-paging>
  <!-- </view> -->
</template>
<style lang="scss" scoped>
.bg {
  background: #feb329;
  border: 0.9px solid rgba(255, 255, 255, 0.51);
  border-radius: 1000px;
}

:deep(.custom-class-pop) {
  @apply w-80% rounded-10px;
}

:deep(.zp-scroll-view-super) {
  margin-top: 15px;
}

.topbg {
  background-image: url('https://oss.xay.xacloudy.cn/images/2025-01/44dae448-26b2-45f6-8cb7-c1f9adc2beacyhbg.png');

  background-size: 100% 290px;
}

:deep(.custom-class-tab),
:deep(.custom-class-tab .wd-tabs__nav) {
  @apply bg-transparent !;
}

:deep(.custom-class-tab) {
  .wd-tabs__nav-item {
    @apply text-#D8B9B9 px-10px;
  }

  .wd-tabs__nav-item.is-active {
    @apply color-#000 bg-#fff;
    background: url('https://oss.xay.xacloudy.cn/images/2025-03/11ef7cce-6f71-40ca-82de-b9056e541033tabbg.png')
      no-repeat;
    background-size: cover;
  }

  .wd-tabs__line {
    @apply w-5% bg-#F44D24 h-3px;
  }
}
</style>
