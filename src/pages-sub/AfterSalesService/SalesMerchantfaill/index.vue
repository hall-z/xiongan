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
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { afterSalesAudit, getAfterSalesDetail } from '@/service/api/aftersalesservice'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { useForm, useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { useToast } from 'wot-design-uni'
import PlatformIntervention from '../components/platformIntervention.vue'
import SalesTopStatus from '../components/salesTopStatus.vue'
import ShopOrderDesc from '../components/shopOrderDesc.vue'
import { AfterSalesData, AuditItem } from '../dict/types'
const { userInfo } = storeToRefs(useUserStore())
const toast = useToast()
const topStatus = ref({
  title: '售后申请驳回',
  time: '',
  orderID: '',
})
const rejectReason = ref<AuditItem>()
const orderId = ref('')
const form = ref()
const { data: detail } = useRequest(
  () => getAfterSalesDetail<AfterSalesData>({ orderId: model.value.orderId }),
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
  topStatus.value = {
    ...topStatus.value,
    orderID: orderId.value,
    time: list[0].createTime,
  }
  rejectReason.value = list.find((item) => item.setp === '2')
})

const {
  // 提交状态
  loading: submiting,
  form: model,
  send: formSubmit,
} = useForm(
  (formData) => {
    const params = {
      ...formData,
      afterSalesId: detail.value.afterSales.afterSalesId,
    }
    console.log(params)

    return afterSalesAudit(params)
  },
  {
    initialForm: {
      refundReason: '重新申请售后',
      userPhone: userInfo.value.userPhone,
      contentDescription: '',
      auditVoucher: '',
      orderId: orderId.value,
      setp: 1,
      // afterSalesType: 1,
    },
  },
).onSuccess((res) => {
  toast.show('提交成功!')
  routeTo({
    url: '/pages-sub/AfterSalesService/SalesDetil/index',
    data: {
      orderId: model.value.orderId,
    },
    navType: NAVIGATE_TYPE.REDIRECT_TO,
  })
})
const submit = () => {
  if (!model.value.auditVoucher) {
    toast.show('请上传凭证!')
    return
  }
  form.value.validate().then(({ valid }) => {
    if (valid) {
      formSubmit()
    }
  })
}

onLoad((options) => {
  model.value = { ...model.value, ...options }
})
</script>

<template>
  <dy-content customClassCenter="bg-#f5f5f5 p-15px">
    <template #top>
      <dy-navbar leftTitle="售后申请驳回" left></dy-navbar>
    </template>
    <view class="">
      <Sales-Top-Status :topStatus="topStatus" :active="2"></Sales-Top-Status>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
      <Shop-Order-Desc
        title="订单驳回详情"
        :orderIdDetil="detail!.afterSales"
        :rejectReason="rejectReason"
        :isShowReject="true"
      ></Shop-Order-Desc>
      <wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
    </view>
    <view class="rounded-10px overflow-hidden">
      <wd-form ref="form" :model="model" errorType="toast">
        <wd-cell-group border custom-class="py-5px!">
          <wd-cell title="上传佐证照片" required title-width="100%">
            <template #label>
              <view class="py-10px">
                <dy-upload v-model="model.auditVoucher" :limit="9" :multiple="true"></dy-upload>
                <view class="font-size-12px color-#999">
                  支持格式: PNG、JPG, 单个文件不超过10M，最多9张
                </view>
              </view>
            </template>
          </wd-cell>
          <wd-cell title="补充情况说明" required title-width="100%">
            <template #label>
              <view class="">
                <wd-textarea
                  v-model="model.contentDescription"
                  placeholder="请输入补充情况说明"
                  custom-class="px-0!"
                  custom-textarea-container-class="px-10px! py-5px!  rounded-4px bg-#f5f5f5!"
                  :maxlength="120"
                  clearable
                  show-word-limit
                />
              </view>
            </template>
          </wd-cell>
        </wd-cell-group>
      </wd-form>
      <!-- <Select-Picker
        title="退款原因"
        v-model:pickerShow="pickerShow"
        confirmButtonText="确认选择"
        :columns="refundReListList"
        @confirm="confirmSelect"
      ></Select-Picker> -->
    </view>
    <template #bottom>
      <view class="px-15px py-20px bg-white">
        <view class="flex items-center justify-between gap-10px">
          <view class="w-100%">
            <Platform-Intervention :orderId="orderId"></Platform-Intervention>
          </view>
          <view class="w-100%">
            <wd-button
              block
              :round="false"
              custom-class="bg-#F44D24!  color-#FFF!"
              @click="submit"
              :loading="submiting"
            >
              <view class="flex items-center gap-5px">
                <text>重新提交申请</text>
              </view>
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
