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
import { clearSpace, routeTo, isUnder16, dataDesensitization } from '@/utils'
import { useMessage, useToast } from 'wot-design-uni'
import useLogin from '../../pages/login/utils/useLogin'
import { useUserStore } from '@/store'
import business from './hooks/business'
const { userInfo } = useUserStore()
const { sendGgXxGrjbxxInfo, sendZhXxGrzhxxInfo, housingInfo } = business()

const eye = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/8ba021f5-c8ab-4425-ab0d-357f87c6e671dd.png',
)
const deye = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/f91f821c-d999-4a0a-8b1a-be7ca458a3d9ee.png',
)
const navTitle = ref('账户信息')
const isLook = ref(false)
function changeLook(e) {
  isLook.value = e
}
const accountInfo: any = ref({})
async function getAccountInfo() {
  // 调用接口获取数据
  const params = {
    zjhm: userInfo.idCardNumber,
  }
  try {
    const date: any = await sendGgXxGrjbxxInfo(params)
    const dates: any = await sendZhXxGrzhxxInfo({ khbh: date.data[0].khbh })
    if (date.data.length > 0 && dates.data.length > 0) {
      accountInfo.value = {
        xingming: date.data[0].xingming,
        zjhm: date.data[0].zjhm,
        sjhm: date.data[0].sjhm,
        dwzh: dates.data[0].dwzh, // 单位账号
        grzh: dates.data[0].grzh, // 个人账号
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
                      : '其他', // 个人账号状态
        grzhye: dates.data[0].grzhye, // 个人账号余额
        djbz:
          dates.data[0].djbz === '0'
            ? '无'
            : dates.data[0].djbz === '1'
              ? '只收不付'
              : dates.data[0].djbz === '2'
                ? '不收不付'
                : '部分冻结', // 冻结标志
      }
    }
    console.log('获取数据datesdates成功:', dates)
    console.log('获取数据成功:', date)
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}
onShow(() => {})
onLoad((options) => {
  getAccountInfo()
  // navTitle.value = decodeURIComponent(options.title)
})
onMounted(() => {})
</script>

<template>
  <view class="h-100vh box-border dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <view class="accountBox">
      <view class="accountMiddle">
        <view>个人账户信息</view>
        <view>
          <view @click="changeLook(false)" style="padding: 0px 5px 5px 5px" v-if="isLook">
            <img :src="eye" alt="" class="w-17px h-13px" />
          </view>
          <view @click="changeLook(true)" style="padding: 0px 5px 5px 5px" v-else>
            <img :src="deye" alt="" class="w-15px h-6px" />
          </view>
        </view>
      </view>
      <view class="accountBottom">
        <view class="accountList">
          <view>姓名</view>
          <view v-if="!isLook">
            {{ dataDesensitization(accountInfo.xingming, false, 'userName') }}
          </view>
          <view v-else>{{ accountInfo.xingming }}</view>
        </view>
        <view class="accountList">
          <view>身份证号</view>
          <view v-if="!isLook">{{ dataDesensitization(accountInfo.zjhm, false, 'right') }}</view>
          <view v-else>{{ accountInfo.zjhm }}</view>
        </view>
        <view class="accountList">
          <view>手机号码</view>
          <view v-if="!isLook">{{ dataDesensitization(accountInfo.sjhm, false, 'right') }}</view>
          <view v-else>{{ accountInfo.sjhm }}</view>
        </view>
        <view class="accountList">
          <view>单位账号</view>
          <view v-if="!isLook">{{ dataDesensitization(accountInfo.dwzh, false, 'right') }}</view>
          <view v-else>{{ accountInfo.dwzh }}</view>
        </view>
        <view class="accountList">
          <view>个人账号</view>
          <view v-if="!isLook">{{ dataDesensitization(accountInfo.grzh, false, 'right') }}</view>
          <view v-else>{{ accountInfo.grzh }}</view>
        </view>
        <view class="accountList">
          <view>个人账号状态</view>
          <view v-if="!isLook">{{ dataDesensitization(accountInfo.grzhzt, false, 'right') }}</view>
          <view v-else>{{ accountInfo.grzhzt }}</view>
        </view>
        <view class="accountList">
          <view>个人账号余额</view>
          <view v-if="!isLook">********</view>
          <view v-else>{{ accountInfo.grzhye }}</view>
        </view>
        <view class="accountList">
          <view>冻结标志</view>
          <view>{{ accountInfo.djbz }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.accountBox {
  padding: 15px;
  .accountMiddle {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 67px;
    // margin-top: 18px;
    padding: 14px 20px 36px 20px;
    color: #fff;
    background: linear-gradient(95deg, #2d69ef 0%, #46a9ff 72%, #2d69ef 100%);
    border-radius: 12px 12px 12px 12px;
  }
  .accountBottom {
    box-sizing: border-box;
    width: 100%;
    min-height: 500px;
    padding: 10px 8px 20px 8px;
    margin-top: -20px;
    background: #ffffff;
    border-radius: 12px 12px 5px 5px;
    .accountList {
      display: flex;
      justify-content: space-between;
      height: 48px;
      padding: 0 10px;
      font-size: 14px;
      line-height: 48px;
      color: #333333;
      border-bottom: 1px solid #f1f1f1;
    }
  }
}
</style>
