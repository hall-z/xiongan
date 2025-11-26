<template>
<!--components/home-page/home-function/home-function.wxml-->
<view class="column-box-loading" v-if="!loaded || !isShow">
  <view class="column-img" v-for="(item , index) in 5" :key="i">
  </view>
</view>
<view class="column-box" :style="functionEntryList.length > 5 ? 'justify-content: flex-start;' : ''" v-if="loaded && functionEntryList.length > 0">
  <view class="column-item" v-for="(item , index) in functionEntryList" :key="index" :data-route="item.route" :data-linkModel="item.linkModel" @click="clickFunctionEntry">
    <view class="column-img">
      <image lazy-load="" :src="item.imageUrl" mode="widthFix"></image>
    </view>
    <view style="font-size: 24rpx;margin-top: 18rpx;">{{item.modelName}}</view>
  </view>
</view>
<view v-if="functionEntryList.length > 0">
</view>
<signin :show="signShow" @close="handleMemberSignInClose"></signin>
</template>
<script setup>
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _utilsSelfJs from "@/utils/newretail/self";
import _homePageCommonBehaviorJs from "../homePageCommonBehavior";
import _lazyLoadPageLazyLoadBaseJs from "../../lazy-load-page/lazy-load-base";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiHomepageServiceJs from "@/service/api/newretail/homepageService";
// import { ready } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
import signin from '../../signin/signin.vue';
const app = getApp();
// components/home-page/home-function/home-function.js
const homepageService = _apiHomepageServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const THEME = _utilsThemeManagerJs;
const UTILS = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs;
const homePageCommonBehavior = _homePageCommonBehaviorJs;
const utilsSelf = _utilsSelfJs;
const productService = _apiProductServiceJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  loaded: false,
  isShow: false,
  functionEntryList: [],
  signShow: false,
  signShowA: false
});
const props = defineProps({
  show: {
    // 属性名
    type: Boolean,
    value: false
  },
  pageScrollData: {
    // 属性名
    type: Object,
    value: {}
  },
  refreshType: {
    // 属性名
    type: String,
    value: ""
  }
});
ready(function () {
  checkUserInfo();
});
function reload() {
  const that = this;
  if (!state.loaded) {
    lazyLoadBase.determineComponentInVisibleArea(".column-box-loading", that).then(res => {
      if (res) {
        state.loaded = true;
        getHomeFunctionEntry();
      }
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  } else if (state.refreshType === "ALL") {
    getHomeFunctionEntry();
  }
}
function getHomeFunctionEntry() {
  const self = this;
  if (state.refreshType !== "ALL") {
    if (hasQuery) {
      return;
    }
  }
  hasQuery = true;
  homepageService.query('JIN_GANG').then(res => {
    let tempFunctionList = [];
    res.forEach(item => {
      if (item.linkModel === 'product_menu') {
        productMenuId = item.productMenuId ? item.productMenuId : '';
      }
      if (item.linkModel === 'score_raffle') {
        raffleActivityId = item.raffleActivityId ? item.raffleActivityId : '';
      }
      if (item.linkModel === 'packaging') {
        packagingId = item.packagingId ? item.packagingId : '';
      }
      if (item.linkModel === 'tourism_plan') {
        tourismPlanId = item.tourismPlanId ? item.tourismPlanId : '';
      }
      let tempItem = {
        ...item,
        route: item.linkModel ? handlePagePath(item.linkModel) : '' //配置页面跳转
      };
      if (item.linkModel === 'external_url') {
        tempItem.route = item.externalUrl;
      }
      if (item.linkModel === 'card_recharge') {
        tempItem.route = {
          appid: item.appid,
          jumpPage: item.jumpPage,
          jumpParameter: item.jumpParameter
        };
      }
      productMenuId = '';
      tempFunctionList.push(tempItem);
    });
    let newArr = [].concat(tempFunctionList); // newArr为一个新的数组，不是简单的赋值引用
    function compare(property) {
      return function (a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
      };
    }
    newArr.sort(compare('orderNumber')); // newArr已经按照从小到大的顺序进行排列, 根据对象中的orderNumber属性进行排序
    newArr.forEach((arr, index) => {
      if (arr.productMenuId) {
        productService.categoryGetById(arr.productMenuId).then(item => {
          arr.name = item.name;
        });
      }
      // console.log(arr,index,'查看数据')
      // utilsSelf.getTemporaryUrl(arr.imageUrl)
      //     .then(res => {
      //         arr.imageUrl = res;
      //         if(index== newArr.length-1){
      //             console.log(newArr,'查看数据')
      //             self.setData({
      //                 functionEntryList: newArr,
      //                 isShow: true
      //             })
      //         }
      //     })
      state.isShow = true;
    });
  }).catch(err => {
    console.log("查询金刚区失败：", err.message);
    state.functionEntryList = [];
    state.isShow = true;
  });
}
function handlePagePath(linkModel) {
  if (linkModel === 'grab_activity') {
    return '/pages-sub/newretail/pages/mallModule/activity/seckill/seckill';
  } else if (linkModel === 'gift_card') {
    return 'pages/memberModule/giftCard/giftCard/giftCard';
  } else if (linkModel === 'invite_member') {
    return '/pages-sub/newretail/pages/mallModule/invite/invite';
  } else if (linkModel === 'teambuying_activity') {
    return '/pages-sub/newretail/pages/mallModule/fightGroup/fightGroup/fightGroup';
  } else if (linkModel === 'sign_in') {
    return '';
  } else if (linkModel === 'score_mall') {
    return '/pages-sub/newretail/pages/mallModule/score/scoreMall/scoreMall?link=' + linkModel;
  } else if (linkModel === 'score_coupon') {
    return '/pages-sub/newretail/pages/mallModule/score/scoreMall/scoreMall?link=' + linkModel;
  } else if (linkModel === 'score_goods') {
    return '/pages-sub/newretail/pages/mallModule/score/scoreMall/scoreMall?link=' + linkModel;
  } else if (linkModel === 'thirdParty_coupon') {
    return '/pages-sub/newretail/pages/mallModule/score/scoreMall/scoreMall?link=' + linkModel;
  } else if (linkModel === 'recharge') {
    return '/pages-sub/newretail/pages/mallModule/myCard/recharge/recharge';
  } else if (linkModel === 'member_card') {
    return '/pages-sub/newretail/pages/mallModule/myCard/memberCard/memberCard';
  } else if (linkModel === 'coupon') {
    return '/pages-sub/newretail/pages/mallModule/coupon/couponCenter/couponCenter';
  } else if (linkModel === 'product_menu') {
    return '/pages-sub/newretail/pages/mallModule/tabbar/category/category-list/category-list?categoryId=' + productMenuId;
  } else if (linkModel === 'external_url') {
    return '';
  } else if (linkModel === 'bargain') {
    return '/pages-sub/newretail/pages/mallModule/bargain/bargainList/bargainList';
  } else if (linkModel === 'penny') {
    return '/pages-sub/newretail/pages/mallModule/activity/penny/pennyList/pennyList';
  } else if (linkModel === 'card_recharge') {
    return '';
  } else if (linkModel === 'recharge_draw') {
    return '/pages-sub/newretail/pages/mallModule/activity/lottery/lotteryIndex/lotteryIndex';
  } else if (linkModel === "advance_sell") {
    return '/pages-sub/newretail/pages/mallModule/activity/advanceSell/advanceSell';
  } else if (linkModel === "score_raffle") {
    return '/pages-sub/newretail/pages/mallModule/activity/scoreRaffle/scoreRaffle?raffleActivityId=' + raffleActivityId;
  } else if (linkModel === "back_cash_product") {
    return '/pages-sub/newretail/pages/mallModule/member/shoppingGuide/goods/goods';
  } else if (linkModel === "live_room") {
    return '/pages-sub/newretail/pages/mallModule/miniAppLiveplay/showList/showList';
  } else if (linkModel === "packaging") {
    return '/pages-sub/newretail/pages/mallModule/goods/packaging/packaging?packagingId=' + packagingId;
  } else if (linkModel === "tourism_plan") {
    return '/pages-sub/newretail/pages/mallModule/benefitPlan/tourismPlan/tourismPlan?id=' + tourismPlanId;
  }
}

// Watch listeners converted from observers
watch(() => props.show, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal) {
          reload();
          checkUserInfo();
        }
});

watch(() => props.value, (newVal, oldVal) => {
  // 属性值变化时执行
        reload();
});

watch(() => props.refreshType, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal === "ALL") {
          reload();
        } else if (newVal === "USER") {
          // 刷新会员数据
          checkUserInfo();
        }
});

</script>
<style scoped>
/* components/home-page/home-function/home-function.wxss */
/* loading */
.column-box-loading {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 30rpx 0;
  width: 670rpx;
  margin: 0 auto;
}
.column-box-loading .column-img {
  background: #EFEFEF;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}
.column-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  /* padding: 30rpx 0 0 0; */
  /* width: 670rpx; */
  /* margin: 0 auto; */
  padding: 0;
  margin-top: 30rpx;
}
.column-item {
  display: flex;
  width: 20%;
  /* width: 138rpx; */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 27rpx;
  min-height: 120rpx;
}
.column-item .column-img {
    width: 110rpx;
    height: 110rpx;
  /* height: 100%;
  width: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.column-item .column-img image {
  width: 100%;
  height: 100%;
}
.column-item text {
  font-size: 26rpx;
  line-height: 36rpx;
  margin-top: 14rpx;
  color: #333;
}
</style>