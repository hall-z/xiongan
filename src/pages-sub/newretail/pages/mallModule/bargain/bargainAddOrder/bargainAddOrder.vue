<template>
  <!--pages/mallModule/bargain/bargainAddOrder/bargainAddOrder.wxml-->
  <view>
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <notify id="top-notify"></notify>
    <view class="page">
      <view class="top-info">
        <image class="icon-top-more" :src="state.imagesPath.iconOrderTopMore"></image>
        <view
          class="seat-box"
          v-if="orderType === 'distribution' || state.isDistributionOrder"
        ></view>
        <!-- 预售和拼团支持配送方式 -->
        <view class="delivery-method-name" v-if="orderType !== 'distribution'">配送方式</view>
        <view class="type-check-box">
          <view v-for="(item, index) in state.shipmentSortList" :key="index">
            <view
              :class="'self-take ' + (state.type == 'selftake' ? 'active' : '')"
              @click="optionalShipmentType[item] == false ? 'handleTips' : 'handleClick'"
              :style="
                (state.type == 'selftake' ? state.theme.mainColor + state.theme.borderColor : '') +
                ' ' +
                (state.optionalShipmentType[item] == false
                  ? 'opacity:0.3;background-color: #eee'
                  : '')
              "
              data-type="selftake"
              v-if="item == 'SELF'"
            >
              <image
                v-if="state.type != 'selftake'"
                :src="state.imagesPath.iconOrderSelfTake"
              ></image>
              <image
                v-if="state.type == 'selftake'"
                :src="state.imagesPath.iconOrderSelfTakeActive"
              ></image>
              <text>到店自提</text>
            </view>
          </view>
        </view>
        <view
          class="receive-box"
          :hidden="state.type == 'dispatch' || state.type === 'logistical' ? false : true"
          @click="toChooseAddress"
        >
          <view class="icon-box">
            <image :src="state.imagesPath.iconOrderPosition"></image>
          </view>
          <view class="receive-info">
            <view class="name-mobile" :hidden="state.addressInfo ? true : false">
              <text>{{ state.addressInfo.contacts }}</text>
              <text>{{ state.addressInfo.contactsMobile }}</text>
            </view>
            <view class="receive-address" :hidden="state.addressInfo ? true : false">
              {{
                state.addressInfo.province +
                state.addressInfo.city +
                state.addressInfo.county +
                state.addressInfo.detailedAddress +
                state.addressInfo.houseNum
              }}
            </view>
            <view :hidden="state.addressInfo ? false : true">请选择收货地址</view>
          </view>
          <view class="iconright-box">
            <image :src="state.imagesPath.iconRight2"></image>
          </view>
        </view>
        <view
          class="self-time-box"
          v-if="
            (state.type == 'selftake' || state.type == 'dispatch') &&
            state.deliveryTimeData.length > 0
          "
          :style="orderType === 'advanceSell' ? 'margin:0 0 20rpx 0' : ''"
        >
          <view class="picker time-picker">
            <view @click="chooseTime">
              <view>
                <image class="left-icon" :src="state.imagesPath.iconSelfTake"></image>
                <text class="color-454545" v-if="state.type == 'dispatch'">配送时间</text>
                <text class="color-454545" v-else>自提时间</text>
              </view>
              <view>
                <text>{{ state.storePickupTime }}</text>
                <image class="right-point" :src="state.imagesPath.iconRight2"></image>
              </view>
            </view>
            <popup :show="state.showTime" position="bottom">
              <time-picker
                @onClose="onClose"
                :title="state.type == 'dispatch' ? '配送时间' : '自提时间'"
                :deliveryTimeData="state.deliveryTimeData"
                :deliveryTime="state.deliveryTime"
                @selectTime="selectTime"
              ></time-picker>
            </popup>
          </view>
        </view>
        <view class="store-info" v-if="!state.isDistributionOrder">
          <view class="store-details">
            <view class="name">{{ state.storeInfo.name }}</view>
            <view class="address">{{ state.storeInfo.address }}</view>
          </view>
        </view>
      </view>
      <view class="goods-box">
        <view class="title-box">商品信息</view>
        <view class="goods-item-box" v-for="(item, index) in state.goodsList" :key="index">
          <view class="goods-item">
            <view class="goods-img">
              <image :src="item.productImage" mode="aspectFit"></image>
            </view>
            <view class="goods-info">
              <view class="goods-left">
                <view class="goods-name">{{ item.productName }}</view>
                <text class="goods-desc" v-if="item.description">{{ item.description }}</text>
                <view v-if="item.require" class="require_label">必选</view>
                <view class="goods-label" v-else-if="item.labelName">{{ item.labelName }}</view>
                <view class="goods-desc" v-else>{{ item.specs ? item.specs : '' }}</view>
                <!-- <view class="goods-desc" wx:if="{{item.deliveryTimeStatement}}" style="color: #ff9f43;">
                  {{item.deliveryTimeStatement ? item.deliveryTimeStatement : ''}}</view> -->
                <view class="goods-price">
                  <text class="nowPrice">
                    <text>￥</text>
                    {{ item.finalPrice }}
                  </text>
                </view>
              </view>
              <view class="goods-right">
                <view class="goods-count">x{{ item.productNum }}</view>
              </view>
            </view>
          </view>
          <!-- <view class='goods-item'>
        <view class='goods-img'>
          <image src="{{item.productImage}}" mode="aspectFit"></image>
        </view>
        <view class="goods-info">
          <view class="goods-left">
            <text class='goods-name'>{{item.productName}}</text>
          </view>
          <view class="goods-right">
            <view class="goods-count">x{{item.productNum}}</view>
            <view class='goods-price'>
              <text class="nowPrice">￥{{item.finalPrice}}</text>
            </view>
          </view>
        </view>
      </view> -->
        </view>
        <view class="section-box dispatching-fee" v-if="state.addressInfo && state.shipmentAmount">
          <view
            class="left-icon"
            :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
          >
            派送费
          </view>
          <view v-if="state.shipmentAmount != 0">
            {{ state.shipmentAmount > 0 ? '￥' + state.shipmentAmount : '0' }}
          </view>
          <view v-else>{{ state.shipmentAmount == 0 ? '包邮' : '' }}</view>
        </view>
      </view>
      <view class="block-box">
        <view class="block-title">支付信息</view>
        <view>
          <view class="pay-item" @click="handleSelectStoredValueCard" v-if="state.isStoredPayment">
            <view class="left">
              储值支付
              <text>（余额：{{ state.storedValueCard.balance }}）</text>
            </view>
            <view class="right">
              <view class="deduction-amount">
                -￥{{ toFix(state.storedValueCard.useAmount) }}
              </view>
              <view :class="'checkbox-icon ' + (state.useStoredValueCard ? 'active' : '')"></view>
            </view>
          </view>
        </view>
        <view class="dividing-line">
          <image :src="state.imagesPath.iconDividingline" mode="widthFix"></image>
        </view>
        <view class="bill-details">
          <view class="discount-amounts" v-if="state.totalDiscount + shipmentCouponDiscount > 0">
            已优惠￥{{ toFix(state.totalDiscount + shipmentCouponDiscount) }}
          </view>
          <view class="balance-accounts">
            商品总价：
            <text>￥{{ toFix(state.allPrice) }}</text>
          </view>
        </view>
      </view>
      <!-- <view class="bill-details">
    <view bindtap="toggleMiddlePopup">账单明细
      <image src="{{state.imagesPath.iconOrderTips}}" ></image>
    </view>
    <view class="balance-accounts">合计：
      <text>￥{{toFix(state.allPrice + state.shipmentAmount)}}</text>
    </view>
  </view> -->

      <view class="block-box">
        <view class="row" @click="addRemarks">
          <view class="title">订单备注</view>
          <view class="right">
            <view class="info">{{ state.remarks ? state.remarks : '添加备注' }}</view>
            <image class="right-point" :src="state.imagesPath.iconRight2"></image>
          </view>
        </view>
      </view>
      <view class="bottom-box">
        <view class="order-price">
          还需支付
          <text>
            ￥{{
              toFix(
                state.allPrice -
                  state.totalDiscount +
                  state.shipmentAmount -
                  state.shipmentDiscount -
                  state.scoreDiscount -
                  state.giftCardDiscount,
              )
            }}
          </text>
        </view>
        <!--<form >-->
        <button
          @click="createOrderTip"
          class="btn"
          :style="state.theme.mainBgColor"
          form-type="submit"
          :hidden="state.canBuy && state.allPrice + state.shipmentAmount > 0 ? false : true"
        >
          提交订单
        </button>
        <!--</form>-->
        <view
          class="btn unavailable"
          :hidden="!state.canBuy || !(state.allPrice + state.shipmentAmount > 0) ? false : true"
        >
          提交订单
        </view>
      </view>
    </view>
    <popup
      :show="state.show.middle"
      position="middle"
      custom-class="middle"
      @close="toggleMiddlePopup"
    >
      <view class="popup-content">
        <view class="title">账单明细</view>
        <view class="popup-content-box">
          <view class="price-detail">
            <view>
              <text class="color-454545" v-if="orderType !== 'advanceSell'">商品金额</text>
              <text class="color-454545" v-if="orderType === 'advanceSell'">预付定金</text>
              <text class="color-ff7171">￥{{ toFix(state.allPrice) }}</text>
            </view>
            <view>
              <text class="color-454545">派送费</text>
              <text
                class="color-454545"
                :hidden="state.shipmentDiscount === 0"
                v-if="couponInfo.data.freeship.length > 0"
              >
                (运费券已减{{ state.shipmentDiscount }}元)
              </text>
              <text class="color-ff7171">+￥{{ state.shipmentAmount }}</text>
            </view>
            <view>
              <text class="color-454545">储值支付</text>
              <text class="color-ff7171">-￥{{ state.cardDeductTotal }}</text>
            </view>
            <view>
              <text class="color-454545">优惠券</text>
              <text class="color-ff7171">-￥{{ state.couponDiscount }}</text>
            </view>
            <view v-if="state.systemOptions.isGiftCard && state.giftCardDiscount > 0">
              <text class="color-454545">礼品卡</text>
              <text class="color-ff7171">
                -￥{{ state.giftCardDiscount >= 0 ? state.giftCardDiscount : 0.0 }}
              </text>
            </view>
            <view :hidden="state.cashDiscount > 0 ? false : true">
              <text class="color-454545">活动优惠</text>
              <text class="color-ff7171">-￥{{ state.cashDiscount }}</text>
            </view>
          </view>
          <view class="realpay">
            实付款:
            <text>
              ￥{{
                toFix(
                  state.allPrice -
                    state.totalDiscount +
                    state.shipmentAmount -
                    state.shipmentDiscount -
                    state.cardDeductTotal -
                    state.scoreDiscount -
                    state.giftCardDiscount,
                )
              }}
            </text>
          </view>
        </view>
        <view class="button" :style="state.theme.mainBgColor" @click="toggleMiddlePopup">
          确 定
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.pass"
      position="middle"
      custom-class="middle"
      @close="toggleNumberPopup"
    >
      <view class="number-modal-body">
        <view class="number-modal-contentA">
          <view class="title">抱歉，此次订单中的以下商品已不能购买</view>
          <view class="content">
            <view class="goods-list">
              <view class="goods-item-box" v-for="(item, index) in passProductActive" :key="index">
                <view class="goods-item">
                  <view class="goods-img">
                    <image :src="item.productImage" mode="aspectFit"></image>
                  </view>
                  <view class="goods-info">
                    <view class="goods-left">
                      <view class="goods-name">{{ item.productName }}</view>
                      <view class="goods-desc" v-if="item.mealDetails && item.mealDetails">
                        {{ item.mealDetails }}
                      </view>
                      <view class="goods-label" v-else-if="item.labelName">
                        {{ item.labelName }}
                      </view>
                      <view class="goods-desc" v-else>{{ item.specs ? item.specs : '' }}</view>
                      <!-- <view class="goods-desc" wx:if="{{item.deliveryTimeStatement}}"
                                        style="color: #ff9f43;">
                                        {{item.deliveryTimeStatement ? item.deliveryTimeStatement : ''}}</view> -->
                      <!-- <view class='goods-price' wx:elif="{{orderType === 'advanceSell'}}"></view>
                                    <view class='goods-price' wx:else>
                                        <text class="nowPrice">￥{{item.finalPrice}}</text>
                                    </view> -->
                    </view>
                    <view class="goods-right">
                      <view class="goods-count">x{{ item.productNum }}</view>
                    </view>
                  </view>
                </view>
                <view style="color: salmon; margin-bottom: 14rpx">备注：{{ item.remark }}</view>
              </view>
            </view>
          </view>
          <view class="button-box">
            <button class="cancel" :data-id="goodsInfo.id" @click.stop="onCancelA">取消</button>
            <button
              class="confirm"
              :style="state.theme.mainBgColor"
              :data-id="goodsInfo.id"
              @click.stop="passProudrtBtn"
            >
              继续下单
            </button>
          </view>
        </view>
      </view>
    </popup>
    <pay
      :order-data="state.order"
      :pay-method="state.payMethod"
      :storedValueCard="state.storedValueCard"
      @continuePay="handleContinuePay"
      @orderCancel="handleOrderCancel"
      @orderPay="handleOrderPay"
    ></pay>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _libsQqmapWxJssdkMinJs from '@/libs/qqmap-wx-jssdk'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _componentsNotifyNotifyJs from '@/pages-sub/newretail/components/notify/notify'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiRequestJs from '@/service/api/newretail/request'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import _apiPromotionServiceJs from '@/service/api/newretail/promotionService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _apiDistributionServiceJs from '@/service/api/newretail/distributionService'
import _apiAddressServiceJs from '@/service/api/newretail/addressService'
import _apiBargainServiceJs from '@/service/api/newretail/bargainService'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import timePicker from "@/pages-sub/newretail/components/timer-picker/index";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue'
import pay from '@/pages-sub/newretail/components/pay/pay.vue'
const app = getApp()

// pages/mallModule/bargain/bargainAddOrder/bargainAddOrder.js
const orderService = _apiOrderServiceJs
const sysService = _apiSystemServiceJs
const bargainService = _apiBargainServiceJs
const addressService = _apiAddressServiceJs
const distributionService = _apiDistributionServiceJs
const storeService = _apiStoreServiceJs
const promotionService = _apiPromotionServiceJs
const couponService = _apiCouponServiceJs
const memberService = _apiMemberServiceJs
const request = _apiRequestJs
const UTILS = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const Notify = _componentsNotifyNotifyJs
const IMGAGESPATH = _utilsImagesPathJs
const ANALYSIS = _utilsAnalysisJs
const ADDRESS = _utilsAddressJs
const QQMapWX = _libsQqmapWxJssdkMinJs
let qqmapsdk
const THEME = _utilsThemeManagerJs
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
const state = reactive({
  isStoredPayment: true,
  deliveryDistanceThirdMap: '',
  // 地图项配置
  // 展示自提时间弹窗
  showTime: false,
  // 自提时间
  storePickupTime: '',
  // 选择的时间数据
  deliveryTimeData: [],
  // 后端提供的时间数据
  deliveryTime: '',
  // 组件选择的时间数据
  optionalShipmentType: {
    SELF: true,
    EXPRESS: true,
    LOGISTICAL: true,
  },
  navigationBarTitle: '完善订单',
  imagesPath: IMGAGESPATH,
  theme: THEME,
  type: 'selftake',
  date: '2016-09-01',
  time: '12:01',
  multiArray: [
    ['2018-06-01', '2018-06-02', '2018-06-03'],
    ['6:00-9:00', '9:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'],
  ],
  multiIndex: [0, 0],
  addressInfo: '',
  // 收货地址信息
  goodsList: [],
  // 商品信息
  allPrice: 0,
  // 总价
  distance: '',
  // 配送距离
  remarks: '口味偏好等要求',
  // 备注
  distributionInfo: {
    distributionFee: 0.0,
  },
  // 配送信息
  shipmentAmount: 0.0,
  // 配送费
  shipmentDiscount: 0,
  // 运费抵扣金额
  shipmentRealPay: 0,
  // 实际支付的运费金额
  storeName: '人民广场店',
  storeId: '',
  storeInfo: null,
  canBuy: true,
  memberInfo: {},
  tips: '',
  sharingPersonId: '',
  isDistributionOrder: false,
  // 是否是统配订单
  scoreArray: [],
  scource: '',
  // 来自购物车SHOPPINGCART,立即购买BUYNOW
  orderSelfTime: '',
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
  },
  hasAvailableGiftCard: false,
  orderGiftCard: {
    maxUseTotal: 0,
  },
  giftCardNum: 0,
  systemOptions: {
    // 系统配置项信息
    isGiftCard: false, // 是否支持礼品卡
  },
  useStoredMspCard: false,
  scoreDiscount: 0,
  // 积分抵扣
  couponDiscount: 0,
  // 券抵扣
  cashDiscount: 0,
  // 现金抵扣金额
  totalDiscount: 0,
  // 总优惠金额
  giftCardDiscount: 0,
  // 礼品卡优惠金额
  shipmentSortList: ['SELF', 'EXPRESS', 'LOGISTICAL'],
  canChooseAddress: false,
  useStoredValueCard: false,
  // 是否使用储值卡
  cardDeductTotal: 0,
  // 储值抵扣金额
  storedValueCard: {
    useAmount: 0.0,
    // 本次使用额度
    balance: 0.0,
    // 储值卡余额
    password: '', // 储值卡密码密码
  },
  order: null,
  // 订单数据
  payMethod: {
    cardDeductTotal: 0,
    useStoredValueCard: false,
    balance: 0,
  },
  orderCancel: false,
  orderPay: false,
  themeColor: THEME.color,
  isShowAddressTips: true, // 是否超出
})
const localData = {
  shipmentTypes: 'EXPRESS',
}
async function getPaymentMethod() {
  try {
    const paymentMethodList = ['paymentMethod', 'isStoredPayment']
    await sysService
      .query(paymentMethodList.join(','))
      .then((res) => {
        if (res && res.length > 0) {
          res.forEach((item) => {
            if (item.key == 'paymentMethod' && item.value) {
              app.globalData.paymentMethod = item.value
              state.paymentMethod = item.value
            } else {
              item.key = item.value != 'FALSE'
            }
          })
        }
      })
      .catch((err) => {})
  } catch (e) {}
}
function getMapSet() {
  sysService
    .query('deliveryDistanceThirdMap')
    .then((res) => {
      console.log('res111', res)
      if (res && res.length > 0 && res[0].value != null) {
        app.globalData.systemConfigure.deliveryDistanceThirdMap = res[0].value
        state.deliveryDistanceThirdMap = app.globalData.systemConfigure.deliveryDistanceThirdMap
        let key = 'lbs_tianditu_appkey'
        if (res[0].value == 'TIANDITU') {
          key = 'lbs_tianditu_appkey'
        } else if (res[0].value == 'GAODE') {
          key = 'lbs_autonavi_key'
        }
        sysService
          .query(key)
          .then((res) => {
            if (res && res.length > 0 && res[0].value != null) {
              if (key == 'lbs_tianditu_appkey') {
                app.globalData.systemConfigure.lbsTiandituAppkey = res[0].value
              } else if (key == 'lbs_autonavi_key') {
                app.globalData.systemConfigure.lbsAutonaviAppkey = res[0].value
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
function initializationTime() {
  const self = this
  const orderSelfScope = state.bargainInstance.selfTimeScope
  // 拼团自提时间均不可选，为固定时间点或时间段
  const selfTimeScope = orderSelfScope.split('~')
  const selfStartTime = selfTimeScope[0]
  const selfEndTime = selfTimeScope[1]
  // 如果当前拼团活动设置了拼团自提开始时间和自提结束时间，则页面上显示拼团自提开始时间和自提结束时间段
  const startTimeArr = selfStartTime.split(' ')
  const endTimeArr = selfEndTime.split(' ')
  const daysArrStart = startTimeArr[0].split('-')
  const daysArrEnd = endTimeArr[0].split('-')
  const startDate = daysArrStart[1] + '月' + daysArrStart[2] + '日'
  const endDate = daysArrEnd[1] + '月' + daysArrEnd[2] + '日'
  let orderSelfTime = startDate + '-' + endDate
  const hours = startTimeArr[1].slice(0, 5) + '-' + endTimeArr[1].slice(0, 5)
  orderSelfTime = orderSelfTime + ' ' + hours
  state.orderSelfTime = orderSelfTime
}
function getStoreInfoById(id) {
  const that = this
  storeService
    .getById(id)
    .then((res) => {
      console.log(res)
      const storeInfo = res
      state.storeInfo = storeInfo
      handleDeliveryType()
      if (app.globalData.distributionStore) {
        return app.globalData.distributionStore
      } else {
        return storeService.getDistributionStore()
      }
    })
    .then((res) => {
      if (res && res.id === state.storeInfo.id) {
        state.isDistributionOrder = true
      }
      console.log('检查配送距离')
      // 检查配送距离
      if (state.type === 'dispatch' || state.type === 'logistical') {
        checkDistribution()
      }
    })
    .catch((err) => {
      console.log('检查配送距离')
      // 检查配送距离
      if (state.type === 'dispatch' || state.type === 'logistical') {
        checkDistribution()
      }
    })
}
function addRemarks(e) {
  const opts = '?type=' + state.type
  NAVPAGE.toAddRemarks(opts)
}
function toChoiceMspCard() {
  // 清空已选择的礼品卡数据
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/member/mealCard/mealCard?active=1',
  })
}
function getPostData() {
  const that = this
  const products = []
  state.goodsList.forEach((item) => {
    let tempItem = {
      productId: item.productId,
      productNum: item.productNum,
    }
    // 分享人id
    if (item.sharingPersonId) {
      tempItem = {
        ...tempItem,
        sharingPersonId: item.sharingPersonId,
      }
    }
    if (state.scource === 'SHOPPINGCART') {
      tempItem = {
        ...tempItem,
        shoppingCartItemId: item.id,
      }
    }
    products.push(tempItem)
  })
  let postData = ''
  let tempSelfTime = null
  let shipmentType = 'SELF'
  const shipmentRealPay = Number(state.shipmentRealPay)
  if (state.type === 'logistical') {
    shipmentType = 'LOGISTICAL'
  } else {
    shipmentType = 'SELF'
    if (state.type === 'dispatch') {
      shipmentType = 'EXPRESS'
    }
    // tempSelfTime = that.data.bargainInstance.selfTimeScope
    if (state.storePickupTime) {
      const tempTime = state.storePickupTime
      const tempTimeArr = tempTime.split(' ')
      const timeArr = tempTimeArr[1].split('-')
      tempSelfTime =
        tempTimeArr[0] + ' ' + timeArr[0] + ':00' + '~' + tempTimeArr[0] + ' ' + timeArr[1] + ':00'
    }
  }
  let paymentPrice = state.allPrice - state.totalDiscount + parseFloat(shipmentRealPay)
  if (paymentPrice >= 0) {
    paymentPrice = paymentPrice.toFixed(2)
  } else {
    paymentPrice = 0
  }

  // 查询本地缓存，是否有场景值‘_scene_’缓存,
  let fromScene = ''
  try {
    const scene = uni.getStorageSync('_scene_')
    if (scene) {
      // Do something with return value
      fromScene = '-' + scene
    }
  } catch (e) {
    // Do something when catch error
  }
  postData = {
    allPrice: paymentPrice,
    // 应该支付的金额
    products,
    // 商品列表
    receiverMobile: state.addressInfo ? state.addressInfo.contactsMobile : state.memberInfo.mobile,
    // 收货人手机号
    remark: state.remarks === '口味偏好等要求' ? '无' : state.remarks,
    // 备注
    scource: 'BUYNOW',
    // 来自购物车SHOPPINGCART 立即购买BUYNOW
    shipmentAmount: shipmentRealPay,
    // 快递费
    shipmentType,
    // 配送方式
    selfTimeScope: tempSelfTime,
    // 预约自提时间
    storeId: state.storeId,
    // 门店id
    oriStoreId: state.isDistributionOrder ? state.storeId : app.globalData.storeInfo.virtualStoreId,
    // 门店id
    orderSource: 'MINI_APP' + fromScene,
    // lat: app.globalData.location ? app.globalData.location.latitude.toFixed(6) : '',
    // lng: app.globalData.location ? app.globalData.location.longitude.toFixed(6) : '',
    instanceId: state.bargainInstance.id, // 砍价实例id
  }
  if (shipmentType === 'EXPRESS' || shipmentType === 'LOGISTICAL') {
    if (state.addressInfo) {
      postData = {
        ...postData,
        deliveryAddressId: state.addressInfo.id,
        // 收货地址id
        distributionDistance: state.distance,
        // 配送距离
        deductibleShipmentAmonut: state.shipmentDiscount,
        lat: state.addressInfo.latitude,
        lng: state.addressInfo.longitude,
      }
    }
  }

  // 如果是用了礼品卡
  if (state.giftCardDiscount > 0) {
    postData = {
      ...postData,
      giftCardNo: state.orderGiftCard.cardId,
      giftCardTotal: state.giftCardDiscount,
    }
  }
  // 如果通过分享
  if (state.sharingPersonId && state.sharingPersonId !== app.globalData.userInfo.member.id) {
    const productData = []
    let hasSharingPersonId = false
    for (let i = 0; i < postData.products.length; i++) {
      const ele = postData.products[i]
      if (ele.sharingPersonId) {
        hasSharingPersonId = true
        break
      }
    }
    if (!hasSharingPersonId) {
      postData.products.forEach((item) => {
        productData.push({
          ...item,
          sharingPersonId: state.sharingPersonId,
        })
      })
    }
    postData = {
      ...postData,
      orderSource: 'WX_MINI_APP-SHARE',
      products: productData,
    }
  }
  return postData
}
function createOrderTip() {
  const systemSetting = uni.getSystemSetting()
  const self = this
  uni.getSetting({
    success: (res) => {
      const authSetting = res.authSetting
      if (authSetting['scope.userLocation'] && systemSetting.locationEnabled) {
        createOrder()
      } else if (authSetting['scope.userLocation'] === false) {
        // 用户未授权，提示用户进行授权
        uni.showModal({
          title: '温馨提示',
          content: '您未授权地理位置信息，确认下单门店：' + state.storeName,
          confirmText: '确认',
          success: (res) => {
            if (res.confirm) {
              createOrder()
            }
          },
        })
      } else if (!systemSetting.locationEnabled) {
        // 用户未授权，提示用户进行授权
        uni.showModal({
          title: '温馨提示',
          content: '您的手机GPS未开启，确认下单门店：' + state.storeName,
          confirmText: '确认',
          success: (res) => {
            if (res.confirm) {
              createOrder()
            }
          },
        })
      } else {
        // 用户未明确拒绝也未授权，提示用户进行设置
        uni.authorize({
          scope: 'scope.userLocation',
          success: () => {
            createOrder()
          },
          fail: () => {
            uni.showModal({
              title: '温馨提示',
              content: '您未授权地理位置信息，确认下单门店：' + state.storeName,
              confirmText: '确认',
              success: (res) => {
                // 处理用户响应
                if (res.confirm) {
                  createOrder()
                }
              },
            })
          },
        })
      }
    },
    fail: (err) => {},
  })
}
function createOrder(val) {
  const self = this
  const postData = getPostData()
  console.log(postData)
  if (state.useStoredMspCard) {
    if (state.cardNo) {
      state.payMethod.cardNo = state.cardNo
      postData.mspCardNo = state.cardNo
    } else {
      uni.showToast({
        title: '请选择余额',
        icon: 'none',
      })
      return
    }
  }
  if (postData.shipmentType === 'EXPRESS' || postData.shipmentType === 'LOGISTICAL') {
    if (!postData.deliveryAddressId) {
      showNotify('收货地址不能为空~')
      return
    }
  }

  // 如果自提时间不能为空 (时间模板存在数据)
  if (state.type === 'dispatch' || state.type === 'selftake') {
    // console.log('selfTimeScope',postData.selfTimeScope)
    if (!postData.selfTimeScope && state.deliveryTimeData.length > 0) {
      const str = state.type === 'selftake' ? '自提时间不能为空~' : '配送时间不能为空~'
      uni.showToast({
        title: str,
        icon: 'none',
        duration: 2000,
      })
      return false
    }
  }
  try {
    // 清除部分缓存数据，以免对其他订单造成影响
    uni.removeStorageSync('wj_orderCardInfo')
    uni.removeStorageSync('wj_addRemarks')
  } catch (e) {}
  if (state.canBuy) {
    state.canBuy = false
    if (state.order) {
      // 订单已经创建，支付失败
      handlePayment(state.order)
      return
    }
    bargainService
      .createOrder(postData)
      .then((res) => {
        console.log(res)
        clearCacheData()
        handlePayment(res)
      })
      .catch((err) => {
        const passProductActive = []
        if (err.code == '16665') {
          const passProduct = JSON.parse(err.message)
          passProduct.map((item) => {
            state.goodsList.map((arr) => {
              console.log(arr, 'dalskjdkla')
              if (arr.productId == item.productId) {
                passProductActive.push({
                  ...item,
                  ...arr,
                })
                console.log(passProductActive, 'passProductActive')
                state.passProductActive = passProductActive
              }
            })
          })
          toggle('pass')
        } else if (err.code === 14009) {
          // 门店已经暂停线上下单
          uni.showModal({
            title: '提示',
            content: '当前门店不在营业中，去看看别的门店吧~',
            confirmText: '去看看',
            success(res) {
              if (res.confirm) {
                NAVPAGE.toHome()
              } else if (res.cancel) {
              }
            },
          })
        } else if (err.code === 16001) {
          uni.showToast({
            title: '商品暂未上架，请到别的门店看看吧！',
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
        state.canBuy = true
      })
  }
}
function handlePayment(order) {
  const that = this
  state.order = order
}
function toPayMethod(orderId, type) {
  uni.redirectTo({
    url: '../../pay/payMethod/payMethod?orderId=' + orderId + '&from=shopCart&type=' + type,
  })
}
function clearCacheData() {
  // 注释清除分享人信息代码 门店销售数据详情统计需求要求下单不再清除分享人信息 http://jira.wmdigit.com/browse/NR-3409
  // try {
  //   wx.removeStorageSync('wj_sharingId')
  // } catch (e) {}
  // UTILS.removeSharingPersonInfo()
}
function toChooseAddress() {
  const opts = '?from=perfectOrder'
  NAVPAGE.toAddressList(opts)
}
async function calcDistance(chooseAddress) {
  const self = this
  const type = state.type
  let shipmentType = 'EXPRESS'
  if (type === 'dispatch') {
    shipmentType = 'EXPRESS'
  } else if (type === 'logistical') {
    shipmentType = 'LOGISTICAL'
  }
  if (shipmentType == 'EXPRESS' && type !== 'logistical') {
    // 如果是天地图或者高德则不采用腾讯计算距离
    // if(self.data.deliveryDistanceThirdMap === 'TIANDITU' || self.data.deliveryDistanceThirdMap === 'GAODE') {
    //     // const [origLat, origLng] = UTILS.gcj02ToWgs84Exact(chooseAddress.latitude, chooseAddress.longitude);
    //     // const [destLat, destLng] = UTILS.gcj02ToWgs84Exact(self.data.storeInfo.latitude, self.data.storeInfo.longitude);
    //     // console.log(chooseAddress.latitude, chooseAddress.longitude, self.data.storeInfo.latitude, self.data.storeInfo.longitude,origLat, origLng, destLat, destLng,'aaaa');
    //     // 原逻辑注释
    //     // let change1 = await distributionService.gcj02TOwgs84(chooseAddress.longitude,chooseAddress.latitude)
    //     // let change2 = await distributionService.gcj02TOwgs84(self.data.storeInfo.longitude,self.data.storeInfo.latitude)
    //     // var cyclingDistance = UTILS.TiandituCalculateDistanceBicycling(change1.latitude, change1.longitude, change2.latitude, change2.longitude)
    //     var cyclingDistance = UTILS.getTripDist(chooseAddress.longitude, chooseAddress.latitude, self.data.storeInfo.longitude, self.data.storeInfo.latitude, self)
    // }else {
    //     var cyclingDistance = UTILS.calculateDistanceBicycling(chooseAddress.latitude, chooseAddress.longitude, self.data.storeInfo.latitude, self.data.storeInfo.longitude)
    // }
    const cyclingDistance = UTILS.getTripDist(
      chooseAddress.longitude,
      chooseAddress.latitude,
      state.storeInfo.longitude,
      state.storeInfo.latitude,
      self,
    )
    cyclingDistance
      .then((res) => {
        console.log('cyclingDistanceres', res)
        if (
          (res.data && res.data.result) ||
          ((state.deliveryDistanceThirdMap === 'TIANDITU' ||
            state.deliveryDistanceThirdMap === 'GAODE') &&
            (res.distance || res.distance == 0))
        ) {
          let distance = null
          if (
            state.deliveryDistanceThirdMap === 'TIANDITU' ||
            state.deliveryDistanceThirdMap === 'GAODE'
          ) {
            distance = res.distance * 1000
          } else {
            distance = res.data.result.routes['0'].distance.toFixed(2)
          }
          state.distance = distance
          state.isShowAddressTips = true
          return distance
        } else {
          uni.showToast({
            title: '该地址超出配送范围，请重新修改收货地址~',
            icon: 'none',
            duration: 3500,
          })
          state.canBuy = false
          state.calculatedDeliveryFee = false
          state.isShowAddressTips = false
          state.cycleFee = 0
          calculatedDeliveryFee = false
          uni.hideLoading()
          return false
        }
      })
      .then((distance) => {
        if (distance || distance === 0) {
          getFee(shipmentType, distance, chooseAddress, calculatedDeliveryFee, type)
        }
      })
      .catch(() => {
        uni.hideLoading()
      })
  } else {
    getFee(shipmentType, null, chooseAddress, calculatedDeliveryFee, type)
  }

  // // 获得用户的骑行距离
  // var cyclingDistance = UTILS.calculateDistance(chooseAddress.latitude, chooseAddress.longitude, self.data.storeInfo.latitude, self.data.storeInfo.longitude)
  // cyclingDistance.then(res => {
  //     let distance = res.result.elements["0"].distance.toFixed(2);
  //     this.setData({
  //         distance: distance
  //     })
  //     return distance
  // }).then(distance => {
  //     self.setData({
  //         distance: distance
  //     })
  //     let address = chooseAddress.province + chooseAddress.city + chooseAddress.county + chooseAddress.detailedAddress + chooseAddress.houseNum
  //     var postData = {
  //         address: address,
  //         distance: Number(distance),
  //         latitude: chooseAddress.latitude,
  //         longitude: chooseAddress.longitude,
  //         positionSource: 1,
  //         storeId: self.data.storeId,
  //         shipmentType: shipmentType
  //     }
  //     distributionService.check(postData).then(res => {
  //         console.log(res)
  //         let storeId = this.data.storeId
  //         if (res) {
  //             let products = [];
  //             self.data.goodsList.forEach(item => {
  //                 let tempItem = {
  //                     productId: item.productId,
  //                     productNum: item.productNum
  //                 }
  //                 products.push(tempItem)
  //             })
  //             let postData = {
  //                 allPrice: self.data.allPrice,
  //                 distance: parseInt(distance),
  //                 products: products,
  //                 storeId: storeId,
  //                 shipmentType: shipmentType,
  //                 calcFeeSource: 'BARGIN_ACTIVITY',
  //                 activityId: self.data.bargainInstance.activityId,
  //                 province: chooseAddress.province,
  //                 city: chooseAddress.city
  //             }
  //             distributionService.calcFee(postData).then(res => {
  //                 // 外送
  //                 if (res || res.fee === 0) {
  //                     // 配送费规则
  //                     const distributionFeeRule = self.distributionFee
  //                     if (self.data.tips === '') {
  //                         self.setData({
  //                             canBuy: true
  //                         })
  //                     }
  //                     if (self.data.tips === '') {
  //                         self.setData({
  //                             canBuy: true
  //                         })
  //                     }
  //                     let shipmentRealPay = parseFloat((Number(res.fee) - res.deductibleFee).toFixed(2))
  //                     let shipmentDiscount = parseFloat((res.deductibleFee).toFixed(2))
  //                     if (self.data.type === 'dispatch' || self.data.type === 'logistical') {
  //                         // 砍价下单不判断起送条件
  //                         self.setData({
  //                             shipmentAmount: shipmentRealPay,
  //                             shipmentRealPay: shipmentRealPay,
  //                             shipmentDiscount: shipmentDiscount
  //                         })
  //                     }
  //                 } else {
  //                     self.setData({
  //                         canBuy: false
  //                     })
  //                 }
  //                 // 计算配送状态下储值礼品卡使用
  //                 self.handleCardBalance()
  //             }).catch(err => {
  //                 wx.showToast({
  //                     title: err.message,
  //                     icon: 'none',
  //                     duration: 2000
  //                 })
  //             })
  //         } else {
  //             wx.showToast({
  //                 title: '该地址超出配送范围，请重新修改收货地址~',
  //                 icon: 'none',
  //                 duration: 2000
  //             })
  //             self.setData({
  //                 canBuy: false
  //             })
  //         }
  //     }).catch(err => {
  //         UTILS.showToast(err.message)
  //         self.setData({
  //             canBuy: false
  //         })
  //     })
  // }).catch(err => {
  //     //   UTILS.showToast("当前门店地理位置有问题，导致无法下单，请联系门店人员解决")
  //     //   self.setData({
  //     //     canBuy: false
  //     //   })
  // })
}
function getFee(shipmentType, distance, chooseAddress, calculatedDeliveryFee, type) {
  console.log(shipmentType, distance, chooseAddress)
  const products = []
  const self = this
  state.goodsList.forEach((item) => {
    let tempItem
    if (!state.packagingId) {
      tempItem = {
        productId: item.productId,
        productNum: item.productNum,
        calcFeeSource: item.grabActivityId ? 'GRAB_ACTIVITY' : 'GENERAL_ORDER',
        activityId: item.grabActivityId ? item.grabActivityId : '',
        price: item.sellPrice || item.finalPrice,
      }
    } else {
      tempItem = {
        productId: item.productId,
        productNum: item.productNum,
        price: item.sellPrice || item.finalPrice,
      }
    }
    products.push(tempItem)
  })
  uni.showLoading()
  const address =
    chooseAddress.province +
    chooseAddress.city +
    chooseAddress.county +
    chooseAddress.detailedAddress +
    chooseAddress.houseNum
  const postData = {
    address,
    distance: Number(distance),
    latitude: chooseAddress.latitude,
    longitude: chooseAddress.longitude,
    positionSource: 1,
    storeId: state.storeId,
    shipmentType,
    products,
  }
  distributionService
    .check(postData)
    .then((res) => {
      const storeId = state.storeId
      if (res) {
        const postData = {
          province: chooseAddress.province,
          city: chooseAddress.city,
          allPrice: state.allPrice,
          distance: parseInt(distance),
          products,
          storeId,
          shipmentType,
          calcFeeSource: state.activeType,
          activityId: state.packagingId,
          // 添加收货地址经纬度 （收货地址-门店距离）
          // distance: parseInt(distance),
          longitude: chooseAddress.longitude,
          latitude: chooseAddress.latitude,
        }
        distributionService
          .calcFeeV1(postData)
          .then((res) => {
            // 统配和外送还有快递都是根据门店配送规则计算运费
            if (res || res.fee === 0) {
              // 配送费规则
              //   let distributionFeeRule = null
              //   if (type === 'dispatch') {
              //       distributionFeeRule = self.distributionFee
              //   } else if (type === 'logistical') {
              //       distributionFeeRule = self.logisticalFee
              //   }
              //   if (!distributionFeeRule) {
              //       // 还未获取到配送规则
              //       self.setData({
              //           canBuy: false
              //       })
              //       return;
              //   }
              if (state.tips === '') {
                state.canBuy = true
              } else if (shipmentType === 'LOGISTICAL') {
                state.canBuy = true
              } else {
                if (
                  state.daysOfSelfTimeDelay > 0 ||
                  (state.orderType === 'group' &&
                    state.teamBuyInfo.selfAfterDay != null &&
                    state.teamBuyInfo.selfAfterDay > 0) ||
                  (state.orderType === 'solitaire' &&
                    state.solitaireInfo.selfAfterDay != null &&
                    state.solitaireInfo.selfAfterDay > 0)
                ) {
                  showNotify(state.tips)
                }
              }
              if (!state.canBuy) {
                return
              }
              const shipmentRealPay = parseFloat((Number(res.fee) - res.deductibleFee).toFixed(2))
              const shipmentDiscount = parseFloat(res.deductibleFee.toFixed(2))
              if (state.type === 'dispatch' || state.type === 'logistical') {
                state.shipmentAmount = parseFloat((Number(res.fee) - res.deductibleFee).toFixed(2))
                state.shipmentRealPay = parseFloat(parseFloat(shipmentRealPay).toFixed(2))
                state.shipmentDiscount = shipmentDiscount
                state.cycleFee = parseFloat(
                  parseFloat(state.shipmentAmount * state.cyclePhaseTotal).toFixed(2),
                )
                if (state.orderType === 'CYCLE') {
                  state.shipmentRealPay = state.cycleFee
                }
                // 以前旧逻辑
                //   console.log(Number(self.data.allPrice), distributionFeeRule.takeoutFare)
                //       if (Number(self.data.allPrice) >= distributionFeeRule.takeoutFare) {
                //           if (parseFloat(self.data.shipmentCouponDiscount) > 0) {
                //               shipmentRealPay = shipmentRealPay - Number(self.data.shipmentCouponDiscount)
                //           }
                //           self.setData({
                //               shipmentAmount: parseFloat((Number(res.fee) - res.deductibleFee).toFixed(2)),
                //               shipmentRealPay: parseFloat(parseFloat(shipmentRealPay).toFixed(2)),
                //               shipmentDiscount: shipmentDiscount
                //           })
                //           self.setData({
                //                 cycleFee: parseFloat(parseFloat(self.data.shipmentAmount * self.data.cyclePhaseTotal).toFixed(2))
                //             })
                //       } else {
                //           if (self.data.orderType !== "advanceSell") {
                //               distributionFeeRule.takeoutFare = 0
                //               let tips = "商品满" + distributionFeeRule.takeoutFare + "元起送"
                //               self.setData({
                //                   canBuy: false,
                //                   tips: tips
                //               })
                //               self.showNotify(tips)
                //           } else if (self.data.orderType === "advanceSell" && !self.data.isExpress) {
                //               distributionFeeRule.takeoutFare = 0
                //               let tips = "商品满" + distributionFeeRule.takeoutFare + "元起送"
                //               self.setData({
                //                   canBuy: false,
                //                   tips: tips
                //               })
                //               self.showNotify(tips)
                //           }
                //       }
              }
              calculatedDeliveryFee = true
              uni.hideLoading({
                success: function () {
                  state.btnDisabled = false
                },
              })
            } else {
              state.canBuy = false
              calculatedDeliveryFee = false
              uni.hideLoading({
                success: function () {
                  console.log('进入了弹层隐藏')
                  state.btnDisabled = false
                },
              })
            }
            state.calculatedDeliveryFee = calculatedDeliveryFee
            calculatedDeliveryFee = calculatedDeliveryFee
            // 计算配送状态下可用券
            getAvailableCouponNum()
          })
          .catch((err) => {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000,
            })
            state.shipmentAmount = 0
            state.btnDisabled = false
            state.canBuy = false
            state.calculatedDeliveryFee = calculatedDeliveryFee
            state.cycleFee = parseFloat(
              parseFloat(state.shipmentAmount * state.cyclePhaseTotal).toFixed(2),
            )
            calculatedDeliveryFee = calculatedDeliveryFee
          })
      } else {
        if (state.orderType !== 'distribution') {
          uni.showToast({
            title: '该地址超出配送范围，请重新修改收货地址~',
            icon: 'none',
            duration: 3500,
          })
          calculatedDeliveryFee = false
          state.canBuy = false
          state.calculatedDeliveryFee = false
          state.isShowAddressTips = false
          state.cycleFee = 0
        } else {
          // 计算配送状态下可用券（统配）
          getAvailableCouponNum()
          state.canBuy = true
          state.isShowAddressTips = false
          state.cycleFee = 0
        }
        state.btnDisabled = false
        state.calculatedDeliveryFee = calculatedDeliveryFee
        calculatedDeliveryFee = calculatedDeliveryFee
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
      state.btnDisabled = false
      state.calculatedDeliveryFee = calculatedDeliveryFee
      calculatedDeliveryFee = calculatedDeliveryFee
      if (state.orderType !== 'distribution') {
        state.canBuy = false
      } else {
        // 计算配送状态下可用券（统配）
        getAvailableCouponNum()
        state.canBuy = true
      }
    })
}
function toPaymentSuccess(orderId) {
  const opts = '?orderId=' + orderId
  NAVPAGE.toPaymentSuccess(opts)
}
function checkDistribution() {
  const that = this
  // console.log('有没有进入到这里')
  if (state.addressInfo == '') {
    // 当前没有选择地址
    if (state.canChooseAddress) {
      try {
        const addressInfo = uni.getStorageSync('wj_chooseAddressInfo')
        if (addressInfo) {
          // 缓存中有默认地址
          state.addressInfo = addressInfo
          calcDistance(addressInfo)
        }
      } catch (error) {}
    } else {
      // 默认不可选
      addressService
        .query()
        .then((res) => {
          if (!res || res.length === 0) {
            return
          }
          let addressInfo = null
          for (let i = 0; i < res.length; i++) {
            const ele = res[i]
            if (ele.id === state.bargainInstance.deliveryAddressId) {
              addressInfo = ele
              break
            }
          }
          if (addressInfo) {
            state.addressInfo = addressInfo
            calcDistance(addressInfo)
          } else {
            state.canChooseAddress = true
          }
        })
        .catch((err) => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
        })
    }
  } else {
    // 当前选择了地址
    calcDistance(state.addressInfo)
  }
}
function viewStoreLocation() {
  const storeInfo = state.storeInfo
  const latitude = parseFloat(storeInfo.latitude)
  const longitude = parseFloat(storeInfo.longitude)
  uni.openLocation({
    latitude,
    longitude,
    scale: 28,
    name: storeInfo.name,
    address: storeInfo.address,
  })
}
function toggleMiddlePopup() {
  toggle('middle')
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function showNotify(text) {
  Notify.show({
    text,
    duration: 30000,
    selector: '#top-notify',
    backgroundColor: '#ff918f',
  })
}
function handleClick(val) {
  const self = this
  // 配送和快递
  if (
    val.currentTarget.dataset.type === 'dispatch' ||
    val.currentTarget.dataset.type === 'logistical'
  ) {
    // 直接后端计算配送费距离之类的
    checkDistribution()
  }
  //  切换配送方式 重新从后端获取配送时间
  // 切换配送方式 移除缓存的自提时间 (外卖和自提都需要获取配送时间)
  state.type = val.currentTarget.dataset.type
  uni.removeStorageSync('wj_storePickupTime')
  if (state.type === 'selftake' || state.type === 'dispatch') getCalculateTime()
}
function getCalculateTime() {
  // 获取订单自提/配送时间 给后端参数处理
  state.storePickupTime = ''
  const postData = {
    storeId: state.storeId,
    productIds: [state.bargainInstance.id],
  }
  if (state.type === 'selftake') {
    postData.shipmentType = 'SELF' // 自提
  } else if (state.type === 'dispatch') {
    postData.shipmentType = 'EXPRESS' // 外卖配送
  }
  if (postData.productIds.length <= 0) {
    return
  }
  orderService
    .calculateTime(postData)
    .then((res) => {
      // console.log('res----',res)
      state.deliveryTimeData = []
      if (res && res.timeScopeList) {
        res.timeScopeList.forEach((item) => {
          state.deliveryTimeData.push({
            day: item.day,
            timeList: item.time,
          })
        })
      }
      state.deliveryTimeData = state.deliveryTimeData
      state.deliveryTime = ''
      state.storePickupTime = ''
      console.log('deliveryTimeData', state.deliveryTimeData)
    })
    .catch((err) => {
      if (err.code != 1) {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      }
      state.deliveryTimeData = []
      state.deliveryTime = ''
      state.storePickupTime = ''
    })
    .finally(() => {
      const wj_storePickupTime = uni.getStorageSync('wj_storePickupTime')
      console.log('wj_storePickupTime', wj_storePickupTime)
      if (wj_storePickupTime) {
        state.storePickupTime = wj_storePickupTime
      }
    })
}
function handleTips(val) {
  let tipsFont = '该订单不支持'
  if (val.currentTarget.dataset.type === 'selftake') {
    tipsFont += '到店自提'
  } else if (val.currentTarget.dataset.type === 'dispatch') {
    tipsFont += '外卖配送'
  } else {
    tipsFont += '快递配送'
  }
  uni.showToast({
    title: tipsFont,
    icon: 'none',
    duration: 2000,
  })
}
function onClose() {
  state.showTime = false
}
function chooseTime() {
  // console.log(this.data.showTime)
  // this.timepicker.getDliveryTime();
  // console.log(this.data.showTime)
  state.showTime = true
}
onLoad(async function (options) {
  uni.hideShareMenu()
  // 实例化API核心类
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey,
    })
  })
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
  const self = this
  if (app.globalData.storeInfo) {
    state.storeName = app.globalData.storeInfo.name
    state.storeId = app.globalData.storeInfo.id
    state.storeInfo = app.globalData.storeInfo
  }

  // 查询配置项获取订单预约时间和订单自提开始时间和预约时间间隔

  const systemOptions = app.globalData.configureInfo
  const configures = {
    isGiftCard: true,
  }
  console.log(systemOptions, 'systemOptionssystemOptionssystemOptionssystemOptions')
  systemOptions.forEach((item) => {
    // 遍历配置项，获取订单预约时间和订单自提开始时间
    if (item.key === 'isGiftCard' && item.value != null && item.value !== '') {
      item.value === 'TRUE' ? (configures.isGiftCard = true) : (configures.isGiftCard = false)
    }
  })
  state.systemOptions = configures
  await getPaymentMethod()
  // 获取地图配置
  getMapSet()
  // 获取购物车数据
  try {
    const res = uni.getStorageSync('wj_bargainOrder')
    if (res) {
      console.log(res)
      // 查询门店信息
      state.bargainInstance = res
      state.goodsList = [
        {
          productImage: res.productImage,
          productName: res.productName,
          productId: res.productId,
          productNum: 1,
          finalPrice: res.finalPrice,
        },
      ]
      state.allPrice = parseFloat(res.finalPrice)
      state.storeId = res.storeId
      state.isDistributionOrder = res.business === 'DISTRIBUTION'
      getStoreInfoById(res.storeId)
      if (state.storeInfo) {
        // 根据砍价实例里的配置显示自提或者配送
        handleDeliveryType()
      }
      // 查询用户储值余额
      getMbrBalance()
      if (res.shipmentType === 'SELF') {
        initializationTime() // 初始化预约时间
      } else {
        // 配送根据地址标识查询配送信息
        // 查询配送费优惠规则
        // self.getDistributionFeeRule(res.storeId)
      }
      // 计算可用礼品卡
      getAvailableGiftCardNum()
    }
  } catch (e) {
    console.log(e)
  }
})
onReady(function () {})
function getMspAccountDetailA(cardNo) {
  const data = {
    cardNo,
  }
  const that = this
  couponService.getMspAccountDetail(data).then((res) => {
    if (res) {
      state.accountDetail = res
      uni.setStorageSync('wj_cardno', '')
    }
  })
}
onShow(function () {
  const cardNo = uni.getStorageSync('wj_cardno')
  if (cardNo) {
    state.cardNo = cardNo
    getMspAccountDetailA(cardNo)
  }
  const addressInfo = uni.getStorageSync('wj_chooseAddressInfo')
  if (addressInfo) {
    // 缓存中有默认地址
    state.addressInfo = addressInfo
  }
  const self = this
  // 读取选择的礼品卡数据
  try {
    const giftCardData = uni.getStorageSync('wj_chooseCard')
    if (giftCardData) {
      const canUseGiftCard = giftCardData
      // 礼品卡应该在计算促销之后计算
      state.orderGiftCard = canUseGiftCard
      handleCardBalance()
    } else {
      state.orderGiftCard = {
        maxUseTotal: 0,
      }
      state.giftCardDiscount = 0
    }
    uni.removeStorageSync('wj_chooseCard')
  } catch (error) {}
  // 获取备注数据
  uni.getStorage({
    key: 'wj_addRemarks',
    success: function (res) {
      if (res.data !== '') {
        state.remarks = res.data
      } else {
      }
    },
  })

  // 获取会员信息
  uni.getStorage({
    key: 'wj_member',
    success: function (res) {
      state.memberInfo = res.data
    },
  })

  // 检查配送距离
  if (state.type === 'dispatch' || state.type === 'logistical') {
    checkDistribution()
  } else {
  }
  // 获取分享人id
  if (app.globalData.isShoppingGuidanceRecordGoods) {
    // 如果导购只计算分享的商品
    uni.getStorage({
      key: 'wj_sharingInfo',
      success: function (res) {
        if (res.data && res.data !== null)
          if (res.data.type !== 'normal') {
            // 拼团、预售、秒杀（立即抢购）
            if (res.data.type === 'secondkill' && state.scource !== 'BUYNOW') {
              // 购物车中有秒杀
            } else if (
              state.goodsList.length === 1 &&
              state.goodsList[0] != null &&
              state.goodsList[0].productId != null
            ) {
              if (res.data.shareId != null && res.data.productId === state.goodsList[0].productId) {
                state.sharingPersonId = res.data.shareId
              } else if (res.data.shareId != null && res.data.productId === '') {
                state.sharingPersonId = res.data.shareId
              }
            } else if (res.data.type === 'secondkill' || res.data.type === 'group') {
              if (res.data.shareId != null && res.data.productId === '') {
                state.sharingPersonId = res.data.shareId
              } else if (res.data.productId === state.goodsList[0].productId) {
                state.sharingPersonId = res.data.shareId
              }
            }
          }
      },
    })
  } else {
    // 整单记录分享 整单记录分享统一使用 wj_sharingId
    try {
      const sharingId = uni.getStorageSync('wj_sharingId')
      if (sharingId) {
        // Do something with return value
        state.sharingPersonId = sharingId
      }
    } catch (e) {
      // Do something when catch error
    }
  }
  // 统计PV
  ANALYSIS.PVStatistics(state.storeId)
})
onHide(function () {})
onUnload(function () {
  try {
    // 清除缓存数据
    uni.removeStorageSync('wj_orderCardInfo')
    uni.removeStorageSync('wj_addRemarks')
  } catch (error) {}
})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {})
function contactStore() {
  const storeInfo = state.storeInfo
  let tel = ''
  if (storeInfo.tel != null && storeInfo.tel != '') {
    // 判断订单中门店是否有电话
    tel = storeInfo.tel
  } else {
    // 门店无电话使用公司服务电话
    tel = app.globalData.servicePhone
  }
  if (tel !== '') {
    uni.showModal({
      title: '提示',
      content: '确定要拨打以下电话' + tel,
      confirmText: '拨打',
      success: function (res) {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: tel,
          })
        }
        if (res.cancel) {
        }
      },
    })
  }
}
function passProudrtBtn() {
  const goodsList = state.goodsList
  for (let i = 0; i < goodsList.length; i++) {
    const productId = goodsList[i].productId
    for (let j = 0; j < state.passProductActive.length; j++) {
      const passProductId = state.passProductActive[j].productId
      if (productId === passProductId) {
        goodsList.splice(i, 1)
        i-- // 更新i的值以避免跳过下一个元素
      }
    }
  }
  const sum = goodsList.reduce((acc, cur) => {
    return acc + cur.sellPrice * cur.productNum
  }, 0)
  state.goodsList = goodsList
  state.allPrice = sum
  state.couponDiscount = 0
  state.usedCoupons = []
  state.couponInfo = {
    description: '选择优惠券',
    data: {
      freeship: [],
      discount: [],
    },
    useCoupon: false,
  }
  state.shipmentDiscount = 0
  state.shipmentCouponDiscount = 0
  if (goodsList.length > 0) {
    calcDistance(state.addressInfo)
    handlePayModule()
  }
  toggle('pass')

  // this.calcPromotions();
}
function onCancelA() {
  state.canBuy = true
  toggle('pass')
}
function getDistributionFeeRule(storeId) {
  const self = this
  // 定义配送费优惠规则
  distributionFee = null
  distributionService
    .get(storeId)
    .then((res) => {
      const resArr = res ? Object.keys(res) : []
      if (res && resArr.length > 0) {
        distributionFee = res
        state.shipmentAmount = res.baseFare
      }
    })
    .catch((err) => {
      UTILS.showToast(err.messag)
    })
}
function toChoiceGiftCard() {
  // 清空已选择的礼品卡数据
  const productData = JSON.stringify(state.goodsList)
  let opts = '?productData=' + productData + '&storeId=' + state.storeInfo.id
  if (state.orderGiftCard.cardId != null) {
    opts = opts + '&cardId=' + state.orderGiftCard.cardId
  }
  NAVPAGE.toChoiceGiftCard(opts)
}
function getAvailableGiftCardNum() {
  const tempList = []
  if (state.goodsList.length > 0) {
    state.goodsList.forEach((item) => {
      const tempItem = {
        productId: item.productId,
        productNum: item.productNum,
      }
      tempList.push(tempItem)
    })
    const postData = {
      productIds: tempList,
      storeId: state.storeId,
      memberId: uni.getStorageSync('__user__').member.id,
    }
    state.hasAvailableGiftCard = true
    orderService
      .calculateCard(postData)
      .then((res) => {
        let count = 0
        if (res && res.length > 0) {
          res.forEach((item) => {
            if (item.useable) {
              count++
            }
          })
        }
        state.giftCardNum = count
        state.hasAvailableGiftCard = true
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  }
}
function handleDeliveryType() {
  const self = this
  const shipmentTypes =
    state.bargainInstance &&
    state.bargainInstance.shipmentType &&
    state.bargainInstance.shipmentType.length > 0
      ? state.bargainInstance.shipmentType.split(',')
      : []
  // 取门店和商品配送方式的交集
  const optionalShipmentType = state.optionalShipmentType
  console.log(optionalShipmentType, 'optionalShipmentType')
  const keys = Object.keys(optionalShipmentType)
  keys.forEach((shipmentTypeItem) => {
    console.log(
      state.storeInfo.shipmentTypes.indexOf(shipmentTypeItem) == -1,
      shipmentTypes.indexOf(shipmentTypeItem) == -1,
      optionalShipmentType[shipmentTypeItem],
    )
    if (
      (state.storeInfo.shipmentTypes.indexOf(shipmentTypeItem) == -1 ||
        shipmentTypes.indexOf(shipmentTypeItem) == -1) &&
      optionalShipmentType[shipmentTypeItem]
    ) {
      console.log('shipmentTypeItem', shipmentTypeItem)
      optionalShipmentType[shipmentTypeItem] = false
    }
  })
  console.log(optionalShipmentType, 'optionalShipmentType')
  // 统配商品
  if (state.isDistributionOrder) {
    optionalShipmentType.SELF = false
    optionalShipmentType.EXPRESS = false
    optionalShipmentType.LOGISTICAL = true
  }
  // console.log(optionalShipmentType,'optionalShipmentType')
  state.optionalShipmentType = optionalShipmentType
  let firstType = state.shipmentSortList[0]
  let type = 'selftake'
  if (!state.optionalShipmentType[firstType]) {
    const keys = Object.keys(state.optionalShipmentType)
    keys.some((key) => {
      if (state.optionalShipmentType[key]) {
        firstType = key
      }
      return state.optionalShipmentType[key]
    })
  }
  if (firstType === 'SELF') {
    type = 'selftake'
  } else if (firstType === 'EXPRESS') {
    type = 'dispatch'
  } else if (firstType === 'LOGISTICAL') {
    type = 'logistical'
  }
  state.type = type
  if (state.type === 'selftake' || state.type === 'dispatch') getCalculateTime()
}
function selectTime(e) {
  if (e.detail.deliveryTime && e.detail.deliveryTime !== state.storePickupTime) {
    // 选择完时间后存储到本地
    state.storePickupTime = e.detail.deliveryTime
    state.showTime = false
    uni.setStorageSync('wj_storePickupTime', state.storePickupTime)
  }
}
function getMbrBalance() {
  const that = this
  memberService.getMbrBalance().then((res) => {
    // 储值卡余额大于0时才会使用
    if (res > 0 && state.isStoredPayment) {
      state.storedValueCard = {
        ...state.storedValueCard,
        balance: res, // 储值卡余额
      }
      state.payMethod.balance = res
      handleCardBalance()
    } else {
      state.storedValueCard = {
        useAmount: 0,
        // 本次使用额度
        balance: 0,
        // 储值卡余额
        password: '', // 储值卡密码密码
      }
      state.cardDeductTotal = 0
      state.useStoredValueCard = false
    }
  })
}
function handleCardBalance() {
  const that = this
  const allPrice = Number(state.allPrice) // 订单金额
  const totalDiscount = Number(state.totalDiscount) // 现金抵扣金额
  // 运费抵扣
  const shipmentRealPay = parseFloat(
    (Number(state.shipmentAmount) - Number(state.shipmentDiscount)).toFixed(2),
  )
  // 可使用的礼品卡信息
  const orderGiftCard = state.orderGiftCard
  const canUseAmount = Number(state.storedValueCard.balance) // 可以使用的储值金额
  // 总价减去抵扣（现金、券和积分优惠）和运费抵扣剩下的金额
  const paymentTotal = parseFloat((allPrice + shipmentRealPay - totalDiscount).toFixed(2))
  // 计算礼品卡抵扣的金额
  let giftCardDiscount = 0
  if (paymentTotal > Number(orderGiftCard.maxUseTotal)) {
    giftCardDiscount =
      Number(orderGiftCard.maxUseTotal) > 0
        ? parseFloat(Number(orderGiftCard.maxUseTotal).toFixed(2))
        : 0
  } else {
    giftCardDiscount = Number(paymentTotal) > 0 ? parseFloat(Number(paymentTotal).toFixed(2)) : 0
  }
  state.giftCardDiscount = giftCardDiscount
  const tempPrice = parseFloat(
    (allPrice - totalDiscount - giftCardDiscount + shipmentRealPay).toFixed(2),
  )
  const useStoredValueCard = canUseAmount > 0
  if (tempPrice >= 0 && state.isStoredPayment) {
    if (tempPrice > canUseAmount) {
      state.storedValueCard = {
        ...state.storedValueCard,
        useAmount: canUseAmount, // 本次使用余额
      }
      state.cardDeductTotal = canUseAmount
      state.useStoredValueCard = useStoredValueCard
      state.payMethod.useStoredValueCard = useStoredValueCard
      state.payMethod.cardDeductTotal = canUseAmount
    } else {
      state.storedValueCard = {
        ...state.storedValueCard,
        useAmount: tempPrice, // 本次使用余额
      }
      state.cardDeductTotal = tempPrice
      state.useStoredValueCard = useStoredValueCard
      state.payMethod.useStoredValueCard = useStoredValueCard
      state.payMethod.cardDeductTotal = tempPrice
    }
  } else {
    state.storedValueCard = {
      ...state.storedValueCard,
      useAmount: 0, // 本次使用余额
    }
    state.cardDeductTotal = 0
    state.useStoredValueCard = false
    state.payMethod.useStoredValueCard = false
    state.payMethod.cardDeductTotal = 0
  }
}
function handleContinuePay(e) {
  state.canBuy = e.detail
}
function handleOrderCancel(e) {
  state.orderCancel = e.detail
}
function handleOrderPay(e) {
  console.log(e, '查看一下支付方式')
  state.orderPay = e.detail
}
function handleSelectMspCard() {
  const that = this
  const useStoredMspCard = true
  // 重算积分、优惠券和礼品卡
  state.useStoredMspCard = useStoredMspCard
  state.cardDeductTotal = 0
  state.payMethod.useStoredValueCard = false
  state.payMethod.cardDeductTotal = 0
}
function weixinPay() {
  const that = this
  const useStoredMspCard = false
  state.useStoredMspCard = useStoredMspCard
  state.cardDeductTotal = 0
  state.payMethod.useStoredValueCard = false
  state.payMethod.cardDeductTotal = 0
}
function handleSelectStoredValueCard() {
  const that = this
  const useStoredValueCard = !state.useStoredValueCard
  // 重算积分、优惠券和礼品卡
  state.useStoredValueCard = useStoredValueCard
  state.cardDeductTotal = useStoredValueCard ? state.storedValueCard.useAmount : 0
  state.payMethod.useStoredValueCard = useStoredValueCard
  state.payMethod.cardDeductTotal = useStoredValueCard ? state.storedValueCard.useAmount : 0
}
</script>
<style scoped>
/* pages/mallModule/bargain/bargainAddOrder/bargainAddOrder.wxss */

page {
  background-color: #f1f1f1;
  padding-bottom: 130rpx;
}
.number-modal-contentA {
  background: #fff;
  width: 683rpx;
  padding: 36rpx 0rpx 0 0rpx;
  min-height: 356rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  /* margin: 40% auto; */
  position: relative;
}
.number-modal-contentA .title {
  color: #232222;
  font-size: 30rpx;
  line-height: 42rpx;
  /* text-align: center; */
  font-weight: normal;
  margin-left: 20rpx;
}
.number-modal-contentA .content {
  font-size: 28rpx;
  /* line-height: 36rpx; */
  color: #676666;
  padding: 40rpx 40rpx;
  padding-bottom: 100rpx;
  /* margin-top: 48rpx; */
  /* display: flex;
    justify-content: center; */
}
.number-modal-content .title {
  color: #232222;
  font-size: 36rpx;
  line-height: 42rpx;
  text-align: center;
  font-weight: normal;
}

.number-modal-content .content {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #676666;
  padding: 0 40rpx;
  margin-top: 48rpx;
  display: flex;
  justify-content: center;
}

.number-modal-content .content .count-box {
  width: 354rpx;
  height: 80rpx;
  border: 1rpx solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
}

.number-modal-content .content .count-box > view {
  /* border: 1rpx solid #ddd; */
  width: 79rpx;
  height: 100%;
  text-align: center;
  font-size: 48rpx;
  line-height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-modal-content .content .count-box > input {
  width: 194rpx;
  height: 100%;
  border: none;
  text-align: center;
  padding: 0;
  color: #313131;
  font-size: 48rpx;
}

.number-modal-content .content .count-box > view:first-of-type {
  border-right: 1rpx solid #ddd;
}

.number-modal-content .content .count-box > view:last-of-type {
  border-left: 1rpx solid #ddd;
}

.number-modal-content .button-box {
  display: flex;
  width: 100%;
  height: 88rpx;
  position: absolute;
  bottom: 0;
}

.number-modal-content .button-box button {
  flex: 1;
  font-size: 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #fff;
  border-radius: 0;
  border: none;
}

.number-modal-content .button-box .confirm {
  color: #fff;
}

.number-modal-content .button-box .cancel {
  box-sizing: border-box;
  color: #8a8989;
  border-top: 1rpx solid #e5e5e5;
}
.dividing-line {
  width: 714rpx;
  height: 26rpx;
  position: relative;
  left: 50%;
  /* margin-left: -356rpx; */
  transform: translateX(-50%);
}
.dividing-line image {
  width: 716rpx;
  height: 100%;
  margin-left: -1px;
}

.pay-item {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  line-height: 72rpx;
  min-height: 72rpx;
}
.pay-item .type-box {
  display: flex;
  height: 64rpx;
  border-radius: 64rpx;
  overflow: hidden;
  background-color: #f1f1f1;
}
.pay-item .type-box view {
  position: relative;
  padding: 0 20rpx;
}
.pay-item .type-box .active {
  border-radius: 64rpx;
  color: #fff;
}
.pay-item .left {
  color: #454545;
}

.pay-item .left text {
  margin-left: 2rpx;
}

.pay-item image.tips {
  width: 23rpx;
  height: 23rpx;
}

.pay-item .right {
  display: flex;
  align-items: center;
}

.pay-item .right.score {
  color: #8b8b8c;
}

.pay-item .right .deduction-amount {
  color: #fd463b;
  font-weight: bold;
  margin: 0 12rpx 0 12rpx;
  font-size: 28rpx;
}

.pay-item .right .amount-box {
  color: #fd463b;
  font-weight: bold;
  font-size: 28rpx;
}
.pay-item .right.coupon {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.pay-item .right.coupon .text {
  color: #b3b3b3;
}

.pay-item .right .coupon-amount-box {
  position: relative;
  font-size: 28rpx;
  color: #ffffff;
  line-height: 41rpx;
  min-width: 70rpx;
  height: 41rpx;
  padding: 0 13rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-item .right .coupon-bg {
  position: absolute;
  width: 96rpx;
  height: 41rpx;
  z-index: 0;
}

.pay-item .right .coupon-bg:first-of-type {
  position: absolute;
  left: 0;
  top: 0;
}

.pay-item .right .coupon-bg:last-of-type {
  position: absolute;
  right: 0;
  top: 0;
}

.pay-item .right .coupon-amount {
  height: 41rpx;
  background: rgba(253, 70, 59, 0.9);
  position: relative;
}

.pay-item .right.coupon .right-point {
  margin-left: 20rpx;
}

.pay-item1 {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  line-height: 72rpx;
  min-height: 72rpx;
  padding: 10rpx 40rpx;
  background-color: #fff;
}
.pay-item1 .type-box {
  display: flex;
  height: 64rpx;
  border-radius: 64rpx;
  overflow: hidden;
  background-color: #f1f1f1;
}
.pay-item1 .type-box view {
  position: relative;
  padding: 0 20rpx;
}
.pay-item1 .type-box .active {
  border-radius: 64rpx;
  color: #fff;
}
.pay-item1 .left {
  color: #454545;
}

.pay-item1 .left text {
  margin-left: 2rpx;
}

.pay-item1 image.tips {
  width: 23rpx;
  height: 23rpx;
}

.pay-item1 .right {
  display: flex;
  align-items: center;
}

.pay-item1 .right.score {
  color: #8b8b8c;
}

.pay-item1 .right .deduction-amount {
  color: #fd463b;
  font-weight: bold;
  margin: 0 12rpx 0 12rpx;
  font-size: 28rpx;
}

.pay-item1 .right .amount-box {
  color: #fd463b;
  font-weight: bold;
  font-size: 28rpx;
}
.pay-item1 .right.coupon {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.pay-item1 .right.coupon .text {
  color: #b3b3b3;
}

.pay-item1 .right .coupon-amount-box {
  position: relative;
  font-size: 28rpx;
  color: #ffffff;
  line-height: 41rpx;
  min-width: 70rpx;
  height: 41rpx;
  padding: 0 13rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-item1 .right .coupon-bg {
  position: absolute;
  width: 96rpx;
  height: 41rpx;
  z-index: 0;
}

.pay-item1 .right .coupon-bg:first-of-type {
  position: absolute;
  left: 0;
  top: 0;
}

.pay-item1 .right .coupon-bg:last-of-type {
  position: absolute;
  right: 0;
  top: 0;
}

.pay-item1 .right .coupon-amount {
  height: 41rpx;
  background: rgba(253, 70, 59, 0.9);
  position: relative;
}

.pay-item1 .right.coupon .right-point {
  margin-left: 20rpx;
}
.color-5a5a5a {
  color: #5a5a5a;
}

.color-8B8B8C {
  color: #8b8b8c;
}

.color-666666 {
  color: #666;
}

.color-FF8561 {
  color: #ff8561;
}

.color-009F55 {
  color: #009f55;
}

.color-454545 {
  color: #454545;
}

.right-point {
  width: 15rpx;
  height: 26rpx;
  vertical-align: middle;
  margin-top: -6rpx;
  margin-left: 10rpx;
}

.top-info {
  width: 100%;
  padding: 0 40rpx;
  background: #fff;
  font-size: 28rpx;
  box-sizing: border-box;
}

.top-info .color-8B8B8C {
  height: 75rpx;
  line-height: 75rpx;
  border-bottom: 1px solid #f1f1f1;
}

.top-info {
  width: 712rpx;
  min-height: 200rpx;
  padding: 0 18rpx;
  margin: 18rpx auto;
  background: #fff;
  font-size: 28rpx;
  box-sizing: border-box;
  position: relative;
}

.top-info .icon-top-more {
  width: 52rpx;
  height: 11rpx;
  position: absolute;
  left: 50%;
  margin-left: -26rpx;
  top: 8rpx;
}

.top-info .delivery-method-name {
  padding-top: 31rpx;
  font-size: 28rpx;
  height: 58rpx;
  color: #333;
  width: 100%;
  text-align: center;
  line-height: 58rpx;
  font-weight: bold;
}

.top-info .group-bg {
  width: 670rpx;
  height: 62rpx;
  margin: 30rpx 0;
  /* width: 750rpx;
  height: 133rpx;
  margin-left: -40rpx; */
}

.top-tips {
  width: 100%;
  padding: 0 26rpx;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  height: 60rpx;
  font-size: 28rpx;
  line-height: 60rpx;
  color: #fff;
  background: #ff918f;
  margin-bottom: 60rpx;
  z-index: 9;
}

.type-check-box {
  height: 100rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
}

.type-check-box > view {
  border: 1px solid #8b8b8c;
  color: #8b8b8c;
  border-radius: 6rpx;
  height: 70rpx;
  width: 180rpx;
  font-size: 24rpx;
  line-height: 70rpx;
  margin-right: 38rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.type-check-box > view.active {
  border-color: #fbbe35;
  color: #fbbe35;
}

.type-check-box > view image {
  width: 33rpx;
  height: 33rpx;
  margin-right: 10rpx;
}

.type-check-box .self-take image {
  width: 25rpx;
  height: 36rpx;
}

.type-check-box .self-take.active {
  border-color: #009f55;
  color: #009f55;
}

.type-check-box > view:last-of-type {
  margin-right: 0;
}

.color-line {
  width: 100%;
  height: 10rpx;
  display: block;
}

.receive-box {
  display: flex;
  padding: 18rpx 0 0;
  margin-top: 20rpx;
  background: #fff;
  border-top: 1rpx solid #f1f1f1;
  align-items: center;
}

.receive-box .icon-box {
  width: 44rpx;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  float: left;
}

.receive-box .icon-box image {
  width: 30rpx;
  height: 33rpx;
}

.receive-box .receive-info {
  width: 560rpx;
  height: 100%;
  font-size: 28rpx;
  line-height: 40rpx;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
}

.receive-box .receive-info .name-mobile text:first-of-type {
  margin-right: 22rpx;
  padding-right: 20rpx;
  position: relative;
}

.receive-box .receive-info .name-mobile text:first-of-type::after {
  content: '';
  height: 20rpx;
  background: #8b8b8c;
  width: 1px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -8rpx;
}

.receive-box .receive-info .receive-address {
  font-size: 24rpx;
  color: #454545;
}

.receive-box .iconright-box {
  width: 92rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
}

.receive-box .iconright-box image {
  width: 15rpx;
  height: 26rpx;
}

.title-box {
  font-size: 32rpx;
  font-weight: 500;
  color: #242424;
  height: 90rpx;
  line-height: 90rpx;
}
.goods-box {
  background: #fff;
  width: 672rpx;
  padding: 0 20rpx 0 20rpx;
  margin: 20rpx auto;
  background: #fff;
  border-radius: 4rpx 4rpx 0px 0px;
}

/* 门店信息 */

.store-info {
  border-top: 2rpx dotted #e6e6e6;
  position: relative;
  min-height: 100rpx;
  padding: 20rpx 25rpx 36rpx 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.store-info .store-details {
  width: calc(100% - 138rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.store-info .store-details > view {
  text-align: left;
}

.store-info .store-details .name {
  font-size: 30rpx;
  line-height: 50rpx;
  margin-bottom: 8rpx;
  font-weight: 500;
  color: #242424;
}

.store-info .store-details .address {
  font-size: 26rpx;
  line-height: 36rpx;
  color: #4d4d4d;
}

.store-info .icon-right-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  color: #999;
}

.store-info .icon-right-box image {
  width: 12rpx;
  height: 23rpx;
  margin-left: 30rpx;
}

.store-info .store-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #454545;
}

.store-info .open-map {
  font-size: 24rpx;
}

.goods-item-box {
  display: flex;
  flex-direction: column;
}

.goods-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f1f1f1;
  display: flex;
  justify-content: space-between;
}

.goods-item:last-of-type {
  border-bottom: none;
}

.goods-item .goods-img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 6rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.goods-item .goods-img image {
  width: 80rpx;
  height: 80rpx;
}

.goods-item .goods-img .seckill-icon {
  position: absolute;
  width: 69rpx;
  height: 13rpx;
  top: 0;
  left: 0;
}

.goods-item .goods-img .stop-sell {
  position: absolute;
  width: 80rpx;
  height: 48rpx;
  font-size: 20rpx;
  line-height: 48rpx;
  background: rgba(255, 145, 143, 0.8);
  color: #fff;
  text-align: center;
  left: 0;
  top: 50%;
  margin-top: -24rpx;
}

.goods-item .goods-info {
  height: 80rpx;
  width: calc(100% - 109rpx);
  position: relative;
  display: flex;
  justify-content: space-between;
}

.goods-info .goods-left {
  width: 360rpx;
}

.goods-info .goods-right {
  display: flex;
  justify-content: flex-start;
}

.goods-info .goods-name,
.goods-info .goods-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  width: 360rpx;
  line-height: 40rpx;
}

.goods-info .goods-name {
  font-size: 28rpx;
  line-height: 40rpx;
  color: #454545;
  margin-top: 2rpx;
  font-weight: 400;
  height: 80rpx;
}

.goods-info .goods-desc {
  font-size: 20rpx;
  margin-top: 2rpx;
}

.goods-info .goods-count {
  font-size: 24rpx;
  color: #454545;
  line-height: 80rpx;
  font-weight: bold;
}

/* .goods-price {
  font-size: 30rpx;
  line-height: 80rpx;
  color: #454545;
  text-align: right;
  margin-left: 24rpx;
} */

.goods-price .nowPrice {
  color: #f9a72a;
  font-weight: bold;
}

.goods-price .oldPrice {
  font-size: 20rpx;
  color: #454545;
  margin-left: 18rpx;
  text-decoration: line-through;
}

/* 赠品相关 */

.gift-box {
  background: #fff6f0;
  min-height: 80rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #ff6131;
  padding: 0 40rpx;
  font-size: 24rpx;
  width: 750rpx;
  box-sizing: border-box;
  margin-left: -40rpx;
}

.gift-box view {
  display: flex;
  align-items: center;
}

.gift-box .gift-title {
  margin-right: 5rpx;
  height: 80rpx;
}

.gift-box .gift-item-box {
  width: calc(100% - 80rpx);
  display: flex;
  flex-direction: column;
}

.gift-box .gift-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 80rpx;
}

.gift-box .gift-item text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 380rpx;
}

.gift-img-box {
  width: 58rpx;
  height: 58rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  margin: 0 13rpx;
  border-radius: 6rpx;
}

.gift-img-box image {
  width: 100%;
  height: 100%;
}

.gift-box .gift-num {
  color: #ff3a00;
}

.section-box {
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  text-align: right;
  display: flex;
  justify-content: space-between;
}

.section-box view text {
  color: #f9a72a;
  font-weight: bold;
}

.dispatching-fee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #454545;
  font-size: 28rpx;
}

.dispatching-fee .left-icon {
  font-size: 20rpx;
  color: #009f55;
  border: 1rpx solid #009f55;
  font-weight: normal;
  border-radius: 6rpx;
  line-height: 40rpx;
  height: 40rpx;
  padding: 0 9rpx;
}

.score-coupon {
  background: #fff;
  padding: 0 40rpx;
  font-size: 28rpx;
  color: #454545;
  margin-bottom: 20rpx;
}

.score-coupon .score-box {
  padding: 32rpx 0;
  display: flex;
  justify-content: space-between;
}

.score-coupon .score-box .left text {
  font-size: 24rpx;
  margin-left: 16rpx;
}

.score-coupon .score-box image {
  width: 23rpx;
  height: 23rpx;
}

.score-coupon .score-box .right {
  display: flex;
  align-items: center;
  font-size: 24rpx;
}

.score-coupon .score-box .right .score-amount {
  color: #f9a72a;
  font-weight: bold;
  margin: 0 30rpx 0 20rpx;
  font-size: 28rpx;
}

.checkbox-icon {
  width: 32rpx;
  height: 32rpx;
  background: url('http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/xianfengImages/iconUnchecked.png')
    no-repeat center;
  background-size: 100% 100%;
}

.checkbox-icon.active {
  width: 32rpx;
  height: 32rpx;
  background: url('https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/UI/xianfeng/iconChecked.png')
    no-repeat center;
  background-size: 100% 100%;
}

.coupon-box {
  height: 85rpx;
  font-size: 28rpx;
  border-top: 1rpx solid #f1f1f1;
  line-height: 85rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  color: #454545;
}

.coupon-box .right-info {
  color: #8b8b8c;
}

.coupon-box .coupon-amount {
  color: #ff8561;
  font-weight: bold;
}

.coupon-box .right-point,
.integral-box .right-point {
  margin-left: 20rpx;
}

/* 账单明细 */

.bill-details {
  height: 80rpx;
  padding: 0 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin-bottom: 20rpx; */
}

.bill-details view:first-of-type {
  font-size: 24rpx;
  color: #8b8b8c;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  height: 100%;
  padding-right: 20rpx;
}

.bill-details view:first-of-type image {
  width: 23rpx;
  height: 23rpx;
  margin-left: 11rpx;
}

/* 账单明细 */

.bill-details {
  height: 80rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* margin-bottom: 20rpx; */
}

.bill-details view.discount-amounts {
  font-size: 24rpx;
  color: #a8a8a8;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  height: 100%;
  padding-right: 20rpx;
}

.bill-details view.discount-amounts image {
  width: 23rpx;
  height: 23rpx;
  margin-left: 11rpx;
}

.balance-accounts {
  justify-content: flex-end;
  align-items: center;
  display: flex;
  font-size: 28rpx;
  color: #181818;
  font-weight: bold;
}

.balance-accounts text {
  font-size: 28rpx;
  color: #ff8425;
}

.block-box {
  background: #fff;
  width: 674rpx;
  padding: 0 20rpx;
  margin: 0 auto 18rpx auto;
  overflow: hidden;
}

.block-title {
  font-size: 32rpx;
  line-height: 56rpx;
  color: #242424;
  padding-top: 17rpx;
  font-weight: 500;
  font-family: Source Han Sans CN;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 94rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.row .title {
  font-weight: 500;
  font-size: 28rpx;
  color: #454545;
}

.row .right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.row .right .info {
  margin-right: 20rpx;
  font-size: 28rpx;
  color: #a8a8a8;
  font-weight: 400;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 446rpx;
  text-align: right;
}

.block-title {
  font-size: 32rpx;
  line-height: 56rpx;
  color: #242424;
  padding-top: 17rpx;
  font-weight: 500;
  font-family: Source Han Sans CN;
}

.integral-box {
  height: 90rpx;
  font-size: 30rpx;
  border-top: 1rpx solid #f4f5f9;
  line-height: 90rpx;
  background: #fff;
}

.integral-box text {
  float: left;
}

.integral-box .right-info {
  float: right;
}

.reserve-box {
  height: 90rpx;
  font-size: 26rpx;
  border-top: 1rpx solid #f4f5f9;
  line-height: 90rpx;
  background: #fff;
  margin-left: 40rpx;
  /* overflow: hidden; */
}

.reserve-box switch {
  float: right;
  margin-right: 25rpx;
}

.reserve-box .wx-switch-input {
  width: 91rpx !important;
  height: 42rpx !important;
  border-radius: 20rpx !important;
  border: 2rpx solid #ccc !important;
}

.reserve-box .wx-switch-input::before {
  width: 87rpx !important;
  height: 38rpx !important;
}

.reserve-box .wx-switch-input::after {
  width: 19rpx !important;
  height: 19rpx !important;
  background-color: #ccc;
  margin-top: 10rpx;
  margin-left: 11rpx;
  box-shadow: none;
}

.reserve-box .wx-switch-input-checked::after {
  width: 29rpx !important;
  height: 28rpx !important;
  background-color: #0198ff;
  margin-top: 6rpx;
  box-shadow: none;
}

.remarks-box {
  background: #fff;
  font-size: 28rpx;
  color: #454545;
}

.remarks-title {
  line-height: 64rpx;
  padding-top: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 40rpx;
}

.remarks-title .right-icon {
  height: 100%;
  padding: 0 40rpx;
}

.remarks-title image {
  width: 25rpx;
  height: 25rpx;
}

.remarks-info {
  line-height: 48rpx;
  padding: 0 40rpx 48rpx 40rpx;
}

.coupon-box text,
.reserve-box text,
.integral-box text {
  float: left;
}

.coupon-box .right-info,
.integral-box .right-info {
  float: right;
}

.coupon-text {
  color: #999;
}

.payment-remarks {
  background: #fff;
  font-size: 26rpx;
  margin-bottom: 20rpx;
}

.payment-method,
.remarks {
  height: 90rpx;
  line-height: 90rpx;
  margin-left: 40rpx;
}

.payment-method {
  border-bottom: 1rpx solid #f4f5f9;
}

.payment-method text:last-of-type {
  float: right;
  margin-right: 30rpx;
}

.remarks .remarks-info {
  float: right;
  color: #9c9c9c;
}

.price-detail {
  background: #fff;
  padding: 20rpx 30rpx 20rpx 40rpx;
  font-size: 30rpx;
  line-height: 54rpx;
}

.price-detail view text:last-of-type {
  float: right;
  color: #ff2126;
}

.bottom-box {
  width: 100%;
  height: 120rpx;
  padding: 10rpx 38rpx;
  box-sizing: border-box;
  font-size: 32rpx;
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  background: #fff;
  border-top: 1rpx solid #dcdcdc;
  display: flex;
  justify-content: space-between;
}

.bottom-box .btn {
  float: right;
  width: 220rpx;
  height: 74rpx;
  color: #fff;
  text-align: center;
  line-height: 74rpx;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 37rpx;
  padding: 0;
}

.bottom-box .usable {
  background: #009f55;
}

.bottom-box .unavailable {
  background: #ccc;
}

.bottom-box .order-price {
  float: left;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 26rpx;
  color: #454545;
  line-height: 48rpx;
  font-weight: bold;
  line-height: 80rpx;
}

.bottom-box > view text {
  display: block;
}

.bottom-box > view text:first-of-type {
  color: #ff7121;
  font-size: 40rpx;
  position: relative;
  padding-right: 22rpx;
  margin-right: 20rpx;
}

.bottom-box > view:first-of-type > view:last-of-type {
  font-size: 24rpx;
  color: #999;
}

.time-picker {
  width: 100%;
  background: #fff;
  padding-right: 20rpx;
  box-sizing: border-box;
}

.time-picker > view {
  height: 100rpx;
  line-height: 100rpx;
  font-size: 28rpx;
  border-top: 1rpx solid #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #454545;
  text-align: right;
  position: relative;
  /* padding-right: 36rpx; */
}

.time-picker > view view {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.time-picker > view .left-icon {
  width: 30rpx;
  height: 30rpx;
  margin: 0 16rpx 0 0;
}

.time-picker text.self-time {
  margin-right: 40rpx;
}

.time-picker .right-point {
  margin-top: 0;
  margin-left: 30rpx;
}

.delivery-time-box {
  height: 100rpx;
  display: flex;
  align-items: center;
  background: #fff;
  margin: 20rpx 0 0 0;
  /* padding: 10rpx 0; */
  box-sizing: border-box;
  border-bottom: 1px solid #f1f1f1;
}

.delivery-time-box text,
.store-info text {
  display: block;
}

.delivery-time-box .color-5a5a5a {
  font-size: 28rpx;
  line-height: 48rpx;
}

.delivery-time-box .self-time {
  font-size: 30rpx;
  line-height: 56rpx;
  color: #009f55;
}

/* 拼团自提时间时间点样式 */

.time-point {
  padding: 6rpx 40rpx 0 40rpx;
  height: 90rpx;
}

.time-point .time-picker > view {
  border-top: none;
  padding-right: 0;
}

.time-point .right-point {
  margin-top: 0;
  margin-left: 30rpx;
}

.store-box {
  background: #fff;
  margin: 0 0 20rpx 0;
  padding: 22rpx 40rpx 26rpx 40rpx;
  position: relative;
}

.store-box .color-5a5a5a {
  font-size: 28rpx;
  line-height: 44rpx;
}

.store-box view.store-details {
  width: calc(100% - 138rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 6rpx;
}

.store-box view.store-details text {
  display: block;
  text-align: left;
}

.store-box view text:first-of-type {
  font-size: 40rpx;
  line-height: 46rpx;
  margin-bottom: 10rpx;
  font-weight: bold;
}

.store-box view text:last-of-type {
  font-size: 26rpx;
  line-height: 36rpx;
}

.store-box .icon-right-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 48rpx;
  top: 0;
  font-size: 24rpx;
  color: #999;
}

.store-box .icon-right-box image {
  width: 15rpx;
  height: 26rpx;
  margin-left: 9rpx;
}

.store-box {
  background: #fff;
  margin: 20rpx 0;
  padding: 22rpx 40rpx 26rpx 40rpx;
  position: relative;
}

.store-box .color-5a5a5a {
  font-size: 28rpx;
  line-height: 44rpx;
}

.store-box view.store-details {
  width: calc(100% - 138rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 14rpx;
}

.store-box view.store-details text {
  display: block;
  text-align: left;
}

.store-box view text:first-of-type {
  font-size: 30rpx;
  line-height: 42rpx;
  margin-bottom: 10rpx;
}

.store-box view text:last-of-type {
  font-size: 26rpx;
  line-height: 36rpx;
}

.store-box .icon-right-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 48rpx;
  top: 0;
  font-size: 24rpx;
  color: #999;
}

.store-box .icon-right-box image {
  width: 15rpx;
  height: 26rpx;
  margin-left: 9rpx;
}

/* 弹出框 */

.modal-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
}

.modal-body {
  position: relative;
}

.modal-content {
  background: #fff;
  width: 586rpx;
  /* height: 520rpx; */
  padding: 24rpx 0 0 0;
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  margin: 40% auto;
  position: relative;
}

.modal-body .modal-content.card {
  width: 480rpx;
  height: 320rpx !important;
  margin: 58% auto;
}

.modal-body .modal-content.score {
  min-height: 520rpx !important;
}

.modal-content .title {
  color: #777;
  font-size: 28rpx;
  line-height: 36rpx;
  text-align: center;
}

.modal-content .content {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #676666;
  padding: 0 40rpx;
  margin-top: 32rpx;
}

.modal-content .content .uesd {
  color: #ffaf61;
  margin-bottom: 18rpx;
}

.modal-content .content input {
  border: 1rpx solid #ffaf61;
  height: 74rpx;
  font-size: 28rpx;
  line-height: 74rpx;
  box-sizing: border-box;
  width: 100%;
  border-radius: 6rpx;
  padding: 0 0 0 24rpx;
  display: block;
}

.modal-content .content text {
  display: block;
  font-size: 28rpx;
  line-height: 36rpx;
}

.modal-content .content view {
  margin-top: 20rpx;
}

.modal-content .pay-box text:first-of-type {
  margin-bottom: 16rpx;
}

.modal-content .content .forget-password {
  font-size: 26rpx;
  line-height: 36rpx;
  float: right;
  color: #ffaf61;
  margin-top: 14rpx;
}

.button-box {
  display: flex;
  width: 100%;
  height: 80rpx;
  position: absolute;
  bottom: 0;
}

.button-box button {
  flex: 1;
  font-size: 26rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #fff;
  border-radius: 0;
  border: none;
}

button::after {
  border: none;
}

.button-box .confirm {
  background: #009f55;
  color: #fff;
}

.button-box .cancel {
  box-sizing: border-box;
  color: #8a8989;
  border-top: 1rpx solid #e5e5e5;
}

.score-picker {
}

.score-picker .picker {
  width: 460rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 10rpx;
  border: 2rpx solid #0198ff;
  box-sizing: border-box;
}

.score-amount {
  font-size: 28rpx !important;
  line-height: 42rpx;
  margin: 22rpx 0;
}

.modal-content .content .score-amount > text {
  color: #df1f1d;
  display: inline;
}

.score-explain {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
  color: #969696;
  margin-bottom: 16rpx;
}

.score-rule {
  font-size: 24rpx !important;
  line-height: 30rpx !important;
  color: #969696;
  padding-bottom: 105rpx;
}

.popup-content {
  width: 600rpx;
  border-radius: 6rpx;
  background: #fff;
  overflow: hidden;
  padding-top: 12rpx;
}

.popup-content .title {
  font-size: 32rpx;
  color: #454545;
  line-height: 80rpx;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
}

.popup-content-box {
  color: #454545;
}

.price-detail {
  padding: 0 32rpx;
  font-size: 30rpx;
  line-height: 77rpx;
  border-bottom: 1px solid #f1f1f1;
}

.price-detail view {
  border-bottom: 1px solid #f1f1f1;
  height: 77rpx;
}

.price-detail view text:last-of-type {
  float: right;
  color: #ff7171;
  border-bottom: none;
}

.realpay {
  text-align: right;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  background: #fff;
  padding: 0 32rpx;
}

.realpay text {
  color: #ff7171;
}

.popup-content .button {
  font-size: 28rpx;
  color: #fff;
  line-height: 84rpx;
  height: 84rpx;
  background: #009f55;
  font-weight: bold;
  text-align: center;
}

.selftake-remind {
  font-size: 24rpx;
  color: #009f55;
  line-height: 84rpx;
  background: #fff;
  padding-left: 40rpx;
}

.contact-store {
  justify-content: flex-start;
  align-items: center;
  margin-top: 10rpx;
}

.contact-store .tel {
  width: 34rpx;
  height: 38rpx;
  margin-right: 16rpx;
}

.contact-store view {
  width: calc(100% - 140rpx);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}

.store-box .section-box {
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  text-align: right;
  display: flex;
}

.store-box .section-box.contact-store text {
  font-weight: normal;
  line-height: 80rpx;
  font-size: 28rpx;
  /* font-weight: normal !important; */
  margin-bottom: none !important;
}

.goods-item-box {
  display: flex;
  flex-direction: column;
}

.goods-list.hide {
  max-height: 414rpx;
  overflow: hidden;
}

.goods-item {
  padding: 0 0 30rpx 0;
  display: flex;
  justify-content: space-between;
}

.goods-item .goods-img {
  width: 108rpx;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.goods-item .goods-img image {
  width: 100%;
  height: 100%;
}

.goods-item .goods-img .seckill-icon {
  position: absolute;
  width: 69rpx;
  height: 13rpx;
  top: 0;
  left: 0;
}

.goods-item .goods-img .stop-sell {
  position: absolute;
  width: 100%;
  height: 48rpx;
  font-size: 20rpx;
  line-height: 48rpx;
  color: #fff;
  text-align: center;
  left: 0;
  top: 50%;
  margin-top: -24rpx;
}

.goods-item .goods-info {
  min-height: 120rpx;
  width: calc(100% - 128rpx);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.goods-info .goods-left {
  max-width: 360rpx;
}

.goods-info .goods-right {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.goods-info .goods-name,
.goods-info .goods-desc,
.goods-info .goods-advanceSell-price {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 460rpx;
  display: block;
  line-height: 40rpx;
}

.goods-info .goods-name {
  font-size: 24rpx;
  line-height: 38rpx;
  height: 38rpx;
  color: #333;
  margin-top: 2rpx;
  font-weight: 400;
}
.goods-info .goods-detail-info {
  display: flex;
  flex-direction: column;
  font-size: 20rpx;
  color: #999;
}
.goods-info .goods-desc {
  font-size: 18rpx;
  line-height: 36rpx;
  height: 36rpx;
  color: #999;
}

.goods-info .goods-advanceSell-price {
  font-size: 24rpx;
  color: #f9a72a;
  font-weight: bold;
}

.goods-info .goods-label {
  font-size: 20rpx;
  margin-top: 2rpx;
  background: #ff5757;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 260rpx;
  padding: 0 10rpx;
  color: #ffffff;
  display: inline-block;
  line-height: 40rpx;
  height: 40rpx;
  border-radius: 6rpx;
}

.goods-info .goods-count {
  font-size: 24rpx;
  color: #454545;
  line-height: 36rpx;
  font-weight: bold;
}

.goods-price {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #333;
}

.goods-price .nowPrice {
  font-size: 30rpx;
  font-weight: bold;
  color: #ff8425;
}
.goods-price .nowPrice text {
  font-size: 20rpx;
}

.goods-price .oldPrice {
  font-size: 20rpx;
  color: #999;
  margin-left: 18rpx;
  text-decoration: line-through;
}

.goods-info .goods-count-box {
  float: right;
  width: 164rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 56rpx;
  height: 56rpx;
  /* border: 1rpx solid #f1f1f1; */
  margin-left: 20rpx;
}

.goods-info .goods-count-box text {
  background: #fff;
  color: #454545;
  font-size: 24rpx;
  width: 43rpx;
  height: 100%;
  text-align: center;
}
.goods-info .goods-count-box .iconfont2 {
  font-size: 50rpx;
}
.goods-info .goods-count-box view {
  width: 40rpx;
  height: 40rpx;
  text-align: center;
  font-size: 40rpx;
  line-height: 36rpx;
  border-radius: 20rpx;
  background: #fff;
  color: #fff;
  display: flex;
  /* align-items: center; */
  justify-content: center;
}
</style>
