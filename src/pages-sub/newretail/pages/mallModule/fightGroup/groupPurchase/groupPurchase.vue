<template>
  <!--pages/groupPurchase/groupPurchase.wxml-->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <movable-area>
    <view class="page-content">
      <view class="group-purchase-box" :hidden="!state.groupActivity">
        <view
          class="group-goods-item"
          @click="toGoodsDetail"
          data-type="group"
          :data-productId="state.teamBuyId"
        >
          <view class="group-goods-img-box">
            <image :src="state.productDetails.imageUrl" mode="aspectFit"></image>
          </view>
          <view class="group-goods-info">
            <text class="goods-name">{{ state.name }}</text>
            <text class="goods-desc">{{ state.description }}</text>
            <text class="group-number">{{ state.teamMemberCount }}人团</text>
            <view class="goods-price">
              ￥
              <text class="nowPrice">{{ state.teamMemberAllPrice }}</text>
              <text class="oldPrice" :hidden="state.originalPrice">
                ￥{{ state.originalPrice }}
              </text>
            </view>
          </view>
        </view>
        <view class="group-people-list">
          <view v-if="state.teamBuyingType !== 'THOUSAND'">
            <view
              class="people-item leader"
              v-for="(item, idx) in joinMbrs"
              :key="idx"
              v-if="idx == 0"
              :hidden="state.joinPeopleCount == 0"
            >
              <image :src="item.avatar"></image>
              <text class="leader-label">团长</text>
            </view>
          </view>
          <view v-if="state.teamBuyingType === 'THOUSAND'">
            <view
              class="people-item"
              v-for="(item, index) in joinMbrs"
              :key="index"
              v-if="state.teamPeopleCount > 10 ? index < 9 : index < state.teamPeopleCount"
            >
              <image :src="item.avatar"></image>
            </view>
            <view
              class="people-item"
              v-for="(item, index) in state.teamPeopleCount - state.joinPeopleCount"
              v-if="
                state.teamPeopleCount > 10
                  ? index < 9 - state.joinPeopleCount
                  : state.teamPeopleCount - state.joinPeopleCount
              "
              :key="index"
            >
              <text>?</text>
            </view>
          </view>
          <view v-if="state.teamBuyingType !== 'THOUSAND'">
            <view
              class="people-item"
              v-for="(item, index) in joinMbrs"
              :key="index"
              v-if="state.teamPeopleCount > 10 ? index < 8 : index < state.teamPeopleCount"
              :hidden="index == 0"
            >
              <image :src="item.avatar"></image>
            </view>
            <view
              class="people-item"
              v-for="(item, index) in state.teamPeopleCount - state.joinPeopleCount"
              v-if="
                state.teamPeopleCount > 10
                  ? index < 9 - state.joinPeopleCount
                  : state.teamPeopleCount - state.joinPeopleCount
              "
              :key="index"
            >
              <text>?</text>
            </view>
          </view>
          <view class="people-more" v-if="state.teamPeopleCount > 10" :key="index">
            <image :src="state.imagesPath.iconCollageMore"></image>
          </view>
        </view>
        <view v-if="state.pageFrom == 'normal' && !state.isSharePeople">
          <text class="group-tips" v-if="!state.teamBuyEnd">
            <text :hidden="state.teamMemberCount - state.joinMemberCount == 0">
              拼单中，还差{{
                state.teamMemberCount - state.joinMemberCount > 0
                  ? state.teamMemberCount - state.joinMemberCount
                  : 0
              }}人，还剩{{ state.countDownList.hou }}:{{ state.countDownList.min }}:{{
                state.countDownList.sec
              }}
            </text>
            <text
              v-if="
                state.teamMemberCount - state.joinMemberCount == 0 || state.teamStatus == 'success'
              "
            >
              该团购已成团
            </text>
          </text>
          <text class="group-tips" v-if="state.teamBuyEnd">当前团购活动已过期...</text>
          <button
            v-if="!hasUserInfo"
            :class="
              'join-group ' +
              (state.teamMemberCount - state.joinMemberCount == 0 ? 'unavailable' : 'usable')
            "
            @click="getUserInfo"
            :hidden="state.teamBuyEnd || state.teamStatus !== 'normal'"
          >
            一键参团
          </button>
          <button
            v-else-if="!isMember"
            :class="
              'join-group ' +
              (state.teamMemberCount - state.joinMemberCount == 0 ? 'unavailable' : 'usable')
            "
            :hidden="state.teamBuyEnd || state.teamStatus !== 'normal'"
            @click="toAuthorize"
          >
            一键参团
          </button>
          <button
            v-else
            data-type="member"
            :class="
              'join-group ' +
              (state.teamMemberCount - state.joinMemberCount == 0 ? 'unavailable' : 'usable')
            "
            :hidden="state.teamBuyEnd || state.teamStatus !== 'normal'"
            @click="openTeamBuySpecs"
          >
            一键参团
          </button>
        </view>
        <view v-if="state.pageFrom == 'orderPay' || state.isSharePeople">
          <button
            class="share-group"
            open-type="share"
            @click="subscriptionMessagePopup"
            :hidden="state.teamMemberCount - state.joinMemberCount == 0 || state.teamBuyEnd"
          >
            邀请好友拼单 {{ state.countDownList.hou }}:{{ state.countDownList.min }}:{{
              state.countDownList.sec
            }}
            后结束
          </button>
        </view>
        <view v-if="!state.teamBuyEnd && state.teamStatus == 'normal'" class="group-share-text">
          分享到3个群，有95%的机会在5分钟内成团
        </view>
      </view>
      <view class="blank-box" :style="state.groupActivity ? '' : 'padding-top:20rpx'"></view>
      <recommend-list
        :storeId="state.storeId"
        type="payment"
        :productIds="state.productIds"
      ></recommend-list>
    </view>
    <view class="group-share-img-box">
      <canvas canvas-id="groupPictureCanvas"></canvas>
    </view>

    <!-- 优惠券弹窗 -->
    <popup
      :show="state.show.promotion"
      position="middle"
      custom-class="middle"
      @close="togglePromotionPopup"
    >
      <view class="popup-box">
        <view class="popup-title">温馨提示</view>
        <view>
          <view class="content">
            <view class="popup-content">
              <text class="popup-tips">恭喜您获得</text>
              <text
                class="popup-text"
                :style="'color: ' + state.themeColor"
                v-for="(item, index) in state.couponPromotions"
                :key="key"
              >
                {{ item }}
              </text>
            </view>
            <view class="popup-button">
              <text>优惠券已放入您的券包</text>
              <button
                class="share-btn"
                :style="'background: ' + state.themeColor"
                @click="foundPromotion"
              >
                查看我的优惠券
              </button>
            </view>
          </view>
        </view>
      </view>
    </popup>

    <popup
      :show="state.show.luckDraw"
      position="top"
      custom-class="top"
      @close="toggleLuckDrawPopup"
      :overlayStyle="state.luckDrawImageBg"
    >
      <view class="popup-luckdraw-box">
        <luckdraw-game
          :luckDrawText="state.luckDrawTextImage"
          @draw="getUserClickDraw"
          :onClickLuckDraw="isMember"
          @fans="getUserIsFans"
          :status="state.raffleResult"
          :hasUserInfo="hasUserInfo"
        ></luckdraw-game>
        <view class="popup-luckdraw-close" @click="toggleLuckDrawPopup">
          <image :src="state.imagesPath.iconIndexPopupClose"></image>
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.luckDrawPopup"
      position="middle"
      custom-class="middle"
      @close="togglePopupLuckDraw"
    >
      <view class="popup-luckdraw-window-box">
        <view class="popup-window-image">
          <image
            :src="state.popupWindowImage"
            mode="widthFix"
            v-if="!state.afterShareToDraw"
            @click="handlePopupDraw"
          ></image>
          <button open-type="share" data-type="luckDraw" v-else>
            <image :src="state.popupWindowImage" mode="widthFix"></image>
          </button>
        </view>
        <view class="popup-luckdraw-window-close" @click="togglePopupLuckDraw">
          <image :src="state.imagesPath.iconIndexPopupClose"></image>
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.middle"
      position="middle"
      custom-class="middle"
      @close="toggleMiddlePopup"
    >
      <view class="popup-box">
        <view class="popup-title">抽奖结果</view>
        <view class="popup-close" @click="toggleMiddlePopup">
          <image :src="state.imagesPath.iconLuckDrawClose"></image>
        </view>
        <view v-if="state.hasRaffleCoupon">
          <view class="popup-content">
            <text class="popup-tips">恭喜您成功领取</text>
            <text class="popup-text" :style="'color: ' + state.themeColor">
              {{ state.raffleInfo.rafflePrizeName }}
            </text>
          </view>
          <view class="popup-button">
            <text>券已放入您的账户</text>
            <button
              class="share-btn"
              :style="'background: ' + state.themeColor"
              data-shareType="raffle"
              open-type="share"
            >
              把好运气分享给小伙伴
            </button>
          </view>
        </view>
        <view v-if="!state.hasRaffleCoupon">
          <view class="popup-content">
            <text class="popup-text-end" :style="'color: ' + state.themeColor">您来晚了</text>
            <text class="popup-text-end" :style="'color: ' + state.themeColor">
              奖品已被抽光了！
            </text>
          </view>
          <view class="popup-button">
            <text>活动期间下单可获得抽奖机会</text>
            <button class="share-btn" :style="'background: ' + state.themeColor" @click="toIndex">
              去商场逛逛
            </button>
          </view>
        </view>
      </view>
    </popup>
    <movable-view :x="state.x" :y="state.y" direction="all" v-if="state.homeBack">
      <image class="movable-view" :src="state.imagesPath.toHome" @click="toHome"></image>
    </movable-view>
  </movable-area>
  <authorize @login="handleUserLogin"></authorize>
  <!-- 商品规格 -->
  <popup
    :show="state.show.goodsSpec"
    position="bottom"
    custom-class="bottom"
    @close="toggleGoodsSpecPopup"
  >
    <goods-spec
      :specs="state.specs"
      :specDetails="state.specDetails"
      activity-type="group"
      :hasSelected="hasSelected"
      @close="toggleGoodsSpecPopup"
      :goodsImg="goodsImg"
      :price="state.sellPrice"
      :has-team-leader="state.hasTeamLeader"
      @confirm="confirmSpecs"
    ></goods-spec>
  </popup>
</template>
<script setup>
import _utilsSubscribeMessageJs from '@/utils/newretail/subscribeMessage'
import _utilsLogJs from '@/utils/newretail/log'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiRaffleServiceJs from '@/service/api/newretail/raffleService'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _apiTeamBuyServiceJs from '@/service/api/newretail/teamBuyService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import recommendList from '@/pages-sub/newretail/components/recommend/recommend-list-two/recommend-list.vue';
import goodsSpec from '@/pages-sub/newretail/components/product/goods-spec/goods-spec.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
// pages/groupPurchase/groupPurchase.js
const teamBuyService = _apiTeamBuyServiceJs
const storeService = _apiStoreServiceJs
const orderService = _apiOrderServiceJs
const raffleService = _apiRaffleServiceJs
const productService = _apiProductServiceJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs
const log = _utilsLogJs
const subscribeMessage = _utilsSubscribeMessageJs
let app = app
const state = reactive({
  navigationBarTitle: '开团详情',
  imagesPath: IMGAGESPATH,
  name: '',
  description: '',
  teamLeaderPrice: '',
  teamMemberPrice: '',
  teamMemberCount: '',
  teamMemberJoinCount: 1,
  teamAllPrice: '',
  // 拼团总价
  teamMemberAllPrice: '',
  // 拼团会员价总价
  joinMemberCount: '',
  teamPeopleCount: 0,
  joinPeopleCount: 0,
  productDetails: {},
  stores: [],
  storeId: '',
  storeName: '',
  teamBuyingStatus: '',
  teamBuyingType: '',
  countDownList: {},
  originalPrice: '',
  teamBuyTimeList: [],
  goodsList: [],
  tabSelected: '0',
  category: [],
  leaderImageUrl: '',
  memberImageUrl: '',
  teamBuying: [],
  sellPrice: '',
  teamBuyEnd: false,
  endTime: '',
  groupTimeId: 0,
  phone: false,
  orderSelfScope: '',
  recommendingList: [],
  x: 750,
  y: 350,
  scale: 2,
  homeBack: false,
  groupActivity: true,
  teamStatus: 'normal',
  // success 成团  fail 失败 ongoing  进行中 normal 正常的
  pageFrom: 'normal',
  // normal（正常分享）, orderPay （拼团订单支付）
  isSharePeople: false,
  show: {
    middle: false,
    luckDraw: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    goodsSpec: false,
    promotion: false,
    luckDrawPopup: false,
  },
  luckDrawTextImage: './image/text.png',
  overlayStyle: '',
  raffleId: '',
  raffleInfo: {},
  teamBuyId: '1',
  teamLeaderRecordId: '2',
  hasRaffleCoupon: true,
  activeState: 'start',
  // start end
  raffleResult: 'UNSTART',
  raffleActivityId: '',
  raffleType: 'LHJ',
  luckDrawImageBg: '',
  distributionStoreId: uni.getStorageSync('distributionStoreId'),
  distributionStoreName: '',
  isDistributionOrder: false,
  specs: [],
  specDetails: [],
  hasTeamLeader: false,
  couponPromotions: [],
  // 优惠券
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  afterShareToDraw: false,
  popupWindowImage: '',
  productIds: [],
})
const _data = {
  hasUserDraw: false,
}
function joinGroup(e) {
  const self = this
  const loginStatus = checkAuth()
  if (loginStatus) {
    if (state.balance > 0) {
      const goodsList = []
      goodsList.push(state.productDetails)
      const teamBuy = {
        allPrice: (teamBuyings.teamMemberPrice * teamBuyings.teamMemberJoinCount).toFixed(2),
        storeId: state.isDistributionOrder ? state.distributionStoreId : state.storeId,
        storeName: state.isDistributionOrder ? state.distributionStoreName : state.storeName,
        goodsList: [],
        teamBuyId: teamBuyings.id,
        teamLeaderRecordId: state.teamLeaderRecordId,
        orderType: 'group',
        teamBuyInfo: {
          endTime: teamBuyings.endTime,
          orderSelfScope: teamBuyings.orderSelfScope,
          selfStartTime: teamBuyings.selfStartTime,
          selfEndTime: teamBuyings.selfEndTime,
          canUseCoupon: teamBuyings.canUseCoupon,
          canUseScore: teamBuyings.canUseScore,
          teamMemberJoinCount: teamBuyings.teamMemberJoinCount,
          orderLimitCount: teamBuyings.orderLimitCount,
          selfAfterDay: teamBuyings.selfAfterDay,
        },
        shipmentType: teamBuyings.shipmentType,
        // 添加活动的配送方式
        scource: 'BUYNOW',
      }
      goodsList.forEach((item) => {
        item = {
          ...item,
          productId: item.id,
          productNum: teamBuyings.teamMemberJoinCount,
          sellPrice: teamBuyings.teamMemberPrice,
        }
        teamBuy.goodsList.push(item)
      })
      uni.setStorageSync('wj_shopcart', teamBuy)
      if (teamBuyings - state.joinMemberCount == 0) {
      } else {
        if (app.globalData.userInfo.member) {
          NAVPAGE.toPerfectOrder()
        } else {
          NAVPAGE.toAuthorize()
        }
      }
    } else {
      uni.showToast({
        title: '门店正在补货中，去看看别的吧~',
        icon: 'none',
        duration: 2000,
      })
    }
  } else {
  }
}
function queryGoods(storeId) {
  const that = this
  const storeIdIn = [storeId]
  ADDRESS.getDistributionStore()
    .then((res) => {
      if (res) {
        storeIdIn.push(res.id)
      }
      handleQueryGoods(storeIdIn)
    })
    .catch((err) => {
      handleQueryGoods(storeIdIn)
    })
}
function handleQueryGoods(storeIdIn) {
  const self = this
  console.log(storeIdIn, state.teamBuyId, state.teamLeaderRecordId)
  if (state.teamBuyId) {
    const teamBuyId = state.teamBuyId
    const teamLeaderRecordId = state.teamLeaderRecordId
    const postData = {
      page: 1,
      pageSize: 1,
      searchCount: true,
      // orgIdIn: storeIdIn.join(","),
      storeIds: storeIdIn.join(','),
      status: 'STARTED',
      id: teamBuyId,
    }
    teamBuyService
      .query(postData)
      .then((res) => {
        if (res && res.records && res.records.length > 0) {
          let currentGroup = false
          let teamBuyingsItem = null
          res.records.forEach((item) => {
            if (item.id === teamBuyId) {
              currentGroup = true
              teamBuyingsItem = item
            }
          })
          if (currentGroup) {
            teamBuyService
              .getById(teamBuyId)
              .then((res) => {
                teamBuyings = {}
                teamBuyings = {
                  ...res,
                  teamMemberJoinCount: res.teamMemberJoinCount ? res.teamMemberJoinCount : 1,
                  selfAfterDay:
                    res.selfAfterDay || res.selfAfterDay === 0 ? res.selfAfterDay : null,
                }
                let storeId = storeIdIn[0]
                if (teamBuyingsItem.business === 'DISTRIBUTION' && storeIdIn.length > 1) {
                  storeId = storeIdIn[1]
                }
                queryStoreId = storeId
                getDetails(storeId, res.productId)
                if (res.type === 'SPEC') {
                  getTeamGoodsSpec(res.id, res.productId, storeId)
                }
                return teamBuyService.getRecordsByLeaderId(teamLeaderRecordId)
              })
              .then((res) => {
                const _teamBuyings = teamBuyings
                const tempJoinMbrs = []
                if (res.records.length > 0) {
                  if (_teamBuyings.teamBuyingType !== 'THOUSAND' && res.leader.mobile !== '匿名') {
                    const tempItem = {
                      avatar: res.leader.avatar ? res.leader.avatar : state.imagesPath.userImg1,
                    }
                    tempJoinMbrs.push(tempItem)
                  }
                  res.records.forEach((item) => {
                    const tempItem = {
                      ...item,
                      avatar: item.avatar ? item.avatar : state.imagesPath.userImg1,
                    }
                    if (item.mobile && item.mobile !== res.leader.mobile) {
                      tempJoinMbrs.push(tempItem)
                    }
                  })
                } else {
                  if (res.leader.joinMemberCount === _teamBuyings.teamMemberCount) {
                    // 处理模拟成团已成团，因为模拟成团可能存在records为空
                    if (_teamBuyings.teamBuyingType !== 'THOUSAND' && res.leader.mobile != '匿名') {
                      const tempItem = {
                        ...tempItem,
                        avatar: res.leader.avatar ? res.leader.avatar : state.imagesPath.userImg1,
                      }
                      tempJoinMbrs.push(tempItem)
                      const num = res.leader.joinMemberCount > 12 ? 12 : res.leader.joinMemberCount
                      for (let i = 0; i < num - 1; i++) {
                        const tempItem = {
                          ...tempItem,
                          avatar: state.imagesPath.userImg1,
                        }
                        tempJoinMbrs.push(tempItem)
                      }
                    } else {
                      const num = res.leader.joinMemberCount > 12 ? 12 : res.leader.joinMemberCount
                      for (let i = 0; i < num - 1; i++) {
                        const tempItem = {
                          ...tempItem,
                          avatar: state.imagesPath.userImg1,
                        }
                        tempJoinMbrs.push(tempItem)
                      }
                    }
                  } else {
                    if (res.leader.joinMemberCount === 1) {
                      const tempItem = {
                        avatar: res.leader.avatar ? res.leader.avatar : state.imagesPath.userImg1,
                      }
                      tempJoinMbrs.push(tempItem)
                    }
                  }
                }
                if (
                  state.pageFrom === 'normal' &&
                  _teamBuyings.teamBuyingType !== 'THOUSAND' &&
                  res.leader.mobile !== '匿名' &&
                  app.globalData.userInfo &&
                  app.globalData.userInfo.member &&
                  app.globalData.userInfo.member.mobile === res.leader.mobile
                ) {
                  state.isSharePeople = true
                }
                state.leaderImageUrl = state.imagesPath.userImg1
                state.teamMemberImageUrl = state.imagesPath.userImg1
                state.teamLeaderPrice = _teamBuyings.teamLeaderPrice
                  ? _teamBuyings.teamLeaderPrice
                  : _teamBuyings.teamMemberPrice
                state.teamMemberPrice = _teamBuyings.teamMemberPrice
                  ? _teamBuyings.teamMemberPrice
                  : ''
                state.teamMemberJoinCount = _teamBuyings.teamMemberJoinCount
                  ? _teamBuyings.teamMemberJoinCount
                  : 1
                state.joinMemberCount = res.leader.joinMemberCount
                state.teamMemberCount = _teamBuyings.teamMemberCount
                state.joinPeopleCount =
                  res.leader.joinMemberCount > 12 ? 12 : res.leader.joinMemberCount
                state.teamPeopleCount =
                  _teamBuyings.teamMemberCount > 12 ? 12 : _teamBuyings.teamMemberCount
                state.joinMbrs = tempJoinMbrs
                state.openTeamTime = res.leader.startTime
                  ? res.leader.startTime
                  : res.leader.createTime
                state.duration = _teamBuyings.duration
                state.teamBuyingType = _teamBuyings.teamBuyingType
                state.endTime = _teamBuyings.endTime
                state.orderSelfScope = _teamBuyings.orderSelfScope
                state.selfStartTime = _teamBuyings.selfStartTime ? _teamBuyings.selfStartTime : ''
                state.selfEndTime = _teamBuyings.selfEndTime ? _teamBuyings.selfEndTime : ''
                state.sharePicture = _teamBuyings.sharePicture ? _teamBuyings.sharePicture : ''
                _teamBuyings.teamLeaderPrice =
                  _teamBuyings.teamLeaderPrice != null
                    ? _teamBuyings.teamLeaderPrice
                    : _teamBuyings.teamLeaderPrice
                if (_teamBuyings.teamMemberJoinCount != null) {
                  state.teamAllPrice = parseFloat(
                    (_teamBuyings.teamLeaderPrice * _teamBuyings.teamMemberJoinCount).toFixed(2),
                  )
                  state.teamMemberAllPrice = parseFloat(
                    (_teamBuyings.teamMemberPrice * _teamBuyings.teamMemberJoinCount).toFixed(2),
                  )
                } else {
                  state.teamAllPrice = _teamBuyings.teamLeaderPrice
                    ? _teamBuyings.teamLeaderPrice
                    : _teamBuyings.teamMemberPrice
                  state.teamMemberAllPrice = _teamBuyings.teamMemberPrice
                }
                /**
                 * 先判断成团
                 * 再判断时间
                 *  teamStatus:'normal', //success 成团  fail 失败 ongoing  进行中 normal 正常的
                 */
                if (_teamBuyings.teamMemberCount === res.leader.joinMemberCount) {
                  // 已经成团
                  state.teamStatus = 'success'
                  let joinMemberCount = res.leader.joinMemberCount
                  if (state.joinMbrs.length < joinMemberCount) {
                    const tempGroupJoinMbrs = [].concat(state.joinMbrs)
                    if (joinMemberCount > 12) {
                      joinMemberCount = 12
                    }
                    for (let i = 0; i < joinMemberCount - state.joinMbrs.length; i++) {
                      tempGroupJoinMbrs.push({
                        avatar: state.imagesPath.userImg1,
                      })
                      console.log(i, state.joinMbrs.length)
                    }
                    console.log(tempGroupJoinMbrs)
                    state.joinMbrs = tempGroupJoinMbrs
                  }
                } else if (res.teamMemberCount < res.leader.joinMemberCount) {
                  state.teamStatus = 'success'
                  state.joinMemberCount = res.teamMemberCount
                } else {
                  const _data = new util.ResponseDate()
                  const nowDate = new util.ResponseDate().getTime()
                  let openTiem = 0
                  if (state.openTeamTime) {
                    openTiem = new Date(state.openTeamTime.replace(/-/g, '/')).getTime()
                  } else {
                    openTiem = nowDate
                    state.openTeamTime = util.formatTime(_data).replace(/\//g, '-')
                    console.log(state.openTeamTime)
                  }
                  const duration = (nowDate - openTiem) / 1000
                  if (duration >= state.duration) {
                    state.teamBuyEnd = true
                    state.teamStatus = 'fail'
                  } else {
                    if (state.teamBuyEnd === false) {
                      // 获取倒计时
                      const teamBuyTimeInfo = []
                      // 将活动的结束时间参数提成一个单独的数组，方便操作
                      const tempTime = {
                        openTeamTime: state.openTeamTime,
                        duration: state.duration,
                      }
                      teamBuyTimeInfo.push(tempTime)
                      state.teamBuyTimeList = teamBuyTimeInfo
                      countDown()
                      // 执行倒计时函数
                      function countDown() {
                        clearTimeout(state.groupTimeId)
                        state.countDownList = util.countDown(teamBuyTimeInfo)[0]
                        if (
                          state.countDownList.hou == '00' &&
                          state.countDownList.min == '00' &&
                          state.countDownList.sec == '00'
                        ) {
                          queryGoods(storeId)
                        } else {
                          const time = setTimeout(function () {
                            countDown(teamBuyTimeInfo)
                          }, 1000)
                          state.groupTimeId = time
                        }
                      }
                      // 生成拼团商品分享图
                      if (teamBuyings.sharePicture == null || teamBuyings.sharePicture == '') {
                        const groupNumber = util.numberConversion.numberToChinese(
                          teamBuyings.teamMemberCount,
                        )
                        const group = {
                          number: groupNumber,
                          soldCount: state.productDetails.soldCount,
                          price: teamBuyings.teamMemberPrice,
                          originalPrice: state.productDetails.sellPrice,
                          time: state.countDownList,
                          status: teamBuyings.status,
                        }
                        util
                          .createGroupSharePictures(teamBuyings.productPicture, group)
                          .then((picture) => {
                            if (groupSharePictures == null || groupSharePictures == '') {
                              state.sharePicture = picture.data
                            }
                          })
                          .catch((err) => {
                            console.log(err)
                          })
                      }
                    } else {
                    }
                  }
                }
              })
              .catch((err) => {
                console.log(err.message)
                state.groupActivity = false
                uni.showToast({
                  title: err.message,
                  icon: 'none',
                  duration: 2000,
                })
              })
          } else {
            state.groupActivity = false
            uni.showModal({
              title: '提示',
              content: '当前门店没有该商品的团购活动，可以看看别的拼团活动哦~',
              cancelText: '随便逛逛',
              success: function (res) {
                if (res.confirm) {
                  NAVPAGE.toFightGroup()
                } else if (res.cancel) {
                  NAVPAGE.toHome()
                }
              },
            })
          }
        } else {
          state.groupActivity = false
          uni.showModal({
            title: '提示',
            content: '当前门店没有该商品的团购活动，可以看看别的拼团活动哦~',
            cancelText: '随便逛逛',
            success: function (res) {
              if (res.confirm) {
                NAVPAGE.toFightGroup()
              } else if (res.cancel) {
                NAVPAGE.toHome()
              }
            },
          })
        }
      })
      .catch((err) => {
        console.log(err.message)
        state.groupActivity = false
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  }
}
function getDetails(storeId, productId) {
  const self = this
  productService
    .getDetails(storeId, productId)
    .then((res) => {
      let balance = res.balance
      // 拼团剩余库存
      if (
        teamBuyings &&
        teamBuyings != null &&
        (teamBuyings.productBalance || teamBuyings.productBalance === 0) &&
        teamBuyings.productBalance != null
      ) {
        balance = balance > teamBuyings.productBalance ? teamBuyings.productBalance : balance
      }
      // 判断当前商品是否统配商品
      state.goodsList = [res]
      state.balance = balance
      state.name = res.name
      state.description = res.description ? res.description : ''
      state.sellPrice = res.sellPrice
        ? (res.sellPrice * teamBuyings.teamMemberJoinCount).toFixed(2)
        : ''
      state.originalPrice = res.originalPrice
        ? (res.originalPrice * teamBuyings.teamMemberJoinCount).toFixed(2)
        : ''
      state.productDetails = res
      if (res.business === 'DISTRIBUTION') {
        // 查询统配门店当前商品库存，重置库存
        productService
          .getDetails(state.distributionStoreId, productId)
          .then((res) => {
            let balance = res.balance
            // 拼团剩余库存
            if (
              teamBuyings &&
              teamBuyings != null &&
              (teamBuyings.productBalance || teamBuyings.productBalance === 0) &&
              teamBuyings.productBalance != null
            ) {
              balance = balance > teamBuyings.productBalance ? teamBuyings.productBalance : balance
            }
            state.balance = balance
            state.isDistributionOrder = true
          })
          .catch((err) => {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000,
            })
          })
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function queryOrderStatus() {
  const that = this
  if (!state.orderId) return
  orderService
    .getOrderStatusById(state.orderId, true)
    .then((res) => {
      if (res && res.promotions && res.promotions.couponPromotions) {
        if (res.promotions.couponPromotions.length != 0) {
          const couponPromotions = []
          res.promotions.couponPromotions.forEach((el) => {
            couponPromotions.push(el.coupon.name)
          })
          state.couponPromotions = couponPromotions
          toggle('promotion')
        }
      }
    })
    .catch((err) => {
      console.log('查询订单状态失败')
      console.log(err)
    })
}
onLoad(function (_options) {
  const self = this
  if (app.globalData.userInfo) {
    state.hasUserInfo = true
  }
  state.themeColor =
    app.globalData && app.globalData.uiconfig ? app.globalData.uiconfig.themeColor : '#FC6700'
  if (_options.from && _options.from === 'orderPay') {
    state.navigationBarTitle = '支付成功'
    state.pageFrom = 'orderPay'
    state.orderId = _options.orderId
    let afterShareToDraw = false
    if (app.globalData.uiconfig && app.globalData.uiconfig.afterShareToDraw) {
      afterShareToDraw = app.globalData.uiconfig.afterShareToDraw
    }
    state.afterShareToDraw = afterShareToDraw
    queryOrderStatus()
  } else {
    state.teamBuyId = _options.teamBuyId
    state.teamLeaderRecordId = _options.teamLeaderRecordId
  }
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    // 统计PV
    state.storeId = app.globalData.storeInfo.id
    state.storeName = app.globalData.storeInfo.name
    state.stores = app.globalData.storeInfo
    ANALYSIS.PVStatistics(state.storeId)
    if (_options.from && _options.from === 'orderPay') {
      getOrderById(_options.orderId, app.globalData.storeInfo.id)
    } else {
      queryGoods(app.globalData.storeInfo.id)
    }
  } else {
    ADDRESS.getLocation()
      .then((res) => {
        app = getApp()
        app.globalData.storeInfo = res
        // 统计PV
        state.storeId = res.id
        state.storeName = res.name
        state.stores = res
        ANALYSIS.PVStatistics(res.id)
        if (_options.from && _options.from === 'orderPay') {
          console.log(res.id)
          getOrderById(_options.orderId, res.id)
        } else {
          queryGoods(res.id)
        }
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  }

  // 查询统配门店信息
  getDistributionStore()

  // 处理分享进入，显示返回首页按钮
  const pageStack = getCurrentPages()
  if (pageStack.length === 1) {
    state.homeBack = true
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures()
})
onReady(function () {})
onShow(function () {
  // 判断用户是否授权
  checkUserInfo()
})
onHide(function () {})
onUnload(function () {
  clearTimeout(state.groupTimeId)
})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function (res) {
  const that = this
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  let sharePictures = state.sharePictures
  const raffleSharePictures = state.raffleSharePictures
  if (state.sharePicture != null && state.sharePicture != '') {
    sharePictures = state.sharePicture
  } else if (state.productDetails.imageUrl) {
    sharePictures = state.productDetails.imageUrl
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    if (res.from === 'button') {
      if (res.target.dataset.sharetype === 'raffle') {
        // 来自页面内转发按钮
        // that.handleRaffleCash()
        if (raffleSharePictures !== '' && raffleSharePictures != null) {
          sharePictures = raffleSharePictures
        }
        // 未开启分享后抽奖进行兑奖操作
        if (
          !(
            state.afterShareToDraw &&
            res.target.dataset.type &&
            res.target.dataset.type === 'luckDraw'
          )
        ) {
          handleRaffleCash()
        } else {
          // 关闭弹窗
          state.show.luckDraw = false
          state.show.luckDrawPopup = false
        }
        return {
          title: '优惠券大抽奖',
          path:
            '/pages-sub/newretail/pages/mallModule/activity/luckDraw/luckDraw?raffleId=' +
            state.raffleId +
            '&activityId=' +
            state.raffleActivityId +
            '&type=order&raffleType=' +
            state.raffleType,
          imageUrl: sharePictures,
          success(e) {
            if (e.errMsg === 'shareAppMessage:ok') {
            }
          },
        }
      } else {
        return {
          title: '拼团有优惠',
          path:
            '/pages-sub/newretail/pages/mallModule/fightGroup/groupPurchase/groupPurchase?teamBuyId=' +
            state.teamBuyId +
            '&teamLeaderRecordId=' +
            state.teamLeaderRecordId +
            '&storeId=' +
            state.storeId,
          imageUrl: sharePictures,
          success(e) {
            uni.showShareMenu({
              withShareTicket: true,
            })
          },
        }
      }
    } else {
      const memberId = app.globalData.userInfo.member.id
      const pages = getCurrentPages() // 获取加载的页面
      const currentPage = pages[pages.length - 1] // 获取当前页面的对象
      const url = currentPage.route // 当前页面url
      const options = currentPage.options // 如果要获取url中所带的参数可以查看options
      let path = url + '?shareId=' + memberId
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          const ele = options[key]
          path = path + '&' + key + '=' + ele
        }
      }
      return {
        title: '拼团有优惠',
        path:
          '/pages-sub/newretail/pages/mallModule/fightGroup/groupPurchase/groupPurchase?teamBuyId=' +
          state.teamBuyId +
          '&teamLeaderRecordId=' +
          state.teamLeaderRecordId +
          '&storeId=' +
          state.storeId,
        imageUrl: sharePictures,
        success(e) {
          uni.showShareMenu({
            withShareTicket: true,
          })
        },
      }
    }
  } else {
    return {
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  }
})
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures
  }
  util
    .getSharePictures('RAFFLE_ACTIVITY')
    .then((res) => {
      state.raffleSharePictures = res
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function toHome() {
  NAVPAGE.toHome()
}
function toGoodsDetail(val) {
  console.log(val)
  state.onUnload = false
  const opts =
    '?productId=' + val.currentTarget.dataset.productid + '&type=' + val.currentTarget.dataset.type
  console.log(opts)
  NAVPAGE.toGoodsDetails(opts)
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false
  } else {
    return true
  }
}
function handleUserLogin() {
  const that = this
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo
    state.userInfo = {
      ...user.wxaUser,
    }
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
      state.isMember = true
    } else {
      // 不是会员跳转授权页
      state.userInfo = user.wxaUser
      state.hasUserInfo = true
      state.isMember = false
      NAVPAGE.toAuthorize()
    }
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.phone = true
  } else {
    state.phone = false
  }
}
function handleBindPhone(e) {
  if (e.detail.bindMobile === true) {
    handlePopupPhone()
  }
}
function toggleLuckDrawPopup(val) {
  const that = this
  const raffleInfo = state.raffleInfo
  const raffleInfoArr = raffleInfo ? Object.keys(raffleInfo) : 0
  if (val != null) {
    toggle('luckDraw')
  } else {
    if (raffleInfoArr.length == 0 && state.show.luckDraw && _data.hasUserDraw) {
      uni.showModal({
        title: '温馨提示',
        content:
          '系统正在处理您的抽奖结果，如果中奖，奖品稍后将发放到您的账户，您可以在（我的->我的优惠券）中查看。',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            toggle('luckDraw')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
      // 标记用户手动关闭了弹窗
      userCloseRaffle = true
    }
  }
}
function togglePopupLuckDraw(val) {
  toggle('luckDrawPopup')
}
function toggleMiddlePopup() {
  if (userCloseRaffle != null && userCloseRaffle === true) {
  } else {
    toggle('middle')
  }
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function getOrderById(orderId, storeId) {
  const self = this
  orderService
    .getDetailsById(orderId)
    .then((res) => {
      console.log(res)
      if (res) {
        state.teamBuyId = res.teamId ? res.teamId : ''
        state.teamLeaderRecordId = res.teamLeaderRecordId ? res.teamLeaderRecordId : ''
        const productIds = []
        res.products.forEach((item) => {
          productIds.push({
            productId: item.productId,
            buyAmount: item.productNum,
          })
        })
        state.productIds = productIds
      }
      queryGoods(storeId)
      return raffleService.getByType('ORDER_RAFFLE')
    })
    .then((res) => {
      if (res) {
        state.raffleActivityId = res.id
        state.raffleType = res.raffleType
        const data = res
        if (app.globalData.userInfo && app.globalData.userInfo.member) {
          const postData = {
            orderId: state.orderId,
            activityId: res.id,
            wxaOpenid: app.globalData.userInfo.wxaUser.openId,
          }
          raffleService
            .create(postData)
            .then((res) => {
              state.raffleId = res
              if (data.raffleType === 'LHJ') {
                toggleLuckDrawPopup(true)
              } else if (data.raffleType === 'POPUP_WINDOWS') {
                // 弹窗抽奖
                state.popupWindowImage = data.popupWindowImage
                togglePopupLuckDraw()
              }
            })
            .catch((err) => {
              console.log('创建分享抽奖id报错：', err.message)
            })
        }
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 200000,
      })
    })
}
function toIndex() {
  NAVPAGE.toHome()
}
function getUserClickDraw(e) {
  const self = this
  if (e.detail.userDraw) {
    _data.hasUserDraw = true
    // 用户已经点击抽奖
    util.setHideLoading(true)
    if (!state.isActive) {
      // 新抽奖规则直接抽奖，调用抽奖接口后创建抽奖活动获得抽奖id用于分享
      state.isActive = true
      handleDraw(state.raffleActivityId)
      // 调用接口创建抽奖获取抽奖id
      const postData = {
        orderId: state.orderId,
        activityId: state.raffleActivityId,
        wxaOpenid: app.globalData.userInfo.wxaUser.openId,
      }
      if (app.globalData.userInfo) {
        createRaffle(postData)
      } else {
        // 授权操作在抽奖组件中完成
      }
      function createRaffle(postData) {
        raffleService
          .create(postData)
          .then((res) => {
            state.raffleId = res
          })
          .catch((err) => {
            util.setHideLoading(false)
            state.hasRaffleCoupon = false
            state.raffleResult = 'FALSE'
            state.isActive = false
            setTimeout(() => {
              toggleLuckDrawPopup(true)
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000,
              })
              state.raffleResult = 'UNSTART'
            }, 2400)
          })
      }
    } else {
      uni.showToast({
        title: '您已经在抽奖了~',
        icon: 'none',
      })
    }
  }
}
function handleDraw(raffleActivityId) {
  const self = this
  const postData = {
    orderId: options.orderId,
    raffleActivityId,
    wxaOpenid: app.globalData.userInfo.wxaUser.openId,
  }
  state.raffleActivityId = raffleActivityId
  raffleService
    .draw(postData)
    .then((res) => {
      util.setHideLoading(false)
      let raffleInfo = null
      let hasCoupon = true
      if (res.rafflePrizeName == '未中奖') {
        hasCoupon = false
      } else {
        raffleInfo = res
        hasCoupon = true
      }
      setTimeout(() => {
        state.raffleInfo = raffleInfo
        state.hasRaffleCoupon = hasCoupon
        state.raffleResult = 'TRUE'
        state.isActive = false
        toggleLuckDrawPopup(true)
        toggleMiddlePopup()
      }, 2400)
    })
    .catch((err) => {
      util.setHideLoading(false)
      state.hasRaffleCoupon = false
      state.raffleResult = 'FALSE'
      state.isActive = false
      if (err.code === 41011) {
        toggleLuckDrawPopup(true)
        setTimeout(() => {
          uni.showToast({
            title: '您今天的抽奖次数已超过上限，明天再来吧~',
            icon: 'none',
            duration: 2000,
          })
        }, 500)
      } else if (err.code === 41005 || err.code === 41007 || err.code === 41003) {
        // 活动过期
        state.activeState = 'end'
        setTimeout(() => {
          toggleLuckDrawPopup(true)
          toggleMiddlePopup()
        }, 2400)
      } else if (err.code === 41004 || err.code === 41010) {
        /**
         * 报错原因是券数量不足
         * 弹窗应该是您来晚了奖品已被抽光了！
         */
        setTimeout(() => {
          toggleLuckDrawPopup(true)
          toggleMiddlePopup()
        }, 2400)
      } else if (err.code === 41014) {
        setTimeout(() => {
          uni.showToast({
            title: '您今天已经抽过了，不要贪心哦~',
            icon: 'none',
            duration: 2000,
          })
          toggleLuckDrawPopup(true)
        }, 2400)
      } else {
        // 其他报错需要查询具体原因
        setTimeout(() => {
          uni.showToast({
            title: '抽奖人数过多，请稍后再试哦~',
            icon: 'none',
            duration: 2000,
          })
          toggleLuckDrawPopup(true)
        }, 2400)
      }
      setTimeout(() => {
        state.raffleResult = 'UNSTART'
      }, 2400)
    })
}
function handlePopupDraw() {
  const self = this
  // 用户已经点击抽奖
  util.setHideLoading(true)
  let isDraw = false
  const postData = {
    orderId: state.orderId,
    activityId: state.raffleActivityId,
    wxaOpenid: app.globalData.userInfo.wxaUser.openId,
  }
  if (app.globalData.userInfo) {
    createRaffle(postData)
  } else {
    NAVPAGE.toAuthorize()
  }
  function createRaffle(postData) {
    raffleService
      .create(postData)
      .then((res) => {
        state.raffleId = res
        if (!state.afterShareToDraw) {
          // 如果分享后抽奖为false,直接抽奖抽奖
          isDraw = true
          const postData = {
            orderId: options.orderId,
            raffleActivityId: state.raffleActivityId,
            wxaOpenid: app.globalData.userInfo.wxaUser.openId,
          }
          return raffleService.draw(postData)
        }
      })
      .then((res) => {
        if (!state.afterShareToDraw) {
          // 处理抽奖逻辑
          util.setHideLoading(false)
          let raffleInfo = null
          let hasCoupon = true
          if (res.rafflePrizeName == '未中奖') {
            hasCoupon = false
          } else {
            raffleInfo = res
            hasCoupon = true
          }
          state.raffleInfo = raffleInfo
          state.hasRaffleCoupon = hasCoupon
          state.isActive = false
          togglePopupLuckDraw()
          toggleMiddlePopup()
        }
      })
      .catch((err) => {
        util.setHideLoading(false)
        if (isDraw) {
          // 处理抽奖的报错
          state.hasRaffleCoupon = false
          state.isActive = false
          if (err.code === 41011) {
            togglePopupLuckDraw()
            setTimeout(() => {
              uni.showToast({
                title: '您今天的抽奖次数已超过上限，明天再来吧~',
                icon: 'none',
                duration: 2000,
              })
            }, 500)
          } else if (err.code === 41005 || err.code === 41007 || err.code === 41003) {
            // 活动过期
            state.activeState = 'end'
            togglePopupLuckDraw()
            toggleMiddlePopup()
          } else if (err.code === 41004 || err.code === 41010) {
            /**
             * 报错原因是券数量不足
             * 弹窗应该是您来晚了奖品已被抽光了！
             */
            togglePopupLuckDraw()
            toggleMiddlePopup()
          } else if (err.code === 41014) {
            uni.showToast({
              title: '您今天已经抽过了，不要贪心哦~',
              icon: 'none',
              duration: 2000,
            })
            togglePopupLuckDraw()
          } else {
            // 其他报错需要查询具体原因
            uni.showToast({
              title: '抽奖人数过多，请稍后再试哦~',
              icon: 'none',
              duration: 2000,
            })
            togglePopupLuckDraw()
          }
        } else {
          // 处理创建分享抽奖的报错
          togglePopupLuckDraw()
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
        }
      })
  }
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true
    if (app.globalData.userInfo.member) {
      state.isMember = true
    }
  } else {
    state.hasUserInfo = false
    state.isMember = false
    state.member = null
    state.userInfo = null
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e)
    .then((res) => {
      state.hasUserInfo = true
      if (res.member) {
        state.isMember = true
        if (teamBuyings.type === 'SPEC') {
          getTeamGoodsSpec(teamBuyings.id, teamBuyings.productId, queryStoreId)
        }
      } else {
        NAVPAGE.toAuthorize()
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function getDistributionStore() {
  const self = this
  if (util.isDeliveryProduct()) {
    // 查询统配门店信息
    if (app.globalData.distributionStore) {
      const stores = app.globalData.distributionStore
      state.distributionStoreId = stores.id
      state.distributionStoreName = stores.name
    } else {
      storeService
        .getDistributionStore()
        .then((res) => {
          if (res) {
            app.globalData.distributionStore = res
            const distributionStore = res
            state.distributionStoreId = res.id
            state.distributionStoreName = res.name
            try {
              uni.setStorageSync('wj_distributionStore', distributionStore)
            } catch (e) {
              console.log(e)
            }
          }
        })
        .catch((e) => {
          console.log(e.message)
        })
    }
  }
}
function toAuthorize(e) {
  NAVPAGE.toAuthorize()
}
function getTeamGoodsSpec(activityId, productId, storeId) {
  const self = this
  teamBuyService
    .getChildrenProduct(activityId)
    .then((res) => {
      teamChildrenProduct = res
      return teamBuyService.getSpecDetails(activityId, productId, storeId)
    })
    .then((res) => {
      if (res) {
        const specDetails = JSON.parse(res.specDetailsJson)
        console.log(specDetails)
        state.specs = res.specs
        state.specDetails = specDetails
      }
    })
    .catch((err) => {
      console.log('查询商品规格：' + err.message)
    })
}
function confirmSpecs(e) {
  console.log(e)
  const self = this
  specs = e.detail
  // 关闭弹窗
  toggleGoodsSpecPopup()
  let name = state.goodsList[0].name
  if (teamChildrenProduct.length > 0) {
    teamChildrenProduct.forEach((it) => {
      if (it.productId === e.detail.productId) {
        name = it.name
      }
    })
  }
  // 根据参团或者开团调用不同接口
  teamBuyings.teamMemberJoinCount = e.detail.teamMemberJoinCount
  teamBuyings.teamLeaderPrice = e.detail.teamLeaderPrice
  teamBuyings.teamMemberPrice = e.detail.teamMemberPrice
  // 子商品的库存
  let balance = e.detail.balance
  if (
    (e.detail.productBalance || e.detail.productBalance === 0) &&
    e.detail.productBalance != null
  ) {
    balance = balance > e.detail.productBalance ? e.detail.productBalance : balance
  }
  let teamLeaderPrice = e.detail.teamLeaderPrice
    ? e.detail.teamLeaderPrice
    : e.detail.teamMemberPrice
  let teamMemberPrice = e.detail.teamMemberPrice
  teamLeaderPrice = parseFloat((teamLeaderPrice * e.detail.teamMemberJoinCount).toFixed(2))
  teamMemberPrice = parseFloat((teamMemberPrice * e.detail.teamMemberJoinCount).toFixed(2))
  // 参团
  state.goodsList[0].name = name
  state.goodsList[0].id = e.detail.productId
  state.productNum = e.detail.teamMemberJoinCount
  state.groupBalance = balance
  state.teamAllPrice = teamLeaderPrice
  state.teamLeaderPrice = teamLeaderPrice
  state.teamMemberPrice = teamMemberPrice
  joinGroup(e)
}
function openTeamBuySpecs(e) {
  const type = e.currentTarget.dataset.type
  const that = this
  // 查询订阅消息
  // if (app.globalData.templateIdsQuery) {
  //   handleSubscribeMessage()
  // } else {
  //   subscribeMessage.getTemplateIds().then(res => {
  //     handleSubscribeMessage()
  //   }).catch(err => {
  //     handleJoinGroup()
  //     console.log(err.message);
  //     log.warn("查询模板id报错：", err.message);
  //   })
  // }

  handleJoinGroup()
  function handleSubscribeMessage() {
    let templateIds = []
    templateIds = subscribeMessage.handleTemplateIds(subscribeMessage.scene.GROUP_ORDER)
    console.log(templateIds)
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res)
            subscribeMessage.addSubscribe(subscribeMessage.scene.GROUP_ORDER, res)
            log.info(res)
            handleJoinGroup()
          },
          fail(err) {
            console.log(err)
            log.warn(err)
            handleJoinGroup()
          },
        })
      } else {
        log.warn('api wx.requestSubscribeMessage 当前版本不支持')
        handleJoinGroup()
      }
    } else {
      log.info('模板id未获取到')
      handleJoinGroup()
    }
  }
  function handleJoinGroup() {
    if (state.specs.length > 0) {
      if (state.balance > 0) {
        state.goodsImg = state.goodsList[0].productPictures[0].url
        state.hasTeamLeader = type === 'leader'
        toggleTeamGoodsSpecPopup()
      } else {
        uni.showToast({
          title: '门店正在补货中，看看其他商品吧~',
          icon: 'none',
          duration: 2000,
        })
      }
    } else {
      if (teamBuyings.type !== 'SPEC') {
        if (type === 'leader') {
          toPayTeamBuying(e)
        } else {
          joinGroup(e)
        }
      }
    }
  }
}
function toggleGoodsSpecPopup() {
  toggle('goodsSpec')
}
function toggleTeamGoodsSpecPopup() {
  toggle('goodsSpec')
}
function togglePromotionPopup() {
  toggle('promotion')
}
function foundPromotion() {
  NAVPAGE.toMyCoupon()
}
function subscriptionMessagePopup(val) {
  // 查询订阅消息
  if (app.globalData.templateIdsQuery) {
    handleSubscribeMessage()
  } else {
    subscribeMessage
      .getTemplateIds()
      .then((res) => {
        handleSubscribeMessage()
      })
      .catch((err) => {
        console.log(err.message)
        log.warn('查询模板id报错：', err.message)
      })
  }
  function handleSubscribeMessage() {
    let templateIds = []
    templateIds = subscribeMessage.handleTemplateIds(subscribeMessage.scene.GROUP_ORDER)
    console.log(templateIds)
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res)
            log.info(res)
            subscribeMessage.addSubscribe(subscribeMessage.scene.GROUP_ORDER, res)
          },
          fail(err) {
            console.log(err)
            log.warn(err)
          },
        })
      } else {
        log.warn('api wx.requestSubscribeMessage 当前版本不支持')
      }
    } else {
      log.info('模板id未获取到')
    }
  }
}
</script>
<style scoped>
/* pages/groupPurchase/groupPurchase.wxss */

page {
  background-color: #f3f4f6;
  height: 100%;
}

.group-purchase-box {
  background: #fff;
  padding-bottom: 40rpx;
  margin-bottom: 20rpx;
}

.group-goods-item {
  min-height: 200rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 40rpx 20rpx;
  overflow: hidden;
  background: #fff;
}

.group-goods-img-box {
  width: 200rpx;
  height: 200rpx;
  overflow: hidden;
  float: left;
  position: relative;
}

.group-goods-img-box image {
  width: 100%;
  height: 100%;
}

.group-goods-info {
  width: calc(100% - 244rpx);
  height: 100%;
  position: relative;
  float: right;
}

.group-goods-info .goods-name,
.group-goods-info .goods-desc {
  display: block;
  width: 100%;
}

.group-goods-info .goods-name {
  color: #333;
  font-size: 40rpx;
  line-height: 48rpx;
  padding: 0;
}

.group-goods-info .goods-desc {
  color: #999;
  font-size: 30rpx;
  line-height: 38rpx;
  margin-bottom: 5rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.group-goods-info .group-number {
  height: 38rpx;
  margin-bottom: 20rpx;
  font-size: 30rpx;
  line-height: 38rpx;
  color: #999;
  display: block;
}

.group-goods-info .goods-price {
  color: #f33;
  font-size: 30rpx;
}

.group-goods-info .goods-price .nowPrice {
  font-size: 36rpx;
  font-weight: bold;
  margin-right: 16rpx;
}

.group-goods-info .goods-price .oldPrice {
  color: #999;
  text-decoration: line-through;
}

.group-people-list {
  padding: 30rpx 28rpx;
  /* height: 105rpx; */
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow: hidden;
}

.people-item {
  margin: 10rpx 16rpx;
  width: 101rpx;
  height: 101rpx;
  border-radius: 50%;
  border: 2rpx dashed #adadad;
  position: relative;
  display: flex;
  float: left;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
}

.group-people-list .leader {
  border: 2rpx solid #ff6b09;
}

.people-item .leader-label {
  position: absolute;
  left: 10rpx;
  top: 82rpx;
  z-index: 1;
}

.people-item image {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
}

.people-item text {
  font-size: 28rpx;
  line-height: 101rpx;
  color: #999;
}

.people-more {
  margin: 10rpx 16rpx;
  width: 101rpx;
  height: 101rpx;
  border-radius: 50%;
  position: relative;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.people-more image {
  width: 101rpx;
  height: 101rpx;
}

.leader .leader-label {
  width: 80rpx;
  height: 32rpx;
  border-radius: 12rpx;
  background-color: #ff6902;
  font-size: 24rpx;
  line-height: 32rpx;
  color: #fff;
  display: block;
  text-align: center;
}

.group-tips {
  font-size: 32rpx;
  height: 72rpx;
  line-height: 72rpx;
  width: 100%;
  display: block;
  text-align: center;
}

.join-group {
  border-radius: 8rpx;
  border: none;
  color: #fff;
  width: 570rpx;
  height: 80rpx;
  font-size: 36rpx;
  line-height: 80rpx;
}

.join-group::after {
  border: none;
}

.share-group {
  background: #ffbe00;
  border-radius: 8rpx;
  border: none;
  color: #fff;
  width: 570rpx;
  height: 80rpx;
  font-size: 36rpx;
  line-height: 80rpx;
}

.share-group::after {
  border: none;
}

.usable {
  background-color: #ffbe00;
}

.unavailable {
  background-color: #cbcbcb;
}

.group-share-text {
  font-size: 26rpx;
  color: #454545;
  line-height: 36rpx;
  margin: 15rpx 0 0 0;
  text-align: center;
  width: 100%;
}

.blank-box {
  width: 100%;
  background: #f4f5f9;
}

.goods-name {
  font-size: 30rpx;
  line-height: 48rpx;
  color: #333333;
  padding: 0 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.goods-price {
  font-size: 20rpx;
  color: #494949;
  line-height: 44rpx;
  margin-left: 16rpx;
  margin-top: 11rpx;
}

.sell-price {
  font-size: 27rpx;
  color: #f98f68;
  margin-right: 7rpx;
}

.old-price {
  font-size: 20rpx;
  text-decoration: line-through;
}

.button-box {
  width: 120rpx;
  height: 44rpx;
  background: #009f55;
  box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 159, 85, 0.2);
  border-radius: 4rpx;
  font-size: 24rpx;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  line-height: 44rpx;
  position: absolute;
  bottom: 12rpx;
  right: 21rpx;
}

.page-content {
  height: 100%;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

movable-area {
  height: 100%;
  width: 100%;
  position: relative;
  overflow-x: hidden;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
}

movable-view {
  width: 120rpx;
  height: 120rpx;
}

/* 抽奖弹窗 */
.popup-box {
  width: 562rpx;
  min-height: 504rpx;
  background: #ffffff;
  border-radius: 10rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.popup-close {
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  right: 19rpx;
  top: 19rpx;
}

.popup-close image {
  width: 22rpx;
  height: 22rpx;
}

.popup-title {
  color: #1c1c1c;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 60rpx;
  margin-top: 44rpx;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 59rpx 0;
}

.popup-content text {
  display: block;
}

.popup-text {
  color: #009f55;
  font-size: 44rpx;
  line-height: 68rpx;
  font-weight: 500;
  text-align: center;
  width: 374rpx;
}

.popup-text-end {
  color: #009f55;
  font-size: 44rpx;
  line-height: 56rpx;
  font-weight: bold;
  text-align: center;
  width: 374rpx;
}

.popup-tips {
  color: #1c1c1c;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 54rpx;
}

.popup-button {
  padding-bottom: 52rpx;
  text-align: center;
}

.popup-button text {
  font-size: 30rpx;
  line-height: 50rpx;
  color: #999999;
  margin-bottom: 10rpx;
  display: block;
}

.share-btn {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 400;
  text-align: center;
  width: 369rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: #009f55;
  border-radius: 10rpx;
  padding: 0;
}

.popup-luckdraw-box {
  padding-bottom: 20rpx;
  position: relative;
}

.popup-luckdraw-close {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  right: 66rpx;
  top: 80rpx;
}

.popup-luckdraw-close image {
  width: 40rpx;
  height: 40rpx;
}

.group-share-img-box {
  position: absolute;
  top: 30%;
  left: 120%;
  width: 992rpx;
  height: 804rpx;
}

.group-share-img-box canvas {
  width: 100%;
  height: 100%;
}

.popup-luckdraw-window-box {
  padding-bottom: 20rpx;
  position: relative;
}

.popup-luckdraw-window-close {
  margin-top: 65rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-luckdraw-window-close image {
  width: 56rpx;
  height: 56rpx;
}

.popup-window-image {
  width: 570rpx;
  max-height: 700rpx;
}

.popup-window-image button {
  background: transparent;
  border: 0;
}

.popup-window-image button::after {
  border: 0;
}

.popup-window-image image {
  width: 100%;
  height: 100%;
}
</style>
