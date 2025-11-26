<template>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<rich-text :nodes="state.htmlText" class="body_text"></rich-text>

</template>
<script setup>
import _apiTreaty from "@/service/api/newretail/treaty";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
// pages/mallModule/treaty/clause/clause.js
const treatySev = _apiTreaty;
const state = reactive({
  navigationBarTitle: '销售条款',
  keys: 'salesTermsRemark',
  htmlText: ''
});
onLoad(function (options) {
  treatySev.queryOptions(state.keys).then(res => {
    console.log(res, "sfsfsdf");
    if (res && res.length > 0) {
      res.forEach(item => {
        if (item.key == state.keys) {
          state.htmlText = item.value;
        }
      });
    }
  });
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/mallModule/treaty/clause/clause.wxss */
page {
    padding: 0 25rpx;
    box-sizing: border-box;
}
</style>