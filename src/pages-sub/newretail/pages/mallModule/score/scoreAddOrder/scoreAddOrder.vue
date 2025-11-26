<template>
<!-- pages/mallModule/score/scoreAddOrder/scoreAddOrder.wxml -->
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="page">
  <view class="top-info">
    <view class="type-check-box">
      <view v-for="(item , idx) in state.shipmentSortList" :key="item">
        <view :class="'self-take ' + (state.type == 'selftake' ? 'active' : '')" :style="state.type == 'selftake' ? state.theme.mainColor + state.theme.borderColor : state.theme.borderColorRgb + state.theme.mainColorRgb" data-type="selftake" @click="handleClick" v-if="state.canSelfmention && item == 'SELF'">
          <image v-if="state.type != 'selftake'" :src="state.imagesPath.iconOrderSelfTake"></image>
          <image v-if="state.type == 'selftake'" :src="state.imagesPath.iconOrderSelfTakeActive"></image>
          <text>到店自提</text>
        </view>
        <view :class="'dispatch ' + (state.type == 'dispatch' ? 'active' : '')" :style="state.type == 'dispatch' ? state.theme.mainColor + state.theme.borderColor : state.theme.borderColorRgb + state.theme.mainColorRgb" data-type="dispatch" @click="handleClick" v-if="!state.isDistributionOrder && state.canDelivery && item == 'EXPRESS'">
          <image v-if="state.type != 'dispatch'" :src="state.imagesPath.iconOrderTakeout"></image>
          <image v-if="state.type == 'dispatch'" :src="state.imagesPath.iconOrderTakeoutActive"></image>
          <text>{{state.isDistributionOrder ? "快递配送" : "外卖配送"}}</text>
        </view>
        <view :class="'dispatch ' + (state.type === 'logistical' ? 'active' : '')" :style="state.type === 'logistical' ? state.theme.mainColor + state.theme.borderColor : state.theme.borderColorRgb + state.theme.mainColorRgb" data-type="logistical" @click="handleClick" v-if="state.canDelivery && item == 'LOGISTICAL'">
          <image v-if="state.type != 'logistical'" :src="state.imagesPath.iconOrderDistribution"></image>
          <image v-if="state.type == 'logistical'" :src="state.imagesPath.iconOrderDistributionActive"></image>
          <text>快递配送</text>
        </view>
      </view>
    </view>
     <!-- 老版自提时间 -->
    <!-- <picker mode="multiSelector" bindchange="bindMultiPickerChange" bindcolumnchange="bindMultiPickerColumnChange" value="{{state.multiIndex}}" range="{{multiArray}}" disabled="{{state.orderType === 'advanceSell' ? true : false}}">
      <view class="picker time-picker" hidden="{{state.type == 'selftake' ? false : true}}">
        <view>
          <view>
            <image class='left-icon' src='{{state.imagesPath.iconSelfTake}}'></image>
            <text class="color-454545">自提时间</text>
          </view>
          <view class="color-009F55">
            {{selfTimeDate}} {{multiArray[1][state.multiIndex[1]]}}
            <image class="right-point" src="{{state.imagesPath.iconOrderRight}}" ></image>
          </view>
        </view>
      </view>
    </picker> -->
    <view class="picker time-picker" :hidden="(state.type == 'selftake' || state.type == 'dispatch') && state.deliveryTimeData && state.deliveryTimeData.length > 0 ? false : true">
        <view @click="chooseTime">
          <view>
            <image class="left-icon" :src="state.imagesPath.iconSelfTake"></image>
            <text class="color-454545" v-if="state.type == 'dispatch'">配送时间</text>
            <text class="color-454545" v-else>自提时间</text>
          </view>
          <view class="color-009F55">
            <text>{{state.storePickupTime}}</text>
            <image class="right-point" :src="state.imagesPath.iconOrderRight"></image>
          </view>
        </view>
        <popup :show="state.showTime" @onClose="onClose" position="bottom">
            <time-picker @onClose="onClose" :deliveryTimeData="state.deliveryTimeData" :deliveryTime="state.deliveryTime" @selectTime="selectTime"></time-picker>
        </popup>
    </view>
    <view class="receive-box" :hidden="state.type == 'dispatch' || state.type == 'logistical' ? false : true" @click="toChooseAddress">
      <view class="icon-box">
        <image :src="state.imagesPath.iconOrderPosition"></image>
      </view>
      <view class="receive-info">
        <view class="name-mobile" :hidden="state.addressInfo ? true : false">
          <text>{{state.addressInfo.contacts}}</text>
          <text>{{state.addressInfo.contactsMobile}}</text>
        </view>
        <view class="receive-address" :hidden="state.addressInfo ? true : false">{{state.addressInfo.province + state.addressInfo.city + state.addressInfo.county + state.addressInfo.detailedAddress + state.addressInfo.houseNum}}</view>
        <view :hidden="state.addressInfo ? false : true">请选择收货地址</view>
      </view>
      <view class="iconright-box">
        <image :src="state.imagesPath.iconRight2"></image>
      </view>
    </view>
  </view>
</view>
<view style="height:10rpx; background-color: #f0f0f0;"></view>
<view class="goods-box">
  <view class="store-info" v-if="!state.isDistributionOrder">
    <view class="store-details">
      <text>{{storeInfo.name}}</text>
      <text>{{storeInfo.address}}</text>
    </view>
    <!-- <view class="icon-right-box" bindtap="changeStore" wx:if="{{!state.isDistributionOrder}}">
      修改门店
      <image src="{{state.imagesPath.iconPointRight}}" ></image>
    </view> -->
    <!-- <view class="color-009F55" style="{{theme.mainColor}}" bindtap="viewStoreLocation">查看地图</view> -->
  </view>
  <view class="goods-item-box" v-for="(item , index) in goodsList" :key="index">
    <view class="goods-item">
      <view class="goods-img">
        <image :src="item.product.imageUrl" mode="aspectFit"></image>
        <image class="seckill-icon" mode="widthFix" v-if="item.product.grabActivityId" :src="state.imagesPath.iconSeckillSeat"></image>
        <view class="stop-sell" :hidden="item.product.businessStatus || item.product.businessStatus == null">
          暂停售卖
        </view>
      </view>
      <view class="goods-info">
        <view class="goods-left">
          <text class="goods-name">{{item.product.name}}</text>
          <text class="goods-desc">{{item.product.description ? item.product.description : ''}}</text>
          <view class="goods-price">
            <text class="nowPrice">{{item.amount ? item.score + '积分+￥' + item.amount + '元' : item.score + '积分'}}</text>
            <!-- <text class="nowPrice">￥{{item.amount ? (item.score )+'积分+'+(item.amount)+'元' : (item.score)+'积分'}}</text> -->
          </view>
        </view>
        <view class="goods-right">
          <view class="goods-count">x{{state.quantity}}</view>
          <!-- <view class='goods-price'>
            <text class="nowPrice">￥{{item.amount ? item.score * state.quantity + '积分+' + item.amount * state.quantity + '元' : item.score * state.quantity + '积分'}}</text>
          </view> -->
        </view>
      </view>
    </view>
    <view class="gift-box" v-if="item.goodsPromotions && item.goodsPromotions.length > 0">
      <view class="gift-title">赠品:</view>
      <view class="gift-item-box">
        <view class="gift-item" v-for="(item , index) in item.goodsPromotions" :key="i">
          <view>
            <view class="gift-img-box">
              <image :src="item.goods.image"></image>
            </view>
            <text>{{item.goods.name}}</text>
          </view>
          <view class="gift-num">x{{item.count}}</view>
        </view>
      </view>
    </view>
  </view>
  <view class="gift-bottom-box" v-if="giftGoodsList.length > 0">
    <view class="gift-box">
      <view class="gift-title">赠品:</view>
      <view class="gift-item-box">
        <view class="gift-item" v-for="(item , index) in giftGoodsList" :key="i">
          <view class="gift-img-box">
            <image :src="item.image"></image>
          </view>
          <view class="gift-num">x{{item.productNum}}</view>
        </view>
      </view>
    </view>
  </view>
  <view class="bill-details1">
    <view class="balance-accounts">
        商品小计：
        <text>{{amount ? integral + '积分+￥' + amount + '元' : filters.toFix(integral) + '积分'}}</text>
    </view>
  </view>
  <view class="section-box contact-store" @click="contactStore" v-if="!state.isDistributionOrder">
    <image class="tel" :src="state.imagesPath.iconContactPhone"></image>
    <text class="color-ffbf00">联系{{storeInfo.name}}</text>
  </view>
  <view class="section-box dispatching-fee" v-if="(state.type === 'dispatch' || state.type === 'logistical') && state.addressInfo && state.shipmentAmount">
    <view class="left-icon">派送费</view>
    <view v-if="state.shipmentAmount != 0">{{state.shipmentAmount > 0 ? '￥' + state.shipmentAmount : '包邮'}}</view>
    <view v-else>{{state.shipmentAmount == 0 ? '包邮' : ''}}</view>
  </view>
</view>
<view class="score-coupon" v-if="goodsList[0].amount || state.shipmentAmount > 0">
  <view class="score-box" @click="handleSelectStoredValueCard" v-if="state.isStoredPayment">
    <view class="left">储值支付
      <text>(余额：{{state.storedValueCard.balance}})</text>
    </view>
    <view class="right">
      <view class="score-amount">-￥{{filters.toFix(state.storedValueCard.useAmount)}}</view>
      <!-- <view class="checkbox-icon {{useStoredValueCard ? 'active' : ''}}"></view> -->
      <view class="checkbox-icon" :style="'background-image: url(' + state.imagesPath.iconUnchecked + ')'">
        <view class="active" :style="'background-image: url(' + state.imagesPath.iconChecked1 + ')'" v-if="state.useStoredValueCard"></view>
      </view>
    </view>
  </view>
  <view class="coupon-box" :hidden="state.type === 'selftake' || !state.isFreightVoucher">
  <text class="color-666666">运费券</text>
  <view class="right-info" @click="toChoiceCoupon" data-type="freeship">
    <view v-if="state.hasAvailableCoupon">
      <text class="coupon-text" :hidden="state.shipmentCouponDiscount === 0 ? false : true">{{state.freeshipNum > 0 ? state.freeshipNum + '张可用运费券' : '暂无可用运费券'}}</text>
    </view>
    <text class="coupon-amount" :hidden="state.shipmentCouponDiscount !== 0 && state.couponInfo.data.freeship.length > 0 ? false : true">-￥{{state.shipmentCouponDiscount}}</text>
    <image class="right-point" :src="state.imagesPath.iconRight2"></image>
  </view>
</view>
</view>
<view class="bottom-box">
  <view class="order-price">
    <text v-if="!goodsList[0].amount"> ￥{{filters.toFix(allPrice - state.totalDiscount + state.shipmentAmount - state.shipmentCouponDiscount - state.scoreDiscount - state.cardDeductTotal)}}</text>
    <text v-else> ￥{{filters.toFix(goodsList[0].amount * state.quantity + state.shipmentAmount - state.shipmentCouponDiscount - state.cardDeductTotal)}}</text>
    <text v-if="goodsList[0].product && goodsList[0].product.originalPrice && filters.toFix(goodsList[0].product.originalPrice * state.quantity - amount) > 0">优惠：{{filters.toFix(goodsList[0].product.originalPrice * state.quantity - amount)}}</text>
  </view>
  <form @submit="createOrder">
    <button class="btn usable" form-type="submit" :style="state.theme.mainBgColor" :hidden="state.canBuy ? false : true" :disabled="state.isPrizing">提交订单</button>
  </form>
  <view class="btn unavailable" :hidden="!state.canBuy ? false : true">提交订单</view>
</view>
<pay :order-data="state.order" :pay-method="state.payMethod" :storedValueCard="state.storedValueCard" @continuePay="handleContinuePay" @orderCancel="handleOrderCancel" @orderPay="handleOrderPay"></pay>
<!-- 付款超时弹窗 -->
<popup :show="state.show.timeOut" position="middle" custom-class="middle" @close="toggleTimeOutPopup">
  <view class="popup-content">
    <view class="popup-content-box">
      <image :src="state.imagesPath.iconNetworkTimeout" mode="widthFix"></image>
    </view>
    <view class="button" :style="state.theme.mainBgColor" @click="toggleTimeOutPopup">我知道了</view>
  </view>
</popup>
<popup :show="state.show.middle" position="middle" custom-class="middle">
  <view class="popup-box">
    <view class="popup-title">
      <text>自提信息确认</text>
    </view>
    <view class="receive-message" v-if="state.deliveryTimeData && state.deliveryTimeData.length > 0">
      <text>自提时间：</text><text style="color:#333;font-weight:bold;">{{state.storePickupTime}}</text>
    </view>
    <view class="receive-message">
      <text>自提门店：</text><text style="color:#333;font-weight:bold;">{{storeInfo.name}}</text>
    </view>
    <view class="popup-button">
      <view style="color:#8b8b8c" class="left-button" @click="handleGoOn">切换门店</view>
      <view :style="'color: ' + state.theme.color" class="right-button" @click="handleConvert">确认</view>
    </view>
  </view>
</popup>
<!-- 提示没货弹窗 -->
<popup :show="state.show.sellout" position="middle" custom-class="middle" @close="toggleSelloutPopup">
  <view class="popup-sellout-box">
    <view class="popup-sellout-title">
      <text>温馨提示</text>
    </view>
    <view class="popup-sellout-content">您手慢了，宝贝已经被其他人抢走了，您可以选择其他门店</view>
    <view class="popup-sellout-button">
      <view :style="'background-color: ' + state.theme.color" @click="handleSellout">换个门店看看</view>
    </view>
  </view>
</popup></view>
</template>
<script setup>
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiDistributionServiceJs from "@/service/api/newretail/distributionService";
import _apiAddressServiceJs from "@/service/api/newretail/addressService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _apiPromotionService from "@/service/api/newretail/promotionService";
import _apiScoreProductService from "@/service/api/newretail/scoreProductService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _utilsImagesPath from "@/utils/newretail/imagesPath";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
import pay from '@/pages-sub/newretail/components/pay/pay.vue';
const app = getApp();

// pages/mallModule/score/scoreAddOrder/scoreAddOrder.js
const IMGAGESPATH = _utilsImagesPath;
const memberService = _apiMemberServiceJs;
const scoreProductService = _apiScoreProductService;
const promotionService = _apiPromotionService;
const couponService = _apiCouponServiceJs;
const storeService = _apiStoreServiceJs;
const addressService = _apiAddressServiceJs;
const distributionService = _apiDistributionServiceJs;
const NAVPAGE = _utilsNavPageJs;
const orderService = _apiOrderServiceJs;
const utils = _utilsUtilsJs;
let qqmapsdk;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const ADDRESS = _utilsAddressJs;
const sysService = _apiSystemServiceJs;
let canGetAvailableCouponNum = true;
let canCalcPromotions = true;
let isInPrizing = false;
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //  处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')';
  } else {
    return sColor;
  }
};
const state = reactive({
  isFreightVoucher: false,
  isStoredPayment: true,
  quantity: 1,
  // 购买数量
  // 展示自提时间弹窗
  showTime: false,
  // 自提时间
  storePickupTime: '',
  // 选择的时间数据
  deliveryTimeData: [],
  // 后端提供的时间数据
  deliveryTime: '',
  // 组件选择的时间数据
  calculateData: {},
  // 获取订单自提/配送时间 给后端参数
  navigationBarTitle: "",
  imagesPath: IMGAGESPATH,
  type: 'selftake',
  date: '2016-09-01',
  time: '12:01',
  // multiArray: [
  //   ['2018-06-01', '2018-06-02', '2018-06-03'],
  //   ['6:00-9:00', '9:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00']
  // ],
  multiIndex: [0, 0],
  // 用户的积分数量
  userScore: 0,
  canBuy: false,
  theme: themeManager,
  isPrizing: false,
  timer: null,
  memberGrade: '',
  memberShip: [],
  storedValueCard: {
    useAmount: 0.00,
    //本次使用额度
    balance: 0.00,
    //储值卡余额
    password: '' //储值卡密码密码
  },
  payMethod: {
    cardDeductTotal: 0,
    useStoredValueCard: false,
    balance: 0
  },
  useStoredValueCard: false,
  // 是否使用储值卡
  cardDeductTotal: 0,
  // 储值抵扣金额
  order: null,
  orderCancel: false,
  orderPay: false,
  show: {
    timeOut: false,
    middle: false,
    sellout: false
  },
  productId: '',
  unableSafetake: false,
  isDistributionOrder: false,
  //是否是统配订单
  canDelivery: true,
  canSelfmention: true,
  shipmentSortList: [],
  couponInfo: {
    description: '选择优惠券',
    data: {
      freeship: [],
      discount: []
    },
    useCoupon: false
  },
  hasAvailableCoupon: false,
  hasAvailableGiftCard: false,
  discountNum: 0,
  freeshipNum: 0,
  usedCoupons: [],
  scoreDiscount: 0,
  // 积分抵扣
  couponDiscount: 0,
  // 券抵扣
  cashDiscount: 0,
  // 现金抵扣金额
  totalDiscount: 0,
  // 总优惠金额
  giftCardDiscount: 0,
  // 礼品卡优惠金额
  inputAmount: 0,
  // 整单优惠金额
  memberInfo: {},
  addressInfo: '',
  // 收货地址信息
  distributionInfo: {
    distributionFee: 0.00
  },
  // 配送信息
  shipmentAmount: 0.00,
  // 配送费(扣除规则优惠的运费)
  shipmentDiscount: 0,
  // 运费抵扣金额(规则优惠)
  shipmentCouponDiscount: 0,
  // 运费抵扣金额(运费券)
  shipmentRealPay: 0,
  // 实际支付的运费金额（扣除所有优惠的运费）
  scource: 'BUYNOW',
  //来自购物车SHOPPINGCART,立即购买BUYNOW
  orderType: 'scoreMall',
  //orderType(模块类型): secondkill(秒杀)  group(拼团)  normal(普通) distribution(统配) advanceSell(预售) scoreMall(积分商城)
  calculatedDeliveryFee: '',
  userChooseCoupon: true,
  tips: ""
});
async function getPaymentMethod() {
  try {
    let paymentMethodList = ['paymentMethod',
    // 'isFreightVoucher',
    'isStoredPayment'];
    await sysService.query(paymentMethodList.join(',')).then(res => {
      if (res && res.length > 0) {
        res.forEach(item => {
          if (item.key == 'paymentMethod' && item.value) {
            app.globalData.paymentMethod = item.value;
            state.paymentMethod = item.value;
          } else {
            item.key = item.value == 'FALSE' ? false : true;
          }
        });
      }
    }).catch(err => {});
  } catch (e) {}
}
let localData = {
  shipmentTypes: 'EXPRESS'
};
onLoad(async function (options) {
  const self = this;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.memberGrade = app.globalData.userInfo.member.gradeId;
    }
  }
  state.themeColor = app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43';
  state.theme = {
    color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + app.globalData.uiconfig.themeColor + ';' : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color:' + app.globalData.uiconfig.themeColor + ';' : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';' : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background: linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background: linear-gradient(-270deg, #FF9F43, #F13327);",
    mainColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : "border-color:rgba(255,159,67, 0.4);",
    mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
    BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color:rgba(255,159,67, 0.1);"
  };
  uni.hideShareMenu();
  await getPaymentMethod();
  //获取会员等级
  queryMemberShip().then(() => {
    // 获取用户积分数量
    return getMemberScore();
  }).then(() => {
    // 展示商品数据
    showGoods();
  });
  //设置一些默认信息
  defaultData();
  //初始化预约时间
  // this.initializationTime()

  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  // 根据门店支持的配送方式显示自提和配送
  handleDeliveryType();
  uni.removeStorageSync('wj_storePickupTime');
});
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function toggleTimeOutPopup() {
  toggle('timeOut');
}
function handleGetOrderStatusById(orderId, amount, self) {
  uni.showLoading({
    title: '支付中'
  });
  orderService.getOrderStatusById(orderId).then(result => {
    console.log('查询交易结果-------------');
    console.log(result);
    amount++;
    console.log(amount);
    if (amount > 40) {
      utils.setHideLoading(false);
      uni.hideLoading();
      toggle('timeOut');
      return;
    }
    if (result.status === 'PAID' || result.status === 'WAITPAYBALANCE' || result.status === 'PENDING' || result.status === 'WAITSHIPPED' || result.status === 'RECEIVED' || result.status === "SHIPPED") {
      utils.setHideLoading(false);
      uni.hideLoading();
      uni.showToast({
        title: '兑换成功',
        icon: 'none',
        duration: 2000
      });
      // 跳转到成功页面
      toPaymentSuccess(orderId);
    } else if (result.status === "PAYFAILED") {
      utils.setHideLoading(false);
      uni.hideLoading();
      uni.showToast({
        title: '兑换失败',
        icon: 'none',
        duration: 2000
      });
      state.isPrizing = false;
    } else {
      let orderTimeId = setTimeout(() => {
        utils.setHideLoading(true);
        // 如果没有成功，调用函数本身，实现重复查询
        self.handleGetOrderStatusById(orderId, amount, self);
      }, 2000);
      state.orderTimeId = orderTimeId;
    }
  }).catch(err => {
    state.isPrizing = false;
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getOrderStatusById(orderId, self) {
  let amount = 0;
  // self.handleGetOrderStatusById(orderId, amount, self);
  setTimeout(() => {
    self.handleGetOrderStatusById(orderId, amount, self);
  }, 1000);
}
function toPaymentSuccess(orderId) {
  let opts = '?orderId=' + orderId;
  NAVPAGE.toPaymentSuccess(opts);
}
function getOrderDetails(orderId) {
  orderService.getDetailsById(orderId).then(res => {
    console.log(res);
    isInPrizing = false;
    if (res) {
      state.order = res;
    }
  }).catch(err => {
    isInPrizing = false;
  });
}
function httpCreatOrder(lat, lon) {
  const that = this;
  let tempTime = state.multiArray[1][state.multiIndex[1]];
  let tempTimeArr = tempTime.split('-');
  let tempSelfTime = null;
  let shipmentType = 'SELF';
  let shipmentAmount = 0;
  let deliveryStatus = true;
  if (state.type === "dispatch" || state.type == 'logistical') {
    if (state.storeInfo.shipmentTypes.indexOf('EXPRESS') >= 0 && !state.isDistributionOrder) {
      shipmentType = 'EXPRESS';
    } else if (state.storeInfo.shipmentTypes.indexOf('LOGISTICAL') >= 0) {
      shipmentType = 'LOGISTICAL';
    } else {
      shipmentType = 'EXPRESS';
    }
  } else {
    shipmentType = 'SELF';
    tempSelfTime = state.multiArray[0][state.multiIndex[0]] + ' ' + tempTimeArr[0] + ':00' + '~' + state.multiArray[0][state.multiIndex[0]] + ' ' + tempTimeArr[1] + ':00';
  }
  let param = {
    "id": state.goodsList[0].id,
    "lat": lat,
    "lng": lon,
    "storeId": state.storeInfo.id,
    "scoreProductId": state.productId,
    oriStoreId: app.globalData.storeInfo.virtualStoreId || app.globalData.storeInfo.id,
    // 原门店id
    shipmentType: shipmentType,
    shipmentAmount: parseFloat(state.shipmentAmount),
    // 快递费
    quantity: state.quantity
  };
  if (shipmentType === "SELF") {
    param = {
      ...param,
      // "selfTimeScope": tempSelfTime,
      "selfTimeScope": state.storePickupTime
    };
  } else if (shipmentType === 'EXPRESS' || shipmentType === 'LOGISTICAL' || state.selfOrderShowAddress) {
    if (state.addressInfo) {
      param = {
        ...param,
        deliveryAddressId: state.addressInfo.id,
        // 收货地址id
        // distributionDistance: this.data.distance, // 配送距离
        shipmentAmount: parseFloat(state.shipmentRealPay) + parseFloat(state.shipmentDiscount) + parseFloat(state.shipmentCouponDiscount),
        // 快递费
        deductibleShipmentAmonut: parseFloat(state.shipmentCouponDiscount) + parseFloat(state.shipmentDiscount)
      };
    }
  }
  if (param.shipmentType === 'EXPRESS' || param.shipmentType === 'LOGISTICAL') {
    if (!param.deliveryAddressId) {
      deliveryStatus = false;
    } else {
      deliveryStatus = true;
    }
  }
  if (!deliveryStatus) {
    uni.showToast({
      title: '收货地址不能为空~',
      icon: 'none',
      duration: 2000
    });
    isInPrizing = false;
    return;
  }
  let storeIdIn = [state.storeInfo.id];
  if (app.globalData.distributionStore && app.globalData.distributionStore.id !== state.storeInfo.id) {
    storeIdIn.push(app.globalData.distributionStore.id);
  }
  const postData = {
    productIdEquals: state.productId,
    storeIdIn: storeIdIn.join(",")
  };
  scoreProductService.productQuery(postData).then(res => {
    if (res && res.records && res.records.length > 0) {
      const scoreProduct = res.records[0];
      let balance = scoreProduct.total;
      balance = balance > scoreProduct.product.balance ? scoreProduct.product.balance : balance;
      balance = balance > 0 ? balance : 0;
      if (balance > 0) {
        return scoreProductService.creatScoreOrder(param);
      } else {
        handleNoBalance();
      }
    } else {
      handleNoBalance();
    }
    function handleNoBalance() {
      isInPrizing = false;
      state.show.sellout = true;
    }
  }).then(res => {
    if (res) {
      //错误校验
      if (!res.success) {
        uni.showToast({
          title: res.errMessage,
          icon: 'none',
          duration: 2000
        });
        isInPrizing = false;
        return;
      }
      console.log(state.payMethod.useStoredValueCard);
      // 查询订单详情
      getOrderDetails(res.orderId);

      // that.getOrderStatusById(res.orderId, that)
    } else {
      isInPrizing = false;
    }
  }).catch(err => {
    isInPrizing = false;
    state.isPrizing = false;
    if (err.code === 16007) {
      // 没有库存
      state.show.sellout = true;
    } else {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function handleSellout() {
  state.show.sellout = false;
  const opts = "?productId=" + state.goodsList[0].id + "&activityId=" + state.goodsList[0].activityId;
  NAVPAGE.toScoreSelectStore(opts);
}
function handleGoOn() {
  state.show.middle = false;
  uni.removeStorageSync('wj_storePickupTime');
  const opts = "?productId=" + state.goodsList[0].id + "&activityId=" + state.goodsList[0].activityId;
  NAVPAGE.toScoreSelectStore(opts);
}
function handleConvert(e) {
  // 当前时间段不能自提
  // if (this.data.unableSafetake) {
  //   utils.showToast("当前时间不能自提，请选择其他时间~")
  //   isInPrizing = false;
  //   return;
  // }

  const that = this;
  state.show.middle = false;
  uni.showLoading();
  uni.getLocation({
    type: 'gcj02',
    success: function (res) {
      uni.hideLoading();
      let latitude = res.latitude;
      let longitude = res.longitude;
      httpCreatOrder(latitude, longitude);
    },
    fail: function (res) {
      console.log(res);
      this.setData({
        isPrizing: false
      });
      isInPrizing = false;
    }
  });
}
function createOrder(e) {
  const that = this;
  console.log(state.type, 112333);
  if (state.type === "dispatch" || state.type === "logistical") {
    if (isInPrizing) {
      console.log("已经在提交订单，请勿重复提交");
      return;
    }
    isInPrizing = true;
    handleConvert();
  } else {
    // 当前时间段不能自提
    if (!state.storePickupTime && state.deliveryTimeData && state.deliveryTimeData.length > 0) {
      utils.showToast("请选择自提时间~");
      isInPrizing = false;
      return;
    }
    state.show.middle = true;
  }
}
function showGoods() {
  const self = this;

  // 获取购物车数据
  try {
    let value = uni.getStorageSync('wj_shopcart');
    console.log(value);
    let productShipment = '';
    let isDistributionOrder = false;
    if (value) {
      const goodsList = value.goodsList;
      const productId = goodsList[0].productId;
      let isDistributionOrder = false;
      goodsList.forEach(item => {
        if (item.product.business === "DISTRIBUTION") {
          isDistributionOrder = true;
        }
        let enableMemberShip = [];
        let count = 0;
        let isMatching = false;
        if (item.scoreList) {
          item.scoreList.forEach(res => {
            ++count;
            if (res.gradeId === state.memberGrade) {
              isMatching = true;
              item.score = res.score;
              item.amount = res.amount ? res.amount : null;
            } else {
              // 获取低于自己等级的会员
              for (let i = 0; i < state.memberShip.length; i++) {
                if (state.memberShip[i].id === state.memberGrade) {
                  enableMemberShip = state.memberShip.slice(0, i);
                  break;
                }
              }
            }
          });
          if (count === item.scoreList.length && !isMatching) {
            console.log('低于自己会员等级的规则', enableMemberShip);
            enableMemberShip.forEach(el => {
              item.scoreList.forEach(res => {
                if (res.gradeId === el.id) {
                  item.score = res.score;
                  item.amount = res.amount ? res.amount : null;
                }
              });
            });
          }
        }
        const business = item.product.business;
        if (business === 'DISTRIBUTION') {
          isDistributionOrder = true;
        }
        productShipment = item.product ? item.product.shipmentType : '';
      });
      state.isDistributionOrder = isDistributionOrder;
      state.productShipment = productShipment;
      if (isDistributionOrder) {
        ADDRESS.getDistributionStore().then(res => {
          state.storeId = res.id;
          state.storeInfo = res;
          handleDeliveryType();
          // 查询配送费优惠规则
          getDistributionFeeRule(res.id);
        }).catch(err => {
          console.log(err);
        });
      } else {
        // 查询配送费优惠规则
        getDistributionFeeRule(app.globalData.storeInfo.id);
      }
      getMbrBalance();
      if (isDistributionOrder) {
        // 统配积分商品
        ADDRESS.getDistributionStore().then(res => {
          if (res) {
            // self.initializationTime()
            state.storeInfo = res;
          }
        }).catch(err => {
          isDistributionOrder = false;
        });
      } else {
        initializationTime();
      }
      state.goodsList = goodsList;
      state.allPrice = parseFloat(value.score);
      state.productId = productId;
      state.isDistributionOrder = isDistributionOrder;
      state.quantity = value.quantity;
      state.scoreAmount = goodsList[0].amount ? goodsList[0].amount * value.quantity : value.allPrice * value.quantity;
      state.scoreDiscount = goodsList[0].amount ? goodsList[0].amount * value.quantity : value.allPrice * value.quantity;
      state.integral = value.score * value.quantity;
      state.amount = goodsList[0].amount * value.quantity;
      state.scoreUseAmount = value.score * value.quantity;
      if (value.scource) {
        state.scource = value.scource;
      }

      // self.calcPromotions()
      getAvailableCouponNum();
    }
  } catch (e) {
    console.log(e);
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  }
}
function getMbrBalance() {
  const that = this;
  memberService.getMbrBalance().then(res => {
    // 储值卡余额大于0时才会使用
    if (res > 0 && state.isStoredPayment) {
      state.storedValueCard = {
        ...state.storedValueCard,
        balance: res //储值卡余额
      };
      state.payMethod.balance = res;
    } else {
      state.storedValueCard = {
        useAmount: 0,
        //本次使用额度
        balance: 0,
        //储值卡余额
        password: '' //储值卡密码密码
      };
      state.cardDeductTotal = 0;
      state.useStoredValueCard = false;
    }
    handleCardBalance();
  });
}
function handleSelectStoredValueCard() {
  const that = this;
  const useStoredValueCard = !state.useStoredValueCard;
  // 重算积分、优惠券和礼品卡
  state.useStoredValueCard = useStoredValueCard;
  state.cardDeductTotal = useStoredValueCard ? state.storedValueCard.useAmount : 0;
  state.payMethod.useStoredValueCard = useStoredValueCard;
  state.payMethod.cardDeductTotal = useStoredValueCard ? state.storedValueCard.useAmount : 0;
}
function handleCardBalance() {
  const that = this;
  const allPrice = state.goodsList[0].amount ? Number(state.goodsList[0].amount) * state.quantity : 0; // 订单金额

  const canUseAmount = Number(state.storedValueCard.balance); // 可以使用的储值金额
  const totalDiscount = Number(state.totalDiscount); // 现金抵扣金额
  // 运费抵扣
  let shipmentRealPay = parseFloat((Number(state.shipmentAmount) - Number(state.shipmentCouponDiscount)).toFixed(2));
  shipmentRealPay = shipmentRealPay > 0 ? shipmentRealPay : 0;
  let tempPrice = parseFloat((allPrice - totalDiscount + shipmentRealPay).toFixed(2));
  const useStoredValueCard = canUseAmount > 0 ? true : false;
  if (tempPrice > 0 && state.isStoredPayment) {
    if (tempPrice > canUseAmount) {
      state.storedValueCard = {
        ...state.storedValueCard,
        useAmount: canUseAmount //本次使用余额
      };
      state.cardDeductTotal = canUseAmount;
      state.useStoredValueCard = useStoredValueCard;
      state.payMethod.useStoredValueCard = useStoredValueCard;
      state.payMethod.cardDeductTotal = canUseAmount;
    } else {
      state.storedValueCard = {
        ...state.storedValueCard,
        useAmount: tempPrice //本次使用余额
      };
      state.cardDeductTotal = tempPrice;
      state.useStoredValueCard = useStoredValueCard;
      state.payMethod.useStoredValueCard = useStoredValueCard;
      state.payMethod.cardDeductTotal = tempPrice;
    }
  } else {
    state.storedValueCard = {
      ...state.storedValueCard,
      useAmount: 0 //本次使用余额
    };
    state.cardDeductTotal = 0;
    state.useStoredValueCard = false;
    state.payMethod.useStoredValueCard = false;
    state.payMethod.cardDeductTotal = 0;
  }
}
function viewStoreLocation() {
  const storeInfo = state.storeInfo;
  const latitude = parseFloat(storeInfo.latitude);
  const longitude = parseFloat(storeInfo.longitude);
  uni.openLocation({
    latitude,
    longitude,
    scale: 28,
    name: storeInfo.name,
    address: storeInfo.address
  });
}
function getMemberScore() {
  const that = this;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.member = app.globalData.userInfo.member;
    state.isMember = true;
    memberService.getBalance(state.member.mobile).then(res => {
      console.log('res', res, state.allPrice);
      state.userScore = res;
      state.canBuy = res >= state.allPrice;
    }).catch(e => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {}
}
function contactStore() {
  let storeInfo = state.storeInfo;
  let tel = '';
  if (storeInfo.tel != null && storeInfo.tel != '') {
    // 判断订单中门店是否有电话
    tel = storeInfo.tel;
  } else {
    // 门店无电话使用公司服务电话
    tel = app.globalData.servicePhone;
  }
  if (tel !== '') {
    uni.showModal({
      title: '提示',
      content: '确定要拨打以下电话' + tel,
      confirmText: '拨打',
      success: function (res) {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: tel
          });
        }
        if (res.cancel) {}
      }
    });
  }
}
function defaultData() {
  const self = this;
  //获取选中的门店id
  console.log(app.globalData.storeInfo);
  state.storeId = app.globalData.storeInfo.id;
  // 获取默认的一些配置
  // 查询配置项获取订单预约时间和订单自提开始时间和预约时间间隔
  state.storeInfo = app.globalData.storeInfo;
  let systemOptions = app.globalData.configureInfo;
  let configures = {
    orderChooseDateAllowDays: 3,
    orderChooseDateInterval: 10800000,
    daysOfSelfTimeDelay: 0,
    teamOrderCanUseScore: false,
    teamOrderCanUseCoupon: false,
    isGiftCard: true
  };
  systemOptions.forEach(item => {
    // 遍历配置项，获取订单预约时间和订单自提开始时间
    if (item.key === 'orderChooseDateAllowDays' && item.value != null && item.value !== '') {
      // 订单预约可以预约几天 （单位 天）
      configures.orderChooseDateAllowDays = parseInt(item.value);
    } else if (item.key === 'orderChooseDateInterval' && item.value != null && item.value !== '') {
      // 订单预约时间的间隔 （单位 毫秒）
      configures.orderChooseDateInterval = parseInt(item.value) * 1000;
    } else if (item.key === 'daysOfSelfTimeDelay' && item.value != null && item.value !== '') {
      configures.daysOfSelfTimeDelay = parseInt(item.value);
    } else if (item.key === 'isGiftCard' && item.value != null && item.value !== '') {
      item.value === 'TRUE' ? configures.isGiftCard = true : configures.isGiftCard = false;
    }
  });
  state.systemOptions = configures;
}
function queryMemberShip() {
  const self = this;
  return new Promise(function (resolve, reject) {
    memberService.queryGrade().then(res => {
      if (res) {
        res = utils.compareMemberGrade(res);
        let memberShip = [{
          id: 'ALL'
        }];
        res.forEach(el => {
          const grade = {
            id: ''
          };
          grade.id = el.id;
          memberShip.push(grade);
          state.memberShip = memberShip;
          resolve(state.memberShip);
        });
      } else {
        reject();
      }
    });
  });
}
function getCalculateTime() {
  // 获取订单自提/配送时间 给后端参数处理
  state.calculateData.productIds = [];
  // this.data.goodsList.forEach(item => {
  state.calculateData.productIds.push(state.productId);
  // })
  state.calculateData.storeId = state.storeInfo.id;
  if (state.type === 'selftake') {
    state.calculateData.shipmentType = 'SELF'; //自提
  } else if (state.type === 'dispatch') {
    state.calculateData.shipmentType = 'EXPRESS'; // 外卖配送
  }
  state.calculateData = state.calculateData;
  state.storePickupTime = '';
  let postData = state.calculateData;
  if (state.calculateData.productIds.length <= 0) {
    return;
  }
  orderService.calculateTime(postData).then(res => {
    // console.log('res----',res)
    state.deliveryTimeData = [];
    if (res && res.timeScopeList) {
      res.timeScopeList.forEach(item => {
        state.deliveryTimeData.push({
          day: item.day,
          timeList: item.time
        });
      });
    }
    state.deliveryTimeData = state.deliveryTimeData;
    state.deliveryTime = '';
    state.storePickupTime = '';
    console.log('deliveryTimeData', state.deliveryTimeData);
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
    state.deliveryTimeData = [];
    state.deliveryTime = '';
    state.storePickupTime = '';
  }).finally(() => {
    const wj_storePickupTime = uni.getStorageSync('wj_storePickupTime');
    console.log('wj_storePickupTime', wj_storePickupTime);
    if (wj_storePickupTime) {
      state.storePickupTime = wj_storePickupTime;
    }
  });
}
function initializationTime() {
  const self = this;
  const configure = state.systemOptions; //获取订单相关的系统配置
  let now = new utils.ResponseDate();
  let hour = now.getHours(); //小时数
  let days = configure.orderChooseDateAllowDays; //订单预约可以预约几天 （单位 天）
  const orderAppointmentDate = configure.daysOfSelfTimeDelay; //订单预约限定下单后第几天开始
  console.log(orderAppointmentDate);
  let newAppointmentDate = addDay(now, orderAppointmentDate);
  let tempTime = [[], []];
  console.log(newAppointmentDate);
  for (let i = 0; i < days; i++) {
    let date = addDay(newAppointmentDate, i);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let newDate = [year, month, day].map(utils.timeFormat).join('-');
    tempTime[0].push(newDate);
  }
  tempTime[1] = handleChooseTime();
  // 特别的处理日期在完善订单页面的显示
  state.multiArray = tempTime;
  let specialDays = state.multiArray[0][state.multiIndex[0]];
  let daysArr = specialDays.split("-");
  let date = daysArr[1] + '月' + daysArr[2] + '日';
  let selfTimeDate = date;
  //  切换配送方式 外卖/自提重新从后端获取配送时间
  state.selfTimeDate = selfTimeDate;
  if (state.type === 'selftake' || state.type === 'dispatch') getCalculateTime();
}
function addDay(curDate, days) {
  return new Date((curDate / 1000 + 86400 * days) * 1000);
}
function splitTime(startDate, endDate, amount, timeStart, timeEnd) {
  let startTime = new Date(startDate + " " + timeStart);
  let endTime = new Date(endDate + " " + timeEnd);
  let gap = amount;
  let count = Math.ceil((endTime - startTime) / gap);
  let realCount = (endTime - startTime) / gap;
  let temp = [];
  let tempTime = [];
  if (count - realCount >= 0) {
    temp.push(utils.formatTime(startTime));
    for (let i = 1; i < count; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() + gap);
      temp[i] = utils.formatTime(new Date(startTime.getTime()));
    }
    temp.push(utils.formatTime(endTime));
  } else {
    temp.push(utils.formatTime(startTime));
    for (let i = 1; i < count; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() + gap);
      temp[i] = utils.formatTime(new Date(startTime.getTime()));
    }
  }
  temp.forEach(item => {
    let tempData = item.split(" ")[1].slice(0, 5);
    tempTime.push(tempData);
  });
  tempTime = Array.from(new Set(tempTime));
  return tempTime;
}
function handleChooseTime() {
  const self = this;
  let now = new utils.ResponseDate();
  let hour = now.getHours(); //小时数
  let minute = now.getMinutes(); //分钟数
  let time = [hour, minute].map(utils.timeFormat).join(':');
  let storeTime = '';
  let tempTime = [];
  let businessHours = [];
  // 处理经营时间
  try {
    let allStores = uni.getStorageSync('wj_allStores');
    console.log(state.storeId);
    let reg = new RegExp(state.storeId);
    if (allStores) {
      allStores.forEach(item => {
        if (reg.test(item.id)) {
          storeTime = item.storeHours.split("-");
        }
      });
    }
  } catch (e) {}
  let tempStart = storeTime[0] + ':00';
  let tempEnd = storeTime[1] + ':00';
  let date = utils.formatTime(now).split(" ")[0];
  let startTimeDetails = new Date(date + " " + tempStart).getTime();
  let endTimeDetails = new Date(date + " " + tempEnd).getTime();
  let nowTime = new Date(utils.formatTime(now)).getTime();
  businessHours = splitTime(date, date, state.systemOptions.orderChooseDateInterval, tempStart, tempEnd);
  let hourArray = []; //营业时间小时数组
  businessHours.forEach(ele => {
    hourArray.push(ele.slice(0, 2));
  });
  let hourArrayLength = hourArray.length;
  let chooseTime = [[], []];
  for (let j = 0; j < businessHours.length - 1; j++) {
    const eleStart = businessHours[j];
    const eleEnd = businessHours[j + 1];
    let tempData = eleStart + '-' + eleEnd;
    chooseTime[0].push(tempData);
  }
  for (let i = 0; i < hourArrayLength; i++) {
    if (hour >= hourArray[i] && hour < hourArray[i + 1]) {
      chooseTime[1].push(time + '-' + businessHours[i + 1]);
      for (let k = i + 1; k < businessHours.length - 1; k++) {
        const eleStart = businessHours[k];
        const eleEnd = businessHours[k + 1];
        let tempData = eleStart + '-' + eleEnd;
        chooseTime[1].push(tempData);
      }
    } else if (hour == hourArray[hourArrayLength - 1]) {
      let now = utils.timestampToTime(nowTime);
      let end = utils.timestampToTime(endTimeDetails);
      let start = now.split(" ")[1].slice(0, 5);
      let endTime = end.split(" ")[1].slice(0, 5);
      let tempData = start + '-' + endTime;
      if (chooseTime[1].length > 0) {
        let hasTime = false;
        chooseTime[1].forEach(it => {
          if (it === tempData) {
            hasTime = true;
          }
        });
        if (!hasTime) {
          chooseTime[1].push(tempData);
        }
      } else {
        chooseTime[1].push(tempData);
      }
    }
  }
  // 小时
  state.chooseTime = chooseTime;
  state.storeTime = storeTime;
  if (nowTime <= startTimeDetails) {
    tempTime = chooseTime[0];
  } else if (nowTime > startTimeDetails && nowTime < endTimeDetails) {
    tempTime = chooseTime[1];
  } else {
    if (state.multiIndex[0] === 0) {
      tempTime = ["无法预约自提时间"];
      state.chooseTime[1] = tempTime;
      state.unableSafetake = true;
    } else {
      tempTime = chooseTime[0];
    }
  }
  return tempTime;
}
function chooseTime() {
  // console.log(this.data.showTime)
  // this.timepicker.getDliveryTime();
  // console.log(this.data.showTime)
  state.showTime = true;
}
function selectTime(e) {
  if (e.detail.deliveryTime && e.detail.deliveryTime !== state.storePickupTime) {
    // 选择完时间后存储到本地
    state.storePickupTime = e.detail.deliveryTime;
    state.showTime = false;
    uni.setStorageSync('wj_storePickupTime', state.storePickupTime);
  }
}
function onClose() {
  state.showTime = false;
}
function bindMultiPickerChange(e) {
  const index = e.detail.value;
  let specialDays = state.multiArray[0][index[0]];
  let daysArr = specialDays.split("-");
  let date = daysArr[1] + '月' + daysArr[2] + '日';
  let selfTimeDate = date;
  state.selfTimeDate = selfTimeDate;
  state.multiIndex = index;
}
function bindMultiPickerColumnChange(e) {
  console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  let _data = {
    multiArray: state.multiArray,
    multiIndex: state.multiIndex
  };
  _data.multiIndex[e.detail.column] = e.detail.value;
  let now = new utils.ResponseDate();
  let tempStart = state.storeTime[0] + ':00';
  let tempEnd = state.storeTime[1] + ':00';
  let date = utils.formatTime(now).split(" ")[0];
  let startTimeDetails = new Date(date + " " + tempStart).getTime();
  let endTimeDetails = new Date(date + " " + tempEnd).getTime();
  let nowTime = new Date(utils.formatTime(now)).getTime();
  switch (_data.multiIndex[0]) {
    case 0:
      if (nowTime > startTimeDetails) {
        _data.multiArray[1] = state.chooseTime[1];
      } else {
        _data.multiArray[1] = state.chooseTime[0];
      }
      break;
    case 1:
      _data.multiArray[1] = state.chooseTime[0];
      break;
    case 2:
      _data.multiArray[1] = state.chooseTime[0];
      break;
  }
  if (_data.multiArray[1][0] === '请选择其他时间' || _data.multiArray[1][0] === '不能下单' || _data.multiArray[1][0] === '无法预约自提时间') {
    console.log('canBuycanBuycanBuycanBuy');
    state.canBuy = false;
    state.unableSafetake = true;
  } else {
    state.canBuy = true;
    state.unableSafetake = false;
  }
  if (e.detail.column == 0) {
    // 特别的处理日期在完善订单页面的显示
    let days = _data.multiArray[0][_data.multiIndex[0]];
    let daysArr = days.split("-");
    let date = daysArr[1] + '月' + daysArr[2] + '日';
    let selfTimeDate = date;
    state.selfTimeDate = selfTimeDate;
  }
  Object.assign(state, _data);
}
onReady(function () {
  const self = this;
  // 获取会员信息
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.memberInfo = app.globalData.userInfo.member;
  } else {
    uni.getStorage({
      key: 'wj_member',
      success: function (res) {
        state.memberInfo = res.data;
      }
    });
  }
});
onShow(function () {
  const self = this;
  if (!state.storeInfo || app.globalData.storeInfo && app.globalData.storeInfo.id !== state.storeInfo.id) {
    state.storePickupTime = '';
    uni.setStorageSync('wj_storePickupTime', '');
    //设置一些默认信息
    defaultData();
    //初始化预约时间
    initializationTime();
    if (state.type === 'dispatch' || state.type === 'logistical') {
      checkDistribution();
    }
  }
  // 读取优惠券使用数据
  try {
    let couponData = uni.getStorageSync('wj_chooseCoupon');
    if (couponData) {
      calcCoupon(couponData);
    } else {}
    uni.removeStorageSync('wj_chooseCoupon');
  } catch (error) {}
});
onHide(function () {
  const that = this;
  state.timer = setTimeout(function () {
    state.isPrizing = false;
  }, 500);
});
onUnload(function () {
  const that = this;
  state.timer = setTimeout(function () {
    state.isPrizing = false;
  }, 500);
  clearTimeout(state.timer);
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
});
function handleContinuePay(e) {
  state.canBuy = e.detail;
}
function handleOrderCancel(e) {
  state.orderCancel = e.detail;
}
function handleOrderPay(e) {
  state.orderPay = e.detail;
}
function changeStore() {
  const opts = "?productId=" + state.goodsList[0].id + "&activityId=" + state.goodsList[0].activityId;
  NAVPAGE.toScoreSelectStore(opts);
}
function toggleSelloutPopup() {
  toggle('sellout');
}
function getDistributionFeeRule(storeId) {
  const self = this;
  // 定义配送费优惠规则
  distributionFee = null;
  logisticalFee = null;
  let shipmentType = '';
  const type = state.type;
  if (type === 'dispatch') {
    shipmentType = "EXPRESS";
  } else if (type === 'logistical') {
    shipmentType = "LOGISTICAL";
  } else {
    shipmentType = "SELF";
  }
  if (shipmentType !== "SELF") {
    distributionService.get(storeId, shipmentType).then(res => {
      let resArr = res ? Object.keys(res) : [];
      if (res && resArr.length > 0) {
        if (shipmentType === "EXPRESS") {
          distributionFee = res;
        } else if (shipmentType === "LOGISTICAL") {
          logisticalFee = res;
        }
        if (type === 'dispatch' || type === 'logistical') {
          checkDistribution();
        }
      }
    }).catch(err => {
      utils.showToast(err.message);
    });
  }
}
function getIntersection(arr1, arr2) {
  // 使用 Set 来提高查找效率
  const set = new Set(arr1);
  // 过滤出在 set 中存在的元素
  return arr2.filter(item => set.has(item));
}
function handleDeliveryType() {
  const self = this;
  let canDelivery = false;
  let canSelfmention = false;
  console.log(shipmentTypes, "shipmentTypesshipmentTypes");
  // let productShipmentGoodsArr = self.data.productShipment? self.data.productShipment.split(','):[]
  // let storeShipmentArr = self.data.storeInfo.shipmentTypes.split(',')
  // let shipmentTypes = self.getIntersection(productShipmentGoodsArr,storeShipmentArr)
  let shipmentTypes = state.storeInfo.shipmentTypes;
  //判断是否支持配送或者快递
  if (shipmentTypes.indexOf('EXPRESS') >= 0 || shipmentTypes.indexOf('LOGISTICAL') >= 0) {
    canDelivery = true;
  }
  if (shipmentTypes.indexOf('SELF') >= 0) {
    canSelfmention = true;
  }
  let shipmentList = [];
  if (!app.globalData.uiconfig || !app.globalData.uiconfig.shipmentSortList || app.globalData.uiconfig.shipmentSortList.length == 0) {
    if (app.globalData.uiconfig) {
      app.globalData.uiconfig.shipmentSortList = ["SELF", "EXPRESS", "LOGISTICAL"];
    } else {
      app.globalData.uiconfig = {
        shipmentSortList: ["SELF", "EXPRESS", "LOGISTICAL"]
      };
    }
  }
  //处理排序问题
  for (const key in app.globalData.uiconfig.shipmentSortList) {
    if (app.globalData.uiconfig.shipmentSortList.hasOwnProperty(key)) {
      const value = app.globalData.uiconfig.shipmentSortList[key];
      if (value === "TAKEMEALNOW") {
        continue;
      }
      if (state.isDistributionOrder) {
        //统配
        //排除配送
        if (value === "SELF") {
          continue;
        }
      } else {
        //排除门店不支持的外送方式（快递或者外送）
        if ((value === "LOGISTICAL" || value === "EXPRESS") && shipmentTypes.indexOf(value) < 0) {
          continue;
        }
        // 积分商城订单排除外送
        if (value === "EXPRESS") {
          continue;
        }
      }
      shipmentList.push(value);
    }
  }
  if (cacheOrder) {
    // 收银只支持自提
    shipmentList = ["SELF"];
  }
  // 配送方式顺序
  state.shipmentSortList = shipmentList;
  let firstType = state.shipmentSortList[0];
  if ((firstType === "LOGISTICAL" || firstType === "EXPRESS") && canDelivery) {
    let type = 'dispatch';
    if (firstType === "LOGISTICAL" || state.isDistributionOrder) {
      type = 'logistical';
    }
    state.type = type;
  } else if (firstType === "SELF" && canSelfmention) {
    if (state.isDistributionOrder) {
      // 排除统配订单
      let type = 'logistical';
      // if (shipmentTypes.indexOf('EXPRESS') >= 0) {
      //   type = 'dispatch'
      // } else 
      if (shipmentTypes.indexOf('LOGISTICAL') >= 0) {
        type = 'logistical';
      }
      state.type = type;
    } else {
      state.type = 'selftake';
    }
  } else if (firstType === "SELF" && !canSelfmention) {
    let type = 'dispatch';
    if (shipmentTypes.indexOf('EXPRESS') >= 0) {
      type = 'dispatch';
    } else if (shipmentTypes.indexOf('LOGISTICAL') >= 0) {
      type = 'logistical';
    }
    state.type = type;
  }
  if (state.type === 'dispatch' || state.type === 'logistical') {
    checkDistribution();
  }
  state.canDelivery = canDelivery;
  state.canSelfmention = canSelfmention;
}
function getAvailableCouponNum() {
  console.log(canGetAvailableCouponNum);
  if (!canGetAvailableCouponNum) {
    return;
  }
  canGetAvailableCouponNum = false;
  const that = this;
  if (!state.userChooseCoupon) {
    calcPromotions();
    return;
  }
  let _data2 = getPostData();
  let postData = {
    order: _data2
  };
  queryAvailableCoupon();
  function queryAvailableCoupon() {
    let allPrice = parseFloat(_data2.allPrice);
    if (allPrice > 0) {
      couponService.getAvailableCoupon(null, postData).then(res => {
        canGetAvailableCouponNum = true;
        console.log(res);
        let discountNum = 0;
        let freeshipNum = 0;
        let deductionAmount = 0;
        let deductionRate = 1;
        let tempCoupon = null;
        let discountCoupons = []; // 可用折扣券列表
        if (res && res.length > 0) {
          res.forEach(item => {
            if (item.usable === true) {
              if (item.coupon.function !== 'FREESHIP') {
                discountNum++;
                // 找出满减券中可抵扣金额最大的那张
                if (item.coupon.function === 'CASH') {
                  if (item.coupon.faceValue > deductionAmount) {
                    tempCoupon = item;
                    deductionAmount = item.coupon.faceValue;
                  }
                } else if (item.coupon.function === 'DISCOUNT') {
                  discountCoupons.push(item);
                }
              } else {
                freeshipNum++;
              }
            }
          });
          // 自动选择折扣率最大的折扣券
          if (deductionAmount === 0 && discountCoupons.length > 0) {
            discountCoupons.forEach(item => {
              if (item.coupon.rate < deductionRate) {
                tempCoupon = item;
                deductionRate = item.coupon.rate;
              }
            });
          }
        }
        // 如果用户当前没有选择优惠券，默认选择最大抵扣的现金券
        if (!state.useCoupon && state.usedCoupons.length === 0 && tempCoupon && (deductionAmount > 0 || deductionRate < 1)) {
          let couponData = {
            couponType: "discount",
            coupons: [tempCoupon]
          };
          calcCoupon(couponData);
        } else {
          canCalcPromotions = true;
          calcPromotions();
        }
        state.hasAvailableCoupon = true;
        state.discountNum = discountNum;
        state.freeshipNum = freeshipNum;
      }).catch(err => {
        canGetAvailableCouponNum = true;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    } else {
      canGetAvailableCouponNum = true;
      state.hasAvailableCoupon = true;
      state.discountNum = 0;
      state.freeshipNum = 0;
    }
  }
}
function calcCoupon(couponData) {
  const self = this;
  let shipmentCouponDiscount = 0; // 运费券抵扣金额
  const shipmentAmount = state.shipmentAmount; // 运费
  let freeship = shipmentAmount;
  let couponDiscount = state.couponDiscount;
  let coupons = {
    freeship: [],
    discount: []
  };
  let userChooseCoupon = true;
  let usedCoupons = [];
  if (couponData.coupons.length > 0) {
    coupons = state.couponInfo.data;
    couponData.coupons.forEach(item => {
      if (couponData.couponType === 'freeship') {
        coupons.freeship = [];
        coupons.freeship.push(item);
      } else if (couponData.couponType === 'discount') {
        coupons.discount = [];
        coupons.discount.push(item);
      }
    });
    if (coupons.freeship && coupons.freeship.length > 0) {
      coupons.freeship.forEach(ele => {
        usedCoupons.push({
          couponId: ele.coupon.id,
          service: ele.service
        });
      });
    }
    if (coupons.discount && coupons.discount.length > 0) {
      coupons.discount.forEach(ele => {
        usedCoupons.push({
          couponId: ele.coupon.id,
          service: ele.service
        });
      });
    }
  } else {
    userChooseCoupon = false;
    coupons = state.couponInfo.data;
    if (couponData.couponType === 'freeship') {
      shipmentCouponDiscount = 0;
      freeship = shipmentAmount;
      coupons.freeship = [];
    } else if (couponData.couponType === 'discount') {
      couponDiscount = 0;
      shipmentCouponDiscount = state.shipmentCouponDiscount;
      freeship = state.shipmentRealPay;
      coupons.discount = [];
    }
  }
  state.couponInfo = {
    description: '选择优惠券',
    data: coupons,
    useCoupon: usedCoupons.length > 0 ? true : false
  };
  state.usedCoupons = usedCoupons;
  state.userChooseCoupon = userChooseCoupon;
  canCalcPromotions = true;
  calcPromotions();
}
function calcPromotions() {
  console.log(canCalcPromotions);
  if (!canCalcPromotions) {
    return;
  }
  canCalcPromotions = false;
  const self = this;
  let products = [];
  state.goodsList.forEach(item => {
    let tempItem = {
      id: item.productId,
      count: item.productNum,
      price: 0
    };
    // 分享人id
    if (item.sharingPersonId) {
      tempItem = {
        ...tempItem,
        sharingPersonId: item.sharingPersonId
      };
    }
    if (item.groupProducts && item.groupProducts.length > 0) {
      tempItem.cateringOrderDetails = item.groupProducts;
    }
    if (state.scource === 'SHOPPINGCART') {
      tempItem = {
        ...tempItem,
        shoppingCartItemId: item.id
      };
    }
    if (item.newmbrActivityId) {
      tempItem = {
        ...tempItem,
        newmbrActivityId: item.newmbrActivityId
      };
      products.push(tempItem);
    } else if (item.grabActivityId) {
      tempItem = {
        ...tempItem,
        grabActivityId: item.grabActivityId
      };
      products.push(tempItem);
    } else if (item.usePromotionPrice) {
      tempItem = {
        ...tempItem,
        usePromotionPrice: true
      };
      products.push(tempItem);
    } else if (item.useMemberPrice) {
      tempItem = {
        ...tempItem,
        useMemberPrice: true
      };
      products.push(tempItem);
    } else {
      products.push(tempItem);
    }
    // 如果该商品有赠品
    if (item.goodsPromotions && item.goodsPromotions.length > 0) {
      item.goodsPromotions.forEach(item => {
        products.push({
          gift: true,
          id: item.goods.uuid,
          count: item.count
        });
      });
    }
  });
  let shipmentAmount = 0;
  if (state.type === "dispatch" || state.type === "logistical") {
    shipmentAmount = state.shipmentAmount;
  }
  let postData = {
    memberId: state.memberInfo.id,
    products: products,
    storeId: state.storeId,
    usedCoupons: state.usedCoupons,
    shipmentAmount: shipmentAmount ? shipmentAmount : null
  };
  if (cacheOrder) {
    // 收银下单，传入缓存订单id
    postData = {
      ...postData,
      inputAmount: state.inputAmount > 0 ? state.inputAmount : 0
    };
  }
  promotionService.calcPromotions(postData).then(res => {
    canCalcPromotions = true;
    let goods = state.goodsList;
    if (res) {
      // 处理运费券
      let shipmentCouponDiscount = res.discounts.shipmentDiscount && res.discounts.shipmentDiscount.details.length > 0 ? res.discounts.shipmentDiscount.discount : state.shipmentCouponDiscount; // 运费抵扣
      // 处理运费券不能使用的情况
      if ((state.type === "dispatch" || state.type === "logistical") && shipmentCouponDiscount === 0 && state.couponInfo.data.freeship && state.couponInfo.data.freeship.length > 0) {
        const freeship = state.couponInfo.data.freeship;
        let usedCoupons = state.usedCoupons;
        for (let i = 0; i < usedCoupons.length; i++) {
          const ele = usedCoupons[i];
          if (ele.couponId === freeship[0].coupon.id) {
            usedCoupons.splice(i, 1);
            break;
          }
        }
        state.couponInfo.data.freeship = [];
      }
      // 处理优惠券不能使用的情况
      if (couponDiscount === 0 && state.couponInfo.data.discount && state.couponInfo.data.discount.length > 0) {
        const discount = state.couponInfo.data.discount;
        let usedCoupons = state.usedCoupons;
        for (let i = 0; i < usedCoupons.length; i++) {
          const ele = usedCoupons[i];
          if (ele.couponId === discount[0].coupon.id) {
            usedCoupons.splice(i, 1);
            break;
          }
        }
        state.couponInfo.data.discount = [];
      }

      // 计算订单抵扣
      // 现金抵扣金额
      let cashDiscount = res.discounts.cashDiscount ? res.discounts.cashDiscount.discount : 0;
      // 券抵扣金额
      let couponDiscount = res.discounts.couponDiscount ? res.discounts.couponDiscount.discount : 0;
      let shipmentRealPay = Number(state.shipmentAmount) - Number(shipmentCouponDiscount) > 0 ? parseFloat((Number(state.shipmentAmount) - Number(shipmentCouponDiscount)).toFixed(2)) : 0;
      let totalPay = state.allPrice + state.shipmentAmount;
      // 计算促销(拼团不参与送商品促销)
      state.cashDiscount = cashDiscount;
      state.couponDiscount = couponDiscount <= totalPay ? couponDiscount : totalPay;
      state.totalDiscount = res.discounts.totalDiscount;
      state.shipmentCouponDiscount = shipmentCouponDiscount;
      state.shipmentRealPay = shipmentRealPay;
      if (res.promotions && res.promotions.goodsPromotions && res.promotions.goodsPromotions.length > 0 && state.orderType !== "group") {
        // 有促销且促销中有送商品促销
        let giftGoods = [];
        res.promotions.goodsPromotions.forEach(it => {
          if (it.goodsRange && it.goodsRange.length === 1) {
            // 指定商品送赠品
            let goodsPromotions = [];
            for (let i = 0; i < goods.length; i++) {
              const ele = goods[i];
              if (ele.productId === it.goodsRange[0]) {
                goodsPromotions.push(it);
                goods[i].goodsPromotions = goodsPromotions;
                break;
              }
            }
          } else if (it.goodsRange && (it.goodsRange.length === 0 || it.goodsRange.length > 1)) {
            giftGoods.push({
              giftProduct: true,
              productId: it.goods.uuid,
              productNum: it.count,
              name: it.goods.name,
              image: it.goods.image
            });
          } else {
            giftGoods.push({
              giftProduct: true,
              productId: it.goods.uuid,
              productNum: it.count,
              name: it.goods.name,
              image: it.goods.image
            });
          }
        });
        state.goodsList = goods;
        state.giftGoodsList = giftGoods;
      }
      // 重新选择优惠券之后调用接口计算储值余额抵扣
      handleCardBalance();
    }
  }).catch(e => {
    // 重新选择优惠券之后调用接口计算储值余额抵扣
    handleCardBalance();
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function checkDistribution() {
  const that = this;
  try {
    let value = uni.getStorageSync('wj_chooseAddressInfo');
    if (value) {
      // 缓存中有默认地址
      state.addressInfo = value;
      calcDistance(value);
    } else {
      // 缓存中没有默认地址
      if (state.addressInfo == '') {
        // 当前没有选择地址
        addressService.getDefaultAddress().then(res => {
          if (res) {
            // 有默认地址
            state.addressInfo = res;
            uni.setStorage({
              key: "wj_chooseAddressInfo",
              data: res
            });
            calcDistance(res);
          } else {
            // 无默认地址
            uni.getLocation({
              type: 'gcj02',
              success: function (res) {
                let latitude = res.latitude;
                let longitude = res.longitude;
                // 查询所有地址
                addressService.query().then(result => {
                  console.log(result);
                  if (result.length > 0) {
                    let allAddress = result;
                    let tempIndex = getNearestAddress(allAddress, latitude, longitude);
                    uni.setStorage({
                      key: "wj_chooseAddressInfo",
                      data: allAddress[tempIndex]
                    });
                    state.addressInfo = allAddress[tempIndex];
                    calcDistance(allAddress[tempIndex]);
                  } else {
                    uni.showToast({
                      title: '请选择收货地址~',
                      icon: 'none',
                      duration: 2000
                    });
                  }
                }).catch(err => {
                  uni.showToast({
                    title: err.message,
                    icon: 'none',
                    duration: 2000
                  });
                });
              }
            });
          }
        }).catch(err => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      } else {
        // 当前选择了地址
        // 查询所有地址
        addressService.query().then(result => {
          console.log(result);
          if (result.length > 0) {
            uni.getLocation({
              type: 'gcj02',
              success: function (res) {
                let latitude = res.latitude;
                let longitude = res.longitude;
                let allAddress = result;
                let tempIndex = getNearestAddress(allAddress, latitude, longitude);
                // 缓存最近的地址
                uni.setStorage({
                  key: "wj_chooseAddressInfo",
                  data: allAddress[tempIndex]
                });
                state.addressInfo = allAddress[tempIndex];
                calcDistance(allAddress[tempIndex]);
              }
            });
          } else {
            state.addressInfo = '';
            uni.showToast({
              title: '请选择收货地址~',
              icon: 'none',
              duration: 2000
            });
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
  } catch (error) {
    uni.showToast({
      title: error.message,
      icon: 'none',
      duration: 2000
    });
  }
}
function getNearestAddress(allAddress, latitude, longitude) {
  let distanceArr = [];
  allAddress.forEach(item => {
    let dis = utils.distance(latitude, longitude, item.latitude, item.longitude);
    distanceArr.push(dis);
  });
  // 计算最小值
  const minN = Math.min.apply(Math, distanceArr);
  let tempIndex = 0;
  for (let i = 0; i < distanceArr.length; i++) {
    if (minN === distanceArr[i]) {
      tempIndex = i;
      break;
    }
  }
  return tempIndex;
}
function calcDistance(chooseAddress) {
  let self = this;
  if (state.selfOrderShowAddress && state.type === "selftake") {
    console.log("自提订单不检查是否能配送，不要配送费");
    return;
  }
  let _calculatedDeliveryFee = false;
  calculatedDeliveryFee = false;
  const type = state.type;
  let shipmentType = "EXPRESS";
  if (type === 'dispatch') {
    shipmentType = "EXPRESS";
  } else if (type === 'logistical') {
    shipmentType = "LOGISTICAL";
  }
  console.log('shipmentType', shipmentType);
  // 只有外送需要判断骑行距离
  if (shipmentType == 'EXPRESS') {
    // 获得用户的骑行距离
    // var cyclingDistance = utils.calculateDistanceBicycling(chooseAddress.latitude, chooseAddress.longitude, self.data.storeInfo.latitude, self.data.storeInfo.longitude)
    let cyclingDistance = utils.getTripDist(chooseAddress.longitude, chooseAddress.latitude, state.storeInfo.longitude, state.storeInfo.latitude, self);
    cyclingDistance.then(res => {
      let distance = res.distance ? (res.distance * 1000).toFixed(2) : res.data.result.routes["0"].distance.toFixed(2);
      state.distance = distance;
      return distance;
    }).then(distance => {
      state.distance = distance;
      getFee(shipmentType, distance, chooseAddress, _calculatedDeliveryFee, type);
    }).catch(err => {
      utils.showToast("当前门店地理位置有问题，导致无法下单，请联系门店人员解决");
      state.canBuy = false;
    });
  } else {
    getFee(shipmentType, null, chooseAddress, _calculatedDeliveryFee, type);
  }
}
function getFee(shipmentType, distance, chooseAddress, calculatedDeliveryFee, type) {
  let self = this;
  let address = chooseAddress.province + chooseAddress.city + chooseAddress.county + chooseAddress.detailedAddress + chooseAddress.houseNum;
  let postData = {
    address: address,
    distance: Number(distance),
    latitude: chooseAddress.latitude,
    longitude: chooseAddress.longitude,
    positionSource: 1,
    storeId: state.storeId,
    shipmentType: shipmentType
  };
  distributionService.check(postData).then(res => {
    console.log(res);
    let storeId = state.storeId;
    if (res) {
      let products = [];
      state.goodsList.forEach(item => {
        let tempItem = {
          productId: item.productId,
          productNum: state.quantity,
          price: 0
        };
        products.push(tempItem);
      });
      let postData = {
        allPrice: state.allPrice,
        distance: parseInt(distance),
        products: products,
        storeId: storeId,
        shipmentType: shipmentType,
        province: chooseAddress.province,
        city: chooseAddress.city,
        longitude: chooseAddress.longitude,
        latitude: chooseAddress.latitude,
        calcFeeSource: 'GENERAL_ORDER'
      };
      distributionService.calcFeeV1(postData).then(res => {
        // 统配和外送还有快递都是根据门店配送规则计算运费
        if (res || res.fee === 0) {
          // 配送费规则
          // let distributionFeeRule = null
          // if (type === 'dispatch') {
          //     distributionFeeRule = self.distributionFee
          // } else if (type === 'logistical') {
          //     distributionFeeRule = self.logisticalFee
          // }
          // console.log(self.data.canBuy, self.data.tips, distributionFeeRule)
          // if (!distributionFeeRule) {
          //     // 还未获取到配送规则
          //     self.setData({
          //     canBuy: false
          //     })
          //     return;
          // }
          if (state.tips === '') {
            state.canBuy = true;
          } else if (shipmentType === 'LOGISTICAL') {
            state.canBuy = true;
          } else {
            if (state.daysOfSelfTimeDelay > 0 || state.orderType === 'group' && state.teamBuyInfo.selfAfterDay != null && state.teamBuyInfo.selfAfterDay > 0) {
              showNotify(state.tips);
            }
          }
          if (!state.canBuy) {
            return;
          }
          let shipmentRealPay = parseFloat((Number(res.fee) - res.deductibleFee).toFixed(2));
          let shipmentDiscount = parseFloat(res.deductibleFee.toFixed(2));
          console.log(state.type);
          if (state.type === 'dispatch' || state.type === 'logistical') {
            // console.log(Number(self.data.allPrice), distributionFeeRule.takeoutFare)
            if (parseFloat(state.shipmentCouponDiscount) > 0) {
              shipmentRealPay = shipmentRealPay - Number(state.shipmentCouponDiscount);
            }
            state.shipmentAmount = parseFloat((Number(res.fee) - res.deductibleFee).toFixed(2));
            state.shipmentRealPay = parseFloat(shipmentRealPay.toFixed(2));
            state.shipmentDiscount = shipmentDiscount;
          }
          calculatedDeliveryFee = true;
        } else {
          state.canBuy = false;
          calculatedDeliveryFee = false;
        }
        state.calculatedDeliveryFee = calculatedDeliveryFee;
        calculatedDeliveryFee = calculatedDeliveryFee;
        // 计算配送状态下可用券
        getAvailableCouponNum();
        handleCardBalance();
      }).catch(err => {
        console.log(err);
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
        state.canBuy = false;
        state.calculatedDeliveryFee = calculatedDeliveryFee;
        calculatedDeliveryFee = calculatedDeliveryFee;
      });
    } else {
      if (state.orderType !== 'distribution') {
        uni.showToast({
          title: '该地址超出配送范围，请重新修改收货地址~',
          icon: 'none',
          duration: 2000
        });
        state.canBuy = false;
      } else {
        // 计算配送状态下可用券（统配）
        getAvailableCouponNum();
        state.canBuy = true;
      }
      state.calculatedDeliveryFee = calculatedDeliveryFee;
      calculatedDeliveryFee = calculatedDeliveryFee;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
    state.calculatedDeliveryFee = calculatedDeliveryFee;
    state.shipmentAmount = 0;
    calculatedDeliveryFee = calculatedDeliveryFee;
    if (state.orderType !== 'distribution') {
      state.canBuy = false;
    } else {
      // 计算配送状态下可用券（统配）
      getAvailableCouponNum();
      state.canBuy = true;
    }
  });
}
function toChoiceCoupon(val) {
  const that = this;
  let canUseCoupon = true;
  const teamOrderCanUseCoupon = state.systemOptions.teamOrderCanUseCoupon;
  if (state.orderType !== 'group') {
    canUseCoupon = true;
  } else {
    if (state.orderType === 'group' && teamOrderCanUseCoupon) {
      canUseCoupon = true;
    } else {
      canUseCoupon = false;
      uni.showToast({
        title: '活动不可用券~',
        icon: 'none',
        duration: 2000
      });
    }
  }
  let tempShipAmount = state.shipmentAmount;
  let paymentPrice = state.allPrice - state.totalDiscount + parseFloat(tempShipAmount) - parseFloat(state.shipmentCouponDiscount) - state.scoreDiscount;
  if (paymentPrice >= 0) {
    paymentPrice = paymentPrice.toFixed(2);
  } else {
    paymentPrice = 0;
  }
  paymentPrice = parseFloat(paymentPrice);
  if (canUseCoupon) {
    handleChoiceCoupon();
  }
  function handleChoiceCoupon() {
    let orderData = JSON.stringify(getPostData());
    if (state.useScore && !state.systemOptions.isBothScoreAndCoupon) {
      uni.showModal({
        title: '提示',
        content: '积分和优惠券不可同时使用',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            state.integral = 0;
            state.scoreDiscount = 0;
            state.scoreAmount = 0;
            state.useScore = false;
            orderData = JSON.stringify(getPostData());
            let opts = '?orderData=' + orderData + '&type=' + state.type + '&orderType=' + state.orderType + '&couponType=' + val.currentTarget.dataset.type;
            NAVPAGE.toChoiceCoupon(opts);
            // if (paymentPrice > 0) {
            // } else {
            //   wx.showToast({
            //     title: '商品实付金额已为0',
            //     icon: 'none',
            //     duration: 2000
            //   })
            // }
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    } else {
      if (val.currentTarget.dataset.type === 'freeship') {
        if (state.shipmentAmount > 0 && state.shipmentCouponDiscount >= 0) {
          let opts = '?orderData=' + orderData + '&type=' + state.type + '&orderType=' + state.orderType + '&couponType=' + val.currentTarget.dataset.type;
          NAVPAGE.toChoiceCoupon(opts);
          // if (paymentPrice > 0) {
          // } else {
          //   wx.showToast({
          //     title: '商品实付金额已为0',
          //     icon: 'none',
          //     duration: 2000
          //   })
          // }
        } else {
          uni.showToast({
            title: '商品已包邮',
            icon: 'none',
            duration: 2000
          });
        }
      } else {
        let opts = '?orderData=' + orderData + '&type=' + state.type + '&orderType=' + state.orderType + '&couponType=' + val.currentTarget.dataset.type;
        NAVPAGE.toChoiceCoupon(opts);
        // if (paymentPrice > 0) {
        // } else {
        //   wx.showToast({
        //     title: '商品实付金额已为0',
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
      }
    }
  }
}
function handleClick(val) {
  const self = this;
  let shipmentTypes = state.storeInfo.shipmentTypes;
  let res = null;
  console.log('type', val.currentTarget.dataset.type);
  if (val.currentTarget.dataset.type === 'dispatch' || val.currentTarget.dataset.type === "logistical") {
    if (shipmentTypes.indexOf('EXPRESS') >= 0 || shipmentTypes.indexOf('LOGISTICAL') >= 0) {
      const type = val.currentTarget.dataset.type;
      let shipmentType = "EXPRESS";
      if (val.currentTarget.dataset.type === 'dispatch') {
        shipmentType = "EXPRESS";
      } else if (val.currentTarget.dataset.type === 'logistical') {
        shipmentType = "LOGISTICAL";
      }
      let canDispatch = true;
      if (shipmentType === "EXPRESS" && distributionFee) {
        handleClickDispatch(distributionFee);
      } else if (shipmentType === "LOGISTICAL" && logisticalFee) {
        handleClickDispatch(logisticalFee);
      } else {
        const storeId = state.storeId;
        distributionService.get(storeId, shipmentType).then(res => {
          let resArr = res ? Object.keys(res) : [];
          if (res && resArr.length > 0) {
            if (shipmentType === "EXPRESS") {
              distributionFee = res;
            } else if (shipmentType === "LOGISTICAL") {
              logisticalFee = res;
            }
            handleClickDispatch(res);
          }
        }).catch(err => {
          utils.showToast(err.message);
        });
      }
      function handleClickDispatch(res) {
        // 获取配送费之后再进行计算券的操作
        state.type = type;
        state.canBuy = false;
        state.shipmentAmount = res.baseFare;
        checkDistribution();
        handleCardBalance();
      }
    } else {
      uni.showToast({
        title: '该门店暂不支持配送~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    // 切换配送方式时，如果选择了自提，需要清除已经选择的运费券信息
    state.type = 'selftake';
    state.canBuy = true;
    state.shipmentAmount = 0;
    state.shipmentRealPay = 0;
    state.shipmentDiscount = 0;
    state.shipmentCouponDiscount = 0;
    if (state.couponInfo.data.freeship.length > 0) {
      // 当前选择了运费券
      const freeship = state.couponInfo.data.freeship;
      let usedCoupons = state.usedCoupons;
      for (let i = 0; i < usedCoupons.length; i++) {
        const ele = usedCoupons[i];
        if (ele.couponId === freeship[0].coupon.id) {
          usedCoupons.splice(i, 1);
          break;
        }
      }
      state.couponInfo.data.freeship = [];
    }
    handleCardBalance();
  }

  //  切换配送方式 重新从后端获取配送时间
  // 切换配送方式 移除缓存的自提时间 (外卖和自提都需要获取配送时间)
  uni.removeStorageSync('wj_storePickupTime');
  if (state.type === 'selftake' || state.type === 'dispatch') getCalculateTime();
}
function getPostData() {
  const that = this;
  let products = [];
  state.goodsList.forEach(item => {
    let tempItem = {
      productId: item.productId,
      productNum: item.productNum,
      price: 0
    };
    if (state.offlinType === "cashReceipt") {
      tempItem = {
        ...tempItem,
        price: state.allPrice
      };
    }
    // 分享人id
    if (item.sharingPersonId) {
      tempItem = {
        ...tempItem,
        sharingPersonId: item.sharingPersonId
      };
    }
    if (item.groupProducts && item.groupProducts.length > 0) {
      tempItem.cateringOrderDetails = item.groupProducts;
    }
    if (state.scource === 'SHOPPINGCART') {
      tempItem = {
        ...tempItem,
        shoppingCartItemId: item.id
      };
    }
    if (item.newmbrActivityId) {
      tempItem = {
        ...tempItem,
        newmbrActivityId: item.newmbrActivityId
      };
      products.push(tempItem);
    } else if (item.grabActivityId) {
      tempItem = {
        ...tempItem,
        activityId: item.grabActivityId
      };
      products.push(tempItem);
    } else if (item.usePromotionPrice) {
      tempItem = {
        ...tempItem,
        usePromotionPrice: true
      };
      products.push(tempItem);
    } else if (item.useMemberPrice) {
      tempItem = {
        ...tempItem,
        useMemberPrice: true
      };
      products.push(tempItem);
    } else {
      products.push(tempItem);
    }
    // 如果该商品有赠品
    if (item.goodsPromotions && item.goodsPromotions.length > 0) {
      item.goodsPromotions.forEach(item => {
        products.push({
          giftProduct: true,
          productId: item.goods.uuid,
          productNum: item.count
        });
      });
    }
  });
  let postData = '';
  let tempSelfTime = null;
  let shipmentType = 'SELF';
  const shipmentRealPay = Number(state.shipmentRealPay);
  if (state.type === 'dispatch' || state.type === 'logistical') {
    shipmentType = 'EXPRESS';
    if (state.type === 'logistical') {
      shipmentType = 'LOGISTICAL';
    }
  } else {
    shipmentType = 'SELF';
    // 自提时间格式为yyyy-mm-dd HH:mm:ss~yyyy-mm-dd HH:mm:ss
    let tempTime = state.multiArray[1][state.multiIndex[1]];
    let tempTimeArr = tempTime.split('-');
    tempSelfTime = state.multiArray[0][state.multiIndex[0]] + ' ' + tempTimeArr[0] + ':00' + '~' + state.multiArray[0][state.multiIndex[0]] + ' ' + tempTimeArr[1] + ':00';
  }
  let paymentPrice = parseFloat(state.allPrice) - parseFloat(state.totalDiscount) + parseFloat(shipmentRealPay) - parseFloat(state.scoreDiscount);
  paymentPrice = paymentPrice > 0 ? paymentPrice.toFixed(2) : 0;
  let couponData = [];
  let externalCouponData = '';
  if (state.couponInfo.useCoupon) {
    if (state.usedCoupons.length > 0) {
      state.usedCoupons.forEach(item => {
        if (item.service === 'GM') {
          couponData.push(item.couponId);
        } else if (item.service === 'HD' || item.service === 'ZJIAN') {
          externalCouponData = item.couponId;
        }
      });
    }
  }

  // 查询本地缓存，是否有场景值‘_scene_’缓存,
  let fromScene = '';
  try {
    let scene = uni.getStorageSync('_scene_');
    if (scene) {
      // Do something with return value
      fromScene = '-' + scene;
    }
  } catch (e) {
    // Do something when catch error
  }
  let receiverMobile = state.memberInfo.mobile;
  if (state.addressInfo && state.addressInfo.contactsMobile && state.addressInfo.contactsMobile != null && state.addressInfo.contactsMobile !== "") {
    receiverMobile = state.addressInfo.contactsMobile;
  }
  postData = {
    allPrice: paymentPrice,
    // 应该支付的金额
    products: products,
    // 商品列表
    receiverMobile: receiverMobile,
    // 收货人手机号
    remark: state.remarks === '' ? '无' : state.remarks,
    // 备注
    scource: state.scource,
    // 来自购物车SHOPPINGCART 立即购买BUYNOW
    shipmentAmount: parseFloat(state.shipmentAmount),
    // 快递费
    shipmentType: shipmentType,
    // 配送方式
    selfTimeScope: state.storePickupTime,
    // 预约自提时间
    storeId: state.storeId,
    // 门店id
    couponIds: couponData,
    //券Id
    externalCouponNumber: externalCouponData,
    score: state.integral,
    orderSource: 'MINI_APP' + fromScene,
    lat: app.globalData.location ? app.globalData.location.latitude.toFixed(6) : '',
    lng: app.globalData.location ? app.globalData.location.longitude.toFixed(6) : ''
  };
  if (shipmentType === 'EXPRESS' || shipmentType === 'LOGISTICAL' || state.selfOrderShowAddress) {
    if (state.addressInfo) {
      postData = {
        ...postData,
        deliveryAddressId: state.addressInfo.id,
        // 收货地址id
        distributionDistance: state.distance,
        // 配送距离
        shipmentAmount: parseFloat(state.shipmentRealPay) + parseFloat(state.shipmentDiscount) + parseFloat(state.shipmentCouponDiscount),
        // 快递费
        deductibleShipmentAmonut: parseFloat(state.shipmentCouponDiscount) + parseFloat(state.shipmentDiscount)
      };
    } else {}
  }
  postData = {
    ...postData,
    scource: 'BUYNOW'
  };
  return postData;
}
function toChooseAddress() {
  let opts = '?from=perfectOrder';
  NAVPAGE.toAddressList(opts);
}
</script>
<style scoped>
/* pages/mallModule/score/scoreAddOrder/scoreAddOrder.wxss */

/* pages/perfectOrder/perfectOrder.wxss */

page {
  background-color: #f1f1f1;
  padding-bottom: 130rpx;
}

.color-5a5a5a {
  color: #5a5a5a;
}

.color-8B8B8C {
  color: #8b8b8c;
}

.color-666666 {
  color: #666;
}

.color-FF8561 {
  color: #ff8561;
}

.color-454545 {
  color: #454545;
}

.right-point {
  width: 12rpx;
  height: 23rpx;
  vertical-align: middle;
  margin-top: -6rpx;
  margin-left: 10rpx;
}

.top-info {
  width: 100%;
  padding: 0 40rpx;
  background: #fff;
  font-size: 28rpx;
  box-sizing: border-box;
}

.top-info .color-8B8B8C {
  height: 75rpx;
  line-height: 75rpx;
  border-bottom: 1px solid #f1f1f1;
}

.top-info .group-bg {
  width: 670rpx;
  height: 62rpx;
  margin: 30rpx 0;
  /* width: 750rpx;
  height: 133rpx;
  margin-left: -40rpx; */
}

.top-tips {
  width: 100%;
  padding: 0 26rpx;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  height: 60rpx;
  font-size: 28rpx;
  line-height: 60rpx;
  color: #fff;
  background: #ff918f;
  margin-bottom: 60rpx;
  z-index: 9;
}

.type-check-box {
  height: 110rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
}

.type-check-box>view {
  border: 1px solid;
  border-radius: 6rpx;
  height: 70rpx;
  width: 180rpx;
  font-size: 24rpx;
  line-height: 70rpx;
  margin-right: 38rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.type-check-box>view.active {
  border-color: #fbbe35;
  color: #fbbe35;
}

.type-check-box>view image {
  width: 33rpx;
  height: 33rpx;
  margin-right: 10rpx;
}

.type-check-box .self-take image {
  width: 25rpx;
  height: 36rpx;
}

.type-check-box>view:last-of-type {
  margin-right: 0;
}

.color-line {
  width: 100%;
  height: 10rpx;
  display: block;
}

.receive-box {
  display: flex;
  padding: 18rpx 0;
  background: #fff;
  border-top: 1rpx solid #f1f1f1;
}

.receive-box .icon-box {
  width: 53rpx;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  float: left;
}

.receive-box .icon-box image {
  width: 33rpx;
  height: 39rpx;
}

.receive-box .receive-info {
  width: 560rpx;
  height: 100%;
  font-size: 28rpx;
  line-height: 40rpx;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
}

.receive-box .receive-info .name-mobile text:first-of-type {
  margin-right: 22rpx;
  padding-right: 20rpx;
  position: relative;
}

.receive-box .receive-info .name-mobile text:first-of-type::after {
  content: '';
  height: 20rpx;
  background: #8b8b8c;
  width: 1px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -8rpx;
}

.receive-box .receive-info .receive-address {
  font-size: 24rpx;
  color: #454545;
}

.receive-box .iconright-box {
  width: 92rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
}

.receive-box .iconright-box image {
  width: 15rpx;
  height: 26rpx;
}

.goods-box {
  background: #fff;
  padding: 0 40rpx 10rpx 40rpx;
  margin: 20rpx 0;
}

.store-info {
  min-height: 100rpx;
  padding-top: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f1f1f1;
}

.store-info .store-details {
  width: calc(100% - 138rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.store-info .store-details text {
  display: block;
  text-align: left;
}

.store-info .store-details text:first-of-type {
  font-size: 34rpx;
  line-height: 46rpx;
  margin-bottom: 10rpx;
  font-weight: bold;
}

.store-info .store-details text:last-of-type {
  font-size: 26rpx;
  line-height: 36rpx;
}

.store-info .icon-right-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  color: #999;
}

.store-info .icon-right-box image {
  width: 15rpx;
  height: 26rpx;
  margin-left: 9rpx;
}

.store-info .store-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #454545;
}

.store-info .color-009F55 {
  font-size: 24rpx;
}

.store-info .open-map {
  font-size: 24rpx;
}

.goods-item-box {
  display: flex;
  flex-direction: column;
}

.goods-item {
  padding: 20rpx 0 0;
  border-bottom: 1rpx solid #f1f1f1;
  display: flex;
  justify-content: space-between;
}

.goods-item:last-of-type {
  border-bottom: none;
}

.goods-item .goods-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 6rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.goods-item .goods-img image {
  width: 100rpx;
  height: 100rpx;
}

.goods-item .goods-img .seckill-icon {
  position: absolute;
  width: 69rpx;
  height: 13rpx;
  top: 0;
  left: 0;
}

.goods-item .goods-img .stop-sell {
  position: absolute;
  width: 80rpx;
  height: 48rpx;
  font-size: 20rpx;
  line-height: 48rpx;
  color: #fff;
  text-align: center;
  left: 0;
  top: 50%;
  margin-top: -24rpx;
}

.goods-item .goods-info {
  /* height: 80rpx; */
  width: calc(100% - 109rpx);
  position: relative;
  display: flex;
  justify-content: space-between;
}

.goods-info .goods-left {
  max-width: 480rpx;
}

.goods-info .goods-right {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}

.goods-info .goods-name,
.goods-info .goods-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 480rpx;
  display: block;
  line-height: 40rpx;
}

.goods-info .goods-name {
  font-size: 28rpx;
  line-height: 40rpx;
  height: 40rpx;
  color: #454545;
  margin-top: 2rpx;
  font-weight: 400;
}

.goods-info .goods-desc {
  font-size: 20rpx;
  margin-top: 2rpx;
}

.goods-info .goods-count {
  font-size: 28rpx;
  color: #454545;
  /* line-height: 80rpx; */
  justify-content: flex-end;
  font-weight: bold;
}

.goods-price {
  font-size: 30rpx;
  margin-top: 12rpx;
  /* width: 200rpx; */
  /* line-height: 80rpx; */
  color: #454545;
  /* text-align: right; */
  /* margin-left: 24rpx; */
}

.goods-price .nowPrice {
  color: #f9a72a;
  font-weight: bold;
}

.goods-price .oldPrice {
  font-size: 20rpx;
  color: #454545;
  /* margin-left: 18rpx; */
  text-decoration: line-through;
}

.goods-info .goods-count-box {
  float: right;
  width: 135rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 44rpx;
  height: 44rpx;
  border: 1rpx solid #f1f1f1;
  margin-left: 20rpx;
}

.goods-info .goods-count-box text {
  background: #fff;
  color: #454545;
  font-size: 24rpx;
  width: 43rpx;
  height: 100%;
  text-align: center;
}

.goods-info .goods-count-box view {
  width: 46rpx;
  height: 46rpx;
  text-align: center;
  font-size: 40rpx;
  background: #f1f1f1;
  color: #009136;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 赠品相关 */

.gift-box {
  background: #fff6f0;
  min-height: 80rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #ff6131;
  padding: 0 40rpx;
  font-size: 24rpx;
  width: 750rpx;
  box-sizing: border-box;
  margin-left: -40rpx;
}

.gift-box view {
  display: flex;
  align-items: center;
}

.gift-box .gift-title {
  margin-right: 5rpx;
  height: 80rpx;
}

.gift-box .gift-item-box {
  width: calc(100% - 80rpx);
  display: flex;
  flex-direction: column;
}

.gift-box .gift-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 80rpx;
}

.gift-box .gift-item text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 380rpx;
}

.gift-img-box {
  width: 58rpx;
  height: 58rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  margin: 0 13rpx;
  border-radius: 6rpx;
}

.gift-img-box image {
  width: 100%;
  height: 100%;
}

.gift-box .gift-num {
  color: #ff3a00;
}

.section-box {
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  text-align: right;
  display: flex;
  justify-content: space-between;
}

.section-box view text {
  color: #f9a72a;
  font-weight: bold;
}

.dispatching-fee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #454545;
  font-size: 28rpx;
}

.dispatching-fee .left-icon {
  font-size: 26rpx;
  /* border: 1rpx solid; */
  font-weight: normal;
  border-radius: 6rpx;
  line-height: 40rpx;
  height: 40rpx;
  padding: 0 9rpx;
}

.score-coupon {
  background: #fff;
  padding: 0 40rpx;
  font-size: 28rpx;
  color: #454545;
  margin-bottom: 20rpx;
}

.score-coupon .score-box {
  padding: 32rpx 0;
  display: flex;
  justify-content: space-between;
}

.score-coupon .score-box .left text {
  font-size: 24rpx;
  margin-left: 16rpx;
}

.score-coupon .score-box image {
  width: 23rpx;
  height: 23rpx;
}

.score-coupon .score-box .right {
  display: flex;
  align-items: center;
  font-size: 24rpx;
}

.score-coupon .score-box .right .score-amount {
  color: #f9a72a;
  font-weight: bold;
  margin: 0 30rpx 0 20rpx;
  font-size: 28rpx;
}

.checkbox-icon {
  width: 32rpx;
  height: 32rpx;
  /* background: url('http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/xianfengImages/iconUnchecked.png') no-repeat center; */
  background-size: 100% 100%;
}

.checkbox-icon .active {
  width: 32rpx;
  height: 32rpx;
  /* background: url('https://app-1256684088.cos.ap-beijing.myqcloud.com/wxapp/iconChecked.png') no-repeat center; */
  background-size: 100% 100%;
}

.coupon-box {
  height: 85rpx;
  font-size: 28rpx;
  border-top: 1rpx solid #f1f1f1;
  line-height: 85rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  color: #454545;
}

.coupon-box .right-info {
  color: #8b8b8c;
}

.coupon-box .coupon-amount {
  color: #ff8561;
  font-weight: bold;
}

.coupon-box .right-point,
.integral-box .right-point {
  margin-left: 20rpx;
}

/* 账单明细 */

.bill-details {
  height: 80rpx;
  padding: 0 40rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.bill-details view:first-of-type {
  font-size: 24rpx;
  color: #8b8b8c;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  height: 100%;
  padding-right: 20rpx;
}

.bill-details view:first-of-type image {
  width: 23rpx;
  height: 23rpx;
  margin-left: 11rpx;
}

.balance-accounts {
  justify-content: flex-end;
  align-items: center;
  display: flex;
  font-size: 28rpx;
  color: #454545;
}

.balance-accounts text {
  font-size: 28rpx;
  color: #f9a72a;
  font-weight: bold;
  line-height: 86rpx;
}

.block-box {
  background: #fff;
  margin-bottom: 20rpx;
}

.integral-box {
  height: 90rpx;
  font-size: 30rpx;
  border-top: 1rpx solid #f4f5f9;
  line-height: 90rpx;
  background: #fff;
}

.integral-box text {
  float: left;
}

.integral-box .right-info {
  float: right;
}

.reserve-box {
  height: 90rpx;
  font-size: 26rpx;
  border-top: 1rpx solid #f4f5f9;
  line-height: 90rpx;
  background: #fff;
  margin-left: 40rpx;
  /* overflow: hidden; */
}

.reserve-box switch {
  float: right;
  margin-right: 25rpx;
}

.reserve-box .wx-switch-input {
  width: 91rpx !important;
  height: 42rpx !important;
  border-radius: 20rpx !important;
  border: 2rpx solid #ccc !important;
}

.reserve-box .wx-switch-input::before {
  width: 87rpx !important;
  height: 38rpx !important;
}

.reserve-box .wx-switch-input::after {
  width: 19rpx !important;
  height: 19rpx !important;
  background-color: #ccc;
  margin-top: 10rpx;
  margin-left: 11rpx;
  box-shadow: none;
}

.reserve-box .wx-switch-input-checked::after {
  width: 29rpx !important;
  height: 28rpx !important;
  background-color: #0198ff;
  margin-top: 6rpx;
  box-shadow: none;
}

.remarks-box {
  background: #fff;
  font-size: 28rpx;
  color: #454545;
}

.remarks-title {
  line-height: 64rpx;
  padding-top: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 40rpx;
}

.remarks-title .right-icon {
  height: 100%;
  padding: 0 40rpx;
}

.remarks-title image {
  width: 25rpx;
  height: 25rpx;
}

.remarks-info {
  line-height: 48rpx;
  padding: 0 40rpx 48rpx 40rpx;
}

.coupon-box text,
.reserve-box text,
.integral-box text {
  float: left;
}

.coupon-box .right-info,
.integral-box .right-info {
  float: right;
}

.coupon-text {
  color: #999;
}

.payment-remarks {
  background: #fff;
  font-size: 26rpx;
  margin-bottom: 20rpx;
}

.payment-method,
.remarks {
  height: 90rpx;
  line-height: 90rpx;
  margin-left: 40rpx;
}

.payment-method {
  border-bottom: 1rpx solid #f4f5f9;
}

.payment-method text:last-of-type {
  float: right;
  margin-right: 30rpx;
}

.remarks .remarks-info {
  float: right;
  color: #9c9c9c;
}

.price-detail {
  background: #fff;
  padding: 20rpx 30rpx 20rpx 40rpx;
  font-size: 30rpx;
  line-height: 54rpx;
}

.price-detail view text:last-of-type {
  float: right;
  color: #ff2126;
}

.bottom-box {
  width: 100%;
  height: 120rpx;
  padding: 10rpx 38rpx 10rpx 27rpx;
  box-sizing: border-box;
  font-size: 32rpx;
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  background: #fff;
  border-top: 1rpx solid #dcdcdc;
  display: flex;
  justify-content: space-between;
}

.bottom-box .btn {
  float: right;
  width: 325rpx;
  height: 100rpx;
  color: #fff;
  text-align: center;
  line-height: 100rpx;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 6rpx;
  padding: 0;
}

.bottom-box .unavailable {
  background: #ccc;
}

.bottom-box .order-price {
  float: left;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 24rpx;
  color: #454545;
  line-height: 48rpx;
  font-weight: bold;
}

.bottom-box>view text {
  display: block;
}

.bottom-box>view text:first-of-type {
  color: #ff7121;
  font-size: 40rpx;
  position: relative;
  padding-right: 22rpx;
  margin-right: 20rpx;
}

.bottom-box>view:first-of-type>view:last-of-type {
  font-size: 24rpx;
  color: #999;
}

.time-picker {
  width: 100%;
  background: #fff;
}

.time-picker>view {
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  border-top: 1rpx solid #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #454545;
  text-align: right;
  position: relative;
  /* padding-right: 36rpx; */
}

.time-picker>view view {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.time-picker>view .left-icon {
  width: 34rpx;
  height: 34rpx;
  margin: 0 12rpx 0 7rpx;
}

.time-picker text.self-time {
  margin-right: 40rpx;
}

.time-picker .right-point {
  margin-top: 0;
  margin-left: 30rpx;
}

.delivery-time-box {
  height: 150rpx;
  background: #fff;
  margin: 20rpx 0 0 0;
  padding: 22rpx 40rpx 26rpx 40rpx;
  box-sizing: border-box;
  border-bottom: 1px solid #f1f1f1;
}

.delivery-time-box text,
.store-info text {
  display: block;
}

.delivery-time-box .color-5a5a5a {
  font-size: 28rpx;
  line-height: 48rpx;
}

.delivery-time-box .self-time {
  font-size: 30rpx;
  line-height: 56rpx;
}

/* 拼团自提时间时间点样式 */

.time-point {
  padding: 6rpx 40rpx 0 40rpx;
  height: 90rpx;
}

.time-point .time-picker>view {
  border-top: none;
  padding-right: 0;
}

.time-point .right-point {
  margin-top: 0;
  margin-left: 30rpx;
}

.store-box {
  background: #fff;
  margin: 0 0 20rpx 0;
  padding: 22rpx 40rpx 26rpx 40rpx;
  position: relative;
}

.store-box .color-5a5a5a {
  font-size: 28rpx;
  line-height: 44rpx;
}

.store-box view.store-details {
  width: calc(100% - 138rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 6rpx;
}

.store-box view.store-details text {
  display: block;
  text-align: left;
}

.store-box view text:first-of-type {
  font-size: 40rpx;
  line-height: 46rpx;
  margin-bottom: 10rpx;
  font-weight: bold;
}

.store-box view text:last-of-type {
  font-size: 26rpx;
  line-height: 36rpx;
}

.store-box .icon-right-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 48rpx;
  top: 0;
  font-size: 24rpx;
  color: #999;
}

.store-box .icon-right-box image {
  width: 15rpx;
  height: 26rpx;
  margin-left: 9rpx;
}

.store-box {
  background: #fff;
  margin: 20rpx 0;
  padding: 22rpx 40rpx 26rpx 40rpx;
  position: relative;
}

.store-box .color-5a5a5a {
  font-size: 28rpx;
  line-height: 44rpx;
}

.store-box view.store-details {
  width: calc(100% - 138rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 14rpx;
}

.store-box view.store-details text {
  display: block;
  text-align: left;
}

.store-box view text:first-of-type {
  font-size: 30rpx;
  line-height: 42rpx;
  margin-bottom: 10rpx;
}

.store-box view text:last-of-type {
  font-size: 26rpx;
  line-height: 36rpx;
}

.store-box .icon-right-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 48rpx;
  top: 0;
  font-size: 24rpx;
  color: #999;
}

.store-box .icon-right-box image {
  width: 15rpx;
  height: 26rpx;
  margin-left: 9rpx;
}

/* 弹出框 */

.modal-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
}

.modal-body {
  position: relative;
}

.modal-content {
  background: #fff;
  width: 586rpx;
  /* height: 520rpx; */
  padding: 24rpx 0 0 0;
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  margin: 40% auto;
  position: relative;
}

.modal-body .modal-content.card {
  width: 480rpx;
  height: 320rpx !important;
  margin: 58% auto;
}

.modal-body .modal-content.score {
  min-height: 520rpx !important;
}

.modal-content .title {
  color: #777;
  font-size: 28rpx;
  line-height: 36rpx;
  text-align: center;
}

.modal-content .content {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #676666;
  padding: 0 40rpx;
  margin-top: 32rpx;
}

.modal-content .content .uesd {
  color: #ffaf61;
  margin-bottom: 18rpx;
}

.modal-content .content input {
  border: 1rpx solid #ffaf61;
  height: 74rpx;
  font-size: 28rpx;
  line-height: 74rpx;
  box-sizing: border-box;
  width: 100%;
  border-radius: 6rpx;
  padding: 0 0 0 24rpx;
  display: block;
}

.modal-content .content text {
  display: block;
  font-size: 28rpx;
  line-height: 36rpx;
}

.modal-content .content view {
  margin-top: 20rpx;
}

.modal-content .pay-box text:first-of-type {
  margin-bottom: 16rpx;
}

.modal-content .content .forget-password {
  font-size: 26rpx;
  line-height: 36rpx;
  float: right;
  color: #ffaf61;
  margin-top: 14rpx;
}

.button-box {
  display: flex;
  width: 100%;
  height: 80rpx;
  position: absolute;
  bottom: 0;
}

.button-box button {
  flex: 1;
  font-size: 26rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #fff;
  border-radius: 0;
  border: none;
}

button::after {
  border: none;
}

.button-box .confirm {
  color: #fff;
}

.button-box .cancel {
  box-sizing: border-box;
  color: #8a8989;
  border-top: 1rpx solid #e5e5e5;
}

.score-picker {}

.score-picker .picker {
  width: 460rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 10rpx;
  border: 2rpx solid #0198ff;
  box-sizing: border-box;
}

.score-amount {
  font-size: 28rpx !important;
  line-height: 42rpx;
  margin: 22rpx 0;
}

.modal-content .content .score-amount>text {
  color: #df1f1d;
  display: inline;
}

.score-explain {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
  color: #969696;
  margin-bottom: 16rpx;
}

.score-rule {
  font-size: 24rpx !important;
  line-height: 30rpx !important;
  color: #969696;
  padding-bottom: 105rpx;
}

.popup-content {
  width: 600rpx;
  border-radius: 6rpx;
  background: #fff;
  overflow: hidden;
  padding-top: 12rpx;
}

.popup-content .title {
  font-size: 32rpx;
  color: #454545;
  line-height: 80rpx;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
}

.popup-content-box {
  color: #454545;
}

.price-detail {
  padding: 0 32rpx;
  font-size: 30rpx;
  line-height: 77rpx;
  border-bottom: 1px solid #f1f1f1;
}

.price-detail view {
  border-bottom: 1px solid #f1f1f1;
  height: 77rpx;
}

.price-detail view text:last-of-type {
  float: right;
  color: #ff7171;
  border-bottom: none;
}

.realpay {
  text-align: right;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  background: #fff;
  padding: 0 32rpx;
}

.realpay text {
  color: #ff7171;
}

.popup-content .button {
  font-size: 28rpx;
  color: #fff;
  line-height: 84rpx;
  height: 84rpx;
  font-weight: bold;
  text-align: center;
}

.selftake-remind {
  font-size: 24rpx;
  line-height: 84rpx;
  background: #fff;
  padding-left: 40rpx;
}

.contact-store {
  justify-content: flex-start;
  align-items: center;
  margin-top: 10rpx;
}

.contact-store .tel {
  width: 34rpx;
  height: 38rpx;
  margin-right: 16rpx;
}

.contact-store view {
  width: calc(100% - 140rpx);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}

.store-box .section-box {
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  text-align: right;
  display: flex;
}

.store-box .section-box.contact-store text {
  font-weight: normal;
  line-height: 80rpx;
  font-size: 28rpx;
  /* font-weight: normal !important; */
  margin-bottom: none !important;
}

/* 弹出框 */

.number-modal-box {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 8;
}

.number-modal-body {
  position: relative;
}

.number-modal-content {
  background: #fff;
  width: 624rpx;
  padding: 36rpx 0 0 0;
  min-height: 356rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  /* margin: 40% auto; */
  position: relative;
}

.number-modal-content .title {
  color: #232222;
  font-size: 36rpx;
  line-height: 42rpx;
  text-align: center;
  font-weight: normal;
}

.number-modal-content .content {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #676666;
  padding: 0 40rpx;
  margin-top: 48rpx;
  display: flex;
  justify-content: center;
}

.number-modal-content .content .count-box {
  width: 354rpx;
  height: 80rpx;
  border: 1rpx solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
}

.number-modal-content .content .count-box>view {
  /* border: 1rpx solid #ddd; */
  width: 79rpx;
  height: 100%;
  text-align: center;
  font-size: 48rpx;
  line-height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-modal-content .content .count-box>input {
  width: 194rpx;
  height: 100%;
  border: none;
  text-align: center;
  padding: 0;
  color: #313131;
  font-size: 48rpx;
}

.number-modal-content .content .count-box>view:first-of-type {
  border-right: 1rpx solid #ddd;
}

.number-modal-content .content .count-box>view:last-of-type {
  border-left: 1rpx solid #ddd;
}

.number-modal-content .button-box {
  display: flex;
  width: 100%;
  height: 88rpx;
  position: absolute;
  bottom: 0;
}

.number-modal-content .button-box button {
  flex: 1;
  font-size: 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #fff;
  border-radius: 0;
  border: none;
}

.number-modal-content .button-box .confirm {
  color: #fff;
}

.number-modal-content .button-box .cancel {
  box-sizing: border-box;
  color: #8a8989;
  border-top: 1rpx solid #e5e5e5;
}

.popup-box {
  width: 660rpx;
  height: 440rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
}

.popup-title {
  width: 368rpx;
  height: 87rpx;
  margin: 0 auto;
  padding-top: 30rpx;
  position: relative;
  font-size: 34rpx;
  color: #8b8b8c;
  line-height: 80rpx;
  text-align: center;
  overflow: hidden;
}

.receive-message {
  height: 80rpx;
  font-size: 34rpx;
  line-height: 80rpx;
  color: #8b8b8c;
  display: flex;
  max-width: 100%;
  margin-left: 50rpx;
}

.popup-button {
  position: absolute;
  bottom: 0;
  font-size: 32rpx;
  width: 100%;
  height: 110rpx;
  border-top: 2rpx solid #8b8b8c;
  display: flex;
}

.left-button {
  width: 50%;
  height: 100%;
  font-weight: 400;
  text-align: center;
  line-height: 110rpx;
  background-color: #fff;
  border-radius: 0 0 0 20rpx;
  border-right: 2rpx solid #8b8b8c;
}

.right-button {
  width: 50%;
  height: 100%;
  font-weight: 400;
  text-align: center;
  line-height: 110rpx;
  color: #fff;
  border-radius: 0 0 20rpx 0;
}

.popup-sellout-box {
  width: 660rpx;
  /* height: 440rpx; */
  padding-bottom: 140rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
}

.popup-sellout-title {
  width: 368rpx;
  height: 87rpx;
  margin: 0 auto;
  padding-top: 30rpx;
  position: relative;
  color: #1C1C1C;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 80rpx;
  text-align: center;
  overflow: hidden;
}

.popup-sellout-content {
  color: #1C1C1C;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 54rpx;
  padding: 20rpx 60rpx;
  text-align: left;
}

.popup-sellout-button {
  position: absolute;
  bottom: 0;
  font-size: 36rpx;
  width: 100%;
  height: 110rpx;
  display: flex;
}

.popup-sellout-button>view {
  width: 100%;
  height: 100%;
  font-weight: 400;
  text-align: center;
  line-height: 110rpx;
  color: #fff;
  border-radius: 0 0 20rpx 20rpx;
}


/* 账单明细 */
.bill-details1 {
  margin-top: 20rpx;
  height: 60rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.bill-details1 {
  border-top: 1px solid #ECECEC;
  border-bottom: 1px solid #ECECEC;
}
</style>