<template>
  <!--components/home-page/collection/collection.wxml-->
  <!-- <view class="push-collect-content" style="{{isSearchFixed ? 'position: fixed;z-index:2;left: 0;top:' + navHeight + 'px;' : 'position: relative;'}}">
  <view class="push-collect-box" style="{{theme.mainBgColor}}" wx:if="{{loaded}}">
    <view>添加到我的小程序，购物更快捷</view>
    <view class="add" style="{{theme.mainColor}}" bind:tap="showPop">添加</view>
  </view>
  <view class="push-collect-loading" wx:else></view>
</view> -->
  <view class="push-collec-block" v-if="state.isSearchFixed"></view>
  <view class="push-collec-pop" v-if="!state.isPushCollectShowed" @click.stop="toHidePushCollect">
    <image
      lazy-load=""
      :style="'top:' + navHeight || 0 + 'px;'"
      class="push-collect-board"
      mode="widthFix"
      :src="state.imagesPath.pushCollect"
    ></image>
  </view>
</template>
<script setup>
import _homePageCommonBehaviorJs from '../homePageCommonBehavior'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _lazyLoadPageLazyLoadBaseJs from '../../lazy-load-page/lazy-load-base'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
// import { ready } from "@dcloudio/uni-app";
import { reactive, watch, onMounted, onBeforeMount } from 'vue'
const app = getApp()
// components/home-page/collection/collection.js
const IMGAGESPATH = _utilsImagesPathJs
const THEMEMANAGER = _utilsThemeManagerJs
const NAVPAGE = _utilsNavPageJs
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs
const AUTHORIZE = _utilsAuthorizeJs
const homePageCommonBehavior = _homePageCommonBehaviorJs
// 获取应用实例
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
  theme: THEMEMANAGER,
  loaded: false,
  isSearchFixed: false,
  // 是否已经显示过提示用户收藏小程序的弹窗
  isPushCollectShowed: true,
})
const props = defineProps({
  show: {
    // 属性名
    type: Boolean,
    value: false,
  },
  pageScrollData: {
    // 属性名
    type: Object,
    value: null,
  },
})
onMounted(function () {
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
function reload(refresh = false) {
  const that = this
  if (!state.loaded) {
    lazyLoadBase
      .determineComponentInVisibleArea('.push-collect-loading', that)
      .then((res) => {
        if (res) {
          state.loaded = true
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
function showPop() {
  state.isPushCollectShowed = false
}
function toHidePushCollect() {
  app.globalData.isPushCollectShowed = true
  state.isPushCollectShowed = true
  try {
    uni.setStorageSync('wj_showPushCollectShowed', true)
  } catch (e) {}
  triggerEvent('pushCollect', true)
}

// Watch listeners converted from observers
watch(
  () => props.show,
  (newVal, oldVal) => {
    // 属性值变化时执行
    if (newVal !== '') {
      reload()
    }
  },
)

watch(
  () => props.pageScrollData,
  (e, o) => {
    // 属性值变化时执行
    if (e.scrollTop > 0 && !state.isSearchFixed) {
      state.isSearchFixed = true
    } else if (e.scrollTop === 0 && state.isSearchFixed) {
      state.isSearchFixed = false
    }
  },
)
</script>
<style scoped>
/* components/home-page/collection/collection.wxss */
.push-collect-content {
  width: 100%;
  height: 86rpx;
  background: #ffffff;
}
.push-collect-loading {
  width: 650rpx;
  padding: 0 30rpx;
  height: 74rpx;
  margin: 0 auto 12rpx;
  border-radius: 37rpx;
  background: #f1f1f1;
}
.push-collect-block {
  width: 100%;
  height: 86rpx;
}
.push-collect-box {
  width: 650rpx;
  padding: 0 30rpx;
  height: 74rpx;
  color: #fff;
  font-size: 26rpx;
  line-height: 74rpx;
  border-radius: 37rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto 12rpx;
}
.push-collect-box view.add {
  width: 110rpx;
  height: 48rpx;
  line-height: 48rpx;
  background: #fff;
  border-radius: 24rpx;
  text-align: center;
}
.push-collec-pop {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
}
.push-collect-board {
  position: fixed;
  width: 432rpx;
  height: 166rpx;
  top: 0rpx;
  right: 48rpx;
  z-index: 5;
}
</style>
