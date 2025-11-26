<template>
<!--pages/memberModule/qiyu/index.wxml-->
<view class="contentbox">正在跳转客服</view>

</template>
<script setup>
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiRequestJs from "@/service/api/newretail/request";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
// pages/qiyu/index.js
let request = _apiRequestJs;
const sysService = _apiSystemServiceJs;
const state = reactive({});
onLoad(async function (options) {
  const myPluginInterface = requirePlugin('myPlugin');
  console.log(myPluginInterface, 'myPluginInterface');
  // 替换为自己企业的相关信息
  let value = uni.getStorageSync('wj_member');
  let tags = '';
  await sysService.getMemberLabel(value.id).then(tagData => {
    if (tagData && tagData.length > 0) {
      tagData.forEach((item, index) => {
        tags += (index > 0 ? ',' : '') + item.name;
      });
    }
  });
  let userInfo = {
    userId: value && value.id ? value.id : '',
    data: [{
      "key": "mobile_phone",
      "value": value.mobile
    }, {
      "key": "tags",
      "label": '标签',
      'value': tags
    }]
  };
  myPluginInterface._$setUserInfo(userInfo);
  myPluginInterface._$configAppKey('1ac0fe5015a836ca0a8bfb8795c357e0'); //七鱼平台key
  myPluginInterface.__configAppId('ZcvrClwVVXT'); //七鱼平台id，不是小程序id
  let title = options.title ? options.title : ''; //商品名称
  let description = options.description ? options.description : ''; //商品描述
  let sellPrice = options.sellPrice ? '￥' + options.sellPrice : ''; //商品价格
  let picture = options.picture ? options.picture : ''; //商品图片
  let path = '';
  await sysService.query('kefuUrl').then(kefuUrl => {
    if (kefuUrl && kefuUrl.length > 0) {
      path = kefuUrl[0].value;
    }
  });
  let product = {
    // cardType: options.cardType ? options.cardType : 0,
    goodsId: options.goodsId ? options.goodsId : null,
    title: title,
    desc: description,
    note: sellPrice,
    picture: picture,
    // path ? path : 
    url: options.goodsId ? request.BASE_URL + 'newretail-admin/#/product/productMain/productAdd?id=' + options.goodsId : request.BASE_URL + 'newretail-admin/#/dashboard',
    isShow: 1,
    //访客端显示商品消息 默认false
    sendByUser: 1 //是否需要用户手动发送 默认false
  };
  if (options.cardType == 1) {
    product = {
      // orderId: options.orderId,
      // cardType: 1,
      goodsId: options.goodsId ? options.goodsId : null,
      title: '订单号：' + options.orderId,
      desc: options.orderStatus,
      note: sellPrice,
      picture: picture,
      url: path ? path + options.orderId : request.BASE_URL + 'newretail-admin/#/order/orderBill/details?orderId=' + options.orderId,
      isShow: 1,
      //访客端显示商品消息 默认false
      sendByUser: 1 //是否需要用户手动发送 默认false
    };
  }
  if (title || options.orderId) {
    myPluginInterface._$configProduct(product); //添加商品卡片
    myPluginInterface._$sendProduct(product); //主动发送卡片
    myPluginInterface._$onClickAction((data, navigateTo) => {
      console.log('点击事件参数', data);
      // 注意此处必须使用navigateTo
      // navigateTo({
      //   url: `/pages/test/index?id=${data.extraParam.id}`
      // })
    });
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
/* pages/memberModule/qiyu/index.wxss */
.contentbox{
    width: 100vw;
    height: 100vh;
    line-height: 100vh;
    text-align: center;
}
</style>