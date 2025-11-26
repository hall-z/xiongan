<route lang="json5" type="page">
{
  needLogin: true,
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
import { loginModal, routeTo } from '@/utils'

import kaguas from '@/static/images/serve/kaguas.png'
import kajiegua from '@/static/images/serve/kajiegua.png'
import kajindu from '@/static/images/serve/kajindu.png'
import shebaok from '@/static/images/serve/shebaok.png'
import shebaokbh from '@/static/images/serve/shebaokbh.png'
import shebaoksl from '@/static/images/serve/shebaoksl.png'
// import jifenluohu from 'https://oss.xay.xacloudy.cn/images/2025-09/ba4a19ea-95cf-417f-8d6e-2efe67eecc87积分落户.png'

import zhongguoyidong from '@/static/images/serve/zhongguoyidong.png'

import kabase from '@/static/images/serve/kabase.png'
import yimabanshi from '@/static/images/serve/yimabanshi.png'

import dianxinfuwu from '@/static/images/serve/dianxinfuwu.png'
import kabiangeng from '@/static/images/serve/kabiangeng.png'
import mimachongzhi from '@/static/images/serve/mimachongzhi.png'
import xionganjian from '@/static/images/serve/xionganjian.png'

import { isRouterCheckd } from '@/interceptors/route'
import gjlu1 from '@/static/images/serve/gjlu1.png'
import jiaofeitong from '@/static/images/serve/jiaofeitong.png'
import shitang from '@/static/images/serve/shitang.png'
import xionganlebo from '@/static/images/serve/xionganlebo.png'
import xionganleye from '@/static/images/serve/xionganleye.png'
import xionganzhuzishenfen from '@/static/images/serve/xionganzhuzishenfen.png'
import yxbm from '@/static/images/serve/yxbm.png'
import zhentongxiongan from '@/static/images/serve/zhentongxiongan.png'
import { useBaseStore } from '@/store/modules/base'
import { useUserStore } from '@/store/user'
import { openWxChart } from '@/utils/uniapi'
import { storeToRefs } from 'pinia'
import { getRect, isArray } from 'wot-design-uni/components/common/util'
import { useToast } from 'wot-design-uni/index'
import { mainData, SpecialItem } from './dict/types'

const bg = ref(
  'https://oss.xay.xacloudy.cn/images/2024-10/627a5948-4f0a-49c7-b76d-77b5acd3eb4ey.png',
)
const { userInfo, isRealSataus, isLogined } = storeToRefs(useUserStore())
const dyheight = ref('100%')
const toast = useToast()
const basestore = useBaseStore()
const mainData0 = ref<mainData[]>([
  {
    sTitle: '申领激活',
    list: [
      {
        specialName: '社保卡申领',
        specialIcon: shebaoksl,
        conditionCode: '1',
        specialJumpType: 'page',
        specialJump: '/pages-sub/serveMain/cardApplyType',
        specialStatus: 0,
        base: 'shebaoksl',
      },
      {
        specialName: '社保卡补换',
        specialIcon: shebaokbh,
        specialJumpType: 'page',
        conditionCode: '1',
        specialJump: '/pages-sub/serveMain/cardApplyType',
        specialStatus: 0,
        base: 'shebaokbh',
      },
      {
        specialName: '制卡进度查询',
        base: 'kajindu',
        specialIcon: kajindu,
        specialJumpType: 'page',
        specialJump: '/pages-sub/serveMain/cardFromType',
        conditionCode: '1',
        specialStatus: 0,
      },
      {
        specialName: '社保卡启用',
        specialIcon: shebaok,
        specialJumpType: 'page',
        base: 'cardSocialActive',
        specialJump: '/pages-sub/serveMain/cardFromType',
        conditionCode: '1',
        specialStatus: 0,
      },
    ],
  },
])
const mainData1 = ref<mainData[]>([
  {
    sTitle: '信息与安全',
    list: [
      {
        specialName: '基础信息查询',
        specialIcon: kabase,
        specialJumpType: 'page',
        specialJump: '/pages-sub/serveMain/cardMessType',
        conditionCode: '1',
        specialStatus: 0,
        base: 'cardBaseInfo',
      },
      {
        specialName: '社保信息变更',
        specialIcon: kabiangeng,
        specialJumpType: 'page',
        specialJump: '/pages-sub/serveMain/cardFromType',
        conditionCode: '1',
        specialStatus: 0,
        base: 'cardChange',
      },
      {
        specialName: '密码修改/重置',
        specialNameBlck: '服务密码修改',
        specialIcon: mimachongzhi,
        specialJumpType: 'page',
        specialJump: '/pages-sub/serveMain/cardFromType',
        conditionCode: '1',
        specialStatus: 0,
        base: 'changeCardPwd',
      },
    ],
  },
  {
    sTitle: '状态管理',
    list: [
      {
        specialName: '社保卡挂失',
        specialIcon: kaguas,
        specialJumpType: 'page',
        specialJump: '/pages-sub/serveMain/cardFromType',
        conditionCode: '1',
        specialStatus: 0,
        base: 'cardLoss',
      },
      {
        specialName: '社保卡解挂',
        specialIcon: kajiegua,
        specialJumpType: 'page',
        specialJump: '/pages-sub/serveMain/cardFromType',
        conditionCode: '1',
        specialStatus: 0,
        base: 'unboxingInfo',
      },
    ],
  },
])
const mainData2 = ref<mainData[]>([
  {
    sTitle: '生活服务',
    list: [
      // #ifdef MP-WEIXIN
      {
        specialName: '停车缴费',
        specialIcon: xionganlebo,
        conditionCode: '2',
        specialStatus: 0,
        specialJumpType: 'WX',
        specialJump: 'pages/index/index',
        appId: 'wx6d1780b8d016147c',
      },
      {
        specialName: '生活缴费',
        specialIcon: jiaofeitong,
        conditionCode: '2',
        specialStatus: 0,
        specialJumpType: 'WX',
        appId: 'wx0f343dd3b89d6f07', // 填入目标小程序的 appId
        specialJump: 'pages/index/index',
      },
      {
        specialName: '智慧食堂',
        specialIcon: shitang,
        conditionCode: '1',
        specialStatus: 0,
        specialJumpType: 'page',
        specialJump: '/pages-sub/userManager/smartCanteen/index',
      },
      {
        specialName: '电信服务',
        specialIcon: dianxinfuwu,
        conditionCode: '2',
        specialStatus: 0,
        specialJumpType: 'WX',
        appId: 'wxc9c692c952025897', // 填入目标小程序的 appId
        specialJump: 'pages/index/index?telre=cc-048888000000',
      },
      {
        specialName: '移动服务',
        specialIcon: zhongguoyidong,
        conditionCode: '2',
        specialStatus: 0,
        specialJumpType: 'WX',
        appId: 'wx43aab19a93a3a6f2', // 填入目标小程序的 appId
        specialJump: 'pages/home/index',
      },
      {
        specialName: '青年夜校报名',
        specialIcon: yxbm,
        conditionCode: '1',
        specialStatus: 0,
        specialJumpType: 'page',
        specialJump: '/pages-sub/userManager/nightSchoolSign/index',
      },
      // #endif
      // #ifdef APP-PLUS
      {
        specialName: '智慧食堂',
        specialIcon: shitang,
        conditionCode: '2',
        specialStatus: 0,
        specialJumpType: 'WX',
        wxId: '', // app 重新填写
        specialJump: '/pages-sub/userManager/smartCanteen/index',
      },
      // #endif
      {
        specialName: '一码办事',
        specialIcon: yimabanshi,
        specialJumpType: 'page',
        conditionCode: '1',
        specialStatus: 0,
        specialJump: '/pages-sub/userManager/codeServe/index',
      },
    ],
  },
])
const mainData3 = ref<mainData[]>([
  {
    sTitle: '公交服务',
    list: [
      {
        specialName: '余额查询',
        specialIcon: gjlu1,
        conditionCode: '1',
        specialStatus: 0,
        specialJumpType: 'page',
        specialJump: '/pages-sub/userManager/transit/list',
        base: 'gjlu',
      },
    ],
  },
])
const mainData4 = ref<mainData[]>([
  {
    sTitle: '文旅服务',
    list: [
      {
        specialName: '雄安见',
        specialIcon: xionganjian,
        specialJumpType: 'WX',
        conditionCode: '2',
        specialStatus: 0,
        appId: 'wx3387e31e1c5a8549', // 填入目标小程序的 appId
        specialJump: 'pages/index/index',
      },
    ],
  },
])
const mainData5 = ref<mainData[]>([
  {
    sTitle: '人社服务',
    list: [],
  },
])
const mainData6 = ref<mainData[]>([
  {
    sTitle: '政务服务',
    list: [
      {
        specialName: '乐业雄安',
        specialIcon: xionganleye,
        specialJumpType: 'WX',
        conditionCode: '2',
        specialStatus: 0,
        appId: 'wx685ac97e9e31d274',
        specialJump: 'pagesA/job/index',
      },
      {
        specialName: '政通雄安',
        specialIcon: zhentongxiongan,
        specialJumpType: 'WX',
        conditionCode: '2',
        specialStatus: 0,
        appId: 'wx930a1a4a76d215be',
        specialJump: 'pages/index/index',
      },
      {
        specialName: '雄安数字身份',
        specialIcon: xionganzhuzishenfen,
        conditionCode: '2',
        specialStatus: 0,
        specialJumpType: 'WX',
        wxId: 'wxf12fc0235c067698',
        appId: 'wxf12fc0235c067698',
        specialJump: 'pages/home/home',
      },
      {
        specialName: '积分落户专区',
        specialIcon:
          'https://oss.xay.xacloudy.cn/images/2025-09/ba4a19ea-95cf-417f-8d6e-2efe67eecc87积分落户.png',
        conditionCode: '1',
        specialStatus: 0,
        specialJumpType: 'page',
        specialJump:
          '/pages-sub/webView/index?showType=webView&url=https://ykt.xionganbc.com/point/#/homePage',
      },
    ],
  },
])
mainData5.value[0].list = basestore.serviceList.flat(2)
const active = ref<number>(0)
const scrollTop = ref<number>(0)
const itemScrollTop = ref<number[]>([])
const categories = ref([
  {
    label: '社保卡申领',
    items: mainData0.value,
  },
  {
    label: '社保卡服务',
    items: mainData1.value,
  },
  // #ifdef MP-WEIXIN
  {
    label: '政务服务',
    items: mainData6.value,
  },
  // #endif
  {
    label: '人社服务',
    items: mainData5.value,
  },
  // #ifdef MP-WEIXIN
  {
    label: '文旅服务',
    items: mainData4.value,
  },
  // #endif
  {
    label: '生活服务',
    items: mainData2.value,
  },
  {
    label: '公交服务',
    items: mainData3.value,
  },
])
const handleChange = ({ value }) => {
  setTimeout(() => {
    active.value = value
    scrollTop.value = itemScrollTop.value[value]
  }, 100)
}

function onScroll(e) {
  const { scrollTop } = e.detail
  const threshold = 50 // 下一个标题与顶部的距离
  const index = itemScrollTop.value.findIndex(
    (top) => top > scrollTop && top - scrollTop <= threshold,
  )
  if (index > -1) {
    active.value = index
  }
}

const toServhFor = (type) => {
  routeTo({ url: '/pages-sub/serveMassage/serchFor/index', data: { type } })
}

const gridClick = (item: SpecialItem) => {
  if (item.conditionCode === '1') {
    return routeTo({
      url: item.specialJump,
      data: { base: item.base, title: item.specialNameBlck ?? item.specialName },
    })
  }
  if (item.conditionCode === '2') {
    if (item.specialJumpType === 'WX') {
      let id = ''
      // #ifdef  MP
      id = item.appId
      //  #endif
      // #ifdef APP-PLUS
      id = item.wxId
      //  #endif
      return openWxChart(id, item.specialJump)
    }
    if (item.specialJumpType === 'H5') {
      if (isRealSataus.value) {
        const { thirdPartyId } = storeToRefs(basestore)
        let Jumpdata = ''
        Jumpdata = JSON.parse(JSON.stringify(item.specialJump))
        Jumpdata = Jumpdata.replace('XXX', thirdPartyId.value)
        return routeTo({
          url: '/pages-sub/webView/index',
          data: {
            showType: 'webView',
            url: Jumpdata,
          },
        })
      } else {
        if (!isLogined.value) return loginModal()
        if (!isRealSataus.value) return isRouterCheckd({})
      }
    }
  }
  toast.show('功能开发中，敬请期待!...')
}
onMounted(() => {
  let w = 260
  w = 0.64 * uni.getSystemInfoSync().windowWidth
  getRect('.category', true).then((rects) => {
    if (isArray(rects)) {
      itemScrollTop.value = rects.map((item) => item.top - w || 0)
      scrollTop.value = rects[active.value].top - w || 0
    }
  })
})

onShow((options: any) => {
  // active.value = basestore.active
  handleChange({ value: 0 })
  scrollTop.value = 0
})
</script>

<template>
  <view class="fixed z-[-1] topBg w-100% left-0 right-0"></view>

  <view class="flex flex-col justify-end wHeight">
    <wd-navbar safeAreaInsetTop fixed placeholder custom-style="background: transparent;">
      <template #title>
        <view class="flex justify-between items-center bg-#F7F7F7 search" @click="toServhFor(2)">
          <view class="text-14px color-#999">请输入关键词搜索</view>
          <wd-icon name="search" size="12px" color="#999 "></wd-icon>
        </view>
      </template>
    </wd-navbar>
    <view class="wraper bg-#F2F3F7 ali-warp">
      <wd-sidebar v-model="active" @change="handleChange" customClass="w-100px">
        <wd-sidebar-item
          v-for="(item, index) in categories"
          :key="index"
          :value="index"
          :label="item.label"
          customClass="customClass"
        />
      </wd-sidebar>
      <view class="w-10px"></view>
      <view class="flex-1 bg-#fff rounded-20rpx left_cont">
        <scroll-view
          class="content"
          scroll-y
          scroll-with-animation
          :throttle="false"
          :scroll-top="scrollTop"
          @scroll="onScroll"
        >
          <view
            v-for="(item, index) in categories"
            :key="index"
            class="category"
            :id="'id' + index"
          >
            <view v-for="(s, si) in item.items" :key="si">
              <view class="pl-10px">
                <dy-title
                  :title="s.sTitle"
                  class="pl-10px mb-0! py-10px"
                  customClass="customClass-title"
                ></dy-title>
              </view>
              <wd-grid :column="3" clickable>
                <template v-for="(cell, index) in s.list" :key="index">
                  <wd-grid-item
                    use-icon-slot
                    use-text-slot
                    custom-class="grid-item"
                    @itemclick="gridClick(cell)"
                    v-if="cell.specialStatus === 0"
                  >
                    <template #icon>
                      <wd-img custom-class="wh-42px rounded-10px" :src="cell.specialIcon" />
                    </template>
                    <template #text>
                      <view class="text-center line-height-32px color-#7B838D truncate-1">
                        {{ cell.specialName }}
                      </view>
                    </template>
                  </wd-grid-item>
                </template>
              </wd-grid>
            </view>
          </view>
          <view style="height: calc(100vh - 64vw - 130px)"></view>
        </scroll-view>
      </view>
      <view class="w-10px"></view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.grid-item .wd-grid-item__wrapper) {
  @apply size-auto!;
}

:deep(.wd-grid-item) {
  @apply justify-start! py-1px!;
}

:deep(.wd-grid-item__content) {
  @apply py-1px!;
}

:deep(.wd-sidebar) {
  @apply bg-#F2F3F7!;
}

:deep(.wd-sidebar-item--active) {
  @apply color-#2D69EF;
  background: linear-gradient(270deg, #f2f3f7 0%, #d1e8ff 100%) !important;
  border-radius: 0px 10px 0px 0px !important;
}

$w-height: 44px;
$w-wHiight: 240px;
/*  #ifdef  MP-ALIPAY	 */
$w-height: 54px;
$w-wHiight: 0px;
/*  #endif  */
/*  #ifdef  MP-WEIXIN	 */
$w-height: 0;
$w-wHiight: 180px;
/*  #endif  */
/*  #ifdef  APP	 */
$w-height: 44px;
$w-wHiight: 240px;
/*  #endif  */
.wHeight {
  height: calc(100vh - #{$w-height}); // 使用插值语法
}

.wraper {
  position: absolute;
  bottom: 10px;
  z-index: 1;
  display: flex;
  height: calc(100vh - var(--window-top) - #{$w-wHiight});
  height: calc(100vh - var(--window-top) - constant(safe-area-inset-bottom) - #{$w-wHiight});
  height: calc(100vh - var(--window-top) - env(safe-area-inset-bottom) - #{$w-wHiight});
}
/*  #ifdef  APP-PLUS||H5	 */
.content {
  box-sizing: border-box;
  flex: 1;
  height: calc(100vh - 240px);
  // padding-top: 10px;
  // // margin-top: 190px;
  // margin-right: 10px;
  // margin-bottom: 30px;
  // background: #fff;
  // border-radius: 0 10px 10px 0;
  // box-shadow: 0px 0px 12px 1px rgba(114, 114, 114, 0.08);
}
/*  #endif  */
/*  #ifdef  MP-ALIPAY	 */
.content {
  box-sizing: border-box;
  flex: 1;
  height: v-bind(dyheight);
  // padding-top: 10px;
  // // margin-top: 190px;
  // margin-right: 10px;
  // margin-bottom: 30px;
  // background: #fff;
  // border-radius: 0 10px 10px 0;
  // box-shadow: 0px 0px 12px 1px rgba(114, 114, 114, 0.08);
}

.ali-warp {
  position: absolute;
  bottom: 0px;
  z-index: 1;
  height: calc(100vh - 220px);
}
/*  #endif  */
/*  #ifdef  MP-WEIXIN	 */
.content {
  box-sizing: border-box;
  flex: 1;
  height: v-bind(dyheight);
  // padding-top: 10px;
  // // margin-top: 190px;
  // margin-right: 10px;
  // margin-bottom: 30px;
  // background: #fff;
  // border-radius: 0 10px 10px 0;
  // box-shadow: 0px 0px 12px 1px rgba(114, 114, 114, 0.08);
}

.ali-warp {
  position: absolute;
  bottom: 0px;
  z-index: 1;
  height: calc(100vh - 220px);
}
/*  #endif  */
:deep(.customClass) {
  @apply text-12px!;
}

:deep(.customClass-title) {
  text {
    @apply font-400! text-14px!;
  }
}

.topBg {
  height: 64vw;
  background-color: #d1e8ff;
  background-image: url('https://oss.xay.xacloudy.cn/images/2024-10/627a5948-4f0a-49c7-b76d-77b5acd3eb4ey.png');
  background-repeat: no-repeat;
  background-position: center bottom -40px;
  background-size: 100% auto;
}

.search {
  position: absolute;
  bottom: 6px;
  left: 20px;
  box-sizing: border-box;
  width: 60%;
  height: 32px;
  padding: 0 15px;
  overflow: hidden;
  font-weight: normal;
  line-height: 32px;
  border-radius: 24px;
}

.left_cont {
  /*  #ifdef  MP-ALIPAY	 */
  overflow: auto;
  /*  #endif  */
  box-shadow: 0px 0px 12px 1px rgba(114, 114, 114, 0.08);
}
</style>
