<script lang="ts" setup>
import { SetClipboardData } from '@/utils/uniapi'
import { AddressInfo } from '../dict/types'

const props = defineProps({
  detail: {
    type: Object as PropType<AddressInfo>,
  },
  title: {
    type: String,
  },
})

const active = ref('df')
const copyAddress = () => {
  SetClipboardData(
    props.detail.province +
      ' ' +
      props.detail.city +
      ' ' +
      props.detail.area +
      ' ' +
      props.detail.address +
      ' ' +
      props.detail.addressAlias +
      ' ' +
      props.detail.contactPerson +
      ' ' +
      props.detail.contactPhone,
  )
}
</script>

<template>
  <view class="bg-#fff rounded-10px overflow-hidden">
    <wd-cell-group :title="props.title">
      <template #value>
        <view class="color-#F44D24" @click="copyAddress" v-if="props.detail.address">复制地址</view>
      </template>
      <view class="px-10px pb-10px">
        <wd-skeleton
          animation="flashed"
          theme="paragraph"
          :row-col="[{ width: '90%' }, { width: '100%' }, { width: '50%' }]"
          :loading="!props.detail.address"
        >
          <view class="p-15px bg-#f5f5f5 rounded-10px">
            <view class="color-#888888 line-height-26px">
              {{ props.detail.province }} {{ props.detail.city }} {{ props.detail.area }}
              {{ props.detail.address }}
            </view>
            <view class="font-600 line-height-26px">{{ props.detail.addressAlias }}</view>
            <view class="line-height-26px">
              {{ props.detail.contactPerson }} {{ props.detail.contactPhone }}
            </view>
          </view>
        </wd-skeleton>
      </view>
    </wd-cell-group>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
