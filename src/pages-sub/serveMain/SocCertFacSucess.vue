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
import { dataDesensitization, routeTo } from '@/utils'

const socSucc = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/90178f56-7651-4fa2-8084-e1a1a3d8a2cbgJ3aCpCImyeB7e40f31ff0dafe2a2d26dabba321693d.png',
)

const navTitle = ref('认证结果')
const certData = ref({
  name: '',
  idCardNum: '-',
  idCardNumTm: '-',
  certDate: '-',
  id: '-',
  certMethod: '-',
  certProvider: '-',
})

const logout = () => {
  routeTo({
    url: '/pages-sub/serveMain/socCertInfo',
    data: {
      title: '资格认证',
      name: certData.value.name,
      idCardNum: certData.value.idCardNum,
    },
  })
}

const viewCertRecord = () => {
  routeTo({
    url: '/pages-sub/serveMain/socCertInfo',
    data: {
      title: '资格认证',
      name: certData.value.name,
      idCardNum: certData.value.idCardNum,
    },
  })
}
onLoad((options) => {
  certData.value = Object.assign(certData.value, options)
  for (const key in certData.value) {
    if (certData.value[key]) {
      certData.value[key] = decodeURIComponent(certData.value[key])
    }
  }
})
</script>

<template>
  <view class="h-100vh box-border pt-40rpx dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <!-- 验证成功 -->
    <view class="pt-50rpx">
      <view class="flex justify-center">
        <img :src="socSucc" alt="提示信息" class="w-229rpx h-197rpx" />
      </view>
      <view class="mt-26rpx lh-54rpx text-center font-bold font-size-38rpx color-#000">
        认证成功！
      </view>
      <view class="mt-11rpx lh-42rpx text-center font-size-30rpx color-#000">
        您已完成本次资格认证
      </view>
      <view class="mt-65rpx mr-32rpx ml-32rpx p-36rpx rounded-20rpx bg-#fff">
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">认证结果</text>
          <text class="text-right color-#19a52b">已通过</text>
        </view>
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">姓名</text>
          <text class="text-right color-#000">
            {{ dataDesensitization(certData.name, false, 'userName') }}
          </text>
        </view>
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">身份证号</text>
          <text class="text-right color-#000">{{ certData.idCardNumTm }}</text>
        </view>
        <!-- <view class="flex justify-between lh-76rpx font-size-27rpx">
        <text class="w-200rpx color-#777">认证时间</text>
        <text class="text-right color-#000">{{ certData.certDate }}</text>
      </view> -->
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">认证记录编号</text>
          <text class="text-right color-#000">{{ certData.id }}</text>
        </view>
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">识别方法</text>
          <!-- <text class="text-right color-#000">{{ certData.certMethod }}</text> -->
          <text class="text-right color-#000">人脸识别</text>
        </view>
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">认证服务提供方</text>
          <text class="text-right color-#000">雄安一卡通</text>
          <!-- <text class="text-right color-#000">{{ certData.certProvider }}</text> -->
        </view>
      </view>
      <view class="mt-70rpx px-50rpx">
        <view>
          <wd-button :round="false" block @click="logout">返回认证首页</wd-button>
        </view>
        <!-- <view class="mt-10px">
          <wd-button :round="false" plain block @click="viewCertRecord">查看历史认证记录</wd-button>
        </view> -->
      </view>
    </view>
  </view>
</template>
