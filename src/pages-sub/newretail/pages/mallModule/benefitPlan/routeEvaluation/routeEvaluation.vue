<template>
  <!--pages/evaluate/evaluate.wxml-->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view class="evaluate-item">
    <view class="evaluate-goods">
      <view>
        <view class="stars-box" v-for="(item, index) in state.startList">
          <text>{{ item.title }}</text>
          <view>
            <image
              v-for="(ele, idx) in 5"
              :key="idx"
              class="stars-image"
              :data-key="item.key"
              :data-index="idx"
              @click="choiceStars"
              :src="state.startObj[item.key] > idx ? state.selected : state.unSelect"
            ></image>
          </view>
        </view>
        <!-- <view class="stars-box">
              <text>服务评分</text>
              <image wx:for="{{5}}" wx:key="index" wx:for-index="idx" wx:for-item="ele" class="stars-image" data-index="{{idx}}" bindtap="choiceStars1" src="{{state.serviceEvaluate ></image> idx ? state.selected : state.unSelect}}">
          </view> -->
      </view>
    </view>
    <view class="evaluate-content">
      <textarea
        placeholder="你的感受很重要，展开写写吧"
        @input="bindTextAreaInput"
        @blur="bindTextAreaBlur"
      ></textarea>
    </view>
    <view class="evaluate-img-box">
      <view class="evaluate-img" v-for="(ele, idx) in state.imageUrls" :key="idx">
        <image :key="unique" :src="ele.url"></image>
        <image
          class="close-icon"
          :data-id="idx"
          @click="deleteImg"
          :src="state.imagesPath.iconEvaluateClose"
        ></image>
      </view>
      <image :src="state.imagesPath.imgAddImg" class="submit-img" @click="chooseImage"></image>
    </view>
  </view>
  <!-- <button class="button-box {{submit?'enable':'unable'}}" disabled="{{!submit}}" bindtap="submitComment">发表评论</button> -->
  <button
    class="button-box enable"
    :style="'background: ' + state.themeColor"
    @click="submitComment"
  >
    提交
  </button>
</template>
<script setup>
import _apiWelfarePlanServiceJs from '@/service/api/newretail/welfarePlanService'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiRequestJs from '@/service/api/newretail/request'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/evaluate/evaluate.js
const request = _apiRequestJs
const IMGAGESPATH = _utilsImagesPathJs
const selfA = _utilsSelfJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs
const welfarePlanService = _apiWelfarePlanServiceJs

// 获取应用实例
const state = reactive({
  startObj: {
    routeEvaluate: 0,
    serviceEvaluate: 0,
    scenicEvaluate: 0,
    featureEvaluate: 0,
    guideEvaluate: 0,
  },
  startList: [
    {
      key: 'routeEvaluate',
      title: '您对旅行社的整体服务质量及安全保障工作的评价',
    },
    {
      key: 'serviceEvaluate',
      title: '您对旅行社提供的旅游车辆、住宿质量及餐饮质量的评价',
    },
    {
      key: 'scenicEvaluate',
      title: '您对旅行社的景点安排的评价',
    },
    {
      key: 'featureEvaluate',
      title: '您对旅游中的增值（特色）服务安排的评价',
    },
    {
      key: 'guideEvaluate',
      title: '您对旅游过程中导游地接满意度的评价',
    },
  ],
  navigationBarTitle: '旅游评分',
  // avatarUrl: null,
  imagesPath: IMGAGESPATH,
  avatarUrl: [],
  imageUrls: [],
  submit: true,
  unSelect: IMGAGESPATH.iconUnevaluate,
  selected: IMGAGESPATH.iconEvaluate,
  inputText: '',
  count: 5,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  routeEvaluate: 0,
  serviceEvaluate: 0,
  evaluate: '',
})
function choiceStars(val) {
  const idx = val.currentTarget.dataset.index
  const key = val.currentTarget.dataset.key
  let num = state.startObj[key]
  if (num !== idx + 1) {
    num = parseInt(idx + 1)
  } else {
    // 取消评价
    num = 0
  }
  // let tempStatus = true
  // if (num === 0 || this.data.serviceEvaluate === 0 || this.data.evaluate == '') {
  //   tempStatus = false
  // }
  state.startObj[key] = num
}
function choiceStars1(val) {
  const idx = val.currentTarget.dataset.index
  let num = state.serviceEvaluate
  if (num !== idx + 1) {
    num = parseInt(idx + 1)
  } else {
    // 取消评价
    num = 0
  }
  state.serviceEvaluate = num
}
function bindTextAreaInput(e) {
  state.evaluate = e.detail.value
}
function bindTextAreaBlur(e) {}
function chooseImage(val) {
  const that = this
  const count = state.count - state.imageUrls.length
  if (count > 0) {
    uni.chooseImage({
      count,
      // 默认9
      sizeType: ['original', 'compressed'],
      // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFilePaths = res.tempFilePaths

        // 启动上传等待中...
        uni.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 200000,
        })
        console.log(tempFilePaths)
        const filePaths = state.imageUrls
        tempFilePaths.forEach((ele, index) => {
          if (res.tempFiles[index].size < 1024000) {
            uni.uploadFile({
              url: request.BASE_URL + '/newretail/api/dfs/upload',
              // 仅为示例，非真实的接口地址
              filePath: ele,
              name: 'file',
              formData: {
                user: 'test',
              },
              header: {
                'wxa-appid': request.APP_ID,
              },
              success: function (res) {
                const data = res.data
                const tempData = JSON.parse(data)
                console.log(tempData)
                const tempItem = {
                  width: tempData.data.width,
                  height: tempData.data.height,
                  url: tempData.data.url,
                  fileId: tempData.data.id,
                }
                filePaths.push(tempItem)
                state.imageUrls = filePaths
                uni.hideToast()
              },
              fail: function (e) {
                console.log(e.message)
              },
            })
          } else {
            uni.hideToast()
            uni.showToast({
              title: '上传图片大小不能超过 1MB哦~',
              icon: 'none',
              duration: 2000,
            })
          }
        })
      },
    })
  } else {
    if (countArr[idx]) {
      uni.showToast({
        title: '还有' + countArr[idx] + '张图片在上传中哦，请稍后~',
        icon: 'none',
        duration: 2000,
      })
    } else {
      uni.showToast({
        title: '最多只能上传5张哦~',
        icon: 'none',
        duration: 2000,
      })
    }
  }
}
function deleteImg(val) {
  Array.prototype.del = function (index) {
    if (isNaN(index) || index >= this.length) {
      return false
    }
    for (let i = 0, n = 0; i < this.length; i++) {
      if (this[i] != this[index]) {
        this[n++] = this[i]
      }
    }
    this.length -= 1
  }
  console.log(val)
  const index = val.currentTarget.dataset.id
  // this.data.avatarUrl.del(index)
  state.imageUrls.del(index)
  state.imageUrls = state.imageUrls
}
function getProductComments() {
  const evaluationData = uni.getStorageSync('evaluationData')
    ? JSON.parse(uni.getStorageSync('evaluationData'))
    : {}
  let tempData = {
    ...evaluationData,
    evaluate: state.evaluate,
    ...state.startObj,
    // routeEvaluate: this.data.routeEvaluate,
    // serviceEvaluate: this.data.serviceEvaluate,
  }
  // 有图片
  if (state.imageUrls.length > 0) {
    const list = state.imageUrls.map((item) => item.url)
    tempData = {
      ...tempData,
      evaluateUrl: list.join(','),
    }
  }
  return tempData
}
function submitComment() {
  const that = this
  if (!canSubmitComment) {
    console.log('已经在提交了~')
    return
  }
  canSubmitComment = false
  const postData = getProductComments()
  welfarePlanService
    .tourismPlanEvaluateCreate(postData)
    .then((res) => {
      canSubmitComment = true
      uni.showToast({
        title: '评论成功！',
        icon: 'success',
        duration: 2000,
      })
      uni.navigateBack({
        delta: 1,
      })
    })
    .catch((e) => {
      canSubmitComment = true
      console.log(e.message)
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
onLoad(function (options) {
  uni.hideShareMenu()
  // 统计PV
  state.themeColor = app.globalData.uiconfig.themeColor
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
})
onReady(function () {})
onShow(function () {
  canSubmitComment = true
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {})
</script>
<style scoped>
/* pages/evaluate/evaluate.wxss */
page {
  background: #f4f5f9;
  padding-bottom: 100rpx;
}
.evaluate-item {
  margin-bottom: 20rpx;
  background: #ffffff;
  padding: 0 40rpx;
}
.evaluate-goods {
  display: flex;
  padding: 36rpx 0 6rpx 0;
}
.goods-img-box {
  width: 94rpx;
  height: 67rpx;
  margin-right: 15rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.goods-img-box image {
  width: 100%;
  height: 100%;
}

.stars-box {
  height: 105rpx;
  line-height: 48rpx;
  display: flex;
  /* align-items: center; */
  flex-direction: column;
}
.stars-box text {
  font-size: 24rpx;
  font-weight: lighter;
  color: #1b1b1d;
  margin-right: 40rpx;
}
.stars-box image {
  width: 43rpx;
  height: 43rpx;
  margin-right: 19rpx;
}

.evaluate-content {
  width: 670rpx;
  height: 528rpx;
  background: #f1f1f1;
  position: relative;
  margin-top: 13rpx;
  padding-top: 11rpx;
}
.evaluate-content::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-width: 0 53rpx 26rpx;
  border-style: solid;
  border-color: transparent transparent #f1f1f1; /*透明 透明  灰*/
  left: 0;
  top: -13rpx;
}

.evaluate-content textarea {
  width: 650rpx;
  height: 520rpx;
  padding: 25rpx 31rpx 25rpx 31rpx;
  box-sizing: border-box;
  border-radius: 6rpx;
  border: 1rpx solid #dcdcdc;
  margin: 0 auto 0 auto;
  background: #ffffff;
  color: #8b8b8c;
  font-size: 28rpx;
  line-height: 36rpx;
}

.labels-box {
  padding: 0 35rpx 4rpx 35rpx;
}

.labels-item {
  height: 60rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  line-height: 60rpx;
  display: inline-block;
  color: #8b8b8c;
  border: 1rpx solid #dcdcdc;
  background: #ffffff;
  margin: 27rpx 15rpx 27rpx 0;
  border-radius: 6rpx;
}
.labels-box text.select {
  background: #009f55;
  border: 1rpx solid #009f55;
  color: #ffffff;
}
.evaluate-img-box {
  border-top: 1rpx solid #dcdcdc;
  margin-top: 30rpx;
  padding: 30rpx 0 41rpx 0;
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
}

.evaluate-img-box > image {
  width: 160rpx;
  height: 160rpx;
}
.evaluate-img {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 6rpx;
  margin-right: 8rpx;
  margin-bottom: 9rpx;
}
.evaluate-img:nth-of-type(4n) {
  margin-right: 0;
}
.evaluate-img image:first-of-type {
  width: 100%;
  height: 100%;
}
.evaluate-img image.close-icon {
  height: 32rpx;
  width: 32rpx;
  position: absolute;
  right: -16rpx;
  top: -16rpx;
  z-index: 8;
}
.evaluate-img-box .submit-img {
  width: 160rpx;
  height: 160rpx;
}

.button-box {
  height: 100rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: 32rpx;
  line-height: 100rpx;
  font-weight: bold;
  text-align: center;
  border-radius: 0;
  border: none;
}

button[class='button-box']::after {
  border: none;
  border-radius: 0;
}
button[disabled]::after {
  border: none;
  border-radius: 0;
}

button.enable {
  background: #009f55;
  color: #ffffff;
}
button.unable {
  background: #f1f1f1 !important;
  color: #8b8b8c !important;
}
</style>
