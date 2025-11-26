<template>
  <view
    v-if="inited"
    class="gm-transition custom-class"
    :style="
      'animation-name: gm-' +
      name +
      '-' +
      type +
      '; animation-duration: ' +
      duration +
      'ms; ' +
      (display ? '' : 'display: none;') +
      ' ' +
      customStyle
    "
    @animationend="onAnimationEnd"
  >
    <slot></slot>
  </view>
</template>
<script setup>
// import { attached } from "@dcloudio/uni-app";
import { reactive, watch } from 'vue'
const state = reactive({
  type: '',
  inited: false,
  display: false,
})
const options = {
  addGlobalClass: true,
}
const externalClasses = ['custom-class']
const props = defineProps({
  customStyle: String,
  show: {
    value: true,
    type: Boolean,
  },
  name: {
    type: String,
    value: 'fade',
  },
  duration: {
    type: Number,
    value: 300,
  },
})
attached(function () {
  if (props.show) {
    showFn()
  }
})
// Watch listeners converted from observers
watch(
  () => props.show,
  (newVal, oldVal) => {
    if (newVal) {
      showFn()
    } else {
      state.type = 'leave'
    }
  },
)
function showFn() {
  state.inited = true
  state.display = true
  state.type = 'enter'
}
function onAnimationEnd() {
  if (!props.show) {
    state.display = false
  }
}
</script>
<style scoped>
.gm-transition {
  -webkit-animation: ease both;
  animation: ease both;
}
@-webkit-keyframes gm-fade-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes gm-fade-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes gm-fade-leave {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes gm-fade-leave {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@-webkit-keyframes gm-fade-up-enter {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes gm-fade-up-enter {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
@-webkit-keyframes gm-fade-up-leave {
  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes gm-fade-up-leave {
  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
@-webkit-keyframes gm-slide-up-enter {
  from {
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes gm-slide-up-enter {
  from {
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
@-webkit-keyframes gm-slide-up-leave {
  to {
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes gm-slide-up-leave {
  to {
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
@-webkit-keyframes gm-fade-down-enter {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
@keyframes gm-fade-down-enter {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
@-webkit-keyframes gm-fade-down-leave {
  to {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
@keyframes gm-fade-down-leave {
  to {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
@-webkit-keyframes gm-slide-down-enter {
  from {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
@keyframes gm-slide-down-enter {
  from {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
@-webkit-keyframes gm-slide-down-leave {
  to {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
@keyframes gm-slide-down-leave {
  to {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
@-webkit-keyframes gm-fade-left-enter {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes gm-fade-left-enter {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
@-webkit-keyframes gm-fade-left-leave {
  to {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes gm-fade-left-leave {
  to {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
@-webkit-keyframes gm-slide-left-enter {
  from {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes gm-slide-left-enter {
  from {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
@-webkit-keyframes gm-slide-left-leave {
  to {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes gm-slide-left-leave {
  to {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
@-webkit-keyframes gm-fade-right-enter {
  from {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}
@keyframes gm-fade-right-enter {
  from {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}
@-webkit-keyframes gm-fade-right-leave {
  to {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}
@keyframes gm-fade-right-leave {
  to {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}
@-webkit-keyframes gm-slide-right-enter {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}
@keyframes gm-slide-right-enter {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}
@-webkit-keyframes gm-slide-right-leave {
  to {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}
@keyframes gm-slide-right-leave {
  to {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}
</style>
