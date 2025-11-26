<template>
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view>
    <!-- <view class="title-box">某某企业余额<image src="../../../../image/san.png"></image> -->

    <picker
      @change="bindMultiPickerChange"
      @columnchange="bindMultiPickerColumnChange"
      :value="state.multiIndex"
      :range="state.multiArray"
      range-key="companyName"
    >
      <view class="title-box">
        {{ state.multiArray[multiIndex].companyName }}
        <!-- <image src="../../../../image/san.png"></image> -->
      </view>
    </picker>
    <view class="balance" v-if="state.multiArray[multiIndex].balance">
      余额：{{ state.multiArray[multiIndex].balance }} 元
    </view>
    <view class="image-box">
      <image :src="state.imagesPath.toc"></image>
    </view>
    <view class="qrcode-boxS">
      <canvas id="mbrbarcode" type="2d" :hidden="canvasHidden"></canvas>
    </view>
    <view class="qrcode-box" @click="xinQrcode">
      <!-- <canvas id="mbrbarcode" type="2d" hidden='{{canvasHidden}}' /> -->
      <canvas id="qrcode" type="2d" :hidden="canvasHidden">
        <view style="text-align: center; color: #cccccc; margin-top: -44rpx; font-size: 25rpx">
          {{ state.time }}秒后二维码刷新
        </view>
      </canvas>
    </view>
  </view>
</template>
<script setup>
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsSelfJs from '@/utils/newretail/self'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/mallModule/member/payment/payment.js
const wxbarcode = _utilsSelfJs
const themeManager = _utilsThemeManagerJs
const ADDRESS = _utilsAddressJs
const couponService = _apiCouponServiceJs
const IMGAGESPATH = _utilsImagesPathJs
// 获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  time: 60,
  loadingtime: '',
  navigationBarTitle: '支付码',
  multiIndex: 0,
  tempList: '',
  multiArray: [],
})
onLoad(function (options) {
  // app.globalData.userInfo.member.id
  getCouponList()
})
function bindMultiPickerChange(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  state.multiIndex = e.detail.value
  showCode(state.multiArray[e.detail.value].cardNo)
}
function getCouponList() {
  const member = app.globalData.userInfo.member
  let tempList = []
  const postData = {
    page: 1,
    pageSize: 100,
    memberId: member.id,
  }
  const that = this
  couponService
    .queryMspAccountList(postData)
    .then((res) => {
      if (res.records && res.records.length > 0) {
        tempList = res.records
      }
      let newArr = []
      newArr = [].concat(tempList) // newArr为一个新的数组，不是简单的赋值引用
      function compare(property) {
        return function (a, b) {
          const value1 = a[property]
          const value2 = b[property]
          return value2 - value1
        }
      }
      newArr.sort(compare('balance'))
      state.tempList = tempList
      state.multiArray = newArr
      showCode(newArr[0].cardNo)
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
  const loadingtime = setInterval(() => {
    let time = state.time
    if (time > 0) {
      time--
    } else {
      time = 60
      xinQrcode()
    }
    state.time = time
  }, 1000)
  state.loadingtime = loadingtime
}
function xinQrcode() {
  console.log('有进入？')
  showCode(state.multiArray[state.multiIndex].cardNo)
}
function showCode(codeText) {
  const that = this
  const data = {
    cardNo: codeText,
  }
  // console.log('baocuo?')
  couponService.getMspCardCode(data).then((res) => {
    // let codeTextA = '123456'
    // wxbarcode.barcode('barcode', codeText, 629, 166);
    wxbarcode.qrcode('qrcode', res, 426, 426)
    wxbarcode.barcode('mbrbarcode', res, 506, 150)
    state.showCode = true
  })
}
onReady(function () {})
onShow(function () {})
onHide(function () {})
onUnload(function () {
  clearInterval(state.loadingtime)
})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {})
</script>
<style scoped>
page {
  background-color: #f3f2f6;
  position: relative;
}

.image-box {
  width: 695rpx;
  height: 1170rpx;
  /* margin: 0 auto; */
  position: absolute;
  top: 238rpx;
  left: 50%;
  transform: translateX(-50%);
}

.image-box > image {
  width: 100%;
  height: 100%;
}

.qrcode-box {
  position: absolute;
  top: 651rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 426rpx;
  height: 486rpx;
}

.qrcode-box canvas {
  width: 486rpx;
  height: 486rpx;
}

.title-box {
  font-size: 29rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: #646464;
  position: absolute;
  top: 280rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1111;
}

.title-box > image {
  width: 17rpx;
  height: 17rpx;
  margin-left: 20rpx;
}

.balance {
  position: absolute;
  top: 384rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 111;
  font-size: 29rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: #646464;
  text-align: center;
}
.qrcode-boxS {
  position: absolute;
  top: 456rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 486rpx;
  height: 486rpx;
}
</style>
