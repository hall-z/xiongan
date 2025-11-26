<route lang="json5" type="page">
{
  layout: 'default',
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
import { useUserStore } from '@/store'
import { dataDesensitization } from '@/utils'
const { userInfo } = useUserStore()
const title = ref('待遇资格认证')
const zgrz = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/2a562ce5-1049-4e50-a629-4ea5c5ebf445zgrz.png',
)
const goBack = () => {
  uni.navigateBack()
}
</script>

<template>
  <view class="">
    <dy-navbar :leftTitle="title" left></dy-navbar>
    <view>
      <wd-img :src="zgrz" width="100%" height="220px"></wd-img>
    </view>
    <view class="px-15px py-10px">
      <wd-cell-group>
        <wd-cell
          title="姓名"
          :value="dataDesensitization(userInfo.cardName, false, 'userName')"
        ></wd-cell>
        <wd-cell
          title="社会保障号码"
          :value="dataDesensitization(userInfo.idCardNumber, false, 'last')"
        ></wd-cell>
      </wd-cell-group>
    </view>
    <view class="px-10px">
      <wd-divider dashed></wd-divider>
    </view>

    <view class="p-15px">
      <view class="color-#FF0000 line-height-24px font-size-14px">
        *尚无您的待遇认证信息，无需进行待遇资格认证。如有异议，请与您的领取待遇地经办机构联系。
      </view>
    </view>
    <view class="px-15px">
      <wd-button block custom-class="bg-#2D69EF! rounded-4px!  " @click="goBack">返回</wd-button>
    </view>
    <view class="px-15px mt-15px">
      <view class="color-#666 line-height-24px font-size-14px mb-10px">温馨提示：</view>
      <view class="color-#666 line-height-24px font-size-14px mb-10px">
        1.支持全国范围内养老保险待遇领取人员和工伤保险待遇领取人员进行待遇资格认证。
      </view>
      <view class="color-#666 line-height-24px font-size-14px mb-10px">
        (1)养老保险待遇领取人员包括:企业职工养老保险退休人员、机关事业单位养老保险退休人员、城乡居民养老保险领取待遇人员、养老保险供养亲属。
      </view>
      <view class="color-#666 line-height-24px font-size-14px mb-10px">
        (2)工伤保险待遇领取人员包括:一至四级按月领取伤残津贴的工伤职工、因工死亡职工供养亲属。2.社保待遇资格认证时间和频次请以各地政策要求为准
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
