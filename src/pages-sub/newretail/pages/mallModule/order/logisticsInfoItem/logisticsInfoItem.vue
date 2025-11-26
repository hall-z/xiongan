<template>
<!--pages/logisticsInfo/logisticsInfo.wxml-->
<web-view :src="state.trailUrl" v-if="state.trailUrl"></web-view>

</template>
<script setup>
// import { onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/logisticsInfo/logisticsInfo.jsD

//获取应用实例
const state = reactive({
  trailUrl: null,
  navigationBarTitle: "物流信息"
});
onLoad(function (options) {
  uni.hideShareMenu();
  if (options.trailUrl) {
    state.trailUrl = options.trailUrl;
  }
});
</script>
<style scoped>
/* pages/logisticsInfo/logisticsInfo.wxss */
page {
    background: #eeeeee
}
</style>