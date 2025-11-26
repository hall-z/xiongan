<template>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<image v-if="state.tourismPlanData && state.tourismPlanData.imgUrl && state.memberFlag" class="list_top_img" :src="state.tourismPlanData.imgUrl" mode="widthFix"></image>
<view class="content">
    <view :hidden="!state.memberFlag" v-for="(planDetail , index) in state.tourismPlanList" :data-id="planDetail.id" @click="skipDetail" class="plan-detail">
      <image class="list_img" :src="planDetail.bannerUrlList ? planDetail.bannerUrlList[0] : planDetail.detailsUrl"></image>
      <view class="detail_box">
        <view class="detail_name">{{planDetail.name}}</view>
        <view class="detail_note">{{planDetail.note}}</view>
        <view class="detail_bottom">
          <view>{{planDetail.inOut == 2 ? '省外' : '省内'}}</view>
          <view :style="'background-color: ' + (planDetail.choose || state.planUserData.route != 2 && planDetail.inOut != 1 ? '#ccc' : state.themeColor)" class="detail_btn">
            {{planDetail.choose ? '已选路线' : '查看路线'}}
          </view>
        </view>
      </view>
    </view>
    <view v-if="!state.memberFlag" class="err-tip">
      当前用户不在疗休养路线选择清单内，请联系所在单位负责人，确认上传信息是否有误！
    </view>
</view>
<image class="skip_btn" v-if="state.memberFlag" :src="state.imagesPath.skipMyTourism" @click="handleSkip"></image>
<popup :show="state.oneFlag" position="middle" custom-class="middle" @close="toggleChooseShowPopup">
  <view class="modal-body modal-body1">
    <view class="modal-content">
        <view class="subscribe-close">
          <image :src="state.imagesPath.iconCloseImg2" @click="toggleChooseShowPopup"></image>
        </view>
        <view class="title">信息确认</view>
        <view class="content">
          <view>
            <text>姓名：</text>
            <text>{{state.planUserData.unionUserName}}</text>
          </view>
          <view>
            <text>性别：</text>
            <picker mode="selector" @change="handleSexChange" :value="state.sexIndex" :range="state.sexArray">
              <view class="picker">
                {{sex ? sex : state.planUserData.sex ? state.planUserData.sex == 'M' ? '男' : state.planUserData.sex == 'F' ? '女' : '' : "请选择您的性别"}}
              </view>
            </picker>
          </view>
          <view>
            <text>联系电话：</text>
            <text>{{state.planUserData.mobile}}</text>
          </view>
          <view>
            <text>身份证号：</text>
            <input placeholder="请填写身份证号" :value="state.planUserData.identity" placeholder-class="placeholder-class" @input="handleIdentityInput">
          </view>
        </view>
        <view class="choose_tip">
          确认如上信息是否与本人一致，如信息有误，请及时在本页面自行修改并确认。出行人员姓名、联系电话如有误，请联系所在单位负责人进行修改，防止耽误正常出行。
        </view>
        <view class="button-box">
          <button class="confirm" :style="'background: ' + state.themeColor + ';color: #fff'" @click.stop="confirmChoose">确认</button>
        </view>
    </view>
  </view>
</popup>
</template>
<script setup>
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiWelfarePlanServiceJs from "@/service/api/newretail/welfarePlanService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/addressList/addressList.js
const memberService = _apiMemberServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const welfarePlanService = _apiWelfarePlanServiceJs;
const NAVPAGE = _utilsNavPageJs;

//获取应用实例
const state = reactive({
  sexArray: ["男", "女"],
  sexIndex: 0,
  planUserData: {},
  oneFlag: false,
  memberFlag: true,
  choose: null,
  tourismPlanData: {},
  tourismPlanList: [],
  navigationBarTitle: "路线选择",
  imagesPath: IMGAGESPATH,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  identity: null
});
function handleIdentityInput(val) {
  state.identity = val.detail.value;
}
function handleSexChange(val) {
  console.log(val);
  state.sex = state.sexArray[val.detail.value];
  state.sexIndex = val.detail.value;
}
function handleSkip() {
  NAVPAGE.toMyTourism();
}
function confirmChoose() {
  if (!state.identity) {
    uni.showToast({
      icon: 'none',
      title: '请填写身份证号'
    });
    return false;
  }
  let sex = state.sex == '女' ? 'F' : 'M';
  if (state.identity != state.planUserData.identity || state.sex && sex != state.planUserData.sex) {
    let _data = {
      ...state.planUserData,
      sex,
      identity: state.identity
    };
    welfarePlanService.updateUserHonor(_data).then(res => {
      toggleChooseShowPopup();
      uni.showToast({
        icon: 'none',
        title: '修改完成'
      });
    }).catch(err => {
      uni.showToast({
        icon: 'none',
        title: err.message
      });
    });
  } else {
    toggleChooseShowPopup();
  }
}
function toggleChooseShowPopup() {
  state.oneFlag = false;
}
function getAuth() {
  welfarePlanService.getTravelByPlanId({
    planId: state.id
  }).then(res => {
    if (res) {
      getPlanList();
      state.planUserData = res;
      state.identity = res.identity;
      state.oneFlag = res.oneFlag == 0;
      if (res.oneFlag == 0) {
        welfarePlanService.updateUserByPlanId({
          planId: state.id
        }).then(res1 => {});
      }
    } else {
      state.memberFlag = false;
    }
  });
}
function getPlanList() {
  uni.showLoading({
    title: '加载中'
  });
  welfarePlanService.tourismPlanDetails(state.id).then(res => {
    if (res) {
      let choose = null;
      choose = res.routeList.some(item => {
        return item.choose;
      });
      res.routeList.forEach(item => {
        item.bannerUrlList = item.bannerUrl ? item.bannerUrl.split(',') : [];
      });
      state.tourismPlanList = res.routeList || [];
      state.tourismPlanData = res;
      state.choose = choose;
    }
    uni.hideLoading();
  }).catch(err => {
    uni.hideLoading();
    uni.showToast({
      icon: 'none',
      title: err.message
    });
  });
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
  }
}
onLoad(function (options) {
  uni.hideShareMenu();
  // 统计PV
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  state.id = options ? options.id || options.scene : null;
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {
  if (state.id && checkAuth() && app.globalData.userInfo.member) {
    getAuth();
  } else {
    uni.showToast({
      title: '您还不是会员，请先绑定手机号码成为会员',
      icon: 'none',
      duration: 2000
    });
    NAVPAGE.toAuthorize();
    // this.setData({
    //   memberFlag: false
    // })
  }
  uni.hideShareMenu();
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function skipDetail(e) {
  let id = e.currentTarget.dataset.id;
  // wx.setStorageSync('signList', JSON.stringify(ids))
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/benefitPlan/tourismPlanDetail/tourismPlanDetail?id=' + id + '&planId=' + state.id + '&choose=' + state.choose
  });
}
</script>
<style scoped>
/* pages/addressList/addressList.wxss */

page {
    background: rgb(240, 239, 239);
    height: 100%;
  }
  
  .content {
    /* margin-bottom: 100rpx; */
    padding: 20rpx;
    width: 100%;
    /* height: 100%; */
    box-sizing: border-box;
    background: rgb(240, 239, 239);
    margin-bottom: 20rpx;
  }
  .plan-detail {
    padding: 15rpx;
    font-size: 24rpx;
    margin-bottom: 15px;
    display: flex;
    border-radius: 15rpx;
    background-color: #fff;
  }
  .plan-detail .list_img {
    width: 200rpx;
    height: 200rpx;
    margin-right: 20rpx;
    flex: 0 0 auto;
  }
  .detail_name {
    font-size: 36rpx;
  }
  
  .detail_box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 200rpx;
    flex: 0 0 auto;
    width: calc(100% - 220rpx);
    font-size: 26rpx;
  }
  .detail_bottom {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: flex-end;
    flex: 0 0 auto;
    color: #ccc;
    font-size: 28rpx;
  }
  .detail_note {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 设置文本最多显示3行 */
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .detail_btn {
    padding: 10rpx 20rpx;
    color: #fff;
    background-color: rgb(131, 26, 26);
    border-radius: 30rpx;
    font-size: 24rpx;
    margin-top: 10rpx;
    flex: 0 0 auto;
  }
  .list_top_img {
    width: 100%;
    background-color: #fff;
  }
  .err-tip {
    padding: 50% 40rpx 0;
    font-size: 28rpx;
  }


  
.modal-body1 .modal-content {
  background: #fff;
  width: 624rpx;
  padding: 36rpx 30rpx 40rpx;
  min-height: 406rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  /* margin: 40% auto; */
  position: relative;
}
.subscribe-close {
  position: absolute;
  right: 10rpx;
  top: 10rpx;
  width: 70rpx;
  height: 70rpx;
}
.subscribe-close image {
  width: 100%;
  height: 100%;
}
.title {
  text-align: center;
  font-size: 40rpx;
}
.modal-content .content {
  margin: 30rpx 0 0;
  background-color: #fff;
}
.modal-content .content view {
  display: flex;
  margin-bottom: 25rpx;
  align-items: center;
}
.modal-content .content view text {
  flex: 0 0 auto;
  width: 160rpx;
  font-size: 28rpx;
}
.modal-content .content view > text:nth-of-type(2n){
  flex: 1 1 auto;
  border-radius: 8rpx;
  border: 1px solid #eee;
  height: 50rpx;
  display: flex;
  align-items: center;
  padding: 0 10rpx;
  background-color: #eee;
}
.modal-content .content view picker,
.modal-content .content view input {
  height: 50rpx;
  border: 1px solid #eee;
  flex: 1 1 auto;
  border-radius: 8rpx;
  padding: 0 10rpx;
  font-size: 28rpx;
  line-height: 50rpx;
}
.choose_tip {
  font-size: 28rpx;
  margin-bottom: 60rpx;
}
.skip_btn {
  width: 92rpx;
  height: 92rpx;
  position: fixed;
  left: 20rpx;
  bottom: 20%;
  z-index: 6;
}
</style>