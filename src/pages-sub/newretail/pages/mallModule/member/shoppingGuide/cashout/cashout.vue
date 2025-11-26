<template>
<navigationBar :title="state.navigationBarTitle"></navigationBar>

<view class="container">
  <view class="main-content">
    <view class="cash-amount">
      <view class="title">
        兑换金额
      </view>
      <view class="handle-input">
        <view class="symbol">￥</view>
        <view class="input">
          <input type="number" :value="state.canBackCash" :disabled="true" placeholder-style="color: #999; font-size: 60rpx;" placeholder="请输入奖励点">
          <!-- <view class="clear-icon" bind:tap="clearBackCash">×</view> -->
        </view>
      </view>
      <view class="enable-reward">可用奖励点{{state.backCashData ? state.backCashData.canBackCash : 0}}</view>
    </view>
    <view class="auth-tips" v-if="state.withdrawMethod === 'WX_ENT_MMPAY' || state.withdrawMethod === 'YM_WX_ENT_MMPAY'">为了保证奖励能顺利发放，请完成以下认证！</view>
  </view>
  <view class="auth-btn" @click="toAuth" v-if="state.withdrawMethod === 'WX_ENT_MMPAY' || state.withdrawMethod === 'YM_WX_ENT_MMPAY'">
    <view>
      <image :src="state.imagesPath.iconWeixinLogo"></image>
      微信认证
    </view>
    <view class="auth-status" :style="'color: ' + (state.isBind ? '#0198FF' : '#666666')">
      {{state.isBind ? '已认证' : '未认证 >'}}
    </view>
  </view>
  <view class="cashout-btn" @click="cashWithdrawal" :style="'background: ' + ((state.withdrawMethod === 'WX_ENT_MMPAY' || state.withdrawMethod === 'YM_WX_ENT_MMPAY') && state.isBind && state.canBackCash || state.withdrawMethod === 'CARD' && state.canBackCash ? '#0198FF' : '#D0D0D0')">
    提现{{state.withdrawMethod === 'CARD' ? '到储值' : '到微信钱包'}}
  </view>
  <view class="becareful-tips">
    <view class="title">注意事项</view>
    <view>
      <text>1.奖励点最低兑换额度为1元；</text>
      <text>2.提现奖励点需要进行手机号和微信认证；</text>
      <text>3.申请兑换后请耐心等待公司审批；</text>
    </view>
  </view>
</view>
</template>
<script setup>
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _apiBackCashServiceJs from "@/service/api/newretail/backCashService";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
// import { onLoad, onShow } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const backCashService = _apiBackCashServiceJs;
const wxaUserService = _apiWxaUserServiceJs;
const request = _apiRequestJs;
const systemService = _apiSystemServiceJs;
const state = reactive({
  navigationBarTitle: '提现',
  imagesPath: IMGAGESPATH,
  backCashData: null,
  canBackCash: 0,
  userInfo: null,
  isBind: false,
  withdrawMethod: 'CARD'
});
onLoad(function () {
  getBackCashDetail();
  queryCashoutMethos();
  if (app.globalData.userInfo) {
    state.userInfo = app.globalData.userInfo;
  }
});
onShow(function () {
  isBindWinmore();
});
function queryCashoutMethos() {
  systemService.query('defaultBackCashWithdrawMethod').then(res => {
    if (res) {
      state.withdrawMethod = res[0].value;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getBackCashDetail() {
  backCashService.queryBackCashAccountDetails().then(res => {
    console.log(res);
    state.backCashData = res;
    state.canBackCash = res.canBackCash;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function isBindWinmore() {
  let params = {
    appid: 'wx887701e96972b23f',
    userTenantCode: request.TENANT,
    winmoreBackCashMobile: state.userInfo.member.mobile
  };
  wxaUserService.isBindWinmore(params).then(res => {
    console.log(res);
    state.isBind = res.isBind;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function clearBackCash() {
  state.canBackCash = '';
}
function checkPostInfo() {
  if (!state.canBackCash || state.canBackCash > state.backCashData.canBackCash || !state.backCashData) {
    uni.showToast({
      title: '提现金额不正确',
      icon: 'none',
      duration: 2000
    });
    return false;
  } else if (!state.isBind && state.withdrawMethod !== 'CARD') {
    uni.showToast({
      title: '请先完成微信认证',
      icon: 'none',
      duration: 2000
    });
    return;
  } else {
    return true;
  }
}
function cashWithdrawal() {
  if (checkPostInfo()) {
    // 提现
    let postData = {
      mobile: state.userInfo.member.mobile,
      withdrawMethod: state.withdrawMethod
    };
    backCashService.createCashoutOrder(postData).then(res => {
      if (res) {
        uni.showToast({
          title: '提现申请成功，请耐心等待',
          icon: 'none',
          duration: 2000
        });
        getBackCashDetail();
      }
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
function toAuth() {
  if (state.isBind) {
    return false;
  }
  console.log(`pages/index/index?mobile=${state.userInfo.member.mobile}&tenantId=${request.TENANT}`);
  uni.navigateToMiniProgram({
    appId: 'wx887701e96972b23f',
    path: `pages/index/index?mobile=${state.userInfo.member.mobile}&tenantId=${request.TENANT}&from=miniApp`
  });
}
</script>
<style scoped>
page {
  background: #f3f4f6;
}

.container {
  padding: 0;
}

.main-content {
  background: #fff;
  height: 523rpx;
  margin-top: 28rpx;
}

.main-content .cash-amount {
  height: 463rpx;
  width: 100%;
  text-align: left;
}

.main-content .cash-amount .title {
  height: 145rpx;
  line-height: 145rpx;
  color: #484848;
  padding: 0 34rpx;
  font-size: 31rpx;
}

.main-content .cash-amount .handle-input {
  height: 168rpx;
  line-height: 168rpx;
  display: flex;
  padding-left: 34rpx;
  color: #000;
}

.cash-amount .handle-input .symbol {
  font-size: 60rpx;
  width: 60rpx;
}

.cash-amount .handle-input .input {
  border-bottom: 1rpx solid #999;
  width: calc(100% - 60rpx);
  display: flex;
  padding-right: 34rpx;
}

.cash-amount .handle-input .input input {
  font-size: 80rpx;
  width: calc(100% - 50rpx);
  height: 168rpx;
}

.cash-amount .handle-input .input .clear-icon {
  font-size: 50rpx;
  color: #999;
  width: 50rpx;
}

.main-content .cash-amount .enable-reward {
  height: 122rpx;
  line-height: 122rpx;
  color: #999;
  font-size: 33rpx;
  padding: 0 34rpx;
}


.main-content .auth-tips {
  background: #FFEA9C;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  color: #333333;
}

.auth-btn {
  width: 616rpx;
  height: 60rpx;
  line-height: 60rpx;
  background-color: #fff;
  box-shadow: 0px 2px 9px 4px rgba(0, 0, 0, 0.04);
  margin: 30rpx auto;
  border-radius: 10rpx;
  padding: 32.5rpx;
  display: flex;
  justify-content: space-between;
}

.auth-btn image {
  width: 60rpx;
  height: 60rpx;
  vertical-align: middle;
  margin-right: 15rpx;
}

.auth-btn .auth-status {
  font-size: 22rpx;
  color: #666;
}

.cashout-btn {
  width: 675rpx;
  height: 104rpx;
  border-radius: 8rpx;
  text-align: center;
  line-height: 104rpx;
  font-size: 42rpx;
  color: #fff;
  background: #D0D0D0;
  margin: 54rpx auto;
}

.becareful-tips {
  text-align: left;
  padding-left: 34rpx;
}

.becareful-tips .title {
  font-size: 28rpx;
  color: #313131;
  margin-bottom: 15rpx;
}

.becareful-tips view>text {
  display: block;
  line-height: 35rpx;
  color: #959595;
  font-size: 24rpx;
}
</style>