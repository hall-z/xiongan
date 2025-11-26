<template>
<!--components/home-page/subscribe-bar/subscribe-bar.wxml-->
<!-- <view class="subscribe-bar-content">
  <view class="subscribe-bar-box" wx:if="{{loaded}}">
    <view>关注最新的商城信息请点订阅</view>
    <view class="add" style="{{theme.mainBgColor}}" bind:tap="clickSubscribe">订阅</view>
  </view>
  <view class="subscribe-bar-loading" wx:else></view>
</view> -->
<subscribe-popup :show="showPopup" @close="clickClose"></subscribe-popup>
</template>
<script setup>
import _homePageCommonBehaviorJs from "../homePageCommonBehavior";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _lazyLoadPageLazyLoadBaseJs from "../../lazy-load-page/lazy-load-base";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import { reactive , watch} from "vue";
import subscribePopup from '../../subscribe-popup/subscribe-popup.vue';
const app = getApp();
// components/home-page/subscribe-bar/subscribe-bar.js
const IMGAGESPATH = _utilsImagesPathJs;
const THEMEMANAGER = _utilsThemeManagerJs;
const NAVPAGE = _utilsNavPageJs;
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs;
const AUTHORIZE = _utilsAuthorizeJs;
const homePageCommonBehavior = _homePageCommonBehaviorJs;
//获取应用实例
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
const state = reactive({
  imagesPath: IMGAGESPATH,
  theme: THEMEMANAGER,
  loaded: false,
  showPopup: false
});
const props = defineProps({
  show: {
    // 属性名
    type: Boolean,
    value: false
  }
});
function reload(refresh = false) {
  const that = this;
  if (!state.loaded) {
    lazyLoadBase.determineComponentInVisibleArea(".subscribe-bar-loading", that).then(res => {
      if (res) {
        state.loaded = true;
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
      }
    }).catch(err => {
      console.log(err);
    });
  }
}
function clickSubscribe() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.showPopup = true;
  } else {
    NAVPAGE.toAuthorize();
  }
}
function clickClose() {
  state.showPopup = false;
}

// Watch listeners converted from observers
watch(() => props.show, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal !== "") {
          reload();
        }
});

</script>
<style scoped>
/* components/home-page/subscribe-bar/subscribe-bar.wxss */
.subscribe-bar-content {
  width: 100%;
  height: 90rpx;
  background: #F5F7F6;
}
.subscribe-bar-loading {
  width: 670rpx;
  padding: 0 30rpx;
  height: 58rpx;
  margin: 0 auto 12rpx;
  border-radius: 29rpx;
  background: #f1f1f1;
}
.subscribe-bar-block {
  width: 100%;
  height: 90rpx;
}
.subscribe-bar-box {
  width: 670rpx;
  padding: 0 30rpx;
  height: 90rpx;
  color: #828181;
  font-size: 30rpx;
  line-height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto 12rpx;
}
.subscribe-bar-box view.add {
  width: 130rpx;
  height: 58rpx;
  line-height: 58rpx;
  font-size: 30rpx;
  background: #FF7200;
  color: #ffffff;
  border-radius: 30rpx;
  text-align: center;
}
</style>