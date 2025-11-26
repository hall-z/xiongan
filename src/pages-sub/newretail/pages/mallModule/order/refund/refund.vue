<template>
<!--pages/refund/refund.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="refund-main" v-if="state.type === 'submit'">
    <view class="refund-order" v-if="state.supportPartReturn || state.orderType === 'CYCLE'">
      <view class="order-number">
        <checkbox-group @change="checkboxAllChange" class="check-box">
          <label class="checkbox" for="checkAll">
            <checkbox value="all" :checked="checkedAll" :disabled="state.orderType === 'CYCLE'"> 订单号：{{state.orderId}}
          </checkbox></label>
        </checkbox-group>
      </view>
      <view class="goods-box portion-refund">
        <checkbox-group @change="checkboxChange">
          <view class="goods-item-box" v-for="(item , index) in state.goodsList" :key="index">
            <view class="goods-item">
              <checkbox :disabled="state.packagingId || state.orderType === 'COMPOSE' || item.productNum === 0 || state.orderType === 'CYCLE'" :value="item.id" :checked="item.checked">
              <image :src="item.imageUrl"></image>
              <view class="goods-info">
                <view class="goods-name" v-if="!item.giftProduct">{{state.orderType === 'CYCLE' ? state.orderDetails.activityName + 'x' + item.cycleFixedName : item.name}}</view>
                <!-- <view class="goods-desc" wx:if="{{orderType === 'CYCLE'}}">{{item.cycleFixedName}}</view> -->
                <view class="goods-name" v-if="item.giftProduct"><text class="label">赠品</text><text class="name">{{item.name}}</text>
                  </view>
                  <view class="goods-detail-info" v-if="item.style === 'MEALS2'">
                    <text v-for="(item , index) in item.list" :key="index">{{item.groupProductCount}}x{{item.productName}}</text>
                </view>
                <view class="goods-count">
                  <text class="nowPrice" v-if="!item.giftProduct">￥{{item.price}}</text>
                  <text v-if="state.orderType !== 'CYCLE'">x{{item.productNum}}</text>
                  <text v-else>x{{!item.giftProduct ? item.productNum * (state.orderDetails.childOrder.length - state.refundAmount) : item.productNum}}</text>
                  <!-- <text class="refund-num" wx:if="{{item.refundedCount}}">已退{{item.refundedCount}}</text> -->
                </view>
                <view class="price-number">
                  <view class="count-box" v-if="item.productNum > 0">
                    <view :data-id="item.id" @click.stop="handleReduce" :style="'color:' + (state.orderType === 'CYCLE' ? '#BBBBBC' : item.productNumber > 1 ? '#009136' : '#BBBBBC')" :hidden="item.status === 'DELETED' || item.balance <= 0">-</view>
                    <text :data-id="item.id" :hidden="item.status === 'DELETED' || item.balance <= 0" @click.stop="handleNumber">{{item.productNumber}}</text>
                    <view :style="'color:' + (state.orderType === 'CYCLE' ? '#BBBBBC' : '#009136')" :data-id="item.id" @click.stop="handleAdd" :hidden="item.status === 'DELETED' || item.balance <= 0">+</view>
                  </view>
                </view>
              </view>
            </checkbox></view>
          </view>
        </checkbox-group>
      </view>
      <view class="order-info">
        <view class="goods-count">共 计：{{state.refundNumber}}件商品</view>
      </view>
    </view>
    <view class="refund-order" v-else>
      <view class="order-number">订单号：{{state.orderId}}</view>
      <view class="goods-box">
        <view class="goods-item" v-for="(item , index) in state.goodsList" :key="index" v-if="!item.giftProduct">
          <image :src="item.imageUrl"></image>
        </view>
      </view>
      <view class="gift-box gift-bottom-box" v-if="state.giftList.length > 0">
        <checkbox :checked="state.isCheckGift" :disabled="true" v-if="state.orderType === 'CYCLE'">
        <view class="gift-title">赠品:</view>
        <view class="gift-item-box">
          <view class="gift-item">
            <view class="gift-img-box" v-for="(item , idx) in state.giftList" :key="index" v-if="idx < 4">
              <image :src="item.imageUrl"></image>
            </view>
          </view>
          <view class="gift-num">x{{state.giftList.length}}</view>
        </view>
      </checkbox></view>
      <view class="order-info">
        <view class="goods-count">共 计：{{state.goodsList.length}}件商品</view>
        <view style="margin-left: 22rpx;">
          <view>合计：<text class="order-price">{{cashTotal}}</text></view>
          <view class="freight-info" v-if="shipmentAmount > 0">(含运费
            <text class="order-freight">￥{{shipmentAmount}}元</text>)</view>
        </view>
      </view>
    </view>
    <view class="order-box" v-if="state.orderType === 'CYCLE'">
      <view class="title">
        <view>申请明细</view>
        <view class="delivery-rt">
        </view>
      </view>
      <view class="delivery-list">
        <checkbox-group @change="changeDelivery" class="check-box">
          <view class="delivery-list-item" v-for="(item , index) in state.orderDetails.childOrder">
            <view class="item-lt-box">
                <checkbox :checked="item.checked" :value="item.id" :disabled="item.status === '已退款' || item.status === '退款中' || item.status === '部分退款'">
                <view class="item-lt">
                    <view>第{{item.cyclePhase}}期</view>
                    <view>{{state.orderDetails.cycleType === 'WEEK' ? '时间：' : item.cycleTimeName || ''}}  {{item.deliveryTime || ''}}（{{item.weekDay}}）</view>
                </view>
            </checkbox></view>
            <!-- <view class="item-rt edit" bindtap="doShowUpdateTime" data-id="{{item.id}}" wx:if="{{(item.status === '已付款' || item.status === '待自提' || item.status === '待发货') && !item.dlyThirdSuccess && item.isUpdateDeliveryTime}}" >
              去修改
            </view> -->
            <view class="item-rt">
              {{item.status}}
            </view> 
          </view>
        </checkbox-group>
      </view>
    </view>
    <view class="refund-box">
      <view class="refund-title">退款原因</view>
      <view class="redund-explain">
        <view class="redund-labels">
          <text v-for="(item , index) in state.labels" :class="item.select ? 'select' : ''" :style="'background: ' + (item.select ? state.themeColor : '') + ';border: 1rpx solid ' + (item.select ? state.themeColor : '') + ';'" :data-id="item.id" :key="index" @click="clickLabels">{{item.text}}</text>
        </view>
        <textarea class="redund-explain-con" id="explain-con" maxlength="200" auto-height="true" @input="handelTextArea" @blur="handelTextAreaBlur"></textarea>
        <view style="font-size: 26rpx; color: #8b8b8c">(补充详细信息以便快速处理)</view>
        <view class="refund-image">
          <image v-for="(item , index) in state.avatarUrl" :key="unique" :src="item"></image>
          <image :src="state.imagesPath.imgAddImg" class="submit-img" @click="chooseImage"></image>
        </view>
      </view>
    </view>
    <view class="bottom-box">
      <view class="order-price" v-if="state.supportPartReturn || state.orderType === 'CYCLE'"></view>
      <view class="order-price" v-else>￥{{cashTotal}}
        <text>按原路退回</text>
      </view>
      <button @click="refundSubmit" class="btn" :style="'background-color: ' + state.themeColor">提交申请</button>
    </view>
</view>
<view class="refund-success" v-if="state.type === 'success'">
  <image class="success-img" :src="state.imagesPath.iconRefundSuccess"></image>
  <text class="success-tips">申请退款提交成功</text>
  <button class="retuen-btn" :style="'background: ' + state.themeColor" @click="backOrder">返回订单详情</button>
</view>
</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsLogJs from "@/utils/newretail/log";
import _utilsSubscribeMessageJs from "@/utils/newretail/subscribeMessage";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/refund/refund.js
const orderService = _apiOrderServiceJs;
const sysService = _apiSystemServiceJs;
const request = _apiRequestJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const subscribeMessage = _utilsSubscribeMessageJs;
const log = _utilsLogJs;
const utils = _utilsUtilsJs;
const selfA = _utilsSelfJs;
const state = reactive({
  //   是否支持商品按数量退款 默认是
  isSupportPartReturn: null,
  navigationBarTitle: "申请退款",
  imagesPath: IMGAGESPATH,
  avatarUrl: null,
  imageUrls: [],
  goodsList: [],
  giftList: [],
  orderId: '',
  inputText: '',
  textAreaHidden: true,
  canRefund: true,
  refundNumber: 0,
  allRedund: false,
  labels: [{
    id: 0,
    text: '不想要了',
    select: false
  }, {
    id: 1,
    text: '购买的商品缺货',
    select: false
  }, {
    id: 2,
    text: '订单信息拍错（规格/尺码/颜色等）',
    select: false
  }, {
    id: 3,
    text: '商品破损',
    select: false
  }, {
    id: 4,
    text: '发货速度不满意',
    select: false
  }, {
    id: 5,
    text: '拍多了',
    select: false
  }, {
    id: 6,
    text: '其他',
    select: false
  }],
  type: 'submit',
  count: 5,
  supportPartReturn: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  isRefund: false,
  orderType: '',
  afterSaleType: '',
  // 退款类型
  packagingId: '',
  //是否一口价商品
  orderDetails: '',
  // 订单详情
  currentValue: [],
  // 当前选择退款的订单
  refundAmount: 0,
  // 已退款数量
  isCheckGift: false // 是否退赠品
});
function chooseImage() {
  let that = this;
  let count = state.count - state.imageUrls.length;
  if (count > 0) {
    uni.chooseImage({
      count: count,
      // 默认9
      sizeType: ['original', 'compressed'],
      // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        uni.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 200000
        });
        let filePaths = state.imageUrls;
        tempFilePaths.forEach((ele, index) => {
          if (res.tempFiles[index].size < 1024000) {
            //图片小于或者等于1M时 可以执行获取图片
            uni.uploadFile({
              url: request.BASE_URL + '/newretail/api/dfs/upload',
              //仅为示例，非真实的接口地址
              filePath: ele,
              name: 'file',
              formData: {
                'user': 'test'
              },
              header: {
                "wxa-appid": request.APP_ID
              },
              success: function (res) {
                try {
                  let data = res.data;
                  let tempData = JSON.parse(data);
                  console.log(tempData);
                  filePaths.push(tempData.data.url);
                  // that.data.imageUrls.forEach(async (item1, index1) => {
                  //     await selfA.getTemporaryUrl(item1)
                  //     .then (att=>{
                  //         that.data.avatarUrl[index1] = att ;
                  //         if(index1 >= that.data.avatarUrl.length - 1) {
                  //             that.setData({
                  //                 avatarUrl: that.data.avatarUrl
                  //             })
                  //         }
                  //     })
                  // })
                  state.avatarUrl = [...filePaths];
                  state.imageUrls = [...filePaths];
                  uni.hideToast();
                } catch (error) {
                  console.log(error);
                  uni.showToast({
                    title: error.message,
                    icon: 'none',
                    duration: 200000
                  });
                }
              },
              fail: function (e) {
                console.log(e.message);
              }
            });
          } else {
            uni.hideToast();
            uni.showToast({
              title: "上传图片大小不能超过 1MB哦~",
              icon: 'none',
              duration: 2000
            });
          }
        });
      }
    });
  } else {
    uni.showToast({
      title: '最多只能上传5张哦~',
      icon: 'none',
      duration: 200000
    });
  }
}
function clickLabels(val) {
  const that = this;
  let labels = state.labels;
  const id = val.currentTarget.dataset.id;
  labels.forEach((item, index) => {
    if (item.id === id) {
      if (item.select === false) {
        item = {
          ...item,
          select: true
        };
      } else {
        item = {
          ...item,
          select: false
        };
      }
      labels[index] = item;
      state.labels = labels;
    }
  });
}
function handelTextArea(e) {
  console.log(e.detail);
  if (e.detail.cursor < 200) {
    state.inputText = e.detail.value;
  } else if (e.detail.cursor === 200) {
    state.inputText = e.detail.value;
    uni.showToast({
      title: '详细信息最多不超过200个字符哦~',
      icon: 'none',
      duration: 2000
    });
  } else {}
}
function handelTextAreaBlur() {
  state.textAreaHidden = true;
}
function clickTextarea() {
  state.textAreaHidden = false;
}
function backOrder() {
  uni.navigateBack({
    delta: 1
  });
}
function refundSubmit() {
  console.log("点击触发事件");
  const that = this;
  if (state.canRefund) {
    let tempImageUrls = '';
    const imageUrls = state.imageUrls;
    const labels = state.labels;
    const inputText = state.inputText;
    if (imageUrls) {
      tempImageUrls = imageUrls.join(",");
    }
    let tempText = '';
    labels.forEach(item => {
      if (item.select) {
        if (tempText === '') {
          tempText = item.text;
        } else {
          tempText = tempText + ',' + item.text;
        }
      }
    });
    let goodsArr = state.goodsList;
    let giftList = state.giftList;
    let tempList = [];
    console.log(state.supportPartReturn, 'that.data.supportPartReturn');
    if (state.supportPartReturn) {
      goodsArr.forEach(item => {
        if (item.checked === true && (state.orderType !== 'CYCLE' || state.orderType === 'CYCLE' && state.isCheckGift)) {
          tempList.push({
            orderDetailsId: item.orderDetailsId,
            productNumber: item.productNumber
          });
        } else if (state.orderType == 'CYCLE') {
          if (!item.giftProduct) {
            tempList.push({
              orderDetailsId: item.orderDetailsId,
              productNumber: item.productNumber
            });
          }
        }
      });
    } else {
      goodsArr.forEach(item => {
        if (state.orderType === 'CYCLE') {
          if (state.isCheckGift) {
            tempList.push({
              orderDetailsId: item.orderDetailsId,
              productNumber: item.productNum
            });
          } else {
            if (!item.giftProduct) {
              tempList.push({
                orderDetailsId: item.orderDetailsId,
                productNumber: item.productNum
              });
            }
          }
        } else {
          tempList.push({
            orderDetailsId: item.orderDetailsId,
            productNumber: item.productNum
          });
        }
      });
    }
    if (inputText !== '' && inputText != null || tempText !== '') {
      let postData = {
        applyReason: state.inputText,
        descriptionImageUrls: tempImageUrls,
        //描述图片,以","分割
        orderId: state.orderId,
        refundDetails: tempList,
        afterSaleType: state.afterSaleType ? state.afterSaleType : 'REFUND'
      };
      if (tempText !== '') {
        let applyReason = postData.applyReason;
        if (applyReason !== '') {
          applyReason = tempText + ',' + postData.applyReason;
        } else {
          applyReason = tempText;
        }
        postData = {
          ...postData,
          applyReason: applyReason
        };
      }
      if (tempList.length > 0) {
        if (!state.isRefund) {
          // 查询订阅消息
          state.isRefund = true;
          if (app.globalData.templateIdsQuery) {
            handleSubscribeMessage();
          } else {
            subscribeMessage.getTemplateIds().then(res => {
              handleSubscribeMessage();
            }).catch(err => {
              createRefund();
              console.log(err.message);
              log.warn("查询模板id报错：", err.message);
            });
          }
          function handleSubscribeMessage() {
            let templateIds = [];
            templateIds = subscribeMessage.handleTemplateIds(subscribeMessage.scene.REFUND);
            console.log(templateIds);
            if (templateIds.length > 0) {
              if (uni.requestSubscribeMessage) {
                uni.requestSubscribeMessage({
                  tmplIds: templateIds,
                  success(res) {
                    console.log(res);
                    subscribeMessage.addSubscribe(subscribeMessage.scene.REFUND, res);
                    log.info(res);
                    createRefund();
                  },
                  fail(err) {
                    console.log(err);
                    log.warn(err);
                    createRefund();
                  }
                });
              } else {
                log.warn('api wx.requestSubscribeMessage 当前版本不支持');
                createRefund();
              }
            } else {
              log.info('模板id未获取到');
              createRefund();
            }
          }
          function createRefund() {
            uni.showLoading();
            inSubmit = true;
            if (state.packagingId) {
              postData.orderId = state.parentId;
              orderService.createOrderByParent(postData).then(res => {
                console.log(res);
                inSubmit = false;
                uni.hideLoading();
                state.navigationBarTitle = '退款申请';
                state.type = 'success';
              }).catch(error => {
                uni.hideLoading();
                inSubmit = false;
                console.log(error);
                state.isRefund = false;
                uni.showToast({
                  title: error.message,
                  icon: 'none',
                  duration: 2000
                });
              });
            } else {
              if (state.orderType === 'CYCLE') {
                if (state.currentValue.length < 1) {
                  return uni.showToast({
                    title: '请选择申请明细',
                    icon: 'none',
                    duration: 2000
                  });
                }
                let postDataArr = [];
                tempList = [];
                let giftTempList = [];
                state.goodsList.forEach(val => {
                  if (!val.giftProduct && val.checked) {
                    tempList.push({
                      orderDetailsId: val.orderDetailsId,
                      productNumber: !val.giftProduct ? val.productNum * (state.orderDetails.childOrder.length - state.refundAmount) : val.productNum
                    });
                  }
                  if (val.checked) {
                    if (val.giftProduct) {
                      giftTempList.push({
                        orderDetailsId: val.orderDetailsId,
                        productNumber: !val.giftProduct ? val.productNum * (state.orderDetails.childOrder.length - state.refundAmount) : val.productNum,
                        cycleGiftProduct: true
                      });
                    } else {
                      giftTempList.push({
                        orderDetailsId: val.orderDetailsId,
                        productNumber: !val.giftProduct ? val.productNum * (state.orderDetails.childOrder.length - state.refundAmount) : val.productNum
                      });
                    }
                  }
                });
                let afterOrder = state.orderDetails.childOrder.filter(item => item.status !== '已退款' && item.status !== '退款中' && item.status !== '部分退款');
                console.log(afterOrder, 'afterOrder');
                let maxFixd;
                if (afterOrder.length > 0) {
                  maxFixd = afterOrder[afterOrder.length - 1];
                }
                state.currentValue.forEach(val => {
                  let postDataObj = {
                    afterSaleType: postData.afterSaleType,
                    applyReason: postData.applyReason,
                    descriptionImageUrls: postData.descriptionImageUrls,
                    orderId: val,
                    refundDetails: tempList
                  };
                  if (val === maxFixd.id) {
                    postDataObj.refundDetails = giftTempList;
                  }
                  postDataArr.push(postDataObj);
                });
                orderService.createRefundCycle(postDataArr).then(res => {
                  console.log(res, 'resCYCYCYCYCY');
                  inSubmit = false;
                  uni.hideLoading();
                  state.navigationBarTitle = '退款申请';
                  state.type = 'success';
                }).catch(error => {
                  uni.hideLoading();
                  inSubmit = false;
                  console.log(error);
                  state.isRefund = false;
                  uni.showToast({
                    title: error.message,
                    icon: 'none',
                    duration: 2000
                  });
                });
              } else {
                orderService.createRefund(postData).then(res => {
                  console.log(res);
                  inSubmit = false;
                  uni.hideLoading();
                  state.navigationBarTitle = '退款申请';
                  state.type = 'success';
                }).catch(error => {
                  uni.hideLoading();
                  inSubmit = false;
                  console.log(error);
                  state.isRefund = false;
                  uni.showToast({
                    title: error.message,
                    icon: 'none',
                    duration: 2000
                  });
                });
              }
            }
          }
        } else {
          utils.showToast("您的退款单申请正在处理，请勿重复提交，谢谢~");
          if (inSubmit) {
            uni.showLoading();
          }
        }
      } else {
        state.isRefund = false;
        uni.showToast({
          title: '请选择您要退款的商品，谢谢~',
          icon: 'none',
          mask: true,
          duration: 2000
        });
      }
    } else {
      state.isRefund = false;
      uni.showToast({
        title: '请填写退款理由，谢谢~',
        icon: 'none',
        mask: true,
        duration: 2000
      });
    }
  } else {
    state.isRefund = false;
    uni.showModal({
      title: '温馨提示',
      content: '您近期已经提交了相关商品的退款单，我们的工作人员正在努力审核哦，审核结果将第一时间通知您，请勿重复提交，谢谢~',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  }
}
function changeDelivery(e) {
  state.currentValue = e.detail.value;
  let newGoodsList = state.goodsList;
  // newGoodsList[0].productNum = this.data.currentValue.length * productNum
  if (state.currentValue.length > 0) {
    newGoodsList[0].productNumber = state.currentValue.length * state.cycleGoodsList[0].productNum;
    newGoodsList[0].checked = true;
  } else {
    newGoodsList[0].productNumber = 0;
    newGoodsList[0].checked = false;
  }
  state.goodsList = newGoodsList;
  if (state.refundAmount + state.currentValue.length === state.orderDetails.childOrder.length) {
    newGoodsList.forEach(val => {
      if (val.giftProduct) {
        val.productNumber = val.giftProduct ? val.productNum : val.productNum * (state.orderDetails.childOrder.length - state.refundAmount), val.checked = true;
      }
    });
    state.isCheckGift = true;
    state.goodsList = newGoodsList;
    state.checkedAll = true;
  } else {
    newGoodsList.forEach(val => {
      if (val.giftProduct) {
        val.productNumber = 0;
        val.checked = false;
      }
    });
    state.isCheckGift = false;
    state.goodsList = newGoodsList;
    state.checkedAll = false;
  }
  let goodsNum = 0;
  state.goodsList.forEach(val => {
    goodsNum += val.productNumber;
  });
  state.refundNumber = goodsNum;
  let totalAmount = 0;
  if (state.currentValue.length > 0) {
    console.log(state.currentValue, 'this.currentValue');
    state.currentValue.forEach(val => {
      const filterGoods = state.orderDetails.childOrder.filter(item => item.id === val);
      if (filterGoods.length > 0) {
        totalAmount += parseFloat(filterGoods[0].cashTotal);
      }
    });
    state.cashTotal = totalAmount;
  } else {
    state.cashTotal = state.orderDetails.cashTotal;
  }

  // this.setData({

  // })
  // this.setData({
  //   refundNumber: this.data.currentValue.length * this.data.goodsList[0].productNum
  // })
}
function handleOrderStatus(status) {
  if (status === "CREATED") {
    return "待付款";
  } else if (status === "PAID") {
    return "已付款";
  } else if (status === "SHIPPED") {
    return "配送中";
  } else if (status === "RECEIVED") {
    return "待评价";
  } else if (status === "FINISHED") {
    return "已完成";
  } else if (status === "CANCELED") {
    return "已取消";
  } else if (status === "REJECTED") {
    return "已退款";
  } else if (status === "RETURNING") {
    return "退款中 ";
  } else if (status === "PENDING") {
    return "待自提";
  } else if (status === "WAITSHIPPED") {
    return "待发货";
  } else if (status === "WAITPAYBALANCE") {
    return "待付尾款";
  } else if (status === "PARTREJECTED") {
    return "部分退款";
  } else if (status === "PAYFAILED") {
    return "支付失败";
  } else {
    return status;
  }
}
function getOrderDetails() {
  let orderId = options.orderId;
  console.log('orderId', options.orderId, orderId);
  // 查询系统配置项，根据系统配置项退款显示
  let systemOptions = app.globalData.configureInfo;
  let supportPartReturn = false;
  systemOptions.forEach(item => {
    // 遍历配置项查询是否支持部分退款
    if (item.key === 'supportPartReturn' && item.value != null && item.value !== '') {
      item.value === 'TRUE' ? supportPartReturn = true : supportPartReturn = false;
    }
  });
  orderService.getDetailsByIdV2(orderId, false).then(res => {
    console.log(res, "商品详情");
    if (!res) {
      orderService.getDetailsById(orderId).then(item => {
        console.log(item, "商品详情");
        if (item.type === "SOLITAIRE") {
          if (item.solitaireRecordStatus === "NORMAL") {
            // 接龙中
            supportPartReturn = false;
          }
        }
        let itemSatus = item.status;
        let tempList = [];
        let giftList = [];
        item.products.forEach(item => {
          let price = item.price ? item.price.toFixed(2) : 0;
          // 处理预售订单付完全款
          if (item.business === "ADVANCE_SELL" && item.status !== "WAITPAYBALANCE" && item.balanceTotal && item.balanceTotal != null) {
            // 业态为预售且状态不是待付尾款
            price = parseFloat(price).toFixed(2);
          }
          let refundedCount = 0;
          if (item.refundedCount != null && item.refundedCount >= 0) {
            refundedCount = item.refundedCount;
          }
          if (item.giftProduct) {
            giftList.push({
              ...item,
              price: price,
              id: item.orderDetailsId,
              productNum: item.productNum - refundedCount,
              productNumber: 0
            });
          }
          console.log(item, 'this.orderType');
          if (item.type === 'CYCLE') {
            item.checked = false;
            state.checkedAll = false;
          }
          tempList.push({
            ...item,
            price: price,
            id: item.orderDetailsId,
            productNum: item.productNum - refundedCount,
            productNumber: 0
          });
        });
        state.orderId = item.id;
        state.mobile = item.mobile;
        state.goodsList = tempList;
        state.giftList = giftList;
        state.address = item.province + item.city + item.district + item.address;
        state.storeName = item.storeName;
        state.createTime = item.createTime;
        state.cashTotal = item.cashTotal;
        state.orderAmount = item.orderAmount;
        state.cashDeductTotal = item.cashDeductTotal;
        state.remark = item.remark;
        state.storeAddress = item.storeAddress;
        state.shipmentType = item.shipmentType;
        state.shipmentAmount = item.shipmentAmount - (item.deductibleShipmentAmonut || 0);
        state.canRefund = item.canRefund;
        state.orderType = item.type;
        state.supportPartReturn = supportPartReturn;
        state.packagingId = item.packagingId;
        state.parentId = item.parentId;
        state.teamId = item.teamId;
        state.advanceId = item.advanceId;
        state.orderDetails = res;
        state.cycleGoodsList = tempList;
        let filterStatus = state.orderDetails.childOrder || [];
        let refundAmount = 0;
        if (filterStatus && filterStatus.length > 0) {
          filterStatus.forEach(val => {
            val.status = handleOrderStatus(val.status);
            val.checked = false;
            if (res.type === 'CYCLE') {
              const formattedDate = val.deliveryTime.split(' ')[0];
              val.deliveryTime = formattedDate;
            }
          });
          refundAmount = filterStatus.filter(val => val.status === '已退款' || val.status === '部分退款' || val.status === '退款中').length;
        }
        state.orderDetails.childOrder = filterStatus;
        state.refundAmount = refundAmount;
      }).catch(err => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
      return;
    }
    if (res.type === "SOLITAIRE") {
      if (res.solitaireRecordStatus === "NORMAL") {
        // 接龙中
        supportPartReturn = false;
      }
    }
    let itemSatus = res.status;
    let tempList = [];
    let giftList = [];
    res.products.forEach(item => {
      let price = item.price ? item.price.toFixed(2) : 0;
      // 处理预售订单付完全款
      if (res.business === "ADVANCE_SELL" && res.status !== "WAITPAYBALANCE" && item.balanceTotal && item.balanceTotal != null) {
        // 业态为预售且状态不是待付尾款
        price = parseFloat(price).toFixed(2);
      }
      let refundedCount = 0;
      if (item.refundedCount != null && item.refundedCount >= 0) {
        refundedCount = item.refundedCount;
      }
      if (item.giftProduct) {
        giftList.push({
          ...item,
          price: price,
          id: item.orderDetailsId,
          productNum: item.productNum - refundedCount,
          productNumber: 0
        });
      }
      console.log(res.type, 'this.orderType222');
      if (res.type === 'CYCLE') {
        if (res.childOrder && res.childOrder.length > 0) {
          res.childOrder.forEach(val => {
            const formattedDate = val.deliveryTime.split(' ')[0];
            val.deliveryTime = formattedDate;
          });
        }
        item.checked = false;
        state.checkedAll = false;
      }
      tempList.push({
        ...item,
        price: price,
        id: item.orderDetailsId,
        productNum: item.productNum - refundedCount,
        productNumber: 0
      });
    });
    state.orderId = res.id;
    state.mobile = res.mobile;
    state.goodsList = tempList;
    state.giftList = giftList;
    state.address = res.province + res.city + res.district + res.address;
    state.storeName = res.storeName;
    state.createTime = res.createTime;
    state.cashTotal = res.cashTotal;
    state.orderAmount = res.orderAmount;
    state.cashDeductTotal = res.cashDeductTotal;
    state.remark = res.remark;
    state.storeAddress = res.storeAddress;
    state.shipmentType = res.shipmentType;
    state.shipmentAmount = res.shipmentAmount - (res.deductibleShipmentAmonut || 0);
    state.canRefund = res.canRefund;
    state.orderType = res.type;
    state.supportPartReturn = supportPartReturn;
    state.packagingId = res.packagingId;
    state.parentId = res.parentId;
    state.teamId = res.teamId;
    state.advanceId = res.advanceId;
    state.orderDetails = res;
    state.cycleGoodsList = tempList;
    let filterStatus = state.orderDetails.childOrder || [];
    let refundAmount = 0;
    if (filterStatus && filterStatus.length > 0) {
      filterStatus.forEach(val => {
        val.status = handleOrderStatus(val.status);
        val.checked = false;
      });
      refundAmount = filterStatus.filter(val => val.status === '已退款' || val.status === '部分退款' || val.status === '退款中').length;
    }
    //   this.data.goodsList.forEach((item, index) => {
    //     selfA.getTemporaryUrl(item.imageUrl)
    //     .then (att=>{
    //         item.imageUrl = att;
    //         if(index >= this.data.goodsList.length - 1) {
    //             this.setData({
    //                 goodsList: this.data.goodsList
    //             })
    //         }
    //     })
    //   })
    state.orderDetails.childOrder = filterStatus;
    state.refundAmount = refundAmount;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function checkboxChange(e) {
  let packagingId = state.packagingId;
  if (state.orderType === "COMPOSE") {
    return false;
  } else {
    if (packagingId) {
      state.checkedAll = !state.checkedAll;
      if (state.checkedAll) {
        checkboxAllChange(e);
      } else {
        checkboxAllChange('');
      }
    } else {
      console.log(state.orderType);
      console.log("checkbox监听事件");
      if (e.detail.value.length === state.goodsList.length) {
        state.checkedAll = true;
      } else {
        state.checkedAll = false;
      }
      let tempData = state.goodsList;
      let selectedList = [];
      tempData.forEach(ele => {
        if (ele.checked) {
          selectedList.push(ele.id);
        }
      });
      let selects = [];
      if (e.detail.value.length > 0) {
        selects = getArrDifference(e.detail.value, selectedList);
      } else {
        tempData.forEach(ele => {
          ele.checked = false;
          ele.productNumber = 0;
        });
      }
      function getArrDifference(arr1, arr2) {
        return arr1.concat(arr2).filter(function (v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v);
        });
      }
      selects.forEach(item => {
        console.log(item);
        tempData.forEach(ele => {
          if (item === ele.id) {
            if (ele.checked) {
              ele.productNumber = 0;
            } else {
              ele.productNumber = ele.productNum;
            }
            ele.checked = !ele.checked;
          }
        });
      });
      let tempNum = 0;
      tempData.forEach(ele => {
        if (ele.checked) {
          tempNum = tempNum + ele.productNumber;
        }
      });
      state.goodsList = tempData;
      state.refundNumber = state.orderType === 'CYCLE' ? tempNum & state.currentValue : tempNum;
      checkAllRefund();
    }
  }
}
function checkboxAllChange(e) {
  console.log("点击全选事件", e);
  let tempData = state.goodsList;
  let tempNum = 0;
  if (e.detail.value.length === 0 || e == '') {
    console.log('jinrudaozheli');
    tempData.forEach((item, index) => {
      item.checked = false;
      item.productNumber = 0;
    });
    state.goodsList = tempData;
    state.refundNumber = state.orderType === 'CYCLE' ? 0 : tempNum;
  } else {
    tempData.forEach((item, index) => {
      if (item.productNum > 0) {
        item.checked = true;
        item.productNumber = item.productNum;
        tempNum = tempNum + item.productNumber;
      }
    });
    state.goodsList = tempData;
    state.refundNumber = state.orderType === 'CYCLE' ? 0 : tempNum;
  }
  checkAllRefund();
}
function handleReduce(e) {
  if (state.isSupportPartReturn === 'FALSE' || state.orderType === "COMPOSE" || state.teamId || state.advanceId || state.packagingId) {
    return false;
  } else {
    let tempData = state.goodsList;
    let allNum = state.refundNumber;
    let checkedCount = 0;
    tempData.forEach(item => {
      if (item.id === e.currentTarget.dataset.id) {
        if (item.productNumber > 0) {
          item.productNumber--;
          allNum--;
          if (item.productNumber > 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        }
      }
      if (item.checked) {
        checkedCount++;
      }
    });
    state.goodsList = tempData;
    state.refundNumber = allNum;
    if (checkedCount === state.goodsList.length) {
      state.checkedAll = true;
    } else {
      state.checkedAll = false;
    }
    checkAllRefund();
  }
}
function handleAdd(e) {
  if (state.isSupportPartReturn === 'FALSE' || state.orderType === "COMPOSE" || state.teamId || state.advanceId || state.packagingId) {
    return false;
  } else {
    let tempData = state.goodsList;
    let allNum = state.refundNumber;
    let checkedCount = 0;
    tempData.forEach(item => {
      if (item.id === e.currentTarget.dataset.id) {
        if (item.productNumber < item.productNum) {
          item.productNumber++;
          allNum++;
          if (item.productNumber > 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        }
      }
      if (item.checked) {
        checkedCount++;
      }
    });
    state.goodsList = tempData;
    state.refundNumber = allNum;
    if (checkedCount === state.goodsList.length) {
      state.checkedAll = true;
    } else {
      state.checkedAll = false;
    }
    checkAllRefund();
  }
}
function queryPartReturnConfig() {
  sysService.query("supportPartReturn").then(res => {
    if (res && res.length > 0 && res[0].value != null && res[0].value !== "") {
      //   console.log(res[0].value)
      state.isSupportPartReturn = res[0].value;
      state.supportPartReturn = res[0].value == 'TRUE';
    }
  }).catch(err => {
    console.log("查询配置出错：" + err.message);
  });
}
function checkAllRefund() {
  const tempList = state.goodsList;
  let allRedund = true;
  tempList.forEach(item => {
    if (item.productNumber !== item.productNum) {
      allRedund = false;
    }
  });
  state.allRedund = allRedund;
}
onLoad(function (options) {
  uni.hideShareMenu();
  inSubmit = false;
  console.log('options', options);
  if (options.orderId) {
    state.orderId = options.orderId;
    getOrderDetails();
    // 获取是否支持商品按数量退款 默认支持
    queryPartReturnConfig();
  }
  if (options.afterSaleType) {
    state.afterSaleType = options.afterSaleType != 'undefined' && options.afterSaleType ? options.afterSaleType : 'REFUND';
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  state.themeColor = app.globalData.uiconfig.themeColor;
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {
  uni.hideLoading();
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/refund/refund.wxss */

page {
  background-color: #fff;
}

.refund-main {
  width: 100%;
  padding-bottom: 200rpx;
}

.refund-order {
  width: 100%;
  background-color: #fff;
  border-top: 1rpx solid #e6e6e6;
  border-bottom: 20rpx solid#F1F1F1;
  color: #454545;
  padding-bottom: 35rpx;
}

.order-number {
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  border-bottom: 1px solid #ebebeb;
  margin: 0 40rpx;
  color: #454545;
  display: flex;
  align-items: center;
}

.order-number checkbox {
  line-height: 80rpx;
}

checkbox .wx-checkbox-input {
  border-radius: 50%;
  width: 32rpx;
  height: 32rpx;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  border-color: #009136;
  background: #009136;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
  border-radius: 50%;
  width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
  font-size: 20rpx;
  color: #fff;
  background: transparent;
  transform: translate(-50%, -50%) scale(1);
  -webkit-transform: translate(-50%, -50%) scale(1);
}

.goods-box {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx 40rpx 10rpx 40rpx;
  /* border-bottom: 1rpx solid #F1F1F1; */
}

.goods-box checkbox-group {
  width: 100%;
}

.goods-box.portion-refund .goods-item {
  width: 100%;
  height: 120rpx;
  margin: 10rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
}

.goods-box.portion-refund .goods-info {
  position: relative;
  width: calc(100% - 200rpx);
  font-size: 32rpx;
  height: 120rpx;
}

.goods-box .goods-item {
  width: 120rpx;
  height: 120rpx;
  margin: 0 8rpx 9rpx 0;
  border: 1rpx solid #f0f0f0;
}

.goods-box .goods-item:last-of-type {
  margin-right: 0;
}

.goods-box .goods-item>image {
  width: 120rpx;
  height: 120rpx;
}

.goods-box .goods-item checkbox {
  height: 120rpx;
  line-height: 120rpx;
}

.goods-box .goods-name,
.goods-box .goods-desc {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-box .goods-name {
  font-size: 32rpx;
  line-height: 36rpx;
  height: 36rpx;
  margin-top: 12rpx;
  margin-bottom: 32rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.goods-detail-info {
    display: flex;
    flex-direction: column;
    font-size: 20rpx;
    color: #999;
}
.goods-box .goods-name .name {
  width: calc(100% - 70rpx);
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-box .label {
  width: 60rpx;
  height: 36rpx;
  font-size: 24rpx;
  line-height: 36rpx;
  margin-right: 10rpx;
  text-align: center;
  border-radius: 6rpx;
  background: #ff6131;
  display: block;
  color: #ffffff;
}

.goods-box .goods-desc {
  font-size: 26rpx;
  line-height: 36rpx;
  width: 70%;
}

.goods-box .price-number .count-box {
  width: 135rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 44rpx;
  height: 44rpx;
  border: 1rpx solid #f1f1f1;
  position: absolute;
  bottom: 0;
  right: 0;
}

.goods-box .price-number .count-box text {
  background: #fff;
  color: #454545;
  font-size: 24rpx;
  width: 43rpx;
  height: 100%;
  text-align: center;
  /* display: inline-block; */
}

.goods-box .price-number .count-box view {
  width: 46rpx;
  height: 46rpx;
  text-align: center;
  font-size: 40rpx;
  background: #f1f1f1;
  color: #009136;
  /* line-height: 44rpx; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-info {
  font-size: 26rpx;
  height: 36rpx;
  line-height: 36rpx;
  width: 100%;
  margin-top: 26rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
}

.order-info>view {
  display: inline-flex;
}

.order-info>view:last-of-type view {
  vertical-align: bottom;
}

.goods-info .nowPrice {
  font-size: 28rpx;
  line-height: 36rpx;
  font-weight: bold;
  color: #333;
  margin-right: 30rpx;
}

.goods-info .goods-count {
  font-size: 24rpx;
  color: #666666;
  font-weight: bold;
}

.goods-info .goods-count text:first-of-type {
  display: inline-block;
  min-width: 60rpx;
}

.goods-info .goods-count .refund-num {
  color: #FF4545;
  font-weight: 400;
  margin-left: 2rpx;
}

.order-price {
  color: #ff8561;
  font-size: 36rpx;
}



.freight-info {
  font-size: 26rpx;
  margin-left: 15rpx;
  line-height: 26rpx;
  margin-top: 10rpx;
}

.order-freight {
  font-size: 26rpx;
  color: #727272;
}

/* 退款原因 */

.refund-box {
  background-color: #fff;
  padding: 0 40rpx 9rpx 40rpx;
  width: 100%;
  box-sizing: border-box;
}

.refund-title {
  padding-top: 12rpx;
  height: 84rpx;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 84rpx;
  color: #454545;
  border-bottom: 1rpx solid #f1f1f1;
}

.redund-explain {
  padding: 0;
}

.redund-labels {
  padding: 20rpx 0;
}

.redund-labels text {
  font-size: 24rpx;
  line-height: 50rpx;
  height: 50rpx;
  color: #8b8b8c;
  box-sizing: border-box;
  padding: 0 38rpx;
  border: 1rpx solid #8b8b8c;
  display: inline-block;
  border-radius: 5rpx;
  margin: 10rpx 20rpx 10rpx 0;
}

.redund-labels text.select {
  background: #009f55;
  border: 1rpx solid #009f55;
  color: #fff;
}

.redund-explain-con {
  width: 598rpx;
  height: 192rpx;
  font-size: 28rpx;
  line-height: 32rpx;
  min-height: 192rpx;
  color: #8b8b8c;
  padding: 26rpx 36rpx;
  background: #f1f1f1;
  border-radius: 6rpx;
  /* overflow-y:auto; */
}

.refund-image {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  margin-top: 20rpx;
}

.refund-image>image {
  width: 162rpx;
  height: 162rpx;
  margin-right: 5rpx;
  margin-bottom: 9rpx;
}

.refund-image>image:last-of-type {
  margin-right: 0;
}

.redund-explain .submit-img {
  width: 162rpx;
  height: 162rpx;
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
  justify-content: space-between;
  background: #fff;
  z-index: 9;
}

.bottom-box .order-price {
  color: #ff8561;
  font-size: 36rpx;
  line-height: 120rpx;
  font-weight: bold;
}

.bottom-box .order-price text {
  font-size: 24rpx;
  color: #454545;
  font-weight: bold;
  line-height: 30rpx;
  padding-left: 22rpx;
  margin-left: 22rpx;
  border-left: 1px solid #8b8b8c;
}

.btn {
  font-size: 32rpx;
  line-height: 100rpx;
  font-weight: bold;
  height: 100rpx;
  width: 325rpx;
  color: #fff;
  border-radius: 6rpx;
  border: 0;
  margin: 0;
  background-color: #009f55;
}

.refund-success {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.success-img {
  width: 240rpx;
  height: 227rpx;
  margin-top: 280rpx;
}

.success-tips {
  font-size: 32rpx;
  line-height: 92rpx;
  color: #8b8b8c;
}

.retuen-btn {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  width: 325rpx;
  height: 100rpx;
  line-height: 100rpx;
  background: #009f55;
  border-radius: 6rpx;
}

/* 赠品相关 */

.gift-box {
  background: #fff;
  min-height: 80rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #ff6131;
  padding: 0 40rpx;
  font-size: 24rpx;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px dashed #ebebeb;
  border-bottom: 1px solid #ebebeb;
  margin: 10rpx auto;
}

.gift-bottom-box {
  width: 670rpx !important;
  margin: 10rpx 40rpx;
  padding: 0 !important;
  align-items: center;
}

.gift-box view {
  display: flex;
  align-items: center;
}

.gift-box .gift-title {
  margin-right: 5rpx;
  height: 80rpx;
  width: 60rpx;
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

.gift-bottom-box .gift-item-box {
  flex-direction: row !important;
}

.gift-bottom-box .gift-item {
  justify-content: flex-start !important;
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
  flex-shrink: 0;
}

.gift-img-box image {
  width: 100%;
  height: 100%;
}

.gift-box .gift-num {
  color: #ff3a00;
}
.delivery-list {
  padding: 0 20rpx;
}
  
.delivery-list .delivery-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 10rpx;
  margin-top: 20rpx;
  padding: 12rpx;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.item-lt-box {
    display: flex;
    align-items: center;
}

.delivery-list .delivery-list-item .item-lt {
  display: flex;
  font-weight: 400;
  font-size: 24rpx;
  color: #000000;
  margin-left: 15rpx;
}

.delivery-list .delivery-list-item .item-lt view:nth-of-type(1) {
  margin-right: 30rpx;
}

.delivery-list .delivery-list-item .item-rt {
  width: 110rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 24rpx;
  text-align: center;
  color: #999999;
}

.delivery-list .delivery-list-item .edit {
  border-radius: 30rpx;
  border: 1px solid #EB702D;
  color: #EB702D;
}

.delivery-list .delivery-list-item .progress {
  color: #23C257;
}

.order-box {
  background: #fff;
  /* width: 674rpx; */
  width: 100%;
  padding: 0 20rpx 20rpx 20rpx;
  margin: 0 auto 18rpx auto;
  border-bottom: 20rpx solid#F1F1F1;
  box-sizing: border-box;
}

.order-box .title {
  display: flex;
  justify-content: space-between;
  font-size: 32rpx;
  color: #242424;
  font-family: Source Han Sans CN;
  font-weight: 500;
  height: 60rpx;
  line-height: 60rpx;
  padding-top: 15rpx;
  padding-left: 20rpx;
}

.goods-info .goods-desc {
  font-size: 22rpx;
  line-height: 36rpx;
  height: 36rpx;
  color: #999;
}
</style>