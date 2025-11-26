<template>
<navigationBar :title="state.navigationBarTitle"></navigationBar>

<view class="container">
  <view class="page-header"></view>
  <view class="form">
    <view class="form-item">
      <view class="label">姓名</view>
      <input class="name-input" type="text" @input="nameInput" placeholder="请输入您的姓名" placeholder-style="color: #ccc">
    </view>
    <view class="form-item">
      <picker @change="bindPickerChange" :value="state.genderIndex" :range="state.genderArr" style="width: 100%;">
        <view class="picker">
          <view class="label">性别</view>
          <view class="value" :style="'color: ' + (state.genderCodeArr[genderIndex] ? '#292929' : '#ccc')">
            {{state.genderCodeArr[genderIndex] ? state.genderArr[genderIndex] : '请选择 >'}}
          </view>
        </view>
      </picker>
    </view>
    <view class="form-item" @click="selectStore">
      <view class="label">所属门店</view>
      <view class="store-info" :style="'color: ' + (state.storeInfo ? '#292929' : '#ccc')">
        {{state.storeInfo ? state.storeInfo.name : '请选择您的所属门店 >'}}
      </view>
    </view>
    <view class="submit-btn" @click="submit">
      确认提交
    </view>
  </view>
</view>
</template>
<script setup>
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiBackCashServiceJs from "@/service/api/newretail/backCashService";
// import { onShow, onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

const backCashService = _apiBackCashServiceJs;
const NAVPAGE = _utilsNavPageJs;
const state = reactive({
  navigationBarTitle: "申请信息填写",
  formData: {
    name: '',
    gender: '',
    memberId: '',
    storeId: null
  },
  storeInfo: null,
  genderArr: ['请选择', '男', '女', '未知'],
  genderCodeArr: ['', 'MALE', 'FEMALE', 'UNKNOWN'],
  genderIndex: 0
});
onShow(function () {
  if (app.globalData.storeInfo) {
    state.formData.storeId = app.globalData.storeInfo.id;
    state.storeInfo = app.globalData.storeInfo;
  }
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      if (app.globalData.userInfo.member.id) {
        state.formData.memberId = app.globalData.userInfo.member.id;
      }
    }
  }
});
onLoad(function () {});
function nameInput(event) {
  if (event && event.detail && event.detail.value) {
    state.formData.name = event.detail.value;
  }
}
function bindPickerChange(event) {
  if (event && event.detail && event.detail.value) {
    state.genderIndex = event.detail.value;
    state.formData.gender = state.genderCodeArr[event.detail.value];
  }
}
function selectStore() {
  NAVPAGE.toSelectStore();
}
function checkName() {
  if (!state.formData.name) {
    uni.showToast({
      title: '请输入姓名',
      icon: 'none',
      duration: 2000
    });
    return false;
  } else {
    return true;
  }
}
function checkGender() {
  if (!state.formData.gender) {
    uni.showToast({
      title: '请选择性别',
      icon: 'none',
      duration: 2000
    });
    return false;
  } else {
    return true;
  }
}
function checkStore() {
  if (!state.formData.storeId) {
    uni.showToast({
      title: '请选择门店',
      icon: 'none',
      duration: 2000
    });
    return false;
  } else {
    return true;
  }
}
function submit() {
  if (checkName() && checkGender() && checkStore()) {
    const postData = {
      ...state.formData
    };
    backCashService.createApply(postData).then(res => {
      uni.navigateBack();
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
</script>
<style scoped>
.container {
  padding: 0;
}

.page-header {
  background: #FFA146;
  height: 180rpx;
}

.form {
  width: 604rpx;
  height: 543rpx;
  border-radius: 35rpx;
  background: #fff;
  margin: -100rpx auto;
  padding: 16rpx 30rpx 60rpx 30rpx;
  box-shadow: 0px 5px 8px 0px rgba(0,0,0,0.2);
}

.form .form-item {
  border-bottom: 1rpx solid #DCDCDC;
  height: 95rpx;
  line-height: 95rpx;
  padding-top: 29rpx;
  font-size: 30rpx;
  display: flex;
  justify-content: space-between;
}

.form .form-item .label {
  color: #292929;
}

.form .form-item .name-input {
  display: inline-block;
  height: 95rpx;
  line-height: 95rpx;
  text-align: right;
}

.form .form-item .picker {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.form .form-item .store-info {
  
}

.form .submit-btn {
  width: 562rpx;
  height: 101rpx;
  line-height: 101rpx;
  text-align: center;
  color: #fff;
  background: #FFA146;
  border-radius: 50rpx;
  margin: 54rpx auto;
}
</style>