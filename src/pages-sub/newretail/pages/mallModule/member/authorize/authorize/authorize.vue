<template>
  <!--components/authorize/authorize.wxml-->
  <view>
    <popup
      :show="show.login"
      position="middle"
      custom-class="middle"
      @touchmove.stop="catchtouchmove"
    >
      <view class="popup-authorization">
        <text class="title">小程序</text>
        <view class="content">
          <text>为了您的正常使用</text>
          <text>需要获得您的公开信息</text>
        </view>
        <button class="confirm" @click="getUserInfo">极速登录</button>
      </view>
    </popup>
    <popup
      :show="showPhone"
      position="middle"
      custom-class="middle"
      @touchmove.stop="catchtouchmove"
    >
      <view class="popup-phone-number">
        <text class="title">申请授权</text>
        <view class="content">
          <text v-if="!hasPhoneNumber">申请获取您微信手机号快速注册</text>
          <text v-if="hasPhoneNumber">是否绑定当前手机号：</text>
          <text class="phone-num" v-if="hasPhoneNumber">{{ phoneNumber }}</text>
        </view>
        <view class="tips" v-if="hasPhoneNumber">
          <view>如需更换手机号请</view>
          <text @click="toBindMobile">手动绑定</text>
        </view>
        <view class="botton-box">
          <button class="cancel" @click="toBindMobile">取消</button>
          <button
            class="confirm"
            :hidden="phoneNumber"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          >
            确认授权
          </button>
          <button class="confirm" :hidden="phoneNumber" @click="handleBindMobile">确认</button>
        </view>
      </view>
    </popup>
  </view>
</template>
<script setup>
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsAuthJs from '@/utils/newretail/auth'
import _apiWxaExperienceServiceJs from '@/service/api/newretail/wxaExperienceService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
// import { attached, ready } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp()

// components/authorize/authorize.js
const wxaUserService = _apiWxaUserServiceJs
const systemService = _apiSystemServiceJs
const storeService = _apiStoreServiceJs
const wxaExperienceService = _apiWxaExperienceServiceJs
const auth = _utilsAuthJs
const util = _utilsUtilsJs
const ADDRESS = _utilsAddressJs

// 获取应用实例
const state = reactive({
  show: {
    middle: false,
    login: false,
    phone: false,
    customer: false,
  },
  overlayStyle: '',
  hasPhoneNumber: false,
  phoneNumber: '',
  canIUse: uni.canIUse('button.open-type.getUserInfo'),
  name: '',
  company: '',
  phone: '',
})
const props = defineProps({
  onClickLogin: {
    type: Boolean,
    value: true,
  },
  showPhone: Boolean,
  onPopupPhone: {
    type: Boolean,
    value: true,
  },
})
attached(function () {})
ready(function () {
  console.log('login components ready')
  // if (app.globalData.isMiNiAppMustAccreditQueryCount === 0) {
  //   systemService.query("isMiNiAppMustAccredit").then(res => {
  //     app.globalData.isMiNiAppMustAccreditQueryCount = 1
  //     if (res == null) {
  //       return;
  //     }
  //     if (res.length > 0 && res[0].value != null && res[0].value !== "") {
  //       res = res[0].value === "true" || res[0].value === "TRUE" || res[0].value === true
  //       app.globalData.systemConfigure.isMiNiAppMustAccredit = res
  //     }
  //     this.initPage()
  //   }).catch(err => {
  //     console.log("查询是否开启极速登录报错：", err.message)
  //   })
  // } else {
  //   this.initPage()
  // }
  initPage()
})
function show() {
  // console.log("components show")
}
function onShow() {
  // 基础库2.23以上触发
}
function initPage() {
  const that = this
  // 判断是否开启了极速登录
  if (app.globalData.systemConfigure.isMiNiAppMustAccredit) {
    // 如果开启了极速登录
    if (!app.globalData.userInfo) {
      // 如果没有登录
      app.globalData.show.login = true
      state[`show.login`] = true
      handleTabBar(false)
    } else {
      // 已经有用户信息
      if (state.show.login) {
        // 已登录隐藏授权弹窗
        state[`show.login`] = false
        app.globalData.show.login = false
      } else {
      }
    }
  }
}
function onSuccess() {
  triggerEvent('login-result')
  handleTabBar(true)
  if (state.onClickLogin) {
    triggerEvent('login')
  }
}
function onPopupPhone() {
  triggerEvent('popup-phone')
  if (!state.onPopupPhone) {
    triggerEvent('phone')
  }
}
function handleTabBar(val) {
  const that = this
  const myEventDetail = {
    showTabbar: val,
  } // detail对象，提供给事件监听函数
  const myEventOption = {} // 触发事件的选项
  triggerEvent('tabBar', myEventDetail, myEventOption)
}
function triggerBindMobile(val) {
  const that = this
  const eventDetail = {
    bindMobile: val,
  } // detail对象，提供给事件监听函数
  const eventOption = {} // 触发事件的选项
  triggerEvent('phone', eventDetail, eventOption)
}
function getUserInfo(e) {
  // console.log(e)
  const that = this
  wxaUserService
    .login(true)
    .then((res) => {
      // console.log(res)
      app.globalData.show.login = false
      auth.setUser(res)
      app.globalData.userInfo = res && res.member ? res : null
      if (!res.member) {
        state.user = res.wxaUser
        state.hasUserInfo = true
        toggleMiddlePopup()
        // that.togglePhonePopup()
      } else {
        auth.getDistributor()
        if (state.show.login) {
          toggleMiddlePopup()
        }
        // that.triggerBindMobile(true)
        state.hasUserInfo = true
        uni.setStorage({
          key: 'wj_member',
          data: res.member,
        })
      }
      onSuccess()
    })
    .catch((err) => {
      // console.log(err)
      state.hasUserInfo = false
      if (err.message.indexOf('auth deny') >= 0) {
        uni.showToast({
          title: '您拒绝了授权~',
          icon: 'none',
          duration: 2000,
        })
      } else {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function getPhoneNumber(e) {
  // console.log(e)
  ADDRESS.getLocation().then((res) => {
    console.log(res, 1)
    calcStoreDistance(res, res.userLatitude, res.userLongitude)
  })
  if (e.detail.errMsg.indexOf('ok') >= 0) {
    wxaUserService
      .parseWxaMobile(e.detail.encryptedData, e.detail.iv)
      .then((res) => {
        // console.log(res)
        state.hasPhoneNumber = true
        state.phoneNumber = res
        state.encryptedData = e.detail.encryptedData
        state.iv = e.detail.iv
      })
      .catch((err) => {
        uni.showToast({
          title: '未知错误，即将跳转到手动绑定手机号',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(function () {
          uni.navigateTo({
            url: '/pages-sub/newretail/pages/mallModule/member/bindMobile/bindMobile',
          })
        }, 2000)
      })
  } else {
    uni.showToast({
      title: '获取手机号失败，即将跳转到手动绑定手机号',
      icon: 'none',
      duration: 2000,
    })
    setTimeout(function () {
      uni.navigateTo({
        url: '/pages-sub/newretail/pages/mallModule/member/bindMobile/bindMobile',
      })
    }, 2000)
  }
}
function toBindMobile() {
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/member/bindMobile/bindMobile',
  })
}
function handleBindMobile() {
  const self = this
  let storeId = ''
  if (app.globalData.storeInfo) {
    console.log(app.globalData.storeInfo)
    if (
      app.globalData.systemConfigure.memberAscriptionStoreDistance &&
      app.globalData.storeInfo.distance
    ) {
      let distance = app.globalData.storeInfo.distance
      distance = parseFloat(distance * 1000)
      if (distance < app.globalData.systemConfigure.memberAscriptionStoreDistance) {
        // console.log(distance, app.globalData.systemConfigure.memberAscriptionStoreDistance)
        storeId = app.globalData.storeInfo.id
      }
    }
  } else {
  }
  wxaUserService
    .bindMobileByEncrypt(state.encryptedData, state.iv, 'WXAPP', storeId)
    .then((res) => {
      // console.log(res)
      triggerBindMobile(true)
    })
    .then((res) => {
      getUserInfo()
    })
    .catch((err) => {
      // console.log(err)
      if (err.code === 23002) {
        triggerBindMobile(true)
        getUserInfo()
      } else {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function toggleBottomPopup() {
  toggle('middle')
}
function toggleMiddlePopup() {
  toggle('login')
}
function togglePhonePopup() {
  toggle('phone')
  if (!state.show.phone) {
    triggerBindMobile(true)
  }
}
function catchtouchmove() {}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
  state.overlayStyle = state.overlayStyle
}
function calcStoreDistance(stores, latitude, longitude) {
  const dis = util.distance(latitude, longitude, stores.latitude, stores.longitude)
  const store = {
    ...stores,
    distance: dis,
  }
  app.globalData.storeInfo = store
  state.storeInfo = store
}
function saveCustomerInfo(val) {
  const that = this
  const company = state.company
  const name = state.name
  const phone = state.phone
  const openId = app.globalData.userInfo.wxaUser.openId
  if (company !== '' && name !== '' && checkMobile(phone)) {
    wxaExperienceService
      .create(company, phone, name, openId)
      .then((res) => {
        // console.log(res)
        uni.showToast({
          title: '信息提交成功~',
          icon: 'none',
          duration: 1000,
        })
        setTimeout(() => {
          toggle('customer')
          onSuccess()
        }, 1000)
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  } else {
    if (name == '') {
      uni.showToast({
        title: '请输入姓名~',
        icon: 'none',
        duration: 2000,
      })
    } else if (company == '') {
      uni.showToast({
        title: '请输入公司名称~',
        icon: 'none',
        duration: 2000,
      })
    } else if (phone == '') {
      uni.showToast({
        title: '请输入联系方式~',
        icon: 'none',
        duration: 2000,
      })
    } else {
    }
  }
}
function checkMobile(mobile) {
  const reg = /^[1]([3-9])[0-9]{9}$/
  if (!mobile) {
    uni.showToast({
      title: '请填写手机号',
      icon: 'none',
      duration: 2000,
    })
    return false
  } else if (!reg.test(mobile)) {
    uni.showToast({
      title: '请填写正确的手机号',
      icon: 'none',
      duration: 2000,
    })
    return false
  } else {
    return true
  }
}
function handleName(e) {
  if (e.detail.cursor < 5) {
    state.name = e.detail.value
  } else if (e.detail.cursor === 5) {
    state.name = e.detail.value
    uni.showToast({
      title: '联系人昵称最大不能超10个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  } else {
  }
}
function handleCompany(e) {
  if (e.detail.cursor < 20) {
    state.company = e.detail.value
  } else if (e.detail.cursor === 20) {
    state.company = e.detail.value
    uni.showToast({
      title: '公司名称最大不能超20个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  } else {
  }
}
function handleInputPhone(e) {
  state.phone = e.detail.value
}
</script>
<style scoped>
/* components/authorize/authorize.wxss */
.popup-authorization {
  width: 572rpx;
  height: auto;
  padding: 24rpx 0;
  background: #fff;
  border-radius: 36rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.popup-authorization .title {
  font-size: 36rpx;
  color: #333;
  line-height: 76rpx;
  margin-top: 20rpx;
}

.popup-authorization .content {
  font-size: 28rpx;
  line-height: 42rpx;
  color: #333;
  margin: 20rpx 0 44rpx 0;
  text-align: center;
}

.popup-authorization .content text {
  display: block;
  margin-top: 12rpx;
}

.popup-authorization .confirm {
  width: 100%;
  height: 89rpx;
  background: #fff;
  font-size: 36rpx;
  color: #019f55;
  line-height: 89rpx;
}

.popup-authorization .confirm::after {
  border: 0;
}

.popup-phone-number {
  width: 572rpx;
  min-height: 300rpx;
  /* height: 504rpx; */
  padding: 46rpx 48rpx 100rpx 48rpx;
  background: #fff;
  border-radius: 6rpx;
  display: flex;
  position: relative;
  flex-direction: column;
  box-sizing: border-box;
}

.popup-phone-number .title {
  font-size: 40rpx;
  line-height: 60rpx;
  color: #333;
  display: block;
}

.popup-phone-number .content {
  text-align: justify-all;
  color: #787878;
  font-size: 32rpx;
  line-height: 54rpx;
  margin: 52rpx 0 34rpx 0;
}

.popup-phone-number .content text {
  display: block;
  width: 100%;
}

.popup-phone-number .content .phone-num {
  font-size: 36rpx;
  color: #333;
}

.popup-phone-number .tips {
  color: #787878;
  font-size: 28rpx;
  line-height: 36rpx;
  display: flex;
  align-items: center;
  margin-bottom: 82rpx;
}

.popup-phone-number .tips > text {
  color: #1c8af8;
}

.popup-phone-number .botton-box {
  position: absolute;
  bottom: 24rpx;
  right: 32rpx;
  color: #777;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.popup-phone-number button {
  background: #fff;
  font-size: 36rpx;
  line-height: 86rpx;
  height: 86rpx;
  margin: 0;
}

.popup-phone-number button.cancel {
  margin-right: 20rpx;
}

.popup-phone-number button::after {
  border: 0;
}

.popup-phone-number button.confirm {
  color: #019f55;
}

/* 收集信息 */
.popup-customer {
  width: 590rpx;
  background: #ffffff;
  border-radius: 6rpx;
  padding-top: 32rpx;
}

.popup-customer text {
  display: block;
}

.popup-customer .title {
  font-size: 36rpx;
  color: #222222;
  line-height: 48rpx;
  padding-left: 40rpx;
}

.popup-customer .content {
  padding: 18rpx 40rpx 20rpx 40rpx;
}

.popup-customer .section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12rpx 0;
}

.popup-customer .section text {
  font-size: 26rpx;
  color: #999999;
  margin-right: 20rpx;
}

.popup-customer .section input {
  width: 360rpx;
  height: 66rpx;
  border: 2rpx solid #edeef0;
  border-radius: 6rpx;
  background: #f4f5f9;
  box-sizing: border-box;
  font-size: 28rpx;
  line-height: 66rpx;
  padding-left: 20rpx;
}

.popup-customer .confirm {
  font-size: 32rpx;
  color: #019f4b;
  font-weight: bold;
  height: 82rpx;
  line-height: 82rpx;
  background: #ffffff;
  border-top: 1px solid #f4f4f4;
}
</style>
