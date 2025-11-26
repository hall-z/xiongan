// import { getApp, getCurrentPages } from '@dcloudio/uni-app'
import utils from './utils'
import auth from './auth'
import helpActivityService from '@/service/api/newretail/helpActivityService'
import storeService from '@/service/api/newretail/storeService'
import memberService from '@/service/api/newretail/memberService'
const app = getApp()

function navPage(page: string, opts: string = ''): void {
  opts = opts || ''
  uni.navigateTo({
    url: page + opts,
    fail: (err) => {
      console.error('页面跳转失败', err)
    }
  })
}

function switchPage(page: string, opts: string = ''): void {
  opts = opts || ''
  uni.switchTab({
    url: page + opts,
    fail: (err) => {
      console.error('tabbar页面跳转失败', err)
      reLaunch(page, opts)
    }
  })
}

function reLaunch(page: string, opts: string = ''): void {
  opts = opts || ''
  uni.reLaunch({
    url: page + opts
  })
}

function urlToObj(str: string): any {
  const obj: any = {}
  if (str && str.indexOf('?') >= 0) {
    const params = str.split('?')[1].split('&')
    params.forEach(v => {
      const [key, value] = v.split('=')
      if (key && value) {
        obj[key] = decodeURIComponent(value)
      }
    })
  }
  return obj
}

export const NAVPAGE = {
  /**
    * 跳转到最外层
    */
  toRoot: function () {
    var pages = getCurrentPages()
    var num = pages.length
    wx.navigateBack({
      delta: num
    })
  },
  // 跳转签到
  toSign: function (opts) {
    const app = getApp()
    const wxaUserService = require("../api/wxaUserService")
    if (!app.globalData.userInfo || !app.globalData.userInfo.member) {
      wx.showLoading({
        title: '加载中,请稍候',
      })
      wxaUserService.login().then(res => {
        auth.setUser(res)
        app.globalData.userInfo = res && res.member ? res : null
        if (!res.member) {
          this.toAuthorize();
        } else {
          wx.setStorage({
            key: "wj_member",
            data: res.member
          })
          let page = "/pages-sub/newretail/pages/mallModule/member/sign/index";
          navPage(page, opts);
        }
        wx.hideLoading()
      }).catch(err => {
        wx.hideLoading()
        let msg = 'meet frequency limit'
        let authorize = 'auth deny'
        let errMsg = err.message
        if (errMsg.indexOf(msg) > -1) {
          wx.showToast({
            title: "登陆超时，请小憩片刻再来登陆吧~",
            icon: 'none',
            duration: 2000
          })
        } else if (errMsg.indexOf(authorize) > -1) {
          wx.showToast({
            title: "授权失败，请重新登录~",
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: "登陆失败，请重新登录~",
            icon: 'none',
            duration: 2000
          })
        }
      });
    } else {
      let page = "/pages-sub/newretail/pages/mallModule/member/sign/index";
      navPage(page, opts);
    }
  },
  /**
   * 跳转到首页
   */
  toHome: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/index/index/index";
    let isTabBar = utils.checkIsTabBar(page)
    if (isTabBar) {
      switchPage(page, opts);
    } else {
      navPage(page, opts);
    }
  },
  /**
   * 跳转到拼团
   */
  toFightGroup: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/fightGroup/fightGroup/fightGroup";

    let isTabBar = utils.checkIsTabBar(page)
    if (isTabBar) {

      switchPage(page, opts);
    } else {
      wx.redirectTo({
        url: '/pages-sub/newretail/pages/mallModule/fightGroup/fightGroup/fightGroup',
      })
    }
  },
  /**
   * 跳转到分类（主分类）
   */
  toCategoryMain: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/tabbar/category/category-main/category-main";
    let isTabBar = utils.checkIsTabBar(page)
    if (isTabBar) {
      switchPage(page, opts);
    } else {
      navPage(page, opts);
    }
  },
  /**
   * 跳转到分类(三级分类)
   */
  toCategory: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/tabbar/category/category-list/category-list";
    let isTabBar = utils.checkIsTabBar(page)
    if (isTabBar) {
      // 处理参数
      const options = urlToObj(opts)
      const app = getApp()
      if (options.shipmentTypes && options.shipmentTypes != null && options.shipmentTypes !== "") {
        app.globalData.shipmentTypes = options.shipmentTypes
      }
      if (options.categoryId != null && options.categoryId !== "") {
        app.globalData.categoryId = options.categoryId
      }
      switchPage(page, opts);
    } else {
      navPage(page, opts);
    }
  },
  /**
   * 跳转到新品页面
   */
  toNewGoods: function () {
    let page = "/pages-sub/newretail/pages/mallModule/goods/newGoods/newGoods"
    navPage(page)
  },
  /**
   * 跳转到购物车
   */
  toShopcart: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/tabbar/shopcart/shopcart";
    let isTabBar = utils.checkIsTabBar(page)
    if (isTabBar === true) {
      switchPage(page, opts);
    } else {
      navPage(page, opts);
    }
  },
  /**
   * 跳转到我的
   */
  toMy: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/tabbar/my/my";
    let isTabBar = utils.checkIsTabBar(page)
    if (isTabBar) {
      switchPage(page, opts);
    } else {
      navPage(page, opts);
    }
  },
  /**
   * 跳转到领券中心
   */
  toCouponCenter: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/coupon/couponCenter/couponCenter";
    navPage(page, opts);
  },
  /**
   * 跳转到礼品卡
   */
  toGiftCardCenter: function (opts) {
    let page = "/pages-sub/newretail/pages/memberModule/giftCard/giftCard/giftCard";
    navPage(page, opts);
  },

  /**
  * 跳转到绑定礼品卡
  */
  toBindGiftCard: function () {
    let page = "/pages-sub/newretail/pages/memberModule/giftCard/bindGiftCard/bindGiftCard";
    navPage(page);
  },
  /**
   * 跳转到商品详情
   */
  toGoodsDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/goods/goodsDetail/goodsDetail";
    navPage(page, opts);
  },
  /**
   * 跳转到会员卡
   */
  toMemberCard: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/myCard/memberCard/memberCard";
    navPage(page, opts);
  },
  /**
   * 跳转到选择门店
   */
  toSelectStore: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/index/selectStore/selectStore";
    navPage(page, opts);
  },
  /**
   * 选择地址
   */
  toSelectAddress: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/index/selectAddress/selectAddress";
    navPage(page, opts);
  },
  /**
   * 个人资料
   */
  toMemberInfo: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/memberInfo/memberInfo";
    navPage(page, opts);
  },
  /**
   * 系统设置
   */
  toSystem: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/system/system";
    navPage(page, opts);
  },
  /**
   * 收货地址 
   */
  toAddressList: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/address/addressList/addressList";
    navPage(page, opts);
  },
  /**
   * 添加收货地址
   */
  toAddAddress: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/address/addAddress/addAddress";
    navPage(page, opts);
  },
  /**
   * 红包明细
   */
  toRedPacket: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/redPacket/redPacket";
    navPage(page, opts);
  },
  /**
   * 绑定手机号
   */
  toBindMobile: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/bindMobile/bindMobile";
    navPage(page, opts);
  },
  /**
   * 邀请好友
   */
  toInvite: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/invite/invite";
    navPage(page, opts);
  },
  /**
   * 我的订单列表
   */
  toOrderList: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/order/order";
    navPage(page, opts);
  },
  /**
   * 订单详情
   */
  toOrderDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/orderDetails/orderDetails";
    navPage(page, opts);
  },
  /**
   * 物流信息
   */
  toLogisticsInfo: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/logisticsInfo/logisticsInfo";
    navPage(page, opts);
  },
  /**
   * 物流信息
   */
  toLogisticsInfoItem: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/logisticsInfoItem/logisticsInfoItem";
    navPage(page, opts);
  },
  /**
   * 查看商品
   */
  toQueryGoods: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/queryGoods/queryGoods";
    navPage(page, opts);
  },
  /**
   * 评价
   */
  toEvaluate: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/evaluate/evaluate";
    navPage(page, opts);
  },
  /**
   * 完善订单
   */
  toPerfectOrder: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/perfectOrder/perfectOrder";
    navPage(page, opts);
  },
  /**
   * 添加备注
   */
  toAddRemarks: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/addRemarks/addRemarks";
    navPage(page, opts);
  },
  /**
   * 退款
   */
  toRefund: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/refund/refund";
    navPage(page, opts);
  },
  /**
   * 退款单列表
   */
  toRefundList: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/refundList/refundList";
    navPage(page, opts);
  },
  /**
   * 退款详情
   */
  toRefundDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/refundDetails/refundDetails";
    navPage(page, opts);
  },
  /**
 * 退款详情
 */
  toAddRefundDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/refundAddDetails/refundAddDetails";
    navPage(page, opts);
  },
  /**
   * 订单配送轨迹
   */
  toOrderTrajectory: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/orderTrajectory/orderTrajectory";
    navPage(page, opts);
  },
  /**
   * 搜索
   */
  toSearch: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/goods/search/search";
    navPage(page, opts);
  },
  toStoreDetail: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/store-detail/storeDetail/storeDetail";
    navPage(page, opts);
  },
  /**
   * 储值余额支付
   */
  toBalancePay: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/pay/pay/pay";
    navPage(page, opts);
  },
  /**
   * 支付方式
   */
  toPayMethod: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/pay/payMethod/payMethod";
    navPage(page, opts);
  },
  /**
   * 支付成功
   */
  toPaymentSuccess: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/pay/payment/payment";
    navPage(page, opts);
  },
  /**
   * 我的优惠券
   */
  toMyCoupon: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/coupon/myCoupon/myCoupon";
    navPage(page, opts);
  },
  /**
   * 我的第三方券
   */
  toMyThirdCoupon: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/score/thirdCouponCode/thirdCouponCode";
    navPage(page, opts);
  },
  /**
   * 历史优惠券
   */
  toCouponHistory: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/coupon/couponHistory/couponHistory";
    navPage(page, opts);
  },
  /**
   * 券详情
   * type assign 领券，freeship 运费券，score 积分兑换
   */
  toCouponDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/coupon/couponDetails/couponDetails";
    navPage(page, opts);
  },
  /** 
   * 兑换优惠券
   */
  toExchabgeCoupon: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/coupon/exchangeCoupon/exchangeCoupon";
    navPage(page, opts)
  },
  /**
   * 选择可用优惠券
   */
  toChoiceCoupon: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/coupon/choiceCoupon/choiceCoupon";
    navPage(page, opts);
  },
  /**
     * 选择可用优惠券 --- 券试算
     */
  toChoiceCouponMore: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/coupon/choiceCouponMore/choiceCouponMore";
    navPage(page, opts);
  },
  /**
   * 充值
   */
  toRecharge: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/myCard/recharge/recharge";
    navPage(page, opts);
  },
  /**
   * 余额明细
   */
  toBalance: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/myCard/balance/balance";
    navPage(page, opts);
  },
  /**
   * 重置密码
   */
  toResetPassword: function (type, opts) {
    let page = "/pages-sub/newretail/pages/mallModule/myCard/resetPassword/resetPassword?active=1" + (type ? ('&type=' + type) : '');
    navPage(page, opts);
  },
  /**
   * 开团信息
   */
  toGroupPurchase: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/fightGroup/groupPurchase/groupPurchase";
    navPage(page, opts);
  },
  /**
   * 拼团团购列表
   */
  toTeamList: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/fightGroup/teamList/teamList";
    navPage(page, opts);
  },
  /**
   * 新会员活动
   */
  toNewmbrActivity: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/activity/newmbrActivity/newmbrActivity";
    navPage(page, opts);
  },
  /**
   * 预售活动
   */
  toAdvanceSell: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/activity/advanceSell/advanceSell";
    navPage(page, opts);
  },
  /**
   * 秒杀列表
   */
  toSeckill: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/activity/seckill/seckill";
    let isTabBar = utils.checkIsTabBar(page)
    if (isTabBar) {
      switchPage(page, opts);
    } else {
      navPage(page, opts);
    }
  },
  /**
   * 抽奖活动
   */
  toLuckDraw: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/activity/luckDraw/luckDraw";
    navPage(page, opts);
  },
  /**
   * 广告页
   */
  toAdvertising: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/advertising/advertising";
    navPage(page, opts);
  },
  /**
   * 积分明细
   */
  toScoreDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/score/score/score";
    navPage(page, opts);
  },
  /**
   * 积分商城
   */
  toScoreMall: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/score/scoreMall/scoreMall";
    navPage(page, opts);
  },
  /**
   * 积分订单
   */
  toScoreOrder: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/score/scoreOrder/scoreOrder";
    navPage(page, opts);
  },
  /**
   * 分销中心
   */
  toMyDistribution: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/distribution/myDistribution/myDistribution";
    navPage(page, opts);
  },
  /**
   * 分销榜单
   */
  toRankingList: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/distribution/rankingList/rankingList";
    navPage(page, opts);
  },
  /**
   * 提现收益
   */
  toProfit: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/distribution/profit/profit";
    navPage(page, opts);
  },
  /**
   * 分销团队列表
   */
  toDistributionTeamList: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/distribution/teamList/teamList";
    navPage(page, opts);
  },
  /**
   * 会员小程序首页
   */
  toMemberIndex: function (opts) {
    let page = "/pages-sub/newretail/pages/memberModule/index/index";
    navPage(page, opts);
  },
  /**
   * 购买礼品卡界面
   */
  toGiftCardBuy: function (opts) {
    let page = "/pages-sub/newretail/pages/memberModule/giftCard/giftCardBuy/giftCardBuy";
    navPage(page, opts);
  },
  /**
   * 使用须知
   */
  toUseNeedKnow: function (opts) {
    let page = "/pages-sub/newretail/pages/memberModule/giftCard/useNeedKnow/useNeedKnow";
    navPage(page, opts);
  },
  /**
   * 礼品卡可使用门店列表
   */
  toGiftCardStoreList: function (opts) {
    let page = "/pages-sub/newretail/pages/memberModule/giftCard/storeList/storeList";
    navPage(page, opts);
  },
  /**
   * 礼品卡支付码
   */
  toGiftCardPayQR: function (opts) {
    let page = "/pages-sub/newretail/pages/memberModule/giftCard/giftCardPayQR/giftCardPayQR";
    navPage(page, opts);
  },
  /**
   * 礼品卡赠送详情页
   */
  toGiveState: function (opts) {
    let page = "/pages-sub/newretail/pages/memberModule/giftCard/giveState/giveState";
    navPage(page, opts);
  },
  /**
   * 礼品卡购买结果
   */
  toCardBuyResult: function (opts) {
    let page = "/pages-sub/newretail/pages/memberModule/giftCard/cardBuyResult/cardBuyResult";
    navPage(page, opts);
  },
  /**
   * 礼品卡详情页
   */
  toGiftCardDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/memberModule/giftCard/giftCardDetails/giftCardDetails";
    navPage(page, opts);
  },
  /**
   * 我的礼品卡页，礼品卡购买历史
   */
  toBuyHistory: function (opts) {
    let page = "/pages-sub/newretail/pages/memberModule/giftCard/myGiftCard/myGiftCard";
    // let page = "/pages-sub/newretail/pages/memberModule/giftCard/buyHistory/buyHistory";
    navPage(page, opts);
  },
  /**
   * 选择礼品卡页
   */
  toChoiceGiftCard: function (opts) {
    let page = '/pages-sub/newretail/pages/memberModule/giftCard/choiceGiftCard/choiceGiftCard';
    navPage(page, opts)
  },
  /**
   * 前往商品全部评价
   */
  toGoodsComment: function (opts) {
    let page = '/pages-sub/newretail/pages/mallModule/goods/goodsComment/goodsComment';
    navPage(page, opts)
  },
  /**
   * 前往授权页面
   */
  toAuthorize: function (opts) {
    let page = '/pages-sub/newretail/pages/mallModule/member/authorize/authorize';
    navPage(page, opts)
    // const app = getApp()
    // let authorizeSkip = app.globalData.authorizeSkip || 0;
    // app.globalData.authorizeSkip = authorizeSkip + 1;
    // if(app.globalData.authorizeSkip == 1) {
    //   let page = '/pages-sub/newretail/pages/mallModule/member/authorize/authorize';
    //   opts = opts ? opts : "";
    //   wx.navigateTo({
    //     url: page + opts,
    //     fail: () => {
    //       app.globalData.authorizeSkip = 0
    //     }
    //   })
    //   wx.showLoading({
    //     title: '正在跳转授权页面，请稍等~',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //   }, 2000)
    // }
  },
  /**
   * 前往意见反馈
   */
  toFeedback: function (opts) {
    let page = '/pages-sub/newretail/pages/mallModule/member/feedback/feedback';
    navPage(page, opts)
  },
  // 前往服务列表
  toServiceList: function (type) {
    let page = '/pages-sub/newretail/pages/mallModule/florist/serviceList/serviceList?type=' + (type == 'SERVICESTAFF' ? 'florist' : 'service');
    navPage(page)
  },
  // 前往服务详情
  toServiceDetails: function (opts) {
    let page = '/pages-sub/newretail/pages/mallModule/goods/goodsDetail/goodsDetail';
    navPage(page, opts)
  },
  // 前往福利计划
  toBenefitPlan: function (opts) {
    let page = '/pages-sub/newretail/pages/mallModule/benefitPlan/welfarePlan/welfarePlan';
    navPage(page, opts)
  },
  // 获取小象超市的地址并跳转
  toMeituan() {
    memberService.mtxxh5login().then(res => {
      // let opts = '?webUrl=' + JSON.stringify({
      //   url: res
      // });
      wx.setStorageSync('webUrl', res)
      this.toAdvertising()
    })
  },
  // 前往旅游线路
  toTourismPlan: function (opts) {
    let page = '/pages-sub/newretail/pages/mallModule/benefitPlan/tourismPlan/tourismPlan';
    navPage(page, opts)
  },
  /**
   * 前往助力送券
   */
  toAssistanceCoupon: function (opts) {
    let page = '/pages-sub/newretail/pages/mallModule/activity/assistanceCoupon/assistanceCoupon';
    navPage(page, opts)
  },
  /**
   * 前往取件页面
   */
  toPickUp: function (opts) {
    let page = '/pages-sub/newretail/pages/mallModule/order/pickup/pickup';
    navPage(page, opts)
  },
  /** 
   * 前往取件结果页面
   */
  toPickUpResult: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/pickupResult/pickupResult"
    navPage(page, opts)
  },
  /**
   * 前往申请分销员页面
   */
  toApplyDistributor: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/distribution/apply/apply"
    navPage(page, opts)
  },
  /**
   * 前往积分商城下单页面
   */
  toAddScoreOrder: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/score/scoreAddOrder/scoreAddOrder"
    navPage(page, opts)
  },
  /**
   * 跳转付款码界面
   */
  toPayCode: function (opts) {
    let page = '/pages-sub/newretail/pages/mallModule/myCard/cardPay/cardPay'
    navPage(page, opts)
  },
  /**
   * 跳转办卡
   */
  toCreditCard: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/creditCard/creditCard"
    navPage(page, opts)
  },
  // 跳转到在线充值
  toTopUp: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/myCard/topUp/topUp"
    navPage(page, opts)
  },
  // 跳转到充值记录
  toTopUpRecord: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/myCard/topUpRecord/topUpRecord"
    navPage(page, opts)
  },
  // 前往广告页
  toAdPage: function (pageInfo, pageType) {
    const that = this
    if (pageInfo.linkType === 'APP') {
      // 应用
      // 判断跳转模块
      if (pageInfo.appReturnType === "PRODUCT_MENU") {
        //跳转商品分类页面
        this.toCategory("?categoryId=" + pageInfo.productMenuId)
      } else if (pageInfo.appReturnType === 'MIAOSHA') {
        this.toSeckill();
      } else if (pageInfo.appReturnType === "RECHARGE") {
        this.toRecharge();
      } else if (pageInfo.appReturnType === "MEAL") {
        //  餐饮
      } else if (pageInfo.appReturnType === "RECEIVECOUPON") {
        // 领券中心
        this.toCouponCenter();
      } else if (pageInfo.appReturnType === "ADVANCE_SELL_PRODUCT") {
        // 预售商品
        if (pageInfo.activityId) {
          let opts = '?productId=' + pageInfo.productId + '&advanceId=' + pageInfo.activityId + '&type=advanceSell';
          this.toGoodsDetails(opts);
        } else {
          this.toAdvanceSell()
        }
      } else if (pageInfo.appReturnType === "NEW_GOODS") {
        // 新品
        this.toNewGoods();
      } else if (pageInfo.appReturnType === "TEAM_BUYING") {
        // 团购
        this.toFightGroup();
      } else if (pageInfo.appReturnType === "SCOREMALL") {
        // 积分商场
        this.toScoreMall();
      } else if (pageInfo.appReturnType === "INVITE_MEMBER") {
        // 邀请好友
        this.toInvite();
      } else if (pageInfo.appReturnType === "MEMBER_CARD") {
        // 会员卡
        //如果首页开启付款码，则不到会员码页面，点击直接跳转付款码页面
        if (this.data.uiconfig.isHomePayCodeEnabled) {
          this.toPayCode();
        } else {
          this.toMemberCard();
        }
      } else if (pageInfo.appReturnType === "MY_COUPON") {
        // 我的优惠券
        this.toMyCoupon();
      } else if (pageInfo.appReturnType === "NEWMBR") {
        // 新用户专享
        this.toNewmbrActivity();
      } else if (pageInfo.appReturnType === 'GIFTCARD') {
        // 如果跳转类型是礼品卡，跳转到礼品卡界面
        this.toGiftCardCenter();
      } else if (pageInfo.appReturnType === "HELP_COUPON") {
        // 助力送券
        if (app.globalData.userInfo && app.globalData.userInfo.member) {
          if (pageInfo.helpActivityId != null) {
            helpActivityService.getHelpActivityById(pageInfo.helpActivityId).then(res => {
              if (res.status === "SUBMITED") {
                let opts = "?helpActivityId=" + pageInfo.helpActivityId;
                this.toAssistanceCoupon(opts);
              } else if (res.status === "FINISHED") {
                wx.showToast({
                  title: '您来晚了，助力活动已结束~',
                  icon: 'none'
                })
              } else if (res.status === "CREATED") {
                wx.showToast({
                  title: '助力活动还没有开始哦~',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '当前助力活动不在进行中~',
                  icon: 'none'
                })
              }
            }).catch(err => {
              console.log("查询进行中的助力送券活动出错：" + err.message)
              wx.showToast({
                title: '当前没有正在进行中的活动哦~',
                icon: 'none'
              })
            })
          }
        } else {
          wx.showToast({
            title: '您还不是会员，请绑定手机号成为会员~',
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            this.toAuthorize()
          }, 2000);
        }
      } else if (pageInfo.appReturnType === "CREDIT_CARD") {
        // 申请办卡
        this.toCreditCard();
      } else if (pageInfo.appReturnType === "BARGAIN") {
        // 砍价模块
        this.toBargainList();
      } else if (pageInfo.appReturnType === "PENNY") {
        // 购物抽奖
        if (app.globalData.userInfo && app.globalData.userInfo.member) {
          this.toPennyList();
        } else {
          this.toAuthorize()
        }
      } else if (pageInfo.appReturnType === "RECHARGE_DRAW") {
        // 充值抽奖
        if (app.globalData.userInfo && app.globalData.userInfo.member) {
          this.toLotteryIndex();
        } else {
          this.toAuthorize();
        }
      } else if (pageInfo.appReturnType === "NOTICE") {
        // 系统公告
        this.toSysNotice();
      } else if (pageInfo.appReturnType === "SOLITAIRE") {
        this.toSolitaireList()
      } else if (pageInfo.appReturnType === "PACKAGING") {
        // 打包一口价
        if (pageInfo.packagingId != null) {
          let opts = "?packagingId=" + pageInfo.packagingId;
          this.toPackaging(opts);
        }
      } else if (pageInfo.appReturnType === "SERVICEPRODUCT" || pageInfo.appReturnType === "SERVICESTAFF ") {
        // 服务相关页面
        this.toServiceList(pageInfo.appReturnType)
      } else if (pageInfo.pageUrl) {
        wx.navigateTo({
          url: pageInfo.pageUrl,
        })
      }
    } else if (pageInfo.linkType === "FEEDBACK") {
      //跳转意见反馈页面
      this.toFeedback()
    } else if (pageInfo.linkType === 'GRADPRODUCT') {
      // 秒杀商品
      let opts = '?productId=' + pageInfo.productId + '&storeId=' + app.globalData.storeInfo.id + '&activityId=' + pageInfo.grabActivityId + '&type=secondkill'
      this.toGoodsDetails(opts)
    } else if (pageInfo.linkType === 'PRODUCT') {
      // 商品 
      let opts = '?productId=' + pageInfo.productId + '&storeId=' + app.globalData.storeInfo.id + '&type=normal';
      this.toGoodsDetails(opts);
    } else if (pageInfo.linkType === 'TEAMPRODUCT') {
      // 拼团商品 
      let opts = '?productId=' + pageInfo.teamActivityId + '&storeId=' + app.globalData.storeInfo.id + '&type=group';
      this.toGoodsDetails(opts);
    } else if (pageInfo.linkType === "GIFTCARDACTIVITYDETAILS") {
      // 如果跳转类型是礼品卡详情，根据giftcardActivityId跳转到礼品卡详情页
      let opts = '?giftCardActivityId=' + pageInfo.giftcardActivityId;
      this.toGiftCardBuy(opts);
    } else if (pageInfo.linkType === 'COUPONACTIVITYDETAILS') {
      if (app.globalData.userInfo) {
        if (app.globalData.userInfo.member) {
          let opts = '?couponActivityId=' + pageInfo.couponActivityId + '&type=assign&isExternal=false';
          this.toCouponDetails(opts);
        } else {
          wx.showToast({
            title: '您还不是会员，请绑定手机号成为会员~',
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            this.toAuthorize()
          }, 2000);
        }
      } else {
        this.toAuthorize()
      }
    } else if (pageInfo.linkType === 'URL') {
      // 链接
      let url = pageInfo.linkUrl
      if (!url) {
        return false;
      }
      var index = '?'
      let webUrl = url
      if (url.indexOf(index) > -1) {
        webUrl = webUrl + '&storeId=' + this.data.storeId + '&type=normal'
        if (app.globalData.TENANT && webUrl.indexOf("tenant") < 0) {
          webUrl = webUrl + '&tenant=' + app.globalData.TENANT
        }
      }
      let urlData = {
        url: encodeURIComponent(webUrl)
      }
      console.log(webUrl, urlData)
      let jsonUrl = JSON.stringify(urlData)
      let opts = '?webUrl=' + jsonUrl;
      this.toAdvertising(opts);
    } else if (pageInfo.linkType === "BENEFIT_PLAN") {
      this.toBenefitPlan()
    } else if (pageInfo.linkType === "MEITUAN_XIAOXIANG") {
      this.toMeituan()
    } else if (pageInfo.linkType === "TOURISM_PLAN") {
      let opts = '?id=' + pageInfo.tourismPlanId;
      this.toTourismPlan(opts)
    } else if (pageInfo.pageUrl) {
      wx.navigateTo({
        url: pageInfo.pageUrl,
      })
    } else {

    }
  },

  /**
   * 跳转线下订单
   */
  toOfflineOrderDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/offlineOrderDetails/offlineOrderDetails"
    navPage(page, opts)
  },

  /**
   * 跳转砍价活动列表
   */
  toBargainList: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/bargain/bargainList/bargainList"
    navPage(page, opts)
  },
  /**
   * 跳转我的线路
   */
  toMyTourism: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/benefitPlan/myTourism/myTourism"
    navPage(page, opts)
  },
  /**
   * 跳转我的砍价
   */
  toMyBargain: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/bargain/myBargain/myBargain"
    navPage(page, opts)
  },

  /**
   * 跳转砍价活动详情
   */
  toBargainDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/bargain/bargainDetails/bargainDetails"
    navPage(page, opts)
  },

  /**
   * 跳转砍价分享页面
   */
  toHelpBargain: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/bargain/helpBargain/helpBargain"
    navPage(page, opts)
  },
  /**
   * 跳转砍价下单
   */
  toBargainAddOrder: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/bargain/bargainAddOrder/bargainAddOrder"
    navPage(page, opts)
  },
  /**
   * 跳转到商品列表
   */
  toGoodsList: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/goods/goodsList/goodsList";
    navPage(page, opts);
  },
  /**
   * 跳转到系统公告
   */
  toSysNotice: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/sysNotice/sysNotice";
    navPage(page, opts);
  },
  /**
   * 跳转到购物抽奖列表
   */
  toPennyList: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/activity/penny/pennyList/pennyList";
    navPage(page, opts);
  },
  /**
   * 跳转到购物抽奖详情
   */
  toPennyDetail: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/activity/penny/goodsDetail/goodsDetail";
    navPage(page, opts);
  },
  /**
   * 跳转到购物抽奖助力页面
   */
  toHelpPenny: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/activity/penny/helpPenny/helpPenny";
    navPage(page, opts);
  },
  /**
   * 跳转到VIP会员页面
   */
  toVIPMember: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/vip/vip";
    navPage(page, opts);
  },
  /**
   * 跳转到VIP会员支付页面
   */
  toVIPMemberPay: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/vipPay/vipPay";
    navPage(page, opts);
  },
  /**
   * 跳转到退款去向
   */
  toMoneyGoing: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/moneyGoing/moneyGoing";
    navPage(page, opts);
  },
  /**
   * 跳转到会员权益
   */
  toGrade: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/grade/grade";
    navPage(page, opts);
  },
  /**
   * 跳转到会员等级说明
   */
  toBenefits: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/benefits/benefits";
    navPage(page, opts);
  },
  /**
   * 跳转到充值抽奖页面
   */
  toLotteryIndex: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/activity/lottery/lotteryIndex/lotteryIndex";
    navPage(page, opts);
  },
  /**
   * 跳转到我的充值抽奖
   */
  toMyLottery: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/activity/lottery/myLottery/myLottery";
    navPage(page, opts);
  },
  /**
   * 跳转到充值抽奖助力页面
   */
  toHelpLottery: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/activity/lottery/helpLottery/helpLottery";
    navPage(page, opts);
  },
  /**
   * 跳转到积分抽奖页面
   */
  toRaffle(opts) {
    const app = getApp()
    const wxaUserService = require("../api/wxaUserService")
    if (!app.globalData.userInfo || !app.globalData.userInfo.member) {
      wx.showLoading({
        title: '加载中,请稍候',
      })
      wxaUserService.login().then(res => {
        auth.setUser(res)
        app.globalData.userInfo = res && res.member ? res : null
        if (!res.member) {
          this.toAuthorize();
        } else {
          wx.setStorage({
            key: "wj_member",
            data: res.member
          })
          let page = "/pages-sub/newretail/pages/mallModule/activity/scoreRaffle/scoreRaffle";
          navPage(page, opts)
        }
        wx.hideLoading()
      }).catch(err => {
        wx.hideLoading()
        let msg = 'meet frequency limit'
        let authorize = 'auth deny'
        let errMsg = err.message
        if (errMsg.indexOf(msg) > -1) {
          wx.showToast({
            title: "登陆超时，请小憩片刻再来登陆吧~",
            icon: 'none',
            duration: 2000
          })
        } else if (errMsg.indexOf(authorize) > -1) {
          wx.showToast({
            title: "授权失败，请点击头像重新登录~",
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: "登陆失败，请点击头像重新登录~",
            icon: 'none',
            duration: 2000
          })
        }
      });
    } else {
      let page = "/pages-sub/newretail/pages/mallModule/activity/scoreRaffle/scoreRaffle";
      navPage(page, opts)
    }
  },
  /**
   * 跳转到发票页面
   */
  toInvoice: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/order/invoice/invoice";
    navPage(page, opts);
  },

  /**
   * 跳转到积分会员页面
   */
  toScoreVip: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/scoreVip/scoreVip";
    navPage(page, opts);
  },
  /**
   * 跳转到导购任务
   */
  toApplyShoppingGuide: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/shoppingGuide/task/task";
    navPage(page, opts);
  },
  /**
   * 填写申请成为导购员信息
   */
  toGuideApplyInfo: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/shoppingGuide/applyInfo/applyInfo";
    navPage(page, opts);
  },
  /**
   * 跳转到导购商品
   */
  toGuideGoods: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/shoppingGuide/goods/goods";
    navPage(page, opts)
  },
  /**
   * 跳转到提现
   */
  toCashout: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/shoppingGuide/cashout/cashout";
    navPage(page, opts)
  },

  /**
   * 跳转到积分选择门店
   */
  toScoreSelectStore: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/score/selectStore/selectStore";
    navPage(page, opts)
  },

  /**
   * 跳转到直播广场(H5版本)
   */
  toShowList: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/liveplay/showList/showList";
    let isTabBar = utils.checkIsTabBar(page)
    if (isTabBar) {
      switchPage(page, opts);
    } else {
      navPage(page, opts);
    }
  },

  /**
   * 跳转到直播详情(H5版本)
   */
  toShowDetails: function (opts) {

    let page = "/pages-sub/newretail/pages/mallModule/liveplay/showDetails/showDetails";
    navPage(page, opts)
  },


  /**
   * 跳转到接龙列表
   */
  toSolitaireList: function (opts) {
    let page = "/pages-sub/newretail/pages/mall/solitaire/solitaireList/solitaireList";
    navPage(page, opts)
  },

  /**
   * 跳转到接龙详情
   */
  toSolitaireDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mall/solitaire/solitaireDetails/solitaireDetails";
    navPage(page, opts)
  },
  /**
   * 跳转到直播广场(小程序组件版本)
   */
  toLivePlayerCenter: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/miniAppLiveplay/showList/showList";
    let isTabBar = utils.checkIsTabBar(page)
    if (isTabBar) {
      reLaunch(page, opts);
    } else {
      navPage(page, opts);
    }
  },

  /**
   * 跳转到直播详情(小程序组件版本)
   */
  toLivePlayerRoom: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/miniAppLiveplay/showDetails/showDetails";
    navPage(page, opts)
  },

  /**
  * 跳转到打包一口价
  */
  toPackaging: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/goods/packaging/packaging";
    navPage(page, opts)
  },
  /**
  * 自提模块
  */
  toSefl: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/tabbar/selfLifting/selfLifting";
    let isTabBar = utils.checkIsTabBar(page)
    if (isTabBar) {
      switchPage(page, opts);
    } else {
      navPage(page, opts);
    }
  },
  /**
   * 周期购详情
   */
  toCycleDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/goods/flowerDetail/index";
    navPage(page, opts)
  },
  /**
 * 注册协议
 */
  toAgreement: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/member/agreement/agreement";
    navPage(page, opts);
  },
  // 前往客服
  toCustomService(opts, storeId) {
    const app = getApp()
    if (app.globalData.customerService == 'NONE' && storeId) {
      // @ts-ignore - storeService is imported correctly
      storeService.StoreService.getById(storeId).then((res: any) => {
        if (res) {
          uni.makePhoneCall({
            phoneNumber: res.tel,
          })
        }
      })
    } else {
      let page = "/pages-sub/newretail/pages/customerService/customerService/customerService";
      if (app.globalData.customerService == 'QY') {
        page = '/pages-sub/newretail/pages/mallModule/order/qiyu/index'
      }
      navPage(page, opts);
    }
  },
  /**
   * 跳转种草广场
   */
  toRecommendSquare: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/recommend/square/square";
    navPage(page, opts);
  },
  /**
   * 跳转我的种草
   */
  toRecommendMy: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/recommend/my/my";
    navPage(page, opts);
  },
  /**
   * 跳转种草详情
   */
  toRecommendDetails: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/recommend/details/details";
    navPage(page, opts);
  },
  /**
   * 跳转种草详情
   */
  toRecommendRelease: function (opts) {
    let page = "/pages-sub/newretail/pages/mallModule/recommend/release/release";
    navPage(page, opts);
  },
}

export default NAVPAGE
