<route lang="json5">
{
  layout: 'default',
  needLogin: true,
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
import { isRouterCheckd } from '@/interceptors/route'
import { useUserStore } from '@/store'
import { loginModal, routeTo } from '@/utils'
import { storeToRefs } from 'pinia'
import useIndex from './utils/useIndex'

const { isLogined, userInfo, isRealSataus } = storeToRefs(useUserStore())

const { thirdPartyId } = useIndex()

async function serveClick(item: any) {
  if (item.type && item.type === 'YHlocal') {
    routeTo({
      url: item.path,
    })
  } else {
    if (isLogined.value) {
      item.path = item.path.replace('XXX', thirdPartyId.value)
    } else {
      loginModal()
      return
    }
    if (!isRealSataus.value) {
      isRouterCheckd({})
      return
    }
    routeTo({
      url: '/pages-sub/webView/index',
      data: {
        showType: 'webView',
        url: item.path,
      },
    })
  }
}

const list = [
  {
    icon: 'https://oss.xay.xacloudy.cn/images/2025-04/1262423f-b580-4459-bdf9-4c239d396432社保参保证明查询@2x.png',
    title: '企业参保证明',
    path: 'https://he.12333.gov.cn/ggfw-h5-funcs-ddpt.html#/third-party?code=XXX&state=xawxprogram&target=pdfdy/other/qycbzm',
  },
  {
    icon: 'https://oss.xay.xacloudy.cn/images/2025-04/326cdfeb-a398-477a-9094-55be8eeabb4c机关@2x.png',
    title: '机关参保证明',
    path: 'https://he.12333.gov.cn/ggfw-h5-funcs-ddpt.html#/third-party?code=XXX&state=xawxprogram&target=pdfdy/other/jgcbzm',
  },
  {
    icon: 'https://oss.xay.xacloudy.cn/images/2025-04/efaf4908-334e-49fd-b61b-77783cf95ab4养老@2x.png',
    title: '城乡养老参保证明',
    // path: 'https://he.12333.gov.cn/ggfw-h5-funcs-ddpt.html#/third-party?code=XXX&state=xawxprogram&target=shbz/cx/yang-lao',
    path: 'https://he.12333.gov.cn/ggfw-h5-funcs-ddpt.html#/third-party?code=XXX&state=xawxprogram&target=pdfdy/other/cxylcbzm',
  },
]
</script>
<template>
  <view class="size-100% fixed top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1] dy-blue-bg"></view>

  <!-- 顶部 -->
  <dy-navbar leftTitle="参保证明" left isNavShow color="#000"></dy-navbar>
  <view class="p-30rpx mt-40rpx relative">
    <view class="">
      <view v-for="(item, index) in list" :key="index" class="FHcs items" @click="serveClick(item)">
        <view class="FHcl">
          <wd-img :src="item.icon" width="100rpx" height="100rpx" mode="aspectFit"></wd-img>
          <view class="name">{{ item.title }}</view>
        </view>

        <wd-icon name="arrow-right" size="16px" color="#888"></wd-icon>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.items {
  padding: 10px 15px;
  margin-bottom: 15px;
  background: #fff;
  border-radius: 10px;

  .name {
    margin-left: 15px;
    font-size: 16px;
    line-height: 25px;
    color: #333333;
  }
}
</style>
