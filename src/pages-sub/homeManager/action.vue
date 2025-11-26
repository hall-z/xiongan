<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'default',

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
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { useMessage } from 'wot-design-uni'
import actionB from './static/image/action_b.jpg'
import couponB from './static/image/coupon_b.png'
import useAction from './utils/useIndex'

const { getActivity, sendReceiveCoupon, format } = useAction()
const userStore = useUserStore()
const message = useMessage()

const activity = ref<IActivity>()
onLoad(async (options: Pick<ActivityParams, 'id'>) => {
  const params: ActivityParams = {
    id: options.id,
    userDId: userStore.userInfo.userDId,
    userId: userStore.userInfo.userDId,
  }
  let data = await getActivity(params)
  if (data.productSpuBean && data.productSpuBean.length > 0) {
    data = {
      ...data,
      productSpuBean: data.productSpuBean.map((item) => {
        const res = JSON.parse(item.rotationUrl)
        return { ...item, rotationUrl: res?.data }
      }),
    }
  }
  activity.value = data
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

// 正常情况下，导航栏背景色为透明，滚动距离超过50px时，导航栏背景色变为自生
</script>
<template>
  <view>
    <dy-navbar leftTitle="活动" left></dy-navbar>
    <view class="back">
      <image :src="actionB"></image>
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
      <view class="t_title">{{ activity?.activityBean?.activityName }}</view>
      <view class="board">
        <view class="title">活动介绍</view>
        <view class="timeline">
          <view class="timeline_row">
            <view class="timeline_row_title">活动名称</view>
            <view class="timeline_row_content">{{ activity?.activityBean?.activityName }}</view>
          </view>
          <view class="timeline_row">
            <view class="timeline_row_title">活动时间</view>
            <view class="timeline_row_content">
              <view>{{ format(activity?.activityBean?.createTime) }}</view>
              <view>{{ format(activity?.activityBean?.endTime) }}</view>
            </view>
          </view>
          <view class="timeline_row">
            <view class="timeline_row_title">活动介绍</view>
            <view class="timeline_row_content">
              {{ activity?.activityBean?.activityContent }}
            </view>
          </view>
        </view>
      </view>
      <!--      <view class="board">-->
      <!--        <view class="title">推荐商品</view>-->
      <!--        <view class="recommend" v-for="(item, index) in activity?.productSpuBean" :key="index">-->
      <!--          <view class="flex" @click="gopath('/pages-sub/homeManager/shopInfo', { id: item.spuId })">-->
      <!--            <wd-img :width="84" :height="84" :src="item?.rotationUrl"></wd-img>-->
      <!--            <view class="info flex-c">-->
      <!--              <view class="pro_title">{{ item?.spuName }}</view>-->
      <!--              <view class="price">-->
      <!--                <text class="sy">￥</text>-->
      <!--                {{ item?.sellPrice }}-->
      <!--                <text class="desc">已售{{ item?.frequently }}件</text>-->
      <!--              </view>-->
      <!--            </view>-->
      <!--          </view>-->
      <!--        </view>-->
      <!--      </view>-->
      <view class="board">
        <view class="title">优惠券</view>
        <view class="coupon" v-for="(item, index) in activity?.tbCoupon" :key="index">
          <image :src="couponB"></image>
          <view
            class="flex"
            style="align-items: center; justify-content: space-between; height: 100%"
          >
            <view class="flex-c">
              <view class="coupon_title">{{ item?.couponName }}</view>
              <view class="effect_time flex">
                <text style="line-height: 1.25">有效期：</text>
                <view class="flex-c">
                  <text>{{ format(item?.couponBeginDate) }}</text>
                  <text>{{ format(item?.couponEndDate) }}</text>
                </view>
              </view>
              <view class="operate flex">
                <view class="receive_btn" @click="receiveCoupon(item?.couponId)">领取</view>
                <text class="desc" @click="alertBox(item?.couponRemark)">查看使用说明</text>
              </view>
            </view>
            <div class="amount">
              <text class="reduct">￥{{ item?.couponPrice }}</text>
              <text class="reduct_desc">满{{ item?.couponFillPrice }}元可用</text>
            </div>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
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
  margin-bottom: 40rpx;
  font-size: 72rpx;
  font-weight: bold;
  color: #fff9d9;
  text-align: center;
}
.board {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 688rpx;
  padding: 32rpx;
  padding-top: 0;
  // margin: 0 32rpx;
  margin-bottom: 40rpx;
  background: #fcf7eb;
  border-radius: 20rpx;
  // width: calc(100% - 32rpx * 2);
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 280rpx;
    height: 80rpx;
    margin-bottom: 36rpx;
    font-size: 40rpx;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #ed6f4c 0%, #e7184f 100%);
    border-radius: 0px 0px 30rpx 30rpx;
  }
}
.timeline {
  $c: #e41313;
  $d: 26rpx;
  $pl: calc(#{$d} + 20rpx);
  box-sizing: border-box;
  width: 100%;
  padding-bottom: 32rpx;
  line-height: 48rpx;
  &_row {
    position: relative;
    box-sizing: border-box;
    font-size: 32rpx;

    &_title {
      position: relative;
      padding-left: $pl;
      margin-bottom: 14rpx;
      color: $c;
      &::after {
        position: absolute;
        top: 50%;
        left: 0;
        box-sizing: border-box;
        width: $d;
        height: $d;
        content: '';
        border: 4rpx solid $c;
        border-radius: 50%;
        transform: translateY(-50%);
      }
    }
    &::after {
      position: absolute;
      top: calc(#{$d} + 7rpx);
      left: calc(#{$d} / 2);
      height: calc(100% - #{$d});
      content: '';
      border: 2rpx dashed transparent;
      border-left-color: #707070;
    }
    &_content {
      padding-bottom: 52rpx;
      padding-left: $pl;
    }
    &:last-child {
      .timeline_row_content {
        padding-bottom: 0rpx !important;
      }
    }
  }
}
.recommend {
  box-sizing: border-box;
  width: 100%;
  padding: 18rpx;
  margin-bottom: 22rpx;
  background: #fff;
  border-radius: 12rpx;
  :deep(image) {
    border-radius: 10rpx;
  }
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .flex-c {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10rpx 0;
  }
  .info {
    box-sizing: border-box;
    flex: 1;
    padding-left: 40rpx;
  }
  .pro_title {
    display: -webkit-box;
    margin-bottom: 18rpx;
    overflow: hidden;
    font-size: 32rpx;
    font-weight: bold;
    color: #000;
    text-overflow: ellipsis;
    white-space: normal;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .price {
    display: flex;
    align-items: baseline;
    font-size: 36rpx;
    color: #f44d24;
    .sy {
      font-size: 28rpx;
    }
    .desc {
      margin-left: 12rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
}
.coupon {
  $c: #ffc4a6;
  position: relative;
  box-sizing: border-box;
  width: 626rpx;
  height: 232rpx;
  padding: 32rpx 30rpx 26rpx 46rpx;
  margin-bottom: 34rpx;
  &:last-child {
    margin-bottom: 0;
  }
  image {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  & > view {
    position: relative;
    z-index: 2;
  }
  .flex {
    display: flex;
  }
  .flex-c {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .coupon_title {
    margin-bottom: 8rpx;
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
  }
  .effect_time {
    margin-bottom: 8rpx;
    font-size: 24rpx;
    color: $c;
  }
  .operate {
    display: flex;
    align-items: center;
    .receive_btn {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 140rpx;
      height: 50rpx;
      font-size: 24rpx;
      color: $c;
      border: 2rpx solid #fff;
      border-radius: 26rpx;
    }
    .desc {
      margin-left: 40rpx;
      font-size: 24rpx;
      color: #fff6da;
    }
  }
  .amount {
    display: flex;
    flex-direction: column;
    align-items: center;
    .reduct {
      font-size: 64rpx;
      font-weight: bold;
      color: #ff4345;
    }
    .reduct_desc {
      font-size: 24rpx;
      color: #666;
      text-indent: 10rpx;
    }
  }
}
</style>
