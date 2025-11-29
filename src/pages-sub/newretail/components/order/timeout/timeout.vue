<template>
  <!--components/order/timeout/timeout.wxml-->
  <!-- 付款超时弹窗 -->
  <popup :show="_show.timeOut" position="middle" custom-class="middle" @close="toggleTimeOutPopup">
    <view class="popup-content">
      <view class="popup-content-box">
        <image :src="imagesPath.iconNetworkTimeout" mode="widthFix"></image>
      </view>
      <view class="button" :style="theme.mainBgColor" @click="toggleTimeOutPopup">我知道了</view>
    </view>
  </popup>
</template>
<script setup>
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import { reactive, watch, onMounted } from 'vue'
import popup from '../../popup/popup.vue'
const app = getApp()
// components/order/timeout/timeout.js
const THEME = _utilsThemeManagerJs
const IMGAGESPATH = _utilsImagesPathJs
const UTILS = _utilsUtilsJs
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
const state = reactive({
  imagesPath: IMGAGESPATH,
  theme: {
    color: '#FF9F43',
    mainColor: 'color: #FF9F43;',
    mainBgColor: 'background: #FF9F43;',
    borderColor: 'border-color: #FF9F43;',
    mainBgGradient: 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
    mainColorRgb: 'color:rgba(255,159,67, 0.4);',
    borderColorRgb: 'border-color:rgba(255,159,67, 0.4);',
    mainColorRgb02: 'rgba(255,159,67, 0.2)',
    BgColorRgb01: 'background-color:rgba(255,159,67, 0.1);',
  },
  _show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    timeOut: false,
  },
})
const props = defineProps({
  show: {
    type: Boolean,
    value: false,
  },
})
const emit = defineEmits(['close'])
onMounted(() => {
  state.theme = {
    color:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background: ' + app.globalData.uiconfig.themeColor + ';'
        : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient:
      app.globalData.uiconfig &&
      app.globalData.uiconfig.themeColor != null &&
      app.globalData.uiconfig.themeColor !== '#FF9F43'
        ? 'background: linear-gradient(-270deg, ' +
          app.globalData.uiconfig.themeColor +
          ', ' +
          app.globalData.uiconfig.themeColor +
          ');'
        : 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
    mainColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'border-color:rgba(255,159,67, 0.4);',
    mainColorRgb02:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
        : 'rgba(255,159,67, 0.2)',
    BgColorRgb01:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
        : 'background-color:rgba(255,159,67, 0.1);',
  }
})
function toggleTimeOutPopup() {
  toggle('timeOut')
  emit('close')
}
function toggle(type) {
  state[`_show.${type}`] = !state._show[type]
}

// Watch listeners converted from observers
watch(
  () => props.show,
  (newVal, oldVal) => {
    if (newVal) {
      toggle('timeOut')
    }
  },
)
</script>
<style scoped>
/* components/order/timeout/timeout.wxss */
.popup-content {
  width: 523rpx;
  height: 594rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
}
.popup-content-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400rpx;
}
.popup-content-box image {
  width: 426rpx;
  height: 329rpx;
}
.popup-content .button {
  width: 413rpx;
  height: 88rpx;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 88rpx;
  color: #fff;
  text-align: center;
  background: #158ae3;
  margin: 45rpx auto 50rpx auto;
  border-radius: 10rpx;
}
</style>
