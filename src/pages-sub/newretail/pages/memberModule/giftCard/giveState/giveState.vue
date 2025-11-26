<template>
<!--pages/giftCard/giveState/giveState.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
  <icon type="cancel" color="#ccc" size="30" @click="handelClose">
  <view class="giver-info">
    <image :src="state.avatar"></image>
    <text>{{state.nickName}}</text>
  </view>
  <view v-if="state.state === 'PRESENT'" class="card-name">{{state.name}}</view>
  <view v-if="state.state === 'ABOLISH' && state.isCardMaster" class="text">已经被领取</view>
  <view v-if="state.state === 'ABOLISH' && !state.isCardMaster" class="text">来晚了，礼品卡被领完了</view>
  <view v-if="state.state === 'EXPIRED'" class="text">来晚了，礼品卡已超时退回</view>
  <image class="card-img" :src="state.imageUrl"></image>
  <button v-if="state.state === 'PRESENT'" class="btn" @click="handelGetCard">领取</button>
  <button v-if="(state.state === 'ABOLISH' || state.state === 'EXPIRED') && !state.isCardMaster" class="btn" @click="handelClose">我也要送</button>
</icon></view>

<authorize @login="handleUserLogin" @tabBar="handleTabbar"></authorize>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiGiftCardServiceJs from "@/service/api/newretail/giftCardService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
const app = getApp();

// pages/giftCard/giveState/giveState.js
const giftCardService = _apiGiftCardServiceJs;
const auth = _utilsAuthJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const UTILS = _utilsUtilsJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "赠送详情",
  imagesPath: IMGAGESPATH,
  avatar: '',
  // 赠卡人头像
  nickName: '',
  // 赠卡人昵称
  name: '',
  // 券名称
  imageUrl: '',
  // 券图片
  cardNo: '',
  cardId: '',
  state: '',
  isCardMaster: false,
  // 是否是发卡人
  showPhone: false
});
onLoad(function (options) {
  console.log(options);
  let _userInfo = auth.getUser();
  state.userInfo = _userInfo;
  if (options.cardNo) {
    cardNo = options.cardNo;
    if (_userInfo) {
      handleInit(options.cardNo);
    }
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
function handleInit(cardNo) {
  giftCardService.queryGiftCardInfo(cardNo).then(res => {
    // console.log(res)
    if (res) {
      state.avatar = res.avatar;
      state.nickName = res.nickName;
      state.name = res.name;
      state.state = res.state;
      state.cardNo = res.cardNo;
      state.cardId = res.cardId;
      state.imageUrl = res.imageUrl;
      state.allowPresent = res.allowPresent;
      let _userInfo = auth.getUser();
      if (_userInfo && _userInfo.member) {
        let isCardMaster = false;
        if (_userInfo.member.wxOpenid === res.memberCode) {
          isCardMaster = true;
        } else {
          isCardMaster = false;
        }
        state.isCardMaster = isCardMaster;
      }
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let path = UTILS.getSharePath();
  return {
    path: path
  };
});
function handelGetCard() {
  let _userInfo = auth.getUser();
  if (_userInfo && _userInfo.member) {
    giftCardService.acquireDonate(state.cardNo).then(res => {
      console.log('领取成功------------------');
      console.log(res);
      let opts = '?cardNo=' + res.cardNo + '&fromSend=true';
      NAVPAGE.toCardBuyResult(opts);
    }).catch(err => {
      if (err.code === 36001) {
        // 特别处理领取时礼品卡状态非法的问题 NR-3326
        if (state.cardNo != null && state.userInfo != null) {
          handleInit(state.cardNo);
        } else {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        }
      } else {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      }
    });
  } else {
    uni.showModal({
      title: '提示',
      content: '您当前未登录，请去授权登录，再重新领卡',
      success: function () {
        NAVPAGE.toHome();
      }
    });
  }
}
function handelClose() {
  NAVPAGE.toHome();
}
function handleUserLogin() {
  let userInfo = app.globalData.userInfo;
  console.log(userInfo);
  const self = this;
  if (userInfo) {
    state.userInfo = {
      ...userInfo.wxaUser
    };
    if (userInfo.member) {
      // 如果会员信息存在，查询卡信息
      handleInit(cardNo);
    } else {
      NAVPAGE.toAuthorize();
    }
  }
}
function handleTabbar(e) {
  console.log(e.detail);
  if (e.detail.showTabbar === true) {
    state.showTabbar = e.detail.showTabbar;
  } else {
    state.showTabbar = e.detail.showTabbar;
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.showPhone = true;
  } else {
    state.showPhone = false;
  }
}
function handleBindPhone(e) {
  if (e.detail.bindMobile === true) {
    handlePopupPhone();
  }
}
</script>
<style scoped>
/* pages/giftCard/giveState/giveState.wxss */

page {
  background: #ababab;
}

.content {
  width: 650rpx;
  height: 760rpx;
  border-radius: 10rpx;
  background: #fff;
  margin: 0 auto;
  margin-top: 20%;
  text-align: center;
  overflow: hidden;
  position: relative;
}

.content icon{
  position: absolute;
  right: 30rpx;
  top: 30rpx;
}

.content .giver-info {
  margin-top: 70rpx;
  height: 80rpx;
  line-height: 80rpx;
  color: #999;
  font-size: #999;
}

.content .giver-info image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  vertical-align: middle;
  margin-top: -6rpx;
  margin-right: 20rpx;
}

.card-name{
  font-size: 48rpx;
  margin: 40rpx 0rpx;
}

.text{
  font-size: 32rpx;
  color: #999;
  margin: 80rpx 0rpx 30rpx;
}

.card-img{
  width: 430rpx;
  height: 258rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

button.btn{
  width: 430rpx;
  height: 94rpx;
  overflow: hidden;
  line-height: 94rpx;
  font-size: 34rpx;
  margin-top: 40rpx;
  background: #fff;
  color: #f1b400;
  border: 1rpx solid #f1b400;
}
</style>