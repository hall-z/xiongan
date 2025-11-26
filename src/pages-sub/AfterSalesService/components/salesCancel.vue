<script lang="ts" setup>
import { useMessage, useToast } from 'wot-design-uni'
const toast = useToast()
const message = useMessage()
const emit = defineEmits<{
  (e: 'confirm', value: any): void
}>()

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  orderId: {
    type: String,
    default: '',
  },
})

const onConfirm = () => {
  message
    .confirm({
      msg: `确定${props.title}吗？`,
      title: '提示',
    })
    .then(() => {
      console.log('🥘')
      toast.show('功能开发中！')
    })
}
</script>

<template>
  <wd-message-box></wd-message-box>
  <wd-toast />
  <wd-button
    block
    :round="false"
    type="error"
    @click="onConfirm"
    custom-class="bg-#F44D24!  color-#FFF!"
  >
    <view class="flex justify-between items-center gap-10px">
      <slot></slot>
      <text>{{ props.title }}</text>
    </view>
  </wd-button>
</template>

<style lang="scss" scoped>
//
</style>
