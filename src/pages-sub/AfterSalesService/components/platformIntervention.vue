<script lang="ts" setup>
import { getOrderInterfereStatus } from '@/service/api/userMessage'
import { routeTo } from '@/utils'
import { useRequest } from 'alova/client'
import { useMessage } from 'wot-design-uni'
const message = useMessage()
const emit = defineEmits<{
  (e: 'confirm', value: any): void
}>()

interface resData {
  handleStatus: number
}

const props = defineProps({
  title: {
    type: String,
    default: '平台介入',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  orderId: {
    type: String,
    default: '',
  },
  style: {
    type: String,
    default: 'plain',
  },
})
const { send: sendOrderInterfereStatus, loading: statusLoading } = useRequest(
  () => getOrderInterfereStatus<resData>({ orderId: props.orderId }),
  {
    immediate: false,
  },
).onSuccess((res) => {
  if (res.data?.handleStatus >= 0) {
    routeTo({ url: '/pages-sub/userManager/tickets/ticketsInfoDetil', data: { id: props.orderId } })
  } else {
    routeTo({ url: '/pages-sub/userManager/tickets/ticketsInfo', data: { id: props.orderId } })
  }
})

const onConfirm = () => {
  message
    .confirm({
      msg: `确定${props.title}吗？`,
      title: '提示',
    })
    .then(() => {
      sendOrderInterfereStatus()
    })
}
</script>

<template>
  <wd-message-box></wd-message-box>

  <wd-button
    block
    :round="false"
    :disabled="disabled"
    :loading="statusLoading"
    type="error"
    :plain="props.style === 'plain'"
    :custom-class="
      props.style === 'plain'
        ? 'bg-#FFF4F1! bd-#FFDCD4! color-#F44D24!'
        : 'bg-#F44D24!  color-#FFF!'
    "
    @click="onConfirm"
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
