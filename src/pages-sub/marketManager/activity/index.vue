<route lang="json5">
{
  layout: 'default',
  realNameAuthentication: true,
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      defaultTitle: '',
      titlePenetrate: 'NO',
      backButtonIcon: null,
    },
  },
}
</route>
<script lang="ts" setup>
import isObject from 'lodash/isObject'
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { routeTo } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { useMessage } from 'wot-design-uni'
// import couponB from '@/static/image/coupon_b.png'
import useAction from './utils/useIndex'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { promotionDateStore, useUserStore } from '@/store'
import { savePromoterUser } from '@/service/api/system'
// import useCardApply from '@/pages-sub/serveMain/hooks/useCardApply'

const { promotionDate } = storeToRefs(promotionDateStore())
const promotionStore = promotionDateStore()
// const {sedGetPromoterById, sedBankCodeById,sedPromoterOrgUserById } = useCardApply()
const { send: sedSavePromoterUser } = useRequest((data: any) => savePromoterUser(data), {
  immediate: false,
  loading: false,
})
const {
  sedGetPromoterById,
  sedBankCodeById,
  sedPromoterOrgUserById,
  getActivityInfo,
  getIsYktUserInfo,
  getUserPageByTagIdInfo,
  sendReceiveCoupon,
  format,
} = useAction()
const userStore = useUserStore()
const message = useMessage()
const { userInfo } = storeToRefs(useUserStore())

const activity = ref<any>()
const navTitle = ref('活动')
onLoad(async (options) => {
  navTitle.value = decodeURIComponent(options.title)
  const params: any = {
    id: options.id,
    // userDId: userStore.userInfo.userDId,
    // userId: userStore.userInfo.userDId,
  }
  // 请求保存
  try {
    const data = await getActivityInfo(params)
    console.log('getActivityInfo', data)
    activity.value = data
  } catch (error) {
    console.log('error', error)
  }
  console.log('options.pid', options.pid)
  if (options.pid) {
    let promotionDate: any = {}
    if (options.promoterType === '1') {
      promotionDate = {
        promoterType: options.promoterType,
        promoterId: options.pid,
        isPromotion: false,
      }
      // 请求状态启用和禁用
      const returnData: any = await sedGetPromoterById({ id: options.pid })
      console.log('returnData', returnData)
      if (returnData.status === 0) {
        promotionDate.isPromotion = true
      } else {
        promotionDate.isPromotion = false
      }
      const params = {
        userName: userInfo.value.userName,
        userPhone: userInfo.value.userPhone,
        promoterId: options.pid,
        promoterName: returnData.name ? returnData.name : '',
        promoterType: options.promoterType,
        bankCodeId: '',
        bankCodeName: '',
        orgUserId: '',
        orgUserName: '',
        orgUserPhone: '',
      }
      // 请求保存
      try {
        const res: any = await sedSavePromoterUser(params)
        console.log('sedSavePromoterUser', res)
        // promoteUpdateId.value = res.id
        promotionDate.isPromotion = true
      } catch (error) {
        console.log('error', error)
        promotionDate.isPromotion = false
      }
      promotionStore.setPromotionDate(promotionDate)
    } else if (options.promoterType === '2') {
      // 缓存数据
      promotionDate = {
        promoterType: options.promoterType,
        bankCodeId: options.pid,
        isPromotion: false,
      }
      // 请求状态启用和禁用
      const returnData: any = await sedBankCodeById({ id: options.pid })
      console.log('returnData', returnData)
      if (returnData.status === 0) {
        promotionDate.isPromotion = true
      } else {
        promotionDate.isPromotion = false
      }
      const params = {
        userName: userInfo.value.userName,
        userPhone: userInfo.value.userPhone,
        promoterId: '',
        promoterName: '',
        bankCodeId: options.pid,
        promoterType: options.promoterType,
        bankCodeName: returnData.bankName ? returnData.bankName : '',
        orgUserId: '',
        orgUserName: '',
        orgUserPhone: '',
      }
      // 请求保存
      try {
        const res: any = await sedSavePromoterUser(params)
        console.log('sedSavePromoterUser', res)
        // promoteUpdateId.value = res.id
        promotionDate.isPromotion = true
      } catch (error) {
        promotionDate.isPromotion = false
      }
      console.log('promotionDatepromotionStore', promotionDate)
      promotionStore.setPromotionDate(promotionDate)
    } else {
      // 第三方机构请求
      promotionDate = {
        promoterType: options.promoterType,
        promoterId: options.pid,
        isPromotion: false,
      }
      // 请求状态启用和禁用
      const returnData: any = await sedPromoterOrgUserById({ id: options.pid })
      console.log('returnData', returnData)
      if (returnData.status === 0) {
        promotionDate.isPromotion = true
      } else {
        promotionDate.isPromotion = false
      }
      const params = {
        userName: userInfo.value.userName,
        userPhone: userInfo.value.userPhone,
        promoterId: '',
        promoterName: '',
        promoterType: options.promoterType,
        bankCodeId: '',
        bankCodeName: '',
        orgUserId: options.pid,
        orgUserName: returnData.userName ? returnData.userName : '',
        orgUserPhone: returnData.userPhone ? returnData.userPhone : '',
      }
      // 请求保存
      try {
        const res: any = await sedSavePromoterUser(params)
        console.log('sedSavePromoterUser', res)
        // promoteUpdateId.value = res.id
        promotionDate.isPromotion = true
      } catch (error) {
        console.log('error', error)
        promotionDate.isPromotion = false
      }
      promotionStore.setPromotionDate(promotionDate)
    }
  } else {
    console.log('取缓存promotionDate', promotionDate.value)
    if (isObject(promotionDate.value) && Object.values(promotionDate.value).length !== 0) {
      let promotionDateStore: any = {}
      navTitle.value = decodeURIComponent(options.title)
      if (promotionDate.value.promoterType === '1') {
        promotionDateStore = {
          promoterType: promotionDate.value.promoterType,
          promoterId: promotionDate.value.promoterId,
          isPromotion: false,
        }
        // 请求状态启用和禁用
        const returnData: any = await sedGetPromoterById({ id: promotionDate.value.promoterId })
        console.log('returnData', returnData)
        if (returnData.status === 0) {
          promotionDateStore.isPromotion = true
        } else {
          promotionDateStore.isPromotion = false
        }
        const params = {
          userName: userInfo.value.userName,
          userPhone: userInfo.value.userPhone,
          promoterId: promotionDate.value.promoterId,
          promoterName: returnData.name ? returnData.name : '',
          promoterType: promotionDate.value.promoterType,
          bankCodeId: '',
          bankCodeName: '',
          orgUserId: '',
          orgUserName: '',
          orgUserPhone: '',
        }
        // 请求保存
        try {
          const res: any = await sedSavePromoterUser(params)
          console.log('sedSavePromoterUser', res)
          // promoteUpdateId.value = res.id
          promotionDateStore.isPromotion = true
        } catch (error) {
          console.log('error', error)
          promotionDateStore.isPromotion = false
        }
        promotionStore.setPromotionDate(promotionDateStore)
      } else if (promotionDate.value.promoterType === '2') {
        // 缓存数据
        promotionDateStore = {
          promoterType: promotionDate.value.promoterType,
          bankCodeId: promotionDate.value.bankCodeId,
          isPromotion: false,
        }
        // 请求状态启用和禁用
        const returnData: any = await sedBankCodeById({ id: promotionDate.value.bankCodeId })
        console.log('returnData', returnData)
        if (returnData.status === 0) {
          promotionDateStore.isPromotion = true
        } else {
          promotionDateStore.isPromotion = false
        }
        const params = {
          userName: userInfo.value.userName,
          userPhone: userInfo.value.userPhone,
          promoterId: '',
          promoterName: '',
          bankCodeId: promotionDate.value.bankCodeId,
          promoterType: promotionDate.value.promoterType,
          bankCodeName: returnData.bankName ? returnData.bankName : '',
          orgUserId: '',
          orgUserName: '',
          orgUserPhone: '',
        }
        // 请求保存
        try {
          const res: any = await sedSavePromoterUser(params)
          console.log('sedSavePromoterUser', res)
          // promoteUpdateId.value = res.id
          promotionDateStore.isPromotion = true
        } catch (error) {
          promotionDateStore.isPromotion = false
        }
        promotionStore.setPromotionDate(promotionDateStore)
      } else {
        // 第三方机构请求
        // 缓存数据
        promotionDateStore = {
          promoterType: promotionDate.value.promoterType,
          promoterId: promotionDate.value.promoterId,
          isPromotion: false,
        }
        // 请求状态启用和禁用
        const returnData: any = await sedPromoterOrgUserById({ id: promotionDate.value.promoterId })
        console.log('returnData', returnData)
        if (returnData.status === 0) {
          promotionDateStore.isPromotion = true
        } else {
          promotionDateStore.isPromotion = false
        }
        const params = {
          userName: userInfo.value.userName,
          userPhone: userInfo.value.userPhone,
          promoterId: '',
          promoterName: '',
          promoterType: promotionDate.value.promoterType,
          bankCodeId: '',
          bankCodeName: '',
          orgUserId: promotionDate.value.promoterId,
          orgUserName: returnData.userName ? returnData.userName : '',
          orgUserPhone: returnData.userPhone ? returnData.userPhone : '',
        }
        // 请求保存
        try {
          const res: any = await sedSavePromoterUser(params)
          console.log('sedSavePromoterUser', res)
          // promoteUpdateId.value = res.id
          promotionDateStore.isPromotion = true
        } catch (error) {
          console.log('error', error)
          promotionDateStore.isPromotion = false
        }
        promotionStore.setPromotionDate(promotionDateStore)
      }
    } else {
      console.log('11')
      navTitle.value = decodeURIComponent(options.title)
    }
  }
})
// interface Emits {
//   (e: 'refresh'): void
// }
// const emit = defineEmits<Emits>()
const receiveCoupon = async (couponId: number) => {
  try {
    const data: any = await sendReceiveCoupon({ couponId })
    if (data === true) {
      // emit('refresh')
      setTimeout(() => {
        Toast('领取成功')
      }, 50)
    }
  } catch (error) {}
}

const alertBox = (msg: string) => {
  message.alert({
    msg,
    title: '使用说明',
  })
}
const id = ref('null')

const gopath = function (url, e) {
  routeTo({
    url,
    data: e,
    navType: NAVIGATE_TYPE.REDIRECT_TO,
  })
}

const getLsit = async (pageNo: number, pageSize: number) => {
  try {
    // const res: any = await getGoodList({
    //   page: pageNo,
    //   size: pageSize,
    //   status: 1,
    // })
    // res.content.forEach((el) => {
    //   el.rotationUrl = JSON.parse(el.rotationUrl).map((item) => item.data)
    // })
    // console.log('商城列表', res.content)
    // paging.value.complete(res.content)
    // paging.value.complete([])
  } catch {
    // paging.value.complete(false)
  }
}
const msgBoxEmpty = useMessage('box-empty')
const goNow = async () => {
  uni.showLoading({ title: '加载中' })
  try {
    const params = {
      tagId: '1857808042054201345',
      userPhone: userInfo.value.userPhone,
    }
    const datas: any = await getUserPageByTagIdInfo(params)
    if (userInfo.value.socialCardType === '1' && datas.content.length > 0) {
      routeTo({
        url: '/pages-sub/marketManager/coupon/index',
      })
      uni.hideLoading()
    } else {
      const date: any = {
        xm: userInfo.value.cardName,
        zjhm: userInfo.value.idCardNumber,
        userId: userInfo.value.userDId,
        tagIds: '',
      }
      try {
        const data: any = await getIsYktUserInfo(date)
        if (data.data === '0') {
          msgBoxEmpty
            .alert({
              title: '温馨提示',
              closeOnClickModal: true,
              confirmButtonText: '申领一卡通',
              confirmButtonProps: {
                // round: false,
                // block: false,
                customClass: 'custom-bgBox',
              },
            })
            .then((res) => {
              routeTo({
                url: '/pages-sub/serveMain/cardApplyType',
                data: { base: 'shebaoksl', title: '社保卡申领' },
              })
              console.log('res申领一卡通申领一卡通')
            })
        } else {
          routeTo({
            url: '/pages-sub/marketManager/coupon/index',
          })
        }
        uni.hideLoading()
      } catch (error) {
        uni.hideLoading()
      }
    }
  } catch (error) {
    uni.hideLoading()
    console.log('error', error)
  }
}

// 正常情况下，导航栏背景色为透明，滚动距离超过50px时，导航栏背景色变为自生
</script>
<template>
  <view>
    <dy-navbar :leftTitle="navTitle" left color="#fff"></dy-navbar>
    <view class="back">
      <image
        src="https://oss.xay.xacloudy.cn/images/2025-05/5febcaf3-cc6d-4867-a079-0abf23993ab9activityBg.png"
      ></image>
    </view>
    <view
      style="
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
      "
    >
      <view class="t_title">{{ activity?.activityName }}</view>
      <view class="board">
        <view class="title">活动介绍</view>
        <view class="timeline">
          <view class="timeline_row">
            <view class="timeline_row_title">活动介绍</view>
            <view class="timeline_row_content">
              <rich-text style="text-align: justify" :nodes="activity?.activityContent" />
            </view>
          </view>
          <!-- <view class="timeline_row">
            <view class="timeline_row_title">活动名称</view>
            <view class="timeline_row_content">{{ activity?.activityName }}</view>
          </view> -->
          <view class="timeline_row">
            <view class="timeline_row_title">活动时间</view>
            <view class="timeline_row_content">
              <view>{{ format(activity?.startTime) }}</view>
              <view>{{ format(activity?.endTime) }}</view>
            </view>
          </view>
          <view class="timeline_row">
            <view class="timeline_row_title">客服电话</view>
            <view class="timeline_row_content">电话：{{ activity?.telephone }}</view>
          </view>
        </view>
        <!-- <view class="nowBtu" @click="goNow">立即参与</view> -->
      </view>
      <view class="nowBtu" @click="goNow">立即参与</view>
    </view>
  </view>
  <!-- 无数据弹层 -->
  <wd-message-box selector="box-empty" class="text-center">
    <view class="w-100% pt-50rpx">
      <view class="pb-40rpx lh-46rpx text-center font-size-30rpx color-#000">
        活动仅限“雄安一卡通”社会保障卡持卡人参与。
        <text style="font-weight: 700; color: #000">
          立即
          <text style="color: #e7214f">申领</text>
          “雄安一卡通”，解锁
          <text style="color: #e7214f">专属福利</text>
          !
        </text>
      </view>
    </view>
  </wd-message-box>
</template>

<style lang="scss" scoped>
:deep(.wd-message-box) {
  .custom-bgBox {
    color: #fff;
    background: linear-gradient(-360deg, #ec6c4c 0%, #e71f4f 100%) !important;
    border-radius: 20px;
  }
}
:deep(.wd-navbar__title) {
  max-width: 80% !important;
  color: #fff !important;
  .truncate-1 {
    text-align: left;
  }
}
:deep(.nav_custom) {
  top: 0;
  left: 0;
  width: 100%;
  background-color: transparent !important;
}
:deep(.wd-navbar) {
  position: relative !important;
  width: 100vw !important;
  color: #fff !important;
  background-color: transparent !important;
  .items-center {
    color: #fff !important;
  }
}
.back {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: 100%;
  image {
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }
}
.t_title {
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  color: #fff9d9;
  text-align: center;
}
.nowBtu {
  position: fixed;
  bottom: 30px;
  width: 88%;
  height: 40px;
  margin-top: 30px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(-360deg, #ec6c4c 0%, #e71f4f 100%);
  border-radius: 20px;
}
.board {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 344px;
  max-height: 71vh;
  padding: 16px;
  padding-top: 0;
  margin-bottom: 20px;
  background: #fcf7eb;
  border-radius: 10px;
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 80px;
    margin-bottom: 18px;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #ed6f4c 0%, #e7184f 100%);
    border-radius: 0px 0px 15px 15px;
  }
}
.timeline {
  $c: #e41313;
  $d: 13px;
  $pl: calc(#{$d} + 10px);
  box-sizing: border-box;
  width: 100%;
  padding-bottom: 16px;
  overflow-y: scroll;
  line-height: 24px;
  &_row {
    position: relative;
    box-sizing: border-box;
    font-size: 16px;

    &_title {
      position: relative;
      padding-left: $pl;
      margin-bottom: 7px;
      color: $c;
      &::after {
        position: absolute;
        top: 50%;
        left: 0;
        box-sizing: border-box;
        // width: $d;
        // height: $d;
        width: 11px;
        height: 11px;
        content: '';
        background-image: url('./static/image/activeIcon.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        border-radius: 50%;
        transform: translateY(-50%);
      }
    }
    &_content {
      padding-right: $pl;
      padding-bottom: 25px;
      padding-left: $pl;
    }
  }
  .timeline_row_content {
    line-height: 28px;
    color: #333;
  }
}
</style>
