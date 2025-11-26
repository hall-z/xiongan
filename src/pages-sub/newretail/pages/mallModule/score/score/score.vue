<template>
<!--pages/score/score.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="top-info">
    <text class="score-text">总积分</text>
    <view class="score-num">
      <view>
        {{state.memberScoreBalabce}}<text>积分</text>
      </view>
      <view class="score-btn" @click="scoreUse">立即使用</view>
    </view>
</view>
<view class="score-box">
    <view class="score-name">积分明细</view>
    <view class="score-item" v-for="(item , index) in state.scoreList" :key="index">
        <view class="status">
            <text>{{item.action ? item.action : '-'}}</text>
            <text>{{item.tranTime}}</text>
        </view>
        <view :class="'num ' + (item.increase ? 'increase' : 'consume')">{{item.occur}}</view>
    </view>
    <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
    <view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view> 
    <view class="no-data" :hidden="state.scoreList.length > 0">
        <image :src="state.imagesPath.imgNoData"></image>
    </view>
</view>

</template>
<script setup>
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/score/score.js
const memberService = _apiMemberServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const NAVPAGE = _utilsNavPageJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "我的积分",
  imagesPath: IMGAGESPATH,
  scoreList: [],
  memberScoreBalabce: 0,
  mobile: '',
  page: 1,
  pageSize: 10,
  pageCount: 1,
  noMore: false,
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
function scoreUse() {
  NAVPAGE.toScoreMall();
}
function getScoreBalance() {
  memberService.getBalance(state.mobile).then(res => {
    console.log(res);
    state.memberScoreBalabce = res;
  }).catch(e => {
    uni.showToast({
      title: e.message,
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
  uni.hideShareMenu();
  const that = this;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.mobile = app.globalData.userInfo.member.mobile;
      getScoreBalance();
      handelQueryList(state.page);
    } else {
      uni.showToast({
        title: '您还不是会员哦，请绑定手机号成为会员~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    uni.showToast({
      title: '您还没有登陆，请登录后查询积分明细~',
      icon: 'none',
      duration: 2000
    });
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
  state.scoreList = [];
  state.mobile = '';
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  onLoad();
  uni.stopPullDownRefresh();
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
    if (state.scoreList.length > 0) {
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
onShareAppMessage(function () {});
function handelQueryList(page) {
  const that = this;
  let postData = {
    memberMobileEquals: state.mobile,
    page: page,
    pageSize: state.pageSize,
    orderDirection: 'desc',
    orderField: 'tranTime'
  };
  memberService.queryHst(postData).then(res => {
    console.log(res);
    let tempScoreList = state.scoreList;
    if (res.records && res.records.length > 0) {
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
/* pages/score/score.wxss */
.top-info{
    width: 100%;
    height: 276rpx;
    background: url("https://ywyc.obs.cn-east-3.myhuaweicloud.com/20230120/1616262438984884226/f79d623519c5df8741ae109e605eb77.jpg") no-repeat center;
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
    color: #fff;
    margin-bottom: 62rpx;
}
.score-num{
  padding-right: 30rpx;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
    font-size: 48rpx;
    /* color: #ff8604; */
    color: #fff;
    vertical-align: bottom;
}
.score-btn {
  padding: 10rpx 25rpx;
  height: 40rpx;
  font-size: 30rpx;
  background-color: #fff;
  color: #ff8604;
  border-radius: 30rpx;
}
.score-num text{
    font-size: 28rpx;
}
.score-box{
    padding: 22rpx 32rpx 0 32rpx;
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

  .loading-btn {
    color: #454545;
    font-size: 28rpx;
    line-height: 80rpx;
    height: 80rpx;
    width: 100%;
    background: #ffffff;
    border-radius: 0
  }
  
  .loading-btn::after{
    border: 0;
  }
  
  .order-end{
    color: #009136;
    font-size: 28rpx;
    line-height: 80rpx;
    height: 80rpx;
    text-align: center;
  }
</style>