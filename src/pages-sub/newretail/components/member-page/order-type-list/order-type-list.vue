<template>
<view :style="'width: calc(100% - ' + configData.pageMargin * 2 + 'px);margin: ' + (configData.moduleSpacing || 0) + 'px ' + (configData.pageMargin || 0) + 'px'">
  <view class="order-type-box" :style="'background-color: ' + (configData.backGroundType == 'backgroundColor' ? configData.backGroundColor : '') + ';border-radius:' + configData.fillet + 'px'">
    <image v-if="configData.backGroundType == 'backgroundImage' && configData.backGroundImgObj" class="bg" mode="widthFix" :src="configData.backGroundImgObj ? configData.backGroundImgObj.imageUrl : ''"></image>
    <view class="all-order">
        <view>
            <text>全部订单</text>
        </view>
        <view @click="toAllOrder">
            <text>查看全部订单</text>
            <image :src="imagesPath.iconRight2"></image>
        </view>
    </view>
    <view class="order-type-list">
        <view @click="toOrderMenu" :style="'background-color: ' + configData.iconBackGroundColor" :data-idx="index" :data-status="item.orderEntranceStatus" v-for="(item , index) in imageItems" :key="orderEntranceStatus">
          <image :src="item.imageUrl"></image>
          <view v-if="numObj && numObj[item.orderEntranceStatus] > 0">
              <view class="badge">{{numObj[item.orderEntranceStatus]}}</view>
          </view>
          <text :style="'color: ' + configData.colour">{{item.modelName}}</text>
        </view>
    </view>
    <button v-if="!hasUserInfo" class="authorization" @click="getUserInfo"></button>
  </view>
</view>
</template>
<script setup>
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import { reactive , watch} from "vue";
const app = getApp();
// components/member-page/order-type-list/order-type-list.js
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  isMember: false,
  imageItems: []
});
const props = defineProps({
  configData: {
    // 配置项数据
    type: Object,
    value: {}
  },
  hasUserInfo: {
    // 是否有会员信息
    type: Boolean,
    value: true
  },
  isMemberLogin: {
    // 是否会员
    type: Boolean,
    value: true
  },
  numObj: {
    // 订单类型数据对象
    type: Object,
    value: {}
  }
});
function reload() {
  state.isMember = state.isMemberLogin || !state.configData.loginTips;
}
function toAllOrder() {
  NAVPAGE.toOrderList();
}
function toOrderMenu(val) {
  let entrance = app.globalData.uiconfig.orderStatusEntrance.filter(value => value.orderEntranceStatus != 'SCORE_RECORD');
  //积分兑换记录特殊处理
  if (val.currentTarget.dataset.status == 'SCORE_RECORD') {
    NAVPAGE.toScoreOrder();
    return;
  }
  //线下订单特殊处理
  if (val.currentTarget.dataset.status == 'OFFLINE_ORDER') {
    const opts = '?type=OFFLINE';
    NAVPAGE.toOrderList(opts);
    return;
  }
  // 退款售后特殊处理
  if (val.currentTarget.dataset.status == 'REFUND_AFTERMARKET') {
    NAVPAGE.toRefundList();
    return;
  }
  let idx = -1;
  entrance.some((item, index) => {
    if (item.orderEntranceStatus == val.currentTarget.dataset.status) {
      idx = index;
    }
    return item.orderEntranceStatus == val.currentTarget.dataset.status;
  });
  let selected = idx + 1; //+1是因为列表前面还有全部订单的列表
  let opts = '?selected=' + selected;
  NAVPAGE.toOrderList(opts);
}
function getUserInfo() {
  triggerEvent('getUserInfo');
}

// Watch listeners converted from observers
watch(() => props.value, (newVal, oldVal) => {
  if (newVal) {
          let imageItems = [];
          if (newVal.imageItems) {
            newVal.imageItems.forEach(item => {
              item.modelName = app.globalData.orderStatus && app.globalData.orderStatus[item.orderEntranceStatus] && app.globalData.orderStatus[item.orderEntranceStatus].name;
              if (item.enableStatus) {
                imageItems.push(item);
              }
            });
          }
          state.isMember = state.isMemberLogin || !newVal.loginTips;
          state.imageItems = imageItems;
        }
});

watch(() => props.isMemberLogin, (newVal, oldVal) => {
  state.isMember = newVal || !state.configData.loginTips;
});

</script>
<style scoped>
/* components/member-page/order-type-list/order-type-list.wxss */
/* @import '../../../pages/mallModule/template/bindMobile.wxss'; */
.order-type-box,
.fun-list {
  width: 100%;
  /* background: #fff; */
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
}
.order-type-box > view {
  position: relative;
}
.bg {
  position: absolute;
  left: 0;
  top: 0;
  /* z-index: -1; */
  width: 100%;
}
.order-type-box {
  /* padding-top: 36rpx; */
  /* border-bottom: 20rpx solid #fff; */
  border-radius: 6rpx;
  margin-bottom: 20rpx;
}
.order-type-box .all-order {
  line-height: 80rpx;
  overflow: hidden;
  border-bottom: 1rpx solid #dedede;
  padding: 0 30rpx;
}
.order-type-box .all-order image {
  height: 35rpx;
  vertical-align: middle;
  margin-top: -6rpx;
}
.order-type-box .all-order view:first-of-type {
  float: left;
  font-size: 28rpx;
}
.order-type-box .all-order view:first-of-type image {
  width: 38rpx;
  margin-right: 20rpx;
}
.order-type-box .all-order view:last-of-type {
  float: right;
  font-size: 24rpx;
  color: #8b8b8c;
}
.order-type-box .all-order view:last-of-type image {
  width: 12rpx;
  height: 23rpx;
  vertical-align: middle;
  margin-left: 8rpx;
}
.order-type-box .order-type-list {
  height: 177rpx;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.order-type-box .order-type-list>view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 22rpx;
  line-height: 36rpx;
  color: #4b4b4b;
  position: relative;
  width: 127rpx;
  height: 135rpx;
}
.order-type-box .order-type-list>view image {
  width: 48rpx;
  height: 48rpx;
  position: relative;
  margin-bottom: 18rpx;
}
.order-type-box .order-type-list>view .badge {
  position: absolute;
  right: 8rpx;
  top: 0rpx;
  width: 32rpx;
  height: 32rpx;
  text-align: center;
  line-height: 32rpx;
  font-size: 24rpx;
  color: #fff;
  background: #ff5601;
  border-radius: 16rpx;
}
.order-type-box .order-type-list>view:last-of-type .badge {
  right: -3rpx;
}
.order-type-box .shopping-guide-box {
  padding: 0 30rpx;
}
.order-type-box .shopping-guide-box .shopping-guide-item {
  display: flex;
  justify-content: space-between;
  line-height: 60rpx;
  text-align: center;
  padding: 20rpx 0
}
.order-type-box .shopping-guide-box .shopping-guide-item>view text:first-of-type {
  font-size: 24rpx;
  color: #999;
}
.order-type-box .shopping-guide-box .shopping-guide-item>view text:last-of-type {
  font-size: 40rpx;
  color: #000;
}
.shopping-guide-box .shopping-guide-item .item {
  display: flex;
  flex-direction: column;
}
.order-type-box .shopping-guide-box .exchange-btn button {
  background: #FF9F43;
  width: 100%;
  height: 78rpx;
  line-height: 78rpx;
  color: #fff;
  text-align: center;
  /* box-shadow: 0px 5px 8px 0px rgba(255,140,106,0.4); */
  border-radius: 10px;
  font-size: 30rpx;
}
.order-type-box .shopping-guide-box .exchange-tips {
  line-height: 75rpx;
  text-align: center;
  color: #FF9F43;
  font-size: 26rpx;
}
button.authorization {
  width: 100%;
  height: 100%;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
}
button.authorization::after {
  border: none;
}
</style>