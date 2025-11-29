<template>
<!--pages/mallModule/recommend/release/release.wxml-->
<view>
<navigationBar title="种草发布"></navigationBar>
<view class="recommend-release-page">
  <view class="upload-box">
    <scroll-view type="list" scroll-x="" style="display:flex;white-space: nowrap;width: 100%;height: 160rpx;">
      <view class="upload-images-box" @click="chooseImage">
        <image :src="state.imagesPath.upload_images_icon" class="submit-img"></image>
      </view>
      <view class="item-images-box" v-for="(item , idx) in state.formData.imgUrlList" :key="unique">
        <view v-if="isMp4(item)" class="item-images" :data-src="item" :data-index="idx" @click="reviewImg">
            <video id="myVideo" class="myVideo" :src="item" :controls="false" :show-center-play-btn="false" :show-play-btn="false" :show-mute-btn="false" :picture-in-picture-mode="['push', 'pop']"></video>
        </view>
        <view v-else class="item-images" :data-src="item" :data-index="idx" @click="reviewImg">
            <image :src="item" mode="aspectFill"></image>
        </view>
        <view class="delete-icon" :data-index="idx" @click="removeImg">
            <image :src="state.imagesPath.delete_goods_icon" class="submit-img"></image>
        </view>
      </view>
    </scroll-view>
  </view>
  <view class="add-title">
    <input type="text" placeholder="*添加标题" :value="state.formData.title" @input="bindTitleInput">
  </view>
  <view class="add-content">
    <textarea :value="state.formData.content" placeholder="添加正文" auto-height="" @input="bindContentInput" :maxlength="-1">
    <view class="add-content-topic">
      <text v-for="(item , index) in state.confimTopicList" :data-index="index">#{{item.name}}</text>
    </view>
  </textarea></view>
  <view class="add-topic">
    <view class="add-topic-left">添加话题</view>
    <view class="add-topic-right" @click="daOpenTopicPopup">
      <image :src="state.imagesPath.add_topic_icon" mode=""></image>
      <text>去选择</text>
    </view>
  </view>
  <view class="topic-list">
    <scroll-view type="list" scroll-x="" style="display:flex;white-space: nowrap;width: 100%;">
      <view class="topic-item" v-for="(item , index) in state.confimTopicList" :data-index="index">
        #{{item.name}}
      </view>
    </scroll-view>
  </view>
  <view class="add-topic">
    <view class="add-topic-left">种草商品</view>
    <view class="add-topic-right" @click="daOpenGoodsPopup">
      <image :src="state.imagesPath.add_topic_icon" mode=""></image>
      <text>去选择</text>
    </view>
  </view>
  <view class="add-goods-list">
    <view class="add-goods-item" v-for="(item , index) in state.confimProductList" :data-index="index">
      <view class="add-goods-item-lt">
        <image :src="item.imageUrl" mode=""></image>
      </view>
      <view class="add-goods-item-rt">
        <view class="add-goods-item-rt-title">{{item.name}}</view>
        <!-- <view class="add-goods-item-rt-pic">￥299.00</view> -->
      </view>
      <view class="delete-goods-item">
        <image @click="removeProduct" :src="state.imagesPath.delete_goods_icon" :data-index="index" mode=""></image>
      </view>
    </view>
  </view>
  <view class="line"></view>
  <view class="approve-box" v-if="state.formData.approveRecordList && state.formData.approveRecordList.length > 0">
    <view class="approve-box-title">审核建议</view>
    <view class="approve-item" v-for="(item , index) in state.formData.approveRecordList">
      <view class="approve-content">{{item.content}}</view>
      <view class="approve-time">{{filterTime(item.createTime)}}</view>
    </view>
  </view>
  <view :class="'save-btn-box ' + (state.formData.status === 'PENDING' || state.formData.status === 'REJECTED' ? 'two-btn-box' : '')">
    <view v-if="state.formData.status === 'PENDING' || state.formData.status === 'REJECTED'" class="delete-btn" @click="doRemove">
        <image :src="state.imagesPath.remove_icon" mode="widthFix"></image>
    </view>
    <view class="save-btn" @click="doSave">去发布</view>
  </view>
  <popup :show="state.topicPopup" position="bottom" custom-class="bottom" @close="toggleTopiclPopup">
    <view class="topic-popup">
      <view class="popup-close-box" @click="toggleTopiclPopup">
        <image :src="state.imagesPath.category_close" mode="widthFix"></image>
      </view>
      <view class="popup-title">选择话题</view>
      <checkbox-group @change="onTopicCheckboxChange">
        <scroll-view scroll-y="" style="max-height: 730rpx;" @scrolltolower="onTopicReachBottom">
          <view class="topic-popup-list">
            <view class="topic-popup-item" v-for="(item , index) in state.topicList" :key="id">
              <view class="topic-popup-item-title">#{{item.name}}</view>
              <view class="topic-popup-item-check">
                <checkbox :value="item.id" :checked="item.checked">
              </checkbox></view>
            </view>
            <!-- <view wx:if="{{state.topicLoading}}" class="topic-popup-item">加载中...</view>
            <view wx:if="{{!state.topicHasMore && state.topicList.length > 0}}" class="topic-popup-item">没有更多了</view> -->
          </view>
        </scroll-view>
      </checkbox-group>
      <view class="popup-btn-box" @click="confirmTopic">
        <view class="popup-btn">确定</view>
      </view>
      <view class="zone-box"></view>
    </view>
  </popup>
  <popup :show="state.goodsPopup" position="bottom" custom-class="bottom" @close="toggleGoodsPopup">
    <view class="topic-popup goods-popup">
      <view class="popup-close-box" @click="toggleGoodsPopup">
        <image :src="state.imagesPath.category_close" mode="widthFix"></image>
      </view>
      <view class="popup-title">选择商品</view>
      <view class="active-type">
        <view class="active-type-item" :style="'color: ' + (state.productTabVlue === 'all' ? state.themeColor : '') + ';'" @click="changeProductTab" data-id="all">
          全部商品({{state.productTotalCount}})
          <view class="active-line" v-if="state.productTabVlue === 'all'" :style="'background-color: ' + state.themeColor + ';'"></view>
        </view>
        <view class="active-type-item" :style="'color: ' + (state.productTabVlue === 'my' ? state.themeColor : '') + ';'" @click="changeProductTab" data-id="my">
          我买过的({{state.myGoodsNum}})
          <view class="active-line" :style="'background-color: ' + state.themeColor + ';'" v-if="state.productTabVlue === 'my'"></view>
        </view>
      </view>
      <view class="search-box-pop">
        <view>
          <image :src="state.imagesPath.search_release" mode=""></image>
          <input type="text" name="productKeyword" placeholder="请输入关键词搜索..." :value="state.productKeyword" @input="onProductKeywordInput" @confirm="onProductKeywordConfirm" @blur="onProductKeywordBlur">
        </view>
      </view>
      <checkbox-group @change="checkboxChange">
        <scroll-view scroll-y="" style="max-height: 730rpx;" @scrolltolower="onGoodsProductReachBottom" class="topic-popup-list goods-popup-list">
          <!-- <view class="topic-popup-list goods-popup-list"> -->
            <view class="topic-popup-item goods-popup-item" v-for="(item , index) in state.productList" :data-index="index">
              <view class="topic-popup-item-title goods-popup-item-title">
                <view class="popup-item-title-lt">
                  <image v-if="item.imageUrl" :src="item.imageUrl" mode=""></image>
                  <image v-else src="https://newretail-mini.obs.cn-southwest-2.myhuaweicloud.com/obs.cn-southwest-2.myhuaweicloud.com/20250724/1948191484465401858/ee7a238aa82dd3d0c2f1e07d42f4bd5.png" mode=""></image>
                </view>
                <view class="popup-item-title-rt">
                  <view>{{item.name}}</view>
                  <view></view>
                </view>
              </view>
              <view class="topic-popup-item-check">
                <checkbox :value="item.id" :checked="item.checked">
              </checkbox></view>
            </view>
            <!-- <view wx:if="{{state.productLoading}}" class="topic-popup-item">加载中...</view>
            <view wx:if="{{!state.productHasMore && state.productList.length > 0}}" class="topic-popup-item">没有更多了</view> -->
          <!-- </view> -->
        </scroll-view>
      </checkbox-group>
      <view class="popup-btn-box" @click="confirmProduct">
        <view class="popup-btn">确定</view>
      </view>
      <view class="zone-box"></view>
    </view>
  </popup>
</view></view>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _apiRecommendServiceJs from "@/service/api/newretail/recommendService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiRequestJs from "@/service/api/newretail/request";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/mallModule/recommend/release/release.js
const IMGAGESPATH = _utilsImagesPathJs;
const request = _apiRequestJs;
const productService = _apiProductServiceJs;
const recommendService = _apiRecommendServiceJs;
const themeManager = _utilsThemeManagerJs;
const state = reactive({
  detailsId: "",
  avatarUrl: null,
  imageUrls: [],
  imagesPath: IMGAGESPATH,
  count: 9,
  topicPopup: false,
  goodsPopup: false,
  formData: {
    title: '',
    content: '',
    imgUrlList: '',
    productIds: [],
    topicIds: []
  },
  // 话题相关
  topicList: [],
  topicPage: 1,
  topicPageSize: 9,
  topicHasMore: true,
  topicLoading: false,
  selectedTopicIds: [],
  // 商品相关
  productList: [],
  productPage: 1,
  productPageSize: 15,
  productTotalCount: 0,
  productLoading: false,
  productHasMore: true,
  selectiveProduct: [],
  confimProductList: [],
  // 商品弹窗-话题分页数据
  goodsTopicList: [],
  goodsTopicPage: 1,
  goodsTopicPageSize: 9,
  goodsTopicHasMore: true,
  goodsTopicLoading: false,
  selectedGoodsTopicIds: [],
  confimTopicList: [],
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  productTabVlue: 'all',
  memberInfo: {},
  // 当前用户信息
  productKeyword: '',
  // 商品搜索关键词
  myGoodsNum: 0 // 我买过的商品数量
});
function onProductKeywordInput(e) {
  state.productKeyword = e.detail.value;
}
function onProductKeywordConfirm(e) {
  console.log('onProductKeywordConfirm', e.detail.value);
  state.productKeyword = e.detail.value;
  queryProduct(true, e.detail.value);
}
function onProductKeywordBlur(e) {
  state.productKeyword = e.detail.value;
  queryProduct(true, e.detail.value); // 失焦也触发查询，重置分页
}
function onGoodsProductReachBottom() {
  if (state.productTabVlue === 'all') {
    queryProduct(false);
  }
}
function changeProductTab(e) {
  console.log(e);
  state.productTabVlue = e.currentTarget.dataset.id;
  queryProduct(true);
}
function onTopicItemTap(e) {
  const id = e.currentTarget.dataset.id;
  let selected = state.selectedTopicIds.slice();
  const idx = selected.indexOf(id);
  if (idx > -1) {
    selected.splice(idx, 1);
  } else {
    selected.push(id);
  }
  // 更新checked状态
  let topicList = state.topicList.map(item => {
    item.checked = selected.indexOf(item.id) > -1;
    return item;
  });
  state.selectedTopicIds = selected;
  state.topicList = topicList;
}
function daOpenTopicPopup() {
  state.topicPopup = true;
  topicQuery(true);
}
function toggleTopiclPopup() {
  state.topicPopup = false;
}
function topicQuery(reload = false) {
  let that = this;
  if (state.topicLoading) return;
  if (!reload && !state.topicHasMore) return;
  state.topicLoading = true;
  let page = reload ? 1 : state.topicPage;
  let postData = {
    page: page,
    pageSize: state.topicPageSize,
    statuses: ['ENABLED']
  };
  recommendService.topicQuery(postData).then(res => {
    let topicArr = reload ? [] : state.topicList;
    let hasMore = true;
    if (res.records && res.records.length > 0) {
      // 为每个话题加checked字段
      res.records.forEach(val => {
        val.checked = state.confimTopicList.filter(item => item.id === val.id).length > 0;
      });
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
function onTopicReachBottom() {
  topicQuery(false);
}
function onTopicCheckboxChange(e) {
  // e.detail.value为选中的id数组
  let selected = e.detail.value;
  // 更新checked状态
  let topicList = state.topicList.map(item => {
    item.checked = selected.indexOf(item.id) > -1;
    return item;
  });
  state.selectedTopicIds = selected;
  state.topicList = topicList;
}
function confirmTopic() {
  console.log(state.selectedTopicIds, 'this.data.selectedTopicIds');
  let that = this;
  state.confimTopicList = [];
  let addArr = [];
  state.selectedTopicIds.forEach(val => {
    addArr.push(state.topicList.filter(item => val === item.id)[0]);
  });
  state.confimTopicList = addArr;
  state.formData.topicIds = state.selectedTopicIds;
  state.topicPopup = false;
}
function bindTitleInput(e) {
  setFormValue('title', e.detail.value);
}
function bindContentInput(e) {
  setFormValue('content', e.detail.value);
}
function setFormValue(name, value) {
  console.log(`formData.${name}`, 'formData.${name}');
  state[`formData.${name}`] = value;
}
function recommendDetails() {
  let that = this;
  let postData = {
    id: state.detailsId,
    parts: 'topic,product,approve'
  };
  recommendService.recommendDetails(postData).then(res => {
    if (res) {
      state.formData = res;
      state.confimTopicList = res.topics;
      state.confimProductList = res.productList;
    }
  });
}
onLoad(function (options) {
  if (options && options.id) {
    state.detailsId = options.id;
    recommendDetails();
  }
  state.memberInfo = app.globalData.userInfo.member;
  state.themeColor = app.globalData.uiconfig.themeColor;
  topicQuery(true);
  getMyGoods('');
});
onReady(function () {});
onShow(function () {});
function daOpenGoodsPopup() {
  state.goodsPopup = true;
  queryProduct(true);
  // this.queryGoodsTopic(true)
}
function checkboxChange(e) {
  let that = this;
  console.log(e, 'eeee');
  // let addArr = []
  // e.detail.value.forEach(val => {
  //   that.data.productList.filter(item => val === item.id)
  // })
  state.selectiveProduct = e.detail.value;
}
function confirmProduct() {
  let that = this;
  state.confimProductList = [];
  let addArr = [];
  state.selectiveProduct.forEach(val => {
    addArr.push(state.productList.filter(item => val === item.id)[0]);
  });
  state.confimProductList = addArr;
  state.goodsPopup = false;
}
function removeProduct(e) {
  let copyArr = state.confimProductList;
  copyArr.splice(e.currentTarget.dataset.index, 1);
  state.confimProductList = copyArr;
}
function doSave() {
  if (!state.formData.imgUrlList || state.formData.imgUrlList.length < 1) {
    return uni.showToast({
      title: "请先上传文章图片~",
      icon: 'none',
      duration: 2000
    });
  } else if (!state.formData.title.trim()) {
    return uni.showToast({
      title: "请输入文章标题~",
      icon: 'none',
      duration: 2000
    });
  } else if (!state.formData.content.trim()) {
    return uni.showToast({
      title: "请输入文章内容~",
      icon: 'none',
      duration: 2000
    });
  }
  if (state.confimProductList && state.confimProductList.length > 0) {
    let formProduct = state.confimProductList.map(item => item.id);
    // console.log(formProduct,'formProductformProduct');
    setFormValue('productIds', formProduct);
  }
  if (state.confimTopicList && state.confimTopicList.length > 0) {
    let topicIds = state.confimTopicList.map(item => item.id);
    // console.log(formProduct,'formProductformProduct');
    setFormValue('topicIds', topicIds);
  }
  // return
  // var apiName = 'create'
  // if (this.data.detailsId) {
  //   apiName - 'updata'
  // }
  if (state.detailsId) {
    recommendService.updata(state.formData).then(res => {
      uni.showToast({
        title: "发布成功~",
        icon: 'none',
        duration: 2000
      });
      uni.redirectTo({
        url: '/pages-sub/newretail/pages/mallModule/recommend/my/my'
      });
    }).catch(error => {
      uni.showToast({
        title: error.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {
    recommendService.create(state.formData).then(res => {
      uni.showToast({
        title: "发布成功~",
        icon: 'none',
        duration: 2000
      });
      uni.redirectTo({
        url: '/pages-sub/newretail/pages/mallModule/recommend/my/my'
      });
    });
  }
}
function doRemove() {
  let that = this;
  uni.showModal({
    title: '提示',
    content: '确认要删除该文章？',
    success: function (res) {
      if (res.confirm) {
        recommendService.remove(state.detailsId).then(res => {
          uni.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000
          });
          uni.navigateBack();
        }).catch(err => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      } else if (res.cancel) {}
    }
  });
}
function queryProduct(reload = false, keywordLikes = '') {
  // 优先用 data 里的 productKeyword
  if (typeof keywordLikes !== 'string' || keywordLikes === '') {
    keywordLikes = state.productKeyword || '';
  }
  console.log('queryProduct called', reload, keywordLikes);
  let that = this;
  // 只在非 reload 时判断 productHasMore，reload 时始终允许查
  if (state.productLoading) {
    return;
  }
  if (!reload && !state.productHasMore) {
    console.log('queryProduct return: no more data');
    return;
  }
  if (reload) {
    state.productPage = 1;
    state.productList = [];
    state.productHasMore = true;
    state.productLoading = true;
  } else {
    state.productLoading = true;
  }
  let page = reload ? 1 : state.productPage;
  if (state.productTabVlue === 'all') {
    recommendService.queryProduct(keywordLikes, page, state.productPageSize).then(res => {
      console.log('productService.queryProduct 返回', res);
      let productArr = reload ? [] : state.productList;
      state.productTotalCount = res.totalCount;
      let hasMore = true;
      if (res.records && res.records.length > 0) {
        res.records.forEach(val => {
          productArr.push({
            ...val,
            checked: state.confimProductList.filter(item => item.id === val.id).length > 0
          });
        });
        hasMore = res.records.length === state.productPageSize;
        console.log('分页判断 hasMore:', hasMore, 'records.length:', res.records.length, 'pageSize:', state.productPageSize);
      } else {
        hasMore = false;
      }
      state.productList = productArr;
      state.productPage = hasMore ? page + 1 : page;
      state.productHasMore = hasMore;
      state.productLoading = false;
      console.log('分页后 setData', state.productList.length, state.productPage, state.productHasMore);
    }).catch(err => {
      state.productLoading = false;
      console.log('productService.queryProduct error', err);
    });
  } else {
    getMyGoods(keywordLikes);
  }
}
function getMyGoods(keywordLikes) {
  let that = this;
  recommendService.getPurchasedProducts(state.memberInfo.id, keywordLikes).then(res => {
    let productArr = [];
    // if (res.records && res.records.length > 0) {
    //   res.records.forEach(val => {
    //     productArr.push({
    //       ...val,
    //       checked: that.data.confimProductList.filter(item => item.id === val.id).length > 0,
    //     })
    //   })
    // }
    if (res && res.length > 0) {
      res.forEach(val => {
        productArr.push({
          ...val,
          checked: state.confimProductList.filter(item => item.id === val.id).length > 0
        });
      });
    }
    console.log(productArr.length, 'productArr.length');
    state.productList = productArr;
    state.productLoading = false;
    state.myGoodsNum = productArr.length;
    console.log('getPurchasedProducts 返回', res, productArr.length);
  }).catch(err => {
    state.productLoading = false;
    console.log('getPurchasedProducts error', err);
  });
}
function queryGoodsTopic(reload = false) {
  let that = this;
  if (state.goodsTopicLoading || !state.goodsTopicHasMore) return;
  state.goodsTopicLoading = true;
  let page = reload ? 1 : state.goodsTopicPage;
  let postData = {
    page: page,
    pageSize: state.goodsTopicPageSize
  };
  recommendService.topicQuery(postData).then(res => {
    let topicArr = reload ? [] : state.goodsTopicList;
    let hasMore = true;
    if (res.records && res.records.length > 0) {
      // 选中状态处理
      res.records.forEach(val => {
        val.checked = state.selectedGoodsTopicIds.indexOf(val.id) > -1;
      });
      topicArr = topicArr.concat(res.records);
      hasMore = res.records.length === state.goodsTopicPageSize;
    } else {
      hasMore = false;
    }
    state.goodsTopicList = topicArr;
    state.goodsTopicPage = hasMore ? page + 1 : page;
    state.goodsTopicHasMore = hasMore;
    state.goodsTopicLoading = false;
  }).catch(() => {
    state.goodsTopicLoading = false;
  });
}
function onGoodsTopicReachBottom() {
  queryGoodsTopic(false);
}
function onGoodsTopicCheckboxChange(e) {
  let selected = e.detail.value;
  let goodsTopicList = state.goodsTopicList.map(item => {
    item.checked = selected.indexOf(item.id) > -1;
    return item;
  });
  state.selectedGoodsTopicIds = selected;
  state.goodsTopicList = goodsTopicList;
}
function confirmGoodsTopic() {
  // 这里可将选中的话题id同步到formData等
  state.goodsPopup = false;
}
function toggleGoodsPopup() {
  state.goodsPopup = false;
}
function chooseImage() {
  let that = this;
  let count = state.count - state.formData.imgUrlList.length;
  if (count > 0) {
    uni.chooseMedia({
      count: count,
      // 默认9
      mediaType: ['image', 'video'],
      sizeType: ['original', 'compressed'],
      // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log('res', res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFiles;
        //启动上传等待中...  
        uni.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 200000
        });
        let filePaths = state.imageUrls;
        tempFilePaths.forEach((ele, index) => {
          const isLt1MVideo = res.tempFiles[index].size / 1024 / 1024 < 30 && ele.fileType === "video";
          const isLt1MPng = res.tempFiles[index].size < 1024000 && ele.fileType != "video";
          if (isLt1MVideo || isLt1MPng) {
            //图片小于或者等于1M时 可以执行获取图片 视频小于30mb
            uni.uploadFile({
              url: request.BASE_URL + '/newretail/api/dfs/upload',
              //仅为示例，非真实的接口地址
              filePath: ele.tempFilePath,
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
                  filePaths.push(tempData.data.url);
                  // that.setData({
                  //   //将临时变量赋值给已经在data中定义好的变量
                  //   avatarUrl: [...filePaths],
                  //   imageUrls: [...filePaths]
                  // })
                  setFormValue('imgUrlList', [...filePaths]);
                  uni.hideToast();
                } catch (error) {
                  console.log(error);
                  uni.showToast({
                    title: error.message,
                    icon: 'none',
                    duration: 2000
                  });
                }
              },
              fail: function (e) {
                console.log(e);
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
      title: '最多只能上传9张哦~',
      icon: 'none',
      duration: 2000
    });
  }
}
function bindVideoEnterPictureInPicture() {
  console.log('进入小窗模式');
}
function bindVideoLeavePictureInPicture() {
  console.log('退出小窗模式');
}
function reviewImg(e) {
  let index = e.currentTarget.dataset.index;
  let arr = [];
  state.imageUrls.forEach(item => {
    if (item.indexOf('.mp4') > -1) {
      arr.push({
        url: item,
        type: 'video'
      });
    } else {
      arr.push({
        url: item
      });
    }
  });
  uni.previewMedia({
    current: index,
    sources: arr,
    success: res => {
      console.log('success', res);
    },
    fail: err => {
      console.log('err', err);
    }
  });
}
function removeImg(e) {
  console.log(e.currentTarget.dataset);
  let index = e.currentTarget.dataset.index;
  state.formData.imgUrlList.splice(index, 1);
  state.imageUrls.splice(index, 1);
  state.formData = state.formData;
  state.imageUrls = state.imageUrls;
}
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function getTopicNameById(id) {
  const topic = state.topicList.find(t => t.id === id);
  return topic ? topic.name : id;
}
</script>
<style scoped>
/* pages/mallModule/recommend/release/release.wxss */
.recommend-release-page {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
  padding-bottom: 126rpx;
}

.upload-images-box {
  width: 160rpx;
  height: 160rpx;
  background: #F3F3F3;
  border-radius: 20rpx;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  display: inline-block;
  overflow: hidden;
  position: relative;
}

.upload-images-box image {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.item-images-box {
    margin-left: 30rpx;
    width: 160rpx;
    height: 160rpx;
    border-radius: 20rpx;
    display: inline-block;
    position: relative;
}
.item-images,.myVideo {
  width: 160rpx;
  height: 160rpx;
  border-radius: 20rpx;
  overflow: hidden;
}
.item-images-box .delete-icon {
    width: 35rpx;
    height: 35rpx;
    position: absolute;
    right: 12rpx;
    top: -0rpx;
}
.item-images-box .delete-icon image {
    width: 50rpx;
    height: 50rpx;
}
.item-images image {
  width: 160rpx;
  height: 160rpx;
  display: inline-block;
}

.upload-images-box .submit-img {
  width: 71rpx;
  height: 70rpx;
}

.upload-box {
  margin-top: 30rpx;
}

.add-title {
  font-weight: 600;
  font-size: 30rpx;
  color: #333333;
  margin-top: 44rpx;
}

.add-title input::placeholder {
  font-weight: 600;
  font-size: 30rpx;
  color: #999999;
}

.add-content {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  margin-top: 70rpx;
  min-height: 340rpx;
}

.add-content textarea {
  width: 100%;
}

.add-content input::placeholder {
  font-weight: 400;
  font-size: 28rpx;
  color: #999999;
}

.add-content-topic {
  font-weight: 400;
  font-size: 28rpx;
  color: #EB702D;
}

.add-content-topic text {
  display: inline-block;
  margin-right: 14rpx;
}

.add-topic {
  display: flex;
  justify-content: space-between;
  padding-top: 42rpx;
  border-top: 1px solid #F3F3F3;
}

.add-topic-left {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
}

.add-topic-right {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  display: flex;
  align-items: center;
}

.add-topic-right image {
  width: 14rpx;
  height: 14rpx;
  margin-right: 12rpx;
}

.topic-list {
  margin-top: 30rpx;
  padding-bottom: 40rpx;
  /* border-bottom: 1px solid #F3F3F3; */
}

.topic-list .topic-item {
  display: inline-block;
  padding: 10rpx 18rpx;
  border-radius: 10rpx;
  border: 1px solid #E2E2E2;
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  margin-right: 14rpx;
}

.add-goods-list {
  margin-top: 30rpx;
}

.add-goods-item {
  display: flex;
  align-items: center;
  background: #F3F3F3;
  border-radius: 20rpx;
  height: 140rpx;
  position: relative;
  margin-top: 6rpx;
}

.add-goods-item-lt {
  width: 120rpx;
  height: 120rpx;
  background-color: pink;
  border-radius: 20rpx;
  margin-left: 10rpx;
  overflow: hidden;
}

.add-goods-item-lt image {
  width: 100%;
  height: 100%;
}

.add-goods-item-rt {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin-left: 24rpx;
}

.add-goods-item-rt-title {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  margin-top: 20rpx;
}

.add-goods-item-rt-pic {
  font-weight: 600;
  font-size: 24rpx;
  color: #EB702D;
  margin-bottom: 22rpx;
}

.delete-goods-item {
  position: absolute;
  right: 23rpx;
  top: 50%;
  width: 28rpx;
  height: 28rpx;
  transform: translateY(-50%);
}

.delete-goods-item image {
  width: 100%;
  height: 100%;
}

.save-btn-box {
    background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9;
  padding:20rpx 20rpx 46rpx;
  box-sizing: border-box;
}

.save-btn {
  width: 689rpx;
  height: 80rpx;
  background: #EB702D;
  border-radius: 40rpx;
  text-align: center;
  line-height: 80rpx;
  font-weight: 400;
  font-size: 32rpx;
  color: #FFFFFF;
}
.delete-btn {
    width: 150rpx;
    height: 80rpx;
    /* background: #999999; */
    border-radius: 40rpx;
    text-align: center;
    line-height: 80rpx;
    font-weight: 400;
    font-size: 32rpx;
    /* color: #FFFFFF; */
    margin-right: 20rpx;
}
.delete-btn image {
    width: 47rpx;
    height: 50rpx;
    display: block;
    margin: 15rpx auto;
}
.topic-popup {
  width: 100%;
  height: 1019rpx;
  background-color: #fff;
  border-radius: 30rpx 30rpx 0 0;
  position: relative;
}

.popup-title {
  width: 100%;
  text-align: center;
  padding: 40rpx 0 0;
  font-weight: 600;
  font-size: 32rpx;
  color: #000000;
}

.popup-close-box {
  width: 25rpx;
  height: 25rpx;
  position: absolute;
  right: 32rpx;
  top: 42rpx;
}

.popup-close-box image {
  width: 100%;
  height: 100%;
}

.topic-popup-list {
  height: 757rpx;
  overflow-y: scroll;
  padding: 0 30rpx;
}

.topic-popup-item {
  display: flex;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1px solid #F3F3F3;
}

.topic-popup-item-title {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
}

.topic-popup-item-check {
  width: 30rpx;
  height: 30rpx;
}

/*  重写 checkbox 样式  */
/* 未选中的 背景样式 */
checkbox .wx-checkbox-input {
  border-radius: 30%;
  /* 圆角 */
  width: 30rpx;
  /* 背景的宽 */
  height: 30rpx;
  /* 背景的高 */
}

/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  border: 1px solid #EB702D;
  background: #EB702D;
}

/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
  border-radius: 50%;
  /* 圆角 */
  width: 30rpx;
  /* 选中后对勾大小，不要超过背景的尺寸 */
  height: 30rpx;
  /* 选中后对勾大小，不要超过背景的尺寸 */
  line-height: 30rpx;
  text-align: center;
  font-size: 20rpx;
  /* 对勾大小 30rpx */
  color: #fff;
  /* 对勾颜色 白色 */
  background: transparent;
  transform: translate(-50%, -50%) scale(1);
  -webkit-transform: translate(-50%, -50%) scale(1);
}

.popup-btn {
  width: 689rpx;
  height: 80rpx;
  background: #EB702D;
  border-radius: 40rpx;
  text-align: center;
  line-height: 80rpx;
  font-weight: 400;
  font-size: 32rpx;
  color: #FFFFFF;

}

.popup-btn-box {
  width: 100%;
  height: 152rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 26rpx 0 46rpx; */
}

.zone-box {
  width: 100%;
  height: 46rpx;
  background-color: transparent;
}

.goods-popup {
  height: 1159rpx;
}

.goods-popup-list {
  height: 730rpx;
  box-sizing: border-box;
  padding: 0 0 0 30rpx;
}

.active-type {
  width: 100%;
  display: flex;
  margin: 46rpx 0 38rpx 0;
}

.active-type-item {
  width: 50%;
  text-align: center;
  font-weight: 400;
  font-size: 32rpx;
  position: relative;
}

.active-line {
  position: absolute;
  left: 50%;
  bottom: -16rpx;
  width: 49rpx;
  height: 5rpx;
  background: #EB702D;
  border-radius: 3rpx;
  transform: translateX(-50%);
}

.search-box-pop {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-box-pop view {
  width: 691rpx;
  height: 70rpx;
  background: #F3F3F3;
  border-radius: 35rpx;
  display: flex;
  align-items: center;
  /* justify-content: center; */
}

.search-box-pop view image {
  width: 26rpx;
  height: 26rpx;
  margin-left: 26rpx;
}

.search-box-pop view input {
  width: 100%;
  text-align: center;
  font-size: 28rpx;
}

.popup-item-title-lt {
  width: 140rpx;
  height: 140rpx;
  /* background-color: pink; */
  border-radius: 20rpx;
  overflow: hidden;
  margin-right: 24rpx;
}

.popup-item-title-lt image {
  width: 140rpx;
  height: 140rpx;
}

.goods-popup-item-title {
  display: flex;
}

.goods-popup-item {
  align-items: center;
  padding: 20rpx 30rpx 20rpx 0;
  box-sizing: border-box;
}

.popup-item-title-rt {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.popup-item-title-rt view:nth-of-type(1) {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  /* margin-top: 3rpx; */
}

.popup-item-title-rt view:nth-of-type(2) {
  font-weight: 600;
  font-size: 24rpx;
  color: #EB702D;
  margin-bottom: 6rpx;
}

.line {
  margin-top: 58rpx;
  width: 100%;
  height: 1px;
  background-color: #F3F3F3;
}

.approve-box {
  width: 100%;
}

.approve-box-title {
  margin-top: 41rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
}

.approve-content {
  font-size: 24rpx;
  color: #333333;
  line-height: 37rpx;
  margin: 25rpx 0 8rpx;
  line-height: 37rpx;
}

.approve-time {
  margin-bottom: 25rpx;
  font-size: 24rpx;
  color: #999999;
}
</style>