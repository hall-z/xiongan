<template>
<!-- pages/addRemarks/addRemarks.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
  <form @submit="formSubmit">
    <view class="remark-box">
      <textarea id="remark" name="remark" placeholder="请输入您要备注的信息..." :value="state.remark" maxlength="50" @input="handelTextArea"></textarea>
      <label for="remark">{{state.wordCount}}/50</label>
    </view>
    <view class="btn-box">
      <button class="cancel" :style="'border: 1rpx solid ' + state.themeColor + ';color: ' + state.themeColor" @click="formReset">取消</button>
      <button class="confirm" :style="'background: ' + state.themeColor" form-type="submit">确定</button>
    </view>
  </form>
</view>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/addRemarks/addRemarks.js
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "添加备注",
  remark: '',
  wordCount: 0,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor')
});
function handelTextArea(val) {
  console.log(val.detail.value, "输入字符串");
  if (val.detail.cursor <= 50) {
    state.remark = val.detail.value;
    state.wordCount = val.detail.cursor;
    if (val.detail.cursor == 50) {
      uni.showToast({
        title: '备注信息最多不超过50个字符哦~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    uni.showToast({
      title: '备注信息最多不超过50个字符哦~',
      icon: 'none',
      duration: 2000
    });
  }
}
function formSubmit(e) {
  let tempData = state.remark;
  console.log(tempData, "确定按钮");
  try {
    uni.setStorageSync('wj_addRemarks', tempData);
    uni.navigateBack({
      delta: 1
    });
  } catch (e) {
    console.log(e);
  }
}
function formReset(e) {
  try {
    uni.navigateBack({
      delta: 1
    });
  } catch (e) {
    console.log(e);
  }
}
onLoad(function (options) {
  uni.hideShareMenu();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  state.themeColor = app.globalData.uiconfig.themeColor;
});
onReady(function () {});
onShow(function () {
  try {
    let remarks = uni.getStorageSync('wj_addRemarks');
    if (remarks) {
      state.remark = remarks;
      state.wordCount = remarks.length;
    }
  } catch (e) {
    // Do something when catch error
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/addRemarks/addRemarks.wxss */

.content {
  padding: 60rpx 40rpx 0 40rpx;
}

.remark-box {
  position: relative;
}

.remark-box textarea {
  width: calc(100% - 86rpx);
  height: 240rpx;
  background: #f1f1f1;
  border-radius: 6rpx;
  font-size: 28rpx;
  color: #8b8b8c;
  line-height: 48rpx;
  padding: 30rpx 43rpx;
}

.remark-box label {
  font-size: 28rpx;
  line-height: 48rpx;
  color: #8b8b8c;
  position: absolute;
  right: 42rpx;
  bottom: 30rpx;
}

.btn-box {
  width: 100%;
  height: 100rpx;
  margin-top: 60rpx;
  display: flex;
  justify-content: space-between;
}

.btn-box button {
  /* flex: 1; */
  box-sizing: border-box;
  border: 0;
  font-size: 32rpx;
  line-height: 100rpx;
  border-radius: 100rpx;
  width: 320rpx;
  box-sizing: border-box;
}

.btn-box button::after {
  border: 0;
}

.btn-box button.cancel {
  /* border-radius: 6rpx 0rpx 0rpx 6rpx; */
  border: 1rpx solid #009F55;
  background: #fff;
  color: #8b8b8c;
}

.btn-box button.confirm {
  /* border-radius: 0rpx 6rpx 6rpx 0rpx; */
  background: #009F55;
  color: #fff;
}

</style>