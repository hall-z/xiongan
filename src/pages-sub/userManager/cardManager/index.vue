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
      showBackButton: 'false',
    },
  },
}
</route>

<script lang="ts" setup>
import { getXinCangCardInfo, setXinCangCardAuthorize } from '@/service/api/userMessage'
import { useUserStore } from '@/store/user'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { useMessage } from 'wot-design-uni'
import { nameHide } from '@/utils'

const { isLogined, userInfo } = storeToRefs(useUserStore())
const url0 = ref(
  'https://oss.xay.xacloudy.cn/images/2024-09/3f52b044-ecaa-4c53-b218-7096e83c9669WechatIMG195.jpg',
)
const url1 = ref(
  'https://oss.xay.xacloudy.cn/images/2024-09/29673de5-ea59-438c-a9c3-79b5a957e927WechatIMG173.jpg',
)
const url2 = ref(
  'https://oss.xay.xacloudy.cn/images/2024-09/3e596aec-9d47-41a0-986d-181b1f93d60eWechatIMG174.jpg',
)
const url3 = ref(
  'https://oss.xay.xacloudy.cn/images/2024-09/7935f044-8a8f-4789-ae9b-5838f3ef7e01WechatIMG175.jpg',
)

const message = useMessage()
const isShow = ref(false)
const mainData = ref([
  {
    type: '1',
    typeName: 'A',
    iconColse: true,
    bgUrl: url1.value,
  },
  {
    type: '2',
    typeName: 'B',
    iconColse: true,
    bgUrl: url2.value,
  },
  {
    type: '3',
    typeName: 'C',
    iconColse: true,
    bgUrl: url3.value,
  },
])
const showCardData = ref([])

function showCard(data) {
  showCardData.value = mainData.value
    .filter((item) => item.type === data.cardType)
    .map((item) => {
      return { ...item, ...data }
    })
}

const { send: sendXinCangCardInfo, loading: LoadingKey } = useRequest(
  (data) => getXinCangCardInfo(data),
  {
    immediate: false,
    loading: false,
  },
)

const { send: sendCardAuthorize } = useRequest((data) => setXinCangCardAuthorize(data), {
  immediate: false,
  loading: false,
})

const xiongcaiUserId = ref('')

const toShow = () => {
  console.log('授权展示雄才卡')
  message
    .confirm({
      msg: '是否授权“雄安一卡通小程序”获取您的雄才卡信息？',
      title: '提示',
    })
    .then(async () => {
      console.log('点击了确定按钮')

      // 查询卡
      const params = {
        xiongcaiUserId: xiongcaiUserId.value,
      }
      const data: any = await sendCardAuthorize(params)
      if (data) {
        // 展示卡面
        getInfo()
      } else {
        message.confirm({
          msg: '暂未查询到您的雄才卡信息',
          title: '提示',
        })
        showCardData.value = []
      }
      isShow.value = true
    })
    .catch(() => {
      console.log('点击了取消按钮')
    })
}

// 初始化关闭的时候

function close(item, index) {
  showCardData.value[index].iconColse = !showCardData.value[index].iconColse
  mainData.value.forEach((i) => {
    if (i.type === item.type) {
      i.iconColse = showCardData.value[index].iconColse
    }
  })
  if (!showCardData.value[index].iconColse) {
    // 展示
    getInfo(1)
  } else {
    getInfo()
  }
}

function getuse() {
  if (userInfo.value.idCardNumber === '130283199007230485') {
    return true
  } else if (userInfo.value.idCardNumber === '13063219861010208X') {
    return true
  } else if (userInfo.value.idCardNumber === '410621199012281535') {
    return true
  } else if (showCardData.value && showCardData.value.length > 0 && isShow.value) {
    return true
  } else {
    return false
  }
}

async function getInfo(cardType?: number) {
  const params = {
    xiongcaiIdcardNumOut: userInfo.value.idCardNumber,
    cardType, // 1 不脱敏
  }
  try {
    const data: any = await sendXinCangCardInfo(params)
    if (!data.authorizeState) {
      xiongcaiUserId.value = data.xiongcaiUserId
    } else {
      // 直接展示
      isShow.value = true
      showCard(data)
    }
  } catch (error) {}
}

onLoad(() => {
  getInfo()
})
</script>

<template>
  <view
    class="size-100% fixed top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1] dy-blue-bg"
    style="z-index: 1; height: 100vh"
  >
    <dy-navbar leftTitle="身份卡包" left isNavShow color="#000"></dy-navbar>
    <view class="FScs" style="position: relative; z-index: 9; height: 100vh">
      <view class="bgs FSlb">
        <img
          src="https://oss.xay.xacloudy.cn/images/2025-04/35845a3c-95c4-4cd6-96bb-00f5e3f4b520bgsimg.png"
          alt=""
          class="bgs-img"
        />
        <view class="name">
          {{ nameHide(userInfo.cardName) }}
        </view>
        <view class="card">
          {{ userInfo.idCardNumberTm }}
        </view>
      </view>

      <view class="lists" v-if="getuse()">
        <template v-for="(item, index) in showCardData" :key="index">
          <view class="list list3" v-if="isShow && item.typeName.toUpperCase() === 'A'"></view>
          <view class="list list4" v-if="isShow && item.typeName.toUpperCase() === 'B'"></view>
          <view class="list list5" v-if="isShow && item.typeName.toUpperCase() === 'C'"></view>
        </template>

        <view class="list list6 FHcs" v-if="!isShow">
          <view class="F1">
            <view class="listname">雄才卡</view>
            <view class="listtext">点击授展示雄才卡</view>
          </view>
          <view @click="toShow" class="btn">授权展示</view>
        </view>

        <view class="list list1 FHcl" v-if="userInfo.idCardNumber === '410621199012281535'">
          <img
            src="https://oss.xay.xacloudy.cn/images/2025-04/b73fe35b-1588-45e3-bfca-eb60d4b42245bgicon.png"
            alt=""
            class="listicon"
          />
          <view class="listname">租赁住房</view>
          <view class="tag">华望城</view>
        </view>

        <view class="list list2 FHcl" v-if="userInfo.idCardNumber === '13063219861010208X'">
          <img
            src="https://oss.xay.xacloudy.cn/images/2025-04/b73fe35b-1588-45e3-bfca-eb60d4b42245bgicon.png"
            alt=""
            class="listicon"
          />
          <view class="listname">城发业主</view>
          <view class="tag">华望城</view>
        </view>
        <view class="list list2 FHcl" v-if="userInfo.idCardNumber === '130283199007230485'">
          <img
            src="https://oss.xay.xacloudy.cn/images/2025-04/b73fe35b-1588-45e3-bfca-eb60d4b42245bgicon.png"
            alt=""
            class="listicon"
          />
          <view class="listname">城发业主</view>
          <view class="tag">华望城</view>
        </view>
      </view>

      <view v-else class="F1 lists">
        <view class="mt-40px">
          <wd-status-tip image="content" tip="未持有任何卡片" />
        </view>
      </view>
    </view>

    <!--    <view class="px-15px" v-if="!isShow">-->
    <!--      <view-->
    <!--        class="p-15px default_bg h-112px box-border mb-10px rounded-7px relative bg-no-repeat bg-cover!"-->
    <!--        :style="{ backgroundImage: `url(${url0})` }"-->
    <!--      >-->
    <!--        <view-->
    <!--          class="bg-#9a9a9a9a px-20px py-3px text-16px color-#FFF rounded-20px absolute right-20px bottom-30%"-->
    <!--          @click="toShow"-->
    <!--        >-->
    <!--          授权展示雄才卡-->
    <!--        </view>-->
    <!--      </view>-->
    <!--    </view>-->
    <!--    <view v-else>-->
    <!--      <view class="px-15px" v-if="showCardData && showCardData.length > 0">-->
    <!--        <view-->
    <!--          class="p-15px default_bg h-112px box-border mb-10px rounded-7px relative bg-no-repeat bg-cover!"-->
    <!--          v-for="(item, index) in showCardData"-->
    <!--          :key="index"-->
    <!--          :class="`${item.typeName}_type`"-->
    <!--          :style="{ backgroundImage: `url(${item.bgUrl})` }"-->
    <!--        >-->
    <!--          <view class="text-24px">{{ item.xiongcaiUserName }}</view>-->
    <!--          <view class="text-16px mt-10px">{{ item.xiongcaiIdcardNumOut }}</view>-->
    <!--          <view-->
    <!--            class="absolute right-0 top-0 py-2px pl-15px pr-10px rounded-bl-15px color-#fff text-16px"-->
    <!--            :class="`${item.typeName}_bg_type`"-->
    <!--          >-->
    <!--            {{ item.typeName.toUpperCase() }} 类-->
    <!--          </view>-->
    <!--          <view @click="close(item, index)" class="absolute right-10px bottom-10px">-->
    <!--            <wd-icon-->
    <!--              :name="item.iconColse ? 'eye-close' : 'view'"-->
    <!--              size="20px"-->
    <!--              :color="item.iconColse ? '#5D5D5D' : '#FFC248'"-->
    <!--            ></wd-icon>-->
    <!--          </view>-->
    <!--        </view>-->
    <!--      </view>-->
    <!--      <view v-else>-->
    <!--        <view class="mt-40px">-->
    <!--          <wd-status-tip image="content" tip="未持有任何卡片"/>-->
    <!--        </view>-->
    <!--      </view>-->
    <!--    </view>-->
  </view>
</template>

<style lang="scss" scoped>
.bgs {
  position: relative;
  box-sizing: border-box;
  width: 100vw;
  height: 35vw;
  padding: 15px;
  padding-bottom: 25px;

  .bgs-img {
    position: absolute;
    right: 20px;
    bottom: 0px;
    display: block;
    width: 30vw;
    height: 30vw;
  }

  .name {
    padding-left: 15px;
    font-size: 28px;
    color: #2d69ef;
  }

  .card {
    padding-left: 15px;
    margin-top: 10px;
    font-size: 18px;
    color: #859ed4;
  }
}

.lists {
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  padding: 15px;
  background: #ffffff;
  border-radius: 15px 15px 0px 0px;

  .list1 {
    background-image: url('https://oss.xay.xacloudy.cn/images/2025-04/642a19ba-a98e-438b-84f3-017ef78150c8zl.png');
  }

  .list2 {
    background-image: url('https://oss.xay.xacloudy.cn/images/2025-04/1e30a01b-5fb6-4eb0-b273-e2ad47656408yzh.png');
  }

  .list3 {
    background-image: url('https://oss.xay.xacloudy.cn/images/2025-04/5eb43a6d-ee83-4849-ad2f-c8cfff62a5d7ca.png');
  }

  .list4 {
    background-image: url('https://oss.xay.xacloudy.cn/images/2025-04/9ae2b73c-9132-45e1-b072-5df716844987cb.png');
  }

  .list5 {
    background-image: url('https://oss.xay.xacloudy.cn/images/2025-04/0ceb80de-a958-4d40-b4c2-211b336b2893cc.png');
  }

  .list6 {
    background-image: url('https://oss.xay.xacloudy.cn/images/2025-04/79710831-e886-4783-903b-75bfe587bc9bbgg.png');

    .listname {
      font-size: 18px;
      color: #4075eb;
    }

    .listtext {
      margin-top: 5px;
      font-size: 14px;
      color: #aec7ff;
    }

    .btn {
      padding: 2px 10px;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      background: #4075eb;
      border-radius: 3px 3px 3px 3px;
    }
  }

  .list {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 18vw;
    padding: 15px;
    margin-bottom: 15px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;

    .listname {
      font-size: 22px;
      color: #4075eb;
    }

    .listicon {
      width: 60px;
      height: 60px;
      margin-right: 5px;
    }

    .tag {
      position: absolute;
      top: 0;
      right: 0;
      display: block;
      height: 28px;
      padding: 0 12px 0 15px;
      font-size: 14px;
      line-height: 28px;
      color: #ffffff;
      background: #4075eb;
      border-radius: 0px 6px 0px 10px;
    }
  }
}
</style>
