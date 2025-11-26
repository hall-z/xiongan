<template>
<!--components/home-page/search-bar/search-bar.wxml-->
<!-- <view class="top-info container"  catch:tap="toggleOfficialPopup" wx:if="{{loaded}}" style="background-color: {{titlebarBackgroundColour}};"> -->
<view class="top-info container" @click.stop="toggleOfficialPopup" v-if="loaded">
    <!-- <view class="location" bindtap="changeStore">
    <image lazy-load class="shop-img" src="{{imagesPath.iconIndexStore}}" ></image>
    <text>{{storeInfo.name}}</text>
    <image lazy-load class="right-img" src="{{imagesPath.iconIndexStoreRight}}" ></image>
  </view> -->
  <view class="topHandleView" :style="'border-color: ' + theme.color" @click="handleConfirm" :hidden="searchLabelShow">
    <image lazy-load="" style="width:26rpx;height:26rpx" :src="imagesPath.newSearchIcon"></image>
    <view>请输入搜索关键词</view>
    <view :style="'background-color: ' + theme.color + ';'" class="search-btn">搜索</view>
    <!-- <form  bindsubmit="toMemberCard">
      <view class="member-code">
        <image lazy-load src='{{imagesPath.iconMemberCard}}'></image>
        <button wx:if="{{!hasUserInfo}}" class="MbrQrcodeBtn" bindtap="getUserInfo"></button>
        <button wx:else class="MbrQrcodeBtn" form-type="submit"></button>
      </view>
    </form> -->
  </view>
  <view class="order-box" @click.stop="goOrderList">
    <image :src="imagesPath.newHomeOrderIcon" mode="widthFix"></image>
    订单
  </view>
</view>
<view v-else class="top-search-box">
  <view class="location">
  </view>
  <view class="topHandleView">
    <view class="index-search-box">
    </view>
    <view class="member-code">
    </view>
  </view>
</view>
<view class="top-search-block" :hidden="!isSearchFixed"></view>
</template>
<script setup>
import _homePageCommonBehaviorJs from "../homePageCommonBehavior";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _lazyLoadPageLazyLoadBaseJs from "../../lazy-load-page/lazy-load-base";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
// import { ready } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
const app = getApp();
// components/home-page/search-bar/search-bar.js
const IMGAGESPATH = _utilsImagesPathJs;
const THEMEMANAGER = _utilsThemeManagerJs;
const NAVPAGE = _utilsNavPageJs;
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs;
const AUTHORIZE = _utilsAuthorizeJs;
const homePageCommonBehavior = _homePageCommonBehaviorJs;
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //  处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')';
  } else {
    return sColor;
  }
};
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  theme: THEMEMANAGER,
  loaded: false,
  searchText: "",
  storeId: "",
  storeInfo: {
    name: ""
  },
  isSearchFixed: false
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
    value: null
  },
  refreshType: {
    // 属性名
    type: String,
    value: ""
  },
  isShowCollection: {
    // 属性名
    type: Boolean,
    value: false
  }
});
ready(function () {
  state.titlebarBackgroundColour = app.globalData.systemConfigure && app.globalData.systemConfigure.titlebarBackgroundColour;
  state.titlebarFotColour = app.globalData.systemConfigure && app.globalData.systemConfigure.titlebarFotColour;
  state.homeBackgroundColour = app.globalData.systemConfigure && app.globalData.systemConfigure.homeBackgroundColour;
  state.homeBackgroundImage = app.globalData.systemConfigure && app.globalData.systemConfigure.homeBackgroundImage;
  let navHeight = app.globalData.navHeight;
  const screenWidth = app.globalData.systemInfo.screenWidth;
  const rate = screenWidth / 750;
  if (state.isShowCollection) {
    navHeight = navHeight + 86 * rate;
  }
  state.navHeight = navHeight;
  state.theme = {
    color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + app.globalData.uiconfig.themeColor + ';' : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background: ' + app.globalData.uiconfig.themeColor + ';' : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';' : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background: linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background: linear-gradient(-270deg, #FF9F43, #F13327);",
    mainColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : "border-color:rgba(255,159,67, 0.4);",
    mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
    BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color:rgba(255,159,67, 0.1);"
  };
});
function reload(refresh = false) {
  const that = this;
  if (!state.loaded) {
    lazyLoadBase.determineComponentInVisibleArea(".top-search-box", that).then(res => {
      console.log(res);
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
function handleStore() {
  if (app.globalData.storeInfo) {
    state.storeId = app.globalData.storeInfo.id;
    state.storeInfo = app.globalData.storeInfo;
  }
}
function changeStore() {
  NAVPAGE.toSelectStore();
}
function goOrderList() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    NAVPAGE.toOrderList();
  } else {
    NAVPAGE.toAuthorize();
  }
}
function handleConfirm(e) {
  const keyword = state.searchText;
  uni.navigateTo({
    url: '../../goods/search/search?keyword=' + keyword + '&type=wait',
    fail: function (e) {
      console.log(e);
      // 无法跳转成功，说明是预览页面，层级往上一层
      uni.navigateTo({
        url: '../goods/search/search?keyword=' + keyword + '&type=wait'
      });
    }
  });
}

// Watch listeners converted from observers
watch(() => props.show, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal !== "") {
          reload();
        }
});

watch(() => props.pageScrollData, (e, o) => {
  // 属性值变化时执行
        if (e.scrollTop > 0 && !state.isSearchFixed) {
          state.isSearchFixed = true;
        } else if (e.scrollTop === 0 && state.isSearchFixed) {
          state.isSearchFixed = false;
        }
});

watch(() => props.refreshType, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal !== "" && newVal !== "USER") {
          reload(true);
        }
});

watch(() => props.isShowCollection, (newVal, oldVal) => {
  // 属性值变化时执行
        let navHeight = app.globalData.navHeight;
        const screenWidth = app.globalData.systemInfo.screenWidth;
        const rate = screenWidth / 750;
        if (newVal) {
          navHeight = navHeight + 86 * rate;
        }
        state.navHeight = navHeight;
});

</script>
<style scoped>
/* components/home-page/search-bar/search-bar.wxss */
.top-search-block {
    /* width: 80%; */
  /* width: 100%; */
  /* height: 88rpx; */
}
.top-info {
    padding: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
/* .container {
  text-align: center;
  box-sizing: border-box;
  padding: 0px 30rpx;
} */
.location {
  height: 88rpx;
  line-height: 88rpx;
  float: left;
  font-size: 30rpx;
  display: flex;
  align-items: flex-start;
  font-weight: bold;
  padding-right: 27rpx;
  position: relative;
}
.location text:first-of-type {
  display: block;
  max-width: 400rpx;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 30rpx;
  line-height: 88rpx;
  color: #1b1b1d;
  margin-left: 10rpx;
  letter-spacing: 3rpx;
}
.location .shop-img {
  width: 28rpx;
  height: 30rpx;
  overflow: hidden;
  margin-top: 28rpx;
}
.location .right-img {
  width: 18rpx;
  height: 10rpx;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -5rpx;
}
.topHandleView{
    position: relative;
    width: 600rpx;
    height: 70rpx;
    /* background-color: rgba(255,255,255,.9); */
    border-radius: 35rpx;
    /* justify-content: space-between; */
    /* margin: 0 auto; */
    border: 1px solid #ccc;
    display: flex;
    color: #A0A0A0;
    font-size: 28rpx;
    padding: 0 20rpx;
    align-items: center;
    box-sizing: border-box;
    /* margin: 0 auto; */
}
.topHandleView>image{
  width: 120rpx;
  height: 40rpx;
  margin-right: 18rpx;
}
.member-code {
  height: 40rpx;
  width: 40rpx;
  float: right;
  display: flex;
  position: relative;
  margin-left: 40rpx;
}
.order-box image {
  width: 40rpx;
  max-height: 50rpx;
  margin-bottom: 8rpx;
}
.member-code text {
  font-size: 28rpx;
  line-height: 40rpx;
  color: #454545;
  font-weight: bold;
  margin-right: 13rpx;
}
.member-code image {
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
}
.member-code button {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
}
.member-code button::after {
  border: none;
}
.member-card .bg-img,
.top-member-card .bg-img {
  filter: blur(2px);
}
.bind-phone {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(250, 250, 250, 0.4);
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #009f55;
  font-weight: bold;
}
/* .index-search-box {
  width: 40rpx;
  height: 40rpx;
  float: left;
  position: relative;
} */
/* .index-search-box input {
  font-size: 28rpx;
  height: 100%;
  padding: 0rpx 30rpx;
} */
.index-search-box label {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  font-size: 28rpx;
  /* line-height: 64rpx; */
  /* border-radius: 32rpx; */
  /* text-indent: 20rpx; */
  /* text-align: center; */
}
.index-search-box label image {
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
  /* margin-top: -4rpx; */
  /* margin-right: 16rpx; */
}
.keyword-box {
  padding: 0 40rpx 30rpx 40rpx;
  width: 670rpx;
  height: 92rpx;
  display: flex;
}
.keyword-box scroll-view {
  white-space: nowrap;
}
.keyword-box .keyword-item {
  display: inline-block;
  height: 72rpx;
  padding: 0rpx 26rpx;
  background: #f6f6f6;
  margin: 10rpx 30rpx 10rpx 0;
  vertical-align: middle;
  border: 2rpx solid #dcdcdc;
  border-radius: 6rpx;
  font-size: 28rpx;
  color: #454545;
  line-height: 72rpx;
  box-sizing: border-box;
}
.top-search-box {
  width: 100%;
  height: 88rpx;
  box-sizing: border-box;
  padding: 0 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top-search-box .location {
  height: 40rpx;
  width: 180rpx;
  border-radius: 20rpx;
  background: #f1f1f1;
}
/* .top-search-box .topHandleView {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 120rpx;
  height: 88rpx;
} */
.top-search-box .index-search-box {
  height: 40rpx;
  width: 40rpx;
  background: #f1f1f1;
  border-radius: 20rpx;
}
.top-search-box .member-code {
  height: 40rpx;
  width: 40rpx;
  float: right;
  background: #f1f1f1;
  border-radius: 8rpx;
}
.order-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #333333;
  flex: 1 1 auto;
  padding: 4rpx 0;
}
.order-box image {
  width: 25rpx;
}
.search-btn {
  position: absolute;
  right: 4rpx;
  width: 120rpx;
  height: 60rpx;
  background: #F34C23;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>