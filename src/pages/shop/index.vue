<route lang="json5">
{
  layout: 'default',

  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      defaultTitle: '',
      titlePenetrate: 'NO',
      backButtonIcon: null,
    },
  },
}
</route>
<script lang="ts" setup>
import { getActivityList, getQualityShop } from '@/service/api/shop'
import nav7 from '../../static/images/shop/shop_nav7.png'

import { List } from '@/service/model/baseModel'
import { useBaseStore, useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { getLocation } from '@/utils/uniapi'
import { storeToRefs } from 'pinia'
import userCoupon from './utils/userCoupon'

const baseStore = useBaseStore()
const nav61 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/0c8f8739-b2c5-44e1-947b-8159cb96eb3bshop_nav61.png',
)
const nav62 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/502a76e9-2085-438e-bac4-0a0ae0af3874shop_nav62.png',
)
const nav0 =
  'https://oss.xay.xacloudy.cn/images/2025-04/846e95be-35a9-4939-9b61-9e5260b8d362pzsp.jpg'

const pzsj = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/5dd61892-6bff-4ff2-9535-b789a957894epzsj.png',
)
const stay = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/5a1ba51b-395c-46fa-bb51-4cbb7d515d73jqqd.png',
)
const { isLogined, userInfo } = storeToRefs(useUserStore())
const { sendUserCouponList, sendCouponList, sendShopCarList } = userCoupon()
const swiperAuto = ref(true)
const pageOption = ref<PageOption>({
  page: 1,
  size: 10,
  location: '2',
  shopHdState: 0,
})
const swiperList = ref<IActivityBanner[]>([])
const handleClick = (data) => {
  const { item } = data
  if (item.shopHdType === 1) {
    routeTo({ url: item.appUrl, data: { ...item.data } })
  } else if (item.shopHdType === 3) {
    routeTo({ url: item.shopHdSketch })
  } else if (item.shopHdType === 0) {
    routeTo({
      url: '/pages-sub/webView/index',
      data: {
        type: item.shopHdId,
        showType: 'banner',
        url: item.linkUrl,
      },
    })
  } else if (item.shopHdType === 4) {
    // H5
    routeTo({
      url: '/pages-sub/webView/index',
      data: {
        type: item.shopHdId,
        showType: 'webView',
        url: item.linkUrl,
      },
    })
  } else {
    // #ifndef APP-PLUS
    routeTo({
      url: '/pages-sub/homeManager/action',
      data: {
        id: item.itemId,
      },
    })
    // #endif
    // #ifdef APP-PLUS
    if (item.shopHdTitle === '雄安一卡通优惠享不停') {
      routeTo({
        url: '/pages-sub/homeManager/action',
        data: {
          id: item.itemId,
        },
      })
    } else {
      uni.showModal({
        title: '提示',
        content: '请前往' + VITE_APP_LOGOTITLE + '微信小程序端参加活动！',
        showCancel: false,
      })
    }

    // #endif
  }
}
const paging = ref(null)

const typeList = ref([])

const searchIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-01/e3d95688-3fa5-4fc5-b665-1e681248a6d2search.png',
)
const { VITE_APP_LOGOTITLE } = import.meta.env
const topbgBase64 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-01/0259a4e6-d346-4822-9405-e403d0066ab6navbg.png',
)
const carIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/5f1ec2bd-5f2c-4dce-8596-d2204706f346car22.png',
)
const gopath = (url, e?: any) => {
  routeTo({
    url,
    data: e,
  })
}

const goCar = () => {
  uni.navigateTo({
    url: '/pages-sub/homeManager/shopCar',
  })
}
const goSerch = () => {
  routeTo({ url: '/pages-sub/homeManager/goodsSearch' })
}

const getLsit = async (pageNo: number, pageSize: number) => {
  try {
    const res: any = await getQualityShop({
      // current: pageNo,
      // size: pageSize,
      latitude: baseStore.userLocation.latitude ?? '',
      longitude: baseStore.userLocation.longitude ?? '',
    })
    paging.value.complete(res)
  } catch {
    paging.value.complete(false)
  }
}
const getUrl = (str) => {
  if (str) {
    return JSON.parse(str)[0].data
  } else {
    return ''
  }
}
const location = async () => {
  try {
    if (baseStore.userLocation.latitude) {
      return
    }
    console.log('🍇')
    const location = await getLocation()
    await baseStore.setLocation(location)
    paging.value.reload()
  } catch (error) {
    console.log('🍺[error]==>>>>>>.:', error)
  }
}
onMounted(async () => {
  location()
})
const Coupons = ref(0)
const Mycoupons = ref(0)
onLoad(async () => {
  const { content = [] } = await getActivityList<List>(pageOption.value)
  swiperList.value = content
})
const carNum = ref(0)
onShow(async () => {
  if (isLogined.value) {
    sendCouponList({
      page: 1,
      size: 20,
      type: 0,
    }).then((res: any) => {
      Coupons.value = res.totalElements ? res.totalElements : 0
    })

    sendUserCouponList({
      page: 1,
      size: 20,
      status: 0,
    }).then((res: any) => {
      Mycoupons.value = res.totalElements ? res.totalElements : 0
    })

    const carParams = {
      customerId: userInfo.value.userDId,
      current: 1,
      size: 100000,
    }
    const carList = (await sendShopCarList(carParams)) as any
    // 商品种类数量
    if (carList && carList.length > 0) {
      carNum.value = carList.reduce((a, b) => {
        return a + b.shopCartProductResp.length
      }, 0)
    } else {
      carNum.value = 0
    }
  }
  await nextTick()
  paging.value && paging.value.reload()
})
const salesVolumeShow = (data) => {
  if (data >= 1000) {
    return '月售 1000+'
  } else if (data >= 100 && data < 1000) {
    return '月售 100+'
  } else {
    return 0
  }
}
const showLogisticsType = (data, falg) => {
  if (!data) return false
  return data.includes(falg)
}
</script>
<template>
  <z-paging
    ref="paging"
    v-model="typeList"
    @query="getLsit"
    :auto="true"
    safe-area-inset-bottom
    :loading-more-enabled="false"
    :show-loading-more-no-more-view="true"
  >
    <template #top>
      <view
        class="box-border h-153px bg-no-repeat bg-cover z-999"
        style="background: #f7f7f7"
        :style="`background-image: url(${topbgBase64});background-size: 100% 99%`"
      >
        <wd-navbar safeAreaInsetTop placeholder custom-class="nav_custom" :bordered="false">
          <template #left>
            <view class="flex gap-10px items-center">
              <text class="line-height-44px text-18px color-#fff mt-5px al-Left">
                {{ VITE_APP_LOGOTITLE }}
              </text>
            </view>
          </template>
        </wd-navbar>

        <view
          class="w-100vw flex items-center justify-between gap-2px box-border mt-10px pl-15px pr-20px"
        >
          <view
            class="pl-10px pr-2px flex items-center search pos-relative z-99999"
            @click="goSerch"
          >
            <wd-img :width="17" :height="18" :src="searchIcon" />
            <view class="uni-input m-l-10px flex-1 color-#999">请输入搜索关键词</view>
            <view class="searchbtn">搜索</view>
          </view>
          <view class="mt-6px" @click="goCar" max="99">
            <wd-badge :modelValue="carNum">
              <wd-img :width="35" :height="35" :src="carIcon" mode="aspectFit" />
            </wd-badge>
          </view>
        </view>
      </view>
    </template>
    <view
      class="w-full box-border"
      style="
        background-color: #f7f7f7;
        /*background-image: url(https://oss.xay.xacloudy.cn/images/2025-03/cc844430-923e-42b9-ad6b-5c41fef62709a230d79e4bc126f899446fec1396390-tuya.png);*/
        background-repeat: no-repeat;
        background-position: top -152px center;
        background-size: 100% auto;
      "
    >
      <view class="cons">
        <!--      banner-->
        <view class="p-4 pb-2" v-if="swiperList && swiperList.length > 0">
          <wd-swiper
            :list="swiperList"
            :autoplay="swiperAuto"
            :current="0"
            :height="150"
            value-key="shopHdBanner"
            :indicator="{ type: 'dots-bar' }"
            @click="handleClick"
            imageMode="scaleToFill"
          ></wd-swiper>
        </view>
        <!-- TODO:暂时注释 -->
        <!-- #ifdef MP-WEIXIN -->
        <view class="px-4" v-if="isLogined === true">
          <wd-img
            v-if="Coupons > 0"
            width="100%"
            mode="widthFix"
            :src="nav61"
            @click="gopath('/pages-sub/marketManager/coupon/index')"
          />
          <wd-img
            v-if="Coupons == 0 && Mycoupons > 0"
            width="100%"
            mode="widthFix"
            :src="nav62"
            @click="gopath('/pages-sub/marketManager/coupon/mycoupon')"
          />
        </view>
        <!-- #endif -->

        <view class="px-15px" v-if="isLogined === false">
          <wd-img
            width="100%"
            mode="widthFix"
            :src="nav61"
            @click="gopath('/pages-sub/marketManager/coupon/index')"
          />
        </view>
        <view class="px-15px pb-2">
          <view
            class="box-border pos-relative px-5px py-12px round"
            style="padding: 8px 5px 5px 5px"
          >
            <view
              class="box-border relative flex justify-between items-center mb-1 pl-1"
              @click="gopath('/pages-sub/shopManager/shopList?type=5')"
            >
              <wd-img width="72px" mode="widthFix" :src="pzsj"></wd-img>
              <wd-img width="70px" mode="widthFix" :src="nav7"></wd-img>
            </view>
            <view class="type1">
              <view class="pt-10px grid gap-row-15px gap-col-13px box-border">
                <view
                  class="shopList flex flex-col border-rd-10px overflow-hidden bg-white p-12px"
                  v-for="(item, index) in typeList"
                  :key="index"
                >
                  <view class="flex items-center justify-between relative">
                    <view
                      class="flex items-center justify-betweenl pos-relative"
                      style="width: calc(100% - 70px)"
                    >
                      <img
                        :src="item.shopAvatar"
                        style="
                          display: block;
                          width: 48px;
                          height: 48px;
                          overflow: hidden;
                          border-radius: 100%;
                        "
                      />
                      <view class="ml-10px" style="width: calc(100% - 70px)">
                        <view
                          class="line-height-30px font-size-16px font-bold color-#000000 over1 F1"
                        >
                          {{ item.name }}
                        </view>
                        <view
                          class="flex items-center justify-between font-size-12px"
                          style="
                            flex-wrap: nowrap;
                            justify-content: flex-start;
                            white-space: nowrap;
                          "
                        >
                          <view class="divide mr-5px">{{ item.score }} 分</view>
                          <view
                            class="color-#F44D24 mr-5px"
                            v-if="showLogisticsType(item.logisticsType, '1')"
                          >
                            自提
                          </view>
                          <view
                            class="color-#37A815 mr-5px"
                            v-if="showLogisticsType(item.logisticsType, '0')"
                          >
                            配送
                          </view>
                          <view class="color-#999999" v-if="item.salesVolume > 100">
                            {{ salesVolumeShow(item.salesVolume) }}
                          </view>
                        </view>
                      </view>
                    </view>
                    <view>
                      <view
                        style="width: 35px; text-align: center"
                        class="line-height-24px font-size-12px color-#fff px-15px bg-#F44d24 border-rd-20px"
                        @click="
                          routeTo({
                            url: '/pages-sub/shopManager/shopHome',
                            data: { id: item.id },
                          })
                        "
                      >
                        进店
                      </view>
                      <view
                        class="font-size-12px color-#999999 mt-5px pr-6px text-right"
                        v-if="item.distance"
                      >
                        {{ item.distance.toFixed(2) }}km
                      </view>
                    </view>
                  </view>
                  <view class="pt-10px grid grid-cols-4 gap-col-15px box-border">
                    <view
                      class="relative"
                      v-for="(it, ind) in item.productSpuBeans"
                      style="height: 18vw"
                      :key="ind"
                    >
                      <wd-img
                        width="100%"
                        height="100%"
                        mode="aspectFill"
                        :src="getUrl(it.rotationUrl)"
                        custom-style="border-radius:5px;overflow: hidden;"
                        @click="
                          routeTo({
                            url: '/pages-sub/homeManager/shopInfo',
                            data: { id: it.spuId },
                          })
                        "
                      />
                      <view
                        class="inline-block line-height-20px font-size-12px color-#fff pl-10px pr-15px"
                        style="
                          position: absolute;
                          bottom: 0px;
                          left: 0;
                          height: 20px;
                          background: rgba(0, 0, 0, 0.5);
                          border-radius: 0 15px 0 5px;
                        "
                      >
                        ￥{{ it.sellPrice }}
                      </view>
                    </view>
                    <view class="relative" v-if="item.productSpuBeans.length < 2">
                      <wd-img
                        width="100%"
                        height="100%"
                        mode="aspectFill"
                        :src="stay"
                        custom-style="border-radius:5px;overflow: hidden;"
                      />
                    </view>
                    <view class="relative" v-if="item.productSpuBeans.length < 3">
                      <wd-img
                        width="100%"
                        height="100%"
                        mode="aspectFill"
                        :src="stay"
                        custom-style="border-radius:5px;overflow: hidden;"
                      />
                    </view>
                    <view class="relative" v-if="item.productSpuBeans.length < 4">
                      <wd-img
                        width="100%"
                        height="100%"
                        mode="aspectFill"
                        :src="stay"
                        custom-style="border-radius:5px;overflow: hidden;"
                      />
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style>
.shopList {
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.07);
}
.main-title-color {
  color: #d14328;
}

:deep(.nav_custom) {
  top: 0;
  left: 0;
  width: 100%;
  background-color: transparent !important;
}

.search {
  box-sizing: border-box;
  width: 308px;
  height: 35px;
  background: #ffffff;
  border-radius: 20px 20px 20px 20px;
}

.img {
  position: absolute !important;
  bottom: 6px;
  left: 7px;
}

.bg1 {
  height: 100%;
  background-image: linear-gradient(#f9dfe4, #fff);
}

.swiper {
  position: relative;
  width: 100%;
  height: 140px;
}

.tag {
  border: 1px solid #f44d24;
  border-radius: 3px;
}

.swiper-item {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 5px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
}

:deep(.uni-swiper-dots) {
  margin-right: -5px;
  transform: scale(0.5);
}

.rightBox {
  position: absolute;
  right: 0;
  height: 100%;
}

.line {
  width: 1px;
  height: 30px;
  background: #eaeaea;
}

.searchbtn {
  width: 57px;
  line-height: 31px;
  color: #fff;
  text-align: center;
  background: #f44d24;
  border-radius: 20px 20px 20px 20px;
}

.caricon {
  position: relative;
  margin-left: 16px;
}

.name {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.banner {
  background: #f7f7f7;
}
/*.caricon::after {*/
/*  position: absolute;*/
/*  top: 0;*/
/*  right: 0;*/
/*  width: 12px;*/
/*  height: 12px;*/
/*  content: '';*/
/*  background-color: #ff0707;*/
/*  border: 1px solid #ffffff;*/
/*  border-radius: 50px;*/
/*}*/

.list {
  /*min-height: calc(100vh - 417px);*/
  background: #f7f7f7;
}

:deep(.zp-empty-view-center) {
  background: #f7f7f7;
}

:deep(.z-paging-content) {
  background: #f7f7f7;
}
.divide {
  width: 35px;
  height: 17px;
  font-size: 12px;
  font-weight: 600;
  line-height: 17px;
  color: #ffffff;
  text-align: center;
  background: #f44d24;
  border-radius: 4px 4px 4px 4px;
}
.ZYtag {
  padding: 2px 5px;
  margin-top: -1px;
  margin-right: 5px;
  overflow: hidden;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  background: #f54e24;
  border-radius: 3px;
}

:deep(.wd-tabs__nav) {
  color: #fff;
  background: transparent !important;
}

.bgbox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: #fff;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0) 40%,
    rgba(131, 17, 17, 0.61) 71%,
    #831111 100%
  );
  border-radius: 5px 5px 5px 5px;
  opacity: 0.8;
}

.nav3b {
  font-size: 16px;
  line-height: 24px;
  color: #333;
  text-align: center;
}

.nav3s {
  position: relative;
  padding-bottom: 10px;
  font-size: 12px;
  line-height: 18px;
  color: #666;
  text-align: center;
}

.nav3s.act,
.nav3b.act {
  color: #f44d24 !important;
}

.navType.act {
  position: relative;
  font-size: 16px;
  color: #f44d24 !important;
  transition: all 0.3s;
}

.navType {
  padding-bottom: 10px;
  transition: all 0.3s;
}

.navType.act:before {
  position: absolute;
  bottom: 2px;
  left: 0;
  display: inline-block;
  width: 100%;
  height: 10px;
  content: '';
  background-image: url('../../static/images/shop/shop_icon.png');
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: 30px 25px;
  transition: all 0.3s;
}

.nav3s.act:before {
  position: absolute;
  bottom: 2px;
  left: 0;
  display: inline-block;
  width: 100%;
  height: 10px;
  content: '';
  background-image: url('../../static/images/shop/shop_icon.png');
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: 30px 25px;
  transition: all 0.3s;
}

.showmore {
  width: 70px;
  background-image: linear-gradient(
    -90deg,
    #f7f7f7,
    #f7f7f7,
    #f7f7f7,
    #f7f7f7,
    rgba(255, 255, 255, 0)
  );
}

.cons {
  opacity: 1;
}

.likeCon {
  padding: 5px 12px;
  /* background: #ffeef1; */
  border-radius: 8px 8px 8px 8px;
}
/*  #ifdef  MP-ALIPAY  */
.al-Left {
  @apply pl-30px mt-[-2px];
}
/*  #endif  */

:deep(.wd-grid-item__content) {
  padding: 10px 0 !important;
}
</style>
