<template>
  <!--components/product/goods-spec/goods-spec.wxml-->
  <view>
    <view class="spec-box">
      <view class="spec-top-box">
        <view class="spec-img-box">
          <image :src="state.imageUrl" @click="previewImg"></image>
        </view>
        <view class="spec-close-box" @click="handleClose">
          <!-- <image src='{{state.imagesPath.iconCloseImg}}' mode="widthFix"></image> -->
          <image :src="state.imagesPath.category_close" mode="widthFix"></image>
        </view>
        <view class="price-box">
          <view class="price" :style="'color: ' + state.themeColor" v-if="!state.goodSelect">
            <!-- {{state.isTeamPrice ? '拼团价' : ''}}
          {{state.isGrabPrice ? '秒杀价' : ''}}
          {{state.isBargainPrice ? '最低可砍至' : ''}}
          {{state.isSolitairePrice ? '接龙价' : ''}}
          {{!type && props.promotionPrice && (!state.sellPrice || props.promotionPrice < state.sellPrice) && (!props.memberPrice || props.promotionPrice < props.memberPrice) ? '促销价' : ''}}
          {{!type && props.memberPrice && props.memberPrice < state.sellPrice ? vipGradeConfig.priceLabel : ''}} -->
            ￥
            <text>{{ props.minSellPrice }}</text>
            {{ props.minSellPrice == props.maxSellPrice ? '' : '-' }}
            <text v-if="props.minSellPrice < props.maxSellPrice">{{ props.maxSellPrice }}</text>
          </view>
          <view class="price" :style="'color: ' + state.themeColor" v-else-if="state.isTeamPrice">
            拼团价￥
            <text>{{ state.sellPrice }}</text>
          </view>
          <view class="price" :style="'color: ' + state.themeColor" v-else-if="state.isGrabPrice">
            秒杀价￥
            <text>{{ state.sellPrice }}</text>
          </view>
          <view
            class="price"
            :style="'color: ' + state.themeColor"
            v-else-if="state.isBargainPrice"
          >
            最低可砍至￥
            <text>{{ filtToFix(state.sellPrice) }}</text>
          </view>
          <view
            class="price"
            :style="'color: ' + state.themeColor"
            v-else-if="state.isSolitairePrice"
          >
            接龙价￥
            <text>{{ filtToFix(state.sellPrice) }}</text>
          </view>
          <view
            class="price"
            :style="'color: ' + state.themeColor"
            v-else-if="
              !type &&
              props.promotionPrice &&
              (!state.sellPrice || props.promotionPrice < state.sellPrice) &&
              (!props.memberPrice || props.promotionPrice < props.memberPrice)
            "
          >
            促销价￥
            <text>{{ filtToFix(props.promotionPrice) }}</text>
            <text
              v-if="state.originalPrice && state.originalPrice > props.promotionPrice"
              class="old-price"
            >
              ￥{{ state.originalPrice }}
            </text>
          </view>
          <view
            class="price"
            :style="'color: ' + state.themeColor"
            v-else-if="!type && props.memberPrice && props.memberPrice < state.sellPrice"
          >
            {{ vipGradeConfig.priceLabel }}￥
            <text>{{ filtToFix(props.memberPrice) }}</text>
            <text
              v-if="state.originalPrice && state.originalPrice > props.memberPrice"
              class="old-price"
            >
              ￥{{ state.originalPrice }}
            </text>
          </view>
          <view class="price" :style="'color: ' + state.themeColor" v-else>
            ￥
            <text>{{ filtToFix(state.sellPrice) }}</text>
            <text
              v-if="state.originalPrice && state.originalPrice > state.sellPrice"
              class="old-price"
            >
              ￥{{ state.originalPrice }}
            </text>
          </view>
          <view>{{ state.selectText }}</view>
        </view>
      </view>
      <!-- height:' + specsItem.specParams.length * 60 + 'rpx; -->
      <scroll-view
        class="spec-con-box"
        scroll-y="true"
        :style="'min-height:310rpx;max-height: 580rpx;'"
      >
        <view class="spec-section" v-for="(specsItem, col) in state.allSpecs" :key="col">
          <view class="spec-section-name">{{ specsItem.name }}</view>
          <view class="spec-option">
            <view
              :class="
                'spec-option-item ' +
                (item.isSelect ? 'active' : '') +
                ' ' +
                (item.disabled ? 'disabled' : '')
              "
              :style="'background: ' + (item.isSelect ? state.themeColor : '')"
              v-for="(item, opt) in specsItem.specParams"
              :key="opt"
              :data-label="item.value"
              :data-specId="item.specId"
              :data-id="item.id"
              :data-item="opt"
              :data-disabled="item.disabled"
              @click="clickOptionItem"
              v-show="item.status == 'ON'"
            >
              <view v-if="item.disabled" class="balance-no">缺货</view>
              {{ item.value }}
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="choose-product-num">
        <view>数量</view>
        <view class="goods-count-box">
          <view
            @click.stop="handleReduce"
            class="iconfont2 icon-jianhao"
            :style="'color: ' + state.themeColor + ';border-color: ' + state.themeColor + ';'"
          ></view>
          <view class="num">
            <input
              cursor="0"
              selection-start="1"
              selection-end="1"
              :value="state.productNum"
              @input="bindProductNumInput"
              type="number"
              maxlength="3"
            />
          </view>
          <view
            @click.stop="handleAdd"
            class="iconfont2 icon-jiahao2fill"
            :style="'color: ' + state.themeColor + ';'"
          ></view>
        </view>
      </view>
      <view class="spec-button-box">
        <view class="spec-button-box-content">
          <form @submit="confirm" @click.stop="noop">
            <button
              v-if="props.activityType === 'normal'"
              form-type="submit"
              class="spec-button"
              :style="'background: ' + state.themeColor"
              data-addtype="detail"
            >
              确定
            </button>
            <button
              v-else-if="props.activityType === 'secondkill'"
              form-type="submit"
              :class="
                'spec-button ' + (!state.isGrabPrice && state.isImmediatelyGrab ? 'disabled' : '')
              "
              :style="'background: ' + state.themeColor"
              data-addtype="detail"
            >
              确定
            </button>
            <button
              v-else-if="props.activityType === 'group'"
              form-type="submit"
              :class="'spec-button ' + (!state.isTeamPrice ? 'disabled' : '')"
              :style="'background: ' + state.themeColor"
              data-addtype="detail"
            >
              确定
            </button>
            <button
              v-else-if="props.activityType === 'bargain'"
              form-type="submit"
              :class="'spec-button ' + (!state.isBargainPrice ? 'disabled' : '')"
              :style="'background: ' + state.themeColor"
              data-addtype="detail"
            >
              确定
            </button>
            <button
              v-else-if="props.activityType === 'solitaire'"
              form-type="submit"
              :class="'spec-button ' + (!state.isSolitairePrice ? 'disabled' : '')"
              :style="'background: ' + state.themeColor"
              data-addtype="detail"
            >
              确定
            </button>
          </form>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
// import { getTemporaryUrl } from "@/service/api/newretail/subscribeService";
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
// import { ready } from "@dcloudio/uni-app";
import { reactive, watch, onMounted, onBeforeMount } from 'vue'
const app = getApp()
// components/product/goods-spec/goods-spec.js
const IMAGESPATH = _utilsImagesPathJs
const UTILS = _utilsUtilsJs
const themeManager = _utilsThemeManagerJs
const state = reactive({
  originalPrice: '',
  minQty1: 1,
  sellPrice: '',
  imagesPath: IMAGESPATH,
  imageUrl: '',
  select: {},
  selectText: '请选择规格',
  allSpecs: [],
  isTeam: false,
  isSecondkill: false,
  isTeamPrice: false,
  isGrabPrice: false,
  isMemberPrice: false,
  // 是否会员价
  isTeamLeader: false,
  // 是否是团长
  isImmediatelyGrab: false,
  // 是否立即购买
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  isBargain: false,
  isBargainPrice: false,
  isSolitaire: false,
  isSolitairePrice: false,
  vipGradeConfig: null,
  productNum: 1,
})
const emit = defineEmits(['confirm', 'close', 'sendSpecShareImg'])
const props = defineProps({
  goodsImg: {
    type: String,
    value: '',
  },
  minSellPrice: {
    type: Number,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
  },
  maxSellPrice: {
    type: Number,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
  },
  activeSpecId: {
    type: String,
    value: '',
  },
  specs: {
    // 属性名
    type: Array,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    value: [],
    // 属性初始值（可选），如果未指定则会根据类型选择一个
  },
  specDetails: {
    type: Array,
    value: '',
  },
  price: {
    // 属性名
    type: Number,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    value: 0,
    // 属性初始值（可选），如果未指定则会根据类型选择一个
  },
  memberPrice: {
    type: Number,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    value: 0,
    // 属性初始值（可选），如果未指定则会根据类型选择一个
  },
  promotionPrice: {
    // 属性名
    type: Number,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    value: 0,
    // 属性初始值（可选），如果未指定则会根据类型选择一个
  },
  hasSelected: {
    type: Boolean,
    value: false,
  },
  activityType: {
    type: String,
    value: 'normal',
  },
  hasTeamLeader: {
    type: Boolean,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    value: false,
    // 属性初始值（可选），如果未指定则会根据类型选择一个
  },
  hasImmediatelyGrab: {
    type: Boolean,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    value: false,
    // 属性初始值（可选），如果未指定则会根据类型选择一个
  },
  productNum: {
    type: Number,
    value: 1,
  },
  activityData: Object,
  minQty: {
    type: Number,
    value: 1,
  },
  type: {
    type: String,
  },
})
onMounted(function () {
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
})
onBeforeMount(() => {
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
})
function getArrDifference(arr1, arr2) {
  const data = {
    number: null,
    index: null,
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      data.index = i
      data.number = arr2[i]
      break
    }
  }
  return data
}
function clickOptionItem(e) {
  const tempSpecs = state.allSpecs
  const index = e.currentTarget.dataset.item
  const disabled = e.currentTarget.dataset.disabled
  if (disabled) {
    return
  }
  for (let i = 0; i < tempSpecs.length; i++) {
    const item = tempSpecs[i]
    if (item.id === e.currentTarget.dataset.specid) {
      // 改变当前规格选中项的状态
      let isSelect = false
      item.specParams.forEach((ele, i) => {
        if (i === index) {
          ele.isSelect = !ele.isSelect
        } else {
          ele.isSelect = false
        }
        if (ele.isSelect) {
          isSelect = true
        }
      })
      item.isSelect = isSelect
      break
    }
  }
  let selectText = '已选："'
  let count = 0
  let select = 0
  // 规格选中项的下标数组
  const selArr = []
  // 规格选中项的下标数组所有
  const specSelArr = new Array(tempSpecs.length)
  for (let i = 0; i < tempSpecs.length; i++) {
    specSelArr[i] = null
  }
  tempSpecs.forEach((item, j) => {
    if (item.isSelect) {
      item.specParams.forEach((ele, i) => {
        if (ele.isSelect) {
          selectText = selectText + ele.value + ' '
          count++
          selArr.push(i)
          specSelArr[j] = i
        }
      })
      select++
    }
  })
  if (count === 0) {
    selectText = '请选择规格'
  } else {
    selectText = selectText.substring(0, selectText.length - 1)
    selectText = selectText + '"'
  }
  const specDetails = props.specDetails
  let _data2 = specDetails
  let goodSelect = true
  if (select == tempSpecs.length) {
    // 所有的规格项都已选择
    // 需要判断当前商品的门店状态
    selArr.forEach((item) => {
      _data2 = _data2[item]
    })
    const optionalProductArr = []
    // 根据已选的两两组合匹配可选商品的状态 可选数同总规格数
    tempSpecs.forEach((item, i) => {
      item.specParams.forEach((ele, j) => {
        const arr = new Array(selArr.length)
        selArr.forEach((it, k) => {
          arr[k] = it
        })
        arr[i] = j
        optionalProductArr.push(arr)
      })
    })
    for (let i = 0; i < optionalProductArr.length; i++) {
      const ele = optionalProductArr[i]
      let goods = specDetails
      // 所有的规格项都已选择
      ele.forEach((item) => {
        goods = goods[item]
      })
      const difference = getArrDifference(selArr, ele)
      //   console.log(difference)
      //   console.log(specDetails,difference,'goodsgoods');
      if (difference.number != null) {
        if (goods && goods.status && goods.status === 'ON' && goods.balance > 0) {
          tempSpecs[difference.index].specParams[difference.number].disabled = false
        } else {
          tempSpecs[difference.index].specParams[difference.number].disabled = true
        }
      }
    }
    goodSelect = true
  } else if (select == tempSpecs.length - 1) {
    // 生成可选的商品下标数组
    let current = null
    let len = _data2.length
    specSelArr.forEach((it, i) => {
      if (it == null) {
        // 找到空缺的这个规格有几种选择
        current = i
        let spec = specDetails
        for (let j = 0; j < i; j++) {
          spec = spec[specSelArr[j]]
          if (j + 1 == i) {
            len = spec.length
          }
        }
      }
    })
    const newSpecSelArr = []
    for (let i = 0; i < len; i++) {
      const item = []
      specSelArr.forEach((it) => {
        if (it == null) {
          item.push(i)
        } else {
          item.push(it)
        }
      })
      newSpecSelArr.push(item)
    }
    for (let i = 0; i < newSpecSelArr.length; i++) {
      const ele = newSpecSelArr[i]
      let goods = specDetails
      // 所有的规格项都已选择
      ele.forEach((item) => {
        goods = goods[item]
      })
      if (goods && goods.status && goods.status === 'ON' && goods.balance > 0) {
        tempSpecs[current].specParams[i].disabled = false
      } else {
        tempSpecs[current].specParams[i].disabled = true
      }
    }
    goodSelect = false
  } else {
    // 重新判断规格是否可选
    tempSpecs.forEach((ele) => {
      if (ele.specParams) {
        ele.specParams.forEach((item) => {
          let flag = false
          if (specDetails && specDetails.length > 0) {
            flag = specDetails.some((spec) => {
              if (Array.isArray(spec)) {
                return spec.some((spec1) => {
                  if (Array.isArray(spec1)) {
                    return spec1.some((spec2) => {
                      const specFlag = spec2.specParamIds.some((specId) => {
                        return specId == item.id && spec2.balance > 0 && spec2.status == 'ON'
                      })
                      return specFlag
                    })
                  } else {
                    const specFlag = spec1.specParamIds.some((specId) => {
                      return specId == item.id && spec1.balance > 0 && spec1.status == 'ON'
                    })
                    return specFlag
                  }
                })
              } else {
                const specFlag = spec.specParamIds.some((specId) => {
                  return specId == item.id && spec.balance > 0 && spec.status == 'ON'
                })
                return specFlag
              }
            })
          }
          item.disabled = !flag
        })
      }
    })
    // 将不可选的规格重置为可选
    // tempSpecs.forEach(item => {
    //   item.specParams.forEach(ele => {
    //     ele.disabled = false;
    //   })
    // })
    goodSelect = false
  }
  let price = props.price.toFixed(2)
  let isTeamPrice = false
  let isGrabPrice = false
  let isBargainPrice = false
  let isSolitairePrice = false
  if (_data2.sellPrice != null) {
    price = _data2.sellPrice.toFixed(2)
    if (_data2.initialPurchaseNumber && state.productNum < _data2.initialPurchaseNumber) {
      state.productNum = _data2.initialPurchaseNumber
      state.minQty1 = parseFloat(_data2.initialPurchaseNumber)
    } else {
      state.productNum = _data2.initialPurchaseNumber || 1
      state.minQty1 = _data2.initialPurchaseNumber || 1
    }
    if (state.isTeam) {
      const num = _data2.teamMemberJoinCount || 1
      let groupPrice = price
      if (_data2.teamLeaderPrice || _data2.teamMemberPrice) {
        _data2.teamLeaderPrice = _data2.teamLeaderPrice || _data2.teamMemberPrice
        groupPrice = state.isTeamLeader ? _data2.teamLeaderPrice : _data2.teamMemberPrice
        isTeamPrice = true
      } else {
        isTeamPrice = false
        isGrabPrice = false
        isBargainPrice = false
        isSolitairePrice = false
      }
      price = parseFloat((Number(groupPrice) * Number(num)).toFixed(2))
    } else if (state.isSecondkill) {
      let grabPrice = price
      if (_data2.grabPrice) {
        grabPrice = _data2.grabPrice
        isGrabPrice = true
      } else {
        isTeamPrice = false
        isGrabPrice = false
        isBargainPrice = false
        isSolitairePrice = false
      }
      price = parseFloat(Number(grabPrice).toFixed(2))
    } else if (state.isBargain) {
      let lowerPrice = price
      if (_data2.lowerPrice) {
        lowerPrice = _data2.lowerPrice
        isBargainPrice = true
      } else {
        isTeamPrice = false
        isGrabPrice = false
        isBargainPrice = false
        isSolitairePrice = false
      }
      price = parseFloat(Number(lowerPrice).toFixed(2))
    } else if (state.isSolitaire) {
      let solitairePrice = price
      if (_data2.solitairePrice) {
        solitairePrice = _data2.solitairePrice
        isSolitairePrice = true
      } else {
        isTeamPrice = false
        isGrabPrice = false
        isBargainPrice = false
        isSolitairePrice = false
      }
      price = parseFloat(Number(solitairePrice).toFixed(2))
    } else {
    }
  } else {
    _data2 = {}
  }
  if (_data2.promotionPrice) {
    state.promotionPrice = _data2.promotionPrice
  } else {
    state.promotionPrice = 0
  }
  if (_data2.memberPrice) {
    state.memberPrice = _data2.memberPrice
  } else {
    state.memberPrice = 0
  }
  state.goodSelect = goodSelect
  state.isTeamPrice = isTeamPrice
  state.isGrabPrice = isGrabPrice
  state.isBargainPrice = isBargainPrice
  state.isSolitairePrice = isSolitairePrice
  const imageUrl = state.goodsImg
  if (_data2.imageUrl != null && _data2.imageUrl !== '') {
    // getTemporaryUrl(data.imageUrl).then(res1 => {
    //     this.setData({
    //         imageUrl: res1
    //     })
    // })
    state.imageUrl = _data2.imageUrl
    state.select = _data2
    state.sellPrice = price
    state.originalPrice = _data2.originalPrice
    state.selectText = selectText
    state.allSpecs = tempSpecs
  } else {
    state.select = _data2
    state.sellPrice = price
    state.originalPrice = _data2.originalPrice
    state.imageUrl = imageUrl
    state.selectText = selectText
    state.allSpecs = tempSpecs
  }
  // 触发自定义
  emit('sendSpecShareImg', {
    imageUrl: state.imageUrl,
    sellPrice: state.sellPrice,
    originalPrice: state.originalPrice,
  })
}
function confirm(e) {
  const specs = state.allSpecs
  let canAdd = true
  let item = null
  for (let i = 0; i < specs.length; i++) {
    const ele = specs[i]
    if (!ele.isSelect) {
      canAdd = false
      item = ele
      break
    }
  }
  if (canAdd) {
    console.log('选中的：', state.select)
    console.log(state.activityType)
    console.log('this.data.isTeam：', state.isTeam)
    if (!(state.select.sellPrice && state.select.sellPrice > 0)) {
      UTILS.showToast('当前门店未上架该规格商品，请选择其他规格~')
      return
    }
    if (state.select.balance > 0) {
      if (state.activityType !== 'normal') {
        if (state.isTeam && !state.isTeamPrice) {
          UTILS.showToast('当前规格未参与拼团活动，请选择其他规格')
          return
        }
        if (state.isTeam && state.select.productCount === 0) {
          UTILS.showToast('当前规格拼团商品数量不足，请选择其他规格')
          return
        }
        if (state.isSecondkill && state.isImmediatelyGrab && !state.isGrabPrice) {
          UTILS.showToast('当前规格未参与秒杀活动，请选择其他规格')
          return
        }
        if (state.isBargain && !state.isBargainPrice) {
          UTILS.showToast('当前规格未参与砍价活动，请选择其他规格')
          return
        }
        if (state.isSecondkill) {
          if (state.select.balance === 0 || state.select.availableStockAmount === 0) {
            let text = '门店正在补货中，请选择其他规格'
            text = state.select.availableStockAmount === 0 ? '当前规格已抢完，请选择其他规格' : text
            UTILS.showToast(text)
            return
          }
        }
        if (state.isBargain) {
          if (state.select.balance === 0 || state.select.availableStockAmount === 0) {
            let text = '门店正在补货中，请选择其他规格'
            text = state.select.availableStockAmount === 0 ? '当前规格已抢完，请选择其他规格' : text
            UTILS.showToast(text)
            return
          }
        }
        if (state.isSolitaire && !state.isSolitairePrice) {
          UTILS.showToast('当前规格未参与接龙活动，请选择其他规格')
          return
        }
        if (state.isSolitaire) {
          if (state.select.balance === 0 || state.select.solitaireBalance === 0) {
            let text = '门店正在补货中，请选择其他规格'
            text = state.select.solitaireBalance === 0 ? '当前规格已抢完，请选择其他规格' : text
            UTILS.showToast(text)
            return
          }
          if (
            state.productNum > state.select.balance ||
            state.productNum > state.select.solitaireBalance
          ) {
            let text = '当前规格门店仅剩' + state.select.balance + '件，请修改购买数量~'
            if (state.select.balance > state.select.solitaireBalance) {
              if (state.productNum > state.select.balance) {
                // 提示门店库存不足
              } else if (
                state.productNum > state.select.solitaireBalance &&
                state.productNum < state.select.balance
              ) {
                // 提示活动库存不足
                text = '当前规格活动仅剩' + state.select.solitaireBalance + '件，请修改购买数量~'
              }
            } else {
              // 活动库存比门店库存大
              // 提示门店库存不足
            }
            UTILS.showToast(text)
            return
          }
        }
      }
      emit('confirm', {
        ...state.select,
        selectText: state.selectText,
        productNum: state.productNum,
      })
    } else {
      uni.showToast({
        title: '门店正在补货中，请选择其他规格~',
        icon: 'none',
        duration: 2000,
      })
    }
  } else {
    uni.showToast({
      title: '您还没有选择' + item.name + '~',
      icon: 'none',
      duration: 2000,
    })
  }
}
function noop(e) {}
function handleClose(e) {
  emit('close', {
    close: true,
  })
}
function previewImg() {
  uni.previewImage({
    urls: [state.imageUrl],
  })
}
function bindProductNumInput(e) {
  const productNum = e.detail.value
  state.productNum = productNum
  if (state.minQty1 && state.minQty1 > productNum) {
    state.productNum = state.minQty1
  }
}
function handleSelectData() {
  const tempSpecs = state.allSpecs
  let selectText = '已选："'
  let count = 0
  let select = 0
  // 规格选中项的下标数组
  const selArr = []
  // 规格选中项的下标数组所有
  const specSelArr = new Array(tempSpecs.length)
  for (let i = 0; i < tempSpecs.length; i++) {
    specSelArr[i] = null
  }
  tempSpecs.forEach((item, j) => {
    if (item.isSelect) {
      item.specParams.forEach((ele, i) => {
        if (ele.isSelect) {
          selectText = selectText + ele.value + ' '
          count++
          selArr.push(i)
          specSelArr[j] = i
        }
      })
      select++
    }
  })
  if (count === 0) {
    selectText = '请选择规格'
  } else {
    selectText = selectText.substring(0, selectText.length - 1)
    selectText = selectText + '"'
  }
  const specDetails = props.specDetails
  let _data3 = specDetails
  if (select == tempSpecs.length) {
    // 所有的规格项都已选择
    selArr.forEach((item) => {
      _data3 = _data3[item]
    })
  }
  let price = props.price.toFixed(2)
  let isTeamPrice = false
  let isGrabPrice = false
  let isSolitairePrice = false
  let isBargainPrice = false
  if (_data3.sellPrice != null) {
    price = _data3.sellPrice.toFixed(2)
    if (state.isTeam) {
      const num = _data3.teamMemberJoinCount || 1
      let groupPrice = price
      if (_data3.teamLeaderPrice || _data3.teamMemberPrice) {
        _data3.teamLeaderPrice = _data3.teamLeaderPrice || _data3.teamMemberPrice
        groupPrice = state.isTeamLeader ? _data3.teamLeaderPrice : _data3.teamMemberPrice
        isTeamPrice = true
      } else {
        isTeamPrice = false
        isGrabPrice = false
        isSolitairePrice = false
      }
      price = parseFloat((Number(groupPrice) * Number(num)).toFixed(2))
    } else if (state.isSecondkill) {
      let grabPrice = price
      if (_data3.grabPrice) {
        grabPrice = _data3.grabPrice
        isGrabPrice = true
      } else {
        if (_data3 && _data3.length > 0) {
          _data3.forEach((item) => {
            if (item.grabPrice < grabPrice || !grabPrice) {
              grabPrice = item.grabPrice
            }
          })
          isTeamPrice = false
          isGrabPrice = true
          isSolitairePrice = false
        } else {
          isTeamPrice = false
          isGrabPrice = false
          isSolitairePrice = false
        }
      }
      price = parseFloat(Number(grabPrice).toFixed(2))
      console.log(price, 'price')
    } else if (state.isSolitaire) {
      let solitairePrice = price
      if (_data3.solitairePrice) {
        solitairePrice = _data3.solitairePrice
        isSolitairePrice = true
      } else {
        isTeamPrice = false
        isGrabPrice = false
        isBargainPrice = false
        isSolitairePrice = false
      }
      price = parseFloat(Number(solitairePrice).toFixed(2))
    } else if (state.memberPrice && state.memberPrice < state.sellPrice) {
      let memberPrice = price
      if (_data3.memberPrice) {
        memberPrice = _data3.memberPrice
        isMemberPrice = true
      } else {
        isTeamPrice = false
        isGrabPrice = false
        isBargainPrice = false
        isSolitairePrice = false
      }
      price = parseFloat(Number(memberPrice).toFixed(2))
    }
  } else {
    if (_data3 && _data3.length > 0) {
      _data3.forEach((item) => {
        if (item.grabPrice < price || !price) {
          price = item.grabPrice
        }
      })
      isGrabPrice = true
    }
    _data3 = {}
  }
  let imageUrl = state.goodsImg
  if (_data3.imageUrl != null && _data3.imageUrl !== '') {
    imageUrl = _data3.imageUrl
  }
  state.select = _data3
  state.sellPrice = price
  state.originalPrice = _data3.originalPrice
  state.imageUrl = imageUrl
  state.selectText = selectText
  state.allSpecs = tempSpecs
  state.isTeamPrice = isTeamPrice
  state.isGrabPrice = isGrabPrice
  state.isSolitairePrice = isSolitairePrice
}
function handleReduce() {
  const self = this
  let productNum = state.productNum
  if ((!state.minQty1 || productNum > state.minQty1) && productNum > 1) {
    productNum--
    state.productNum = productNum
  }
}
function handleAdd() {
  const self = this
  let productNum = state.productNum
  const specs = state.allSpecs
  let canAdd = true
  let item = null
  for (let i = 0; i < specs.length; i++) {
    const ele = specs[i]
    if (!ele.isSelect) {
      canAdd = false
      item = ele
      break
    }
  }
  if (canAdd) {
    if (productNum >= state.select.balance || productNum >= state.select.solitaireBalance) {
      if (
        state.activityData &&
        state.activityData.memberLimit > 0 &&
        state.activityData.memberLimit <= productNum
      ) {
        UTILS.showToast('已达最大限购数量')
      } else {
        let text = '当前规格门店仅剩' + state.select.balance + '件~'
        if (state.select.balance > state.select.solitaireBalance) {
          if (productNum >= state.select.balance) {
            // 提示门店库存不足
          } else if (
            productNum >= state.select.solitaireBalance &&
            productNum < state.select.balance
          ) {
            // 提示活动库存不足
            text = '当前规格活动仅剩' + state.select.solitaireBalance + '件~'
          }
        } else {
          // 活动库存比门店库存大
          // 提示门店库存不足
        }
        UTILS.showToast(text)
      }
    } else {
      if (
        state.activityData &&
        state.activityData.memberLimit > 0 &&
        state.activityData.memberLimit <= productNum
      ) {
        UTILS.showToast('已达最大限购数量')
      } else {
        productNum++
        state.productNum = productNum
      }
    }
  } else {
    UTILS.showToast('请先选择规格~')
  }
}

// Watch listeners converted from observers
watch(
  () => props.goodsImg,
  (newVal, oldVal) => {
    state.imageUrl = newVal
  },
  { immediate: true },
)

watch(
  () => props.activeSpecId,
  (newVal, oldVal) => {},
)

watch(
  () => props.specs,
  (newVal, oldVal) => {
    // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    const tempList = []
    let text = '已选："'
    let goodSelect = true
    newVal.forEach((ele) => {
      // 判断规格状态
      if (ele.status === 'ENABLE') {
        const tempData = {
          ...ele,
          isSelect: false,
          specParams: [],
        }
        ele.specParams.forEach((item) => {
          let flag = false
          let specStatus = 'OFF'
          if (props.specDetails && props.specDetails.length > 0) {
            flag = props.specDetails.some((spec) => {
              if (Array.isArray(spec)) {
                return spec.some((spec1) => {
                  if (Array.isArray(spec1)) {
                    return spec1.some((spec2) => {
                      const specFlag = spec2.specParamIds.some((specId) => {
                        if (specId == item.id && spec2.status == 'ON') {
                          specStatus = spec2.status
                        }
                        return specId == item.id && spec2.balance > 0 && spec2.status == 'ON'
                      })
                      return specFlag
                    })
                  } else {
                    const specFlag = spec1.specParamIds.some((specId) => {
                      if (specId == item.id && spec1.status == 'ON') {
                        specStatus = spec1.status
                      }
                      return specId == item.id && spec1.balance > 0 && spec1.status == 'ON'
                    })
                    return specFlag
                  }
                })
              } else {
                const specFlag = spec.specParamIds.some((specId) => {
                  if (specId == item.id && spec.status == 'ON') {
                    specStatus = spec.status
                  }
                  return specId == item.id && spec.balance > 0 && spec.status == 'ON'
                })
                return specFlag
              }
            })
          }
          let isSelectFlag = false
          if (props.activeSpecId) {
            const selectFlag = props.specDetails.some((spec) => {
              if (Array.isArray(spec)) {
                return spec.some((spec1) => {
                  if (Array.isArray(spec1)) {
                    return spec1.some((spec2) => {
                      const specFlag = spec2.specParamIds.some((specId) => {
                        return specId == item.id && props.activeSpecId == spec2.productId
                      })
                      if (specFlag) {
                        state.select = spec2
                        state.sellPrice = spec2.sellPrice
                        state.originalPrice = spec2.originalPrice
                        state.promotionPrice = spec2.promotionPrice
                        state.memberPrice = spec2.memberPrice
                      }
                      return specFlag
                    })
                  } else {
                    const specFlag = spec1.specParamIds.some((specId) => {
                      return specId == item.id && state.activeSpecId == spec1.productId
                    })
                    if (specFlag) {
                      state.select = spec1
                      state.sellPrice = spec1.sellPrice
                      state.originalPrice = spec1.originalPrice
                      state.promotionPrice = spec1.promotionPrice
                      state.memberPrice = spec1.memberPrice
                    }
                    return specFlag
                  }
                })
              } else {
                const specFlag = spec.specParamIds.some((specId) => {
                  return specId == item.id && state.activeSpecId == spec.productId
                })
                if (specFlag) {
                  state.select = spec
                  state.sellPrice = spec.sellPrice
                  state.originalPrice = spec.originalPrice
                  state.promotionPrice = spec.promotionPrice
                  state.memberPrice = spec.memberPrice
                }
                return specFlag
              }
              // if(spec.specParamIds[0] == item.id && this.data.activeSpecId == spec.productId) {
              //   this.setData({
              //     select: spec
              //   })
              // }
              // return spec.specParamIds[0] == item.id && this.data.activeSpecId == spec.productId
            })
            if (selectFlag) {
              tempData.isSelect = true
              isSelectFlag = true
              text += item.value + ';'
              console.log(text, 'texttext')
            }
          }
          tempData.specParams.push({
            ...item,
            status: specStatus,
            isSelect: isSelectFlag,
            disabled: !flag,
          })
        })
        state.selectText = text + '"'
        if (!tempData.isSelect) {
          goodSelect = false
        }
        tempList.push(tempData)
      }
    })
    state.allSpecs = tempList
    state.goodSelect = goodSelect
  },
  { immediate: true },
)

watch(
  () => props.specDetails,
  (newVal, oldVal) => {
    let sellPrice = state.sellPrice ? parseFloat(state.sellPrice) : state.sellPrice
    if (state.isSecondkill) {
      newVal.forEach((item) => {
        if (item.grabPrice < sellPrice || !state.sellPrice) {
          sellPrice = item.grabPrice
        }
      })
      state.sellPrice = sellPrice.toFixed(2)
      state.isGrabPrice = true
    }
  },
  { immediate: true },
)

watch(
  () => props.price,
  (newVal, oldVal) => {
    // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    if (newVal < parseFloat(state.sellPrice) || !state.sellPrice) {
      state.sellPrice = newVal.toFixed(2)
    }
  },
)

watch(
  () => props.memberPrice,
  (newVal, oldVal) => {
    // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    if (newVal < state.sellPrice || !state.sellPrice) {
      state.memberPrice = newVal.toFixed(2)
    }
  },
)

watch(
  () => props.promotionPrice,
  (newVal, oldVal) => {
    // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    if (newVal < state.sellPrice || !state.sellPrice) {
      state.promotionPrice = newVal.toFixed(2)
    }
  },
)

watch(
  () => props.hasSelected,
  (newVal, oldVal) => {
    const self = this
    if (newVal === true) {
      const tempSpecs = state.allSpecs
      let selectText = '已选："'
      let count = 0
      let select = 0
      // 规格选中项的下标数组
      const selArr = []
      tempSpecs.forEach((item) => {
        item.isSelect = true
        item.specParams[0].isSelect = true
        selectText = selectText + item.specParams[0].value + ' '
        count++
        selArr.push(0)
        select++
      })
      if (count === 0) {
        selectText = '请选择规格'
      } else {
        selectText = selectText.substring(0, selectText.length - 1)
        selectText = selectText + '"'
      }
      const specDetails = props.specDetails
      let _data = specDetails
      if (select == tempSpecs.length) {
        // 所有的规格项都已选择
        selArr.forEach((item) => {
          _data = _data[item]
        })
      }
      let price = props.price.toFixed(2)
      let isTeamPrice = false
      let isGrabPrice = false
      console.log(_data.sellPrice, 'data.sellPricedata.sellPrice')
      if (_data.sellPrice != null) {
        price = _data.sellPrice.toFixed(2)
        if (state.isTeam) {
          const num = state.productNum || 1
          price = parseFloat((Number(price) * Number(num)).toFixed(2))
          isTeamPrice = true
        } else {
          isTeamPrice = false
          isGrabPrice = false
        }
      } else {
        _data = {}
      }
      state.isTeamPrice = isTeamPrice
      state.isGrabPrice = isGrabPrice
      let imageUrl = state.goodsImg
      if (_data.imageUrl != null && _data.imageUrl !== '') {
        imageUrl = _data.imageUrl
      }
      state.select = _data
      state.sellPrice = price
      state.originalPrice = _data.originalPrice
      state.imageUrl = imageUrl
      state.selectText = selectText
      state.allSpecs = tempSpecs
    }
  },
)

watch(
  () => props.activityType,
  (newVal, oldVal) => {
    if (newVal === 'group') {
      state.isTeam = true
    } else if (newVal === 'secondkill') {
      state.isSecondkill = true
      state.isGrabPrice = true
      let sellPrice = state.sellPrice ? parseFloat(state.sellPrice) : state.sellPrice
      if (state.isSecondkill) {
        props.specDetails.forEach((item) => {
          if (item.grabPrice < sellPrice) {
            sellPrice = item.grabPrice
            state.sellPrice = sellPrice.toFixed(2)
            state.originalPrice = item.originalPrice
            console.log('newValnewVal1', state.sellPrice, state.isGrabPrice)
          }
        })
      }
    } else if (newVal === 'bargain') {
      state.isBargain = true
    } else if (newVal === 'solitaire') {
      state.isSolitaire = true
    } else {
      state.isTeam = false
      state.isSecondkill = false
      state.isBargain = false
      state.isSolitaire = false
    }
    // 处理已选商品的价格等数据
    handleSelectData()
  },
)

watch(
  () => props.hasTeamLeader,
  (newVal, oldVal) => {
    // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    state.isTeamLeader = newVal
  },
)

watch(
  () => props.hasImmediatelyGrab,
  (newVal, oldVal) => {
    // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    state.isImmediatelyGrab = newVal
  },
)

watch(
  () => props.productNum,
  (newVal, oldVal) => {
    state.productNum = props.productNum
    // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    if (newVal === 0) {
      state.productNum = 1
    }
  },
)

watch(
  () => props.minQty,
  (newVal, oldVal) => {
    if (newVal && newVal > state.minQty1) {
      state.productNum = newVal
      state.minQty1 = newVal
    }
  },
)
</script>
<style scoped>
/* components/product/goods-spec/goods-spec.wxss */
/* @import '../../../app.wxss'; */
.spec-box {
  width: 100%;
  /* height: 750rpx; */
  /* height: 840rpx; */
  max-height: 70%;
  margin-top: 80rpx;
  background: #fff;
  position: relative;
  border-radius: 30rpx 30rpx 0 0;
}
.spec-top-box {
  width: 100%;
  height: auto;
}
.spec-img-box {
  position: absolute;
  width: 200rpx;
  height: 200rpx;
  left: 23rpx;
  top: 40rpx;
}
.spec-img-box image {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
}
.spec-close-box {
  height: 80rpx;
  width: 80rpx;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
  top: 0;
}
.spec-close-box image {
  height: 29rpx;
  width: 29rpx;
}
.price-box {
  width: 702rpx;
  box-sizing: border-box;
  padding: 91rpx 0 36rpx 220rpx;
  margin-left: 20rpx;
  font-size: 30rpx;
  color: #333333;
  line-height: 48rpx;
}
.price-box .price {
  font-size: 34rpx;
  color: #009f55;
  line-height: 48rpx;
  margin-bottom: 20rpx;
}
.price-box .price text {
  font-size: 48rpx;
}
.spec-con-box {
  padding: 0 24rpx;
  width: 702rpx;
}
.spec-section {
  padding: 15rpx 0;
  width: 702rpx;
}
.spec-section-name {
  font-size: 30rpx;
  color: #333333;
  margin-bottom: 10rpx;
  font-weight: 600;
  line-height: 38rpx;
}
.spec-option {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 14rpx 0;
}
.spec-option-item {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  font-size: 28rpx;
  color: #333;
  line-height: 60rpx;
  height: 60rpx;
  background: #f2f2f2;
  border-radius: 8rpx;
  padding: 0 20rpx;
  min-width: 94rpx;
  text-align: center;
  box-sizing: content-box;
  margin: 10rpx 27rpx 10rpx 0;
}
.spec-option .active {
  background: #009f55;
  color: #ffffff;
}
.spec-option .disabled {
  /* opacity: 30%; */
  /* background: #fafafa; */
  /* text-decoration: line-through; */
  color: #cdcdcd;
  background: #fbfbfb;
}
.spec-button-box {
  /* position: absolute;
  left: 0rpx;
  bottom: 40rpx; */
  height: 138rpx;
  /* width: 600rpx; */
  width: 100%;
  padding: 0 20rpx 40rpx;
  border-radius: 98rpx;
  overflow: hidden;
  box-sizing: border-box;
}
.spec-button-box-content {
  width: 100%;
  border-radius: 98rpx;
  overflow: hidden;
}
.spec-button {
  height: 100%;
  width: 100%;
  background: #009f55;
  color: #fff;
  border-radius: 0;
  padding: 0;
  font-size: 36rpx;
  line-height: 98rpx;
  text-align: center;
}
.spec-button.disabled {
  background: rgba(0, 159, 85, 0.5);
}
.spec-button::after {
  border: none;
}
.choose-product-num {
  /* position: absolute;
    bottom: 100rpx; */
  width: calc(100% - 24rpx - 24rpx);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 108rpx;
  border-top: 1px solid #f7f4f8;
  border-bottom: 1px solid #f7f4f8;
  margin: 30rpx 24rpx 66rpx 24rpx;
  background-color: #fff;
}
.goods-count-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.goods-count-box > view {
  width: 64rpx;
  height: 50rpx;
  background: #f7f4f8;
  margin: 0 4rpx;
  font-size: 36rpx;
  line-height: 50rpx;
  color: #999699;
  text-align: center;
  border-radius: 3rpx;
}
.goods-count-box .iconfont2 {
  font-size: 50rpx;
}
.goods-count-box > view.num {
  color: #908d90;
  min-width: 44rpx;
  padding: 0 10rpx;
  font-size: 30rpx;
  margin-top: 20rpx;
}
.goods-count-box > view {
  width: 39rpx;
  height: 39rpx;
  border-radius: 20rpx;
  text-align: center;
  font-size: 36rpx;
  background: #fdfdfd;
  color: #ff9f43;
  line-height: 34rpx;
  display: flex;
  justify-content: center;
}
.goods-count-box > view.num {
  width: 64rpx;
  height: 50rpx;
  margin: 0 4rpx;
  line-height: 50rpx;
  color: #333;
  text-align: center;
  border-radius: 3rpx;
  min-width: 44rpx;
  padding: 0 10rpx;
  font-size: 24rpx;
}
.price-box .price .old-price {
  height: 24rpx;
  margin-top: 13rpx;
  margin-left: 10rpx;
  font-size: 24rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  text-decoration: line-through;
}
.balance-no {
  position: absolute;
  right: 8rpx;
  top: -12rpx;
  background-color: #ececec;
  font-size: 20rpx;
  height: 30rpx;
  line-height: 30rpx;
  padding: 0 4rpx;
  border-radius: 8rpx;
  color: #999;
}
</style>
