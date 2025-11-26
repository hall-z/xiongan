<template>
  <!-- pages/mallModule/goods/goodsList/goodsList.wxml -->

  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view
    class="search"
    :style="
      state.isSearchFixed
        ? 'position: fixed;z-index:2;top:' + navHeight + 'px;'
        : 'position: relative;'
    "
  >
    <!--<template is="searchTemplate2" :data="state.searchLabelShow, state.searchFocus, state.searchItem, state.searchText, state.placeholderText"></template>-->
    <view class="search-icon" @click="toSearch">
      <image
        lazy-load=""
        style="width: 40rpx; height: 40rpx"
        :src="state.imagesPath.iconSearch"
      ></image>
    </view>
    <!-- <button class="search-btn" style="background: {{themeColor}}" bindtap="toSearch">搜索</button> -->
  </view>
  <view class="top-search-block" :hidden="!state.isSearchFixed"></view>
  <view class="content">
    <view class="coupons-box">
      <view class="coupons-title">
        <view class="shop-content">
          <image
            class="shop-text-img"
            :src="state.imagesPath.iconCouponListShop"
            mode="widthFix"
          ></image>
          <view class="shop-name">{{ state.store }}</view>
        </view>
        <view class="coupons-center" @click="toMyCoupons">
          <view class="center-text">领券中心</view>
          <image
            class="toRight-img"
            :src="state.imagesPath.iconCouponListRight"
            mode="widthFix"
          ></image>
        </view>
      </view>
      <view class="coupons-content">
        <view class="coupons-text">以下商品可使用如下优惠</view>
        <view class="real-coupons">
          <image
            class="coupons-img"
            :src="state.imagesPath.iconCouponListCoupon"
            mode="widthFix"
          ></image>
          <view class="real-coupons-text">{{ state.couponName }}</view>
        </view>
        <!-- <view class="lines"></view>
      <view class="coupons-date">有效期：{{state.couponDetail.startDate}} - {{state.couponDetail.endDate}}</view> -->
      </view>
    </view>
    <view class="goods-box">
      <view v-for="(item, index) in state.goodsList" :key="index">
        <!-- <coupon-good goods="{{item}}" bind:click="clickDiscountGoods" bind:addShopCart="addShopCart"></coupon-good> -->
        <product-item-card
          :goods="item"
          :showSpecParent="showSpecParent"
          :shopCart="shopCart"
          :hasUserInfo="state.hasUserInfo"
          @onClickGoods="clickDiscountGoods"
          @addToCart="addShopCart"
          @noop="noop"
          @getUserInfo="onGetUserInfo"
          :isCoupon="true"
        ></product-item-card>
      </view>
    </view>
  </view>
  <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
  <view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view>
  <view
    class="no-data"
    :style="'color: ' + state.themeColor + ';'"
    :hidden="state.goodsList.length > 0"
  >
    <image :src="state.imagesPath.imgNoData"></image>
    <button
      @click="toIndex"
      :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
    >
      随便逛逛
    </button>
  </view>
  <!-- 选择餐饮套餐弹窗 -->
  <setMeal
    :show="state.meals.show"
    :productId="state.meals.productId"
    :storeId="state.meals.storeId"
    @outcome="chooseOutcome"
  ></setMeal>
  <!-- 加入购物车图片 -->
  <view
    class="good_box"
    :hidden="hide_good_box"
    :animation="animation"
    :style="'left:' + bus_x + 'px;top:' + bus_y + 'px;'"
  >
    <image :src="goodsBoxImage" mode="aspectFit"></image>
  </view>
  <view class="flow-car" @click="toShopCar">
    <image :src="state.imagesPath.flowCart"></image>
    <view class="red-hint" :hidden="!(state.cartCount > 0)">{{ state.cartCount }}</view>
  </view>
  <image
    class="scroll-top"
    v-if="state.showScrollTop"
    :src="state.imagesPath.scrollTop"
    @click="handleScrollTop"
  ></image>
  <authorize @login="handleUserLogin"></authorize>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import NavigationBar from '@/pages-sub/newretail/components/navigation-bar/navigation-bar.vue'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bus from 'iny-bus'
const app = getApp()

// pages/mallModule/goods/goodsList/goodsList.js
const storeService = _apiStoreServiceJs
const productService = _apiProductServiceJs
const shopcartService = _apiShopcartServiceJs
const couponService = _apiCouponServiceJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs

// 获取应用实例
let canAddToCart = true
const state = reactive({
  navigationBarTitle: '可用券商品',
  imagesPath: IMGAGESPATH,
  userInfo: {},
  storeId: '',
  store: '',
  page: 1,
  pageSize: 0,
  searchCount: true,
  searchLabelShow: false,
  searchFocus: false,
  searchText: '请输入搜索内容',
  searchItem: '',
  goodsList: [],
  searchHistory: [],
  nameLikes: '',
  placeholderText: '',
  keyboardHeight: 0,
  phone: false,
  meals: {
    show: false,
    productId: '',
    storeId: '',
  },
  hasUserInfo: false,
  page: 1,
  pageSize: 10,
  pageCount: 1,
  noMore: false,
  loading: false,
  cartCount: 0,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  vipGradeConfig: null,
  searchHeight: 44,
  isSearchFixed: false,
  showScrollTop: false,
  couponDetail: {},
  // 券活动详情
  couponName: '',
  templateNumber: null, // HDCRM券id
})
function handleFocus(e) {
  state.searchLabelShow = true
  state.searchItem = state.nameLikes
  keywordLikes = state.nameLikes
}
function handleInputFocus(e) {
  console.log(e.detail)
  state.keyboardHeight = e.detail.height
}
function handleBlur(e) {
  if (!e.detail.value) {
    state.searchLabelShow = false
    state.keyboardHeight = 0
    state.placeholderText = ''
    keywordLikes = ''
  } else {
    state.keyboardHeight = 0
  }
}
function handleInput(e) {
  state.nameLikes = e.detail.value
  state.placeholderText = ''
}
function toSearch() {
  const that = this
  let nameLikes = state.nameLikes
  if (!nameLikes) {
    uni.showToast({
      title: '请输入您想搜索的商品名称！',
      icon: 'none',
      duration: 2000,
    })
  } else {
    nameLikes = nameLikes.replace(/(^\s*)|(\s*$)/g, '')
    state.searchItem = nameLikes
    state.searchLabelShow = true
  }
  getSearchProduct(nameLikes)
}
function handleConfirm(e) {
  console.log(e)
  if (!e.detail.value) {
    state.searchLabelShow = false
    state.keyboardHeight = 0
    uni.showToast({
      title: '请输入您想搜索的商品名称！',
      icon: 'none',
      duration: 2000,
    })
    getSearchProduct('')
  } else {
    const nameLikes = e.detail.value.replace(/(^\s*)|(\s*$)/g, '')
    getSearchProduct(nameLikes)
  }
}
function getSearchProduct(_keywordLikes) {
  const that = this
  if (_keywordLikes.indexOf('，')) {
    const keywords = _keywordLikes.split('，')
    _keywordLikes = ''
    keywords.forEach((item) => {
      _keywordLikes = _keywordLikes + item + ','
    })
    _keywordLikes = _keywordLikes.substring(0, _keywordLikes.length - 1)
  }
  keywordLikes = _keywordLikes
  state.page = 1
  state.pageCount = 1
  state.noMore = false
  state.goodsList = []
  handleQuery(state.page)
}
function toGoodsDetail(val) {
  const opts =
    '?productId=' +
    val.currentTarget.dataset.productid +
    '&storeId=' +
    state.storeId +
    '&type=normal'
  NAVPAGE.toGoodsDetails(opts)
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
function toMyCoupons() {
  return NAVPAGE.toMyCoupon()
}
function clickDiscountGoods(e) {
  console.log(e, '11111111')
  const res = e.detail
  const opts = '?productId=' + res.productid + '&storeId=' + state.storeId + '&type=normal'
  NAVPAGE.toGoodsDetails(opts)
}
onLoad(function (_options) {
  const self = this
  eventId = bus.on('userShopCartChange', () => {
    if (app.globalData.storeInfo) {
      getShopCart(app.globalData.storeInfo.id)
    }
  })
  if (_options.couponActivityId) {
    state.couponActivityId = _options.couponActivityId
  }
  if (_options.templateNumber) {
    state.templateNumber = _options.templateNumber
  }
  if (_options.couponName != null) {
    state.couponName = _options.couponName
  }
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  state.navHeight = app.globalData.navHeight
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    initPage()
    getShopCart(state.storeId)
    // 统计PV
    ANALYSIS.PVStatistics(state.storeId)
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation()
      .then((res) => {
        app.globalData.storeInfo = res
        initPage()
        getShopCart(res.id)
        // 统计PV
        ANALYSIS.PVStatistics(res.id)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures()

  // 获取用户信息
  checkUserInfo()
})
onReady(function () {})
onShow(function () {})
onHide(function () {})
onUnload(function () {
  bus.remove('userShopCartChange', eventId)
})
onPullDownRefresh(function () {
  state.goodsList = []
  state.page = 1
  state.pageCount = 1
  state.noMore = false
  onLoad(options)
  uni.stopPullDownRefresh()
})
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true
    let page = state.page
    ++page
    handleQuery(page)
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.goodsList.length > 0) {
      state.noMore = true
    } else {
      uni.showToast({
        title: '没有更多数据~',
        icon: 'none',
        duration: 2000,
      })
    }
  }
})
onShareAppMessage(function () {
  const self = this
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  const sharePictures = state.sharePictures
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id
    return {
      title: '',
      path:
        '/pages-sub/newretail/pages/mallModule/goods/search/search?shareId=' + memberId + '&storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {},
    }
  } else {
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/goods/search/search?storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {},
    }
  }
})
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures
  }
}
function initPage() {
  // 更新页面门店相关数据，显示当前门店
  state.store = app.globalData.storeInfo.name
  state.storeId = app.globalData.storeInfo.id
  handleQuery(state.page)
}
function checkAuth() {
  try {
    if (!app.globalData.userInfo) {
      return false
    } else {
      return true
    }
  } catch (e) {
    // Do something when catch error
  }
}
function addShopCart(e) {
  if (!canAddToCart) {
    console.log('==============================正在加入购物车')
    return
  }
  canAddToCart = false
  const that = this
  const val = {
    detail: e.detail.detail.target.dataset,
  }
  if (canAddToCart === false) {
    const productId = val.detail.id
    const business = val.detail.business
    let balance = val.detail.balance
    const style = val.detail.style
    let hasSharingPersonId = false
    const mode = val.detail.type
    let storeId = ''
    const loginStatus = checkAuth()
    if (style !== 'SPEC_PARENT' && style !== 'MEALS2') {
      if (loginStatus) {
        if (business === 'DISTRIBUTION') {
          try {
            const data = uni.getStorageSync('wj_distributionStore')
            if (data) {
              storeId = data.id
            }
          } catch (e) {}
        } else if (business === 'NEXT_DAY') {
          try {
            const data = uni.getStorageSync('wj_nextDayStore')
            if (data) {
              storeId = data.id
            }
          } catch (e) {}
        } else {
          storeId = app.globalData.storeInfo.id
        }
        const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
        const tempShopCart = localShopingCart.items
        const initialPurchaseNumber = val.detail.initialPurchaseNumber
        //   console.log(tempShopCart[productId], initialPurchaseNumber)
        //   console.log((!tempShopCart[productId] || tempShopCart[productId] < initialPurchaseNumber) && initialPurchaseNumber ? initialPurchaseNumber : 1)
        let postData = {
          storeId,
          lists: [
            {
              count:
                (!tempShopCart[productId] || tempShopCart[productId] < initialPurchaseNumber) &&
                initialPurchaseNumber
                  ? initialPurchaseNumber
                  : 1,
              productId,
            },
          ],
        }
        if (app.globalData.isShoppingGuidanceRecordGoods) {
          // 获取分享人id
          const shareData = util.getSharingPersonInfo()
          if (shareData && shareData != null && shareData.productId === productId) {
            postData.lists[0].sharingPersonId = shareData.shareId
            hasSharingPersonId = true
          }
        }
        if (mode === 'reduce') {
          postData = {
            storeId,
            lists: [
              {
                count: -1,
                productId,
              },
            ],
          }
        }
        if (business === 'DISTRIBUTION' || business === 'NEXT_DAY') {
          //   console.log('是不是进入到这里了？')
          balance = 0
          productService
            .getDetails(storeId, productId)
            .then((res) => {
              if (res) {
                balance = res.balance
              }
              if (style === 'MEALS') {
                getCateringDetailsById(productId, storeId)
              } else {
                addShopcart(balance)
              }
            })
            .catch((err) => {
              canAddToCart = true
            })
        } else if (
          (business === 'CATERING' || business === 'DISTRIBUTION' || business === 'NEXT_DAY') &&
          style === 'MEALS'
        ) {
          getCateringDetailsById(productId, storeId)
        } else {
          addShopcart(balance)
        }
        function getCateringDetailsById(productId, storeId) {
          productService
            .getCateringDetailsById(productId, storeId)
            .then((res) => {
              const self = this
              const cateringGroupProducts = res.cateringGroupProducts
              const productId = res.id
              const goodsList = []
              const mealCanBuy = true
              const unBuyGoods = null
              const unChoiceGroup = null
              const mealDetails = []
              if (cateringGroupProducts && cateringGroupProducts.length > 0) {
                const groupProductList = []
                for (let i = 0; i < cateringGroupProducts.length; i++) {
                  const item = cateringGroupProducts[i]
                  if (item.mealDetails && item.mealDetails.length > 0) {
                    for (let j = 0; j < item.mealDetails.length; j++) {
                      const ele = item.mealDetails[j]
                      const tempData = {
                        groupId: item.groupId,
                        groupProductId: ele.productId,
                        groupProductCount: ele.productCount,
                      }
                      mealDetails.push(ele.productName)
                      groupProductList.push(tempData)
                    }
                  }
                }
                const tempData = {
                  count: 1,
                  lists: groupProductList,
                  productId,
                }
                goodsList.push(tempData)
              }
              if (mealCanBuy) {
                postData = {
                  lists: goodsList,
                  storeId,
                }
                addShopcart(balance)
              } else {
                canAddToCart = true
              }
            })
            .catch((err) => {
              canAddToCart = true
              uni.showToast({
                title: err.message,
                icon: 'none',
              })
            })
        }
        function addShopcart(balance) {
          if (app.globalData.userInfo.member) {
            if (balance === 0 || balance === null || balance === '') {
              uni.showToast({
                title: '门店中该商品库存不足，请选购其他商品~',
                icon: 'none',
                duration: 2000,
              })
              canAddToCart = true
            } else {
              shopcartService
                .cateringAdd(postData)
                .then((res) => {
                  const opts = {
                    products: [
                      {
                        productId,
                      },
                    ],
                  }
                  canAddToCart = true
                  console.log(res)
                  app.globalData.storeIdentification =
                    business === 'DISTRIBUTION'
                      ? 'distribution'
                      : business === 'NEXT_DAY'
                        ? 'nextDay'
                        : 'normal'
                  app.globalData.isShopCartChange = true
                  uni.showToast({
                    title: '添加购物车成功~',
                    icon: 'none',
                    duration: 2000,
                  })
                  if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
                    util.removeSharingPersonInfo()
                  }
                  // if (mode === 'reduce') {
                  //   that.reduceLocalGoods(productId)
                  // } else {
                  //   that.handleTouchOnGoods(that.addShopCartData)
                  // }
                  getProductsCount()
                })
                .catch((err) => {
                  canAddToCart = true
                  uni.showToast({
                    title: err.message,
                    icon: 'none',
                    duration: 2000,
                  })
                })
            }
          } else {
            canAddToCart = true
            NAVPAGE.toAuthorize()
          }
        }
      } else {
        canAddToCart = true
        uni.showToast({
          title: '请先点击头像授权登录后添加哦~',
          icon: 'none',
          duration: 2000,
        })
      }
    } else {
      canAddToCart = true
      // 多规格商品跳转商品详情
      const opts =
        '?productId=' + productId + '&storeId=' + state.storeId + '&type=normal&source=addshopcart'
      console.log(opts)
      NAVPAGE.toGoodsDetails(opts)
    }
  }
}
function handleUserLogin() {
  console.log(app.globalData.userInfo)
  const that = this
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo
    state.userInfo = {
      ...user.wxaUser,
    }
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
      state.isMember = true
    } else {
      // 不是会员跳转授权页
      state.userInfo = user.wxaUser
      state.hasUserInfo = true
      state.isMember = false
      NAVPAGE.toAuthorize()
    }
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.phone = true
  } else {
    state.phone = false
  }
}
function handleBindPhone(e) {
  console.log(e.detail)
  if (e.detail.bindMobile === true) {
    handlePopupPhone()
  }
}
function chooseOutcome(e) {
  if (e.detail.outcome === true) {
    state.meals = {
      show: false,
      productId: '',
      storeId: '',
    }
    handleTouchOnGoods(addShopCartData)
  }
}
function getShopCart(storeId) {
  const self = this
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    // shopcartService.getCatering(storeId).then(res => {
    //   let tempShopCart = {}
    //   let tempShopCartGoodsId = []
    //   if (res.items && res.items.length > 0) {
    //     // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
    //     res.items.forEach(item => {
    //       if (!item.grabActivityId && !item.newmbrActivityId) {
    //         let index = -1
    //         for (let i = 0; i < tempShopCartGoodsId.length; i++) {
    //           if (item.productId == tempShopCartGoodsId[i]) {
    //             index = i;
    //           }
    //         }
    //         if (index > -1) {
    //           tempShopCart[item.productId] = tempShopCart[item.productId] + item.productNum
    //         } else {
    //           tempShopCart[item.productId] = item.productNum
    //           tempShopCartGoodsId.push(item.productId)
    //         }
    //       }
    //     })
    //   }
    //   self.setData({
    //     shopCart: tempShopCart,
    //     shopCartGoodsId: tempShopCartGoodsId
    //   })
    //   let localData = {
    //     goodsId: tempShopCartGoodsId,
    //     items: tempShopCart
    //   }
    //   try {
    //     wx.setStorageSync('wj_shopCartStorage', localData)
    //   } catch (e) { }
    // }).catch(err => {
    //   wx.showToast({
    //     title: err.message,
    //     icon: 'none',
    //     duration: 2000
    //   })
    // })
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
    state.shopCart = localShopingCart.items
    state.shopCartGoodsId = localShopingCart.goodsId
    const localProductCount = uni.getStorageSync('wj_userProductsCount')
    const counts = String(localProductCount)
    if (counts) {
      app.setTabBarBadge('shopping_cart', counts)
    }
    shopcartService
      .getProductsCount()
      .then((res) => {
        const count = String(res)
        app.setTabBarBadge('shopping_cart', String(res))
        state.cartCount = count
        try {
          uni.setStorageSync('wj_userProductsCount', res)
        } catch (e) {}
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  }
}
function addLocalGoods(id) {
  try {
    // 读取缓存的商品总量和购物车数据
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
    let localProductCount = uni.getStorageSync('wj_userProductsCount')
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount)
    localProductCount++
    localProductCount = String(localProductCount)
    app.setTabBarBadge('shopping_cart', localProductCount)
    if (localShopingCart) {
      // 如果存在本地购物车数据
      const shopCartGoodsId = localShopingCart.goodsId
      const tempShopCart = localShopingCart.items
      const tempShopCartGoodsId = []
      const _id = id
      let index = -1
      if (shopCartGoodsId.length > 0) {
        for (let i = 0; i < shopCartGoodsId.length; i++) {
          tempShopCartGoodsId.push(shopCartGoodsId[i])
          if (_id == shopCartGoodsId[i]) {
            index = i
          }
        }
      }
      if (index > -1) {
        // 已经存在购物车，只是数量变化
        tempShopCart[_id] = Number(tempShopCart[_id]) + 1
      } else {
        // 新增
        tempShopCartGoodsId.push(_id)
        tempShopCart[_id] = 1
      }
      state.shopCart = tempShopCart
      state.shopCartGoodsId = tempShopCartGoodsId
      const localData = {
        goodsId: tempShopCartGoodsId,
        items: tempShopCart,
      }
      uni.setStorageSync('wj_shopCartStorage', localData)
    }
    uni.setStorageSync('wj_userProductsCount', localProductCount)
    // wx.setStorageSync('wj_shopCartStorage', tempShopCart)
  } catch (e) {
    // Do something when catch error
  }
  bus.emit('userShopCartChange', 'update')
}
function reduceLocalGoods(id) {
  try {
    // 读取缓存的商品总量和购物车数据
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
    let localProductCount = uni.getStorageSync('wj_userProductsCount')
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount)
    localProductCount--
    localProductCount = String(localProductCount)
    app.setTabBarBadge('shopping_cart', localProductCount)
    if (localShopingCart) {
      // 如果存在本地购物车数据
      const shopCartGoodsId = localShopingCart.goodsId
      const tempShopCart = localShopingCart.items
      const tempShopCartGoodsId = []
      const _id = id
      let index = -1
      if (shopCartGoodsId.length > 0) {
        for (let i = 0; i < shopCartGoodsId.length; i++) {
          tempShopCartGoodsId.push(shopCartGoodsId[i])
          if (_id == shopCartGoodsId[i]) {
            index = i
          }
        }
      }
      if (index > -1) {
        // 已经存在购物车，只是数量变化
        tempShopCart[_id] = Number(tempShopCart[_id]) - 1
        if (tempShopCart[_id] <= 0) {
          tempShopCartGoodsId.splice(index, 1)
        }
      }
      state.shopCart = tempShopCart
      state.shopCartGoodsId = tempShopCartGoodsId
      const localData = {
        goodsId: tempShopCartGoodsId,
        items: tempShopCart,
      }
      uni.setStorageSync('wj_shopCartStorage', localData)
    }
    uni.setStorageSync('wj_userProductsCount', localProductCount)
    // wx.setStorageSync('wj_shopCartStorage', tempShopCart)
  } catch (e) {
    // Do something when catch error
  }
  bus.emit('userShopCartChange', 'update')
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true
    if (app.globalData.userInfo.member) {
      state.isMember = true
    }
  } else {
    state.hasUserInfo = false
    state.isMember = false
    state.member = null
    state.userInfo = null
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e)
    .then((res) => {
      state.hasUserInfo = true
      if (res.member) {
        state.isMember = true
      } else {
        NAVPAGE.toAuthorize()
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function handleQuery(page) {
  const self = this
  const opts = {
    keywordsLikes: keywordLikes != null ? keywordLikes : '',
  }
  let postFunc = couponService.queryByCouponActivityId
  if (state.templateNumber) {
    postFunc = couponService.queryByHdCrmCode
  }
  postFunc(
    page,
    10,
    state.templateNumber ? state.templateNumber : state.couponActivityId,
    state.storeId,
    opts,
  )
    .then((res) => {
      const tempList = state.goodsList
      if (res.records && res.records.length > 0) {
        res.records.forEach((item) => {
          const produtlabel = []
          const promotions = []
          let specifications = ''
          if (item.labels && item.labels.length > 0) {
            item.labels.forEach((ele) => {
              if (ele.type === 'GOODSLABEL' && ele.color != null) {
                produtlabel.push(ele)
              } else if (ele.type === 'PROMOTIONLABEL') {
                promotions.push(ele)
              }
            })
          }
          if (item.productProperties && item.productProperties.length > 0) {
            for (let i = 0; i < item.productProperties.length; i++) {
              const ele = item.productProperties[i]
              if (ele.propertyName === '规格') {
                specifications = ele.propertyValue
                break
              }
            }
          }
          const tempItem = {
            ...item,
            produtlabel,
            promotions,
            specifications,
          }
          tempList.push(tempItem)
        })
        const pageCount = parseInt(res.recordCount / res.pageSize) + 1
        state.page = res.page
        state.pageCount = pageCount
        state.goodsList = tempList
      }
      if (state.loading) {
        state.loading = false
      }
    })
    .catch((err) => {
      util.showToast(err.message)
      if (state.loading) {
        state.loading = false
      }
    })
}
function toShopCar() {
  NAVPAGE.toShopcart()
}
function getProductsCount() {
  const that = this
  shopcartService
    .getProductsCount()
    .then((res) => {
      const count = String(res)
      state.cartCount = count
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
onPageScroll(function (e) {
  const searchHeight = (88 * app.globalData.systemInfo.windowWidth) / 750
  if (e.scrollTop > 0 && !state.isSearchFixed) {
    state.isSearchFixed = true
  } else if (e.scrollTop === 0 && state.isSearchFixed) {
    state.isSearchFixed = false
  }
  if (e.scrollTop >= app.globalData.systemInfo.screenHeight / 2 && !state.showScrollTop) {
    state.showScrollTop = true
  } else if (e.scrollTop < app.globalData.systemInfo.screenHeight / 2 && state.showScrollTop) {
    state.showScrollTop = false
  }
})
function handleScrollTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  })
}
</script>
<style scoped>
/* pages/mallModule/goods/goodsList/goodsList.wxss */

.search {
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  position: relative;
  background: rgba(248, 248, 248, 1);
  width: 750rpx;
  box-sizing: border-box;
  z-index: 99;
  /* margin-bottom: 10rpx; */
}

.search-icon {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
  padding-right: 26rpx;
  border-radius: 0 30rpx 30rpx 0;
}

.top-search-block {
  width: 100%;
  height: 82rpx;
}

.search-main {
  background-color: #fff;
  border-radius: 30rpx 0 0 30rpx;
  overflow: hidden;
}
.search .search-box {
  /* width: 560rpx; */
  /* padding-right: 20rpx; */
  background: rgba(248, 248, 248, 1);
  width: 100%;
  padding: 10rpx 0;
}

.search .search-box input {
  background-color: #fff;
}

.search .search-btn {
  width: 110rpx;
  height: 60rpx;
  padding: 0;
  font-size: 28rpx;
  line-height: 60rpx;
  background: #009f55;
  color: #fff;
  border-radius: 10rpx;
}

.search .search-btn::after {
  border: 0;
  border-radius: 0;
}

.history {
  padding: 0rpx 30rpx;
  font-size: 28rpx;
}

.history .title {
  height: 90rpx;
  line-height: 90rpx;
}

.history .title text {
  text-align: right;
  display: inline-block;
  float: right;
}

.history .history-item {
  display: inline-block;
  height: 60rpx;
  padding: 0rpx 40rpx;
  line-height: 60rpx;
  max-width: 100%;
  box-sizing: border-box;
  background: #e7e7e7;
  border-radius: 10rpx;
  margin-right: 40rpx;
  margin-bottom: 20rpx;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content {
  background-color: #f8f6f9;
}

.coupons-box {
  height: 240rpx;
  padding: 18rpx 24rpx 26rpx 24rpx;
  box-sizing: border-box;
}

.coupons-title {
  height: 66rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 21rpx;
  background: rgba(248, 248, 248, 1);
}

.shop-content,
.coupons-center {
  display: flex;
  align-items: center;
  /* justify-content: center; */
}

.shop-text-img {
  width: 26rpx;
  height: 25rpx;
}

.shop-name {
  font-size: 24rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 8rpx;
}

.center-text {
  font-size: 24rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(154, 154, 154, 1);
  margin-right: 9rpx;
}

.toRight-img {
  width: 11rpx;
  height: 19rpx;
  border-radius: 1rpx;
}

.coupons-content {
  height: 130rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  border-radius: 0 0 20rpx 20rpx;
}

.coupons-text {
  padding: 15rpx 0 0 24rpx;
  font-size: 24rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}

.real-coupons {
  margin: 15rpx 0 0 24rpx;
  display: flex;
  align-items: center;
}

.coupons-img {
  width: 28rpx;
  height: 28rpx;
}

.real-coupons-text {
  font-size: 26rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  margin-left: 6rpx;
}

.lines {
  width: 100%;
  height: 1rpx;
  background: rgba(248, 246, 249, 1);
  border-radius: 1px;
  margin-top: 22rpx;
  margin-bottom: 12rpx;
}

.coupons-date {
  margin: 0 0 0 22rpx;
  background: rgba(255, 255, 255, 1);
  font-size: 24rpx;
  color: #999999;
}

.goods-box {
  width: 100%;
  display: flex;
  padding: 0 19rpx 0 19rpx;
  box-sizing: border-box;
  justify-content: space-between;
  flex-wrap: wrap;
}

/* .goods-item {
  min-height: 180rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 27rpx 0 28rpx 0;
  overflow: hidden;
}

.goods-img-box {
  width: 210rpx;
  height: 210rpx;
  overflow: hidden;
  float: left;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.goods-img-box image {
  width: 100%;
  height: 100%;
}

.goods-img-box .no-balance {
  position: absolute;
  top: 0;
  left: 0;
}

.goods-info {
  width: calc(100% - 249rpx);
  min-height: 210rpx;
  position: relative;
  float: right;
}

.goods-info .goods-introduce {
  font-size: 22rpx;
  color: #009136;
  height: 30rpx;
  line-height: 30rpx;
  font-weight: bold;
}

.goods-info .goods-introduce>text {
  padding: 0 10rpx;
  height: 30rpx;
  border-radius: 6rpx;
  background: #009136;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
}

.goods-info .goods-name text {
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 6rpx;
  background: #009136;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.goods-info .goods-name,
.goods-info .goods-desc,
.goods-info .goods-sold {
  display: block;
  width: 100%;
  overflow: hidden;
  word-break: keep-all;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-info .goods-name {
  color: #333;
  font-size: 32rpx;
  line-height: 42rpx;
  height: 42rpx;
  font-weight: bold;
  margin: 10rpx 0 5rpx 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.goods-info .goods-name view {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: Medium;
}

.goods-info .goods-labels {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30rpx;
  margin: 10rpx 0 5rpx 0;
}

.goods-info .goods-labels view {
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 5rpx;
  border: 1rpx solid #ff8561;
  font-size: 18rpx;
  line-height: 42rpx;
  color: #ff8561;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 8rpx;
  font-weight: normal;
  box-sizing: border-box;
  flex-shrink: 0;
}

.goods-info .goods-desc,
.goods-info .goods-sold {
  color: #454545;
  height: 36rpx;
  font-size: 26rpx;
}

.goods-info .goods-sold {
  margin-top: 5rpx;
}

.goods-price {
  color: #ff8561;
  font-size: 30rpx;
  margin-top: 22rpx;
  line-height: 40rpx;
}

.goods-price .nowPrice {
  font-size: 36rpx;
  font-weight: 800;
  margin-right: 16rpx;
}

.goods-price .oldPrice {
  color: #999;
  text-decoration: line-through;
} */

.cart-control {
  position: absolute;
  right: -20rpx;
  bottom: -2rpx;
  width: 164rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 80rpx;
  text-align: center;
}

.add-box,
.reduce-box {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  padding: 0;
}

.add-box {
  position: absolute;
  right: 0;
}

.reduce-box {
  position: absolute;
  left: 0;
}

.add-box button,
.reduce-box button {
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
}

.add-box button::after,
.reduce-box button::after {
  border: 0;
}

.cart-control .cart-count {
  font-size: 28rpx;
  color: #454545;
  height: 100%;
}

button.button-hover {
  color: transparent;
  background-color: transparent;
  border: none;
}

.add-img,
.reduce-img {
  width: 40rpx;
  height: 40rpx;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -20rpx;
  margin-left: -20rpx;
}

/* 语音 */

.microphone-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  position: fixed;
  padding-bottom: 24rpx;
}

.microphone-tips {
  width: 100%;
  font-size: 34rpx;
  line-height: 50rpx;
  color: #444;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 102rpx;
}

.microphone-tips text {
  display: block;
  width: 100%;
}

.microphone-btn {
  height: 90rpx;
  width: 618rpx;
  border-radius: 40rpx;
  background: #e5e5e5;
  color: #444;
  font-size: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.microphone-btn image {
  width: 56rpx;
  height: 56rpx;
  margin-right: 30rpx;
}

.hud-container {
  position: fixed;
  width: 248rpx;
  height: 248rpx;
  left: 50%;
  top: 50%;
  margin-left: -124rpx;
  margin-top: -124rpx;
  z-index: 999;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hud-container image {
  width: 70rpx;
  margin-bottom: 16px;
}

.hud-container text {
  font-size: 28rpx;
  color: #fff;
}

/*抛物线动画*/

.good_box {
  width: 210rpx;
  height: 210rpx;
  position: fixed;
  overflow: hidden;
  left: 50%;
  top: 50%;
  z-index: +99;
  display: flex;
  justify-content: center;
  align-items: center;
}

.good_box image {
  width: 210rpx;
  height: 210rpx;
}

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
}

.no-data image {
  margin-top: 30%;
  width: 242rpx;
  height: 261rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: transparent;
  font-size: 24rpx;
  line-height: 60rpx;
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #fff;
  border-radius: 0;
}

.loading-btn::after {
  border: 0;
}

.order-end {
  color: #009136;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
}

.flow-car {
  position: fixed;
  left: 40rpx;
  bottom: 200rpx;
  width: 120rpx;
  height: 120rpx;
  z-index: 7;
}

.red-hint {
  position: absolute;
  top: 25rpx;
  right: 25rpx;
  background-color: red;
  color: white;
  font-size: 30rpx;
  height: 40rpx;
  width: 40rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-car image {
  width: 120rpx;
  height: 120rpx;
}

.scroll-top {
  width: 92rpx;
  height: 92rpx;
  position: fixed;
  right: 20rpx;
  bottom: 20%;
  z-index: 6;
}
</style>
