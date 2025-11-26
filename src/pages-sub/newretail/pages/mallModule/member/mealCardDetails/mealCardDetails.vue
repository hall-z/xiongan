<template>
<!-- pages/myCoupon/myCoupon.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="coupon-main" v-if="state.accountDetail">
    <view class="coupon-item-box">
        <view class="coupon-available">
            <view :key="index">
                <!-- <coupon-item bind:onClickCouponItem="clickCouponItem" coupon="{{item}}"></coupon-item> -->
                <!-- components/coupon/coupon-receive/coupon-receive.wxml -->
                <view class="coupon-item">
                    <view class="main-coupon">
                        <view class="main-coupon-code">
                            <image :src="imagesPath.iconCouponQRCode" mode="widthFix" lazy-load="false"></image>
                        </view>
                        <view class="main-coupon-function">
                            <view>
                                {{state.accountDetail.companyName}}
                            </view>
                        </view>
                        <view class="main-coupon-detail">
                            <text class="main-coupon-detail-title">{{state.accountDetail.cardNoA}}</text>
                            <!-- <view class="coupon-time-label"
                                hidden="{{item.function !== 'CASH' || !item.useAmountLimit}}">
                                满{{item.useAmountLimit}}可用</view>
                            <text>{{item.nr_condition}}</text> -->
                            <!-- <view class="mini-function">{{coupon.nr_function}}</view> -->
                        </view>
                        <view>
                            <text>{{state.accountDetail.memberName}}</text> <text> | </text> <text>卡余额：￥{{state.accountDetail.balance}}</text>
                        </view>
                    </view>
                </view>
            </view>

        </view>

    </view>
  

</view>
<view class="tip" v-if="false">
  <view>
    充值说明
  </view>
  <view>
    1、充值前烦请确认充值账户无误，充值后不可更改；
  </view>
  <view>
    2、充值前请确认正确的充值金额，且充值金额符合您的需求和预期，充值成功后不可退款；
  </view>
  <view>
    3、请确认您已了解充值后不可退款的政策，并同意在充值后不再提出退款要求；
  </view>
  <view>
    4、如果您对充值金额的使用有任何疑问或需要帮助，请联系我们的客服团队。
  </view>
  <view>
    感谢您的理解与支持，祝您购物愉快！
  </view>
</view>
<view>
    <view class="input-box">
        <input type="digit" @input="get_value" placeholder="请输入充值金额">
    </view>
    <view class="caret-btn" @click="caretBtn">
        确认充值
    </view>
</view>


</template>
<script setup>
import _apiRequestJs from "@/service/api/newretail/request";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsCouponHandler from "@/utils/newretail/couponHandler";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import couponItem from '@/pages-sub/newretail/components/coupon/coupon-item4/coupon-item.vue';
const app = getApp();

// pages/myCoupon/myCoupon.js
const couponService = _apiCouponServiceJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const couponHandler = _utilsCouponHandler;
const wxbarcode = _utilsSelfJs;
const themeManager = _utilsThemeManagerJs;
const ADDRESS = _utilsAddressJs;
const request = _apiRequestJs;
//获取应用实例
const state = reactive({
  navigationBarTitle: "余额充值",
  accountDetail: null,
  cardNo: null,
  now_val: null //充值金额
});
onLoad(function (options) {
  let cardNo = options.cardno;
  if (cardNo) {
    state.cardNo = cardNo;
    canRechange = true;
    getMspAccountDetailA(cardNo);
  }
});
function get_value(data) {
  let now_val = data.detail.value;
  state.now_val = now_val;
}
function toPayRecharge() {
  const that = this;
  let mspCardNo = state.cardNo;
  // if (!that.canRechange) {
  //     // 当前已经在充值中
  //     return;

  // }

  canRechange = false;
  let postData = {
    mspCardNo: mspCardNo,
    sourceType: 'WX_XCX',
    total: state.now_val,
    memberId: app.globalData.userInfo.member.id
  };
  couponService.createOrder(postData).then(res => {
    let orderId = res.id;
    let tempData = {
      orderId: orderId,
      payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
      openId: uni.getStorageSync('__user__').wxaUser.openId
    };
    couponService.getPaySign(tempData).then(res => {
      let resData = JSON.parse(res);
      let sign = JSON.parse(resData.sign);
      let packageValue = '';
      if (tempData.payMethod === 'SWIFTPASS' || tempData.payMethod === 'DINGFUTONG') {
        packageValue = sign.package;
      } else if (tempData.payMethod === 'WX_MINI_APP' || tempData.payMethod === 'WXA_ISV_PAY') {
        packageValue = sign.packageValue;
      }
      uni.requestPayment({
        'timeStamp': sign.timeStamp,
        'nonceStr': sign.nonceStr,
        'package': packageValue,
        'signType': sign.signType,
        'paySign': sign.paySign,
        'success': function (res) {
          canRechange = true;
          // that.getBalance()
          uni.showToast({
            title: '充值成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              setTimeout(item => {
                uni.navigateBack({
                  delta: -1
                });
              }, 1500);
            }
          });
        },
        'fail': function (res) {
          console.log('支付失败');
          console.log(res);
          canRechange = true;
          if (res.errMsg.indexOf("cancel") >= 0) {
            uni.showToast({
              title: '充值失败',
              icon: "error"
            });
          } else {
            uni.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    }).catch(err => {
      canRechange = true;
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }).catch(e => {
    canRechange = true;
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function caretBtn() {
  console.log('有进入？');
  let now_val = state.now_val;
  if (state.cardNo) {
    if (!state.accountDetail.onlineCharge) {
      uni.showToast({
        title: '该余额不支持充值业务',
        icon: 'none'
      });
      return;
    }
  }
  if (!now_val) {
    uni.showToast({
      title: '请输入充值金额',
      icon: 'none'
    });
  } else {
    toPayRecharge();
    // let data = {
    //     cardNo: this.data.cardNo,
    //     amount: now_val
    // }
    // couponService.recharge(data)
    //     .then(res => {
    //         if (res) {
    //             wx.showToast({
    //                 title: '充值成功',
    //                 icon: 'success',
    //                 success: function (params) {
    //                     setTimeout(arr => {
    //                         wx.navigateBack({
    //                           delta: -1,
    //                         })
    //                     }, 1000)
    //                 }
    //             })
    //         } else {
    //             wx.showToast({
    //                 title: '充值失败',
    //                 icon: "error"
    //             })
    //         }
    //     })
    //     .catch(err => {
    //         wx.showToast({
    //             title: '充值失败',
    //             icon: "error"
    //         })
    //     })
  }
}
function getMspAccountDetailA(cardNo) {
  let data = {
    cardNo
  };
  let that = this;
  couponService.getMspAccountDetail(data).then(res => {
    if (res) {
      res.cardNoA = codeTextPartition(res.cardNo);
      state.accountDetail = res;
    }
  });
}
onReady(function () {});
onShow(function () {});
onHide(function () {
  uni.hideLoading();
});
onUnload(function () {
  uni.hideLoading();
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function codeTextPartition(val) {
  console.log(val);
  val = val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
  console.log(val);
  return val;
}
function catchtouchmove() {}
</script>
<style scoped>
/* pages/myCoupon/myCoupon.wxss */

page {
    /* background-color: #f3f2f6; */
    height: 100%;
    width: 100%;
}

.input-box {
    width: 670rpx;
    height: 100rpx;
    background: #FFFFFF;
    border: 1rpx solid #E1E1E1;
    border-radius: 10rpx;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.input-box>input {
    font-size: 33rpx;
    text-align: center;
    color: #6D6D6D;

}

.caret-btn {
    width: 670rpx;
    height: 100rpx;
    background: #F2A358;
    border-radius: 10rpx;
    text-align: center;
    line-height: 100rpx;
    color: #fff;
    font-size: 33rpx;
    font-family: PingFang SC;
    font-weight: 500;
    margin: 0 auto;
    margin-top: 53rpx;
}

.coupon-main {
    width: 100%;
    /* height: calc(100% - 130rpx); */
    /* background-color: #f3f2f6; */
}

.coupon-nav {
    overflow: hidden;
    height: 108rpx;
    width: 100%;
    line-height: 108rpx;
    display: flex;
    border-top: 2rpx solid #e6e6e6;
    background: #fff;
    color: #8b8b8c;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
}

.coupon-nav>view {
    font-size: 32rpx;
}

.selected {
    flex: 1;
    color: #009f55;
    border-bottom: 5rpx solid #009f55;
    text-align: center;
}

.select {
    flex: 1;
    text-align: center;
}

/*券列表  */

.show {
    display: block;
    /* background-color: #f3f2f6; */
}

.hidden {
    display: none;
    background-color: #f3f2f6;
}

.coupon-item-box {
    padding: 21rpx 21rpx 25rpx 21rpx;
    /* margin-top: 110rpx; */
    background: #fff;
    /* border-top: 20rpx solid #f1f1f1; */
    min-height: 100%;
    /* background-color: #f3f2f6; */
}

coupon-item:last-of-type {
    margin-bottom: 0;
}

.no-data {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.no-data image {
    width: 242rpx;
    height: 261rpx;
    margin-top: 200rpx;
}

.no-data button {
    color: #009f55;
    border: 1rpx solid #009f55;
    margin-top: 50rpx;
    width: 242rpx;
    height: 60rpx;
    background: #fff;
}

.coupon-bottom-box {
    width: 100%;
    height: 122rpx;
    margin-top: 24rpx;
    font-size: 24rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    /* background-color: #f3f2f6; */
}

.coupon-bottom-box view {
    height: 36rpx;
    padding: 0 30rpx;
}

.coupon-data {
    border-right: 1rpx solid #f0f0f0;
    color: #8b8b8c;
}

.coupon-history {
    font-size: 24rpx;
    color: #009f55;
    display: flex;
    justify-content: center;
    align-items: center;
}

.coupon-history image {
    width: 11rpx;
    height: 20rpx;
    margin-left: 8rpx;
    margin-top: 2rpx
}

.loading {
    color: #999;
    font-size: 28rpx;
    line-height: 80rpx;
    height: 80rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    /* background: #eee; */
}

movable-area {
    height: 100%;
    width: 100%;
}

.movable-view {
    width: 120rpx;
    height: 120rpx;
    position: fixed;
    right: 0;
    bottom: 120rpx;
}

movable-view {
    width: 120rpx;
    height: 120rpx;
}

.content {
    width: 100%;
    height: 100%;
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

.spinner>view {
    background-color: #009f55;
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
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
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
        -webkit-transform: scaleY(1.0);
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
        transform: scaleY(1.0);
        -webkit-transform: scaleY(1.0);
    }
}

.popup-coupon-code-box {
    background: #ffffff;
    width: 708rpx;
    height: 900rpx;
    border-radius: 10rpx;
}

.popup-top-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    padding-top: 22rpx;
    margin-bottom: 12rpx;
}

.popup-top-info text {
    font-size: 30rpx;
    color: #000000;
    line-height: 50rpx;
    margin-top: 6rpx;
    margin-bottom: 36rpx;
}

.popup-top-info .popup-coupon-code-tips {
    color: #B0B0B0;
    margin: 0;
}

.popup-top-info .logo {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
}

.coupon-code-box {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.coupon-code {
    width: 629rpx;
    height: 166rpx;
}

.barcode-box {
    width: 629rpx;
    height: 166rpx;
    margin: 0 auto;
}

.barcode-box canvas {
    width: 629rpx;
    height: 166rpx;
    margin: 0 auto;
}

/* components/coupon/coupon-receive/coupon-receive.wxss */

.coupon-item {
    width: 670rpx;
    min-height: 249rpx;
    padding-bottom: 20rpx;
    overflow: hidden;
    margin: 0 auto;
    box-sizing: border-box;
    /* padding: 15rpx 0rpx; */
    font-size: 24rpx;
    color: #8b8b8c;
    position: relative;
    display: flex;
    flex-direction: column;
}

.coupon-item .coupon-bg {
    width: 708rpx;
    height: 338rpx;
    position: absolute;
    top: 0;
    left: 0;
}

.coupon-item image.coupon-logo {
    width: 89rpx;
    height: 58rpx;
    margin-top: 10rpx;
    position: relative;
}

.coupon-item button {
    width: 160rpx;
    height: 60rpx;
    background: #ff762a;
    color: #fff;
    font-size: 26rpx;
    border: none;
    padding: 0rpx;
    line-height: 60rpx;
    position: absolute;
    right: 40rpx;
    bottom: 0rpx;
}

.use-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FF7121;
    border-radius: 4rpx;
    width: 160rpx;
    height: 50rpx;
    color: #ff762a;
    font-size: 26rpx;
    color: #fff;
    padding: 0rpx;
    position: absolute;
    right: 40rpx;
    bottom: 0rpx;
    border: 2rpx solid #ff762a;
}

.coupon-item .sign-unable-btn {
    background: #e6e6e6;
}

.coupon-item .coupon-info {
    width: 450rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
}

.coupon-item .name {
    font-size: 32rpx;
    color: #454545;
    font-weight: bold;
    margin: 10rpx 0rpx 20rpx 0;
    position: relative;
}

.coupon-item .name text {
    color: #ff8561;
    font-size: 36rpx;
    font-style: oblique;
    margin: 0rpx 10rpx;
}

.coupon-item .coupon-bottom {
    position: absolute;
    bottom: 40rpx;
    left: 50rpx;
    width: 600rpx;
}

.coupon-item .coupon-bottom .remain-count {
    float: right;
}

.coupon-item .coupon-bottom .remain-count text {
    color: #ff8561;
}

.coupon-price {
    color: #ffbf00;
    font-size: 28rpx;
    line-height: 188rpx;
    width: 165rpx;
    text-align: center;
}

.coupon-price text {
    font-size: 48rpx;
    font-weight: bold;
}

.coupon-price.discount text {
    font-size: 36rpx;
}

.coupon-price.freeship text {
    font-size: 36rpx;
}

.coupon-middle {
    width: calc(100% - 165rpx);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.coupon-middle .name {
    font-size: 32rpx;
    color: #020202;
    line-height: 36rpx;
    margin-bottom: 30rpx;
    margin-top: 9rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.coupon-middle .condition {
    font-size: 24rpx;
    line-height: 36rpx;
    color: #686868;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.main-coupon {
    position: relative;
    background-color: #FD8514;
    width: 670rpx;
    height: 100%;
    border-radius: 20rpx;

    position: relative;
    color: #fff;
    padding: 0rpx 30rpx 20rpx;
    box-sizing: border-box;
}

.main-coupon-code {
    position: absolute;
    right: 0;
    top: 0;
    width: 50rpx;
    height: 50rpx;
}

.main-coupon-code image {
    width: 50rpx;
    height: 50rpx;
}

.main-coupon-function {
    /* width: 232rpx; */
    /* height: 150rpx; */
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center; */
    font-size: 33rpx;
    font-weight: Medium;
    padding-top: 20rpx;
    font-family: SourceHanSansCN-Medium;
    /* padding-left: 24rpx;
    box-sizing: border-box;*/
}

.main-coupon-detail {
    /* width: calc(100% - 252rpx); */
    /* display: flex; */
    /* flex-direction: column; */
    /* align-items: flex-start; */
    margin: 20rpx 0rpx;
    justify-content: space-around;
    color: #666666;
}

.main-coupon-detail-title {
    font-size: 67rpx;
    color: #fff;
    /* color: #3e3e3e; */
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.mini-function {
    font-size: 20rpx;
    background-color: #ededed;
    width: 80rpx;
    height: 30rpx;
    border-radius: 15rpx;
    color: #999999;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;
}

.coupon-time-expand-board {
    width: auto;
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding: 10rpx 20rpx;
}

.coupon-time-baord {
    display: flex;
}

.coupon-time-icon {
    width: 20rpx;
    height: 20rpx;
}

.coupon-time-label {
    font-size: 22rpx;
    color: #666666;
}

.coupon-rule-btn {
    width: 100rpx;
    height: 30rpx;
    font-size: 26rpx;
}

.coupon-head-info {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
}

.coupon-seperator {}

.qrcode-box {
    margin-top: 28rpx;
    width: 290rpx;
    height: 290rpx;
}

.qrcode-box canvas {
    width: 290rpx;
    height: 290rpx;
}

.coupon-code-box text {
    width: 100%;
    display: block;
    font-size: 34rpx;
    color: #333333;
    line-height: 42rpx;
    margin-top: 19rpx;
    text-align: center;
}
.tip {
  padding: 0 40rpx;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
}
</style>