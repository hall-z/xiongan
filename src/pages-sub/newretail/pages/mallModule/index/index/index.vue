<route lang="json5" type="page">
{
  needLogin: true,
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
    },
  },
}
</route>
<template>
  <!-- index.wxml -->
  <view>
    <navigationBar
      :title="navigationBarTitle"
      :latitudeAndLongitude="state.latitude + ',' + state.longitude"
      :background="
        titlebarBackgroundColour
          ? titlebarBackgroundColour
          : state.isShowTopNavigationFlag
            ? state.isShowTopNavigation
              ? titlebarBackgroundColour
              : ''
            : '#fff'
      "
      :color="titlebarFotColour || '#333'"
      :isHome="true"
      :isShowTopNavigationFlag="state.isShowTopNavigationFlag"
      :isShowTopNavigation="state.isShowTopNavigation"
      :topSearchStyle="state.topSearchStyle"
      :nearStoreStyle="state.nearStoreStyle"
    ></navigationBar>

    <!--<template is="add-cart-animation" :data=""></template>-->
    <!-- <view style="width: 100%;height: {{navHeight}}px" wx:if="{{onPullDownRefreshFlag}}"></view> -->
    <!-- <view wx:if="{{hasaAuthorization}}" class="{{isIphoneX?'iphoneX-height':''}} bgcp" style="background-image: url({{homeBackgroundImage1}});background-color: {{homeBackgroundColour}};background-repeat:no-repeat; background-position: 0 {{navHeight + 368}}rpx; "> -->
    <custom-loading-page
      v-if="state.pageImage && state.remainingTime > 0"
      :pageImage="state.pageImage"
      :remainingTime="state.remainingTime"
      @Hide="hidePageImage"
    ></custom-loading-page>
    <custom-loading v-if="state.showLoading" :loadingImage="state.loadingImage"></custom-loading>
    <scroll-view
      :scroll-y="true"
      @scroll="handleScroll"
      style="height: 100%"
      refresher-enabled=""
      @refresherrefresh="onPullDownRefresh"
      :refresher-triggered="state.onPullDownRefreshFlag"
    >
      <!-- v-if="state.hasaAuthorization || !state.isUserLocationTrueShowPage" -->
      <view
        :class="(state.isIphoneX ? 'iphoneX-height' : '') + ' bgcp'"
        :style="
          'background-image: url(' +
          state.homeBackgroundImage +
          ');background-color: ' +
          state.homeBackgroundColour +
          ';background-repeat:no-repeat; background-position: left ' +
          state.bgMarginTop +
          'rpx'
        "
      >
        <lazyLoadPage
          id="lazy-load-component"
          :show="state.pageShow"
          :storeId="state.storeId"
          :refreshType="state.refreshType"
          ownModule="homePage"
          @upDataPageConfig="getPageConfig"
          :pageScrollData="pageScrollData"
          :shopCart="state.shopCart"
          @officialAccountLoad="bindOfficialAccountLoad"
          @officialAccountError="bindOfficialAccountError"
          @refresh="handleRefreshData"
          @pushCollect="toHidePushCollect"
          :latitudeAndLongitude="state.latitude + ',' + state.longitude"
        ></lazyLoadPage>

        <view class="copyright-info">
          <!-- <image mode="widthFix" src="{{imagesPath.iconLogo}}" ></image> -->
          <!-- <text>元芒数字提供技术支持</text> -->
        </view>
      </view>
    </scroll-view>

    <view
      class="flow-car"
      @click="toShopCar"
      :style="state.themeColor ? 'background: ' + state.themeColor : ''"
    >
      <!-- <image src="{{imagesPath.shopping_icon_list}}" ></image> -->
      <image :src="state.imagesPath.newGouwucheIcon"></image>
      <view class="red-hint" :hidden="!(cartCount > 0)">{{ cartCount }}</view>
    </view>
    <navigator
      :url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + state.roomId"
      v-if="
        (state.hasaAuthorization || !state.isUserLocationTrueShowPage) &&
        state.pageShow &&
        state.liveRoomShowCenter &&
        state.roomId !== -1
      "
    >
      <button form-type="submit" class="movable-view">
        <!-- <image src="{{liveRoomLogoUrl ? liveRoomLogoUrl : 'https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/UI/standard/livePlayShow.gif'}}"></image> -->
        <!-- <image src="{{liveRoomLogoUrl ? liveRoomLogoUrl : ''}}"></image> -->

        <image
          v-if="state.imgstatus"
          style="position: absolute; left: 0; top: 0"
          :src="state.imgstatus"
          mode=""
        ></image>
        <image
          style="width: 97%; height: 97%"
          v-if="state.liveRoomLogoUrl"
          :src="state.liveRoomLogoUrl"
        ></image>
      </button>
    </navigator>
    <view
      v-if="!state.hasaAuthorization && state.isUserLocationTrueShowPage"
      class="no-authorization"
    >
      <image :src="state.imagesPath.imgNoLocation"></image>
      <text>您未开通定位权限，部分功能无法正常使用哦~</text>
      <button
        class="open-power"
        :style="'background: ' + state.themeColor"
        open-type="openSetting"
        :hidden="!state.canIUse"
      >
        开通权限
      </button>
      <button
        class="open-power"
        :style="'background: ' + state.themeColor"
        @click="openSetting"
        :hidden="state.canIUse"
      >
        开通权限
      </button>
    </view>
    <tabbar
      :tabbar="state.tabbar"
      :show="state.showTabbar"
      @popup="recorderPopup"
      v-if="!state.openCustomTabbar"
    ></tabbar>
    <!--  <custom-tab-bar
      :tabbar="state.tabbar"
      :show="state.showTabbar"
      v-if="state.openCustomTabbar"
    ></custom-tab-bar>-->
    <popup
      :show="state.show.coupon"
      position="middle"
      custom-class="middle"
      :form="true"
      @close="toggleCouponPopup"
    >
      <view class="popup-coupon-box">
        <view class="popup-coupon-content">
          <form @submit="clickAssignCoupon">
            <button form-type="submit">
              <image :src="state.donateCoupons.pictureUrl" mode="widthFix"></image>
            </button>
          </form>
        </view>
        <view class="popup-close">
          <form @submit="toggleCouponPopup">
            <button form-type="submit">
              <image :src="state.imagesPath.iconIndexPopupClose"></image>
            </button>
          </form>
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.luckDraw"
      position="top"
      custom-class="top"
      :form="true"
      @close="handleLuckDrawPopupClose"
      :overlayStyle="state.luckDrawImageBg"
    >
      <view class="popup-luckdraw-box">
        <luckdraw-game
          :luckDrawText="state.luckDrawTextImage"
          @draw="getUserClickDraw"
          :onClickLuckDraw="state.isMember"
          @fans="getUserIsFans"
          :hasUserInfo="state.hasUserInfo"
          :status="state.raffleResult"
        ></luckdraw-game>
        <view class="popup-luckdraw-close" @click="handleLuckDrawPopupClose">
          <image :src="state.imagesPath.iconIndexPopupClose"></image>
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.luckDrawPopup"
      position="middle"
      custom-class="middle"
      @close="handlePopupLuckDrawClose"
    >
      <view class="popup-luckdraw-window-box">
        <view class="popup-window-image">
          <button v-if="!state.hasUserInfo" @click="getUserInfo">
            <image :src="state.popupWindowImage" mode="widthFix"></image>
          </button>
          <view v-else>
            <image
              :src="state.popupWindowImage"
              mode="widthFix"
              v-if="!state.afterShareToDraw"
              @click="handlePopupDraw"
            ></image>
            <button open-type="share" data-type="luckDraw" v-else>
              <image :src="state.popupWindowImage" mode="widthFix"></image>
            </button>
          </view>
        </view>
        <view class="popup-luckdraw-window-close" @click="handlePopupLuckDrawClose">
          <image :src="state.imagesPath.iconIndexPopupClose"></image>
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.luckDrawResult"
      position="middle"
      custom-class="middle"
      @close="toggleluckDrawResultPopup"
    >
      <view class="popup-luckDrawResult-box">
        <view class="popup-title">抽奖结果</view>
        <view class="popup-close" @click="toggleluckDrawResultPopup">
          <image :src="state.imagesPath.iconLuckDrawClose"></image>
        </view>
        <view v-if="state.hasRaffleCoupon">
          <view class="popup-content">
            <text class="popup-tips">恭喜您成功领取</text>
            <text class="popup-text" :style="'color: ' + state.themeColor">
              {{ state.raffleInfo.rafflePrizeName }}
            </text>
          </view>
          <view class="popup-button">
            <text>分享给朋友即可领取</text>
            <button class="share-btn" open-type="share">把好运气分享给小伙伴</button>
          </view>
        </view>
        <view v-if="!state.hasRaffleCoupon">
          <view v-if="state.activeState === 'end'">
            <view class="popup-content">
              <text class="popup-text" :style="'color: ' + state.themeColor">您来晚了</text>
              <text class="popup-text" :style="'color: ' + state.themeColor">活动已经结束了！</text>
            </view>
            <view class="popup-button">
              <text>敬请期待下次活动哦</text>
              <button class="share-btn" @click="toggleluckDrawResultPopup">去商城逛逛</button>
            </view>
          </view>
          <view v-if="state.activeState === 'start'">
            <view class="popup-content">
              <text class="popup-text-end" :style="'color: ' + state.themeColor">您来晚了</text>
              <text class="popup-text-end" :style="'color: ' + state.themeColor">
                奖品已被抽光了！
              </text>
            </view>
            <view class="popup-button">
              <text>活动期间扫码可获得抽奖机会</text>
              <button class="share-btn" @click="toggleluckDrawResultPopup">去商场逛逛</button>
            </view>
          </view>
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.adsense"
      position="middle"
      custom-class="middle"
      :form="true"
      @close="handleAdsensePopupClose"
    >
      <view class="popup-adsense-box">
        <view class="popup-adsense-content">
          <form @submit="adsenseJumping">
            <button form-type="submit">
              <image :src="state.promotionAdsense.pictureUrl" mode="widthFix"></image>
            </button>
          </form>
        </view>
        <view class="popup-close">
          <form @submit="handleAdsensePopupClose">
            <button form-type="submit">
              <image :src="state.imagesPath.iconIndexPopupClose"></image>
            </button>
          </form>
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.regist"
      position="middle"
      custom-class="middle"
      :form="true"
      @close="toggleRegistPopupClose"
    >
      <view class="popup-adsense-box">
        <view class="popup-adsense-content">
          <form @submit="indexToAuthorize">
            <button form-type="submit">
              <image :src="newMbrAdsense.pictureUrl" mode="widthFix"></image>
            </button>
          </form>
        </view>
        <view class="popup-close">
          <form @submit="toggleRegistPopupClose">
            <button form-type="submit">
              <image :src="state.imagesPath.iconIndexPopupClose"></image>
            </button>
          </form>
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.unVisitedCoupon"
      position="middle"
      custom-class="middle"
      :form="true"
      @close="handleUnvisitedCouponPopupClose"
    >
      <view class="popup-adsense-box">
        <view class="popup-unvisited-coupon-content">
          <image :src="state.imagesPath.couponIndexBg" class="coupon_bg" mode="widthFix"></image>
          <!-- <image src="../../../../utils/image/index-coupon.png" mode="widthFix"></image> -->
          <scroll-view class="unvisited-coupon-board" :scroll-y="true">
            <view
              class="unvisited-coupon-item-board"
              v-for="(item, index) in state.unVisitedCoupons"
              :key="id"
            >
              <image
                class="unvisited-coupon-item-bg"
                :src="state.imagesPath.couponIndexItemBg"
                mode="widthFix"
              ></image>
              <!-- 价格 -->
              <view class="coupon-price-board">
                <view
                  class="coupon-price no-cash"
                  v-if="
                    item.function === 'DISCOUNT' ||
                    (item.function === 'FREESHIP' && (item.rate || item.rate === 0))
                  "
                >
                  <view></view>
                  <view>{{ item.rate * 10 }}</view>
                  <view class="discount">折</view>
                </view>
                <view
                  class="coupon-price"
                  v-else-if="
                    item.function === 'CASH' ||
                    (item.function === 'FREESHIP' &&
                      !item.rate &&
                      (item.faceValue || item.faceValue === 0))
                  "
                >
                  <view></view>
                  <view>{{ item.balance }}</view>
                </view>
                <view class="coupon-price no-cash" v-else>
                  <view></view>
                  <view>{{ item.function_text }}</view>
                </view>
              </view>
              <!-- 内容 -->
              <view class="coupon-content-board">
                <view class="coupon-content-name">{{ item.couponActivityName }}</view>
                <view class="coupon-content-rules">{{ item.useRule }}</view>
                <view class="coupon-content-time">有效期: {{ item.effectiveTime }}</view>
              </view>
            </view>
          </scroll-view>
          <view
            class="popup-unvisited-coupo-bottom popup-unvisited-coupo-bottom1"
            @click="toMyCoupon"
          >
            <!-- <view>立即查看></view> -->
          </view>
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.benefitPlanDrawPopup"
      position="middle"
      custom-class="middle"
      :form="true"
      @close="handleBenefitPlanDrawPopupClose"
    >
      <view class="popup-adsense-box">
        <view class="popup-unvisited-coupon-content popup-unvisited-coupon-content1">
          <!-- wx:if="{{signFlag}}" -->
          <image
            :src="state.imagesPath.welfarePlanIndexBg"
            class="welfare_plan_bg"
            mode="widthFix"
          ></image>
          <view class="point">
            {{ state.signPoint }}
          </view>
          <!-- <image wx:else src="{{imagesPath.welfarePlanIndexBg1}}" class="welfare_plan_bg" mode="widthFix"></image> -->
          <!-- <image src="../../../../utils/image/index-coupon.png" mode="widthFix"></image> -->
          <!-- <scroll-view class="unvisited-coupon-board" scroll-y="{{true}}">
        <view class="unvisited-coupon-item-board" wx:for="{{state.benefitPlan}}" wx:key="id">
          <image class="unvisited-coupon-item-bg" src="{{state.imagesPath.welfarePlanIndexItemBg}}" mode="widthFix" ></image>
          <view class="coupon-price-board">
            <view class="coupon-price no-cash">
              <view></view>
              <view>{{item.score}}</view>
              <view class="discount">积分</view>
            </view>
          </view>
        </view>
      </scroll-view> -->
          <view class="popup-unvisited-coupo-bottom" @click="toBenefitPlan"></view>
        </view>
      </view>
    </popup>
    <!-- 开屏推广弹窗 -->
    <welfarePromotion usePage="HOME"></welfarePromotion>
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
      :hidden="state.hide_good_box"
      :animation="state.animation"
      :style="'left:' + bus_x + 'px;top:' + bus_y + 'px;'"
    >
      <image :src="goodsBoxImage" mode="aspectFit"></image>
    </view>
    <authorize @login="handleUserLogin" @tabBar="handleTabbar"></authorize>
    <image
      class="scroll-top"
      v-if="state.showScrollTop"
      :src="state.imagesPath.scrollTop"
      @click="handleScrollTop"
    ></image>
    <view
      class="popup-official-account"
      v-if="state.show.official"
      @click.stop="toggleOfficialPopup"
      @click="toggleOfficialPopup"
      @touchmove="toggleOfficialPopup"
      @longtap="toggleOfficialPopup"
    >
      <view
        :class="
          'popup-official-account-content-top ' + (state.isPushCollectShowed ? 'collect' : '')
        "
        v-if="state.isHomeShowTopMember"
      ></view>
      <view
        :class="
          'popup-official-account-content-middle ' + (state.isPushCollectShowed ? 'collect' : '')
        "
        v-if="
          state.memberEntrance.isShowScore ||
          state.memberEntrance.isShowBalance ||
          state.memberEntrance.isShowCoupon ||
          state.memberEntrance.isShowGiftCard
        "
      ></view>
      <view
        :class="'popup-official-account-content ' + (state.isPushCollectShowed ? 'collect' : '')"
      >
        <image :src="state.imagesPath.iconOfficialAccount"></image>
      </view>
    </view>
  </view>
</template>
<script setup>
import _apiSystemServiceJs2 from '@/service/api/newretail/systemService'
import _apiLiveRoomServiceJs from '@/service/api/newretail/liveRoomService'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsAuthJs from '@/utils/newretail/auth'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiHelpActivityServiceJs from '@/service/api/newretail/helpActivityService'
import _apiRaffleServiceJs from '@/service/api/newretail/raffleService'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
import _apiSearchServiceJs from '@/service/api/newretail/searchService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
import _apiSharePicturesServiceJs from '@/service/api/newretail/sharePicturesService'
import _apiBannerServiceJs from '@/service/api/newretail/bannerService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
// import { onLoad, onShow, onShareAppMessage, onPullDownRefresh, onUnload, onHide, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bus from 'iny-bus'
import NavigationBar from '@/pages-sub/newretail/components/navigation-bar/navigation-bar.vue'
import CustomLoadingPage from '@/pages-sub/newretail/components/customLoadingPage/customLoadingPage.vue'
import lazyLoadPage from '@/pages-sub/newretail/components/lazy-load-page/lazy-load-page.vue'
import CustomLoading from '@/pages-sub/newretail/components/loading/loading.vue'
import Popup from '@/pages-sub/newretail/components/popup/popup.vue'
import WelfarePromotion from '@/pages-sub/newretail/components/welfarePromotion/welfarePromotion.vue'
import SetMeal from '@/pages-sub/newretail/components/setMeal/setMeal.vue'
import Authorize from '@/pages-sub/newretail/components/authorize/authorize.vue'
const app = getApp()
let indexInterBackground = false
// index.js
const storeService = _apiStoreServiceJs
const bannerService = _apiBannerServiceJs
const sharePicturesService = _apiSharePicturesServiceJs
const shopcartService = _apiShopcartServiceJs
const memberService = _apiMemberServiceJs
const searchService = _apiSearchServiceJs
const wxaUserService = _apiWxaUserServiceJs
const couponService = _apiCouponServiceJs
const raffleService = _apiRaffleServiceJs
const helpActivityService = _apiHelpActivityServiceJs
const systemService = _apiSystemServiceJs
const auth = _utilsAuthJs
const selfA = _utilsSelfJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs
const AUTHORIZE = _utilsAuthorizeJs
const liveRoomService = _apiLiveRoomServiceJs
const sysService = _apiSystemServiceJs2
let eventId = null
const newMbrAdsense = reactive({})
const promotionAdsense = reactive({})
// 获取应用实例
const state = reactive({
  latitude: null,
  longitude: null,
  sceneStoreFlag: false,
  getUpdateTime: null,
  isUserLocationTrueShowPage: false,
  // 是否限制开启定位权限时才显示首页
  firstShow: true,
  imgstatus: '',
  liveRoomLogoUrl: '',
  imagesPath: IMGAGESPATH,
  tabbar: {},
  userInfo: {},
  memberInfo: {},
  member: {},
  isShowTopNavigation: true,
  // 是否显示头部导航 默认显示 如果配置顶屏则默认不显示
  isShowTopNavigationFlag: '',
  // 是否顶屏
  topSearchStyle: '',
  // 搜索栏区域风格 风格1搜索显示在标题行左侧/风格2显示在标题行下方，搜索框的颜色取系统主题色配置
  nearStoreStyle: '',
  // 附近门店区风格  风格1显示在标题行左侧，风格2位置固定在界面第一个组件下方，风格3固定在商场精选上方
  isShowProductAreaTitle: '',
  // 门店精选商品区是否展示标题
  couponNum: '0',
  reserveBalance: '0',
  scoreBalance: '0',
  giftcardNum: '0',
  // 礼品卡数量
  navHeight: {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo(),
  }.statusBarHeight,
  memberEntrance: {
    isShowScore: false,
    isShowCoupon: false,
    isShowBalance: false,
    isShowGiftCard: false,
  },
  hasUserInfo: false,
  isMember: false,
  canIUse: uni.canIUse('button.open-type.getUserInfo'),
  showTabbar: false,
  storeId: '',
  storeInfo: {
    name: '',
  },
  category: [],
  // 类目以及类目下商品
  tabSelected: '0',
  goodsList: [],
  banners: [],
  hasaAuthorization: true,
  fineQualityGoodsList: [],
  searchLabelShow: false,
  nameLikes: '',
  activityList: [],
  searchText: '',
  keywords: [],
  memberInfoFunctionEntry: [],
  functionEntryList: [],
  speechStart: false,
  // 弹窗控制
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    coupon: false,
    luckDraw: false,
    luckDrawResult: false,
    adsense: false,
    regist: false,
    // 新用户注册弹窗
    unVisitedCoupon: false,
    // 未读券
    showPushCollect: false,
    // 提醒用户收藏
    official: false,
    luckDrawPopup: false,
    benefitPlanDrawPopup: false,
  },
  benefitPlan: [],
  signFlag: false,
  signPoint: 0,
  overlayStyle: 'background: rgba(255, 255, 255, 0.9);top:88rpx;',
  phone: false,
  donateCoupons: {},
  promotionAdsense: {},
  onPullDownRefreshFlag: false,
  payCodeTime: 0,
  luckDrawTextImage: './image/text.png',
  overlayStyle2: '',
  luckDrawImageBg: '',
  isScanCode: false,
  raffleId: '',
  hasRaffleCoupon: true,
  raffleInfo: {},
  activeState: 'start',
  // start end
  raffleResult: 'UNSTART',
  raffleActivityId: '',
  raffleType: 'LHJ',
  hide_good_box: true,
  animation: {},
  shopCart: {},
  // 购物车商品数量
  shopCartGoodsId: [],
  // 购物车商品id列表
  meals: {
    show: false,
    productId: '',
    storeId: '',
  },
  groupGoodsList: [],
  // 首页拼团主题活动拼团活动
  newGoodsList: [],
  // 首页新品专区数据
  grabData: [],
  // 首页抢购主题活动抢购数据
  secKillTimeId: 0,
  raffleSharePictures: '',
  sharePictures: '',
  // 分享图
  hasMemberModule: false,
  grabProducts: {},
  // 购物车中秒杀商品集合
  isHomeShowTopSearch: true,
  // 首页是否展示顶部搜索栏,默认true
  isHomeShowTopMember: false,
  // 首页是否展示顶部会员区,默认false
  isHomeShowNearStore: false,
  // 首页是否展示附近门店,默认false
  storePromotion: [],
  // 当前页面是否在前台
  isOnForeground: false,
  // 一码付当前支付方式
  currentPayMethod: {
    id: '',
    payMethod: '',
    payName: '',
  },
  // 获取到的项目支付方式列表
  payMethodList: [],
  uiconfig: null,
  unVisitedCoupons: [],
  // 未使用的券
  isPushCollectShowed: false,
  // 是否显示过收藏小程序的弹窗
  isNeedGetUnvisitedCoupon: true,
  // 是否需要获取未读券，默认时true，获取之后会变成false。当页面消失时候置为true
  isShowScorePayCode: true,
  bargainList: [],
  // 砍价列表
  noticeList: [],
  // 公告列表
  hasOfficialAccount: false,
  // 是否显示了关注公众号组件
  storeTags: [],
  swiperCurrent: 0,
  showMemberCode: true,
  payCode: '',
  loading: true,
  // 是否正在加载
  memberCode: null,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  isVIP: false,
  vipGradeConfig: null,
  afterShareToDraw: false,
  popupWindowImage: '',
  searchHeight: 44,
  isSearchFixed: false,
  showScrollTop: false,
  storeProDisplayStyle: 'one',
  memberGrade: null,
  pageShow: true,
  refreshType: '',
  // 数据刷新类型 USER,STORE,ALL
  userRefresh: false,
  // 是否刷新用户信息
  onReachBottom: false,
  openCustomTabbar: false,
  liveRoomShowCenter: true,
  // 首页是否显示直播引导
  x: 750,
  y: 450,
  roomId: -1,
  // 正在直播的房间id
  showLoading: false,
  // 自定义Loading
  pageImage: '',
  // 是否有加载页图片
  loadingImage: '',
  // 加载动画图
  remainingTime: 3, // 广告倒计时
})
const customData = {
  hasLuckyDraw: false,
  hasLuckyDrawQuery: false,
  hasUserDraw: false,
  hasOfficialAccountQuery: false,
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
function indexToAuthorize(e) {
  toggleRegistPopupClose(e)
  NAVPAGE.toAuthorize()
}
function handleRefreshData(e) {
  const that = this
  if (e.detail === 'USER') {
    // 用户信息有刷新
    const user = app.globalData.userInfo
    if (!user.member) {
      state.isMember = false
      state.userInfo = user.wxaUser
      state.hasUserInfo = true
      state.member = {
        couponNum: 0,
      }
    } else {
      state.member = {
        ...state.member,
        ...user.member,
        nickName: user.member.nickName ? user.member.nickName : user.wxaUser.nickName,
      }
      state.isMember = true
      state.userInfo = {
        ...user.wxaUser,
      }
      state.hasUserInfo = true
      uni.setStorage({
        key: 'wj_member',
        data: user.member,
      })
    }
    state.refreshType = 'USER'
    getluckDraw(state.storeId)
  }
}
function getUserInfo(e) {
  console.log(e)
  const that = this
  wxaUserService
    .login(true)
    .then((res) => {
      console.log(res)
      auth.setUser(res)
      app.globalData.userInfo = res && res.member ? res : null
      if (!res.member) {
        state.isMember = false
        state.userInfo = res.wxaUser
        state.hasUserInfo = true
        state.member = {
          couponNum: 0,
        }
        NAVPAGE.toAuthorize()
      } else {
        auth.getDistributor()
        auth.bindDistribution()
        // 刷新会员信息
        state.member = {
          ...state.member,
          ...res.member,
          nickName: res.member.nickName ? res.member.nickName : res.wxaUser.nickName,
        }
        state.isMember = true
        state.userInfo = {
          ...res.wxaUser,
        }
        state.hasUserInfo = true
        getMemberUserInfo()
        if (app.globalData.storeInfo) {
          recordVisitStore(app.globalData.storeInfo.id)
        }
        uni.setStorage({
          key: 'wj_member',
          data: res.member,
        })
      }
      getMemberGrade()
      checkUserInfo()
      getluckDraw(state.storeId)
    })
    .catch((err) => {
      console.log(err)
      const msg = 'meet frequency limit'
      const authorize = 'auth deny'
      const errMsg = err.message
      state.isMember = false
      state.hasUserInfo = false
      if (errMsg.indexOf(msg) > -1) {
        uni.showToast({
          title: '登陆超时，请小憩片刻再来登陆吧~',
          icon: 'none',
          duration: 2000,
        })
      } else if (errMsg.indexOf(authorize) > -1) {
        uni.showToast({
          title: '授权失败，请点击头像重新登录~',
          icon: 'none',
          duration: 2000,
        })
      } else {
        uni.showToast({
          title: '登陆失败，请点击头像重新登录~',
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function getMemberUserInfo() {
  const user = app.globalData.userInfo
  console.log('当前用户信息----------------')
  console.log(user)
  if (user) {
    state.userInfo = {
      ...user.wxaUser,
    }
    state.userRefresh = true
    if (user.member) {
      state.hasUserInfo = true
      state.isMember = true
      state.memberInfo = user.member
      console.log(state.hasMemberModule)
      getUIconfig()
      if (state.storeId) {
        // this.getShopCart(this.data.storeId)
        const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
        state.shopCart = localShopingCart.items
        state.shopCartGoodsId = localShopingCart.goodsId
      }
    }
  }
}
function openSetting() {
  uni.showModal({
    title: '授权提示',
    content:
      '部分功能需要您的授权才能使用哦~\n错过授权页面的处理方法：删除小程序->重新搜索进入->同意授权',
  })
}
function getNextDayStore() {
  const self = this
  if (util.isNextDayProduct()) {
    // 查询统配门店信息
    if (!app.globalData.nextDayStore) {
      const nextDayStore = uni.getStorageSync('wj_nextDayStore')
      if (nextDayStore && nextDayStore != null) {
        app.globalData.nextDayStore = nextDayStore
      } else {
        storeService
          .getNextDayStore()
          .then((res) => {
            if (res) {
              const nextDayStore = res
              app.globalData.nextDayStore = res
              try {
                uni.setStorageSync('wj_nextDayStore', nextDayStore)
              } catch (e) {
                console.log(e)
              }
            }
          })
          .catch((e) => {
            console.log(e.message)
          })
      }
    }
  }
}
function getDistributionStore() {
  const self = this
  if (util.isDeliveryProduct()) {
    // 查询统配门店信息
    if (!app.globalData.distributionStore) {
      const distributionStore = uni.getStorageSync('wj_distributionStore')
      if (distributionStore && distributionStore != null) {
        app.globalData.distributionStore = distributionStore
      } else {
        storeService
          .getDistributionStore()
          .then((res) => {
            if (res) {
              const distributionStore = res
              app.globalData.distributionStore = res
              try {
                uni.setStorageSync('wj_distributionStore', distributionStore)
              } catch (e) {
                console.log(e)
              }
            }
          })
          .catch((e) => {
            console.log(e.message)
          })
      }
    }
  }
}
function initPage() {
  if (!app.globalData.storeInfo) {
    // 没有当前门店退出
    return
  }
  // 更新页面门店相关数据，显示当前门店
  state.pageShow = true
  const storeInfo = app.globalData.storeInfo
  let distance = null
  if (storeInfo.userLatitude != null && storeInfo.userLongitude != null) {
    distance = util.distance(
      storeInfo.userLatitude,
      storeInfo.userLongitude,
      storeInfo.latitude,
      storeInfo.longitude,
    )
    distance = distance.toFixed(3)
  } else if (storeInfo.distance && storeInfo.distance != null) {
    distance = parseFloat(storeInfo.distance).toFixed(3)
  }
  app.globalData.storeInfo = {
    ...storeInfo,
    distance: distance || '***',
  }
  console.log(app.globalData.storeInfo, 'app.globalData.storeInfo')
  state.storeInfo = app.globalData.storeInfo
  state.storeId = app.globalData.storeInfo.id
  const self = this
  if (state.storeId === '' || state.storeId == null) {
    return
  }
  // 统计PV
  ANALYSIS.PVStatistics(state.storeId)

  // 获取首页弹窗
  handleIndexPopup()
  if (app.globalData.systemConfigure.showCartModule) {
    // 获取用户的购物车数据
    getShopCart(state.storeId)
  }
}
function preloadingPage() {
  // 获取UI配置
  getUIconfig()

  // 获取统配门店信息
  getDistributionStore()
  getNextDayStore()
  if (app.globalData.systemConfigure.showStorePrize) {
    // 获取当前页面分享图
    getSharePictures()
  }
}
function handleIndexPopup() {
  const that = this
  // 如果关注公众号组件加载还未出结果，退出事件
  // if (!app.globalData.isOfficialAccountQueryLoadCount || !that.customData.hasOfficialAccountQuery || that.data.show.official) {
  //   return;
  // }
  // 微信已经不允许强制用户授权
  // 判断是否开启极速登录
  // if (app.globalData.isMiNiAppMustAccreditQueryCount === 0) {
  //   systemService.query("isMiNiAppMustAccredit").then(res => {
  //     app.globalData.isMiNiAppMustAccreditQueryCount = 1
  //     if (res == null) {
  //       handlePopupEvents();
  //       return;
  //     }
  //     if (res.length > 0 && res[0].value != null && res[0].value !== "") {
  //       res = res[0].value === "true" || res[0].value === "TRUE" || res[0].value === true
  //       app.globalData.systemConfigure.isMiNiAppMustAccredit = res
  //     }
  //     handlePopupEvents();
  //   }).catch(err => {
  //     handlePopupEvents();
  //     console.log("查询是否开启极速登录报错：", err.message)
  //   })
  //   return;
  // } else {
  //   handlePopupEvents();
  // }
  handlePopupEvents()
  function handlePopupEvents() {
    if (app.globalData.systemConfigure.isMiNiAppMustAccredit && app.globalData.show.login) {
      // 开启了极速登录且已弹出授权框
    } else {
      // 如果已经注册会员，就查未读的券，否则就查是否有新用户弹窗
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        // 获取未读的券
        getUnVisitedCoupons()
      } else {
        // 查询是否有新用户广告
        if (state.storeId) {
          getNewMemberAd(state.storeId)
        }
      }
    }
  }
}
function getPageImage() {
  const self = this
  const keyArr = ['customizedPage']
  const keys = keyArr.join(',')
  sysService.query(keys).then((res) => {
    if (res) {
      res.forEach((val) => {
        if (val.key === 'customizedPage') {
          state.pageImage = val.value
        }
      })
    }
  })
}
function startCountdown() {
  if (state.remainingTime > 0) {
    interval = setInterval(() => {
      state.remainingTime = state.remainingTime - 1
      if (state.remainingTime <= 0) {
        clearInterval(interval) // 倒计时结束时停止定时器
      }
    }, 1000)
  }
}
function hidePageImage() {
  state.remainingTime = 0
  clearInterval(interval) // 倒计时结束时停止定时器
}
onLoad(async function (_options) {
  console.log('onLoad.........')
  // 获取加载页图片
  // await this.getPageImage()

  // 确保页面始终可以显示，即使在某些异常情况下也能展示内容
  state.pageShow = true
  console.log(
    app.globalData.systemConfigure.customizedPage,
    'app.globalData.systemConfigure.customizedPage',
  )
  if (app.globalData.systemConfigure.customizedPage) {
    state.pageImage = app.globalData.systemConfigure.customizedPage
  }
  // this.customizedPage
  state.showLoading = true
  state.latitude = app.globalData.latitude
  state.longitude = app.globalData.longitude
  const self = this
  eventId = bus.on('userShopCartChange', () => {
    if (app.globalData.storeInfo) {
      getLocalShopCart(app.globalData.storeInfo.id)
    }
  })
  // let queryHomeMemberInfo = await sysService.queryHomeMemberInfoUiInfo({
  //   uiType: 'HOME'
  // })
  preloadingPage()
  // 获取用户信息
  getMemberUserInfo()
  state.sceneStoreFlag = false
  if (_options.scene) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(_options.scene)
    if (scene.indexOf('gmparam:') >= 0) {
      const sceneArr = scene.split('gmparam:')
      const sceneId = sceneArr[1]
      wxaUserService.getSceneById(sceneId).then((res) => {
        const shareArr = res.split('shareId=')
        const shareId = shareArr[1]
        uni.setStorageSync('wj_sharingId', shareId)
        console.log(shareId, '分享人id')
      })
    } else if (scene.indexOf('gmparam:') >= 0) {
      const sceneArr = scene.split('gmparam:')
      const sceneId = sceneArr[1]
      wxaUserService.getSceneById(sceneId).then((res) => {
        const shareArr = res.split('shareId=')
        const shareId = shareArr[1]
        uni.setStorageSync('wj_sharingId', shareId)
        console.log(shareId, '分享人id')
      })
    } else {
      // 查询所有门店判断当前scene数据是否是门店id，当前门店列表中是否有当前门店
      await storeService
        .queryList()
        .then((res) => {
          // let allStores = []
          if (res && res.length > 0) {
            res.forEach((item) => {
              if (item.virtualStoreId === scene) {
                app.globalData.storeInfo = item
                uni.setStorageSync('storeIdactive', item)
                delete _options.scene
                state.sceneStoreFlag = true
                state.storeInfo = item
                state.storeId = item.id
                state.refreshType = 'STORE'
                setTimeout(() => {
                  state.refreshType = ''
                }, 100)
              }
              // if (item.status === 'OPEN') {
              //   allStores.push(item)
              // }
            })
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
  }
  // new app.globalData.addToCart()
  if (app.globalData.sceneInfo) {
    const scene = app.globalData.sceneInfo
    mta.Event.stat('homepagevisit', {
      scene,
    })
  }
  state.navHeight = app.globalData.navHeight
  state.themeColor = app.globalData.uiconfig ? app.globalData.uiconfig.themeColor : null
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
  state.liveRoomLogoUrl = app.globalData.systemConfigure.liveRoomLogoUrl
  state.liveRoomShowCenter = !!app.globalData.systemConfigure.liveRoomShowCenter
  if (state.liveRoomShowCenter) {
    const opts = {
      page: 1,
      pageSize: 0,
      statusIn: 'CREATED,STARTED',
    }
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      opts.memberId = app.globalData.userInfo.member.id
    }
    liveRoomService
      .query(opts)
      .then((res) => {
        const startedFlag =
          res.records &&
          res.records.some((room) => {
            if (room.status == 'STARTED') {
              state.roomId = room.roomId
              state.imgstatus =
                'https://ywyc.obs.cn-east-3.myhuaweicloud.com/GSSM/%E7%9B%B4%E6%92%AD%E5%9B%BE%E6%A0%871.png'
            }
            return room.status == 'STARTED'
          })
        if (!startedFlag) {
          res.records.sort((a, b) => {
            const timeVal = new Date(a.beginTime ? a.beginTime.replace(/-/g, '/') : '').getTime()
            const timeVal1 = new Date(b.beginTime ? b.beginTime.replace(/-/g, '/') : '').getTime()
            return timeVal < timeVal1
          })
          state.roomId = res.records[0].roomId
          state.imgstatus =
            'https://ywyc.obs.cn-east-3.myhuaweicloud.com/GSSM/%E7%9B%B4%E6%92%AD%E5%9B%BE%E6%A0%872.png'
        }
      })
      .catch((err) => {
        console.log(err)
        state.roomId = -1
      })
    const that = this
    uni.getSystemInfo({
      success: function (res) {
        const x = res.windowWidth - 70
        const y = res.windowHeight - 160
        state.x = x
        state.y = y
      },
    })
  }
  if (!state.onPullDownRefreshFlag && _options.isReLaunch != null) {
    const url = decodeURIComponent(_options.pageUrl)
    uni.navigateTo({
      url: JSON.parse(url),
    })
  }
  if (app.globalData.openCustomTabbar) {
    // app.getTabbar()
    // app.editTabbar()
    state.openCustomTabbar = true
    state.showTabbar = true
  } else {
    if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
      app.globalData.tabBar.list.forEach((item) => {
        if (item.linkModel === 'home') {
          // uni.hideTabBar()
          // app.getTabbar()
          // app.editTabbar()
          state.showTabbar = true
        }
      })
    }
  }

  // 设置当前设备是否iPhone X
  state.isIphoneX = app.globalData.isIphoneX
  updateStore()
  if (app.globalData.uiconfig) {
    console.log('UIconfig====')
    console.log(app.globalData.uiconfig)
    let afterShareToDraw = false
    if (app.globalData.uiconfig.afterShareToDraw) {
      afterShareToDraw = app.globalData.uiconfig.afterShareToDraw
    }
    state.uiconfig = app.globalData.uiconfig
    state.afterShareToDraw = afterShareToDraw
  }
  console.log('index onLoad', util.formatTime(new util.ResponseDate()))
  // if (!app.globalData.storeInfo || app.globalData.storeId !== '') {
  //   app.globalData.storeInfo = wx.getStorageSync('storeIdactive')
  // }
  initPage()
  if (!app.globalData.storeInfo) {
    checkLocationAuth()
    // 获取到当前的地理位置，查找出最近的门店
    // ADDRESS.getLocation().then(res => {
    //   console.log("index getLocation res", util.formatTime(new util.ResponseDate()))
    //   console.log(res)
    //   // 更新全局的当前门店信息参数，此时为最近门店
    //   app.globalData.storeInfo = res;
    //   var tempAllStores = wx.getStorageSync('wj_allStores'); // 获取缓存的所有门店

    //   // 只要是进入首页，都会查询是否有抽奖活动，如果有抽奖活动，弹出抽奖活动
    //   // 判断options.scene中是否有值,如果有值，说明是扫码进来
    //   if (options.scene) {
    //     var scene = decodeURIComponent(options.scene);
    //     // let actqr = "ACTQR";

    //     // 判断options.scene是否全部是数字
    //     var reg = /^\d+$/; // 正则校验表达式，判断是否为纯数字
    //     // 如果是纯数字，说明是门店id，从当前缓存的所有门店选出对应的门店
    //     if (reg.test(scene)) {
    //       if (tempAllStores) {
    //         // 如果匹配到一样的门店，使用匹配到的门店，如果没有匹配到，则使用最近的门店
    //         tempAllStores.forEach(item => {
    //           if (item.id === scene) {
    //             let tempStore = {
    //               ...item,
    //               userLatitude: res.userLatitude,
    //               userLongitude: res.userLongitude
    //             };
    //             // 更新当前全局的门店参数
    //             app.globalData.storeInfo = tempStore;
    //           }
    //         })
    //       }
    //     }
    //   }

    //   // 初始化页面内容
    //   this.initPage();
    // }).catch(err => {
    //   console.log("index getLocation", util.formatTime(new util.ResponseDate()))
    //   self.setData({
    //     hasaAuthorization: false,
    //     showTabbar: false
    //   })
    // })
  } else {
    // console.log('进入到了祥和里吗？')
    console.log('index getStoreDistance', util.formatTime(new util.ResponseDate()))
    const storeData = await storeService.getById(app.globalData.storeInfo.id)
    app.globalData.storeInfo = {
      ...app.globalData.storeInfo,
      latitude: storeData && storeData.latitude,
      longitude: storeData && storeData.longitude,
    }
    ADDRESS.getStoreDistance(app.globalData.storeInfo)
      .then((res) => {
        const setTip = uni.getStorageSync('setTip')
        getRecentlyStore()
        // if(!setTip && !this.data.sceneStoreFlag) {
        //   this.getRecentlyStore()
        // } else {
        //   console.log("index getStoreDistance res", util.formatTime(new util.ResponseDate()))
        //   const distance = res.distance ? res.distance : ""
        //   console.log("当前门店距离：" + distance + "km")
        //   app.globalData.storeInfo = res
        //   this.setData({
        //     pageShow: false
        //   })
        //   this.initPage();
        // }
      })
      .catch(() => {
        getRecentlyStore()
        // let setTip = wx.getStorageSync('setTip')
        // if(!setTip) {
        //   this.getRecentlyStore()
        // }
      })
  }
  if (_options.shareId && _options.shareId != '' && _options.shareId != undefined) {
    const shareId = _options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  try {
    const show = uni.getStorageSync('wj_showPushCollectShowed')
    if (!show) {
      state.isPushCollectShowed = !app.globalData.isPushCollectShowed
    } else {
      app.globalData.isPushCollectShowed = true
      state.isPushCollectShowed = false
    }
  } catch (e) {
    state.isPushCollectShowed = !app.globalData.isPushCollectShowed
  }
  state.showLoading = false
  if (state.pageImage) {
    startCountdown()
  }
})
function checkLocationAuth() {
  // let setTip = wx.getStorageSync('setTip')
  // if(setTip) return false
  const systemSetting = uni.getSystemSetting()
  uni.getSetting({
    success: (res) => {
      uni.setStorageSync('setTip', true)
      const authSetting = res.authSetting
      if (authSetting['scope.userLocation']) {
        // && systemSetting.locationEnabled
        getRecentlyStore()
      } else if (authSetting['scope.userLocation'] === false) {
        // 用户未授权，提示用户进行授权
        uni.showModal({
          title: '温馨提示',
          content: '您未授权地理位置信息，部分功能无法正常使用哦~',
          confirmText: '授权位置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting()
            }
          },
        })
      } else if (!systemSetting.locationEnabled) {
        // 用户未授权，提示用户进行授权
        uni.showModal({
          title: '温馨提示',
          content: '您的手机GPS未开启，部分功能无法正常使用哦~',
          confirmText: '确认',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting()
            }
          },
        })
      } else {
        // 用户未明确拒绝也未授权，提示用户进行设置
        uni.authorize({
          scope: 'scope.userLocation',
          success: () => {
            if (systemSetting.locationEnabled) {
              getRecentlyStore()
            } else {
              uni.showModal({
                title: '温馨提示',
                content: '手机定位未开启，部分功能无法正常使用哦~',
                confirmText: '确认',
                success: (res) => {},
              })
            }
          },
          fail: () => {
            uni.showModal({
              title: '温馨提示',
              content: '您未授权地理位置信息，部分功能无法正常使用哦~',
              confirmText: '授权位置',
              success: (res) => {
                // 处理用户响应
                if (res.confirm) {
                  uni.openSetting()
                }
              },
            })
          },
        })
      }
    },
    fail: (err) => {},
  })
}
function getRecentlyStore() {
  // 获取到当前的地理位置，查找出最近的门店
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      const chooseAddressInfo = uni.getStorageSync('wj_chooseAddressInfo')
      if (!chooseAddressInfo) {
        const latitude = res.latitude
        const longitude = res.longitude
        state.latitude = res.latitude
        state.longitude = res.longitude
        app.globalData.latitude = latitude
        app.globalData.longitude = longitude
      }
      app.globalData.location = {
        latitude: res.latitude,
        longitude: res.longitude,
      }
      let tempAllStores = uni.getStorageSync('wj_allStores') // 获取缓存的所有门店
      let tempIndex = null
      if (!tempAllStores) {
        storeService
          .queryList()
          .then(async (res) => {
            tempAllStores = []
            res.forEach((item) => {
              if (item.status === 'OPEN') {
                tempAllStores.push(item)
              }
            })
            uni.setStorageSync('wj_allStores', tempAllStores)
            tempIndex = ADDRESS.getNearestStore(tempAllStores, state.latitude, state.longitude)
            app.globalData.storeInfo = tempAllStores[tempIndex]
            uni.setStorageSync('storeIdactive', app.globalData.storeInfo)
            await initPage()
          })
          .catch((err) => {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000,
            })
          })
      } else {
        tempIndex = ADDRESS.getNearestStore(tempAllStores, state.latitude, state.longitude)
        app.globalData.storeInfo = tempAllStores[tempIndex]
        uni.setStorageSync('storeIdactive', app.globalData.storeInfo)
        initPage()
      }
    },
    fail: (res) => {
      state.hasaAuthorization = false
      state.showTabbar = false
    },
  })
  // ADDRESS.getLocation().then(res => {
  //   // 更新全局的当前门店信息参数，此时为最近门店
  //   app.globalData.storeInfo = res;
  //   // 初始化页面内容
  //   this.initPage();
  // }).catch(err => {
  //   this.setData({
  //     hasaAuthorization: false,
  //     showTabbar: false
  //   })
  // })
}
function getBenefitPlan() {
  memberService.benefitPlanGetByMemberId(app.globalData.userInfo.member.id).then((res) => {
    let signPoint = 0
    if (res) {
      res.forEach((item) => {
        signPoint += parseFloat(item.score)
      })
    }
    const flag =
      res &&
      res.some((item) => {
        return item.benefitPlanIsSign == 1
      })
    state.benefitPlan = res || []
    state.signFlag = flag
    state.signPoint = signPoint || 0
    state.show.benefitPlanDrawPopup = !!(res && res.length > 0)
  })
}
onShow(async function (options) {
  const chooseAddressInfo = uni.getStorageSync('wj_chooseAddressInfo')
  if (chooseAddressInfo) {
    app.globalData.longitude = chooseAddressInfo.longitude
    app.globalData.latitude = chooseAddressInfo.latitude
  }
  if (app.globalData.longitude != state.longitude && app.globalData.latitude != state.latitude) {
    state.longitude = app.globalData.longitude
    state.latitude = app.globalData.latitude
  }
  await sysService.query('liveRoomShowCenter').then((liveConfig) => {
    if (liveConfig && liveConfig.length > 0) {
      state.liveRoomShowCenter = liveConfig[0].value == 'TRUE'
      app.globalData.systemConfigure.liveRoomShowCenter = liveConfig[0].value == 'TRUE'
    }
  })
  console.log('index enter foreground')
  indexInterBackground = false // 首页是否隐藏
  if (app.globalData.uiconfig) {
    let afterShareToDraw = false
    if (app.globalData.uiconfig.afterShareToDraw) {
      afterShareToDraw = app.globalData.uiconfig.afterShareToDraw
    }
    state.uiconfig = app.globalData.uiconfig
    state.afterShareToDraw = afterShareToDraw
  }
  if (state.isShowTopNavigationFlag) {
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff0000',
      animation: {
        duration: 30,
        timingFunc: 'linear',
      },
    })
  }
  const that = this
  // this.getSearchKeyword()
  // 从授权页返回返回
  if (!state.hasaAuthorization) {
    uni.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userLocation']) {
          // wx.showTabBar()
          state.hasaAuthorization = true
          state.showTabbar = true
          ADDRESS.getLocation()
            .then((res) => {
              console.log(res, '是不是进入到了这里')
              app.globalData.storeInfo = res
              initPage()
            })
            .catch((err) => {
              state.hasaAuthorization = false
              state.showTabbar = false
            })
        }
      },
    })
  }
  // if (app.globalData.storeInfo && app.globalData.storeInfo.id !== this.data.storeId && !this.data.firstShow) {

  //   this.setData({
  //     storeInfo: app.globalData.storeInfo,
  //     storeId: app.globalData.storeInfo.id,
  //     refreshType: "STORE"
  //   })
  //   setTimeout(() => {
  //     this.setData({
  //       refreshType: ""
  //     })
  //   }, 100);
  //   // 切换门店刷新当前页面数据
  //   console.log("切换门店刷新当前页面数据")
  //   this.initPage()
  // } else {
  //   this.setData({
  //     firstShow: false,
  //     storeId: app && app.globalData && app.globalData.storeInfo && app.globalData.storeInfo.id ? app.globalData.storeInfo.id : null,
  //   })
  //   this.initPage()
  // }

  if (state.storeId) {
    if (app.globalData.systemConfigure.showCartModule) {
      // 获取用户的购物车数据
      getShopCart(state.storeId)
    }
    // const localShopingCart = wx.getStorageSync('wj_shopCartStorage');
    // this.setData({
    //   shopCart: localShopingCart.items,
    //   shopCartGoodsId: localShopingCart.goodsId
    // })

    // this.setData({
    //   refreshType: "ONSHOW"
    // })
    // setTimeout(() => {
    //   this.setData({
    //     refreshType: ""
    //   })
    // }, 100);
  }

  // 判断用户是否授权
  checkUserInfo()
  getMemberGrade()
  state.isOnForeground = true
  if (
    app.globalData.isOfficialAccountQueryLoadCount &&
    customData.hasOfficialAccountQuery &&
    (!state.hasOfficialAccount || !state.show.official)
  ) {
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      getUnVisitedCoupons()
    }
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    getBenefitPlan()
    getProductsCount()
  }
  // 判断是否显示直播引导
  if (app.globalData.systemConfigure) {
    const liveRoomShowCenter = !!app.globalData.systemConfigure.liveRoomShowCenter
    state.liveRoomShowCenter = liveRoomShowCenter
    if (liveRoomShowCenter) {
      const opts = {
        page: 1,
        pageSize: 0,
        statusIn: 'CREATED,STARTED',
      }
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        opts.memberId = app.globalData.userInfo.member.id
      }
      liveRoomService
        .query(opts)
        .then((res) => {
          const startedFlag =
            res.records &&
            res.records.some((room) => {
              if (room.status == 'STARTED') {
                state.roomId = room.roomId
                state.imgstatus =
                  'https://ywyc.obs.cn-east-3.myhuaweicloud.com/GSSM/%E7%9B%B4%E6%92%AD%E5%9B%BE%E6%A0%871.png'
              }
              return room.status == 'STARTED'
            })
          if (!startedFlag) {
            res.records.sort((a, b) => {
              const timeVal = new Date(a.beginTime ? a.beginTime.replace(/-/g, '/') : '').getTime()
              const timeVal1 = new Date(b.beginTime ? b.beginTime.replace(/-/g, '/') : '').getTime()
              return timeVal < timeVal1
            })
            state.roomId = res.records[0].roomId
            state.imgstatus =
              'https://ywyc.obs.cn-east-3.myhuaweicloud.com/GSSM/%E7%9B%B4%E6%92%AD%E5%9B%BE%E6%A0%872.png'
          }
        })
        .catch((err) => {
          console.log(err)
          state.roomId = -1
        })
      uni.getSystemInfo({
        success: function (res) {
          const x = res.windowWidth - 70
          const y = res.windowHeight - 160
          state.x = x
          state.y = y
        },
      })
    }
  }

  // this.checkLocationAuth()
})
function toCouponCenter() {
  NAVPAGE.toCouponCenter()
}
function toGiftCard() {
  NAVPAGE.toGiftCardCenter()
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
    } else if (pageInfo.appReturnType === 'NEW_GOODS') {
      // 新品
      NAVPAGE.toNewGoods()
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
      if (state.uiconfig.isHomePayCodeEnabled) {
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
    } else if (pageInfo.appReturnType === 'GIFTCARD') {
      // 如果跳转类型是礼品卡，跳转到礼品卡界面
      NAVPAGE.toGiftCardCenter()
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
    } else if (pageInfo.appReturnType === 'LIVEROOM') {
      // 直播列表
      NAVPAGE.toLivePlayerCenter()
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
  } else if (pageInfo.linkType === 'SCORE_RAFFLE') {
    // 积分抽奖
    if (pageInfo.raffleActivityId) {
      const opts = '?raffleActivityId=' + pageInfo.raffleActivityId
      NAVPAGE.toRaffle(opts)
    }
  } else if (pageInfo.linkType === 'TEAMPRODUCT') {
    // 拼团商品
    const opts =
      '?productId=' +
      pageInfo.teamActivityId +
      '&storeId=' +
      app.globalData.storeInfo.id +
      '&type=group'
    NAVPAGE.toGoodsDetails(opts)
  } else if (pageInfo.linkType === 'GIFTCARDACTIVITYDETAILS') {
    // 如果跳转类型是礼品卡详情，根据giftcardActivityId跳转到礼品卡详情页
    const opts = '?giftCardActivityId=' + pageInfo.giftcardActivityId
    NAVPAGE.toGiftCardBuy(opts)
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
    // if (pageType === 'activity') {
    //   url = pageInfo.linkUrl
    // } else if (pageType === 'banner') {
    //   url = pageInfo.link
    // }
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
    console.log(webUrl, urlData)
    const jsonUrl = JSON.stringify(urlData)
    const opts = '?webUrl=' + jsonUrl
    NAVPAGE.toAdvertising(opts)
  } else if (pageInfo.linkType === 'BENEFIT_PLAN') {
    NAVPAGE.toBenefitPlan()
  } else if (pageInfo.linkType === 'MEITUAN_XIAOXIANG') {
    NAVPAGE.toMeituan()
  } else if (pageInfo.linkType === 'TOURISM_PLAN') {
    const opts = '?id=' + pageInfo.tourismPlanId
    NAVPAGE.toTourismPlan(opts)
  } else if (pageInfo.pageUrl) {
    uni.navigateTo({
      url: pageInfo.pageUrl,
    })
  } else {
  }
}
function getSearchKeyword() {
  searchService.query().then((res) => {
    console.log(res)
    if (res.length > 0) {
      const searchText = res[0].keyword
      const tempArray = []
      for (let i = 0; i < res.length; i++) {
        tempArray[i] = res[i]
      }
      const newKeyword = tempArray.shift()
      state.searchText = searchText
      state.keywords = tempArray
    } else {
      state.keywords = res
    }
  })
}
onShareAppMessage(async function (res) {
  const that = this
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  let sharePictures = state.sharePictures
  const raffleSharePictures = state.raffleSharePictures
  if (!sharePictures) {
    const indexPic = await util.getSharePictures('DEFAULT')
    // let res = await sharePicturesService.getByModelType('DEFAULT')
    if (indexPic) {
      state.sharePictures = indexPic
      sharePictures = state.sharePictures
    }
  }
  if (res.from === 'button') {
    if (raffleSharePictures !== '' && raffleSharePictures != null) {
      sharePictures = raffleSharePictures
    }
    console.log(res)
    let path = '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + state.storeId
    // 未开启分享后抽奖进行兑奖操作
    if (
      !(state.afterShareToDraw && res.target.dataset.type && res.target.dataset.type === 'luckDraw')
    ) {
      handleRaffleCash()
    }
    if (state.afterShareToDraw) {
      path =
        '/pages-sub/newretail/pages/mallModule/activity/luckDraw/luckDraw?raffleId=' +
        state.raffleId +
        '&activityId=' +
        state.raffleActivityId +
        '&type=store&raffleType=' +
        state.raffleType
      // 关闭抽奖弹窗
      if (state.show.luckDraw || state.show.luckDrawPopup) {
        // 查询登陆送券活动
        state.show.luckDraw = false
        state.show.luckDrawPopup = false
        getLoginDonateCouponAdsense(state.storeId)
      }
    }
    console.log(path)
    return {
      title: '优惠券大抽奖',
      path,
      imageUrl: sharePictures,
      success(e) {},
    }
  } else {
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      const memberId = app.globalData.userInfo.member.id
      return {
        title: app.globalData.systemConfigure.miniprogramSharingName,
        path:
          '/pages-sub/newretail/pages/mallModule/index/index/index?shareId=' +
          memberId +
          '&storeId=' +
          state.storeId,
        imageUrl: sharePictures,
        success(e) {},
      }
    } else {
      return {
        title: app.globalData.systemConfigure.miniprogramSharingName,
        path: '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + state.storeId,
        imageUrl: sharePictures,
        success(e) {},
      }
    }
  }
})
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
function recordVisitStore(storeId) {
  if (app.globalData.systemConfigure.enableRecordVisitStore) {
    memberService
      .visitStore(storeId)
      .then((res) => {
        console.log(res)
      })
      .catch((e) => {
        console.log(e.message)
      })
  }
}
function noop(e) {
  // console.log(e)
}
function updateStore() {
  const updatePage = uni.getStorageSync('updatePage')
  if (updatePage == 2) {
    if (state.getUpdateTime) {
      clearInterval(state.getUpdateTime)
      state.getUpdateTime = null
    }
    return false
  }
  if (!state.getUpdateTime && updatePage === 0) {
    state.getUpdateTime = setInterval(() => {
      updateStore()
    }, 500)
  } else {
    if (updatePage === 1) {
      // clearInterval(this.data.getUpdateTime)
      // this.data.getUpdateTime = null;
      if (state.getUpdateTime) {
        clearInterval(state.getUpdateTime)
        state.getUpdateTime = null
      }
      const store = uni.getStorageSync('storeIdactive') || {}
      if (!state.storeId || (state.storeId != store.id && state.storeId != store.virtualStoreId)) {
        state.storeId = uni.getStorageSync('storeIdactive')
          ? uni.getStorageSync('storeIdactive').id
          : state.storeId
        state.refreshType = 'STORE'
        state.latitude = app.globalData.latitude
        state.longitude = app.globalData.longitude
        setTimeout(() => {
          state.refreshType = ''
        }, 1000)
      }
      uni.setStorageSync('updatePage', 2)
    }
  }
}
onPullDownRefresh(function () {
  const self = this
  state.onPullDownRefreshFlag = true
  state.refreshType = ''
  onLoad(options)
  onShow()
  setTimeout(() => {
    // 特别处理iOS下有loading时下拉刷新秒回弹的问题
    uni.stopPullDownRefresh()
    state.onPullDownRefreshFlag = false
    state.refreshType = 'ALL'
  }, 1000)
})
function getPageConfig(data) {
  if (data && data.detail) {
    const conventionConfig = data.detail
    const keys = Object.keys(conventionConfig)
    keys.forEach((key) => {
      if (key === 'isLunbotuTopScreen' && conventionConfig[key] === 'TRUE') {
        state.isShowTopNavigation = conventionConfig[key] !== 'TRUE'
        state.isShowTopNavigationFlag = conventionConfig[key] === 'TRUE'
      } else if (key == 'pageTitle') {
        state.navigationBarTitle = conventionConfig[key]
      } else if (key == 'bgMarginTop') {
        state.bgMarginTop = conventionConfig[key] * 2 - 6
      } else {
        state[key] = conventionConfig[key]
        if (key == 'liveRoomLogoUrl') {
          app.globalData.systemConfigure[key] = conventionConfig[key]
        }
      }
    })
    state.navHeight = app.globalData.navHeight
  }
}
const queryLoginDonateCoupon = ref(false)
function getLoginDonateCouponAdsense(storeId) {
  const that = this
  if (queryLoginDonateCoupon.value === true) {
    return
  }
  queryLoginDonateCoupon.value === true
  let hasShow = false
  const show = state.show
  for (const key in show) {
    if (show.hasOwnProperty(key)) {
      const ele = show[key]
      if (ele) {
        hasShow = true
      }
    }
  }
  if (hasShow) {
    queryLoginDonateCoupon.value === false
    // 有弹窗在显示
    return
  }
  if (state.onPullDownRefreshFlag === false) {
    try {
      const value = uni.getStorageSync('wj_loginDonateCouponCount')
      if (value) {
        const tempTime = value.replace(/-/g, '/')
        const nowTime = new util.ResponseDate().getTime()
        const time = new Date(tempTime).getTime()
        if (nowTime > time) {
          getLoginDonateCoupon(storeId)
        }
      } else {
        getLoginDonateCoupon(storeId)
      }
    } catch (error) {
      queryLoginDonateCoupon.value === false
      console.log(error)
    }
  } else {
    queryLoginDonateCoupon.value === false
  }
}
function getLoginDonateCoupon(storeId) {
  const that = this
  // if (app.globalData.loginDonateCouponCount === 0) {
  //   bannerService.getStoreBannerList('LOGIN_DONATE_COUPON_ADSENSE', storeId).then(res => {
  //     that.queryLoginDonateCoupon === false;
  //     if (res && res.length > 0) {
  //       app.globalData.loginDonateCouponCount = 1
  //       that.setData({
  //         donateCoupons: res[0]
  //       })
  //       that.toggleCouponPopup()
  //     } else {}
  //   }).catch(err => {
  //     that.queryLoginDonateCoupon === false;
  //   })
  // }
}
function clickAssignCoupon(e) {
  const self = this
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const coupons = state.donateCoupons
    const now = new util.ResponseDate()
    const time = util.formatTime(now).replace(/\//g, '-')
    const tempTimeArr = time.split(' ')
    const tempTermValidity = tempTimeArr[0] + ' 23:59:59'
    const tempCouponsArr = coupons.donateCouponActivityIds.split(',')
    const couponsArr = []
    tempCouponsArr.forEach((item) => {
      if (item !== '' && item !== undefined && item !== null) {
        couponsArr.push(item)
      }
    })
    const resultArr = []
    for (let i = 0; i < couponsArr.length; i++) {
      const couponActivityId = couponsArr[i]
      const postData = {
        activityId: couponActivityId,
      }
      const data = couponService
        .assign(postData)
        .then((res) => {
          console.log('券clickAssignCoupon')
          console.log(res)
          util.setHideLoading(true)
          // 登录送券不标为已读
          // let couponIds = []
          // couponIds.push(res)

          // couponService.visited(couponIds).then(result => {
          //   // console.log(result)
          //   if (i === couponsArr.length - 1) {
          //     util.setHideLoading(false)
          //   }
          // }).catch(err => {
          //   console.log(err)
          // })
          return {
            data: res,
            isReceived: true,
          }
        })
        .catch((err) => {
          util.setHideLoading(false)
          console.log(err)
          return {
            data: err,
            isReceived: false,
          }
        })
      resultArr.push(data)
    }
    Promise.all(resultArr).then((res) => {
      let receivedCount = 0
      let unReceivedCount = 0
      let err = null
      let otherErr = null
      res.forEach((item) => {
        if (item.isReceived === true) {
          receivedCount++
        } else {
          unReceivedCount++
          if (item.data.code === 17010) {
            err = item.data
          } else {
            otherErr = item.data
          }
        }
      })
      if (receivedCount > 0 && receivedCount <= res.length) {
        if (state.show.coupon === true) {
          state.show.coupon = false
          uni.setStorageSync('wj_loginDonateCouponCount', tempTermValidity)
          // 查询未读券
          state.isNeedGetUnvisitedCoupon = true
          getUnVisitedCoupons()
        }
      } else {
        if (unReceivedCount === res.length) {
          if (state.show.coupon === true) {
            if (err && err.code === 17010) {
              uni.showToast({
                title: '您今天已经领取过了~',
                icon: 'none',
                duration: 2000,
              })
              uni.setStorageSync('wj_loginDonateCouponCount', tempTermValidity)
            } else if (otherErr) {
              uni.showToast({
                title: otherErr.message,
                icon: 'none',
                duration: 2000,
              })
            } else {
            }
            state.show.coupon = false
          }
        }
      }
    })
  } else {
    NAVPAGE.toAuthorize()
  }
}
function recorderPopup() {
  toggleBottomPopup()
}
function handleRaffleOutcome(e) {
  const self = this
  const raffleId = e.detail.outcome
  state.raffleId = raffleId
  const now = new util.ResponseDate()
  const time = util.formatTime(now).replace(/\//g, '-')
  const tempTimeArr = time.split(' ')
  const tempTermValidity = tempTimeArr[0] + ' 23:59:59'
  if (e.detail.status) {
    if (e.detail.raffleInfo) {
      state.raffleInfo = e.detail.raffleInfo
      uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
      handleLuckDrawPopupClose(true)
      toggleluckDrawResultPopup()
    } else {
      let raffleInfo = null
      raffleService
        .getById(raffleId)
        .then((res) => {
          if (res && res.records.length > 0) {
            for (let i = 0; i < res.records.length; i++) {
              const element = res.records[i]
              if (element.creatorId == res.creatorId) {
                raffleInfo = element
                break
              }
            }
          }
          console.log(raffleInfo)
          state.raffleInfo = raffleInfo
          uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
          handleLuckDrawPopupClose(true)
          toggleluckDrawResultPopup()
        })
        .catch((err) => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
        })
    }
  } else {
    if (e.detail.error) {
      const err = e.detail.error
      if (err.code === 41004) {
        state.hasRaffleCoupon = false
        handleLuckDrawPopupClose(true)
        toggleluckDrawResultPopup()
        uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
      } else {
        handleLuckDrawPopupClose(true)
        uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
      }
    }
  }
}
function handleRaffleCash() {
  // 分享回调已经被封掉，接收不到，关闭弹窗操作放到兑奖操作中
  toggleluckDrawResultPopup()
  // 兑奖后查询登陆送券活动
  getLoginDonateCouponAdsense(state.storeId)
}
function getluckDraw(storeId) {
  console.log('====================getluckDraw')
  const that = this
  if (state.onPullDownRefreshFlag === false) {
    if (!app.globalData.systemConfigure.showStorePrize) {
      getLoginDonateCouponAdsense(storeId)
      return
    }
    try {
      const value = uni.getStorageSync('wj_luckyDrawRecordTime')
      if (value) {
        const tempTime = value.replace(/-/g, '/')
        const nowTime = new util.ResponseDate().getTime()
        const time = new Date(tempTime).getTime()
        if (nowTime > time) {
          if (app.globalData.luckyDrawPopupCount === 0) {
            queryLuckDraw(storeId)
          }
        } else {
          getLoginDonateCouponAdsense(storeId)
        }
        console.log(tempTime, time)
      } else {
        if (app.globalData.luckyDrawPopupCount === 0) {
          queryLuckDraw(storeId)
        } else {
          getLoginDonateCouponAdsense(storeId)
        }
      }
    } catch (error) {
      uni.showToast({
        title: error.message,
        icon: 'none',
        duration: 2000,
      })
    }
  }
  /**
   * 查询抽奖活动
   */
  function queryLuckDraw(storeId) {
    console.log('有进入到这里吗？？？')
    if (state.show.luckDraw || state.show.luckDrawPopup) {
      // 弹窗已经弹出
      if (app.globalData.userInfo) {
        const postData = {
          storeId,
          activityId: state.raffleActivityId,
          wxaOpenid: app.globalData.userInfo.wxaUser.openId,
        }
        raffleService
          .create(postData)
          .then((res) => {
            state.raffleId = res
          })
          .catch((err) => {
            console.log('创建分享抽奖id报错：', err.message)
            getLoginDonateCouponAdsense(storeId)
          })
      }
      return
    }
    raffleService
      .getByType('STORE_RAFFLE')
      .then((res) => {
        if (!res) {
          // 门店没有抽奖送券活动查询登陆送券活动
          console.log('门店没有抽奖送券活动查询登陆送券活动')
          getLoginDonateCouponAdsense(storeId)
          return
        }
        state.raffleActivityId = res.id
        state.raffleType = res.raffleType
        customData.hasLuckyDraw = true
        isQueryLuckDraw = true
        const data = res
        // 调用接口创建抽奖获取抽奖id
        if (app.globalData.userInfo) {
          const postData = {
            storeId,
            activityId: state.raffleActivityId,
            wxaOpenid: app.globalData.userInfo.wxaUser.openId,
          }
          raffleService
            .create(postData)
            .then((res) => {
              state.raffleId = res
              if (data.raffleType === 'LHJ') {
                if (!state.show.adsense && !state.show.luckDraw && !state.show.luckDrawPopup) {
                  // 促销弹窗未弹出
                  toggleLuckDrawPopup(true)
                }
              } else if (data.raffleType === 'POPUP_WINDOWS') {
                // 弹窗抽奖
                state.popupWindowImage = data.popupWindowImage
                if (!state.show.adsense && !state.show.luckDraw && !state.show.luckDrawPopup) {
                  // 促销弹窗未弹出
                  togglePopupLuckDraw()
                }
              }
            })
            .catch((err) => {
              console.log('创建分享抽奖id报错：', err.message)
              getLoginDonateCouponAdsense(storeId)
            })
        } else {
          // 未登录需要弹出抽奖信息
          if (data.raffleType === 'LHJ') {
            if (!state.show.adsense && !state.show.luckDraw && !state.show.luckDrawPopup) {
              // 促销弹窗未弹出
              toggleLuckDrawPopup(true)
            }
          } else if (data.raffleType === 'POPUP_WINDOWS') {
            // 弹窗抽奖
            state.popupWindowImage = data.popupWindowImage
            if (!state.show.adsense && !state.show.luckDraw && !state.show.luckDrawPopup) {
              // 促销弹窗未弹出
              togglePopupLuckDraw()
            }
          }
        }
      })
      .catch((err) => {
        console.log(err.message)
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
        // 查询登陆送券活动
        getLoginDonateCouponAdsense(storeId)
      })
  }
}
function getUserIsFans(e) {
  if (e.detail.isFans == false) {
    // 不是粉丝的处理
  } else {
    // 是粉丝的处理
    // 根据全局报错的用户信息检查用户信息
    checkUserInfo()
    getMemberGrade()
  }
}
function getLuckUserInfo(e) {
  // this.getUserInfo()
}
function toggleBottomPopup() {
  toggle('middle')
}
function toggleCouponPopup(e) {
  console.log('触发8')
  toggle('coupon')
}
function toggleRegistPopup(e) {
  if (e != null && e.type === 'submit') {
    getPromotionAdsense(state.storeId)
  }
  console.log('触发7')
  toggle('regist')
}
function toggleRegistPopupClose(e) {
  if (e != null && e.type === 'submit') {
    getPromotionAdsense(state.storeId)
  }
  state.show.regist = false
}
function toggleUnvisitedCouponPopup(e) {
  console.log('触发6')
  toggle('unVisitedCoupon')
}
function handleBenefitPlanDrawPopupClose(e) {
  state.show.benefitPlanDrawPopup = false
}
function handleUnvisitedCouponPopupClose(e) {
  state.show.unVisitedCoupon = false
}
function toggleAdsensePopup() {
  console.log('触发5')
  toggle('adsense')
}
function handleAdsensePopupClose(e) {
  state.show.adsense = false
  console.log(state.show.adsense)
  // 查询是否有抽奖活动(登陆送券相关放在抽奖查询之后)
  console.log('查询是否有抽奖活动')
  getluckDraw(state.storeId)
}
function toggleLuckDrawPopup() {
  const that = this
  console.log('触发4')
  toggle('luckDraw')
  if (isQueryLuckDraw) {
    isQueryLuckDraw = false
  } else {
    app.globalData.luckyDrawPopupCount = 1
  }
}
function handleLuckDrawPopupClose(val) {
  const that = this
  const raffleInfo = state.raffleInfo
  const raffleInfoArr = raffleInfo ? Object.keys(raffleInfo) : 0
  if (val != null) {
    state.show.luckDraw = false
    if (isQueryLuckDraw) {
      isQueryLuckDraw = false
    } else {
      app.globalData.luckyDrawPopupCount = 1
    }
  } else {
    if (raffleInfoArr.length == 0 && state.show.luckDraw && customData.hasUserDraw) {
      app.globalData.luckyDrawPopupCount = 1
      uni.showModal({
        title: '温馨提示',
        content:
          '系统正在处理您的抽奖结果，如果中奖，奖品稍后将发放到您的账户，您可以在（我的->我的优惠券）中查看。',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('触发3')
            toggle('luckDraw')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
      // 标记用户手动关闭了弹窗
      userCloseRaffle = true
    }
  }
}
function togglePopupLuckDraw(val) {
  console.log('触发2')
  toggle('luckDrawPopup')
}
function handlePopupLuckDrawClose(val) {
  state.show.luckDrawPopup = false
}
function toggleluckDrawResultPopup() {
  if (userCloseRaffle != null && userCloseRaffle === true) {
  } else {
    console.log('触发1')
    toggle('luckDrawResult')
  }
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
  state.overlayStyle = state.overlayStyle
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
      state.memberInfo = app.globalData.userInfo.member
      getMemberUserInfo()
    } else {
      // 不是会员跳转授权页
      state.userInfo = user.wxaUser
      state.hasUserInfo = true
      state.isMember = false
      NAVPAGE.toAuthorize()
    }
    if (state.hasaAuthorization === true) {
      handleIndexPopup()
    }
  }
}
function handleTabbar(e) {
  if (state.hasaAuthorization === true) {
    state.showTabbar = e.detail.showTabbar
  }
}
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures
  } else {
    util
      .getSharePictures('DEFAULT')
      .then((res) => {
        if (res) {
          state.sharePictures = res
        }
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
    // let res = await sharePicturesService.getByModelType('DEFAULT')
  }
  util
    .getSharePictures('RAFFLE_ACTIVITY')
    .then((res) => {
      state.raffleSharePictures = res
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
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
  console.log(e)
  if (e.detail.outcome === true) {
    state.meals = {
      show: false,
      productId: '',
      storeId: '',
    }
  } else {
  }
}
function getUserClickDraw(e) {
  const self = this
  if (e.detail.userDraw) {
    customData.hasUserDraw = true
    // 用户已经点击抽奖
    util.setHideLoading(true)
    if (!state.isActive) {
      // 新抽奖规则直接抽奖，调用抽奖接口后创建抽奖活动获得抽奖id用于分享
      state.isActive = true
      handleDraw(state.raffleActivityId)
      // 调用接口创建抽奖获取抽奖id（门店抽奖分享首页，暂不调用）
    } else {
      uni.showToast({
        title: '您已经在抽奖了~',
        icon: 'none',
      })
    }
  }
}
function handleDraw(raffleActivityId) {
  const self = this
  const postData = {
    raffleActivityId,
    wxaOpenid: app.globalData.userInfo.wxaUser.openId,
  }
  const now = new util.ResponseDate()
  const time = util.formatTime(now).replace(/\//g, '-')
  const tempTimeArr = time.split(' ')
  const tempTermValidity = tempTimeArr[0] + ' 23:59:59'
  raffleService
    .draw(postData)
    .then((res) => {
      util.setHideLoading(false)
      let raffleInfo = null
      let hasCoupon = true
      if (res.rafflePrizeName == '未中奖') {
        hasCoupon = false
      } else {
        raffleInfo = res
        hasCoupon = true
      }
      setTimeout(() => {
        state.raffleInfo = raffleInfo
        state.hasRaffleCoupon = hasCoupon
        state.raffleResult = 'TRUE'
        state.isActive = false
        handleLuckDrawPopupClose(true)
        toggleluckDrawResultPopup()
      }, 2400)
      uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
    })
    .catch((err) => {
      util.setHideLoading(false)
      state.hasRaffleCoupon = false
      state.raffleResult = 'FALSE'
      state.isActive = false
      if (err.code === 41011) {
        setTimeout(() => {
          uni.showToast({
            title: '您今天的抽奖次数已超过上限，明天再来吧~',
            icon: 'none',
            duration: 2000,
          })
          handleLuckDrawPopupClose(true)
        }, 2400)
        uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
      } else if (err.code === 41005 || err.code === 41007 || err.code === 41003) {
        // 活动过期
        state.activeState = 'end'
        setTimeout(() => {
          handleLuckDrawPopupClose(true)
          toggleluckDrawResultPopup()
        }, 2400)
        uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
      } else if (err.code === 41004 || err.code === 41010) {
        /**
         * 报错原因是券数量不足
         * 弹窗应该是您来晚了奖品已被抽光了！
         */
        setTimeout(() => {
          handleLuckDrawPopupClose(true)
          toggleluckDrawResultPopup()
        }, 2400)
        uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
      } else if (err.code === 41014) {
        setTimeout(() => {
          uni.showToast({
            title: '您今天已经抽过了，不要贪心哦~',
            icon: 'none',
            duration: 2000,
          })
          handleLuckDrawPopupClose(true)
        }, 2400)
        uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
      } else {
        // 其他报错需要查询具体原因
        setTimeout(() => {
          uni.showToast({
            title: '抽奖人数过多，请稍后再试哦~',
            icon: 'none',
            duration: 2000,
          })
          handleLuckDrawPopupClose(true)
        }, 2400)
      }
      setTimeout(() => {
        state.raffleResult = 'UNSTART'
      }, 2400)
    })
}
function handlePopupDraw() {
  const self = this
  // 用户已经点击抽奖
  util.setHideLoading(true)
  let isDraw = false
  const postData = {
    storeId: state.storeId,
    activityId: state.raffleActivityId,
    wxaOpenid: app.globalData.userInfo.wxaUser.openId,
  }
  const now = new util.ResponseDate()
  const time = util.formatTime(now).replace(/\//g, '-')
  const tempTimeArr = time.split(' ')
  const tempTermValidity = tempTimeArr[0] + ' 23:59:59'
  if (app.globalData.userInfo) {
    createRaffle(postData)
  } else {
    NAVPAGE.toAuthorize()
  }
  function createRaffle(postData) {
    raffleService
      .create(postData)
      .then((res) => {
        state.raffleId = res
        if (!state.afterShareToDraw) {
          // 如果分享后抽奖为false,直接抽奖抽奖
          isDraw = true
          const postData = {
            storeId: options.storeId,
            raffleActivityId: state.raffleActivityId,
            wxaOpenid: app.globalData.userInfo.wxaUser.openId,
          }
          return raffleService.draw(postData)
        }
      })
      .then((res) => {
        if (!state.afterShareToDraw) {
          // 处理抽奖逻辑
          util.setHideLoading(false)
          let raffleInfo = null
          let hasCoupon = true
          if (res.rafflePrizeName == '未中奖') {
            hasCoupon = false
          } else {
            raffleInfo = res
            hasCoupon = true
          }
          state.raffleInfo = raffleInfo
          state.hasRaffleCoupon = hasCoupon
          state.isActive = false
          handlePopupLuckDrawClose()
          toggleluckDrawResultPopup()
          uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
        }
      })
      .catch((err) => {
        util.setHideLoading(false)
        if (isDraw) {
          // 处理抽奖的报错
          state.hasRaffleCoupon = false
          state.isActive = false
          if (err.code === 41011) {
            handlePopupLuckDrawClose()
            setTimeout(() => {
              uni.showToast({
                title: '您今天的抽奖次数已超过上限，明天再来吧~',
                icon: 'none',
                duration: 2000,
              })
            }, 500)
            uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
          } else if (err.code === 41005 || err.code === 41007 || err.code === 41003) {
            // 活动过期
            state.activeState = 'end'
            handlePopupLuckDrawClose()
            toggleluckDrawResultPopup()
            uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
          } else if (err.code === 41004 || err.code === 41010) {
            /**
             * 报错原因是券数量不足
             * 弹窗应该是您来晚了奖品已被抽光了！
             */
            handlePopupLuckDrawClose()
            toggleluckDrawResultPopup()
            uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
          } else if (err.code === 41014) {
            uni.showToast({
              title: '您今天已经抽过了，不要贪心哦~',
              icon: 'none',
              duration: 2000,
            })
            handlePopupLuckDrawClose()
            uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
          } else {
            // 其他报错需要查询具体原因
            uni.showToast({
              title: '抽奖人数过多，请稍后再试哦~',
              icon: 'none',
              duration: 2000,
            })
            handlePopupLuckDrawClose()
          }
        } else {
          // 处理创建分享抽奖的报错
          handlePopupLuckDrawClose()
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
        }
      })
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
        state.grabProducts = grabProducts
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
        console.log('查询购物车失败')
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
function getLocalShopCart(storeId) {
  const self = this
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
    console.log(localShopingCart.items)
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
function checkUserInfo() {
  state.refreshType = 'USER'
  setTimeout(() => {
    state.refreshType = ''
  }, 100)
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true
    state.userInfo = app.globalData.userInfo.wxaUser
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo
      let isExpired = false
      let isVIP = false
      const now = new util.ResponseDate().getTime()
      let vipEndTimeStamp = now + 1000
      let vipEndTime = ''
      if (res.member.vipEndTime) {
        vipEndTimeStamp = new Date(res.member.vipEndTime.replace(/-/g, '/')).getTime()
        vipEndTime = res.member.vipEndTime.split(' ')[0].replace(/-/g, '.')
      }
      if (now > vipEndTimeStamp) {
        isExpired = true
      }
      if (res.member.vipEndTime && now < vipEndTimeStamp) {
        isVIP = true
        app.globalData.userInfo.member.vip = true
      }
      state.isMember = true
      state.member = res.member
      state.isVIP = isVIP
      state.isExpired = isExpired
      state.vipEndTime = vipEndTime
    }
  } else {
    state.hasUserInfo = false
    state.isMember = false
    state.member = null
    state.userInfo = null
  }
}
function getNewMemberAd(storeId) {
  const that = this
  // 只有打开之后还未弹出过促销广告才会弹出（一次打开只会弹出一次）
  if (app.globalData.newMemberAdCount === 0) {
    bannerService.getStoreBannerList('NEWMEMBERADSENSE', storeId).then((res) => {
      // console.log('這裏有既然怒嗎？？？？');
      if (res && res.length > 0) {
        state.newMbrAdsense = res[0]
        app.globalData.newMemberAdCount = 1
        toggleRegistPopup()
      } else {
        // 查询是否有促销活动
        getPromotionAdsense(state.storeId || storeId)
      }
    })
  } else {
    // 查询是否有抽奖活动(登陆送券相关放在抽奖查询之后)
    getPromotionAdsense(state.storeId || storeId)
  }
}
function getPromotionAdsense(storeId) {
  const that = this
  // 只有打开之后还未弹出过促销广告才会弹出（一次打开只会弹出一次）
  if (app.globalData.promotionAdsenseCount === 0) {
    bannerService.getStoreBannerList('PROMOTIONADSENSE', storeId).then((res) => {
      //   console.log('resdasdasdasd',res);
      if (res && res.length > 0) {
        //   app.globalData.promotionAdsenseCount = 1
        // selfA.getTemporaryUrl(res[0].pictureUrl)
        // .then(item => {
        //     res[0].pictureUrl = item;
        //     that.setData({
        //     promotionAdsense: res[0]
        //     })
        //   })
        state.promotionAdsense = res[0]
        toggleAdsensePopup()
      } else {
        // 查询是否有抽奖活动(登陆送券相关放在抽奖查询之后)
        getluckDraw(state.storeId || storeId)
      }
    })
  } else {
    // 查询是否有抽奖活动(登陆送券相关放在抽奖查询之后)
    getluckDraw(state.storeId || storeId)
  }
}
function adsenseJumping(e) {
  if (app.globalData.userInfo && app.globalData.userInfo) {
    toggle('adsense')
    toAdPage(state.promotionAdsense, 'banner')
  } else {
    const pageInfo = state.promotionAdsense
    if (pageInfo.linkType === 'APP') {
      // 应用
      // 判断跳转模块
      if (pageInfo.appReturnType === 'HELP_COUPON') {
        // 助力送券
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(() => {
          NAVPAGE.toAuthorize()
        }, 2000)
      } else if (pageInfo.appReturnType === 'PENNY') {
        // 购物抽奖
        NAVPAGE.toAuthorize()
      } else if (pageInfo.appReturnType === 'RECHARGE_DRAW') {
        // 充值抽奖
        NAVPAGE.toAuthorize()
      } else if (pageInfo.appReturnType === 'NOTICE') {
        // 系统公告
        NAVPAGE.toSysNotice()
      } else if (pageInfo.appReturnType === 'LIVEROOM') {
        // 直播列表
        NAVPAGE.toLivePlayerCenter()
      } else if (pageInfo.appReturnType === 'CYCLE') {
        uni.navigateTo({
          url: '/pages-sub/newretail/pages/mallModule/activity/cycle/cycle',
        })
      } else if (pageInfo.pageUrl) {
        uni.navigateTo({
          url: pageInfo.pageUrl,
        })
      }
    } else if (pageInfo.linkType === 'FEEDBACK') {
      // 跳转意见反馈页面
      NAVPAGE.toFeedback()
    } else if (pageInfo.linkType === 'COUPONACTIVITYDETAILS') {
      NAVPAGE.toAuthorize()
    } else if (pageInfo.pageUrl) {
      uni.navigateTo({
        url: pageInfo.pageUrl,
      })
    } else {
      NAVPAGE.toAuthorize()
    }
  }
}
function getUIconfig() {
  // 根据UI配置控制页面显示
  if (app.globalData.uiconfig) {
    renderingPageByUI()
  } else {
    systemService
      .queryGroup('UI')
      .then((res) => {
        app.globalData.uiconfig = util.handleUIConfig(res)
        renderingPageByUI()
      })
      .catch((err) => {
        console.log('查询UI配置出错：' + err.message)
      })
  }
}
function renderingPageByUI() {
  const uiconfig = app.globalData.uiconfig
  let isHomeShowTopSearch = true
  let isHomeShowTopMember = false
  let isHomeShowCenterMember = false
  let isHomeShowNearStore = false
  let isShowScorePayCode = false
  uiconfig.isHomeShowTopSearch === true
    ? (isHomeShowTopSearch = true)
    : (isHomeShowTopSearch = false)
  uiconfig.isHomeShowTopMember === true
    ? (isHomeShowTopMember = true)
    : (isHomeShowTopMember = false)
  uiconfig.isHomeShowCenterMember === true
    ? (isHomeShowCenterMember = true)
    : (isHomeShowCenterMember = false)
  uiconfig.isHomeShowNearStore === true
    ? (isHomeShowNearStore = true)
    : (isHomeShowNearStore = false)
  uiconfig.isShowScorePayCode === true ? (isShowScorePayCode = true) : (isShowScorePayCode = false)
  let afterShareToDraw = false
  if (uiconfig.afterShareToDraw) {
    afterShareToDraw = uiconfig.afterShareToDraw
  }
  state.afterShareToDraw = afterShareToDraw
  if (!app.globalData.systemConfigure.showScorePayCode) {
    isShowScorePayCode = false
  }
  // 如果开启顶部会员区  根据 topMemberEntrance 查询接口显示会员相关信息
  state.isHomeShowTopSearch = isHomeShowTopSearch
  state.isHomeShowTopMember = isHomeShowTopMember
  state.isHomeShowNearStore = isHomeShowNearStore
  state.isShowScorePayCode = isShowScorePayCode
  state.uiconfig = uiconfig
  if (
    uiconfig.isHomeShowTopMember &&
    uiconfig.topMemberEntrance != null &&
    uiconfig.topMemberEntrance.length > 0
  ) {
    let isShowScore = false
    let isShowCoupon = false
    let isShowBalance = false
    let isShowGiftCard = false
    uiconfig.topMemberEntrance.forEach((item) => {
      if (item === 'SCORE') {
        isShowScore = true
      } else if (item === 'COUPON') {
        isShowCoupon = true
      } else if (item === 'BALANCE') {
        isShowBalance = true
      } else if (item === 'GIFT_CARD') {
        isShowGiftCard = true
      }
    })
    state.memberEntrance = {
      isShowScore,
      isShowCoupon,
      isShowBalance,
      isShowGiftCard,
    }
  }
}
function toBenefitPlan(e) {
  if (state.signFlag) {
    if (state.isMember) {
      uni.navigateTo({
        url: '/pages-sub/newretail/pages/mallModule/benefitPlan/welfareMember/welfareMember',
      })
    } else {
      NAVPAGE.toAuthorize()
    }
  }
  // 如果未读券弹窗显示出来，则隐藏弹窗
  if (state.show.benefitPlanDrawPopup) {
    handleBenefitPlanDrawPopupClose()
  }
}
function toMyCoupon(e) {
  if (state.isMember) {
    NAVPAGE.toMyCoupon()
  } else {
    NAVPAGE.toAuthorize()
  }
  // 如果未读券弹窗显示出来，则隐藏弹窗
  if (state.show.unVisitedCoupon) {
    handleUnvisitedCouponPopupClose()
  }
}
function toMyGiftCard() {
  if (state.isMember) {
    NAVPAGE.toBuyHistory()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toScore() {
  if (state.isMember) {
    NAVPAGE.toScoreDetails()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toBalance() {
  if (state.isMember) {
    NAVPAGE.toBalance()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toAuthorize() {
  NAVPAGE.toAuthorize()
}
function getUnVisitedCoupons() {
  console.log('获取未读优惠券')
  if (!app.globalData.systemConfigure.showUnreadCoupons) {
    console.log('未开启未读券')
    getPromotionAdsense(state.storeId)
    return
  }
  // 防止重复调用
  if (!state.isNeedGetUnvisitedCoupon) {
    console.log('已经在获取中，避免重复获取')
    return
  }
  state.isNeedGetUnvisitedCoupon = false
  const postData = {
    page: 1,
    pageSize: 0,
    memberIdEquals: app.globalData.userInfo.member.id,
    memberMobileEquals: app.globalData.userInfo.member.mobile,
    orderDirection: 'desc',
    orderField: 'assign_time',
    statusEquals: 'OPEN',
  }
  const that = this
  couponService
    .queryCoupon(postData)
    .then((res) => {
      if (!res || res.records.length == 0) {
        // 查询是否有促销广告(促销广告之后会查询抽奖和登陆送券)
        getPromotionAdsense(state.storeId)
        return
      }
      if (state.show.unVisitedCoupon || state.show.coupon) {
        // 如果未读券弹窗已经弹出或者有登录送券弹窗不弹出
        return
      }
      // 筛选出未读的券
      const unVisitedCoupons = res.records.filter((value) => value.visited === false)
      if (unVisitedCoupons.length == 0) {
        // 查询是否有促销广告(促销广告之后会查询抽奖和登陆送券)
        getPromotionAdsense(state.storeId)
        return
      }
      // 券列表显示顺序现金券>折扣券>运费券>满减券
      let couponList = []
      let cashCoupons = []
      const discountCoupons = []
      const freeshipCoupons = []
      const giftCoupons = []
      const otherCoupons = []
      unVisitedCoupons.forEach((item) => {
        if (item.bytimeStart) {
          const startTime = item.bytimeStart.split(' ')[0]
          const endTime = item.bytimeEnd.split(' ')[0]
          const effectiveTime = startTime + ' 至 ' + endTime
          item.effectiveTime = effectiveTime
        } else {
          item.effectiveTime = ''
        }
        if (item.function === 'FREESHIP') {
          item.function_text = '运费券'
          freeshipCoupons.push(item)
        } else if (item.function === 'DISCOUNT') {
          item.function_text = '折扣券'
          discountCoupons.push(item)
        } else if (item.function === 'CASH') {
          item.function_text = '满减券'
          cashCoupons.push(item)
        } else if (item.function === 'GIFT') {
          item.function_text = '礼品券'
          giftCoupons.push(item)
        } else {
          item.function_text = '优惠券'
          otherCoupons.push(item)
        }
      })
      cashCoupons.sort(util.compare('faceValue')) // 排序，从小到大
      cashCoupons = cashCoupons.reverse()
      discountCoupons.sort(util.compare('rate')) // 排序，从小到大
      freeshipCoupons.sort(util.compare('rate')) // 排序，从小到大
      couponList = couponList.concat(
        cashCoupons,
        discountCoupons,
        freeshipCoupons,
        giftCoupons,
        otherCoupons,
      )
      state.unVisitedCoupons = couponList
      toggleUnvisitedCouponPopup()
      const ids = unVisitedCoupons.map(function (item) {
        return item.id
      })
      couponService.visited(ids).then((res) => {})
    })
    .catch((err) => {})
}
function clearPayCodeTimeout() {
  // console.log("->->一码付取消定时器")
  clearTimeout(state.orderTimer)
  state.orderTimer = null
}
onUnload(function () {
  clearTimeout(state.payCodeTime)
  clearPayCodeTimeout()
  if (state.show.official) {
    // 关掉提示关注公众号弹窗
    state.show.official = false
  }
  bus.remove('userShopCartChange', eventId)
})
onHide(function () {
  if (state.show.official) {
    // 关掉提示关注公众号弹窗
    state.show.official = false
  }
  console.log('index inter background')
  indexInterBackground = true
  state.isNeedGetUnvisitedCoupon = true
  clearPayCodeTimeout()
  uni.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor: '#fff',
    animation: {
      duration: 30,
      timingFunc: 'linear',
    },
  })
})
function toHidePushCollect() {
  state.isPushCollectShowed = true
  if (state.show.official) {
    // 关掉提示关注公众号弹窗
    state.show.official = false
  }
}
function toCardPay(e) {
  if (state.hasUserInfo && state.isMember) {
    const opts = '?type=' + e.currentTarget.dataset.type
    NAVPAGE.toBalancePay(opts)
  } else {
    NAVPAGE.toBalancePay()
  }
}
function bindOfficialAccountLoad(e) {
  if (!app.globalData.isOfficialAccountQueryLoadCount) {
    console.log('关注公众号组件加载事件开始>>')
    console.log(e.detail)
    console.log('关注公众号组件加载事件结束>>')
    customData.hasOfficialAccountQuery = true
    app.globalData.isOfficialAccountQueryLoadCount = 1
    state.hasOfficialAccount = true
    toggleOfficialPopup()
  }
}
function bindOfficialAccountError(e) {
  if (!app.globalData.isOfficialAccountQueryLoadCount) {
    console.log('关注公众号组件加载事件开始>>')
    console.log(e.detail)
    console.log('关注公众号组件加载事件结束>>')
    customData.hasOfficialAccountQuery = true
    app.globalData.isOfficialAccountQueryLoadCount = 1
    handleIndexPopup()
  }
}
function toggleOfficialPopup(e) {
  if (e) {
    // 查询弹窗
    state.show.official = false
    handleIndexPopup()
  } else {
    toggle('official')
  }
}
function catchOfficial(e) {}
function handleScroll(e) {
  // console.log(app.globalData.systemInfo,'app.globalData.systemInfo');
  // console.log('滚动事件触发', e.detail.scrollTop);
  // if(this.data.isShowTopNavigation) {
  //   return
  // }
  if (e.detail.scrollTop > app.globalData.systemInfo.statusBarHeight) {
    state.isShowTopNavigationFlag = false
  } else {
    state.isShowTopNavigationFlag = true
  }
  if (state.isShowTopNavigationFlag) {
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff0000',
      animation: {
        duration: 30,
        timingFunc: 'linear',
      },
    })
  } else {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff',
      animation: {
        duration: 30,
        timingFunc: 'linear',
      },
    })
  }
  // 在这里编写滚动相关的逻辑
}
onPageScroll(function (e) {
  state.pageScrollData = e
  if (state.isHomeShowTopSearch) {
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
  }
})
function handleScrollTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  })
}
function getMemberGrade() {
  const that = this
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const member = app.globalData.userInfo.member
    if (app.globalData.memberGrade) {
      state.memberGrade = app.globalData.memberGrade
    } else {
      if (member.gradeId) {
        memberService
          .getGradeById(member.gradeId)
          .then((res) => {
            app.globalData.memberGrade = res
            state.memberGrade = res
          })
          .catch((err) => {
            util.showToast(err.message)
          })
      }
    }
  }
}
function toBenefits() {
  NAVPAGE.toBenefits()
}
</script>
<style scoped>
/**index.wxss**/

page {
  background-color: #fff;
  padding-bottom: 120rpx;
  height: 100%;
  padding-bottom: 100rpx;
}

.iphoneX-height {
  padding-bottom: 100rpx;
}

.bgcp {
  width: 100vw;
  overflow-x: hidden;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left 380rpx;
}

.no-authorization {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.no-authorization image {
  width: 257rpx;
  height: 261rpx;
  margin-top: 40%;
}

.no-authorization text {
  font-size: 28rpx;
  color: #666;
  line-height: 36rpx;
  margin-bottom: 60rpx;
}

.no-authorization .open-power {
  width: 480rpx;
  height: 90rpx;
  border-radius: 45rpx;
  background: #009f55;
  font-size: 32rpx;
  line-height: 90rpx;
  color: #fff;
}

/* 弹出框 */

.modal-box {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
}

.modal-body {
  position: relative;
}

.modal-content {
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

/* 签到弹窗 */

.sign-in {
  width: 470rpx;
  height: 476rpx;
  margin: 40% auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: transparent;
}

.sign-main-bg {
  width: 100%;
  height: 224rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.sign-bg {
  width: 470rpx;
  height: 387rpx;
  background: #fff;
  border-radius: 14rpx;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: -1;
}

.sign-in .sign-tips {
  height: 36rpx;
  width: 164rpx;
  border-radius: 18rpx;
  background: #131216;
  color: #fff;
  font-size: 18rpx;
  line-height: 36rpx;
  text-align: center;
  margin-top: 172rpx;
}

.sign-in .sign-tips text {
  color: #ffcc43;
}

.sign-in .sign-text {
  font-size: 25rpx;
  line-height: 36rpx;
  margin-top: 102rpx;
}

.sign-in .sign-text text {
  font-size: 33rpx;
  font-weight: bold;
  color: #feb248;
}

.sign-in .button-box {
  position: absolute;
  bottom: 18rpx;
  left: 50%;
  margin-left: -129rpx;
  width: 258rpx;
  height: 68rpx;
  border: 0;
  padding: 0;
}

.sign-in .button-box image {
  width: 100%;
  height: 100%;
}

button[class='button-box']::after {
  border: 0;
}

/* 版权 */

.copyright-info {
  width: 100%;
  padding: 34rpx 0 152rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 120rpx; */
}

.copyright-info image {
  width: 90rpx;
  margin-bottom: 10rpx;
}

.copyright-info text {
  font-size: 28rpx;
  line-height: 42rpx;
  color: #ccc;
}

.popup-content-box {
  font-size: 34rpx;
  line-height: 50rpx;
  color: #444;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 80rpx;
}

.popup-content-box image {
  width: 255rpx;
}

.popup-coupon-box {
  position: relative;
}

.popup-coupon-content {
  width: 600rpx;
  border-radius: 21rpx;
}

.popup-coupon-content image {
  width: 100%;
}

.popup-coupon-box .popup-close {
  margin-top: 65rpx;
  height: 66rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-coupon-box .popup-close image {
  width: 56rpx;
  height: 56rpx;
}

.popop-coupon-button {
  padding-top: 25rpx;
}

.popop-coupon-button button {
  width: 419rpx;
  height: 83rpx;
  background: #019f55;
  box-shadow: 0px 3px 14px 0px rgba(1, 159, 85, 0.5);
  border-radius: 7rpx;
  font-size: 28rpx;
  color: #fff;
  line-height: 83rpx;
  padding: 0;
  font-weight: bold;
}

.popop-coupon-button button::after {
  border: 0;
}

.popup-coupon-box .popup-close button {
  width: 56rpx;
  height: 66rpx;
  border-radius: 0;
  padding: 0;
  background: transparent;
  border: 0;
}

.popup-coupon-content button {
  width: 100%;
  height: 100%;
  border-radius: 0;
  padding: 0;
  background: transparent;
  border: 0;
}

.popup-coupon-content button::after,
.popup-coupon-box .popup-close button::after {
  border: none;
}

/* 抽奖相关弹窗 */

.popup-luckDrawResult-box {
  width: 562rpx;
  background: #fff;
  border-radius: 10rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 20;
}

.popup-luckDrawResult-box .popup-close {
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  right: 19rpx;
  top: 19rpx;
}

.popup-luckDrawResult-box .popup-close image {
  width: 22rpx;
  height: 22rpx;
}

.popup-luckDrawResult-box .popup-title {
  color: #1c1c1c;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 60rpx;
  margin-top: 44rpx;
}

.popup-luckDrawResult-box .popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 59rpx 0;
}

.popup-luckDrawResult-box .popup-content text {
  display: block;
}

.popup-luckDrawResult-box .popup-text {
  color: #009f55;
  font-size: 44rpx;
  line-height: 56rpx;
  font-weight: 500;
  text-align: center;
  width: 374rpx;
}

.popup-luckDrawResult-box .popup-text-end {
  color: #009f55;
  font-size: 44rpx;
  line-height: 56rpx;
  font-weight: bold;
  text-align: center;
  width: 374rpx;
}

.popup-luckDrawResult-box .popup-tips {
  color: #1c1c1c;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 54rpx;
}

.popup-luckDrawResult-box .popup-button {
  padding-bottom: 52rpx;
  text-align: center;
}

.popup-luckDrawResult-box .popup-button text {
  font-size: 30rpx;
  line-height: 50rpx;
  color: #999;
  margin-bottom: 10rpx;
  display: block;
}

.popup-luckDrawResult-box .share-btn {
  font-size: 30rpx;
  color: #fff;
  font-weight: 400;
  text-align: center;
  width: 369rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: #019f55;
  border-radius: 10rpx;
  padding: 0;
}

.popup-luckdraw-box {
  padding-bottom: 20rpx;
  position: relative;
}

.popup-luckdraw-close {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  right: 66rpx;
  top: 80rpx;
}

.popup-luckdraw-close image {
  width: 40rpx;
  height: 40rpx;
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

/* 促销广告弹窗 */

.popup-adsense-box {
  position: relative;
}

.popup-adsense-content {
  width: 600rpx;
  /* max-height: 720rpx; */
  border-radius: 21rpx;
}

.popup-adsense-content image {
  width: 100%;
}

.popup-adsense-box .popup-close {
  margin-top: 30rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-adsense-box .popup-close image {
  width: 56rpx;
  height: 56rpx;
}

.popup-adsense-box .popup-close button {
  width: 56rpx;
  height: 56rpx;
  border-radius: 0;
  padding: 0;
  background: transparent;
  border: 0;
  font-size: 0;
}

.popup-adsense-content button,
.popup-unvisited-coupon-content button {
  width: 100%;
  height: 100%;
  border-radius: 0;
  padding: 0;
  background: transparent;
  border: 0;
}
.popup-unvisited-coupon-content .coupon_bg {
  position: relative;
}
.popup-unvisited-coupon-content .point {
  position: absolute;
  left: 140rpx;
  top: 280rpx;
  width: 230rpx;
  font-size: 80rpx;
  font-weight: 700;
  text-align: right;
  color: rgb(245, 31, 31);
}
.popup-adsense-content button::after,
.popup-adsense-box .popup-close button::after,
.popup-unvisited-coupon-box button::after {
  border: none;
}

button.authorization {
  width: 100%;
  height: 100%;
  background: transparent;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
}

button.authorization::after {
  border: none;
}

.popup-unvisited-coupon-content button {
  width: 100%;
  height: 857rpx;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 21rpx;
}

.unvisited-coupon-board {
  position: absolute;
  left: 40rpx;
  top: 40rpx;
  margin: 0 auto;
  width: calc(100% - 80rpx);
  min-height: 158rpx;
  max-height: 450rpx;
  /* background-color: blue; */
}

/* 券 */

.unvisited-coupon-item-board {
  width: 100%;
  height: 138rpx;
  border-radius: 10rpx;
  display: flex;
  margin-bottom: 15rpx;
  position: relative;
  color: #c63529;
}

.unvisited-coupon-item-board .unvisited-coupon-item-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

/* 券价格 */

.coupon-price-board {
  width: 100rpx;
  height: 100%;
  padding-left: 40rpx;
  overflow: hidden;
  border-radius: 10rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 50rpx;
}

.coupon-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.coupon-price :first-child {
  font-size: 20rpx;
}

.coupon-price :last-child {
  font-size: 60rpx;
  font-weight: bold;
}

.coupon-price.no-cash :first-child {
  position: absolute;
  /* background: #ffcf03; */
  left: 38rpx;
  top: 20rpx;
  width: 20rpx;
  height: 30rpx;
}

.coupon-price.no-cash :nth-child(2) {
  font-size: 60rpx;
  font-weight: bold;
}

.coupon-price.no-cash .discount {
  font-size: 20rpx;
  margin-left: 12rpx;
}

.coupon-content-board {
  width: calc(100% - 270rpx);
  height: calc(100% - 30rpx);
  position: relative;
  padding: 15rpx 15rpx;
}

.coupon-content-name {
  font-size: 28rpx;
  font-weight: bold;
  height: 35rpx;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 8rpx;
}

.coupon-content-rules {
  font-size: 20rpx;
  height: 30rpx;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 8rpx;
}

.coupon-content-time {
  font-size: 18rpx;
  height: 30rpx;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.official-account {
  width: 670rpx;
  margin: 20rpx auto;
}

.popup-official-account {
  margin-top: 220rpx;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}

.popup-official-account-content-top {
  width: 100%;
  height: 440rpx;
  background-color: rgba(0, 0, 0, 0.7);
}

.popup-official-account-content-top.collect {
  height: 526rpx;
}

.popup-official-account-content-middle {
  width: 100%;
  height: 150rpx;
  background-color: rgba(0, 0, 0, 0.7);
}

.popup-official-account-content-middle.collect {
  height: 236rpx;
}

.popup-official-account-content {
  margin-top: 220rpx;
  background-color: rgba(0, 0, 0, 0.7);
  height: 100%;
  display: flex;
}

.popup-official-account-content.collect {
  margin-top: 286rpx;
}

.popup-official-account-content image {
  width: 484rpx;
  height: 199rpx;
  margin: 10rpx auto;
}

.popup-unvisited-coupon-content {
  width: 600rpx;
  min-height: 226rpx;
  max-height: 728rpx;
  border-radius: 21rpx;
  background: #d81e1a;
  overflow: hidden;
}
.popup-unvisited-coupon-content1 {
  position: relative;
  background-color: transparent;
}
.popup-unvisited-coupon-content1 .unvisited-coupon-board {
  position: absolute;
  top: 120rpx;
  left: 40rpx;
  max-height: 400rpx;
}
.popup-unvisited-coupon-content1 .popup-unvisited-coupo-bottom {
  position: absolute;
  bottom: 70rpx;
  left: 50%;
  width: 380rpx;
  margin-left: -190rpx;
  height: 80rpx;
}
.popup-unvisited-coupon-content image {
  width: 100%;
  height: 216rpx;
}

.popup-unvisited-coupo-bottom {
  padding: 40rpx 0 20rpx 0;
}
.popup-unvisited-coupo-bottom1 {
  position: absolute;
  bottom: 0;
  left: 140rpx;
  z-index: 1;
  width: 320rpx;
  height: 90rpx;
}

.popup-unvisited-coupo-bottom view {
  font-size: 42rpx;
  line-height: 90rpx;
  height: 90rpx;
  width: 280rpx;
  font-weight: bold;
  border-radius: 45rpx;
  margin: 0 auto;
  text-align: center;
  color: #d81e1a;
  background: #ffcf03;
}
.popup-luckdraw-window-box {
  padding-bottom: 20rpx;
  position: relative;
}

.popup-luckdraw-window-close {
  margin-top: 65rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-luckdraw-window-close image {
  width: 56rpx;
  height: 56rpx;
}

.popup-window-image {
  width: 570rpx;
  max-height: 700rpx;
}

.popup-window-image button {
  background: transparent;
  border: 0;
}

.popup-window-image button::after {
  border: 0;
}

.popup-window-image image {
  width: 100%;
  height: 100%;
}

.scroll-top {
  width: 92rpx;
  height: 92rpx;
  position: fixed;
  right: 20rpx;
  bottom: 20%;
  z-index: 6;
}

movable-area {
  height: 100%;
  width: 100%;
  position: relative;
  overflow-x: hidden;
}

.movable-view {
  width: 180rpx;
  height: 180rpx;
  padding: 0;
  background: transparent;
  border-radius: 0;
  position: fixed;
  right: 10rpx;
  bottom: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.movable-view image {
  width: 100%;
  height: 100%;
}

movable-view {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  z-index: 10000;
}

.flow-car {
  position: fixed;
  right: 20rpx;
  bottom: 120rpx;
  width: 82rpx;
  height: 82rpx;
  z-index: 7;
  border-radius: 42rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fc6700;
}

.red-hint {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background-color: #fff;
  color: red;
  font-size: 28rpx;
  height: 34rpx;
  width: 34rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
}

.flow-car image {
  width: 54rpx;
  height: 48rpx;
  margin-left: 6rpx;
}
</style>
