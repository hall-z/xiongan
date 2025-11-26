<script lang="ts" setup>
import { Constant } from '@/enums/constant'
import realName from '@/pages-sub/serveMain/hooks/appRealname'
import { getLoginAlKey, getUserIdKey } from '@/service/api/auth'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { startFacialRecognitionVerify, useStartAPVerify } from '@/utils/uniapi'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { useMessage } from 'wot-design-uni'
import useCardApply from '../hooks/useCardApply'
import { data as dataInfo } from '../types/data'

const { userInfo } = storeToRefs(useUserStore())

const { send: sendUserIdKey, onComplete } = useRequest((data) => getUserIdKey(data), {
  immediate: false,
  loading: false,
})

onComplete(() => {
  isLiving.value = false
})

onMounted(async () => {
  showData.value = dataInfo[0]
})

const message2 = useMessage('wd-message-box-slot')
const { read } = useCardApply()

const showData = ref<any>({})
function toAgereement(type) {
  routeTo({
    url: '/pages-sub/webView/index',
    data: { type: '1710488285782016019', showTop: 1, title: '申领须知' },
  })
}
function btnClick(item) {
  if (!read.value) {
    message2
      .confirm({
        closeOnClickModal: false,
        title: '提示',
        confirmButtonText: '同意并办理',
      })
      .then(() => {
        read.value = true
        toApply(item)
      })
      .catch(() => {
        uni.navigateBack()
      })
  } else {
    toApply(item)
  }
}

const isLiving = ref(false)

async function toApply(item) {
  livingDetection(item)
}
const { send: sendGetLoginAlKey } = useRequest((data) => getLoginAlKey(data), {
  immediate: false,
  loading: false,
})
// 活体检测
const livingDetection = async (item) => {
  // #ifdef MP-WEIXIN

  const newData = {
    appKey: Constant.APP_KEY,
    name: userInfo.value.cardName,
    idCardNumber: userInfo.value.idCardNumber,
    type: 1,
    terminal: Constant.TERMINAL,
  }
  // 获取key
  uni.showLoading({ title: '加载中', mask: true })
  isLiving.value = true
  try {
    const { userIdKey }: any = await sendUserIdKey(newData)

    const verifyData = {
      name: userInfo.value.cardName,
      idCardNumber: userInfo.value.idCardNumber,
      userIdKey,
    }

    // 用key 验证
    // isLiving.value = true
    startFacialRecognitionVerify(verifyData)
      .then((res: any) => {
        const verifyResult = res.verifyResult

        uni.hideLoading()
        isLiving.value = false

        if (verifyResult) {
          routeTo({
            url: '/pages-sub/serveMain/cardApplyFromType',
            data: item.data,
          })
        }
      })
      .catch((error) => {
        uni.hideLoading()
        isLiving.value = false
        console.log('error', error)
      })
  } catch (err) {
    uni.hideLoading()
    isLiving.value = false
    console.log('error', err)
  }
  // #endif
  // #ifdef MP-ALIPAY
  const paramsAl = {
    cardName: userInfo.value.cardName,
    cardCode: userInfo.value.idCardNumber,
  }
  const datas: any = await sendGetLoginAlKey(paramsAl)
  const { result: response } = (await useStartAPVerify({
    url: datas.body,
    certifyId: datas.certify_id,
  })) as { result: any }
  if (response.certifyId) {
    routeTo({
      url: '/pages-sub/serveMain/cardApplyFromType',
      data: item.data,
    })
  }
  uni.hideLoading()
  isLiving.value = false
  // #endif

  // #ifdef APP-PLUS
  // 用key 验证
  isLiving.value = true

  function fun(e) {
    if (e) {
      routeTo({
        url: '/pages-sub/serveMain/cardApplyFromType',
        data: item.data,
      })
      uni.hideLoading()
      isLiving.value = false
    } else {
      isLiving.value = false
      uni.hideLoading()
      console.log('error', error)
    }
  }

  await realName(fun)

  // #endif
}

const footerBtns = ref([
  {
    text: '代未成年人申领',
    size: 'medium',
    index: 1,
    round: false,
    plain: true,
    customClass: 'btn-class',
    disabled: false,
    isPeople: false,
    data: { base: 'xinshenersl', title: '代未成年人申领' },
  },
])

watch(
  () => isLiving.value,
  (val) => {
    footerBtns.value[0].disabled = val
  },
  {
    immediate: true,
  },
)

const isApply = ref(null)

const value = ref()
</script>
<template>
  <view class="p-15px pageCon">
    <view class="text-center color-#000 font-bold line-height-60px text-20px">
      {{ showData.title }}
    </view>
    <view class="levelOne">1、免责声明：</view>
    <view class="pText">
      雄安新区社保一卡通小程序是快速办理居民服务一卡通社保卡的服务渠道，请确保本人操作，自愿提供真实、有效的个人信息，用于居民服务一卡通社保卡申领业务，个人信息将仅用于居民服务一卡通社保卡申领流程，并严格按照相关法律法规保护您的个人信息安全。
    </view>
    <view class="levelOne">2、办理条件：</view>
    <view class="pText">未领取雄安一卡通的雄安新区户籍或在雄安新区就业参保的中国公民。</view>
    <view class="levelOne">3、所需资料：</view>
    <view class="tipText">本人办理：</view>
    <view class="pText">（1）本人身份证照片：本人身份证国徽面、人像面照片。</view>
    <view class="pText">（2）制卡照片：需上传个人照片，作为社保卡的证件照片。</view>
    <view class="tipText">代未成年子女办理：</view>
    <view class="pText">（1）代办人身份证照片：代办人身份证国徽面、人像面照片。</view>
    <view class="pText">
      （2）申领人证件照片：申领人身份证国徽面、人像面照片，或者代办人户口本首页、本人页户口本照片。
    </view>
    <view class="pText">
      （3）制卡照片：需上传个人照片，作为社保卡的证件照片（7周岁以下儿童可不上传照片，系统将自动采用默认头像）。
    </view>
    <view class="tipText">补换办理：</view>
    <view class="pText">（1）本人身份证照片：本人身份证国徽面、人像面照片。</view>
    <view class="pText">（2）制卡照片：需上传个人照片，作为新社保卡的证件照片。</view>
    <view class="pText">（3）在雄安一卡通申领社保卡6个月以内不允许本人社保卡补换。</view>
    <!-- <view v-for="(item, index) in showData.list" :key="index">
      <wd-text color="#000" custom-class="custom-text" :text="item"></wd-text>
      <wd-gap bg-color="#ffffff"></wd-gap>
    </view> -->

    <!-- 底部 -->
    <view class="fixed bottom-3 left-0 right-0 w-full bg-#fff">
      <view class="px-20px pt-6 pb-1">
        <view class="">
          <wd-checkbox custom-label-class="label-class" v-model="read" size="large">
            我已阅读并同意以上内容，并接受
            <text class="color-#4d80f0" @click.stop="toAgereement(5)">
              《雄安一卡通申领业务须知协议》
            </text>
            协议
          </wd-checkbox>
        </view>
        <view class="mt-20px">
          <view class="flex-1" v-for="(item, index) in footerBtns" :key="index">
            <wd-button
              :disabled="item.disabled"
              :round="item.round"
              :size="item.size"
              :type="item.type"
              block
              @click="btnClick(item)"
            >
              {{ item.text }}
            </wd-button>
          </view>
        </view>
      </view>
    </view>
  </view>
  <wd-message-box selector="wd-message-box-slot">
    我已阅读并同意以上内容，并接受
    <text class="color-#4d80f0" @click.stop="toAgereement">《雄安一卡通补换卡业务须知协议》</text>
  </wd-message-box>
  <wd-message-box></wd-message-box>
</template>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>
<style lang="scss" scoped>
:deep(.custom-text) {
  @apply mb-10px!;
}
:deep(.wd-checkbox) {
  @apply flex!;
}
:deep(.wd-checkbox__shape) {
  @apply w-26px!;
}

:deep(.label-class .wd-checkbox__txt) {
  @apply whitespace-pre-wrap!;
}
.pageCon {
  box-sizing: border-box;
  height: calc(100vh - 180px);
  padding-bottom: 40px;
  overflow-y: auto;
}
.levelOne {
  font-size: 16px;
  font-weight: bold;
  line-height: 28px;
  color: #333;
}
.pText {
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 24px;
  color: #555;
  text-indent: 2em;
}
.tipText {
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
  color: #555;
  text-indent: 2em;
}
</style>
