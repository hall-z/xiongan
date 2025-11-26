<template>
<!--pages/balance/balancePayList/balancePayList.wxml-->
<view>
<view class="pay-item" v-for="(item , index) in state.payList" :key="index">
  <view class="status">
    <text v-if="item.state">{{filtAction.filtAction(item.action)}}</text>
    <text v-if="!item.state" class="consume">{{filtAction.filtAction(item.action)}}</text>
    <text>{{item.tranTime}}</text>
  </view>
  <view v-if="item.state" class="count">
    +{{item.occurTotal}}
  </view>
  <view v-if="!item.state" class="count consume">
    {{item.occurTotal}}
  </view>
</view></view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiRechargeServiceJs from "@/service/api/newretail/rechargeService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/balance/balancePayList/balancePayList.js
const rechargeService = _apiRechargeServiceJs;
const auth = _utilsAuthJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "储值明细",
  imagesPath: IMGAGESPATH,
  payList: [],
  mobile: '',
  page: 1,
  pageSize: 20,
  pageCount: 1
});
onLoad(function (options) {
  let _userInfo = auth.getUser();
  // console.log(_userInfo)
  if (_userInfo && _userInfo.member) {
    state.mobile = _userInfo.member.mobile;
  }
  handelQueryList(state.page);
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
  state.payList = [];
  state.mobile = '';
  state.page = 1;
  state.pageCount = 1;
  onLoad();
  uni.stopPullDownRefresh();
});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    let page = state.page;
    ++page;
    handelQueryList(page);
  } else {
    // 没有下一页，提示已经查询完毕
    uni.showToast({
      title: '没有更多数据了~',
      icon: 'none',
      duration: 1500
    });
  }
});
function handelQueryList(page) {
  rechargeService.queryList(page, state.pageSize, state.mobile).then(res => {
    // console.log(res)
    if (res && res.records && res.records.length >= 0) {
      let tempPayList = state.payList;
      res.records.forEach(item => {
        let tempState = true; // true 表示正数，false表示负数
        if (item.occurTotal < 0 || item.action === '消费' || item.action === 'consume') {
          tempState = false;
        } else {
          tempState = true;
        }
        tempPayList.push({
          ...item,
          state: tempState
        });
      });
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
      state.page = res.page;
      state.pageCount = pageCount;
      state.payList = tempPayList;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
</script>
<style scoped>
/* pages/balance/balancePayList/balancePayList.wxss */

.pay-item {
  height: 140rpx;
  width: 690rpx;
  margin: 0 auto;
  overflow: hidden;
  font-size: 30rpx;
  border-bottom: 1rpx solid #ebebeb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pay-item .status {
  float: left;
}

.pay-item .status text {
  display: block;
}

.status text:first-of-type, .count {
  color: #f1b400;
}

.pay-item .status text:last-of-type {
  font-size: 24rpx;
  color: #999;
}

.pay-item .count {
  float: right;
  font-size: 36rpx;
}

.pay-item .consume, .pay-item .status .consume {
  color: #e65e5c;
}

</style>