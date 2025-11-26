<template>
<!--pages/mallModule/activity/penny/helpPenny/helpPenny.wxml-->
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<!-- 支付完分享 -->
<view class="top-info share" v-if="state.type === 'share' && state.loading">
  <image class="top-bg" :src="state.imagesPath.iconPeneryShare" mode="widthFix" lazy-load="false"></image>
  <view class="panny-rules" @click="togglePennyRulesPopup">
    <image :src="state.imagesPath.iconPenneryRules" mode="widthFix" lazy-load="false"></image>
  </view>
  <view class="share-box">
    <view class="penny-goods-info" @click="toPennyDetails">
      <view class="penny-goods-img">
        <image :src="pennyDetail.activityImageUrl || pennyDetail.productImage" mode="widthFix"></image>
      </view>
      <view>
        <text class="name">{{pennyDetail.name}}</text>
        <view class="progress-box">
          <progress :percent="progress" stroke-width="13" active="" border-radius="8" activeColor="#ef2630" backgroundColor="#e0e0e0"></progress>
          <text class="progress-text">{{progress}}%</text>
          <text v-if="time.day !== '00' && time.day !== 0">仅剩{{time.day}}天开奖</text>
          <text v-else-if="time.hou !== '00' && time.hou !== 0">仅剩{{time.hou}}小时开奖</text>
          <text v-else-if="time.min !== '00' && time.min !== 0">仅剩{{time.min}}分钟开奖</text>
          <text v-else-if="time.sec !== '00' && time.sec !== 0">仅剩{{time.sec}}秒开奖</text>
          <text v-else>{{state.isInTheOpeningAward ? "开奖中" : "已开奖"}}</text>
        </view>
      </view>
    </view>
    <view class="button-box">
      <text v-if="!state.isInTheOpeningAward">邀请{{pennyDetail.helperNumber}}位好友参与，就能获得中奖资格</text>
      <text v-if="state.isInTheOpeningAward && state.instance.helperNumber < state.instance.minHelpNumber">您未获得中奖资格</text>
      <text v-if="state.isInTheOpeningAward && state.instance.helperNumber >= state.instance.minHelpNumber">您已获得中奖资格</text>
      <button class="share-btn" v-if="state.isInTheOpeningAward">开奖中</button>
      <button class="share-btn" @click="toggleSharePopup" v-else-if="state.instance.helperNumber < state.instance.minHelpNumber">立即获取抽奖资格({{state.instance.helperNumber}}/{{state.instance.minHelpNumber}})</button>
      <button class="share-btn" @click="toggleSharePopup" v-else>已获取抽奖资格({{state.instance.helperNumber}}/{{state.instance.minHelpNumber}})</button>
      <text>已有{{state.instance.helperNumber}}人帮您助力,助力越多中奖几率越大</text>
    </view>
  </view>
</view>
<!-- 助力 -->
<view class="top-info help" v-if="state.type === 'help' && state.loading">
  <image class="top-bg" :src="state.imagesPath.iconPeneryHelp20190924" mode="widthFix" lazy-load="false" v-if="state.isHelp"></image>
  <image class="top-bg" :src="state.imagesPath.iconPeneryUnHelp" mode="widthFix" lazy-load="false" v-else></image>
  <view class="panny-rules" @click="togglePennyRulesPopup">
    <image :src="state.imagesPath.iconPenneryRules" mode="widthFix" lazy-load="false"></image>
  </view>
  <view class="help-box">
    <view class="goods-info">
      <view class="goods-info-img">
        <image :src="pennyDetail.activityImageUrl || pennyDetail.productImage" mode="widthFix"></image>
      </view>
      <view class="info">
        <text class="name">{{pennyDetail.name}}</text>
        <view class="progress-box">
          <progress :percent="progress" stroke-width="13" active="" border-radius="8" activeColor="#FF9F43" backgroundColor="#e0e0e0"></progress>
          <text v-if="time.day !== '00' && time.day !== 0">仅剩{{time.day}}天开奖</text>
          <text v-else-if="time.hou !== '00' && time.hou !== 0">仅剩{{time.hou}}小时开奖</text>
          <text v-else-if="time.min !== '00' && time.min !== 0">仅剩{{time.min}}分钟开奖</text>
          <text v-else-if="time.sec !== '00' && time.sec !== 0">仅剩{{time.sec}}秒开奖</text>
          <text v-else>{{state.isInTheOpeningAward ? "开奖中" : "已开奖"}}</text>
        </view>
        <view class="price-num">
          <view class="price">
            <view class="now-price">￥
              <text>{{pennyDetail.actualPrice}}</text>
            </view>
            <view class="old-price" v-if="originalPrice">￥{{originalPrice}}</view>
          </view>
          <view class="num">共抽
            <text>{{pennyDetail.prizeQuantity}}</text>件</view>
        </view>
      </view>
    </view>
  </view>
  <view class="button-box">
    <view v-if="state.instance.status === 'CREATE' && state.isHelp">
      <text>助力成功！</text>
      <button v-if="state.isInTheOpeningAward">开奖中</button>
      <button @click="toPennyList" v-else-if="!state.hasPenny">我也要抢</button>   
      <button @click="toMyHelpPennyDetails" v-else>查看我的抽奖</button>
    </view>
    <view v-else-if="state.instance.status === 'CREATE' && !state.isHelp">
      <text v-if="state.isHelpLimit">当前助力次数已达上限！</text>
      <view v-if="state.isHelpLimit">
        <button v-if="state.isInTheOpeningAward">开奖中</button>
        <button @click="toPennyList" v-else-if="!state.hasPenny">我也要抢</button>   
        <button @click="toMyHelpPennyDetails" v-else>查看我的抽奖</button>
      </view>
      <view v-else>
        <button v-if="!state.hasUserInfo" class="authorization" @click="getUserInfo">帮好友助力</button>
        <form v-else @submit="help">
          <button form-type="submit" :disabled="state.disabledHelp">帮好友助力</button>
        </form>
      </view>
    </view>
    <view v-else>
      <text>活动已结束了，看看其他的活动吧！</text>
      <button @click="toPennyList">立即抢其他奖品</button>
    </view>
  </view>
</view>
<!-- 结果 -->
<view class="top-info result" v-if="state.type === 'result' && state.loading">
  <image class="top-bg" :src="state.imagesPath.iconPeneryHelp" mode="widthFix" lazy-load="false"></image>
  <view class="result-box">
    <view class="goods-name">{{pennyDetail.name}}</view>
    <view class="result-text" v-if="state.instance.status === 'CREATE' || state.instance.status === 'NOPRIZE'">未中奖，试试其他商品吧</view>
    <view class="result-text" v-else>恭喜您中奖啦！</view>
    <view class="more-penny" @click="toPennyList">立抢更多奖品</view>
    <text class="penny-text" @click="checkWinningDetails">查看中奖详情</text>
  </view>
</view>
<!-- 推荐商品 -->
<recommend-list :storeId="state.storeId" v-if="state.loading"></recommend-list>
<popup :show="state.show.bottom" position="bottom" custom-class="bottom" @close="toggleSharePopup">
  <view class="penny-share-box">
    <view class="title">助力好友越多，中奖率越高！</view>
    <view class="share-button-box">
      <text>邀请好友助力</text>
      <text>才能获得中奖资格</text>
      <button open-type="share" @click="subscriptionMessagePopup">
        <image class="share-btn-bg" :src="state.imagesPath.iconPenneryWeChet"></image>
      </button>
      <text class="share-tips">分享给好友助力</text>
    </view>
  </view>
</popup>
<popup :show="state.show.pennyRules" position="middle" custom-class="middle" @close="togglePennyRulesPopup">
  <view class="penny-rules-box">
    <view class="penny-rules-popup">
      <view class="title">
        <image class="left-icon" :src="state.imagesPath.iconPeneryLine"></image>
        <text>活动规则</text>
        <image class="right-icon" :src="state.imagesPath.iconPeneryLine"></image>
      </view>
      <view class="close">
        <image :src="state.imagesPath.iconCloseImg2" @click="togglePennyRulesPopup"></image>
      </view>
      <scroll-view class="rules-content-box" scroll-y="">
        <text>1.购买相关商品，支付页面所示活动价参与抽奖活动，支付完成后邀请规定数量好友帮忙助力即可获得抽奖资格。助力好友越多，获奖的概率越大，助力第1名必中（助力点相同，达成时间最早者中）。</text>
        <text>2.同一个商品活动，每个用户只能参加一次，每天每人最多助力3次；可参加多个购物抽奖活动。</text>
        <text>3.开奖及退款规则如下：</text>
        <text>当活动时间结束后，活动开奖。中奖者奖品将会根据参与抽奖时所填收货地址1-3天内寄出，遇节假日顺延；如果未填收货地址或者所填信息错误导致无法收货，则取消活动中奖资格；开奖前取消订单退款的，中奖资格随之取消。</text>
        <text>4.对于同一商品，同一中奖用户（包括但不限于同一手机号、手机设备等）只能参与一次，否则视为无效。</text>
        <text>5.严禁用户使用任何不正当手段或作弊行为参与本活动。一经发现，美食林有权取消该用户的所有中奖资格，情节严重的，我们将依法保留诉讼权利。</text>
      </scroll-view>
    </view>
  </view>
</popup>
<popup :show="state.show.people" position="middle" custom-class="middle" @close="togglePeoplePopup">
  <view class="penny-people-box">
    <view class="penny-people-popup">
      <view class="title">
        <image class="left-icon" :src="state.imagesPath.iconPeneryLine"></image>
        <text>幸运得主</text>
        <image class="right-icon" :src="state.imagesPath.iconPeneryLine"></image>
      </view>
      <view class="close">
        <image :src="state.imagesPath.iconCloseImg2" @click="togglePeoplePopup"></image>
      </view>
      <scroll-view class="people-list" scroll-y="false">
        <view class="people-item" v-for="(item , index) in state.peopleList" :key="id">
          <view>
            <image :src="item.avatar" mode="widthFix"></image>
            <view class="member-info">
              <text>{{item.creatorName}}</text>
              <text>{{filters.filtMobile(item.mobile)}}</text>
            </view>
          </view>
          <text class="help-number">{{item.helperNumber}}人助力</text>
        </view> 
      </scroll-view>
      <view class="penny-people-tips">奖品会在3天内（遇节假日顺延）发货，请注意保持电话畅通，以免影响奖品发放！</view>  
    </view>
  </view>
</popup>
<popup :show="state.show.address" position="middle" custom-class="middle" @close="toggleAddressPopup">
  <view class="penny-address-popup">
    <view class="title">奖品收货地址</view>
    <view class="close">
      <image :src="state.imagesPath.iconCloseImg2" @click="toggleAddressPopup"></image>
    </view>
    <view class="section name">
      <text class="label">收货姓名</text>
      <view class="input-box">
        <input placeholder="姓名(必填)" name="name" :value="state.userName" placeholder-class="placeholder" maxlength="10" @input="handleName">
        <view class="wechet-address" @click="chooseWeChetAddress">
          <image :src="state.imagesPath.iconPenneryWeChet"></image>
          自动填写
        </view>
      </view>
    </view>
    <view class="section">
      <text class="label">手机号码</text>
      <view class="input-box">
        <input placeholder="请输入您的手机号(必填)" type="number" :value="state.telNumber" name="telNumber" placeholder-class="placeholder" @input="handlePhone">
      </view>
    </view>
    <view class="section address">
      <text class="label">选择地区</text>
      <view class="input-box">
        <picker mode="region" class="region" @change="bindRegionChange" :value="state.region" name="region" :custom-item="customItem">
          <view class="address-picker" v-if="state.region[0]">{{state.region[0]}} {{state.region[1]}} {{state.region[2]}}</view>
          <view class="address-picker" v-else>请选择地址</view>
        </picker>
        <view class="select-address" @click="chooseAddress">
          <image :src="state.imagesPath.iconPeneryAddress"></image>
          自动选址
        </view>
      </view>
    </view>
    <view class="section">
      <text class="label">详细地址</text>
      <view class="input-box">
        <input placeholder="街道门牌信息(必填)" name="detailInfo" :value="state.detailInfo" placeholder-class="placeholder" @input="handleDetails">
      </view>
    </view>
    <view class="warn-box" v-if="state.showWarn">
      <icon type="warn" size="12" color="#fe0000">请确认详细地址
    </icon></view>
    <view :class="'button-box ' + (disabled ? 'disabled' : '')" @click="handleSave">保存</view>
  </view>
</popup>
<popup :show="state.show.prompt" position="middle" custom-class="middle" @close="togglePromptPopup">
  <view class="penny-prompt-popup">
    <view class="title">温馨提示</view>
    <view class="close">
      <image :src="state.imagesPath.iconCloseImg2" @click="togglePromptPopup"></image>
    </view>
    <view class="prompt-content">
      <text>您还没有填写收货地址</text>
      <text>可能导致中奖后收不到奖品</text>
      <text>是否确认关闭？</text>
    </view>
    <view class="prompt-button-box">
      <view class="cancel" data-type="cancel" @click="togglePromptPopup">取消</view>
      <view class="confirm" data-type="confirm" @click="togglePromptPopup">确认</view>
    </view>
  </view>
</popup>
<popup :show="state.show.penny" position="middle" custom-class="middle" @close="togglePennyPopup">
  <view :class="'popup-penny ' + (!state.hasCoupon ? 'noCoupon' : '')">
    <view class="popup-penny-box" v-if="state.hasCoupon">
      <view v-if="state.couponType === 'HELP'">
        <view class="title">助力成功！</view>
        <view class="penny-text">好友送你一份最高
          <text>50元</text>红包哦~</view>
      </view>
      <view v-else>
        <view class="title">很遗憾您没有中奖</view>
        <view class="penny-text">系统自动送您一份最高
          <text>50元</text>红包~</view>
      </view>
      <image class="popup-image" :src="state.imagesPath.iconBargainCoupon" mode="widthFix"></image>
      <view class="bottom-button-box">
        <view class="coupon" @click="toMyCoupon">查看我的优惠券</view>
        <view class="penny" @click="toPennyList">我也要抢</view>
      </view>
    </view>
    <view class="popup-penny-box noCoupon" v-else>
      <view class="title">
        助力成功！
      </view>
      <view class="bottom-button-box">
        <view class="coupon" @click="toPennyList">我也要抢</view>
      </view>
    </view>
    <view class="popup-penny-close" @click="togglePennyPopup">
      <image class="popup-close" :src="state.imagesPath.iconIndexPopupClose" mode="widthFix"></image>
    </view>
  </view>
</popup>
<image class="movable-view" v-if="state.homeBack" :src="state.imagesPath.toHome" @click="toHome"></image></view>
</template>
<script setup>
import _utilsSubscribeMessageJs from "@/utils/newretail/subscribeMessage";
import _utilsLogJs from "@/utils/newretail/log";
import _libsQqmapWxJssdkMinJs from "@/libs/qqmap-wx-jssdk";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiAddressServiceJs from "@/service/api/newretail/addressService";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiPennyServiceJs from "@/service/api/newretail/pennyService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import recommendList from '@/pages-sub/newretail/components/recommend/recommend-list-two/recommend-list.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/mallModule/activity/penny/helpPenny/helpPenny.js
const pennyService = _apiPennyServiceJs;
const productService = _apiProductServiceJs;
const orderService = _apiOrderServiceJs;
const addressService = _apiAddressServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const ANALYSIS = _utilsAnalysisJs;
const AUTHORIZE = _utilsAuthorizeJs;
const ADDRESS = _utilsAddressJs;
const NAVPAGE = _utilsNavPageJs;
const UTILS = _utilsUtilsJs;
let QQMapWX = _libsQqmapWxJssdkMinJs;
let qqmapsdk;
const log = _utilsLogJs;
const subscribeMessage = _utilsSubscribeMessageJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "购物抽奖",
  imagesPath: IMGAGESPATH,
  type: "help",
  // share,help,result
  storeId: null,
  isInitiateTheLotteryPeople: true,
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    pennyRules: false,
    people: false,
    address: false,
    prompt: false,
    penny: false
  },
  userName: '',
  region: ['', '', ''],
  telNumber: '',
  detailInfo: '',
  instance: null,
  isHelp: false,
  showWarn: false,
  hasUserInfo: false,
  isMember: false,
  member: null,
  peopleList: [],
  homeBack: false,
  isCreator: false,
  hasPenny: false,
  isInTheOpeningAward: false,
  loading: false,
  hasCoupon: false,
  isHelpLimit: false,
  disabledHelp: false,
  couponType: "HELP" // HELP,NOPRIZE
});
let customData = {
  hasMyInstanceQueryCount: false,
  onLoad: false,
  isCreate: false,
  // 是否是从创建订单过来
  isShowAddress: false // 是否显示过更新地址弹窗
};
function initPage() {
  const self = this;
  state.storeId = app.globalData.storeInfo.id;
  state.storeInfo = app.globalData.storeInfo;
  if (options.instanceId) {
    getPennyInstance(options.instanceId);
  }
}
onLoad(function (options) {
  let pageStack = getCurrentPages();
  if (pageStack.length === 1) {
    state.homeBack = true;
  }
  // 只能通过按钮转发
  uni.hideShareMenu();
  // 实例化API核心类
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey
    });
  });
  if (options.isCreate != null && JSON.parse(options.isCreate) === true) {
    // 用户可以更新地址信息
    customData.isCreate = true;
  }
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
    initPage(); // 初始化页面内容
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation().then(res => {
      app.globalData.storeInfo = res;
      // 统计PV
      ANALYSIS.PVStatistics(res.id);
      initPage(); // 初始化页面内容
    }).catch(err => {
      console.log(err);
    });
  }
});
onReady(function () {});
onShow(function () {
  checkUserInfo();
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function (res) {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res);
    const instanceId = state.instance.id;
    let imgUrl = state.pennyDetail.shareImageUrl;
    const name = state.pennyDetail.name;
    let memberId = "";
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      memberId = app.globalData.userInfo.member.id;
    }
    return {
      title: '麻烦点一下，只差一个人就拿到' + name + '了～',
      path: '/pages-sub/newretail/pages/mallModule/activity/penny/helpPenny/helpPenny?instanceId=' + instanceId + "&shareId=" + memberId,
      imageUrl: imgUrl,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true
        });
      }
    };
  }
});
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    state.userInfo = app.globalData.userInfo.wxaUser;
    if (app.globalData.userInfo.member) {
      state.isMember = true;
      state.member = app.globalData.userInfo.member;
      checkIsHelp();
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e).then(res => {
    state.hasUserInfo = true;
    state.userInfo = res.wxaUser;
    if (res.member) {
      state.isMember = true;
      state.member = res.member;
      checkIsHelp();
    } else {
      NAVPAGE.toAuthorize();
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getPennyInstance(id) {
  const self = this;
  pennyService.getInstanceById(id).then(res => {
    if (!res) {
      return;
    }
    let isCreator = false;
    // 判断当前实例是否自己打开的
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      if (app.globalData.userInfo.member.id === res.memberId) {
        isCreator = true;
      }
    }
    let instance = {
      ...res
    };
    // 控制显示
    let type = isCreator ? "share" : "help";
    if (type === "share") {
      type = res.status === "CREATE" ? "share" : "result";
    }
    // 不是本人检查是否已经助力
    state.instance = instance;
    state.type = type;
    state.isCreator = isCreator;
    if (!isCreator && res.status === "CREATE") {
      checkIsHelp();
    }
    if (res.status === "CREATE" && isCreator && customData.isCreate && !customData.isShowAddress) {
      // 如果是从商品详情页面创建实例进入页面，弹出更新地址弹窗，弹窗只弹一次
      checkDistribution();
    }
    const postData = {
      page: 1,
      pageSize: 1,
      activityIdEquals: res.activityId
    };
    return pennyService.query(postData);
  }).then(res => {
    // 查询活动信息
    if (!res || !res.records || res.records.length === 0) {
      // 没有查到抽奖数据
      return;
    }
    const _data = res.records[0];
    let hasCoupon = false;
    if (_data.couponActivityId) {
      hasCoupon = true;
    }
    // 处理购物抽奖活动倒计时
    state.pennyDetail = _data;
    state.hasCoupon = hasCoupon;
    const startDate = _data.startTime; // 活动创建时间
    const endDate = _data.endTime; // 活动结束时间
    const startTimeStamp = new Date(_data.startTime.replace(/-/g, '/')).getTime(); // 开始时间时间戳
    const endTimeStamp = new Date(_data.endTime.replace(/-/g, '/')).getTime(); // 开始时间时间戳
    const duration = (endTimeStamp - startTimeStamp) / 1000 > 0 ? parseInt((endTimeStamp - startTimeStamp) / 1000) : 0; // 活动持续时间
    console.log(duration);
    const nowTime = new UTILS.ResponseDate().getTime();
    if (state.instance.status === "NOPRIZE" && nowTime < endTimeStamp) {
      // 如果实例状态为未中奖而活动还未结束则说明是主动退款，跳转商品详情
      uni.redirectTo({
        url: '/pages-sub/newretail/pages/mallModule/activity/penny/goodsDetail/goodsDetail?id=' + _data.id
      });
      return;
    }
    // 处理未中奖送券
    state.loading = true;
    if (state.instance.status === "NOPRIZE" && state.instance.couponIds && state.instance.couponIds !== "") {
      hasCoupon = true;
      state.hasCoupon = hasCoupon;
      state.couponType = "NOPRIZE";
      togglePennyPopup();
    }
    // 设置进度
    const progress = getProgress();
    state.progress = progress;
    if (duration > 0) {
      countDown();
    }

    // 执行倒计时函数
    function countDown() {
      clearTimeout(state.pennyTimeId);
      // 获取倒计时
      let timeInfo = [];
      // 将活动的结束时间参数提成一个单独的数组，方便操作
      timeInfo.push({
        openTeamTime: startDate,
        duration: duration
      });
      let countDownArr = UTILS.countDownDay(timeInfo, false);
      // 设置进度
      const progress = getProgress();
      state.time = countDownArr[0];
      state.progress = progress;
      if (countDownArr[0].day === "00" && countDownArr[0].hou === "00" && countDownArr[0].min === "00" && countDownArr[0].sec === "00") {
        if (state.instance.status === "CREATE") {
          state.isInTheOpeningAward = true;
        }
      } else {
        let time = setTimeout(function () {
          countDown();
        }, 1000);
        state.pennyTimeId = time;
      }
    }

    // 设置进度条
    function getProgress() {
      const now = new UTILS.ResponseDate().getTime();
      const timeElapsed = (now - startTimeStamp) / 1000 > 0 ? parseInt((now - startTimeStamp) / 1000) : 0;
      const progress = timeElapsed / duration > 0 ? parseInt(timeElapsed / duration * 100) : 0;
      return progress;
    }
  }).catch(err => {
    console.log(err.message);
    UTILS.showToast(err.message);
  });
}
function help() {
  const self = this;
  state.disabledHelp = true;
  if (state.type !== "help") {
    state.disabledHelp = false;
    return;
  }
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    state.disabledHelp = false;
    NAVPAGE.toAuthorize();
    return;
  }
  const postData = {
    instanceId: state.instance.id,
    memberId: app.globalData.userInfo.member.id
  };
  pennyService.help(postData).then(res => {
    state.isHelp = true;
    state.hasCoupon && togglePennyPopup();
    getPennyInstance(options.instanceId);
  }).catch(err => {
    // 特殊处理助力次数已达上限
    state.disabledHelp = false;
    if (err.code === 55010) {
      UTILS.showToast("当前助力次数已达上限");
      state.isHelpLimit = true;
    } else {
      UTILS.showToast(err.message);
    }
  });
}
function checkIsHelp() {
  const self = this;
  if (state.type !== "help") {
    return;
  }
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    return;
  }
  if (!state.instance) {
    return;
  }
  const postData = {
    instanceId: state.instance.id,
    memberId: app.globalData.userInfo.member.id
  };
  pennyService.isHelp(postData).then(res => {
    state.isHelp = res;
  }).catch(err => {
    UTILS.showToast(err.message);
  });
  if (!state.isCreator) {
    // 检查会员是否有示例
    queryMyInstance();
  }
}
function queryMyInstance() {
  const that = this;
  if (!customData.hasMyInstanceQueryCount) {
    if (!state.instance) {
      return;
    }
    let postData = {
      page: 1,
      pageSize: 0,
      activityIdEquals: state.instance.activityId,
      memberIdEquals: app.globalData.userInfo.member.id,
      statusIn: ["CREATE", "PRIZED", "NOPRIZE"]
    };
    pennyService.queryInstance(postData).then(res => {
      if (!res || !res.records || res.records.length === 0) {
        return;
      }
      customData.hasMyInstanceQueryCount = true;
      if (res.records.length > 0) {
        const data = res.records[0];
        customData.myInstanceId = data.id;
        state.hasPenny = true;
      }
    }).catch(err => {
      UTILS.showToast(err.message);
    });
  }
}
function checkWinningDetails() {
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    // 没有会员信息
    return;
  }
  if (state.peopleList.length > 0) {
    togglePeoplePopup();
    return;
  }
  const that = this;
  const postData = {
    page: 1,
    pageSize: 0,
    activityIdEquals: state.instance.activityId,
    statusIn: ["PRIZED"]
  };
  pennyService.queryInstance(postData).then(res => {
    if (res && res.records && res.records.length >= 0) {
      res.records.sort(UTILS.compare('helperNumber')); //排序，从小到大
      const tempList = res.records.reverse();
      state.peopleList = tempList;
      togglePeoplePopup();
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function toggleSharePopup() {
  toggle('bottom');
}
function togglePennyRulesPopup() {
  toggle('pennyRules');
}
function togglePeoplePopup() {
  toggle('people');
}
function toggleAddressPopup(e) {
  if (e !== true) {
    togglePromptPopup();
  }
  toggle('address');
}
function togglePennyPopup() {
  toggle('penny');
}
function togglePromptPopup(e) {
  if (e && e.currentTarget.dataset.type) {
    if (e.currentTarget.dataset.type === "cancel") {
      toggleAddressPopup(true);
    }
  }
  toggle('prompt');
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function chooseWeChetAddress() {
  const that = this;
  uni.chooseAddress({
    success(res) {
      state.userName = res.userName;
      state.telNumber = res.telNumber;
      state.region = [res.provinceName, res.cityName, res.countyName];
      state.detailInfo = res.detailInfo;
    }
  });
}
function bindRegionChange(e) {
  let that = this;
  state.region = e.detail.value;
}
function handleName(e) {
  if (e.detail.cursor < 10) {
    state.userName = e.detail.value;
  } else if (e.detail.cursor === 10) {
    state.userName = e.detail.value;
    uni.showToast({
      title: '联系人昵称最大不能超10个字符哦~',
      icon: 'none',
      duration: 2000
    });
  } else {}
}
function handlePhone(e) {
  state.telNumber = e.detail.value;
}
function handleDetails(e) {
  state.detailInfo = e.detail.value;
  if (e.detail.value === "") {
    state.showWarn = false;
  }
}
function chooseAddress() {
  const that = this;
  const region = state.region;
  console.log(region);
  uni.chooseLocation({
    success: function (res) {
      // success
      console.log(res, "location");
      let regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
      let province = [];
      let addressBean = {
        province: null,
        country: null,
        city: null,
        address: null
      };
      let addressName = res.name;
      function regexAddressBean(address, addressBean) {
        regex = /^(.*?[市]|.*?地区|.*?特别行政区|.*?盟|.*?自治州)(.*?[市区县旗])(.*?)$/g;
        let addxress = regex.exec(address);
        console.log(addxress);
        addressBean.city = addxress[1];
        addressBean.country = addxress[2];
        addressBean.address = addxress[3];
      }
      if (!(province = regex.exec(res.address))) {
        regex = /^(.*?(省|自治区))(.*?)$/;
        province = regex.exec(res.address);
        if (province) {
          addressBean.province = province[1];
          regexAddressBean(province[3], addressBean);
        } else {
          let regexe = /^(.*?)\((.+?)\)$/g;
          let data = regexe.exec(res.address);
          console.log(data);
          console.log(region);
          let latitude = res.latitude;
          let longitude = res.longitude;
          UTILS.inverseAnalysisAddress(latitude, longitude).then(res => {
            console.log(res);
            addressBean.province = res.data.result.addressComponent.province;
            addressBean.city = res.data.result.addressComponent.city;
            addressBean.country = res.data.result.addressComponent.county;
            addressBean.address = res.data.result.addressComponent.poi;
            state.region = [addressBean.province, addressBean.city, addressBean.country];
          });
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
          if (!data) {
            return;
          }
          addressBean.address = data[2];
          addressName = data[1];
        }
      } else {
        addressBean.province = province[1];
        if (res.poiid && res.poiid === 'City') {
          // 处理IOS第一行数据返回有错
          let regexe = /^(.*?)\((.+?)\)$/g;
          let data = regexe.exec(res.name);
          console.log(data);
          let latitude = res.latitude;
          let longitude = res.longitude;
          UTILS.inverseAnalysisAddress(latitude, longitude).then(res => {
            console.log(res);
            addressBean.province = res.data.result.addressComponent.province;
            addressBean.city = res.data.result.addressComponent.city;
            addressBean.country = res.data.result.addressComponent.county;
            addressBean.address = res.data.result.addressComponent.poi;
            state.region = [addressBean.province, addressBean.city, addressBean.country];
          });
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
          if (!data) {
            return;
          }
          addressBean.address = data[2];
          addressName = data[1];
        } else {
          regexAddressBean(res.address, addressBean);
        }
      }
      console.log(addressBean);
      if (addressBean.address !== '') {
        state.detailedLabelShow = true;
      }
      state.detailInfo = addressBean.address;
      state.region = [addressBean.province, addressBean.city, addressBean.country];
      state.showWarn = true;
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  });
}
function handleSave(e) {
  // 保存地址
  let self = this;
  let reg = /^[1]([3-9])[0-9]{9}$/;
  let tel = /^0\d{2,3}-?\d{7,8}$/;
  if (!state.userName) {
    uni.showToast({
      title: "请输入联系人姓名",
      icon: 'none',
      duration: 2000
    });
  } else if (!state.telNumber) {
    uni.showToast({
      title: "请输入联系方式",
      icon: 'none',
      duration: 2000
    });
  } else if (!reg.test(state.telNumber) && !tel.test(state.telNumber)) {
    uni.showToast({
      title: "请输入正确的联系方式",
      icon: 'none',
      duration: 2000
    });
  } else if (state.region[0] === '') {
    uni.showToast({
      title: "请选择省市区",
      icon: 'none',
      duration: 2000
    });
  } else if (!state.detailInfo) {
    uni.showToast({
      title: "请填写详细地址",
      icon: 'none',
      duration: 2000
    });
  } else {
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      let defaultAddress = state.region[0] + state.region[1] + state.region[2] + state.detailInfo;
      UTILS.addressResolution(defaultAddress).then(res => {
        if (res && res.data && res.data.location) {
          console.log(res);
          // 新增地址
          let postData = {
            city: state.region[1],
            // 收货地址： 市区
            contacts: state.userName,
            // 收货人名称
            contactsMobile: state.telNumber,
            // 收货人手机
            county: state.region[2],
            // 收货地址： 县区
            detailedAddress: state.detailInfo,
            // 详细收货街道地址
            houseNum: " ",
            // 门牌号
            latitude: res.result.location.lat,
            // 纬度
            longitude: res.result.location.lng,
            // 经度
            memberId: app.globalData.userInfo.member.id,
            // 用户id
            orderId: state.instance.orderId,
            // 订单id
            province: state.region[0] // 收货地址： 省区
          };
          pennyService.updateAddressByOrederId(postData).then(res => {
            // 保存地址
            UTILS.showToast("保存成功~");
            toggleAddressPopup(true);
          }).catch(err => {
            console.log(err.message);
            UTILS.showToast("保存地址失败~");
          });
        } else {
          UTILS.showToast("地址解析失败，请重新选择地址~");
        }
      });
      // qqmapsdk.geocoder({
      //   address: self.data.region[0] + self.data.region[1] + self.data.region[2] + self.data.detailInfo,
      //   success: function (res) {
      //     console.log(res);
      //     // 新增地址
      //     let postData = {
      //       city: self.data.region[1], // 收货地址： 市区
      //       contacts: self.data.userName, // 收货人名称
      //       contactsMobile: self.data.telNumber, // 收货人手机
      //       county: self.data.region[2], // 收货地址： 县区
      //       detailedAddress: self.data.detailInfo, // 详细收货街道地址
      //       houseNum: " ", // 门牌号
      //       latitude: res.result.location.lat, // 纬度
      //       longitude: res.result.location.lng, // 经度
      //       memberId: app.globalData.userInfo.member.id, // 用户id
      //       orderId: self.data.instance.orderId, // 订单id
      //       province: self.data.region[0] // 收货地址： 省区
      //     }
      //     pennyService.updateAddressByOrederId(postData).then(res => {
      //       // 保存地址
      //       UTILS.showToast("保存成功~")
      //       self.toggleAddressPopup(true)
      //     }).catch(err => {
      //       console.log(err.message)
      //       UTILS.showToast("保存地址失败~")
      //     })
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   }
      // });
    }
  }
}
function toPennyDetails() {
  if (state.show.penny) {
    togglePennyPopup();
  }
  let opts = "?id=" + state.pennyDetail.id;
  if (state.isCreator) {
    opts = opts + "&back=true";
  }
  NAVPAGE.toPennyDetail(opts);
}
function toMyHelpPennyDetails() {
  const opts = "?instanceId=" + customData.myInstanceId;
  NAVPAGE.toHelpPenny(opts);
}
function toPennyList() {
  NAVPAGE.toPennyList();
}
function toHome() {
  NAVPAGE.toHome();
}
function toMyCoupon() {
  NAVPAGE.toMyCoupon();
}
function checkDistribution() {
  const that = this;
  try {
    let address = uni.getStorageSync('wj_chooseAddressInfo');
    if (address) {
      // 缓存中有默认地址
      state.userName = address.contacts;
      state.region = [address.province, address.city, address.county];
      state.telNumber = address.contactsMobile;
      state.detailInfo = address.detailedAddress + address.houseNum;
      customData.isShowAddress = true;
      toggleAddressPopup(true);
    } else {
      // 缓存中没有默认地址
      addressService.getDefaultAddress().then(res => {
        if (res) {
          // 有默认地址
          state.userName = res.contacts;
          state.region = [res.province, res.city, res.county];
          state.telNumber = res.contactsMobile;
          state.detailInfo = res.detailedAddress + res.houseNum;
          customData.isShowAddress = true;
          toggleAddressPopup(true);
          uni.setStorage({
            key: "wj_chooseAddressInfo",
            data: res
          });
        } else {
          // 无默认地址
          uni.getLocation({
            type: 'gcj02',
            success: function (res) {
              let latitude = res.latitude;
              let longitude = res.longitude;
              // 查询所有地址
              addressService.query().then(res => {
                console.log(res);
                if (res.length > 0) {
                  let allAddress = res;
                  let tempIndex = getNearestAddress(allAddress, latitude, longitude);
                  uni.setStorage({
                    key: "wj_chooseAddressInfo",
                    data: allAddress[tempIndex]
                  });
                  const address = allAddress[tempIndex];
                  state.userName = address.contacts;
                  state.region = [address.province, address.city, address.county];
                  state.telNumber = address.contactsMobile;
                  state.detailInfo = address.detailedAddress + address.houseNum;
                } else {
                  // 没有地址
                }
                customData.isShowAddress = true;
                toggleAddressPopup(true);
              }).catch(err => {
                customData.isShowAddress = true;
                toggleAddressPopup(true);
                UTILS.showToast(err.message);
              });
            }
          });
        }
      }).catch(err => {
        UTILS.showToast(err.message);
      });
    }
  } catch (err) {
    customData.isShowAddress = true;
    toggleAddressPopup(true);
    console.log(err);
  }
}
function getNearestAddress(allAddress, latitude, longitude) {
  let distanceArr = [];
  allAddress.forEach(item => {
    let dis = UTILS.distance(latitude, longitude, item.latitude, item.longitude);
    distanceArr.push(dis);
  });
  // 计算最小值
  const minN = Math.min.apply(Math, distanceArr);
  let tempIndex = 0;
  for (let i = 0; i < distanceArr.length; i++) {
    if (minN === distanceArr[i]) {
      tempIndex = i;
      break;
    }
  }
  return tempIndex;
}
function subscriptionMessagePopup(val) {
  // 查询订阅消息
  if (app.globalData.templateIdsQuery) {
    handleSubscribeMessage();
  } else {
    subscribeMessage.getTemplateIds().then(res => {
      handleSubscribeMessage();
    }).catch(err => {
      console.log(err.message);
      log.warn("查询模板id报错：", err.message);
    });
  }
  function handleSubscribeMessage() {
    let templateIds = [];
    templateIds = subscribeMessage.handleTemplateIds(subscribeMessage.scene.RAFFLE_PRIZED);
    console.log(templateIds);
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res);
            log.info(res);
            subscribeMessage.addSubscribe(subscribeMessage.scene.RAFFLE_PRIZED, res);
          },
          fail(err) {
            console.log(err);
            log.warn(err);
          }
        });
      } else {
        log.warn('api wx.requestSubscribeMessage 当前版本不支持');
      }
    } else {
      log.info('模板id未获取到');
    }
  }
}
</script>
<style scoped>
/* pages/mallModule/activity/penny/helpPenny/helpPenny.wxss */

.top-info {
  width: 750prx;
  position: relative;
}

.top-info.share {
  height: 594rpx;
  padding-top: 168rpx;
  box-sizing: border-box;
}

.top-info.help {
  padding-top: 236rpx;
}

.top-info.result {
  padding-top: 84rpx;
}

.top-info .top-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.result .top-bg {
  height: 375rpx;
}

.help .top-bg {
  height: 374rpx;
}

.share-box {
  width: 700rpx;
  height: 386rpx;
  background: #fff;
  border-radius: 6rpx;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 抽奖商品详情 */

.penny-goods-info {
  border-bottom: 2rpx solid #f3f3f3;
  padding: 14rpx 16rpx 16rpx;
  color: #151515;
  display: flex;
}

.penny-goods-info .penny-goods-img {
  width: 90rpx;
  height: 90rpx;
  margin-right: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}



.penny-goods-info image {
  width: 100%;
  height: 100%;
}

.penny-goods-info .name {
  font-size: 26rpx;
  line-height: 46rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 560rpx;
}

.penny-goods-info .progress-box {
  font-size: 22rpx;
  color: #5a5b5d;
  line-height: 36rpx;
  display: flex;
  align-items: center;
  margin-top: 9rpx;
  position: relative;
}

.penny-goods-info .progress-box progress {
  width: 158rpx;
  height: 24rpx;
  margin-right: 9rpx;
}

.penny-goods-info .progress-box .progress-text {
  font-size: 16rpx;
  position: absolute;
  width: 136rpx;
  height: 24rpx;
  line-height: 24rpx;
  text-align: center;
  display: block;
  color: #fff;
}

.penny-goods-info .join-num {
  font-size: 24rpx;
  line-height: 48rpx;
  color: #000;
  margin-top: 9rpx;
}

.share-box .button-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 26rpx;
  line-height: 48rpx;
  color: #676767;
}

.share-box .button-box text {
  display: block;
}

.share-box .button-box text:first-of-type {
  font-size: 30rpx;
  color: #000;
  margin: 32rpx 0 18rpx 0;
}

.share-box .button-box .share-btn {
  background: #e02e24;
  color: #fff;
  width: 630rpx;
  height: 90rpx;
  font-size: 36rpx;
  line-height: 90rpx;
  padding: 0;
  margin-bottom: 15rpx;
}

/* 抽奖结果部分 */

.result-box {
  width: 700rpx;
  height: 414rpx;
  background: #fff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 8rpx;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.result-box view {
  text-align: center;
}

.result-box .goods-name {
  padding-top: 21rpx;
  font-size: 28rpx;
  line-height: 48rpx;
  font-family: SourceHanSansCN-Regular;
  font-weight: 400;
  color: #202020;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-box .result-text {
  font-size: 48rpx;
  line-height: 64rpx;
  font-family: SourceHanSansCN-Medium;
  font-weight: bold;
  color: #565759;
  margin: 48rpx auto 38rpx;
}

.result-box .more-penny {
  width: 642rpx;
  height: 90rpx;
  font-size: 32rpx;
  line-height: 90rpx;
  color: #fff;
  border-radius: 8rpx;
  background: #e02e24;
  margin: 0 auto 26rpx;
}

.result-box .penny-text {
  font-size: 28rpx;
  line-height: 48rpx;
  color: #161616;
  display: block;
  width: 100%;
  text-align: center;
}

/* 助力人看到部分 */

.help-box {
  width: 643rpx;
  height: 352rpx;
  background: #fff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 8rpx;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 0 27rpx;
}

.help .button-box {
  width: 628rpx;
  min-height: 90rpx;
  margin: 47rpx auto 30rpx auto;
}

.help .button-box text {
  font-size: 36rpx;
  line-height: 36rpx;
  margin-bottom: 37rpx;
  display: block;
  text-align: center;
}

.help .button-box button {
  width: 628rpx;
  height: 90rpx;
  background: #e02e24;
  border-radius: 8rpx;
  font-size: 36rpx;
  font-family: SourceHanSansCN-Regular;
  font-weight: 400;
  color: #fff;
}

.help-box .goods-info {
  display: flex;
  padding-top: 29rpx;
}

.help-box .goods-info-img {
  width: 294rpx;
  height: 294rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.help-box .goods-info image {
  width: 294rpx;
  height: 294rpx;
}

.help-box .goods-info .info {
  width: calc(100% - 340rpx);
  margin-left: 20rpx;
}

.help-box .goods-info .info .name {
  font-size: 30rpx;
  line-height: 38rpx;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2rpx;
}

.help-box .goods-info .info .progress-box {
  font-size: 24rpx;
  color: #181818;
  line-height: 36rpx;
  display: flex;
  align-items: center;
  margin-top: 22rpx;
  position: relative;
}

.help-box .goods-info .info .progress-box progress {
  width: 158rpx;
  height: 26rpx;
  margin-right: 9rpx;
}

.help-box .goods-info .info .progress-box text {
  font-size: 16rpx;
  position: absolute;
  width: 136rpx;
  height: 24rpx;
  line-height: 24rpx;
  text-align: center;
  display: block;
  color: #fff;
}

.help-box .goods-info .info .price-num {
  font-size: 24rpx;
  line-height: 48rpx;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 114rpx;
}

.help-box .goods-info .info .price-num .price {
  display: flex;
  align-items: baseline;
}

.help-box .goods-info .info .price-num .price .now-price {
  font-size: 24rpx;
  color: #f23428;
}

.help-box .goods-info .info .price-num .price .now-price text {
  font-size: 48rpx;
}

.help-box .goods-info .info .price-num .price .old-price {
  color: #ccc;
  font-size: 24rpx;
  text-decoration: line-through;
}

.help-box .goods-info .info .price-num .num text {
  color: #f23428;
}

/* 分享弹窗 */

.penny-share-box {}

.penny-share-box .title {
  font-size: 40rpx;
  color: #dcb320;
  line-height: 62rpx;
  text-align: center;
  display: block;
}

.share-button-box {
  background: #fff;
  padding-top: 34rpx;
  text-align: center;
  padding-bottom: 28rpx;
}

.share-button-box text {
  font-size: 36rpx;
  line-height: 66rpx;
  color: #1b1b1b;
  display: block;
}

.share-button-box button {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-bottom: 6rpx;
  margin-top: 25rpx;
}

.share-button-box button .share-btn-bg {
  width: 78rpx;
  height: 60rpx;
}

.share-button-box text.share-tips {
  font-size: 26rpx;
  line-height: 46rpx;
  color: #47484a;
}

.panny-rules {
  width: 74rpx;
  height: 36rpx;
  position: absolute;
  right: 0;
  top: 13rpx;
}

.panny-rules image {
  width: 74rpx;
  height: 36rpx;
}

/* 规则弹窗 */

.penny-rules-box {
  padding: 30rpx;
}

.penny-rules-popup {
  width: 500rpx;
  padding: 24rpx 40rpx 48rpx;
  background: #fff;
  color: #626262;
  border-radius: 16rpx;
  font-size: 28rpx;
  line-height: 45rpx;
  position: relative;
}

.penny-rules-popup .title {
  font-size: 32rpx;
  line-height: 48rpx;
  width: 100%;
  text-align: center;
  margin-bottom: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D57C00;
}

.penny-rules-popup .title text {
  margin-bottom: 0;
}

.penny-rules-popup .title image {
  width: 166rpx;
  height: 4rpx;
}


.penny-rules-popup .title image.left-icon {
  transform: rotate(180deg);
  margin-right: 18rpx;
}

.penny-rules-popup .title image.right-icon {
  margin-left: 18rpx;
}

.penny-rules-popup text {
  display: block;
  margin-bottom: 12rpx;
}

.penny-rules-popup .close {
  width: 58rpx;
  height: 58rpx;
  position: absolute;
  right: -29rpx;
  top: -29rpx;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.penny-rules-popup .close image {
  width: 40rpx;
  height: 40rpx;
}

.rules-content-box {
  height: 580rpx;
}

/* 幸运得主弹窗 */

.penny-people-box {
  padding: 30rpx;
}

.penny-people-popup {
  width: 500rpx;
  padding: 24rpx 40rpx;
  min-height: 640rpx;
  background: #fff;
  color: #626262;
  border-radius: 16rpx;
  font-size: 28rpx;
  line-height: 45rpx;
  position: relative;
}

.penny-people-popup .title {
  font-size: 32rpx;
  line-height: 48rpx;
  width: 100%;
  text-align: center;
  margin-bottom: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D57C00;
}

.penny-rules-popup .title text {
  margin-bottom: 0;
}

.penny-people-popup .title image {
  width: 166rpx;
  height: 4rpx;
}

.penny-people-popup .title image.left-icon {
  transform: rotate(180deg);
  margin-right: 18rpx;
}

.penny-people-popup .title image.right-icon {
  margin-left: 18rpx;
}

.penny-people-popup text {
  display: block;
  margin-bottom: 12rpx;
}

.penny-people-popup .close {
  width: 58rpx;
  height: 58rpx;
  position: absolute;
  right: -29rpx;
  top: -29rpx;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.penny-people-popup .close image {
  width: 40rpx;
  height: 40rpx;
}

/* 得奖人列表 */

.people-list {
  margin-top: 18rpx;
  height: 540rpx;
}

.penny-people-tips {
  font-size: 24rpx;
  text-align: center;
  color: #666666;
  padding-top: 14rpx;
}

.people-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  color: #101010;
  margin-bottom: 12rpx;
}

.people-item:last-of-type {
  margin-bottom: 0;
}

.people-item image {
  width: 70rpx;
  height: 70rpx;
  background: #f2efef;
  border-radius: 50%;
  margin-right: 13rpx;
}

.people-item>view:first-of-type {
  display: flex;
}

.people-item .member-info {
  font-size: 24rpx;
  line-height: 36rpx;
  color: #8c8c8c;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.people-item .member-info text {
  display: block;
}

.people-item .member-info text:first-of-type {
  font-size: 30rpx;
  color: #101010;
  margin-bottom: 4rpx;
}

.people-item .help-number {
  background: rgba(190, 208, 234, 0.4);
  width: 161rpx;
  height: 46rpx;
  font-size: 24rpx;
  line-height: 46rpx;
  color: #101010;
  text-align: center;
  margin-bottom: 0;
}

.people-item:first-of-type .help-number {
  background: rgba(255, 204, 0, 0.6);
}

/* 添加收货地址弹窗 */

.penny-address-popup {
  background: #fff;
  width: 642rpx;
  min-height: 505rpx;
  border-radius: 10rpx;
  position: relative;
  padding: 0 24rpx 28rpx 24rpx;
}

.penny-address-popup .title {
  font-size: 36rpx;
  line-height: 72rpx;
  color: #000;
  width: 100%;
  text-align: center;
  padding-top: 14rpx;
  padding-bottom: 22rpx;
}

.penny-address-popup .close {
  will-change: 80rpx;
  height: 80rpx;
  position: absolute;
  right: 20rpx;
  top: 36rpx;
}

.penny-address-popup image {
  width: 40rpx;
  height: 40rpx;
}

.section {
  height: 108rpx;
  border-bottom: 2rpx solid #e9e9e9;
  display: flex;
  align-items: center;
  font-size: 30rpx;
}

.section:last-of-type {
  border-bottom: none;
}

.section .label {
  color: #0a111a;
}

.section .input-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30rpx;
  width: calc(100% - 150rpx);
}

.section input {
  color: #666666;
}

.placeholder {
  color: #c8c8c8;

}

.name .wechet-address {
  font-size: 26rpx;
  color: #41b035;
  display: flex;
  align-items: center;
  width: 174rpx;
  position: relative;
  justify-content: flex-end;
}

.name .wechet-address image {
  width: 39rpx;
  height: 30rpx;
  margin-right: 9rpx;
}

.address .select-address {
  font-size: 26rpx;
  color: #ff7200;
  display: flex;
  align-items: center;
  width: 174rpx;
  position: relative;
  justify-content: flex-end;
}

.address picker {
  width: 360rpx;
  height: 108rpx;
  line-height: 108rpx;
}

.address-picker {
  color: #000;
  height: 100%;
}

.region {
  width: 506rpx;
  position: relative;
}

.address .select-address image {
  width: 28rpx;
  height: 40rpx;
  margin-right: 22rpx;
}

.name .wechet-address::before,
.address .select-address::before {
  content: "";
  display: block;
  height: 50rpx;
  width: 2rpx;
  background: #e9e9e9;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -25rpx;
}

.penny-address-popup .button-box {
  width: 580rpx;
  height: 84rpx;
  font-size: 32rpx;
  line-height: 84rpx;
  color: #fff;
  background: #eb3728;
  text-align: center;
  border-radius: 9rpx;
  margin: 24rpx auto 0 auto;
}

.penny-address-popup .button-box.disabled {
  background: #ccc;
}

.warn-box {
  font-size: 24rpx;
  color: #e02e24;
  display: flex;
  align-items: center;
}

.warn-box icon {
  margin-right: 10rpx;
}

/* 温馨提示弹窗 */

.penny-prompt-popup {
  background: #fff;
  width: 642rpx;
  height: 446rpx;
  border-radius: 10rpx;
  position: relative;
  padding: 0;
  overflow: hidden;
}

.penny-prompt-popup .title {
  font-size: 36rpx;
  line-height: 72rpx;
  color: #000;
  width: 100%;
  text-align: center;
  padding-top: 14rpx;
  padding-bottom: 22rpx;
}

.penny-prompt-popup .close {
  will-change: 80rpx;
  height: 80rpx;
  position: absolute;
  right: 20rpx;
  top: 36rpx;
}

.penny-prompt-popup image {
  width: 40rpx;
  height: 40rpx;
}

.prompt-content {
  font-size: 36rpx;
  line-height: 62rpx;
  text-align: center;
  margin-top: 22rpx;
}

.prompt-content text {
  display: block;
}

.prompt-button-box {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
}

.prompt-button-box view {
  flex: 1;
  height: 100%;
  text-align: center;
  background: #e6e6e6;
  font-size: 36rpx;
  color: #333;
}

.prompt-button-box view.confirm {
  background: #e02e24;
  color: #fff;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  right: 0;
  bottom: 120rpx;
}

/* 弹窗 */

.popup-penny {
  width: 590rpx;
  height: 770rpx;
  padding: 50rpx 0 0 0;
  box-sizing: border-box;
  background: #FFFFFF;
  border-radius: 10rpx;
  font-size: 30rpx;
  color: #333333;
  position: relative;
}

.popup-penny.noCoupon {
  height: 387rpx;
}

.popup-penny-box {
  line-height: 42rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-penny-box .title {
  font-size: 40rpx;
}

.popup-penny-box.noCoupon .title {
  margin-top: 66rpx;
}

.popup-penny-box .price {
  color: #f33;
}

.popup-penny-box .popup-image {
  width: 590rpx;
  height: 386rpx;
  margin-top: 23rpx;
}

.popup-penny-box .penny-text {
  color: #343434;
  margin-top: 16rpx;
}

.popup-penny-box .penny-text text {
  color: #FF3333;
}

.popup-penny-box .bottom-button-box {
  width: 100%;
  height: 200rpx;
  background: #FFEEDE;
  position: absolute;
  left: 0;
  bottom: 0;
}

.popup-penny-box .bottom-button-box .coupon {
  width: 470rpx;
  height: 90rpx;
  background: linear-gradient(90deg, #FF9F43, #EE5253);
  border-radius: 10rpx;
  font-weight: bold;
  line-height: 90rpx;
  text-align: center;
  color: #ffffff;
  margin: 21rpx auto 0;
}

.popup-penny-box.noCoupon .bottom-button-box {
  background: #ffffff;
  height: 148rpx;
}


.popup-penny-box .bottom-button-box .penny {
  color: #F6784B;
  margin-top: 27rpx;
  text-align: center;
}

.popup-penny-close {
  padding-top: 46rpx;
  position: absolute;
  bottom: -124rpx;
  width: 104rpx;
  height: 104rpx;
  left: 50%;
  margin-left: -52rpx;
}

.popup-penny-close image {
  width: 52rpx;
  height: 52rpx;
}
</style>