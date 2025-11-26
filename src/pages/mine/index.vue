<route lang="json5">
{
  layout: 'default',

  style: {
    navigationStyle: 'custom',
    backgroundColor: '#F3F4F6',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
    },
  },
}
</route>
<script lang="ts" setup>
import anvter from '@/static/images/mine/anvter.png'
import anvter1 from '@/static/images/mine/anvter1.png'
import dhicon from '@/static/images/mine/dhicon.png'
import gerenicon from '@/static/images/mine/gerenicon.png'
import h1 from '@/static/images/mine/h1.png'
import jinbi from '@/static/images/mine/jinbi.png'
import sjfw from '@/static/images/mine/sjfw.png'
import tygj from '@/static/images/mine/tygj.png'
import store from '@/store'
import { useUserStore } from '@/store/user'
import { routeTo } from '@/utils'
import { storeToRefs } from 'pinia'
import { useMessage, useToast } from 'wot-design-uni'
import useInfo from './utils/useInfo'
const { navTop } = useNav()

const {
  serveList,
  serveClick,
  topList,
  serveOrderList,
  sendMyInfo,
  myInfoData,
  sendOrderStatistics,
  myOrderData,
  sendBusinessInfo,
  grzqList,
  sendUserHasMerchantAuth,
  hasMerchantAutData,
  cLeavel,
  shopOrederData,
  sendInterInfo,
  interInfoData,
  sedUserInfo,
  userInfoData,
  senDcheckBankPromoterByUserId,
  senGetPromoterSwitch,
  showUtils,
  sendHistoryCount,
  historyCountData,
} = useInfo()
const { isLogined, userInfo, isRealSataus } = storeToRefs(useUserStore(store))
const authStore = useUserStore()
const message = useMessage()

function login() {
  routeTo({ url: '/pages/login/index' })
}

const toast = useToast()
const bgUrlBase64 = ref(
  'https://oss.xay.xacloudy.cn/images/2024-10/0d9fe262-f40e-4115-9173-e9f89d24828aJZDxK0DIw9Ta144dbd42ab626884a3018ec3ecaf2d6d.png',
)

const dingdan = (e) => {
  routeTo({ url: e })
}
const qiandao = () => {
  routeTo({ url: '/pages-sub/marketManager/integral/index' })
}
const toShopService = () => {
  routeTo({ url: '/pages-sub/shopManager/index' })
}
const goUserInfo = () => {
  routeTo({ url: '/pages-sub/system/userInfo/index' })
}

// 查询商户权限
async function merchantAuth() {
  await sendUserHasMerchantAuth()

  if (hasMerchantAutData.value) {
    if (userInfo.value.merchantId) {
      // 查询商户统计
      await sendBusinessInfo()
    }
  } else {
    const olduserInfo = JSON.parse(JSON.stringify(userInfo.value))
    olduserInfo.merchantId = null
    authStore.setUserInfo(olduserInfo)
  }
}

onShow(async () => {
  if (isLogined.value) {
    try {
      await sedUserInfo()
      authStore.setUserInfo(Object.assign(userInfo.value, userInfoData.value))
      await sendMyInfo()
      merchantAuth()
      sendOrderStatistics({ type: 1 })
      sendHistoryCount({ classify: '1' })
      if (isRealSataus.value) {
        await sendInterInfo()
        // #ifndef MP-ALIPAY
        // 查询是否银行员工有推广权限 ==
        // await senDcheckBankPromoterByUserId({ id: authStore.userInfo.userDId })
        await senGetPromoterSwitch({ id: 1 })
        await senGetPromoterSwitch({ id: 2 })
        // #endif
      }
    } catch (err) {
      console.log('🍯===>>>', err)
    }
  }
})
</script>

<template>
  <view
    class="fixed top-0 left-0 right-0 z-0 h-400px bg-no-repeat"
    :style="` background-image: url(${bgUrlBase64}); background-size:100% 310px`"
  ></view>
  <view class="box-border flex flex-col relative z-10" :style="`padding-top:${navTop}px`">
    <view class="px-15px mt-50px">
      <view class="flex justify-between items-center">
        <view class="flex items-center gap-20px">
          <template v-if="isLogined">
            <view class="flex gap-15px items-center">
              <view @click="goUserInfo">
                <view class="p-5px rounded-50% size-64px">
                  <wd-img :width="60" :height="60" :src="userInfo.userAvatar ?? anvter1" round />
                </view>

                <view
                  class="flex items-center mt-[-15px] relative z-9 pl-10px ml-[-10px]"
                  v-if="userInfo.socialCardType === '1' && userInfo.isReal === '1'"
                >
                  <wd-img :src="h1" width="22" height="18"></wd-img>
                  <view
                    class="color-#fff text-10px text-center h-bg rounded-100 px-10px ml-[-10px] mt-2px"
                  >
                    已申领
                  </view>
                </view>
                <!-- <view class="flex items-center mt-[-15px] relative z-9 pl-10px ml-[-10px]" v-else>
                  <wd-img :src="h0" width="22" height="18"></wd-img>
                  <view
                    class="color-#fff text-10px text-center bg-#ccc rounded-100 px-10px ml-[-10px] mt-2px"
                  >
                    <!~~ {{ userInfo.isReal === '1' ? '未申领' : '未申领' }} ~~>
                    未申领
                  </view>
                </view>-->
              </view>
              <view>
                <view class="font-size-20px font-medium" @click="goUserInfo">
                  {{ userInfo.userName ? userInfo.userName : '微信用户' }}
                  <!-- {{ dataDesensitization(userInfo.userName, false, 'userName') ?? '微信用户' }} -->
                </view>

                <view>
                  <view class="mt-2">
                    <image :src="cLeavel.bgImg" alt="" class="userGradeBG" />
                    <text class="userGradeTitle" :style="`color: ${cLeavel.bgImg} `">
                      {{ myInfoData.userGradeName }}
                    </text>
                  </view>
                </view>
              </view>
            </view>
          </template>
          <template v-else>
            <view class="flex items-center">
              <view class="p-5px rounded-50% size-64px">
                <wd-img :width="60" :height="60" :src="anvter" round />
              </view>
              <view @click="login">
                <view class="font-bold">立即登录</view>
              </view>
            </view>
          </template>
        </view>
        <view
          class="qiandao flex items-center gap-5px justify-center line-height-32px color-#fff font-size-14px"
          @click="qiandao"
          v-if="isLogined"
        >
          <wd-img :src="jinbi" width="18" height="18"></wd-img>
          <text>{{ interInfoData.today ? '已签到' : '签到' }}</text>
        </view>
      </view>
      <view class="py-10px mt-30px">
        <view class="flex justify-around">
          <view
            class="w-1/3 text-center"
            v-for="(item, index) in topList"
            :key="index"
            @click="serveClick(item)"
          >
            <view class="text-20px">
              {{ isLogined ? (myInfoData![item.props] ?? 0) : 0 }}
            </view>
            <view class="text-14px mt-10px">
              {{ item.title }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 个人 -->
    <view class="px-15px pb-10px">
      <view class="p-10px bg-#fff rounded-7px">
        <view class="flex justify-between items-center gap-10px mb-10px">
          <view class="flex items-center gap-5px">
            <view class="mt-3px">
              <wd-img :src="gerenicon" width="18" height="18"></wd-img>
            </view>
            <view class="text-16px font-600">个人专区</view>
          </view>
        </view>
        <view class="grid grid-cols-3 gap-10px">
          <view
            class="flex items-center pt-10px gap-5px place-items-center"
            v-for="(item, index) in grzqList"
            :key="index"
            @click="serveClick(item)"
          >
            <wd-badge :modelValue="item.value">
              <view>
                <wd-img :src="item.icon" width="33" height="33"></wd-img>
              </view>
            </wd-badge>

            <view class="text-13px text-center mb-4px">
              {{ item.title }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- #ifndef MP-ALIPAY || APP-PULS -->
    <!-- 商家  -->
    <view class="px-15px pb-10px" v-if="isLogined && hasMerchantAutData">
      <view class="p-10px bg-#fff rounded-7px">
        <view class="flex justify-between items-center gap-10px" @click="toShopService">
          <view class="flex items-center gap-5px">
            <view class="mt-3px">
              <wd-img :src="sjfw" width="18" height="18"></wd-img>
            </view>
            <view class="text-16px font-600">商家服务</view>
          </view>
          <view>
            <wd-icon name="chevron-right" size="14px"></wd-icon>
          </view>
        </view>
        <view class="flex justify-around items-center gap-10px before-shu">
          <view class="text-center">
            <view class="text-14px color-#999 py-10px">今日收款 (元)</view>
            <view>{{ shopOrederData!.todayAmount ?? 0 }}</view>
          </view>
          <view class="text-center">
            <view class="text-14px color-#999 py-10px">今日订单</view>
            <view>{{ shopOrederData!.todayOrderNum ?? 0 }}</view>
          </view>
        </view>
      </view>
    </view>
    <!--我的  -->
    <view class="px-15px pb-10px">
      <view class="p-10px bg-#fff rounded-7px">
        <view class="flex justify-between items-center gap-10px mb-10px">
          <view class="flex items-center gap-5px">
            <view class="mt-3px">
              <wd-img :src="dhicon" width="18" height="18"></wd-img>
            </view>
            <view class="text-16px font-600">我的订单</view>
          </view>
          <view
            class="flex items-center"
            @click="routeTo({ url: '/pages-sub/order/orderList?tabsVal=-1' })"
          >
            <view class="text-12px color-#999">全部订单</view>
            <wd-icon name="arrow-right" size="14px" color="#999"></wd-icon>
          </view>
        </view>
        <view class="grid grid-cols-5 gap-2px">
          <view
            class="flex flex-col items-center py-10px"
            v-for="(item, index) in serveOrderList"
            :key="index"
            @click="dingdan(item.path)"
          >
            <wd-badge
              :modelValue="myOrderData![item.props] ?? 0"
              :hidden="isLogined ? item.hidden : true"
            >
              <view>
                <wd-img :src="item.icon" width="26" height="26"></wd-img>
              </view>
            </wd-badge>
            <view class="text-13px mt-3px">
              {{ item.label }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->
    <!-- 工具 -->
    <view class="px-15px pb-10px">
      <view class="p-10px bg-#fff rounded-7px">
        <view class="flex justify-between items-center gap-10px mb-10px">
          <view class="flex items-center gap-5px">
            <view class="mt-3px">
              <wd-img :src="tygj" width="18" height="18"></wd-img>
            </view>
            <view class="text-16px font-600">通用工具</view>
          </view>
        </view>
        <view class="grid grid-cols-5 gap-col-10px">
          <template v-for="(item, index) in serveList" :key="index">
            <view
              class="flex flex-col items-center pt-5px mb-5px"
              v-if="showUtils(item, isRealSataus)"
              @click="serveClick(item)"
            >
              <wd-badge :modelValue="historyCountData ?? 0" v-if="item.title === '我的消息'">
                <view>
                  <wd-img :src="item.icon" width="38" height="38"></wd-img>
                </view>
              </wd-badge>
              <wd-badge :modelValue="item.value" v-else>
                <view>
                  <wd-img :src="item.icon" width="38" height="38"></wd-img>
                </view>
              </wd-badge>

              <view class="text-13px text-center color-#4C5158">
                {{ item.title }}
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>
<style>
page {
  background: linear-gradient(180deg, #d1e8ff 0%, #f7f7f7 30%, #f2f3f7 100%);
}
</style>
<style lang="scss" scoped>
.qiandao {
  width: 82px;
  height: 32px;
  background: linear-gradient(270deg, #99c7f2 0%, #71a2fb 100%);
  border-radius: 19px;
}

.money {
  box-sizing: border-box;
  border-right: 1px solid #d4d4d4;
}

.h-bg {
  background: linear-gradient(90deg, #a4e3fa 0%, #4bbefd 100%);
}

:deep(.custom-class-mine-login) {
  color: #fff !important;
  background: linear-gradient(90deg, #72c2fe 0%, #4055fe 100%) !important;
  border: none !important;
  border-radius: 6px !important;
}

.before-shu {
  &::before {
    position: absolute;
    right: 48%;
    width: 1px;
    height: 40px;
    content: '';
    background: #e5e5e5;
  }
}

.userGradeTitle {
  position: absolute;
  box-sizing: border-box;
  display: inline-block;
  width: 62px;
  height: 19px;
  padding-top: 4px;
  padding-left: 12px;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
}

.userGradeBG {
  position: absolute;
  display: inline-block;
  width: 62px;
  height: 19px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
}
</style>
