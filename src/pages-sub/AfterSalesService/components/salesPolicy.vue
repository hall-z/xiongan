import { reason } from '../../serveMain/types/dict';
<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
  },
})
const close = ref(false)
const showbtnbox = () => {
  close.value = !close.value
}
const columns = ref([
  {
    value: '101',
    label: '请使用原包装或坚固包装，避免运输损坏 ',
  },
  {
    value: '102',
    label: '请勿在商品上粘贴胶带或书写文字 ',
  },
  {
    value: '103',
    label: '请保留快递面单照片，作为退货凭证',
  },
  {
    value: '104',
    label: '退货商品需保持完好，不影响二次销售',
  },
])
</script>

<template>
  <view class="bg-#fff rounded-10px overflow-hidden px-15px py-10px">
    <view v-if="props.title" class="font-size-16px mb-5px color-#333 font-600">
      {{ props.title }}
    </view>
    <view class="">
      <view class="py-10px flex gap-10px" v-for="(item, index) in columns" :key="index">
        <wd-icon name="check-circle-filled" size="22px" color="red"></wd-icon>
        <view class="lint-height-40px color-#666">{{ item.label }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
