<template>
  <!--pages/mall/solitaire/solitaireList/solitaireList.wxml-->
  <navigationBar
    :title="state.navigationBarTitle"
    background="transparent"
    leftClass="opacity"
    extStyle="position: fixed; z-index: 90"
  ></navigationBar>
  <view class="loading-box" :hidden="state.show">
    <loading></loading>
  </view>
  <view class="solitaire-background">
    <image
      class="background"
      :src="state.imagesPath.solitairelistBg"
      lazy-load="false"
      @error=""
      @load=""
    ></image>
  </view>
  <view class="solitaire-list" :hidden="!state.show">
    <view
      class="solitaire-item"
      v-for="(item, index) in state.solitaireList"
      :key="id"
      :data-id="item.id"
      :data-business="item.business"
      @click="toSolitaireDetails"
    >
      <view class="solitaire-left">
        <view class="solitaire-img">
          <view
            class="solitaire-img-item"
            v-for="(item, index) in item.images"
            :key="index"
            v-if="index < 3"
          >
            <image mode="aspectFill" :src="item.url"></image>
          </view>
        </view>
      </view>
      <view class="solitaire-right">
        <view class="solitaire-name">{{ item.name }}</view>
        <view class="number-button">
          <!-- <text class="number" wx:if="{{item.joinCount>0}}">已团{{item.joinCount}}</text> -->
          <!-- <text class="number"></text> -->
          <view class="active-time">{{ item.showTime }}结束</view>
          <button class="enable">我要接龙</button>
        </view>
      </view>
      <!-- <view class="solitaire-join">
			<view class="item" wx:for="{{item.records}}" wx:for-item="ele" wx:key="id">
				<view class="info">
					<view class="order">{{ele.orderNumber}}</view>
                    <image src="{{ele.avatar}}"></image>
                    <text class="name">{{ele.nickName}}</text>
                    <view class="time">{{ele.time}}</view>
		        </view>
                <text class="num" wx:if="{{ele.status !== 'REFUND'}}">+{{ele.buyCount}}</text>
                <text class="num refund" wx:else>已取消接龙</text>
			</view>
		</view> -->
    </view>
    <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">
      正在加载...
    </button>
    <view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view>
    <view class="no-data" :hidden="state.solitaireList.length > 0">
      <image :src="state.imagesPath.imgNoData"></image>
      <button
        :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
        @click="toIndex"
      >
        随便逛逛
      </button>
    </view>
  </view>
</template>
<script setup>
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
import _apiSolitaireServiceJs from '@/service/api/newretail/solitaireService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import loading from '@/pages-sub/newretail/components/loading/loading.vue'
const app = getApp()

// pages/mall/solitaire/solitaireList/solitaireList.js
const solitaireService = _apiSolitaireServiceJs
const wxaUserService = _apiWxaUserServiceJs
const IMAGESPATH = _utilsImagesPathJs
const ADDRESS = _utilsAddressJs
const NAVPAGE = _utilsNavPageJs
const themeManager = _utilsThemeManagerJs
const util = _utilsUtilsJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
// 获取应用实例
const state = reactive({
  navigationBarTitle: '接龙列表',
  show: false,
  imagesPath: IMAGESPATH,
  theme: themeManager,
  page: 1,
  pageSize: 10,
  pageCount: 1,
  noMore: false,
  loading: false,
  storeId: '',
  solitaireList: [],
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
})
const customData = {
  query: false,
  timeId: {},
}
onLoad(function (options) {
  const self = this
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    // 统计PV
    state.storeName = app.globalData.storeInfo.name
    state.storeId = app.globalData.storeInfo.id
    state.theme = {
      color:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? app.globalData.uiconfig.themeColor
          : uni.getStorageSync('themeColor') || '#FF9F43',
      mainColor:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'color: ' + app.globalData.uiconfig.themeColor + ';'
          : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
      mainBgColor:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'background: ' + app.globalData.uiconfig.themeColor + ';'
          : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
      borderColor:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';'
          : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
      mainBgGradient:
        app.globalData.uiconfig &&
        app.globalData.uiconfig.themeColor != null &&
        app.globalData.uiconfig.themeColor !== '#FF9F43'
          ? 'background: linear-gradient(-270deg, ' +
            app.globalData.uiconfig.themeColor +
            ', ' +
            app.globalData.uiconfig.themeColor +
            ');'
          : 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
      mainColorRgb:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
          : 'color:rgba(255,159,67, 0.4);',
      borderColorRgb:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
          : 'border-color:rgba(255,159,67, 0.4);',
      mainColorRgb02:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
          : 'rgba(255,159,67, 0.2)',
      BgColorRgb01:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
          : 'background-color:rgba(255,159,67, 0.1);',
    }
    state.themeColor =
      app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor')
    ANALYSIS.PVStatistics(state.storeId)
    querySolitaire(1)
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation().then((res) => {
      app.globalData.storeInfo = res
      // 统计PV
      state.storeName = res.name
      state.storeId = res.id
      ANALYSIS.PVStatistics(res.id)
      querySolitaire(1)
    })
  }
  if (options.scene) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(options.scene)
    if (scene.indexOf('gmparam=') >= 0) {
      const sceneArr = scene.split('gmparam=')
      const sceneId = sceneArr[1]
      if (sceneId != null) {
        getSceneById(sceneId)
      }
    } else if (scene !== 'isfromQR') {
      // 设置分享信息
      setSharePeopleInfo(options, 'group')
    }
  } else {
    // 设置分享信息
    setSharePeopleInfo(options, 'solitaire')
  }
})
onReady(function () {})
onShow(function () {
  if (state.storeId !== '') {
    querySolitaire(1)
  }
})
onHide(function () {
  uni.hideLoading()
  for (const key in customData.timeId) {
    if (customData.timeId.hasOwnProperty(key)) {
      const ele = customData.timeId[key]
      clearTimeout(ele)
    }
  }
})
onUnload(function () {
  uni.hideLoading()
  for (const key in customData.timeId) {
    if (customData.timeId.hasOwnProperty(key)) {
      const ele = customData.timeId[key]
      clearTimeout(ele)
    }
  }
})
onPullDownRefresh(function () {
  state.page = 1
  state.pageCount = 1
  state.noMore = false
  state.solitaireList = []
  querySolitaire(1)
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true
    let page = state.page
    ++page
    querySolitaire(page)
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.solitaireList.length > 0) {
      state.noMore = true
    } else {
      uni.showToast({
        title: '没有更多数据~',
        icon: 'none',
        duration: 2000,
      })
    }
  }
})
onShareAppMessage(function () {
  const self = this
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id
    return {
      title: '',
      path:
        '/pages-sub/newretail/pages/mall/solitaire/solitaireList/solitaireList?shareId=' +
        memberId +
        '&storeId=' +
        state.storeId +
        '&mallType=' +
        state.mallType,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  } else {
    return {
      title: '',
      path:
        '/pages-sub/newretail/pages/mall/solitaire/solitaireList/solitaireList?storeId=' +
        state.storeId +
        '&mallType=' +
        state.mallType,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  }
})
function setSharePeopleInfo(options, type) {
  const shareData = {
    shareId: null,
    type,
    productId: '',
  }
  if (options.scene) {
    const scene = decodeURIComponent(options.scene)
    if (scene !== 'isfromQR') {
      shareData.shareId = scene
      // 分享信息打开统计
      ANALYSIS.ShareOpenAnalysis()
    }
  } else if (options.shareId && options.shareId != '' && options.shareId != null) {
    shareData.shareId = options.shareId
  }
  if (shareData.shareId) {
    if (app.globalData.isShoppingGuidanceRecordGoods) {
      util.setSharingPersonInfo(shareData)
    } else {
      try {
        uni.setStorageSync('wj_sharingId', shareData.shareId)
      } catch (e) {}
    }
  }
}
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures
  }
}
function getSceneById(id) {
  const self = this
  wxaUserService
    .getSceneById(id)
    .then((res) => {
      function urlToObj(str) {
        const obj = {}
        const arr = str.split('&')
        for (let i = 0; i < arr.length; i++) {
          const ele = arr[i].split('=')
          obj[ele[0]] = ele[1]
        }
        return obj
      }
      const _options = urlToObj(res)
      options = _options
      onLoad(_options)
      // 设置分享信息
      setSharePeopleInfo(_options, 'solitaire')
      if (_options.shareId != null && _options.shareId !== '') {
        // 分享信息打开统计
        ANALYSIS.ShareOpenAnalysis()
      }
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
function querySolitaire(page) {
  const self = this
  uni.showLoading({
    title: '加载中',
  })
  const postData = {
    page,
    pageSize: state.pageSize,
    searchCount: true,
    status: 'STARTED',
    storeIdIn: state.storeId,
  }
  if (customData.query) {
    console.log('已经在查询中~')
    return
  }
  customData.query = true
  solitaireService
    .query(postData)
    .then((res) => {
      customData.query = false
      uni.hideLoading()
      state.teamBuyCount = res.pageCount
      const solitaireList = []
      if (res.records && res.records.length > 0) {
        res.records.forEach((item) => {
          const tempItem = {
            ...item,
            showTime: formateEndTImeShow(item.endTime),
            records: [],
          }
          const records = []
          item.records.forEach((ele) => {
            const len = ele.nickName.length - 1
            let nickName = ele.nickName.slice(0, 1)
            for (let i = 0; i < len; i++) {
              nickName = nickName + '*'
            }
            records.push({
              ...ele,
              nickName,
            })
          })
          tempItem.records = records
          const timeList = []
          records.forEach((ele) => {
            timeList.push({
              id: ele.id,
              time: ele.createTime,
            })
          })
          handleRecordsTime(timeList, item.id)
          solitaireList.push(tempItem)
        })
        let tempSolitaireList = state.solitaireList
        if (page === 1) {
          tempSolitaireList = []
        }
        tempSolitaireList = tempSolitaireList.concat(solitaireList)
        console.log(tempSolitaireList)
        const pageCount = parseInt(res.recordCount / res.pageSize) + 1
        state.solitaireList = tempSolitaireList
        state.page = res.page
        state.pageCount = pageCount
      } else if (page === 1) {
        state.solitaireList = solitaireList
      }
      if (state.loading) {
        state.loading = false
      }
      state.show = true
    })
    .catch((err) => {
      uni.hideLoading()
      state.show = true
      if (state.loading) {
        state.loading = false
      }
      customData.query = false
      util.showToast(err.message)
    })
}
function formateEndTImeShow(timestamp) {
  // 将时间戳转换为 Date 对象
  const date = new Date(timestamp)

  // 获取年月日时分
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // 补充0
  const day = date.getDate().toString().padStart(2, '0') // 补充0
  const hour = date.getHours().toString().padStart(2, '0') // 补充0
  const minute = date.getMinutes().toString().padStart(2, '0') // 补充0

  // 格式化为目标格式
  const formattedDate = `${month}月${day}日 ${hour}:${minute}`
  return formattedDate
}
function handleRecordsTime(timeList, solitaireId) {
  const self = this
  customData.timeId[solitaireId] = 0
  timeLoop()
  function timeLoop() {
    clearTimeout(customData.timeId[solitaireId])
    const timeId = setTimeout(() => {
      const time = util.timePassed(timeList, false)
      let index = null
      for (let j = 0; j < time.length; j++) {
        const item = time[j]
        let showTime = ''
        if (item.day !== '00' && item.day !== 0) {
          showTime = item.day + '天前'
        } else if (item.hou !== '00' && item.hou !== 0) {
          showTime = item.hou + '小时前'
        } else if (item.min !== '00' && item.min !== 0) {
          showTime = item.min + '分钟前'
        } else if (item.sec !== '00' && item.sec !== 0) {
          showTime = item.sec + '秒前'
        }
        for (let i = 0; i < state.solitaireList.length; i++) {
          const it = state.solitaireList[i]
          if (it.id === solitaireId) {
            index = i
            for (let k = 0; k < it.records.length; k++) {
              const ele = it.records[k]
              if (item.id === ele.id) {
                it.records[k].time = showTime
                break
              }
            }
            break
          }
        }
      }
      if (index !== null) {
        state[`solitaireList[${index}]`] = state.solitaireList[index]
      }
      timeLoop()
    }, 1000)
    customData.timeId[solitaireId] = timeId
  }
}
function toSolitaireDetails(e) {
  const opts = '?id=' + e.currentTarget.dataset.id
  NAVPAGE.toSolitaireDetails(opts)
}
function toIndex() {
  NAVPAGE.toHome()
}
</script>
<style scoped>
/* pages/mall/solitaire/solitaireList/solitaireList.wxss */
/* @import "../../../../common/common.wxss"; */

page {
  background: #eee;
  padding-bottom: 120rpx;
}
.solitaire-background {
  width: 100%;
  height: 341rpx;
  overflow: hidden;
  position: relative;
}

.solitaire-background image.background {
  width: 100%;
  height: 341rpx;
  position: absolute;
  left: 0;
  top: 0;
}
.solitaire-list {
  position: relative;
  top: -148rpx;
}
.solitaire-item {
  width: 710rpx;
  height: 240rpx;
  background: #ffffff;
  box-shadow: 0px 0px 10rpx 0px rgba(238, 238, 238, 0.5);
  border-radius: 20rpx;
  margin: 24rpx auto;
  padding: 20rpx;
  box-sizing: border-box;
  /* background-color: #fff;
  margin-top: 20rpx;
  padding: 30rpx 52rpx 22rpx 52rpx; */
  display: flex;
  align-items: center;
}
.solitaire-left {
  width: 198rpx;
  height: 198rpx;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
}
.solitaire-left .solitaire-img {
  display: block;
  width: 100%;
  height: 100%;
}
.solitaire-right {
  height: 100%;
  margin-left: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.solitaire-right .solitaire-name {
  width: 427rpx;
  height: 65rpx;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 30rpx;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
}

.solitaire-right .number-button {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  width: 444rpx;
  height: 107rpx;
  background: url(https://gomore-dshx.oss-cn-hangzhou.aliyuncs.com/image/solitaire_time_bg.png);
  background-size: 100% 100%;
  position: relative;
  top: 37rpx;
}
.solitaire-right .number-button .enable {
  width: 163rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #ffffff;
  background: none;
  padding: 0;
  margin: 0;
}
.solitaire-right .number-button .active-time {
  width: 286rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  color: #f41d0c;
  text-align: center;
}
.solitaire-img image {
  width: 206rpx;
  height: 206rpx;
  background-color: #eee;
}

.solitaire-img .solitaire-img-item:last-of-type {
  margin-right: 0;
}

.solitaire-join {
  margin-top: 27rpx;
}

.solitaire-join .item {
  display: flex;
  justify-content: space-between;
  padding: 7rpx 0;
  font-size: 28rpx;
}

.solitaire-join .item .info {
  display: flex;
  font-size: 28rpx;
  line-height: 52rpx;
  color: #38373a;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.solitaire-join .item .order {
  margin-right: 12rpx;
}

.solitaire-join .item image {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background-color: #eee;
  margin-right: 20rpx;
}

.solitaire-join .item .name {
  min-width: 40rpx;
  margin-right: 20rpx;
}

.solitaire-join .item .time {
  color: #d4d4d6;
}

.solitaire-join .item .num {
}

.solitaire-join .item .num.refund {
  color: #8b8b8c;
}

/* .number-button .number {
  font-size: 26rpx;
  color: #d4594e;
}

.number-button button {
  width: 220rpx;
  height: 68rpx;
  padding: 0;
  border-radius: 34rpx;
  background: linear-gradient(90deg, rgba(255, 159, 67, 1), rgba(238, 82, 83, 1));
  color: #fff;
  border: none;
  outline: none;
  font-size: 28rpx;
  line-height: 68rpx;
  margin: 0;
} */

.number-button button::after {
  border: none;
}

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data image {
  margin-top: 30%;
  width: 242rpx;
  height: 261rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: transparent;
  font-size: 24rpx;
  line-height: 60rpx;
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #fff;
  border-radius: 0;
}

.loading-btn::after {
  border: 0;
}

.order-end {
  color: #009136;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
}
</style>
