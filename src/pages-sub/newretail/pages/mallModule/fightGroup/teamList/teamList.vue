<template>
  <!--pages/teamList/teamList.wxml-->

  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view class="content">
    <view v-for="(item, index) in state.teamBuyList" :key="index">
      <!--<template is="teamItem" :data="item"></template>-->
    </view>
    <view class="bottom-tips" v-if="state.teamBuyList.length > 9">
      仅显示10个正在进行中的拼团哦~
    </view>
    <view class="no-data" :hidden="state.teamBuyList.length > 0">
      暂无进行中的拼团，赶快开团吧~
    </view>
  </view>
  <view class="modal-box" :hidden="!groupModal" data-type="group" @click="clickBlank">
    <view class="modal-body" @click.stop="clickBody">
      <view class="modal-content join-group">
        <view class="title">一起参与拼团</view>
        <view class="group-info">
          <view>
            仅剩余
            <text :style="'color: ' + state.themeColor">
              {{ groupInfo.teamMemberCount - groupInfo.joinMemberCount }}
            </text>
            个参团名额可用,赶紧来参团吧!
          </view>
          <view>
            <image :src="state.imagesPath.iconSecKilling"></image>
            火热拼团ing
            <text>{{ countDownTime.hou }}:{{ countDownTime.min }}:{{ countDownTime.sec }}</text>
            后结束。
          </view>
        </view>
        <view class="group-people-list">
          <view v-if="groupInfo.teamBuyingType !== 'THOUSAND'">
            <view
              class="people-item leader"
              :style="'border: 3rpx solid ' + state.themeColor + ';'"
              v-for="(item, idx) in groupInfo.joinMbrs"
              :key="idx"
              v-if="idx == 0"
              :hidden="groupInfo.joinPeopleCount == 0"
            >
              <image :src="item.avatar"></image>
            </view>
          </view>
          <view v-if="groupInfo.teamBuyingType === 'THOUSAND'">
            <view
              class="people-item"
              v-for="(item, index) in groupInfo.joinMbrs"
              :key="index"
              v-if="groupInfo.teamPeopleCount > 10 ? index < 9 : index < groupInfo.teamPeopleCount"
            >
              <image :src="item.avatar"></image>
            </view>
            <view
              class="people-item"
              v-for="(item, index) in groupInfo.teamPeopleCount - groupInfo.joinPeopleCount"
              v-if="
                groupInfo.teamPeopleCount > 10
                  ? index < 9 - groupInfo.joinPeopleCount
                  : groupInfo.teamPeopleCount - groupInfo.joinPeopleCount
              "
              :key="index"
            >
              <text>?</text>
            </view>
          </view>
          <view v-if="groupInfo.teamBuyingType !== 'THOUSAND'">
            <view
              class="people-item"
              v-for="(item, index) in groupInfo.joinMbrs"
              :key="index"
              v-if="groupInfo.teamPeopleCount > 10 ? index < 8 : index < groupInfo.teamPeopleCount"
              :hidden="index == 0"
            >
              <image :src="item.avatar"></image>
            </view>
            <view
              class="people-item"
              v-for="(item, index) in groupInfo.teamPeopleCount - groupInfo.joinPeopleCount"
              v-if="
                groupInfo.teamPeopleCount > 10
                  ? index < 9 - groupInfo.joinPeopleCount
                  : groupInfo.teamPeopleCount - groupInfo.joinPeopleCount
              "
              :key="index"
            >
              <text>?</text>
            </view>
          </view>
          <view class="people-more" v-if="groupInfo.teamMemberCount > 10" :key="index">
            <image :src="state.imagesPath.iconCollageMore"></image>
          </view>
        </view>
        <button
          v-if="!state.hasUserInfo"
          class="button-box"
          :style="'background: ' + state.themeColor"
          @click="getUserInfo"
        >
          确认拼团
        </button>
        <button
          v-else-if="!isMember"
          class="button-box"
          :style="'background: ' + state.themeColor"
          @click="toAuthorize"
        >
          确认拼团
        </button>
        <button
          v-else
          class="button-box"
          :style="'background: ' + state.themeColor"
          data-type="member"
          @click="openTeamBuySpecs"
        >
          确认拼团
        </button>
      </view>
    </view>
  </view>
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
      :price="sellPrice"
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
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiTeamBuyServiceJs from '@/service/api/newretail/teamBuyService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/teamList/teamList.js
const teamBuyService = _apiTeamBuyServiceJs
const productService = _apiProductServiceJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs
const log = _utilsLogJs
const subscribeMessage = _utilsSubscribeMessageJs

// 获取应用实例
const state = reactive({
  shipmentType: '',
  // 拼团配送方式
  navigationBarTitle: '正在开团',
  imagesPath: IMGAGESPATH,
  teamBuyList: [],
  countDownList: [],
  teamBuyTimeList: [],
  groupTimeId: 0,
  balance: 0,
  timeId: 0,
  storeId: '',
  phone: false,
  hasUserInfo: false,
  show: {
    middle: false,
    luckDraw: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    goodsSpec: false,
  },
  specs: [],
  specDetails: [],
  hasTeamLeader: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
})
function clickBlank(val) {
  if (val.currentTarget.dataset.type === 'goods') {
    state.modal = false
  } else if (val.currentTarget.dataset.type === 'group') {
    state.groupModal = false
  }
}
function clickBody() {}
function openTeamBuyModal(val) {
  const self = this
  const _teamBuyings = teamBuyings
  const teamBuyId = val.currentTarget.dataset.teambuyid
  const teamLeaderRecordId = val.currentTarget.dataset.teamleaderrecordid
  if (state.balance > 0) {
    teamBuyService.getRecordsByLeaderId(teamLeaderRecordId).then((res) => {
      let tempData = {
        teamLeaderRecordId: res.leader.id,
        // 团长记录id
        teamLeaderPrice: _teamBuyings.teamLeaderPrice
          ? _teamBuyings.teamLeaderPrice
          : _teamBuyings.teamMemberPrice,
        joinMemberCount: res.leader.joinMemberCount,
        teamMemberCount: _teamBuyings.teamMemberCount,
        joinPeopleCount: res.leader.joinMemberCount > 12 ? 12 : res.leader.joinMemberCount,
        teamPeopleCount: _teamBuyings.teamMemberCount > 12 ? 12 : _teamBuyings.teamMemberCount,
        leaderImageUrl: state.imagesPath.userImg1,
        teamMemberImageUrl: state.imagesPath.userImg1,
        openTeamTime: res.leader.startTime ? res.leader.startTime : res.leader.createTime,
        duration: _teamBuyings.duration,
        teamBuyingType: _teamBuyings.teamBuyingType,
        teamBuyEnd: false,
      }
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
        if (res.leader.joinMemberCount === 1) {
          const tempItem = {
            avatar: res.leader.avatar ? res.leader.avatar : state.imagesPath.userImg1,
          }
          tempJoinMbrs.push(tempItem)
        }
      }
      tempData = {
        ...tempData,
        joinMbrs: tempJoinMbrs,
      }
      state.groupInfo = tempData
      const _data = new util.ResponseDate()
      const nowDate = new util.ResponseDate().getTime()
      let openTime = 0
      if (state.groupInfo.openTeamTime) {
        openTime = new Date(state.groupInfo.openTeamTime.replace(/-/g, '/')).getTime()
      } else {
        openTime = nowDate
        state.openTeamTime = util.formatTime(_data).replace(/\//g, '-')
      }
      const duration = (nowDate - openTime) / 1000
      if (duration >= state.groupInfo.duration) {
        const newTempData = {
          ...tempData,
          teamBuyEnd: true,
        }
        state.groupInfo = newTempData
      }
      if (state.groupInfo.teamBuyEnd === false) {
        // 获取倒计时
        const teamBuyTimeInfo = []
        // 将活动的结束时间参数提成一个单独的数组，方便操作
        const tempTime = {
          openTeamTime: state.groupInfo.openTeamTime,
          duration: state.groupInfo.duration,
        }
        teamBuyTimeInfo.push(tempTime)
        // clearTimeout(self.data.groupTimeId)
        state.teamBuyTimeList = teamBuyTimeInfo
        countDown()
        // 执行倒计时函数
        function countDown() {
          clearTimeout(state.groupTimeId)
          // console.log(self.data.countDownTime)
          state.countDownTime = util.countDown(teamBuyTimeInfo)[0]
          if (
            state.countDownTime.hou == '00' &&
            state.countDownTime.min == '00' &&
            state.countDownTime.sec == '00'
          ) {
            const newData = {
              ...tempData,
              teamBuyEnd: true,
            }
            state.groupInfo = newData
          }
          const time = setTimeout(function () {
            countDown(teamBuyTimeInfo)
          }, 1000)
          state.groupTimeId = time
        }
      } else {
      }
    })
    state.groupModal = true
  } else {
    uni.showToast({
      title: '门店正在补货中，去看看别的吧~',
      icon: 'none',
    })
  }
}
function joinGroup(e) {
  const self = this
  const loginStatus = checkAuth()
  if (loginStatus) {
    let goodsList = []
    goodsList = [].concat(state.goodsList)
    const teamBuy = {
      allPrice: (teamBuyings.teamMemberPrice * teamBuyings.teamMemberJoinCount).toFixed(2),
      storeId: state.storeId,
      storeName: state.storeName,
      goodsList: [],
      teamBuyId: teamBuyings.id,
      teamLeaderRecordId: state.groupInfo.teamLeaderRecordId,
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
      shipmentType: state.shipmentType,
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
      console.log(item)
      teamBuy.goodsList.push(item)
    })
    console.log(teamBuy)
    uni.setStorageSync('wj_shopcart', teamBuy)
    if (state.teamMemberCount - state.joinMemberCount == 0) {
    } else {
      if (app.globalData.userInfo.member) {
        NAVPAGE.toPerfectOrder()
      } else {
        NAVPAGE.toAuthorize()
      }
    }
  } else {
  }
}
function checkAuthStatus() {
  if (!app.globalData.userInfo) {
    return false
  } else {
    return true
  }
}
function checkAuth() {
  const self = this
  if (!app.globalData.userInfo) {
    uni.showModal({
      title: '提示',
      content: '请同意授权获取用户信息',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          try {
            // 缓存页面参数信息，跳转授权页面
            let pageUrl =
              '../../goods/goodsDetail/goodsDetail?productId=' +
              options.productId +
              '&type=' +
              options.type
            if (options.activityId) {
              pageUrl =
                pageUrl +
                '&goodsList=' +
                options.goodsList +
                '&timeData=' +
                options.timeData +
                '&activityId=' +
                options.activityId
            }
            if (options.shareId) {
              pageUrl = pageUrl + '&shareId=' + options.shareId
            }
            uni.setStorageSync('wj_pageUrl', pageUrl)
          } catch (e) {
            console.log(e.message)
          }
          NAVPAGE.toMy()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
    return false
  } else {
    return true
  }
}
onLoad(function (_options) {
  const self = this
  console.log(_options)
  if (_options.storeId && _options.goodsId && _options.teamBuyId && _options.balance) {
    state.storeId = _options.storeId
    state.balance = parseFloat(_options.balance)
    getDetails(_options.storeId, _options.goodsId)
    teamBuyService
      .getById(_options.teamBuyId)
      .then((res) => {
        if (res) {
          teamBuyings = {}
          teamBuyings = {
            ...res,
            teamMemberJoinCount: res.teamMemberJoinCount ? res.teamMemberJoinCount : 1,
            selfAfterDay: res.selfAfterDay || res.selfAfterDay === 0 ? res.selfAfterDay : null,
          }
          let balance = parseFloat(_options.balance)
          if (
            teamBuyings &&
            teamBuyings != null &&
            (teamBuyings.productBalance || teamBuyings.productBalance === 0) &&
            teamBuyings.productBalance != null
          ) {
            balance = balance > teamBuyings.productBalance ? teamBuyings.productBalance : balance
          }
          state.balance = balance
          state.shipmentType = res.shipmentType
          getOpenTeamBuyingList(_options.teamBuyId)
          if (res.type === 'SPEC') {
            getTeamGoodsSpec(res.id, res.productId, _options.storeId)
          }
        }
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  } else if (app.globalData.storeInfo.id) {
    state.storeId = app.globalData.storeInfo.id
  }
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures()
  // 统计PV
  if (state.storeId) {
    ANALYSIS.PVStatistics(state.storeId)
  }
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
onShareAppMessage(function () {
  const that = this
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  const sharePictures = state.sharePictures
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id
    return {
      title: '',
      path:
        '/pages-sub/newretail/pages/mallModule/fightGroup/teamList/teamList?shareId=' +
        memberId +
        '&storeId=' +
        state.storeId,
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  } else {
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/fightGroup/teamList/teamList?storeId=' + state.storeId,
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
}
function hideTel(tel) {
  const reg = /^(\d{3})\d{4}(\d{4})$/
  tel = tel.replace(reg, '$1****$2')
  return tel
}
function handleToTeamBuying(val) {
  const teamBuyId = val.target.dataset.teambuyid
  const teamLeaderRecordId = val.target.dataset.teamleaderrecordid
  const opts = '?teamBuyId=' + teamBuyId + '&teamLeaderRecordId=' + teamLeaderRecordId
  NAVPAGE.toGroupPurchase(opts)
}
function handleUserLogin() {
  const self = this
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo
    state.userInfo = {
      ...user.wxaUser,
    }
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
    } else {
      state.userInfo = user.wxaUser
      state.hasUserInfo = true
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
function getOpenTeamBuyingList(teamBuyId) {
  const self = this
  teamBuyService
    .getTenByTeamId(teamBuyId)
    .then((res) => {
      const _teamBuyings2 = teamBuyings
      if (res != '') {
        const tempList = []
        res.forEach((item) => {
          let tempItem = {
            teamBuyId: _teamBuyings2.id,
            teamLeaderRecordId: item.id,
            // 创建人ID
            mobile: hideTel(item.mobile),
            openTeamTime: item.startTime ? item.startTime : item.createTime,
            // 开团时间
            duration: _teamBuyings2.duration,
            // 持续时间
            joinMemberCount: item.joinMemberCount,
            // 参加人数
            teamLeaderPrice: _teamBuyings2.teamLeaderPrice,
            // 团长价格
            teamMemberCount: _teamBuyings2.teamMemberCount,
            // 团购人数限定
            overplusJoinCount: _teamBuyings2.teamMemberCount - item.joinMemberCount,
            // 剩余参加人数
            teamMemberJoinCount: _teamBuyings2.teamMemberJoinCount
              ? _teamBuyings2.teamMemberJoinCount
              : 1,
            // 每人活动单品购买数量限制
            teamMemberPrice: _teamBuyings2.teamMemberPrice, // 团员价格
          }
          if (item.mobile != '匿名') {
            tempItem = {
              ...tempItem,
              headPortrait: item.avatar ? item.avatar : state.imagesPath.userImg1,
            }
          } else {
            tempItem = {
              ...tempItem,
              headPortrait: state.imagesPath.userImg1,
            }
          }
          tempList.push(tempItem)
        })
        let newArr = []
        const newTempTeamList = []
        function compare(property) {
          return function (a, b) {
            const value1 = a[property]
            const value2 = b[property]
            return value1 - value2
          }
        }
        newArr = [].concat(tempList) // newArr为一个新的数组，不是简单的赋值引用
        newArr.sort(compare('openTeamTime'))
        let count = newArr.length
        count = count - 10 > 0 ? 10 : count
        for (let i = 0; i < count; i++) {
          newTempTeamList.push(newArr[i])
        }
        // 获取倒计时
        state.isTeam = true
        state.teamBuyList = newTempTeamList
        state.teamBuyLeaderPrice = newTempTeamList[0].teamLeaderPrice
        const teamBuyTimeInfo = []
        // 将活动的结束时间参数提成一个单独的数组，方便操作
        newTempTeamList.forEach((o) => {
          const tempTime = {
            openTeamTime: o.openTeamTime,
            duration: o.duration,
          }
          teamBuyTimeInfo.push(tempTime)
        })
        state.teamBuyTimeList = teamBuyTimeInfo
        countDown()
        // 执行倒计时函数
        function countDown() {
          clearTimeout(state.timeId)
          const countDownArr = util.countDown(teamBuyTimeInfo)
          let count = 0
          countDownArr.forEach((time) => {
            state.teamBuyList[count].time = time
            count++
          })
          state.teamBuyList = state.teamBuyList
          const time = setTimeout(function () {
            countDown()
          }, 1000)
          state.timeId = time
        }
      } else {
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
function getDetails(storeId, productId) {
  const self = this
  productService
    .getDetails(storeId, productId)
    .then((res) => {
      const tempList = []
      tempList.push(res)
      state.goodsList = tempList
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
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
            log.info(res)
            subscribeMessage.addSubscribe(subscribeMessage.scene.GROUP_ORDER, res)
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
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
</script>
<style scoped>
/* pages/teamList/teamList.wxss */
.content {
  padding: 0rpx 22rpx;
}

.no-data {
  font-size: 24rpx;
  line-height: 48rpx;
  color: #666666;
  text-align: center;
  margin-top: 30%;
}

.bottom-tips {
  font-size: 24rpx;
  line-height: 48rpx;
  color: #666666;
  text-align: center;
  margin-top: 20rpx;
  margin-bottom: 30rpx;
}

/* 弹出框 */

.modal-box {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.modal-body {
  position: relative;
}

.modal-content {
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

/* 拼团弹窗 */

.join-group {
  position: relative;
  width: 670rpx;
  min-height: 620rpx;
  margin: 40% auto;
  border-radius: 6rpx;
  padding-bottom: 100rpx;
}

.join-group .title {
  font-size: 32rpx;
  color: #454545;
  border-bottom: 1rpx solid #f1f1f1;
  height: 130rpx;
  width: 100%;
  text-align: center;
  padding-top: 10rpx;
  line-height: 130rpx;
}

.join-group .group-info {
  border-bottom: 20rpx solid #f1f1f1;
}

.join-group .group-info view:first-of-type {
  font-size: 26rpx;
  line-height: 88rpx;
  height: 88rpx;
  color: #454545;
  text-indent: 40rpx;
}

.join-group .group-info view:first-of-type text {
  color: #009f55;
  font-size: 32rpx;
}

.join-group .group-info view:last-of-type {
  height: 72rpx;
  padding-bottom: 8rpx;
  text-indent: 40rpx;
  font-size: 24rpx;
  line-height: 72rpx;
  color: #8b8b8c;
}

.join-group .group-info view:last-of-type text {
  font-size: 28rpx;
  color: #1b1b1d;
  font-weight: bold;
  vertical-align: middle;
  margin: 0 26rpx 0 23rpx;
}

.join-group .group-info view image {
  width: 23rpx;
  height: 29rpx;
  vertical-align: middle;
  margin-top: -3rpx;
  margin-right: 14rpx;
}

.group-people-list {
  padding: 33rpx 50rpx;
  min-height: 100rpx;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.people-item {
  /* margin-left: 34rpx; */
  width: 100rpx;
  height: 100rpx;
  margin: 5rpx 0;
  border-radius: 50%;
  border: 3rpx dashed #adadad;
  position: relative;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.group-people-list .leader {
  border: 3rpx solid #009f55;
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

.people-item:first-of-type {
  margin-left: 0;
}

.people-more {
  width: 100rpx;
  height: 100rpx;
  margin: 5rpx 0;
  border-radius: 50%;
  position: relative;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.people-more image {
  width: 100rpx;
  height: 100rpx;
}

.join-group .button-box {
  width: 100%;
  height: 100rpx;
  background: #009f55;
  font-size: 32rpx;
  line-height: 100rpx;
  color: #fff;
  font-weight: Medium;
  border: 0;
  border-radius: 0;
  position: absolute;
  bottom: 0;
  left: 0;
}

button[class='button-box']::after {
  border: 0;
}
</style>
