<template>
<!-- pages/mallModule/tabbar/category/category-main/category-main.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view v-if="state.category.length > 0">
  <category-list v-if="!state.loading" :themeColor="state.themeColor" :category="state.category" :currentCategory="state.currentCategory" :toCategory="toCategory" :into="memuId" @clickCategory="clickCategory" @clickItem="toCategoryList"></category-list>
</view>
<view v-else>
  <view class="no-data">暂无数据~</view>
</view>
<tabbar :tabbar="state.tabbar" :show="showTabbar" @popup="recorderPopup" v-if="!state.openCustomTabbar"></tabbar>
<!-- <custom-tab-bar :tabbar="state.tabbar" :show="showTabbar" v-if="state.openCustomTabbar"></custom-tab-bar>-->
<view class="content" v-if="state.loading">
  <view class="spinner">
    <view class="rect1" :style="'background-color: ' + state.themeColor"></view>
    <view class="rect2" :style="'background-color: ' + state.themeColor"></view>
    <view class="rect3" :style="'background-color: ' + state.themeColor"></view>
    <view class="rect4" :style="'background-color: ' + state.themeColor"></view>
    <view class="rect5" :style="'background-color: ' + state.themeColor"></view>
  </view>
</view>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiProductServiceJs from "@/service/api/newretail/productService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import categoryList from '@/pages-sub/newretail/components/category/category-list/category-list.vue';
import tabbar from '@/pages-sub/newretail/components/tabbar/tabbar.vue';
const app = getApp();

// pages/mallModule/tabbar/category/category-main/category-main.js
const productService = _apiProductServiceJs;
const util = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const ADDRESS = _utilsAddressJs;
const AUTHORIZE = _utilsAuthorizeJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "分类",
  tabbar: {},
  category: [],
  currentCategory: '',
  loading: true,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  openCustomTabbar: false
});
onLoad(function (_options) {
  // 检查当前页面是否tabbar
  if (app.globalData.openCustomTabbar) {
    app.getTabbar();
    app.editTabbar();
    state.openCustomTabbar = true;
    state.showTabbar = true;
  } else {
    if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
      app.globalData.tabBar.list.forEach(item => {
        if (item.linkModel === 'sort') {
          uni.hideTabBar();
          app.getTabbar();
          app.editTabbar();
          state.showTabbar = true;
        }
      });
    }
  }
  // 设置当前设备是否iPhone X
  state.isIphoneX = app.globalData.isIphoneX;
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  const self = this;
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    // 统计PV
    state.store = app.globalData.storeInfo.name;
    state.storeId = app.globalData.storeInfo.id;
    ANALYSIS.PVStatistics(state.storeId);
    getMenuProduct(state.storeId);
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation().then(res => {
      app.globalData.storeInfo = res;
      state.store = res.name;
      state.storeId = res.id;
      ANALYSIS.PVStatistics(state.storeId);
      getMenuProduct(res.id);
    }).catch(err => {
      console.log(err);
    });
  }
  if (_options.scene) {
    let scene = decodeURIComponent(_options.scene);
    if (scene !== 'isfromQR') {
      try {
        uni.setStorageSync('wj_sharingId', scene);
      } catch (e) {}
    }
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId;
    try {
      uni.setStorageSync('wj_sharingId', shareId);
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures();
});
onReady(function () {});
onShow(function () {
  if (state.openCustomTabbar) {
    app.getTabbar();
    app.editTabbar();
  }
  if (app.globalData.storeInfo && app.globalData.storeInfo.id !== state.storeId) {
    state.store = app.globalData.storeInfo.name;
    state.storeId = app.globalData.storeInfo.id;
    getMenuProduct(app.globalData.storeInfo.id);
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let sharePictures = state.sharePictures;
  let path = util.getSharePath();
  return {
    path: path,
    imageUrl: sharePictures
  };
});
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures;
  }
}
function getMenuProduct(storeId) {
  const that = this;
  productService.getCategoryWithCountByStore(storeId).then(res => {
    console.log(res);
    let category = res;
    let tempList = [];
    // 根据分类树一一匹配出三级类目
    if (res.length > 0) {
      category.forEach(item => {
        // 一级类目
        let level1Item = {
          id: item.id,
          level: item.level,
          name: item.name,
          business: item.business,
          disabled: item.disabled,
          children: []
        };
        if (item.children.length > 0) {
          item.children.forEach(ele => {
            // 二级类目
            let level2Item = {
              id: ele.id,
              level: ele.level,
              name: ele.name,
              business: ele.business,
              disabled: ele.disabled,
              count: ele.count,
              children: []
            };
            if (ele.children.length > 0) {
              ele.children.forEach(i => {
                // 三级类目
                let level3Item = {
                  id: i.id,
                  level: i.level,
                  name: i.name,
                  business: i.business,
                  disabled: i.disabled,
                  count: i.count,
                  pictureUrl: i.pictureUrl
                };
                level2Item.children.push(level3Item);
              });
            }
            level1Item.children.push(level2Item);
          });
        }
        if (level1Item.children.length > 0) {
          tempList.push(level1Item);
        }
      });
      state.category = tempList;
      state.currentCategory = tempList[0].id ? tempList[0].id : '';
      state.loading = false;
    } else {
      state.loading = false;
    }
  }).catch(err => {
    util.showToast(err.message);
  });
}
function clickCategory(e) {
  // 设置当前选中的商品类目
  state.currentCategory = e.detail.currentTarget.dataset.id;
  state.toCategory = e.detail.currentTarget.dataset.id;
}
function toCategoryList(e) {
  if (e.detail.count > 0) {
    let opts = '?categoryId=' + e.detail.id;
    NAVPAGE.toCategory(opts);
  } else {
    util.showToast("该分类下暂无商品，请选择其他分类~");
  }
}
</script>
<style scoped>
/* pages/mallModule/tabbar/category/category-main/category-main.wxss */
page {
  height: 100%;
  background-color: #e9e9e9;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data {
  width: 100%;
  height: calc(100% - 98rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.spinner {
  width: 240rpx;
  height: 100rpx;
  text-align: center;
  font-size: 10rpx;
}

.spinner>view {
  background-color: #009F55;
  height: 100%;
  width: 8rpx;
  margin: 0 3rpx;
  display: inline-block;

  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {

  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4)
  }

  20% {
    -webkit-transform: scaleY(1.0)
  }
}

@keyframes stretchdelay {

  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
</style>