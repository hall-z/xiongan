<template>
<!-- pages/distribution/myDistribution/myDistribution.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="top-info">
  <image class="portrait" :src="state.userInfo.avatarUrl"></image>
  <view class="info">
    <view class="nickName-box">
      <view class="nike-name">{{state.member.nickName ? state.member.nickName : state.userInfo.nickName}}</view>
      <view v-if="state.isVIP" class="member-nameplate">
        <image class="flower" :src="state.imagesPath.iconVIPFlower"></image>
        {{state.vipGradeConfig.name}}
      </view>
    </view>
    <view class="vip-nameplate" v-if="state.member.gradeName" @click.stop="toBenefits">
      <image v-if="memberGrade && memberGrade.gradeLablePicture" class="vip-nameplate-img" :src="memberGrade.gradeLablePicture"></image>
      <text>{{state.member.gradeName ? state.member.gradeName : ''}}></text>
    </view>
  </view>
</view>
<view class="profit-box">
  <view class="title">我的收益</view>
  <view class="profit-content">
    <view class="put-forward-box">
      <text>可提现金额(元)</text>
      <text>{{state.member.canTotal}}</text>
      <button class="put-forward-btn" @click="createBackCash">提现</button>
    </view>
    <view class="profit-item">
      <text>待到账金额(元)</text>
      <text>{{state.member.stayTotal}}</text>
    </view>
    <view class="profit-item">
      <text>累计金额(元)</text>
      <text>{{state.member.hasBackTotal}}</text>
    </view>
  </view>
  <view class="my-profit" @click="toProfit">我的提现明细></view>
</view>
<view class="billboard-box">
  <view class="title">龙虎榜</view>
  <view class="billboard-content">
    <view class="billboard-tab">
      <view :class="'tab-item ' + (state.tabSelected == idx ? 'active' : '')" v-for="(item , idx) in state.tabType" :data-idx="idx" :key="index" @click="switchTab">
        {{item}}
      </view>
    </view>
    <swiper class="swiper" :current="state.tabSelected" @change="bindChange" duration="300">
      <swiper-item>
        <view class="portrait-item" v-for="(item , index) in state.monthRankList" :key="idx">
          <view class="portrait-img">
            <image :src="item.avatar ? item.avatar : state.imagesPath.userPortrait"></image>
          </view>
          <view class="billboard-info">
            <text class="name">{{item.name ? item.name : '虚位以待'}}</text>
            <text class="total">￥{{item.total ? item.total : 0}}</text>
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="portrait-item" v-for="(item , index) in state.quarterRankList" :key="idx">
          <view class="portrait-img">
            <image :src="item.avatar ? item.avatar : state.imagesPath.userPortrait"></image>
          </view>
          <view class="billboard-info">
            <text class="name">{{item.name ? item.name : '虚位以待'}}</text>
            <text class="total">￥{{item.total ? item.total : 0}}</text>
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="portrait-item" v-for="(item , index) in state.annualRankList" :key="idx">
          <view class="portrait-img">
            <image :src="item.avatar ? item.avatar : state.imagesPath.userPortrait"></image>
          </view>
          <view class="billboard-info">
            <text class="name">{{item.name ? item.name : '虚位以待'}}</text>
            <text class="total">￥{{item.total ? item.total : 0}}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
  <view class="my-more" @click="toRankingList">查看更多数据></view>
</view>
<view class="module-box">
  <view class="title">常用功能</view>
  <view class="module-content">
    <view @click="toProfit">
      <view class="img">
        <image src="http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconProfit.png" mode="widthFix"></image>
      </view>
      <text>提现明细</text>
    </view>
    <view @click="toMyGroup">
      <view class="img">
        <image src="http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconTeam.png" mode="widthFix"></image>
      </view>
      <text>我的团队</text>
    </view>
    <view @click="toRankingList"> 
      <view class="img">
        <image src="http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconNoticeList.png" mode="widthFix"></image>
      </view>
      <text>龙虎榜</text>
    </view>
    <view @click="toInvitation" v-if="state.showShareFriends">
      <view class="img">
        <image src="http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconShare1.png" mode="widthFix"></image>
      </view>
      <text>邀请好友</text>
    </view>
  </view>
</view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiBackCashServiceJs from "@/service/api/newretail/backCashService";
import _apiDistributionServiceJs from "@/service/api/newretail/distributionService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/distribution/myDistribution/myDistribution.js
const distributionService = _apiDistributionServiceJs;
const backCashService = _apiBackCashServiceJs;
const utils = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "分销员中心",
  imagesPath: IMGAGESPATH,
  tabType: ["本月", "本季", "本年"],
  tabSelected: 0,
  member: {
    nickName: '未获取到会员昵称'
  },
  userInfo: {},
  rankList: [{}, {}, {}],
  monthRankList: [{}, {}, {}],
  quarterRankList: [{}, {}, {}],
  annualRankList: [{}, {}, {}],
  isVIP: false,
  vipGradeConfig: null,
  showShareFriends: true
});
onLoad(function (options) {
  uni.hideShareMenu();
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig;
  state.showShareFriends = !app.globalData.systemConfigure.openDistributionAccountShareProduct;
  let memberId = '';
  if (app.globalData.userInfo) {
    state.userInfo = app.globalData.userInfo.wxaUser;
    checkUserInfo();
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member;
      getMemberInfo();
      getMemberGrade();
      memberId = app.globalData.userInfo.member.id;
      distributionService.queryGroup(memberId).then(res => {
        console.log(res);
      }).catch(err => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
      getRankList(0);
      getRankList(1);
      getRankList(2);
    } else {
      uni.showToast({
        title: "您还不是会员，请绑定手机号成为会员~",
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    uni.showToast({
      title: "您还没有登录哦，请点击头像授权登陆~",
      icon: 'none',
      duration: 2000
    });
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
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
});
function switchTab(e) {
  //如果需要加载数据
  state.tabSelected = e.currentTarget.dataset.idx;
}
function bindChange(e) {
  let that = this;
  state.tabSelected = e.detail.current;
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
function getMemberInfo() {
  distributionService.getDistributionUser().then(res => {
    console.log(res);
    let member = state.member;
    member = {
      ...member,
      allBackTotal: res.allBackTotal || res.allBackTotal === 0 ? res.allBackTotal.toFixed(2) : 0,
      canTotal: res.canTotal || res.canTotal === 0 ? res.canTotal.toFixed(2) : 0,
      hasBackTotal: res.hasBackTotal || res.hasBackTotal === 0 ? res.hasBackTotal.toFixed(2) : 0,
      minDraw: res.minDraw || res.minDraw === 0 ? res.minDraw.toFixed(2) : 0,
      stayTotal: res.stayTotal || res.stayTotal === 0 ? res.stayTotal.toFixed(2) : 0
    };
    state.member = member;
    console.log(member);
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getRankList(current) {
  const that = this;
  let date = new utils.ResponseDate();
  let now = utils.formatTime(date).replace(/\//g, '-');
  if (current === 0) {
    let startDate = now.slice(0, 8) + '01 00:00:00';
    let endDate = now;
    queryRank(startDate, endDate, current);
  } else if (current === 1) {
    let nowMonth = date.getMonth();
    let month = utils.timeFormat(getQuarterStartMonth(nowMonth));
    let startDate = now.slice(0, 4) + '-' + month + '-01 00:00:00';
    let endDate = now;
    queryRank(startDate, endDate, current);
  } else if (current === 2) {
    let startDate = now.slice(0, 4) + '-01-01 00:00:00';
    let endDate = now;
    queryRank(startDate, endDate, current);
  } else {
    let startDate = now.slice(0, 8) + '01 00:00:00';
    let endDate = now;
    queryRank(startDate, endDate, current);
  }
}
function queryRank(startDate, endDate, current) {
  distributionService.queryRank(state.member.id, 1, 3, startDate, endDate, false).then(res => {
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
    if (current === 0) {
      state.monthRankList = tempList;
    } else if (current === 1) {
      state.quarterRankList = tempList;
    } else if (current === 2) {
      state.annualRankList = tempList;
    } else {}
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function createBackCash() {
  const that = this;
  let postData = {
    mobile: state.member.mobile
  };
  uni.showModal({
    title: '提示',
    content: '提现申请后需要等待工作人员审核，预计1-2个工作日到账，确认要提现吗？',
    success(res) {
      if (res.confirm) {
        if (parseFloat(state.member.canTotal) > 0 && parseFloat(state.member.canTotal) >= parseFloat(state.member.minDraw)) {
          backCashService.create(postData).then(res => {
            state.member = {
              ...state.member,
              canTotal: 0
            };
            uni.showToast({
              title: "提现申请成功，请耐心等待工作人员审核，审核后预计1-2个工作日到账~",
              icon: 'none',
              duration: 2000
            });
          }).catch(err => {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000
            });
          });
        } else {
          uni.showToast({
            title: "可提现金额不足~",
            icon: 'none',
            duration: 2000
          });
        }
      } else if (res.cancel) {
        console.log('用户取消提现');
      }
    }
  });
}
function toProfit() {
  NAVPAGE.toProfit();
}
function toMyGroup() {
  NAVPAGE.toDistributionTeamList();
}
function toRankingList() {
  NAVPAGE.toRankingList();
}
function toInvitation() {
  NAVPAGE.toInvite();
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo;
      let isExpired = false;
      let isVIP = false;
      const now = new utils.ResponseDate().getTime();
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
      state.isVIP = isVIP;
      state.isExpired = isExpired;
      state.vipEndTime = vipEndTime;
    }
  }
}
function toBenefits() {
  NAVPAGE.toBenefits();
}
function getMemberGrade() {
  const that = this;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const member = app.globalData.userInfo.member;
    if (app.globalData.memberGrade) {
      state.memberGrade = app.globalData.memberGrade;
    } else {
      if (member.gradeId) {
        memberService.getGradeById(member.gradeId).then(res => {
          app.globalData.memberGrade = res;
          state.memberGrade = res;
        }).catch(err => {
          utils.showToast(err.message);
        });
      }
    }
  }
}
</script>
<style scoped>
/* pages/distribution/myDistribution/myDistribution.wxss */

page {
  background: #f4f5f9;
}

.top-info {
  display: flex;
  justify-content: flex-start;
  padding: 0 30rpx;
  height: 182rpx;
  color: #fff;
  align-items: center;
  background: url('http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconBusinessBg.png') top;
  background-size: 100% 100%;
}

.top-info .portrait {
  width: 104rpx;
  height: 104rpx;
  border-radius: 50%;
}

.top-info .info {
  margin-left: 22rpx;
  line-height: 36rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  /* color: #fff; */
}

/* .top-info .info text {
  font-size: 32rpx;
} */

.top-info .info image {
  width: 31rpx;
  margin-right: 12rpx;
}

.top-info .info .vip-nameplate {
  margin-top: 18rpx;
  display: flex;
  align-items: center;
}

/* .top-info .info view text {
  font-size: 28rpx;
} */

.top-info .info .nickName-box {
  display: flex;
  align-items: center;
  height: 32rpx;
}

.top-info .info .nike-name {
  color: #fff;
  font-size: 32rpx;
  max-width: 360rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-info .info .member-nameplate {
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

.top-info .info .member-nameplate .flower {
  width: 21rpx;
  height: 23rpx;
  margin-right: 7rpx;
}

.top-info .info .vip-nameplate {
  min-width: 91rpx;
  height: 40rpx;
  padding: 0 13rpx 0 21rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20rpx;
  font-size: 20rpx;
  color: #3f3d3d;
  text-align: center;
  line-height: 40rpx;
  color: #666666;
  position: relative;
  overflow: hidden;
}

.top-info .info .vip-nameplate text {
  font-size: 20rpx;
  color: #ffffff;
  margin: auto;
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

.profit-box,
.billboard-box,
.module-box {
  padding-top: 10rpx;
  background: #fff;
}

.profit-box .title,
.billboard-box .title,
.module-box .title {
  font-size: 32rpx;
  color: #1b1b1d;
  height: 78rpx;
  line-height: 78rpx;
  padding: 0 38rpx;
  border-bottom: 1rpx solid #dcdcdc;
}

.profit-content {
  padding: 0 40rpx;
  display: flex;
  flex-wrap: wrap;
}

.put-forward-box {
  display: flex;
  flex-direction: column;
  position: relative;
  border-bottom: 1rpx solid #dcdcdc;
  padding: 32rpx 0 35rpx 0;
  width: 100%;
}

.put-forward-box text:first-of-type {
  color: #999;
  font-size: 30rpx;
  line-height: 48rpx;
}

.put-forward-box text:last-of-type {
  font-size: 60rpx;
  line-height: 80rpx;
}

.put-forward-btn {
  width: 170rpx;
  height: 66rpx;
  background: #f50;
  box-shadow: 5rpx 0rpx 8rpx rgba(255, 140, 106, 0.4);
  border-radius: 33rpx;
  font-size: 30rpx;
  color: #fff;
  line-height: 66rpx;
  text-align: center;
  padding: 0;
  position: absolute;
  right: 0;
  bottom: 41rpx;
}

.profit-item {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 30rpx 0 34rpx 0;
  width: 50%;
  padding-left: 32rpx;
  box-sizing: border-box;
}

.profit-item text:first-of-type {
  color: #999;
  font-size: 30rpx;
  line-height: 48rpx;
}

.profit-item text:last-of-type {
  font-size: 48rpx;
  line-height: 70rpx;
}

.my-profit,
.my-more {
  font-size: 26rpx;
  color: #666;
  line-height: 36rpx;
  width: 100%;
  text-align: center;
  margin-bottom: 20rpx;
  padding-bottom: 27rpx;
}

.billboard-content {
  padding: 30rpx 0 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
  height: 342rpx;
  overflow: hidden;
  display: block;
}

.swiper swiper-item {
  width: 100%;
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
  padding: 73rpx 0 38rpx 0;
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
  border-radius: 50%;
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

.module-content {
  padding: 20rpx 40rpx;
  display: flex;
  /* justify-content: space-between; */
  justify-content: flex-start;
  flex-wrap: wrap;
}

.module-content>view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24rpx 24rpx 20rpx 24rpx;
  margin-bottom: 8rpx;
  margin-right: 100rpx;
}

.module-content>view:nth-of-type(3) {
  margin-right: 0;
}

.module-content>view .img {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12rpx;
}

.module-content>view image {
  width: 54rpx;
}

.module-content>view text {
  font-size: 28rpx;
  color: #333;
  line-height: 36rpx;
}
</style>