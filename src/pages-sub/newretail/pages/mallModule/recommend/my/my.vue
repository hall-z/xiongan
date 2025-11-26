<template>
<!--pages/mallModule/recommend/my/my.wxml-->
<view>
<navigationBar title="我的种草" :background="state.isFilterTabSticky ? '#fff' : ''" :color="state.isFilterTabSticky ? '#000' : '#fff'"></navigationBar>
<view class="my-page">
  <image class="my-title-bg" :src="state.imagesPath.square_my_bg" mode="widthFix"></image>
  <view class="my-info-box">
    <view class="my-info-top">
      <view class="my-info-top-avatar">
        <!-- <image src="{{imagesPath.square_default_avatar}}" mode="widthFix"></image> -->
        <image :src="state.memberInfo.avatar" mode="widthFix"></image>
      </view>
      <view class="my-info-top-rt">
        <view class="my-info-top-rt-name">{{state.memberInfo.nickName}}</view>
        <view class="my-info-top-rt-like">
          <image :src="state.imagesPath.like_num_icon" mode="widthFix"></image>
          <view>获赞{{state.totalLikes}}</view>
          <view class="my-info-top-line"></view>
          <view>种草{{articleCount}}</view>
        </view>
      </view>
    </view>
    <view class="my-info-tab">
      <view class="my-info-tab-item" @click="changeTabFilter" data-id="memberId">
        <image v-if="state.currentTabValue === 'memberId'" :src="state.imagesPath.my_recommend_icon" mode="widthFix"></image>
        <image v-else :src="state.imagesPath.my_recommend_icon_active" mode="widthFix"></image>
        <view>我的种草</view>
      </view>
      <view class="my-info-tab-item" @click="changeTabFilter" data-id="currentMemberId">
        <image v-if="state.currentTabValue === 'currentMemberId'" :src="state.imagesPath.my_like_icon" mode="widthFix"></image>
        <image v-else :src="state.imagesPath.my_like_icon_active" mode="widthFix"></image>
        <view>我的喜欢</view>
      </view>
      <view class="my-info-tab-item" @click="changeTabFilter" data-id="subscribe">
        <image v-if="state.currentTabValue === 'subscribe'" :src="state.imagesPath.my_follow_icon" mode="widthFix"></image>
        <image v-else :src="state.imagesPath.my_follow_icon_active" mode="widthFix"></image>
        <view>我的关注</view>
      </view>
    </view>
  </view>
  <view class="fixed-top" style="top:160rpx">
    <view id="filterTabList" :class="'filter-tab-list ' + (state.isFilterTabSticky ? 'filter-tab-sticky' : '')">
        <view class="filter-tab-item" @click="changeTabFilter" data-id="new">
          最新
          <image v-if="state.currentFieldValue === 'new'" :src="state.imagesPath.square_filter_active" mode="widthFix"></image>
        </view>
        <view class="filter-tab-item" @click="changeTabFilter" data-id="hot">
          最热
          <image v-if="state.currentFieldValue === 'hot'" :src="state.imagesPath.square_filter_active" mode="widthFix"></image>
        </view>
        <view class="filter-my" @click="toSquaer">
          <image :src="state.imagesPath.square_btn_icon" mode="widthFix"></image>
          <view>广场</view>
        </view>
      </view>
      <view class="topic-list">
        <scroll-view scroll-x="" style="display:flex;white-space: nowrap;width: 100%;" @scrolltolower="onReachBottom">
          <view class="topic-item" v-for="(item , index) in state.topicList" :key="index" :data-id="item.id" :style="filters.getStyle(state.selectedTopicIds, item.id, state.themeColor)" @click="handleTopicTap">
            #{{item.name}}
        </view>
          <!-- <view wx:if="{{topicLoading}}" class="topic-item">加载中...</view> -->
          <!-- <view wx:if="{{!topicHasMore && topicList.length > 0}}" class="topic-item">没有更多了</view> -->
        </scroll-view>
      </view>
  </view>
  <!-- style="height:{{topHeight}}px;" -->
  <!-- <scroll-view scroll-y class="essay-list-scroll" bindscrolltolower="onEssayListReachBottom"> -->
    <!-- <view class="essay-list" wx:if="{{state.myRecommend.length > 0}}">
      <view class="essay-item" wx:for="{{state.myRecommend}}" data-index="{{index}}" bindtap="toDetails" data-row="{{item}}">
        <view class="essay-item-statu pending" wx:if="{{item.status === 'PENDING' && state.currentTabValue === 'memberId'}}">待审核</view>
        <view class="essay-item-statu" wx:if="{{item.status === 'REJECTED' && state.currentTabValue === 'memberId'}}">审核未通过</view>
        <view class="essay-pic">
            <video 
            wx:if="{{filters.isMp4(item.imgUrlList[0])}}"
            id="myVideo" 
            class="myVideo"
            src="{{item.imgUrlList[0]}}" 
            controls="{{false}}"
            show-center-play-btn='{{false}}' 
            show-play-btn="{{false}}" 
            show-mute-btn="{{false}}"
            picture-in-picture-mode="{{['push', 'pop']}}"
            ></video>
          <image wx:else src="{{item.imgUrlList[0]}}" mode="widthFix"></image>
        </view>
        <view class="essay-title">{{item.title}}</view>
        <view class="essay-info">
          <view class="essay-info-lt">
            <image class="essay-info-lt-avatar" src="{{item.memberAvatar ? item.memberAvatar : state.imagesPath.square_default_avatar}}" mode="widthFix"></image>
            <view class="essay-info-lt-name">{{item.memberNickname}}</view>
          </view>
          <view class="essay-info-rt">
            <image class="essay-info-rt-like" wx:if="{{item.isLiked}}" src="{{state.imagesPath.is_like_icon}}" mode="widthFix" catchtap="handleLike" data-index="{{index}}"></image>
            <image class="essay-info-rt-like" wx:else src="{{state.imagesPath.is_no_like_icon}}" mode="widthFix" catchtap="handleLike" data-index="{{index}}"></image>
            <view class="essay-info-lt-num">{{item.numberLikes}}</view>
          </view>
        </view>
      </view>
    </view> -->
    <scroll-view scroll-y="" style="background-color: #f2f2f2;position: relative;z-index: 2;width: 100%; height: 100%;padding: 0 20rpx 60rpx;box-sizing: border-box;" type="custom" @scrolltolower="onEssayListReachBottom" v-if="state.myRecommend.length > 0">
    <grid-view type="masonry" cross-axis-count="2" cross-axis-gap="10" main-axis-gap="10" style="width: 100%;">
      <view v-for="(item , index) in state.myRecommend">
        <view class="essay-item" :data-index="index" @click="toDetails" :data-row="item">
          <view class="essay-item-statu pending" v-if="item.status === 'PENDING' && state.currentTabValue === 'memberId'">待审核</view>
        <view class="essay-item-statu" v-if="item.status === 'REJECTED' && state.currentTabValue === 'memberId'">审核未通过</view>
          <view class="essay-pic">
            <video v-if="filters.isMp4(item.imgUrlList[0])" id="myVideo" class="myVideo" :src="item.imgUrlList[0]" :controls="false" :show-center-play-btn="false" :show-play-btn="false" :show-mute-btn="false" :picture-in-picture-mode="['push', 'pop']"></video>
            <image v-else :src="item.imgUrlList[0]" mode="widthFix"></image>
          </view>
          <view class="essay-title">{{item.title}}</view>
          <view class="essay-info">
            <view class="essay-info-lt">
              <image class="essay-info-lt-avatar" :src="item.memberAvatar ? item.memberAvatar : state.imagesPath.square_default_avatar" mode="widthFix"></image>
              <view class="essay-info-lt-name">{{item.memberNickname}}</view>
            </view>
            <view class="essay-info-rt" @click.stop="handleLike" :data-index="index">
              <image class="essay-info-rt-like" v-if="item.isLiked" :src="state.imagesPath.is_like_icon" mode="widthFix"></image>
              <image class="essay-info-rt-like" v-else :src="state.imagesPath.is_no_like_icon" mode="widthFix"></image>
              <view class="essay-info-lt-num">{{item.numberLikes}}</view>
            </view>
          </view>
        </view>
      </view>
    </grid-view>
  </scroll-view>
    <view class="no-data" v-else>
      <image :src="state.imagesPath.recommend_nonodata" mode="widthFix"></image>
      <view class="no-data-tips">快来发布种草作品吧！</view>
      <view class="no-data-btn" @click="toRelease" :style="'background-color: ' + state.themeColor + ';'">立即发布</view>
    </view>
  <!-- </scroll-view> -->
  <image class="recommend-release" :src="state.imagesPath.recommend_release_icon" @click="toRelease" mode="widthFix"></image>
  <image class="scroll-top" v-if="state.showScrollTop" :src="state.imagesPath.scrollTop" @click="handleScrollTop"></image>
</view>
</view>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _apiRecommendServiceJs from "@/service/api/newretail/recommendService";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/recommend/my/my.js
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const recommendService = _apiRecommendServiceJs;
const themeManager = _utilsThemeManagerJs;
const state = reactive({
  imagesPath: IMGAGESPATH,
  isSearchFixed: false,
  showScrollTop: false,
  filterVo: {
    memberId: '',
    currentMemberId: '',
    statuses: ["PENDING", "APPROVED", "REJECTED"],
    page: 1,
    pageSize: 15,
    parts: 'member'
  },
  myRecommend: [],
  currentTabValue: 'memberId',
  // 当前tab
  currentFieldValue: 'new',
  // 当前最新还是最热
  memberInfo: {},
  // 当前用户信息
  topicList: [],
  // 话题列表
  topicPage: 1,
  // 话题当前页
  topicPageSize: 15,
  // 话题每页条数
  topicHasMore: true,
  // 话题是否还有更多
  topicLoading: false,
  // 话题加载中
  selectedTopicIds: [],
  // 选中的话题id
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  recommendHasMore: true,
  // 文章列表是否还有更多
  recommendLoading: false,
  // 文章列表加载中
  isFilterTabSticky: false,
  // 吸顶状态
  topHeight: 0,
  // 顶部高度（px）
  totalLikes: 0
});
function toDetails(e) {
  let item = state.myRecommend[e.currentTarget.dataset.index];
  if ((item.status === 'PENDING' || item.status === 'REJECTED') && state.currentTabValue === 'memberId') {
    NAVPAGE.toRecommendRelease('?id=' + item.id);
  } else {
    NAVPAGE.toRecommendDetails('?id=' + item.id);
  }
}
function changeTabFilter(e) {
  let id = e.currentTarget.dataset.id;
  setFormValue('statuses', ["PENDING", "APPROVED", "REJECTED"]);
  console.log(e, 'eeeeee');
  if (id === 'memberId') {
    // 我的种草
    setFormValue('memberId', app.globalData.userInfo.member.id);
    // this.setFormValue('currentMemberId','')
    // this.setFormValue('currentMemberId', app.globalData.userInfo.member.id)
    setFormValue('subscribe', false);
    setFormValue('recommendLike', false);
    state.currentTabValue = id;
  } else if (id === 'currentMemberId') {
    // 我的喜欢
    // this.setFormValue('currentMemberId', app.globalData.userInfo.member.id)
    setFormValue('recommendLike', true);
    setFormValue('memberId', '');
    setFormValue('subscribe', false);
    state.currentTabValue = id;
  } else if (id === 'subscribe') {
    // 我的关注
    // this.setFormValue('currentMemberId', app.globalData.userInfo.member.id)
    setFormValue('subscribe', true);
    setFormValue('memberId', '');
    setFormValue('recommendLike', false);
    setFormValue('statuses', ["APPROVED"]);
    state.currentTabValue = id;
  } else if (id === 'new') {
    // 最新文章
    if (state.currentTabValue === 'subscribe') {
      setFormValue('statuses', ["APPROVED"]);
    }
    // this.setFormValue('currentMemberId', app.globalData.userInfo.member.id)
    setFormValue('orderField', 'create_time');
    state.currentFieldValue = id;
  } else if (id === 'hot') {
    //最热
    // this.setFormValue('currentMemberId', app.globalData.userInfo.member.id)
    if (state.currentTabValue === 'subscribe') {
      setFormValue('statuses', ["APPROVED"]);
    }
    setFormValue('orderField', 'number_likes');
    state.currentFieldValue = id;
  }
  getMyRecommend(true);
  // this.setFormValue()
}
function handleTopicTap(e) {
  const id = e.currentTarget.dataset.id;
  let selected = state.selectedTopicIds.slice();
  const idx = selected.indexOf(id);
  if (idx > -1) {
    selected.splice(idx, 1);
  } else {
    selected.push(id);
  }
  state.selectedTopicIds = selected;
}
function getMyRecommend(raload = false, topicIds = null) {
  uni.showLoading({});
  let that = this;
  if (raload) {
    setFormValue('page', 1);
    state.myRecommend = [];
    state.recommendHasMore = true;
    state.recommendLoading = false;
  }
  let params = Object.assign({}, state.filterVo);
  if (topicIds && topicIds.length > 0) {
    params.topicIds = topicIds;
  } else if (state.selectedTopicIds && state.selectedTopicIds.length > 0) {
    params.topicIds = state.selectedTopicIds;
  }
  if (state.memberInfo && state.memberInfo.id) {
    params.currentMemberId = state.memberInfo.id;
  }
  recommendService.query(params).then(res => {
    let recommendArr = state.myRecommend;
    let hasMore = true;
    const list = res && res.records ? res.records : [];
    if (list.length > 0) {
      list.forEach(val => {
        recommendArr.push({
          ...val
        });
      });
      hasMore = list.length === state.filterVo.pageSize;
    } else {
      hasMore = false;
    }
    state.myRecommend = recommendArr;
    state.recommendHasMore = hasMore;
    uni.hideLoading();
  }).catch(err => {
    uni.hideLoading();
  });
}
function topicQuery(isLoadMore = false) {
  let that = this;
  if (state.topicLoading || !state.topicHasMore) return;
  state.topicLoading = true;
  let page = isLoadMore ? state.topicPage : 1;
  let postData = {
    page: page,
    pageSize: state.topicPageSize,
    statuses: ['ENABLED']
  };
  recommendService.topicQuery(postData).then(res => {
    let topicArr = isLoadMore ? state.topicList : [];
    let hasMore = true;
    if (res.records && res.records.length > 0) {
      topicArr = topicArr.concat(res.records);
      hasMore = res.records.length === state.topicPageSize;
    } else {
      hasMore = false;
    }
    state.topicList = topicArr;
    state.topicPage = hasMore ? page + 1 : page;
    state.topicHasMore = hasMore;
    state.topicLoading = false;
  }).catch(() => {
    state.topicLoading = false;
  });
}
function totalLikes() {
  recommendService.totalLikes(state.memberInfo.id).then(res => {
    state.totalLikes = res;
  });
}
function articleCount() {
  recommendService.articleCount(state.memberInfo.id).then(res => {
    state.articleCount = res;
  });
}
onLoad(function (options) {
  state.memberInfo = app.globalData.userInfo.member;
  state.themeColor = app.globalData.uiconfig.themeColor;
  console.log(options.topicId);
  setFormValue('memberId', state.memberInfo.id);
  getMyRecommend(); // 获取我的文章
  topicQuery(); // 获取话题
  totalLikes(); // 获取总获赞数
  articleCount(); // 获取总种草数
  // 动态计算顶部高度
  const menuButton = uni.getMenuButtonBoundingClientRect();
  uni.getSystemInfo({
    success: res => {
      // 状态栏高度 + 导航栏高度 + 头部内容高度（如有自定义再加）
      const statusBarHeight = res.statusBarHeight;
      const navBarHeight = menuButton.top - res.statusBarHeight + menuButton.height + (menuButton.top - res.statusBarHeight);
      // 你可以根据实际页面头部内容高度微调
      const customHeaderHeight = 520; // rpx，需与wxml头部内容高度一致
      // rpx转px
      const windowWidth = res.windowWidth;
      const pxPerRpx = windowWidth / 750;
      const topHeight = statusBarHeight + navBarHeight + customHeaderHeight * pxPerRpx;
      state.topHeight = topHeight;
    }
  });
});
function setFormValue(name, value) {
  console.log(`filterVo.${name}`, 'filterVo.${name}');
  if (!name) {
    return;
  }
  state[`filterVo.${name}`] = value;
}
onReady(function () {});
onShow(function (e) {});
function toSquaer() {
  NAVPAGE.toRecommendSquare();
}
function toRelease() {
  NAVPAGE.toRecommendRelease();
}
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {
  // 判断是否还有更多，防止重复加载
  if (state.recommendLoading || !state.recommendHasMore) return;
  state.recommendLoading = true;
  let page = state.filterVo.page + 1;
  let params = Object.assign({}, state.filterVo, {
    page
  });
  if (state.selectedTopicIds && state.selectedTopicIds.length > 0) {
    params.topicIds = state.selectedTopicIds;
  }
  recommendService.query(params).then(res => {
    let recommendArr = state.myRecommend;
    let hasMore = true;
    if (res.records && res.records.length > 0) {
      recommendArr = recommendArr.concat(res.records);
      hasMore = res.records.length === state.filterVo.pageSize;
    } else {
      hasMore = false;
    }
    state.myRecommend = recommendArr;
    state.filterVo.page = page;
    state.recommendHasMore = hasMore;
    state.recommendLoading = false;
  }).catch(() => {
    state.recommendLoading = false;
  });
});
onShareAppMessage(function () {});
function handleScrollTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  });
}
onPageScroll(function (e) {
  // 获取filter-tab-list距离顶部的距离
  if (filterTabTop === undefined) {
    const query = uni.createSelectorQuery().in(this);
    query.select('#filterTabList').boundingClientRect(rect => {
      filterTabTop = rect ? rect.top : 0;
    }).exec();
  }
  // 触发吸顶
  if (filterTabTop !== undefined) {
    if (e.scrollTop >= filterTabTop) {
      if (!state.isFilterTabSticky) {
        state.isFilterTabSticky = true;
      }
    } else {
      if (state.isFilterTabSticky) {
        state.isFilterTabSticky = false;
      }
    }
  }
  if (e.scrollTop >= app.globalData.systemInfo.screenHeight / 2 && !state.showScrollTop) {
    state.showScrollTop = true;
    state.isSearchFixed = true;
  } else if (e.scrollTop < app.globalData.systemInfo.screenHeight / 2 && state.showScrollTop) {
    state.showScrollTop = false;
    state.isSearchFixed = false;
  }
});
function handleLike(e) {
  uni.showLoading({});
  const index = e.currentTarget.dataset.index;
  const item = state.myRecommend[index];
  const id = item.id;
  let postData = {
    id,
    isLike: !item.isLiked,
    memberId: state.memberInfo.id
  };
  recommendService.like(postData).then(() => {
    const isLiked = !item.isLiked;
    const key = `myRecommend[${index}].isLiked`;
    const numKey = `myRecommend[${index}].numberLikes`;
    // this.setFormValue('recommendLike', true)
    // this.getMyRecommend(true);
    state.key = isLiked;
    state.numKey = isLiked ? item.numberLikes + 1 : item.numberLikes - 1;
    uni.hideLoading();
  }).catch(err => {
    uni.hideLoading();
  });
}
</script>
<style scoped>
/* pages/mallModule/recommend/my/my.wxss */

page{
  background-color: #f2f2f2;
}
.fixed-top {
    width: 100%;
    position: sticky;
    z-index: 100;
}

.banner-box {
  width: 100%;
}

.slide-image {
  width: 100%;
}

.swiper {
  height: 400rpx;
}

.filter-tab-list {
  position: relative;
  width: 100%;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 10; */
  background-color: #fff;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  margin-top: -33rpx;
  z-index: 2;
}

.filter-tab-item {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  padding: 0 20rpx;
  position: relative;
}

.filter-tab-list .filter-tab-item:nth-of-type(2) {
  border-left: 1px solid #E2E2E2;
}

.filter-tab-item image {
  position: absolute;
  left: 50%;
  bottom: -19rpx;
  width: 24rpx;
  height: 13rpx;
  transform: translateX(-50%);
}

.filter-my {
  position: absolute;
  right: 22rpx;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
}

.filter-my image {
  width: 25rpx;
  margin-right: 12rpx;
}

.topic-list {
  position: relative;
  z-index: 2;
  padding: 23rpx 0 21rpx 20rpx;
  /* border-bottom: 1px solid #F3F3F3; */
  background-color: #f2f2f2;
  margin-top: -1px;
}

.topic-list .topic-item {
  display: inline-block;
  padding: 10rpx 18rpx;
  border-radius: 10rpx;
  border: 1px solid #E2E2E2;
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  background: #FFFFFF;
  margin-right: 14rpx;
}

.topic-item {
  display: inline-block;
  padding: 10rpx 30rpx;
  margin-right: 16rpx;
  background: #f5f5f5;
  border-radius: 32rpx;
  color: #333;
  font-size: 26rpx;
  transition: all 0.2s;
}

.topic-item-active {
  background: #1c1c1b;
  color: #fff;
}

.essay-list {
  width: 100%;
  padding: 0 20rpx 60rpx;
  box-sizing: border-box;
  /* display: flex;
  justify-content: space-between;
  flex-wrap: wrap; */
  columns: 2;
  column-gap: 20rpx;
  background-color: #f2f2f2;
  position: relative;
  z-index: 2;
  margin-top: -1px;
}

.essay-item {
  position: relative;
  width: 345rpx;
  border-radius: 10rpx;
  overflow: hidden;
  break-inside: avoid;
  margin-bottom: 20rpx;
}
.essay-item-statu { 
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 9rpx;
  border-radius: 0 10rpx 0rpx 10rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: #FFFFFF;
  background-color: #F41C0C;
  z-index: 2;
}

.pending {
  background-color: #FC6700;
}


.essay-pic {
  width: 100%;
}
.essay-pic video {
    width: 100%;
    display: block;
  }
.essay-pic image {
  width: 100%;
  display: block;
}

.essay-title {
  font-weight: 400;
  font-size: 26rpx;
  color: #333333;
  width: 100%;
  padding: 0 16rpx;
  box-sizing: border-box;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding-top: 19rpx;
  background-color: #fff;
}

.essay-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22rpx 16rpx 18rpx 16rpx;
  box-sizing: border-box;
  background-color: #fff;
}

.essay-info-lt,
.essay-info-rt {
  display: flex;
  align-items: center;
}

.essay-info-rt {
  height: 48rpx;
  padding-left: 20rpx;
}


.essay-info-lt-avatar {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-right: 11rpx;
}

.essay-info-lt-name {
  font-weight: 400;
  font-size: 20rpx;
  color: #999999;
}

.essay-info-rt-like {
  width: 28rpx;
  height: 24rpx;
  margin-right: 11rpx;
}

.essay-info-lt-num {
  font-weight: 400;
  font-size: 22rpx;
  color: #999999;
}

.scroll-top {
  width: 92rpx;
  height: 92rpx;
  position: fixed;
  right: 20rpx;
  bottom: 20%;
  z-index: 6;
}

.recommend-release {
  position: fixed;
  left: 50%;
  bottom: 6rpx;
  width: 132rpx;
  z-index: 6;
  transform: translateX(-50%);
}

.my-title-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  display: block;
  z-index: 1;
}

.my-info-box {
  /* height: 401rpx; */
  position: relative;
  background-color: transparent;
  z-index: 2;
}

.my-info-top {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

.my-info-top-avatar {
  width: 79rpx;
  height: 80rpx;
  /* background: #F3F3F3; */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 16rpx 0 30rpx;
}

.my-info-top-avatar image {
  width: 100%;
  border-radius: 50%;
}

.my-info-top-rt-name {
  font-weight: 600;
  font-size: 30rpx;
  color: #FFFFFF;
}

.my-info-top-rt-like {
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 24rpx;
  color: #FFFFFF;
  margin-top: 8rpx;
}

.my-info-top-rt-like image {
  width: 15rpx;
  margin-right: 14rpx;
}

.my-info-top-line {
  width: 2rpx;
  height: 20rpx;
  background-color: #fff;
  margin: 0 10rpx;
}

.my-info-tab {
  width: 100%;
  margin-top: 66rpx;
  margin-bottom: 64rpx;
  display: flex;
  justify-content: space-around;
}

.my-info-tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 400;
  font-size: 28rpx;
  color: #fff;
  /* justify-content: space-between; */
}

.my-info-tab-item image {
  width: 57rpx;
  height: 57rpx;
  margin-bottom: 10rpx;
}
/* 
.my-info-tab .my-info-tab-item:nth-of-type(1) image {
  width: 57rpx;
}

.my-info-tab .my-info-tab-item:nth-of-type(2) image {
  width: 55rpx;
  margin-top: 12rpx;
}

.my-info-tab .my-info-tab-item:nth-of-type(3) image {
  width: 52rpx;
} */

/* .filter-tab-sticky {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 100;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.my-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.essay-list-scroll {
  flex: 1;
  min-height: 0;
} */

.no-data {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 880rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f2f2f2;
  /* justify-content: center; */
}

.no-data image {
  width: 198rpx;
  margin-top: 90rpx;
}

.no-data-tips {
  font-weight: 400;
  font-size: 28rpx;
  color: #999999;
  line-height: 42rpx;
  margin-top: 21rpx;
}

.no-data-btn {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  color: #fff;
  text-align: center;
  border-radius: 90rpx;
  margin-top: 36rpx;
}
</style>