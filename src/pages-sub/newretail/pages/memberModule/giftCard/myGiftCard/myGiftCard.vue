<template>
<!--pages/mygiftcard/mygiftcard.wxml-->
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="my-gift">
    <view class="use-desc" v-if="state.descUrl">
        <view class="desc-btn" @click="descSwitch">
            <image :src="state.themeManager.BASE_URL + '/descicon.png'" class="desc-icon"></image>
            <text>使用说明</text>
        </view>
    </view>
    <view class="add-btn" @click="bindNewCard">
        <image :src="state.themeManager.BASE_URL + '/add.png'" class="add-image"></image>
        <text>绑定新卡</text>
    </view>   
     <!--可用卡列表  -->
    <view class="use-box">
       <view class="use-head">
            <view class="font-box">
                <text>可用卡</text>
                <text>（{{state.useList.length}}）</text>
            </view>
            <view class="switch-btn" @click="changeSwitch" data-type="use">
                <image :src="state.imagesPath.upIcon" :class="state.useSwitch ? 'up-icon' : 'up-icon rotate-icon'"></image>
            </view>
       </view>
       <view v-if="state.useSwitch">
            <view class="card-list">
                <view class="card-item" v-for="(item , index) in state.useList" :key="index">
                    <image :src="state.themeManager.BASE_URL + '/giftbg.png'" class="giftbg"></image>
                    <view class="card-inner">
                        <view class="card-hd">
                            <text class="card-num">{{item.cardNo}}</text>
                            <view class="card-info">
                                <view class="card-price">
                                    <text class="price-font">面值：</text>
                                    <text class="price-num">¥{{item.faceAmount}}</text>
                                </view>
                                <text class="card-time">{{item.endDate}}到期</text>
                            </view>
                        </view>
                        <view class="card-bd">
                            <view class="balance"><text class="balance-font">余额：</text><view class="balance-num"><text>¥</text>{{item.balance}}</view><text></text></view>
                            <view @click="operateCard" :data-state="item.state" :data-cardNo="item.cardNo" :class="item.state == 'UNACTIVATED' ? 'operate-btn activation' : 'operate-btn unbind'">
                                <text v-if="item.state === 'UNACTIVATED' && item.cardType === 'OnlineGiftCard'">激活</text>
                                <text v-else>解绑</text>
                            </view>
                            <!-- <view class="chose-box">
                                <image src="{{state.themeManager.BASE_URL}}/true.png" class="true-icon"></image>
                            </view> -->
                        </view>
                    </view>
            </view>
            </view>
            <!-- 没有礼品卡数据 -->
            <view class="card-nodata" v-if="state.useList.length === 0">
                <image :src="state.themeManager.BASE_URL + '/nodata-lipinka.png'" class="nodata"></image>
                <text class="nocard-font">暂无可使用的礼品卡</text>
                <view @click="bindNewCard" class="btn-newcard">绑定新卡</view>
            </view>
            <!-- <view class="sure-btn">确定</view> -->
       </view>
    </view>
    <!-- 不可用卡列表 -->
    <view class="use-box">
        <view class="use-head">
            <view class="font-box">
                 <text>不可用卡</text>
                 <text>（{{state.unuseList.length}}）</text>
            </view>
            <view class="switch-btn" @click="changeSwitch" data-type="unuse">
                <image :src="state.imagesPath.upIcon" :class="state.unuseSwitch ? 'up-icon' : 'up-icon rotate-icon'"></image>
            </view>        
        </view>
        <view v-if="state.unuseSwitch">
            <view class="card-list">
                <view class="card-item" v-for="(item , index) in state.unuseList" :key="index">
                    <image :src="state.themeManager.BASE_URL + '/giftbg.png'" class="giftbg"></image>
                    <view class="card-inner">
                        <view class="card-hd">
                            <text class="card-num">{{item.cardNo}}</text>
                            <view class="card-info">
                                <view class="card-price">
                                    <text class="price-font">面值：</text>
                                    <text class="price-num">¥{{item.faceAmount}}</text>
                                </view>
                                <text class="card-time">{{item.endDate}}到期</text>
                            </view>
                        </view>
                        <view class="card-bd">
                            <view class="balance"><text class="balance-font">余额：</text><view class="balance-num"><text>¥</text>{{item.balance}}</view><text></text></view>
                            <!-- <view class="operate-btn">
                                <text>解绑</text>
                                <text>激活</text>
                            </view> -->
                            <!-- <view class="chose-box">
                                <image src="{{state.themeManager.BASE_URL}}/true.png" class="true-icon"></image>
                            </view> -->
                        </view>
                    </view>
                    <view class="unbind-bg"></view>
                </view>
            </view>
           <!-- 没有礼品卡数据 -->
           <view class="card-nodata" v-if="state.unuseList.length === 0">
               <image :src="state.themeManager.BASE_URL + '/nodata-lipinka.png'" class="nodata"></image>
               <text class="nocard-font">暂无不可使用的礼品卡</text>
           </view>
            <!-- <view class="sure-btn">确定</view> -->
        </view>
    </view>
    <!-- 使用说明 -->
    <view class="desc-pop" v-if="state.descFlag">
        <view class="closepop" @click="closeDec">
            x
            <!-- <image src="{{imagesPath.upIcon}}" class="up-icon"></image> -->
        </view>
        <scroll-view class="inner-box" scroll-y="true" style="height: 58vh;">
            <image :src="state.descUrl" mode="widthFix"></image>
        </scroll-view>
    </view>
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
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiGiftCardServiceJs from "@/service/api/newretail/giftCardService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/buyHistory/buyHistory.js
const giftCardService = _apiGiftCardServiceJs;
const systemService = _apiSystemServiceJs;
const auth = _utilsAuthJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const selfA = _utilsSelfJs;
//获取应用实例
const state = reactive({
  themeManager: themeManager,
  imagesPath: IMGAGESPATH,
  navigationBarTitle: "我的礼品卡",
  themeColor: '',
  // 主题颜色
  cardList: [],
  // 所有卡列表
  useList: [],
  // 可用卡列表
  unuseList: [],
  // 不可用卡列表
  useSwitch: true,
  // 可用卡开关
  unuseSwitch: true,
  // 不可用卡开关
  descFlag: false,
  // 使用说明
  descUrl: '' //说明图片
});
function getCardList() {
  let _userInfo = auth.getUser();
  if (_userInfo && _userInfo.member) {
    let memberId = _userInfo.member.id;
    // giftCardService.queryMyGiftCard('1920322267577856001').then(res => {
    giftCardService.queryMyGiftCard(memberId).then(res => {
      console.log(res);
      if (res && res.length > 0) {
        let useList = [];
        let unuseList = [];
        res.forEach(item => {
          // 未激活和使用中为可用 其他都为不可用
          if ((item.state === 'UNACTIVATED' || item.state === 'USING') && !item.excludePromotion && !item.hasCardPayActivity) {
            useList.push(item);
          } else {
            unuseList.push(item);
          }
        });
        state.cardList = res;
        state.useList = useList;
        state.unuseList = unuseList;
      } else {
        state.cardList = [];
        state.useList = [];
        state.unuseList = [];
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
function changeSwitch(e) {
  let flag = e.currentTarget.dataset.type;
  if (flag === 'use') {
    state.useSwitch = !state.useSwitch;
  } else if (flag === 'unuse') {
    state.unuseSwitch = !state.unuseSwitch;
  }
  state.useSwitch = state.useSwitch;
  state.unuseSwitch = state.unuseSwitch;
}
function operateCard(e) {
  const _this = this;
  let state = e.currentTarget.dataset.state;
  let cardNo = e.currentTarget.dataset.cardno;
  console.log(cardNo, state);
  let tips = '是否确认' + (state === 'UNACTIVATED' ? '激活' : '解绑');
  uni.showModal({
    title: '',
    content: tips,
    success(res) {
      if (res.confirm) {
        if (state === 'UNACTIVATED') {
          // 去激活
          activeCard(cardNo);
        } else {
          // 去解绑
          unbindCard(cardNo);
        }
      } else if (res.cancel) {}
    }
  });
}
function activeCard(cardNo) {
  giftCardService.active(cardNo).then(res => {
    // console.log(res)
    getCardList();
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function unbindCard(cardNo) {
  let postData = {
    cardNos: [cardNo]
    // 后续还要加个验证码
  };
  giftCardService.unActive(postData).then(res => {
    // console.log(res)
    getCardList();
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function bindNewCard() {
  NAVPAGE.toBindGiftCard();
}
function descSwitch() {
  state.descFlag = true;
  state.descFlag = state.descFlag;
}
function closeDec() {
  state.descFlag = false;
  state.descFlag = state.descFlag;
}
function getDeacUrl() {
  systemService.query('app.mbr.giftCard-IMAGES').then(res => {
    if (res && res.length > 0 && res[0].value) {
      state.descUrl = res[0].value;
    }
  });
}
onLoad(function (options) {
  state.themeColor = app.globalData.uiconfig.themeColor;
  getDeacUrl();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {
  // 回退到该页，重新获取卡列表
  getCardList();
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function (res) {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  return {
    path: "/pages-sub/newretail/pages/mallModule/index/index/index"
  };
});
</script>
<style scoped>
/* pages/mygiftcard/mygiftcard.wxss */
.my-gift {
    background: #F4F5F7;
    min-height: 100vh;
}
.use-desc {
    height: 60rpx;
    line-height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding:0 25rpx;
}
.desc-btn {
    display: flex;
    align-items: center;
}
.desc-icon {
    width: 24rpx;
    height: 24rpx;
    margin-right: 15rpx;
}
.use-desc text {
    font-family: Source Han Sans CN;
    font-size: 24rpx;
    color: #000;
}
.add-btn {
    background: #fff;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.add-btn .add-image {
    width: 25rpx;
    height: 25rpx;
    /* background: #000; */
}
.add-btn text {
    font-family: Source Han Sans CN;
    font-weight: bold;
    font-size: 28rpx;
    color: #000;
    margin-left: 15rpx;
}
.use-box {
    margin-top: 1rpx;
}
.use-head {
    padding: 0 26rpx;
    background: #fff;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.font-box {
    display: flex;
    align-items: center;
    font-size: 28rpx;
}
.switch-btn {
    width: 50rpx;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.up-icon {
    width: 27rpx;
    height: 15rpx;
    transition: all .3s;
}
.rotate-icon {
    transform: rotate(180deg);
}
.card-list {
    padding: 25rpx;  
}
.card-item {
    width: 693rpx;
    height: 234rpx;
    position: relative;
    margin-bottom: 25rpx;
}
.giftbg {
    width: 693rpx;
    height: 234rpx;
    position: absolute;
    left: 0;
    top: 0;
}
.card-inner {
    width: 693rpx;
    position: relative;
    height: 234rpx;
    box-sizing: border-box;
    padding:0 25rpx;
}
.card-hd {
  min-height: 100rpx;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
}
.card-hd .card-num {
    font-family: Source Han Sans CN;
    font-size: 28rpx;
    color: #FFFFFF;
    /* line-height: 60rpx; */
    margin-bottom: 10rpx;
}
.card-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #FFFFFF;
    font-size: 24rpx;
}
.card-bd {
    position: relative;
}
.balance {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin-top: 30rpx;
    font-family: Source Han Sans CN;
    font-size: 28rpx;
    color: #F41C0C;
}
.balance-num {
    font-size: 48rpx;
    position: relative;
    top: 7rpx;
    font-weight: 700;
}
.balance-num text {
    font-size: 28rpx;
    font-weight: 400;
    padding-right: 5rpx;
}
.operate-btn {
    width: 123rpx;
    height: 60rpx;
    border-radius: 30rpx;
    border: 1px solid #F53121;
    position: absolute;
    right: 25rpx;
    top: 12rpx;
    text-align: center;
    line-height: 60rpx;
    font-size: 28rpx;
}
.card-bd .activation {
    background: #F41C0C;
    color: #fff;
}
.card-bd .unbind {
    color: #F41C0C;
}
.unbind-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 693rpx;
    height: 234rpx;
    background: rgba(255,255,255,0.5);
}

.card-nodata {
    display: flex;
    flex-direction: column ;
    align-items: center;
    justify-content: center;
    padding: 40rpx 0;
}
.nodata {
    width: 173rpx;
    height: 164rpx;
}
.nocard-font {
    font-family: Source Han Sans CN;
    font-size: 28rpx;
    color: #999999;
    line-height: 37rpx;
    margin: 35rpx 0 40rpx;
}
.btn-newcard {
    width: 306rpx;
    height: 88rpx;
    /* background: #FC6700;
    background: #FC6700; */
    background: linear-gradient(to right, #F41C0C, #FC6700);
    border-radius: 44rpx;
    text-align: center;
    line-height: 88rpx;
    color: #fff;
    font-size: 32rpx;
}

.desc-pop {
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
}
.inner-box {
    width: 700rpx;
    padding: 10rpx;
    background: #fff;
    border-radius: 20rpx;
    margin: 400rpx auto;
}
.closepop {
    width: 80rpx;
    height: 80rpx;
    line-height: 80rpx;
    /* background: red; */
    position: absolute;
    right: 40rpx;
    top: 320rpx;
    text-align: center;
    font-size: 36rpx;
}
.inner-box image{
    width: 100%;
}
</style>