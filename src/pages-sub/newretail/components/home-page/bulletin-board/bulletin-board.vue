<template>
  <!--components/home-page/bulletin-board/bulletin-board.wxml-->
  <view class="hotNotice-box no-data" :hidden="loaded && isShow">
    <image lazy-load=""></image>
    <view class="swiper_item"></view>
    <view class="moreNotice"></view>
  </view>
  <view class="hotNotice-box" v-if="noticeList.length != 0">
    <!-- <image lazy-load="" :src="tongz" class="hot-point"></image> -->
    <swiper
      class="swiper_container"
      vertical="true"
      autoplay="true"
      circular="true"
      interval="2000"
    >
      <view v-for="(item, index) in noticeList" :key="key">
        <swiper-item>
          <view
            class="swiper_item"
            @click="jumptoDetail"
            :data-notice-obj="item"
            :style="colour ? 'color: ' + colour : ''"
          >
            {{ item.title }}
          </view>
        </swiper-item>
      </view>
    </swiper>
    <!-- <image lazy-load class="right-icon" src='{{imagesPath.icon_more}}'></image> -->
    <view class="moreNotice" @click="moreNotice" :style="colour ? 'color: ' + colour : ''">
      更多>>
    </view>
  </view>
</template>
<script setup>
// import tongz from '@/utils/newretail/newretail/image/tongz.png'
import _lazyLoadPageLazyLoadBaseJs from '../../lazy-load-page/lazy-load-base'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _apiBannerServiceJs from '@/service/api/newretail/bannerService'
import { reactive, watch } from 'vue'
const app = getApp()
// components/home-page/bulletin-board/bulletin-board.js
const bannerService = _apiBannerServiceJs
const THEME = _utilsThemeManagerJs
const UTILS = _utilsUtilsJs
const IMGAGESPATH = _utilsImagesPathJs
const NAVPAGE = _utilsNavPageJs
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs
// 获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  loaded: false,
  isShow: false,
  noticeList: [],
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
    value: {},
  },
  refreshType: {
    // 属性名
    type: String,
    value: '',
  },
  colour: {
    // 属性名
    type: String,
    value: null,
  },
})
function reload() {
  const that = this
  if (!state.loaded) {
    lazyLoadBase
      .determineComponentInVisibleArea('.hotNotice-box', that)
      .then((res) => {
        if (res) {
          state.loaded = true
          getNotice()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  } else if (state.refreshType === 'ALL') {
    getNotice()
  }
}
function getNotice() {
  console.log('执行获取公告信息接口')
  const that = this
  if (state.refreshType !== 'ALL') {
    if (state.hasQuery) {
      return
    }
  }
  state.hasQuery = true
  const postData = {
    page: 1,
    pageSize: 0,
  }
  bannerService
    .getNoticeList(postData)
    .then((res) => {
      state.noticeList = res.records
      state.isShow = true
    })
    .catch((err) => {
      console.log('查询公告失败')
      console.log(err)
      state.isShow = true
    })
}
function moreNotice() {
  NAVPAGE.toSysNotice()
}
function jumptoDetail(e) {
  const noticeObj = e.target.dataset.noticeObj
  NAVPAGE.toAdPage(noticeObj, 'banner')
}

// Watch listeners converted from observers
watch(
  () => props.show,
  (newVal, oldVal) => {
    // 属性值变化时执行
    if (newVal) {
      reload()
    }
  },
)

watch(
  () => props.value,
  (newVal, oldVal) => {
    // 属性值变化时执行
    reload()
  },
)

watch(
  () => props.refreshType,
  (newVal, oldVal) => {
    // 属性值变化时执行
    if (newVal === 'ALL') {
      reload()
    }
  },
)
</script>
<style scoped>
/* components/home-page/bulletin-board/bulletin-board.wxss */
.hotNotice-box {
  padding: 0 20rpx 0 20rpx;
  height: 50rpx;
  overflow: hidden;
}
.hotNotice-box .hot-point {
  width: 30rpx;
  height: 35rpx;
  margin-top: 8rpx;
  margin-right: 20rpx;
  float: left;
}
.hotNotice-box .swiper_container {
  width: 70vw;
  height: 50rpx;
  margin-top: 4rpx;
  float: left;
}
.hotNotice-box .swiper_item {
  height: 44rpx;
  line-height: 44rpx;
  font-size: 24rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hotNotice-box .moreNotice {
  font-size: 24rpx;
  color: #060606;
  text-align: right;
  height: 44rpx;
  line-height: 44rpx;
  margin-top: 4rpx;
  float: right;
  position: relative;
  right: 20rpx;
}
.hotNotice-box .moreNotice image {
  width: 15rpx;
  height: 15rpx;
  margin-left: 8rpx;
  position: absolute;
  top: 16rpx;
}
.no-data {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.no-data image,
.no-data .swiper_item,
.no-data .moreNotice {
  /* background: #f7f7f7; */
}
.no-data .moreNotice {
  width: 65rpx;
}
.no-data .swiper_item {
  width: 70vw;
}
</style>
