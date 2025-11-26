<template>
<!--pages/payment/payment.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
    <!-- style="overflow-y:{{show.luckDraw||show.middle||show.promotion?'hidden':'auto'}};height: {{show.luckDraw||show.middle||show.promotion?'100vh':'100%'}};" -->
  <view class="prompt-box">
    <image class="success-icon" :style="'margin-top: ' + state.successIconTop + ';'" :src="state.imagesPath.iconSuccess"></image>
    <view class="success-text">支付成功</view>
  </view>
  <view class="delivery-box" v-if="state.showCode">
    <view class="title">您的订单提货码为</view>
    <view class="code-box">
      <view class="barcode-box">
        <canvas id="paybarcode" type="2d" :style="state.barcodeImageUrl ? 'left: 300%;' : ''">
        <image :src="state.barcodeImageUrl" v-if="state.barcodeImageUrl"></image>
      </canvas></view>
      <view>{{state.codeText}}</view>
    </view>
    <view class="tips" v-if="state.orderType == 'normal'">请至收银台，凭订单提货码取货</view>
    <view class="tips" v-if="state.orderType == 'advanceSell'">{{state.payType === "FULL" ? "全款" : "尾款"}}支付成功，您可根据提货码在规定时间内到指定门店取货</view>
  </view>
  <view class="delivery-box" v-if="!state.showCode">
    <view class="tips" v-if="state.type === 'SELF'">定金支付成功，提货码将于尾款支付成功后展示。</view>
    <view class="tips" v-if="state.type === 'EXPRESS' && state.orderStatus === 'WAITPAYBALANCE'">定金支付成功，我们将于尾款支付后{{state.deliveryTime}}天发货。</view>
    <view class="tips" v-if="state.type === 'EXPRESS' && state.orderStatus === 'PAID' && state.deliveryTime && state.deliveryTime != null">我们将于{{state.deliveryTime}}天后发货。</view>
  </view>
  <view class="btn-box" :style="'margin-top: ' + state.marginTop + ';'">
    <button class="btn" type="default" @click="toIndex">返回首页</button>
    <button class="btn" type="default" @click="toOrderDetails">查看订单</button>
  </view>
  <recommend-list :storeId="state.storeId" type="payment" :productIds="state.productIds" @goodsNum="handleRecommendGoodsNum"></recommend-list>
</view>

<!-- 优惠券弹窗 -->
<popup :show="state.show.promotion" position="middle" custom-class="middle" @close="togglePromotionPopup">
  <view class="popup-box">
    <view class="popup-title">温馨提示</view>
    <view class="popup-content">
      <text>恭喜您获得</text>
      <text class="popup-text" v-for="(item , index) in state.couponPromotions" :key="key">{{item}}</text> 
    </view>
    <view class="popup-button">
      <text>优惠券已放入您的券包</text>
      <button class="share-btn" @click="foundPromotion">查看我的优惠券</button>
    </view>
  </view>
</popup>
<popup :show="state.show.luckDraw && !state.show.promotion" position="top" custom-class="top" @close="toggleLuckDrawPopup" :overlayStyle="state.luckDrawImageBg">
  <view class="popup-luckdraw-box">
    <luckdraw-game :luckDrawText="state.luckDrawTextImage" @draw="getUserClickDraw" :onClickLuckDraw="isMember" @fans="getUserIsFans" :status="state.raffleResult" :hasUserInfo="hasUserInfo"></luckdraw-game>
    <view class="popup-luckdraw-close" @click="toggleLuckDrawPopup">
      <image :src="state.imagesPath.iconIndexPopupClose"></image>
    </view>
  </view>
</popup>
<popup :show="state.show.luckDrawPopup && !state.show.promotion" position="middle" custom-class="middle" @close="togglePopupLuckDraw">
  <view class="popup-luckdraw-window-box">
    <view class="popup-window-image">
      <image :src="popupWindowImage" mode="widthFix" v-if="!state.afterShareToDraw" @click="handlePopupDraw"></image>
      <button open-type="share" data-type="luckDraw" v-else>
        <image :src="popupWindowImage" mode="widthFix"></image>        
      </button>
    </view>
    <view class="popup-luckdraw-window-close" @click="togglePopupLuckDraw">
      <image :src="state.imagesPath.iconIndexPopupClose"></image>
    </view>
  </view>
</popup>
<popup :show="state.show.middle" position="middle" custom-class="middle" @close="toggleMiddlePopup">
  <view class="popup-box">
    <view class="popup-title">抽奖结果</view>
    <view class="popup-close" @click="toggleMiddlePopup">
      <image :src="state.imagesPath.iconLuckDrawClose"></image>
    </view>
    <view v-if="state.hasRaffleCoupon">
      <view class="popup-content">
        <text class="popup-tips">恭喜您成功领取</text>
        <text class="popup-text">{{state.raffleInfo.rafflePrizeName}}</text>
      </view>
      <view class="popup-button">
        <text>券已放入您的账户</text>
        <button class="share-btn" open-type="share">把好运气分享给小伙伴</button>
      </view>
    </view>
    <view v-if="!state.hasRaffleCoupon">
      <view v-if="state.activeState === 'end'">
        <view class="popup-content">
          <text class="popup-text">您来晚了</text>
          <text class="popup-text">活动已经结束了！</text>
        </view>
        <view class="popup-button">
          <text>敬请期待下次活动哦</text>
          <button class="share-btn" @click="toggleluckDrawResultPopup">去商城逛逛</button>
        </view>
      </view>
      <view v-if="state.activeState === 'start'">
        <view class="popup-content">
          <text class="popup-text-end">您来晚了</text>
          <text class="popup-text-end">奖品已被抽光了！</text>
        </view>
        <view class="popup-button">
          <text>活动期间扫码可获得抽奖机会</text>
          <button class="share-btn" @click="toggleluckDrawResultPopup">去商场逛逛</button>
        </view>
      </view>
    </view>
  </view>
</popup>
</template>
<script setup>
import _utilsSubscribeMessageJs from "@/utils/newretail/subscribeMessage";
import _utilsLogJs from "@/utils/newretail/log";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsSelfJs from "@/utils/newretail/self";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiTeamBuyServiceJs from "@/service/api/newretail/teamBuyService";
import _apiRaffleServiceJs from "@/service/api/newretail/raffleService";
import _apiAdvanceSellServiceJs from "@/service/api/newretail/advanceSellService";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import recommendList from '@/pages-sub/newretail/components/recommend/recommend-list-two/recommend-list.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/payment/payment.js
const orderService = _apiOrderServiceJs;
const advanceSellService = _apiAdvanceSellServiceJs;
const raffleService = _apiRaffleServiceJs;
const teamBuyService = _apiTeamBuyServiceJs;
const productService = _apiProductServiceJs;
const wxbarcode = _utilsSelfJs;
const util = _utilsUtilsJs;
const ADDRESS = _utilsAddressJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const themeManager = _utilsThemeManagerJs;
const ANALYSIS = _utilsAnalysisJs;
const log = _utilsLogJs;
const subscribeMessage = _utilsSubscribeMessageJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "支付成功",
  imagesPath: IMGAGESPATH,
  orderId: '',
  showCode: false,
  codeText: '',
  marginTop: '554rpx',
  successIconTop: "204rpx",
  type: "",
  orderType: 'normal',
  deliveryTime: '',
  orderStatus: '',
  button: false,
  show: {
    middle: false,
    luckDraw: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    promotion: false,
    luckDrawPopup: false
  },
  luckDrawTextImage: './image/text.png',
  overlayStyle: '',
  raffleId: '',
  raffleInfo: {},
  recommendingNum: 0,
  onUnload: true,
  barcodeImageUrl: '',
  hasRaffleCoupon: true,
  activeState: 'start',
  //start end
  raffleResult: 'UNSTART',
  raffleActivityId: '',
  luckDrawImageBg: "",
  storeId: "",
  couponPromotions: [],
  //优惠券
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  afterShareToDraw: false,
  raffleType: 'LHJ',
  prefix: '',
  payType: 'FULL',
  productIds: []
});
let _data = {
  business: '',
  hasUserDraw: false
};
function toIndex() {
  const that = this;
  state.button = true;
  function handleToIndex() {
    NAVPAGE.toHome();
  }
  subscriptionMessagePopup(subscribeMessage.scene.ORDER_PAY_SUCCESS, handleToIndex);
}
function toOrderDetails() {
  const that = this;
  function handleToOrderDetails() {
    let opts = '?orderId=' + state.orderId + '&status=付款待自提' + '&orderType=' + state.orderType;
    NAVPAGE.toOrderDetails(opts);
    // if (that.options.from === 'shopCart') {
    //   let opts = '?orderId=' + that.data.orderId + '&status=付款待自提';
    //   NAVPAGE.toOrderDetails(opts);
    // } else {
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // }
  }
  subscriptionMessagePopup(subscribeMessage.scene.ORDER_PAY_SUCCESS, handleToOrderDetails);

  // 查询订阅消息
  // if (app.globalData.templateIdsQuery) {
  //   handleSubscribeMessage()
  // } else {
  //   subscribeMessage.getTemplateIds().then(res => {
  //     handleSubscribeMessage()
  //   }).catch(err => {
  //     console.log(err.message);
  //     log.warn("查询模板id报错：", err.message);
  //   })
  // }
}
function subscriptionMessagePopup(SCENE, originalOperation) {
  const that = this;
  // 查询订阅消息
  if (app.globalData.templateIdsQuery) {
    handleSubscribeMessage();
  } else {
    subscribeMessage.getTemplateIds().then(res => {
      handleSubscribeMessage();
    }).catch(err => {
      console.log(err.message);
      originalOperation();
      log.warn("查询模板id报错：", err.message);
    });
  }
  function handleSubscribeMessage() {
    let templateIds = [];
    templateIds = subscribeMessage.handleTemplateIds(SCENE);
    console.log(templateIds);
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res);
            subscribeMessage.addSubscribe(SCENE, res);
            log.info(res);
            originalOperation();
          },
          fail(err) {
            console.log(err);
            log.warn(err);
            originalOperation();
          }
        });
      } else {
        log.warn('api wx.requestSubscribeMessage 当前版本不支持');
        originalOperation();
      }
    } else {
      log.info('模板id未获取到');
      originalOperation();
    }
  }
}
function codeTextPartition(val) {
  console.log(val);
  val = val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
  console.log(val);
  return val;
}
function handleRaffleOutcome(e) {
  console.log(e.detail.outcome);
  let raffleId = e.detail.outcome;
  state.raffleId = raffleId;
  const self = this;
  if (e.detail.status) {
    if (e.detail.raffleInfo) {
      state.raffleInfo = e.detail.raffleInfo;
      toggleLuckDrawPopup(true);
      toggleMiddlePopup();
    } else {
      let raffleInfo = null;
      raffleService.getById(raffleId).then(res => {
        if (res && res.records.length > 0) {
          for (let i = 0; i < res.records.length; i++) {
            const element = res.records[i];
            if (element.creatorId == res.creatorId) {
              raffleInfo = element;
              break;
            }
          }
        }
        console.log(raffleInfo);
        state.raffleInfo = raffleInfo;
        toggleLuckDrawPopup(true);
        toggleMiddlePopup();
      }).catch(err => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    }
  } else {
    if (e.detail.error) {
      let err = e.detail.error;
      if (err.code === 41004 || err.code === 41010) {
        state.hasRaffleCoupon = false;
        toggleLuckDrawPopup(true);
        toggleMiddlePopup();
      } else if (err.code === 41007) {
        state.hasRaffleCoupon = false;
        state.activeState = 'end';
        toggleLuckDrawPopup(true);
        toggleMiddlePopup();
      } else {
        toggleLuckDrawPopup(true);
      }
    }
  }
}
function handleRaffleCash() {
  let raffleRecordId = state.raffleInfo.id;
  raffleService.cash(raffleRecordId).then(res => {
    console.log(res);
    toggleMiddlePopup();
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
onLoad(function (options) {
  if (app.globalData.userInfo) {
    state.hasUserInfo = true;
  }
  uni.hideShareMenu();
  console.log(options);
  let afterShareToDraw = false;
  if (app.globalData.uiconfig && app.globalData.uiconfig.afterShareToDraw) {
    afterShareToDraw = app.globalData.uiconfig.afterShareToDraw;
  }
  state.afterShareToDraw = afterShareToDraw;
  state.themeColor = app.globalData.uiconfig.themeColor;
  const that = this;
  if (options) {
    state.orderId = options.orderId;
    state.orderType = options.orderType;
    state.codeText = options.orderId;
    let orderId = options.orderId;
    orderService.getOrderStatusById(options.orderId, true).then(res => {
      if (res && res.promotions && res.promotions.couponPromotions) {
        console.log('下单送券');
        console.log(res.promotions);
        if (res.promotions.couponPromotions.length != 0 && res.promotion.couponPromotions[0].sendStatus == true) {
          let couponPromotions = [];
          res.promotions.couponPromotions.forEach(el => {
            couponPromotions.push(el.coupon.name);
          });
          state.couponPromotions = couponPromotions;
          console.log(state.couponPromotions);
          toggle('promotion');
        }
      }
    }).catch(err => {});
    orderService.getDetailsById(options.orderId).then(res => {
      if (!res) {
        return;
      }
      _data.business = res.business;
      let productIds = [];
      res.products.forEach(item => {
        productIds.push({
          productId: item.productId,
          buyAmount: item.productNum
        });
      });
      state.productIds = productIds;
      if (res.business == 'ADVANCE_SELL') {
        state.orderType = 'advanceSell';
        if ((res.balanceTotal || res.balanceTotal === 0) && res.balanceTotal != null) {
          state.payType = 'PARTIAL';
        } else {
          state.payType = 'FULL';
        }
      }
      if (res.shipmentType === "SELF" && res.status === 'PAID' || res.shipmentType === "SELF" && res.status === 'PENDING') {
        // 待自提订单和已付款订单
        if (res.type == 'NEXT_DAY') {
          // 排除次日达订单
          state.showCode = false;
          state.orderStatus = res.status;
        } else if (res.teamId != null && res.teamLeaderRecordId != null || res.type == 'SERVICE') {
          // 排除所有拼团订单
          state.showCode = false;
          state.orderStatus = res.status;
        } else {
          // 除拼团订单外根据自提时间显示
          const orderHiddenLadingCode = app.globalData.systemConfigure.orderHiddenLadingCode;
          if (orderHiddenLadingCode) {
            const now = new util.ResponseDate().getTime();
            // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
            let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
            if (reg1.test(res.selfTimeScope)) {
              let timeScope = res.selfTimeScope;
              let timeArr = timeScope.split("~");
              let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
              if (now >= selfStartTime) {
                state.showCode = true;
                state.successIconTop = '75rpx';
                state.orderStatus = res.status;
                getBarcodeCode(state.prefix + res.ladingCode);
              } else {
                // 处理不显示自提码时提示
                state.showBarcode = false;
              }
            } else {
              state.showCode = true;
              state.successIconTop = '75rpx';
              state.orderStatus = res.status;
              getBarcodeCode(state.prefix + res.ladingCode);
            }
          } else {
            state.showCode = true;
            state.successIconTop = '75rpx';
            state.orderStatus = res.status;
            getBarcodeCode(state.prefix + res.ladingCode);
          }
          if (state.recommendingNum == 0) {
            state.marginTop = state.showCode ? '160rpx' : '420rpx';
          }
        }
      } else if (res.shipmentType === "SELF" && res.status === 'WAITPAYBALANCE') {
        // 待付尾款订单 自提
        state.type = 'SELF';
        state.orderStatus = res.status;
        if (state.recommendingNum == 0) {
          state.marginTop = '160rpx';
        }
        getAdvanceSellDetails(res);
      } else if (res.shipmentType === "EXPRESS" && res.status === 'WAITPAYBALANCE') {
        // 待付尾款订单 配送
        state.type = 'EXPRESS';
        state.orderStatus = res.status;
        if (state.recommendingNum == 0) {
          state.marginTop = '160rpx';
        }
        getAdvanceSellDetails(res);
      } else if (res.shipmentType === "EXPRESS" && res.business === 'ADVANCE_SELL' && res.status === 'PAID') {
        // 待付尾款订单 配送
        state.type = 'EXPRESS';
        state.orderStatus = res.status;
        if (state.recommendingNum == 0) {
          state.marginTop = '160rpx';
        }
        getAdvanceSellDetails(res);
      } else {
        state.orderStatus = res.status;
      }
      return raffleService.getByType('ORDER_RAFFLE');
    }).then(res => {
      if (state.orderStatus !== 'WAITPAYBALANCE' && _data.business !== 'SCORE') {
        if (res) {
          state.raffleActivityId = res.id;
          state.raffleType = res.raffleType;
          const data = res;
          if (app.globalData.userInfo && app.globalData.userInfo.member) {
            let postData = {
              orderId: state.orderId,
              activityId: res.id,
              wxaOpenid: app.globalData.userInfo.wxaUser.openId
            };
            raffleService.create(postData).then(res => {
              state.raffleId = res;
              if (data.raffleType === 'LHJ') {
                toggleLuckDrawPopup(true);
              } else if (data.raffleType === 'POPUP_WINDOWS') {
                // 弹窗抽奖
                state.popupWindowImage = data.popupWindowImage;
                togglePopupLuckDraw();
              }
            }).catch(err => {
              console.log("创建分享抽奖id报错：", err.message);
            });
          }
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
  if (app.globalData.storeInfo) {
    let storeId = app.globalData.storeInfo.id;
    state.storeId = storeId;
  } else {
    ADDRESS.getLocation().then(res => {
      state.storeId = res.id;
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }

  // 获取当前页面分享图
  getSharePictures();
  // 获取前缀
  app.globalData.configureInfo.forEach(item => {
    if (item.key === 'selfTakeCode') {
      state.prefix = item.value ? item.value : '';
    }
  });
});
function getBarcodeCode(ladingCode) {
  const self = this;
  const page = util.utilGetCurrentPage();
  if (page && page.route != null && page.route !== "" && page.route !== "pages/mallModule/pay/payment/payment") {
    return;
  }
  wxbarcode.barcode('paybarcode', ladingCode, 710, 200);
  console.log("pixelRatio:", app.globalData.systemInfo.pixelRatio);
  const pixelRatio = app.globalData.systemInfo ? app.globalData.systemInfo.pixelRatio : 2;
  setTimeout(() => {
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 710,
      height: 200,
      destWidth: 710 * pixelRatio,
      destHeight: 200 * pixelRatio,
      canvasId: 'paybarcode',
      success(res) {
        state.barcodeImageUrl = res.tempFilePath;
      },
      fail(err) {
        // canvasToTempFilePath fail
        const page = util.utilGetCurrentPage();
        if (page && page.route != null && page.route !== "" && page.route === "pages/mallModule/pay/payment/payment") {
          state.barcodeImageUrl = "";
          getBarcodeCode(ladingCode);
        } else {
          console.log("不是支付完成页面");
        }
      }
    }, self);
  }, 500);
  state.codeText = codeTextPartition(ladingCode);
}
function getAdvanceSellDetails(order) {
  const that = this;
  const advanceId = order.advanceId;
  const goodsList = order.products;
  let productId = null;
  if (goodsList.length > 0) {
    productId = goodsList[0].productId;
  }
  advanceSellService.getByIds(advanceId, productId).then(res => {
    console.log(res);
    state.deliveryTime = res.deliveryTime;
  });
}
function toGoodsDetail(val) {
  state.onUnload = false;
  let productId = val.currentTarget.dataset.productid;
  let type = val.currentTarget.dataset.type;
  let easyScene = "none";
  if (val.currentTarget.dataset.easyscene != null) {
    easyScene = val.currentTarget.dataset.easyscene;
  }
  uni.redirectTo({
    url: '../../goods/goodsDetail/goodsDetail?productId=' + productId + '&type=' + type + "&easyScene=" + easyScene
  });
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function (res) {
  const that = this;
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let sharePictures = state.sharePictures;
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res);
    // 未开启分享后抽奖进行兑奖操作
    if (!(state.afterShareToDraw && res.target.dataset.type && res.target.dataset.type === "luckDraw")) {
      handleRaffleCash();
    } else {
      // 关闭弹窗
      state.show.luckDraw = false;
      state.show.luckDrawPopup = false;
    }
    state.onUnload = false;
    let path = '/pages-sub/newretail/pages/mallModule/activity/luckDraw/luckDraw?raffleId=' + state.raffleId + '&activityId=' + state.raffleActivityId + '&type=order&raffleType=' + state.raffleType;
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      let memberId = app.globalData.userInfo.member.id;
      path = path + "&shareId=" + memberId;
    }
    console.log(path);
    return {
      title: '优惠券大抽奖',
      path: path,
      imageUrl: sharePictures,
      success(e) {}
    };
  }
});
function toggleLuckDrawPopup(val) {
  const that = this;
  let raffleInfo = state.raffleInfo;
  let raffleInfoArr = raffleInfo ? Object.keys(raffleInfo) : 0;
  if (val != null) {
    toggle('luckDraw');
  } else {
    if (raffleInfoArr.length == 0 && state.show.luckDraw && _data.hasUserDraw) {
      uni.showModal({
        title: '温馨提示',
        content: '系统正在处理您的抽奖结果，如果中奖，奖品稍后将发放到您的账户，您可以在（我的->我的优惠券）中查看。',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            toggle('luckDraw');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
      // 标记用户手动关闭了弹窗
      userCloseRaffle = true;
    }
  }
}
function togglePopupLuckDraw(val) {
  toggle('luckDrawPopup');
}
function toggleMiddlePopup() {
  if (userCloseRaffle != null && userCloseRaffle === true) {} else {
    toggle('middle');
  }
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function togglePromotionPopup() {
  toggle('promotion');
}
function foundPromotion() {
  NAVPAGE.toMyCoupon();
}
function getUserClickDraw(e) {
  const self = this;
  if (e.detail.userDraw) {
    _data.hasUserDraw = true;
    // 用户已经点击抽奖
    util.setHideLoading(true);
    if (!state.isActive) {
      // 新抽奖规则直接抽奖，调用抽奖接口后创建抽奖活动获得抽奖id用于分享
      state.isActive = true;
      handleDraw(state.raffleActivityId);
      // 调用接口创建抽奖获取抽奖id
      let postData = {
        orderId: state.orderId,
        activityId: state.raffleActivityId,
        wxaOpenid: app.globalData.userInfo.wxaUser.openId
      };
      if (app.globalData.userInfo) {
        createRaffle(postData);
      } else {
        // 授权操作在抽奖组件中完成
      }
      function createRaffle(postData) {
        raffleService.create(postData).then(res => {
          state.raffleId = res;
        }).catch(err => {
          util.setHideLoading(false);
          state.hasRaffleCoupon = false;
          state.raffleResult = 'FALSE';
          state.isActive = false;
          setTimeout(() => {
            toggleLuckDrawPopup(true);
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000
            });
            state.raffleResult = 'UNSTART';
          }, 2400);
        });
      }
    } else {
      uni.showToast({
        title: '您已经在抽奖了~',
        icon: 'none'
      });
    }
  }
}
function handleDraw(raffleActivityId) {
  const self = this;
  let postData = {
    orderId: options.orderId,
    raffleActivityId: raffleActivityId,
    wxaOpenid: app.globalData.userInfo.wxaUser.openId
  };
  state.raffleActivityId = raffleActivityId;
  raffleService.draw(postData).then(res => {
    util.setHideLoading(false);
    let raffleInfo = null;
    let hasCoupon = true;
    if (res.rafflePrizeName == '未中奖') {
      hasCoupon = false;
    } else {
      raffleInfo = res;
      hasCoupon = true;
    }
    setTimeout(() => {
      state.raffleInfo = raffleInfo;
      state.hasRaffleCoupon = hasCoupon;
      state.raffleResult = 'TRUE';
      state.isActive = false;
      toggleLuckDrawPopup(true);
      toggleMiddlePopup();
    }, 2400);
  }).catch(err => {
    util.setHideLoading(false);
    state.hasRaffleCoupon = false;
    state.raffleResult = 'FALSE';
    state.isActive = false;
    if (err.code === 41011) {
      toggleLuckDrawPopup(true);
      setTimeout(() => {
        uni.showToast({
          title: '您今天的抽奖次数已超过上限，明天再来吧~',
          icon: 'none',
          duration: 2000
        });
      }, 500);
    } else if (err.code === 41005 || err.code === 41007 || err.code === 41003) {
      // 活动过期
      state.activeState = 'end';
      setTimeout(() => {
        toggleLuckDrawPopup(true);
        toggleMiddlePopup();
      }, 2400);
    } else if (err.code === 41004 || err.code === 41010) {
      /**
       * 报错原因是券数量不足
       * 弹窗应该是您来晚了奖品已被抽光了！
       */
      setTimeout(() => {
        toggleLuckDrawPopup(true);
        toggleMiddlePopup();
      }, 2400);
    } else if (err.code === 41014) {
      setTimeout(() => {
        uni.showToast({
          title: '您今天已经抽过了，不要贪心哦~',
          icon: 'none',
          duration: 2000
        });
        toggleLuckDrawPopup(true);
      }, 2400);
    } else {
      // 其他报错需要查询具体原因
      setTimeout(() => {
        uni.showToast({
          title: '抽奖人数过多，请稍后再试哦~',
          icon: 'none',
          duration: 2000
        });
        toggleLuckDrawPopup(true);
      }, 2400);
    }
    setTimeout(() => {
      state.raffleResult = 'UNSTART';
    }, 2400);
  });
}
function handlePopupDraw(type) {
  const self = this;
  // 用户已经点击抽奖
  util.setHideLoading(true);
  let isDraw = false;
  let postData = {
    orderId: state.orderId,
    activityId: state.raffleActivityId,
    wxaOpenid: app.globalData.userInfo.wxaUser.openId
  };
  if (app.globalData.userInfo) {
    createRaffle(postData);
  } else {
    NAVPAGE.toAuthorize();
  }
  function createRaffle(postData) {
    raffleService.create(postData).then(res => {
      state.raffleId = res;
      if (!state.afterShareToDraw) {
        // 如果分享后抽奖为false,直接抽奖抽奖
        isDraw = true;
        let postData = {
          orderId: options.orderId,
          raffleActivityId: state.raffleActivityId,
          wxaOpenid: app.globalData.userInfo.wxaUser.openId
        };
        return raffleService.draw(postData);
      }
    }).then(res => {
      if (!state.afterShareToDraw) {
        // 处理抽奖逻辑
        util.setHideLoading(false);
        let raffleInfo = null;
        let hasCoupon = true;
        if (res.rafflePrizeName == '未中奖') {
          hasCoupon = false;
        } else {
          raffleInfo = res;
          hasCoupon = true;
        }
        state.raffleInfo = raffleInfo;
        state.hasRaffleCoupon = hasCoupon;
        state.isActive = false;
        togglePopupLuckDraw();
        toggleMiddlePopup();
      }
    }).catch(err => {
      util.setHideLoading(false);
      if (isDraw) {
        // 处理抽奖的报错
        state.hasRaffleCoupon = false;
        state.isActive = false;
        if (err.code === 41011) {
          togglePopupLuckDraw();
          setTimeout(() => {
            uni.showToast({
              title: '您今天的抽奖次数已超过上限，明天再来吧~',
              icon: 'none',
              duration: 2000
            });
          }, 500);
        } else if (err.code === 41005 || err.code === 41007 || err.code === 41003) {
          // 活动过期
          state.activeState = 'end';
          togglePopupLuckDraw();
          toggleMiddlePopup();
        } else if (err.code === 41004 || err.code === 41010) {
          /**
           * 报错原因是券数量不足
           * 弹窗应该是您来晚了奖品已被抽光了！
           */
          togglePopupLuckDraw();
          toggleMiddlePopup();
        } else if (err.code === 41014) {
          uni.showToast({
            title: '您今天已经抽过了，不要贪心哦~',
            icon: 'none',
            duration: 2000
          });
          togglePopupLuckDraw();
        } else {
          // 其他报错需要查询具体原因
          uni.showToast({
            title: '抽奖人数过多，请稍后再试哦~',
            icon: 'none',
            duration: 2000
          });
          togglePopupLuckDraw();
        }
      } else {
        // 处理创建分享抽奖的报错
        togglePopupLuckDraw();
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
}
function getSharePictures() {
  util.getSharePictures('RAFFLE_ACTIVITY').then(res => {
    state.sharePictures = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function handleRecommendGoodsNum(e) {
  if (e.detail.num > 0) {
    state.marginTop = "66rpx";
    state.recommendingNum = e.detail.num;
  }
}
</script>
<style scoped>
/* pages/payment/payment.wxss */

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
}

.prompt-box {
  display: flex;
  flex-direction: column;
  align-items: center
}

.success-icon {
  width: 109rpx;
  height: 109rpx;
}

.success-text {
  font-size: 38rpx;
  line-height: 38rpx;
  color: #313131;
  margin-top: 28rpx;
}

.btn-box {
  display: flex;
  flex-direction: row;
  padding-bottom: 24rpx;
}

.btn-box .btn {
  margin: 0 21rpx;
  width: 250rpx;
  height: 84rpx;
  background: #ffffff;
  border: 1px solid #a2a2a2;
  border-radius: 8rpx;
  font-size: 32rpx;
  line-height: 84rpx;
  text-align: center;
  color: #292929;
  box-sizing: border-box;
}

button::after {
  border: none;
}

.delivery-box {
  background: #ffffff;
  margin-bottom: 20rpx;
  padding: 14rpx 0 10rpx 0;
  text-align: center;
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.delivery-box .title {
  color: #646464;
  font-size: 32rpx;
  line-height: 56rpx;
  margin-bottom: 20rpx;
}

.code-box {
  width: 100%;
}

.code-box .goods-code {
  width: 710rpx;
  height: 210rpx;
}

.barcode-box {
  width: 710rpx;
  height: 210rpx;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.barcode-box image {
  width: 710rpx;
  height: 210rpx;
}

.barcode-box canvas {
  width: 710rpx;
  height: 210rpx;
  margin: 0 auto;
  position: absolute;
  top: 0
}

.code-box text {
  width: 100%;
  display: block;
  font-size: 48rpx;
  line-height: 68rpx;
  margin-bottom: 2rpx;
}

.tips {
  width: 600rpx;
  font-size: 32rpx;
  color: #606060;
  line-height: 56rpx;
  display: block;
}

.recommending-box {
  width: 100%;
  margin-top: 50rpx;
  background: #F4F5F9;
  padding-top: 36rpx;
}

.recommending-title {
  font-size: 34rpx;
  line-height: 64rpx;
  position: relative;
  text-align: center;
}

.recommending-title::before,
.recommending-title::after {
  content: '';
  position: absolute;
  width: 193rpx;
  height: 1px;
  background: #CCCCCC;
}


.recommending-title::before {
  left: 89rpx;
  top: 37rpx;
}

.recommending-title::after {
  right: 89rpx;
  top: 37rpx;
}

.goods-list {
  padding: 0 25rpx;
  margin-top: 21rpx;
  /* display: flex;
  flex-wrap: wrap;
  justify-content: space-between */
  overflow: hidden;
}

.goods-item {
  width: 340rpx;
  height: 400rpx;
  border: 1rpx solid #E6E6E6;
  border-radius: 10rpx;
  position: relative;
  flex: 0;
  margin-bottom: 24rpx;
  background: #ffffff;
  float: left;
  margin-right: 14rpx;
}

.goods-item:nth-of-type(2n) {
  margin-right: 0;
}

.goods-item .img-box {
  width: 340rpx;
  height: 280rpx;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.goods-item .img-box image {
  width: 340rpx;
  height: 280rpx;
}

.goods-item .img-box .group-icon {
  background: #009F55;
  font-size: 26rpx;
  color: #ffffff;
  height: 40rpx;
  border-top-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  padding: 0 12rpx 0 14rpx;
  position: absolute;
  left: 0;
  top: 0
}

.goods-info {
  width: 100%;
}

.goods-name {
  font-size: 30rpx;
  line-height: 48rpx;
  color: #333333;
  padding: 0 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.goods-price {
  font-size: 20rpx;
  color: #494949;
  line-height: 44rpx;
  margin-left: 16rpx;
  margin-top: 11rpx;
}

.sell-price {
  font-size: 27rpx;
  color: #F98F68;
  margin-right: 7rpx;
}

.old-price {
  font-size: 20rpx;
  text-decoration: line-through;
}

.button-box {
  width: 120rpx;
  height: 44rpx;
  background: #009F55;
  box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 159, 85, 0.2);
  border-radius: 4rpx;
  font-size: 24rpx;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  line-height: 44rpx;
  position: absolute;
  bottom: 12rpx;
  right: 21rpx;
}

/* 抽奖弹窗 */
.popup-box {
  width: 562rpx;
  min-height: 504rpx;
  background: #ffffff;
  border-radius: 10rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.popup-close {
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  right: 19rpx;
  top: 19rpx;
}

.popup-close image {
  width: 22rpx;
  height: 22rpx;
}

.popup-title {
  color: #1C1C1C;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 60rpx;
  margin-top: 44rpx;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 59rpx 0;
}

.popup-content text {
  display: block;
}

.popup-text {
  color: #019F55;
  font-size: 44rpx;
  line-height: 68rpx;
  font-weight: 500;
  text-align: center;
  width: 374rpx;
}

.popup-text-end {
  color: #019F55;
  font-size: 44rpx;
  line-height: 56rpx;
  font-weight: bold;
  text-align: center;
  width: 374rpx;
}

.popup-tips {
  color: #1C1C1C;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 54rpx;
}

.popup-button {
  padding-bottom: 52rpx;
  text-align: center;
}

.popup-button text {
  font-size: 30rpx;
  line-height: 50rpx;
  color: #999999;
  margin-bottom: 10rpx;
  display: block;
}

.share-btn {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 400;
  text-align: center;
  width: 369rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: #019F55;
  border-radius: 10rpx;
  padding: 0;
}

.popup-luckdraw-box {
  padding-bottom: 20rpx;
  position: relative;
}

.popup-luckdraw-close {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  right: 66rpx;
  top: 80rpx;
}

.popup-luckdraw-close image {
  width: 40rpx;
  height: 40rpx;
}

.popup-luckdraw-window-box {
  padding-bottom: 20rpx;
  position: relative;
}

.popup-luckdraw-window-close {
  margin-top: 65rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-luckdraw-window-close image {
  width: 56rpx;
  height: 56rpx;
}

.popup-window-image {
  width: 570rpx;
  max-height: 700rpx;
}

.popup-window-image button {
  background: transparent;
  border: 0;
}

.popup-window-image button::after {
  border: 0;
}

.popup-window-image image {
  width: 100%;
  height: 100%;
}
</style>