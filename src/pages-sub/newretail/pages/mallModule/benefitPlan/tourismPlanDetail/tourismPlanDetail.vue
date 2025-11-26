<template>
<view>
<!-- <navigationBar id="navigation" title="{{navigationBarTitle}}"></navigationBar>   -->
<navigationBar id="navigation" :title="state.productPlacedAtTheTop ? ' ' : state.navigationBarTitle" :background="state.productPlacedAtTheTop ? 'color: rgba(0,0,0,0)' : ''" :style="state.productPlacedAtTheTop ? 'position: absolute;top: 0;' : ''"></navigationBar>  
<scroll-view class="page-content" :scroll-y="true" @scroll="scrollFun">
  <!-- 商品图片轮播 -->
  <view class="swiperContainer">
    <swiper class="swiper" @change="swiperChange" autoplay="true" interval="5000" circular="true">
      <view v-for="(item , index) in state.tourismPlanRouteData.bannerUrl1" :key="index">
        <swiper-item class="swiper-item">
          <image :src="state.imagesPath.iconPresell" class="slide-presell" :hidden="true"></image>
          <image :src="item" class="slide-image" width="355" height="150"></image>
        </swiper-item>
      </view>
    </swiper>
    <view class="imageCount">{{state.current}}/{{state.tourismPlanRouteData.bannerUrl1.length}}</view>
  </view>
  <view class="goods-info-box">
    <view class="goods-name">
      <view>{{state.tourismPlanRouteData.name}}</view>
      <view>{{state.tourismPlanRouteData.inOut == 2 ? '省外' : '省内'}}</view>
    </view>
    <view class="desc-share">
      <view class="goods-desc">{{state.tourismPlanRouteData.note}}</view>
    </view>
    <!-- <view class="sold_box">
      <view class="goods-soldNum"  style="color:{{balance <= 10 ? '#FF7121' : '#000000'}};"><text>联系人</text> {{state.tourismPlanData.contacts}}</view>
      <view class="goods-soldNum"><text>联系方式</text> {{state.tourismPlanData.contactInformation}}</view>
    </view> -->
  </view>
  <view class="goods-imgtext scroll_box" :hidden="state.tourismPlanRouteData && state.tourismPlanRouteData.travelList ? false : true">
    <text>报名</text>
    <scroll-view class="scroll-view_H" enable-flex="true" scroll-x="true" style="width: 100%">
      <view class="travel_item" v-for="(item , index) in state.tourismPlanRouteData.travelList" :key="index">
        <view class="tag" v-if="item.choose">
          <image :src="state.imagesPath.choose_img" mode=""></image>
        </view>
        <view class="tag tag1" v-else-if="item.surplus <= 0">
          <image :src="state.imagesPath.clusteringImg" mode=""></image>
        </view>
        <view>
          <text>出发时间：</text>
          <text>{{item.startDate}}</text>
        </view>
        <view>
          <text>结束时间：</text>
          <text>{{item.endDate}}</text>
        </view>
        <view>
          <text>报名上限：</text>
          <text>{{item.enrollOnline}}人</text>
        </view>
        <view>
          <text>剩余名额：</text>
          <text>{{item.surplus}}</text>
        </view>
        <view class="enrollStartDate">
          <view>可报名时间：</view>
          <view>{{item.enrollStartDate || '暂无'}}</view>
        </view>
        <view class="enrollEndDate">
          <view>报名截止时间：</view>
          <view>{{item.enrollEndDate || '暂无'}}</view>
        </view>
        <view class="choose" :data-id="item.id" :data-start="item.startDate" @click="item.surplus <= 0 || !isEnrollData[item.id] || item.chooseFlag == 0 || choose || (planUserData.route != 2 && tourismPlanRouteData.inOut != 1)? null : 'toggleChooseShowPopup'" :style="'background-color: ' + (item.surplus <= 0 || !state.isEnrollData[item.id] || item.chooseFlag == 0 || state.choose || state.planUserData.route != 2 && state.tourismPlanRouteData.inOut != 1 ? '#ccc' : state.themeColor)">
          <view>{{item.choose ? '已' : ''}}报名</view>
        </view>
      </view>
    </scroll-view>
  </view>
  <!-- 图文详情 -->
  <view class="goods-imgtext" :hidden="state.tourismPlanRouteData && state.tourismPlanRouteData.detailsUrl ? false : true">
    <text>图文详情</text>
    <image show-menu-by-longpress="true" :src="state.tourismPlanRouteData.detailsUrl" mode="widthFix"></image>
  </view>
  <view class="botton-block"></view>
  <!-- 底部按钮 -->
  <!-- <view class="handle-box" wx:if="{{!state.choose}}">
    <view style="border: 1px solid {{state.choose ? '#ccc' : state.themeColor}};" class="normal-button">
      <button style="background-color: {{state.choose ? '#ccc' : state.themeColor}}" bindtap="{{state.choose ? null : 'confirm'}}">{{state.choose ? '已' : ''}}选择线路</button>
    </view>
  </view> -->
</scroll-view>
<popup :show="state.chooseShow" position="middle" custom-class="middle" @close="toggleChooseShowPopup">
  <view class="modal-body modal-body1">
    <view class="modal-content">
      <view class="subscribe-close">
        <image :src="state.imagesPath.iconCloseImg2" @click="toggleChooseShowPopup"></image>
      </view>
        <view class="title">报名登记</view>
        <view class="content">
          <view>
            <text>线路名称：</text>
            <text>{{state.tourismPlanRouteData.name}}</text>
          </view>
          <view>
            <text>出发时间：</text>
            <text>{{state.planUserData.startDate}}</text>
          </view>
          <view>
            <text>姓名：</text>
            <text>{{state.planUserData.unionUserName}}</text>
          </view>
          <view>
            <text>性别：</text>
            <text>{{state.planUserData.sex == 'M' ? '男' : state.planUserData.sex == 'F' ? '女' : ''}}</text>
          </view>
          <view>
            <text>联系电话：</text>
            <text>{{state.planUserData.mobile}}</text>
          </view>
          <view>
            <text>身份证号：</text>
            <text>{{state.planUserData.identity}}</text>
          </view>
        </view>
        <view class="choose_tip">
          阅读并同意以下内容：您已知晓以上录入的出行人信息，将用于您购买疗休养期间在途保险、住宿、景点门票等所有需要实名制的旅游产品，请再次确认，并确保此信息的真实有效。
        </view>
        <view class="button-box">
          <button class="cancel" @click.stop="toggleChooseShowPopup">取消</button>
          <button class="confirm" :style="'background: ' + state.themeColor + ';color: #fff'" @click.stop="confirm">确认报名</button>
        </view>
    </view>
  </view>
</popup></view>
</template>
<script setup>
import _apiWelfarePlanServiceJs from "@/service/api/newretail/welfarePlanService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/addressList/addressList.js
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const welfarePlanService = _apiWelfarePlanServiceJs;

//获取应用实例
const state = reactive({
  productPlacedAtTheTop: false,
  chooseData: {},
  chooseShow: false,
  current: 1,
  routeId: null,
  choose: null,
  tourismPlanData: {},
  tourismPlanRouteData: {},
  navigationBarTitle: "路线选择",
  imagesPath: IMGAGESPATH,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  planUserData: {},
  isEnrollData: {},
  timeOut: null
});
function getEnrollDate() {
  let nowTime = new Date().getTime();
  state.tourismPlanRouteData.travelList.forEach(item => {
    state.isEnrollData[item.id] = false;
    let startTime = item.enrollStartDate ? new Date(item.enrollStartDate.replace(/-/g, '/')).getTime() : 0;
    let endTime = item.enrollEndDate ? new Date(item.enrollEndDate.replace(/-/g, '/')).getTime() : 0;
    if (nowTime >= startTime && nowTime <= endTime) {
      state.isEnrollData[item.id] = true;
    }
  });
  state.isEnrollData = state.isEnrollData;
}
function toggleChooseShowPopup(e) {
  let start = e && e.currentTarget.dataset ? e.currentTarget.dataset.start : '';
  state.planUserData.startDate = start;
  state.planUserData.selectId = e && e.currentTarget.dataset ? e.currentTarget.dataset.id : '';
  state.planUserData = state.planUserData;
  state.chooseShow = !state.chooseShow;
}
function getAuth() {
  welfarePlanService.getTravelByPlanId({
    planId: state.id
  }).then(res => {
    if (res) {
      state.planUserData = res;
    }
  });
}
function getPlanList() {
  uni.showLoading({
    title: '加载中'
  });
  welfarePlanService.tourismPlanDetails(state.id).then(res => {
    if (res) {
      let routeData = {};
      res.routeList.some(item => {
        if (item.id == state.routeId) {
          routeData = {
            ...item
          };
        }
        return item.id == state.routeId;
      });
      if (routeData && routeData.bannerUrl) {
        routeData.bannerUrl1 = routeData.bannerUrl.split(',');
      }
      let choose = null;
      choose = res.routeList.some(item => {
        return item.choose;
      });
      if (routeData.travelList && routeData.travelList.length > 0) {
        routeData.travelList.forEach((item, index) => {
          item.startDate = item.startDate ? item.startDate.slice(0, 10) : '';
          item.endDate = item.endDate ? item.endDate.slice(0, 10) : '';
          item.enrollEndDate = item.enrollEndDate ? item.enrollEndDate : '';
          choose = item.choose || choose;
        });
        routeData.travelList = routeData.travelList.sort((a, b) => {
          let aStartTime = a.enrollStartDate ? new Date(a.enrollStartDate.replace(/-/g, '/')).getTime() : 0;
          // let aEndTime = a.enrollStartDate ? new Date(a.enrollEndDate.replace(/-/g, '/')).getTime() : 0
          let bStartTime = b.enrollStartDate ? new Date(b.enrollStartDate.replace(/-/g, '/')).getTime() : 0;
          // let bEndTime = b.enrollStartDate ? new Date(b.enrollEndDate.replace(/-/g, '/')).getTime() : 0
          return aStartTime - bStartTime;
        });
        routeData.travelList = routeData.travelList.sort((a, b) => {
          let aSurplusFlag = a.surplus > 0 ? 1 : 0;
          let bSurplusFlag = b.surplus > 0 ? 1 : 0;
          return bSurplusFlag - aSurplusFlag;
        });
        // routeData.travelList = routeData.travelList.sort((a,b) => {
        //   return b.choose - a.choose
        // })
      }
      state.tourismPlanData = res;
      state.tourismPlanRouteData = routeData;
      state.choose = choose;
      if (routeData.travelList) {
        getEnrollDate();
        if (timeOut) {
          clearInterval(timeOut);
        }
        timeOut = setInterval(() => {
          getEnrollDate();
        }, 1000);
      }
    }
  }).catch(err => {
    uni.showToast({
      icon: 'none',
      title: err.message
    });
  }).finally(() => {
    uni.hideLoading();
  });
}
function swiperChange(e) {
  state.current = e.detail.current + 1;
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
  }
}
onLoad(function (options) {
  uni.hideShareMenu();
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  state.id = options ? options.planId : null;
  state.routeId = options ? options.id : null;
  state.choose = options ? options.choose : null;
  state.productPlacedAtTheTop = app && app.globalData ? app.globalData.productPlacedAtTheTop : false;
  if (options.id) {
    getPlanList();
    getAuth();
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {
  uni.hideShareMenu();
});
onHide(function () {});
onUnload(function () {
  if (timeOut) {
    clearInterval(timeOut);
  }
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function confirm() {
  uni.showLoading({
    title: '加载中'
  });
  welfarePlanService.tourismPlanConfirm({
    travelId: state.planUserData.selectId,
    companyId: state.planUserData.companyId,
    routeId: state.routeId,
    id: state.id
  }).then(res => {
    uni.showToast({
      icon: 'none',
      title: '选择线路成功'
    });
    getPlanList();
    getAuth();
    toggleChooseShowPopup();
    uni.hideLoading();
  }).catch(err => {
    uni.hideLoading();
    uni.showToast({
      icon: 'none',
      title: err.message
    });
  });
}
</script>
<style scoped>
/* goodsDetail */
/* @import "/pages-sub/newretail/pages/mallModule/template/commentItem.wxss"; */
page {
  background-color: #f1f3f6;
  height: 100%;
}
.iphoneX-height {
    padding-bottom: 50rpx !important;
  }
.color-009f55 {
  color: #009f55;
}
.anchor_tab {
  position: fixed;
  top: 0;
  left: 28%;
  z-index: 10000;
  background-color: #fff;
  width: 47vw;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.anchor_tab view {
  margin: 0 15rpx;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid transparent;
}
.anchor_tab .activeScroll {
  border-bottom: 2px solid green;
}
.shipper_type {
    font-size: 24rpx;
    padding: 0 10rpx;
    height: 30rpx;
    display: inline-block;
    border: 1px solid;
    border-radius: 6rpx;
    line-height: 30rpx;
}
/* .navigation-top {

}

.navigation-top .navigation_bar_btn_goback {
  position: fixed;
  top: 30rpx;
  left: 30rpx;
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 50%;
  z-index: 1;
}

.navigation-top .navigation_bar_btn_goback .goBack {
  width: 33rpx;
  height: 33rpx;
} */

.swiperContainer {
  width: 100%;
  height: 750rpx;
  position: relative;
  z-index: 9;
}

.swiper {
  width: 100%;
  height: 750rpx;
  z-index: 9;
}

.swiper-item {
  width: 100%;
  height: 750rpx;
  z-index: 9;
}

.swiper-item image {
  width: 100%;
  height: 750rpx;
}

.slide-video {
  width: 750rpx;
  height: 750rpx;
}

.swiper-item .slide-presell {
  width: 152rpx;
  height: 145rpx;
  position: absolute;
  top: 26rpx;
  left: 60rpx;
  z-index: 10;
}

.imageCount {
  width: 72rpx;
  height: 36rpx;
  background: rgba(27, 27, 27, 0.5);
  font-size: 20rpx;
  text-align: center;
  line-height: 36rpx;
  color: #fff;
  border-radius: 6rpx;
  position: absolute;
  bottom: 40rpx;
  right: 40rpx;
}

.share-reamin {
  position: absolute;
  right: -15rpx;
  z-index: 8;
  /* top: 0rpx; */
  background: #EE5253;
  color: #fff;
  height: 50rpx;
  min-width: 112rpx;
  line-height: 50rpx;
  border-bottom-left-radius: 25rpx;
  border-top-left-radius: 25rpx;
  overflow: hidden;
  font-size: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0rpx 16rpx;
  margin-top: -52rpx;
}
.share-reamin image {
  filter: grayscale(0%) brightness(1000%);
}
.goods-price {
  font-size: 22rpx;
  color: #5f5f5f;
  display: flex;
  justify-content: flex-start;
  line-height: 36rpx;
  height: 36rpx;
  padding: 22rpx 0;
}

.goods-price .price {
  color: #ff686b;
  font-size: 30rpx;
}

.goods-price .front-money {
  color: #FF3C3C;
  margin-left: 49rpx;
}

.goods-price .front-money .price {
  font-size: 30rpx;
  color: #f33;
  font-weight: bold;
}

.share-reamin image {
  width: 29rpx;
  height: 27rpx;
  margin-right: 8rpx;
}

/* 佣金相关 */

.commission-box {
  background: #ff8561;
  height: 110rpx;
  width: 100%;
  box-sizing: border-box;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.commission-box view {
  font-size: 30rpx;
  color: #fff;
}

.commission-box view>text {
  font-size: 40rpx;
  font-weight: bold;
}

.commission-box button {
  width: 234rpx;
  height: 66rpx;
  font-size: 30rpx;
  border-radius: 33rpx;
  border: 2rpx solid #fff;
  line-height: 66rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: url('http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconShare.png') no-repeat 21rpx;
  background-size: 35rpx 33rpx;
  margin: 0;
  padding: 0 0 0 60rpx;
}

.commission-box view image {
  width: 35rpx;
  height: 33rpx;
  margin-right: 9rpx;
}

/*商品名称价格等  */

.goods-info-box {
  padding: 10rpx 0;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  margin-bottom: 20rpx;
}
.promotion_price_box {
  position: relative;
  z-index: 10;
  color: #fff;
  height: 129rpx;
  box-sizing: border-box;
  padding-bottom: 10rpx;
}
.promotion_price_box view,
.promotion_price_box text {
  position: relative;
}
.promotion_price_box1 {
  display: flex;
  align-items: center;
  padding-top: 5rpx;
  height: 40rpx;
}
.cuxiao_bg {
  position: absolute;
  left: 0;
  top: -42rpx;
  z-index: 0;
  width: 100%;
  height: 171rpx;
}
.seckill_bg {
  top: -42rpx;
}
.cuxiao_icon {
  position: absolute;
  left: 46rpx;
  top: -27rpx;
  width: 45rpx;
  height: 36rpx;
}
.pre_icon {
  width: 39rpx;
  height: 39rpx;
}
.seckill_icon {
  left: 46rpx;
  top: -30rpx;
  width: 39rpx;
  height: 39rpx;
}
.promotion_price_box .goods-nowPrice {
  font-size: 43rpx;
  margin-left: 27rpx;
  margin-right: 11rpx;
  font-weight: 700;
}
.promotion_price_box .goods-nowPrice text {
  font-size: 25rpx;
  font-weight: 400;
}
.promotion_price_box .goods-oldPrice {
  font-size: 22rpx;
  text-decoration: line-through;
  top: -6rpx;
}
.promotion_price_box .promotion_label {
  font-size: 22rpx;
  margin-left: 44rpx;
  margin-bottom: 15rpx;
  padding-top: 20rpx;
}
.promotion_price_box .price-item {
  font-size: 25rpx;
  margin-left: 40rpx;
}
.promotion_price_box .price-item .price {
  font-size: 43rpx;
  font-weight: 700;
}
.seckill_label {
  position: absolute;
  top: 20rpx;
  font-size: 22rpx;
  margin-left: 44rpx;
  margin-bottom: 15rpx;
}
.goods-info-box > view {
  margin-right: 24rpx;
  margin-left: 24rpx;
}

.goods-info-box .goods-name {
  font-size: 35rpx;
  line-height: 64rpx;
  color: #454545;
  font-weight: bold;
  position: relative;
  display: flex;
  justify-content: space-between;
  /* width: calc(100% - 144rpx); */
}
/* .desc-share .goods-desc */

.goods-info-box .goods-name>view {
  display: -webkit-box !important;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1 1 auto;
}
.goods-info-box .goods-name>view:last-of-type {
  flex: 0 0 auto;
  color: #666;
}

.goods-info-box .goods-name>view {
  -webkit-line-clamp: 2;
}

/* .desc-share .goods-desc {
  width: 70vw;
} */

.goods-info-box.group .goods-name {
  font-size: 30rpx;
  line-height: 50rpx;
}

.goods-info-box .goods-name>view {
  font-size: 35rpx;
  line-height: 50rpx;
}

.goods-info-box .label-item {
  padding: 0 10rpx;
  height: 48rpx;
  border-radius: 6rpx;
  background: #009f55;
  color: #fff;
  font-size: 28rpx;
  line-height: 48rpx;
  font-weight: normal;
  display: inline-block;
  margin-right: 8rpx;
  vertical-align: top;
  margin-top: 8rpx;
}

.goods-info-box .goods-name text {
  display: inline-block;
}

.goods-info-box .goods-name .goods-soldNum {
  display: inline-block;
  font-size: 24rpx;
  font-weight: normal;
  color: #333;
}

.goods-info-box .goods-delivery-info {
  color: #666;
  font-size: 24rpx;
  line-height: 36rpx;
  padding: 10rpx 0;
  display: flex;
  align-items: flex-start;
}

.goods-info-box .goods-delivery-info image {
  width: 36rpx;
  height: 24rpx;
  margin-right: 15rpx;
  margin-top: 6rpx;
  flex-shrink: 0;
}

.desc-share {
  position: relative;
  min-height: 50rpx;
  line-height: 50rpx;
  font-size: 21rpx;
}

.deliveryDesc {
  color: #ff9f43;
  font-size: 24rpx;
}

.goods-info-box .goods-desc {
  color: #000;
  font-size: 26rpx;
  /* margin: 16rpx 0rpx; */
  display: block;
  display: -webkit-box !important;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 10rpx;
}
.desc-soldNum {
  display: flex;
  justify-content: space-between;
  /* width: 530rpx; */
  align-items: center;
  /* line-height: 44rpx; */
  /* margin: 10rpx 0 0 0; */
  flex: 1;
}

.desc-soldNum .goods-desc {
  width: 306rpx;
  margin: 0;
  color: #666;
  font-size: 24rpx;
}

/* .goods-info-box.group .goods-soldNum {
  display: inline-block;
  font-size: 24rpx;
  font-weight: normal;
  color: #454545;
} */
.goods-info-box .goods-soldNum {
  display: inline-block;
  font-size: 24rpx;
  font-weight: normal;
  color: #333;
}

.goods-info-box .goods-tag {
  font-size: 26rpx;
  min-height: 26rpx;
  line-height: 26rpx;
}

.goods-info-box .goods-tag text {
  display: inline-block;
  height: 40rpx;
  line-height: 38rpx;
  padding: 0rpx 10rpx;
  text-align: center;
  border: solid 2rpx red;
  border-radius: 20rpx;
  margin: 20rpx 10rpx 20rpx 0rpx;
}

.goods-info-box .goods-price-box {
  overflow: hidden;
  line-height: 48rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10rpx;
}

.goods-info-box .goods-nowPrice {
  color: #FF7121;
  font-size: 44rpx;
  margin-right: 16rpx;
  display: inline-block;
  font-weight: 700;
}

.goods-info-box .goods-nowPrice text {
  font-size: 22rpx;
}

.goods-info-box .goods-oldPrice {
  color: #c1c1c1;
  font-size: 22rpx;
  text-decoration: line-through;
}
.goods-info-box .sold_box { 
  display: flex;
  border-top: 1px solid #EEEEEE;
  margin-top: 12rpx;
  padding-top: 12rpx;
  margin-right: 0;
  margin-left: 0;
  padding-left: 24rpx;
  align-items: center;
  justify-content: space-between;
}
.goods-info-box .sold_box text {
  color: #999999;
}
.goods-info-box .goods-soldNum {
  /* float: right; */
  font-size: 22rpx;
  color: #333;
  flex: 1;
  height: 100%;
  /* display: flex;
  justify-content: center;
  align-items: center; */
}

.goods-info-box .share-commission {
  float: right;
  font-size: 24rpx;
  color: #FF9F43;
}

/* 图文详情 */

.goods-imgtext {
  background-color: #fff;
  margin-top : 20rpx;
  /* margin-bottom: 120rpx; */
}

.botton-block {
  height: 80rpx;
  width: 100%;
}

.goods-imgtext>text {
  display: block;
  text-indent: 24rpx;
  font-size: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
}

.goods-imgtext image {
  width: 100%;
  display: block;
}

/* 操作 */

.handle-box {
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  display: flex;
  border-top: 1rpx solid #dadada;
  height: 160rpx;
  padding: 15rpx 0 30rpx 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #fff;
}

.handle-box view {
  height: 74rpx;
  text-align: center;
  line-height: 74rpx;
  /* color: #fff; */
  font-size: 30rpx;
  position: relative;
}
.handle-box view:nth-of-type(3) {
  /* width: 480rpx; */
  background-color: #fff;
}

.handle-box view button {
  width: 100%;
  height: 74rpx;
  line-height: 74rpx;
  border-radius: 0rpx;
  background: #FF9F43;
  color: #fff;
  font-size: 30rpx;
  /* font-weight: bold; */
  padding: 0;
  display: inline-block;
  /* top: -10rpx; */
}
.handle-box view.normal-button {
  width: 100%;
  height: 74rpx;
  box-sizing: border-box;
  margin: 0 15rpx;
  display: flex;
  flex: 1 0 none;
  border-radius: 37rpx;
  overflow: hidden;
}
.no-data {
  font-size: 24rpx;
  line-height: 48rpx;
  padding: 24rpx 0;
  color: #666;
  display: flex;
  justify-content: center;
}
.scroll_box {
  height: 620rpx;
  padding-right: 20rpx;
}
.scroll-view_H {
  display: flex;
  height: 550rpx;
}
.travel_item {
  position: relative;
  min-width: 340rpx;
  width: 340rpx;
  border: 1px solid #ccc;
  height: 510rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
  box-sizing: border-box;
  padding: 15rpx;
}
.travel_item view {
  margin-bottom: 10rpx;
}
.travel_item .enrollStartDate {
  margin-top: 40rpx;
}
.travel_item .enrollEndDate {
  margin-bottom: 30rpx;
}
.travel_item .choose {
  margin: 0 auto;
  width: 150rpx;
  color: #fff;
  background-color: #009f55;
  border-radius: 8rpx;
  text-align: center;
  box-sizing: border-box;
  line-height: 50rpx;
}

.modal-body1 .modal-content {
  background: #fff;
  width: 624rpx;
  padding: 36rpx 30rpx 20rpx;
  min-height: 406rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  /* margin: 40% auto; */
  position: relative;
}
.subscribe-close {
  position: absolute;
  right: 10rpx;
  top: 10rpx;
  width: 70rpx;
  height: 70rpx;
}
.subscribe-close image {
  width: 100%;
  height: 100%;
}
.travel_item .tag {
  position: absolute;
  right: 0;
  top: 20rpx;
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.travel_item .tag1 {
  top: 20rpx;
  width: 100rpx;
  height: 100rpx;
}
.travel_item .tag image {
  width: 100%;
  height: 100%;
}
.title {
  text-align: center;
  font-size: 40rpx;
}
.button-box {
  display: flex;
  margin-top: 80rpx;
}
.modal-content .content {
  margin-top: 30rpx;
}
.modal-content .content view {
  display: flex;
  margin-bottom: 25rpx;
  align-items: center;
}
.modal-content .content view text {
  flex: 0 0 auto;
  width: 160rpx;
  font-size: 28rpx;
}
.modal-content .content view > text:last-of-type {
  flex: 1 1 auto;
  border-radius: 8rpx;
  border: 1px solid #ccc;
  height: 50rpx;
  display: flex;
  align-items: center;
  padding: 0 10rpx;
}
.choose_tip {
  font-size: 28rpx;
  margin-top: 30rpx;
}
</style>