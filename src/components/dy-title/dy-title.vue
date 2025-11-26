<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'moreClick', value: any): void
}>()

const props = defineProps({
  title: {
    type: [String, Number],
  },
  border: {
    type: Boolean,
    default: false,
  },
  more: {
    type: String,
    default: '',
  },

  customClass: {
    type: String,
    default: '',
  },
  smTitle: {
    type: String,
    default: '',
  },
  smTstyle: {
    type: String,
    default: '',
  },
  bottom: {
    type: Boolean,
    default: false,
  },
})
const toMore = () => {
  emit('moreClick', '')
}
</script>

<template>
  <view :class="`flex items-center mb-20px ${props.customClass}`">
    <view v-if="props.border" class="w-2px h-20px mr-10px bg-blue"></view>
    <view class="font-bold relative">
      <text>
        {{ props.title }}
      </text>
      <text :style="`${props.smTstyle}`">{{ props.smTitle }}</text>
      <view class="absolute left-0 w-full h-full flex justify-center" v-if="props.bottom">
        <i class="iconfont xa-yuanhu text-8px"></i>
      </view>
    </view>

    <view v-if="props.more" class="ml-auto text-blueGray text-12px" @click.stop="toMore">
      {{ props.more || '更多' }}
      <wd-icon name="arrow-right" size="14px"></wd-icon>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.border {
  border-radius: 0 0 50% 50% / 20%;
}
</style>
