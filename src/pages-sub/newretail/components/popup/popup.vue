<template>
  <!--components/popup/popup.wxml-->
  <view>
    <view
      v-if="overlayData"
      :class="'overlay-class popup__overlay ' + (props.show ? 'popup--show' : '')"
      :style="props.overlayStyle"
      @click="onClickOverlay"
    ></view>
    <form v-if="props.show && props.form" @submit="onClickOverlay">
      <button form-type="submit" class="submitButton"></button>
    </form>
    <view
      :class="
        'custom-class popup ' +
        (props.position ? 'popup--' + props.position : '') +
        ' ' +
        (props.show ? 'popup--show' : '')
      "
      :style="state.navHeight ? 'top:' + state.navHeight + 'px;' : ''"
    >
      <slot></slot>
    </view>
  </view>
</template>
<script setup>
import _utilsUtilsJs from '@/utils/newretail/utils'
// import { ready } from "@dcloudio/uni-app";
import { reactive, watch } from 'vue'
const props = defineProps({
  show: Boolean,
  overlayStyle: String,
  overlay: {
    type: Boolean,
    value: true,
  },
  noOverlay: {
    type: Boolean,
    value: false,
  },
  closeOnClickOverlay: {
    type: Boolean,
    value: true,
  },
  position: {
    type: String,
    value: 'center',
  },
  form: {
    type: Boolean,
    value: false,
  },
})
let overlayData = true
const app = getApp()
// components/popup/popup.js
const UNTILS = _utilsUtilsJs
// 获取应用实例
const state = reactive({
  navHeight: 0,
})
const emit = defineEmits(['click-overlay', 'close'])

function onClickOverlay(e) {
  emit('click-overlay')
  if (props.closeOnClickOverlay) {
    emit('close')
  }
}

// Watch listeners converted from observers
watch(
  () => props.noOverlay,
  (newVal, oldVal) => {
    // 处理订单支付
    overlayData = newVal == false
  },
  { immediate: true },
)
// Watch listeners converted from observers
watch(
  () => props.position,
  (newVal, oldVal) => {
    // 处理订单支付
    if (newVal === 'top' || newVal === 'top2' || newVal === 'top') {
      state.navHeight = app.globalData.navHeight
    }
  },
  { immediate: true },
)
</script>
<style scoped>
/* components/popup/popup.wxss */
.popup {
  top: 50%;
  left: 50%;
  z-index: 11;
  max-height: 100%;
  /* overflow-y: auto; */
  box-sizing: border-box;
  /* background-color: #fff; */
  -webkit-overflow-scrolling: touch;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
}
.popup,
.popup__overlay {
  display: none;
  position: fixed;
  -webkit-animation: fade-in 0.3s ease;
  animation: fade-in 0.3s ease;
  /* z-index: 9999; */
}
.popup__overlay {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
}
.popup--top {
  width: 100%;
  top: 0;
  right: auto;
  bottom: auto;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
  -webkit-animation-name: popup-top;
  animation-name: popup-top;
}
.popup--top2 {
  width: 100%;
  top: 0;
  right: auto;
  bottom: auto;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
}
.popup--right {
  top: 50%;
  right: 0;
  bottom: auto;
  left: auto;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
  -webkit-animation-name: popup-right;
  animation-name: popup-right;
}
.popup--bottom {
  width: 100%;
  top: auto;
  bottom: 0;
  right: auto;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
  -webkit-animation-name: popup-bottom;
  animation-name: popup-bottom;
}
.popup--left {
  top: 50%;
  right: auto;
  bottom: auto;
  left: 0;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
  -webkit-animation-name: popup-left;
  animation-name: popup-left;
}
.popup--show {
  display: block;
}
@-webkit-keyframes popup-top {
  from {
    -webkit-transform: translate3d(-50%, -100%, 0);
    transform: translate3d(-50%, -100%, 0);
  }
}
@keyframes popup-top {
  from {
    -webkit-transform: translate3d(-50%, -100%, 0);
    transform: translate3d(-50%, -100%, 0);
  }
}
@-webkit-keyframes popup-bottom {
  from {
    -webkit-transform: translate3d(-50%, 100%, 0);
    transform: translate3d(-50%, 100%, 0);
  }
}
@keyframes popup-bottom {
  from {
    -webkit-transform: translate3d(-50%, 100%, 0);
    transform: translate3d(-50%, 100%, 0);
  }
}
@-webkit-keyframes popup-left {
  from {
    -webkit-transform: translate3d(-100%, -50%, 0);
    transform: translate3d(-100%, -50%, 0);
  }
}
@keyframes popup-left {
  from {
    -webkit-transform: translate3d(-100%, -50%, 0);
    transform: translate3d(-100%, -50%, 0);
  }
}
@-webkit-keyframes popup-right {
  from {
    -webkit-transform: translate3d(100%, -50%, 0);
    transform: translate3d(100%, -50%, 0);
  }
}
@keyframes popup-right {
  from {
    -webkit-transform: translate3d(100%, -50%, 0);
    transform: translate3d(100%, -50%, 0);
  }
}
@-webkit-keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
button.submitButton {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background: transparent;
  position: absolute;
  border: 0;
}
button.submitButton::after {
  border: none;
}
</style>
