<template>
  <!-- pages/scoreMall/scoreMall.wxml -->
  <!-- banner 图片 -->
  <view>
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <view class="banner-box">
      <custom-loading v-if="state.showLoading"></custom-loading>
      <swiper
        class="swiper"
        v-if="state.banners.length > 0"
        :indicator-dots="false"
        autoplay="true"
        interval="5000"
        circular="true"
      >
        <view v-for="(item, index) in state.banners" :key="index">
          <swiper-item class="swiper-item" :data-id="item.id" @click="bannerJumping">
            <image :src="item.pictureUrl" class="slide-image"></image>
          </swiper-item>
        </view>
      </swiper>
    </view>
    <view class="column-box" :style="state.banners.length > 0 ? 'margin-top:-28rpx' : ''">
      <view class="column-item">
        <image :src="state.imagesPath.iconScoreMall2" mode="widthFix"></image>
        积分
        <text :style="'color: ' + state.themeColor">{{ state.score }}</text>
      </view>
      <view class="column-item" @click="toScoreOrder" :style="'color: ' + state.themeColor">
        <image :src="state.imagesPath.iconExchangeRecord" mode="widthFix"></image>
        兑换记录
        <button v-if="!state.hasUserInfo" class="authorization" @click="getUserInfo"></button>
      </view>
    </view>
    <view class="current-store-box" @click="toSelectStore">
      <image :src="state.imagesPath.iconIndexStore"></image>
      <text>当前门店:{{ state.storeName }}</text>
      <image :src="state.imagesPath.iconRight1"></image>
    </view>
    <view class="tab-bar">
      <view v-for="(item, index) in state.tabBarList" :key="type">
        <view class="tab-bar-item" :data-type="item.type" @click="handleClickTab">
          <view
            class="item-name"
            :style="'color:' + (item.type === state.scoreProductType ? state.themeColor : '#333')"
          >
            {{ item.name }}
          </view>
          <view
            class="item-activity"
            :style="'background:' + (item.type === state.scoreProductType ? state.themeColor : '')"
          ></view>
        </view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view v-if="state.goodsList.length > 0 && state.scoreProductType === 'SCORE_PRODUCT_PRODUCT'">
      <view
        class="goods-item"
        v-for="(item, index) in state.goodsList"
        :key="idx"
        :data-goodsId="item.id"
        :data-balance="item.total"
        :data-traceId="item.traceId"
        @click="toGoodsDetail"
      >
        <view class="goods-img-box">
          <image :src="item.product.imageUrl" mode="widthFix"></image>
          <image
            class="qiangguang"
            :hidden="item.total > 0 ? true : false"
            :src="state.imagesPath.icon_exchange_out"
          ></image>
        </view>
        <view class="store-balance" :style="'background-color: ' + state.themeColor">
          门店库存：{{ item.product.balance }}件
        </view>
        <view class="goods-info">
          <view class="goods-name">
            <view
              class="goods-introduce"
              v-if="item.product.produtlabel.length > 0 || item.product.specifications"
            >
              <text
                v-for="(item, index) in item.product.produtlabel"
                :key="index"
                :style="'background:rgb(' + item.color + ')'"
                v-if="index < 3"
              >
                {{ item.labelName }}
              </text>
            </view>
            <text class="name">{{ item.product.name }}</text>
          </view>
          <text class="goods-desc">
            {{ item.productem.description ? item.product.description : '' }}
          </text>
          <view class="progress-box">
            <view class="progress-content-box">
              <progress
                :percent="(item.prizeCount / item.total) * 100"
                active=""
                stroke-width="10"
                :activeColor="state.themeColor"
                backgroundColor="#E6E6E6"
              ></progress>
            </view>
            <text>{{ item.prizeCount }}/{{ item.total }}</text>
          </view>
          <view class="goods-price">
            <text class="nowPrice" v-if="item.score" :style="'color: ' + state.themeColor">
              {{ item.amount ? item.score + '积分+' + item.amount + '元' : item.score + '积分' }}
            </text>
            <text
              class="oldPrice"
              v-if="
                item.product.originalPrice && item.product.sellPrice < item.product.originalPrice
              "
            >
              ￥{{ item.originalPrice }}
            </text>
          </view>
          <view @click.stop="catchToDetals">
            <button
              v-if="!state.hasUserInfo"
              class="enable"
              :style="'background-color: ' + state.themeColor"
              @click="getUserInfo"
            >
              立即兑换
            </button>
            <button
              v-else-if="!state.isMember"
              class="enable"
              :style="'background-color: ' + state.themeColor"
              @click.stop="toAuthorize"
            >
              立即兑换
            </button>
            <view v-else>
              <button
                v-if="
                  item.availableStockAmount !== 0 && item.total !== 0 && item.product.balance !== 0
                "
                :class="state.score >= item.score ? 'enable' : 'unable'"
                :style="
                  'background-color: ' +
                  (state.score >= item.score ? state.themeColor : 'rgba(255, 114, 0, 0.6)')
                "
                :data-goodsId="item.id"
                :data-type="item.type"
                :data-balance="item.total"
                :data-traceId="item.traceId"
                @click.stop="toPerfectOrder"
              >
                {{ state.score >= item.score ? '立即兑换' : '积分不足' }}
              </button>
              <button
                v-if="
                  item.availableStockAmount === 0 || item.total === 0 || item.product.balance === 0
                "
                class="unable"
                :data-goodsId="item.product.id"
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
    <!-- 券列表 -->
    <view v-if="state.couponList.length > 0 && state.scoreProductType === 'SCORE_PRODUCT_COUPON'">
      <view
        class="coupon-board"
        v-for="(item, index) in state.couponList"
        :key="id"
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
          <image
            class="coupon-item-bg"
            :src="false ? state.imagesPath.ticket1 : state.imagesPath.ticket2"
          ></image>
          <view class="main-coupon">
            <view class="main-coupon-function">
              <view style="display: flex; flex-direction: column; align-items: center">
                <view class="coupon-head-info">
                  <view
                    :style="'font-size:36rpx; ' + state.theme.mainColor"
                    :hidden="
                      item.couponActivity.function !== 'CASH' &&
                      !(
                        item.couponActivity.function === 'FREESHIP' && item.couponActivity.faceValue
                      )
                    "
                  >
                    ￥
                  </view>
                  <view
                    v-if="
                      item.couponActivity.function === 'CASH' ||
                      (item.couponActivity.function === 'FREESHIP' && item.couponActivity.faceValue)
                    "
                    :style="
                      'margin-left:-16rpx;letter-spacing:-12rpx;' +
                      (item.couponActivity.function === 'CASH' ||
                      item.couponActivity.function === 'DISCOUNT' ||
                      (item.couponActivity.function === 'FREESHIP' && item.couponActivity.faceValue)
                        ? 'font-size:100rpx;'
                        : '') +
                      state.theme.mainColor
                    "
                  >
                    {{ item.couponActivity.nr_headInfo }}
                  </view>
                  <view
                    v-else
                    :style="
                      (item.couponActivity.function === 'CASH' ||
                      item.couponActivity.function === 'DISCOUNT' ||
                      (item.couponActivity.function === 'FREESHIP' && item.couponActivity.faceValue)
                        ? 'font-size:100rpx;'
                        : '') + state.theme.mainColor
                    "
                  >
                    {{ item.couponActivity.nr_headInfo }}
                  </view>
                  <view
                    :style="'font-size:36rpx;margin-left:6rpx;' + state.theme.mainColor"
                    :hidden="item.couponActivity.function !== 'DISCOUNT'"
                  >
                    折
                  </view>
                </view>
              </view>
            </view>
            <view class="main-coupon-detail">
              <text class="main-coupon-detail-title">{{ item.couponActivity.name }}</text>
              <view class="main-coupon-detail-desc">{{ item.couponActivity.nr_condition }}</view>
              <view
                class="main-coupon-score-value"
                :style="'background-color: ' + state.theme.mainColorRgb02"
              >
                {{ item.score }}积分
              </view>
            </view>
          </view>
          <view class="coupon-item-bottom">
            <image class="coupon-time-icon" :src="state.imagesPath.pass_clock"></image>
            <text class="time">
              兑券时间：{{ filters.filtDateHead(item.couponActivity.startDate) }}~{{
                filters.filtDateHead(item.couponActivity.endDate)
              }}
            </text>
            <!-- <text class="condition">{{item.couponActivity.condition}}</text> -->
          </view>
        </view>
        <!-- 立即兑换按钮 -->
        <view
          class="exchange-btn-board-coupon"
          :data-goodsId="item.id"
          :data-type="item.type"
          :data-balance="item.total"
          :data-traceId="item.traceId"
          @click.stop="toPerfectOrder"
          :style="'background: ' + state.themeColor"
        >
          立即兑换
        </view>
      </view>
    </view>
    <!-- 第三方券列表 -->
    <view
      v-if="
        state.thirdPartycouponList.length > 0 &&
        state.scoreProductType === 'SCORE_PRODUCT_THIRDCOUPONCODE'
      "
    >
      <view
        class="coupon-board"
        v-for="(item, index) in state.thirdPartycouponList"
        :key="id"
        :data-index="index"
      >
        <!-- 券主体 -->
        <view class="coupon-item">
          <image
            class="coupon-item-bg"
            :src="false ? state.imagesPath.ticket1 : state.imagesPath.ticket2"
          ></image>
          <view class="coupon-item-top">
            <!-- <image src="{{imagesPath.iconLogo}}" ></image> -->
            <view class="name">{{ item.name }}</view>
            <text class="time">
              活动有效期：{{ filters.filtDateHead(item.beginTime) }}~{{
                filters.filtDateHead(item.endTime)
              }}
            </text>
          </view>
        </view>
        <!-- 券兑换积分 -->
        <text class="score-value" :style="'color: ' + state.themeColor">{{ item.score }}积分</text>
        <!-- 立即兑换按钮 -->
        <view
          class="exchange-btn-board"
          :data-goodsId="item.id"
          :data-type="item.type"
          @click.stop="toPerfectOrder"
          :style="'color: ' + state.themeColor"
        >
          <text :style="'color: ' + state.themeColor">立即兑换</text>
          <image :src="state.imagesPath.orangeArrowRight"></image>
        </view>
      </view>
    </view>
    <view
      v-if="
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
      :hidden="!state.loading"
    >
      正在加载...
    </button>
    <view class="order-end" :hidden="!state.noMore" :style="'color: ' + state.themeColor">
      ~我也是有底线的~
    </view>
    <popup :show="state.show.middle" position="middle" custom-class="middle">
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
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
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
  getScoreProduct(app.globalData.storeInfo.id, tabType)
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
    storeId: state.storeId,
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
        storeIdIn: storeIdIn.join(','),
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
          couponHandler.handleCouponFunction(item.couponActivity)
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
              const endTime = new Date(item.couponActivity.endDate.replace(/-/g, '/')).getTime()
              if (now < endTime) {
                tempCouponList.push(item)
              }
            }
          }
          return true
        }

        // 第三方券类型
        if (item.type === 'SCORE_PRODUCT_THIRDCOUPONCODE') {
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
      .getBalance(state.member.mobile)
      .then((res) => {
        console.log(res)
        state.score = res
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
    const goodsName = good.couponActivity.couponTypeName
      ? good.couponActivity.couponTypeName
      : good.couponActivity.name
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
  state.storeId = app.globalData.storeInfo.id
  state.storeName = app.globalData.storeInfo.name
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
  changeStore = false
  pageOnHide = false
  console.log(app.globalData, 'app.globalDataapp.globalDataapp.globalData')
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
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
    ADDRESS.getLocation()
      .then((res) => {
        app.globalData.storeInfo = res
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
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
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
/* @import '/components/coupon/score-coupon/score-coupon.wxss'; */

page {
  height: 100%;
}

.banner-box {
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
}

/* 栏目 */

.column-box {
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
}

/* 当前门店 */

.current-store-box {
  width: 480rpx;
  height: 60rpx;
  border-radius: 30rpx;
  overflow: hidden;
  margin: 0 auto;
  font-size: 24rpx;
  color: #444;
  background: #fff;
  text-align: center;
  line-height: 60rpx;
  margin-top: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #cccccc;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.current-store-box text {
  display: inline-block;
  width: 380rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.current-store-box image:first-of-type {
  width: 31rpx;
  height: 32rpx;
  margin: 0rpx;
  overflow: hidden;
  margin-right: 10rpx;
}

.current-store-box image:last-of-type {
  width: 11.5rpx;
  height: 20rpx;
  margin: 0rpx;
  overflow: hidden;
  margin-left: 10rpx;
}

/* tab切换 */
.tab-bar {
  width: 100%;
  height: 124rpx;
  padding: 32rpx 26rpx 26rpx 26rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.tab-bar .tab-bar-item {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-bar .tab-bar-item .item-name {
  text-align: center;
  color: #333333;
}

.tab-bar .tab-bar-item .item-activity {
  width: 130rpx;
  height: 8rpx;
  margin-top: 8rpx;
}

/* 商品列表 */

.goods-item {
  width: 678rpx;
  height: 220rpx;
  background: #ffffff;
  box-shadow: 0px 5rpx 18rpx 2rpx #e6e6e6;
  border-radius: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 20rpx 40rpx 20rpx 19rpx;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0 auto 30rpx auto;
  position: relative;
}

.goods-img-box {
  width: 180rpx;
  height: 180rpx;
  overflow: hidden;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.goods-img-box image {
  width: 100%;
  height: 100%;
}

.goods-img-box .qiangguang {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
}

.store-balance {
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

.goods-info {
  width: calc(100% - 234rpx);
  height: 100%;
  position: relative;
  float: right;
}

.goods-info .goods-introduce {
  font-size: 22rpx;
  color: #074f51;
  height: 30rpx;
  line-height: 30rpx;
  font-weight: bold;
}

.goods-info .goods-introduce text {
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

.goods-info .goods-name {
  color: #454545;
  /* display: block; */
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 32rpx;
  line-height: 48rpx;
  font-weight: Medium;
  display: flex;
  align-items: center;
}

.goods-info .goods-name .name {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-info .goods-desc {
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

.goods-price {
  color: #f9a72a;
  font-size: 24rpx;
  line-height: 32rpx;
  position: absolute;
  left: 0;
  bottom: 0;
}

.goods-price .nowPrice {
  font-size: 32rpx;
  margin-right: 9rpx;
}

.goods-price .oldPrice {
  color: #8b8b8c;
  text-decoration: line-through;
}

.goods-info button {
  width: 170rpx;
  height: 56rpx;
  line-height: 56rpx;
  font-weight: normal;
  color: #fff;
  border: none;
  border-radius: 28rpx;
  font-size: 24rpx;
  padding: 0;
  position: absolute;
  right: 0rpx;
  bottom: -2rpx;
}

.goods-info button::after {
  border: none;
}

.goods-info button.unable {
  background-color: rgba(255, 114, 0, 0.6);
}

.goods-info button.enable {
  background-color: #009f55;
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

.section-header {
  margin: 20rpx 40rpx;
  margin-bottom: 0rpx;
}

.coupon-board {
  position: relative;
  padding-left: 20rpx;
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
</style>
