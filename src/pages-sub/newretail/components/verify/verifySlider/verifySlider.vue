<template>
<!-- 引入wxs文件 -->
<view></view>

<!--滑块、点选-->
<view v-if="show">
<view :class="opt.mode">
	<view class="aj-captcha-mask"></view>

	<view class="aj-captcha">

		<view class="verifybox-top">
			<text>请完成安全验证</text>
			<view class="verifybox-close" @click="hide"></view>
		</view>

		<view class="verifybox-bottom">

				<view class="verify-img-out" :style="'height: ' + verifyImgOutHeight + ';'">
					<view class="verify-img-panel" :style="'width:' + opt.imgSize.width + '; height: ' + opt.imgSize.height + ';'">
						<view class="verify-refresh" @click="_refresh"></view>
						<text :class="'verify-tips ' + verifyTipsClass">{{verifyTipsText}}</text>
						<image class="backImg" mode="aspectFit" @click.stop="clickWordTapName" style="width:100%;height:100%;display:block" :src="originalImageBase64"></image>
						 <view class="click-word-point" :style="'left:' + clickWordPointList[0].left + ';top:' + clickWordPointList[0].top + ';display:' + clickWordPointList[0].display + ';'">1</view>
						 <view class="click-word-point" :style="'left:' + clickWordPointList[1].left + ';top:' + clickWordPointList[1].top + ';display:' + clickWordPointList[1].display + ';'">2</view>
						 <view class="click-word-point" :style="'left:' + clickWordPointList[2].left + ';top:' + clickWordPointList[2].top + ';display:' + clickWordPointList[2].display + ';'">3</view>
						 <view class="click-word-point" :style="'left:' + clickWordPointList[3].left + ';top:' + clickWordPointList[3].top + ';display:' + clickWordPointList[3].display + ';'">4</view>
						 <view class="click-word-point" :style="'left:' + clickWordPointList[4].left + ';top:' + clickWordPointList[4].top + ';display:' + clickWordPointList[4].display + ';'">5</view>
					</view>
				</view>

				<view :class="'verify-bar-area ' + verifyBarAreaClass" :style="'width:' + opt.imgSize.width + ';height:' + opt.barHeight + ';line-height:' + opt.barHeight">
					<text class="verify-msg">{{verifyMsgText}}</text>

					<!-- 滑块 -->
					<view v-if="opt.captchaType == 'blockPuzzle'" :class="'verify-left-bar ' + leftBarClass" @touchstart.stop="aj_captcha.touchstart" @touchmove.stop="aj_captcha.touchmove" @touchend.stop="aj_captcha.touchend" @touchcancel.stop="aj_captcha.touchend" :style="'width:' + opt.barHeight + ';height:' + opt.barHeight + ';'">
						<view class="verify-move-block" :style="'width:' + opt.barHeight + '; height:' + opt.barHeight + ';'">
							<view class="verify-sub-block" :style="'width:' + verifySubBlockWidth + '; height:' + opt.imgSize.height + '; top:' + verifySubBlockTop + ';'">
								<image class="bock-backImg" mode="aspectFit" style="width:100%;height:100%;display:block" :src="jigsawImageBase64"></image>
							</view>
						</view>
					</view>

				</view>

		</view>

	</view>

</view>


</view>
</template>
<script setup>
import _apiRequestJs from "@/service/api/newretail/request";
import _utilsAes_utilJs from "@/utils/newretail/aes_util";
import { reactive } from "vue";
//引入aes加密文件
const CryptoJS = _utilsAes_utilJs;
const request = _apiRequestJs;

// var key = "7IWlRFRgSO3G3h7F";
// //aes 加密
// console.log('123456--aes 加密',CryptoJS.AesEncrypt('123456',key))
// // 1GL46CatmleXJmA9YmTEIA==
// //aes 解密
// console.log('123456--aes 解密',CryptoJS.AesDecrypt('1GL46CatmleXJmA9YmTEIA==',key))
// console.log('123456--aes 解密',CryptoJS.AesDecrypt('Z5/mlIkvjH9UarQHAY4AXw==',"0ypBWlmJKfYuGnx8"))

/**
 * @desc 验证码插件
 * @author WuJiangWu
 * @datatime 2021/4/7 8:59
 */
const state = reactive({
  show: false,
  //是否显示组件
  token: "",
  //验证码token
  secretKey: "",
  //aes密钥
  originalImageBase64: "",
  //原图base64
  jigsawImageBase64: "",
  //拼图滑块base64
  verifyImgOutHeight: "",
  //底图父容器高度
  verifySubBlockWidth: "",
  //填充块宽度值
  verifySubBlockTop: "",
  //填充块top值
  leftBarClass: "status-1",
  //滑块默认样式
  verifyTipsClass: "",
  //文字提示框样式
  verifyTipsText: "",
  //文字提示框内容
  verifyMsgText: "",
  //滑块框文字内容
  verifyBarAreaClass: "",
  //滑块区域样式类
  clickWordTapName: "",
  //点击事件名称
  clickWordTapNum: 0,
  //点选点击次数
  clickWordXYList: [],
  //点选坐标对象集合
  clickWordPointList: [
  //坐标标点集合，初始化五个
  {
    left: 0,
    top: 0,
    display: 'none'
  }, {
    left: 0,
    top: 0,
    display: 'none'
  }, {
    left: 0,
    top: 0,
    display: 'none'
  }, {
    left: 0,
    top: 0,
    display: 'none'
  }, {
    left: 0,
    top: 0,
    display: 'none'
  }],
  backImgLeft: 0,
  //背景图右边界坐标
  backImgTop: 0 //背景图上边界坐标
});
let options = {
  multipleSlots: true
};
const props = defineProps({
  opt: {
    type: Object,
    value: null
  }
});
function attached() {
  let _self = this;
  // 在组件实例进入页面节点树时执行
  //初始化属性默认值
  let defaults = {
    baseUrl: request.BASE_URL + '/newretail',
    //服务器前缀，默认值：https://captcha.anji-plus.com/captcha-api
    mode: 'pop',
    //弹出式pop，固定fixed, 默认值：pop
    captchaType: "blockPuzzle",
    //验证码类型：滑块blockPuzzle，点选clickWord，默认值：blockPuzzle
    imgSize: {
      //底图大小，默认值：{ width: '310px',height: '155px'}
      width: '310px',
      height: '155px'
    },
    barHeight: '40px',
    //滑块大小，默认值：'40px'
    vSpace: 5,
    //底图和verify-bar-area间距，默认值：5像素
    success: function (res) {},
    //成功回调
    fail: function (res) {} //失败回调
  };
  let res = _extend(defaults, state.opt);
  console.log(res);
  //点选获取底图位置-嵌入式
  if (res.captchaType == "clickWord" && res.mode == "fixed") {
    uni.createSelectorQuery().in(_self).select('.backImg').boundingClientRect(function (rect) {
      console.log(rect);
      state.backImgLeft = rect.left;
      state.backImgTop = rect.top;
    }).exec();
  }
  state.verifyImgOutHeight = parseInt(res.imgSize.height) + parseInt(res.vSpace) + "px";
  state.verifySubBlockWidth = Math.floor(parseInt(res.imgSize.width) * 47 / 310) + 'px';
  state.verifySubBlockTop = "-" + (parseInt(res.imgSize.height) + parseInt(res.vSpace)) + "px";
  state.show = res.mode == "pop" ? false : true;
  _uuid();
  _refresh();
}
function show() {
  let _self = this;
  state.show = true;
}
function hide(flag) {
  state.show = false;
  if (typeof state.opt.hide == "function" && flag !== false) {
    state.opt.hide();
  }
}
function reload() {
  let _self = this;
  let res = state.opt;
  console.log(res);
  //点选获取底图位置-嵌入式
  if (res.captchaType == "clickWord" && res.mode == "fixed") {
    uni.createSelectorQuery().in(_self).select('.backImg').boundingClientRect(function (rect) {
      console.log(rect);
      state.backImgLeft = rect.left;
      state.backImgTop = rect.top;
    }).exec();
  }
  state.verifyImgOutHeight = parseInt(res.imgSize.height) + parseInt(res.vSpace) + "px";
  state.verifySubBlockWidth = Math.floor(parseInt(res.imgSize.width) * 47 / 310) + 'px';
  state.verifySubBlockTop = "-" + (parseInt(res.imgSize.height) + parseInt(res.vSpace)) + "px";
  state.show = res.mode == "pop" ? false : true;
  _refresh();
}
function _blockPuzzleCheck(obj) {
  console.log("开始校验：" + JSON.stringify(obj));
  let _self = this;
  let url = state.opt.baseUrl + "/captcha/check";
  let clientUid = state.opt.captchaType == 'blockPuzzle' ? clientUid = uni.getStorageSync('slider') : clientUid = uni.getStorageSync('point');
  //服务端默认310宽度底图
  let serverX = obj.offsetX / parseInt(state.opt.imgSize.width) * 310;
  console.log("移动距离:" + obj.offsetX + "\t换算比例距离X:" + serverX);
  let pointJson = JSON.stringify({
    x: serverX,
    y: 5.0
  });
  let _data = {
    captchaType: state.opt.captchaType,
    "pointJson": state.secretKey ? CryptoJS.AesEncrypt(pointJson, state.secretKey) : pointJson,
    "token": state.token,
    clientUid: clientUid,
    ts: Date.now()
  };
  console.log(_data);
  _postData(url, _data, function (res) {
    if (res.data.repCode == "0000") {
      //响应正确
      console.log(obj.expendTime + "s验证成功");
      state.leftBarClass = "status-4";
      state.verifyTipsClass = "suc-bg";
      state.verifyTipsText = obj.expendTime + "s验证成功";
      setTimeout(function () {
        _refresh();
        state.opt.mode == "pop" ? hide(false) : "";
        //回调成功函数
        let captchaVerification = state.token + '---' + pointJson;
        captchaVerification = state.secretKey ? CryptoJS.AesEncrypt(captchaVerification, state.secretKey) : captchaVerification;
        if (typeof state.opt.success == "function") {
          state.opt.success({
            'captchaVerification': captchaVerification
          });
        }
      }, 700);
    } else {
      //响应错误
      state.leftBarClass = "status-3";
      state.verifyTipsClass = "err-bg";
      state.verifyTipsText = res.data.repMsg;
      if (typeof state.opt.fail == "function") {
        state.opt.fail(res.data);
      }
      setTimeout(function () {
        _refresh();
      }, 700);
    }
  });
}
function _clickWordTap(res) {
  let _self = this;
  console.log(res);
  let detail_x = res.detail.x;
  let detail_y = res.detail.y;
  //显示对应标记点
  _setPoint(detail_x, detail_y);
  console.log(state.clickWordTapNum);
  console.log(state.clickWordXYList);
  if (state.clickWordTapNum > 2) {
    //更新服务器校验，取消点击事件
    state.clickWordTapName = '';
    let url = state.opt.baseUrl + "/captcha/check";
    let clientUid = state.opt.captchaType == 'blockPuzzle' ? clientUid = uni.getStorageSync('slider') : clientUid = uni.getStorageSync('point');
    let pointJson = JSON.stringify(state.clickWordXYList);
    let _data2 = {
      captchaType: state.opt.captchaType,
      "pointJson": state.secretKey ? CryptoJS.AesEncrypt(pointJson, state.secretKey) : pointJson,
      "token": state.token,
      clientUid: clientUid,
      ts: Date.now()
    };
    console.log(_data2);
    _postData(url, _data2, function (res) {
      if (res.data.repCode == "0000") {
        //响应正确
        state.verifyMsgText = "验证成功";
        state.verifyBarAreaClass = "suc-area";
        setTimeout(function () {
          _refresh();
          state.opt.mode == "pop" ? hide(false) : "";
          //回调成功函数
          let captchaVerification = state.token + '---' + pointJson;
          captchaVerification = state.secretKey ? CryptoJS.AesEncrypt(captchaVerification, state.secretKey) : captchaVerification;
          if (typeof state.opt.success == "function") {
            state.opt.success({
              'captchaVerification': captchaVerification
            });
          }
        }, 700);
      } else {
        //响应错误
        state.verifyMsgText = "验证失败";
        state.verifyBarAreaClass = "err-area";
        if (typeof state.opt.fail == "function") {
          state.opt.fail(res.data);
        }
        setTimeout(function () {
          _refresh();
        }, 700);
      }
    });
  }
}
function _setPoint(detail_x, detail_y) {
  let _self = this;
  let xylist = state.clickWordXYList;
  let pointList = state.clickWordPointList;
  let offsetX = detail_x - state.backImgLeft;
  let offsetY = detail_y - state.backImgTop;
  console.log("点击位置：" + detail_x + "\t" + detail_y + "\t底图位置：" + state.backImgLeft + "\t" + state.backImgTop);
  //服务端默认310宽度底图，按比例换成对应坐标
  let serverX = offsetX / parseInt(state.opt.imgSize.width) * 310;
  let serverY = offsetY / parseInt(state.opt.imgSize.width) * 310;
  xylist.push({
    x: serverX,
    y: serverY
  });
  pointList[state.clickWordTapNum] = {
    left: offsetX - 10 + "px",
    top: offsetY - 10 + "px",
    display: "block"
  };
  state.clickWordTapNum = ++state.clickWordTapNum;
  state.clickWordXYList = xylist;
  state.clickWordPointList = pointList;
}
function _refresh() {
  let _self = this;
  let url = state.opt.baseUrl + "/captcha/get";
  let clientUid = "";
  if (state.opt.captchaType == "blockPuzzle") {
    clientUid = uni.getStorageSync('slider');
  } else {
    clientUid = uni.getStorageSync('point');
  }
  let _data3 = {
    captchaType: state.opt.captchaType,
    clientUid: clientUid,
    ts: Date.now()
  };
  console.log(_data3);
  _postData(url, _data3, function (res) {
    if (res.data.repCode == "0000") {
      let text = _data3.captchaType == 'blockPuzzle' ? '向右滑动完成验证' : '请依次点击【' + res.data.repData.wordList.join(",") + '】';
      state.originalImageBase64 = "data:image/png;base64," + res.data.repData.originalImageBase64;
      state.jigsawImageBase64 = "data:image/png;base64," + res.data.repData.jigsawImageBase64;
      state.secretKey = res.data.repData.secretKey;
      state.token = res.data.repData.token;
      state.leftBarClass = "status-1";
      state.verifyTipsClass = "";
      state.verifyTipsText = "";
      state.verifyMsgText = text;
      state.verifyBarAreaClass = '';
      state.clickWordTapName = _data3.captchaType == 'blockPuzzle' ? '' : '_clickWordTap';
      state.clickWordTapNum = 0;
      state.clickWordXYList = [];
      state.clickWordPointList = [{
        left: 0,
        top: 0,
        display: 'none'
      }, {
        left: 0,
        top: 0,
        display: 'none'
      }, {
        left: 0,
        top: 0,
        display: 'none'
      }, {
        left: 0,
        top: 0,
        display: 'none'
      }, {
        left: 0,
        top: 0,
        display: 'none'
      }];
    } else {
      //响应错误
      state.leftBarClass = "status-3";
      state.verifyTipsClass = "err-bg";
      state.verifyTipsText = res.data.repMsg;
      setTimeout(function () {
        _refresh();
      }, 700);
    }
  });
}
function _uuid() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  let slider = 'slider' + '-' + s.join("");
  let point = 'point' + '-' + s.join("");
  // 判断下是否存在 slider和point
  if (!uni.getStorageSync('slider')) {
    uni.setStorageSync("slider", slider);
  }
  if (!uni.getStorageSync('point')) {
    uni.setStorageSync("point", point);
  }
}
function _postData(url, data, success) {
  uni.request({
    url: url,
    data: JSON.stringify(data),
    method: 'POST',
    enableCache: false,
    header: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    //成功执行
    success: function (res) {
      //http状态码判断
      let status_code = res.statusCode;
      if (status_code != 200) {
        uni.showToast({
          title: '响应错误:\t' + status_code,
          icon: 'error',
          duration: 2000
        });
      } else {
        if (typeof success == "function") {
          success(res);
        }
      }
    },
    //失败执行
    fail: function (res) {
      uni.showToast({
        title: '网络错误',
        icon: 'error',
        duration: 2000
      });
    }
  });
}
function _extend(defaults, opt) {
  let res = {};
  for (let key in defaults) {
    res[key] = defaults[key];
  }
  for (let key in opt) {
    res[key] = opt[key];
  }
  state.opt = res;
  return res;
}
</script>
<style scoped>

/* */
.aj-captcha-mask{
  position: fixed;
  z-index: 1001;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,.3);
  transition: all .5s;
}
.fixed .aj-captcha-mask{
display: none;
}
.aj-captcha{
position: fixed;
z-index: 1002;
box-sizing: border-box;
border-radius: 2px;
border: 1px solid #e4e7eb;
background-color: #fff;
box-shadow: 0 0 10px rgb(0 0 0 / 30%);
left: 50%;
top: 50%;
transform: translate(-50%,-50%);
}
.fixed .aj-captcha{
position: relative;
border: none;
left: 0;
top: 0;
background: none;
box-shadow: none;
transform: none;
}
.verifybox-top{
padding: 0 15px;
height: 50px;
line-height: 50px;
text-align: left;
font-size: 16px;
color: #45494c;
border-bottom: 1px solid #e4e7eb;
box-sizing: border-box;
}
.fixed .verifybox-top{
display: none;
}
.verifybox-close {
position: absolute;
top: 13px;
right: 9px;
padding: 8px;
height: 8px;
width: 8px;
text-align: center;
cursor: pointer;
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABa0lEQVRoQ+2Y3a6CMBCEKe9GYjRewkPCpdGY8G5grNYUg7A/U7Fxz63tdr4ZtntSV2T+5zLXXxjA1glaApaA0gH7hJQGqrf/XwLV/tgWw9D113Onti8qUO0OdVGWdX85NZy6rAS8+HGs/QHj2KAgvHjnWl/XuY4DQQaYiA8WASAm4kNdBgQdIHYpzlgBMSuemS4Z4F4XcWBgR9ViAaAgUOJ9y3A6HuEeUrwYQJoEWrwKgAuRQrwagAqRSjwEYA3iOZweQwp0/cZlRE081/gfXZ5brJgd7+VgAItJJHD+NbQl1+jSnsUkgM4bgLgPwCnAeiDrJl6653/+GqUMKcoa6WWi+oQ4wjhrOTBiAIkgyZ41GBGARohm7xwMGwAhAFFDNMiQB6NqkRNAHRh/BoiadID4TSioAEzVrz2r+P82c37YCqZn/bS4didv8Tu5B7YQRznTACgupVxjCaR0l1LbEqC4lHKNJZDSXUrtG4iKUEDrXGOrAAAAAElFTkSuQmCC");
background-size : cover;
}

.verifybox-bottom{
padding: 15px;
box-sizing: border-box;
}
.fixed .verifybox-bottom{
padding: 0;
}
.verify-img-panel {
margin: 0;
-webkit-box-sizing: content-box;
-moz-box-sizing: content-box;
box-sizing: content-box;
border: 1px solid #ddd;
border-radius: 3px;
position: relative;
}
.verify-refresh {
position: absolute;
top: 0;
right: 0;
z-index: 3;
width: 24px;
height: 24px;
padding: 5px;
cursor: pointer;
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATrSURBVFhHzZlbaFVHFIaTaAwaTUzihYoXvCAKGmqN1PigFhFfRAU1FFQU1HoBkSpSNKDQPuSh4kuEUFS0LYqIFxQVxQsijUgs9YooIlK8Fq1tqbHVaOL3z6yzz0lytslJdo7+8DEza9asWdln79mzJxmpqKGhIRO6QD4MrK+vX0W5i/IM3IaX8Bh+gR9hEyyAvpCLbycLFb0I3plJxsDXcAxqsbVK+P4F26EMRkKOhY1GzDGCoKuhBv7306YuxipRXd01MMDCNxOuPaGbNcNFkBz4EqrhHzdLE2GvA/2sl+AgHMf8K+V9eOW9mulv+k5CqU3lhD0bZmE/AHuo51tXc9HZHad18AjqaQei+SecgHU0P6XsA4WQRzvf6r3hE1gJV93ABGF7CzdhHnTVnJQ9YC+o7w2sd8k0FeN70bnVh/KiLT2ASgj9eZKJ4V0YMxv0ML30Eb1oP4UloF+rCK5Zl/qqLURc5vST+QTCdopiMmSba8oiRn/YADddUBPth1BGVRcmPEFs3TBW+O64sG2jGGhu7RJxdDW/gKMuuIm27tllEJ4gBt0PT63fifa3FAXmEpmIqZXhjJvERFtXMnmCtDVAT2vwQFD9GXqbS6QifCaxS+GKn83NJ9VZM54gdS3CWufcUiIvinMUw51DhCJmHkwEPTSiAhr9ajFhr3Z/CWipqHFWRP0BxWSLGZmImws7IbhK7xN+LsFsKqsgeENQr6Ro89MaJuIOg4t+lpaF7+7YJd9vNhm1LqW0zrVWhNcqsRnC3jCB8HkGnyvBAfCv2dVx0OJ1iIivn7kYYvdgUkhlBGRpwAqXmYn2Sov1cYicdvnUXHJ68Y+2ro9DJBQsltS1K+ljXR9EpKH1sZDSb7do3HbZIeraMhW6jg8gUtBrcD4chT0wVAkGuwvq2s/lmX/aRQraqh0HSdutHUrwmU/PJXiCInyT2MFifu0rH/psXD5HZEx8F16HIvNPu5h7ECS+i6tkDLY91J9DX/NPu5h7oqXiRLtcxh+sLYO22uPNP+1i7rWWSkyLZNRONhDt5N8BaRBzn7Q03MWiGCKjbkztXpyoa13MsjFpE/NqT/DCZ+HyOE9RoEdbX287nRVRr4VxNi4tYlotzst9Bv7qwUbIUac2qzqeCL57qWt3k7blhvlGw3U/u5v/dwp9oGXGHLRPO+16EXU9zbNdZweL6QqYS8cir21u7QfUjn9qYO+EYSH8YU7Sb9Doy78jxHRzmSdxcb4DU6n6qxcTRn2znoLEjyZ9aI+k2tg5AikmsSdAcOpA/RVsoZp8N0/nVLjn3b1o6xhtsLlEJmJqUT7nZ/HCdgFGmUty4aDdxBsb40T7EHxmLu0WsaZDsIuS1IYScwkXvrofy/2wuLBpK7YY2vwqZKwexvVw18IGwjbN3FoWzl1hKSQuPdIL0H05E1Orv/rw7wffwA34DxLv88cUsyD101cG657UDqfRTy5hewL7QX/IOOiPWYc/ejNpV6KPc53G6pgu2Xg9EJdhik3XNhFAN/M+yvs+dHLRrzeQlgidr4R+mNOnK3gLvodim6Z9IpAOJOfAYQg2uKmIca9BB5b6Lp6EKdoDdQJmgU72Z8AWuKyJWxJ+Skx/mE4vSjDpPwSRr6uBCJ7FRHqIiqiPha+of0epf0echSNQBVoJFlHqftTRcBuOUjIy3gGZU3IsFtO9nQAAAABJRU5ErkJggg==");
background-size : 50% 50%;
background-repeat: no-repeat;
background-position: center center;
}
.click-word-point{
position:absolute;
background-color: #1abd6c;
color: #fff;
z-index: 4;
width: 20px;
height: 20px;
text-align: center;
line-height: 20px;
border-radius: 50%;
}
.verify-tips {
position: absolute;
left: 0px;
bottom: -35px;
width: 100%;
height: 30px;
line-height: 30px;
color: #fff;
transition: bottom .5s linear;
}
.err-bg {
/* animation: verifyTipsMove 1s linear 1 1s; */
background-color: rgba(217, 83, 79,.5);
filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
bottom: 0;
}
.suc-bg {
/* animation: verifyTipsMove 1s linear 1 1s; */
background-color: rgba(92, 184, 92,.5);
filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
bottom: 0;
}
.verify-bar-area {
position: relative;
background: #FFFFFF;
text-align: center;
-webkit-box-sizing: content-box;
-moz-box-sizing: content-box;
box-sizing: content-box;
border: 1px solid #ddd;
border-radius: 2px;
-webkit-border-radius: 2px;
}
.suc-area.verify-bar-area {
color: #4cae4c;
border-color: #5cb85c;
}
.err-area.verify-bar-area {
color: #d9534f;
border-color: #d9534f;
}
.verify-msg {
z-index: 3;
}
.verify-left-bar {
position: absolute;
top: -1px;
left: -1px;
background: #f0fff0;
cursor: pointer;
-webkit-box-sizing: content-box;
-moz-box-sizing: content-box;
box-sizing: content-box;
border: 1px solid #ddd;
border-radius: 2px;
-webkit-border-radius: 2px;
}
.verify-move-block {
position: absolute;
top: 0px;
left: 0;
background: #fff;
cursor: pointer;
-webkit-box-sizing: content-box;
-moz-box-sizing: content-box;
box-sizing: content-box;
box-shadow: 0 0 2px #888888;
background-size : cover;
}
.status-1.verify-left-bar{
border-color: rgb(255, 255, 255);
width: 0px!important;
transition: width .3s ease;
}
.status-2.verify-left-bar{
border-color: rgb(51, 122, 183);
}
.status-3.verify-left-bar{
border-color: rgb(217, 83, 79);
}
.status-4.verify-left-bar{
border-color: rgb(92, 184, 92);
}
/* right-black.png 黑色 */
.status-1 .verify-move-block{
background-color: rgb(255, 255, 255);
background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABkElEQVRoQ+2Xry/GURSHn/fP0DWRP0ASFT8mKIIiCIogEARFEBSBINiYYKYIbIqATTBTBIUgKIJis7PdE7Tvu3vOeXe38+bvve/zfD73fb/n9mj802ucnxQYdIPZQDZQmUAeocoAq5dnA9URVm5g2cAQ8FHJ0/dyK4FjYAaYBU76pqhYYCWwDmwUjlAJKwFh3wTWoiUsBYR9C1iNlLAWEPZtYCVKwkNA2HeA5QgJLwFh3wWWvCU8BYR9D1j0lPAWEPZ9YMFLIkJA2A+BeQ+JKAFhPwLmgAdgrOLl+29ppIB88T0wCowAzxYS0QLXwDgwDLy2JqBH6ByYtICXPaIa0B/xS5lan1oS0L9ROTLTwKMVfEQD+iJ7K8nfWcJ7C+go8V6Sv7WG9xTQYe6zwN94wHsJ6Dj9VeCvvOA9BPRC8w1MAZee8NYCeqX8KclfeMNbCuil/rckfxYBbylwAEyUW9hpFLylQCTzQKdRc9GoWcgcXDdMAbdoO26cDXQMyu2xbMAt2o4bZwMdg3J7rPkG/gBhdjoxQuNAxwAAAABJRU5ErkJggg==');
transform: translateX(0px)!important;
transition: transform .3s ease;
}
/* right-white.png 白色 */
.status-2 .verify-move-block{
background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABrklEQVRoQ+3Xry+GURQH8O/3z9A1kT9AEhU/JiiCIgiKIBAERRAU4RUEGxPMFIFNEbAJZoqgEARFUOxrz3buhvS8u+dce7b75uee9/s5577vcy/R8Q87nh8V8N8TrBOoE8jsQN1CmQ3MXl4nkN3CzAJuE5A0QPI1M0/fy10Akg4ATAGYJnnYd4qMBV6AVQBrlqMowgXQBJe0DmClNMINYIgNAMslEa4AQ2wCWCqFcAcYYgvAYglECMAQ2wAWohFhAEPsAJiPRIQCDNEDMBeFCAcYYg/AbASiCMAQ+wBmANySHMl4+f5aWgxgiBsAwwCGSD54IEoDLgCMAhgk+dQpgKS0hU5IjnuEb2oUmYCk9CN+bE6tJO87A5CU/kabLTNJ8s4rfPgEJKUX2bN1/tozfChAUjpKvFjnr7zDhwEkpcPcm4W/jAgfApCUjtPvFv48Krw7QFK60HwAmCB5FhneFfDjSvlpnT+NDu8GkJQu9V/W+eMS4T0BuwDGmlsYyaNS4d0AJQP//a4iR4lIYAVEdrdN7TqBNl2KfKZOILK7bWrXCbTpUuQzdQKR3W1T+xuLhoUxcJT1IwAAAABJRU5ErkJggg==');
background-color: rgb(51, 122, 183);
}
/* close-white.png 白色 */
.status-3 .verify-move-block{
background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABZElEQVRoQ+2YUQ7DIAxD4ZDrIddDMkUCCVWsOIlpVy393GjwsylB5PTwJz9cfwqAuxOMBCIBpwOxhJwGul//vwRKKe+U0p5z3t32dQVKKa+U0ivnvGnqqhKo4mUieTYWRBUvxsgj5sAQMMBBfDPJDXEQ3+rCEBoAcb651KdshvgiXpUuDCBVGRM2clYtFQALgiVe9KgBvBBM8WYAKwRbvAtAC7FCvBsAhVglngIwg6i7DnX77fdw00c8avUnLo+Gm3vHsRgNYJIEpfGNnKACABA05xtMAPSxgt8BNQVaAqB42imWuoTO9vmf30aRJoWMGe0wyG+uJaQRphmLCHcvIYsgyzszGFMCHiGedymNjCGAUcO0hJgTs2rBS4g1Idj44GanAZAjcbsTojWky65V6kGth4Bdmu0kl1xsNRGPvlqcOXnH//A3cIc4ZM4AQFxaOSYSWOkuUjsSQFxaOSYSWOkuUvsDy1jwMY9xWDsAAAAASUVORK5CYII=');
background-color: rgb(217, 83, 79);
}
/* sucess.png 白色 */
.status-4 .verify-move-block{
background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABdklEQVRoQ+2XsUrEUBBFz/zZ+hGujYKFhaiFhYWFIGJhYWFhYWEhaCPuT+xP6O+MLExgCWQ3781kN4HZLvDe5Jx7H5tEmPhPJs5PCuy7wWwgG3AmkEfIGaB7ezbgjtA5IBtwBujeng24I+wYoKqHwAXwICLLrvuMsgGD/zHopYgcTEagBf8LzEXkbxICpfArqdEcoRr40QjUwo9CwAO/dwEvfG8BVZ1t+i+ueRZEwPcSWLvRQkTmNbDtPVHwfQVOgE+DcEtEwvcSWC1S1W/gyCsRDd9bwCS+gONaiSHgiwRM4gM4LZUYCr5YwCTegbO+EkPCVwmYxBtwvk1iaPhqAZN4Ba66JHYB7xIwiRfgui2xK3i3gEk8AzeNBLAAmo+Rre/z3gdjyOu0qj4Bty2YweFDGmigVfURuLPrncCHCthxugdmwOWmz0DvsVnfH3KEIoFKZ6VAaWLR67OB6ERL52UDpYlFr88GohMtnZcNlCYWvX7yDfwDJjy0MYrd6EIAAAAASUVORK5CYII=');
background-color: rgb(92, 184, 92);
}

.verify-sub-block {
position: absolute;
text-align: center;
z-index: 3;
}
.aj-captcha image {
  margin-top: 0;
}
</style>