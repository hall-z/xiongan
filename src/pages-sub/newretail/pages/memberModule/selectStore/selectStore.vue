<template>
<!-- pages/selectStore/selectStore.wxml -->

<!--<template is="searchAddress" :data="state.searchLabelShow, state.searchText"></template>-->
<view class="content">
  <view class="current-position" @click="toSelectAddress">
    <image :src="state.imagesPath.iconPositionActive"></image>
    <text>当前位置</text>
    <view>
      <text>{{state.currentAddress}}</text>
      <image :src="state.imagesPath.iconRight2"></image>
    </view>
  </view>
  <view class="current-position">
    <text>附近门店</text>
  </view>

  <view v-for="(item , index) in state.storeList" :key="id" :class="'store-item ' + (item.active == true ? 'active' : '')" @click="clickStore" :data-key="index" :hidden="state.noStoreData">
    <view class="address">
      <view>{{item.name}}</view>
      <text>{{item.address}}</text>
    </view>
    <view class="distance">
      <text v-if="item.distance >= 0.5">{{'≈' + item.distance}}km</text>
      <text v-if="item.distance < 0.5">{{'≈500'}}m</text>
    </view>
    <icon type="success" size="20">
  </icon></view>
</view>
<view class="loading" :hidden="state.refresh || state.storeList.length == 0">已为您匹配最近的门店</view>
<view class="loading" :hidden="state.loading">正在加载中...</view>
<view class="no-data" :hidden="state.storeList.length > 0">
  <image :src="state.imagesPath.imgNoData"></image>
</view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _libsQqmapWxJssdkMinJs from "@/libs/qqmap-wx-jssdk";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _utilsUtilsJs from "@/utils/newretail/utils";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/selectStore/selectStore.js
const util = _utilsUtilsJs;
const storeService = _apiStoreServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const ADDRESS = _utilsAddressJs;

//获取应用实例
let QQMapWX = _libsQqmapWxJssdkMinJs;
let qqmapsdk;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const state = reactive({
  navigationBarTitle: "选择门店",
  imagesPath: IMGAGESPATH,
  searchLabelShow: false,
  searchText: '搜索门店',
  currentAddress: '',
  storeList: [],
  allStoreList: [],
  page: 0,
  loading: true,
  noStoreData: false,
  refresh: false
});
function handleFocus(e) {
  state.searchLabelShow = true;
}
function handleBlur(e) {
  if (!e.detail.value) {
    state.searchLabelShow = false;
  } else {
    state.searchLabelShow = true;
  }
}
function hadleStoreOrder(latitude, longitude) {
  try {
    let allStores = uni.getStorageSync('_allStores_'); // 获取缓存的所有门店
    let distanceArr = [];
    let newArr = [];
    allStores.forEach(item => {
      let dis = util.distance(latitude, longitude, item.latitude, item.longitude);
      distanceArr.push({
        distance: dis,
        id: item.virtualStoreId || item.id
      });
    });
    newArr = [].concat(distanceArr); // newArr为一个新的数组，不是简单的赋值引用
    function compare(property) {
      return function (a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
      };
    }
    newArr.sort(compare('distance')); // newArr已经按照从小到大的顺序进行排列, 根据对象中的distance属性进行排序

    // 将allStores中的信息进行排列，按照距离从小到大的顺序
    let newTempAllStore = [];
    for (let i = 0; i < newArr.length; i++) {
      for (let j = 0; j < distanceArr.length; j++) {
        if (newArr[i].id == distanceArr[j].id) {
          allStores[j].distance = newArr[i].distance; // 加入距离参数
          newTempAllStore.push(allStores[j]); // j的顺序与allStore中的数据顺序一致 
        }
      }
    }
    try {
      uni.setStorageSync('wj_allStores', newTempAllStore);
    } catch (e) {
      console.log(e);
    }
    let tempData = [];
    for (let i = 0; i < newTempAllStore.length; i++) {
      if (app.globalData.storeInfo && app.globalData.storeInfo.id == newTempAllStore[i].id) {
        //tempData.push(app.globalData.storeInfo)
        tempData.push({
          id: newTempAllStore[i].id,
          name: newTempAllStore[i].name,
          address: newTempAllStore[i].address,
          distance: newArr[i] && newArr[i].distance ? newArr[i].distance.toFixed(2) : null,
          latitude: newTempAllStore[i].latitude,
          longitude: newTempAllStore[i].longitude,
          active: true
        });
      } else {
        tempData.push({
          id: newTempAllStore[i].id,
          name: newTempAllStore[i].name,
          address: newTempAllStore[i].address,
          distance: newArr[i] && newArr[i].distance ? newArr[i].distance.toFixed(2) : null,
          latitude: newTempAllStore[i].latitude,
          longitude: newTempAllStore[i].longitude,
          active: false
        });
      }
    }
    let newTempData = [];
    if (tempData.length > 10) {
      for (let i = 0; i < 10; i++) {
        newTempData.push(tempData[i]);
      }
    } else {
      for (let i = 0; i < tempData.length; i++) {
        newTempData.push(tempData[i]);
      }
    }
    console.log(newTempData);
    state.storeList = newTempData;
    state.allStoreList = tempData;
    state.noStoreData = false;
    state.refresh = false;
  } catch (e) {
    console.log(e);
  }
}
function danleStoreListInfo(self, latitude, longitude) {
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    // qqmapsdk = new QQMapWX({
    //     //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
    //     key: app.globalData.systemConfigure.lbsTencentMiniappKey
    // });
    util.inverseAnalysisAddress(latitude, longitude).then(res => {
      let resData = res.data.result || res.result;
      self.setData({
        currentAddress: resData.formatted_address ? resData.formatted_address : resData.formattedAddresses.recommend // 获取经过腾讯地图优化过的地理位置描述
      });
    });

    // qqmapsdk.reverseGeocoder({
    //     location: {
    //         latitude: latitude,
    //         longitude: longitude
    //     },
    //     success: function (res) {
    //     console.log(res)
    //     self.setData({
    //         // 获取经过腾讯地图优化过的地理位置描述
    //         currentAddress: res.result.formatted_addresses.recommend
    //     })
    //     },
    //     fail: function (res) {
    //     console.log(res);
    //     }
    // })
  });
  self.hadleStoreOrder(latitude, longitude);
}
onLoad(function (options) {
  // console.log(options)
  let self = this;
  let latitude = "";
  let longitude = "";
  // 实例化API核心类
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey
    });
  });
  if (options.name && options.lat && options.lng) {
    app.globalData.addressInfo = options;
    latitude = options.lat;
    longitude = options.lng;
    state.currentAddress = options.name;
    danleStoreListInfo(self, latitude, longitude);
  } else if (!options.name && app.globalData.addressInfo) {
    latitude = app.globalData.addressInfo.lat;
    longitude = app.globalData.addressInfo.lng;
    state.currentAddress = app.globalData.addressInfo.name;
    danleStoreListInfo(self, latitude, longitude);
  } else {
    //1、获取当前位置坐标
    uni.getLocation({
      type: 'gcj02',
      success: function (res) {
        latitude = res.latitude;
        longitude = res.longitude;
        // 2.根据当前位置，获取最近的几个门店信息
        danleStoreListInfo(self, latitude, longitude);
      }
    });
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
function clickStore(e) {
  console.log(e);
  state.storeList.forEach((item, index) => {
    if (e.currentTarget.dataset.key == index) {
      item.active = true;
      app.globalData.storeInfo = item;
    } else {
      item.active = false;
    }
  });
  state.storeList = state.storeList;
  uni.navigateBack({
    url: '../coupon/couponCenter/couponCenter'
  });
}
function handleInput(e) {
  if (!e.detail.value) {
    let tempStoreList = [];
    let allStores = uni.getStorageSync('wj_allStores'); // 获取缓存的所有门店
    for (let i = 0; i < 10; i++) {
      tempStoreList.push({
        id: allStores[i].id,
        name: allStores[i].name,
        address: allStores[i].address,
        distance: allStores[i].distance.toFixed(2),
        latitude: allStores[i].latitude,
        longitude: allStores[i].longitude,
        active: false
      });
    }
    state.storeList = tempStoreList;
  }
}
function handleConfirm(e) {
  console.log(e);
  if (!e.detail.value) {
    state.searchLabelShow = false;
    let tempStoreList = [];
    let allStores = uni.getStorageSync('wj_allStores'); // 获取缓存的所有门店
    for (let i = 0; i < 10; i++) {
      tempStoreList.push({
        id: allStores[i].id,
        name: allStores[i].name,
        address: allStores[i].address,
        distance: allStores[i].distance.toFixed(2),
        latitude: item.latitude,
        longitude: item.longitude,
        active: false
      });
    }
    state.storeList = tempStoreList;
  } else {
    state.searchLabelShow = true;
    console.log(e.detail.value);
    let tempStoreList = [];
    let allStores = uni.getStorageSync('wj_allStores'); // 获取缓存的所有门店
    let reg = new RegExp(e.detail.value);
    allStores.forEach(item => {
      if (reg.test(item.name)) {
        console.log(item);
        tempStoreList.push({
          id: item.id,
          name: item.name,
          address: item.address,
          distance: item.distance.toFixed(2),
          latitude: item.latitude,
          longitude: item.longitude,
          active: false
        });
      }
    });
    state.storeList = tempStoreList;
  }
}
onReady(function () {});
onShow(function () {
  try {
    // wx.removeStorageSync('wj_allStores')
  } catch (e) {
    // Do something when catch error
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  state.noStoreData = true;
  state.refresh = true;
  getAllStoreList();
  let newTempAllStore = state.allStoreList;
  let tempData = [];
  if (newTempAllStore.length > 0) {
    for (let i = 0; i < 10; i++) {
      tempData.push(newTempAllStore[i]);
    }
  } else {
    tempData = [];
    console.log("1");
  }
  state.storeList = tempData;
  state.page = 0;
  console.log(tempData);
  uni.stopPullDownRefresh();
});
function getAllStoreList() {
  const self = this;
  let latitude = "";
  let longitude = "";
  const tempAllStoreList = state.allStoreList;
  state.storeList = [];
  state.allStoreList = [];
  state.page = 0;
  storeService.queryList().then(res => {
    console.log(res);
    let allStores = [];
    res.forEach(item => {
      if (item.status === 'OPEN') {
        allStores.push(item);
      }
    });
    try {
      uni.removeStorageSync('wj_allStores');
      uni.setStorageSync('wj_allStores', allStores);
      if (options.name && options.lat && options.lng) {
        app.globalData.addressInfo = options;
        latitude = options.lat;
        longitude = options.lng;
        state.currentAddress = options.name;
        danleStoreListInfo(self, latitude, longitude);
      } else if (!options.name && app.globalData.addressInfo) {
        latitude = app.globalData.addressInfo.lat;
        longitude = app.globalData.addressInfo.lng;
        state.currentAddress = app.globalData.addressInfo.name;
        danleStoreListInfo(self, latitude, longitude);
      } else {
        //1、获取当前位置坐标
        uni.getLocation({
          type: 'gcj02',
          success: function (res) {
            latitude = res.latitude;
            longitude = res.longitude;
            // 2.根据当前位置，获取最近的几个门店信息
            danleStoreListInfo(self, latitude, longitude);
          }
        });
      }
    } catch (e) {
      console.log(e);
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    }
  });
}
onReachBottom(function () {
  // this.loadList()
});
function loadList() {
  let that = this;
  state.loading = true;
  let result = [];
  let newAllStoreList = state.allStoreList;
  let tempStoreList = state.storeList;
  let newStoreList = [];
  let index = state.page;
  const count = Math.ceil(newAllStoreList.length / 10);
  if (index === count) {
    uni.showToast({
      title: '已经加载到底了~',
      icon: 'none',
      duration: 2000
    });
  } else {
    for (let i = 0; i < newAllStoreList.length; i += 10) {
      result.push(newAllStoreList.slice(i, i + 10));
    }
    index++;
    newStoreList = tempStoreList.concat(result[index]);
    console.log(newStoreList);
    setTimeout(() => {
      state.storeList = newStoreList;
      state.page = index;
    }, 500);
    state.loading = false;
  }
}
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
});
function toSelectAddress() {
  const self = this;
  uni.chooseLocation({
    success: function (res) {
      // success
      console.log(res);
      state.currentAddress = res.name;
      hadleStoreOrder(res.latitude, res.longitude);
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  });
}
</script>
<style scoped>
/* pages/selectStore/selectStore.wxss */

/* @import "../template/searchAddress.wxss"; */

page {
  background: #eee;
}
.content{
  padding: 0rpx 40rpx;
  background: #ffffff;
  width: 100%;
  box-sizing: border-box;
}
.current-position {
  padding: 0rpx;
  height: 90rpx;
  background: #fff;
  line-height: 90rpx;
  border-bottom: 1rpx solid #f1F1F1;
  font-size: 28rpx;
  color: #454545;
}

.current-position >image {
  width: 25rpx;
  height: 30rpx;
  float: left;
  margin-right: 18rpx;
  margin-top: 30rpx;
}

.current-position >text {
  float: left;
}

.current-position view {
  float: right;
  color: #FFA300;
  font-size: 28rpx;
  overflow: hidden;
}

.current-position >view text {
  width: 400rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.current-position >view image {
  float: right;
  width: 16rpx;
  height: 28rpx;
  margin-left: 10rpx;
  margin-top: 35rpx;
}

.store-item {
  padding: 0rpx;
  height: 150rpx;
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  position: relative;
  color: #454545;
}

.store-item view.address {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.store-item view.address view:first-of-type {
  font-size: 32rpx;
  line-height: 36rpx;
  font-weight: bold;
  margin-bottom: 14rpx;
}

.store-item view.address text {
  font-size: 24rpx;
  line-height: 30rpx;
}

.store-item view.address text {
  display: inline-block;
  width: 476rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-item .distance {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #FFA300;
}

.store-item icon {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  bottom: 0rpx;
  top: 0rpx;
  right: 0;
  margin: auto;
  display: none;
}

.store-item.active {
  background: #fff;
}

.store-item.active icon {
  display: block;
}

.loading {
  color: #999;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  background: #eee;
}

.no-data {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 200rpx;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
}

</style>