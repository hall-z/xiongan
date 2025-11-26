<template>
  <!-- pages/mallModule/goods/packaging/packaging.wxml -->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view>
    <view class="loading-box" :hidden="state.pageShow">
      <loading></loading>
    </view>
    <view class="page-content" :hidden="!state.pageShow">
      <!-- <view class="top-horizontal">以下商品{{labelName}}</view> -->
      <view class="goods-box">
        <view
          class="goods-item-box"
          v-for="(item, index) in state.products"
          :key="id"
          :data-productId="item.productId"
          @click="clickGoodsDetails"
        >
          <view class="goods-img">
            <image :src="item.imageUrl" mode="widthFix"></image>
          </view>
          <view class="goods-info">
            <view class="left">
              <view class="goods-name">{{ item.name }}</view>
              <view class="goods-spec">{{ item.description }}</view>
              <view class="goods-price">
                <view class="now-price">
                  <text>￥</text>
                  {{ filters.filtToFix(item.sellPrice) }}
                </view>
                <view
                  class="old-price"
                  v-if="item.originalPrice !== 0 && item.originalPrice > item.sellPrice"
                >
                  ￥{{ filters.filtToFix(item.originalPrice) }}
                </view>
                <view class="right" v-if="state.activityStatus === 'STARTED'">
                  <view v-if="item.balance > 0 && item.storeStatus === 'ON'">
                    <view :hidden="item.productNum === 0">
                      <view class="cart-control">
                        <view
                          class="reduce-box"
                          :style="
                            'border-color: ' + state.themeColor + ';color: ' + state.themeColor
                          "
                        >
                          <button
                            data-type="reduce"
                            :data-productId="item.productId"
                            @click.stop="handleAddAll"
                          ></button>
                          <!-- <image class="reduce-img" src='{{imagesPath.iconMinus}}'></image> -->
                          -
                        </view>
                        <text class="cart-count">{{ item.productNum }}</text>
                        <view
                          class="add-box"
                          :style="
                            'background-color: ' +
                            state.themeColor +
                            ';border-color: ' +
                            state.themeColor
                          "
                        >
                          <button v-if="!state.hasUserInfo" @click.stop="getUserInfo"></button>
                          <button
                            v-else
                            data-type="add"
                            :data-productId="item.productId"
                            @click.stop="handleAddAll"
                          ></button>
                          <!-- <image class="add-img" src='{{imagesPath.iconNewAdd}}'></image> -->
                          +
                        </view>
                      </view>
                    </view>
                    <view :hidden="item.productNum > 0">
                      <button
                        class="buy-button"
                        :style="'background-color: ' + (state.themeColor || '#FFA34B') + ';'"
                        v-if="!state.hasUserInfo"
                        @click.stop="getUserInfo"
                      >
                        马上抢
                      </button>
                      <button
                        class="buy-button"
                        :style="'background-color: ' + (state.themeColor || '#FFA34B') + ';'"
                        v-else
                        data-type="add"
                        :data-productId="item.productId"
                        @click.stop="handleAddAll"
                      >
                        马上抢
                      </button>
                    </view>
                  </view>
                  <view class="sold-out" v-else-if="item.storeStatus === 'OFF'">已下架</view>
                  <view class="sold-out" v-else>已抢光</view>
                </view>
                <view class="right" v-else-if="state.activityStatus === 'CREATED'">
                  <view class="sold-out">未开始</view>
                </view>
                <view class="right" v-else>
                  <view class="sold-out">已结束</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view
        class="button-box"
        :style="'z-index:' + (state.show.shopCart || state.show.goodsDetails ? '10000' : '0')"
      >
        <view
          :class="
            'button ' +
            (state.storeStatus === 'ON' && state.balance > 0 && state.shopCart.products.length > 0
              ? ''
              : 'disabled')
          "
          v-if="state.activityStatus === 'STARTED'"
        >
          <view class="menu" @click.stop="toggleShopCartPopup" :style="state.theme.mainColor">
            <view class="menu-icon-box">
              <image
                class="menu-icon"
                :src="state.imagesPath.shopping_icon"
                mode="widthFix"
                lazy-load="false"
              ></image>
              <view class="badge" :hidden="state.shopCart.productNum === 0">
                {{ state.shopCart.productNum }}
              </view>
            </view>
            ￥{{ filters.filtToFix(state.shopCart.allPrice) }}
          </view>
          <view
            class="button-text"
            @click="handleCreateOrder"
            :style="
              state.storeStatus === 'ON' && state.balance > 0 && state.shopCart.products.length > 0
                ? 'background-color: ' + state.themeColor + ';border-color:' + state.themeColor
                : 'border-color:#C7C7C7'
            "
          >
            立即下单
          </view>
        </view>
        <view class="button disabled" v-else-if="state.activityStatus === 'CREATED'">
          活动未开始
        </view>
        <view class="button disabled" v-else>活动已结束</view>
      </view>
      <view class="share-canvas-box">
        <canvas class="share-canvas" canvas-id="shareCanvas"></canvas>
      </view>
    </view>
    <popup
      :show="state.show.goodsSpec"
      position="bottom"
      custom-class="bottom"
      @close="toggleGoodsSpecPopup"
    >
      <goods-spec
        type="packaging"
        :specs="state.specs"
        :specDetails="state.specDetails"
        :hasSelected="hasSelected"
        @close="toggleGoodsSpecPopup"
        :goodsImg="goodsImg"
        :price="state.price"
        :productNum="productNum"
        @confirm="confirmSpecs"
      ></goods-spec>
    </popup>
    <popup
      :show="state.show.shopCart"
      position="bottom"
      custom-class="bottom"
      @close="toggleShopCartPopup"
    >
      <view class="shop-cart-main">
        <view class="shop_cart_title">购物车（{{ state.shopCart.productNum }}）</view>
        <view class="popup-close" @click="toggleShopCartPopup">
          <image
            class=""
            :src="state.imagesPath.iconCloseImg"
            mode="widthFix"
            lazy-load="false"
            @error=""
            @load=""
          ></image>
        </view>
        <scroll-view class="goods-main-box" scroll-y="">
          <view class="goods-item-box" v-for="(item, index) in state.shopCart.products" :key="id">
            <view class="goods-img">
              <image :src="item.imageUrl" mode="widthFix"></image>
            </view>
            <view class="goods-info">
              <view class="left">
                <view class="goods-name">{{ item.name }}</view>
                <view class="goods-spec" v-if="item.selectSpecs">{{ item.selectSpecs }}</view>
                <view class="goods-spec" v-else>{{ item.description }}</view>
                <view class="goods-price">
                  <view class="now-price">
                    <text>￥</text>
                    {{ filters.filtToFix(item.sellPrice) }}
                  </view>
                  <view
                    class="old-price"
                    v-if="item.originalPrice !== 0 && item.originalPrice > item.sellPrice"
                  >
                    ￥{{ filters.filtToFix(item.originalPrice) }}
                  </view>
                </view>
              </view>
              <view class="right">
                <view class="cart-control">
                  <view
                    class="reduce-box"
                    :style="'border-color: ' + state.themeColor + ';color: ' + state.themeColor"
                  >
                    <button
                      data-type="reduce"
                      :data-productId="item.productId"
                      @click.stop="handleAdd"
                    ></button>
                    <!-- <image class="reduce-img" src='{{imagesPath.iconMinus}}'></image> -->
                    -
                  </view>
                  <text class="cart-count">{{ item.productNum }}</text>
                  <view
                    class="add-box"
                    :style="
                      'background-color: ' + state.themeColor + ';border-color: ' + state.themeColor
                    "
                  >
                    <button v-if="!state.hasUserInfo" @click.stop="getUserInfo"></button>
                    <button
                      v-else
                      data-type="add"
                      :data-productId="item.productId"
                      @click.stop="handleAdd"
                    ></button>
                    <!-- <image class="add-img" src='{{imagesPath.iconNewAdd}}'></image> -->
                    +
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </popup>
  </view>
</template>
<script setup>
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiPackagingServiceJs from '@/service/api/newretail/packagingService'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import goodsSpec from '@/pages-sub/newretail/components/product/goods-spec/goods-spec.vue'
import loading from '@/pages-sub/newretail/components/loading/loading.vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue'
const app = getApp()

// pages/mallModule/goods/packaging/packaging.js
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const themeManager = _utilsThemeManagerJs
const packagingService = _apiPackagingServiceJs
const productService = _apiProductServiceJs
const storeService = _apiStoreServiceJs
const ANALYSIS = _utilsAnalysisJs
const utilsSelf = _utilsSelfJs
// 获取应用实例
let isInCheckProduct = false
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
const state = reactive({
  productType: '',
  // 商品类型
  freeShipping: false,
  navigationBarTitle: '打包一口价',
  imagesPath: IMGAGESPATH,
  theme: themeManager,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  hasUserInfo: false,
  isMember: false,
  pageShow: false,
  products: [],
  show: {
    middle: false,
    goodsSpec: false,
    shopCart: false,
    goodsDetails: false,
  },
  shopCart: {
    allPrice: 0,
    products: [],
    productNum: 0,
  },
  storeStatus: 'ON',
  balance: 0,
  labelName: '',
  storeId: '',
  distributionStoreId: uni.getStorageSync('distributionStoreId'),
  specs: [],
  specDetails: [],
  price: '0.00',
  activityStatus: 'STARTED',
  sharePicture: '',
})
const customData = {
  timeId: 0,
  storeId: '',
  activityInfo: null,
  parentProductId: '',
}
function initPage(options) {
  const self = this
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    // 统计PV
    state.storeId = app.globalData.storeInfo.id
    ANALYSIS.PVStatistics(state.storeId)
    if (options.packagingId) {
      getPackagingActivity(options.packagingId, app.globalData.storeInfo.id)
    }
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation()
      .then((res) => {
        app.globalData.storeInfo = res
        // 统计PV
        state.storeId = res.id
        ANALYSIS.PVStatistics(res.id)
        if (options.packagingId) {
          getPackagingActivity(options.packagingId, res.id)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
onLoad(function (_options2) {
  const self = this
  if (_options2.scene) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(_options2.scene)
    if (scene.indexOf('gmparam:') >= 0) {
      const sceneArr = scene.split('gmparam:')
      const sceneId = sceneArr[1]
      wxaUserService.getSceneById(sceneId).then((res) => {
        const shareArr = res.split('shareId=')
        const shareId = shareArr[1]
        uni.setStorageSync('wj_sharingId', shareId)
        console.log(shareId, '分享人id')
        function urlToObj(str) {
          const obj = {}
          const arr = str.split('&')
          for (let i = 0; i < arr.length; i++) {
            const ele = arr[i].split('=')
            obj[ele[0]] = ele[1]
          }
          return obj
        }
        const _options = urlToObj(res)
        _options2 = _options
        initPage(_options)
      })
    }
  }
  state.theme = {
    color:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background:' + app.globalData.uiconfig.themeColor + ';'
        : 'background:' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient:
      app.globalData.uiconfig &&
      app.globalData.uiconfig.themeColor != null &&
      app.globalData.uiconfig.themeColor !== '#FF9F43'
        ? 'background: linear-gradient(-270deg, ' +
          app.globalData.uiconfig.themeColor +
          ', ' +
          app.globalData.uiconfig.themeColor +
          ');'
        : 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
    mainColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'border-color:rgba(255,159,67, 0.4);',
    mainColorRgb02:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
        : 'rgba(255,159,67, 0.2)',
    BgColorRgb01:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
        : 'background-color:rgba(255,159,67, 0.1);',
  }
  state.themeColor = app.globalData.uiconfig.themeColor
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  initPage(_options2)
})
onReady(function () {})
onShow(function () {
  uni.setStorageSync('wj_shopcart', '')
  checkAuth()
  isInCheckProduct = false
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {
  if (inOnPullDownRefresh) {
    return
  }
  inOnPullDownRefresh = true
  getPackagingActivity(options.packagingId, app.globalData.storeInfo.id)
})
onReachBottom(function () {})
onShareAppMessage(function () {
  const that = this
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  const title = state.labelName
  const pages = getCurrentPages() // 获取加载的页面
  const currentPage = pages[pages.length - 1] // 获取当前页面的对象
  const url = currentPage.route // 当前页面url
  const options = currentPage.options // 如果要获取url中所带的参数可以查看options
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id
    let path = url + '?shareId=' + memberId
    path = path + '&storeId=' + state.storeId
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const ele = options[key]
        if (key !== 'mobile') {
          path = path + '&' + key + '=' + ele
        }
      }
    }
    return {
      title,
      path,
      imageUrl: state.sharePicture,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  } else {
    let path = url + '?storeId=' + state.storeId
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const ele = options[key]
        if (key !== 'mobile') {
          path = path + '&' + key + '=' + ele
        }
      }
    }
    return {
      title: '',
      path,
      imageUrl: state.sharePicture.replace('http://', 'https://'),
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  }
})
function checkAuth() {
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member
      state.isMember = true
    }
    state.hasUserInfo = true
  }
}
function getPackagingActivity(activityId, storeId) {
  const that = this
  let isDistribution = false
  const oldStoreId = storeId
  packagingService
    .get(activityId, storeId)
    .then((res) => {
      console.log(res)
      customData.activityInfo = res
      state.labelName = res.labelName
      state.activityStatus = res.status
      state.sharePicture = res.sharePicture
      state.quantity = res.quantity
      state.freeShipping = res.freeShipping
      if (res.productType === 'DISTRIBUTION') {
        isDistribution = true
      }
      if (isDistribution) {
        if (app.globalData.distributionStore) {
          return app.globalData.distributionStore
        } else {
          return storeService.getDistributionStore()
        }
      } else {
        return res
      }
    })
    .then((res) => {
      if (isDistribution) {
        if (res) {
          storeId = res.id
          state.distributionStoreId = storeId
          if (oldStoreId !== storeId) {
            return packagingService.get(activityId, storeId)
          } else {
            return customData.activityInfo
          }
        }
      } else {
        return res
      }
    })
    .then((res) => {
      const tempList = []
      let balance = 0
      let storeStatus = 'OFF'
      if (res && res.products) {
        res.products.forEach((ele) => {
          if (storeStatus === 'OFF' && ele.storeStatus === 'ON') {
            storeStatus = 'ON'
          }
          if (balance === 0 && ele.balance > 0) {
            balance = ele.balance
          }
          if (ele.storeStatus && ele.storeStatus === 'ON') {
            tempList.push({
              ...ele,
              productNum: 0,
            })
          }
        })
      }
      const newTempList = productsSort(tempList)

      //   newTempList.forEach(arr=>{

      //     utilsSelf.getTemporaryUrl(arr.imageUrl)
      //     .then (res=>{
      //         arr.imageUrl = res
      //         that.setData({
      //             pageShow: true,
      //             products: newTempList,
      //             balance: balance,
      //             storeStatus: storeStatus
      //           })
      //     })

      //   })
      // 获取商品类型
      state.pageShow = true
      state.products = newTempList
      state.balance = balance
      state.storeStatus = storeStatus
      if (res && res.productType) {
        state.productType = res.productType
      }
      if (inOnPullDownRefresh) {
        inOnPullDownRefresh = false
        uni.stopPullDownRefresh()
      }
    })
    .catch((err) => {
      if (inOnPullDownRefresh) {
        inOnPullDownRefresh = false
        uni.stopPullDownRefresh()
      }
      util.showToast(err.message)
    })
}
function getUserInfo(e) {
  AUTHORIZE.login(e)
    .then((res) => {
      state.hasUserInfo = true
      state.userInfo = res.wxaUser
      if (res.member) {
        state.isMember = true
        state.member = res.member
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
function productsSort(array) {
  const balanceArray = []
  const allArray = []
  array.forEach((ele) => {
    if (ele.style !== 'SPEC_PARENT' && ele.style !== 'SPEC_CHILD' && ele.balance === 0) {
      balanceArray.push(ele)
    } else {
      allArray.push(ele)
    }
  })
  const tempArray = allArray.concat(balanceArray)
  return tempArray
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function toggleShopCartPopup() {
  if (state.show.goodsDetails) {
    toggle('goodsDetails')
  }
  toggle('shopCart')
}
function handleAddAll(e) {
  const self = this
  const type = e.currentTarget.dataset.type
  const productId = e.currentTarget.dataset.productid
  let index = null
  let currentItem = null
  const products = state.products
  console.log(state.shopCart.productNum, '当前购买数量')
  for (let i = 0; i < products.length; i++) {
    const item = products[i]
    if (item.productId === productId) {
      index = i
      currentItem = item
      break
    }
  }
  if (currentItem.style === 'SPEC_PARENT' || currentItem.style === 'SPEC_CHILD') {
    // 多规格商品弹出弹窗
    // if (currentItem.productNum > 0) {
    // } else {
    // }

    //   console.log(active,'active')
    if (type === 'add') {
      // if(active){
      //     return
      // }
      if (state.shopCart.productNum >= state.quantity) {
        uni.showToast({
          title: '当前购买数量已达上限',
          icon: 'none',
        })
        return
      }
      openGoodsSpecs(e)
    } else {
      toggleShopCartPopup()
    }
    if (state.show.goodsDetails) {
      state.show.goodsDetails = false
    }
  } else {
    // if(active){
    //     return
    // }
    handleAdd(e)
  }
}
function handleAdd(e) {
  if (isInCheckProduct) {
    uni.showToast({
      title: '当前购买数量已达上限',
      icon: 'none',
    })
    //   console.log("在检查是否可以加入购物车")
    //   return
  }
  isInCheckProduct = true
  const self = this
  const type = e.currentTarget.dataset.type
  const productId = e.currentTarget.dataset.productid
  let index = null
  let currentItem = null
  const products = state.products
  for (let i = 0; i < products.length; i++) {
    const item = products[i]
    if (item.productId === productId) {
      index = i
      currentItem = item
      break
    }
  }
  console.log(currentItem)
  // 如果活动商品中没有该商品，可能是多规格商品
  if (!currentItem || currentItem.style === 'SPEC_PARENT' || currentItem.style === 'SPEC_CHILD') {
    const goodsList = state.shopCart.products
    for (let i = 0; i < goodsList.length; i++) {
      const item = goodsList[i]
      if (item.productId === productId) {
        index = i
        currentItem = item
        break
      }
    }
  }
  console.log(currentItem)
  let productNum = currentItem.productNum
  if (type === 'add') {
    if (state.shopCart.productNum >= state.quantity) {
      return
    }
    if (currentItem.style === 'SPEC_PARENT' || currentItem.style === 'SPEC_CHILD') {
      productNum++
      if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
        isInCheckProduct = false
        NAVPAGE.toAuthorize()
        return
      }
      isInCheckProduct = false
      addShopCart(productId, 1)
      // self.setData({
      //   [`products[${index}].productNum`]: productNum,
      // })
    } else {
      if (productNum >= currentItem.balance) {
        console.log(currentItem)
        const text = '当前规格门店仅剩' + currentItem.balance + '件~'
        isInCheckProduct = false
        util.showToast(text)
      } else {
        productNum++
        if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
          isInCheckProduct = false
          NAVPAGE.toAuthorize()
          return
        }
        isInCheckProduct = false
        addShopCart(productId, 1)
        state[`products[${index}].productNum`] = productNum
      }
    }
  } else {
    isInCheckProduct = false
    if (productNum > 0) {
      productNum--
      removeShopCart(productId, -1)
      state[`products[${index}].productNum`] = productNum
      if (productNum === 0) {
        state[`products[${index}].selectSpecs`] = ''
      }
    }
  }
}
function checkProductStoreStatus() {
  const that = this
  let isCheck = true
  const productNameArr = []
  const products = state.shopCart.products
  for (let i = 0; i < products.length; i++) {
    const ele = products[i]
    if (ele.storeStatus !== 'ON') {
      isCheck = false
      break
    }
  }
  if (!isCheck) {
    products.forEach((ele) => {
      if (ele.storeStatus !== 'ON') {
        productNameArr.push(ele.productName)
      }
    })
    const productName = productNameArr.join(',')
    util.showToast('商品' + productName + '门店未上架~')
  }
  return isCheck
}
function checkShopCart() {
  const that = this
  let isCheck = true
  const products = state.shopCart.products
  if (products.length > 0) {
    isCheck = true
  } else {
    isCheck = false
  }
  return isCheck
}
function updateShopCart(productId, count) {
  // 更新购物车中商品数量
  const that = this
  // 检查购物车中是否有商品
  let currentItem = null
  let index = null
  const products = state.shopCart.products
  for (let i = 0; i < products.length; i++) {
    const ele = products[i]
    if (ele.productId === productId) {
      index = i
      currentItem = ele
      break
    }
  }
  if (currentItem) {
    let productNum = currentItem.productNum
    productNum = productNum + count
    currentItem.productNum = productNum
    products[index] = currentItem
    handleSyncShopCart(products)
  }
}
function addShopCart(productId, count) {
  const that = this
  // 检查购物车中是否有商品
  let isHas = false
  let index = null
  const products = state.shopCart.products
  for (let i = 0; i < products.length; i++) {
    const ele = products[i]
    if (ele.productId === productId) {
      index = i
      isHas = true
      break
    }
  }
  if (isHas) {
    // 更新购物车
    updateShopCart(productId, count)
  } else {
    // 加入购物车
    const currentItem = getProductItemById(productId)
    products.push({
      ...currentItem,
      productNum: 1,
    })
    handleSyncShopCart(products)
  }
}
function removeShopCart(productId, count) {
  const that = this
  // 检查购物车中是否有商品
  let currentItem = null
  let index = null
  const products = state.shopCart.products
  for (let i = 0; i < products.length; i++) {
    const ele = products[i]
    if (ele.productId === productId) {
      index = i
      currentItem = ele
      break
    }
  }
  if (currentItem) {
    let productNum = currentItem.productNum
    productNum = productNum + count
    if (productNum <= 0) {
      products.splice(index, 1)
    } else {
      currentItem.productNum = productNum
      products[index] = currentItem
    }
    handleSyncShopCart(products)
  }
}
function getProductItemById(productId) {
  const that = this
  let currentItem = null
  for (let i = 0; i < state.products.length; i++) {
    const ele = state.products[i]
    if (ele.productId === productId) {
      currentItem = ele
      break
    }
  }
  return currentItem
}
function handleSyncShopCart(products) {
  const that = this
  const shopCart = {
    allPrice: 0,
    products: [],
    productNum: 0,
  }
  const activityProducts = state.products
  if (products.length > 0) {
    let allPrice = 0
    let productNum = 0
    products.forEach((item) => {
      productNum = productNum + item.productNum
      allPrice = allPrice + item.sellPrice * item.productNum
    })
    console.log(products)
    productNum = parseInt(productNum)
    allPrice = parseFloat(allPrice.toFixed(2))
    shopCart.allPrice = allPrice
    shopCart.productNum = productNum
    shopCart.products = products
    activityProducts.forEach((item) => {
      let productNum = 0
      for (let i = 0; i < products.length; i++) {
        const ele = products[i]
        if (item.style !== 'SPEC_PARENT' && item.style !== 'SPEC_CHILD') {
          if (item.productId === ele.productId) {
            productNum = ele.productNum
            break
          }
        } else {
          if (ele.parentProductId != null && item.productId === ele.parentProductId) {
            productNum = productNum + parseInt(ele.productNum)
          }
        }
      }
      item.productNum = parseInt(productNum)
    })
  } else {
    activityProducts.forEach((item) => {
      item.productNum = 0
      item.selectSpecs = ''
    })
  }
  calcShopping(shopCart, activityProducts)
}
function clearShopCart() {
  const products = state.products
  products.forEach((ele) => {
    ele.productNum = 0
    ele.selectSpecs = ''
  })
  state.products = products
  handleSyncShopCart([])
}
function handleCreateOrder() {
  const self = this
  if (!checkShopCart()) {
    util.showToast('请先选择商品~')
    return
  }
  if (!checkProductStoreStatus()) {
    return
  }
  try {
    const shopCartData = state.shopCart
    const productNum = state.shopCart.productNum
    const tempList = []
    shopCartData.products.forEach((item) => {
      const tempItem = {
        ...item,
        sellPrice: parseFloat(item.sellPrice).toFixed(2),
        name: item.name,
        labelName: state.labelName,
        business: state.productType,
      }
      tempList.push(tempItem)
    })
    const shopCart = {
      allPrice: parseFloat(shopCartData.allPrice).toFixed(2),
      goodsList: tempList,
      orderType: 'packaging',
      // 统配门店商品传统配门店id
      storeId: state.productType === 'DISTRIBUTION' ? state.distributionStoreId : state.storeId,
      scource: 'BUYNOW',
      packagingId: options.packagingId,
      freeShipping: state.freeShipping,
    }
    uni.setStorageSync('wj_shopcart', shopCart)
    NAVPAGE.toPerfectOrder()
    setTimeout(() => {
      state.show.shopCart = false
      clearShopCart()
    }, 200)
  } catch (error) {
    console.log(error)
  }
}
function toggleGoodsSpecPopup() {
  toggle('goodsSpec')
}
function getGoodsSpec(productId, storeId) {
  const self = this
  console.log('查询多规格详情')
  productService
    .getSpecDetails(productId, storeId)
    .then((res) => {
      if (res) {
        handleSpecData(res, productId)
      }
    })
    .catch((err) => {
      console.log('查询商品规格：' + err.message)
    })
}
function handleSpecData(res, productId) {
  const self = this
  if (res) {
    const specDetails = JSON.parse(res.specDetailsJson)
    console.log(specDetails)
    parentProductId = productId
    state.specs = res.specs
    state.specDetails = specDetails
    const currentProduct = getProductItemById(productId)
    state.goodsImg = currentProduct.imageUrl
    state.price = currentProduct.sellPrice
    toggleGoodsSpecPopup()
  }
}
function openGoodsSpecs(e) {
  const self = this
  const productId = e.currentTarget.dataset.productid
  const currentItem = getProductItemById(productId)
  const storeId = state.distributionStoreId !== '' ? state.distributionStoreId : state.storeId
  if (currentItem.style === 'SPEC_PARENT') {
    getGoodsSpec(productId, storeId)
  }
}
function confirmSpecs(e) {
  const self = this
  if (!(e.detail.status && e.detail.status === 'ON')) {
    util.showToast('商品门店未上架~')
    return
  }
  // 关闭弹窗
  toggleGoodsSpecPopup()
  specs = e.detail
  let productNum = 1
  console.log(e.detail)
  const productId = e.detail.productId
  const _parentProductId = parentProductId
  const currentItem = getProductItemById(_parentProductId)
  let selectSpecs = e.detail.selectText.replace('已选：', '')
  selectSpecs = selectSpecs.replace('"', '')
  selectSpecs = selectSpecs.substr(0, selectSpecs.length - 1)
  const selectSpecsArr = selectSpecs.split(' ')
  const name = currentItem.name + 'x' + selectSpecsArr.join('x')
  const currentProduct = JSON.parse(JSON.stringify(currentItem))
  currentProduct.productNum = 1
  currentProduct.name = name
  currentProduct.sellPrice = parseFloat(e.detail.sellPrice)
  currentProduct.selectSpecs = selectSpecs
  currentProduct.parentProductId = _parentProductId
  currentProduct.id = e.detail.productId
  currentProduct.productId = e.detail.productId
  currentProduct.balance = e.detail.balance
  currentProduct.style = 'SPEC_CHILD'

  /* 处理加入购物车逻辑 */
  const products = state.shopCart.products
  // 检查购物车中是否有商品
  let isHas = false
  let index = null
  for (let i = 0; i < products.length; i++) {
    const ele = products[i]
    if (ele.productId === productId) {
      index = i
      isHas = true
      break
    }
  }
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    NAVPAGE.toAuthorize()
    return
  }
  if (isHas) {
    productNum = products[index].productNum
    // 检查是否可以加入购物车
    if (checkCanAddShopCart(currentProduct, productNum)) {
      // 更新购物车
      updateShopCart(productId, 1)
    }
  } else {
    // 加入购物车
    products.push({
      ...currentProduct,
      productNum: 1,
    })
    handleSyncShopCart(products)
  }
}
function checkCanAddShopCart(currentProduct, productNum) {
  let isCheck = false
  if (productNum >= currentProduct.balance) {
    const text = '当前规格门店仅剩' + currentProduct.balance + '件~'
    util.showToast(text)
  } else {
    isCheck = true
  }
  return isCheck
}
function calcShopping(shopCart, activityProducts) {
  const that = this
  const products = []
  if (shopCart.products.length > 0) {
    shopCart.products.forEach((ele) => {
      products.push({
        productId: ele.productId,
        quantity: ele.productNum,
        sellPrice: ele.sellPrice,
      })
    })
  }
  const price = customData.activityInfo.price
  const split = customData.activityInfo.quantity
  // const postData = {
  //   price: price,
  //   products: products,
  //   split: split
  // }
  packagingService
    .calcShopping(price, products, split)
    .then((res) => {
      shopCart.allPrice = res
      state.shopCart = shopCart
      state.products = activityProducts
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
</script>
<style scoped>
/* pages/mallModule/goods/packaging/packaging.wxss */
/* @import "../../../../common/common.wxss"; */

page {
  position: relative;
  background: #ffffff;
}

.loading-box {
  padding-top: 180rpx;
  background: #ffffff;
}

.top-horizontal {
  width: 100%;
  height: 90rpx;
  background: #fff7ec;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #454545;
}

/* 商品信息 */

.goods-box {
  width: 100%;
  box-sizing: border-box;
  padding: 22rpx 21rpx 120rpx 19rpx;
}

.goods-item-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 21rpx 20rpx;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}

.goods-item-box .goods-img {
  width: 256rpx;
  height: 256rpx;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.goods-item-box .goods-img image {
  width: 100%;
  height: 100%;
  background-color: #eee;
}

.goods-item-box .goods-info {
  color: #454545;
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-left: 20rpx;
  height: 256rpx;
  flex: 1;
}

.goods-item-box .left {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.goods-item-box .goods-name {
  font-size: 30rpx;
  line-height: 38rpx;
  font-weight: 500;
  width: 380rpx;
  font-weight: bold;
}

.goods-item-box .goods-desc {
  font-size: 20rpx;
  line-height: 26rpx;
  font-weight: 300;
  margin-bottom: 10rpx;
  height: 26rpx;
  width: 380rpx;
}

/* .goods-item-box .goods-name, */
.goods-item-box .goods-desc,
.goods-item-box .goods-spec {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-item-box .goods-name {
  /* display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-item-box .goods-spec {
  font-size: 20rpx;
  font-weight: 400;
  height: 21rpx;
  line-height: 21rpx;
  /* width: 284rpx; */
  margin-top: 17rpx;
  color: #999999;
  width: 400rpx;
  white-space: normal;
  overflow: auto;
  flex: 1;
}

.goods-item-box .goods-price {
  /* margin-top: 50rpx; */
  display: flex;
  align-items: flex-end;
  /* margin-bottom: 8rpx; */
  flex: 1;
}

.goods-item-box .now-price {
  font-size: 43rpx;
  line-height: 36rpx;
  color: #ff8425;
  font-weight: 700;
}
.goods-item-box .now-price text {
  font-size: 25rpx;
}

.goods-item-box .old-price {
  font-size: 20rpx;
  color: #8b8b8c;
  margin-left: 14rpx;
  text-decoration: line-through;
  font-weight: 400;
}

.goods-item-box .right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.goods-item-box .right .num {
  font-size: 30rpx;
  line-height: 38rpx;
  height: 38rpx;
  color: #ea534a;
  text-align: right;
}

.goods-item-box .right .button {
  font-size: 30rpx;
  width: 140rpx;
  height: 60rpx;
  line-height: 60rpx;
  border-radius: 6rpx;
  border: 1px solid;
  text-align: center;
  margin-top: 84rpx;
}

.goods-item-box .buy-button {
  width: 158rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 30rpx;
  background: #ffa34b;
  font-size: 28rpx;
  color: #ffffff;
  margin-top: 104rpx;
}

.goods-item-box .sold-out {
  width: 140rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  background: #eeeeee;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #999999;
  margin-top: 104rpx;
}

.goods-item-box .cart-control {
  width: 154rpx;
  height: 70rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 70rpx;
  text-align: center;
  position: absolute;
  right: 0rpx;
  bottom: -8rpx;
}

.goods-item-box .cart-control .add-box,
.goods-item-box .cart-control .reduce-box {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  padding: 0;
  border: 1rpx solid #ff8425;
  display: flex;
  justify-content: center;
  line-height: 34rpx;
  font-size: 38rpx;
  color: #ff8425;
}

.goods-item-box .cart-control .add-box {
  position: absolute;
  right: 0;
  color: #fff;
  background-color: #ff8425;
}

.goods-item-box .cart-control .reduce-box {
  position: absolute;
  left: 0;
}

.goods-item-box .cart-control .add-box button,
.goods-item-box .cart-control .reduce-box button {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
}

.goods-item-box .add-img,
.goods-item-box .reduce-img {
  width: 44rpx;
  height: 44rpx;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -22rpx;
  margin-left: -22rpx;
}

.goods-item-box .cart-control .cart-count {
  font-size: 28rpx;
  color: #454545;
  height: 100%;
}

button.button-hover {
  color: transparent;
  background-color: transparent;
  border: none;
}

button::after {
  border: 0;
}

/* 弹窗中商品样式 */

.goods-main-box .goods-item-box,
.goods-details-main .goods-item-box {
  width: 665rpx;
  margin: 0 auto;
}

.goods-main-box .goods-item-box .goods-img,
.goods-details-main .goods-item-box .goods-img {
  width: 164rpx;
  height: 164rpx;
  border-radius: 0;
}

.goods-main-box .goods-item-box .goods-info,
.goods-details-main .goods-item-box .goods-info {
  width: 465rpx;
  margin-left: 18rpx;
  min-height: 164rpx;
}

.goods-main-box .goods-item-box .goods-name,
.goods-details-main .goods-item-box .goods-name {
  /* width: 453rpx; */
}

.goods-main-box .goods-item-box .right,
.goods-details-main .goods-item-box .right {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 180rpx;
  height: 170rpx;
  padding-bottom: 14rpx;
  display: flex;
  align-items: flex-end;
}

.goods-main-box .goods-item-box .cart-control,
.goods-details-main .goods-item-box .cart-control {
  margin-top: 0;
}

/* 我要接龙 */
.button-box {
  position: fixed;
  bottom: 0;
  padding-bottom: 30rpx;
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 0;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.button-box .menu {
  min-width: 170rpx;
  /* padding: 0 43rpx 0 48rpx; */
  height: 100%;
  flex-shrink: 0;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff8425;
  font-size: 26rpx;
  position: relative;
  font-weight: 700;
}

.button-box .badge {
  position: absolute;
  min-width: 10rpx;
  padding: 0 8rpx;
  height: 26rpx;
  border-radius: 15rpx;
  background: #fa0104;
  color: #ffffff;
  font-size: 20rpx;
  line-height: 26rpx;
  text-align: center;
  top: -50%;
  right: -50%;
}

.menu-icon-box {
  width: 43rpx;
  height: 37rpx;
  margin-right: 32rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-box .menu .menu-icon {
  width: 43rpx;
  height: 37rpx;
}

.button-box .button-text {
  display: flex;
  width: 390rpx;
  justify-content: center;
  align-items: center;
  height: 74rpx;
  border-radius: 37rpx;
  background: #ccc;
  font-size: 30rpx;
}

.share-reamin {
  width: 172rpx;
  height: 108rpx;
  line-height: 172rpx;
  overflow: hidden;
  font-size: 28rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ee503b;
  font-weight: 500;
}

.share-reamin image {
  width: 37rpx;
  height: 34rpx;
  margin-right: 8rpx;
}

.button-box button {
  background: #ffffff;
  border: 0;
}

.button-box view.button {
  width: 100%;
  height: 100rpx;
  /* background: #FFA34B; */
  /* border: 2rpx solid; */
  /* border-radius: 53rpx; */
  font-size: 30rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #ffffff;
  margin: 0 auto;
  display: flex;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0 18rpx 0 30rpx;
  justify-content: space-between;
}

.button-box view.disabled {
  box-shadow: none;
}

/* 弹窗 */

.popup-succes .tips {
  font-size: 22rpx;
  line-height: 36rpx;
  color: #626262;
  text-align: center;
}

.share {
  margin-top: 18rpx;
  width: 502rpx;
  height: 100rpx;
  font-size: 32rpx;
  line-height: 100rpx;
  color: #ffffff;
  background-color: #ffa34b;
}

.widget {
  position: absolute;
  left: 10000px;
  top: 0;
}
page {
  background-color: #f1f3f6;
}
.page-content {
  position: relative;
  width: 750rpx;
  overflow-x: hidden;
}

.share-canvas-box {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 10000px;
  top: 0;
}

.share-canvas {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 10000px;
  top: 0;
}

/* 购物车弹窗 */
.shop-cart-main {
  padding: 45rpx 0 238rpx 0;
  border-radius: 26rpx 26rpx 0px 0px;
  width: 100%;
  min-height: 368rpx;
  background: #ffffff;
  position: relative;
}
.popup-close {
  position: absolute;
  height: 84rpx;
  width: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

.popup-close image {
  width: 42rpx;
  height: 42rpx;
}

.goods-main-box {
  padding-top: 40rpx;
  min-height: 262rpx;
  max-height: 652rpx;
}

/* 商品详情 */
.goods-details-main {
  padding: 45rpx 0 160rpx 0;
  border-radius: 26rpx 26rpx 0px 0px;
  width: 100%;
  min-height: 368rpx;
  background: #ffffff;
  position: relative;
}

.goods-imgtext {
  background-color: #fff;
  min-height: 262rpx;
  max-height: 652rpx;
}

.goods-imgtext > text {
  display: block;
  text-indent: 40rpx;
  font-size: 36rpx;
  height: 90rpx;
  line-height: 90rpx;
}

.goods-imgtext image {
  width: 100%;
  display: block;
}

/* 分享 */
.poster-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0rpx;
  left: 0rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 32rpx;
  overflow-y: scroll;
}

.poster-box-main {
  width: 100%;
  height: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.poster-picture-box {
  width: 562rpx;
  height: 780rpx;
  margin: 0 auto;
  margin-bottom: 32rpx;
}

.poster-picture-box canvas {
  width: 562rpx;
  height: 780rpx;
  margin: 0 auto;
  border-radius: 10rpx;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

.poster-box .saveImage {
  width: 562rpx;
  height: 100rpx;
  background: #80bd01;
  color: #fff;
  font-size: 32rpx;
  line-height: 100rpx;
  text-align: center;
  margin: 0 auto;
  border-radius: 10rpx;
}

.poster-box .saveImageTips {
  font-size: 28rpx;
  color: #ffffff;
  margin-top: 20rpx;
}

.shop-cart-main .goods-item-box {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
}
.goods-main-box .goods-item-box .goods-info {
  height: 164rpx;
}
.goods-main-box .goods-item-box .now-price {
  font-size: 30rpx;
  font-weight: 700;
}
.goods-main-box .goods-item-box .now-price text {
  font-size: 20rpx;
}
.goods-main-box .goods-item-box .goods-name {
  font-size: 24rpx;
}
/* .goods-main-box .goods-item-box .cart-control .reduce-box,
.goods-main-box .goods-item-box .cart-control .add-box {
  width: 40rpx;
  height: 40rpx;
} */
.goods-main-box .goods-item-box .cart-control .reduce-img,
.goods-main-box .goods-item-box .cart-control .add-img {
  width: 40rpx;
  height: 40rpx;
}
.goods-main-box .goods-item-box .cart-control {
  height: 60rpx;
  line-height: 55rpx;
}
.goods-main-box .goods-item-box .goods-spec {
  margin-top: 10rpx;
  font-size: 18rpx;
}
.goods-main-box .goods-item-box {
  border-top: 1px solid #eeeeee;
  padding: 20rpx 30rpx;
}
.shop_cart_title {
  position: absolute;
  left: 30rpx;
  top: 25rpx;
  font-size: 24rpx;
}
</style>
