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
import { useMessage, useToast } from 'wot-design-uni'
import { sendGetCourseRegist } from '../hooks/useSchool'
import dayjs from 'dayjs'
import { useUserStore } from '@/store'
const toast = useToast()
const { userInfo } = useUserStore()
const navTitle = ref('我的报名信息')
const socIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-06/4df78b0d-949c-40cb-aa10-e594b1bdb3e4444.png',
)
const listShow = ref(true)

const paging = ref(null)
const planList = ref([])
const registType = ref(null)
async function queryList(pageNo: number, pageSize: number) {
  const params = {
    pageNo,
    pageSize,
    phone: '',
    createUserId: userInfo.userDId,
    registType: registType.value,
  }
  // 调用接口获取数据
  try {
    const data: any = await sendGetCourseRegist(params)

    console.log('data.content', data.content)
    paging.value.complete(data.content)
  } catch (error) {
    paging.value.complete(false)
  }
}

onLoad((options) => {
  registType.value = options.registType
})
</script>

<template>
  <view class="box-border pt-40rpx dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <!-- 列表部分 -->
    <view class="h-100%" v-show="listShow">
      <z-paging
        class="h-100%"
        ref="paging"
        v-model="planList"
        @query="queryList"
        :auto-show-system-loading="true"
      >
        <template #top>
          <view class="flex justify-between items-center pl-45rpx pr-40rpx pt-80rpx"></view>
        </template>
        <view class="pt-110rpx pl-28rpx pr-28rpx pb-20rpx rounded-t-30rpx">
          <view
            class="w-100% mb-24rpx bg-#f5f9ff rounded-10rpx border-2rpx border-solid border-color-#d8e8fc"
            v-for="(item, index) in planList"
            :key="index"
          >
            <view
              class="flex justify-between items-center pt-16rpx pr-20rpx pl-36rpx pb-16rpx border-b-2rpx border-b-solid border-color-#d8e8fc"
            >
              <view class="flex items-center">
                <img :src="socIcon" alt="" class="w-22px h-22px mr-10px" />
                <text
                  class="h-48rpx lh-48rpx font-bold font-size-16px color-#000000"
                  style="display: inline-flex"
                >
                  {{ item.courseUser }}
                </text>
              </view>
              <text class="color-#898989">{{ item.sex === 1 ? '男' : '女' }}/{{ item.age }}岁</text>
            </view>
            <view class="pt-22rpx pr-24rpx pb-22rpx pl-36rpx">
              <view class="flex lh-48rpx font-size-27rpx">
                <text class="w-90rpx text-right color-#777">课程：</text>
                <text class="color-#2D69EF">{{ item.courseTitle }}</text>
              </view>
              <view class="flex lh-48rpx font-size-27rpx">
                <text class="w-90rpx text-right color-#777">电话：</text>
                <text class="color-#232323">{{ item.phone }}</text>
              </view>
              <view class="flex lh-48rpx font-size-27rpx">
                <text class="w-90rpx text-right color-#777">地址：</text>
                <text class="color-#232323">{{ item.address }}</text>
              </view>
              <view class="flex lh-48rpx font-size-27rpx">
                <text class="w-90rpx text-right color-#777">备注：</text>
                <text class="color-#232323" style="display: inline-block; width: 82%">
                  {{ item.remark }}
                </text>
              </view>
            </view>
            <view
              class="flex j items-center font-size-27rpx pt-16rpx pr-20rpx pl-36rpx pb-16rpx border-t-2rpx border-t-solid border-color-#d8e8fc"
            >
              <text class="w-144rpx text-right color-#777">报名时间：</text>
              <text class="color-#232323">
                {{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}
              </text>
            </view>
          </view>
        </view>
      </z-paging>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
