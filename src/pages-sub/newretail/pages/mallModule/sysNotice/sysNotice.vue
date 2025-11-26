<template>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="topBg">
  <image :src="state.imagesPath.iconNoticeBg"></image>
</view>
<view class="notice-box">
  <view v-for="(item , index) in state.noticeList" :key="key" class="notice-item" @click="jumptoDetail" :data-notice-item="item">
    <view class="notice-type">
      公告
    </view>
    <view class="notice-content">
      <view class="notice-title">
        {{item.title}}
      </view>
      <view class="notice-time">
        {{item.createTime}}
      </view>
      <view class="notice-desc" v-if="item.type === 'TEXT'">
        {{item.description}}
      </view>
      <image class="notice-desc" mode="widthFix" :src="item.imageUrl" v-if="item.type === 'IMAGE'"></image>
    </view>
  </view>
  <view style="color: #666; font-size: 24rpx; text-align: center;" v-if="state.noMoreData">我也是有底线的~</view>
</view>
</template>
<script setup>
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiBannerServiceJs from "@/service/api/newretail/bannerService";
// import { onPullDownRefresh, onReachBottom, onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

const bannerService = _apiBannerServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const NAVPAGE = _utilsNavPageJs;
//获取应用实例
const state = reactive({
  navigationBarTitle: "系统公告",
  imagesPath: IMGAGESPATH,
  loading: true,
  noticeList: [],
  page: 1,
  //当前页数
  pageSize: 10,
  //每页条数
  pageCount: 1,
  //总页数
  noMoreData: false
});
function getNotice(page, loadType) {
  loadType = loadType || '';
  console.log('执行获取公告信息接口');
  bannerService.getNoticeList({
    page: page,
    pageSize: state.pageSize
  }).then(res => {
    for (let i = 0; i < res.records.length; i++) {
      state.noticeList.push(res.records[i]);
    }
    state.noticeList = loadType == 'pullUp' ? state.noticeList : res.records;
    state.pageCount = res.pageCount;
  }).catch(err => {
    console.log('查询公告失败');
    console.log(err);
  });
}
onPullDownRefresh(function () {
  getNotice(1);
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {
  if (state.pageCount == state.page) {
    state.noMoreData = true;
    return;
  } else {
    state.page = state.page + 1;
    setTimeout(() => {
      getNotice(state.page, 'pullUp');
    }, 500);
  }
});
function jumptoDetail(event) {
  console.log(event);
  NAVPAGE.toAdPage(event.currentTarget.dataset.noticeItem, 'banner');
}
onLoad(function () {
  getNotice(state.page);
});
</script>
<style scoped>
page{
  background: rgba(249, 249, 249 ,1);
}
.topBg{
  width: 100%;
  height: 303rpx;
  background:#FFA300;
  position: relative;
}
.topBg image{
  width: 285rpx;
  height: 193rpx;
  position: absolute;
  top: 55rpx;
  right: 0;
}
.notice-box{
  padding: 30rpx 30rpx;
  position: relative;
  top: -160rpx;
}
.notice-item{
  /* height: 242rpx; */
  box-shadow:0px 3px 8px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  margin-bottom: 26rpx;
  display: flex;
  padding: 38rpx 28rpx;
  background: #fff;
  font-size: 24rpx;
}
.notice-item .notice-type{
  width: 70rpx;
  margin-right: 29rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #1c1c1c;
}
.notice-item .notice-content{
  flex: 1;
  width: 84%;
  display: flex;
  flex-direction: column;
}
.notice-content view{
  /* display: inline-block; */
}
.notice-content .notice-title{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #1c1c1c;
}
.notice-content .notice-time{
  height: 40rpx;
  line-height: 40rpx;
  color: #999;
  font-size: 24rpx;
  margin-bottom: 20rpx;
}
.notice-content .notice-desc{
  width: 500rpx;
  /* display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; */
  overflow: hidden;
  color: #666;
  font-size: 24rpx;
  line-height: 40rpx;
  letter-spacing: 4rpx;
}
</style>