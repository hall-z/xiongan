<template>
  <view class="custom-loading-page" v-if="props.pageImage && props.remainingTime > 0">
    <image :src="props.pageImage" mode="widthFix" style="width: 100%;"/>
    <view class="skip" @click="toEndTime">{{ props.remainingTime }}s 跳过</view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomLoadingPage',
  props: {
    pageImage: {
      type: String,
      default: ''
    },
    remainingTime: {
      type: Number,
      default: 0
    }
  },
  emits: ['hide'],
  setup(props, { emit }) {
    const toEndTime = () => {
      emit('hide')
    }

    return {
      props,
      toEndTime
    }
  }
})
</script>

<style scoped>
.custom-loading-page {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999 !important;
}

.skip {
  position: absolute;
  right: 40rpx;
  bottom: 100rpx;
  padding: 4rpx 10rpx;
  background-color: rgba(0,0,0,0.3);
  color: #fff;
  border-radius: 30rpx;
  font-size: 24rpx;
}
</style>