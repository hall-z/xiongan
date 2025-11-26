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
import { SetClipboardData } from '@/utils/uniapi'
import orderInter from './utils/orderInter'

const { getLogistics, sendOrderInfo } = orderInter()

const title = ref('物流信息')

// TODO: 对数据做反转
const active = ref(0)
const orderId = ref(0)
const logisticsData = ref<any>({})
const orderInfo = ref<any>({})

async function getInfo(id: any) {
  // 这里是请求数据
  const da = { orderId: id }
  orderInfo.value = await sendOrderInfo(da)
  const data: any = await getLogistics({
    com: orderInfo.value.deliveryName,
    phone: orderInfo.value.receiverTel,
    num: orderInfo.value.waybillId,
    from: orderInfo.value.sendAddressName,
    to: orderInfo.value.receiverAddress,
  })
  logisticsData.value = JSON.parse(data)
}

onLoad(async (options) => {
  orderId.value = options.id ? options.id : ''
  if (orderId.value) {
    await getInfo(orderId.value)
  } else {
    console.log('没有订单ID')
  }
})
</script>

<template>
  <dy-navbar :leftTitle="title" left></dy-navbar>
  <view v-if="!logisticsData.data">
    <wd-status-tip image="search" tip="暂无物流信息!" />
  </view>
  <view class="p-10px min-h-100vh bg-#f5f5f5" v-else>
    <view class="p-10px bg-white">
      <view class="flex justify-between items-center mb-10px">
        <view>
          {{ orderInfo.deliveryName }}
          <text class="color-#999 text-12px">{{ orderInfo.waybillId }}</text>
        </view>
        <view>
          <wd-button type="text" block @click="SetClipboardData(orderInfo.waybillId)">复制单号</wd-button>
        </view>
      </view>
      <view>
        <wd-steps :active="active" vertical dot>
          <wd-step v-for="(item, index) in logisticsData.data" :key="index">
            <template #title>
              <view>{{ item.status }}</view>
            </template>
            <template #description>
              <view>{{ item.context }}</view>
              <view>{{ item.time }}</view>
            </template>
          </wd-step>
        </wd-steps>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
