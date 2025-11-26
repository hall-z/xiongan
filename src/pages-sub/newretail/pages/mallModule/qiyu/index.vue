<template>

</template>
<script setup>
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
// pages/qiyu/index.js
const state = reactive({});
onLoad(function (options) {
  const myPluginInterface = requirePlugin('myPlugin');
  console.log(myPluginInterface, 'myPluginInterface');
  // 替换为自己企业的相关信息
  let value = uni.getStorageSync('wj_member');
  let userInfo = {
    userId: value.id,
    data: [{
      "key": "mobile_phone",
      "value": value.mobile
    }]
  };
  myPluginInterface._$setUserInfo(userInfo);
  myPluginInterface._$configAppKey('1ac0fe5015a836ca0a8bfb8795c357e0'); //七鱼平台key
  myPluginInterface.__configAppId('ZcvrClwVVXT'); //七鱼平台id，不是小程序id
  let title = options.title ? options.title : ''; //商品名称
  let description = options.description ? options.description : ''; //商品描述
  let sellPrice = options.sellPrice ? '￥' + options.sellPrice : ''; //商品价格
  let picture = options.picture ? options.picture : ''; //商品图片
  let product = {
    title: title,
    desc: description,
    note: sellPrice,
    picture: picture,
    url: 'https://www.taobao.com/',
    isShow: 1,
    //访客端显示商品消息 默认false
    sendByUser: 1 //是否需要用户手动发送 默认false
  };
  if (title) {
    myPluginInterface._$configProduct(product); //添加商品卡片
    myPluginInterface._$sendProduct(product); //主动发送卡片
  }
  myPluginInterface._$configFullScreen(true); //全面屏适配
  uni.redirectTo({
    url: 'plugin://myPlugin/chat'
  }); //七鱼平台自带页面
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
/* pages/qiyu/index.wxss */
</style>