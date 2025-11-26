<template>
<!--pages/mallModule/liveplay/showList/showList.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="loading-box" :hidden="state.showPage">
  <loading></loading>
</view>

<view class="page-content" :hidden="!state.showPage" :style="'padding-bottom: ' + (state.showTabbar ? '100rpx' : '')">
  <view class="live-play-item" v-for="(item , index) in state.liveRoomList" :key="roomId" :data-id="item.roomId">
    <navigator :url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.roomId">
      <view class="title-box">
        <view class="left-box">
          <view class="title">{{item.name}}</view>
          <view class="time">
            <text>{{item.live_status_name}}</text>
          </view>
        </view>
      </view>
      <view class="live-play-image">
        <image :src="item.shareImg"></image>
      </view>
    </navigator>
    <view class="bottom-box">
      <subscribe :room-id="item.roomId" v-if="item.status === 'CREATED'"></subscribe>
      <view class="button-box" :style="'color: ' + state.theme.color + '; border-color: ' + state.theme.color" :data-roomid="item.roomId" @click.stop="clickShare">分享直播</view>
    </view>
  </view>
  <view class="no-data" :hidden="state.liveRoomList.length > 0">
    <image :src="state.imagesPath.imgNoData"></image>
  </view>
  <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
  <view class="no-more" :hidden="!state.noMore">已经全部加载完毕~</view>
</view>
<view class="poster-box" v-if="showPoster" @click="handlePosterCancel" @touchmove.stop="preventTouchMove">
  <view class="poster-box-bg">
    <view class="close-poster-box" @click.stop="handlePosterCancel">×</view>
    <view class="poster-picture-box" :style="isTeam || isSecKill ? 'height:888rpx;' : ''">
      <canvas canvas-id="pictureQRCanvas" :style="(isTeam || isSecKill ? 'height:888rpx' : '') + ';display: block;'"></canvas>
    </view>
    <button @click.stop="handleSaveToImg" class="saveImage" :style="'background: ' + state.theme.color">保存图片到相册</button>
    <text class="saveImageTips">分享海报时可到相册选取图片</text>
  </view>
</view>
<view class="home-back" @click="clickHomeBack" v-if="state.showPage && state.homeBack && !state.showTabbar">
  <image :src="state.imagesPath.livePlayHomeBack"></image>
</view>
<popup :show="state.show.bottom" position="bottom" custom-class="bottom" @close="toggleBottomPopup">
  <view class="share-box">
    <view class="title">分享</view>
    <view class="share-content-box">
      <view>
        <button open-type="share"></button>
        <image :src="state.imagesPath.livePlayShareLink" mode="widthFix" lazy-load="false"></image>
        <text>发送小程序链接</text>
      </view>
      <view @click="clickDrawsharingImage">
        <image :src="state.imagesPath.livePlayShareImage" mode="widthFix" lazy-load="false"></image>
        <text>生成图片海报</text>
      </view>
    </view>
    <view class="cancel" @click="toggleBottomPopup">取消</view>
  </view>
</popup>
<tabbar :tabbar="state.tabbar" :show="state.showTabbar"></tabbar>
</template>
<script setup>
import _utilsAuthJs from "@/utils/newretail/auth";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _apiLiveRoomServiceJs from "@/service/api/newretail/liveRoomService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import loading from '@/pages-sub/newretail/components/loading/loading.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
import tabbar from '@/pages-sub/newretail/components/tabbar/tabbar.vue';
const app = getApp();

// pages/mallModule/liveplay/showList/showList.js
const liveRoomService = _apiLiveRoomServiceJs;
const wxaUserService = _apiWxaUserServiceJs;
const request = _apiRequestJs;
const IMGAGESPATH = _utilsImagesPathJs;
const themeManager = _utilsThemeManagerJs;
const NAVPAGE = _utilsNavPageJs;
const UTILS = _utilsUtilsJs;
const auth = _utilsAuthJs;
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //  处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')';
  } else {
    return sColor;
  }
};
//获取应用实例
const state = reactive({
  navigationBarTitle: "直播广场",
  showPage: false,
  theme: themeManager,
  imagesPath: IMGAGESPATH,
  liveRoomList: [],
  page: 1,
  pageSize: 10,
  pageCount: 1,
  noMore: false,
  loading: false,
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    number: false
  },
  tabbar: {},
  showTabbar: false,
  homeBack: false
});
onLoad(function (_options) {
  const self = this;
  if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
    app.globalData.tabBar.list.forEach(item => {
      if (item.linkModel === 'live_room') {
        uni.hideTabBar();
        app.editTabbar();
        state.showTabbar = true;
      }
    });
  }
  state.theme = {
    color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + app.globalData.uiconfig.themeColor + ';' : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background: ' + app.globalData.uiconfig.themeColor + ';' : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';' : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background: linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background: linear-gradient(-270deg, #FF9F43, #F13327);",
    mainColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : "border-color:rgba(255,159,67, 0.4);",
    mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
    BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color:rgba(255,159,67, 0.1);"
  };
  state.themeColor = app.globalData.uiconfig.themeColor;
  let pageStack = getCurrentPages();
  if (pageStack.length === 1) {
    state.homeBack = true;
  }
  if (_options.scene) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    let scene = decodeURIComponent(_options.scene);
    if (scene.indexOf("gmparam:") >= 0) {
      let sceneArr = scene.split('gmparam:');
      const sceneId = sceneArr[1];
      wxaUserService.getSceneById(sceneId).then(res => {
        let shareArr = res.split('shareId=');
        const shareId = shareArr[1];
        uni.setStorageSync('wj_sharingId', shareId);
        console.log(shareId, '分享人id');
      });
    }
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId;
    try {
      uni.setStorageSync('wj_sharingId', shareId);
    } catch (e) {}
  }
  queryLiveRoom(state.page);
});
onReady(function () {});
onShow(function () {
  checkAuth();
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  console.log('我就想看看这个方法触发了没有');
  state.liveRoomList = [];
  state.mobile = '';
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  queryLiveRoom(1);
  // wx.stopPullDownRefresh();
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {
  // * this.data.pageSize
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    let page = state.page;
    ++page;
    queryLiveRoom(page);
  } else {
    // 没有下一页，提示已经查询完毕
    // if (this.data.rankingList.length > 0) {
    //   this.setData({
    //     noMore: true
    //   })
    // } else {

    // }
    uni.showToast({
      title: '没有更多数据~',
      icon: 'none',
      duration: 2000
    });
  }
});
onShareAppMessage(function (res) {
  const that = this;
  let path = "";
  let title = "";
  if (res.from === 'button') {
    title = currentLiveRoom.name;
    path = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${currentLiveRoom.roomId}`;
  } else {
    title = "直播广场";
    path = "/pages-sub/newretail/pages/mallModule/miniAppLiveplay/showList/showList";
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    path = path + "?shareId=" + app.globalData.userInfo.member.id;
  }
  return {
    title: title,
    path: path,
    imageUrl: res.from === 'button' ? currentLiveRoom.image : ""
  };
});
function queryLiveRoom(page) {
  const that = this;
  let opts = {
    page: page,
    pageSize: state.pageSize,
    statusIn: "CREATED,STARTED"
  };
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    opts.memberId = app.globalData.userInfo.member.id;
  }
  liveRoomService.query(opts).then(res => {
    let tempList = [];
    if (res && res.records.length > 0) {
      res.records.forEach(item => {
        let showBeginTime = "";
        let showEndTime = "";
        if (item.beginTime) {
          showBeginTime = timeToMonthDay(item.beginTime) + " " + timeDivision(item.beginTime);
        }
        if (item.endTime) {
          showEndTime = timeToMonthDay(item.endTime) + " " + timeDivision(item.endTime);
        }
        let live_status_name = '';
        if (item.status === 'CREATED') {
          live_status_name = '未开始';
        } else if (item.status === 'STARTED') {
          live_status_name = '直播中';
        } else if (item.status === 'FINISHED') {
          live_status_name = '直播已结束';
        } else {
          live_status_name = '该直播间不存在';
        }
        if (item.status == "CREATED" || item.status == "STARTED") {
          let tempItem = {
            ...item,
            showBeginTime: showBeginTime,
            showEndTime: showEndTime,
            live_status_name: live_status_name
          };
          tempList.push(tempItem);
        }
        // console.log(tempList,'268');
        function timeToMonthDay(time) {
          const timeArray = time.split(' ');
          const timeList = timeArray[0].split('-');
          const newTime = timeList[1] + '月' + timeList[2] + '日';
          return newTime;
        }
        function timeDivision(time) {
          const timeArray = time.split(' ');
          const timeSlot = timeArray[1].slice(0, 5);
          return timeSlot;
        }
      });
    }
    let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
    state.page = res.page;
    state.pageCount = pageCount;
    state.liveRoomList = state.liveRoomList.concat(tempList);
    if (!state.showPage) {
      state.showPage = true;
    }
    if (state.loading) {
      state.loading = false;
    }
  }).catch(err => {
    if (state.loading) {
      state.loading = false;
    }
    if (!state.showPage) {
      state.showPage = true;
    }
    UTILS.showToast(err.message);
  });
}
function checkAuth() {
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member;
      state.isMember = true;
    }
    state.hasUserInfo = true;
  }
}
function clickHomeBack() {
  NAVPAGE.toHome();
}
function clickShare(e) {
  console.log(e);
  let roomId = e.currentTarget.dataset.roomid;
  currentLiveRoom = null;
  for (let i = 0; i < state.liveRoomList.length; i++) {
    if (roomId === state.liveRoomList[i].roomId) {
      currentLiveRoom = state.liveRoomList[i];
      toggleBottomPopup();
      return;
    }
  }
}
function toggleBottomPopup() {
  toggle('bottom');
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function clickDrawsharingImage() {
  if (state.hasUserInfo && state.isMember) {
    // 关闭弹窗
    toggleBottomPopup();
    // 绘制分享图
    drawsharingImage();
  } else {
    NAVPAGE.toAuthorize();
  }
}
function drawsharingImage(e) {
  console.log(currentLiveRoom);
  const screenWidth = app.globalData.systemInfo.screenWidth;
  const rate = screenWidth / 375;
  state.showPoster = true;
  let self = this;

  // 获取到id为‘pictureQRCanvas’的canvas
  let ctx = uni.createCanvasContext("pictureQRCanvas");
  // 绘制背景
  ctx.setFillStyle('white');
  ctx.fillRect(0, 0, 300 * rate, 375 * rate);
  // ctx.draw(true)

  // 绘制上部分商品图片
  let sharePicture = currentLiveRoom.image.replace("http://", "https://");
  uni.getImageInfo({
    src: sharePicture,
    success(res) {
      // ctx.drawImage(image, dx, dy, dWidth, dHeight);
      ctx.drawImage(res.path, 0 * rate, 0 * rate, 300 * rate, 238 * rate);
      ctx.draw(true);
      console.log(res, "resres");
    },
    fail() {
      console.log("失败");
    }
  });

  // 绘制商品名称价格
  ctx.setFillStyle('black');
  ctx.font = 'normal bold 16px sans-serif';
  ctx.fillText(app.globalData.navigationBarTitleText, 108 * rate, 268 * rate);
  ctx.setFillStyle('grey');
  ctx.font = 'normal 16px sans-serif';
  ctx.fillText('邀请你一起参加活动', 108 * rate, 296 * rate);
  ctx.setFillStyle('gray');
  ctx.font = 'normal 10px sans-serif';
  ctx.fillText('长按识别小程序码', 108 * rate, 316 * rate);
  ctx.draw(true);

  // 获取小程序码
  let appid = request.APP_ID;
  let page = 'pages/mallModule/miniAppLiveplay/showList/showList';
  let scene = "";
  let width = parseInt(300 * rate);
  // 预售获取场景值
  let param = "";
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    param = "shareId=" + app.globalData.userInfo.member.id;
  }
  wxaUserService.createScene(appid, param).then(res => {
    scene = "gmparam:" + res;
    createSharePicture(appid, page, scene, width);
  }).catch(err => {
    console.log("分享图生产报错:", err.message);
    createSharePicture(appid, page, scene, width);
  });
  function createSharePicture(appid, page, scene, width) {
    uni.getImageInfo({
      src: request.BASE_URL + "/newretail/api/wxa/qrcode/create?appid=" + appid + "&page=" + page + "&scene=" + scene + "&size=" + width,
      success(res) {
        console.log(res, '二维码');
        ctx.drawImage(res.path, 16 * rate, 242 * rate, 90 * rate, 90 * rate);
        ctx.draw(true);
      },
      fail() {
        console.log(request.BASE_URL + "/newretail/api/wxa/qrcode/create?appid=" + appid + "&page=" + page + "&scene=" + scene + "&size=" + width, '失败');
      }
    });
  }
}
function handlePosterCancel(e) {
  state.showPoster = false;
}
function preventTouchMove(e) {}
function handleSaveToImg(e) {
  let self = this;
  let specialHeight = 0;
  if (state.isSecKill || state.isTeam) {
    specialHeight = 48;
  }
  const baseWidthUnit = 375; // 以iPhone6的分辨率为基准
  const systemInfo = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo()
  };
  const pixelRatio = systemInfo.pixelRatio;
  const windowWidth = systemInfo.windowWidth;
  const rate = windowWidth / baseWidthUnit; // 计算出当前设备分辨率与标准分辨率的比率
  let height = 375 * rate;
  const width = 300 * rate;
  let destHeight = height * pixelRatio;
  const destWidth = width * pixelRatio;
  uni.canvasToTempFilePath({
    x: 0,
    y: 0,
    width: width,
    height: height,
    destWidth: destWidth,
    destHeight: destHeight,
    fileType: "jpg",
    quality: 1,
    canvasId: 'pictureQRCanvas',
    success(res) {
      uni.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          // 隐藏海报显示
          state.showPoster = false;
          uni.showToast({
            title: '保存成功'
          });
        }
      });
    }
  });
}
</script>
<style scoped>
/* pages/mallModule/liveplay/showList/showList.wxss */
/* @import "../../../../common/common.wxss"; */

page {
  background: #f7f7f7;
}

.page-content {
  height: 100%;
}

.loading-box {
  width: 100%;
  height: 100vh;
}

.loading-box loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.title-box {
  padding-bottom: 24rpx;
  display: flex;
  justify-content: space-between;
}

.button-box {
  width: 120px;
  height: 41px;
  line-height: 41px;
  font-weight: 450;
  text-align: center;
  font-size: 17px;
  color: #8586B7;
  border-radius: 4px;
  pointer-events: auto;
  border: 1rpx solid #8586B7;
}

.title-box .button-box {
  margin-top: 24rpx;
}

.live-play-item {
  width: 654rpx;
  border-radius: 18rpx;
  background: #fff;
  margin: 26rpx auto;
  padding: 0 20rpx;
}

.left-box {
  display: flex;
  flex-direction: column;
  padding-top: 10rpx;
}

.left-box .title {
  font-size: 32rpx;
  line-height: 48rpx;
  font-weight: bold;
}

.left-box .time {
  display: flex;
  align-items: center;
  color: #eb3865;
  font-size: 24rpx;
  line-height: 44rpx;
}

.tv {
  width: 40rpx;
  height: 36rpx;
  margin-right: 12rpx;
}

.live-play-image {
  width: 654rpx;
  height: 523rpx;
  border-radius: 6rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.live-play-image image {
  width: 100%;
  height: 100%;
  background: #f1f1f1;
  border-radius: 6rpx;

}

.bottom-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}

.bottom-box .subscribe {
  width: 70rpx;
  height: 64rpx;
  border: 2rpx solid #848484;
  color: #848484;
  border-radius: 17rpx;
  font-size: 24rpx;
  line-height: 64rpx;
  text-align: center;
}

.no-more {
  width: 100%;
  tab-size: center;
  font-size: 24rpx;
  line-height: 40rpx;
  text-align: center;
  color: #7b7b7b;
}

.home-back {
  width: 70rpx;
  height: 70rpx;
  position: fixed;
  right: 30rpx;
  bottom: 10%;
}

.home-back image {
  width: 100%;
  height: 100%;
}

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50%;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #ffffff;
  border-radius: 0
}

.loading-btn::after {
  border: 0;
}

.share-box {
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  background: #ffffff;
  height: 533rpx;
  width: 100%;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.share-box .title {
  font-size: 28rpx;
  line-height: 48rpx;
  padding: 20rpx 0;
}

.share-content-box {
  display: flex;
  height: 325rpx;
}

.share-content-box>view {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.share-content-box>view button {
  position: absolute;
  background: transparent;
  border: none;
  width: 100%;
  height: 100%;
  left: 0;
  z-index: 3;
}

.share-content-box>view button::after {
  border: none;
}

.share-content-box>view image {
  width: 140rpx;
  height: 140rpx;
  margin-bottom: 28rpx;
}

.share-content-box>view text {
  font-size: 30rpx;
  line-height: 48rpx;
  color: #1d1d1d;
}

.cancel {
  width: 676rpx;
  height: 90rpx;
  background-color: #f8f8f8;
  font-size: 32rpx;
  line-height: 90rpx;
  color: #7f7f7f;
  border-radius: 45rpx;
  margin: 0 auto;
  text-align: center;
}

/* 分享朋友圈弹窗 */
.poster-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0rpx;
  left: 0rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 32rpx;
  overflow-y: scroll;
  z-index: 1;
}

.poster-box-bg {
  background: #fff;
  width: 100%;
  height: 75%;
  position: fixed;
  bottom: 0;
}


.close-poster-box {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
  color: #000;
}

.poster-picture-box {
  width: 600rpx;
  height: 700rpx;
  margin: 0 auto;
  margin-top: 48rpx;
  margin-bottom: 40rpx;
}

.poster-picture-box canvas {
  width: 600rpx;
  height: 700rpx;
  margin: 0 auto;
  border-radius: 10rpx;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

.poster-box .saveImage {
  width: 80%;
  height: 90rpx;
  background: #019f55;
  color: #fff;
  font-size: 34rpx;
  margin: 0 auto 8rpx auto;
  border-radius: 50rpx;
}

.poster-box .saveImageTips {
  font-size: 28rpx;
  color: #5B5B5B;
}
</style>