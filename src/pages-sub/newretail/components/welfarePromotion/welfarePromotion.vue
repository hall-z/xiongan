<template>
  <popup
    v-for="(item, index) in popList"
    :key="index"
    :show="item.show"
    position="middle"
    custom-class="middle"
    :form="true"
    @close="handleDrawPopupClose"
  >
    <view
      class="popup-adsense-box"
      :style="
        'background-color: ' +
        (item.blessingType === 'BIRTHDAY_BLESSING' || item.blessingType === 'ENTRY_BLESSING'
          ? '#fff'
          : '')
      "
    >
      <view
        @click="
          item.blessingType === 'BIRTHDAY_BLESSING' ||
          item.blessingType === 'ENTRY_BLESSING' ||
          item.contentType !== 'PICTURE'
            ? ''
            : 'skipPage'
        "
        :data-item="item"
        class="popup-unvisited-coupon-content popup-unvisited-coupon-content1"
      >
        <image v-if="item.contentType === 'PICTURE'" :src="item.pictureUrl" mode="widthFix"></image>
        <video v-else :src="item.videoUrl" autoplay=""></video>
        <!-- || item.blessingType === 'FESTIVAL_BLESSING' -->
        <view
          class="pop_text"
          v-if="item.blessingType === 'BIRTHDAY_BLESSING' || item.blessingType === 'ENTRY_BLESSING'"
        >
          <view class="title" v-if="item.blessingType === 'BIRTHDAY_BLESSING'">
            {{ item.memberName }}, 祝你生日快乐
          </view>
          <view class="title" v-if="item.blessingType === 'ENTRY_BLESSING'">
            {{ item.memberName }}, 祝你入职{{ item.entryYears }}周年快乐
          </view>
          <view>
            {{ item.designatedText }}
          </view>
          <view v-if="item.companyName">{{ item.companyName }}</view>
        </view>
      </view>
    </view>
  </popup>
</template>
<script setup>
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _apiHelpActivityServiceJs from '@/service/api/newretail/helpActivityService'
import _apiActivityServiceJs from '@/service/api/newretail/activityService'
// import { attached } from "@dcloudio/uni-app";
import { reactive, onBeforeMount } from 'vue'
import popup from '../popup/popup.vue'
const app = getApp()

// components/welfarePromotion/welfarePromotion.js
const activityService = _apiActivityServiceJs
const helpActivityService = _apiHelpActivityServiceJs
const NAVPAGE = _utilsNavPageJs
// 获取应用实例
const state = reactive({
  popList: [],
  oneShowList: [],
})
const props = defineProps({
  usePage: {
    type: String,
  },
})
onBeforeMount(() => {
  state.oneShowList = uni.getStorageSync('popOneIdList')
    ? JSON.parse(uni.getStorageSync('popOneIdList'))
    : []
  getPopList()
})
function skipPage(e) {
  const pageInfo = e.currentTarget.dataset.item
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
    let url = null
    url = pageInfo.link
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
    // })
    NAVPAGE.toSign()
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
  }
  handleDrawPopupClose()
}
function getPopList() {
  activityService.queryWelfarePromotion(state.usePage).then((res) => {
    console.log(res, 'sfsjfksfjskdf')
    if (res && res.length > 0) {
      const oneShowList = res.filter((item) => {
        return item.pushFrequencyType == 'EACH_ENTRY'
      })
      uni.setStorageSync(
        'popOneIdList',
        JSON.stringify([...oneShowList.map((item) => item.id), ...state.oneShowList]),
      )
      res = res.filter((item) => {
        return state.oneShowList.indexOf(item.id) == -1 || item.pushFrequencyType != 'EACH_ENTRY'
      })
      if (res && res.length > 0) {
        res[0].show = true
      }
      state.popList = res
    }
  })
}
function handleDrawPopupClose() {
  let showIndex = 0
  state.popList.some((item, index) => {
    if (item.show) {
      showIndex = index
    }
    return item.show
  })
  if (showIndex < state.popList.length - 1) {
    state.popList.forEach((item, index) => {
      item.show = false
      if (index == showIndex + 1) {
        item.show = true
      }
    })
  } else {
    state.popList.forEach((item, index) => {
      item.show = false
    })
  }
  state.popList = state.popList
}
</script>
<style scoped>
/* components/welfarePromotion/welfarePromotion.wxss */

.popup-adsense-box {
  width: 640rpx;
  border-radius: 16rpx;
}
.pop_text {
  box-sizing: border-box;
  padding: 15rpx 15rpx 30rpx;
  width: 100%;
}
.pop_text view {
  font-size: 26rpx;
  color: #ccc;
  margin-top: 10rpx;
  word-wrap: break-word;
  overflow-wrap: break-word; /* 标准别名 */
  word-break: break-all;
}

.pop_text .title {
  font-size: 32rpx;
  color: #000;
}

.popup-unvisited-coupon-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.popup-adsense-box image {
  max-width: 100%;
  max-height: 100%;
}
</style>
