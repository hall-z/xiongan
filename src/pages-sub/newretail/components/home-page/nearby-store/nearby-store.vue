<template>
<!--components/home-page/nearby-store/nearby-store.wxml-->
<view>
<view class="nearStore-box-loading" :hidden="loaded">
  <view class="top"></view> 
  <view class="middle"></view>  
</view>
<view class="nearStore-box-min" :hidden="!loaded || nearStoreStyle != 2">
  <view class="store-info">
    <view class="left-icon">
      <image lazy-load="" mode="widthFix" :src="imagesPath.addressWhite"></image>
    </view>
    <view class="store-name" v-if="storeInfo.name">
      {{storeInfo.name}}
    </view>
    <view v-else class="store-name">
      暂未获取到门店信息
    </view>
  </view>
  <view class="distance" @click="changeStore">
    <!-- <image lazy-load src='{{imagesPath.iconNearStoreNav}}'></image> -->
    <text>{{filtInt(storeInfo.distance)}}km</text>
    <image lazy-load="" class="right-icon" mode="widthFix" :src="imagesPath.iconRightWhite"></image>
  </view>
</view>
<view class="nearStore-box" :hidden="!loaded || nearStoreStyle == 2">
  <view class="title">
    附近门店
    <view class="more" @click="changeStore">
      更多门店
      <image lazy-load="" class="right-icon" :src="imagesPath.iconRight2"></image>
    </view>
  </view>
  <view class="nearStore-card">
    <image lazy-load="" class="nearStore-card-bg" :src="imagesPath.iconNearStoreBg"></image>
    <view class="nearStore-nav" @click="navToStore">
      <image lazy-load="" :src="imagesPath.iconNearStoreNav"></image>
      <text>距您{{filtInt(storeInfo.distance)}}km</text>
    </view>
    <view class="store-info">
      <view class="left-icon">
        <image lazy-load="" :src="imagesPath.iconNearStoreAddress"></image>
      </view>
      <view v-if="storeInfo.name">
        <text>{{storeInfo.name}}</text>
        <text>{{storeInfo.address}}</text>
      </view>
      <view v-else>
        <text>暂未获取到门店信息</text>
        <text></text>
      </view>
    </view>
    <view class="store-item tel">
      <view class="left-icon">
        <image lazy-load="" :src="imagesPath.iconNearStoreTel" mode="widthFix"></image>
      </view>
      <view @click="callPhone">
        联系电话：
        <text class="color-69cbfd">{{storeInfo.tel ? storeInfo.tel : "暂无"}}</text>
      </view>
    </view>
    <view class="store-item time">
      <view class="left-icon">
        <image lazy-load="" :src="imagesPath.iconNearStoreTime" mode="widthFix"></image>
      </view>
      <text>营业时间：{{storeInfo.storeHours ? storeInfo.storeHours : "暂无"}}</text>
    </view>
    <view class="store-item wechat">
      <view class="left-icon">
        <image lazy-load="" :src="imagesPath.iconNearStoreWeChat" mode="widthFix"></image>
      </view>
      <text @click="copyWeChatCode" v-if="storeInfo.wxCode">微信号：{{storeInfo.wxCode}}（点击复制）</text>
      <text v-else>微信号：暂无</text>
    </view>
    <view class="store-promotion" v-if="storeTags.length > 0">
      <view class="store-promotion-item" v-for="(item , index) in storeTags" :key="i" v-if="item">{{item}}</view>
    </view>
  </view>
</view></view>
</template>
<script setup>
import _lazyLoadPageLazyLoadBaseJs from "../../lazy-load-page/lazy-load-base";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiBannerServiceJs from "@/service/api/newretail/bannerService";
import { reactive , watch} from "vue";
const app = getApp();
// components/home-page/nearby-store/nearby-store.js
const bannerService = _apiBannerServiceJs;
const storeService = _apiStoreServiceJs;
const THEME = _utilsThemeManagerJs;
const UTILS = _utilsUtilsJs;
const IMGAGESPATH = _utilsImagesPathJs;
const NAVPAGE = _utilsNavPageJs;
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  loaded: false,
  noticeList: [],
  storeId: "",
  storeInfo: null,
  storeTags: []
});
const props = defineProps({
  show: {
    // 属性名
    type: Boolean,
    value: false
  },
  pageScrollData: {
    // 属性名
    type: Object,
    value: {}
  },
  nearStoreStyle: {
    // 属性名
    type: String,
    value: ""
  },
  refreshType: {
    // 属性名
    type: String,
    value: ""
  }
});
function reload(refresh = false) {
  const that = this;
  if (!state.loaded) {
    lazyLoadBase.determineComponentInVisibleArea(".nearStore-box-loading", that).then(res => {
      if (res) {
        state.loaded = true;
        handleStore();
      }
    }).catch(err => {
      console.log(err);
    });
  } else if (refresh) {
    handleStore();
  }
}
async function handleStore() {
  const that = this;
  if (app.globalData.storeInfo) {
    // 更新页面门店相关数据，显示当前门店
    const storeInfo = app.globalData.storeInfo;
    console.log(storeInfo, 'storeInfostoreInfo');
    let distance = null;
    if (storeInfo.userLatitude != null && storeInfo.userLongitude != null) {
      distance = UTILS.distance(storeInfo.userLatitude, storeInfo.userLongitude, storeInfo.latitude, storeInfo.longitude);
      distance = distance.toFixed(3);
    } else if (storeInfo.distance && storeInfo.distance != null) {
      distance = storeInfo.distance && storeInfo.distance != "***" ? parseFloat(storeInfo.distance).toFixed(3) : "***";
    }
    app.globalData.storeInfo = {
      ...storeInfo,
      distance: distance ? distance : "***"
    };
    state.storeInfo = app.globalData.storeInfo;
    state.storeId = app.globalData.storeInfo.id;
    console.log(state.storeInfo, 'storeInfostoreInfo');
    // 获取门店标签
    getStoreInfo(state.storeId);
  }
}
function getStoreInfo(storeId) {
  const that = this;
  storeService.getById(storeId).then(res => {
    let tags = [];
    if (res.tags != null) {
      let tagsStr = res.tags;
      let tagsEndStr = tagsStr.charAt(tagsStr.length - 1);
      if (tagsEndStr == ',') {
        tagsStr = tagsStr.substring(0, tagsStr.length - 1);
      }
      tagsStr.split(",").reverse().forEach((el, index) => {
        if (index < 3) {
          tags.push(el);
        }
      });
      state.storeTags = tags;
    }
    if (res) {
      console.log(res);
      console.log(state.storeInfo);
      console.log(UTILS.distance(state.storeInfo.userLatitude, state.storeInfo.userLongitude, res.latitude, res.longitude));
      console.log('重算');
      state.storeInfo = {
        ...state.storeInfo,
        ...res,
        distance: UTILS.distance(state.storeInfo.userLatitude, state.storeInfo.userLongitude, res.latitude, res.longitude).toFixed(3)
      };
    }
  }).catch(err => {
    console.log('获取门店信息失败');
    console.log(err);
  });
}
function changeStore() {
  NAVPAGE.toSelectStore();
}
function navToStore() {
  const storeInfo = state.storeInfo;
  if (storeInfo.longitude != null && storeInfo.longitude != null) {
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
}
function callPhone() {
  let tel = '';
  if (tel === '' && app.globalData.storeInfo != null && app.globalData.storeInfo.tel != null && app.globalData.storeInfo.tel !== '') {
    tel = app.globalData.storeInfo.tel;
  } else {
    tel = app.globalData.servicePhone;
  }
  if (tel !== '') {
    uni.showModal({
      title: '提示',
      content: '确认要拨打此电话' + tel,
      success: function (res) {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: tel
          });
        } else if (res.cancel) {}
      }
    });
  }
}
function copyWeChatCode() {
  const wxCode = state.storeInfo.wxCode;
  uni.setClipboardData({
    data: wxCode,
    success(res) {
      uni.hideToast();
      uni.showToast({
        title: "已成功复制微信号 去添加朋友",
        icon: 'none',
        duration: 2000
      });
    }
  });
}

// Watch listeners converted from observers
watch(() => props.show, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal) {
          reload(true);
        }
});

watch(() => props.value, (newVal, oldVal) => {
  // 属性值变化时执行
        reload(false);
});

watch(() => props.refreshType, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal !== "" && newVal !== "USER") {
          reload(true);
        }
});

</script>
<style scoped>
/* components/home-page/nearby-store/nearby-store.wxss */
/* loading */
.nearStore-box-loading {
  padding: 30rpx 40rpx 0 40rpx;
}
.nearStore-box-loading .top {
  width: 100%;
  height: 50rpx;
  background: #EFEFEF;
}
.nearStore-box-loading .middle {
  width: 670rpx;
  height: 404rpx;
  margin-top: 35rpx;
  border-radius: 6rpx;
  background: #EFEFEF;
}
.nearStore-box {
  background-color: #fff;
  padding: 10rpx 20rpx 0;
  border-radius: 20rpx;
  margin: 20rpx;
}
.nearStore-box .title {
  font-size: 36rpx;
  line-height: 50rpx;
  color: #212021;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nearStore-box .title .more {
  font-size: 28rpx;
  color: #919191;
  height: 100%;
  display: flex;
  align-items: baseline;
}
.nearStore-box .right-icon {
  width: 12rpx;
  height: 23rpx;
  margin-left: 10rpx;
  margin-top: -2rpx;
}
.nearStore-card {
  width: 640rpx;
  /* height: 396rpx; */
  margin-top: 35rpx;
  border-radius: 6rpx;
  padding-left: 30rpx;
  padding-bottom: 8rpx;
  overflow: hidden;
  box-shadow: 1px 2px 5px 0px #dedede;
  position: relative;
}
.nearStore-card-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
.nearStore-card .store-info {
  display: flex;
  align-items: flex-start;
  font-size: 24rpx;
  line-height: 36rpx;
  color: #919191;
  padding-top: 44rpx;
  margin-bottom: 13rpx;
  width: 80%;
}
.nearStore-card .store-info .left-icon {
  width: 44rpx;
  display: flex;
  justify-content: flex-start;
  margin-top: 6rpx;
  flex-shrink: 0;
}
.nearStore-card .store-info .left-icon image {
  width: 28rpx;
  height: 37rpx;
}
.nearStore-card .store-info>view:last-of-type {
  width: calc(100% - 104rpx);
}
.nearStore-card .store-info text {
  display: block;
  width: 100%;
}
.nearStore-card .store-info text:first-of-type {
  font-size: 36rpx;
  line-height: 48rpx;
  margin-bottom: 23rpx;
  font-weight: bold;
  color: #212021;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nearStore-card .store-info text:last-of-type {
  font-size: 28rpx;
  line-height: 32rpx;
  color: #919191;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.nearStore-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 34rpx;
  top: 43rpx;
  font-size: 22rpx;
  line-height: 32rpx;
  color: #919191;
}
.nearStore-nav image {
  width: 56rpx;
  height: 56rpx;
  margin-bottom: 15rpx;
}
.store-item {
  display: flex;
  font-size: 24rpx;
  line-height: 48rpx;
  color: #333;
  align-items: center;
  margin-bottom: 1rpx;
}
.store-item .left-icon {
  width: 44rpx;
  display: flex;
  justify-content: flex-start;
}
.store-item .left-icon image {
  width: 28rpx;
  height: 37rpx;
}
.store-item.tel .left-icon image {
  /* width: 30rpx;
  height: 29rpx; */
}
.store-item.time .left-icon image {
  /* width: 31rpx;
  height: 31rpx; */
}
.store-item.wechat .left-icon image {
  /* width: 37rpx;
  height: 30rpx; */
}
.color-69cbfd {
  color: #69cbfd;
}
/* 门店促销 */
.store-promotion {
  display: flex;
  justify-content: flex-start;
  padding-left: 43rpx;
  /* height: 44rpx; */
  width: calc(100% - 103rpx);
  flex-wrap: wrap;
  overflow: hidden;
}
.store-promotion-item {
  padding: 0 10rpx;
  height: 40rpx;
  font-size: 24rpx;
  color: #ffa300;
  border: 1px solid #ffa300;
  border-radius: 4rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 9rpx 6rpx 0;
  box-sizing: border-box;
}
.nearStore-box-min {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15rpx 20rpx;
  margin: 20rpx;
  height: 50rpx;
  border-radius: 10rpx;
  color: #fff;
  background-color: rgba(0,0,0,0.5);
  font-size: 32rpx;
}
.nearStore-box-min .store-info {
  display: flex;
  align-items: center;
}
.nearStore-box-min .store-info .store-name {
  width: 300rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 10rpx;
}
.nearStore-box-min .left-icon image {
  width: 50rpx;
  vertical-align: middle;
}
.distance .right-icon {
  width: 28rpx;
}
</style>