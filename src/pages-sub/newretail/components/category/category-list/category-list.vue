<template>
<!--components/category/category-list/category-list.wxml-->
<view class="content">
  <scroll-view class="left-box" scroll-y="" :style="'height: ' + windowHeight + 'px;'" :scrollTop="offsetTop">
    <view :class="'category-item ' + (currentCategory == item.id ? 'active' : '')" :style="'color: ' + (currentCategory == item.id ? themeColor : '')" @click="clickCategory" v-for="(item , index) in category" :key="item.id" :data-id="item.id">
      <view class="category-item-name" :style="'border-left: ' + (currentCategory == item.id ? '8rpx solid ' + themeColor : '')">
        {{item.name}}
      </view>
    </view>
  </scroll-view>
  <scroll-view class="right-box" scroll-y="" :style="'height: ' + windowHeight + 'px;'" :scroll-into-view="'m' + toCategory" scroll-with-animation="" @scroll="scroll">
    <view class="category-box" v-for="(categoryItem , index) in category" :key="i" :id="'m' + categoryItem.id" :data-id="categoryItem.id">
      <view class="categories-item-box" v-for="(item , index) in categoryItem.children" :key="item.id">
        <view class="menu-name"><text>{{item.name}}</text></view>
        <view class="categories-con">
          <view class="categories-item" v-for="(third , index) in item.children" :key="i" :data-id="third.id" :data-count="third.count" @click="clickCategoryItem">
            <image :class="third.pictureUrl ? '' : 'noPic'" :src="third.pictureUrl"></image>
            <text>{{third.name}}</text>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</view>
</template>
<script setup>
// import { ready } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
const app = getApp();
// components/category/category-list/category-list.js
//获取应用实例
const state = reactive({
  windowHeight: '',
  sectionOffsetTops: [],
  isScroll: true,
  offsetTops: [],
  isIphoneX: false
});
const props = defineProps({
  category: {
    type: Array,
    value: []
  },
  currentCategory: String,
  toCategory: String,
  themeColor: String
});
ready(function () {
  const tabbarHeight = app.globalData.isIphoneX ? 148 : 98;
  state.isIphoneX = app.globalData.isIphoneX;
  state.windowHeight = app.globalData.systemInfo.windowHeight - tabbarHeight * app.globalData.systemInfo.windowWidth / 750;
});
function clickCategory(e) {
  state.isScroll = false;
  triggerEvent('clickCategory', e);
}
function clickCategoryItem(e) {
  triggerEvent('clickItem', e.currentTarget.dataset);
}
function scroll(e) {
  // console.log(e.detail.scrollTop)
  const that = this;
  if (state.isScroll) {
    let offsetTops = state.offsetTops;
    let n = offsetTops[0].offsetTop;
    for (let j = 0; j < offsetTops.length; j++) {
      const ele = offsetTops[j];
      const scrollTop = e.detail.scrollTop + n;
      if (j === offsetTops.length - 1 && scrollTop >= ele.offsetTop) {
        state.currentCategory = ele.categoryId;
        break;
      } else if (scrollTop >= ele.offsetTop && scrollTop < offsetTops[j + 1].offsetTop) {
        state.currentCategory = ele.categoryId;
        break;
      }
    }
  } else {
    state.isScroll = true;
  }
}

// Watch listeners converted from observers
watch(() => props.category, (newVal, oldVal) => {
  let that = this;
        if (newVal.length == oldVal.length) return !1;
        if (uni.nextTick) {
          uni.nextTick(function () {
            let list = [];
            uni.createSelectorQuery().in(that).selectAll(".category-item").boundingClientRect(function (i) {
              if (0 != i.length) {
                let n = i[0].top > 0 ? 0 : Math.abs(i[0].top) + 72;
                i.forEach(e => {
                  list.push({
                    categoryId: e.dataset.id,
                    offsetTop: e.top + n
                  });
                });
                state.sectionOffsetTops = list;
              }
            }).exec();
            uni.createSelectorQuery().in(that).selectAll(".category-box").boundingClientRect(function (i) {
              if (0 != i.length) {
                let n = i[0].top > 0 ? 0 : Math.abs(i[0].top) + 72;
                let offsetTops = [];
                i.forEach(e => {
                  offsetTops.push({
                    categoryId: e.dataset.id,
                    offsetTop: e.top + n
                  });
                });
                state.offsetTops = offsetTops;
              }
            }).exec();
          });
        } else {
          setTimeout(() => {
            let list = [];
            uni.createSelectorQuery().in(that).selectAll(".category-item").boundingClientRect(function (i) {
              if (0 != i.length) {
                let n = i[0].top > 0 ? 0 : Math.abs(i[0].top) + 72;
                i.forEach(e => {
                  list.push({
                    categoryId: e.dataset.id,
                    offsetTop: e.top + n
                  });
                });
                state.sectionOffsetTops = list;
              }
            }).exec();
            uni.createSelectorQuery().in(that).selectAll(".category-box").boundingClientRect(function (i) {
              if (0 != i.length) {
                let n = i[0].top > 0 ? 0 : Math.abs(i[0].top) + 72;
                let offsetTops = [];
                i.forEach(e => {
                  offsetTops.push({
                    categoryId: e.dataset.id,
                    offsetTop: e.top + n
                  });
                });
                state.offsetTops = offsetTops;
              }
            }).exec();
          }, 200);
        }
});

</script>
<style scoped>
/* components/category/category-list/category-list.wxss */
.content {
  display: flex;
  justify-content: space-between;
  height: 100%;
}
.left-box {
  width: 186rpx;
  background: #F7F7F7;
}
.category-item {
  width: 100%;
  height: 104rpx;
  /* padding: 0 12rpx; */
  box-sizing: border-box;
  background: #f7f7f7;
  font-size: 28rpx;
  color: #757575;
  line-height: 104rpx;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.category-item .category-item-name {
  width: 100%;
  height: 30rpx;
  line-height: 30rpx;
  margin-top: 37rpx;
  box-sizing: border-box;
}
.category-item.active {
  background: #fff;
  /* position: relative; */
  font-size: 30rpx;
  color: #ff6131;
  font-weight: bold;
}
/* .category-item.active::before {
  content: "";
  display: block;
  width: 8rpx;
  height: 30rpx;
  background: #ff6131;
  position: absolute;
  left: 0;
  top: 37rpx;
} */
.right-box {
  width: 564rpx;
  box-sizing: border-box;
  background: #ffffff;
}
.category-box {
  width: 484rpx;
  margin: 0 auto;
}
.categories-item-box .menu-name {
  font-size: 26rpx;
  line-height: 48rpx;
  height: 48rpx;
  margin-bottom: 16rpx;
  padding-top: 28rpx;
  text-align: center;
  font-weight: bold;
}
.categories-item-box .menu-name text {
  display: inline-block;
  position: relative;
}
.categories-item-box .menu-name text::before,
.categories-item-box .menu-name text::after {
  content: "";
  display: block;
  width: 50rpx;
  height: 1px;
  background: #9F9F9F;
  position: absolute;
}
.categories-item-box .menu-name text::before {
  left: -67rpx;
  top: 23rpx;
}
.categories-item-box .menu-name text::after {
  right: -67rpx;
  top: 23rpx;
}
.categories-con {
  width: 504rpx;
  border-bottom: 1px solid #ebeff7;
  padding-bottom: 24rpx;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.categories-item {
  width: 120rpx;
  text-align: center;
  margin-right: 62rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 10rpx;
}
.categories-item:nth-of-type(3n) {
  margin-right: 0;
}
.categories-item image {
  width: 100%;
  height: 120rpx;
  border-radius: 10rpx;
}
.categories-item image.noPic {
  background: #f7f7f7;
}
.categories-item text {
  font-size: 20rpx;
  line-height: 40rpx;
  margin-top: 3rpx;
  font-weight: 500;
}
</style>