<template>
<!-- 商品自定义栏目 页脚 -->
<view class="custom-box" v-if="selfColumnDTOS && selfColumnDTOS.length > 0">
    <view class="custom-list" v-for="(item , index) in selfColumnDTOS" :key="index">
        <view class="custom-name">
            <text>{{item.propertyName}}</text>
            <!-- https://gomore-dshx.oss-cn-hangzhou.aliyuncs.com/image/up.png -->
            <view class="custom-btn" @click="changeisExpand" :data-index="index" :data-location="item.location">
                <image :src="imagesPath.upIcon" :class="item.isExpand === 1 ? 'up-icon' : 'up-icon rotate-icon'" mode=""></image>
            </view>
        </view>
        <view v-if="item.type === 1" class="key-list-box">
            <view class="custom-content" v-for="(itemProperty , idx) in item.propertyValue" :key="idx">
                <!-- 键值对 -->
                {{tem.isExpand}}
                <view :hidden="item.isExpand === 2 ? true : false">
                    <view class="custom-keyvalue">
                        <text class="keyvalue-title">{{itemProperty.label}}：</text>
                        <text>{{itemProperty.value}}</text>
                    </view>
                </view>
            </view>
        </view>
        <view v-else>
            <view class="custom-content" v-for="(itemProperty , idx) in item.propertyValue" :key="idx">
                <!-- 图片 -->
                <view v-if="item.type === 2" :hidden="item.isExpand === 2 ? true : false">
                    <image class="custom-image" :src="itemProperty.imageUrl" :width="itemProperty.imageWidth" mode="widthFix"></image>
                </view>
                <!-- 文字 -->
                <view v-else-if="item.type === 3" :hidden="item.isExpand === 2 ? true : false">
                    <view>
                        <text class="custom-text">{{itemProperty.text}}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</view>
</template>
<script setup>
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsUtilsJs from "@/utils/newretail/utils";
import { reactive , watch} from "vue";
const props = defineProps({
  columnDTOS: {
    type: Array
  }
});
const app = getApp();
// components/timer-picker/index.js
const utils = _utilsUtilsJs;
const IMGAGESPATH = _utilsImagesPathJs;
const state = reactive({
  imagesPath: IMGAGESPATH,
  selfColumnDTOS: []
});
function changeisExpand(e) {
  console.log(e);
  let location = e.currentTarget.dataset.location;
  let index = e.currentTarget.dataset.index;
  // if(location === 1) {
  state.selfColumnDTOS[index].isExpand = state.selfColumnDTOS[index].isExpand === 1 ? 2 : 1;
  // } 
  state.selfColumnDTOS = state.selfColumnDTOS;
  triggerEvent('changeShow', location, state.selfColumnDTOS);
}

// Watch listeners converted from observers
watch(() => props.columnDTOS, (newVal, oldVal) => {
  console.log(newVal, 'newVal');
        state.selfColumnDTOS = newVal;
});

</script>
<style scoped>
.custom-box {
    border-top: 1px solid #EAEAEA;
    background: #fff;
    /* padding: 5px 10px; */
  }
  .custom-list {
    border-bottom: 1px solid #EAEAEA;
  }
  .custom-name {
    font-size: 30rpx;
    /* height: 90rpx;
    line-height: 90rpx; */
    padding: 20rpx 16rpx 20rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 400;
    letter-spacing: 2rpx;
  }
  .custom-name text {
    text-indent: 24rpx;
    font-size: 30rpx;
  }
  .key-list-box {
      display: flex;
      flex-wrap: wrap;
      padding: 0 15rpx;
  }
  .key-list-box  .custom-content {
      width: 33%;
  }
  .key-list-box .custom-keyvalue {
    display: flex;
    padding: 4rpx 5rpx 20rpx 0;
  }
  .key-list-box .keyvalue-title {
      white-space: nowrap;
      padding-left: 32rpx;
  }
  .custom-content {
    font-size: 24rpx;
  }
  .custom-btn {
    width: 240rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .custom-text {
    font-size: 24rpx;
    line-height: 40rpx;
    display: block;
    padding: 4rpx 47rpx 24rpx;
    letter-spacing: 1px;
  }
  .custom-image {
    margin: 0 auto;
    display: block;
    padding: 20rpx 28rpx;
  }
  .custom-keyvalue {
    font-size: 24rpx;
    line-height: 40rpx;
  }
  .up-icon {
    width: 27rpx;
    height: 15rpx;
    transition: all .3s;
    margin-right: 10rpx;
}
.rotate-icon {
    transform: rotate(180deg);
}
</style>