<template>
  <!-- pages/my/my.wxml -->
  <view>
    <navigation-bar
      v-if="state.conventionConfig && state.conventionConfig.pageTitle"
      :style="
        state.conventionConfig.isLunbotuTopScreen === 'TRUE'
          ? 'position: absolute;left: 0;top:0;'
          : ''
      "
      :background="
        state.conventionConfig.backGroundType == 'backgroundColor'
          ? state.conventionConfig.backGroundColor
          : state.conventionConfig.isLunbotuTopScreen == 'TRUE'
            ? state.isShowTopNavigation
              ? state.conventionConfig.backGroundColor
              : ''
            : '#fff'
      "
      :isShowTopNavigation="state.conventionConfig.isLunbotuTopScreen !== 'TRUE'"
      :isShowTopNavigationFlag="state.conventionConfig.isLunbotuTopScreen === 'TRUE'"
      :title="state.conventionConfig ? state.conventionConfig.pageTitle : state.navigationBarTitle"
    ></navigation-bar>

    <view
      class="page-content"
      v-if="!state.loading"
      :style="
        (state.conventionConfig.isLunbotuTopScreen !== 'TRUE' ? 'position: relative;' : '') +
        'padding-top: ' +
        ((state.conventionConfig.isLunbotuTopScreen !== 'TRUE' ? 0 : state.navHeight) +
          (state.conventionConfig.marginTop || 0)) +
        'px'
      "
    >
      <view
        v-if="state.conventionConfig.backGroundType == 'backgroundColor'"
        class="page_bg_color"
        :style="
          'background-color: ' +
          (state.conventionConfig.backGroundColor || '#fff') +
          ';height: ' +
          (state.conventionConfig.backGroundHeightType == 'setHeight'
            ? state.conventionConfig.backGroundHeight + 'px'
            : '100%;position:fixed;')
        "
      ></view>
      <image
        v-else-if="
          state.conventionConfig.backGroundType == 'backgroundImage' &&
          state.conventionConfig.backGroundImgObj
        "
        :style="'height: ' + state.conventionConfig.backGroundHeight + 'px'"
        class="page_bg_image"
        mode="widthFix"
        :src="
          state.conventionConfig.backGroundImgObj
            ? state.conventionConfig.backGroundImgObj.imageUrl
            : ''
        "
      ></image>
      <!-- 原有会员逻辑代码注释 -->
      <view
        v-for="(item, index) in state.memberConfigList"
        :key="index"
        v-show="
          !item.beginTimeStamp ||
          !item.endTimeStamp ||
          (item.beginTimeStamp < state.timeNumber && state.timeNumber < item.endTimeStamp)
        "
      >
        <!-- 会员信息 -->
        <member-info
          v-if="item.type == 'memberInfo'"
          :configData="item"
          :themeColor="state.themeColor"
          :hasUserInfo="state.hasUserInfo"
          :memberNew="state.member"
          :isMemberLogin="state.isMember + '}'"
          @getUserInfo="getUserInfo"
          :memberGrade="state.memberGrade + '}'"
          :systemOptions="state.systemOptions"
          :reserveBalance="state.reserveBalance"
          :memberScoreBalance="state.memberScoreBalance"
          :giftcardNum="state.giftcardNum"
        ></member-info>
        <!-- 静态图轮播图 -->
        <banner
          id="banner"
          :show="true"
          v-if="item.type == 'lunbotu' || item.type == 'jingtaitu'"
          :refreshType="refreshType"
          :showInfo="item.type"
          :timeNumber="state.timeNumber"
          :imageUrl="item.imageUrl"
          :banners="item.imageItems"
          :pageMargin="item.pageMargin || 0"
          :rotationSpeed="item.rotationSpeed"
          :moduleSpacing="item.moduleSpacing"
          :configData="item"
        ></banner>
        <!-- 付费会员 -->
        <vip-member
          :vipType="state.systemOptions.isEnableVipMember ? 'vip' : 'score'"
          v-if="item.type == 'paidMember'"
          :isVIP="state.isVIP"
          :score="state.score"
          :vipEndTime="vipEndTime"
          :configData="item"
          :nextGradeNo="state.nextGradeNo"
        ></vip-member>
        <!-- 会员成长 -->
        <member-growth
          v-else-if="item.type == 'memberGrowth'"
          :showUpgrade="state.showUpgrade"
          :memberGrowth="state.memberGrowth"
          :configData="item"
        ></member-growth>
        <!-- 订单类型菜单 -->
        <order-type-list
          v-else-if="item.type == 'orderEntrance'"
          :numObj="state.numObj"
          @getUserInfo="getUserInfo"
          :isMemberLogin="state.isMember"
          :configData="item"
        ></order-type-list>
        <!-- 我的服务 -->
        <my-service
          v-else-if="item.type == 'tubiaodaohang'"
          @clickSubscribe="clickSubscribe"
          :isOpenCustomerService="state.isOpenCustomerService"
          @getUserInfo="getUserInfo"
          :configData="item"
        ></my-service>
      </view>
      <!-- 导购员中心 -->
      <view class="order-type-box" v-if="state.uiconfig.memberCenterDTO.guideCenterEnable">
        <view v-if="state.isShoppingGuide">
          <view class="all-order">
            <view>
              <text>带货中心</text>
            </view>
            <view @click="toShoppingGuide">
              <text>查看带货商品</text>
              <image :src="state.imagesPath.iconRight2"></image>
            </view>
          </view>
          <view class="shopping-guide-box">
            <view class="shopping-guide-item">
              <view class="item">
                <text>可用奖励点</text>
                <text>{{ state.backCashData ? state.backCashData.canBackCash : '*' }}</text>
              </view>
              <view class="item">
                <text>待结算奖励点</text>
                <text>{{ state.backCashData ? state.backCashData.stayBackCash : '*' }}</text>
              </view>
              <view class="item">
                <text>累计奖励点</text>
                <text>{{ state.backCashData ? state.backCashData.backCashTotal : '*' }}</text>
              </view>
            </view>
            <view class="exchange-btn" @click="toCashout">
              <button>立即兑换</button>
            </view>
            <view class="exchange-tips">1奖励点可兑换1元</view>
          </view>
        </view>
        <view v-else>
          <view class="all-order">
            <view>
              <text>带货达人申请</text>
            </view>
            <view @click="toApplyShoppingGuide">
              <text>申请成为带货达人</text>
              <image :src="state.imagesPath.iconRight2"></image>
            </view>
          </view>
        </view>
        <button v-if="!state.hasUserInfo" class="authorization" @click="getUserInfo"></button>
      </view>
    </view>
    <custom-loading v-if="state.loading"></custom-loading>
    <view :class="isIphoneX ? 'iphoneX-height' : ''"></view>
    <popup
      :show="state.show.middle"
      position="middle"
      custom-class="middle"
      :overlayStyle="state.overlayStyle"
      @close="toggleBottomPopup"
    >
      <view class="popup-content">
        <view class="popup-content-box">
          <!-- <image src="{{imagesPath.speechAssistantStart}}" ></image> -->
          <image :src="state.imagesPath.speechAssistantStart" mode="widthFix"></image>
          <view>你来说，我来做</view>
          <view>把你最喜欢的带给你</view>
        </view>
      </view>
    </popup>
    <!-- 开屏推广弹窗 -->
    <welfarePromotion usePage="PERSONAL_CENTER"></welfarePromotion>
    <tabbar
      :tabbar="state.tabbar"
      :show="state.showTabbar"
      @popup="recorderPopup"
      v-if="!state.openCustomTabbar"
    ></tabbar>
    <authorize @login="handleUserLogin" @tabBar="handleTabbar"></authorize>
    <!-- <custom-tab-bar
      :tabbar="state.tabbar"
      :show="state.showTabbar"
      v-if="state.openCustomTabbar"
    ></custom-tab-bar>-->
    <subscribe-popup :show="state.showPopup" @close="clickClose"></subscribe-popup>
  </view>
</template>
<script setup>
import _apiRequestJs from '@/service/api/newretail/request'
import _apiBackCashServiceJs from '@/service/api/newretail/backCashService'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiHomepageServiceJs from '@/service/api/newretail/homepageService'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _apiBannerServiceJs from '@/service/api/newretail/bannerService'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _componentsCustomLoadingCustomLoadingJs from '@/pages-sub/newretail/components/customLoading/customLoading'
import _componentsTabbarTabbarJs from '@/pages-sub/newretail/components/tabbar/tabbar'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsAuthJs from '@/utils/newretail/auth'
import _apiDistributionServiceJs from '@/service/api/newretail/distributionService'
import _apiHelpActivityServiceJs from '@/service/api/newretail/helpActivityService'
import _apiGiftCardServiceJs from '@/service/api/newretail/giftCardService'
import _apiRedPacketServiceJs from '@/service/api/newretail/redPacketService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bus from 'iny-bus'
import memberInfo from '@/pages-sub/newretail/components/member-page/member-info/member-info.vue'
import vipMember from '@/pages-sub/newretail/components/member-page/vip-member/vip-member.vue'
import memberGrowth from '@/pages-sub/newretail/components/member-page/member-growth/member-growth.vue'
import orderTypeList from '@/pages-sub/newretail/components/member-page/order-type-list/order-type-list.vue'
import myService from '@/pages-sub/newretail/components/member-page/my-service/my-service.vue'
import subscribePopup from '@/pages-sub/newretail/components/subscribe-popup/subscribe-popup.vue'
import banner from '@/pages-sub/newretail/components/home-page/banner2/banner2.vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue'
import welfarePromotion from '@/pages-sub/newretail/components/welfarePromotion/welfarePromotion.vue'
import tabbar from '@/pages-sub/newretail/components/tabbar/tabbar.vue'
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue'
const app = getApp()
let inOnLoadPage = false
// pages/my/my.js
const NavigationBar = _componentsNavigationBarNavigationBarJs
const CustomLoading = _componentsCustomLoadingCustomLoadingJs
const Tabbar = _componentsTabbarTabbarJs
const wxaUserService = _apiWxaUserServiceJs
const orderService = _apiOrderServiceJs
const couponService = _apiCouponServiceJs
const memberService = _apiMemberServiceJs
const redPacketService = _apiRedPacketServiceJs
const giftCardService = _apiGiftCardServiceJs
const helpActivityService = _apiHelpActivityServiceJs
const distributionService = _apiDistributionServiceJs
const auth = _utilsAuthJs
const selfJs = _utilsSelfJs
const utils = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const bannerService = _apiBannerServiceJs
const themeManager = _utilsThemeManagerJs
const homepageService = _apiHomepageServiceJs
const systemService = _apiSystemServiceJs
const backCashService = _apiBackCashServiceJs
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
  countdownFn: null,
  timeNumber: 0,
  painting: {},
  shareImage: '',
  navigationBarTitle: '会员中心',
  imagesPath: IMGAGESPATH,
  tabbar: {},
  userInfo: {},
  hasUserInfo: false,
  canIUse: uni.canIUse('button.open-type.getUserInfo'),
  member: {
    couponNum: 0,
  },
  isMember: false,
  unPayNum: '',
  unGroupNum: '',
  unSelftakeNum: '',
  sendingNum: '',
  unEvaluateNum: '',
  waitPayBalance: '',
  tabSelected: 0,
  serviceTel: '',
  reserveBalance: 0,
  memberScoreBalance: '0',
  redPacketBalance: '0.00',
  APP_VERSION: '1.0.0.3',
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
  },
  overlayStyle: 'background: rgba(255, 255, 255, 0.9)',
  showTabbar: true,
  systemOptions: {
    hasRedPacket: true,
    isGiftCard: true,
    hasDistributionCenter: false,
    isEnableVipMember: false,
    vipGradeConfig: null,
  },
  giftcardNum: 0,
  // 礼品卡数量
  showPhone: false,
  uiconfig: null,
  isDistributor: false,
  // 是否分销员
  banners: [],
  loading: true,
  theme: themeManager,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  isVIP: false,
  pageService: [],
  memberGrowth: {},
  // 会员成长值区域信息
  grading: true,
  // 保级值是否存在
  upgrade: true,
  // 升级值是否存在
  changeStyle: false,
  // 是否改变样式
  showGrowth: false,
  showUpgrade: true,
  memberGrade: null,
  orderStatusEntrance: [],
  isOpenCustomerService: false,
  topMember: [],
  memberCenterOrders: [],
  memberGrowthEnable: false,
  score: '',
  showScoreUpdate: '',
  nextGradeNo: '',
  showScoreUpdateSys: false,
  isShoppingGuide: false,
  backCashData: null,
  openCustomTabbar: false,
  showPopup: false,
  memberConfigList: [],
  conventionConfig: {},
  navHeight: null,
  isShowTopNavigation: false,
  // 是否显示背景色
  numObj: {},
})
async function getPageConfig(id) {
  let ajaxPath = 'queryHomeMemberInfoUiInfo'
  let params = {
    uiType: 'MEMBER_CENTER',
    // storeId: app.globalData.storeInfo ? app.globalData.storeInfo.id : ''
  }
  if (id) {
    ajaxPath = 'queryHomeMemberDetailUiInfo'
    params = {
      id,
      storeId: app.globalData.storeInfo ? app.globalData.storeInfo.id : '',
    }
  }
  const queryHomeMemberInfo = await systemService[ajaxPath](params)
  const memberConfigList = []
  if (queryHomeMemberInfo && queryHomeMemberInfo.dataList) {
    queryHomeMemberInfo.dataList.forEach((item, index) => {
      item = item.content
        ? {
            ...item,
            ...JSON.parse(item.content),
          }
        : item
      delete item.content
      if (item.dateTime) {
        item.beginTimeStamp = item.dateTime[0]
          ? new Date(item.dateTime[0].replace(/-/g, '/')).getTime()
          : item.beginTimeStamp
        item.endTimeStamp = item.dateTime[1]
          ? new Date(item.dateTime[1].replace(/-/g, '/')).getTime()
          : item.endTimeStamp
      }
      item.beginTimeStamp = item.beginTime
        ? new Date(item.beginTime.replace(/-/g, '/')).getTime()
        : item.beginTimeStamp
      item.endTimeStamp = item.endTime
        ? new Date(item.endTime.replace(/-/g, '/')).getTime()
        : item.endTimeStamp
      if (item.type == 'conventionConfig') {
        state.conventionConfig = {
          ...item,
        }
      } else {
        if (item.type == 'jingtaitu' || item.type == 'lunbotu' || item.type == 'fenqu') {
          // 防止数据互串
          item.imageItems.map((items, idx) => {
            items.beginTimeStamp = items.beginTime
              ? new Date(items.beginTime.replace(/-/g, '/')).getTime()
              : null
            items.endTimeStamp = items.endTime
              ? new Date(items.endTime.replace(/-/g, '/')).getTime()
              : null
          })
        }
        console.log(item, 'sfdsjkfsajasfj')
        memberConfigList.push({
          ...item,
        })
      }
    })
    state.memberConfigList = memberConfigList
  }
}
function goToSign() {
  console.log(111112222)
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/member/sign/index',
    success: function (res) {},
    fail: function (res) {},
    complete: function (res) {},
  })
}
function handleLoginStatus(error) {
  if (error.code !== 20) {
    uni.showToast({
      title: error.message,
      icon: 'none',
      duration: 2000,
    })
  }
}
function orderMeituan() {
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/order/meituan/orderMeituan',
  })
}
function eventDraw() {
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/member/share/share',
  })
}
let eventId = null
onLoad(function (_options) {
  state.navHeight = app.globalData.navHeight
  console.log('app.globalData.uiconfig', app.globalData.uiconfig)
  getPageConfig(_options ? _options.scene : null)
  eventId = bus.on('userCouponChange', () => {
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      queryCoupon()
    }
  })
  // this.getUIconfig() 原有会员逻辑代码注释
  getHomepageService()
  if (app.globalData.isMingKangHui && app.globalData.memberSystem === 'zhijian') {
    state.showGrowth = true
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        if (app.globalData.userInfo.member.id) {
          getExternalMember(app.globalData.userInfo.member.id)
        } else {
          console.log('没有会员id')
        }
      }
    }
  }
  console.log('app.globalData.isShoppingGuide', app.globalData.isShoppingGuide)
  if (app.globalData.isShoppingGuide) {
    state.isShoppingGuide = true
  }
  if (app.globalData.uiconfig) {
    state.isOpenCustomerService = app.globalData.uiconfig.isOpenCustomerService
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
  }
  if (app.globalData.storeInfo) {
    if (app.globalData.storeInfo.id) {
      state.storeId = app.globalData.storeInfo.id
      console.log(app.globalData.storeInfo.id, '获取门店id')
      getBannersList(state.storeId)
    }
  }
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      getUpgradeScore()
    }
  }
  if (app.globalData.openCustomTabbar) {
    app.getTabbar()
    app.editTabbar()
    state.openCustomTabbar = true
    state.showTabbar = true
  } else {
    if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
      app.globalData.tabBar.list.forEach((item) => {
        if (item.linkModel === 'my') {
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
  const that = this
  let orderStatusEntrance = []
  if (
    !app.globalData.uiconfig ||
    !app.globalData.uiconfig.orderStatusEntrance ||
    app.globalData.uiconfig.orderStatusEntrance.length == 0
  ) {
    const defultStatus = [
      {
        orderEntranceStatus: 'CREATED',
        orderStatusEntranceIconUrl: state.imagesPath.iconMywaitPay,
      },
      {
        orderEntranceStatus: 'SHIPPED',
        orderStatusEntranceIconUrl: state.imagesPath.iconMywaiGet,
      },
      {
        orderEntranceStatus: 'PENDING',
        orderStatusEntranceIconUrl: state.imagesPath.iconMywaitSend,
      },
      {
        orderEntranceStatus: 'RECEIVED',
        orderStatusEntranceIconUrl: state.imagesPath.iconMywaitEvaluate,
      },
      {
        orderEntranceStatus: 'WAITPAYBALANCE',
        orderStatusEntranceIconUrl: state.imagesPath.iconMywaitPayTail,
      },
    ]
    if (app.globalData.uiconfig) {
      app.globalData.uiconfig.orderStatusEntrance = defultStatus
    } else {
      orderStatusEntrance = defultStatus
    }
  }
  if (
    app.globalData.uiconfig &&
    app.globalData.uiconfig.orderStatusEntrance &&
    app.globalData.uiconfig.orderStatusEntrance.length > 0
  ) {
    orderStatusEntrance = app.globalData.uiconfig.orderStatusEntrance
  }
  // 匹配状态对应的文字
  orderStatusEntrance.forEach((item) => {
    item.name = app.globalData.orderStatus[item.orderEntranceStatus].name
  })
  if (
    app.globalData.uiconfig &&
    app.globalData.uiconfig.memberCenterDTO &&
    typeof app.globalData.uiconfig.memberCenterDTO === 'string'
  ) {
    app.globalData.uiconfig.memberCenterDTO = JSON.parse(app.globalData.uiconfig.memberCenterDTO)
  }
  console.log('app.globalData.uiconfig', app.globalData.uiconfig)
  state.serviceTel = app.globalData.servicePhone
  state.uiconfig = app.globalData.uiconfig
  if (
    app.globalData.uiconfig &&
    app.globalData.uiconfig.orderStatusEntrance &&
    app.globalData.uiconfig.orderStatusEntrance.length > 0
  ) {
    // let newList = [];
    // app.globalData.uiconfig.orderStatusEntrance.forEach(async (item, index) => {
    //     await selfJs.getTemporaryUrl(item.orderStatusEntranceIconUrl).then(res => {
    //         newList.push({
    //             ...item,
    //             index: index,
    //             orderStatusEntranceIconUrl1: res
    //         })
    //         if(newList.length >= app.globalData.uiconfig.orderStatusEntrance.length) {
    //             newList.sort((a,b) => {
    //                 return a.index - b.index
    //             })
    //             this.setData({
    //                 orderStatusEntrance: newList
    //             })
    //         }
    //     })
    // })
    state.orderStatusEntrance = app.globalData.uiconfig.orderStatusEntrance
  } else {
    state.orderStatusEntrance = orderStatusEntrance
  }
  // 检查用户授权信息
  checkAuth()
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }

  // 查询系统配置项，根据系统配置项控制列表菜单显示
  const systemOptions = app.globalData.configureInfo
  const configures = {
    hasRedPacket: true,
    isGiftCard: true,
    hasDistributionCenter: app.globalData.systemConfigure.hasDistributionCenter,
    isEnableVipMember: app.globalData.systemConfigure.isEnableVipMember,
    vipGradeConfig: app.globalData.systemConfigure.vipGradeConfig,
  }
  let showScoreUpdateSys = true
  systemOptions.forEach((item) => {
    if (item.key === 'hasRedPacket' && item.value != null) {
      item.value === 'TRUE' ? (configures.hasRedPacket = true) : (configures.hasRedPacket = false)
    } else if (item.key === 'isGiftCard' && item.value != null) {
      item.value === 'TRUE' ? (configures.isGiftCard = true) : (configures.isGiftCard = false)
    } else if (item.key === 'openScorePrizeGrade' && item.value != null) {
      item.value === 'TRUE' ? (showScoreUpdateSys = true) : (showScoreUpdateSys = false)
      console.log(item, 'itemitemitemitem')
    }
  })
  console.log(systemOptions, '-----------------------------')
  // 获取当前页面分享图
  state.systemOptions = configures
  state.showScoreUpdateSys = showScoreUpdateSys
  getSharePictures()
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
  inOnLoadPage = true
})
function getUpgradeScore() {
  memberService.queryGrade().then((res) => {
    if (res) {
      res = utils.compareMemberGrade(res)
    }
    const gradeNo = app.globalData.userInfo.member.gradeNo
    let score = 0
    let nextGradeNo = 0
    const memberGrade = []
    let showScoreUpdate = true
    if (gradeNo < 0) {
      state.showScoreUpdate = false
    } else {
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
      state.score = score
      state.showScoreUpdate = showScoreUpdate
      state.nextGradeNo = nextGradeNo
    }
  })
}
function getUIconfig() {
  // 根据UI配置控制页面显示
  if (app.globalData.uiconfig) {
    renderingPageByUI()
  } else {
    systemService
      .queryGroup('UI')
      .then((res) => {
        app.globalData.uiconfig = utils.handleUIConfig(res)
        renderingPageByUI()
      })
      .catch((err) => {
        console.log('查询UI配置出错：' + err.message)
      })
  }
}
function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e)
      return false
    }
  }
  console.log('It is not a string!')
}
function renderingPageByUI() {
  let topMember = []
  let memberCenterOrders = []
  const uiconfig = app.globalData.uiconfig
  let memberGrowthEnable = false
  if (uiconfig.memberCenterDTO) {
    const _isJSON = isJSON(uiconfig.memberCenterDTO)
    if (_isJSON) {
      uiconfig.memberCenterDTO = JSON.parse(uiconfig.memberCenterDTO)
    }
    // console.log(isJSON,'uiconfig.memberCenterDTOuiconfig.memberCenterDTO');
    // uiconfig.memberCenterDTO = JSON.parse(uiconfig.memberCenterDTO)?JSON.parse(uiconfig.memberCenterDTO):uiconfig.memberCenterDTO;
    if (!uiconfig.memberCenterDTO.memberGrowthEnable) {
      memberGrowthEnable = false
    } else {
      uiconfig.memberCenterDTO.memberGrowthEnable
        ? (memberGrowthEnable = true)
        : (memberGrowthEnable = false)
    }
    if (!uiconfig.memberCenterDTO.topMember) {
      topMember = ['ACCOUNT', 'SCORE', 'COUPON', 'GIFTCARD']
    } else {
      topMember = uiconfig.memberCenterDTO.topMember
    }
    if (!uiconfig.memberCenterDTO.memberCenterOrders) {
      memberCenterOrders = [
        'VIPGRADE_AREA',
        'MEMBER_GROWTH_AREA',
        'ORDER_AREA',
        'GUIDE_CENTER_AREA',
        'FUNCTION_MENU_AREA',
        'ADVERTUSING_AREA',
      ]
    } else {
      uiconfig.memberCenterDTO.memberCenterOrders.forEach((el) => {
        memberCenterOrders.splice(el.orderNumber, 1, el.memberArea)
      })
    }
  } else {
    memberGrowthEnable = false
    topMember = ['ACCOUNT', 'SCORE', 'COUPON', 'GIFTCARD']
    memberCenterOrders = [
      'VIPGRADE_AREA',
      'MEMBER_GROWTH_AREA',
      'ORDER_AREA',
      'GUIDE_CENTER_AREA',
      'FUNCTION_MENU_AREA',
      'ADVERTUSING_AREA',
    ]
  }
  state.topMember = topMember
  state.memberCenterOrders = memberCenterOrders
  state.memberGrowthEnable = memberGrowthEnable
}
function getExternalMember(id) {
  const memberId = id
  memberService.getExternalMember(memberId).then((res) => {
    console.log(res, '会员成长值')
    if (!res) {
      return
    }
    const growth = res.extendData || {}
    let progress = ''
    if (growth && growth.gradeValidityPeriod) {
      const gradeValidityPeriod = growth.gradeValidityPeriod.split(' ')
      growth.gradeValidityPeriod = gradeValidityPeriod[0]
    } else if (growth) {
      growth.gradeValidityPeriod = '永久'
    }
    /**
     * growthValue 当前会员安心值
     * relegationGrowthValue 当前等级保级安心值门槛
     * relegationNeedGrowth 当前等级保级所需安心值
     * updateNeedGrowth 据下一等级升级所需安心值
     * lastGradeValue 上一等级安心值
     * currentGradeValue 当前等级安心值
     * nextGradeValue 下一等级安心值
     */
    if (growth.currentGradeValue === growth.relegationGrowthValue) {
      // 当保级值等于安心值的时候，意味着没有保级值的时候
      const allGrading = growth.nextGradeValue - growth.currentGradeValue // 升级值 - 安心值
      const nowGrading = growth.growthValue - growth.currentGradeValue // 当前安心值 - 安心值
      const progressGrading = nowGrading / allGrading // 求取比例
      const progressAdd = progressGrading * 75
      progress = progressAdd + 5 // 这是最终得到的进度条距离，因为页面ui的问题，所以这里需要加7
      state.grading = false
      state.progress = progress
    } else if (!growth.nextGradeValue) {
      // 如果没有返回下一级的安心值，为顶级
      if (growth.relegationGrowthValue > growth.growthValue) {
        // 当 当前安心值小于保级值的时候
        // 需要保级
        const allGrading = growth.relegationGrowthValue - growth.currentGradeValue // 保级值 - 安心值
        const nowGrading = growth.growthValue - growth.currentGradeValue // 当前安心值 - 安心值
        const progressGrading = nowGrading / allGrading // 求取比例
        const progressAdd = progressGrading * 37
        progress = progressAdd + 5 // 这是最终得到的进度条距离，因为页面ui的问题，所以这里需要加5
        state.progress = progress
        state.upgrade = false
      } else if (growth.relegationGrowthValue <= growth.growthValue) {
        // 当 当前安心值大于保级值的时候
        progress = 60 // 这是最终得到的进度条距离，因为页面ui的问题，所以这里需要加42
        state.changeStyle = true
        state.upgrade = false
        state.showUpgrade = false
        state.progress = progress
      }
    } else {
      if (growth.relegationGrowthValue > growth.growthValue) {
        // 当 当前安心值小于保级值的时候
        const allGrading = growth.relegationGrowthValue - growth.currentGradeValue // 保级值 - 安心值
        const nowGrading = growth.growthValue - growth.currentGradeValue // 当前安心值 - 安心值
        const progressGrading = nowGrading / allGrading // 求取比例
        const progressAdd = progressGrading * 37
        progress = progressAdd + 5 // 这是最终得到的进度条距离，因为页面ui的问题，所以这里需要加5
        state.progress = progress
      } else if (growth.relegationGrowthValue <= growth.growthValue) {
        // 当 当前安心值大于保级值的时候
        const allGrading = growth.nextGradeValue - growth.relegationGrowthValue // 升级值 - 保级值
        const nowGrading = growth.growthValue - growth.relegationGrowthValue // 当前安心值 - 保级值
        const progressGrading = nowGrading / allGrading // 求取比例
        const progressAdd = progressGrading * 38
        progress = progressAdd + 42 // 这是最终得到的进度条距离，因为页面ui的问题，所以这里需要加42
        state.changeStyle = true
        state.progress = progress
      }
    }
    state.memberGrowth = growth
  })
}
function getBannersList(storeId) {
  // MEMBER_CENTER
  bannerService
    .getStoreBannerList('MEMBER_CENTER', storeId)
    .then((res) => {
      if (res) {
        state.banners = res
      }
    })
    .catch((err) => {
      console.log('获取图片失败')
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
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
  console.log(pageInfo.linkType, 'pageInfo.linkType')
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
    verifyGoods(app.globalData.storeInfo.id, pageInfo.productId, 'normal')
    // // 商品
    // let opts = '?productId=' + pageInfo.productId + '&storeId=' + app.globalData.storeInfo.id + '&type=normal'
    // NAVPAGE.toGoodsDetails(opts)
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
    //     url = pageInfo.linkUrl
    // } else if (pageType === 'banner') {
    //     url = pageInfo.link
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
function verifyGoods(storeId, productId, type) {
  productService
    .getDetails(storeId, productId)
    .then((res) => {
      if (res) {
        // 商品
        const opts =
          '?productId=' + productId + '&storeId=' + app.globalData.storeInfo.id + '&type=' + type
        NAVPAGE.toGoodsDetails(opts)
      }
    })
    .catch((err) => {
      if (err.code === 16015) {
        uni.showToast({
          title: '门店没有该商品，去看看别的吧~',
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function getUserInfo(e) {
  console.log(e)
  const that = this
  wxaUserService
    .login(true)
    .then((res) => {
      console.log(res, '会员信息')
      auth.setUser(res)
      app.globalData.userInfo = res && res.member ? res : null
      if (!res.member) {
        state.userInfo = res.wxaUser
        state.hasUserInfo = true
        state.member = {
          couponNum: 0,
        }
        NAVPAGE.toAuthorize()
      } else {
        getMemberGrade()
        getUpgradeScore()
        let isExpired = false
        let isVIP = false
        const now = new utils.ResponseDate().getTime()
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
        state.member = {
          ...state.member,
          ...res.member,
          nickName: res.member.nickName ? res.member.nickName : res.wxaUser.nickName,
        }
        state.isVIP = isVIP
        state.isMember = true
        state.userInfo = {
          ...res.wxaUser,
        }
        state.hasUserInfo = true
        uni.setStorage({
          key: 'wj_member',
          data: res.member,
        })
        checkUserInfo()
        getOrderStatusCount()
        getMemberInfo()
        getExternalMember(res.member.id)
        getIsShoppingGuide()
        if (app.globalData.storeInfo) {
          recordVisitStore(app.globalData.storeInfo.id)
        }
        if (app.globalData.systemConfigure.openDistribution) {
          auth.bindDistribution()
          if (app.globalData.distributorInfo) {
            state.isDistributor = true
          } else {
            distributionService
              .getDistributionUser()
              .then((res) => {
                if (res) {
                  if (res.status === 'AUDITED') {
                    app.globalData.distributorInfo = res
                    state.isDistributor = true
                  }
                  // 保存分销员信息
                  auth.setDistributor(res)
                }
              })
              .catch((err) => {
                console.log(err.message)
              })
          }
        }
      }
      handlePageSkip()
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
function refreshAvatarA(e) {
  const that = this
  const { avatarUrl } = e.detail
  const userInfo = {
    avatarUrl,
  }
  const request = _apiRequestJs
  console.log(avatarUrl, 'sddfff', e)
  uni.uploadFile({
    url: request.BASE_URL + '/newretail/api/dfs/upload',
    filePath: avatarUrl,
    name: 'file',
    formData: {
      user: 'test',
    },
    header: {
      'wxa-appid': request.APP_ID,
    },
    success(res) {
      if (res && res.data != null && res.statusCode >= 200 && res.statusCode <= 300) {
        // console.log(res)
        // console.log('上传成功');
        // console.log(JSON.parse(res.data));
        // console.log(JSON.parse(res.data).data.url)
        // that.setData({
        //     sharePic: JSON.parse(res.data).data.url
        // })
        // wx.showShareMenu();
        userInfo.avatarUrl = JSON.parse(res.data).data.url
        wxaUserService
          .refreshAvatar(userInfo)
          .then((res) => {
            return wxaUserService.login()
          })
          .then((res) => {
            auth.setUser(res)
            res.member.avatar = avatarUrl
            app.globalData.userInfo = res && res.member ? res : null
            if (res && res.member) {
              state.member = {
                ...state.member,
                ...res.member,
                nickName: res.member.nickName ? res.member.nickName : res.wxaUser.nickName,
              }
              state.isMember = true
              state.userInfo = {
                ...userInfo,
              }
              state.hasUserInfo = true
              uni.setStorage({
                key: 'wj_member',
                data: res.member,
              })
              checkUserInfo()
            }
            utils.showToast('同步成功！')
          })
          .catch((err) => {
            utils.showToast(err.message)
          })
      }
    },
    fail(e) {
      console.log('=============')
      console.log(e)
    },
  })
  // wxaUserService.refreshAvatar(userInfo).then(res => {
  //     return wxaUserService.login()
  // }).then(res => {
  //     auth.setUser(res)
  //     app.globalData.userInfo = res
  //     if (res && res.member) {
  //         that.setData({
  //             member: {
  //                 ...that.data.member,
  //                 ...res.member,
  //                 nickName: res.member.nickName ? res.member.nickName : res.wxaUser.nickName
  //             },
  //             isMember: true,
  //             userInfo: {
  //                 ...userInfo,
  //             },
  //             hasUserInfo: true
  //         })
  //         wx.setStorage({
  //             key: "wj_member",
  //             data: res.member
  //         })
  //         that.checkUserInfo()
  //     }
  //     utils.showToast("同步成功！")
  // }).catch(err => {
  //     utils.showToast(err.message)
  // });
  console.log(e, 'daklsdlkaj')
}
function catchRefreshAvatar(e) {}
function refreshAvatar(e) {
  const that = this
  uni.getUserProfile({
    desc: '用于完善会员资料',
    // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      const userInfo = res.userInfo
      wxaUserService
        .refreshAvatar(userInfo)
        .then((res) => {
          return wxaUserService.login()
        })
        .then((res) => {
          auth.setUser(res)
          app.globalData.userInfo = res && res.member ? res : null
          if (res && res.member) {
            state.member = {
              ...state.member,
              ...res.member,
              nickName: res.member.nickName ? res.member.nickName : res.wxaUser.nickName,
            }
            state.isMember = true
            state.userInfo = {
              ...userInfo,
            }
            state.hasUserInfo = true
            uni.setStorage({
              key: 'wj_member',
              data: res.member,
            })
            checkUserInfo()
          }
          utils.showToast('同步成功！')
        })
        .catch((err) => {
          utils.showToast(err.message)
        })
    },
    fail: (error) => {},
  })
}
function checkAuth() {
  const self = this
  if (!app.globalData.userInfo) {
    state.hasUserInfo = false
    state.isMember = false
    state.member = null
    state.userInfo = null
    state.loading = false
    uni.showToast({
      title: '您还未授权，请点击头像授权',
      icon: 'none',
      duration: 2000,
    })
  } else {
    if (app.globalData.userInfo.member) {
      getMemberGrade()
      const user = app.globalData.userInfo
      let isExpired = false
      let isVIP = false
      const now = new utils.ResponseDate().getTime()
      let vipEndTimeStamp = now + 1000
      let vipEndTime = ''
      if (user.member.vipEndTime) {
        vipEndTimeStamp = new Date(user.member.vipEndTime.replace(/-/g, '/')).getTime()
        vipEndTime = user.member.vipEndTime.split(' ')[0].replace(/-/g, '.')
      }
      if (now > vipEndTimeStamp) {
        isExpired = true
      }
      if (user.member.vipEndTime && now < vipEndTimeStamp) {
        isVIP = true
        app.globalData.userInfo.member.vip = true
      }

      // selfJs.getTemporaryUrl(user.member.avatar)
      //     .then(res1 => {
      //         user.member.avatar1 = res1

      //     })
      state.hasUserInfo = true
      state.isMember = true
      state.member = {
        ...user.member,
        nickName: user.member.nickName ? user.member.nickName : user.wxaUser.nickName,
      }
      state.isVIP = isVIP
      state.userInfo = user.wxaUser
      checkUserInfo()
      getOrderStatusCount()
      getMemberInfo()
      // self.handelRedPacketBalance()
      getExternalMember(user.member.id)
      getIsShoppingGuide()
    } else {
      state.hasUserInfo = true
      state.isMember = false
      state.member = null
      state.userInfo = app.globalData.userInfo.wxaUser
      state.loading = false
      uni.showToast({
        title: '您还不是会员，请绑定手机号成为会员',
        icon: 'none',
        duration: 2000,
      })
    }
  }
}
function checkUserInfo() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    // 判断用户是否是会员
    const res = app.globalData.userInfo
    let isExpired = false
    let isVIP = false
    const now = new utils.ResponseDate().getTime()
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
    state.isVIP = isVIP
    state.isExpired = isExpired
    state.vipEndTime = vipEndTime
  }
}
function getBackCashDetail() {
  backCashService
    .queryBackCashAccountDetails()
    .then((res) => {
      console.log(res)
      state.backCashData = res
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function getMemberInfo() {
  // 获取用户未使用的券数量
  queryCoupon()

  // 获取用户的积分
  queryScore()

  // 获取用户的礼品卡数量
  queryGiftCard()
}
function getHomepageService() {
  homepageService
    .queryMbrMenu()
    .then((res) => {
      console.log(res)
      // res.forEach(async (item, index) => {
      //     await selfJs.getTemporaryUrl(item.imageUrl)
      //         .then(res1 => {
      //             item.imageUrl = res1;
      //             if (index == res.length - 1) {
      //                 this.setData({
      //                     pageService: res
      //                 })
      //             }
      //         })
      // })
      state.pageService = res
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function toOtherPage(e) {
  console.log(e)
  const type = e.currentTarget.dataset.link
  if (type === 'shopcart') {
    toShopcart()
  } else if (type === 'giftcard') {
    toGiftCardCenter()
  } else if (type === 'myBargain') {
    toMyBargain()
  } else if (type === 'myTourism') {
    toMyTourism()
  } else if (type === 'applyDistributor') {
    toApplyDistributor()
  } else if (type === 'pickup') {
    toPickUp()
  } else if (type === 'invite') {
    toInvite()
  } else if (type === 'redpacket') {
    toRedPacket()
  } else if (type === 'address') {
    toAddress()
  } else if (type === 'comment') {
    toGoodsComment()
  } else if (type === 'couponCenter') {
    toCouponCenter()
  } else if (type === 'feedback') {
    toFeedback()
  } else if (type === 'balance') {
    toRecharge()
  } else if (type === 'mbrInfo') {
    toMemberInfo()
  } else if (type === 'system') {
    toSystem()
  } else if (type === 'creditCard') {
    toCreditCard()
  } else if (type === 'onlineTopUp') {
    toTopUp()
  } else if (type === 'scoreCoupon') {
    const link = 'score_coupon'
    toScoreMall(link)
  } else if (type === 'scoreGoods') {
    const link = 'score_goods'
    toScoreMall(link)
  } else if (type === 'thirdPartyCoupon') {
    const link = 'thirdParty_coupon'
    toScoreMall(link)
  } else if (type === 'customService') {
    // wx.navigateTo({
    //     url: '/pages-sub/newretail/pages/mallModule/order/qiyu/index',

    // })
    const storeInfo = app.globalData.storeInfo || uni.getStorageSync('storeIdactive')
    NAVPAGE.toCustomService('', storeInfo.id)
  } else if (type === 'checkCode') {
    toCheckCode()
  } else if (type === 'scoreMall') {
    const link = 'score_mall'
    toScoreMall(link)
  } else if (type === 'my_recharge_draw') {
    toMyLottery()
  } else if (type === 'exchangeCoupon') {
    toExchangeCoupon()
  } else if (type === 'score_raffle') {
    if (e.currentTarget.dataset.info.raffleActivityId) {
      const opts = '?raffleActivityId=' + e.currentTarget.dataset.info.raffleActivityId
      NAVPAGE.toRaffle(opts)
    }
  } else if (type === 'back_cash_product') {
    if (app.globalData.isShoppingGuide) {
      NAVPAGE.toGuideGoods()
    } else {
      NAVPAGE.toApplyShoppingGuide()
    }
  } else if (type === 'subscribe_messages') {
    clickSubscribe()
  } else if (type === 'mealCard') {
    let tempList = []
    const postData = {
      page: '1',
      pageSize: '100',
      memberId: app.globalData.userInfo.member.id,
    }
    couponService
      .queryMspAccountList(postData)
      .then((res) => {
        if (res.records && res.records.length > 0) {
          tempList = res.records
          tempList.sort(function (a, b) {
            return Number(b.balance) - Number(a.balance)
          })
          state.reserveBalance = tempList[0].balance.toFixed(2)
          if (state.reserveBalance) {
            uni.navigateTo({
              url: '/pages-sub/newretail/pages/mallModule/member/mealCard/mealCard',
            })
          } else {
            uni.navigateTo({
              url: '/pages-sub/newretail/pages/mallModule/member/mealCardDetails/mealCardDetails',
            })
          }
        }
      })
      .catch((e) => {
        uni.navigateTo({
          url: '/pages-sub/newretail/pages/mallModule/member/mealCardDetails/mealCardDetails',
        })
        // wx.showToast({
        //     title: e.message,
        //     icon: 'none',
        //     duration: 2000
        // })
      })
  } else if (type === 'Invitation_Code') {
    eventDraw()
  } else if (type === 'meituan_xiaoxiang') {
    orderMeituan()
  } else if (type === 'meituan_xiaoxiang_h5') {
    NAVPAGE.toMeituan()
  }
}
onReady(function () {})
onShow(function () {
  if (state.countdownFn) {
    clearInterval(state.countdownFn)
    state.countdownFn = null
  } else {
    state.countdownFn = setInterval(() => {
      state.timeNumber = new Date().getTime()
    }, 1000)
  }
  if (state.openCustomTabbar) {
    app.getTabbar()
    app.editTabbar()
  }
  console.log(state.openCustomTabbar)
  const self = this
  if (inOnLoadPage) {
    inOnLoadPage = false
  } else {
    // 在页面第一次打开时onLoad中已经执行过的操作
    checkAuth()
  }
  if (app.globalData.systemConfigure.openDistribution) {
    // 判断当前用户是否分销员
    if (app.globalData.distributorInfo) {
      state.isDistributor = true
    } else {
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        distributionService
          .getDistributionUser()
          .then((res) => {
            if (res) {
              if (res.status === 'AUDITED') {
                app.globalData.distributorInfo = res
                state.isDistributor = true
              }
              // 保存分销员信息
              auth.setDistributor(res)
            }
          })
          .catch((err) => {
            console.log(err.message)
          })
      }
    }
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    // 获取用户的储值余额
    queryBalance()
  }
})
function getIsShoppingGuide() {
  const self = this
  // if (app.globalData.isShoppingGuide) {
  //   self.setData({
  //     isShoppingGuide: true
  //   })
  //   this.getBackCashDetail();
  // } else {
  // }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    backCashService
      .memberIsGuide(app.globalData.userInfo.member.id)
      .then((res) => {
        console.log('查询是否是导购员：', res)
        app.globalData.isShoppingGuide = res
        state.isShoppingGuide = res
        if (res) {
          getBackCashDetail()
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
function queryGiftCard() {
  const statusEquals = 'ACTIVED'
  giftCardService
    .queryMyGiftCard(state.member.id, statusEquals)
    .then((res) => {
      if (res) {
        state.giftcardNum = res.length
      }
    })
    .catch((err) => {
      console.error('查询礼品卡报错：', err.message)
      state.giftcardNum = 0
    })
}
function queryScore() {
  memberService
    .getBalance(state.member.mobile)
    .then((res) => {
      console.log(res)
      state.memberScoreBalance = res
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function queryBalance() {
  // 饭卡相关代码注释
  // let tempList = []
  // let postData = {
  //     page: '1',
  //     pageSize: '100',
  //     memberId: app.globalData.userInfo.member && app.globalData.userInfo.member.id
  // }
  // couponService.queryMspAccountList(postData).then(res => {
  //     if (res.records && res.records.length > 0) {
  //         tempList = res.records
  //         tempList.sort(function (a, b) {
  //             return Number(b.balance) - Number(a.balance)
  //         })
  //         this.setData({
  //             reserveBalance: tempList[0].balance.toFixed(2)
  //         })
  //     }
  // }).catch(e => {
  //     // wx.showToast({
  //     //     title: e.message,
  //     //     icon: 'none',
  //     //     duration: 2000
  //     // })
  // })
  memberService
    .getMbrBalance()
    .then((res) => {
      if (res || res === 0) {
        state.reserveBalance = res.toFixed(2)
      }
    })
    .catch((e) => {
      if (e.message !== '查询会员余额失败') {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000,
        })
      } else {
        console.log('查询会员余额失败')
      }
    })
}
function queryCoupon() {
  couponService
    .getMbrUnUseCouponCount()
    .then((res) => {
      let tempMember = state.member
      tempMember = {
        ...tempMember,
        couponNum: res,
      }
      state.member = tempMember
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function getOrderStatusCount() {
  const that = this
  const postData = {
    page: 1,
    pageSize: 0,
    searchCount: true,
    businessEquals: 'RETAIL_CATERING',
  }
  orderService
    .getStatusCount()
    .then((res) => {
      console.log(res, 'num')
      const that = this
      if (state.loading) {
        state.loading = false
      }
      if (!res && !res.data) {
        return
      }
      console.log(res)
      res.forEach((numItem) => {
        state.orderStatusEntrance.forEach((stateMenu) => {
          if (stateMenu.orderEntranceStatus == numItem.status) {
            stateMenu.num = numItem.num
            state.numObj[stateMenu.orderEntranceStatus] = numItem.num
          }
        })
      })
      app.globalData.uiconfig.orderStatusEntrance = state.orderStatusEntrance
      state.orderStatusEntrance = state.orderStatusEntrance
      state.numObj = state.numObj
    })
    .catch((err) => {
      if (state.loading) {
        state.loading = false
      }
    })
}
function handelRedPacketBalance() {
  redPacketService
    .getBalance()
    .then((res) => {
      console.log(res)
      state.redPacketBalance = res
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
onHide(function () {
  if (state.countdownFn) {
    clearInterval(state.countdownFn)
    state.countdownFn = null
  }
})
onUnload(function () {
  bus.remove('userCouponChange', eventId)
})
onPullDownRefresh(function () {
  onLoad(options)
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
onReachBottom(function () {})
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  let storeId = ''
  if (app.globalData.storeInfo) {
    storeId = app.globalData.storeInfo.id
  }
  const sharePictures = state.sharePictures
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id
    return {
      title: '线上商城商城让生活更便利',
      path:
        '/pages-sub/newretail/pages/mallModule/tabbar/my/my?shareId=' +
        memberId +
        '&storeId=' +
        storeId,
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  } else {
    return {
      title: '线上商城商城让生活更便利',
      path: '/pages-sub/newretail/pages/mallModule/tabbar/my/my?storeId=' + storeId,
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  }
})
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures
  }
}
function toMemberInfo() {
  console.log('111')
  if (app.globalData.userInfo.member) {
    NAVPAGE.toMemberInfo()
  } else {
    uni.showToast({
      title: '您还不是会员，请绑定手机号成为会员',
      icon: 'none',
      duration: 2000,
    })
  }
}
function toMyDistribution() {
  if (state.hasUserInfo) {
    NAVPAGE.toMyDistribution()
  }
}
function toCoupon() {
  if (state.hasUserInfo) {
    NAVPAGE.toMyCoupon()
  }
}
function toCouponCenter() {
  if (state.hasUserInfo) {
    NAVPAGE.toCouponCenter()
  }
}
function toScore() {
  if (state.hasUserInfo) {
    NAVPAGE.toScoreDetails()
  }
}
function toRedPacket() {
  if (state.hasUserInfo) {
    NAVPAGE.toRedPacket()
  }
}
function toRecharge() {
  // wx.navigateTo({
  //     url: '/pages-sub/newretail/pages/mallModule/member/mealCard/mealCard',
  // })
  NAVPAGE.toRecharge()
}
function toAddress() {
  if (state.hasUserInfo) {
    NAVPAGE.toAddressList()
  }
}
function toSystem() {
  NAVPAGE.toSystem()
}
function toInvite() {
  if (state.hasUserInfo) {
    NAVPAGE.toInvite()
  }
}
function toMemberCard(e) {
  console.log(e, 'daksjdhksaj')
  // 如果首页开启付款码，则不到会员码页面，点击直接跳转付款码页面
  if (app.globalData.uiconfig.isHomePayCodeEnabled) {
    NAVPAGE.toPayCode()
  } else {
    NAVPAGE.toMemberCard()
  }
}
function toGoodsComment() {
  if (state.hasUserInfo) {
    const opts = '?form=my'
    NAVPAGE.toGoodsComment(opts)
  }
}
function toGiftCardCenter() {
  if (state.hasUserInfo) {
    NAVPAGE.toGiftCardCenter()
  }
}
function toMyGiftCard() {
  if (state.hasUserInfo) {
    NAVPAGE.toBuyHistory()
  }
}
function toCustomerService() {
  let tel = ''
  if (
    tel === '' &&
    app.globalData.storeInfo != null &&
    app.globalData.storeInfo.tel != null &&
    app.globalData.storeInfo.tel !== ''
  ) {
    tel = app.globalData.storeInfo.tel
  } else {
    tel = app.globalData.servicePhone
  }
  if (tel !== '') {
    uni.showModal({
      title: '提示',
      content: '确认要拨打此电话' + tel,
      success: function (res) {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: tel,
          })
        } else if (res.cancel) {
        }
      },
    })
  }
}
function toAllOrder() {
  NAVPAGE.toOrderList()
}
function toApplyShoppingGuide() {
  NAVPAGE.toApplyShoppingGuide()
}
function toShoppingGuide() {
  NAVPAGE.toGuideGoods()
}
function toCashout() {
  NAVPAGE.toCashout()
}
function toBalance() {
  if (state.hasUserInfo) {
    NAVPAGE.toBalance()
  }
}
function toFeedback() {
  NAVPAGE.toFeedback()
}
function toOrderMenu(val) {
  console.log(val)
  const entrance = app.globalData.uiconfig.orderStatusEntrance.filter(
    (value) => value.orderEntranceStatus != 'SCORE_RECORD',
  )
  // 积分兑换记录特殊处理
  if (val.currentTarget.dataset.status == 'SCORE_RECORD') {
    NAVPAGE.toScoreOrder()
    return
  }
  // 线下订单特殊处理
  if (val.currentTarget.dataset.status == 'OFFLINE_ORDER') {
    const opts = '?type=OFFLINE'
    NAVPAGE.toOrderList(opts)
    return
  }
  // 退款售后特殊处理
  if (val.currentTarget.dataset.status == 'REFUND_AFTERMARKET') {
    NAVPAGE.toRefundList()
    return
  }
  const idx = entrance.indexOf(
    app.globalData.uiconfig.orderStatusEntrance[val.currentTarget.dataset.idx],
  )
  const selected = idx + 1 // +1是因为列表前面还有全部订单的列表
  const opts = '?selected=' + selected
  console.log(opts)
  NAVPAGE.toOrderList(opts)
}
function toWaitPayedTailOrder() {
  const opts = '?type=payedTail'
  NAVPAGE.toOrderList(opts)
}
function toPickUp() {
  NAVPAGE.toPickUp()
}
function toApplyDistributor() {
  if (state.hasUserInfo && state.isMember) {
    NAVPAGE.toApplyDistributor()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function callPhone() {
  let tel = ''
  if (
    tel === '' &&
    app.globalData.storeInfo != null &&
    app.globalData.storeInfo.tel != null &&
    app.globalData.storeInfo.tel !== ''
  ) {
    tel = app.globalData.storeInfo.tel
  } else {
    tel = app.globalData.servicePhone
  }
  if (tel !== '') {
    uni.showModal({
      title: '提示',
      content: '确认要拨打此电话' + tel,
      success: function (res) {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: tel,
          })
        } else if (res.cancel) {
        }
      },
    })
  }
}
function handlePageSkip() {
  const that = this
  try {
    // 获取其他页面传来的页面信息
    const pageUrl = uni.getStorageSync('wj_pageUrl')
    if (pageUrl) {
      console.log(pageUrl)
      // Do something with return value
      uni.navigateTo({
        url: pageUrl,
      })
    }
    uni.removeStorageSync('wj_pageUrl')
  } catch (e) {
    // Do something when catch error
  }
}
function recorderPopup() {
  toggleBottomPopup()
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
      getMemberGrade()
      const res = app.globalData.userInfo
      let isExpired = false
      let isVIP = false
      const now = new utils.ResponseDate().getTime()
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
      state.member = {
        ...state.member,
        ...user.member,
        nickName: user.member.nickName ? user.member.nickName : user.wxaUser.nickName,
      }
      state.isVIP = isVIP
      state.hasUserInfo = true
      state.isMember = true
      checkUserInfo()
      getOrderStatusCount()
      getMemberInfo()
      getExternalMember(res.member.id)
      getIsShoppingGuide()
    } else {
      state.member = {
        ...state.member,
        nickName: user.wxaUser.nickName,
      }
      NAVPAGE.toAuthorize()
    }
  }
}
function handleTabbar(e) {
  console.log(e.detail)
  state.showTabbar = e.detail.showTabbar
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.showPhone = true
  } else {
    state.showPhone = false
  }
}
function handleBindPhone(e) {
  if (e.detail.bindMobile === true) {
    handlePopupPhone()
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
function toCreditCard() {
  NAVPAGE.toCreditCard()
}
function toTopUp() {
  NAVPAGE.toTopUp()
}
function toScoreMall(e) {
  const link = `?link=${e}`
  NAVPAGE.toScoreMall(link)
}
function toCheckCode() {
  NAVPAGE.toMyThirdCoupon()
}
function toMyBargain() {
  if (state.hasUserInfo && state.isMember) {
    NAVPAGE.toMyBargain()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toMyTourism() {
  if (state.hasUserInfo && state.isMember) {
    NAVPAGE.toMyTourism()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toMyLottery() {
  if (state.hasUserInfo && state.isMember) {
    NAVPAGE.toMyLottery()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toVIPMember() {
  if (state.hasUserInfo && state.isMember) {
    NAVPAGE.toVIPMember()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toScoreVIP() {
  if (state.hasUserInfo && state.isMember) {
    NAVPAGE.toScoreVip(`?nextGradeNo=${state.nextGradeNo}`)
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toVipPrivilege() {
  if (state.hasUserInfo && state.isMember) {
    if (state.isVIP) {
      NAVPAGE.toVIPMember()
    }
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toBenefits() {
  if (state.hasUserInfo && state.isMember) {
    NAVPAGE.toBenefits()
  } else {
    NAVPAGE.toAuthorize()
  }
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
            utils.showToast(err.message)
          })
      }
    }
  }
}
function toExchangeCoupon() {
  NAVPAGE.toExchabgeCoupon()
}
function toScoreRaffle() {}
function clickSubscribe() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.showPopup = true
  } else {
    NAVPAGE.toAuthorize()
  }
}
function clickClose() {
  state.showPopup = false
}
onPageScroll(function (e) {
  // // 监听页面的滚动距离
  // console.log('当前页面滚动距离:', e.scrollTop);
  // this.setData({
  //   scrollTop: e.scrollTop  // 将滚动距离存储到页面的 data 中
  // });
  if (e.scrollTop > app.globalData.systemInfo.statusBarHeight) {
    state.isShowTopNavigation = true
  } else {
    state.isShowTopNavigation = false
  }
})
</script>
<style scoped>
/* pages/my/my.wxss */

page {
  background-color: #f5f5f5;
  padding-bottom: 128rpx;
}
.page_bg_color,
.page_bg_image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.iphoneX-height {
  height: 50rpx;
  width: 100%;
}

.top-info {
  width: 100%;
  height: 380rpx;
  padding: 50rpx 30rpx 120rpx 30rpx;
  box-sizing: border-box;
  /* 这里需要改成主题色 */
  background: #80bd01;
  text-align: center;
  font-size: 32rpx;
  position: relative;
}

.top-bg {
  background: #009f55;
  width: 100%;
  height: 100rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.vip-bg {
  width: 750rpx;
  height: 380rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.user-info {
  display: flex;
  height: 100rpx;
  width: 100%;
  margin-bottom: 46rpx;
  position: relative;
}

.user-info .user-grade {
  height: 100rpx;
  margin-left: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.user-info .user-grade .nickName-box {
  display: flex;
  align-items: center;
  height: 42rpx;
  margin-bottom: 10rpx;
}

.user-info .user-grade view.nickName {
  font-size: 32rpx;
  line-height: 42rpx;
  color: #fff;
  display: block;
  max-width: 360rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.user-info .user-grade view.no-userInfo {
  font-size: 28rpx;
  color: #8b8b8c;
  line-height: 28rpx;
}

.top-info .user-info .member-nameplate {
  min-width: 65rpx;
  height: 30rpx;
  padding: 0 10rpx;
  background: linear-gradient(-60deg, #4e4f54, #3f3d3d);
  border-radius: 6rpx;
  font-size: 24rpx;
  color: #ffeba5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  margin-left: 13rpx;
}

.top-info .user-info .member-nameplate .flower {
  width: 21rpx;
  height: 23rpx;
  margin-right: 7rpx;
}

.top-info .user-info .vip-nameplate {
  min-width: 91rpx;
  height: 40rpx;
  padding: 0 21rpx 0 21rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20rpx;
  font-size: 20rpx;
  color: #3f3d3d;
  text-align: center;
  line-height: 40rpx;
  color: #666666;
  position: relative;
  overflow: hidden;
}

.vip-nameplate image.vip-nameplate-img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}

.vip-nameplate text {
  position: relative;
}

.top-info button.user-portrait-button {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin: 0 0 0 0;
  margin-bottom: 15rpx;
  overflow: hidden;
  z-index: 10;
  background: #ff8561;
}

.top-info image.user-portrait {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  /* border: 15rpx solid #80cdc1; */
  margin-bottom: 15rpx;
  overflow: hidden;
  z-index: 10;
}

.top-info .MbrQrcodeBox {
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  /* right: 40rpx; */
  /* top: 3%; */
  right: 20rpx;
  /* padding: 20rpx; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.MbrQrcodeBox button {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  left: 0;
  top: 0;
}

.MbrQrcodeBox button::after {
  border: none;
}
.top-info .sign-box {
  position: position;
  right: 30rpx;
}
.top-info .sign {
  position: absolute;
  right: 0;
  top: 20rpx;
  width: 135rpx;
  height: 50rpx;
  line-height: 50rpx;
  background: linear-gradient(180deg, rgba(198, 141, 40, 1) 0%, rgba(167, 113, 17, 1) 100%);
  border-radius: 27rpx;
  font-size: 26rpx;
  color: #ffeacc;
  text-align: center;
  margin-top: 60rpx;
}
.top-info .member-card {
  width: 50rpx;
  height: 50rpx;
  border-radius: 0;
  border: 0;
  margin-bottom: 0;
}

.top-info text {
  position: relative;
  z-index: 10;
  color: #fff;
  margin-bottom: 32rpx;
}

.my-info {
  width: 100%;
  /* height: 160rpx; */
  /* border-radius: 10rpx; */
  /* background: #fff;
  box-shadow: 5rpx 10rpx 20rpx 10rpx rgba(241, 241, 241, 1); */
  /* bottom: 16rpx; */
  z-index: 5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
}

.my-info .my-info-item:first-of-type {
  /* margin-left: 46rpx; */
}

.my-info .my-info-item {
  width: 220rpx;
  height: 80rpx;
  /* margin-top: 47rpx; */
  /* border-left: 1rpx solid #f1f1f1; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /* padding-left: 24rpx; */
  box-sizing: border-box;
}

.my-info .my-info-item text {
  display: block;
  margin-bottom: 0;
}

.my-info-item .num {
  color: #fff;
  font-size: 32rpx;
  line-height: 36rpx;
  height: 36rpx;
  margin-bottom: 12rpx;
  width: 100%;
  text-align: center;
}

/* .my-info-item.balance .num {
  color: #fff;
}

.my-info-item.coupon .num {
  color: #fff;
}

.my-info-item.score .num {
  color: #fff;
} */

.my-info-item .name {
  color: #fff;
  font-size: 20rpx;
  line-height: 28rpx;
  width: 100%;
  text-align: center;
}

.my-info .my-info-item:last-of-type {
  float: right;
  font-size: 32rpx;
}

.sales-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 140rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
  border-bottom: 20rpx solid #f1f1f1;
  position: relative;
}

.sales-center > view {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.sales-center image.left-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.sales-center text {
  font-size: 32rpx;
  color: #1b1b1d;
  font-weight: Medium;
}

.sales-center .right-icon {
  width: 12rpx;
  height: 23rpx;
}

.memberFeatures {
  padding: 0 30rpx 22rpx 30rpx;
  position: relative;
  margin: 0 auto 40rpx;
}

.order-type-box,
.fun-list {
  width: 100%;
  background: #fff;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
}

.order-type-box {
  /* padding-top: 36rpx; */
  /* border-bottom: 20rpx solid #fff; */
  border-radius: 6rpx;
  margin-bottom: 20rpx;
}

.order-type-box .all-order {
  line-height: 100rpx;
  overflow: hidden;
  border-bottom: 1rpx solid #dedede;
  padding: 0 30rpx;
}

.order-type-box .all-order image {
  height: 35rpx;
  vertical-align: middle;
  margin-top: -6rpx;
}

.order-type-box .all-order view:first-of-type {
  float: left;
  font-size: 28rpx;
}

.order-type-box .all-order view:first-of-type image {
  width: 38rpx;
  margin-right: 20rpx;
}

.order-type-box .all-order view:last-of-type {
  float: right;
  font-size: 24rpx;
  color: #8b8b8c;
}

.order-type-box .all-order view:last-of-type image {
  width: 12rpx;
  height: 23rpx;
  vertical-align: middle;
  margin-left: 8rpx;
}

.order-type-box .order-type-list {
  height: 177rpx;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.order-type-box .order-type-list > view {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 22rpx;
  line-height: 36rpx;
  color: #4b4b4b;
  position: relative;
}

.order-type-box .order-type-list > view image {
  width: 48rpx;
  height: 48rpx;
  position: relative;
  margin-bottom: 18rpx;
}

.order-type-box .order-type-list > view .badge {
  position: absolute;
  right: -10rpx;
  top: -10rpx;
  width: 32rpx;
  height: 32rpx;
  text-align: center;
  line-height: 32rpx;
  font-size: 24rpx;
  color: #fff;
  background: #ff5601;
  border-radius: 16rpx;
}

.order-type-box .order-type-list > view:last-of-type .badge {
  right: -3rpx;
}

.order-type-box .shopping-guide-box {
  padding: 0 30rpx;
}

.order-type-box .shopping-guide-box .shopping-guide-item {
  display: flex;
  justify-content: space-between;
  line-height: 60rpx;
  text-align: center;
  padding: 20rpx 0;
}

.order-type-box .shopping-guide-box .shopping-guide-item > view text:first-of-type {
  font-size: 24rpx;
  color: #999;
}

.order-type-box .shopping-guide-box .shopping-guide-item > view text:last-of-type {
  font-size: 40rpx;
  color: #000;
}

.shopping-guide-box .shopping-guide-item .item {
  display: flex;
  flex-direction: column;
}

.order-type-box .shopping-guide-box .exchange-btn button {
  background: #ff9f43;
  width: 100%;
  height: 78rpx;
  line-height: 78rpx;
  color: #fff;
  text-align: center;
  /* box-shadow: 0px 5px 8px 0px rgba(255,140,106,0.4); */
  border-radius: 10px;
  font-size: 30rpx;
}

.order-type-box .shopping-guide-box .exchange-tips {
  line-height: 75rpx;
  text-align: center;
  color: #ff9f43;
  font-size: 26rpx;
}

.fun-list {
  margin-bottom: 20rpx;
  /* padding-bottom: 32rpx; */
}

.fun-list-title {
  height: 94rpx;
  line-height: 94rpx;
  border-bottom: 1rpx solid #dedede;
  font-size: 28rpx;
  color: #232323;
  padding: 0 30rpx;
}

.fun-list-main {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 60rpx 40rpx;
  padding-bottom: 0;
  box-sizing: border-box;
}

.fun-list-main view {
  width: 25%;
  height: 102rpx;
  display: flex;
  flex-direction: column;
  color: #4b4b4b;
  font-size: 22rpx;
  align-items: center;
  margin-bottom: 60rpx;
  position: relative;
}

.fun-list-main view .customService {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  position: absolute;
  left: 0;
  top: 0;
}

.fun-list-main view button::after {
  border: none;
}

.fun-list-main view image {
  width: 62rpx;
  height: 62rpx;
  margin-bottom: 20rpx;
}

.fun-list-main view text {
  display: block;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
}

/* .fun-list view {
  height: 90rpx;
  line-height: 90rpx;
  border-bottom: 1rpx solid #f1f1f1;
  text-align: left;
  font-size: 32rpx;
  color: #1b1b1d;
  position: relative;
}

.fun-list view:last-of-type {
  border: none;
}

.fun-list view image.right-icon {
  float: right;
  width: 16rpx;
  height: 32rpx;
  margin-top: 26rpx;
} */

.tel {
  font-size: 28rpx;
  line-height: 90rpx;
  color: #313131;
  text-decoration: underline;
  float: right;
  margin-right: 36rpx;
}

.balance {
  font-size: 32rpx;
  line-height: 90rpx;
  color: #ff8561;
  float: right;
  /* margin-right: 36rpx; */
}

.edition-info {
  margin-top: 72rpx;
  font-size: 28rpx;
  color: #d9dbe0;
  line-height: 36rpx;
  width: 100%;
  text-align: center;
}

.popup-content {
  /* height: 264rpx; */
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

button.authorization {
  width: 100%;
  height: 100%;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
}

button.authorization::after {
  border: none;
}

.official-account {
  width: 670rpx;
  margin: 0 auto;
}

.banner-box {
  margin-bottom: 20rpx;
  border-radius: 6rpx;
}

.banner-box .banner-wrap {
  padding: 20rpx;
  background: #fff;
}

.banner-box .swiper {
  border-radius: 18rpx;
  overflow: hidden;
}

.banner-box .swiper-item image {
  width: 100%;
  height: 100%;
}

.page-content {
  background-color: #f5f5f5;
}

.content-box {
  width: 100%;
  height: 100vh;
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

/* VIP会员相关 */

.vip-memmber-entrance {
  width: 692rpx;
  height: 124rpx;
  border-radius: 10rpx;
  position: relative;
  margin-bottom: 20rpx;
}

.vip-memmber-entrance image.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.vip-memmber-entrance view.block {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}

.vip-memmber-entrance image.crown {
  width: 55rpx;
  height: 47rpx;
  margin-left: 23rpx;
  margin-right: 6rpx;
}

.vip-memmber-entrance .text {
  width: 438rpx;
}

.vip-memmber-entrance .text .name {
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: bold;
  color: #ffeba5;
}

.vip-memmber-entrance .text .name text {
  color: #fff;
}

.vip-memmber-entrance .text .desc {
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #fff;
  font-style: italic;
  font-size: 22rpx;
  line-height: 42rpx;
}

.vip-memmber-entrance view .button {
  width: 145rpx;
  height: 45rpx;
  background: #ffeba5;
  border-radius: 23rpx;
  font-size: 24rpx;
  color: #201f1f;
  text-align: center;
  line-height: 45rpx;
  font-weight: bold;
  margin-right: 14rpx;
  margin-left: 11rpx;
}

.user-sync-button {
  padding: 0 12rpx;
  margin-left: 12rpx;
  color: #fff;
  height: 38rpx;
  border: 2rpx solid #ffffff;
  border-radius: 21rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}

.user-sync-button::after {
  border: none;
}

.user-sync-image {
  width: 20rpx;
  height: 20rpx;
  margin-right: 12rpx;
}

.user-sync-text {
  font-size: 20rpx;
  line-height: 42rpx;
  margin-bottom: 0 !important;
}
</style>
