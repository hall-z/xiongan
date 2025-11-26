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
import dayjs from 'dayjs'
import { useToast } from 'wot-design-uni'
import { CERT_STATE, MSG_SCRIPT, sendCertRecordData } from './hooks/useSocCert'
const toast = useToast()

const navTitle = ref('认证记录')

const socBanner = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/c7c84d3a-b32b-4f0c-95da-26842218bb62g3zNhjst2UeR4c1738002afbc1da29830a8aba8e3442.png',
)
const socRecordIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/032b8a9e-2d6b-4d6d-97a1-2c848fd0c4afh5d9vpqvfeTxf5cc25b85ff2e44fe9645c5a12dc136c.png',
)

const name = ref('')
const idCardNum = ref('')
const idCardNumTm = ref('')

const paging = ref(null)
const recordList = ref([])

const queryList = async (pageNo: number, pageSize: number) => {
  const params = {
    pageNo: pageNo - 1,
    pageSize,
    idcard: idCardNum.value,
  }

  // 调用接口获取数据
  try {
    const data: any = await sendCertRecordData(params)

    console.log('CertRecordData', data.content)
    paging.value.complete(data.content)
  } catch (error) {
    toast.show(MSG_SCRIPT.fail)
    paging.value.complete(false)
  }
}

const viewRecordDetail = (item) => {
  console.log('viewRecordDetail', item)
  routeTo({
    url: '/pages-sub/serveMain/socCertRecordDetail',
    data: {
      name: name.value,
      idCardNumTm: idCardNumTm.value,
      recordId: item.id,
      idDate: item.idDate,
    },
  })
}

onLoad((options) => {
  name.value = decodeURIComponent(options.name)
  idCardNum.value = decodeURIComponent(options.idCardNum)
  idCardNumTm.value = dataDesensitization(options.idCardNum, false, 'last')
})
</script>

<template>
  <view class="h-100vh box-border pt-40rpx dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <view class="h-100%">
      <z-paging
        class="h-100%"
        ref="paging"
        v-model="recordList"
        @query="queryList"
        :auto-show-system-loading="true"
      >
        <template #top>
          <view class="flex justify-between items-center h-211rpx pl-45rpx pr-40rpx pt-170rpx">
            <view class="flex flex-col">
              <text class="h-80rpx lh-80rpx font-bold font-size-56rpx color-#2d69ef">
                {{ dataDesensitization(name, false, 'userName') }}
              </text>
              <text class="h-48rpx lh-48rpx mt-5rpx font-size-34rpx color-#859ed4">
                {{ idCardNumTm }}
              </text>
            </view>
            <img :src="socBanner" alt="社保待遇资格认证" class="w-221rpx h-211rpx" />
          </view>
        </template>
        <view class="bg-#fff pt-38rpx pl-28rpx pr-28rpx pb-20rpx rounded-t-30rpx">
          <view
            class="flex mb-20rpx pt-25rpx pr-25rpx pb-25rpx pl-25rpx bg-#f7f7f7 rounded-10rpx"
            v-for="(item, index) in recordList"
            :key="index"
          >
            <view class="flex items-start w-100%" @click="viewRecordDetail(item)">
              <img :src="socRecordIcon" alt="认证记录" class="w-42rpx h-42rpx mr-12rpx" />
              <view class="flex-1">
                <view
                  class="flex justify-between pb-15rpx border-b-2rpx border-b-dotted border-color-#2e2e2e border-opacity-20"
                >
                  <text class="lh-42rpx font-size-30rpx color-#000">{{ item.idPlanName }}</text>
                  <view class="lh-42rpx color-#959595">
                    <wd-icon name="arrow-right" size="32rpx"></wd-icon>
                  </view>
                </view>
                <view class="flex justify-between mt-15rpx lh-38rpx font-size-27rpx">
                  <text class="color-#999">
                    认证时间：{{ dayjs(item.idDate).format('YYYY-MM-DD HH:mm:ss') }}
                  </text>
                  <!-- <text class="mr-12rpx color-#4fa106" v-if="item.idStatus == '1'"> -->
                  <text class="mr-12rpx color-#4fa106">
                    {{ CERT_STATE['state_1'] }}
                  </text>
                  <!-- <text class="mr-12rpx color-#e13232" v-else>
                    {{ CERT_STATE['state_' + item.idStatus] }}
                  </text> -->
                </view>
              </view>
            </view>
          </view>
        </view>
      </z-paging>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
