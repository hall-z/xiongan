<route lang="json5" type="page">
{
  layout: 'default-newretail',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
    },
  },
}
</route>
<template>
  <view>
    <!-- pages/mallModule/member/authorize/authorize.wxml -->
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <view class="top-info">
      <image
        class="logo"
        :src="state.logoLoading ? '' : state.avatarUrl || state.imagesPath.logo"
      ></image>
      <!-- <text>线上商城</text> -->
    </view>
    <view v-if="!state.hasUserInfo">
      <text class="auth-tips">请完成授权以继续使用</text>
      <button class="auth btn" @click="getUserInfo" :style="'background:' + state.themeColor">
        获取用户信息
      </button>
    </view>
    <view v-else>
      <button
        v-if="state.agreement && state.enterFlag"
        open-type="getPhoneNumber"
        class="register btn"
        @getphonenumber="getPhoneNumber"
        :disabled="!state.canBindMobile"
        :style="'background:' + state.themeColor + ' !important'"
      >
        <!-- <image src="{{imagesPath.iconAuthMobile}}" ></image> -->
        手机号快捷登录
      </button>
      <button
        class="register btn"
        v-else
        @click="goAgreementHandle"
        :style="'background:' + state.themeColor"
      >
        <!-- <image src="{{imagesPath.iconAuthMobile}}" ></image> -->
        手机号快捷登录
      </button>
      <button
        class="default register btn"
        @click="toBindMobile"
        :style="'color:' + state.themeColor + ';border-color:' + state.themeColor"
      >
        <!-- <image src="{{imagesPath.iconAuthMobile}}" ></image> -->
        手机号登录/注册
      </button>
      <view class="agreement" @click="agreeAgreement">
        <view :class="state.agreement ? 'agreement-btn active' : 'agreement-btn'">
          <image
            v-if="state.agreement"
            src="https://gomore-dshx.oss-cn-hangzhou.aliyuncs.com/image/true.png"
          ></image>
        </view>
        <view class="agreement-text">
          我已认真阅读并同意
          <text
            class="go-agreement"
            :style="'color: ' + state.themeColor + '  !important;'"
            @click.stop="goAgreement"
          >
            《用户服务协议》
          </text>
        </view>
      </view>
    </view>

    <!-- 同意协议通告 -->
    <popup
      v-if="state.show.agreementLayer"
      :show="state.show.agreementLayer"
      position="middle"
      custom-class="middle"
    >
      <view class="popup-box popup-agreement-box">
        <view class="popup-title">温馨提示</view>
        <view class="popup-agreement">
          <text>已阅读并同意下方</text>
          <text
            class="go-agreement"
            :style="'color: ' + state.themeColor + '  !important;'"
            @click.stop="goAgreement"
          >
            《用户服务协议》
          </text>
        </view>
        <view class="popup-group">
          <button class="share-left" @click="closeAgreement">不同意</button>
          <button
            v-if="state.bindFlag === 'toBindMobile'"
            class="share-right"
            :style="'color: ' + state.themeColor + '  !important;'"
            @click="agreementBindMobile"
          >
            同意
          </button>
          <button
            v-else
            open-type="getPhoneNumber"
            class="share-right"
            @getphonenumber="getPhoneNumber"
            :disabled="!state.canBindMobile"
            :style="'color: ' + state.themeColor + '  !important;'"
          >
            <!-- <image src="{{imagesPath.iconAuthMobile}}" ></image> -->
            同意
          </button>
        </view>
      </view>
    </popup>

    <popup
      v-if="state.show.promotion"
      :show="state.show.promotion"
      position="middle"
      custom-class="middle"
      @close="togglePromotionPopup"
    >
      <view class="popup-box">
        <view class="popup-title">温馨提示</view>
        <view class="popup-content">
          <text>恭喜您获得</text>
          <text class="popup-text" v-for="(item, index) in state.couponPromotions" :key="index">
            {{ item.coupon.name }}
          </text>
        </view>
        <view class="popup-button">
          <text>优惠券已放入您的券包</text>
          <button class="share-btn" @click="foundPromotion">查看我的优惠券</button>
        </view>
      </view>
    </popup>

    <!-- <popup show="{{ show.configInfo }}" position="middle" custom-class="middle" bind:close="toggleConfigInfoPopup"> -->
    <popup
      v-if="state.show.configInfo"
      :show="state.show.configInfo"
      position="bottom"
      custom-class="bottom"
      @close="toggleConfigInfoPopup"
    >
      <view class="popup-box config-box">
        <view class="config-title">
          <view class="left-icon" @click="jumpHandler">
            <image :src="state.imagesPath.upIcon"></image>
          </view>
          <text class="title-font">完善资料</text>
          <view class="jump-btn" @click="jumpHandler">跳过</view>
        </view>
        <form @submit="handleSave">
          <view class="section" v-if="state.configInfoSet.name">
            <view class="section-title">
              姓名
              <text v-if="state.configInfoSet.name.hasMust">*</text>
            </view>
            <view :class="!state.configInfoSet.name.canUpdate ? 'right ' : 'right'">
              <input
                type="text"
                class="nickName"
                placeholder="请输入姓名"
                name="nickName"
                :value="state.nickName"
                @input="inputNiceName"
              />
            </view>
          </view>
          <view class="section" v-if="state.configInfoSet.mobile">
            <view class="section-title">
              手机号
              <text v-if="state.configInfoSet.mobile.hasMust">*</text>
            </view>
            <view :class="!state.configInfoSet.mobile.canUpdate ? 'right gray' : 'right'">
              <input
                maxlength="11"
                :disabled="!state.configInfoSet.mobile.canUpdate"
                type="number"
                name="mobile"
                @input="handlePhone"
                :value="state.mobile"
                placeholder="请输入手机号"
              />
            </view>
          </view>
          <view class="section" v-if="state.configInfoSet.birthday">
            <view class="section-title">
              生日
              <text v-if="state.configInfoSet.birthday.hasMust">*</text>
            </view>
            <view :class="!state.configInfoSet.birthday.canUpdate ? 'right ' : 'right'">
              <picker
                mode="date"
                name="birthday"
                start="1900-01-01"
                :end="state.endDate"
                :value="state.birthday"
                @change="bindDateChange"
              >
                <view class="picker">
                  {{ state.birthday === '未填写' ? '只能填写一次，请谨慎填写' : state.birthday }}
                </view>
              </picker>
            </view>
          </view>
          <view class="section" v-if="state.configInfoSet.idCard">
            <view class="section-title">
              身份证号
              <text v-if="state.configInfoSet.idCard.hasMust">*</text>
            </view>
            <view class="right">
              <input
                type="text"
                name="idNum"
                @input="handelIdNumInput"
                placeholder="请输入身份证号"
              />
            </view>
          </view>
          <view class="section" v-if="state.configInfoSet.gender">
            <view class="section-title">
              性别
              <text v-if="state.configInfoSet.gender.hasMust">*</text>
            </view>
            <view class="lable-box">
              <text
                :class="'lable-item ' + (state.gender == index ? 'active' : '')"
                :style="
                  'color: ' +
                  (state.gender == index ? '#fff' : '#8b8b8c') +
                  ';border: 1px solid ' +
                  (state.gender == index ? state.themeColor : '#dddddd') +
                  ';'
                "
                v-for="(item, index) in state.genders"
                :key="index"
                :data-id="item.id"
                :data-index="index"
                @click="genderClick"
              >
                {{ item.name }}
              </text>
            </view>
          </view>
          <view class="section" v-if="state.configInfoSet.plateNumber">
            <view class="section-title">
              车牌号
              <text v-if="state.configInfoSet.plateNumber.hasMust">*</text>
            </view>
            <view class="right">
              <picker
                class="city-box"
                @change="cityChange"
                :value="state.cityIndex"
                :range="state.cityArray"
              >
                <view class="picker">
                  {{ state.cityArray[cityIndex] }}
                  <!-- <image src="../../../../image/san.png"></image> -->
                </view>
              </picker>
              <input
                type="text"
                name="plateNumber"
                maxlength="14"
                @input="handelPlateNumberInput"
                placeholder="请填写"
              />
              <!-- <vehicle-keyboard vehicleNo="{{vehicleNo}}" bind:confirm="confirmVehicle"></vehicle-keyboard> -->
            </view>
          </view>
          <view class="section" v-if="state.configInfoSet.email">
            <view class="section-title">
              邮箱
              <text v-if="state.configInfoSet.email.hasMust">*</text>
            </view>
            <view class="right">
              <input type="email" name="email" @input="handelEmailInput" placeholder="请输入邮箱" />
            </view>
          </view>
          <view class="section" v-if="state.configInfoSet.address">
            <view class="section-title">
              地址
              <text v-if="state.configInfoSet.address.hasMust">*</text>
            </view>
            <picker
              mode="region"
              class="right"
              @change="bindRegionChange"
              :value="state.region"
              name="region"
            >
              <view class="address-picker">
                {{ state.region[0] }} {{ state.region[1] }} {{ state.region[2] }}
              </view>
            </picker>
          </view>
          <view class="section section-address" v-if="state.configInfoSet.baseAddress">
            <view class="section-title">
              详细地址
              <text v-if="state.configInfoSet.baseAddress.hasMust">*</text>
            </view>
            <view class="right">
              <textarea
                class="address-text"
                type="text"
                placeholder="如道路、门牌号、小区、楼栋号、单元室等"
                maxlength="50"
                name="address"
                :value="state.address"
                @input="handleDetails"
                @blur="handleBlur"
                @focus="handleFocus"
              ></textarea>
              <view class="address" @click="chooseAddress">
                <image class="address-img" :src="state.imagesPath.iconPositionActive"></image>
                <text>定位</text>
              </view>
            </view>
          </view>
          <button class="btn" formType="submit">提交</button>
        </form>
      </view>
    </popup>
  </view>
</template>
<script setup>
import _libsQqmapWxJssdkMinJs from '@/libs/qqmap-wx-jssdk'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsAuthJs from '@/utils/newretail/auth'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bus from 'iny-bus'
import popup from '@/pages-sub/newretail/components/popup/popup.vue'
const app = getApp()
let toIndex = false
// pages/mallModule/member/authorize/authorize.js
const wxaUserService = _apiWxaUserServiceJs

const auth = _utilsAuthJs
const util = _utilsUtilsJs
const ADDRESS = _utilsAddressJs
const THEME = _utilsThemeManagerJs
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const systemService = _apiSystemServiceJs
const memberService = _apiMemberServiceJs
const ANALYSIS = _utilsAnalysisJs
const QQMapWX = _libsQqmapWxJssdkMinJs
let qqmapsdk
// 1.完善资料信息顺序
// 2.车牌号录入组件
// 获取应用实例
const state = reactive({
  logoLoading: true,
  avatarUrl: '',
  bindFlag: null,
  // 哪个按钮点击绑定
  enterFlag: true,
  // 允许点击手机号快捷登录flag
  employeeCode: '',
  // 店员外部系统编码
  storeCode: '',
  // 对应门店外部代码
  show: {
    agreementLayer: false,
    middle: false,
    luckDraw: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    promotion: false,
    luckDrawPopup: false,
    configInfo: false,
  },
  agreement: false,
  // 同意注册协议
  // configShow: {
  //     middle: false,
  //     luckDraw: false,
  //     top: false,
  //     bottom: false,
  //     right: false,
  //     right2: false,
  //     promotion: false,
  //     luckDrawPopup: false
  // },
  navigationBarTitle: '',
  imagesPath: IMGAGESPATH,
  hasUserInfo: false,
  sharingId: '',
  inviteInfo: null,
  canBindMobile: false,
  configInfoSet: {
    // name:{
    // },
    // mobile:{
    // },
    // birthday:{
    // },
    // idCard:{
    // },
    // gender:{
    // },
    // plateNumber:{
    // },
    // email:{
    // },
    // address:{
    // },
    // baseAddress:{
    // }
  },
  // 完善资料配置项
  nickName: '',
  mobile: '',
  birthday: '未填写',
  endDate: new Date(),
  idNum: '',
  genders: [
    {
      name: '先生',
      value: 'MALE',
      id: 0,
    },
    {
      name: '女士',
      value: 'FEMALE',
      id: 1,
    },
  ],
  gender: -1,
  email: '',
  region: ['省', '市', '区'],
  province: '',
  city: '',
  district: '',
  address: '',
  cityArray: [
    '京',
    '沪',
    '粤',
    '津',
    '冀',
    '晋',
    '蒙',
    '辽',
    '吉',
    '黑',
    '苏',
    '浙',
    '皖',
    '闽',
    '赣',
    '鲁',
    '豫',
    '鄂',
    '湘',
    '桂',
    '琼',
    '渝',
    '川',
    '贵',
    '云',
    '藏',
    '陕',
    '甘',
    '青',
    '宁',
    '新',
  ],
  cityIndex: 0,
  themeColor: THEME.color,
})
function agreeAgreement() {
  state.agreement = !state.agreement
  state.agreement = state.agreement
}
function goAgreement() {
  NAVPAGE.toAgreement()
}
onLoad(function (options) {
  state.themeColor = app.globalData.uiconfig.themeColor
  console.log(options.scene)
  const that = this
  // 代表从邀请好友进入
  if (options.inviteInfo && options.inviteInfo != 'undefined') {
    const inviteInfo = JSON.parse(options.inviteInfo)
    const sceneFormActive = uni.getStorageSync('wj_sceneFormActive')
    const introducerld = uni.getStorageSync('wj_introducerld')
    if (sceneFormActive) {
      inviteInfo.introduceStoreId = sceneFormActive
    }
    if (introducerld) {
      inviteInfo.introducerld = introducerld
      inviteInfo.sourceType = 'WX_XCX '
    }
    //   let inviteInfo = {
    //     ...this.data.inviteInfo,
    //     introduceUserId: this.data.sharingId,
    //     introduceStoreId: sceneFormActive?sceneFormActive:app.globalData.storeInfo.id
    //   }
    //   console.log(inviteInfo, "邀请信息")
    //   this.setData({
    //     inviteInfo: inviteInfo
    //   })
    state.inviteInfo = inviteInfo
  }
  if (options.scene) {
    const shopAssistantInfo = decodeURIComponent(options.scene)
    const codeArr = shopAssistantInfo.indexOf(':') > 0 ? shopAssistantInfo.split(':') : []
    if (codeArr.length > 0) {
      state.employeeCode = codeArr[0]
      state.storeCode = codeArr[1]
      state.employeeCode = state.employeeCode
      state.storeCode = state.storeCode
    }
  }
  toIndex = false
  // 获取分享人id
  state.sharingId = uni.getStorageSync('wj_sharingId')
  if ((options.from != null && options.from === 'index') || options.scene) {
    toIndex = true
  }
  uni.hideShareMenu()
  if (app.globalData.userInfo) {
    state.hasUserInfo = true
    uni.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        console.log('session_key 未过期，并且在本生命周期一直有效')
        state.canBindMobile = true
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        console.log('session_key 已经失效，需要重新执行登录流程')
        wxaUserService
          .login(false, true)
          .then((res) => {
            state.canBindMobile = true
          })
          .catch((err) => {
            app.globalData.userInfo = null
            auth.clearTokens()
            auth.clearUserInfo()
            uni.showToast({
              title: '授权失败，请重新登录授权~',
              icon: 'none',
              duration: 2000,
            })
            state.hasUserInfo = false
            state.canBindMobile = false
          })
      },
    })
  }
  // 判断当前用户是否授权了地理位置信息
  if (app.globalData.storeInfo) {
    console.log(app.globalData.storeInfo, '1')
    // 统计PV
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
    calcStoreDistance(
      app.globalData.storeInfo,
      app.globalData.storeInfo.userLatitude,
      app.globalData.storeInfo.userLongitude,
    )
  } else {
    ADDRESS.getLocation().then((res) => {
      app.globalData.storeInfo = res
      // 统计PV
      ANALYSIS.PVStatistics(res.id)
      // 计算当前门店经纬度到用户位置的直线距离
      calcStoreDistance(res, res.userLatitude, res.userLongitude)
    })
  }
  if (state.sharingId) {
    const sceneFormActive = uni.getStorageSync('wj_sceneFormActive')
    const inviteInfo = {
      ...state.inviteInfo,
      introduceUserId: state.sharingId,
      introduceStoreId: sceneFormActive || app.globalData.storeInfo.id,
    }
    console.log(inviteInfo, '邀请信息')
    state.inviteInfo = inviteInfo
  }
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey,
    })
  })
})
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function togglePromotionPopup() {
  toggle('promotion')
  if (toIndex) {
    NAVPAGE.toHome()
  } else {
    uni.navigateBack({
      delta: 1,
    })
  }
}
function foundPromotion() {
  NAVPAGE.toMyCoupon()
}
onReady(function () {})
onShow(function () {
  getLogo()
})
function getLogo() {
  // 获取配置logo
  systemService
    .query('app.mall.store.logo')
    .then((res) => {
      if (res && res.length > 0) {
        state.avatarUrl = res[0].value
      }
      state.logoLoading = false
    })
    .catch((err) => {
      state.logoLoading = false
    })
}
onHide(function () {
  app.globalData.authorizeSkip = 0
})
onUnload(function () {
  app.globalData.authorizeSkip = 0
})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {})
function goAgreementHandle() {
  console.log(state.agreement)
  const self = this
  if (!state.agreement) {
    state.show.agreementLayer = true
    state.show = state.show
    state.bindFlag = 'systemBindPhone'
  }
  if (!state.enterFlag) {
    uni.showToast({
      title: '请勿重复点击~',
      icon: 'none',
      duration: 2000,
    })
  }
}
function getUserInfo(e) {
  const that = this
  let userLogin = false
  if (e != null) {
    userLogin = true
  }
  uni.showLoading({
    title: '',
  })
  wxaUserService
    .login(userLogin, true)
    .then((res) => {
      uni.hideLoading()
      console.log(res)
      auth.setUser(res)
      state.canBindMobile = true
      app.globalData.userInfo = res && res.member ? res : null
      if (!res.member) {
        state.hasUserInfo = true
      } else {
        auth.getDistributor()
        auth.bindDistribution()
        bus.emit('getRelatedCoupon', true)
        // console.log(res.member, 'res.member');
        if (res.member.mobile) {
          state.mobile = res.member.mobile
          state.mobile = state.mobile
        }
        // // 登陆后获取个人资料自定义配置信息
        // this.getPersonConfig().then(presonInfo => {
        //     if(presonInfo.openRegisterDataPopup) {
        //         this.handlePersonInfo(presonInfo)
        //     } else
        if (res.member.promotion) {
          res.member.promotion = JSON.parse(res.member.promotion)
          console.log(res.member.promotion.couponPromotions.length)
          if (
            res.member.promotion.couponPromotions.length != '0' &&
            res.member.promotion.couponPromotions[0].sendStatus
          ) {
            toggle('promotion')
            state.couponPromotions = res.member.promotion.couponPromotions
          } else {
            if (toIndex) {
              NAVPAGE.toHome()
            } else {
              uni.navigateBack({
                delta: 1,
              })
            }
          }
        } else {
          if (toIndex) {
            NAVPAGE.toHome()
          } else {
            uni.navigateBack({
              delta: 1,
            })
          }
        }
        // })

        uni.setStorage({
          key: 'wj_member',
          data: res.member,
        })
      }
    })
    .catch((err) => {
      uni.hideLoading()
      // console.log(err)
      state.hasUserInfo = false
      console.log(err)
      const msg = 'meet frequency limit'
      const authorize = 'auth deny'
      const errMsg = err.message
      state.isMember = false
      state.hasUserInfo = false
      if (errMsg.indexOf(msg) > -1) {
        uni.showToast({
          title: '登陆超时，请小憩片刻再来登陆吧~',
          icon: 'none',
          duration: 2000,
        })
      } else if (errMsg.indexOf(authorize) > -1) {
        uni.showToast({
          title: '授权失败，请点击头像重新登录~',
          icon: 'none',
          duration: 2000,
        })
      } else {
        uni.showToast({
          title: '登陆失败，请点击头像重新登录~',
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function getPhoneNumber(e) {
  console.log('this.data.enterFla', state.enterFlag)
  const self = this
  let storeId = ''
  if (!state.enterFlag) {
    uni.showToast({
      title: '请勿重复点击~',
      icon: 'none',
      duration: 2000,
    })
    return
  }
  state.agreement = true
  state.enterFlag = false
  const storeIdactive = uni.getStorageSync('storeIdactive')
  if (storeIdactive && storeIdactive.id) {
    storeId = storeIdactive.id
  }
  if (e.detail.errMsg.indexOf('ok') >= 0) {
    if (app.globalData.storeInfo) {
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
    // let sceneFormActive = wx.getStorageSync('wj_sceneFormActive')
    // if (sceneFormActive) {
    //     storeId = sceneFormActive;
    // }
    let params = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      registerSourceType: 'WXAPP',
      registerStoreId: storeId,
      invitation: {
        introducerId: uni.getStorageSync('wj_introducerld'),
        sourceType: 'WX_XCX',
      },
    }
    if (state.inviteInfo) {
      params = {
        ...params,
        invitation: state.inviteInfo,
      }
    }
    if (app.globalData.channel) {
      params.channel = app.globalData.channel
    }
    // 店员邀请码进入小程序注册，带上邀请信息
    if (state.employeeCode) {
      params.invitation.employeeCode = state.employeeCode
      params.invitation.storeCode = state.storeCode
    }
    console.log(params, '---params111')
    wxaUserService
      .bindMobileByEncrypt(params)
      .then((res) => {
        console.log(res)
        console.log(params, '---params222')
        if (state.inviteInfo) {
          // 标记邀请好友注册完成
          uni.setStorageSync('wj_invite_registed', true)
        }
        return wxaUserService.login()
      })
      .then((res) => {
        auth.setUser(res)
        app.globalData.userInfo = res && res.member ? res : null
        if (!res.member) {
          state.hasUserInfo = true
          uni.showToast({
            title: '绑定失败~',
            icon: 'none',
            duration: 2000,
          })
          state.enterFlag = true
        } else {
          bus.emit('getRelatedCoupon', true)
          console.log(res.member, 'res.member')
          if (res.member.mobile) {
            state.mobile = res.member.mobile
            state.mobile = state.mobile
          }
          console.log('mobile', state.mobile)
          console.log('member.promotion', res.member.promotion)
          // 绑定手机号 也需要查询个人资料自定配置----
          getPersonConfig()
            .then((presonInfo) => {
              console.log(presonInfo)
              state.enterFlag = true
              if (presonInfo.openRegisterDataPopup) {
                if (res.member.mobile) {
                  presonInfo.mobile.canUpdate = false
                }
                handlePersonInfo(presonInfo)
              } else if (res.member.promotion) {
                res.member.promotion = JSON.parse(res.member.promotion)
                if (
                  res.member.promotion.couponPromotions.length != '0' &&
                  res.member.promotion.couponPromotions[0].sendStatus == true
                ) {
                  toggle('promotion')
                  state.couponPromotions = res.member.promotion.couponPromotions
                } else {
                  if (toIndex) {
                    NAVPAGE.toHome()
                  } else {
                    uni.navigateBack({
                      delta: 1,
                    })
                  }
                }
              } else {
                console.log('跳转页面333')
                if (toIndex) {
                  NAVPAGE.toHome()
                } else {
                  uni.navigateBack({
                    delta: 1,
                  })
                }
              }
            })
            .catch((err) => {
              if (toIndex) {
                NAVPAGE.toHome()
              } else {
                uni.navigateBack({
                  delta: 1,
                })
              }
              state.enterFlag = true
            })
          auth.bindDistribution()
          uni.setStorage({
            key: 'wj_member',
            data: res.member,
          })
          uni.showToast({
            title: '绑定成功~',
            icon: 'none',
            duration: 2000,
          })

          // if (self.toIndex) {
          //     NAVPAGE.toHome()
          // } else {
          //     wx.navigateBack({
          //         delta: 1
          //     })
          // }
        }
      })
      .catch((err) => {
        if (err.code === 23002) {
          getUserInfo()
        } else {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
        }
        state.enterFlag = true
      })
  } else {
    uni.showToast({
      title: '获取手机号失败，即将跳转到手动绑定手机号',
      icon: 'none',
      duration: 2000,
    })
    setTimeout(function () {
      toBindMobile()
      // self.data.enterFlag = true
      state.enterFlag = true
    }, 2000)
  }
  closeAgreement()
}
function toBindMobile() {
  const self = this
  if (!state.agreement) {
    state.bindFlag = 'toBindMobile'
    state.show.agreementLayer = true
    state.show = state.show
    state.bindFlag = state.bindFlag
  } else {
    const opts = '?from=authorize&inviteInfo=' + JSON.stringify(state.inviteInfo)
    NAVPAGE.toBindMobile(opts)
  }
}
function calcStoreDistance(stores, latitude, longitude) {
  const dis = util.distance(latitude, longitude, stores.latitude, stores.longitude)
  const store = {
    ...stores,
    distance: dis,
  }
  app.globalData.storeInfo = store
}
function getPersonConfig() {
  return wxaUserService.getPersonConfig()
}
function handlePersonInfo(presonInfo) {
  state.show.configInfo = true
  // 如果数据为必填切没有初始值，则不禁用
  state.show = state.show
  state.configInfoSet = presonInfo
  if (
    presonInfo.address &&
    presonInfo.address.hasMust &&
    presonInfo.address.defaultValue &&
    !state.region
  ) {
    state.region = presonInfo.address.defaultValue.split(',')
  }
  if (
    presonInfo.baseAddress &&
    presonInfo.baseAddress.hasMust &&
    presonInfo.baseAddress.defaultValue &&
    !state.address
  ) {
    state.address = presonInfo.baseAddress.defaultValue
  }
}
function inputNiceName(e) {
  console.log(e.detail)
  state.nickName = e.detail.value
  if (e.detail.cursor > 10) {
    uni.showToast({
      title: '昵称最大不能超过10个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  }
}
function handlePhone(e) {
  state.mobile = e.detail.value
}
function bindDateChange(e) {
  state.birthday = e.detail.value
}
function handelIdNumInput(e) {
  state.idNum = e.detail.value
}
function genderClick(e) {
  const that = this
  const index = e.currentTarget.dataset.index
  // if(!this.data.configInfoSet.gender.canUpdate) return false
  console.log(index)
  if (state.gender !== index) {
    state.gender = index
  } else {
    state.gender = -1
  }
}
function handelPlateNumberInput(e) {
  state.plateNumber = e.detail.value
}
function handelEmailInput(e) {
  state.email = e.detail.value
}
function bindRegionChange(e) {
  const that = this
  state.region = e.detail.value
}
function handleDetails(e) {
  if (e.detail.cursor < 40) {
    state.address = e.detail.value
  } else if (e.detail.cursor === 40) {
    state.address = e.detail.value
    uni.showToast({
      title: '详细地址最大不能超40个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  } else {
  }
}
function handleBlur(e) {
  state.detailedLabelShow = false
}
function handleFocus(e) {
  state.detailedLabelShow = true
}
function chooseAddress() {
  const that = this
  const region = state.region
  console.log(region)
  if (!state.configInfoSet.baseAddress.canUpdate) return false
  uni.chooseLocation({
    success: function (res) {
      // success
      console.log(res, 'location')
      location = {
        latitude: res.latitude,
        longitude: res.longitude,
      }
      let regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/
      let province = []
      const addressBean = {
        province: null,
        country: null,
        city: null,
        address: null,
      }
      let addressName = res.name
      function regexAddressBean(address, addressBean) {
        regex = /^(.*?[市]|.*?地区|.*?特别行政区|.*?盟|.*?自治州)(.*?[市区县旗])(.*?)$/g
        const addxress = regex.exec(address)
        console.log(addxress)
        addressBean.city = addxress[1]
        addressBean.country = addxress[2]
        addressBean.address = addxress[3]
      }
      if (!(province = regex.exec(res.address))) {
        regex = /^(.*?(省|自治区))(.*?)$/
        province = regex.exec(res.address)
        console.log(province)
        if (province) {
          addressBean.province = province[1]
          console.log(province[3])
          regexAddressBean(province[3], addressBean)
        } else {
          const regexe = /^(.*?)\((.+?)\)$/g
          const data = regexe.exec(res.address)
          console.log(data)
          console.log(region)
          const latitude = res.latitude
          const longitude = res.longitude
          util.inverseAnalysisAddress(latitude, longitude).then((res) => {
            console.log(res)
            addressBean.province = res.data.result.addressComponent.province
            addressBean.city = res.data.result.addressComponent.city
            addressBean.country = res.data.result.addressComponent.county
            addressBean.address = res.data.result.addressComponent.poi
            state.region = [addressBean.province, addressBean.city, addressBean.country]
          })
          // qqmapsdk.reverseGeocoder({
          //   location: {
          //     latitude: latitude,
          //     longitude: longitude
          //   },
          //   success: function (res) {
          //     console.log(res)
          //     addressBean.province = res.result.address_component.province
          //     addressBean.city = res.result.address_component.city;
          //     addressBean.country = res.result.address_component.district;
          //     that.setData({
          //       region: [
          //         addressBean.province,
          //         addressBean.city,
          //         addressBean.country
          //       ]
          //     })
          //   },
          //   fail: function (res) {
          //     console.log(res);
          //   }
          // })
          addressBean.address = data[2]
          addressName = data[1]
        }
      } else {
        addressBean.province = province[1]
        if (res.poiid && res.poiid === 'City') {
          // 处理IOS第一行数据返回有错
          const regexe = /^(.*?)\((.+?)\)$/g
          const data = regexe.exec(res.name)
          console.log(data)
          const latitude = res.latitude
          const longitude = res.longitude
          util.inverseAnalysisAddress(latitude, longitude).then((res) => {
            console.log(res)
            addressBean.province = res.data.result.addressComponent.province
            addressBean.city = res.data.result.addressComponent.city
            addressBean.country = res.data.result.addressComponent.county
            addressBean.address = res.data.result.addressComponent.poi
            state.region = [addressBean.province, addressBean.city, addressBean.country]
          })
          // qqmapsdk.reverseGeocoder({
          //   location: {
          //     latitude: latitude,
          //     longitude: longitude
          //   },
          //   success: function (res) {
          //     console.log(res)
          //     addressBean.province = res.result.address_component.province
          //     addressBean.city = res.result.address_component.city;
          //     addressBean.country = res.result.address_component.district;
          //     that.setData({
          //       region: [
          //         addressBean.province,
          //         addressBean.city,
          //         addressBean.country
          //       ]
          //     })
          //   },
          //   fail: function (res) {
          //     console.log(res);
          //   }
          // })
          addressBean.address = data[2]
          addressName = data[1]
          console.log(data, 'data')
        } else {
          regexAddressBean(res.address, addressBean)
        }
      }
      console.log(addressBean)
      if (addressBean.address !== '') {
        state.detailedLabelShow = true
      }
      state.address = addressName
      state.houseNumber = addressBean.address
      state.region = [addressBean.province, addressBean.city, addressBean.country]
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    },
  })
}
function handleSave(e) {
  console.log(e.detail.value)
  const self = this
  const reg = /^[1]([3-9])[0-9]{9}$/
  const idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  const emialReg = /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/
  const plateNumberReg =
    /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{6}$|^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{5}$/
  if (state.configInfoSet.name && state.configInfoSet.name.hasMust && !e.detail.value.nickName) {
    uni.showToast({
      title: '请填写姓名',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    state.configInfoSet.name &&
    state.configInfoSet.name.hasMust &&
    e.detail.value.nickName.length > 10
  ) {
    uni.showToast({
      title: '姓名最大不能超过10个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    state.configInfoSet.mobile &&
    state.configInfoSet.mobile.hasMust &&
    !e.detail.value.mobile
  ) {
    uni.showToast({
      title: '请填写手机号',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    state.configInfoSet.mobile &&
    state.configInfoSet.mobile.hasMust &&
    !reg.test(e.detail.value.mobile)
  ) {
    uni.showToast({
      title: '请填写正确的手机号',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    state.configInfoSet.birthday &&
    state.configInfoSet.birthday.hasMust &&
    (!e.detail.value.birthday || e.detail.value.birthday === '未填写')
  ) {
    uni.showToast({
      title: '请选择生日',
      icon: 'none',
      duration: 2000,
    })
  } else if (state.configInfoSet.idCard && state.configInfoSet.idCard.hasMust && !state.idNum) {
    uni.showToast({
      title: '请填写身份证号',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    state.configInfoSet.idCard &&
    state.configInfoSet.idCard.hasMust &&
    !idReg.test(state.idNum)
  ) {
    uni.showToast({
      title: '请填写正确的身份证号',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    state.configInfoSet.gender &&
    state.configInfoSet.gender.hasMust &&
    !(state.gender == 0 || state.gender == 1)
  ) {
    uni.showToast({
      title: '请填写性别',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    state.configInfoSet.plateNumber &&
    state.configInfoSet.plateNumber.hasMust &&
    !plateNumberReg.test(state.cityArray[state.cityIndex] + state.plateNumber)
  ) {
    uni.showToast({
      title: '请填写正确车牌号',
      icon: 'none',
      duration: 2000,
    })
  } else if (state.configInfoSet.email && state.configInfoSet.email.hasMust && !state.email) {
    uni.showToast({
      title: '请填写邮箱',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    state.configInfoSet.email &&
    state.configInfoSet.email.hasMust &&
    !emialReg.test(state.email)
  ) {
    uni.showToast({
      title: '请填写正确的邮箱',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    state.configInfoSet.address &&
    state.configInfoSet.address.hasMust &&
    (!e.detail.value.region ||
      e.detail.value.region === ['省', '市', '区'] ||
      !e.detail.value.address)
  ) {
    console.log(e.detail.value.region, e.detail.value.address, '地址')
    uni.showToast({
      title: '请填写地址',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    state.configInfoSet.address &&
    state.configInfoSet.address.hasMust &&
    e.detail.value.address.length > 40
  ) {
    uni.showToast({
      title: '详细地址最大不能超40个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  } else {
    // 调起接口
    const memberInfo = app.globalData.userInfo.member
    let postData = {
      id: memberInfo.id,
      nickName: e.detail.value.nickName,
      mobile: e.detail.value.mobile,
      birthday: e.detail.value.birthday + ' 00:00:00',
      idNum: e.detail.value.idNum,
      gender: state.gender,
      plateNumber: e.detail.value.plateNumber
        ? state.cityArray[state.cityIndex] + e.detail.value.plateNumber
        : e.detail.value.plateNumber,
      email: e.detail.value.email,
      province: e.detail.value.region && e.detail.value.region[0] ? e.detail.value.region[0] : null,
      city: e.detail.value.region && e.detail.value.region[1] ? e.detail.value.region[1] : null,
      district: e.detail.value.region && e.detail.value.region[2] ? e.detail.value.region[2] : null,
      address: e.detail.value.address ? e.detail.value.address : null,
    }
    if (state.gender === -1) {
      memberInfo.gender = 'UNKNOWN'
      postData = {
        ...postData,
        gender: 'UNKNOWN',
      }
    } else if (state.gender === 0) {
      memberInfo.gender = 'MALE'
      postData = {
        ...postData,
        gender: 'MALE',
      }
    } else if (state.gender === 1) {
      memberInfo.gender = 'FEMALE'
      postData = {
        ...postData,
        gender: 'FEMALE',
      }
    }
    for (const key in postData) {
      if (!postData[key] && key != 'gender') {
        delete postData[key]
      }
    }
    console.log(postData)
    if (postData.id !== null && postData.id !== undefined) {
      memberService
        .update(postData)
        .then((res) => {
          state.show.configInfo = false
          state.show = state.show
          return wxaUserService.login()
        })
        .then((res) => {
          console.log(res)
          // util.setHideLoading(false)
          auth.setUser(res)
          app.globalData.userInfo = res && res.member ? res : null
          if (res.member.promotion) {
            res.member.promotion = JSON.parse(res.member.promotion)
            if (
              res.member.promotion.couponPromotions.length != '0' &&
              res.member.promotion.couponPromotions[0].sendStatus == true
            ) {
              toggle('promotion')
              state.couponPromotions = res.member.promotion.couponPromotions
            } else {
              if (toIndex) {
                NAVPAGE.toHome()
              } else {
                uni.navigateBack({
                  delta: 1,
                })
              }
            }
          } else {
            if (toIndex) {
              NAVPAGE.toHome()
            } else {
              uni.navigateBack({
                delta: 1,
              })
            }
          }
        })
        .catch((err) => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
          uni.navigateBack({
            delta: 1,
          })
        })
    } else {
      uni.showToast({
        title: '您还不是会员，请绑定手机号成为会员~',
        icon: 'none',
        duration: 2000,
      })
    }
  }
}
function jumpHandler() {
  state.show.configInfo = false
  state.show = state.show
  if (toIndex) {
    NAVPAGE.toHome()
  } else {
    uni.navigateBack({
      delta: 1,
    })
  }
}
function cityChange(e) {
  state.cityIndex = e.detail.value
}
function closeAgreement() {
  state.show.agreementLayer = false
  state.show = state.show
}
function agreementBindMobile() {
  state.agreement = true
  closeAgreement()
  const opts = '?from=authorize&inviteInfo=' + JSON.stringify(state.inviteInfo)
  NAVPAGE.toBindMobile(opts)
}
</script>
<style scoped>
/* pages/mallModule/member/authorize/authorize.wxss */
.top-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding-top: 108rpx;
  margin-bottom: 115rpx;
}
/* 抽奖弹窗 */
.popup-box {
  width: 562rpx;
  min-height: 504rpx;
  background: #ffffff;
  border-radius: 10rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.config-box {
  width: 100%;
  /* min-height: 244rpx; */
  max-height: 80vh;
}
.popup-box form {
  padding: 20rpx;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.popup-box .section {
  background: #fff;
  /* border-bottom: 1rpx solid #f1f1f1; */
  font-size: 28rpx;
  height: 80rpx;
  line-height: 80rpx;
  overflow: auto;
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 25rpx;
}
.popup-box .spceial {
  margin-bottom: 0;
  margin-left: 35rpx;
  height: 40rpx;
}
.add-symbol {
  display: flex;
  color: #f56c6c;
}
.popup-box .section-title text {
  color: #f56c6c;
  font-size: 24rpx;
}
.popup-box .section-title {
  color: #454545;
  width: 114rpx;
  /* float: left; */
  text-align: left;
  margin-left: 4px;
  margin-right: 33rpx;
  display: flex;
  white-space: nowrap;
  /* justify-content: space-between; */
}

.popup-box .right {
  /* float: left; */
  width: 543rpx;
  height: 80rpx;
  position: relative;
  font-family: Source Han Sans CN;
  font-size: 28rpx;
  color: #8b8b8c;
  padding: 0 30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-radius: 40rpx;
  border: 1px solid #dddddd;
}
.popup-box .gray {
  background: #dddddd;
}
.popup-box .right .city-box {
  width: 140rpx;
  position: relative;
}
.popup-box .right .city-box image {
  position: absolute;
  right: 45rpx;
  top: 35rpx;
  width: 25rpx;
  height: 15rpx;
}
.popup-box .right input {
  width: 100%;
  color: #8b8b8c;
}

.popup-box .right input::placeholder {
  color: #8b8b8c;
}

.popup-box .right .nickName {
  width: 520rpx;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.popup-box .section-address {
  height: 100rpx;
}
.popup-box .section-address .right {
  height: 100rpx;
}
.popup-box .right .address-text {
  font-size: 28rpx;
  height: 100rpx;
  padding: 20rpx 0;
  line-height: 36rpx;
  width: 80%;
  box-sizing: border-box;
  color: #8b8b8c;
}
.address-picker,
.picker {
  width: 480rpx;
  height: 80rpx;
  color: #8b8b8c;
  /* background: #f00; */
}
.popup-box .address {
  width: 20%;
  height: 30rpx;
  display: flex;
  align-items: center;
  color: #eb702d;
}

.popup-box .address-img {
  width: 25rpx;
  height: 30rpx;
  margin-right: 8rpx;
}
.config-box .btn {
  width: 689rpx;
  height: 88rpx;
  background: #eb702d;
  border-radius: 44rpx;
  margin: 55rpx auto 20rpx;
}
.config-box .lable-box {
  width: 543rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-box .lable-box .lable-item {
  font-size: 24rpx;
  line-height: 72rpx;
  width: 250rpx;
  height: 72rpx;
  border-radius: 40rpx;
  border: 1px solid #dddddd;
  color: #8b8b8c;
  margin-right: 30rpx;
  text-align: center;
  font-family: Source Han Sans CN;
  font-size: 28rpx;
  color: #999999;
  box-sizing: border-box;
}

.config-box .lable-box .lable-item.active {
  color: #fff;
  border: 1px solid #009f55;
}

.config-box .lable-box .lable-item:last-of-type {
  margin-right: 0;
}
.popup-close {
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  right: 19rpx;
  top: 19rpx;
}

.popup-close image {
  width: 22rpx;
  height: 22rpx;
}

.popup-title {
  color: #1c1c1c;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 60rpx;
  margin-top: 44rpx;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 59rpx 0;
}

.popup-content text {
  display: block;
}

.popup-text {
  color: #019f55;
  font-size: 44rpx;
  line-height: 68rpx;
  font-weight: 500;
  text-align: center;
  width: 374rpx;
}

.popup-text-end {
  color: #019f55;
  font-size: 44rpx;
  line-height: 56rpx;
  font-weight: bold;
  text-align: center;
  width: 374rpx;
}

.popup-tips {
  color: #1c1c1c;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 54rpx;
}

.popup-button {
  padding-bottom: 52rpx;
  text-align: center;
}

.popup-button text {
  font-size: 30rpx;
  line-height: 50rpx;
  color: #999999;
  margin-bottom: 10rpx;
  display: block;
}

.top-info text {
  font-size: 44rpx;
  color: #000000;
  line-height: 50rpx;
  margin-top: 38rpx;
}

.logo {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
}

.auth-tips {
  display: block;
  font-size: 30rpx;
  color: #737373;
  line-height: 50rpx;
  margin-bottom: 28rpx;
  width: 100%;
  text-align: center;
}

.btn {
  font-size: 36rpx;
  line-height: 88rpx;
  height: 88rpx;
  width: 670rpx;
  border-radius: 10rpx;
  color: #ffffff;
  background: #0bb908;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth {
  border-radius: 60rpx;
}

.register {
  margin-top: 136rpx;
  border-radius: 60rpx;
}

.default {
  background: #ffffff;
  border: 2rpx solid #0bb908;
  color: #0bb908;
  margin-top: 30rpx;
  border-radius: 60prx;
  overflow: hidden;
}

.register image {
  width: 52rpx;
  height: 42rpx;
  margin-right: 8rpx;
}

.default image {
  width: 52rpx;
  height: 50rpx;
  margin-right: 8rpx;
}

button[disabled].register {
  background: #0bb908 !important;
  color: #ffffff !important;
  opacity: 0.6;
}
.share-btn {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 400;
  text-align: center;
  width: 369rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: #019f55;
  border-radius: 10rpx;
  padding: 0;
}

.popup-luckdraw-box {
  padding-bottom: 20rpx;
  position: relative;
}

.popup-luckdraw-close {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  right: 66rpx;
  top: 80rpx;
}

.popup-luckdraw-close image {
  width: 40rpx;
  height: 40rpx;
}

.popup-luckdraw-window-box {
  padding-bottom: 20rpx;
  position: relative;
}

.popup-luckdraw-window-close {
  margin-top: 65rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-luckdraw-window-close image {
  width: 56rpx;
  height: 56rpx;
}

.popup-window-image {
  width: 570rpx;
  max-height: 700rpx;
}

.popup-window-image button {
  background: transparent;
  border: 0;
}

.popup-window-image button::after {
  border: 0;
}

.popup-window-image image {
  width: 100%;
  height: 100%;
}
.agreement {
  width: 100%;
  position: fixed;
  bottom: 200rpx;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}
.agreement-btn {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border: 1px solid #999;
  margin-right: 12rpx;
}
.agreement-btn image {
  width: 30rpx;
  height: 30rpx;
}
.active {
  background: #eb702d;
  border-color: transparent;
}
.go-agreement {
  color: #e13926;
}

.config-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 43rpx 20rpx;
  box-sizing: border-box;
}
.left-icon {
  width: 60rpx;
  height: 60rpx;
}
.left-icon image {
  width: 25rpx;
  height: 13rpx;
  transform: rotate(-90deg);
}
.title-font {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 40rpx;
  color: #333333;
}
.jump-btn {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #eb702d;
}
.popup-agreement {
  color: #666;
  margin: 40rpx 0;
  font-size: 30rpx;
}
.popup-agreement-box {
  min-height: 310rpx;
  position: relative;
}
.popup-agreement-box .popup-title {
  margin-top: 20rpx;
}
.popup-agreement-box .popup-agreement .go-agreement {
  font-size: 32rpx;
}
.popup-agreement-box .popup-group {
  width: 100%;
  display: flex;
  border-top: 1px solid #ccc;
  position: absolute;
  bottom: 0;
  left: 0;
}
.popup-agreement-box .popup-group button {
  width: 50%;
  border: none;
  background: transparent;
  border-radius: none;
  color: #666;
  font-size: 32rpx;
}
.popup-agreement-box .popup-group .share-right {
}
</style>
