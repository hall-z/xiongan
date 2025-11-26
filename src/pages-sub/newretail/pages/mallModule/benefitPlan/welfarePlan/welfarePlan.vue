<template>
  <!-- pages/search/search.wxml -->
  <!--  -->
  <view>
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <view class="top-info container" :style="'top: ' + navHeight + 'px'">
      <image class="logo-img" mode="widthFix" :src="state.imagesPath.search_logo"></image>
      <!-- <view class="location" bindtap="changeStore">
  <image class="shop-img" src="{{state.imagesPath.search_logo}}" ></image>
  <text>{{storeInfo.name}}</text>
  <image class="right-img" src="{{state.imagesPath.iconIndexStoreRight}}" ></image>
</view> -->
      <view class="topHandleView" @click="handleConfirm">
        <view>请输入关键词搜索...</view>
        <image style="width: 40rpx; height: 40rpx" :src="state.imagesPath.iconSearch"></image>
      </view>
    </view>
    <scroll-view
      class="goods-box"
      scroll-y=""
      :scroll-top="state.scrollTop"
      @scrolltolower="handleScrolltolower"
      scroll-with-animation=""
    >
      <image :src="state.imagesPath.welfarePlanTop" class="top_img" mode="widthFix"></image>
      <!-- <view wx:for="{{state.productTypeList}}" wx:for-item="productType">
    <view class="type-title">
      <image src="{{state.imagesPath.welfarePlanTitleLeft}}" mode="widthFix"></image>
      {{productType.name}}
      <image src="{{state.imagesPath.welfarePlanTitleRight}}" mode="widthFix"></image>
    </view>
  </view> -->
      <!-- scroll-into-view="type{{scrollIndex}}"  -->
      <scroll-view
        enable-passive=""
        scroll-x=""
        @scrolltoupper="scrollLeft"
        @scrolltolower="scrollRight"
        @scroll="scrollMenu"
        @dragend="scrollMenu"
        enable-flex=""
        :show-scrollbar="false"
        enhanced=""
        class="menu_box menu_list"
        :style="
          'justify-content: ' +
          (state.productTypeList && state.productTypeList.length > 4 ? 'flex-start' : 'center')
        "
      >
        <!-- <view class="menu_list" style="justify-content: {{productTypeList && productTypeList.length > 4 ? 'flex-start' : 'center'}}"> -->
        <view
          :id="'type' + index"
          :class="'type-title ' + (index === state.acitveIndex ? 'active' : '')"
          v-for="(productType, index) in state.productTypeList"
          @click.stop="changeIndex"
          :data-idx="index"
          :data-id="productType.id"
        >
          {{ productType.name }}
        </view>
        <!-- </view> -->
      </scroll-view>
      <view class="scroll-box" v-if="state.productTypeList && state.productTypeList.length > 4">
        <view class="scroll-bar" :style="'left: ' + state.scrollRatio + '%'"></view>
      </view>
      <view class="no_data" v-if="!state.productTypeList || state.productTypeList.length === 0">
        您所在工会目前尚未创建福利计划
      </view>
      <view class="goods-list">
        <!-- productTypeList[acitveIndex].productList -->
        <view
          class="goods-item"
          v-for="(item, index) in goodList"
          :key="index"
          :data-productId="item.id"
          :id="'products-' + item.id"
          @click="toGoodsDetail"
        >
          <view class="goods-img-box">
            <image :src="item.imageUrl" mode="aspectFit"></image>
            <image
              class="no-balance"
              :src="state.imagesPath.soldOutIcon"
              v-if="item.balance <= 0"
            ></image>
          </view>
          <view class="goods-info">
            <view class="goods-name">
              <!-- <text wx:for="{{item.produtlabel}}" wx:key="index" wx:if="{{index<3}}" style="background-color:rgb({{item.color}})">{{item.labelName}}</text> -->
              <view>{{ item.name }}</view>
            </view>
            <text class="goods-desc">{{ item.description ? item.description : '' }}</text>
            <!-- <view class="goods-name" style="height: auto;">
          <block wx:for="{{item.produtlabel}}" wx:key="index" wx:if="{{index < 3}}" >
            <text style="background-color:rgb({{item.color}})"  wx:if="{{item.type != 'PROMOTIONLABEL'}}">{{item.labelName}}</text>
          </block>
        </view> -->
            <view v-if="item.require" class="require_label">必选</view>
            <!-- <text class="goods-sold">剩余： {{item.balance}}</text> -->
            <text class="goods-sold" v-if="!item.balance || item.balance === 0">售罄</text>
            <!-- <view class="goods-labels">
          <block wx:for="{{item.promotions}}" wx:key="index" data-id="{{index}}" wx:if="{{index < 3}}" >
            <view style="border-color:rgb({{item.color}})" wx:if="{{item.type != 'PROMOTIONLABEL'}}">{{item.labelName}} </view>
          </block>
        </view> -->
            <!-- <view class="labels-board" hidden="{{item.promotions.length === 0}}">
          <view class="labels-content-board">
            <block wx:for="{{item.promotions}}" wx:key="index">
              <view class="labels-content" wx:if="{{item.type == 'PROMOTIONLABEL'}}">
                <view class="labels-tag">{{item.labelName}}</view>
                <text>{{item.labelDetails}}</text>
              </view>
            </block>
          </view>
        </view> -->
            <view
              class="goods-price"
              :hidden="item.sellPrice && item.sellPrice !== undefined ? false : true"
            >
              ￥
              <view v-if="item.promotionPrice != null">
                <text class="nowPrice">
                  {{
                    item.sellPrice && item.sellPrice < item.promotionPrice
                      ? item.memberPrice && item.memberPrice < item.sellPrice
                        ? filters.filtToFix(item.memberPrice)
                        : filters.filtToFix(item.sellPrice)
                      : item.memberPrice && item.memberPrice < item.promotionPrice
                        ? filters.filtToFix(item.memberPrice)
                        : filters.filtToFix(item.promotionPrice)
                  }}
                </text>
                {{ item.style == 'SPEC_PARENT' ? '起' : '' }}
                <view
                  class="vip-price"
                  v-if="
                    item.memberPrice &&
                    item.memberPrice < item.promotionPrice &&
                    (!item.sellPrice || item.memberPrice < item.sellPrice)
                  "
                >
                  <!-- <text class="oldPrice">￥{{item.originalPrice ? filters.filtToFix(item.originalPrice): filters.filtToFix(item.sellPrice)}}</text> -->
                  <view class="vip-label">
                    <image :src="state.imagesPath.iconVipLabel"></image>
                    <text>{{ state.vipGradeConfig.priceLabel }}</text>
                  </view>
                </view>
                <text class="oldPrice">
                  ￥{{
                    item.originalPrice
                      ? filters.filtToFix(item.originalPrice)
                      : filters.filtToFix(item.sellPrice)
                  }}
                </text>
              </view>
              <view v-else>
                <text class="nowPrice">
                  {{
                    item.memberPrice && item.memberPrice < item.sellPrice
                      ? filters.filtToFix(item.memberPrice)
                      : item.sellPrice
                        ? filters.filtToFix(item.sellPrice)
                        : filters.filtToFix(item.originalPrice)
                  }}
                </text>
                {{ item.style == 'SPEC_PARENT' ? '起' : '' }}
                <view
                  class="vip-price"
                  v-if="item.memberPrice && item.memberPrice < item.sellPrice"
                >
                  <text
                    class="oldPrice"
                    v-if="item.originalPrice && item.memberPrice < item.originalPrice"
                  >
                    ￥{{ filters.filtToFix(item.originalPrice) }}
                  </text>
                  <view class="vip-label">
                    <image :src="state.imagesPath.iconVipLabel"></image>
                    <text>{{ state.vipGradeConfig.priceLabel }}</text>
                  </view>
                </view>
                <text
                  class="oldPrice"
                  v-else-if="item.originalPrice && item.sellPrice < item.originalPrice"
                >
                  ￥{{ filters.filtToFix(item.originalPrice) }}
                </text>
              </view>
            </view>
            <form @submit="addShopcart" @click.stop="addShopcartCatch">
              <view class="cart-control">
                <!-- <block wx:if="{{item.style !== 'MEALS'}}">
              <view class="reduce-box" hidden="{{!shopCart[item.id]}}">
                <button form-type="submit" data-balance="{{item.balance}}" data-style="{{item.style}}" data-type="reduce" data-id="{{item.id}}" data-business="{{item.business}}" data-traceId="{{item.traceId}}"></button>
                <image class="reduce-img" src='{{state.imagesPath.iconMinus}}'></image>
              </view>
              <text class="cart-count">{{shopCart[item.id] ? shopCart[item.id] : ''}}</text>
            </block> -->
                <view class="add-box" :style="'background-color: ' + state.themeColor + ';'">
                  <button v-if="!state.hasUserInfo" @click="getUserInfo"></button>
                  <button
                    v-else
                    form-type="submit"
                    data-addType="normal"
                    :data-balance="item.balance"
                    :data-initialpurchasenumber="item.initialPurchaseNumber"
                    :data-style="item.style"
                    data-type="add"
                    :data-id="item.id"
                    :data-business="item.business"
                    :hidden="item.balance <= 0 && item.business !== 'DISTRIBUTION'"
                    :data-traceId="item.traceId"
                  ></button>
                  <image class="add-img" :src="state.imagesPath.shopping_icon_list"></image>
                  <!-- <image class="add-img" src='{{imagesPath.iconJoin}}'></image> -->
                  <text class="cart-count" v-if="shopCart[item.id]">
                    {{ shopCart[item.id] ? shopCart[item.id] : '' }}
                  </text>
                </view>
              </view>
            </form>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="hud-container" v-if="state.toast.show">
      <image :src="state.toast.image" mode="widthFix"></image>
      <text>{{ state.toast.title }}</text>
    </view>
    <!-- 选择餐饮套餐弹窗 -->
    <!-- <setMeal show="{{meals.show}}" productId="{{meals.productId}}" storeId="{{meals.storeId}}" bind:outcome="chooseOutcome"></setMeal> -->
    <!--加入购物车图片-->
    <!-- <view class="good_box" hidden="{{hide_good_box}}" animation="{{animation}}" style="left:{{bus_x}}px;top:{{bus_y}}px;">
  <image src="{{goodsBoxImage}}" mode="aspectFit" ></image>
</view> -->
    <image
      class="scroll-top"
      v-if="state.showScrollTop"
      :src="state.imagesPath.scrollTop"
      @click="handleScrollTop"
    ></image>
    <authorize @login="handleUserLogin"></authorize>
    <view class="flow-car" @click="toShopCar">
      <image :src="state.imagesPath.flowCart"></image>
      <view class="red-hint" :hidden="!(cartCount > 0)">{{ cartCount }}</view>
    </view>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiBannerServiceJs from '@/service/api/newretail/bannerService'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
import _apiWelfarePlanServiceJs from '@/service/api/newretail/welfarePlanService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiActivityServiceJs from '@/service/api/newretail/activityService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bus from 'iny-bus'
import setMeal from '@/pages-sub/newretail/components/setMeal/setMeal.vue';
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
const app = getApp()

// pages/search/search.js
const storeService = _apiStoreServiceJs
const activityService = _apiActivityServiceJs
const productService = _apiProductServiceJs
const welfarePlanService = _apiWelfarePlanServiceJs
const shopcartService = _apiShopcartServiceJs
const bannerService = _apiBannerServiceJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const utilsSelf = _utilsSelfJs
const themeManager = _utilsThemeManagerJs

// 获取应用实例
let canAddToCart = true
const state = reactive({
  activeCategoryId: null,
  scrollIndex: 0,
  scrollRatio: 0,
  totalWidth: 375,
  acitveIndex: 0,
  navigationBarTitle: '福利兑换专区',
  productTypeList: [],
  dataLoading: true,
  pageCount: 10,
  inScrolltoupper: false,
  imagesPath: IMGAGESPATH,
  userInfo: {},
  storeId: '',
  store: '',
  page: 1,
  offsetTop: 0,
  pageSize: 10,
  searchCount: true,
  searchLabelShow: false,
  searchFocus: true,
  searchText: '',
  searchItem: '',
  banners: [],
  goodsList: [],
  searchHistory: [],
  nameLikes: '',
  placeholderText: '',
  keyboardHeight: 0,
  recorderType: 'normal',
  // normal (正常) success (成功) fail (失败) cancel (取消)
  toast: {
    show: false,
    title: '向上滑动取消',
    image: '../../../../image/iconMicrophoneWhite.png',
  },
  phone: false,
  meals: {
    show: false,
    productId: '',
    storeId: '',
  },
  hasUserInfo: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  vipGradeConfig: null,
  searchHeight: 44,
  isSearchFixed: false,
  showScrollTop: false,
  scrollTop: 0,
})
async function getGoodList() {
  await activityService.getRequiredProduct(app.globalData.userInfo.member.id).then((res) => {
    if (res && res.length > 0) {
      const list = []
      res.forEach((item) => {
        list.push(item.id)
      })
      uni.setStorageSync('requireProductIds', JSON.stringify(list))
    } else {
      uni.removeStorageSync('requireProductIds')
    }
  })
}
function changeIndex(e) {
  state.acitveIndex = e.target.dataset.idx
  state.activeCategoryId = e.target.dataset.id
  getCategoryProduct(state.activeCategoryId)
}
function toShopCar() {
  NAVPAGE.toShopcart()
}
function toAdPage(pageInfo, pageType) {
  const that = this
  if (pageInfo.linkType === 'APP') {
    // 应用
    // 判断跳转模块
    if (pageInfo.appReturnType === 'PRODUCT_MENU') {
      // 跳转商品分类页面
      NAVPAGE.toCategory('?categoryId=' + pageInfo.productMenuId)
    } else if (pageInfo.appReturnType === 'MIAOSHA') {
      NAVPAGE.toSeckill()
    } else if (pageInfo.appReturnType === 'RECHARGE') {
      NAVPAGE.toRecharge()
    } else if (pageInfo.appReturnType === 'MEAL') {
      //  餐饮
    } else if (pageInfo.appReturnType === 'RECEIVECOUPON') {
      // 领券中心
      NAVPAGE.toCouponCenter()
    } else if (pageInfo.appReturnType === 'ADVANCE_SELL_PRODUCT') {
      // 预售商品
      if (pageInfo.activityId) {
        const opts =
          '?productId=' +
          pageInfo.productId +
          '&advanceId=' +
          pageInfo.activityId +
          '&type=advanceSell'
        NAVPAGE.toGoodsDetails(opts)
      } else {
        NAVPAGE.toAdvanceSell()
      }
    } else if (pageInfo.appReturnType === 'TEAM_BUYING') {
      // 团购
      NAVPAGE.toFightGroup()
    } else if (pageInfo.appReturnType === 'SCOREMALL') {
      // 积分商场
      NAVPAGE.toScoreMall()
    } else if (pageInfo.appReturnType === 'INVITE_MEMBER') {
      // 邀请好友
      NAVPAGE.toInvite()
    } else if (pageInfo.appReturnType === 'MEMBER_CARD') {
      // 会员卡
      // 如果首页开启付款码，则不到会员码页面，点击直接跳转付款码页面
      if (app.globalData.uiconfig.isHomePayCodeEnabled) {
        NAVPAGE.toPayCode()
      } else {
        NAVPAGE.toMemberCard()
      }
    } else if (pageInfo.appReturnType === 'MY_COUPON') {
      // 我的优惠券
      NAVPAGE.toMyCoupon()
    } else if (pageInfo.appReturnType === 'NEWMBR') {
      // 新用户专享
      NAVPAGE.toNewmbrActivity()
    } else if (pageInfo.appReturnType === 'HELP_COUPON') {
      // 助力送券
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        if (pageInfo.helpActivityId != null) {
          helpActivityService
            .getHelpActivityById(pageInfo.helpActivityId)
            .then((res) => {
              if (res.status === 'SUBMITED') {
                const opts = '?helpActivityId=' + pageInfo.helpActivityId
                NAVPAGE.toAssistanceCoupon(opts)
              } else if (res.status === 'FINISHED') {
                uni.showToast({
                  title: '您来晚了，助力活动已结束~',
                  icon: 'none',
                })
              } else if (res.status === 'CREATED') {
                uni.showToast({
                  title: '助力活动还没有开始哦~',
                  icon: 'none',
                })
              } else {
                uni.showToast({
                  title: '当前助力活动不在进行中~',
                  icon: 'none',
                })
              }
            })
            .catch((err) => {
              console.log('查询进行中的助力送券活动出错：' + err.message)
              uni.showToast({
                title: '当前没有正在进行中的活动哦~',
                icon: 'none',
              })
            })
        }
      } else {
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(() => {
          NAVPAGE.toAuthorize()
        }, 2000)
      }
    } else if (pageInfo.appReturnType === 'CREDIT_CARD') {
      // 申请办卡
      NAVPAGE.toCreditCard()
    } else if (pageInfo.appReturnType === 'BARGAIN') {
      // 砍价模块
      NAVPAGE.toBargainList()
    } else if (pageInfo.appReturnType === 'PENNY') {
      // 购物抽奖
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toPennyList()
      } else {
        NAVPAGE.toAuthorize()
      }
    } else if (pageInfo.appReturnType === 'RECHARGE_DRAW') {
      // 充值抽奖
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toLotteryIndex()
      } else {
        NAVPAGE.toAuthorize()
      }
    } else if (pageInfo.appReturnType === 'NOTICE') {
      // 系统公告
      NAVPAGE.toSysNotice()
    } else if (pageInfo.appReturnType === 'SOLITAIRE') {
      NAVPAGE.toSolitaireList()
    } else if (pageInfo.appReturnType === 'PACKAGING') {
      // 打包一口价
      if (pageInfo.packagingId != null) {
        const opts = '?packagingId=' + pageInfo.packagingId
        NAVPAGE.toPackaging(opts)
      }
    } else if (pageInfo.pageUrl) {
      uni.navigateTo({
        url: pageInfo.pageUrl,
      })
    }
  } else if (pageInfo.linkType === 'FEEDBACK') {
    // 跳转意见反馈页面
    NAVPAGE.toFeedback()
  } else if (pageInfo.linkType === 'GRADPRODUCT') {
    // 秒杀商品
    const opts =
      '?productId=' +
      pageInfo.productId +
      '&storeId=' +
      app.globalData.storeInfo.id +
      '&activityId=' +
      pageInfo.grabActivityId +
      '&type=secondkill'
    NAVPAGE.toGoodsDetails(opts)
  } else if (pageInfo.linkType === 'PRODUCT') {
    // 商品
    const opts =
      '?productId=' +
      pageInfo.productId +
      '&storeId=' +
      app.globalData.storeInfo.id +
      '&type=normal'
    NAVPAGE.toGoodsDetails(opts)
  } else if (pageInfo.linkType === 'TEAMPRODUCT') {
    // 拼团商品
    const opts =
      '?productId=' +
      pageInfo.teamActivityId +
      '&storeId=' +
      app.globalData.storeInfo.id +
      '&type=group'
    NAVPAGE.toGoodsDetails(opts)
  } else if (pageInfo.linkType === 'COUPONACTIVITYDETAILS') {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        const opts =
          '?couponActivityId=' + pageInfo.couponActivityId + '&type=assign&isExternal=false'
        NAVPAGE.toCouponDetails(opts)
      } else {
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(() => {
          NAVPAGE.toAuthorize()
        }, 2000)
      }
    } else {
      NAVPAGE.toAuthorize()
    }
  } else if (pageInfo.linkType === 'URL') {
    // 链接
    const url = pageInfo.linkUrl
    if (!url) {
      return false
    }
    const index = '?'
    let webUrl = url
    if (url.indexOf(index) > -1) {
      webUrl = webUrl + '&storeId=' + state.storeId + '&type=normal'
      if (app.globalData.TENANT && webUrl.indexOf('tenant') < 0) {
        webUrl = webUrl + '&tenant=' + app.globalData.TENANT
      }
    }
    const urlData = {
      url: encodeURIComponent(webUrl),
    }
    const jsonUrl = JSON.stringify(urlData)
    const opts = '?webUrl=' + jsonUrl
    NAVPAGE.toAdvertising(opts)
  } else if (pageInfo.pageUrl) {
    uni.navigateTo({
      url: pageInfo.pageUrl,
    })
  }
}
function getSearchProduct() {
  welfarePlanService
    .grantGetCategory(app.globalData.userInfo.member.id)
    .then((res) => {
      uni.hideLoading()
      state.dataLoading = true
      state.activeCategoryId = res && res.length > 0 ? res[0].id : ''
      state.productTypeList = res || []
      if (res[0].id) {
        getCategoryProduct(res[0].id)
      }
    })
    .catch(() => {
      uni.hideLoading()
      state.dataLoading = true
    })
}
function getCategoryProduct(categoryId, page) {
  if (!page) {
    state.page = 1
    state.total = 11
    state.goodList = []
  }
  state.categoryId = categoryId
  state.page = page || state.page
  const params = {
    categoryId,
    memberId: app.globalData.userInfo.member.id,
    page: state.page,
    pageSize: 10,
    searchCount: true,
  }
  if (state.page * 10 >= state.total) {
    return false
  }
  uni.showLoading({
    title: '加载中',
  })
  welfarePlanService
    .grantGetProduct(params)
    .then((res) => {
      uni.hideLoading()
      const requiredList = uni.getStorageSync('requireProductIds')
        ? JSON.parse(uni.getStorageSync('requireProductIds'))
        : []
      if (requiredList && requiredList.length > 0) {
        res.records.forEach((item) => {
          requiredList.some((id) => {
            if (id === item.id) {
              item.require = 1
            }
            return id === item.id
          })
        })
      }
      state.total = res && res.totalCount ? res.totalCount : 0
      state.goodList = res.records ? [...state.goodList, ...res.records] : state.goodList
    })
    .catch(() => {
      uni.hideLoading()
      state.dataLoading = true
    })
}
function getSearchProduct1() {
  // var storeId = this.data.storeId;
  // const that = this
  // var page = this.data.page;
  // var pageSize = this.data.pageSize;
  // var searchCount = this.data.searchCount;
  // let storeIdIn = storeId
  // if (app.globalData.distributionStore) {
  //   const distributionStore = app.globalData.distributionStore;
  //   storeIdIn = storeIdIn + "," + distributionStore.id
  // }
  // console.log('进入',that.data.linktypea)
  // if(that.data.linktypea=='self'){
  //     storeIdIn = wx.getStorageSync('storeIdactive').id
  // }
  welfarePlanService
    .getProductByMemberId(app.globalData.userInfo.member.id)
    .then((res) => {
      // let tempList = []
      // this.data.pageCount = res.totalCount;
      uni.hideLoading()
      // if (res && res.length > 0) {
      //   res.forEach(item => {
      //     let produtlabel = []
      //     let promotions = []
      //     let specifications = ''
      //     if (item.labels && item.labels.length > 0) {
      //       item.labels.forEach(ele => {
      //         if (ele.type === 'GOODSLABEL' && ele.color != null) {
      //           produtlabel.push(ele)
      //         } else if (ele.type === 'PROMOTIONLABEL') {
      //           promotions.push(ele)
      //         }
      //       })
      //     }
      //     if (item.productProperties && item.productProperties.length > 0) {
      //       for (let i = 0; i < item.productProperties.length; i++) {
      //         const ele = item.productProperties[i];
      //         if (ele.propertyName === '规格') {
      //           specifications = ele.propertyValue
      //           break
      //         }
      //       }
      //     }
      //     let tempItem = {
      //       ...item,
      //       produtlabel: produtlabel,
      //       promotions: promotions,
      //       specifications: specifications
      //     }
      //     tempList.push(tempItem)
      //   })
      //   that.setData({
      //       goodsList: [...that.data.goodsList,...tempList],
      //       searchLabelShow: true
      //   })
      // }
      const requiredList = uni.getStorageSync('requireProductIds')
        ? JSON.parse(uni.getStorageSync('requireProductIds'))
        : []
      if (requiredList && requiredList.length > 0) {
        res.forEach((productList) => {
          productList.productList.forEach((item) => {
            requiredList.some((id) => {
              if (id === item.id) {
                item.require = 1
              }
              return id === item.id
            })
          })
        })
      }
      state.dataLoading = true
      state.productTypeList = res || []
    })
    .catch(() => {
      uni.hideLoading()
      state.dataLoading = true
    })
}
function scrollMenu(e) {
  if (e && e.type == 'scroll') {
    const totalWidth = e.detail.scrollWidth || state.totalWidth
    const pageWidth = app.globalData.systemInfo.windowWidth
    const scrollLeft = e.detail.scrollLeft
    state.scrollRatio = (scrollLeft / ((totalWidth - pageWidth) * 1.15)) * 100
    state.totalWidth = totalWidth
  }
}
function scrollLeft() {
  state.scrollRatio = 0
}
function scrollRight() {
  const pageWidth = app.globalData.systemInfo.windowWidth
  state.scrollRatio =
    ((state.totalWidth - pageWidth) / ((state.totalWidth - pageWidth) * 1.15)) * 100
}
function toGoodsDetail(val) {
  if (state.linktypea == 'self') {
    const opts =
      '?productId=' +
      val.currentTarget.dataset.productid +
      '&storeId=' +
      state.storeId +
      '&type=normal' +
      '&zhiti=zhiti'
    NAVPAGE.toGoodsDetails(opts)
  } else {
    const opts =
      '?productId=' +
      val.currentTarget.dataset.productid +
      '&storeId=' +
      state.storeId +
      '&type=normal'
    NAVPAGE.toGoodsDetails(opts)
  }
}
onLoad(async function (options) {
  const systemInfo = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo(),
  } // 调用方法获取机型
  const tabbarHeight = app.globalData.isIphoneX ? 148 : 98
  const navHeight = app.globalData.navHeight
  const searchBarHeight = (30 * systemInfo.screenWidth) / 750
  const self = this
  eventId = bus.on('userShopCartChange', () => {
    if (app.globalData.storeInfo) {
      getShopCart(app.globalData.storeInfo.id)
    }
  })
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    state.store = app.globalData.storeInfo.name
    state.storeId = app.globalData.storeInfo.id
    state.themeColor = app.globalData.uiconfig.themeColor
    if (app.globalData.systemConfigure.showCartModule) {
      getShopCart(state.storeId)
    }
    // 统计PV
    ANALYSIS.PVStatistics(state.storeId)
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation()
      .then((res) => {
        app.globalData.storeInfo = res
        state.store = res.name
        state.storeId = res.id
        if (app.globalData.systemConfigure.showCartModule) {
          getShopCart(res.id)
        }
        // 统计PV
        ANALYSIS.PVStatistics(res.id)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // 获取当前页面分享图
  state.navHeight = app.globalData.navHeight
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
  state.windowHeight =
    systemInfo.screenHeight -
    (tabbarHeight * systemInfo.screenWidth) / 750 -
    navHeight -
    searchBarHeight
  state.goodsList = []
  state.page = 1
  getSharePictures()
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    await getGoodList()
    await getSearchProduct()
  }
  // 获取用户信息
  checkUserInfo()
  if (options.linktypea == 'self' && options.linktypea) {
    state.linktypea = 'self'
  }
  if (options.storeId) {
    state.storeId = options.storeId
  }
})
onReady(function () {})
onShow(function () {
  const self = this
  if (state.phone === true) {
    handlePopupPhone()
  }
  if (
    state.storeId &&
    state.storeId !== '' &&
    app.globalData.userInfo &&
    app.globalData.userInfo.member
  ) {
    if (app.globalData.systemConfigure.showCartModule) {
      getShopCart(state.storeId)
    }
  }
})
onHide(function () {})
onUnload(function () {
  bus.remove('userShopCartChange', eventId)
})
onPullDownRefresh(function () {})
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
        '/pages-sub/newretail/pages/mallModule/welfarePlan/welfarePlan?shareId=' +
        memberId +
        '&storeId=' +
        state.storeId,
      imageUrl: sharePictures,
      success(e) {},
    }
  } else {
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/welfarePlan/welfarePlan?storeId=' + state.storeId,
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
      } else {
        storeId = app.globalData.storeInfo.id
      }
      if (state.linktypea == 'self') {
        storeId = state.storeId
      }
      const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
      let goodObj = null
      let goodNum = 1
      state.productTypeList[state.acitveIndex].productList.some((item) => {
        if (item.productId == productId || item.id == productId) {
          goodObj = {
            ...item,
          }
          if (localShopingCart && localShopingCart.goodsId.indexOf(item.id) > -1) {
            goodNum = localShopingCart.items[item.id]
          }
        }
        return item.productId == productId || item.id == productId
      })
      let postData = {
        storeId,
        lists: [
          {
            count: goodObj && goodObj.initialPurchaseNumber ? goodObj.initialPurchaseNumber : 1,
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
              count:
                goodNum &&
                goodObj &&
                goodObj.initialPurchaseNumber &&
                goodNum <= goodObj.initialPurchaseNumber
                  ? -goodObj.initialPurchaseNumber
                  : -1,
              productId,
            },
          ],
        }
      }
      console.log(postData, 'modemode')
      if (business === 'DISTRIBUTION') {
        balance = 0
        productService
          .getDetails(storeId, productId)
          .then((res) => {
            if (res) {
              balance = res.balance
            }
            if (res.style === 'MEALS') {
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
                  business === 'DISTRIBUTION' ? 'distribution' : 'normal'
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
      function getCateringDetailsById(productId, storeId) {
        productService
          .getCateringDetailsById(productId, storeId)
          .then((res) => {
            const self = this
            const cateringGroupProducts = res.cateringGroupProducts
            const productId = res.id
            const goodsList = []
            const mealCanBuy = true
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
    let opts =
      '?productId=' + productId + '&storeId=' + state.storeId + '&source=addshopcart&type=normal'
    if (val.detail.target.dataset.easyscene != null) {
      opts = opts + '&easyScene=' + val.detail.target.dataset.easyscene
    }
    NAVPAGE.toGoodsDetails(opts)
  }
}
function handleConfirm(e) {
  const keyword = state.searchText
  uni.navigateTo({
    url:
      '/pages-sub/newretail/pages/mallModule/benefitPlan/welfarePlanSearch/welfarePlanSearch?keyword=' +
      keyword +
      '&type=wait',
  })
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
    try {
      const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
      if (localShopingCart) {
        state.shopCart = localShopingCart.items
        state.shopCartGoodsId = localShopingCart.goodsId
      } else {
        shopcartService
          .getCatering(storeId)
          .then((res) => {
            const tempShopCart = {}
            const tempShopCartGoodsId = []
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
                }
              })
            }
            state.shopCart = tempShopCart
            state.shopCartGoodsId = tempShopCartGoodsId
            const localData = {
              goodsId: tempShopCartGoodsId,
              items: tempShopCart,
            }
            try {
              uni.setStorageSync('wj_shopCartStorage', localData)
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
    } catch (error) {
      console.log(error)
    }
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
      let goodObj = null
      state.productTypeList[state.acitveIndex].productList.some((item) => {
        if (item.productId == id || item.id == id) {
          goodObj = {
            ...item,
          }
        }
        return item.productId == id || item.id == id
      })
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
        tempShopCart[_id] =
          goodObj && goodObj.initialPurchaseNumber ? goodObj.initialPurchaseNumber : 1
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
      let goodObj = null
      state.productTypeList[state.acitveIndex].productList.some((item) => {
        if (item.productId == id || item.id == id) {
          goodObj = {
            ...item,
          }
        }
        return item.productId == id || item.id == id
      })
      if (index > -1) {
        // 已经存在购物车，只是数量变化
        tempShopCart[_id] =
          goodObj &&
          goodObj.initialPurchaseNumber &&
          goodObj.initialPurchaseNumber >= Number(tempShopCart[_id])
            ? Number(tempShopCart[_id]) - goodObj.initialPurchaseNumber
            : Number(tempShopCart[_id]) - 1
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
  addLocalGoods(e.target.dataset.id)
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
        if (state.storeId !== '') {
          if (app.globalData.systemConfigure.showCartModule) {
            getShopCart(state.storeId)
          }
        }
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
  // if(this.data.page * 10 >= this.data.total) {
  //   return false
  // }
  // this.getCategoryProduct(this.data.activeCategoryId, this.data.page + 1)
})
function scrollFn(e) {
  const scrollTop = e.detail.scrollTop
  if (scrollTop > 50) {
    state.isSearchFixed = true
    state.showScrollTop = true
  } else {
    state.isSearchFixed = false
    state.showScrollTop = false
  }
}
function handleScrollTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  })
  state.scrollTop = 0
}
function handleScrolltolower(e) {
  if (state.page * 10 < state.total) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    // 查询活动
    getCategoryProduct(state.activeCategoryId, state.page + 1)
  }
}
</script>
<style scoped>
.top_img {
  width: 100%;
  /* margin: 15rpx auto; */
  display: block;
}
.search {
  display: flex;
  align-items: center;
  padding-right: 40rpx;
  position: relative;
  background: #fff;
  width: 750rpx;
  box-sizing: border-box;
}

.banner-box {
  width: 100%;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.banner-box image {
  width: 100%;
  height: 100%;
  display: block;
}

.top-search-block {
  width: 100%;
  height: 82rpx;
}

.search .search-box {
  width: 560rpx;
  padding-right: 20rpx;
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

.goods-box {
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 200rpx);
  padding-bottom: 40rpx;
  margin-top: 94rpx;
  /* padding: 0 20rpx; */
}
page {
  background-color: rgb(240, 240, 240);
}
.type-title {
  text-align: center;
  margin: 10rpx;
  color: #000;
}
.type-title image {
  width: 150rpx;
}
.goods-item {
  /* min-height: 180rpx; */
  /* border-bottom: 1rpx solid #f0f0f0; */
  padding: 27rpx 20rpx 20rpx;
  overflow: hidden;
  background: #fff;
  width: 49%;
  border-radius: 12rpx;
  box-sizing: border-box;
  margin-bottom: 15rpx;
}

.goods-img-box {
  width: 100%;
  height: 256rpx;
  overflow: hidden;
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
  width: 100%;
  /* height: 100%; */
  height: 210rpx;
  position: relative;
  display: flex;
  flex-direction: column;
}

.goods-info .goods-introduce {
  font-size: 22rpx;
  color: #009136;
  height: 30rpx;
  line-height: 30rpx;
  font-weight: bold;
}

.goods-info .goods-introduce > text {
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
  font-size: 22rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
  flex-shrink: 0;
}

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
  font-size: 30rpx;
  line-height: 40rpx;
  min-height: 42rpx;
  max-height: 70rpx;
  font-weight: bold;
  margin: 10rpx 0 5rpx 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 0 0 auto;
}

.goods-info .goods-name view {
  width: 100%;
  font-weight: Medium;
}
.goods-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 15rpx;
  justify-content: space-between;
}
.goods-item .goods-info .goods-name view {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-info .goods-labels {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30rpx;
  margin: 10rpx 0 5rpx 0;
}

.goods-info .goods-labels view {
  /* width: 60rpx; */
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
  color: #999999;
  height: 32rpx;
  flex: 0 0 auto;
  font-size: 20rpx;
}

.goods-info .goods-sold {
  margin-top: 5rpx;
}

.goods-price {
  padding-top: 25rpx;
  position: absolute;
  bottom: 0;
  color: #ff8561;
  font-size: 20rpx;
  margin-top: 22rpx;
  line-height: 40rpx;
}

.goods-price .nowPrice {
  font-size: 32rpx;
  font-weight: 800;
  margin-right: 16rpx;
}

.goods-price .oldPrice {
  font-size: 22rpx;
  color: #999;
  text-decoration: line-through;
}

.vip-price {
  font-size: 24rpx;
  line-height: 36rpx;
  color: #171613;
  display: inline-flex;
  align-items: center;
}

.vip-price text {
  flex-shrink: 0;
}

.vip-price .vip-label {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 71rpx;
  height: 25rpx;
  flex-shrink: 0;
  margin-top: -4rpx;
}

.vip-price .vip-label image {
  width: 71rpx;
  height: 25rpx;
}

.vip-price .vip-label text {
  white-space: nowrap;
  min-width: calc(100% - 12rpx);
  height: 100%;
  padding: 0 6rpx;
  display: inline-block;
  font-size: 18rpx;
  line-height: 25rpx;
  text-align: center;
  color: #ffeba5;
  background: #403e3e;
  position: absolute;
  left: 6rpx;
  top: 2rpx;
  z-index: 2;
  border-radius: 4rpx;
}

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
  transform: translateY(25%);
}

.add-box,
.reduce-box {
  /* width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    padding: 0; */

  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  padding: 0;
  position: absolute;
  right: 30rpx;
  background-color: #ff8425;
}

/* .add-box {
    position: absolute;
    right: 0;
  } */

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
.add-box .cart-count {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  font-size: 18rpx;
  background-color: #ff2000;
  color: #fff;
  height: 24rpx;
  border-radius: 12rpx;
  line-height: 24rpx;
  padding: 0 6rpx;
}
button.button-hover {
  color: transparent;
  background-color: transparent;
  border: none;
}

.add-img,
.reduce-img {
  width: 29rpx;
  height: 27rpx;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* width: 40rpx;
    height: 40rpx;
    padding: 0;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -20rpx;
    margin-left: -20rpx; */
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

.scroll-top {
  width: 92rpx;
  height: 92rpx;
  position: fixed;
  right: 20rpx;
  bottom: 20%;
  z-index: 6;
}
.labels-board {
  font-size: 28rpx;
  line-height: 48rpx;
  color: #454545;
  background: #fff;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  /* border-top: 1px solid #F1F1F1; */
}
.labels-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.labels-tag {
  border: 1rpx solid #ff7200;
  color: #ff7200;
  font-size: 18rpx;
  height: 28rpx;
  line-height: 28rpx;
  padding: 0rpx 8rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
}
.labels-content {
  color: #ff7200;
  font-size: 18rpx;
  height: 28rpx;
  line-height: 28rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
}
.labels-title {
  flex-shrink: 0;
}
.require_label {
  color: #ff7200;
  font-size: 24rpx;
  height: 36rpx;
  width: 60rpx;
  text-align: center;
  line-height: 36rpx;
  border: 1rpx solid #ff7200;
  border-radius: 10rpx;
}
.menu_box {
  position: relative;
  margin-bottom: 20rpx;
  background-color: #fff;
  width: 750rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
}
.scroll-box {
  position: relative;
  width: 750rpx;
}
.scroll-bar {
  position: absolute;
  top: -20rpx;
  width: 65px;
  height: 6rpx;
  flex: 0 0 auto;
  background-color: #ccc;
  border-radius: 6rpx;
}
/* .menu_list {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    width: auto;
  } */
.menu_list .type-title {
  padding: 0 20rpx;
  font-size: 30rpx;
  min-width: 120rpx;
  margin: 0;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu_list .active {
  color: #6eb3fd;
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
.no_data {
  font-size: 28rpx;
  text-align: center;
  margin-top: 28vh;
  color: #666;
}
.top-info {
  position: fixed;
  left: 0;
  background-color: #fff;
  height: 94rpx;
  z-index: 999;
  display: flex;
  align-items: center;
}
.logo-img {
  width: 200rpx;
  margin-right: 15rpx;
  flex: 0 0 auto;
}
.topHandleView {
  width: 490rpx;
  height: 64rpx;
  background-color: rgb(240, 240, 240);
  border: #ccc 1px solid;
  border-radius: 30rpx;
  justify-content: space-between;
  /* margin: 0 auto; */
  display: flex;
  color: #a0a0a0;
  font-size: 28rpx;
  padding: 0 34rpx;
  align-items: center;
  box-sizing: border-box;
  margin: 15rpx auto;
}
.topHandleView > image {
  width: 120rpx;
  height: 40rpx;
}
</style>
