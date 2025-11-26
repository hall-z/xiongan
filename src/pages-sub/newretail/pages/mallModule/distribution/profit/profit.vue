<template>
<!--pages/distribution/profit/profit.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
  <view class="profit-item" v-for="(item , index) in state.profitList" :key="idx">
    <view class="info">
      {{item.createTime}}
    </view>
    <text class="total">+{{item.total}}</text>
    <view class="status">
      <text :class="'status-text ' + item.state">{{item.stateText}}</text>
      <image @click="tapFailInfo" :src="state.imagesPath.redQuestionMark" class="status-question" :hidden="item.state !== 'ADMISSIONFAILED' && item.state !== 'REFUSED'" :data-reason="item.state === 'ADMISSIONFAILED' ? item.failedReason : item.refusedReason"></image>
    </view>
  </view>
  
</view>
<button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
<view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view> 
<view class="no-data" :hidden="state.profitList.length > 0">
  <image :src="state.imagesPath.imgNoData"></image>
</view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiBackCashServiceJs from "@/service/api/newretail/backCashService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/distribution/profit/profit.js
const backCashService = _apiBackCashServiceJs;
const utils = _utilsUtilsJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "我的提现明细",
  imagesPath: IMGAGESPATH,
  profitList: [],
  page: 1,
  mobile: '',
  pageSize: 10,
  pageCount: 1,
  noMore: false,
  loading: false
});
onLoad(function (options) {
  uni.hideShareMenu();
  const that = this;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member;
      state.mobile = app.globalData.userInfo.member.mobile;
      handelQueryList(state.page);
    } else {
      uni.showToast({
        title: '您还不是会员，请先绑定手机号码成为会员',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    try {
      uni.showModal({
        title: '提示',
        content: '请登录后查看',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            uni.switchTab({
              url: '../my/my'
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    } catch (error) {}
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  state.profitList = [];
  state.mobile = '';
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  onLoad();
  setTimeout(() => {
    // 特别处理iOS下有loading时下拉刷新秒回弹的问题
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    let page = state.page;
    ++page;
    handelQueryList(page);
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.profitList.length > 0) {
      state.noMore = true;
    } else {
      uni.showToast({
        title: '没有更多数据~',
        icon: 'none',
        duration: 2000
      });
    }
  }
});
function tapFailInfo(e) {
  uni.showModal({
    title: '原因',
    content: e.currentTarget.dataset.reason,
    success: function (res) {
      if (res.confirm) {} else if (res.cancel) {}
    }
  });
}
onShareAppMessage(function () {});
function handelQueryList(page) {
  const that = this;
  backCashService.query(page, state.pageSize, state.member.id, state.mobile, true).then(res => {
    console.log(res);
    if (res && res.records && res.records.length >= 0) {
      let tempProfitList = state.profitList;
      res.records.forEach(item => {
        //INITIALIZED待审核、AUDIT已审核、REFUSED已拒绝、ADMISSION已入账、ADMISSIONFAILED入账失败
        let stateText = '';
        if (item.state == "INITIALIZED") {
          stateText = '待审核';
        } else if (item.state == 'AUDIT') {
          stateText = '已审核';
        } else if (item.state == 'REFUSED') {
          stateText = '已拒绝';
        } else if (item.state == 'ADMISSION') {
          stateText = '已入账';
        } else if (item.state == 'ADMISSIONFAILED') {
          stateText = '入账失败';
        }
        tempProfitList.push({
          ...item,
          stateText: stateText
        });
      });
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
      state.page = res.page;
      state.pageCount = pageCount;
      state.profitList = tempProfitList;
    }
    if (state.loading) {
      state.loading = false;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
    if (state.loading) {
      state.loading = false;
    }
  });
}
</script>
<style scoped>
/* pages/distribution/profit/profit.wxss */

.content {
  padding: 0 30rpx;
}

.profit-item {
  border-bottom: 1rpx solid #ebebeb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 140rpx;
}

.profit-item .info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  line-height: 36rpx;
  font-size: 28rpx;
}

.profit-item .info text {
  display: block;
}

.profit-item .info .genre {
  font-size: 28rpx;
  color: #000;
  margin-bottom: 12rpx;
}

.profit-item .info .time {
  font-size: 24rpx;
  color: #999;
}

.profit-item .total {
  font-size: 36rpx;
  color: #ff8561;
}

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  margin-top: 50%;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #ffffff;
  border-radius: 0
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

.status {
  display: flex;
  align-items: center;
}

.status-text.INITIALIZED {
  color: #ff8561;
  font-size: 30rpx;
}

.status-text.AUDIT {
  color: #2ea22f;
  font-size: 30rpx;
}

.status-text.REFUSED {
  color: red;
  font-size: 30rpx;
}

.status-text.ADMISSIONFAILED {
  color: red;
  font-size: 30rpx;
}

.status-text.ADMISSION {
  color: #2ea22f;
  font-size: 30rpx;
}

.status-question {
  width: 30rpx;
  height: 30rpx;
}
</style>