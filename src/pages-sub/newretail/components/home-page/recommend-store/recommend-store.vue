<template>
  <!--components/home-page/recommend-store/recommend-store.wxml-->
  <view>
    <view class="mall-recommend-loading" v-if="loadingFlag">
      <view class="item-box">
        <view class="img-box"></view>
        <view class="info-box">
          <view class="name"></view>
          <view class="desc"></view>
          <view class="price"></view>
        </view>
      </view>
      <view class="item-box">
        <view class="img-box"></view>
        <view class="info-box">
          <view class="name"></view>
          <view class="desc"></view>
          <view class="price"></view>
        </view>
      </view>
      <view class="item-box">
        <view class="img-box"></view>
        <view class="info-box">
          <view class="name"></view>
          <view class="desc"></view>
          <view class="price"></view>
        </view>
      </view>
    </view>
    <view v-if="!loadingFlag" class="goods-box recommend-store">
      <view
        v-for="(item, index) in state.storeList"
        :key="index"
        class="store-box"
        @click="goDetail"
        :data-idx="index"
        :data-id="item.id"
      >
        <view class="recommend-store-msg">
          <view class="store-img">
            <image :src="item.imageUrl" mode="widthFix"></image>
          </view>
          <view class="store-msg">
            <view class="store-msg-name">{{ item.name }}</view>
            <view class="store-detail-box">
              <view class="store-detail">
                <view style="background-color: #f34c23; color: #fff" class="detail-item">
                  {{ item.rating || '-' }}分
                </view>
                <view
                  style="border: 1px solid #f34c23; color: #f34c23"
                  class="detail-item"
                  v-if="item.selfFlag"
                >
                  自提
                </view>
                <view
                  style="border: 1px solid #23c257; color: #23c257"
                  class="detail-item"
                  v-if="item.expressFlag"
                >
                  外送
                </view>
                <view>已售 {{ item.soldCount }}</view>
                <!-- {{item.soldCount > 1000 ? '+' : ''}} -->
              </view>
              <view v-if="item.distance">{{ item.distance }}km</view>
            </view>
          </view>
        </view>
        <scroll-view
          v-if="item.productList && item.productList.length > 0"
          enable-flex="true"
          class="scroll-view_H"
          scroll-x="true"
          style="width: 100%; display: flex"
        >
          <view v-for="(item1, index) in item.productList" :key="index" class="scroll-product">
            <view class="product-img">
              <image :src="item1.imageUrl" mode="widthFix"></image>
            </view>
            <view class="product-name">
              {{ item1.name }}
            </view>
            <view class="gm-goods-price" v-if="item1.sellPrice != null">
              <view>
                <text class="nowPrice">
                  <text style="font-size: 20rpx">￥</text>
                  {{
                    item1.memberPrice && item1.memberPrice < item1.sellPrice
                      ? filtToFix(item1.memberPrice)
                      : item1.sellPrice
                        ? filtToFix(item1.sellPrice)
                        : filtToFix(item1.originalPrice)
                  }}
                  <text style="font-size: 20rpx" v-if="item1.style == 'SPEC_PARENT'">起</text>
                </text>
                <text
                  class="oldPrice"
                  v-if="
                    item1.sellPrice < 1000 &&
                    item1.originalPrice &&
                    item1.sellPrice < item1.originalPrice
                  "
                >
                  <text style="font-size: 20rpx">￥</text>
                  {{ filtToFix(item1.originalPrice) }}
                </text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="recommend-store-end"></view>
  </view>
</template>
<script setup>
import _homePageCommonBehaviorJs from '../homePageCommonBehavior'
import _lazyLoadPageLazyLoadBaseJs from '../../lazy-load-page/lazy-load-base'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
// import { ready } from "@dcloudio/uni-app";
import { reactive, watch, onBeforeMount, onMounted } from 'vue'
const filtToFix = (val) => {
  return val.toFixed(2)
}
const app = getApp()
// components/home-page/recommend-store/recommend-store.js
const IMGAGESPATH = _utilsImagesPathJs
const THEME = _utilsThemeManagerJs
const util = _utilsUtilsJs
const storeService = _apiStoreServiceJs
const productService = _apiProductServiceJs
const NAVPAGE = _utilsNavPageJs
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs
const homePageCommonBehavior = _homePageCommonBehaviorJs
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
// 获取应用实例
const state = reactive({
  storeList: [],
  loadingFlag: true,
  imagesPath: IMGAGESPATH,
  theme: THEME,
  themeColor: THEME.color,
  loaded: false,
  isShow: false,
  orderTimer: null,
})
const props = defineProps({
  show: {
    // 属性名
    type: Boolean,
    value: false,
  },
  storeInfo: Object,
  pageScrollData: {
    // 属性名
    type: Object,
    value: {},
  },
  pageScrollData1: {
    // 属性名
    type: Object,
    value: {},
  },
  latitudeAndLongitude: {
    // 属性名
    type: String,
    value: '',
  },
  uiconfig: Object,
  displayStyle: String,
  refreshType: {
    // 属性名
    type: String,
    value: '',
  },
})
onBeforeMount(() => {
  state.theme = {
    color:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background: ' + app.globalData.uiconfig.themeColor + ';'
        : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient:
      app.globalData.uiconfig &&
      app.globalData.uiconfig.themeColor != null &&
      app.globalData.uiconfig.themeColor !== '#FF9F43'
        ? 'background: linear-gradient(-270deg, ' +
          app.globalData.uiconfig.themeColor +
          ', ' +
          app.globalData.uiconfig.themeColor +
          ');'
        : 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
    mainColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'border-color:rgba(255,159,67, 0.4);',
    mainColorRgb02:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
        : 'rgba(255,159,67, 0.2)',
    BgColorRgb01:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
        : 'background-color:rgba(255,159,67, 0.1);',
  }
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
})
function getScorll(latitude, longitude) {
  lazyLoadBase
    .determineComponentInVisibleArea(`.recommend-store-end`, this, 500)
    .then((res) => {
      if (state.loadingFlag) return false
      if (res) {
        state.loadingFlag = true
        const chooseAddress = uni.getStorageSync('wj_chooseAddressInfo')
        latitude = chooseAddress && chooseAddress.latitude ? chooseAddress.latitude : latitude
        longitude = chooseAddress && chooseAddress.longitude ? chooseAddress.longitude : longitude
        hadleStoreOrder(latitude, longitude, state.page + 1)
      }
    })
    .catch((err) => {})
}
function hadleStoreOrder(latitude, longitude, page) {
  state.loadingFlag = true
  latitude = latitude || state.latitude || app.globalData.latitude
  longitude = longitude || state.longitude || app.globalData.longitude
  if (state.page * state.pageSize >= state.total) {
    state.loadingFlag = false
    uni.hideLoading()
    return false
  }
  state.storeList = page ? state.storeList : []
  state.page = page || 1
  try {
    const params = {
      page: state.page,
      pageSize: 10,
      searchCount: true,
      longitude,
      latitude,
    }
    storeService
      .queryHomeProduct(params)
      .then((res) => {
        if (res && res.records) {
          handleStoreInfo(state.storeList.concat(res.records))
        } else {
          state.loadingFlag = false
        }
      })
      .catch((err) => {
        handleStoreInfo(state.storeList)
      })
    /**
     * 处理门店数据
     * @param allStores 所有门店信息
     */
    function handleStoreInfo(allStores) {
      const distanceArr = []
      let newArr = []
      if (allStores.length > 0) {
        allStores.forEach((item) => {
          const dis = util.distance(latitude, longitude, item.latitude, item.longitude)
          distanceArr.push({
            distance: dis,
            id: item.virtualStoreId || item.id,
          })
        })
      }
      newArr = [].concat(distanceArr) // newArr为一个新的数组，不是简单的赋值引用
      function compare(property) {
        return function (a, b) {
          const value1 = a[property]
          const value2 = b[property]
          return value1 - value2
        }
      }
      newArr.sort(compare('distance')) // newArr已经按照从小到大的顺序进行排列, 根据对象中的distance属性进行排序
      const newTempAllStore = []
      for (let i = 0; i < newArr.length; i++) {
        for (let j = 0; j < distanceArr.length; j++) {
          if (newArr[i].id == distanceArr[j].id) {
            allStores[j].userLatitude = newArr[i].latitude // 加入用户经纬度
            allStores[j].userLongitude = newArr[i].longitude // 加入用户经纬度
            allStores[j].distance = newArr[i].distance // 加入距离参数
            newTempAllStore.push(allStores[j]) // j的顺序与allStore中的数据顺序一致
          }
        }
      }
      const tempData = []
      for (let i = 0; i < newTempAllStore.length; i++) {
        console.log(newArr[i].distance, 'storedistance')
        const obj = {
          ...newTempAllStore[i],
          distance: newArr[i] && newArr[i].distance ? newArr[i].distance.toFixed(2) : null,
        }
        if (newTempAllStore[i].shipmentTypes.indexOf('SELF') > -1) {
          obj.selfFlag = true
        }
        if (newTempAllStore[i].shipmentTypes.indexOf('EXPRESS') > -1) {
          obj.expressFlag = true
        }
        if (
          !tempData.some((item) => item.id === obj.id && item.virtualStoreId === obj.virtualStoreId)
        ) {
          tempData.push(obj)
        }
      }
      state.storeList = tempData
      state.loadingFlag = false
    }
  } catch (e) {
    state.loadingFlag = false
  }
}
function goDetail(e) {
  const id = e.currentTarget.dataset.id
  const storeData = {
    ...state.storeList[e.currentTarget.dataset.idx],
  }
  delete storeData.productList
  delete storeData.storeImages
  delete storeData.consultImages
  app.globalData.storeInfo = storeData
  uni.setStorageSync('storeIdactive', app.globalData.storeInfo)
  NAVPAGE.toStoreDetail('?id=' + id)
}
function reload(refresh = false) {
  if (!state.loaded) {
    lazyLoadBase
      .determineComponentInVisibleArea('.recommend-store-end', this)
      .then((res) => {
        if (res) {
          if (state.orderTimer) {
            clearTimeout(state.orderTimer)
          }
          state.loaded = true
          hadleStoreOrder(app.globalData.latitude, app.globalData.longitude)
          state.latitude = app.globalData.latitude
          state.longitude = app.globalData.longitude
        } else {
          if (state.orderTimer) {
            clearTimeout(state.orderTimer)
          }
          state.orderTimer = setTimeout(() => {
            console.log('查询是否进入显示区域')
            reload(refresh)
          }, 1000)
        }
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  } else if (refresh) {
    // 2.根据当前位置，获取最近的几个门店信息
    hadleStoreOrder(app.globalData.latitude, app.globalData.longitude)
    state.latitude = app.globalData.latitude
    state.longitude = app.globalData.longitude
  }
}
function productsSort(array) {
  const balanceArray = []
  const allArray = []
  array.forEach((ele) => {
    if (ele.balance <= 0) {
      balanceArray.push(ele)
    } else {
      allArray.push(ele)
    }
  })
  if (app.globalData.systemConfigure.storeProductBalanceIsZeroShow) {
    const tempArray = allArray.concat(balanceArray)
    return tempArray
  } else {
    return allArray
  }
}

// Watch listeners converted from observers
watch(
  () => props.show,
  (newVal, oldVal) => {
    reload(true)
  },
  { immediate: true },
)

watch(
  () => props.value,
  (newVal, oldVal) => {
    // 属性值变化时执行
    if (newVal && newVal != oldVal) {
      if (state.latitude && state.longitude) {
        getScorll(state.latitude, state.longitude)
      } else {
        getScorll(app.globalData.latitude, app.globalData.longitude, 1)
      }
    }
  },
  { immediate: true },
)

watch(
  () => props.latitudeAndLongitude,
  (newVal, oldVal) => {
    if (newVal && newVal != oldVal) {
      state.storeList = []
      state.loadingFlag = true
      hadleStoreOrder(app.globalData.latitude, app.globalData.longitude, 1)
    }
  },
  { immediate: true },
)

watch(
  () => props.refreshType,
  (newVal, oldVal) => {
    // 属性值变化时执行
    if (newVal !== '' && newVal !== 'USER') {
      reload(true)
    }
  },
)
</script>
<style scoped>
/* components/home-page/recommend-store/recommend-store.wxss */
/* loading */
.recommend-store-loading {
  padding: 50rpx 40rpx 0 40rpx;
}
.recommend-store-loading .item-box {
  display: flex;
}
.recommend-store-loading .item-box .img-box {
  width: 210rpx;
  height: 210rpx;
  border-radius: 6rpx;
  background: #efefef;
  margin-right: 27rpx;
  flex-shrink: 0;
}
.recommend-store-loading .item-box .info-box {
  width: calc(100% - 237rpx);
}
.recommend-store-loading .item-box .info-box .name {
  width: 365rpx;
  height: 39rpx;
  background: #efefef;
  border-radius: 2rpx;
  margin-bottom: 20rpx;
}
.recommend-store-loading .item-box .info-box .desc {
  width: 336rpx;
  height: 26rpx;
  background: #efefef;
  border-radius: 2rpx;
  margin-bottom: 20rpx;
}
.recommend-store-loading .item-box .info-box .price {
  width: 262rpx;
  height: 26rpx;
  background: #efefef;
  border-radius: 2rpx;
}
.store-title {
  text-align: center;
  width: 400rpx;
  padding: 0 18rpx;
  min-height: 50rpx;
  /* background: #e5fffa; */
  border-radius: 25px;
  font-size: 28rx;
  line-height: 50rpx;
  color: #454545;
  font-weight: bold;
  margin: 30rpx auto 40rpx auto;
}
.store-title image {
  width: 100%;
}
.store-title > text {
  display: inline-block;
  position: relative;
  padding: 0 13rpx;
}
.store-title > text::before,
.store-title > text::after {
  content: '';
  width: 103rpx;
  height: 2rpx;
  background: #8b8b8c;
  position: absolute;
  top: 25rpx;
  display: block;
}
.store-title > text::before {
  left: -103rpx;
}
.store-title > text::after {
  right: -103rpx;
}
.goods-box {
  padding: 0 20rpx;
  /* display: flex; */
  justify-content: space-between;
  flex-wrap: wrap;
  /* padding-bottom: 50rpx; */
}
.store-box {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
}
.recommend-store-msg {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}
.store-img {
  width: 108rpx;
  height: 108rpx;
  margin-right: 20rpx;
  flex: 0 0 auto;
}
.store-img image {
  width: 100%;
  max-height: 100%;
  max-width: 100%;
}
.store-msg {
  color: #000000;
  font-size: 32rpx;
}
.store-msg-name {
  margin-bottom: 20rpx;
  width: 520rpx;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
}
.store-detail-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #999999;
  font-size: 24rpx;
}
.store-detail {
  display: flex;
}
.detail-item {
  padding: 0 10rpx;
  height: 35rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  margin-right: 10rpx;
  box-sizing: border-box;
}
.product-img {
  width: 150rpx;
  height: 150rpx;
  margin-bottom: 10rpx;
}
.product-img image {
  width: 100%;
  max-height: 100%;
  border-radius: 20rpx;
}
.product-name {
  margin-bottom: 10rpx;
  width: 140rpx;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
  font-size: 24rpx;
}
.gm-goods-price {
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 28rpx;
  color: #f34c23;
}
.oldPrice {
  color: #999999;
  text-decoration-line: line-through;
  margin-left: 10rpx;
  font-size: 20rpx;
}
.recommend-store-end {
  width: 100%;
  height: 10rpx;
}
.scroll-view_H {
  display: flex;
  height: 270rpx;
}
.scroll-product {
  margin-right: 16rpx;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.mall-recommend-loading {
  padding: 50rpx 40rpx 0 40rpx;
}
.mall-recommend-loading .item-box {
  display: flex;
  margin-bottom: 20rpx;
}
.mall-recommend-loading .item-box .img-box {
  width: 210rpx;
  height: 210rpx;
  border-radius: 6rpx;
  background: #efefef;
  margin-right: 27rpx;
  flex-shrink: 0;
}
.mall-recommend-loading .item-box .info-box {
  width: calc(100% - 237rpx);
}
.mall-recommend-loading .item-box .info-box .name {
  width: 365rpx;
  height: 39rpx;
  background: #efefef;
  border-radius: 2rpx;
  margin-bottom: 20rpx;
}
.mall-recommend-loading .item-box .info-box .desc {
  width: 336rpx;
  height: 26rpx;
  background: #efefef;
  border-radius: 2rpx;
  margin-bottom: 20rpx;
}
.mall-recommend-loading .item-box .info-box .price {
  width: 262rpx;
  height: 26rpx;
  background: #efefef;
  border-radius: 2rpx;
}
</style>
