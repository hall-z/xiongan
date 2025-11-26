<template>
<!--pages/mallModule/score/selectStore/selectStore.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="loading-box" :hidden="state.show">
  <loading></loading>
</view>
<view class="content" :hidden="!state.show">
  <view v-for="(item , index) in state.storeList" :key="id" :class="'store-item ' + (item.active == true ? 'active' : '')" @click="clickStore" :data-key="index" :hidden="state.noStoreData">
    <view class="address">
      <view class="name">{{item.name}}<text :style="'color:' + state.theme.mainColor">剩余 {{item.balance}} 件</text></view>
      <view class="info">
        <text>{{item.distance}}km</text>
        <text>{{item.address}}</text>
      </view>
    </view>
    <view class="navigation" :data-key="index" @click.stop="navToStore">
      <image :src="state.imagesPath.iconStoreNav"></image>
      <text>到这去</text>
    </view>
    <image class="selected" :src="state.imagesPath.iconStoreChecked"></image>
  </view>
</view>
<view class="loading" :hidden="state.loading">正在加载中...</view>
<view class="no-data" :hidden="!state.show || state.storeList.length > 0">
  <image :src="state.imagesPath.imgNoData"></image>
</view>

</template>
<script setup>
import _apiScoreProductServiceJs from "@/service/api/newretail/scoreProductService";
import _apiDistributionServiceJs from "@/service/api/newretail/distributionService";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _libsQqmapWxJssdkMinJs from "@/libs/qqmap-wx-jssdk";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _utilsUtilsJs from "@/utils/newretail/utils";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import loading from '@/pages-sub/newretail/components/loading/loading.vue';
const app = getApp();

// pages/mallModule/score/selectStore/selectStore.js
const util = _utilsUtilsJs;
const storeService = _apiStoreServiceJs;
const memberService = _apiMemberServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const ADDRESS = _utilsAddressJs;
const themeManager = _utilsThemeManagerJs;
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
let QQMapWX = _libsQqmapWxJssdkMinJs;
let qqmapsdk;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const distributionService = _apiDistributionServiceJs;
const scoreProductService = _apiScoreProductServiceJs;
const state = reactive({
  navigationBarTitle: "切换门店",
  imagesPath: IMGAGESPATH,
  searchLabelShow: false,
  searchText: '搜索门店',
  currentAddress: {},
  storeList: [],
  allStoreList: [],
  page: 1,
  loading: true,
  noStoreData: false,
  refresh: false,
  show: false,
  theme: themeManager,
  productId: "",
  activityId: ""
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
  const self = this;
  try {
    let allStores = uni.getStorageSync('wj_allStores'); // 获取缓存的所有门店
    let now = new util.ResponseDate();
    let nowDate = util.formatTime(now).replace(/\//g, '-');
    let tempTimeArr = nowDate.split(" ");
    let startTime = tempTimeArr[0] + ' 00:00:00';
    let tempTermValidity = tempTimeArr[0] + ' 23:59:59';
    // 增量查询门店
    let lastTime = uni.getStorageSync('wj_queryStoreTime'); // 获取上次查询门店的增量信息
    if (lastTime && util.validateDateTime(lastTime)) {
      startTime = lastTime;
    }
    // 根据缓存的上一次获取门店列表的时间查询增量门店信息
    storeService.queryList(startTime).then(res => {
      let tempAllStores = [].concat(allStores);
      res.forEach(item => {
        let hasThisStore = false;
        tempAllStores.forEach((ele, index) => {
          if (item.id === ele.id) {
            hasThisStore = true;
            tempAllStores[index] = item;
          }
        });
        if (!hasThisStore) {
          if (item.status === 'OPEN') {
            tempAllStores.push(item);
          }
        }
      });
      let newAllStores = [];
      tempAllStores.forEach(item => {
        if (item.status === 'OPEN') {
          newAllStores.push(item);
        }
      });
      try {
        uni.setStorageSync('wj_allStores', newAllStores);
        uni.setStorageSync('wj_queryStoreTimeCount', tempTermValidity);
      } catch (e) {
        console.log(e);
      }
      handleStoreInfo(newAllStores);
    }).catch(err => {
      console.log(err.message);
      handleStoreInfo(allStores);
    });
    /**
     * 处理门店数据
     * @param allStores 所有门店信息
     */
    function handleStoreInfo(allStores) {
      let distanceArr = [];
      let newArr = [];
      if (allStores.length > 0) {
        allStores.forEach(item => {
          let dis = util.distance(latitude, longitude, item.latitude, item.longitude);
          distanceArr.push({
            distance: dis,
            id: item.virtualStoreId || item.id
          });
        });
      }
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
            allStores[j].userLatitude = newArr[i].latitude; // 加入用户经纬度
            allStores[j].userLongitude = newArr[i].longitude; // 加入用户经纬度
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
        if (app.globalData.storeInfo && app.globalData.storeInfo.virtualStoreId == newTempAllStore[i].virtualStoreId && app.globalData.storeInfo.virtualStoreId == newTempAllStore[i].virtualStoreId) {
          //tempData.push(app.globalData.storeInfo)
          tempData.push({
            id: newTempAllStore[i].virtualStore == 1 ? newTempAllStore[i].parentId : newTempAllStore[i].id,
            name: newTempAllStore[i].name,
            address: newTempAllStore[i].address,
            userLatitude: newTempAllStore[i].userLatitude,
            userLongitude: newTempAllStore[i].userLongitude,
            wxCode: newTempAllStore[i].wxCode,
            distance: newArr[i] && newArr[i].distance ? newArr[i].distance.toFixed(2) : null,
            latitude: newTempAllStore[i].latitude,
            longitude: newTempAllStore[i].longitude,
            storeHours: newTempAllStore[i].storeHours,
            shipmentTypes: newTempAllStore[i].shipmentTypes,
            tel: newTempAllStore[i].tel,
            virtualStoreId: newTempAllStore[i].virtualStoreId || newTempAllStore[i].id,
            active: true
          });
        } else {
          tempData.push({
            id: newTempAllStore[i].virtualStore == 1 ? newTempAllStore[i].parentId : newTempAllStore[i].id,
            name: newTempAllStore[i].name,
            address: newTempAllStore[i].address,
            userLatitude: newTempAllStore[i].userLatitude,
            userLongitude: newTempAllStore[i].userLongitude,
            wxCode: newTempAllStore[i].wxCode,
            distance: newArr[i] && newArr[i].distance ? newArr[i].distance.toFixed(2) : null,
            latitude: newTempAllStore[i].latitude,
            longitude: newTempAllStore[i].longitude,
            storeHours: newTempAllStore[i].storeHours,
            shipmentTypes: newTempAllStore[i].shipmentTypes,
            tel: newTempAllStore[i].tel,
            virtualStoreId: newTempAllStore[i].virtualStoreId || newTempAllStore[i].id,
            active: false
          });
        }
      }
      let newTempData = [];
      if (tempData.length > 20) {
        for (let i = 0; i < 20; i++) {
          newTempData.push(tempData[i]);
        }
      } else {
        for (let i = 0; i < tempData.length; i++) {
          newTempData.push(tempData[i]);
        }
      }
      console.log(newTempData);
      getStoreBalance(newTempData).then(res => {
        state.storeList = res;
        state.allStoreList = tempData;
        state.noStoreData = false;
        state.refresh = false;
        state.show = true;
      }).catch(err => {
        console.log(err.message);
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function danleStoreListInfo(self, latitude, longitude) {
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    //  qqmapsdk = new QQMapWX({
    //      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
    //      key: app.globalData.systemConfigure.lbsTencentMiniappKey
    //  });
    util.inverseAnalysisAddress(latitude, longitude).then(res => {
      let resData = res.data.result || res.result;
      if (resData) {
        if (self.options.name) {
          self.setData({
            // 获取经过腾讯地图优化过的地理位置描述
            currentAddress: {
              name: self.options.name,
              address: self.options.address
            }
          });
        } else if (!self.options.name && app.globalData.addressInfo) {
          self.setData({
            // 获取经过腾讯地图优化过的地理位置描述
            currentAddress: {
              name: app.globalData.addressInfo.name,
              address: app.globalData.addressInfo.address
            }
          });
        } else {
          self.setData({
            // 获取经过腾讯地图优化过的地理位置描述
            currentAddress: {
              name: res.result.formatted_address,
              address: res.result.address
            }
          });
        }
      }
    });
    //  qqmapsdk.reverseGeocoder({
    //   location: {
    //     latitude: latitude,
    //     longitude: longitude
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // })
  });
  self.hadleStoreOrder(latitude, longitude);
}
onLoad(function (_options) {
  uni.hideShareMenu();
  console.log(_options);
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
  let self = this;
  // 实例化API核心类
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey
    });
  });
  if (_options.productId) {
    state.productId = _options.productId;
  }
  if (_options.activityId) {
    state.activityId = _options.activityId;
  }
  handleBeforeDanleStoreListInfo(self, options);
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
function clickStore(e) {
  console.log(e);
  let store = null;
  state.storeList.forEach((item, index) => {
    if (e.currentTarget.dataset.key == index) {
      item.active = true;
      store = item;
      console.log(item);
      // 当前选中门店配送费规则
      getDistributionFeeRule(item.id);
    } else {
      item.active = false;
    }
  });
  const that = this;
  const tempData = {
    activityId: state.activityId,
    storeId: store.id,
    status: "STARTED",
    page: 1,
    pageSize: 0
  };
  scoreProductService.queryActivity(tempData).then(res => {
    if (res && res.records && res.records.length > 0) {
      handleChoose();
    } else {
      uni.showModal({
        title: '温馨提示',
        content: '您选择的门店没有该积分活动，请重新选择门店~',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '我知道了',
        confirmColor: '#3CC51F',
        success: result => {
          if (result.confirm) {}
        },
        fail: () => {},
        complete: () => {}
      });
    }
  }).catch(err => {
    util.showToast(err.message);
  });
  function handleChoose() {
    if (store.balance <= 0) {
      uni.showModal({
        title: '温馨提示',
        content: '当前门店已经被抢光了，看看其他门店吧',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '我知道了',
        confirmColor: '#3CC51F',
        success: result => {
          if (result.confirm) {}
        },
        fail: () => {},
        complete: () => {}
      });
      return;
    }
    app.globalData.storeInfo = store;
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      recordVisitStore(app.globalData.storeInfo.id);
    }
    state.storeList = state.storeList;
    uni.navigateBack({
      delta: 1
    });
  }
}
function getDistributionFeeRule(storeId) {
  return;
  distributionService.get(storeId).then(res => {
    let resArr = res ? Object.keys(res) : [];
    if (res && resArr.length > 0) {
      console.log(res);
      uni.setStorageSync('wj_distributionFee', res);
    }
  }).catch(err => {
    util.showToast(err.message);
  });
}
function navToStore(e) {
  let storeInfo = null;
  state.storeList.forEach((item, index) => {
    if (e.currentTarget.dataset.key == index) {
      storeInfo = item;
    }
  });
  if (storeInfo && storeInfo.longitude != null && storeInfo.longitude != null) {
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
function handleInput(e) {
  if (!e.detail.value) {
    let tempStoreList = [];
    let allStores = uni.getStorageSync('wj_allStores'); // 获取缓存的所有门店
    for (let i = 0; i < 20; i++) {
      tempStoreList.push({
        id: allStores[i].virtualStore == 1 ? allStores[i].parentId : allStores[i].id,
        name: allStores[i].name,
        address: allStores[i].address,
        userLatitude: allStores[i].userLatitude,
        userLongitude: allStores[i].userLongitude,
        wxCode: allStores[i].wxCode,
        distance: allStores[i].distance.toFixed(2),
        latitude: allStores[i].latitude,
        longitude: allStores[i].longitude,
        storeHours: allStores[i].storeHours,
        shipmentTypes: allStores[i].shipmentTypes,
        tel: allStores[i].tel,
        virtualStoreId: allStores[i].virtualStoreId || allStores[i].id,
        active: false
      });
    }
    state.storeList = tempStoreList;
  } else if (!state.searchLabelShow) {
    state.searchLabelShow = true;
  }
}
function handleConfirm(e) {
  console.log(e);
  if (!e.detail.value) {
    state.searchLabelShow = false;
    let tempStoreList = [];
    let allStores = uni.getStorageSync('wj_allStores'); // 获取缓存的所有门店
    for (let i = 0; i < 20; i++) {
      tempStoreList.push({
        id: allStores[i].virtualStore == 1 ? allStores[i].parentId : allStores[i].id,
        name: allStores[i].name,
        address: allStores[i].address,
        userLatitude: allStores[i].userLatitude,
        userLongitude: allStores[i].userLongitude,
        wxCode: allStores[i].wxCode,
        distance: allStores[i].distance.toFixed(2),
        latitude: item.latitude,
        longitude: item.longitude,
        storeHours: allStores[i].storeHours,
        shipmentTypes: allStores[i].shipmentTypes,
        tel: allStores[i].tel,
        virtualStoreId: allStores[i].virtualStoreId || allStores[i].id,
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
          id: item.virtualStore == 1 ? item.parentId : item.id,
          name: item.name,
          address: item.address,
          userLatitude: item.userLatitude,
          userLongitude: item.userLongitude,
          wxCode: item.wxCode,
          distance: item.distance.toFixed(2),
          latitude: item.latitude,
          longitude: item.longitude,
          storeHours: item.storeHours,
          shipmentTypes: item.shipmentTypes,
          tel: item.tel,
          virtualStoreId: item.virtualStoreId || item.id,
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
  state.show = false;
  getAllStoreList();
  let newTempAllStore = state.allStoreList;
  let tempData = [];
  if (newTempAllStore.length > 0) {
    for (let i = 0; i < 20; i++) {
      tempData.push(newTempAllStore[i]);
    }
  } else {
    tempData = [];
  }
  state.storeList = tempData;
  state.page = 1;
  state.show = true;
  console.log(tempData);
  uni.stopPullDownRefresh();
});
function getAllStoreList() {
  const self = this;
  const tempAllStoreList = state.allStoreList;
  state.storeList = [];
  state.allStoreList = [];
  state.page = 1;
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
      handleBeforeDanleStoreListInfo(self, options);
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
function handleBeforeDanleStoreListInfo(self, options) {
  let latitude = "";
  let longitude = "";
  console.log(self.options.name, self.options.lat, self.options.lng);
  if (options.name && options.lat && options.lng) {
    app.globalData.addressInfo = options;
    latitude = options.lat;
    longitude = options.lng;
    self.setData({
      currentAddress: options.name
    });
    self.danleStoreListInfo(self, latitude, longitude);
  } else if (!options.name && app.globalData.addressInfo) {
    latitude = app.globalData.addressInfo.lat;
    longitude = app.globalData.addressInfo.lng;
    self.setData({
      currentAddress: app.globalData.addressInfo.name
    });
    self.danleStoreListInfo(self, latitude, longitude);
  } else {
    //1、获取当前位置坐标
    uni.getLocation({
      type: 'gcj02',
      success: function (res) {
        latitude = res.latitude;
        longitude = res.longitude;
        // 2.根据当前位置，获取最近的几个门店信息
        self.danleStoreListInfo(self, latitude, longitude);
      }
    });
  }
}
onReachBottom(function () {
  if (state.show) {
    loadList();
  }
});
function loadList() {
  let that = this;
  state.loading = true;
  let result = [];
  let newAllStoreList = state.allStoreList;
  let tempStoreList = state.storeList;
  let newStoreList = [];
  let index = state.page;
  const count = Math.ceil(newAllStoreList.length / 20);
  if (index === count) {
    uni.showToast({
      title: '已经加载到底了~',
      icon: 'none',
      duration: 2000
    });
  } else {
    for (let i = 0; i < newAllStoreList.length; i += 20) {
      result.push(newAllStoreList.slice(i, i + 20));
    }
    getStoreBalance(result[index]).then(res => {
      newStoreList = tempStoreList.concat(res);
      index++;
      state.storeList = newStoreList;
      state.page = index;
      state.loading = false;
    }).catch(err => {
      console.log(err.message);
      newStoreList = tempStoreList.concat(result[index]);
      index++;
      console.log(newStoreList);
      state.storeList = newStoreList;
      state.page = index;
      state.loading = false;
    });
  }
}
onShareAppMessage(function () {});
function toSelectAddress() {
  const self = this;
  uni.chooseLocation({
    success: function (res) {
      // success
      console.log(res);
      state.currentAddress = {
        name: res.name,
        address: res.address
      };
      let location = {
        name: res.name,
        address: res.address,
        lat: res.latitude,
        lng: res.longitude
      };
      options = location;
      app.globalData.addressInfo = location;
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
function recordVisitStore(storeId) {
  memberService.visitStore(storeId).then(res => {
    console.log(res);
  }).catch(e => {
    console.log(e.message);
  });
}
function getStoreBalance(stores) {
  const that = this;
  return new Promise((resolve, reject) => {
    if (stores.length > 0) {
      let storeIds = [];
      stores.forEach(it => {
        storeIds.push(it.id);
      });
      storeIds = storeIds.join(",");
      scoreProductService.getStoreBalance(state.productId, storeIds).then(res => {
        if (res && res.length > 0) {
          res.forEach(ele => {
            for (let i = 0; i < stores.length; i++) {
              const it = stores[i];
              if (ele.storeId === it.id) {
                stores[i].balance = ele.balance;
              }
            }
          });
        }
        for (let i = 0; i < stores.length; i++) {
          const it = stores[i];
          stores[i].balance = it.balance ? it.balance : 0;
        }
        resolve(stores);
      }).catch(err => {
        console.log(err.message);
        reject(err);
      });
    } else {
      resolve(stores);
    }
  });
}
</script>
<style scoped>
/* pages/mallModule/score/selectStore/selectStore.wxss */
/* @import "../../../../common/common.wxss"; */

page {
  background: #eee;
}

.content {
  padding: 0rpx 40rpx;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
}

.current-position {
  width: 100%;
  background: #fff;
  border-bottom: 1rpx solid #f1f1f1;
  font-size: 28rpx;
  line-height: 48rpx;
  color: #454545;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 29rpx 0;
}

.current-position .left-info .title {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.current-position .position-icon {
  width: 22rpx;
  height: 28rpx;
  margin-right: 13rpx;
}

.current-position .left-info {
}

.current-position .left-info .address-info {
  width: 630rpx;
}

.current-position .left-info .address-info>view {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.current-position .left-info .address-info>view:first-of-type {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  line-height: 36rpx;
}

.current-position .left-info .address-info>view:last-of-type {
  font-size: 24rpx;
  color: #8f8f8f;
  line-height: 34rpx;
}

.current-position .right-icon {
  width: 12rpx;
  height: 23rpx;
  margin-top: 57rpx;
}

.near-store-title {
  width: 690rpx;
  height: 72rpx;
  padding: 0 30rpx;
  margin-left: -40rpx;
  background: #eee;
  line-height: 72rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.near-store-title text {
  font-size: 24rpx;
  color: #8f8f8f;
  font-weight: normal;
  margin-left: 8rpx;
}

.store-item {
  padding: 0rpx;
  height: 150rpx;
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  position: relative;
  color: #454545;
  justify-content: space-between;
}

.store-item view.address {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.store-item view.address view:first-of-type {
  font-size: 28rpx;
  line-height: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: flex;
  align-items: baseline;
}
.store-item view.address .name text{
  font-size: 24rpx;
  color: #DA202E;
  font-weight: normal;
  margin-left: 10rpx;
}
.store-item view.address .info {
  width: 576rpx;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-item view.address .info text {
  font-size: 24rpx;
  line-height: 30rpx;
}

.store-item view.address .info text:last-of-type {
  /* width: 376rpx; */
  display: box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  margin-left: 12rpx;
  padding-left: 12rpx;
}

.store-item view.address .info text:last-of-type::before {
  content: "";
  display: block;
  width: 2rpx;
  height: 28rpx;
  background: #89878b;
  position: absolute;
  left: 0;
  top: 0;
}

.store-item .navigation {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #666;
  height: 100%;
  justify-content: center;
}

.store-item .navigation image {
  width: 44rpx;
  height: 44rpx;
  margin-bottom: 8rpx;
}

.store-item image.selected {
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  top: 0;
  right: -40rpx;
  display: none;
}

.store-item.active {
  background: #fff;
}

.store-item.active image.selected {
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