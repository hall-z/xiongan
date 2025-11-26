<template>
<!--pages/balance/balance.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
  <view class="balance-item" v-for="(item , index) in state.balanceList" :key="index">
    <view class="status">
      <text>{{item.action}}</text>
      <text>{{item.tranTime}}</text>
    </view>
    <view :class="'num ' + (item.state ? 'recharge' : 'consume')">{{item.occurTotal}}</view>
  </view>
</view>
<button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
<view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view> 
<view class="no-data" :hidden="state.balanceList.length > 0">
  <image :src="state.imagesPath.imgNoData"></image>
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

// pages/balance/balance.js
const memberService = _apiMemberServiceJs;
const auth = _utilsAuthJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "储值明细",
  imagesPath: IMGAGESPATH,
  balanceList: [],
  page: 1,
  mobile: '',
  pageSize: 11,
  pageCount: 1,
  noMore: false,
  loading: false
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
function handleAction(value) {
  if (value === 'recharge') {
    return '充值';
  } else if (value === 'consume') {
    return '消费';
  } else if (value === 'restore') {
    return '消费冲账';
  } else if (value === 'recharge_restore') {
    return '充值冲账';
  } else if (value === 'bindingCard') {
    return '绑卡';
  } else if (value === 'adjust') {
    return '调整';
  } else if (value === 'checkIn') {
    return '签到';
  } else if (value === 'DEPOSIT') {
    return '充值';
  } else if (value === 'DEPOSIT_REFUND') {
    return '充值退款';
  } else if (value === 'PAY') {
    return '支付';
  } else if (value === 'PAY_REFUND') {
    return '支付退款';
  } else if (value === 'PAY_ROLLBACK') {
    return '支付回滚';
  } else if (value === 'TRANSFER_IN') {
    return '转账出';
  } else if (value === 'TRANSFER_OUT') {
    return '转账入';
  } else if (value === 'ADJUST') {
    return '调整';
  } else if (value === 'MERGE') {
    return '会员合并';
  } else if (value === 'CANCEL') {
    return '作废';
  } else {
    return value;
  }
}
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
            uni.navigateTo({
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
  state.balanceList = [];
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
    if (state.balanceList.length > 0) {
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
  let postData = {
    memberMobileEquals: state.mobile,
    page: page,
    pageSize: state.pageSize,
    orderDirection: 'desc',
    orderField: "tranTime"
  };
  const that = this;
  memberService.query(postData).then(res => {
    // console.log(res)
    if (res && res.records && res.records.length >= 0) {
      let tempBalanceList = state.balanceList;
      res.records.forEach(item => {
        let tempState = true; // true 表示正数，false表示负数
        let occurTotal = '+￥0.00';
        if (item.occurTotal < 0 || item.action === '消费' || item.action === 'consume') {
          tempState = false;
          let tempTotal = 0 - item.occurTotal;
          occurTotal = '-￥' + tempTotal;
        } else {
          tempState = true;
          occurTotal = '+￥' + item.occurTotal;
        }
        tempBalanceList.push({
          ...item,
          action: handleAction(item.action),
          state: tempState,
          occurTotal: occurTotal
        });
      });
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
      state.page = res.page;
      state.pageCount = pageCount;
      state.balanceList = tempBalanceList;
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
/* pages/balance/balance.wxss */
page{
  background: #ffffff;
  height: 100%;
}
.content{
    height: 80%;
  padding: 0 30rpx;
  overflow-y: scroll;
}
.balance-item{
  /* height: 139rpx; */
  border-bottom: 2rpx solid #f1f1f1;
  display: flex;
  justify-content: space-between;
}
.status{
  /* height: 100%; */
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
  /* height: 100%; */
  font-size: 28rpx;
  font-weight: bold;
  line-height: 139rpx;
}
.recharge{
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