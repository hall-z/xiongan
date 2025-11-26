<script setup lang="ts">
import { ref, computed, watch, onMounted, defineProps, defineEmits, withDefaults } from 'vue'
import { showToast } from '@/utils/toast'
import { getTemporaryUrl } from '@/api/subscribeService'
import { useTheme } from '@/composables/useTheme'
import { useSystemConfig } from '@/composables/useSystemConfig'

// 类型定义
interface SpecParam {
  id: string
  specId: string
  value: string
  status: string
  isSelect: boolean
  disabled: boolean
}

interface Spec {
  id: string
  name: string
  status: string
  isSelect: boolean
  specParams: SpecParam[]
}

interface SpecDetail {
  productId: string
  specParamIds: string[]
  sellPrice: number
  originalPrice: number
  promotionPrice?: number
  memberPrice?: number
  grabPrice?: number
  teamLeaderPrice?: number
  teamMemberPrice?: number
  lowerPrice?: number
  solitairePrice?: number
  balance: number
  solitaireBalance?: number
  availableStockAmount?: number
  status: string
  imageUrl?: string
  initialPurchaseNumber?: number
  teamMemberJoinCount?: number
  productCount?: number
}

interface VipGradeConfig {
  priceLabel: string
}

interface Props {
  goodsImg: string
  minSellPrice: number
  maxSellPrice: number
  activeSpecId: string
  specs: Spec[]
  specDetails: SpecDetail[]
  price: number
  memberPrice: number
  promotionPrice: number
  hasSelected: boolean
  activityType: string
  hasTeamLeader: boolean
  hasImmediatelyGrab: boolean
  productNum: number
  activityData?: any
  minQty: number
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  goodsImg: '',
  minSellPrice: 0,
  maxSellPrice: 0,
  activeSpecId: '',
  specs: () => [],
  specDetails: () => [],
  price: 0,
  memberPrice: 0,
  promotionPrice: 0,
  hasSelected: false,
  activityType: 'normal',
  hasTeamLeader: false,
  hasImmediatelyGrab: false,
  productNum: 1,
  minQty: 1,
  type: ''
})

const emit = defineEmits<{
  (e: 'confirm', data: SpecDetail & { selectText: string; productNum: number }): void
  (e: 'close', data: { close: boolean }): void
  (e: 'sendSpecShareImg', data: { imageUrl: string; sellPrice: string; originalPrice: string }): void
}>()

// 响应式数据
const { themeColor } = useTheme()
const { vipGradeConfig } = useSystemConfig()
const imageUrl = ref(props.goodsImg)
const select = ref<SpecDetail>({} as SpecDetail)
const selectText = ref('请选择规格')
const allSpecs = ref<Spec[]>([])
const isTeam = ref(false)
const isSecondkill = ref(false)
const isTeamPrice = ref(false)
const isGrabPrice = ref(false)
const isMemberPrice = ref(false)
const isTeamLeader = ref(props.hasTeamLeader)
const isImmediatelyGrab = ref(props.hasImmediatelyGrab)
const isBargain = ref(false)
const isBargainPrice = ref(false)
const isSolitaire = ref(false)
const isSolitairePrice = ref(false)
const productNum = ref(props.productNum)
const minQty1 = ref(props.minQty)
const originalPrice = ref('')
const sellPrice = ref('')
const goodSelect = ref(false)

// 计算属性
const currentPrice = computed(() => {
  if (!goodSelect.value) {
    return `${props.minSellPrice}${props.minSellPrice === props.maxSellPrice ? '' : '-'}${props.minSellPrice < props.maxSellPrice ? props.maxSellPrice : ''}`
  }
  
  if (isTeamPrice.value) return `拼团价￥${sellPrice.value}`
  if (isGrabPrice.value) return `秒杀价￥${sellPrice.value}`
  if (isBargainPrice.value) return `最低可砍至￥${formatPrice(sellPrice.value)}`
  if (isSolitairePrice.value) return `接龙价￥${formatPrice(sellPrice.value)}`
  
  if (!props.type && props.promotionPrice && 
      (!sellPrice.value || props.promotionPrice < parseFloat(sellPrice.value)) && 
      (!props.memberPrice || props.promotionPrice < props.memberPrice)) {
    return `促销价￥${formatPrice(props.promotionPrice)}`
  }
  
  if (!props.type && props.memberPrice && props.memberPrice < parseFloat(sellPrice.value)) {
    return `${vipGradeConfig.value?.priceLabel || '会员价'}￥${formatPrice(props.memberPrice)}`
  }
  
  return `￥${formatPrice(sellPrice.value)}`
})

const showOldPrice = computed(() => {
  return originalPrice.value && parseFloat(originalPrice.value) > parseFloat(sellPrice.value)
})

// 方法
const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num.toFixed(2)
}

const getArrDifference = (arr1: number[], arr2: number[]) => {
  const data = { number: null, index: null }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      data.index = i
      data.number = arr2[i]
      break
    }
  }
  return data
}

const clickOptionItem = (specId: string, index: number, disabled: boolean) => {
  if (disabled) return

  const tempSpecs = [...allSpecs.value]
  let foundSpec = false

  for (let i = 0; i < tempSpecs.length; i++) {
    const item = tempSpecs[i]
    if (item.id === specId) {
      foundSpec = true
      let isSelect = false
      
      item.specParams.forEach((ele, j) => {
        ele.isSelect = j === index ? !ele.isSelect : false
        if (ele.isSelect) isSelect = true
      })
      
      item.isSelect = isSelect
      break
    }
  }

  if (foundSpec) {
    updateSelection(tempSpecs)
  }
}

const updateSelection = (tempSpecs: Spec[]) => {
  let selectText = '已选："'
  let count = 0
  let selectCount = 0
  const selArr: number[] = []
  const specSelArr: (number | null)[] = new Array(tempSpecs.length).fill(null)

  tempSpecs.forEach((item, j) => {
    if (item.isSelect) {
      item.specParams.forEach((ele, i) => {
        if (ele.isSelect) {
          selectText += ele.value + ' '
          count++
          selArr.push(i)
          specSelArr[j] = i
        }
      })
      selectCount++
    }
  })

  if (count === 0) {
    selectText = '请选择规格'
  } else {
    selectText = selectText.substring(0, selectText.length - 1) + '"'
  }

  const specDetails = props.specDetails
  let data: any = specDetails
  let currentGoodSelect = true

  if (selectCount === tempSpecs.length) {
    selArr.forEach(item => {
      data = data[item]
    })
    updateOptionalProducts(tempSpecs, selArr, specDetails)
    currentGoodSelect = true
  } else if (selectCount === tempSpecs.length - 1) {
    // 处理部分选择逻辑
    currentGoodSelect = false
  } else {
    // 重新判断规格是否可选
    updateSpecAvailability(tempSpecs, specDetails)
    currentGoodSelect = false
  }

  updatePriceAndSelection(data, tempSpecs, selectText, currentGoodSelect)
}

const updateOptionalProducts = (tempSpecs: Spec[], selArr: number[], specDetails: SpecDetail[]) => {
  // 生成可选商品数组并更新规格状态
  const optionalProductArr: number[][] = []
  
  tempSpecs.forEach((item, i) => {
    item.specParams.forEach((ele, j) => {
      const arr = [...selArr]
      arr[i] = j
      optionalProductArr.push(arr)
    })
  })

  optionalProductArr.forEach(ele => {
    let goods = specDetails
    ele.forEach(item => {
      goods = goods[item]
    })
    
    const difference = getArrDifference(selArr, ele)
    if (difference.number !== null && difference.index !== null) {
      const isAvailable = goods && goods.status === "ON" && goods.balance > 0
      tempSpecs[difference.index].specParams[difference.number].disabled = !isAvailable
    }
  })
}

const updateSpecAvailability = (tempSpecs: Spec[], specDetails: SpecDetail[]) => {
  tempSpecs.forEach(ele => {
    ele.specParams.forEach(item => {
      let flag = false
      if (specDetails && specDetails.length > 0) {
        flag = specDetails.some(spec => {
          // 简化版可用性检查
          return spec.specParamIds.some(specId => 
            specId === item.id && spec.balance > 0 && spec.status === 'ON'
          )
        })
      }
      item.disabled = !flag
    })
  })
}

const updatePriceAndSelection = (data: SpecDetail, tempSpecs: Spec[], text: string, currentGoodSelect: boolean) => {
  let price = props.price.toFixed(2)
  let isTeamPriceLocal = false
  let isGrabPriceLocal = false
  let isBargainPriceLocal = false
  let isSolitairePriceLocal = false

  if (data?.sellPrice != null) {
    price = data.sellPrice.toFixed(2)
    
    if (data.initialPurchaseNumber && productNum.value < data.initialPurchaseNumber) {
      productNum.value = data.initialPurchaseNumber
      minQty1.value = data.initialPurchaseNumber
    }

    // 处理各种价格类型
    if (isTeam.value) {
      handleTeamPrice(data, price)
      isTeamPriceLocal = true
    } else if (isSecondkill.value) {
      handleSecondkillPrice(data, price)
      isGrabPriceLocal = true
    } else if (isBargain.value) {
      handleBargainPrice(data, price)
      isBargainPriceLocal = true
    } else if (isSolitaire.value) {
      handleSolitairePrice(data, price)
      isSolitairePriceLocal = true
    }
  }

  // 更新响应式数据
  isTeamPrice.value = isTeamPriceLocal
  isGrabPrice.value = isGrabPriceLocal
  isBargainPrice.value = isBargainPriceLocal
  isSolitairePrice.value = isSolitairePriceLocal
  goodSelect.value = currentGoodSelect

  const newImageUrl = data?.imageUrl && data.imageUrl !== "" ? data.imageUrl : props.goodsImg
  imageUrl.value = newImageUrl
  
  select.value = data || {}
  sellPrice.value = price
  originalPrice.value = data?.originalPrice?.toString() || ''
  selectText.value = text
  allSpecs.value = tempSpecs

  emit('sendSpecShareImg', {
    imageUrl: newImageUrl,
    sellPrice: price,
    originalPrice: originalPrice.value
  })
}

const handleTeamPrice = (data: SpecDetail, price: string) => {
  if (data.teamLeaderPrice || data.teamMemberPrice) {
    const groupPrice = isTeamLeader.value ? data.teamLeaderPrice : data.teamMemberPrice
    const num = data.teamMemberJoinCount || 1
    sellPrice.value = (Number(groupPrice) * num).toFixed(2)
  }
}

const handleSecondkillPrice = (data: SpecDetail, price: string) => {
  if (data.grabPrice) {
    sellPrice.value = data.grabPrice.toFixed(2)
  }
}

const handleBargainPrice = (data: SpecDetail, price: string) => {
  if (data.lowerPrice) {
    sellPrice.value = data.lowerPrice.toFixed(2)
  }
}

const handleSolitairePrice = (data: SpecDetail, price: string) => {
  if (data.solitairePrice) {
    sellPrice.value = data.solitairePrice.toFixed(2)
  }
}

const confirm = () => {
  if (!validateSelection()) return

  const selectedSpec = select.value
  if (!selectedSpec.sellPrice || selectedSpec.sellPrice <= 0) {
    showToast("当前门店未上架该规格商品，请选择其他规格~")
    return
  }

  if (!validateActivitySpecificRules(selectedSpec)) return

  emit('confirm', {
    ...selectedSpec,
    selectText: selectText.value,
    productNum: productNum.value
  })
}

const validateSelection = (): boolean => {
  const specs = allSpecs.value
  for (const ele of specs) {
    if (!ele.isSelect) {
      showToast(`您还没有选择${ele.name}~`)
      return false
    }
  }
  return true
}

const validateActivitySpecificRules = (selectedSpec: SpecDetail): boolean => {
  if (props.activityType !== 'normal') {
    if (isTeam.value && !isTeamPrice.value) {
      showToast("当前规格未参与拼团活动，请选择其他规格")
      return false
    }
    // 其他活动类型的验证逻辑...
  }
  return true
}

const handleClose = () => {
  emit('close', { close: true })
}

const previewImg = () => {
  // Vue中需要不同的图片预览实现
  console.log('预览图片:', imageUrl.value)
}

const handleReduce = () => {
  if ((!minQty1.value || productNum.value > minQty1.value) && productNum.value > 1) {
    productNum.value--
  }
}

const handleAdd = () => {
  if (!validateAddQuantity()) return
  
  if (hasReachedLimit()) {
    showStockLimitMessage()
    return
  }

  productNum.value++
}

const validateAddQuantity = (): boolean => {
  const specs = allSpecs.value
  for (const ele of specs) {
    if (!ele.isSelect) {
      showToast("请先选择规格~")
      return false
    }
  }
  return true
}

const hasReachedLimit = (): boolean => {
  const selectedSpec = select.value
  return productNum.value >= selectedSpec.balance || 
         (selectedSpec.solitaireBalance && productNum.value >= selectedSpec.solitaireBalance)
}

const showStockLimitMessage = () => {
  const selectedSpec = select.value
  let text = `当前规格门店仅剩${selectedSpec.balance}件~`
  
  if (selectedSpec.balance > (selectedSpec.solitaireBalance || 0) && 
      productNum.value >= (selectedSpec.solitaireBalance || 0) && 
      productNum.value < selectedSpec.balance) {
    text = `当前规格活动仅剩${selectedSpec.solitaireBalance}件~`
  }
  
  showToast(text)
}

// 观察器
watch(() => props.goodsImg, (newVal) => {
  imageUrl.value = newVal
})

watch(() => props.specs, (newVal) => {
  processSpecs(newVal)
}, { deep: true })

watch(() => props.activityType, (newVal) => {
  updateActivityType(newVal)
})

watch(() => props.hasTeamLeader, (newVal) => {
  isTeamLeader.value = newVal
})

// 初始化
onMounted(() => {
  processSpecs(props.specs)
})

const processSpecs = (newSpecs: Spec[]) => {
  const tempList: Spec[] = []
  let text = '已选："'
  let currentGoodSelect = true

  newSpecs.forEach(ele => {
    if (ele.status === 'ENABLE') {
      const tempData: Spec = {
        ...ele,
        isSelect: false,
        specParams: []
      }

      ele.specParams.forEach(item => {
        let flag = false
        let specStatus = 'OFF'

        if (props.specDetails && props.specDetails.length > 0) {
          flag = props.specDetails.some(spec => {
            return spec.specParamIds.some(specId => 
              specId === item.id && spec.balance > 0 && spec.status === 'ON'
            )
          })
        }

        const isSelectFlag = checkIfSelected(item.id)
        if (isSelectFlag) {
          tempData.isSelect = true
          text += item.value + ';'
        }

        tempData.specParams.push({
          ...item,
          status: specStatus,
          isSelect: isSelectFlag,
          disabled: !flag
        })
      })

      if (!tempData.isSelect) {
        currentGoodSelect = false
      }
      tempList.push(tempData)
    }
  })

  allSpecs.value = tempList
  goodSelect.value = currentGoodSelect
  selectText.value = currentGoodSelect ? text + '"' : '请选择规格'
}

const checkIfSelected = (paramId: string): boolean => {
  if (!props.activeSpecId) return false
  
  return props.specDetails.some(spec => 
    spec.specParamIds.some(specId => 
      specId === paramId && props.activeSpecId === spec.productId
    )
  )
}

const updateActivityType = (type: string) => {
  isTeam.value = type === "group"
  isSecondkill.value = type === "secondkill"
  isBargain.value = type === "bargain"
  isSolitaire.value = type === "solitaire"
  
  if (!isTeam.value && !isSecondkill.value && !isBargain.value && !isSolitaire.value) {
    isTeam.value = false
    isSecondkill.value = false
    isBargain.value = false
    isSolitaire.value = false
  }
  
  handleSelectData()
}

const handleSelectData = () => {
  // 处理已选数据的逻辑
}
</script>

<template>
  <div class="spec-box">
    <div class="spec-top-box">
      <div class="spec-img-box">
        <img :src="imageUrl" @click="previewImg" alt="商品图片">
      </div>
      <div class="spec-close-box" @click="handleClose">
        <img src="@/assets/images/category_close.png" alt="关闭">
      </div>
      <div class="price-box">
        <div class="price" :style="{ color: themeColor }">
          {{ currentPrice }}
          <span v-if="showOldPrice" class="old-price">￥{{ originalPrice }}</span>
        </div>
        <div>{{ selectText }}</div>
      </div>
    </div>
    
    <div class="spec-con-box">
      <div v-for="(specsItem, col) in allSpecs" :key="col" class="spec-section">
        <div class="spec-section-name">{{ specsItem.name }}</div>
        <div class="spec-option">
          <div
            v-for="(item, opt) in specsItem.specParams"
            :key="opt"
            v-show="item.status === 'ON'"
            class="spec-option-item"
            :class="{ active: item.isSelect, disabled: item.disabled }"
            :style="{ background: item.isSelect ? themeColor : '' }"
            @click="clickOptionItem(specsItem.id, opt, item.disabled)"
          >
            <div v-if="item.disabled" class="balance-no">缺货</div>
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="choose-product-num">
      <div>数量</div>
      <div class="goods-count-box">
        <div class="iconfont icon-jianhao" @click="handleReduce" :style="{ color: themeColor, borderColor: themeColor }"></div>
        <div class="num">
          <input
            v-model="productNum"
            type="number"
            maxlength="3"
            @input="(e) => productNum = Math.max(minQty1, parseInt(e.target.value) || minQty1)"
          >
        </div>
        <div class="iconfont icon-jiahao2fill" @click="handleAdd" :style="{ color: themeColor }"></div>
      </div>
    </div>
    
    <div class="spec-button-box">
      <div class="spec-button-box-content">
        <button
          v-if="activityType === 'normal'"
          class="spec-button"
          :style="{ background: themeColor }"
          @click="confirm"
        >确定</button>
        
        <button
          v-else-if="activityType === 'secondkill'"
          class="spec-button"
          :class="{ disabled: !isGrabPrice && isImmediatelyGrab }"
          :style="{ background: themeColor }"
          @click="confirm"
        >确定</button>
        
        <button
          v-else-if="activityType === 'group'"
          class="spec-button"
          :class="{ disabled: !isTeamPrice }"
          :style="{ background: themeColor }"
          @click="confirm"
        >确定</button>
        
        <button
          v-else-if="activityType === 'bargain'"
          class="spec-button"
          :class="{ disabled: !isBargainPrice }"
          :style="{ background: themeColor }"
          @click="confirm"
        >确定</button>
        
        <button
          v-else-if="activityType === 'solitaire'"
          class="spec-button"
          :class="{ disabled: !isSolitairePrice }"
          :style="{ background: themeColor }"
          @click="confirm"
        >确定</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spec-box {
  width: 100%;
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

.spec-img-box img {
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

.spec-close-box img {
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
  max-height: 580rpx;
  overflow-y: auto;
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
  cursor: pointer;
}

.spec-option .active {
  background: #009f55;
  color: #ffffff;
}

.spec-option .disabled {
  color: #cdcdcd;
  background: #fbfbfb;
  cursor: not-allowed;
}

.spec-button-box {
  height: 138rpx;
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
  border: none;
  cursor: pointer;
}

.spec-button.disabled {
  background: rgba(0, 159, 85, 0.5);
  cursor: not-allowed;
}

.choose-product-num {
  width: calc(100% - 48rpx);
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

.goods-count-box > div {
  width: 64rpx;
  height: 50rpx;
  background: #f7f4f8;
  margin: 0 4rpx;
  font-size: 36rpx;
  line-height: 50rpx;
  color: #999699;
  text-align: center;
  border-radius: 3rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.goods-count-box .iconfont {
  font-size: 50rpx;
  cursor: pointer;
}

.goods-count-box .num {
  color: #908d90;
  min-width: 44rpx;
  padding: 0 10rpx;
  font-size: 30rpx;
  margin-top: 20rpx;
}

.goods-count-box .num input {
  width: 100%;
  height: 100%;
  text-align: center;
  border: none;
  background: transparent;
  font-size: 24rpx;
}

.price-box .price .old-price {
  height: 24rpx;
  margin-top: 13rpx;
  margin-left: 10rpx;
  font-size: 24rpx;
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
  l