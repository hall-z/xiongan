<template>
<!--pages/mallModule/member/grade/grade.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<image class="page" :src="state.gradeDescriptionPicture" mode="widthFix"></image>
</template>
<script setup>
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/member/grade/grade.js
const sysService = _apiSystemServiceJs;
//获取应用实例
const state = reactive({
  navigationBarTitle: "等级说明",
  gradeDescriptionPicture: ""
});
onLoad(function (options) {
  uni.hideShareMenu();
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.member = app.globalData.userInfo.member;
    getUiConfig();
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function getUiConfig() {
  const that = this;
  if (app.globalData.gradeDescriptionPicture !== "") {
    state.gradeDescriptionPicture = app.globalData.gradeDescriptionPicture;
  } else {
    sysService.query("gradeDescriptionPicture").then(res => {
      if (res && res.length > 0 && res[0].value != null && res[0].value !== "") {
        let data = res[0].value;
        if (data && data !== "") {
          app.globalData.gradeDescriptionPicture = data;
          state.gradeDescriptionPicture = data;
        }
      }
    });
  }
}
</script>
<style scoped>
/* pages/mallModule/member/grade/grade.wxss */

page {
  font-size: 0;
}

.page {
  width: 750rpx;
}

</style>