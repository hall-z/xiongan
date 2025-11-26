<template>
  <!--pages/mallModule/bargain/bargainList/bargainList.wxml-->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view
    class="bargain-list"
    :hidden="state.bargainList.length <= 0"
    :style="'background-image: url(' + state.imagesPath.barga_bg + ');'"
  >
    <view class="title">
      <image :src="pricetitle" mode="widthFix"></image>
    </view>
    <view v-for="(item, index) in state.bargainList" :key="item.id">
      <bargain-item
        :bargain-data="item"
        bargain-type="BUY"
        @click="toBargainDetails"
      ></bargain-item>
    </view>
  </view>
  <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
  <!-- <view class="order-end" hidden="{{!noMore}}">~我也是有底线的~</view> -->
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
import pricetitle from '@/utils/newretail/image/pricetitle.png'
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
import navigationBar from '@/pages-sub/newretail/components/navigation-bar/navigation-bar.vue'
const app = getApp()

// pages/mallModule/bargain/bargainList/bargainList.js
const bargainService = _apiBargainServiceJs
const IMGAGESPATH = _utilsImagesPathJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs

// 获取应用实例
const state = reactive({
  navigationBarTitle: '砍价列表',
  imagesPath: IMGAGESPATH,
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
onLoad(function (options) {
  const self = this
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
  if (onLoadQuery) {
    console.log('正在查询...')
    return
  }
  onLoadQuery = true
  const storeIdIn = [state.storeId]
  // ADDRESS.getDistributionStore().then(res => {
  //   if (res) {
  //     storeIdIn.push(res.id)
  //   }
  //   self.handleGetBargainActivity(page, [self.data.storeId])
  // }).catch(err => {
  //   self.handleGetBargainActivity(page, [self.data.storeId])
  // })
  handleGetBargainActivity(page, storeIdIn)
}
function handleGetBargainActivity(page, storeIdIn) {
  const self = this
  const postData = {
    page,
    pageSize: 10,
    searchCount: true,
    storeIdIn: storeIdIn.join(','),
    statusEquals: 'SUBMIT', // 查询已提交的
  }
  bargainService
    .query(postData)
    .then((res) => {
      onLoadQuery = false
      const tempList = state.bargainList
      if (res.records && res.records.length > 0) {
        res.records.forEach((item) => {
          const tempItem = {
            ...item,
          }
          if (item.isActive) {
            tempList.push(tempItem)
          }
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
      onLoadQuery = false
      util.showToast(err.message)
      if (state.loading) {
        state.loading = false
      }
    })
}
function toIndex() {
  NAVPAGE.toHome()
}
function toBargainDetails(e) {
  if (e.detail && e.detail.id) {
    // 判断当前砍价活动是否可以购买
    const opts = '?barginId=' + e.detail.id
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      const postData = {
        page: 1,
        pageSize: 1,
        searchCount: true,
        memberIdEquals: app.globalData.userInfo.member.id,
        activityIdEquals: e.detail.id,
        statusIn: ['CREATE', 'SUCCESS'],
      }
      bargainService
        .queryInstance(postData)
        .then((res) => {
          if (!res || !res.records || res.records.length === 0) {
            NAVPAGE.toBargainDetails(opts)
            return
          }
          if (res.records.length > 0) {
            const opts = '?barginInstanceId=' + res.records[0].id
            NAVPAGE.toHelpBargain(opts)
          }
        })
        .catch((err) => {
          util.showToast(err.message)
        })
    } else {
      NAVPAGE.toBargainDetails(opts)
    }
  }
}
</script>
<style scoped>
/* pages/mallModule/bargain/bargainList/bargainList.wxss */
.bargain-list {
  min-height: 90vh;
  padding: 20rpx;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.bargain-list .title {
  width: 309rpx;
  height: 51rpx;
  margin: 34rpx auto;
  /* background: ; */
}
.bargain-list .title image {
  width: 100%;
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
