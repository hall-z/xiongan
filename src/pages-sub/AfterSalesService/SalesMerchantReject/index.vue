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
import SalesReson from '../components/salesReson.vue'
import SalesTopStatus from '../components/salesTopStatus.vue'
import ShopOrderDesc from '../components/shopOrderDesc.vue'
import { AfterSalesData, AuditItem } from '../dict/types'
const orderId = ref('')
const topStatus = ref({
  title: '退货完成',
  time: '',
  orderID: '',
})
const detail2 = ref<AuditItem>({} as AuditItem)
const detailUser = ref<AuditItem>({} as AuditItem)
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
  const list = res.data.auditList
  detail2.value = list.find((item) => item.setp === '4')
  detailUser.value = list.find((item) => item.setp === '1')!
  topStatus.value = {
    ...topStatus.value,
    orderID: orderId.value,
  }
})

onLoad(({ orderId: orderIdParam }) => {
  orderId.value = orderIdParam
})
</script>

<template>
  <dy-content customClassCenter="bg-#f5f5f5 p-15px">
    <template #top>
      <dy-navbar leftTitle="商家拒绝" left></dy-navbar>
    </template>
    <view class="">
      <Sales-Top-Status :active="1" :topStatus="topStatus"></Sales-Top-Status>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Sales-Reson title="拒收原因" :detail="detailUser" :detail2="detail2"></Sales-Reson>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Shop-Order-Desc type="orderalesReson" title="商家拒收理由">
        <view class="color-#333 line-height-26px break-words">
          {{ detail2!.contentDescription }}
        </view>
      </Shop-Order-Desc>
    </view>
    <template #bottom>
      <Sales-Mation :showBtn="true" :detail="detail.afertSalesDetail"></Sales-Mation>
    </template>
  </dy-content>
</template>

<style lang="scss" scoped>
//
</style>
