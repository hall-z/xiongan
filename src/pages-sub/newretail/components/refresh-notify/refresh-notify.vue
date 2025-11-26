<template>
<!-- components/refresh-notify/refresh-notify.wxml -->
<popup :show="show.top2" position="top2" custom-class="top2" @touchmove.stop="catchtouchmove">
  <view class="refresh-notify-content">
    <view class="refresh-notify">
      <image :animation="animation" :src="image"></image>
      <text>如找不到对应门店，请下拉刷新</text>
    </view>
    <button class="refresh-notify-btn" @click="toggleTopPopup">我知道了</button>
  </view>
</popup>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import { reactive } from "vue";
import popup from '../popup/popup.vue';
// components/refresh-notify/refresh-notify.js
const IMGAGESPATH = _utilsImagesPathJs;
const utils = _utilsUtilsJs;
const state = reactive({
  rate: 1,
  // 比率，用于不同分辨率设备兼容
  show: {
    top2: false
  },
  animation: {},
  //刷新提示动画
  dropDownTime: 0,
  imagesPath: IMGAGESPATH
});
const props = defineProps({
  image: {
    type: String,
    value: ''
  }
});
function attached() {
  // 在组件实例进入页面节点树时执行
  if (state.image === '') {
    state.image = state.imagesPath.iconRefreshNotify;
  }
  popupDropDownTips();
}
function detached() {
  // 在组件实例被从页面节点树移除时执行
  clearInterval(state.dropDownTime);
}
function checkPopupQualifications(val) {
  if (val != null) {
    // 如何设置了需要返回的结果直接返回结果
    return val;
  } else {
    try {
      const time = uni.getStorageSync('wj_refreshNotify');
      if (time) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      // Do something when catch error
      return false;
    }
  }
}
function popupDropDownTips() {
  if (checkPopupQualifications()) {
    const baseWidthUnit = 375; // 以iPhone6的分辨率为基准
    let windowWidth = {
      // ...wx.getSystemInfoSync(),
      ...uni.getSystemSetting(),
      ...uni.getAppAuthorizeSetting(),
      ...uni.getDeviceInfo(),
      ...uni.getWindowInfo(),
      ...uni.getAppBaseInfo()
    }.windowWidth;
    let rate = windowWidth / baseWidthUnit; // 计算出当前设备分辨率与标准分辨率的比率
    state.rate = rate;
    toggleTopPopup();
    if (state.show.top2) {
      // 设置按钮的缩放动画
      let animation = uni.createAnimation({
        duration: 800,
        timingFunction: 'linear'
      });
      const moveUnit = 20 * state.rate;
      animation.translateY(moveUnit).step().translateY(0).step();
      let dropDownTime = setInterval(function () {
        animation.translateY(moveUnit).step().translateY(0).step();
        this.setData({
          animation: animation,
          dropDownTime: dropDownTime
        });
      }.bind(this), 800);
    }
  }
}
function toggleTopPopup() {
  toggle('top2');
  if (state.show.top2) {
    let now = new utils.ResponseDate().getTime();
    try {
      uni.setStorageSync('wj_refreshNotify', now);
    } catch (e) {}
  }
}
function catchtouchmove() {}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
</script>
<style scoped>
/* components/refresh-notify/refresh-notify.wxss */
.refresh-notify-content{
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.refresh-notify {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 80rpx;
}

.refresh-notify image {
  width: 107rpx;
  height: 105rpx;
}

.refresh-notify text {
  color: #ffffff;
  font-size: 30rpx;
  margin-top: 87rpx;
}

.refresh-notify-btn {
  border: 2rpx solid #ffffff;
  color: #ffffff;
  width: 360rpx;
  height: 90rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  background: transparent;
  line-height: 90rpx;
  margin-bottom: 40%;
}

.refresh-notify-btn::after {
  border: 0;
}
</style>