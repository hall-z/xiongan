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
import SalesMation from '../components/salesMation.vue'
import SalesSteps from '../components/salesSteps.vue'
import SalesStepsVt from '../components/salesStepsVt.vue'
import ShopInfo from '../components/shopInfo.vue'
import ShopOrderDesc from '../components/shopOrderDesc.vue'
import { AfterSalesData } from '../dict/types'
const columns = ref([
  {
    label: '商户审核中',
    time: '',
    reason: '正在审核...',
    value: '',
  },
  {
    label: '提交申请',
    time: '',
    reason: '',
    value: '',
  },
])
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
    // async middleware(ctx, next) {
    //   const result = (await next()) as any
    //   result.auditList.forEach((item) => {
    //     item.orderId = orderId.value
    //     item.label = item.auditContent
    //     item.time = item.createTime
    //     item.reason = result.afterSales.refundReason
    //   })
    //   return result
    // },
  },
).onSuccess((res) => {
  res.data.auditList.forEach((item) => {
    item.orderId = orderId.value
    item.label = item.auditContent
    item.time = item.createTime
    item.reason = res.data.afterSales.refundReason
  })
  let list = res.data.auditList
  list = list.filter((item) => item.setp === '1')
  columns.value.forEach((item, index) => {
    item.time = list?.[index]?.time ?? list[0].time
    item.reason = index === 0 ? item.reason : list[0].reason
  })
})

onLoad(({ orderId: orderIdParam }) => {
  orderId.value = orderIdParam
})
</script>

<template>
  <dy-content customClassCenter="bg-#f5f5f5 p-15px">
    <template #top>
      <dy-navbar leftTitle="售后详情" left></dy-navbar>
    </template>
    <view class="">
      <Shop-Info :detail="detail!.afertSalesDetail"></Shop-Info>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Shop-Order-Desc :orderIdDetil="detail!.afterSales"></Shop-Order-Desc>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Sales-Steps title="售后进度" :active="1"></Sales-Steps>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Sales-Steps-Vt title="审核流程追踪" :columns="columns"></Sales-Steps-Vt>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Sales-Mation title="售后保障" :detail="detail!.afertSalesDetail"></Sales-Mation>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
    </view>
    <template #bottom>
      <!-- <view class="px-15px py-20px bg-white">
        <Sales-Cancel title="取消售后" :orderId="orderId"></Sales-Cancel>
      </view> -->
    </template>
  </dy-content>
</template>

<style lang="scss" scoped>
//
</style>
