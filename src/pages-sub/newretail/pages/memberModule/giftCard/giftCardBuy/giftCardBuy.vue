<template>
<!--pages/giftCardBuy/giftCardBuy.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="cards-box">
  <view class="show-box">
    <image :src="state.showCheckedImg"></image>
  </view>
  <scroll-view class="cards-show" scroll-x="" style="width: 100%">
    <view :class="'cards-item ' + (item.active ? 'active' : '')" v-for="(item , index) in state.cardList" wx:index="index" :key="id" :data-styleid="item.styleId" @click="clickChange">
      <image class="card-img" :src="item.imageUrl"></image>
      <image class="checked-icon" :src="state.imagesPath.iconXuanzhong"></image>
    </view>
  </scroll-view>
</view>
<view class="content">
  <view class="content-text">
    <image :src="state.imagesPath.icon$"></image>
    选择卡面额
  </view>
  <view :class="'price-item ' + (item.active ? 'active' : '')" v-for="(item , idx) in state.priceList" :key="faceId" :data-faceid="item.faceId" @click="clickPrice">
    <text>{{item.faceValue}}元</text>
    <text>售价：{{item.price}}元</text>
    <image class="checked-icon" :src="state.imagesPath.iconXuanzhong"></image>
  </view>
</view>
<view class="need-know">
  <text @click="toUseNeedKnow">使用须知</text>
</view>
<view class="buy-box">
  <view>
    <view>总计：</view>
    <view>￥{{state.needPayValue}}</view>
  </view>
  <button :class="state.cardInfo.balance > 0 ? 'available' : 'unavailable'" @click="handleBuy">购买</button>
</view>
</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiGiftCardServiceJs from "@/service/api/newretail/giftCardService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/giftCardBuy/giftCardBuy.js
const giftCardService = _apiGiftCardServiceJs;
const request = _apiRequestJs;
const utils = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const ADDRESS = _utilsAddressJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const selfJs = _utilsSelfJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "购买礼品卡",
  imagesPath: IMGAGESPATH,
  showCheckedImg: '',
  cardList: [],
  priceList: [],
  needPayValue: 0,
  cardInfo: "",
  options: {}
});
onLoad(function (options) {
  setSharePeopleInfo(options);
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
function setSharePeopleInfo(options) {
  state.options = options;
  let shareData = {
    shareId: null
  };
  if (options.scene) {
    let scene = decodeURIComponent(options.scene);
    if (scene.indexOf("gmparam:") >= 0) {
      let sceneArr = scene.split('gmparam:');
      const _sceneId = sceneArr[1];
      sceneId = _sceneId != null ? _sceneId : null;
    } else {
      shareData.shareId = scene;
    }
  } else if (options.shareId && options.shareId != '' && options.shareId != null) {
    shareData.shareId = options.shareId;
  }
  if (!shareData.shareId) {
    return;
  }
  // 分享信息打开统计
  ANALYSIS.ShareOpenAnalysis();
  utils.setSharingGiftCardPerson(shareData);
}
function getActivityDetail(giftCardActivityId) {
  // 如果活动id存在，查询该活动的详情
  if (giftCardActivityId) {
    giftCardService.getById(giftCardActivityId).then(res => {
      console.log(res);
      if (res && res.card) {
        let tempDta = {
          ...res,
          balance: res.balance >= 0 ? res.balance : 999
        };
        let cardList = [];
        let priceList = [];
        if (res.card.cardStyles) {
          res.card.cardStyles.forEach((item, index) => {
            if (index === 0) {
              cardList.push({
                ...item,
                active: true
              });
            } else {
              cardList.push({
                ...item,
                active: false
              });
            }
          });
        }
        if (res.card.faces) {
          res.card.faces.forEach(item => {
            priceList.push({
              ...item,
              active: false
            });
          });
        }
        //   this.data.cardList.forEach(async (item, index) => {
        //     await selfJs.getTemporaryUrl(item.imageUrl)
        //     .then (res1=>{
        //         item.imageUrl = res1;
        //         if(index == this.data.cardList.length - 1 ){
        //             this.setData({
        //                 cardList: this.data.cardList
        //             })
        //         }
        //     })
        //   })
        state.cardInfo = tempDta;
        state.cardList = cardList;
        state.priceList = priceList;
        state.showCheckedImg = res.card.cardStyles[0].imageUrl;
      }
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
  // 当前门店id
  storeId = '';
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    storeId = app.globalData.storeInfo.id;
  } else {
    ADDRESS.getLocation().then(res => {
      app.globalData.storeInfo = res;
      storeId = res.id;
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
onReady(function () {});
onShow(function () {
  // 判断用户是否授权
  if (!app.globalData.userInfo) {
    NAVPAGE.toAuthorize();
    return;
  }
  if (sceneId) {
    getSceneById(sceneId);
  } else {
    getActivityDetail(state.options.giftCardActivityId);
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
function clickChange(e) {
  console.log(e);
  let tempArr = state.cardList;
  tempArr.forEach(item => {
    if (item.styleId === e.currentTarget.dataset.styleid) {
      item.active = true;
      state.showCheckedImg = item.imageUrl;
    } else {
      item.active = false;
    }
  });
  state.cardList = tempArr;
}
function clickPrice(e) {
  let tempArr = state.priceList;
  let tempValue = 0;
  tempArr.forEach(item => {
    if (item.faceId === e.currentTarget.dataset.faceid) {
      item.active = !item.active;
      if (item.active) {
        tempValue = item.price;
      } else {
        tempValue = 0;
      }
    } else {
      item.active = false;
    }
  });
  state.priceList = tempArr;
  state.needPayValue = tempValue;
}
function toUseNeedKnow() {
  uni.setStorage({
    key: "_useNeedKnow",
    data: state.cardInfo
  });
  NAVPAGE.toUseNeedKnow();
}
function handleBuy() {
  const that = this;
  if (state.cardInfo.maxQty === 0 || state.cardInfo.maxQty && state.cardInfo.balance && state.cardInfo.balance > 0) {
    let faceId = "";
    let payAmount = 0;
    let faceValue = 0;
    state.priceList.forEach(item => {
      if (item.active) {
        faceId = item.faceId;
        payAmount = item.price;
        faceValue = item.faceValue;
      }
    });
    if (!faceId) {
      uni.showToast({
        title: "请选择卡面额",
        icon: 'none',
        duration: 2000
      });
      return;
    }
    let styleId = '';
    let imageUrl = '';
    state.cardList.forEach(item => {
      if (item.active) {
        styleId = item.styleId;
        imageUrl = item.imageUrl;
      }
    });
    let postData = {
      cardId: state.cardInfo.card.id,
      // 礼品卡id
      cardName: state.cardInfo.name,
      // 礼品卡名称
      faceId: faceId,
      // 面额id
      giftCardActivityId: state.cardInfo.id,
      // 礼品卡活动id
      giftCardActivityName: state.cardInfo.name,
      // 礼品卡活动名称
      imageUrl: imageUrl,
      // 礼品卡图片
      payAmount: payAmount,
      // 总金额（具体卡支付金额）
      styleId: styleId,
      // 样式id
      total: faceValue,
      // 总金额（具体卡面额）
      storeId: storeId
    };

    //如果有分享人，下单记录分享人id
    let shareData = utils.getSharingGiftCardPerson();
    if (shareData) {
      postData.sharingPersonId = shareData.shareId;
    }
    giftCardService.createOrder(postData).then(res => {
      return res;
    }).then(orderId => {
      console.log(orderId);
      let postData = {
        orderId: orderId,
        payMethod: app.globalData.paymentMethod || request.PAYMETHOD
      };
      giftCardService.getPaySign(postData).then(res => {
        // console.log(res)
        let resData = JSON.parse(res);
        let sign = JSON.parse(resData.sign);
        // console.log(sign)
        uni.requestPayment({
          'timeStamp': sign.timeStamp,
          'nonceStr': sign.nonceStr,
          'package': sign.package ? sign.package : sign.packageValue,
          'signType': sign.signType,
          'paySign': sign.paySign,
          'success': function (res) {
            console.log('支付成功---------------');
            console.log(res);
            let selfTime = setInterval(function () {
              giftCardService.getStatusById(orderId).then(result => {
                console.log('查询交易结果-------------');
                console.log(result);
                if (result.status === 'SUCCESS' && result.cardNo) {
                  utils.setHideLoading(false);
                  clearInterval(selfTime);
                  let opts = '?cardNo=' + result.cardNo;
                  NAVPAGE.toCardBuyResult(opts);
                  if (postData.sharingPersonId) {
                    utils.removeSharingGiftCardPerson();
                  }
                } else if (result.status === 'FAILED') {
                  utils.setHideLoading(false);
                  // 提示购卡失败原因
                  clearInterval(selfTime);
                  if (result.failedReason) {
                    uni.showToast({
                      title: result.failedReason,
                      icon: 'none',
                      duration: 2000
                    });
                  }
                } else {
                  utils.setHideLoading(true);
                }
              }).catch(err => {
                clearInterval(selfTime);
                uni.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                });
              });
            }, 300);
          },
          'fail': function (res) {
            console.log('支付失败-------------');
            console.log(res);
            if (res.errMsg.indexOf("cancel") >= 0) {
              uni.showToast({
                title: '您取消了支付~',
                icon: 'none',
                duration: 2000
              });
            } else {
              uni.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              });
            }
          }
        });
      }).catch(err => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {
    uni.showToast({
      title: '礼品卡库存不足，看看其他活动吧~',
      icon: 'none',
      duration: 2000
    });
  }
}
function getSceneById(id) {
  const self = this;
  wxaUserService.getSceneById(id).then(res => {
    function urlToObj(str) {
      let obj = {};
      let arr = str.split("&");
      for (let i = 0; i < arr.length; i++) {
        let ele = arr[i].split("=");
        obj[ele[0]] = ele[1];
      }
      return obj;
    }
    const _options = urlToObj(res);
    options = _options;
    getActivityDetail(state.options.giftCardActivityId);
  }).catch(err => {
    util.showToast(err.message);
  });
}
</script>
<style scoped>
/* pages/giftCardBuy/giftCardBuy.wxss */

.cards-box {
  padding: 0rpx 40rpx;
}

.show-box {
  width: 100%;
  text-align: center;
  padding: 40rpx 0rpx 20rpx;
}

.show-box image {
  width: 530rpx;
  height: 319rpx;
  border-radius: 10rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.3);
}

.cards-show {
  width: 100%;
  white-space: nowrap;
}

.cards-show .cards-item {
  width: 168rpx;
  height: 100rpx;
  position: relative;
  margin-right: 20rpx;
  display: inline-block;
  margin-top: 18rpx;
}

.cards-show .cards-item image {
  width: 100%;
  height: 100%;
  border-radius: 14rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.cards-item.active .card-img {
  border: 2rpx solid #f1b400;
}

.checked-icon {
  display: none;
}

.cards-item.active .checked-icon {
  display: block;
  position: absolute;
  right: -14rpx;
  top: -14rpx;
  width: 44rpx;
  height: 44rpx;
}

.content {
  padding: 40rpx;
  padding-bottom: 0rpx;
  color: #333;
  font-size: 30rpx;
  overflow: hidden;
}

.content-text {
  margin-bottom: 20rpx;
}

.content-text image {
  width: 34rpx;
  height: 34rpx;
  vertical-align: middle;
  margin-top: -6rpx;
}

.price-item {
  width: 320rpx;
  height: 220rpx;
  border-radius: 20rpx;
  border: 1rpx solid #ddd;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 2rpx 0rpx 10rpx rgba(0, 0, 0, 0.1);
  position: relative;
  box-sizing: border-box;
  float: left;
  margin-right: 30rpx;
  margin-bottom: 40rpx;
}

.price-item:nth-of-type(2n+1) {
  margin-right: 0rpx;
}

.price-item text:first-of-type {
  font-size: 48rpx;
  margin-bottom: 20rpx;
}

.price-item text:last-of-type {
  font-size: 34rpx;
}

.price-item.active {
  color: #f1b400;
  border: 4rpx solid #f1b400;
}

.price-item.active .checked-icon {
  display: block;
  position: absolute;
  right: -18rpx;
  top: -18rpx;
  width: 50rpx;
  height: 50rpx;
}

.need-know {
  text-align: center;
  font-size: 26rpx;
  color: #f1b400;
  text-decoration: underline;
  margin-bottom: 180rpx;
}

.buy-box {
  height: 140rpx;
  border-top: 1rpx solid #EAEAEA;
  font-size: 32rpx;
  padding: 0rpx 40rpx;
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}

.buy-box button {
  width: 206rpx;
  height: 96rpx;
  color: #fff;
  float: right;
  margin-top: 22rpx;
}

.buy-box button.unavailable {
  background: rgba(241, 180, 0, 0.5) !important;
}

.buy-box button.available {
  background: #f1b400 !important;
}

.buy-box>view {
  float: left;
  height: 140rpx;
  line-height: 40rpx;
}

.buy-box>view view:first-of-type {
  font-size: 24rpx;
  margin-top: 28rpx;
}
</style>