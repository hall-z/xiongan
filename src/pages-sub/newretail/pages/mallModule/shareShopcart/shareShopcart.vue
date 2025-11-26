<template>
<!--pages/mallModule/shareShopcart/shareShopcart.wxml-->
<navigationBar title="好友购物车分享"></navigationBar>
<view class="share-shopcart">
  <view class="member-info-box">
    <view class="member-avatar">
      <image :src="state.shareMemberAvatar" mode="widthFix"></image>
    </view>
    <view class="member-info">
      <view class="member-name">{{state.shareMemberNickname}}</view>
      <view class="member-text">我在{{state.shareStoreName}}准备买这些收藏的好物，你也一起来逛逛吧</view>
    </view>
  </view>
  <view class="store-box" @click="changeStore">
    <view class="store-box-lt">
      <image :src="state.imagesPath.share_shopcart_store_icon" mode="widthFix"></image>
    </view>
    <view class="store-box-center">
      当前门店：{{state.globalData.storeInfo.name}}
    </view>
    <view class="store-box-rt">
      <view class="angle">
      </view>
      <!-- <image src="{{imagesPath.iconRightWhite}}" mode="widthFix"></image> -->
    </view>
  </view>
  <view class="goods-title">
    <view class="title">商品清单</view>
    <view class="add-img" :style="'color:' + state.themeColor + ';'" @click="bindgoShop">
      <view class="add-bg" :style="'background-color: ' + state.themeColor + ';'"><image :src="state.imagesPath.shopping_icon_list" mode="widthFix"></image></view>
      <text>购物车</text>
    </view>
  </view>
  <view class="goods-list">
    <view class="goods-item" v-for="(item , i) in state.goodsList">
      <view class="goods-item-icon">
        <image :src="item.imageUrl" mode="widthFix"></image>
      </view>
      <view class="goods-item-info">
        <view class="info-item">
          <view class="info-title">{{item.name}}</view>
          <view class="info-price">
            <view class="item-price">
              ￥{{item.sellPrice || 0}}
            </view>
            <view class="info-add-car" :style="'color:' + state.themeColor + ';border-color:' + state.themeColor" @click="addToCart" :data-index="i" data-addType="normal" :data-balance="item.balance" :data-initialpurchasenumber="item.initialPurchaseNumber" :data-traceId="item.traceId" :data-style="item.style" data-type="add" :data-id="item.id" :data-business="item.business">加入购物车</view>
          </view>
          <view class="info-num">数量{{item.quantity}}</view>
        </view>
      </view>
    </view>
  </view>
  <view class="goods-title">
    <view class="title">失效商品</view>
    <!-- <view class="add-img" style="color:{{state.themeColor}};">
      <view class="add-bg" style="background-color: {{state.themeColor}};"><image src='{{state.imagesPath.shopping_icon_list}}' mode="widthFix"></image></view>
      <text></text>
    </view> -->
  </view>
  <view class="goods-list">
    <view class="goods-item" v-for="(item , index) in state.expiredGoodsList">
      <view class="goods-item-icon">
        <image :src="item.imageUrl" mode=""></image>
      </view>
      <view class="goods-item-info">
        <view class="info-item">
          <view class="info-title">{{item.name}}</view>
          <view class="info-price">
            <view class="item-price">
              ￥{{item.sellPrice || 0}}
            </view>
            <view class="info-add-car" style="border: none;"></view>
          </view>
          <view class="info-num">数量{{item.productNum || 0}}</view>
        </view>
      </view>
    </view>
  </view>
</view>
<view class="bottom-bt">
  <view class="share-btn" :style="'border-color:' + state.themeColor + ';background-color:' + state.themeColor" @click="share" v-if="state.shareMemberId === state.member.id">
    <button @click.stop="shareView" open-type="share" style="position: absolute; left: 0;top: 0;width: 100%;height: 100%;background-color: transparent;"></button>
    分享好友</view>
  <view class="bt-item" :style="'color: ' + state.themeColor + ';border-color:' + state.themeColor + ';'" @click="toHome" v-if="state.shareMemberId !== state.member.id">去逛逛</view>
  <view class="bt-item" :style="'position: relative;border-color:' + state.themeColor + ';background-color:' + state.themeColor" v-if="state.shareMemberId !== state.member.id">
    <button @click="getUserInfo" class="login-btn" data-type="add" style="position: absolute; left: 0;top: 0;width: 100%;height: 100%;background-color: transparent;border: transparent"></button>
    一键加购</view>
</view>
<!-- <view style="background-color: red;"><image class="add-img" src='{{imagesPath.shopping_icon_list}}'></image></view> -->
</template>
<script setup>
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _apiShopcartServiceJs from "@/service/api/newretail/shopcartService";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/shareShopcart/shareShopcart.js
const IMGAGESPATH = _utilsImagesPathJs;
const themeManager = _utilsThemeManagerJs;
const sysService = _apiSystemServiceJs;
const NAVPAGE = _utilsNavPageJs;
const wxaUserService = _apiWxaUserServiceJs;
const auth = _utilsAuthJs;
const ADDRESS = _utilsAddressJs;
const _shopcartService = _apiShopcartServiceJs;
const AUTHORIZE = _utilsAuthorizeJs;
const storeService = _apiStoreServiceJs;
const state = reactive({
  imagesPath: IMGAGESPATH,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  hasUserInfo: false,
  isMember: false,
  member: null,
  userInfo: null,
  memberId: '',
  // 分享人的id
  goodsList: '',
  // 商品清单数据
  expiredGoodsList: '',
  // 失效商品数据
  memberName: '',
  // 会员名称
  memberAvatar: '',
  // 会员头像
  globalData: {
    storeInfo: {}
  },
  shareMemberAvatar: '',
  shareMemberId: '',
  shareMemberNickname: '',
  shareStoreId: '',
  shareStoreName: '',
  options: {},
  // 分享参数
  sharePictures: '',
  distributionStoreId: '' // 统配门店id
});
async function onLaunch() {
  // if (!this.globalData.storeInfo || !this.globalData.storeInfo.id) {
  //   await this.getStoreInfo();
  //   await this.getShoppingCartShare();
  // }
}
onLoad(async function (options) {
  // const obj = options
  // for (const key in obj) {
  //   if (Object.hasOwnProperty.call(obj, key)) {
  //     const element = obj[key];
  //     this.setData({
  //       [key]: element
  //     })
  //   }
  // }
  // console.log(JSON.parse(this.data.goodsList),'JSON.parse(this.data.goodsList)');
  // this.setData({
  //   goodsList: JSON.parse(this.data.goodsList),
  //   expiredGoodsList: JSON.parse(this.data.expiredGoodsList),
  // })

  if (!app.globalData.storeInfo) {
    // this.getStoreInfo();
    console.log('没有门店信息');
    checkLocationAuth();
  } else {
    console.log('有门店信息', app.globalData.storeInfo);
    getShoppingCartShare();
  }
  if (options && options.shareId) {
    state.options = options;
  }
  let keyArr = ["themeColor"];
  const keys = keyArr.join(",");
  sysService.query(keys).then(res => {
    if (res) {
      res.forEach(val => {
        state.themeColor = val.value;
      });
    }
  }).catch(err => {
    console.log(err);
  });
  // 获取当前页面分享图
  getSharePictures();
});
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures;
  }
}
function checkLocationAuth() {
  // let setTip = wx.getStorageSync('setTip')
  // if(setTip) return false
  uni.getSetting({
    success: res => {
      // wx.setStorageSync('setTip', true)
      let authSetting = res.authSetting;
      if (authSetting['scope.userLocation']) {
        getRecentlyStore();
      } else if (authSetting['scope.userLocation'] === false) {
        // 用户未授权，提示用户进行授权
        uni.showModal({
          title: '温馨提示',
          content: '您未授权地理位置信息，部分功能无法正常使用哦~',
          confirmText: '授权位置',
          success: res => {
            if (res.confirm) {
              uni.openSetting();
            }
          }
        });
      } else {
        // 用户未明确拒绝也未授权，提示用户进行设置
        uni.authorize({
          scope: 'scope.userLocation',
          success: () => {
            getRecentlyStore();
          },
          fail: () => {
            uni.showModal({
              title: '温馨提示',
              content: '您未授权地理位置信息，部分功能无法正常使用哦~',
              confirmText: '授权位置',
              success: res => {
                // 处理用户响应
                if (res.confirm) {
                  uni.openSetting();
                }
              }
            });
          }
        });
      }
    },
    fail: err => {}
  });
}
function getRecentlyStore() {
  // 获取到当前的地理位置，查找出最近的门店
  uni.getLocation({
    type: 'gcj02',
    success: res => {
      let latitude = res.latitude;
      let longitude = res.longitude;
      app.globalData.location = {
        latitude: res.latitude,
        longitude: res.longitude
      };
      let tempAllStores = uni.getStorageSync('wj_allStores'); // 获取缓存的所有门店
      let tempIndex = null;
      if (!tempAllStores) {
        storeService.queryList().then(async res => {
          tempAllStores = [];
          res.forEach(item => {
            if (item.status === 'OPEN') {
              tempAllStores.push(item);
            }
          });
          uni.setStorageSync('wj_allStores', tempAllStores);
          tempIndex = ADDRESS.getNearestStore(tempAllStores, latitude, longitude);
          app.globalData.storeInfo = tempAllStores[tempIndex];
          uni.setStorageSync('storeIdactive', app.globalData.storeInfo);
          await getShoppingCartShare();
        }).catch(err => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      } else {
        tempIndex = ADDRESS.getNearestStore(tempAllStores, latitude, longitude);
        app.globalData.storeInfo = tempAllStores[tempIndex];
        uni.setStorageSync('storeIdactive', app.globalData.storeInfo);
        getShoppingCartShare();
      }
    },
    fail: res => {
      state.hasaAuthorization = false;
      state.showTabbar = false;
    }
  });
}
function changeStore() {
  NAVPAGE.toSelectStore();
}
async function getShoppingCartShare(storeInfo) {
  console.log(app, 'storeInfo11111111');
  let params = {
    shareId: options.shareId,
    storeId: app.globalData.storeInfo.id
  };
  state.globalData.storeInfo = app.globalData.storeInfo;
  let that = this;
  await _shopcartService.getShoppingCartShare(params).then(res => {
    if (res) {
      let goodsLis = [];
      let expiredGoodsList = [];
      if (res.productList.length > 0) {
        res.productList.forEach(val => {
          if (val.shelvesStatus === 'ON') {
            goodsLis.push(val);
          } else {
            expiredGoodsList.push(val);
          }
        });
      }
      console.log(goodsLis, expiredGoodsList, 'expiredGoodsList');
      state.goodsList = goodsLis;
      state.expiredGoodsList = expiredGoodsList;
      state.shareMemberAvatar = res.shareMemberAvatar;
      state.shareMemberId = res.shareMemberId;
      state.shareMemberNickname = res.shareMemberNickname;
      state.shareStoreId = res.shareStoreId;
      state.shareStoreName = res.shareStoreName;
    }
  });
}
function shopcartService(e) {
  console.log(e, 'eeeeeeee');
}
function toAuthorize() {
  NAVPAGE.toAuthorize();
}
onReady(function () {
  checkUserInfo();
  getMemberUserInfo();
});
async function getStoreInfo(options) {
  const that = this;
  console.log(app, 'appappappapp');
  if (!app.globalData.storeInfo || !app.globalData.storeInfo.id) {
    await ADDRESS.getAllStore(function (storeInfo) {}, true);
    await getShoppingCartShare();
  }
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    state.userInfo = {
      ...app.globalData.userInfo,
      ...app.globalData.userInfo.wxaUser
    };
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo;
      state.isMember = true;
      state.member = res.member;
      getMemberUserInfo();
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
  }
}
function addToCart(e) {
  // console.log(e);
  let that = this;
  let index = e.currentTarget.dataset.index;
  let params = {
    lists: [],
    storeId: ''
  };
  params.storeId = state.goodsList[index].business === 'DISTRIBUTION' ? state.distributionStoreId : app.globalData.storeInfo.id;
  let goodItem = state.goodsList[index];
  let goodObj = {
    count: goodItem.quantity,
    productId: goodItem.productId
    // business: goodItem.business,
    // storeId: app.globalData.storeInfo.id,
  };
  params.lists.push(goodObj);
  _shopcartService.cateringAdd(params).then(res => {
    uni.showToast({
      title: '加入购物车成功',
      icon: 'none',
      duration: 2000
    });
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function addToCartAll(e) {
  let that = this;
  let params = {
    lists: [],
    storeId: ''
  };
  let DISTRIBUTIONLIST = [];
  state.goodsList.forEach(val => {
    let goodObj = {
      count: val.quantity,
      productId: val.productId
      // business: val.business,
      // storeId: app.globalData.storeInfo.id,
    };
    if (val.business === 'DISTRIBUTION') {
      DISTRIBUTIONLIST.push(goodObj);
    } else {
      params.lists.push(goodObj);
    }
  });
  params.storeId = app.globalData.storeInfo.id;
  _shopcartService.cateringAdd(params).then(res => {
    if (DISTRIBUTIONLIST.length < 1) {
      uni.showToast({
        title: '加入购物车成功',
        icon: 'none',
        duration: 2000
      });
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
  if (DISTRIBUTIONLIST.length > 0) {
    params.storeId = state.distributionStoreId;
    params.lists = DISTRIBUTIONLIST;
    _shopcartService.cateringAdd(params).then(res => {
      uni.showToast({
        title: '加入购物车成功',
        icon: 'none',
        duration: 2000
      });
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
function getUserInfo(e) {
  console.log(e, 'eee');
  AUTHORIZE.login(e).then(res => {
    state.hasUserInfo = true;
    if (res.member) {
      state.isMember = true;
      addToCartAll();
    } else {
      NAVPAGE.toAuthorize();
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getMemberUserInfo() {
  const that = this;
  const user = app.globalData.userInfo;
  if (user) {
    state.userInfo = {
      ...state.userInfo,
      ...user.wxaUser
    };
    if (user.member) {
      state.hasUserInfo = true;
      state.isMember = true;
      state.member = {
        ...state.member,
        ...user.member
      };
    }
  }
}
function isLogin() {}
function bindgoShop() {
  NAVPAGE.toShopcart();
}
function toHome() {
  NAVPAGE.toHome();
}
onShow(function () {
  let self = this;
  storeService.getDistributionStore().then(res => {
    if (res) {
      state.distributionStoreId = res.id;
    }
  }).catch(err => {
    console.log(err.message);
  });
  if (app.globalData.storeInfo) {
    state.globalData.storeInfo = app.globalData.storeInfo;
    getShoppingCartShare();
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {
  let path = `/pages/mallModule/shareShopcart/shareShopcart?shareId=${options.shareId}`;
  return {
    title: app.globalData.systemConfigure.miniprogramSharingName,
    // path: '/pages-sub/newretail/pages/mallModule/index/index/index?shareId=' + memberId + '&storeId=' + storeId,
    path: path,
    imageUrl: sharePictures,
    success(e) {
      uni.showShareMenu({
        withShareTicket: true
      });
    }
  };
});
</script>
<style scoped>
/* pages/mallModule/shareShopcart/shareShopcart.wxss */
.share-shopcart {
  width: 100%;
  height: 100vh;
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #f4f4f4;
  overflow-y: scroll;
}

.member-info-box {
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 100rpx;
  margin-top: 20rpx;
}

.member-info-box .member-avatar {
  width: 80rpx;
  height: 80rpx;
  /* background-color: red; */
  border-radius: 50%;
}

.member-info-box .member-avatar image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.member-info {
  flex: 1;
  width: 100%;
  margin-left: 20rpx;
}

.member-info .member-name {
  font-size: 24rpx;
  color: #333;
}

.member-info .member-text {
  font-size: 24rpx;
  color: #999;
}

.goods-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20rpx 0 30rpx 0;
}

.goods-title .title {
  font-size: 24rpx;
  color: #999;
  padding-left: 20rpx;
  box-sizing: border-box;
}

.goods-title .add-img {
  display: flex;
  align-items: center;
  font-size: 24rpx;
}

.goods-title .add-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  margin-right: 6rpx;
}


.goods-title .add-img image {
  width: 70%;
}

.goods-list {
  padding: 0 20rpx;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.goods-list .goods-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 20rpx 0 0 0;
  padding-bottom: 30rpx;
  border-bottom: 1px solid #eee;
}

.goods-list .goods-item:last-of-type {
  border: none;
}

.goods-list .goods-item .goods-item-icon {
  width: 120rpx;
  height: 120rpx;
  /* background-color: pink; */
  border-radius: 10rpx;
}

.goods-item .goods-item-icon image {
  width: 100%;
  height: 100%;
}

.goods-item-info {
  margin-left: 10rpx;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item {
  flex: 1;
}

.info-item .info-title {
  font-size: 30rpx;
  color: #333;
}

.info-item .info-price {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #333;
  margin-top: 10rpx;
}

.goods-item-info .info-add-car {
  font-size: 23rpx;
  border: 1px solid #333;
  border-radius: 20rpx;
  padding: 2rpx 8rpx;
}

.info-item .info-num {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.bottom-bt {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  padding: 20rpx 20rpx 80rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  font-size: 30rpx;
}

.bottom-bt .bt-item {
  width: 47%;
  text-align: center;
  height: 90rpx;
  line-height: 90rpx;
  border: 1px solid #333;
  border-radius: 60rpx;
  color: #fff;
}

.bottom-bt .share-btn {
  position: relative;
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  color: #fff;
  text-align: center;
  border: 1px solid #333;
  border-radius: 60rpx;
}

button::after {
  border: none;
}

button {
  background-color: transparent;
}

.store-box {
  display: flex;
  align-items: center;
  width: 710rpx;
  height: 80rpx;
  background: #FFFFFF;
  border-radius: 40rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
  margin-top: 20rpx;
}

.store-box-lt {
  width: 28rpx;
}

.store-box-lt image {
  width: 28rpx;
}


.store-box-center {
  padding: 0 20rpx;
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 28rpx;
  color: #333333;
  overflow: hidden; /* 隐藏溢出的文本 */
  text-overflow: ellipsis; /* 显示省略号 */
  white-space: nowrap; /* 禁止文本换行 */
}
.store-box-rt {
  position: relative;
  width: 20rpx;
  height: 100%;
  display: flex;
  align-items: center;
  /* background-color: #000; */
}

.store-box-rt image {
  width: 24rpx;
}


.angle {
  position: relative;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-top-width: 0;
  border-bottom-color: #000;
  border-width: 14rpx;
  transform: rotate(95deg);
}
.angle::after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  content: " ";
  border-width: 14rpx;
  top: 1px;
  margin-left: -14rpx;
  border-top-width: 0;
  border-bottom-color: #fff;
}
</style>