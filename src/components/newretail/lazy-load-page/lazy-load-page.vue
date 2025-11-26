<template>
  <view v-if="props.show" style="position: relative; padding-bottom: 60rpx">
    <!-- 这里将添加各种页面组件 -->
    <slot></slot>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'LazyLoadPage',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    ownModule: {
      type: String,
      default: '',
    },
    storeId: {
      type: String,
      default: '',
    },
    refreshType: {
      type: String,
      default: '',
    },
    pageScrollData: {
      type: Object,
      default: () => ({}),
    },
    shopCart: {
      type: Object,
      default: () => ({}),
    },
    latitudeAndLongitude: {
      type: String,
      default: '',
    },
  },
  emits: [
    'upDataPageConfig',
    'officialAccountLoad',
    'officialAccountError',
    'refresh',
    'pushCollect',
  ],
  setup(props, { emit }) {
    // 这里将添加组件逻辑

    return {
      props,
    }
  },
})
</script>
