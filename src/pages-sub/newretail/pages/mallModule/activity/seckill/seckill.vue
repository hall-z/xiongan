<template>
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<image :src="state.imagesPath.seckill_list_bg" class="seckill_list_bg"></image>
<!-- banner 图片 -->
<view class="banner-box" v-if="state.banners.length > 0">
  <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" circular="true">
    <view v-for="(item , index) in state.banners" :key="index">
      <swiper-item class="swiper-item" :data-id="item.id" @click="bannerJumping">
        <image :src="item.pictureUrl" class="slide-image"></image>
      </swiper-item>
    </view>
  </swiper>
</view>
<image :src="state.imagesPath.seckill_title" class="seckill_title"></image>
<!-- 时间列表 -->
<scroll-view class="time-list" scroll-x="" style="width: 100%" v-if="state.timeList.length > 0">
  <view v-for="(item , idx) in state.timeList" :key="index" :data-idx="idx" :class="'time-item ' + (state.tabSelected == idx ? 'active' : '')" @click="clickCategory">
    <image class="tab-bg" v-if="state.tabSelected == idx" :src="state.tabSelected == idx ? state.imagesPath.seckill_time_bg : state.imagesPath.iconSeckillUnselect" mode="widthFix"></image>
    <view class="center">
      <text>{{item.time}}</text>
      <text>{{item.status}}</text>
    </view>
    <!-- <view class="triangle"></view> -->
  </view>
</scroll-view>
<!-- 倒计时 -->
<view class="time-down" v-if="state.timeList.length > 0">
  <image :src="state.imagesPath.seckill_tip_bg" class="seckill_tip_bg" mode="widthFix"></image>
  <view :class="state.secKillStatus">
    <image v-if="state.secKillStatus === 'started'" :src="state.imagesPath.seckill_good_icon" mode="widthFix"></image>
    <image v-if="state.secKillStatus === 'end'" :src="state.imagesPath.iconVoided" mode="widthFix"></image>
    <image v-if="state.secKillStatus === 'ahead'" :src="state.imagesPath.iconWaitBegin" mode="widthFix"></image>
    {{state.secKillTips}}
  </view>
  <view class="time-box" :hidden="state.secKillStatus === 'ahead' ? false : true">
    距开始:
    <text class="last-hour txt">{{state.time.day}}天</text>
    <text class="last-hour txt">{{state.time.hour}}</text>
    <text class="colon">:</text>
    <text class="last-minute txt">{{state.time.minute}}</text>
    <text class="colon">:</text>
    <text class="last-second txt">{{state.time.second}}</text>
  </view>
  <view class="time-box" :hidden="state.secKillStatus === 'started' ? false : true">
    <text class="last-hour txt">{{state.time.hour}}</text>
    <text class="colon">:</text>
    <text class="last-minute txt">{{state.time.minute}}</text>
    <text class="colon">:</text>
    <text class="last-second txt">{{state.time.second}}</text>
  </view>
</view>
<view class="goods-content" v-for="(goodsItem , idx) in state.timeList" :hidden="idx != state.tabSelected" :key="idx">
  <!-- 商品列表 -->
  <view v-for="(item , index) in goodsItem.products" :key="id">
  <view class="goods-item" :data-goodsId="item.productId" :data-activityId="item.activityId" :data-storeId="item.storeId" :data-goodsNum="item.availableStockAmount" :data-balance="item.balance" :data-traceId="item.traceId" :data-type="item.type + ' '" :data-storestatus="item.storeStatus" data-easyScene="none" @click="toGoodsDetail">
    <view class="offshelf" v-if="!(item.availableStockAmount > 0 && item.balance > 0 && item.storeStatus === 'ON')">
      <view class="icon">
        <image :src="offshelficon" mode="widthFix"></image>
      </view>
    </view>
    <view class="goods-img-box">
      <image :src="item.imageUrl"></image>
      <!-- <image class="qiangguang" hidden="{{item.type === 'SPEC' || item.availableStockAmount ></image> 0 || item.storeStatus === 'OFF' ? true : false}}" src="{{state.imagesPath.soldOutIcon}}">
      <image class="qiangguang" hidden="{{item.type === 'SPEC' || item.availableStockAmount ></image> 0 || item.storeStatus !== 'OFF' ? true : false}}" src="{{state.imagesPath.iconLowerShelf}}"> -->
    </view>
    <view class="goods-info">
      <view class="goods-name">
        
        <view><text v-for="(item , index) in item.produtlabel" :key="index" v-if="index < 3" :style="'background-color:rgb(' + item.color + ')'">{{item.labelName}}</text>{{item.productName}}</view>
      </view>
      <text class="goods-desc" v-if="item.productDescription">{{item.productDescription}}</text>
      <view class="progress-row-box">
        <view :class="'progress-box ' + (item.availableStockAmount > 0 && item.balance > 0 && item.storeStatus === 'ON' ? '' : 'end')" v-if="state.secKillStatus === 'started'">
          <view v-if="item.availableStockAmount > 0 && item.balance > 0 && item.storeStatus === 'ON'">
            <view class="progress-text">
              <image :src="state.imagesPath.seckill_good_icon" mode="widthFix" lazy-load="false"></image> 火热抢购中
            </view>
            <progress :percent="(item.totalStockAmount - item.availableStockAmount) / item.totalStockAmount * 100" active="" stroke-width="36" activeColor="#ffd6d9" backgroundColor="#ffffff">
          </progress></view>
          <view v-else>
            <view class="progress-text">
              <image :src="state.imagesPath.seckill_good_icon" mode="widthFix" lazy-load="false"></image> 已抢完
            </view>
            <progress percent="100" active="" stroke-width="36" activeColor="#f8f6f9" backgroundColor="#ffffff">
          </progress></view>
        </view>
        <view class="progress-box" v-else>
          <view class="progress-text">敬请期待</view>
        </view>
        <view class="goods-quantity" v-if="state.secKillStatus === 'started' && item.availableStockAmount > 0 && item.balance > 0 && item.storeStatus === 'ON' && item.availableStockAmount <= 10" :style="'color:' + state.themeColor">
          仅剩 {{item.availableStockAmount}} 件
        </view>
      </view>
      <view class="seckill_price_box">
        <!-- <image src="{{imagesPath.seckill_price_bg}}" class="seckill_price_bg"></image> -->
        <view class="goods-price">
          ￥<text class="nowPrice">{{item.price}}</text>{{item.style == 'SPEC_PARENT' ? '起' : ''}}
          <text class="oldPrice" v-if="item.originalPrice && item.price < item.originalPrice">￥{{filters.filtToFix(item.originalPrice)}}</text>
        </view>
        <!-- <block wx:if="{{state.shopCart[item.productId] || state.distributionShopCart[item.productId]}}">
          <view class="cart-control" wx:if="{{item.business !== 'DISTRIBUTION'}}">
            <block wx:if="{{item.style !== 'MEALS'}}">
              <view class="reduce-box"  style="border: 1px solid {{state.themeColor || '#d9d9d9'}};color: {{state.themeColor || '#d9d9d9'}}" hidden="{{!state.shopCart[item.productId]}}" data-type="reduce" data-productId="{{item.productId}}" data-activityId="{{item.activityId}}" catchtap="addShopCart">
                -
              </view>
              <text class="cart-count">{{state.shopCart[item.productId] ? state.shopCart[item.productId] : ''}}</text>
            </block>
            <view class="add-box"  style="border: 1px solid {{state.themeColor || '#d9d9d9'}};background-color:{{state.themeColor || '#d9d9d9'}}" data-type="add" data-productId="{{item.productId}}" data-activityId="{{item.activityId}}" hidden="{{item.balance <= 0 && item.business !== 'DISTRIBUTION'}}" catchtap="addShopCart">
              +
            </view>
          </view>
          <view class="cart-control" wx:else>
            <block wx:if="{{item.style !== 'MEALS'}}">
              <view class="reduce-box" style="border: 1px solid {{state.themeColor || '#d9d9d9'}};color: {{state.themeColor || '#d9d9d9'}}" hidden="{{!state.distributionShopCart[item.productId]}}" data-type="reduce" data-productId="{{item.productId}}" data-activityId="{{item.activityId}}" catchtap="addShopCart">
                -
              </view>
              <text class="cart-count">{{state.distributionShopCart[item.productId] ? state.distributionShopCart[item.productId] : ''}}</text>
            </block>
            <view class="add-box" style="border: 1px solid {{state.themeColor || '#d9d9d9'}};background-color:{{state.themeColor || '#d9d9d9'}}"  data-type="add" data-productId="{{item.productId}}" data-activityId="{{item.activityId}}" hidden="{{item.balance <= 0 && item.business !== 'DISTRIBUTION'}}" catchtap="addShopCart">
              +
            </view>
          </view>
        </block> -->
        <!-- wx:else -->
        <view>
          <button :style="'background-color:' + ((item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && state.secKillStatus === 'started' && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? state.themeColor : '#d9d9d9')" v-if="state.secKillStatus === 'ahead' && item.storeStatus !== 'OFF'">{{(item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? '马上开始' : '已抢完'}}</button>
          <button :style="'background-color:' + ((item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && state.secKillStatus === 'started' && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? state.themeColor : '#d9d9d9')" v-if="state.secKillStatus === 'ahead' && item.storeStatus === 'OFF'">{{(item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? '马上开始' : '已下架'}}</button>
          <view class="button_view" :data-productId="item.productId" :data-activityId="item.activityId" @click.stop="toPaySecKill" :style="'background-color:' + ((item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && state.secKillStatus === 'started' && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? state.themeColor : '#d9d9d9')" v-if="state.secKillStatus === 'started' && item.storeStatus !== 'OFF'">{{(item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? '马上抢' : '已抢完'}}</view>
          <view class="button_view" :data-productId="item.productId" :data-activityId="item.activityId" @click.stop="toPaySecKill" :style="'background-color:' + ((item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && state.secKillStatus === 'started' && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? state.themeColor : '#d9d9d9')" v-if="state.secKillStatus === 'started' && item.storeStatus === 'OFF'">{{(item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? '马上抢' : '已下架'}}</view>
          <button :style="'background-color:' + ((item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && state.secKillStatus === 'started' && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? state.themeColor : '#d9d9d9')" v-if="state.secKillStatus === 'end' && item.storeStatus !== 'OFF'">{{(item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? '抢购结束' : '已抢完'}}</button>
          <button :style="'background-color:' + ((item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && state.secKillStatus === 'started' && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? state.themeColor : '#d9d9d9')" v-if="state.secKillStatus === 'end' && item.storeStatus === 'OFF'">{{(item.type === 'SPEC' || item.availableStockAmount !== 0 && item.balance !== 0) && item.storeStatus !== 'OFF' && item.storeStatus !== 'DELETED' ? '抢购结束' : '已下架'}}</button>
        </view>
      </view>
    </view>
  </view>
  </view>  
  <view :class="'no-data ' + (state.timeList.length > 0 ? 'time-slot' : '')" :hidden="goodsItem.products.length > 0">
    <image :src="state.imagesPath.noSeckillData"></image>
    <button :style="'color: ' + state.themeColor + '; border: 1rpx solid ' + state.themeColor + ';'" size="mini" @click="toHome">随便逛逛</button>
  </view>
</view>
<view :class="'no-data ' + (state.timeList.length > 0 ? 'time-slot' : '')" :hidden="state.timeList.length > 0">
  <image :src="state.imagesPath.noSeckillData"></image>
  <button :style="'color: ' + state.themeColor + '; border: 1rpx solid ' + state.themeColor + ';'" size="mini" @click="toHome">随便逛逛</button>
</view>
<view :class="'tabbar-height ' + (isIphoneX ? 'iphoneX-height' : '')" v-if="state.showTabbar"></view>
<tabbar :tabbar="state.tabbar" :show="state.showTabbar" @popup="recorderPopup"></tabbar>
<authorize @login="handleUserLogin"></authorize>
<view class="flow-car" @click="toShopCar">
  <image :src="state.imagesPath.flowCart"></image>
  <view class="red-hint" :hidden="!(cartCount > 0)">{{cartCount}}</view>
</view></view>
</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiShopcartServiceJs from "@/service/api/newretail/shopcartService";
import _apiHelpActivityServiceJs from "@/service/api/newretail/helpActivityService";
import _apiBannerServiceJs from "@/service/api/newretail/bannerService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiSeckillServiceJs from "@/service/api/newretail/seckillService";
import offshelficon from '@/utils/newretail/image/offshelficon.png'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/seckill/seckill.js
const seckillService = _apiSeckillServiceJs;
const systemService = _apiSystemServiceJs;
const productService = _apiProductServiceJs;
const bannerService = _apiBannerServiceJs;
const helpActivityService = _apiHelpActivityServiceJs;
const shopcartService = _apiShopcartServiceJs;
const storeService = _apiStoreServiceJs;
const util = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const ADDRESS = _utilsAddressJs;
const IMGAGESPATH = _utilsImagesPathJs;
const wxaUserService = _apiWxaUserServiceJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const utilsSelf = _utilsSelfJs;
import bus from 'iny-bus';
import tabbar from '@/pages-sub/newretail/components/tabbar/tabbar.vue';
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
let canAddToCart = true;
const state = reactive({
  grabActivityDays: 1,
  navigationBarTitle: "限时秒杀",
  imagesPath: IMGAGESPATH,
  tabbar: {},
  showTabbar: false,
  timeList: [],
  goodsList: [],
  tabSelected: 0,
  time: {
    day: '',
    hour: '',
    minute: '',
    second: ''
  },
  secKillStatus: 'started',
  //started 开始 end 结束  ahead 即将开始
  secKillTips: '',
  banners: [],
  secKillTimeId: 0,
  phone: false,
  hasGodsStock: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  shopCart: {},
  //购物车商品数量
  shopCartGoodsId: [],
  //购物车商品id列表
  distributionShopCart: {},
  distributionShopCartGoodsId: [],
  hasUserInfo: false,
  member: {},
  userInfo: {},
  isMember: false,
  vipGradeConfig: null,
  memberPrice: "",
  hasEasyRecPlugins: false
});
let customData = {
  inQuery: false
};
async function getGrabActivityDays() {
  await systemService.query('grabActivityDays').then(res => {
    if (res && res.length > 0) {
      state.grabActivityDays = res[0].value || 1;
    }
  });
}
function toGoodsDetail(val) {
  console.log(val.currentTarget.dataset, "点击的商品");
  const that = this;
  if (state.secKillStatus === 'started' || state.secKillStatus === 'ahead') {
    let goodsId = val.currentTarget.dataset.goodsid;
    let storeId = val.currentTarget.dataset.storeid;
    let activityId = val.currentTarget.dataset.activityid;
    let opts = '?productId=' + goodsId + '&storeId=' + storeId + '&type=secondkill&activityId=' + activityId;
    if (options.shareId) {
      opts = opts + '&shareId=' + options.shareId;
    }
    NAVPAGE.toGoodsDetails(opts);
    // if (val.currentTarget.dataset.balance === 0) {
    //   if (val.currentTarget.dataset.goodsnum === 0) {
    //     wx.showToast({
    //       title: '您来晚了，已经被抢光了',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   } else {
    //     wx.showModal({
    //       title: '提示',
    //       content: '门店正在努力补货中,去其他门店看看吧~',
    //       success: function (res) {
    //         if (res.confirm) {
    //           NAVPAGE.toHome();
    //         } else if (res.cancel) {

    //         }
    //       }
    //     })
    //   }
    // } else {
    //   if (val.currentTarget.dataset.goodsnum === 0 || val.currentTarget.dataset.storestatus !== "ON") {
    //     wx.showToast({
    //       title: '您来晚了，已经被抢光了',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   } else {
    //     let goodsId = val.currentTarget.dataset.goodsid
    //     let storeId = val.currentTarget.dataset.storeid
    //     let activityId = val.currentTarget.dataset.activityid
    //     let opts = '?productId=' + goodsId + '&storeId=' + storeId + '&type=secondkill&activityId=' + activityId;
    //     if (that.options.shareId) {
    //       opts = opts + '&shareId=' + that.options.shareId
    //     }
    //     NAVPAGE.toGoodsDetails(opts);
    //   }
    // }
  } else {
    // let data = new Date().getTime()
    // let index = that.data.tabSelected
    // let startTime = that.data.timeList[index].newStartTime
    // if (startTime - data > 0) {
    //   wx.showToast({
    //     title: '还没有开始喔~',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // } else {
    uni.showToast({
      title: '本场已经结束啦~',
      icon: 'none',
      duration: 2000
    });
    // }
  }
}
function clickCategory(e) {
  state.tabSelected = e.currentTarget.dataset.idx;
  const i = e.currentTarget.dataset.idx;
  const timeList = state.timeList;
  // 调用接口查询商品列表
  state.secKillStatus = timeList[i].secKillStatus;
  state.secKillTips = timeList[i].secKillTips;
  state.time = {
    day: timeList[i].countDownTime.day,
    hour: timeList[i].countDownTime.hou,
    minute: timeList[i].countDownTime.min,
    second: timeList[i].countDownTime.sec
  };
  const activityId = state.timeList[i].id;
  getSeckillProducts(i, activityId, state.storeId);
}
function addDay(curDate, days) {
  return new Date((curDate / 1000 + 86400 * days) * 1000);
}
function getSecKillList(storeId) {
  uni.showLoading({
    title: '加载中'
  });
  const self = this;
  if (customData.customData) {
    console.log("已经在查询中~");
    return;
  }
  customData.customData = true;
  let storeIdIn = [storeId];
  handleGetSecKillList(storeIdIn);
}
function handleGetSecKillList(storeIdIn) {
  const self = this;
  let storeId = storeIdIn[0];
  let date = new util.ResponseDate();
  let tempDate = util.formatTime(date);
  let tomorrow = addDay(new util.ResponseDate().getTime(), state.grabActivityDays);
  let tomorrowDate = util.formatTime(tomorrow);
  let dateString = tempDate.split(' ')[0].replace(/\//g, '-');
  let endDateString = tomorrowDate.split(' ')[0].replace(/\//g, '-');
  const that = this;
  const postData = {
    orgIdIn: storeIdIn.join(","),
    startDate: dateString + " 00:00:00",
    endDate: endDateString + " 23:59:59",
    statusList: 'CREATED,STARTED',
    activityIdList: state.grabActivityIdList ? state.grabActivityIdList.join(",") : ''
  };
  if (app.globalData.distributionStore && app.globalData.distributionStore.id) {
    postData.storeIdIn = storeIdIn[0] + ',' + app.globalData.distributionStore;
  }
  seckillService.query(postData).then(res => {
    console.log(res);
    customData.customData = false;
    uni.hideLoading();
    let tempTimeList = [];
    if (!res || res.length == 0) {
      return;
    }
    /**
     * 处理秒杀时间分类
     * endTime/startTime 活动时间区间（忽略返回的日期，只截取时间）
     * endDate/startDate 获取日期区间
     */
    let tempSecKillList = [];
    console.log("----->");
    res.forEach(item => {
      let date = new util.ResponseDate();
      let nowTimeStamp = date.getTime();
      //格式化当前时间字符串 ("2019/06/27 11:06:19")
      let nowDateTimeStr = util.formatTime(date);

      //活动开始的日期s
      let startDateYMD = item.startDate.split(" ")[0];
      //拼接开始日期和开始时间=> 活动开始时间
      let startDateTimeJoined = startDateYMD + " " + item.startTime.split(" ")[1];
      let startDateStamp = new Date(startDateTimeJoined.replace(/-/g, '/')).getTime(); //开始日期时间戳

      //活动结束的日期
      let endDateYMD = item.endDate.split(" ")[0];
      //拼接结束日期和结束时间=> 活动开始时间
      let endDateTimeJoined = endDateYMD + " " + item.endTime.split(" ")[1];
      let endDateStamp = new Date(endDateTimeJoined.replace(/-/g, '/')).getTime(); //结束日期时间戳

      let datetTime = nowDateTimeStr.split(' ');
      let time = item.startTime.split(' ');
      let startTimeArr = item.startTime.split(' ');
      let endTimeArr = item.endTime.split(' ');
      let startTime = null;
      let endTime = null;
      if (startDateStamp > nowTimeStamp) {
        startTime = startDateYMD + ' ' + startTimeArr[1];
        endTime = endDateYMD + ' ' + endTimeArr[1];
      } else {
        startTime = datetTime[0] + ' ' + startTimeArr[1];
        endTime = datetTime[0] + ' ' + endTimeArr[1];
      }

      //当天内的时间处理
      let formatedStartTimeStr = startTime.replace(/-/g, '/');
      let dayStartTimeStamp = new Date(formatedStartTimeStr).getTime(); //当日活动开始时间的时间戳

      let dayEndTimeStamp = new Date(endTime.replace(/-/g, '/')).getTime(); //当日活动结束时间的时间戳
      let startDate = startDateTimeJoined; // 开始时间应该传入活动的开始时间
      let newStartDate = startDate.replace(/\//g, '-');
      let countDown = nowTimeStamp - dayStartTimeStamp;
      let duration = (dayEndTimeStamp - dayStartTimeStamp) / 1000;
      let durationStart = (dayStartTimeStamp - startDateStamp) / 1000;
      let dateInfo = null;
      let tempTimeData = {
        id: item.id,
        name: item.name,
        startTime: startTime.replace(/\//g, '-'),
        endTime: endTime.replace(/\//g, '-'),
        time: time[1].slice(0, 5),
        duration: duration,
        countDown: countDown,
        newStartTime: dayStartTimeStamp,
        newEndTime: dayEndTimeStamp,
        products: [],
        storeId: storeId,
        secKillStatus: 'started',
        secKillTips: '',
        durationStart: durationStart,
        startDate: newStartDate,
        newstartDateStamp: startDateStamp,
        startDate2: startDateStamp
      };
      if (startDateStamp > nowTimeStamp) {
        //判断日期
        tempTimeData = {
          ...tempTimeData,
          status: '未开始',
          active: false,
          secKillStatus: 'ahead',
          secKillTips: '本场尚未开抢'
        };
        // 开始日期
        let startDate = new Date(startDateYMD.replace(/-/g, '/'));
        // 结束日期
        let endDate = new Date(endDateYMD.replace(/-/g, '/'));
        // 今天的日期
        let currentDate = new Date((date.getFullYear() + '-' + (date.getMonth() + 1 * 1) + '-' + date.getDate()).replace(/-/g, '/'));
        if (startDate.getTime() !== currentDate.getTime()) {
          tempTimeData.time = item.startDate.slice(8, 10) + '日 ' + tempTimeData.time;
        }
      } else if (nowTimeStamp >= endDateStamp) {
        tempTimeData = {
          ...tempTimeData,
          status: '已结束',
          active: false,
          secKillStatus: 'end',
          secKillTips: '本场已结束 快去赶下一场吧！'
        };
      } else if (dayStartTimeStamp > nowTimeStamp) {
        //判断时间
        tempTimeData = {
          ...tempTimeData,
          status: '未开始',
          active: false,
          secKillStatus: 'ahead',
          secKillTips: '本场尚未开抢'
        };
      } else if (nowTimeStamp >= dayEndTimeStamp) {
        tempTimeData = {
          ...tempTimeData,
          status: '已结束',
          active: false,
          secKillStatus: 'end',
          secKillTips: '本场已结束 快去赶下一场吧！'
        };
      } else tempTimeData = {
        ...tempTimeData,
        status: '抢购中',
        active: false,
        secKillTips: '火热抢购ing'
      };
      tempSecKillList.push(tempTimeData);
    });
    function compare(property) {
      return function (a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
      };
    }
    tempSecKillList.sort(compare('newStartTime')); //排序，从小到大

    let key = 0;
    let tempDuration = Number.POSITIVE_INFINITY;
    for (let i = 0; i < tempSecKillList.length; i++) {
      if (i === 0 && tempSecKillList[i].countDown >= 0) {
        tempDuration = tempSecKillList[i].countDown;
      } else {
        if (tempSecKillList[i].countDown >= 0 && tempDuration > tempSecKillList[i].countDown && tempSecKillList[i].secKillStatus === 'started') {
          tempDuration = tempSecKillList[i].countDown;
          key = i;
        }
      }
    }
    /**
     * 秒杀活动的几种非常规状况
     * 1、当前时间内没有进行中的
     * 2、全部结束
     * 3、没有开始的
     * 1、3为一种情况，全部结束暂不处理？
     */
    tempSecKillList.forEach((item, index) => {
      if (index === key) {
        if (item.secKillStatus === 'started') {
          item = {
            ...item,
            status: '抢购中',
            active: true,
            secKillTips: '活动火热进行中！'
          };
          tempSecKillList[index] = item;
        } else {
          let count = key + 1;
          if (tempSecKillList[key].secKillStatus === 'ahead') {
            key = key;
          } else if (tempSecKillList[key].secKillStatus === 'end') {
            if (tempSecKillList[count] !== undefined && tempSecKillList[count].secKillStatus === 'ahead') {
              key = count;
            }
          }
        }
      }
    });

    //   tempSecKillList.forEach(arr=>{

    //     utilsSelf.getTemporaryUrl(arr.imageUrl)
    //     .then (res=>{
    //         arr.imageUrl = res
    //         that.setData({
    //             pageShow: true,
    //             products: newTempList,
    //             balance: balance,
    //             storeStatus: storeStatus
    //           })
    //     })

    //   })
    //   console.log(tempSecKillList,'tempSecKillListtempSecKillList')
    // 查询当前秒杀活动下的商品列表
    state.timeList = tempSecKillList;
    state.tabSelected = key;
    state.secKillTips = tempSecKillList[key].secKillTips;
    state.secKillStatus = tempSecKillList[key].secKillStatus;
    getSeckillProducts(key, tempSecKillList[key].id, storeId);
    /**
     * 计算倒计时的逻辑
     * 通过当前时间进行判断，
     * 如果活动开始则传入结束时间计算距离结束的时间
     * 如果活动未开始则传入开始时间计算距离开始的时间
     * 通过重复执行的倒计时函数一直对这些数据进行计算
     * 计算的耗时，待观察？
     */
    countDown();
    // 执行倒计时函数
    function countDown() {
      clearTimeout(state.secKillTimeId);
      let now = new util.ResponseDate();
      let nowTimeStamp = new Date(util.formatTime(now)).getTime();
      // 获取倒计时
      let timeInfo = [];
      // 将活动的结束时间参数提成一个单独的数组，方便操作
      tempSecKillList.forEach(o => {
        if (nowTimeStamp < o.newStartTime) {
          // 即将开始
          let tempTime = {
            openTeamTime: o.startDate,
            duration: o.durationStart
          };
          timeInfo.push(tempTime);
        } else if (nowTimeStamp > o.newEndTime) {
          // 已结束
          let tempTime = {
            openTeamTime: o.startTime,
            duration: o.duration
          };
          timeInfo.push(tempTime);
        } else if (nowTimeStamp >= o.newStartTime && nowTimeStamp < o.newEndTime) {
          // 进行中
          let tempTime = {
            openTeamTime: o.startTime,
            duration: o.duration
          };
          timeInfo.push(tempTime);
        }
      });
      let countDownArr = util.countDownDay(timeInfo);
      let count = 0;
      let tabSelected = state.tabSelected;
      countDownArr.forEach(time => {
        state.timeList[count].countDownTime = time;
        count++;
      });
      state.timeList = state.timeList;
      state.time = {
        day: state.timeList[tabSelected].countDownTime.day,
        hour: state.timeList[tabSelected].countDownTime.hou,
        minute: state.timeList[tabSelected].countDownTime.min,
        second: state.timeList[tabSelected].countDownTime.sec
      };
      let time = setTimeout(function () {
        countDown();
      }, 1000);
      state.secKillTimeId = time;
    }
    console.log(state.timeList, "抢购列表");
  }).catch(err => {
    customData.customData = false;
    uni.hideLoading();
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function bannerJumping(e) {
  const that = this;
  let bannerId = e.currentTarget.dataset.id;
  const bannerList = state.banners;
  let advertisementInfo = null;
  bannerList.forEach(item => {
    if (item.id === bannerId) {
      advertisementInfo = item;
    }
  });
  console.log(advertisementInfo);
  toAdPage(advertisementInfo, 'banner');
}
function toAdPage(pageInfo, pageType) {
  const that = this;
  if (pageInfo.linkType === 'APP') {
    // 应用
    // 判断跳转模块
    if (pageInfo.appReturnType === "PRODUCT_MENU") {
      //跳转商品分类页面
      NAVPAGE.toCategory("?categoryId=" + pageInfo.productMenuId);
    } else if (pageInfo.appReturnType === 'MIAOSHA') {
      NAVPAGE.toSeckill();
    } else if (pageInfo.appReturnType === "RECHARGE") {
      NAVPAGE.toRecharge();
    } else if (pageInfo.appReturnType === "MEAL") {
      //  餐饮
    } else if (pageInfo.appReturnType === "RECEIVECOUPON") {
      // 领券中心
      NAVPAGE.toCouponCenter();
    } else if (pageInfo.appReturnType === "ADVANCE_SELL_PRODUCT") {
      // 预售商品
      if (pageInfo.activityId) {
        let opts = '?productId=' + pageInfo.productId + '&advanceId=' + pageInfo.activityId + '&type=advanceSell';
        NAVPAGE.toGoodsDetails(opts);
      } else {
        NAVPAGE.toAdvanceSell();
      }
    } else if (pageInfo.appReturnType === "TEAM_BUYING") {
      // 团购
      NAVPAGE.toFightGroup();
    } else if (pageInfo.appReturnType === "SCOREMALL") {
      // 积分商场
      NAVPAGE.toScoreMall();
    } else if (pageInfo.appReturnType === "INVITE_MEMBER") {
      // 邀请好友
      NAVPAGE.toInvite();
    } else if (pageInfo.appReturnType === "MEMBER_CARD") {
      // 会员卡
      //如果首页开启付款码，则不到会员码页面，点击直接跳转付款码页面
      if (app.globalData.uiconfig.isHomePayCodeEnabled) {
        NAVPAGE.toPayCode();
      } else {
        NAVPAGE.toMemberCard();
      }
      ;
    } else if (pageInfo.appReturnType === "MY_COUPON") {
      // 我的优惠券
      NAVPAGE.toMyCoupon();
    } else if (pageInfo.appReturnType === "NEWMBR") {
      // 新用户专享
      NAVPAGE.toNewmbrActivity();
    } else if (pageInfo.appReturnType === "HELP_COUPON") {
      // 助力送券
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        if (pageInfo.helpActivityId != null) {
          helpActivityService.getHelpActivityById(pageInfo.helpActivityId).then(res => {
            if (res.status === "SUBMITED") {
              let opts = "?helpActivityId=" + pageInfo.helpActivityId;
              NAVPAGE.toAssistanceCoupon(opts);
            } else if (res.status === "FINISHED") {
              uni.showToast({
                title: '您来晚了，助力活动已结束~',
                icon: 'none'
              });
            } else if (res.status === "CREATED") {
              uni.showToast({
                title: '助力活动还没有开始哦~',
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: '当前助力活动不在进行中~',
                icon: 'none'
              });
            }
          }).catch(err => {
            console.log("查询进行中的助力送券活动出错：" + err.message);
            uni.showToast({
              title: '当前没有正在进行中的活动哦~',
              icon: 'none'
            });
          });
        }
      } else {
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          NAVPAGE.toAuthorize();
        }, 2000);
      }
    } else if (pageInfo.appReturnType === "CREDIT_CARD") {
      // 申请办卡
      NAVPAGE.toCreditCard();
    } else if (pageInfo.appReturnType === "BARGAIN") {
      // 砍价模块
      NAVPAGE.toBargainList();
    } else if (pageInfo.appReturnType === "PENNY") {
      // 购物抽奖
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toPennyList();
      } else {
        NAVPAGE.toAuthorize();
      }
    } else if (pageInfo.appReturnType === "RECHARGE_DRAW") {
      // 充值抽奖
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toLotteryIndex();
      } else {
        NAVPAGE.toAuthorize();
      }
    } else if (pageInfo.appReturnType === "NOTICE") {
      // 系统公告
      NAVPAGE.toSysNotice();
    } else if (pageInfo.appReturnType === "SOLITAIRE") {
      NAVPAGE.toSolitaireList();
    } else if (pageInfo.appReturnType === "PACKAGING") {
      // 打包一口价
      if (pageInfo.packagingId != null) {
        let opts = "?packagingId=" + pageInfo.packagingId;
        NAVPAGE.toPackaging(opts);
      }
    } else if (pageInfo.pageUrl) {
      uni.navigateTo({
        url: pageInfo.pageUrl
      });
    }
  } else if (pageInfo.linkType === "FEEDBACK") {
    //跳转意见反馈页面
    NAVPAGE.toFeedback();
  } else if (pageInfo.linkType === 'GRADPRODUCT') {
    // 秒杀商品
    let opts = '?productId=' + pageInfo.productId + '&storeId=' + app.globalData.storeInfo.id + '&activityId=' + pageInfo.grabActivityId + '&type=secondkill';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === 'PRODUCT') {
    // 商品 
    let opts = '?productId=' + pageInfo.productId + '&storeId=' + app.globalData.storeInfo.id + '&type=normal';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === 'TEAMPRODUCT') {
    // 拼团商品 
    let opts = '?productId=' + pageInfo.teamActivityId + '&storeId=' + app.globalData.storeInfo.id + '&type=group';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === 'COUPONACTIVITYDETAILS') {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        let opts = '?couponActivityId=' + pageInfo.couponActivityId + '&type=assign&isExternal=false';
        NAVPAGE.toCouponDetails(opts);
      } else {
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          NAVPAGE.toAuthorize();
        }, 2000);
      }
    } else {
      NAVPAGE.toAuthorize();
    }
  } else if (pageInfo.linkType === 'URL') {
    // 链接
    let url = pageInfo.linkUrl;
    if (!url) {
      return false;
    }
    let index = '?';
    let webUrl = url;
    if (url.indexOf(index) > -1) {
      webUrl = webUrl + '&storeId=' + state.storeId + '&type=normal';
      if (app.globalData.TENANT && webUrl.indexOf("tenant") < 0) {
        webUrl = webUrl + '&tenant=' + app.globalData.TENANT;
      }
    }
    let urlData = {
      url: encodeURIComponent(webUrl)
    };
    let jsonUrl = JSON.stringify(urlData);
    let opts = '?webUrl=' + jsonUrl;
    NAVPAGE.toAdvertising(opts);
  } else if (pageInfo.linkType === "BENEFIT_PLAN") {
    NAVPAGE.toBenefitPlan();
  } else if (pageInfo.linkType === "MEITUAN_XIAOXIANG") {
    NAVPAGE.toMeituan();
  } else if (pageInfo.linkType === "TOURISM_PLAN") {
    let opts = '?id=' + pageInfo.tourismPlanId;
    NAVPAGE.toTourismPlan(opts);
  } else if (pageInfo.pageUrl) {
    uni.navigateTo({
      url: pageInfo.pageUrl
    });
  } else {}
}
onLoad(async function (options) {
  console.log(options);
  await getGrabActivityDays();
  if (options.grabActivityIdList) {
    state.grabActivityIdList = JSON.parse(options.grabActivityIdList);
  }
  const self = this;
  eventId = bus.on('userShopCartChange', () => {
    if (app.globalData.storeInfo) {
      getShopCart(app.globalData.storeInfo.id);
    }
  });
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  inOnload = true;
  getMemberUserInfo();
  if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
    app.globalData.tabBar.list.forEach(item => {
      if (item.linkModel === 'grab_activity') {
        uni.hideTabBar();
        app.editTabbar();
        state.showTabbar = true;
      }
    });
  }

  // 设置当前设备是否iPhone X
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  state.isIphoneX = app.globalData.isIphoneX;
  state.hasEasyRecPlugins = app.globalData.hasEasyRecPlugins;
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    console.log(app.globalData.storeInfo, "门店信息");
    // 统计PV
    //   ANALYSIS.PVStatistics(self.data.storeId)
    state.storeId = app.globalData.storeInfo.id;
    getShopCart(app.globalData.storeInfo.id);
    getSecKillList(app.globalData.storeInfo.id);
    getBannerList(app.globalData.storeInfo.id);
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation().then(res => {
      app.globalData.storeInfo = res;
      // 统计PV
      state.storeId = res.id;
      ANALYSIS.PVStatistics(res.id);
      getSecKillList(res.id);
      getBannerList(res.id);
      getShopCart(res.id);
    }).catch(err => {
      console.log(err);
    });
  }
  // 设置分享信息
  setSharePeopleInfo(options, "secondkill");
  // 获取当前页面分享图
  getSharePictures();
});
function setSharePeopleInfo(options, type) {
  if (options.scene) {
    let scene = decodeURIComponent(options.scene);
    if (scene.indexOf("gmparam:") >= 0) {
      let sceneArr = scene.split('gmparam:');
      const _sceneId = sceneArr[1];
      sceneId = _sceneId != null ? _sceneId : null;
      getSceneById(sceneId);
      return;
    } else if (scene !== 'isfromQR') {
      let reg = /^[0-9]*$/;
      if (reg.test(options.scene)) {
        // 分享信息打开统计
        //   ANALYSIS.ShareOpenAnalysis();
        saveSharePerson(scene);
      }
    }
  } else if (options.shareId && options.shareId != '' && options.shareId != null) {
    saveSharePerson(options.shareId);
  }
}
function saveSharePerson(shareId) {
  if (!shareId) {
    return;
  }
  let shareData = {
    shareId: shareId,
    type: "secondkill",
    productId: ""
  };
  if (app.globalData.isShoppingGuidanceRecordGoods) {
    util.setSharingPersonInfo(shareData);
  } else {
    try {
      uni.setStorageSync('wj_sharingId', shareId);
    } catch (e) {}
  }
}
onReady(function () {});
onShow(async function () {
  await getGrabActivityDays();
  if (state.phone === true) {
    handlePopupPhone();
  }
  if (inOnload) {
    inOnload = false;
  } else {
    if (app.globalData.storeInfo && app.globalData.storeId === '') {
      console.log(app.globalData.storeInfo, "门店信息");
      // 统计PV
      state.storeId = app.globalData.storeInfo.id;
      getSecKillList(app.globalData.storeInfo.id);
      getShopCart(app.globalData.storeInfo.id);
    } else {
      // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
      ADDRESS.getLocation().then(res => {
        app.globalData.storeInfo = res;
        // 统计PV
        state.storeId = res.id;
        getSecKillList(res.id);
      }).catch(err => {
        console.log(err);
      });
    }
  }
  // 判断用户是否授权
  checkUserInfo();
});
onHide(function () {});
onUnload(function () {
  clearTimeout(state.secKillTimeId);
  bus.remove('userShopCartChange', eventId);
});
onPullDownRefresh(function () {
  console.log("下拉刷新秒杀商品...");
  getSecKillList(state.storeId);
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {});
onShareAppMessage(function () {
  const self = this;
  let sharePictures = state.sharePictures;
  // 分享信息统计
  // ANALYSIS.ShareAnalysis();
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    let memberId = app.globalData.userInfo.member.id;
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/activity/seckill/seckill?shareId=' + memberId + '&storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {}
    };
  } else {
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/activity/seckill/seckill?storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {}
    };
  }
});
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures;
  }
}
function getNearestStore(allStores, latitude, longitude) {
  let distanceArr = [];
  allStores.forEach(item => {
    let dis = util.distance(latitude, longitude, item.latitude, item.longitude);
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
  state.store = allStores[tempIndex].name;
  state.storeId = allStores[tempIndex].id;
  return tempIndex;
}
function toHome() {
  NAVPAGE.toHome();
}
function getMemberUserInfo() {
  if (!app.globalData.userInfo) {
    uni.showToast({
      title: "您还未授权，请登陆授权",
      icon: 'none',
      duration: 2000
    });
  } else {}
}
function getBannerList(storeId) {
  bannerService.getStoreBannerList('GRABADSENSE', storeId).then(res => {
    console.log(res);
    state.banners = res;
  });
}
function handleUserLogin() {
  console.log(app.globalData.userInfo);
  const self = this;
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo;
    state.userInfo = {
      ...user.wxaUser
    };
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true;
    } else {
      state.userInfo = user.wxaUser;
      state.hasUserInfo = true;
    }
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.phone = true;
  } else {
    state.phone = false;
  }
}
function handleBindPhone(e) {
  console.log(e.detail);
  if (e.detail.bindMobile === true) {
    handlePopupPhone();
  }
}
function handleTabbar(e) {
  if (e.detail.showTabbar === true) {
    state.showTabbar = e.detail.showTabbar;
  } else {
    state.showTabbar = e.detail.showTabbar;
  }
}
function getSeckillProducts(index, activityId, storeId) {
  const self = this;
  let storeIdIn = [storeId];
  handleGetSeckillProducts(index, activityId, storeIdIn);
}
function handleGetSeckillProducts(index, activityId, storeIdIn) {
  const that = this;
  let storeId = storeIdIn[0];
  let postData = {
    activityIdEquals: activityId
  };
  console.log(storeIdIn, app.globalData.distributionStore, app.globalData.distributionStore.id);
  storeIdIn.forEach((ele, index) => {
    postData[`orgIdIn[${index}]`] = ele;
  });
  if (app.globalData.distributionStore && app.globalData.distributionStore.id) {
    postData.orgIdIn = storeIdIn[0] + ',' + app.globalData.distributionStore.id;
  }
  if (state.timeList[index].products && state.timeList[index].products.length === 0) {
    seckillService.queryProduct(postData).then(res => {
      uni.hideLoading();
      console.log(res, "原始数据");
      if (res && res.length > 0) {
        let tempProducts = [];
        res.forEach(ele => {
          let tempData = {
            activityId: ele.activityId,
            availableStockAmount: ele.availableStockAmount ? ele.availableStockAmount : 0,
            balance: ele.availableStockAmount ? ele.availableStockAmount : 0,
            imageUrl: ele.imageUrl,
            limitCount: ele.limitCount,
            originalPrice: ele.originalPrice,
            price: ele.price,
            minQty: ele.minQty,
            productDescription: ele.productDescription ? ele.productDescription : '',
            productId: ele.productId,
            productName: ele.productName,
            storeId: ele.storeId || storeId,
            totalStockAmount: ele.totalStockAmount ? ele.totalStockAmount : 1,
            residualPercentage: 100,
            type: ele.type,
            storeStatus: ele.storeStatus ? ele.storeStatus : 'ON',
            business: ele.business,
            id: ele.id
          };
          tempData.residualPercentage = tempData.availableStockAmount / tempData.totalStockAmount >= 1 ? 100 : parseFloat(tempData.availableStockAmount / tempData.totalStockAmount * 100).toFixed(0);
          if (ele.type !== "SPEC") {
            tempData.balance = ele.storeBalance ? ele.storeBalance : 0;
            tempData.availableStockAmount = ele.availableStockAmount > ele.storeBalance ? ele.storeBalance : ele.availableStockAmount;
            tempData.residualPercentage = ele.availableStockAmount / ele.totalStockAmount >= 1 ? 100 : parseFloat(ele.availableStockAmount / ele.totalStockAmount * 100).toFixed(0);
          }
          if (ele.availableStockAmount < 0) {
            tempData = {
              ...tempData,
              availableStockAmount: 0
            };
          }
          let specifications = [];
          let produtlabel = [];
          let promotions = [];
          if (ele.labels && ele.labels.length > 0) {
            ele.labels.forEach(item => {
              if (item.type === 'GOODSLABEL' && item.color != null) {
                produtlabel.push(item);
              } else if (ele.type === 'PROMOTIONLABEL') {
                promotions.push(item);
              }
            });
          }
          if (ele.propertys && ele.propertys.length > 0) {
            for (let i = 0; i < ele.propertys.length; i++) {
              const temp = ele.propertys[i];
              if (temp.propertyName === '规格') {
                specifications = temp.propertyValue;
                break;
              }
            }
          }
          tempData = {
            ...tempData,
            produtlabel: produtlabel,
            specifications: specifications,
            promotions: promotions
          };
          tempProducts.push(tempData);
          tempProducts.sort((a, b) => a.id - b.id);
        });
        state['timeList[' + index + '].products'] = tempProducts;
      }
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    state.userInfo = app.globalData.userInfo.wxaUser;
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo;
      let isExpired = false;
      let isVIP = false;
      const now = new util.ResponseDate().getTime();
      let vipEndTimeStamp = now + 1000;
      let vipEndTime = "";
      if (res.member.vipEndTime) {
        vipEndTimeStamp = new Date(res.member.vipEndTime.replace(/-/g, '/')).getTime();
        vipEndTime = res.member.vipEndTime.split(" ")[0].replace(/-/g, '.');
      }
      if (now > vipEndTimeStamp) {
        isExpired = true;
      }
      if (res.member.vipEndTime && now < vipEndTimeStamp) {
        isVIP = true;
        app.globalData.userInfo.member.vip = true;
      }
      state.isMember = true;
      state.member = res.member;
      state.isVIP = isVIP;
      state.isExpired = isExpired;
      state.vipEndTime = vipEndTime;
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
  }
}
function getSceneById(id) {
  const self = this;
  wxaUserService.getSceneById(id).then(res => {
    function urlToObj(str) {
      let obj = {};
      let arr = str.split("&");
      for (let i = 0; i < arr.length; i++) {
        let ele = arr[i].split("=");
        obj[ele[0]] = ele[1];
      }
      return obj;
    }
    const _options = urlToObj(res);
    options = _options;
    if (_options.shareId != null && _options.shareId !== "") {
      saveSharePerson(_options.shareId);
      // 分享信息打开统计
      // ANALYSIS.ShareOpenAnalysis();
    }
  }).catch(err => {
    util.showToast(err.message);
  });
}
function getShopCart(storeId) {
  const self = this;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    // 查询系统配置项，根据系统配置项控制统配购物车显示
    if (util.isDeliveryProduct()) {
      // 查询统配门店信息
      if (app.globalData.distributionStore) {
        const distributionStore = app.globalData.distributionStore;
        getCatering(storeId);
        getCatering(distributionStore.id, "distribution");
      } else {
        storeService.getDistributionStore().then(res => {
          if (res) {
            let distributionStore = res;
            getCatering(storeId);
            getCatering(distributionStore.id, "distribution");
            try {
              uni.setStorageSync('wj_distributionStore', distributionStore);
            } catch (e) {
              console.log(e);
            }
          }
        }).catch(e => {
          console.log(e.message);
        });
      }
    } else {
      getCatering(storeId);
    }
    function getCatering(storeId, type = "normal") {
      shopcartService.getCatering(storeId).then(res => {
        let tempShopCart = {};
        let grabProducts = {};
        let tempShopCartGoodsId = [];
        let tempGrabShopCartGoodsId = [];
        if (res.items && res.items.length > 0) {
          // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
          res.items.forEach(item => {
            if (!item.grabActivityId && !item.newmbrActivityId) {
              let index = -1;
              for (let i = 0; i < tempShopCartGoodsId.length; i++) {
                if (item.productId == tempShopCartGoodsId[i]) {
                  index = i;
                }
              }
              if (index > -1) {
                tempShopCart[item.productId] = tempShopCart[item.productId] + item.productNum;
              } else {
                tempShopCart[item.productId] = item.productNum;
                tempShopCartGoodsId.push(item.productId);
              }
            } else if (item.grabActivityId) {
              let index = -1;
              for (let i = 0; i < tempGrabShopCartGoodsId.length; i++) {
                if (item.productId == tempGrabShopCartGoodsId[i]) {
                  index = i;
                }
              }
              if (index > -1) {
                grabProducts[item.productId] = grabProducts[item.productId] + item.productNum;
              } else {
                grabProducts[item.productId] = item.productNum;
                tempGrabShopCartGoodsId.push(item.productId);
              }
            }
          });
          state.shopCartData = res.items;
        }
        let localData = {
          goodsId: tempShopCartGoodsId,
          items: tempShopCart
        };
        let localGrabData = {
          goodsId: tempGrabShopCartGoodsId,
          items: grabProducts
        };
        if (type === "normal") {
          state.shopCart = grabProducts;
          state.shopCartGoodsId = tempGrabShopCartGoodsId;
          try {
            uni.setStorageSync('wj_shopCartStorage', localData);
            uni.setStorageSync('wj_grabshopCartStorage', localGrabData);
          } catch (e) {}
        } else {
          state.distributionShopCart = grabProducts;
          state.distributionShopCartGoodsId = tempGrabShopCartGoodsId;
          try {
            uni.setStorageSync('wj_distribution_shopCartStorage', localData);
            uni.setStorageSync('wj_distribution_grabshopCartStorage', localGrabData);
          } catch (e) {}
        }
      }).catch(err => {
        console.log("查询购物车失败");
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    }
    let localProductCount = uni.getStorageSync('wj_userProductsCount');
    let counts = String(localProductCount);
    if (counts) {
      app.setTabBarBadge('shopping_cart', counts);
    }
    shopcartService.getProductsCount().then(res => {
      let count = String(res);
      app.setTabBarBadge('shopping_cart', String(res));
      state.cartCount = count;
      try {
        uni.setStorageSync('wj_userProductsCount', res);
      } catch (e) {}
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
function addLocalGoods(id) {
  const that = this;
  try {
    // 读取缓存的商品总量和购物车数据
    let localShopingCart = uni.getStorageSync('wj_grabshopCartStorage');
    let distributionLocalShopingCart = uni.getStorageSync('wj_distribution_grabshopCartStorage');
    let localProductCount = uni.getStorageSync('wj_userProductsCount');
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount);
    localProductCount++;
    localProductCount = String(localProductCount);
    app.setTabBarBadge('shopping_cart', localProductCount);
    handleLocalGoods(localShopingCart);
    handleLocalGoods(distributionLocalShopingCart, "distribution");
    function handleLocalGoods(localShopingCart, type = "normal") {
      if (localShopingCart) {
        // 如果存在本地购物车数据
        let shopCartGoodsId = localShopingCart.goodsId;
        let tempShopCart = localShopingCart.items;
        let tempShopCartGoodsId = [];
        let _id = id;
        let index = -1;
        if (shopCartGoodsId.length > 0) {
          for (let i = 0; i < shopCartGoodsId.length; i++) {
            tempShopCartGoodsId.push(shopCartGoodsId[i]);
            if (_id == shopCartGoodsId[i]) {
              index = i;
            }
          }
        }
        if (index > -1) {
          //已经存在购物车，只是数量变化
          tempShopCart[_id] = Number(tempShopCart[_id]) + 1;
        } else {
          //新增  
          tempShopCartGoodsId.push(_id);
          tempShopCart[_id] = 1;
        }
        let localData = {
          goodsId: tempShopCartGoodsId,
          items: tempShopCart
        };
        console.log(localData);
        if (type === "normal") {
          state.shopCart = tempShopCart;
          state.shopCartGoodsId = tempShopCartGoodsId;
          uni.setStorageSync('wj_grabshopCartStorage', localData);
        } else {
          state.distributionShopCart = tempShopCart;
          state.distributionShopCartGoodsId = tempShopCartGoodsId;
          uni.setStorageSync('wj_distribution_grabshopCartStorage', localData);
        }
        canAddToCart = true;
      }
    }
    uni.setStorageSync('wj_userProductsCount', localProductCount);
  } catch (e) {
    // Do something when catch error
    canAddToCart = true;
    console.log(e);
  }
  bus.emit('userShopCartChange', "update");
}
function reduceLocalGoods(id) {
  const that = this;
  // this.data.shopCartData.some(item => {
  //     if(item.productId == productId && item.grabActivityId == activityId) {
  //         minQty = item.minQty > item.productNum ? item.minQty - item.productNum : 1
  //     }
  //     return item.productId == productId && item.grabActivityId == activityId
  // })
  try {
    // 读取缓存的商品总量和购物车数据
    let localShopingCart = uni.getStorageSync('wj_grabshopCartStorage');
    let distributionLocalShopingCart = uni.getStorageSync('wj_distribution_grabshopCartStorage');
    let localProductCount = uni.getStorageSync('wj_userProductsCount');
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount);
    localProductCount--;
    localProductCount = String(localProductCount);
    app.setTabBarBadge('shopping_cart', localProductCount);
    handleLocalGoods(localShopingCart);
    handleLocalGoods(distributionLocalShopingCart, "distribution");
    function handleLocalGoods(localShopingCart, type = "normal") {
      if (localShopingCart) {
        // 如果存在本地购物车数据
        let shopCartGoodsId = localShopingCart.goodsId;
        let tempShopCart = localShopingCart.items;
        let tempShopCartGoodsId = [];
        let _id = id;
        let index = -1;
        if (shopCartGoodsId.length > 0) {
          for (let i = 0; i < shopCartGoodsId.length; i++) {
            tempShopCartGoodsId.push(shopCartGoodsId[i]);
            if (_id == shopCartGoodsId[i]) {
              index = i;
            }
          }
        }
        if (index > -1) {
          //已经存在购物车，只是数量变化
          tempShopCart[_id] = Number(tempShopCart[_id]) - 1;
          if (tempShopCart[_id] <= 0) {
            tempShopCartGoodsId.splice(index, 1);
          }
        }
        let localData = {
          goodsId: tempShopCartGoodsId,
          items: tempShopCart
        };
        console.log(id, "localDatalocalData", state.shopCartData);
        if (type === "normal") {
          state.shopCart = tempShopCart;
          state.shopCartGoodsId = tempShopCartGoodsId;
          uni.setStorageSync('wj_grabshopCartStorage', localData);
        } else {
          state.distributionShopCart = tempShopCart;
          state.distributionShopCartGoodsId = tempShopCartGoodsId;
          uni.setStorageSync('wj_distribution_grabshopCartStorage', localData);
        }
        canAddToCart = true;
      }
    }
    uni.setStorageSync('wj_userProductsCount', localProductCount);
  } catch (e) {
    // Do something when catch error
    canAddToCart = true;
    console.log(e);
  }
  bus.emit('userShopCartChange', "update");
}
function handleTouchOnGoods(e) {
  const self = this;
  console.log(e);
  addLocalGoods(e.currentTarget.dataset.productid);
}
function checkAuth() {
  try {
    if (!app.globalData.userInfo) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    // Do something when catch error
  }
}
function toShopCar() {
  NAVPAGE.toShopcart();
}
function toPaySecKill(e) {
  const self = this;
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    NAVPAGE.toAuthorize();
    return;
  }
  const tabSelected = state.tabSelected;
  const goodsList = state.timeList[tabSelected].products;
  const productId = e.currentTarget.dataset.productid;
  const activityId = e.currentTarget.dataset.activityid;
  let goods = null;
  for (let i = 0; i < goodsList.length; i++) {
    const ele = goodsList[i];
    if (ele.productId === productId && ele.activityId === activityId) {
      goods = ele;
      break;
    }
  }
  if (state.secKillStatus === "started" && goods && (goods.type === "SPEC" || goods.availableStockAmount > 0 && goods.balance > 0) && goods.storeStatus === 'ON') {
    // 可以购买
    // 餐饮套餐商品
    const val = {
      currentTarget: {
        dataset: {
          type: "add",
          productid: productId,
          activityid: activityId
        }
      }
    };
    // self.addShopCart(val)
    if (goods.type !== 'SPEC' && goods.style !== 'MEALS2') {
      toPaySecKillOrder({
        ...goods,
        activityId,
        productId
      });
    } else {
      canAddToCart = true;
      // 多规格商品跳转商品详情
      let opts = '?productId=' + productId + '&storeId=' + state.storeId + '&type=secondkill&activityId=' + activityId;
      NAVPAGE.toGoodsDetails(opts);
    }
  }
}
function toPaySecKillOrder(e) {
  const that = this;
  if (e.availableStockAmount !== 0) {
    let shoppingCarts = [{
      grabActivityId: e.activityId,
      productId: e.productId,
      quantity: 1
    }];
    let postData = {
      storeId: e.storeId,
      memberId: app.globalData.userInfo.member.id,
      shoppingCarts: shoppingCarts
    };
    let loginStatus = checkAuth();
    if (loginStatus && state.isMember) {
      shopcartService.checkShoppingToOrder(postData).then(res => {
        // 餐饮套餐商品
        state.scource = "BUYNOW";
        if ((e.business === 'CATERING' || e.business === 'DISTRIBUTION') && e.style === 'MEALS') {
          return getCateringDetailsById(e.productId, e.storeId);
        }
      }).then(res => {
        // 餐饮套餐商品
        if (e.balance > 0) {
          if (e.availableStockAmount > 0) {
            if (e.minQty && e.minQty > e.availableStockAmount) {
              uni.showToast({
                title: '库存数量小于起购数量~',
                icon: 'none',
                duration: 2000
              });
              return false;
            }
            try {
              let secKill = {
                allPrice: e.price,
                storeId: e.storeId,
                goodsList: [],
                orderType: 'secondkill',
                scource: 'BUYNOW',
                secKillInfo: e
              };
              if (options.room_id) {
                seckill = {
                  ...seckill,
                  orderSource: 'WX_MINI_APP-LIVE',
                  room_id: options.room_id
                };
                seckill.orderSource = 'WX_MINI_APP-LIVE';
              }
              let price = 0;
              let goodData = {
                ...e,
                productId: e.productId || e.id,
                productNum: e.minQty ? e.minQty : 1,
                initialPurchaseNumber: e.initialPurchaseNumber || 1,
                sellPrice: e.price,
                grabActivityId: e.activityId,
                minQty: e.minQty
              };
              price += parseFloat((goodData.productNum * goodData.sellPrice).toFixed(2));
              if (state.isCateringMeals || e.style === 'MEALS') {
                goodData.groupProducts = res.lists[0].lists;
              }
              secKill.goodsList = [goodData];
              secKill.allPrice = price;
              uni.setStorageSync('wj_shopcart', secKill);
            } catch (e) {}
            // 跳转到完善订单
            let easyScene = "none";
            if (options.easyScene != null) {
              easyScene = options.easyScene;
            }
            let opts = "?easyScene=" + easyScene;
            NAVPAGE.toPerfectOrder(opts);
          } else {
            uni.showToast({
              title: '您来晚了，已经被抢光了~',
              icon: 'none',
              duration: 2000
            });
          }
        } else {
          uni.showToast({
            title: '门店正在努力补货中~',
            icon: 'none',
            duration: 2000
          });
        }
      }).catch(e => {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000
        });
      });
    } else {
      NAVPAGE.toAuthorize();
    }
  }
}
function getCateringDetailsById(productId, storeId) {
  return new Promise((resolve, reject) => {
    productService.getCateringDetailsById(productId, storeId).then(res => {
      let cateringGroupProducts = res.cateringGroupProducts;
      let productId = res.id;
      let goodsList = [];
      let mealCanBuy = true;
      let mealDetails = [];
      if (cateringGroupProducts && cateringGroupProducts.length > 0) {
        let groupProductList = [];
        for (let i = 0; i < cateringGroupProducts.length; i++) {
          const item = cateringGroupProducts[i];
          if (item.mealDetails && item.mealDetails.length > 0) {
            for (let j = 0; j < item.mealDetails.length; j++) {
              const ele = item.mealDetails[j];
              let tempData = {
                "groupId": item.groupId,
                "groupProductId": ele.productId,
                "groupProductCount": ele.productCount
              };
              mealDetails.push(ele.productName);
              groupProductList.push(tempData);
            }
          }
        }
        let tempData = {
          count: 1,
          lists: groupProductList,
          productId: productId
        };
        goodsList.push(tempData);
      }
      if (mealCanBuy) {
        resolve({
          lists: goodsList,
          storeId: storeId
        });
      }
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none'
      });
    });
  });
}
function addShopCart(val) {
  const that = this;
  if (!canAddToCart) {
    console.log("已经在处理加入购物车");
    return;
  }
  console.log("已经在处理加入购物车1");
  canAddToCart = false;
  const tabSelected = state.tabSelected;
  const goodsList = state.timeList[tabSelected].products;
  const productId = val.currentTarget.dataset.productid;
  const activityId = val.currentTarget.dataset.activityid;
  let goods = null;
  for (let i = 0; i < goodsList.length; i++) {
    const ele = goodsList[i];
    if (ele.productId === productId && ele.activityId === activityId) {
      goods = ele;
      break;
    }
  }
  if (!goods) {
    canAddToCart = true;
    return;
  }
  let business = goods.business;
  let balance = goods.balance;
  let type = goods.type;
  let style = goods.style;
  let hasSharingPersonId = false;
  let storeId = '';
  const mode = val.currentTarget.dataset.type;
  let minQty = goods.minQty;
  let minQty1 = 1;
  let productNum = 0;
  if (business === "DISTRIBUTION") {
    if (state.distributionShopCart[productId] != null && state.distributionShopCart[productId] > 0) {
      productNum = state.distributionShopCart[productId];
    }
    try {
      let _data = uni.getStorageSync('wj_distributionStore');
      if (_data) {
        storeId = _data.id;
      }
    } catch (e) {}
  } else {
    storeId = app.globalData.storeInfo.id;
    if (state.shopCart[productId] != null && state.shopCart[productId] > 0) {
      productNum = state.shopCart[productId];
    }
  }
  // console.log(this.data.shopCartData, "goodsList", goods);
  // return false;
  if (minQty && state.shopCartData && state.shopCartData.length > 0) {
    state.shopCartData.some(item => {
      if (item.productId == productId && item.grabActivityId == activityId) {
        minQty = item.minQty > item.productNum ? item.minQty - item.productNum : 1;
        minQty1 = item.minQty >= item.productNum ? item.productNum : 1;
      }
      return item.productId == productId && item.grabActivityId == activityId;
    });
  }
  let loginStatus = checkAuth();
  if (type !== 'SPEC') {
    if (loginStatus) {
      let postData = {
        storeId: storeId,
        lists: [{
          count: minQty || 1,
          productId: productId,
          grabActivityId: activityId
        }]
      };
      if (app.globalData.isShoppingGuidanceRecordGoods) {
        // 获取分享人id
        const shareData = util.getSharingPersonInfo();
        if (shareData && shareData != null && shareData.productId === productId) {
          postData.lists[0].sharingPersonId = shareData.shareId;
          hasSharingPersonId = true;
        }
      }
      if (mode === 'reduce') {
        postData = {
          storeId: storeId,
          lists: [{
            count: minQty1 ? -minQty1 : -1,
            productId: productId,
            grabActivityId: activityId
          }]
        };
      }
      if (business === 'DISTRIBUTION') {
        balance = 0;
        productService.getDetails(storeId, productId).then(res => {
          if (res) {
            balance = res.balance;
          }
          if (style === 'MEALS') {
            getCateringDetailsById(productId, storeId);
          } else {
            addShopcart(balance);
          }
        }).catch(err => {
          canAddToCart = true;
        });
      } else if ((business === 'CATERING' || business === 'DISTRIBUTION') && style === 'MEALS') {
        getCateringDetailsById(productId, storeId);
      } else {
        addShopcart(balance);
      }
      function getCateringDetailsById(productId, storeId) {
        productService.getCateringDetailsById(productId, storeId).then(res => {
          let cateringGroupProducts = res.cateringGroupProducts;
          let productId = res.id;
          let goodsList = [];
          let mealCanBuy = true;
          let mealDetails = [];
          if (cateringGroupProducts && cateringGroupProducts.length > 0) {
            let groupProductList = [];
            for (let i = 0; i < cateringGroupProducts.length; i++) {
              const item = cateringGroupProducts[i];
              if (item.mealDetails && item.mealDetails.length > 0) {
                for (let j = 0; j < item.mealDetails.length; j++) {
                  const ele = item.mealDetails[j];
                  let tempData = {
                    "groupId": item.groupId,
                    "groupProductId": ele.productId,
                    "groupProductCount": ele.productCount
                  };
                  mealDetails.push(ele.productName);
                  groupProductList.push(tempData);
                }
              }
            }
            let tempData = {
              count: 1,
              lists: groupProductList,
              productId: productId
            };
            goodsList.push(tempData);
          }
          if (mealCanBuy) {
            postData = {
              lists: goodsList,
              storeId: storeId
            };
            addShopcart(balance);
          } else {
            canAddToCart = true;
          }
        }).catch(err => {
          canAddToCart = true;
          uni.showToast({
            title: err.message,
            icon: 'none'
          });
        });
      }
      function addShopcart(balance) {
        if (app.globalData.userInfo.member) {
          if (balance === 0 || balance === null || balance === '') {
            uni.showToast({
              title: '门店中该商品库存不足，请选购其他商品~',
              icon: 'none',
              duration: 2000
            });
            canAddToCart = true;
          } else {
            shopcartService.cateringAdd(postData).then(res => {
              let opts = {
                products: [{
                  productId: productId
                }]
              };
              app.globalData.storeIdentification = business === 'DISTRIBUTION' ? 'distribution' : 'normal';
              app.globalData.isShopCartChange = true;
              if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
                util.removeSharingPersonInfo();
              }
              if (mode === 'reduce') {
                reduceLocalGoods(productId);
              } else {
                uni.showToast({
                  title: '添加购物车成功~',
                  icon: 'none',
                  duration: 2000
                });
                handleTouchOnGoods(val);
              }
              getProductsCount();
            }).catch(err => {
              canAddToCart = true;
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000
              });
            });
          }
        } else {
          canAddToCart = true;
          NAVPAGE.toAuthorize();
        }
      }
    } else {
      canAddToCart = true;
      uni.showToast({
        title: '请先点击头像授权登录后添加哦~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    canAddToCart = true;
    // 多规格商品跳转商品详情
    let opts = '?productId=' + productId + '&storeId=' + state.storeId + '&type=secondkill&activityId=' + activityId;
    NAVPAGE.toGoodsDetails(opts);
  }
}
function getProductsCount() {
  const that = this;
  shopcartService.getProductsCount().then(res => {
    let count = String(res);
    state.cartCount = count;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
</script>
<style scoped>
/* seckill */

page {
  padding: 0 20rpx;
  box-sizing: border-box;
  height: 100%;
}

.banner-box {
  width: 692rpx;
  margin: 20rpx auto 20rpx auto;
}

.swiper {
  width: 100%;
  height: 300rpx;
}

.swiper-item {
  width: 100%;
  height: 250rpx;
}

.banner-box image {
  width: 100%;
  height: 250rpx;
  display: block;
}

.time-list {
  height: 74rpx;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  display: flex;
  padding-bottom: 24rpx;
}

.time-item {
  width: 228rpx;
  height: 60rpx;
  box-sizing: border-box;
  text-align: center;
  color: #fff;
  display: inline-block;
  position: relative;
  margin-right: 14rpx;
  background: #C31E1D;
  border-radius: 10rpx;
}

.time-item .tab-bg {
  position: absolute;
  width: 228rpx;
  height: 74rpx;
  left: 0;
  top: 0;
}

.time-item.active .tab-bg {
  height: 113rpx;
}

.time-item .center {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* flex-direction: column; */
  font-size: 24rpx;
  position: relative;
}

.time-item text {
  display: block;
  position: relative;
}

.time-item text:first-of-type {
  font-weight: bold;
  font-size: 27rpx;
}

.time-item .triangle {
  position: absolute;
  bottom: 0rpx;
  left: 50%;
  margin-left: -10rpx;
  width: 0rpx;
  height: 0rpx;
  border-bottom: 10rpx solid #fff;
  border-top: 10rpx solid transparent;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  display: none;
}

.active .triangle {
  display: block;
}

.time-item text:first-of-type {
  font-size: 30rpx;
}

.time-item text:last-of-type {
  font-size: 22rpx;
  margin-left: 15rpx;
}

.time-item.active {
  color: #fff;
}

.time-down {
  position: relative;
  width: 710rpx;
  margin: 0 auto 22rpx auto;
  height: 60rpx;
  font-size: 24rpx;
  overflow: hidden;
  line-height: 60rpx;
  color: #fff;
  font-weight: bold;
  font-size: 22rpx;
  padding: 0rpx 20rpx;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}
.seckill_tip_bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 710rpx;
  height: 60rpx;
}

.time-down view:first-of-type {
  font-size: 22rpx;
  /* color: #8b8b8c; */
  float: left;
}

.time-down view:first-of-type image {
  width: 17rpx;
  height: 23rpx;
  vertical-align: middle;
  margin-right: 14rpx;
  margin-top: -4rpx;
}

.time-down view.ahead image {
  width: 18rpx;
  height: 29rpx;
}

.time-down view.end image {
  width: 26rpx;
  height: 26rpx;
}

.time-down view.time-box {
  /* color: #8b8b8c; */
  float: right;
  font-size: 22rpx;
  margin-left: 24rpx;
  font-weight: normal;
}

.time-down view.time-box .txt {
  width: 42rpx;
  height: 50rpx;
  text-align: center;
  line-height: 50rpx;
  margin: 0rpx 10rpx;
  /* color: #1b1b1d; */
  font-weight: bold;
}

.time-down view.time-box .txt2 {
  display: inline-block;
  width: 42rpx;
  height: 50rpx;
  background-color: #009f55;
  border-radius: 4px;
  color: #fff;
  text-align: center;
  line-height: 50rpx;
  margin: 0rpx 10rpx;
}

.time-down view.time-box .colon {
  line-height: 60rpx;
  font-weight: bold;
  /* color: #1b1b1d; */
}

.goods-item {
  position: relative;
  /* width: 100%; */
  /* height: 210rpx; */
  padding: 21rpx 20rpx;
  overflow: hidden;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  display: flex;
}
.offshelf{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(238,238,238,.5);
  z-index: 99;
}
.offshelf .icon{
  flex-shrink: 0;
  position: absolute;
  left: 88rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 120rpx;
  height: 120rpx;
}
.offshelf .icon image{
  width: 100%;
}
.goods-img-box {
  width: 256rpx;
  height: 256rpx;
  overflow: hidden;
  float: left;
  position: relative;
}

.goods-img-box image {
  width: 100%;
  height: 100%;
}

.goods-img-box .qiangguang {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
}

.goods-info {
  width: calc(100% - 288rpx);
  position: relative;
  flex: 1;
  margin-left: 20rpx;
}

.goods-info .goods-introduce {
  font-size: 22rpx;
  color: #009f55;
  height: 30rpx;
  line-height: 30rpx;
  font-weight: bold;
}

.goods-info .goods-introduce text {
  padding: 0 10rpx;
  height: 30rpx;
  border-radius: 6rpx;
  background: #009f55;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
}

.goods-info .goods-name {
  color: #454545;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  font-size: 30rpx;
  line-height: 36rpx;
  font-weight: bold;
  padding: 5rpx 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.goods-info .goods-name text {
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 6rpx;
  background: #009136;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.goods-info .goods-name view {
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-weight: Medium;
}

.goods-info .goods-desc {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999;
  font-size: 20rpx;
  height: 20rpx;
  line-height: 20rpx;
  margin: 8rpx 0rpx 20rpx;
}

.goods-price {
  color: #ff8561;
  font-size: 20rpx;
  line-height: 32rpx;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.goods-price .nowPrice {
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 13rpx;
}

.goods-price .oldPrice {
  color: #8b8b8c;
  text-decoration: line-through;
  font-size: 20rpx;
}

.goods-info button,
.goods-info .button_view {
  min-width: 160rpx;
  padding: 0 10rpx;
  height: 60rpx;
  border-radius: 30rpx;
  line-height: 60rpx;
  color: #fff;
  border: none;
  font-size: 28rpx;
  padding: 0;
  position: absolute;
  right: 0rpx;
  bottom: 0rpx;
  text-align: center;
}

.goods-info button::after {
  border: none;
}

.goods-info button.unable {
  background-color: #d9d9d9;
}

.goods-info button.enable {
  background-color: #009f55;
}

.progress-row-box {
  /* position: absolute;
  left: 0rpx;
  bottom: 82rpx; */
  width: 100%;
  display: flex;
  align-items: center;
}

.goods-quantity {
  font-size: 20rpx;
  margin-left: 14rpx;
}

.progress-box {
  /* width: 156rpx; */
  font-size: 20rpx;
  height: 32rpx;
  box-sizing: border-box;
  /* border: 2rpx solid #fbbe35; */
  /* border-radius: 15rpx; */
  line-height: 32rpx;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.progress-box .progress-text {
  display: flex;
  padding: 0 7rpx;
  color: #fff;
  font-weight: bold;
  position: relative;
  z-index: 6;
  align-items: center;
  justify-self: start;
  background-color: #FF0000;
  border-radius: 4rpx;
}

/* .progress-box.end {
  border: 2rpx solid #D7D7D7;
} */

.progress-box.end .progress-text {
  background-color: #999999;
}


.progress-box .progress-text image {
  width: 16rpx;
  height: 20rpx;
  /* margin: 0 10rpx; */
  margin-right: 5rpx;
}

.progress-box progress {
  display: inline-block;
  width: 156rpx;
  height: 36rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
}

.goods-content {
  /* padding: 0 40rpx; */
  padding-bottom: 30rpx;
}

.goods-content .no-data {
  /* height: 50% !important; */
}

.time-slot {
  height: auto;
  margin-top: 30%;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  /* position: unset; */
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: #fff;
}

.tabbar-height {
  height: 128rpx;
}

.tabbar-height.iphoneX-height {
  height: 178rpx;
  width: 100%;
}

.flow-car {
  position: fixed;
  left: 40rpx;
  bottom: 200rpx;
  width: 120rpx;
  height: 120rpx;
  z-index: 7;
}

.red-hint {
  position: absolute;
  top: 25rpx;
  right: 25rpx;
  background-color: red;
  color: white;
  font-size: 30rpx;
  height: 40rpx;
  width: 40rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-car image {
  width: 120rpx;
  height: 120rpx;
}

.cart-control {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 164rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 80rpx;
  text-align: center;
}

.add-box,
.reduce-box {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  padding: 0;
  color: #fff;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  text-align: center;
  line-height: 40rpx;
  vertical-align: middle;
}

.add-box {
  position: absolute;
  right: 0;
}

.reduce-box {
  position: absolute;
  left: 0;
}

.add-box view,
.reduce-box view {
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
}

.add-box button,
.reduce-box button {
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
}

.add-box button::after,
.reduce-box button::after {
  border: 0;
}

.cart-control .cart-count {
  font-size: 28rpx;
  color: #454545;
  height: 100%;
}

button.button-hover {
  color: transparent;
  background-color: transparent;
  border: none;
}

.add-img,
.reduce-img {
  width: 40rpx;
  height: 40rpx;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -20rpx;
  margin-left: -20rpx;
}
.seckill_list_bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
.seckill_title {
  width: 215rpx;
  height: 51rpx;
  display: block;
  margin: 36rpx auto;
}
.seckill_price_box {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60rpx;
}
.seckill_price_box>view {
  z-index: 1;
}
.seckill_price_box .seckill_price_bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 397rpx;
  height: 60rpx;
}
.seckill_price_box .nowPrice {
  color: #F52F0A;
  font-size: 30rpx;
}
.seckill_price_box .oldPrice {
  color: #999999;
  font-size: 20rpx;
}
</style>