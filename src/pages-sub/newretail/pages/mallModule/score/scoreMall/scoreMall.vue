<route lang="json5" type="page">
{
  layout: 'default-newretail',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
    },
    'mp-weixin': {
      navigationStyle: 'custom',
      titlePenetrate: 'YES',
      defaultTitle: '',
    },
  },
}
</route>
<template>
  <!-- pages/scoreMall/scoreMall.wxml -->
  <!-- banner 图片 -->
  <view>
    <navigationBar
      :background="'transparent'"
      :isShowTopNavigationFlag="true"
      :isShowTopNavigation="false"
      :title="state.navigationBarTitle"
    ></navigationBar>
    <!-- 顶部 -->
    <view class="column-box">
      <image :src="state.imagesPath.scoreBg" class="i-t-bg"></image>
      <view class="i-t-left">
        <text class="left-one">我的积分</text>
        <text class="left-num">{{ state.score }}</text>
        <text class="left-pass" v-if="state.expireBalance && state.expireDate">
          {{ state.expireBalance }}积分{{ state.expireDate }}过期
        </text>
      </view>
      <view class="i-t-right" @click="toScoreOrder">
        <image :src="state.imagesPath.scoreRecordIcon" class="icon"></image>
        <text>兑换记录</text>
        <button v-if="!state.hasUserInfo" class="authorization" @click="getUserInfo"></button>
      </view>
    </view>
    <!-- 当前门店 -->
    <!-- <view class="current-store-box" @click="toSelectStore">
      <image :src="state.imagesPath.scoreStoreIcon"></image>
      <text>当前门店：{{ state.storeName }}</text>
      <image :src="state.imagesPath.iconRight1"></image>
    </view> -->
    <!-- tabbar -->
    <view class="tab-box">
      <view class="tab-bar">
        <template v-for="(item, index) in state.tabBarList" :key="index">
          <view
            v-if="item.show"
            :class="item.type === state.scoreProductType ? 'tab-bar-item active' : 'tab-bar-item'"
            :data-type="item.type"
            @click="handleClickTab"
          >
            <view class="item-name">{{ item.name }}</view>
            <view class="item-activity"></view>
          </view>
        </template>
      </view>
      <!-- 切换展示图标 -->
      <view class="score-show-icon" @click="changeShowModel">
        <image
          v-if="state.showModel === 'shu'"
          :src="state.imagesPath.scoreHeng"
          class="score-heng"
        ></image>
        <image v-else :src="state.imagesPath.scoreShu" class="score-shu"></image>
      </view>
    </view>

    <!-- 商品列表-->
    <view
      :class="state.showModel === 'shu' ? 'goods-shu' : 'goods-heng'"
      v-if="
        state.isCanBeOrdered &&
        state.goodsList.length > 0 &&
        state.scoreProductType === 'SCORE_PRODUCT_PRODUCT'
      "
    >
      <!-- 去掉跳转进去详情 -->
      <!-- <view class="goods-item" wx:for="{{goodsList}}" wx:key="idx" data-goodsId="{{item.id}}" data-balance="{{item.total}}" data-traceId="{{item.traceId}}" bindtap="toGoodsDetail"> -->
      <view
        class="goods-item"
        v-for="(item, index) in state.goodsList"
        :key="index"
        :data-goodsId="item.id"
        :data-balance="item.total"
        :data-traceId="item.traceId"
      >
        <view class="goods-img-box">
          <image v-if="item.product" :src="item.product.imageUrl" mode="widthFix"></image>
          <image
            class="qiangguang"
            :hidden="item.total > 0 ? true : false"
            :src="state.imagesPath.icon_exchange_out"
          ></image>
        </view>
        <!-- <view class="store-balance" style="background-color: {{themeColor}}" wx:for-item="{{item.product.balance>=0}}">门店库存：{{item.product.balance}}件</view> -->
        <view class="goods-info">
          <view class="goods-name">
            <!-- <view class="goods-introduce" wx:if="{{item.product.produtlabel.length > 0 || item.product.specifications}}">
          <text wx:for="{{item.product.produtlabel}}" wx:key="index" style="background:rgb({{item.color}})" wx:if="{{index < 3}}">{{item.labelName}}</text>
        </view> -->
            <text class="name" v-if="item.product">{{ item.product.name }}</text>
          </view>
          <text class="goods-now-state">
            已兑：{{ filters.filterProductNum(item.prizeCount, item.total) }}/{{ item.total }}
          </text>
          <!-- <text class="goods-desc">{{item.productem.description?item.product.description:''}}</text> -->
          <!-- <view class="progress-box">
        <view class="progress-content-box">
          <progress percent="{{item.prizeCount / item.total * 100}}" active stroke-width="10" activeColor="{{state.themeColor}}" backgroundColor="#E6E6E6" />
        </view>
        <text>{{item.prizeCount}}/{{item.total}}</text>
      </view> -->
          <view class="goods-bottom">
            <view class="goods-price">
              <view class="nowPrice" v-if="item.score">
                {{ item.score }}
                <text class="small-font">积分</text>
              </view>
              <view class="nowPrice" v-if="item.amount">
                + {{ item.amount }}
                <text class="small-font">元</text>
              </view>
              <text
                class="oldPrice"
                v-if="
                  item.product &&
                  item.product.originalPrice &&
                  item.product.sellPrice < item.product.originalPrice
                "
              >
                ￥{{ item.originalPrice }}
              </text>
            </view>
            <view @click.stop="catchToDetals">
              <button v-if="!state.hasUserInfo" class="enable" @click="getUserInfo">
                立即兑换
              </button>
              <button v-else-if="!state.isMember" class="enable" @click.stop="toAuthorize">
                立即兑换
              </button>
              <view v-else>
                <button
                  v-if="
                    item.availableStockAmount !== 0 &&
                    item.total !== 0 &&
                    item.product &&
                    item.product.balance !== 0
                  "
                  :class="state.score >= item.score ? 'enable' : 'unable'"
                  :data-goodsId="item.id"
                  :data-type="item.type"
                  :data-balance="item.total"
                  :data-traceId="item.traceId"
                  @click.stop="score >= item.score ? 'toPerfectOrder' : ''"
                >
                  {{ state.score >= item.score ? '立即兑换' : '积分不足' }}
                </button>
                <button
                  v-if="
                    item.availableStockAmount === 0 ||
                    item.total === 0 ||
                    (item.product && item.product.balance === 0)
                  "
                  class="unable"
                  :data-goodsId="item.product && item.product.id"
                  :data-type="item.type"
                  :data-balance="item.total"
                  :data-traceId="item.traceId"
                  @click.stop="toPerfectOrder"
                >
                  已兑完
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 券列表 -->
    <view
      :class="state.showModel === 'shu' ? 'coupon-shu' : 'coupon-heng'"
      v-if="state.couponList.length > 0 && state.scoreProductType === 'SCORE_PRODUCT_COUPON'"
    >
      <view
        class="coupon-board"
        v-for="(item, index) in state.couponList"
        :key="index"
        @click="toCouponDetail"
        :data-index="index"
      >
        <!-- 券主体 -->
        <view
          :class="
            'coupon-item ' + (state.couponStatus === 'history' ? 'use-box' : state.couponStatus)
          "
          :style="externalStyle"
          :data-activityId="coupon.couponActivityId"
          :data-external="coupon.isExternal"
          :data-id="coupon.id"
          :data-type="coupon.function !== 'FREESHIP' ? 'discount' : 'freeship'"
          @click="clickCouponItem"
        >
          <!-- <image class="coupon-item-bg" src="{{false ? imagesPath.ticket1 : imagesPath.ticket2}}" ></image> -->
          <view class="main-coupon">
            <view class="main-coupon-function">
              <image :src="state.imagesPath.scoreCoupon" class="coupon-bg"></image>
              <view class="coupon-head-info">
                <!-- <view hidden="{{item.couponActivity.function !== 'CASH' && !(item.couponActivity.function === 'FREESHIP' && item.couponActivity.faceValue)}}">￥</view> -->
                <view
                  v-if="
                    item.couponActivity.function === 'CASH' ||
                    (item.couponActivity.function === 'FREESHIP' && item.couponActivity.faceValue)
                  "
                >
                  {{ item.couponActivity.nr_headInfo }}
                </view>
                <view
                  class="price-icon"
                  v-if="
                    item.couponActivity.function === 'CASH' ||
                    (item.couponActivity.function === 'FREESHIP' && item.couponActivity.faceValue)
                  "
                >
                  元
                </view>
                <view v-else>{{ item.couponActivity.nr_headInfo }}</view>
                <view :hidden="item.couponActivity.function !== 'DISCOUNT'">折</view>
              </view>
            </view>
            <view class="main-coupon-detail">
              <text class="main-coupon-detail-title">{{ item.couponActivity.name }}</text>
              <view class="main-coupon-detail-desc">{{ item.couponActivity.nr_condition }}</view>
              <view class="coupon-item-bottom">
                <!-- <image class="coupon-time-icon" src="{{imagesPath.pass_clock}}" ></image> -->
                <!-- <text class="time">兑券时间：{{filters.filtDateHead(item.couponActivity.startDate)}}~{{filters.filtDateHead(item.couponActivity.endDate)}}</text> -->
                <text class="time">
                  兑券时间：{{ filters.filtDateHead(item.couponActivity.endDate) }} 截止
                </text>
              </view>
              <!-- 积分 + 按钮 -->
              <view class="coupon-bottom">
                <view class="main-coupon-score-value">
                  {{ item.score }}
                  <text class="small-font">积分</text>
                </view>
                <!-- 立即兑换按钮 -->
                <view
                  class="exchange-btn-board-coupon"
                  :data-goodsId="item.id"
                  :data-type="item.type"
                  :data-balance="item.total"
                  :data-traceId="item.traceId"
                  @click.stop="toPerfectOrder"
                >
                  兑换
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 第三方券列表 -->
    <view
      :class="state.showModel === 'shu' ? 'coupon-shu' : 'coupon-heng'"
      v-if="
        state.thirdPartycouponList.length > 0 &&
        state.scoreProductType === 'SCORE_PRODUCT_THIRDCOUPONCODE'
      "
    >
      <view
        class="coupon-board"
        v-for="(item, index) in state.thirdPartycouponList"
        :key="index"
        :data-index="index"
      >
        <!-- 券主体 -->
        <view
          :class="
            'coupon-item ' + (state.couponStatus === 'history' ? 'use-box' : state.couponStatus)
          "
        >
          <view class="main-coupon">
            <view class="main-coupon-function">
              <image :src="state.imagesPath.scoreCoupon" class="coupon-bg"></image>
              <view class="coupon-head-info">
                <!-- <view hidden="{{item.couponActivity.function !== 'CASH' && !(item.couponActivity.function === 'FREESHIP' && item.couponActivity.faceValue)}}">￥</view> -->
                <view
                  v-if="
                    item.couponActivity.function === 'CASH' ||
                    (item.couponActivity.function === 'FREESHIP' && item.couponActivity.faceValue)
                  "
                >
                  {{ item.couponActivity.nr_headInfo }}
                </view>
                <view
                  class="price-icon"
                  v-if="
                    item.couponActivity.function === 'CASH' ||
                    (item.couponActivity.function === 'FREESHIP' && item.couponActivity.faceValue)
                  "
                >
                  元
                </view>
                <view v-else>{{ item.couponActivity.nr_headInfo }}</view>
                <view :hidden="item.couponActivity.function !== 'DISCOUNT'">折</view>
              </view>
            </view>
            <view class="main-coupon-detail">
              <text class="main-coupon-detail-title">{{ item.couponActivity.name }}</text>
              <view class="main-coupon-detail-desc">{{ item.couponActivity.nr_condition }}</view>
              <view class="coupon-item-bottom">
                <!-- <image class="coupon-time-icon" src="{{imagesPath.pass_clock}}" ></image> -->
                <!-- <text class="time">兑券时间：{{filters.filtDateHead(item.couponActivity.startDate)}}~{{filters.filtDateHead(item.couponActivity.endDate)}}</text> -->
                <text class="time">
                  兑券时间：{{ filters.filtDateHead(item.couponActivity.endDate || item.endTime) }}
                  截止
                </text>
              </view>
              <!-- 积分 + 按钮 -->
              <view class="coupon-bottom">
                <view class="main-coupon-score-value">
                  {{ item.score }}
                  <text class="small-font">积分</text>
                </view>
                <!-- 立即兑换按钮 -->
                <view
                  class="exchange-btn-board-coupon"
                  :data-goodsId="item.id"
                  :data-type="item.type"
                  :data-balance="item.total"
                  :data-traceId="item.traceId"
                  @click.stop="toPerfectOrder"
                >
                  兑换
                </view>
              </view>
            </view>
          </view>
          <!-- <image class="coupon-item-bg" src="{{false ? state.imagesPath.ticket1 : state.imagesPath.ticket2}}" ></image>
      <view class="coupon-item-top">
        <view class="name">{{item.name}}</view>
        <text class="time">活动有效期：{{filters.filtDateHead(item.beginTime)}}~{{filters.filtDateHead(item.endTime)}}</text>
      </view> -->
        </view>
        <!-- 券兑换积分 -->
        <!-- <text class="score-value" style="color: {{themeColor}}">{{item.score}}积分</text> -->
        <!-- 立即兑换按钮 -->
        <!-- <view class="exchange-btn-board" data-goodsId="{{item.id}}" data-type="{{item.type}}" catchtap="toPerfectOrder" style="color: {{state.themeColor}}">
      <text style="color: {{state.themeColor}}">立即兑换</text>
      <image src="{{state.imagesPath.orangeArrowRight}}" ></image>
    </view> -->
      </view>
    </view>
    <view
      v-if="
        !state.isCanBeOrdered ||
        (state.goodsList.length == 0 && state.scoreProductType === 'SCORE_PRODUCT_PRODUCT') ||
        (state.couponList.length == 0 && state.scoreProductType === 'SCORE_PRODUCT_COUPON') ||
        (state.thirdPartycouponList.length == 0 &&
          state.scoreProductType === 'SCORE_PRODUCT_THIRDCOUPONCODE')
      "
      class="no-data"
    >
      <image :src="state.imagesPath.imgNoData"></image>
    </view>
    <button
      class="loading-btn"
      :style="'color: ' + state.themeColor"
      :loading="state.loading"
      v-show="state.loading"
    >
      正在加载...
    </button>
    <view class="order-end" v-show="state.noMore">~我也是有底线的~</view>
    <!-- 旧版兑换弹窗 积分礼券走这里 -->
    <popup
      :show="state.show.middle"
      v-if="state.scoreProductType != 'SCORE_PRODUCT_PRODUCT'"
      position="middle"
      custom-class="middle"
    >
      <view class="popup-box">
        <view class="popup-title">
          <text>{{ state.couponStatusText }}</text>
        </view>
        <view class="receive-message" v-if="state.couponStatus === 'thirdCouponSuccess'">
          <text>{{ state.receiveMessage }}</text>
          <text class="thirdCouponCode">{{ state.thirdCouponCode }}</text>
        </view>
        <text class="receive-message" v-if="state.couponStatus === 'couponSuccess'">
          {{ state.receiveMessage }}
        </text>
        <text
          class="receive-message"
          v-if="state.couponStatus === 'hint' || state.couponStatus === 'failed'"
        >
          {{ state.receiveMessage }}
        </text>
        <view class="popup-button">
          <view
            v-if="state.couponStatus === 'couponSuccess'"
            :style="'color: ' + state.themeColor"
            class="left-button"
            @click="handleGoOn"
          >
            继续兑换
          </view>
          <view
            v-if="state.couponStatus === 'thirdCouponSuccess'"
            :style="'color: ' + state.themeColor"
            class="left-button"
            @click="handleGoOn"
          >
            继续兑换
          </view>
          <view
            v-if="state.couponStatus === 'hint'"
            :style="'color: ' + state.themeColor"
            class="left-button"
            @click="handleGoOn"
          >
            我再想想
          </view>
          <view
            v-if="state.couponStatus === 'couponSuccess'"
            :style="'background-color: ' + state.themeColor"
            class="right-button"
            @click="handleToMyCoupon"
          >
            查看我的优惠券
          </view>
          <view
            v-if="state.couponStatus === 'thirdCouponSuccess'"
            :style="'background-color: ' + state.themeColor"
            class="right-button"
            @click="handleToMyThirdCoupon"
          >
            查看我的兑换码
          </view>
          <view
            v-if="state.couponStatus === 'hint'"
            :style="'background-color: ' + state.themeColor"
            class="right-button"
            @click="canClick ? 'handleConvert' : ''"
          >
            确认兑换
          </view>
          <view
            v-if="state.couponStatus === 'failed'"
            :style="'color: ' + state.themeColor"
            class="middle-button"
            @click="handleGoOn"
          >
            确定
          </view>
        </view>
      </view>
    </popup>
    <!-- 改-- 新版商品兑换弹窗 -->
    <popup
      :show="state.show.middle"
      v-if="state.scoreProductType === 'SCORE_PRODUCT_PRODUCT'"
      position="bottom"
      custom-class="middle"
    >
      <view class="exchange-popup">
        <view class="e-p-goods">
          <view
            class="ex-goods-left"
            v-if="
              state.scoreProductType === 'SCORE_PRODUCT_PRODUCT' &&
              state.selectGood &&
              state.selectGood.product
            "
          >
            <image
              :src="state.selectGood.product.imageUrl"
              mode="widthFix"
              class="goods-img"
            ></image>
          </view>
          <view class="ex-goods-right" v-if="state.selectGood && state.selectGood.product">
            <view class="goods-title">{{ state.selectGood.product.name }}</view>
            <view class="goods-price">
              <text class="small-font">兑换价</text>
              <view class="nowPrice" v-if="state.selectGood.score">
                {{ state.selectGood.score }}
                <text class="small-font">积分</text>
              </view>
              <view class="nowPrice" v-if="state.selectGood.amount">
                + {{ state.selectGood.amount }}
                <text class="small-font">元</text>
              </view>
            </view>
          </view>
          <view class="close-btn" @click="handleGoOn">x</view>
        </view>
        <view class="e-p-operate">
          <view class="operate-box">
            <text class="o-b-font">购买数量</text>
            <view class="operate-box">
              <view class="operate-reduce" @click="reducePro">-</view>
              <view class="o-b-num">{{ state.productNum }}</view>
              <view
                :data-score="state.selectGood.score"
                :data-total="state.selectGood.total"
                :data-useNum="state.selectGood.prizeCount"
                class="operate-add"
                @click="addPro"
              >
                +
              </view>
            </view>
          </view>
          <text class="last-num">
            剩余{{
              filters.filterProductNum(state.selectGood.total - state.selectGood.prizeCount)
            }}件
          </text>
        </view>
        <view class="e-p-btn" @click="canClick ? 'handleConvert' : ''">下一步</view>
      </view>
    </popup>
    <!-- 提示升级弹窗 -->
    <popup
      :show="state.show.upgrade"
      position="middle"
      custom-class="middle"
      @close="toggleUpgradePopup"
    >
      <view class="popup-upgrade-box">
        <view class="popup-upgrade-title">
          <text>温馨提示</text>
        </view>
        <view class="popup-upgrade-content">
          当前等级剩余兑换次数不足{{ state.showScoreUpdate ? '您可以去升级会员等级' : '' }}!
        </view>
        <view class="popup-upgrade-button">
          <view
            :style="'background-color: ' + state.theme.color"
            @click="handleUpgrade"
            v-if="state.showScoreUpdate"
          >
            升级会员等级
          </view>
          <view
            :style="'background-color: ' + state.theme.color"
            @click="toggleUpgradePopup"
            v-else
          >
            我知道了
          </view>
        </view>
      </view>
    </popup>
    <authorize @login="handleUserLogin"></authorize>
  </view>
</template>
<script setup>
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsCouponHandler from '@/utils/newretail/couponHandler'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiHelpActivityServiceJs from '@/service/api/newretail/helpActivityService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiBannerServiceJs from '@/service/api/newretail/bannerService'
import _apiScoreProductService from '@/service/api/newretail/scoreProductService'
import * as filters from '@/utils/newretail/filters'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue'
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue'
const app = getApp()

// pages/scoreMall/scoreMall.js

const scoreProductService = _apiScoreProductService
const bannerService = _apiBannerServiceJs
const memberService = _apiMemberServiceJs
const helpActivityService = _apiHelpActivityServiceJs
const productService = _apiProductServiceJs
const utils = _utilsUtilsJs
const ADDRESS = _utilsAddressJs
const NAVPAGE = _utilsNavPageJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const couponHandler = _utilsCouponHandler
const themeManager = _utilsThemeManagerJs
const sysService = _apiSystemServiceJs
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

// Module-level variables for lifecycle management
let changeStore = false
let pageOnHide = false
let options = {}

const state = reactive({
  isCanBeOrdered: true,
  productNum: 1,
  // 兑换数量
  expireBalance: null,
  expireDate: null,
  showModel: 'heng',
  // 显示模式
  showLoading: false,
  navigationBarTitle: '积分商城',
  imagesPath: IMGAGESPATH,
  banners: [],
  goodsList: [],
  couponList: [],
  thirdPartycouponList: [],
  member: {},
  score: 0,
  storeName: '',
  storeId: '',
  phone: false,
  hasUserInfo: false,
  isMember: false,
  theme: themeManager,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    upgrade: false,
  },
  couponStatusText: '兑换成功',
  receiveMessage: '优惠券已放入你的券包',
  couponStatus: '',
  selectGood: '',
  thirdCouponCode: '',
  scoreCoupon: false,
  scoreGoods: false,
  thirdPartyCoupon: false,
  memberGrade: '',
  memberShip: [],
  canClick: true,
  tabBarList: [
    {
      name: '积分商品',
      type: 'SCORE_PRODUCT_PRODUCT',
      show: true,
    },
    {
      name: '积分换券',
      type: 'SCORE_PRODUCT_COUPON',
    },
    {
      name: '外部礼券',
      type: 'SCORE_PRODUCT_THIRDCOUPONCODE',
    },
  ],
  scoreProductType: 'SCORE_PRODUCT_PRODUCT',
  pageData: {
    page: 1,
    pageSize: 10,
    pageCount: 0,
    records: [],
  },
  loading: false,
  noMore: false,
  nextGradeNo: '',
  showScoreUpdate: false,
})
function changeShowModel() {
  state.showModel = state.showModel === 'heng' ? 'shu' : 'heng'
  uni.setStorageSync('showModel', state.showModel)
}
function toSelectStore() {
  changeStore = true
  NAVPAGE.toSelectStore()
}
function handleClickTab(e) {
  const tabType = e.currentTarget.dataset.type
  state.scoreProductType = tabType
  state.pageData = {
    page: 1,
    pageSize: 10,
    pageCount: 0,
    records: [],
  }
  state.noMore = false
  state.goodsList = []
  state.couponList = []
  state.thirdPartycouponList = []
  getScoreProduct('', tabType)
}
function bannerJumping(e) {
  const that = this
  const bannerId = e.currentTarget.dataset.id
  const bannerList = state.banners
  let advertisementInfo = null
  bannerList.forEach((item) => {
    if (item.id === bannerId) {
      advertisementInfo = item
    }
  })
  toAdPage(advertisementInfo, 'banner')
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
  } else {
  }
}
function queryMemberShip() {
  const self = this
  return new Promise(function (resolve, reject) {
    memberService.queryGrade().then((res) => {
      if (res) {
        res = utils.compareMemberGrade(res)
        const memberShip = [
          {
            id: 'ALL',
          },
        ]
        res.forEach((el) => {
          const grade = {
            id: '',
          }
          grade.id = el.id
          memberShip.push(grade)
        })
        state.memberShip = memberShip
        resolve(state.memberShip)
      } else {
        reject()
      }
    })
  })
}
function getScoreProduct(storeId, type) {
  const that = this
  const storeIdIn = [storeId]
  state.showLoading = true
  ADDRESS.getDistributionStore()
    .then((res) => {
      if (res) {
        storeIdIn.push(res.id)
      }
      hadnleGetScoreProduct(storeIdIn, type)
    })
    .catch((err) => {
      hadnleGetScoreProduct(storeIdIn, type)
    })
}
function hadnleGetScoreProduct(storeIdIn, type) {
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    state.showLoading = false
    utils.showToast('您还不是会员哦，请绑定手机号成为会员~')
    return
  }
  const that = this
  const tempData = {
    // storeId: state.storeId,
    status: 'STARTED',
  }
  scoreProductService
    .queryActivity(tempData)
    .then((res) => {
      const activityIds = []
      if (res && res.records && res.records.length > 0) {
        res.records.forEach((it) => {
          activityIds.push(it.id)
        })
      }
      if (activityIds.length === 0) {
        state.showLoading = false
        return null
      }
      const postData = {
        activityIds: activityIds.join(','),
        page: state.pageData.page,
        pageSize: state.pageData.pageSize,
        onlyActivited: true,
        // storeIdIn: storeIdIn.join(','),
        typeEquals: type || state.scoreProductType,
        statusEquals: 'ENABLE',
      }
      console.log(postData, '参数')
      return scoreProductService.productQuery(postData)
    })
    .then((res) => {
      if (!res) {
        state.showLoading = false
        return
      }
      console.log(res)
      const tempProductList = state.goodsList
      const tempCouponList = state.couponList
      const tempThirdCouponList = state.thirdPartycouponList
      if (res.records == null || res.records.length == 0) {
        state.showLoading = false
        return
      }
      res.records.forEach((item) => {
        // 判断积分商品是否可用，禁用的就不显示
        if (item.status === 'DISABLE') {
          return true
        }
        if (item.scoreList) {
          let enableMemberShip = []
          let count = 0
          let isMatching = false
          item.scoreList.forEach((res) => {
            ++count
            if (res.gradeId == state.memberGrade) {
              isMatching = true
              item.score = res.score
              item.amount = res.amount ? res.amount : null
            } else {
              // 获取低于自己等级的会员
              for (let i = 0; i < state.memberShip.length; i++) {
                if (state.memberShip[i].id == state.memberGrade) {
                  enableMemberShip = state.memberShip.slice(0, i)
                  break
                }
              }
            }
          })
          if (count === item.scoreList.length && !isMatching) {
            console.log('低于自己会员等级的规则', enableMemberShip)
            enableMemberShip.forEach((el) => {
              // 获取最接近自己会员等级的规则
              item.scoreList.forEach((res) => {
                if (res.gradeId === el.id) {
                  item.score = res.score
                  item.amount = res.amount ? res.amount : null
                }
              })
            })
          }
          // const matchingRule = item.scoreList.filter(item => item.gradeId === this.data.memberGrade || item.gradeId === 'all');
          // if (matchingRule.length > 0) {
          //   item.isMatch = true
          // } else {
          //   console.log('不符合兑换条件');
          //   item.isMatch = false
          // }
        }
        if (item.score) {
        } else {
          item.type = ''
        }
        // 商品类型
        if (item.type === 'SCORE_PRODUCT_PRODUCT') {
          const produtlabel = []
          const promotions = []
          if (item.product.labels && item.product.labels.length > 0) {
            item.product.labels.forEach((ele) => {
              if (ele.type === 'GOODSLABEL' && ele.color != null) {
                produtlabel.push(ele)
              } else if (ele.type === 'PROMOTIONLABEL') {
                promotions.push(ele)
              }
            })
          }
          const tempItem = {
            ...item,
            prizeCount: item.prizeCount ? item.prizeCount : 0,
            product: {
              ...item.product,
              produtlabel,
              promotions,
            },
            balance: item.total - item.prizeCount,
          }
          let balance =
            Number(item.total) > Number(item.product.balance)
              ? Number(item.product.balance)
              : Number(item.total)
          balance = balance > 0 ? balance : 0
          tempItem.balance = balance
          tempProductList.push(tempItem)
          return true
        }

        // 券类型
        if (item.type === 'SCORE_PRODUCT_COUPON') {
          couponHandler.handleCouponFunction(item.couponActivity || item)
          if (item.couponActivity.status === 'COMMIT') {
            if (item.couponActivity.service === 'ZJIAN') {
              if (item.couponActivity.endDate) {
                const now = new utils.ResponseDate().getTime()
                const endTime = new Date(item.couponActivity.endDate.replace(/-/g, '/')).getTime()
                if (now < endTime) {
                  tempCouponList.push(item)
                }
              } else {
                tempCouponList.push(item)
              }
            } else {
              const now = new utils.ResponseDate().getTime()
              item.couponActivity.endDate = item.couponActivity.endDate || item.endTime
              item.couponActivity.startDate = item.couponActivity.startDate || item.beginTime
              const endTime = new Date(item.couponActivity.endDate.replace(/-/g, '/')).getTime()
              const startDate = new Date(item.couponActivity.startDate.replace(/-/g, '/')).getTime()
              if (now < endTime && now > startDate) {
                tempCouponList.push(item)
              }
            }
          }
          return true
        }

        // 第三方券类型
        if (item.type === 'SCORE_PRODUCT_THIRDCOUPONCODE') {
          item.couponActivity = item.couponActivity || {
            ...item,
          }
          couponHandler.handleCouponFunction(item.couponActivity || item)
          if (item.status === 'ENABLE') {
            const now = new utils.ResponseDate().getTime()
            const endTime = new Date(item.endTime.replace(/-/g, '/')).getTime()
            if (now < endTime) {
              tempThirdCouponList.push(item)
            }
          }
          return true
        }
      })
      console.log(productsSort(tempProductList))
      const matchGoodList = []
      productsSort(tempProductList).forEach((el) => {
        if (el.isMatch) {
          matchGoodList.push(el)
        }
      })
      state.goodsList = productsSort(tempProductList)
      state.couponList = productsSort(tempCouponList)
      state.thirdPartycouponList = productsSort(tempThirdCouponList)
      state.pageData = res
      state.loading = false
      state.showLoading = false
    })
    .catch(() => {
      state.showLoading = false
    })
}
function productsSort(array) {
  const balanceArray = []
  const allArray = []
  array.forEach((ele) => {
    if (ele.total <= 0) {
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
function getMemberScore() {
  const that = this
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.member = app.globalData.userInfo.member
    state.isMember = true
    memberService
      .getBalanceV2(state.member.mobile)
      .then((res) => {
        console.log('getBalance', res)
        const score = res && res.balance ? res.balance : 0
        // 过期积分和时间处理
        const expireBalance = res && res.expireBalance ? res.expireBalance : null
        const expireDate = res && res.expireDate ? res.expireDate.substr(0, 10) : null
        state.score = score
        state.expireBalance = expireBalance
        state.expireDate = expireDate
      })
      .catch((e) => {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000,
        })
      })
  } else {
  }
}
function toGoodsDetail(val) {
  const item = state.goodsList.filter((i) => {
    return i.id == val.currentTarget.dataset.goodsid
  })[0]
  const storeId = state.storeId
  if (item.product.business === 'DISTRIBUTION') {
    ADDRESS.getDistributionStore()
      .then((res) => {
        handleToGoodsDetail(res.id)
      })
      .catch((err) => {
        utils.showToast('商品暂未上架，请到别的门店看看吧！')
      })
  } else {
    handleToGoodsDetail(storeId)
  }
  function handleToGoodsDetail(storeId) {
    productService
      .getDetails(storeId, item.productId)
      .then((res) => {
        if (res && res.storeProductState === 'ON') {
          const opts =
            '?productId=' + item.id + '&storeId=' + storeId + '&type=score' + '&total=' + item.total
          NAVPAGE.toGoodsDetails(opts)
        } else {
          utils.showToast('商品暂未上架，请到别的门店看看吧！')
        }
      })
      .catch((err) => {
        utils.showToast(err.message)
      })
  }
}
function toScoreOrder() {
  if (state.hasUserInfo) {
    if (state.isMember) {
      NAVPAGE.toScoreOrder()
    } else {
      NAVPAGE.toAuthorize()
    }
  }
}
function toCouponDetail(e) {
  const index = e.currentTarget.dataset.index
  const item = state.couponList[index]
  const currentCoupon = item.couponActivity
  if (item.score > state.score) {
    utils.showToast('积分不足')
    return
  }
  if (currentCoupon) {
    const isExternal = currentCoupon.service !== 'GM'
    if (!isExternal) {
      const opts =
        '?couponActivityId=' +
        currentCoupon.id +
        '&type=score&isExternal=false&productId=' +
        item.id
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toCouponDetails(opts)
      } else {
        NAVPAGE.toAuthorize()
      }
    } else {
      const couponData = JSON.stringify(currentCoupon)
      const opts =
        '?couponActivityId=' +
        currentCoupon.id +
        '&type=score&isExternal=true&productId=' +
        item.id +
        '&couponData=' +
        couponData
      NAVPAGE.toCouponDetails(opts)
    }
  }
}
function reducePro() {
  const that = this
  let num = state.productNum
  if (num > 1) {
    num--
    state.productNum = num
  }
}
function addPro(e) {
  const that = this
  let num = state.productNum
  const total = e.currentTarget.dataset.total
  const usenum = e.currentTarget.dataset.usenum
  const usescore = e.currentTarget.dataset.score
  const canBuyNum = total - usenum
  //    购买当前操作数量所需积分
  const buyScore = (num + 1) * usescore
  if (num < canBuyNum) {
    if ((canBuyNum && num + 1 > canBuyNum) || buyScore > state.score) {
      uni.showToast({
        title: '最多购买' + state.productNum + '件',
        icon: 'none',
        duration: 2000,
      })
    } else {
      num++
      state.productNum = num
    }
  } else {
    uni.showToast({
      title: '我们只有这么多了~',
      icon: 'none',
      duration: 2000,
    })
  }
}
function toPerfectOrder(val) {
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    NAVPAGE.toAuthorize()
    return
  }
  const that = this
  const type = val.currentTarget.dataset.type
  if (type === 'SCORE_PRODUCT_COUPON') {
    const goodsList = state.couponList
  } else if (type === 'SCORE_PRODUCT_PRODUCT') {
    const goodsList = state.goodsList
  } else if (type === 'SCORE_PRODUCT_THIRDCOUPONCODE') {
    const goodsList = state.thirdPartycouponList
  }
  const good = goodsList.concat(state.couponList).filter((i) => {
    return i.id === val.currentTarget.dataset.goodsid
  })[0]
  if (good.type === 'SCORE_PRODUCT_COUPON') {
    const goodsName = good.couponActivity.name
      ? good.couponActivity.name
      : good.couponActivity.couponTypeName
  } else if (good.type === 'SCORE_PRODUCT_PRODUCT') {
    const goodsName = good.product.name
  } else if (good.type === 'SCORE_PRODUCT_THIRDCOUPONCODE') {
    const goodsName = good.name
  }
  const goodsScore = good.amount ? good.score + '积分+' + good.amount + '元' : good.score + '积分'
  console.log(good, '点击详情')
  scoreProductService
    .getMemberCount(good.activityId, state.member.id)
    .then((res) => {
      if (res > 0) {
        showScoreModal(good, goodsScore, goodsName)
      } else {
        state.show.upgrade = true
      }
    })
    .catch((err) => {
      utils.showToast(err.message)
    })
  function showScoreModal(good, goodsScore, goodsName) {
    if (good.type === 'SCORE_PRODUCT_PRODUCT') {
      // 积分商品判断购买资格
      if (parseFloat(good.product.balance) <= 0) {
        utils.showToast('您要兑换的商品' + goodsName + '门店库存不足')
        return
      } else if (parseFloat(good.total) <= 0) {
        utils.showToast('您要兑换的商品' + goodsName + '已经被兑换完了')
        return
      }
    }
    state.selectGood = good
    state.couponStatus = 'hint'
    state.couponStatusText = '温馨提示'
    state.receiveMessage = `是否花费${goodsScore}兑换 \n ${goodsName}`
    state.show = {
      middle: true,
      top: false,
      bottom: false,
      right: false,
      right2: false,
    }
  }
}
function handleGoOn() {
  state.show = {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
  }
}
function handleToMyCoupon() {
  state.show = {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
  }
  NAVPAGE.toMyCoupon()
}
function handleToMyThirdCoupon() {
  state.show = {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
  }
  NAVPAGE.toMyThirdCoupon()
}
function handleConvert() {
  state.canClick = false
  const that = this
  const good = state.selectGood
  if (good.total <= 0) {
    state.couponStatus = 'failed'
    state.couponStatusText = '兑换失败'
    state.receiveMessage = '活动太火爆了 \n 已经发放完了'
    state.canClick = true
    return
  }
  if (state.score < good.score) {
    // wx.showToast({
    //   title: '积分不足',
    //   icon: 'none',
    //   duration: 2000
    // })
    state.couponStatus = 'failed'
    state.couponStatusText = '兑换失败'
    state.receiveMessage = '很抱歉 \n 您的积分不足'
    state.canClick = true
    return
  }

  // 如果是券，直接兑换，不到下单页面
  if (good.type === 'SCORE_PRODUCT_COUPON') {
    const param = {
      id: good.id,
    }
    scoreProductService
      .creatScoreOrder(param)
      .then((res) => {
        state.couponList = []
        getScoreProduct(app.globalData.storeInfo.id)
        getBannerList(app.globalData.storeInfo.id)
        getMemberScore()
        state.couponStatus = 'couponSuccess'
        state.couponStatusText = '兑换成功'
        state.receiveMessage = '优惠券已发放到您的账户 \n 请注意查收！'
        state.show = {
          middle: true,
          top: false,
          bottom: false,
          right: false,
          right2: false,
        }
        state.canClick = true
      })
      .catch((e) => {
        // 兑换异常不抛出
        state.couponStatus = 'failed'
        state.couponStatusText = '兑换失败'
        state.receiveMessage = e.message
        state.show = {
          middle: true,
          top: false,
          bottom: false,
          right: false,
          right2: false,
        }
        state.canClick = true
      })
    return
  } else if (good.type === 'SCORE_PRODUCT_THIRDCOUPONCODE') {
    const param = {
      id: good.id,
      storeId: state.storeId,
    }
    scoreProductService
      .creatScoreOrder(param)
      .then((res) => {
        state.thirdPartycouponList = []
        getScoreProduct(app.globalData.storeInfo.id)
        getBannerList(app.globalData.storeInfo.id)
        getMemberScore()
        if (res.success === true) {
          state.couponStatus = 'thirdCouponSuccess'
          state.couponStatusText = '兑换成功'
          state.receiveMessage = `优惠券兑换码已发放至您的账户`
          state.thirdCouponCode = res.thirdCouponCode
          state.show = {
            middle: true,
            top: false,
            bottom: false,
            right: false,
            right2: false,
          }
          state.canClick = true
          console.log('成功')
        } else {
          state.couponStatus = 'failed'
          state.couponStatusText = '兑换失败'
          state.receiveMessage = '活动太火爆了 \n 券已经发放完了'
          state.show = {
            middle: true,
            top: false,
            bottom: false,
            right: false,
            right2: false,
          }
          state.canClick = true
        }
      })
      .catch((e) => {
        // 兑换异常不抛出
        state.couponStatus = 'failed'
        state.couponStatusText = '兑换失败'
        state.receiveMessage = e.message
        state.show = {
          middle: true,
          top: false,
          bottom: false,
          right: false,
          right2: false,
        }
        state.canClick = true
        console.log(e, '兑换失败')
      })
    return
  } else if (good.type === 'SCORE_PRODUCT_PRODUCT') {
    state.show = {
      middle: false,
      top: false,
      bottom: false,
      right: false,
      right2: false,
    }
    state.canClick = true
  }
  try {
    const scoreMall = {
      allPrice: good.score,
      storeId: state.storeId,
      goodsList: [],
      orderType: 'scoreMall',
      score: good.score,
      quantity: state.productNum,
    }
    scoreMall.goodsList.push({
      ...good,
      total: 1,
    })
    console.log(scoreMall)
    uni.setStorageSync('wj_shopcart', scoreMall)
  } catch (e) {
    console.log(e)
  }
  // 判断是否绑定手机号
  if (app.globalData.userInfo.member) {
    NAVPAGE.toAddScoreOrder()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function initPage(options) {
  const self = this
  state.isCanBeOrdered = app.globalData.storeInfo.virtualStore != 1
  state.storeId = app.globalData.storeInfo ? app.globalData.storeInfo.id : null
  state.storeName = app.globalData.storeInfo ? app.globalData.storeInfo.name : null
  state.goodsList = []
  state.couponList = []
  state.thirdPartycouponList = []
  state.pageData = {
    page: 1,
    pageSize: 10,
    pageCount: 0,
    records: [],
  }
  state.noMore = false
  if (options.link === 'score_coupon') {
    const type = 'SCORE_PRODUCT_COUPON'
    getScoreProduct(app.globalData.storeInfo.id, type)
    state.scoreCoupon = true
    state.scoreGoods = false
    state.thirdPartyCoupon = false
    state.scoreProductType = 'SCORE_PRODUCT_COUPON'
  } else if (options.link === 'score_goods') {
    const type = 'SCORE_PRODUCT_PRODUCT'
    getScoreProduct(app.globalData.storeInfo.id, type)
    state.scoreCoupon = false
    state.scoreGoods = true
    state.thirdPartyCoupon = false
    state.scoreProductType = 'SCORE_PRODUCT_PRODUCT'
  } else if (options.link === 'thirdParty_coupon') {
    const type = 'SCORE_PRODUCT_THIRDCOUPONCODE'
    getScoreProduct(app.globalData.storeInfo.id, type)
    state.scoreCoupon = false
    state.scoreGoods = false
    state.thirdPartyCoupon = true
    state.scoreProductType = 'SCORE_PRODUCT_THIRDCOUPONCODE'
  } else {
    const type = 'SCORE_PRODUCT_PRODUCT'
    getScoreProduct(app.globalData.storeInfo.id, type)
    state.scoreCoupon = false
    state.scoreGoods = false
    state.thirdPartyCoupon = false
    state.scoreProductType = 'SCORE_PRODUCT_PRODUCT'
  }
  getBannerList(app.globalData.storeInfo.id)
}

onLoad(function (_options) {
  options = _options || {}
  changeStore = false
  pageOnHide = false
  console.log(app.globalData, 'app.globalDataapp.globalDataapp.globalData')
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
  const keyArr = ['scoreExchangeType']
  const keys = keyArr.join(',')
  sysService.query(keys).then((res) => {
    if (res && res.length > 0) {
      state.tabBarList.forEach((item) => {
        if (res[0].value.indexOf(item.type) > -1) {
          item.show = true
        } else {
          item.show = false
        }
      })
      state.tabBarList = state.tabBarList
    }
  })
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
        ? 'background: ' + app.globalData.uiconfig.themeColor + ';'
        : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
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
  const self = this
  queryMemberShip().then((res) => {
    console.log(res)
  })
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      if (app.globalData.userInfo.member.gradeId) {
        state.memberGrade = app.globalData.userInfo.member.gradeId
      }
    }
  }

  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    initPage(_options)
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getRecentlyStore()
      .then(() => {
        const res = app.globalData.storeInfo
        state.storeId = res.id
        state.storeName = res.name
        if (_options.link === 'score_coupon') {
          const type = 'SCORE_PRODUCT_COUPON'
          getScoreProduct(app.globalData.storeInfo.id, type)
          state.scoreProductType = 'SCORE_PRODUCT_COUPON'
        } else if (_options.link === 'score_goods') {
          const type = 'SCORE_PRODUCT_PRODUCT'
          getScoreProduct(app.globalData.storeInfo.id, type)
          state.scoreProductType = 'SCORE_PRODUCT_PRODUCT'
        } else if (_options.link === 'thirdParty_coupon') {
          const type = 'SCORE_PRODUCT_THIRDCOUPONCODE'
          getScoreProduct(app.globalData.storeInfo.id, type)
          state.scoreProductType = 'SCORE_PRODUCT_THIRDCOUPONCODE'
        } else {
          const type = 'SCORE_PRODUCT_PRODUCT'
          getScoreProduct(app.globalData.storeInfo.id, type)
          state.scoreProductType = 'SCORE_PRODUCT_PRODUCT'
        }
        getBannerList(res.id)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  if (options && options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures()
  // 判断用户是否授权
  checkUserInfo()
})
onReady(function () {})
onShow(function () {
  if (
    (app.globalData.storeInfo && app.globalData.storeInfo.id !== state.storeId) ||
    changeStore ||
    pageOnHide
  ) {
    changeStore = false
    initPage(options)
  }
  // 判断用户是否授权
  checkUserInfo()
  getMemberScore()
  getUpgradeScore()
  const showModel = uni.getStorageSync('showModel')
  if (showModel) {
    state.showModel = showModel
  }
})
onHide(function () {
  pageOnHide = true
})
onUnload(function () {})
onPullDownRefresh(function () {
  const self = this
  initPage(options)
  setTimeout(() => {
    // 特别处理iOS下有loading时下拉刷新秒回弹的问题
    uni.stopPullDownRefresh()
    state.onPullDownRefresh = false
  }, 1000)
})
onReachBottom(function () {
  if (state.pageData.page < state.pageData.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true
    state.pageData.page++
    getScoreProduct()
  } else {
    // 没有下一页，提示已经查询完毕
    state.noMore = true
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
      title: app.globalData.systemConfigure.miniprogramSharingName,
      path:
        '/pages-sub/newretail/pages/mallModule/score/scoreMall/scoreMall?shareId=' +
        memberId +
        '&storeId=' +
        state.storeId,
      imageUrl: sharePictures,
      success(e) {},
    }
  } else {
    return {
      title: app.globalData.systemConfigure.miniprogramSharingName,
      path:
        '/pages-sub/newretail/pages/mallModule/score/scoreMall/scoreMall?storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {},
    }
  }
})
function getBannerList(storeId) {
  bannerService.getStoreBannerList('SCOREMALL', storeId).then((res) => {
    console.log(res)
    state.banners = res
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
function getSharePictures() {
  utils
    .getSharePictures('SCORE_MALL')
    .then((res) => {
      state.sharePictures = res
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true
    state.userInfo = app.globalData.userInfo
    if (app.globalData.userInfo.member) {
      state.isMember = true
      state.userInfo = app.globalData.userInfo
      state.member = app.globalData.userInfo.member
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
function catchToDetals() {}
function toAuthorize() {
  NAVPAGE.toAuthorize()
}
function getUpgradeScore() {
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    return
  }
  memberService.queryGrade().then((res) => {
    const gradeNo = app.globalData.userInfo.member.gradeNo
    let score = 0
    let nextGradeNo = 0
    const memberGrade = []
    let showScoreUpdate = true
    if (gradeNo < 0) {
      state.showScoreUpdate = false
    } else {
      if (res) {
        res = utils.compareMemberGrade(res)
      }
      for (let i = 1; i <= 10; i++) {
        res.forEach((el) => {
          if (el.gradeNo === i) {
            memberGrade.push(el)
          }
        })
      }
      memberGrade.forEach((el, i) => {
        if (el.gradeNo === gradeNo) {
          const index = i + 1
          if (index === memberGrade.length) {
            showScoreUpdate = false
          } else {
            if (memberGrade[index].score) {
              console.log(memberGrade[index], gradeNo, el, 'memberGrade[index]')
              score = memberGrade[index].score
              nextGradeNo = memberGrade[index].gradeNo
              showScoreUpdate = true
            } else {
              showScoreUpdate = false
            }
          }
        }
      })
      state.nextGradeNo = nextGradeNo
      state.showScoreUpdate = showScoreUpdate
    }
  })
}
function handleUpgrade() {
  state.show.upgrade = false
  const opts = '?nextGradeNo=' + state.nextGradeNo
  NAVPAGE.toScoreVip(opts)
}
function toggleUpgradePopup() {
  state.show.upgrade = false
}
</script>
<style scoped>
/* pages/scoreMall/scoreMall.wxss */
/* @import "/components/coupon/score-coupon/score-coupon.wxss"; */
page {
  height: 100%;
  background: #f3f3f3;
}

/* .banner-box {
  width: 750rpx;
}

.swiper {
  width: 100%;
  height: 271rpx;
}

.swiper-item {
  width: 100%;
  height: 271rpx;
}

.banner-box image {
  width: 100%;
  height: 271rpx;
  display: block;
} */

/* 栏目 */

/* .column-box {
  display: flex;
  width: 694rpx;
  height: 140rpx;
  box-sizing: border-box;
  padding: 0 40rpx;
  background: #fff;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  margin: 28rpx auto 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 5;
}

.column-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #313131;
  font-size: 28rpx;
  height: 46rpx;
  line-height: 46rpx;
  border-right: 2rpx solid #ccc;
  position: relative;
}

.column-item text {
  color: #ffa14d;
  margin-left: 4rpx;
}

.column-item image {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
}

.column-item:last-of-type {
  color: #009f55;
  border-right: none;
} */
.column-box {
  height: 330rpx;
  position: relative;
  display: flex;
}
.i-t-bg {
  width: 750rpx;
  height: 543rpx;
  position: absolute;
  left: 0;
  top: 0;
}
.i-t-left {
  position: relative;
  top: 190rpx;
  display: flex;
  flex-direction: column;
  padding-left: 50rpx;
}
.i-t-left text {
  overflow: hidden;
  display: block;
  width: 450rpx;
}
.left-one {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #591b00;
}
.left-num {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 77rpx;
  color: #591b00;
}
.left-pass {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  color: #591b00;
}
.i-t-right {
  position: relative;
  top: 298rpx;
  width: 194rpx;
  height: 70rpx;
  background: #ffffff;
  border-radius: 35rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.i-t-right .icon {
  width: 26rpx;
  height: 28rpx;
  margin-right: 10rpx;
  position: relative;
}
.i-t-right text {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
}
button.authorization {
  width: 100% !important;
  height: 100% !important;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
}

button.authorization::after {
  border: none;
}
/* 当前门店 */

.current-store-box {
  position: relative;
  top: 38rpx;
  width: 690rpx;
  height: 80rpx;
  background: #ffffff;
  border-radius: 40rpx;
  overflow: hidden;
  margin: 0 auto;
  font-size: 24rpx;
  color: #333333;
  text-align: center;
  line-height: 60rpx;
  margin-top: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx;
  box-sizing: border-box;
}

.current-store-box text {
  display: inline-block;
  width: 380rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  font-family: PingFang SC;
  font-size: 28rpx;
  color: #333333;
}

.current-store-box image:first-of-type {
  width: 28rpx;
  height: 28rpx;
  margin: 0rpx;
  overflow: hidden;
}

.current-store-box image:last-of-type {
  width: 11.5rpx;
  height: 20rpx;
  margin: 0rpx;
  overflow: hidden;
  margin-left: 10rpx;
}

/* tab切换 */
.tab-box {
  position: relative;
}
.tab-bar {
  width: 100%;
  height: 124rpx;
  padding: 32rpx 50rpx 26rpx 50rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin-top: 40rpx;
}
.score-show-icon {
  width: 60rpx;
  height: 60rpx;
  position: absolute;
  right: 8px;
  top: 16px;
}
.score-heng,
.score-shu {
  width: 30rpx;
  height: 30rpx;
  display: block;
  margin: 15rpx auto;
}
.tab-bar .tab-bar-item {
  flex: 1;
  font-size: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-bar .tab-bar-item .item-name {
  text-align: center;
  color: #333333;
}
.tab-bar .active .item-name {
  color: #fc6700;
}
.tab-bar .tab-bar-item .item-activity {
  width: 53rpx;
  height: 8rpx;
  border-radius: 4rpx;
  margin-top: 8rpx;
  background: transparent;
}
.tab-bar .active .item-activity {
  background: #fc6700;
}
/* 商品列表 */
.goods-shu .goods-item {
  width: 690rpx;
  height: 230rpx;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0 auto 22rpx auto;
  position: relative;
  display: flex;
  align-items: center;
}

.goods-shu .goods-img-box {
  width: 230rpx;
  height: 230rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
  position: relative;
}

.goods-shu .goods-img-box image {
  width: 100%;
  height: 100%;
}

.goods-shu .goods-img-box .qiangguang {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
}

.goods-shu .store-balance {
  height: 36rpx;
  padding-left: 11rpx;
  padding-right: 9rpx;
  position: absolute;
  left: 0;
  top: 18rpx;
  border-top-right-radius: 18rpx;
  border-bottom-right-radius: 18rpx;
  font-size: 18rpx;
  line-height: 36rpx;
  color: #ffffff;
}

.goods-shu .goods-info {
  width: calc(100% - 288rpx);
  height: 100%;
  position: relative;
  padding: 20rpx 0;
  box-sizing: border-box;
}

.goods-shu .goods-info .goods-introduce {
  font-size: 22rpx;
  color: #074f51;
  height: 30rpx;
  line-height: 30rpx;
  font-weight: bold;
}

.goods-shu .goods-info .goods-introduce text {
  width: 60rpx;
  height: 30rpx;
  border-radius: 6rpx;
  background: #074f51;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
}

.goods-shu .goods-info .goods-name {
  color: #454545;
  width: 100%;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  color: #333;
  font-family: Source Han Sans CN;
}

.goods-shu .goods-info .goods-name .name {
  width: 100%;
  height: 100rpx;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.goods-now-state {
  display: block;
  font-family: Source Han Sans CN;
  font-size: 22rpx;
  color: #999999;
  text-align: right;
  margin-bottom: 10rpx;
}
.goods-shu .goods-info .goods-desc {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999;
  font-size: 24rpx;
  height: 36rpx;
  line-height: 36rpx;
  margin: 2rpx 0rpx 12rpx;
}
.goods-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.goods-price {
  font-family: Source Han Sans CN;
  font-size: 28rpx;
  color: #fc6700;
  white-space: nowrap;
  display: flex;
}
.goods-price .small-font {
  display: inline-block;
  font-size: 12px;
  position: relative;
  left: -5rpx;
  transform: scale(0.7);
  top: 5rpx;
}
.goods-price .nowPrice {
  white-space: nowrap;
}
.goods-price .nowPrice:last-of-type {
  position: relative;
  left: -5rpx;
}
.oldPrice {
  font-size: 24rpx;
  color: #8b8b8c;
  text-decoration: line-through;
}

.goods-info button {
  padding: 0;
  line-height: 50rpx;
  font-weight: normal;
  color: #fff;
  border: none;
  border-radius: 25rpx;
  font-size: 24rpx;
  width: 144rpx;
  height: 50rpx;
  background: #fc6700;
  border-radius: 25px;
  opacity: 0.3;
}
.goods-heng {
  padding: 0 30rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
.goods-heng .goods-info button {
  padding: 0;
  line-height: 50rpx;
  font-weight: normal;
  color: #fff;
  border: none;
  border-radius: 25rpx;
  font-size: 24rpx;
  width: 124rpx;
  height: 50rpx;
  background: #fc6700;
  border-radius: 25px;
  opacity: 0.3;
}
.goods-heng .goods-item {
  width: 334rpx;
  height: 546rpx;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 22rpx;
}
.goods-heng .goods-img-box {
  width: 334rpx;
  height: 334rpx;
  overflow: hidden;
}
.goods-heng .goods-img-box image {
  width: 334rpx;
  height: 334rpx;
}
.goods-heng .goods-info {
  padding: 10rpx 15rpx;
}
.goods-heng .goods-name {
  height: 90rpx;
  font-family: Source Han Sans CN;
  font-size: 32rpx;
  color: #333333;
}
.goods-heng .goods-name .name {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.goods-info button::after {
  border: none;
}

.goods-info button.enable {
  background-color: #fc6700;
  opacity: 1;
}

.section-header {
  margin: 20rpx 40rpx;
  margin-bottom: 0rpx;
}

.score-value {
  position: absolute;
  right: 70rpx;
  top: 40rpx;
  color: #f9a72a;
  font-size: 30rpx;
}

.exchange-btn-board {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  right: 70rpx;
  bottom: 35rpx;
}

.exchange-btn-board :first-child {
  color: #f9a72a;
  font-size: 30rpx;
}

.exchange-btn-board :last-child {
  width: 15rpx;
  height: 30rpx;
  margin-left: 10rpx;
}

.popup-box {
  width: 560rpx;
  height: 440rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
}

.popup-title {
  width: 368rpx;
  height: 87rpx;
  margin: 0 auto;
  padding-top: 30rpx;
  position: relative;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 80rpx;
  text-align: center;
  overflow: hidden;
}

.receive-message {
  height: 160rpx;
  font-size: 32rpx;
  line-height: 55rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 100%;
}

.receive-message .thirdCouponCode {
  line-height: 80rpx;
  font-size: 50rpx;
}

.popup-button {
  position: absolute;
  bottom: 0;
  font-size: 32rpx;
  width: 100%;
  height: 110rpx;
  border-top: 2rpx solid #8b8b8c;
  display: flex;
}

.left-button {
  width: 50%;
  height: 100%;
  font-weight: 400;
  text-align: center;
  line-height: 110rpx;
  background-color: #fff;
  border-radius: 0 0 0 20rpx;
}

.right-button {
  width: 50%;
  height: 100%;
  font-weight: 400;
  text-align: center;
  line-height: 110rpx;
  color: #fff;
  border-radius: 0 0 20rpx 0;
}

.middle-button {
  width: 100%;
  height: 100%;
  font-weight: 400;
  text-align: center;
  line-height: 110rpx;
  color: #fff;
  border-radius: 0 0 20rpx 20rpx;
}

.exchange-popup {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
  height: 450rpx;
  background: #fff;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
}
.exchange-popup .e-p-goods {
  display: flex;
  width: 100%;
  padding: 30rpx 0;
  border-bottom: 1px solid #eaeaea;
  position: relative;
}
.exchange-popup .close-btn {
  width: 60rpx;
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
  color: #999999;
  position: absolute;
  right: -10rpx;
  top: 20rpx;
  font-size: 36rpx;
  font-family: Source Han Sans CN;
}
.exchange-popup .ex-goods-left {
  width: 150rpx;
  height: 150rpx;
  box-sizing: border-box;
  overflow: hidden;
  margin-right: 30rpx;
}
.exchange-popup .ex-goods-left .goods-img {
  width: 150rpx;
  height: 150rpx;
}
.exchange-popup .ex-goods-right {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.exchange-popup .goods-title {
  width: 447rpx;
  font-family: Source Han Sans CN;
  font-size: 28rpx;
  color: #000000;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.exchange-popup .goods-price {
  display: flex;
}
.exchange-popup .e-p-operate {
  display: flex;
  flex-direction: column;
  margin: 25rpx 0;
}
.exchange-popup .o-b-font {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
}
.exchange-popup .operate-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.exchange-popup .operate-reduce {
  width: 42rpx;
  height: 42rpx;
  background: #ffffff;
  border-radius: 50%;
  border: 1px solid #eb702d;
  text-align: center;
  line-height: 42rpx;
  color: #eb702d;
}
.exchange-popup .o-b-num {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  margin: 0 25rpx;
}
.exchange-popup .operate-add {
  width: 42rpx;
  height: 42rpx;
  background: #eb702d;
  border-radius: 50%;
  border: 1px solid #eb702d;
  text-align: center;
  line-height: 42rpx;
  color: #fff;
}
.last-num {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #eb702d;
}
.exchange-popup .e-p-btn {
  width: 689rpx;
  height: 88rpx;
  background: #eb702d;
  border-radius: 44rpx;
  margin: 0 auto;
  text-align: center;
  line-height: 88rpx;
  color: #fff;
  font-size: 32rpx;
}
.no-data {
  width: 100%;
  height: calc(100vh - 688rpx);
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
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
  color: #999999;
}

.progress-box {
  width: 100%;
  height: 20rpx;
  font-size: 20rpx;
  line-height: 20rpx;
  box-sizing: border-box;
  border-radius: 5rpx;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
}

.progress-box text {
  display: inline-block;
  font-size: 20rpx;
  color: #666565;
  line-height: 20rpx;
  margin-left: 13rpx;
}

.progress-box .progress-content-box {
  width: 253rpx;
  height: 10rpx;
  font-size: 10rpx;
  line-height: 10rpx;
  box-sizing: border-box;
  border-radius: 5rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.progress-box progress {
  width: 253rpx;
  height: 10rpx;
}

.popup-upgrade-box {
  width: 660rpx;
  /* height: 440rpx; */
  padding-bottom: 140rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
}

.popup-upgrade-title {
  width: 368rpx;
  height: 87rpx;
  margin: 0 auto;
  padding-top: 30rpx;
  position: relative;
  color: #1c1c1c;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 80rpx;
  text-align: center;
  overflow: hidden;
}

.popup-upgrade-content {
  color: #1c1c1c;
  font-size: 42rpx;
  font-weight: 400;
  line-height: 64rpx;
  padding: 0 60rpx 20rpx 60rpx;
  text-align: left;
}

.popup-upgrade-button {
  position: absolute;
  bottom: 0;
  font-size: 36rpx;
  width: 100%;
  height: 110rpx;
  display: flex;
}

.popup-upgrade-button > view {
  width: 100%;
  height: 100%;
  font-weight: 400;
  text-align: center;
  line-height: 110rpx;
  color: #fff;
  border-radius: 0 0 20rpx 20rpx;
}

/* components/coupon/score-coupon/score-coupon.wxss */
/* .coupon-item-top {
  margin: 22rpx 0 0 0;
  position: relative;
  font-size: 24rpx;
  color: #8b8b8c;
}

.coupon-item-top image {
  width: 89rpx;
  height: 58rpx;
  margin-top: 10rpx;
}

.coupon-item-top>text {
  display: block;
  position: relative;
}

.coupon-item-top .name {
  font-size: 32rpx;
  line-height: 42rpx;
  color: #454545;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 14rpx;
}

.coupon-item-top .name text {
  color: #ff8561;
  font-size: 40rpx;
  margin-right: 10rpx;
  font-style: italic;
}

.coupon-item-top .time {
  font-size: 20rpx;
  line-height: 26rpx;
  color: #8b8b8c;
  margin-top: 19rpx;
}

.coupon-item-bottom {
  position: absolute;
  height: 70rpx;
  line-height: 70rpx;
  bottom: 24rpx;
  left: 60rpx;
  width: 629rpx;
  display: flex;
  align-items: center;
} */
/* 
.coupon-item-bottom .time {
  font-size: 20rpx;
  line-height: 70rpx;
  display: block;
  color: #999999;
  margin-left: 10rpx;
}

.coupon-item-bottom .condition {
  font-size: 20rpx;
  line-height: 70rpx;
  display: inline-block;
  color: #8b8b8c;
  width: 408rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coupon-item-bottom .use {
  margin-right: 42rpx;
  padding-right: 27rpx;
  font-size: 24rpx;
  float: right;
  color: #009f55;
  position: relative;
}

.coupon-item-bottom .use .coupon-item-right-point {
  width: 12rpx;
  height: 21rpx;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -11.5rpx;
}

.use-box .coupon-item-top .name,
.use-box .coupon-item-top .name>text,
.unable .coupon-item-top .name,
.unable .coupon-item-top .name>text {
  color: #8b8b8c;
}

.use-box .coupon-item-bottom .use,
.unable .coupon-item-bottom .use {
  background: transparent;
  padding-right: 0;
  color: #8b8b8c;
} */

/* .main-coupon-function {
  width: 150rpx;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff7120;
  font-size: 45rpx;
  font-weight: bolder;
  padding: 20rpx 20rpx 0rpx 0rpx;
} */
/* 
.main-coupon-detail {
  width: calc(100% - 150rpx);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20rpx 0rpx;
  justify-content: space-around;
}

.main-coupon-detail-title {
  font-size: 32rpx;
  color: #222221;
}

.mini-function {
  font-size: 20rpx;
  background-color: #ededed;
  width: 80rpx;
  height: 30rpx;
  border-radius: 15rpx;
  color: #afafaf;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}

.main-coupon-score-value {
  font-size: 20rpx;
  background-color: #FF8105;
  min-width: 100rpx;
  padding: 0 17rpx;
  height: 30rpx;
  border-radius: 15rpx;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}

.main-coupon-detail-desc {
  font-size: 20rpx;
  color: #666666;
  margin-top: 10rpx;
}

.coupon-time-expand-board {
  width: auto;
  display: flex;
  justify-content: space-between;
  background-color: white;
  margin-top: -4rpx;
  padding: 10rpx 20rpx;
}

.coupon-time-baord {
  display: flex;
}

.coupon-time-icon {
  width: 20rpx;
  height: 20rpx;
  flex-shrink: 0;
}

.coupon-time-label {
  font-size: 26rpx;
  color: #a7a6a7;
  margin-left: 10rpx;
}

.coupon-rule-btn {
  width: 100rpx;
  height: 30rpx;
  font-size: 26rpx;
}

.coupon-head-info {
  display: flex;
  align-items: baseline;
}

.coupon-unabled {
  color: #a7a6a7 !important;
}

.exchange-btn-board-coupon {
  width: 160rpx;
  height: 48rpx;
  background: rgba(255, 113, 33, 1);
  border-radius: 4rpx;
  font-size: 24rpx;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  line-height: 48rpx;
  position: absolute;
  right: 70rpx;
  bottom: 35rpx;
}*/

.coupon-shu .coupon-item {
  /* padding: 20rpx 17rpx; */
  height: 230rpx;
  box-sizing: border-box;
  /* position: relative; */
}
.coupon-shu .main-coupon {
  width: 690rpx;
  height: 230rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
}
.coupon-shu .main-coupon-function {
  position: relative;
  width: 194rpx;
  height: 170rpx;
}
.coupon-shu .coupon-bg {
  width: 194rpx;
  height: 170rpx;
  position: absolute;
  left: 0;
  top: 0;
}
.coupon-shu .coupon-head-info {
  width: 194rpx;
  height: 170rpx;
  position: relative;
  display: flex;
  text-align: center;
  font-family: PingFang SC;
  font-weight: 500;
  font-size: 70rpx;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.price-icon {
  font-size: 28rpx;
  position: relative;
  top: 14rpx;
}
.coupon-shu .main-coupon-detail {
  width: 430rpx;
  display: flex;
  flex-direction: column;
}
.coupon-shu .main-coupon-detail-title {
  height: 73rpx;
  font-family: Source Han Sans CN;
  font-size: 28rpx;
  color: #333333;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.main-coupon-detail-desc {
  font-family: Source Han Sans CN;
  font-size: 20rpx;
  color: #999999;
}
.coupon-item-bottom {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 20rpx;
  color: #999999;
  white-space: nowrap;
}
.coupon-bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
}
.main-coupon-score-value {
  font-family: Source Han Sans CN;
  font-size: 30rpx;
  color: #fc6700;
}
.small-font {
  display: inline-block;
  font-size: 12px;
  position: relative;
  left: -5rpx;
  transform: scale(0.7);
  top: 0rpx;
}
.coupon-shu .exchange-btn-board-coupon {
  width: 134rpx;
  height: 50rpx;
  background: #fc6700;
  border-radius: 25rpx;
  text-align: center;
  line-height: 50rpx;
  font-family: Source Han Sans CN;
  font-size: 24rpx;
  color: #ffffff;
}
.coupon {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 30rpx;
}
.coupon-shu {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.coupon-heng {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30rpx;
  justify-content: space-between;
}
.coupon-board {
  /* padding: 0 30rpx; */
  margin-bottom: 20rpx;
}
.coupon-heng .coupon-item {
  width: 334rpx;
  height: 535rpx;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
}
.coupon-heng .main-coupon-function {
  width: 334rpx;
  height: 315rpx;
  background: #ffffff;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.coupon-heng .coupon-bg {
  width: 255rpx;
  height: 224rpx;
  position: absolute;
  left: 50%;
  margin-left: -127rpx;
  top: 50%;
  margin-top: -113rpx;
}
.coupon-heng .coupon-head-info {
  width: 255rpx;
  height: 224rpx;
  position: relative;
  display: flex;
  text-align: center;
  font-family: PingFang SC;
  font-weight: 500;
  font-size: 70rpx;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.coupon-heng .main-coupon-detail {
  display: flex;
  flex-direction: column;
  padding: 0 17rpx;
  font-family: Source Han Sans CN;
}
.coupon-heng .main-coupon-detail-title {
  height: 73rpx;
  font-family: Source Han Sans CN;
  font-size: 28rpx;
  color: #333333;
}
.coupon-heng .exchange-btn-board-coupon {
  width: 114rpx;
  height: 50rpx;
  background: #fc6700;
  border-radius: 25rpx;
  text-align: center;
  line-height: 50rpx;
  font-family: Source Han Sans CN;
  font-size: 24rpx;
  color: #ffffff;
}
</style>
