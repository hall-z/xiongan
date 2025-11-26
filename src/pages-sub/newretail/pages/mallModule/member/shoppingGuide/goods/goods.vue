<template>
<navigationBar :title="state.navigationBarTitle"></navigationBar>

<view class="container" v-if="!state.loading && !state.loadingOrdinary && !state.loadingPromotion">
  <!-- 导购数据 -->
  <!-- <view class="marketing-data">
    <view class="item">
      <text>{{state.shareOrderReport.shareCount}}</text>
      <text>分享次数(次)</text>
    </view>
    <view class="item">
      <text>{{state.shareOrderReport.shareOrderCount}}</text>
      <text>成单量(单)</text>
    </view>
    <view class="item">
      <text>{{state.shareOrderReport.shareOrderAmount}}</text>
      <text>累计收益(元)</text>
    </view>
  </view> -->
  <!-- 导购商品 -->
  <view class="product-block">
    <view class="block-title" v-if="state.promotionPro.length > 0">带货促销品</view>
    <view class="product-item" v-for="(item , index) in state.promotionPro" :key="id" :data-item="item" @click="sharePromotion">
      <!-- <button open-type='share'></button> -->
      <view class="image-box">
        <image :src="item.promotionType === 'teamBuy' ? item.productPicture : item.imageUrl" mode="widthFix"></image>
      </view>
      <view class="product-info">
        <view class="name">
          <text :class="'promotion-type ' + (item.promotionType === 'teamBuy' ? 'team-tag' : 'seckill-tag')">
            {{item.promotionType === 'teamBuy' ? '拼团' : '秒杀'}}
          </text>
          {{item.promotionType === 'teamBuy' ? item.name : item.productName}}
        </view>
        <view class="commission">
          <view class="commission-rate">
            <text>佣金</text>
            {{item.backCashRate * 100 + '%'}}
          </view>
          <view>预计￥{{item.commission}}</view>
        </view>
        <view class="price">
          {{item.promotionType === 'teamBuy' ? '拼团价：￥' : '秒杀价：￥'}}
          <text>{{item.promotionType === 'teamBuy' ? item.teamMemberPrice : item.price}}</text>
        </view>
        <view class="share">
          <view>
            <image mode="widthFix" :src="state.imagesPath.iconShare"></image>
            赚<text>￥</text>{{item.commission}}
          </view>
        </view>
      </view>
    </view>
    <view class="block-title" v-if="state.product.length > 0">带货普通品</view>
    <view class="product-item" v-for="(item , index) in state.product" :key="id" :data-item="item" @click="sharePromotion">
      <!-- <button open-type='share'></button> -->
      <view class="image-box">
        <image :src="item.imageUrl" mode="widthFix"></image>
      </view>
      <view class="product-info">
        <view class="name">
          {{item.name}}
        </view>
        <view class="commission">
          <view class="commission-rate">
            <text>佣金</text>
            {{item.backCashRate * 100 + '%'}}
          </view>
          <view>预计￥{{item.commission}}</view>
        </view>
        <view class="price">
          零售价：￥<text>{{item.sellPrice}}</text>
        </view>
        <view class="share">
          <view>
            <image mode="widthFix" :src="state.imagesPath.iconShare"></image>
            赚<text>￥</text>{{item.commission}}
          </view>
        </view>
      </view>
    </view>
  </view>
</view>
<view class="content-box" v-if="state.loading || state.loadingOrdinary || state.loadingPromotion">
  <view class="spinner">
    <view class="rect1" :style="state.theme.mainBgColor"></view>
    <view class="rect2" :style="state.theme.mainBgColor"></view>
    <view class="rect3" :style="state.theme.mainBgColor"></view>
    <view class="rect4" :style="state.theme.mainBgColor"></view>
    <view class="rect5" :style="state.theme.mainBgColor"></view>
  </view>
</view>

<view class="bottom-pop" :hidden="state.showSharePop" @click="handleSharePopCancel" @touchmove.stop="ture">
  <view class="bottom-pop-main" :animation="state.animationData">
    <view class="share-type-box">
      <view class="share-wx">
        <image :src="state.imagesPath.iconWX"></image>
        <text>分享给好友</text>
        <button open-type="share"></button>
      </view>
      <view class="share-circle" @click="handleShareTimeline">
        <image :src="state.imagesPath.iconFriendsCircle"></image>
        <text>发朋友圈</text>
      </view>
    </view>
    <view class="cancel" @click="handleSharePopCancel">取消</view>
  </view>
</view>

<view class="poster-box" v-if="state.showPoster" @click="handlePosterCancel" @touchmove.stop="ture">
  <view class="poster-box-bg">
    <view class="poster-box-content">
      <view class="close-poster-box" @click.stop="handlePosterCancel">×</view>
      <canvas canvas-id="pictureQRCanvas" style="height: 1000rpx;"></canvas>
      <!-- <view class="poster-picture-box">
      </view> -->
      <view class="saveImage">
        <button @click.stop="handleSaveToImg" :style="'background: ' + state.themeColor">保存图片到相册</button>
      </view>
      <view class="saveImageTips">分享海报时可到相册选取图片</view>
    </view>
  </view>
</view>
</template>
<script setup>
import _utilsAddressJs from "@/utils/newretail/address";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _apiRequestJs from "@/service/api/newretail/request";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _apiBackCashServiceJs from "@/service/api/newretail/backCashService";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiSeckillServiceJs from "@/service/api/newretail/seckillService";
import _apiTeamBuyServiceJs from "@/service/api/newretail/teamBuyService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
// import { onLoad, onShow, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

const productService = _apiProductServiceJs;
const teamBuyService = _apiTeamBuyServiceJs;
const seckillService = _apiSeckillServiceJs;
const util = _utilsUtilsJs;
const orderService = _apiOrderServiceJs;
const backCashService = _apiBackCashServiceJs;
const themeManager = _utilsThemeManagerJs;
const IMGAGESPATH = _utilsImagesPathJs;
const request = _apiRequestJs;
const wxaUserService = _apiWxaUserServiceJs;
const ADDRESS = _utilsAddressJs;
let ctx = null;
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
const state = reactive({
  navigationBarTitle: '带货商品',
  storeInfo: null,
  product: [],
  // 普通导购商品
  promotionPro: [],
  // 导购促销商品
  member: {},
  apply: null,
  // 带货达人申请信息
  loading: true,
  loadingOrdinary: true,
  loadingPromotion: true,
  theme: themeManager,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  shareOrderReport: {
    shareCount: '*',
    shareOrderCount: '*',
    shareOrderAmount: '*',
    storeId: ''
  },
  animationData: {},
  showSharePop: true,
  imagesPath: IMGAGESPATH,
  currentProduct: null,
  showPoster: false
});
onLoad(function () {
  if (app.globalData.storeInfo) {
    state.storeInfo = app.globalData.storeInfo;
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
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member;
    }
  }
});
onShow(function () {
  uni.hideShareMenu();
  getGuiderStore();
});
function getGuiderStore() {
  backCashService.getTask(state.member.id).then(res => {
    if (res && res.apply && res.apply.storeId) {
      queryShareOrderReport(res.apply.storeId);
      getTeamBuyProduct(res.apply.storeId);
      getSeckillProduct(res.apply.storeId);
      getBackCashProduct(res.apply.storeId);
    } else {
      queryShareOrderReport(state.storeInfo.id);
      getTeamBuyProduct(state.storeInfo.id);
      getSeckillProduct(state.storeInfo.id);
      getBackCashProduct(state.storeInfo.id);
    }
  }).catch(err => {
    console.log("查询导购任务出错：" + err.message);
  });
}
function queryShareOrderReport(storeId) {
  orderService.getOrderReport(1, 0, storeId).then(res => {
    state.loading = false;
    console.log(res);
    if (res && res.records && res.records.length > 0) {
      state.shareOrderReport.shareCount = res.records[0].shareCount !== null ? res.records[0].shareCount : '*';
      state.shareOrderReport.shareOrderAmount = res.records[0].shareOrderAmount !== null ? res.records[0].shareOrderAmount : '*';
      state.shareOrderReport.shareOrderCount = res.records[0].shareOrderCount !== null ? res.records[0].shareOrderCount : '*';
    }
  }).catch(err => {
    state.loading = false;
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getBackCashProduct(storeId) {
  const postData = {
    isBackCash: true,
    storeIdEquals: storeId ? storeId : null,
    page: 1,
    pageSize: 0
  };
  productService.query(postData).then(res => {
    console.log(res);
    let product = [];
    res.records.forEach(item => {
      product.push({
        ...item,
        commission: (item.sellPrice * item.backCashRate).toFixed(2)
      });
    });
    state.loadingOrdinary = false;
    state.product = product;
  }).catch(err => {
    state.loadingOrdinary = false;
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getTeamBuyProduct(storeId) {
  const that = this;
  let storeIdIn = [storeId];
  ADDRESS.getDistributionStore().then(res => {
    if (res) {
      storeIdIn.push(res.id);
    }
    handleTeamBuyProduct(storeIdIn);
  }).catch(err => {
    handleTeamBuyProduct(storeIdIn);
  });
}
function handleTeamBuyProduct(storeIdIn) {
  teamBuyService.query({
    page: 1,
    pageSize: 0,
    searchCount: true,
    // orgIdIn: storeIdIn.join(","),
    storeIds: storeIdIn.join(","),
    status: 'STARTED'
  }).then(res => {
    state.loadingPromotion = false;
    if (res) {
      let tempTeamBuy = [];
      res.records.forEach(item => {
        if (item.backCashRate) {
          tempTeamBuy.push({
            ...item,
            promotionType: 'teamBuy',
            commission: (item.teamMemberPrice * item.backCashRate).toFixed(2)
          });
        }
      });
      state.promotionPro = state.promotionPro.concat(tempTeamBuy);
    }
  }).catch(err => {
    state.loadingPromotion = false;
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getSeckillProduct(storeId) {
  const self = this;
  let storeIdIn = [storeId];
  ADDRESS.getDistributionStore().then(res => {
    if (res) {
      storeIdIn.push(res.id);
    }
    querySeckillProduct(storeIdIn);
  }).catch(err => {
    querySeckillProduct(storeIdIn);
  });
}
function querySeckillProduct(storeIdIn) {
  // 查询正在进行中的秒杀活动
  const self = this;
  let date = new util.ResponseDate();
  let tempDate = util.formatTime(date);
  let tomorrow = addDay(new util.ResponseDate().getTime(), 1);
  let tomorrowDate = util.formatTime(tomorrow);
  let dateString = tempDate.split(' ')[0].replace(/\//g, '-');
  let endDateString = tomorrowDate.split(' ')[0].replace(/\//g, '-');
  const postData = {
    orgIdIn: storeIdIn ? storeIdIn.join(",") : null,
    startDate: dateString + " 00:00:00",
    endDate: endDateString + " 23:59:59"
  };
  let actDateInterval = ''; // 活动日期区间
  let actTimeInterval = ''; // 活动时间区间
  // 查询秒杀活动
  seckillService.query(postData).then(res => {
    res.forEach(el => {
      // 查询秒杀商品
      let tempData = {
        activityIdEquals: el.id
      };
      if (storeIdIn.length > 0) {
        storeIdIn.forEach((ele, index) => {
          tempData[`orgIdIn[${index}]`] = ele;
        });
      }
      actDateInterval = el.startDate.substr(0, 10) + '~' + el.endDate.substr(0, 10);
      actTimeInterval = el.startTime.substr(11, 19) + '~' + el.endTime.substr(11, 19);
      let tempSeckill = [];
      seckillService.queryProduct(tempData).then(res => {
        res.forEach(item => {
          if (item.backCashRate && item.storeBalance > 0 && item.storeStatus !== 'DELETED') {
            tempSeckill.push({
              ...item,
              promotionType: 'seckill',
              actDateInterval: actDateInterval,
              actTimeInterval: actTimeInterval,
              commission: (item.price * item.backCashRate).toFixed(2)
            });
          }
        });
        state.promotionPro = state.promotionPro.concat(tempSeckill);
        state.loadingPromotion = false;
      }).catch(err => {
        state.loadingPromotion = false;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    });
  }).catch(err => {
    state.loadingPromotion = false;
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function addDay(curDate, days) {
  return new Date((curDate / 1000 + 86400 * days) * 1000);
}
function sharePromotion(e) {
  console.log(e);
  state.showSharePop = false;
  state.currentProduct = e.currentTarget.dataset.item;
  let animation = uni.createAnimation({
    duration: 300
  });
  animation.translateY(-140).step();
  state.animationData = animation;
}
onShareAppMessage(function () {
  let path = 'pages/mallModule/goods/goodsDetail/goodsDetail';
  let shared = state.currentProduct;
  if (shared.promotionType === 'teamBuy') {
    path += `?productId=${shared.id}&storeId=${state.storeInfo.id}&type=group&shareId=${state.member.id}`;
  } else if (shared.promotionType === 'seckill') {
    path += `?productId=${shared.productId}&storeId=${state.storeInfo.id}&type=secondkill&shareId=${state.member.id}&activityId=${shared.activityId}`;
  } else {
    path += `?productId=${shared.id}&type=normal&shareId=${state.member.id}`;
  }
  return {
    title: shared.name || shared.productName,
    path: path,
    imageUrl: shared.productPicture || shared.imageUrl
  };
});
function handleSharePopCancel(e) {
  let animation = uni.createAnimation({
    duration: 300
  });
  animation.translateY(0).step();
  state.animationData = animation;
  setTimeout(function () {
    this.setData({
      showSharePop: true
    });
  }.bind(this), 300);
}
function handleShareTimeline() {
  const self = this;
  state.showPoster = true;
}
function drawPoster() {
  // 获取到id为‘pictureQRCanvas’的canvas
  ctx = uni.createCanvasContext("pictureQRCanvas");
  const screenWidth = app.globalData.systemInfo.screenWidth;
  const rate = screenWidth / 375;
  let shared = state.currentProduct;
  const self = this;

  // 绘制背景
  ctx.setFillStyle('white');
  ctx.fillRect(0, 0, 300 * rate, 500 * rate);
  console.log('logo图：' + state.imagesPath.promotionShareTitle);

  // 绘制logo和头部文字
  uni.getImageInfo({
    src: state.imagesPath.promotionShareTitle,
    success(res) {
      console.log('getImageInfo success====' + res.path);
      ctx.drawImage(res.path, 15 * rate, 15 * rate, 45 * rate, 45 * rate);
      ctx.draw(true);
    },
    fail(err) {
      console.log('getImageInfo fail====' + err);
    }
  });
  // 绘制头部文字
  ctx.setFillStyle('black');
  ctx.font = 'normal 14px sans-serif';
  ctx.fillText('为每个顾客带来更好的购物体验', 70 * rate, 43 * rate);
  // ctx.draw(true);
  // 绘制商品图
  uni.getImageInfo({
    src: shared.promotionType === 'teamBuy' ? shared.productPicture : shared.imageUrl,
    success(res) {
      console.log('获取商品图imageInfo success ====' + res.path);
      ctx.drawImage(res.path, 15 * rate, 75 * rate, 270 * rate, 270 * rate);
      ctx.draw(true);
    },
    fail(err) {
      console.log('获取商品图imageInfo fail ====' + err);
    }
  });
  // 绘制商品描述信息
  drawProductInfo();
  function drawProductInfo() {
    if (shared.promotionType === 'teamBuy') {
      ctx.setFillStyle('red');
      ctx.font = 'normal 12px sans-serif';
      ctx.fillText('活动截止时间' + shared.endTime, 15 * rate, 375 * rate);
      ctx.setFillStyle('#000000');
      ctx.font = 'normal bold 14px sans-serif';

      // 商品名称
      util.dealWords({
        ctx: ctx,
        //画布上下文
        fontSize: 14 * rate,
        //字体大小
        word: `【${util.numberConversion.numberToChinese(shared.teamMemberCount)}人团】拼团价￥${shared.teamMemberPrice}${shared.originalPrice ? '原价￥' + shared.originalPrice : ''}${shared.productName}`,
        //需要处理的文字
        maxWidth: 175 * rate,
        //一行文字最大宽度
        x: 15 * rate,
        //文字在x轴要显示的位置
        y: 390 * rate,
        //文字在y轴要显示的位置
        maxLine: 2 //文字最多显示的行数
      });

      // 活动价格
      ctx.setFillStyle('#666666');
      ctx.font = 'normal 12px sans-serif';
      ctx.fillText('拼团价：', 15 * rate, 480 * rate);
      ctx.setFillStyle('red');
      ctx.font = 'normal 14px sans-serif';
      ctx.fillText(`￥${shared.teamMemberPrice}`, 60 * rate, 480 * rate);
      ctx.setFillStyle('#666666');
      ctx.font = 'normal 12px sans-serif';
      ctx.fillText(`${shared.originalPrice ? '￥' + shared.originalPrice : ''}`, 110 * rate, 480 * rate);
      ctx.setStrokeStyle('#8b8b8c');
      ctx.moveTo(110 * rate, 475 * rate);
      ctx.lineTo(150 * rate, 475 * rate);
      ctx.stroke();
    } else if (shared.promotionType === 'seckill') {
      // 活动时间
      ctx.setFillStyle('red');
      ctx.font = 'normal 12px sans-serif';
      ctx.fillText('活动时间', 15 * rate, 360 * rate);
      ctx.fillText(shared.actDateInterval + ' ' + shared.actTimeInterval, 15 * rate, 375 * rate);
      ctx.setFillStyle('#000000');
      ctx.font = 'normal bold 14px sans-serif';

      // 商品名称
      util.dealWords({
        ctx: ctx,
        //画布上下文
        fontSize: 14 * rate,
        //字体大小
        word: `【限时秒杀】秒杀价￥${shared.price}${shared.sellPrice ? '原价￥' + shared.sellPrice : ''}${shared.productName}`,
        //需要处理的文字
        maxWidth: 175 * rate,
        //一行文字最大宽度
        x: 15 * rate,
        //文字在x轴要显示的位置
        y: 390 * rate,
        //文字在y轴要显示的位置
        maxLine: 2 //文字最多显示的行数
      });

      // 活动价格
      ctx.setFillStyle('#666666');
      ctx.font = 'normal 12px sans-serif';
      ctx.fillText('秒杀价：', 15 * rate, 480 * rate);
      ctx.setFillStyle('red');
      ctx.font = 'normal 14px sans-serif';
      ctx.fillText(`￥${shared.price}`, 60 * rate, 480 * rate);
      ctx.setFillStyle('#666666');
      ctx.font = 'normal 12px sans-serif';
      ctx.fillText(`${shared.sellPrice ? '￥' + shared.sellPrice : ''}`, 110 * rate, 480 * rate);
      ctx.setStrokeStyle('#8b8b8c');
      ctx.moveTo(110 * rate, 475 * rate);
      ctx.lineTo(150 * rate, 475 * rate);
      ctx.stroke();
    } else {
      ctx.setFillStyle('#000000');
      ctx.font = 'normal bold 14px sans-serif';
      ctx.fillText(shared.name, 15 * rate, 390 * rate);
      ctx.setFillStyle('#666666');
      ctx.font = 'normal 12px sans-serif';
      ctx.fillText('零售价：', 15 * rate, 480 * rate);
      ctx.setFillStyle('red');
      ctx.font = 'normal 14px sans-serif';
      ctx.fillText(`￥${shared.sellPrice}`, 60 * rate, 480 * rate);
    }
    ctx.draw();
  }

  // 获取小程序码
  let appid = request.APP_ID;
  let page = 'pages/mallModule/goods/goodsDetail/goodsDetail';
  let productId = shared.promotionType === 'seckill' ? shared.productId : shared.id;
  let type = '';
  if (shared.promotionType === 'seckill') {
    type = 'secondkill';
  } else if (shared.promotionType === 'teamBuy') {
    type = 'group';
  } else {
    type = 'normal';
  }
  let scene = productId + ',' + type;
  let width = parseInt(300 * rate);
  if (shared.promotionType === 'seckill') {
    let param = "productId=" + shared.productId + "&activityId=" + shared.activityId + "&type=secondkill";
    wxaUserService.createScene(appid, param).then(res => {
      scene = "gmparam:" + res;
      createSharePicture(appid, page, scene, width);
    });
  } else {
    createSharePicture(appid, page, scene, width);
  }
  function createSharePicture(appid, page, scene, width) {
    uni.getImageInfo({
      src: request.BASE_URL + "/newretail/api/wxa/qrcode/create?appid=" + appid + "&page=" + page + "&scene=" + scene + "&size=" + width,
      success(res) {
        ctx.drawImage(res.path, 200 * rate, 390 * rate, 90 * rate, 90 * rate);
        // 绘制提示文字
        ctx.setFillStyle('#666666');
        ctx.font = 'normal 12px sans-serif';
        ctx.fillText('长按识别小程序码', 200 * rate, 480 * rate);
        ctx.draw(true);
      }
    });
  }
}
function handlePosterCancel(e) {
  state.showPoster = false;
}
function handleSaveToImg() {
  const self = this;
  const baseWidthUnit = 375; // 以iPhone6的分辨率为基准
  const windowWidth = uni.getSystemInfoSync().windowWidth;
  const rate = windowWidth / baseWidthUnit; // 计算出当前设备分辨率与标准分辨率的比率

  uni.canvasToTempFilePath({
    x: 0,
    y: 0,
    width: 300 * rate,
    height: 500 * rate,
    destWidth: 1200 * 2 * rate,
    destHeight: 1800 * 2 * rate,
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
/* page {
  position: fixed;
  overflow: hidden;
} */

.container {
  padding: 0;
}

.marketing-data {
  height: 146rpx;
  background-color: #282633;
  padding: 40rpx 60rpx 25rpx 60rpx;
  display: flex;
  justify-content: space-around;
}

.marketing-data .item {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.marketing-data .item text {
  display: block;
  color: #FEF0F0;
  font-size: 24rpx;
  line-height: 70rpx;
}

.marketing-data .item text:nth-child(1) {
  font-size: 36rpx;
  color: #0BD8B4;
}

/* 商品 */
.product-block {
  padding: 20rpx;
  background: #f0f3f7;
  text-align: left;
}

.product-block .block-title {
  font-size: #282633;
  font-size: 36rpx;
  line-height: 90rpx;
}

.product-item {
  height: 253rpx;
  background: #fff;
  margin-bottom: 30rpx;
  border-radius: 16px;
  padding: 20rpx;
  display: flex;
  position: relative;
}

.product-item button {
  background: transparent;
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
}

.product-item button:after {
  border: none;
}

.product-item .image-box {
  width: 196rpx;
  height: 196rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-item image {
  width: 196rpx;
  /* height: 196rpx; */
  margin-right: 26rpx;
}

.product-item .product-info {
  width: calc(100% - 222rpx);
  display: flex;
  flex-direction: column;
}

.product-item .product-info .name {
  height: 72rpx;
  font-size: 30rpx;
  color: #232423;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 35rpx;
}

.product-info .name .promotion-type {
  display: inline-block;
  color: #fff;
  /* background-color: #FFB332; */
  font-size: 20rpx;
  width: 51rpx;
  height: 30rpx;
  line-height: 10rpx;
  vertical-align: middle;
  text-align: center;
  border-radius: 4px;
  margin-top: -6rpx;
}

.product-info .name .promotion-type.team-tag {
  background-color: #FFB332;
}

.product-info .name .promotion-type.seckill-tag {
  background-color: #EB3B5A;
}

.product-info .commission {
  height: 34rpx;
  line-height: 34rpx;
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #888;
}

.product-info .commission view {
  float: left;
}

.product-info .commission .commission-rate {
  margin-right: 9rpx;
  background-color: #F8E5C5;
  color: #EB3B5A;
  border-radius: 4px;
  height: 34rpx;
  padding-right: 5rpx;
  font-size: 22rpx;
}

.product-info .commission .commission-rate text {
  border-top-left-radius: 4rpx;
  border-bottom-left-radius: 4rpx;
  display: inline-block;
  background-color: #EB3B5A;
  color: #FFFFFE;
  width: 59rpx;
  position: relative;
  line-height: 34rpx;
  padding-left: 5rpx;
}

.product-info .commission .commission-rate text:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 0;
  width: 0;
  border-top: 18rpx solid #F8E5C5;
  border-left: 12rpx solid #EB3B5A;
  border-bottom: 17rpx solid #F8E5C5;
  background: #EB3B5A;
}

.product-info .price {
  margin-top: 30rpx;
  height: 40rpx;
  font-size: 22rpx;
  color: #EB3B5A;
}

.product-info .price text {
  font-size: 34rpx;
}

.product-info .share {
  height: 57rpx;
  margin-top: 8rpx;
  font-size: 30rpx;
  position: relative;
}

.product-info .share view {
  width: 210rpx;
  height: 57rpx;
  line-height: 57rpx;
  position: absolute;
  right: 0;
  border-radius: 29rpx;
  color: #fff;
  background-color: #EB3B5A;
  text-align: center;
}

.product-info .share view image {
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
  margin-right: 6rpx;
  margin-top: -2rpx;
}

.product-info .share view text {
  font-size: 24rpx;
}

.content-box {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 240rpx;
  height: 100rpx;
  text-align: center;
  font-size: 10rpx;
}

.spinner>view {
  height: 100%;
  width: 8rpx;
  margin: 0 3rpx;
  display: inline-block;
  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {

  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }

  20% {
    -webkit-transform: scaleY(1.0);
  }
}

@keyframes stretchdelay {

  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}

/* 分享选择 */

.bottom-pop {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9;
}

.bottom-pop-main {
  position: absolute;
  bottom: -280rpx;
  left: 0rpx;
  width: 100%;
  height: 280rpx;
  overflow: hidden;
  background: #fff;
  text-align: center;
}

.bottom-pop-main .cancel {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  border-top: 1rpx solid #ddd;
}

.bottom-pop-main .share-type-box {
  width: 100%;
  height: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-pop-main .share-type-box>view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  width: 50%;
  height: 120rpx;
  box-sizing: border-box;
  float: left;
}

.bottom-pop-main .share-type-box>view image {
  height: 80rpx;
  width: 80rpx;
}

.bottom-pop-main .share-wx {
  border-right: 1rpx solid #ddd;
  position: relative;
}

.bottom-pop-main .share-wx button {
  background: transparent;
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
}

.bottom-pop-main .share-wx button::after {
  border: none;
}

/* 海报 */
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
  /* overflow-y: scroll; */
}

.poster-box-bg {
  background: #fff;
  width: 100%;
  height: calc(100% - 120rpx);
  position: fixed;
  bottom: 0;
}

.poster-box-content {
  position: absolute;
  width: 100%;
  height: 1160rpx;
  top: 50%;
  margin-top: -580rpx;
}

/* .poster-picture-box {
  width: 600rpx;
  height: 1000rpx;
  margin: 20rpx auto;
  position: relative;
} */

.close-poster-box {
  position: absolute;
  top: 0;
  right: 25rpx;
  color: #333;
  font-size: 60rpx;
}

.poster-box-content canvas {
  width: 600rpx;
  height: 1000rpx;
  display: block;
  border-radius: 10rpx;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  left: 75rpx;
  z-index: -1;
}

.poster-box .saveImage {
  width: 100%;
  position: absolute;
  top: 1020rpx;
}

.poster-box .saveImage button {
  width: 80%;
  height: 90rpx;
  background: #019f55;
  color: #fff;
  font-size: 34rpx;
  margin: 0 auto;
  border-radius: 50rpx;
}

.poster-box .saveImageTips {
  width: 100%;
  font-size: 28rpx;
  color: #5B5B5B;
  position: absolute;
  top: 1130rpx;
  text-align: center;
  line-height: 30rpx;
}
</style>