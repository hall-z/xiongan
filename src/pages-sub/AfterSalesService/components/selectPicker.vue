<script lang="ts" setup>
const scrollTop = ref<number>(0) // 滚动位置
const emit = defineEmits<{
  (e: 'confirm', value: any): void
  (e: 'update:pickerShow', value: any): string
}>()

interface couponDetailProps {
  value: string | number
  label: string | number
}
const props = defineProps({
  customContentClass: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  confirmButtonText: {
    type: String,
    default: '确认',
  },
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  zIndex: {
    type: Number,
    default: 1000,
  },
  scrollIntoView: {
    type: String,
    default: '',
  },
  pickerShow: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Object as PropType<couponDetailProps[]>,
  },
})
const show = ref<boolean>(props.pickerShow)

const setScrollIntoView = () => {
  console.log('🍶')
}

const active = ref(-1)
const changeReado = (e, index) => {
  console.log(e, index, '====')
  active.value = index
}
const close = () => {
  show.value = false
  emit('update:pickerShow', false)
}
watch(
  () => props.pickerShow,
  (newVal) => {
    show.value = newVal
  },
  { immediate: true },
)
const onConfirm = () => {
  if (active.value === -1) return
  emit('confirm', props.columns[active.value])
  close()
}
</script>

<template>
  <wd-action-sheet
    v-model="show"
    :duration="250"
    :title="props.title"
    :close-on-click-modal="closeOnClickModal"
    :z-index="zIndex"
    :safe-area-inset-bottom="true"
    @close="close"
    @opened="scrollIntoView ? setScrollIntoView() : ''"
    custom-header-class="wd-select-picker__header"
  >
    <scroll-view
      :class="`wd-select-picker__wrapper} ${customContentClass}`"
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <view class="p-15px">
        <view
          class="py-10px flex gap-10px"
          :class="{ 'bb-1px_#f5f5f5': index !== props.columns.length - 1 }"
          v-for="(item, index) in props.columns"
          :key="index"
          @click="changeReado(item, index)"
        >
          <wd-icon
            :name="active === index ? 'check-circle-filled' : 'circle1'"
            size="20px"
            :color="active === index ? 'red' : '#999'"
          ></wd-icon>
          <view>{{ item.label }}</view>
        </view>
      </view>
    </scroll-view>
    <!-- 确认按钮 -->
    <view v-if="showConfirm" class="wd-select-picker__footer">
      <view class="p-15px">
        <wd-button block @click="onConfirm" :round="false" type="error">
          {{ confirmButtonText }}
        </wd-button>
      </view>
    </view>
  </wd-action-sheet>
</template>

<style lang="scss" scoped>
//
</style>
