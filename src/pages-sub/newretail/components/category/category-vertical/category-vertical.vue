<template>
  <!-- components/category/category-vertical/category-vertical.wxml -->
  <view>
    <view
      class="content"
      v-if="
        props.category.length > 0 ||
        props.productCategoryStyle === '风格2' ||
        props.productCategoryStyle === '风格3'
      "
    >
      <scroll-view
        v-if="!state.storeIdActive"
        class="left-box"
        scroll-y=""
        :style="
          'height: ' +
          (state.windowHeight -
            (props.productCategoryStyle == '风格2' || props.productCategoryStyle == '风格3'
              ? 20
              : 0)) +
          'px;'
        "
        :scrollTop="offsetTop"
        scroll-with-animation=""
      >
        <view
          :class="
            'category-item ' +
            (props.currentCategory == item.categoryId
              ? item.children.length > 0
                ? 'category-item-active'
                : 'category-item-children-active'
              : '') +
            ' ' +
            (props.productCategoryStyle === '风格3' ? 'category-item-three' : '')
          "
          @click="clickCategory"
          v-for="(item, idx) in category"
          :key="idx"
          :data-id="item.categoryId"
          :data-business="item.business"
          :data-index="idx"
        >
          <view class="top-semicircle parent">
            <view :style="props.productCategoryStyle == '风格3' ? '' : ''"></view>
          </view>
          <view
            :class="
              'category-item-title ' +
              (props.productCategoryStyle === '风格3' ? 'category-item-title-three' : '') +
              ' ' +
              (props.productCategoryStyle === '风格3' &&
              item.pictureUrl &&
              props.currentCategory == item.categoryId
                ? 'category-item-title-three-pic'
                : '')
            "
            :style="props.currentCategory == item.categoryId ? 'color: ' + state.themeColor : ''"
          >
            <view
              class="category-item_icon"
              v-if="props.productCategoryStyle !== '风格3'"
              :style="
                props.currentCategory == item.categoryId
                  ? 'background-color: ' + state.themeColor
                  : ''
              "
            ></view>
            <view
              style="display: flex; align-items: center; justify-content: center; width: 100%"
              v-if="
                props.productCategoryStyle === '风格3' &&
                item.pictureUrl &&
                props.currentCategory == item.categoryId
              "
            >
              <image :src="item.pictureUrl" mode="heightFix"></image>
            </view>
            <text>{{ filterCategoryName(item.menuName) }}</text>
            <view
              class="iconfont2 icon-jiantouyou"
              :style="
                'font-size: 22rpx;color: ' +
                (props.currentCategory === item.categoryId ? 'transparent' : '') +
                ';height:36rpx;line-height: 36rpx;'
              "
              v-if="props.productCategoryStyle === '风格3'"
            ></view>
            <view
              class="iconfont2 icon-xiajiantouxia"
              v-if="
                props.currentCategory == item.categoryId &&
                props.productCategoryStyle === '风格3' &&
                item.children.length > 0
              "
              :style="
                'text-align: center;font-size: 22rpx;color: ' +
                (props.currentCategory === item.categoryId ? transparent : 'transparent') +
                ';width: 100%;height: 20rpx;line-height: 20rpx;margin-left:-20rpx;' +
                (item.pictureUrl && props.currentCategory == item.categoryId
                  ? ''
                  : 'margin-top:-36rpx')
              "
            ></view>
            <view class="parent-line" v-if="props.productCategoryStyle === '风格3'"></view>
          </view>
          <view
            :class="
              'category-children ' +
              (index === 0 ? 'first' : '') +
              ' ' +
              (index === item.children.length - 1 ? 'last' : '') +
              ' ' +
              (selectedSecondId == cate.categoryId || props.childrenSelect == cate.categoryId
                ? 'category-children-active'
                : '') +
              ' ' +
              (props.productCategoryStyle === '风格3' ? 'category-children-three' : '')
            "
            v-for="(cate, index) in item.children"
            :key="index"
            v-show="props.currentCategory == item.categoryId"
            @click.stop="clickCategoryItem"
            :data-id="cate.categoryId"
            :style="
              selectedSecondId == cate.categoryId || props.childrenSelect == cate.categoryId
                ? 'font-weight: 700;color: ' + state.themeColor
                : ''
            "
            :data-business="cate.business"
            :data-parentId="cate.parentId"
          >
            <view
              class="children_icon"
              v-if="props.productCategoryStyle !== '风格3'"
              :style="
                selectedSecondId == cate.categoryId || props.childrenSelect == cate.categoryId
                  ? 'background-color: ' + state.themeColor
                  : ''
              "
            ></view>
            <view class="top-semicircle parent">
              <view></view>
            </view>
            <view
              style="display: flex; align-items: center; justify-content: center; width: 100%"
              v-if="
                props.productCategoryStyle === '风格3' &&
                cate.pictureUrl &&
                (selectedSecondId == cate.categoryId || props.childrenSelect == cate.categoryId)
              "
            >
              <image :src="cate.pictureUrl" mode="heightFix"></image>
            </view>
            <view class="category-children-content">{{ cate.menuName }}</view>
            <view class="bottom-semicircle">
              <view></view>
            </view>
            <view class="children-line" v-if="props.productCategoryStyle === '风格3'"></view>
          </view>
          <view class="bottom-semicircle parent">
            <view></view>
          </view>
        </view>
      </scroll-view>
      <view
        class="category-swiper"
        :style="
          'height: ' +
          state.windowHeight +
          'px; width:' +
          (state.storeIdActive ? '100%' : '589rpx') +
          ';'
        "
      >
        <view class="category-box">
          <view
            class="top-navigation-box"
            v-if="level > 2 && !state.storeIdActive && props.productCategoryStyle === '风格1'"
          >
            <scroll-view
              class="right-category-box"
              scroll-x=""
              scroll-with-animation=""
              :scrollLeft="offsetLeft"
              :hidden="showScroll"
            >
              <view
                class="right-category-item"
                v-for="(item, index) in categoryList"
                :key="index"
                @click.stop="clickThreeCategoryItem"
                :data-id="item.categoryId"
                :data-business="item.business"
                :data-parentId="item.parentId"
                :style="
                  props.childrenSelect == item.categoryId
                    ? state.theme.mainColor + state.theme.BgColorRgb01
                    : ''
                "
              >
                {{ item.menuName }}
              </view>
            </scroll-view>
            <view class="right-category-box right-category-text" :hidden="!showScroll">
              选择分类
            </view>
            <view
              :class="'right-show-btn ' + (showScroll ? 'show' : 'hide')"
              @click="clickShowCategoryList"
            >
              <view>
                <text v-if="!showScroll">全部</text>
                <text v-else></text>
                <image :src="state.imagesPath.iconIndexStoreRight"></image>
              </view>
            </view>
            <view
              class="category-list-popup"
              :style="'height: ' + state.windowHeight + 'px;'"
              :hidden="!showScroll"
              @click="clickPopup"
            >
              <view class="category-list-box">
                <view
                  class="category-item-box"
                  v-for="(item, index) in categoryList"
                  :key="index"
                  @click.stop="clickThreeCategoryItem"
                  :data-id="item.categoryId"
                  :data-business="item.business"
                  :data-parentId="item.parentId"
                  :style="
                    props.childrenSelect == item.categoryId
                      ? state.theme.mainColor + state.theme.BgColorRgb01
                      : ''
                  "
                >
                  {{ item.menuName }}
                </view>
              </view>
            </view>
          </view>
          <view class="sort-toggle">
            <view class="sort-btns">
              <view
                class="btn"
                data-sortid="sold_count"
                :data-orderby="state.sortkeys.orderBy"
                @click="handleOrderBy"
              >
                <view :style="'color: ' + (state.sortkeys.field === 'sold_count')">销量</view>
                <view class="sort-tag">
                  <text
                    class="sort-ascending"
                    :style="
                      'border-bottom-color: ' +
                      (state.sortkeys.field === 'sold_count' && state.sortkeys.orderBy === 'asc'
                        ? state.themeColor
                        : '')
                    "
                  ></text>
                  <text
                    class="sort-descending"
                    :style="
                      'border-top-color: ' +
                      (state.sortkeys.field === 'sold_count' && state.sortkeys.orderBy === 'desc'
                        ? state.themeColor
                        : '')
                    "
                  ></text>
                </view>
              </view>
              <view
                class="btn"
                data-sortid="sell_price"
                :data-orderby="state.sortkeys.orderBy"
                @click="handleOrderBy"
              >
                <view :style="'color: ' + (state.sortkeys.field === 'sell_price')">价格</view>
                <view class="sort-tag">
                  <text
                    class="sort-ascending"
                    :style="
                      'border-bottom-color: ' +
                      (state.sortkeys.field === 'sell_price' && state.sortkeys.orderBy === 'asc'
                        ? state.themeColor
                        : '')
                    "
                  ></text>
                  <text
                    class="sort-descending"
                    :style="
                      'border-top-color: ' +
                      (state.sortkeys.field === 'sell_price' && state.sortkeys.orderBy === 'desc'
                        ? state.themeColor
                        : '')
                    "
                  ></text>
                </view>
              </view>
              <view
                class="btn"
                data-sortid="create_time"
                :data-orderby="state.sortkeys.orderBy"
                @click="handleOrderBy"
              >
                <view :style="'color: ' + (state.sortkeys.field === 'create_time')">新品</view>
                <view class="sort-tag">
                  <text
                    class="sort-ascending"
                    :style="
                      'border-bottom-color: ' +
                      (state.sortkeys.field === 'create_time' && state.sortkeys.orderBy === 'asc'
                        ? state.themeColor
                        : '')
                    "
                  ></text>
                  <text
                    class="sort-descending"
                    :style="
                      'border-top-color: ' +
                      (state.sortkeys.field === 'create_time' && state.sortkeys.orderBy === 'desc'
                        ? state.themeColor
                        : '')
                    "
                  ></text>
                </view>
              </view>
              <view
                v-if="props.isNew === '1'"
                class="btn"
                data-sortid="create_time"
                :data-orderby="state.sortkeys.orderBy"
                @click="filterProducts"
                style="display: flex; align-items: center"
              >
                <view :style="'color: ' + (state.sortkeys.field === 'create_time')">筛选</view>
                <view
                  class="sort-tag"
                  style="display: flex; align-items: center; flex-direction: inherit"
                >
                  <!-- <image wx:if="{{showFilterScroll}}" src="../../../image/filter-active-icon.png" mode="widthFix" style="width: 21rpx;"></image> -->
                  <!-- <image wx:else src="../../../image/filter-icon.png" mode="widthFix" style="width: 21rpx;"></image> -->
                  <!-- <image src="{{imagesPath.filter_icon}}" mode="widthFix" style="width: 21rpx;"></image> -->
                  <view
                    class="iconfont2 icon-shaixuan"
                    :style="
                      'font-size: 22rpx;color: ' +
                      (!state.filterType.ALL ? state.themeColor : '#ddd') +
                      ';'
                    "
                  ></view>
                </view>
              </view>
            </view>
            <view class="filter-box" v-if="showFilterScroll">
              <view class="filter-bg">
                <view class="title">配送方式</view>
                <view class="filter-item-box">
                  <view v-for="(item, index) in shipmentSortList" :key="item">
                    <view
                      :class="'filter-item ' + (state.filterType[item] ? 'active' : '')"
                      v-if="item == 'ALL'"
                      data-type="all"
                      @click="handleClick"
                      :style="
                        state.filterType[item]
                          ? state.theme.mainColor + state.theme.BgColorRgb01
                          : ''
                      "
                    >
                      全部
                    </view>
                    <view
                      :class="'filter-item ' + (state.filterType[item] ? 'active' : '')"
                      v-if="item == 'SELF'"
                      :style="
                        state.filterType[item]
                          ? state.theme.mainColor + state.theme.BgColorRgb01
                          : ''
                      "
                      :data-type="item"
                      @click="handleClick"
                    >
                      到店自提
                    </view>
                    <view
                      :class="'filter-item ' + (state.filterType[item] ? 'active' : '')"
                      v-if="item == 'EXPRESS'"
                      :style="
                        state.filterType[item]
                          ? state.theme.mainColor + state.theme.BgColorRgb01
                          : ''
                      "
                      :data-type="item"
                      @click="handleClick"
                    >
                      外卖配送
                    </view>
                    <view
                      :class="'filter-item ' + (state.filterType[item] ? 'active' : '')"
                      v-if="item == 'LOGISTICAL'"
                      :style="
                        state.filterType[item]
                          ? state.theme.mainColor + state.theme.BgColorRgb01
                          : ''
                      "
                      :data-type="item"
                      @click="handleClick"
                    >
                      快递配送
                    </view>
                  </view>
                </view>
                <view class="filter-btn-box">
                  <view class="filter-btn-reset" @click="doReset">重置</view>
                  <view
                    class="filter-btn-search"
                    @click="doSearch"
                    :style="'background-color: ' + state.themeColor"
                  >
                    完成
                  </view>
                </view>
                <view class="bg-click" @click="doSearch"></view>
              </view>
            </view>
          </view>
          <scroll-view
            class="right-box"
            :scroll-y="true"
            enable-flex="true"
            :style="'height: ' + state.windowScrollHeight + 'px;'"
            @scrolltolower="handleScrolltolower"
            :scroll-into-view="'t' + state.manualScrollTop"
            @scrolltoupper="handlescrolltoupper"
            upper-threshold="-50"
            :lower-threshold="state.lowerThreshold"
            :scroll-top="state.scrollTop"
            scroll-anchoring="true"
            @scroll="scrollFn"
          >
            <view id="goodTop"></view>
            <view class="skeleton" v-if="!state.loaded">
              <view class="header"></view>
              <view :class="'item-list ' + (props.proShowType === 'card' ? 'item-card-list' : '')">
                <view class="title"></view>
                <view
                  class="item"
                  v-show="props.proShowType === 'list'"
                  v-for="(v, k) in 'skeletonData'"
                  :key="k"
                >
                  <view class="img"></view>
                  <view class="text">
                    <view class="text1"></view>
                    <view class="text2"></view>
                    <view class="text3"></view>
                    <view class="text4"></view>
                  </view>
                  <view class="cart"></view>
                </view>
                <view
                  class="card-item"
                  v-show="props.proShowType === 'card'"
                  v-for="(v, k) in 'skeletonData'"
                  :key="k"
                >
                  <view class="img"></view>
                  <view class="text">
                    <view class="text1"></view>
                    <view class="text2"></view>
                  </view>
                  <view class="cart"></view>
                </view>
              </view>
            </view>
            <product-box
              :style="'height: ' + state.windowScrollHeight + 'px;'"
              v-if="state.loaded"
              :show="state.loaded"
              :isNew="props.isNew"
              :showSpecParent="props.showSpecParent"
              :loading="state.loadingGoods"
              :loadingBtn="state.loading"
              :noMore="state.noMore"
              :imagesPath="state.imagesPath"
              :bannerJson="props.bannerJson"
              :shopCart="props.shopCart"
              :zhiti="props.zhiti"
              :hasUserInfo="props.hasUserInfo"
              @onClickGoods="onClickGoods"
              @addToCart="addToCart"
              @noop="noop"
              @getUserInfo="onGetUserInfo"
              @onReadyEnd="onProductReadyEnd"
              :proShowType="props.proShowType"
            ></product-box>
            <image
              class="scroll-top"
              v-if="state.backTopFlag"
              :src="state.imagesPath.scrollTop"
              @click="handleScrollTop"
            ></image>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
// import { ready } from "@dcloudio/uni-app";
import { reactive, watch, onBeforeMount } from 'vue'
import productBox from '../../product/product-box/product-box.vue'
const app = getApp()
// components/category/category-vertical/category-vertical.js
const IMAGESPATH = _utilsImagesPathJs
const productService = _apiProductServiceJs
const themeManager = _utilsThemeManagerJs
const UTILS = _utilsUtilsJs
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
function filterCategoryName(val) {
  if (val.length > 4) {
    return val.substring(0, 4)
  }
  return val
}
// 获取应用实例
let hasQuery = false
const queryCategoryId = ''
const state = reactive({
  windowScrollHeight: 0,
  manualScrollTop: '',
  scrollTopHeight: 0,
  backTopFlag: false,
  storeIdActive: false,
  storeIdActive1: false,
  imagesPath: IMAGESPATH,
  theme: themeManager,
  filterType: {
    ALL: true,
    SELF: false,
    EXPRESS: false,
    LOGISTICAL: false,
  },
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  windowHeight: '',
  sectionOffsetTops: [],
  offsetTop: 0,
  isScroll: true,
  current: 0,
  listCounts: [],
  childrenCategory: '',
  navHeight: 170,
  categoryList: [],
  // 当前类目的二级分类
  sectionOffsetLefts: [],
  offsetLeft: 0,
  arrow: !1,
  showScroll: !1,
  showFilterScroll: false,
  skeletonData: [1, 2, 3, 4, 5],
  sortkeys: {
    field: '',
    orderBy: 'asc',
  },
  loaded: false,
  page: 1,
  pageSize: 20,
  pageCount: 1,
  noMore: false,
  loading: false,
  scrollTop: 0,
  loadingGoods: false,
  lowerThreshold: 20,
  isAndroid: false,
  shipmentSortList: [],
})
const props = defineProps({
  category: {
    type: Array,
    value: [],
  },
  shipmentTypes: {
    type: String,
  },
  shopCart: Object,
  currenSelect: String,
  currentCategory: {
    type: String,
    value: '',
  },
  isNew: String,
  productCategoryStyle: String,
  showSpecParent: Boolean,
  bannerJson: {
    type: Object,
    value: {},
  },
  selectedSecondId: {
    type: String,
    value: '',
  },
  childrenSelect: {
    type: String,
    value: '',
  },
  load: {
    type: Boolean,
    value: true,
  },
  hasUserInfo: Boolean,
  counts: {
    type: Array,
    value: '',
  },
  isPullDownRefresh: {
    type: Boolean,
    value: false,
  },
  level: {
    type: Number,
    value: 1,
  },
  storeId: {
    type: String,
    value: 1,
  },
  proShowType: String,
  zhiti: {
    type: String,
    value: '',
  },
})
onBeforeMount(() => {
  const systemInfo = {
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo(),
  } // 调用方法获取机型
  console.log(systemInfo)
  const tabbarHeight = app.globalData.isIphoneX ? 148 : 98
  const navHeight = app.globalData.navHeight
  const searchBarHeight = (92 * systemInfo.screenWidth) / 750
  const topCategory =
    props.productCategoryStyle === '风格1' ? 0 : (136 * systemInfo.screenWidth) / 750
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
  state.windowHeight =
    systemInfo.screenHeight -
    (tabbarHeight * systemInfo.screenWidth) / 750 -
    navHeight -
    searchBarHeight -
    topCategory
  state.navHeight = navHeight + searchBarHeight
  state.windowScrollHeight =
    systemInfo.screenHeight -
    (tabbarHeight * systemInfo.screenWidth) / 750 -
    navHeight -
    searchBarHeight -
    (172 * systemInfo.screenWidth) / 750
  let lowerThreshold = 20
  if (systemInfo.platform == 'android') {
    state.isAndroid = true
    lowerThreshold = 80
  }
  state.lowerThreshold = lowerThreshold
  const shipmentList = []
  // 处理排序问题
  if (app.globalData.uiconfig) {
    app.globalData.uiconfig.shipmentSortList = ['SELF', 'EXPRESS', 'LOGISTICAL']
  } else {
    app.globalData.uiconfig = {
      shipmentSortList: ['SELF', 'EXPRESS', 'LOGISTICAL'],
    }
  }
  for (const key in app.globalData.uiconfig.shipmentSortList) {
    if (app.globalData.uiconfig.shipmentSortList.hasOwnProperty(key)) {
      const value = app.globalData.uiconfig.shipmentSortList[key]
      shipmentList.push(value)
    }
  }
  shipmentList.unshift('ALL')
  // 配送方式顺序
  state.shipmentSortList = shipmentList
})
const emit = defineEmits([
  'shipmentTypeChange',
  'clickCategory',
  'clickGoods',
  'clickItem',
  'clickGoodsItem',
  'clickThreeItem',
  'clickAll',
  'clickThreeItem',
  'onClickGoods',
  'addToCart',
  'decrease',
  'subscribeArrivalRemind',
  'noop',
  'getUserInfo',
  'toAdPage',
])
onMounted(() => {
  getProductsByCategoryId()
})
function doSearch() {
  state.showFilterScroll = false
  getProductsByCategoryId()
}
function handleClick(val) {
  const shipmentTypes = []
  if (val.currentTarget.dataset.type == 'all') {
    state.filterType = {
      ALL: true,
      SELF: false,
      EXPRESS: false,
      LOGISTICAL: false,
    }
  } else {
    state.filterType[val.currentTarget.dataset.type] =
      !state.filterType[val.currentTarget.dataset.type]
    const keys = Object.keys(state.filterType)
    let noAllFlag = false
    keys.forEach((key) => {
      if (state.filterType[key] && key != 'ALL') {
        noAllFlag = true
        if (shipmentTypes.indexOf(key) == -1) {
          shipmentTypes.push(key)
        }
      }
    })
    state.filterType.ALL = !noAllFlag
  }
  // state.filterType = state.filterType
  emit('shipmentTypeChange', val.currentTarget.dataset.type == 'all' ? '' : shipmentTypes.join(','))
}
function doReset() {
  state.filterType = {
    ALL: true,
    SELF: false,
    EXPRESS: false,
    LOGISTICAL: false,
  }
  emit('shipmentTypeChange', '')
  doSearch()
}
function handleScrollTop() {
  state.scrollTopHeight = 0
}
function scrollFn(e) {
  const scrollTop = e.detail.scrollTop
  state.scrollTop = scrollTop
  if (scrollTop > 100 && state.zhiti == 'zhiti') {
    state.backTopFlag = true
  } else {
    state.backTopFlag = false
  }
}
function clickCategory(e) {
  state.current = e.currentTarget.dataset.index
  state.scrollTop = 0
  state.manualScrollTop = 'goodTop'
  state.scrollTopHeight = 0
  emit('clickCategory', e)
}
function clickCategoryItem(e) {
  state.showScroll = false
  state.showFilterScroll = false
  state.scrollTopHeight = 0
  state.manualScrollTop = 'goodTop'
  state.scrollTop = 0
  emit('clickItem', e)
}
function clickThreeCategoryItem(e) {
  state.showScroll = false
  state.showFilterScroll = false
  state.scrollTopHeight = 0
  state.manualScrollTop = 'goodTop'
  state.scrollTop = 0
  emit('clickThreeItem', e)
}
function clickCategoryAll(e) {
  emit('clickAll', e)
}
function bindchange(e) {}
function onClickGoods(e) {
  emit('onClickGoods', e)
}
function addToCart(e) {
  emit('addToCart', e.detail)
}
function decrease(e) {
  emit('decrease', e.currentTarget.dataset)
}
function subscribeArrivalRemind(e) {
  emit('subscribeArrivalRemind', e.currentTarget.dataset)
}
function noop(e) {
  emit('noop', e.detail)
}
function onGetUserInfo(e) {
  emit('getUserInfo', e.detail)
}
function handleLeftCategory(categoryId) {
  const n = this
  uni.nextTick &&
    uni.nextTick(function () {
      const t = []
      let e = 0
      uni
        .createSelectorQuery()
        .in(n)
        .selectAll('.category-item')
        .boundingClientRect(function (i) {
          const height = (120 * app.globalData.systemInfo.windowWidth) / 750
          let tempHeight = 0 // 子分类的高度
          let index = null // 当前选择的分类的顺序
          ;(i.forEach((n, j) => {
            let h = 60
            if (j > 0) {
              h = n.top - i[j - 1].top
            }
            if (h > height) {
              tempHeight = h - height
              index = j
            }
            e = n.top
            if (index) {
              e = n.top - tempHeight
            }
            t.push({
              id: n.id,
              categoryId: n.dataset.id,
              offsetTop: e,
            })
          }),
            (state.sectionOffsetTops = t))
          console.log(t)
          uni.nextTick &&
            uni.nextTick(function () {
              t.forEach((e) => {
                if (e.categoryId == categoryId) {
                  state.offsetTop = e.offsetTop - height * 4
                }
              })
            })
        })
        .exec()
    })
}
function handleCategory(categoryId) {
  const n = this
  if (state.level === 3) {
    let children = []
    let tempCategories = null
    for (let i = 0; i < props.category.length; i++) {
      const ele = props.category[i]
      if (ele.children.length > 0) {
        for (let j = 0; j < ele.children.length; j++) {
          const item = ele.children[j]
          if (categoryId === item.categoryId) {
            children = item.children
            tempCategories = item
            break
          }
        }
      }
    }
    console.log(tempCategories)
    state.categoryList = children
    state.showScroll = false
    state.showFilterScroll = false
    state.offsetLeft = 0
    console.log('当前父分类：', categoryId, children)
    uni.nextTick &&
      uni.nextTick(function () {
        const t = []
        let e = 0
        uni
          .createSelectorQuery()
          .in(n)
          .selectAll('.right-category-item')
          .boundingClientRect(function (i) {
            ;(i.forEach(function (n) {
              ;((e = n.left),
                t.push({
                  id: n.id,
                  categoryId: n.dataset.id,
                  offsetLeft: e,
                }))
            }),
              (state.sectionOffsetLefts = t))
            if (props.childrenSelect !== '') {
              uni.nextTick &&
                uni.nextTick(function () {
                  t.forEach(function (e) {
                    if (e.categoryId == props.childrenSelect) {
                      state.offsetLeft = e.offsetLeft - 160
                    }
                  })
                })
            }
            console.log(t)
          })
          .exec()
      })
  }
}
function clickShowCategoryList() {
  state.showScroll = !state.showScroll
  state.showFilterScroll = false
}
function filterProducts() {
  state.showFilterScroll = !state.showFilterScroll
}
function handleScrolltolower(e) {
  console.log('handleScrolltolower')
  if (inScrolltoupper === true) {
    // 正在下拉刷新
    // scorll-view 的下拉刷新可能会触发
    return
  }
  console.log(e)
  console.log(state.page, state.pageCount)
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true
    let page = state.page
    ++page
    // 查询活动 - 标记为分页加载
    getProductsByCategoryId(page, true)
  } else {
    // 没有下一页，提示已经查询完毕
    if (app.globalData.goodsList != null && app.globalData.goodsList.length > 0) {
      state.noMore = true
    }
  }
}
function onPullDownRefresh() {
  console.log('onPullDownRefresh')
  handlescrolltoupper()
}
function handlescrolltoupper(e) {
  console.log('handlescrolltoupper')
  if (inScrolltoupper === true) {
    // 正在下拉刷新
    return
  }
  inScrolltoupper = true
  const self = this
  state.loaded = false
  state.noMore = false
  state.page = 1
  state.pageCount = 1
  getProductsByCategoryId()
}
function handleScroll(e) {
  console.log(e)
}
let inScrolltoupper = false

function getProductsByCategoryId(page = 1, isPagination = false) {
  // console.log('shibushijinrudaozheli')
  // 查询分类下商品
  const that = this
  if (hasQuery) {
    console.log('当前已经在查询')
    return
  }
  hasQuery = true
  console.log('this.data.zhiti', state.zhiti)
  let storeIdIn = ''
  if (state.zhiti) {
    storeIdIn = state.storeId
    storeIdIn = storeIdIn ? storeIdIn + ',' + storeIdIn : null
  } else {
    storeIdIn = app.globalData.storeInfo.id
    if (app.globalData.distributionStore && app.globalData.distributionStore.id) {
      const distributionStore = app.globalData.distributionStore
      storeIdIn = storeIdIn ? storeIdIn + ',' + distributionStore.id : distributionStore.id
    }
    if (app.globalData.nextDayStore && app.globalData.nextDayStore.id) {
      const nextDayStore = app.globalData.nextDayStore
      storeIdIn = storeIdIn ? storeIdIn + ',' + nextDayStore.id : nextDayStore.id
    }
  }
  if (state.storeIdActive1) {
    storeIdIn = state.storeId
  }
  const postData = {
    orderField: state.sortkeys.field,
    orderDirection: state.sortkeys.orderBy === 'asc' ? 'asc' : 'desc',
    storeIdIn,
    // categoryIdIn: this.data.zhiti ? "" : this.data.childrenSelect,
    categoryIdIn: props.childrenSelect,
    shipmentTypes: props.shipmentTypes,
    // shipmentTypes: this.data.filterType, // 筛选配送方式
    page,
    pageSize: 20,
    searchCount: true,
    // isOpen: 1
  }
  console.log('postData', postData, props.childrenSelect)
  console.log(state.loaded)
  if (state.isAndroid) {
    // wx.showLoading({
    //     title: "加载中...",
    // });
  }
  // 只有在非分页加载时才触发父组件的showLoading
  if (!isPagination) {
    emit('showLoadingChange', true)
  }
  productService
    .query(postData)
    .then((res) => {
      // wx.hideLoading();
      hasQuery = false
      setTimeout(() => {
        inScrolltoupper = false
      }, 300)
      if (res && res.records && res.records.length >= 0) {
        let tempProducts = app.globalData.goodsList
        if (page === 1) {
          tempProducts = []
        }
        tempProducts = tempProducts.concat(handleProducts(res.records))
        const newTempProducts = productsSort(tempProducts)
        const pageCount = parseInt(res.recordCount / res.pageSize) + 1
        if (state.zhiti) {
          state.page = res.page
          state.pageCount = pageCount
          app.globalData.goodsList = newTempProducts
          state.loadingGoods = true
          setTimeout(() => {
            state.loadingGoods = false
          }, 200)
        } else {
          if (postData.categoryIdIn === props.childrenSelect) {
            state.page = res.page
            state.pageCount = pageCount
            app.globalData.goodsList = newTempProducts
            state.loadingGoods = true
            setTimeout(() => {
              state.loadingGoods = false
            }, 200)
          }
        }
      }
      if (res.recordCount <= 20 || res.records.length < 20) {
        state.noMore = true
      }
      if (state.loading) {
        state.loading = false
      }
      // 只有在非分页加载时才触发父组件的showLoading
      state.loaded = true
      if (!isPagination) {
        emit('showLoadingChange', false)
      }
    })
    .catch((err) => {
      // wx.hideLoading();
      // 只有在非分页加载时才触发父组件的showLoading
      if (!isPagination) {
        emit('showLoadingChange', false)
      }
      hasQuery = false
      setTimeout(() => {
        inScrolltoupper = false
      }, 300)
      state.loaded = true
      if (state.loading) {
        state.loading = false
      }
      UTILS.showToast(err.message)
    })
}
function handleProducts(products) {
  const that = this
  const tempList = []
  if (products != null && products.length > 0) {
    const tempData = productsSort(products)
    tempData.forEach((data) => {
      const produtlabel = []
      const promotions = []
      let specifications = null
      if (data.labels && data.labels.length > 0) {
        data.labels.forEach((ele) => {
          if (ele.type === 'GOODSLABEL' && ele.color != null) {
            produtlabel.push(ele)
          } else if (ele.type === 'PROMOTIONLABEL') {
            promotions.push(ele)
          }
        })
      }
      if (data.productProperties && data.productProperties.length > 0) {
        for (let i = 0; i < data.productProperties.length; i++) {
          const ele = data.productProperties[i]
          if (ele.propertyName === '规格') {
            specifications = ele.propertyValue
            break
          } else {
          }
        }
      }
      const tempItem = {
        ...data,
        produtlabel,
        promotions,
        specifications: specifications || '',
      }
      tempList.push(tempItem)
    })
  }
  return tempList
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
function handleOrderBy(e) {
  const field = e.currentTarget.dataset.sortid
  const orderBy = e.currentTarget.dataset.orderby
  const sortkeys = {
    field,
    orderBy,
  }
  if (state.sortkeys.field === field) {
    if (orderBy === 'desc') {
      sortkeys.orderBy = 'asc'
    } else {
      sortkeys.orderBy = 'desc'
    }
  }
  state.sortkeys = sortkeys
  state.loaded = false
  hasQuery = false
  state.page = 1
  state.pageCount = 1
  getProductsByCategoryId(1)
}
function onProductReadyEnd() {}
function clickPopup() {
  state.showScroll = false
}

// Watch listeners converted from observers
watch(
  () => props.category,
  (t, e) => {
    const n = this
    if (t.length == e.length) return !1
  },
)

watch(
  () => props.shipmentTypes,
  (t, e) => {
    if (t) {
      const keys = Object.keys(state.filterType)
      keys.forEach((key) => {
        if (t.indexOf(key) > -1) {
          state.filterType.ALL = false
          state.filterType[key] = true
        } else {
          state.filterType[key] = false
        }
      })
      // state.filterType = state.filterType
      getProductsByCategoryId()
    }
    state.scrollTop = 0
    state.manualScrollTop = 'goodTop'
    state.scrollTopHeight = 0
  },
)

watch(
  () => props.currentCategory,
  (t, e) => {
    console.log(t, e)
    const n = this
    if (e == '') {
      handleLeftCategory(t)
    } else {
      const height = (120 * app.globalData.systemInfo.windowWidth) / 750
      uni.nextTick &&
        uni.nextTick(function () {
          state.sectionOffsetTops.forEach((e) => {
            if (e.categoryId == t) {
              state.offsetTop = e.offsetTop - height * 4
            }
          })
        })
    }
    state.scrollTop = 0
    state.manualScrollTop = 'goodTop'
    state.scrollTopHeight = 0
  },
)

watch(
  () => props.selectedSecondId,
  (t, e) => {
    const n = this
    handleCategory(t)
    if (e == '') {
      handleLeftCategory(t)
    } else {
      const height = (120 * app.globalData.systemInfo.windowWidth) / 750
      uni.nextTick &&
        uni.nextTick(function () {
          state.sectionOffsetTops.forEach((e) => {
            if (e.categoryId == t) {
              state.offsetTop = e.offsetTop - height * 4
            }
          })
        })
    }
    state.scrollTop = 0
    state.manualScrollTop = 'goodTop'
    state.scrollTopHeight = 0
  },
)

watch(
  () => props.childrenSelect,
  (t, e) => {
    console.log(t, e)
    console.log(state.currenSelect)
    if (t === '') {
      state.offsetLeft = 0
    } else {
      console.log(state.offsetLeft)
      state.childrenCategory = t
      const n = this
      t != e &&
        uni.nextTick &&
        uni.nextTick(function () {
          state.sectionOffsetLefts.forEach(function (e) {
            if (e.categoryId == t) {
              if (state.offsetLeft === 0) {
                state.offsetLeft = e.offsetLeft - 160
              } else {
                state.offsetLeft = 0
              }
              console.log(e.offsetLeft - 160)
            }
            // e.categoryId == t && n.setData({
            //   offsetLeft: e.offsetLeft - 160
            // }) && console.log(e.offsetLeft - 160);
          })
        })
      hasQuery = false
      state.loaded = false
      state.noMore = false
      state.manualScrollTop = 'goodTop'
      state.scrollTop = 0
      console.log('进入getProductsByCategoryId')
      getProductsByCategoryId()
    }
  },
)

watch(
  () => props.load,
  (t, e) => {},
)

watch(
  () => props.counts,
  (t, e) => {
    if (t != null && t.length > 0) {
      console.log(t)
      state.listCounts = t
    }
  },
)

watch(
  () => props.isPullDownRefresh,
  (t, e) => {
    console.log(t, e)
    if (t) {
      onPullDownRefresh()
    }
  },
)

watch(
  () => props.storeId,
  (t, e) => {
    console.log('监听t,e', t, e)
    if (t != null) {
      state.storeId = t
      state.storeIdActive1 = true
    }
  },
)
</script>
<style scoped>
/* components/category/category-vertical/category-vertical.wxss */
.content {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background: #fff;
}
.left-box {
  width: 161rpx;
  background: #f4f4f4;
}
.category-item {
  width: 100%;
  box-sizing: border-box;
  font-size: 26rpx;
  color: #4d4d4d;
  line-height: 98rpx;
  text-align: left;
  position: relative;
}
.category-item-children-active .category-children-active > view {
  font-size: 30rpx;
  margin-top: -8rpx;
}
.category-item-children-active .category-children {
  font-size: 30rpx;
  background: #fff;
}
/* .category-item-children-active .category-item>view {
  font-size: 30rpx;
} */
.category-item > view {
  font-size: 26rpx;
  color: #333;
  line-height: 36rpx;
  position: relative;
  box-sizing: border-box;
}
.category-item-three > view {
  /* font-size: 26rpx; */
  color: #808080;
  line-height: 36rpx;
  position: relative;
  box-sizing: border-box;
}
.category-item .category-item-title {
  width: 100%;
  height: 98rpx;
  font-size: 26rpx;
  line-height: 98rpx;
  padding: 0 25rpx;
  background: #f7f8fa;
  /* overflow: hidden;
  text-overflow: ellipsis; */
  white-space: nowrap;
  position: relative;
}
.category-item .category-item-title-three {
  padding: 20rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: content-box;
}
.category-item .category-item-title-three-pic {
  padding: 20rpx 0 20rpx 0;
}
.category-children {
  padding: 30rpx 16rpx 30rpx 35rpx;
  font-size: 24rpx;
  position: relative;
  color: #111;
}
.category-children-three {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  font-weight: 500 !important;
  padding: 20rpx;
  height: 120rpx;
  /* line-height: 120rpx; */
}
/* .category-children-content {
} */
.category-children-three image {
  height: 40rpx;
  width: auto;
}
.category-children .children_icon {
  content: '';
  display: block;
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #666;
  position: absolute;
  left: 18rpx;
  top: 50%;
  margin-top: -4rpx;
}
.category-children-active {
  /* color: #ff7200 !important; */
}
.category-children-active .children_icon {
  background: #ff7200;
}
.category-item-active .category-item-title {
  position: relative;
  width: calc(100% / (26 / 30));
  font-size: 26rpx;
  color: #ff7200;
  font-weight: 700;
}
.category-item-active .category-item-title .category-item_icon {
  content: '';
  display: block;
  width: 8rpx;
  height: 100%;
  background: #ff7200;
  position: absolute;
  left: 0;
  top: 0;
}
.category-item-active .category-children {
  background: #fff;
}
.category-item-active .category-children .top-semicircle {
  width: 20rpx;
  height: 20rpx;
  overflow: hidden;
  background: #fff;
  position: absolute;
  right: 0;
  top: -20rpx;
}
.category-item-active .category-children .top-semicircle > view {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  left: -20rpx;
  top: -20rpx;
}
.category-item-active .first .top-semicircle > view {
  background: #f7f8fa;
}
.category-item-active .category-children .bottom-semicircle {
  width: 20rpx;
  height: 20rpx;
  overflow: hidden;
  background: #fff;
  position: absolute;
  right: 0;
  bottom: -20rpx;
  z-index: 1;
}
.category-item-active .category-children .bottom-semicircle > view {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  left: -20rpx;
  bottom: -20rpx;
}
.category-item-active .last .bottom-semicircle > view {
  background: #f7f8fa;
}
.category-item-children-active .category-item-title {
  background: #fff;
  position: relative;
  font-size: 30rpx;
  color: #ff7200;
}
.category-item-children-active .category-item-title-three {
  font-size: 26rpx;
  font-weight: 700;
}
.category-item-children-active .category-item-title text {
  display: block;
  background: #fff;
  position: relative;
  font-size: 26rpx;
  /* color: #ff7200; */
  /* text-overflow: ellipsis; */
  white-space: nowrap;
  /* position: relative; */
}
.category-item-title-three text {
  /* font-size: 26rpx; */
  height: 36rpx;
  line-height: 36rpx;
}
.category-item-children-active .category-item-title-three text {
  /* font-size: 26rpx; */
  height: 36rpx;
  line-height: 36rpx;
}
.category-item-title-three image {
  height: 20px;
  width: auto;
  margin-left: -20rpx;
}
.category-item-children-active .category-item-title .category-item_icon {
  content: '';
  display: block;
  width: 8rpx;
  height: 50rpx;
  background: #ff7200;
  position: absolute;
  left: 0;
  top: 28rpx;
  border-radius: 16rpx;
}
.category-item-children-active .top-semicircle {
  width: 20rpx;
  height: 20rpx;
  overflow: hidden;
  background: #fff;
  position: absolute;
  right: 0;
  top: -20rpx;
}
.category-item-children-active .top-semicircle > view {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #f7f8fa;
  position: absolute;
  left: -20rpx;
  top: -20rpx;
}
.category-item-children-active .bottom-semicircle {
  width: 20rpx;
  height: 20rpx;
  overflow: hidden;
  background: #fff;
  position: absolute;
  right: 0;
  bottom: -20rpx;
  z-index: 1;
}
.category-item-children-active .bottom-semicircle > view {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #f7f8fa;
  position: absolute;
  left: -20rpx;
  bottom: -20rpx;
}
.category-item:first-of-type .top-semicircle.parent {
  display: none;
}
.category-swiper {
  /* width: 589rpx; */
  height: 100%;
  background: #fff;
}
.category-box {
  width: 100%;
  height: 100%;
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
/* 右侧三级分类 */
.top-navigation-box {
  display: flex;
  align-items: center;
  width: calc(100% - 10rpx);
  position: relative;
  padding-bottom: 20rpx;
  padding-left: 10rpx;
}
.right-category-text {
  font-size: 24rpx;
  color: #343434;
  line-height: 70rpx;
  width: calc(100% - 24rpx);
  padding-left: 24rpx;
}
.right-category-box {
  width: calc(100% - 90rpx);
  white-space: nowrap;
}
.right-category-box .right-category-item {
  font-size: 24rpx;
  line-height: 70rpx;
  display: inline-block;
  width: 176rpx;
  height: 70rpx;
  background: #f4f4f4;
  border-radius: 8rpx;
  color: #7e7e7e;
  margin-right: 10rpx;
  text-align: center;
}
.top-navigation-box .right-show-btn {
  width: 83rpx;
  padding-right: 7rpx;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.top-navigation-box .right-show-btn > view {
  width: 43rpx;
  height: 58rpx;
  background: #f7f8fa;
  border-radius: 22rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.top-navigation-box .right-show-btn.show view {
  background: #ffffff;
}
.top-navigation-box .right-show-btn > view text {
  font-size: 16rpx;
  line-height: 32rpx;
  height: 32rpx;
  display: block;
  font-weight: 400;
  color: #666666;
}
.top-navigation-box .right-show-btn.show text {
  height: 20rpx;
}
.top-navigation-box .right-show-btn image {
  width: 18rpx;
  height: 10rpx;
}
.top-navigation-box .right-show-btn.show image {
  transform: rotate(180deg);
}
.category-list-popup {
  display: flex;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 0;
  top: 76rpx;
  z-index: 9;
}
.category-list-box {
  display: flex;
  width: 100%;
  background: #fff;
  padding: 4rpx 19rpx 8rpx 16rpx;
  flex-wrap: wrap;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
}
.category-list-box .category-item-box {
  font-size: 24rpx;
  line-height: 70rpx;
  display: inline-block;
  width: 176rpx;
  height: 70rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
  color: #7e7e7e;
  margin: 0 10rpx 14rpx 0;
  text-align: center;
}
.category-list-box .category-item-box:nth-of-type(3n) {
  margin-right: 0;
}
.skeleton {
}
.item-card-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 15rpx;
}
.skeleton .item {
  min-height: 180rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 27rpx 36rpx 20rpx 14rpx;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.skeleton .item .img {
  width: 174rpx;
  height: 174rpx;
  overflow: hidden;
  float: left;
  background: #f7f7f7;
  margin-top: 10rpx;
}
.skeleton .item .text {
  width: calc(100% - 195rpx);
  min-height: 210rpx;
  position: relative;
  float: right;
}
.skeleton .item .text view {
  background: #f7f7f7;
}
.skeleton .item .text view.text1 {
  width: 100%;
  height: 42rpx;
  margin: 10rpx 0 5rpx 0;
}
.skeleton .item .text view.text2 {
  width: 100%;
  height: 36rpx;
}
.skeleton .item .text view.text3 {
  width: 100%;
  height: 30rpx;
  margin: 10rpx 0;
}
.skeleton .item .text view.text4 {
  width: 150rpx;
  height: 40rpx;
  margin-top: 15rpx;
}
.skeleton .item .cart {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  right: 30rpx;
  bottom: 40rpx;
  background: #f7f7f7;
}
.skeleton .card-item {
  width: 271rpx;
  height: 417rpx;
  position: relative;
  margin-bottom: 20rpx;
}
.skeleton .card-item .img {
  width: 271rpx;
  height: 271rpx;
  overflow: hidden;
  background: #f8f8f8;
}
.skeleton .card-item .text {
  width: 100%;
  height: 134rpx;
  position: relative;
  float: right;
}
.skeleton .card-item .text view {
  background: #f7f7f7;
}
.skeleton .card-item .text view.text1 {
  width: 100%;
  height: 26rpx;
  margin-top: 12rpx;
  margin-bottom: 8rpx;
}
.skeleton .card-item .text view.text2 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100rpx;
  height: 36rpx;
}
.skeleton .card-item .cart {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  right: 17rpx;
  bottom: 12rpx;
  background: #f7f7f7;
}
.sort-toggle {
  position: relative;
  width: 100%;
  height: 80rpx;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}
.sort-toggle .sort-btns {
  /* width: calc(100% - 100rpx); */
  width: 100%;
  height: 80rpx;
  float: left;
  display: flex;
  justify-content: space-between;
}
.sort-toggle .sort-btns .btn {
  margin: 0rpx 30rpx;
  height: 44rpx;
  margin-top: 18rpx;
  float: left;
  line-height: 44rpx;
  font-size: 25rpx;
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
.no-data {
  width: 100%;
  height: calc(100vh - 308rpx);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
}
.no-data image {
  width: 242rpx;
  height: 261rpx;
}
.no-more-goods {
  display: block;
  width: 100%;
  text-align: center;
  color: #999999;
  font-size: 28rpx;
  line-height: 60rpx;
  height: 60rpx;
  background: #ffffff;
  padding: 20rpx 0;
}
.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #ffffff;
  border-radius: 0;
}
.loading-btn::after {
  border: 0;
}
.scroll-top {
  width: 92rpx;
  height: 92rpx;
  position: fixed;
  right: 40rpx;
  bottom: 22%;
  z-index: 6;
}
.filter-box {
  position: absolute;
  left: 0;
  top: 41px;
  width: 100%;
  height: 1600rpx;
  z-index: 9;
}
.filter-box .bg-click {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
.filter-bg {
  width: 100%;
  background-color: #fff;
  padding: 23rpx;
  box-sizing: border-box;
  border-radius: 0rpx 0rpx 30rpx 30rpx;
}
.filter-box .title {
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
}
.filter-box .filter-item-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.filter-item-box .filter-item {
  width: 169rpx;
  height: 60rpx;
  background: #f4f4f4;
  border-radius: 30rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  line-height: 60rpx;
  text-align: center;
  margin-top: 20rpx;
}
.filter-box .filter-btn-box {
  width: 100%;
  margin-top: 40rpx;
  display: flex;
  justify-content: space-between;
}
.filter-box .filter-btn-box .filter-btn-reset {
  width: 197rpx;
  height: 70rpx;
  background: #f4f4f4;
  border-radius: 35rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  line-height: 70rpx;
  text-align: center;
}
.filter-box .filter-btn-box .filter-btn-search {
  width: 335rpx;
  height: 70rpx;
  border-radius: 35rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: #ffffff;
  text-align: center;
  line-height: 70rpx;
}
.parent-line {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 70%;
  height: 1px;
  transform: translateX(-50%);
  z-index: 2;
  background-color: #fff;
}
.left-box .category-item:last-child .parent-line {
  background-color: transparent;
}
.children-line {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 70%;
  height: 1px;
  transform: translateX(-50%);
  z-index: 2;
  background-color: #f4f4f4;
}
/* .category-item > .category-item-title:last-child .parent-line {
  background-color: transparent;
} */
.top-navigation-box scroll-view ::-webkit-scrollbar {
  width: 0;
}
</style>
