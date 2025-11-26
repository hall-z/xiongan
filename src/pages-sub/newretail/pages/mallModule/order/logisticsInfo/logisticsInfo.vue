<template>
<!--pages/logisticsInfo/logisticsInfo.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="tracking-item" v-for="(item , index) in trackingList" :key="i">
  <view class="header" :data-id="item.id" @click="clickShipdetails">
    <view>运单号:<text class="express-number">{{item.trackingNumber}}</text><text class="copy_text" @click.stop="clipBtn" :style="'color:' + state.themeColor" :data-track="item.trackingNumber">复制</text></view>
    <view>国内承运人:<text class="express-name">{{item.trackingCom}}</text></view>
    <view>国内承运人电话:<text class="express-tel" @click="callTrackingPhone">{{item.phoneNum}}</text></view>
    <view class="checkGoods" v-if="state.orderTraceType != 'DLY'" :data-trackingNumber="item.trackingNumber" :data-item="item" @click.stop="checkGoods">查看商品</view>
    <view class="right" v-if="state.orderTraceType != 'DLY'">配送详情<image :class="'right-icon ' + (state.currentItem === item.id ? 'active' : '')" :src="state.imagesPath.iconRight2"></image>
    </view>
  </view>
  <view class="ship-details" :hidden="state.currentItem !== item.id && state.orderTraceType != 'DLY'">
    <view v-if="item.trailUrl || state.orderTraceType != 'DLY'" class="trajectory" :data-trackingNumber="item.trackingNumber" :data-item="item" @click.stop="toTrajectory">查看轨迹 →</view>
    <view class="content" v-if="item.shipdetails.length > 0">
      <view class="express-item" v-for="(item , index) in item.shipdetails" :key="index">
        <image :src="state.imagesPath.current_clock" v-if="item.newest"></image>
        <image :src="state.imagesPath.pass_clock" v-if="!item.newest"></image>
        <view class="express-info">
          <text class="time">{{item.time}}</text>
          <view class="status">{{item.context}}<text @click="callDistributionPhone">{{state.distributionPhone}}</text></view>
        </view>
      </view>
    </view>
    <view class="no-data" v-if="item.shipdetails.length == 0">
      <text>暂无快递信息</text>
    </view>
  </view>
</view>
<popup :show="state.flag" position="bottom" custom-class="bottom" @close="toggleGoodsSpecPopup">
    <view class="popup-content">
        <view class="popup-title">商品信息</view>
        <view class="popup-hd">
            <text>{{state.commodityInfo.trackingCom}} | {{state.commodityInfo.trackingNumber}}</text>
        </view>
        <view class="popup-bd">
            <view v-for="(item , index) in state.commodityInfo.list" :key="idx" class="item">
                <view class="icon">
                    <image :src="item.imageUrl" mode="widthFix"></image>
                </view>
                <view class="textbox">
                    <view class="title">{{item.name}}</view>
                    <view>数量：{{item.qty}}件</view>
                </view>
            </view>
        </view>
    </view>
</popup>

</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/logisticsInfo/logisticsInfo.js
const orderService = _apiOrderServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const NAVPAGE = _utilsNavPageJs;
const selfA = _utilsSelfJs;
const themeManager = _utilsThemeManagerJs;
//获取应用实例
const state = reactive({
  orderTraceType: '',
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  navigationBarTitle: "物流信息",
  imagesPath: IMGAGESPATH,
  trackingInfo: {},
  com: '暂无',
  num: '暂无',
  phoneNum: '暂无',
  shipdetails: [],
  distributionPhone: '',
  currentItem: '',
  orderId: '',
  flag: false,
  commodityInfo: {
    list: []
  }
});
onLoad(function (options) {
  uni.hideShareMenu();
  if (options.orderId) {
    state.orderId = options.orderId;
    let orderTraceType = uni.getStorageSync('orderTraceType');
    state.orderTraceType = orderTraceType;
    if (orderTraceType == 'DLY') {
      getOrderShipDetails();
    } else {
      getOrderTrackingNumAndCom(options.orderId);
    }
  }
  if (options.mobile) {
    state.mobile = options.mobile;
  }
  // this.setData({
  //   trackingInfo: this.data.trackingInfo
  // })
  // this.getOrderShipDetails(this.data.trackingInfo);

  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
function clipBtn(e) {
  let json = e.currentTarget.dataset.track;
  uni.setClipboardData({
    data: json,
    success: function (res) {
      uni.showToast({
        title: "复制成功！",
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function getOrderTrackingNumAndCom(orderId) {
  const that = this;
  orderService.getOrderTrackingNumAndCom(orderId).then(res => {
    let tempList = [];
    if (res && res.length > 0) {
      res.forEach((item, index) => {
        let trackingCompanyInfo = handleTrackingCompany(item.trackingCompany);
        let tempData = {
          ...item,
          trackingCom: trackingCompanyInfo.com,
          phoneNum: trackingCompanyInfo.phoneNum,
          shipdetails: [],
          getDataId: item.id,
          id: index
        };
        tempList.push(tempData);
      });
    }
    state.trackingList = tempList;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getOrderShipDetails(trackingInfo, trackId) {
  const that = this;
  let orderTraceType = uni.getStorageSync('orderTraceType');
  if (trackingInfo && trackingInfo.trackingCompany && trackingInfo.trackingNumber && orderTraceType != 'DLY') {
    let params = {
      trackingCom: trackingInfo.trackingCompany,
      trackingNumber: trackingInfo.trackingNumber,
      mobile: state.mobile ? state.mobile : '',
      orderId: state.orderId
    };
    orderService.getOrderShipDetailsV2(params).then(res => {
      if (res) {
        let tempShip = [];
        res.shipdetails.forEach(item => {
          tempShip.push(item);
        });
        let tempList = state.trackingList;
        for (let i = 0; i < tempList.length; i++) {
          const ele = tempList[i];
          if (ele.trackingNumber === res.num && trackId === ele.id) {
            tempList[i].shipdetails = tempShip;
            tempList[i].trailUrl = res.trailUrl;
            break;
          }
        }
        state.trackingList = tempList;
      }
    }).catch(e => {
      // wx.showToast({
      //   title: e.message,
      //   icon: 'none',
      //   duration: 2000
      // })
    });
  } else if (orderTraceType == 'DLY') {
    let params = {
      orderId: state.orderId
    };
    orderService.getOrderShipDetailsV2(params).then(res => {
      if (res) {
        let tempShip = [];
        let trackingCompanyInfo = handleTrackingCompany(res.com);
        res.shipdetails.forEach(item => {
          tempShip.push(item);
        });
        let tempList = {
          ...res,
          trackingCom: res.com,
          trackingNumber: res.num,
          shipdetails: tempShip,
          trailUrl: res.trailUrl,
          phoneNum: trackingCompanyInfo.phoneNum
        };
        state.trackingList = [tempList];
      }
    }).catch(e => {});
  }
  let str = 'a15112250161c0755-2451454c18926057890111放0755-4554444分';
  let reg = /((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}))?/g;
  console.log(str.match(reg));
}
function checkGoods(e) {
  console.log(e, "订单号");
  // let opts = '?orderId=' + this.data.orderId;
  // NAVPAGE.toQueryGoods(opts)
  state.flag = true;
  orderService.getProductsByOrderId(e.target.dataset.item.getDataId).then(res => {
    let arr = [...res];
    arr.forEach(item => {
      //   await selfA.getTemporaryUrl(item.imageUrl).then((res1)=>{
      //       console.log(res1,2222222222)
      //       item.url1 = res1
      //   })
      state.commodityInfo = {
        ...e.target.dataset.item,
        list: [...arr]
      };
      state.orderId = state.orderId;
    });
    console.log(state.commodityInfo, 333333333);
  });
}
function callTrackingPhone() {
  let phoneNum = state.phoneNum;
  if (phoneNum !== "暂无") {
    handleCallPhone(phoneNum);
  }
}
function callDistributionPhone() {
  let phoneNum = state.distributionPhone;
  handleCallPhone(phoneNum);
}
function handleCallPhone(phoneNum) {
  uni.makePhoneCall({
    phoneNumber: phoneNum
  });
}
function handleTrackingCompany(com) {
  let trackingCompany = '';
  let tempPhoneNum = '';
  if (com === 'SHUNFENG' || com === '顺丰') {
    trackingCompany = '顺丰', tempPhoneNum = '95338';
  } else if (com === 'SHENTONG' || com === '申通') {
    trackingCompany = '申通', tempPhoneNum = '95543';
  } else if (com === 'YUANTONG' || com === '圆通') {
    trackingCompany = '圆通', tempPhoneNum = '95554';
  } else if (com === 'ZHONGTONG' || com === '中通') {
    trackingCompany = '中通', tempPhoneNum = '95311';
  } else if (com === 'HUITONGKUAIDI' || com === '汇通') {
    trackingCompany = '汇通', tempPhoneNum = '95320';
  } else if (com === 'YUNDA' || com === '韵达') {
    trackingCompany = '韵达', tempPhoneNum = '95546';
  } else if (com === 'ZHAIJISONG' || com === '宅急送') {
    trackingCompany = '宅急送', tempPhoneNum = '400-6789-000';
  } else if (com === 'DEBANGWULIU' || com === '德邦物流') {
    trackingCompany = '德邦物流', tempPhoneNum = '95353';
  } else {
    trackingCompany = '其他', tempPhoneNum = '无';
  }
  return {
    com: trackingCompany,
    phoneNum: tempPhoneNum
  };
}
function toggleGoodsSpecPopup() {
  state.flag = false;
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function toTrajectory(e) {
  console.log(e, "eeee");
  let item = e.currentTarget.dataset.item;
  let opts = '?trailUrl=' + item.trailUrl;
  NAVPAGE.toLogisticsInfoItem(opts);
}
function clickShipdetails(e) {
  const trackId = e.currentTarget.dataset.id;
  if (e.currentTarget.dataset.id !== state.currentItem) {
    state.currentItem = trackId;
    let tempInfo = {};
    for (let i = 0; i < state.trackingList.length; i++) {
      const ele = state.trackingList[i];
      if (ele.id === trackId) {
        tempInfo = {
          trackingCompany: ele.trackingCompany,
          trackingNumber: ele.trackingNumber
        };
        break;
      }
    }
    getOrderShipDetails(tempInfo, trackId);
  } else {
    state.currentItem = '';
  }
}
</script>
<style scoped>
/* pages/logisticsInfo/logisticsInfo.wxss */
page {
  background: #eeeeee
}

.tracking-item {
  width: 710rpx;
  border-radius: 24rpx;
  margin: 28rpx auto;
  background: #ffffff;
}

.header {
  padding: 18rpx 24rpx;
  height: 200rpx;
  box-sizing: border-box;
  position: relative;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
}

.checkGoods {
  font-size: 16rpx;
  color: #cccccc;
  height: 40rpx;
  line-height: 40rpx;
  position: absolute;
  right: 50rpx;
  top: 30%;
  margin-top: -20rpx;
  display: flex;
  align-items: center;
  text-align: center;
}

.right {
  font-size: 20rpx;
  color: #cccccc;
  height: 40rpx;
  line-height: 40rpx;
  position: absolute;
  right: 30rpx;
  top: 70%;
  margin-top: -20rpx;
  display: flex;
  align-items: center;
}
.trajectory {
    font-size: 26rpx;
    height: 30rpx;
    line-height: 30rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20rpx 30rpx 0 0;
    color: #686868;
}
.right-icon {
  width: 12rpx;
  height: 23rpx;
  margin-left: 10rpx;
  transform: rotate(90deg);
}

.right-icon.active {
  transform: rotate(-90deg);
}

.right-icon image {
  width: 100%;
  height: 100%;
}

.header>view {
  color: #686868;
  font-size: 32rpx;
  line-height: 52rpx;
}

.header>view>text {
  margin-left: 25rpx;
}
.header>view>.copy_text {
  font-size: 28rpx;
}

.express-number {
  color: #000000;
}

.express-name {
  color: #2d2d2d;
}

.express-tel {
  color: #3297f3;
}

.express-number,
.express-tel {
  font-size: 27rpx;
  font-weight: bold;
}

.content {
  background: #ffffff;
  padding: 37rpx 21rpx 9rpx 40rpx;
  box-sizing: border-box;
}

.ship-details {
  position: relative;
  width: 100%;
  border-bottom-left-radius: 24rpx;
  border-bottom-right-radius: 24rpx;
}

.ship-details::before {
  content: "";
  display: block;
  height: 1px;
  background: #cccccc;
  width: 662rpx;
  position: absolute;
  left: 24rpx;
  top: 0;
}

.express-item {
  border-left: 2rpx solid #e7e7e7;
  position: relative
}

.express-item:last-of-type {
  border: none;
}

.express-icon-box {
  width: 45rpx;
  float: left;
  height: 100%;
  display: none;
}

.express-info {
  height: 100%;
  width: calc(100% - 46rpx);
  margin-left: 46rpx;
  border-bottom: 1rpx solid #dddddd;
  padding: 34rpx 0 34rpx 0;
  position: relative
}

.express-item image {
  width: 36rpx;
  height: 36rpx;
  position: absolute;
  left: -18rpx;
  top: 35rpx;
}

.express-item:first-of-type .express-info {
  padding-top: 0;
  color: #000000;
}

.express-item:last-of-type .express-info {
  border: none;
}

.express-item:last-of-type image {
  top: -18rpx;
}

.express-item:first-of-type image {
  top: 0;
}

.express-info .time {
  margin-bottom: 16rpx;
  font-size: 24rpx;
  display: block;
}

.express-info .status {
  font-size: 30rpx;
}

.express-info .status>text {
  color: #2d9dff;
}

.express-info .time,
.express-info .status {
  line-height: 36rpx;
  color: #999999
}

.express-item:first-of-type .express-info .time,
.express-item:first-of-type .express-info .status {
  color: #000000;
}

.no-data {
  font-size: 28rpx;
  text-align: center;
  padding: 30% 0;
}
.popup-content {
    height: auto;
    background: rgb(245, 245, 245);
    border-radius: 40rpx;
}
.popup-content .popup-title{
    font-size: 36rpx;
    padding: 30rpx 0;
    font-weight: 500;
    text-align: center;
}
.popup-hd{
    background-color: #ffffff;
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    padding: 0 40rpx;
}
.popup-bd{
    max-height: 528rpx;
    margin-top: 30rpx;
    overflow-y: auto;
}
.popup-bd .item{
    display: flex;
    align-items: center;
    height: 177rpx;
    background: #ffffff;
    border-bottom: 1px solid rgb(245,245,245);
    padding: 0 40rpx;
}
.popup-bd .item .icon{
    width: 138rpx;
    height: 138rpx;
    margin-right: 30rpx;
}
.popup-bd .item .icon image{
    display: block;
    width: 100%;
    height: 100%;
}
.popup-bd .item .textbox{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
}
</style>