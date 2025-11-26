<template>
  <!--components/home-page/top-member/top-member.wxml-->
  <view>
    <!-- 顶部会员区 -->
    <view class="top-member-loading-box" :hidden="loaded">
      <view class="top">
        <view class="left"></view>
        <view class="right">
          <view class="name"></view>
          <view class="grade"></view>
        </view>
      </view>
      <view class="middle"></view>
    </view>
    <view
      class="top-member-box top-member-before"
      @click.stop="!hasUserInfo ? 'getUserInfo' : ''"
      v-if="loaded && itemData.styleType === '3'"
      :style="
        'background-image:url(' +
        (itemData.backGroundType === 'backgroundImage' && itemData.backGroundImgObj
          ? itemData.backGroundImgObj.imageUrl
          : '') +
        ');border-radius: ' +
        itemData.fillet +
        'px;margin: ' +
        moduleSpacing +
        'px 0;padding: 30rpx ' +
        pageMargin +
        'px;box-sizing: border-box;'
      "
    >
      <view
        class="user-bg"
        :style="
          'background-color: ' +
          (itemData.backGroundType === 'backgroundColor' ? itemData.backGroundColor : '') +
          ';'
        "
      ></view>
      <view class="top-user-info">
        <button v-if="!hasUserInfo" @click.stop="getUserInfo"></button>
        <image
          lazy-load=""
          v-else
          class="avatarUrl"
          :src="userInfo.member ? userInfo.member.avatar : userInfo.avatarUrl"
        ></image>
        <view
          class="name-mobile"
          :style="
            'display: ' +
            (!hasUserInfo
              ? 'flex;flex: 1 1 auto;flex-direction: inherit;justify-content: space-between;align-items: center;'
              : 'block') +
            ';'
          "
        >
          <!-- <text wx:if="{{!hasUserInfo}}" class="nike-name no-userInfo">点击头像授权登录</text> -->
          <text v-if="!hasUserInfo" class="nike-name no-userInfo">未登录</text>
          <view class="member-grade2" v-if="!hasUserInfo">
            <button @click.stop="getUserInfo" class="login-btn">登录/注册</button>
          </view>
          <view v-else class="nickName-box">
            <view class="nike-name">
              <view class="member-name">
                Hi，{{ member.nickName ? member.nickName : userInfo.nickName }}
                <view class="vip-nameplate" v-if="member.gradeName" @click.stop="toBenefits">
                  <image
                    lazy-load=""
                    style="border-radius: 0"
                    v-if="memberGrade && memberGrade.gradeLablePicture"
                    class="vip-nameplate-img"
                    :src="memberGrade.gradeLablePicture"
                  ></image>
                  <text>{{ member.gradeName ? member.gradeName : '' }}></text>
                </view>
                <view v-if="isVIP" class="member-nameplate">
                  <image lazy-load="" class="flower" :src="imagesPath.iconVIPFlower"></image>
                  {{ vipGradeConfig.name }}
                </view>
              </view>
              <view class="mobile-box">
                {{ member.mobile ? member.mobile : userInfo.mobile }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="top-member-card" style="height:{{isShowScorePayCode?'292rpx':''}}"> -->
      <view class="top-member-card">
        <view class="member-num">
          <!-- <text>{{showMemberCode ? "会员码" : "付款码"}}</text>
      <text wx:if="{{showMemberCode}}">{{member.id ? filters.formatMobile(member.mobile) : "xxxx xxxx xxxx xxxx"}}</text>
      <text wx:else>{{payCode !== "" ? filters.filtQRNumber(payCode) : "xxxx xxxx xxxx xxxx"}}</text> -->
        </view>
        <view v-if="isMember">
          <view class="member-code-box">
            <view class="barcode-box" v-if="codeType == 'BarCode'" @click="toMemberCard">
              <image
                lazy-load=""
                v-if="barcodeImageUrl"
                :src="barcodeImageUrl"
                mode="aspectFit"
                :style="'width: ' + codeWidth + 'px; height: ' + codeHeight + 'px;'"
              ></image>
              <canvas
                v-else
                id="mbrbarcode"
                type="2d"
                :style="'width: ' + codeWidth + 'px; height: ' + codeHeight + 'px;'"
              ></canvas>
            </view>
            <view class="qrcode-box" v-else-if="codeType != 'BarCode'" @click="toMemberCard">
              <image
                lazy-load=""
                v-if="qrcodeImageUrl"
                :src="qrcodeImageUrl"
                mode="aspectFit"
                style="width: 280px; height: 280px"
              ></image>
              <canvas v-else id="mbrqrcode" type="2d" style="width: 280px; height: 280px"></canvas>
            </view>
            <!-- <text style="margin-top:{{codeType=='BARCODE'?'25rpx':'20rpx'}}">{{memberId}}</text> -->
            <view class="refresh" @click="refreshMbrCode" v-if="codeType != 'BARCODE'">
              <image lazy-load="" :src="imagesPath.iconRefresh2"></image>
              会员码将在{{ updateTimeText }}后自动刷新
            </view>
          </view>
          <!-- <canvas canvas-id="indexBarcode" style='{{barcodeLeft}}' bindtap="toMemberCard" />
      <image lazy-load wx:if="{{barcodeImageUrl !== ''}}" src="{{barcodeImageUrl}}" bindtap="toMemberCard" ></image>
      <image lazy-load wx:else class="bg-img" src="{{imagesPath.iconBarcode}}" ></image> -->
        </view>
        <view v-else>
          <view class="authorize-box">
            <image lazy-load="" class="bg-img" :src="imagesPath.iconBarcode"></image>
            <button
              v-if="!hasUserInfo"
              class="bind-phone"
              :style="'color: ' + themeColor"
              @click.stop="getUserInfo"
            >
              点击获取会员码
            </button>
            <button
              v-if="hasUserInfo && !isMember"
              class="bind-phone"
              :style="'color: ' + themeColor"
              @click="toAuthorize"
            >
              点击获取会员码
            </button>
          </view>
        </view>
        <!-- isShowScorePayCode 原判断条件 -->
        <!-- <view class="score-balance-pay" wx:if="{{itemData.isShowPayMethod === '1'}}">
      <view class="pay-item" data-type="score" bindtap="toCardPay" wx:if="{{isScorePay}}">
        <image lazy-load src="{{imagesPath.iconIndexScorePay}}"></image>
        <text>积分支付</text>
      </view>
      <view class="pay-item" data-type="balance" bindtap="toCardPay" wx:if="{{!qrpay}}">
        <image lazy-load src="{{imagesPath.iconIndexCardPay}}"></image>
        <text>储值支付</text>
      </view>
      <view class="pay-item" bindtap="toMyGiftCard">
        <image lazy-load src="{{imagesPath.iconMemberQRPay}}"></image>
        <text>礼品卡支付</text>
      </view>
      <view class="pay-item" bindtap="toWeixinPay" wx:if="{{isWxPay}}">
        <image lazy-load src="{{imagesPath.iconWeixinPay}}"></image>
        <text>微信支付</text>
      </view>
    </view> -->
      </view>
      <view class="top-member-function">
        <view class="item" @click="toBalance">
          <view>
            {{ hasUserInfo ? (reserveBalance == null ? '-' : reserveBalance) : '***' }}
            <text>元</text>
          </view>
          <view>储值金额</view>
        </view>
        <view class="item" @click="toScore">
          <view>
            {{ hasUserInfo ? (scoreBalance == null ? '-' : scoreBalance) : '***' }}
            <!-- <text>元</text> -->
          </view>
          <view>当前积分</view>
        </view>
        <view class="item" @click="toMyCoupon">
          <view>
            {{ hasUserInfo ? (couponNum == null ? '-' : couponNum) : '***' }}
            <text>张</text>
          </view>
          <view>优惠券</view>
        </view>
        <view class="item" v-if="memberEntrance.isShowGiftCard" @click="toMyGiftCard">
          <view>
            {{ hasUserInfo ? giftcardNum : '***' }}
            <text>张</text>
          </view>
          <view>礼品卡</view>
        </view>
        <button v-if="!hasUserInfo" class="authorization" @click.stop="getUserInfo"></button>
      </view>
    </view>
    <view
      v-if="loaded && itemData.styleType === '2'"
      @click.stop="!hasUserInfo ? 'getUserInfo' : ''"
      :style="'margin: ' + moduleSpacing + 'px 0;padding: 0 ' + pageMargin + 'px'"
    >
      <view
        class="style2"
        :style="
          'background-color: ' +
          (itemData.backGroundType === 'backgroundColor' ? itemData.backGroundColor : '') +
          ';background-image:url(' +
          (itemData.backGroundType === 'backgroundImage' && itemData.backGroundImgObj
            ? itemData.backGroundImgObj.imageUrl
            : '') +
          ');border-radius: ' +
          itemData.fillet +
          'px;'
        "
      >
        <view class="member-info-left">
          <view class="member-info-top">
            <image
              lazy-load=""
              :src="userInfo.member ? userInfo.member.avatar : userInfo.avatarUrl"
              alt=""
              class="avatar"
            ></image>
            <view class="member-info">
              <view class="info-box">
                <view class="member-name" v-if="!hasUserInfo">未登录</view>
                <view class="member-name" v-else>
                  Hi，{{ member.nickName ? member.nickName : userInfo.nickName }}

                  <view class="vip-nameplate" v-if="member.gradeName" @click.stop="toBenefits">
                    <image
                      lazy-load=""
                      style="border-radius: 0"
                      v-if="memberGrade && memberGrade.gradeLablePicture"
                      class="vip-nameplate-img"
                      :src="memberGrade.gradeLablePicture"
                    ></image>
                    <text>{{ member.gradeName ? member.gradeName : '' }}></text>
                  </view>
                  <view class="member-grade" v-if="isVIP">
                    <image lazy-load="" class="flower" :src="imagesPath.iconVIPFlower"></image>
                    {{ vipGradeConfig.name }}
                  </view>
                </view>
              </view>
              <view class="phone">
                <text v-if="showMemberCode">
                  {{ member.id ? filters.formatMobile(member.mobile) : 'xxxx xxxx xxxx xxxx' }}
                </text>
                <text v-else>
                  {{ payCode !== '' ? filters.filtQRNumber(payCode) : 'xxxx xxxx xxxx xxxx' }}
                </text>
              </view>
            </view>
          </view>
          <view class="member-asset">
            <view @click="toRecharge" class="item" v-if="showBalance">
              <text>储值金额</text>
              <text>
                {{ hasUserInfo ? (reserveBalance == null ? '-' : reserveBalance) : '***' }}(元)
              </text>
            </view>
            <view @click="toScore" class="item" v-if="showScore">
              <text>积分</text>
              <text>{{ hasUserInfo ? (scoreBalance == null ? '-' : scoreBalance) : '***' }}</text>
            </view>
            <view @click="toMyCoupon" class="item" v-if="showCoupon">
              <text>卡券</text>
              <text>{{ hasUserInfo ? (couponNum == null ? '-' : couponNum) : '***' }}</text>
            </view>
            <view @click="toMyGiftCard" class="item" v-if="showGiftCard">
              <text>礼品卡</text>
              <text>{{ hasUserInfo ? giftcardNum : '***' }}张</text>
            </view>
          </view>
        </view>
        <view class="member-info-right" v-if="hasUserInfo" @click="toMemberCard">
          <image lazy-load="" :src="imagesPath.iconMemberCardBlack" alt=""></image>
          <view>会员码</view>
        </view>
        <view class="member-info-right" v-else>
          <view class="member-grade2">
            <button @click.stop="getUserInfo" class="login-btn">登录/注册</button>
          </view>
        </view>
      </view>
    </view>
    <view
      v-if="loaded && itemData.styleType === '1'"
      @click.stop="!hasUserInfo ? 'getUserInfo' : ''"
      :style="'margin: ' + moduleSpacing + 'px 0;padding: 0 ' + pageMargin + 'px'"
    >
      <view
        class="style1"
        :style="
          'background-color: ' +
          (itemData.backGroundType === 'backgroundColor' ? itemData.backGroundColor : '') +
          ';background-image:url(' +
          (itemData.backGroundType === 'backgroundImage' && itemData.backGroundImgObj
            ? itemData.backGroundImgObj.imageUrl
            : '') +
          ');border-radius: ' +
          itemData.fillet +
          'px;'
        "
      >
        <view class="member-name" v-if="!hasUserInfo">未登录</view>
        <view class="member-name" v-else>
          Hi，{{ member.nickName ? member.nickName : userInfo.nickName }}
          <view
            class="vip-nameplate vip-nameplate1"
            v-if="member.gradeName"
            @click.stop="toBenefits"
          >
            <image
              lazy-load=""
              style="border-radius: 0"
              v-if="memberGrade && memberGrade.gradeLablePicture"
              class="vip-nameplate-img"
              :src="memberGrade.gradeLablePicture"
            ></image>
            <text>{{ member.gradeName ? member.gradeName : '' }}></text>
          </view>
          <view class="member-grade" v-if="isVIP">
            <image lazy-load="" class="flower" :src="imagesPath.iconVIPFlower"></image>
            {{ vipGradeConfig.name }}
          </view>
        </view>
        <view class="member-grade2" v-if="!hasUserInfo">
          <button @click.stop="getUserInfo" class="login-btn">登录/注册</button>
        </view>
        <view class="member-asset">
          <view class="item" v-if="showBalance">
            <text>储值金额</text>
            <text>
              {{ hasUserInfo ? (reserveBalance == null ? '-' : reserveBalance) : '***' }}(元)
            </text>
          </view>
          <view class="item" v-if="showScore">
            <text>积分</text>
            <text>{{ hasUserInfo ? (scoreBalance == null ? '-' : scoreBalance) : '***' }}</text>
          </view>
          <view class="item" v-if="showCoupon">
            <text>卡券</text>
            <text>{{ hasUserInfo ? (couponNum == null ? '-' : couponNum) : '***' }}</text>
          </view>
          <view class="item" v-if="showGiftCard">
            <text>礼品卡</text>
            <text>{{ hasUserInfo ? giftcardNum : '***' }}张</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _homePageCommonBehaviorJs from '../homePageCommonBehavior'
import _utilsUtilsJs2 from '@/utils/newretail/utils'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _lazyLoadPageLazyLoadBaseJs from '../../lazy-load-page/lazy-load-base'
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _apiGiftCardServiceJs from '@/service/api/newretail/giftCardService'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
// import { ready } from "@dcloudio/uni-app";
import { reactive, watch } from 'vue'
// components/home-page/top-member/top-member.js
const IMGAGESPATH = _utilsImagesPathJs
const THEMEMANAGER = _utilsThemeManagerJs
const memberService = _apiMemberServiceJs
const couponService = _apiCouponServiceJs
const giftCardService = _apiGiftCardServiceJs
const NAVPAGE = _utilsNavPageJs
const AUTHORIZE = _utilsAuthorizeJs
const wxbarcode = _utilsSelfJs
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs
const utils = _utilsUtilsJs
const util = _utilsUtilsJs2
const homePageCommonBehavior = _homePageCommonBehaviorJs
const sysService = _apiSystemServiceJs
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
// 获取应用实例
const state = reactive({
  memberResourceKeyList: ['scoreBalance', 'reserveBalance', 'couponNum', 'giftcardNum'],
  errFlag: false,
  getDataFlag: true,
  oldUpdateTime: null,
  updateTime: null,
  updateTimeText: '',
  showBalance: false,
  showScore: false,
  showCoupon: false,
  showGiftCard: false,
  imagesPath: IMGAGESPATH,
  theme: THEMEMANAGER,
  themeColor: THEMEMANAGER.color,
  loaded: false,
  barcodeImageUrl: '',
  qrcodeImageUrl: '',
  barcodeLeft: '',
  userInfo: {},
  member: {},
  memberEntrance: {},
  hasUserInfo: false,
  showMemberCode: true,
  isMember: false,
  memberCode: '',
  payCode: '',
  pageScrollData: {},
  isVIP: false,
  vipGradeConfig: {},
  uiconfig: {},
  scoreBalance: null,
  reserveBalance: null,
  couponNum: null,
  codeType: 'BarCode',
  memberId: '',
  codeWidth: 586,
  codeHeight: 174,
  canvasHidden: false,
  systemOptions: {},
  qrpay: false,
})
const props = defineProps({
  memberCodeType: {
    type: String,
    value: '',
  },
  timeNumber: {
    type: Number,
    value: 0,
  },
  show: {
    // 属性名
    type: Boolean,
    value: false,
  },
  moduleSpacing: {
    // 属性名
    type: Number,
    value: 0,
  },
  pageMargin: {
    // 属性名
    type: Number,
    value: 0,
  },
  itemData: {
    // 属性名
    type: Object,
    value: {},
  },
  pageScrollData: {
    // 属性名
    type: Object,
    value: null,
  },
  refreshType: {
    // 属性名
    type: String,
    value: '',
  },
  memberResource: {
    // 属性名
    type: Object,
    value: {},
  },
})
watch(
  () => props.itemData,
  (newVal) => {
    state.showBalance = newVal.assetSetting.includes('BALANCE')
    state.showScore = newVal.assetSetting.includes('SCORE')
    state.showCoupon = newVal.assetSetting.includes('COUPON')
    state.showGiftCard = newVal.assetSetting.includes('GIFT_CARD')
    app.globalData.systemInfo = {
      ...uni.getSystemSetting(),
      ...uni.getAppAuthorizeSetting(),
      ...uni.getDeviceInfo(),
      ...uni.getWindowInfo(),
      ...uni.getAppBaseInfo(),
    }
  },
)
watch(
  () => props.refreshType,
  (newVal) => {
    // 属性值变化时执行
    if (newVal !== '' && newVal !== 'USER') {
      reload(true)
      checkUserInfo()
    } else if (newVal === 'USER') {
      // 刷新会员数据
      checkUserInfo()
    }
    if (newVal == 'ALL') {
      state.oldUpdateTime += 1000
      state.updateTimeText = ''
      refreshMbrCode()
    }
  },
)
watch(
  () => props.memberResource,
  (newVal) => {
    if (newVal) {
      state.memberResourceKeyList.forEach((key) => {
        state.key = newVal[key] || newVal[key] === 0 ? newVal[key] : state[key]
      })
    }
  },
)
watch(
  () => props.show,
  (newVal) => {
    // 属性值变化时执行
    if (newVal) {
      reload(true)
      checkUserInfo()
    }
  },
)
watch(
  () => props.memberCodeType,
  (newV) => {
    state.codeType = newV
  },
)
watch(
  () => props.timeNumber,
  (newV) => {
    if (
      newVal &&
      app.globalData.userInfo &&
      app.globalData.userInfo.member &&
      state.updateTime &&
      state.itemData &&
      state.itemData.styleType == '3'
    ) {
      state.oldUpdateTime += 1000
      if (state.updateTime < newVal) {
        state.updateTimeText = ''
        refreshMbrCode()
      } else {
        const diff = state.updateTime - state.oldUpdateTime
        const date = new Date(diff)
        const H = Math.floor(diff / 1000 / 3600)
        const M = date.getUTCMinutes()
        const S = date.getUTCSeconds()
        state.updateTimeText = (H ? H + '小时' : '') + M + '分' + S + '秒'
      }
    }
  },
)
function attached() {
  getMemberUserInfo()
  state.theme = {
    color:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background: ' + app.globalData.uiconfig.themeColor + ';'
        : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient:
      app.globalData.uiconfig &&
      app.globalData.uiconfig.themeColor != null &&
      app.globalData.uiconfig.themeColor !== '#FF9F43'
        ? 'background: linear-gradient(-270deg, ' +
          app.globalData.uiconfig.themeColor +
          ', ' +
          app.globalData.uiconfig.themeColor +
          ');'
        : 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
    mainColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'border-color:rgba(255,159,67, 0.4);',
    mainColorRgb02:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
        : 'rgba(255,159,67, 0.2)',
    BgColorRgb01:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
        : 'background-color:rgba(255,159,67, 0.1);',
  }
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
}
function moved() {}
function detached() {}
ready(function () {
  // this.reload();
  checkUserInfo()
  getMemberUserInfo()
  const systemOptions = app.globalData.configureInfo
  const configures = {
    hasRedPacket: false,
  }
  let isScorePay = false
  let isWxPay = false
  let isBlancePay = false
  systemOptions.forEach((item) => {
    // 根据配置项配置红包功能
    if (item.key === 'hasRedPacket' && item.value != null) {
      item.value === 'TRUE' ? (configures.hasRedPacket = true) : (configures.hasRedPacket = false)
    } else if (
      item.key === 'memberCodeDisplayPayMethod' &&
      item.value != null &&
      item.value !== ''
    ) {
      // 会员码展示的付款方式 积分支付：SCOREPAY 微信支付：WXPAY 余额支付：BLANCEPAY(多个以英文逗号分隔)
      const memberCodeDisplayPayMethod = item.value
      const payMethods = memberCodeDisplayPayMethod.split(',')
      if (payMethods && payMethods.length > 0) {
        payMethods.forEach((it) => {
          if (it.indexOf('SCOREPAY') > -1) {
            if (!app.globalData.systemConfigure.showScorePayCode) {
              isScorePay = false
            } else {
              isScorePay = true
            }
          } else if (it.indexOf('WXPAY') > -1) {
            isWxPay = true
          } else if (it.indexOf('BLANCEPAY') > -1) {
            isBlancePay = true
          }
        })
      }
    }
  })
  if (app.globalData.uiconfig && app.globalData.uiconfig.isHomePayCodeEnabled) {
    state.qrpay = true
  }
  state.systemOptions = configures
  state.isScorePay = isScorePay
  state.isWxPay = isWxPay
  state.isBlancePay = isBlancePay
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
})
function refreshMbrCode() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.barcodeImageUrl = null
    state.qrcodeImageUrl = null
    state.getDataFlag = true
    getMbrCode()
    // if (this.data.codeType !== 'BarCode') {
    // }
  } else {
    uni.showToast({
      title: '您还没有登陆哦~',
      icon: 'none',
      duration: 2000,
    })
  }
}
function getMbrCode() {
  const that = this
  // clearTimeout(this.data.time)
  if (state.errFlag) return false
  memberService
    .getMbrCode()
    .then((res) => {
      state.errFlag = false
      res.code = res.code ? res.code : app.globalData.userInfo.member.mobile
      let codeType = state.codeType
      if (res.expiresInSeconds && codeType === 'BarCode') {
        codeType = 'QRCode'
      }
      if (res.expiresInSeconds) {
        state.oldUpdateTime = state.timeNumber
        state.updateTime = state.timeNumber ? state.timeNumber + res.expiresInSeconds * 1000 : null
      }
      state.memberId = res.code
      state.memberCode = res.code
      state.codeType = codeType
      state.memberId = phoneSeparated(res.code)
      if (state.codeType !== 'BarCode' && res.expiresInSeconds) {
        const expiresInSecondsTime = res.expiresInSeconds * 1000
        const now = new util.ResponseDate().getTime()
        const expiresInSeconds = now + res.expiresInSeconds * 1000
        const data = {
          code: res.code,
          expiresInSeconds,
        }
        // try {
        //   wx.setStorageSync('wj_payCodeTime', data)
        // } catch (e) {}
        // var time = setTimeout(() => {
        //   this.getMbrCode()
        //   console.log('刷新了')
        // }, expiresInSecondsTime);
        // that.setData({
        //   time: time
        // })
      }
      getCacheOrder()
      return res
    })
    .catch((err) => {
      state.errFlag = true
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function codeTextPartition(val) {
  val = val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, '$1 ')
  return val
}
function phoneSeparated(phoneNumber) {
  let tel = trim(phoneNumber, 'g')
  if (isPhone(tel)) {
    tel = tel.substring(0, 3) + ' ' + tel.substring(3, 7) + ' ' + tel.substring(7, 11)
  } else {
    tel = codeTextPartition(tel)
  }
  return tel
  // 去掉字符串中所有空格(包括中间空格,需要设置第2个参数为:g)
  function trim(str, is_global) {
    let result
    result = str.replace(/(^\s+)|(\s+$)/g, '')
    if (is_global && is_global.toLowerCase() == 'g') {
      result = result.replace(/\s/g, '')
    }
    return result
  }
  // 判断是否是手机号码格式
  function isPhone(str) {
    const reg = /^1(3|4|5|7|8)\d{9}$/
    return reg.test(trim(str, 'g'))
  }
}
function toMemberCard(e) {
  if (state.hasUserInfo && state.isMember) {
    // 如果首页开启付款码，则不到会员码页面，点击直接跳转付款码页面
    if (state.uiconfig.isHomePayCodeEnabled) {
      NAVPAGE.toPayCode()
    } else {
      NAVPAGE.toMemberCard()
    }
  } else {
    NAVPAGE.toAuthorize()
  }
}
function setMbrCode(res) {
  const that = this
  res.code = res.code ? res.code : app.globalData.userInfo.member.mobile
  let codeType = state.codeType
  if (res.expiresInSeconds && codeType === 'BarCode') {
    codeType = 'QRCode'
  }
  if (codeType === 'BarCode') {
    state.memberId = res.code
    state.memberCode = res.code
    state.codeType = codeType
  } else {
    state.memberId = res.code
    state.memberCode = res.code
    state.codeType = codeType
  }
  if (codeType === 'BarCode') {
    setTimeout(() => {
      wxbarcode.barcode('mbrbarcode', res.code, state.codeWidth, state.codeHeight)
    }, 1000)
  } else {
    wxbarcode.qrcode('mbrqrcode', res.code, 280, 280)
  }
  state.memberId = phoneSeparated(res.code)
}
function reload(refresh = false) {
  const that = this
  if (!state.loaded) {
    lazyLoadBase
      .determineComponentInVisibleArea('.top-member-loading-box', that)
      .then((res) => {
        if (res) {
          // that.renderingPageByUI()
          state.loaded = true
        }
      })
      .catch((err) => {
        console.log(err)
      })
  } else if (refresh) {
    renderingPageByUI()
  }
}
function handleMemberInfo() {}
function renderingPageByUI() {
  if (!app.globalData.uiconfig) {
    return
  }
  const uiconfig = app.globalData.uiconfig
  // 一码付已经移除
  // if (uiconfig && uiconfig.isHomePayCodeEnabled) {
  //   console.log(uiconfig.isHomePayCodeEnabled)
  //   this.setData({
  //     showMemberCode: false
  //   })
  // }
  let isHomeShowTopSearch = true
  let isHomeShowTopMember = false
  let isHomeShowNearStore = false
  let isShowScorePayCode = false
  uiconfig.isHomeShowTopSearch === true
    ? (isHomeShowTopSearch = true)
    : (isHomeShowTopSearch = false)
  uiconfig.isHomeShowTopMember === true
    ? (isHomeShowTopMember = true)
    : (isHomeShowTopMember = false)
  uiconfig.isHomeShowNearStore === true
    ? (isHomeShowNearStore = true)
    : (isHomeShowNearStore = false)
  uiconfig.isShowScorePayCode === true ? (isShowScorePayCode = true) : (isShowScorePayCode = false)
  let afterShareToDraw = false
  if (uiconfig.afterShareToDraw) {
    afterShareToDraw = uiconfig.afterShareToDraw
  }
  state.afterShareToDraw = afterShareToDraw
  if (!app.globalData.systemConfigure.showScorePayCode) {
    isShowScorePayCode = false
  }
  // 如果开启顶部会员区  根据 topMemberEntrance 查询接口显示会员相关信息
  state.isHomeShowTopSearch = isHomeShowTopSearch
  state.isHomeShowTopMember = isHomeShowTopMember
  state.isHomeShowNearStore = isHomeShowNearStore
  state.isShowScorePayCode = isShowScorePayCode
  if (state.loaded) {
    // let isShowScore = false;
    // let isShowCoupon = false;
    // let isShowBalance = false;
    // let isShowGiftCard = false;

    // uiconfig.topMemberEntrance.forEach(item => {
    //   if (item === "SCORE") {
    //     isShowScore = true;
    //   } else if (item === "COUPON") {
    //     isShowCoupon = true;
    //   } else if (item === "BALANCE") {
    //     isShowBalance = true;
    //   } else if (item === "GIFT_CARD") {
    //     isShowGiftCard = true;
    //   }
    // })
    // this.setData({
    //   memberEntrance: {
    //     isShowScore: isShowScore,
    //     isShowCoupon: isShowCoupon,
    //     isShowBalance: isShowBalance,
    //     isShowGiftCard: isShowGiftCard
    //   }
    // })
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      // // 获取用户的积分
      // isShowScore ? this.queryScore() : () => {};
      // // 获取用户未使用的券数量
      // isShowCoupon ? this.queryCoupon() : () => {};
      // // 获取用户的储值余额
      // isShowBalance ? this.queryBalance() : () => {};
      // // 获取用户的礼品卡数量
      // isShowGiftCard ? this.queryGiftCard() : () => {};
      // this.queryScore()
      // this.queryCoupon()
      // this.queryBalance()
      // this.queryGiftCard()
    }
  }

  // if (!this.data.loaded) {
  //   this.setData({
  //     loaded: true
  //   })
  // }
}
function queryGiftCard() {
  const statusEquals = 'ACTIVED'
  if (state.member && state.member.id != null) {
    giftCardService
      .queryMyGiftCard(state.member.id, statusEquals)
      .then((res) => {
        if (res) {
          state.giftcardNum = res.length
        }
      })
      .catch((err) => {
        console.error('查询礼品卡报错：', err.message)
        state.giftcardNum = 0
      })
  }
}
function queryScore() {
  memberService
    .getBalance(state.member.mobile)
    .then((res) => {
      state.scoreBalance = res
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function queryBalance() {
  memberService
    .getMbrBalance()
    .then((res) => {
      if (res || res == 0) {
        state.reserveBalance = res.toFixed(2)
      }
    })
    .catch((e) => {
      if (e.message !== '查询会员余额失败') {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000,
        })
      } else {
        console.log('查询会员余额失败')
      }
    })
}
function queryCoupon() {
  couponService
    .getMbrUnUseCouponCount()
    .then((res) => {
      state.couponNum = res
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function setCanvas(code) {
  const that = this
  wxbarcode.barcode('indexBarcode', code, 640, 120, that)
  const pixelRatio = app.globalData.systemInfo ? app.globalData.systemInfo.pixelRatio : 2
  setTimeout(() => {
    uni.canvasToTempFilePath(
      {
        x: 0,
        y: 0,
        width: 640,
        height: 120,
        destWidth: 640 * pixelRatio,
        destHeight: 120 * pixelRatio,
        canvasId: 'indexBarcode',
        success(res) {
          state.barcodeImageUrl = res.tempFilePath
        },
        fail(err) {
          console.log(err)
        },
      },
      that,
    )
  }, 1000)
}
function toBenefits() {
  NAVPAGE.toBenefits()
}
function toAuthorize() {
  NAVPAGE.toAuthorize()
}
function toCardPay(e) {
  if (state.hasUserInfo && state.isMember) {
    const opts = '?type=' + e.currentTarget.dataset.type
    NAVPAGE.toBalancePay(opts)
  } else {
    NAVPAGE.toBalancePay()
  }
}
function toWeixinPay() {
  memberService
    .getOfflinePaySign()
    .then((res) => {
      const sign = JSON.parse(res)
      uni.openOfflinePayView({
        appId: sign.appId,
        timeStamp: sign.timeStamp,
        nonceStr: sign.nonceStr,
        package: sign.packageValue,
        signType: 'MD5',
        paySign: sign.paySign,
        success: function (res) {
          console.log(res.data)
        },
        fail: function (res) {
          console.log(res)
        },
      })
    })
    .catch((error) => {
      console.log(error)
    })
}
function toPayCode() {
  if (state.isMember) {
    NAVPAGE.toPayCode()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toScore() {
  if (state.isMember) {
    NAVPAGE.toScoreDetails()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toBalance() {
  if (state.isMember) {
    NAVPAGE.toBalance()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toMyCoupon(e) {
  if (state.isMember) {
    NAVPAGE.toMyCoupon()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toMyGiftCard() {
  if (state.isMember) {
    NAVPAGE.toBuyHistory()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function toRecharge() {
  if (state.isMember) {
    NAVPAGE.toRecharge()
  } else {
    NAVPAGE.toAuthorize()
  }
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = !!app.globalData.userInfo.member
    state.userInfo = {
      ...app.globalData.userInfo,
      ...app.globalData.userInfo.wxaUser,
    }
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo
      let isExpired = false
      let isVIP = false
      const now = new utils.ResponseDate().getTime()
      let vipEndTimeStamp = now + 1000
      let vipEndTime = ''
      if (res.member.vipEndTime) {
        vipEndTimeStamp = new Date(res.member.vipEndTime.replace(/-/g, '/')).getTime()
        vipEndTime = res.member.vipEndTime.split(' ')[0].replace(/-/g, '.')
      }
      if (now > vipEndTimeStamp) {
        isExpired = true
      }
      if (res.member.vipEndTime && now < vipEndTimeStamp) {
        isVIP = true
        app.globalData.userInfo.member.vip = true
      }
      state.isMember = true
      state.member = res.member
      state.isVIP = isVIP
      state.isExpired = isExpired
      state.vipEndTime = vipEndTime
      getMemberUserInfo()
    }
  } else {
    state.hasUserInfo = false
    state.isMember = false
    state.member = null
    state.userInfo = null
  }
}
function getMemberUserInfo() {
  const that = this
  const user = app.globalData.userInfo
  if (user) {
    state.userInfo = {
      ...state.userInfo,
      ...user.wxaUser,
    }
    if (user.member) {
      state.hasUserInfo = true
      state.isMember = true
      state.member = {
        ...state.member,
        ...user.member,
      }
      if (state.getDataFlag) {
        state.getDataFlag = false
        getMbrCode()
      }
    }
  }
}
</script>
<style scoped>
/* components/home-page/top-member/top-member.wxss */

/* loading */

.top-member-loading-box {
  padding-top: 30rpx;
  width: 100%;
  min-height: 356rpx;
  padding-bottom: 30rpx;
}

.top-member-loading-box .top {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 96rpx;
  width: 100%;
  position: relative;
  color: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.top-member-loading-box .left {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  float: left;
  margin: 0 33rpx 0 0;
  background: #efefef;
}

.top-member-loading-box .right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.top-member-loading-box .name {
  height: 42rpx;
  width: 120rpx;
  margin-bottom: 10rpx;
  background: #efefef;
}

.top-member-loading-box .grade {
  height: 30rpx;
  width: 80rpx;
  background: #efefef;
}

.top-member-loading-box .middle {
  width: 670rpx;
  height: 274rpx;
  background: #efefef;
  border-radius: 6rpx;
  position: relative;
  margin: 25rpx auto 0 auto;
}

/* 顶部会员区 */

.top-member-box {
  position: relative;
  padding-top: 30rpx;
  width: 100%;
  min-height: 356rpx;
  padding-bottom: 30rpx;
  overflow: hidden;
  background-color: #fff;
  border-radius: 0 0 20rpx 20rpx;
  margin-bottom: 20rpx;
  background-position: center top;
  background-size: 100% auto;
}

.top-member-before .user-bg {
  content: '';
  width: 200%;
  height: 307rpx;
  position: absolute;
  /* background: #009f55; */
  top: 0;
  margin-left: -50%;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  z-index: 0;
}

.top-user-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 96rpx;
  width: 100%;
  position: relative;
  color: #fff;
  /* padding: 0 30rpx; */
}
.top-user-info .avatarUrl {
  margin-left: 40rpx;
}

.top-user-info button {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  float: left;
  margin: 0 33rpx 0 30rpx;
}

.top-user-info button::after {
  border: none;
}
.login-btn {
  width: 100%;
  height: 100%;
}

.login-btn::after {
  border: none;
}
.top-user-info image {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.top-user-info .name-mobile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.top-user-info .nickName-box {
  display: flex;
  align-items: center;
  height: 42rpx;
  margin-bottom: 10rpx;
}
.member-name {
  display: flex;
  align-items: center;
}
.top-user-info .member-nameplate {
  min-width: 65rpx;
  height: 30rpx;
  padding: 0 10rpx;
  background: linear-gradient(-60deg, #4e4f54, #3f3d3d);
  border-radius: 6rpx;
  font-size: 24rpx;
  color: #ffeba5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  margin-left: 13rpx;
}

.top-user-info .member-nameplate .flower {
  width: 21rpx;
  height: 23rpx;
  margin-right: 7rpx;
}
.flower {
  width: 21rpx;
  height: 23rpx;
  margin-right: 7rpx;
}
.top-user-info .nike-name {
  color: #fff;
  font-size: 36rpx;
}
.top-user-info .mobile-box {
  font-size: 26rpx;
}
.top-user-info text {
  font-size: 30rpx;
}

.top-user-info .member-grade {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 6rpx;
}

.top-user-info .member-grade image {
  width: 32rpx;
  max-height: 32rpx;
  margin-right: 6rpx;
  vertical-align: bottom;
}

.top-user-info .member-grade text {
  font-size: 26rpx;
}
.vip-nameplate {
  min-width: 91rpx;
  height: 40rpx;
  padding: 0 13rpx 0 21rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20rpx;
  font-size: 20rpx;
  color: #3f3d3d;
  text-align: center;
  line-height: 40rpx;
  color: #666;
  position: relative;
  overflow: hidden;
  margin-left: 20rpx;
}
.vip-nameplate1 {
  background: rgba(0, 0, 0, 0.3);
}

.vip-nameplate text {
  font-size: 20rpx;
  color: #fff;
}

.vip-nameplate image.vip-nameplate-img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}

.vip-nameplate text {
  position: relative;
}

.top-member-card {
  width: 670rpx;
  /* height: 274rpx; */
  background: rgba(255, 255, 255, 1);
  border-radius: 6rpx;
  position: relative;
  box-shadow: 1px 2px 5px 0px #dedede;
  margin: 25rpx auto 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.top-member-card .member-num {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  line-height: 38rpx;
  color: #919191;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
}

/* .top-member-card canvas {
  width: 640rpx;
  height: 120rpx;
  position: absolute;
  left: -9999rpx;
} */

.top-member-card image {
  width: 640rpx;
  height: 120rpx;
}

.top-member-card .bg-img {
  width: 610rpx;
  height: 120rpx;
  position: relative;
}

.QR-pay {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  line-height: 38rpx;
}

.QR-pay image {
  width: 31rpx;
  height: 28rpx;
  margin-right: 8rpx;
}

.top-member-function {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 148rpx;
}

.top-member-function .item {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #666;
  height: 148rpx;
}

.top-member-function .item > view:first-of-type {
  color: #ffa300;
  font-size: 34rpx;
  line-height: 42rpx;
  display: flex;
  align-items: baseline;
}

.top-member-function .item > view:first-of-type text {
  font-size: 20rpx;
  margin-left: 8rpx;
}

.top-member-function .item > view:last-of-type {
  line-height: 42rpx;
  margin-top: 4rpx;
}

.top-member-function .item::after {
  content: '';
  display: block;
  height: 48rpx;
  width: 1px;
  background: #ffbb43;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -24rpx;
}

.top-member-function .item:last-of-type::after {
  display: none;
}

.authorize-box {
  position: relative;
}

.top-member-card .bind-phone {
  width: 100%;
  height: 140rpx;
  left: 0;
  top: -10rpx;
  border: none;
}

.top-member-card .bind-phone::after {
  border: none;
}

.top-member-card .bind-phone {
  width: 100%;
  height: 140rpx;
  left: 0;
  top: -10rpx;
  border: none;
}

.top-member-card .bind-phone::after {
  border: none;
}

.member-code button::after {
  border: none;
}

.member-card .bg-img,
.top-member-card .bg-img {
  filter: blur(2px);
}

.bind-phone {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(250, 250, 250, 0.4);
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #009f55;
  font-weight: bold;
}

/* 积分储值支付入口 */

.score-balance-pay {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 24rpx;
}

.score-balance-pay .pay-item {
  flex: 1;
  height: 36rpx;
  padding: 6rpx 0;
  font-size: 24rpx;
  line-height: 36rpx;
  font-weight: bold;
  display: flex;
  justify-content: center;
}

.score-balance-pay .pay-item image {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
}

.style1 .member-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin: 0 16rpx;
}

.style1 .member-grade {
  /* width: 60rpx; */
  text-align: center;
  height: 28rpx;
  line-height: 28rpx;
  padding: 0 4rpx;
  border-radius: 16rpx 16rpx 16rpx 0;
  color: rgb(234, 240, 111);
  background-color: #000;
  font-size: 22rpx;
}
.member-grade2 button {
  padding: 0;
  width: auto;
  height: 60rpx;
  padding: 0 10rpx;
  line-height: 60rpx;
  line-height: auto;
  background-color: #000;
  color: #fff;
  font-size: 30rpx;
  border-radius: 40rpx;
}
.member-grade2 {
  text-align: center;
  padding: 0 4rpx;
  border-radius: 16rpx 16rpx 16rpx 0;
  color: rgb(234, 240, 111);
  font-size: 22rpx;
}
.style1 .member-asset {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
  flex: 1;
  justify-content: flex-end;
}

.style1 .member-asset .item {
  display: flex;
  align-items: center;
  margin-right: 20rpx;
  position: relative;
  margin-top: 4rpx;
}
.style1 .member-asset .item text:nth-of-type(2) {
  display: inline-block;
  margin-left: 4rpx;
  color: #ffa300;
}

.style1 .member-asset .item:last-of-type::after {
  content: '';
  background-color: transparent;
}
.style1 .member-asset .item:after {
  content: '';
  position: absolute;
  right: -12rpx;
  top: 0rpx;
  width: 2rpx;
  height: 100%;
  background-color: #ccc;
}
.style1 {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  box-sizing: border-box;
  background-color: #fff;
  background-position: center top;
  background-size: 100% auto;
}
.style2 {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20rpx;
  background-color: #fff;
  background-position: center top;
  background-size: 100% auto;
  box-sizing: border-box;
}

.style2 .member-info-top {
  display: flex;
  align-items: center;
}

.style2 .member-info-top .avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  background-color: #eee;
}

.style2 .member-info-top .info-box {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
}

.style2 .member-info-top .info-box .member-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin: 0 20rpx;
}
.style2 .member-info-top .member-grade {
  /* width: 60rpx; */
  text-align: center;
  height: 28rpx;
  line-height: 28rpx;
  border-radius: 16rpx 16rpx 16rpx 0;
  color: rgb(234, 240, 111);
  padding: 0 4rpx;
  background-color: #000;
  font-size: 22rpx;
}

.style2 .member-info-top .phone {
  font-size: 24rpx;
  color: #666;
  margin: 8rpx 20rpx;
}

.style2 .member-asset {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
}

.style2 .member-asset {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.style2 .member-asset .item {
  display: flex;
  align-items: center;
  padding-right: 20rpx;
  margin-right: 18rpx;
  position: relative;
  margin-top: 4rpx;
}
.style2 .member-asset .item text:nth-of-type(2) {
  display: inline-block;
  margin-left: 6rpx;
  color: #ffa300;
  font-weight: 700;
}
.style2 .member-asset .item:last-of-type::after {
  content: '';
  background-color: transparent;
}
.style2 .member-asset .item::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 2rpx;
  height: 100%;
  background-color: #ebebeb;
}

.style2 .member-info-right image {
  width: 80rpx;
  height: 80rpx;
  margin-top: 10rpx;
}
.style2 .member-info-right view {
  font-size: 24rpx;
  color: #666;
  margin: 0 4rpx;
  margin-top: 18rpx;
}
.member-code-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.member-code-box .barcode-box {
  width: 586rpx;
  height: 174rpx;
}

.member-code-box .barcode-box canvas {
  width: 586rpx;
  height: 174rpx;
}
.member-code-box > text {
  font-size: 28rpx;
  color: #727272;
  line-height: 36rpx;
}

.member-code-box > text:first-of-type {
  margin-top: 30rpx;
  margin-bottom: 24rpx;
}

.member-code-box > text:last-of-type {
  font-size: 36rpx;
  line-height: 42rpx;
  color: #333;
  margin-top: 25rpx;
  margin-bottom: 28rpx;
}

.member-code-box .refresh {
  font-size: 24rpx;
  line-height: 36rpx;
  color: #bcbcbc;
  /* margin-top: -20rpx; */
  height: 48rpx;
  display: flex;
  align-items: center;
}

.member-code-box .refresh image {
  width: 24rpx;
  height: 24rpx;
  margin-right: 12rpx;
}

.member-code-box .barcode-box {
  width: 586rpx;
  height: 174rpx;
}

.member-code-box .barcode-box canvas {
  width: 586rpx;
  height: 174rpx;
}

.qrcode-box {
  width: 280rpx;
  height: 280rpx;
  /* display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative; */
}

.qrcode-box canvas {
  width: 280rpx;
  height: 280rpx;
}
/* .member-info-left {
     {
      
      .avatar {
        
      }
      .member-info {
        .info-box {
          
          .member-name {
            
          }
          {
            
          }
        }
       
      }
    } */

/* .member-asset {
     
      .item {
        
        span {
          &
        }
        &:last-of-type{
          &::after {
            content: "";
            background-color: transparent;
          }
        }
        &::after {
          content: "";
          position: absolute;
          right: -6px;
          top: -2px;
          width: 1px;
          height: 100%;
          background-color: #ccc;
        }
      }
    }
  } */
/* .member-info-right {
    
    div {
      font-size: 12px;
      color: #666;
      margin: 0 2px;
      margin-top: 9px;
    }
  }
} */
/* .style3 {
  width: 100%;
  padding: 0 10px;
  background-color: #fff;
  background-position: center top;
  background-size: 100% auto;
  box-sizing: border-box;
  .member-info-top {
    display: flex;
    align-items: center;
    margin: 10px 0;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #eee;
    }
    .member-info {
      .info-box {
        display: flex;
        margin-top: 8px;
        .member-name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 10px;
        }
        .member-grade {
          width: 30px;
          text-align: center;
          height: 14px;
          line-height: 14px;
          border-radius: 8px 8px 8px 0;
          color: rgb(234, 240, 111);
          background-color: #000;
          font-size: 11px;
        }
      }
      .phone {
        font-size: 12px;
        color: #666;
        margin: 4px 10px;
      }
    }
  }
  .member-code {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    padding-top: 10px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 0 12px 0 rgba($color: #000, $alpha: 0.3);
    .code {
      width: 100%;
    }
    .qrcode {
      width: 50%;
      height: auto;
      margin: 0 auto;
    }
    .refresh-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px 0 14px 0;
      .refresh-icon {
        width: 13px;
        height: auto;
        margin-right: 4px;
      }
      div {
        font-size: 12px;
        color: #666;
      }
    }
    .pay-list {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .pay-item {
        border: 1px solid #ffa300;
        border-radius: 20px;
        display: flex;
        align-items: center;
        padding: 4px;
        img {
          width: 14px;
          height: auto;
          vertical-align: middle;
          margin-right: 3px;
        }
        div {
          font-size: 13px;
          color: #ffa300;
          margin-bottom: -2px;
        }
      }
    }
  }
  .asset-list {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    .item {
      font-size: 12px;
      color: #666;
      div{
        text-align: center;
        &:nth-of-type(1) {
          color: #ffa300;
          font-size: 14px;
          margin-bottom: 4px;
        }
      }
    }
  }
} */
</style>
