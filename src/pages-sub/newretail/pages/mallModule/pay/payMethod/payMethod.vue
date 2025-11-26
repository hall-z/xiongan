<template>
<!--pages/payMethod/payMethod.wxml-->
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="top-info">
  <view v-if="state.type != 'payTail'">
    <view v-if="state.payMethods[0].checked && state.isStoredPayment">已使用余额抵扣￥{{filters.filtToFix(state.order.cashTotal)}}</view>
    <view>应付金额
      <text class="total">￥{{filters.filtToFix(state.order.cashTotal)}}</text>
    </view>
  </view>
  <view v-else>
    <view>应付金额
      <text class="total">￥{{filters.filtToFix(state.order.balanceTotal)}}</text>
    </view>
  </view>
</view>
<view class="content">
  <view class="section" v-for="(item , index) in state.payMethods" :hidden="!item.isShow" :key="index" :data-id="item.id" :data-name="item.name" @click="onPayClick">
    <view class="left">
      <image :src="item.imageUrl"></image> {{item.value}}
    </view>
    <view class="right" v-if="item.name == 'CARDPAY'">
      <text>剩余可用余额</text>
      <text class="money">￥{{state.balance}}</text>
    </view>
    <image class="isChecked" :src="item.checked ? state.imagesPath.orderSelected : state.imagesPath.iconUnchecked"></image>
  </view>
</view>
<!-- <view class="content">
  <view class="section" wx:for="{{state.payMethods}}" hidden="{{!item.isShow}}" wx:key="index" data-id="{{item.id}}" data-name="{{item.name}}" bindtap='onPayClick'>
    <view class="left">
      <image src="{{item.imageUrl}}" ></image> {{item.value}}
      <view class="right" wx:if="{{item.name == 'MSP_ACCOUNT_PAY' && item.checked}}"  bindtap="toChoiceMspCard">
        <view>余额企业名称显示</view>
        <view class="money">
            {{state.accountDetail.companyName}}<image class="right-point" src="{{state.imagesPath.iconRight2}}" ></image>
        </view>
      </view>
    </view>
   
   
    <image class="isChecked" src="{{item.checked ? state.imagesPath.orderSelected : state.imagesPath.iconUnchecked}}" ></image>
  </view>
  
</view> -->
<view class="bottom-box">
  <button v-if="state.type != 'payTail'" :class="'btn ' + (state.canBuy ? 'available' : 'unusable')" :style="'background: ' + (state.canBuy ? state.themeColor : '#DCDCDC')" @click="toPayment">确认支付￥{{state.order.cashTotal}}</button>
  <button v-else :class="'btn ' + (state.canBuy ? 'available' : 'unusable')" :style="'background: ' + (state.canBuy ? state.themeColor : '#DCDCDC')" @click="toPayment">确认支付￥{{state.order.balanceTotal}}</button>
</view>
<view class="modal-box" :hidden="!state.modal" @click="clickBlank">
  <view class="modal-body" @click.stop="clickBody">
    <view class="modal-content card">
      <view class="title">请输入储值支付密码</view>
      <view class="close">
        <image @click.stop="clickBlank" :src="state.imagesPath.iconCloseImg2"></image>
      </view>
      <view class="content">
        <input maxlength="6" password="true" :focus="state.focus" :value="state.password" confirm-type="done" @input="handlePassword">
        <view class="forget-password" :style="'color: ' + state.themeColor" @click="handleResetPassword">忘记密码？</view>
      </view>
      <view class="button-box">
        <button class="confirm" :style="'background: ' + state.themeColor" @click="toCardPay">确认支付</button>
      </view>
    </view>
  </view>
</view>
<popup :show="state.show.middle" position="middle" custom-class="middle" @close="toggleMiddlePopup">
  <view class="popup-content">
    <view class="popup-content-box">
      <image :src="state.imagesPath.iconNetworkTimeout" mode="widthFix"></image>
    </view>
    <view class="button" :style="'background: ' + state.themeColor" @click="toggleMiddlePopup">我知道了</view>
  </view>
</popup>

<popup :show="state.show.pass" position="middle" custom-class="middle" @close="toggleNumberPopup">
    <view class="number-modal-body">
        <view class="number-modal-contentA">
            <view class="title">抱歉，此次订单中的以下商品已不能购买</view>
            <view class="content">
                <view class="goods-list">
                    <view class="goods-item-box" v-for="(item , index) in passProductActive" :key="index">
                        <view class="goods-item">
                            <view class="goods-img">
                                <image :src="item.imageUrl" mode="aspectFit"></image>
                            </view>
                            <view class="goods-info">
                                <view class="goods-left">
                                    <view class="goods-name">{{item.name}}</view>
                                    <view class="goods-desc" v-if="item.mealDetails && item.mealDetails">
                                        {{item.mealDetails}}</view>
                                    <view class="goods-label" v-else-if="item.labelName">{{item.labelName}}</view>
                                    <view class="goods-desc" v-else>{{item.specs ? item.specs : ''}}</view>
                                    <view class="goods-desc" v-if="item.deliveryTimeStatement" style="color: #ff9f43;">
                                        {{item.deliveryTimeStatement ? item.deliveryTimeStatement : ''}}</view>
                                    <view class="goods-price" v-else-if="state.orderType === 'advanceSell'"></view>
                                    <view class="goods-price" v-else>
                                        <text class="nowPrice">￥{{item.price}}</text>
                                    </view>
                                
                                </view>
                                <view class="goods-right">
                                    <view class="goods-count">
                                        x{{item.productNum}}</view>
                                
                                </view>
                            </view>
                        </view>
                        <view style="color: salmon;margin-bottom: 14rpx;">
                            备注：{{item.remark}}
                        </view>
                    </view>
                </view>
            </view>
            <view class="button-box">
                <button class="cancel" :data-id="goodsInfo.id" @click.stop="onCancelA">取消</button>
                <button class="confirm" :style="theme.mainBgColor" :data-id="goodsInfo.id" @click.stop="onCancelA">确定</button>
            </view>
        </view>
    </view>
</popup></view>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _apiRedPacketServiceJs from "@/service/api/newretail/redPacketService";
import _apiAdvanceSellServiceJs from "@/service/api/newretail/advanceSellService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/payMethod/payMethod.js
const orderService = _apiOrderServiceJs;
const sysService = _apiSystemServiceJs;
const memberService = _apiMemberServiceJs;
const advanceSellService = _apiAdvanceSellServiceJs;
const redPacketService = _apiRedPacketServiceJs;
const couponService = _apiCouponServiceJs;
const request = _apiRequestJs;
const utils = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const state = reactive({
  isStoredPayment: true,
  showPassFlag: false,
  navigationBarTitle: "支付方式",
  imagesPath: IMGAGESPATH,
  currentItem: -1,
  balance: 0,
  order: {
    id: '',
    cashTotal: 0
  },
  accountDetail: {},
  password: '',
  type: 'normal',
  orderType: 'normal',
  from: 'shopCart',
  modal: false,
  focus: false,
  orderPay: false,
  orderCancel: false,
  canBuy: false,
  cardPay: false,
  cardAmount: 0,
  cardPayChoose: true,
  payments: {
    cardPay: {
      total: 0
    },
    wxPay: {
      total: 0
    }
  },
  payMethods: [{
    id: 0,
    name: 'CARDPAY',
    value: '余额支付',
    imageUrl: IMGAGESPATH.iconCardPay,
    checked: false,
    isShow: true
  },
  // {
  //     id: 0,
  //     name: 'MSP_ACCOUNT_PAY',
  //     value: '余额支付',
  //     imageUrl: IMGAGESPATH.iconCardPay,
  //     checked: false,
  //     isShow: true
  // },
  {
    id: 1,
    name: 'WXPAY',
    value: '微信支付',
    imageUrl: IMGAGESPATH.iconWexinPay,
    checked: false,
    isShow: true
  }],
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false
  },
  orderTimeId: 0,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor')
});
async function getPaymentMethod() {
  try {
    let paymentMethodList = ['paymentMethod', 'isStoredPayment'];
    await sysService.query(paymentMethodList.join(',')).then(res => {
      if (res && res.length > 0) {
        res.forEach(item => {
          if (item.key == 'paymentMethod' && item.value) {
            app.globalData.paymentMethod = item.value;
            state.paymentMethod = item.value;
          } else {
            item.key = item.value == 'FALSE' ? false : true;
          }
        });
      }
    }).catch(err => {});
  } catch (e) {}
}
function handleResetPassword() {
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/myCard/resetPassword/resetPassword?active=1'
  });
  // NAVPAGE.toResetPassword();
}
function handlePassword(e) {
  if (e.detail.value) {
    state.password = e.detail.value;
  }
}
function clickBlank() {
  state.modal = false;
  state.canBuy = true;
}
function clickBody() {}
function onPayClick(val) {
  let that = this;
  let id = val.currentTarget.dataset.id;
  let payMethod = val.currentTarget.dataset.name;
  let payMethods = state.payMethods;
  let payments = state.payments;
  const type = state.type;
  const orderType = state.orderType;
  // 判断当前订单是普通订单还是预售订单
  if (orderType !== 'advanceSell') {
    // 普通订单逻辑
    if (payMethod === 'CARDPAY') {
      // 余额支付
      if (state.cardPayChoose) {
        if (!payMethods[0].checked) {
          // 未选择储值支付
          if (state.balance > 0) {
            if (state.balance > state.order.cashTotal) {
              state.payments.cardPay.total = state.order.cashTotal;
              state.payMethods[0].checked = true;
              state.payMethods[1].checked = false;
              state.canBuy = true;
            } else {
              if (app.globalData.multiplePayment) {
                state.payments.cardPay.total = state.balance;
                state.payMethods[0].checked = true;
              } else {
                state.payments.cardPay.total = 0;
                state.payMethods[0].checked = false;
                state.password = '';
              }
            }
          } else {
            state.payments.cardPay.total = 0;
            state.payMethods[0].checked = false;
            state.password = '';
            if (!payMethods[1].checked) {
              // 当前只选择了余额支付，没有选择微信支付，无法支付订单
              state.canBuy = false;
            }
          }
        } else {
          state.payments.cardPay.total = 0;
          state.payMethods[0].checked = false;
          state.password = '';
          if (!payMethods[1].checked) {
            state.canBuy = false;
          }
        }
      } else {
        // 订单支付方式中已经包含余额支付，用户已经储值预付款，用户不能取消储值支付，只能继续选择微信支付,不能操作储值支付
        console.log("订单支付方式中已经包含余额支付，用户已经储值预付款，用户不能取消储值支付，只能继续选择微信支付,不能操作储值支付");
      }
    } else if (payMethod === 'MSP_ACCOUNT_PAY') {
      // 余额支付

      if (!payMethods[0].checked) {
        // 未选择储值支付
        state.payMethods[0].checked = true;
        state.payMethods[1].checked = false;
        state.canBuy = true;
      } else {
        state.payments.cardPay.total = 0;
        state.payMethods[0].checked = false;
        state.password = '';
        if (!payMethods[1].checked) {
          state.canBuy = false;
        }
      }
    } else {
      // 微信支付
      if (!payMethods[1].checked) {
        // 未选择微信支付
        state.payMethods[1].checked = true;
        state.payMethods[0].checked = false;
        state.canBuy = true;
        if (state.balance > 0 && state.balance > state.order.cashTotal) {
          state.payments.cardPay.total = 0;
          state.payMethods[0].checked = false;
          state.password = '';
        }
      } else {
        // 取消选择微信支付
        if (payMethods[0].checked && state.balance >= state.order.cashTotal) {
          state.payMethods[1].checked = false;
          state.canBuy = true;
        } else {
          state.payMethods[1].checked = false;
          state.canBuy = false;
        }
      }
    }
  } else {
    // 预售订单逻辑
    let canBuy = false;
    payMethods.forEach(item => {
      // 处理余额支付相关情况
      if (payMethod === 'CARDPAY') {
        // 余额支付
        if (item.name == payMethod) {
          if (!item.checked) {
            // 没有选择储值支付

            payments.cardPay.total = state.order.balanceTotal;
            item.checked = !item.checked;
            canBuy = true;
          } else {
            item.checked = !item.checked;
            canBuy = false;
          }
        } else {
          item.checked = false;
        }
      } else {
        // 正常情况
        if (item.name == payMethod) {
          item.checked = !item.checked;
          if (item.checked) {
            canBuy = true;
          }
        } else {
          item.checked = false;
        }
      }
    });
    state.payMethods = payMethods;
    state.canBuy = canBuy;
    state.payments = payments;
  }
}
function toChoiceMspCard() {
  // 清空已选择的礼品卡数据
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/member/mealCard/mealCard?active=1'
  });
}
function getOrderDataById(id, dingdan) {
  const self = this;
  console.log('dingdan', dingdan);
  if (dingdan) {
    orderService.getDetailsById(id).then(res => {
      let tempData = {
        ...res
      };
      // http://jira.wmdigit.com/browse/NR-7106
      state.order = tempData;
      if (res.payments && res.payments.length > 0) {
        res.payments.forEach(item => {
          if (item.payMethod === 'CARDPAY' && item.status === 'PAID' && state.isStoredPayment) {
            state.payments.cardPay.total = item.total;
            state.cardAmount = item.total;
            state.payMethods[0].checked = true;
            state.cardPayChoose = false;
          }
        });
      }
      // 判断当前订单是否预售订单，预售订单只支持一种支付方式，不支持组合支付
      if (res.type == 'ADVANCE_SELL') {
        state.orderType = 'advanceSell';
        state.payMethods[0].checked = false;
        state.payMethods[0].isShow = false;
      }
      if (res.teamId) {
        state.orderType = 'group';
        state.groupInfo = {
          teamId: res.teamId,
          teamLeaderRecordId: ''
        };
      }
      if (res.cashTotal === 0) {
        // 订单金额为0 直接轮询
        getOrderStatusById(res.id, self);
      }
      return memberService.getMbrBalance();
    }).then(balance => {
      const order = state.order;
      state.balance = balance;
      if (balance > 0 && state.isStoredPayment) {
        if (state.type !== 'payTail' && state.orderType !== 'advanceSell') {
          if (balance >= order.cashTotal) {
            // 余额大于订单金额
            state.payMethods[0].checked = true;
            state.payments.cardPay.total = order.cashTotal;
            state.payMethods[1].checked = false;
            state.canBuy = true;
          } else {
            if (app.globalData.multiplePayment) {
              // 余额小于订单金额
              state.payMethods[0].checked = true;
              state.payments.cardPay.total = balance;
              state.currentItem = 1;
              state.payMethods[1].checked = true;
              state.canBuy = true;
            } else {
              state.payMethods[1].checked = true;
              state.canBuy = true;
            }
          }
        } else {
          state.payMethods[1].checked = true;
          state.canBuy = true;
        }
      } else {
        // 余额为0
        state.payMethods[1].checked = true;
        state.canBuy = true;
        state.payments.cardPay.total = 0;
        state.cardAmount = 0;
        state.payMethods[0].checked = false;
        state.payMethods[0].isShow = false;
      }
    }).catch(e => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {
    orderService.getDetailsById(id).then(res => {
      let tempData = {
        ...res
      };
      // http://jira.wmdigit.com/browse/NR-7106
      state.order = tempData;
      if (res.payments && res.payments.length > 0) {
        res.payments.forEach(item => {
          if (item.payMethod === 'CARDPAY' && item.status === 'PAID' && state.isStoredPayment) {
            state.payments.cardPay.total = item.total;
            state.cardAmount = item.total;
            state.payMethods[0].checked = true;
            state.cardPayChoose = false;
          }
        });
      }
      // 判断当前订单是否预售订单，预售订单只支持一种支付方式，不支持组合支付
      if (res.type == 'ADVANCE_SELL') {
        state.orderType = 'advanceSell';
        state.payMethods[0].checked = false;
        state.payMethods[0].isShow = false;
      }
      if (res.teamId) {
        state.orderType = 'group';
        state.groupInfo = {
          teamId: res.teamId,
          teamLeaderRecordId: ''
        };
      }
      if (res.cashTotal === 0) {
        // 订单金额为0 直接轮询
        getOrderStatusById(res.id, self);
      }
      return memberService.getMbrBalance();
    }).then(balance => {
      const order = state.order;
      state.balance = balance;
      if (balance > 0 && state.isStoredPayment) {
        if (state.type !== 'payTail' && state.orderType !== 'advanceSell') {
          if (balance >= order.cashTotal) {
            // 余额大于订单金额
            state.payMethods[0].checked = true;
            state.payments.cardPay.total = order.cashTotal;
            state.payMethods[1].checked = false;
            state.canBuy = true;
          } else {
            if (app.globalData.multiplePayment) {
              // 余额小于订单金额
              state.payMethods[0].checked = true;
              state.payments.cardPay.total = balance;
              state.currentItem = 1;
              state.payMethods[1].checked = true;
              state.canBuy = true;
            } else {
              state.payMethods[1].checked = true;
              state.canBuy = true;
            }
          }
        } else {
          state.payMethods[1].checked = true;
          state.canBuy = true;
        }
      } else {
        // 余额为0
        state.payMethods[1].checked = true;
        state.canBuy = true;
        state.payments.cardPay.total = 0;
        state.cardAmount = 0;
        state.payMethods[0].checked = false;
        state.payMethods[0].isShow = false;
      }
    }).catch(e => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
function getCouponOrderDetailsById(orderId) {
  const self = this;
  couponService.getCouponOrderById(orderId).then(res => {
    if (res) {
      let tempData = {
        cashTotal: res.price,
        id: res.id
      };
      state.order = tempData;
    }
    return memberService.getMbrBalance();
  }).then(balance => {
    const order = state.order;
    state.balance = balance;
    if (balance > 0 && state.isStoredPayment) {
      if (balance >= order.cashTotal) {
        // 余额大于订单金额
        state.payMethods[0].checked = true;
        state.payments.cardPay.total = order.cashTotal;
        state.canBuy = true;
      } else {
        // 余额小于订单金额
        if (app.globalData.multiplePayment) {
          state.payMethods[0].checked = true;
          state.payments.cardPay.total = balance;
          state.currentItem = 1;
          state.payMethods[1].checked = true;
          state.canBuy = true;
        } else {
          state.payMethods[1].checked = true;
          state.canBuy = true;
        }
      }
    } else {
      // 余额为0
      state.payMethods[1].checked = true;
      state.canBuy = true;
      state.payments.cardPay.total = 0;
      state.cardAmount = 0;
      state.payMethods[0].checked = false;
      state.payMethods[0].isShow = false;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toPayment() {
  const that = this;
  const order = state.order;
  const type = state.type;
  const payMethods = state.payMethods;
  let cardPay = false;
  let wxPay = false;
  payMethods.forEach(item => {
    if (item.name == 'CARDPAY' && item.checked) {
      cardPay = true;
    } else if (item.name == 'MSP_ACCOUNT_PAY' && item.checked) {
      if (state.cardPayActive) {
        cardPay = true;
      } else {
        uni.showToast({
          title: '您还没有设置余额密码,即将跳转',
          icon: 'none',
          success: function (params) {
            setTimeout(item => {
              NAVPAGE.toResetPassword('new');
            }, 2000);
          }
        });
        return;
      }
    } else if (item.name == 'WXPAY' && item.checked) {
      wxPay = true;
    }
  });
  if (state.canBuy) {
    state.canBuy = false;
    if (cardPay) {
      // 储值卡支付
      state.modal = state.showPassFlag;
      if (!state.showPassFlag) {
        toCardPay();
      }

      // 饭卡支付
      // if(this.data.cardNo){
      //     this.setData({
      //         modal: true
      //     })
      // }else{
      //     wx.showToast({
      //         title: '请选择余额~',
      //         icon: 'none',
      //         duration: 2000
      //     })
      //     return
      // }

      //    that.getCardPay(order)
    } else {
      if (wxPay) {
        // 判断是正常订单还是支付尾款
        if (type === 'payTail') {
          toPayTail(order);
        } else {
          if (order.type === "ADVANCE_SELL") {
            if (order.balanceTotal != null && order.balanceTotal > 0) {
              getUnifiedpay(order, "FIRST_ADVANCE_SELL");
            } else {
              getUnifiedpay(order);
            }
          } else {
            getWXPay(order);
          }
        }
      } else {
        state.canBuy = false;
        uni.showToast({
          title: '请选择支付方式~',
          icon: 'none',
          duration: 2000
        });
      }
    }
  } else {
    uni.showToast({
      title: '请选择支付方式~',
      icon: 'none',
      duration: 2000
    });
  }
}
function getWXPay(order) {
  const self = this;
  let total = parseFloat((parseFloat(order.cashTotal) - parseFloat(order.cardDeductTotal)).toFixed(2));
  total = total > 0 ? total : 0;
  let tempData = {
    orderId: order.parentId || order.id,
    payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
    entry: "ORDER",
    total: total
  };
  if (order.cashTotal === 0) {
    getOrderStatusById(order.id, self);
  } else {
    console.log('进入哪个？2');
    uni.showLoading({
      title: ''
    });
    orderService.getCashPaySign(tempData).then(res => {
      uni.hideLoading();
      wxPay(res, tempData);
    }).catch(err => {
      uni.hideLoading();
      let passProductActive = [];
      if (err.code == '16665') {
        let passProduct = JSON.parse(err.message);
        passProduct.map(item => {
          state.order.products.map(arr => {
            if (arr.productId == item.productId) {
              passProductActive.push({
                ...arr,
                ...item.remark
              });
              state.passProductActive = passProductActive;
            }
          });
        });
        toggle('pass');
        return;
      }
      if (err.code === -1001) {
        // 请求超时
        if (state.payMethods[0].checked === true && state.payments.cardPay.total > 0) {
          orderLock(order);
        }
        toggle('middle');
      } else {
        state.canBuy = true;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
}
function getPay(order) {
  const self = this;
  if (order.cashTotal === 0) {
    // self.toPaymentSuccess(order.id)
    getOrderStatusById(order.id, self);
  } else {
    let postData = {
      orderId: order.parentId || order.id,
      total: state.payments.cardPay.total
    };
    let tempData = {};
    let password = state.password;
    if (password !== '' || !state.showPassFlag) {
      postData = {
        ...postData,
        cardPayPassword: password,
        entry: "ORDER",
        payMethod: "CARDPAY"
      };
    }
    console.log('进入哪个？3');
    uni.showLoading({
      title: ''
    });
    orderService.getCashPaySign(postData).then(res => {
      console.log(res);
      let total = parseFloat((parseFloat(order.cashTotal) - parseFloat(state.payments.cardPay.total)).toFixed(2));
      total = total > 0 ? total : 0;
      tempData = {
        orderId: order.parentId || order.id,
        payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
        entry: "ORDER",
        total: total
      };
      state.cardAmount = state.payments.cardPay.total;
      state.cardPayChoose = false;
      return orderService.getCashPaySign(tempData);
    }).then(res => {
      uni.hideLoading();
      wxPay(res, tempData);
    }).catch(err => {
      uni.hideLoading();
      let passProductActive = [];
      if (err.code == '16665') {
        let passProduct = JSON.parse(err.message);
        passProduct.map(item => {
          state.order.products.map(arr => {
            if (arr.productId == item.productId) {
              passProductActive.push({
                ...arr,
                ...item.remark
              });
              state.passProductActive = passProductActive;
            }
          });
        });
        toggle('pass');
        return;
      }
      if (err.code === 44004) {
        that.inUserPay = false;
        state.password = '';
        state.canBuy = true;
        state.focus = true;
        state.modal = state.showPassFlag;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      } else if (err.code === -1001) {
        // 请求超时
        if (state.payMethods[0].checked === true && state.payments.cardPay.total > 0) {
          orderLock(order);
        }
        toggle('middle');
      } else {
        state.canBuy = true;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
}
function toCardPay() {
  if (inUserPay) {
    console.log("已经在支付中");
    return;
  }
  const that = this;
  const order = state.order;
  const orderType = state.orderType;
  const type = state.type;
  const payMethods = state.payMethods;
  let cardPay = false;
  let wxPay = false;
  payMethods.forEach(item => {
    if (item.name == 'CARDPAY' && item.checked) {
      cardPay = true;
    } else if (item.name == 'WXPAY' && item.checked) {
      wxPay = true;
    }
  });
  if (state.password !== '' || !state.showPassFlag) {
    state.modal = false;
    if (type !== 'payTail') {
      if (state.balance >= order.cashTotal) {
        // 订单金额等于
        getCardPay(order);
      } else {
        if (wxPay) {
          if (state.payments.cardPay.total > 0 && state.cardAmount === 0) {
            // 组合支付且订单没有使用过储值预付款
            getPay(order);
          } else {
            // 微信支付
            getWXPay(order);
          }
        } else {
          state.canBuy = false;
          uni.showToast({
            title: '请选择支付方式~',
            icon: 'none',
            duration: 2000
          });
        }
      }
    } else {
      if (state.balance >= order.balanceTotal) {
        // 储值卡金额等于尾款金额
        getCardPay(order);
      } else {
        state.canBuy = false;
        uni.showToast({
          title: '储值余额不够支付此订单，请选择微信支付~',
          icon: 'none',
          duration: 2000
        });
      }
    }
    // 饭卡支付逻辑
    // let postData = {
    //     password: this.data.password,
    //     memberId: app.globalData.userInfo.member.id
    // }

    // orderService.checkPassword(postData)
    //     .then(res => {
    //         if (res) {
    //             this.setData({
    //                 modal: false,
    //                 password: '',
    //             })
    //             // that.inUserPay = true;
    //             // that.userCardPay = false
    //             // that.toggleCardPasswordPopup()
    //             // // 调用储值卡支付
    //             // let order = this.data.order
    //             // console.log(order, 'orderorder');
    //             that.getCardPay(order)
    //         } else {
    //             this.setData({
    //                 password: '',
    //             })
    //             wx.showToast({
    //                 title: '密码不正确~',
    //                 icon: 'none'
    //             })
    //             // UTILS.showToast('密码不正确~')
    //         }
    //     }).catch(err=>{
    //         wx.showToast(err.message)
    //     })
  } else {
    uni.showToast({
      title: '请输入储值卡密码~',
      icon: 'none',
      duration: 2000
    });
    state.focus = true;
  }
}
function getCardPay(order) {
  const self = this;
  let postData = {
    orderId: order.id,
    total: order.cashTotal
  };
  let password = state.password;
  if (password !== '' || !state.showPassFlag) {
    postData = {
      ...postData,
      cardPayPassword: password,
      entry: "ORDER",
      payMethod: "CARDPAY"
    };
  }
  orderService.getCashPaySign(postData).then(res => {
    getOrderStatusById(order.id, self);
    orderLock(order);
  }).catch(e => {
    if (e.code === 44004) {
      inUserPay = false;
      state.password = '';
      state.canBuy = true;
      state.focus = true;
      state.modal = state.showPassFlag;
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    } else if (e.code === -1001) {
      // 请求超时
      orderLock(order);
      toggle('middle');
    } else {
      state.canBuy = true;
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    }
  });
  // self.orderLock(order)
}
function orderLock(order) {
  orderService.orderLock(order.id).then(res => {
    console.log(res);
  });
}
function getUnifiedpay(order, entry = "ORDER") {
  const self = this;
  let tempData = {
    orderId: order.parentId || order.id,
    payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
    entry: entry
  };
  if (entry === "FIRST_ADVANCE_SELL") {
    tempData = {
      ...tempData,
      total: order.cashTotal
    };
  } else {
    tempData = {
      ...tempData,
      total: order.cashTotal
    };
  }
  if (order.cashTotal === 0) {
    getOrderStatusById(order.id, self);
  } else {
    console.log('进入哪个？4');
    uni.showLoading({
      title: ''
    });
    orderService.getCashPaySign(tempData).then(res => {
      uni.hideLoading();
      wxPay(res, tempData);
    }).catch(err => {
      uni.hideLoading();
      let passProductActive = [];
      if (err.code == '16665') {
        let passProduct = JSON.parse(err.message);
        passProduct.map(item => {
          state.order.products.map(arr => {
            if (arr.productId == item.productId) {
              passProductActive.push({
                ...arr,
                ...item.remark
              });
              state.passProductActive = passProductActive;
            }
          });
        });
        toggle('pass');
        return;
      }
      if (err.code === -1001) {
        // 请求超时
        if (state.payMethods[0].checked === true && state.payments.cardPay.total > 0) {
          orderLock(order);
        }
        toggle('middle');
      } else {
        state.canBuy = true;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
}
function toPayTail(order) {
  const that = this;
  let tempData = {
    orderId: state.order.parentId || state.order.id,
    payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
    entry: "BALANCE_ADVANCE_SELL",
    total: state.order.balanceTotal
  };
  advanceSellService.getBalanceOrderByOrderId(state.order.parentId).then(res => {
    tempData.orderId = res.id;
    console.log('进入哪个？5');
    uni.showLoading({
      title: ''
    });
    return orderService.getCashPaySign(tempData);
  }).then(res => {
    console.log(res);
    tempData.orderId = state.order.id;
    uni.hideLoading();
    wxPay(res, tempData);
  }).catch(err => {
    uni.hideLoading();
    let passProductActive = [];
    if (err.code == '16665') {
      let passProduct = JSON.parse(err.message);
      passProduct.map(item => {
        self.data.order.products.map(arr => {
          if (arr.productId == item.productId) {
            passProductActive.push({
              ...arr,
              ...item.remark
            });
            self.setData({
              passProductActive
            });
          }
        });
      });
      self.toggle('pass');
      return;
    }
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function onCancelA() {
  state.canBuy = true;
  toggle('pass');
}
function toPaymentSuccess(orderId) {
  state.orderPay = true;
  if (state.orderType !== 'group') {
    if (state.order.type === "SOLITAIRE") {
      const solitaireId = state.order.solitaireId;
      if (state.path === "perfectOrder") {
        try {
          uni.setStorageSync("wj_solitaire_" + solitaireId, {
            solitaireId: solitaireId
          });
        } catch (error) {
          console.log(error);
        }
        uni.navigateBack({
          delta: 1
        });
      } else {
        try {
          uni.setStorageSync("wj_solitaire_" + solitaireId, {
            solitaireId: solitaireId
          });
        } catch (error) {
          console.log(error);
        }
        const opts = "?id=" + solitaireId + "&from=order";
        NAVPAGE.toSolitaireDetails(opts);
      }
    } else {
      uni.redirectTo({
        url: '/pages-sub/newretail/pages/mallModule/pay/payment/payment?orderId=' + orderId + '&from=' + options.from + '&orderType=' + state.orderType
      });
    }
  } else {
    uni.redirectTo({
      url: '/pages-sub/newretail/pages/mallModule/fightGroup/groupPurchase/groupPurchase?orderId=' + orderId + '&from=orderPay'
    });
  }
}
function wxPay(paySign, postData) {
  const self = this;
  let resData = JSON.parse(paySign);
  let sign = JSON.parse(resData.sign);
  let packageValue = '';
  if (postData.payMethod === 'SWIFTPASS' || postData.payMethod === 'DINGFUTONG') {
    packageValue = sign.package;
  } else if (postData.payMethod === 'WX_MINI_APP' || postData.payMethod === 'WXA_ISV_PAY') {
    packageValue = sign.packageValue;
  }
  uni.requestPayment({
    'timeStamp': sign.timeStamp,
    'nonceStr': sign.nonceStr,
    'package': packageValue,
    'signType': sign.signType,
    'paySign': sign.paySign,
    'success': function (res) {
      getOrderStatusById(postData.orderId, self);
      let order = {
        id: postData.orderId
      };
      orderLock(order);
    },
    'fail': function (res) {
      console.log('支付失败-----------------');
      state.canBuy = true;
      if (res.errMsg.indexOf("cancel") >= 0) {
        // 取消订单
        uni.showToast({
          title: '您取消了支付订单~',
          icon: 'none',
          duration: 2000
        });
        state.password = '';
      } else {
        uni.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        });
      }
      if (options.from === 'shopCart') {
        state.orderCancel = true;
        uni.redirectTo({
          url: '/pages-sub/newretail/pages/mallModule/order/orderDetails/orderDetails?orderId=' + postData.orderId + '&orderFrom=shopCart&orderType=' + state.orderType
        });
      }
    }
  });
}
function handleGetOrderStatusById(orderId, amount, self) {
  uni.showLoading({
    title: '支付中'
  });
  orderService.getOrderStatusById(orderId).then(result => {
    console.log('查询交易结果-------------');
    console.log(result);
    amount++;
    console.log(amount);
    if (amount > 40) {
      utils.setHideLoading(false);
      uni.hideLoading();
      // 弹出支付超时
      self.toggle('middle');
      return;
    }
    if (result.status === 'PAID' || result.status === 'WAITPAYBALANCE' || result.status === 'PENDING' || result.status === 'WAITSHIPPED' || result.status === 'RECEIVED' || result.status === "SHIPPED") {
      utils.setHideLoading(false);
      uni.hideLoading();
      uni.showToast({
        title: '支付成功',
        icon: 'none',
        duration: 2000
      });
      // 跳转到成功页面
      toPaymentSuccess(orderId);
    } else {
      let orderTimeId = setTimeout(() => {
        utils.setHideLoading(true);
        // 如果没有成功，调用函数本身，实现重复查询
        self.handleGetOrderStatusById(orderId, amount, self);
      }, 2000);
      state.orderTimeId = orderTimeId;
    }
  }).catch(err => {
    uni.showToast({
      title: err.errMsg,
      icon: 'none',
      duration: 2000
    });
  });
}
function getOrderStatusById(orderId, self) {
  let amount = 0;
  // self.handleGetOrderStatusById(orderId, amount, self);
  setTimeout(() => {
    self.handleGetOrderStatusById(orderId, amount, self);
  }, 1000);
}
onLoad(function (options) {
  uni.hideShareMenu();
  console.log(options);
  state.orderType = options.orderType;
  state.type = options.type;
  state.from = options.from;
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  if (options.orderId) {
    if (options.from === 'coupon') {
      console.log(options, 'coupon');
      getCouponOrderDetailsById(options.orderId);
    } else {
      console.log(options, '1');
      getOrderDataById(options.orderId, options.dingdan);
    }
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
function getMspAccountDetailA(cardNo) {
  let data = {
    cardNo
  };
  let that = this;
  couponService.getMspAccountDetail(data).then(res => {
    if (res) {
      state.accountDetail = res;
      uni.setStorageSync('wj_cardno', '');
    }
  });
}
onShow(async function () {
  // let that = this;
  await getPaymentMethod();
  // 饭卡逻辑注释
  // memberService.getLoginMember().then(res => {
  //     if (res.isMspPassword) {
  //         that.setData({
  //             cardPayActive: true
  //         })
  //     } else {
  //         that.setData({
  //             cardPayActive: false
  //         })
  //     }
  // }).catch(err => {
  //     util.showToast(err.message)
  // })
  // let cardNo = wx.getStorageSync('wj_cardno')
  // if (cardNo) {
  //     this.setData({
  //         cardNo,
  //         'payMethods[0].checked': true,
  //         canBuy: true
  //     })
  //     this.getMspAccountDetailA(cardNo)
  // }
  state.showPassFlag = app.globalData.systemConfigure.isRechargePasswordEnabled;
});
onHide(function () {});
onUnload(function () {
  clearTimeout(state.orderTimeId);
  const that = this;
  if (!state.orderPay && !state.orderCancel) {
    if (options.from === 'shopCart') {
      let opts = '?orderId=' + state.order.id + '&orderFrom=shopCart&orderType=' + state.orderType;
      NAVPAGE.toOrderDetails(opts);
    } else {}
  }
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function toggleMiddlePopup() {
  toggle('middle');
  state.orderPay = true;
  if (options.from === 'shopCart') {
    uni.redirectTo({
      url: '../../order/order/order'
    });
  } else {
    uni.navigateBack({
      delta: 1
    });
  }
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
</script>
<style scoped>
/* pages/payMethod/payMethod.wxss */
.top-info {
  /* min-height: 48rpx; */
  padding: 30rpx 40rpx;
  border-bottom: 20rpx solid #F4F5F9;
  font-size: 28rpx;
  line-height: 48rpx;
}

.top-info .total {
  color: #FF8561;
}

.content {
  padding: 0 40rpx;
  width: 100%;
  box-sizing: border-box;
}

.section {
  /* height: 99rpx; */
  border-bottom: 1rpx solid #dcdcdc;
  line-height: 99rpx;
  display: flex;
  justify-content: flex-start;
  position: relative;
}
.right-point {
    width: 12rpx !important;
    height: 23rpx !important;
    vertical-align: middle;
    margin-left: 30rpx;
  }
.section .left {
    /* width: 100%; */
  color: #1b1b1d;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.section .left image {
  width: 50rpx;
  height: 50rpx;
  margin-right: 26rpx;
}

.section .right {
    margin-left: 20rpx;
    font-size: 24rpx;
    line-height: 99rpx;
    color: #1b1b1d;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding-right: 40rpx;
    box-sizing: border-box;
    flex: 1 1 auto;
}

.section .right .money {
  font-size: 28rpx;
  color: #ff8561;
  font-weight: bold;
}

.isChecked {
  width: 32rpx;
  height: 32rpx;
  position: absolute;
  right: 0;
  top: 37rpx;
}

.bottom-box {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0 40rpx;
  box-sizing: border-box;
  height: 120rpx;
  border-top: 1rpx solid #dcdcdc;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 9;
}

.bottom-box button.btn {
  height: 100rpx;
  width: 100%;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 100rpx;
  border-radius: 6rpx;
}

.available {
  background: #009f55;
}

.unusable {
  background: #DCDCDC;
}

.bottom-box button::after {
  border: 0;
  border-radius: 0;
}

/* 弹出框 */
.modal-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

.modal-body {
  position: relative;
}

.modal-content {
  background: #ffffff;
  width: 670rpx;
  /* height: 520rpx; */
  padding: 0;
  box-sizing: border-box;
  border-radius: 8rpx;
  overflow: hidden;
  margin: 40% auto;
  position: relative;
}

.modal-body .modal-content.card {
  width: 670rpx;
  height: 502rpx !important;
}

.modal-body .modal-content.score {
  min-height: 520rpx !important;
}

.modal-content .title {
  color: #777777;
  font-size: 34rpx;
  line-height: 94rpx;
  height: 94rpx;
  text-align: center;
  border-bottom: 1rpx solid #f5f5f5;
}

.modal-content .content {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #676666;
  padding: 0 40rpx;
  margin-top: 76rpx;
}

.modal-content .content .uesd {
  color: #ffaf61;
  margin-bottom: 18rpx;
}

.modal-content .content input {
  border: 1rpx solid #eff1f3;
  background: #f5f5f9;
  height: 90rpx;
  font-size: 28rpx;
  line-height: 90rpx;
  box-sizing: border-box;
  width: 592rpx;
  border-radius: 8rpx;
  padding: 0 0 0 27rpx;
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

.card .content .forget-password {
  color: #009f55;
  float: right;
  font-size: 30rpx;
  line-height: 62rpx;
  margin-top: 16rpx;
}

.button-box {
  display: flex;
  width: 100%;
  height: 100rpx;
  position: absolute;
  bottom: 0;
}

.button-box button {
  flex: 1;
  font-size: 32rpx;
  height: 100rpx;
  font-weight: bold;
  line-height: 100rpx;
  background: #ffffff;
  border-radius: 0;
  border: none;
}

button::after {
  border: none;
}

.button-box .confirm {
  background: #009f55;
  color: #ffffff;
}

.button-box .cancel {
  box-sizing: border-box;
  color: #8a8989;
  border-top: 1rpx solid #e5e5e5;
}

.card .close {
  width: 88rpx;
  height: 88rpx;
  position: absolute;
  right: 0;
  top: 0;
}

.card .close image {
  position: absolute;
  width: 44rpx;
  height: 44rpx;
  right: 40rpx;
  top: 30rpx;
}

.popup-content {
  width: 670rpx;
  height: 500rpx;
  background: #ffffff;
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
  color: #FFFFFF;
  text-align: center;
  background: #009F55;
  border-bottom-left-radius: 6rpx;
  border-bottom-right-radius: 6rpx;
  position: absolute;
  bottom: 0;
  left: 0;
}

/* pages/perfectOrder/perfectOrder.wxss */

page {
    background-color: #f4f4f4;
    padding-bottom: 130rpx;
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
  
  .color-454545 {
    color: #454545;
  }
  
  .right-point {
    width: 12rpx;
    height: 23rpx;
    vertical-align: middle;
  }
  

  

  
  .seat-box {
    height: 32rpx;
  }
  
  /* 配送方式 */
  
  .type-check-box {
    height: 100rpx;
    padding: 0 14rpx 20rpx 14rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #fff;
  }
  
  .type-check-box>view {
    border: 1px solid;
    border-radius: 6rpx;
    height: 70rpx;
    width: 190rpx;
    font-size: 24rpx;
    line-height: 70rpx;
    margin-right: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .type-check-box>view.active {
    border-color: #fbbe35;
    color: #fbbe35;
  }
  
  .type-check-box>view image {
    width: 33rpx;
    height: 33rpx;
    margin-right: 10rpx;
  }
  
  .type-check-box .self-take image {
    width: 25rpx;
    height: 36rpx;
  }
  
  .type-check-box>view:last-of-type {
    margin-right: 0;
  }
  
  .color-line {
    width: 100%;
    height: 10rpx;
    display: block;
  }
  
  .receive-box {
    display: flex;
    padding: 18rpx 0;
    background: #fff;
    border-top: 1rpx solid #f1f1f1;
  }
  
  .receive-box.distribution {
    border-top: none;
  }
  
  .receive-box .icon-box {
    width: 53rpx;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    float: left;
  }
  
  .receive-box .icon-box image {
    width: 33rpx;
    height: 39rpx;
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
  
  /* 门店信息 */
  
  .store-info {
    border-top: 2rpx dotted #e6e6e6;
    position: relative;
    min-height: 100rpx;
    padding: 20rpx 0 36rpx 0;
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
  
  .store-info .store-details>view {
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
    width: 15rpx;
    height: 26rpx;
    margin-left: 9rpx;
  }
  
  .store-info .store-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #454545;
  }
  
  .store-info .open-map {
    font-size: 24rpx;
  }
  
  /* 商品信息 */
  
  .goods-box {
    background: #fff;
    width: 672rpx;
    /* min-height: 692rpx; */
    padding: 0 20rpx 10rpx 20rpx;
    margin: 20rpx auto;
    background: #fff;
    border-radius: 4rpx 4rpx 0px 0px;
  }
  
  .title-box {
    font-size: 32rpx;
    font-weight: 500;
    color: #242424;
    height: 90rpx;
    line-height: 90rpx;
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
    height: 108rpx;
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
    height: 108rpx;
    width: calc(100% - 128rpx);
    position: relative;
    display: flex;
    justify-content: space-between;
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
    max-width: 360rpx;
    display: block;
    line-height: 40rpx;
  }
  
  .goods-info .goods-name {
    font-size: 32rpx;
    line-height: 38rpx;
    height: 38rpx;
    color: #333;
    margin-top: 2rpx;
    font-weight: 400;
  }
  
  .goods-info .goods-desc {
    font-size: 22rpx;
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
    background: #FF5757;
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
    line-height: 80rpx;
    font-weight: bold;
  }
  
  .goods-price {
    font-size: 28rpx;
    line-height: 36rpx;
    color: #333;
  }
  
  .goods-price .nowPrice {
    font-weight: bold;
  }
  
  .goods-price .oldPrice {
    font-size: 20rpx;
    color: #454545;
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
    border: 1rpx solid #f1f1f1;
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
  
  .goods-info .goods-count-box view {
    width: 56rpx;
    height: 56rpx;
    text-align: center;
    font-size: 40rpx;
    background: #f1f1f1;
    color: #009136;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .viewMore {
    width: 146rpx;
    height: 50rpx;
    border: 1px solid #cdcdcd;
    box-sizing: border-box;
    font-size: 24rpx;
    color: #454545;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28rpx auto;
  }
  
  .viewMore image {
    width: 17rpx;
    height: 10rpx;
    margin-left: 6rpx;
  }
  
  .dividing-line {
    width: 712rpx;
    height: 26rpx;
    position: relative;
    left: 50%;
    margin-left: -356rpx;
  }
  
  .dividing-line image {
    width: 100%;
    height: 100%;
  }
  
  /* 促销相关（返券、赠品） */
  .promotions-box {
    background: rgba(255, 102, 102, 0.1);
    width: 672rpx;
    padding: 20rpx;
    margin-left: -20rpx;
    margin-bottom: -10rpx;
  }
  
  .promotions-box .promotions-item {
    display: flex;
    align-items: center;
    height: 58rpx;
  }
  
  .promotions-box .promotions-item .label {
    width: 50rpx;
    height: 30rpx;
    background: #FF9F43;
    border-radius: 4rpx;
    font-size: 20rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 30rpx;
    text-align: center;
    margin-right: 14rpx;
  }
  
  .promotions-box .promotions-item .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 380rpx;
    font-size: 26rpx;
    color: #FF6666;
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
  
  .section-box .left {
    color: #333333;
    font-size: 28rpx;
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
    border: 1rpx solid;
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
    background: url('http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/xianfengImages/iconUnchecked.png') no-repeat center;
    background-size: 100% 100%;
  }
  
  .checkbox-icon.active {
    width: 32rpx;
    height: 32rpx;
    background: url('https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/UI/xianfeng/iconChecked.png') no-repeat center;
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
  
  /* 发票模块 */
  
  .invoice-box {
    height: 80rpx;
    padding: 0 40rpx;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    color: #454545;
  }
  
  /* 账单明细 */
  
  .bill-details {
    height: 80rpx;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 20rpx;
  }
  
  .bill-details view.discount-amounts {
    font-size: 24rpx;
    color: #8b8b8c;
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
    color: #FD463B;
  }
  
  .block-box {
    background: #fff;
    width: 674rpx;
    padding: 0 20rpx;
    margin: 0 auto 18rpx auto;
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
    font-size: 32rpx;
    color: #242424;
    font-weight: 500;
  }
  
  .row .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  
  .row .right .info {
    margin-right: 20rpx;
    font-size: 28rpx;
    color: #b2b2b2;
    font-weight: 400;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 446rpx;
    text-align: right
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
    padding: 10rpx 38rpx 10rpx 27rpx;
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
    width: 325rpx;
    height: 100rpx;
    color: #fff;
    text-align: center;
    line-height: 100rpx;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 6rpx;
    padding: 0;
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
    font-size: 24rpx;
    color: #454545;
    line-height: 48rpx;
    font-weight: bold;
  }
  
  .bottom-box>view text {
    display: block;
  }
  
  .bottom-box>view text:first-of-type {
    color: #ff7121;
    font-size: 40rpx;
    position: relative;
    padding-right: 22rpx;
    margin-right: 20rpx;
  }
  
  .bottom-box>view:first-of-type>view:last-of-type {
    font-size: 24rpx;
    color: #999;
  }
  
  /* 自提时间 */
  
  .time-picker {
    width: 100%;
    background: #fff;
  }
  
  .time-picker>view {
    height: 94rpx;
    line-height: 94rpx;
    font-size: 28rpx;
    border-top: 2rpx dotted #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #4d4d4d;
    text-align: right;
    position: relative;
    /* padding-right: 36rpx; */
  }
  
  .time-picker>view view {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  
  .time-picker>view .left-icon {
    width: 34rpx;
    height: 34rpx;
    margin: 0 16rpx 0 4rpx;
  }
  
  .time-picker text.self-time {
    margin-right: 40rpx;
  }
  
  .time-picker .right-point {
    margin-top: 0;
    margin-left: 30rpx;
  }
  
  .delivery-time-box {
    height: 150rpx;
    background: #fff;
    padding: 22rpx 0 26rpx 0;
    box-sizing: border-box;
    border-top: 2rpx dotted #e6e6e6;
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
  }
  
  /* 拼团自提时间时间点样式 */
  
  .delivery-time-box.time-point {
    height: 94rpx;
    padding: 0;
  }
  
  .time-point .time-picker>view {
    border-top: none;
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
    color: #fff;
  }
  
  .button-box .cancel {
    box-sizing: border-box;
    color: #8a8989;
    border-top: 1rpx solid #e5e5e5;
  }
  
  .score-amount {
    font-size: 28rpx !important;
    line-height: 42rpx;
    margin: 22rpx 0;
  }
  
  .modal-content .content .score-amount>text {
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
    font-weight: bold;
    text-align: center;
  }
  
  .selftake-remind {
    font-size: 24rpx;
    line-height: 84rpx;
    background: #fff;
    text-align: left;
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
  
  /* 弹出框 */
  
  .number-modal-box {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 8;
  }
  
  .number-modal-body {
    position: relative;
  }
  
  .number-modal-content {
    background: #fff;
    width: 624rpx;
    padding: 36rpx 0 0 0;
    min-height: 356rpx;
    box-sizing: border-box;
    border-radius: 18rpx;
    overflow: hidden;
    /* margin: 40% auto; */
    position: relative;
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
  
  .number-modal-content .content .count-box>view {
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
  
  .number-modal-content .content .count-box>input {
    width: 194rpx;
    height: 100%;
    border: none;
    text-align: center;
    padding: 0;
    color: #313131;
    font-size: 48rpx;
  }
  
  .number-modal-content .content .count-box>view:first-of-type {
    border-right: 1rpx solid #ddd;
  }
  
  .number-modal-content .content .count-box>view:last-of-type {
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
    color: #8B8B8C;
  }
  
  .pay-item .right .deduction-amount {
    color: #FD463B;
    font-weight: bold;
    margin: 0 12rpx 0 12rpx;
    font-size: 28rpx;
  }
  
  .pay-item .right .amount-box {
    color: #FD463B;
    font-weight: bold;
    font-size: 28rpx;
  }
  .pay-item .right.coupon {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  
  .pay-item .right.coupon .text {
    color: #B3B3B3;
  }
  
  .pay-item .right .coupon-amount-box {
    position: relative;
    font-size: 28rpx;
    color: #FFFFFF;
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
      color: #333333;
    height: 41rpx;
    /* background: rgba(253, 70, 59, 0.9); */
    position: relative;
  }
  
  .pay-item .right.coupon .right-point {
    margin-left: 20rpx;
  }
</style>