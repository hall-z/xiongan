<template>
<!--pages/mallModule/member/scoreVip/scoreVip.wxml-->
<!--pages/mallModule/member/vip/vip.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="top-info">
  <view class="member-box">
    <image class="bg" :src="state.memberCard.gradePicture"></image>
  </view>
  <view class="welfare">{{state.memberCard.gradeName}}</view>
</view>
<view class="vip-privilege">
  <view class="title">升级可享受会员权益</view>
  <view class="privilege-list">
    <image class="privilege-list-img" :src="state.memberCard.gradeBenefitsPicture" mode="widthFix"></image>
  </view>
  <!-- <view class="vip-privilege-ad">
    <image src="{{state.imagesPath.iconVipBlock}}"></image>
  </view> -->
</view>
<view class="bottom-pay" v-if="state.showScoreUpdateSys">
    <view class="bottom-pay-button" :style="'background: ' + state.themeColor" @click="toPayVipMember">花费{{state.memberCard.score}}积分可升级到{{state.memberCard.gradeName}}</view>
</view>

</template>
<script setup>
import _utilsUtilsJs2 from "@/utils/newretail/utils";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsCouponHandler from "@/utils/newretail/couponHandler";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/member/scoreVip/scoreVip.js
// pages/mallModule/member/vip/vip.js
const memberService = _apiMemberServiceJs;
const couponService = _apiCouponServiceJs;
const couponHandler = _utilsCouponHandler;
const UTILS = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const themeManager = _utilsThemeManagerJs;
const utils = _utilsUtilsJs2;

//获取应用实例
let clickButton = true;
const state = reactive({
  navigationBarTitle: "会员升级",
  name: "黑卡会员",
  imagesPath: IMGAGESPATH,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  hasUserInfo: false,
  isMember: false,
  member: null,
  userInfo: null,
  isVIP: true,
  couponList: [],
  showScoreUpdateSys: false,
  styleImage: "",
  benefits: null,
  nextGradeNo: '',
  memberCard: ''
});
let customData = {
  hasAssign: false //当前是否在领券中
};
function getUpgradeScore(nextGradeNo) {
  memberService.queryGrade().then(res => {
    if (res) {
      res = utils.compareMemberGrade(res);
    }
    console.log(res, "下一会员等级");
    res.forEach((el, i) => {
      if (el.gradeNo == nextGradeNo) {
        console.log(el, "下一会员等级");
        state.memberCard = el;
      }
    });
  });
}
onLoad(function (options) {
  if (options) {
    let nextGradeNo = options.nextGradeNo;
  }
  // 查询系统配置项，根据系统配置项控制列表菜单显示
  let systemOptions = app.globalData.configureInfo;
  let showScoreUpdateSys = true;
  systemOptions.forEach(item => {
    if (item.key === 'openScorePrizeGrade' && item.value != null) {
      item.value === 'TRUE' ? showScoreUpdateSys = true : showScoreUpdateSys = false;
    }
  });
  state.showScoreUpdateSys = showScoreUpdateSys;
  state.themeColor = app.globalData.uiconfig.themeColor;
  state.nextGradeNo = nextGradeNo;
  getUpgradeScore(nextGradeNo);
});
onReady(function () {});
onShow(function () {
  checkUserInfo();
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    state.userInfo = app.globalData.userInfo.wxaUser;
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo;
      let isExpired = false;
      let isVIP = false;
      const now = new utils.ResponseDate().getTime();
      let vipEndTimeStamp = now + 1000;
      let vipEndTime = "";
      if (res.member.vipEndTime) {
        vipEndTimeStamp = new Date(res.member.vipEndTime.replace(/-/g, '/')).getTime();
        vipEndTime = res.member.vipEndTime.split(" ")[0].replace(/-/g, '.');
      }
      if (now > vipEndTimeStamp) {
        isExpired = true;
      }
      if (res.member.vipEndTime && now < vipEndTimeStamp) {
        isVIP = true;
        app.globalData.userInfo.member.vip = true;
      }
      console.log(vipEndTime);
      state.isMember = true;
      state.member = res.member;
      state.isVIP = isVIP;
      state.isExpired = isExpired;
      state.vipEndTime = vipEndTime;
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
  }
}
function getVipMemberCoupon() {
  memberService.getVipMemberCouponActivity().then(res => {
    if (res && res.length > 0) {
      let tempList = [];
      res.forEach(item => {
        let tempItem = {
          ...item
        };
        if (item.rate) {
          tempItem = {
            ...tempItem,
            rate: (item.rate * 10).toFixed(1)
          };
        }
        couponHandler.handleCouponFunction(tempItem);
        if (tempItem.nr_condition === "该优惠券只针对配送使用") {
          tempItem.nr_condition = "仅限配送使用";
        } else if (tempItem.nr_condition === "该优惠券只针对特定商品可用") {
          tempItem.nr_condition = "部分商品可用";
        }
        tempList.push(tempItem);
      });
      state.couponList = tempList;
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function paidMemberPrompt(e) {
  const that = this;
  if (state.isVIP) {
    handleCoupon(e);
  } else {
    uni.showModal({
      content: '开通黑卡，立享此券',
      confirmText: "开卡领券",
      confirmColor: "#333333",
      success(res) {
        if (res.confirm) {
          toPayVipMember();
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  }
}
function handleCoupon(val) {
  const self = this;
  const couponId = val.currentTarget.dataset.couponid;
  const couponList = state.couponList;
  let currentCoupon = null;
  couponList.forEach(item => {
    if (couponId === item.id) {
      currentCoupon = item;
    }
  });
  // 外部券没有库存
  if (currentCoupon && currentCoupon.balance == null || currentCoupon.balance > 0) {
    if (state.isMember) {
      if (!customData.hasAssign) {
        uni.showLoading({
          title: '领取中...'
        });
        customData.hasAssign = true; //标识状态为领取中
        // 判断当前用户是否已经点击了领券并且还没有返回领券结果
        if (currentCoupon.price && currentCoupon.price > 0) {
          // 有价券
          createCouponOrder(currentCoupon);
        } else {
          // 非有价券
          if (currentCoupon.service === 'HD' || currentCoupon.service === 'ZJIAN') {
            // 海鼎非有价券走创建订单步骤
            createCouponOrder(currentCoupon);
          } else {
            couponAssign(currentCoupon.id);
          }
        }
      } else {
        UTILS.showToast('您已经在领取中了,请稍等片刻~');
        setTimeout(() => {
          uni.showLoading({
            title: '领取中...'
          });
        }, 2000);
      }
    } else {
      NAVPAGE.toAuthorize();
    }
  } else {
    UTILS.showToast('券已经被抢完了，看看别的吧~');
  }
}
function toAssign(val) {
  const self = this;
  let currentCoupon = state.coupon;
  // 外部券没有库存
  if (currentCoupon.balance == null || currentCoupon.balance > 0) {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        if (!state.hasAssign) {
          uni.showLoading({
            title: '领取中...'
          });
          //标识状态为领取中
          // 判断当前用户是否已经点击了领券并且还没有返回领券结果
          state.hasAssign = true;
          if (currentCoupon.price && currentCoupon.price > 0) {
            // 有价券
            createCouponOrder(currentCoupon);
          } else {
            // 非有价券
            if (currentCoupon.service === 'HD' || currentCoupon.service === 'ZJIAN') {
              // 海鼎非有价券走创建订单步骤
              createCouponOrder(currentCoupon);
            } else {
              couponAssign(currentCoupon.id);
            }
          }
        } else {
          UTILS.showToast('您已经在领取中了,请稍等片刻~');
          setTimeout(() => {
            uni.showLoading({
              title: '领取中...'
            });
          }, 2000);
        }
      } else {
        handlePopupPhone();
      }
    } else {
      UTILS.showToast('您还没有登录，请点击头像授权登陆~');
      NAVPAGE.toAuthorize();
    }
  } else {
    UTILS.showToast('券已经被抢完了，看看别的吧~');
  }
}
function createCouponOrder(coupon) {
  const self = this;
  let serviceType = 'GM'; //券服务类型默认为内部券（GM）
  let couponActivityId = coupon.id;
  if (coupon.service === 'HD' || coupon.service === 'ZJIAN') {
    serviceType = coupon.service;
    couponActivityId = coupon.id; //海鼎券券活动ID为鼎力云券活动ID-----已作废；统一使用id
  }
  UTILS.setHideLoading(true);
  couponService.createCouponOrder(couponActivityId, serviceType, state.storeId).then(res => {
    console.log(res);
    if (res.status === 'ACQUIRE') {
      //标识状态为领取中
      state.hasAssign = false;
      UTILS.setHideLoading(false);
      uni.hideLoading();
      UTILS.showToast('领券成功,稍后请到我的优惠券中查看~');
    } else if (res.status === 'CREATED') {
      let postData = {
        orderId: res.id,
        payMethod: app.globalData.paymentMethod || request.PAYMETHOD
        // payMethod: 'WX_MINI_APP'
      };
      couponWXPay(postData);
    } else {
      //标识状态为领取中
      state.hasAssign = false;
      uni.showToast({
        title: res.acquireFailedReason,
        icon: 'none',
        duration: 2000
      });
    }
  }).catch(e => {
    //标识状态为领取中
    state.hasAssign = false;
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function couponAssign(activityId) {
  const self = this;
  let postData = {
    activityId: activityId
  };
  uni.showLoading({
    title: '领取中'
  });
  couponService.assign(postData).then(res => {
    //标识状态为领取中
    state.hasAssign = false;
    uni.hideLoading();
    UTILS.showToast('领券成功,稍后请到我的优惠券中查看~');
  }).catch(e => {
    //标识状态为领取中
    state.hasAssign = false;
    uni.hideLoading();
    if (e.code === 17005) {
      UTILS.showToast('券活动指定的有效期已经过期，不能领取~');
    } else {
      UTILS.showToast(e.message);
    }
  });
}
function couponWXPay(postData) {
  const that = this;
  couponService.getCouponPaySign(postData).then(res => {
    console.log(res);
    if (UTILS.isHideLoading()) {
      UTILS.setHideLoading(false);
      uni.hideLoading();
    }
    state.hasAssign = false;
    let resData = JSON.parse(res);
    let sign = JSON.parse(resData.sign);
    let packageValue = '';
    if (postData.payMethod === 'SWIFTPASS' || postData.payMethod === 'DINGFUTONG') {
      packageValue = sign.package;
    } else if (postData.payMethod === 'WX_MINI_APP' || postData.payMethod === 'WXA_ISV_PAY') {
      packageValue = sign.packageValue;
    }
    uni.requestPayment({
      'timeStamp': sign.timeStamp,
      'nonceStr': sign.nonceStr,
      'package': packageValue,
      'signType': sign.signType,
      'paySign': sign.paySign,
      'success': function (res) {
        UTILS.showToast('领券成功,稍后请到我的优惠券中查看~');
      },
      'fail': function (res) {
        console.log(res);
        if (res.errMsg.indexOf("cancel") >= 0) {
          UTILS.showToast('您取消了订单支付~');
        } else {
          UTILS.showToast(res.errMsg);
        }
      }
    });
  }).catch(err => {
    if (UTILS.isHideLoading()) {
      UTILS.setHideLoading(false);
      uni.hideLoading();
    }
    state.hasAssign = false;
    if (err.code === 1) {
      UTILS.showToast("领券失败，请稍后再试~");
    } else {
      UTILS.showToast(err.message);
    }
  });
}
function toPayVipMember() {
  if (clickButton) {
    clickButton = false;
    if (app.globalData.storeInfo) {
      if (app.globalData.userInfo) {
        const opts = {
          memberId: app.globalData.userInfo.member.id,
          storeId: app.globalData.storeInfo.id
        };
        uni.showLoading({
          title: '开通中...'
        });
        memberService.createScoreOrder(opts).then(res => {
          uni.hideLoading();
          UTILS.showToast("开通成功", 2000);
          clickButton = true;
          memberService.getLoginMember().then(res => {
            app.globalData.userInfo.member = {
              ...app.globalData.userInfo.member,
              ...res
            };
            uni.navigateBack({
              delta: 1
            });
          }).catch(err => {
            UTILS.showToast(err.message);
          });
        }).catch(err => {
          uni.hideLoading();
          UTILS.showToast(err.message);
          clickButton = true;
        });
      }
    } else {
      UTILS.showToast("请先选择门店");
    }
  }
}
</script>
<style scoped>
/* pages/mallModule/member/scoreVip/scoreVip.wxss */
page {
    width: 100%;
    height: 100%;
    padding-bottom: 140rpx;
    background-color: #fff;
}

.top-info {
    position: relative;
    width: 100%;
    padding-top: 84rpx;
    overflow-x: hidden;
}

.top-info .member-box {
    position: relative;
    margin: 0 auto;
    width: 600rpx;
    height: 340rpx;
    border-radius: 20rpx;
    overflow: hidden;
}

.top-info .member-box image.bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.top-info .user-info {
    display: flex;
    position: relative;
    margin: 27rpx 0 0 54rpx;
    color: #f5f7fa;
}

.top-info .user-info .avatarUrl {
    width: 113rpx;
    height: 113rpx;
    border-radius: 50%;
}

.top-info .user-info .info {
    display: flex;
    flex-direction: column;
    margin-left: 8rpx;
    justify-content: center;
}

.top-info .user-info .info .nickName {
    font-size: 36rpx;
    line-height: 48rpx;
    font-weight: bold;
    margin-bottom: 18rpx;
    display: flex;
    align-items: center;
}

.top-info .user-info .info .member-nameplate {
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

.top-info .user-info .info .member-nameplate .flower {
    width: 21rpx;
    height: 23rpx;
    margin-right: 7rpx;
}

.top-info .user-info .info .status {
    width: 94rpx;
    height: 36rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 18rpx;
    font-size: 24rpx;
    color: #f5f7fa;
    text-align: center;
    line-height: 36rpx;
}

.top-info .user-info .info .validity {
    font-size: 24rpx;
    line-height: 26rpx;
}

.top-info .welfare {
    font-size: 32rpx;
    color: #333;
    text-align: center;
    font-weight: bold;
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    bottom: 0;
}

/* 会员特权 */

.vip-privilege {
    padding: 40rpx 28rpx 0;
}

.vip-privilege .title {
    font-size: 34rpx;
    line-height: 46rpx;
    color: #2b2c3c;
    font-weight: bold;
    margin-bottom: 42rpx;
}

.vip-privilege .privilege-list {
    padding: 0 20rpx;
    box-sizing: border-box;
}

.vip-privilege .privilege-list .privilege-list-img {
    width: 100%;
}

.vip-privilege .privilege-list view image {
    width: 81rpx;
    height: 81rpx;
}

.vip-privilege .privilege-list view text {
    font-size: 26rpx;
    line-height: 48rpx;
}

.renewal-fee-btn {
    width: 153rpx;
    height: 54rpx;
    padding-left: 27rpx;
    background: #ffeba5;
    border-radius: 27rpx;
    font-size: 28rpx;
    color: #282728;
    line-height: 54rpx;
    text-align: center;
    font-weight: 400;
    position: relative;
    margin-left: 478rpx;
    margin-top: 69rpx;
    display: flex;
    align-items: center;
}

.renewal-fee-btn view.arrow {
    width: 0;
    height: 0;
    border-width: 12rpx;
    border-style: solid;
    border-color: transparent transparent transparent #282728;
    margin-left: 10rpx;
}

.pay-btn-box {
    padding-top: 80rpx;
    position: relative;
}

.pay-btn-box .pay-btn {
    width: 500rpx;
    height: 92rpx;
    background: #3d3d43;
    border-radius: 46rpx;
    font-size: 34rpx;
    color: #ffdc8a;
    font-weight: bold;
    line-height: 92rpx;
    text-align: center;
    position: relative;
}

.pay-btn-box .pay-label {
    position: absolute;
    width: 150rpx;
    height: 54rpx;
    z-index: 1;
    left: 469rpx;
    top: 55rpx;
}

.pay-btn-box .pay-label image {
    width: 150rpx;
    height: 54rpx;
}

.pay-btn-box .pay-label text {
    min-width: 100%;
    padding-right: 12rpx;
    display: block;
    padding-left: 12rpx;
    font-size: 24rpx;
    line-height: 42rpx;
    color: #fff;
    background: #F41800;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    white-space: nowrap;
}

.vip-privilege-ad {
    margin-top: 28rpx;
}

.vip-privilege-ad image {
    width: 750rpx;
    height: 112rpx;
    margin-left: -28rpx;
}

/* 会员券 */

.vip-coupon {}

.vip-coupon .title {
    font-size: 34rpx;
    height: 110rpx;
    line-height: 110rpx;
    color: #1b1f34;
    padding-left: 48rpx;
    font-weight: bold;
    position: relative;
}

.vip-coupon .title::before {
    content: "";
    display: block;
    position: absolute;
    width: 8rpx;
    height: 29rpx;
    background: #f5cb3b;
    left: 21rpx;
    top: 40rpx;
}

.vip-coupon-content {
    width: 750rpx;
    height: 685rpx;
    padding-top: 42rpx;
    position: relative;
}

.vip-coupon-content .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
}

.vip-coupon-content .content {
    position: relative;
    background: #fff;
    width: 628rpx;
    height: 655rpx;
    border-radius: 10rpx;
    margin: 0 auto;
}

.vip-coupon-content .content .name {
    font-size: 30rpx;
    color: #1b1f34;
    line-height: 48rpx;
    height: 48rpx;
    padding-top: 45rpx;
    padding-bottom: 32rpx;
    text-align: center;
}

.vip-coupon-content .content .comment {
    font-size: 24rpx;
    color: #989898;
    line-height: 48rpx;
    height: 48rpx;
    margin-top: 32rpx;
    text-align: center;
}

.vip-coupon-content .content .coupon-list {
    height: 422rpx;
    width: 575rpx;
    margin: 0 auto;
}

.coupon-body {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: row;
}

.coupon-list .coupon-item {
    width: 273rpx;
    height: 159rpx;
    border-radius: 8rpx;
    position: relative;
    margin-bottom: 26rpx;
    overflow: hidden;
}

.coupon-list .coupon-item .coupon-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.coupon-list .coupon-item .left {
    float: left;
    width: 183rpx;
    padding-left: 18rpx;
    height: 100%;
    position: relative;
}

.coupon-list .coupon-item .right {
    width: 72rpx;
    height: 100%;
    float: right;
    font-size: 26rpx;
    color: #1c1f30;
    position: relative;
    writing-mode: vertical-rl;
    text-align: center;
    line-height: 72rpx;
}

.coupon-list .coupon-item .left .label {
    min-width: 104rpx;
    padding: 0 12rpx;
    height: 30rpx;
    background: #323348;
    border-top-left-radius: 8rpx;
    border-bottom-right-radius: 8rpx;
    font-size: 18rpx;
    color: #fff895;
    font-weight: 400;
    text-align: center;
    line-height: 30rx;
    position: absolute;
    left: 0;
    top: 0;
}

.coupon-list .coupon-item .left .denomination {
    font-size: 30rpx;
    color: #c69013;
    padding-top: 25rpx;
    font-weight: 400;
}

.coupon-list .coupon-item .left .denomination .text {
    font-size: 30rpx;
}

.coupon-list .coupon-item .left .denomination text {
    font-size: 48rpx;
}


.coupon-list .coupon-item .left .rule {
    font-size: 22rpx;
    line-height: 24rpx;
    color: #515151;
}

.coupon-list .coupon-item .left .desc {
    font-size: 22rpx;
    color: #c69013;
    line-height: 24rpx;
    margin-top: 10rpx;
}

.bottom-pay {
    position: fixed;
    bottom: 0;
    height: 130rpx;
    width: 100%;
    border-top: 1rpx solid #999;
    padding-top: 20rpx;
    background-color: #fff;
}

.bottom-pay .bottom-pay-button {
    width: 660rpx;
    height: 90rpx;
    text-align: center;
    font-size: 34rpx;
    line-height: 90rpx;
    color: #fff;
    margin: 0 auto;
    border-radius: 45rpx;
}
</style>