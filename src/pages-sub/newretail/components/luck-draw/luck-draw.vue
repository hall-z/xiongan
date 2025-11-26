<template>
<!--components/luck-draw/luck-draw.wxml-->
<view class="luckdraw">
  <image class="text" :src="luckDrawText"></image>
  <view class="main">
    <image class="luckdraw-box" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/luckdraw.png"></image>
    <view class="content">
      <view class="line">
        <image class="img2" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/line1.png" :animation="animationData2" :style="defaultStyle"></image>
        <image class="img1" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/line1.png" :animation="animationData1" :style="defaultStyle"></image>
        <image class="default" v-if="showDefault" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/line1.png"></image>
      </view>
      <view class="line">
        <image class="img2" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/line2.png" :animation="animationData4" :style="defaultStyle"></image>
        <image class="img1" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/line2.png" :animation="animationData3" :style="defaultStyle"></image>
        <image class="default" v-if="showDefault" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/line2.png"></image>
      </view>
      <view class="line">
        <image class="img2" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/line3.png" :animation="animationData6" :style="defaultStyle"></image>
        <image class="img1" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/line3.png" :animation="animationData5" :style="defaultStyle"></image>
        <image class="default" v-if="showDefault" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/line3.png"></image>
      </view>
    </view>
  </view>
  <form v-if="status === 'UNSTART' || status === 'FALSE'" :hidden="!(hasUserInfo && !afterShareToDraw)" @submit="handleClick">
    <button form-type="submit" :class="'btn ' + (disabled ? 'disabled' : 'flicker')" :disabled="disabled"><image :src="imagesPath.haveatry"></image></button>
  </form>
  <button v-if="status === 'UNSTART' || status === 'FALSE'" :hidden="hasUserInfo" :class="'btn ' + (disabled ? 'disabled' : 'flicker')" :disabled="disabled" @click="getUserInfo"><image :src="imagesPath.haveatry"></image></button>
  <button v-if="status === 'UNSTART' || status === 'FALSE'" :hidden="!(hasUserInfo && afterShareToDraw)" :class="'btn ' + (disabled ? 'disabled' : 'flicker')" :disabled="disabled" open-type="share" data-type="luckDraw"><image :src="imagesPath.haveatry"></image></button>
</view>
</template>
<script setup>
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import { reactive , watch} from "vue";
const app = getApp();
// components/luck-draw/luck-draw.js
const wxaUserService = _apiWxaUserServiceJs;
const auth = _utilsAuthJs;
const UTILS = _utilsUtilsJs;
const IMGAGESPATH = _utilsImagesPathJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  rate: 1,
  // 比率，用于不同分辨率设备兼容
  defaultStyle: '',
  // 图片默认的位置样式，用于多次抽奖是初始化位置
  disabled: false,
  // “点击抽奖”按钮是否可用，即控制抽奖是否可执行
  showDefault: true,
  // 是否展示默认图片
  animationData1: {},
  // 第一列的第一个图片的动画
  animationData2: {},
  // 第一列的第二个图片的动画
  animationData3: {},
  // 第二列的第一个图片的动画
  animationData4: {},
  // 第二列的第二个图片的动画
  animationData5: {},
  // 第三列的第一个图片的动画
  animationData6: {},
  // 第三列的第二个图片的动画
  btnAnimation: {},
  // 按钮的呼吸动画
  hasResult: false,
  // 是否有抽奖结果，用于控制抽奖动画的结束
  isWinPrice: false,
  // 抽奖结果，是否中奖
  resultPrice: 0,
  // 抽奖结果 0 代表为中奖
  afterShareToDraw: false
});
const props = defineProps({
  myProperty: {
    // 属性名
    type: String,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    value: '',
    // 属性初始值（可选），如果未指定则会根据类型选择一个
  },
  status: {
    //抽奖结果
    type: String,
    value: 'UNSTART',
    //抽奖结果 UNSTART 未启动 START 创建 TRUE 有结果 FALSE 没有结果 END 结束
  },
  isSameTime: {
    // 三列动画是否同时启动
    type: Boolean,
    value: false // 默认不同时启动
  },
  endTime: {
    // 结束时间，5，代表5个循环后结束，数值越大，动画时间越长
    type: Number,
    value: 5
  },
  luckDrawText: {
    type: String,
    value: './image/text.png'
  },
  hasUserInfo: {
    //用户是否授权
    type: Boolean,
    value: false
  },
  referencePage: {
    type: String,
    value: "popup" // popup luckDraw
  }
});
function attached() {
  console.log('抽奖 attached');
  const baseWidthUnit = 375; // 以iPhone6的分辨率为基准
  let windowWidth = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo()
  }.windowWidth;
  let rate = windowWidth / baseWidthUnit; // 计算出当前设备分辨率与标准分辨率的比率
  let afterShareToDraw = false;
  if (app.globalData.uiconfig && app.globalData.uiconfig.afterShareToDraw) {
    afterShareToDraw = app.globalData.uiconfig.afterShareToDraw;
  }
  // 设置按钮的缩放动画
  // var animation = wx.createAnimation({
  //   duration: 1000,
  //   timingFunction: 'linear',
  // })
  // animation.scale(1.05, 1.05).step().scale(1, 1).step();
  // var btnTime = setInterval(function () {
  //   animation.scale(1.05, 1.05).step().scale(1, 1).step();
  //   this.setData({
  //     btnAnimation: animation
  //   })
  // }.bind(this), 1000);
  state.rate = rate;
  state.afterShareToDraw = state.referencePage === "popup" ? afterShareToDraw : false;
}
function moved() {}
function detached() {}
function onShow() {}
function onHide() {}
function onResize() {}
function onMyButtonTap() {}
function _myPrivateMethod() {
  // 这里将 data.A[0].B 设为 'myPrivateData'
  state.A[0].B = 'myPrivateData';
}
function _propertyChange(newVal, oldVal) {
  console.log(newVal, oldVal);
}
function _statusChange(newVal, oldVal) {
  console.log(newVal, oldVal);
  if (newVal === 'TRUE') {
    setTimeout(function () {
      this._setResult(true);
    }.bind(this), 2000);
  } else if (newVal === 'FALSE') {
    setTimeout(function () {
      this._setResult(false);
    }.bind(this), 2000);
  } else if (newVal === 'END') {
    setTimeout(function () {
      this._setResult(false);
    }.bind(this), 2000);
  }
}
function _handleTouchStart() {
  state.bottom = '80rpx';
}
function _handleTouchEnd() {
  state.bottom = '86rpx';
}
function _initData() {
  // 隐藏默认图片, 按钮置为不可用，数据初始化
  state.showDefault = false;
  state.disabled = true;
  state.resultPrice = 0;
  state.hasResult = false;
  state.defaultStyle = 'transform:translateY(0px);';
}
function _handleClick() {
  //告诉外面用户已经点击抽奖
  _userhandleClick(true);
  // 点击后触发抽奖动画
  // 判断是否设置三列动画同时启动，如果不同时启动，设置为1秒内的任意毫秒数
  let oneLineTime = 0;
  let twoLineTime = 0;
  let threeLineTime = 0;
  if (state.isSameTime) {
    oneLineTime = 0;
    twoLineTime = 0;
    threeLineTime = 0;
  } else {
    // 1s内的任意毫秒数
    oneLineTime = parseInt(Math.random() * 1000);
    twoLineTime = parseInt(Math.random() * 1000);
    threeLineTime = parseInt(Math.random() * 1000);
  }
  _initData();
  setTimeout(function () {
    this._handleAnimate(1);
  }.bind(this), oneLineTime);
  setTimeout(function () {
    this._handleAnimate(2);
  }.bind(this), twoLineTime);
  setTimeout(function () {
    this._handleAnimate(3);
  }.bind(this), threeLineTime);
  // 模拟结束
  // setTimeout(function () {
  //   this._setResult(true)
  // }.bind(this), 4000)
}
function _handleAnimate(line, duration) {
  const durationTime = duration ? duration : 400; // 动画的循环时间，默认800ms，改变这个值可以改变动画的快慢
  const loopTime = durationTime / 4 * 3; // 循环周期时间计算公式，一张图中有三个选项，加上显示区的那一项，共四个，除以4代表每一项走过显示区的时间
  const moveUnit = 85 * state.rate; // 移动单位，也是当前抽奖区域可见内容的高度，每移动一个项目的高度，该参数用于控制动画的移动距离
  let animation = uni.createAnimation({
    duration: durationTime,
    timingFunction: 'linear'
  });
  // 第一张图先执行一次动画
  animation.translateY(moveUnit * 4).step().translateY(0).step({
    duration: 0
  });
  if (line === 1) {
    state.animationData1 = animation;
  } else if (line === 2) {
    state.animationData3 = animation;
  } else if (line === 3) {
    state.animationData5 = animation;
  }
  let count = 1;
  let time = setInterval(function () {
    // 如果抽奖有了结果，根据结果，执行对应的中奖或者未中奖处理
    if (this.data.hasResult) {
      clearInterval(time);
      this._handleAnimateEnd(moveUnit, line, count);
    } else {
      animation.translateY(moveUnit * 4).step().translateY(0).step({
        duration: 0
      });
      this._handleSetData(animation, count, line);
    }
    count++;
  }.bind(this), loopTime);
}
function _setResult(result) {
  // 如果中奖，将中奖结果设为一致，三种结果，任选一种作为最后的结果
  let tempRes = parseInt(Math.random() * 30);
  let res = 1; // 中奖结果，1代表显示结果为第一种
  if (tempRes >= 0 && tempRes < 10) {
    res = 1;
  } else if (tempRes >= 10 && tempRes < 20) {
    res = 2;
  } else {
    res = 3;
  }
  state.hasResult = true;
  state.isWinPrice = result;
  state.resultPrice = result ? res : 0;
}
function _handleAnimateEnd(moveUnit, line, count) {
  // 需要重新申请一个动画，作为结束动画
  let animation = uni.createAnimation({
    duration: 2000,
    timingFunction: 'linear'
  });
  if (state.isWinPrice) {
    let res = state.resultPrice; // 中奖的结果
    let templateData = [[3, 2, 1], [2, 1, 3], [1, 3, 2]];
    let calcNum = templateData[line - 1][res - 1];
    animation.translateY(moveUnit * calcNum).step({
      duration: 0
    }); // 这里需要设置duration为0，否则，动画不能按照预期停止，图片会停到最初的位置
    _handleSetData(animation, count, line);
  } else {
    // 如果不中奖，将中奖结果设为不一致
    animation.translateY(moveUnit).step({
      duration: 0
    }); // 如果没有中奖，三列图片皆向下滚动一格，三列均为不同的图片，显示为未中奖
    _handleSetData(animation, count, line);
  }
  // 抽奖结束后，可继续抽奖
  state.disabled = false;
}
function _handleSetData(animation, count, line) {
  if (count % 2 === 0) {
    if (line === 1) {
      state.animationData1 = animation;
    } else if (line === 2) {
      state.animationData3 = animation;
    } else if (line === 3) {
      state.animationData5 = animation;
    }
  }
  if (count % 2 === 1) {
    if (line === 1) {
      state.animationData2 = animation;
    } else if (line === 2) {
      state.animationData4 = animation;
    } else if (line === 3) {
      state.animationData6 = animation;
    }
  }
}
function _userhandleClick(val) {
  let userDraw = {
    userDraw: val
  }; // detail对象，提供给事件监听函数
  let option = {}; // 触发事件的选项
  triggerEvent('draw', userDraw, option);
}
function handleClick(e) {
  console.log(e);
  if (app.globalData.userInfo) {
    // 调用内部点击事件
    _handleClick();
  } else {
    // 返回这个用户不是粉丝
    queryIsFans(false);
  }
}
function queryIsFans(isFans) {
  let self = this;
  state.isActive = false;
  let isFans = {
    isFans: isFans
  }; // detail对象，提供给事件监听函数
  let option = {}; // 触发事件的选项
  triggerEvent('fans', isFans, option);
}
function getUserInfo(e) {
  const that = this;
  wxaUserService.login(true).then(res => {
    // console.log(res)
    auth.setUser(res);
    app.globalData.userInfo = res && res.member ? res : null;
    state.hasUserInfo = true;
    if (!state.afterShareToDraw) {
      handleClick();
    }
    if (res.member) {
      auth.getDistributor();
      auth.bindDistribution();
      uni.setStorage({
        key: "wj_member",
        data: res.member
      });
    }
    // 告诉外部会员是粉丝了
    queryIsFans(true);
  }).catch(err => {
    // console.log(err)
    state.hasUserInfo = false;
    if (err.message.indexOf("auth deny") >= 0) {
      uni.showToast({
        title: "您拒绝了授权~",
        icon: 'none',
        duration: 2000
      });
    } else {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    }
  });
}

// Watch listeners converted from observers
watch(() => props.myProperty, (newVal, oldVal) => {
  // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
});

watch(() => props.status, (newVal, oldVal) => {
  // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        _statusChange(newVal, oldVal);
});

</script>
<style scoped>
/* components/luck-draw/luck-draw.wxss */
.luckdraw {
  text-align: center;
}
.text {
  width: 457rpx;
  height: 180rpx;
  /* width: 609rpx;
  height: 196rpx; */
  margin-top: 100rpx;
  margin-bottom: 60rpx;
}
.main {
  width: 618rpx;
  height: 270rpx;
  position: relative;
  margin-left: 87rpx;
  margin-right: 45rpx;
  text-align: center;
}
.main .luckdraw-box {
  width: 618rpx;
  /* width: 750rpx; */
  height: 262rpx;
}
.btn {
  margin-top: 100rpx;
  width: 415rpx;
  height: 100rpx;
  padding: 0;
  background: transparent;
}
.btn image {
  width: 100%;
  height: 100%;
}
.btn::after {
  border: none;
}
.luckdraw-text {
  position: absolute;
  width: 424rpx;
  height: 60rpx;
  left: 95rpx;
  bottom: 80rpx;
  font-size: 36rpx;
  color: #ffffff;
}
.content {
  width: 518rpx;
  height: 170rpx;
  position: absolute;
  top: 46rpx;
  /* left: 113rpx; */
  left: 31rpx;
  display: flex;
  justify-content: space-between;
}
.content .line {
  width: 170rpx;
  height: 170rpx;
  border-radius: 14rpx;
  overflow: hidden;
  position: relative;
}
.content .line image {
  width: 170rpx;
  height: 510rpx;
  border-radius: 14rpx;
  position: absolute;
  left: 0px;
  top: -510rpx;
}
.content .line .default {
  top: 0rpx;
}
.content .line .default-img {
  top: 0rpx;
}
/* button[disabled] {
  color: rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 102, 0, 5);
} */
button.disabled {
  opacity: 0.6;
}
.flicker {
  animation: flicker 2s ease-in-out infinite;
  -webkit-animation: flicker 2s ease-in-out infinite;
}
@keyframes flicker {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1.08, 1.08);
  }
  50% {
    transform: scale(1, 1);
  }
  75% {
    transform: scale(1.08, 1.08);
  }
  100% {
    transform: scale(1, 1);
  }
}
.flicker2 {
  animation: flicker2 1.5s ease-in-out infinite;
  -webkit-animation: flicker2 1.5s ease-in-out infinite;
}
@keyframes flicker2 {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1.08, 1.08);
  }
}
</style>