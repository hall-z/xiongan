<template>
  <!-- pages/selectStore/selectStore.wxml -->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>

  <view class="loading-box" :hidden="state.show">
    <loading></loading>
  </view>
  <view v-if="state.show" class="store-top-search">
    <view class="current-position" @click="toSelectAddress">
      <view class="left-info">
        <view class="title">
          <image class="position-icon" :src="state.imagesPath.iconStorePosition"></image>
          <!-- <text>当前位置</text> -->
        </view>
        <view class="address-info">
          <view>{{ state.currentAddress.name }}</view>
          <view>{{ state.currentAddress.address }}</view>
        </view>
      </view>
      <image class="right-icon" :src="state.imagesPath.iconRight2"></image>
    </view>
    <!--<template is="searchAddress" :data="state.searchLabelShow, state.searchText, state.imagesPath"></template>-->
  </view>
  <view class="content" :hidden="!state.show" style="overflow: hidden">
    <!-- <view class='current-position' bindtap="toSelectAddress">
    <view class="left-info">
      <view class="title">
        <image class="position-icon" src="{{state.imagesPath.iconStorePosition}}" ></image>
        <text>当前位置</text>
      </view>
      <view class="address-info">
        <view>{{state.currentAddress.name}}</view>
        <view>{{state.currentAddress.address}}</view>
      </view>
    </view>
    <image class="right-icon" src="{{state.imagesPath.iconRight2}}" ></image>
  </view> -->
    <view class="near-store-title">
      <view>
        附近门店
        <text>如找不到对应门店，请下拉刷新</text>
      </view>
    </view>
    <view class="address-item" v-for="(item, index) in state.storeList" :key="id">
      <image
        v-if="item.imageUrl"
        @click="clickStore"
        :data-obj="item"
        :data-key="index"
        :src="item.imageUrl"
        mode="widthFix"
        style="width: 100%"
      ></image>
      <view
        :class="'store-item ' + (item.active == true ? 'active' : '')"
        @click="clickStore"
        :data-obj="item"
        :data-key="index"
        :hidden="state.noStoreData"
      >
        <view class="address">
          <view>{{ item.name }}</view>
          <view class="info" :data-key="index">
            <text>{{ item.distance || '' }}km</text>
            <text>{{ item.address }}</text>
          </view>
        </view>
        <view class="navigation" :data-key="index" @click.stop="navToStore">
          <image :src="state.imagesPath.iconStoreNav"></image>
          <text>到这去</text>
        </view>
        <image class="selected" :src="state.imagesPath.iconStoreChecked"></image>
      </view>
      <view class="time-box-store">
        <view class="time-item">
          <image :src="state.imagesPath.time_new_icon" mode="widthFix"></image>
          <view>营业时间 {{ item.storeHours }}</view>
        </view>
        <view class="time-item" @click.stop="doPhone" :data-phone="item.tel">
          <image :src="state.imagesPath.phone_new_icon" mode="widthFix"></image>
          <view>{{ item.tel }}</view>
        </view>
        <view
          class="time-item enterpriseWechat"
          @click.stop="showEnterpriseWechat"
          v-if="item.enterpriseWechatImg"
          :data-item="item"
          :data-url="item.enterpriseWechatImg"
        >
          <image :src="state.imagesPath.enterpriseWechatIcon" mode="widthFix"></image>
          <view>添加客服</view>
        </view>
      </view>
      <view class="seat"></view>
    </view>
  </view>
  <!-- <view class="loading" hidden="{{refresh || storeList.length==0}}">已为您匹配最近的门店</view> -->
  <view class="loading" :hidden="!state.show || state.loading">正在加载中...</view>
  <view class="no-data" :hidden="!state.show || state.storeList.length > 0">
    <image :src="state.imagesPath.imgNoData"></image>
  </view>

  <popup
    :show="state.previewImageShow"
    position="middle"
    custom-class="middle"
    @close="toggleImagePopup"
  >
    <view class="image-modal-content">
      <view class="store-name" :style="state.theme && state.theme.mainBgColor">
        选择门店
        <picker
          mode="selector"
          @change="handleSelectStoreChange"
          range-key="name"
          :value="state.selectStoreIndex"
          :range="state.storeSelectList"
        >
          <view class="picker">
            <view>
              {{ state.selectStore.name }}
            </view>
            <image
              :src="state.imagesPath.navigation_bar_btn_goback"
              class="up-icon"
              mode="widthFix"
            ></image>
          </view>
        </picker>
      </view>
      <view v-if="!state.previewImage" class="no-url-text">当前门店暂无客服信息</view>
      <view
        class="image-box"
        :style="state.theme && state.theme.BgColorRgb01"
        v-if="state.previewImage"
      >
        <image :src="state.previewImage" mode="widthFix" show-menu-by-longpress=""></image>
        <view class="scan-tip">长按识别二维码加入</view>
      </view>
    </view>
    <image
      :src="state.imagesPath.iconCloseImg"
      class="close-btn"
      @click.stop="toggleImagePopup"
      mode="widthFix"
      show-menu-by-longpress=""
    ></image>
  </popup>
  <refresh-notify></refresh-notify>
</template>
<script setup>
import _apiDistributionServiceJs from '@/service/api/newretail/distributionService'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _libsQqmapWxJssdkMinJs from '@/libs/qqmap-wx-jssdk'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _utilsUtilsJs from '@/utils/newretail/utils'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import loading from '@/pages-sub/newretail/components/loading/loading.vue'
const app = getApp()

// pages/selectStore/selectStore.js
const util = _utilsUtilsJs
const storeService = _apiStoreServiceJs
const memberService = _apiMemberServiceJs
const IMGAGESPATH = _utilsImagesPathJs
const sysService = _apiSystemServiceJs
// 获取应用实例
const QQMapWX = _libsQqmapWxJssdkMinJs
let qqmapsdk
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const ADDRESS = _utilsAddressJs
const distributionService = _apiDistributionServiceJs
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
const state = reactive({
  theme: {},
  previewImageShow: false,
  storeSelectList: [],
  selectStoreIndex: 0,
  selectStore: {},
  previewImage: '',
  searchItem: '',
  navigationBarTitle: '选择门店',
  imagesPath: IMGAGESPATH,
  searchLabelShow: false,
  searchText: '搜索门店',
  currentAddress: {},
  storeList: [],
  allStoreList: [],
  page: 1,
  loading: true,
  noStoreData: false,
  refresh: false,
  show: false,
  latitude: '',
  longitude: '',
})
function getAllStoreSelectList() {
  storeService
    .queryList(null, 0)
    .then((res) => {
      state.storeSelectList = res.filter((item) => {
        return item.virtualStore === 0
      })
    })
    .catch((err) => {})
}
function handleSelectStoreChange(e) {
  state.selectStore = state.storeSelectList[e.detail.value]
  state.previewImage = state.storeSelectList[e.detail.value].enterpriseWechatImg
}
function handleFocus(e) {
  state.searchLabelShow = true
}
function handleBlur(e) {
  if (!e.detail.value) {
    state.searchLabelShow = false
  } else {
    state.searchLabelShow = true
  }
}
function hadleStoreOrder(latitude, longitude) {
  const self = this
  let allStores = []
  try {
    allStores = uni.getStorageSync('wj_allStores') // 获取缓存的所有门店
    if (refreshAllStore) {
      // 下拉刷新直接取本地已经重新查询的门店，不用再查下增量门店
      handleStoreInfo(allStores)
      return
    }
    const now = new util.ResponseDate()
    const nowDate = util.formatTime(now).replace(/\//g, '-')
    const tempTimeArr = nowDate.split(' ')
    let startTime = tempTimeArr[0] + ' 00:00:00'
    const tempTermValidity = tempTimeArr[0] + ' 23:59:59'
    // 增量查询门店
    const lastTime = uni.getStorageSync('wj_queryStoreTime') // 获取上次查询门店的增量信息
    if (lastTime && util.validateDateTime(lastTime)) {
      startTime = lastTime
    }
    // 根据缓存的上一次获取门店列表的时间查询增量门店信息
    storeService
      .queryList(allStores && allStores.length > 0 ? startTime : null)
      .then((res) => {
        const tempAllStores = [].concat(allStores)
        res.forEach((item) => {
          let hasThisStore = false
          tempAllStores.forEach((ele, index) => {
            if (item.id === ele.id && item.virtualStoreId === ele.virtualStoreId) {
              hasThisStore = true
              tempAllStores[index] = item
            }
          })
          if (!hasThisStore) {
            if (item.status === 'OPEN') {
              tempAllStores.push(item)
            }
          }
        })
        const newAllStores = []
        tempAllStores.forEach((item) => {
          if (item.status === 'OPEN') {
            newAllStores.push(item)
          }
        })
        try {
          uni.setStorageSync('wj_allStores', newAllStores)
          uni.setStorageSync('wj_queryStoreTimeCount', tempTermValidity)
        } catch (e) {
          console.log(e)
        }
        handleStoreInfo(newAllStores)
      })
      .catch((err) => {
        console.log(err.message)
        handleStoreInfo(allStores)
      })
    /**
     * 处理门店数据
     * @param allStores 所有门店信息
     */
    function handleStoreInfo(allStores) {
      const distanceArr = []
      let newArr = []
      if (allStores.length > 0) {
        allStores.forEach((item) => {
          const dis = util.distance(latitude, longitude, item.latitude, item.longitude)
          distanceArr.push({
            distance: dis,
            id: item.virtualStoreId || item.id,
          })
        })
      }
      newArr = [].concat(distanceArr) // newArr为一个新的数组，不是简单的赋值引用
      function compare(property) {
        return function (a, b) {
          const value1 = a[property]
          const value2 = b[property]
          return value1 - value2
        }
      }
      newArr.sort(compare('distance')) // newArr已经按照从小到大的顺序进行排列, 根据对象中的distance属性进行排序

      // 将allStores中的信息进行排列，按照距离从小到大的顺序
      const newTempAllStore = []
      for (let i = 0; i < newArr.length; i++) {
        for (let j = 0; j < distanceArr.length; j++) {
          if (newArr[i].id == distanceArr[j].id) {
            allStores[j].userLatitude = newArr[i].latitude // 加入用户经纬度
            allStores[j].userLongitude = newArr[i].longitude // 加入用户经纬度
            allStores[j].distance = newArr[i].distance // 加入距离参数
            newTempAllStore.push(allStores[j]) // j的顺序与allStore中的数据顺序一致
          }
        }
      }
      try {
        //   wx.setStorageSync('wj_allStores', newTempAllStore)
      } catch (e) {
        console.log(e)
      }
      const tempData = []
      for (let i = 0; i < newTempAllStore.length; i++) {
        const obj = {
          ...newTempAllStore[i],
          id: newTempAllStore[i].id,
          name: newTempAllStore[i].name,
          address: newTempAllStore[i].address,
          userLatitude: newTempAllStore[i].userLatitude,
          userLongitude: newTempAllStore[i].userLongitude,
          wxCode: newTempAllStore[i].wxCode,
          distance: newArr[i] && newArr[i].distance ? newArr[i].distance.toFixed(2) : null,
          latitude: newTempAllStore[i].latitude,
          longitude: newTempAllStore[i].longitude,
          storeHours: newTempAllStore[i].storeHours,
          shipmentTypes: newTempAllStore[i].shipmentTypes,
          tel: newTempAllStore[i].tel,
          active: false,
          imageUrl: newTempAllStore[i].imageUrl,
        }
        if (
          app.globalData.storeInfo &&
          app.globalData.storeInfo.id == obj.id &&
          app.globalData.storeInfo.id === obj.virtualStoreId
        ) {
          obj.active = true
        }
        if (
          !tempData.some((item) => item.id === obj.id && item.virtualStoreId === obj.virtualStoreId)
        ) {
          tempData.push(obj)
        }
        // if (app.globalData.storeInfo && app.globalData.storeInfo.id == newTempAllStore[i].id) {
        //   //tempData.push(app.globalData.storeInfo)
        //   tempData.push({
        //     id: newTempAllStore[i].id,
        //     name: newTempAllStore[i].name,
        //     address: newTempAllStore[i].address,
        //     userLatitude: newTempAllStore[i].userLatitude,
        //     userLongitude: newTempAllStore[i].userLongitude,
        //     wxCode: newTempAllStore[i].wxCode,
        //     distance: newArr[i] && newArr[i].distance ? newArr[i].distance.toFixed(2) : null,
        //     latitude: newTempAllStore[i].latitude,
        //     longitude: newTempAllStore[i].longitude,
        //     storeHours: newTempAllStore[i].storeHours,
        //     shipmentTypes: newTempAllStore[i].shipmentTypes,
        //     tel: newTempAllStore[i].tel,
        //     active: true,
        //     imageUrl: newTempAllStore[i].imageUrl
        //   })
        // } else {
        //   tempData.push({
        //     id: newTempAllStore[i].id,
        //     name: newTempAllStore[i].name,
        //     address: newTempAllStore[i].address,
        //     userLatitude: newTempAllStore[i].userLatitude,
        //     userLongitude: newTempAllStore[i].userLongitude,
        //     wxCode: newTempAllStore[i].wxCode,
        //     distance: newArr[i] && newArr[i].distance ? newArr[i].distance.toFixed(2) : null,
        //     latitude: newTempAllStore[i].latitude,
        //     longitude: newTempAllStore[i].longitude,
        //     storeHours: newTempAllStore[i].storeHours,
        //     shipmentTypes: newTempAllStore[i].shipmentTypes,
        //     tel: newTempAllStore[i].tel,
        //     active: false,
        //     imageUrl: newTempAllStore[i].imageUrl
        //   })
        // }
      }
      const newTempData = []
      if (tempData.length > 20) {
        for (let i = 0; i < 20; i++) {
          newTempData.push(tempData[i])
        }
      } else {
        for (let i = 0; i < tempData.length; i++) {
          newTempData.push(tempData[i])
        }
      }
      console.log(newTempData)
      state.storeList = newTempData
      state.allStoreList = tempData
      state.noStoreData = false
      state.refresh = false
      state.show = true
      if (refreshAllStore) {
        refreshAllStore = false
      }
    }
  } catch (e) {
    console.log(e)
    if (refreshAllStore) {
      refreshAllStore = false
    }
  }
}
function getMapSet() {
  sysService
    .query('deliveryDistanceThirdMap')
    .then((res) => {
      console.log('res111', res)
      if (res && res.length > 0 && res[0].value != null) {
        app.globalData.systemConfigure.deliveryDistanceThirdMap = res[0].value
        let key = 'lbs_tianditu_appkey'
        if (res[0].value == 'TIANDITU') {
          key = 'lbs_tianditu_appkey'
        } else if (res[0].value == 'GAODE') {
          key = 'lbs_autonavi_key'
        }
        sysService
          .query(key)
          .then((res) => {
            if (res && res.length > 0 && res[0].value != null) {
              if (key == 'lbs_tianditu_appkey') {
                app.globalData.systemConfigure.lbsTiandituAppkey = res[0].value
              } else if (key == 'lbs_autonavi_key') {
                app.globalData.systemConfigure.lbsAutonaviAppkey = res[0].value
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
function danleStoreListInfo(self, latitude, longitude) {
  util.inverseAnalysisAddress(latitude, longitude).then((res) => {
    console.log(res, 'dsjfkdfj')
    if (res.data && res.data.result) {
      if (self.options && self.options.name) {
        self.setData({
          // 获取经过腾讯地图优化过的地理位置描述
          currentAddress: {
            name: self.options.name,
            address: self.options.address,
          },
        })
      } else if (self.options && !self.options.name && app.globalData.addressInfo) {
        self.setData({
          // 获取经过腾讯地图优化过的地理位置描述
          currentAddress: {
            name: app.globalData.addressInfo.name,
            address: app.globalData.addressInfo.address,
          },
        })
      } else {
        self.setData({
          // 获取经过腾讯地图优化过的地理位置描述
          currentAddress: {
            name: res.data.result.addressComponent.address,
            address: res.data.result.formatted_address,
          },
        })
      }
    }
  })
  // if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'TIANDITU' || app.globalData.systemConfigure.deliveryDistanceThirdMap == 'GAODE') {

  // } else {
  //     ADDRESS.getTenXunKey().then(() => {
  //         // 实例化API核心类
  //        qqmapsdk = new QQMapWX({
  //            //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
  //            key: app.globalData.systemConfigure.lbsTencentMiniappKey
  //        });
  //        qqmapsdk.reverseGeocoder({
  //         location: {
  //           latitude: latitude,
  //           longitude: longitude
  //         },
  //         success: function (res) {
  //           console.log(res)
  //           if (res.result) {
  //             if (self.options && self.options.name) {
  //               self.setData({
  //                 // 获取经过腾讯地图优化过的地理位置描述
  //                 currentAddress: {
  //                   name: self.options.name,
  //                   address: self.options.address
  //                 },
  //               })
  //             } else if (self.options && !self.options.name && app.globalData.addressInfo) {
  //               self.setData({
  //                 // 获取经过腾讯地图优化过的地理位置描述
  //                 currentAddress: {
  //                   name: app.globalData.addressInfo.name,
  //                   address: app.globalData.addressInfo.address
  //                 },
  //               })
  //             } else {
  //               self.setData({
  //                 // 获取经过腾讯地图优化过的地理位置描述
  //                 currentAddress: {
  //                   name: res.result.formatted_addresses.recommend,
  //                   address: res.result.address
  //                 },
  //               })
  //             }
  //           }
  //         },
  //         fail: function (res) {
  //           console.log(res);
  //           if (self.refreshAllStore) {
  //             self.refreshAllStore = false;
  //           }
  //         }
  //       })
  //    })

  // }
  self.hadleStoreOrder(latitude, longitude)
}
onLoad(function (options) {
  uni.hideShareMenu()
  console.log(options, app.globalData.storeInfo)
  refreshAllStore = false
  const self = this
  // 实例化API核心类
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey,
    })
  })

  // this.handleBeforeDanleStoreListInfo(self, self.options);
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
    state.selectStore = app.globalData.storeInfo
  }
  state.theme = {
    color:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color:' + app.globalData.uiconfig.themeColor + ';'
        : 'color:' + (uni.getStorageSync('themeColor') || '#FF9F43') + ';',
    mainBgColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background:' + app.globalData.uiconfig.themeColor + ';'
        : 'background:' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color:' + app.globalData.uiconfig.themeColor + ';'
        : 'border-color:' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient:
      app.globalData.uiconfig &&
      app.globalData.uiconfig.themeColor != null &&
      app.globalData.uiconfig.themeColor !== '#FF9F43'
        ? 'background:linear-gradient(-270deg, ' +
          app.globalData.uiconfig.themeColor +
          ', ' +
          app.globalData.uiconfig.themeColor +
          ');'
        : 'background:linear-gradient(-270deg, #FF9F43, #F13327);',
    mainColorRgb: 'color:#333;',
    borderColorRgb: 'border-color:#333;',
    mainColorRgb02:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
        : 'rgba(255,159,67, 0.2)',
    BgColorRgb01:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
        : 'background-color: rgba(246, 102, 0,0.1);',
  }
  getAllStoreSelectList()
})
function clickStore(e) {
  const storeInfo = app.globalData.storeInfo
  const pages = getCurrentPages()
  const prevpage = pages[pages.length - 2]
  state.storeList.map((item, index) => {
    if (e.currentTarget.dataset.key == index) {
      item.active = true
      if (prevpage.__route__ !== 'pages/mallModule/tabbar/selfLifting/selfLifting') {
        app.globalData.storeInfo = {
          ...item,
          userLatitude: storeInfo.userLatitude,
          userLongitude: storeInfo.userLongitude,
        }
        uni.setStorageSync('storeIdactive', app.globalData.storeInfo)
      }
      console.log(item)
      // 当前选中门店配送费规则
      getDistributionFeeRule(item.id)
    } else {
      item.active = false
    }
  })
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    recordVisitStore(app.globalData.storeInfo.id)
  }
  state.storeList = state.storeList
  console.log('prevpage', prevpage)
  if (prevpage.__route__ === 'pages/mallModule/tabbar/selfLifting/selfLifting') {
    console.log('e.currentTarget.dataset.obj', e.currentTarget.dataset.obj)
    uni.setStorageSync('storeIdactive', e.currentTarget.dataset.obj)
    uni.reLaunch({
      url: '/pages-sub/newretail/pages/mallModule/tabbar/selfLifting/selfLifting?changeFlag=1',
    })
  } else {
    uni.navigateBack({
      delta: 1,
    })
  }
}
function showEnterpriseWechat(e) {
  const url = e.currentTarget.dataset.url
  state.storeSelectList.some((item, idx) => {
    if (item.virtualStoreId == e.currentTarget.dataset.item.virtualStoreId) {
      state.selectStore = item
      state.selectStoreIndex = idx
    }
    return item.virtualStoreId == e.currentTarget.dataset.item.virtualStoreId
  })
  state.previewImage = url
  state.previewImageShow = true
}
function toggleImagePopup() {
  state.previewImage = ''
  state.previewImageShow = false
}
function doPhone(e) {
  console.log(e)
  // 调用微信的拨打电话API 安卓直接跳转到手机拨号页面  苹果要用户点击同意才跳转
  uni.makePhoneCall({
    phoneNumber: e.currentTarget.dataset.phone,
  })
}
function getDistributionFeeRule(storeId) {
  return
  distributionService
    .get(storeId)
    .then((res) => {
      const resArr = res ? Object.keys(res) : []
      if (res && resArr.length > 0) {
        console.log(res)
        uni.setStorageSync('wj_distributionFee', res)
      }
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
function navToStore(e) {
  let storeInfo = null
  state.storeList.forEach((item, index) => {
    if (e.currentTarget.dataset.key == index) {
      storeInfo = item
    }
  })
  if (storeInfo && storeInfo.longitude != null && storeInfo.longitude != null) {
    const latitude = parseFloat(storeInfo.latitude)
    const longitude = parseFloat(storeInfo.longitude)
    uni.openLocation({
      latitude,
      longitude,
      scale: 28,
      name: storeInfo.name,
      address: storeInfo.address,
    })
  }
}
function handleInput(e) {
  const allStores = uni.getStorageSync('wj_allStores') // 获取缓存的所有门店
  const distanceArr = []
  let newArr = []
  if (allStores.length > 0) {
    allStores.forEach((item) => {
      const dis = util.distance(state.latitude, state.longitude, item.latitude, item.longitude)
      distanceArr.push({
        distance: dis,
        id: item.virtualStoreId || item.id,
      })
    })
  }
  newArr = [].concat(distanceArr) // newArr为一个新的数组，不是简单的赋值引用
  function compare(property) {
    return function (a, b) {
      const value1 = a[property]
      const value2 = b[property]
      return value1 - value2
    }
  }
  newArr.sort(compare('distance')) // newArr已经按照从小到大的顺序进行排列, 根据对象中的distance属性进行排序

  // 将allStores中的信息进行排列，按照距离从小到大的顺序
  const newTempAllStore = []
  for (let i = 0; i < newArr.length; i++) {
    for (let j = 0; j < distanceArr.length; j++) {
      if (newArr[i].id == distanceArr[j].id) {
        allStores[j].userLatitude = newArr[i].latitude // 加入用户经纬度
        allStores[j].userLongitude = newArr[i].longitude // 加入用户经纬度
        allStores[j].distance = newArr[i].distance // 加入距离参数
        newTempAllStore.push(allStores[j]) // j的顺序与allStore中的数据顺序一致
      }
    }
  }
  state.searchItem = e.detail.value
  if (!e.detail.value) {
    const tempStoreList = []
    // var allStores = wx.getStorageSync('wj_allStores'); // 获取缓存的所有门店
    for (let i = 0; i < 20; i++) {
      if (!tempStoreList.some((item) => item.id === newTempAllStore[i].id)) {
        tempStoreList.push({
          ...newTempAllStore[i],
          id: newTempAllStore[i].id,
          name: newTempAllStore[i].name,
          address: newTempAllStore[i].address,
          userLatitude: newTempAllStore[i].userLatitude,
          userLongitude: newTempAllStore[i].userLongitude,
          wxCode: newTempAllStore[i].wxCode,
          distance: newTempAllStore[i].distance && newTempAllStore[i].distance.toFixed(2),
          latitude: newTempAllStore[i].latitude,
          longitude: newTempAllStore[i].longitude,
          storeHours: newTempAllStore[i].storeHours,
          shipmentTypes: newTempAllStore[i].shipmentTypes,
          tel: newTempAllStore[i].tel,
          active: false,
          imageUrl: newTempAllStore[i].imageUrl,
        })
      }
    }
    state.storeList = tempStoreList
  } else if (!state.searchLabelShow) {
    state.searchLabelShow = true
  }
}
function handleConfirm(e) {
  const allStores = uni.getStorageSync('wj_allStores') // 获取缓存的所有门店
  const distanceArr = []
  let newArr = []
  if (allStores.length > 0) {
    allStores.forEach((item) => {
      const dis = util.distance(state.latitude, state.longitude, item.latitude, item.longitude)
      distanceArr.push({
        distance: dis,
        id: item.virtualStoreId || item.id,
      })
    })
  }
  newArr = [].concat(distanceArr) // newArr为一个新的数组，不是简单的赋值引用
  function compare(property) {
    return function (a, b) {
      const value1 = a[property]
      const value2 = b[property]
      return value1 - value2
    }
  }
  newArr.sort(compare('distance')) // newArr已经按照从小到大的顺序进行排列, 根据对象中的distance属性进行排序

  // 将allStores中的信息进行排列，按照距离从小到大的顺序
  const newTempAllStore = []
  for (let i = 0; i < newArr.length; i++) {
    for (let j = 0; j < distanceArr.length; j++) {
      if (newArr[i].id == distanceArr[j].id) {
        allStores[j].userLatitude = newArr[i].latitude // 加入用户经纬度
        allStores[j].userLongitude = newArr[i].longitude // 加入用户经纬度
        allStores[j].distance = newArr[i].distance // 加入距离参数
        newTempAllStore.push(allStores[j]) // j的顺序与allStore中的数据顺序一致
      }
    }
  }
  console.log(e, state.searchItem)
  if (!e.detail.value && !state.searchItem) {
    state.searchLabelShow = false
    const tempStoreList = []
    // var allStores = wx.getStorageSync('wj_allStores'); // 获取缓存的所有门店
    // allStores = newTempAllStore
    for (let i = 0; i < newTempAllStore.length; i++) {
      if (!tempStoreList.some((item) => item.id === newTempAllStore[i].id)) {
        tempStoreList.push({
          ...newTempAllStore[i],
          id: newTempAllStore[i].id,
          name: newTempAllStore[i].name,
          address: newTempAllStore[i].address,
          userLatitude: newTempAllStore[i].userLatitude,
          userLongitude: newTempAllStore[i].userLongitude,
          wxCode: newTempAllStore[i].wxCode,
          distance: newTempAllStore[i].distance.toFixed(2),
          latitude: newTempAllStore[i].latitude,
          longitude: newTempAllStore[i].longitude,
          storeHours: newTempAllStore[i].storeHours,
          shipmentTypes: newTempAllStore[i].shipmentTypes,
          tel: newTempAllStore[i].tel,
          active: false,
          imageUrl: newTempAllStore[i].imageUrl,
        })
      }
    }
    state.storeList = tempStoreList
  } else {
    state.searchLabelShow = true
    console.log(e.detail.value, state.searchItem)
    const tempStoreList = []
    // var allStores = wx.getStorageSync('wj_allStores'); // 获取缓存的所有门店
    const reg = new RegExp(e.detail.value || state.searchItem)
    console.log(allStores)
    newTempAllStore.forEach((item, index) => {
      if (reg.test(item.name)) {
        console.log(item, index)
        if (!tempStoreList.some((v) => v.id === item.id)) {
          tempStoreList.push({
            ...item,
            id: item.id,
            name: item.name,
            address: item.address,
            userLatitude: item.userLatitude,
            userLongitude: item.userLongitude,
            wxCode: item.wxCode,
            distance: item.distance && item.distance.toFixed(2),
            latitude: item.latitude,
            longitude: item.longitude,
            storeHours: item.storeHours,
            shipmentTypes: item.shipmentTypes,
            tel: item.tel,
            active: false,
            imageUrl: item.imageUrl,
          })
        }
      }
    })
    state.storeList = tempStoreList
  }
}
onReady(function () {})
onShow(function () {
  getMapSet()
  state.noStoreData = true
  state.refresh = true
  state.show = false
  getAllStoreList()
  const newTempAllStore = state.allStoreList
  let tempData = []
  if (newTempAllStore.length > 0) {
    for (let i = 0; i < 20; i++) {
      tempData.push(newTempAllStore[i])
    }
  } else {
    tempData = []
  }
  state.storeList = tempData
  state.page = 1
  try {
    // wx.removeStorageSync('wj_allStores')
  } catch (e) {
    // Do something when catch error
  }
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {
  state.noStoreData = true
  state.refresh = true
  state.show = false
  getAllStoreList()
  const newTempAllStore = state.allStoreList
  let tempData = []
  if (newTempAllStore.length > 0) {
    for (let i = 0; i < 20; i++) {
      tempData.push(newTempAllStore[i])
    }
  } else {
    tempData = []
  }
  state.storeList = tempData
  state.page = 1
  console.log(tempData)
  uni.stopPullDownRefresh()
})
function getAllStoreList() {
  const self = this
  if (refreshAllStore) {
    return
  }
  refreshAllStore = true
  const tempAllStoreList = state.allStoreList
  state.storeList = []
  state.allStoreList = []
  state.page = 1
  storeService
    .queryList()
    .then((res) => {
      console.log(res)
      if (!res || res.length === 0) {
        state.show = false
        refreshAllStore = false
        return
      }
      const allStores = []
      res.forEach((item) => {
        if (item.status === 'OPEN') {
          allStores.push(item)
        }
      })
      try {
        uni.removeStorageSync('wj_allStores')
        uni.setStorageSync('wj_allStores', allStores)
        handleBeforeDanleStoreListInfo(self, options)
      } catch (e) {
        refreshAllStore = false
        console.log(e)
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000,
        })
      }
    })
    .catch((err) => {
      refreshAllStore = false
      state.show = false
    })
}
function handleBeforeDanleStoreListInfo(self, options) {
  let latitude = ''
  let longitude = ''
  // console.log(self.options, self.options.lat, self.options.lng)
  if (options && options.name && options.lat && options.lng) {
    app.globalData.addressInfo = options
    latitude = options.lat
    longitude = options.lng
    self.setData({
      currentAddress: options.name,
    })
    self.setData({
      latitude,
      longitude,
    })
    self.danleStoreListInfo(self, latitude, longitude)
  } else if ((!options || !options.name) && app.globalData.addressInfo) {
    latitude = app.globalData.addressInfo.lat
    longitude = app.globalData.addressInfo.lng
    self.setData({
      currentAddress: app.globalData.addressInfo.name,
    })
    self.setData({
      latitude,
      longitude,
    })
    self.danleStoreListInfo(self, latitude, longitude)
  } else {
    // 1、获取当前位置坐标
    uni.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res, 'errerr')
        latitude = res.latitude
        longitude = res.longitude
        // 2.根据当前位置，获取最近的几个门店信息
        self.danleStoreListInfo(self, latitude, longitude)
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
      fail: function (err) {
        const systemSetting = uni.getSystemSetting()
        if (systemSetting.locationEnabled) {
          uni.showToast({
            title: '您未开启GPS，门店距离获取失败~',
            icon: 'none',
            duration: 2000,
          })
        } else {
          uni.showToast({
            title: '您未开启定位，门店距离获取失败~',
            icon: 'none',
            duration: 2000,
          })
        }
        if (self.refreshAllStore) {
          self.refreshAllStore = false
        }
        self.hadleStoreOrder()
      },
    })
  }
}
onReachBottom(function () {
  loadList()
})
function loadList() {
  const that = this
  state.loading = true
  const result = []
  const newAllStoreList = state.allStoreList
  const tempStoreList = state.storeList
  let newStoreList = []
  let index = state.page
  const count = Math.ceil(newAllStoreList.length / 20)
  if (index === count) {
    uni.showToast({
      title: '已经加载到底了~',
      icon: 'none',
      duration: 2000,
    })
  } else {
    for (let i = 0; i < newAllStoreList.length; i += 20) {
      result.push(newAllStoreList.slice(i, i + 20))
    }
    newStoreList = tempStoreList.concat(result[index])
    index++
    console.log(newStoreList)
    setTimeout(() => {
      state.storeList = newStoreList
      state.page = index
    }, 500)
    state.loading = false
  }
}
onShareAppMessage(function () {})
function toSelectAddress() {
  const self = this
  uni.chooseLocation({
    success: function (res) {
      // success
      console.log(res)
      state.currentAddress = {
        name: res.name,
        address: res.address,
      }
      const location = {
        name: res.name,
        address: res.address,
        lat: res.latitude,
        lng: res.longitude,
      }
      options = location
      app.globalData.addressInfo = location
      hadleStoreOrder(res.latitude, res.longitude)
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    },
  })
}
function recordVisitStore(storeId) {
  if (app.globalData.systemConfigure.enableRecordVisitStore) {
    memberService
      .visitStore(storeId)
      .then((res) => {
        console.log(res)
      })
      .catch((e) => {
        console.log(e.message)
      })
  }
}
</script>
<style scoped>
/* pages/selectStore/selectStore.wxss */
/* @import "../../../../common/common.wxss"; */

page {
  background: #eee;
}

.content {
  /* padding: 0rpx 40rpx; */
  background: #fff;
  width: 100%;
  box-sizing: border-box;
}

.current-position {
  width: 100%;
  background: #fff;
  /* border-bottom: 1rpx solid #f1f1f1; */
  font-size: 28rpx;
  line-height: 48rpx;
  color: #454545;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* padding: 0 32rpx 17rpx 30rpx; */
  padding: 20rpx 32rpx 27rpx 30rpx;
  box-sizing: border-box;
}

.current-position .left-info .title {
  display: flex;
  align-items: center;
  margin-bottom: 34rpx;
}

.current-position .position-icon {
  width: 22rpx;
  height: 28rpx;
  margin-right: 13rpx;
  display: flex;
  align-items: center;
}

.current-position .left-info {
  display: flex;
  align-items: center;
}

.current-position .left-info .address-info {
  width: 630rpx;
}

.current-position .left-info .address-info > view {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.current-position .left-info .address-info > view:first-of-type {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  line-height: 36rpx;
}

.current-position .left-info .address-info > view:last-of-type {
  font-size: 24rpx;
  color: #8f8f8f;
  line-height: 34rpx;
}

.current-position .right-icon {
  width: 12rpx;
  height: 23rpx;
  /* margin-top: 57rpx; */
}

.near-store-title {
  width: 690rpx;
  height: 72rpx;
  padding: 0 70rpx;
  margin-left: -40rpx;
  /* background: #eee; */
  border-top: 1px solid #eee;
  line-height: 72rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.near-store-title text {
  font-size: 24rpx;
  color: #8f8f8f;
  font-weight: normal;
  margin-left: 8rpx;
}
.address-item {
  /* padding: 29rpx 0;
    background: #fff; */
}
.store-item {
  padding: 0 30rpx;
  /* height: 150rpx; */
  background: #fff;
  box-sizing: border-box;
  /* border-bottom: 1px solid #f1f1f1; */
  display: flex;
  position: relative;
  color: #454545;
  margin-top: 25rpx;
  justify-content: space-between;
}

.store-item view.address {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.store-item view.address view:first-of-type {
  font-size: 28rpx;
  line-height: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.store-item view.address .info {
  width: 576rpx;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-item view.address .info text {
  font-size: 24rpx;
  line-height: 30rpx;
}

.store-item view.address .info text:last-of-type {
  /* width: 376rpx; */
  display: box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  margin-left: 12rpx;
  padding-left: 12rpx;
}

.store-item view.address .info text:last-of-type::before {
  content: '';
  display: block;
  width: 2rpx;
  height: 28rpx;
  background: #89878b;
  position: absolute;
  left: 0;
  top: 0;
}

.store-item .navigation {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #666;
  height: 100%;
  justify-content: center;
}

.store-item .navigation image {
  width: 44rpx;
  height: 44rpx;
  margin-bottom: 8rpx;
}

.store-item image.selected {
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  top: 0;
  right: -40rpx;
  display: none;
}

.store-item.active {
  background: #fff;
}

.store-item.active image.selected {
  display: block;
}

.loading {
  color: #999;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  background: #eee;
}

.no-data {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 200rpx;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
}

.time-box-store {
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-sizing: border-box;
  margin-top: 17rpx;
}

.time-box-store .time-item {
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 24rpx;
  color: #3c3c3c;
  padding-bottom: 29rpx;
}
.time-box-store .time-item:nth-of-type(1) {
  margin-right: 45rpx;
}
.time-box-store .time-item image {
  width: 24rpx;
  max-height: 24rpx;
  margin-right: 12rpx;
}
.seat {
  width: 100%;
  height: 20rpx;
  background-color: #eee;
}
.store-top-search .search-main-addr input {
  text-align: left;
}
.store-top-search .search-main-addr label {
  text-align: left;
  padding-left: 70rpx;
  box-sizing: border-box;
  text-indent: 0;
}
.time-box-store .enterpriseWechat {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.time-box-store .enterpriseWechat image {
  width: 30rpx;
}

.image-modal-body {
  position: relative;
}

.image-modal-content {
  background: #fff;
  width: 624rpx;
  /* padding: 10rpx; */
  min-height: 356rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.image-box {
  width: 100%;
  padding: 40rpx 0;
  height: 640rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.scan-tip {
  margin-top: 40rpx;
  font-weight: bold;
  font-size: 36rpx;
  color: #333333;
}
.image-modal-content image {
  width: 90%;
  height: auto;
  max-height: 580rpx;
}
.close-btn {
  width: 62rpx;
  position: absolute;
  bottom: -90rpx;
  left: 50%;
  margin-left: -31rpx;
}
.store-name {
  display: flex;
  align-items: center;
  width: 100%;
  height: 126rpx;
  padding: 20rpx;
  box-sizing: border-box;
  color: #fff;
  font-size: 32rpx;
  justify-content: space-between;
}
.store-name picker {
  border-radius: 10rpx;
  flex: 1 1 auto;
  padding: 0 20rpx;
  height: 100%;
  max-width: 380rpx;
  background-color: #fff;
  color: #333333;
}
.store-name .picker {
  display: flex;
  align-items: center;
  width: 100%;
  height: 86rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.store-name .picker view {
  width: 340rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.store-name .picker .up-icon {
  width: 30rpx;
  max-height: 30rpx;
  margin-left: 20rpx;
  transform: rotate(-90deg);
}
.no-url-text {
  color: #666;
  height: 720rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}
</style>
