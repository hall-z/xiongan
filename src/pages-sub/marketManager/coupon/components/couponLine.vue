<script lang="ts" setup>
import { removeT } from '@/utils/index'
import status3 from '../../static/images/coupon/status3.png'
import { couponDetailProps } from '../utils/types'
import userCoupon from '../utils/userCoupon'
const { sendReceiveCoupon } = userCoupon()

defineOptions({
  name: 'couponLine',
})
const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const props = defineProps({
  data: {
    type: Object as PropType<couponDetailProps>,
    default: () => ({}),
  },
  status: {
    type: Boolean,
    default: false,
  },
  statusBg: {
    type: Boolean,
    default: true,
  },
})

const open = ref(false)
const showDetil = () => {
  open.value = !open.value
}

const statusCoupopnList = ref([
  {
    statsSrc: status3,
    btnText: '已核销',
    btnShow: true,
  },
])
// 券3种状态
const statusCoupopn = computed(() => {
  return statusCoupopnList.value[0]
})

const url = ref(
  'https://oss.xay.xacloudy.cn/images/2024-09/0791669c-1691-416f-bc2f-1523986a55e9WechatIMG248.jpg',
)
</script>

<template>
  <view class="bg overflow-hidden rounded-4px">
    <view
      class="bg-no-repeat h-96px relative pr-10px box-border rounded-10px bg-#fff/20"
      :class="statusBg ? '' : 'grayscale opacity-80'"
    >
      <view class="flex justify-between items-center">
        <view
          class="text-center w-100px h-96px py-10px box-border bg-#fff"
          :style="`background-image: url(${url});background-size: 100px 100% `"
        >
          <view class="py-10px">立减</view>
          <view class="color-#FF4345 font-bold text-32px">
            <text class="text-14px mr-5px">¥</text>
            <text>{{ props.data.price }}</text>
          </view>
        </view>
        <view class="flex-1 pl-10px text-12px py-10px">
          <view class="text-16px">{{ props.data.price }}元无门槛优惠券红包</view>
          <view v-if="props.status">
            <view>核销人: {{ props.data.bUserName }}</view>
            <view>核销时间: {{ removeT(props.data.createTime) }}</view>
            <view>使用人员: {{ props.data.aUserName }}</view>
          </view>
        </view>
        <view class="absolute top-30px right-2% z-99" v-if="props.status">
          <wd-img :src="statusCoupopn.statsSrc" :width="60" :height="53" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.bg {
  box-shadow: 4px 0px 10px 1px rgba(0, 0, 0, 0.11);
}
</style>
