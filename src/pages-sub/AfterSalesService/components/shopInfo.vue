<script lang="ts" setup>
import { AfertSalesDetail, chageSkuName, changeSkuImg } from '../dict/types'
const scrollTop = ref<number>(0) // 滚动位置
const emit = defineEmits<{
  (e: 'confirm', value: any): void
}>()

const props = defineProps({
  detail: {
    type: Object as PropType<AfertSalesDetail>,
  },
})
</script>

<template>
  <view class="bg-#fff rounded-10px p-15px">
    <view class="flex items-center gap-10px">
      <wd-img :src="props.detail.shopAvatar" width="30px" height="30px" round></wd-img>
      <view class="text-#333 text-16px font-bold truncate-1">{{ props.detail.shopName }}</view>
    </view>
    <view class="flex gap-10px mt-10px">
      <wd-img
        :src="changeSkuImg(props.detail.skuUrl)"
        :width="80"
        :height="80"
        radius="8px"
        mode="aspectFill"
      ></wd-img>
      <view class="flex-1 flex flex-col justify-around">
        <view class="text-#333 text-16px font-bold truncate-1">{{ props.detail.spuName }}</view>
        <view class="font-size-14px color-#ccc">{{ chageSkuName(props.detail.skuName) }}</view>
        <view class="color-#F44D24 font-size-14px font-600">
          <text class="font-size-10px">¥</text>
          {{ props.detail.sellPrice }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
