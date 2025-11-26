<template>
<!--components/coupon/score-coupon/score-coupon.wxml-->
<text>components/coupon/score-coupon/score-coupon.wxml</text>

</template>
<script setup>
import { reactive } from "vue";
// components/coupon/score-coupon/score-coupon.js
const state = reactive({});
const props = defineProps({});
</script>
<style scoped>
/* components/coupon/score-coupon/score-coupon.wxss */
/* .coupon-item-top {
  margin: 22rpx 0 0 0;
  position: relative;
  font-size: 24rpx;
  color: #8b8b8c;
}

.coupon-item-top image {
  width: 89rpx;
  height: 58rpx;
  margin-top: 10rpx;
}

.coupon-item-top>text {
  display: block;
  position: relative;
}

.coupon-item-top .name {
  font-size: 32rpx;
  line-height: 42rpx;
  color: #454545;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 14rpx;
}

.coupon-item-top .name text {
  color: #ff8561;
  font-size: 40rpx;
  margin-right: 10rpx;
  font-style: italic;
}

.coupon-item-top .time {
  font-size: 20rpx;
  line-height: 26rpx;
  color: #8b8b8c;
  margin-top: 19rpx;
}

.coupon-item-bottom {
  position: absolute;
  height: 70rpx;
  line-height: 70rpx;
  bottom: 24rpx;
  left: 60rpx;
  width: 629rpx;
  display: flex;
  align-items: center;
} */
/* 
.coupon-item-bottom .time {
  font-size: 20rpx;
  line-height: 70rpx;
  display: block;
  color: #999999;
  margin-left: 10rpx;
}

.coupon-item-bottom .condition {
  font-size: 20rpx;
  line-height: 70rpx;
  display: inline-block;
  color: #8b8b8c;
  width: 408rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coupon-item-bottom .use {
  margin-right: 42rpx;
  padding-right: 27rpx;
  font-size: 24rpx;
  float: right;
  color: #009f55;
  position: relative;
}

.coupon-item-bottom .use .coupon-item-right-point {
  width: 12rpx;
  height: 21rpx;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -11.5rpx;
}

.use-box .coupon-item-top .name,
.use-box .coupon-item-top .name>text,
.unable .coupon-item-top .name,
.unable .coupon-item-top .name>text {
  color: #8b8b8c;
}

.use-box .coupon-item-bottom .use,
.unable .coupon-item-bottom .use {
  background: transparent;
  padding-right: 0;
  color: #8b8b8c;
} */

/* .main-coupon-function {
  width: 150rpx;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff7120;
  font-size: 45rpx;
  font-weight: bolder;
  padding: 20rpx 20rpx 0rpx 0rpx;
} */
/* 
.main-coupon-detail {
  width: calc(100% - 150rpx);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20rpx 0rpx;
  justify-content: space-around;
}

.main-coupon-detail-title {
  font-size: 32rpx;
  color: #222221;
}

.mini-function {
  font-size: 20rpx;
  background-color: #ededed;
  width: 80rpx;
  height: 30rpx;
  border-radius: 15rpx;
  color: #afafaf;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}

.main-coupon-score-value {
  font-size: 20rpx;
  background-color: #FF8105;
  min-width: 100rpx;
  padding: 0 17rpx;
  height: 30rpx;
  border-radius: 15rpx;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}

.main-coupon-detail-desc {
  font-size: 20rpx;
  color: #666666;
  margin-top: 10rpx;
}

.coupon-time-expand-board {
  width: auto;
  display: flex;
  justify-content: space-between;
  background-color: white;
  margin-top: -4rpx;
  padding: 10rpx 20rpx;
}

.coupon-time-baord {
  display: flex;
}

.coupon-time-icon {
  width: 20rpx;
  height: 20rpx;
  flex-shrink: 0;
}

.coupon-time-label {
  font-size: 26rpx;
  color: #a7a6a7;
  margin-left: 10rpx;
}

.coupon-rule-btn {
  width: 100rpx;
  height: 30rpx;
  font-size: 26rpx;
}

.coupon-head-info {
  display: flex;
  align-items: baseline;
}

.coupon-unabled {
  color: #a7a6a7 !important;
}

.exchange-btn-board-coupon {
  width: 160rpx;
  height: 48rpx;
  background: rgba(255, 113, 33, 1);
  border-radius: 4rpx;
  font-size: 24rpx;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  line-height: 48rpx;
  position: absolute;
  right: 70rpx;
  bottom: 35rpx;
}*/

.coupon-shu .coupon-item {
    /* padding: 20rpx 17rpx; */
    height: 230rpx;
    box-sizing: border-box;
    position: relative;
}
.coupon-shu .main-coupon {
    width: 690rpx;
    height: 230rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.coupon-shu .main-coupon-function {
    position: relative;
    width: 194rpx;
    height: 170rpx;
}
.coupon-shu .coupon-bg {
    width: 194rpx;
    height: 170rpx;
    position: absolute;
    left: 0;
    top: 0;
}
.coupon-shu .coupon-head-info {
    width: 194rpx;
    height: 170rpx;
    position: relative;
    display: flex;
    text-align: center;
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 70rpx;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
} 
.price-icon {
    font-size: 28rpx;
    position: relative;
    top: 14rpx;
}
.coupon-shu .main-coupon-detail {
    width: 430rpx;
    display: flex;
    flex-direction: column;
}
.coupon-shu .main-coupon-detail-title {
    height: 73rpx;
    font-family: Source Han Sans CN;
    font-size: 28rpx;
    color: #333333;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

}
.main-coupon-detail-desc {
    font-family: Source Han Sans CN;
    font-size: 20rpx;
    color: #999999;
}
.coupon-item-bottom {
font-family: Source Han Sans CN;
font-weight: 400;
font-size: 20rpx;
color: #999999;
white-space: nowrap;
}
.coupon-bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
}
.main-coupon-score-value {
font-family: Source Han Sans CN;
font-size: 30rpx;
color: #FC6700;
}
.small-font {
    display:inline-block;
    font-size: 12px;
    position: relative;
    left: -5rpx;
    transform: scale(0.7);
    top: 0rpx;
}
.coupon-shu .exchange-btn-board-coupon {
    width: 134rpx;
height: 50rpx;
background: #FC6700;
border-radius: 25rpx;
text-align: center;
line-height: 50rpx;
font-family: Source Han Sans CN;
font-size: 24rpx;
color: #FFFFFF;
}
.coupon {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 30rpx;
}
.coupon-heng {
    display: flex;
    flex-wrap: wrap;
}
.coupon-board{
    padding: 0 30rpx;
    margin-bottom: 20rpx;
}
.coupon-heng .coupon-item{
    width: 334rpx;
    height: 535rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    overflow: hidden;
}
.coupon-heng .main-coupon-function {
    width: 334rpx;
    height: 315rpx;
    background: #FFFFFF;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.coupon-heng .coupon-bg {
    width: 255rpx;
    height: 224rpx;
    position: absolute;
    left: 50%;
    margin-left: -127rpx;
    top: 50%;
    margin-top: -113rpx;
}
.coupon-heng .coupon-head-info {
    width: 255rpx;
    height: 224rpx;
    position: relative;
    display: flex;
    text-align: center;
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 70rpx;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
}
.coupon-heng .main-coupon-detail {
    display: flex;
    flex-direction: column;
padding: 0 17rpx;
font-family: Source Han Sans CN;
}
.coupon-heng .main-coupon-detail-title {
    height: 73rpx;
    font-family: Source Han Sans CN;
    font-size: 28rpx;
    color: #333333;
}
.coupon-heng .exchange-btn-board-coupon {
    width: 114rpx;
    height: 50rpx;
background: #FC6700;
border-radius: 25rpx;
text-align: center;
line-height: 50rpx;
font-family: Source Han Sans CN;
font-size: 24rpx;
color: #FFFFFF;
}
</style>