<template>
<!-- pages/addressList/addressList.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>

<view class="content" :hidden="state.addressList.length == 0 ? true : false">
    <view class="title">
        <view>
            <image :src="state.imagesPath.iconPositionActive"></image>
            <text>收货地址</text>
        </view>
        <!-- <view class="delete" style="color: {{state.themeColor}}"  bindtap="bindDelete">
            <image src="{{state.imagesPath.iconAddressDelete}}" ></image>
            <text>{{state.isDeleteText}}</text>
        </view> -->
    </view>
    <view class="address-item" v-for="(item , index) in state.addressList" :key="index" :data-id="item.id" :data-index="index" @click="handleChoose">
        <view class="item-main">
            <view class="address-title">
                {{item.detailedAddress}}
                <text class="address-icon" :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'" v-if="item.label">{{item.label}}</text>
            </view>
            <view class="address-info">{{item.province + item.city + item.county + item.houseNum}}</view>
            <view class="name-mobile">
                <text>{{item.contacts}} {{item.gender}}</text>
                <text>{{item.contactsMobile}}</text>
            </view>
        </view>
        <image :hidden="state.isDelete == true" :src="state.imagesPath.iconEditAddress" :data-id="item.id" @click.stop="editAddress"></image>
        <image :hidden="state.isDelete == false" class="isChecked" :src="state.currentItem == index ? state.imagesPath.iconChecked : state.imagesPath.iconUnchecked"></image>
    </view>
</view>
<view class="no-data" :hidden="state.addressList.length == 0 ? false : true">
    <image :src="state.imagesPath.imgNoAddress"></image>
</view>
<view class="bottom-btn-box" :style="state.isIphoneX ? 'padding-bottom:20rpx;' : ''">
    <!-- <view class="bottom-box" hidden="{{state.isDelete == true}}" bindtap="toAddAddressA">
        <button class="btn" style="background: {{state.themeColor}}">微信导入</button>
    </view> -->
    <view class="bottom-box" :hidden="state.isDelete == true" @click="toAddAddress">
        <button class="btn" :style="'width: 600rpx;background: ' + state.themeColor">新增地址</button>
    </view>

</view>

<view class="bottom-box" :hidden="state.isDelete == false" @click="doDeleteAddress">
    <button class="btn" :style="'background: ' + state.themeColor">删除地址</button>
</view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _libsQqmapWxJssdkMinJs from "@/libs/qqmap-wx-jssdk";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiAddressServiceJs from "@/service/api/newretail/addressService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/addressList/addressList.js
const addressService = _apiAddressServiceJs;
const NAVPAGE = _utilsNavPageJs;
let QQMapWX = _libsQqmapWxJssdkMinJs;
let qqmapsdk;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const ADDRESS = _utilsAddressJs;
const themeManager = _utilsThemeManagerJs;
const util = _utilsUtilsJs;
//获取应用实例
const state = reactive({
  isIphoneX: util.isIphoneX(),
  deliveryDistanceThirdMap: '',
  // 地图项配置
  navigationBarTitle: "收货地址",
  imagesPath: IMGAGESPATH,
  addressList: [],
  isDelete: false,
  isDeleteId: '',
  isDeleteText: "删除地址",
  currentItem: -1,
  searchLabelShow: false,
  currentAddress: "",
  nearbyAddress: [],
  chooseAddress: false,
  searchText: '搜索收货地址',
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor')
});
function handleFocus(e) {
  state.searchLabelShow = true;
}
function handleBlur(e) {
  state.searchLabelShow = false;
}
function toAddAddressA() {
  uni.chooseAddress({
    success: function (res) {
      uni.setStorageSync('wj_addchooseAddress', res);
      let opts = '?chooseaddress=edit';
      NAVPAGE.toAddAddress(opts);
    }
  });
  // .chooseAddress(
}
function handleRefresh() {
  getAddressList(this);
}
function getAddressList(self) {
  uni.showLoading({
    title: '加载中'
  });
  //1、获取当前位置坐标
  uni.getLocation({
    type: 'gcj02',
    success: function (res) {
      let latitude = res.latitude;
      let longitude = res.longitude;
      //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
      uni.hideLoading();
      util.inverseAnalysisAddress(latitude, longitude).then(res => {
        let resData = res.data.result || res.result;
        self.setData({
          currentAddress: resData.formatted_address ? resData.formatted_address : resData.formattedAddresses.recommend,
          // 获取经过腾讯地图优化过的地理位置描述
          nearbyAddress: resData.pois // 获取附近poi列表
        });
        uni.hideLoading();
      }).catch(err => {
        uni.hideLoading();
      });
      // qqmapsdk.reverseGeocoder({
      //   location: {
      //     latitude: latitude,
      //     longitude: longitude
      //   },
      //   get_poi: 1,
      //   success: function (res) {
      //     self.setData({
      //       currentAddress: res.result.formatted_addresses.recommend, // 获取经过腾讯地图优化过的地理位置描述
      //       nearbyAddress: res.result.pois // 获取附近poi列表
      //     })
      //     wx.hideLoading()
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //     wx.hideLoading()
      //   }
      // })
    },
    fail: function (res) {
      uni.hideLoading();
    }
  });
}
function handleInput(e) {
  if (!e.detail.value) {
    handleRefresh();
  }
}
function clickAddress(val) {
  const id = val.currentTarget.dataset.id;
  const nearbyAddress = state.nearbyAddress;
  let locationInfo = {};
  if (nearbyAddress.length > 0) {
    nearbyAddress.forEach(item => {
      if (item.id === id) {
        locationInfo = {
          ...item
        };
      }
    });
  }
  try {
    uni.setStorageSync('wj_locationInfo', locationInfo);
  } catch (e) {}
  NAVPAGE.toAddAddress();
}
function handleConfirm(val) {
  let self = this;
  if (!val.detail.value) {
    handleRefresh();
  } else {
    qqmapsdk.search({
      keyword: val.detail.value,
      success: function (res) {
        console.log(res);
        state.nearbyAddress = res.data;
      },
      fail: function (res) {
        console.log(res);
      }
    });
  }
}
function toAddAddress() {
  const loginStatus = checkAuth();
  if (loginStatus) {
    NAVPAGE.toAddAddress();
  } else {
    uni.showToast({
      title: '请登录后再添加地址哦~',
      icon: 'none',
      duration: 2000
    });
  }
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
  }
}
function editAddress(item) {
  console.log("1");
  let addressId = item.target.dataset.id;
  try {
    let addressSelect = {
      id: addressId
    };
    uni.setStorageSync('wj_editAddress', addressSelect);
  } catch (e) {
    console.log(1);
  }
  let opts = '?doEditAddress=edit';
  NAVPAGE.toAddAddress(opts);
}
function handleChoose(e) {
  const that = this;
  if (options.from && (options.from == 'perfectOrder' || options.from == 'index')) {
    //从完善订单页进来选择地址
    if (state.isDelete) {
      // 删除
      let index = e.currentTarget.dataset.index;
      let addressId = e.currentTarget.dataset.id;
      console.log(addressId);
      if (state.currentItem !== index) {
        state.isDeleteId = addressId;
        state.currentItem = index;
      } else {
        state.isDeleteId = addressId;
        state.currentItem = -1;
      }
    } else {
      // 普通点击
      console.log(e);
      let chooseAddress = '';
      state.addressList.forEach(ele => {
        if (ele.id === e.currentTarget.dataset.id) {
          chooseAddress = ele;
        }
      });
      try {
        uni.setStorageSync('wj_chooseAddressInfo', chooseAddress);
        app.globalData.latitude = chooseAddress.latitude;
        app.globalData.longitude = chooseAddress.longitude;
      } catch (e) {}
      uni.navigateBack({
        delta: 1
      });
    }
  } else {
    let index = e.currentTarget.dataset.index;
    let addressId = e.currentTarget.dataset.id;
    console.log(addressId);
    if (state.currentItem !== index) {
      state.isDeleteId = addressId;
      state.currentItem = index;
    } else {
      state.isDeleteId = addressId;
      state.currentItem = -1;
    }
  }
}
function bindDelete() {
  if (state.isDelete == false) {
    state.isDelete = true;
    state.isDeleteText = "取消";
    state.currentItem = -1;
  } else {
    state.isDelete = false;
    state.isDeleteText = "删除地址";
  }
}
function doDeleteAddress() {
  const that = this;
  let id = state.isDeleteId;
  if (id && id != '') {
    addressService.removeById(id).then(res => {
      console.log(res);
      queryAddress();
      state.isDeleteId = '';
      state.currentItem = -1;
      uni.showToast({
        title: "删除成功~",
        icon: 'none',
        duration: 2000
      });
      try {
        let value = uni.getStorageSync('wj_chooseAddressInfo');
        if (value) {
          if (value.id === id) {
            uni.removeStorageSync('wj_chooseAddressInfo');
          }
        }
      } catch (e) {
        // Do something when catch error
      }
    });
  } else {
    uni.showToast({
      title: "请选择要删除的地址~",
      icon: 'none',
      duration: 2000
    });
  }
}
function queryAddress() {
  const loginStatus = checkAuth();
  if (loginStatus) {
    addressService.query().then(res => {
      console.log(res);
      let tempList = [];
      if (res && res.length > 0) {
        res.forEach(item => {
          let tempItem = {
            ...item,
            gender: item.gender === 'MALE'
          };
          if (item.gender === 'MALE') {
            tempItem = {
              ...item,
              gender: '先生'
            };
          } else if (item.gender === 'FEMALE') {
            tempItem = {
              ...item,
              gender: '女士'
            };
          } else {
            tempItem = {
              ...item,
              gender: ''
            };
          }
          tempList.push(tempItem);
          if (item.defaultAddress) {
            let chooseAddress = tempItem;
            try {
              uni.setStorageSync('wj_chooseAddressInfo', chooseAddress);
              app.globalData.latitude = chooseAddress.latitude;
              app.globalData.longitude = chooseAddress.longitude;
            } catch (e) {}
          }
        });
      }
      state.addressList = tempList;
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {}
}
function getMapSet() {
  // console.log(app.globalData.systemConfigure.deliveryDistanceThirdMap,'deliveryDistanceThirdMap')
  state.deliveryDistanceThirdMap = app.globalData.systemConfigure.deliveryDistanceThirdMap;
}
onLoad(function (options) {
  uni.hideShareMenu();
  // 实例化API核心类
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey
    });
  });
  state.themeColor = app.globalData.uiconfig.themeColor;
  if (options.from === 'perfectOrder') {
    state.navigationBarTitle = '地址选择';
    if (app.globalData.userInfo.member) {
      getAddressList(this);
      state.chooseAddress = true;
    } else {}
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {
  uni.hideShareMenu();
  if (app.globalData.userInfo.member) {
    queryAddress();
  } else {
    uni.showToast({
      title: '您还不是会员，请先绑定手机号码成为会员',
      icon: 'none',
      duration: 2000
    });
  }

  // 获取地图项配置
  getMapSet();
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/addressList/addressList.wxss */

page {
  background: #ffffff;
  /* height: 100%; */
}

.content {
  /* margin-bottom: 100rpx; */
  padding: 0 40rpx 150rpx 40rpx;
  width: 100%;
  /* height: 100%; */
  box-sizing: border-box;
  background: #fff;
  margin-bottom: 20rpx;
}

.title {
  font-size: 28rpx;
  height: 90rpx;
  line-height: 90rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  border-bottom: 1rpx solid #f1f1f1;
}

.title view:first-of-type {
  color: #454545;
}

.title view:first-of-type image {
  width: 25rpx;
  height: 30rpx;
  vertical-align: middle;
  margin-right: 18rpx;
  margin-top: -6rpx;
}

/* .title view:last-of-type {
  color: #009f55;
} */
/* 
.title view:last-of-type image {
  width: 20rpx;
  height: 20rpx;
  margin-right: 15rpx;
  margin-top: -6rpx;
} */

/* .title view.delete {
  color: #454545;
} */

/* .title view.delete image {
  width: 29rpx;
  height: 35rpx;
  vertical-align: middle;
  margin-top: -9rpx;
} */

.isChecked {
  width: 32rpx;
  height: 32rpx;
  position: absolute;
  right: 0;
  top: 71rpx;
}

.address-item {
  background: #fff;
  font-size: 26rpx;
  padding: 26rpx 0;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f1f1f1;
  position: relative;
}

.address-item .item-main {
  width: 620rpx;
  height: 100%;
  float: left;
  color: #454545;
  line-height: 36rpx;
}

.address-item image {
  width: 30rpx;
  height: 30rpx;
}

.address-item .item-main .address-title {
  font-size: 32rpx;
  line-height: 36rpx;
  font-weight: bold;
  margin-bottom: 6rpx;
}

.address-item .item-main .address-icon {
  height: 26rpx;
  border: 1rpx solid #009f55;
  border-radius: 5rpx;
  font-size: 20rpx;
  line-height: 26rpx;
  padding: 0 18rpx;
  color: #009f55;
  display: inline-block;
  margin-left: 10rpx;
}

.address-item .item-main .name-mobile {
  font-size: 28rpx;
  line-height: 36rpx;
}

.address-item .item-main .address-info {
  font-size: 24rpx;
  margin-bottom: 18rpx;
  line-height: 36rpx;
}

.address-item .item-main .name-mobile text:first-of-type {
  margin-right: 22rpx;
  padding-right: 18rpx;
  border-right: 1rpx solid #8b8b8c;
}

.address-item .item-main .name-mobile text:last-of-type {
  font-weight: bold;
}
.bottom-btn-box {
    display: flex;
    position:fixed;
    bottom: 0;
    justify-content: space-around;
    width: 100%;
    border-top: 1rpx solid #dcdcdc;
    background: #fff;
}
.bottom-box {
  /* width: 100%; */
  height: 130rpx;
  /* border-top: 1rpx solid #dcdcdc; */
  text-align: center;
  line-height: 100rpx;
  /* position: fixed;
  bottom: 0rpx; */
  left: 0rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  z-index: 999;
}

.bottom-box image {
  width: 36rpx;
  height: 36rpx;
  vertical-align: middle;
  margin-top: -6rpx;
  font-size: 36rpx;
}

.bottom-box button {
  height: 88rpx;
  width: 300rpx;
  line-height: 88rpx;
  color: #fff;
  background: #009f55;
  padding: 0;
  border-radius: 88rpx;
}

.no-data {
  text-align: center;
  margin-top: 200rpx;
}

.no-data image {
  width: 257rpx;
  height: 261rpx;
}
</style>