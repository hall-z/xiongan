<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
  style: {
    navigationStyle: 'custom',
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
import { dataDesensitization, clearSpace, routeTo, isUnder16 } from '@/utils'
import { useMessage, useToast } from 'wot-design-uni'
import useLogin from '../../pages/login/utils/useLogin'
import { useUserStore } from '@/store'
import business from './hooks/business'
const { userInfo } = useUserStore()
const { sendGgXxGrjbxxInfo, sendZhXxGrzhxxInfo, sendDkXxDksqxxInfo, housingInfo } = business()
const message = useMessage()
const userImg = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/d76e9c9f-13b3-4f30-bd59-e70e3935b116KcirmOvHYC2z239aa367a839db3cb8a291b89ba60a22.png',
)
const eye = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/202fed51-c6f2-4ef1-8c8b-1b66d9701268Js2eIvuqKxcP83f9192129f5ca1f628278b3e9134ce8.png',
)
const deye = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/c972af5e-1d21-4fbe-a199-c0a9dfc2f8d2sYcZEqAjkVzY674f34cf33260b596edd9c6e18488ac0.png',
)
const adress = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/01c95bc7-33ee-4ac2-9904-e019bb5bcaa2ZWyPxpQsOcXj1f01052fa35caf338f81426f716eea5d.png',
)
const personIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/10a18e7b-b34f-47f2-a269-20cf536be369PZgZiubysanbb3d4ff44f135c4f80525345bd240ce55.png',
)
const monyIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/c117cdd5-c4bd-4de6-bbef-ad894cf6e990JjbCAwT06mU505ab5940cf98c36c67510c682f6b03ec.png',
)
const housIcon1 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/836edeee-9666-477c-812d-ce3188fc4515housIcon1.png',
)
const housIcon2 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/a39e7577-77b5-4bfb-bb12-b3c5f5757899housIcon2.png',
)
const housIcon3 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/80f91a4b-87fa-4550-8cbe-407207692bbbhousIcon3.png',
)
const housIcon4 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/4335ee7b-8507-48c5-99fe-bd1eeed3e0echousIcon4.png',
)
const housIcon5 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/b8d13559-7407-4ce0-ba41-fa7515f3af56housIcon5.png',
)
const housIcon6 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/2211b56f-879c-407c-8da7-5f608b141002housIcon6.png',
)
const navTitle = ref('公积金')
const isLook = ref(false)
const providentInfo: any = ref({})
const planProvidentInfo: any = ref({})
function changeLook(e) {
  isLook.value = e
}
function goList(e) {
  routeTo({
    url: e,
  })
}
async function goLoan() {
  try {
    await sendDkXxDksqxxInfo({ khbh: housingInfo.value.khbh })
    routeTo({
      url: '/pages-sub/housingProvident/loanRepayment',
    })
  } catch {}
}
async function getHousingInfo() {
  // 调用接口获取数据
  const params = {
    zjhm: userInfo.idCardNumber,
  }
  try {
    const date: any = await sendGgXxGrjbxxInfo(params)
    const dates: any = await sendZhXxGrzhxxInfo({ khbh: date.data[0].khbh })
    housingInfo.value = date.data[0]
    if (date.data.length > 0 && dates.data.length > 0) {
      providentInfo.value = {
        xingming: date.data[0].xingming,
        zjhm: date.data[0].zjhm,
        grzh: dates.data[0].grzh,
        grzhye: dates.data[0].grzhye,
        grzhzt:
          dates.data[0].grzhzt === '01'
            ? '正常'
            : dates.data[0].grzhzt === '02'
              ? '封存'
              : dates.data[0].grzhzt === '03'
                ? '合并销户'
                : dates.data[0].grzhzt === '04'
                  ? '外部转出销户'
                  : dates.data[0].grzhzt === '05'
                    ? '提取销户'
                    : dates.data[0].grzhzt === '06'
                      ? '冻结'
                      : '其他',
      }
    }
    console.log('获取数据datesdates成功:', dates)
    console.log('获取数据成功:', date)
  } catch (error) {
    message
      .alert({
        msg: '未查询到您的公积金！',
        title: '提示',
      })
      .then((e) => {
        uni.navigateBack()
      })
    console.error('获取数据失败:', error)
  }
}
onShow(() => {})
onLoad((options) => {
  getHousingInfo()
  navTitle.value = decodeURIComponent(options.title)
})
onMounted(() => {})
</script>

<template>
  <view class="h-100vh box-border dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <view class="housingBox">
      <view class="flex items-center" style="position: relative">
        <view class="housTop">
          <img :src="userImg" alt="" class="w-60px h-60px" />
          <view class="housTag">{{ providentInfo.grzhzt }}</view>
        </view>
        <view class="ml-15px">
          <view class="flex items-center">
            <text class="mr-20px" v-if="!isLook">
              {{ dataDesensitization(providentInfo.xingming, false, 'userName') }}
            </text>
            <text class="mr-20px" v-if="isLook">{{ providentInfo.xingming }}</text>
            <view v-if="isLook" @click="changeLook(false)" style="padding: 0px 5px 5px 5px">
              <img :src="eye" alt="" class="w-17px h-13px" />
            </view>
            <view v-else @click="changeLook(true)" style="padding: 0px 5px 5px 5px">
              <img :src="deye" alt="" class="w-15px h-6px" />
            </view>
          </view>
          <view class="color-#999999 font-size-14px mt-10px" v-if="!isLook">
            {{ dataDesensitization(providentInfo.zjhm, false, 'right') }}
          </view>
          <view class="color-#999999 font-size-14px mt-10px" v-if="isLook">
            {{ providentInfo.zjhm }}
          </view>
        </view>
        <view class="adderssBox">
          <img :src="adress" alt="" class="w-13px h-16px mr-5px" />
          雄安新区
        </view>
      </view>
      <view class="housingMiddle">
        <view class="housItem housItem1">
          <view class="flex items-center color-#fff">
            <img :src="personIcon" alt="" class="w-13px h-15px mr-5px" />
            个人账号
          </view>
          <view class="color-#A6C9FF mt-10px">{{ providentInfo.grzh }}</view>
        </view>
        <view class="housItem">
          <view class="flex items-center color-#fff">
            <img :src="monyIcon" alt="" class="w-13px h-15px mr-5px" />
            账号余额
          </view>
          <view class="color-#A6C9FF mt-10px" v-if="!isLook">********元</view>
          <view class="color-#A6C9FF mt-10px" v-if="isLook">{{ providentInfo.grzhye }}元</view>
        </view>
      </view>
      <view class="housingBottom">
        <view class="color-#000 font-size-16px font-bold">业务查询</view>
        <view class="housBlock">
          <view class="housBlockItgem" @click="goList('/pages-sub/housingProvident/accountInfo')">
            <img :src="housIcon1" alt="" class="w-38px h-38px mr-13px" />
            <view class="housBTxt">账户信息</view>
          </view>
          <view
            class="housBlockItgem"
            @click="goList('/pages-sub/housingProvident/businessDetail')"
          >
            <img :src="housIcon2" alt="" class="w-38px h-38px mr-13px" />
            <view class="housBTxt">业务明细</view>
          </view>
          <view class="housBlockItgem" @click="goLoan()">
            <img :src="housIcon3" alt="" class="w-38px h-38px mr-13px" />
            <view class="housBTxt">贷款还款明细</view>
          </view>
        </view>
        <!-- <view class="color-#000 font-size-16px font-bold mt-18px">便民服务</view>
          <view class="housBlock">
              <view class="housBlockItgem">
                <img :src="housIcon4" alt="" class="w-38px h-38px mr-13px" />
                 <view class="housBTxt">公积金分处理</view>
              </view>
              <view class="housBlockItgem">
                 <img :src="housIcon5" alt="" class="w-38px h-38px mr-13px" />
                 <view class="housBTxt">公积金缴存计算器</view>
              </view>
              <view class="housBlockItgem">
                 <img :src="housIcon6" alt="" class="w-38px h-38px mr-13px" />
                 <view class="housBTxt">贷款计算器</view>
              </view>
          </view> -->
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.housingBox {
  padding: 15px;
  .housTop {
    position: relative;
    width: 60px;
    height: 66px;
  }
  .housTag {
    position: absolute;
    bottom: 0px;
    left: 50%;
    width: 46px;
    height: 18px;
    font-size: 12px;
    color: #fff;
    text-align: center;
    background: linear-gradient(90deg, #2ec7ff 0%, #3987f7 100%);
    border-radius: 9px 9px 9px 9px;
    transform: translate(-50%, 0);
  }
  .adderssBox {
    position: absolute;
    right: 0px;
    bottom: 10px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333333;
  }
  .housingMiddle {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 96px;
    padding: 16px 30px 36px 30px;
    margin-top: 18px;
    background: linear-gradient(95deg, #2d69ef 0%, #46a9ff 72%, #2d69ef 100%);
    border-radius: 12px 12px 12px 12px;
    .housItem {
      box-sizing: border-box;
      width: 50%;
      padding-left: 35px;
    }
    .housItem1 {
      padding-right: 20px;
      padding-left: 0px;
      border-right: 1px dashed #9fc2f1;
    }
  }
  .housingBottom {
    box-sizing: border-box;
    width: 100%;
    min-height: 500px;
    padding: 14px;
    margin-top: -20px;
    background: #ffffff;
    border-radius: 12px 12px 5px 5px;
    .housBlock {
      display: flex;
      flex-wrap: wrap;
      .housBlockItgem {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: calc((100% - 13px) / 2);
        height: 60px;
        padding: 10px;
        margin-top: 13px;
        margin-right: 13px;
        font-size: 14px;
        line-height: 23px;
        color: #333333;
        background: #f5f6f8;
        border-radius: 10px 10px 10px 10px;
        &:nth-child(2n) {
          margin-right: 0px;
        }
      }
      .housBTxt {
        width: calc(100% - 55px);
      }
    }
  }
}
</style>
