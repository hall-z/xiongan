<script lang="ts" setup>
import { previewImage } from '@/utils/uniapi'
import dayjs from 'dayjs'
import { AuditItem, changeVoucherImg } from '../dict/types'
const props = defineProps({
  title: {
    type: String,
  },
  reason: {
    type: String,
  },
  detail: {
    type: Object as PropType<AuditItem>,
  },
  detail2: {
    type: Object as PropType<AuditItem>,
  },
})

const prew = (url: string) => {
  const arr = url.split(',')
  if (arr?.length) {
    previewImage(arr)
  }
}
</script>

<template>
  <view class="bg-#fff rounded-10px overflow-hidden px-15px py-10px">
    <view v-if="props.title" class="mb-5px color-#333 font-600 flex justify-between items-center">
      <text class="font-size-16px">{{ props.title }}</text>
      <text class="color-#F44D24 font-size-14px">{{ props.detail2.auditContent }}</text>
    </view>
    <view class="">
      <view class="py-10px flex gap-10px box-border">
        <view class="w-100% bd-1px_#E5E7EB rounded-10px p-10px text-center">
          <view class="line-height-26px">您上传的凭证</view>
          <view class="my-10px">
            <wd-img
              :width="120"
              :height="130"
              radius="8px"
              @click="prew(props.detail.auditVoucher)"
              :src="changeVoucherImg(props.detail.auditVoucher)"
            >
              <template #error>
                <view class="error-wrap">加载失败</view>
              </template>
            </wd-img>
          </view>
          <view class="line-height-26px font-size-12px">
            {{ dayjs(props.detail.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </view>
        </view>
        <view class="w-100% bd-1px_#E5E7EB rounded-10px p-10px text-center">
          <view class="line-height-26px">商家举证</view>
          <view class="my-10px">
            <wd-img
              :width="120"
              :height="130"
              mode="scaleToFill"
              radius="8px"
              @click="prew(props.detail2?.auditVoucher)"
              :src="changeVoucherImg(props.detail2?.auditVoucher)"
            ></wd-img>
          </view>
          <view class="line-height-26px font-size-12px">
            {{ dayjs(props.detail2.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
