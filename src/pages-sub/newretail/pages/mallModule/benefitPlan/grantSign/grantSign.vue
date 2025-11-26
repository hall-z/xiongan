<template>
<view>
    <bao-wecom-signature title="确认发放人员及发放积分" style="height: 800rpx" backgroundColor="#fff" @confirm="confirm" @cancel="cancel" :buttonList="['cancel', 'reset', 'confirm']"></bao-wecom-signature>
</view>
</template>
<script setup>
import _apiWelfarePlanServiceJs from "@/service/api/newretail/welfarePlanService";
import _apiRequestJs from "@/service/api/newretail/request";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
// pages/mallModule/benefitPlan/grantSign/grantSign.js
const request = _apiRequestJs;
const welfarePlanService = _apiWelfarePlanServiceJs;
const state = reactive({
  ids: [],
  notClickFlag: false
});
onLoad(function (options) {
  let ids = uni.getStorageSync('signList') ? JSON.parse(uni.getStorageSync('signList')) : [];
  state.ids = ids;
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function confirm(e) {
  if (state.notClickFlag) return false;
  state.notClickFlag = true;
  let that = this;
  uni.showLoading({
    title: '签收中，请稍候'
  });
  uni.uploadFile({
    url: request.BASE_URL + '/newretail/api/dfs/upload',
    //仅为示例，非真实的接口地址
    filePath: e.detail.path,
    name: 'file',
    formData: {
      'user': 'test'
    },
    header: {
      "wxa-appid": request.APP_ID
    },
    success: function (res) {
      try {
        let data = res.data;
        let tempData = JSON.parse(data);
        welfarePlanService.grantSgin({
          ids: state.ids,
          url: tempData.data.url
        }).then(signRes => {
          state.notClickFlag = false;
          uni.hideLoading();
          uni.showToast({
            title: '签收成功',
            icon: 'none',
            duration: 2000,
            success: () => {
              setTimeout(() => {
                uni.switchTab({
                  url: '/pages-sub/newretail/pages/mallModule/index/index/index'
                });
              }, 700);
            }
          });
        }).catch(error => {
          state.notClickFlag = false;
          uni.hideLoading();
          uni.showToast({
            title: error.message,
            icon: 'none',
            duration: 2000
          });
        });
      } catch (error) {
        state.notClickFlag = false;
        uni.hideLoading();
        uni.showToast({
          title: error.message,
          icon: 'none',
          duration: 2000
        });
      }
    },
    fail: function (e) {
      state.notClickFlag = false;
      uni.hideLoading();
      console.log(e.message);
    }
  });
}
function cancel() {
  uni.navigateBack();
  // wx.switchTab({
  //   url: '/pages-sub/newretail/pages/mallModule/index/index/index'
  // })
}
</script>
<style scoped>
/* pages/mallModule/benefitPlan/grantSign/grantSign.wxss */
.page-c {
    height: 80vh;
}
.hand-c {
    height: 78vh;
}
.btn {
    width: 80rpx;
    height: 60rpx !important;
    font-size: 32rpx !important;
    text-align: center;
    line-height: 60rpx !important;
}
</style>