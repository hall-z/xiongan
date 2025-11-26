<template>
<!--pages/mallModule/order/waitPay/waitPay.wxml-->
<navigationBar :title1="state.navigationBarTitle"></navigationBar>
<view>
<view class="waitPay" v-if="state.order.status == '待付款' || state.order.status == '已取消' || state.orderStatus == '退款中'">
  <view class="top-info">
    <image class="icon-top-more" :src="state.imagesPath.iconOrderTopMore"></image>
    <view>
      <view class="top-tips">
        <view class="top">
          <view class="countdown waitPayfor">
            <text>待您支付</text>
            <view>
              <text>剩余时间 </text>
              <text>{{state.payTime}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="waitPay-point" v-if="state.order.shipmentType != 'SELF'">
      <text>邮寄配送至</text>
      <view>
        <text>{{state.order.contacts}}</text>
        <text>{{state.order.receiverMobile}}</text>
      </view>
      <view>
        <text>{{state.order.address}}</text>
      </view>
    </view>
    <view class="goods-box">
      <view class="goods-list" @click="toPennyDetails">
        <view class="goods-item-box" v-for="(item , index) in state.goodsList" :key="index" :hidden="index > 100 && !state.showMore">
          <view class="goods-item" v-if="!item.giftProduct">
            <view class="goods-img waitPay-img">
              <image :src="item.imageUrl" mode="widthFix"></image>
              <image class="seckill-icon" mode="widthFix" v-if="item.grabActivityId" :src="state.imagesPath.iconSeckillSeat"></image>
            </view>
            <view class="goods-info waitPay-info">
              <view class="goods-label waitPay-label" v-if="item.packagingLabelName">{{item.productBrandName}}</view>
              <view class="goods-name waitPay-name">{{item.name}}</view>
              <view class="goods-desc waitPay-desc">{{item.specs.length == 2 ? item.specs[0] + ' | ' + item.specs[1] : item.specs[0]}}</view>
              <view class="number-price">
                <view class="goods-price" v-if="state.order.business === 'SCORE'">
                  <text class="nowPrice">￥{{state.scorePayment ? state.scorePayment + '积分' : ''}}{{state.order.cashTotal && state.order.cashTotal > 0 ? '+' + state.order.cashTotal + '元' : ''}}</text>
                </view>
                <view class="goods-price" v-else>
                  <text class="nowPrice">￥{{item.price}}</text>
                </view>
                <view class="goods-count waitPay-count">
                  <text>x{{item.productNum}}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="pickup-store waitPay-store store_msg" v-if="state.order.shipmentType == 'SELF'">
            <view class="title">
              <text>门店地址</text>
              <text>{{item.productBrandFloor || ''}}{{item.productBrandNumberPlate || ''}}{{item.productBrandAddress || ''}}</text>
            </view>
            <view class="selftake-time color-454545">
              <text>自提时间</text>
              <text>{{item.selfTime}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="pickup-store waitPay-store" v-if="state.order.status === '待自提' || state.business == 'SCORE' && state.order.status == '已付款'">
      <view v-if="state.order.status === '待自提' || state.business == 'SCORE' && state.order.status == '已付款'">
        <view class="code-box">
          <view class="barcode-box" @click="showBarcode ? 'handleToBigBarcode' : ''">
            <view v-if="state.showBarcode">
              <canvas canvas-id="orderBarcode" :style="state.barcodeImageUrl ? '' : 'left: -999999rpx;'">
              <image :src="state.barcodeImageUrl" v-if="state.barcodeImageUrl"></image>
            </canvas></view>
            <view v-else>
              <image mode="widthFix" :src="state.imagesPath.iconOrderCode"></image>
            </view>
          </view>
          <text class="code-text" v-if="state.showBarcode">{{state.codeText}}</text>
          <text class="selfTime-text" v-if="!state.showBarcode">{{state.selfTimeText}}</text>
        </view>
        <view class="deliveryTimeStatement" v-if="state.deliveryTimeStatement">该订单内含有特殊可自提/配送时间商品，此类商品自提/配送时间以该商品描述为准</view>
      </view>
    </view>
    <view class="waitPay-line"></view>
    <view class="order-box waitPay-order">
      <view class="row">
        <text>支付方式</text>
        <text>微信支付</text>
      </view>
      <view class="row" v-if="state.order.status == '已取消'">
        <text>运费</text>
        <text>￥{{state.order.shipmentAmount}}</text>
      </view>
      <view class="row">
        <text>商品总额</text>
        <text>￥{{state.cashTotal}}</text>
      </view>
      <view class="row">
        <text>订单编号</text>
        <text>{{state.orderId}}</text>
      </view>
      <view class="row">
        <text>下单时间</text>
        <text>{{state.order.createTime}}</text>
      </view>
      <view class="row">
        <text>订单总额</text>
        <text>￥{{state.cashTotal}}</text>
      </view>
    </view>
  </view>
  <!-- <recommendList dateCount="5"></recommendList> -->
  <view class="waitPay-button-box">
    <view>
      <text>共{{state.order.buyNumber}}件商品</text>
      <text>￥{{state.cashTotal}}</text>
    </view>
    <button class="payment" @click="toCardPay" :data-id="state.orderId">去支付</button>
  </view>
</view>
</view>
</template>
<script setup>
import _utilsSubscribeMessageJs from "@/utils/newretail/subscribeMessage";
import _utilsLogJs from "@/utils/newretail/log";
import _apiSolitaireServiceJs from "@/service/api/newretail/solitaireService";
import _apiInvoiceServiceJs from "@/service/api/newretail/invoiceService";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiRaffleServiceJs from "@/service/api/newretail/raffleService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiPennyServiceJs from "@/service/api/newretail/pennyService";
import _apiAdvanceSellServiceJs from "@/service/api/newretail/advanceSellService";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsSelfJs from "@/utils/newretail/self";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/orderDetails/orderDetails.js
const orderService = _apiOrderServiceJs;
const request = _apiRequestJs;
const wxbarcode = _utilsSelfJs;
const util = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const advanceSellService = _apiAdvanceSellServiceJs;
const pennyService = _apiPennyServiceJs;
const storeService = _apiStoreServiceJs;
const productService = _apiProductServiceJs;
const raffleService = _apiRaffleServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const systemService = _apiSystemServiceJs;
const invoiceService = _apiInvoiceServiceJs;
const solitaireService = _apiSolitaireServiceJs;
const log = _utilsLogJs;
const subscribeMessage = _utilsSubscribeMessageJs;
const state = reactive({
  navigationBarTitle: "待支付",
  imagesPath: IMGAGESPATH,
  orderId: '',
  memberName: '',
  mobile: '',
  goodsList: [],
  address: '',
  storeName: '',
  storeId: '',
  createTime: '',
  cashTotal: 0,
  remark: '',
  orderStatus: '',
  shipmentType: '',
  codeText: '',
  selfTimeScope: '立即到店',
  shipmentAmount: '0',
  isTeamBuy: false,
  isTeamShare: false,
  countDownList: {},
  teamMemberCount: '',
  joinMemberCount: '',
  teamPeopleCount: 0,
  joinPeopleCount: 0,
  joinMbrs: [],
  leaderImageUrl: '',
  teamMemberImageUrl: '',
  coupon: {
    price: '0',
    activityName: ''
  },
  cardPrice: '0',
  //储值卡金额
  scoreAmount: '0',
  //抵扣积分
  giftCardAmount: 0,
  //礼品卡金额
  serviceTel: '',
  canRefund: true,
  isDistribution: false,
  trackingCom: '',
  trackingNumber: '',
  teamBuyEnd: false,
  teamStatus: 'normal',
  //success 成团  fail 失败 ongoing  进行中 normal 正常的
  orderType: 'normal',
  //normal  advanceSell 预售
  balanceEnable: true,
  balanceTotal: 0.00,
  business: 'RETAIL',
  deductibleShipmentAmonut: 0,
  shipmentCouponDiscount: 0,
  payTime: 10,
  payTimeId: 0,
  groupTimeId: 0,
  hasRefund: false,
  order: {},
  orderData: null,
  // 订单数据 
  payType: "normal",
  // normal,payTail
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false
  },
  storeInfo: {},
  canRaffle: false,
  raffleId: '',
  raffleType: "LHJ",
  supportPartReturn: true,
  showBarcode: true,
  selfTimeText: '',
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  canShowService: false,
  homeBack: false,
  pennyInstance: null,
  prefix: '',
  // 前缀
  isOpenCustomerService: false,
  showBigBarcode: false,
  bigBarcode: '',
  scorePayment: '',
  deliveryTimeStatement: false,
  invoice: '',
  showInvoice: false,
  barCodeTime: '',
  supportInvoice: false,
  advanceSellTime: {},
  showMore: false,
  barcodeImageUrl: "",
  canOneMore: false
});
function codeTextPartition(val) {
  val = val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
  console.log(val, "处理过的编码");
  return val;
}
function handleOrderStatus(status) {
  if (status === "CREATED") {
    return "待付款";
  } else if (status === "PAID") {
    return "已付款";
  } else if (status === "SHIPPED") {
    return "配送中";
  } else if (status === "RECEIVED") {
    return "待评价";
  } else if (status === "FINISHED") {
    return "已完成";
  } else if (status === "CANCELED") {
    return "已取消";
  } else if (status === "REJECTED") {
    return "已退款";
  } else if (status === "RETURNING") {
    return "退款中 ";
  } else if (status === "PENDING") {
    return "待自提";
  } else if (status === "WAITSHIPPED") {
    return "待发货";
  } else if (status === "WAITPAYBALANCE") {
    return "待付尾款";
  } else if (status === "PARTREJECTED") {
    return "部分退款";
  } else if (status === "PAYFAILED") {
    return "支付失败";
  } else {
    return status;
  }
}
function getOrderDetails() {
  let orderId = options.orderId;
  let self = this;
  orderService.getDetailsById(orderId).then(res => {
    if (res) {
      let orderCanRefund = true;
      let itemStatus = res.status;
      let cashTotal = res.cashTotal ? res.cashTotal.toFixed(2) : "0.00";
      let orderAmount = res.orderAmount ? res.orderAmount.toFixed(2) : "0.00";
      // 处理预售订单付完全款
      if (res.business == "ADVANCE_SELL" && res.status == "WAITPAYBALANCE") {
        getAdvanceSellActivityById(res.advanceId, res.products[0].productId);
        if ((res.balanceTotal || res.balanceTotal === 0) && res.balanceTotal != null) {
          // 业态为预售且状态不是待付尾款
          cashTotal = (parseFloat(cashTotal) + res.balanceTotal).toFixed(2);
          orderAmount = (parseFloat(orderAmount) + res.balanceTotal).toFixed(2);
        }
        if (res.shipmentType === "SELF" && res.selfTimeScope) {
          let now = new util.ResponseDate().getTime();
          // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
          let reg = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
          if (reg.test(res.selfTimeScope)) {
            let timeScope = res.selfTimeScope;
            let timeArr = timeScope.split("~");
            let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
            if (now >= selfStartTime) {
              // 已过自提时间不能退款
              orderCanRefund = false;
            }
          }
        }
      }
      res.payments.forEach(el => {
        if (el.payMethod === 'SCOREPAY') {
          state.scorePayment = el.score;
        }
      });
      let shipmentCouponDiscount = 0;
      if (res.payments) {
        res.payments.forEach(i => {
          if (i.payMethod === "COUPONPAY" && i.total !== res.deductibleShipmentAmonut && i.status !== "CREATE" && (!i.couponFunction || i.couponFunction !== "FREESHIP")) {
            state.coupon = {
              price: i.total,
              activityName: i.couponActivityName
            };
          } else if (i.payMethod === "COUPONPAY" && i.couponFunction === "FREESHIP" && i.status !== "CREATE") {
            state.shipmentCouponDiscount = i.total;
            shipmentCouponDiscount = i.total;
          } else if (i.payMethod === "CARDPAY") {
            state.cardPrice = i.total;
          } else if (i.payMethod === 'SCOREPAY') {
            state.scoreAmount = i.total;
            state.scorePayment = i.score;
          } else if (i.payMethod === 'GIFTCARDPAY') {
            state.giftCardAmount = i.total;
          }
        });
      }
      // 计算支付渠道优惠金额
      if (res.promotionTotalFee) {
        cashTotal = Number(cashTotal) - Number(res.promotionTotalFee) > 0 ? (Number(cashTotal) - Number(res.promotionTotalFee)).toFixed(2) : "0.00";
      }
      if (res.business === "ADVANCE_SELL" && res.status !== "WAITPAYBALANCE" && res.balanceTotal) {
        cashTotal = Number(cashTotal) + parseFloat(res.balanceTotal);
        cashTotal = cashTotal.toFixed(2);
      }
      // 重新计算运费显示
      let shipmentAmount = res.shipmentAmount;
      let deductibleShipmentAmonut = res.deductibleShipmentAmonut ? (res.deductibleShipmentAmonut + parseFloat(shipmentCouponDiscount)).toFixed(2) : 0;
      if (deductibleShipmentAmonut === 0 && parseFloat(shipmentCouponDiscount) > 0) {
        deductibleShipmentAmonut = parseFloat(shipmentCouponDiscount).toFixed(2);
      }
      shipmentAmount = parseFloat((parseFloat(shipmentAmount) - parseFloat(res.deductibleShipmentAmonut) - parseFloat(shipmentCouponDiscount)).toFixed(2)); // 显示的运费为实付运费加上运费券抵扣的运费
      shipmentAmount = shipmentAmount > 0 ? shipmentAmount.toFixed(2) : "0.00";
      let tempData = {
        ...res,
        status: handleOrderStatus(res.status),
        cashTotal: cashTotal,
        orderAmount: orderAmount,
        orderCanRefund: orderCanRefund,
        shipmentAmount: shipmentAmount
      };
      if (res.type === "SOLITAIRE") {
        if (res.solitaireRecordStatus === "NORMAL") {
          tempData.status = "接龙中";
        } else if (res.type === "SOLITAIRE" && (tempData.status === "退款中" || tempData.status === "已退款")) {
          tempData.status = "接龙失败，" + tempData.status;
        } else if (res.solitaireRecordStatus === "REFUND") {
          tempData.status = "接龙失败，已退款";
        }
      }
      let storeInfo = null;
      try {
        let allStores = uni.getStorageSync('wj_allStores');
        if (allStores && allStores.length > 0) {
          for (let i = 0; i < allStores.length; i++) {
            const item = allStores[i];
            if (item.id == res.storeId) {
              storeInfo = item;
              break;
            }
          }
          state.storeInfo = storeInfo;
        }
      } catch (e) {
        console.log(e);
      }
      // 处理购物抽奖订单显示联系客服
      if (res.type === "PENNY" && (res.status === "WAITSHIPPED" || res.status === "PENDING") && res.canRefund) {
        getPennyInfo(res);
      }
      getStoreById(res.storeId);
      let tempProducts = [];
      let time1 = null;
      storeService.getById(1001).then(res1 => {
        time1 = res1.storeHours.replace('-', '~');
      });
      res.products.forEach(item => {
        // 处理多规格商品规格
        let nameArr = item.name ? item.name.split("x") : [];
        let specs = [];
        let name = [];
        if (nameArr.length > 0) {
          nameArr.forEach((item, i) => {
            if (i === 0) {
              name.push(item);
            } else {
              specs.push(item);
            }
          });
        }
        let price = item.price ? item.price.toFixed(2) : 0;
        // 处理预售订单付完全款
        if (res.business === "ADVANCE_SELL" && res.status !== "WAITPAYBALANCE" && item.balanceTotal && item.balanceTotal != null) {
          // 业态为预售且状态不是待付尾款
          price = (parseFloat(price) + item.balanceTotal).toFixed(2);
        }
        let tempItem = {
          ...item,
          name: name,
          price: price,
          specs: specs,
          refundAmount: 0 // 该商品退款数量
        };
        if (app.globalData.systemConfigure.fictitiousProductId && item.productId === app.globalData.systemConfigure.fictitiousProductId) {
          // 虚拟商品
          tempItem.name = "无码商品";
          tempItem.imageUrl = state.imagesPath.iconOffLine;
        }
        tempProducts.push(tempItem);
        if (item.deliveryTimeStatement) {
          state.deliveryTimeStatement = true;
        }
      });
      let canOneMore = true;
      if (res.type === "TEAMBUING" || res.type === "ADVANCE_SELL" || res.type === "SCORE_PRICE" || res.type === "BARGIN" || res.type === "OFFLINE" || res.type === "PENNY") {
        canOneMore = false;
      }
      state.order = tempData;
      state.orderId = res.id;
      state.business = res.business;
      state.memberName = res.memberName ? res.memberName : '';
      state.mobile = res.receiverMobile;
      state.goodsList = tempProducts;
      state.address = res.province + res.city + res.district + res.address;
      state.storeName = res.storeName;
      state.storeId = res.storeId;
      state.createTime = res.createTime;
      state.cashTotal = cashTotal;
      state.orderAmount = orderAmount;
      state.cashDeductTotal = res.cashDeductTotal;
      state.canRefund = res.canRefund;
      state.remark = res.remark;
      state.orderStatus = handleOrderStatus(itemStatus);
      state.deductibleShipmentAmonut = deductibleShipmentAmonut;
      state.storeAddress = res.storeAddress;
      state.selfTimeScope = res.selfTimeScope ? res.selfTimeScope : '';
      state.shipmentType = res.shipmentType;
      state.shipmentAmount = shipmentAmount;
      state.teamId = res.teamId ? res.teamId : '';
      state.teamLeaderRecordId = res.teamLeaderRecordId ? res.teamLeaderRecordId : '';
      state.advanceId = res.advanceId ? res.advanceId : '';
      state.hasRefund = res.hasRefund;
      state.canOneMore = canOneMore;
      tempProducts.forEach(async item => {
        await productService.brandGetById({
          id: item.productBrandId
        }).then(res1 => {
          let nowDate1 = new Date(new Date().getTime() + res1.effectiveDate * 1000 * 60 * 60 * 24);
          let nowDate2 = new Date(new Date().getTime() + (res1.effectiveDate + res1.duration) * 1000 * 60 * 60 * 24);
          let y = nowDate1.getFullYear();
          let m = nowDate1.getMonth() + 1 >= 10 ? nowDate1.getMonth() + 1 : '0' + (nowDate1.getMonth() + 1);
          let d = nowDate1.getDate() ? nowDate1.getDate() : '0' + nowDate1.getDate();
          // let y1 = nowDate2.getFullYear();
          let m1 = nowDate2.getMonth() + 1 >= 10 ? nowDate2.getMonth() + 1 : '0' + (nowDate2.getMonth() + 1);
          let d1 = nowDate2.getDate() >= 10 ? nowDate2.getDate() : '0' + nowDate2.getDate();
          item.selfStartTime = y + '年' + m + '月' + d + '日';
          item.selfEndTime = m1 + '月' + d1 + '日' + time1;
          item.selfTime = item.selfStartTime + '-' + item.selfEndTime;
          state.goodsList = tempProducts;
        });
      });

      // 付款倒计时
      if (res.status === 'CREATED') {
        if (!queryAgain) {
          getAutoCancelPeriod(res.createTime);
        } else {
          // 标记为已作废
          state.order.status = "已取消";
          uni.navigateTo({
            url: '../orderDetails/orderDetails?orderId=' + res.id
          });
        }
      }
      if (res.trackingCom && res.trackingNumber) {
        state.trackingCom = res.trackingCom;
        state.trackingNumber = res.trackingNumber;
      }
      // 生成自提码
      if (res.shipmentType === "SELF" && res.ladingCode != '' && res.ladingCode != null) {
        // 排除团购情况和接龙
        if (!(itemStatus === "PENDING" && res.teamId != '' && res.teamId != null && res.canRefund) && res.type !== "SOLITAIRE") {
          // 自提订单根据自提时间显示
          const orderHiddenLadingCode = app.globalData.systemConfigure.orderHiddenLadingCode;
          if (orderHiddenLadingCode) {
            let now = new util.ResponseDate().getTime();
            // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
            // 正则自提校验时间格式2  2018-12-20
            // 正则自提校验时间格式3  2018-11-07 09:21-12:00
            let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
            let reg2 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))$/;
            let reg3 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})\-(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})$/;
            if (reg1.test(res.selfTimeScope)) {
              let timeScope = res.selfTimeScope;
              let timeArr = timeScope.split("~");
              let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
              if (now >= selfStartTime) {
                getBarcodeCode(state.prefix + state.order.ladingCode);
              } else {
                // 处理不显示自提码时提示
                state.showBarcode = false;
              }
            } else if (reg2.test(res.selfTimeScope)) {
              // 默认显示当前的自提时间
              let oldTime = res.selfTimeScope + " 00:00:00";
              let selfStartTime = new Date(oldTime.replace(/-/g, '/')).getTime();
              if (now >= selfStartTime) {
                getBarcodeCode(state.prefix + state.order.ladingCode);
              } else {
                // 处理不显示自提码时提示
                state.showBarcode = false;
              }
            } else if (reg3.test(res.selfTimeScope)) {
              let timeScope = res.selfTimeScope;
              let timeArr = timeScope.split(" ");
              let timeArray = timeArr[1].split("-");
              let time = timeArr[0] + " " + timeArray[0] + "00";
              let selfStartTime = new Date(time.replace(/-/g, '/')).getTime();
              if (now >= selfStartTime) {
                getBarcodeCode(state.prefix + state.order.ladingCode);
              } else {
                // 处理不显示自提码时提示
                state.showBarcode = false;
              }
            } else {
              getBarcodeCode(state.prefix + res.ladingCode);
            }
          } else {
            // 不隐藏普通订单自提码
            getBarcodeCode(state.prefix + res.ladingCode);
          }
        }
      }
      // 处理自提时间
      if (res.shipmentType === "SELF" && res.type !== "SOLITAIRE") {
        // 自提时间处理
        // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
        // 正则自提校验时间格式2  2018-12-20
        // 正则自提校验时间格式3  2018-11-07 09:21-12:00
        let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
        let reg2 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))$/;
        let reg3 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})\-(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})$/;
        if (reg1.test(res.selfTimeScope)) {
          let timeScope = res.selfTimeScope;
          let timeArr = timeScope.split("~");
          let startArray = timeArr[0].split(" ");
          let endArray = timeArr[1].split(" ");
          let daysArr = startArray[0].split("-");
          let daysArrEnd = endArray[0].split("-");
          let startDate = daysArr[1] + '月' + daysArr[2] + '日';
          let endDate = daysArrEnd[1] + '月' + daysArrEnd[2] + '日';
          let selfTime = startArray[1].slice(0, 5) + '-' + endArray[1].slice(0, 5);
          let orderSelfTime = '';
          if (startDate == endDate) {
            if (res.teamId != '' && res.teamId != null) {
              // 拼团
              orderSelfTime = '自提时间：' + startDate + selfTime;
            } else {
              orderSelfTime = startDate + selfTime;
            }
          } else {
            // 日期不同一定是拼团
            if (res.teamId != '' && res.teamId != null) {
              // 拼团
              orderSelfTime = '自提时间：' + startDate + '-' + endDate + ' ' + selfTime;
            } else {
              // 可能是预售
              orderSelfTime = startDate + '-' + endDate + ' ' + selfTime;
            }
          }
          state.selfTimeScope = orderSelfTime;
        } else if (reg2.test(res.selfTimeScope)) {
          // 默认显示当前的自提时间
          let oldTime = res.selfTimeScope;
          let daysArr = oldTime.split("-");
          let startDate = daysArr[1] + '月' + daysArr[2] + '日';
          let orderSelfTime = '自提时间：' + startDate + ' ';
          if (state.storeInfo && state.storeInfo.storeHours) {
            orderSelfTime = orderSelfTime + state.storeInfo.storeHours;
          }
          console.log(orderSelfTime);
          state.selfTimeScope = orderSelfTime;
        } else if (reg3.test(res.selfTimeScope)) {
          let timeScope = res.selfTimeScope;
          let timeArr = timeScope.split(" ");
          let daysArr = timeArr[0].split("-");
          let timeArray = timeArr[1].split("-");
          let startDate = daysArr[1] + '月' + daysArr[2] + '日';
          let selfTime = timeArray[0].slice(0, 5) + '-' + timeArray[1].slice(0, 5);
          let orderSelfTime = '';
          if (res.teamId != '' && res.teamId != null) {
            // 所有拼团情况
            orderSelfTime = '自提时间：' + startDate + selfTime;
          } else {
            orderSelfTime = startDate + selfTime;
          }
          state.selfTimeScope = orderSelfTime;
        } else {}
      }

      // 接龙
      if (res.type === "SOLITAIRE") {
        if ((itemStatus === "PAID" || itemStatus === "WAITSHIPPED") && res.canRefund) {
          getSolitaireInfo(res.storeId);
        } else if (itemStatus === "PENDING") {
          getSolitaireInfo(res.storeId);
        }
      }
      if (res.canRefund === false && itemStatus !== 'REJECTED' && itemStatus !== 'PAYFAILED' && itemStatus !== 'CREATE') {
        if (res.type === "SOLITAIRE") {
          state.orderStatus = "接龙失败，退款中";
          state.order.status = '接龙失败，退款中';
        } else {
          state.isTeamBuy = false;
          state.orderStatus = "退款中";
          state.order.status = '退款中';
          state.isTeamShare = false;
        }
      }
      // 统配
      let distributionStore = [];
      try {
        let storeData = uni.getStorageSync('wj_distributionStore');
        if (storeData) {
          distributionStore.push(storeData);
        }
        distributionStore.forEach(item => {
          if (state.storeId === item.id) {
            state.isDistribution = true;
          }
        });
      } catch (e) {}
      // 预售
      if (res.advanceId && itemStatus === 'WAITPAYBALANCE') {
        state.balanceEnable = res.balanceEnable;
        state.balanceTotal = res.balanceTotal ? res.balanceTotal : '';
      }
      // 分享抽券
      if (res.status !== 'CREATED' && res.status !== 'CANCELED' && res.status !== 'REJECTED') {
        getRaffleStatus(res, self);
      }
    }
    if (state.onLoad) {
      state.onLoad = false;
    }
    // 查询订单关联的退款单
    getByOrder(orderId);
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toPayment() {
  const that = this;
  const order = state.order;
  const type = state.type;
  const payMethods = state.payMethods;
  let cardPay = false;
  let wxPay = false;
  payMethods.forEach(item => {
    if (item.name == 'CARDPAY' && item.checked) {
      cardPay = true;
    } else if (item.name == 'WXPAY' && item.checked) {
      wxPay = true;
    }
  });
  if (state.canBuy) {
    state.canBuy = false;
    if (cardPay) {
      // 储值卡支付
      inUserPay = false;
      state.modal = true;
    } else {
      if (wxPay) {
        // 判断是正常订单还是支付尾款
        if (type === 'payTail') {
          toPayTail(order);
        } else {
          if (order.type === "ADVANCE_SELL") {
            if (order.balanceTotal != null && order.balanceTotal > 0) {
              getUnifiedpay(order, "FIRST_ADVANCE_SELL");
            } else {
              getUnifiedpay(order);
            }
          } else {
            getWXPay(order);
          }
        }
      } else {
        state.canBuy = false;
        uni.showToast({
          title: '请选择支付方式~',
          icon: 'none',
          duration: 2000
        });
      }
    }
  } else {
    uni.showToast({
      title: '请选择支付方式~',
      icon: 'none',
      duration: 2000
    });
  }
}
function getWXPay(order) {
  const self = this;
  let total = parseFloat((parseFloat(order.cashTotal) - parseFloat(order.cardDeductTotal)).toFixed(2));
  total = total > 0 ? total : 0;
  let tempData = {
    orderId: order.id,
    payMethod: 'MALLCOO_PAY',
    entry: "ORDER",
    total: total
  };
  if (order.cashTotal === 0) {
    getOrderStatusById(order.id, self);
  } else {
    orderService.getCashPaySign(tempData).then(res => {
      wxPay(res, tempData);
    }).catch(err => {
      if (err.code === -1001) {
        // 请求超时
        if (state.payMethods[0].checked === true && state.payments.cardPay.total > 0) {
          orderLock(order);
        }
        toggle('middle');
      } else {
        state.canBuy = true;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
}
function getPay(order) {
  const self = this;
  if (order.cashTotal === 0) {
    // self.toPaymentSuccess(order.id)
    getOrderStatusById(order.id, self);
  } else {
    let postData = {
      orderId: order.id,
      total: state.payments.cardPay.total
    };
    let tempData = {};
    let password = state.password;
    if (password !== '') {
      postData = {
        ...postData,
        cardPayPassword: password,
        entry: "ORDER",
        payMethod: "CARDPAY"
      };
    }
    orderService.getCashPaySign(postData).then(res => {
      console.log(res);
      let total = parseFloat((parseFloat(order.cashTotal) - parseFloat(state.payments.cardPay.total)).toFixed(2));
      total = total > 0 ? total : 0;
      tempData = {
        orderId: order.id,
        payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
        entry: "ORDER",
        total: total
      };
      state.cardAmount = state.payments.cardPay.total;
      state.cardPayChoose = false;
      return orderService.getCashPaySign(tempData);
    }).then(res => {
      wxPay(res, tempData);
    }).catch(err => {
      if (err.code === 44004) {
        that.inUserPay = false;
        state.password = '';
        state.canBuy = true;
        state.focus = true;
        state.modal = true;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      } else if (err.code === -1001) {
        // 请求超时
        if (state.payMethods[0].checked === true && state.payments.cardPay.total > 0) {
          orderLock(order);
        }
        toggle('middle');
      } else {
        state.canBuy = true;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
}
function toCardPay() {
  // if (this.inUserPay) {
  //   console.log("已经在支付中")
  //   return;
  // }
  const that = this;
  const order = state.order;
  const orderType = state.orderType;
  const type = state.type;
  const payMethods = state.payMethods;
  let wxPay = true;
  // if (this.data.password !== '') {
  inUserPay = true;
  state.modal = false;
  if (type !== 'payTail') {
    if (state.balance >= order.cashTotal) {
      // 订单金额等于
      getCardPay(order);
    } else {
      if (wxPay) {
        getWXPay(order);
        // if (that.data.payments.cardPay.total > 0 && that.data.cardAmount === 0) {
        //   // 组合支付且订单没有使用过储值预付款
        //   that.getPay(order)
        // } else {
        //   // 微信支付

        // }
      } else {
        state.canBuy = false;
        uni.showToast({
          title: '请选择支付方式~',
          icon: 'none',
          duration: 2000
        });
      }
    }
  } else {
    if (state.balance >= order.balanceTotal) {
      // 储值卡金额等于尾款金额
      getCardPay(order);
    } else {
      state.canBuy = false;
      uni.showToast({
        title: '储值余额不够支付此订单，请选择微信支付~',
        icon: 'none',
        duration: 2000
      });
    }
  }
  // } else {
  //   wx.showToast({
  //     title: '请输入储值卡密码~',
  //     icon: 'none',
  //     duration: 2000
  //   })
  //   this.setData({
  //     focus: true
  //   })
  // }
}
function getCardPay(order) {
  const self = this;
  let postData = {
    orderId: order.id,
    total: order.cashTotal
  };
  let password = state.password;
  if (password !== '') {
    postData = {
      ...postData,
      cardPayPassword: password,
      entry: "ORDER",
      payMethod: "CARDPAY"
    };
  }
  orderService.getCashPaySign(postData).then(res => {
    getOrderStatusById(order.id, self);
    orderLock(order);
  }).catch(e => {
    if (e.code === 44004) {
      inUserPay = false;
      state.password = '';
      state.canBuy = true;
      state.focus = true;
      state.modal = true;
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    } else if (e.code === -1001) {
      // 请求超时
      orderLock(order);
      toggle('middle');
    } else {
      state.canBuy = true;
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    }
  });
  // self.orderLock(order)
}
function orderLock(order) {
  orderService.orderLock(order.id).then(res => {
    console.log(res);
  });
}
function getUnifiedpay(order, entry = "ORDER") {
  const self = this;
  let tempData = {
    orderId: order.id,
    payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
    entry: entry
  };
  if (entry === "FIRST_ADVANCE_SELL") {
    tempData = {
      ...tempData,
      total: order.cashTotal
    };
  } else {
    tempData = {
      ...tempData,
      total: order.cashTotal
    };
  }
  if (order.cashTotal === 0) {
    getOrderStatusById(order.id, self);
  } else {
    orderService.getCashPaySign(tempData).then(res => {
      wxPay(res, tempData);
    }).catch(err => {
      if (err.code === -1001) {
        // 请求超时
        if (state.payMethods[0].checked === true && state.payments.cardPay.total > 0) {
          orderLock(order);
        }
        toggle('middle');
      } else {
        state.canBuy = true;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
}
function toPaymentSuccess(orderId) {
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/order/order/order'
  });
  // this.setData({
  //   orderPay: true
  // })
  // if (this.data.orderType !== 'group') {
  //   if (this.data.order.type === "SOLITAIRE") {
  //     const solitaireId = this.data.order.solitaireId
  //     if (this.data.path === "perfectOrder") {
  //       try {
  //         wx.setStorageSync("wj_solitaire_" + solitaireId, {
  //           solitaireId: solitaireId
  //         });
  //       } catch (error) {
  //         console.log(error)
  //       }
  //       wx.navigateBack({
  //         delta: 1
  //       });
  //     } else {
  //       try {
  //         wx.setStorageSync("wj_solitaire_" + solitaireId, {
  //           solitaireId: solitaireId
  //         });
  //       } catch (error) {
  //         console.log(error)
  //       }
  //       const opts = "?id=" + solitaireId + "&from=order"
  //       NAVPAGE.toSolitaireDetails(opts);
  //     }
  //   } else {
  //     // wx.redirectTo({
  //     //   url: '/pages-sub/newretail/pages/mallModule/pay/payment/payment?orderId=' + orderId + '&from=' + this.options.from
  //     // })
  //   }
  // }
}
function wxPay(paySign, postData) {
  const self = this;
  let resData = JSON.parse(paySign);
  let sign = JSON.parse(resData.sign);
  let packageValue = sign.package ? sign.package : sign.packageValue;
  let templateIdsA = app.globalData.templateIds;
  // if (postData.payMethod === 'SWIFTPASS' || postData.payMethod === 'DINGFUTONG') {
  //   packageValue = sign.package
  // } else if (postData.payMethod === 'WX_MINI_APP' || postData.payMethod === 'WXA_ISV_PAY') {
  //   packageValue = sign.packageValue
  // }
  uni.requestPayment({
    'timeStamp': sign.timeStamp,
    'nonceStr': sign.nonceStr,
    'package': packageValue,
    'signType': sign.signType,
    'paySign': sign.paySign,
    'success': function (res) {
      let templateIds = [];
      if (templateIdsA.length > 0) {
        templateIdsA.forEach(itema => {
          if (itema.wxaTemplateType == 'ORDER_FINISH' || itema.wxaTemplateType == 'ORDER_SELF_NOTIFY' || itema.wxaTemplateType == 'ORDER_SHIP') {
            templateIds.push(itema.wxaTemplateId);
          }
        });
        console.log(templateIds, 'templateIds');
        if (uni.requestSubscribeMessage) {
          uni.requestSubscribeMessage({
            tmplIds: templateIds,
            success(res) {
              console.log(res);
              getOrderStatusById(postData.orderId, self);
              let order = {
                id: postData.orderId
              };
              orderLock(order);
            },
            fail(err) {
              console.log(err);
            }
          });
        } else {
          // log.warn('api wx.requestSubscribeMessage 当前版本不支持')
        }
      } else {
        uni.showToast({
          icon: 'none',
          title: '模板id未找到'
        });
      }

      // self.getOrderStatusById(postData.orderId, self)
      // let order = {
      //   id: postData.orderId
      // }
      // self.orderLock(order)
    },
    'fail': function (res) {
      console.log('支付失败-----------------');
      state.canBuy = true;
      if (res.errMsg.indexOf("cancel") >= 0) {
        // 取消订单
        uni.showToast({
          title: '您取消了支付订单~',
          icon: 'none',
          duration: 2000
        });
        state.password = '';
      } else {
        uni.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        });
      }
      if (options.from === 'shopCart') {
        state.orderCancel = true;
        uni.redirectTo({
          url: '/pages-sub/newretail/pages/mallModule/order/orderDetails/orderDetails?orderId=' + postData.orderId + '&orderFrom=shopCart'
        });
      }
    }
  });
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
      // utils.setHideLoading(false);
      uni.hideLoading();
      // 弹出支付超时
      self.toggle('middle');
      return;
    }
    if (result.status === 'PAID' || result.status === 'WAITPAYBALANCE' || result.status === 'PENDING' || result.status === 'WAITSHIPPED' || result.status === 'RECEIVED' || result.status === "SHIPPED" || result.status === 'STOCKING') {
      console.log('jinreu');
      // utils.setHideLoading(false);
      uni.hideLoading();
      uni.showToast({
        title: '支付成功',
        icon: 'none',
        duration: 2000
      });
      // 跳转到成功页面
      toPaymentSuccess(orderId);
    } else {
      let orderTimeId = setTimeout(() => {
        utils.setHideLoading(true);
        // 如果没有成功，调用函数本身，实现重复查询
        self.handleGetOrderStatusById(orderId, amount, self);
      }, 2000);
      state.orderTimeId = orderTimeId;
    }
  }).catch(err => {
    uni.showToast({
      title: err.errMsg,
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
function getBarcodeCode(ladingCode) {
  console.log(ladingCode, "订单编码");
  const self = this;
  if (!(state.order.status == '待自提' || state.business == 'SCORE' && state.order.status == '已付款')) {
    return;
  }
  if (!(ladingCode.indexOf(options.orderId) >= 0)) {
    return;
  }
  wxbarcode.barcode('orderBarcode', ladingCode, 710, 200);
  console.log("pixelRatio:", app.globalData.systemInfo.pixelRatio);
  const pixelRatio = app.globalData.systemInfo ? app.globalData.systemInfo.pixelRatio : 2;
  const barCodeTime = setTimeout(() => {
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 710,
      height: 200,
      destWidth: 710 * pixelRatio,
      destHeight: 200 * pixelRatio,
      canvasId: 'orderBarcode',
      success(res) {
        state.barcodeImageUrl = res.tempFilePath;
      },
      fail(err) {
        // canvasToTempFilePath fail
        const page = util.utilGetCurrentPage();
        if (page && page.route != null && page.route !== "" && page.route === "pages/mallModule/order/orderDetails/orderDetails") {
          state.barcodeImageUrl = "";
          getBarcodeCode(ladingCode);
        } else {
          console.log("不是订单详情页面");
        }
      }
    }, self);
  }, 500);
  state.codeText = codeTextPartition(ladingCode);
  state.barCodeTime = barCodeTime;
}
function getAutoCancelPeriod(createTime) {
  const self = this;
  orderService.getAutoCancelPeriod().then(res => {
    let date = new util.ResponseDate();
    let timeArray = [];
    let createTimeStamp = new Date(createTime.replace(/-/g, '/')).getTime();
    let now = new Date(util.formatTime(date)).getTime();
    if (now < createTimeStamp + parseFloat(res)) {
      // 获取倒计时
      // 将活动的结束时间参数提成一个单独的数组，方便操作
      let tempTime = {
        openTeamTime: createTime,
        duration: res / 1000
      };
      timeArray.push(tempTime);
      countDown();
    } else {
      // 标记为已作废
      if (order.status != '已取消') {
        state.order.status = "已取消";
        orderService.cancel(state.orderId).then(item => {
          uni.navigateTo({
            url: '../orderDetails/orderDetails?orderId=' + state.orderId
          });
        });
      } else {
        uni.navigateTo({
          url: '../orderDetails/orderDetails?orderId=' + state.orderId
        });
      }
    }
    // 执行倒计时函数
    function countDown() {
      clearTimeout(state.payTimeId);
      let hou = util.countDown(timeArray)[0].hou;
      let min = util.countDown(timeArray)[0].min;
      let sec = util.countDown(timeArray)[0].sec;
      let payTime = hou + ":" + min + ':' + sec;
      state.payTime = payTime;
      if (payTime === "00:00:00" && !queryAgain) {
        queryAgain = true;
        clearTimeout(state.payTimeId);
        orderService.cancel(state.orderId).then(item => {
          // wx.hideLoading();
          // self.getOrderDetails()
          uni.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 2000
          });
          uni.navigateTo({
            url: '../orderDetails/orderDetails?orderId=' + state.orderId
          });
        }).catch(err => {
          uni.navigateTo({
            url: '../orderDetails/orderDetails?orderId=' + state.orderId
          });
          // wx.hideLoading();
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
        // self.getOrderDetails(self.data.orderId)
      } else {
        let time = setTimeout(function () {
          countDown(timeArray);
        }, 1000);
        state.payTimeId = time;
      }
    }
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getRaffleStatus(order, that) {
  raffleService.getByType('ORDER_RAFFLE').then(res => {
    if (res) {
      if (app.globalData.userInfo) {
        let postData = {
          orderId: that.data.order.id,
          activityId: res.id,
          wxaOpenid: app.globalData.userInfo.wxaUser.openId
        };
        const data = res;
        raffleService.create(postData).then(res => {
          that.setData({
            canRaffle: true,
            raffleId: res,
            raffleActivityId: postData.activityId,
            raffleType: data.raffleType
          });
        }).catch(err => {
          that.setData({
            canRaffle: false
          });
        });
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
function getSolitaireInfo(storeId) {
  let self = this;
  let solitaireId = state.order.solitaireId;
  solitaireService.getById(solitaireId, storeId).then(res => {
    if (state.shipmentType === 'SELF') {
      // 自提订单才有自提码
      if (res.selfStartTime && res.selfEndTime) {
        // 自提开始时间和自提结束时间
        let now = new util.ResponseDate().getTime();
        let selfStartTime = new Date(res.selfStartTime.replace(/-/g, '/')).getTime();
        let selfEndTime = new Date(res.selfEndTime.replace(/-/g, '/')).getTime();
        let startTimeArr = res.selfStartTime.split(" ");
        let endTimeArr = res.selfEndTime.split(" ");
        let daysArrStart = startTimeArr[0].split("-");
        let daysArrEnd = endTimeArr[0].split("-");
        let startDate = daysArrStart[1] + '月' + daysArrStart[2] + '日';
        let endDate = daysArrEnd[1] + '月' + daysArrEnd[2] + '日';
        let orderSelfTime = '自提时间：' + startDate + '-' + endDate + ' ' + startTimeArr[1] + "-" + endTimeArr[1];
        // if (self.data.storeInfo.storeHours != null) {
        //   orderSelfTime = orderSelfTime + ' ' + self.data.storeInfo.storeHours
        // }
        state.selfTimeScope = orderSelfTime;
        if (state.groupOrderHiddenLadingCode) {
          if (now >= selfStartTime) {
            getBarcodeCode(state.prefix + state.order.ladingCode);
          } else {
            // 处理不显示自提码时提示
            state.showBarcode = false;
            state.selfTimeText = orderSelfTime;
          }
        } else {
          getBarcodeCode(state.prefix + state.order.ladingCode);
        }
      } else {
        // 自提订单根据自提时间显示
        let now = new util.ResponseDate().getTime();
        // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
        // 正则自提校验时间格式2  2018-12-20
        // 正则自提校验时间格式3  2018-11-07 09:21-12:00
        let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
        if (reg1.test(state.order.selfTimeScope)) {
          let timeScope = state.order.selfTimeScope;
          let timeArr = timeScope.split("~");
          let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
          if (state.groupOrderHiddenLadingCode) {
            if (now >= selfStartTime) {
              getBarcodeCode(state.prefix + state.order.ladingCode);
            } else {
              // 处理不显示自提码时提示
              state.showBarcode = false;
            }
          } else {
            getBarcodeCode(state.prefix + state.order.ladingCode);
          }
        } else {
          getBarcodeCode(state.prefix + state.order.ladingCode);
        }

        // 额外处理自提时间
        if (res.selfAfterDay || res.selfAfterDay === 0) {
          let timeScope = state.order.selfTimeScope;
          let timeArr = timeScope.split("~");
          let startArray = timeArr[0].split(" ");
          let daysArr = startArray[0].split("-");
          let startDate = daysArr[1] + '月' + daysArr[2] + '日';
          let orderSelfTime = '';
          orderSelfTime = '自提时间：' + startDate + "之后";
          state.selfTimeScope = orderSelfTime;
        }
      }
    }
  }).catch(err => {
    console.log(err.message);
  });
}
function getByOrder(orderId) {
  orderService.getByOrder(orderId).then(res => {
    if (res && res.length > 0) {
      let tempProducts = state.goodsList;
      res.forEach(item => {
        if (item.status === "FINISHED") {
          if (item.productDescription != null && item.productDescription != '') {
            let productDescription = JSON.parse(item.productDescription);
            item.refundDetails = productDescription;
          }
          // 只匹配已经完成的退款单
          item.refundDetails.forEach(ele => {
            for (let i = 0; i < tempProducts.length; i++) {
              const it = tempProducts[i];
              if (ele.productId === it.productId) {
                tempProducts[i].refundAmount = tempProducts[i].refundAmount + ele.productAmount;
                break;
              }
            }
          });
        }
      });
      state.goodsList = tempProducts;
    }
  });
}
function toGoodsDetails(val) {
  let opts = '?productId=' + val.currentTarget.dataset.id + '&storeId=' + state.storeId + '&type=normal';
  NAVPAGE.toGoodsDetails(opts);
}
function toCancel(val) {
  let self = this;
  let orderId = val.currentTarget.dataset.id;
  uni.showModal({
    title: '提示',
    content: '确认要取消该订单？',
    success: function (res) {
      if (res.confirm) {
        uni.showLoading({
          title: "处理中",
          mask: true
        });
        orderService.cancel(orderId).then(item => {
          uni.hideLoading();
          getOrderDetails();
          uni.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 2000
          });
        }).catch(err => {
          uni.hideLoading();
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      } else if (res.cancel) {}
    }
  });
}
function handleToBigBarcode() {
  const self = this;
  wxbarcode.barcode('orderBarcode', state.prefix + state.order.ladingCode, 710, 200);
  const pixelRatio = app.globalData.systemInfo ? app.globalData.systemInfo.pixelRatio : 2;
  uni.canvasToTempFilePath({
    x: 0,
    y: 0,
    width: 710,
    height: 200,
    destWidth: 710 * pixelRatio,
    destHeight: 200 * pixelRatio,
    canvasId: 'orderBarcode',
    success(res) {
      state.bigBarcode = res.tempFilePath;
    }
  }, self);
  if (uni.canIUse('setScreenBrightness')) {
    uni.setScreenBrightness({
      value: 1
    });
  } else {}
  state.showBigBarcode = true;
}
function handleToSmallBarcode() {
  if (uni.canIUse('setScreenBrightness')) {
    uni.setScreenBrightness({
      value: 0.4
    });
  } else {}
  state.showBigBarcode = false;
}
function toPay() {
  if (state.order.type === "PENNY") {
    // 处理购物抽奖订单
    state.orderData = state.order;
    state.payType = "penny";
  } else {
    let orderId = state.orderId;
    toPayMethod(orderId, 'normal');
  }
}
function toPayMethod(orderId, type) {
  let opts = '?orderId=' + orderId + '&from=order&type=' + type;
  NAVPAGE.toPayMethod(opts);
}
function toPayTail() {
  const that = this;
  const advanceId = state.advanceId;
  const goodsList = state.goodsList;
  let productId = null;
  if (goodsList.length > 0) {
    productId = goodsList[0].productId;
  }
  advanceSellService.getByIds(advanceId, productId).then(res => {
    function timeDivision(time) {
      const timeArray = time.split(' ');
      const timeSlot = timeArray[1].slice(0, 5);
      return timeSlot;
    }
    let now = new util.ResponseDate();
    let nowTimeStamp = new Date(util.formatTime(now)).getTime();
    const startTimeStamp = new Date(res.balanceStartTime.replace(/-/g, '/')).getTime();
    const endTimeStamp = new Date(res.balanceEndTime.replace(/-/g, '/')).getTime();
    const startTime = res.balanceStartTime.split(" ")[0];
    const startArray = startTime.split("-");
    const newStart = startArray[0] + '年' + startArray[1] + '月' + startArray[2] + '日';
    const endTime = res.balanceEndTime.split(" ")[0];
    const endArray = endTime.split("-");
    const newEnd = endArray[0] + '年' + endArray[1] + '月' + endArray[2] + '日';
    if (nowTimeStamp < startTimeStamp) {
      // 未到支付尾款时间
      if (newStart === newEnd) {
        timeSlot = timeDivision(startTime) + "~" + timeDivision(endTime);
        uni.showToast({
          title: '请于' + newStart + " " + timeSlot + '期间支付尾款',
          icon: 'none',
          duration: 2000
        });
      } else {
        uni.showToast({
          title: '请于' + newStart + ' - ' + newEnd + '期间支付尾款',
          icon: 'none',
          duration: 2000
        });
      }
    } else if (startTimeStamp <= nowTimeStamp && nowTimeStamp <= endTimeStamp) {
      // 支付尾款时间段内
      // that.toPayMethod(orderId, 'payTail')
      state.orderData = state.order;
      state.payType = "payTail";
    } else {
      // 已过支付尾款时间
      uni.showToast({
        title: '很抱歉，您的订单已经超过支付尾款的最后期限了~',
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function handleConfirmReceipt() {
  let self = this;
  let orderId = state.orderId;
  uni.showModal({
    title: '提示',
    content: '请确认已经收到商品？',
    success: function (res) {
      if (res.confirm) {
        orderService.confirm(orderId).then(item => {
          getOrderDetails();
        });
      } else if (res.cancel) {}
    }
  });
}
function toOrderTrajectory() {
  const that = this;
  let order = state.order;
  let orderId = order.id;
  let tempLocation = {
    user: {
      latitude: state.order.lat,
      longitude: state.order.lng
    },
    store: {
      latitude: state.storeInfo.latitude,
      longitude: state.storeInfo.longitude
    }
  };
  let storeInfo = JSON.stringify(state.storeInfo);
  let location = JSON.stringify(tempLocation);
  let opts = '?orderId=' + orderId + '&location=' + location + '&courierName=' + order.courierName + '&courierPhone=' + order.courierPhone + '&store=' + storeInfo;
  NAVPAGE.toOrderTrajectory(opts);
}
function toRefundGoods(val) {
  let orderId = val.currentTarget.dataset.id;
  function handleToRefundGoods() {
    let opts = '?orderId=' + orderId;
    NAVPAGE.toRefund(opts);
  }
  handleSubscriptionMessage(subscribeMessage.scene.REFUND, handleToRefundGoods);
}
function handleSubscriptionMessage(SCENE, originalOperation) {
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
function toRefundDetails(val) {
  let orderId = val.currentTarget.dataset.id;
  let opts = '?orderId=' + orderId;
  NAVPAGE.toRefundDetails(opts);
}
function toEvaluate(val) {
  let orderId = val.currentTarget.dataset.id;
  let opts = '?orderId=' + orderId;
  NAVPAGE.toEvaluate(opts);
}
function toService() {
  const that = this;
  handleSubscriptionMessage(subscribeMessage.scene.REFUND, handleOrderService);
  function handleOrderService() {
    let storeInfo = state.storeInfo;
    // 客服电话
    let servicePhone = null;
    if (app.globalData.servicePhone !== "") {
      servicePhone = app.globalData.servicePhone;
    }
    if (storeInfo.id != null) {
      let tel = '';
      if (storeInfo.tel != null && storeInfo.tel != '') {
        // 判断订单中门店是否有电话
        tel = storeInfo.tel;
      } else {
        // 门店无电话使用公司服务电话
        tel = app.globalData.servicePhone;
      }
      myMakePhoneCall(tel);
    } else {
      storeService.getById(storeInfo.id).then(res => {
        if (res) {
          let tel = '';
          if (res.tel != null && res.tel !== '') {
            tel = res.tel;
          } else {
            tel = servicePhone;
          }
          myMakePhoneCall(tel);
        } else {
          myMakePhoneCall(servicePhone);
        }
      }).catch(err => {
        myMakePhoneCall(servicePhone);
      });
    }
  }
}
function myMakePhoneCall(tel) {
  uni.showModal({
    title: '提示',
    content: '确定要拨打以下电话' + tel,
    confirmText: '拨打',
    success: function (res) {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: tel
        });
      } else if (res.cancel) {}
    }
  });
}
function none() {
  console.log("联系客服");
}
function toTrackingDetails() {
  let opts = '?orderId=' + state.order.id;
  NAVPAGE.toLogisticsInfo(opts);
}
function contactStore() {
  const that = this;
  let storeInfo = state.storeInfo;
  // 客服电话
  let servicePhone = null;
  if (app.globalData.servicePhone !== "") {
    servicePhone = app.globalData.servicePhone;
  }
  if (storeInfo.id != null) {
    let tel = '';
    if (storeInfo.tel != null && storeInfo.tel != '') {
      // 判断订单中门店是否有电话
      tel = storeInfo.tel;
    } else {
      // 门店无电话使用公司服务电话
      tel = app.globalData.servicePhone;
    }
    myMakePhoneCall(tel);
  } else {
    storeService.getById(storeInfo.id).then(res => {
      if (res) {
        let tel = '';
        if (res.tel != null && res.tel !== '') {
          tel = res.tel;
        } else {
          tel = servicePhone;
        }
        myMakePhoneCall(tel);
      } else {
        myMakePhoneCall(servicePhone);
      }
    }).catch(err => {
      myMakePhoneCall(servicePhone);
    });
  }
}
function getStoreById(id) {
  const self = this;
  let storeInfo = {
    tel: ''
  };
  storeService.getById(id).then(res => {
    storeInfo = res;
    state.storeInfo = storeInfo;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: none,
      duration: 2000
    });
  });
}
function viewStoreLocation() {
  let storeInfo = state.storeInfo;
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
function queryInvoice(orderId) {
  const insert = {
    page: 1,
    pageSize: 0,
    orderIdEquals: orderId
  };
  invoiceService.query(insert).then(res => {
    if (res.records[0]) {
      const invoice = {
        type: res.records[0].type,
        title: res.records[0].title,
        taxNumber: res.records[0].taxNumber
      };
      console.log(invoice, 'invoice');
      state.showInvoice = true;
      state.invoice = invoice;
    } else {
      state.showInvoice = false;
      return false;
    }
  }).catch(err => {
    util.showToast(err.message);
  });
}
onLoad(function (options) {
  queryAgain = false;
  console.log(app.globalData.configureInfo, "11111");
  firstInPage = true;
  uni.hideShareMenu();
  state.serviceTel = app.globalData.servicePhone;
  state.onLoad = true;
  state.themeColor = app.globalData.uiconfig.themeColor;
  if (app.globalData.uiconfig) {
    state.isOpenCustomerService = app.globalData.uiconfig.isOpenCustomerService;
  }
  app.globalData.configureInfo.forEach(item => {
    if (item.key === 'selfTakeCode') {
      console.log(item, "prefix");
      state.prefix = item.value ? item.value : '';
    }
  });
  let pageStack = getCurrentPages();
  if (pageStack.length === 1) {
    state.homeBack = true;
  }
  // 查询系统配置项，根据系统配置项退款显示
  let systemOptions = app.globalData.configureInfo;
  let supportPartReturn = true;
  systemOptions.forEach(item => {
    // 遍历配置项查询是否支持部分退款
    if (item.key === 'supportPartReturn' && item.value !== undefined) {
      item.value === 'TRUE' ? supportPartReturn = true : supportPartReturn = false;
      // supportPartReturn = item.value
    }
  });
  state.supportPartReturn = supportPartReturn;
  if (options.orderId) {
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      getOrderDetails();
      queryInvoice(options.orderId);
    }
  }
  // 获取当前页面分享图
  getSharePictures();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics('1001');
  }
});
onReady(function () {});
onShow(function () {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    if (state.orderId) {
      getOrderDetails();
    }
  } else {
    if (options.orderId) {
      state.orderId = options.orderId;
    }
    if (firstInPage) {
      firstInPage = false;
      NAVPAGE.toAuthorize();
    } else {
      uni.showModal({
        title: '温馨提示',
        content: '您还没有登录，请先登录授权',
        showCancel: false,
        confirmText: '去登陆',
        confirmColor: '#3CC51F',
        success: result => {
          if (result.confirm) {
            NAVPAGE.toAuthorize();
          }
        },
        fail: () => {},
        complete: () => {}
      });
    }
  }
});
onHide(function () {
  uni.hideLoading();
});
onUnload(function () {
  uni.hideLoading();
  clearTimeout(state.payTimeId);
  clearTimeout(state.groupTimeId);
  clearTimeout(state.barCodeTime);
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function (res) {
  const that = this;
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let storeData = JSON.stringify({
    storeId: state.storeId,
    storeName: state.storeName
  });
  const goods = state.goodsList;
  let sharePictures = '';
  if (state.sharePictures != null && state.sharePictures != 'null') {
    sharePictures = state.sharePictures;
  }
  if (goods.length > 0) {
    sharePictures = goods[0].imageUrl;
  }
  let raffleSharePictures = state.raffleSharePictures;
  if (groupSharePictures != null && groupSharePictures != 'null' && groupSharePictures !== '') {
    // 如果有拼团分享图片
    sharePictures = groupSharePictures;
  }
  if (res.from === 'button') {
    // 来自页面内转发按钮
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      let memberId = app.globalData.userInfo.member.id;
      if (res.target.dataset.sharetype === 'raffle') {
        if (raffleSharePictures !== '' && raffleSharePictures != null) {
          sharePictures = raffleSharePictures;
        }
        return {
          title: '优惠券大抽奖',
          path: '/pages-sub/newretail/pages/mallModule/activity/luckDraw/luckDraw?raffleId=' + state.raffleId + '&activityId=' + state.raffleActivityId + '&shareId=' + memberId + '&type=order&storeId=' + state.storeId + '&raffleType=' + state.raffleType,
          imageUrl: sharePictures,
          success(e) {
            console.log(e);
            uni.showShareMenu({
              withShareTicket: true
            });
          }
        };
      } else if (res.target.dataset.sharetype === 'penny') {
        sharePictures = state.pennyInstance.shareImageUrl ? state.pennyInstance.shareImageUrl : sharePictures;
        return {
          title: '麻烦点一下，只差一个人就拿到' + state.pennyInstance.productName + '了～',
          path: '/pages-sub/newretail/pages/mallModule/activity/penny/helpPenny/helpPenny?instanceId=' + state.pennyInstance.id,
          imageUrl: sharePictures,
          success(e) {
            uni.showShareMenu({
              withShareTicket: true
            });
          }
        };
      } else {}
    } else {
      return {
        title: '',
        path: '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + state.storeId,
        imageUrl: sharePictures,
        success(e) {
          uni.showShareMenu({
            withShareTicket: true
          });
        }
      };
    }
  } else {
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true
        });
      }
    };
  }
});
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures;
  }
  util.getSharePictures('RAFFLE_ACTIVITY').then(res => {
    state.raffleSharePictures = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toggleMiddlePopup() {
  toggle('middle');
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function getPennyInfo(order) {
  const that = this;
  const postData = {
    page: 1,
    pageSize: 1,
    memberIdEquals: app.globalData.userInfo.member.id,
    orderIdEquals: order.id,
    searchCount: true
  };
  pennyService.queryInstance(postData).then(res => {
    if (!res || !res.records || res.records.length === 0) {
      return;
    }
    if (res.records[0].status === "CREATE") {
      state.canShowService = true;
    }
    state.pennyInstance = res.records[0];
  }).catch(err => {
    util.showToast(err.message);
  });
}
function toHome() {
  NAVPAGE.toHome();
}
function toMoneyGoing() {
  const opts = state.order.id;
  NAVPAGE.toMoneyGoing(opts);
}
function toPennyDetails(val) {
  const order = state.order;
  const pennyInstance = state.pennyInstance;
  if (order && order.type === "PENNY") {
    const opts = "?instanceId=" + pennyInstance.id;
    NAVPAGE.toHelpPenny(opts);
  }
}
function shaerPenny() {
  subscriptionMessagePopup(subscribeMessage.scene.RAFFLE_PRIZED);
}
function subscriptionMessagePopup(types) {
  // 查询订阅消息
  if (app.globalData.templateIdsQuery) {
    handleSubscribeMessage();
  } else {
    subscribeMessage.getTemplateIds().then(res => {
      handleSubscribeMessage();
    }).catch(err => {
      console.log(err.message);
      log.warn("查询模板id报错：", err.message);
    });
  }
  function handleSubscribeMessage() {
    let templateIds = [];
    templateIds = subscribeMessage.handleTemplateIds(types);
    console.log(templateIds);
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res);
            subscribeMessage.addSubscribe(types, res);
            log.info(res);
          },
          fail(err) {
            console.log(err);
            log.warn(err);
          }
        });
      } else {
        log.warn('api wx.requestSubscribeMessage 当前版本不支持');
      }
    } else {
      log.info('模板id未获取到');
    }
  }
}
function getAdvanceSellActivityById(advanceId, productId) {
  const that = this;
  advanceSellService.getByIds(advanceId, productId).then(res => {
    function timeToArray(time) {
      const timeArray = time.split(' ');
      const timeList = timeArray[0].split('-');
      const newTime = timeList[1] + '月' + timeList[2] + '日';
      return newTime;
    }
    function timeDivision(time) {
      const timeArray = time.split(' ');
      const timeSlot = timeArray[1].slice(0, 5);
      return timeSlot;
    }
    let frontStartTime = timeToArray(res.frontStartTime);
    let frontEndTime = timeToArray(res.frontEndTime);
    let balanceStartTime = '';
    let balanceEndTime = '';
    let balanceDate = '';
    if (res.payType === 'PARTIAL') {
      balanceStartTime = timeToArray(res.balanceStartTime);
      balanceEndTime = timeToArray(res.balanceEndTime);
      balanceDate = balanceStartTime + " " + timeDivision(res.balanceStartTime) + '~' + balanceEndTime + " " + timeDivision(res.balanceEndTime);
      if (balanceStartTime === balanceEndTime) {
        balanceDate = balanceStartTime + " " + timeDivision(res.balanceStartTime) + '~' + timeDivision(res.balanceEndTime);
      }
    }
    console.log(frontStartTime, frontEndTime, balanceStartTime, balanceEndTime);
    state.advanceSellTime = {
      frontStartTime: frontStartTime,
      frontEndTime: frontEndTime,
      balanceStartTime: balanceStartTime,
      balanceEndTime: balanceEndTime,
      balanceDate: balanceDate
    };
  });
}
function copyOrderId() {
  const orderId = state.order.id;
  uni.setClipboardData({
    data: orderId,
    success(res) {
      uni.hideToast();
      uni.showToast({
        title: "复制成功！",
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function viewMore() {
  state.showMore = !state.showMore;
}
function oneMore(e) {
  const that = this;
  const orderId = state.order.id;
  const order = state.order;
  if (order && order.business === "DISTRIBUTION") {
    app.globalData.storeIdentification = 'distribution';
  } else {
    app.globalData.storeIdentification = 'normal';
  }
  app.globalData.parameter = {
    orderId: orderId,
    storeIdentification: app.globalData.storeIdentification,
    from: "oneMore"
  };
  NAVPAGE.toShopcart();
}
</script>
<style scoped>
/* pages/orderDetails/orderDetails.wxss */
page {
  /* background: #F4F4F4; */
}

.order {
  overflow-x: hidden;
  position: relative;
}

.color-454545 {
  color: #454545;
}

.color-009F55 {
  color: #009f55;
}

.color-f9a72a {
  color: #f9a72a;
}

.color-ff7171 {
  color: #ff7171;
}

.color-5a5a5a {
  color: #5a5a5a;
}

.daiziti {
  /* width: 231rpx;
  height: 58rpx; */
  font-size: 58rpx;
  font-family: SourceHanSerifCN-Regular, SourceHanSerifCN;
  font-weight: 400;
  color: #000000;
  line-height: 58rpx;
  margin-top: 85rpx;
  margin-bottom: 38rpx;
}

.top-tipsA {
  display: flex;
  justify-content: space-between;
}

.chushi {
  width: 173rpx;
  height: 50rpx;
  border-radius: 25rpx;
  border: 2rpx solid #000000;
  text-align: center;
  line-height: 50rpx;
}

.goods-imgA {
  width: 400rpx;
  height: 400rpx;
  margin: 0 auto;

}

.goods-imgB {
  width: 100%;
  height: 100%;
}
.pickup-storeA{
  width: 676rpx;
  /* padding: 27rpx 18rpx 30rpx 18rpx; */
  /* background: #fff; */
  /* border-radius: 4rpx; */
  margin: 0 auto 18rpx auto;
  display: flex;
  font-size: 25rpx;
  margin-top: 50rpx;

}
.btnA{
  width: 70rpx;
  height: 70rpx;
  text-align: center;
  line-height: 70rpx;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #000000;
  box-sizing: border-box;
  position: absolute;
  right: 4rpx;
  bottom: -91rpx;
}
.btnA>image{
  width: 30rpx;
  height: 30rpx;
}
.titleA{
  width: 227rpx;
  font-size: 27rpx;
}
.selftake-timea{
  margin-left: 100rpx;
}
.goods-infoA {
  margin-top: 50rpx;
  display: flex;
}
.left-a{
  display: inline-block;
  margin-right: 10rpx;
}
.right-a{
  display: inline-block;
  margin-left: 10rpx;
}
.number-price {
  margin-left: 100rpx;
  font-size: 27rpx;
  color: #000000;
}

.goods-boxA {
  width: 700rpx;
  height: 817rpx;
  background: #B5A388;
  margin: 0 auto;
  margin-top: 20rpx;
  padding: 0 25rpx;
  padding-top: 115rpx;
  box-sizing: border-box;
  position: relative;
}

.goods-nameA {
  width: 227rpx;
  font-size: 27rpx;
}

.color-999999 {
  color: #999;
}

.price-detail-item-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #454545;
  overflow: hidden;
}

.coupon-name-box {
  display: flex;
}

.price-detail-item-name .coupon-name {
  color: #454545;
  display: flex;
}

.price-detail-item-name .coupon-name text {
  color: #454545 !important;
  display: inline-block;
  max-width: 286rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
}

.price-detail-item-value {
  color: #ff7171;
  flex-shrink: 0;
}

.top-info {
  width: 712rpx;
  padding: 0 18rpx;
  margin: 0 auto 18rpx;
  background: #fff;
  font-size: 28rpx;
  box-sizing: border-box;
  position: relative;
}

.top-info .icon-top-more {
  width: 52rpx;
  height: 11rpx;
  position: absolute;
  left: 50%;
  margin-left: -26rpx;
  top: 8rpx;
}

.order-status {
  color: #242424;
  width: 100%;
  font-size: 36rpx;
  line-height: 56rpx;
  height: 56rpx;
  padding-top: 36rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-status image.right-icon {
  margin-left: 22rpx;
  width: 12rpx;
  height: 24rpx;
}

.top-tips .countdown {
  font-size: 28rpx;
  display: flex;
  justify-content: center;
  flex-direction: row;
}

.top-tips .countdown text:first-of-type {
  margin-right: 6rpx;
}

.top-tips {
  font-size: 28rpx;
  line-height: 42rpx;
  color: #000;
  display: flex;
  flex-direction: column;
  padding-top: 10rpx;
  padding-bottom: 6rpx;
}

.top-tips view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 4rpx;
}

.top-tips view text {
  font-size: 28rpx;
  text-align: center;
}

.top-tips view text.distribution {
  font-size: 24rpx;
  color: #096;
  font-weight: normal;
}

.top-tips .order-tips {
  font-size: 28rpx;
}

.top-button-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70rpx;
  padding-bottom: 40rpx;
}

.top-button-box button {
  background: #fff;
  width: 190rpx;
  height: 70rpx;
  padding: 0 20rpx;
  border: 2rpx solid #8b8b8c;
  color: #000000;
  font-size: 28rpx;
  font-family: Source Han Sans CN;
  font-weight: 500;
  line-height: 70rpx;
  margin: 0 18rpx 0 0;
  border-radius: 4rpx;
  box-sizing: border-box;
}

.top-button-box button:last-of-type {
  margin-right: 0;
}

.top-button-box button.payment,
.top-button-box button.to-invitation,
.top-button-box button.service {
  background-color: #009f55;
  color: #ffffff;
  border: 2rpx solid #009f55;
}

.top-button-box button::after {
  border: 0;
}

.right-point {
  width: 15rpx;
  height: 26rpx;
  margin-right: 32rpx;
  vertical-align: middle;
  margin-top: -6rpx;
  margin-left: 10rpx;
}

/* .top-info {
  width: 100%;
  height: 98rpx;
  line-height: 98rpx;
  border-bottom: 1rpx solid #dadada;
  font-size: 40rpx;
  padding: 0 40rpx;
  background: #ff918f;
  color: #fff;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

.top-info image {
  width: 40rpx;
  height: 36rpx;
  vertical-align: middle;
  margin-top: -6rpx;
  margin-right: 10rpx;
} */

.waitpayTail image {
  width: 38rpx;
  height: 41rpx;
}

.waitpay .time {
  float: right;
  font-size: 28rpx;
}

.finish {
  background: #ccc;
}

.dispatching {
  background: #f2cb61;
}

.selftake {
  background: #f2cb61;
}

.refunded {
  background: #ccc;
}

.share {
  background: #f4ca5c;
}

.payed {
  background: #5cb0ec;
}

.invite-join {
  width: 676rpx;
  background: #fff;
  padding: 0 18rpx 40rpx 18rpx;
  margin: 0 auto 18rpx auto;
}

.group-title {
  display: flex;
  height: 82rpx;
  line-height: 82rpx;
  font-size: 24rpx;
  color: #454545;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f1f1f1;
}

.group-title text {
  font-weight: bold;
}

.group-people-list {
  padding: 30rpx 0;
  min-height: 105rpx;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-bottom: 1rpx solid #f1f1f1;
  margin-bottom: 30rpx;
}

.group-share-text {
  font-size: 26rpx;
  color: #454545;
  line-height: 36rpx;
  margin: 15rpx 0 0 0;
  text-align: center;
  width: 100%;
}

.people-item {
  margin: 10rpx 15rpx;
  width: 101rpx;
  height: 101rpx;
  border-radius: 50%;
  border: 2rpx dashed #adadad;
  position: relative;
  display: flex;
  float: left;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
}

.group-people-list .leader {
  border: 2rpx solid #ff6b09;
}

.people-item .leader-label {
  position: absolute;
  left: 10rpx;
  top: 82rpx;
  z-index: 1;
}

.people-item image {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
}

.people-item text {
  font-size: 32rpx;
  line-height: 101rpx;
  color: #999;
}

.people-more {
  margin: 10rpx 16rpx;
  width: 101rpx;
  height: 101rpx;
  border-radius: 50%;
  position: relative;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.people-more image {
  width: 101rpx;
  height: 101rpx;
}

.leader .leader-label {
  width: 80rpx;
  height: 29rpx;
  border-radius: 12rpx;
  background-color: #ff6902;
  font-size: 18rpx;
  line-height: 29rpx;
  color: #fff;
  display: block;
  text-align: center;
}

.group-tips {
  font-size: 29rpx;
  height: 67rpx;
  line-height: 67rpx;
  width: 100%;
  display: block;
  text-align: center;
}

.join-group {
  border-radius: 6rpx;
  border: none;
  color: #fff;
  width: 670rpx;
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  font-weight: bold;
}

.usable {
  background-color: #009f55;
}

.unavailable {
  background-color: #cbcbcb;
}

.group-success {
  font-size: 28rpx;
  color: #454545;
  height: 70rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.group-success icon {
  margin-right: 25rpx;
}

.receive-box {
  min-height: 69rpx;
  width: 676rpx;
  padding: 27rpx 18rpx 30rpx 18rpx;
  background: #fff;
  border-radius: 4rpx;
  margin: 0 auto 18rpx auto;
  overflow: hidden;
}

.receive-box .icon-box {
  width: 46rpx;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  float: left;
}

.receive-box .icon-box image {
  width: 33rpx;
  height: 39rpx;
}

.receive-box .receive-info {
  width: 610rpx;
  height: 100%;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #454545;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.receive-box .receive-info view {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.receive-box .receive-info view:last-of-type {
  font-size: 24rpx;
  line-height: 40rpx;
}

.receive-box .receive-info view text {
  border-left: 1px solid #8b8b8c;
  padding-left: 22rpx;
  margin-left: 20rpx;
  height: 28rpx;
  line-height: 28rpx;
  display: block;
}

.num-time {
  background: #fff;
  font-size: 30rpx;
  text-indent: 40rpx;
  padding: 20rpx 0rpx;
  line-height: 56rpx;
  border-bottom: 1rpx solid #dadada;
}

.payment-remarks {
  background: #fff;
  font-size: 30rpx;
  margin-bottom: 20rpx;
}

.payment-method {
  min-height: 90rpx;
  line-height: 90rpx;
  padding: 0 40rpx;
}

.payment-method {
  border-bottom: 1rpx solid #dadada;
}

.payment-remarks .color-5a5a5a {
  display: block;
  float: left;
  width: 150rpx;
}

.payment-remarks .remarks {
  overflow: hidden;
}

.remarks .remarks-info {
  width: calc(100% - 150rpx);
  height: 100%;
  display: block;
}

.bottom-box {
  width: 100%;
  height: 90rpx;
  overflow: hidden;
  font-size: 32rpx;
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  background: #fff;
  border-top: 1rpx solid #e0e0e0;
}

.bottom-box button::after {
  border: none;
}

.bottom-box .btn {
  float: right;
  width: 148rpx;
  height: 44rpx;
  border-radius: 10rpx;
  text-align: center;
  line-height: 44rpx;
  font-size: 28rpx;
  overflow: hidden;
  margin-right: 30rpx;
  margin-top: 23rpx;
  padding: 0;
}

.bottom-box .cancle {
  border: 1rpx solid #a0a0a0;
}

.bottom-box .to-pay,
.bottom-box .to-invitation {
  background: #ffbf00;
  border: 2rpx solid #ffbf00;
  color: #fff;
  box-sizing: content-box;
}

.bottom-box .confirm {
  background: #ff4b1b;
  border: 2rpx solid #ff4b1b;
  color: #fff;
}

.delivery-box {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 14rpx 0 10rpx 0;
  text-align: center;
}

.delivery-box .title {
  color: #646464;
  font-size: 32rpx;
  line-height: 56rpx;
  margin-bottom: 20rpx;
}

.tips {
  font-size: 32rpx;
  color: #606060;
  line-height: 56rpx;
}

.self-time {
  height: 86rpx;
  line-height: 86rpx;
  font-size: 32rpx;
  text-align: right;
  padding: 0 40rpx;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.self-time text {
  float: left;
  text-align: left;
  font-size: 30rpx;
}

.code-box {
  color: #454545;
  padding-top: 20rpx;
}

.code-box text {
  display: block;
  width: 100%;
}

.using-tips {
  text-align: center;
  font-size: 28rpx;
  line-height: 40rpx;
}

.selftake-store {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #454545;
  font-weight: bold;
  margin-top: 15rpx;
}

.selftake-store image {
  width: 40rpx;
  height: 37rpx;
  margin-right: 8rpx;
}

.barcode-box {
  height: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  position: relative;
}

.barcode-box canvas {
  height: 100%;
  width: 710rpx;
  position: absolute;
  top: 0;
}

.barcode-box image {
  width: 710rpx;
  height: 100%;
}

.code-text {
  font-size: 28rpx;
  line-height: 48rpx;
  margin-top: 10rpx;
  text-align: center;
  letter-spacing: 8rpx;
}

.selfTime-text {
  font-size: 28rpx;
  line-height: 48rpx;
  margin-top: 30rpx;
  text-align: center;
  margin-bottom: 40rpx;
}

.button-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 40rpx;
  border-bottom: 20rpx solid #f1f1f1;
  height: 108rpx;
}

.button-box button {
  background: #fff;
  height: 48rpx;
  padding: 0 32rpx;
  border: 1rpx solid #8b8b8c;
  font-size: 24rpx;
  line-height: 48rpx;
  margin: 0 20rpx 0 0;
}

.button-box button.another {
  color: #009f55;
  border: 2rpx solid #009f55;
}

.button-box button::after {
  border: 0;
}

.deliveryTimeStatement {
  border-bottom: 20rpx solid #f1f1f1;
  padding: 20rpx 40rpx;
  padding-top: 0;
}

.pickup-store {
  width: 676rpx;
  padding: 27rpx 18rpx 30rpx 18rpx;
  background: #fff;
  border-radius: 4rpx;
  margin: 0 auto 18rpx auto;
}

.pickup-store .title {
  font-size: 32rpx;
  line-height: 52rpx;
  color: #242424;
  font-family: Source Han Sans CN;
  font-weight: 500;
}

.selftake-time {
  font-size: 28rpx;
  line-height: 40rpx;
}

/* 商品信息 */

.goods-box {
  background: #fff;
  width: 100%;
  /* min-height: 692rpx; */
  padding: 0 0 10rpx ;
  margin: 0 auto;
  background: #fff;
  border-radius: 4rpx 4rpx 0px 0px;
}

.title-box {
  font-size: 32rpx;
  font-weight: 500;
  color: #242424;
  height: 90rpx;
  line-height: 90rpx;
}

.goods-item-box {
  display: flex;
  flex-direction: column;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #000;
  margin-bottom: 20rpx;
}

.goods-list.hide {
  max-height: 414rpx;
  overflow: hidden;
}

.goods-item {
  padding: 0 0 30rpx 0;
  display: flex;
  justify-content: space-between;
}

.goods-item .goods-img {
  width: 108rpx;
  height: 108rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  margin-right: 19rpx;
  flex: 0 0 auto;
}

.goods-item .goods-img image {
  width: 100%;
  height: 100%;
}

.goods-item .goods-img .seckill-icon {
  position: absolute;
  width: 69rpx;
  height: 13rpx;
  top: 0;
  left: 0;
}

.goods-item .goods-info {
  /* height: 108rpx; */
  /* width: calc(100% - 128rpx); */
  position: relative;
  display: flex;
  flex-direction: column;
  /* height: 100%; */
  flex: 1 0 auto;
  max-width: 430rpx;
  /* justify-content: space-between; */
}

.goods-info .goods-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 40rpx;
  flex: 0 0 auto;
  max-width: 100%;
}
.goods-info .goods-name {
  font-size: 32rpx;
  line-height: 38rpx;
  color: #333;
  margin-top: 2rpx;
  font-weight: 400;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  white-space: normal;
}

.goods-info .goods-label {
  font-size: 20rpx;
  margin-top: 2rpx;
  background: #FF5757;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 260rpx;
  padding: 0 10rpx;
  color: #ffffff;
  display: inline-block;
  line-height: 40rpx;
  height: 40rpx;
  border-radius: 6rpx;
  font-weight: 600;
}

.goods-info .goods-desc {
  font-size: 22rpx;
  line-height: 36rpx;
  height: 36rpx;
  color: #999;
}

.goods-info .number-price {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.goods-info .goods-count {
  font-size: 24rpx;
  color: #666666;
  font-weight: bold;
}

.goods-info .goods-count text:first-of-type {
  display: inline-block;
  min-width: 60rpx;
}

.goods-info .goods-count .refund-num {
  color: #FF4545;
  font-weight: 400;
  margin-left: 2rpx;
}

.goods-price {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #333;
}

.goods-price .nowPrice {
  font-weight: bold;
}

.goods-price .oldPrice {
  font-size: 20rpx;
  color: #454545;
  margin-left: 18rpx;
  text-decoration: line-through;
}

.viewMore {
  width: 146rpx;
  height: 50rpx;
  border: 1px solid #cdcdcd;
  box-sizing: border-box;
  font-size: 24rpx;
  color: #454545;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28rpx auto;
}

.viewMore image {
  width: 17rpx;
  height: 10rpx;
  margin-left: 6rpx;
}

.dividing-line {
  width: 712rpx;
  height: 26rpx;
  position: relative;
  left: 50%;
  margin-left: -356rpx;
}

.dividing-line image {
  width: 100%;
  height: 100%;
}

/* 赠品相关 */

.gift-box {
  background: #fff6f0;
  min-height: 80rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #ff6131;
  font-size: 24rpx;
  width: 100%;
  box-sizing: border-box;
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
  height: 86rpx;
  font-size: 28rpx;
  line-height: 86rpx;
  border-bottom: 1rpx solid #f1f1f1;
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
  font-size: 30rpx;
}

.dispatching-fee .left-icon {
  font-size: 24rpx;
  color: #009f55;
  border: 2rpx solid #009f55;
  font-weight: normal;
  border-radius: 6rpx;
  line-height: 36rpx;
  height: 36rpx;
  padding: 0 12rpx;
}

.bill-details {
  padding: 11rpx 0 6rpx 0;
}

.bill-details-item {
  height: 48rpx;
  line-height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bill-details .bill-details-item .title {
  font-size: 26rpx;
  color: #666666;
  display: flex;
}

.bill-details .bill-details-item .amount {
  font-size: 28rpx;
  color: #FD463B;
}

.bill-total {
  height: 80rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.bill-total .discount-amounts {
  font-size: 24rpx;
  color: #8b8b8c;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  height: 100%;
  padding-right: 20rpx;
}

.balance-accounts {
  justify-content: flex-end;
  align-items: center;
  display: flex;
  font-size: 28rpx;
  color: #181818;
  font-weight: bold;
}

.balance-accounts text {
  font-size: 28rpx;
  color: #FD463B;
}

.store-box {
  background: #fff;
  width: 674rpx;
  padding: 0 20rpx 20rpx 20rpx;
  margin: 0 auto 18rpx auto;
}

.store-box .store-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.store-box .store-row .left {
  padding-top: 4rpx;
  padding-bottom: 5rpx;
  width: 500rpx;
}

.store-box .store-row .left .name {
  font-size: 30rpx;
  line-height: 52rpx;
  color: #242424;
}

.store-box .store-row .left .address {
  font-size: 24rpx;
  line-height: 36rpx;
  color: #4D4D4D;
}

.store-box .store-row .right {
  display: flex;
}

.store-box .store-row .right view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 80rpx;
}

.store-box .store-row .right view.tel {
  margin-right: -20rpx;
  margin-left: 25rpx;
}

.store-box .store-row .right view.tel image {
  width: 36rpx;
  height: 40rpx;
}

.store-box .store-row .right view.address image {
  width: 40rpx;
  height: 40rpx;
}

.store-box .title,
.invoice-box .title {
  font-size: 32rpx;
  color: #242424;
  font-family: Source Han Sans CN;
  font-weight: 500;
  height: 60rpx;
  line-height: 60rpx;
  padding-top: 15rpx;
}

.contact-store {
  justify-content: flex-start;
  align-items: center;
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

.invoice-box {
  background: #fff;
  width: 674rpx;
  padding: 0 20rpx 20rpx 20rpx;
  margin: 0 auto 18rpx auto;
}

.invoice-box .row {
  color: #8b8b8c;
  line-height: 68rpx;
  height: 68rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  border-bottom: none;
}

.invoice-box .row text.color-454545 {
  width: 142rpx;
  text-align: left;
}

.order-box {
  background: #fff;
  width: 674rpx;
  padding: 0 20rpx 20rpx 20rpx;
  margin: 0 auto 18rpx auto;
  margin-top: 127rpx;
  border-top: 2rpx solid #F0F0F0;
  font-size: 25rpx;
}

.order-box .title {
  font-size: 32rpx;
  color: #242424;
  font-family: Source Han Sans CN;
  font-weight: 500;
  height: 30rpx;
  line-height: 60rpx;
  padding-top: 15rpx;
  opacity: 0;
}

.order-box .row {
  color: #8b8b8c;
  /* line-height: 68rpx; */
  /* height: 68rpx; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  border-bottom: none;
  margin-bottom: 17rpx;
}
.textActive{
  color: #000000;
  width: 50%;
  display: inline-block;
  text-align: left;
}
.order-box .row text.color-454545 {
  width: 142rpx;
  text-align: left;
}

.order-box .order-code {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.order-box .order-code>view {
  font-size: 28rpx;
  padding-left: 19rpx;
  margin-left: 19rpx;
  position: relative;
}

.order-box .order-code>view::before {
  content: "";
  display: block;
  position: absolute;
  width: 1px;
  height: 20rpx;
  background: #CBCBCB;
  left: 0;
  top: 50%;
  margin-top: -10rpx;
}

.order-box .remarks {
  border-bottom: 0;
  min-height: 68rpx;
  height: auto;
  align-items: start;
}

.order-box .remarks .color-454545 {
  line-height: 48rpx;
}

.order-box .remarks>text:last-of-type {
  line-height: 48rpx;
  text-align: left;
}

.order-box .num-express {
  position: relative;
}

.order-box .num-express view.tracking-num text:first-of-type {
  margin-right: 19rpx;
}

.order-box .num-express view.tracking-num text:last-of-type {
  position: relative;
  padding-left: 19rpx;
  display: inline-block;
}

.order-box .num-express view.tracking-num text:last-of-type::before {
  content: "";
  display: block;
  position: absolute;
  width: 1px;
  height: 20rpx;
  background: #CBCBCB;
  left: 0;
  top: 50%;
  margin-top: -10rpx;
}

.order-box .num-express text.trackingDetails {
  position: absolute;
  right: 0;
  top: 0;
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
  border-bottom: 1px solid #f1f1f1;
}

.price-detail-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  background: #009f55;
  font-weight: bold;
  text-align: center;
}

.share-raffle {
  position: fixed;
  right: 12rpx;
  bottom: 18%;
}

.share-raffle-img {
  width: 128rpx;
  height: 152rpx;
}

.share-raffle button {
  width: 128rpx;
  height: 152rpx;
  padding: 0;
  margin: 0;
  border: 0;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
}

.share-raffle button::after {
  border: 0;
}

.group-share-img-box {
  position: absolute;
  top: 30%;
  left: 120%;
  width: 992rpx;
  height: 804rpx;
}

.group-share-img-box canvas {
  width: 100%;
  height: 100%;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  right: 0;
  bottom: 240rpx;
}

.barcode-box-backGround {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #fff;
  /* transform: rotate(90deg); */
  z-index: 999;
  margin: auto;
}

.barcode-box-backGround .box {
  /* position: absolute;
  top: 2%;
  left: -75%;
  transform: translate(0, -50%); */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 1000rpx;
  height: 100%;
  transform: rotate(90deg);
}

.barcode-box-backGround .box .barcode-box {
  position: relative;
  top: 10%;
  width: 100%;
  height: 355rpx;
}

.barcode-box-backGround .box .barcode-box canvas {
  width: 100%;
  height: 100%;
}

.barcode-box-backGround .box .barcode-box image {
  width: 100%;
  height: 100%;
}

.barcode-box-backGround .box .code-text {
  position: relative;
  top: 10%;
  font-size: 38rpx;
  text-align: center;
  padding-top: 50rpx;
}
.top-tips .waitPayfor{
  width: 100%;
  padding: 28rpx 29rpx 50rpx;
  display: flex;
  height: 58rpx;
  justify-content: space-between;
  align-items: flex-end;
}
.top-tips .waitPayfor>text{
  font-size: 58rpx;
  font-weight: 500;
  height: 100%;
  font-family: SourceHanSerifCN-Medium, SourceHanSerifCN;
}
.top-tips .waitPayfor>view{
  display: flex;
  flex-direction: row;
  font-size: 29rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #F64800;
  margin: 0;
}
.goods-box .waitPay-img{
    width: 250rpx;
    height: 250rpx;
    line-height: 250rpx;
    text-align: center;
    box-sizing: border-box;
}
.goods-box .waitPay-img image{
    max-width: 250rpx;
    height: auto;
}
.waitPay-info .number-price{
  padding: 0;
  margin: 0;
  width: 100%;
}
.goods-info .waitPay-label{
  font-size: 27rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
  background-color: #fff;
  padding: 0;
}
.goods-info .waitPay-name{
  margin-bottom: 29rpx;
}
.goods-info .waitPay-desc{
  font-size: 27rpx;
  /* margin-bottom: 79rpx; */
}
.goods-info .waitPay-count{
  font-size: 27rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ACACAC;
  text-align: right;
}
.waitPay-store{
  padding-top: 0rpx;
  padding-bottom: 60rpx;
}
.waitPay-store>view{
  display: flex;
  justify-content: space-between;
}
/* .waitPay-line{
  border-bottom: 2rpx solid #000000;
  margin-bottom: 27rpx;
} */
.waitPay-order .row{
  height: 40rpx;
  line-height: 40rpx;
  margin-bottom: 12rpx;
}
.waitPay-store>view>text:first-of-type,
.waitPay-order .row text:first-of-type{
  font-size: 29rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ACACAC;
}
.waitPay-store>view>text:last-of-type,
.waitPay-order .row text:last-of-type{
  font-size: 29rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #000000;
}
.order-box.waitPay-order{
  margin-top: 0;
  border: 0;
  padding: 0;
  padding-bottom: 170rpx;
}
.waitPay{
  width: 100%;
  height: 100vh;
  background-color: #fff;
  padding: 0 29rpx 29rpx;
  box-sizing: border-box;
}
.waitPay .top-info{
  padding: 0;
  width: 100%;
}
.waitPay-button-box{
  display: flex;
  justify-content: space-between;
  width: 750rpx;
  height: 150rpx;
  box-sizing: border-box;
  padding: 19rpx 29rpx;
  background-color: #fff;
  border-top: 2rpx solid #F2F2F2;
  position: fixed;
  bottom: 0;
  left: 0;
}
.waitPay-button-box>view:first-of-type>text{
  display: block;
  font-size: 35rpx;
}
.waitPay-button-box>view:first-of-type>text:first-of-type{
  font-size: 21rpx;
}
.waitPay-button-box .payment{
  width: 240rpx;
  height: 77rpx;
  border-radius: 8rpx;
  background-color: #000000;
  font-size: 27rpx;
  color: #fff;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  line-height: 77rpx;
  margin: 0;
  padding: 0;
}
.waitPay-point{
  width: 700rpx;
  min-height: 192rpx;
  padding: 38rpx 29rpx;
  box-sizing: border-box;
  background: #F7F7F7;
  margin-bottom: 40rpx;
}
.waitPay-point>text{
  font-size: 25rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ACACAC;
}
.waitPay-point>view:first-of-type{
  font-size: 29rpx;
font-family: PingFangSC-Medium, PingFang SC;
font-weight: 500;
color: #000000;
}
.waitPay-point>view:last-of-type{
  font-size: 29rpx;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #000000;
}
.store_msg {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  width: 100%;
}
</style>