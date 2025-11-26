<template>
<!--components/product/share/share.wxml-->
<view class="poster-box" :hidden="!showPoster" @click="handlePosterCancel" @touchmove.stop="preventTouchMove">
  <view class="poster-box-bg">
    <view class="close-poster-box" @click.stop="handlePosterCancel">×</view>
    <view class="poster-picture-box">
      <image :src="shareUrl" mode="widthFix" lazy-load="false" @error="" @load=""></image>
    </view>
    <button @click.stop="handleSaveToImg" class="saveImage">保存图片</button>
    <text class="saveImageTips">分享海报时可到相册选取图片</text>
  </view>
</view>
<view class="canvas-box">
  <canvas canvas-id="pictureQRShareCanvas" style="left:999999px;top:0px"></canvas>
</view>
<popup :show="show" position="bottom" custom-class="bottom" @close="toggleBottomPopup">
  <view class="share-box">
    <view class="title">分享</view>
    <view class="share-content-box">
      <view @click.stop="clickShare">
        <button v-if="shareData.sharePic || shareData.sharePicture" open-type="share"></button>
        <button v-else @click="clickShareTofriend"></button>
        <image :src="imagesPath.iconShareWechatDialog" mode="widthFix" lazy-load="false"></image>
        <text>发送小程序链接</text>
      </view>
      <view @click="clickDrawsharingImage">
        <image :src="imagesPath.iconShareWechatMoments" mode="widthFix" lazy-load="false"></image>
        <text>生成图片海报</text>
      </view>
    </view>
    <view class="cancel" @click="toggleBottomPopup">取消</view>
  </view>
</popup>

</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import { reactive } from "vue";
import popup from '../../popup/popup.vue';
const app = getApp();

// components/product/share/share.js
const wxaUserService = _apiWxaUserServiceJs;
const request = _apiRequestJs;
const IMAGESPATH = _utilsImagesPathJs;
const THEMEMANAGER = _utilsThemeManagerJs;
const UTILS = _utilsUtilsJs;

//获取应用实例
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
const state = reactive({
  sharePictures: '',
  imagesPath: IMAGESPATH,
  theme: THEMEMANAGER,
  themeColor: THEMEMANAGER.color,
  showPopup: {
    middle: false,
    top: false,
    bottom: true,
    right: false,
    right2: false,
    number: false
  },
  shareUrl: ""
});
const props = defineProps({
  show: Boolean,
  specificationsFlag: Boolean,
  shareData: Object,
  type: String
});
function attached() {
  UTILS.getSharePictures('GOODS_SHARE_BG').then(res => {
    state.sharePictures = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
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
function clickShare(e) {
  toggleBottomPopup();
}
function toggleBottomPopup() {
  triggerEvent('close');
}
function toggle(type) {
  state[`showPopup.${type}`] = !state.showPopup[type];
}
function clickDrawsharingImage() {
  // 关闭弹窗
  toggleBottomPopup();
  // 绘制分享图
  drawsharingImage();
}
function clickShareTofriend() {
  console.log(state.shareData, "测试地址");
  if (!state.sharePic && state.goodType !== 'advanceSell') {
    uni.showToast({
      title: "正在生成分享图，请稍后再试",
      icon: 'none',
      duration: 2000
    });
  }
}
function drawsharingImage(e) {
  let nameHeight = 0;
  const systemInfo = app.globalData.systemInfo;
  const screenWidth = app.globalData.systemInfo.screenWidth;
  const version = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo()
  }.SDKVersion;
  let support = false; // 版本号是否是1.9.90 以上
  if (UTILS.compareVersion(version, '1.9.90 ') >= 0) {
    support = true;
  } else {
    support = false;
  }
  let isAndroid = false;
  console.log(systemInfo);
  if (systemInfo.platform == "android") {
    isAndroid = true;
  }
  const rate = 1;
  uni.showLoading({
    title: "正在生成分享图",
    mask: true
  });
  let self = this;
  // 获取到id为‘pictureQRShareCanvas’的canvas
  let ctx = uni.createCanvasContext("pictureQRShareCanvas", self);
  // ctx.draw(true)
  if (state.sharePictures) {
    drawImg();
  } else {
    UTILS.getSharePictures('GOODS_SHARE_BG').then(res => {
      state.sharePictures = res;
      drawImg();
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
  function drawImg() {
    // 绘制背景
    getImageInfo(state.sharePictures).then(res => {
      ctx.drawImage(res.path, 0, 0, 750 * rate, 1140 * rate);
      ctx.draw(true);
      //   let logo = IMAGESPATH.iconShareLogo;
      //   console.log(app.globalData.merchantCenter)
      //   if (app.globalData.merchantCenter && app.globalData.merchantCenter.logo && app.globalData.merchantCenter.logo != null && app.globalData.merchantCenter.logo !== "") {
      //     logo = app.globalData.merchantCenter.logo.replace("http://", "https://");
      //   }
      //   return getImageInfo(logo)
      // }).then(res => {
      //   // 绘制logo
      //   let left = (750 - res.width * 90 / res.height) / 2
      //   ctx.drawImage(res.path, left * rate, 30 * rate, res.width * 90 / res.height * rate, 90 * rate);
      //   ctx.draw(true);
      //   ctx.setTextAlign('left')
      let imagesUrl = state.shareData.sharePicture.replace("http://", "https://");
      return getImageInfo(imagesUrl);
    }).then(res => {
      ctx.setFillStyle('#fff');
      ctx.font = 'normal ' + 36 * rate + 'px sans-serif';
      // ctx.setTextAlign('center')
      // ctx.fillText('“发现一个好东西，快来看看吧”', 375 * rate, 188 * rate);
      ctx.setTextAlign('left');
      // 绘制商品信息背景
      if (isAndroid) {
        ctx.setFillStyle('transparent');
        ctx.setShadow(0, 0, 24 * rate, 'rgba(0, 0, 0, 0.06)');
        ctx.fillRect(60 * rate, 65 * rate, 630 * rate, 1027 * rate);
      } else {
        ctx.setShadow(0, 0, 24 * rate, 'rgba(0, 0, 0, 0.06)');
      }
      UTILS.roundRectColor(ctx, 60 * rate, 65 * rate, 630 * rate, 1027 * rate, 24 * rate, "#FFFFFF");
      ctx.draw(true);
      ctx.setShadow(0, 0, 0, '#fff');
      // ctx.draw(true);
      // 绘制上部分商品图片
      UTILS.roundRectImage(ctx, 60 * rate, 65 * rate, 630 * rate, 630 * rate, 24 * rate, res.path);
      ctx.draw(true);
      // ctx.drawImage(res.path, 60 * rate, 65 * rate, 630 * rate, 630 * rate);
      if (state.shareData.storeName) {
        nameHeight = 50;
        UTILS.roundRectColor(ctx, 100 * rate, 720 * rate, 550 * rate, 60 * rate, 30 * rate, "#f3f3f3");
        ctx.draw(true);
        ctx.font = 'normal ' + 30 * rate + 'px sans-serif';
        let storeNameWidth = 0;
        state.shareData.storeName = state.shareData.storeName.substr(0, 14);
        if (support) {
          const storeName = ctx.measureText(state.shareData.storeName);
          storeNameWidth = storeName.width / rate;
        }
        getImageInfo(IMAGESPATH.iconPositionActive).then(res => {
          ctx.drawImage(res.path, (390 - storeNameWidth / 2 - 40) * rate, 735, 28 * rate, 32 * rate);
          ctx.draw(true);
          ctx.setFillStyle('#000');
          UTILS.dealWords({
            ctx: ctx,
            //画布上下文
            fontSize: 30 * rate,
            //字体大小
            lineHeigh: 54 * rate,
            //字体行高
            word: state.shareData.storeName,
            //需要处理的文字
            maxWidth: 420 * rate,
            //一行文字最大宽度
            x: (390 - storeNameWidth / 2) * rate,
            //文字在x轴要显示的位置
            y: 720 * rate,
            //文字在y轴要显示的位置
            maxLine: 1 //文字最多显示的行数
          });
          ctx.draw(true);
          ctx.setFillStyle('#fff');
        });
      }
      // 绘制商品名称价格
      // 名称
      ctx.setFillStyle('#4D4D4D');
      ctx.font = 'normal bold 32px sans-serif';
      UTILS.dealWords({
        ctx: ctx,
        //画布上下文
        fontSize: 32 * rate,
        //字体大小
        lineHeigh: 44 * rate,
        //字体行高
        word: state.shareData.name,
        //需要处理的文字
        maxWidth: 350 * rate,
        //一行文字最大宽度
        x: 100 * rate,
        //文字在x轴要显示的位置
        y: (920 + nameHeight) * rate,
        //文字在y轴要显示的位置
        maxLine: 2 //文字最多显示的行数
      });
      let labelMarginLeft = 100;
      if (state.shareData.isCycle) {
        let sellPrice = state.shareData.sellPrice;
        let originalPrice = state.shareData.originalPrice ? state.shareData.originalPrice : "";
        drawPrice(sellPrice, originalPrice);
        drawTags('周期购');
      } else if (state.shareData.isTeam) {
        let sellPrice = state.shareData.teamAllPrice;
        let originalPrice = state.shareData.sellPrice ? state.shareData.sellPrice : "";
        drawPrice(sellPrice, originalPrice);
        drawTags('拼团价');
      } else if (state.shareData.isSecKill) {
        let sellPrice = state.shareData.secKillInfo.price;
        let originalPrice = state.shareData.sellPrice ? state.shareData.sellPrice : "";
        drawPrice(sellPrice, originalPrice);
        drawTags('秒杀价');
      } else if (state.type === 'score') {
        let sellPrice = state.scoreInfo.shareData.exchangeScores + '积分';
        let originalPrice = state.shareData.scoreInfo.sellPrice ? state.shareData.scoreInfo.sellPrice : "";
        drawPrice(sellPrice, originalPrice);
      } else if (state.type === "advanceSell") {
        let sellPrice = state.shareData.pdtDetail.sellPrice;
        let originalPrice = "";
        if (state.shareData.pdtDetail.product.originalPrice && state.shareData.pdtDetail.product.originalPrice != null && state.shareData.pdtDetail.product.originalPrice !== "" && state.shareData.pdtDetail.product.originalPrice > sellPrice) {
          originalPrice = state.shareData.pdtDetail.product.originalPrice;
        }
        if (state.shareData.advanceSellInfo.payType === 'PARTIAL' && state.shareData.pdtDetail.frontPrice) {
          // 定金预售
          sellPrice = state.shareData.pdtDetail.frontPrice;
        }
        drawPrice(sellPrice, originalPrice);
        if (state.shareData.advanceSellInfo.payType === 'FULL') {
          drawTags('预售价');
        } else if (state.shareData.advanceSellInfo.payType === 'PARTIAL') {
          drawTags('定金');
        }
      } else {
        let sellPrice = state.shareData.sellPrice;
        let originalPrice = "";
        if (state.shareData.pdtDetail.originalPrice && state.shareData.pdtDetail.originalPrice != null && state.shareData.pdtDetail.originalPrice !== "" && state.shareData.pdtDetail.originalPrice > sellPrice) {
          originalPrice = state.shareData.pdtDetail.originalPrice;
        }
        drawPrice(sellPrice, originalPrice);
      }
      function drawPrice(sellPrice, originalPrice) {
        // 价格
        ctx.setFillStyle('#F94652');
        ctx.setTextAlign('right');
        let specificationsWidth = state.specificationsFlag && state.shareData && !state.shareData.notShowPriceRise ? 36 : 0;
        ctx.font = 'bold ' + 68 * rate + 'px sans-serif';
        sellPrice = parseFloat(sellPrice).toFixed(2);
        // 如果小数部分为00，去掉小数部分
        if (sellPrice.indexOf(".00") !== -1) {
          sellPrice = sellPrice.substring(0, sellPrice.indexOf("."));
        }

        // 如果小数部分只有一位，展示一位
        if (sellPrice.indexOf(".") !== -1 && sellPrice[sellPrice.length - 1] === '0') {
          sellPrice = sellPrice.substring(0, sellPrice.length - 1);
        }
        let nameWidth = 312;
        if (support) {
          const metrics = ctx.measureText(sellPrice);
          console.log(metrics.width);
          nameWidth = metrics.width / rate;
        }
        ctx.fillText(sellPrice, (140 + nameWidth) * rate, (880 + nameHeight) * rate);
        if (state.specificationsFlag && state.shareData && !state.shareData.notShowPriceRise) {
          ctx.font = 'normal ' + 36 * rate + 'px sans-serif';
          ctx.fillText('起', (180 + nameWidth) * rate, (880 + nameHeight) * rate);
          if (support) {
            const specifications = ctx.measureText('起');
            specificationsWidth = specifications.width / rate;
          }
        }
        if (state.type !== 'score') {
          ctx.setFillStyle('#F94652');
          ctx.font = 'normal ' + 50 * rate + 'px sans-serif';
          ctx.fillText('￥', 145 * rate, (880 + nameHeight) * rate);
        }
        ctx.setFillStyle('#999999');
        if (originalPrice != null && originalPrice !== "") {
          ctx.setTextAlign('left');
          ctx.setLineWidth(1);
          if (support) {
            ctx.lineWidth = 1;
          }
          ctx.font = 'normal ' + 30 * rate + 'px sans-serif';
          if (nameWidth < 190) {
            ctx.fillText('￥' + originalPrice, (145 + nameWidth + specificationsWidth) * rate, (880 + nameHeight) * rate);
            ctx.setStrokeStyle('#999999');
            ctx.moveTo((145 + nameWidth + specificationsWidth) * rate, (868 + nameHeight) * rate);
          } else {
            ctx.fillText('￥' + originalPrice, 100 * rate, (920 + nameHeight) * rate);
            ctx.setStrokeStyle('#999999');
            ctx.moveTo(100 * rate, (908 + nameHeight) * rate);
          }
          let textWidth = 123;
          if (support) {
            const metrics = ctx.measureText('￥' + originalPrice);
            console.log(metrics.width);
            textWidth = metrics.width / rate + 4;
          }
          if (nameWidth < 190) {
            ctx.lineTo((145 + nameWidth + textWidth + specificationsWidth) * rate, (868 + nameHeight) * rate);
          } else {
            ctx.lineTo((100 + textWidth) * rate, (908 + nameHeight) * rate);
          }
          ctx.stroke();
          ctx.draw(true);
        }
        ctx.draw(true);
        ctx.setStrokeStyle('#EAEAEA');
        ctx.moveTo(470 * rate, (780 + (nameHeight ? nameHeight - 20 : 0)) * rate);
        ctx.lineTo(470 * rate, (1040 + (nameHeight ? nameHeight - 20 : 0)) * rate);
        ctx.stroke();
        ctx.draw(true);
      }
      function drawTags(text) {
        ctx.setTextAlign('left');
        //绘制箭头标签
        console.log(labelMarginLeft);
        ctx.moveTo(labelMarginLeft * rate, (800 + nameHeight) * rate);
        ctx.lineTo((labelMarginLeft + 8) * rate, (815 + nameHeight) * rate);
        ctx.lineTo((labelMarginLeft + 16) * rate, (800 + nameHeight) * rate);
        ctx.fillStyle = '#EE5253';
        ctx.fill();
        ctx.setFillStyle('#EE5253');
        //ctx.fillRect(x, y, width, height);绘制一个填充的矩形
        ctx.fillRect(labelMarginLeft * rate, (760 + nameHeight) * rate, 100 * rate, 40 * rate);
        ctx.setFillStyle('#ffffff');
        ctx.font = 'normal ' + 28 * rate + 'px sans-serif';
        ctx.fillText(text, (labelMarginLeft + 8) * rate, (790 + nameHeight) * rate);
      }
      ctx.setTextAlign('left');
      ctx.setFillStyle('#999999');
      ctx.font = 'normal ' + 24 * rate + 'px sans-serif';
      ctx.fillText('长按识别小程序', 490 * rate, (980 + nameHeight) * rate);
      ctx.fillText('购更多优惠好物 ', 490 * rate, (1010 + nameHeight) * rate);
      ctx.draw(true);

      // 获取小程序码
      let appid = request.APP_ID;

      //   if (self.data.type === "advanceSell" || self.data.shareData.isSecKill) {
      let param = "";
      // 预售获取场景值
      if (state.shareData.isCycle) {
        param = "id=" + state.shareData.options.id + "&type=" + state.shareData.options.type;
      } else if (state.type === "advanceSell") {
        param = "productId=" + state.shareData.options.productId + "&advanceId=" + state.shareData.options.advanceId + "&type=" + state.shareData.options.type;
      } else if (state.shareData.isSecKill) {
        param = "productId=" + state.shareData.options.productId + "&activityId=" + state.shareData.options.activityId + "&type=" + state.shareData.options.type;
      } else if (state.shareData.isService || state.shareData.isFlorist) {
        param = "productId=" + state.shareData.options.productId + "&type=" + state.shareData.options.type;
      } else {
        param = "productId=" + state.shareData.options.productId + "&type=" + state.shareData.options.type;
      }
      if (state.shareData.storeId) {
        param = param + '&storeId=' + state.shareData.storeId;
      }
      // 添加门店id
      console.log(param, 'param', state.shareData.storeId);
      return wxaUserService.createScene(appid, param);
      //   }
    }).then(res => {
      console.log(res);
      let appid = request.APP_ID;
      let width = parseInt(300 * rate);
      let page = 'pages/mallModule/goods/goodsDetail/goodsDetail';
      if (state.shareData.isCycle) {
        page = 'pages/mallModule/goods/flowerDetail/index';
      }
      let scene = "gmparam:" + res;
      return getImageInfo(request.BASE_URL + "/newretail/api/wxa/qrcode/create?appid=" + appid + "&page=" + page + "&scene=" + scene + "&size=" + width);
      //   if (self.data.type === "advanceSell" || self.data.shareData.isSecKill) {
      // let scene = "gmparam:" + res
      // return getImageInfo(request.BASE_URL + "/newretail/api/wxa/qrcode/create?appid=" + appid + "&page=" + page + "&scene=" + scene + "&size=" + width)
      //   } else {
      //     let scene = self.data.shareData.options.productId + "," + self.data.shareData.options.type;
      //     // 添加门店id
      //     console.log(scene,'storeId',self.data.shareData.storeId)
      //     if(self.data.shareData.storeId) {
      //         scene = scene + ',' + self.data.shareData.storeId
      //     }
      //     console.log(scene,'storeId',"?appid=" + appid + "&page=" + page + "&scene=" + scene + "&size=" + width)
      //     return getImageInfo(request.BASE_URL + "/newretail/api/wxa/qrcode/create?appid=" + appid + "&page=" + page + "&scene=" + scene + "&size=" + width)
      //   }
    }).then(res => {
      console.log(res);
      ctx.drawImage(res.path, 500 * rate, (790 + nameHeight) * rate, 148 * rate, 148 * rate);
      ctx.draw(true, () => {
        // 保存图片并显示
        const pixelRatio = systemInfo.pixelRatio;
        const screenWidth = systemInfo.screenWidth;
        // const rate = screenWidth / 750
        const rate = 1;
        const width = 750 * rate;
        const height = 1140 * rate;
        const destHeight = height * pixelRatio;
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
          canvasId: 'pictureQRShareCanvas',
          success(res) {
            uni.hideLoading();
            state.shareUrl = res.tempFilePath;
            state.showPoster = true;
          },
          fail(err) {
            console.log(err);
            uni.hideLoading();
            UTILS.showToast("分享图生成失败，请重试~");
          }
        }, self);
      });
    }).catch(err => {
      console.log(err);
      uni.hideLoading();
      UTILS.showToast("分享图生成失败，请重试~");
    });
  }
  function getImageInfo(url) {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src: url,
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject({
            code: -1,
            message: "图片获取失败"
          });
        }
      });
    });
  }
}
function handlePosterCancel(e) {
  state.showPoster = false;
}
function preventTouchMove(e) {}
function handleSaveToImg(e) {
  let self = this;
  uni.saveImageToPhotosAlbum({
    filePath: state.shareUrl,
    success(res) {
      // 隐藏海报显示
      state.showPoster = false;
      uni.showToast({
        title: '保存成功'
      });
    }
  });
}
</script>
<style scoped>
/* components/product/share/share.wxss */

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
  z-index: 1000;
}

.poster-box-bg {
  width: 100%;
  height: 100%;
  position: fixed;
  bottom: 0;
  padding-top: 16%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}


.close-poster-box {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
  color: #000;
}

.poster-picture-box {
  /* width: 750rpx;
  height: 1333rpx; */
  margin: 0 auto;
  margin-bottom: 40rpx;
}

.canvas-box {
  height: 0;
  position: relative;
  overflow: hidden;
}

.canvas-box canvas {
  width: 750px;
  height: 1333px;
  position: absolute;
}

.poster-picture-box image {
  width: 533rpx;
  height: 947rpx;
}

.poster-box .saveImage {
  width: 330rpx;
  height: 80rpx;
  background: transparent;
  color: #fff;
  border: 3rpx solid #fff;
  font-size: 36rpx;
  line-height: 80rpx;
  font-family: Source Han Sans CN;
  font-weight: bold;
  margin: 40rpx auto 24rpx auto;
  border-radius: 40rpx;
}

.poster-box .saveImageTips {
  font-size: 30rpx;
  line-height: 48rpx;
  color: #FFFFFF;

}
</style>