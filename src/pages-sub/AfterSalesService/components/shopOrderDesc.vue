<script lang="ts" setup>
import { SetClipboardData } from '@/utils/uniapi'
import currency from 'currency.js'
import dayjs from 'dayjs'
import { AfertSalesDetail, AfterSales, AuditItem } from '../dict/types'
import dagerTips from '../static/dagerTips.png'
type shopInfoType = 'orderId' | 'fundShow' | 'orderalesReson'
const props = defineProps({
  columns: {
    type: Array,
  },
  title: {
    type: String,
  },
  type: {
    type: String as PropType<shopInfoType>,
    default: 'orderId',
  },
  orderIdDetil: {
    type: Object as PropType<AfterSales>,
  },
  shopInfo: {
    type: Object as PropType<AfertSalesDetail>,
  },
  isShowReject: {
    type: Boolean,
    default: false,
  },
  rejectReason: {
    type: Object as PropType<AuditItem>,
  },
})
</script>

<template>
  <view class="bg-#fff rounded-10px overflow-hidden">
    <wd-cell-group v-if="props.type === 'orderId'" :title="props.title">
      <wd-cell title="售后单号" title-width="70px">
        <view class="flex gap-10px justify-end">
          <view class="w-130px truncate-1">{{ props.orderIdDetil.orderId }}</view>
          <view
            @click="SetClipboardData(props.orderIdDetil.orderId)"
            class="color-#F44D24"
            v-if="props.orderIdDetil?.orderId"
          >
            复制
          </view>
        </view>
      </wd-cell>
      <wd-cell
        title="申请时间"
        :value="dayjs(props.orderIdDetil.createTime).format('YYYY-MM-DD HH:mm:ss')"
        title-width="100px"
      />
      <view class="p-10px" v-if="isShowReject">
        <view class="flex-wrap p-10px bg-#FFF4F1 rounded-10px">
          <view class="flex items-center gap-10px h-30px">
            <wd-img :src="dagerTips" width="20px" height="16px"></wd-img>
            <text class="color-#F44D24 font-size-14px font-600">
              驳回原因：{{ props.rejectReason.auditContent }}
            </text>
          </view>
          <view class="pl-30px mt-5px font-size-14px">
            {{ props.rejectReason.contentDescription }}
          </view>
        </view>
      </view>
    </wd-cell-group>
    <wd-cell-group v-if="props.type === 'fundShow'" :title="props.title">
      <wd-cell
        title="预计退款金额"
        :value="`￥${currency(props.shopInfo?.refundAmount)}`"
        title-width="100px"
      />
      <wd-cell title="退款方式" value="原路返回" title-width="100px" />
    </wd-cell-group>
    <wd-cell-group v-if="props.type === 'orderalesReson'" :title="props.title">
      <view class="px-15px pb-10px rounded-10px">
        <slot></slot>
      </view>
    </wd-cell-group>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
