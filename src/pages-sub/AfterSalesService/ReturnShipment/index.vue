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
import { getAfterSalesDetail, returnGoods } from '@/service/api/aftersalesservice'
import { useRequest } from 'alova/client'
import AddressMess from '../components/addressMess.vue'
import SalesLogisticsFrom from '../components/salesLogisticsFrom.vue'
import SalesPolicy from '../components/salesPolicy.vue'
import SalesSteps from '../components/salesSteps.vue'
import { AfterSalesData } from '../dict/types'

const sureDisabled = ref(true)
const orderId = ref('')
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
)

const { loading: submiting, send: returnGoodsSend } = useRequest((data) => returnGoods(data), {
  immediate: false,
}).onSuccess((res) => {
  uni.showToast({
    title: '信息提交成功了',
    icon: 'success',
  })
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/index/index',
    })
  }, 2000)
})

onLoad(({ orderId: orderIdParam }) => {
  orderId.value = orderIdParam
})
const logisticsFrom = ref(null)
const submit = () => {
  const { expressNumber, expressCompany } = logisticsFrom.value.model
  const { afterSalesId, userId, cardId } = detail.value.afterSales
  const params = {
    orderId: orderId.value,
    afterSalesId,
    userId,
    cardId,
    refundExpressDeliveryNumber: expressNumber,
    refundExpressDeliveryCompany: expressCompany,
  }
  returnGoodsSend(params)
}
</script>

<template>
  <dy-content customClassCenter="bg-#f5f5f5 p-15px">
    <template #top>
      <dy-navbar leftTitle="退货寄回" left></dy-navbar>
    </template>
    <view class="">
      <Sales-Steps title="售后进度" :tips="1" :active="1"></Sales-Steps>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Address-Mess title="退货地址" :detail="detail!.returnAddress"></Address-Mess>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Sales-LogisticsFrom
        v-model:disabled="sureDisabled"
        ref="logisticsFrom"
      ></Sales-LogisticsFrom>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Sales-Policy title="退货须知"></Sales-Policy>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
    </view>
    <template #bottom>
      <view class="px-15px py-20px bg-white">
        <view class="flex justify-between items-center gap-10px">
          <!-- <view>
            <Sales-Cancel title="取消售后" :orderId="orderId"></Sales-Cancel>
          </view> -->
          <view class="flex-1">
            <wd-button
              block
              :round="false"
              type="error"
              @click="submit"
              :loading="submiting"
              :disabled="sureDisabled"
              custom-class="bg-#F44D24!  color-#FFF!"
            >
              确认寄回
            </wd-button>
          </view>
        </view>
      </view>
    </template>
  </dy-content>
</template>

<style lang="scss" scoped>
//
</style>
