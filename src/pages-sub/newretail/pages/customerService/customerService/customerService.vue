<template>
<!--pages/customerService/customerService/customerService.wxml-->
<web-view :src="state.completePath" v-if="state.showFlag"></web-view>
</template>
<script setup>
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
// pages/customerService/customerService/customerService.js
const state = reactive({
  path: 'https://www.soboten.com/chat/h5/v2/index.html?useWxjs=true&channelid=4',
  sysnum: '58101ee8e1974ecb9d4bda45de68832f',
  completePath: '',
  showFlag: false,
  customField: {
    gender: 'customField7',
    // 性别
    vipEndTime: 'customField8',
    // 等级有效期
    birthday: 'customField9',
    // 生日
    store: 'customField11',
    // 访问门店
    gradeName: 'customField12' // 等级
  }
});
onLoad(function (options) {
  let customField = {};
  let customFieldKey = Object.keys(state.customField);
  let member = uni.getStorageSync('wj_member');
  let store = uni.getStorageSync('storeIdactive');
  if (member) {
    customFieldKey.forEach(key => {
      if (key == 'gender') {
        customField[state.customField[key]] = member[key] == 'FEMALE' ? '女' : member[key] == 'MALE' ? '男' : null;
      } else if (key == 'store') {
        customField[state.customField[key]] = store.name;
      } else {
        customField[state.customField[key]] = member[key];
      }
    });
  }
  oldCustomer(options, customField);
});
function oldCustomer(options, customField) {
  if (options.sysnum) {
    state.sysnum = options.sysnum;
  }
  let completePath = state.path + '&sysnum=' + state.sysnum;
  let path = '';
  if (options.cardType == 1) {
    path = encodeURIComponent("/pages-sub/newretail/pages/mallModule/order/orderDetails/orderDetails?orderId=" + options.orderId + "&status=" + options.orderStatus);
  } else if (options.goodsId) {
    let goodPath = '';
    let goodPageData = options.goodPageData ? JSON.parse(options.goodPageData) : {};
    let keyList = Object.keys(goodPageData);
    keyList.forEach(key => {
      goodPath += '&' + key + '=' + goodPageData[key];
    });
    path = encodeURIComponent('/pages-sub/newretail/pages/mallModule/goods/goodsDetail/goodsDetail?' + goodPath.replace('&', ''));
  }
  if (options.cardType == 1) {
    let goods = [{
      name: options.orderId,
      pictureUrl: encodeURIComponent(options.picture)
    }];
    completePath += '&order_status=0&goods_count=' + (options.goodsCount || 1) + '&status_custom=' + options.orderStatus + '&total_fee=' + (options.sellPrice ? options.sellPrice * 100 : 0) + '&order_url=' + path + '&create_time=' + (options.createTime ? new Date(options.createTime).getTime() : new Date().getTime()) + '&order_code=' + options.orderId + '&goods=' + JSON.stringify(goods);
  } else if (options.goodsId) {
    completePath += '&card_title=' + options.title + '&card_url=' + path + '&card_note=￥' + options.sellPrice + '元&card_picture=' + encodeURIComponent(options.picture) + '&card_desc=' + options.description;
  }
  let member = uni.getStorageSync('wj_member');
  if (member) {
    completePath += '&realname=' + member.nickName + '&tel=' + member.mobile;
  }
  if (customField) {
    completePath += '&customer_fields=' + JSON.stringify(customField);
  }
  state.completePath = completePath;
  state.showFlag = true;
}
function newCustomer(options, customField) {
  if (options.sysnum) {
    state.sysnum = options.sysnum;
  }
  let completePath = state.path + '&sysnum=' + state.sysnum;
  let additionalPath = {
    customCardAmountSymbol: '¥'
  };
  let card_info = {
    cardId: new Date().getTime() + (options.orderId || options.goodsId),
    cardType: options.cardType == 1 ? 0 : 1,
    cardGuide: options.cardType == 1 ? '订单明细' : '商品明细',
    customCards: [],
    cardTrigger: 2
  };
  // 新版客服处理逻辑
  if (options) {
    let keys = Object.keys(options);
    keys.forEach(key => {
      if (key == 'title') {
        additionalPath.customCardName = options[key];
      } else if (key == 'description') {
        additionalPath.customCardDesc = options[key];
      } else if (key == 'picture') {
        additionalPath.customCardThumbnail = encodeURIComponent(options[key]);
      } else if (key == 'orderId') {
        additionalPath.customCardId = options[key];
        additionalPath.customCardCode = options[key];
        additionalPath.customCardName = options[key];
      } else if (key == 'goodsId') {
        additionalPath.customCardId = options[key];
      } else if (key == 'cardType') {
        // 卡片类型 0 订单， 1 商品
        additionalPath.cardType = options[key] == 1 ? 0 : 1;
      } else if (key == 'orderStatus') {
        additionalPath.customCardStatus = options[key];
      } else if (key == 'sellPrice') {
        additionalPath.customCardAmount = options[key];
      }
    });
  }
  // let cardMenus = []
  let path = '';
  if (options.cardType == 1) {
    path = encodeURIComponent("/pages-sub/newretail/pages/mallModule/order/orderDetails/orderDetails?orderId=" + options.orderId + "&status=" + options.orderStatus);
  } else if (options.goodsId) {
    let goodPath = '';
    let goodPageData = options.goodPageData ? JSON.parse(options.goodPageData) : {};
    let keyList = Object.keys(goodPageData);
    keyList.forEach(key => {
      goodPath += '&' + key + '=' + goodPageData[key];
    });
    path = encodeURIComponent('/pages-sub/newretail/pages/mallModule/goods/goodsDetail/goodsDetail?' + goodPath.replace('&', ''));
  }
  // 新版客服处理逻辑
  card_info.miniProgramUrl = path;
  additionalPath.customMiniProgramUrl = path;
  card_info.cardMenus = [{
    "menuType": 0,
    "menuName": "查看详情",
    "menuMiniProgramUrl": path,
    "menuLinkType": 2
  }, {
    "menuType": 2,
    "menuName": "发送"
  }];
  card_info.customCards = [additionalPath];
  completePath += options.orderId || options.goodsId ? '&card_info=' + JSON.stringify(card_info) : '';
  let member = uni.getStorageSync('wj_member');
  if (member) {
    completePath += '&realname=' + member.nickName + '&tel=' + member.mobile;
  }
  if (customField) {
    completePath += '&customer_fields=' + JSON.stringify(customField);
  }
  state.completePath = completePath;
  state.showFlag = true;
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/customerService/customerService/customerService.wxss */
</style>