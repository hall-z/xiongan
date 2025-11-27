<template>
  <!--pages/mallModule/bargain/myBargain/myBargain.wxml-->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view class="tab-box">
    <view
      :class="'tab-item ' + (state.tabNum === index ? 'active' : '')"
      :style="'color:' + (state.tabNum === index ? state.themeColor : '') + ';'"
      v-for="(item, index) in state.tabs"
      :key="index"
      :data-index="index"
      @click="clickNavigation"
    >
      {{ item }}
    </view>
  </view>
  <view class="bargain-list">
    <view v-for="(item, index) in state.bargainList" :key="id">
      <bargain-item :bargain-data="item" bargain-type="MY" @click="toBargainDetails"></bargain-item>
    </view>
  </view>
  <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
  <view class="order-end" :hidden="state.bargainList.length === 0 || !state.noMore">
    ~我也是有底线的~
  </view>
  <view class="no-data" :hidden="state.bargainList.length > 0">
    <image :src="state.imagesPath.imgNoData"></image>
    <button
      :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
      @click="toIndex"
    >
      随便逛逛
    </button>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiBargainServiceJs from '@/service/api/newretail/bargainService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bargainItem from '@/pages-sub/newretail/components/bargain/bargain-item/bargain-item.vue'
const app = getApp()

// pages/mallModule/bargain/myBargain/myBargain.js
const bargainService = _apiBargainServiceJs
const IMGAGESPATH = _utilsImagesPathJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs

// 获取应用实例
const state = reactive({
  navigationBarTitle: '我的砍价',
  imagesPath: IMGAGESPATH,
  tabs: ['全部', '进行中', '砍价成功', '砍价失败'],
  tabNum: 0,
  storeId: '',
  // 门店id
  bargainList: [],
  page: 1,
  pageSize: 10,
  pageCount: 1,
  noMore: false,
  loading: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
})
const localData = {
  statusEquals: '',
}
onLoad(function (options) {
  const self = this
  checkAuth()
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    // 统计PV
    state.storeId = app.globalData.storeInfo.id
    state.themeColor =
      app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor')
    ANALYSIS.PVStatistics(state.storeId)
    getBargainActivity(state.page)
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation()
      .then((res) => {
        app.globalData.storeInfo = res
        // 统计PV
        state.storeId = res.id
        ANALYSIS.PVStatistics(res.id)
        getBargainActivity(state.page)
      })
      .catch((err) => {
        console.log(err)
      })
  }
})
onReady(function () {})
onShow(function () {})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {
  state.bargainList = []
  state.mobile = ''
  state.page = 1
  state.pageCount = 1
  state.noMore = false
  onLoad(options)
  uni.stopPullDownRefresh()
})
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true
    let page = state.page
    ++page
    getBargainActivity(page)
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.bargainList.length > 0) {
      state.noMore = true
    } else {
      uni.showToast({
        title: '没有更多数据~',
        icon: 'none',
        duration: 2000,
      })
    }
  }
})
onShareAppMessage(function () {})
function getBargainActivity(page) {
  const self = this
  const postData = {
    page,
    pageSize: 10,
    searchCount: true,
    memberIdEquals: state.member.id,
    statusIn: [localData.statusEquals],
  }
  const statusIn = [localData.statusEquals]
  bargainService
    .queryInstance(postData)
    .then((res) => {
      if (localData.statusEquals !== statusIn[0]) {
        console.log('当前查询状态和已选择的状态不符')
        return
      }
      let tempList = state.bargainList
      if (page === 1) {
        tempList = []
      }
      if (res.records && res.records.length > 0) {
        res.records.forEach((item) => {
          const tempItem = {
            ...item,
            productImage: item.imageUrl ? item.imageUrl : '',
            availableStockAmount: item.activityAvailableStockAmount
              ? item.activityAvailableStockAmount
              : 0,
          }
          tempList.push(tempItem)
        })
        const pageCount = parseInt(res.recordCount / res.pageSize) + 1
        state.page = res.page
        state.pageCount = pageCount
        state.bargainList = tempList
      }
      if (state.loading) {
        state.loading = false
      }
    })
    .catch((err) => {
      util.showToast(err.message)
      if (state.loading) {
        state.loading = false
      }
    })
}
function toIndex() {
  NAVPAGE.toHome()
}
function clickNavigation(e) {
  state.tabNum = e.currentTarget.dataset.index
  state.page = 1
  state.bargainList = []
  state.pageCount = 1
  if (e.currentTarget.dataset.index === 1) {
    localData.statusEquals = 'CREATE'
  } else if (e.currentTarget.dataset.index === 2) {
    localData.statusEquals = 'SUCCESS'
  } else if (e.currentTarget.dataset.index === 3) {
    localData.statusEquals = 'FAILED'
  } else {
    localData.statusEquals = ''
  }
  // 查询当前状态下的砍价实例
  getBargainActivity(state.page)
}
function checkAuth() {
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member
      state.isMember = true
    }
    state.hasUserInfo = true
  }
}
function toBargainDetails(e) {
  if (e.detail && e.detail.id) {
    // 判断当前砍价活动是否可以购买
    const opts = '?barginInstanceId=' + e.detail.id
    NAVPAGE.toHelpBargain(opts)
  }
}
</script>
<style scoped>
/* pages/mallModule/bargain/myBargain/myBargain.wxss */

.tab-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84rpx;
  font-size: 24rpx;
  line-height: 84rpx;
  border-bottom: 20rpx solid #f1f1f1;
  padding: 0 40rpx;
}

.tab-item {
  color: #8b8b8c;
  display: flex;
  padding: 0 25rpx;
  height: 100%;
  box-sizing: border-box;
  border-bottom: 10rpx solid #fff;
}

.tab-item.active {
  color: #ff9f43;
  border-bottom: 10rpx solid #ff9f43;
}

.bargain-list {
  padding: 0 40rpx;
}

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
}

.no-data image {
  margin-top: 30%;
  width: 242rpx;
  height: 261rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: transparent;
  font-size: 24rpx;
  line-height: 60rpx;
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #fff;
  border-radius: 0;
}

.loading-btn::after {
  border: 0;
}

.order-end {
  color: #009136;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
}
</style>
