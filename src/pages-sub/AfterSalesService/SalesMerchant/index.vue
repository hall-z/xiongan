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
import { getAfterSalesDetail, getLogistics } from '@/service/api/aftersalesservice'
import { useRequest } from 'alova/client'
import { useToast } from 'wot-design-uni'
import SalesMation from '../components/salesMation.vue'
import SalesSteps from '../components/salesSteps.vue'
import SalesStepsVt from '../components/salesStepsVt.vue'
import ShopOrderDesc from '../components/shopOrderDesc.vue'
import { AfterSalesData, dictType, LogisticsData } from '../dict/types'
const toast = useToast()
const orderId = ref('')
const logisticsData2 = ref<dictType[]>([])
const {
  send: sendLogistics,
  loading,
  data: logisticsData,
} = useRequest((data) => getLogistics<dictType[]>(data), {
  immediate: false,
  loading: false,
  // async middleware(ctx, next) {
  //   const result = (await next()) as unknown
  //   const logisticsData = JSON.parse(result as string)
  //   if (!logisticsData.result && logisticsData.returnCode === '500') {
  //     toast.show(logisticsData.message)
  //     return []
  //   }
  //   const { data }: { data: LogisticsData[] } = logisticsData
  //   const maseData: dictType[] = data.map((item) => {
  //     return {
  //       label: item.status,
  //       value: item.context,
  //       reason: item.context,
  //       time: item.ftime,
  //     }
  //   })
  //   return maseData
  // },
}).onSuccess((res) => {
  console.log(res)
  const result = res.data as unknown
  const logisticsData = JSON.parse(result as string)
  if (!logisticsData.result && logisticsData.returnCode === '500') {
    toast.show(logisticsData.message)
    return []
  }
  const { data }: { data: LogisticsData[] } = logisticsData
  const maseData: dictType[] = data.map((item) => {
    return {
      label: item.status,
      value: item.context,
      reason: item.context,
      time: item.ftime,
    }
  })
  logisticsData2.value = maseData
})

const { data: detail } = useRequest(
  () => getAfterSalesDetail<AfterSalesData>({ orderId: orderId.value }),
  {
    immediate: true,
    initialData: {
      auditList: [],
      afertSalesDetail: {},
      afterSales: {},
      returnAddress: {},
    },
  },
).onSuccess((res) => {
  sendLogistics({
    phone: res.data.afterSales.userPhone,
    num: res.data.afterSales.refundExpressDeliveryNumber,
    com: res.data.afterSales.refundExpressDeliveryCompany,
    from: res.data.afertSalesDetail.sendAddressName,
    to:
      res.data.returnAddress.province +
      res.data.returnAddress.city +
      res.data.returnAddress.area +
      res.data.returnAddress.address,
  })
})
onLoad(({ orderId: orderIdParam }) => {
  orderId.value = orderIdParam
})
</script>

<template>
  <dy-content customClassCenter="bg-#f5f5f5 p-15px">
    <template #top>
      <dy-navbar leftTitle="商户待收货" left></dy-navbar>
    </template>
    <view class="">
      <Sales-Steps title="售后进度" :tips="2" :active="3"></Sales-Steps>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Sales-Steps-Vt
        title="物流时实追踪"
        :columns="logisticsData2"
        :isMoreBtn="true"
        :isLoading="loading"
      ></Sales-Steps-Vt>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Shop-Order-Desc
        type="fundShow"
        title="资金返还预览"
        :shopInfo="detail!.afertSalesDetail"
      ></Shop-Order-Desc>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
    </view>
    <template #bottom>
      <SalesMation :showBtn="true"></SalesMation>
    </template>
  </dy-content>
</template>

<style lang="scss" scoped>
//
</style>
