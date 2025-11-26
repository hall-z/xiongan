<template>
  <!--pages/mallModule/creditCard/creditCard.wxml-->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <image
    class="ad-img"
    :src="state.themeManager.BASE_URL + '/apply-top-msl.jpg'"
    mode="widthFix"
  ></image>
  <button
    open-type="contact"
    class="apply-btn"
    v-if="
      state.applyStatus === 'UNAPPLY' ||
      state.applyStatus === 'STATE_TO_BE_CONFIRM' ||
      state.applyStatus === 'ORDER_EXPIRE'
    "
  >
    <image
      class="ad-img"
      :src="state.themeManager.BASE_URL + '/apply-middle.jpg'"
      mode="widthFix"
    ></image>
  </button>
  <button @click="handleTips" class="apply-btn" v-if="state.applyStatus === 'STATE_TO_BE_AUDITED'">
    <image
      class="ad-img"
      :src="state.themeManager.BASE_URL + '/apply-middle-examine.jpg'"
      mode="widthFix"
    ></image>
  </button>
  <button @click="toMyCoupon" class="apply-btn" v-if="state.applyStatus === 'STATE_SUCCESS'">
    <image
      class="ad-img"
      :src="state.themeManager.BASE_URL + '/apply-middle-success.png'"
      mode="widthFix"
    ></image>
  </button>
  <button
    @click="toIndex"
    class="apply-btn"
    v-if="state.applyStatus === 'STATE_BLACK_LIST' || state.applyStatus === 'STATE_CLOSE'"
  >
    <image
      class="ad-img"
      :src="state.themeManager.BASE_URL + '/apply-middle-fail.jpg'"
      mode="widthFix"
    ></image>
  </button>
  <image
    class="ad-img"
    :src="state.themeManager.BASE_URL + '/apply-bottom.jpg'"
    mode="widthFix"
  ></image>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _apiCreditCardServiceJs from '@/service/api/newretail/creditCardService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/mallModule/creditCard/creditCard.js
const creditCardService = _apiCreditCardServiceJs
const NAVPAGE = _utilsNavPageJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs

// 获取应用实例
const state = reactive({
  themeManager,
  navigationBarTitle: '',
  applyStatus: 'UNAPPLY',
})
onLoad(function (options) {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const mobile = app.globalData.userInfo.member.mobile
    state.mobile = mobile
    checkApplyState(mobile)
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
})
onReady(function () {})
onShow(function () {})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
})
function toIndex() {
  NAVPAGE.toHome()
}
function toMyCoupon() {
  NAVPAGE.toMyCoupon()
}
function handleTips() {
  uni.showModal({
    title: '等待银行审核申请',
    content: '申请时长约为3-7个工作日，请您耐心等待！',
    showCancel: false,
  })
  // 模板消息功能完善后加上
  // 结果我们将通过微信消息发送给您
}
function checkApplyState(mobile) {
  creditCardService
    .applyState(mobile)
    .then((res) => {
      if (res) {
        // STATE_TO_BE_CONFIRM 待确认，STATE_TO_BE_AUDITED 待审核，STATE_SUCCESS 成功，STATE_BLACK_LIST 黑户，STATE_CLOSE 关闭,ORDER_EXPIRE 过期
        state.applyStatus = res.enumCreditCardApplyStatus
      }
    })
    .catch((err) => {
      console.log(err.message)
      // wx.showToast({
      //   title: err.message,
      //   icon: "none",
      //   duration: 2000
      // })
    })
}
</script>
<style scoped>
/* pages/mallModule/creditCard/creditCard.wxss */

page {
  font-size: 0;
}

.ad-img {
  width: 100%;
  height: 100%;
  margin: 0;
}

.apply-btn {
  width: 100%;
  height: 510rpx;
  background: transparent;
  border: none;
  padding: 0;
}

.apply-btn::after {
  border: none;
}
</style>
