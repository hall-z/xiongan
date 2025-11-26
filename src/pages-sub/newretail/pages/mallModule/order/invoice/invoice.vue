<template>
<!-- pages/mallModule/order/invoice/invoice.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
		<form @submit="formSubmit">
				<view class="section section_gap">
						<view class="left">抬头类型</view>
						<radio-group name="type" class="right" :value="state.type" @change="handleChange">
								<label class="person">
										<radio :color="state.themeColor" value="1" :checked="state.person">
										个人或事业单位
								</radio></label>
								<label class="company">
										<radio :color="state.themeColor" value="0" :checked="!state.person">
										企业
								</radio></label>
						</radio-group>
				</view>
				<view class="section">
						<view class="left">发票抬头</view>
						<input class="right" type="text" placeholder="抬头名称" :value="state.title" name="title">
				</view>
				<view class="section" v-if="!state.person">
						<view class="left">税号</view>
						<input class="right" type="text" placeholder="纳税人识别号" :value="state.taxNumber" name="taxNumber">
				</view>
				<view class="section" v-if="!state.person">
						<view class="left">开户银行</view>
						<input class="right" type="text" placeholder="选填" :value="state.bankName" name="bankName">
				</view>
				<view class="section" v-if="!state.person">
						<view class="left">银行账户</view>
						<input class="right" type="text" placeholder="选填" :value="state.bankAccount" name="bankAccount">
				</view>
				<view class="section" v-if="!state.person">
						<view class="left">企业地址</view>
						<input class="right" type="text" placeholder="选填" :value="state.companyAddress" name="companyAddress">
				</view>
				<view class="section" v-if="!state.person">
						<view class="left">企业电话</view>
						<input class="right" type="text" placeholder="选填" :value="state.telephone" name="telephone">
				</view>
				<view class="wx-btn" v-if="!state.person">
						<view @click="handleGetWxInvoice">
								<image class="" :src="state.imagesPath.iconWechatLogo"></image>
								<view>获取微信发票抬头</view>
						</view>
				</view>
				<view class="btn-area">
						<button :style="'background-color: ' + state.themeColor" formType="submit">保存</button>
				</view>
		</form>
</view>
</template>
<script setup>
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
// pages/mallModule/order/invoice/invoice.js
const themeManager = _utilsThemeManagerJs;
const IMGAGESPATH = _utilsImagesPathJs;
const NAVPAGE = _utilsNavPageJs;
const state = reactive({
  navigationBarTitle: "填写开票信息",
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  imagesPath: IMGAGESPATH,
  type: '',
  title: '',
  taxNumber: '',
  bankName: '',
  bankAccount: '',
  companyAddress: '',
  telephone: '',
  person: true
});
function handleChange(val) {
  const type = val.detail.value;
  if (type === '1') {
    state.person = true;
  } else {
    state.person = false;
  }
}
function formSubmit(val) {
  console.log(val.detail.value);
  const invoice = val.detail.value;
  if (invoice.title) {
    uni.setStorageSync("wj_invoice", invoice);
    uni.navigateBack({
      delta: 1
    });
  } else {
    uni.showToast({
      title: '请填写发票抬头',
      icon: 'none',
      duration: 2000
    });
  }
}
function handleGetWxInvoice() {
  const that = this;
  uni.chooseInvoiceTitle({
    success(res) {
      if (res) {
        let person = '';
        if (res.type === "1") {
          person = true;
        } else {
          person = false;
        }
        state.type = res.type ? res.type : '';
        state.title = res.title ? res.title : '';
        state.taxNumber = res.taxNumber ? res.taxNumber : '';
        state.bankName = res.bankName ? res.bankName : '';
        state.bankAccount = res.bankAccount ? res.bankAccount : '';
        state.companyAddress = res.companyAddress ? res.companyAddress : '';
        state.telephone = res.telephone ? res.telephone : '';
        state.person = person;
      }
    }
  });
}
onLoad(function (options) {
  const invoice = uni.getStorageSync("wj_invoice");
  console.log(invoice);
  if (invoice) {
    let person = '';
    if (invoice.type === "1") {
      person = true;
    } else {
      person = false;
    }
    state.type = invoice.type ? invoice.type : '';
    state.title = invoice.title ? invoice.title : '';
    state.taxNumber = invoice.taxNumber ? invoice.taxNumber : '';
    state.bankName = invoice.bankName ? invoice.bankName : '';
    state.bankAccount = invoice.bankAccount ? invoice.bankAccount : '';
    state.companyAddress = invoice.companyAddress ? invoice.companyAddress : '';
    state.telephone = invoice.telephone ? invoice.telephone : '';
    state.person = person;
  }
  state.themeColor = app.globalData.uiconfig.themeColor;
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
/* pages/mallModule/order/invoice/invoice.wxss */
page {
	background-color: #fff;
	width: 100%;
	height: 100%;
}

.content {
	position: relative;
	width: 100%;
	height: 85%;
}

.content .section {
	height: 80rpx;
	width: 100%;
	padding: 0 40rpx 0 40rpx;
	box-sizing: border-box;
	display: flex;
	font-size: 26rpx;
	justify-content: space-between;
	align-items: center;
}

.content .section .left {
	font-size: 32rpx;
	color: #454545;
}

.content .section .right {
	text-align: right;
	width: 400rpx;
}

.content .section .right .person {
	margin-right: 20rpx;
}

.content .wx-btn {
	width: 100%;
	font-size: 34rpx;
	font-weight: bold;
	color: black;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	bottom: 140rpx;
}

.content .wx-btn view {
	display: flex;
	justify-content: center;
	align-items: center;
}

.content .wx-btn view image {
	width: 50rpx;
	height: 50rpx;
	margin-right: 10rpx;
}

.content .btn-area {
	position: absolute;
	width: 100%;
	height: 90rpx;
	bottom: 0rpx;
	display: flex;
	align-items: center;
}

.content .btn-area button {
	width: 80%;
	height: 90rpx;
	color: #fff;
	font-size: 36rpx;
	font-weight: 600;
}
</style>