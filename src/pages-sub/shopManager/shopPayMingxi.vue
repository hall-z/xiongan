<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      defaultTitle: '',
      titlePenetrate: 'NO',
      backButtonIcon: null,
    },
  },
}
</route>

<script lang="ts" setup>
import { changeUrlJson, nameHide } from '@/utils'
import { respVoList } from './utils/types'

const title = ref('收款明细')
const data = ref<respVoList>()

function removeT(date: string) {
  if (!date) return ''
  return date.length >= 19 ? date.substring(0, 19) : date
}

onLoad(async (options) => {
  data.value = changeUrlJson(options) as respVoList
})
</script>
<template>
  <dy-navbar :leftTitle="title" left></dy-navbar>
  <view>
    <view class="color-#555 text-20px text-center mt-30px">{{ nameHide(data.userName) }}</view>
    <view class="text-32px text-center py-15px">+ {{ data.orderActualAmount }}</view>
    <view class="mt-30px px-20px">
      <view class="flex justify-between text-16px py-10px">
        <view class="color-#999999" v-if="data.targetOrderId">交易订单号:</view>
        <view class="color-#000 text-14px">
          {{ data.targetOrderId }}
        </view>
      </view>
      <view class="flex justify-between text-16px py-10px">
        <view class="color-#999999" v-if="data.orderId">商户订单号:</view>
        <view class="color-#000 text-14px">{{ data.orderId }}</view>
      </view>
      <view class="flex justify-between text-16px py-10px">
        <view class="color-#999999">收款时间:</view>
        <view class="color-#000 text-14px">
          {{ removeT(data.payMentTime) }}
        </view>
      </view>
      <view class="flex justify-between text-16px py-10px">
        <view class="color-#999999">收款金额:</view>
        <view class="color-#000 text-14px">{{ data.orderActualAmount }}元</view>
      </view>
      <view class="flex justify-between text-16px py-10px">
        <view class="color-#999999">优惠金额:</view>
        <view class="color-#FF6600 text-14px">{{ data.couponAmount }} 元</view>
      </view>
    </view>
  </view>
</template>
