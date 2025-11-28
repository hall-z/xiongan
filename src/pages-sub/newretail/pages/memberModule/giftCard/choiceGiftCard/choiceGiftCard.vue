<template>
<!--pages/memberModule/giftCard/choiceGiftCard/choiceGiftCard.wxml-->
<view>
<!-- <view> -->
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
           <view class="payment-amount">
               <view class="payment-price">
                   <text>合计：</text>
                   <text>¥ {{filtToFix(state.totalPrice)}}</text>
               </view>
               <view class="card-payment">
                    <text>礼品卡支付：</text>
                    <text>¥{{filtToFix(state.giftPaymentNum)}}</text>
               </view>
           </view>
            <view class="card-list">
                <view class="card-item" v-for="(item , index) in state.useList" :key="index">
                    <image :src="state.themeManager.BASE_URL + '/giftbg.png'" class="giftbg"></image>
                    <view class="card-inner">
                        <view class="card-hd">
                            <text class="card-num">{{item.cardNo}}</text>
                            <view class="card-info">
                                <view class="card-price">
                                    <text class="price-font">面值：</text>
                                    <text class="price-num">¥{{filtToFix(item.faceAmount)}}</text>
                                </view>
                                <text class="card-time">{{item.endDate}}到期</text>
                            </view>
                        </view>
                        <view class="card-bd">
                            <view class="balance"><text class="balance-font">余额：</text><view class="balance-num"><text>¥</text>{{filtToFix(item.balance)}}</view><text></text></view>
                            <!-- 激活操作 -->
                            <view v-if="item.state === 'UNACTIVATED' && item.cardType === 'OnlineGiftCard'" @click="operateCard" :data-state="item.state" :data-cardNo="item.cardNo" :class="item.state == 'UNACTIVATED' ? 'operate-btn activation' : 'operate-btn unbind'">
                                <text>激活</text>
                            </view>
                            <!-- 选中 -->
                            <view :class="item.isChecked ? 'chose-box checked' : 'chose-box unchecked'" v-else @click="choseCard" :data-cardNo="item.cardNo">
                                <image v-if="item.isChecked" :src="state.themeManager.BASE_URL + '/true.png'" class="true-icon"></image>
                            </view>
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
                                    <text class="price-num">¥{{filtToFix(item.faceAmount)}}</text>
                                </view>
                                <text class="card-time">{{item.endDate}}到期</text>
                            </view>
                        </view>
                        <view class="card-bd">
                            <view class="balance"><text class="balance-font">余额：</text><text class="balance-num">¥{{filtToFix(item.balance)}}</text><text></text></view>
                            <view class="chose-box"></view>
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
        </view>
    </view>
    <view class="sure-btn" @click="toPerfectOrder">确定</view>
    <!-- 使用说明 -->
    <view class="desc-pop" v-if="state.descFlag">
        <view class="closepop" @click="closeDec">
            x
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

// pages/memberModule/giftCard/choiceGiftCard/choiceGiftCard.js
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
  navigationBarTitle: "选择礼品卡",
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
  totalPrice: 0,
  //合计
  giftPaymentNum: 0,
  //礼品卡支付金额 
  choiseCarList: [],
  // 已选中卡列表
  descUrl: '' //说明图片
});
function getCardList() {
  let _userInfo = auth.getUser();
  if (_userInfo && _userInfo.member) {
    let memberId = _userInfo.member.id;
    giftCardService.queryMyGiftCard(memberId).then(res => {
      // giftCardService.queryMyGiftCard('1920322267577856001').then(res => {
      console.log(res);
      if (res && res.length > 0) {
        let useList = [];
        let unuseList = [];
        res.forEach(item => {
          // 未激活和使用中为可用 其他都为不可用
          if ((item.state === 'UNACTIVATED' || item.state === 'USING') && !item.excludePromotion && !item.hasCardPayActivity) {
            item.isChecked = false;
            useList.push(item);
          } else {
            unuseList.push(item);
          }
        });

        // 可用卡中选中项回显
        useList.forEach(useItem => {
          state.choiseCarList.forEach(item => {
            if (useItem.cardNo === item.cardNo) {
              useItem.isChecked = true;
            }
          });
        });
        // 回显后继续计算礼品卡支付金额
        let cardMoney = 0;
        useList.forEach(item => {
          if (item.isChecked) {
            cardMoney += item.balance;
          }
        });
        let giftPaymentNum = 0;
        if (cardMoney > state.totalPrice) {
          giftPaymentNum = state.totalPrice;
        } else {
          giftPaymentNum = cardMoney;
        }
        state.cardList = res;
        state.useList = useList;
        state.unuseList = unuseList;
        state.giftPaymentNum = giftPaymentNum;
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
  let cardNo = e.currentTarget.dataset.cardNo;
  let tips = '是否确认激活';
  uni.showModal({
    title: '',
    content: tips,
    success(res) {
      if (res.confirm) {
        // 去激活
        this.activeCard(cardNo);
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
function choseCard(e) {
  const cardNo = e.currentTarget.dataset.cardno;
  let tempList = state.useList;
  let card = null;

  // 改选中状态前，获取当前选中的礼品卡金额
  let choiseCardMoney = tempList.reduce((prev, cur, index, arr) => {
    return prev + (cur.isChecked ? cur.balance : 0);
  }, 0);
  // 如果当前用户订单金额 <= 已选中的礼品卡金额 则不允许用户再继续操作选中
  let nextFlag = true;
  tempList.forEach(item => {
    if (item.cardNo === cardNo && !item.isChecked && state.totalPrice <= choiseCardMoney) {
      nextFlag = false;
    }
  });
  if (!nextFlag) {
    uni.showToast({
      title: '当前选中的礼品卡金额已足够支付订单',
      icon: 'none',
      duration: 2000
    });
    return false;
  }
  tempList.forEach(item => {
    if (item.cardNo === cardNo) {
      item.isChecked = !item.isChecked;
    }
  });
  let cardMoney = 0;
  tempList.forEach(item => {
    if (item.isChecked) {
      cardMoney += item.balance;
    }
  });
  let giftPaymentNum = 0;
  if (cardMoney > state.totalPrice) {
    giftPaymentNum = state.totalPrice;
  } else {
    giftPaymentNum = cardMoney;
  }
  state.useList = tempList;
  state.giftPaymentNum = giftPaymentNum;
}
function toPerfectOrder() {
  let chooseCards = [];
  state.useList.forEach(item => {
    if (item.isChecked) {
      chooseCards.push(item);
    }
  });
  if (chooseCards.length > 0) {
    console.log(chooseCards);
    uni.setStorageSync('wj_chooseCard', chooseCards);
  } else {
    uni.setStorageSync('wj_chooseCard', null);
  }
  uni.navigateBack({
    delta: 1
  });
  // const card = this.data.card
  // if (card.cardId != null) {
  //   console.log(card)
  //   if (card.useable) {
  //     try {
  //       wx.setStorageSync('wj_chooseCard', card)
  //     } catch (e) {}
  //     wx.navigateBack({
  //       delta: 1
  //     })
  //   } else {
  //     wx.showToast({
  //       title: card.reason,
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   }
  // } else {
  //   try {
  //     wx.setStorageSync('wj_chooseCard', null)
  //   } catch (e) {}
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // }
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
onLoad(function (options) {
  console.log(options);
  // const productData = decodeURIComponent(options.productData)
  // let productList = JSON.parse(productData)
  // console.log(productList);
  let choiseCarList = [];
  if (options.cardList) {
    choiseCarList = JSON.parse(options.cardList);
  }
  state.themeColor = app.globalData.uiconfig.themeColor;
  state.totalPrice = options.orderLastPrice;
  state.choiseCarList = choiseCarList;
  getDeacUrl();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
function getDeacUrl() {
  systemService.query('app.mbr.giftCard-IMAGES').then(res => {
    if (res && res.length > 0 && res[0].value) {
      state.descUrl = res[0].value;
    }
  });
}
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
/* pages/memberModule/giftCard/choiceGiftCard/choiceGiftCard.wxss */
.my-gift {
    background: #F4F5F7;
    min-height: 100vh;
    padding-bottom: 130rpx;
}
.use-desc {
    height: 60rpx;
    line-height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding:0 26rpx;
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
    vertical-align: middle;
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
    /* line-height: 50rpx; */
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
.chose-box {
    width: 42rpx;
    height: 42rpx;
    border-radius: 50%;
    position: absolute;
    right: 25rpx;
    top: 16rpx;
    text-align: center;
    background: #C3C3C3;
}
.card-bd .checked {
    background: #F41C0C;
}
.card-bd .unchecked {
    background: #FFFFFF;
    border: 2rpx solid #C3C3C3;
}
.true-icon {
    width: 28rpx;
    height: 24rpx;
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
.sure-btn {
    width: 689rpx;
    height: 88rpx;
    /* background: #FC6700;
    background: #FC6700; */
    background: linear-gradient(to right, #F41C0C, #FC6700);
    border-radius: 44rpx;
    text-align: center;
    line-height: 88rpx;
    color: #fff;
    font-size: 32rpx;
    /* margin: 50rpx auto 30rpx; */
    position: fixed;
    bottom: 50rpx;
    left: 50%;
    margin-left: -344rpx;
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
.payment-amount {
    padding: 25rpx 30rpx 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: Source Han Sans CN;
    font-size: 24rpx;
    color: #333333;
}
.payment-price {
    margin-right: 40rpx;
}
</style>