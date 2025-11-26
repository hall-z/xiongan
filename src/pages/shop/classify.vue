<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
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
import { getSecondCategory, getGoodListDP, getGoodListSP } from '@/service/api/shop'
import nav1 from '../../static/images/shop/shop_nav1.png'
import nav2 from '../../static/images/shop/shop_nav2.png'
import nav3 from '../../static/images/shop/shop_nav3.png'
import nav4 from '../../static/images/shop/shop_nav4.png'
import nav5 from '../../static/images/shop/shop_nav5.png'
import nav7 from '../../static/images/shop/shop_nav7.png'

import { List } from '@/service/model/baseModel'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { storeToRefs } from 'pinia'
import userCoupon from './utils/userCoupon'

const { isLogined, userInfo } = storeToRefs(useUserStore())

const { sendUserCouponList, sendCouponList, sendShopCarList } = userCoupon()

const swiperAuto = ref(true)

// const { sendGetActivityList: getActivityList } = useUserOrder()

const navListType = ref('店铺')
const navActive = ref<number>(0)
const firstCategoryId = ref('')
const firstCategoryName = ref('')
const secondCategoryId = ref('')
const secondCategoryName = ref('')
const LabelList = ref([])

const type1cut = ref(0)
const type2cut = ref(0)
const type1List = ref([])
const type2List = ref([])

const typeList = ref([])

const list = ref<string[]>(['店铺', '商品'])

const title = ref('分类标题')

const paging = ref(null)

function gopath(url, e?: any) {
  routeTo({
    url,
    data: e,
  })
}

function handleClick(e) {
  secondCategoryId.value = LabelList.value[e.index].code
  secondCategoryName.value = LabelList.value[e.index].name

  paging.value.reload()
}

function change(e) {
  navListType.value = e.value

  paging.value.reload()
}

async function getLsit(pageNo: number, pageSize: number) {
  if (navListType.value === '店铺') {
    try {
      const res: any = await getGoodListDP({
        current: pageNo,
        size: pageSize,
        firstCategoryId: firstCategoryId.value ? Number(firstCategoryId.value) : '',
        secondCategoryId: secondCategoryId.value ? Number(secondCategoryId.value) : '',
      })

      paging.value.complete(res.content)
    } catch {
      paging.value.complete(false)
    }
  } else if (navListType.value === '商品') {
    try {
      const res: any = await getGoodListSP({
        current: pageNo,
        size: pageSize,
        firstCategoryId: firstCategoryId.value ? Number(firstCategoryId.value) : '',
        secondCategoryId: secondCategoryId.value ? Number(secondCategoryId.value) : '',
      })
      paging.value.complete(res.content)
    } catch {
      paging.value.complete(false)
    }
  }
}

const getUrl = (str) => {
  if (str) {
    return JSON.parse(str)[0].data
  } else {
    return ''
  }
}

async function secondCategory() {
  const res: any = await getSecondCategory({
    pcode: firstCategoryId.value ? Number(firstCategoryId.value) : '',
  })

  // if (!res || res.length <= 1) {
  //   LabelList.value = []
  // } else {
  //   LabelList.value = [{ name: '推荐', code: '' }, ...res]
  // }
  LabelList.value = [{ name: '推荐', code: '' }, ...res]
}

onLoad(async (e) => {
  firstCategoryName.value = e.name
  firstCategoryId.value = e.code
  secondCategory()
})

onShow(async () => {
  paging.value && paging.value.reload()
})
</script>
<template>
  <z-paging
    ref="paging"
    v-model="typeList"
    @query="getLsit"
    :auto="true"
    safe-area-inset-bottom
    :show-loading-more-no-more-view="true"
  >
    <template #top>
      <view
        class="box-border bg-no-repeat bg-cover z-999"
        style="background: #f7f7f7"
        :class="LabelList.length > 1 ? 'h-165px' : 'h-123px'"
      >
        <dy-navbar
          :leftTitle="firstCategoryName ? firstCategoryName : title"
          left
          isNavShow
          color="#000"
        ></dy-navbar>

        <view class="w-100vw box-border">
          <wd-tabs v-model="navActive" swipeable @click="handleClick">
            <block v-for="(item, index) in LabelList" :key="index">
              <wd-tab :title="item.name"></wd-tab>
            </block>
          </wd-tabs>
        </view>
        <view class="w-100vw box-border">
          <wd-segmented
            :options="list"
            v-model:value="navListType"
            size="small"
            @change="change"
            customStyle="box-shadow: 0px 0px 12px 1px rgba(114, 114, 114, 0.08);"
          ></wd-segmented>
        </view>
      </view>
    </template>
    <view class="w-full box-border mt-10px">
      <view class="cons">
        <view class="box-border pos-relative bg-#f7f7f7 w-100vw">
          <view class="type1" v-if="navListType === '店铺'">
            <view class="pt-10px grid gap-row-15px gap-col-13px px-15px box-border">
              <view
                class="flex flex-col border-rd-10px overflow-hidden bg-white p-10px"
                v-for="(item, index) in typeList"
                :key="index"
              >
                <view class="FHcs pos-relative">
                  <view class="FHcl pos-relative" style="width: calc(100% - 70px)">
                    <img
                      :src="item.logo"
                      style="
                        display: block;
                        width: 25px;
                        height: 25px;
                        overflow: hidden;
                        border-radius: 100%;
                      "
                    />
                    <view
                      class="line-height-25px font-size-14px color-#333 over1 F1 ml-10px"
                      style="width: calc(100% - 70px)"
                    >
                      {{ item.shopName }}
                    </view>
                  </view>
                  <view
                    style="width: 35px; text-align: center"
                    class="line-height-20px font-size-12px color-#fff px-15px bg-#F44d24 border-rd-10px"
                    @click="
                      routeTo({ url: '/pages-sub/shopManager/shopHome', data: { id: item.shopId } })
                    "
                  >
                    进店
                  </view>
                </view>
                <view class="pt-10px grid grid-cols-3 gap-col-10px box-border">
                  <view
                    class="relative"
                    v-for="(it, ind) in item.productSpuBeans"
                    style="height: 27vw"
                    :key="ind"
                  >
                    <wd-img
                      width="100%"
                      height="100%"
                      mode="aspectFill"
                      :src="getUrl(it.rotationUrl)"
                      custom-style="border-radius:5px;overflow: hidden;"
                      @click="
                        routeTo({ url: '/pages-sub/homeManager/shopInfo', data: { id: it.spuId } })
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
                </view>

                <!--                <wd-img-->
                <!--                  width="100%"-->
                <!--                  height="160px"-->
                <!--                  mode="widthFix"-->
                <!--                  :src="getUrl(item.rotationUrl)"-->
                <!--                  custom-style="border-radius:5px 5px 0 0;overflow: hidden;"-->
                <!--                />-->

                <!--                <view class="name listname mx-5px my-10px float-left">-->
                <!--                  {{ item.spuName }}-->
                <!--                </view>-->

                <!--                <view class="mx-5px">-->
                <!--                  <text style="font-size: 12px; color: #f44d24">￥</text>-->
                <!--                  <text style="font-size: 18px; font-weight: 600; color: #f44d24">-->
                <!--                    {{ item.sellPrice }}-->
                <!--                  </text>-->
                <!--                  <text style="margin-left: 8px; font-size: 12px; color: #999999">-->
                <!--                    已售{{ item.frequently }}件-->
                <!--                  </text>-->
                <!--                </view>-->
              </view>
            </view>
          </view>
          <view class="type2" v-if="navListType === '商品'">
            <view class="pt-10px grid grid-cols-2 gap-row-15px gap-col-13px px-15px box-border">
              <view
                class="flex flex-col border-rd-6px overflow-hidden bg-white pb-10px"
                v-for="item in typeList"
                :key="item.spuId"
                @click="
                  routeTo({ url: '/pages-sub/homeManager/shopInfo', data: { id: item.spuId } })
                "
              >
                <wd-img
                  width="100%"
                  height="160px"
                  mode="widthFix"
                  :src="getUrl(item.rotationUrl)"
                  custom-style="border-radius:5px 5px 0 0;overflow: hidden;"
                />

                <view class="name listname mx-5px my-10px float-left">
                  {{ item.spuName }}
                </view>

                <view class="mx-5px">
                  <text style="font-size: 12px; color: #f44d24">￥</text>
                  <text style="font-size: 18px; font-weight: 600; color: #f44d24">
                    {{ item.sellPrice }}
                  </text>
                  <text style="margin-left: 8px; font-size: 12px; color: #999999">
                    已售{{ item.frequently }}件
                  </text>
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

.Tj {
  height: 30px;
  margin: 5px 15px;
}

.titletj {
  display: block;
  width: 120px;
  height: 30px;
}

.titletjmore {
  font-size: 14px;
  color: #888888;
  text-align: right;
}

.listname {
  height: 44px;
  font-size: 16px;
  line-height: 22px;
}

.cons {
  opacity: 1;
}

.likeBox {
  /*padding-right: 12px;*/
  /*padding-left: 12px;*/
}

.likeCon {
  padding: 5px 12px;
  background: #ffeef1;
  border-radius: 8px 8px 8px 8px;
}
/*  #ifdef  MP-ALIPAY  */
.al-Left {
  @apply pl-30px mt-[-2px];
}
/*  #endif  */
</style>
