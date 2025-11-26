<script lang="ts" setup>
import { useMessage } from 'wot-design-uni'
import { conponListProps } from '../utils/types'
const message = useMessage()
const emit = defineEmits<{
  (e: 'confirm', value: any): void
  (e: 'update:show', value: any): string
}>()

interface couponDetailProps {
  value: string
  label: string
}
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<conponListProps>,
    default: () => {},
  },
})

const showPopup = ref(false)

watch(
  () => props.show,
  (newVal) => {
    showPopup.value = newVal
  },
  { immediate: true },
)
const handleClose = () => {
  emit('update:show', false)
}
</script>

<template>
  <wd-popup
    v-model="showPopup"
    custom-class="w-80%!  bg-#fff rounded-10px p-20px box-border"
    @close="handleClose"
    lock-scroll
    safe-area-inset-bottom
    :close-on-click-modal="false"
    closable
  >
    <view class="pt-10px">
      <view class="text-center text-18px font-600">{{ props.data.couponName }}</view>
      <view class="color-#555 line-height-26px text-14px max-h-50vh overflow-y-auto py-20px">
        <view>
          {{ props.data.couponRemark }}
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
//
</style>
