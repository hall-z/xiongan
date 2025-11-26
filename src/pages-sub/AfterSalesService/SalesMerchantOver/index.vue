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
import { getAfterSalesDetail } from '@/service/api/aftersalesservice'
import { useRequest } from 'alova/client'
import currency from 'currency.js'
import SalesSteps from '../components/salesSteps.vue'
import SalesTopStatus from '../components/salesTopStatus.vue'
import ShopOrderDesc from '../components/shopOrderDesc.vue'
import { AfterSalesData } from '../dict/types'
import zijin from '../static/zijin.png'

const submit = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}
const topStatus = ref({
  title: '售后完成',
  time: '',
  orderID: '',
})
const arrTime = ref<string[]>([])
const orderId = ref('')
const { data: detail } = useRequest(
  () => getAfterSalesDetail<AfterSalesData>({ orderId: orderId.value }),
  {
    immediate: true,
    initialData: {
      auditList: [],
      afertSalesDetail: {},
      afterSales: {},
    },
  },
).onSuccess((res) => {
  // FIX: list 必须为5条数据
  const list = res.data.auditList.reverse()
  topStatus.value = {
    ...topStatus.value,
    orderID: orderId.value,
    time: list[0].createTime,
  }
  for (let i = 0; i < 4; i++) {
    if (Number(list[i]!.setp) === i + 1) {
      arrTime.value.push(list[i].createTime)
    }
  }
})

onLoad(({ orderId: orderIdParam }) => {
  orderId.value = orderIdParam
})
</script>

<template>
  <dy-content customClassCenter="bg-#f5f5f5 p-15px">
    <template #top>
      <dy-navbar leftTitle="售后完成" left></dy-navbar>
    </template>
    <view class="">
      <Sales-Top-Status :topStatus="topStatus"></Sales-Top-Status>
      <Sales-Steps
        title="售后进度"
        :isShowTime="true"
        :isShowTips="false"
        :active="5"
        :timeArr="arrTime"
      ></Sales-Steps>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Shop-Order-Desc type="orderalesReson" title="资金到账详情">
        <view class="mt-10px p-10px bg-#FFF4F1 rounded-10px">
          <view class="flex items-center gap-10px font-size-14px">
            <wd-img :src="zijin" width="20px" height="20px"></wd-img>
            <text class="color-#333">退款总额</text>
            <text class="ml-auto color-#F44D24 font-600 font-size-20px line-height-30px">
              ¥{{ currency(detail.afertSalesDetail.refundAmount) }}
            </text>
          </view>
        </view>
        <view class="flex justify-between line-height-30px mt-10px font-size-14px px-10px">
          <text class="color-#888">原路退回到订单支付</text>
          <text class="color-#333">预计3个工作日到账</text>
        </view>
      </Shop-Order-Desc>
    </view>
    <template #bottom>
      <view class="px-15px py-20px bg-white">
        <wd-button
          block
          :round="false"
          type="error"
          @click="submit"
          custom-class="bg-#F44D24!  color-#FFF!"
        >
          返回首页
        </wd-button>
      </view>
    </template>
  </dy-content>
</template>

<style lang="scss" scoped>
//
</style>
