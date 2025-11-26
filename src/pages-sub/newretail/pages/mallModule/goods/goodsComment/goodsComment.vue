<template>
<!--pages/mallModule/goods/goodsComment/goodsComment.wxml-->

<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
  <view v-for="(item , index) in state.commentList" :key="idx">
    <!--<template is="commentItem" :data="item, state.imagesPath"></template>-->
  </view>
</view>
<button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
<view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view>
<view class="no-data" :hidden="state.commentList.length > 0">
  <image :src="state.imagesPath.imgNoData"></image>
</view>
</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiCommentServiceJs from "@/service/api/newretail/commentService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/goods/goodsComment/goodsComment.js
const commentService = _apiCommentServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const selfA = _utilsSelfJs;
//获取应用实例
const state = reactive({
  navigationBarTitle: "全部评价",
  imagesPath: IMGAGESPATH,
  commentList: [],
  page: 1,
  mobile: '',
  pageSize: 10,
  pageCount: 1,
  noMore: false,
  loading: false,
  allMyComment: false,
  productId: '',
  memberId: ''
});
onLoad(function (options) {
  uni.hideShareMenu();
  if (options.form) {
    state.allMyComment = true;
    if (app.globalData.userInfo.member) {
      if (app.globalData.userInfo.member) {
        state.memberId = app.globalData.userInfo.member.id;
        getProductsComment(state.page);
      } else {
        uni.showToast({
          title: "您还不是会员，请绑定手机号成为会员~",
          icon: 'none'
        });
      }
    } else {
      uni.showToast({
        title: "您还没有登陆，请点击头像授权登陆哦~",
        icon: 'none'
      });
    }
  } else {
    state.productId = options ? options.productId : '';
    getProductsComment(state.page);
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
  state.commentList = [];
  state.mobile = '';
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  onLoad(options);
  uni.stopPullDownRefresh();
});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    let page = state.page;
    ++page;
    getProductsComment(page);
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.commentList.length > 0) {
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
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
});
function getProductsComment(page) {
  const self = this;
  let postData = {
    page: page,
    pageSize: 10,
    //   status: 'NORMAL',
    searchCount: true,
    includeSiblings: true,
    memberId: app.globalData.userInfo.member.id
  };
  if (state.allMyComment) {
    postData = {
      ...postData,
      memberId: state.memberId
    };
  } else {
    postData = {
      ...postData,
      productId: state.productId
    };
  }
  if (!postData.productId) {
    delete postData.productId;
  }
  commentService.query(postData).then(res => {
    let tempList = state.commentList;
    if (res.records && res.records.length > 0) {
      res.records.forEach(item => {
        let tempItem = {
          ...item,
          mobile: hideTel(item.mobile),
          avatar: item.avatar ? item.avatar : state.imagesPath.userPortrait
        };
        if (item.createTime) {
          // let timeArr = item.createTime.split(' ')
          // let dayArr = timeArr['0'].split('-')
          // let time = dayArr[0] + '年' + dayArr[1] + '月'
          tempItem = {
            ...tempItem,
            time: item.createTime.split(' ')[0]
          };
        }
        tempList.push(tempItem);
      });
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;

      // tempList.forEach((item, index) => {
      //     item.pictures.forEach(item1 => {
      //         selfA.getTemporaryUrl(item1.url)
      //             .then(res => {
      //                 item1.url = res;
      //                 if (index >= tempList.length - 1) {
      //                     self.setData({
      //                         commentList: tempList
      //                     })
      //                 }
      //             })
      //     })
      // })
      state.page = res.page;
      state.pageCount = pageCount;
      state.commentList = tempList;
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
function hideTel(tel) {
  let reg = /^(\d{3})\d{4}(\d{4})$/;
  tel = tel.replace(reg, "$1****$2");
  return tel;
}
function previewImage(val) {
  let commentId = val.currentTarget.dataset.commentid;
  let urlIndex = val.currentTarget.dataset.urlid;
  let commentList = state.commentList;
  let urlList = [];
  commentList.forEach(item => {
    if (item.id === commentId) {
      item.pictures.forEach(ele => {
        urlList.push(ele.url);
      });
    }
  });
  uni.previewImage({
    current: urlList[urlIndex],
    // 当前显示图片的http链接
    urls: urlList // 需要预览的图片http链接列表
  });
}
</script>
<style scoped>
/* pages/mallModule/goods/goodsComment/goodsComment.wxss */
/* @import "/pages-sub/newretail/pages/mallModule/template/commentItem.wxss"; */

.content {
  padding: 0 40rpx;
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

.no-data image {
  margin-top: 30%;
  width: 242rpx;
  height: 261rpx;
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #fff;
  border-radius: 0;
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