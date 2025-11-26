<template>
  <!-- components/setMeal/setMeal.wxml -->
  <view>
    <popup
      :show="show.middle"
      position="bottom"
      custom-class="bottom"
      @close="toggleMiddlePopup"
      @touchmove.stop="catchtouchmove"
    >
      <view class="setMeal-box">
        <view class="setMeal-header">
          <view class="setMeal-title">{{ name }}</view>
          <view class="spec-close-box" @click="toggleMiddlePopup">
            <image :src="state.imagesPath.iconCloseImg" mode="widthFix"></image>
          </view>
        </view>
        <scroll-view class="setMeal-content-box" scroll-y="" style="height: 980rpx">
          <view class="section" v-for="(groupItem, index) in cateringGroupProducts" :key="index">
            <view class="section-title">
              {{ groupItem.groupName }}{{ groupItem.required ? ' (必选)' : '' }}
            </view>
            <view class="goods-list">
              <view v-for="(item, idx) in groupItem.mealDetails" :key="idx">
                <view
                  :class="'goods-item ' + (item.defalutChoose ? 'active' : '')"
                  :style="
                    'border: 2px solid ' + (item.defalutChoose ? themeColor : '#E4E4E4') + ';'
                  "
                  :data-exist="item.exist"
                  :data-index="index"
                  :data-productId="item.productId"
                  @click="onClickMealGroupGoods"
                >
                  <view class="goods-img">
                    <image style="width: 100%" :src="item.url" mode="widthFix"></image>
                  </view>
                  <view class="goods-info">
                    <text class="goods-name">
                      {{ item.productCount > 1 ? item.productCount + 'x ' : ''
                      }}{{ item.productName }}
                    </text>
                    <text class="goods-price">
                      <text>￥{{ filters.filterAbs(item.price) }}</text>
                      <text
                        class="old-price"
                        v-if="item.originalPrice && item.originalPrice > item.price"
                      >
                        ￥{{ filters.filterAbs(item.originalPrice) || 20 }}
                      </text>
                    </text>
                    <!-- <text class='goods-price' wx:if="{{idx != 0 && item.showPrice != '0.00'}}"><text> {{item.showPrice > 0? '+':'-'}}￥{{filters.filterAbs(item.showPrice)}}</text></text> -->
                  </view>
                  <view
                    class="goods-check"
                    :style="
                      'background: ' +
                      (item.defalutChoose ? themeColor : '#fff') +
                      ';border: 1px solid ' +
                      (item.defalutChoose ? themeColor : '#999') +
                      ';'
                    "
                  >
                    <image
                      v-if="item.defalutChoose"
                      style="width: 11px"
                      :src="truepng"
                      mode="widthFix"
                    ></image>
                  </view>
                  <image
                    class="no-balance"
                    mode="widthFix"
                    :src="imagesPath.soldOutIcon"
                    v-if="!item.exist"
                  ></image>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="setMeal-bottom">
          <form @submit="_addShopcart" @click.stop="_emptyMethods">
            <view class="setMeal-bottom-box" :style="'background: ' + themeColor">
              <view class="setMeal-price">
                ¥
                <text>{{ filtToFix(totalPrice) }}</text>
              </view>
              <button form-type="submit">{{ operateFun }}</button>
            </view>
            <!-- <button style="background: {{themeColor}}" form-type="submit">选好了</button> -->
          </form>
        </view>
      </view>
    </popup>
  </view>
</template>
<script setup>
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import truepng from '@/utils/newretail/image/true.png'
// import { attached, ready } from "@dcloudio/uni-app";
import { watch, reactive, onBeforeMount } from 'vue'
import popup from '../popup/popup.vue'
const app = getApp()
// components/setMeal/setMeal.js
const productService = _apiProductServiceJs
const shopcartService = _apiShopcartServiceJs
const utils = _utilsUtilsJs
const themeManager = _utilsThemeManagerJs
const IMGAGESPATH = _utilsImagesPathJs
// 获取应用实例
let canAddToCart = true
const filtToFix = (value) => {
  if (!value) return '0.00'
  return parseFloat(value).toFixed(2)
}
const state = reactive({
  show: {
    middle: false,
  },
  imagesPath: IMGAGESPATH,
  name: '',
  cateringGroupProducts: [],
  productId: '',
  isAdd: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  totalPrice: 0,
})
const props = defineProps({
  show: {
    type: Boolean,
    value: false,
  },
  productId: String,
  storeId: String,
  onClickChoice: {
    type: Boolean,
    value: true,
  },
  scource: {
    type: String,
    value: 'SHOPPINGCART',
  },
  operateFun: {
    type: String,
    value: '加入购物车',
  },
})
const _data = {
  storeId: '',
}
onBeforeMount(() => {
  console.log('123attached', app.globalData.uiconfig.themeColor)
  canAddToCart = true
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor') || '#FF9F43'
})
function _getDetailsById(productId) {
  productService
    .getCateringDetailsById(productId, state.storeId)
    .then((res) => {
      // 处理组合商品的数据 第一个商品不展示价格，后面的商品 +- 第一个价格
      const tempData = res.cateringGroupProducts
      tempData.forEach((item) => {
        if (item.mealDetails && item.mealDetails.length > 0) {
          // 计算第一个基础价格 先将价格乘以 100 转为整数，避免小数计算
          const basePrice =
            Math.round(item.mealDetails[0].price * 100) * item.mealDetails[0].productCount
          item.mealDetails.forEach((ele) => {
            // 先将价格乘以 100 转为整数，避免小数计算
            const priceInCents = Math.round(ele.price * 100)
            // 计算总金额（分）
            const totalInCents = priceInCents * ele.productCount
            // 添加显示价格 // 转回元为单位，保留两位小数
            ele.showPrice = ((totalInCents - basePrice) / 100).toFixed(2)
          })
        }
      })
      state.name = res.name
      state.cateringGroupProducts = tempData
      state.productId = res.id
      toggleMiddlePopup()
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
      })
    })
}
function _onClickChoice() {
  triggerEvent('choice-result')
  if (state.onClickChoice) {
    triggerEvent('choice')
  }
}
function _chooseOutcome(val) {
  triggerEvent('outcome-result')
  let outcome = {
    outcome: val,
  }
  if (state.onClickChoice) {
    if (state.isAdd) {
      outcome = {
        outcome: true,
      }
      triggerEvent('outcome', outcome)
      state.isAdd = false
    } else {
      outcome = {
        outcome: false,
      }
      triggerEvent('outcome', outcome)
    }
  }
  if (val) {
    state.show = false
  }
}
function chooseOutcomeBuyNow(val) {
  const outcome = {
    outcome: true,
    product: val,
  }
  if (state.onClickChoice) {
    console.log(state.isAdd, outcome)
    if (state.isAdd) {
      triggerEvent('outcome', outcome)
      state.isAdd = false
    } else {
      outcome.outcome = false
      triggerEvent('outcome', outcome)
    }
  }
  if (val) {
    state.show = false
  }
}
function _emptyMethods() {}
function _addShopcart(val) {
  if (!canAddToCart) {
    return false
  }
  canAddToCart = false
  const self = this
  const cateringGroupProducts = state.cateringGroupProducts
  const goodsList = []
  let mealCanBuy = true
  let unBuyGoods = null
  let unChoiceGroup = null
  let hasSharingPersonId = false
  const mealDetails = []
  if (cateringGroupProducts && cateringGroupProducts.length > 0) {
    const groupProductList = []
    for (let i = 0; i < cateringGroupProducts.length; i++) {
      const item = cateringGroupProducts[i]
      if (item.mealDetails && item.mealDetails.length > 0) {
        let count = 0 // 记录当前套餐组被选中的商品数量
        for (let j = 0; j < item.mealDetails.length; j++) {
          const ele = item.mealDetails[j]
          if (ele.defalutChoose) {
            if (ele.exist == true && ele.storeBalance > 0) {
              // 组合商品 价格，名称
              const tempData = {
                groupId: item.groupId,
                groupProductId: ele.productId,
                productName: ele.productName,
                productPrice: ele.price,
                groupProductCount: ele.productCount,
              }
              mealDetails.push(ele.productName)
              groupProductList.push(tempData)
              count++
            } else {
              mealCanBuy = false
              unBuyGoods = ele
              break
            }
          }
        }
        // 如果当前套餐组为必选，用户没有选中套餐组下的商品，返回结果
        if (item.required === true && count === 0) {
          mealCanBuy = false
          unChoiceGroup = item
          break
        }
      }
    }
    const tempData = {
      count: 1,
      mealDetails: groupProductList,
      productId: state.productId,
    }
    if (app.globalData.isShoppingGuidanceRecordGoods) {
      // 获取分享人id
      const shareData = utils.getSharingPersonInfo()
      if (shareData && shareData != null && shareData.productId === state.productId) {
        tempData.lists[0].sharingPersonId = shareData.shareId
        hasSharingPersonId = true
      }
    }
    goodsList.push(tempData)
  }
  if (mealCanBuy) {
    const postData = {
      lists: goodsList,
      storeId: state.storeId,
    }
    console.log(state.scource)
    console.log(postData)
    if (state.scource === 'buyNow') {
      // 处理立即购买
      postData.mealDetails = '(' + mealDetails.join('+') + ')'
      if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
        utils.removeSharingPersonInfo()
      }
      toggleMiddlePopup()
      state.isAdd = true
      canAddToCart = true
      chooseOutcomeBuyNow(postData)
      return
    }
    shopcartService
      .cateringAdd(postData)
      .then((res) => {
        canAddToCart = true
        app.globalData.storeIdentification = 'normal'
        app.globalData.isShopCartChange = true
        uni.showToast({
          title: '添加购物车成功~',
          icon: 'none',
          duration: 2000,
        })
        if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
          utils.removeSharingPersonInfo()
        }
        toggleMiddlePopup()
        state.isAdd = true
        _chooseOutcome(true)
      })
      .catch((err) => {
        _chooseOutcome(false)
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  } else {
    if (unBuyGoods) {
      uni.showToast({
        title: unBuyGoods.productName + '已售完',
        icon: 'none',
        duration: 2000,
      })
    } else if (unChoiceGroup) {
      uni.showToast({
        title: unChoiceGroup.groupName + '必选',
        icon: 'none',
        duration: 2000,
      })
    }
    canAddToCart = true
  }
}
function onClickMealGroupGoods(val) {
  const self = this
  const index = val.currentTarget.dataset.index
  const productId = val.currentTarget.dataset.productid
  const exist = val.currentTarget.dataset.exist
  if (!exist) return
  const cateringGroupProducts = state.cateringGroupProducts
  console.log(cateringGroupProducts)
  for (let i = 0; i < cateringGroupProducts.length; i++) {
    if (i == index) {
      const ele = cateringGroupProducts[i]
      console.log(ele)
      if (ele.chooseType === 'SINGLE') {
        const tempList = []
        ele.mealDetails.forEach((item, j) => {
          // console.log(item.productId , productId)
          // if(!item.exist || item.storeBalance <= 0) {
          //     return
          // }
          if (item.productId === productId) {
            item = {
              ...item,
              defalutChoose: !item.defalutChoose,
            }
          } else {
            item = {
              ...item,
              defalutChoose: false,
            }
          }
          tempList.push(item)
        })
        cateringGroupProducts[i].mealDetails = tempList
      } else {
        const tempList = []
        ele.mealDetails.forEach((item, j) => {
          // if(!item.exist || item.storeBalance <= 0) {
          //     return
          // }
          if (item.productId === productId) {
            let count = 0
            for (let k = 0; k < ele.mealDetails.length; k++) {
              const key = ele.mealDetails[k]
              if (key.defalutChoose) {
                count++
              }
            }
            item = {
              ...item,
              defalutChoose: !item.defalutChoose,
            }
            // if (count == 1 && item.defalutChoose) {
            //     console.log(233)
            // } else {
            //   item = {
            //     ...item,
            //     defalutChoose: !item.defalutChoose
            //   }
            // }
          }
          tempList.push(item)
        })
        cateringGroupProducts[i].mealDetails = tempList
      }
    }
  }
  state.cateringGroupProducts = cateringGroupProducts
}
function _propertyChange(newVal, oldVal) {
  if (newVal === true && oldVal === false) {
    onClickShow()
  }
}
function onClickShow() {
  _getDetailsById(state.productId)
}
function toggleMiddlePopup() {
  toggle('middle')
}
function catchtouchmove() {}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
  if (state.show.middle === false) {
    _chooseOutcome(true)
  }
}
watch([state.cateringGroupProducts], function (cateringGroupProducts) {
  // 使用 setData 设置 this.data.some.field 本身或其下任何子数据字段时触发
  // （除此以外，使用 setData 设置 this.data.some 也会触发）
  //   console.log(cateringGroupProducts)
  let total = 0
  cateringGroupProducts.forEach((item) => {
    item.mealDetails.forEach((ele) => {
      if (ele.defalutChoose) {
        total += ele.price * 100 * ele.productCount
      }
    })
  })
  //   console.log(total)
  state.totalPrice = (total / 100).toFixed(2)
})

// Watch listeners converted from observers
watch(
  () => props.show,
  (newVal, oldVal) => {
    // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    _propertyChange(newVal, oldVal)
  },
)
</script>
<style scoped>
/* components/setMeal/setMeal.wxss */
.setMeal-box {
  background: #fff;
  width: 750rpx;
  height: 85%;
  border-radius: 15rpx;
  position: relative;
  padding-bottom: 123rpx;
}
.setMeal-header {
}
.setMeal-title {
  height: 84rpx;
  background: #f1f1f1;
  font-size: 32rpx;
  line-height: 84rpx;
  text-align: center;
  border-top-left-radius: 15rpx;
  border-top-right-radius: 15rpx;
}
.spec-close-box {
  height: 84rpx;
  width: 84rpx;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
  top: 0;
}
.spec-close-box image {
  height: 44rpx;
  width: 44rpx;
}
.setMeal-content-box {
  height: calc(100% - 168rpx);
}
.setMeal-content-box .section:last-of-type {
  padding-bottom: 12rpx;
}
.setMeal-content-box .section-title {
  color: 4b4b4b;
  font-size: 28rpx;
  line-height: 36rpx;
  padding-top: 12rpx;
  padding-left: 28rpx;
}
.setMeal-content-box .goods-list {
  display: flex;
  flex-wrap: wrap;
  width: 690rpx;
  margin: 0 auto;
}
.setMeal-content-box .goods-item {
  width: 205rpx;
  height: 250rpx;
  border: 2px solid #e4e4e4;
  box-sizing: border-box;
  border-radius: 8rpx;
  /* padding: 0 0 20rpx 0; */
  margin: 14rpx 12rpx;
  position: relative;
  overflow: hidden;
}
.setMeal-content-box .goods-item .no-balance {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 125rpx;
}
.setMeal-content-box .goods-item.active {
  border: 4rpx solid #e4e4e4;
}
.setMeal-content-box .goods-img {
  width: 100%;
  height: 125rpx;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0 auto;
}
.setMeal-content-box .goods-img image {
  width: 125rpx;
  height: 125rpx;
}
.setMeal-content-box .goods-img .no-balance {
  position: absolute;
  top: 0;
  left: 0;
}
.goods-item .goods-check {
  width: 13px;
  height: 13px;
  background: #fff;
  /* border: 1px solid red; */
  border-radius: 50%;
  position: absolute;
  right: 10rpx;
  top: 10rpx;
}
.goods-item .goods-check image {
  width: 11px;
  height: 10px;
  position: absolute;
  left: 1px;
  top: 1px;
}
.setMeal-content-box .goods-info {
  padding: 4rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 122rpx;
  box-sizing: border-box;
}
/* .setMeal-content-box .goods-info .goods-name, */
.setMeal-content-box .goods-info .goods-price {
  font-size: 24rpx;
  line-height: 36rpx;
  color: #050806;
  display: block;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.setMeal-content-box .goods-info .goods-name {
  padding: 0 10rpx;
  font-size: 26rpx;
  /* line-height: 36rpx; */
  color: #050806;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制文本显示为2行 */
  overflow: hidden;
  white-space: wrap;
}
.setMeal-content-box .goods-info .goods-price text {
  color: #f82111;
  font-size: 26rpx;
}
.setMeal-content-box .goods-info .goods-price .old-price {
  color: #bbb;
  padding-left: 5rpx;
  text-decoration: line-through;
  font-size: 20rpx;
}
.setMeal-bottom {
  position: absolute;
  left: 50%;
  margin-left: -45%;
  bottom: 38rpx;
  width: 90%;
  height: 84rpx;
}
.setMeal-bottom-box {
  padding: 0 40rpx;
  position: relative;
  border-radius: 84rpx;
}
.setMeal-bottom-box .setMeal-price {
  position: absolute;
  left: 40rpx;
  height: 84rpx;
  line-height: 84rpx;
  color: #fff;
  font-size: 24rpx;
}
.setMeal-bottom-box .setMeal-price text {
  font-size: 30rpx;
}
.setMeal-bottom-box button {
  width: 100%;
  border: 0;
  padding: 0;
  margin: 0 auto;
  background: none;
  color: #fff;
  font-size: 30rpx;
  height: 84rpx;
  line-height: 84rpx;
  text-align: right;
}
.setMeal-bottom-box {
}
</style>
