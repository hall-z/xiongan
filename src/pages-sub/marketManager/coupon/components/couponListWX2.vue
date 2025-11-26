<script lang="ts" setup>
import { removeT, routeTo } from '@/utils'

import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
// const url = require('../../static/images/coupon/cardbg.png')
import { isRouterCheckd } from '@/interceptors/route'
import status1 from '../../static/images/coupon/status1.png'
import status2 from '../../static/images/coupon/status2.png'
import { conponListProps } from '../utils/types'
import userCoupon from '../utils/userCoupon'
import DetailedDescription from './detailedDescription.vue'

const { sendReceiveCoupon } = userCoupon()

const { isLogined, userInfo, isRealSataus } = storeToRefs(useUserStore())
defineOptions({
  name: 'couponList',
})
const wxicon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/cdf119a8-3e7c-4acc-b376-43e4aca818d1wx.png',
)

const url = ref(
  'https://oss.xay.xacloudy.cn/images/2024-11/44721e2b-152b-478c-8238-8a9e6091719e20241108020608.png',
)
const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'share'): void
}>()

const props = defineProps({
  data: {
    type: Object as PropType<conponListProps>,
    default: () => ({}),
  },
  detil: {
    type: Boolean,
    default: true,
  },
  actionShow: {
    type: Boolean,
    default: true,
  },
  isShadow: {
    type: Boolean,
    default: true,
  },
  isShare: {
    type: Boolean,
    default: false,
  },
  isMain: {
    type: Boolean,
    default: false,
  },
  cIndex: {
    type: Number,
    default: 0,
  },
})

const open = ref(false)
const showDetil = () => {
  open.value = !open.value
}

const statusCoupopnList = ref([
  {
    statsSrc: '',
    btnText: '去使用',
    btnShow: false,
  },
  {
    statsSrc: status1,
    btnText: '已使用',
    btnShow: false,
  },
  {
    statsSrc: status2,
    btnText: '已过期',
    btnShow: false,
  },
  {
    statsSrc: '',
    btnText: '去领取',
    btnShow: false,
  },
])

const couponTypeText = computed(() => {
  let text = ''
  if (props.data.type === 1) {
    text = '仅雄安一卡通支付使用'
  } else if (props.data.type === 2) {
    text = '仅雄安一卡通平台商城使用'
  } else if (props.data.type === 3) {
    text = '仅雄安一卡通平台线下商户扫码核销'
  }
  return text
})
// 券3种状态
const statusCoupopn = computed(() => {
  return statusCoupopnList.value[props.data.couponStatus ?? 3]
})
// 平台券，商家券判断条件
const sourceStu = computed(() => {
  return props.data.type === 1
})
const statusBg = computed(() => {
  return props.cIndex === 0
})
const handleReceive = async (item) => {
  if (!isRealSataus.value) {
    isRouterCheckd({})
    return
  }
  routeTo({
    url:
      '/pages-sub/marketManager/coupon/webview?state=' +
      item.couponId +
      'W' +
      userInfo.value.userDId,
  })
}
const toDetil = () => {
  routeTo({
    url:
      '/pages-sub/marketManager/coupon/webview?state=' +
      props.data.couponId +
      'W' +
      userInfo.value.userDId,
  })
}

const share = () => {
  emit('share')
}
const changeDate = (data: string) => {
  if (!data) return false
  if (data.indexOf('9999') > -1 || data.indexOf('1000') > -1) {
    return '永久有效'
  } else {
    return false
  }
}
const detilShow = ref(false)
const handleDetil = () => {
  detilShow.value = !detilShow.value
}
const handlAvailableMerchant = () => {
  routeTo({
    url: '/pages-sub/marketManager/coupon/availableMerchants?id=' + props.data.lotNode,
  })
}
</script>

<template>
  <view class="px-15px py-6px">
    <view
      class="relative box-border rounded-10px bg-#fff"
      :class="{ 'grayscale-95 opacity-80': !statusBg, isShadow: props.actionShow }"
    >
      <view class="flex gap-10px">
        <view
          class="flex flex-col item-content justify-center gap-10px h-106px w-116px bg-no-repeat"
          :style="`background-image: url(${url});background-size:  100% `"
        >
          <view class="color-#22a540 text-center">
            <view class="text-14px">
              {{
                props.data.couponFillPrice > 0
                  ? '满' + props.data.couponFillPrice + '元可用'
                  : '无门槛'
              }}
            </view>
          </view>
          <view class="color-#22a540 flex items-end px-15px justify-between">
            <view class="text-30px text-center flex-1">
              {{ props.data.couponType == 3 ? props.data.couponPrice : props.data.couponPrice }}
            </view>
            <view class="w-18px text-16px text-center">
              {{ props.data.couponType == 3 ? '折' : '元' }}
            </view>
          </view>
        </view>
        <view class="flex flex-col justify-center flex-1 pr-10px box-border py-3px gap-4px">
          <!--  :class="!sourceStu ? 'gap-8px' : 'gap-4px'" -->
          <view class="text-16px color-#000">{{ props.data.couponName }}</view>
          <view class="text-12px color-#999">
            <view class="" v-if="cIndex === 0">
              使用时间:
              <template v-if="changeDate(props.data.couponBeginDate)">
                {{ changeDate(props.data.couponBeginDate) }}
              </template>
              <template v-else>
                {{ removeT(props.data.couponBeginDate) + '~' + removeT(props.data.couponEndDate) }}
              </template>
            </view>
            <view class="" v-if="cIndex === 1">使用时间: {{ removeT(props.data.userDate) }}</view>
            <view class="text-12px">{{ couponTypeText }}</view>
          </view>

          <view class="flex gap-10px items-center pb-2px" v-if="props.actionShow">
            <!-- <view class="color-#22a540 text-12px flex items-center" @click.stop="showDetil">
              查看使用说明
              <wd-icon name="fill-arrow-down" color="#22a540" size="16px"></wd-icon>
            </view> -->
            <view
              class="px-15px py-2px rounded-full bd-1px_#22a540 color-#22a540 text-12px"
              @click="handlAvailableMerchant"
            >
              <!--   v-if="statusCoupopn.btnShow" -->
              {{ '可用商户' }}
            </view>
            <view
              class="px-15px py-2px rounded-full bd-1px_#22a540 color-#22a540 text-12px"
              @click="handleDetil"
            >
              使用说明
            </view>
            <!-- <view
              class="px-15px py-2px rounded-full bd-1px_#22a540 color-#22a540 text-12px"
              v-if="statusCoupopn.btnShow"
              @click="handleReceive"
            >
              {{ statusCoupopn.btnText }}
            </view> -->
          </view>
        </view>
      </view>
      <view class="absolute top-50% mt-[-33px] right-10px z-99" v-if="!statusBg">
        <wd-img :src="statusCoupopn.statsSrc" :width="66" :height="66" />
      </view>

      <!-- 分享按钮 -->
      <!-- #ifndef APP-PLUS -->
      <view
        class="py-6px px-10px absolute top-0 right-0 z-99 bg-#FFEEEE rounded-bl-20px"
        v-if="statusBg && props.isShare && isLogined"
      >
        <view class="flex justify-center items-center gap-5px" @click.stop="share">
          <wd-icon name="share" size="12px" color="#22a540"></wd-icon>
          <text class="color-#22a540 text-12px">分享</text>
        </view>
      </view>
      <!-- #endif -->
      <!-- 角标 -->
      <view
        class="absolute right-0 top-0 w-20px h-20px bg-#E9F3DC pr-5px pl-10px py-2px rounded-lb-10px"
      >
        <wd-img :src="wxicon" width="18" height="18"></wd-img>
      </view>
    </view>
    <!-- 详情显示1 -->
    <view
      :class="[!statusBg ? 'grayscale-95 opacity-80' : '', open ? 'block' : 'hidden']"
      class="mx-[-20px] mb-[-10px] bg-#fff mb-1px"
    >
      <view class="px-30px pb-10px">
        <view class="p-10px bg-#EFF5EF color-#22a540 text-12px line-height-20px rounded-b-4px">
          <view>活动名称: {{ props.data.activityName }}</view>
          <view>
            活动时间: {{ removeT(props.data.activityStartTime) }}~{{
              removeT(props.data.activityEndTime)
            }}
          </view>
          <view v-if="props.data.couponReceiveBeginDate">
            领取时间:
            {{
              removeT(props.data.couponReceiveBeginDate) +
              ' ~ ' +
              removeT(props.data.couponReceiveEndDate)
            }}
          </view>
          <view>
            有效时间:
            <template v-if="changeDate(props.data.couponBeginDate)">
              {{ changeDate(props.data.couponBeginDate) }}
            </template>
            <template v-else>
              {{ removeT(props.data.couponBeginDate) + ' ~ ' + removeT(props.data.couponEndDate) }}
            </template>
          </view>
          <view>优惠内容: {{ '满 ' + props.data.couponFillPrice + ' 元可用' }}</view>
          <view v-if="props.data.type === 3">线下进店展码核销</view>
        </view>
      </view>
    </view>
    <DetailedDescription v-model:show="detilShow" :data="props.data" />
  </view>
</template>

<style lang="scss" scoped>
.isShadow {
  box-shadow: 4px 0px 10px 1px rgba(0, 0, 0, 0.09);
}
</style>
