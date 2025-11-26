<template>
  <!--pages/evaluate/evaluate.wxml-->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view class="evaluate-item" v-for="(item, goodsNum) in state.goodsList" :key="index">
    <view class="evaluate-goods">
      <view class="goods-img-box">
        <image :src="item.imageUrl" mode="widthFix"></image>
      </view>
      <!-- 评论优化 --- 取配置项【评价维度名称】 -->
      <view>
        <view class="stars-box" v-for="(keylist, keyIdx) in state.evaluateKeyList" :key="keyIdx">
          <text>{{ keylist }}</text>
          <image
            v-for="(ele, idx) in 5"
            :key="idx"
            class="stars-image"
            :data-index="idx"
            :data-goodsNum="goodsNum"
            :data-type="state.starKeyList[keyIdx]"
            @click="choiceStars"
            :src="item[state.starKeyList[keyIdx]] > idx ? state.selected : state.unSelect"
          ></image>
        </view>
      </view>
      <!-- <view>
          <view class="stars-box">
            <text>商品评价</text>
            <image wx:for="{{5}}" wx:key="index" wx:for-index="idx" wx:for-item="ele" class="stars-image" data-index="{{idx}}" data-goodsNum="{{goodsNum}}" bindtap="choiceStars" src="{{item.score ></image> idx ? state.selected : state.unSelect}}">
          </view>
          <view class="stars-box">
              <text>描述相符</text>
              <image wx:for="{{5}}" wx:key="index" wx:for-index="idx" wx:for-item="ele" class="stars-image" data-index="{{idx}}" data-goodsNum="{{goodsNum}}" data-type="describeStar" bindtap="choiceStars1" src="{{item.describeStar ></image> idx ? state.selected : state.unSelect}}">
          </view>
          <view class="stars-box">
              <text>物流服务</text>
              <image wx:for="{{5}}" wx:key="index" wx:for-index="idx" wx:for-item="ele" class="stars-image" data-index="{{idx}}" data-goodsNum="{{goodsNum}}" data-type="logisticsStar" bindtap="choiceStars1" src="{{item.logisticsStar ></image> idx ? state.selected : state.unSelect}}">
          </view>
        </view> -->
    </view>
    <view class="evaluate-content">
      <textarea
        placeholder="说说哪里好，帮助小伙伴选择..."
        :data-goodsNum="goodsNum"
        @input="bindTextAreaInput"
        @blur="bindTextAreaBlur"
      ></textarea>
      <view class="labels-box">
        <text
          :class="'labels-item ' + (item.select ? 'select' : '')"
          :style="
            'background: ' +
            (item.select ? state.themeColor : '') +
            ';border: 1rpx solid ' +
            (item.select ? state.themeColor : '') +
            ';'
          "
          v-for="(item, index) in item.labels"
          :data-id="item.id"
          :data-goodsNum="goodsNum"
          :key="index"
          @click="clickLabels"
        >
          {{ item.text }}
        </text>
      </view>
    </view>
    <view class="evaluate-img-box">
      <view class="evaluate-img" v-for="(ele, idx) in item.avatarUrl" :key="index">
        <image :key="unique" :src="ele.url"></image>
        <image
          class="close-icon"
          :data-id="idx"
          :data-goodsNum="goodsNum"
          @click="deleteImg"
          :src="state.imagesPath.iconEvaluateClose"
        ></image>
      </view>
      <view class="submit-img-box">
        <image
          :data-goodsNum="goodsNum"
          :src="state.imagesPath.imgAddImg"
          class="submit-img"
          @click="chooseImage"
        ></image>
      </view>
    </view>
  </view>
  <!-- 匿名评价 -->
  <view class="hide-name" @click="toggleAnonymousReview">
    <label class="radio-hide">
      <radio :color="state.themeColor" :checked="state.anonymousReview">
        <text>匿名评价</text>
      </radio>
    </label>
  </view>
  <cover-view
    style="
      position: fixed;
      width: 100%;
      height: 140rpx;
      bottom: 0;
      left: 0;
      z-index: 99;
      background: #fff;
    "
  >
    <!-- <button class="button-box {{submit?'enable':'unable'}}" disabled="{{!submit}}" bindtap="submitComment">发表评论</button> -->
    <button
      class="button-box enable"
      :style="'background: ' + state.themeColor"
      @click="submitComment"
    >
      发表评论
    </button>
    <!-- <button class="button-box {{submit?'enable':'unable'}}" disabled="{{!submit}}" bindtap="submitComment">发表评论</button> -->
    <button
      class="button-box enable"
      :style="'background: ' + state.themeColor"
      @click="submitComment"
    >
      发表评论
    </button>
    <!-- 匿名评价 -->
    <!-- <view class="hide-name" bind:tap="toggleAnonymousReview">
        <label class="radio-hide" >
            <radio color="{{state.themeColor}}" checked="{{state.anonymousReview}}"/>
            <text>匿名评价</text>
        </label>
    </view> -->
  </cover-view>
</template>
<script setup>
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _utilsSelfJs from '@/utils/newretail/self'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiRequestJs from '@/service/api/newretail/request'
import _apiCommentServiceJs from '@/service/api/newretail/commentService'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/evaluate/evaluate.js
const orderService = _apiOrderServiceJs
const commentService = _apiCommentServiceJs
const request = _apiRequestJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const selfA = _utilsSelfJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs
const systemService = _apiSystemServiceJs
// 获取应用实例
const state = reactive({
  anonymousReview: false,
  // 是否匿名
  // 评价星级数量 key字段
  starKeyList: ['score', 'describeStar', 'logisticsStar'],
  navigationBarTitle: '评价',
  // avatarUrl: null,
  imagesPath: IMGAGESPATH,
  avatarUrl: [],
  imageUrls: [],
  labels: [
    //     {
    //     id: 0,
    //     text: '花花很新鲜，包装很用心，非常满意！',
    //     select: false
    // }, {
    //     id: 1,
    //     text: '实物比图片还漂亮！超喜欢~',
    //     select: false
    // }, {
    //     id: 2,
    //     text: '绿植很精神，新鲜茁壮，值得推荐！',
    //     select: false
    // }, {
    //     id: 3,
    //     text: '品质很好很新鲜，配送快服务棒，五星好评',
    //     select: false
    // }, {
    //     id: 4,
    //     text: '养了几天了，状态很好，值得回购~',
    //     select: false
    // }
  ],
  submit: true,
  unSelect: IMGAGESPATH.iconUnevaluate,
  selected: IMGAGESPATH.iconEvaluate,
  inputText: '',
  goodsList: [],
  count: 5,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  evaluateKeyList: [], // 评论维度数据
})
function getEvaluateList() {
  systemService.query('commentStarConfig').then((res) => {
    if (res && res.length > 0 && res[0].value) {
      state.evaluateKeyList = res[0].value ? res[0].value.split(',') : []
    }
  })
}
function getLabelsList() {
  const self = this
  const labels = []
  systemService.query('commentSuggestions').then((res) => {
    if (res && res.length > 0 && res[0].value) {
      const labelKeys = res[0].value.split(',')
      // {
      //     id: 4,
      //     text: '养了几天了，状态很好，值得回购~',
      //     select: false
      //   }

      console.log(labelKeys, 'labelKeys')
      labelKeys.forEach((item, index) => {
        const obj = {
          id: index + 1,
          text: item,
          select: false,
        }
        labels.push(obj)
      })
      state.labels = labels
    }
    getOrderDetails()
  })
}
function choiceStars(val) {
  console.log(val)
  const idx = val.currentTarget.dataset.index
  const type = val.currentTarget.dataset.type
  const products = state.goodsList
  const num = val.currentTarget.dataset.goodsnum
  if (products[num][type] !== idx + 1) {
    products[num][type] = parseInt(idx + 1)
  } else {
    // 取消评价
    products[num][type] = 0
  }
  console.log(products)
  let tempStatus = true
  products.forEach((item) => {
    if (item.score === 0 || item.inputText === '') {
      tempStatus = false
    }
  })
  state.goodsList = products
  state.submit = tempStatus
}
function bindTextAreaInput(e) {
  console.log(e)
  const idx = e.currentTarget.dataset.goodsnum
  const products = state.goodsList
  products[idx].inputText = e.detail.value
  let tempStatus = true
  products.forEach((item) => {
    if (item.score === 0 || item.inputText === '') {
      tempStatus = false
    }
  })
  state.goodsList = products
  state.submit = tempStatus
}
function bindTextAreaBlur(e) {}
function chooseImage(val) {
  const that = this
  const idx = val.currentTarget.dataset.goodsnum
  const products = state.goodsList
  const count = state.count - countArr[idx] - products[idx].imageUrls.length
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
        const filePaths = products[idx].imageUrls
        countArr[idx] = tempFilePaths.length
        console.log(filePaths)
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
                products[idx].avatarUrl = filePaths
                products[idx].imageUrls = filePaths
                //   that.data.goodsList.forEach(item => {
                //     item.avatarUrl.forEach(urlObj => {
                //         selfA.getTemporaryUrl(urlObj.url)
                //         .then (att=>{
                //             urlObj.url1 = att;
                //             that.setData({
                //                 goodsList: that.data.goodsList
                //             })
                //         })
                //     })
                //   })
                state.goodsList = products
                countArr[idx] = countArr[idx] - 1
                uni.hideToast()
              },
              fail: function (e) {
                countArr[idx] = countArr[idx] - 1
                console.log(e.message)
              },
            })
          } else {
            countArr[idx] = countArr[idx] - 1
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
  const idx = val.currentTarget.dataset.goodsnum
  const products = state.goodsList
  products[idx].avatarUrl.del(index)
  state.goodsList = products
}
function clickLabels(val) {
  const that = this
  const products = state.goodsList
  const id = val.currentTarget.dataset.id
  const num = val.currentTarget.dataset.goodsnum
  products[num].labels.forEach((item, index) => {
    if (item.id === id) {
      if (item.select === false) {
        item = {
          ...item,
          select: true,
        }
      } else {
        item = {
          ...item,
          select: false,
        }
      }
      products[num].labels[index] = item
      state.goodsList = products
    }
  })
}
function toggleAnonymousReview() {
  state.anonymousReview = !state.anonymousReview
}
function getProductComments() {
  const that = this
  const products = state.goodsList
  const productComments = []
  products.forEach((item) => {
    let tempImageUrls = []
    const avatarUrl = item.avatarUrl
    const labels = JSON.parse(JSON.stringify(item.labels))
    const inputText = item.inputText ? item.inputText : '当前用户没有评价~'
    let tempText = ''
    labels.forEach((item) => {
      if (item.select) {
        if (tempText === '') {
          tempText = item.text
        } else {
          tempText = tempText + ',' + item.text
        }
      }
    })
    let tempData = {
      content: inputText,
      orderId: state.orderId,
      productId: item.productId,
      star: item.score,
      describeStar: item.describeStar,
      logisticsStar: item.logisticsStar,
      anonymousReview: state.anonymousReview ? 1 : 0,
    }
    // 有标签
    if (tempText !== '') {
      tempData = {
        ...tempData,
        content: tempText + ';' + tempData.content,
      }
    }
    // 有图片
    if (item.avatarUrl.length > 0) {
      tempImageUrls = avatarUrl
      tempData = {
        ...tempData,
        pictures: tempImageUrls,
      }
    }
    productComments.push(tempData)
  })
  return productComments
}
function submitComment() {
  const that = this
  if (!canSubmitComment) {
    console.log('已经在提交订单了~')
    return
  }
  canSubmitComment = false
  const postData = getProductComments()
  let count = 0
  postData.forEach((item) => {
    if (item.star !== 0) {
      count++
    }
  })
  if (count === postData.length) {
    commentService
      .create(postData)
      .then((res) => {
        console.log(res)
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
  } else {
    canSubmitComment = true
    uni.showToast({
      title: '请对商品做出评价~',
      icon: 'none',
      duration: 2000,
    })
  }
}
function getOrderDetails() {
  const orderId = state.orderId
  orderService.getDetailsByIdV2(orderId, true).then((res) => {
    const labels = state.labels
    const products = []
    const _countArr = []
    if (res.products && res.products.length > 0) {
      res.products.forEach((ele) => {
        const tempData = {
          ...ele,
          labels:
            ele.labels && ele.labels.length > 0
              ? JSON.parse(JSON.stringify(ele.labels))
              : JSON.parse(JSON.stringify(labels)),
          score: 5,
          describeStar: 5,
          logisticsStar: 5,
          avatarUrl: [],
          imageUrls: [],
          inputText: '',
        }
        for (let j = 0; j < labels.length; j++) {
          const item = labels[j]
          tempData.labels[j] = item
        }
        _countArr.push(0)
        products.push(tempData)
      })
      state.anonymousReview = res.products[0].anonymousReview === 1
    }
    countArr = _countArr
    state.goodsList = products
  })
}
onLoad(function (options) {
  uni.hideShareMenu()
  countArr = []
  if (options.orderId) {
    //   获取评价维度数据
    state.orderId = options.orderId
    getEvaluateList()
    getLabelsList()
    // this.getOrderDetails()
  }
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
  padding-bottom: 240rpx;
}
.evaluate-item {
  /* margin-bottom: 20rpx; */
  background: #ffffff;
  padding: 0 40rpx 30rpx;
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
  height: 75rpx;
  line-height: 75rpx;
  display: flex;
  align-items: center;
}
.stars-box text {
  font-size: 32rpx;
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
  min-height: 328rpx;
  background: #f1f1f1;
  position: relative;
  margin-top: 13rpx;
  padding-top: 31rpx;
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
  width: 600rpx;
  height: 210rpx;
  padding: 25rpx 31rpx 25rpx 31rpx;
  box-sizing: border-box;
  border-radius: 10rpx;
  border: 1rpx solid #dcdcdc;
  margin: 0 auto 0 auto;
  background: #ffffff;
  color: #8b8b8c;
  font-size: 28rpx;
  line-height: 36rpx;
}

.labels-box {
  padding: 20rpx 35rpx 4rpx 35rpx;
}

.labels-item {
  min-height: 60rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  line-height: 60rpx;
  display: inline-block;
  color: #8b8b8c;
  border: 1rpx solid #dcdcdc;
  background: #ffffff;
  margin: 7rpx 15rpx 7rpx 0;
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
  padding: 30rpx 0 0 0;
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
}

.evaluate-img-box > image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 10rpx;
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
.submit-img-box {
  width: 160rpx;
  height: 160rpx;
  border: 1rpx solid #dcdcdc;
  border-radius: 10rpx;
  box-sizing: border-box;
}
.evaluate-img-box .submit-img {
  width: 160rpx;
  height: 160rpx;
}

.button-box {
  height: 100rpx;
  width: 700rpx;
  position: fixed;
  bottom: 20rpx;
  left: 50%;
  margin-left: -350rpx;
  font-size: 32rpx;
  line-height: 100rpx;
  font-weight: bold;
  text-align: center;
  border-radius: 50rpx;
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
.hide-name {
  width: 100%;
  /* position: fixed;
    bottom: 0;
    left: 0; */
  font-size: 32rpx;
  line-height: 70rpx;
  border: none;
  height: 100rpx;
  color: #333;
  padding: 0 30rpx 30rpx;
  box-sizing: border-box;
  /* border-top: 1px solid #ddd; */
  font-size: 28rpx;
  /* background: #fff; */
  /* z-index: 99; */
}
.radio-hide {
  display: flex;
  align-items: center;
}
.radio-hide radio {
  transform-origin: center center;
  transform: scale(0.7);
}
</style>
