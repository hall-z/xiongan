<template>
  <!--components/navigation-bar/navigation-bar.wxml-->
  <wd-navbar
    :loading="props.loading"
    safeAreaInsetTop
    fixed
    placeholder
    :animated="props.animated"
    :custom-style="
      (!props.isShowTopNavigation
        ? 'position: absolute;left: 0;top:0;' + props.extStyle
        : props.extStyle) +
      ('background: ' + props.isHome && props.isShowTopNavigationFlag && !props.isShowTopNavigation
        ? 'transparent'
        : props.background)
    "
    :color="props.color"
    :title="props.title"
    :back="props.back"
  >
    <template #left>
      <view v-if="props.isShowAddress">
        <view
          :class="
            'left-navigation-bar-box ' +
            (state.hideBack ? 'no-back' : '') +
            ' ' +
            props.leftClass +
            ' left-navigation-bar-box1'
          "
          v-if="!state.isTabbar"
        >
          <view class="navigation_bar_btn_goback" @click="goBack" v-if="!state.hideBack">
            <image
              class=""
              :src="state.imagesPath.navigation_bar_btn_goback"
              mode="widthFix"
            ></image>
          </view>
          <view class="navigation_bar_btn_gohome" @click="goHome" v-if="state.hideBack">
            <image :src="state.imagesPath.navigation_bar_btn_gohome" mode="widthFix"></image>
          </view>
          <view class="search search1" @click="handleConfirm" v-if="props.isShowSearch">
            <image style="width: 28rpx; height: 28rpx" :src="state.imagesPath.iconSearch"></image>
            请输入搜索关键词
          </view>
          <view
            v-if="props.isShowCustomer"
            @click="props.isOpenCustomerService ? '' : 'callPhone'"
            class="contact-icon"
          >
            <button v-if="props.isOpenCustomerService" open-type="contact">
              <image :src="imagesPath.iconCustomerService" mode="widthFix"></image>
              <text>客服</text>
            </button>
          </view>
          <view
            class="store-type-text"
            v-if="props.storeTypeText"
            :style="'width: ' + props.storeTypeText.length * 42 + 'rpx'"
          >
            {{ props.storeTypeText }}
          </view>
          <view class="address" v-if="props.isShowAddressText" @click="changeAddress">
            <image
              style="width: 22rpx; height: 30rpx"
              :src="state.imagesPath.iconNearStoreAddress"
            ></image>
            <text>{{ state.addressName || '暂无地址信息' }}</text>
          </view>
        </view>
      </view>
      <view v-else-if="!props.isHome">
        <view
          :class="
            'left-navigation-bar-box ' + (state.hideBack ? 'no-back' : '') + ' ' + props.leftClass
          "
          v-if="!state.isTabbar"
        >
          <view class="navigation_bar_btn_goback" @click="goBack" v-if="!state.hideBack">
            <image
              class=""
              :src="state.imagesPath.navigation_bar_btn_goback"
              mode="widthFix"
            ></image>
          </view>
          <view class="navigation_bar_btn_gohome" @click="goHome">
            <image :src="state.imagesPath.navigation_bar_btn_gohome" mode="widthFix"></image>
          </view>
        </view>
      </view>
      <view v-else>
        <view :class="'left-box ' + (!props.isShowTopNavigationFlag ? 'top-left-box' : '')">
          <view class="address" v-if="props.nearStoreStyle === '1'" @click="changeAddress">
            <image
              style="width: 22rpx; height: 30rpx"
              :src="state.imagesPath.iconNearStoreAddress"
            ></image>
            <text>{{ state.addressName || '暂无地址信息' }}</text>
          </view>
          <view class="search" @click="handleConfirm" v-if="props.topSearchStyle === '1'">
            <image style="width: 28rpx; height: 28rpx" :src="state.imagesPath.iconSearch"></image>
          </view>
        </view>
      </view>
    </template>
    <template #right>
      <view v-if="props.isShopcart">
        <view class="share-shopping-cart" style="position: relative">
          <button
            @click.stop="shareView"
            open-type="share"
            style="
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: transparent;
            "
          ></button>
          <image :src="state.imagesPath.share_shopping_cart" mode="widthFix"></image>
        </view>
      </view>
    </template>
  </wd-navbar>
</template>
<script setup>
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import { reactive, watch, onBeforeMount, onMounted } from 'vue'

const app = getApp()
// components/navigation-bar/navigation-bar.js
const IMGAGESPATH = _utilsImagesPathJs
const UTILS = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const sysService = _apiSystemServiceJs
// 获取应用实例
const state = reactive({
  latitudeAndLongitude1: null,
  addressName: null,
  storeInfoName: '',
  storeInfo: null,
  imagesPath: IMGAGESPATH,
  isTabbar: false,
  hideBack: false,
})
const props = defineProps({
  title: {
    type: String,
    value: '',
  },
  background: {
    type: String,
    value: '#ffffff',
  },
  color: {
    type: String,
    value: '#333333',
  },
  back: {
    type: Boolean,
    value: false,
  },
  isShowCustomer: {
    type: Boolean,
    value: false,
  },
  isOpenCustomerService: {
    type: Boolean,
    value: false,
  },
  loading: {
    type: Boolean,
    value: false,
  },
  animated: {
    type: Boolean,
    value: true,
  },
  show: {
    type: Boolean,
    value: true,
  },
  leftClass: {
    type: String,
    value: '',
  },
  extStyle: {
    type: String,
    value: '',
  },
  isHome: {
    // 是否是首页
    type: Boolean,
    value: false,
  },
  isShopcart: {
    // 是否是购物车
    type: Boolean,
    value: false,
  },
  isShowAddress: {
    // 顶部不同配置
    type: Boolean,
    value: false,
  },
  isShowSearch: {
    // 顶部不同配置
    type: Boolean,
    value: false,
  },
  isStoreDetail: {
    type: Boolean,
    value: false,
  },
  isShowAddressText: {
    // 顶部不同配置
    type: Boolean,
    value: false,
  },
  isShowTopNavigation: {
    // 是否
    type: Boolean,
    value: true,
  },
  isShowTopNavigationFlag: {
    // 是否顶屏
    type: Boolean,
    value: false,
  },
  storeId: {
    // 门店id
    type: String,
    value: '',
  },
  storeTypeText: {
    // 门店类别
    type: String,
    value: '',
  },
  topSearchStyle: {
    // 风格显示 为1才在这头部显示
    type: String,
    value: '',
  },
  nearStoreStyle: {
    // 风格显示 为1才在这头部显示
    type: String,
    value: '',
  },
  latitudeAndLongitude: {
    type: String,
    value: '',
  },
})
watch(
  () => [props.nearStoreStyle, props.storeInfo, props.latitudeAndLongitude],
  function (changeVal) {
    const [nearStoreStyle, storeInfo, latitudeAndLongitude] = changeVal
    console.log(
      nearStoreStyle,
      storeInfo,
      latitudeAndLongitude,
      'nearStoreStyle, storeInfo, latitudeAndLongitude',
    )
    if (latitudeAndLongitude && latitudeAndLongitude !== state.latitudeAndLongitude1) {
      const latitudeAndLongitudeList = latitudeAndLongitude.split(',')
      // 2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
      UTILS.inverseAnalysisAddress(latitudeAndLongitudeList[0], latitudeAndLongitudeList[1]).then(
        (res) => {
          const resData = res.data.result || res.result
          state.addressName = resData.formatted_address
            ? resData.formatted_address
            : resData.formattedAddresses.recommend
        },
      )
      state.latitudeAndLongitude1 = latitudeAndLongitude
    } else if (nearStoreStyle === '1' && storeInfo) {
      state.storeInfoName = storeInfo.name || ''
    }
  },
)
onBeforeMount(() => {
  const that = this
  state.storeInfo = app.globalData.storeInfo
  state.storeInfoName = app.globalData.storeInfo ? app.globalData.storeInfo.name : ''
  const chooseAddress = uni.getStorageSync('wj_chooseAddressInfo')
  if (chooseAddress && chooseAddress.detailedAddress) {
    state.addressName = chooseAddress.detailedAddress
  }
  const currentPages = UTILS.utilGetCurrentPage()
  const pageStack = getCurrentPages()
  if (pageStack.length === 1) {
    state.hideBack = true
  }
  let pagePath = currentPages.route
  pagePath.indexOf('/') != 0 && (pagePath = '/' + pagePath)
  const self = this
  if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
    app.globalData.tabBar.list.forEach((item) => {
      if (
        pagePath === item.pagePath &&
        item.pagePath != '/pages-sub/newretail/pages/mallModule/myCard/memberCard/memberCard'
      ) {
        state.isTabbar = true
      }
    })
  }
  if (pagePath === '/pages-sub/newretail/pages/mallModule/advertising/advertising') {
    state.isTabbar = true
  }
  Object.defineProperty(app.globalData, 'storeInfo', {
    set: function (value) {
      this._storeInfo = value
      state.storeInfo = value
      state.storeInfoName = value ? value.name : ''
    },
    get: function () {
      return this._storeInfo
    },
  })
})
onMounted(() => {
  updateStoreInfo()
})
onShow(() => {
  updateStoreInfo()
})
function callPhone() {
  // let picture = this.data.productPictures[0].url
  // let title = this.data.name
  // let sellPrice = this.data.sellPrice
  // let description = this.data.description
  // `?goodsId=${this.data.goodsId}&picture=${picture}&title=${title}&sellPrice=${sellPrice}&description=${description}&goodPageData=${JSON.stringify(this.data.options)}`
  const storeInfo = app.globalData.storeInfo || uni.getStorageSync('storeIdactive')
  NAVPAGE.toCustomService('', storeInfo.id)
}
function changeAddress() {
  NAVPAGE.toAddressList('?from=index')
}
function updateStoreInfo() {
  if (app.globalData.storeInfo) {
    state.storeInfo = app.globalData.storeInfo
    state.storeInfoName = app.globalData.storeInfo.name || ''
  }
  if (app.globalData.latitude && app.globalData.longitude) {
    // 2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
    UTILS.inverseAnalysisAddress(app.globalData.latitude, app.globalData.longitude).then((res) => {
      const resData = res.data.result || res.result
      state.addressName = resData.formatted_address
        ? resData.formatted_address
        : resData.formattedAddresses.recommend
    })
    state.latitudeAndLongitude1 = app.globalData.latitude + ',' + app.globalData.longitude
  }
}
function changeStore() {
  NAVPAGE.toSelectStore()
}
function handleConfirm(e) {
  uni.navigateTo({
    url:
      '/pages-sub/newretail/pages/mallModule/goods/search/search' +
      (state.isStoreDetail ? '?showType=product&storeId=' + state.storeId : ''),
  })
}
function goBack() {
  uni.navigateBack({
    delta: 1,
  })
}
function goHome() {
  NAVPAGE.toHome()
}

// Watch listeners converted from observers
watch(
  () => props.nearStoreStyle,
  (newVal, oldVal) => {},
)
</script>
<style scoped>
/* components/navigation-bar/navigation-bar.wxss */
.left-navigation-bar-box {
  width: 176rpx;
  height: 58rpx;
  border: 1rpx solid #e7e7e7;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
}
.left-navigation-bar-box.opacity {
  background: rgba(255, 255, 255, 0.6);
}
.left-navigation-bar-box.no-back {
  width: 88rpx;
}
.left-navigation-bar-box image {
  width: 33rpx;
  height: 33rpx;
  margin: 0;
}
.navigation_bar_btn_goback,
.navigation_bar_btn_gohome {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.navigation_bar_btn_gohome {
  position: relative;
}
.navigation_bar_btn_gohome::before {
  content: '';
  display: block;
  width: 1px;
  height: 35rpx;
  background: #cdcdcd;
  border-radius: 1px;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -17rpx;
}
.left-navigation-bar-box.no-back .navigation_bar_btn_gohome::before {
  display: none;
}
.left-box {
  display: flex;
  align-items: center;
  width: 300%;
  margin-top: -5rpx;
  margin-left: -15rpx;
}
.address {
  display: flex;
  padding: 0 13rpx;
  height: 65rpx;
  box-sizing: border-box;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 65rpx;
  font-size: 28rpx;
  color: #000;
  margin-right: 10rpx;
}
.address image {
  margin-right: 8rpx;
}
.address text {
  width: 200rpx; /* 设置固定宽度 */
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出的文本 */
  text-overflow: ellipsis; /* 显示省略号 */
}
.search {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.3);
  height: 65rpx;
  width: 65rpx;
  border-radius: 50%;
}
.share-shopping-cart {
  width: 30rpx;
}
.share-shopping-cart image {
  width: 30rpx;
}
.left-box > view {
  border: 1px solid transparent;
}
.top-left-box > view {
  border-color: #ccc;
}
/* .navigation_bar_btn_goback image {
  width: 16rpx;
  height: 16rpx;
} */
.left-navigation-bar-box1 {
  width: auto;
  border: none;
  background-color: transparent;
}
.left-navigation-bar-box1 .navigation_bar_btn_goback,
.left-navigation-bar-box1 .navigation_bar_btn_gohome {
  margin-right: 18rpx;
}
.search1 {
  /* margin-left: 30rpx; */
  width: 339rpx;
  height: 70rpx;
  background: #ffffff;
  border-radius: 35rpx;
  font-size: 28rpx;
  color: #999999;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.search1 image {
  margin-right: 22rpx;
}
.store-type-text {
  font-size: 40rpx;
  font-weight: 700;
  display: flex;
  /* min-width: 170rpx; */
  max-width: 180rpx;
}
.contact-icon {
  display: flex;
  flex-direction: column;
  font-size: 20rpx;
  color: #333333;
  margin-left: 20rpx;
  width: 50rpx;
  justify-content: center;
  align-items: center;
}
.contact-icon image {
  filter: brightness(0);
}
</style>
