<template>
  <!-- components/lazy-load-page/lazy-load-page.wxml -->
  <!-- <view class="loading-box" hidden="{{show}}">
  <loading></loading>
</view> -->
  <!-- v-if="showFlag" -->
  <view style="position: relative; padding-bottom: 60rpx">
    <view class="search_bar" v-if="state.isHomeShowTopSearch && state.topSearchStyle === '2'">
      <search-bar
        id="search-bar"
        :show="true"
        :isSearchFixed="state.isSearchFixed"
        :isShowCollection="state.isShowCollection"
        :pageScrollData="props.pageScrollData"
        :refreshType="state.refreshTypeData"
        @toMemberCard="toMemberCard"
        @getUserInfo="getUserInfo"
      ></search-bar>
    </view>
    <view v-if="props.ownModule === 'homePage'">
      <collection
        id="collection"
        v-if="state.isShowCollection"
        :show="true"
        :isSearchFixed="state.isSearchFixed"
        :pageScrollData="props.pageScrollData"
        @pushCollect="handlePushCollect"
      ></collection>
      <subscribe-bar
        id="subscribe-bar"
        :show="true"
        @pushCollect="handlePushCollect"
      ></subscribe-bar>
      <view
        v-for="(item, index) in state.homeModel"
        :key="index"
        v-show="
          item &&
          (!item.beginTimeStamp ||
            !item.endTimeStamp ||
            (item.beginTimeStamp < state.timeNumber && state.timeNumber < item.endTimeStamp))
        "
      >
        <top-member
          id="top-member"
          v-if="item.type == 'memberInfo'"
          :show="true"
          :refreshType="state.refreshTypeData"
          :ownModule="props.ownModule"
          :pageScrollData="props.pageScrollData"
          :itemData="item"
          :timeNumber="state.timeNumber"
          :moduleSpacing="item.moduleSpacing"
          :modelMargin="item.modelMargin"
          :pageMargin="item.pageMargin"
          @toMemberCard="toMemberCard"
          @refresh="handleRefreshData"
          :memberCodeType="state.codeType"
          :memberResource="state.memberResource"
        ></top-member>
        <!-- 轮播图模块 -->
        <view
          v-if="
            item.type == 'lunbotu' ||
            item.type == 'jingtaitu' ||
            (item.type == 'fenqu' && !item.noShowFlag)
          "
        >
          <banner
            id="banner"
            :show="true"
            :refreshType="state.refreshTypeData"
            @banner="getBanner"
            :showInfo="item.type"
            :imageUrl="item.imageUrl"
            :banners="item.imageItems"
            :timeNumber="state.timeNumber"
            :pageMargin="item.pageMargin || 0"
            :rotationSpeed="item.rotationSpeed"
            :moduleSpacing="item.moduleSpacing"
          ></banner>
        </view>
        <view
          v-if="
            item.type == 'erfentu' ||
            item.type == 'sanfentu' ||
            item.type == 'yihangsanzhang' ||
            item.type == 'yihangsizhang'
          "
        >
          <theme-activities
            v-if="item"
            id="them-activities"
            :key="item.type + '_' + index"
            :show="true"
            :refreshType="state.refreshTypeData"
            :pageScrollData="props.pageScrollData"
            :shopCart="props.shopCart"
            @refresh="handleRefreshData"
            :itemData="item"
            :moduleSpacing="item.moduleSpacing"
            :modelMargin="item.modelMargin"
            :middleMargin="item.middleMargin"
            :pageMargin="item.pageMargin"
            :fillet="item.fillet"
          ></theme-activities>
        </view>
        <!-- 主题活动区域 -->
        <view v-if="item.type == 'shangpingliebiao' || item.type == 'henghualiebiao'">
          <theme-activities
            v-if="item"
            id="them-activities"
            :show="true"
            :refreshType="state.refreshTypeData"
            :pageScrollData="props.pageScrollData"
            :shopCart="props.shopCart"
            @refresh="handleRefreshData"
            :itemData="item"
            :moduleSpacing="item.moduleSpacing"
            :modelMargin="item.modelMargin"
            :middleMargin="item.middleMargin"
            :pageMargin="item.pageMargin"
            :fillet="item.fillet"
            :shopCarType="item.shopCarType"
            :underlinePriceShow="item.underlinePriceShow"
          ></theme-activities>
        </view>
        <!-- 商品分类 -->
        <view v-if="item.type == 'shangpingfenlei'">
          <good-activities
            v-if="item.productCategory"
            id="good-activities"
            :show="true"
            :dataIndex="index"
            :refreshType="state.refreshTypeData"
            :pageScrollData="props.pageScrollData"
            :pageScrollData1="state.pageScrollData1"
            :shopCart="props.shopCart"
            @refresh="handleRefreshData"
            :itemData="item.productCategory"
            :selectColor="item.selectFontColor"
            :selectLineColor="item.selectLineColor"
            :noSelectColor="item.unselectFontColor"
            :groupImageIsHide="item.groupImageIsHide"
            :moduleSpacing="item.moduleSpacing"
            :modelMargin="item.modelMargin"
            :middleMargin="item.middleMargin"
            :pageMargin="item.pageMargin"
            :fillet="item.fillet"
            :shopCarType="item.shopCarType"
            :underlinePriceShow="item.underlinePriceShow"
          ></good-activities>
        </view>
        <!-- 首页金刚区 -->
        <view v-if="item.type == 'tubiaodaohang'">
          <home-function
            :id="'home-function' + (state.previewId || '')"
            :show="true"
            :refreshType="state.refreshTypeData"
            :pageScrollData="props.pageScrollData"
            @clickFunctionEntry="clickFunctionEntry"
            :colour="item.colour"
            :moduleSpacing="item.moduleSpacing"
            :columnsNumber="item.columnsNumber"
            :itemData="item && item.imageItems"
          ></home-function>
        </view>
        <!-- 券活动列表 -->
        <view v-if="item.type == 'QHDyihangsanzhang'">
          <coupon-activities
            v-if="item"
            id="coupon-activities"
            :show="true"
            :timeNumber="state.timeNumber"
            :refreshType="state.refreshTypeData"
            :pageScrollData="props.pageScrollData"
            @refresh="handleRefreshData"
            :itemData="item"
            :moduleSpacing="item.moduleSpacing"
            :modelMargin="item.modelMargin"
            :middleMargin="item.middleMargin"
            :pageMargin="item.pageMargin"
            :fillet="item.fillet"
          ></coupon-activities>
        </view>
        <!-- 公告显示区 -->
        <bulletin-board
          id="bulletin-board"
          v-if="state.isHomeShowNotice && index == 0"
          :show="true"
          :colour="state.noticeColour"
          :refreshType="state.refreshTypeData"
          :pageScrollData="props.pageScrollData"
        ></bulletin-board>
        <nearby-store
          id="nearby-store"
          :show="state.showFlag"
          :refreshType="state.refreshTypeData"
          :pageScrollData="props.pageScrollData"
          :nearStoreStyle="nearStoreStyle"
          v-if="state.isHomeShowNearStore && state.nearStoreStyle === '2' && index === 0"
        ></nearby-store>
      </view>
      <!-- 公告显示区 -->
      <!-- <bulletin-board id="bulletin-board"
    wx:if="{{isHomeShowNotice && homeModel == 0}}"
    show="{{true}}"
    refreshType="{{refreshType}}"
    pageScrollData="{{pageScrollData}}"
    >
    </bulletin-board> -->
      <!-- 中部会员区 -->
      <!-- <middle-member id="middle-member" 
    wx:if="{{isHomeShowCenterMember}}"
    ownModule="{{ownModule}}"
    show="{{true}}"
    refreshType="{{refreshType}}"
    memberInfoFunctionEntry="{{memberInfoFunctionEntry}}" 
    banners="{{banners}}"
    pageScrollData="{{pageScrollData}}"
    bind:refresh="handleRefreshData"
    >
  </middle-member> -->
      <!-- 附近门店区 -->
      <nearby-store
        id="nearby-store"
        :show="state.showFlag"
        :refreshType="state.refreshTypeData"
        :pageScrollData="props.pageScrollData"
        v-if="state.isHomeShowNearStore && state.nearStoreStyle === '3'"
      ></nearby-store>
      <recommend-store
        :show="state.showFlag"
        :refreshType="state.refreshTypeData"
        :pageScrollData="pageScrollData"
        :pageScrollData1="state.pageScrollData1"
        :latitudeAndLongitude="state.latitudeAndLongitude1"
        @refresh="handleRefreshData"
      ></recommend-store>
      <!-- 门店精选 -->
      <mall-recommend
        id="mall-recommend"
        :show="state.isShowHotGoods"
        :refreshType="state.refreshTypeData"
        :pageScrollData="props.pageScrollData"
        :pageScrollData1="state.pageScrollData1"
        :shopCart="props.shopCart"
        @refresh="handleRefreshData"
        :displayStyle="state.displayStyle"
        :isShowProductAreaTitle="state.isShowProductAreaTitle"
        :hotTitleImgUrl="state.hotTitleImgUrl"
        v-if="state.isShowHotGoods"
      ></mall-recommend>
    </view>
  </view>
</template>
<script setup>
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsAddressJs from '@/utils/newretail/address'
import _apiGiftCardServiceJs from '@/service/api/newretail/giftCardService'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiHomepageServiceJs from '@/service/api/newretail/homepageService'
// import { ready } from "@dcloudio/uni-app";
import { reactive, watch, onMounted, onBeforeMount } from 'vue'
import searchBar from '../home-page/search-bar/search-bar.vue'
import nearbyStore from '../home-page/nearby-store/nearby-store.vue'
import subscribeBar from '../home-page/subscribe-bar/subscribe-bar.vue'
import topMember from '../home-page/top-member/top-member.vue'
import themeActivities from '../home-page/theme-activities2/theme-activities.vue'
import goodActivities from '../home-page/good-activities/good-activities.vue'
import homeFunction from '../home-page/home-function2/home-function.vue'
import couponActivities from '../home-page/coupon-activities/coupon-activities.vue'
import bulletinBoard from '../home-page/bulletin-board/bulletin-board.vue'
import middleMember from '../home-page/middle-member/middle-member.vue'
import recommendStore from '../home-page/recommend-store/recommend-store.vue'
import mallRecommend from '../home-page/mall-recommend2/mall-recommend.vue'
import loading from '../loading/loading.vue'
import collection from '../home-page/collection/collection.vue'
import banner from '../home-page/banner2/banner2.vue'
const app = getApp()

// components/lazy-load-page/lazy-load-page.js
const homepageService = _apiHomepageServiceJs
const sysService = _apiSystemServiceJs
const productService = _apiProductServiceJs
const memberService = _apiMemberServiceJs
const couponService = _apiCouponServiceJs
const giftCardService = _apiGiftCardServiceJs
const ADDRESS = _utilsAddressJs
const NAVPAGE = _utilsNavPageJs

const emit = defineEmits(['upDataPageConfig'])
// 获取应用实例
const state = reactive({
  latitudeAndLongitude1: null,
  memberResource: {
    scoreBalance: null,
    reserveBalance: null,
    couponNum: null,
    giftcardNum: null,
  },
  codeType: '',
  updataFlag: false,
  pageScrollData1: null,
  countdownFn: null,
  timeNumber: 0,
  banners: [],
  noticeColour: null,
  isHomeShowTopSearch: true,
  // 首页是否展示顶部搜索栏,默认true
  isHomeShowTopMember: false,
  // 首页是否展示顶部会员区,默认false
  isHomeShowCenterMember: false,
  // 首页是否展示中部会员区,默认false
  isHomeShowNearStore: false,
  // 首页是否展示附近门店,默认false
  hasMemberModule: false,
  // 是否启用中部会员区
  isShowHotGoods: false,
  // 是否显示热门商品
  isShowProductAreaTitle: false,
  // 是否显示热门商品标题
  hotTitleImgUrl: '',
  memberInfoFunctionEntry: [],
  loaded: false,
  isSearchFixed: false,
  isShowCollection: false,
  // 是否显示添加收藏组件
  showHotGoods: true,
  homeModel: [],
  // 搜索栏区域风格 风格1搜索显示在标题行左侧/风格2显示在标题行下方，搜索框的颜色取系统主题色配置
  nearStoreStyle: '',
  topSearchStyle: '',
  // 附近门店区风格  风格1显示在标题行左侧，风格2位置固定在界面第一个组件下方，风格3固定在商场精选上方
  navHeight: 0,
})
const props = defineProps({
  show: {
    type: Boolean,
    value: false,
  },
  ownModule: String,
  // homePage
  storeId: {
    type: String,
    value: '',
  },
  refreshType: {
    type: String,
    value: '',
  },
  pageScrollData: Object,
  latitudeAndLongitude: {
    type: String,
    value: '',
  },
  shopCart: Object,
  previewId: String,
})

// Watch listeners converted from observers
watch(
  () => props.latitudeAndLongitude,
  (newVal, oldVal) => {
    if (newVal && newVal != oldVal) {
      state.latitudeAndLongitude1 = newVal
    }
  },
)
watch(
  () => props.show,
  (newVal, oldVal) => {
    state.showFlag = newVal
    reload()
  },
)
watch(
  () => props.storeId,
  async (newVal, oldVal) => {
    if (newVal && oldVal && newVal != oldVal) {
      await preLoading()
    }
  },
)
watch(
  () => props.refreshType,
  async (newVal, oldVal) => {
    state.refreshTypeData = newVal
    app.globalData.storeInfo =
      app.globalData.storeInfo && app.globalData.storeInfo.id
        ? app.globalData.storeInfo
        : uni.getStorageSync('storeIdactive')
    if (newVal && newVal != oldVal && newVal != 'USER' && newVal != 'ONSHOW') {
      if (!app.globalData.storeInfo || !app.globalData.storeInfo.id) {
        // 获取到当前的地理位置，查找出最近的门店
        await getStoreInfo()
      } else {
        await preLoading()
      }
    } else if (newVal == 'USER') {
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        queryScore()
        queryCoupon()
        queryBalance()
        queryGiftCard()
      }
    }
  },
)
onBeforeMount(async () => {
  app.globalData.storeInfo =
    app.globalData.storeInfo && app.globalData.storeInfo.id
      ? app.globalData.storeInfo
      : uni.getStorageSync('storeIdactive')
  await preLoading()
  // if (!app.globalData.storeInfo || !app.globalData.storeInfo.id) {
  //   await getStoreInfo()
  // } else {
  //   await preLoading()
  // }
})
onMounted(function () {
  // this.preLoading()
  if (!props.pageScrollData) {
    getScorll()
  } else {
    state.pageScrollData1 = props.pageScrollData
  }
})
onShow(() => {
  state.timeNumber = new Date().getTime()
  if (state.countdownFn) {
    clearInterval(state.countdownFn)
    state.countdownFn = null
  } else {
    const time = setInterval(() => {
      state.timeNumber = new Date().getTime()
    }, 1000)
    state.countdownFn = time
  }
})
onHide(() => {
  if (state.countdownFn) {
    clearInterval(state.countdownFn)
    state.countdownFn = null
  }
})
function getScorll() {
  const that = this
  const pages = getCurrentPages() || []
  let curPage = null
  if (pages && pages.length > 0) {
    curPage = pages[pages.length - 1]
  }
  if (curPage && typeof curPage.onPageScroll === 'function') {
    curPage.onPageScroll = function (e) {
      state.pageScrollData1 = e
    }
  }
}
async function getStoreInfo(options) {
  if (!app.globalData.storeInfo || !app.globalData.storeInfo.id) {
    // 获取到当前的地理位置，查找出最近的门店
    await ADDRESS.getAllStore1()
    await preLoading()
  }
}
async function preLoading() {
  const self = this
  const flag = false
  state.showHotGoods = app.globalData?.systemConfigure?.showHotGoods
  console.log(props.ownModule, 'state.ownModulestate.ownModule')
  sysService
    .query('app.mbr.member-code-style')
    .then((res) => {
      state.codeType = res && res[0] ? res[0].value : ''
    })
    .catch((err) => {})
  if (props.ownModule === 'homePage') {
    console.log('this is home page')
    let queryHomeMemberInfo = null
    try {
      if (state.previewId) {
        queryHomeMemberInfo = await sysService.queryHomeMemberDetailUiInfo({
          id: state.previewId,
          // storeId: app.globalData.storeInfo && app.globalData.storeInfo.id ? app.globalData.storeInfo.id : ''
        })
      } else {
        queryHomeMemberInfo = await sysService.queryHomeMemberInfoUiInfo({
          uiType: 'HOME',
          // storeId: app.globalData.storeInfo && app.globalData.storeInfo.id ? app.globalData.storeInfo.id : ''
        })
      }
    } catch {
      if (!queryHomeMemberInfo) {
        state.homeModel = []
        if (state.showTipFlag) return
        state.showTipFlag = true
        // wx.showModal({
        //   title: '提示',
        //   confirmText: '选择门店',
        //   content: '当前门店未查到首页可视化配置，请联系管理员',
        //   success (res) {
        //     if (res.confirm) {
        //       NAVPAGE.toSelectStore()
        //     }
        //   },
        //   complete: (res) => {
        //     this.data.showTipFlag = false
        //   }
        // })
        return
      }
    }
    const arr = queryHomeMemberInfo.dataList
    // self.setData({
    //     homeModel: arr
    // })
    const list = []
    const conventionConfig =
      arr && arr[0] && arr[0].type == 'conventionConfig' ? JSON.parse(arr[0].content) : {}
    if (conventionConfig) {
      emit('upDataPageConfig', conventionConfig)
    }
    if (arr) {
      arr.splice(0, 1)
    }
    arr.map(async (item, index) => {
      item = item.content
        ? {
            ...item,
            ...JSON.parse(item.content),
          }
        : item
      delete item.content
      item.beginTimeStamp = item.beginTime
        ? new Date(item.beginTime.replace(/-/g, '/')).getTime()
        : null
      item.endTimeStamp = item.endTime ? new Date(item.endTime.replace(/-/g, '/')).getTime() : null
      if (item.type == 'QHDyihangsanzhang') {
        const flag = isTimeFrame(item.beginTime, item.endTime)
        if (!(item.beginTime && item.endTime) || !flag) {
          item = null
        }
        list[index] = item
        const flag1 = list.some((detail) => {
          return list.length != arr.length
        })
        if (!flag1) {
          state.homeModel = list
        }
      } else if (item.type == 'shangpingliebiao' || item.type == 'henghualiebiao') {
        const flag = isTimeFrame(item.beginTime, item.endTime)
        if (!(item.beginTime && item.endTime) || !flag) {
          item = null
          list[index] = item
          const flag1 = list.some((detail) => {
            return list.length != arr.length
          })
          if (!flag1) {
            state.homeModel = list
          }
        } else {
          if (item && item.products && item.products.length) {
            const commodityIdArr = []
            const storeId = app.globalData.storeInfo && app.globalData.storeInfo.id
            item.products.map(async (items, index1) => {
              commodityIdArr.push(items.productId || items.id)
            })
            const storeIdList = [storeId]
            if (app.globalData.distributionStore && app.globalData.distributionStore.id) {
              storeIdList.push(app.globalData.distributionStore.id)
            }
            if (app.globalData.nextDayStore && app.globalData.nextDayStore.id) {
              storeIdList.push(app.globalData.nextDayStore.id)
            }
            await productService
              .queryV2({
                productIdIn: commodityIdArr,
                // storeIdIn: storeIdList,
              })
              .then((res) => {
                if (res && res.length) {
                  res.sort((a, b) => {
                    return commodityIdArr.indexOf(a.id) - commodityIdArr.indexOf(b.id)
                  })
                  res.sort((a, b) => {
                    return (b.balance > 0) - (a.balance > 0)
                  })
                  item.productsForPc = res
                  const numberSize = Math.ceil(res.length / 8)
                  const lengthNumber = Math.ceil(res.length / (numberSize > 2 ? numberSize : 2))
                  item.productsForPcLength =
                    lengthNumber > 8 || lengthNumber < 3 ? (lengthNumber > 8 ? 8 : 3) : lengthNumber
                }
                list[index] = item
                const flag1 = list.some((detail) => {
                  return list.length != arr.length
                })
                if (!flag1) {
                  state.homeModel = list
                }
              })
          } else {
            list[index] = item
            const flag1 = list.some((detail) => {
              // !detail ||
              return list.length != arr.length
            })
            if (!flag1) {
              state.homeModel = list
            }
          }
        }
      } else if (item.type == 'shangpingfenlei' && item.productCategory) {
        item.productCategory.forEach(async (productCategoryItem, productCategoryIndex) => {
          if (
            productCategoryItem &&
            productCategoryItem.products &&
            productCategoryItem.products.length
          ) {
            const commodityIdArr = []
            const storeId = app.globalData.storeInfo && app.globalData.storeInfo.id
            productCategoryItem.products.map(async (items, index1) => {
              commodityIdArr.push(items.productId || items.id)
            })
            const storeIdList = [storeId]
            if (app.globalData.distributionStore && app.globalData.distributionStore.id) {
              storeIdList.push(app.globalData.distributionStore.id)
            }
            if (app.globalData.nextDayStore && app.globalData.nextDayStore.id) {
              storeIdList.push(app.globalData.nextDayStore.id)
            }
            await productService
              .queryV2({
                productIdIn: commodityIdArr,
                // storeIdIn: storeIdList,
              })
              .then((res) => {
                if (res && res.length) {
                  res.sort((a, b) => {
                    return commodityIdArr.indexOf(a.id) - commodityIdArr.indexOf(b.id)
                  })
                  res.sort((a, b) => {
                    return (b.balance > 0) - (a.balance > 0)
                  })
                  productCategoryItem.productsForPc = res
                  const numberSize = Math.ceil(res.length / 8)
                  const lengthNumber = Math.ceil(res.length / (numberSize > 2 ? numberSize : 2))
                  productCategoryItem.productsForPcLength =
                    lengthNumber > 8 || lengthNumber < 3 ? (lengthNumber > 8 ? 8 : 3) : lengthNumber
                }
                list[index] = item
                const flag1 = list.some((detail) => {
                  return list.length != arr.length
                })
                if (!flag1) {
                  state.homeModel = list
                }
              })
          } else {
            list[index] = item
            const flag1 = list.some((detail) => {
              return list.length != arr.length
            })
            if (!flag1) {
              state.homeModel = list
            }
          }
        })
      } else {
        if (item.type == 'jingtaitu' || item.type == 'lunbotu' || item.type == 'fenqu') {
          const imageItems = []
          // 防止数据互串
          item.imageItems.map((items, idx) => {
            // let flag1 = self.isTimeFrame(item.beginTime,item.endTime)
            // let flag2 = self.isTimeFrame(items.beginTime,items.endTime)
            // if(!(item.beginTime && item.endTime) || !flag1){
            //   if(item.type == 'fenqu') {
            //     item.noShowFlag = true;
            //   }
            // } else if((!(items.beginTime && items.endTime) || !flag2) && item.type == 'lunbotu'){
            // } else {
            //   items.beginTimeStamp = items.beginTime ? new Date(items.beginTime.replace(/-/g, '/')).getTime() : null;
            //   items.endTimeStamp = items.endTime ? new Date(items.endTime.replace(/-/g, '/')).getTime() : null;
            //   imageItems.push(items)
            // }
            items.beginTimeStamp = items.beginTime
              ? new Date(items.beginTime.replace(/-/g, '/')).getTime()
              : null
            items.endTimeStamp = items.endTime
              ? new Date(items.endTime.replace(/-/g, '/')).getTime()
              : null
            imageItems.push(items)
          })
          item.imageItems = JSON.parse(JSON.stringify(imageItems))
        }
        if (
          item.type == 'erfentu' ||
          item.type == 'sanfentu' ||
          item.type == 'yihangsanzhang' ||
          item.type == 'yihangsizhang'
        ) {
          const flag = isTimeFrame(item.beginTime, item.endTime)
          if (!(item.beginTime && item.endTime) || !flag) {
            // arr.splice(index,1)
            item = null
          }
        }
        list[index] = item
        const flag = list.some((detail) => {
          return list.length != arr.length
        })
        if (!flag) {
          state.homeModel = list
        }
      }
    })
    const BooleanList = [
      'isHomeShowTopSearch',
      'isShowHotGoods',
      'isShowProductAreaTitle',
      'isHomeShowNearStore',
      'isHomeShowTopMember',
      'isHomeShowCenterMember',
      'isHomeShowNotice',
      'isLunbotuTopScreen',
      'isShowScorePayCode',
    ]
    const keys = Object.keys(conventionConfig)
    keys.forEach((key) => {
      if (key == 'pageTitle') {
        state.navigationBarTitle = conventionConfig[key] + '预览'
      } else if (key == 'bgMarginTop') {
        state.bgMarginTop = conventionConfig[key] * 2 - 6
      } else if (BooleanList.indexOf(key) > -1) {
        state[key] = conventionConfig[key] === 'TRUE'
      } else {
        state[key] = conventionConfig[key]
        if (key == 'liveRoomLogoUrl') {
          app.globalData.systemConfigure[key] = conventionConfig[key]
        }
      }
    })
    state.showHotGoods = app.globalData.systemConfigure.showHotGoods
    state.isHomeShowNotice = !!(
      typeof conventionConfig.isHomeShowNotice === 'string' &&
      conventionConfig.isHomeShowNotice === 'TRUE'
    )
    if (conventionConfig && conventionConfig.isHomeShowCenterMember == 'TRUE') {
      // if (app.globalData.systemConfigure.showCenterMbrModule) {
      // 查询接口控制中部会员区显示
      queryMemberInfo()
    }
    try {
      const show = uni.getStorageSync('wj_showPushCollectShowed')
      if (!show) {
        state.isShowCollection = !app.globalData.isPushCollectShowed
      } else {
        app.globalData.isPushCollectShowed = true
        state.isShowCollection = false
      }
    } catch (e) {
      state.isShowCollection = !app.globalData.isPushCollectShowed
    }
  }
}
function reload() {
  const self = this
  if (!app.globalData.uiconfig) {
    return
  }
  // const uiconfig = app.globalData.uiconfig;
  // if (this.data.ownModule === "homePage") {
  //   let isHomeShowTopSearch = true;
  //   let isHomeShowTopMember = false;
  //   let isHomeShowCenterMember = false;
  //   let isHomeShowNearStore = false;
  //   let isShowScorePayCode = false;
  //   let isHomeShowNotice = false;
  //   let noticeColour = null;
  //   uiconfig.isHomeShowTopSearch === true ? isHomeShowTopSearch = true : isHomeShowTopSearch = false;
  //   uiconfig.isHomeShowTopMember === true ? isHomeShowTopMember = true : isHomeShowTopMember = false;
  //   uiconfig.isHomeShowCenterMember === true ? isHomeShowCenterMember = true : isHomeShowCenterMember = false;
  //   uiconfig.isHomeShowNearStore === true ? isHomeShowNearStore = true : isHomeShowNearStore = false;
  //   uiconfig.isShowScorePayCode === true ? isShowScorePayCode = true : isShowScorePayCode = false;
  //   uiconfig.isHomeShowNotice === true ? isHomeShowNotice = true : isHomeShowNotice = false;
  //   uiconfig.isHomeShowNotice && uiconfig.isHomeShowNotice.colour ? noticeColour = uiconfig.isHomeShowNotice.colour : noticeColour = null;

  //   let afterShareToDraw = false;
  //   if (uiconfig.afterShareToDraw) {
  //     afterShareToDraw = uiconfig.afterShareToDraw
  //   }
  //   this.setData({
  //     afterShareToDraw: afterShareToDraw
  //   })

  //   if (!app.globalData.systemConfigure.showScorePayCode) {
  //     isShowScorePayCode = false
  //   }
  //   this.setData({
  //     isHomeShowTopSearch: isHomeShowTopSearch,
  //     isHomeShowTopMember: isHomeShowTopMember,
  //     isHomeShowCenterMember: isHomeShowCenterMember,
  //     isHomeShowNearStore: isHomeShowNearStore,
  //     isShowScorePayCode: isShowScorePayCode,
  //     isHomeShowNotice: isHomeShowNotice,
  //     noticeColour: noticeColour,
  //     // displayStyle: displayStyle ? displayStyle : '',
  //   })
  // }
  if (props.storeId) {
    state.loaded = true
  }
  state.showHotGoods = app.globalData.systemConfigure.showHotGoods
  state.navHeight = app.globalData.navHeight
}
function queryMemberInfo() {
  const self = this
  homepageService
    .queryMemberInfo()
    .then((res) => {
      if (res && res.hasUse === true) {
        if (res.modelInfos) {
          const tempList = []
          res.modelInfos.forEach((item) => {
            const tempItem = {
              ...item,
              modelUrl: item.modelUrl ? item.modelUrl : '',
            }
            //   if (item.modelType === 'COUPON') {
            //     tempItem.text = '优惠券'
            //     tempItem.route = '/pages-sub/newretail/pages/mallModule/coupon/myCoupon/myCoupon'
            //   } else if (item.modelType === 'SCORE') {
            //     tempItem.text = '积分'
            //     tempItem.route = '/pages-sub/newretail/pages/mallModule/score/score/score'
            //   } else if (item.modelType === 'RECHARGE') {
            //     tempItem.text = '充值'
            //     tempItem.route = '/pages-sub/newretail/pages/mallModule/myCard/recharge/recharge'
            //   } else if (item.modelType === 'GIFTCARD') {
            //     tempItem.text = '礼品卡'
            //     tempItem.route = '/pages-sub/newretail/pages/memberModule/giftCard/buyHistory/buyHistory'
            //   }
            tempList.push(tempItem)
          })
          state.hasMemberModule = true
          state.memberInfoFunctionEntry = tempList
        } else {
          state.hasMemberModule = true
        }
      } else {
        state.hasMemberModule = false
      }
    })
    .catch((err) => {
      state.hasMemberModule = false
      if (err.message != null) {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function getBanner(e) {
  state.banners = e.detail
  triggerEvent('banner', e.detail)
}
function handleRefreshData(e) {
  if (e.detail === 'USER') {
    state.refreshTypeData = e.detail
    triggerEvent('refresh', e.detail)
    setTimeout(() => {
      state.refreshTypeData = ''
    }, 100)
  }
}
function queryGiftCard() {
  const statusEquals = 'ACTIVED'
  if (
    app.globalData.userInfo &&
    app.globalData.userInfo.member &&
    app.globalData.userInfo.member.id != null
  ) {
    giftCardService
      .queryMyGiftCard(app.globalData.userInfo.member.id, statusEquals)
      .then((res) => {
        if (res) {
          state.memberResource.giftcardNum = res.length
        }
      })
      .catch((err) => {
        console.error('查询礼品卡报错：', err.message)
        state.memberResource.giftcardNum = 0
      })
  }
}
function queryScore() {
  if (!app.globalData.userInfo || !app.globalData.userInfo.member) return false
  memberService
    .getBalance(app.globalData.userInfo.member.mobile)
    .then((res) => {
      state.memberResource.scoreBalance = res
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function queryBalance() {
  memberService
    .getMbrBalance()
    .then((res) => {
      if (res || res == 0) {
        state.memberResource.reserveBalance = res.toFixed(2)
      }
    })
    .catch((e) => {
      if (e.message !== '查询会员余额失败') {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000,
        })
      } else {
        console.log('查询会员余额失败')
      }
    })
}
function queryCoupon() {
  couponService
    .getMbrUnUseCouponCount()
    .then((res) => {
      state.memberResource.couponNum = res
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function toMemberCard(e) {
  triggerEvent('toMemberCard', e)
}
function getUserInfo(e) {
  triggerEvent('getUserInfo', e.detail)
}
function bannerJumping(e) {
  triggerEvent('bannerJumping', e.detail)
}
function jumptoDetail(e) {
  triggerEvent('jumptoDetail', e.detail)
}
function clickFunctionEntry(e) {
  triggerEvent('clickFunctionEntry', e.detail)
}
function activityJumping(e) {
  triggerEvent('activityJumping', e.detail)
}
function toGoodsDetail(e) {
  triggerEvent('toGoodsDetail', e.detail)
}
function onClickGoods(e) {
  triggerEvent('onClickGoods', e.detail)
}
function addToCart(e) {
  triggerEvent('addToCart', e.detail)
}
function decrease(e) {
  triggerEvent('decrease', e.detail)
}
function subscribeArrivalRemind(e) {
  triggerEvent('subscribeArrivalRemind', e.detail)
}
function noop(e) {
  triggerEvent('noop', e.detail)
}
function bindOfficialAccountLoad(e) {
  triggerEvent('officialAccountLoad', e)
}
function bindOfficialAccountError(e) {
  triggerEvent('officialAccountError', e)
}
function handlePushCollect(e) {
  state.isShowCollection = false
  triggerEvent('pushCollect', e.detail)
}
function isTimeFrame(beginTime, endTime) {
  const beginDate = new Date(beginTime).getTime()
  const endDate = new Date(endTime).getTime()
  const currentDate = new Date().getTime()
  return currentDate >= beginDate && currentDate <= endDate
}
</script>
<style scoped>
/* components/lazy-load-page/lazy-load-page.wxss */
.official-account {
  width: 670rpx;
  margin: 20rpx auto;
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
.search_bar {
  background-color: #fff;
}
.search_bar_2 {
  position: fixed;
  left: 0;
  z-index: 100;
  top: 0;
  width: 100%;
}
</style>
