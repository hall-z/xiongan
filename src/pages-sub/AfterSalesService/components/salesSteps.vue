<script lang="ts" setup>
import dayjs from 'dayjs'
import dagerTips from '../static/dagerTips.png'
import daishouhuo from '../static/daishouhuo.png'

const props = defineProps({
  title: {
    type: String,
  },
  isShowTips: {
    type: Boolean,
    default: false,
  },
  tips: {
    type: Number,
    default: 0,
  },
  active: {
    type: Number,
    default: 0,
  },
  isShowTime: {
    type: Boolean,
    default: false,
  },
  timeArr: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  colType: {
    type: Number,
    default: 0,
  },
})

const col = ref([
  {
    label: '申请提交',
    description: '',
    time: '',
  },
  {
    label: '审核通过',
    description: '',
    time: '',
  },
  {
    label: '已寄出',
    description: '',
    time: '',
  },
  {
    label: '待收货',
    description: '',
    time: '',
  },
  {
    label: '退货完成',
    description: '',
    time: '',
  },
])
watch(
  () => props.colType,
  (newVal) => {
    if (newVal === 1) {
      col.value.splice(2, 2)
    }
  },
  { immediate: true },
)
</script>

<template>
  <view class="bg-#fff rounded-10px overflow-hidden px-15px py-10px">
    <view v-if="props.title" class="font-size-16px mb-5px color-#333 font-600">
      {{ props.title }}
    </view>
    <view class="py-10px">
      <wd-steps :active="props.active" align-center>
        <wd-step v-for="(item, index) in col" :key="index">
          <template #icon>
            <view
              class="flex items-center justify-center w-40px h-40px rounded-full bg-#FFE9E3"
              v-if="index < props.active"
            >
              <view
                class="w-24px h-24px rounded-full bg-#F44D24 txt-center font-size-14px font-weight-600 text-#fff line-height-24px"
              >
                <wd-icon name="check-bold" size="16px" color="#fff"></wd-icon>
              </view>
            </view>
            <view
              class="flex items-center justify-center w-40px h-40px rounded-full bg-#FFE9E3"
              v-else-if="index === props.active"
            >
              <view
                class="w-24px h-24px rounded-full bg-#F44D24 txt-center font-size-14px font-weight-600 text-#fff line-height-24px"
              >
                {{ index + 1 }}
              </view>
            </view>
            <view
              class="flex items-center justify-center w-40px h-40px rounded-full bg-#F1F1F1"
              v-else
            >
              <view
                class="w-24px h-24px rounded-full bg-#A3A3A3 txt-center font-size-14px font-weight-600 text-#fff line-height-24px"
              >
                {{ index + 1 }}
              </view>
            </view>
          </template>
          <template #title>
            <view class="mt-24px color-#F44D24 pl-8px font-size-12px" v-if="index < props.active">
              {{ item.label }}
            </view>
            <view
              class="mt-25px color-#F44D24 pl-8px font-size-12px"
              v-else-if="index === props.active"
            >
              {{ props.active === 1 ? '审核中' : item.label }}
            </view>
            <view class="mt-25px pl-8px font-size-12px" v-else>{{ item.label }}</view>
          </template>
          <template #description>
            <view v-if="props.isShowTime">{{ dayjs(props.timeArr[index]).format('MM-DD') }}</view>
          </template>
        </wd-step>
      </wd-steps>
    </view>
    <view class="mt-10px p-10px bg-#FFF4F1 rounded-10px" v-if="isShowTips">
      <view class="flex items-center gap-10px" v-if="props.active === 0">
        <wd-icon name="time-filled" size="22px" color="#F44D24"></wd-icon>
        <text class="color-#F44D24 font-size-14px font-600">商品审核中</text>
        <text class="font-size-14px">预计3个工作日完成审核</text>
      </view>
      <view class="flex-wrap" v-if="props.active === 1">
        <view class="flex items-center gap-10px h-30px">
          <wd-img :src="dagerTips" width="20px" height="16px"></wd-img>
          <text class="color-#F44D24 font-size-14px font-600">审核通过</text>
        </view>
        <view class="pl-30px mt-5px font-size-14px">
          需要在48小时内完成寄件，超时将自动取消申请。
        </view>
      </view>
      <view class="flex justify-between items-center" v-if="props.active === 4">
        <view class="flex items-center gap-10px h-30px">
          <wd-img :src="daishouhuo" width="20px" height="16px"></wd-img>
          <text class="color-#333 font-size-14px font-600">商家收货状态</text>
        </view>
        <view class="color-#F44D24 font-size-14px">待收货</view>
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.wd-step__line) {
  @apply top-70%!;
}
</style>
