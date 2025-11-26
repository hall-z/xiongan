<template>
<view class="vip-score-memmber" @click="toScoreVIP" :style="'width: calc(100% - ' + configData.pageMargin * 2 + 'px);margin: ' + (configData.moduleSpacing || 0) + 'px ' + (configData.pageMargin || 0) + 'px;'">
  <image v-if="configData.backGroundType == 'backgroundImage' && configData.backGroundImgObj" class="vip_bg" mode="widthFix" :src="configData.backGroundImgObj ? configData.backGroundImgObj.imageUrl : ''"></image>
  <view class="block" :style="'background: ' + (configData.backGroundType == 'backgroundColor' ? configData.backGroundColor : '') + ';border-radius:' + configData.fillet + 'px'">
      <image class="crown" :src="imagesPath.iconVipCrown"></image>
      <view class="text" v-if="!isVIP && vipType == 'score'">
          <view class="name">花费积分提升会员等级</view>
          <view class="desc">花费{{score}}积分</view>
      </view>
      <view class="text" v-else-if="!isVIP && vipType == 'member'">
        <view class="name">{{vipGradeConfig.description}}</view>
        <view class="desc">下单积分翻倍返还</view>
      </view>
      <view class="text" v-else>
          <view class="name">
              {{vipGradeConfig.name}}
              <text>•福利送不停</text>
          </view>
          <view class="desc">{{vipEndTime}}到期</view>
      </view>
      <view class="button">{{!isVIP ? '立即开通' : '立即续费'}}</view>
  </view>
</view>
</template>
<script setup>
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import { reactive } from "vue";
const app = getApp();

// components/member-page/vip-score-memmber/vip-score-memmber.js
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  vipGradeConfig: app.globalData.systemConfigure.vipGradeConfig
});
const props = defineProps({
  isVIP: {
    // 属性名
    type: Boolean,
    value: false
  },
  score: {
    // 升级所差积分
    type: Number,
    value: 0
  },
  vipEndTime: {
    // 会员到期倒计时
    type: String,
    value: ''
  },
  configData: {
    // 配置项数据
    type: Object,
    value: {}
  },
  vipType: {
    // 会员到期倒计时
    type: String,
    value: 'score'
  },
  hasUserInfo: {
    // 是否有会员信息
    type: Boolean,
    value: true
  },
  isMember: {
    // 是否会员
    type: Boolean,
    value: true
  },
  nextGradeNo: {
    // 下一会员等级
    type: Number,
    value: 0
  }
});
function reload() {
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig;
}
function toScoreVIP() {
  if (state.hasUserInfo && state.isMember) {
    NAVPAGE.toScoreVip(`?nextGradeNo=${state.nextGradeNo}`);
  } else {
    NAVPAGE.toAuthorize();
  }
}
function toVIPMember() {
  if (state.hasUserInfo && state.isMember) {
    NAVPAGE.toVIPMember();
  } else {
    NAVPAGE.toAuthorize();
  }
}
</script>
<style scoped>
/* components/member-page/vip-score-memmber/vip-score-memmber.wxss */
/* 积分购买会员相关 */
.vip-score-memmber {
  width: 100%;
  min-height: 124rpx;
  position: relative;
  box-sizing: border-box;
}
.vip_bg {
  width: 100%;
}

.vip-score-memmber view.block {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  height: 100%;
  /* background-color: #333; */
  /* border-radius: 10rpx; */
  width: 100%;
}

.vip-score-memmber image.crown {
  width: 55rpx;
  height: 47rpx;
  margin-left: 23rpx;
  margin-right: 6rpx;
}

.vip-score-memmber .text {
  width: 438rpx;
}

.vip-score-memmber .text .name {
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: bold;
  color: #ffeba5;
}

.vip-score-memmber .text .name text {
  color: #fff;
}

.vip-score-memmber .text .desc {
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #fff;
  font-style: italic;
  font-size: 22rpx;
  line-height: 42rpx;
}

.vip-score-memmber view .button {
  width: 145rpx;
  height: 45rpx;
  background: #ffeba5;
  border-radius: 23rpx;
  font-size: 24rpx;
  color: #201f1f;
  text-align: center;
  line-height: 45rpx;
  font-weight: bold;
  margin-right: 14rpx;
  margin-left: 11rpx;
}
</style>