<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationBarTitleText: '雄安一卡通',
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
import { Constant } from '@/enums/constant'
import { mainTypeEmums } from '@/enums/mainTypeEmum'
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { routeTo } from '@/utils'
import { storeToRefs } from 'pinia'
import { promotionDateStore } from '@/store'
import qs from 'qs'
const { promotionDate } = storeToRefs(promotionDateStore())
const promotionStore = promotionDateStore()
// 去对应的页面
function goto(options) {
  if (options.type === mainTypeEmums.SHARE_PROMOTION) {
    routeTo({
      url: `${Constant.PROMOTIOM_PATH}`,
      data: {
        base: 'shebaoksl',
        title: '社保卡申领',
        id: options.id,
        promoterType: options.pt,
      },
      navType: NAVIGATE_TYPE.REDIRECT_TO,
    })
    return
  }
  if (options.type === mainTypeEmums.SHARE_COUPONS) {
    if (options.pt === '3') {
      // 缓存数据
      const promotionDate = {
        promoterType: options.pt,
        promoterId: options.id,
        isPromotion: false,
      }
      promotionStore.setPromotionDate(promotionDate)
    }
    routeTo({
      url: `${Constant.ACTIVITY_PATH}`,
      data: {
        id: '1080038',
        title: '活动',
        pid: options.id,
        promoterType: options.pt,
      },
      navType: NAVIGATE_TYPE.REDIRECT_TO,
    })
    return
  }
  if (options.type === mainTypeEmums.SHARE_DEVICE_CODE) {
    routeTo({
      url: `${Constant.ARTICLE_PATH}`,
      data: { ...options, type: options.id, title: options.title },
      navType: NAVIGATE_TYPE.REDIRECT_TO,
    })
    return
  }
  if (options.type === mainTypeEmums.SHARE_COUPN) {
    routeTo({
      url: `${Constant.COUPON_PATH}`,
      data: { ...options },
      navType: NAVIGATE_TYPE.REDIRECT_TO,
    })
  }
  if (options.type === mainTypeEmums.SHARE_PROUDUCT) {
    routeTo({
      url: `${Constant.GOODS_PATH}`,
      data: { ...options },
      navType: NAVIGATE_TYPE.REDIRECT_TO,
    })
  }

  const path = qs.stringify(options)
  useShare(path)
}
function parseScene(sceneStr: string) {
  const params = {}

  if (!sceneStr) return params

  const pairs = sceneStr.split('&')

  for (const pair of pairs) {
    const [key, value] = pair.split('=')

    if (key && value !== undefined) {
      params[key] = decodeURIComponent(value)
    }
  }

  return params
}

const currentData = ref()
const page = ref(1)

const parasmChange = (options) => {
  const q = decodeURIComponent(options.q) // 获取到二维码原始链接内容
  console.log('🥘', q !== 'undefined')
  if (q && q !== 'undefined') {
    // FIX: 待验证
    const pathData = q.split('?')[1]
    const data = qs.parse(pathData)
    console.log('mainResulit', data)
    goto(data)
  } else {
    const scenc = decodeURIComponent(options.scene)
    const date: any = parseScene(scenc)
    console.log('date', date)
    if (date?.id) {
      goto(date)
    } else {
      goto(options)
    }
  }
}
onLoad((options) => {
  console.log('🍢页面进入数据====》:', options)
  uni.showLoading({ title: '加载中', mask: true })
  currentData.value = options
  parasmChange(options)
  uni.hideLoading()
})
onHide(() => {
  console.log('页面卸载')
  page.value = 2
})
onShow(() => {
  if (currentData.value && page.value === 2) {
    console.log('show----页面进入数据====》:', currentData.value)
    parasmChange(currentData.value)
  }
})
</script>

<template>
  <view class=""></view>
</template>

<style lang="scss" scoped>
//
</style>
