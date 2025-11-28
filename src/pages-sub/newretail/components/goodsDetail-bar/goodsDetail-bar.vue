<template>
  <!--components/goodsDetail-bar/goodsDetail-bar.wxml-->
  <wd-navbar
    :loading="loading"
    :show="show"
    :animated="animated"
    :color="color"
    style="position: fixed; z-index: 90"
    :title="title"
    :back="back"
  >
    <template v-slot:left>
      <view :class="'left-navigation-bar-box ' + (hideBack ? 'no-back' : '')" v-if="!isTabbar">
        <view class="navigation_bar_btn_goback" @click="goBack" v-if="!hideBack">
          <image class="" :src="imagesPath.navigation_bar_btn_goback" mode="widthFix"></image>
        </view>
        <view class="navigation_bar_btn_gohome" @click="goHome">
          <image :src="imagesPath.navigation_bar_btn_gohome" mode="widthFix"></image>
        </view>
      </view>
    </template>
  </wd-navbar>
  <!-- background="{{background}}" -->
</template>
<script setup>
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
// import { attached, ready } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// components/navigation-bar/navigation-bar.js
const IMGAGESPATH = _utilsImagesPathJs
const UTILS = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs

// 获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  isTabbar: false,
  hideBack: false,
})
const props = defineProps({
  title: {
    type: String,
    value: '',
  },
  background: {
    type: String,
    value: '#ffffff',
  },
  color: {
    type: String,
    value: '#333333',
  },
  back: {
    type: Boolean,
    value: false,
  },
  loading: {
    type: Boolean,
    value: false,
  },
  animated: {
    type: Boolean,
    value: true,
  },
  show: {
    type: Boolean,
    value: true,
  },
})
attached(function () {
  if (state.title === '') {
    state.title = app.globalData.navigationBarTitleText
  }
  const currentPages = UTILS.utilGetCurrentPage()
  const pageStack = getCurrentPages()
  if (pageStack.length === 1) {
    state.hideBack = true
  }
  let pagePath = currentPages.route
  pagePath.indexOf('/') != 0 && (pagePath = '/' + pagePath)
  const self = this
  if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
    app.globalData.tabBar.list.forEach((item) => {
      if (pagePath === item.pagePath) {
        state.isTabbar = true
      }
    })
  }
  if (
    pagePath === '/pages-sub/newretail/pages/wxfaceapp/index/index' ||
    pagePath === '/pages-sub/newretail/pages/wxfaceapp/payment/payment'
  ) {
    state.isTabbar = true
  }
  console.log(state.isTabbar)
})
ready(function () {})
function goBack() {
  uni.navigateBack({
    delta: 1,
  })
}
function goHome() {
  NAVPAGE.toHome()
}
</script>
<style scoped>
/* components/goodsDetail-bar/goodsDetail-bar.wxss */

.left-navigation-bar-box {
  width: 176rpx;
  height: 64rpx;
  border: 1rpx solid #e7e7e7;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
  opacity: 0.6;
}

.left-navigation-bar-box.no-back {
  width: 88rpx;
}

.left-navigation-bar-box image {
  width: 33rpx;
  height: 33rpx;
}

.navigation_bar_btn_goback,
.navigation_bar_btn_gohome {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.navigation_bar_btn_gohome {
  position: relative;
}

.navigation_bar_btn_gohome::before {
  content: '';
  display: block;
  width: 1px;
  height: 35rpx;
  background: #cdcdcd;
  border-radius: 1px;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -17rpx;
}

.left-navigation-bar-box.no-back .navigation_bar_btn_gohome::before {
  display: none;
}
</style>
