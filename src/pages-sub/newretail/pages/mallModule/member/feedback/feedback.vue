<template>
<!--pages/mallModule/member/feedback/feedback.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content" v-if="state.type === 'normal'">
  <form @submit="formSubmit">
    <view class="feedback_type-box">
        <view>反馈类型</view>
        <picker mode="selector" @change="bindTypeChange" :value="feedbackType" :range="state.feedbackTypeRange">
            <view class="type-picker" v-if="state.feedbackTypeIndex">{{state.feedbackTypeRange[feedbackTypeIndex]}}</view>
            <view class="type-picker type-picker1" v-else>请选择反馈类型</view>
        </picker>
    </view>
    <view class="feedback-box">
      <textarea id="feedback" name="feedback" :focus="state.focus" placeholder="您的每一次反馈都是我们前进的动力" placeholder-class="placeholder" :value="state.feedback" maxlength="50" @input="handelTextArea"></textarea>
      <label for="feedback">{{state.wordCount}}/50</label>
    </view>
    <view class="image-box">
      <view class="image-item" v-for="(item , index) in state.feedbackImages" :key="index">
        <image :key="unique" :src="item.url" :data-id="index" @click="previewImage" mode="aspectFill"></image>
        <image class="close-icon" :data-id="index" @click="deleteImg" :src="state.imagesPath.iconEvaluateClose"></image>
      </view>
      <view class="image-item image-add" @click="chooseImage">
        <image :src="state.imagesPath.iconAddImg2"></image>
      </view>
    </view>
    <view class="btn-box">
      <button class="confirm" :style="'background: ' + state.themeColor" :disabled="state.disabled" form-type="submit">提交</button>
    </view>
  </form>
</view>
<view class="feedback-success" v-if="state.type === 'success'">
  <icon type="success" size="100" color="rgb(0,145,54)">
  <text class="success-tips">感谢您的反馈，我们会继续努力~</text>
  <button class="retuen-btn" :style="'background: ' + state.themeColor" @click="backPrePage">返回</button>
</icon></view>

</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiFeedbackServiceJs from "@/service/api/newretail/feedbackService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/member/feedback/feedback.js
const feedbackService = _apiFeedbackServiceJs;
const request = _apiRequestJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const selfA = _utilsSelfJs;
//获取应用实例
const state = reactive({
  feedbackTypeRange: ['功能异常', '订单相关', '新品需求', '优化建议'],
  feedbackTypeIndex: null,
  navigationBarTitle: "意见反馈",
  imagesPath: IMGAGESPATH,
  wordCount: 0,
  feedbackImages: [],
  feedback: '',
  type: 'normal',
  focus: false,
  disabled: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor')
});
onLoad(function (options) {
  uni.hideShareMenu();
  // 定义缓存图片列表
  // this.images = [];
  // 定义用户可以上传的图片总数
  count = 3;
  state.themeColor = app.globalData.uiconfig.themeColor;
  uploadingCount = 0;
  // 定义系统配置信息
  systemInfo = null;
  let systemInfoArr = Object.keys(app.globalData.systemInfo);
  if (systemInfoArr.length > 0) {
    if (app.globalData.systemInfo.model && app.globalData.systemInfo.model != null && app.globalData.systemInfo.model !== '') {
      systemInfo = app.globalData.systemInfo;
      console.log(systemInfo);
    } else {
      getSystemInfoSync();
    }
  } else {
    getSystemInfoSync();
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
function bindTypeChange(e) {
  state.feedbackTypeIndex = e.detail.value;
}
function getSystemInfoSync() {
  try {
    const res = {
      // ...wx.getSystemInfoSync(),
      ...uni.getSystemSetting(),
      ...uni.getAppAuthorizeSetting(),
      ...uni.getDeviceInfo(),
      ...uni.getWindowInfo(),
      ...uni.getAppBaseInfo()
    };
    app.globalData.systemInfo = res;
    systemInfo = res;
  } catch (e) {
    // Do something when catch error
  }
}
function handelTextArea(val) {
  if (val.detail.cursor <= 50) {
    state.feedback = val.detail.value;
    state.wordCount = val.detail.cursor;
    if (val.detail.cursor == 50) {
      uni.showToast({
        title: '反馈信息最多不超过50个字符哦~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    uni.showToast({
      title: '反馈信息最多不超过50个字符哦~',
      icon: 'none',
      duration: 2000
    });
  }
}
function chooseImage() {
  let that = this;
  let _count = count - uploadingCount - state.feedbackImages.length;
  if (_count > 0) {
    uni.chooseImage({
      count: _count,
      // 默认9
      sizeType: ['original', 'compressed'],
      // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        uni.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 200000
        });
        console.log(tempFilePaths);
        let filePaths = state.feedbackImages;
        uploadingCount = tempFilePaths.length;
        tempFilePaths.forEach((ele, index) => {
          if (res.tempFiles[index].size < 1024000) {
            uni.uploadFile({
              url: request.BASE_URL + '/newretail/api/dfs/upload',
              //仅为示例，非真实的接口地址
              filePath: ele,
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
                  console.log(tempData);
                  filePaths.push(tempData.data);
                  images = filePaths;
                  state.feedbackImages = filePaths;
                  uploadingCount = uploadingCount - 1;
                  uni.hideToast();
                  // selfA.getTemporaryUrl(tempData.data.url)
                  // .then(res => {
                  //     tempData.data.url1 = res;
                  //     // tempData.data.url = res;
                  //     filePaths.push(tempData.data)
                  //     that.images = filePaths
                  //     that.setData({
                  //       //将临时变量赋值给已经在data中定义好的变量
                  //       feedbackImages: filePaths
                  //     })
                  //     that.uploadingCount = that.uploadingCount - 1
                  //     wx.hideToast()
                  // })
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
                uploadingCount = uploadingCount - 1;
                console.log(e.message);
              }
            });
          } else {
            uploadingCount = uploadingCount - 1;
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
    if (uploadingCount) {
      uni.showToast({
        title: '还有' + uploadingCount + '张图片在上传中哦，请稍后~',
        icon: 'none',
        duration: 2000
      });
    } else {
      uni.showToast({
        title: '最多只能上传' + count + '张哦~',
        icon: 'none',
        duration: 2000
      });
    }
  }
}
function deleteImg(val) {
  Array.prototype.del = function (index) {
    if (isNaN(index) || index >= this.length) {
      return false;
    }
    for (let i = 0, n = 0; i < this.length; i++) {
      if (this[i] != this[index]) {
        this[n++] = this[i];
      }
    }
    this.length -= 1;
  };
  const index = val.currentTarget.dataset.id;
  const images = state.feedbackImages;
  images.del(index);
  // this.images = images
  state.feedbackImages = images;
}
function formSubmit(e) {
  const self = this;
  state.disabled = true;
  if (state.feedback !== '' && state.feedbackTypeIndex !== null) {
    let feedbackText = state.feedback;
    let imagesUrls = [];
    state.feedbackImages.forEach(item => {
      imagesUrls.push(item.url);
    });
    let postData = {
      advice: feedbackText,
      appVersion: request.APP_VERSION,
      source: 'WX_XCX',
      feedbackType: state.feedbackTypeRange[state.feedbackTypeIndex]
    };
    if (systemInfo == null) {
      getSystemInfoSync();
    }
    if (systemInfo.version && systemInfo.version != null && systemInfo.version !== '') {
      let version = systemInfo.version + '-' + request.APP_VERSION;
      postData = {
        ...postData,
        appVersion: version
      };
    }
    if (systemInfo.model && systemInfo.model != null && systemInfo.model !== '') {
      postData = {
        ...postData,
        phoneBrand: systemInfo.model
      };
    }
    if (imagesUrls.length > 0) {
      postData = {
        ...postData,
        imageUrls: imagesUrls
      };
    }
    feedbackService.create(postData).then(res => {
      state.type = "success";
      state.disabled = false;
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
      state.disabled = false;
    });
  } else {
    if (state.feedbackTypeIndex === null) {
      uni.showToast({
        title: '请选择反馈类型~',
        icon: 'none',
        duration: 2000
      });
    } else {
      uni.showToast({
        title: '反馈信息不能为空哦~',
        icon: 'none',
        duration: 2000
      });
    }
    state.focus = true;
    state.disabled = false;
  }
}
function backPrePage() {
  uni.navigateBack({
    delta: 1
  });
}
function previewImage(e) {
  let urls = [];
  state.feedbackImages.forEach(item => {
    urls.push(item.url);
  });
  const urlIndex = e.currentTarget.dataset.id;
  uni.previewImage({
    current: urls[urlIndex],
    // 当前显示图片的http链接
    urls: urls
  });
}
</script>
<style scoped>
/* pages/mallModule/member/feedback/feedback.wxss */

.content {
  padding: 60rpx 40rpx 0 40rpx;
}

.feedback-box {
  position: relative;
}
.feedback_type-box {
    padding: 20rpx 43rpx;
    background: #f1f1f1;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    border-radius: 6rpx;
    font-size: 28rpx;
}
.feedback_type-box picker {
    flex: 1 0 auto;
    text-align: right;
}
.feedback_type-box .type-picker1 {
    color: #8b8b8c;
}
.feedback-box textarea {
  width: calc(100% - 86rpx);
  height: 240rpx;
  background: #f1f1f1;
  border-radius: 6rpx;
  font-size: 28rpx;
  color: #8b8b8c;
  line-height: 48rpx;
  padding: 30rpx 43rpx;
}

.placeholder {
  line-height: 99rpx;
}

.feedback-box label {
  font-size: 28rpx;
  line-height: 48rpx;
  color: #8b8b8c;
  position: absolute;
  right: 42rpx;
  bottom: 30rpx;
}

.image-box {
  display: flex;
  justify-content: flex-start;
  margin-top: 10rpx;
  flex-wrap: wrap;
}

.image-item {
  width: 210rpx;
  height: 210rpx;
  margin: 20rpx 20rpx 0 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-add{
  background: #F1F1F1;
  border-radius: 6rpx;
}

.image-item image {
  width: 100%;
  height: 100%;
  border-radius: 6rpx;
}

.image-item image.close-icon {
  height: 32rpx;
  width: 32rpx;
  position: absolute;
  right: -16rpx;
  top: -16rpx;
  z-index: 8;
}

.image-item:nth-of-type(3n) {
  margin-right: 0;
}

.btn-box {
  width: 100%;
  height: 100rpx;
  margin-top: 34rpx;
  display: flex;
}

.btn-box button {
  flex: 1;
  box-sizing: border-box;
  border: 0;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 100rpx;
  border-radius: 100rpx;
}

.btn-box button::after {
  border: 0;
}

.btn-box button.cancel {
  border-radius: 6rpx 0rpx 0rpx 6rpx;
  border: 1rpx solid #009f55;
  background: #fff;
  color: #8b8b8c;
}

.btn-box button.confirm {
  border-radius: 100rpx;
  background: #009f55;
  color: #fff;
}

.feedback-success {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.feedback-success icon {
  margin-top: 280rpx;
}

.success-tips {
  font-size: 32rpx;
  line-height: 92rpx;
  color: #454545;
  margin: 36rpx 0 48rpx 0;
}

.retuen-btn {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  width: 325rpx;
  height: 100rpx;
  line-height: 100rpx;
  background: #009f55;
  border-radius: 6rpx;
  text-align: center;
  letter-spacing: 50rpx;
  text-indent: 50rpx;
}
</style>