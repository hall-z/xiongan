<script lang="ts" setup>
import { Constant } from '@/enums/constant'
import { mainTypeEmums } from '@/enums/mainTypeEmum'
import { getUnlimitedQRCode } from '@/service/api/system'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { downSaveImage } from '@/utils/uniapi'
import { useRequest } from 'alova/client'
import { IGetUnlimitedQRCodeData } from '../utils/types'
const { VITE_APP_SHARECODE_VERSION } = import.meta.env

const { userInfo } = useUserStore()

const wxIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-05/8d634154-d2bf-4ff8-99f4-739b448e12f6wxIcon.png',
)
const xzIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-05/1ee01827-bb3a-4f25-8303-160c4408d22fxzIcon.png',
)
const props = defineProps({
  title: {
    type: String,
  },
  type: {
    type: Number,
    default: 1,
  },
  id: {
    type: Number,
  },
})
const imgPrefix = ref('data:image/jpg;base64,')

const {
  send: sendUnlimitedQRCodeFun,
  data: qrcodeImg,
  loading: qrcordLoading,
} = useRequest(
  (data) => {
    const params = {
      page: 'pages/pay/mainResult',
      scene: `id=${data?.id ?? ''}&pt=3&type=sharel`, // ${data.id}
      env_version: VITE_APP_SHARECODE_VERSION, // develop（开发版），trial（体验版），release（正式版）
      ...data,
    }
    return getUnlimitedQRCode<IGetUnlimitedQRCodeData>(params)
  },
  {
    immediate: false,
    loading: false,
  },
)

const goPromotionDetail = () => {
  routeTo({
    url: '/pages-sub/promotionCenter/promotionDetail',
  })
}
onMounted(() => {
  onShareAppMessage((res) => {
    if (res.from === 'button') {
      console.log('🥗', props.id)
      const path =
        Constant.MAIN_PAGE +
        `?type=${mainTypeEmums.SHARE_COUPONS}&shareUserId=${userInfo.userDId}&id=${props.id}&pt=3`
      const shareData = {
        title: '推广二维码',
        path,
        //  imageUrl: imgPrefix.value + qrcodeImg.value?.body,
        complete: () => {
          // 分享记录
          useShare(path)
        },
      }
      return shareData
    }
  })
})
defineOptions({
  name: 'PromotionSuccessful',
})
defineExpose({
  goPromotionDetail,
  sendUnlimitedQRCodeFun,
  qrcodeImg,
})
</script>

<template>
  <template v-if="props.type == 1">
    <view class="pt-30px">
      <view class="flex justify-center items-center">
        <wd-icon name="check-circle-filled" size="68px" color="#16B741"></wd-icon>
      </view>
      <view class="text-center text-22px text-black">恭喜成为雄安一卡通推广人！</view>
      <view class="text-center text-14px text-color-#2d69ef mt-8px mb-32px">
        您的专属推广二维码已生成
      </view>
      <view class="pb-20px">
        <view class="QrCodeBox">
          <view
            v-if="qrcordLoading"
            class="w-252px h-252px flex flex-col items-center justify-center"
          >
            <wd-loading />
          </view>
          <template v-else>
            <view style="padding: 0px 6px">
              <wd-img :width="252" :height="252" :src="imgPrefix + qrcodeImg?.body">
                <template #error>
                  <wd-status-tip
                    image="content"
                    tip="二维码生成失败"
                    :image-size="{
                      height: 100,
                      width: 100,
                    }"
                  />
                </template>
              </wd-img>
            </view>
            <view class="codeBtu">
              <wd-button type="text" open-type="share">
                <view class="cBtu wxBtu">
                  <wd-img width="19px" height="16px" style="margin-right: 5px" :src="wxIcon" />
                  分享微信好友
                </view>
              </wd-button>
              <view>|</view>
              <view class="cBtu xzBtu" @click="downSaveImage(qrcodeImg?.body, true)">
                <wd-img width="13px" height="13px" style="margin-right: 5px" :src="xzIcon" />
                下载二维码
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
  </template>
  <template v-else>
    <view class="mb-10px">{{ props.title }}</view>
    <view
      v-if="qrcordLoading"
      class="w-252px h-252px flex flex-col items-center justify-center mx-auto"
    >
      <wd-loading />
    </view>
    <view class="QrCodeBox2" v-else>
      <view class="qcCodeImg">
        <wd-img
          width="176px"
          height="176px"
          :src="imgPrefix + qrcodeImg?.body"
          custom-class="p-5px bg-#fff"
          radius="10px"
        >
          <template #error>
            <wd-status-tip
              image="content"
              tip="二维码生成失败"
              :image-size="{
                height: 100,
                width: 100,
              }"
            />
          </template>
        </wd-img>
      </view>
      <view class="codeBtu">
        <view class="cBtu wxBtu bg-#fff">
          <!-- #ifndef APP-PLUS -->
          <wd-button type="text" open-type="share">
            <view class="flex items-center gap-5px">
              <wd-img width="19px" height="16px" style="margin-right: 5px" :src="wxIcon" />
              <text class="color-#16B741">分享微信好友</text>
            </view>
          </wd-button>
          <!-- #endif -->
        </view>
        <view class="cBtu xzBtu bg-#fff" @click="downSaveImage(qrcodeImg?.body, true)">
          <wd-button type="text">
            <view class="flex items-center gap-5px">
              <wd-img width="13px" height="13px" style="margin-right: 5px" :src="xzIcon" />
              <text class="color-#2D69EF">下载二维码</text>
            </view>
          </wd-button>
        </view>
      </view>
    </view>
  </template>
</template>

<style lang="scss" scoped>
.QrCodeBox {
  width: 268px;
  height: 316px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 0px 15px 0 rgba(45, 105, 239, 0.35);

  .codeBtu {
    display: flex;
    align-items: center;
    height: 50px;
    color: #e6e6e6;
    background-color: #f5f9ff;
    border-radius: 0px 0px 10px 10px;

    .cBtu {
      display: flex;
      align-items: center;
      padding: 0 15px;
      font-size: 14px;
      cursor: pointer;

      :deep(.wd-img) {
        margin-right: 6px;
      }
    }

    .wxBtu {
      color: #16b741;
    }

    .xzBtu {
      color: #2d69ef;
    }
  }
}

.QrCodeBox2 {
  margin: 0 auto;

  .qcCodeImg {
    display: flex;
    justify-content: center;
    margin-bottom: 17px;
  }

  .codeBtu {
    display: flex;
    align-items: center;
    height: 45px;
    margin-bottom: 15px;

    .cBtu {
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc((100% - 15px) / 2);
      height: 45px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 8px;

      :deep(.wd-img) {
        margin-right: 6px;
      }
    }

    .wxBtu {
      margin-right: 15px;
      color: #16b741;
      border: 1px solid #16b741;
    }

    .xzBtu {
      color: #2d69ef;
      border: 1px solid #2d69ef;
    }
  }
}
</style>
