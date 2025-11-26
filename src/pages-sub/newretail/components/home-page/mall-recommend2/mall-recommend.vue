<template>
<!--components/home-page/mall-recommend/mall-recommend.wxml-->
<view class="mall-recommend-loading" v-if="!loaded || !isShow">
  <view class="item-box">
    <view class="img-box"></view>
    <view class="info-box">
      <view class="name"></view>
      <view class="desc"></view>
      <view class="price"></view>
    </view>
  </view>
</view>
<view class="store-title" :style="hotTitleImgUrl ? 'width: 750rpx;padding: 0' : ''" v-if="fineQualityGoodsList.length > 0 && isShowProductAreaTitle">
  <image v-if="hotTitleImgUrl" :src="hotTitleImgUrl" mode="widthFix"></image>
  <text v-else>热门推荐</text>
  <!-- <text wx:else>商城精选</text> -->
</view>
<view class="goods-box mall-recommend-good" :style="'display: ' + (displayStyle === 'two' || displayStyle === 'TWO' ? 'flex' : '')">
  <view v-if="displayStyle === 'one' || displayStyle === 'ONE'" v-for="(item , index) in fineQualityGoodsList" :key="idx">
    <goods-item :recommed="true" :goods="item" :idx="index" :shopCart="shopCart" :hasUserInfo="hasUserInfo" @onClickGoods="onClickGoods" @addToCart="addToCart" @noop="noop" @getUserInfo="onGetUserInfo"></goods-item>
  </view>
  <view v-if="displayStyle === 'two' || displayStyle === 'TWO'" v-for="(item , index) in fineQualityGoodsList" :key="idx">
    <goods-store-hot :recommed="true" :goods="item" :idx="index" :shopCart="shopCart" :hasUserInfo="hasUserInfo" @onClickGoods="onClickGoods" @addToCart="addToCart" @noop="noop" @getUserInfo="onGetUserInfo"></goods-store-hot>
  </view>
</view>
</template>
<script setup>
import _homePageCommonBehaviorJs from "../homePageCommonBehavior";
import _lazyLoadPageLazyLoadBaseJs from "../../lazy-load-page/lazy-load-base";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiWisdomServiceJs from "@/service/api/newretail/wisdomService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
// import { ready } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
import goodsItem from '../../goods-item/goods-item.vue';
import goodsStoreHot from '../../goods-store-hot/goods-store-hot.vue';
const app = getApp();
// components/home-page/mall-recommend/mall-recommend.js
const IMGAGESPATH = _utilsImagesPathJs;
const THEME = _utilsThemeManagerJs;
const productService = _apiProductServiceJs;
const wisdomService = _apiWisdomServiceJs;
const NAVPAGE = _utilsNavPageJs;
const AUTHORIZE = _utilsAuthorizeJs;
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs;
const homePageCommonBehavior = _homePageCommonBehaviorJs;
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //  处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')';
  } else {
    return sColor;
  }
};
//获取应用实例
const state = reactive({
  total: 11,
  loadingFlag: false,
  page: 1,
  pageSize: 10,
  goodTimeOut: null,
  imagesPath: IMGAGESPATH,
  theme: THEME,
  themeColor: THEME.color,
  loaded: false,
  isShow: false,
  fineQualityGoodsList: [],
  hasQuery: false
});
const props = defineProps({
  show: {
    // 属性名
    type: Boolean,
    value: false
  },
  isShowProductAreaTitle: {
    type: Boolean,
    value: false
  },
  hotTitleImgUrl: {
    type: String,
    value: ''
  },
  storeInfo: Object,
  pageScrollData: {
    // 属性名
    type: Object,
    value: {}
  },
  pageScrollData1: {
    // 属性名
    type: Object,
    value: {}
  },
  uiconfig: Object,
  hasUserInfo: Boolean,
  isMember: Boolean,
  displayStyle: String,
  refreshType: {
    // 属性名
    type: String,
    value: ""
  },
  shopCart: Object
});
function attached() {
  // this.getScorll();
  state.theme = {
    color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + app.globalData.uiconfig.themeColor + ';' : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background: ' + app.globalData.uiconfig.themeColor + ';' : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';' : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background: linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background: linear-gradient(-270deg, #FF9F43, #F13327);",
    mainColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : "border-color:rgba(255,159,67, 0.4);",
    mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
    BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color:rgba(255,159,67, 0.1);"
  };
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
}
function moved() {}
function detached() {}
ready(function () {
  on('addToCart', event => {
    // console.log('Received customEvent with data:', event); // 打印事件数据
  });
});
function onShow() {}
function onHide() {}
function onResize() {}
function getScorll() {
  // let that = this;
  // const pages = getCurrentPages() || [];
  // let curPage = null;
  // if (pages && pages.length > 0) {
  //     curPage = pages[pages.length - 1];
  // }
  // if (curPage && typeof curPage.onPageScroll === 'function') {
  //     curPage.onPageScroll = function(e) {
  //         // 在这里处理滚动事件
  //         lazyLoadBase.determineComponentInVisibleArea(`.gm-small-goods-img-box${that.data.fineQualityGoodsList && that.data.fineQualityGoodsList.length ? that.data.fineQualityGoodsList.length - 1 : ''}`, that, `.mall-recommend-good`).then(res => {
  //             if(that.data.loadingFlag) return false
  //             if(res) {
  //                 that.setData({
  //                     loadingFlag: true
  //                 })
  //                 that.getStoreProduct(that.data.page + 1)
  //             }
  //         }).catch(err => {
  //         })
  //     };
  // }
  let that = this;
  lazyLoadBase.determineComponentInVisibleArea(`.gm-small-goods-img-box${state.fineQualityGoodsList && state.fineQualityGoodsList.length ? state.fineQualityGoodsList.length - 1 : ''}`, that, `.mall-recommend-good`, 500).then(res => {
    if (state.loadingFlag) return false;
    if (res) {
      state.loadingFlag = true;
      getStoreProduct(state.page + 1);
    }
  }).catch(err => {});
}
function handleStore() {
  if (app.globalData.storeInfo) {
    state.storeId = app.globalData.storeInfo.id;
  }
}
function reload(refresh = false) {
  const that = this;
  if (!state.loaded) {
    clearTimeout(orderTimer);
    let storeId = state.storeId;
    lazyLoadBase.determineComponentInVisibleArea(".mall-recommend-loading", that).then(res => {
      if (res) {
        if (storeId == '') {
          storeId = app.globalData.storeInfo ? app.globalData.storeInfo.id : '';
        }
        if (storeId) {
          state.loaded = true;
          queryRecommendProduct(storeId);
        }
      } else {
        let orderTimer = setTimeout(() => {
          console.log("查询是否进入显示区域");
          reload(refresh);
        }, 1000);
        orderTimer = orderTimer;
      }
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  } else if (refresh) {
    state.total = 11;
    state.fineQualityGoodsList = state.refreshType == 'ONSHOW' ? state.fineQualityGoodsList : [];
    queryRecommendProduct(state.storeId);
  }
}
function queryRecommendProduct(storeId) {
  const that = this;
  if (storeId === "" || storeId == null) {
    return;
  }
  if (state.refreshType !== "ALL" && state.refreshType !== "STORE") {
    if (state.hasQuery) {
      return;
    }
  }
  state.hasQuery = true;
  getStoreProduct(1);
}
function getStoreProduct(page) {
  state.loadingFlag = true;
  const that = this;
  if (state.page * state.pageSize >= state.total) {
    state.loadingFlag = false;
    uni.hideLoading();
    return false;
  }
  // wx.showLoading({
  //   title: '加载中~',
  //   icon: 'none'
  // })
  state.page = page ? page : 1;
  if (app.globalData.storeInfo) {
    state.storeId = app.globalData.storeInfo.id;
  }
  let storeIdList = [state.storeId];
  if (app.globalData.distributionStore && app.globalData.distributionStore.id) {
    storeIdList.push(app.globalData.distributionStore.id);
  }
  if (app.globalData.nextDayStore && app.globalData.nextDayStore.id) {
    storeIdList.push(app.globalData.nextDayStore.id);
  }
  productService.getStoreHotProduct({
    // storeIdEq: this.data.storeId,
    // storeIdIn: storeIdList,
    page: state.page,
    pageSize: state.pageSize,
    searchCount: true
  }).then(res => {
    let tempList = [];
    if (res && res.records && res.records.length > 0) {
      res.records.forEach(item => {
        let produtlabel = [];
        let promotions = [];
        let specifications = '';
        if (item.labels && item.labels.length > 0) {
          item.labels.forEach(ele => {
            if (ele.type === 'GOODSLABEL' && ele.color != null) {
              produtlabel.push(ele);
            } else if (ele.type === 'PROMOTIONLABEL') {
              promotions.push(ele);
            }
          });
        }
        if (item.productProperties && item.productProperties.length > 0) {
          for (let i = 0; i < item.productProperties.length; i++) {
            const ele = item.productProperties[i];
            if (ele.propertyName === '规格') {
              specifications = ele.propertyValue;
              break;
            }
          }
        }
        let tempItem = {
          ...item,
          produtlabel: produtlabel,
          promotions: promotions,
          specifications: specifications
        };
        tempList.push(tempItem);
      });
      let newTempList = productsSort(tempList);
      // let share = Math.ceil(newTempList.length / 50);
      // let index = 0;
      if (res.page == page && page == 1) {
        state.fineQualityGoodsList = [];
      }
      state.fineQualityGoodsList = [...state.fineQualityGoodsList, ...newTempList];
      state.isShow = true;
      state.loadingFlag = false;
      state.total = res.totalCount;
      uni.hideLoading();
      // getGoodList()
      function getGoodList() {
        if (state.goodTimeOut) {
          clearTimeout(state.goodTimeOut);
        }
        state.goodTimeOut = setTimeout(() => {
          index++;
          let fineQualityGoodsList = [...state.fineQualityGoodsList, ...newTempList.slice(index * 50, (index + 1) * 50)];
          state.fineQualityGoodsList = fineQualityGoodsList;
          if (index < share) {
            getGoodList();
          } else {
            clearTimeout(state.goodTimeOut);
          }
        }, 500);
      }
    } else {
      state.fineQualityGoodsList = tempList;
      state.isShow = true;
      state.loadingFlag = false;
      uni.hideLoading();
    }
  }).catch(error => {
    state.isShow = true;
    state.loadingFlag = false;
    uni.hideLoading();
    uni.showToast({
      title: error.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function productsSort(array) {
  let balanceArray = [];
  let allArray = [];
  array.forEach(ele => {
    if (ele.balance <= 0) {
      balanceArray.push(ele);
    } else {
      allArray.push(ele);
    }
  });
  if (app.globalData.systemConfigure.storeProductBalanceIsZeroShow) {
    const tempArray = allArray.concat(balanceArray);
    return tempArray;
  } else {
    return allArray;
  }
}
function onGetUserInfo(e) {
  getUserInfo(e.detail);
}

// Watch listeners converted from observers
watch(() => props.show, (newVal, oldVal) => {
  // 属性值变化时执行
        if (app.globalData.storeInfo) {
          handleStore();
        }
        reload(true);
});

watch(() => props.value, (newVal, oldVal) => {
  // 属性值变化时执行
        reload(false);
});

watch(() => props.value, (newVal, oldVal) => {
  if (newVal && newVal != oldVal) {
          getScorll();
        }
        // 属性值变化时执行
        // this.reload(false)
});

watch(() => props.refreshType, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal !== "" && newVal !== "USER") {
          handleStore();
          reload(true);
        } else if (newVal === "USER") {
          // 刷新会员数据
          checkUserInfo();
        }
});

</script>
<style scoped>
/* components/home-page/mall-recommend/mall-recommend.wxss */
/* loading */
.mall-recommend-loading {
  padding: 50rpx 40rpx 0 40rpx;
}
.mall-recommend-loading .item-box {
  display: flex;
}
.mall-recommend-loading .item-box .img-box {
  width: 210rpx;
  height: 210rpx;
  border-radius: 6rpx;
  background: #EFEFEF;
  margin-right: 27rpx;
  flex-shrink: 0;
}
.mall-recommend-loading .item-box .info-box {
  width: calc(100% - 237rpx);
}
.mall-recommend-loading .item-box .info-box .name {
  width: 365rpx;
  height: 39rpx;
  background: #EFEFEF;
  border-radius: 2rpx;
  margin-bottom: 20rpx;
}
.mall-recommend-loading .item-box .info-box .desc {
  width: 336rpx;
  height: 26rpx;
  background: #EFEFEF;
  border-radius: 2rpx;
  margin-bottom: 20rpx;
}
.mall-recommend-loading .item-box .info-box .price {
  width: 262rpx;
  height: 26rpx;
  background: #EFEFEF;
  border-radius: 2rpx;
}
.store-title {
  text-align: center;
  width: 400rpx;
  padding: 0 18rpx;
  min-height: 50rpx;
  /* background: #e5fffa; */
  border-radius: 25px;
  font-size: 28rx;
  line-height: 50rpx;
  color: #454545;
  font-weight: bold;
  margin: 30rpx auto 40rpx auto;
}
.store-title image {
  width: 100%;
}
.store-title>text {
  display: inline-block;
  position: relative;
  padding: 0 13rpx;
}
.store-title>text::before,
.store-title>text::after {
  content: '';
  width: 103rpx;
  height: 2rpx;
  background: #8b8b8c;
  position: absolute;
  top: 25rpx;
  display: block;
}
.store-title>text::before {
  left: -103rpx;
}
.store-title>text::after {
  right: -103rpx;
}
.goods-box {
  padding: 20rpx 20rpx 0 20rpx;
  /* display: flex; */
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 50rpx;
}
</style>