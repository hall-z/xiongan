<template>
<!--pages/buyHistory/buyHistory.wxml-->
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="his-item" v-for="(item , idx) in state.historyList" :key="cardId" :data-cardid="item.cardId" :data-index="idx" @click="toCardBuyResult">
  <image :src="item.imageUrl"></image>
  <view class="card-info">
    <view class="name-box">
      <text class="card-name">{{item.name}}</text>
      <text class="card-no">{{item.cardNo}}</text>
      <text v-if="item.state === 'ACTIVED'" style="color:#2BB842">{{filtCardState(item.state)}}</text>
      <text v-if="item.state === 'UNACTIVATED'" style="color:#FF3333">{{filtCardState(item.state)}}</text>
      <text v-if="item.state !== 'ACTIVED' && item.state !== 'UNACTIVATED'" style="color:#999999">{{filtCardState(item.state)}}</text>
    </view>
    <view class="price-box">
      余额：
      <text>￥{{item.balance}}</text>
    </view>
    <view class="buy-time">
      购买时间：{{item.createTime}}
    </view>
  </view>
</view>
<view v-if="state.historyList.length === 0" class="no-data">
  <image :src="state.imagesPath.imgNoGiftCardUsed"></image>
  <button size="mini" @click="toGiftCardCenter" :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'">前往礼品卡中心</button>
</view></view>
</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiGiftCardServiceJs from "@/service/api/newretail/giftCardService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/buyHistory/buyHistory.js
const giftCardService = _apiGiftCardServiceJs;
const auth = _utilsAuthJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const selfA = _utilsSelfJs;
//获取应用实例
const state = reactive({
  navigationBarTitle: "购买历史",
  imagesPath: IMGAGESPATH,
  historyList: [],
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor')
});
onLoad(function (options) {
  let _userInfo = auth.getUser();
  let memberId = "";
  state.themeColor = app.globalData.uiconfig.themeColor;
  if (_userInfo && _userInfo.member) {
    memberId = _userInfo.member.id;
    giftCardService.queryMyGiftCard(memberId).then(res => {
      console.log(res);
      if (res) {
        //             res.forEach(itema => {
        //                 selfA.getTemporaryUrl(itema.imageUrl)
        //                 .then(resA => {
        //             itema.imageUrl = resA
        //         this.setData({
        //             historyList: res
        //         });
        // })
        //         });
        state.historyList = res;
      }
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
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
  onLoad();
  uni.stopPullDownRefresh();
});
onReachBottom(function () {});
onShareAppMessage(function (res) {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  return {
    path: "/pages-sub/newretail/pages/mallModule/index/index/index"
  };
});
function toCardBuyResult(e) {
  // console.log(e)
  let item = state.historyList[e.currentTarget.dataset.index];
  if (item.state === 'UNACTIVATED' || item.state === "PRESENT") {
    // 如果是未激活或者转增中，跳转到的礼品卡购买结果页
    uni.setStorage({
      key: '_currentCardInfo_',
      data: item
    });
    let opts = '?cardNo=' + item.cardNo;
    if (item.state === "PRESENT") {
      opts = opts + '&state=PRESENT';
    }
    NAVPAGE.toCardBuyResult(opts);
  } else if (item.state === 'ACTIVED') {
    // 如果是已激活，跳转到卡详情页， 如果是赠送中，点击没反应
    let opts = '?cardNo=' + item.cardNo;
    NAVPAGE.toGiftCardDetails(opts);
  }
}
function toGiftCardCenter() {
  NAVPAGE.toGiftCardCenter();
}
</script>
<style scoped>
/* pages/buyHistory/buyHistory.wxss */

.his-item {
  width: 670rpx;
  margin: 0 auto;
  padding: 40rpx 0rpx;
  overflow: hidden;
  border-bottom: 1rpx solid #ebeff7;
}

.his-item image {
  width: 220rpx;
  height: 131rpx;
  float: left;
  border-radius: 10rpx;
}

.card-info {
  float: right;
  width: 430rpx;
  font-size: 24rpx;
}

.card-info .name-box {
  margin-bottom: 20rpx;
  overflow: hidden;
}

.card-info .name-box text {
  float: right;
}

.card-info .name-box .card-name {
  font-size: 30rpx;
  float: left;
}

.card-info .name-box .card-no {
  font-size: 26rpx;
  float: left;
}

.card-info .price-box {
  margin-bottom: 10rpx;
  color: #333;
}

.card-info .price-box text {
  color: #f1b400;
}

.card-info .buy-time {
  color: #666;
}

.no-data {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50%;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  margin-top: 50rpx;
  width: 262rpx;
  height: 60rpx;
  background: #fff;
}
</style>