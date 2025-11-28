<template>
  <!--components/customLoadingPage/customLoadingPage.wxml-->
  <view class="custom-loading-page">
    <image :src="props.pageImage" mode="widthFix" style="width: 100%"></image>
    <view @click="toEndTime" class="skip">{{ remainingTime1 }}s 跳过</view>
  </view>
</template>
<script setup>
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import { reactive, watch } from 'vue'
// components/customLoadingPage/customLoadingPage.js
const sysService = _apiSystemServiceJs
const state = reactive({})
const props = defineProps({
  pageImage: String,
  remainingTime: {
    type: Number,
    value: 0,
  },
})
let remainingTime1 = props.remainingTime
const emit = defineEmits(['Hide'])
function attached() {}
function moved() {}
function detached() {}
function toEndTime() {
  emit('Hide')
}

// Watch listeners converted from observers
watch(
  () => props.remainingTime,
  (newVal, oldVal) => {
    remainingTime1 = newVal
    if (newVal === 0) {
      emit('Hide')
    }
  },
)
</script>
<style scoped>
/* components/customLoadingPage/customLoadingPage.wxss */
.custom-loading-page {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  /* background-color: rgba(0, 0, 0, 0.4); */
  z-index: 9999 !important;
}
.skip {
  position: absolute;
  right: 40rpx;
  bottom: 100rpx;
  padding: 4rpx 10rpx;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  border-radius: 30rpx;
}
</style>
