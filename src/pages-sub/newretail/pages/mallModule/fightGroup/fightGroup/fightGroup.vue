<template>
<navigationBar title="多人拼团"></navigationBar>
<view>
<view class="page-content" v-if="!state.loading">
  <!-- 切换门店 -->
  <!-- <view class="change-store" bindtap="changeStore">
    <text>{{state.storeName}}</text>
    <image class="right-img" src="{{state.imagesPath.iconIndexStoreRight}}" mode="widthFix" ></image>
  </view> -->
  <!-- 列表 -->
  <view v-for="(item , index) in state.list" :key="id">
    <view class="list-item" :id="item.id" :data-teamBuyId="item.id" data-easyScene="none" @click="toGoodsDetail">
      <view class="item-img-box">
        <!-- <text class="item-tips" style="background: {{item.color}};">{{item.memberCount}}人拼团</text> -->
        <image class="item-img" :src="item.img"></image>
        <view class="no-balance" mode="widthFix" :src="state.imagesPath.soldOutIcon" v-if="item.productBalance <= 0 && item.productBalance != null || item.storeStatus === 'OFF' || item.storeBalance <= 0">
          <view class="no-balance-cycle">
            <view class="no-balance-title">
              <view class="no-balance-title-text">
                {{item.storeStatus === 'OFF' ? '已下架' : '已售罄'}}
              </view>
              <view class="no-balance-title-english">
                SOLD OUT
              </view>
            </view>
          </view>
        </view>
        <!-- <image class="no-balance" mode="widthFix" src="{{state.imagesPath.soldOutIcon}}" wx:if="{{item.productBalance <= 0 && item.business !== 'DISTRIBUTION' && item.storeStatus !== 'OFF'}}"></image>
        <image class="no-balance" mode="widthFix" src="{{state.imagesPath.iconLowerShelf}}" wx:if="{{item.storeStatus === 'OFF'}}"></image> -->
      </view>
      <view class="item-info">
        <text class="item-name">{{item.name}}</text>
        <view class="item-middle">
          <text class="item-self-time" v-if="item.selfTakeTime">提货时间：{{item.selfTakeTime}}</text>
          <text class="item-time">距结束：{{item.days}}天</text>
        </view>
        <view class="price_btn_box">
          <view>
            <text class="item-price-box" :hidden="!item.nowPrice">￥<text class="item-nowPrice">{{filters.filtToFix(item.nowPrice)}}</text>{{item.style == 'SPEC_PARENT' ? '起' : ''}}
            <text class="item-oldPrice" v-if="item.oldPrice && item.nowPrice < item.oldPrice">￥{{filters.filtToFix(item.oldPrice)}}</text></text>
          </view>
          <button class="enable" :style="'background-color: ' + state.themeColor + ';'">去拼团
            <image :src="state.imagesPath.iconGroupRight"></image>
          </button>
        </view>
      </view>
    </view>
  </view>
  <view class="no-data" v-if="state.list.length === 0">
    <image :src="state.imagesPath.imgNoData"></image>
    <button :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'" size="mini" @click="toHome">随便逛逛</button>
  </view>
</view>
<view class="content-box" v-if="state.loading">
  <view class="spinner">
    <view class="rect1" :style="state.theme.mainBgColor"></view>
    <view class="rect2" :style="state.theme.mainBgColor"></view>
    <view class="rect3" :style="state.theme.mainBgColor"></view>
    <view class="rect4" :style="state.theme.mainBgColor"></view>
    <view class="rect5" :style="state.theme.mainBgColor"></view>
  </view>
</view>
<view :class="'tabbar-height ' + (isIphoneX ? 'iphoneX-height' : '')" v-if="state.showTabbar"></view>
<tabbar :tabbar="state.tabbar" :show="state.showTabbar" @popup="recorderPopup" v-if="!state.openCustomTabbar"></tabbar>
<!-- <custom-tab-bar :tabbar="state.tabbar" :show="state.showTabbar" v-if="state.openCustomTabbar"></custom-tab-bar>-->
<authorize @login="handleUserLogin" @tabBar="handleTabbar"></authorize></view>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _apiTeamBuyServiceJs from "@/service/api/newretail/teamBuyService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import tabbar from '@/pages-sub/newretail/components/tabbar/tabbar.vue';
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
const app = getApp();

// pages/fightGroup/fightGroup.js
const storeService = _apiStoreServiceJs;
const teamBuyService = _apiTeamBuyServiceJs;
const wxaUserService = _apiWxaUserServiceJs;
const util = _utilsUtilsJs;
const ADDRESS = _utilsAddressJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const selfA = _utilsSelfJs;
const themeManager = _utilsThemeManagerJs;

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
  navigationBarTitle: "多人拼团",
  imagesPath: IMGAGESPATH,
  tabbar: {},
  showTabbar: false,
  page: 1,
  pageSize: 10,
  teamBuyCount: 0,
  list: [],
  storeName: '',
  storeId: '',
  storeData: {},
  groupTimeId: '',
  loading: true,
  theme: themeManager,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  openCustomTabbar: false,
  hasEasyRecPlugins: false
});
let customData = {
  inQuery: false
};
function toGoodsDetail(val) {
  const that = this;
  let teamBuyId = val.currentTarget.dataset.teambuyid;
  let mobile = '';
  if (options.shareId) {
    mobile = options.shareId;
  }
  let opts = '?productId=' + teamBuyId + '&storeId=' + state.storeId + '&type=group' + '&shareId=' + mobile;
  NAVPAGE.toGoodsDetails(opts);
}
function queryTeamBuyingList(storeId, page) {
  const that = this;
  let storeIdIn = [storeId];
  ADDRESS.getDistributionStore().then(res => {
    if (res) {
      storeIdIn.push(res.id);
    }
    handleQueryTeamBuyingList(storeIdIn, page);
  }).catch(err => {
    handleQueryTeamBuyingList(storeIdIn, page);
  });
}
function handleQueryTeamBuyingList(storeId, page) {
  uni.showLoading({
    title: '加载中'
  });
  const self = this;
  page = page || state.page;
  let teamBuyingList = [];
  if (customData.customData) {
    console.log("已经在查询中~");
    return;
  }
  console.log(storeId, 'storeIdstoreId');
  customData.customData = true;
  teamBuyService.query({
    page: page,
    pageSize: state.pageSize,
    searchCount: true,
    // orgIdIn: storeId.join(","),
    storeIds: storeId.join(","),
    // storeId: storeId[0],
    status: 'STARTED'
  }).then(res => {
    customData.customData = false;
    uni.hideLoading();
    state.teamBuyCount = res.pageCount;
    if (res.records && res.records.length > 0) {
      res.records.forEach(item => {
        let tempItem = {
          id: item.id,
          name: item.name,
          business: item.business,
          description: item.description ? item.description : '',
          nowPrice: item.teamLeaderPrice ? item.teamLeaderPrice : item.teamMemberPrice,
          oldPrice: item.originalPrice ? item.originalPrice : '',
          img: item.picture ? item.picture : '',
          productId: item.productId,
          teamMemberCount: item.teamMemberCount,
          memberCount: util.numberConversion.numberToChinese(item.teamMemberCount),
          requiredGrade: item.requiredGrade,
          // 会员条件
          productCount: item.productCount,
          productBalance: item.productBalance,
          storeBalance: item.storeBalance,
          storeStatus: item.storeStatus
        };
        // 进度条 总量-剩余 = 已售
        if (item.productCount && item.productBalance && item.productCount >= item.productBalance) {
          let sellProcess = item.productBalance / item.productCount;
          sellProcess = Math.round(sellProcess * 10000) / 100 + '%';
          tempItem = {
            ...tempItem,
            sellProcess: sellProcess
          };
        }
        // 处理设置了自提时间的拼团活动
        if (item.selfStartTime && item.selfEndTime) {
          let startTimeArr = item.selfStartTime.split(" ");
          let endTimeArr = item.selfEndTime.split(" ");
          let startDateArr = startTimeArr[0].split("-");
          let endDateArr = endTimeArr[0].split("-");
          let startDate = startDateArr[1] + '月' + startDateArr[2] + '日';
          let endDate = endDateArr[1] + '月' + endDateArr[2] + '日';
          let selfTakeTime = startDate + " - " + endDate;
          tempItem.selfTakeTime = selfTakeTime;
        } else if (item.selfAfterDay) {
          tempItem.selfTakeTime = '下单后' + item.selfAfterDay + '天内';
        }
        if (item.teamMemberJoinCount != null) {
          tempItem = {
            ...tempItem,
            nowPrice: item.teamLeaderPrice ? parseFloat((Number(item.teamLeaderPrice) * item.teamMemberJoinCount).toFixed(2)) : parseFloat((Number(item.teamMemberPrice) * item.teamMemberJoinCount).toFixed(2)),
            oldPrice: item.originalPrice ? parseFloat((Number(item.originalPrice) * item.teamMemberJoinCount).toFixed(2)) : ""
          };
        }
        if (item.teamMemberCount === 3) {
          tempItem = {
            ...tempItem,
            color: '#ff7d51'
          };
        } else if (item.teamMemberCount === 5) {
          tempItem = {
            ...tempItem,
            color: '#019f55'
          };
        }
        teamBuyingList.push(tempItem);
      });
      let tempTeamBuyingList = [];
      if (page !== 1) {
        tempTeamBuyingList = state.list;
      }
      tempTeamBuyingList = tempTeamBuyingList.concat(teamBuyingList);
      console.log(tempTeamBuyingList);
      // let goodA = self.data.list
      // goodA.forEach(itema=>{
      //     selfA.getTemporaryUrl(itema.img)
      //     .then (res=>{
      //         itema.img=res
      //         self.setData({
      //             list:goodA,
      //             loading:false
      //          })
      //  })
      // })
      state.list = tempTeamBuyingList;
      state.loading = false;
      getGroupActivityCountDown(res);
    }
  }).catch(err => {
    uni.hideLoading();
    customData.customData = false;
    state.loading = false;
    util.showToast(err.message);
  }).finally(res => {
    state.loading = false;
  });
}
function getGroupActivityCountDown(groupList) {
  const that = this;
  let timeArr = [];
  if (groupList.records.length > 0) {
    groupList.records.forEach(item => {
      let startTime = item.startTime;
      let endTime = item.endTime;
      let startTimeStamp = new Date(startTime.replace(/-/g, '/')).getTime();
      let endTimeStamp = new Date(endTime.replace(/-/g, '/')).getTime();
      let duration = (endTimeStamp - startTimeStamp) / 1000;
      timeArr.push({
        openTeamTime: startTime,
        duration: duration
      });
    });
  }
  countDown();
  // 执行倒计时函数
  function countDown() {
    clearTimeout(state.groupTimeId);
    let newArr = [];
    let tempGroupList = state.list;
    let timeList = util.countDownDay(timeArr);
    console.log(timeList);
    for (let i = 0; i < tempGroupList.length; i++) {
      const element = tempGroupList[i];
      let tempItem = {
        ...element,
        days: parseInt(timeList[i].day) + 1
      };
      newArr.push(tempItem);
    }
    let time = setTimeout(function () {
      countDown(timeArr);
    }, 1000);
    state.groupTimeId = time;
    state.list = newArr;
  }
}
onLoad(function (options) {
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
  if (app.globalData.sceneInfo) {
    const scene = app.globalData.sceneInfo;
    mta.Event.stat('teambuyvisit', {
      scene: scene
    });
  }
  if (app.globalData.openCustomTabbar) {
    app.globalData.getTabbar();
    app.globalData.editTabbar();
    state.openCustomTabbar = true;
    state.showTabbar = true;
  } else {
    if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
      app.globalData.tabBar.list.forEach(item => {
        if (item.linkModel === 'teambuying_activity') {
          uni.hideTabBar();
          app.globalData.getTabbar();
          app.globalData.editTabbar();
          state.showTabbar = true;
        }
      });
    }
  }

  // 设置当前设备是否iPhone X
  state.isIphoneX = app.globalData.isIphoneX;
  state.hasEasyRecPlugins = app.globalData.hasEasyRecPlugins;
  const self = this;
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    // 统计PV
    state.storeName = app.globalData.storeInfo.name;
    state.storeId = app.globalData.storeInfo.id;
    ANALYSIS.PVStatistics(state.storeId);
    queryTeamBuyingList(app.globalData.storeInfo.id);
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation().then(res => {
      app.globalData.storeInfo = res;
      // 统计PV
      state.storeName = res.name;
      state.storeId = res.id;
      ANALYSIS.PVStatistics(res.id);
      queryTeamBuyingList(res.id);
    });
  }
  if (options.scene) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    let scene = decodeURIComponent(options.scene);
    if (scene.indexOf("gmparam=") >= 0) {
      let sceneArr = scene.split('gmparam=');
      const sceneId = sceneArr[1];
      if (sceneId != null) {
        getSceneById(sceneId);
      }
    } else if (scene !== 'isfromQR') {
      // 设置分享信息
      setSharePeopleInfo(options, "group");
    }
  } else {
    // 设置分享信息
    setSharePeopleInfo(options, "group");
  }
  // 获取当前页面分享图
  getSharePictures();
});
function setSharePeopleInfo(options, type) {
  let shareData = {
    shareId: null,
    type: type,
    productId: ""
  };
  if (options.scene) {
    let scene = decodeURIComponent(options.scene);
    if (scene !== 'isfromQR') {
      shareData.shareId = scene;
      // 分享信息打开统计
      ANALYSIS.ShareOpenAnalysis();
    }
  } else if (options.shareId && options.shareId != '' && options.shareId != null) {
    shareData.shareId = options.shareId;
  }
  if (shareData.shareId) {
    if (app.globalData.isShoppingGuidanceRecordGoods) {
      util.setSharingPersonInfo(shareData);
    } else {
      try {
        uni.setStorageSync('wj_sharingId', shareData.shareId);
      } catch (e) {}
    }
  }
}
function changeStore() {
  NAVPAGE.toSelectStore();
}
onReady(function () {});
onShow(function () {
  if (state.openCustomTabbar) {
    app.globalData.getTabbar();
    app.globalData.editTabbar();
  }
  if (state.storeId && app.globalData.storeInfo && (state.storeId !== app.globalData.storeInfo.id || state.storeData.virtualStoreId !== app.globalData.storeInfo.virtualStoreId)) {
    state.storeName = app.globalData.storeInfo.name;
    state.storeId = app.globalData.storeInfo.id;
    state.storeData = app.globalData.storeInfo;
    queryTeamBuyingList(state.storeId);
  }
});
onHide(function () {
  clearTimeout(state.groupTimeId);
});
onUnload(function () {
  clearTimeout(state.groupTimeId);
});
onPullDownRefresh(function () {
  state.page = 1;
  state.list = [];
  queryTeamBuyingList(state.storeId, 1);
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {
  if (state.page < state.teamBuyCount) {
    state.page = ++state.page;
    queryTeamBuyingList(state.storeId, state.page);
  }
});
onShareAppMessage(function () {
  const self = this;
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let sharePictures = state.sharePictures;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    let memberId = app.globalData.userInfo.member.id;
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/fightGroup/fightGroup/fightGroup?shareId=' + memberId + '&storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true
        });
      }
    };
  } else {
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/fightGroup/fightGroup/fightGroup?storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true
        });
      }
    };
  }
});
function toHome() {
  NAVPAGE.toHome();
}
function handleUserLogin() {
  const that = this;
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo;
    state.userInfo = {
      ...user.wxaUser
    };
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true;
      state.isMember = true;
    } else {
      // 不是会员跳转授权页
      state.userInfo = user.wxaUser;
      state.hasUserInfo = true;
      state.isMember = false;
      NAVPAGE.toAuthorize();
    }
  }
}
function handleTabbar(e) {
  state.showTabbar = e.detail.showTabbar;
}
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures;
  }
}
function getSceneById(id) {
  const self = this;
  wxaUserService.getSceneById(id).then(res => {
    function urlToObj(str) {
      let obj = {};
      let arr = str.split("&");
      for (let i = 0; i < arr.length; i++) {
        let ele = arr[i].split("=");
        obj[ele[0]] = ele[1];
      }
      return obj;
    }
    const _options = urlToObj(res);
    options = _options;
    // 设置分享信息
    setSharePeopleInfo(_options, "group");
    if (_options.shareId != null && _options.shareId !== "") {
      // 分享信息打开统计
      ANALYSIS.ShareOpenAnalysis();
    }
  }).catch(err => {
    util.showToast(err.message);
  });
}
</script>
<style scoped>
page {
  background-color: #fff;
  min-height: calc(100% - 128rpx);
  padding-bottom: 128rpx;
}

.change-store {
  height: 90rpx;
  background: #fff;
  margin-bottom: 27rpx;
  width: 100%;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.change-store image:first-of-type {
  width: 14rpx;
  height: 8rpx;
  margin-left: 15rpx;
}

.change-store text {
  font-size: 30rpx;
  max-width: 320rpx;
  line-height: 48rpx;
  font-weight: bold;
  color: #1b1b1d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.list-item {
  width: 100%;
  border-radius: 8rpx;
  margin-bottom: 22rpx;
  background-color: #fff;
  /* box-shadow: 4rpx 6rpx 20rpx 0rpx rgba(0, 0, 0, 0.1); */
  position: relative;
  padding: 21rpx 20rpx;
  box-sizing: border-box;
  display: flex;
}

.list-item .item-img-box {
  position: relative;
  width: 256rpx;
  height: 256rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-right: 18rpx;
  flex: 0 0 auto;
}

.list-item .item-img-box .no-balance {
  position: absolute;
  height: 256rpx;
  width: 100%;
  background-color: #fff;
  opacity: 0.6;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.list-item .item-img-box .no-balance .no-balance-cycle {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background-color: #1b1b1d;
  opacity: 0.9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.list-item .item-img-box .no-balance .no-balance-cycle .no-balance-title {
  width: 130rpx;
  height: 80rpx;
  text-align: center;
  font-size: 24rpx;
  font-weight: 400;
  color: #fff;
  border-top: 1rpx solid #fff;
  border-bottom: 1rpx solid #fff;
}

.list-item .item-img-box .no-balance .no-balance-cycle .no-balance-title .no-balance-title-text {
  line-height: 40rpx;
  font-size: 30rpx;
}

.list-item .item-img {
  width: 100%;
  height: 256rpx;
}

.list-item .item-tips {
  background: #ff7d51;
  height: 54rpx;
  width: 150rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  line-height: 48rpx;
  text-align: center;
  padding: 0 0 0 0;
  position: absolute;
  left: 0;
  top: 0;
  border-bottom-right-radius: 12rpx;
  color: #fff;
}

.list-item:last-of-type {
  /* margin-bottom: 128rpx !important; */
}

.item-info {
  /* padding: 24rpx 22rpx 22rpx 38rpx; */
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.item-info>text {
  display: block;
}
.price_btn_box {
  display: flex;
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
}
.item-info .item-name {
  font-size: 30rpx;
  color: #2c2d2c;
  font-weight: 500;
  line-height: 38rpx;
  margin-bottom: 6rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.item-info .item-middle {
  font-size: 22rpx;
}

.item-info .item-desc,
.item-info .item-time {
  line-height: 40rpx;
  display: block;
}

.item-info .item-self-time {
  width: 70%;
  font-size: 24rpx;
  color: #949494;
  margin-bottom: 4rpx;
}

.item-info .item-time {
  color: #333333;
  font-size: 24rpx;
}

.item-info .item-desc {
  width: 70%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.item-info .item-price-box {
  color: #FF8425;
  font-size: 24rpx;
  /* line-height: 60rpx; */
  margin-top: 7rpx;
}

.item-price-box .item-nowPrice {
  font-size: 43rpx;
}

.item-price-box .item-oldPrice {
  color: #999999;
  text-decoration: line-through;
  margin-left: 8rpx;
  display: block;
}

.item-info button {
  width: 158rpx;
  height: 60rpx;
  padding: 0;
  border-radius: 30rpx;
  /* background: linear-gradient(90deg, rgba(255, 159, 67, 1), rgba(238, 82, 83, 1)); */
  color: #fff;
  border: none;
  outline: none;
  font-size: 26rpx;
  line-height: 60rpx;
  /* position: absolute;
  bottom: 22rpx;
  right: 30rpx; */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.item-info button image {
  width: 12rpx;
  height: 19rpx;
  margin-left: 13rpx;
}

.item-info button::after {
  border: none;
}

.remain {
  position: absolute;
  top: -8rpx;
  left: 20rpx;
  color: #fff;
  font-size: 30rpx;
  text-align: center;
}

.remain image {
  width: 140rpx;
  height: 132rpx;
}

.remain>view {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  height: 110rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.remain text {
  text-indent: -8rpx;
}

.line {
  width: 88rpx;
  height: 2rpx;
  background-color: rgba(255, 255, 255, 0.3);
  margin-left: -8rpx;
}

.no-data {
  width: 100%;
  height: calc(100% - 120rpx);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background: #ffffff; */
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  margin-top: 40%;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  /* position: unset; */
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: transparent;
}

.tabbar-height {
  height: 128rpx;
}

.tabbar-height.iphoneX-height {
  height: 178rpx;
  width: 100%;
}

.page-content {
  padding: 20rpx;
  background-color: #F0F2F5;
  min-height: 80vh;
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
</style>