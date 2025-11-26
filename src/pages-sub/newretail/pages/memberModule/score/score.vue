<template>
<!--pages/score/score.wxml-->
<view class="top-info">
  <text class="score-text">总积分</text>
  <view class="score-num">{{state.memberScoreBalance}}
    <text>积分</text>
  </view>
</view>
<view class="score-box">
  <view class="score-name">积分明细</view>
  <view class="score-item" v-for="(item , index) in state.scoreList" :key="index">
    <view class="status">
      <text>{{item.action}}</text>
      <text>{{item.tranTime}}</text>
    </view>
    <view :class="'num ' + (item.increase ? 'increase' : 'consume')">{{item.occur}}</view>
  </view>
  <view class="loading" :hidden="!state.loading">{{state.loadingText}}</view>
  <view class="no-data" :hidden="state.scoreList.length > 0">
    <image :src="state.imagesPath.noData"></image>
  </view>
</view>

</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/score/score.js
const memberService = _apiMemberServiceJs;
const auth = _utilsAuthJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "我的积分",
  imagesPath: IMGAGESPATH,
  scoreList: [],
  memberScoreBalance: 0,
  mobile: '',
  page: 1,
  pageSize: 20,
  pageCount: 1,
  loading: false,
  loadingText: '正在加载...'
});
function checkAuth() {
  try {
    if (!app.globalData.userInfo) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    // Do something when catch error
  }
}
function getScoreBalance() {
  memberService.getBalance(state.mobile).then(res => {
    console.log(res);
    state.memberScoreBalance = res;
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getMemberScoreBalance(page, pageSize) {
  const loginStatus = checkAuth();
  if (loginStatus) {
    queryScoreData(page, pageSize);
  } else {
    uni.showToast({
      title: '请登录后查询积分明细',
      icon: 'none',
      duration: 2000
    });
  }
}
function queryScoreData(page, pageSize) {
  const that = this;
  const mobile = state.mobile;
  let list = memberService.queryHst(page, pageSize, mobile).then(res => {
    console.log(res);
    let tempScoreList = state.scoreList;
    if (res.records && res.records.length >= 0) {
      res.records.forEach(item => {
        let tempItem = {};
        if (item.occur > 0) {
          let occur = '+' + item.occur;
          tempItem = {
            ...item,
            occur: occur,
            increase: true
          };
        } else if (item.occur < 0) {
          let occur = 0 - item.occur;
          occur = '-' + occur;
          tempItem = {
            ...item,
            occur: occur,
            increase: false
          };
        } else {
          tempItem = {
            ...item,
            occur: '-0.00',
            increase: false
          };
        }
        tempItem = {
          ...tempItem,
          action: item.remark
          // action: that.handleAction(item.action)
        };
        tempScoreList.push(tempItem);
      });
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
      state.page = res.page;
      state.pageCount = pageCount;
      state.scoreList = tempScoreList;
      return tempScoreList;
    }
  }).catch(error => {
    uni.showToast({
      title: error.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function handleAction(value) {
  if (value === 'recharge') {
    return '充值';
  } else if (value === 'consume') {
    return '消费';
  } else if (value === 'adjust') {
    return '调整';
  } else if (value === 'checkIn') {
    return '签到';
  } else if (value === 'refund') {
    return '退款';
  } else {
    return value;
  }
}
onLoad(function (options) {
  const that = this;
  try {
    let _userInfo = auth.getUser();
    if (_userInfo && _userInfo.member) {
      let mobile = _userInfo.member.mobile;
      state.mobile = mobile;
      getScoreBalance();
      getMemberScoreBalance(state.page, state.pageSize);
    }
  } catch (e) {
    // Do something when catch error
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
  state.page = 1;
  state.pageCount = 1;
  state.scoreList = [];
  getMemberScoreBalance(state.page, state.pageSize);
  uni.stopPullDownRefresh();
});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    let index = state.page;
    ++index;
    queryScoreData(index, state.pageSize);
  } else {
    uni.showToast({
      title: '没有更多数据~',
      icon: 'none',
      duration: 1500
    });
  }
});
onShareAppMessage(function (res) {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  return {
    path: "/pages-sub/newretail/pages/index/index"
  };
});
</script>
<style scoped>
/* pages/score/score.wxss */
.top-info{
    width: 100%;
    height: 276rpx;
    background: url("https://app-1256684088.cos.ap-beijing.myqcloud.com/wujieImages/bgMyIntegral.png") no-repeat center;
    background-size: 100% auto;
    margin-top: 42rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-left: 65rpx;
    box-sizing: border-box;
}

.score-text{
    font-size: 32rpx;
    color: #0e0e0e;
    margin-bottom: 62rpx;
}
.score-num{
    font-size: 48rpx;
    color: #ff8604;
    vertical-align: bottom;
}
.score-num>text{
    font-size: 28rpx;
}
.score-box{
    padding: 92rpx 32rpx 0 32rpx;
}
.score-name{
    font-size: 32rpx;
    line-height: 72rpx;
    height: 72rpx;
    color: #0e0e0e;
    border-bottom: 1rpx solid #e6e6e6;
    width: 100%;
}

.score-item{
    height: 139rpx;
    border-bottom: 2rpx solid #f1f1f1;
    display: flex;
    justify-content: space-between;
}
.status{
    height: 100%;
    display: flex;
    flex-direction: column ;
    padding: 24rpx 0 27rpx 0;
}
.status>text:first-of-type{
    font-size: 32rpx;
    color: #414141;
    line-height: 52rpx;
    margin-bottom: 4rpx;
}
.status>text:last-of-type{
    font-size: 24rpx;
    color: #999999;
    line-height: 36rpx;
}
.num{
    height: 100%;
    font-size: 28rpx;
    font-weight: bold;
    line-height: 139rpx;
}
.increase{
    color: #a0d68f;
}
.consume{
    color: #ec7574;
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
  }
  
  .no-data image {
    width: 242rpx;
    height: 261rpx;
    margin-top: 30%;
  }

  .loading{
    color: #999999;
    font-size: 28rpx;
    line-height: 80rpx;
    height: 80rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    background: #eeeeee;
  }
</style>