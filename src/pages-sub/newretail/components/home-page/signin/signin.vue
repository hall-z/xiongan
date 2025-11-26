<template>
<!--components/home-page/signin/signin.wxml-->
<view class="modal-box" :hidden="!signModal" data-type="signIn" @click="clickBlank">
  <view class="modal-body" @click.stop="clickBody">
    <view :class="'modal-content sign-in ' + (memberScore.signed === false ? 'unSignIn' : 'signIned')">
      <image lazy-load="" class="sign-main-bg" :src="memberScore.signed === false ? imagesPath.iconSignBg2 : imagesPath.iconSignBg1" mode="widthFix"></image>
      <view class="sign-main-bg-box"></view>
      <view class="sign-bg">
        <view class="sign-tips">
          已累计签到
          <text>{{memberScore.daysCount}}</text> 天
        </view>
        <view class="sign-content" v-if="memberScore.signed === false">
          <view class="sign-text" v-if="memberScore.score">
            今日签到获得
            <text>{{memberScore.score}}</text> 积分
          </view>
          <view class="sign-coupon" v-if="memberScore.coupons && memberScore.coupons.length > 0">
            {{memberScore.score ? "" : "今日签到"}}获得以下优惠券
            <scroll-view class="sign-coupon-view" scroll-y="">
              <view class="sign-coupon-item" v-for="(item , index) in memberScore.coupons" :key="activityName">
                <text>{{item.activityName}}</text>
                <text>{{item.quantity}}张</text>
              </view>
            </scroll-view>
          </view>
        </view>
        <view class="sign-content" v-if="memberScore.signed === true">
          <view class="sign-text">请勿重复签到</view>
        </view>
        <button class="button-box" data-type="signIn" @click="clickBlank">
          <image lazy-load="" :src="imagesPath.iconSigninBtn"></image>
        </button>
      </view>
    </view>
  </view>
</view>
</template>
<script setup>
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { ready } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
const app = getApp();
// components/home-page/signin/signin.js
const memberService = _apiMemberServiceJs;
const THEME = _utilsThemeManagerJs;
const UTILS = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const AUTHORIZE = _utilsAuthorizeJs;
const IMGAGESPATH = _utilsImagesPathJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  signModal: false,
  memberScore: {}
});
const props = defineProps({
  show: {
    // 属性名
    type: Boolean,
    value: false
  }
});
ready(function () {
  inSignIn = false;
});
function memberSignIn() {
  const that = this;
  if (inSignIn) {
    console.log("已经在签到中");
    return;
  }
  inSignIn = true;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      memberService.signin().then(res => {
        inSignIn = false;
        uni.hideLoading();
        console.log(res);
        let tempData = {
          ...res,
          signed: false
        };
        state.memberScore = tempData;
        state.signModal = true;
      }).catch(e => {
        inSignIn = false;
        console.log(e);
        if (app.globalData.userInfo.member) {
          let postData = {
            page: 1,
            pageSize: 0,
            memberIdEquals: app.globalData.userInfo.member.id
          };
          memberService.querySignin(postData).then(res => {
            uni.hideLoading();
            console.log(res);
            if (res.records && res.records.length > 0) {
              let now = new UTILS.ResponseDate();
              let date = UTILS.formatTime(now).replace(/\//g, '-');
              let time = date.split(' ');
              res.records.forEach(item => {
                let tempTime = item.signinTime.split(' ');
                if (tempTime[0] === time[0]) {
                  let tempItem = {
                    ...item,
                    signed: true
                  };
                  state.memberScore = tempItem;
                  state.signModal = true;
                }
              });
            }
          });
        } else {
          uni.showToast({
            title: e.message,
            icon: 'none',
            duration: 2000
          });
        }
      });
    } else {
      inSignIn = false;
      uni.showToast({
        title: "您还不是会员，请绑定手机号成为会员~",
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        NAVPAGE.toAuthorize();
      }, 2000);
    }
  } else {
    inSignIn = false;
    NAVPAGE.toAuthorize();
  }
}
function clickBlank(val) {
  if (val.currentTarget.dataset.type === 'signIn') {
    state.signModal = false;
    triggerEvent("close");
  }
}
function clickBody() {}

// Watch listeners converted from observers
watch(() => props.show, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal) {
          memberSignIn();
        } else {
          state.signModal = false;
        }
});

</script>
<style scoped>
/* components/home-page/signin/signin.wxss */
/* 弹出框 */
.modal-box {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
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
  min-height: 476rpx;
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
.sign-main-bg-box {
  width: 100%;
  height: 89rpx;
}
.sign-bg {
  width: 470rpx;
  min-height: 327rpx;
  background: #fff;
  border-radius: 14rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 74rpx;
  /* position: relative; */
  /* position: absolute;
  left: 0;
  bottom: 0;
  z-index: -1; */
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
  margin-top: 83rpx;
  position: relative;
}
.sign-in .sign-tips text {
  color: #ffcc43;
}
.sign-in .sign-content {
  margin-top: 102rpx;
  font-size: 25rpx;
  line-height: 36rpx;
  text-align: center;
}
.sign-in .sign-text {
  font-size: 30rpx;
  line-height: 36rpx;
}
.sign-in .sign-text text {
  font-size: 33rpx;
  font-weight: bold;
  color: #feb248;
}
.sign-in .sign-coupon {
  text-align: left;
  padding: 40rpx 0 30rpx 0;
  font-size: 26rpx;
}
.sign-in .sign-coupon-view {
  width: 380rpx;
  height: 72rpx;
  font-size: 30rpx;
  line-height: 36rpx;
  font-weight: bold;
  padding-top: 18rpx;
}
.sign-in .sign-coupon-item {
  width: 380rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sign-in .sign-coupon-item text:first-of-type {
  display: block;
  width: 240rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
}
.sign-in .button-box {
  position: absolute;
  bottom: 32rpx;
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
button::after {
  border: 0;
}
</style>