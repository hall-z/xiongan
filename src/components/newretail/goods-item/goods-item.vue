<template>
  <view 
    class="gm-goods-item" 
    :class="['gm-goods-item' + (props.idx === 0 || props.idx ? props.idx : ''), props.styleType]"
    :data-product-id="props.goods.id" 
    :style="{
      backgroundColor: props.backGroundType === 'color' ? props.backGroundColor : 'transparent',
      backgroundImage: props.backGroundType === 'image' && props.backGroundImgObj ? `url(${props.backGroundImgObj.imageUrl})` : 'none',
      fontWeight: props.textStyle,
      width: `calc(${props.goodsWidth} - ${(props.modelMargin ? props.modelMargin * 2 : 2)}px)`,
      margin: `${props.modelMargin || -1}px`,
      textAlign: props.alignStyle,
      borderRadius: `${props.fillet}px`
    }" 
    :id="`products-${props.goods.id}`" 
    :data-type="props.goodsType"
    @tap="clickGoodsItem"
  >
    <view class="gm-goods-img-box">
      <image class="gm-goods-img" :src="state.imageUrl" :data-img-url="state.imageUrl" lazy-load="true" mode="aspectFit"></image>
      <image class="no-balance" :src="state.imagesPath.soldOutIcon" v-if="props.goods.balance <= 0 && props.goods.business !== 'DISTRIBUTION'"></image>
    </view>
    <view class="gm-goods-info" :style="{ alignItems: props.alignStyle === 'center' ? 'center' : 'flex-start' }">
      <view class="gm-goods-name" :style="{ justifyContent: props.alignStyle === 'center' ? 'center' : 'flex-start' }">
        <view>
          {{ props.goods.name }}
        </view>
      </view>
      <text class="gm-goods-desc">{{ props.goods.description || '' }}</text>
      <view style="display: flex; justify-content: flex-start; align-items: center;">
        <view class="gm-goods-name">
          <block v-for="(item, index) in props.goods.produtlabel" :key="index" v-if="index < 3">
            <text 
              v-if="item.labelName && !item.imageUrl" 
              :style="{ backgroundColor: `rgb(${item.color})` }"
            >
              {{ item.labelName }}
            </text>
            <image 
              v-else-if="item.imageUrl" 
              style="height: 100%" 
              mode="heightFix" 
              :src="item.imageUrl"
            />
          </block>
        </view>
        <view class="gm-goods-labels" v-if="!props.recommed">
          <view v-for="(item, index) in props.goods.promotions" :key="index" :data-id="index">
            <view 
              :style="{ borderColor: `rgb(${item.color})` }" 
              class="items"
            >
              {{ item.labelName }}
            </view>
            <text>{{ item.labelDetails }}</text>
          </view>
        </view>
      </view>
      <view class="gm-goods-price" v-if="props.goods.sellPrice != null">
        <block v-if="props.goods.promotionPrice != null">
          <text 
            class="nowPrice" 
            :style="{ color: props.activityColor }"
          >
            {{ getDisplayPrice(props.goods) }}<text style="font-size: 20rpx;" v-if="props.goods.style === 'SPEC_PARENT'">起</text>
          </text>
          <view class="vip-price" v-if="props.goods.memberPrice && props.goods.memberPrice < props.goods.promotionPrice && (!props.goods.sellPrice || props.goods.memberPrice < props.goods.sellPrice)">
            <view class="vip-label">
              <image :src="state.imagesPath.iconVipLabel"></image>
              <text>{{ state.vipGradeConfig?.priceLabel }}</text>
            </view>
          </view>
          <view v-if="props.underlinePriceShow !== 'FALSE'" style="display: flex; align-items: center;">
            <text style="text-decoration: line-through">
              ￥{{ props.goods.originalPrice > props.goods.sellPrice ? filters.filtToFix(props.goods.originalPrice) : filters.filtToFix(props.goods.sellPrice) }}
            </text>
          </view>
        </block>
        <block v-else>
          <text 
            class="nowPrice" 
            :style="{ color: props.activityColor }"
          >
            {{ getNormalPrice(props.goods) }}<text style="font-size: 20rpx;" v-if="props.goods.style === 'SPEC_PARENT'">起</text>
          </text>
          <view class="vip-price" v-if="props.goods.memberPrice && props.goods.memberPrice < props.goods.sellPrice">
            <text 
              class="oldPrice" 
              v-if="((props.goods.originalPrice && props.goods.memberPrice < props.goods.originalPrice) || (props.goods.sellPrice && props.goods.memberPrice < props.goods.sellPrice)) && props.underlinePriceShow !== 'FALSE'"
            >
              ￥{{ props.goods.originalPrice ? filters.filtToFix(props.goods.originalPrice) : filters.filtToFix(props.goods.sellPrice) }}
            </text>
            <view class="vip-label">
              <image :src="state.imagesPath.iconVipLabel"></image>
              <text>{{ state.vipGradeConfig?.priceLabel }}</text>
            </view>
          </view>
          <text 
            class="oldPrice" 
            v-else-if="props.goods.originalPrice && props.goods.sellPrice < props.goods.originalPrice && props.underlinePriceShow !== 'FALSE'"
          >
            ￥{{ filters.filtToFix(props.goods.originalPrice) }}
          </text>
        </block>
      </view>
      <form @submit="addToCart" @tap.stop="noop">
        <view class="gm-cart-control" v-if="props.goods.balance > 0 || props.goods.business === 'DISTRIBUTION'">
          <view v-if="props.shopCarType === 'car'" class="add-box" :style="{
            backgroundColor: props.shopCarType !== 'hollow' ? state.themeColor : '#fff',
            border: `1px solid ${state.themeColor}`,
            color: props.shopCarType !== 'hollow' ? '#fff' : state.themeColor
          }">
            <button v-if="!state.hasUserInfo" @tap="getUserInfo"></button>
            <button v-else form-type="submit" :data-add-type="'normal'" 
              :data-balance="props.goods.balance"
              :data-initialpurchasenumber="props.goods.initialPurchaseNumber"
              :data-trace-id="props.goods.traceId"
              :data-style="props.goods.style"
              :data-type="'add'"
              :data-id="props.goods.id"
              :data-business="props.goods.business"
            ></button>
            <text class="cart-count" v-if="props.shopCart[props.goods.id]">
              {{ props.shopCart[props.goods.id] }}
            </text>
            <image v-if="!props.shopCarType || props.shopCarType === 'car'" class="add-img" :src="props.addImage"></image>
          </view>
          <view v-else-if="props.shopCarType !== 'empty'" class="add-box add-box1" :style="{ color: state.themeColor }">
            <button v-if="!state.hasUserInfo" @tap="getUserInfo"></button>
            <button v-else form-type="submit" :data-add-type="'three'" 
              :data-index="i"
              :data-id="props.goods.id"
              :data-style="props.goods.style"
              :data-balance="props.goods.balance"
              :data-business="props.goods.business"
              :data-initialpurchasenumber="props.goods.initialPurchaseNumber"
              :data-trace-id="props.goods.traceId"
            ></button>
            <text class="cart-count" v-if="props.shopCart[props.goods.id]">
              {{ props.shopCart[props.goods.id] }}
            </text>
            <text class="add_text" :class="props.shopCarType !== 'hollow' ? 'icon-jiahao2fill' : 'icon-jiahao'"></text>
          </view>
        </view>
      </form>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
import imagesPath from '@/utils/imagesPath'
import utils from '@/utils/utils'

interface GoodsItem {
  id: string
  name: string
  description?: string
  imageUrl?: string
  sellPrice?: number
  originalPrice?: number
  promotionPrice?: number
  memberPrice?: number
  balance: number
  business: string
  style?: string
  initialPurchaseNumber?: number
  traceId?: string
  produtlabel?: Array<{ labelName: string; color: string; imageUrl?: string }>
  promotions?: Array<{ labelName: string; color: string; labelDetails?: string }>
}

interface Props {
  goods: GoodsItem
  idx?: string
  addImage?: string
  reduceImage?: string
  goodsWidth?: string
  goodsType?: string
  textStyle?: string
  styleType?: string
  alignStyle?: string
  modelMargin?: number
  fillet?: number
  shopCarType?: string
  underlinePriceShow?: string
  shopCart?: Record<string, number>
  hasAnimation?: boolean
  backGroundType?: string
  backGroundColor?: string
  activityColor?: string
  backGroundImgObj?: { imageUrl: string }
  hasUserInfo?: boolean
  recommed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  goods: () => ({ id: '', name: '', balance: 0, business: '' }),
  idx: '',
  addImage: '',
  reduceImage: '',
  goodsWidth: '100%',
  goodsType: 'normal',
  textStyle: 'normal',
  styleType: 'borderless',
  alignStyle: 'left',
  modelMargin: 0,
  fillet: 0,
  shopCarType: 'car',
  underlinePriceShow: 'TRUE',
  shopCart: () => ({}),
  hasAnimation: false,
  backGroundType: 'color',
  backGroundColor: '#fff',
  activityColor: '#ee5253',
  backGroundImgObj: () => ({}),
  hasUserInfo: false,
  recommed: false
})

const emit = defineEmits(['onClickGoods', 'addToCart', 'decrease', 'subscribeArrivalRemind', 'noop', 'getUserInfo'])

const store = useStore()
const state = reactive({
  imagesPath,
  shopCartGoodsId: [] as string[],
  vipGradeConfig: null as any,
  hasEasyRecPlugins: false,
  imageUrl: props.goods.imageUrl || '',
  themeColor: uni.getStorageSync('themeColor') || '#FF8425',
  hasUserInfo: props.hasUserInfo || false
})

// 计算属性
const computedImagesPath = computed(() => imagesPath)

// 生命周期
onMounted(() => {
  initComponent()
})

// 监听 props 变化
watch(() => props.goods, (newVal) => {
  if (newVal) {
    state.imageUrl = newVal.imageUrl || ''
  }
}, { deep: true })

watch(() => props.hasUserInfo, (newVal) => {
  state.hasUserInfo = newVal || false
})

// 方法
const initComponent = () => {
  // 初始化用户信息
  if (store.state.global?.userInfo) {
    state.hasUserInfo = true
  }

  // 获取配置信息
  state.vipGradeConfig = store.state.global?.systemConfigure?.vipGradeConfig
  state.hasEasyRecPlugins = store.state.global?.hasEasyRecPlugins || false
  state.themeColor = store.state.global?.uiConfig?.themeColor || uni.getStorageSync('themeColor') || '#FF8425'
}

const clickGoodsItem = (e: any) => {
  emit('onClickGoods', e.currentTarget.dataset)
}

const addToCart = (e: any) => {
  emit('addToCart', {
    dataset: e.currentTarget.dataset,
    context: this,
    detail: e.detail
  })
}

const decrease = (e: any) => {
  emit('decrease', e.currentTarget.dataset)
}

const subscribeArrivalRemind = (e: any) => {
  emit('subscribeArrivalRemind', e.currentTarget.dataset)
}

const noop = (e: any) => {
  emit('noop', e.currentTarget.dataset)
}

const getUserInfo = (e: any) => {
  emit('getUserInfo', e)
}

const getDisplayPrice = (goods: GoodsItem) => {
  if (goods.sellPrice && goods.sellPrice < (goods.promotionPrice || Infinity)) {
    return goods.memberPrice && goods.memberPrice < goods.sellPrice 
      ? utils.filtToFix(goods.memberPrice) 
      : utils.filtToFix(goods.sellPrice)
  } else {
    return goods.memberPrice && goods.memberPrice < (goods.promotionPrice || Infinity)
      ? utils.filtToFix(goods.memberPrice)
      : utils.filtToFix(goods.promotionPrice || 0)
  }
}

const getNormalPrice = (goods: GoodsItem) => {
  return goods.memberPrice && goods.memberPrice < (goods.sellPrice || Infinity)
    ? utils.filtToFix(goods.memberPrice)
    : goods.sellPrice
      ? utils.filtToFix(goods.sellPrice)
      : goods.originalPrice
        ? utils.filtToFix(goods.originalPrice)
        : '0.00'
}

// 过滤器
const filters = {
  filtToFix: (value: number) => utils.filtToFix(value)
}
</script>

<style scoped>
@import './goods-item.css';
</style>