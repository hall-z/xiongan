<script lang="ts" setup>
import { removeT, routeTo, sceneResult } from '@/utils'

import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { isRouterCheckd } from '@/interceptors/route'
import { useUserStore } from '@/store'
import { useScancode } from '@/utils/uniapi'
import { storeToRefs } from 'pinia'
import { useMessage } from 'wot-design-uni'
import status1 from '../../static/images/coupon/status1.png'
import status2 from '../../static/images/coupon/status2.png'
import { conponListProps } from '../utils/types'
import userCoupon from '../utils/userCoupon'
const { sendReceiveCoupon } = userCoupon()

const { isLogined, userInfo, isRealSataus } = storeToRefs(useUserStore())
const message = useMessage()
defineOptions({
  name: 'couponList',
})
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
    default: false, // true 显示    是否显示分享按钮
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
    btnText: '去扫码',
    btnShow: true,
  },
  {
    statsSrc: status1,
    btnText: '去使用',
    btnShow: true,
  },
  {
    statsSrc: status2,
    btnText: '查看码',
    btnShow: true,
  },
  {
    statsSrc: '',
    btnText: '去领取',
    btnShow: true,
  },
])

const couponTypeText = computed(() => {
  let text = ''
  if (props.data.type === 1) {
    text = '仅雄安一卡通支付使用'
  } else if (props.data.type === 2) {
    if (props.data.applyMerchant === 1) {
      text = '全部商户使用'
    } else {
      text = '仅【' + props.data.shopName + '】商户使用'
    }
  } else if (props.data.type === 3) {
    text = '仅【' + props.data.shopName + '】商户扫码核销'
  } else if (props.data.type === 4) {
    text = '指定商户微信支付专用'
  } else if (props.data.type === 5) {
    text = '指定商户支付宝支付专用'
  }
  return text
})
// 券3种状态
const statusCoupopn = computed(() => {
  return statusCoupopnList.value[props.data.type - 1]
})

const statusBg = computed(() => {
  return props.cIndex === 0
})

const delDateInT = (date) => {
  if (!date) return ''
  // 如果 date 是数组，处理开始和结束日期
  if (Array.isArray(date)) {
    const [startDate, endDate] = date.map((d) => {
      return d?.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' ') ?? ''
    })

    // 检查 startDate 是否包含 '1000'
    if (startDate.includes('1000')) {
      return '无限制' // 返回“无限制”
    }

    return `${startDate} ~ ${endDate}` // 返回格式化后的日期范围
  }
  // 如果 date 是单一日期字符串
  else if (typeof date === 'string') {
    const formattedDate = date.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' ')

    // 检查单一日期是否包含 '1000'
    if (formattedDate.includes('1000')) {
      return '无限制' // 返回“无限制”
    }

    return formattedDate // 返回格式化后的单一日期
  }
  // 如果没有有效的日期，则返回空字符串
  else {
    return ''
  }
}

const toDetil = () => {
  const data = {
    couponCode: props.data.couponCode,
    isMain: props.isMain ? 1 : 0,
    couponId: props.data.couponId,
    couponNum: props.data.couponNum,
    receiveLimitState: JSON.stringify(props.data.receiveLimitState),
  }
  routeTo({ url: '/pages-sub/marketManager/coupon/coupDeil', data })
}

const urlbg = ref(
  'https://oss.xay.xacloudy.cn/images/2024-09/0791669c-1691-416f-bc2f-1523986a55e9WechatIMG248.jpg',
)
const share = () => {
  emit('share')
}
const changeDate = (data: string) => {
  if (!data) return false
  if (data.indexOf('9999') > -1 || data.indexOf('1000') > -1) {
    return '无限制'
  } else {
    return false
  }
}
async function handleReceive() {
  if (!isRealSataus.value) {
    isRouterCheckd({})
    return
  }
  const item = props.data

  if (item.couponStatus === 0) {
    // type：1：支付卷 2：商品卷 3：线下核销卷
    // coupon_scop：4全部商品，5指定商品
    if (item.type === 3) {
      // 展示优惠券码
      const data = {
        couponCode: item.couponCode,
      }
      routeTo({ url: '/pages-sub/marketManager/coupon/coupDeil', data })
    } else if (item.type === 1) {
      const resData: any = await useScancode({ onlyFromCamera: true })
      const { data, status } = sceneResult(resData)
      console.log('返回结果===', data, status)
      if (status) {
        routeTo({
          url: '/pages/pay/index',
          data: { ...data },
        })
      } else {
        message.alert({
          msg: '未识别到二维码内容',
          title: '提示',
        })
      }
    } else if (item.type === 2) {
      // 商城跳转
      routeTo({ url: '/pages/shop/index', navType: NAVIGATE_TYPE.SWITCH_TAB })
    } else {
      routeTo({ url: '/pages-sub/marketManager/coupon/webview?state=' + item.couponId })
    }
  } else {
    const params = {
      couponId: item.couponId,
    }
    try {
      const rdata: any = await sendReceiveCoupon(params)
      if (rdata.couponCode) {
        emit('refresh')
        setTimeout(() => {
          uni.showToast({
            title: '领取成功',
          })
        }, 1500)
      }
    } catch (error) {
      console.log('🍈[error]:', error)
    }
  }
}
</script>

<template>
  <view class="px-15px" :class="props.actionShow ? 'py-6px' : 'py-0'">
    <view
      class="relative box-border rounded-10px bg-#Fff"
      :class="{ 'grayscale-95 opacity-80': !statusBg, isShadow: props.actionShow }"
      @click="props.detil ? toDetil() : ''"
    >
      <view class="flex gap-10px">
        <view
          class="flex flex-col item-content justify-center gap-10px h-106px w-116px bg-no-repeat"
          :style="`background-image: url(${urlbg});background-size:100%  100%`"
        >
          <view class="color-#FF4345 text-center">
            <view class="text-14px">
              {{
                props.data.couponType === 2
                  ? '无门槛'
                  : '满' + props.data.couponFillPrice + '元可用'
              }}
            </view>
          </view>
          <view class="color-#FF4345 flex items-end px-15px justify-between dynamicText">
            <view class="text-center flex-1">
              {{ props.data.couponPrice }}
            </view>
            <view class="w-18px text-16px text-center">
              {{ props.data.couponType == 3 ? '折' : '元' }}
            </view>
          </view>
        </view>
        <view class="flex flex-col justify-center flex-1 pr-10px box-border py-3px gap-4px">
          <view class="text-16px color-#000">{{ props.data.couponName }}</view>
          <view class="text-12px color-#999">
            <view class="" v-if="cIndex === 0">
              使用时间:
              <template v-if="changeDate(props.data.couponBeginDate)">
                {{ changeDate(props.data.couponBeginDate) }}
              </template>
              <template v-else>
                {{
                  removeT(props.data.couponBeginDate) + ' ~ ' + removeT(props.data.couponEndDate)
                }}
              </template>
            </view>
            <view class="" v-if="cIndex === 1">使用时间: {{ removeT(props.data.userDate) }}</view>
            <view class="text-12px">{{ couponTypeText }}</view>
          </view>

          <view class="flex justify-between items-center pb-2px" v-if="props.actionShow">
            <view class="color-#FF4345 text-12px flex items-center" @click.stop="showDetil">
              查看使用说明
              <wd-icon name="fill-arrow-down" color="#FF4345" size="16px"></wd-icon>
            </view>
            <view
              class="px-15px py-2px rounded-full bd-1px_#FF4345 color-#FF4345 text-12px"
              @click.stop="handleReceive"
              v-if="props.data.couponStatus === 0"
            >
              {{ statusCoupopn.btnText }}
            </view>
            <view
              class="px-15px py-2px rounded-full bd-1px_#FF4345 color-#FF4345 text-12px"
              @click.stop="handleReceive"
              v-if="
                props.data.couponStatus === 3 &&
                !props.data.receiveLimitState &&
                props.data.couponNum > 0
              "
            >
              领取
            </view>
            <view
              class="px-10px py-2px rounded-full bd-1px_#999 color-#999 text-12px"
              v-if="props.data.couponStatus === 3 && props.data.receiveLimitState"
            >
              已领取
            </view>
            <view
              class="px-10px py-2px rounded-full bd-1px_#999 color-#999 text-12px"
              v-if="
                props.data.couponStatus === 3 &&
                props.data.couponNum === 0 &&
                !props.data.receiveLimitState
              "
            >
              已结束
            </view>
          </view>
        </view>
      </view>
      <view class="absolute top-50% mt-[-33px] right-10px z-99" v-if="!statusBg">
        <wd-img :src="status1" :width="66" :height="66" v-if="cIndex == 1" />
        <wd-img :src="status2" :width="66" :height="66" v-if="cIndex == 2" />
      </view>

      <!-- 分享按钮 -->
      <!-- #ifndef APP-PLUS -->
      <view
        class="py-6px px-10px absolute top-0 right-0 z-99 bg-#FFEEEE rounded-bl-20px"
        v-if="statusBg && props.isShare && isLogined"
      >
        <view class="flex justify-center items-center gap-5px" @click.stop="share">
          <wd-icon name="share" size="12px" color="#FF4345"></wd-icon>
          <text class="color-#FF4345 text-12px">分享</text>
        </view>
      </view>
      <!-- #endif -->
    </view>
    <!-- 详情显示1 -->
    <view :class="open ? 'block' : 'hidden'" class="mx-[-20px] mb-[-10px] bg-#fff mb-1px">
      <view class="px-30px" :class="{ 'grayscale-95 opacity-80': !statusBg }">
        <view class="p-10px bg-#FFE8E3 color-#FF4345 text-12px line-height-20px rounded-b-4px">
          <view>活动名称: {{ props.data.activityName }}</view>
          <view>
            活动时间: {{ removeT(props.data.activityStartTime) }} ~
            {{ removeT(props.data.activityEndTime) }}
          </view>

          <view v-if="props.data.couponReceiveBeginDate">
            领取时间:
            {{ delDateInT([props.data.couponReceiveBeginDate, props.data.couponReceiveEndDate]) }}
          </view>
          <view>
            有效时间:
            {{ delDateInT([props.data.couponBeginDate, props.data.couponEndDate]) }}
          </view>
          <view v-if="props.data.couponFillPrice">
            优惠内容: {{ '满 ' + props.data.couponFillPrice + ' 元可用' }}
          </view>

          <view v-if="props.data.type === 3">线下进店展码核销</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.isShadow {
  box-shadow: 4px 0px 10px 1px rgba(0, 0, 0, 0.09);
}

.dynamicText {
  max-width: 100%;
  font-size: min(26px, 8vw);
  /* 基础字号+动态调整 */
}
</style>
