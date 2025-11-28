// homePageCommonBehavior.js
import storeService from '@/service/api/newretail/storeService'
import productService from '@/service/api/newretail/productService'
import bannerService from '@/service/api/newretail/bannerService'
import shopcartService from '@/service/api/newretail/shopcartService'
import memberService from '@/service/api/newretail/memberService'
import searchService from '@/service/api/newretail/searchService'
import wxaUserService from '@/service/api/newretail/wxaUserService'
import couponService from '@/service/api/newretail/couponService'
import raffleService from '@/service/api/newretail/raffleService'
import seckillService from '@/service/api/newretail/seckillService'
import helpActivityService from '@/service/api/newretail/helpActivityService'
import systemService from '@/service/api/newretail/systemService'
import bargainService from '@/service/api/newretail/bargainService'
import orderService from '@/service/api/newretail/orderService'
import auth from '@/utils/newretail/auth'
import UTILS from '@/utils/newretail/utils'
import NAVPAGE from '@/utils/newretail/navPage'
import FLY from '@/utils/newretail/fly'
import IMGAGESPATH from '@/utils/newretail/imagesPath'
import request from '@/service/api/newretail/request'
import mta from '@/libs/mta_analysis'
import ANALYSIS from '@/utils/newretail/analysis'
import themeManager from '@/utils/newretail/themeManager'
import bus from 'iny-bus'
import { ref, reactive, onBeforeMount, onMounted, onUnmounted } from 'vue'

// 获取应用实例
let page = null
let canAddToCart = true
const pageValue = {
  initialpurchasenumber: 1,
  imagesPath: IMGAGESPATH,
  userInfo: {},
  member: {},
  couponNum: '0',
  reserveBalance: '0',
  scoreBalance: '0',
  giftcardNum: '0',
  // 礼品卡数量
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
  },
  overlayStyle: 'background: rgba(255, 255, 255, 0.9);top:88rpx;',
  phone: false,
  donateCoupons: {},
  promotionAdsense: {},
  onPullDownRefresh: false,
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
  pageShow: false,
  refreshType: '',
  // 数据刷新类型 USER,STORE,ALL
  userRefresh: false, // 是否刷新用户信息
}
export default {
  data() {
    return {
      initialpurchasenumber: 1,
      imagesPath: IMGAGESPATH,
      userInfo: {},
      member: {},
      couponNum: '0',
      reserveBalance: '0',
      scoreBalance: '0',
      giftcardNum: '0',
      // 礼品卡数量
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
      },
      overlayStyle: 'background: rgba(255, 255, 255, 0.9);top:88rpx;',
      phone: false,
      donateCoupons: {},
      promotionAdsense: {},
      onPullDownRefresh: false,
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
      pageShow: false,
      refreshType: '',
      // 数据刷新类型 USER,STORE,ALL
      userRefresh: false, // 是否刷新用户信息
    }
  },
  mixins: [],
  props: {
    ownModule: {
      // 属性名
      type: String,
      value: 'homePage',
    },
  },
  // 页面全局的数据，不用于页面渲染
  customData: {
    hasLuckyDraw: false,
    hasLuckyDrawQuery: false,
    hasUserDraw: false,
    hasOfficialAccountQuery: false,
  },
  onBeforeMount: function () {},
  onUnmounted: function () {
    // 页面销毁时执行
    console.info('Page unloaded!')
    if (this.show.official) {
      // 关掉提示关注公众号弹窗
      this.setData({
        'show.official': false,
      })
    }
    console.log('index inter background')
    this.indexInterBackground = true
    this.isNeedGetUnvisitedCoupon = true
    this.clearPayCodeTimeout()
    getApp().globalData.payCodeOrder = {
      count: 0,
      component: null,
    }
    getApp().globalData.cacheOrder = {
      count: 0,
      component: null,
    }
  },
  onMounted: function () {
    this.preloadingPage()
    page = UTILS.utilGetCurrentPage()
    app = getApp()
    this.setData({
      navHeight: getApp().globalData.navHeight,
      vipGradeConfig: getApp().globalData.systemConfigure.vipGradeConfig,
      themeColor:
        app &&
        getApp().globalData &&
        getApp().globalData.uiconfig &&
        getApp().globalData.uiconfig.themeColor
          ? getApp().globalData.uiconfig.themeColor
          : uni.getStorageSync('themeColor'),
    })
    new getApp().globalData.addToCart()
  },
  methods: {
    setData(valueObj) {
      const keyList = Object.keys(valueObj)
      keyList.forEach((key) => {
        pageValue[key] = valueObj[key]
      })
    },
    /**
     * 登录事件
     */
    getUserInfo: function (e) {
      const that = this
      uni.showLoading({
        title: '',
      })
      wxaUserService
        .login(true)
        .then((res) => {
          uni.hideLoading()
          console.log(res)
          auth.setUser(res)
          getApp().globalData.userInfo = res && res.member ? res : null
          if (!res.member) {
            that.setData({
              isMember: false,
              userInfo: res.wxaUser,
              hasUserInfo: true,
              member: {
                couponNum: 0,
              },
            })
            NAVPAGE.toAuthorize()
          } else {
            auth.getDistributor()
            auth.bindDistribution()
            that.setData({
              member: {
                ...that.member,
                ...res.member,
                nickName: res.member.nickName ? res.member.nickName : res.wxaUser.nickName,
              },
              isMember: true,
              userInfo: {
                ...res.wxaUser,
              },
              hasUserInfo: true,
            })
            // 刷新会员信息
            that.getMemberUserInfo()
            if (getApp().globalData.storeInfo) {
              that.recordVisitStore(getApp().globalData.storeInfo.id)
            }
            uni.setStorage({
              key: 'wj_member',
              data: res.member,
            })
          }
          that.$emit('refresh', {
            detail: 'USER',
          })
          that.getMemberGrade()
          that.checkUserInfo()
          that.getluckDraw(that.storeId)
        })
        .catch((err) => {
          uni.hideLoading()
          console.log(err)
          const msg = 'meet frequency limit'
          const authorize = 'auth deny'
          const errMsg = err.message
          this.setData({
            isMember: false,
            hasUserInfo: false,
          })
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
    },
    // 获取缓存的用户信息
    getMemberUserInfo: function () {
      const that = this
      const user = getApp().globalData.userInfo
      console.log('当前用户信息----------------')
      console.log(user)
      if (user) {
        this.setData({
          userInfo: {
            ...that.userInfo,
            ...user.wxaUser,
          },
          userRefresh: true,
        })
        if (user.member) {
          this.setData({
            hasUserInfo: true,
            isMember: true,
            member: {
              ...that.member,
              ...user.member,
            },
          })
          console.log('是否开启顶部会员区', this.isHomeShowTopMember)
          console.log('是否开启中部会员区', this.hasMemberModule)
          if (this.hasMemberModule || this.isHomeShowTopMember) {
            setTimeout(() => {
              console.log('getMbrCode--------------------------------')
              this.getMbrCode()
            }, 1000)
          }
          this.getUIconfig()
          if (this.storeId) {
            // this.getShopCart(this.data.storeId)
            const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
            this.setData({
              shopCart: localShopingCart.items,
              shopCartGoodsId: localShopingCart.goodsId,
            })
          }
        }
      }
    },
    /**
     * 获取会员码
     */
    getMbrCode: function () {
      const that = this
      if (!this.uiconfig && getApp().globalData.uiconfig) {
        this.setData({
          uiconfig: getApp().globalData.uiconfig,
        })
      }
      if (!(getApp().globalData.userInfo && getApp().globalData.userInfo.member)) {
        // 没有登录，跳出
        return
      }
      console.log(that.id)
      if (that && that.id !== 'middle-member' && that.id !== 'top-member') {
        // 当前组件不是顶部会员组件和中部会员组件
        return
      }
      clearTimeout(this.payCodeTime)
      memberService
        .getMbrCode()
        .then((res) => {
          if (UTILS.isHideLoading()) {
            UTILS.setHideLoading(false)
            uni.hideLoading()
          }
          if (that.indexInterBackground) {
            // 如果首页已隐藏退出
            return
          }
          let codeType = 'BARCODE' // 默认会员码 BARCODE 二码合一付款码 PAYCODE
          console.log(res)
          res.code = res.code ? res.code : getApp().globalData.userInfo.member.mobile
          if (res.expiresInSeconds && codeType === 'BARCODE') {
            codeType = 'PAYCODE'
          }
          this.setData({
            memberCode: res.code,
          })
          that.setCanvas(res.code)
          if (codeType !== 'BARCODE') {
            this.setData({
              memberId: res.code,
              codeType,
            })
            if (res.expiresInSeconds) {
              const expiresInSecondsTime = res.expiresInSeconds * 1000
              const time = setTimeout(() => {
                UTILS.setHideLoading(true)
                that.getMbrCode()
                console.log('刷新了')
              }, expiresInSecondsTime)
              that.setData({
                payCodeTime: time,
              })
            }
          }
          console.log('before getCacheOrder ===================================================')
          that.getCacheOrder()
        })
        .catch((err) => {
          if (UTILS.isHideLoading()) {
            UTILS.setHideLoading(false)
            uni.hideLoading()
          }
          if (err.message != null) {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000,
            })
          }
        })
    },
    /**
     * 设置会员码
     */
    setCanvas: function (code) {},
    // 功能入口点击事件
    clickFunctionEntry: function (e) {
      console.log(e)
      const linkmodel = e.currentTarget.dataset.linkmodel
      const route = e.currentTarget.dataset.route
      console.log(route, 'route', linkmodel)
      // 扫码购
      if (linkmodel == 'scancode_buy') {
        this.scanProductCode()
      } else if (linkmodel == 'sign_in') {
        // this.setData({
        //     signShow: true
        //   })
        NAVPAGE.toSign()

        // // 处理签到事件
        // this.memberSignIn()
      } else if (linkmodel == 'gift_card') {
        this.toGiftCard()
      } else if (
        linkmodel === 'grab_activity' ||
        linkmodel === 'teambuying_activity' ||
        linkmodel === 'product_menu' ||
        linkmodel === 'advance_sell'
      ) {
        navigateTo(route)
      } else if (linkmodel === 'external_url') {
        // 链接
        const url = route
        const index = '?'
        let webUrl = url
        if (url.indexOf(index) > -1) {
          webUrl = webUrl + '&storeId=' + this.storeId + '&type=normal'
          if (getApp().globalData.TENANT && webUrl.indexOf('tenant') < 0) {
            webUrl = webUrl + '&tenant=' + getApp().globalData.TENANT
          }
        }
        const urlData = {
          url: encodeURIComponent(webUrl),
        }
        console.log(webUrl, urlData)
        const jsonUrl = JSON.stringify(urlData)
        const opts = '?webUrl=' + jsonUrl
        console.log('opts', opts)
        NAVPAGE.toAdvertising(opts)
      } else if (linkmodel === 'card_recharge') {
        const wxApp = route
        uni.navigateToMiniProgram({
          appId: wxApp.appid,
          path: `${wxApp.jumpPage}?${wxApp.jumpParameter}`,
          // extraData: {
          //   foo: 'bar'
          // },
          // envVersion: 'develop',
          success(res) {
            console.log('跳转成功')
          },
          fail() {
            console.log('跳转失败')
          },
        })
      } else if (linkmodel === 'back_cash_product') {
        if (getApp().globalData.isShoppingGuide) {
          NAVPAGE.toGuideGoods()
        } else {
          NAVPAGE.toGuideApplyInfo()
        }
      } else if (linkmodel === 'live_room') {
        // 直播大厅
        NAVPAGE.toLivePlayerCenter()
      } else if (linkmodel === 'self_delivery') {
        NAVPAGE.toSefl()
      } else if (linkmodel === 'benefit_plan') {
        NAVPAGE.toBenefitPlan()
      } else if (linkmodel === 'meituan_xiaoxiang') {
        NAVPAGE.toMeituan()
      } else if (linkmodel === 'tourism_plan') {
        // let opts = '?id=' + route.tourismPlanId;
        // NAVPAGE.toTourismPlan(opts)
        uni.navigateTo({
          url: route,
        })
      } else {
        if (this.hasUserInfo && this.isMember) {
          navigateTo(route)
        } else {
          NAVPAGE.toAuthorize()
        }
      }
      function navigateTo(route) {
        if (route != null && route !== '') {
          uni.navigateTo({
            url: route,
            fail(res) {
              console.log(res)
              // 处理tabbar页面跳转
              if (res.errMsg.indexOf('tabbar') > 0 || res.errMsg.indexOf('tab bar') > 0) {
                const options = urlToObj(route)
                if (options.categoryId != null && options.categoryId !== '') {
                  getApp().globalData.categoryId = options.categoryId
                  uni.switchTab({
                    url: route,
                  })
                } else {
                  uni.switchTab({
                    url: route,
                  })
                }
              }
            },
          })
        }
      }
      function urlToObj(str) {
        const obj = {}
        if (str != null && str.indexOf('?') >= 0) {
          const params = str.split('?')[1].split('&')
          params.map((v) => (obj[v.split('=')[0]] = v.split('=')[1]))
        }
        return obj
      }
    },
    /**
     * 签到相关
     */
    memberSignIn: function () {
      // this.setData({
      //   signShow: true
      // })
      NAVPAGE.toSign()
    },
    handleMemberSignInClose: function () {
      this.setData({
        signShow: false,
      })
    },
    /**
     * 签到相关(主题活动)
     */
    memberSignInByActivity: function () {
      this.setData({
        themeSignShow: true,
      })
    },
    handleMemberSignInCloseByActivity: function () {
      this.setData({
        themeSignShow: false,
      })
    },
    scanProductCode: function () {
      const that = this
      uni.scanCode({
        success(res) {
          console.log(res)
          that.getProductByBarCode(res.result)
        },
      })
    },
    getProductByBarCode: function (barCode) {
      const that = this
      productService
        .queryProduct(barCode)
        .then((res) => {
          if (res.records == null || res.records.length == 0) {
            console.log('没有获取到商品数据')
            return
          }
          const product = res.records[0]
          //   let productId = val.detail.target.dataset.id;
          // let business = val.detail.target.dataset.business;
          // let balance = val.detail.target.dataset.balance;
          // let grabActivityId = val.detail.target.dataset.grabactivityid;
          // let style = val.detail.target.dataset.style;
          // var val = {}
          // val["detail"]["target"]["dataset"] = dataset
          const val = {
            detail: {
              target: {
                dataset: {
                  id: product.id,
                  business: product.business,
                  balance: 1000,
                },
              },
            },
          }
          that.handleAddShopCart(val)
        })
        .catch((err) => {})
    },
    // 跳转到新品页面
    moreNewGoods: function () {
      NAVPAGE.toNewGoods()
    },
    /**
     * 初始化页面内容，调用各模块接口，填充页面数据
     */
    initPage: function () {
      if (!getApp().globalData.storeInfo) {
        // 没有当前门店退出
        return
      }
      // 更新页面门店相关数据，显示当前门店
      const storeInfo = getApp().globalData.storeInfo
      let distance = null
      if (storeInfo.userLatitude != null && storeInfo.userLongitude != null) {
        distance = UTILS.distance(
          storeInfo.userLatitude,
          storeInfo.userLongitude,
          storeInfo.latitude,
          storeInfo.longitude,
        )
        distance = distance.toFixed(3)
      } else if (storeInfo.distance && storeInfo.distance != null) {
        distance = parseFloat(storeInfo.distance).toFixed(3)
      }
      getApp().globalData.storeInfo = {
        ...storeInfo,
        distance: distance || '***',
      }
      this.setData({
        storeInfo: getApp().globalData.storeInfo,
        storeId: getApp().globalData.storeInfo.id,
      })
      const that = this
      if (that.storeId === '' || that.storeId == null) {
        return
      }
      // 统计PV
      ANALYSIS.PVStatistics(that.storeId)
      if (getApp().globalData.systemConfigure.showCartModule) {
        // 获取用户的购物车数据
        this.getShopCart(that.storeId)
      }
    },
    /**
     * 预加载页面部分和门店无关内容
     */
    preloadingPage: function () {
      // 获取UI配置
      this.getUIconfig()
    },
    /**
     * 首页弹窗处理
     * 此处统一处理首页弹窗事件
     */
    handleIndexPopup: function () {
      const that = this
      // 如果关注公众号组件加载还未出结果，退出事件
      if (
        !getApp().globalData.isOfficialAccountQueryLoadCount ||
        !that.customData.hasOfficialAccountQuery ||
        that.show.official
      ) {
        return
      }
      // 微信已经不允许强制用户授权
      // 判断是否开启极速登录
      // if (getApp().globalData.isMiNiAppMustAccreditQueryCount === 0) {
      //   systemService.query("isMiNiAppMustAccredit").then(res => {
      //     getApp().globalData.isMiNiAppMustAccreditQueryCount = 1
      //     if (res == null) {
      //       handlePopupEvents();
      //       return;
      //     }
      //     if (res.length > 0 && res[0].value != null && res[0].value !== "") {
      //       res = res[0].value === "true" || res[0].value === "TRUE" || res[0].value === true
      //       getApp().globalData.systemConfigure.isMiNiAppMustAccredit = res
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
        if (
          getApp().globalData.systemConfigure.isMiNiAppMustAccredit &&
          getApp().globalData.show.login
        ) {
          // 开启了极速登录且已弹出授权框
        } else {
          // 如果已经注册会员，就查未读的券，否则就查是否有新用户弹窗
          if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
            // 获取未读的券
            that.getUnVisitedCoupons()
          } else {
            // 查询是否有新用户广告
            if (that.storeId) {
              that.getNewMemberAd(that.storeId)
            }
          }
        }
      }
    },
    // 跳转到商品详情页面
    toGoodsDetail: function (val) {
      if (val.detail && val.detail.currentTarget) {
        val.currentTarget.dataset = val.detail.currentTarget.dataset
      }
      console.log(val.currentTarget.dataset.productid, '物品详情')
      let opts =
        '?productId=' +
        val.currentTarget.dataset.productid +
        '&storeId=' +
        this.storeId +
        '&type=' +
        val.currentTarget.dataset.type
      if (val.currentTarget.dataset.type === 'secondkill') {
        opts = opts + '&activityId=' + val.currentTarget.dataset.activityid
      }
      if (val.currentTarget.dataset.traceid != null) {
        opts = opts + '&traceId=' + val.currentTarget.dataset.traceid
      }
      if (val.currentTarget.dataset.easyscene != null) {
        opts = opts + '&easyScene=' + val.currentTarget.dataset.easyscene
      }
      // if (val.currentTarget.dataset.type === 'secondkill' && this.data.grabData.grabStatus !== 'started') {
      //   wx.showToast({
      //     title: "当前秒杀活动不是进行中的~",
      //     icon: 'none',
      //     duration: 2000
      //   })
      // } else {
      NAVPAGE.toGoodsDetails(opts)
      // }
    },
    // 跳转到领券中心页面
    toCouponCenter: function () {
      NAVPAGE.toCouponCenter()
    },
    // 跳转到礼品卡界面
    toGiftCard: function () {
      NAVPAGE.toGiftCardCenter()
    },
    // 跳转到会员卡页面
    toMemberCard: function (e) {
      if (this.hasUserInfo && this.isMember) {
        // 如果首页开启付款码，则不到会员码页面，点击直接跳转付款码页面
        if (this.uiconfig.isHomePayCodeEnabled) {
          NAVPAGE.toPayCode()
        } else {
          NAVPAGE.toMemberCard()
        }
      } else {
        NAVPAGE.toAuthorize()
      }
    },
    toPayCode: function () {
      if (this.isMember) {
        NAVPAGE.toPayCode()
      } else {
        NAVPAGE.toAuthorize()
      }
    },
    // banner跳转
    bannerJumping: function (e) {
      console.log(e)
      const that = this
      const bannerId = e.currentTarget.dataset.id
      const dataItem = e.currentTarget.dataset.item
      const bannerList = that.banners
      let advertisementInfo = null
      bannerList.forEach((item) => {
        if (item.id === bannerId) {
          advertisementInfo = item
        }
      })
      that.toAdPage(dataItem || advertisementInfo, 'banner')
    },
    // 活动图（三分图）跳转
    activityJumping: function (e) {
      const that = this
      const bannerId = e.currentTarget.dataset.id
      const activityList = that.activityList
      let advertisementInfo = null
      activityList.forEach((item) => {
        item.imageItems.forEach((ele) => {
          if (ele.id === bannerId) {
            advertisementInfo = ele
          }
        })
      })
      console.log(e, 'eeeeeeeee')
      if (
        e.currentTarget.dataset.item.grabActivityIdList &&
        e.currentTarget.dataset.item.grabActivityIdList.length > 0
      ) {
        that.toAdPage(
          advertisementInfo,
          'activity',
          JSON.stringify(e.currentTarget.dataset.item.grabActivityIdList),
        )
      } else {
        that.toAdPage(advertisementInfo, 'activity')
      }
    },
    // 活动图（三分图）跳转
    activityJumping2: function (e) {
      const that = this
      if (
        e.currentTarget.dataset.item.grabActivityIdList &&
        e.currentTarget.dataset.item.grabActivityIdList.length > 0
      ) {
        that.toAdPage(
          e.currentTarget.dataset.item,
          'activity',
          JSON.stringify(e.currentTarget.dataset.item.grabActivityIdList),
        )
      } else {
        that.toAdPage(e.currentTarget.dataset.item, 'activity')
      }
    },
    // 前往广告页
    toAdPage: function (pageInfo, pageType, data) {
      const that = this
      console.log(pageInfo.linkType, 'pageInfo.linkType')
      if (pageInfo.linkType === 'APP') {
        // 应用
        // 判断跳转模块
        if (pageInfo.appReturnType === 'PRODUCT_MENU') {
          // 跳转商品分类页面
          NAVPAGE.toCategory(
            '?categoryId=' + pageInfo.productMenuId + '&shipmentTypes=' + pageInfo.shipmentTypes,
          )
        } else if (pageInfo.appReturnType === 'MIAOSHA') {
          if (data) {
            NAVPAGE.toSeckill('?grabActivityIdList=' + data)
          } else {
            NAVPAGE.toSeckill()
          }
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
          if (this.uiconfig.isHomePayCodeEnabled) {
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
          if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
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
          if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
            NAVPAGE.toPennyList()
          } else {
            NAVPAGE.toAuthorize()
          }
        } else if (pageInfo.appReturnType === 'RECHARGE_DRAW') {
          // 充值抽奖
          if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
            NAVPAGE.toLotteryIndex()
          } else {
            NAVPAGE.toAuthorize()
          }
        } else if (pageInfo.appReturnType === 'NOTICE') {
          // 系统公告
          NAVPAGE.toSysNotice()
        } else if (pageInfo.appReturnType === 'LIVEROOM') {
          NAVPAGE.toLivePlayerCenter()
        } else if (pageInfo.appReturnType === 'SOLITAIRE') {
          NAVPAGE.toSolitaireList()
        } else if (pageInfo.appReturnType === 'SIGN_IN') {
          console.log(pageInfo)
          that.memberSignInByActivity()
        } else if (pageInfo.appReturnType === 'PACKAGING') {
          // 打包一口价
          if (pageInfo.packagingId != null) {
            const opts = '?packagingId=' + pageInfo.packagingId
            NAVPAGE.toPackaging(opts)
          }
        } else if (pageInfo.appReturnType === 'SELFDELIVERY') {
          NAVPAGE.toSefl()
        } else if (pageInfo.appReturnType === 'CYCLE') {
          uni.navigateTo({
            url: '/pages-sub/newretail/pages/mallModule/activity/cycle/cycle',
          })
        } else if (
          pageInfo.appReturnType === 'SERVICEPRODUCT' ||
          pageInfo.appReturnType === 'SERVICESTAFF'
        ) {
          // 服务相关页面
          NAVPAGE.toServiceList(pageInfo.appReturnType)
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
          pageInfo.grabProductId +
          '&storeId=' +
          getApp().globalData.storeInfo.id +
          '&activityId=' +
          pageInfo.grabActivityId +
          '&type=secondkill'
        NAVPAGE.toGoodsDetails(opts)
      } else if (pageInfo.linkType === 'PRODUCT') {
        that.verifyGoods(getApp().globalData.storeInfo.id, pageInfo.productId, 'normal')
        // 商品
        // let opts = '?productId=' + pageInfo.productId + '&storeId=' + getApp().globalData.storeInfo.id + '&type=normal'
        // NAVPAGE.toGoodsDetails(opts)
      } else if (pageInfo.linkType === 'TEAMPRODUCT') {
        // 拼团商品
        const opts =
          '?productId=' +
          pageInfo.teamActivityId +
          '&storeId=' +
          getApp().globalData.storeInfo.id +
          '&type=group'
        NAVPAGE.toGoodsDetails(opts)
      } else if (pageInfo.linkType === 'GIFTCARDACTIVITYDETAILS') {
        // 如果跳转类型是礼品卡详情，根据giftcardActivityId跳转到礼品卡详情页
        const opts = '?giftCardActivityId=' + pageInfo.giftcardActivityId
        NAVPAGE.toGiftCardBuy(opts)
      } else if (pageInfo.linkType === 'COUPONACTIVITYDETAILS') {
        if (getApp().globalData.userInfo) {
          if (getApp().globalData.userInfo.member) {
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
          webUrl = webUrl + '&storeId=' + this.storeId + '&type=normal'
          if (getApp().globalData.TENANT && webUrl.indexOf('tenant') < 0) {
            webUrl = webUrl + '&tenant=' + getApp().globalData.TENANT
          }
        }
        const urlData = {
          url: encodeURIComponent(webUrl),
        }
        console.log(webUrl, urlData)
        const jsonUrl = JSON.stringify(urlData)
        const opts = '?webUrl=' + jsonUrl
        NAVPAGE.toAdvertising(opts)
      } else if (pageInfo.linkType === 'SCORE_RAFFLE') {
        if (pageInfo.raffleActivityId) {
          const opts = '?raffleActivityId=' + pageInfo.raffleActivityId
          NAVPAGE.toRaffle(opts)
        }
      } else if (pageInfo.linkType === 'WX_APP') {
        uni.navigateToMiniProgram({
          appId: 'wxe6afc8564bc6f7de',
          path: 'pages/mallModule/index/index/index',
        })
      } else if (pageInfo.linkType === 'SIGN_IN') {
        // that.setData({
        //     signShow: true
        //   })
        NAVPAGE.toSign()
      } else if (pageInfo.linkType === 'BENEFIT_PLAN') {
        NAVPAGE.toBenefitPlan()
      } else if (pageInfo.linkType === 'MEITUAN_XIAOXIANG') {
        NAVPAGE.toMeituan()
      } else if (pageInfo.linkType === 'TOURISM_PLAN') {
        const opts = '?id=' + pageInfo.tourismPlanId
        NAVPAGE.toTourismPlan(opts)
      } else if (
        pageInfo.linkType === 'SCOREMALL' ||
        pageInfo.linkType === 'SCORECOUPON' ||
        pageInfo.linkType === 'SCOREGOODS' ||
        pageInfo.linkType === 'THIRDPARTYCOUPIN'
      ) {
        const linkType = {
          SCOREMALL: 'score_mall',
          SCORECOUPON: 'score_coupon',
          SCOREGOODS: 'score_goods',
          THIRDPARTYCOUPIN: 'thirdParty_coupon',
        }
        const opts = '?link=' + linkType[pageInfo.linkType]
        NAVPAGE.toScoreMall(opts)
      } else if (pageInfo.linkType == 'SCANCODEBUY') {
        this.scanProductCode()
      } else if (pageInfo.linkType === 'BACKCASHPRODUCT') {
        if (getApp().globalData.isShoppingGuide) {
          NAVPAGE.toGuideGoods()
        } else {
          NAVPAGE.toGuideApplyInfo()
        }
      } else if (pageInfo.linkType === 'CARDRECHARGE') {
        uni.navigateToMiniProgram({
          appId: pageInfo.appid,
          path: `${pageInfo.jumpPage}?${pageInfo.jumpParameter}`,
          success(res) {
            console.log('跳转成功')
          },
          fail() {
            console.log('跳转失败')
          },
        })
      } else if (pageInfo.linkType === 'MERCHANT_CATEGORY') {
        NAVPAGE.toSearch(pageInfo.pageParmas)
      } else if (pageInfo.linkType === 'STORE_DETAIL') {
        NAVPAGE.toStoreDetail(pageInfo.pageParmas)
      } else if (pageInfo.pageUrl) {
        uni.navigateTo({
          url: pageInfo.pageUrl,
        })
      }
    },
    // 跳转商品详情首先验证商品是否上架
    verifyGoods(storeId, productId, type) {
      productService
        .getDetails(storeId, productId)
        .then((res) => {
          if (res) {
            // 商品
            const opts =
              '?productId=' +
              productId +
              '&storeId=' +
              getApp().globalData.storeInfo.id +
              '&type=' +
              type
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
    },
    // 获取搜索关键字
    getSearchKeyword: function () {
      searchService.query().then((res) => {
        console.log(res)
        if (res.length > 0) {
          const searchText = res[0].keyword
          const tempArray = []
          for (let i = 0; i < res.length; i++) {
            tempArray[i] = res[i]
          }
          const newKeyword = tempArray.shift()
          this.setData({
            searchText,
            keywords: tempArray,
          })
        } else {
          this.setData({
            keywords: res,
          })
        }
      })
    },
    // 点击切换门店
    changeStore: function () {
      NAVPAGE.toSelectStore()
    },
    // 检查当前用户是否登录授权
    checkAuth: function () {
      console.log(getApp(), 'globalDataglobalData')
      try {
        if (!getApp().globalData.userInfo) {
          return false
        } else {
          return true
        }
      } catch (e) {
        console.log('CatchClause', e)
        console.log('CatchClause', e)
      } // Do something when catch error
    },
    // 记录会员访问门店
    recordVisitStore: function (storeId) {
      if (getApp().globalData.systemConfigure.enableRecordVisitStore) {
        memberService
          .visitStore(storeId)
          .then((res) => {
            console.log(res)
          })
          .catch((e) => {
            console.log(e.message)
          })
      }
    },
    // 跳转到商品详情页面
    toProductDetail: function (e) {
      let opts = ''
      let n = 0
      for (const t in e) {
        opts = n === 0 ? opts + '?' + t + '=' + e[t] : opts + '&' + t + '=' + e[t]
        n++
      }
      NAVPAGE.toGoodsDetails(opts)
    },
    onClickGoods: function (val) {
      if (!val.detail) {
        val.detail = {
          ...val,
        }
      }
      const e = {
        productId: val.detail.productid,
        type: val.detail.type,
        lastPage: 'home',
        storeId: val.detail.storeid,
      }
      this.toProductDetail(e)
    },
    addToCart: function (e) {
      const i = e.detail.context
      this.i = i
      this.setData({
        initialpurchasenumber: e.detail.target.dataset.initialpurchasenumber || null,
      })
      this.addShopcart(e.detail)
    },
    addToCartAnimateTest: function (e) {
      const that = this
      const i = this.i
      const t = new Date().getTime()
      const o = that.ctime
      if (!(o != 'undefined' && t - o < 800)) {
        that.setData({
          ctime: t,
        })
        const n = getApp().globalData.systemInfo
        const r = (n.windowWidth / 8) * 5
        const s = n.windowHeight + 20
        try {
          if (e.detail.target.dataset.addtype === 'three') {
            // 三分图商品
            page.addcart.animateAddToCart('.gm-small-goods-img', r, s, i)
          } else {
            // 常规商品
            page.addcart.animateAddToCart('.gm-goods-img', r, s, i)
          }
        } catch (error) {
          console.log('CatchClause', error)
          console.log('CatchClause', error)
          console.log(error)
          new getApp().globalData.addToCart()
          if (e.detail.target.dataset.addtype === 'three') {
            // 三分图商品
            page.addcart.animateAddToCart('.gm-small-goods-img', r, s, i)
          } else {
            // 常规商品
            page.addcart.animateAddToCart('.gm-goods-img', r, s, i)
          }
        }
      }
    },
    noop: function (e) {
      // console.log(e)
    },
    addShopcartCatch: function (val) {
      this.addShopCartData = val
    },
    /**
     * 加入购物车
     * @param {object} val
     */
    addShopcart: function (val) {
      if (!canAddToCart) {
        return false
      }
      canAddToCart = false
      const that = this
      console.log(val)
      if (!val.detail) {
        val.detail = {
          ...val,
        }
      }
      mta.Event.stat('eventaddcart', {
        // storeid: that.storeId,
        storeid: val.detail.target.dataset.storeid || that.storeId,
        productid: val.detail.target.dataset.id,
      })
      if (val.detail.target.dataset.grabtype && val.detail.target.dataset.grabtype === 'SPEC') {
        // 多规格秒杀商品跳转商品详情
        const grabActivityId = val.detail.target.dataset.grabactivityid
        let opts =
          '?productId=' +
          val.detail.target.dataset.id +
          '&storeId=' +
          (val.detail.target.dataset.storeid || this.storeId) +
          '&source=addshopcart'
        if (grabActivityId != null) {
          opts = opts + '&activityId=' + grabActivityId + '&type=secondkill'
        } else {
          opts = opts + '&type=normal'
        }
        if (val.detail.target.dataset.traceid != null) {
          opts = opts + '&traceId=' + val.detail.target.dataset.traceid
        }
        if (val.detail.target.dataset.easyscene != null) {
          opts = opts + '&easyScene=' + val.detail.target.dataset.easyscene
        }
        NAVPAGE.toGoodsDetails(opts)
        canAddToCart = true
        return
      }
      if (val.detail.target.dataset.grabactivityid) {
        const productId = val.detail.target.dataset.id
        const grabActivityId = val.detail.target.dataset.grabactivityid
        const availableStockAmount = val.detail.target.dataset.availablestockamount
        let count = 0
        if (that.grabProducts[productId] != null) {
          count = parseInt(that.grabProducts[productId])
        }
        if (availableStockAmount > 0) {
          UTILS.setHideLoading(true)
          that.handleAddShopCart(val)
        } else {
          canAddToCart = true
          uni.showToast({
            title: '当前秒杀商品已抢完，看看别的商品吧~',
            icon: 'none',
            duration: 2000,
          })
        }
      } else {
        that.handleAddShopCart(val)
      }
    },
    /**
     * 处理添加购物车
     */
    handleAddShopCart: function (val) {
      const that = this
      const productId = val.detail.target.dataset.id
      let storeId = val.detail.target.dataset.storeid
      const business = val.detail.target.dataset.business
      let balance = val.detail.target.dataset.balance
      const grabActivityId = val.detail.target.dataset.grabactivityid
      const initialpurchasenumber = val.detail.target.dataset.initialpurchasenumber
      this.setData({
        initialpurchasenumber,
      })
      const traceId = val.detail.target.dataset.traceid
      const style = val.detail.target.dataset.style
      let hasSharingPersonId = false
      const mode = val.detail.target.dataset.type
      const loginStatus = this.checkAuth()
      if (style !== 'SPEC_PARENT' && style !== 'MEALS2') {
        if (loginStatus) {
          if (business === 'DISTRIBUTION') {
            try {
              const data = uni.getStorageSync('wj_distributionStore')
              if (data) {
                storeId = data.id
              }
            } catch (e) {
              console.log('CatchClause', e)
              console.log('CatchClause', e)
            }
          } else {
            storeId = val.detail.target.dataset.storeid || getApp().globalData.storeInfo.id
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
          if (getApp().globalData.isShoppingGuidanceRecordGoods) {
            // 获取分享人id
            const shareData = UTILS.getSharingPersonInfo()
            if (shareData && shareData != null && shareData.productId === productId) {
              postData.lists[0].sharingPersonId = shareData.shareId
              hasSharingPersonId = true
            }
          }
          if (grabActivityId != null) {
            postData = {
              storeId,
              lists: [
                {
                  count: initialpurchasenumber || 1,
                  grabActivityId,
                  productId,
                },
              ],
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
          const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
          if (business === 'DISTRIBUTION') {
            balance = 0
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
                if (style === 'MEALS') {
                  getCateringDetailsById(productId, storeId)
                } else {
                  if (mode === 'reduce') {
                    if (this.shopCart[productId] > 0) {
                      addGoods(balance)
                    } else {
                      canAddToCart = true
                    }
                  } else {
                    addGoods(balance)
                  }
                }
              })
              .catch((err) => {
                canAddToCart = true
              })
          } else if (
            (business === 'CATERING' || business === 'DISTRIBUTION') &&
            style === 'MEALS'
          ) {
            if (mode === 'reduce') {
              canAddToCart = true
            } else {
              getCateringDetailsById(productId, storeId)
            }
          } else {
            if (mode === 'reduce') {
              if (this.shopCart[productId] > 0) {
                addGoods(balance)
              } else {
                canAddToCart = true
              }
            } else {
              addGoods(balance)
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
                    count: that.initialpurchasenumber || 1,
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
                  addGoods(balance)
                } else {
                  canAddToCart = true
                }
              })
              .catch((err) => {
                canAddToCart = true
                if (err.message != null) {
                  uni.showToast({
                    title: err.message,
                    icon: 'none',
                    duration: 2000,
                  })
                }
              })
          }

          /**
           * 加入购物车
           * @param balance
           */
          function addGoods(balance) {
            if (getApp().globalData.userInfo.member) {
              if (balance === 0 || balance === null || balance === '') {
                uni.showToast({
                  title: '门店中该商品库存不足，请选购其他商品~',
                  icon: 'none',
                  duration: 2000,
                })
                canAddToCart = true
              } else {
                UTILS.setHideLoading(true)
                shopcartService
                  .cateringAdd(postData)
                  .then((res) => {
                    UTILS.setHideLoading(false)
                    getApp().globalData.isShopCartChange = true
                    if (getApp().globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
                      UTILS.removeSharingPersonInfo()
                    }
                    getApp().globalData.storeIdentification =
                      business === 'DISTRIBUTION' ? 'distribution' : 'normal'
                    if (mode === 'reduce') {
                      that.reduceLocalGoods(productId)
                    } else {
                      if (that.i && that.i !== void 0) {
                        that.addToCartAnimateTest(val)
                        that.addLocalGoods(productId)
                      } else if (that.addShopCartData == null) {
                        that.addLocalGoods(productId)
                      } else {
                        that.handleTouchOnGoods(that.addShopCartData)
                      }
                      const grabProducts = that.grabProducts
                      if (that.grabProducts[productId] != null) {
                        grabProducts[productId] =
                          parseInt(that.grabProducts[productId]) + (that.initialpurchasenumber || 1)
                      } else {
                        grabProducts[productId] = that.initialpurchasenumber || 1
                      }
                      that.setData({
                        grabProducts,
                      })
                    }
                    setTimeout(() => {
                      // 阻止连点
                      canAddToCart = true
                    }, 100)
                  })
                  .catch((err) => {
                    canAddToCart = true
                    UTILS.setHideLoading(false)
                    if (err.message != null) {
                      uni.showToast({
                        title: err.message,
                        icon: 'none',
                        duration: 2000,
                      })
                    }
                  })
              }
            } else {
              canAddToCart = true
              NAVPAGE.toAuthorize()
            }
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
        let opts = '?productId=' + productId + '&storeId=' + storeId + '&source=addshopcart'
        if (grabActivityId != null && this.grabData.grabStatus !== 'started') {
          opts = opts + '&type=secondkill'
        } else {
          opts = opts + '&type=normal'
        }
        if (traceId != null) {
          opts = opts + '&traceId=' + traceId
        }
        NAVPAGE.toGoodsDetails(opts)
      }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      const that = this
      this.setData({
        onPullDownRefresh: true,
      })
      this.onLoad(this.options)
      setTimeout(() => {
        // 特别处理iOS下有loading时下拉刷新秒回弹的问题
        uni.stopPullDownRefresh()
        that.setData({
          onPullDownRefresh: false,
        })
      }, 1000)
    },
    handleBanner: function (e) {
      this.setData({
        banners: e.detail,
      })
    },
    handleHotsGoods: function (e) {
      this.setData({
        fineQualityGoodsList: e.detail,
      })
    },
    // 获取登陆送券
    getLoginDonateCouponAdsense: function (storeId) {
      const that = this
      let hasShow = false
      const show = that.show
      for (const key in show) {
        if (show.hasOwnProperty(key)) {
          const ele = show[key]
          if (ele) {
            hasShow = true
          }
        }
      }
      if (hasShow) {
        // 有弹窗在显示
        return
      }
      if (this.onPullDownRefresh === false) {
        try {
          const value = uni.getStorageSync('wj_loginDonateCouponCount')
          if (value) {
            const tempTime = value.replace(/-/g, '/')
            const nowTime = new UTILS.ResponseDate().getTime()
            const time = new Date(tempTime).getTime()
            if (nowTime > time) {
              that.getLoginDonateCoupon(storeId)
            }
          } else {
            that.getLoginDonateCoupon(storeId)
          }
        } catch (error) {
          console.log('CatchClause', error)
          console.log('CatchClause', error)
          console.log(error)
        }
      }
    },
    // 调用接口获取登陆送券信息
    getLoginDonateCoupon: function (storeId) {
      const that = this
      // if (getApp().globalData.loginDonateCouponCount === 0) {
      //   bannerService.getStoreBannerList('LOGIN_DONATE_COUPON_ADSENSE', storeId).then(res => {
      //     if (res && res.length > 0) {
      //       getApp().globalData.loginDonateCouponCount = 1
      //       that.setData({
      //         donateCoupons: res[0]
      //       })
      //       that.toggleCouponPopup()
      //     } else {}
      //   })
      // }
    },
    clickAssignCoupon: function (e) {
      const that = this
      if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
        const coupons = this.donateCoupons
        const now = new UTILS.ResponseDate()
        const time = UTILS.formatTime(now).replace(/\//g, '-')
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
              UTILS.setHideLoading(true)
              // 登录送券不标为已读
              // let couponIds = []
              // couponIds.push(res)

              // couponService.visited(couponIds).then(result => {
              //   // console.log(result)
              //   if (i === couponsArr.length - 1) {
              //     UTILS.setHideLoading(false)
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
              UTILS.setHideLoading(false)
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
            if (that.show.coupon === true) {
              that.setData({
                'show.coupon': false,
              })
              uni.setStorageSync('wj_loginDonateCouponCount', tempTermValidity)
              // 查询未读券
              that.isNeedGetUnvisitedCoupon = true
              that.getUnVisitedCoupons()
            }
          } else {
            if (unReceivedCount === res.length) {
              if (that.show.coupon === true) {
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
                that.setData({
                  'show.coupon': false,
                })
              }
            }
          }
        })
      } else {
        NAVPAGE.toAuthorize()
      }
    },
    recorderPopup: function () {
      this.toggleBottomPopup()
    },
    /**
     * 获取抽奖结果
     */
    handleRaffleOutcome: function (e) {
      const that = this
      const raffleId = e.detail.outcome
      this.setData({
        raffleId,
      })
      const now = new UTILS.ResponseDate()
      const time = UTILS.formatTime(now).replace(/\//g, '-')
      const tempTimeArr = time.split(' ')
      const tempTermValidity = tempTimeArr[0] + ' 23:59:59'
      if (e.detail.status) {
        if (e.detail.raffleInfo) {
          this.setData({
            raffleInfo: e.detail.raffleInfo,
          })
          uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
          this.handleLuckDrawPopupClose(true)
          this.toggleluckDrawResultPopup()
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
              this.setData({
                raffleInfo,
              })
              uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
              this.handleLuckDrawPopupClose(true)
              this.toggleluckDrawResultPopup()
            })
            .catch((err) => {
              if (err.message != null) {
                uni.showToast({
                  title: err.message,
                  icon: 'none',
                  duration: 2000,
                })
              }
            })
        }
      } else {
        if (e.detail.error) {
          const err = e.detail.error
          if (err.code === 41004) {
            that.setData({
              hasRaffleCoupon: false,
            })
            this.handleLuckDrawPopupClose(true)
            this.toggleluckDrawResultPopup()
            uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
          } else {
            this.handleLuckDrawPopupClose(true)
            uni.setStorageSync('wj_luckyDrawRecordTime', tempTermValidity)
          }
        }
      }
    },
    handleRaffleCash: function () {
      // 分享回调已经被封掉，接收不到，关闭弹窗操作放到兑奖操作中
      this.toggleluckDrawResultPopup()
      // 兑奖后查询登陆送券活动
      this.getLoginDonateCouponAdsense(this.storeId)
    },
    // 获取抽奖活动
    getluckDraw: function (storeId) {
      console.log('====================getluckDraw')
      const that = this
      if (this.onPullDownRefresh === false) {
        try {
          const value = uni.getStorageSync('wj_luckyDrawRecordTime')
          if (value) {
            const tempTime = value.replace(/-/g, '/')
            const nowTime = new UTILS.ResponseDate().getTime()
            const time = new Date(tempTime).getTime()
            if (nowTime > time) {
              if (getApp().globalData.luckyDrawPopupCount === 0) {
                queryLuckDraw(storeId)
              }
            } else {
              this.getLoginDonateCouponAdsense(storeId)
            }
            console.log(tempTime, time)
          } else {
            if (getApp().globalData.luckyDrawPopupCount === 0) {
              queryLuckDraw(storeId)
            } else {
              this.getLoginDonateCouponAdsense(storeId)
            }
          }
        } catch (error) {
          console.log('CatchClause', error)
          console.log('CatchClause', error)
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
        if (that.show.luckDraw || that.show.luckDrawPopup) {
          // 弹窗已经弹出
          if (getApp().globalData.userInfo) {
            const postData = {
              storeId,
              activityId: that.raffleActivityId,
              wxaOpenid: getApp().globalData.userInfo.wxaUser.openId,
            }
            raffleService
              .create(postData)
              .then((res) => {
                that.setData({
                  raffleId: res,
                })
              })
              .catch((err) => {
                console.log('创建分享抽奖id报错：', err.message)
                that.getLoginDonateCouponAdsense(storeId)
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
              that.getLoginDonateCouponAdsense(storeId)
              return
            }
            that.setData({
              raffleActivityId: res.id,
              raffleType: res.raffleType,
            })
            that.customData.hasLuckyDraw = true
            that.isQueryLuckDraw = true
            const data = res
            // 调用接口创建抽奖获取抽奖id
            if (getApp().globalData.userInfo) {
              const postData = {
                storeId,
                activityId: that.raffleActivityId,
                wxaOpenid: getApp().globalData.userInfo.wxaUser.openId,
              }
              raffleService
                .create(postData)
                .then((res) => {
                  that.setData({
                    raffleId: res,
                  })
                  if (data.raffleType === 'LHJ') {
                    if (!that.show.adsense && !that.show.luckDraw && !that.show.luckDrawPopup) {
                      // 促销弹窗未弹出
                      that.toggleLuckDrawPopup(true)
                    }
                  } else if (data.raffleType === 'POPUP_WINDOWS') {
                    that.setData({
                      popupWindowImage: data.popupWindowImage,
                    })
                    // 弹窗抽奖
                    if (!that.show.adsense && !that.show.luckDraw && !that.show.luckDrawPopup) {
                      // 促销弹窗未弹出
                      that.togglePopupLuckDraw()
                    }
                  }
                })
                .catch((err) => {
                  console.log('创建分享抽奖id报错：', err.message)
                  that.getLoginDonateCouponAdsense(storeId)
                })
            } else {
              // 未登录需要弹出抽奖信息
              if (data.raffleType === 'LHJ') {
                if (!that.show.adsense && !that.show.luckDraw && !that.show.luckDrawPopup) {
                  // 促销弹窗未弹出
                  that.toggleLuckDrawPopup(true)
                }
              } else if (data.raffleType === 'POPUP_WINDOWS') {
                that.setData({
                  popupWindowImage: data.popupWindowImage,
                })
                // 弹窗抽奖
                if (!that.show.adsense && !that.show.luckDraw && !that.show.luckDrawPopup) {
                  // 促销弹窗未弹出
                  that.togglePopupLuckDraw()
                }
              }
            }
          })
          .catch((err) => {
            console.log(err.message)
            if (err.message != null) {
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000,
              })
            }
            // 查询登陆送券活动
            that.getLoginDonateCouponAdsense(storeId)
          })
      }
    },
    // 获取抽奖时用户是否是会员的结果
    getUserIsFans(e) {
      if (e.detail.isFans == false) {
        // 不是粉丝的处理
      } else {
        // 是粉丝的处理
        // 根据全局报错的用户信息检查用户信息
        this.checkUserInfo()
        this.getMemberGrade()
      }
    },
    /* 获取抽奖用户信息 */

    getLuckUserInfo: function (e) {
      // this.getUserInfo()
    },
    /**
     * 打开分享弹窗
     */
    toggleBottomPopup() {
      this.toggle('middle')
    },
    toggleCouponPopup: function (e) {
      this.toggle('coupon')
    },
    /**
     * 打开新用户注册弹窗
     */
    toggleRegistPopup: function (e) {
      if (e != null && e.type === 'submit') {
        this.getPromotionAdsense(this.storeId)
      }
      this.toggle('regist')
    },
    /**
     * 关闭新用户注册弹窗
     */
    toggleRegistPopupClose: function (e) {
      if (e != null && e.type === 'submit') {
        this.getPromotionAdsense(this.storeId)
      }
      this.setData({
        'show.regist': false,
      })
    },
    /**
     * 打开未读券弹窗
     */
    toggleUnvisitedCouponPopup: function (e) {
      this.toggle('unVisitedCoupon')
    },
    /**
     * 关闭未读券弹窗
     */
    handleUnvisitedCouponPopupClose: function (e) {
      this.setData({
        'show.unVisitedCoupon': false,
      })
    },
    /* 首页促销弹窗 */
    toggleAdsensePopup: function () {
      this.toggle('adsense')
    },
    /**
     * 首页促销弹窗点击关闭事件
     */
    handleAdsensePopupClose: function (e) {
      this.setData({
        'show.adsense': false,
      })
      console.log(this.show.adsense)
      // 查询是否有抽奖活动(登陆送券相关放在抽奖查询之后)
      console.log('查询是否有抽奖活动')
      this.getluckDraw(this.storeId)
    },
    toggleLuckDrawPopup() {
      const that = this
      that.toggle('luckDraw')
      if (this.isQueryLuckDraw) {
        this.isQueryLuckDraw = false
      } else {
        getApp().globalData.luckyDrawPopupCount = 1
      }
    },
    handleLuckDrawPopupClose(val) {
      const that = this
      const raffleInfo = this.raffleInfo
      const raffleInfoArr = raffleInfo ? Object.keys(raffleInfo) : 0
      if (val != null) {
        this.setData({
          'show.luckDraw': false,
        })
        if (this.isQueryLuckDraw) {
          this.isQueryLuckDraw = false
        } else {
          getApp().globalData.luckyDrawPopupCount = 1
        }
      } else {
        if (raffleInfoArr.length == 0 && this.show.luckDraw && this.customData.hasUserDraw) {
          getApp().globalData.luckyDrawPopupCount = 1
          uni.showModal({
            title: '温馨提示',
            content:
              '系统正在处理您的抽奖结果，如果中奖，奖品稍后将发放到您的账户，您可以在（我的->我的优惠券）中查看。',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                that.toggle('luckDraw')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            },
          })
          // 标记用户手动关闭了弹窗
          this.userCloseRaffle = true
        }
      }
    },
    /**
     * 打开弹窗抽奖
     */
    togglePopupLuckDraw(val) {
      this.toggle('luckDrawPopup')
    },
    handlePopupLuckDrawClose(val) {
      this.setData({
        'show.luckDrawPopup': false,
      })
    },
    toggleluckDrawResultPopup() {
      if (this.userCloseRaffle != null && this.userCloseRaffle === true) {
      } else {
        this.toggle('luckDrawResult')
      }
    },
    toggle(type) {
      this.setData({
        [`show.${type}`]: !this.show[type],
        [`overlayStyle`]: this.overlayStyle,
      })
    },
    addCateringMeals: function (e) {
      const meals = {
        show: true,
        productId: e.detail.productId,
        storeId: e.detail.storeId,
      }
      this.setData({
        meals,
      })
    },
    chooseOutcome: function (e) {
      console.log(e)
      if (e.detail.outcome === true) {
        this.setData({
          meals: {
            show: false,
            productId: '',
            storeId: '',
          },
        })
        this.handleTouchOnGoods(this.addShopCartData)
      } else {
      }
    },
    /**
     * 获取购物车数据
     * @param storeId 门店id
     */
    getShopCart: function (storeId) {
      const that = this
      if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
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
            that.setData({
              shopCart: tempShopCart,
              shopCartGoodsId: tempShopCartGoodsId,
              grabProducts,
            })
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
            } catch (e) {
              console.log('CatchClause', e)
              console.log('CatchClause', e)
            }
          })
          .catch((err) => {
            console.log('查询购物车失败')
            if (err.message != null) {
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000,
              })
            }
          })
        const localProductCount = uni.getStorageSync('wj_userProductsCount')
        const counts = String(localProductCount)
        if (counts) {
          getApp().globalData.setTabBarBadge('shopping_cart', counts)
        }
        shopcartService
          .getProductsCount()
          .then((res) => {
            getApp().globalData.setTabBarBadge('shopping_cart', String(res))
            try {
              uni.setStorageSync('wj_userProductsCount', res)
            } catch (e) {
              console.log('CatchClause', e)
              console.log('CatchClause', e)
            }
          })
          .catch((err) => {
            if (err.message != null) {
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000,
              })
            }
          })
      }
    },
    /**
     * 添加本地购物车
     * @param id 商品id
     */
    addLocalGoods: function (id) {
      try {
        // 读取缓存的商品总量和购物车数据
        const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
        let localProductCount = uni.getStorageSync('wj_userProductsCount')
        // 设置购物车中商品总数量
        localProductCount = Number(localProductCount)
        localProductCount++
        localProductCount = String(localProductCount)
        getApp().globalData.setTabBarBadge('shopping_cart', localProductCount)
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
            tempShopCart[_id] =
              Number(tempShopCart[_id]) +
              (this.initialpurchasenumber && this.initialpurchasenumber > Number(tempShopCart[_id])
                ? this.initialpurchasenumber - Number(tempShopCart[_id])
                : 1)
          } else {
            // 新增
            tempShopCartGoodsId.push(_id)
            tempShopCart[_id] = this.initialpurchasenumber || 1
          }
          this.setData({
            shopCart: tempShopCart,
            shopCartGoodsId: tempShopCartGoodsId,
          })
          const localData = {
            goodsId: tempShopCartGoodsId,
            items: tempShopCart,
          }
          uni.setStorageSync('wj_shopCartStorage', localData)
          this.$emit('addToCart')
          uni.showToast({
            title: '已加入购物车',
            icon: 'none',
            duration: 2000,
          })
        }
        uni.setStorageSync('wj_userProductsCount', localProductCount)
        // wx.setStorageSync('wj_shopCartStorage', tempShopCart)
      } catch (e) {
        console.log('CatchClause', e)
        console.log('CatchClause', e)
      } // Do something when catch error
      bus.emit('userShopCartChange', 'update')
      // setTimeout(() => {
      // }, 100);
    },
    /**
     * 减少本地购物车
     * @param id 商品id
     */
    reduceLocalGoods: function (id) {
      try {
        // 读取缓存的商品总量和购物车数据
        const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
        let localProductCount = uni.getStorageSync('wj_userProductsCount')
        // 设置购物车中商品总数量
        localProductCount = Number(localProductCount)
        localProductCount--
        localProductCount = String(localProductCount)
        getApp().globalData.setTabBarBadge('shopping_cart', localProductCount)
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
              this.initialpurchasenumber &&
              Number(tempShopCart[_id]) <= this.initialpurchasenumber
            ) {
              tempShopCart[_id] = this.initialpurchasenumber
            } else {
              tempShopCart[_id] = Number(tempShopCart[_id]) - 1
            }
            if (tempShopCart[_id] <= 0) {
              tempShopCartGoodsId.splice(index, 1)
            }
          }
          this.setData({
            shopCart: tempShopCart,
            shopCartGoodsId: tempShopCartGoodsId,
          })
          const localData = {
            goodsId: tempShopCartGoodsId,
            items: tempShopCart,
          }
          uni.setStorageSync('wj_shopCartStorage', localData)
        }
        uni.setStorageSync('wj_userProductsCount', localProductCount)
        // wx.setStorageSync('wj_shopCartStorage', tempShopCart)
      } catch (e) {
        console.log('CatchClause', e)
        console.log('CatchClause', e)
      } // Do something when catch error
      bus.emit('userShopCartChange', 'update')
    },
    /**
     * 处理添加购物车
     */
    handleTouchOnGoods: function (e) {
      const that = this
      let goodsBoxImage = ''
      this.setData({
        goodsBoxImage: '',
      })
      let addtype = e.target.dataset.addtype
      if (e != null) {
        if (e.target.dataset.addtype === 'normal') {
          // 首页精选
          const data = this.fineQualityGoodsList
          data.forEach((item) => {
            if (item.id === e.target.dataset.id) {
              goodsBoxImage = item.imageUrl
            }
          })
        } else if (e.target.dataset.addtype === 'three') {
          // 主题活动三分图
          // e.target.dataset.index 当前点击的商品在主题活动数组中是第几个
          const data = this.activityList[e.target.dataset.index]
          if (data.products && data.products.length > 0) {
            data.products.forEach((item) => {
              if (item.id === e.target.dataset.id) {
                goodsBoxImage = item.imageUrl
              }
            })
          }
        } else if (e.target.dataset.addtype === 'grab') {
          // 主题活动三分图
          // e.target.dataset.index 当前点击的商品在主题活动数组中是第几个
          const data = this.grabData.products
          if (data && data.length > 0) {
            data.forEach((item) => {
              if (item.productId === e.target.dataset.id) {
                goodsBoxImage = item.imageUrl
              }
            })
          }
          addtype = 'three'
        }
        this.setData({
          goodsBoxImage,
        })
        const touches = e.touches['0']
        FLY.touchOnGoods(addtype, touches, e.target.dataset.id).then((res) => {
          const animation = res
          that.setData({
            hide_good_box: false,
            bus_x: animation.finger.x,
            bus_y: animation.finger.y,
          })
          that.setData({
            animation: animation.animation,
          })
          setTimeout(() => {
            that.setData({
              hide_good_box: true,
            })
            that.addLocalGoods(e.target.dataset.id)
          }, animation.duration)
        })
      }
    },
    /**
     * 添加购物车动画
     */
    addShopcartAnimation: function (e) {
      const that = this
      const tempArr = Object.keys(e.detail.animation)
      if (e.detail.animation && tempArr.length > 0 && e.detail.goodsBoxImage !== '') {
        const animation = e.detail.animation
        that.setData({
          hide_good_box: false,
          bus_x: animation.finger.x,
          bus_y: animation.finger.y,
          goodsBoxImage: e.detail.goodsBoxImage,
        })
        that.setData({
          animation: animation.animation,
        })
        setTimeout(() => {
          that.setData({
            hide_good_box: true,
          })
          // self._addLocalGoods(e.target.dataset.id)
        }, animation.duration)
      }
    },
    // 检查用户信息
    checkUserInfo: function () {
      if (getApp().globalData.userInfo) {
        this.setData({
          hasUserInfo: true,
          userInfo: getApp().globalData.userInfo.wxaUser,
        })
        // 判断用户是否是会员
        if (getApp().globalData.userInfo.member) {
          const res = getApp().globalData.userInfo
          let isExpired = false
          let isVIP = false
          const now = new UTILS.ResponseDate().getTime()
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
            getApp().globalData.userInfo.member.vip = true
          }
          this.setData({
            isMember: true,
            member: res.member,
            isVIP,
            isExpired,
            vipEndTime,
          })
        }
      } else {
        this.setData({
          hasUserInfo: false,
          isMember: false,
          member: null,
          userInfo: null,
        })
      }
    },
    /**
     * 查询是否有新用户注册广告
     * @param {门店id} storeId
     */
    getNewMemberAd: function (storeId) {
      const that = this
      // 只有打开之后还未弹出过促销广告才会弹出（一次打开只会弹出一次）
      if (getApp().globalData.newMemberAdCount === 0) {
        bannerService.getStoreBannerList('NEWMEMBERADSENSE', storeId).then((res) => {
          if (res && res.length > 0) {
            that.setData({
              newMbrAdsense: res[0],
            })
            getApp().globalData.newMemberAdCount = 1
            that.toggleRegistPopup()
          } else {
            // 查询是否有促销活动
            that.getPromotionAdsense(that.storeId)
          }
        })
      } else {
        // 查询是否有抽奖活动(登陆送券相关放在抽奖查询之后)
        this.getPromotionAdsense(this.storeId)
      }
    },
    /* 查询促销广告 */
    getPromotionAdsense: function (storeId) {
      const that = this
      // 只有打开之后还未弹出过促销广告才会弹出（一次打开只会弹出一次）
      if (getApp().globalData.promotionAdsenseCount === 0) {
        bannerService.getStoreBannerList('PROMOTIONADSENSE', storeId).then((res) => {
          if (res && res.length > 0) {
            getApp().globalData.promotionAdsenseCount = 1
            that.setData({
              promotionAdsense: res[0],
            })
            that.toggleAdsensePopup()
          } else {
            // 查询是否有抽奖活动(登陆送券相关放在抽奖查询之后)
            that.getluckDraw(that.storeId)
          }
        })
      } else {
        // 查询是否有抽奖活动(登陆送券相关放在抽奖查询之后)
        this.getluckDraw(this.storeId)
      }
    },
    /* 促销广告跳转 */
    adsenseJumping: function (e) {
      if (getApp().globalData.userInfo && getApp().globalData.userInfo) {
        this.toggle('adsense')
        this.toAdPage(this.promotionAdsense, 'banner')
      } else {
        const pageInfo = this.promotionAdsense
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
    },
    onGetUserInfo: function (e) {
      this.getUserInfo(e.detail)
    },
    getUIconfig: function () {
      // 根据UI配置控制页面显示
      if (getApp().globalData.uiconfig) {
        this.renderingPageByUI()
      } else {
        systemService
          .queryGroup('UI')
          .then((res) => {
            getApp().globalData.uiconfig = UTILS.handleUIConfig(res)
            this.renderingPageByUI()
          })
          .catch((err) => {
            console.log('查询UI配置出错：' + err.message)
          })
      }
    },
    renderingPageByUI: function () {
      const uiconfig = getApp().globalData.uiconfig
      let isHomeShowTopSearch = true
      let isHomeShowTopMember = false
      let isHomeShowNearStore = false
      let isShowScorePayCode = false
      uiconfig.isHomeShowTopSearch === true
        ? (isHomeShowTopSearch = true)
        : (isHomeShowTopSearch = false)
      uiconfig.isHomeShowTopMember === true
        ? (isHomeShowTopMember = true)
        : (isHomeShowTopMember = false)
      uiconfig.isHomeShowNearStore === true
        ? (isHomeShowNearStore = true)
        : (isHomeShowNearStore = false)
      uiconfig.isShowScorePayCode === true
        ? (isShowScorePayCode = true)
        : (isShowScorePayCode = false)
      let afterShareToDraw = false
      if (uiconfig.afterShareToDraw) {
        afterShareToDraw = uiconfig.afterShareToDraw
      }
      this.setData({
        afterShareToDraw,
      })
      if (!getApp().globalData.systemConfigure.showScorePayCode) {
        isShowScorePayCode = false
      }
      this.setData({
        isHomeShowTopSearch,
        isHomeShowTopMember,
        isHomeShowNearStore,
        isShowScorePayCode,
        uiconfig,
      })
      if (!this.hasMemberModule) {
        console.log('getMbrCode--------------------------------')
        this.getMbrCode()
      }

      // 如果开启顶部会员区  根据 topMemberEntrance 查询接口显示会员相关信息
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
        this.setData({
          memberEntrance: {
            isShowScore,
            isShowCoupon,
            isShowBalance,
            isShowGiftCard,
          },
        })
      }
    },
    toMyCoupon: function (e) {
      if (this.isMember) {
        NAVPAGE.toMyCoupon()
      } else {
        NAVPAGE.toAuthorize()
      }
      // 如果未读券弹窗显示出来，则隐藏弹窗
      if (this.show.unVisitedCoupon) {
        this.handleUnvisitedCouponPopupClose()
      }
    },
    toMyGiftCard: function () {
      if (this.isMember) {
        NAVPAGE.toBuyHistory()
      } else {
        NAVPAGE.toAuthorize()
      }
    },
    toScore: function () {
      if (this.isMember) {
        NAVPAGE.toScoreDetails()
      } else {
        NAVPAGE.toAuthorize()
      }
    },
    toBalance: function () {
      if (this.isMember) {
        NAVPAGE.toBalance()
      } else {
        NAVPAGE.toAuthorize()
      }
    },
    toAuthorize: function () {
      NAVPAGE.toAuthorize()
    },
    /**
     * 获取未读的优惠券
     */
    getUnVisitedCoupons: function () {
      console.log('获取未读优惠券')
      // 防止重复调用
      if (!this.isNeedGetUnvisitedCoupon) {
        console.log('已经在获取中，避免重复获取')
        return
      }
      this.isNeedGetUnvisitedCoupon = false
      const postData = {
        page: 1,
        pageSize: 0,
        memberIdEquals: getApp().globalData.userInfo.member.id,
        memberMobileEquals: getApp().globalData.userInfo.member.mobile,
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
            that.getPromotionAdsense(this.storeId)
            return
          }
          if (that.show.unVisitedCoupon || that.show.coupon) {
            // 如果未读券弹窗已经弹出或者有登录送券弹窗不弹出
            return
          }
          // 筛选出未读的券
          const unVisitedCoupons = res.records.filter((value) => value.visited === false)
          if (unVisitedCoupons.length == 0) {
            // 查询是否有促销广告(促销广告之后会查询抽奖和登陆送券)
            that.getPromotionAdsense(this.storeId)
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
          cashCoupons.sort(UTILS.compare('faceValue')) // 排序，从小到大
          cashCoupons = cashCoupons.reverse()
          discountCoupons.sort(UTILS.compare('rate')) // 排序，从小到大
          freeshipCoupons.sort(UTILS.compare('rate')) // 排序，从小到大
          couponList = couponList.concat(
            cashCoupons,
            discountCoupons,
            freeshipCoupons,
            giftCoupons,
            otherCoupons,
          )
          that.setData({
            unVisitedCoupons: couponList,
          })
          that.toggleUnvisitedCouponPopup()
          const ids = unVisitedCoupons.map(function (item) {
            return item.id
          })
          couponService.visited(ids).then((res) => {})
        })
        .catch((err) => {})
    },
    // 清空支付码的定时器
    clearPayCodeTimeout: function () {
      // console.log("->->一码付取消定时器")
      clearTimeout(this.orderTimer)
      this.orderTimer = null
    },
    /* 标准储值支付 */
    toCardPay: function (e) {
      if (this.hasUserInfo && this.isMember) {
        const opts = '?type=' + e.currentTarget.dataset.type
        NAVPAGE.toBalancePay(opts)
      } else {
        NAVPAGE.toBalancePay()
      }
    },
    /* 前往砍价详情 */
    toBargainDetails: function (e) {
      if (e.detail && e.detail.id) {
        // 判断当前砍价活动是否可以购买
        const opts = '?barginId=' + e.detail.id
        if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
          const postData = {
            page: 1,
            pageSize: 1,
            searchCount: true,
            memberIdEquals: getApp().globalData.userInfo.member.id,
            activityIdEquals: e.detail.id,
            statusIn: ['CREATE', 'SUCCESS'],
          }
          bargainService
            .queryInstance(postData)
            .then((res) => {
              if (!res || !res.records || res.records.length === 0) {
                NAVPAGE.toBargainDetails(opts)
                return
              }
              if (res.records.length > 0) {
                const opts = '?barginInstanceId=' + res.records[0].id
                NAVPAGE.toHelpBargain(opts)
              }
            })
            .catch((err) => {
              UTILS.showToast(err.message)
            })
        } else {
          NAVPAGE.toBargainDetails(opts)
        }
      }
    },
    toBargainList: function () {
      NAVPAGE.toBargainList()
    },
    // 轮询查询缓存订单
    getCacheOrder: function () {
      const that = this
      if (
        getApp().globalData.cacheOrder.count &&
        getApp().globalData.cacheOrder.component !== that
      ) {
        console.log('当前已经有查询')
        return
      }
      getApp().globalData.cacheOrder = {
        count: 1,
        component: that,
      }
      that.clearPayCodeTimeout()
      if (!that.hasMemberModule && !that.isHomeShowTopMember) {
        console.log('首页未开启顶部会员和中部会员')
        return
      }
      // 如果没有默认支付方式或者当前页面不在前台，不调用接口，过一秒再试
      if (this.memberCode === null || this.memberCode === '') {
        console.log('还没有默认支付方式或者页面在后台')
        const orderTimer = setTimeout(() => {
          console.log('后台轮询')
          that.getCacheOrder()
        }, 2000)
        console.log('->->开始定时器')
        that.orderTimer = orderTimer
        return
      }
      if (that.memberCode !== null) {
        uni.hideLoading()
        UTILS.setHideLoading(true)
        orderService
          .getCacheOrder(that.memberCode)
          .then((res) => {
            if (res && res.products.length > 0) {
              // 将缓存订单传到下单页面
              const orderJSON = JSON.stringify(res)
              // 添加购物车
              const storeId = res.storeId
              if (
                getApp().globalData.storeInfo &&
                getApp().globalData.storeInfo.id === res.storeId
              ) {
                orderJump()
              } else if (
                getApp().globalData.storeInfo &&
                getApp().globalData.storeInfo.id !== res.storeId
              ) {
                // 当前门店与APP添加商品的门店不同切换当前门店为APP门店
                storeService
                  .getById(res.storeId)
                  .then((res) => {
                    if (res) {
                      getApp().globalData.storeInfo = res
                      orderJump()
                    }
                  })
                  .catch((err) => {
                    console.log('------------查询门店报错')
                    console.log(err.message)
                  })
              } else {
                storeService
                  .getById(res.storeId)
                  .then((res) => {
                    if (res) {
                      getApp().globalData.storeInfo = res
                      orderJump()
                    }
                  })
                  .catch((err) => {
                    console.log('------------查询门店报错')
                    console.log(err.message)
                  })
              }
              /**
               * 下单跳转
               * 1、添加购物车
               * 2、查询购物车
               * 3、跳转下单页面
               */
              function orderJump() {
                let allPrice = 0
                const cacheOrderId = res.cacheOrderId
                const discount = 0
                const tempList = []
                let isFictitiousProduct = false // 是否虚拟商品
                res.products.forEach((item) => {
                  let tempItem = {
                    ...item,
                  }
                  if (res.productDetails && res.productDetails.length > 0) {
                    res.productDetails.forEach((ele) => {
                      if (item.productId === ele.id) {
                        tempItem = {
                          ...tempItem,
                          ...ele,
                          sellPrice: ele.sellPrice || ele.originalPrice,
                        }
                        if (
                          that.isVIP &&
                          that.vipGradeConfig.openMemberPrice &&
                          ele.memberPrice &&
                          Number(ele.memberPrice) < Number(ele.sellPrice)
                        ) {
                          tempItem.sellPrice = ele.memberPrice
                          tempItem.useMemberPrice = true
                        }
                        if (
                          ele.promotionPrice &&
                          Number(ele.promotionPrice) < Number(tempItem.sellPrice)
                        ) {
                          tempItem = {
                            ...tempItem,
                            sellPrice: ele.promotionPrice,
                            usePromotionPrice: true,
                            useMemberPrice: false,
                          }
                        }
                        allPrice =
                          allPrice +
                          parseFloat(
                            (Number(tempItem.sellPrice) * Number(tempItem.productNum)).toFixed(2),
                          )
                        tempList.push(tempItem)
                      }
                    })
                  } else {
                    if (
                      getApp().globalData.systemConfigure.fictitiousProductId &&
                      item.productId === getApp().globalData.systemConfigure.fictitiousProductId
                    ) {
                      isFictitiousProduct = true
                      tempItem = {
                        ...tempItem,
                        name: '无码商品',
                        imageUrl: that.imagesPath.iconOffLine,
                        sellPrice: res.allPrice || 0,
                      }
                    }
                    tempList.push(tempItem)
                    allPrice = res.allPrice || 0
                  }
                })
                try {
                  const shopcart = {
                    allPrice: allPrice.toFixed(2),
                    goodsList: tempList,
                    giftProducts: [],
                    orderType: 'normal',
                    storeId,
                    discount: parseFloat(discount),
                    scource: res.scource,
                    cacheOrderId,
                    // 缓存订单id
                    type: res.type,
                    offlinType: isFictitiousProduct ? 'cashReceipt' : 'normal',
                    inputAmount: res.inputAmount || 0,
                  }
                  uni.setStorageSync('wj_shopcart', shopcart)
                  if (res.allPrice >= 0) {
                    const opts = '?cacheOrder=' + orderJSON
                    NAVPAGE.toPerfectOrder(opts)
                  }
                } catch (e) {
                  console.log('CatchClause', e)
                  console.log('CatchClause', e)
                  console.log(e.message)
                }
              }
            } else {
              if (that.orderTimer != null) {
                that.clearPayCodeTimeout()
              }
              const orderTimer = setTimeout(() => {
                console.log('轮询缓存订单')
                const page = UTILS.utilGetCurrentPage()
                if (that.ownModule === 'homePage') {
                  if (page.route == 'pages-sub/newretail/pages/mallModule/index/index/index') {
                    that.getCacheOrder()
                  } else {
                    console.log('当前显示的页面不是index，不调用')
                  }
                }
              }, 1000)
              that.orderTimer = orderTimer
            }
          })
          .catch((err) => {
            uni.hideLoading()
            UTILS.setHideLoading(false)
            that.clearPayCodeTimeout()
            if (err.message != null) {
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000,
              })
            }
          })
      }
    },
    getMemberGrade: function () {
      const that = this
      if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
        const member = getApp().globalData.userInfo.member
        if (getApp().globalData.memberGrade) {
          that.setData({
            memberGrade: getApp().globalData.memberGrade,
          })
        } else {
          if (member.gradeId) {
            memberService
              .getGradeById(member.gradeId)
              .then((res) => {
                getApp().globalData.memberGrade = res
                that.setData({
                  memberGrade: res,
                })
              })
              .catch((err) => {
                UTILS.showToast(err.message)
              })
          }
        }
      }
    },
    toBenefits: function () {
      NAVPAGE.toBenefits()
    },
    filtQRNumber(val) {
      if (val) {
        val = val.toString()
        op = ''
        for (i = 0; i < val.length; i++) {
          if (i % 4 === 0 && i > 0) {
            op += ' ' + val.charAt(i)
          } else {
            op += val.charAt(i)
          }
        }
        return op
      } else {
        return ''
      }
    },

    filtNickname(val) {
      if (!val) {
        return '点击头像授权登录'
      } else {
        return val
      }
    },
    filtMobile(val) {
      if (val) {
        return val.substring(0, 3) + '****' + val.substring(7)
      } else {
        return ''
      }
    },

    filtDateHead(val) {
      if (val) {
        return val.split(' ')[0]
      } else {
        return ''
      }
    },

    filtToFix(value) {
      value = Number(value)
      if (value >= 0) {
        let formattedNum = 0
        formattedNum = value.toFixed(2) // 此处2为保留两位小数
        // 如果小数部分为00，去掉小数部分
        if (formattedNum.indexOf('.00') !== -1) {
          return formattedNum.substring(0, formattedNum.indexOf('.'))
        }

        // 如果小数部分只有一位，展示一位
        if (formattedNum.indexOf('.') !== -1 && formattedNum[formattedNum.length - 1] === '0') {
          return formattedNum.substring(0, formattedNum.length - 1)
        }
        return formattedNum
      } else {
        return 0
      }
    },

    filtdistributionCompany(value) {
      if (value === 'MT') {
        return '美团'
      } else if (value === 'FN') {
        return '蜂鸟'
      } else {
        return ''
      }
    },

    filtTrackingCompany(val) {
      if (val === 'KUAIFUWU') {
        return '快服务'
      } else if (val === 'SHUNFENG') {
        return '顺丰'
      } else if (val === 'SHENTONG') {
        return '申通'
      } else if (val === 'YUANTONG') {
        return '圆通'
      } else if (val === 'ZHONGTONG') {
        return '中通'
      } else if (val === 'HUITONGKUAIDI') {
        return '汇通快递'
      } else if (val === 'YUNDA') {
        return '韵达'
      } else if (val === 'ZHAIJISONG') {
        return '宅急送'
      } else if (val === 'DEBANGWULIU') {
        return '德邦物流'
      } else if (val === 'OTHER') {
        return '其他'
      } else {
        return '其他'
      }
    },

    filtInt(value) {
      if (value >= 0) {
        return parseInt(value) // 处理为整数
      } else {
        return 0
      }
    },
    formatMobile(phoneNumber) {
      tel = phoneNumber
      if (isPhone(tel)) {
        tel = tel.substring(0, 3) + ' ' + tel.substring(3, 7) + ' ' + tel.substring(7, 11)
      }
      return tel
      // 判断是否是手机号码格式
      function isPhone(str) {
        reg = getRegExp('^1(3|4|5|6|7|8|9)\d{9}$', 'g')
        return reg.test(str)
      }
    },

    toFix(value) {
      if (value != null && value !== '' && value >= 0) {
        return parseFloat(value).toFixed(2) // 此处2为保留两位小数
      } else {
        return 0
      }
    },

    // 计算商品行数
    calcGoodsStyle(value, num) {
      return Math.ceil(value / num)
    },
    /**
     * px转rpx
     */
    pxToRpx(px) {
      // const app = getApp();
      // const screenWidth = app && app.globalData.systemInfo && app.globalData.systemInfo.screenWidth;
      return (750 * parseFloat(px)) / 375
    },
    /**
     * rpx转px
     */
    rpxToPx(rpx) {
      const app = getApp()
      const screenWidth = app && app.globalData.systemInfo && app.globalData.systemInfo.screenWidth
      return ((screenWidth || 375) * parseFloat(rpx)) / 750
    },

    // 在wxs中定义样式逻辑
    getStyle(selectedTopicIds, itemId, themeColor) {
      return selectedTopicIds.indexOf(itemId) > -1
        ? 'color:' + themeColor + ';border-color:' + themeColor
        : ''
    },

    // 判断是否选中
    isChecked(selectedTopicIds, itemId) {
      return selectedTopicIds.indexOf(itemId) > -1
    },

    // 封装转换时间格式的方法
    filterTime(dateTime) {
      // 通过空格分隔日期和时间部分
      // const [date, time] = ;

      // 返回年月日格式
      return dateTime.split(' ')[0]
    },
    // 格式化分类中的名称
    filterCategoryName(val) {
      if (val.length > 4) {
        return val.substring(0, 4)
      }
      return val
    },
    // 判断是否是视频
    isMp4(val) {
      if (val.indexOf('.mp4') > -1) {
        return true
      } else {
        return false
      }
    },

    filtRefundStatus(val) {
      if (val === 'CREATED') {
        return '退款中'
      } else if (val === 'REJECTED') {
        return '已拒绝'
      } else if (val === 'FINISHED') {
        return '已退款'
      } else if (val === 'CANCELED') {
        return '已取消'
      } else {
        return ''
      }
    },
    /**
     * 过滤砍价状态
     */
    filtBargainStatus(val) {
      if (val === 'CREATE') {
        return '进行中'
      } else if (val === 'SUCCESS') {
        return '砍价成功'
      } else if (val === 'FAILED') {
        return '砍价失败'
      } else {
        return '其他'
      }
    },

    // 获取绝对值
    filterAbs(val) {
      return Math.abs(val)
    },

    // 格式化积分商城商品兑换数量
    filterProductNum(sellNum, totalNum) {
      if (sellNum > totalNum) {
        return totalNum
      }
      return sellNum
    },
  },
}
