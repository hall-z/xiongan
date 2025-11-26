<script lang="ts" setup>
import dayjs from 'dayjs'
import { dictType } from '../dict/types'
import guiji from '../static/guiji.png'
const props = defineProps({
  title: {
    type: String,
  },
  columns: {
    type: Array as PropType<dictType[]>,
    default: () => [],
  },
  isMoreBtn: {
    type: Boolean,
    default: false,
  },
  moreText: {
    type: String,
    default: '查看完整物流轨迹',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isEmptyTips: {
    type: String,
    default: '暂无物流信息',
  },
})
const active = ref(0)
const offStatus = ref(false)

const currentCol = ref<dictType[]>([])

const init = () => {
  if (props.columns?.length > 3) {
    currentCol.value = JSON.parse(JSON.stringify(props.columns)).slice(0, 3)
  } else {
    currentCol.value = props.columns
  }
}

watch(
  () => props.columns,
  (newVal) => {
    console.log('🍎===', newVal)
    if (!props.isMoreBtn) {
      currentCol.value = newVal
      active.value = props.columns.length - 1
    } else {
      init()
    }
  },
  { deep: true, immediate: true },
)
watch(
  () => props.isMoreBtn,
  (newVal) => {
    if (newVal) {
      init()
    }
  },
  { immediate: true },
)
const btntext = computed(() => {
  return offStatus.value ? '收起' : props.moreText
})
const handleMore = () => {
  offStatus.value = !offStatus.value
  if (!offStatus.value) {
    currentCol.value = JSON.parse(JSON.stringify(props.columns)).slice(0, 3)
  } else {
    currentCol.value = props.columns
  }
}
</script>

<template>
  <view class="bg-#fff rounded-10px overflow-hidden px-15px py-10px">
    <view v-if="props.title" class="font-size-16px mb-5px color-#333 font-600">
      {{ props.title }}
    </view>
    <view class="py-10px">
      <view class="flex items-center justify-center" v-if="!props.columns.length">
        <wd-loading v-if="props.isLoading" />
        <view v-else>
          <wd-status-tip image="search" :tip="props.isEmptyTips" />
        </view>
      </view>

      <wd-steps :active="active" vertical v-else>
        <wd-step v-for="(item, index) in currentCol" :key="index">
          <template #icon>
            <view
              class="w-15px h-15px rounded-full bg-#FFE9E3 mx-auto flex items-center justify-center"
              v-if="index <= active"
            >
              <view class="w-7px h-7px rounded-full bg-#F44D24"></view>
            </view>
            <view
              class="w-10px h-10px rounded-full bg-#F1F1F1 mx-auto flex items-center justify-center"
              v-else
            >
              <view class="w-7px h-7px rounded-full bg-#A3A3A3"></view>
            </view>
          </template>
          <template #title>
            <view class="pl-10px font-size-12px">
              <view class="color-#F44D24" v-if="index <= active">
                {{ item.label }}
                <text class="float-right mt-10px">
                  {{ dayjs(item.time).format('YYYY-MM-DD HH:mm:ss') }}
                </text>
              </view>
              <view class="" v-else>
                {{ item.label }}
                <text class="float-right mt-10px">
                  {{ dayjs(item.time).format('YYYY-MM-DD HH:mm:ss') }}
                </text>
              </view>
            </view>
          </template>
          <template #description>
            <view class="pl-10px">
              <view class="color-#999 font-size-12px">
                {{ item.reason }}
              </view>
            </view>
          </template>
        </wd-step>
      </wd-steps>
    </view>
    <view v-if="props.isMoreBtn && props.columns.length > 3">
      <wd-button
        block
        :round="false"
        @click="handleMore"
        custom-class="bg-#FFF4F1! bd-#FFDCD4! color-#F44D24!"
        plain
      >
        <view class="flex items-center gap-5px">
          <wd-img :src="guiji" width="20px" height="14px"></wd-img>
          <text>{{ btntext }}</text>
        </view>
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.wd-step__line) {
  @apply bl-#B0B0B0_dashed! bg-transparent;
}
</style>
