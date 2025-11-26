<script lang="ts" setup>
import { calculateAgeByIdCard, routeTo } from '@/utils'
import { data as dataInfo } from '../types/data'

import { Constant } from '@/enums/constant'
import { getLoginAlKey, getUserIdKey } from '@/service/api/auth'
import { promotionDateStore, useUserStore } from '@/store'
import { startFacialRecognitionVerify, useStartAPVerify } from '@/utils/uniapi'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { useMessage } from 'wot-design-uni'
import realName from '../hooks/appRealname'
import useCardApply from '../hooks/useCardApply'

const { promotionDate } = storeToRefs(promotionDateStore())
const { userInfo } = storeToRefs(useUserStore())
onMounted(async () => {
  showData.value = dataInfo[0]
  uni.hideLoading()
})
onShow(() => {
  uni.hideLoading()
})
const props = defineProps({
  applyType: {
    type: String,
  },
})
const message = useMessage('wd-message-box-slot')
const message2 = useMessage()
const { sendCardQury } = useCardApply()
const read = ref(false)
const showData = ref<any>({})

function toAgereement(type) {
  routeTo({
    url: '/pages-sub/webView/index',
    data: { type: '1710488285782016019', showTop: 1, title: '申领须知' },
  })
}

async function btnClick(item) {
  if (ages.value >= 0 && ages.value < 16 && item.text !== '代未成年人申领') {
    message2.alert({
      msg: '16周岁以下未成年人申办社保卡 必须由监护人进行代办申领！',
      title: '注意',
    })
  } else {
    if (!read.value) {
      message
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
}

const serchData = ref({
  xm: userInfo.value.cardName,
  zjhm: userInfo.value.idCardNumber,
  zjlx: '1',
  zkType: '1',
  wdcode: '999-130632004',
  areaCode: 'CHN',
})

async function toApply(item) {
  isLiving.value = true
  if (item.index === 1) {
    try {
      const temp = null

      const serchData2 = ref({
        xm: userInfo.value.cardName,
        zjhm: userInfo.value.idCardNumber,
        zjlx: '1',
        zkType: '1',
        wdcode: '999-130632004',
        areaCode: 'CHN',
      })

      const resultCode = (await sendCardQury(serchData2.value)) as any

      isApply.value = resultCode?.data?.resultCode
      if (isApply.value === '0') {
        message2
          .confirm({
            // msg: '您已申领过一卡通，请勿重复申请',
            msg: '您已申领过河北社会保障卡，请确认是否进行社保卡补换',
            title: '提示',
            closeOnClickModal: false,
          })
          .then(() => {
            console.log('点击了确定按钮')
            if (promotionDate.value) {
              routeTo({
                url: '/pages-sub/serveMain/cardApplyType',
                data: {
                  base: 'shebaokbh',
                  title: '社保卡补换',
                  id: promotionDate.value,
                  promoterType: promotionDate.value.promoterType,
                },
              })
            } else {
              routeTo({
                url: '/pages-sub/serveMain/cardApplyType',
                data: { base: 'shebaokbh', title: '社保卡补换' },
              })
            }
          })
          .catch(() => {
            uni.navigateBack()
          })
      } else {
        livingDetection(item)
        // routeTo({
        //   url: '/pages-sub/serveMain/cardApplyFromType',
        //   data: item.data,
        // })
      }
    } catch (error) {
      const isApply = error?.data?.code
      if (isApply === '500') {
        message2
          .confirm({
            msg: '申领资格查找失败，请联系管理员！',
            title: '提示',
          })
          .then(() => {
            console.log('点击了确定按钮')

            uni.navigateBack()
          })
          .catch(() => {
            console.log('点击了取消按钮')
            uni.navigateBack()
          })
      } else {
        livingDetection(item)
        // routeTo({
        //   url: '/pages-sub/serveMain/cardApplyFromType',
        //   data: item.data,
        // })
      }
    }
  } else if (item.index === 0) {
    livingDetection(item)
  }
}

const { send: sendUserIdKey, onComplete } = useRequest((data) => getUserIdKey(data), {
  immediate: false,
  loading: false,
})

onComplete(() => {
  isLiving.value = false
})
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

  uni.showLoading({ title: '加载中', mask: true })

  // 获取key
  const { userIdKey }: any = await sendUserIdKey(newData)
  console.log(userIdKey)

  const verifyData = {
    name: userInfo.value.cardName,
    idCardNumber: userInfo.value.idCardNumber,
    userIdKey,
  }

  // 用key 验证
  isLiving.value = true
  startFacialRecognitionVerify(verifyData)
    .then((res: any) => {
      const verifyResult = res.verifyResult
      if (verifyResult && (item.index === 0 || item.index === 1)) {
        routeTo({
          url: '/pages-sub/serveMain/cardApplyFromType',
          data: item.data,
        })
      }
      uni.hideLoading()
      isLiving.value = false
    })
    .catch((error) => {
      uni.hideLoading()
      isLiving.value = false
      console.log('error', error)
    })
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
    type: 'info',
    size: 'medium',
    round: false,
    plain: true,
    isRead: true,
    isApply: false,
    isPeople: true,
    disabled: false,
    index: 0,
    customClass: 'custom-class-mine-dyinfo',
    data: { base: 'xinshenersl', title: '代未成年人申领' },
  },
  {
    text: '本人办理',
    size: 'medium',
    round: false,
    isRead: true,
    isApply: false,
    isPeople: false,
    disabled: false,
    index: 1,
    data: { base: 'shebaoksl', title: '社保卡申领信息' },
  },
])

const isLiving = ref(false)

watch(
  () => isLiving.value,
  (val) => {
    footerBtns.value[0].disabled = val
    footerBtns.value[1].disabled = val
  },
  {
    immediate: true,
  },
)

const isFirstEnter = ref(true)
const isApply = ref(null)
const ages = ref(null)
onMounted(async () => {
  ages.value = calculateAgeByIdCard(userInfo.value.idCardNumber)
  console.log('wowowowowo', ages.value)

  if (isFirstEnter.value) {
    // 如果isFirstEnter为true，表示这是第一次进入页面
    console.log('页面初次进入')
    isFirstEnter.value = false // 更新标志，后续的onShow不再是初次进入
    read.value = false
  } else {
    // 如果isFirstEnter为false，表示这是返回进入页面
    console.log('页面返回进入')
    // read.value = false
  }
})
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
      <wd-text color="#555555" custom-class="custom-text" :text="item" size="16px"></wd-text>
      <wd-gap bg-color="#fff"></wd-gap>
    </view> -->

    <!-- 底部 -->
    <view class="fixed bottom-3 left-0 right-0 w-full bg-#fff">
      <view class="px-20px pt-6 pb-1">
        <!--        <view class="flex gap-10px">-->
        <!--          <wd-checkbox v-model="read" prop="read" custom-label-class="label-class"></wd-checkbox>-->
        <!--          <view class="text-12px color-#A6A6A6">-->
        <!--            <text @click="read = !read">未注册账号验证后自动注册并登录，登录即表示同意</text>-->
        <!--            <text-->
        <!--              class="color-#336EFD"-->
        <!--              @click.stop="toAgreement('1710488285782016005', '隐私政策')"-->
        <!--            >-->
        <!--              《隐私政策》、-->
        <!--            </text>-->
        <!--            <text-->
        <!--              class="color-#336EFD"-->
        <!--              @click.stop="toAgreement('1710488285782016006', '用户协议')"-->
        <!--            >-->
        <!--              《用户协议》-->
        <!--            </text>-->
        <!--          </view>-->
        <!--        </view>-->
        <view class="flex">
          <wd-checkbox v-model="read" custom-label-class="label-class" size="large">
            <text>
              我已阅读并同意以上内容，并接受
              <text class="color-#4d80f0" @click.stop="toAgereement(5)">
                《雄安一卡通申领业务须知协议》
              </text>
            </text>
          </wd-checkbox>
        </view>
        <view class="flex gap-15px mt-20px">
          <template v-for="(item, index) in footerBtns" :key="index">
            <view class="flex-1" v-if="applyType === index + 1 + '' ? false : true">
              <wd-button
                :custom-class="item.customClass"
                :disabled="item.disabled"
                :round="item.round"
                :type="item.type"
                block
                @click="btnClick(item)"
              >
                {{ item.text }}
              </wd-button>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>

  <wd-message-box selector="wd-message-box-slot">
    我已阅读并同意以上内容，并接受
    <text class="color-#4d80f0" @click.stop="toAgereement(5)">《雄安一卡通申领业务须知协议》</text>
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
  @apply whitespace-pre-wrap! color-#A6A6A6!;
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
