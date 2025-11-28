<script setup lang="ts">
import { getSignParam } from '@/service/api/auth'
import store, { promotionDateStore, useSystemStore, useUserStore } from './store'
import auth from '@/utils/newretail/auth'
import util from '@/utils/newretail/utils'
import wxaUserService from '@/service/api/newretail/wxaUserService'
import mbrService from '@/service/api/newretail/memberService'
import sysService from '@/service/api/newretail/systemService'
import hmoeService from '@/service/api/newretail/homepageService'
import distributionService from '@/service/api/newretail/distributionService'
import sharePicturesService from '@/service/api/newretail/sharePicturesService'
import storeService from '@/service/api/newretail/storeService'
import ADDRESS from '@/utils/newretail/address'
import shopcartService from '@/service/api/newretail/shopcartService'
import mta from '@/libs/mta_analysis'
import ANALYSIS from '@/utils/newretail/analysis'
import log from '@/utils/newretail/log'
import backCashService from '@/service/api/newretail/backCashService'
import address from '@/utils/newretail/address'
import request from '@/service/api/newretail/request'
import addToCart from '@/pages/template/addCart/addCart'
let pageOnLaunch = false
const authStore = useUserStore(store)
const promotionStore = promotionDateStore()
// app.vue
const appInstance = getApp()

const globalData = {
  dfsObj: {},
  // 分布式存储
  mapSetKey: null,
  // 地图配置项
  userInfo: null,
  memberInfo: null,
  distributorInfo: null,
  // 分销员信息
  addressInfo: null,
  storeId: '',
  // 分享的门店id
  shareStoreId: '',
  storeInfo: null,
  // 用户选择的门店
  distributionStore: null,
  // 统配门店'
  systemConfigure: {
    producrisStoreCode: null,
    // 商品分享是否开启门店参数
    hasRedPacket: false,
    openScorePrizeGrade: false,
    memberAscriptionStoreDistance: 1000,
    supportPartReturn: false,
    storeProductBalanceIsZeroShow: true,
    hasShowProductsCategoryPage: false,
    // 是否显示分类页
    productsListShowClass: 'VERTICAL',
    // 商品列表分类展示样式，可选项：横向（默认）TRANSVERSE，竖向VERTICAL
    hasDistributionCenter: true,
    // 是否有分销员中心
    openDistributionAccountShareProduct: false,
    // 是否开启分销员分享商品创建上下级关系,默认 false
    externalCouponPrefix: 'GM',
    // 券码显示前缀
    orderHiddenLadingCode: false,
    // 普通订单未到时间是否隐藏自提码，默认不隐藏
    shareStoreType: 'NEAR_STORE',
    isMiNiAppMustAccredit: false,
    // 是否开启极速登录
    userCostPrice: false,
    // 分销金额是否减去商品成本 默认false
    showOfflineOrders: false,
    // 是否显示线下订单
    fictitiousProductId: '8888888',
    // 虚拟商品Id
    memberCodeDisplayPayMethod: '',
    // 会员码展示的付款方式 积分支付：SCOREPAY 微信支付：WXPAY 余额支付：BLANCEPAY(多个以英文逗号分隔)
    isEnableVipMember: false,
    // 是否启用付费会员
    vipGradeConfig: {
      // 付费会员相关配置
      name: '黑卡会员',
      // 名称
      openMemberPrice: false,
      // 是否开启会员价
      // priceLabel: "黑卡价", // 价格标签
      priceLabel: '会员价',
      // 价格标签
      description: '成为黑卡会员•每月拿200元红包', // 图上文案
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

  // normal,distribution
  distributionFee: null,

  promotionAdsenseCount: 0,

  // 首页促销广告弹出计数 0 ，1
  loginDonateCouponCount: 0,

  newMemberAdCount: 0,

  // 首页新用户注册广告弹出计数 0 ，1
  addToCart,

  uiconfig: {},
  homeModel: [],

  show: {
    login: false, // 极速登录弹窗
  },

  isMiNiAppMustAccreditQueryCount: 0,

  // 是否极速登录查询计数 0,1
  isIphoneX: false,

  isShoppingGuidanceRecordGoods: false,

  // 导购订单是否记录到商品 默认为否，整单都算导购。如果需求为true再讨论
  // 是否已经显示过提示用户收藏小程序的弹窗
  isPushCollectShowed: false,

  // 所有订单的状态对应的文字
  orderStatus: {
    CREATED: {
      name: '待付款',
    },
    PAID: {
      name: '已付款',
    },
    SHIPPED: {
      name: '已发货',
    },
    RECEIVED: {
      name: '待评价',
    },
    FINISHED: {
      name: '已完成',
    },
    CANCELED: {
      name: '已作废',
    },
    REJECTED: {
      name: '已退货',
    },
    RETURNING: {
      name: '退款中',
    },
    PENDING: {
      name: '待自提',
    },
    WAITPAYBALANCE: {
      name: '待付尾款',
    },
    WAITSHIPPED: {
      name: '待发货',
    },
    PAYFAILED: {
      name: '支付失败',
    },
    SCORE_RECORD: {
      name: '积分兑换记录',
    },
    OFFLINE_ORDER: {
      name: '线下订单',
    },
    REFUND_AFTERMARKET: {
      name: '退款/售后',
    },
  },

  TENANT: 'regression',
  luckyDrawPopupCount: 0,
  isOfficialAccountQueryLoadCount: 0,

  // 是否公众号组件加载计数 0,1
  navHeight: 90,

  navigationBarTitleText: '都市花乡',
  distributionAccountShareId: '',
  memberGrade: '',

  // 会员等级信息
  gradeDescriptionPicture: '',

  // 会员等级说明
  isMingKangHui: false,

  // 明康汇才展示会员中心成长值
  memberSystem: 'zhijian',

  // 智简会员系统才展示会员成长值
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

  // 是否已经查询过订阅消息模板集合
  isShoppingGuide: false,

  // 导购员信息
  merchantCenter: null,

  queryTabbar: 0,
  loginCount: 0,
  initEasyRecPlugins: 0,
  initEasyRecPluginsStoreId: '',
  parameter: null,
  hasEasyRecPlugins: false,
  differenceTime: 0,

  // 服务器与本地时间差（服务器 - 本地时间）
  heavyLoadRoute: '',

  channel: '',

  // 获取最近门店
  getRecentlyStore(options) {
    uni.getSetting({
      success: (res) => {
        const authSetting = res.authSetting
        if (authSetting['scope.userLocation']) {
          uni.getLocation({
            type: 'gcj02',
            success: (res) => {
              const latitude = res.latitude
              const longitude = res.longitude
              getApp().globalData.location = {
                latitude: res.latitude,
                longitude: res.longitude,
              }
              storeService
                .queryList()
                .then((res) => {
                  let newAllStores = []
                  res.forEach((item) => {
                    if (item.status === 'OPEN') {
                      const dis = util.distance(latitude, longitude, item.latitude, item.longitude)
                      newAllStores.push({
                        ...item,
                        distance: dis,
                      })
                    }
                  })
                  newAllStores = newAllStores.sort((a, b) => {
                    return a.distance - b.distance
                  })
                  let noUpdateFlag = false
                  if (options.query && options.query.scene) {
                    noUpdateFlag = res.some((item) => {
                      return item.virtualStoreId == options.query.scene
                    })
                  }
                  if (!noUpdateFlag) {
                    // globalData.storeId = newAllStores && newAllStores[0] ? newAllStores[0].id : globalData.storeId;
                    getApp().globalData.storeInfo =
                      newAllStores && newAllStores[0]
                        ? newAllStores[0]
                        : getApp().globalData.storeInfo
                    uni.setStorageSync('storeIdactive', getApp().globalData.storeInfo)
                    uni.setStorageSync('updatePage', 1)
                  } else {
                    uni.setStorageSync('setTip', true)
                  }
                })
                .catch((err) => {
                  uni.setStorageSync('updatePage', 1)
                })
            },
            fail: (res) => {
              uni.setStorageSync('updatePage', 1)
            },
          })
        } else {
          uni.setStorageSync('updatePage', 1)
        }
      },
      fail: (err) => {
        uni.setStorageSync('updatePage', 1)
      },
    })
  },

  // 判断会员是否是导购员
  memberIsGuide: function (memberId) {
    if (memberId) {
      backCashService
        .memberIsGuide(memberId)
        .then((res) => {
          console.log('查询是否是导购员：', res)
          getApp().globalData.isShoppingGuide = res
        })
        .catch((err) => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
        })
    }
  },

  /**
   * 准备刷新令牌
   */
  refreshAccessToken() {
    const user = auth.getUser()
    const tokens = auth.getTokens()
    if (!tokens || !tokens.expiresTo) {
      getApp().globalData.userInfo = null
      console.log('当前用户未登录，请先登录')
      return
    }

    // 如果refresh token也过期，就不再刷新令牌了
    if (tokens.refreshExpiresTo < new Date().getTime()) {
      if (user && user.wxaUser.openId) {
        // 本地有缓存的用户信息
        wxaUserService
          .login()
          .then((res) => {
            getApp().globalData.userInfo = res
          })
          .catch((err) => {
            console.log('自动登录失败：', err)
            getApp().globalData.userInfo = null
            console.log('刷新令牌已经过期，请重新登录')
          })
        return
      }
      getApp().globalData.userInfo = null
      console.log('刷新令牌已经过期，请重新登录')
      return
    }
    if (getApp().globalData.userInfo.member) {
      mbrService
        .getLoginMember()
        .then((res) => {
          if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
            getApp().globalData.userInfo.member = {
              ...getApp().globalData.userInfo.member,
              ...res,
            }
          }
        })
        .catch((err) => {
          util.showToast(err.message)
        })
    }
    // 刷新令牌时间，提前30分钟
    let expiresIn = tokens.expiresTo - new Date().getTime() - 600000
    expiresIn = expiresIn <= 0 ? 1000 : expiresIn
    setTimeout(function () {
      // 准备刷新令牌
      mbrService
        .refreshToken(tokens.refreshToken)
        .then((data) => {
          auth.setTokens(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }, expiresIn)
  },

  /**
   * 获取默认分享图
   */
  getDefaultSharePictures() {
    try {
      const sharePictures = uni.getStorageSync('wj_sharePictures')
      if (sharePictures) {
        getApp().globalData.sharePictures = sharePictures
      }
    } catch (error) {
      console.log('CatchClause', error)
      console.log('CatchClause', error)
    }
    sharePicturesService
      .getByModelType('DEFAULT')
      .then((res) => {
        if (res) {
          getApp().globalData.sharePictures = res.pictureUrl
          try {
            uni.setStorageSync('wj_sharePictures', res.pictureUrl)
          } catch (error) {
            console.log('CatchClause', error)
            console.log('CatchClause', error)
          }
        }
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  },

  /**
   * 查询系统配置项
   */
  getSystemOptions(options) {
    try {
      const configureInfo = uni.getStorageSync('wj_systemOptions')
      if (configureInfo) {
        // Do something with return value
        handleSystemOption(configureInfo)
      }
      console.log('----------------------配置信息')
      console.log(getApp().globalData.systemConfigure)
      const keyArr = [
        'producrisStoreCode',
        // 分享带门店id
        'lbs_tianditu_appkey',
        // 天地图key
        'miniprogramSharingName',
        // 分享配置
        'deliveryDistanceThirdMap',
        // 地图配置项
        'memberAscriptionStoreDistance',
        'homeBackgroundImage',
        'bgMarginTop',
        'liveRoomLogoUrl',
        'homeBackgroundColour',
        'titlebarFotColour',
        'titlebarBackgroundColour',
        'appContactMobile',
        'app.mall.distributionStoreId',
        'storeProductBalanceIsZeroShow',
        'isUseExternalCoupon',
        'openDistributionAccountShareProduct',
        'externalCouponPrefix',
        'userCostPrice',
        'fictitiousProductId',
        'memberCodeDisplayPayMethod',
        'showScorePayCode',
        'orderChooseDateAllowDays',
        'orderChooseDateInterval',
        'daysOfSelfTimeDelay',
        'isGiftCard',
        'showExternalCouponActivity',
        'isDeliveryProduct',
        'hasRedPacket',
        'selfTakeCode',
        'supportPartReturn',
        'isBothScoreAndCoupon',
        'openScorePrizeGrade',
        'openDistribution',
        'showVipMemberModule',
        'showCenterMbrModule',
        'enableRecordVisitStore',
        'showCartModule',
        'showHotGoods',
        'showUnreadCoupons',
        'showStorePrize',
        'liveRoomShowCenter',
        'wisdom_source',
        'sandbox_mode',
        'customizedPicture',
        'isRechargePasswordEnabled',
        'isRechargePasswordShow',
        'customerService',
        'customizedPage',
        'app.mall.order.trace.type',
        'app.mall.order.cash-payment',
        'productPlacedAtTheTop',
        'dfs_huaweiDomain',
        'dfs_huaweiEndPoint',
        'dfs_huaweiPrefix',
        'dfs_type',
        'dfs_aliyunDomain',
        'dfs_aliyunPrefix',
        'dfs_qcloudDomain',
        'dfs_qcloudPrefix',
        'isOpenStoreOrder',
      ]
      const keys = keyArr.join(',')
      sysService
        .query(keys)
        .then((res) => {
          console.log('getSystemOptions end', util.formatTime(new Date()).replace(/\//g, '-'))
          handleSystemOption(res)
          console.log('----------------查询配置信息')
          console.log(getApp().globalData.systemConfigure)
          if (getApp().globalData.systemConfigure.openDistribution) {
            getApp().globalData.getDistributionUser()
          }
          if (
            options.query.shareId != null &&
            options.query.shareId !== '' &&
            getApp().globalData.systemConfigure.openDistributionAccountShareProduct &&
            getApp().globalData.systemConfigure.openDistribution
          ) {
            getApp().globalData.bindDistribution(options.query.shareId)
          } else {
            pageOnLaunch = false
          }
          if (util.isDeliveryProduct()) {
            // console.log('是不是进入到了这里是不是')
            getApp().globalData.getDistributionStore()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (e) {
      console.log('CatchClause', e)
      console.log('CatchClause', e)
      // Do something when catch error
      pageOnLaunch = false
      console.log(e)
    }
    function handleSystemOption(res) {
      getApp().globalData.configureInfo = res
      if (res && res.length > 0) {
        res.forEach((item) => {
          if (item.key === 'app.mall.distributionStoreId' && item.value != null) {
            getApp().globalData.systemConfigure.distributionStoreId = item.value
            uni.setStorageSync('distributionStoreId', item.value)
          } else if (item.key === 'titlebarBackgroundColour' && item.value != null) {
            getApp().globalData.systemConfigure.titlebarBackgroundColour = item.value
          } else if (item.key === 'titlebarFotColour' && item.value != null) {
            getApp().globalData.systemConfigure.titlebarFotColour = item.value
          } else if (item.key === 'homeBackgroundColour' && item.value != null) {
            getApp().globalData.systemConfigure.homeBackgroundColour = item.value
          } else if (item.key === 'homeBackgroundImage' && item.value != null) {
            getApp().globalData.systemConfigure.homeBackgroundImage = item.value
          } else if (item.key === 'bgMarginTop' && item.value != null) {
            getApp().globalData.systemConfigure.bgMarginTop = item.value
          } else if (item.key === 'liveRoomLogoUrl' && item.value != null) {
            getApp().globalData.systemConfigure.liveRoomLogoUrl = item.value
          } else if (item.key === 'memberAscriptionStoreDistance' && item.value != null) {
            getApp().globalData.systemConfigure.memberAscriptionStoreDistance = Number(item.value)
          } else if (item.key === 'appContactMobile' && item.value != null) {
            getApp().globalData.servicePhone = item.value
          } else if (item.key === 'storeProductBalanceIsZeroShow' && item.value != null) {
            // 库存为0的商品显示，默认1显示为“已售完” ,2不显示"
            if (item.value === '1') {
              getApp().globalData.systemConfigure.storeProductBalanceIsZeroShow = true
            } else if (item.value === '2') {
              getApp().globalData.systemConfigure.storeProductBalanceIsZeroShow = false
            } else {
              getApp().globalData.systemConfigure.storeProductBalanceIsZeroShow = true
            }
          } else if (item.key === 'isUseExternalCoupon' && item.value != null) {
            getApp().globalData.systemConfigure.isUseExternalCoupon = item.value === 'TRUE'
          } else if (item.key === 'openDistributionAccountShareProduct' && item.value != null) {
            getApp().globalData.systemConfigure.openDistributionAccountShareProduct =
              item.value === 'TRUE'
          } else if (
            item.key === 'externalCouponPrefix' &&
            item.value != null &&
            item.value !== ''
          ) {
            getApp().globalData.systemConfigure.externalCouponPrefix = item.value
          } else if (item.key === 'userCostPrice' && item.value != null) {
            getApp().globalData.systemConfigure.userCostPrice = item.value === 'TRUE'
          } else if (
            item.key === 'fictitiousProductId' &&
            item.value != null &&
            item.value !== ''
          ) {
            getApp().globalData.systemConfigure.fictitiousProductId = item.value
          } else if (item.key === 'memberCodeDisplayPayMethod' && item.value != null) {
            getApp().globalData.systemConfigure.memberCodeDisplayPayMethod = item.value
          } else if (item.key === 'showScorePayCode' && item.value != null) {
            getApp().globalData.systemConfigure.showScorePayCode = item.value === 'TRUE'
          } else if (item.key === 'openDistribution' && item.value != null) {
            getApp().globalData.systemConfigure.openDistribution = item.value === 'TRUE'
          } else if (item.key === 'showVipMemberModule' && item.value != null) {
            getApp().globalData.systemConfigure.showVipMemberModule = item.value === 'TRUE'
          } else if (item.key === 'showCenterMbrModule' && item.value != null) {
            getApp().globalData.systemConfigure.showCenterMbrModule = item.value === 'TRUE'
          } else if (item.key === 'enableRecordVisitStore' && item.value != null) {
            getApp().globalData.systemConfigure.enableRecordVisitStore = item.value === 'TRUE'
          } else if (item.key === 'showCartModule' && item.value != null) {
            getApp().globalData.systemConfigure.showCartModule = item.value === 'TRUE'
          } else if (item.key === 'showHotGoods' && item.value != null) {
            getApp().globalData.systemConfigure.showHotGoods = item.value === 'TRUE'
          } else if (item.key === 'showUnreadCoupons' && item.value != null) {
            getApp().globalData.systemConfigure.showUnreadCoupons = item.value === 'TRUE'
          } else if (item.key === 'showStorePrize' && item.value != null) {
            getApp().globalData.systemConfigure.showStorePrize = item.value === 'TRUE'
          } else if (item.key === 'liveRoomShowCenter' && item.value != null) {
            getApp().globalData.systemConfigure.liveRoomShowCenter = item.value === 'TRUE'
          } else if (item.key === 'wisdom_source' && item.value != null) {
            getApp().globalData.systemConfigure.wisdomSource = item.value
          } else if (item.key === 'customizedPicture' && item.value != null) {
            getApp().globalData.systemConfigure.customizedPicture = item.value
          } else if (item.key === 'isRechargePasswordEnabled' && item.value != null) {
            getApp().globalData.systemConfigure.isRechargePasswordEnabled = item.value === 'TRUE'
          } else if (item.key === 'isRechargePasswordShow' && item.value != null) {
            getApp().globalData.systemConfigure.isRechargePasswordShow = item.value === 'TRUE'
          } else if (item.key === 'deliveryDistanceThirdMap' && item.value != null) {
            getApp().globalData.systemConfigure.deliveryDistanceThirdMap = item.value
          } else if (item.key === 'lbs_tianditu_appkey' && item.value != null) {
            getApp().globalData.systemConfigure.lbsTiandituAppkey = item.value
          } else if (item.key === 'customizedPage' && item.value != null) {
            getApp().globalData.systemConfigure.customizedPage = item.value
          } else if (item.key === 'miniprogramSharingName' && item.value != null) {
            getApp().globalData.systemConfigure.miniprogramSharingName = item.value
          } else if (item.key === 'app.mall.order.trace.type' && item.value != null) {
            getApp().globalData.systemConfigure.orderTraceType = item.value
            uni.setStorageSync('orderTraceType', item.value)
          } else if (item.key === 'app.mall.order.cash-payment' && item.value != null) {
            getApp().globalData.multiplePayment = item.value === 'TRUE'
          } else if (item.key === 'productPlacedAtTheTop' && item.value != null) {
            getApp().globalData.productPlacedAtTheTop = item.value === 'TRUE'
          } else if (item.key === 'isOpenStoreOrder' && item.value != null) {
            getApp().globalData.isOpenStoreOrder = item.value === 'TRUE'
          } else if (item.key === 'producrisStoreCode' && item.value != null) {
            getApp().globalData.systemConfigure.producrisStoreCode = item.value
          } else if (
            item.key === 'dfs_qcloudPrefix' ||
            item.key === 'dfs_qcloudDomain' ||
            item.key === 'dfs_aliyunPrefix' ||
            item.key === 'dfs_aliyunDomain' ||
            item.key === 'dfs_huaweiDomain' ||
            item.key === 'dfs_huaweiEndPoint' ||
            item.key === 'dfs_huaweiPrefix' ||
            item.key === 'dfs_type'
          ) {
            getApp().globalData.dfsObj[item.key] = item.value
          }
        })
        try {
          uni.setStorageSync('wj_systemOptions', res)
        } catch (error) {
          console.log('CatchClause', error)
          console.log('CatchClause', error)
          console.log(error)
        }
      }
    }
  },

  /**
   * 绑定分销关系
   */
  bindDistribution: function (memberId) {
    // 判断是否开启分销员分享商品创建上下级关系
    console.log(
      '是否开启绑定',
      getApp().globalData.systemConfigure.openDistributionAccountShareProduct,
    )
    if (getApp().globalData.systemConfigure.openDistributionAccountShareProduct) {
      if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
        const postData = {
          memberId,
        }
        distributionService
          .bind(postData)
          .then((res) => {
            console.log('------------绑定分销员上下级关系成功')
            console.log(res)
            pageOnLaunch = false
          })
          .catch((err) => {
            console.log('------------绑定分销员上下级关系失败')
            console.log(err.message)
            getApp().globalData.distributionAccountShareId = memberId
            pageOnLaunch = false
          })
      } else {
        // 用户未登录或不是会员，缓存分销员信息，等登陆后绑定关系
        getApp().globalData.distributionAccountShareId = memberId
        console.log('未登录或不是会员')
        pageOnLaunch = false
      }
    } else {
      pageOnLaunch = false
      console.log('未开启分销员分享商品创建上下级关系')
    }
  },

  /**
   * 查询VIP会员配置
   */
  getVipMemberConfig: function () {
    console.log('是否付费会员配置：', getApp().globalData.systemConfigure.isEnableVipMember)
    try {
      const config = uni.getStorageSync('wj_vipMemberConfig')
      if (config) {
        getApp().globalData.systemConfigure.vipGradeConfig = config
      }
      mbrService
        .getVipMemberGradeConfig()
        .then((res) => {
          if (res) {
            getApp().globalData.systemConfigure.isEnableVipMember = res.enable
            getApp().globalData.systemConfigure.vipGradeConfig = res
            uni.setStorageSync('wj_vipMemberConfig', res)
          } else {
            getApp().globalData.systemConfigure.isEnableVipMember = false
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.log('CatchClause', error)
      console.log('CatchClause', error)
    }
  },

  /**
   * 查询底部菜单
   */
  getTabbar() {
    try {
      if (getApp().globalData.queryTabbar === 0) {
        const tabBar = uni.getStorageSync('wj_tabBar')
        if (tabBar) {
          getApp().globalData.tabBar.list = tabBar
        }
        getApp().globalData.queryTabbar = 1
        hmoeService
          .query('UNDER_MENU')
          .then((res) => {
            if (res && res.length > 0) {
              const tabBar = []
              res.forEach((item) => {
                if (item.navigationStatus === 0) {
                  // 0为启用的tab1为不启用
                  const tempItem = {
                    pagePath: handlelinkModel(item.linkModel),
                    iconPath: item.imageUrl,
                    selectedIconPath: item.clickImageUrl,
                    text: item.modelName,
                    badge: '0',
                    linkModel: item.linkModel,
                    textColor: item.textColor,
                    // 选中文字颜色
                    textColorNotSelected: item.textColorNotSelected,
                    // 未选中文字颜色
                    textColorType: item.textColorType,
                    // 文字颜色类型 0 系统配色/1 自定义配色
                    navigationStyle: item.navigationStyle,
                    // 根据此字段判断是否是舵式显示 默认直接取返回的第0个就行
                    colour: item.colour, // 导航背景配色
                  }
                  tabBar.push(tempItem)
                }
              })
              try {
                uni.setStorageSync('wj_tabBar', tabBar)
              } catch (error) {
                console.log('CatchClause', error)
                console.log('CatchClause', error)
              }
              getApp().globalData.tabBar.list = tabBar
              // 获取用户购物车商品数量
              if (
                getApp().globalData.userInfo &&
                getApp().globalData.userInfo.member &&
                getApp().globalData.systemConfigure.showCartModule
              ) {
                getApp().globalData.getUserProductsCount()
              }
              // 处理tabbar不对的情况
              getApp().globalData.editTabbar()
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
    } catch (error) {
      console.log('CatchClause', error)
      console.log('CatchClause', error)
    }
    // handlelinkModel()
    function handlelinkModel(linkModel) {
      if (linkModel === 'home') {
        return '/pages/mallModule/index/index/index'
      } else if (linkModel === 'sort') {
        return '/pages/mallModule/tabbar/category/category-list/category-list'
      } else if (linkModel === 'shopping_cart') {
        return '/pages/mallModule/tabbar/shopcart/shopcart'
      } else if (linkModel === 'my') {
        return '/pages/mallModule/tabbar/my/my'
      } else if (linkModel === 'memberCode') {
        return '/pages/mallModule/myCard/memberCard/memberCard'
      } else if (linkModel === 'catering') {
        return 'catering'
      } else if (linkModel === 'grab_activity') {
        return '/pages/mallModule/activity/seckill/seckill'
      } else if (linkModel === 'teambuying_activity') {
        return '/pages/mallModule/fightGroup/fightGroup/fightGroup'
      } else if (linkModel === 'live_room') {
        return '/pages/mallModule/liveplay/showList/showList'
      } else if (linkModel === 'self_delivery') {
        return '/pages/mallModule/tabbar/selfLifting/selfLifting'
      } else if (linkModel === 'benefit_plan') {
        return '/pages/mallModule/benefitPlan/welfarePlan/welfarePlan'
      } else {
        return ''
      }
    }
  },

  /**
   * 跳转后修改tabbar
   */
  editTabbar: function () {
    // wx.hideTabBar();
    const tabbar = getApp().globalData.tabBar
    console.log('tabbar', getApp()?.globalData, globalData)
    const currentPages = getCurrentPages()
    const _this = currentPages[currentPages.length - 1]
    if (_this == null) {
      return
    }
    let pagePath = _this.route
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath
    }
    for (const i in tabbar.list) {
      tabbar.list[i].selected = false
      if (tabbar.list[i].pagePath == pagePath) {
        tabbar.list[i].selected = true
      }
    }
    _this.setData({
      tabbar,
    })
  },

  /**
   * 获取用户购物车商品数量
   */
  getUserProductsCount() {
    const tabBar = getApp().globalData.tabBar
    try {
      const count = uni.getStorageSync('wj_userProductsCount')
      if (count) {
        if (tabBar.list && tabBar.list.length > 0) {
          tabBar.list.forEach((item) => {
            if (item.pagePath === '/pages/mallModule/tabbar/shopcart/shopcart') {
              item.badge = String(count)
            }
          })
        }
        getApp().globalData.tabBar = tabBar
      }
    } catch (error) {
      console.log('CatchClause', error)
      console.log('CatchClause', error)
    }
    shopcartService
      .getProductsCount()
      .then((res) => {
        const tabBar = getApp().globalData.tabBar
        if (tabBar.list && tabBar.list.length > 0) {
          tabBar.list.forEach((item) => {
            if (item.pagePath === '/pages/mallModule/tabbar/shopcart/shopcart') {
              item.badge = String(res)
            }
          })
        }
        getApp().globalData.tabBar = tabBar
        getApp().globalData.editTabbar()
        try {
          uni.setStorageSync('wj_userProductsCount', res)
        } catch (error) {
          console.log('CatchClause', error)
          console.log('CatchClause', error)
        }
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  },

  /**
   * 为 tabBar 某一项的右上角添加文本
   * @param linkModel	linkModel	购物车id
   * @param text	string 显示的文本，超过 4 个字符则显示成 ...
   */
  setTabBarBadge: function (linkModel, text) {
    const tabbar = getApp().globalData.tabBar
    tabbar.list.forEach((item) => {
      if (item.linkModel === linkModel) {
        item.badge = text
      }
    })
    getApp().globalData.tabBar = tabbar
    getApp().globalData.editTabbar()
  },

  // 获取门店逻辑
  // async getStoreInfo(options) {
  //   if (!globalData.storeInfo || !globalData.storeInfo.id) {
  //     // 获取到当前的地理位置，查找出最近的门店
  //     await ADDRESS.getAllStore1(this)
  //     await getApp().globalData.getUiConfig(options)
  //   }
  // },
  /**
   * 获取UI配置
   */
  getUiConfig(options) {
    console.log('getUiConfig', util.formatTime(new Date()))
    try {
      const UIConfig = uni.getStorageSync('wj_UIConfig')
      if (UIConfig) {
        // Do something with return value
        handleUIConfigData(UIConfig)
      }
      sysService.queryGroup('UI').then((res) => {
        console.log('getUiConfig res', util.formatTime(new Date()))
        if (res == null) {
          return
        }
        handleUIConfigData(util.handleUIConfig(res))
        pageOnLaunch = true
        const arr = JSON.parse(JSON.stringify(res))
        uni.setStorage({
          key: 'wj_UIConfig',
          data: arr,
        })
      })
    } catch (e) {
      console.log('CatchClause', e)
      console.log('CatchClause', e)
      // Do something when catch error
      console.log(getApp().globalData, getApp(), 'afasfklasjfldjf')
      console.log('获取UIConfig配置信息出错：', getApp().globalData)
    }
    pageOnLaunch = true
    console.log(getApp().globalData, getApp(), 'afasfklasjfldjf')
    getApp().globalData.getSystemOptions(options)
    if (getApp().globalData.systemConfigure.showVipMemberModule) {
      getApp().globalData.getVipMemberConfig()
    }
    getApp().globalData.getTabbar()
    function handleUIConfigData(res) {
      if (res == null) {
        return
      }
      getApp().globalData.uiconfig = util.handleUIConfig(res)
      console.log('ui配置')
      console.log(getApp().globalData.uiconfig)
      if (
        getApp() &&
        getApp().globalData &&
        getApp().globalData.uiconfig &&
        getApp().globalData.uiconfig.themeColor
      ) {
        uni.setStorageSync('themeColor', getApp().globalData.uiconfig.themeColor)
      }
      getApp().globalData.systemConfigure.hasDistributionCenter = res.isShowDistribution
      // 前端分享定位逻辑增加选项控制
      if (res.shareStoreType && res.shareStoreType === 'OWN_STORE') {
        getApp().globalData.systemConfigure.shareStoreType = res.shareStoreType
        getApp().globalData.getShareStoreId(options)
      }

      // 前端普通订单未到时间是否隐藏自提码，默认不隐藏
      getApp().globalData.systemConfigure.orderHiddenLadingCode = !!res.orderHiddenLadingCode
      // 前端是否开启极速登录的配置，默认不开启
      getApp().globalData.systemConfigure.isMiNiAppMustAccredit = !!res.isMiNiAppMustAccredit
      getApp().globalData.systemConfigure.showOfflineOrders = !!res.showOfflineOrders
    }
  },

  /**
   * 判断分享门店信息
   */
  getShareStoreId(options) {
    // const options = wx.getLaunchOptionsSync()
    if (options.query.storeId != null && options.query.storeId !== '') {
      // 页面路径包含分享出的门店id信息
      const storeId = parseInt(options.query.storeId)
      // 判断storeId是否全部是数字
      const reg = /^\d+$/ // 正则校验表达式，判断是否为纯数字
      // 如果是纯数字，说明是门店id，保存门店id，获取缓存门店如果有门店数据，将该门店设为默认门店
      if (reg.test(storeId)) {
        getApp().globalData.storeId = JSON.stringify(storeId)
        getApp().globalData.shareStoreId = JSON.stringify(storeId)
      }
      console.log('分享门店：', JSON.stringify(storeId))
    }
  },

  /**
   * 查询订阅消息模板id
   */
  getTemplateIds() {
    uni.getStorage({
      key: 'wj_templateIds',
      success: (res) => {
        getApp().globalData.templateIds = res
        getTemplateIds()
      },
      fail: () => {
        getTemplateIds()
      },
    })
    function getTemplateIds() {
      if (!(getApp().globalData.userInfo && getApp().globalData.userInfo.member)) {
        log.info('查询模板id报错：当前用户未登录')
        return
      }
      sysService
        .getTemplateIds()
        .then((res) => {
          if (res) {
            getApp().globalData.templateIdsQuery = 1
            getApp().globalData.templateIds = res
          }
          uni.setStorage({
            key: 'wj_templateIds',
            data: res,
          })
        })
        .catch((err) => {
          getApp().globalData.templateIdsQuery = 1
          log.info('查询模板id报错：', err.message)
        })
    }
  },

  /**
   * 查询商户资料
   */
  getMerchantCenter() {
    sysService
      .queryMerchantCenter()
      .then((res) => {
        if (res && res.length > 0) {
          getApp().globalData.merchantCenter = res[0]
        }
      })
      .catch((err) => {
        getApp().globalData.merchantCenter = null
        log.info('查询商户资料报错：', err.message)
      })
  },

  // 取得当前用户是否是分销员
  getDistributionUser: function () {
    try {
      const distributor = uni.getStorageSync('__distributor__') // 获取缓存的分销员信息
      if (distributor && distributor != null && distributor.status === 'AUDITED') {
        getApp().globalData.distributorInfo = distributor
      } else {
        if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
          distributionService
            .getDistributionUser()
            .then((res) => {
              if (res) {
                if (res.status === 'AUDITED') {
                  getApp().globalData.distributorInfo = res
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
    } catch (error) {
      console.log('CatchClause', error)
      console.log('CatchClause', error)
      console.log(error)
    }
  },

  // 获取统配门店
  getDistributionStore: function () {
    const distributionStore = uni.getStorageSync('wj_distributionStore')
    if (distributionStore && distributionStore != null) {
      getApp().globalData.distributionStore = distributionStore
    } else {
      storeService
        .getDistributionStore()
        .then((res) => {
          if (res) {
            getApp().globalData.distributionStore = res
            uni.setStorageSync('wj_distributionStore', res)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },

  // 利用defineProperty定义监听器
  watch: function (key, method) {
    const obj = this
    // 加个前缀生成隐藏变量，防止死循环发生
    const ori = obj[key] // obj[key]这个不能放在Object.defineProperty里
    if (ori) {
      // 处理已经声明的变量，绑定处理
      method(ori)
    }
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this['_' + key] = value
        console.log('是否会被执行2')
        method(value)
      },
      get: function () {
        // 在其他界面调用key值的时候，这里就会执行。
        if (typeof this['_' + key] === 'undefined') {
          if (ori) {
            // 这里读取数据的时候隐藏变量和 globalData设置不一样，所以要做同步处理
            this['_' + key] = ori
            return ori
          } else {
            return undefined
          }
        } else {
          return this['_' + key]
        }
      },
    })
  },

  updateStoreInfo: function (newValue) {
    getApp().globalData.storeInfo = newValue
  },

  multiplePayment: '',
  productPlacedAtTheTop: '',
  isOpenStoreOrder: '',
}
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
    getApp().globalData.authorizeSkip = 0

    // 取当前用户
    uni.setStorageSync('updatePage', 0)
    console.log('场景值', options)
    // 存在渠道扫码进入
    if (options.query.scene && options.query.scene.indexOf('channel') >= 0) {
      const str = decodeURIComponent(options.query.scene)
      if (getApp()) {
        getApp().globalData.channel = str.split('=')[1]
      } else {
        globalData.channel = str.split('=')[1]
      }
      // console.log(str)
    }
    uni.removeStorage({
      key: 'tabList',
      success: function (res) {
        console.log('删除tab保证再次进入时刷新页面')
      },
    })
    uni.removeStorage({
      key: 'counterSwiperObj',
      success: function (res) {},
    })
    uni.removeStorage({
      key: 'urlSwiperObj',
      success: function (res) {},
    })
    // 获取系统配置的支付方式

    try {
      sysService
        .query('paymentMethod')
        .then((res) => {
          if (res && res.length > 0 && res[0].value) {
            if (getApp()) {
              getApp().globalData.paymentMethod = res[0].value
            } else {
              globalData.paymentMethod = res[0].value
            }
            request.PAYMETHOD = res[0].value
          }
        })
        .catch((err) => {})
    } catch (e) {
      console.log('CatchClause', e)
      console.log('CatchClause', e)
    }
    console.log('onLaunchOptions', options)
    if (options.query.scene) {
      const scene = decodeURIComponent(options.query.scene)
      const introducerld = scene.split('=')[1]
      if (introducerld) {
        uni.setStorageSync('wj_introducerld', introducerld)
      } else {
        if (scene.indexOf('gmparam') == -1) {
          uni.setStorageSync('wj_sceneFormActive', options.query.scene)
        }
      }
    }
    const version = {
      ...uni.getSystemInfoSync(),
      // ...uni.getAppAuthorizeSetting(),
      // ...uni.getDeviceInfo(),
      // ...uni.getWindowInfo(),
      // ...uni.getAppBaseInfo(),
    }.SDKVersion
    if (compareVersion(version, '2.5.0') >= 0) {
      if (getApp()) {
        getApp().globalData.openCustomTabbar = true
      } else {
        globalData.openCustomTabbar = true
      }
    } else {
      if (getApp()) {
        getApp().globalData.openCustomTabbar = false
      } else {
        globalData.openCustomTabbar = false
      }
      uni.hideTabBar()
    }

    if (getApp()) {
      getApp().globalData.getUiConfig(options)
      getApp().globalData.getMerchantCenter()
    } else {
      globalData.getUiConfig(options)
      globalData.getMerchantCenter()
    }
    // ADDRESS.getAllStore1(this)
    // 初次启动需要清除上一次生命周期保存的分享人信息
    try {
      uni.removeStorageSync('wj_sharingId')
      uni.removeStorageSync('wj_sharingInfo')
    } catch (e) {
      console.log('CatchClause', e)
      console.log('CatchClause', e)
    } // Do something when catch error
    // 初始化代码可在”应用管理”查看

    // // 获取小程序更新机制兼容
    // if (uni.canIUse('getUpdateManager')) {
    //   const updateManager = uni.getUpdateManager()
    //   updateManager.onCheckForUpdate(function (res) {
    //     // 请求完新版本信息的回调
    //     console.log('是否有新版本？----------------------')
    //     console.log(res.hasUpdate)
    //     if (res.hasUpdate) {
    //       updateManager.onUpdateReady(function () {
    //         uni.showModal({
    //           title: '更新提示',
    //           content: '新版本已经准备好，是否重启应用？',
    //           showCancel: false,
    //           success: function (res) {
    //             if (res.confirm) {
    //               // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //               updateManager.applyUpdate()
    //             }
    //           },
    //         })
    //       })
    //       updateManager.onUpdateFailed(function () {
    //         // 新的版本下载失败
    //         uni.showModal({
    //           title: '已经有新版本了哟~',
    //           content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
    //         })
    //       })
    //     }
    //   })
    // } else {
    //   // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    //   uni.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
    //   })
    // }

    // 取当前用户
    getApp().globalData.userInfo = auth.getUser()
    if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
      if (getApp()) {
        getApp().globalData.memberIsGuide(getApp().globalData.userInfo.member.id)
      } else {
        globalData.memberIsGuide(globalData.userInfo.member.id)
      }
    }
    if (getApp()) {
      getApp().globalData.refreshAccessToken()
      getApp().globalData.getTemplateIds()
    } else {
      globalData.refreshAccessToken()
      globalData.getTemplateIds()
    }
    try {
      sysService
        .query('autoRefreshStoreLocation')
        .then((res) => {
          if (res && res.length > 0 && res[0].value == 'NEAREST') {
            if (
              !options.query ||
              (!options.query.storeId &&
                (!options.query.scene || options.query.scene.indexOf('gmparam') == -1))
            ) {
              if (getApp()) {
                getApp().globalData.getRecentlyStore(options)
              } else {
                globalData.getRecentlyStore(options)
              }
            }
          } else {
            uni.setStorageSync('setTip', true)
          }
        })
        .catch((err) => {})
    } catch (e) {
      console.log('CatchClause', e)
      console.log('CatchClause', e)
    }
    try {
      const res = {
        // ...wx.getSystemInfoSync(),
        ...uni.getSystemInfoSync(),
        // ...uni.getAppAuthorizeSetting(),
        // ...uni.getDeviceInfo(),
        // ...uni.getWindowInfo(),
        // ...uni.getAppBaseInfo(),
      }
      if (getApp()) {
        getApp().globalData.systemInfo = res || {}
      } else {
        globalData.systemInfo = res || {}
      }
      const model = res.model
      const noModelArr = ['iPhone 5', 'iPhone 6', 'iPhone 7', 'iPhone 8']
      const noFlag = noModelArr.some((ele) => model.search(ele) != -1)
      console.log(model.search('iPhone') != -1, !noFlag, 'noflag')
      if (model.search('iPhone') != -1 && !noFlag) {
        if (getApp()) {
          getApp().globalData.isIphoneX = true
        } else {
          globalData.isIphoneX = true
        }
        return
      }
      if (getApp()) {
        getApp().globalData.navHeight = res.statusBarHeight + 44
      } else {
        globalData.navHeight = res.statusBarHeight + 44
      }
      const version = res.SDKVersion
    } catch (e) {
      console.log('CatchClause', e)
      console.log('CatchClause', e)
      console.log(e)
    }
    if (getApp()) {
      getApp().globalData.getDefaultSharePictures()
    } else {
      globalData.getDefaultSharePictures()
    }
    function compareVersion(v1, v2) {
      v1 = v1.split('.')
      v2 = v2.split('.')
      const len = Math.max(v1.length, v2.length)
      while (v1.length < len) {
        v1.push('0')
      }
      while (v2.length < len) {
        v2.push('0')
      }
      for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])
        if (num1 > num2) {
          return 1
        } else if (num1 < num2) {
          return -1
        }
      }
      return 0
    }
  })
  useUpdateApp()
  appLoad()
  // 调用全局应用实例的 onLaunch 方法
})
// 定时器ID存储
const cleanupTimer = null
onShow(async (options) => {
  if (getApp() && getApp().globalData) {
    getApp().globalData.storeInfo =
      getApp().globalData.storeInfo && getApp().globalData.storeInfo.id
        ? globalData.storeInfo
        : uni.getStorageSync('storeIdactive')
  } else {
    globalData.storeInfo =
      globalData.storeInfo && globalData.storeInfo.id
        ? globalData.storeInfo
        : uni.getStorageSync('storeIdactive')
  }
  if (getApp() && !getApp().globalData.storeInfo) {
    storeService.queryList().then((res) => {
      if (res && res.length > 0) {
        res.some((item) => {
          if (item.status == 'OPEN') {
            getApp().globalData.storeInfo = item
            uni.setStorageSync('storeIdactive', item)
          }
          return item.status == 'OPEN'
        })
      }
    })
  }
  console.log('onShowOptions', options)
  // 前端分享定位逻辑增加选项控制
  if (
    getApp() &&
    getApp().globalData &&
    getApp().globalData.systemConfigure.shareStoreType === 'OWN_STORE'
  ) {
    getApp().globalData.getShareStoreId(options)
  }
  uni.setStorage({
    key: '_scene_',
    data: options.scene,
  })
  if (getApp()) {
    getApp().globalData.sceneInfo = options.scene
  } else {
    globalData.sceneInfo = options.scene
  }
  if (options.query.scene) {
    var scene = decodeURIComponent(options.query.scene)
    if (scene && scene === 'isfromQR') {
      if (getApp()) {
        getApp().globalData.scene = scene
      } else {
        globalData.scene = scene
      }
      try {
        uni.setStorageSync('wj_sceneForm', getApp() ? getApp().globalData.scene : globalData.scene)
      } catch (e) {
        console.log('CatchClause', e)
        console.log('CatchClause', e)
      }
    } else {
      try {
        var scene = uni.getStorageSync('wj_sceneForm')
        if (scene && scene === 'isfromQR') {
          // Do something with return value
          if (getApp()) {
            getApp().globalData.scene = scene
          } else {
            globalData.scene = scene
          }
        }
      } catch (e) {
        console.log('CatchClause', e)
        console.log('CatchClause', e)
      } // Do something when catch error
    }
  } else {
    // 默认不搜集信息
    const scene = 'isfromQR'
    if (getApp()) {
      getApp().globalData.scene = scene
    } else {
      globalData.scene = scene
    }
  }
  if (
    getApp() &&
    options.query.shareId != null &&
    options.query.shareId !== '' &&
    getApp().globalData.systemConfigure.openDistributionAccountShareProduct &&
    !pageOnLaunch &&
    getApp().globalData.systemConfigure.openDistribution
  ) {
    getApp().globalData.bindDistribution(options.query.shareId)
  }
  appLoad()
  startTokenCleanup()
  // 调用全局应用实例的 onShow 方法
  if (
    options &&
    options.referrerInfo &&
    options.referrerInfo.extraData &&
    options.referrerInfo.extraData.openPath
  ) {
    uni.navigateTo({ url: options.referrerInfo.extraData.openPath })
  }
})

onHide(() => {
  // 调用全局应用实例的 onHide 方法
  uni.removeStorage({
    key: '_scene_',
    success: function (res) {
      console.log('删除缓存场景')
    },
  })
})
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
