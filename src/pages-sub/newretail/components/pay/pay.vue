<template>
  <!--components/pay/pay.wxml-->
  <!-- 输入密码弹窗 -->
  <popup
    :show="state.show.cardPassword"
    position="middle"
    custom-class="middle"
    @close="toggleCardPasswordPopup"
  >
    <view class="popup-content-card">
      <view class="title">请输入支付密码</view>
      <view class="close">
        <image
          data-close="true"
          @click.stop="toggleCardPasswordPopup"
          :src="state.imagesPath.iconCloseImg2"
        ></image>
      </view>
      <view class="content">
        <password-input
          @valueSix="valueSix"
          @valueNow="handlePassword"
          :input_value="state.inputData.input_value"
          :value_length="state.inputData.value_length"
          :isNext="state.inputData.isNext"
          :get_focus="state.inputData.get_focus"
          :focus_class="state.inputData.focus_class"
          :value_num="state.inputData.value_num"
          :height="state.inputData.height"
          :width="state.inputData.width"
          :see="state.inputData.see"
          :interval="state.inputData.interval"
        >
          >
        </password-input>
        <view class="password-text">为获得更好购物体验，建议使用6位数字密码</view>
        <view class="forget-password" @click="handleResetPassword">修改密码</view>
      </view>
      <view class="button-box">
        <button :style="state.theme.mainBgColor" @click="confirmPayment">确认支付</button>
      </view>
    </view>
  </popup>
  <!-- 付款超时弹窗 -->
  <popup
    v-if="state.show.timeOut"
    :show="state.show.timeOut"
    position="middle"
    custom-class="middle"
    @close="toggleTimeOutPopup"
  >
    <view class="popup-content">
      <view class="popup-content-box">
        <image :src="state.imagesPath.iconNetworkTimeout" mode="widthFix"></image>
      </view>
      <view class="button" :style="state.theme.mainBgColor" @click="toggleTimeOutPopup">
        我知道了
      </view>
    </view>
  </popup>
</template>
<script setup>
import _apiRequestJs from '@/service/api/newretail/request'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _apiAdvanceSellServiceJs from '@/service/api/newretail/advanceSellService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiPennyServiceJs from '@/service/api/newretail/pennyService'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import { reactive, watch, onMounted, onBeforeMount } from 'vue'
import passwordInput from '../password-input/password-input.vue'
import popup from '../popup/popup.vue'
// components/pay/pay.js
const orderService = _apiOrderServiceJs
const pennyService = _apiPennyServiceJs
const memberService = _apiMemberServiceJs
const advanceSellService = _apiAdvanceSellServiceJs
const THEME = _utilsThemeManagerJs
const IMGAGESPATH = _utilsImagesPathJs
const NAVPAGE = _utilsNavPageJs
const UTILS = _utilsUtilsJs
const request = _apiRequestJs
const state = reactive({
  showPassFlag: false,
  imagesPath: IMGAGESPATH,
  theme: THEME,
  order: null,
  // 订单信息
  // 输入框参数设置
  inputData: {
    input_value: '',
    // 输入框的初始内容
    value_length: 0,
    // 输入框密码位数
    isNext: false,
    // 是否有下一步的按钮
    get_focus: false,
    // 输入框的聚焦状态
    focus_class: false,
    // 输入框聚焦样式
    value_num: [1, 2, 3, 4, 5, 6],
    // 输入框格子数
    height: '92rpx',
    // 输入框高度
    width: '592rpx',
    // 输入框宽度
    see: false,
    // 是否明文展示
    interval: true, // 是否显示间隔格子
  },
  payments: {
    cardPay: {
      total: 0,
    },
    wxPay: {
      total: 0,
    },
  },
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    cardPassword: false,
    timeOut: false,
  },
  password: '',
  orderTimeId: 0,
})
const props = defineProps({
  orderData: {
    type: Object,
    value: null,
  },
  // unpaid: { 支付改动注释
  //     type: Boolean,
  // },
  payMethod: {
    type: Object,
    value: null,
  },
  storedValueCard: Object,
  payType: {
    // 支付类型
    type: String,
    value: 'normal', // normal,普通订单; payTail,尾款;penny,购物抽奖订单
  },
  path: {
    // 页面来源
    type: String,
    value: 'perfectOrder', // perfectOrder,完善订单; order,订单列表或者订单详情
  },
  orderCancel: {
    // 支付取消
    type: Boolean,
    value: false,
    // 监听订单是否取消
  },
  orderPay: {
    // 支付成功
    type: Boolean,
    value: false,
    // 监听订单是否取消
  },
})
const app = getApp()
const emit = defineEmits(['loadingChange', 'continuePay', 'myevent', 'orderCancel', 'orderPay'])

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
onBeforeMount(() => {
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
})

onShow(() => {
  state.showPassFlag = app.globalData.systemConfigure.isRechargePasswordEnabled
})
onHide(() => {
  if (state.orderTimeId) {
    clearTimeout(state.orderTimeId)
    state.orderTimeId = null
  }
})
function getDetailsById(id) {
  orderService
    .getDetailsById(id)
    .then((res) => {
      if (res) {
        handleOrderDetails(res)
      }
    })
    .catch((e) => {
      UTILS.showToast(e.message)
    })
}
function handleOrderDetails(res) {
  state.order = res
  if (
    res.status !== 'CREATED' &&
    res.status !== 'WAITPAYBALANCE' &&
    res.status !== '待付款' &&
    res.status !== '待付尾款'
  ) {
    if (res.status === 'CANCELED' || res.status === '已取消') {
      UTILS.showToast('订单已作废，不用再次支付~')
    } else if (res.status === 'REJECTED' || res.status === '已退款') {
      UTILS.showToast('订单已退货，不用再次支付~')
    } else if (res.status === 'RETURNING' || res.status === '待自提') {
      UTILS.showToast('订单退换货中，不用再次支付~')
    } else {
      UTILS.showToast('订单已经支付，不用再次支付~')
    }
    return
  }
  console.log(res)
  // 判断当前订单是否预售订单，预售订单只支持一种支付方式，不支持组合支付
  if (res.type == 'ADVANCE_SELL') {
    if (res.status === 'CREATED' || res.status === '待付款') {
      // 待付款
      // 直接调用微信支付(使用统一支付接口)
      if (res.balanceTotal != null && res.balanceTotal > 0) {
        getUnifiedpay(res, 'FIRST_ADVANCE_SELL')
      } else {
        getUnifiedpay(res)
      }
    } else if (res.status === 'WAITPAYBALANCE' || res.status === '待付尾款') {
      // 待付尾款
      // 直接调用微信支付
      toPayTail(res)
    }
    return
  }
  if (res.payments && res.payments.length > 0) {
    let isCombinationPay = false
    let cardPayInfo = null
    res.payments.forEach((item) => {
      if (item.payMethod === 'CARDPAY' && item.status === 'CREATED') {
        cardPayInfo = {
          cardDeductTotal: item.total,
          balance: item.total,
          useStoredValueCard: true,
        }
        isCombinationPay = true
      }
    })
    if (isCombinationPay && cardPayInfo) {
      inUserPay = false
      toggleCardPasswordPopup()
      userCardPay = true
      // 存储订单信息
      order = {}
      order = res
      state.payMethod = cardPayInfo
      state.inputData.get_focus = true
      state.inputData.focus_class = true
    } else {
      // 没有使用储值卡直接调用微信支付
      getWXPay(res)
    }
  }
  if (res.cashTotal === 0) {
    // 订单金额为0 直接轮询
    getOrderStatusById(res.id)
  }
}
function handleOrderPay(order) {
  console.log(order)
  if (order == null) {
    return
  }
  // 如果是订单列表页调起支付需要查询订单
  state.order = order
  if (state.path === 'order') {
    if (order.orderNum) {
      // 订单列表
      getDetailsById(order.parentId)
      return
    } else {
      handleOrderDetails(order)
      return
    }
  }
  //   if (this.data.payMethod.cardNo && !this.data.unpaid) {
  //     if (order.cashTotal == '0') {
  //         this.getUnifiedpay(order)
  //     } else {
  //         this.getCardPay(order)
  //         // this.toggleCardPasswordPopup()
  //     }
  //     // this.getCardPay(order)
  //     // that.inUserPay = false;
  //     // this.userCardPay = true
  //     // // 存储订单信息
  //     // this.order = {}
  //     // this.order = order
  //     // that.setData({
  //     //   "inputData.get_focus": true,
  //     //   "inputData.focus_class": true
  //     // })
  // } else {
  //     // 没有使用储值卡直接调用微信支付
  //     if (order.type == 'ADVANCE_SELL') {
  //         // 直接调用微信支付(使用统一支付接口)
  //         if (order.balanceTotal != null && order.balanceTotal > 0) {
  //             that.getUnifiedpay(order, "FIRST_ADVANCE_SELL")
  //         } else {
  //             that.getUnifiedpay(order)
  //         }
  //     } else {
  //         that.getWXPay(order)
  //     }
  // }
  // 如果有储值卡弹出输入储值卡密码弹窗
  if (state.payMethod.useStoredValueCard) {
    inUserPay = false
    userCardPay = true
    if (state.showPassFlag) {
      toggleCardPasswordPopup()
    } else {
      order = {}
      order = order
      confirmPayment()
    }
    // 存储订单信息
    order = {}
    order = order
    state.inputData.get_focus = true
    state.inputData.focus_class = true
  } else {
    // 没有使用储值卡直接调用微信支付
    if (order.type == 'ADVANCE_SELL') {
      // 直接调用微信支付(使用统一支付接口)
      if (order.balanceTotal != null && order.balanceTotal > 0) {
        getUnifiedpay(order, 'FIRST_ADVANCE_SELL')
      } else {
        getUnifiedpay(order)
      }
    } else {
      getWXPay(order)
    }
  }
}
function valueSix(e) {
  console.log(e)
  // 模态交互效果
}
function handlePassword(e) {
  state.password = e.detail
}
function handleResetPassword() {
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/myCard/resetPassword/resetPassword?active=1',
  })
  // NAVPAGE.toResetPassword();
}
function toggleTimeOutPopup() {
  toggle('timeOut')
  state.orderPay = true
  uni.redirectTo({
    url: '/pages-sub/newretail/pages/mallModule/order/order/order',
  })
}
function toggleCardPasswordPopup(e) {
  toggle('cardPassword')
  const that = this
  if (userCardPay != null && userCardPay === true && !state.show.cardPassword) {
    state.orderCancel = !state.orderPay
    const _order = order || state.order
    if (state.path === 'perfectOrder') {
      uni.redirectTo({
        url:
          '/pages-sub/newretail/pages/mallModule/order/orderDetails/orderDetails?orderId=' +
          _order.id +
          '&orderFrom=shopCart&orderType=' +
          (state.order && state.order.type == 'MIXED' ? 'MIXED' : ''),
      })
    }
  }
  // if(e && e.currentTarget && e.currentTarget.dataset.close) {
  //     UTILS.showToast('您暂未输入支付密码，请重新提交！');
  //     if(that.data.unpaid) {
  //       this.emit('orderCancel', true)
  //     }
  //     wx.hideLoading();
  // }
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function confirmPayment() {
  const that = this
  if (inUserPay) {
    console.log('已经在支付中')
    return
  }
  if (state.password !== '' || !state.showPassFlag) {
    // 关闭弹窗
    inUserPay = true
    userCardPay = false
    if (state.showPassFlag) {
      toggleCardPasswordPopup()
    }
    // 调用储值卡支付
    const _order2 = order || state.order
    if (order.cashTotal > state.storedValueCard.balance) {
      // 储值余额不足，使用组合支付
      getCombinedPay(_order2)
    } else {
      // 储值卡足够支付订单
      getCardPay(_order2)
    }
  } else {
    UTILS.showToast('请输入储值卡密码~')
    state.inputData.get_focus = true
    state.inputData.focus_class = true
  }
  // if (this.data.password !== '') {
  // 关闭弹窗
  //   let postData = {
  //       password: this.data.password,
  //       memberId: app.globalData.userInfo.member.id
  //   }
  //   wx.showLoading({
  //       title: '支付中',
  //   })
  //   orderService.checkPassword(postData)
  //       .then(res => {
  //           if (res) {
  //               that.inUserPay = true;
  //               that.userCardPay = false
  //               that.toggleCardPasswordPopup()
  //               // 调用储值卡支付
  //               if(this.data.unpaid) {
  //                   this.emit('paidOrder', postData)
  //               } else {
  //                   let order = this.data.order
  //                   that.getCardPay(order)
  //               }
  //           } else {
  //               this.setData({
  //                   password: '',
  //               })
  //               UTILS.showToast('密码不正确~')
  //               wx.hideLoading();
  //           }
  //       })
  //       .catch(err=>{
  //           wx.hideLoading();
  //           if(err.code=='16665'){
  //               let passProduct = JSON.parse(err.message)
  //               this.emit('myevent', passProduct)
  //               return
  //           } else {
  //               UTILS.showToast(err.message)
  //           }
  //       })
  //   // if (this.order.cashTotal > this.data.storedValueCard.balance) {
  //   //   // 储值余额不足，使用组合支付
  //   //   this.getCombinedPay(order)
  //   // } else {
  //   //   // 储值卡足够支付订单
  //   //   this.getCardPay(order)
  //   // }
  // } else {
  //     wx.hideLoading();
  //     UTILS.showToast('请输入余额密码~')
  //     this.setData({
  //         "inputData.get_focus": true,
  //         "inputData.focus_class": true
  //     })
  // }
}
function getWXPay(order) {
  let total = parseFloat(
    (parseFloat(order.cashTotal) - parseFloat(order.cardDeductTotal)).toFixed(2),
  )
  total = total > 0 ? total : 0
  const tempData = {
    orderId: order.id,
    payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
    entry: 'ORDER',
    total,
  }
  if (order.cashTotal === 0) {
    getOrderStatusById(order.id)
  } else {
    // wx.showLoading()
    emit('loadingChange', true)
    orderService
      .getCashPaySign(tempData)
      .then((res) => {
        // wx.hideLoading()
        emit('loadingChange', false)
        wxPay(res, tempData)
      })
      .catch((err) => {
        // wx.hideLoading()
        emit('loadingChange', false)
        if (err.code == 16665) {
          const passProduct = JSON.parse(err.message)
          emit('myevent', passProduct)
          return
        }
        if (err.code === -1001) {
          // 请求超时
          orderLock(order)
          toggle('timeOut')
        } else {
          emit('continuePay', true)
          UTILS.showToast(err.message)
        }
      })
  }
}
function getCombinedPay(order) {
  if (order.cashTotal === 0) {
    getOrderStatusById(order.id)
  } else {
    let postData = {
      orderId: order.id,
      total: state.storedValueCard.useAmount,
    }
    const password = state.password
    if (password !== '' || !state.showPassFlag) {
      postData = {
        ...postData,
        cardPayPassword: password,
        entry: 'ORDER',
        payMethod: 'CARDPAY',
      }
    }
    const tempData = {
      orderId: order.id,
      payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
      entry: 'ORDER',
      total: 0,
    }
    // wx.showLoading()
    emit('loadingChange', true)
    orderService
      .getCashPaySign(postData)
      .then((res) => {
        let total = parseFloat(
          (parseFloat(order.cashTotal) - parseFloat(state.storedValueCard.useAmount)).toFixed(2),
        )
        total = total > 0 ? total : 0
        tempData.total = total
        return orderService.getCashPaySign(tempData)
      })
      .then((res) => {
        // wx.hideLoading()
        emit('loadingChange', false)
        wxPay(res, tempData)
      })
      .catch((err) => {
        // wx.hideLoading()
        emit('loadingChange', false)
        if (err.code == '16665') {
          const passProduct = JSON.parse(err.message)
          emit('myevent', passProduct)
          return
        }
        if (err.code === 44004) {
          state.password = ''
          state.inputData = {
            input_value: '',
            // 输入框的初始内容
            value_length: 0,
            // 输入框密码位数
            isNext: false,
            // 是否有下一步的按钮
            get_focus: false,
            // 输入框的聚焦状态
            focus_class: false,
            // 输入框聚焦样式
            value_num: [1, 2, 3, 4, 5, 6],
            // 输入框格子数
            height: '92rpx',
            // 输入框高度
            width: '592rpx',
            // 输入框宽度
            see: false,
            // 是否明文展示
            interval: true, // 是否显示间隔格子
          }
          inUserPay = false
          toggleCardPasswordPopup()
          UTILS.showToast(err.message)
          userCardPay = true
        } else if (err.code === -1001) {
          // 请求超时
          if (e.code === -1001) {
            // 请求超时
            orderLock(order)
            toggle('timeOut')
          }
        } else {
          UTILS.showToast(err.message)
          if (state.path === 'perfectOrder') {
            setTimeout(() => {
              uni.redirectTo({
                url:
                  '/pages-sub/newretail/pages/mallModule/order/orderDetails/orderDetails?orderId=' +
                  tempData.orderId +
                  '&orderFrom=shopCart&orderType=' +
                  (state.order && state.order.type == 'MIXED' ? 'MIXED' : ''),
              })
            }, 2000)
          }
        }
      })
  }
}
function getCardPay(order) {
  const self = this
  let postData = {
    orderId: order.id,
    total: order.cashTotal,
  }
  const password = state.password
  if (password !== '' || !state.showPassFlag) {
    postData = {
      ...postData,
      cardPayPassword: password,
      entry: 'ORDER',
      payMethod: 'CARDPAY',
    }
    // postData = {
    //   ...postData,
    //   entry: "ORDER",
    //   payMethod: "MSP_ACCOUNT_PAY",
    //   mspCardNo: this.data.payMethod.cardNo,
    // }
  }
  // wx.showLoading()
  emit('loadingChange', true)
  orderService
    .getCashPaySign(postData)
    .then((res) => {
      // wx.hideLoading()
      emit('loadingChange', false)
      getOrderStatusById(order.id)
      orderLock(order)
    })
    .catch((e) => {
      // wx.hideLoading();
      emit('loadingChange', false)
      if (e.code == '16665') {
        const passProduct = JSON.parse(e.message)
        emit('myevent', passProduct)
        return
      }
      if (e.code === 44004) {
        state.password = ''
        state.inputData = {
          input_value: '',
          // 输入框的初始内容
          value_length: 0,
          // 输入框密码位数
          isNext: false,
          // 是否有下一步的按钮
          get_focus: false,
          // 输入框的聚焦状态
          focus_class: false,
          // 输入框聚焦样式
          value_num: [1, 2, 3, 4, 5, 6],
          // 输入框格子数
          height: '92rpx',
          // 输入框高度
          width: '592rpx',
          // 输入框宽度
          see: false,
          // 是否明文展示
          interval: true, // 是否显示间隔格子
        }
        emit('continuePay', true)
        UTILS.showToast(e.message)
      } else if (e.code === -1001) {
        // 请求超时
        orderLock(order)
        toggle('timeOut')
      } else {
        emit('continuePay', true)
        UTILS.showToast(e.message)
      }
    })
}
function orderLock(order) {
  orderService.orderLock(order.id).then((res) => {
    console.log(res)
  })
}
function getUnifiedpay(order, entry = 'ORDER') {
  const self = this
  let tempData = {
    orderId: order.id,
    payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
    entry,
  }
  if (entry === 'FIRST_ADVANCE_SELL') {
    tempData = {
      ...tempData,
      total: order.cashTotal,
    }
  } else {
    tempData = {
      ...tempData,
      total: order.cashTotal,
    }
  }
  if (order.cashTotal === 0) {
    getOrderStatusById(order.id)
  } else {
    orderService
      .getCashPaySign(tempData)
      .then((res) => {
        wxPay(res, tempData)
      })
      .catch((err) => {
        if (err.code == '16665') {
          const passProduct = JSON.parse(err.message)
          emit('myevent', passProduct)
          return
        }
        if (err.code === -1001) {
          // 请求超时
          orderLock(order)
          toggle('timeOut')
        } else {
          emit('continuePay', true)
          UTILS.showToast(err.message)
        }
      })
  }
}
function toPayTail(order) {
  const that = this
  const tempData = {
    orderId: order.id,
    payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
    entry: 'BALANCE_ADVANCE_SELL',
    total: order.balanceTotal,
  }
  let id
  if (order.parentId) {
    id = order.parentId
  } else {
    id = order.id
  }
  advanceSellService
    .getBalanceOrderByOrderId(id)
    .then((res) => {
      tempData.orderId = res.id
      return orderService.getCashPaySign(tempData)
    })
    .then((res) => {
      console.log(res)
      tempData.orderId = order.id
      wxPay(res, tempData)
    })
    .catch((err) => {
      if (err.code == '16665') {
        const passProduct = JSON.parse(err.message)
        emit('myevent', passProduct)
      } else {
        UTILS.showToast(err.message)
      }
    })
}
function toPaymentSuccess(orderId) {
  const that = this
  state.orderPay = true
  if (state.order.teamId) {
    uni.redirectTo({
      url:
        '/pages-sub/newretail/pages/mallModule/fightGroup/groupPurchase/groupPurchase?orderId=' +
        orderId +
        '&from=orderPay',
    })
  } else if (state.order.type === 'SOLITAIRE') {
    const solitaireId = state.order.solitaireId
    if (state.path === 'perfectOrder') {
      try {
        uni.setStorageSync('wj_solitaire_' + solitaireId, {
          solitaireId,
        })
      } catch (error) {
        console.log(error)
      }
      uni.navigateBack({
        delta: 1,
      })
    } else {
      try {
        uni.setStorageSync('wj_solitaire_' + solitaireId, {
          solitaireId,
        })
      } catch (error) {
        console.log(error)
      }
      const opts = '?id=' + solitaireId + '&from=order'
      NAVPAGE.toSolitaireDetails(opts)
    }
  } else {
    if (state.path === 'perfectOrder') {
      uni.redirectTo({
        url:
          '/pages-sub/newretail/pages/mallModule/pay/payment/payment?orderId=' +
          orderId +
          '&from=shopCart&orderType=' +
          (state.order && state.order.type == 'MIXED' ? 'MIXED' : state.order.type),
      })
    } else {
      if (state.payType === 'penny') {
        // 购物抽奖订单跳转分享页面
        getPennyInfo(state.order)
      } else {
        uni.redirectTo({
          url:
            '/pages-sub/newretail/pages/mallModule/pay/payment/payment?orderId=' +
            orderId +
            '&orderType=' +
            (state.order && state.order.type == 'MIXED' ? 'MIXED' : state.order.type),
        })
      }
    }
  }
}
function wxPay(paySign, postData) {
  const resData = JSON.parse(paySign)
  const sign = JSON.parse(resData.sign)
  let packageValue = ''
  if (postData.payMethod === 'SWIFTPASS' || postData.payMethod === 'DINGFUTONG') {
    packageValue = sign.package
  } else if (postData.payMethod === 'WX_MINI_APP' || postData.payMethod === 'WXA_ISV_PAY') {
    packageValue = sign.packageValue
  }
  uni.requestPayment({
    timeStamp: sign.timeStamp,
    nonceStr: sign.nonceStr,
    package: packageValue,
    signType: sign.signType,
    paySign: sign.paySign,
    success: function (res) {
      console.log(res)
      getOrderStatusById(postData.orderId)
      const order = {
        id: postData.orderId,
      }
      orderLock(order)
    },
    fail: function (res) {
      console.log(res)
      console.log('支付失败-----------------')
      emit('continuePay', true)
      if (res.errMsg.indexOf('cancel') >= 0) {
        // 取消订单
        UTILS.showToast('您取消了支付订单~')
        state.password = ''
        state.inputData.input_value = ''
      } else {
        UTILS.showToast(res.errMsg)
      }
      if (state.path === 'perfectOrder') {
        state.orderCancel = true
        uni.redirectTo({
          url:
            '/pages-sub/newretail/pages/mallModule/order/orderDetails/orderDetails?orderId=' +
            postData.orderId +
            '&orderFrom=shopCart&orderType=' +
            (state.order && state.order.type == 'MIXED' ? 'MIXED' : ''),
        })
      }
    },
  })
}
function handleGetOrderStatusById(orderId, amount) {
  // wx.showLoading({
  //     title: '支付中',
  // })
  emit('loadingChange', true)
  orderService
    .getOrderStatusById(orderId)
    .then((result) => {
      console.log('查询交易结果-------------')
      console.log(result)
      amount++
      console.log(amount)
      if (amount > 40) {
        UTILS.setHideLoading(false)
        // wx.hideLoading()
        emit('loadingChange', false)
        // 弹出支付超时
        toggle('timeOut')
        return
      }
      if (
        result.status === 'PAID' ||
        result.status === 'WAITPAYBALANCE' ||
        result.status === 'PENDING' ||
        result.status === 'WAITSHIPPED' ||
        result.status === 'RECEIVED' ||
        result.status === 'SHIPPED'
      ) {
        UTILS.setHideLoading(false)
        // wx.hideLoading()
        emit('loadingChange', false)
        UTILS.showToast('支付成功')
        // 跳转到成功页面
        toPaymentSuccess(orderId)
      } else {
        state.orderTimeId = setTimeout(() => {
          // wx.hideLoading()
          emit('loadingChange', false)
          UTILS.setHideLoading(true)
          // 如果没有成功，调用函数本身，实现重复查询
          handleGetOrderStatusById(orderId, amount)
        }, 2000)
      }
    })
    .catch((err) => {
      // wx.hideLoading()
      self.emit('loadingChange', false)
      UTILS.showToast(err.message)
    })
}
function getOrderStatusById(orderId) {
  const amount = 0
  setTimeout(() => {
    self.handleGetOrderStatusById(orderId, amount)
  }, 1000)
}
function getPennyInfo(order) {
  const postData = {
    page: 1,
    pageSize: 1,
    memberIdEquals: app.globalData.userInfo.member.id,
    orderIdEquals: order.id,
    searchCount: true,
  }
  pennyService
    .queryInstance(postData)
    .then((res) => {
      if (!res || !res.records || res.records.length === 0) {
        // 处理未查到实例跳转购物抽奖列表
        UTILS.showToast('支付成功~')
        uni.redirectTo({
          url: '/pages-sub/newretail/pages/mallModule/activity/penny/pennyList/pennyList',
        })
        return
      }
      uni.redirectTo({
        url:
          '/pages-sub/newretail/pages/mallModule/activity/penny/helpPenny/helpPenny?instanceId=' +
          res.records[0].id +
          '&isCreate=true',
      })
    })
    .catch((err) => {
      UTILS.showToast(err.message)
    })
}

// Watch listeners converted from observers
watch(
  () => props.orderData,
  (newVal, oldVal) => {
    handleOrderPay(newVal)
  },
)

watch(
  () => props.orderData,
  (newVal, oldVal) => {
    //         if(newVal) {
    //           memberService.getLoginMember().then(res => {
    //             if (res.isMspPassword) {
    //               this.toggleCardPasswordPopup()
    //             } else {
    //                 wx.showToast({
    //                   title: '您还没有设置余额密码,即将跳转',
    //                   icon: 'none',
    //                   success: function (params) {
    //                       setTimeout(item => {
    //                           NAVPAGE.toResetPassword('new');
    //                       }, 2000)
    //                   }
    //                 })
    //                 return
    //             }
    //           }).catch(err => {
    //             wx.showToast({
    //               title: err.message,
    //               icon: 'none'
    //             })
    //           })
    //         }
    //
  },
)

watch(
  () => props.orderCancel,
  (newVal, oldVal) => {
    if (newVal) {
      emit('orderCancel', newVal)
    }
  },
)

watch(
  () => props.orderPay,
  (newVal, oldVal) => {
    if (newVal) {
      emit('orderPay', newVal)
    }
  },
)
</script>
<style scoped>
/* components/pay/pay.wxss */
.popup-content-card {
  background: #fff;
  width: 670rpx;
  height: 502rpx;
  padding: 0;
  box-sizing: border-box;
  border-radius: 8rpx;
  overflow: hidden;
  margin: 40% auto;
  position: relative;
}
.popup-content-card .title {
  color: #707070;
  font-size: 34rpx;
  line-height: 94rpx;
  height: 94rpx;
  text-align: center;
  border-bottom: 1rpx solid #f5f4f4;
}
.popup-content-card .content {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #676666;
  padding: 0 40rpx;
  margin-top: 72rpx;
}
.popup-content-card .content .uesd {
  color: #ffaf61;
  margin-bottom: 18rpx;
}
.popup-content-card .content password-input {
  height: 96rpx;
}
.popup-content-card .content .password-text {
  text-align: right;
  width: 100%;
  font-size: 28rpx;
  line-height: 50rpx;
  height: 50rpx;
}
.popup-content-card .content .forget-password {
  margin-top: 10rpx;
  font-size: 26rpx;
  line-height: 46rpx;
}
.popup-content-card .pay-box text:first-of-type {
  margin-bottom: 16rpx;
}
.popup-content-card .content .forget-password {
  float: right;
  font-size: 30rpx;
  line-height: 62rpx;
  margin-top: 16rpx;
  color: #1a1a1a;
}
.popup-content-card .button-box {
  display: flex;
  width: 100%;
  height: 100rpx;
  position: absolute;
  bottom: 0;
}
.popup-content-card .button-box button {
  flex: 1;
  font-size: 32rpx;
  height: 100rpx;
  font-weight: bold;
  line-height: 100rpx;
  border-radius: 0;
  border: none;
  color: #fff;
}
button::after {
  border: none;
}
.popup-content-card .close {
  width: 88rpx;
  height: 88rpx;
  position: absolute;
  right: 0;
  top: 0;
}
.popup-content-card .close image {
  position: absolute;
  width: 44rpx;
  height: 44rpx;
  right: 40rpx;
  top: 30rpx;
}
.popup-content {
  width: 670rpx;
  height: 500rpx;
  background: #fff;
  border-radius: 6rpx;
  position: relative;
}
.popup-content-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400rpx;
}
.popup-content-box image {
  width: 410rpx;
  height: 421rpx;
}
.popup-content .button {
  height: 100rpx;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 100rpx;
  width: 100%;
  color: #fff;
  text-align: center;
  border-bottom-left-radius: 6rpx;
  border-bottom-right-radius: 6rpx;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
