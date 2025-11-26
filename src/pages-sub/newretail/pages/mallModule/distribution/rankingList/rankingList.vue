<template>
<!--pages/distribution/rankingList/rankingList.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="ranking-content">
  <view class="tab-box">
    <view class="billboard-tab">
      <view :class="'tab-item ' + (state.tabSelected == idx ? 'active' : '')" v-for="(item , idx) in state.tabType" :data-idx="idx" :key="index" @click="switchTab">{{item}}</view>
    </view>
  </view>
  <swiper class="swiper" :current="state.tabSelected" @change="bindChange" duration="300">
    <swiper-item>
      <view class="first-three">
        <view class="portrait-item" v-for="(item , index) in state.rankingList" v-if="index < 3" :key="index">
          <view class="portrait-img">
            <image :src="item.avatar ? item.avatar : state.imagesPath.userPortrait"></image>
          </view>
          <view class="billboard-info">
            <text class="name">{{item.name ? item.name : '虚位以待'}}</text>
            <text class="total">￥{{item.total ? item.total : 0}}</text>
          </view>
        </view>
      </view>
      <view class="ranking-list">
        <view class="ranking-item" v-for="(item , index) in state.rankingList" v-if="index > 2" :key="index">
          <view class="info">
            <text class="ranking">{{item.num}}</text>
            <image :src="item.imagrUrl"></image>
            <text class="name">{{item.name}}</text>
          </view>
          <text class="total">￥{{item.total}}</text>
        </view>
      </view>
    </swiper-item>
    <swiper-item>
      <view class="first-three">
        <view class="portrait-item" v-for="(item , index) in state.rankingList" v-if="index < 3" :key="index">
          <view class="portrait-img">
            <image :src="item.avatar ? item.avatar : state.imagesPath.userPortrait"></image>
          </view>
          <view class="billboard-info">
            <text class="name">{{item.name ? item.name : '虚位以待'}}</text>
            <text class="total">￥{{item.total ? item.total : 0}}</text>
          </view>
        </view>
      </view>
      <view class="ranking-list">
        <view class="ranking-item" v-for="(item , index) in state.rankingList" v-if="index > 2" :key="index">
          <view class="info">
            <text class="ranking">{{item.num}}</text>
            <image :src="item.imagrUrl"></image>
            <text class="name">{{item.name}}</text>
          </view>
          <text class="total">￥{{item.total}}</text>
        </view>
      </view>
    </swiper-item>
    <swiper-item>
      <view class="first-three">
        <view class="portrait-item" v-for="(item , index) in state.rankingList" v-if="index < 3" :key="index">
          <view class="portrait-img">
            <image :src="item.avatar ? item.avatar : state.imagesPath.userPortrait"></image>
          </view>
          <view class="billboard-info">
            <text class="name">{{item.name ? item.name : '虚位以待'}}</text>
            <text class="total">￥{{item.total ? item.total : 0}}</text>
          </view>
        </view>
      </view>
      <view class="ranking-list">
        <view class="ranking-item" v-for="(item , index) in state.rankingList" v-if="index > 2" :key="index">
          <view class="info">
            <text class="ranking">{{item.num}}</text>
            <image :src="item.imagrUrl"></image>
            <text class="name">{{item.name}}</text>
          </view>
          <text class="total">￥{{item.total}}</text>
        </view>
      </view>
    </swiper-item>
  </swiper>
  <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
  <view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view> 
</view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiDistributionServiceJs from "@/service/api/newretail/distributionService";
import _apiBackCashServiceJs from "@/service/api/newretail/backCashService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/distribution/rankingList/rankingList.js
const backCashService = _apiBackCashServiceJs;
const distributionService = _apiDistributionServiceJs;
const utils = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "龙虎榜",
  imagesPath: IMGAGESPATH,
  tabType: ["本月", "本季", "本年"],
  tabSelected: 0,
  rankingList: [],
  page: 1,
  pageSize: 10,
  pageCount: 1,
  noMore: false,
  loading: false
});
onLoad(function (options) {
  uni.hideShareMenu();
  const that = this;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member;
      state.mobile = app.globalData.userInfo.member.mobile;
      handelQueryList(state.page);
    } else {
      uni.showToast({
        title: '您还不是会员，请先绑定手机号码成为会员',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    try {
      uni.showModal({
        title: '提示',
        content: '请登录后查看',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            NAVPAGE.toMy();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    } catch (error) {}
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  state.rankingList = [];
  state.mobile = '';
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  onLoad();
  uni.stopPullDownRefresh();
});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    let page = state.page;
    ++page;
    handelQueryList(page);
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.rankingList.length > 0) {
      state.noMore = true;
    } else {
      uni.showToast({
        title: '没有更多数据~',
        icon: 'none',
        duration: 2000
      });
    }
  }
});
onShareAppMessage(function () {});
function switchTab(e) {
  console.log(e);
  //如果需要加载数据
  state.tabSelected = e.currentTarget.dataset.idx;
  state.rankingList = [];
  handelQueryList(1);
}
function bindChange(e) {
  let that = this;
  //如果需要加载数据
  state.tabSelected = e.detail.current;
  state.rankingList = [];
  handelQueryList(1);
}
function handelQueryList(page) {
  const that = this;
  let date = new utils.ResponseDate();
  let now = utils.formatTime(date).replace(/\//g, '-');
  if (state.tabSelected === 0) {
    let startDate = now.slice(0, 8) + '01 00:00:00';
    let endDate = now;
    queryRank(startDate, endDate, page);
  } else if (state.tabSelected === 1) {
    let nowMonth = date.getMonth();
    let month = utils.timeFormat(getQuarterStartMonth(nowMonth));
    let startDate = now.slice(0, 4) + '-' + month + '-01 00:00:00';
    let endDate = now;
    queryRank(startDate, endDate, page);
  } else if (state.tabSelected === 2) {
    let startDate = now.slice(0, 4) + '-01-01 00:00:00';
    let endDate = now;
    queryRank(startDate, endDate, page);
  } else {
    let startDate = now.slice(0, 8) + '01 00:00:00';
    let endDate = now;
    queryRank(startDate, endDate, page);
  }
  let memberId = app.globalData.userInfo.member.id;
  distributionService.queryGroup(memberId).then(res => {
    console.log(res);
    if (res && res.length >= 0) {
      let tempGroupList = res;
      state.groupList = tempGroupList;
    }
    if (state.loading) {
      state.loading = false;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
    if (state.loading) {
      state.loading = false;
    }
  });
}
function queryRank(startDate, endDate, page) {
  distributionService.queryRank(state.member.id, page, state.pageSize, startDate, endDate, false).then(res => {
    console.log(res);
    let tempList = [];
    if (res && res.records.length > 0) {
      for (let i = 0; i < 3; i++) {
        const ele = res.records[i];
        if (ele) {
          if (i == 1) {
            tempList.unshift(ele);
          } else {
            tempList.push(ele);
          }
        } else {
          if (i == 1) {
            tempList.unshift({});
          } else {
            tempList.push({});
          }
        }
      }
    } else {
      tempList = [{}, {}, {}];
    }
    let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
    state.page = res.page;
    state.pageCount = pageCount;
    state.rankingList = tempList;
    if (state.loading) {
      that.setData({
        loading: false
      });
    }
  }).catch(err => {
    console.log(err);
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
    if (state.loading) {
      that.setData({
        loading: false
      });
    }
  });
}
function getQuarterStartMonth(nowMonth) {
  let quarterStartMonth = 1;
  if (nowMonth < 3) {
    quarterStartMonth = 1;
  }
  if (2 < nowMonth && nowMonth < 6) {
    quarterStartMonth = 4;
  }
  if (5 < nowMonth && nowMonth < 9) {
    quarterStartMonth = 7;
  }
  if (nowMonth > 8) {
    quarterStartMonth = 10;
  }
  return quarterStartMonth;
}
</script>
<style scoped>
/* pages/distribution/rankingList/rankingList.wxss */

page {
  height: 100%;
  border-top: 1rpx solid #e6e6e6;
}

.ranking-content {
  height: 100%;
}

.tab-box {
  height: 100rpx;
  width: 100%;
  border-bottom: 1rpx solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.billboard-tab {
  width: 499rpx;
  height: 54rpx;
  background: #fff;
  border-radius: 27rpx;
  display: flex;
  font-size: 28rpx;
  line-height: 52rpx;
  color: #999;
  justify-content: center;
}

.billboard-tab .tab-item {
  flex: 1;
  text-align: center;
  line-height: 52rpx;
  border: 1rpx solid #999;
}

.billboard-tab .tab-item:first-of-type {
  border-top-left-radius: 27rpx;
  border-bottom-left-radius: 27rpx;
}

.billboard-tab .tab-item:nth-of-type(2) {
  border-left: 0;
  border-right: 0;
  position: relative;
}

.billboard-tab .tab-item:last-of-type {
  border-top-right-radius: 27rpx;
  border-bottom-right-radius: 27rpx;
}

.billboard-tab .active {
  background: #f50;
  color: #fff;
  border: 1rpx solid #f50;
}

.billboard-tab .tab-item.active:nth-of-type(2)::after {
  content: '';
  background: #f50;
  height: 54rpx;
  width: 1rpx;
  right: -1rpx;
  top: -1rpx;
  position: absolute;
}

.billboard-tab .tab-item.active:nth-of-type(2)::before {
  content: '';
  background: #f50;
  height: 54rpx;
  width: 1rpx;
  left: -1rpx;
  top: -1rpx;
  position: absolute;
}

.swiper {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: block;
}

.swiper swiper-item {
  width: 100%;
}

.first-three {
  display: flex;
  justify-content: center;
}

.portrait-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin: 0 19rpx;
  width: 159rpx;
  padding: 73rpx 0 24rpx 0;
}

.portrait-item:nth-of-type(2) {
  width: 221rpx;
}

.portrait-item .portrait-img {
  position: relative;
  width: 105rpx;
  height: 116rpx;
}

.portrait-item .portrait-img::before {
  content: '';
  width: 68rpx;
  height: 56rpx;
  position: absolute;
  left: -15rpx;
  top: -28rpx;
  background-size: 68rpx 56rpx;
}

.portrait-item .portrait-img image {
  width: 105rpx;
  height: 105rpx;
  position: relative;
  border-radius: 50%;
}

.portrait-item .portrait-img::after {
  content: '';
  width: 159rpx;
  height: 34rpx;
  position: absolute;
  top: 82rpx;
  left: 50%;
  margin-left: -79rpx;
}

.portrait-item:first-of-type .portrait-img:before {
  background: url('http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconRunnerUp.png') left top;
  background-size: 68rpx 56rpx;
}

.portrait-item:first-of-type .portrait-img:after {
  background: url('http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconNoTwo.png') left top;
  background-size: 159rpx 34rpx;
}

.portrait-item:nth-of-type(2) .portrait-img {
  width: 146rpx;
  height: 159rpx;
}

.portrait-item:nth-of-type(2) .portrait-img image {
  width: 146rpx;
  height: 146rpx;
}

.portrait-item:nth-of-type(2) .portrait-img:before {
  left: 5rpx;
  top: -33rpx;
  background: url('http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconChampion.png') left top;
  background-size: 68rpx 56rpx;
}

.portrait-item:nth-of-type(2) .portrait-img:after {
  width: 221rpx;
  height: 46rpx;
  background: url('http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconNoOne.png') left top;
  background-size: 221rpx 46rpx;
  top: 113rpx;
  margin-left: -110rpx;
}

.portrait-item:last-of-type .portrait-img:before {
  background: url('http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconThirdPlace.png') left top;
  background-size: 68rpx 56rpx;
}

.portrait-item:last-of-type .portrait-img:after {
  background: url('http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconNoThree.png') left top;
  background-size: 159rpx 34rpx;
}

.billboard-info {
  font-size: 24rpx;
  text-align: center;
  line-height: 36rpx;
  margin-top: 4rpx;
}

.billboard-info text {
  display: block;
}

.billboard-info .name {
  margin-bottom: 2rpx;
}

.billboard-info .total {
  color: #f50;
}

.ranking-list {}

.ranking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40rpx;
  height: 120rpx;
}

.ranking-item .info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.ranking-item .info .ranking {
  font-size: 36rpx;
  color: #f50;
  position: absolute;
  left: 9rpx;
}

.ranking-item .info image {
  width: 64rpx;
  height: 64rpx;
  margin-left: 100rpx;
  margin-right: 32rpx;
}

.ranking-item .info .name {
  font-size: 30rpx;
  color: #000;
}

.ranking-item .total {
  font-size: 30rpx;
  color: #f50;
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #ffffff;
  border-radius: 0
}

.loading-btn::after {
  border: 0;
}

.order-end {
  color: #009136;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
}
</style>