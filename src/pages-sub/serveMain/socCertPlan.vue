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
import { dataDesensitization } from '@/utils'
import dayjs from 'dayjs'
import { useMessage, useToast } from 'wot-design-uni'
import SocCertFace from './components/SocCertFace.vue'
import realName from './hooks/appRealname'
import { CERT_STATE, MSG_SCRIPT, sendCertPlanData, sendCertResultData } from './hooks/useSocCert'
const toast = useToast()

const navTitle = ref('认证计划')

const socBanner = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/c7c84d3a-b32b-4f0c-95da-26842218bb62g3zNhjst2UeR4c1738002afbc1da29830a8aba8e3442.png',
)

const listShow = ref(true)
const name = ref('')
const idCardNum = ref('')
const type = ref('')
const phoneNumber = ref('')
const familyRelation = ref('')
const planid = ref('')
const idCardNumTm = ref('')

const paging = ref(null)
const planList = ref([])

const queryList = async (pageNo: number, pageSize: number) => {
  const params = {
    pageNo: pageNo - 1,
    pageSize,
    idcard: idCardNum.value,
    status: '0',
  }
  // 调用接口获取数据
  try {
    const data: any = await sendCertPlanData(params)
    paging.value.complete(data.content)
  } catch (error) {
    toast.show(MSG_SCRIPT.fail)
    paging.value.complete(false)
  }
}

const certResult = reactive({
  certDate: '-',
  certProvider: '-',
})
const msgBoxRequ = useMessage('box-not-require')

const queryCertResult = async (item) => {
  const params = {
    name: name.value,
    idcard: idCardNum.value,
    // planId: item.planId,
    planid: item.idPlanId,
  }
  planid.value = item.idPlanId
  const data = (await sendCertResultData(params)) as any
  console.log('CertResultData', data)

  const { recordIdDate, recordProvider, recordReuse } = data

  if (recordReuse === '1') {
    // 可复用
    certResult.certDate = recordIdDate
    certResult.certProvider = recordProvider

    msgBoxRequ
      .alert({
        title: '提示',
        closeOnClickModal: false,
        confirmButtonText: '返回',
        confirmButtonProps: {
          // round: false,
          // block: false,
        },
      })
      .then((res) => {
        paging.value.reload()
      })
  } else {
    // 需要认证
    console.log('🥒----')
    // #ifdef MP-WEIXIN
    listShow.value = false // 打开人脸
    // #endif
    // #ifdef APP-PLUS
    // 用key 验证

    // function fun(e) {
    // 	if (e) {
    // 		console.log('SUCCESS', e)
    // 		routeTo({
    // 			url: '/pages-sub/serveMain/socCertPlan',
    // 			data: item.data,
    // 		})
    // 		uni.hideLoading()
    // 	} else {
    // 		uni.hideLoading()
    // 		console.log('error', error)
    // 	}
    // }

    // console.log('realName')

    // await realName(fun)

    listShow.value = false

    // #endif
  }
}
// watch(
//   () => listShow.value,
//   (newVal) => {
//     if (newVal) {
//       uni.showLoading({
//         title: '处理中...',
//       })
//     }
//   },
// )
onLoad((options) => {
  name.value = decodeURIComponent(options.name)
  idCardNum.value = decodeURIComponent(options.idCardNum)
  idCardNumTm.value = dataDesensitization(options.idCardNum, false, 'last')
  type.value = decodeURIComponent(options.type)
  phoneNumber.value = decodeURIComponent(options.phoneNumber)
  familyRelation.value = decodeURIComponent(options.familyRelation)
})
onShow(() => {
  console.log('🍜show----- 111')
  listShow.value = true
  // setTimeout(() => {
  //   listShow.value = true
  //   // paging.value && paging.value.reload()
  // }, 3000)
})
</script>

<template>
  <view class="box-border pt-40rpx dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <!-- 列表部分 -->
    <view class="h-100%">
      <z-paging
        class="h-100%"
        ref="paging"
        v-model="planList"
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
            class="w-100% mb-24rpx bg-#f5f9ff rounded-10rpx border-2rpx border-solid border-color-#d8e8fc"
            v-for="(item, index) in planList"
            :key="index"
          >
            <view
              class="flex justify-between items-center pt-16rpx pr-20rpx pl-36rpx pb-16rpx border-b-2rpx border-b-solid border-color-#d8e8fc"
            >
              <text class="h-48rpx lh-48rpx font-bold font-size-26rpx color-#000000">
                {{ item.idPlanName }}
              </text>
              <wd-button size="small" @click="queryCertResult(item)">立即认证</wd-button>
            </view>
            <view class="pt-22rpx pr-24rpx pb-22rpx pl-36rpx">
              <view class="flex lh-48rpx font-size-27rpx">
                <text class="w-190rpx text-right color-#777">认证计划编号：</text>
                <text class="color-#232323">{{ item.idPlanId }}</text>
              </view>
              <view class="flex lh-48rpx font-size-27rpx">
                <text class="w-190rpx text-right color-#777">认证时间：</text>
                <text class="color-#232323">
                  {{ dayjs(item.idPlanStart).format('YYYY-MM-DD') }}-{{
                    dayjs(item.idPlanEnd).format('YYYY-MM-DD')
                  }}
                </text>
              </view>
              <view class="flex lh-48rpx font-size-27rpx">
                <text class="w-190rpx text-right color-#777">认证状态：</text>
                <text class="color-#4075eb">{{ CERT_STATE['state_' + item.idStatus] }}</text>
              </view>
            </view>
          </view>
        </view>
      </z-paging>
    </view>
    <!-- 认证部分 -->
    <SocCertFace
      :name="name"
      :idCardNum="idCardNum"
      :planid="planid"
      :type="type"
      :phoneNumber="phoneNumber"
      :familyRelation="familyRelation"
      :isStart="!listShow"
    ></SocCertFace>
  </view>
  <!-- 无需认证弹层 -->
  <wd-message-box selector="box-not-require" class="text-center">
    <view class="pt-38rpx pb-30rpx">
      <view class="lh-48rpx text-center font-size-30rpx color-#000">
        系统检测到您在“ {{ dayjs(certResult.certDate).format('YYYY-MM-DD HH:mm:ss') }}”已经通过“{{
          certResult.certProvider
        }}”进行过认证,
        <text class="color-#2d69ef">本次无需重复认证。</text>
      </view>
    </view>
  </wd-message-box>
</template>

<style lang="scss" scoped></style>
