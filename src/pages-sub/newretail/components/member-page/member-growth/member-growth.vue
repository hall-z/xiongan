<template>
<!--components/member-page/member-growth/member-growth.wxml-->
<view class="growth-area" @click="toBenefits" :style="'width: calc(100% - ' + configData.pageMargin * 2 + 'px);margin: ' + (configData.moduleSpacing || 0) + 'px ' + (configData.pageMargin || 0) + 'px'">
  <image v-if="configData.backGroundType == 'backgroundImage' && configData.backGroundImgObj" class="growth_bg" mode="widthFix" :src="configData.backGroundImgObj ? configData.backGroundImgObj.imageUrl : ''"></image>
  <view class="growth-content" :style="'background: ' + (configData.backGroundType == 'backgroundColor' ? configData.backGroundColor : '') + ';border-radius:' + configData.fillet + 'px'">
    <view class="more-equities">
        <view>
            <image class="wallet-img" :src="imagesPath.iconMemberPackage"></image>
            <text>已节省<text :style="'color: ' + themeColor">{{memberGrowth.customerSavingsAmt}}</text>元</text>
        </view>
        <view v-if="configData.isShowLegalRight">
            <text>查看会员权益</text>
            <image :src="imagesPath.iconRight2"></image>
        </view>
    </view>
    <view class="growth-progress">
        <view class="now-score" :style="'left: ' + progress + '%;'">
            <view class="score-box" :style="'background: ' + themeColor + ';'">{{memberGrowth.growthValue}}</view>
            <view class="trigon" :style="'border-top: 6rpx solid' + themeColor + ';'"></view>
        </view>
        <view class="progress-cover" :style="'background: ' + themeColor + ';width: ' + progress + '%;'"></view>
        <view class="progress">
            <view class="score-style progress-start" :style="'left: 7%;color:' + themeColor">
                <view class="grade-text"></view>
                <view class="start-point" :style="'border: 6rpx solid ' + themeColor"></view>
                <view class="score">{{memberGrowth.currentGradeValue}}</view>
            </view>
            <view v-if="grading" class="score-style progress-grading" :style="'left:45%;color:' + (changeStyle ? themeColor : '')">
                <view class="grade-text">保级</view>
                <view v-if="changeStyle" class="start-point" :style="'border: 6rpx solid ' + themeColor">
                </view>
                <view v-else class="grading-point"></view>
                <view class="score">{{memberGrowth.relegationGrowthValue}}</view>
            </view>
            <view v-if="upgrade" class="score-style progress-upgrade" style="left:82%;">
                <view class="grade-text">升级</view>
                <view class="grading-point"></view>
                <view class="score">{{memberGrowth.nextGradeValue}}</view>
            </view>
        </view>
    </view>
    <view class="growth-bottom">
        <view v-if="showUpgrade">
            <view v-if="memberGrowth.relegationNeedGrowth">
                距离保级分数
                <text>+{{memberGrowth.relegationNeedGrowth}}</text>
            </view>
            <view v-else-if="memberGrowth.updateNeedGrowth">
                距离升级分数
                <text>+{{memberGrowth.updateNeedGrowth}}</text>
            </view>
        </view>
        <view v-else>当前已是最高等级</view>
        <view v-if="showUpgrade && configData.isShowGradeValidity">
            当前等级有效期
            <text>{{memberGrowth && memberGrowth.gradeValidityPeriod}}</text>
        </view>
    </view>
  </view>
</view>
</template>
<script setup>
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import { reactive } from "vue";
const app = getApp();

// components/member-page/member-growth/member-growth.js
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  themeColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : '#d9d9d9'
});
const props = defineProps({
  progress: {
    // 当前进度
    type: Number,
    value: 80
  },
  grading: {
    // 保级值是否存在
    type: Boolean,
    value: true
  },
  upgrade: {
    // 升级值是否存在
    type: Boolean,
    value: true
  },
  changeStyle: {
    // 是否改变样式
    type: Boolean,
    value: true
  },
  showUpgrade: {
    // 是否显示升级差距
    type: Boolean,
    value: true
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
  memberGrowth: {
    // 会员成长值区域信息
    type: Object,
    value: {}
  },
  configData: {
    // 配置项数据
    type: Object,
    value: {}
  }
});
function reload() {
  if (app.globalData.uiconfig) {
    state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#d9d9d9';
  }
}
function toBenefits() {
  if (state.hasUserInfo && state.isMember) {
    NAVPAGE.toBenefits();
  } else {
    NAVPAGE.toAuthorize();
  }
}
</script>
<style scoped>
/* components/member-page/member-growth/member-growth.wxss */
.growth-area {
  width: 100%;
  min-height: 252rpx;
  position: relative;
  /* border-radius: 6rpx; */
  /* margin-bottom: 20rpx; */
  /* background-color: #fff; */
}
.growth_bg {
  width: 100%;
}
.growth-area .growth-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.growth-area .more-equities {
  line-height: 70rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
}

.growth-area .more-equities view:first-of-type {
  font-size: 28rpx;
}

.growth-area .more-equities view:first-of-type image {
  width: 34rpx;
  height: 28rpx;
  margin-right: 6rpx;
}

.growth-area .more-equities view:last-of-type {
  font-size: 24rpx;
  color: #8b8b8c;
}

.growth-area .more-equities view:last-of-type image {
  width: 12rpx;
  height: 23rpx;
  vertical-align: middle;
  margin-left: 8rpx;
}

.growth-area .growth-progress {
  position: relative;
  width: 100%;
  height: 120rpx;
  margin-bottom: 10rpx;
  padding: 0 50rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.growth-area .growth-progress .progress-cover {
  position: absolute;
  height: 6rpx;
  border-radius: 6rpx;
  margin: auto;
}

.growth-area .growth-progress .now-score {
  position: absolute;
  bottom: 85rpx;
  line-height: 35rpx;
  font-size: 24rpx;
  font-weight: bold;
  padding-right: 8rpx;
  border-radius: 3rpx;
  color: #fff;
  z-index: 1;
}

.growth-area .growth-progress .now-score .score-box {
  position: relative;
  /* padding: 0 10rpx; */
  width: 80rpx;
  text-align: center;
  float: right;
  border-radius: 6rpx;
}

.growth-area .growth-progress .now-score .trigon {
  position: relative;
  float: right;
  top: 32rpx;
  margin-right: -55%;
  width: 0;
  height: 0;
  border-right: 6rpx solid transparent;
  border-left: 6rpx solid transparent;
}

.growth-area .growth-progress .progress {
  width: 100%;
  height: 6rpx;
  border-radius: 6rpx;
  margin: auto;
  background-color: #8b8b8c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.growth-area .growth-progress .progress .score-style {
  position: absolute;
  width: 80rpx;
  height: 120rpx;
}

.growth-area .growth-progress .progress .score-style .grade-text {
  width: 80rpx;
  height: 30rpx;
  line-height: 30rpx;
  text-align: center;
  font-size: 24rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.growth-area .growth-progress .progress .score-style .start-point {
  width: 30rpx;
  height: 30rpx;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 50%;
  margin: auto;
  z-index: 10;
}

.growth-area .growth-progress .progress .score-style .grading-point {
  width: 30rpx;
  height: 30rpx;
  background-color: #8b8b8c;
  border-radius: 50%;
  margin: auto;
  z-index: 10;
}

.growth-area .growth-progress .progress .score-style .score {
  width: 80rpx;
  text-align: center;
  height: 30rpx;
  font-size: 24rpx;
  font-weight: bold;
  line-height: 30rpx;
  margin-top: 15rpx;
}

.growth-area .growth-bottom {
  padding: 0 50rpx 20rpx 50rpx;
  font-size: 20rpx;
  color: #8b8b8c;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.growth-area .growth-bottom view:first-of-type {
  flex-shrink: 0;
}

.growth-area .growth-bottom view:last-of-type {
  text-align: right;
}

.growth-area .growth-bottom view text {
  font-size: 24rpx;
  color: #1b1b1d;
  font-weight: bold;
}
</style>