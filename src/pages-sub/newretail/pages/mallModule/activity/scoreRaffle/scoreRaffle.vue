<template>
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view>
    <!-- <view class="navigation-bar-top" style="height:{{navHeight}}px;"></view> -->

    <view class="container" :style="'background-color: ' + state.colour + ';'">
      <image
        class="bg-img"
        :src="state.background || state.imagesPath.scoreRaffleBg"
        mode="widthFix"
      ></image>
      <view @click="toggleRulesPopup" class="rule">
        <view>玩法规则</view>
      </view>
      <view @click="togglePrizePopup" class="prize_detail">
        <view>
          <text>我</text>
          <text>的</text>
          <text>奖</text>
          <text>品</text>
        </view>
      </view>
      <!-- <view class="bg-img-title">
    <image src="https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/images/luck-draw/raffle-bg-title.png" alt=""></image>
  </view> -->
      <view class="big-wheel-box">
        <!-- <image class='big-wheel-bg' src='{{imagesPath.draw_box_bg}}'></image> -->
        <view class="prize_content">
          <view
            v-for="(item, index) in state.prize"
            :key="key"
            :class="state.active == item.key && state.active ? 'active' : ''"
            :data-itemkey="item.key"
            @click="item.key ? '' : 'clickDrawPrize'"
          >
            <image :src="state.turntableDTOS[item.key - 1].imageUrl" v-if="item.key"></image>
            <image :src="state.imagesPath.scoreRaffleBtn" class="btn-bg" v-if="!item.key"></image>
            {{ item.key ? state.turntableDTOS[item.key - 1].prizeName : '' }}
            <view v-if="!item.key" class="btn_text">最多可抽奖次数：{{ state.prizeBalance }}</view>
          </view>
        </view>
        <!-- <canvas wx:if="{{!state.canvasFinished}}" canvas-id="wheelCanvas"></canvas>
    <view wx:if="{{state.canvasFinished}}" class='canvas-img'>
      <image src='{{state.canvasImgPath}}' animation="{{state.animationData}}"></image>
    </view> -->
        <!-- <image class='big-wheel-pointer' src='https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/images/luck-draw/turnplate-pointer.png' bindtap='clickDrawPrize'></image> -->
        <!-- <image class='big-wheel-pointer' src='../../../../utils/image/choujiang.png' bindtap='clickDrawPrize'></image> -->
        <!-- <view class="raffleBalance">
      每次抽奖会消耗 <text>{{state.score}}</text> 积分
    </view> -->
      </view>
      <!-- <wheel
    prizeList="{{state.wheelFanShapes}}"
    prizeName="{{state.rafflePrizeName}}"
    rotTimes="{{state.raffling.activityPrizeBalance}}"
    bind:onStart="onStart"
    bind:onFinish="onFinish"
  ></wheel> -->
    </view>

    <!-- <view class="handle-btn">
  <button bind:tap="toggleRulesPopup">
    <image class='btn-bg' src='{{state.imagesPath.draw_btn_bg}}'></image>
    <view>活动规则</view>
  </button>
  <button bind:tap="togglePrizePopup">
    <image class='btn-bg' src='{{state.imagesPath.draw_btn_bg}}'></image>
    <view>我的奖品</view>
  </button>
</view> -->
    <popup
      :show="state.show.rules"
      position="bottom"
      custom-class="bottom"
      @close="toggleRulesPopup"
    >
      <view class="popup-box">
        <view class="popup-close" @click="toggleRulesPopup">
          <!-- <image src="{{imagesPath.iconLuckDrawClose}}" ></image> -->
          <image :src="closeIcon"></image>
        </view>
        <view class="popup-title">—— 活动规则 ——</view>
        <view class="popup-content">
          <!-- <view>活动规则：</view> -->
          <view v-for="(item, index) in state.raffleActivityRule">
            {{ item }}
          </view>
          <!-- <view><text class="color_text">活动时间：</text>页面所示活动时间。</view>
      <view><text class="color_text">活动说明：</text></view>
      <view>1、大转盘抽奖需要消耗一定数量的<text class="color_text">会员积分</text>，用户所消耗的积分仅用于大转盘抽奖资格，并不保证用户必然能够获得优惠券，不论用户最终是否获得优惠券，<text class="color_text">所消耗的会员积分均不予退回</text>(大转盘抽奖具体需消耗的积分数量，以页面显示为准)。</view>
      <view>2、抽奖获得的优惠券是<text class="color_text">用于购物时抵扣</text>的通用型优惠额度，用户可于购物时按照所购商品使用的满减条件直接享受一定金额折扣优惠的消费权益。</view>
      <view>3、优惠券存在使用有效期，具体使用有效期见优惠券信息。</view>
      <view>4、每个订单只能使用一张优惠券，优惠券金额<text class="color_text">不可叠加使用</text>。</view>
      <view>5、使用优惠券的订单发生退款时，用户最高可退金额为该笔订单实付款，优惠券使用有效期内，当订单退款或取消时，<text class="color_text">优惠券自动退回到该用户账户</text>。</view> -->
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.prizeRecord"
      position="bottom"
      custom-class="bottom"
      @close="togglePrizePopup"
    >
      <view class="popup-box">
        <view class="popup-close" @click="togglePrizePopup">
          <!-- <image src="{{imagesPath.iconLuckDrawClose}}" ></image> -->
          <image :src="closeIcon"></image>
        </view>
        <view class="popup-title">—— 我的奖品 ——</view>
        <view class="prize_title">
          <view class="flex_2">奖品</view>
          <view class="flex_3">获奖时间</view>
          <view>操作</view>
        </view>
        <scroll-view :scroll-y="true" style="width: 100%; height: 50vh">
          <view class="popup-content">
            <view v-for="(item, index) in state.raffleRecords" :key="index" class="prizeList">
              <view class="prizeInfo">
                <view class="prizeName">{{ item.rafflePrizeName }}</view>
                <view class="prizeTime">{{ item.updateTime }}</view>
              </view>
              <view class="prizeJumpBtn">
                <button
                  @click="toPrize"
                  :data-id="item.rafflePrizeId"
                  v-if="item.rafflePrizeName !== '未中奖'"
                >
                  去查看
                </button>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </popup>
    <popup :show="state.show.prize" position="middle" custom-class="middle">
      <view class="prize-box-bg">
        <view class="popup-box prize-box">
          <view class="popup-box-title">—— 恭喜，中奖啦！ ——</view>
          <view class="prizeName">
            <image mode="widthFix" class="prizeUrl" :src="state.raffleImageUrl"></image>
            <!-- <image class="coupon-bg" src="https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/images/luck-draw/coupon-bg.png"></image>
        <view class="name">
          <image src="https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/images/luck-draw/coupon-icon.png"></image>
          {{state.rafflePrizeName || state.couponActivityName}}
        </view> -->
          </view>
          <view class="prizeBtn" @click="toMyCoupon">查看奖品</view>
        </view>
        <view class="close">
          <image
            @click="closePrize"
            src="https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/UI/standard/iconCloseImg.png"
          ></image>
        </view>
      </view>
    </popup>

    <popup :show="state.show.noPrize" position="middle" custom-class="middle">
      <view class="popup-box no-prize">
        <view class="prizeName">{{ state.raffleComment }}</view>
        <!-- <image mode="widthFix" class="prizeUrl" src="{{raffleImageUrl}}"></image> -->
        <view class="prizeBtn" @click="closeNoPrize">确定</view>
      </view>
    </popup>
  </view>
</template>
<script setup>
import _apiRequestJs from '@/service/api/newretail/request'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import _apiRaffleServiceJs from '@/service/api/newretail/raffleService'
import closeIcon from '@/utils/newretail/image/close_icon.png'
// import { onShow, onLoad } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp()

const raffleService = _apiRaffleServiceJs
const orderService = _apiOrderServiceJs
const productService = _apiProductServiceJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const AUTHORIZE = _utilsAuthorizeJs
const themeManager = _utilsThemeManagerJs

// 获取应用实例
let _ctx
let rate = 1
let canClick = true
const state = reactive({
  rafflePrizeId: null,
  raffleComment: null,
  raffleImageUrl: null,
  turntableSort: null,
  background: null,
  colour: null,
  raffleActivityRule: [],
  active: null,
  timeOut: null,
  prizeBalance: 0,
  prize: [
    {
      key: 1,
    },
    {
      key: 2,
    },
    {
      key: 3,
    },
    {
      key: 8,
    },
    {
      key: null,
    },
    {
      key: 4,
    },
    {
      key: 7,
    },
    {
      key: 6,
    },
    {
      key: 5,
    },
  ],
  turntableDTOS: [
    {
      imageUrl: '',
      prizeId: '',
      prizeName: '',
      raffleActivityId: '',
      rafflePrizeType: '',
      rate: 0,
      turntableSort: 1,
    },
    {
      imageUrl: '',
      prizeId: '',
      prizeName: '',
      raffleActivityId: '',
      rafflePrizeType: '',
      rate: 0,
      turntableSort: 2,
    },
    {
      imageUrl: '',
      prizeId: '',
      prizeName: '',
      raffleActivityId: '',
      rafflePrizeType: '',
      rate: 0,
      turntableSort: 3,
    },
    {
      imageUrl: '',
      prizeId: '',
      prizeName: '',
      raffleActivityId: '',
      rafflePrizeType: '',
      rate: 0,
      turntableSort: 4,
    },
    {
      imageUrl: '',
      prizeId: '',
      prizeName: '',
      raffleActivityId: '',
      rafflePrizeType: '',
      rate: 0,
      turntableSort: 5,
    },
    {
      imageUrl: '',
      prizeId: '',
      prizeName: '',
      raffleActivityId: '',
      rafflePrizeType: '',
      rate: 0,
      turntableSort: 6,
    },
    {
      imageUrl: '',
      prizeId: '',
      prizeName: '',
      raffleActivityId: '',
      rafflePrizeType: '',
      rate: 0,
      turntableSort: 7,
    },
    {
      imageUrl: '',
      prizeId: '',
      prizeName: '',
      raffleActivityId: '',
      rafflePrizeType: '',
      rate: 0,
      turntableSort: 8,
    },
  ],
  navigationBarTitle: '',
  imagesPath: IMGAGESPATH,
  navHeight: 46,
  show: {
    rules: false,
    prizeRecord: false,
    prize: false,
    noPrize: false,
  },
  canvasImgPath: '',
  canvasFinished: false,
  // canvas是否转化成了图片，控制页面元素显示隐藏
  rafflingId: '1203977456722169857',
  // 抽奖活动id
  prizes: [],
  wheelFanShapes: [],
  raffling: {
    activityMbrDayRaffleCount: 0,
    activityPrizeBalance: 0,
    activityPrizeTotal: 0,
    mbrRaffleCount: 0,
  },
  animationData: {},
  rafflePrizeName: '一等奖',
  // 中奖名称
  hasUserInfo: false,
  isMember: false,
  member: null,
  userInfo: null,
  couponActivityName: '',
  raffleRecords: [],
  score: 0, // 消耗多少积分抽奖
})
const ctx = {}
onShow(function () {
  checkUserInfo()
  if (isOnLoad) {
    isOnLoad = false
  } else {
    getPrizeAndAward(state.rafflingId)
  }
})
onLoad(function (options) {
  console.log(options)
  isOnLoad = true
  _ctx = uni.createCanvasContext('wheelCanvas', this)
  // 计算出当前设备分辨率与标准分辨率的比率
  const baseWidthUnit = 375 // 以iPhone6的分辨率为基准
  const windowWidth = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo(),
  }.windowWidth
  rate = windowWidth / baseWidthUnit
  if (options.raffleActivityId) {
    // 查询已抽奖次数
    state.rafflingId = options.raffleActivityId
    getDayOpenIdDrawnCount()
    getPrizeAndAward(state.rafflingId)
    getNumber()
  }
})
function getNumber() {
  const postData = {
    raffleActivityId: state.rafflingId,
    memberId: app.globalData.userInfo?.member?.id,
  }
  raffleService
    .raffleCheckMember(postData)
    .then((res) => {
      state.prizeBalance = res || 0
    })
    .catch((err) => {
      state.prizeBalance = 0
    })
}
function getPrizeAndAward(rafflingId) {
  rafflingId = rafflingId || state.rafflingId
  uni.showLoading({
    title: '抽奖活动加载中',
    mask: true,
  })
  raffleService
    .getRaffleActivityById(rafflingId)
    .then((res) => {
      if (res && res.prizes) {
        const wheelFanShapes = [] // 查询到的奖品
        const nowTotalRate = 0 // 获奖的总概率
        res.turntableDTOS.forEach((item, index) => {
          // wheelFanShapes.push(item);
          // nowTotalRate += item.rate * 100;
          state.turntableDTOS.some((table, index1) => {
            if (item.turntableSort === table.turntableSort || index + 1 === table.turntableSort) {
              state.turntableDTOS[index1] = {
                ...table,
                ...item,
                rate: item.rate * 100,
              }
            }
            return item.turntableSort === table.turntableSort || index + 1 === table.turntableSort
          })
        })
        // 添加未中奖选项，如果有占比，显示，如果未中奖概率为0，不显示
        // wheelFanShapes.push({
        //   prizeRate: 100 - nowTotalRate,
        //   name: "未中奖"
        // })
        state.navigationBarTitle = res.name
        state.background = res.background
        state.turntableDTOS = state.turntableDTOS
        state.raffleActivityRule = res.raffleActivityRule ? res.raffleActivityRule.split('\n') : []
        state.colour = res.colour
        state.score = res.score
        state.prizes = res.prizes
        state.wheelFanShapes = wheelFanShapes
        state.raffling.activityMbrDayRaffleCount = res.activityMbrDayRaffleCount
        state.raffling.activityPrizeBalance = res.activityPrizeBalance
        state.raffling.activityPrizeTotal = res.activityPrizeTotal
        state.raffling.mbrRaffleCount = res.mbrRaffleCount
        uni.hideLoading()
        // 绘制扇形区域
        // this.initBigWheel();
      } else {
        uni.hideLoading()
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
      })
      uni.hideLoading()
    })
}
function clickDrawPrize() {
  if (!canClick) {
    return false
  }
  uni.hideLoading()
  // wx.showLoading({
  //   title: "正在抽奖，请稍等",
  //   mask: true
  // })
  if (!app.globalData.userInfo || !app.globalData.userInfo.member) {
    uni.showToast({
      title: '请先进行登录~',
      icon: 'none',
    })
    return false
  }
  if (state.timeOut) {
    clearInterval(state.timeOut)
    state.timeOut = null
    state.active = 1
  }
  const that = this

  // 先判断是否可以抽奖，即抽奖机会大于0
  // if (this.data.raffling.selfDayCount <= 0) {
  //   wx.showToast({
  //     title: '今日机会已用完~',
  //     icon: "none"
  //   })
  //   return;
  // }
  // const animation = wx.createAnimation({
  //   duration: 5000,
  //   timingFunction: 'ease',
  // })
  // // 初始化转盘，将转盘置为出事状态
  // animation.rotate(0).step({
  //   duration: 5,
  //   timingFunction: 'step-end'
  // });
  // this.setData({
  //   animationData: animation.export()
  // })

  canClick = false
  // 需要消耗积分抽奖 则提示再去抽奖
  if (state.score > 0 && state.prizeBalance > 0) {
    uni.showModal({
      title: '',
      content: '本次需要花费' + state.score + '积分',
      success(res) {
        if (res.confirm) {
          goPrizedFun()
        } else if (res.cancel) {
          canClick = true
        }
      },
    })
  } else {
    goPrizedFun()
  }
}
function goPrizedFun() {
  const that = this
  const timeOut = setInterval(() => {
    state.active = state.active < 8 ? state.active + 1 : 1
    if (state.turntableSort === state.active) {
      clearInterval(state.timeOut)
      state.timeOut = null
    }
  }, 200)
  state.timeOut = timeOut
  const postData = {
    raffleActivityId: state.rafflingId,
    memberId: app.globalData.userInfo?.member?.id,
  }
  // 调用抽奖接口，转动大转盘
  raffleService
    .draw(postData)
    .then((res) => {
      // let totalLen = this.data.wheelFanShapes.length;
      // var rorate = 0; // 转盘应该旋转的角度
      state.rafflePrizeId = res.rafflePrizeId
      state.raffleComment = res.raffleComment
      state.raffleImageUrl = res.imageUrl
      state.rafflePrizeName = res.rafflePrizeName
      state.couponActivityName = res.couponActivityName
      if (res.cashStatus !== 'NOPRIZE') {
        // 如果当前有中奖项，找出对应的奖项
        setTimeout(() => {
          // if(res.turntableSort === this.data.active && this.data.timeOut) {
          // clearInterval(this.data.timeOut);
          // this.setData({
          //   timeOut: null,
          //   active: null
          // })
          // }
          state.turntableSort = res.turntableSort
        }, 4000)
        // this.data.turntableDTOS.some((item) => {
        //   if (item.turntableSort === res.turntableSort) {
        //     // let keyItem = null;
        //     // this.data.prize.some(prize => {
        //     //   if(prize.key === item.turntableSort) {
        //     //     keyItem = prize
        //     //   }
        //     //   return prize.key === item.turntableSort
        //     // })
        //     if(res.turntableSort === this.data.active && this.data.timeOut) {
        //       clearInterval(this.data.timeOut);
        //       this.setData({
        //         timeOut: null,
        //         active: null
        //       })
        //     }
        //     // 找出抽出的对应奖项,计算出转盘应该旋转的角度
        //     // rorate = 270 - (2 * index + 1) / totalLen * 180;
        //   }
        //   return item.turntableSort === res.turntableSort
        // })
        // this.data.wheelFanShapes.forEach((item, index) => {
        //   if (item.id === res.rafflePrizeId) {
        //     // 找出抽出的对应奖项,计算出转盘应该旋转的角度
        //     // rorate = 270 - (2 * index + 1) / totalLen * 180;
        //   }
        // })
      } else {
        if (state.timeOut) {
          setTimeout(() => {
            clearInterval(state.timeOut)
            state.timeOut = null
            state.active = null
          }, 4600)
        }
        // rorate = 270 - (2 * totalLen - 1) / totalLen * 180;
      }

      // 旋转三圈后加上应该停止的旋转角度
      // animation.rotate(1080 + rorate).step({
      //   duration: 5000
      // });
      // this.setData({
      //   animationData: animation.export()
      // })

      setTimeout(
        function () {
          console.log(res)
          uni.hideLoading()
          canClick = true
          if (res.cashStatus !== 'NOPRIZE') {
            this.toggle('prize')
          } else {
            this.toggle('noPrize')
          }
        }.bind(this),
        5000,
      )

      // 查询已抽奖次数
      getDayOpenIdDrawnCount()
      // 查奖品列表
      getRaffleRecords()
      getNumber()
    })
    .catch((err) => {
      canClick = true
      uni.hideLoading()
      console.log(err)
      if (state.timeOut) {
        clearInterval(state.timeOut)
        state.timeOut = null
        state.active = null
        state.turntableSort = null
      }
      if (err.code === 41009) {
        uni.showToast({
          title: '抽奖活动不在进行中',
          icon: 'none',
          duration: 2000,
        })
      } else if (err.code === 41011) {
        uni.showToast({
          title: '可抽奖次数不足',
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
function getDayOpenIdDrawnCount() {
  raffleService
    .getRaffleActivityById(state.rafflingId)
    .then((res) => {
      state.raffling.activityPrizeBalance = res.activityPrizeBalance
      state.raffling.activityPrizeTotal = res.activityPrizeTotal
      getRaffleRecords()
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function getRaffleRecords() {
  const postData = {
    activityIdEquals: state.rafflingId,
    memberIdEquals: app.globalData.userInfo?.member?.id,
    page: 1,
    pageSize: 0,
  }
  raffleService
    .getRecords(postData)
    .then((res) => {
      const list = res.records.filter((item) => {
        return item.cashStatus != 'NOPRIZE'
      })
      state.raffleRecords = list
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function initBigWheel() {
  canClick = false
  console.log('绘制扇形区域========', _ctx)
  const self = this
  // 在给定矩形内清空一个矩形
  _ctx.clearRect(0, 0, 250 * rate, 250 * rate)
  // strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
  _ctx.setStrokeStyle('red')
  // font 属性设置或返回画布上文本内容的当前字体属性
  _ctx.font = '16px Microsoft YaHei'
  const total = state.wheelFanShapes.length // 奖品总数量，即扇区总数量
  const rotateRate = 0.5 + 1 / total // 旋转角度比率
  const list = []
  for (let i = 1; i <= state.wheelFanShapes.length; i++) {
    let sAngle = 0
    let eAngle = 0 // 结束弧度默认为0
    if (i === 1) {
      sAngle = 0
      eAngle = (i / total) * 2
    } else {
      sAngle = ((i - 1) / total) * 2 // 从第二个扇区开始，每个扇区的开始弧度为上一轮扇区的结束弧度和
      eAngle = (i / total) * 2
    }
    drawItemFanShape(state.wheelFanShapes[i - 1], i - 1, sAngle, eAngle, rotateRate, list)
  }
}
function drawItemFanShape(val, index, sAngle, eAngle, rotateRate, list) {
  console.log('奖品信息 ==== ', val)
  const self = this
  const colors = ['#FFFFFF', '#F3EAFF'] // 不同扇区的颜色
  try {
    uni.getImageInfo({
      src: val.imageUrl.replace('http://', 'https://'),
      success: function (res) {
        console.log('getImageInfo ==== success', res)
        _ctx.beginPath()
        _ctx.moveTo(125 * rate, 125 * rate)
        _ctx.arc(125 * rate, 125 * rate, 110 * rate, sAngle * Math.PI, eAngle * Math.PI)
        _ctx.setFillStyle(colors[index % 2])
        _ctx.fill()
        _ctx.save()
        // 绘制奖品文字
        _ctx.setFontSize(12) // 设置文字字号大小
        _ctx.setFillStyle('#000') // 设置文字颜色
        _ctx.setTextAlign('center') // 使文字垂直居中显示
        _ctx.setTextBaseline('middle') // 使文字水平居中显示
        _ctx.translate(125 * rate, 125 * rate) // 将原点移至圆形圆心位置
        _ctx.rotate((sAngle + rotateRate) * Math.PI) // 旋转文字
        _ctx.fillText(val.name, 0, -(110 * rate * 0.8))
        // 绘制奖品图片
        _ctx.drawImage(res.path, -15, -(110 * rate * 0.7), 25, 30)
        _ctx.restore()
        console.log(_ctx)
        if (state.canvasFinished) {
          uni.hideLoading()
        }
        _ctx.draw(true, function () {
          list.push(index)
          if (list.length >= state.wheelFanShapes.length) {
            canClick = true
            canvasToPath()
            uni.hideLoading()
          }
        })
      },
      fail: function (err) {
        uni.hideLoading()
        console.log('getImageInfo ==== error', err)
      },
    })
  } catch (error) {
    uni.hideLoading()
    console.log(error)
  }
}
function canvasToPath() {
  const self = this
  setTimeout(function () {
    uni.canvasToTempFilePath(
      {
        x: 0,
        y: 0,
        width: 250 * rate,
        height: 250 * rate,
        destWidth: 500 * rate,
        destHeight: 500 * rate,
        canvasId: 'wheelCanvas',
        fileType: 'png',
        success(res) {
          // 设置图片路径，显示转化后的图片
          console.log('canvas转图片成功', res.tempFilePath)
          uploadTempFile(res)
          state.canvasImgPath = res.tempFilePath
          state.canvasFinished = true
        },
        fail: function (err) {
          console.log(err)
        },
      },
      self,
    )
  }, 800)
}
function uploadTempFile(res) {
  const that = this
  const request = _apiRequestJs
  console.log('上传图片')
  console.log(request.TENANT)
  console.log(request.BASE_URL + '/newretail/api/dfs/upload')
  uni.uploadFile({
    url: request.BASE_URL + '/newretail/api/dfs/upload',
    filePath: res.tempFilePath,
    name: 'file',
    formData: {
      user: 'test',
    },
    header: {
      'wxa-appid': request.APP_ID,
    },
    success(res) {
      if (res) {
        console.log('上传成功')
        console.log(JSON.parse(res.data))
        console.log(JSON.parse(res.data).data.url)
      }
    },
    fail(e) {
      console.log('=============')
      console.log(e)
    },
  })
}
function toggleRulesPopup() {
  toggle('rules')
}
function togglePrizePopup() {
  if (state.raffleRecords.length === 0) {
    uni.showToast({
      title: '暂无中奖记录',
      icon: 'none',
      duration: 2000,
    })
  } else {
    toggle('prizeRecord')
  }
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true
    if (app.globalData.userInfo?.member) {
      state.isMember = true
      state.member = app.globalData.userInfo.member
    }
  } else {
    state.hasUserInfo = false
    state.isMember = false
    state.member = null
    state.userInfo = null
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e)
    .then((res) => {
      state.hasUserInfo = true
      if (res.member) {
        state.member = res.member
        state.isMember = true
      } else {
        NAVPAGE.toAuthorize()
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
function toAuthorize() {
  NAVPAGE.toAuthorize()
}
function toMyCoupon() {
  state.prizes.some((item, index) => {
    if (item.id == state.rafflePrizeId) {
      if (item.rafflePrizeType == 'SCORE') {
        NAVPAGE.toScoreDetails()
      } else {
        NAVPAGE.toMyCoupon()
      }
    }
    return item.id == state.rafflePrizeId
  })
  toggle('prize')
}
function toPrize(e) {
  const rafflePrizeId = e.currentTarget.dataset.id
  state.prizes.some((item, index) => {
    if (item.id == rafflePrizeId) {
      if (item.rafflePrizeType == 'SCORE') {
        NAVPAGE.toScoreDetails()
      } else {
        NAVPAGE.toMyCoupon()
      }
    }
    return item.id == rafflePrizeId
  })
}
function closePrize() {
  toggle('prize')
  state.active = null
  state.turntableSort = null
}
function closeNoPrize() {
  toggle('noPrize')
}
</script>
<style scoped>
.navigation-bar-top {
  width: 100%;
}

.container {
  width: 100vw;
  height: calc(100vh - 130rpx);
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.container .raffleBalance {
  position: relative;
  height: 80rpx;
  line-height: 80rpx;
  color: #fff;
  text-align: center;
  /* margin-top: -135rpx; */
}
.container .raffleBalance text {
  font-weight: 700;
}
.container .bg-img {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  /* z-index: -99; */
}
.container .bg-img-title {
  width: 750rpx;
  height: 302rpx;
}
.container .bg-img-title image {
  width: 100%;
  height: 100%;
}
.big-wheel-box {
  position: absolute;
  top: 50%;
  transform: translateY(-30%);
  width: 640rpx;
  height: 720rpx;
}
.big-wheel-box .big-wheel-bg {
  width: 100%;
  height: 100%;
}
.big-wheel-box canvas,
.big-wheel-box .canvas-img {
  width: 530rpx;
  height: 530rpx;
  position: absolute;
  top: 27rpx;
  left: 27rpx;
}
.big-wheel-box canvas,
.big-wheel-box .canvas-img image {
  width: 530rpx;
  height: 530rpx;
}
.big-wheel-box .big-wheel-pointer {
  width: 144rpx;
  height: 144rpx;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -160rpx;
  margin-left: -69rpx;
}

.handle-btn {
  position: absolute;
  bottom: 80rpx;
  width: 100%;
  display: flex;
}
.handle-btn button {
  position: relative;
  border-radius: 50rpx;
  color: #ad040b;
  width: 282rpx;
  height: 82rpx;
  line-height: 82rpx;
  font-size: 30rpx;
  margin: 10rpx auto;
  background: linear-gradient(#fda83a, #f6426f);
  font-weight: 700;
}
.handle-btn button image {
  position: absolute;
  left: 0;
  top: 0;
  width: 282rpx;
  height: 82rpx;
}
.handle-btn button view {
  position: relative;
}
.popup-box {
  /* width: 562rpx; */
  background: #fff;
  border-radius: 30rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.popup-close {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  right: 32rpx;
  top: 53rpx;
}

.popup-close image {
  width: 40rpx;
  height: 40rpx;
}

.popup-title {
  color: #1c1c1c;
  font-size: 34rpx;
  font-weight: 400;
  line-height: 54rpx;
  margin-top: 44rpx;
  font-weight: 700;
}

.popup-content {
  padding: 30rpx;
  padding-bottom: 50rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  width: 100%;
  box-sizing: border-box;
}

.color_text {
  color: #ff5601;
  font-size: 28rpx;
  font-weight: 700;
}
.prize-box-bg {
  min-height: 440rpx;
}

.prize-box-bg .close {
  text-align: center;
  padding-top: 20rpx;
}

.prize-box-bg .close image {
  width: 60rpx;
  height: 60rpx;
}

.prize-box {
  width: 600rpx;
  min-height: 360rpx;
  background: #ee5148;
  border-radius: 20rpx;
  padding-bottom: 20rpx;
}

.prize-box .popup-box-title {
  height: 120rpx;
  line-height: 120rpx;
  color: #fdcc9f;
  text-align: center;
}

.prize-box .prizeName {
  width: 520rpx;
  min-height: 120rpx;
  border-radius: 20rpx;
  line-height: 120rpx;
  text-align: center;
  font-weight: 600;
  position: relative;
}

.prize-box .prizeName .coupon-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
}

.prize-box .prizeName .name {
  position: absolute;
  left: 0;
  width: 480rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 20rpx;
}

.prize-box .prizeName .name image {
  vertical-align: middle;
  width: 80rpx;
  height: 45rpx;
}

.prize-box .prizeBtn {
  height: 60rpx;
  width: 280rpx;
  background-color: #fdcc9f;
  border-radius: 16rpx;
  text-align: center;
  line-height: 60rpx;
  color: #9a2801;
  margin-top: 30rpx;
}
.prizeUrl {
  width: 80%;
  max-height: 700rpx;
  height: auto;
  margin-bottom: 20rpx;
}
.prizeList {
  height: 60rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx 10rpx;
  /* border-bottom: 1rpx solid #f0f0f0; */
}

.prizeInfo {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: space-between;
  flex: 1;
  font-size: 26rpx;
}

.prizeInfo .prizeName {
  font-size: 26rpx;
  height: 50rpx;
  line-height: 50rpx;
  color: #ff5601;
}

.prizeInfo .prizeTime {
  height: 50rpx;
  line-height: 50rpx;
  text-align: left;
  width: 300rpx;
}
.prizeJumpBtn {
  width: 140rpx;
  height: 44rpx;
}
.prizeJumpBtn button {
  width: 104rpx;
  height: 44rpx;
  line-height: 44rpx;
  padding: 0 12rpx;
  border-radius: 44rpx;
  background-color: #ff5601;
  color: #fff;
  font-size: 26rpx;
  /* margin-top: 25rpx; */
  margin-left: 50rpx;
}

.no-prize {
  width: 600rpx;
  min-height: 280rpx;
  padding: 20rpx 0;
  box-sizing: border-box;
}

.no-prize .prizeName {
  height: 190rpx;
  line-height: 190rpx;
}

.no-prize .prizeBtn {
  height: 60rpx;
  width: 280rpx;
  background-color: #ee5148;
  border-radius: 16rpx;
  text-align: center;
  line-height: 60rpx;
  color: #fff;
}
.prize_title {
  display: flex;
  width: 685rpx;
  margin: 38rpx 30rpx 0;
  justify-content: space-between;
  background-color: #ffddcc;
  border-radius: 21rpx;
  height: 42rpx;
  align-items: center;
  font-size: 26rpx;
  color: #030303;
}
.prize_title view {
  flex: 1;
  text-align: center;
}
.prize_title .flex_2 {
  flex: 2;
}
.prize_title .flex_3 {
  flex: 3;
}

.prize_content {
  /* position: absolute;
  top: 0;
  left:0; */
  display: flex;
  width: 630rpx;
  flex-wrap: wrap;
}

.prize_content > view {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #f8ede8;
  margin: 5rpx;
  border-radius: 30rpx;
  overflow: hidden;
  font-size: 28rpx;
}
.prize_content .active {
  background-color: #fadacb;
}
.prize_content > view image {
  width: 132rpx;
  height: 132rpx;
  margin-bottom: 10rpx;
}
.rule {
  width: 170rpx;
  height: 40rpx;
  line-height: 40rpx;
  position: absolute;
  right: 0;
  top: 50rpx;
  font-size: 28rpx;
  border-radius: 20rpx 0 0 20rpx;
  background-color: #f8ede891;
  color: #f8ede8;
}
.prize_detail {
  height: 200rpx;
  /* padding: 15rpx 10rpx; */
  box-sizing: border-box;
  width: 60rpx;
  position: absolute;
  color: #fff;
  right: 0;
  top: 120rpx;
  font-size: 30rpx;
  border-radius: 20rpx 0 0 20rpx;
  background-color: rgb(253, 116, 116);
}
.prize_detail view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.prize_content > view .btn-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  margin-bottom: 0;
}
.prize_content > view .btn_text {
  position: relative;
  font-size: 18rpx;
  color: #fff;
  margin-top: 70rpx;
  z-index: 1;
}
</style>
