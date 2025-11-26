<template>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<!-- 商品列表 -->
<view class="service-content">
  <view class="store-info">
      <view>
        <view class="store-text">
          <image :src="state.imagesPath.houseIcon" mode="heightFix"></image>
          {{state.storeInfo.name}}
        </view>
        <view class="store-msg" :style="'color: ' + state.themeColor" @click.stop="changeStore">
          切换门店
          <image class="right-point" :src="state.imagesPath.iconRight2" mode="heightFix"></image>
        </view>
      </view>
      <view>
        <view class="store-text">
          <image :src="state.imagesPath.floristTime" mode="heightFix"></image>
          营业时间：{{state.storeInfo.storeHours}}
        </view>
      </view>
      <view>
        <view class="store-text">
          <image :src="state.imagesPath.floristAddress" mode="heightFix"></image>
          {{state.storeInfo.address}}
        </view>
        <view class="store-msg">
          <image :src="state.imagesPath.floristIconStoreNav" @click.stop="navToStore" mode="heightFix"></image>
          <image :src="state.imagesPath.floristMobile" @click.stop="doPhone" :data-phone="state.storeInfo.tel" mode="heightFix"></image>
        </view>
      </view>
  </view>
  <scroll-view scroll-y="true" @scrolltolower="onPageChange">
    <view class="service-item" v-for="(item , index) in state.serviceList" :data-id="item.id" @click="toDetail">
      <view class="service-msg">
        <view class="item-img">
          <image :src="item.avatar || item.imageUrl" mode="widthFix"></image>
        </view>
        <view class="item-text">
          <view>
            <view class="item-title">
              {{item.name || item.nickname || item.username}}
              <image v-if="state.isPersonnel && item.gradeImg" class="gradeImg" :src="item.gradeImg" mode="heightFix"></image>
            </view>
            <view class="item-dec">{{item.description || item.describe}}</view>
            <view class="gm-goods-labels" v-if="item.promotions && item.promotions.length > 0 && !state.isPersonnel">
              <view v-for="(item , index) in item.promotions" :key="index" :data-id="index">
                <view :style="'border-color:rgb(' + item.color + ')'" class="items">{{item.labelName}}</view>
              </view>
            </view>
          </view>
          <view class="item-pirce">
            <view class="item-price-lt">
              <text :style="'color: ' + state.themeColor + ';'">￥{{item.sellPrice || 0}}<text :style="'padding-left: 4rpx;color: ' + state.themeColor + ';font-size: 24rpx'">起</text></text>
              <text v-if="item.originalPrice && item.originalPrice > item.sellPrice">￥{{item.originalPrice || 0}}<text style="font-weight: 400;color: #999;font-size: 24rpx">起</text></text>
            </view>
            <view class="item-price-rt" @click.stop="toDetail" :data-id="item.id" :style="'background-color: ' + state.themeColor + ';'">预约</view>
          </view>
        </view>
      </view>
      <view class="service-btm">
        <view>
          <image :src="state.imagesPath.floristPeopleNum" mode="heightFix"></image>
          <text>{{item.soldCount || '0'}}人</text>预约过
        </view>
        <view v-if="!state.isPersonnel">
          <image :src="state.imagesPath.floristDuration" mode="heightFix"></image>
          服务时长<text>{{state.serviceDuration1 ? (state.serviceDuration1 ? state.serviceDuration1 + '-' : '') + state.serviceDuration : '-'}}分钟</text>
        </view>
      </view>
    </view>
    <view class="no-data" v-if="state.serviceList.length === 0">
      <image :src="state.imagesPath.imgNoData"></image>
      <button :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'" size="mini" @click="toHome">随便逛逛</button>
    </view>
  </scroll-view>
</view>
</template>
<script setup>
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _apiFloristServiceJs from "@/service/api/newretail/floristService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

const floristService = _apiFloristServiceJs;
const themeManager = _utilsThemeManagerJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const ADDRESS = _utilsAddressJs;
const sysService = _apiSystemServiceJs;
const state = reactive({
  serviceDuration: '',
  serviceDuration1: '',
  serviceTimeInterval: '',
  isPersonnel: false,
  // 是否服务人员列表
  storeInfo: {},
  serviceList: [],
  navigationBarTitle: '预约服务',
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  userInfo: {},
  hasUserInfo: false,
  isMember: false,
  imagesPath: IMGAGESPATH
});
function getServiceConfig() {
  sysService.query('serviceDuration,serviceTimeInterval').then(res => {
    if (res && res.length > 0) {
      res.forEach(configItem => {
        if (configItem.key == 'serviceDuration' && configItem.value) {
          state.serviceDuration1 = parseInt(configItem.value / 2);
        }
        configItem.key = configItem.value;
      });
    }
  }).catch(err => {});
}
onLoad(function (options) {
  state.isPersonnel = options && options.type == 'florist';
  getServiceConfig();
});
onReady(function () {
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
});
onShow(function () {
  app.globalData.storeInfo = app.globalData.storeInfo && app.globalData.storeInfo.id ? app.globalData.storeInfo : uni.getStorageSync('storeIdactive');
  if (!app.globalData.storeInfo || !app.globalData.storeInfo.id) {
    getStoreInfo();
  } else {
    state.storeInfo = app.globalData.storeInfo;
    getServiceByStoreId();
  }
});
async function getStoreInfo(options) {
  if (!app.globalData.storeInfo || !app.globalData.storeInfo.id) {
    // 获取到当前的地理位置，查找出最近的门店
    await ADDRESS.getAllStore1();
    state.storeInfo = app.globalData.storeInfo;
    await getServiceByStoreId();
  }
}
onHide(function () {});
onUnload(function () {});
function handleUserLogin() {
  const that = this;
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo;
    state.userInfo = {
      ...user.wxaUser
    };
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true;
      state.isMember = true;
    } else {
      // 不是会员跳转授权页
      state.userInfo = user.wxaUser;
      state.hasUserInfo = true;
      state.isMember = false;
      NAVPAGE.toAuthorize();
    }
  }
}
function toHome() {
  NAVPAGE.toHome();
}
function onPageChange() {
  if (state.serviceList && state.total > state.serviceList.length) {
    getServiceByStoreId(state.page + 1);
  }
}
function getServiceByStoreId(page) {
  let store = app.globalData.storeInfo.id;
  let fnName = state.isPersonnel ? 'serviceStaffQuery' : 'productQuery';
  if (state.loading) return false;
  state.loading = true;
  uni.showLoading();
  if (!page) {
    state.page = 1;
    state.total = 11;
    state.serviceList = [];
  } else {
    state.page = page;
  }
  floristService[fnName]({
    storeId: store,
    page: state.page,
    pageSize: 10
  }).then(res => {
    if (res) {
      state.serviceList = state.serviceList.concat(res.records);
      state.total = res.recordCount;
    }
  }).finally(() => {
    state.loading = false;
    uni.hideLoading();
  });
}
function toDetail(val) {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    NAVPAGE.toServiceDetails(`?productId=${val.currentTarget.dataset.id}&type=${state.isPersonnel ? 'florist' : 'service'}&lastPage=serviceList`);
  } else {
    NAVPAGE.toAuthorize();
  }
}
function doPhone(e) {
  console.log(e);
  uni.makePhoneCall({
    phoneNumber: app.globalData.storeInfo.tel
  });
}
function navToStore(e) {
  if (app.globalData.storeInfo && app.globalData.storeInfo.longitude != null && app.globalData.storeInfo.longitude != null) {
    const latitude = parseFloat(app.globalData.storeInfo.latitude);
    const longitude = parseFloat(app.globalData.storeInfo.longitude);
    uni.openLocation({
      latitude,
      longitude,
      scale: 28,
      name: app.globalData.storeInfo.name,
      address: app.globalData.storeInfo.address
    });
  }
}
function changeStore() {
  NAVPAGE.toSelectStore();
}
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
page {
  background-color: #f1f3f6;
  height: 100%;
}

.service-content {
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  overflow: hidden;
}
.service-item {
  min-height: 315rpx;
  background-color: #fff;
  border-radius: 30rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.service-item .item-img {
  width: 200rpx;
  height: 200rpx;
  overflow: hidden;
  flex: 0 0 auto;
}

.service-item .item-img image {
  width: 100%;
  max-height: 100%;
  border-radius: 25rpx;
}

.service-item .item-title {
  font-weight: bold;
  font-size: 28rpx;
  color: #333333;
  margin: 0 0 16rpx;
  display: flex;
  align-items: center;
}

.service-item .item-dec {
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
}

.service-item .item-pirce {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 20rpx;
  box-sizing: border-box;
  width: 100%;
}

.service-item .item-pirce .item-price-lt {
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
}

.service-item .item-pirce .item-price-lt text:nth-of-type(1) {
  font-size: 28rpx;
  color: #FC6700;
  /* font-weight: bold; */
}

.service-item .item-pirce .item-price-lt text:nth-of-type(2) {
  text-decoration: line-through;
  display: inline-block;
  margin-left: 14rpx;
  font-size: 20rpx;
  color: #999;
}

.service-item .item-pirce .item-price-rt {
  width: 110rpx;
  height: 50rpx;
  background: #FC6700;
  border-radius: 25rpx;
  color: #fff;
  text-align: center;
  line-height: 50rpx;
  font-size: 24rpx;
}

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background: #ffffff; */
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  /* margin-top: 20%; */
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  /* position: unset; */
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}
.store-info {
  padding: 25rpx 22rpx;
  border-radius: 20rpx;
  background-color: #fff;
}
.store-info > view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 26rpx;
  margin-bottom: 30rpx;
}
.store-info > view:last-of-type {
  margin-bottom: 0;
}
.store-info > view image {
  height: 30rpx;
  width: auto;
  flex: 0 0 auto;
}
.store-info > view > view {
  display: flex;
  align-items: center;
}
.store-info .store-text {
  max-width: 450rpx;
}
.store-info .store-text image {
  margin-right: 20rpx;
}
.store-info .store-msg image {
  margin-left: 26rpx;
}
.store-info .store-msg .right-point {
  height: 26rpx;
  margin-left: 16rpx;
}
.service-msg {
  display: flex;
  align-items: center;
  padding: 26rpx 20rpx;
}
.service-msg > view {
  min-height: 200rpx;
}
.item-text {
  display: flex;
  /* align-items: center; */
  justify-content: space-between;
  flex-direction: column;
  margin-left: 22rpx;
  flex: 1 1 auto;
}
.service-btm {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #F4F4F4;
  padding: 18rpx 20rpx;
  font-size: 24rpx;
}
.service-btm view {
  display: flex;
  align-items: center;
  color: #999999;
}
.service-btm view text {
  color: #000000;
}
.service-btm image {
  height: 24rpx;
  margin-right: 14rpx;
  max-width: 100rpx;
}
.gradeImg {
  height: 28rpx;
  width: auto;
  max-width: 100%;
  margin-left: 13rpx;
}
scroll-view {
  margin-top: 20rpx;
  height: calc(100vh - 424rpx);
}
</style>