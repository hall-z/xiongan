<template>
  <!--components/home-page/banner/banner.wxml-->
  <view class="banner-box no-data" :hidden="loaded && bannersA !== 0">
    <view class="banner-content"></view>
    <view class="dots"></view>
  </view>
  <!-- bindtap="bannerJumping" -->
  <view
    class="banner-box1"
    :style="'margin: ' + moduleSpacing + 'px 0;padding: 0 ' + pageMargin + 'px'"
    :hidden="!loaded || showInfo !== 'fenqu'"
  >
    <image lazy-load="" :src="imageUrl" class="slide-image" mode="widthFix"></image>
    <view
      :style="
        'position: absolute;left: ' +
        (item.xAxis || 0) +
        'px;top: ' +
        (item.yAxis || 0) +
        'px;transform: rotate(' +
        (item.angle || 0) +
        'deg);width: ' +
        item.fenquWidth +
        'px;height: ' +
        item.fenquHeight +
        'px'
      "
      v-for="(item, index) in bannersA"
      :key="index"
      :data-item="item"
      :data-id="item.id"
      @click="bannerJumping"
    ></view>
  </view>
  <view
    class="banner-box1"
    :style="'margin: ' + moduleSpacing + 'px 0;padding: 0 ' + pageMargin + 'px'"
    :hidden="!loaded || bannersA.length > 1 || showInfo === 'fenqu'"
  >
    <image
      lazy-load=""
      v-for="(item, index) in bannersA"
      :key="index"
      :src="item.imageUrl"
      :data-id="item.id"
      @click="bannersA[0] && bannersA[0].isLongPressRecognition ? '' : 'bannerJumping'"
      class="slide-image"
      mode="widthFix"
      :show-menu-by-longpress="bannersA[0] && bannersA[0].isLongPressRecognition ? true : false"
      :style="'border-radius:' + configData.fillet + 'px'"
    ></image>
  </view>
  <view
    class="banner-box"
    :style="
      'height: ' +
      (type != 'good' ? bannersA[0].imageHeight + 'rpx' : imgHeight + 'px') +
      ';margin: ' +
      moduleSpacing +
      'px 0;padding: 0 ' +
      pageMargin +
      'px'
    "
    :hidden="!loaded || bannersA.length <= 1 || showInfo === 'fenqu'"
  >
    <swiper
      class="swiper"
      :style="'height: ' + (type != 'good' ? bannersA[0].imageHeight + 'rpx' : imgHeight + 'px')"
      autoplay="true"
      :interval="rotationSpeed || 3000"
      circular="true"
      :current="swiperCurrent"
      @change="dotChange"
      @animationfinish="swiperChange"
    >
      <view
        v-for="(item, index) in bannersA"
        :key="index"
        v-if="
          !item.beginTimeStamp ||
          !item.endTimeStamp ||
          (item.beginTimeStamp < timeNumber && timeNumber < item.endTimeStamp)
        "
      >
        <swiper-item
          class="swiper-item"
          :data-item="item"
          :data-id="item.id"
          @click="bannerJumping"
        >
          <image
            lazy-load=""
            v-if="type != 'good'"
            :src="item.imageUrl"
            class="slide-image"
            :style="'border-radius:' + configData.fillet + 'px'"
          ></image>
          <image
            lazy-load=""
            v-else
            mode="widthFix"
            :src="item.imageUrl"
            class="slide-image"
          ></image>
        </swiper-item>
      </view>
    </swiper>
    <view class="dots" v-if="bannersA.length > 1">
      <view
        v-for="(item, index) in bannersA"
        :key="index"
        v-if="
          !item.beginTimeStamp ||
          !item.endTimeStamp ||
          (item.beginTimeStamp < timeNumber && timeNumber < item.endTimeStamp)
        "
      >
        <view
          class="dot"
          :style="index == currentDot ? 'background-color:' + themeColor : ''"
        ></view>
      </view>
    </view>
  </view>
  <signin :show="signShow" @close="handleMemberSignInClose"></signin>
</template>
<script setup>
import _utilsSelfJs from '@/utils/newretail/self'
import _homePageCommonBehaviorJs from '../homePageCommonBehavior'
import _lazyLoadPageLazyLoadBaseJs from '../../lazy-load-page/lazy-load-base'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _apiBannerServiceJs from '@/service/api/newretail/bannerService'
// import { ready } from "@dcloudio/uni-app";
import { reactive, watch } from 'vue'
import signin from '../signin/signin.vue'
const app = getApp()
// components/home-page/banner/banner.js
const bannerService = _apiBannerServiceJs
const THEME = _utilsThemeManagerJs
const UTILS = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs
const homePageCommonBehavior = _homePageCommonBehaviorJs
const self = _utilsSelfJs
// 获取应用实例
const state = reactive({
  themeColor: THEME.color,
  loaded: false,
  // loaded: true,
  bannersA: [],
  swiperCurrent: 0,
  currentDot: 0,
  storeId: '',
  signShow: false,
})
const props = defineProps({
  timeNumber: {
    type: Number,
    value: 0,
  },
  showInfo: {
    // 属性名
    type: String,
    value: '',
  },
  imgHeight: {
    type: Number,
    value: 0,
  },
  imageUrl: {
    // 属性名
    type: String,
    value: '',
  },
  show: {
    // 属性名
    type: Boolean,
    value: false,
  },
  rotationSpeed: {
    // 属性名
    type: Number,
    value: 3000,
  },
  banners: {
    // 商品信息
    type: Array,
  },
  type: {
    type: String,
  },
  moduleSpacing: {
    // 属性名
    type: Number,
    value: 0,
  },
  pageMargin: {
    // 属性名
    type: Number,
    value: 0,
  },
  refreshType: {
    // 属性名
    type: String,
    value: '',
  },
  configData: {
    // 配置项数据
    type: Object,
    value: {},
  },
})
watch(
  () => props.banners,
  (newVal, oldVal) => {
    state.bannersA = newVal
  },
)
ready(function () {
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
})
function reload(refresh = false) {
  const that = this
  if (!state.loaded) {
    lazyLoadBase
      .determineComponentInVisibleArea('.banner-box', that)
      .then((res) => {
        if (res) {
          // that.getBannerList(that.data.storeId)
          state.loaded = true
        }
      })
      .catch((err) => {
        console.log(err)
      })
  } else if (refresh) {
    // that.getBannerList(that.data.storeId)
  }
}
function handleStore() {
  if (app.globalData.storeInfo) {
    state.storeId = app.globalData.storeInfo.id
  }
}
function getBannerList(storeId) {
  const that = this
  if (state.refreshType !== '' && state.refreshType !== 'USER') {
    if (state.hasQuery) {
      return
    }
  }
  state.hasQuery = true
  triggerEvent('banner', state.bannersA)
  bannerService
    .getStoreBannerList('HOME', storeId)
    .then((res) => {
      triggerEvent('banner', res)
      state.bannersA = res
      state.swiperCurrent = 0
      state.currentDot = 0
    })
    .catch((err) => {
      if (err.message != null) {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function swiperChange(e) {
  state.swiperCurrent = e.detail.current
}
function dotChange(e) {
  state.currentDot = e.detail.current
}

// Watch listeners converted from observers
watch(
  () => props.show,
  (newVal, oldVal) => {
    // 属性值变化时执行
    if (app.globalData.storeInfo) {
      handleStore()
      reload(true)
    }
  },
)

watch(
  () => props.refreshType,
  (newVal, oldVal) => {
    // 属性值变化时执行
    if (newVal !== '' && newVal !== 'USER') {
      handleStore()
      state.hasQuery = false
      reload(true)
    }
  },
)
</script>
<style scoped>
/* components/home-page/banner/banner.wxss */
.banner-box {
  width: 100%;
  /* padding: 0 40rpx; */
  box-sizing: border-box;
  height: 422rpx;
  margin-bottom: 15px;
}
.banner-box1 {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}
.banner-box1 image {
  width: 100%;
  vertical-align: middle;
  border-radius: 20rpx;
}
.banner-content {
  width: 100%;
  height: 330rpx;
  background: #efefef;
  border-radius: 18rpx;
}
.banner-box .dots {
  position: relative;
  margin-top: -35rpx;
  display: flex;
  justify-content: center;
}
.no-data {
  margin-bottom: 20rpx;
}
.banner-box.no-data .dots {
  width: 30rpx;
  height: 14rpx;
  background: #eee;
  border-radius: 8rpx;
  margin: 15rpx auto;
}
.banner-box .dots .dot {
  margin: 0 8rpx;
  width: 20rpx;
  height: 5rpx;
  background: #eee;
  /* border-radius: 8rpx;    */
  transition: all 0.6s;
}
.banner-box .dots .dot.active {
  width: 24rpx;
  background: #ff7e00;
}
.swiper {
  width: 100%;
  height: 422rpx;
  /* border-radius: 18rpx; */
  overflow: hidden;
}
.swiper-item {
  width: 100%;
  height: 100%;
  margin-right: 40rpx;
  /* border-radius: 18rpx; */
}
/* .swiper .wx-swiper-dot-active {
  width: 24rpx;
  border-radius: 6rpx;
  background: #FF7E00;
}
.swiper .wx-swiper-dot-active::before {
  background: #FF7E00;
} */
.banner-box image {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
