<script setup lang="ts">
import { getSignParam } from '@/service/api/auth'
import store, { promotionDateStore, useSystemStore, useUserStore } from './store'

const authStore = useUserStore(store)
const promotionStore = promotionDateStore()

const appLoad = () => {
  // #ifdef APP-PLUS
  const data = uni.getStorageSync('userInfo')
  console.log('🥘[data]:========>>>>', data)
  if (data) {
    authStore.setUserInfo(data)
  }
  // const plugin = uni.requireNativePlugin('test-plugin')
  // console.log('🥠[plugin]====>:', plugin)
  // authStore.setRealNamePlugin(plugin)
  // getApiSign()
  // #endif
}

const getApiSign = async () => {
  console.log('---------插件初始化开始，调用getSignParam（）-------')
  const res: any = await getSignParam({})
  console.log('APP参数', res)
  const {
    appId,
    orgId,
    signUrl: signServerUrl,
    verifySignUrl: verifyServerUrl,
    Des3Key: des3Key,
  } = res

  console.log('---------插件初始化请求成功res-------', res)
  const params = { appId, orgId, signServerUrl, verifyServerUrl, isDebug: true, des3Key }
  authStore.realNamePlugin.initSDK(params, (data: any) => {
    // test.value = data.code
    console.log('插件初始化', data)
    authStore.setPluginStatus(true)
  })
}
// 初始化系统请求信息
const systemStore = useSystemStore()
useSystemFig(systemStore.initSystemInfo())

useTimeLogin()
//

// 启动定时器（半小时清空一次）
const startTokenCleanup = () => {
  const Times = new Date().getTime()
  const OldTimes = promotionStore.getPromotionDateTime()
  // console.log('promotionStore--------------', promotionStore.getPromotionDateTime())
  if (OldTimes === undefined) {
    console.log('promotionStore', promotionStore.getPromotionDateTime())
  } else {
    if (Times - OldTimes > 1800000) {
      // 30 * 60 * 1000 = 1800000ms
      promotionStore.clearPromotionDate()
    }
  }

  // promotionStore.promotionDate

  // 先清除已有定时器避免重复
  // stopTokenCleanup()
  //
  // // 设置半小时（1800000毫秒）的定时器
  // cleanupTimer = setInterval(() => {
  //   promotionStore.clearPromotionDate()
  //   console.log('promotion已自动清空')
  // }, 1800000)
}

onLaunch((options) => {
  nextTick(() => {
    getApp().globalData = globalData
  })
  useUpdateApp()
  appLoad()
  // 调用全局应用实例的 onLaunch 方法
})
// 定时器ID存储
const cleanupTimer = null
onShow(async (e) => {
  appLoad()
  startTokenCleanup()
  // 调用全局应用实例的 onShow 方法
  if (e && e.referrerInfo && e.referrerInfo.extraData && e.referrerInfo.extraData.openPath) {
    uni.navigateTo({ url: e.referrerInfo.extraData.openPath })
  }
})

onHide(() => {
  // 调用全局应用实例的 onHide 方法
})
const globalData = {
  dfsObj: {},
  mapSetKey: null,
  userInfo: null,
  memberInfo: null,
  distributorInfo: null,
  addressInfo: null,
  storeId: '',
  shareStoreId: '',
  storeInfo: null,
  distributionStore: null,
  nextDayStore: null,
  systemConfigure: {
    producrisStoreCode: null,
    hasRedPacket: false,
    openScorePrizeGrade: false,
    memberAscriptionStoreDistance: 1000,
    supportPartReturn: false,
    storeProductBalanceIsZeroShow: true,
    hasShowProductsCategoryPage: false,
    productsListShowClass: 'VERTICAL',
    hasDistributionCenter: true,
    openDistributionAccountShareProduct: false,
    externalCouponPrefix: 'GM',
    orderHiddenLadingCode: false,
    shareStoreType: 'NEAR_STORE',
    isMiNiAppMustAccredit: false,
    showOfflineOrders: false,
    fictitiousProductId: '8888888',
    memberCodeDisplayPayMethod: '',
    isEnableVipMember: false,
    vipGradeConfig: {
      name: '黑卡会员',
      openMemberPrice: false,
      priceLabel: '会员价',
      description: '成为黑卡会员•每月拿200元红包',
    },
    showScorePayCode: true,
    openDistribution: true,
    showVipMemberModule: true,
    showCenterMbrModule: true,
    enableRecordVisitStore: true,
    showCartModule: true,
    showHotGoods: true,
    showUnreadCoupons: true,
    showStorePrize: true,
    liveRoomShowCenter: false,
    wisdomSource: 'GM',
    customizedPicture: '',
    customizedPage: '',
    miniprogramSharingName: '',
  },
  configureInfo: [],
  systemInfo: {},
  servicePhone: '400-881-9090',
  tabBar: {
    backgroundColor: '#ffffff',
    color: '#979795',
    selectedColor: '#1c1c1b',
    list: [
      {
        pagePath: '/pages/mallModule/index/index/index',
        iconPath: 'http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/demo/tabbar_home.png',
        selectedIconPath:
          'http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/demo/tabbar_home_active.png',
        text: '首页',
        linkModel: 'home',
      },
      {
        pagePath: '/pages/mallModule/tabbar/category/category-list/category-list',
        iconPath: 'http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/demo/tabbar_category.png',
        selectedIconPath:
          'http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/demo/tabbar_category_active.png',
        text: '分类',
        linkModel: 'sort',
      },
      {
        pagePath: '/pages/mallModule/tabbar/shopcart/shopcart',
        iconPath: 'http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/demo/tabbar_shopcart.png',
        selectedIconPath:
          'http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/demo/tabbar_shopcart_active.png',
        text: '购物车',
        linkModel: 'shopping_cart',
      },
      {
        pagePath: '/pages/mallModule/tabbar/my/my',
        iconPath: 'http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/demo/tabbar_my.png',
        selectedIconPath:
          'http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/demo/tabbar_my_active.png',
        text: '会员中心',
        linkModel: 'my',
      },
    ],
  },
  scene: 'normal',
  sceneInfo: null,
  location: null,
  sharePictures: '',
  storeIdentification: 'normal',
  distributionFee: null,
  promotionAdsenseCount: 0,
  loginDonateCouponCount: 0,
  newMemberAdCount: 0,
  addToCart: null,
  // addToCart: addToCart,
  uiconfig: {},
  homeModel: [],
  show: {
    login: false,
  },
  isMiNiAppMustAccreditQueryCount: 0,
  isIphoneX: false,
  isShoppingGuidanceRecordGoods: false,
  isPushCollectShowed: false,
  orderStatus: {
    CREATED: { name: '待付款' },
    PAID: { name: '已付款' },
    SHIPPED: { name: '已发货' },
    RECEIVED: { name: '待评价' },
    FINISHED: { name: '已完成' },
    CANCELED: { name: '已作废' },
    REJECTED: { name: '已退货' },
    RETURNING: { name: '退款中' },
    PENDING: { name: '待自提' },
    WAITPAYBALANCE: { name: '待付尾款' },
    WAITSHIPPED: { name: '待发货' },
    PAYFAILED: { name: '支付失败' },
    SCORE_RECORD: { name: '积分兑换记录' },
    OFFLINE_ORDER: { name: '线下订单' },
    REFUND_AFTERMARKET: { name: '退款/售后' },
  },
  TENANT: 'regression',
  luckyDrawPopupCount: 0,
  isOfficialAccountQueryLoadCount: 0,
  navHeight: 90,
  navigationBarTitleText: '都市花乡',
  distributionAccountShareId: '',
  memberGrade: '',
  gradeDescriptionPicture: '',
  isMingKangHui: false,
  memberSystem: 'zhijian',
  payCodeOrder: {
    count: 0,
    component: null,
  },
  cacheOrder: {
    count: 0,
    component: null,
  },
  templateIds: [],
  openCustomTabbar: false,
  isShopCartChange: false,
  templateIdsQuery: 0,
  isShoppingGuide: false,
  merchantCenter: null,
  queryTabbar: 0,
  loginCount: 0,
  initEasyRecPlugins: 0,
  initEasyRecPluginsStoreId: '',
  parameter: null,
  hasEasyRecPlugins: false,
  differenceTime: 0,
  heavyLoadRoute: '',
  channel: '',
  latitude: '39.990496',
  longitude: '116.482086',
  authorizeSkip: 0,
  pageOnLaunch: false,
}
</script>

<style lang="scss">
/* stylelint-disable selector-type-no-unknown */
button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

button {
  display: inline-block;
  background-color: transparent;

  &::after {
    border: none;
  }
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
</style>
