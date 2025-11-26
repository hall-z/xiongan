<template>
  <view class="pay-component">
    <!-- 支付密码弹窗 -->
    <dy-popup
      v-model:show="state.show.cardPassword"
      position="center"
      :close-on-click-overlay="false"
      @close="toggleCardPasswordPopup"
    >
      <view class="password-popup">
        <view class="popup-header">
          <text class="title">请输入支付密码</text>
          <text class="close-icon" @tap="toggleCardPasswordPopup">×</text>
        </view>
        <view class="popup-content">
          <dy-password-input
            v-model="state.password"
            :length="6"
            :focus="state.inputData.get_focus"
            @complete="handlePasswordComplete"
          />
        </view>
        <view class="popup-footer">
          <button class="confirm-btn" @tap="confirmPayment">确认支付</button>
          <button class="forgot-btn" @tap="handleResetPassword">忘记密码</button>
        </view>
      </view>
    </dy-popup>

    <!-- 支付超时弹窗 -->
    <dy-popup
      v-model:show="state.show.timeOut"
      position="center"
      @close="toggle('timeOut')"
    >
      <view class="timeout-popup">
        <view class="timeout-content">
          <image :src="state.imagesPath.timeoutIcon" class="timeout-icon"></image>
          <text class="timeout-text">支付超时，请重新支付</text>
        </view>
        <view class="timeout-footer">
          <button class="timeout-btn" @tap="toggle('timeOut')">确定</button>
        </view>
      </view>
    </dy-popup>
  </view>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import imagesPath from '@/utils/imagesPath'
import utils from '@/utils/utils'
import { useRouter } from '@/hooks/useRouter'

interface Props {
  orderData?: any
  payMethod?: any
  storedValueCard?: any
  payType?: string
  path?: string
  orderCancel?: boolean
  orderPay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  payType: 'normal',
  path: 'perfectOrder',
  orderCancel: false,
  orderPay: false
})

const emit = defineEmits([
  'orderCancel', 
  'orderPay', 
  'loadingChange',
  'continuePay',
  'myevent'
])

const store = useStore()
const router = useRouter()

const state = reactive({
  imagesPath,
  showPassFlag: store.state.global?.systemConfigure?.isRechargePasswordEnabled || false,
  show: {
    cardPassword: false,
    timeOut: false
  },
  password: '',
  inputData: {
    input_value: "",
    value_length: 0,
    isNext: false,
    get_focus: false,
    focus_class: false,
    value_num: [1, 2, 3, 4, 5, 6],
    height: "92rpx",
    width: "592rpx",
    see: false,
    interval: true,
  },
  order: null as any,
  orderTimeId: null as any,
  theme: {
    color: '#FF9F43',
    mainColor: 'color: #FF9F43;',
    mainBgColor: 'background: #FF9F43;',
    borderColor: 'border-color: #FF9F43;',
    mainBgGradient: 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
    mainColorRgb: 'color: rgba(255, 159, 67, 0.4);',
    borderColorRgb: 'border-color: rgba(255, 159, 67, 0.4);',
    mainColorRgb02: 'rgba(255, 159, 67, 0.2)',
    BgColorRgb01: 'background-color: rgba(255, 159, 67, 0.1);',
  }
})

// 监听props变化
watch(() => props.orderData, (newVal) => {
  if (newVal) {
    handleOrderPay(newVal)
  }
})

watch(() => props.orderCancel, (newVal) => {
  if (newVal) {
    emit('orderCancel', newVal)
  }
})

watch(() => props.orderPay, (newVal) => {
  if (newVal) {
    emit('orderPay', newVal)
  }
})

// 组件挂载
onMounted(() => {
  initTheme()
})

// 初始化主题颜色
const initTheme = () => {
  const themeColor = store.state.global?.uiConfig?.themeColor || uni.getStorageSync('themeColor') || '#FF9F43'
  state.theme = {
    color: themeColor,
    mainColor: `color: ${themeColor};`,
    mainBgColor: `background: ${themeColor};`,
    borderColor: `border-color: ${themeColor};`,
    mainBgGradient: `background: linear-gradient(-270deg, ${themeColor}, ${themeColor});`,
    mainColorRgb: `color: ${colorRgba(themeColor, 0.4)};`,
    borderColorRgb: `border-color: ${colorRgba(themeColor, 0.4)};`,
    mainColorRgb02: colorRgba(themeColor, 0.2),
    BgColorRgb01: `background-color: ${colorRgba(themeColor, 0.1)};`,
  }
}

// 颜色转换工具函数
const colorRgba = (sHex: string, alpha = 1) => {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  let sColor = sHex.toLowerCase()
  
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    return `rgba(${sColorChange.join(',')}, ${alpha})`
  }
  return sColor
}

// 处理订单支付
const handleOrderPay = (order: any) => {
  console.log('处理订单支付:', order)
  state.order = order

  if (props.path === "order" && order.orderNum) {
    getDetailsById(order.parentId)
    return
  }

  handleOrderDetails(order)
}

// 查询订单详情
const getDetailsById = async (id: string) => {
  try {
    // 这里需要引入 orderService
    // const res = await orderService.getDetailsById(id)
    // if (res) {
    //   handleOrderDetails(res)
    // }
  } catch (e) {
    utils.showToast('获取订单详情失败')
  }
}

// 处理订单详情
const handleOrderDetails = (res: any) => {
  state.order = res
  
  // 检查订单状态
  if (!['CREATED', 'WAITPAYBALANCE', '待付款', '待付尾款'].includes(res.status)) {
    handleInvalidOrderStatus(res.status)
    return
  }

  console.log('订单详情:', res)
  
  // 预售订单处理
  if (res.type === 'ADVANCE_SELL') {
    handleAdvanceSellOrder(res)
    return
  }

  // 组合支付处理
  if (res.payments && res.payments.length > 0) {
    const cardPayInfo = res.payments.find((item: any) => 
      item.payMethod === 'CARDPAY' && item.status === 'CREATED'
    )
    
    if (cardPayInfo) {
      handleCardPayment(res, cardPayInfo)
    } else {
      getWXPay(res)
    }
  } else if (res.cashTotal === 0) {
    getOrderStatusById(res.id)
  }
}

// 处理无效订单状态
const handleInvalidOrderStatus = (status: string) => {
  const statusMessages = {
    'CANCELED': '订单已作废，不用再次支付~',
    '已取消': '订单已作废，不用再次支付~',
    'REJECTED': '订单已退货，不用再次支付~',
    '已退款': '订单已退货，不用再次支付~',
    'RETURNING': '订单退换货中，不用再次支付~',
    '待自提': '订单退换货中，不用再次支付~'
  }

  const message = statusMessages[status] || '订单已经支付，不用再次支付~'
  utils.showToast(message)
}

// 处理预售订单
const handleAdvanceSellOrder = (order: any) => {
  if (order.status === 'CREATED' || order.status === '待付款') {
    if (order.balanceTotal != null && order.balanceTotal > 0) {
      getUnifiedpay(order, "FIRST_ADVANCE_SELL")
    } else {
      getUnifiedpay(order)
    }
  } else if (order.status === 'WAITPAYBALANCE' || order.status === '待付尾款') {
    toPayTail(order)
  }
}

// 处理储值卡支付
const handleCardPayment = (order: any, cardPayInfo: any) => {
  if (state.showPassFlag) {
    toggleCardPasswordPopup()
  } else {
    state.order = order
    confirmPayment()
  }
}

// 弹窗控制
const toggle = (type: keyof typeof state.show) => {
  state.show[type] = !state.show[type]
}

const toggleCardPasswordPopup = () => {
  toggle('cardPassword')
}

// 密码输入完成
const handlePasswordComplete = (value: string) => {
  state.password = value
}

// 确认支付
const confirmPayment = () => {
  if (!state.password && state.showPassFlag) {
    utils.showToast('请输入支付密码~')
    state.inputData.get_focus = true
    state.inputData.focus_class = true
    return
  }

  toggleCardPasswordPopup()
  
  if (state.order.cashTotal > (props.storedValueCard?.balance || 0)) {
    getCombinedPay(state.order)
  } else {
    getCardPay(state.order)
  }
}

// 忘记密码
const handleResetPassword = () => {
  router.navigateTo('/pages-sub/newretail/pages/mallModule/myCard/resetPassword/resetPassword?active=1')
}

// 微信支付
const getWXPay = async (order: any) => {
  // 实现微信支付逻辑
}

// 组合支付
const getCombinedPay = async (order: any) => {
  // 实现组合支付逻辑
}

// 储值卡支付
const getCardPay = async (order: any) => {
  // 实现储值卡支付逻辑
}

// 统一支付
const getUnifiedpay = async (order: any, entry = "ORDER") => {
  // 实现统一支付逻辑
}

// 尾款支付
const toPayTail = async (order: any) => {
  // 实现尾款支付逻辑
}

// 查询订单状态
const getOrderStatusById = (orderId: string) => {
  // 实现订单状态查询逻辑
}

// 支付成功跳转
const toPaymentSuccess = (orderId: string) => {
  // 实现支付成功跳转逻辑
}
</script>

<style scoped>
.password-popup {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  width: 600rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-icon {
  font-size: 40rpx;
  color: #999;
}

.popup-footer {
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.confirm-btn {
  background: var(--theme-color, #FF9F43);
  color: #fff;
  border-radius: 8rpx;
  height: 80rpx;
  line-height: 80rpx;
}

.forgot-btn {
  background: transparent;
  color: #999;
  border: none;
}

.timeout-popup {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  width: 500rpx;
  text-align: center;
}

.timeout-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 20rpx;
}

.timeout-text {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.timeout-btn {
  background: var(--theme-color, #FF9F43);
  color: #fff;
  border-radius: 8rpx;
  height: 80rpx;
  line-height: 80rpx;
}
</style>