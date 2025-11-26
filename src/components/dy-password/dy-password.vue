<script lang="ts" setup>
import { changePassword } from '@/utils/aes/jsencrypt'
import { md5 } from 'js-md5'
import { useToast } from 'wot-design-uni/index'

const toast = useToast()
const props = defineProps({
  title: {
    type: String,
    default: '请输入支付密码',
  },
  decoration: {
    type: String,
    default: '',
  },
  maxlength: {
    type: Number,
    default: 6,
  },
  showPwd: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
  warpStyle: {
    type: String,
    default: '',
  },
  aes: {
    type: Boolean,
    default: false,
  },
  mask: {
    type: Boolean,
    default: true,
  },
  randomKeyOrder: {
    type: Boolean,
    default: true,
  },
  repeat: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits<{
  (e: 'submit', value: any): void
  (e: 'update:modelValue', value: any): string
  (e: 'update:showPwd', value: any): string
  (e: 'close', value: boolean): void
}>()

const value = ref('')
const showKeyboard = ref(true)
const visible = ref(true)
const show = ref(false)
const repeatNum = ref(0)
const repeatValue = ref('')
const errorInfo = ref('')

const showKeyBoard = () => {
  visible.value = true
}
const close = () => {
  if (!props.mask) {
    return
  }
  show.value = false
  visible.value = false
  showKeyboard.value = false
  emit('update:showPwd', false)
  emit('close', value.value.length === 6)
}

const init = () => {
  if (props.showPwd) {
    show.value = true
    showKeyboard.value = true
    visible.value = true
  } else {
    show.value = false
    showKeyboard.value = false
    visible.value = false
  }
  repeatNum.value = 0
  value.value = ''
}
watch(value, (newVal) => {
  if (value.value.length === 6) {
    const newvalue = props.aes ? changePassword(value.value) : value.value
    emit('update:modelValue', newvalue)
    if (props.repeat > 0) {
      console.log('当前输入次数>>>>>>>>>>', repeatNum.value)
      console.log('新密码>>>>>>>>>>', newvalue)

      if (repeatNum.value === props.repeat) {
        console.log('🧀====', repeatValue.value, value.value)
        if (repeatValue.value === value.value) {
          emit('submit', md5(newvalue))
          errorInfo.value = ''
          close()
        } else {
          value.value = ''
          toast.error('密码不一致')
          errorInfo.value = '密码不一致'
        }
      } else if (repeatNum.value === 0) {
        console.log('当前输入次数>>>>>>>>>>', repeatNum.value)
        value.value = ''
        toast.show('请再次输入确认密码！')
        errorInfo.value = '请再次输入确认密码！'
        repeatValue.value = newvalue
      }
      repeatNum.value++
      if (repeatNum.value > props.repeat) {
        repeatNum.value = 0
      }
    } else {
      console.log('🍦<<<<<<<<<<')
      emit('submit', md5(newvalue))
      close()
    }
  }
})
watch(
  () => props.showPwd,
  (newVal) => {
    init()
  },
  { immediate: true },
)
</script>

<template>
  <view class="">
    <wd-popup
      v-model="show"
      position="bottom"
      :safe-area-inset-bottom="true"
      :custom-class="'rounded-t-10px  h-400px bg-#f5f5f5!  ' + props.warpStyle"
      :close-on-click-modal="props.mask"
      @close="close"
    >
      <view class="px-10px">
        <view class="py-10px">
          <view class="text-center py-10px">{{ props.title }}</view>
          <view class="text-center py-10px" v-if="props.decoration">{{ props.decoration }}</view>
        </view>
        <!-- 密码输入框 -->
        <wd-password-input
          v-model="value"
          info="密码为 6 位数字"
          :error-info="errorInfo"
          :gutter="10"
          @focus="showKeyBoard"
        />
        <!-- 数字键盘 -->
        <wd-number-keyboard
          v-model:visible="visible"
          v-model="value"
          :show="showKeyboard"
          :maxlength="props.maxlength"
          :hide-on-click-outside="false"
          :random-key-order="props.randomKeyOrder"
          @close="close"
          safeAreaInsetBottom
        >
          <template #title>
            <text style="color: red">自定义标题</text>
          </template>
        </wd-number-keyboard>
      </view>
    </wd-popup>
    <wd-toast />
  </view>
</template>
