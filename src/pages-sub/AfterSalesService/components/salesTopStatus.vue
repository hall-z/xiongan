<script lang="ts" setup>
import dayjs from 'dayjs'
import waring from '../static/waring.png'
const props = defineProps({
  active: {
    type: Number,
    default: 0,
  },
  topStatus: {
    type: Object as PropType<{
      title: string
      time: string
      orderID: string
    }>,
  },
})

const status = ref([
  {
    label: '售后完成',
    value: 1,
  },
  {
    label: '商家拒绝',
    value: 2,
  },
  {
    label: '您的退款申请被驳回',
    value: 3,
  },
])
</script>

<template>
  <view class="">
    <view class="py-20px flex flex-col gap-10px items-center" v-if="active === 0">
      <wd-icon name="check-circle-filled" size="55px" color="#F44D24"></wd-icon>

      <view class="font-size-20px line-height-36px font-600">{{ status[active].label }}</view>

      <view class="font-size-16px line-height-26px color-#333">
        {{ dayjs(props.topStatus.time).format('YYYY-MM-DD HH:mm:ss') }}
      </view>
    </view>
    <view class="py-20px flex flex-col gap-10px items-center" v-if="active === 1">
      <wd-img :src="waring" width="66px" height="56px"></wd-img>
      <view class="font-size-20px line-height-36px font-600">{{ status[active].label }}</view>

      <view class="font-size-16px line-height-26px color-#333">
        订单号：{{ props.topStatus.orderID }}
      </view>
    </view>
    <view class="py-20px flex flex-col gap-10px items-center" v-if="active === 2">
      <wd-icon name="close-circle-filled" size="55px" color="#F44D24"></wd-icon>
      <view class="font-size-20px line-height-36px font-600">{{ status[active].label }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
