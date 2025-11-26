<template>
<!--pages/mallModule/member/vip/vip.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="top-info">
  <view class="member-box">
    <image class="bg" :src="state.styleImage"></image>
    <view class="user-info">
      <image class="avatarUrl" :src="state.userInfo.avatarUrl"></image>
      <view class="info">
        <view class="nickName">
          <text>{{state.member.nickName ? state.member.nickName : state.userInfo.nickName}}</text>
          <view v-if="state.isVIP" class="member-nameplate">
            <image class="flower" :src="state.imagesPath.iconVIPFlower"></image>{{state.name}}
          </view>
        </view>
        <view class="status" v-if="!state.isVIP">未开通</view>
        <view class="validity" v-else>{{vipEndTime}}到期</view>
      </view>
    </view>
    <view class="renewal-fee-btn" v-if="state.isVIP && state.isEnableVipMember" @click="toPayVipMember">立即续费
      <view class="arrow"></view>
    </view>
    <view class="welfare" v-if="state.isVIP">本月您还有会员福利待领取</view>
    <view class="welfare" v-else>本月您还可以领取价值200元的会员福利</view>
  </view>
</view>
<view class="vip-privilege">
  <view class="title">黑卡特权</view>
  <view class="privilege-list">
    <view v-if="state.benefits.couponActivityIds && state.benefits.couponActivityIds.length > 0">
      <image :src="state.imagesPath.iconVipCoupon"></image>
      <text>专享券</text>
    </view>
    <view v-if="state.benefits.openMemberPrice">
      <image :src="state.imagesPath.iconVipCoupon"></image>
      <text>专享特价</text>
    </view>
    <view v-if="state.benefits.multiple">
      <image :src="state.imagesPath.iconVipCoupon"></image>
      <text>{{state.benefits.multiple}}倍积分</text>
    </view>
    <view v-if="state.benefits">
      <image :src="state.imagesPath.iconVipCoupon"></image>
      <text>更多特权</text>
    </view>
  </view>
  <view class="pay-btn-box" v-if="state.isEnableVipMember">
    <view class="pay-label" :hidden="minPay === 0">
      <image :src="state.imagesPath.iconVipPayLabel"></image>
      <text>低至{{minPay}}元/天</text>
    </view>
    <button class="pay-btn" @click="toPayVipMember">{{!state.isVIP ? "开通黑卡享特权" : "立即续费"}}</button>
  </view>
  <view class="vip-privilege-ad">
    <image :src="state.imagesPath.iconVipBlock"></image>
  </view>
</view>
<view class="vip-coupon" v-if="state.benefits.couponActivityIds && state.benefits.couponActivityIds.length > 0 && state.couponList.length > 0">
  <view class="title">黑卡专享券</view>
  <view class="vip-coupon-content">
    <image class="bg" :src="state.imagesPath.iconVipCouponContent"></image>
    <view class="content">
      <view class="name">{{state.benefits.couponActivityIds.length}}种面额任意领</view>
      <scroll-view scroll-y="" class="coupon-list">
        <view class="coupon-body">
          <view class="coupon-item" v-for="(item , index) in state.couponList" :key="id" :data-couponId="item.id" @click="paidMemberPrompt">
            <image class="coupon-bg" :src="state.imagesPath.iconVipCouponBg"></image>
            <view class="left">
              <view class="label">{{state.name}}专享</view>
              <view class="denomination">
                <text class="text" :hidden="item.function !== 'CASH'">￥</text>
                <text v-if="item.function === 'CASH'">{{item.nr_headInfo}}</text>
                <text v-else>{{item.nr_headInfo}}</text>
                <text class="text" :hidden="item.function !== 'DISCOUNT'">折</text>
              </view>
              <view class="rule" :hidden="item.function !== 'CASH' || !item.useAmountLimit">满{{item.useAmountLimit}}可用</view>
              <view class="desc">{{item.nr_condition}}</view>
            </view>
            <view class="right">立即领取</view>
          </view>
        </view>
      </scroll-view>
      <view class="comment">注：每月额度仅当月有效</view>
    </view>
  </view>
</view>
<view class="bottom-pay" v-if="state.isEnableVipMember" @click="toPayVipMember">{{state.isVIP ? "立即续费" : "开通领取"}} ></view>
<timeout :show="state.showTimeout" @close="timeoutPopupClose"></timeout>
</template>
<script setup>
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsCouponHandler from "@/utils/newretail/couponHandler";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import timeout from '@/pages-sub/newretail/components/order/timeout/timeout.vue';
const app = getApp();

// pages/mallModule/member/vip/vip.js
const memberService = _apiMemberServiceJs;
const couponService = _apiCouponServiceJs;
const orderService = _apiOrderServiceJs;
const couponHandler = _utilsCouponHandler;
const UTILS = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "黑金PLUS会员",
  name: "黑卡会员",
  imagesPath: IMGAGESPATH,
  hasUserInfo: false,
  isMember: false,
  member: null,
  userInfo: null,
  isVIP: true,
  couponList: [],
  isEnableVipMember: false,
  styleImage: "",
  benefits: null,
  showTimeout: false
});
let customData = {
  hasAssign: false //当前是否在领券中
};
onLoad(function (options) {
  state.isEnableVipMember = app.globalData.systemConfigure.isEnableVipMember;
  getVipMemberConfig();
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
      const now = new UTILS.ResponseDate().getTime();
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
function getVipMemberConfig() {
  const that = this;
  memberService.getVipMemberGradeConfig().then(res => {
    let minPay = Number.POSITIVE_INFINITY;
    res.meals && res.meals.length > 0 && res.meals.forEach(item => {
      if (minPay > item.amount / item.validity) {
        minPay = (item.amount / item.validity).toFixed(2);
      }
    });
    if (minPay === Number.POSITIVE_INFINITY) {
      minPay = 0;
    }
    state.navigationBarTitle = res.name || state.navigationBarTitle;
    state.name = res.name || "黑卡会员";
    state.openMemberPrice = res.openMemberPrice ? true : false;
    state.styleImage = res.styleImage ? res.styleImage : IMGAGESPATH.iconVipBg;
    state.benefits = res.benefits;
    state.minPay = minPay;
    if (res.benefits.couponActivityIds && res.benefits.couponActivityIds.length > 0) {
      getVipMemberCoupon();
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
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
            // 积分换券
            if (currentCoupon.score && currentCoupon.score > 0) {
              createCouponOrder(currentCoupon);
            } else {
              couponAssign(currentCoupon.id);
            }
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
              // 积分换券
              if (currentCoupon.score && currentCoupon.score > 0) {
                createCouponOrder(currentCoupon);
              } else {
                couponAssign(currentCoupon.id);
              }
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
  couponService.createCouponOrder(couponActivityId, serviceType, state.storeId, coupon.score).then(res => {
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
        payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
        entry: "COUPON",
        total: res.price
      };
      if (res.price === 0 && coupon.score && coupon.score > 0) {
        // 积分换券
        getOrderStatusById(res.id, self);
      } else {
        couponWXPay(postData);
      }
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
  orderService.getCashPaySign(postData).then(res => {
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
        getOrderStatusById(postData.orderId, that);
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
    } else if (err.code === -1001) {
      state.showTimeout = true;
    } else {
      UTILS.showToast(err.message);
    }
  });
}
function handleGetOrderStatusById(orderId, amount, self) {
  uni.showLoading({
    title: '支付中'
  });
  couponService.getCouponOrderById(orderId).then(result => {
    console.log('查询交易结果-------------');
    console.log(result);
    amount++;
    console.log(amount);
    if (amount > 40) {
      UTILS.setHideLoading(false);
      self.customData.hasAssign = false;
      uni.hideLoading();
      // 弹出支付超时
      self.setData({
        showTimeout: true
      });
      return;
    }
    if (result.status === 'ACQUIRE') {
      UTILS.setHideLoading(false);
      uni.hideLoading();
      UTILS.showToast("领券成功,稍后请到我的优惠券中查看~");
      self.customData.hasAssign = false;
      // 查询未使用券
      self.queryCoupon();
    } else if (result.status === 'ACQUIREFAILED') {
      UTILS.setHideLoading(false);
      uni.hideLoading();
      // 弹出支付超时
      self.setData({
        showTimeout: true
      });
      self.customData.hasAssign = false;
    } else {
      let orderTimeId = setTimeout(() => {
        UTILS.setHideLoading(true);
        // 如果没有成功，调用函数本身，实现重复查询
        self.handleGetOrderStatusById(orderId, amount, self);
      }, 2000);
      self.setData({
        orderTimeId: orderTimeId
      });
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function getOrderStatusById(orderId, self) {
  let amount = 0;
  // self.handleGetOrderStatusById(orderId, amount, self);
  setTimeout(() => {
    self.handleGetOrderStatusById(orderId, amount, self);
  }, 1000);
}
function timeoutPopupClose() {
  state.showTimeout = false;
}
function toPayVipMember() {
  if (state.isEnableVipMember) {
    NAVPAGE.toVIPMemberPay();
  }
}
</script>
<style scoped>
/* pages/mallModule/member/vip/vip.wxss */

.top-info {
  position: relative;
  width: 100%;
  padding-top: 84rpx;
  overflow-x: hidden;
}

.top-info::before {
  content: "";
  display: block;
  width: 200%;
  height: 348rpx;
  background: linear-gradient(-30deg, #f6d468, #ecbb45);
  position: absolute;
  margin-left: -50%;
  top: 0;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  z-index: 0;
}

.top-info .member-box {
  position: relative;
  margin: 0 auto;
  width: 692rpx;
  height: 356rpx;
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
  font-size: 26rpx;
  color: #e0dbce;
  text-align: center;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  position: absolute;
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
  display: flex;
}

.vip-privilege .privilege-list view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-size: 34rpx;
  color: #cfa12a;
  line-height: 90rpx;
  height: 90rpx;
  text-align: center;
  font-weight: bold;
}
</style>