<script lang="ts" setup>
import { getLoginAlKey } from '@/service/api/auth'
import { useUserStore } from '@/store'
import { dataDesensitization, routeTo } from '@/utils'
import { useStartAPVerify } from '@/utils/uniapi'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { useToast } from 'wot-design-uni'
import realName from '../hooks/appRealname'
import { loading, sendPreserRecords, sendWxCertData } from '../hooks/useSocCert'
const toast = useToast()
const { userInfo } = storeToRefs(useUserStore())

const emit = defineEmits<{
  (e: 'loginResult', value: any): void
}>()
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  idCardNum: {
    type: String,
    default: '',
  },
  planid: {
    type: String,
    default: '',
  },
  familyRelation: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  isStart: {
    type: Boolean,
    default: false,
  },
})

const socFace = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/becbf46f-0899-4246-a1ea-9ecd1b0da412t9bxFdN0YAnP08e90174a87babf2a47600dfd9862801.png',
)
const socSucc = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/90178f56-7651-4fa2-8084-e1a1a3d8a2cbgJ3aCpCImyeB7e40f31ff0dafe2a2d26dabba321693d.png',
)
const socFail = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/0dd96dae-ae02-4d68-b895-b53067689e912AV1aLNJwtvGf7d4ae724b6c97cec0d3fd82fac5c9c5.png',
)

const isAgree = ref<boolean>(true)
const certState = ref<number>(0)
const certData = reactive({
  name: '',
  idCardNum: '-',
  idCardNumTm: '-',
  certDate: '-',
  id: '-',
  certMethod: '-',
  certProvider: '-',
})

const viewAuthNotice = () => {
  routeTo({
    url: '/pages-sub/webView/index',
    data: { type: '1710488285782016019', showTop: 1, title: '用户授权书' },
  })
}
const { send: sendGetLoginAlKey } = useRequest((data) => getLoginAlKey(data), {
  immediate: false,
  loading: false,
})
const startCert = async () => {
  // if (!isAgree.value) {
  //   toast.show('请您勾选同意用户授权书')

  //   return false
  // }

  // if (!props.name || !props.idCardNum) {
  //   toast.show('未获得用户数据，请刷新重试')

  //   return false
  // }
  // #ifdef MP-WEIXIN
  uni.checkIsSupportSoterAuthentication({
    success: (res) => {
      wx.startFacialRecognitionVerify({
        name: props.name,
        idCardNumber: props.idCardNum,
        checkAliveType: 2,
        success: (res) => {
          getWxCert(res.verifyResult)
          console.log('人脸识别结果：succ', res)
        },
        fail: (err) => {
          certState.value = 2
          console.log('人脸识别结果：fail', err)
        },
      })
    },
    fail: (err) => {
      toast.show('您的设备不支持人脸认证')
      console.log('不支持生物认证', err)
    },
  })

  // #endif
  // #ifdef MP-ALIPAY
  const paramsAl = {
    cardName: props.name,
    cardCode: props.idCardNum,
  }
  const datas: any = await sendGetLoginAlKey(paramsAl)
  const { result: response } = (await useStartAPVerify({
    url: datas.body,
    certifyId: datas.certify_id,
  })) as { result: any }
  if (response.certifyId) {
    getWxCert(response.verifyResult)
  }

  // #endif

  // #ifdef APP-PLUS
  await realName(getWxCert)

  // #endif
}

const getWxCert = (verifyResult) => {
  console.log('人脸识别结果verifyResult：', verifyResult)
  const params = {
    verifyResult,
  }
  loading.value = true
  sendWxCertData(params)
    .then((res) => {
      console.log('人脸识别结果：', res)
      fillCertData(res)
    })
    .catch((err) => {
      toast.show(err)
    })
}

const fillCertData = async (data) => {
  const params = {
    idcard: props.idCardNum,
    name: props.name,
    planid: props.planid,
    currentIdCardNumber: userInfo.value.idCardNumber,
    currentUserId: userInfo.value.userDId,
    phone: props.phoneNumber, // 页面填的手机号,
    type: props.type === '0' ? 1 : 2, // 类型 1-自己认证 2-给他人认证
    relation: props.familyRelation, // 1-父母 2-配偶 3-子女 4-其他
  }

  await sendPreserRecords(params)
    .then((res: any) => {
      certData.name = res.name
      certData.idCardNum = res.idcard
      certData.idCardNumTm = dataDesensitization(res.idcard, false, 'last')
      certData.id = res.recordId
      loading.value = false

      // certState.value = 1
      console.log('认证记录保存', res)
      routeTo({
        url: '/pages-sub/serveMain/SocCertFacSucess',
        data: {
          ...certData,
        },
      })
    })
    .catch((err) => {
      loading.value = false
      console.log('err', err)
      // toast.show(err)
    })
}

const logout = () => {
  routeTo({
    url: '/pages-sub/serveMain/socCertInfo',
    data: {
      title: '资格认证',
      name: props.name,
      idCardNum: props.idCardNum,
    },
  })
}

const viewCertRecord = () => {
  routeTo({
    url: '/pages-sub/serveMain/socCertRecord',
    data: {
      name: props.name,
      idCardNum: props.idCardNum,
    },
  })
}

const retryCert = () => {
  certState.value = 0
}

watch(
  () => props.isStart,
  () => {
    if (props.isStart) {
      console.log('开始实名认证')
      startCert()
    }
  },
  { deep: true },
)
</script>

<template>
  <!-- 页面不需要显示-- -->
  <!-- 验证提示 -->
  <view class="pt-50rpx hidden">
    <view class="lh-54rpx text-center font-bold font-size-38rpx color-#000">为保障账户安全</view>
    <view class="mt-20rpx lh-42rpx text-center font-size-30rpx color-#8f8f8f">
      需采集你的人脸信息以核实身份
    </view>
    <view class="flex justify-center mt-20rpx">
      <img :src="socFace" alt="人脸认证" class="w-465rpx h-469rpx" />
    </view>
    <view class="mt-50rpx pl-70rpx pr-40rpx">
      <view class="flex items-center">
        <wd-icon class="mr-12rpx color-#2d69ef" name="check-circle-filled" size="28rpx"></wd-icon>
        <text class="lh-64rpx font-size-30rpx color-#000000">请正对屏幕并使脸位于取景框内</text>
      </view>
      <view class="flex items-center">
        <wd-icon class="mr-12rpx color-#2d69ef" name="check-circle-filled" size="28rpx"></wd-icon>
        <text class="lh-64rpx font-size-30rpx color-#000000">
          请保持光线充足，避免光照过强或过弱
        </text>
      </view>
      <view class="flex items-center">
        <wd-icon class="mr-12rpx color-#2d69ef" name="check-circle-filled" size="28rpx"></wd-icon>
        <text class="lh-64rpx font-size-30rpx color-#000000">
          根据画面提示完成单个或多个动作检测
        </text>
      </view>
    </view>
    <view class="fixed right-0 bottom-0 left-0">
      <view class="flex items-start pr-80rpx pl-65rpx">
        <wd-checkbox class="mr-13rpx" v-model="isAgree"></wd-checkbox>
        <view class="lh-38rpx font-size-22rpx color-#999">
          同意雄安数字集团采集并使用人脸信息用于核实身份，
          <br />
          查看
          <text class="color-#2d69ef" @click="viewAuthNotice">《人脸识别服务用户授权书》</text>
        </view>
      </view>
      <view class="pt-40rpx pr-60rpx pb-50rpx pl-60rpx bg-#fff">
        <wd-button :round="false" block @click="startCert">开始人脸识别</wd-button>
      </view>
    </view>
  </view>
  <!-- 验证成功 -->
  <view class="pt-50rpx hidden">
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
        <text class="text-right color-#000">{{ certData.name }}</text>
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
    <view class="mt-120rpx pr-50rpx pl-50rpx">
      <view>
        <wd-button :round="false" block @click="logout">返回认证首页</wd-button>
      </view>
      <!-- <view class="mt-36rpx">
        <wd-button :round="false" plain block @click="viewCertRecord">查看历史认证记录</wd-button>
      </view> -->
    </view>
  </view>
  <!-- 验证失败 -->
  <view class="fixed w-100vw h-100vh top-0 left-0 bg-#fff hidden">
    <view class="flex justify-center pt-390rpx">
      <img :src="socFail" alt="提示信息" class="w-115rpx h-115rpx" />
    </view>
    <view class="mt-65rpx lh-54rpx text-center font-size-38rpx color-#000">
      人脸与身份信息不匹配
    </view>
    <view class="fixed right-0 bottom-0 left-0 pr-60rpx pb-50rpx pl-60rpx">
      <wd-button :round="false" block @click="retryCert">再试一次</wd-button>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>
