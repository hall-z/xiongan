<template>
<!-- pages/orderTrajectory/orderTrajectory.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<map class="map-box" id="map" :longitude="state.position.longitude" :latitude="state.position.latitude" :include-points="state.includePoints" :scale="state.scale" :markers="state.markers" @markertap="markertap" :polyline="state.polyline" @regionchange="regionchange">
  <cover-view class="close-box">
    <cover-image class="close-img" :src="state.imagesPath.iconTrajectoryClose" @click="handleClose">
  </cover-image></cover-view>
  <cover-view class="refresh-box" @click="refreshTrajectory">
    <cover-image class="refresh-img" :src="state.imagesPath.iconTrajectoryRefresh">
  </cover-image></cover-view>
  <cover-view class="cover-box">
    <cover-view class="title" v-if="state.deliveryStatus == 'WAITDISPATCH'">商家已接单</cover-view>
    <cover-view class="title" v-if="state.deliveryStatus == 'CREATE'">骑手到店取货中</cover-view>
    <cover-view class="title" v-if="state.deliveryStatus == 'SHIP'">骑手正在送货</cover-view>
    <cover-view class="content" v-if="state.deliveryStatus == 'WAITDISPATCH'">请您耐心等待~</cover-view>
    <cover-view class="content" v-if="state.deliveryStatus == 'CREATE' || state.deliveryStatus == 'SHIP'">由骑手{{riderName}}配送</cover-view>
    <cover-view class="button-box">
      <cover-view class="contact-button" @click="contactSeller">联系商家</cover-view>
      <cover-view class="contact-button" @click="contactRider" v-if="state.deliveryStatus == 'CREATE' || state.deliveryStatus == 'SHIP'">联系骑手</cover-view>
    </cover-view>
  </cover-view>
</map>
<!-- 根据用户头像生成画布-->
<canvas canvas-id="myCanvas" style="width:72px;height:97px;position:absolute;left:-99999rpx"></canvas>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/orderTrajectory/orderTrajectory.js
const orderService = _apiOrderServiceJs;
const utils = _utilsUtilsJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
let map;

//获取应用实例
const state = reactive({
  navigationBarTitle: "",
  imagesPath: IMGAGESPATH,
  position: {},
  scale: 18,
  markers: [],
  mapMarkers: [],
  polyline: [],
  includePoints: [],
  deliveryStatus: 'WAITDISPATCH',
  //WAITDISPATCH,CREATE, SHIP, RECEIVE, CANCELED, FAILD 
  sellerPhone: '',
  courierName: '',
  riderPhone: '',
  userAvatarUrl: ''
});
function regionchange(e) {
  console.log(e.type);
}
function markertap(e) {
  console.log(e.markerId);
}
onLoad(function (options) {
  console.log(options);
  const self = this;
  map = uni.createMapContext('map');
  console.log(map);
  if (options.location) {
    const location = JSON.parse(options.location);
    state.position = {
      latitude: location.store.latitude,
      longitude: location.store.longitude
    };
    console.log(location);
    getOrderLocation(location.store, location.user);
  } else {
    // 调用接口查询订单数据，获取用户及门店经纬度
  }
  state.riderName = options.courierName && options.courierName != 'undefined' ? options.courierName : '';
  state.riderPhone = options.courierPhone && options.courierPhone != 'undefined' ? options.courierPhone : '';
  if (options.store) {
    const store = JSON.parse(options.store);
    state.sellerPhone = store.tel;
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
function getOrderLocation(store, user) {
  const self = this;
  const systemInfo = app.globalData.systemInfo;
  let markers = [];
  let points = [];
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    drawAvatarUrl();
  }
  // 通过接口查询订单状态
  orderService.getRideLocation(options.orderId).then(res => {
    console.log(res);
    if (!res) {
      return false;
    }
    let longitude = store.longitude;
    longitude = parseFloat(longitude) - 0.002;
    let markersWidth = 110 / 750 * systemInfo.windowWidth,
      //设置图片显示宽度，
      markersHeight = 139 / 750 * systemInfo.windowWidth; //计算的高度值   
    // if (!res) {
    //   res = {
    //     deliveryStatus: 'SHIP', //WAITDISPATCH,CREATE, SHIP, RECEIVE, CANCELED, FAILD 
    //     lat: store.latitude,
    //     lng: longitude,
    //     url: ''
    //   }
    // }
    state.deliveryStatus = res.deliveryStatus;
    if (res.deliveryStatus === 'WAITDISPATCH' || res.deliveryStatus === 'CREATE') {
      // 标记门店位置
      console.log('WAITDISPATCH');
      let storeLocation = {
        iconPath: "http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/iconTrajectoryBusinessXf.png",
        id: 2,
        latitude: store.latitude,
        longitude: store.longitude,
        width: 72 / 750 * systemInfo.windowWidth,
        height: 97 / 750 * systemInfo.windowWidth,
        callout: {
          content: '商家已接单',
          bgColor: '#ffffff',
          display: 'ALWAYS',
          padding: 24 / 750 * systemInfo.windowWidth,
          borderRadius: 70,
          fontSize: 24 / 750 * systemInfo.windowWidth
        },
        zIndex: 0
      };
      markers.push(storeLocation);
      points.push({
        latitude: storeLocation.latitude,
        longitude: storeLocation.longitude
      });
    }
    if (res.deliveryStatus === 'CREATE' || res.deliveryStatus === 'SHIP' || res.deliveryStatus === 'RECEIVE') {
      // 标记用户位置
      let userLocation = {
        iconPath: state.userAvatarUrl ? state.userAvatarUrl : "http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/iconTrajectoryAvatarUrlDefault.png",
        id: 0,
        latitude: user.latitude,
        longitude: user.longitude,
        width: 72 / 750 * systemInfo.windowWidth,
        height: 97 / 750 * systemInfo.windowWidth,
        zIndex: 0
      };
      markers.push(userLocation);
      points.push({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });
      // 模拟配送员位置
      let distributorRider = {
        iconPath: res.lng > store.longitude ? "http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/iconTrajectoryDistributorRider1.png" : "http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/iconTrajectoryDistributorRider2.png",
        id: 1,
        latitude: res.lat,
        longitude: res.lng,
        width: markersWidth,
        height: markersHeight,
        callout: {
          content: '骑手到店取货中',
          bgColor: '#ffffff',
          display: 'ALWAYS',
          padding: 24 / 750 * systemInfo.windowWidth,
          borderRadius: 70,
          fontSize: 24 / 750 * systemInfo.windowWidth
        },
        zIndex: 2
      };
      if (res.deliveryStatus === 'CREATE') {
        distributorRider.callout.content = "骑手到店取货中";
      } else if (res.deliveryStatus === 'SHIP') {
        let cyclingDistance = util.getTripDist(res.lng, res.lat, user.longitude, user.latitude, self);
        cyclingDistance.then(res => {
          let distance = res.distance ? (res.distance * 1000).toFixed(2) : res.data.result.routes["0"].distance.toFixed(2);
          return distance;
        }).then(distance => {
          distributorRider.iconPath = res.lng > user.longitude ? "../../../../image/iconTrajectoryDistributorRider1.png" : "../../../../image/iconTrajectoryDistributorRider2.png";
          distributorRider.callout.content = "配送中 | 距您" + (distance / 1000).toFixed(1) + 'km';
          let tempMarkers = state.markers;
          let distributor = false;
          for (let i = 0; i < tempMarkers.length; i++) {
            const element = tempMarkers[i];
            if (element.id === 2) {
              tempMarkers[i] = distributorRider;
              distributor = true;
              break;
            }
          }
          if (distributor === false) {
            tempMarkers.push(distributorRider);
            points.push({
              latitude: distributorRider.latitude,
              longitude: distributorRider.longitude
            });
          }
          state.markers = tempMarkers;
          state.includePoints = points;
        });
      }
      markers.push(distributorRider);
      points.push({
        latitude: distributorRider.latitude,
        longitude: distributorRider.longitude
      });
    }
    console.log(markers);
    state.markers = markers;
    state.includePoints = points;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function drawAvatarUrl() {
  let that = this;
  let imgPath = app.globalData.userInfo.wxaUser.avatarUrl; //头像的图片
  uni.downloadFile({
    url: app.globalData.userInfo.wxaUser.avatarUrl,
    success(res) {
      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
      if (res.statusCode === 200) {
        imgPath = res.tempFilePath;
        let bgImgPath = 'http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/iconTrajectoryAvatarUrlBg.png'; //背景图
        let width = 72;
        let height = 97;
        const ctx = uni.createCanvasContext('myCanvas', this); //创建 canvas 绘图上下文
        ctx.drawImage(bgImgPath, 0, 0, width, height); //将背景图绘制到画布中
        //绘制头像，这里绘制圆形头像算是一个小重点
        ctx.save();
        ctx.beginPath();
        //首先绘制一个圆形的弧线，大小位置根据你的需求而定，也就是说你想让它放在什么位置，就让它放在什么位置
        ctx.arc(36, 36, 33, 0, 2 * Math.PI);
        //使用clip() 方法从原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
        ctx.clip();
        ctx.drawImage(imgPath, 3, 3, 65, 65);
        ctx.restore();
        ctx.draw(true);
        //将canvas画布转化为图片
        setTimeout(() => {
          uni.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 72,
            height: 97,
            destWidth: 72,
            destHeight: 97,
            canvasId: 'myCanvas',
            success: function (res) {
              console.log(res.tempFilePath);
              /* 这里 就可以显示之前写的 预览区域了 把生成的图片url给image的src */
              state.userAvatarUrl = res.tempFilePath;
              let markers = state.markers;
              if (markers.length > 0) {
                markers.forEach((item, index) => {
                  if (item.id === 0) {
                    item.iconPath = res.tempFilePath;
                  }
                });
              }
              state.imagePath = res.tempFilePath;
              state.markers = markers;
            },
            fail: function (res) {
              console.log(res);
            }
          });
        }, 200);
      }
    },
    fail(error) {
      console.log(error);
    }
  });
}
function refreshTrajectory() {
  state.scale = 18;
  state.markers = [];
  state.polyline = [];
  onLoad(options);
}
function handleClose() {
  uni.navigateBack({
    delta: 1
  });
}
function contactSeller() {
  const that = this;
  uni.showModal({
    title: '提示',
    content: '您将拨打以下电话联系卖家:' + state.sellerPhone,
    success(res) {
      if (res.confirm) {
        callPhone(state.sellerPhone);
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    }
  });
}
function contactRider() {
  const that = this;
  uni.showModal({
    title: '提示',
    content: '您将拨打以下电话联系骑手:' + state.riderPhone,
    success(res) {
      if (res.confirm) {
        callPhone(state.riderPhone);
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    }
  });
}
function callPhone(phone) {
  uni.makePhoneCall({
    phoneNumber: phone
  });
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
</script>
<style scoped>
/* pages/orderTrajectory/orderTrajectory.wxss */

page {
  height: 100%;
  width: 100%;
  position: absolute;
}

.map-box {
  height: 100%;
  width: 100%;
}

.close-box {
  width: 56rpx;
  height: 56rpx;
  position: fixed;
  top: 58rpx;
  left: 17rpx;
}

.close-img {
  width: 56rpx;
  height: 56rpx;
  line-height: 1;
}

.refresh-box {
  width: 92rpx;
  height: 92rpx;
  border-radius: 8rpx;
  /* background: #fff; */
  position: fixed;
  bottom: 316rpx;
  left: 16rpx;
}

.refresh-img {
  width: 92rpx;
  height: 92rpx;
  line-height: 1;
}

.cover-box {
  width: 708rpx;
  height: 280rpx;
  background: #fff;
  position: fixed;
  bottom: 20rpx;
  left: 21rpx;
  border-radius: 8rpx;
  padding: 24rpx 31rpx;
  box-sizing: border-box;
}

.cover-box .title {
  font-size: 38rpx;
  color: #333;
  line-height: 48rpx;
  margin-top: 24rpx;
}

.cover-box .content {
  font-size: 30rpx;
  color: #4a4a4a;
  line-height: 50rpx;
  margin-bottom: 41rpx;
}

.button-box {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.contact-button {
  border: 1px solid #c2c2c2;
  background: #fff;
  border-radius: 4rpx;
  width: 154rpx;
  height: 70rpx;
  font-size: 24rpx;
  color: #4a4a4a;
  line-height: 70rpx;
  margin: 0 22rpx 0 0;
  text-align: center;
}

</style>