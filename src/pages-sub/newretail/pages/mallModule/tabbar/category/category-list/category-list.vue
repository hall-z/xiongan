<template>
  <!-- pages/mallModule/tabbar/category/category-list/category-list.wxml -->
  <view>
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <!--<template is="add-cart-animation" :data=""></template>-->
    <view
      class="top-info"
      v-if="
        !state.systemConfigure.hasShowProductsCategoryPage ||
        (state.systemConfigure.hasShowProductsCategoryPage &&
          state.systemConfigure.productsListShowClass === 'VERTICAL')
      "
    >
      <view class="logo">
        <!-- <image src="{{imagesPath.iconLogo}}" mode="aspectFit"></image> -->
        <view class="address" @click="changeStore">
          <image
            style="width: 20rpx"
            :src="state.imagesPath.iconNearStoreAddress"
            mode="widthFix"
          ></image>
          <text>{{ state.store || '暂无门店信息' }}</text>
        </view>
      </view>
      <view class="search-switch">
        <view class="search-btn" @click="handleConfirm">
          <image :src="state.imagesPath.iconiconCategorySearch"></image>
          <text>请输入商品名称、关键字进行搜索</text>
        </view>
        <view class="toggle-btn">
          <image
            v-if="state.proShowType === 'list'"
            :src="state.imagesPath.iconCategoryShowCard"
            data-showtype="card"
            @click="handleshowType"
          ></image>
          <image
            v-if="state.proShowType === 'card'"
            :src="state.imagesPath.iconCategoryShowList"
            data-showtype="list"
            @click="handleshowType"
          ></image>
        </view>
      </view>
    </view>
    <view
      class="category-box"
      v-if="state.productCategoryStyle === '风格2' || state.productCategoryStyle === '风格3'"
      :style="state.showCategoryName ? 'height: 174rpx;' : ''"
    >
      <scroll-view
        :class="
          'category-box-list ' + (!state.showCategoryName ? 'category-box-list-showname' : '')
        "
        scroll-top="10"
        scroll-x=""
        :style="
          'display: flex;white-space: nowrap;width: 690rpx;' +
          (!state.showCategoryName ? 'height:100%;' : '')
        "
      >
        <view v-for="(item, index) in state.tempCategorys" :key="index">
          <view
            @click="clickCategoryVerticalTop"
            :data-id="item.categoryId"
            :data-business="item.business"
            class="category-box-item"
            :style="state.productCategoryStyle === '风格3' ? 'border-radius: 25rpx;' : ''"
          >
            <view
              :style="
                'display: flex;flex-direction: column;align-items: center;justify-content: center;' +
                (!state.showCategoryName ? 'height:100%;' : '')
              "
            >
              <view
                v-if="item.pictureUrl"
                class="category-box-item-from"
                :style="
                  (state.productCategoryStyle === '风格3' ? 'border-radius: 25rpx;' : '') +
                  'border:5rpx solid ' +
                  (item.categoryId === state.parentId ? state.themeColor : 'transparent')
                "
              >
                <image :src="item.pictureUrl" mode="heightFix"></image>
              </view>
              <view
                class="not-image"
                v-else
                :style="
                  'border:1px solid ' +
                  (item.categoryId === state.parentId ? state.themeColor : 'transparent')
                "
              >
                <image :src="state.imagesPath.occupy_image"></image>
              </view>
              <view
                v-if="state.showCategoryName"
                class="category-item-name"
                :style="
                  'background-color: ' +
                  (item.categoryId === state.parentId ? state.themeColor : 'transparent') +
                  '; color:' +
                  (item.categoryId === state.parentId ? '#fff' : '#333333') +
                  ';'
                "
              >
                {{ filters.filterCategoryName(item.menuName) }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="category-all-box" @click="doOpenAllCategory">
        <view>全</view>
        <view>部</view>
        <image :src="state.imagesPath.category_all" mode="widthFix"></image>
      </view>
      <view class="all-category" v-if="state.showAllCategory">
        <view class="all-title">
          <view>全部分类</view>
          <view class="all-title-close">
            <image
              @click="doOpenAllCategory"
              :src="state.imagesPath.category_close"
              mode="widthFix"
            ></image>
          </view>
        </view>
        <view class="category-box-list-all">
          <view v-for="(item, index) in state.tempCategorys" :key="index">
            <view
              class="category-item"
              :style="!state.showCategoryName ? 'margin-right:43rpx' : ''"
            >
              <view
                @click="clickCategoryVerticalTop"
                data-from="all"
                :data-id="item.categoryId"
                :data-business="item.business"
                class="category-box-item category-box-item2"
                :style="
                  'border:1px solid ' +
                  (item.categoryId === state.parentId ? state.themeColor : 'transparent')
                "
              >
                <image
                  class="custom-image"
                  v-if="item.pictureUrl"
                  :src="item.pictureUrl"
                  mode="heightFix"
                ></image>
                <view class="not-image not-image2" v-else>
                  <image :src="state.imagesPath.occupy_image"></image>
                </view>
              </view>
              <view
                v-if="state.showCategoryName"
                class="category-item-name"
                :style="
                  'background-color: ' +
                  (item.categoryId === state.parentId ? state.themeColor : 'transparent') +
                  '; color:' +
                  (item.categoryId === state.parentId ? '#fff' : '#333333') +
                  ';'
                "
              >
                {{ filters.filterCategoryName(item.menuName) }}
              </view>
            </view>
          </view>
        </view>
        <view class="category-box-bg" @click="doOpenAllCategory"></view>
      </view>
    </view>
    <!-- 竖版 -->
    <view
      v-if="
        state.category.length > 0 ||
        state.productCategoryStyle === '风格2' ||
        state.productCategoryStyle === '风格3'
      "
    >
      <view>
        <!-- isNew 1为都市花乡版本 否则为高速版本 -->
        <category-vertical
          :productCategoryStyle="state.productCategoryStyle"
          :showSpecParent="state.showSpecParent"
          :bannerJson="state.bannerJson"
          isNew="1"
          :shipmentTypes="shipmentTypes"
          :category="state.category"
          :childrenSelect="childrenSelect"
          v-if="!state.loading"
          :shopCart="state.shopCart"
          :counts="listCounts"
          :hasUserInfo="state.hasUserInfo"
          @onClickGoods="onClickGoods"
          @addToCart="addToCart"
          @noop="noop"
          @getUserInfo="onGetUserInfo"
          :load="state.searchLoad"
          :currentCategory="currentCategory"
          :selectedSecondId="selectedSecondId"
          :currenSelect="currenSelect"
          @clickCategory="clickCategoryVertical"
          :isPullDownRefresh="state.isPullDownRefresh"
          @clickItem="clickCategoryItem"
          @clickThreeItem="clickThreeCategoryItem"
          :level="level"
          :proShowType="state.proShowType"
          @shipmentTypeChange="shipmentTypeChange"
          @showLoadingChange="showLoadingChange"
        ></category-vertical>
      </view>
    </view>
    <view class="no-data" v-if="!state.loading && state.category.length == 0">
      <image :src="state.imagesPath.imgNoData"></image>
      <button
        :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
        size="mini"
        @click="toHome"
      >
        随便逛逛
      </button>
    </view>
    <custom-loading v-if="state.showLoading"></custom-loading>

    <!-- <view class="content" wx:if="{{state.loading}}">
  <view class="spinner">
    <view class="rect1" style="background-color: {{state.themeColor}}"></view>
    <view class="rect2" style="background-color: {{state.themeColor}}"></view>
    <view class="rect3" style="background-color: {{state.themeColor}}"></view>
    <view class="rect4" style="background-color: {{state.themeColor}}"></view>
    <view class="rect5" style="background-color: {{state.themeColor}}"></view>
  </view>
</view> -->
    <!-- 开屏推广弹窗 -->
    <welfarePromotion usePage="PRODUCT_LIST"></welfarePromotion>
    <popup
      :show="state.show.middle"
      position="middle"
      custom-class="middle"
      :overlayStyle="state.overlayStyle"
      @close="toggleBottomPopup"
    >
      <view class="popup-content">
        <view class="popup-content-box">
          <image :src="state.imagesPath.speechAssistantStart" mode="widthFix"></image>
          <view>你来说，我来做</view>
          <view>把你最喜欢的带给你</view>
        </view>
      </view>
    </popup>
    <tabbar
      :tabbar="state.tabbar"
      :show="state.showTabbar"
      @popup="recorderPopup"
      v-if="!state.openCustomTabbar"
    ></tabbar>
    <!-- <custom-tab-bar :tabbar="state.tabbar" :show="state.showTabbar" v-if="state.openCustomTabbar"></custom-tab-bar>-->
    <!-- 选择餐饮套餐弹窗 -->
    <!-- <setMeal show="{{meals.show}}" productId="{{meals.productId}}" storeId="{{meals.storeId}}" bind:outcome="chooseOutcome"></setMeal> -->
    <!-- 加入购物车图片 -->
    <view
      class="good_box"
      :hidden="state.hide_good_box"
      :animation="state.animation"
      :style="'left:' + bus_x + 'px;top:' + bus_y + 'px;'"
    >
      <image :src="goodsBoxImage" mode="aspectFit"></image>
    </view>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsFlyJs from '@/utils/newretail/fly'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bus from 'iny-bus'
const app = getApp()

// pages/mallModule/tabbar/category/category-list/category-list.js
const storeService = _apiStoreServiceJs
const productService = _apiProductServiceJs
const shopcartService = _apiShopcartServiceJs
const memberService = _apiMemberServiceJs
const sysService = _apiSystemServiceJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const FLY = _utilsFlyJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs

// 获取应用实例
let canAddToCart = true
const state = reactive({
  showLoading: true,
  // 自定义Loading - 初始化为true，确保第一次进入页面时显示加载动画
  initialpurchasenumber: 1,
  navigationBarTitle: '分类',
  imagesPath: IMGAGESPATH,
  storeId: '',
  store: '',
  storeData: {},
  category: [],
  // 类目以及类目下商品
  tempCategorys: [],
  // 类目以及类目下商品
  tabSelected: '0',
  goodsList: [],
  scrollList: [],
  scrollTop: 0,
  isScrollTo: false,
  loading: true,
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
  },
  overlayStyle: 'background: rgba(255, 255, 255, 0.9)',
  tabbar: {},
  showTabbar: false,
  phone: false,
  meals: {
    show: false,
    productId: '',
    storeId: '',
  },
  hide_good_box: true,
  animation: {},
  shopCart: {},
  // 购物车商品数量
  shopCartGoodsId: [],
  // 购物车商品id列表
  hasUserInfo: false,
  isMember: false,
  systemConfigure: {
    productsListShowClass: 'TRANSVERSE', // 商品列表分类展示样式，可选项：横向（默认）TRANSVERSE，竖向VERTICAL
  },
  searchLoad: true,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  proShowType: 'list',
  // 商品显示类型  card 卡片式 list 列表式
  sortkeys: {
    field: 'sold_count',
    orderBy: 'desc',
  },
  scrollLeft: 0,
  openCustomTabbar: false,
  scrollIntoViewId: '',
  loaded: false,
  isPullDownRefresh: false,
  isDistributionStore: false,
  isNextDayStore: false,
  bannerJson: '',
  // 分类广告图数据
  showSpecParent: '',
  // 是否显示规格缩略图
  productCategoryStyle: '',
  // 当前显示风格
  parentId: '',
  // 当前头部一级分类的选中id
  showCategoryName: false,
  // 是否显示一级分类名称
  showAllCategory: false, // 是否显示风格2一级分类全部分类弹窗
})
function toHome() {
  NAVPAGE.toHome()
}
function handleConfirm() {
  uni.navigateTo({
    // url: '../../goods/search/search?keyword=' + keyword + '&type=wait',
    url: '../../../goods/search/search?tongpei=true',
    fail: function (e) {
      console.log(e)
    },
  })
}
function changeStore() {
  NAVPAGE.toSelectStore()
}
function handleshowType(e) {
  console.log(e)
  state.proShowType = e.currentTarget.dataset.showtype
}
function toGoodsDetail(val) {
  let opts =
    '?productId=' +
    val.currentTarget.dataset.productid +
    '&storeId=' +
    state.storeId +
    '&type=normal'
  if (val.currentTarget.dataset.easyscene != null) {
    opts = opts + '&easyScene=' + val.currentTarget.dataset.easyscene
  }
  NAVPAGE.toGoodsDetails(opts)
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false
  } else {
    return true
  }
}
onLoad(function (_options) {
  console.log(_options)
  const self = this
  const keyArr = [
    'productCategory-showSpecImage',
    'productCategory-style',
    'productCategory-showType',
    'productCategory-showCategory1Name',
  ]
  const keys = keyArr.join(',')
  sysService.query(keys).then((res) => {
    if (res) {
      res.forEach((val) => {
        if (val.key === 'productCategory-showSpecImage') {
          state.showSpecParent = val.value === '是'
        } else if (val.key === 'productCategory-style') {
          state.productCategoryStyle = val.value
        } else if (val.key === 'productCategory-showType') {
          if (val.value === '一行一个') {
            state.proShowType = 'list'
          } else {
            state.proShowType = 'card'
          }
        } else if (val.key === 'productCategory-showCategory1Name') {
          state.showCategoryName = val.value === '是'
        }
      })
    }
  })
  eventId = bus.on('userShopCartChange', () => {
    if (app.globalData.storeInfo) {
      getShopCart(app.globalData.storeInfo.id)
    }
  })
  if (_options && _options.fromAdvertising) {
    // 如果是广告页跳转过来，需要手动改一次选择的分类id
    app.globalData.categoryId = _options.categoryId
  }
  if (app.globalData.categoryId != null && app.globalData.categoryId !== '') {
    _options = {
      categoryId: app.globalData.categoryId,
    }
    _options = _options
    app.globalData.categoryId = ''
  }
  if (app.globalData.shipmentTypes != null && app.globalData.shipmentTypes !== '') {
    state.shipmentTypes = app.globalData.shipmentTypes
    app.globalData.shipmentTypes = ''
  }
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  new app.globalData.addToCart()
  if (app.globalData.openCustomTabbar) {
    app.getTabbar()
    app.editTabbar()
    state.openCustomTabbar = true
    state.showTabbar = true
  } else {
    if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
      app.globalData.tabBar.list.forEach((item) => {
        if (item.linkModel === 'sort') {
          uni.hideTabBar()
          app.getTabbar()
          app.editTabbar()
          state.showTabbar = true
        }
      })
    }
  }
  // 设置当前设备是否iPhone X
  state.isIphoneX = app.globalData.isIphoneX
  state.navHeight = app.globalData.navHeight
  state.navHeightTop = app.globalData.navHeight + (90 * app.globalData.systemInfo.windowWidth) / 750
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  const configure = {
    hasShowProductsCategoryPage: true,
    // 是否显示分类页
    productsListShowClass: 'TRANSVERSE', // 商品列表分类展示样式，可选项：横向（默认）TRANSVERSE，竖向VERTICAL
  }
  configure.hasShowProductsCategoryPage = app.globalData.systemConfigure.hasShowProductsCategoryPage
  configure.productsListShowClass = app.globalData.systemConfigure.productsListShowClass
  state.systemConfigure = configure
  hasCategoryId = false
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    state.store = app.globalData.storeInfo.name
    state.storeId = app.globalData.storeInfo.id
    ANALYSIS.PVStatistics(state.storeId)
    if (_options.categoryId != null) {
      console.log(_options.categoryId, 'options.categoryId')
      getVerticalMenuProduct(state.storeId, _options.categoryId)
    } else {
      getVerticalMenuProduct(state.storeId)
    }
    // this.getShopCart(this.data.storeId)
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
    state.shopCart = localShopingCart.items
    state.shopCartGoodsId = localShopingCart.goodsId
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation()
      .then((res) => {
        app.globalData.storeInfo = res
        state.store = res.name
        state.storeId = res.id
        ANALYSIS.PVStatistics(state.storeId)
        if (_options.categoryId != null) {
          getVerticalMenuProduct(res.id, _options.categoryId)
        } else {
          getVerticalMenuProduct(res.id)
        }
        // self.getShopCart(res.id)
        const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
        state.shopCart = localShopingCart.items
        state.shopCartGoodsId = localShopingCart.goodsId
      })
      .catch((err) => {
        console.log(err)
      })
  }
  if (_options.scene) {
    const scene = decodeURIComponent(_options.scene)
    if (scene !== 'isfromQR') {
      try {
        uni.setStorageSync('wj_sharingId', scene)
      } catch (e) {}
    }
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures()
})
onReady(function () {})
onShow(function () {
  if (state.openCustomTabbar) {
    app.getTabbar()
    app.editTabbar()
  }
  canAddToCart = true
  // 判断用户是否授权
  checkUserInfo()
  const self = this
  if (state.storeId) {
    // this.getShopCart(this.data.storeId)
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
    state.shopCart = localShopingCart.items
    state.shopCartGoodsId = localShopingCart.goodsId
    if (
      app.globalData.storeInfo &&
      (state.storeId != app.globalData.storeInfo.id ||
        state.storeData.virtualStoreId != app.globalData.storeInfo.virtualStoreId)
    ) {
      state.storeId = app.globalData.storeInfo.id
      state.store = app.globalData.storeInfo.name
      state.storeData = {
        ...app.globalData.storeInfo,
      }
      queryProductMenu()
    } else if (app.globalData.categoryId != null && app.globalData.categoryId !== '') {
      options = {
        categoryId: app.globalData.categoryId,
      }
      console.log(options)
      app.globalData.categoryId = ''
      queryProductMenu()
    }
    if (app.globalData.shipmentTypes != null && app.globalData.shipmentTypes !== '') {
      state.shipmentTypes = app.globalData.shipmentTypes
      app.globalData.shipmentTypes = ''
    }
  }
  function queryProductMenu() {
    if (options.categoryId != null) {
      getVerticalMenuProduct(state.storeId, options.categoryId)
    } else {
      getVerticalMenuProduct(state.storeId)
    }
  }
})
onHide(function () {})
onUnload(function () {
  bus.remove('userShopCartChange', eventId)
})
onPullDownRefresh(function () {
  const self = this
  if (state.isDistributionStore || state.storeId === '' || state.storeId == null) {
    return
  }
  state.listCounts = []
  if (state.currenSelect != null && state.currenSelect !== '') {
    // wx.showLoading({
    //   title: "加载中"
    // });
    state.isPullDownRefresh = true
    state.showLoading = true
    setTimeout(() => {
      state.isPullDownRefresh = false
    }, 100)
    getVerticalMenuProduct(state.storeId, state.currenSelect)
  } else {
    getVerticalMenuProduct(state.storeId)
  }
  // self.getShopCart(self.data.storeId)
  const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
  state.shopCart = localShopingCart.items
  state.shopCartGoodsId = localShopingCart.goodsId
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
onReachBottom(function () {})
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
        '/pages-sub/newretail/pages/mallModule/tabbar/category/category-list/category-list?shareId=' +
        memberId +
        '&storeId=' +
        state.storeId,
      imageUrl: sharePictures,
      success(e) {},
    }
  } else {
    return {
      title: '',
      path:
        '/pages-sub/newretail/pages/mallModule/tabbar/category/category-list/category-list?storeId=' +
        state.storeId,
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
function addShopcartCatch(val) {
  addShopCartData = val
}
function addShopcart(val) {
  const that = this
  if (!canAddToCart) {
    console.log('==============================正在加入购物车')
    return
  }
  canAddToCart = false
  const productId = val.detail.target.dataset.id
  const business = val.detail.target.dataset.business
  const style = val.detail.target.dataset.style
  const initialpurchasenumber = val.detail.target.dataset.initialpurchasenumber
  state.initialpurchasenumber = initialpurchasenumber
  const mode = val.detail.target.dataset.type
  let storeId = ''
  const loginStatus = checkAuth()
  let balance = val.detail.target.dataset.balance
  let hasSharingPersonId = false
  console.log('==============================正在加入购物车')
  if (style !== 'SPEC_PARENT' && style !== 'MEALS2') {
    if (loginStatus) {
      if (business === 'DISTRIBUTION') {
        try {
          const data = uni.getStorageSync('wj_distributionStore')
          if (data) {
            storeId = data.id
          }
          console.log('是不是进入到了这里', storeId)
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
      let postData = {
        storeId,
        lists: [
          {
            count: initialpurchasenumber || 1,
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
        balance = 0
        const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
        productService
          .getDetails(storeId, productId)
          .then((res) => {
            let goodNum = null
            if (
              localShopingCart &&
              localShopingCart.goodsId &&
              localShopingCart.goodsId.indexOf(productId) > -1
            ) {
              goodNum = localShopingCart.items[productId]
            }
            if (mode === 'reduce') {
              if (goodNum && goodNum <= initialpurchasenumber) {
                postData.lists[0].count = 0 - goodNum
              }
            }
            if (res) {
              balance = res.balance
            }
            if (res.style === 'MEALS' || res.style === 'MEALS2') {
              getCateringDetailsById(productId, storeId)
            } else {
              addShopcart(balance)
            }
          })
          .catch((err) => {
            canAddToCart = true
          })
      } else if (business === 'CATERING' && style === 'MEALS') {
        getCateringDetailsById(productId, storeId)
      } else {
        addShopcart(balance)
      }
      function addShopcart(balance) {
        if (app.globalData.userInfo.member) {
          if (balance === 0 || balance === null || balance === '') {
            canAddToCart = true
            uni.showToast({
              title: '门店中该商品库存不足，请选购其他商品~',
              icon: 'none',
              duration: 2000,
            })
          } else {
            console.log('开始调用：' + new Date().getTime())
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
                app.globalData.storeIdentification =
                  business === 'DISTRIBUTION'
                    ? 'distribution'
                    : business === 'NEXT_DAY'
                      ? 'nextDay'
                      : 'normal'
                app.globalData.isShopCartChange = true
                console.log('添加成功了：' + new Date().getTime())
                if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
                  util.removeSharingPersonInfo()
                }
                if (mode === 'reduce') {
                  reduceLocalGoods(productId)
                } else {
                  if (i && i !== void 0) {
                    addToCartAnimateTest(val)
                    addLocalGoods(productId)
                  } else {
                    handleTouchOnGoods(addShopCartData)
                  }
                }
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
      // 获得固定组合商品详情
      function getCateringDetailsById(productId, storeId) {
        productService
          .getCateringDetailsById(productId, storeId)
          .then((res) => {
            const self = this
            const cateringGroupProducts = res.cateringGroupProducts
            const productId = res.id
            const goodsList = []
            let mealCanBuy = true
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

                    // 判断当前门店是否存在该商品 如果不存在则提示用户
                    if (!ele.exist || ele.storeBalance <= 0) {
                      mealCanBuy = false
                      canAddToCart = true
                      uni.showToast({
                        title: '门店中该商品库存不足，请选购其他商品~',
                        icon: 'none',
                        duration: 2000,
                      })
                      return false
                    }
                  }
                }
              }
              const tempData = {
                count: initialpurchasenumber || 1,
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
    // 多规格商品跳转商品详情 可选组合商品跳转详情
    let opts =
      '?productId=' +
      productId +
      (business == 'DISTRIBUTION' || business == 'NEXT_DAY' ? '' : '&storeId=' + state.storeId) +
      '&source=addshopcart&type=normal'
    if (val.detail.target.dataset.easyscene != null) {
      opts = opts + '&easyScene=' + val.detail.target.dataset.easyscene
    }
    NAVPAGE.toGoodsDetails(opts)
  }
}
function recorderPopup() {
  toggleBottomPopup()
}
function addCateringMeals(e) {
  const meals = {
    show: true,
    productId: e.detail.productId,
    storeId: e.detail.storeId,
  }
  state.meals = meals
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
function toggleBottomPopup() {
  toggle('middle')
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
  state.overlayStyle = state.overlayStyle
}
function handleUserLogin() {
  console.log(app.globalData.userInfo)
  const self = this
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo
    state.userInfo = {
      ...user.wxaUser,
    }
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
    } else {
      state.userInfo = user.wxaUser
      state.hasUserInfo = true
    }
  }
}
function handleTabbar(e) {
  console.log(e.detail)
  if (e.detail.showTabbar === true) {
    state.showTabbar = e.detail.showTabbar
  } else {
    state.showTabbar = e.detail.showTabbar
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
function getShopCart(storeId) {
  const self = this
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    shopcartService
      .getCatering(storeId)
      .then((res) => {
        const tempShopCart = {}
        const grabProducts = {}
        const tempShopCartGoodsId = []
        const tempGrabShopCartGoodsId = []
        if (res.items && res.items.length > 0) {
          // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
          res.items.forEach((item) => {
            if (!item.grabActivityId && !item.newmbrActivityId) {
              let index = -1
              for (let i = 0; i < tempShopCartGoodsId.length; i++) {
                if (item.productId == tempShopCartGoodsId[i]) {
                  index = i
                }
              }
              if (index > -1) {
                tempShopCart[item.productId] = tempShopCart[item.productId] + item.productNum
              } else {
                tempShopCart[item.productId] = item.productNum
                tempShopCartGoodsId.push(item.productId)
              }
            } else if (item.grabActivityId) {
              let index = -1
              for (let i = 0; i < tempGrabShopCartGoodsId.length; i++) {
                if (item.productId == tempGrabShopCartGoodsId[i]) {
                  index = i
                }
              }
              if (index > -1) {
                grabProducts[item.productId] = grabProducts[item.productId] + item.productNum
              } else {
                grabProducts[item.productId] = item.productNum
                tempGrabShopCartGoodsId.push(item.productId)
              }
            }
          })
        }
        state.shopCart = tempShopCart
        state.shopCartGoodsId = tempShopCartGoodsId
        const localData = {
          goodsId: tempShopCartGoodsId,
          items: tempShopCart,
        }
        const localGrabData = {
          goodsId: tempGrabShopCartGoodsId,
          items: grabProducts,
        }
        console.log(localData, '本地购物车数据')
        try {
          uni.setStorageSync('wj_shopCartStorage', localData)
          uni.setStorageSync('wj_grabshopCartStorage', localGrabData)
        } catch (e) {}
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
    const localProductCount = uni.getStorageSync('wj_userProductsCount')
    const counts = String(localProductCount)
    if (counts) {
      app.setTabBarBadge('shopping_cart', counts)
    }
    shopcartService
      .getProductsCount()
      .then((res) => {
        app.setTabBarBadge('shopping_cart', String(res))
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
        if (
          state.initialpurchasenumber &&
          Number(tempShopCart[_id]) <= state.initialpurchasenumber
        ) {
          tempShopCart[_id] = state.initialpurchasenumber
        } else {
          tempShopCart[_id] = Number(tempShopCart[_id]) - 1
        }
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
function handleTouchOnGoods(e) {
  const self = this
  let goodsBoxImage = ''
  state.goodsBoxImage = ''
  if (e != null) {
    if (e.target.dataset.addtype === 'normal') {
      // 首页精选
      const _data = state.allGoodsList
      _data.forEach((item) => {
        if (item.id === e.target.dataset.id) {
          goodsBoxImage = item.imageUrl
        }
      })
    }
    state.goodsBoxImage = goodsBoxImage
    const touches = e.touches['0']
    FLY.touchOnGoods(e.target.dataset.addtype, touches, e.target.dataset.id).then((res) => {
      const animation = res
      state.hide_good_box = false
      state.bus_x = animation.finger.x
      state.bus_y = animation.finger.y
      state.animation = animation.animation
      setTimeout(() => {
        state.hide_good_box = true
        addLocalGoods(e.target.dataset.id)
      }, animation.duration)
    })
  }
}
function addShopcartAnimation(e) {
  const self = this
  const tempArr = Object.keys(e.detail.animation)
  if (e.detail.animation && tempArr.length > 0 && e.detail.goodsBoxImage !== '') {
    const animation = e.detail.animation
    state.hide_good_box = false
    state.bus_x = animation.finger.x
    state.bus_y = animation.finger.y
    state.goodsBoxImage = e.detail.goodsBoxImage
    state.animation = animation.animation
    setTimeout(() => {
      // self._addLocalGoods(e.target.dataset.id)
      state.hide_good_box = true
    }, animation.duration)
  }
}
function getUserIsFans(e) {
  if (e.detail.isFans == false) {
    // 不是粉丝的处理
  } else {
    // 是粉丝的处理
    // 根据全局报错的用户信息检查用户信息
    checkUserInfo()
  }
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
function toProductDetail(e) {
  let opts = ''
  let n = 0
  for (const t in e) {
    ;((opts = n === 0 ? opts + '?' + t + '=' + e[t] : opts + '&' + t + '=' + e[t]), n++)
  }
  NAVPAGE.toGoodsDetails(opts)
}
function shipmentTypeChange(e) {
  state.shipmentTypes = e.detail
}
function showLoadingChange(e) {
  state.showLoading = e.detail
}
function onClickGoods(val) {
  const e = {
    productId: val.detail.productid,
    type: val.detail.type,
    lastPage: 'sort',
  }
  toProductDetail(e)
}
function addToCart(e) {
  console.log('收到用户点击：' + new Date().getTime())
  const self = this
  const _i = e.detail.detail.context
  i = _i
  console.log(e, 'eeeeeee')
  addShopcart(e.detail.detail)
}
function addToCartAnimateTest(e) {
  const self = this
  const _i2 = i
  const t = new Date().getTime()
  const o = state.ctime
  if (!(o != 'undefined' && t - o < 800)) {
    state.ctime = t
    const n = app.globalData.systemInfo
    const r = (n.windowWidth / 8) * 5
    const s = n.windowHeight + 20
    if (e.detail.target.dataset.addtype === 'three') {
      // 三分图商品
      addcart.animateAddToCart('.gm-small-goods-img', r, s, _i2)
    } else {
      // 常规商品
      // 商品列表分类展示样式，可选项：横向（默认）TRANSVERSE，竖向VERTICAL
      if (state.systemConfigure.productsListShowClass === 'TRANSVERSE') {
        addcart.animateAddToCart('.gm-goods-img', r, s, _i2)
      } else {
        console.log('????')
        addcart.animateAddToCart('.wm-goods-img', r, s, _i2)
      }
    }
  }
}
function noop(e) {
  // console.log(e)
}
function onGetUserInfo(e) {
  getUserInfo(e.detail)
}
function onProductReadyEnd(e) {
  if (e.detail) {
    productReadyCounts++
  }
}
function getVerticalMenuProduct(storeId, categoryId) {
  console.log('获取当前门店的所有分类和商品', storeId, categoryId)
  const that = this
  let storeIds = storeId
  if (util.isDeliveryProduct()) {
    // 查询统配门店信息
    if (app.globalData.distributionStore) {
      const distributionStore = app.globalData.distributionStore
      storeIds = storeIds ? storeIds + ',' + distributionStore.id : distributionStore.id
      getNextDayStore(storeIds, (storeIds1) => {
        handleGetCategoryWithCountByStore(storeIds1)
      })
    } else {
      storeService
        .getDistributionStore()
        .then((res) => {
          if (res) {
            app.globalData.distributionStore = res
            const distributionStore = res
            storeIds = storeIds ? storeIds + ',' + distributionStore.id : distributionStore.id
            getNextDayStore(storeIds, (storeIds1) => {
              handleGetCategoryWithCountByStore(storeIds1)
            })
            try {
              uni.setStorageSync('wj_distributionStore', distributionStore)
            } catch (e) {
              console.log(e)
            }
          } else {
            getNextDayStore(storeIds, (storeIds1) => {
              handleGetCategoryWithCountByStore(storeIds1)
            })
          }
        })
        .catch((e) => {
          console.log(e.message)
          getNextDayStore(storeIds, (storeIds1) => {
            handleGetCategoryWithCountByStore(storeIds1)
          })
        })
    }
  } else {
    getNextDayStore(storeIds, (storeIds1) => {
      handleGetCategoryWithCountByStore(storeIds1)
    })
  }
  // 次日达回调方法
  function getNextDayStore(storeIds, callBackFn) {
    if (util.isNextDayProduct()) {
      // 查询统配门店信息
      if (app.globalData.nextDayStore) {
        const nextDayStore = app.globalData.nextDayStore
        callBackFn(storeIds ? storeIds + ',' + nextDayStore.id : nextDayStore.id)
      } else {
        storeService
          .getNextDayStore()
          .then((res) => {
            if (res) {
              const nextDayStore = res
              app.globalData.nextDayStore = res
              callBackFn(storeIds ? storeIds + ',' + nextDayStore.id : nextDayStore.id)
              try {
                uni.setStorageSync('wj_nextDayStore', nextDayStore)
              } catch (e) {}
            } else {
              callBackFn(storeIds)
            }
          })
          .catch((e) => {
            callBackFn(storeIds)
          })
      }
    } else {
      callBackFn(storeIds)
    }
  }
  function handleGetCategoryWithCountByStore(storeIds1) {
    productService
      .getCategoryWithCountByStore(storeIds1 || storeIds)
      .then((res) => {
        console.log(res)
        // 查询是几级分类
        let level = 1
        for (let i = 0; i < res.length; i++) {
          const ele = res[i]
          if (ele.children.length > 0) {
            level = 2
            for (let j = 0; j < ele.children.length; j++) {
              const item = ele.children[j]
              if (item.children.length > 0) {
                level = 3
                break
              }
            }
            if (level === 3) {
              break
            }
          }
        }
        console.log('分类层级：' + level)
        // 三级分类最下层两级，二级类目只显示一二级
        state.level = level
        state.showLoading = false
        const tempCategorys = []
        res.forEach((item) => {
          // 一级类目
          let tempItem = {
            categoryId: item.id,
            menuName: item.name,
            showChildren: false,
            business: item.business,
            isSelected: false,
            bannerJson: item.bannerJson ? JSON.parse(item.bannerJson) : '',
            pictureUrl: item.pictureUrl,
            children: [],
          }
          if (item.parentId) {
            tempItem = {
              ...tempItem,
              parentId: item.parentId,
            }
          }
          if (item.children.length > 0) {
            item.children.forEach((ele) => {
              // 二级类目
              const tempEle = {
                categoryId: ele.id,
                menuName: ele.name,
                showChildren: false,
                business: ele.business,
                isSelected: false,
                parentId: ele.parentId,
                bannerJson: ele.bannerJson ? JSON.parse(ele.bannerJson) : '',
                pictureUrl: ele.pictureUrl,
                children: [],
              }
              if (ele.children.length > 0) {
                ele.children.forEach((data) => {
                  // 三级类目
                  const tempData = {
                    categoryId: data.id,
                    menuName: data.name,
                    business: data.business,
                    parentId: data.parentId,
                    bannerJson: data.bannerJson ? JSON.parse(data.bannerJson) : '',
                    pictureUrl: data.pictureUrl,
                    isSelected: false,
                    showChildren: false,
                  }
                  tempEle.children.push(tempData)
                })
              }
              tempItem.children.push(tempEle)
            })
          }
          tempCategorys.push(tempItem)
        })
        handleCategorys()
        function handleCategorys() {
          let currentStyle =
            state.productCategoryStyle === '风格1'
              ? tempCategorys
              : tempCategorys && tempCategorys[0]
                ? tempCategorys[0].children
                : []
          state.tempCategorys = tempCategorys
          state.category = currentStyle
          if (
            (state.productCategoryStyle === '风格2' || state.productCategoryStyle === '风格3') &&
            tempCategorys &&
            tempCategorys[0] &&
            tempCategorys[0].children.length < 1 &&
            !categoryId
          ) {
            // 风格2一级分类不走下方if逻辑,所以手动触发一次点击事件默认选中第一个
            clickCategoryVerticalTop({
              currentTarget: {
                dataset: {
                  id: tempCategorys[0].categoryId,
                },
              },
            })
          }
          if (
            (state.productCategoryStyle === '风格2' || state.productCategoryStyle === '风格3') &&
            tempCategorys.length > 0 &&
            !categoryId
          ) {
            state.parentId = tempCategorys[0].categoryId
          }
          if (
            (state.productCategoryStyle === '风格2' || state.productCategoryStyle === '风格3') &&
            categoryId != null
          ) {
            console.log('当前应该展示的分类', categoryId)
            const parentId = categoryId.split(',')[0]
            tempCategorys.some((item) => {
              if (item.categoryId == parentId) {
                currentStyle = item.children ? item.children : []
              }
              return item.categoryId == parentId
            })
            state.tempCategorys = tempCategorys
            state.category = currentStyle
            const categoryIdList = categoryId.split(',')
            if (categoryIdList.length == 1) {
              clickCategoryVerticalTop({
                currentTarget: {
                  dataset: {
                    id: parentId,
                  },
                },
              })
            }
            state.parentId = parentId
            state.currenSelect = categoryIdList[categoryIdList.length - 1]
            state.currentCategory = categoryIdList[categoryIdList.length - 1]
            state.childrenSelect = categoryIdList[categoryIdList.length - 1]
            if (categoryIdList && categoryIdList.length > 1) {
              state.selectedSecondId = categoryIdList[1]
            }
          }
          console.log(currentStyle.length, 'currentStyle.length')
          if (currentStyle.length > 0) {
            let showCategorys = null // 应该显示的分类（最底层分类）
            let currenSelect = '' // 当前显示的分类的id
            let currentCategory = '' // 当前显示的大分类（一级分类）
            let selectedSecondId = '' // 当前显示的二级分类
            let childrenSelect = '' // 当前显示的子分类的id

            let firstStage = 0 // 当前显示的第几个一级分类
            let secondStage = 0 // 当前显示的第几个二级分类
            let thirdStage = 0 // 当前显示的第几个三级分类
            let bannerJson = {} // 当前显示的分类广告图
            let pictureUrl = {} // 当前显示的分类广告图
            // 竖形分类不允许开启显示分类页 如果开启也无效
            let isNoSubcategories = false // 没有子分类
            // 竖形分类不存在跳分类页情况（四级？）  类目id找不到显示全部
            const categoryIdList = categoryId ? categoryId.split(',') : []
            if (categoryIdList.length > 0) {
              // 指定栏目跳转
              tempCategorys.forEach((firstCategory, firstIndex) => {
                if (firstCategory.categoryId == categoryIdList[0]) {
                  if (categoryIdList.length == 1) {
                    firstStage = firstIndex
                    if (level == 1) {
                      showCategorys = firstCategory
                      firstStage = firstIndex
                    } else if (level == 2) {
                      if (firstCategory.children.length > 0) {
                        showCategorys = firstCategory.children[0]
                      } else {
                        showCategorys = firstCategory
                        isNoSubcategories = true
                      }
                    } else if (level == 3) {
                      if (
                        firstCategory.children.length > 0 &&
                        firstCategory.children[0].children &&
                        firstCategory.children[0].children.length > 0
                      ) {
                        showCategorys = firstCategory.children[0].children[0]
                      } else {
                        if (firstCategory.children.length > 0) {
                          showCategorys = firstCategory.children[0]
                          isNoSubcategories = true
                        } else {
                          showCategorys = firstCategory
                          isNoSubcategories = true
                        }
                      }
                    }
                  } else if (
                    categoryIdList.length == 2 &&
                    firstCategory.children &&
                    firstCategory.children.length > 0
                  ) {
                    firstCategory.children.some((secondCategory, secondIndex) => {
                      if (categoryIdList[1] && categoryIdList[1] === secondCategory.categoryId) {
                        firstStage = firstIndex
                        secondStage = secondIndex
                        if (level == 2) {
                          showCategorys = secondCategory
                        } else if (level == 3) {
                          if (secondCategory.children && secondCategory.children.length > 0) {
                            showCategorys = secondCategory.children[0]
                            thirdStage = 0
                          } else {
                            showCategorys = secondCategory
                            isNoSubcategories = true
                          }
                        }
                      }
                      return categoryIdList[1] && categoryIdList[1] === secondCategory.categoryId
                    })
                  } else if (
                    categoryIdList.length == 3 &&
                    firstCategory.children &&
                    firstCategory.children.length > 0
                  ) {
                    firstCategory.children.some((secondCategory, secondIndex) => {
                      if (
                        categoryIdList[1] &&
                        categoryIdList[1] === secondCategory.categoryId &&
                        secondCategory.children &&
                        secondCategory.children.length > 0
                      ) {
                        return secondCategory.children.some((thirdCategory, thirdIndex) => {
                          if (categoryIdList[2] == thirdCategory.categoryId) {
                            firstStage = firstIndex
                            secondStage = secondIndex
                            thirdStage = thirdIndex
                            showCategorys = thirdCategory
                          }
                          return categoryIdList[2] == thirdCategory.categoryId
                        })
                      } else if (
                        categoryIdList[1] &&
                        categoryIdList[1] === secondCategory.categoryId
                      ) {
                        firstStage = firstIndex
                        secondStage = secondIndex
                        showCategorys = secondCategory
                        return categoryIdList[1] == secondCategory.categoryId
                      }
                    })
                  } else {
                    firstStage = firstIndex
                    showCategorys = firstCategory
                    isNoSubcategories = true
                  }
                }
              })
            }

            // 默认显示第一个一级分类下第一个二级分类下第一个三级分类下的商品，如果是跳转的分类则显示该分类下的商品

            if (!showCategorys) {
              if (level === 1) {
                showCategorys = currentStyle[firstStage]
              } else if (level === 2) {
                if (
                  currentStyle[firstStage].children &&
                  currentStyle[firstStage].children.length > 0
                ) {
                  showCategorys = currentStyle[firstStage].children[secondStage]
                }
              } else if (level === 3) {
                if (
                  currentStyle[firstStage].children &&
                  currentStyle[firstStage].children.length > 0
                ) {
                  if (
                    currentStyle[firstStage].children[secondStage].children &&
                    currentStyle[firstStage].children[secondStage].children.length > 0
                  ) {
                    showCategorys =
                      currentStyle[firstStage].children[secondStage].children[thirdStage]
                  } else {
                    isNoSubcategories = true
                    showCategorys = currentStyle[firstStage].children[secondStage]
                  }
                }
              }
            }
            if (!showCategorys) {
              isNoSubcategories = true
              showCategorys = currentStyle[firstStage]
            }
            // 当前展示的分类
            currenSelect = showCategorys.categoryId
            if (showCategorys.parentId != null && level > 1) {
              if (level === 2) {
                if (
                  state.productCategoryStyle === '风格2' ||
                  state.productCategoryStyle === '风格3'
                ) {
                  currentCategory = showCategorys.categoryId
                } else {
                  currentCategory = showCategorys.parentId
                }
                selectedSecondId = showCategorys.categoryId
                childrenSelect = showCategorys.categoryId
                bannerJson = showCategorys.bannerJson
                pictureUrl = showCategorys.pictureUrl
              } else {
                // 三级分类
                if (!isNoSubcategories) {
                  if (
                    state.productCategoryStyle === '风格2' ||
                    state.productCategoryStyle === '风格3'
                  ) {
                    currentCategory = showCategorys.parentId
                  } else {
                    currentCategory = currentStyle[firstStage].categoryId
                  }
                  selectedSecondId = showCategorys.parentId
                  childrenSelect = showCategorys.categoryId
                  bannerJson = showCategorys.bannerJson
                  pictureUrl = showCategorys.pictureUrl
                } else {
                  if (
                    state.productCategoryStyle === '风格2' ||
                    state.productCategoryStyle === '风格3'
                  ) {
                    currentCategory = showCategorys.categoryId
                  } else {
                    currentCategory = currentStyle[firstStage].categoryId
                  }
                  selectedSecondId = showCategorys.categoryId
                  childrenSelect = showCategorys.categoryId
                  bannerJson = showCategorys.bannerJson
                  pictureUrl = showCategorys.pictureUrl
                }
              }
            } else {
              currentCategory = showCategorys.categoryId
              bannerJson = showCategorys.bannerJson
              if (level === 2) {
                selectedSecondId = showCategorys.categoryId
                bannerJson = showCategorys.bannerJson
                pictureUrl = showCategorys.pictureUrl
              }
              if (level === 3 || level === 1) {
                childrenSelect = showCategorys.categoryId
                bannerJson = showCategorys.bannerJson
                pictureUrl = showCategorys.pictureUrl
              }
            }
            state.currenSelect = currenSelect
            state.currentCategory = currentCategory
            state.selectedSecondId = selectedSecondId
            state.childrenSelect = childrenSelect
            state.bannerJson = bannerJson
            state.pictureUrl = pictureUrl
            console.info('当前应该展示的分类')
            console.info(showCategorys)
          }
          state.loading = false
        }
      })
      .catch((err) => {
        console.log(err)
        state.showLoading = false
        util.showToast(err.message)
      })
  }
}
function doOpenAllCategory() {
  state.showAllCategory = !state.showAllCategory
}
function clickCategoryVerticalTop(e) {
  if (e.currentTarget.dataset.from) {
    // 如果是全部分类弹窗点击需要关闭弹窗
    state.showAllCategory = !state.showAllCategory
  }
  // 设置当前选中的商品类目
  const parentId = e.currentTarget.dataset.id
  let categoryId
  let tempSelect
  let secondId
  state.parentId = parentId
  state.tempCategorys.forEach((val) => {
    if (val.categoryId === parentId) {
      categoryId = val.children.length > 0 ? val.children[0].categoryId : val.categoryId
      tempSelect = val.children.length > 0 ? val.children[0].categoryId : val.categoryId
      secondId = val.children.length > 0 ? val.children[0].categoryId : val.categoryId
      if (val.children.length > 0) {
        state.category = val.children
      } else {
        state.category = []
      }
      clickCategoryVertical({
        detail: {},
        currentTarget: {
          dataset: {
            id: val.children.length > 0 ? val.children[0].categoryId : val.categoryId,
          },
        },
      })
    }
  })

  // this.setData({
  //   currenSelect: tempSelect, // 当前选中分类
  //   currentCategory: categoryId, // 当前父分类
  //   selectedSecondId: secondId,
  //   childrenSelect: tempSelect,
  // })

  // let category = this.data.tempCategory
}
function clickCategoryVertical(e) {
  // 设置当前选中的商品类目
  const self = this
  const category = state.category
  const categoryId = e.detail.currentTarget
    ? e.detail.currentTarget.dataset.id
    : e.currentTarget.dataset.id
  let hasChildren = false
  let hasThirdChildren = false
  let tempSelect = categoryId
  let secondId = categoryId
  let bannerJson = ''
  category.forEach((item) => {
    if (item.categoryId === categoryId) {
      bannerJson = item.bannerJson
      if (item.children.length > 0) {
        // 处理有下级分类的情况
        hasChildren = true
        secondId = item.children[0].categoryId
        tempSelect = item.children[0].categoryId
        bannerJson = item.children[0].bannerJson
        if (item.children[0].children && item.children[0].children.length > 0) {
          const ele = item.children[0]
          hasThirdChildren = true
          tempSelect = ele.children[0].categoryId
          bannerJson = ele.children[0].bannerJson
        }
      }
    }
  })
  console.log(bannerJson, 'bannerJson')
  state.searchLoad = true
  state.currenSelect = tempSelect
  state.currentCategory = categoryId
  state.selectedSecondId = secondId
  state.childrenSelect = tempSelect
  state.bannerJson = bannerJson
}
function clickCategoryItem(e) {
  console.log(e)
  const self = this
  const level = state.level
  const parentId = e.detail.currentTarget.dataset.parentid
  const categoryId = e.detail.currentTarget.dataset.id
  const category = state.category
  let fatherCategoryId = null
  let tempSelect = ''
  let thirdSelect = categoryId
  const secondId = categoryId
  let hasChildren = false
  let hasThirdChildren = false
  let bannerJson = ''
  category.forEach((item) => {
    if (item.categoryId === parentId && item.children.length > 0) {
      fatherCategoryId = item.categoryId
      bannerJson = item.bannerJson
      if (item.children && item.children.length > 0) {
        // 处理有下级分类的情况
        hasChildren = true
        for (let i = 0; i < item.children.length; i++) {
          const ele = item.children[i]
          if (ele.categoryId === categoryId) {
            bannerJson = ele.bannerJson
            if (ele.children && ele.children.length > 0) {
              hasThirdChildren = true
              tempSelect = ele.children[0].categoryId
              thirdSelect = ele.children[0].categoryId
              bannerJson = ele.children[0].bannerJson
            }
          }
        }
      }
    }
  })
  state.currenSelect = tempSelect
  state.currentCategory = fatherCategoryId
  state.selectedSecondId = secondId
  state.childrenSelect = thirdSelect
  state.bannerJson = bannerJson
}
function clickThreeCategoryItem(e) {
  console.log(e)
  const self = this
  const level = state.level
  const parentId = e.detail.currentTarget.dataset.parentid
  const categoryId = e.detail.currentTarget.dataset.id
  const category = state.category
  let fatherCategoryId = null
  let tempSelect = ''
  let thirdSelect = categoryId
  let secondId = parentId
  let bannerJson = ''
  let hasChildren = false
  let hasThirdChildren = false
  for (let i = 0; i < category.length; i++) {
    const item = category[i]
    if (item.children.length > 0) {
      for (let j = 0; j < item.children.length; j++) {
        const ele = item.children[j]
        if (ele.categoryId === parentId) {
          fatherCategoryId = ele.parentId
          secondId = ele.categoryId
          bannerJson = ele.bannerJson
          if (ele.children.length > 0) {
            for (let k = 0; k < ele.children.length; k++) {
              const it = ele.children[k]
              // 处理有下级分类的情况
              hasChildren = true
              hasThirdChildren = true
              if (it.categoryId === categoryId) {
                tempSelect = it.categoryId
                thirdSelect = it.categoryId
                bannerJson = it.bannerJson
              }
            }
          }
        }
      }
    }
  }
  state.currenSelect = tempSelect
  state.currentCategory = fatherCategoryId
  state.selectedSecondId = secondId
  state.childrenSelect = thirdSelect
  state.bannerJson = bannerJson
}
</script>
<style scoped>
/* pages/mallModule/tabbar/category/category-list/category-list.wxss */

page {
  height: 100%;
  background-color: #e9e9e9;
}

.top-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 92rpx;
  background: #fff;
  z-index: 9;
  padding: 0 15rpx;
  box-sizing: border-box;
}

.top-info .logo {
  width: 158rpx;
  height: 68rpx;
  padding-left: 5rpx;
  background: #fff;
}

.top-info .logo image {
  width: 158rpx;
  height: 68rpx;
}

.search-switch {
  display: flex;
  padding: 0 16rpx;
  width: 543rpx;
  justify-content: space-between;
}

.search-switch .search-btn {
  width: 426rpx;
  height: 68rpx;
  border-radius: 34rpx;
  background: #f4f4f4;
  padding: 0 20rpx;
  text-align: center;
  font-size: 24rpx;
  color: #c2c2c5;
  line-height: 68rpx;
  display: flex;
  align-items: center;
}

.search-switch .search-btn image {
  width: 28rpx;
  height: 28rpx;
  margin-right: 11rpx;
}

.search-switch .toggle-btn {
  display: flex;
  align-items: center;
}

.search-switch .toggle-btn image {
  width: 38rpx;
  height: 38rpx;
}

.list-box {
  width: 100%;
  height: 70rpx;
  /* padding-top: 10rpx; */
  /* border-top: 1rpx solid #e9e9e9; */
  position: fixed;
  /* top: 80rpx; */
  left: 0;
  background: #fff;
  z-index: 9;
  /* margin-bottom: 20rpx; */
}

.category-menu {
  width: 100%;
  height: 70rpx;
}

.category-list {
  white-space: nowrap;
  width: 100%;
  float: left;
}

.category-list-short {
  width: calc(100% - 100rpx);
}

.category-list .category-item {
  display: inline-block;
  height: 70rpx;
  line-height: 63rpx;
  font-size: 26rpx;
  padding: 0rpx 30rpx;
  color: #8b8b8c;
}

.category-list .category-item view {
  width: 100%;
  height: 63rpx;
}

.category-list .category-item.active view {
  /* color: #009F55;
      border-bottom: 4rpx solid #009F55; */
  color: #009136;
  font-size: 28rpx;
  /* position: relative; */
  border-bottom: 3px solid #009136;
}

.category-list .category-item.active > text {
  position: relative;
  z-index: 9;
}

.category-list .category-item.active::after {
  content: '';
  position: absolute;
  background: #009136;
  height: 7rpx;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 0;
}

.transverse-search {
  width: 100rpx;
  height: 70rpx;
  float: left;
  text-align: center;
}

.transverse-search image {
  width: 50rpx;
  height: 50rpx;
  margin-top: 10rpx;
}

.sort-toggle {
  width: 100%;
  height: 80rpx;
  border-top: 1px solid #f0f0f0;
}

.sort-toggle .sort-btns {
  width: calc(100% - 100rpx);
  height: 80rpx;
  float: left;
}

.sort-toggle .sort-btns .btn {
  margin: 0rpx 30rpx;
  height: 44rpx;
  margin-top: 18rpx;
  float: left;
  line-height: 44rpx;
  font-size: 26rpx;
  display: flex;
  justify-content: flex-start;
}

.sort-btns .btn .sort-tag {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 6rpx;
  height: 42rpx;
}

.sort-tag .sort-ascending {
  display: block;
  width: 0;
  height: 0;
  border: 10rpx solid transparent;
  border-bottom: 10rpx solid #ddd;
}

.sort-tag .sort-descending {
  display: block;
  width: 0;
  height: 0;
  border: 10rpx solid transparent;
  border-top: 10rpx solid #ddd;
}

.sort-toggle .toggle-btn {
  width: 100rpx;
  height: 100%;
  float: left;
  text-align: center;
}

.sort-toggle .toggle-btn image {
  width: 50rpx;
  height: 50rpx;
  margin-top: 15rpx;
}

.show-pro-card {
  background: #fff;
  width: 100%;
}

.show-pro-card {
  padding: 0 40rpx;
  background-color: #e9e9e9;
}

#the-0 {
  margin-top: 100rpx;
}

.goods-content {
  /* padding: 0 40rpx; */
  background: #ffffff;
}

.goods-content:last-of-type {
  padding-bottom: 98rpx;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 240rpx;
  height: 100rpx;
  text-align: center;
  font-size: 10rpx;
}

.spinner > view {
  background-color: #009f55;
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
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
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
    -webkit-transform: scaleY(0.4);
  }

  20% {
    -webkit-transform: scaleY(1);
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
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}

.popup-content {
  /* height: 264rpx; */
}

.popup-content-box {
  font-size: 34rpx;
  line-height: 50rpx;
  color: #444444;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 80rpx;
}

.popup-content-box image {
  width: 255rpx;
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
  background: #f7f7f7;
  /* background: #ffffff; */
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  /* position: unset; */
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: #f7f7f7;
  /* background: #ffffff; */
}

.category-box {
  position: relative;
  background-color: #fff;
  padding: 6rpx 0 14rpx 20rpx;
  box-sizing: border-box;
  height: 146rpx;
  display: flex;
}

.category-box-list {
  height: 100%;
  /* padding-bottom: 14rpx; */
}
.category-box scroll-view ::-webkit-scrollbar {
  width: 0;
}
.category-box-list2 {
  padding: 0 29rpx;
  box-sizing: border-box;
}

.category-box-list .category-item-name {
  width: 126rpx;
  height: 38rpx;
  font-weight: 400;
  font-size: 24rpx;
  text-align: center;
  line-height: 40rpx;
  border-radius: 19rpx;
  /* margin-top: 9rpx; */
  margin: 9rpx auto 0;
  padding: 0 12rpx;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.category-box-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  display: inline-block;
  /* height: 104rpx; */
  width: auto;
  border-radius: 20rpx;
  margin-right: 20rpx;
  overflow: hidden;
}

.category-box-item-from {
  display: inline-block;
  /* width: 100%; */
  /* display: flex; */
  /* flex-direction: column; */
  /* align-items: center; */
  /* justify-content: center; */
  /* display: inline-block; */
  /* height: 104rpx; */
  /* width: auto; */
  border-radius: 20rpx;
  overflow: hidden;
}

.category-box-item-from image {
  display: block;
  height: 100%;
}

.category-box-item .category-box-item-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  display: inline-block;
  /* height: 104rpx; */
  width: auto;
  border-radius: 20rpx;
  margin-right: 20rpx;
  overflow: hidden;
}
/* .category-box-item view {
  font-size: 20rpx;
  color: #333333;
} */

.category-box-item image {
  width: auto;
  height: 90rpx;
}

.category-box-item .not-image {
  /* width: 100rpx;
  height: 100rpx; */
  width: 90rpx;
  height: 90rpx;
  background: #f4f4f4;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 10rpx; */
}
.category-box-item .not-image2 {
  width: 100rpx;
  height: 100rpx;
  background: #f4f4f4;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.category-box-item .not-image image {
  width: 62rpx;
  height: 38rpx;
}

.category-all-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.category-all-box view {
  text-align: center;
  font-weight: 400;
  font-size: 20rpx;
  color: #333333;
  max-width: 60rpx;
}

.category-all-box image {
  width: 16rpx;
  margin-top: 14rpx;
}

.address {
  display: flex;
  /* padding: 0 6px; */
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  font-size: 12px;
  width: 158rpx;
  height: 100%;
}
.address text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.address image {
  margin-right: 6rpx;
  flex: 0 0 auto;
}

.all-category {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background-color: #fff;
  height: 1400rpx;
  z-index: 3;
  display: flex;
  flex-direction: column;
}

.category-box-bg {
  flex: 1;

  background-color: rgba(0, 0, 0, 0.5);
}

.all-category .all-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  padding: 0 29rpx;
  box-sizing: border-box;
}

.all-title-close {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.all-title image {
  width: 28rpx;
}

.category-box-list-all {
  width: 100%;
  /* padding: 0 29rpx; */
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 37rpx;
  /* padding-bottom: 14rpx; */
}

.category-box-list-all .category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin-right: 25rpx; */
  margin-left: 30rpx;
  margin-top: 27rpx;
}

.category-box-list-all .category-item-name {
  width: 126rpx;
  height: 38rpx;
  font-weight: 400;
  font-size: 24rpx;
  text-align: center;
  line-height: 40rpx;
  border-radius: 19rpx;
  margin-top: 9rpx;
  padding: 0 12rpx;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  /* padding: 8rpx 10rpx; */
}

.category-box-list-all .category-box-item {
  /* width: 100rpx; */
  margin-right: 0;
}

/* .category-box-list-all .category-item:nth-child(5n) {
  margin-right: 0;
} */

.category-box-item2 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
}

.category-box-item2 image {
  display: block;
}

.category-box-item2 .custom-image {
  height: 100%;
}

.category-box-list-showname {
  height: 100%;
}

.category-box-list-showname .category-box-item {
  height: 100%;
}

.category-box-list-showname .category-box-item-from {
  height: 100%;
}

.category-box-list-showname .category-box-item-from image {
  height: 100%;
}
</style>
