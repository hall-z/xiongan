<template>
<!--pages/giftCard/cardBuyResult/cardBuyResult.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<image class="card-img" :src="state.imageUrl"></image>
<view class="card-act-name">{{state.name}}</view>
<image v-if="!state.fromSend" class="icon-succ" :src="state.imagesPath.iconGiftBuySucc"></image>
<view class="tig" v-if="!state.fromSend">礼品卡购买成功</view>
<!-- <view class='card-name'>50元早餐营养卡</view> -->
<button open-type="share" v-if="state.allowPresent && !state.fromSend">快赠送给好友吧</button>
<text v-if="state.state === 'UNACTIVATED' && !state.fromSend" @click="handelActivate">激活自用</text>
<view v-if="state.fromSend" class="active-btn" :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'" @click.stop="handelActivate">激活</view>
<text v-if="state.fromSend" class="remain">礼品卡激活自用后不能再被转赠</text>
<button v-if="state.fromSend" class="sendother-btn" :style="'color: ' + state.themeColor" open-type="share">转赠给朋友</button>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiGiftCardServiceJs from "@/service/api/newretail/giftCardService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/giftCard/cardBuyResult/cardBuyResult.js
const giftCardService = _apiGiftCardServiceJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "礼品卡",
  imagesPath: IMGAGESPATH,
  imageUrl: '',
  name: '',
  state: '',
  memberCode: '',
  cardId: '',
  cardNo: '',
  allowPresent: '',
  recharge: '',
  created: '',
  state: '',
  fromSend: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor')
});
onLoad(function (options) {
  console.log(options);
  state.themeColor = app.globalData.uiconfig.themeColor;
  if (options.cardNo) {
    giftCardService.queryMyGiftCardDetails(options.cardNo).then(res => {
      console.log(res);
      if (res.myGiftCardDTO) {
        state.imageUrl = res.myGiftCardDTO.imageUrl;
        state.name = res.myGiftCardDTO.name;
        state.state = res.myGiftCardDTO.state;
        state.memberCode = res.myGiftCardDTO.memberCode;
        state.cardId = res.myGiftCardDTO.cardId;
        state.cardNo = res.myGiftCardDTO.cardNo;
        state.allowPresent = res.myGiftCardDTO.allowPresent;
        state.recharge = res.myGiftCardDTO.recharge;
        state.created = res.myGiftCardDTO.created;
        state.state = res.myGiftCardDTO.state;
      }
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
  if (options.fromSend) {
    state.fromSend = true;
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
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function (res) {
  let self = this;
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  if (res.from === 'button') {
    // 来自页面内转发按钮
    // console.log(res.target)
    // 无论分享是否成功标记转增中
    if (options.state == null) {
      handelDonate(self);
    }
    uni.showShareMenu({
      withShareTicket: true
    });
  }
  return {
    title: '送你一张礼品卡',
    path: "/pages-sub/newretail/pages/memberModule/giftCard/giveState/giveState?cardNo=" + state.cardNo,
    success: function (res) {}
  };
});
function handelActivate(e) {
  console.log(e);
  if (state.cardNo) {
    giftCardService.active(state.cardNo).then(res => {
      console.log(res);
      let opts = '?cardNo=' + state.cardNo;
      NAVPAGE.toGiftCardDetails(opts);
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
function handelDonate(self) {
  giftCardService.donate(self.data.cardNo).then(res => {
    console.log('已经赠送————————————————');
    console.log(res);
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
/* pages/giftCard/cardBuyResult/cardBuyResult.wxss */
page{
  text-align: center;
}
.card-img{
  width: 630rpx;
  height: 380rpx;
  border-radius: 20rpx;
  margin-top: 30rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.4)
}

.card-act-name{
  font-size: 36rpx;
  margin: 60rpx 0rpx 80rpx;
}
.icon-succ{
  width: 114rpx;
  height: 114rpx;
  margin-bottom: 30rpx;
}
.tig{
  font-size: 48rpx;
  margin-bottom: 60rpx;
}
.card-name{
  font-size: 36rpx;
  margin-bottom: 50rpx;
}
button{
  width: 620rpx;
  height: 92rpx;
  line-height: 92rpx;
  background: #f1b400;
  color: #fff;
}

text{
  display: inline-block;
  color: #f1b400;
  font-size: 30rpx;
  margin: 50rpx 0rpx;
}

.active-btn{
  width: 360rpx;
  height: 94rpx;
  line-height: 94rpx;
  margin: 0 auto;
  border-radius: 10rpx;
  background: #fff;
  color: #009f55;
  border: 1rpx solid #009f55;
  font-size: 32rpx;
  position: absolute;
  bottom: 200rpx;
  left: 50%;
  transform: translateX(-50%);
}

.remain{
  color: #999;
  font-size: 24rpx;
  position: absolute;
  bottom: 100rpx;
  left: 50%;
  transform: translateX(-50%);
}
.sendother-btn{
  display: block;
  font-size: 30rpx;
  background: none;
  color: #009f55;
  position: absolute;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
}
.sendother-btn::after{
  border: none;
}
</style>